import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private/Buyer
const createOrder = asyncHandler(async (req, res) => {
  const { items, address, deliveryFee } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
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

  const total = subtotal + deliveryFee;

  const order = new Order({
    buyerId: req.user._id,
    buyerName: req.user.name,
    buyerEmail: req.user.email,
    address,
    items: orderItems,
    subtotal,
    deliveryFee,
    total,
  });

  const createdOrder = await order.save();
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
// @access  Private/Admin or Seller
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    const { status } = req.body;

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