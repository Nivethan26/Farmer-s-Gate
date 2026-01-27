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
  email: string;
}

export interface OTPVerificationResponse {
  message: string;
  _id: string;
  publicId?: string;
  role: string;
  name: string;
  email: string;
  phone?: string;
  token: string;
  status?: string;
  farmName?: string;
  bank?: {
    accountName: string;
    accountNo: string;
    bankName: string;
    branch: string;
  };
}

export interface ResendOTPResponse {
  success: boolean;
  message: string;
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
  // Register new seller (use new OTP flow)
  async registerSeller(data: SellerRegistration): Promise<RegistrationResponse> {
    return apiClient.post<RegistrationResponse>('/auth/register/initiate', {
      ...data,
      role: 'seller'
    });
  },

  // Verify OTP (use new route)
  async verifyOTP(data: OTPVerification): Promise<OTPVerificationResponse> {
    return apiClient.post<OTPVerificationResponse>('/auth/register/verify', data);
  },

  // Resend OTP (use new route)
  async resendOTP(data: ResendOTPRequest): Promise<ResendOTPResponse> {
    return apiClient.post<ResendOTPResponse>('/auth/register/resend-otp', data);
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
