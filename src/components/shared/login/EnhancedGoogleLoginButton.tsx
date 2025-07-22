"use client";

import React, { useState, useEffect } from "react";
import { Loader2, CheckCircle, AlertCircle, Shield, Key, Clock } from "lucide-react";
import { authUtils, IOAuthUserData } from "@/apis/auth.api";
import { useToast } from "@/components/shared/ui/ToastProvider";

interface EnhancedGoogleLoginButtonProps {
  onSuccess?: (data: IOAuthUserData) => void;
  onError?: (error: any) => void;
  className?: string;
  mode?: 'login' | 'signup' | 'link';
  showQuickLoginOption?: boolean;
  defaultQuickLoginEnabled?: boolean;
}

const EnhancedGoogleLoginButton: React.FC<EnhancedGoogleLoginButtonProps> = ({
  onSuccess,
  onError,
  className = "",
  mode = 'login',
  showQuickLoginOption = true,
  defaultQuickLoginEnabled = false
}) => {
  const [loading, setLoading] = useState(false);
  const [quickLoginEnabled, setQuickLoginEnabled] = useState(defaultQuickLoginEnabled);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    // Check if Google Identity Services is already loaded
    if ((window as any).google?.accounts?.id) {
      setScriptLoaded(true);
      return;
    }

    // Load Google Identity Services script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setScriptLoaded(true);
    };
    
    script.onerror = () => {
      console.error('Failed to load Google Identity Services');
      showToast.error('Failed to load Google OAuth. Please check your internet connection.');
    };

    document.body.appendChild(script);

    return () => {
      // Clean up script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [showToast]);

  const handleGoogleOAuth = async () => {
    if (!scriptLoaded) {
      showToast.warning('Google OAuth is still loading. Please wait a moment.');
      return;
    }

    setLoading(true);
    
    try {
      // Show informational toast
      const actionText = mode === 'signup' ? 'sign up' : mode === 'link' ? 'link account' : 'sign in';
      showToast.info(`Opening Google ${actionText}...`, { duration: 3000 });
      
      // Open enhanced OAuth popup with quick login key option
      authUtils.openOAuthPopup(
        'google',
        // Success callback
        (data: IOAuthUserData) => {
          console.log('Google OAuth success:', data);
          setLoading(false);
          
          // Show success message with quick login key info
          let successMessage = `Google ${actionText} successful!`;
          if (data.quick_login_key && quickLoginEnabled) {
            successMessage += ' Quick login key generated for faster future logins.';
          }
          
          // Show welcome message for new users
          if (data.is_new_user) {
            showToast.success('🎉 Welcome! Check your email for welcome message.', { duration: 5000 });
          } else {
            showToast.success('👋 Welcome back! Login notification sent if from new device.', { duration: 4000 });
          }
          
          // Show additional notifications
          if (data.account_merged) {
            showToast.info('Multiple OAuth providers connected', { duration: 3000 });
          }
          
          if (data.profile_updated) {
            showToast.info('Profile enhanced with OAuth data', { duration: 3000 });
          }
          
          if (data.email_verified) {
            showToast.success('Email verified through OAuth', { duration: 3000 });
          }
          
          onSuccess?.(data);
        },
        // Error callback
        (error: any) => {
          console.error('Google OAuth error:', error);
          setLoading(false);
          
          // Enhanced error handling
          let errorMessage = 'Google authentication failed';
          
          if (error.message?.includes('Account Creation Issue') || error.message?.includes('Student ID must follow the pattern')) {
            errorMessage = 'Google sign-up temporarily unavailable';
            showToast.error(errorMessage, { duration: 8000 });
            showToast.info('Workaround: Create an account manually first, then link Google in your profile settings.', { duration: 10000 });
          } else if (error.message?.includes('Backend OAuth endpoint not implemented')) {
            errorMessage = 'Google OAuth service temporarily unavailable';
            showToast.error(errorMessage, { duration: 6000 });
            showToast.info('Please try again later or use email/password login.', { duration: 5000 });
          } else if (error.message?.includes('Network error')) {
            errorMessage = 'Network connection issue';
            showToast.error(`${errorMessage}. Please check your internet connection.`, { duration: 6000 });
          } else {
            showToast.error(`Google ${actionText} failed: ${error.message || errorMessage}`, { duration: 6000 });
          }
          
          onError?.(error);
        },
        // Options including quick login key generation
        {
          mode,
          generateQuickLoginKey: quickLoginEnabled
        }
      );
    } catch (error: any) {
      console.error('Google OAuth initialization error:', error);
      setLoading(false);
      const errorMsg = `Failed to initiate Google ${mode === 'signup' ? 'sign up' : mode === 'link' ? 'account linking' : 'sign in'}. Please try again.`;
      showToast.error(errorMsg, { duration: 5000 });
      onError?.(error);
    }
  };

  return (
    <div className={`enhanced-google-oauth ${className}`}>
      {/* Quick Login Option */}
      {showQuickLoginOption && mode !== 'link' && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={quickLoginEnabled}
              onChange={(e) => setQuickLoginEnabled(e.target.checked)}
              disabled={loading}
              className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Key className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Generate quick login key
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Enable faster future logins without entering your password. The key is securely stored locally and expires after 30 days of inactivity.
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-500">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>Secure local storage</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>30-day expiry</span>
                </div>
              </div>
            </div>
          </label>
        </div>
      )}

      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleOAuth}
        disabled={loading || !scriptLoaded}
        className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin text-gray-600 dark:text-gray-300" />
        ) : (
          <>
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {mode === 'signup' ? 'Sign up with Google' : 
               mode === 'link' ? 'Link Google Account' : 
               'Continue with Google'}
            </span>
          </>
        )}
      </button>

      {/* Loading State */}
      {loading && (
        <div className="mt-3 flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          <span>
            {mode === 'signup' ? 'Creating your account...' : 
             mode === 'link' ? 'Linking your account...' : 
             'Authenticating with Google...'}
          </span>
        </div>
      )}

      {/* Benefits List */}
      {!loading && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <CheckCircle className="w-3 h-3 text-green-500" />
            <span>No password required</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <CheckCircle className="w-3 h-3 text-green-500" />
            <span>Automatic email notifications</span>
          </div>
          {quickLoginEnabled && (
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <CheckCircle className="w-3 h-3 text-blue-500" />
              <span>Quick login key for future sessions</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <CheckCircle className="w-3 h-3 text-green-500" />
            <span>Secure OAuth authentication</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedGoogleLoginButton; 