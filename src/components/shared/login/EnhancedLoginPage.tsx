"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Key, Mail, Clock, CheckCircle, ArrowRight, ChevronLeft } from "lucide-react";
import EnhancedGoogleLoginButton from "./EnhancedGoogleLoginButton";
import QuickLoginComponent from "./QuickLoginComponent";
import QuickLoginAccounts from "./QuickLoginAccounts";
import { IOAuthUserData } from "@/apis/auth.api";
import { useToast } from "@/components/shared/ui/ToastProvider";
import { hasRememberedAccounts, RememberedAccountsManager, RememberedAccount } from "@/utils/rememberedAccounts";
import { storeAuthData, saveUserId, saveAuthToken } from "@/utils/auth";

type LoginMethod = 'oauth' | 'password' | 'quick' | 'saved_accounts';

interface EnhancedLoginPageProps {
  className?: string;
}

const EnhancedLoginPage: React.FC<EnhancedLoginPageProps> = ({ className = "" }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('oauth');
  const [hasSavedAccounts, setHasSavedAccounts] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  // Check for saved accounts on mount
  useEffect(() => {
    const savedAccounts = hasRememberedAccounts();
    setHasSavedAccounts(savedAccounts);
    
    // Default to saved accounts if available, otherwise OAuth
    if (savedAccounts) {
      setLoginMethod('saved_accounts');
    } else {
      setLoginMethod('oauth');
    }
  }, []);

  const handleOAuthSuccess = (data: IOAuthUserData) => {
    setLoading(false);
    setError("");

    try {
      // Store authentication data
      if (data.access_token) {
        saveAuthToken(data.access_token);
      }
      if (data.id) {
        saveUserId(data.id);
      }
      
      // Store user data in localStorage
      if (data.full_name) {
        localStorage.setItem('userName', data.full_name);
      }
      if (data.email) {
        localStorage.setItem('userEmail', data.email);
      }
      if (data.role && data.role.length > 0) {
        localStorage.setItem('userRole', data.role[0]);
      }

      // Show success message with quick login key info
      let successMessage = data.is_new_user 
        ? "🎉 Account created! Welcome email sent." 
        : "👋 Welcome back!";

      if (data.quick_login_key) {
        successMessage += " Quick login key saved for faster future access.";
      }

      showToast.success(successMessage, { duration: 5000 });

      // Redirect to dashboard
      const role = data.role && data.role.length > 0 ? data.role[0] : 'student';
      const redirectPath = role === 'admin' ? '/dashboards/admin' : 
                         role === 'instructor' ? '/dashboards/instructor' : 
                         '/dashboards/student';
      
      router.push(redirectPath);
    } catch (err: any) {
      setError('Authentication successful, but there was an issue saving your session. Please try again.');
      showToast.warning('Sign in successful, but there was an issue. Please try again.');
    }
  };

  const handleOAuthError = (errorMessage: string) => {
    setLoading(false);
    setError(errorMessage);
  };

  const handleAccountSelect = (account: RememberedAccount) => {
    // This would trigger the quick login process
    // Implementation depends on your existing quick login logic
    console.log('Selected account:', account);
  };

  const handleRemoveAccount = (email: string) => {
    try {
      RememberedAccountsManager.removeRememberedAccount(email);
      showToast.success('Account removed from quick login');
      
      // Check if we still have accounts
      if (!hasRememberedAccounts()) {
        setHasSavedAccounts(false);
        setLoginMethod('oauth');
      }
    } catch (error) {
      showToast.error('Failed to remove account');
    }
  };

  const getRoleBasedRedirectPath = (role: string): string => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return '/dashboards/admin';
      case 'instructor':
        return '/dashboards/instructor';
      case 'student':
      default:
        return '/dashboards/student';
    }
  };

  return (
    <div className={`enhanced-login-page min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 ${className}`}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Sign In to Medh Learning Platform
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Choose your preferred method to continue
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Method Selector */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            {hasSavedAccounts && (
              <button
                className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                  loginMethod === 'saved_accounts'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
                onClick={() => setLoginMethod('saved_accounts')}
              >
                Saved Accounts
              </button>
            )}
            <button
              className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                loginMethod === 'oauth'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
              onClick={() => setLoginMethod('oauth')}
            >
              Social Login
            </button>
            <button
              className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                loginMethod === 'password'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
              onClick={() => setLoginMethod('password')}
            >
              Email & Password
            </button>
            <button
              className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                loginMethod === 'quick'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
              onClick={() => setLoginMethod('quick')}
            >
              Quick Login
            </button>
          </div>
        </div>

        {/* Login Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          {loginMethod === 'saved_accounts' && hasSavedAccounts && (
            <div className="saved-accounts-section">
              <QuickLoginAccounts
                onAccountSelect={handleAccountSelect}
                onManualLogin={() => setLoginMethod('oauth')}
                onRemoveAccount={handleRemoveAccount}
                isLoading={loading}
              />
            </div>
          )}

          {loginMethod === 'oauth' && (
            <div className="oauth-section">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Social Authentication
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Sign in with your social account for quick access
                </p>
              </div>

              <EnhancedGoogleLoginButton
                onSuccess={handleOAuthSuccess}
                onError={handleOAuthError}
                mode="login"
                showQuickLoginOption={true}
                defaultQuickLoginEnabled={true}
              />

              {/* Back to saved accounts */}
              {hasSavedAccounts && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setLoginMethod('saved_accounts')}
                    className="w-full py-2.5 px-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium rounded-lg border border-dashed border-blue-300 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-solid transition-all flex items-center justify-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back to saved accounts
                  </button>
                </div>
              )}
            </div>
          )}

          {loginMethod === 'password' && (
            <div className="password-section">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Email & Password
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Sign in with your email and password
                </p>
              </div>

              {/* Regular email/password form would go here */}
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Mail className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Email & Password form would be implemented here</p>
              </div>
            </div>
          )}

          {loginMethod === 'quick' && (
            <div className="quick-login-section">
              <QuickLoginComponent />
            </div>
          )}
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-900 dark:text-gray-100 font-medium">Authenticating...</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLoginPage; 