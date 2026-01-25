import apiClient from '@/lib/api';
import type { Negotiation } from '@/store/catalogSlice';

export interface CreateNegotiationRequest {
  productId: string;
  requestedPrice: number;
  notes: string;
}

export interface UpdateNegotiationRequest {
  status: Negotiation['status'];
  counterPrice?: number;
  counterNotes?: string;
  agreedPrice?: number;
}

export interface NegotiationsResponse {
  negotiations: Negotiation[];
  page: number;
  pages: number;
  total: number;
}

export interface NegotiationStats {
  totalNegotiations: number;
  openNegotiations: number;
  counteredNegotiations: number;
  agreedNegotiations: number;
  rejectedNegotiations: number;
}

export const negotiationAPI = {
  async createNegotiation(data: CreateNegotiationRequest): Promise<Negotiation> {
    return apiClient.post<Negotiation>('/negotiations', data);
  },

  async getNegotiations(filters?: { status?: string; pageNumber?: number }): Promise<NegotiationsResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    const endpoint = queryString ? `/negotiations?${queryString}` : '/negotiations';
    
    return apiClient.get<NegotiationsResponse>(endpoint);
  },

  async getNegotiationById(id: string): Promise<Negotiation> {
    return apiClient.get<Negotiation>(`/negotiations/${id}`);
  },

  async getBuyerNegotiations(): Promise<Negotiation[]> {
    return apiClient.get<Negotiation[]>('/negotiations/buyer');
  },

  async getSellerNegotiations(): Promise<Negotiation[]> {
    return apiClient.get<Negotiation[]>('/negotiations/seller');
  },

  async updateNegotiation(id: string, data: UpdateNegotiationRequest): Promise<Negotiation> {
    return apiClient.put<Negotiation>(`/negotiations/${id}`, data);
  },

  async acceptCounter(id: string): Promise<Negotiation> {
    return apiClient.put<Negotiation>(`/negotiations/${id}/accept-counter`);
  },

  async getNegotiationStats(): Promise<NegotiationStats> {
    return apiClient.get<NegotiationStats>('/negotiations/stats');
  }
};

export default negotiationAPI;