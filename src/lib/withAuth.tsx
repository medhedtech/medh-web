"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserRole } from '@/interfaces/userRole';

// HOC for role-based authentication
const withAuth = (Component: React.ComponentType<any>, requiredRoles: string[] = []) => {
  return function WithAuthComponent(props: any) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      // Check authentication on client side
      const checkAuth = () => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }
        
        // Check user role
        const userRole = localStorage.getItem('role');
        if (!userRole) {
          router.push('/login');
          return;
        }
        
        // If no specific roles required, any authenticated user can access
        if (requiredRoles.length === 0) {
          setIsAuthorized(true);
          setLoading(false);
          return;
        }
        
        // Check if user role is in required roles
        const normalizedUserRole = userRole.toLowerCase();
        const userHasRequiredRole = requiredRoles.some(role => {
          // Handle both string and enum value comparisons
          if (typeof role === 'string') {
            return normalizedUserRole === role.toLowerCase();
          }
          return false;
        });
        
        if (userHasRequiredRole) {
          setIsAuthorized(true);
          setLoading(false);
        } else {
          // Redirect to appropriate dashboard based on role
          if (normalizedUserRole === 'student') {
            router.push('/dashboards/student-dashboard');
          } else if (normalizedUserRole === 'instructor') {
            router.push('/dashboards/instructor/');
          } else if (normalizedUserRole === 'parent') {
            router.push('/dashboards/parent-dashboard');
          } else {
            // Fallback to home
            router.push('/');
          }
        }
      };
      
      checkAuth();
    }, [router]);
    
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      );
    }
    
    return isAuthorized ? <Component {...props} /> : null;
  };
};

export default withAuth; 