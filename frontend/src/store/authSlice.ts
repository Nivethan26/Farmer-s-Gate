import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import usersData from '@/data/users.json';

export type UserRole = 'buyer' | 'seller' | 'admin' | 'agent';

export interface User {
  id: string;
  email: string;
  name: string;
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
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ email: string; password: string }>) => {
      const { email, password } = action.payload;
      const credentials = dummyCredentials.find(
        (c) => c.email === email && c.password === password
      );

      if (credentials) {
        let userData: User | null = null;

        // Find user data based on role
        switch (credentials.role) {
          case 'buyer':
            userData = usersData.buyers.find((u) => u.id === credentials.userId) as unknown as User;
            break;
          case 'seller':
            userData = usersData.sellers.find((u) => u.id === credentials.userId) as unknown as User;
            break;
          case 'agent':
            userData = usersData.agents.find((u) => u.id === credentials.userId) as unknown as User;
            break;
          case 'admin':
            userData = usersData.admins.find((u) => u.id === credentials.userId) as unknown as User;
            break;
        }

        if (userData) {
          state.isAuthenticated = true;
          state.user = { ...userData, role: credentials.role, rewardPoints: (userData as any).rewardPoints || 0 };
          localStorage.setItem('agrilink_auth', JSON.stringify(state));
        }
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('agrilink_auth');
      localStorage.removeItem('agrilink_cart');
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('agrilink_auth', JSON.stringify(state));
      }
    },
    addRewardPoints: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.rewardPoints = (state.user.rewardPoints || 0) + action.payload;
        localStorage.setItem('agrilink_auth', JSON.stringify(state));
      }
    },
    redeemRewardPoints: (state, action: PayloadAction<number>) => {
      if (state.user && state.user.rewardPoints) {
        state.user.rewardPoints = Math.max(0, state.user.rewardPoints - action.payload);
        localStorage.setItem('agrilink_auth', JSON.stringify(state));
      }
    },
  },
});

export const { login, logout, updateProfile, addRewardPoints, redeemRewardPoints } = authSlice.actions;
export default authSlice.reducer;