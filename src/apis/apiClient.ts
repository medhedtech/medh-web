import { apiBaseUrl } from './config';

/**
 * API Client configuration options
 */
export interface IApiClientOptions {
  baseUrl?: string;
  headers?: Record<string, string>;
  timeout?: number;
  credentials?: RequestCredentials;
  mode?: RequestMode;
}

/**
 * Standard API response format
 */
export interface IApiResponse<T = any> {
  status: string;
  data?: T;
  error?: string;
  message?: string;
  results?: number;
}

/**
 * Configurable API client for making HTTP requests
 */
export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;
  private credentials: RequestCredentials;
  private mode: RequestMode;

  /**
   * Create a new API client instance
   * @param options - Configuration options
   */
  constructor(options: IApiClientOptions = {}) {
    this.baseUrl = options.baseUrl || apiBaseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers
    };
    this.timeout = options.timeout || 30000; // 30 seconds default
    this.credentials = options.credentials || 'include';
    this.mode = options.mode || 'cors';
  }

  /**
   * Set authorization token for future requests
   * @param token - JWT or other auth token
   */
  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Clear authorization token
   */
  clearAuthToken(): void {
    delete this.defaultHeaders['Authorization'];
  }

  /**
   * Make a GET request
   * @param endpoint - API endpoint
   * @param params - Query parameters
   * @param options - Additional fetch options
   * @returns Promise with response data
   */
  async get<T = any>(endpoint: string, params: Record<string, any> = {}, options: RequestInit = {}): Promise<IApiResponse<T>> {
    const url = this.buildUrl(endpoint, params);
    return this.request<T>(url, {
      method: 'GET',
      ...options
    });
  }

  /**
   * Make a POST request
   * @param endpoint - API endpoint
   * @param data - Request body data
   * @param options - Additional fetch options
   * @returns Promise with response data
   */
  async post<T = any>(endpoint: string, data: any = {}, options: RequestInit = {}): Promise<IApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    return this.request<T>(url, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
  }

  /**
   * Make a PUT request
   * @param endpoint - API endpoint
   * @param data - Request body data
   * @param options - Additional fetch options
   * @returns Promise with response data
   */
  async put<T = any>(endpoint: string, data: any = {}, options: RequestInit = {}): Promise<IApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    return this.request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options
    });
  }

  /**
   * Make a PATCH request
   * @param endpoint - API endpoint
   * @param data - Request body data
   * @param options - Additional fetch options
   * @returns Promise with response data
   */
  async patch<T = any>(endpoint: string, data: any = {}, options: RequestInit = {}): Promise<IApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    return this.request<T>(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...options
    });
  }

  /**
   * Make a DELETE request
   * @param endpoint - API endpoint
   * @param options - Additional fetch options
   * @returns Promise with response data
   */
  async delete<T = any>(endpoint: string, options: RequestInit = {}): Promise<IApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    return this.request<T>(url, {
      method: 'DELETE',
      ...options
    });
  }

  /**
   * Upload a file or multiple files
   * @param endpoint - API endpoint
   * @param formData - FormData with files and other fields
   * @param options - Additional fetch options
   * @returns Promise with response data
   */
  async upload<T = any>(endpoint: string, formData: FormData, options: RequestInit = {}): Promise<IApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    // Don't set Content-Type header for FormData, browser will set it with boundary
    const { 'Content-Type': _, ...headers } = this.defaultHeaders;
    
    return this.request<T>(url, {
      method: 'POST',
      body: formData,
      headers,
      ...options
    });
  }

  /**
   * Make a request with the AbortController for timeout handling
   * @param url - Full URL to request
   * @param options - Fetch options
   * @returns Promise with response data
   */
  private async request<T = any>(url: string, options: RequestInit = {}): Promise<IApiResponse<T>> {
    const controller = new AbortController();
    const { signal } = controller;
    
    // Set up timeout
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers
        },
        credentials: this.credentials,
        mode: this.mode,
        signal
      });

      clearTimeout(timeoutId);

      // Handle different response types
      const contentType = response.headers.get('content-type');
      let data: any;

      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else if (contentType?.includes('text/')) {
        data = await response.text();
      } else {
        data = await response.blob();
      }

      // Handle non-2xx responses
      if (!response.ok) {
        return {
          status: 'error',
          error: data.error || data.message || 'An error occurred',
          message: data.message || 'Request failed',
          data
        };
      }

      return {
        status: 'success',
        data,
        message: data.message || 'Request successful'
      };
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        return {
          status: 'error',
          error: 'Request timeout',
          message: `Request exceeded timeout of ${this.timeout}ms`
        };
      }

      return {
        status: 'error',
        error: error.message || 'An unexpected error occurred',
        message: 'Request failed'
      };
    }
  }

  /**
   * Build a URL with query parameters
   * @param endpoint - API endpoint
   * @param params - Query parameters
   * @returns Full URL
   */
  private buildUrl(endpoint: string, params: Record<string, any> = {}): string {
    // If endpoint already starts with http:// or https://, use as is
    const baseUrl = endpoint.startsWith('http') ? '' : this.baseUrl;
    const url = new URL(`${baseUrl}${endpoint}`);
    
    // Add query parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(item => url.searchParams.append(key, String(item)));
        } else {
          url.searchParams.append(key, String(value));
        }
      }
    });
    
    return url.toString();
  }
}

// Create and export a default API client
export const apiClient = new ApiClient();

// Export a factory function to create custom API clients
export const createApiClient = (options: IApiClientOptions) => new ApiClient(options);