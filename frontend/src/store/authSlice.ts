import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

export type UserRole = 'buyer' | 'seller' | 'admin' | 'agent';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  district?: string;
  address?: string;
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
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload extends Record<string, any> {}

// Dummy credentials
const dummyCredentials = [
  { email: 'buyer@agrilink.lk', password: 'buyer123', role: 'buyer' as UserRole, userId: 'buyer-1' },
  { email: 'seller@agrilink.lk', password: 'seller123', role: 'seller' as UserRole, userId: 'seller-1' },
  { email: 'admin@agrilink.lk', password: 'admin123', role: 'admin' as UserRole, userId: 'admin-1' },
  { email: 'agent@agrilink.lk', password: 'agent123', role: 'agent' as UserRole, userId: 'agent-1' },
];

// Load initial state from localStorage
const loadAuthState = (): AuthState => {
  try {
    const storedAuth = localStorage.getItem('agrilink_auth');
    if (storedAuth) {
      return JSON.parse(storedAuth);
    }
  } catch (error) {
    console.error('Error loading auth state:', error);
  }
  return { isAuthenticated: false, user: null };
};

const initialState: AuthState = loadAuthState();

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/login', payload);
      const { token, user } = res.data;
      // persist token and minimal auth info
      localStorage.setItem('agrilink_token', token);
      const state = { isAuthenticated: true, user };
      localStorage.setItem('agrilink_auth', JSON.stringify(state));
      return user;
    } catch (err: any) {
      const message = err?.response?.data?.error || err.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/register', payload);
      // registration may also return token and user
      const { token, user } = res.data;
      if (token && user) {
        localStorage.setItem('agrilink_token', token);
        const state = { isAuthenticated: true, user };
        localStorage.setItem('agrilink_auth', JSON.stringify(state));
        return user;
      }
      return null;
    } catch (err: any) {
      const message = err?.response?.data?.error || err.message || 'Registration failed';
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('agrilink_auth');
      localStorage.removeItem('agrilink_cart');
      localStorage.removeItem('agrilink_token');
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('agrilink_auth', JSON.stringify(state));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User | null>) => {
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload;
        }
      })
      .addCase(registerUser.rejected, (state) => {
        // keep existing state
      });
  },
});

export const { logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;
