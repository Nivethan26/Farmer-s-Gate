const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

const userController = require('../controllers/userController');

// Get all users (admin only)
router.get('/', auth, roleAuth(['admin']), userController.listUsers);

// Get user by ID
router.get('/:id', userController.getUser);

// Get all sellers
router.get('/role/sellers', userController.listSellers);

// Get all buyers
router.get('/role/buyers', userController.listBuyers);

// Update user profile
router.put('/:id', auth, userController.updateUser);

// Update user status (admin only)
router.patch('/:id/status', auth, roleAuth(['admin']), userController.updateStatus);

// Delete user (admin only)
router.delete('/:id', auth, roleAuth(['admin']), userController.deleteUser);

module.exports = router;
