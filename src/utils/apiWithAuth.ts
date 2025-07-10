import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { apiBaseUrl, PUBLIC_ENDPOINTS, requiresAuthentication } from '@/apis';
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

// Check if the endpoint is public (doesn't require authentication)
const isPublicEndpoint = (url: string): boolean => {
  if (!url) return false;
  
  // Check against the PUBLIC_ENDPOINTS array
  const isPublic = PUBLIC_ENDPOINTS.some(endpoint => 
    url.includes(endpoint) || url.endsWith(endpoint)
  );
  
  // Additional check for auth endpoints that should be public
  const authPublicEndpoints = [
    '/auth/login',
    '/auth/register',
    '/auth/verify-email',
    '/auth/resend-verification',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/refresh-token',
    '/auth/oauth',
    '/auth/check-user-status',
    '/auth/check-availability',
    '/auth/complete-mfa-login',
    '/auth/verify-temp-password'
  ];
  
  const isAuthPublic = authPublicEndpoints.some(endpoint => 
    url.includes(endpoint) || url.endsWith(endpoint)
  );
  
  return isPublic || isAuthPublic;
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
export const createAuthClient = (customTimeout?: number): AxiosInstance => {
  const axiosInstance = axios.create({
    baseURL: apiBaseUrl,
    timeout: customTimeout || 30000 // Default 30 second timeout, but allow override
  });
  
  // Request interceptor to add auth headers and refresh token if needed
  axiosInstance.interceptors.request.use(
    async (config) => {
      try {
        const requestUrl = config.url || '';
        const fullUrl = `${config.baseURL || ''}${requestUrl}`;
        
        console.log('🔐 apiWithAuth interceptor debug:', {
          url: requestUrl,
          fullUrl: fullUrl,
          method: config.method?.toUpperCase(),
          isPublic: isPublicEndpoint(fullUrl),
          requiresAuth: requiresAuthentication(fullUrl)
        });
        
        // Skip authentication for public endpoints
        if (isPublicEndpoint(fullUrl)) {
          console.log('✅ Public endpoint detected - skipping authentication:', requestUrl);
          return config;
        }
        
        // Only add authentication for private endpoints
        if (!requiresAuthentication(fullUrl)) {
          console.log('✅ Endpoint does not require authentication - skipping:', requestUrl);
          return config;
        }
        
        // Get token for private endpoints
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
        
        console.log('🔐 Authentication check for private endpoint:', {
          hasToken: !!token,
          tokenLength: token?.length,
          tokenStart: token?.substring(0, 10),
          storageCheck: {
            localStorage: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false,
            sessionStorage: typeof window !== 'undefined' ? !!sessionStorage.getItem('token') : false,
            cookies: typeof window !== 'undefined' && document.cookie.includes('token=')
          }
        });
        
        if (!token) {
          console.warn('❌ No authentication token found for private endpoint:', requestUrl);
          // Don't automatically reject - let the backend handle it
          // This allows for graceful error handling in the frontend
          return config;
        }
        
        // Try to refresh token if it's expired or close to expiring
        try {
          const refreshedToken = await refreshTokenIfNeeded(token);
          
          if (refreshedToken) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${refreshedToken}`;
            console.log('✅ Authentication header added to private endpoint:', requestUrl);
          } else {
            console.warn('❌ Token refresh failed for private endpoint:', requestUrl);
            // Don't automatically reject - let the backend handle it
          }
        } catch (refreshError) {
          console.error('❌ Error during token refresh:', refreshError);
          // If refresh fails, still try with the original token
          if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
            console.log('⚠️ Using original token despite refresh failure:', requestUrl);
          }
        }
        
        return config;
      } catch (error) {
        console.error('❌ Error in auth interceptor:', error);
        return config; // Return config even if there's an error
      }
    },
    (error) => {
      console.error('❌ Request interceptor error:', error);
      return Promise.reject(error);
    }
  );
  
  // Response interceptor to handle auth errors
  axiosInstance.interceptors.response.use(
    (response) => {
      // Any status code that lies within the range of 2xx causes this function to trigger
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      
      // If the error is 401 and we haven't already tried to refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        // Skip refresh for public endpoints
        if (isPublicEndpoint(originalRequest.url)) {
          console.log('🔓 401 on public endpoint - not attempting refresh:', originalRequest.url);
          return Promise.reject(error);
        }
        
        try {
          const token = getAuthToken();
          if (token) {
            const refreshedToken = await refreshTokenIfNeeded(token);
            
            if (refreshedToken) {
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${refreshedToken}`;
              console.log('🔄 Retrying request with refreshed token:', originalRequest.url);
              return axiosInstance(originalRequest);
            }
          }
        } catch (refreshError) {
          console.error('❌ Token refresh failed in response interceptor:', refreshError);
        }
      }
      
      return Promise.reject(error);
    }
  );
  
  return axiosInstance;
};

// Create the default authenticated axios instance
export const authClient = createAuthClient();

// Convenience methods for common HTTP operations
export const authGet = async <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
  return authClient.get<T>(url, config);
};

export const authPost = async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
  return authClient.post<T>(url, data, config);
};

export const authLoginPost = async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
  return authClient.post<T>(url, data, config);
};

export const authPut = async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
  return authClient.put<T>(url, data, config);
};

export const authPatch = async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
  return authClient.patch<T>(url, data, config);
};

export const authDelete = async <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
  return authClient.delete<T>(url, config);
};

// Export the main auth client as default
export default authClient;

// Export utility functions
export { isPublicEndpoint, requiresAuthentication }; 