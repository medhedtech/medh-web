import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { apiBaseUrl } from '@/apis';
import { showToast } from '@/utils/toastManager';
import { getAuthToken, saveAuthToken, clearAuthToken, getRefreshToken, saveRefreshToken } from '@/utils/auth';
import { jwtDecode } from 'jwt-decode';
import { apiClient } from '@/apis';

interface LoginResponse {
  token: string;
  user: any;
}

interface DecodedToken {
  exp: number;
  iat: number;
  _id: string;
  email: string;
  role: string | string[];
  [key: string]: any;
}

// --- Define User Type (Replace with your actual user type if available) ---
interface IUser {
  _id: string;
  email: string;
  role: string | string[];
  name?: string;
  // Add other user properties as needed
}
// --- End User Type ---

/**
 * Authentication hook for Medh app
 */
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<IUser | null>(null);
  const [tokenInfo, setTokenInfo] = useState<DecodedToken | null>(null);
  
  // Use ref to track if we've already fetched user profile to prevent duplicate calls
  const hasAttemptedProfileFetch = useRef<boolean>(false);

  /**
   * Decode and validate token
   */
  const validateToken = useCallback((token: string | null, shouldUpdateUser: boolean = false): boolean => {
    if (!token) return false;
    
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setTokenInfo(decoded);
      
      // Check if token is expired
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        console.warn('Token expired');
        clearAuthToken();
        apiClient.clearAuthToken();
        return false;
      }
      
      // Only update user info from token if explicitly requested and we don't have user data
      if (shouldUpdateUser) {
        const tokenUser = {
          ...(decoded._id ? { _id: decoded._id } : {}),
          ...(decoded.id ? { _id: decoded.id } : {}),
          ...(decoded.userId ? { _id: decoded.userId } : {}),
          ...(decoded.email ? { email: decoded.email } : {}),
          ...(decoded.role ? { role: decoded.role } : {}),
          ...(decoded.name ? { name: decoded.name } : {}),
        };
        
        // Only update user if we have some basic info and don't already have user data
        if (Object.keys(tokenUser).length > 0) {
          setUser(prev => {
            // Don't update if we already have more complete user data
            if (prev && Object.keys(prev).length >= Object.keys(tokenUser).length) {
              return prev;
            }
            return { ...(prev || {}), ...tokenUser } as IUser;
          });
        }
      }
      
      // Valid token
      return true;
    } catch (error) {
      console.error('Invalid token:', error);
      clearAuthToken();
      apiClient.clearAuthToken();
      return false;
    }
  }, []);

  /**
   * Fetch user profile using the token
   */
  const fetchUserProfile = useCallback(async () => {
    const token = getAuthToken();
    if (!token || hasAttemptedProfileFetch.current) return null;
    
    hasAttemptedProfileFetch.current = true;
    
    try {
      // First decode the token to get possible user identifiers
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        const userId = decoded._id || decoded.id || decoded.userId;
        
        if (!userId) {
          console.log('Token does not contain user ID, skipping profile fetch');
          // Still consider authentication valid based on token alone
          setIsAuthenticated(true);
          return null;
        }
        
        // Use the ID from the token to make the API request
        const response = await axios.get(`${apiBaseUrl}/auth/get/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data && response.data.data) {
          setUser(response.data.data);
          return response.data.data;
        }
        return null;
      } catch (decodeError) {
        console.error('Error decoding token:', decodeError);
        return null;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Don't invalidate authentication on profile fetch failure
      return null;
    }
  }, []);
  
  // Check if user is authenticated on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      const isValid = validateToken(token, true); // Allow user update from token on initial load
      
      // --- Set/Clear token on apiClient based on initial validation --- 
      if (isValid && token) {
        apiClient.setAuthToken(token);
      } else {
        apiClient.clearAuthToken();
      }
      // --- End Set/Clear --- 
      
      setIsAuthenticated(isValid);
      
      // If token is valid but we don't have user data, fetch it
      if (isValid && token && !hasAttemptedProfileFetch.current) {
        await fetchUserProfile();
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
    
    // Set up an interval to periodically check token validity
    const intervalId = setInterval(() => {
      const token = getAuthToken();
      validateToken(token, false); // Don't update user from token in periodic checks
    }, 60000); // Check every minute
    
    return () => {
      clearInterval(intervalId);
    };
  }, [validateToken, fetchUserProfile]); // Removed 'user' from dependencies to prevent infinite loop

  /**
   * Login using email and password
   */
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post<LoginResponse>(`${apiBaseUrl}/auth/login`, {
        email,
        password
      });
      
      if (response.data && response.data.token) {
        saveAuthToken(response.data.token);
        const token = response.data.token;
        apiClient.setAuthToken(token);
        validateToken(response.data.token, false); // Don't update user from token since we have user data from login response
        setIsAuthenticated(true);
        setUser(response.data.user || null);
        showshowToast.success('Login successful', { groupKey: 'auth' });
        return true;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Login failed';
              showToast.error(errorMessage, { groupKey: 'auth' });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [validateToken]);

  /**
   * Manually set token (for external token sources)
   */
  const setToken = useCallback((token: string) => {
    if (token) {
      const isValid = validateToken(token, true); // Allow user update from token when manually setting token
      if (isValid) {
        saveAuthToken(token);
        setIsAuthenticated(true);
        // Reset the profile fetch flag so we can fetch profile for the new token
        hasAttemptedProfileFetch.current = false;
        fetchUserProfile();
        return true;
      } else {
        showToast.error('Invalid or expired token', { groupKey: 'auth' });
        return false;
      }
    }
    return false;
  }, [validateToken, fetchUserProfile]);

  /**
   * Refresh token if needed
   */
  const refreshToken = useCallback(async () => {
    const token = getAuthToken();
    const refreshTokenValue = getRefreshToken();
    
    if (!refreshTokenValue) {
      console.warn('No refresh token available for refresh');
      return false;
    }
    
    try {
      // Only try to refresh if token exists but is close to expiring
      if (tokenInfo && tokenInfo.exp) {
        const currentTime = Date.now() / 1000;
        const timeToExpire = tokenInfo.exp - currentTime;
        
        // If token is valid for more than 5 minutes, don't refresh
        if (timeToExpire > 300) {
          return true;
        }
      }
      
      const response = await axios.post(`${apiBaseUrl}/auth/refresh-token`, 
        { refresh_token: refreshTokenValue }, 
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data && (response.data.token || (response.data.data && response.data.data.access_token))) {
        const newToken = response.data.token || response.data.data.access_token;
        saveAuthToken(newToken);
        validateToken(newToken, false); // Don't update user from token during refresh
        
        // Save new refresh token if provided
        if (response.data.refresh_token || (response.data.data && response.data.data.refresh_token)) {
          const newRefreshToken = response.data.refresh_token || response.data.data.refresh_token;
          saveRefreshToken(newRefreshToken);
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      // If refresh fails, don't immediately log out - let the token validation handle that
      return false;
    }
  }, [tokenInfo, validateToken]);

  /**
   * Get user role
   */
  const getUserRole = useCallback((): string | string[] | null => {
    if (user && user.role) {
      return user.role;
    }
    
    if (tokenInfo && tokenInfo.role) {
      return tokenInfo.role;
    }
    
    return null;
  }, [user, tokenInfo]);

  /**
   * Check if user has a specific role
   */
  const hasRole = useCallback((requiredRole: string | string[]): boolean => {
    const userRole = getUserRole();
    if (!userRole) return false;
    
    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const userRoles = Array.isArray(userRole) ? userRole : [userRole];
    
    return userRoles.some(role => requiredRoles.includes(role));
  }, [getUserRole]);

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    clearAuthToken();
    apiClient.clearAuthToken();
    setIsAuthenticated(false);
    setTokenInfo(null);
    setUser(null);
    hasAttemptedProfileFetch.current = false; // Reset profile fetch flag
          showToast.info('Logged out successfully', { groupKey: 'auth' });
  }, []);

  /**
   * Get authorization header for API requests
   */
  const getAuthHeader = useCallback(() => {
    const token = getAuthToken();
    if (!token) return {};
    
    return {
      Authorization: `Bearer ${token}`,
      'x-access-token': token
    };
  }, []);

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    setToken,
    refreshToken,
    hasRole,
    getUserRole,
    getAuthHeader,
    tokenInfo
  };
};

export default useAuth; 