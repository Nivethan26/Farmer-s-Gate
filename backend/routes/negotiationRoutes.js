import express from 'express';
import {
  createNegotiation,
  getBuyerNegotiations,
  getSellerNegotiations,
  getNegotiations,
  updateNegotiation,
  acceptCounter,
  getNegotiationById,
  getNegotiationStats,
} from '../controllers/negotiationController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, authorize('admin'), getNegotiationStats);
router.get('/buyer', protect, authorize('buyer'), getBuyerNegotiations);
router.get('/seller', protect, authorize('seller'), getSellerNegotiations);

router
  .route('/')
  .get(protect, authorize('admin'), getNegotiations)
  .post(protect, authorize('buyer'), createNegotiation);

router.put('/:id/accept-counter', protect, authorize('buyer'), acceptCounter);

router
  .route('/:id')
  .get(protect, getNegotiationById)
  .put(protect, authorize('seller'), updateNegotiation);

export default router;