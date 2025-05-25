import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { apiBaseUrl } from '@/apis';
import { getAuthToken, saveAuthToken, getRefreshToken, saveRefreshToken } from './auth';
import { jwtDecode } from 'jwt-decode';
import { Tooltip } from "react-tooltip";

const COUNTRY_NAME_MAP: Record<string, string> = {
  "USA": "United States of America",
  "UK": "United Kingdom",
  "UAE": "United Arab Emirates",
  // Add more as needed
};

// Check if token is expired or will expire soon
const isTokenExpired = (token: string, thresholdSeconds = 300): boolean => {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Return true if token is expired or will expire within threshold seconds
    return decoded.exp - currentTime < thresholdSeconds;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true; // Assume expired if we can't decode it
  }
};

// Refresh token if needed
const refreshTokenIfNeeded = async (token: string): Promise<string> => {
  if (!token) {
    console.warn('No token provided to refreshTokenIfNeeded');
    return token;
  }
  
  if (!isTokenExpired(token)) {
    return token; // Return existing token if it's not expired
  }
  
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    console.warn('No refresh token available');
    return token;
  }
  
  try {
    console.log('Attempting to refresh token:', {
      tokenLength: token?.length,
      tokenStart: token?.substring(0, 10),
      isExpired: isTokenExpired(token),
      hasRefreshToken: !!refreshToken
    });

    // Call refresh token endpoint with refresh token in body
    const response = await axios.post(
      `${apiBaseUrl}/auth/refresh-token`,
      { refresh_token: refreshToken },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      }
    );
    
    if (response.data && (response.data.token || (response.data.data && response.data.data.access_token))) {
      const newToken = response.data.token || response.data.data.access_token;
      console.log('Token refresh successful:', {
        newTokenLength: newToken?.length,
        newTokenStart: newToken?.substring(0, 10)
      });
      
      // Save the new tokens
      saveAuthToken(newToken);
      
      // Save new refresh token if provided
      if (response.data.refresh_token || (response.data.data && response.data.data.refresh_token)) {
        const newRefreshToken = response.data.refresh_token || response.data.data.refresh_token;
        saveRefreshToken(newRefreshToken);
      }
      
      return newToken;
    }
    
    console.warn('Token refresh failed: No token in response', response.data);
    return token; // Return original token if refresh failed
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error refreshing token:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        isAxiosError: error.isAxiosError,
        stack: error.stack,
      });
    } else {
      console.error('Error refreshing token:', error);
    }
    return token; // Return original token if refresh failed
  }
};

/**
 * Creates an axios instance with authentication headers
 * and automatic token refresh capability
 */
export const createAuthClient = (): AxiosInstance => {
  const axiosInstance = axios.create({
    baseURL: apiBaseUrl,
    timeout: 30000 // Default 30 second timeout
  });
  
  // Request interceptor to add auth headers and refresh token if needed
  axiosInstance.interceptors.request.use(
    async (config) => {
      try {
        let token = getAuthToken();
        
        if (token) {
          // Try to refresh token if it's expired or close to expiring
          token = await refreshTokenIfNeeded(token);
          
          // Add both authorization header formats
          config.headers['Authorization'] = `Bearer ${token}`;
          config.headers['x-access-token'] = token;
        }
        
        return config;
      } catch (error) {
        console.error('Error in auth interceptor:', error);
        // Continue with the request even if token refresh fails
        return config;
      }
    },
    (error) => {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Add response interceptor to handle common errors
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle authentication errors (401)
      if (error.response?.status === 401) {
        console.warn('Authentication failed or token expired');
        // Could emit an event or trigger a logout here if needed
      }
      
      return Promise.reject(error);
    }
  );
  
  return axiosInstance;
};

// Helper for GET requests
export const authGet = async <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
  const client = createAuthClient();
  return client.get<T>(url, config);
};

// Helper for POST requests
export const authPost = async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
  const client = createAuthClient();
  return client.post<T>(url, data, config);
};

// Helper for PUT requests
export const authPut = async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
  const client = createAuthClient();
  return client.put<T>(url, data, config);
};

// Helper for PATCH requests
export const authPatch = async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
  const client = createAuthClient();
  return client.patch<T>(url, data, config);
};

// Helper for DELETE requests
export const authDelete = async <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
  const client = createAuthClient();
  return client.delete<T>(url, config);
};

// Default export with all methods
const apiWithAuth = {
  get: authGet,
  post: authPost,
  put: authPut,
  patch: authPatch,
  delete: authDelete,
  createClient: createAuthClient
};

export default apiWithAuth; 