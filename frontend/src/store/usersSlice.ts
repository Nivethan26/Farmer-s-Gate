import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { userAPI } from '@/services/userService';
import type { User } from './authSlice';

export interface Buyer extends User {
  preferredCategories: string[];
}

export interface Seller extends User {
  farmName: string;
  bank: {
    accountName: string;
    accountNo: string;
    bankName: string;
    branch: string;
  };
  status: 'pending' | 'active' | 'inactive';
}

export interface Agent extends User {
  regions: string[];
  officeContact: string;
  status: 'active' | 'inactive';
}

interface UsersState {
  users: User[];
  buyers: Buyer[];
  sellers: Seller[];
  agents: Agent[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pages: number;
    total: number;
  };
}

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (filters?: any, { rejectWithValue }) => {
    try {
      const response = await userAPI.getUsers(filters);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch users');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, data }: { id: string; data: Partial<User> }, { rejectWithValue }) => {
    try {
      return await userAPI.updateUser(id, data);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: string, { rejectWithValue }) => {
    try {
      await userAPI.deleteUser(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete user');
    }
  }
);

export const addRewardPoints = createAsyncThunk(
  'users/addRewardPoints',
  async ({ id, points }: { id: string; points: number }, { rejectWithValue }) => {
    try {
      return await userAPI.addRewardPoints(id, points);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to add reward points');
    }
  }
);

export const redeemRewardPoints = createAsyncThunk(
  'users/redeemRewardPoints',
  async ({ id, points }: { id: string; points: number }, { rejectWithValue }) => {
    try {
      return await userAPI.redeemRewardPoints(id, points);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to redeem reward points');
    }
  }
);

const initialState: UsersState = {
  users: [],
  buyers: [],
  sellers: [],
  agents: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pages: 1,
    total: 0,
  },
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        const users = action.payload.users || [];
        state.users = users;
        state.buyers = users.filter(u => u.role === 'buyer') as Buyer[];
        state.sellers = users.filter(u => u.role === 'seller') as Seller[];
        state.agents = users.filter(u => u.role === 'agent') as Agent[];
        state.pagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          total: action.payload.total,
        };
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update user
      .addCase(updateUser.fulfilled, (state, action) => {
        const userIndex = state.users.findIndex(u => u.id === action.payload.id);
        if (userIndex !== -1) {
          state.users[userIndex] = action.payload;
          
          // Update role-specific arrays
          state.buyers = state.users.filter(u => u.role === 'buyer') as Buyer[];
          state.sellers = state.users.filter(u => u.role === 'seller') as Seller[];
          state.agents = state.users.filter(u => u.role === 'agent') as Agent[];
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        const userId = action.payload;
        state.users = state.users.filter(u => u.id !== userId);
        state.buyers = state.buyers.filter(u => u.id !== userId);
        state.sellers = state.sellers.filter(u => u.id !== userId);
        state.agents = state.agents.filter(u => u.id !== userId);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = usersSlice.actions;
export default usersSlice.reducer;
