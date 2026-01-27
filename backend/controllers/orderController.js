import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private/Buyer
const createOrder = asyncHandler(async (req, res) => {
  console.log('=== ORDER CREATE REQUEST ===');
  console.log('req.body:', req.body);
  console.log('req.files:', req.files);
  console.log('req.user:', { id: req.user?._id, email: req.user?.email, firstName: req.user?.firstName, lastName: req.user?.lastName });
  console.log('typeof req.body.items:', typeof req.body.items);
  console.log('req.body.items value:', req.body.items);
  
  let { items, address, deliveryFee, redeemedPoints = 0, subtotal: clientSubtotal, total: clientTotal } = req.body;
  
  console.log('Client sent subtotal:', clientSubtotal);
  console.log('Client sent total:', clientTotal);
  
  // Handle file upload
  let receiptUrl = null;
  if (req.files && req.files.length > 0) {
    console.log('File received:', req.files[0]);
    // Get the first uploaded file
    const file = req.files[0];
    // Create the URL to access the file
    receiptUrl = `/uploads/receipts/${file.filename}`;
    console.log('Receipt saved as:', receiptUrl);
  }
  
  // Parse JSON fields from FormData (when file is uploaded, all fields come as strings)
  if (typeof items === 'string') {
    console.log('Parsing items from string:', items);
    try {
      items = JSON.parse(items);
    } catch (error) {
      console.error('Failed to parse items:', error);
      res.status(400);
      throw new Error('Invalid items format');
    }
  }
  if (typeof deliveryFee === 'string') {
    deliveryFee = Number(deliveryFee);
  }
  if (typeof redeemedPoints === 'string') {
    redeemedPoints = Number(redeemedPoints);
  }
  
  console.log('Processed items:', items);
  console.log('Processed deliveryFee:', deliveryFee);
  console.log('Processed redeemedPoints:', redeemedPoints);
  console.log('Receipt URL:', receiptUrl);
  console.log('Address:', address);

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  if (!address) {
    res.status(400);
    throw new Error('Delivery address is required');
  }

  if (isNaN(deliveryFee) || deliveryFee < 0) {
    res.status(400);
    throw new Error('Invalid delivery fee');
  }

  if (!Array.isArray(items)) {
    res.status(400);
    throw new Error('Items must be an array');
  }

  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    if (!item.productId || !item.qty) {
      res.status(400);
      throw new Error('Invalid item: productId and qty are required');
    }

    const product = await Product.findById(item.productId);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    if (product.stockQty < item.qty) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    orderItems.push({
      productId: product._id,
      productName: product.name,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      qty: item.qty,
      pricePerKg: product.pricePerKg,
    });

    subtotal += item.qty * product.pricePerKg;

    // Reduce stock
    product.stockQty -= item.qty;
    await product.save();
  }

  // Points should be calculated based on amount before discount
  const totalBeforeDiscount = subtotal + deliveryFee;
  const pointsEarned = Math.floor(totalBeforeDiscount / 100); // 1 point per Rs. 100 spent
  const total = totalBeforeDiscount - redeemedPoints;

  console.log('Order calculation:', { subtotal, deliveryFee, totalBeforeDiscount, redeemedPoints, total, pointsEarned });

  // Validate buyer info
  if (!req.user.email) {
    res.status(400);
    throw new Error('User email is required');
  }

  const buyerName = req.user.firstName && req.user.lastName 
    ? `${req.user.firstName} ${req.user.lastName}`.trim()
    : req.user.name || req.user.email;

  console.log('Buyer name:', buyerName);

  const order = new Order({
    buyerId: req.user._id,
    buyerName,
    buyerEmail: req.user.email,
    address,
    items: orderItems,
    subtotal,
    deliveryFee,
    total,
    redeemedPoints,
    pointsEarned,
    receiptUrl,
  });

  console.log('Creating order:', order);

  const createdOrder = await order.save();
  
  // Handle points transactions
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      // First, deduct redeemed points if any were used
      if (redeemedPoints > 0) {
        if (user.rewardPoints < redeemedPoints) {
          // This shouldn't happen due to frontend validation, but just in case
          console.warn(`User ${user._id} tried to redeem ${redeemedPoints} points but only has ${user.rewardPoints}`);
        } else {
          user.rewardPoints -= redeemedPoints;
          console.log(`Deducted ${redeemedPoints} points from user ${user._id}`);
        }
      }
      
      // Then, add earned points
      if (pointsEarned > 0) {
        user.rewardPoints += pointsEarned;
        console.log(`Added ${pointsEarned} points to user ${user._id}`);
      }
      
      await user.save();
      console.log(`User ${user._id} final points balance: ${user.rewardPoints}`);
    }
  } catch (error) {
    console.error('Error handling reward points:', error);
    // Don't fail the order creation if points handling fails
  }
  
  res.status(201).json(createdOrder);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const status = req.query.status;

  let query = {};
  if (status) {
    query.status = status;
  }

  const count = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({
    orders,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    // Check if user is authorized to view this order
    if (
      req.user.role !== 'admin' &&
      order.buyerId.toString() !== req.user._id.toString() &&
      !order.items.some(item => item.sellerId.toString() === req.user._id.toString())
    ) {
      res.status(401);
      throw new Error('Not authorized to view this order');
    }

    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin or Seller or Buyer
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    const { status, receiptUrl } = req.body;

    // Check authorization
    if (req.user.role === 'admin') {
      // Admin can update any status
    } else if (req.user.role === 'seller') {
      // Seller can only update orders for their products
      const hasSellerProducts = order.items.some(item => item.sellerId.toString() === req.user._id.toString());
      if (!hasSellerProducts) {
        res.status(401);
        throw new Error('Not authorized to update this order');
      }
      // Sellers can only update to 'processing' or 'delivered'
      if (!['processing', 'delivered'].includes(status)) {
        res.status(400);
        throw new Error('Invalid status for seller');
      }
    } else if (req.user.role === 'buyer') {
      // Buyer can only update their own orders and only to 'paid' with receiptUrl
      if (order.buyerId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this order');
      }
      if (status !== 'paid') {
        res.status(400);
        throw new Error('Buyers can only mark orders as paid');
      }
      if (!receiptUrl) {
        res.status(400);
        throw new Error('Receipt URL is required when marking as paid');
      }
      order.receiptUrl = receiptUrl;
    } else {
      res.status(401);
      throw new Error('Not authorized');
    }

    order.status = status;

    if (status === 'paid' && !order.paidAt) {
      order.paidAt = Date.now();
    }

    if (status === 'delivered' && !order.deliveredAt) {
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get my orders (buyer)
// @route   GET /api/orders/myorders
// @access  Private/Buyer
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ buyerId: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Get orders for my products (seller)
// @route   GET /api/orders/seller
// @access  Private/Seller
const getSellerOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    'items.sellerId': req.user._id
  }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Get order stats
// @route   GET /api/orders/stats
// @access  Private/Admin
const getOrderStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ status: 'pending' });
  const paidOrders = await Order.countDocuments({ status: 'paid' });
  const processingOrders = await Order.countDocuments({ status: 'processing' });
  const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
  const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });

  const totalRevenue = await Order.aggregate([
    { $match: { status: { $in: ['paid', 'processing', 'delivered'] } } },
    { $group: { _id: null, total: { $sum: '$total' } } }
  ]);

  res.json({
    totalOrders,
    pendingOrders,
    paidOrders,
    processingOrders,
    deliveredOrders,
    cancelledOrders,
    totalRevenue: totalRevenue[0]?.total || 0,
  });
});

export {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getMyOrders,
  getSellerOrders,
  getOrderStats,
};