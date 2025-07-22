"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  authUtils, 
  IOAuthUserData
} from "@/apis/auth.api";
import { storeAuthData, sanitizeAuthData } from "@/utils/auth";
import { showToast } from "@/utils/toastManager";
import { events } from "@/utils/analytics";
import { useStorage } from "@/contexts/StorageContext";

interface GoogleOneTapProps {
  // Optional configuration
  disabled?: boolean;
  excludePaths?: string[];
  onlyOnPaths?: string[];
  autoPrompt?: boolean;
  cookiePolicy?: string;
  privacyPolicy?: string;
}

// Default paths where One Tap should NOT appear
const DEFAULT_EXCLUDE_PATHS = [
  '/login',
  '/signup', 
  '/auth/',
  '/dashboards/',
  '/profile',
  '/settings',
  '/admin',
  '/instructor',
  '/oauth'
];

// Paths where One Tap should appear (if onlyOnPaths is specified)
const DEFAULT_INCLUDE_PATHS = [
  '/',
  '/courses',
  '/about-us',
  '/contact-us',
  '/blogs',
  '/medh-membership',
  '/corporate-training-courses',
  '/hire-from-medh',
  '/join-us-as-educator',
  '/join-us-as-school-institute'
];

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          disableAutoSelect: () => void;
          storeCredential: (credential: any, callback?: () => void) => void;
          cancel: () => void;
          renderButton: (element: HTMLElement, config: any) => void;
          revoke: (email: string, callback: (response: any) => void) => void;
        };
      };
    };
  }
}

