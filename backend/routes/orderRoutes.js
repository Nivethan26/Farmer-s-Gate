import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getMyOrders,
  getSellerOrders,
  getOrderStats,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { uploadReceipt } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/stats', protect, authorize('admin'), getOrderStats);
router.get('/myorders', protect, authorize('buyer'), getMyOrders);
router.get('/seller', protect, authorize('seller'), getSellerOrders);

router
  .route('/')
  .get(protect, authorize('admin'), getOrders)
  .post(protect, authorize('buyer'), uploadReceipt, createOrder);

router.put('/:id/status', protect, updateOrderStatus);

router.get('/:id', protect, getOrderById);

export default router;