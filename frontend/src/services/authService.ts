import apiClient from '@/lib/api';
import type { User, UserRole } from '@/store/authSlice';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone: string;
  district?: string;
  address?: string;
  firstName?: string;
  lastName?: string;
  nic?: string;
  preferredCategories?: string[];
  farmName?: string;
  bank?: {
    accountName: string;
    accountNo: string;
    bankName: string;
    branch: string;
  };
  regions?: string[];
  officeContact?: string;
}

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  token: string;
  phone?: string;
  district?: string;
  address?: string;
  firstName?: string;
  lastName?: string;
  nic?: string;
  preferredCategories?: string[];
  farmName?: string;
  bank?: {
    accountName: string;
    accountNo: string;
    bankName: string;
    branch: string;
  };
  regions?: string[];
  officeContact?: string;
  permissions?: string[];
  rewardPoints?: number;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface InitiateRegistrationRequest {
  role: 'buyer' | 'seller';
  email: string;
  password: string;
  phone: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  nic?: string;
  district?: string;
  address?: string;
  farmName?: string;
  bank?: {
    accountName: string;
    accountNo: string;
    bankName: string;
    branch: string;
  };
}

export interface InitiateRegistrationResponse {
  success: boolean;
  message: string;
  email: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface VerifyOTPResponse {
  success?: boolean;
  message: string;
  _id: string;
  publicId?: string;
  role: UserRole;
  name: string;
  email: string;
  phone?: string;
  token: string;
  firstName?: string;
  lastName?: string;
  nic?: string;
  district?: string;
  address?: string;
  status?: string;
  farmName?: string;
  bank?: {
    accountName: string;
    accountNo: string;
    bankName: string;
    branch: string;
  };
}

export interface ResendOTPRequest {
  email: string;
}

export interface ResendOTPResponse {
  success: boolean;
  message: string;
}

export const authAPI = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    // Set token for future requests
    apiClient.setToken(response.token);
    return response;
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData);
    // Set token for future requests
    apiClient.setToken(response.token);
    return response;
  },

  // New OTP-based registration flow
  async initiateRegistration(userData: InitiateRegistrationRequest): Promise<InitiateRegistrationResponse> {
    return apiClient.post<InitiateRegistrationResponse>('/auth/register/initiate', userData);
  },

  async verifyRegistrationOTP(data: VerifyOTPRequest): Promise<VerifyOTPResponse> {
    const response = await apiClient.post<VerifyOTPResponse>('/auth/register/verify', data);
    // Set token for future requests
    if (response.token) {
      apiClient.setToken(response.token);
    }
    return response;
  },

  async resendRegistrationOTP(data: ResendOTPRequest): Promise<ResendOTPResponse> {
    return apiClient.post<ResendOTPResponse>('/auth/register/resend-otp', data);
  },

  async getProfile(): Promise<User> {
    return apiClient.get<User>('/auth/profile');
  },

  async updateProfile(userData: Partial<User>): Promise<AuthResponse> {
    return apiClient.put<AuthResponse>('/auth/profile', userData);
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    return apiClient.post('/auth/forgot-password', data);
  },

  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    return apiClient.post('/auth/reset-password', data);
  },

  logout() {
    apiClient.clearToken();
  }
};

export default authAPI;