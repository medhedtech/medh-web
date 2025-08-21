import { apiBaseUrl } from './config';
import { PUBLIC_ENDPOINTS } from './config';
import { getRefreshToken } from '@/utils/auth';

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

// Token interface for JWT decoding
interface DecodedToken {
  exp: number;
  [key: string]: any;
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
  private initialized: boolean = false;

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
    
    // Initialize auth token from storage
    this.initializeToken();
  }

  /**
   * Initialize token from storage on load
   */
  private initializeToken(): void {
    if (this.initialized) return;
    
    try {
      // Only run in browser environment
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authToken') || localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
          this.setAuthToken(token);
        }
        this.initialized = true;
      }
    } catch (err) {
      console.error('Error initializing auth token:', err);
    }
  }

  /**
   * Set authorization token for future requests
   * @param token - JWT or other auth token
   */
  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    this.defaultHeaders['x-access-token'] = token;
  }

  /**
   * Clear authorization token
   */
  clearAuthToken(): void {
    delete this.defaultHeaders['Authorization'];
    delete this.defaultHeaders['x-access-token'];
  }

  /**
   * Get the current auth token from the headers
   */
  getAuthToken(): string | null {
    return this.defaultHeaders['x-access-token'] || 
           (this.defaultHeaders['Authorization']?.startsWith('Bearer ') 
            ? this.defaultHeaders['Authorization'].substring(7) 
            : null);
  }

  /**
   * Ensure authentication token is available for requests
   */
  private ensureAuthToken(endpoint?: string): void {
    // Skip authentication for public endpoints
    if (endpoint && this.isPublicEndpoint(endpoint)) {
      return;
    }
    
    if (!this.getAuthToken() && typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        this.setAuthToken(token);
      }
    }
  }

  /**
   * Check if an endpoint is public and doesn't require authentication
   */
  private isPublicEndpoint(endpoint: string): boolean {
    return PUBLIC_ENDPOINTS.some(publicEndpoint => 
      endpoint.includes(publicEndpoint) || endpoint.startsWith(publicEndpoint)
    );
  }

  /**
   * Make a GET request
   * @param endpoint - API endpoint
   * @param params - Query parameters
   * @param options - Additional fetch options
   * @returns Promise with response data
   */
  async get<T = any>(endpoint: string, params: Record<string, any> = {}, options: RequestInit = {}): Promise<IApiResponse<T>> {
    // Ensure authentication token is set before making request
    this.ensureAuthToken(endpoint);
    
    // Handle cancelToken special parameter
    if (params.cancelToken) {
      // Remove cancelToken from params to avoid serialization issues
      const { cancelToken, ...restParams } = params;
      params = restParams;
    }
    
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
    // Ensure authentication token is set before making request
    this.ensureAuthToken(endpoint);
    
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
    // Ensure authentication token is set before making request
    this.ensureAuthToken(endpoint);
    
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
    // Ensure authentication token is set before making request
    this.ensureAuthToken(endpoint);
    
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
    // Ensure authentication token is set before making request
    this.ensureAuthToken(endpoint);
    
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
    // Ensure authentication token is set before making request
    this.ensureAuthToken(endpoint);
    
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
   * Refresh the auth token
   * @returns Promise resolving to true if refresh successful, false otherwise
   */
  async refreshToken(): Promise<boolean> {
    const currentToken = this.getAuthToken();
    const refreshToken = getRefreshToken();
    
    if (!refreshToken) {
      console.warn('No refresh token available');
      return false;
    }
    
    try {
      // Ensure we're using the proper endpoint format with the API version
      const refreshUrl = `${this.baseUrl}/auth/refresh-token`;
      
      const response = await fetch(refreshUrl, {
        method: 'POST',
        headers: {
          ...this.defaultHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
        credentials: this.credentials,
        mode: this.mode
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.token || (data.data && data.data.access_token)) {
          const newToken = data.token || data.data.access_token;
          this.setAuthToken(newToken);
          this.saveTokenInStorage(newToken);
          
          // Save new refresh token if provided
          if (data.refresh_token || (data.data && data.data.refresh_token)) {
            const newRefreshToken = data.refresh_token || data.data.refresh_token;
            if (typeof window !== 'undefined') {
              localStorage.setItem('refreshToken', newRefreshToken);
            }
          }
          
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return false;
    }
  }

  /**
   * Save token in storage
   * @param token JWT token
   */
  private saveTokenInStorage(token: string): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        sessionStorage.setItem('token', token);
      }
    } catch (err) {
      console.error('Error saving token:', err);
    }
  }

  /**
   * Handle response with retry for 401 errors
   * @param response The fetch response
   * @param retryCount Number of retry attempts
   * @returns Processed response data
   */
  private async handleResponse<T>(response: Response, retryCount = 0, requestOptions?: RequestInit): Promise<IApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    let data: any;

    try {
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else if (contentType?.includes('text/')) {
        data = await response.text();
      } else {
        data = await response.blob();
      }
    } catch (error) {
      // Handle parsing error
      return {
        status: 'error',
        error: 'Failed to parse response',
        message: 'Response parsing failed'
      };
    }

    // Handle unauthorized error with token refresh
    if (response.status === 401 && retryCount === 0) {
      console.log('Received 401 - Attempting token refresh');
      const refreshed = await this.refreshToken();
      
      if (refreshed && requestOptions) {
        console.log('Token refreshed successfully - Retrying original request');
        // Retry the original request with new token
        const originalUrl = response.url;
        return this.request<T>(originalUrl, requestOptions, 1);
      } else {
        console.log('Token refresh failed or no request options available');
      }
    }

    // Handle non-2xx responses
    if (!response.ok) {
      // If still unauthorized after refresh, only redirect for protected endpoints
      if (response.status === 401) {
        // Only redirect to login if this was an authenticated request
        // Check if the original URL was for a public endpoint
        const isPublic = this.isPublicEndpoint(response.url);
        
        if (!isPublic && typeof window !== 'undefined') {
          // Clear stored tokens
          this.clearAuthToken();
          localStorage.removeItem('refreshToken');
          sessionStorage.removeItem('refreshToken');
          // Only redirect to login for protected endpoints
          console.log('Redirecting to login due to 401 on protected endpoint');
          window.location.href = '/login';
        }
        
        return {
          status: 'error',
          error: data.error || data.message || 'Unauthorized',
          message: data.message || 'Unauthorized',
          data
        };
      }
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
  }

  /**
   * Make a request with the AbortController for timeout handling
   * @param url - Full URL to request
   * @param options - Fetch options
   * @param retryCount - Number of retry attempts
   * @returns Promise with response data
   */
  private async request<T = any>(url: string, options: RequestInit = {}, retryCount = 0): Promise<IApiResponse<T>> {
    // Ensure we have a token if available in storage
    if (!this.initialized) {
      this.initializeToken();
    }
    
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
      
      return this.handleResponse<T>(response, retryCount, options);
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
    const baseUrl = endpoint.startsWith('http') ? '' : (this.baseUrl || '');
    
    // Ensure we have a valid URL by checking if baseUrl is empty
    let fullUrl: string;
    if (!baseUrl) {
      // If no baseUrl, use the endpoint directly if it's a complete URL
      if (endpoint.startsWith('http')) {
        fullUrl = endpoint;
      } else {
        // If endpoint is not a complete URL and no baseUrl, use a relative URL
        fullUrl = endpoint;
      }
    } else {
      // Combine baseUrl and endpoint, ensuring no double slashes
      const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
      const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.substring(0, baseUrl.length - 1) : baseUrl;
      fullUrl = `${cleanBaseUrl}/${cleanEndpoint}`;
    }
    
    // Create URL object only if we have a valid URL
    let url: URL;
    try {
      // For relative URLs, we need to use a base URL
      if (!fullUrl.startsWith('http')) {
        // Use window.location.origin as the base for relative URLs
        const base = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
        url = new URL(fullUrl, base);
      } else {
        url = new URL(fullUrl);
      }
    } catch (error) {
      console.error('Invalid URL:', fullUrl, error);
      // Return a fallback URL to prevent the app from crashing
      return fullUrl;
    }
    
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