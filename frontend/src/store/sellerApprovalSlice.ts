import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { sellerApprovalAPI } from '@/services/sellerApprovalService';
import type { SellerApprovalRequest, ApprovalAction, RejectionAction } from '@/types/seller';

interface SellerApprovalState {
  pendingRequests: SellerApprovalRequest[];
  loading: boolean;
  error: string | null;
  total: number;
}

const initialState: SellerApprovalState = {
  pendingRequests: [],
  loading: false,
  error: null,
  total: 0
};

// Async thunks
export const fetchPendingRequests = createAsyncThunk(
  'sellerApproval/fetchPendingRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await sellerApprovalAPI.getPendingRequests();
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch pending requests');
    }
  }
);

export const approveSellerRequest = createAsyncThunk(
  'sellerApproval/approveSeller',
  async (data: ApprovalAction, { rejectWithValue }) => {
    try {
      await sellerApprovalAPI.approveSeller(data);
      return data.requestId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to approve seller');
    }
  }
);

export const rejectSellerRequest = createAsyncThunk(
  'sellerApproval/rejectSeller',
  async (data: RejectionAction, { rejectWithValue }) => {
    try {
      await sellerApprovalAPI.rejectSeller(data);
      return data.requestId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to reject seller');
    }
  }
);

const sellerApprovalSlice = createSlice({
  name: 'sellerApproval',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch pending requests
      .addCase(fetchPendingRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingRequests = action.payload.requests;
        state.total = action.payload.total;
      })
      .addCase(fetchPendingRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Approve seller
      .addCase(approveSellerRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveSellerRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingRequests = state.pendingRequests.filter(
          req => req._id !== action.payload
        );
        state.total = Math.max(0, state.total - 1);
      })
      .addCase(approveSellerRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Reject seller
      .addCase(rejectSellerRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectSellerRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingRequests = state.pendingRequests.filter(
          req => req._id !== action.payload
        );
        state.total = Math.max(0, state.total - 1);
      })
      .addCase(rejectSellerRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearError } = sellerApprovalSlice.actions;
export default sellerApprovalSlice.reducer;
