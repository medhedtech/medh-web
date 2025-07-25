import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import axiosRetry from 'axios-retry';
import { apiBaseUrl, apiConfig as configSettings } from '@/apis/config';
import { apiCache } from './cacheService';

/**
 * Extended axios request config with caching options
 */
interface CacheableRequestConfig extends InternalAxiosRequestConfig {
  cache?: boolean;
  cacheTTL?: number;
  cacheKey?: string;
  cached?: boolean;
}

// Define response error shape
interface ApiErrorResponse {
  status?: number;
  data?: any;
  message?: string;
  originalError?: AxiosError;
}

/**
 * API client with enhanced features:
 * - Base configuration
 * - Request/response interceptors
 * - Automatic retry for failed requests
 * - Response caching
 * - Consistent error handling
 */
const createApiClient = (): AxiosInstance => {
  // Create axios instance with base config
  const api = axios.create({
    baseURL: apiBaseUrl, // Use the centralized API URL
    timeout: configSettings.timeout || 15000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  // Configure automatic retry for specific failures
  axiosRetry(api, { 
    retries: configSettings.retryAttempts || 3,
    retryDelay: axiosRetry.exponentialDelay, // Exponential backoff
    retryCondition: (error: AxiosError): boolean => {
      // Retry on network errors or 5xx server errors
      return axiosRetry.isNetworkOrIdempotentRequestError(error) || 
             (error.response !== undefined && error.response.status >= 500);
    }
  });

  // Request interceptor
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      const customConfig = config as unknown as CacheableRequestConfig;
      
      // Add auth token if available
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        config.headers = config.headers || {};
        config.headers['x-access-token'] = token;
      }

      // Check cache for GET requests if not explicitly disabled
      if (config.method === 'get' && customConfig.cache !== false) {
        const cacheKey = `${config.url}|${JSON.stringify(config.params || {})}`;
        const cachedResponse = apiCache.get(cacheKey);
        
        if (cachedResponse) {
          // Return cached response as a canceled request with cached data
          const adapter = () => {
            return Promise.resolve({
              data: cachedResponse,
              status: 200,
              statusText: 'OK',
              headers: {},
              config,
              cached: true
            } as AxiosResponse);
          };
          
          config.adapter = adapter;
        }
        
        // Store the cache key for response interceptor to use
        customConfig.cacheKey = cacheKey;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  api.interceptors.response.use(
    (response: AxiosResponse) => {
      const config = response.config as unknown as CacheableRequestConfig;
      
      // Cache successful GET responses if not already cached
      if (config.method === 'get' && 
          config.cacheKey && 
          !config.cached) {
        // Get TTL from config or use default
        const ttl = config.cacheTTL || undefined;
        apiCache.set(config.cacheKey, response.data, ttl);
      }
      
      return response;
    },
    (error: AxiosError) => {
      // Handle different error types
      if (error.response) {
        // Server responded with a status code outside of 2xx range
        const status = error.response.status;
        
        // Handle authentication errors
        if (status === 401) {
          if (typeof window !== 'undefined') {
            // Optionally redirect to login or refresh token
            console.warn('Authentication error: ', error.response.data);
          }
        }
        
        // Format error for consistent handling
        return Promise.reject({
          status,
          data: error.response.data,
          message: error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data 
            ? error.response.data.message 
            : 'Server error',
          originalError: error
        });
      } else if (error.request) {
        // Request was made but no response received
        return Promise.reject({
          status: 0,
          message: 'No response from server. Please check your internet connection.',
          originalError: error
        });
      } else {
        // Something happened in setting up the request
        return Promise.reject({
          message: error.message || 'Request configuration error',
          originalError: error
        });
      }
    }
  );

  return api;
};

// Export singleton instance
const api = createApiClient();

export default api;

// API Helper Options
interface ApiHelperOptions {
  cache?: boolean;
  cacheTTL?: number;
  [key: string]: any;
}

// Extending AxiosRequestConfig to include cache properties
interface CacheableAxiosRequestConfig extends AxiosRequestConfig {
  cache?: boolean;
  cacheTTL?: number;
}

// Helper methods with built-in error handling
export const apiHelpers = {
  /**
   * Make a GET request with error handling
   * @param {string} url - API endpoint
   * @param {Object} params - URL parameters
   * @param {Object} options - Additional options (cache, cacheTTL)
   * @returns {Promise<any>} - Response data or error
   */
  async get<T = any>(url: string, params: Record<string, any> = {}, options: ApiHelperOptions = {}): Promise<T> {
    try {
      const requestConfig: CacheableAxiosRequestConfig = { 
        params,
        cache: options.cache !== undefined ? options.cache : true,
        cacheTTL: options.cacheTTL
      };
      
      const response = await api.get<T>(url, requestConfig);
      return response.data;
    } catch (error) {
      console.error(`GET ${url} failed:`, error);
      throw error;
    }
  },

  /**
   * Make a POST request with error handling
   * @param {string} url - API endpoint
   * @param {Object} data - Request body
   * @param {Object} options - Additional options
   * @returns {Promise<any>} - Response data or error
   */
  async post<T = any>(url: string, data: Record<string, any> = {}, options: ApiHelperOptions = {}): Promise<T> {
    try {
      const requestConfig: AxiosRequestConfig = {};
      const response = await api.post<T>(url, data, requestConfig);
      return response.data;
    } catch (error) {
      console.error(`POST ${url} failed:`, error);
      throw error;
    }
  },

  /**
   * Make a PUT request with error handling
   * @param {string} url - API endpoint
   * @param {Object} data - Request body
   * @param {Object} options - Additional options
   * @returns {Promise<any>} - Response data or error
   */
  async put<T = any>(url: string, data: Record<string, any> = {}, options: ApiHelperOptions = {}): Promise<T> {
    try {
      const requestConfig: AxiosRequestConfig = {};
      const response = await api.put<T>(url, data, requestConfig);
      return response.data;
    } catch (error) {
      console.error(`PUT ${url} failed:`, error);
      throw error;
    }
  },

  /**
   * Make a DELETE request with error handling
   * @param {string} url - API endpoint
   * @param {Object} options - Additional options
   * @returns {Promise<any>} - Response data or error
   */
  async delete<T = any>(url: string, options: ApiHelperOptions = {}): Promise<T> {
    try {
      const requestConfig: AxiosRequestConfig = {};
      const response = await api.delete<T>(url, requestConfig);
      return response.data;
    } catch (error) {
      console.error(`DELETE ${url} failed:`, error);
      throw error;
    }
  },

  /**
   * Clear the API cache
   */
  clearCache(): void {
    apiCache.clear();
  }
}; 