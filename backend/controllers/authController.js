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
  const { role, name, email, password, phone, ...otherFields } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create user
  const user = await User.create({
    role,
    name,
    email,
    password,
    phone,
    ...otherFields
  });

  if (user) {
    // Send welcome email
    await sendWelcomeEmail(user.email, user.name);

    res.status(201).json({
      _id: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
      phone: user.phone,
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
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    // Update role-specific fields
    if (req.body.firstName) user.firstName = req.body.firstName;
    if (req.body.lastName) user.lastName = req.body.lastName;
    if (req.body.nic) user.nic = req.body.nic;
    if (req.body.district) user.district = req.body.district;
    if (req.body.address) user.address = req.body.address;
    if (req.body.preferredCategories) user.preferredCategories = req.body.preferredCategories;
    if (req.body.farmName) user.farmName = req.body.farmName;
    if (req.body.bank) user.bank = req.body.bank;
    if (req.body.regions) user.regions = req.body.regions;
    if (req.body.officeContact) user.officeContact = req.body.officeContact;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      role: updatedUser.role,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
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
