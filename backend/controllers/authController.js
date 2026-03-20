import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import OTPVerification from '../models/OTPVerification.js';
import SellerApprovalRequest from '../models/SellerApprovalRequest.js';
import { generateToken } from '../utils/jwt.js';
import { generateOTP } from '../utils/otp.js';
import { sendOTPEmail, sendWelcomeEmail, sendRegistrationPendingEmail } from '../services/emailService.js';
import { createWithPublicId } from '../utils/createWithPublicId.js';

// Temporary user data storage (pending OTP verification)
const pendingRegistrations = new Map();

// In-memory OTP store for password reset (email -> { otp, expiryTime })
const otpStore = new Map();
// In-memory store for OTP verification status (email -> { verified: true, expiresAt })
const otpVerifiedStore = new Map();

// Helper to validate OTP and expiry
function isOTPValid(inputOtp, storedOtp, expiryTime) {
  return inputOtp === storedOtp && Date.now() < expiryTime;
}

// @desc    Initiate registration - Send OTP without creating user
// @route   POST /api/auth/register/initiate
// @access  Public
const initiateRegistration = asyncHandler(async (req, res) => {
  const { role, name, email, password, phone, firstName, lastName, ...otherFields } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  // Validation for buyers - require firstName and lastName
  if (role === 'buyer') {
    if (!firstName || !lastName) {
      res.status(400);
      throw new Error('First name and last name are required for buyers');
    }
  } else {
    // For sellers, require name
    if (!name) {
      res.status(400);
      throw new Error('Name is required for sellers');
    }
  }

  // Generate OTP
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Store registration data temporarily
  const registrationData = {
    role,
    email,
    password, // Will be hashed when user is created
    phone,
    isEmailVerified: true, // Will be verified via OTP before user creation
    ...otherFields
  };

  if (role === 'buyer') {
    registrationData.firstName = firstName;
    registrationData.lastName = lastName;
    registrationData.status = 'active'; // Buyers are active immediately after OTP verification
  } else {
    registrationData.name = name;
    registrationData.status = role === 'seller' ? 'pending' : 'active'; // Sellers need admin approval
  }

  // Store pending registration
  pendingRegistrations.set(email, {
    data: registrationData,
    otp,
    expiresAt,
    attempts: 0
  });

  // Send OTP email
  const displayName = role === 'buyer' ? `${firstName} ${lastName}` : name;
  await sendOTPEmail(email, otp);

  res.status(200).json({
    success: true,
    message: 'OTP sent to your email. Please verify to complete registration.',
    email
  });
});

// @desc    Verify OTP and create user
// @route   POST /api/auth/register/verify
// @access  Public
const verifyRegistrationOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const pending = pendingRegistrations.get(email);

  if (!pending) {
    res.status(400);
    throw new Error('No pending registration found. Please start registration again.');
  }

  // Check attempts
  if (pending.attempts >= 5) {
    pendingRegistrations.delete(email);
    res.status(400);
    throw new Error('Maximum OTP attempts exceeded. Please start registration again.');
  }

  // Check expiry
  if (new Date() > pending.expiresAt) {
    pendingRegistrations.delete(email);
    res.status(400);
    throw new Error('OTP has expired. Please start registration again.');
  }

  // Verify OTP
  if (otp !== pending.otp) {
    pending.attempts++;
    res.status(400);
    throw new Error(`Invalid OTP. ${5 - pending.attempts} attempts remaining.`);
  }

  // OTP verified - Create user
  const userData = pending.data;
  
  // Determine type code for publicId
  const typeChar = userData.role === 'seller' ? 'S' 
                 : userData.role === 'buyer' ? 'B' 
                 : userData.role === 'agent' ? 'A' 
                 : 'M';
  
  const nameForSlug = userData.role === 'buyer' 
    ? `${userData.firstName} ${userData.lastName}`.trim() 
    : userData.name || userData.email.split('@')[0];

  // Create user with publicId
  const user = await createWithPublicId(
    User,
    userData,
    typeChar,
    nameForSlug
  );

  // Clean up pending registration
  pendingRegistrations.delete(email);

  // If seller, create approval request for admin dashboard
  if (userData.role === 'seller') {
    await createWithPublicId(
      SellerApprovalRequest,
      {
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
      },
      'R', // R for Request
      user.name
    );

    // Send registration pending email
    await sendRegistrationPendingEmail(user.email, user.name);
  }

  // Send welcome email for buyers
  if (userData.role === 'buyer') {
    const displayName = `${userData.firstName} ${userData.lastName}`;
    await sendWelcomeEmail(user.email, displayName);
  }

  res.status(201).json({
    _id: user._id,
    publicId: user.publicId,
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
    token: generateToken(user._id),
    message: user.role === 'buyer' 
      ? 'Registration successful! Welcome to AgriLink.' 
      : 'Registration successful! Your seller account is pending admin approval.'
  });
});

