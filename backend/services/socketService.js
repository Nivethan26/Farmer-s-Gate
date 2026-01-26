import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

let io;

// Map to store user socket connections: userId -> Set of socket IDs
const userSockets = new Map();

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from database
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      // Attach user to socket
      socket.userId = user._id.toString();
      socket.userRole = user.role;
      
      next();
    } catch (error) {
      console.error('Socket authentication error:', error.message);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    
    console.log(`✅ User connected: ${userId} (${socket.userRole}) - Socket: ${socket.id}`);
    
    // Store socket connection
    if (!userSockets.has(userId)) {
      userSockets.set(userId, new Set());
    }
    userSockets.get(userId).add(socket.id);
    
    // Join user-specific room
    socket.join(`user:${userId}`);
    
    // Join role-specific rooms
    if (socket.userRole === 'admin') {
      socket.join('admins');
    } else if (socket.userRole === 'seller') {
      socket.join('sellers');
    } else if (socket.userRole === 'buyer') {
      socket.join('buyers');
    }

    // Handle client ping for connection keep-alive
    socket.on('ping', () => {
      socket.emit('pong');
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${userId} - Socket: ${socket.id}`);
      
      // Remove socket from user's set
      const sockets = userSockets.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          userSockets.delete(userId);
        }
      }
    });
  });

  console.log('✅ Socket.IO initialized');
  return io;
};

// Get Socket.IO instance
export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized!');
  }
  return io;
};

// Emit notification to specific user
export const emitNotificationToUser = (userId, notification) => {
  if (!io) {
    console.warn('Socket.IO not initialized, skipping notification emit');
    return;
  }

  const userIdStr = userId.toString();
  
  // Emit to user's room
  io.to(`user:${userIdStr}`).emit('notification:new', notification);
  
  console.log(`📨 Notification emitted to user: ${userIdStr}`);
};

// Emit notification to all admins
export const emitNotificationToAdmins = (notification) => {
  if (!io) {
    console.warn('Socket.IO not initialized, skipping notification emit');
    return;
  }

  io.to('admins').emit('notification:new', notification);
  console.log('📨 Notification emitted to all admins');
};

// Emit notification to all sellers
export const emitNotificationToSellers = (notification) => {
  if (!io) {
    console.warn('Socket.IO not initialized, skipping notification emit');
    return;
  }

  io.to('sellers').emit('notification:new', notification);
  console.log('📨 Notification emitted to all sellers');
};

// Emit notification to all buyers
export const emitNotificationToBuyers = (notification) => {
  if (!io) {
    console.warn('Socket.IO not initialized, skipping notification emit');
    return;
  }

  io.to('buyers').emit('notification:new', notification);
  console.log('📨 Notification emitted to all buyers');
};

// Get connected users count
export const getConnectedUsersCount = () => {
  return userSockets.size;
};

// Check if user is connected
export const isUserConnected = (userId) => {
  return userSockets.has(userId.toString());
};

export default {
  initializeSocket,
  getIO,
  emitNotificationToUser,
  emitNotificationToAdmins,
  emitNotificationToSellers,
  emitNotificationToBuyers,
  getConnectedUsersCount,
  isUserConnected
};
