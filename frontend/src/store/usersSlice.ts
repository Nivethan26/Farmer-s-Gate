import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import usersData from '@/data/users.json';

export interface Buyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  district: string;
  address: string;
  preferredCategories: string[];
  createdAt: string;
}

export interface Seller {
  id: string;
  name: string;
  email: string;
  phone: string;
  farmName: string;
  district: string;
  address: string;
  bank: {
    accountName: string;
    accountNo: string;
    bankName: string;
    branch: string;
  };
  status: 'pending' | 'active' | 'inactive';
  createdAt: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  regions: string[];
  officeContact: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface UsersState {
  buyers: Buyer[];
  sellers: Seller[];
  agents: Agent[];
}

const initialState: UsersState = {
  buyers: usersData.buyers as Buyer[],
  sellers: usersData.sellers as Seller[],
  agents: usersData.agents as Agent[],
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    approveSeller: (state, action: PayloadAction<string>) => {
      const seller = state.sellers.find((s) => s.id === action.payload);
      if (seller) {
        seller.status = 'active';
      }
    },
    rejectSeller: (state, action: PayloadAction<string>) => {
      const seller = state.sellers.find((s) => s.id === action.payload);
      if (seller) {
        seller.status = 'inactive';
      }
    },
    setSellerStatus: (state, action: PayloadAction<{ id: string; status: Seller['status'] }>) => {
      const seller = state.sellers.find((s) => s.id === action.payload.id);
      if (seller) {
        seller.status = action.payload.status;
      }
    },
    assignAgentRegion: (state, action: PayloadAction<{ id: string; regions: string[] }>) => {
      const agent = state.agents.find((a) => a.id === action.payload.id);
      if (agent) {
        agent.regions = action.payload.regions;
      }
    },
    setAgentStatus: (state, action: PayloadAction<{ id: string; status: Agent['status'] }>) => {
      const agent = state.agents.find((a) => a.id === action.payload.id);
      if (agent) {
        agent.status = action.payload.status;
      }
    },
  },
});

export const { approveSeller, rejectSeller, setSellerStatus, assignAgentRegion, setAgentStatus } =
  usersSlice.actions;
export default usersSlice.reducer;
