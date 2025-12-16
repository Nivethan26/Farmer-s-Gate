import asyncHandler from 'express-async-handler';
import Negotiation from '../models/Negotiation.js';
import Product from '../models/Product.js';

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

  const negotiation = new Negotiation({
    productId: product._id,
    productName: product.name,
    buyerId: req.user._id,
    buyerName: req.user.name,
    sellerId: product.sellerId,
    sellerName: product.sellerName,
    currentPrice: product.pricePerKg,
    requestedPrice,
    notes,
  });

  const createdNegotiation = await negotiation.save();
  res.status(201).json(createdNegotiation);
});

// @desc    Get negotiations for buyer
// @route   GET /api/negotiations/buyer
// @access  Private/Buyer
const getBuyerNegotiations = asyncHandler(async (req, res) => {
  const negotiations = await Negotiation.find({ buyerId: req.user._id })
    .sort({ createdAt: -1 });
  res.json(negotiations);
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
  res.json(updatedNegotiation);
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

export {
  createNegotiation,
  getBuyerNegotiations,
  getSellerNegotiations,
  getNegotiations,
  updateNegotiation,
  acceptCounter,
  getNegotiationById,
  getNegotiationStats,
};