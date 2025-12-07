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
  totalWeight: number;
  redeemedPoints: number;
}

// Load cart from localStorage
const loadCart = (): CartState => {
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
      
      const totals = calculateTotals(state.items, state.redeemedPoints);
      state.subtotal = totals.subtotal;
      state.deliveryFee = totals.deliveryFee;
      state.total = totals.total;
      state.totalWeight = totals.totalWeight;
      
      localStorage.setItem('agrilink_cart', JSON.stringify(state));
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.productId !== action.payload);
      
      const totals = calculateTotals(state.items, state.redeemedPoints);
      state.subtotal = totals.subtotal;
      state.deliveryFee = totals.deliveryFee;
      state.total = totals.total;
      state.totalWeight = totals.totalWeight;
      
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
      
      const totals = calculateTotals(state.items, state.redeemedPoints);
      state.subtotal = totals.subtotal;
      state.deliveryFee = totals.deliveryFee;
      state.total = totals.total;
      state.totalWeight = totals.totalWeight;
      
      localStorage.setItem('agrilink_cart', JSON.stringify(state));
    },
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.deliveryFee = 0;
      state.total = 0;
      state.totalWeight = 0;
      state.redeemedPoints = 0;
      localStorage.removeItem('agrilink_cart');
    },
    setRedeemedPoints: (state, action: PayloadAction<number>) => {
      state.redeemedPoints = action.payload;
      const totals = calculateTotals(state.items, state.redeemedPoints);
      state.subtotal = totals.subtotal;
      state.deliveryFee = totals.deliveryFee;
      state.total = totals.total;
      state.totalWeight = totals.totalWeight;
      localStorage.setItem('agrilink_cart', JSON.stringify(state));
    },
  },
});

export const { addToCart, removeFromCart, updateQty, clearCart, setRedeemedPoints } = cartSlice.actions;
export default cartSlice.reducer;
