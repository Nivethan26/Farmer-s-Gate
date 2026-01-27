import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { productAPI } from '@/services/productService';
import { categoryAPI } from '@/services/categoryService';
import { negotiationAPI } from '@/services/negotiationService';

export interface Product {
  _id: string;
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
  negotiationEnabled: boolean;
}

export interface Category {
  _id: string;
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export interface Negotiation {
  _id: string;
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
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pages: number;
    total: number;
  };
}

// Async thunks
export const fetchProducts = createAsyncThunk(
  'catalog/fetchProducts',
  async (filters: any = {}, { rejectWithValue }) => {
    try {
      const response = await productAPI.getProducts(filters);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch products');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'catalog/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await categoryAPI.getCategories();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch categories');
    }
  }
);

export const fetchNegotiations = createAsyncThunk(
  'catalog/fetchNegotiations',
  async (filters: any = {}, { rejectWithValue }) => {
    try {
      const response = await negotiationAPI.getNegotiations(filters);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch negotiations');
    }
  }
);

export const fetchSellerNegotiations = createAsyncThunk(
  'catalog/fetchSellerNegotiations',
  async (_, { rejectWithValue }) => {
    try {
      const negotiations = await negotiationAPI.getSellerNegotiations();
      return { negotiations };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch seller negotiations');
    }
  }
);

export const fetchBuyerNegotiations = createAsyncThunk(
  'catalog/fetchBuyerNegotiations',
  async (_, { rejectWithValue }) => {
    try {
      const negotiations = await negotiationAPI.getBuyerNegotiations();
      return { negotiations };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch buyer negotiations');
    }
  }
);

export const createProduct = createAsyncThunk(
  'catalog/createProduct',
  async (productData: any, { rejectWithValue }) => {
    try {
      return await productAPI.createProduct(productData);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'catalog/updateProduct',
  async (productData: any, { rejectWithValue }) => {
    try {
      const { id, _id, ...data } = productData;
      const productId = id || _id;
      return await productAPI.updateProduct(productId, data);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'catalog/deleteProduct',
  async (id: string, { rejectWithValue }) => {
    try {
      await productAPI.deleteProduct(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete product');
    }
  }
);

export const createNegotiation = createAsyncThunk(
  'catalog/createNegotiation',
  async (negotiationData: any, { rejectWithValue }) => {
    try {
      return await negotiationAPI.createNegotiation(negotiationData);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create negotiation');
    }
  }
);

export const updateNegotiationStatus = createAsyncThunk(
  'catalog/updateNegotiationStatus',
  async (negotiationData: { id: string; status: 'open' | 'countered' | 'agreed' | 'rejected'; counterPrice?: number; counterNotes?: string; agreedPrice?: number }, { rejectWithValue }) => {
    try {
      const { id, ...data } = negotiationData;
      return await negotiationAPI.updateNegotiation(id, data);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update negotiation');
    }
  }
);

const initialState: CatalogState = {
  products: [],
  categories: [],
  negotiations: [],
  filters: {
    categories: [],
    districts: [],
    supplyTypes: [],
    minPrice: 0,
    maxPrice: 10000,
    search: '',
    sortBy: 'newest',
  },
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pages: 1,
    total: 0,
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
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products.map(p => ({ ...p, id: p._id }));
        state.pagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          total: action.payload.total,
        };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload.map(c => ({ ...c, id: c._id }));
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Fetch negotiations
      .addCase(fetchNegotiations.fulfilled, (state, action) => {
        state.negotiations = action.payload.negotiations?.map(n => ({ ...n, id: n._id })) || [];
      })
      .addCase(fetchNegotiations.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Fetch seller negotiations
      .addCase(fetchSellerNegotiations.fulfilled, (state, action) => {
        state.negotiations = action.payload.negotiations?.map(n => ({ ...n, id: n._id })) || [];
      })
      .addCase(fetchSellerNegotiations.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Fetch buyer negotiations
      .addCase(fetchBuyerNegotiations.fulfilled, (state, action) => {
        state.negotiations = action.payload.negotiations?.map(n => ({ ...n, id: n._id })) || [];
      })
      .addCase(fetchBuyerNegotiations.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Create product
      .addCase(createProduct.fulfilled, (state, action) => {
        const product = { ...action.payload, id: action.payload._id };
        state.products.unshift(product);
      })
      // Update product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = { ...action.payload, id: action.payload._id };
        }
      })
      // Delete product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload && p.id !== action.payload);
      })
      // Create negotiation
      .addCase(createNegotiation.fulfilled, (state, action) => {
        const negotiation = { ...action.payload, id: action.payload._id };
        state.negotiations.unshift(negotiation);
      })
      .addCase(createNegotiation.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Update negotiation status
      .addCase(updateNegotiationStatus.fulfilled, (state, action) => {
        const index = state.negotiations.findIndex((n) => n._id === action.payload._id);
        if (index !== -1) {
          state.negotiations[index] = { ...action.payload, id: action.payload._id };
        }
      })
      .addCase(updateNegotiationStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  setFilters,
  resetFilters,
  clearError,
} = catalogSlice.actions;

// Alias exports for backwards compatibility
export { createProduct as addProduct };

export default catalogSlice.reducer;
