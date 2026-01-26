import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

// @desc    Create notification (HTTP handler)
// @route   POST /api/notifications
// @access  Private
const createNotificationHandler = asyncHandler(async (req, res) => {
  let { userId, ...notificationData } = req.body;
  
  console.log('Notification creation request - Original userId:', userId, 'Type:', typeof userId);
  
  // Handle different types of userIds
  if (typeof userId === 'string') {
    // If userId is a string like "seller-4", find the actual ObjectId
    if (userId.startsWith('seller-')) {
      // Create a mapping for the demo sellers
      const sellerIdMap = {
        'seller-1': 'Nimal Perera',
        'seller-2': 'Kamal Silva', 
        'seller-3': 'Sunil Fernando',
        'seller-4': 'Ranjith Kumar',
        'seller-5': 'Anura Dissanayake'
      };
      
      const sellerName = sellerIdMap[userId];
      if (sellerName) {
        // Try multiple search strategies to find the seller
        let seller = await User.findOne({ 
          role: 'seller', 
          $or: [
            { name: sellerName },
            { firstName: sellerName.split(' ')[0], lastName: sellerName.split(' ')[1] }
          ]
        });

        // If not found by name, try by email pattern
        if (!seller) {
          const emailPattern = sellerName.toLowerCase().split(' ')[0] + '@';
          seller = await User.findOne({ 
            role: 'seller',
            email: { $regex: emailPattern, $options: 'i' }
          });
        }

        // If still not found, try to find any seller and use them (for demo purposes)
        if (!seller) {
          console.warn(`Seller ${sellerName} not found, trying to find any seller...`);
          seller = await User.findOne({ role: 'seller' });
          if (seller) {
            console.warn(`Using fallback seller: ${seller.name || seller.firstName} ${seller.lastName || ''} (${seller._id})`);
          }
        }
        
        if (seller) {
          userId = seller._id;
          console.log(`Mapped ${req.body.userId} to user ${seller._id} (${seller.name || seller.firstName} ${seller.lastName || ''})`);
        } else {
          console.error(`No seller found for ${sellerName} (${userId})`);
          res.status(400);
          throw new Error(`Seller with ID ${userId} not found`);
        }
      } else {
        console.warn(`Unknown sellerId mapping: ${userId}`);
        res.status(400);
        throw new Error(`Unknown seller ID ${userId}`);
      }
    } else {
      // If it's a string but not seller-*, it might be a MongoDB ObjectId string
      try {
        // Verify it's a valid ObjectId string and convert
        if (mongoose.Types.ObjectId.isValid(userId)) {
          userId = new mongoose.Types.ObjectId(userId);
          console.log(`Converted string ObjectId to proper ObjectId:`, userId);
        } else {
          throw new Error(`Invalid ObjectId string: ${userId}`);
        }
      } catch (error) {
        console.error(`Failed to convert userId ${userId} to ObjectId:`, error.message);
        res.status(400);
        throw new Error(`Invalid user ID format: ${userId}`);
      }
    }
  }
  // If userId is already an ObjectId, use it as-is
  
  const completeNotificationData = {
    ...notificationData,
    userId,
    createdAt: new Date()
  };
  
  console.log('Creating notification with data:', {
    userId: completeNotificationData.userId,
    type: completeNotificationData.type,
    title: completeNotificationData.title
  });
  
  const notification = await createNotification(completeNotificationData);
  console.log('Notification created successfully:', notification._id);
  res.status(201).json(notification);
});

// @desc    Create notification (internal function)
// @route   POST /api/notifications
// @access  Private
const createNotification = async (notificationData) => {
  try {
    const notification = new Notification(notificationData);
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getUserNotifications = asyncHandler(async (req, res) => {
  try {
    console.log('getUserNotifications called for user:', req.user._id);
    console.log('Query params:', req.query);
    
    const { page = 1, limit = 10, isRead } = req.query;
    
    let filter = { userId: req.user._id };
    if (isRead !== undefined) {
      filter.isRead = isRead === 'true';
    }

    console.log('Filter:', filter);

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({ 
      userId: req.user._id, 
      isRead: false 
    });

    console.log(`Found ${notifications.length} notifications, total: ${total}, unread: ${unreadCount}`);

    res.json({
      notifications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      unreadCount
    });
  } catch (error) {
    console.error('getUserNotifications error:', error);
    res.status(500).json({ error: 'Failed to get notifications', details: error.message });
  }
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  console.log(`Marking notification as read: ${req.params.id} for user: ${req.user._id}`);
  
  const notification = await Notification.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!notification) {
    console.log(`Notification not found: ${req.params.id} for user: ${req.user._id}`);
    res.status(404);
    throw new Error('Notification not found');
  }

  console.log(`Notification before update - isRead: ${notification.isRead}`);
  notification.isRead = true;
  notification.readAt = new Date();
  await notification.save();
  console.log(`Notification after update - isRead: ${notification.isRead}`);

  res.json({ message: 'Notification marked as read' });
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { userId: req.user._id, isRead: false },
    { isRead: true, readAt: new Date() }
  );

  res.json({ message: 'All notifications marked as read' });
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  await notification.deleteOne();
  res.json({ message: 'Notification deleted' });
});

// @desc    Clear all notifications
// @route   DELETE /api/notifications/clear-all
// @access  Private
const clearAllNotifications = asyncHandler(async (req, res) => {
  await Notification.deleteMany({ userId: req.user._id });
  res.json({ message: 'All notifications cleared' });
});

// Helper function to create negotiation notifications
const createNegotiationNotification = async (userId, negotiationData, type = 'created') => {
  const notificationMessages = {
    created: {
      title: 'Negotiation Request Submitted',
      message: `Your negotiation request for "${negotiationData.productName}" has been submitted successfully.`
    },
    new_request: {
      title: 'New Negotiation Request',
      message: `${negotiationData.buyerName} requested a negotiation for "${negotiationData.productName}" at LKR ${negotiationData.requestedPrice}/kg.`
    },
    countered: {
      title: 'Counter Offer Received',
      message: `The seller has made a counter offer for "${negotiationData.productName}".`
    },
    accepted: {
      title: 'Negotiation Accepted',
      message: `Your negotiation for "${negotiationData.productName}" has been accepted!`
    },
    rejected: {
      title: 'Negotiation Rejected',
      message: `Your negotiation for "${negotiationData.productName}" has been rejected.`
    },
    buyer_accepted: {
      title: 'Counter Offer Accepted',
      message: `${negotiationData.buyerName} accepted your counter offer for "${negotiationData.productName}" at LKR ${negotiationData.agreedPrice}/kg!`
    }
  };

  const notification = notificationMessages[type];
  
  return await createNotification({
    userId,
    type: 'negotiation',
    title: notification.title,
    message: notification.message,
    data: {
      negotiationId: negotiationData.id || negotiationData._id,
      productId: negotiationData.productId,
      actionUrl: '/dashboard?tab=negotiations'
    },
    priority: (type === 'accepted' || type === 'new_request' || type === 'buyer_accepted') ? 'high' : 'medium'
  });
};

export {
  createNotification,
  createNotificationHandler,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  createNegotiationNotification
};