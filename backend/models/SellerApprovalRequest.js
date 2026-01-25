import mongoose from 'mongoose';

const sellerApprovalRequestSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending',
    index: true
  },
  
  // Snapshot of seller details at time of request
  sellerDetails: {
    name: String,
    email: String,
    phone: String,
    farmName: String,
    bank: {
      accountName: String,
      accountNo: String,
      bankName: String,
      branch: String
    },
    district: String,
    address: String
  },
  
  // Admin action details
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  rejectionReason: String,
  adminNotes: String,
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt on save
sellerApprovalRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
sellerApprovalRequestSchema.index({ sellerId: 1, status: 1 });
sellerApprovalRequestSchema.index({ createdAt: -1 });

const SellerApprovalRequest = mongoose.model('SellerApprovalRequest', sellerApprovalRequestSchema);

export default SellerApprovalRequest;
