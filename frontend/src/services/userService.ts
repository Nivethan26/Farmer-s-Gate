import apiClient from '@/lib/api';
import type { User } from '@/store/authSlice';

export interface UsersResponse {
  users: User[];
  page: number;
  pages: number;
  total: number;
}

export interface UserStats {
  totalUsers: number;
  buyers: number;
  sellers: number;
  agents: number;
  admins: number;
  activeUsers: number;
  pendingUsers: number;
}

export const userAPI = {
  async getUsers(filters?: { role?: string; pageNumber?: number }): Promise<UsersResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    const endpoint = queryString ? `/users?${queryString}` : '/users';
    
    return apiClient.get<UsersResponse>(endpoint);
  },

  async getUserById(id: string): Promise<User> {
    return apiClient.get<User>(`/users/${id}`);
  },

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    return apiClient.put<User>(`/users/${id}`, userData);
  },

  async deleteUser(id: string): Promise<{ message: string }> {
    return apiClient.delete(`/users/${id}`);
  },

  async getUserStats(): Promise<UserStats> {
    return apiClient.get<UserStats>('/users/stats');
  },

  async addRewardPoints(id: string, points: number): Promise<{ rewardPoints: number }> {
    return apiClient.put(`/users/${id}/add-points`, { points });
  },

  async redeemRewardPoints(id: string, points: number): Promise<{ rewardPoints: number }> {
    return apiClient.put(`/users/${id}/redeem-points`, { points });
  },

  async toggleSellerStatus(id: string): Promise<{ success: boolean; message: string; data: { _id: string; status: string; name: string; email: string } }> {
    return apiClient.patch(`/users/${id}/toggle-status`, {});
  },

  async createAgent(agentData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    district: string;
    regions: string[];
    officeContact?: string;
    status: 'active' | 'inactive' | 'pending';
  }): Promise<User> {
    return apiClient.post<User>('/users/agent', agentData);
  },

  async updateAgentStatus(id: string, status: 'active' | 'inactive' | 'pending'): Promise<User> {
    return apiClient.patch<User>(`/users/${id}/agent-status`, { status });
  },

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<{ success: boolean; message: string }> {
    return apiClient.put<{ success: boolean; message: string }>('/users/change-password', data);
  }
};

export default userAPI;