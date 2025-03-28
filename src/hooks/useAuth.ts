import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { apiBaseUrl } from '@/apis';
import { toast } from 'react-toastify';
import { getAuthToken, saveAuthToken, clearAuthToken } from '@/utils/auth';
import { jwtDecode } from 'jwt-decode';

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

/**
 * Authentication hook for Medh app
 */
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const [tokenInfo, setTokenInfo] = useState<DecodedToken | null>(null);

  /**
   * Decode and validate token
   */
  const validateToken = useCallback((token: string | null): boolean => {
    if (!token) return false;
    
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setTokenInfo(decoded);
      
      // Check if token is expired
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        console.warn('Token expired');
        clearAuthToken();
        return false;
      }
      
      // If we have user info in the token, set it
      if (decoded._id) {
        setUser({
          _id: decoded._id,
          email: decoded.email,
          role: decoded.role
        });
      }
      
      return true;
    } catch (error) {
      console.error('Invalid token:', error);
      clearAuthToken();
      return false;
    }
  }, []);

  /**
   * Fetch user profile using the token
   */
  const fetchUserProfile = useCallback(async () => {
    const token = getAuthToken();
    if (!token) return null;
    
    try {
      const response = await axios.get(`${apiBaseUrl}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.user) {
        setUser(response.data.user);
        return response.data.user;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }, []);
  
  // Check if user is authenticated on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      const isValid = validateToken(token);
      
      setIsAuthenticated(isValid);
      
      // If token is valid but we don't have user data, fetch it
      if (isValid && !user && token) {
        await fetchUserProfile();
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
    
    // Set up an interval to periodically check token validity
    const intervalId = setInterval(() => {
      const token = getAuthToken();
      validateToken(token);
    }, 60000); // Check every minute
    
    return () => {
      clearInterval(intervalId);
    };
  }, [validateToken, fetchUserProfile, user]);

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
        validateToken(response.data.token);
        setIsAuthenticated(true);
        setUser(response.data.user || null);
        toast.success('Login successful');
        return true;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
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
      const isValid = validateToken(token);
      if (isValid) {
        saveAuthToken(token);
        setIsAuthenticated(true);
        fetchUserProfile();
        return true;
      } else {
        toast.error('Invalid or expired token');
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
    if (!token) return false;
    
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
      
      const response = await axios.post(`${apiBaseUrl}/auth/refresh-token`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.token) {
        saveAuthToken(response.data.token);
        validateToken(response.data.token);
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
    setIsAuthenticated(false);
    setTokenInfo(null);
    setUser(null);
    toast.info('Logged out successfully');
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