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

  // Load Google Identity Services script with FedCM disabled
  const loadGoogleScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Disable FedCM at the browser level if available
      try {
        if ('IdentityCredential' in window) {
          // Temporarily disable FedCM API
          (window as any).IdentityCredential = undefined;
          console.log('🔇 Disabled browser FedCM API to prevent conflicts');
        }
      } catch (e) {
        // Ignore errors when disabling FedCM
      }
      
      // Check if already loaded
      if (window.google?.accounts?.id) {
        resolve();
        return;
      }
      
      // Check if script is already in the DOM
      const existingScript = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve());
        existingScript.addEventListener('error', reject);
        return;
      }
      
      // Load the script
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
      
      document.head.appendChild(script);
    });
  };

  // Initialize Google One Tap
  const initializeOneTap = async (): Promise<void> => {
    if (initializationAttempted.current || !shouldShowOneTap()) {
      return;
    }
    
    initializationAttempted.current = true;
    
    try {
      const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      
      console.group('🔑 Google One Tap FedCM Initialization Debug');
      console.log('- Client ID configured:', !!googleClientId);
      console.log('- Client ID (masked):', googleClientId ? `${googleClientId.substring(0, 12)}...${googleClientId.substring(googleClientId.length - 12)}` : 'NOT SET');
      console.log('- Client ID ends with:', googleClientId ? googleClientId.substring(googleClientId.length - 20) : 'NOT SET');
      console.log('- Current origin:', window.location.origin);
      console.log('- Current pathname:', pathname);
      console.log('- Should show One Tap:', shouldShowOneTap());
      console.log('- Chrome version:', navigator.userAgent.match(/Chrome\/(\d+)/)?.[1] || 'Unknown');
      console.log('- FedCM support:', 'IdentityCredential' in window ? 'Available' : 'Not available');
      console.log('- Is HTTPS:', window.location.protocol === 'https:');
      console.groupEnd();
      
      if (!googleClientId) {
        console.error('❌ Google Client ID not configured for One Tap');
        console.error('💡 Add NEXT_PUBLIC_GOOGLE_CLIENT_ID to your .env file');
        return;
      }
      
      // Load Google script
      await loadGoogleScript();
      
      // Initialize Google One Tap with optimized settings for display
      window.google!.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response: any) => {
          console.log('🎯 Google One Tap callback received:', { 
            hasCredential: !!response.credential,
            credentialLength: response.credential?.length || 0
          });
          
          try {
            await authUtils.handleGoogleCredentialResponse(
              response, 
              handleOneTapSuccess, 
              handleOneTapError
            );
          } catch (callbackError) {
            console.error('Google One Tap callback error:', callbackError);
            handleOneTapError(callbackError);
          }
        },
        // FedCM-compatible settings (following Google's migration guide)
        auto_select: false,
        cancel_on_tap_outside: true,
        context: 'signin',
        ux_mode: 'popup',
        use_fedcm_for_prompt: true, // Enable FedCM as recommended by Google
        // Remove FedCM disabling options per migration guide
        itp_support: true,
        // Privacy and policy links
        ...(cookiePolicy && { cookie_policy: cookiePolicy }),
        ...(privacyPolicy && { privacy_policy: privacyPolicy }),
        // Additional settings to encourage display
        prompt_parent_id: null, // Let Google choose the best position
        state_cookie_domain: window.location.hostname
      });
      
      console.log('✅ Google One Tap initialized successfully');
      
      // Add global function for manual testing (FedCM-compatible)
      (window as any).testGoogleOneTap = () => {
        console.log('🧪 Manual Google One Tap FedCM test triggered...');
        try {
          // With FedCM, we don't need to reset as aggressively
          window.google!.accounts.id.cancel();
          setTimeout(() => {
            // No notification callback with FedCM
            window.google!.accounts.id.prompt();
            console.log('✅ Manual FedCM test: Prompt requested');
          }, 500);
        } catch (e) {
          console.error('Manual FedCM test failed:', e);
        }
      };

      // Add debug function to check for hidden elements
      (window as any).debugGoogleOneTap = () => {
        console.group('🔍 Google One Tap Debug Report');
        
        // Check all potential Google elements
        const selectors = [
          'iframe[src*="accounts.google.com"]',
          '[data-testid*="credential"]',
          '[class*="credential"]',
          '[id*="credential"]',
          'div[role="dialog"]',
          '[data-testid="fedcm-account-chooser"]'
        ];
        
        selectors.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          if (elements.length > 0) {
            console.log(`Found ${elements.length} elements matching: ${selector}`);
            elements.forEach((el, i) => {
              const rect = el.getBoundingClientRect();
              const style = window.getComputedStyle(el);
              console.log(`  Element ${i + 1}:`, {
                visible: rect.width > 0 && rect.height > 0,
                display: style.display,
                visibility: style.visibility,
                opacity: style.opacity,
                zIndex: style.zIndex,
                position: style.position,
                rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
              });
            });
          }
        });
        
        console.groupEnd();
      };
      
      // Add global function to check current config
      (window as any).checkGoogleConfig = () => {
        console.group('🔍 Google One Tap Configuration Check');
        console.log('Client ID configured:', !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
        console.log('Current origin:', window.location.origin);
        console.log('Google library loaded:', !!window.google?.accounts?.id);
        console.log('Is initialized:', isInitialized);
        console.log('Should show One Tap:', shouldShowOneTap());
        console.groupEnd();
      };
      
      console.log('🧪 Manual testing functions available:');
      console.log('- testGoogleOneTap() - Force trigger One Tap');
      console.log('- checkGoogleConfig() - Check configuration');
      console.log('- debugGoogleOneTap() - Debug visibility issues');
      
      setIsInitialized(true);
      
      // Show the One Tap prompt if auto-prompt is enabled
      if (autoPrompt && !promptShown.current) {
        promptShown.current = true;
        
        // With FedCM, minimal state management is needed
        try {
          // FedCM handles suppression more intelligently
          window.google!.accounts.id.cancel();
          console.log('🔄 FedCM: Cleared any pending prompts');
        } catch (e) {
          console.log('Could not clear FedCM state:', e);
        }
        
        // Following Clerk's pattern - show One Tap UI after a short delay
        const showOneTap = () => {
          try {
            console.log('🚀 Triggering Google One Tap prompt...');
            
                        // FedCM-compatible One Tap prompt (no notification callback per migration guide)
            // With FedCM, notification callbacks cause the prompt to be skipped
            console.log('🎯 Requesting FedCM One Tap prompt...');
            window.google!.accounts.id.prompt();
            console.log('✅ FedCM One Tap: Prompt requested (browser will handle display)');
            console.log('💡 If not showing: Check browser console for FedCM errors or try incognito mode');
          } catch (promptError) {
            console.error('💥 Google One Tap prompt error:', promptError);
            // Don't show error to user, just log for debugging
          }
        };
        
        // Show One Tap after 2 seconds (FedCM-compatible timing)
        setTimeout(showOneTap, 2000);
        
        // Additional debug for FedCM issues
        setTimeout(() => {
          console.log('🔍 FedCM Debug Check:');
          console.log('- Third-party cookies enabled:', navigator.cookieEnabled);
          console.log('- In iframe:', window !== window.top);
          console.log('- Document ready state:', document.readyState);
          console.log('- FedCM credentials API:', 'credentials' in navigator && 'get' in navigator.credentials);
          
          // Check for z-index conflicts
          const container = document.getElementById('google-onetap-container');
          if (container) {
            const computedStyle = window.getComputedStyle(container);
            console.log('- Google One Tap container z-index:', computedStyle.zIndex);
            console.log('- Google One Tap container position:', computedStyle.position);
          }
          
          // Check for Google One Tap elements in DOM
          const googleElements = document.querySelectorAll('iframe[src*="accounts.google.com"], [data-testid*="credential"], [class*="credential"]');
          console.log('- Google credential elements found:', googleElements.length);
          googleElements.forEach((el, i) => {
            const style = window.getComputedStyle(el);
            console.log(`  Element ${i + 1}: z-index=${style.zIndex}, display=${style.display}, visibility=${style.visibility}`);
          });
        }, 3000);
      }
      
    } catch (error) {
      console.error('Failed to initialize Google One Tap:', error);
      // Reset initialization flag so it can be retried on next page change
      initializationAttempted.current = false;
    }
  };

  // Initialize on component mount and path changes
  useEffect(() => {
    // Reset initialization state on path change
    if (initializationAttempted.current) {
      initializationAttempted.current = false;
      promptShown.current = false;
    }
    
    // Sanitize any invalid auth data first
    sanitizeAuthData();
    
    // Add global error handler to suppress FedCM errors
    const handleGlobalError = (event: ErrorEvent) => {
      if (event.error?.message?.includes('FedCM') || 
          event.error?.message?.includes('Error retrieving a token') ||
          event.message?.includes('FedCM') ||
          event.message?.includes('Error retrieving a token')) {
        console.log('🔇 Suppressed FedCM error:', event.error?.message || event.message);
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    };
    
                 // Add console error suppression for GSI_LOGGER (updated for FedCM)
        const originalConsoleError = console.error;
        const suppressedConsoleError = (...args: any[]) => {
          const message = args.join(' ');
          if (message.includes('[GSI_LOGGER]')) {
            // Suppress FedCM-related messages that are expected during migration
            if (message.includes('Your client application uses one of the Google One Tap prompt UI status methods') ||
                message.includes('may stop functioning when FedCM becomes mandatory') ||
                message.includes('FedCM for One Tap will become mandatory') ||
                message.includes('Currently, you disable FedCM') ||
                message.includes('origin is not allowed') ||
                message.includes('Error retrieving a token') ||
                message.includes('FedCM get() rejects with NetworkError')) {
              // Don't log these as they're expected during FedCM migration
              return;
            }
          }
          originalConsoleError.apply(console, args);
        };
    
    window.addEventListener('error', handleGlobalError);
    console.error = suppressedConsoleError;
    
    // Initialize One Tap if conditions are met
    if (shouldShowOneTap()) {
      // Small delay to ensure page is settled (following Clerk's pattern)
      const timer = setTimeout(() => {
        console.log('🔄 Starting Google One Tap initialization...');
        initializeOneTap();
      }, 500); // Reduced delay for faster initialization
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener('error', handleGlobalError);
        console.error = originalConsoleError;
      };
    }
    
    return () => {
      window.removeEventListener('error', handleGlobalError);
      console.error = originalConsoleError;
    };
  }, [pathname, disabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cancel any pending One Tap prompts
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.cancel();
        } catch (error) {
          console.warn('Error cancelling Google One Tap:', error);
        }
      }
    };
  }, []);

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