// @desc    Resend OTP for pending registration
// @route   POST /api/auth/register/resend-otp
// @access  Public
const resendRegistrationOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const pending = pendingRegistrations.get(email);

  if (!pending) {
    res.status(400);
    throw new Error('No pending registration found. Please start registration again.');
  }

  // Generate new OTP
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  pending.otp = otp;
  pending.expiresAt = expiresAt;
  pending.attempts = 0; // Reset attempts on resend

  // Send OTP email
  await sendOTPEmail(email, otp);

  res.status(200).json({
    success: true,
    message: 'New OTP sent to your email.'
  });
});

// @desc    Legacy register endpoint (for backward compatibility)
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { role, name, email, password, phone, firstName, lastName, ...otherFields } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Validation for buyers - require firstName and lastName instead of name
  if (role === 'buyer') {
    if (!firstName || !lastName) {
      res.status(400);
      throw new Error('First name and last name are required for buyers');
    }
  } else {
    // For non-buyers, require name
    if (!name) {
      res.status(400);
      throw new Error('Name is required for this role');
    }
  }

  // Create user data
  const userData = {
    role,
    email,
    password,
    phone,
    ...otherFields
  };

  // Add name for non-buyers or firstName/lastName for buyers
  if (role === 'buyer') {
    userData.firstName = firstName;
    userData.lastName = lastName;
  } else {
    userData.name = name;
  }

  // Create user
  const user = await User.create(userData);

  if (user) {
    // Send welcome email
    const displayName = role === 'buyer' ? `${firstName} ${lastName}` : name;
    await sendWelcomeEmail(user.email, displayName);

    res.status(201).json({
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
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  // Check if user exists, is not deleted, and password is correct
  if (user && !user.isDeleted && (await user.comparePassword(password))) {
    // Check if user status is active
    if (user.status === 'pending') {
      res.status(403);
      throw new Error('Your account is pending admin approval. Please wait for approval to access your account.');
    }
    
    if (user.status !== 'active') {
      res.status(403);
      throw new Error(`Account is ${user.status}. Please contact support or complete verification.`);
    }

    res.json({
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
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

// @desc    Send OTP for password reset
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const otp = generateOTP();
  const expiryTime = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpStore.set(email, { otp, expiryTime });

  await sendOTPEmail(email, otp);

  res.json({ message: 'OTP sent to your email' });
});


// @desc    Verify OTP for password reset (step 1)
// @route   POST /api/auth/verify-reset-otp
// @access  Public
const verifyResetOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }
  const storedOTP = otpStore.get(email);
  if (!storedOTP || !isOTPValid(otp, storedOTP.otp, storedOTP.expiryTime)) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }
  // Mark OTP as verified for this email (valid for 10 min)
  otpVerifiedStore.set(email, { verified: true, expiresAt: Date.now() + 10 * 60 * 1000 });
  return res.json({ message: 'OTP verified successfully' });
});

// @desc    Reset password with verified OTP (step 2)
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email and new password are required' });
  }
  const verified = otpVerifiedStore.get(email);
  if (!verified || !verified.verified || Date.now() > verified.expiresAt) {
    return res.status(400).json({ message: 'OTP not verified or expired. Please verify OTP again.' });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  user.password = newPassword;
  await user.save();
  otpVerifiedStore.delete(email);
  otpStore.delete(email);
  return res.json({ message: 'Password reset successfully' });
});

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
      phone: user.phone,
      status: user.status,
      ...user.toObject()
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  console.log('updateProfile called with req.user:', req.user);
  
  if (!req.user) {
    res.status(401);
    throw new Error('User not authenticated');
  }

  const user = await User.findById(req.user._id);

  if (user) {
    // Update basic fields only if provided
    if (req.body.name !== undefined) user.name = req.body.name;
    if (req.body.email !== undefined) user.email = req.body.email;
    if (req.body.phone !== undefined) user.phone = req.body.phone;
    if (req.body.district !== undefined) user.district = req.body.district;
    if (req.body.address !== undefined) user.address = req.body.address;

    // Update role-specific fields only if provided
    if (req.body.firstName !== undefined) user.firstName = req.body.firstName;
    if (req.body.lastName !== undefined) user.lastName = req.body.lastName;
    if (req.body.nic !== undefined) user.nic = req.body.nic;
    if (req.body.preferredCategories !== undefined) user.preferredCategories = req.body.preferredCategories;
    if (req.body.farmName !== undefined) user.farmName = req.body.farmName;
    if (req.body.regions !== undefined) user.regions = req.body.regions;
    if (req.body.officeContact !== undefined) user.officeContact = req.body.officeContact;

    // Handle bank object properly - only update if provided
    if (req.body.bank !== undefined) {
      // If bank object is provided, merge with existing bank data
      user.bank = {
        ...user.bank,
        ...req.body.bank
      };
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      role: updatedUser.role,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      district: updatedUser.district,
      address: updatedUser.address,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      nic: updatedUser.nic,
      preferredCategories: updatedUser.preferredCategories,
      farmName: updatedUser.farmName,
      bank: updatedUser.bank,
      regions: updatedUser.regions,
      officeContact: updatedUser.officeContact,
      permissions: updatedUser.permissions,
      rewardPoints: updatedUser.rewardPoints,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export {
  initiateRegistration,
  verifyRegistrationOTP,
  resendRegistrationOTP,
  register,
  login,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  getProfile,
  updateProfile,
};
