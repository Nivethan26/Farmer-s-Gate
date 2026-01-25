import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { generateOTP, isOTPValid } from '../utils/otp.js';
import { sendOTPEmail, sendWelcomeEmail } from '../services/emailService.js';

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map();

// @desc    Register user
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

  if (user && (await user.comparePassword(password))) {
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

// @desc    Reset password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const storedOTP = otpStore.get(email);
  if (!storedOTP || !isOTPValid(otp, storedOTP.otp, storedOTP.expiryTime)) {
    res.status(400);
    throw new Error('Invalid or expired OTP');
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.password = newPassword;
  await user.save();

  otpStore.delete(email);

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
  register,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
};
