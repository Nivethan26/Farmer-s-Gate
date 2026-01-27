export interface BankDetails {
  accountName: string;
  accountNo: string;
  bankName: string;
  branch: string;
}

export interface SellerRegistration {
  name: string;
  email: string;
  password: string;
  phone: string;
  farmName: string;
  bank: BankDetails;
  district: string;
  address: string;
}

export interface OTPVerification {
  email: string;
  otp: string;
}

export interface ResendOTPRequest {
  email: string;
}

export interface SellerApprovalRequest {
  _id: string;
  sellerId: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  name: string;
  email: string;
  phone: string;
  farmName: string;
  bank: BankDetails;
  district: string;
  address: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  adminNotes?: string;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalAction {
  requestId: string;
  adminNotes?: string;
}

export interface RejectionAction {
  requestId: string;
  rejectionReason: string;
  adminNotes?: string;
}

export type UserStatus = 'unverified' | 'otp_verified' | 'pending' | 'active' | 'inactive' | 'rejected';

export interface LoginError {
  success: false;
  message: string;
  code: 'EMAIL_NOT_VERIFIED' | 'PENDING_APPROVAL' | 'ACCOUNT_REJECTED' | 'ACCOUNT_INACTIVE';
  data?: {
    email?: string;
    rejectionReason?: string;
  };
}
