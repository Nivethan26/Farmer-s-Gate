const Product = require('../models/Product');
const Category = require('../models/Category');

// Get all products
exports.listProducts = async (req, res) => {
  try {
    const { category, supplyType, district, search } = req.query;
    
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (supplyType) {
      query.supplyType = supplyType;
    }
    
    if (district) {
      query.locationDistrict = district;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    const products = await Product.find(query)
      .populate('category')
      .populate('sellerId', 'name email phone');
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get single product by ID
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category')
      .populate('sellerId', 'name email phone');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get products by seller
exports.listBySeller = async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.params.sellerId })
      .populate('category')
      .populate('sellerId', 'name email phone');
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const { name, category, description, pricePerKg, image, stockQty, supplyType, locationDistrict, expiresOn } = req.body;
    
    // Validate category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
      });
    }
    
    const product = await Product.create({
      name,
      category,
      description,
      pricePerKg,
      image,
      stockQty,
      supplyType,
      locationDistrict,
      sellerId: req.user.id,
      expiresOn,
    });
    
    await product.populate('category');
    await product.populate('sellerId', 'name email phone');
    
    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }
    
    // Check if user is the seller
    if (product.sellerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this product',
      });
    }
    
    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate('category')
      .populate('sellerId', 'name email phone');
    
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }
    
    // Check if user is the seller
    if (product.sellerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this product',
      });
    }
    
    await Product.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
