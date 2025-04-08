/**
 * Auth utility functions for token management
 */

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
 * Checks if the user is authenticated (has token)
 * @returns True if authenticated, false otherwise
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
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
 * Store the provided token directly in the local variable and storage
 * @param token The JWT token from the x-access-token header
 */
export const storeExternalToken = (token: string): void => {
  if (token) {
    saveAuthToken(token);
  }
}; 