import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderAPI } from '@/services/orderService';

export interface OrderItem {
  productId: string;
  productName: string;
  sellerId: string;        
  sellerName: string;
  qty: number;
  pricePerKg: number;
}

export interface BankDetail {
  bankName: string;
  accountHolder: string;
  branch: string;
  accountNumber: string;
}

export interface Order {
  _id: string;
  id: string;
  buyerId: string;
  buyerName: string;
  address: string;
  buyerEmail?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'processing' | 'paid' | 'shipped' | 'delivered';
  receiptUrl: string | null;
  createdAt: string;
  paidAt: string | null;
  deliveredAt: string | null;
  redeemedPoints?: number;
  pointsEarned?: number;
  bankDetails?: BankDetail[];
}

interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pages: number;
    total: number;
  };
}

// Async thunks
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (filters: any = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getOrders(filters);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch orders');
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await orderAPI.getMyOrders();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch my orders');
    }
  }
);

export const fetchSellerOrders = createAsyncThunk(
  'orders/fetchSellerOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await orderAPI.getSellerOrders();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch seller orders');
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData: any, { rejectWithValue }) => {
    try {
      return await orderAPI.createOrder(orderData);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create order');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      return await orderAPI.updateOrderStatus(id, data);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update order status');
    }
  }
);

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pages: 1,
    total: 0,
  },
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders (admin)
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders?.map(o => ({ ...o, id: o._id })) || [];
        state.pagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          total: action.payload.total,
        };
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch my orders (buyer)
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.orders = action.payload.map(o => ({ ...o, id: o._id }));
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Fetch seller orders
      .addCase(fetchSellerOrders.fulfilled, (state, action) => {
        state.orders = action.payload.map(o => ({ ...o, id: o._id }));
      })
      .addCase(fetchSellerOrders.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Create order
      .addCase(createOrder.fulfilled, (state, action) => {
        const order = { ...action.payload, id: action.payload._id };
        state.orders.unshift(order);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Update order status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex((o) => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = { ...action.payload, id: action.payload._id };
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = ordersSlice.actions;
export default ordersSlice.reducer;
