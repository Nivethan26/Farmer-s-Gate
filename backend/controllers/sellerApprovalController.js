import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import OTPVerification from '../models/OTPVerification.js';
import SellerApprovalRequest from '../models/SellerApprovalRequest.js';
import AdminActionLog from '../models/AdminActionLog.js';
import { generateToken } from '../utils/jwt.js';
import { generateOTP } from '../utils/otp.js';
import { 
  sendOTPEmail, 
  sendRegistrationPendingEmail,
  sendSellerApprovedEmail,
  sendSellerRejectedEmail
} from '../services/emailService.js';

// @desc    Register seller with OTP verification
// @route   POST /api/auth/register/seller
// @access  Public
const registerSeller = asyncHandler(async (req, res) => {
  const { name, email, password, phone, farmName, bank, district, address } = req.body;

  // Validation
  if (!name || !email || !password || !phone || !farmName || !district || !address) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Check if user exists
  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    res.status(400);
    throw new Error('Email already registered. Please login or use a different email.');
  }

  // Create seller user with 'unverified' status
  const user = await User.create({
    role: 'seller',
    name,
    email: email.toLowerCase(),
    password,
    phone,
    farmName,
    bank,
    district,
    address,
    status: 'unverified',
    isEmailVerified: false
  });

  // Generate and send OTP
  const otp = generateOTP();
  console.log("Generated OTP for debugging:", otp);
  const otpHash = await bcrypt.hash(otp, 10);
  
  // Store OTP in database
  await OTPVerification.create({
    userId: user._id,
    email: user.email,
    otp: otpHash,
    purpose: 'registration',
    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  });

  // Send OTP email
  const emailResult = await sendOTPEmail(user.email, otp, user.name);
  
  // Email is required in production - fail if not sent
  if (!emailResult.success) {
    // Rollback user creation if email fails
    await User.findByIdAndDelete(user._id);
    await OTPVerification.deleteMany({ userId: user._id });
    res.status(500);
    throw new Error('Failed to send verification email. Please check your email configuration and try again.');
  }

  res.status(201).json({
    success: true,
    message: 'Registration successful. Please verify your email with the OTP sent to your inbox.',
    data: {
      userId: user._id,
      email: user.email,
      otpSent: true
    }
  });
});

// @desc    Verify OTP and create approval request
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    res.status(400);
    throw new Error('Email and OTP are required');
  }

  // Find user
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if already verified
  if (user.isEmailVerified && user.status !== 'unverified') {
    res.status(400);
    throw new Error('Email already verified');
  }

  // Find latest OTP
  const otpRecord = await OTPVerification.findOne({
    userId: user._id,
    email: user.email,
    purpose: 'registration',
    isUsed: false,
    expiresAt: { $gt: new Date() }
  }).sort({ createdAt: -1 });

  if (!otpRecord) {
    res.status(400);
    throw new Error('OTP expired or not found. Please request a new OTP.');
  }

  // Check if max attempts exceeded
  if (otpRecord.attempts >= otpRecord.maxAttempts) {
    res.status(400);
    throw new Error('Maximum OTP attempts exceeded. Please request a new OTP.');
  }

  // Verify OTP
  const isValid = await bcrypt.compare(otp, otpRecord.otp);
  
  if (!isValid) {
    await otpRecord.incrementAttempts();
    const attemptsLeft = otpRecord.maxAttempts - otpRecord.attempts;
    res.status(400);
    throw new Error(`Invalid OTP. ${attemptsLeft} attempts remaining.`);
  }

  // Mark OTP as used
  otpRecord.isUsed = true;
  await otpRecord.save();

  // Update user status
  user.isEmailVerified = true;
  user.status = 'pending';
  await user.save();

  // Create seller approval request
  await SellerApprovalRequest.create({
    sellerId: user._id,
    status: 'pending',
    sellerDetails: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      farmName: user.farmName,
      bank: user.bank,
      district: user.district,
      address: user.address
    }
  });

  // Send registration pending email
  await sendRegistrationPendingEmail(user.email, user.name);

  res.status(200).json({
    success: true,
    message: 'Email verified successfully. Your registration request has been submitted to the admin for approval. You will be notified once approved.',
    data: {
      userId: user._id,
      status: user.status
    }
  });
});

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }

  // Find user
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if already verified
  if (user.isEmailVerified) {
    res.status(400);
    throw new Error('Email already verified');
  }

  // Check cooldown period (60 seconds)
  const recentOTP = await OTPVerification.findOne({
    userId: user._id,
    email: user.email
  }).sort({ createdAt: -1 });

  if (recentOTP) {
    const timeSinceLastOTP = Date.now() - recentOTP.lastSentAt.getTime();
    const cooldownPeriod = 60 * 1000; // 60 seconds

    if (timeSinceLastOTP < cooldownPeriod) {
      const remainingSeconds = Math.ceil((cooldownPeriod - timeSinceLastOTP) / 1000);
      res.status(429);
      throw new Error(`Please wait ${remainingSeconds} seconds before requesting another OTP`);
    }
  }

  // Invalidate all previous OTPs for this user
  await OTPVerification.updateMany(
    { userId: user._id, isUsed: false },
    { $set: { isUsed: true } }
  );

  // Generate new OTP
  const otp = generateOTP();
  console.log("Generated OTP for debugging (resend):", otp);
  const otpHash = await bcrypt.hash(otp, 10);
  
  // Store new OTP
  const newOTPRecord = await OTPVerification.create({
    userId: user._id,
    email: user.email,
    otp: otpHash,
    purpose: 'registration',
    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  });

  // Send OTP email
  const emailResult = await sendOTPEmail(user.email, otp, user.name);
  
  // In development mode, continue even if email fails (OTP is logged to console)
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  if (!emailResult.success && !isDevelopment) {
    res.status(500);
    throw new Error('Failed to send OTP email. Please try again.');
  }

  res.status(200).json({
    success: true,
    message: emailResult.success 
      ? 'OTP resent successfully. Please check your email.'
      : 'OTP generated successfully. Check console for OTP (development mode).',
    data: {
      cooldownSeconds: 60,
      attemptsRemaining: newOTPRecord.maxAttempts,
      developmentMode: isDevelopment && !emailResult.success ? true : undefined
    }
  });
});