const GoogleOneTap: React.FC<GoogleOneTapProps> = ({ 
  disabled = false,
  excludePaths = DEFAULT_EXCLUDE_PATHS,
  onlyOnPaths,
  autoPrompt = true,
  cookiePolicy = "/cookie-policy",
  privacyPolicy = "/privacy-policy"
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const storageManager = useStorage();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const initializationAttempted = useRef(false);
  const promptShown = useRef(false);

  // Check if user is already authenticated
  const isAuthenticated = (): boolean => {
    if (typeof window === 'undefined') return false;
    
    // Check multiple possible token locations
    const token = localStorage.getItem('token') || 
                  localStorage.getItem('authToken') || 
                  sessionStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    return !!(token && userId && authUtils.isAuthenticated());
  };

  // Check if current path should show One Tap
  const shouldShowOneTap = (): boolean => {
    if (disabled || isAuthenticated()) return false;
    
    // If onlyOnPaths is specified, only show on those paths
    if (onlyOnPaths && onlyOnPaths.length > 0) {
      return onlyOnPaths.some(path => pathname.startsWith(path));
    }
    
    // Otherwise, show everywhere except excluded paths
    return !excludePaths.some(path => pathname.startsWith(path));
  };

  // Get role-based redirect path (similar to LoginForm)
  const getRoleBasedRedirectPath = (role: string): string => {
    const roleLower = (role || 'student').toLowerCase().trim();
    
    const rolePathMap: Record<string, string> = {
      'student': '/dashboards/student',
      'instructor': '/dashboards/instructor', 
      'admin': '/dashboards/admin',
      'corporate': '/dashboards/corporate',
      'moderator': '/dashboards/moderator'
    };

    return rolePathMap[roleLower] || '/dashboards/student';
  };

  // Extract user role from JWT token
  const getUserRoleFromToken = (token: string): string => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Try different possible role locations in the token
      let role = payload.role || payload.user?.role || payload.roles;
      
      // Handle array of roles - take the first one
      if (Array.isArray(role) && role.length > 0) {
        role = role[0];
      }
      
      return (role || 'student').toString().toLowerCase().trim();
    } catch (error) {
      console.error('Error extracting role from token:', error);
      return 'student';
    }
  };

  // Handle successful Google One Tap authentication
  const handleOneTapSuccess = (data: IOAuthUserData): void => {
    console.log('🎉 Google One Tap success:', data);
    
    if (data.access_token && data.id) {
      setIsLoading(true);
      
      // Show processing toast
      const processingToastId = showToast.loading("🔄 Signing you in with Google...", { duration: 8000 });
      
      try {
        // Store enhanced auth data using the same structure as LoginForm
        const authData = {
          token: data.access_token,
          refresh_token: data.refresh_token || '',
          id: data.id,
          full_name: data.full_name,
          email: data.email,
          role: data.role
        };
        
        const authSuccess = storeAuthData(authData, false, data.email); // Don't remember for One Tap
        
        if (authSuccess) {
          // Extract role from JWT token or use provided role
          const userRole = getUserRoleFromToken(data.access_token) || 
                          (Array.isArray(data.role) ? data.role[0] : data.role) || 
                          'student';
          
          const dashboardPath = getRoleBasedRedirectPath(userRole);
          
          // Batch localStorage operations
          const localStorageUpdates: [string, string][] = [];
          if (userRole) localStorageUpdates.push(["role", userRole]);
          if (data.full_name) localStorageUpdates.push(["fullName", data.full_name]);
          
          // Store enhanced OAuth metadata
          if (data.account_merged) localStorageUpdates.push(["oauth_account_merged", "true"]);
          if (data.profile_updated) localStorageUpdates.push(["oauth_profile_updated", "true"]);
          if (data.email_verified) localStorageUpdates.push(["oauth_email_verified", "true"]);
          
          localStorageUpdates.forEach(([key, value]) => localStorage.setItem(key, value));
          
          // Prepare storage data for StorageManager
          const storageData = {
            token: data.access_token,
            refresh_token: data.refresh_token || '',
            userId: data.id,
            email: data.email,
            role: userRole,
            fullName: data.full_name,
            permissions: data.permissions || [],
            rememberMe: false // One Tap doesn't use remember me
          };
          
          // Parallel operations
          const operations = [
            () => storageManager.login(storageData),
            () => events.login('google_one_tap'),
            () => {
              showToast.dismiss(processingToastId);
              
              // Enhanced success message based on account status
              let successMessage = '🎉 Welcome back! Signed in with Google One Tap.';
              if (data.account_merged) {
                successMessage += ' Account linked successfully.';
              }
              
              showToast.success(successMessage, { duration: 4000 });
              
              // Show additional notifications for important events
              if (data.email_verified) {
                showToast.success('✅ Email verified through Google!', { duration: 3000 });
              }
              
              if (data.profile_updated) {
                showToast.info('📝 Profile enhanced with Google data', { duration: 3000 });
              }
            }
          ];
          
          operations.forEach(op => {
            try {
              op();
            } catch (error) {
              console.warn('Non-critical One Tap operation failed:', error);
            }
          });
          
          // Redirect to dashboard after a brief delay
          setTimeout(() => {
            router.push(dashboardPath);
          }, 1500);
          
        } else {
          showToast.dismiss(processingToastId);
          showToast.error("❌ Failed to save authentication data. Please try manual login.", { duration: 5000 });
        }
      } catch (error) {
        console.error('Error processing One Tap authentication:', error);
        showToast.dismiss(processingToastId);
        showToast.error("❌ Authentication processing failed. Please try manual login.", { duration: 5000 });
      } finally {
        setIsLoading(false);
      }
    } else {
      console.error('One Tap response missing required data:', { data });
      showToast.error("❌ Google One Tap failed. Invalid response from server.", { duration: 5000 });
    }
  };

  // Handle One Tap authentication errors
  const handleOneTapError = (error: any): void => {
    console.error('Google One Tap error:', error);
    
    // Don't show error toasts for user cancellations or common issues
    if (error.message?.includes('popup_closed_by_user') || 
        error.message?.includes('access_denied') ||
        error.message?.includes('cancelled') ||
        error.message?.includes('popup_blocked')) {
      console.log('User cancelled Google One Tap or popup was blocked');
      return;
    }
    
    // Handle FedCM and network errors silently
    if (error.message?.includes('FedCM') || 
        error.message?.includes('NetworkError') ||
        error.message?.includes('Error retrieving a token')) {
      console.log('Google One Tap: FedCM/Network error (silent handling) - this is expected in some environments');
      return;
    }
    
    // Handle Google OAuth origin/client ID configuration errors
    if (error.message?.includes('origin is not allowed') ||
        error.message?.includes('client ID') ||
        error.message?.includes('GSI_LOGGER')) {
      console.warn('Google One Tap: OAuth configuration error - please check Google Cloud Console settings');
      console.info('💡 Fix: Add your domain to Authorized JavaScript origins in Google Cloud Console');
      return;
    }
    
    // Handle known backend issues silently
    if (error.message?.includes('Account Creation Issue') || 
        error.message?.includes('Student ID must follow the pattern')) {
      console.log('Google One Tap: Account creation issue (silent handling)');
      return;
    }
    
    // Handle other network issues silently
    if (error.message?.includes('Network Error') || 
        error.message?.includes('Failed to load') ||
        error.message?.includes('fetch')) {
      console.log('Google One Tap: Network issue (silent handling)');
      return;
    }
    
    // Only show errors for unexpected technical issues that aren't user-initiated or network-related
    if (!error.message?.includes('user') && !error.message?.includes('cancel')) {
      console.warn('Google One Tap: Unexpected error (silent handling):', error.message);
      // Even unexpected errors are handled silently to avoid disrupting UX
    }
  };

  // ========== PERFORMANCE OPTIMIZATIONS ==========

  // Add script loading optimization
  const scriptLoadPromise = useRef<Promise<void> | null>(null);
  const scriptLoadStartTime = useRef<number>(0);

  // Implement lazy script loading with caching
  const loadGoogleScriptOptimized = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check browser-level cache first
      if (scriptLoadPromise.current) {
        return scriptLoadPromise.current.then(resolve).catch(reject);
      }
      
      // Check if script is already loaded in DOM
      const existingScript = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
      if (existingScript && window.google?.accounts?.id) {
        scriptLoadPromise.current = Promise.resolve();
        return resolve();
      }
      
      // Start timing for performance monitoring
      scriptLoadStartTime.current = Date.now();
      
      // Load script with optimized settings
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      // Add performance attributes
      script.setAttribute('data-optimized', 'true');
      script.setAttribute('data-load-start', scriptLoadStartTime.current.toString());
      
      script.onload = () => {
        const loadTime = Date.now() - scriptLoadStartTime.current;
        console.log(`✅ Google script loaded in ${loadTime}ms`);
        scriptLoadPromise.current = Promise.resolve();
        resolve();
      };
      
      script.onerror = () => {
        console.error(`❌ Google script failed to load (${Date.now() - scriptLoadStartTime.current}ms)`);
        scriptLoadPromise.current = Promise.reject(new Error('Failed to load Google Identity Services'));
        reject(new Error('Failed to load Google Identity Services'));
      };
      
      document.head.appendChild(script);
    });
  };

  // ========== INITIALIZATION OPTIMIZATIONS ==========

  // Implement lazy initialization with caching
  const initializeOneTapOptimized = async (): Promise<void> => {
    if (initializationAttempted.current || !shouldShowOneTap()) {
      return;
    }
    
    initializationAttempted.current = true;
    
    try {
      const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      
      // Use cached script loading
      await loadGoogleScriptOptimized();
      
      // Skip initialization if already initialized
      if (window.google?.accounts?.id && isInitialized) {
        return;
      }
      
      // Initialize with minimal configuration
      window.google!.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response: any) => {
          try {
            await authUtils.handleGoogleCredentialResponse(
              response, 
              handleOneTapSuccess, 
              handleOneTapError
            );
          } catch (callbackError) {
            handleOneTapError(callbackError);
          }
        },
        // Remove unnecessary settings for faster initialization
        auto_select: false,
        cancel_on_tap_outside: true,
        context: 'signin',
        ux_mode: 'popup',
        use_fedcm_for_prompt: true,
        // Remove FedCM disabling options per migration guide
        itp_support: true,
        // Privacy and policy links
        ...(cookiePolicy && { cookie_policy: cookiePolicy }),
        ...(privacyPolicy && { privacy_policy: privacyPolicy }),
        // Remove unnecessary settings
        prompt_parent_id: null,
        state_cookie_domain: window.location.hostname
      });
      
      setIsInitialized(true);
      
      // Show prompt with optimized timing
      if (autoPrompt && !promptShown.current) {
        promptShown.current = true;
        
        const showOneTap = () => {
          try {
            window.google!.accounts.id.prompt();
          } catch (promptError) {
            handleOneTapError(promptError);
          }
        };
        
        // Reduced delay for faster initialization
        setTimeout(showOneTap, 1000); // 1 second instead of 2 seconds
      }
      
    } catch (error) {
      console.error('Failed to initialize Google One Tap:', error);
      initializationAttempted.current = false;
    };
  };

  // ========== EFFECT OPTIMIZATIONS ==========

  // Optimize useEffect for faster initialization
  useEffect(() => {
    // Reset state only when necessary
    if (initializationAttempted.current && pathname !== pathname) {
      initializationAttempted.current = false;
      promptShown.current = false;
    }
    
    // Sanitize auth data efficiently
    sanitizeAuthData();
    
    // Initialize only when conditions are met
    if (shouldShowOneTap()) {
      const timer = setTimeout(() => {
        initializeOneTapOptimized();
      }, 100); // 100ms instead of 500ms
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [pathname, disabled]);

  // ========== CLEANUP OPTIMIZATIONS ==========

  // Optimize cleanup on unmount
  useEffect(() => {
    return () => {
      // Cancel prompts efficiently
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.cancel();
        } catch (error) {
          // Ignore cleanup errors
        }
      }
      
      // Reset initialization state
      initializationAttempted.current = false;
      promptShown.current = false;
    };
  }, []);

  // ========== DEBUG FUNCTIONS ==========

  // Add performance monitoring functions
  (window as any).checkGooglePerformance = () => {
    console.group('🔍 Google One Tap Performance Report');
    console.log('Script load time:', scriptLoadStartTime.current ? `${Date.now() - scriptLoadStartTime.current}ms` : 'Not measured');
    console.log('Is initialized:', isInitialized);
    console.log('Should show One Tap:', shouldShowOneTap());
    console.groupEnd();
  };

  // This component doesn't render any visible UI
  // Add temporary debug overlay in development
  const isDev = process.env.NODE_ENV === 'development';
  
  return (
    <>
      {/* Debug indicator - only in development */}
      {isDev && (
        <div className="fixed top-4 right-4 z-[2147483646] space-y-2">
          <div className="bg-green-500 text-white px-3 py-1 rounded-md text-xs font-mono opacity-80 pointer-events-none">
            Google One Tap: {isInitialized ? 'Ready' : 'Loading...'}
          </div>
          {isInitialized && (
            <button
              onClick={() => (window as any).testGoogleOneTap?.()}
              className="block w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-mono transition-colors"
            >
              Test One Tap
            </button>
          )}
        </div>
      )}
      {/* Google One Tap is rendered by the Google Identity Services */}
      {null}
    </>
  );
};

export default GoogleOneTap; 