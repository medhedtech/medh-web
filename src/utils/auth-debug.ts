/**
 * Authentication debugging utilities
 * Helps diagnose authentication issues in development
 */

import { jwtDecode } from 'jwt-decode';

export interface AuthDebugInfo {
  hasToken: boolean;
  hasUserId: boolean;
  tokenValid: boolean;
  tokenExpired: boolean;
  tokenPayload: any;
  userId: string | null;
  userRole: string | null;
  fullName: string | null;
  email: string | null;
  storageLocations: {
    localStorage: {
      token: boolean;
      userId: boolean;
      role: boolean;
      fullName: boolean;
    };
    sessionStorage: {
      token: boolean;
      userId: boolean;
      role: boolean;
      fullName: boolean;
    };
  };
  issues: string[];
  recommendations: string[];
}

/**
 * Comprehensive authentication debugging function
 * @returns Detailed authentication status and debugging information
 */
export const debugAuthState = (): AuthDebugInfo => {
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  // Check for tokens
  const localToken = localStorage.getItem('token');
  const sessionToken = sessionStorage.getItem('token');
  const token = localToken || sessionToken;
  
  // Check for user data
  const localUserId = localStorage.getItem('userId');
  const sessionUserId = sessionStorage.getItem('userId');
  const userId = localUserId || sessionUserId;
  
  const userRole = localStorage.getItem('role') || sessionStorage.getItem('role');
  const fullName = localStorage.getItem('fullName') || sessionStorage.getItem('fullName');
  const email = localStorage.getItem('email') || sessionStorage.getItem('email');
  
  let tokenValid = false;
  let tokenExpired = false;
  let tokenPayload: any = null;
  
  // Validate token
  if (token) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        issues.push('Token format is invalid (not a proper JWT)');
        recommendations.push('Clear authentication data and log in again');
      } else {
        tokenPayload = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (tokenPayload.exp && tokenPayload.exp < currentTime) {
          tokenExpired = true;
          issues.push('Token has expired');
          recommendations.push('Refresh the token or log in again');
        } else {
          tokenValid = true;
        }
      }
    } catch (error) {
      issues.push(`Token decode error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      recommendations.push('Clear authentication data and log in again');
    }
  } else {
    issues.push('No authentication token found');
    recommendations.push('Log in to access authenticated content');
  }
  
  // Validate user ID
  if (!userId || userId === 'undefined' || userId === 'null') {
    issues.push('User ID is missing or invalid');
    recommendations.push('Log in again to establish a valid session');
  }
  
  // Check for inconsistencies
  if (localToken && sessionToken && localToken !== sessionToken) {
    issues.push('Token mismatch between localStorage and sessionStorage');
    recommendations.push('Clear both storage locations and log in again');
  }
  
  if (localUserId && sessionUserId && localUserId !== sessionUserId) {
    issues.push('User ID mismatch between localStorage and sessionStorage');
    recommendations.push('Clear both storage locations and log in again');
  }
  
  // Check token payload consistency
  if (tokenValid && tokenPayload && userId) {
    const tokenUserId = tokenPayload.userId || tokenPayload.user?.id || tokenPayload.id;
    if (tokenUserId && tokenUserId !== userId) {
      issues.push('User ID in storage does not match token payload');
      recommendations.push('Clear authentication data and log in again');
    }
  }
  
  return {
    hasToken: !!token,
    hasUserId: !!userId,
    tokenValid,
    tokenExpired,
    tokenPayload,
    userId,
    userRole,
    fullName,
    email,
    storageLocations: {
      localStorage: {
        token: !!localToken,
        userId: !!localUserId,
        role: !!localStorage.getItem('role'),
        fullName: !!localStorage.getItem('fullName'),
      },
      sessionStorage: {
        token: !!sessionToken,
        userId: !!sessionUserId,
        role: !!sessionStorage.getItem('role'),
        fullName: !!sessionStorage.getItem('fullName'),
      },
    },
    issues,
    recommendations,
  };
};

/**
 * Clean up invalid authentication data
 */
export const cleanupInvalidAuth = (): void => {
  const authInfo = debugAuthState();
  
  if (authInfo.issues.length > 0) {
    console.warn('Cleaning up invalid authentication data:', authInfo.issues);
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('fullName');
    localStorage.removeItem('email');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('rememberedEmail');
    
    // Clear sessionStorage
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('fullName');
    sessionStorage.removeItem('email');
    
    // Clear cookies
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    console.log('Authentication data cleaned up');
  }
};

/**
 * Log authentication debug information to console
 */
export const logAuthDebugInfo = (): void => {
  const authInfo = debugAuthState();
  
  console.group('🔐 Authentication Debug Information');
  console.log('Status:', {
    authenticated: authInfo.hasToken && authInfo.hasUserId && authInfo.tokenValid,
    hasToken: authInfo.hasToken,
    hasUserId: authInfo.hasUserId,
    tokenValid: authInfo.tokenValid,
    tokenExpired: authInfo.tokenExpired,
  });
  
  console.log('User Data:', {
    userId: authInfo.userId,
    userRole: authInfo.userRole,
    fullName: authInfo.fullName,
    email: authInfo.email,
  });
  
  console.log('Token Payload:', authInfo.tokenPayload);
  console.log('Storage Locations:', authInfo.storageLocations);
  
  if (authInfo.issues.length > 0) {
    console.warn('Issues Found:', authInfo.issues);
    console.info('Recommendations:', authInfo.recommendations);
  }
  
  console.groupEnd();
};

/**
 * Check if user is properly authenticated
 */
export const isProperlyAuthenticated = (): boolean => {
  const authInfo = debugAuthState();
  return authInfo.hasToken && authInfo.hasUserId && authInfo.tokenValid && !authInfo.tokenExpired && authInfo.issues.length === 0;
};

/**
 * Get the best available authentication data
 */
export const getBestAuthData = (): {
  token: string | null;
  userId: string | null;
  userRole: string | null;
  fullName: string | null;
  email: string | null;
} => {
  const authInfo = debugAuthState();
  
  return {
    token: localStorage.getItem('token') || sessionStorage.getItem('token'),
    userId: authInfo.userId,
    userRole: authInfo.userRole,
    fullName: authInfo.fullName,
    email: authInfo.email,
  };
};

/**
 * Validate and fix authentication state
 * @returns true if auth is valid or was fixed, false if needs re-authentication
 */
export const validateAndFixAuth = (): boolean => {
  const authInfo = debugAuthState();
  
  if (authInfo.issues.length === 0 && authInfo.hasToken && authInfo.hasUserId && authInfo.tokenValid) {
    return true; // All good
  }
  
  // Try to fix minor issues
  let fixed = false;
  
  // If token is valid but user data is missing, try to extract from token
  if (authInfo.tokenValid && authInfo.tokenPayload && !authInfo.userId) {
    const tokenUserId = authInfo.tokenPayload.userId || authInfo.tokenPayload.user?.id || authInfo.tokenPayload.id;
    if (tokenUserId) {
      localStorage.setItem('userId', tokenUserId);
      sessionStorage.setItem('userId', tokenUserId);
      fixed = true;
    }
  }
  
  // If role is missing but available in token
  if (authInfo.tokenValid && authInfo.tokenPayload && !authInfo.userRole) {
    const tokenRole = authInfo.tokenPayload.role || authInfo.tokenPayload.user?.role;
    if (tokenRole) {
      const role = Array.isArray(tokenRole) ? tokenRole[0] : tokenRole;
      localStorage.setItem('role', role);
      fixed = true;
    }
  }
  
  // If full name is missing but available in token
  if (authInfo.tokenValid && authInfo.tokenPayload && !authInfo.fullName) {
    const tokenFullName = authInfo.tokenPayload.full_name || authInfo.tokenPayload.user?.full_name || authInfo.tokenPayload.name;
    if (tokenFullName) {
      localStorage.setItem('fullName', tokenFullName);
      fixed = true;
    }
  }
  
  if (fixed) {
    console.log('Authentication data partially fixed');
    return isProperlyAuthenticated();
  }
  
  // If we can't fix it, cleanup and return false
  cleanupInvalidAuth();
  return false;
}; 