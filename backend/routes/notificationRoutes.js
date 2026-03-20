import express from 'express';
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotificationHandler,
  clearAllNotifications,
} from '../controllers/notificationController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getUserNotifications)
  .post(protect, createNotificationHandler);

router
  .route('/read-all')
  .put(protect, markAllAsRead);

router
  .route('/clear-all')
  .delete(protect, clearAllNotifications);

router
  .route('/:id/read')
  .put(protect, markAsRead);

router
  .route('/:id')
  .delete(protect, deleteNotification);

export default router;