import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { apiBaseUrl } from '@/apis';
import { getAuthToken, saveAuthToken, getRefreshToken, saveRefreshToken } from './auth';
import { jwtDecode } from 'jwt-decode';

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

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
const refreshTokenIfNeeded = async (token: string): Promise<string | null> => {
  if (!token) {
    console.warn('No token provided to refreshTokenIfNeeded');
    return null;
  }
  
  if (!isTokenExpired(token)) {
    return token; // Return existing token if it's not expired
  }
  
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    console.warn('No refresh token available for token refresh');
    // Clear invalid tokens
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
    }
    return null;
  }
  
  // If already refreshing, wait for the existing promise
  if (isRefreshing && refreshPromise) {
    console.log('Token refresh already in progress, waiting...');
    return refreshPromise;
  }
  
  // Set refreshing flag and create promise
  isRefreshing = true;
  refreshPromise = (async () => {
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
          timeout: 10000, // 10 second timeout
          // Don't retry on network errors for token refresh
          validateStatus: (status) => status < 500, // Accept any status < 500 as valid response
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
      console.error('Error refreshing token (Axios):', error);
      
      // If it's a 401 or 403, the refresh token is invalid
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.warn('Refresh token is invalid, clearing auth data');
        // Clear invalid tokens to prevent infinite refresh loops
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          sessionStorage.removeItem('token');
        }
        return null; // Return null to indicate auth failure
      }
      
      // Handle network errors (no response)
      if (!error.response) {
        console.warn('Network error during token refresh, keeping existing token for now');
        return token; // Return original token on network errors
      }
    } else {
      // Handle non-Axios errors properly
      console.error('Error refreshing token (Non-Axios):', {
        message: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : 'UnknownError',
        stack: error instanceof Error ? error.stack : undefined,
        errorType: typeof error,
        errorString: String(error),
      });
    }
    
    // For development mode, return the original token to prevent auth loops
    if (process.env.NODE_ENV === 'development') {
      console.warn('Development mode: Returning original token despite refresh failure');
      return token;
    }
    
      return token; // Return original token if refresh failed
    } finally {
      // Reset refreshing flag and promise
      isRefreshing = false;
      refreshPromise = null;
    }
  })();
  
  return refreshPromise;
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
        // More robust token retrieval with multiple fallbacks
        let token = getAuthToken();
        
        // Additional fallbacks if getAuthToken() returns null
        if (!token && typeof window !== 'undefined') {
          // Try direct localStorage access
          token = localStorage.getItem('token');
          
          // Try sessionStorage
          if (!token) {
            token = sessionStorage.getItem('token');
          }
          
          // Try cookies as last resort
          if (!token && document.cookie) {
            const cookieMatch = document.cookie.match(/token=([^;]+)/);
            if (cookieMatch) {
              token = cookieMatch[1];
            }
          }
        }
        
        console.log('🔐 apiWithAuth interceptor debug:', {
          hasToken: !!token,
          tokenLength: token?.length,
          tokenStart: token?.substring(0, 10),
          url: config.url,
          method: config.method?.toUpperCase(),
          storageCheck: {
            localStorage: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false,
            sessionStorage: typeof window !== 'undefined' ? !!sessionStorage.getItem('token') : false,
            cookies: typeof window !== 'undefined' && document.cookie.includes('token=')
          }
        });
        
        if (token) {
          // Try to refresh token if it's expired or close to expiring
          try {
            const refreshedToken = await refreshTokenIfNeeded(token);
            
            // Only use the refreshed token if it's valid
            if (refreshedToken) {
              token = refreshedToken;
              console.log('✅ Using refreshed token');
            } else {
              console.warn('⚠️ Token refresh returned null, using original token');
              // Use original token if refresh returned null but we had a token
            }
          } catch (refreshError) {
            console.warn('Token refresh attempt failed:', refreshError instanceof Error ? refreshError.message : 'Unknown error');
            console.log('🔄 Using original token after refresh failure');
            // Use original token even if refresh failed
          }
          
          // Always add headers if we have a token
          config.headers['Authorization'] = `Bearer ${token}`;
          config.headers['x-access-token'] = token;
          
          console.log('📤 Added auth headers:', {
            hasAuthHeader: !!config.headers['Authorization'],
            hasAccessTokenHeader: !!config.headers['x-access-token'],
            authHeaderStart: config.headers['Authorization']?.substring(0, 20)
          });
        } else {
          console.warn('❌ No auth token found - request will fail with 401');
          // Could optionally reject the request here:
          // return Promise.reject(new Error('No authentication token available'));
        }
        
        return config;
      } catch (error) {
        console.error('Error in auth interceptor:', error instanceof Error ? error.message : 'Unknown error');
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
  createClient: createAuthClient,
  
  // Manual token injection for debugging
  setDebugToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      sessionStorage.setItem('token', token);
      console.log('🔧 Debug token set:', { tokenLength: token.length, tokenStart: token.substring(0, 10) });
    }
  },
  
  // Check current token status
  checkTokenStatus: () => {
    if (typeof window === 'undefined') return { error: 'Not in browser environment' };
    
    const localToken = localStorage.getItem('token');
    const sessionToken = sessionStorage.getItem('token');
    const authUtilToken = getAuthToken();
    
    return {
      localStorage: !!localToken,
      sessionStorage: !!sessionToken,
      authUtil: !!authUtilToken,
      tokensMatch: localToken === sessionToken && localToken === authUtilToken,
      tokenLength: authUtilToken?.length || 0
    };
  }
};

export default apiWithAuth; 