import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  publicId: {
    type: String,
    unique: true,
    index: true,
    sparse: true
  },
  role: {
    type: String,
    enum: ['buyer', 'seller', 'agent', 'admin'],
    required: true
  },
  name: {
    type: String,
    required: function() {
      // Name is only required for non-buyer roles
      return this.role !== 'buyer';
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['unverified', 'otp_verified', 'pending', 'active', 'inactive', 'rejected'],
    default: function() {
      return this.role === 'seller' ? 'unverified' : 'active';
    }
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  },
  deletedAt: Date,
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  // Buyer specific fields
  firstName: String,
  lastName: String,
  nic: String,
  district: String,
  address: String,
  preferredCategories: [String],

  // Seller specific fields
  farmName: String,
  bank: {
    accountName: String,
    accountNo: String,
    bankName: String,
    branch: String
  },

  // Agent specific fields
  regions: [String],
  officeContact: String,

  // Admin specific fields
  permissions: [String],

  // Reward points for buyers
  rewardPoints: {
    type: Number,
    default: 0
  },

  // Admin action tracking for sellers
  rejectionReason: String,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectedAt: Date,

  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update updatedAt on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
