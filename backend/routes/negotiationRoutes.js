import express from 'express';
import {
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
} from '../controllers/negotiationController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, authorize('admin'), getNegotiationStats);
router.get('/buyer', protect, authorize('buyer'), getBuyerNegotiations);
router.get('/seller', protect, authorize('seller'), getSellerNegotiations);
router.get('/agent', protect, authorize('agent'), getAgentNegotiations);

router
  .route('/')
  .get(protect, authorize('admin'), getNegotiations)
  .post(protect, authorize('buyer'), createNegotiation);

router.put('/:id/accept-counter', protect, authorize('buyer'), acceptCounter);
router.put('/:id/buyer-update', protect, authorize('buyer'), updateBuyerNegotiation);
router.put('/:id/agent-note', protect, authorize('agent'), addAgentNote);
router.put('/:id/mark-connected', protect, authorize('agent'), markAsConnected);
router.put('/:id/escalate', protect, authorize('agent'), escalateNegotiation);

router
  .route('/:id')
  .get(protect, getNegotiationById)
  .put(protect, authorize('seller'), updateNegotiation);

export default router;