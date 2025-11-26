const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

const orderController = require('../controllers/orderController');

// Get all orders (admin only)
router.get('/', auth, roleAuth(['admin']), orderController.listOrders);

// Get orders for current buyer
router.get('/buyer/my-orders', auth, roleAuth(['buyer']), orderController.listBuyerOrders);

// Get order by ID
router.get('/:id', auth, orderController.getOrder);

// Create order (buyer only)
router.post('/', auth, roleAuth(['buyer']), orderController.createOrder);

// Update order status (admin only)
router.patch('/:id/status', auth, roleAuth(['admin']), orderController.updateOrderStatus);

// Mark order as paid
router.patch('/:id/pay', auth, roleAuth(['buyer']), orderController.markPaid);

// Delete order
router.delete('/:id', auth, orderController.deleteOrder);

module.exports = router;