// @desc    Login with status check
// @route   POST /api/auth/login
// @access  Public
const loginWithStatusCheck = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  // Find user
  const user = await User.findOne({ email: email.toLowerCase() });
  
  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Check password
  const isPasswordMatch = await user.comparePassword(password);
  
  if (!isPasswordMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Status checks for sellers
  if (user.role === 'seller') {
    // Check if email is verified
    if (!user.isEmailVerified || user.status === 'unverified') {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email first. Check your inbox for OTP.',
        code: 'EMAIL_NOT_VERIFIED',
        data: { email: user.email }
      });
    }

    // Check if pending approval
    if (user.status === 'pending') {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending admin approval. You will be notified once approved.',
        code: 'PENDING_APPROVAL'
      });
    }

    // Check if rejected
    if (user.status === 'rejected') {
      return res.status(403).json({
        success: false,
        message: `Your registration was rejected. Reason: ${user.rejectionReason || 'Not provided'}`,
        code: 'ACCOUNT_REJECTED',
        data: { rejectionReason: user.rejectionReason }
      });
    }

    // Check if inactive
    if (user.status === 'inactive') {
      return res.status(403).json({
        success: false,
        message: 'Your account is inactive. Please contact support.',
        code: 'ACCOUNT_INACTIVE'
      });
    }
  }

  // For other roles or active sellers, allow login
  if (user.role !== 'seller' && user.status !== 'active') {
    res.status(403);
    throw new Error('Account is not active. Please contact support.');
  }

  // Generate token
  const token = generateToken(user._id);

  // Return response in the same format as the old login function
  res.status(200).json({
    _id: user._id,
    role: user.role,
    name: user.name,
    email: user.email,
    phone: user.phone,
    district: user.district,
    address: user.address,
    firstName: user.firstName,
    lastName: user.lastName,
    nic: user.nic,
    preferredCategories: user.preferredCategories,
    farmName: user.farmName,
    bank: user.bank,
    regions: user.regions,
    officeContact: user.officeContact,
    permissions: user.permissions,
    rewardPoints: user.rewardPoints,
    status: user.status,
    token: token
  });
});

// @desc    Get pending seller approval requests
// @route   GET /api/admin/sellers/pending
// @access  Private/Admin
const getPendingSellerRequests = asyncHandler(async (req, res) => {
  const requests = await SellerApprovalRequest.find({ status: 'pending' })
    .populate('sellerId', 'name email phone farmName bank status createdAt')
    .sort({ createdAt: -1 });

  // Transform data to match frontend expectations
  const transformedRequests = requests.map(request => ({
    _id: request._id,
    sellerId: request.sellerId?._id,
    status: request.status,
    name: request.sellerDetails?.name || request.sellerId?.name,
    email: request.sellerDetails?.email || request.sellerId?.email,
    phone: request.sellerDetails?.phone || request.sellerId?.phone,
    farmName: request.sellerDetails?.farmName || request.sellerId?.farmName,
    bank: request.sellerDetails?.bank || request.sellerId?.bank,
    district: request.sellerDetails?.district || request.sellerId?.district,
    address: request.sellerDetails?.address || request.sellerId?.address,
    reviewedBy: request.reviewedBy,
    reviewedAt: request.reviewedAt,
    rejectionReason: request.rejectionReason,
    adminNotes: request.adminNotes,
    submittedAt: request.createdAt,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt
  }));

  res.status(200).json({
    success: true,
    data: {
      requests: transformedRequests,
      total: transformedRequests.length
    }
  });
});

