import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import OTPVerification from '../models/OTPVerification.js';
import { generateToken } from '../utils/jwt.js';
import { generateOTP, isOTPValid } from '../utils/otp.js';
import { sendOTPEmail, sendWelcomeEmail } from '../services/emailService.js';
import { createWithPublicId } from '../utils/createWithPublicId.js';

// Temporary user data storage (pending OTP verification)
const pendingRegistrations = new Map();

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
    ...otherFields
  };

  if (role === 'buyer') {
    registrationData.firstName = firstName;
    registrationData.lastName = lastName;
  } else {
    registrationData.name = name;
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

  // Send welcome email
  const displayName = userData.role === 'buyer' 
    ? `${userData.firstName} ${userData.lastName}` 
    : userData.name;
  await sendWelcomeEmail(user.email, displayName);

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
  // This maintains backward compatibility but should be updated to use new flow
  const { role, name, email, password, phone, firstName, lastName, ...otherFields } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Validation
  if (role === 'buyer') {
    if (!firstName || !lastName) {
      res.status(400);
      throw new Error('First name and last name are required for buyers');
    }
  } else {
    if (!name) {
      res.status(400);
      throw new Error('Name is required for this role');
    }
  }

  const userData = {
    role,
    email,
    password,
    phone,
    ...otherFields
  };

  if (role === 'buyer') {
    userData.firstName = firstName;
    userData.lastName = lastName;
  } else {
    userData.name = name;
  }

  // Create user
  const user = await User.create(userData);

  if (user) {
    const displayName = role === 'buyer' ? `${firstName} ${lastName}` : name;
    await sendWelcomeEmail(user.email, displayName);

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

  const user = await User.findOne({ email });

  if (user && !user.isDeleted && (await user.comparePassword(password))) {
    res.json({
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
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await OTPVerification.create({
    userId: user._id,
    email,
    otp,
    purpose: 'password_reset',
    expiresAt
  });

  await sendOTPEmail(email, otp);

  res.json({ message: 'OTP sent to your email' });
});

// @desc    Reset password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const otpRecord = await OTPVerification.findOne({
    email,
    purpose: 'password_reset',
    isUsed: false
  }).sort({ createdAt: -1 });

  if (!otpRecord || !otpRecord.isValid()) {
    res.status(400);
    throw new Error('Invalid or expired OTP');
  }

  if (otpRecord.otp !== otp) {
    await otpRecord.incrementAttempts();
    res.status(400);
    throw new Error('Invalid OTP');
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.password = newPassword;
  await user.save();

  otpRecord.isUsed = true;
  await otpRecord.save();

  res.json({ message: 'Password reset successfully' });
});

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      publicId: user.publicId,
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
  if (!req.user) {
    res.status(401);
    throw new Error('User not authenticated');
  }

  const user = await User.findById(req.user._id);

  if (user) {
    if (req.body.name !== undefined) user.name = req.body.name;
    if (req.body.email !== undefined) user.email = req.body.email;
    if (req.body.phone !== undefined) user.phone = req.body.phone;
    if (req.body.district !== undefined) user.district = req.body.district;
    if (req.body.address !== undefined) user.address = req.body.address;
    if (req.body.firstName !== undefined) user.firstName = req.body.firstName;
    if (req.body.lastName !== undefined) user.lastName = req.body.lastName;
    if (req.body.nic !== undefined) user.nic = req.body.nic;
    if (req.body.preferredCategories !== undefined) user.preferredCategories = req.body.preferredCategories;
    if (req.body.farmName !== undefined) user.farmName = req.body.farmName;
    if (req.body.regions !== undefined) user.regions = req.body.regions;
    if (req.body.officeContact !== undefined) user.officeContact = req.body.officeContact;

    if (req.body.bank !== undefined) {
      user.bank = {
        ...user.bank,
        ...req.body.bank
      };
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      publicId: updatedUser.publicId,
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
  resetPassword,
  getProfile,
  updateProfile,
};
