import apiClient from '@/lib/api';
import type { Category } from '@/store/catalogSlice';

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  icon: string;
}

export const categoryAPI = {
  async getCategories(): Promise<Category[]> {
    return apiClient.get<Category[]>('/categories');
  },

  async getCategoryById(id: string): Promise<Category> {
    return apiClient.get<Category>(`/categories/${id}`);
  },

  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    return apiClient.post<Category>('/categories', data);
  },

  async updateCategory(id: string, data: Partial<CreateCategoryRequest>): Promise<Category> {
    return apiClient.put<Category>(`/categories/${id}`, data);
  },

  async deleteCategory(id: string): Promise<{ message: string }> {
    return apiClient.delete(`/categories/${id}`);
  }
};

export default categoryAPI;