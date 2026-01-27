import express from 'express';
import {
  registerSeller,
  verifyOTP,
  resendOTP
} from '../controllers/sellerApprovalController.js';

const router = express.Router();

// Seller registration with OTP
router.post('/register/seller', registerSeller);

// OTP verification
router.post('/verify-otp', verifyOTP);

// Resend OTP
router.post('/resend-otp', resendOTP);

export default router;
