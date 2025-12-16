import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['buyer', 'seller', 'agent', 'admin'],
    required: true
  },
  name: {
    type: String,
    required: true
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
    enum: ['active', 'pending', 'inactive'],
    default: 'active'
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
