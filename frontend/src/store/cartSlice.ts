import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { cartAPI, type CartItem as APICartItem, type Cart as APICart } from '@/services/cartService';

export interface CartItem {
  productId: string;
  productName: string;
  pricePerKg: number;
  qty: number;
  image: string;
  sellerId: string; 
  sellerName: string;
}

interface CartState {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  totalWeight: number;
  redeemedPoints: number;
  loading: boolean;
  error: string | null;
  synced: boolean; // Track if cart is synced with backend
}

// Async thunks for cart operations
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const cart = await cartAPI.getCart();
      return cart;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch cart');
    }
  }
);

export const addToCartAPI = createAsyncThunk(
  'cart/addToCartAPI',
  async (item: CartItem, { rejectWithValue }) => {
    try {
      const cart = await cartAPI.addToCart(item);
      return cart;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to add item to cart');
    }
  }
);

export const updateCartItemAPI = createAsyncThunk(
  'cart/updateCartItemAPI',
  async ({ productId, qty }: { productId: string; qty: number }, { rejectWithValue }) => {
    try {
      const cart = await cartAPI.updateCartItem(productId, qty);
      return cart;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update cart item');
    }
  }
);

export const removeFromCartAPI = createAsyncThunk(
  'cart/removeFromCartAPI',
  async (productId: string, { rejectWithValue }) => {
    try {
      const cart = await cartAPI.removeFromCart(productId);
      return cart;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to remove item from cart');
    }
  }
);

export const clearCartAPI = createAsyncThunk(
  'cart/clearCartAPI',
  async (_, { rejectWithValue }) => {
    try {
      const cart = await cartAPI.clearCart();
      return cart;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to clear cart');
    }
  }
);

export const updateRedeemedPointsAPI = createAsyncThunk(
  'cart/updateRedeemedPointsAPI',
  async (redeemedPoints: number, { rejectWithValue }) => {
    try {
      const cart = await cartAPI.updateRedeemedPoints(redeemedPoints);
      return cart;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update redeemed points');
    }
  }
);

// Load cart from localStorage (for offline use)
const loadCart = (): Pick<CartState, 'items' | 'subtotal' | 'deliveryFee' | 'total' | 'totalWeight' | 'redeemedPoints'> => {
  try {
    const storedCart = localStorage.getItem('agrilink_cart');
    if (storedCart) {
      const parsed = JSON.parse(storedCart);
      // Recalculate totals to ensure consistency
      const totals = calculateTotals(parsed.items || [], parsed.redeemedPoints || 0);
      return { ...parsed, ...totals, redeemedPoints: parsed.redeemedPoints || 0 };
    }
  } catch (error) {
    console.error('Error loading cart:', error);
  }
  return { items: [], subtotal: 0, deliveryFee: 0, total: 0, totalWeight: 0, redeemedPoints: 0 };
};

// Weight-based delivery fee calculation
// 1 kg = Rs. 180, 2 kg = Rs. 300, then Rs. 120 per additional kg
const calculateDeliveryFee = (totalWeight: number): number => {
  if (totalWeight <= 0) return 0;
  if (totalWeight <= 1) return 180;
  if (totalWeight <= 2) return 300;
  return 300 + (totalWeight - 2) * 120;
};

const calculateTotals = (items: CartItem[], redeemedPoints: number = 0): { subtotal: number; deliveryFee: number; total: number; totalWeight: number } => {
  const totalWeight = items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = items.reduce((sum, item) => sum + item.pricePerKg * item.qty, 0);
  const deliveryFee = calculateDeliveryFee(totalWeight);
  // 1 point = Rs. 1 discount
  const pointsDiscount = Math.min(redeemedPoints, subtotal + deliveryFee);
  const total = Math.max(0, subtotal + deliveryFee - pointsDiscount);
  return { subtotal, deliveryFee, total, totalWeight };
};

