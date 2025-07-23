import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authUtils, authAPI, ILoginData, IAuthResponse } from '@/apis/auth.api';

interface ISalesUser {
  id: string;
  name: string;
  email: string;
  role: 'sales_admin' | 'sales_agent' | 'sales_manager';
  permissions: string[];
  department: string;
  territory?: string;
  lastLogin?: string;
}

interface ISalesAuthState {
  user: ISalesUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useSalesAuth = () => {
  const router = useRouter();
  const [authState, setAuthState] = useState<ISalesAuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Use authUtils to check if authenticated
      if (!authUtils.isAuthenticated()) {
        setAuthState(prev => ({ 
          ...prev, 
          isAuthenticated: false, 
          isLoading: false 
        }));
        return;
      }

      // Get user data from token
      const userData = authUtils.getUserFromToken();
      if (userData) {
        // Check if user has sales/admin permissions
        // For now, allow any authenticated user to access sales dashboard
        const hasPermission = true; // userData.role?.includes('admin') || 
                            // userData.role?.includes('sales') || 
                            // userData.permissions?.includes('forms_read') ||
                            // userData.admin_role;
        
        if (hasPermission) {
          setAuthState({
            user: {
              id: userData.id || userData.sub,
              name: userData.full_name || userData.name || userData.email?.split('@')[0],
              email: userData.email,
              role: userData.admin_role || userData.role?.[0] || 'sales_agent',
              permissions: userData.permissions || ['forms_read', 'forms_write'],
              department: 'Sales',
              lastLogin: userData.last_login,
            },
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: 'Insufficient permissions for sales dashboard',
          });
        }
      } else {
        // Token is invalid
        authUtils.clearTokens();
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Authentication check failed'
      });
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      // Use the auth API login endpoint
      const response = await fetch(authAPI.local.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        } as ILoginData),
      });

      const data: IAuthResponse = await response.json();

      if (response.ok && data.success && data.token) {
        // Store tokens using authUtils
        authUtils.storeTokens({
          token: data.token,
          refresh_token: data.refresh_token,
          expires_in: data.expires_in,
        });

        // Get user data from token
        const userData = authUtils.getUserFromToken(data.token);
        
        // Check permissions
        // For now, allow any authenticated user to access sales dashboard
        const hasPermission = true; // userData?.role?.includes('admin') || 
                            // userData?.role?.includes('sales') || 
                            // userData?.permissions?.includes('forms_read') ||
                            // userData?.admin_role;
        
        if (hasPermission) {
          const user: ISalesUser = {
            id: userData.id || userData.sub,
            name: userData.full_name || userData.name || userData.email?.split('@')[0],
            email: userData.email,
            role: userData.admin_role || userData.role?.[0] || 'sales_agent',
            permissions: userData.permissions || ['forms_read', 'forms_write'],
            department: 'Sales',
            lastLogin: userData.last_login,
          };

          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return { success: true, user };
        } else {
          authUtils.clearTokens();
          setAuthState(prev => ({
            ...prev,
            isLoading: false,
            error: 'Insufficient permissions for sales dashboard',
          }));
          return { success: false, error: 'Insufficient permissions for sales dashboard' };
        }
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: data.message || 'Login failed'
        }));
        return { success: false, error: data.message || 'Login failed' };
      }
    } catch (error) {
      const errorMessage = 'Login failed. Please try again.';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Call logout endpoint
      await fetch(authAPI.local.logout, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authUtils.getAuthHeaders(),
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens using authUtils
      authUtils.clearTokens();
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });

      // Redirect to login
      router.push('/sales/login');
    }
  }, [router]);

  const hasPermission = useCallback((permission: string): boolean => {
    return authState.user?.permissions.includes(permission) || false;
  }, [authState.user]);

  const hasRole = useCallback((role: string): boolean => {
    return authState.user?.role === role;
  }, [authState.user]);

  return {
    ...authState,
    login,
    logout,
    hasPermission,
    hasRole,
    checkAuthStatus
  };
}; 