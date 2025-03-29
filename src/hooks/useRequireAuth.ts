import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/components/layout/Providers';

export interface UseRequireAuthOptions {
  /**
   * Where to redirect if auth check fails
   */
  redirectTo?: string;
  /**
   * Specific roles required to access the route
   */
  roles?: string | string[];
  /**
   * If true, redirects if the user IS authenticated (for login pages)
   */
  redirectIfFound?: boolean;
  /**
   * Custom callback to execute when auth check fails
   */
  onAuthFailure?: (reason: 'not_authenticated' | 'unauthorized' | 'authenticated') => void;
  /**
   * Whether to show toast notifications on redirect
   */
  silent?: boolean;
  /**
   * Whether to cache the auth result to avoid unnecessary redirects
   */
  cacheResult?: boolean;
}

export interface RequireAuthResult {
  /**
   * Whether the auth check is still loading
   */
  loading: boolean;
  /**
   * Whether the user passed the auth check
   */
  authorized: boolean;
  /**
   * Force a refresh of the auth check
   */
  refresh: () => void;
}

// Cache for auth results to prevent repeated redirects
const authResultCache = new Map<string, { timestamp: number; result: boolean }>();

/**
 * Hook for routes that require authentication
 * 
 * @param options Configuration options for auth requirements
 * @returns Object containing loading state and auth status
 */
export function useRequireAuth(options: UseRequireAuthOptions = {}): RequireAuthResult {
  const {
    redirectTo = '/login',
    roles,
    redirectIfFound = false,
    onAuthFailure,
    silent = false,
    cacheResult = true,
  } = options;

  const router = useRouter();
  const auth = useAuthContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [authorized, setAuthorized] = useState<boolean>(false);
  const isMounted = useRef<boolean>(true);
  const checkPerformed = useRef<boolean>(false);
  
  // Cache key based on auth state and options
  const getCacheKey = useCallback(() => {
    const roleKey = roles ? (Array.isArray(roles) ? roles.join(',') : roles) : 'no-role';
    return `${auth.isAuthenticated}-${roleKey}-${redirectIfFound}`;
  }, [auth.isAuthenticated, roles, redirectIfFound]);
  
  // Check if the cached result is still valid (less than 10 seconds old)
  const getFromCache = useCallback((): boolean | null => {
    if (!cacheResult) return null;
    
    const key = getCacheKey();
    const cached = authResultCache.get(key);
    if (!cached) return null;
    
    const now = Date.now();
    if (now - cached.timestamp < 10000) { // 10 seconds expiry
      return cached.result;
    }
    
    authResultCache.delete(key);
    return null;
  }, [cacheResult, getCacheKey]);
  
  // Save result to cache
  const saveToCache = useCallback((result: boolean) => {
    if (!cacheResult) return;
    
    const key = getCacheKey();
    authResultCache.set(key, { timestamp: Date.now(), result });
  }, [cacheResult, getCacheKey]);
  
  // Force refresh the auth check
  const refresh = useCallback(() => {
    const key = getCacheKey();
    authResultCache.delete(key);
    checkPerformed.current = false;
    setLoading(true);
  }, [getCacheKey]);

  // Perform the actual auth check
  const performAuthCheck = useCallback(() => {
    if (!isMounted.current || checkPerformed.current) return;
    
    // Check cache first
    const cachedResult = getFromCache();
    if (cachedResult !== null) {
      setAuthorized(cachedResult);
      setLoading(false);
      checkPerformed.current = true;
      return;
    }
    
    if (auth.isLoading) {
      return; // Wait for auth to finish loading
    }
    
    let authPassed = false;
    
    // Handle redirect for logged out users
    if (!auth.isAuthenticated && !redirectIfFound) {
      if (!silent && onAuthFailure) {
        onAuthFailure('not_authenticated');
      }
      router.push(redirectTo);
    }
    // Handle redirect for logged in users (for login pages)
    else if (auth.isAuthenticated && redirectIfFound) {
      if (!silent && onAuthFailure) {
        onAuthFailure('authenticated');
      }
      router.push('/dashboards');
    }
    // Check role requirements if user is logged in
    else if (auth.isAuthenticated && roles && !redirectIfFound) {
      const hasRequiredRole = Array.isArray(roles)
        ? roles.some(role => auth.hasRole(role))
        : auth.hasRole(roles);

      if (!hasRequiredRole) {
        // Redirect to unauthorized page if user doesn't have required role
        if (!silent && onAuthFailure) {
          onAuthFailure('unauthorized');
        }
        router.push('/unauthorized');
      } else {
        authPassed = true;
      }
    }
    // User is authenticated and no specific roles required
    else if (auth.isAuthenticated && !redirectIfFound) {
      authPassed = true;
    }
    // User is not authenticated and we want to redirect if found
    else if (!auth.isAuthenticated && redirectIfFound) {
      authPassed = true;
    }
    
    // Cache the result
    saveToCache(authPassed);
    setAuthorized(authPassed);
    setLoading(false);
    checkPerformed.current = true;
  }, [
    auth.isAuthenticated, 
    auth.isLoading, 
    auth.hasRole, 
    redirectIfFound, 
    redirectTo, 
    roles, 
    router, 
    silent, 
    onAuthFailure,
    getFromCache,
    saveToCache
  ]);

  // Effect to clean up on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Effect to perform auth check when auth state changes
  useEffect(() => {
    performAuthCheck();
  }, [performAuthCheck]);

  return { 
    loading, 
    authorized,
    refresh
  };
}

/**
 * Hook for instructor-only routes
 */
export function useRequireInstructor(options: Omit<UseRequireAuthOptions, 'roles'> = {}): RequireAuthResult {
  return useRequireAuth({ ...options, roles: 'instructor' });
}

/**
 * Hook for admin-only routes
 */
export function useRequireAdmin(options: Omit<UseRequireAuthOptions, 'roles'> = {}): RequireAuthResult {
  return useRequireAuth({ ...options, roles: 'admin' });
}

/**
 * Hook for login/signup pages (redirect if already logged in)
 */
export function useRedirectAuthenticated(
  options: Omit<UseRequireAuthOptions, 'redirectIfFound' | 'redirectTo'> = {}
): RequireAuthResult {
  return useRequireAuth({ 
    ...options, 
    redirectIfFound: true, 
    redirectTo: '/dashboards' 
  });
}

export default useRequireAuth; 