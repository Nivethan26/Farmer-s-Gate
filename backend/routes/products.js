const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

const productController = require('../controllers/productController');

// Get all products
router.get('/', productController.listProducts);

// Get product by ID
router.get('/:id', productController.getProduct);

// Get products by seller
router.get('/seller/:sellerId', productController.listBySeller);

// Create product (seller only)
router.post('/', auth, roleAuth(['seller']), productController.createProduct);

// Update product (seller only)
router.put('/:id', auth, roleAuth(['seller']), productController.updateProduct);

// Delete product (seller only)
router.delete('/:id', auth, roleAuth(['seller']), productController.deleteProduct);

module.exports = router;
