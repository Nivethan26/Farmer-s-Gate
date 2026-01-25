import express from 'express';
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
} from '../controllers/authController.js';
import {
  registerSeller,
  verifyOTP,
  resendOTP,
  loginWithStatusCheck
} from '../controllers/sellerApprovalController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Regular user registration (buyers, agents)
router.post('/register', register);

// Seller registration with OTP flow
router.post('/register/seller', registerSeller);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);

// Login with status check
router.post('/login', loginWithStatusCheck);

// Password management
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Profile management
router
  .route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile);

export default router;