const savedCart = loadCart();
const initialState: CartState = {
  ...savedCart,
  loading: false,
  error: null,
  synced: false, // Will be set to true when cart is loaded from backend
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Local cart operations (for offline use)
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find((item) => item.productId === action.payload.productId);
      
      if (existingItem) {
        existingItem.qty += action.payload.qty;
      } else {
        state.items.push(action.payload);
      }
      
      const totals = calculateTotals(state.items, state.redeemedPoints);
      state.subtotal = totals.subtotal;
      state.deliveryFee = totals.deliveryFee;
      state.total = totals.total;
      state.totalWeight = totals.totalWeight;
      state.synced = false; // Mark as unsynced
      
      localStorage.setItem('agrilink_cart', JSON.stringify({
        items: state.items,
        subtotal: state.subtotal,
        deliveryFee: state.deliveryFee,
        total: state.total,
        totalWeight: state.totalWeight,
        redeemedPoints: state.redeemedPoints
      }));
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.productId !== action.payload);
      
      const totals = calculateTotals(state.items, state.redeemedPoints);
      state.subtotal = totals.subtotal;
      state.deliveryFee = totals.deliveryFee;
      state.total = totals.total;
      state.totalWeight = totals.totalWeight;
      state.synced = false;
      
      localStorage.setItem('agrilink_cart', JSON.stringify({
        items: state.items,
        subtotal: state.subtotal,
        deliveryFee: state.deliveryFee,
        total: state.total,
        totalWeight: state.totalWeight,
        redeemedPoints: state.redeemedPoints
      }));
    },
    updateQty: (state, action: PayloadAction<{ productId: string; qty: number }>) => {
      const item = state.items.find((item) => item.productId === action.payload.productId);
      
      if (item) {
        item.qty = action.payload.qty;
        
        if (item.qty <= 0) {
          state.items = state.items.filter((i) => i.productId !== action.payload.productId);
        }
      }
      
      const totals = calculateTotals(state.items, state.redeemedPoints);
      state.subtotal = totals.subtotal;
      state.deliveryFee = totals.deliveryFee;
      state.total = totals.total;
      state.totalWeight = totals.totalWeight;
      state.synced = false;
      
      localStorage.setItem('agrilink_cart', JSON.stringify({
        items: state.items,
        subtotal: state.subtotal,
        deliveryFee: state.deliveryFee,
        total: state.total,
        totalWeight: state.totalWeight,
        redeemedPoints: state.redeemedPoints
      }));
    },
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.deliveryFee = 0;
      state.total = 0;
      state.totalWeight = 0;
      state.redeemedPoints = 0;
      state.synced = false;
      localStorage.removeItem('agrilink_cart');
    },
    setRedeemedPoints: (state, action: PayloadAction<number>) => {
      state.redeemedPoints = action.payload;
      const totals = calculateTotals(state.items, state.redeemedPoints);
      state.subtotal = totals.subtotal;
      state.deliveryFee = totals.deliveryFee;
      state.total = totals.total;
      state.totalWeight = totals.totalWeight;
      state.synced = false;
      localStorage.setItem('agrilink_cart', JSON.stringify({
        items: state.items,
        subtotal: state.subtotal,
        deliveryFee: state.deliveryFee,
        total: state.total,
        totalWeight: state.totalWeight,
        redeemedPoints: state.redeemedPoints
      }));
    },
    clearError: (state) => {
      state.error = null;
    },
    // Utility action to merge cart data from backend
    mergeCartFromBackend: (state, action: PayloadAction<APICart>) => {
      const backendCart = action.payload;
      state.items = backendCart.items;
      state.subtotal = backendCart.subtotal;
      state.deliveryFee = backendCart.deliveryFee;
      state.total = backendCart.total;
      state.totalWeight = backendCart.totalWeight;
      state.redeemedPoints = backendCart.redeemedPoints;
      state.synced = true;
      
      // Update localStorage
      localStorage.setItem('agrilink_cart', JSON.stringify({
        items: state.items,
        subtotal: state.subtotal,
        deliveryFee: state.deliveryFee,
        total: state.total,
        totalWeight: state.totalWeight,
        redeemedPoints: state.redeemedPoints
      }));
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.subtotal = action.payload.subtotal;
        state.deliveryFee = action.payload.deliveryFee;
        state.total = action.payload.total;
        state.totalWeight = action.payload.totalWeight;
        state.redeemedPoints = action.payload.redeemedPoints;
        state.synced = true;
        
        // Update localStorage
        localStorage.setItem('agrilink_cart', JSON.stringify({
          items: state.items,
          subtotal: state.subtotal,
          deliveryFee: state.deliveryFee,
          total: state.total,
          totalWeight: state.totalWeight,
          redeemedPoints: state.redeemedPoints
        }));
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add to cart API
      .addCase(addToCartAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.subtotal = action.payload.subtotal;
        state.deliveryFee = action.payload.deliveryFee;
        state.total = action.payload.total;
        state.totalWeight = action.payload.totalWeight;
        state.redeemedPoints = action.payload.redeemedPoints;
        state.synced = true;
        
        localStorage.setItem('agrilink_cart', JSON.stringify({
          items: state.items,
          subtotal: state.subtotal,
          deliveryFee: state.deliveryFee,
          total: state.total,
          totalWeight: state.totalWeight,
          redeemedPoints: state.redeemedPoints
        }));
      })
      .addCase(addToCartAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update cart item API
      .addCase(updateCartItemAPI.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.subtotal = action.payload.subtotal;
        state.deliveryFee = action.payload.deliveryFee;
        state.total = action.payload.total;
        state.totalWeight = action.payload.totalWeight;
        state.redeemedPoints = action.payload.redeemedPoints;
        state.synced = true;
        
        localStorage.setItem('agrilink_cart', JSON.stringify({
          items: state.items,
          subtotal: state.subtotal,
          deliveryFee: state.deliveryFee,
          total: state.total,
          totalWeight: state.totalWeight,
          redeemedPoints: state.redeemedPoints
        }));
      })
      .addCase(updateCartItemAPI.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Remove from cart API
      .addCase(removeFromCartAPI.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.subtotal = action.payload.subtotal;
        state.deliveryFee = action.payload.deliveryFee;
        state.total = action.payload.total;
        state.totalWeight = action.payload.totalWeight;
        state.redeemedPoints = action.payload.redeemedPoints;
        state.synced = true;
        
        localStorage.setItem('agrilink_cart', JSON.stringify({
          items: state.items,
          subtotal: state.subtotal,
          deliveryFee: state.deliveryFee,
          total: state.total,
          totalWeight: state.totalWeight,
          redeemedPoints: state.redeemedPoints
        }));
      })
      .addCase(removeFromCartAPI.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Clear cart API
      .addCase(clearCartAPI.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.subtotal = action.payload.subtotal;
        state.deliveryFee = action.payload.deliveryFee;
        state.total = action.payload.total;
        state.totalWeight = action.payload.totalWeight;
        state.redeemedPoints = action.payload.redeemedPoints;
        state.synced = true;
        localStorage.removeItem('agrilink_cart');
      })
      .addCase(clearCartAPI.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Update redeemed points API
      .addCase(updateRedeemedPointsAPI.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.subtotal = action.payload.subtotal;
        state.deliveryFee = action.payload.deliveryFee;
        state.total = action.payload.total;
        state.totalWeight = action.payload.totalWeight;
        state.redeemedPoints = action.payload.redeemedPoints;
        state.synced = true;
        
        localStorage.setItem('agrilink_cart', JSON.stringify({
          items: state.items,
          subtotal: state.subtotal,
          deliveryFee: state.deliveryFee,
          total: state.total,
          totalWeight: state.totalWeight,
          redeemedPoints: state.redeemedPoints
        }));
      })
      .addCase(updateRedeemedPointsAPI.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQty, 
  clearCart, 
  setRedeemedPoints, 
  clearError, 
  mergeCartFromBackend 
} = cartSlice.actions;

export default cartSlice.reducer;
