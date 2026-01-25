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
  }
};

export default userAPI;