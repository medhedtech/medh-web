/**
 * Auth utility functions for token management
 */

import { jwtDecode } from 'jwt-decode';
import { apiUrls } from '@/apis';
import axios from 'axios';
import { apiBaseUrl } from '@/apis/config';

/**
 * Saves authentication token to both localStorage and sessionStorage
 * @param token JWT token string
 */
export const saveAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  try {
    // Store in both storage types for redundancy
    localStorage.setItem('token', token);
    sessionStorage.setItem('token', token);
    
    // Also set a cookie for server-side access
    document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
  } catch (err) {
    console.error('Error saving auth token:', err);
  }
};

/**
 * Saves user ID to both localStorage and sessionStorage
 * @param userId User ID string
 */
export const saveUserId = (userId: string): void => {
  if (typeof window === 'undefined') return;
  try {
    // Validate userId before saving
    if (!userId || userId === 'undefined' || userId === 'null') {
      console.error('Invalid user ID:', userId);
      return;
    }
    
    // Store in both storage types for redundancy
    localStorage.setItem('userId', userId);
    sessionStorage.setItem('userId', userId);
    
    // Also set a cookie for server-side access
    document.cookie = `userId=${userId}; path=/; max-age=86400; SameSite=Lax`;
  } catch (err) {
    console.error('Error saving user ID:', err);
  }
};

/**
 * Saves user's full name to localStorage and sessionStorage
 * @param fullName User's full name
 */
export const saveFullName = (fullName: string): void => {
  try {
    if (!fullName) return;
    
    localStorage.setItem('fullName', fullName);
    sessionStorage.setItem('fullName', fullName);
  } catch (err) {
    console.error('Error saving full name:', err);
  }
};

/**
 * Gets the user's full name from storage
 * @returns The user's full name or empty string if not found
 */
export const getFullName = (): string => {
  try {
    // Try localStorage first
    let fullName = localStorage.getItem('fullName');
    
    // Fall back to sessionStorage if not in localStorage
    if (!fullName) {
      fullName = sessionStorage.getItem('fullName');
    }
    
    return fullName || '';
  } catch (err) {
    console.error('Error retrieving full name:', err);
    return '';
  }
};

/**
 * Sets the remember me flag and securely stores the email if requested
 * @param rememberMe Whether to remember the user
 * @param email The user's email
 */
