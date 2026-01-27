import apiClient from '@/lib/api';

export interface Notification {
  _id: string;
  userId: string;
  type: 'negotiation' | 'order' | 'payment' | 'general';
  title: string;
  message: string;
  data?: {
    negotiationId?: string;
    orderId?: string;
    productId?: string;
    actionUrl?: string;
  };
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  readAt?: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  totalPages: number;
  currentPage: number;
  total: number;
  unreadCount: number;
}

export const notificationAPI = {
  async getNotifications(page = 1, limit = 10, isRead?: boolean): Promise<NotificationsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (isRead !== undefined) {
      params.append('isRead', isRead.toString());
    }

    return apiClient.get<NotificationsResponse>(`/notifications?${params}`);
  },

  async markAsRead(notificationId: string): Promise<{ message: string }> {
    return apiClient.put(`/notifications/${notificationId}/read`);
  },

  async markAllAsRead(): Promise<{ message: string }> {
    return apiClient.put('/notifications/read-all');
  },

  async deleteNotification(notificationId: string): Promise<{ message: string }> {
    return apiClient.delete(`/notifications/${notificationId}`);
  },

  async clearAllNotifications(): Promise<{ message: string }> {
    return apiClient.delete('/notifications/clear-all');
  },

  async getUnreadCount(): Promise<{ count: number }> {
    // Note: This is now handled by the main getNotifications call
    // which returns unreadCount in the response
    const response = await apiClient.get<NotificationsResponse>('/notifications?limit=1');
    return { count: response.unreadCount };
  },

  async createNotification(notificationData: Omit<Notification, '_id' | 'createdAt' | 'isRead'>): Promise<Notification> {
    return apiClient.post<Notification>('/notifications', notificationData);
  }
};