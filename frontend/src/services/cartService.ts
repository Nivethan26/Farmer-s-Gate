import apiClient from '@/lib/api';

export interface CartItem {
  productId: string;
  productName: string;
  pricePerKg: number;
  qty: number;
  image: string;
  sellerId: string;
  sellerName: string;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  totalWeight: number;
  redeemedPoints: number;
  createdAt: string;
  updatedAt: string;
}

export const cartAPI = {
  // Get user's cart
  getCart: async (): Promise<Cart> => {
    return await apiClient.get('/cart');
  },

  // Add item to cart
  addToCart: async (item: CartItem): Promise<Cart> => {
    return await apiClient.post('/cart/add', item);
  },

  // Update item quantity
  updateCartItem: async (productId: string, qty: number): Promise<Cart> => {
    return await apiClient.put(`/cart/${productId}`, { qty });
  },

  // Remove item from cart
  removeFromCart: async (productId: string): Promise<Cart> => {
    return await apiClient.delete(`/cart/${productId}`);
  },

  // Clear entire cart
  clearCart: async (): Promise<Cart> => {
    return await apiClient.delete('/cart');
  },

  // Update redeemed points
  updateRedeemedPoints: async (redeemedPoints: number): Promise<Cart> => {
    return await apiClient.put('/cart/redeem-points', { redeemedPoints });
  },
};