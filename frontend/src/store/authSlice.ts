import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authAPI, type LoginRequest, type RegisterRequest, type AuthResponse } from '@/services/authService';
import apiClient from '@/lib/api';

export type UserRole = 'buyer' | 'seller' | 'admin' | 'agent';

export interface User {
  _id?: string;
  id: string;
  email: string;
  name?: string; // Optional, only for sellers/agents/admin
  firstName?: string;
  lastName?: string;
  nic?: string;
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
  rewardPoints?: number;
  status?: 'active' | 'pending' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Async thunks for API calls
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Registration failed');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await authAPI.updateProfile(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Profile update failed');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getProfile();
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch profile');
    }
  }
);

// Load initial state from localStorage
const loadAuthState = (): Pick<AuthState, 'isAuthenticated' | 'user' | 'token'> => {
  try {
    const storedAuth = localStorage.getItem('agrilink_auth');
    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      if (authData.token) {
        apiClient.setToken(authData.token);
      }
      return {
        isAuthenticated: !!authData.token,
        user: authData.user || null,
        token: authData.token || null,
      };
    }
  } catch (error) {
    console.error('Error loading auth state:', error);
  }
  return { isAuthenticated: false, user: null, token: null };
};

const savedState = loadAuthState();
const initialState: AuthState = {
  ...savedState,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('agrilink_auth');
      // Don't clear cart on logout - it will be synced when user logs back in
      authAPI.logout();
    },
    clearError: (state) => {
      state.error = null;
    },
    addRewardPoints: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.rewardPoints = (state.user.rewardPoints || 0) + action.payload;
        localStorage.setItem('agrilink_auth', JSON.stringify({
          token: state.token,
          user: state.user,
        }));
      }
    },
    redeemRewardPoints: (state, action: PayloadAction<number>) => {
      if (state.user && state.user.rewardPoints) {
        state.user.rewardPoints = Math.max(0, state.user.rewardPoints - action.payload);
        localStorage.setItem('agrilink_auth', JSON.stringify({
          token: state.token,
          user: state.user,
        }));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = {
          id: action.payload._id,
          email: action.payload.email,
          name: action.payload.name,
          role: action.payload.role,
          phone: action.payload.phone,
          district: action.payload.district,
          address: action.payload.address,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          nic: action.payload.nic,
          preferredCategories: action.payload.preferredCategories,
          farmName: action.payload.farmName,
          bank: action.payload.bank,
          regions: action.payload.regions,
          officeContact: action.payload.officeContact,
          permissions: action.payload.permissions,
          rewardPoints: action.payload.rewardPoints || 0,
        };
        state.token = action.payload.token;
        apiClient.setToken(action.payload.token);
        localStorage.setItem('agrilink_auth', JSON.stringify({
          token: state.token,
          user: state.user,
        }));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = {
          id: action.payload._id,
          email: action.payload.email,
          name: action.payload.name,
          role: action.payload.role,
          phone: action.payload.phone,
          district: action.payload.district,
          address: action.payload.address,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          nic: action.payload.nic,
          preferredCategories: action.payload.preferredCategories,
          farmName: action.payload.farmName,
          bank: action.payload.bank,
          regions: action.payload.regions,
          officeContact: action.payload.officeContact,
          permissions: action.payload.permissions,
          rewardPoints: action.payload.rewardPoints || 0,
        };
        state.token = action.payload.token;
        apiClient.setToken(action.payload.token);
        localStorage.setItem('agrilink_auth', JSON.stringify({
          token: state.token,
          user: state.user,
        }));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          id: action.payload._id,
          email: action.payload.email,
          name: action.payload.name,
          role: action.payload.role,
          phone: action.payload.phone,
          district: action.payload.district,
          address: action.payload.address,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          nic: action.payload.nic,
          preferredCategories: action.payload.preferredCategories,
          farmName: action.payload.farmName,
          bank: action.payload.bank,
          regions: action.payload.regions,
          officeContact: action.payload.officeContact,
          permissions: action.payload.permissions,
          rewardPoints: action.payload.rewardPoints || 0,
        };
        state.token = action.payload.token;
        apiClient.setToken(action.payload.token);
        localStorage.setItem('agrilink_auth', JSON.stringify({
          token: state.token,
          user: state.user,
        }));
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user = {
            id: (action.payload as any)._id || action.payload.id,
            email: action.payload.email,
            name: action.payload.name,
            role: action.payload.role,
            phone: action.payload.phone,
            district: action.payload.district,
            address: action.payload.address,
            firstName: action.payload.firstName,
            lastName: action.payload.lastName,
            nic: action.payload.nic,
            preferredCategories: action.payload.preferredCategories,
            farmName: action.payload.farmName,
            bank: action.payload.bank,
            regions: action.payload.regions,
            officeContact: action.payload.officeContact,
            permissions: action.payload.permissions,
            rewardPoints: action.payload.rewardPoints || 0,
          };
          localStorage.setItem('agrilink_auth', JSON.stringify({
            token: state.token,
            user: state.user,
          }));
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, addRewardPoints, redeemRewardPoints } = authSlice.actions;

// Legacy action for backward compatibility
export const login = (credentials: { email: string; password: string }) => {
  return loginUser(credentials);
};

// Legacy action for backward compatibility  
export const updateProfile = (userData: Partial<User>) => {
  return updateUserProfile(userData);
};

export default authSlice.reducer;