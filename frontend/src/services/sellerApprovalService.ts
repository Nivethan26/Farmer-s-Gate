import apiClient from '@/lib/api';
import type { 
  SellerRegistration, 
  OTPVerification, 
  ResendOTPRequest,
  SellerApprovalRequest,
  ApprovalAction,
  RejectionAction
} from '@/types/seller';

export interface RegistrationResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    email: string;
    otpSent: boolean;
  };
}

export interface OTPVerificationResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    status: string;
  };
}

export interface ResendOTPResponse {
  success: boolean;
  message: string;
  data: {
    cooldownSeconds: number;
    attemptsRemaining: number;
  };
}

export interface PendingRequestsResponse {
  success: boolean;
  data: {
    requests: SellerApprovalRequest[];
    total: number;
  };
}

export interface ApprovalResponse {
  success: boolean;
  message: string;
  data: {
    sellerId: string;
    status: string;
  };
}

export const sellerApprovalAPI = {
  // Register new seller
  async registerSeller(data: SellerRegistration): Promise<RegistrationResponse> {
    return apiClient.post<RegistrationResponse>('/auth/register/seller', data);
  },

  // Verify OTP
  async verifyOTP(data: OTPVerification): Promise<OTPVerificationResponse> {
    return apiClient.post<OTPVerificationResponse>('/auth/verify-otp', data);
  },

  // Resend OTP
  async resendOTP(data: ResendOTPRequest): Promise<ResendOTPResponse> {
    return apiClient.post<ResendOTPResponse>('/auth/resend-otp', data);
  },

  // Get pending seller approval requests (Admin only)
  async getPendingRequests(): Promise<PendingRequestsResponse> {
    return apiClient.get<PendingRequestsResponse>('/admin/sellers/pending');
  },

  // Approve seller (Admin only)
  async approveSeller(data: ApprovalAction): Promise<ApprovalResponse> {
    return apiClient.post<ApprovalResponse>(`/admin/sellers/approve/${data.requestId}`, {
      adminNotes: data.adminNotes
    });
  },

  // Reject seller (Admin only)
  async rejectSeller(data: RejectionAction): Promise<ApprovalResponse> {
    return apiClient.post<ApprovalResponse>(`/admin/sellers/reject/${data.requestId}`, {
      rejectionReason: data.rejectionReason,
      adminNotes: data.adminNotes
    });
  }
};

export default sellerApprovalAPI;
