"use client";

import React, { ReactNode, Suspense, memo, useCallback } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ThemeProvider } from "next-themes";
import dynamic from "next/dynamic";

// Import contexts and providers
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";
import { PlacementFormProvider } from "@/context/PlacementFormContext";
import { ServerLoadingProvider } from "@/providers/ServerLoadingProvider";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { ToastProvider } from "@/components/shared/ui/ToastProvider";

// Dynamically import StorageProvider to prevent HMR issues
const StorageProvider = dynamic(
  () => import("@/contexts/StorageContext").then(mod => ({ default: mod.StorageProvider })),
  { 
    ssr: false,
    loading: () => <div>Loading storage...</div>
  }
);

// Dynamically import CartContextProvider to prevent HMR issues with SweetAlert2
const CartContextProvider = dynamic(
  () => import("@/contexts/CartContext").then(mod => ({ default: mod.default })),
  { 
    ssr: false,
    loading: () => <div>Loading cart...</div>
  }
);

// Dynamically import GoogleOneTapProvider to prevent HMR issues
const GoogleOneTapProvider = dynamic(
  () => import("@/providers/GoogleOneTapProvider").then(mod => ({ default: mod.GoogleOneTapProvider })),
  { 
    ssr: false,
    loading: () => <div>Loading authentication...</div>
  }
);

interface ProvidersProps {
  children: ReactNode;
}

// Memoized error fallback component to prevent re-renders
const ProviderErrorFallback = memo(function ProviderErrorFallback({ 
  error, 
  resetErrorBoundary 
}: { 
  error: Error; 
  resetErrorBoundary: () => void;
}) {
  console.error('Provider error:', error);
  
  const handleRefresh = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }, []);

  const handleReset = useCallback(() => {
    try {
      // Clear any cached modules that might be causing issues
      if (typeof window !== 'undefined') {
        // Clear any webpack module cache
        if ((window as any).__webpack_require__?.cache) {
          Object.keys((window as any).__webpack_require__.cache).forEach(key => {
            if (key.includes('sweetalert2') || key.includes('config') || key.includes('process')) {
              delete (window as any).__webpack_require__.cache[key];
            }
          });
        }
      }
      resetErrorBoundary();
    } catch (e) {
      console.error('Failed to reset error boundary:', e);
      handleRefresh();
    }
  }, [resetErrorBoundary, handleRefresh]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
        <h2 className="text-xl font-semibold mb-2 text-gray-900">Something went wrong</h2>
        <p className="text-gray-600 mb-4">Please refresh the page to continue</p>
        <div className="space-x-2">
          <button 
            onClick={handleReset} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
          <button 
            onClick={handleRefresh} 
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
});

// Memoized loading fallback to prevent unnecessary re-renders
const LoadingFallback = memo(function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
});

// Memoized auth loading component
const AuthLoadingFallback = memo(function AuthLoadingFallback() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
      <span className="ml-2 text-sm text-gray-600">Loading authentication...</span>
    </div>
  );
});

// Main Providers component with better error handling and HMR stability
export default function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary
      FallbackComponent={ProviderErrorFallback}
      onError={(error) => {
        console.error('Providers ErrorBoundary caught:', error);
      }}
      onReset={() => {
        // Clear any cached state that might be causing issues
        if (typeof window !== 'undefined') {
          // Clear any problematic cached data
          try {
            window.location.reload();
          } catch (e) {
            console.error('Failed to reload:', e);
          }
        }
      }}
    >
      <Suspense fallback={<LoadingFallback />}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
          storageKey="medh-theme"
        >
          <StorageProvider>
            <CookieConsentProvider>
              <LoadingProvider>
                <ServerLoadingProvider 
                  showGlobalIndicator={true}
                  maxDisplayedStates={3}
                  autoHideDelay={5000}
                >
                  <CartContextProvider>
                    <PlacementFormProvider>
                      <ToastProvider>
                        <Suspense fallback={<AuthLoadingFallback />}>
                          <GoogleOneTapProvider>
                            {children}
                          </GoogleOneTapProvider>
                        </Suspense>
                      </ToastProvider>
                    </PlacementFormProvider>
                  </CartContextProvider>
                </ServerLoadingProvider>
              </LoadingProvider>
            </CookieConsentProvider>
          </StorageProvider>
        </ThemeProvider>
      </Suspense>
    </ErrorBoundary>
  );
} 