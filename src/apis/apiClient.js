import axios from 'axios';
import axiosRetry from 'axios-retry';
import { apiBaseUrl } from './index';
import { logger } from '../utils/logger';

// Example: set this from your .env file or a build config.
const isDevelopment = process.env.NODE_ENV !== 'production';

// Create and configure axios instance.
const apiInstance = () => {
  const api = axios.create({
    baseURL: apiBaseUrl,
    // Critical for CORS with credentials
    withCredentials: true,
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    // Timeout in milliseconds
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000', 10)
  });

  // Configure retries.
  axiosRetry(api, {
    retries: parseInt(process.env.NEXT_PUBLIC_API_RETRY_COUNT || '3', 10),
    retryDelay: (retryCount) => {
      // Exponential backoff or custom logic
      const baseDelay = parseInt(process.env.NEXT_PUBLIC_API_RETRY_DELAY || '1000', 10);
      return retryCount * baseDelay; // E.g., 1s, 2s, 3s
    },
    retryCondition: (error) => {
      // Don't retry on CORS errors
      if (error.response && error.response.status === 0) {
        return false;
      }
      
      // Only retry on network errors or 5xx responses
      return (
        axiosRetry.isNetworkError(error) ||
        (error.response && error.response.status >= 500)
      );
    }
  });

  // Request interceptor (add tokens, logging, etc.).
  api.interceptors.request.use(
    (config) => {
      try {
        // Try to get token from localStorage first, then sessionStorage
        let accessToken = localStorage.getItem('token');
        
        // If no token in localStorage, check sessionStorage
        if (!accessToken) {
          accessToken = sessionStorage.getItem('token');
        }
        
        if (accessToken) {
          // Add both header formats to support different backend expectations
          config.headers['Authorization'] = `Bearer ${accessToken}`;
          config.headers['x-access-token'] = accessToken;
          
          if (isDevelopment) {
            logger.log('Auth token found and applied to request');
          }
        } else if (isDevelopment) {
          logger.log('No auth token found in storage - request may fail if authentication is required');
        }
        
        // Log request details only in development
        if (isDevelopment) {
          logger.log('REQUEST', config);
        }
      } catch (e) {
        // Optionally handle storage errors
        if (isDevelopment) {
          logger.log('Storage read error', e);
        }
      }
      return config;
    },
    (error) => {
      // In development, log request errors
      if (isDevelopment) {
        logger.log('REQUEST_ERROR', error);
      }
      return Promise.reject(error);
    }
  );

  // Response interceptor (handle logging & errors).
  api.interceptors.response.use(
    (response) => {
      if (isDevelopment) {
        logger.log('RESPONSE', response);
      }
      return response;
    },
    (error) => {
      // Handle CORS specific errors
      if (error.message && error.message.includes('Network Error')) {
        if (isDevelopment) {
          logger.log('CORS_ERROR', 'Possible CORS issue detected');
        }
        
        // Dispatch event for CORS error handling
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('api:cors-error', { 
            detail: { 
              url: error.config?.url,
              message: 'Request failed due to CORS policy. Please contact support if this persists.'
            }
          }));
        }
        
        return Promise.reject({
          ...error,
          isCorsError: true,
          friendlyMessage: 'Unable to connect to the API due to cross-origin restrictions.'
        });
      }
      
      if (error?.response) {
        // Check for error details
        const detail = error.response.data?.detail || 'Unknown Error';
        if (isDevelopment) {
          logger.log('RESPONSE_ERROR', detail);
        }
        
        // Handle authentication errors
        if (error.response.status === 401) {
          // Optionally redirect to login page or handle token refresh
          // For now, just log the error
          if (isDevelopment) {
            logger.log('Authentication error - you may need to log in again');
          }
          
          // Example: Dispatch an event that can be caught by auth components
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('auth:error', { 
              detail: { status: 401, message: 'Authentication required' }
            }));
          }
        }
      } else {
        // If no response, e.g. network error
        if (isDevelopment) {
          logger.log('NETWORK_ERROR', error);
        }
      }
      return Promise.reject(error);
    }
  );

  return api;
};

const apiClient = apiInstance();

// Add utility functions to check endpoint existence
apiClient.checkEndpoint = async (url) => {
  try {
    // Perform HEAD request to check if endpoint exists
    await apiClient.head(url);
    return { exists: true, error: null };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // If we get any response, the endpoint exists but might return an error
      if (error.response.status === 404) {
        return { exists: false, error };
      }
      // Other error codes mean the endpoint exists but returned an error
      return { exists: true, error };
    }
    // Network error or other issues
    return { exists: false, error };
  }
};

// Add a method to test CORS configuration
apiClient.testCorsConfiguration = async () => {
  try {
    const response = await apiClient.options(`${apiBaseUrl}/cors-test`);
    return { 
      success: true, 
      headers: response.headers,
      message: 'CORS configuration is working correctly'
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      message: 'CORS configuration test failed'
    };
  }
};

export default apiClient;