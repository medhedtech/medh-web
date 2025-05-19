'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ThemeProvider } from 'next-themes';

// Create auth context
export const AuthContext = createContext<ReturnType<typeof useAuth> | null>(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();
  const router = useRouter();
  const [handleAuthErrors, setHandleAuthErrors] = useState(true);

  // Listen for auth error events
  useEffect(() => {
    const handleAuthError = (event: CustomEvent) => {
      if (handleAuthErrors && event.detail && event.detail.status === 401) {
        auth.logout();
        router.push('/login');
      }
    };

    window.addEventListener('auth:error', handleAuthError as EventListener);
    
    return () => {
      window.removeEventListener('auth:error', handleAuthError as EventListener);
    };
  }, [auth, router, handleAuthErrors]);

  // Set up a token refresh interval
  useEffect(() => {
    if (!auth.isAuthenticated) return;

    const refreshInterval = setInterval(() => {
      auth.refreshToken();
    }, 15 * 60 * 1000); // Refresh every 15 minutes

    return () => {
      clearInterval(refreshInterval);
    };
  }, [auth.isAuthenticated, auth.refreshToken]);

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

// Main app providers
interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      storageKey="medh-theme"
    >
      <AuthProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
} 