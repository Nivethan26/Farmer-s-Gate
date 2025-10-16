import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import ordersData from '@/data/orders.json';

export interface OrderItem {
  productId: string;
  productName: string;
  qty: number;
  pricePerKg: number;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  receiptUrl: string | null;
  createdAt: string;
  paidAt: string | null;
  deliveredAt: string | null;
}

interface OrdersState {
  orders: Order[];
}

const initialState: OrdersState = {
  orders: ordersData as Order[],
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    createOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
    },
    updateOrderStatus: (
      state,
      action: PayloadAction<{ id: string; status: Order['status']; paidAt?: string; deliveredAt?: string }>
    ) => {
      const order = state.orders.find((o) => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
        if (action.payload.paidAt) order.paidAt = action.payload.paidAt;
        if (action.payload.deliveredAt) order.deliveredAt = action.payload.deliveredAt;
      }
    },
    uploadReceipt: (state, action: PayloadAction<{ id: string; receiptUrl: string }>) => {
      const order = state.orders.find((o) => o.id === action.payload.id);
      if (order) {
        order.receiptUrl = action.payload.receiptUrl;
        order.status = 'pending';
      }
    },
    markOrderPaid: (state, action: PayloadAction<string>) => {
      const order = state.orders.find((o) => o.id === action.payload);
      if (order) {
        order.status = 'paid';
        order.paidAt = new Date().toISOString();
      }
    },
  },
});

export const { createOrder, updateOrderStatus, uploadReceipt, markOrderPaid } = ordersSlice.actions;
export default ordersSlice.reducer;
