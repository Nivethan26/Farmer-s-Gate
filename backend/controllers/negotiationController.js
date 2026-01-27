import asyncHandler from 'express-async-handler';
import Negotiation from '../models/Negotiation.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { createNegotiationNotification } from './notificationController.js';

// @desc    Create negotiation
// @route   POST /api/negotiations
// @access  Private/Buyer
const createNegotiation = asyncHandler(async (req, res) => {
  const { productId, requestedPrice, notes } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (!product.negotiationEnabled) {
    res.status(400);
    throw new Error('Negotiation not enabled for this product');
  }

  // Check if negotiation already exists
  const existingNegotiation = await Negotiation.findOne({
    productId,
    buyerId: req.user._id,
    status: { $in: ['open', 'countered'] }
  });

  if (existingNegotiation) {
    res.status(400);
    throw new Error('You already have an active negotiation for this product');
  }

  // Get buyer name based on role
  const buyerName = req.user.role === 'buyer' 
    ? `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email
    : req.user.name;

  const negotiation = new Negotiation({
    productId: product._id,
    productName: product.name,
    buyerId: req.user._id,
    buyerName,
    sellerId: product.sellerId,
    sellerName: product.sellerName,
    currentPrice: product.pricePerKg,
    requestedPrice,
    notes,
  });

  const createdNegotiation = await negotiation.save();

  // Create notification for buyer
  try {
    await createNegotiationNotification(req.user._id, {
      id: createdNegotiation._id,
      productName: product.name,
      productId: product._id
    }, 'created');
  } catch (notificationError) {
    console.error('Failed to create buyer notification:', notificationError);
  }

  // Create notification for seller
  try {
    await createNegotiationNotification(product.sellerId, {
      id: createdNegotiation._id,
      productName: product.name,
      productId: product._id,
      buyerName,
      requestedPrice
    }, 'new_request');
  } catch (notificationError) {
    console.error('Failed to create seller notification:', notificationError);
  }

  res.status(201).json(createdNegotiation);
});

// @desc    Get negotiations for buyer
// @route   GET /api/negotiations/buyer
// @access  Private/Buyer
const getBuyerNegotiations = asyncHandler(async (req, res) => {
  const negotiations = await Negotiation.find({ buyerId: req.user._id })
    .sort({ createdAt: -1 });
  
  console.log(`Found ${negotiations.length} negotiations for buyer ${req.user._id}`);
  
  // Populate product district information for each negotiation
  const negotiationsWithDistrict = await Promise.all(
    negotiations.map(async (negotiation) => {
      const product = await Product.findById(negotiation.productId).select('locationDistrict');
      console.log(`Negotiation ${negotiation._id} - Product locationDistrict: ${product?.locationDistrict}`);
      return {
        ...negotiation.toObject(),
        productDistrict: product?.locationDistrict || null
      };
    })
  );
  
  console.log('Sending negotiations with districts:', negotiationsWithDistrict.map(n => ({
    id: n._id,
    status: n.status,
    productDistrict: n.productDistrict
  })));
  
  res.json(negotiationsWithDistrict);
});

// @desc    Get negotiations for seller
// @route   GET /api/negotiations/seller
// @access  Private/Seller
const getSellerNegotiations = asyncHandler(async (req, res) => {
  const negotiations = await Negotiation.find({ sellerId: req.user._id })
    .sort({ createdAt: -1 });
  res.json(negotiations);
});

// @desc    Get all negotiations
// @route   GET /api/negotiations
// @access  Private/Admin
const getNegotiations = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const status = req.query.status;

  let query = {};
  if (status) {
    query.status = status;
  }

  const count = await Negotiation.countDocuments(query);
  const negotiations = await Negotiation.find(query)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({
    negotiations,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Update negotiation (counter or accept/reject)
// @route   PUT /api/negotiations/:id
// @access  Private/Seller
const updateNegotiation = asyncHandler(async (req, res) => {
  const negotiation = await Negotiation.findById(req.params.id);

  if (!negotiation) {
    res.status(404);
    throw new Error('Negotiation not found');
  }

  if (negotiation.sellerId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this negotiation');
  }

  const { status, counterPrice, counterNotes, agreedPrice } = req.body;

  negotiation.status = status;

  if (status === 'countered') {
    negotiation.counterPrice = counterPrice;
    negotiation.counterNotes = counterNotes;
  } else if (status === 'agreed') {
    negotiation.agreedPrice = agreedPrice || negotiation.requestedPrice;
  }

  const updatedNegotiation = await negotiation.save();

  // Notify buyer about seller's action
  try {
    let notificationType = 'countered';
    if (status === 'agreed') notificationType = 'accepted';
    if (status === 'rejected') notificationType = 'rejected';
    
    await createNegotiationNotification(negotiation.buyerId, {
      id: updatedNegotiation._id,
      productName: negotiation.productName,
      productId: negotiation.productId,
      counterPrice,
      agreedPrice
    }, notificationType);
  } catch (notificationError) {
    console.error('Failed to create buyer notification:', notificationError);
  }

  res.json(updatedNegotiation);
});

// @desc    Accept counter offer
// @route   PUT /api/negotiations/:id/accept-counter
// @access  Private/Buyer
const acceptCounter = asyncHandler(async (req, res) => {
  const negotiation = await Negotiation.findById(req.params.id);

  if (!negotiation) {
    res.status(404);
    throw new Error('Negotiation not found');
  }

  if (negotiation.buyerId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this negotiation');
  }

  if (negotiation.status !== 'countered') {
    res.status(400);
    throw new Error('No counter offer to accept');
  }

  negotiation.status = 'agreed';
  negotiation.agreedPrice = negotiation.counterPrice;

  const updatedNegotiation = await negotiation.save();

  // Notify seller that buyer accepted counter offer
  try {
    await createNegotiationNotification(negotiation.sellerId, {
      id: updatedNegotiation._id,
      productName: negotiation.productName,
      productId: negotiation.productId,
      buyerName: negotiation.buyerName,
      agreedPrice: negotiation.agreedPrice
    }, 'buyer_accepted');
  } catch (notificationError) {
    console.error('Failed to create seller notification:', notificationError);
  }

  res.json(updatedNegotiation);
});

// @desc    Update negotiation request (Buyer resubmit)
// @route   PUT /api/negotiations/:id/buyer-update
// @access  Private/Buyer
const updateBuyerNegotiation = asyncHandler(async (req, res) => {
  const negotiation = await Negotiation.findById(req.params.id);

  if (!negotiation) {
    res.status(404);
    throw new Error('Negotiation not found');
  }

  if (negotiation.buyerId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this negotiation');
  }

  // Can only update if countered or rejected
  if (negotiation.status !== 'countered' && negotiation.status !== 'rejected') {
    res.status(400);
    throw new Error('Can only update countered or rejected negotiations');
  }

  const { requestedPrice, notes } = req.body;

  if (requestedPrice) {
    negotiation.requestedPrice = requestedPrice;
  }
  
  if (notes) {
    negotiation.notes = notes;
  }

  // Reset status to 'open' and clear counter/reject info
  negotiation.status = 'open';
  negotiation.counterPrice = undefined;
  negotiation.counterNotes = undefined;

  const updatedNegotiation = await negotiation.save();

  // Get product info
  const product = await Product.findById(negotiation.productId);

  // Notify seller about updated negotiation request
  try {
    await createNegotiationNotification(negotiation.sellerId, {
      id: updatedNegotiation._id,
      productName: negotiation.productName,
      productId: negotiation.productId,
      buyerName: negotiation.buyerName,
      requestedPrice: updatedNegotiation.requestedPrice
    }, 'new_request');
  } catch (notificationError) {
    console.error('Failed to create seller notification:', notificationError);
  }

  // Add product district to response
  const responseData = {
    ...updatedNegotiation.toObject(),
    productDistrict: product?.locationDistrict || null
  };

  res.json(responseData);
});

// @desc    Get negotiation by ID
// @route   GET /api/negotiations/:id
// @access  Private
const getNegotiationById = asyncHandler(async (req, res) => {
  const negotiation = await Negotiation.findById(req.params.id);

  if (negotiation) {
    // Check authorization
    if (
      req.user.role !== 'admin' &&
      negotiation.buyerId.toString() !== req.user._id.toString() &&
      negotiation.sellerId.toString() !== req.user._id.toString()
    ) {
      res.status(401);
      throw new Error('Not authorized to view this negotiation');
    }

    res.json(negotiation);
  } else {
    res.status(404);
    throw new Error('Negotiation not found');
  }
});

// @desc    Get negotiation stats
// @route   GET /api/negotiations/stats
// @access  Private/Admin
const getNegotiationStats = asyncHandler(async (req, res) => {
  const totalNegotiations = await Negotiation.countDocuments();
  const openNegotiations = await Negotiation.countDocuments({ status: 'open' });
  const counteredNegotiations = await Negotiation.countDocuments({ status: 'countered' });
  const agreedNegotiations = await Negotiation.countDocuments({ status: 'agreed' });
  const rejectedNegotiations = await Negotiation.countDocuments({ status: 'rejected' });

  res.json({
    totalNegotiations,
    openNegotiations,
    counteredNegotiations,
    agreedNegotiations,
    rejectedNegotiations,
  });
});

// @desc    Get negotiations for agent's region
// @route   GET /api/negotiations/agent
// @access  Private/Agent
const getAgentNegotiations = asyncHandler(async (req, res) => {
  // Get agent's assigned district
  const agentDistrict = req.user.district;
  
  console.log('Agent requesting negotiations');
  console.log('Agent ID:', req.user._id);
  console.log('Agent district:', agentDistrict);
  
  if (!agentDistrict) {
    console.log('No district assigned to agent');
    return res.json([]);
  }

  // Find all sellers in agent's district (case-insensitive)
  const sellersInDistrict = await User.find({ 
    role: 'seller',
    district: { $regex: new RegExp(`^${agentDistrict}$`, 'i') },
    isDeleted: { $ne: true }
  }).select('_id');

  console.log(`Found ${sellersInDistrict.length} sellers in district: ${agentDistrict}`);

  const sellerIds = sellersInDistrict.map(seller => seller._id.toString());

  // Get negotiations for those sellers
  const negotiations = await Negotiation.find({ 
    sellerId: { $in: sellerIds }
  }).sort({ createdAt: -1 });

  console.log(`Found ${negotiations.length} negotiations for sellers in district`);

  // Populate seller and buyer details
  const enrichedNegotiations = await Promise.all(
    negotiations.map(async (negotiation) => {
      const seller = await User.findById(negotiation.sellerId).select('name phone district email farmName');
      const buyer = await User.findById(negotiation.buyerId).select('firstName lastName phone district email');
      
      return {
        ...negotiation.toObject(),
        id: negotiation._id,
        sellerDetails: seller ? {
          name: seller.name,
          phone: seller.phone,
          district: seller.district,
          email: seller.email,
          farmName: seller.farmName
        } : null,
        buyerDetails: buyer ? {
          name: buyer.firstName && buyer.lastName ? `${buyer.firstName} ${buyer.lastName}` : buyer.email,
          phone: buyer.phone,
          district: buyer.district,
          email: buyer.email
        } : null
      };
    })
  );

  console.log(`Returning ${enrichedNegotiations.length} enriched negotiations`);
  res.json(enrichedNegotiations);
});

// @desc    Add agent note to negotiation
// @route   PUT /api/negotiations/:id/agent-note
// @access  Private/Agent
const addAgentNote = asyncHandler(async (req, res) => {
  const { note } = req.body;

  if (!note || !note.trim()) {
    res.status(400);
    throw new Error('Note is required');
  }

  const negotiation = await Negotiation.findById(req.params.id);

  if (!negotiation) {
    res.status(404);
    throw new Error('Negotiation not found');
  }

  // Verify seller is in agent's district
  const seller = await User.findById(negotiation.sellerId);
  if (!seller || seller.district !== req.user.district) {
    res.status(401);
    throw new Error('Not authorized to access this negotiation');
  }

  negotiation.agentNotes = note;
  const updatedNegotiation = await negotiation.save();

  res.json(updatedNegotiation);
});

// @desc    Mark negotiation as connected
// @route   PUT /api/negotiations/:id/mark-connected
// @access  Private/Agent
const markAsConnected = asyncHandler(async (req, res) => {
  const negotiation = await Negotiation.findById(req.params.id);

  if (!negotiation) {
    res.status(404);
    throw new Error('Negotiation not found');
  }

  // Verify seller is in agent's district
  const seller = await User.findById(negotiation.sellerId);
  if (!seller || seller.district !== req.user.district) {
    res.status(401);
    throw new Error('Not authorized to access this negotiation');
  }

  negotiation.agentConnected = true;
  const updatedNegotiation = await negotiation.save();

  res.json(updatedNegotiation);
});

// @desc    Escalate negotiation to admin
// @route   PUT /api/negotiations/:id/escalate
// @access  Private/Agent
const escalateNegotiation = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const negotiation = await Negotiation.findById(req.params.id);

  if (!negotiation) {
    res.status(404);
    throw new Error('Negotiation not found');
  }

  // Verify seller is in agent's district
  const seller = await User.findById(negotiation.sellerId);
  if (!seller || seller.district !== req.user.district) {
    res.status(401);
    throw new Error('Not authorized to access this negotiation');
  }

  negotiation.escalatedToAdmin = true;
  negotiation.escalationReason = reason || 'Requires admin attention';
  negotiation.escalatedAt = Date.now();
  negotiation.escalatedBy = req.user._id.toString();

  const updatedNegotiation = await negotiation.save();

  // Create notification for admin
  try {
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await createNegotiationNotification(admin._id, {
        id: updatedNegotiation._id,
        productName: negotiation.productName,
        productId: negotiation.productId,
        agentName: req.user.name,
        reason
      }, 'escalated');
    }
  } catch (notificationError) {
    console.error('Failed to create admin notification:', notificationError);
  }

  res.json(updatedNegotiation);
});

export {
  createNegotiation,
  getBuyerNegotiations,
  getSellerNegotiations,
  getNegotiations,
  updateNegotiation,
  acceptCounter,
  updateBuyerNegotiation,
  getNegotiationById,
  getNegotiationStats,
  getAgentNegotiations,
  addAgentNote,
  markAsConnected,
  escalateNegotiation,
};