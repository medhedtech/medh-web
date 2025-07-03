"use client";

import { useEffect, ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { validateAndFixAuth, cleanupInvalidAuth, logAuthDebugInfo } from "@/utils/auth-debug";

// Types
interface IProtectedPageProps {
  children: ReactNode;
}

interface IDecodedToken {
  exp: number;
  iat?: number;
  [key: string]: any;
}

const ProtectedPage: React.FC<IProtectedPageProps> = ({ children }) => {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Log debug information in development
        if (process.env.NODE_ENV === 'development') {
          console.log('🔒 ProtectedPage: Checking authentication...');
          logAuthDebugInfo();
        }

        // Use our comprehensive auth validation
        // Bypass authentication for development environment
        if (process.env.NODE_ENV === 'development') {
          console.warn("ProtectedPage: Bypassing authentication for development mode.");
          setIsAuthenticated(true);
          setAuthChecked(true);
          return;
        }

        const isValid = validateAndFixAuth();
        
        if (!isValid) {
          console.log("ProtectedPage: Authentication failed, redirecting to login");
          const currentPath = window.location.pathname + window.location.search;
          const redirectUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;
          router.push(redirectUrl);
          return;
        }

        // Double-check with manual token validation for extra security
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        
        if (!token) {
          console.log("ProtectedPage: No token found after validation");
          router.push("/login");
          return;
        }

        try {
          const decoded: IDecodedToken = jwtDecode(token);
          const currentTime: number = Math.floor(Date.now() / 1000);
          
          if (decoded.exp < currentTime) {
            console.log("ProtectedPage: Token expired, cleaning up and redirecting");
            cleanupInvalidAuth();
            router.push("/login");
            return;
          }
        } catch (tokenError) {
          console.error("ProtectedPage: Token decode error:", tokenError);
          cleanupInvalidAuth();
          router.push("/login");
          return;
        }

        console.log("ProtectedPage: Authentication successful");
        setIsAuthenticated(true);
        
      } catch (error) {
        console.error("ProtectedPage: Unexpected error during auth check:", error);
        cleanupInvalidAuth();
        router.push("/login");
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuthentication();
  }, [router]);

  // Don't render anything until auth is checked
  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Only show protected content if authenticated
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // This shouldn't render since we redirect, but just in case
  return null;
};

export default ProtectedPage;