export const setRememberMe = (rememberMe: boolean, email?: string): void => {
  if (typeof window === 'undefined') return;
  try {
    if (rememberMe) {
      localStorage.setItem('rememberMe', 'true');
      
      // Only store email if provided and remember me is true
      if (email) {
        localStorage.setItem('rememberedEmail', email);
      }
      
      // Set a long-lived cookie for the remember me setting
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30); // 30 days expiry
      document.cookie = `rememberMe=true; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;
    } else {
      // Clear remember me data
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('rememberedEmail');
      document.cookie = 'rememberMe=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    }
  } catch (err) {
    console.error('Error setting remember me:', err);
  }
};

/**
 * Checks if remember me is enabled
 * @returns Whether remember me is enabled
 */
export const isRememberMeEnabled = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem('rememberMe') === 'true';
  } catch (err) {
    console.error('Error checking remember me:', err);
    return false;
  }
};

/**
 * Gets the remembered email if available
 * @returns The remembered email or empty string
 */
export const getRememberedEmail = (): string => {
  if (typeof window === 'undefined') return '';
  try {
    if (isRememberMeEnabled()) {
      return localStorage.getItem('rememberedEmail') || '';
    }
    return '';
  } catch (err) {
    console.error('Error getting remembered email:', err);
    return '';
  }
};

/**
 * Gets the authentication token from storage
 * @returns The JWT token string or null if not found
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    // Try localStorage first
    let token = localStorage.getItem('token');
    
    // Fall back to sessionStorage if not in localStorage
    if (!token) {
      token = sessionStorage.getItem('token');
    }
    
    return token;
  } catch (err) {
    console.error('Error retrieving auth token:', err);
    return null;
  }
};

/**
 * Gets the user ID from storage
 * @returns The user ID string or null if not found
 */
export const getUserId = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    // Try localStorage first
    let userId = localStorage.getItem('userId');
    
    // Fall back to sessionStorage if not in localStorage
    if (!userId) {
      userId = sessionStorage.getItem('userId');
    }
    
    // Return null for invalid values
    if (userId === 'undefined' || userId === 'null') {
      return null;
    }
    
    return userId;
  } catch (err) {
    console.error('Error retrieving user ID:', err);
    return null;
  }
};

/**
 * Checks if the user is authenticated (has token)
 * @returns True if authenticated, false otherwise
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken() && !!getUserId();
};

/**
 * Clear auth token from all storage
 */
export const clearAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    
    // Also clear the cookie
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
  } catch (err) {
    console.error('Error clearing auth token:', err);
  }
};

/**
 * Clear user ID from all storage
 */
export const clearUserId = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('userId');
    sessionStorage.removeItem('userId');
    
    // Also clear the cookie
    document.cookie = 'userId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
  } catch (err) {
    console.error('Error clearing user ID:', err);
  }
};

/**
 * Clear full name from storage
 */
export const clearFullName = (): void => {
  try {
    localStorage.removeItem('fullName');
    sessionStorage.removeItem('fullName');
  } catch (err) {
    console.error('Error clearing full name:', err);
  }
};

/**
 * Clear all auth data from storage
 * @param keepRememberMe Whether to preserve the remember me setting
 */
export const clearAuthData = (keepRememberMe: boolean = false): void => {
  clearAuthToken();
  clearUserId();
  clearFullName();
  
  // Clear remember me data unless explicitly told to keep it
  if (!keepRememberMe) {
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('rememberedEmail');
    document.cookie = 'rememberMe=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
  }
};

/**
 * Store the provided token directly in the local variable and storage
 * @param token The JWT token from the x-access-token header
 */
export const storeExternalToken = (token: string): void => {
  if (token) {
    saveAuthToken(token);
  }
};

// Types
interface AuthData {
  token: string;
  refresh_token: string;
  id: string;
  full_name?: string;
  email?: string;
  role?: string | string[];
}

/**
 * Store authentication data from login response
 * @param data Login response containing token and user ID
 * @param rememberMe Whether to remember the user
 * @param email User email for remember me functionality
 * @param fullName User's full name
 */
export const storeAuthData = (
  data: AuthData,
  rememberMe: boolean = false,
  email?: string,
): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    
    if (!data?.token || !data?.id) {
      return false;
    }
    
    saveAuthToken(data.token);
    if (data.refresh_token) {
      saveRefreshToken(data.refresh_token);
    }
    saveUserId(data.id);
    
    const fullName = data.full_name || '';
    if (fullName) {
      saveFullName(fullName);
    }
    
    if (data.email) {
      localStorage.setItem('email', data.email);
      localStorage.setItem('userEmail', data.email); // Also store as userEmail for compatibility
    }
    
    if (data.role) {
      const role = Array.isArray(data.role) ? data.role[0] : data.role;
      localStorage.setItem('role', role);
    }
    
    setRememberMe(rememberMe, email);
    
    return true;
  } catch (err) {
    console.error('Error storing auth data:', err);
    return false;
  }
};

/**
 * Sanitize auth data by removing invalid values
 * Call this at app initialization to clean up any bad values
 */
export const sanitizeAuthData = (): void => {
  if (typeof window === 'undefined') return;
  
  // Check for invalid user ID values
  const userId = localStorage.getItem('userId');
  if (userId === 'undefined' || userId === 'null' || userId === '') {
    console.warn('Removing invalid userId from storage:', userId);
    localStorage.removeItem('userId');
    sessionStorage.removeItem('userId');
    document.cookie = 'userId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
  }
  
  // Check for invalid token values
  const token = localStorage.getItem('token');
  if (token === 'undefined' || token === 'null' || token === '') {
    console.warn('Removing invalid token from storage:', token);
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
  }
};

/**
 * Saves refresh token to storage
 * @param refreshToken Refresh token string
 */
export const saveRefreshToken = (refreshToken: string): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('refreshToken', refreshToken);
    document.cookie = `refreshToken=${refreshToken}; path=/; max-age=2592000; SameSite=Lax`; // 30 days
  } catch (err) {
    console.error('Error saving refresh token:', err);
  }
};

/**
 * Gets the refresh token from storage
 * @returns The refresh token string or null if not found
 */
export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('refreshToken');
  } catch (err) {
    console.error('Error retrieving refresh token:', err);
    return null;
  }
};

/**
 * Clear refresh token from storage
 */
export const clearRefreshToken = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('refreshToken');
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
  } catch (err) {
    console.error('Error clearing refresh token:', err);
  }
};

/**
 * Refreshes the auth token if needed
 * @returns Promise that resolves to new token or null if refresh failed
 */
export const refreshTokenIfNeeded = async (): Promise<string | null> => {
  const currentToken = getAuthToken();
  const refreshToken = getRefreshToken();
  
  // If no refresh token or current token is valid and not expiring soon, return current token
  if (!refreshToken || (currentToken && !willTokenExpireSoon(currentToken))) {
    return currentToken;
  }
  
  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';
  const shouldBypassAPI = process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true';
  
  // In development with bypass enabled, skip actual API call and use mock response
  if (isDevelopment && shouldBypassAPI) {
    console.log('Development mode with bypass: Using mock token refresh');
    // If we have a current token, use it or generate a mock one
    if (currentToken) {
      return currentToken;
    } else {
      // Create a mock token that will last for 1 hour
      // Generate a very simple mock token for development
      const now = Math.floor(Date.now() / 1000);
      const payload = {
        sub: 'mock-user-id',
        name: 'Mock User',
        iat: now,
        exp: now + 3600, // 1 hour
        role: 'student'
      };
      
      // Base64 encode (compatible with both browser and Node)
      const safeBase64 = (str: string) => {
        let base64;
        if (typeof window === 'undefined') {
          // Node.js environment
          base64 = Buffer.from(str).toString('base64');
        } else {
          // Browser environment
          base64 = window.btoa(str);
        }
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      };
      
      const header = safeBase64(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const encodedPayload = safeBase64(JSON.stringify(payload));
      const signature = 'MOCK_SIG'; // Not a real signature, just for development
      
      const mockToken = `${header}.${encodedPayload}.${signature}`;
      console.log('Created mock development token that expires in 1 hour');
      
      // Save token and create mock user data
      saveAuthToken(mockToken);
      
      // In development mode, set some mock user data
      if (typeof window !== 'undefined') {
        localStorage.setItem('userId', 'mock-user-id');
        localStorage.setItem('role', 'student');
        localStorage.setItem('fullName', 'Mock Student User');
        localStorage.setItem('email', 'mock.student@example.com');
      }
      
      return mockToken;
    }
  }
  
  try {
    // Use the centralized API URL from config
    const refreshTokenUrl = `${apiBaseUrl}/auth/refresh-token`;
    
    console.log('Refreshing token at URL:', refreshTokenUrl);
    
    const response = await axios.post(
      refreshTokenUrl,
      { refresh_token: refreshToken },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // Add reasonable timeout
      }
    );
    
    if (response.data && response.data.data && response.data.data.access_token) {
      const newToken = response.data.data.access_token;
      
      // Save the new tokens
      saveAuthToken(newToken);
      
      if (response.data.data.refresh_token) {
        saveRefreshToken(response.data.data.refresh_token);
      }
      
      return newToken;
    }
    
    console.warn('Token refresh failed: Invalid response format');
    return currentToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    
    // If we're in development, just return the current token without failing
    if (isDevelopment) {
      console.warn('Development environment: Returning current token despite refresh failure');
      return currentToken || null;
    }
    
    return null; // Return null to indicate refresh failed in production
  }
};

/**
 * Checks if the current token needs refresh
 * @returns boolean True if token needs refresh
 */
export const needsTokenRefresh = (): boolean => {
  try {
    const token = getAuthToken();
    if (!token) return false;

    const decoded = jwtDecode<{ exp: number }>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Refresh if token expires in less than 5 minutes
    return decoded.exp - currentTime < 300;
  } catch (err) {
    console.error('Error checking token expiration:', err);
    return false;
  }
};

/**
 * Check if token is expired
 * @param token JWT token string
 * @returns True if token is expired, false otherwise
 */
export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Return true if token is expired
    return decoded.exp <= currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true; // Assume expired if we can't decode it
  }
};

/**
 * Check if token will expire soon (within next 5 minutes)
 * @param token JWT token string
 * @param thresholdSeconds Optional threshold in seconds (default 300 seconds)
 * @returns True if token will expire within threshold seconds, false otherwise
 */
export const willTokenExpireSoon = (token: string | null, thresholdSeconds = 300): boolean => {
  if (!token) return true;
  
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Return true if token will expire within threshold seconds
    return decoded.exp - currentTime < thresholdSeconds;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true; // Assume will expire soon if we can't decode it
  }
};

/**
 * Generate a development token for testing purposes
 * This should only be used in development environments
 * @returns A mock JWT token that can be used for testing
 */
export const generateDevelopmentToken = (): string => {
  if (typeof window === 'undefined') return '';
  
  try {
    // Check if we're in development mode
    const isDevelopment = process.env.NODE_ENV === 'development' || 
                         window.location.hostname === 'localhost' ||
                         window.location.hostname === '127.0.0.1';
    
    if (!isDevelopment) {
      console.warn('Development token generation is only available in development mode');
      return '';
    }
    
    // Create a mock token that will last for 1 hour
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      sub: 'dev-user-' + Date.now(),
      name: 'Development User',
      email: 'dev@medh.co',
      iat: now,
      exp: now + 3600, // 1 hour
      role: 'admin', // Give admin role for testing
      userId: 'dev-user-id',
      permissions: ['video:upload', 'video:manage']
    };
    
    // Base64 encode (compatible with both browser and Node)
    const safeBase64 = (str: string) => {
      return window.btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    };
    
    const header = safeBase64(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const encodedPayload = safeBase64(JSON.stringify(payload));
    const signature = 'DEV_SIGNATURE_' + Date.now(); // Not a real signature, just for development
    
    const mockToken = `${header}.${encodedPayload}.${signature}`;
    
    console.log('🔧 Generated development token (expires in 1 hour)');
    console.log('⚠️  This is a mock token for development only!');
    
    // Save the token
    saveAuthToken(mockToken);
    
    // Set some mock user data
    localStorage.setItem('userId', payload.sub);
    localStorage.setItem('role', payload.role);
    localStorage.setItem('fullName', payload.name);
    localStorage.setItem('email', payload.email);
    
    return mockToken;
  } catch (error) {
    console.error('Failed to generate development token:', error);
    return '';
  }
};

/**
 * Check if the current token is valid and not expired
 * @param token Optional token to check, otherwise gets from storage
 * @returns Boolean indicating if token is valid
 */
export const isTokenValid = (token?: string): boolean => {
  try {
    const tokenToCheck = token || getAuthToken();
    if (!tokenToCheck) return false;
    
    const decoded = jwtDecode<{ exp: number }>(tokenToCheck);
    const currentTime = Date.now() / 1000;
    
    return decoded.exp > currentTime;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

/**
 * Get a valid authentication token, generating a development one if needed
 * @returns A valid token or null if none available
 */
export const getValidAuthToken = (): string | null => {
  // First try to get existing token
  let token = getAuthToken();
  
  // Check if token is valid
  if (token && isTokenValid(token)) {
    return token;
  }
  
  // If token is invalid or missing, try to generate a development token
  if (typeof window !== 'undefined') {
    const isDevelopment = process.env.NODE_ENV === 'development' || 
                         window.location.hostname === 'localhost' ||
                         window.location.hostname === '127.0.0.1';
    
    if (isDevelopment) {
      console.log('🔧 No valid token found, generating development token...');
      token = generateDevelopmentToken();
      return token || null;
    }
  }
  
  return null;
}; 