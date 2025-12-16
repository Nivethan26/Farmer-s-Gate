import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 12;
  const page = Number(req.query.pageNumber) || 1;
  const category = req.query.category;
  const district = req.query.district;
  const supplyType = req.query.supplyType;
  const search = req.query.search;

  let query = {};

  if (category) {
    query.category = category;
  }

  if (district) {
    query.locationDistrict = district;
  }

  if (supplyType) {
    query.supplyType = supplyType;
  }

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  const count = await Product.countDocuments(query);
  const products = await Product.find(query)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Seller
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    pricePerKg,
    supplyType,
    locationDistrict,
    image,
    stockQty,
    description,
    negotiationEnabled,
    expiresOn,
  } = req.body;

  const product = new Product({
    name,
    category,
    pricePerKg,
    supplyType,
    locationDistrict,
    image,
    stockQty,
    sellerId: req.user._id,
    sellerName: req.user.name,
    description,
    negotiationEnabled: negotiationEnabled || false,
    expiresOn,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Seller
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    if (product.sellerId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update this product');
    }

    product.name = req.body.name || product.name;
    product.category = req.body.category || product.category;
    product.pricePerKg = req.body.pricePerKg || product.pricePerKg;
    product.supplyType = req.body.supplyType || product.supplyType;
    product.locationDistrict = req.body.locationDistrict || product.locationDistrict;
    product.image = req.body.image || product.image;
    product.stockQty = req.body.stockQty || product.stockQty;
    product.description = req.body.description || product.description;
    product.negotiationEnabled = req.body.negotiationEnabled !== undefined ? req.body.negotiationEnabled : product.negotiationEnabled;
    product.expiresOn = req.body.expiresOn || product.expiresOn;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Seller
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    if (product.sellerId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to delete this product');
    }

    await Product.deleteOne({ _id: req.params.id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get products by seller
// @route   GET /api/products/seller/:sellerId
// @access  Public
const getProductsBySeller = asyncHandler(async (req, res) => {
  const products = await Product.find({ sellerId: req.params.sellerId }).sort({ createdAt: -1 });
  res.json(products);
});

// @desc    Get my products
// @route   GET /api/products/myproducts
// @access  Private/Seller
const getMyProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ sellerId: req.user._id }).sort({ createdAt: -1 });
  res.json(products);
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsBySeller,
  getMyProducts,
};