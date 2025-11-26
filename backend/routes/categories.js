const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

const categoryController = require('../controllers/categoryController');

// Get all categories
router.get('/', categoryController.listCategories);

// Get category by ID
router.get('/:id', categoryController.getCategory);

// Create category (admin only)
router.post('/', auth, roleAuth(['admin']), categoryController.createCategory);

// Update category (admin only)
router.put('/:id', auth, roleAuth(['admin']), categoryController.updateCategory);

// Delete category (admin only)
router.delete('/:id', auth, roleAuth(['admin']), categoryController.deleteCategory);

module.exports = router;
