import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import productsData from '@/data/products.json';
import categoriesData from '@/data/categories.json';
import negotiationsData from '@/data/negotiations.json';

export interface Product {
  id: string;
  name: string;
  category: string;
  pricePerKg: number;
  supplyType: 'wholesale' | 'small_scale';
  locationDistrict: string;
  image: string;
  stockQty: number;
  sellerId: string;
  sellerName: string;
  description: string;
  createdAt: string;
  expiresOn: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export interface Negotiation {
  id: string;
  productId: string;
  productName: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  currentPrice: number;
  requestedPrice: number;
  notes: string;
  status: 'open' | 'countered' | 'agreed' | 'rejected';
  counterPrice?: number;
  counterNotes?: string;
  agreedPrice?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Filters {
  categories: string[];
  districts: string[];
  supplyTypes: string[];
  minPrice: number;
  maxPrice: number;
  search: string;
  sortBy: 'price_asc' | 'price_desc' | 'newest' | 'oldest';
}

interface CatalogState {
  products: Product[];
  categories: Category[];
  negotiations: Negotiation[];
  filters: Filters;
}

const initialState: CatalogState = {
  products: productsData as Product[],
  categories: categoriesData as Category[],
  negotiations: negotiationsData as Negotiation[],
  filters: {
    categories: [],
    districts: [],
    supplyTypes: [],
    minPrice: 0,
    maxPrice: 10000,
    search: '',
    sortBy: 'newest',
  },
};

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<Filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
    },
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload);
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.categories.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter((c) => c.id !== action.payload);
    },
    createNegotiation: (state, action: PayloadAction<Negotiation>) => {
      state.negotiations.push(action.payload);
    },
    updateNegotiationStatus: (
      state,
      action: PayloadAction<{
        id: string;
        status: Negotiation['status'];
        counterPrice?: number;
        counterNotes?: string;
        agreedPrice?: number;
      }>
    ) => {
      const index = state.negotiations.findIndex((n) => n.id === action.payload.id);
      if (index !== -1) {
        state.negotiations[index] = {
          ...state.negotiations[index],
          status: action.payload.status,
          counterPrice: action.payload.counterPrice,
          counterNotes: action.payload.counterNotes,
          agreedPrice: action.payload.agreedPrice,
          updatedAt: new Date().toISOString(),
        };
      }
    },
  },
});

export const {
  setFilters,
  resetFilters,
  addProduct,
  updateProduct,
  deleteProduct,
  addCategory,
  updateCategory,
  deleteCategory,
  createNegotiation,
  updateNegotiationStatus,
} = catalogSlice.actions;

export default catalogSlice.reducer;
