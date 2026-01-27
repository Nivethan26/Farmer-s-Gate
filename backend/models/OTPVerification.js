import mongoose from 'mongoose';

const otpVerificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    index: true
  },
  otp: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    enum: ['registration', 'password_reset', 'email_change'],
    default: 'registration'
  },
  attempts: {
    type: Number,
    default: 0
  },
  maxAttempts: {
    type: Number,
    default: 5
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  },
  lastSentAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600 // Auto-delete after 1 hour
  }
});

// Index for efficient cleanup
otpVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Check if OTP is valid
otpVerificationSchema.methods.isValid = function() {
  return !this.isUsed && 
         this.attempts < this.maxAttempts && 
         this.expiresAt > new Date();
};

// Increment attempts
otpVerificationSchema.methods.incrementAttempts = async function() {
  this.attempts += 1;
  if (this.attempts >= this.maxAttempts) {
    this.isUsed = true;
  }
  await this.save();
};

const OTPVerification = mongoose.model('OTPVerification', otpVerificationSchema);

export default OTPVerification;
