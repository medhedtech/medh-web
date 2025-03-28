import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { apiBaseUrl } from '@/apis';
import { getAuthToken, saveAuthToken } from './auth';
import { jwtDecode } from 'jwt-decode';

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
  if (!isTokenExpired(token)) {
    return token; // Return existing token if it's not expired
  }
  
  try {
    // Call refresh token endpoint
    const response = await axios.post(
      `${apiBaseUrl}/auth/refresh-token`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-access-token': token
        }
      }
    );
    
    if (response.data && response.data.token) {
      // Save the new token and return it
      saveAuthToken(response.data.token);
      return response.data.token;
    }
    
    return token; // Return original token if refresh failed
  } catch (error) {
    console.error('Error refreshing token:', error);
    return token; // Return original token if refresh failed
  }
};

/**
 * Creates an axios instance with authentication headers
 * and automatic token refresh capability
 */
export const createAuthClient = (): AxiosInstance => {
  const axiosInstance = axios.create({
    baseURL: apiBaseUrl
  });
  
  // Request interceptor to add auth headers and refresh token if needed
  axiosInstance.interceptors.request.use(
    async (config) => {
      let token = getAuthToken();
      
      if (token) {
        // Try to refresh token if it's expired or close to expiring
        token = await refreshTokenIfNeeded(token);
        
        // Add both authorization header formats
        config.headers['Authorization'] = `Bearer ${token}`;
        config.headers['x-access-token'] = token;
      }
      
      return config;
    },
    (error) => Promise.reject(error)
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