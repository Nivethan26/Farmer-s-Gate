// API configuration and base setup
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// API instance with default configuration
class APIClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.loadToken();
  }

  private loadToken() {
    try {
      const authData = localStorage.getItem('agrilink_auth');
      if (authData) {
        const { token } = JSON.parse(authData);
        if (token) {
          this.token = token;
        }
      }
    } catch (error) {
      console.warn('Failed to load token from storage');
    }
  }

  setToken(token: string) {
    this.token = token;
  }

  refreshToken() {
    this.loadToken();
  }

  clearToken() {
    this.token = null;
  }

  private getHeaders(isFormData: boolean = false) {
    // Always refresh token before making a request
    this.loadToken();
    
    const headers: Record<string, string> = {};

    // Don't set Content-Type for FormData - let the browser set it
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const isFormData = options.body instanceof FormData;
    const headers = this.getHeaders(isFormData);

    const config: RequestInit = {
      headers: { ...headers, ...options.headers },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    // Handle FormData differently - don't stringify it
    const body = data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined);
    
    return this.request<T>(endpoint, {
      method: 'POST',
      body,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create and export the API client instance
const apiClient = new APIClient(API_BASE_URL);

export default apiClient;