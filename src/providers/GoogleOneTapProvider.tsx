"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authUtils, IOAuthUserData } from '@/apis/auth.api';
import { storeAuthData, sanitizeAuthData } from '@/utils/auth';
import { useToast } from '@/components/shared/ui/ToastProvider';
import { useTheme } from 'next-themes';
import { useStorage } from '@/contexts/StorageContext';

interface GoogleOneTapContextType {
  trigger: () => void;
  isInitialized: boolean;
  isLoading: boolean;
}

const GoogleOneTapContext = createContext<GoogleOneTapContextType | null>(null);

export const useGoogleOneTap = () => {
  const context = useContext(GoogleOneTapContext);
  if (!context) {
    throw new Error('useGoogleOneTap must be used within GoogleOneTapProvider');
  }
  return context;
};

interface GoogleOneTapProviderProps {
  children: React.ReactNode;
}

// Global type declaration
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

export function GoogleOneTapProvider({ children }: GoogleOneTapProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();
  const { theme } = useTheme();
  const storageManager = useStorage();
  
  // State management
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Refs for tracking
  const initRef = useRef(false);
  const scriptLoadPromise = useRef<Promise<void> | null>(null);
  const promptShown = useRef(false);

  // Check if user should see One Tap
  const shouldShowOneTap = () => {
    if (typeof window === 'undefined' || !mounted) return false;
    
    // Don't show on auth pages or dashboards
    const excludePaths = ['/login', '/signup', '/forgot-password', '/reset-password', '/dashboards/', '/auth/', '/oauth'];
    if (excludePaths.some(path => pathname.startsWith(path))) {
      return false;
    }
    
    // Don't show if user is already authenticated
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    
    if (token && userId && authUtils.isAuthenticated()) {
      return false;
    }
    
    return true;
  };

  // Get role-based redirect path
  const getRoleBasedRedirectPath = (roles: string[] | string) => {
    const roleArray = Array.isArray(roles) ? roles : [roles];
    if (!roleArray || roleArray.length === 0) return '/dashboards/student';
    
    const roleRedirects: Record<string, string> = {
      admin: '/dashboards/admin',
      instructor: '/dashboards/instructor',
      student: '/dashboards/student',
      corporate: '/dashboards/corporate',
      parent: '/dashboards/parent'
    };
    
    return roleRedirects[roleArray[0].toLowerCase()] || '/dashboards/student';
  };

  // Handle successful authentication
  const handleSuccess = async (userData: IOAuthUserData) => {
    setIsLoading(true);
    
    const processingToastId = showToast.loading("🔄 Signing you in with Google...", { duration: 8000 });
    
    try {
      if (!userData.access_token || !userData.id) {
        throw new Error('Missing required authentication data');
      }

      // Store authentication data using the same structure as LoginForm
      const authData = {
        token: userData.access_token,
        refresh_token: userData.refresh_token || '',
        id: userData.id,
        full_name: userData.full_name,
        email: userData.email,
        role: userData.role
      };
      
      const authSuccess = storeAuthData(authData, false, userData.email); // Don't remember for One Tap
      
      if (authSuccess) {
        // Extract role
        const userRole = Array.isArray(userData.role) ? userData.role[0] : userData.role || 'student';
        const dashboardPath = getRoleBasedRedirectPath(userRole);
        
        // Store additional data
        const localStorageUpdates: [string, string][] = [];
        if (userRole) localStorageUpdates.push(["role", userRole]);
        if (userData.full_name) localStorageUpdates.push(["fullName", userData.full_name]);
        if (userData.email) localStorageUpdates.push(["userEmail", userData.email]);
        
        localStorageUpdates.forEach(([key, value]) => localStorage.setItem(key, value));
        
                 // Update storage manager
         try {
           await storageManager.login({
             token: userData.access_token,
             userId: userData.id,
             email: userData.email,
             role: userRole,
             fullName: userData.full_name,
             permissions: userData.permissions || [],
             rememberMe: false
           });
         } catch (storageError) {
           console.warn('Storage manager update failed:', storageError);
         }
        
        showToast.dismiss(processingToastId);
        showToast.success('🎉 Welcome! Signed in with Google One Tap.', { duration: 4000 });
        
        // Redirect after delay
        setTimeout(() => {
          router.push(dashboardPath);
        }, 1500);
        
      } else {
        throw new Error('Failed to store authentication data');
      }
    } catch (error) {
      console.error('Google One Tap authentication error:', error);
      showToast.dismiss(processingToastId);
      showToast.error("❌ Authentication failed. Please try manual login.", { duration: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle authentication errors
  const handleError = (err: any) => {
    // Don't show error for user cancellations or common issues
    if (err?.type === 'popup_closed_by_user' || 
        err?.message?.includes('popup_closed_by_user') ||
        err?.message?.includes('access_denied') ||
        err?.message?.includes('cancelled')) {
      return;
    }
    
    // Handle network errors silently
    if (err?.message?.includes('NetworkError') || 
        err?.message?.includes('Failed to load') ||
        err?.message?.includes('fetch')) {
      return;
    }
    
    // Only log unexpected errors in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Google One Tap: Unexpected error:', err?.message || err);
    }
  };

  // Load Google script with optimization
  const loadGoogleScript = (): Promise<void> => {
    if (scriptLoadPromise.current) {
      return scriptLoadPromise.current;
    }
    
    // Check if script already exists
    const existingScript = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
    if (existingScript && window.google?.accounts?.id) {
      scriptLoadPromise.current = Promise.resolve();
      return scriptLoadPromise.current;
    }
    
    scriptLoadPromise.current = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        resolve();
      };
      
      script.onerror = () => {
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ Failed to load Google One Tap script');
        }
        scriptLoadPromise.current = null;
        reject(new Error('Failed to load Google Identity Services'));
      };
      
      document.head.appendChild(script);
    });
    
    return scriptLoadPromise.current;
  };

  // Initialize Google One Tap
  const initializeGoogleOneTap = async () => {
    if (initRef.current || !shouldShowOneTap()) {
      return;
    }
    
    initRef.current = true;

    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    
    if (!googleClientId) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Google Client ID not found');
      }
      return;
    }

    try {
      // Load Google script
      await loadGoogleScript();
      
      // Wait for Google API to be available
      let attempts = 0;
      const maxAttempts = 50;
      
      const waitForGoogle = () => {
        if (window.google?.accounts?.id) {
          setupGoogleOneTap();
          return;
        }
        
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(waitForGoogle, 100);
                 } else {
           if (process.env.NODE_ENV === 'development') {
             console.error('❌ Google API not available after waiting');
           }
           initRef.current = false;
         }
      };

      waitForGoogle();
             
     } catch (error) {
       if (process.env.NODE_ENV === 'development') {
         console.error('❌ Failed to initialize Google One Tap:', error);
       }
       initRef.current = false;
     }
  };

  // Setup Google One Tap
  const setupGoogleOneTap = () => {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
    
    try {
      window.google!.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response: any) => {
          try {
            await authUtils.handleGoogleCredentialResponse(
              response,
              handleSuccess,
              handleError
            );
          } catch (err) {
            handleError(err);
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
        context: 'signin',
        ux_mode: 'popup',
        itp_support: true,
        use_fedcm_for_prompt: true // Enable FedCM for better UX
      });
      
      setIsInitialized(true);
      
      // Auto-trigger after delay
      if (!promptShown.current) {
        setTimeout(() => {
          triggerOneTap();
        }, 2000);
      }
      
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Failed to setup Google One Tap:', err);
      }
      initRef.current = false;
    }
  };

  // Trigger One Tap prompt
  const triggerOneTap = () => {
    if (!window.google?.accounts?.id || !isInitialized || promptShown.current) {
      return;
    }

    try {
      promptShown.current = true;
      
      // Cancel any existing prompts first
      window.google.accounts.id.cancel();
      
      // Show the prompt with callback
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          promptShown.current = false; // Allow retry
        }
      });
      
    } catch (err) {
      promptShown.current = false;
    }
  };

  // Reset state on path change
  useEffect(() => {
    if (mounted) {
      initRef.current = false;
      promptShown.current = false;
      setIsInitialized(false);
      
      // Sanitize auth data
      sanitizeAuthData();
      
      // Initialize if conditions are met
      if (shouldShowOneTap()) {
        const timer = setTimeout(() => {
          initializeGoogleOneTap();
        }, 500);
        
        return () => clearTimeout(timer);
      }
    }
  }, [pathname, mounted]);

  // Mount effect with proper hydration handling
  useEffect(() => {
    // Prevent hydration mismatch by ensuring client-side only execution
    if (typeof window === 'undefined') return;
    
    setMounted(true);
    
    // Add global debugging functions in development
    if (process.env.NODE_ENV === 'development') {
      (window as any).testGoogleOneTap = () => {
        triggerOneTap();
      };
      
      (window as any).debugGoogleOneTap = () => {
        console.group('🔍 Google One Tap Debug Report');
        console.log('Mounted:', mounted);
        console.log('Initialized:', isInitialized);
        console.log('Should show:', shouldShowOneTap());
        console.log('Current path:', pathname);
        console.log('Google available:', !!window.google?.accounts?.id);
        console.log('Prompt shown:', promptShown.current);
        console.log('Client ID:', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.substring(0, 20) + '...');
        console.log('Auth token:', localStorage.getItem('token') ? 'Present' : 'Not found');
        console.log('User ID:', localStorage.getItem('userId') ? 'Present' : 'Not found');
        console.groupEnd();
      };
    }
    
    return () => {
      // Cleanup on unmount
      if (typeof window !== 'undefined' && window.google?.accounts?.id) {
        try {
          window.google.accounts.id.cancel();
        } catch (error) {
          // Ignore cleanup errors
        }
      }
      initRef.current = false;
      promptShown.current = false;
    };
  }, []);

  const contextValue: GoogleOneTapContextType = {
    trigger: triggerOneTap,
    isInitialized,
    isLoading
  };

  return (
    <GoogleOneTapContext.Provider value={contextValue}>
      {children}
    </GoogleOneTapContext.Provider>
  );
} 