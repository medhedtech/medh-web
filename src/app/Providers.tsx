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

// Import design system utilities
import { 
  buildAdvancedComponent, 
  getResponsive, 
  getAnimations, 
  mobilePatterns,
  getEnhancedSemanticColor 
} from "@/utils/designSystem";

// Professional Loading Components
const ProfessionalLoader = memo(function ProfessionalLoader({ 
  title, 
  subtitle, 
  variant = 'primary' 
}: { 
  title: string; 
  subtitle?: string; 
  variant?: 'primary' | 'secondary' | 'auth';
}) {
  const variants = {
    primary: {
      accent: getEnhancedSemanticColor('courses', 'light'),
      gradient: 'from-blue-500 to-indigo-600',
      glassBg: 'courses'
    },
    secondary: {
      accent: getEnhancedSemanticColor('support', 'light'),
      gradient: 'from-violet-500 to-purple-600', 
      glassBg: 'support'
    },
    auth: {
      accent: getEnhancedSemanticColor('enrollment', 'light'),
      gradient: 'from-pink-500 to-rose-600',
      glassBg: 'enrollment'
    }
  };

  const config = variants[variant];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className={buildAdvancedComponent.glassCard({ 
        variant: 'hero', 
        hover: false, 
        padding: 'tablet' 
      })}>
        <div className="text-center space-y-6 max-w-md">
          {/* Professional Logo/Brand */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div 
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg`}
                style={{ 
                  background: `linear-gradient(135deg, ${config.accent}, ${getEnhancedSemanticColor(config.glassBg as any, 'dark')})` 
                }}
              >
                <svg 
                  className="w-8 h-8 text-white" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 9.74s9-4.19 9-9.74V7l-10-5z"/>
                  <path d="M12 7v4l4-2-4-2z" opacity="0.7"/>
                </svg>
              </div>
              {/* Animated pulse ring */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/20 to-indigo-600/20 animate-ping"></div>
            </div>
          </div>

          {/* Multi-ring spinner */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-800 rounded-full"></div>
            <div 
              className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"
              style={{ animationDuration: '1s' }}
            ></div>
            <div 
              className="absolute inset-2 border-3 border-transparent border-t-indigo-400 rounded-full animate-spin"
              style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}
            ></div>
            <div 
              className="absolute inset-4 border-2 border-transparent border-t-violet-300 rounded-full animate-spin"
              style={{ animationDuration: '2s' }}
            ></div>
          </div>

          {/* Loading text */}
          <div className="space-y-2">
            <h3 className={`${mobilePatterns.mobileTypography.subheading} font-semibold`}>
              {title}
            </h3>
            {subtitle && (
              <p className={`${mobilePatterns.mobileTypography.body} opacity-80`}>
                {subtitle}
              </p>
            )}
          </div>

          {/* Loading dots animation */}
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ 
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1.4s' 
                }}
              ></div>
            ))}
          </div>

          {/* Progress indicator */}
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${config.gradient} rounded-full`}
              style={{ 
                width: '100%',
                animation: 'loading-bar 2s ease-in-out infinite',
                transformOrigin: 'left center'
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Custom keyframes using style tag */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes loading-bar {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(0%); }
            100% { transform: translateX(100%); }
          }
        `
      }} />
    </div>
  );
});

// Inline loading component for smaller contexts
const InlineLoader = memo(function InlineLoader({ 
  message, 
  size = 'md' 
}: { 
  message: string; 
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizes = {
    sm: { spinner: 'w-4 h-4', text: 'text-sm', padding: 'p-2' },
    md: { spinner: 'w-5 h-5', text: 'text-base', padding: 'p-3' },
    lg: { spinner: 'w-6 h-6', text: 'text-lg', padding: 'p-4' }
  };

  const config = sizes[size];

  return (
    <div className={`flex items-center justify-center ${config.padding} space-x-3`}>
      <div className={`${config.spinner} relative`}>
        <div className="absolute inset-0 border-2 border-slate-200 dark:border-slate-700 rounded-full"></div>
        <div className="absolute inset-0 border-2 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
      </div>
      <span className={`${config.text} text-slate-600 dark:text-slate-400 font-medium`}>
        {message}
      </span>
    </div>
  );
});

// Dynamically import providers with professional loading states
const StorageProvider = dynamic(
  () => import("@/contexts/StorageContext").then(mod => ({ default: mod.StorageProvider })),
  { 
    ssr: false,
    loading: () => (
      <ProfessionalLoader 
        title="Initializing Storage" 
        subtitle="Setting up secure data storage..." 
        variant="primary"
      />
    )
  }
);

const CartContextProvider = dynamic(
  () => import("@/contexts/CartContext").then(mod => ({ default: mod.default })),
  { 
    ssr: false,
    loading: () => (
      <ProfessionalLoader 
        title="Loading Cart System" 
        subtitle="Preparing your shopping experience..." 
        variant="secondary"
      />
    )
  }
);

const GoogleOneTapProvider = dynamic(
  () => import("@/providers/GoogleOneTapProvider").then(mod => ({ default: mod.GoogleOneTapProvider })),
  { 
    ssr: false,
    loading: () => (
      <InlineLoader 
        message="Loading authentication..." 
        size="md"
      />
    )
  }
);

interface ProvidersProps {
  children: ReactNode;
}

// Enhanced error fallback with professional design
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className={buildAdvancedComponent.glassCard({ 
        variant: 'hero', 
        hover: false, 
        padding: 'tablet' 
      })}>
        <div className="text-center space-y-6 max-w-md">
          {/* Error icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className={`${mobilePatterns.mobileTypography.subheading} font-semibold text-red-600 dark:text-red-400`}>
              Something went wrong
            </h3>
            <p className={`${mobilePatterns.mobileTypography.body} opacity-80`}>
              We encountered an issue loading the application. Please try again.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={handleReset} 
              className={mobilePatterns.mobileButton('primary', 'md')}
            >
              Try Again
            </button>
            <button 
              onClick={handleRefresh} 
              className={mobilePatterns.mobileButton('secondary', 'md')}
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// Main app loading fallback
const MainLoadingFallback = memo(function MainLoadingFallback() {
  return (
    <ProfessionalLoader 
      title="Loading MEDH Platform" 
      subtitle="Preparing your learning experience..." 
      variant="primary"
    />
  );
});

// Auth loading fallback
const AuthLoadingFallback = memo(function AuthLoadingFallback() {
  return (
    <div className={`${getResponsive.container('sm')} py-6`}>
      <div className={buildAdvancedComponent.glassCard({ variant: 'secondary', padding: 'mobile' })}>
        <InlineLoader 
          message="Loading authentication services..." 
          size="sm"
        />
      </div>
    </div>
  );
});

// Main Providers component with enhanced error handling and professional loading
export default function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary
      FallbackComponent={ProviderErrorFallback}
      onError={(error: Error) => {
        console.error('Providers ErrorBoundary caught:', error);
      }}
      onReset={() => {
        // Clear any cached state that might be causing issues
        if (typeof window !== 'undefined') {
          try {
            window.location.reload();
          } catch (e) {
            console.error('Failed to reload:', e);
          }
        }
      }}
    >
      <Suspense fallback={<MainLoadingFallback />}>
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