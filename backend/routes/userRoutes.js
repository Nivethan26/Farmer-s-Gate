import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
  addRewardPoints,
  redeemRewardPoints,
  toggleSellerStatus,
} from '../controllers/userController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, authorize('admin'), getUserStats);
router
  .route('/')
  .get(protect, authorize('admin'), getUsers);

router.put('/:id/add-points', protect, authorize('admin'), addRewardPoints);
router.put('/:id/redeem-points', protect, redeemRewardPoints);
router.patch('/:id/toggle-status', protect, authorize('admin'), toggleSellerStatus);

router
  .route('/:id')
  .get(protect, authorize('admin'), getUserById)
  .put(protect, authorize('admin'), updateUser)
  .delete(protect, authorize('admin'), deleteUser);

export default router;