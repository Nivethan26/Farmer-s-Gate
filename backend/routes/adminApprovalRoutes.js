import express from 'express';
import {
  getPendingSellerRequests,
  approveSeller,
  rejectSeller
} from '../controllers/sellerApprovalController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes are protected and admin-only
router.use(protect, authorize('admin'));

// Get pending seller requests
router.get('/sellers/pending', getPendingSellerRequests);

// Approve seller
router.post('/sellers/approve/:requestId', approveSeller);

// Reject seller
router.post('/sellers/reject/:requestId', rejectSeller);

export default router;
