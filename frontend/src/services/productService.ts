import apiClient from '@/lib/api';
import type { Product } from '@/store/catalogSlice';

export interface ProductsResponse {
  products: Product[];
  page: number;
  pages: number;
  total: number;
}

export interface ProductFilters {
  category?: string;
  district?: string;
  supplyType?: string;
  search?: string;
  pageNumber?: number;
}

export interface CreateProductRequest {
  name: string;
  category: string;
  pricePerKg: number;
  supplyType: 'wholesale' | 'small_scale';
  locationDistrict: string;
  stockQty: number;
  description: string;
  image: string;
  negotiationEnabled?: boolean;
  expiresOn: string;
}

export const productAPI = {
  async getProducts(filters?: ProductFilters): Promise<ProductsResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    
    return apiClient.get<ProductsResponse>(endpoint);
  },

  async getProductById(id: string): Promise<Product> {
    return apiClient.get<Product>(`/products/${id}`);
  },

  async getProductsBySeller(sellerId: string): Promise<Product[]> {
    return apiClient.get<Product[]>(`/products/seller/${sellerId}`);
  },

  async getMyProducts(): Promise<Product[]> {
    return apiClient.get<Product[]>('/products/myproducts');
  },

  async createProduct(productData: CreateProductRequest): Promise<Product> {
    return apiClient.post<Product>('/products', productData);
  },

  async updateProduct(id: string, productData: Partial<CreateProductRequest>): Promise<Product> {
    return apiClient.put<Product>(`/products/${id}`, productData);
  },

  async deleteProduct(id: string): Promise<{ message: string }> {
    return apiClient.delete(`/products/${id}`);
  }
};

export default productAPI;