import express from 'express';
import {
  initiateRegistration,
  verifyRegistrationOTP,
  resendRegistrationOTP,
  register,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// New OTP-based registration flow (recommended)
router.post('/register/initiate', initiateRegistration);
router.post('/register/verify', verifyRegistrationOTP);
router.post('/register/resend-otp', resendRegistrationOTP);

// Legacy registration (backward compatibility)
router.post('/register', register);

// Login
router.post('/login', login);

// Password management
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Profile management
router
  .route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile);

export default router;
