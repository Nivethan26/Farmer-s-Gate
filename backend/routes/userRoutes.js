import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
} from '../controllers/userController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, authorize('admin'), getUserStats);
router
  .route('/')
  .get(protect, authorize('admin'), getUsers);
router
  .route('/:id')
  .get(protect, authorize('admin'), getUserById)
  .put(protect, authorize('admin'), updateUser)
  .delete(protect, authorize('admin'), deleteUser);

export default router;