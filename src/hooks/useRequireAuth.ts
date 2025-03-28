import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/components/layout/Providers';

interface UseRequireAuthOptions {
  redirectTo?: string;
  roles?: string | string[];
  redirectIfFound?: boolean;
}

/**
 * Hook for routes that require authentication
 * 
 * @param options Configuration options for auth requirements
 * @param options.redirectTo Where to redirect if auth check fails (defaults to /login)
 * @param options.roles Specific roles required to access the route
 * @param options.redirectIfFound If true, redirects if the user IS authenticated (for login pages)
 * 
 * @returns Object containing loading state while checking auth
 */
export function useRequireAuth(options: UseRequireAuthOptions = {}) {
  const { redirectTo = '/login', roles, redirectIfFound = false } = options;
  const router = useRouter();
  const auth = useAuthContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.isLoading) {
      // Handle redirect for logged out users
      if (!auth.isAuthenticated && !redirectIfFound) {
        router.push(redirectTo);
      }

      // Handle redirect for logged in users (for login pages)
      if (auth.isAuthenticated && redirectIfFound) {
        router.push('/dashboards');
      }

      // Check role requirements if user is logged in
      if (auth.isAuthenticated && roles && !redirectIfFound) {
        const hasRequiredRole = Array.isArray(roles)
          ? roles.some(role => auth.hasRole(role))
          : auth.hasRole(roles);

        if (!hasRequiredRole) {
          // Redirect to unauthorized page if user doesn't have required role
          router.push('/unauthorized');
        }
      }

      setLoading(false);
    }
  }, [auth.isAuthenticated, auth.isLoading, auth.hasRole, redirectIfFound, redirectTo, roles, router]);

  return { loading };
}

/**
 * Hook for instructor-only routes
 */
export function useRequireInstructor() {
  return useRequireAuth({ roles: 'instructor' });
}

/**
 * Hook for admin-only routes
 */
export function useRequireAdmin() {
  return useRequireAuth({ roles: 'admin' });
}

/**
 * Hook for login/signup pages (redirect if already logged in)
 */
export function useRedirectAuthenticated() {
  return useRequireAuth({ redirectIfFound: true, redirectTo: '/dashboards' });
}

export default useRequireAuth; 