// @desc    Approve seller
// @route   POST /api/admin/sellers/approve/:requestId
// @access  Private/Admin
const approveSeller = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const { adminNotes } = req.body;
  const adminId = req.user._id; // From auth middleware

  // Find approval request
  const approvalRequest = await SellerApprovalRequest.findById(requestId)
    .populate('sellerId');

  if (!approvalRequest) {
    res.status(404);
    throw new Error('Approval request not found');
  }

  if (approvalRequest.status !== 'pending') {
    res.status(400);
    throw new Error('This request has already been processed');
  }

  const seller = approvalRequest.sellerId;

  if (!seller) {
    res.status(404);
    throw new Error('Seller not found');
  }

  // Verify seller has verified email
  if (!seller.isEmailVerified) {
    res.status(400);
    throw new Error('Cannot approve seller with unverified email');
  }

  // Update seller status
  seller.status = 'active';
  seller.approvedBy = adminId;
  seller.approvedAt = new Date();
  await seller.save();

  // Update approval request
  approvalRequest.status = 'approved';
  approvalRequest.reviewedBy = adminId;
  approvalRequest.reviewedAt = new Date();
  approvalRequest.adminNotes = adminNotes;
  await approvalRequest.save();

  // Log admin action
  await AdminActionLog.create({
    adminId,
    actionType: 'approve_seller',
    targetUserId: seller._id,
    targetUserEmail: seller.email,
    details: {
      requestId: approvalRequest._id,
      adminNotes
    },
    ipAddress: req.ip,
    userAgent: req.get('user-agent')
  });

  // Send approval email
  await sendSellerApprovedEmail(seller.email, seller.name);

  res.status(200).json({
    success: true,
    message: 'Seller approved successfully. Approval email sent.',
    data: {
      sellerId: seller._id,
      status: seller.status
    }
  });
});

// @desc    Reject seller
// @route   POST /api/admin/sellers/reject/:requestId
// @access  Private/Admin
const rejectSeller = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const { rejectionReason, adminNotes } = req.body;
  const adminId = req.user._id; // From auth middleware

  if (!rejectionReason) {
    res.status(400);
    throw new Error('Rejection reason is required');
  }

  // Find approval request
  const approvalRequest = await SellerApprovalRequest.findById(requestId)
    .populate('sellerId');

  if (!approvalRequest) {
    res.status(404);
    throw new Error('Approval request not found');
  }

  if (approvalRequest.status !== 'pending') {
    res.status(400);
    throw new Error('This request has already been processed');
  }

  const seller = approvalRequest.sellerId;

  if (!seller) {
    res.status(404);
    throw new Error('Seller not found');
  }

  // Update seller status
  seller.status = 'rejected';
  seller.rejectedBy = adminId;
  seller.rejectedAt = new Date();
  seller.rejectionReason = rejectionReason;
  await seller.save();

  // Update approval request
  approvalRequest.status = 'rejected';
  approvalRequest.reviewedBy = adminId;
  approvalRequest.reviewedAt = new Date();
  approvalRequest.rejectionReason = rejectionReason;
  approvalRequest.adminNotes = adminNotes;
  await approvalRequest.save();

  // Log admin action
  await AdminActionLog.create({
    adminId,
    actionType: 'reject_seller',
    targetUserId: seller._id,
    targetUserEmail: seller.email,
    details: {
      requestId: approvalRequest._id,
      rejectionReason,
      adminNotes
    },
    ipAddress: req.ip,
    userAgent: req.get('user-agent')
  });

  // Send rejection email
  await sendSellerRejectedEmail(seller.email, seller.name, rejectionReason);

  res.status(200).json({
    success: true,
    message: 'Seller registration rejected. Notification email sent.',
    data: {
      sellerId: seller._id,
      status: seller.status
    }
  });
});

export {
  registerSeller,
  verifyOTP,
  resendOTP,
  loginWithStatusCheck,
  getPendingSellerRequests,
  approveSeller,
  rejectSeller
};
