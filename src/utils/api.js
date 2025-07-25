import axios from 'axios';
import axiosRetry from 'axios-retry';
import { apiCache } from './cacheService';

/**
 * API client with enhanced features:
 * - Base configuration
 * - Request/response interceptors
 * - Automatic retry for failed requests
 * - Response caching
 * - Consistent error handling
 */
const createApiClient = () => {
  // Create axios instance with base config
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.medh.co/api/v1',
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  // Configure automatic retry for specific failures
  axiosRetry(api, { 
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay, // Exponential backoff
    retryCondition: (error) => {
      // Retry on network errors or 5xx server errors
      return axiosRetry.isNetworkOrIdempotentRequestError(error) || 
             (error.response && error.response.status >= 500);
    }
  });

  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      // Add auth token if available
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        config.headers['x-access-token'] = token;
      }

      // Check cache for GET requests if not explicitly disabled
      if (config.method === 'get' && config.cache !== false) {
        const cacheKey = `${config.url}|${JSON.stringify(config.params || {})}`;
        const cachedResponse = apiCache.get(cacheKey);
        
        if (cachedResponse) {
          // Return cached response as a canceled request with cached data
          config.adapter = () => {
            return Promise.resolve({
              data: cachedResponse,
              status: 200,
              statusText: 'OK',
              headers: {},
              config,
              cached: true
            });
          };
        }
        
        // Store the cache key for response interceptor to use
        config.cacheKey = cacheKey;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  api.interceptors.response.use(
    (response) => {
      // Cache successful GET responses if not already cached
      if (response.config.method === 'get' && 
          response.config.cacheKey && 
          !response.cached) {
        // Get TTL from config or use default
        const ttl = response.config.cacheTTL || undefined;
        apiCache.set(response.config.cacheKey, response.data, ttl);
      }
      
      return response;
    },
    (error) => {
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
          message: error.response.data?.message || 'Server error',
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

// Helper methods with built-in error handling
export const apiHelpers = {
  /**
   * Make a GET request with error handling
   * @param {string} url - API endpoint
   * @param {Object} params - URL parameters
   * @param {Object} options - Additional options (cache, cacheTTL)
   * @returns {Promise<any>} - Response data or error
   */
  async get(url, params = {}, options = {}) {
    try {
      const response = await api.get(url, { 
        params,
        cache: options.cache !== undefined ? options.cache : true,
        cacheTTL: options.cacheTTL
      });
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
  async post(url, data = {}, options = {}) {
    try {
      const response = await api.post(url, data, options);
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
  async put(url, data = {}, options = {}) {
    try {
      const response = await api.put(url, data, options);
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
  async delete(url, options = {}) {
    try {
      const response = await api.delete(url, options);
      return response.data;
    } catch (error) {
      console.error(`DELETE ${url} failed:`, error);
      throw error;
    }
  },

  /**
   * Clear the API cache
   */
  clearCache() {
    apiCache.clear();
  }
}; 