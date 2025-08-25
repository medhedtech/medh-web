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
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { AuthProvider } from "@/components/layout/Providers";

// Dynamically import StorageProvider to prevent HMR issues
const StorageProvider = dynamic(
  () => import("@/contexts/StorageContext").then(mod => ({ default: mod.StorageProvider })),
  { 
    ssr: false,
    loading: () => <MinimalLoadingScreen />
  }
);

// Dynamically import CartContextProvider to prevent HMR issues with SweetAlert2
const CartContextProvider = dynamic(
  () => import("@/contexts/CartContext").then(mod => ({ default: mod.default })),
  { 
    ssr: false,
    loading: () => <MinimalLoadingScreen />
  }
);

// Dynamically import GoogleOneTapProvider to prevent HMR issues
const GoogleOneTapProvider = dynamic(
  () => import("@/providers/GoogleOneTapProvider").then(mod => ({ default: mod.GoogleOneTapProvider })),
  { 
    ssr: false,
    loading: () => <MinimalLoadingScreen />
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

// Memoized minimal loading screen component
const MinimalLoadingScreen = memo(function MinimalLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" className="text-blue-500 dark:text-blue-400" />
        <div className="text-center">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Loading</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Please wait...</p>
        </div>
      </div>
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
        if (typeof window !== 'undefined') {
          try {
            window.location.reload();
          } catch (e) {
            console.error('Failed to reload:', e);
          }
        }
      }}
    >
      <Suspense fallback={<MinimalLoadingScreen />}>
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
                        <AuthProvider>
                          <Suspense fallback={<MinimalLoadingScreen />}>
                            <GoogleOneTapProvider>
                              {children}
                            </GoogleOneTapProvider>
                          </Suspense>
                        </AuthProvider>
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