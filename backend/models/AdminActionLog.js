import mongoose from 'mongoose';

const adminActionLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  actionType: {
    type: String,
    enum: [
      'approve_seller',
      'reject_seller',
      'activate_user',
      'deactivate_user',
      'delete_user',
      'update_user',
      'approve_product',
      'reject_product'
    ],
    required: true,
    index: true
  },
  targetUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  targetUserEmail: String,
  
  // Flexible field for action-specific data
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Request metadata
  ipAddress: String,
  userAgent: String,
  
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Index for efficient audit queries
adminActionLogSchema.index({ createdAt: -1 });
adminActionLogSchema.index({ adminId: 1, createdAt: -1 });
adminActionLogSchema.index({ actionType: 1, createdAt: -1 });

const AdminActionLog = mongoose.model('AdminActionLog', adminActionLogSchema);

export default AdminActionLog;
