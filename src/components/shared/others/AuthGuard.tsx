"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, AlertCircle, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { jwtDecode } from "jwt-decode";
import { refreshTokenIfNeeded, isTokenExpired } from "@/utils/auth";

interface AuthGuardProps {
  children: React.ReactNode;
  redirectPath?: string;
  checkAuth?: () => Promise<boolean>;
  message?: string;
  title?: string;
}

/**
 * AuthGuard component that protects routes requiring authentication
 * Shows a message when authentication is required and redirects to login
 */
const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  redirectPath = "/dashboards/student/profile",
  checkAuth = async () => {
    // Default auth check looks for token in localStorage and validates it
    if (typeof window !== "undefined") {
      try {
        // Check if we're in development environment for special handling
        const isDevelopment = process.env.NODE_ENV === 'development';
        
        // First try to refresh token if needed
        const token = await refreshTokenIfNeeded();
        
        // If token refresh failed or token is still expired, handle based on environment
        if (!token || isTokenExpired(token)) {
          if (isDevelopment) {
            // In development, we might want to bypass authentication failures
            // This can be controlled by a local env variable
            const bypassAuth = process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true';
            if (bypassAuth) {
              console.warn('Development mode: Bypassing authentication check');
              return true;
            }
          }
          return false;
        }
        
        return true;
      } catch (error) {
        console.error("Error validating token:", error);
        
        // In development, we can allow access despite errors
        if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true') {
          console.warn('Development mode: Allowing access despite authentication error');
          return true;
        }
        
        return false;
      }
    }
    return false;
  },
  message = "You need to be logged in to view your profile. Redirecting to login page...",
  title = "Authentication Required"
}) => {
  const router = useRouter();
  const { theme, resolvedTheme } = useTheme();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  
  // Hydration safe mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Check authentication status
  useEffect(() => {
    // Don't run on server-side or until component mounts
    if (typeof window === "undefined" || !isMounted) return;
    
    const validateAuth = async () => {
      try {
        const isAuth = await checkAuth();
        setIsAuthorized(isAuth);
        
        if (!isAuth) {
          // Show message for a brief moment before redirect
          setShowMessage(true);
          
          // Set timeout for automatic redirect
          const timer = setTimeout(() => {
            const encodedRedirect = encodeURIComponent(redirectPath);
            router.push(`/login/?redirect=${encodedRedirect}`);
          }, 3500); // 3.5 seconds
          
          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error("Error in auth validation:", error);
        setIsAuthorized(false);
        setShowMessage(true);
      }
    };
    
    validateAuth();
  }, [checkAuth, redirectPath, router, isMounted]);

  // Handle loading state
  if (!isMounted || isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="p-8 max-w-md w-full">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-16 w-16 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  // If authorized, show the children
  if (isAuthorized) {
    return <>{children}</>;
  }

  // If not authorized, show auth required message (only client-side)
  return (
    <AnimatePresence>
      {showMessage && isMounted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4"
        >
          <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center text-center">
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full mb-4">
                <Shield className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {title}
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {message}
              </p>
              
              <Link
                href={`/login/?redirect=${encodeURIComponent(redirectPath)}`}
                className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login Now
              </Link>
              
              {isMounted && (
                <>
                  <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    System theme ({resolvedTheme === 'dark' ? 'Dark' : 'Light'})
                  </div>
                  <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    Press Ctrl/⌘ + J to toggle
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthGuard; 