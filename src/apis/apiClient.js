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
    // Optional: You can set default headers like this if needed
    // headers: { 'Content-Type': 'application/json' }
  });

  // Configure retries.
  axiosRetry(api, {
    retries: 3,             // Number of retries
    retryDelay: (retryCount) => {
      // Exponential backoff or custom logic
      return retryCount * 1000; // E.g., 1s, 2s, 3s
    },
    retryCondition: (error) => {
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

export default apiClient;