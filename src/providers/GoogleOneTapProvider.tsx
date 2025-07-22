"use client";

import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authUtils, IOAuthUserData } from '@/apis/auth.api';
import { saveAuthToken, saveUserId } from '@/utils/auth';
import { useToast } from '@/components/shared/ui/ToastProvider';

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

  // Load Google Identity Services script
  const loadGoogleScript = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (scriptRef.current || (window as any).google?.accounts?.id) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        scriptRef.current = true;
        resolve(true);
      };
      
      script.onerror = () => {
        resolve(false);
      };

      document.head.appendChild(script);
    });
  };

  // Initialize Google One Tap
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
    const scriptLoaded = await loadGoogleScript();
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