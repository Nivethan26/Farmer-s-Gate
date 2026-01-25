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