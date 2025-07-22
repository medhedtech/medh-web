"use client";

import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authUtils, IOAuthUserData } from '@/apis/auth.api';
import { saveAuthToken, saveUserId } from '@/utils/auth';
import { useToast } from '@/components/shared/ui/ToastProvider';
import { useTheme } from 'next-themes';

interface GoogleOneTapContextType {
  trigger: () => void;
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

export function GoogleOneTapProvider({ children }: GoogleOneTapProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const initRef = useRef(false);
  const scriptRef = useRef(false);
  const { showToast } = useToast();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Check if user should see One Tap
  const shouldShowOneTap = () => {
    if (typeof window === 'undefined') return false;
    
    // Don't show on auth pages
    const authPages = ['/login', '/signup', '/forgot-password', '/reset-password'];
    if (authPages.some(page => pathname.startsWith(page))) return false;
    
    // Don't show if user is already authenticated
    const token = localStorage.getItem('token');
    if (token && !authUtils.isTokenExpired(token)) return false;
    
    return true;
  };

  // Handle successful authentication
  const handleSuccess = async (userData: IOAuthUserData) => {
    try {
      // Store authentication data
      if (userData.access_token) {
        saveAuthToken(userData.access_token);
      }
      if (userData.id) {
        saveUserId(userData.id);
      }
      
      // Store user data in localStorage
      if (userData.full_name) {
        localStorage.setItem('userName', userData.full_name);
      }
      if (userData.email) {
        localStorage.setItem('userEmail', userData.email);
      }
      if (userData.role && userData.role.length > 0) {
        localStorage.setItem('userRole', userData.role[0]);
      }
      
      showToast.success('Successfully signed in with Google!');
      
      // Redirect based on role
      const redirectPath = getRoleBasedRedirectPath(userData.role);
      router.push(redirectPath);
      
    } catch (err: any) {
      showToast.warning('Sign in successful, but there was an issue. Please try again.');
    }
  };

  // Handle authentication errors
  const handleError = (err: any) => {
    // Don't show error for user cancellations
    if (err?.type === 'popup_closed_by_user' || err?.message?.includes('popup_closed_by_user')) {
      return;
    }
    
    showToast.error('Google sign-in failed. Please try again.');
  };

  // Get role-based redirect path
  const getRoleBasedRedirectPath = (roles: string[]) => {
    if (!roles || roles.length === 0) return '/dashboard';
    
    const roleRedirects: Record<string, string> = {
      admin: '/dashboards/admin',
      instructor: '/dashboards/instructor',
      student: '/dashboard',
      corporate: '/dashboard'
    };
    
    return roleRedirects[roles[0]] || '/dashboard';
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

  // ========== THEME SUPPORT ==========

  // Add theme to initialization if needed
  // For example, if rendering buttons:
  // theme: isDark ? 'dark' : 'light',

  // ========== INITIALIZATION ==========

  // Update initializeGoogleOneTap to use optimizations
  // (Similar to previous optimizations)
  const initializeGoogleOneTap = async () => {
    if (initRef.current) return;
    initRef.current = true;

    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    
    if (!googleClientId) {
      return;
    }

    if (!shouldShowOneTap()) {
      return;
    }

    // Load Google script
    const scriptLoaded = await loadGoogleScriptOptimized();
    if (!scriptLoaded) {
      return;
    }

    // Wait for Google API to be available
    let attempts = 0;
    const maxAttempts = 50;
    
    const waitForGoogle = () => {
      if ((window as any).google?.accounts?.id) {
        setupGoogleOneTap();
        return;
      }
      
      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(waitForGoogle, 100);
      }
    };

    waitForGoogle();
  };

  // Setup Google One Tap
  const setupGoogleOneTap = () => {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
    
    try {
      // Initialize with traditional One Tap (no FedCM)
      (window as any).google.accounts.id.initialize({
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
        // Traditional One Tap settings (no FedCM)
        auto_select: false,
        cancel_on_tap_outside: true,
        context: 'signin',
        ux_mode: 'popup',
        itp_support: true,
        // Disable FedCM to use traditional One Tap
        use_fedcm_for_prompt: false
      });
      
      // Auto-trigger after delay
      setTimeout(() => {
        triggerOneTap();
      }, 2000);
      
    } catch (err) {
      // Silently fail
    }
  };

  // Trigger One Tap prompt
  const triggerOneTap = () => {
    if (!(window as any).google?.accounts?.id) {
      return;
    }

    try {
      // Cancel any existing prompts
      (window as any).google.accounts.id.cancel();
      
      // Show the prompt
      (window as any).google.accounts.id.prompt();
      
    } catch (err) {
      // Silently fail
    }
  };

  // Initialize on mount
  useEffect(() => {
    initializeGoogleOneTap();
  }, [pathname]);

  const contextValue: GoogleOneTapContextType = {
    trigger: triggerOneTap
  };

  return (
    <GoogleOneTapContext.Provider value={contextValue}>
      {children}
    </GoogleOneTapContext.Provider>
  );
} 