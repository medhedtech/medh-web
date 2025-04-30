/**
 * Auth utility functions for token management
 */

import { jwtDecode } from 'jwt-decode';

/**
 * Saves authentication token to both localStorage and sessionStorage
 * @param token JWT token string
 */
export const saveAuthToken = (token: string): void => {
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

/**
 * Store authentication data from login response
 * @param data Login response containing token and user ID
 * @param rememberMe Whether to remember the user
 * @param email User email for remember me functionality
 * @param fullName User's full name
 */
export const storeAuthData = (
  data: { 
    token?: string; 
    refresh_token?: string;
    id?: string; 
    full_name?: string; 
    name?: string 
  },
  rememberMe: boolean = false,
  email?: string,
): boolean => {
  try {
    if (!data?.token || !data?.id) {
      return false;
    }
    
    saveAuthToken(data.token);
    if (data.refresh_token) {
      saveRefreshToken(data.refresh_token);
    }
    saveUserId(data.id);
    
    const fullName = data.full_name || data.name || '';
    if (fullName) {
      saveFullName(fullName);
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
  try {
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
  } catch (err) {
    console.error('Error sanitizing auth data:', err);
  }
};

/**
 * Saves refresh token to storage
 * @param refreshToken Refresh token string
 */
export const saveRefreshToken = (refreshToken: string): void => {
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
  try {
    localStorage.removeItem('refreshToken');
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
  } catch (err) {
    console.error('Error clearing refresh token:', err);
  }
};

/**
 * Attempts to refresh the authentication token
 * @returns Promise that resolves to new token or null if refresh failed
 */
export const refreshAuthToken = async (): Promise<string | null> => {
  try {
    const currentToken = getAuthToken();
    const refreshToken = getRefreshToken();
    
    if (!currentToken || !refreshToken) {
      console.warn('Cannot refresh token: Missing current token or refresh token');
      return null;
    }
    
    // Avoid refresh if token is still valid
    if (!needsTokenRefresh()) {
      return currentToken;
    }
    
    console.log('Attempting to refresh auth token');
    
    // Add baseUrl check to handle development environments
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.medh.co/api/v1';
    
    const response = await fetch(`${baseUrl}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`,
        'x-access-token': currentToken,
        'x-refresh-token': refreshToken
      },
      body: JSON.stringify({ refresh_token: refreshToken })
    });
    
    if (!response.ok) {
      console.error('Token refresh failed with status:', response.status);
      // Clear invalid tokens on 401/403 responses
      if (response.status === 401 || response.status === 403) {
        clearAuthToken();
        clearRefreshToken();
      }
      return null;
    }
    
    const data = await response.json();
    
    if (data && data.token) {
      saveAuthToken(data.token);
      
      // Also save refresh token if it was returned
      if (data.refresh_token) {
        saveRefreshToken(data.refresh_token);
      }
      
      console.log('Token refreshed successfully');
      return data.token;
    }
    
    console.warn('Refresh response did not contain a token:', data);
    return null;
  } catch (error) {
    console.error('Error refreshing auth token:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown Error'
    });
    return null;
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