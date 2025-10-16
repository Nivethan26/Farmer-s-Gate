import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
}

// Load cart from localStorage
const loadCart = (): CartState => {
  try {
    const storedCart = localStorage.getItem('agrilink_cart');
    if (storedCart) {
      return JSON.parse(storedCart);
    }
  } catch (error) {
    console.error('Error loading cart:', error);
  }
  return { items: [], subtotal: 0, deliveryFee: 0, total: 0 };
};

const calculateTotals = (items: CartItem[]): { subtotal: number; deliveryFee: number; total: number } => {
  const subtotal = items.reduce((sum, item) => sum + item.pricePerKg * item.qty, 0);
  const deliveryFee = subtotal > 0 ? (subtotal > 5000 ? 500 : 250) : 0;
  const total = subtotal + deliveryFee;
  return { subtotal, deliveryFee, total };
};

const initialState: CartState = loadCart();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find((item) => item.productId === action.payload.productId);
      
      if (existingItem) {
        existingItem.qty += action.payload.qty;
      } else {
        state.items.push(action.payload);
      }
      
      const totals = calculateTotals(state.items);
      state.subtotal = totals.subtotal;
      state.deliveryFee = totals.deliveryFee;
      state.total = totals.total;
      
      localStorage.setItem('agrilink_cart', JSON.stringify(state));
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.productId !== action.payload);
      
      const totals = calculateTotals(state.items);
      state.subtotal = totals.subtotal;
      state.deliveryFee = totals.deliveryFee;
      state.total = totals.total;
      
      localStorage.setItem('agrilink_cart', JSON.stringify(state));
    },
    updateQty: (state, action: PayloadAction<{ productId: string; qty: number }>) => {
      const item = state.items.find((item) => item.productId === action.payload.productId);
      
      if (item) {
        item.qty = action.payload.qty;
        
        if (item.qty <= 0) {
          state.items = state.items.filter((i) => i.productId !== action.payload.productId);
        }
      }
      
      const totals = calculateTotals(state.items);
      state.subtotal = totals.subtotal;
      state.deliveryFee = totals.deliveryFee;
      state.total = totals.total;
      
      localStorage.setItem('agrilink_cart', JSON.stringify(state));
    },
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.deliveryFee = 0;
      state.total = 0;
      localStorage.removeItem('agrilink_cart');
    },
  },
});

export const { addToCart, removeFromCart, updateQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
