import apiClient from '@/lib/api';
import type { Order, OrderItem } from '@/store/ordersSlice';

export interface CreateOrderRequest {
  items: OrderItem[];
  address: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  redeemedPoints?: number;
  receiptFile?: File;
}

export interface OrdersResponse {
  orders: Order[];
  page: number;
  pages: number;
  total: number;
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  paidOrders: number;
  processingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
}

export interface UpdateOrderStatusRequest {
  status: Order['status'];
  receiptUrl?: string;
}

export const orderAPI = {
  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    // If there's a receipt file, use FormData for file upload
    if (orderData.receiptFile) {
      console.log('Creating order with receipt file:', orderData);
      const formData = new FormData();
      
      // Add the receipt file
      formData.append('receipt', orderData.receiptFile);
      
      // Add order data as JSON fields
      formData.append('items', JSON.stringify(orderData.items));
      formData.append('address', orderData.address);
      formData.append('subtotal', orderData.subtotal.toString());
      formData.append('deliveryFee', orderData.deliveryFee.toString());
      formData.append('total', orderData.total.toString());
      
      if (orderData.redeemedPoints) {
        formData.append('redeemedPoints', orderData.redeemedPoints.toString());
      }
      
      console.log('FormData contents:');
      for (const [key, value] of formData.entries()) {
        console.log(key, ':', value);
      }
      
      return apiClient.post<Order>('/orders', formData);
    } else {
      // No file, send as regular JSON
      console.log('Creating order without receipt file:', orderData);
      return apiClient.post<Order>('/orders', orderData);
    }
  },

  async getOrders(filters?: { status?: string; pageNumber?: number }): Promise<OrdersResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    const endpoint = queryString ? `/orders?${queryString}` : '/orders';
    
    return apiClient.get<OrdersResponse>(endpoint);
  },

  async getOrderById(id: string): Promise<Order> {
    return apiClient.get<Order>(`/orders/${id}`);
  },

  async getMyOrders(): Promise<Order[]> {
    return apiClient.get<Order[]>('/orders/myorders');
  },

  async getSellerOrders(): Promise<Order[]> {
    return apiClient.get<Order[]>('/orders/seller');
  },

  async updateOrderStatus(id: string, data: UpdateOrderStatusRequest): Promise<Order> {
    return apiClient.put<Order>(`/orders/${id}/status`, data);
  },

  async getOrderStats(): Promise<OrderStats> {
    return apiClient.get<OrderStats>('/orders/stats');
  }
};

export default orderAPI;