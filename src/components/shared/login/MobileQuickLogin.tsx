"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { 
  Eye, 
  EyeOff, 
  Key, 
  ArrowRight, 
  Shield, 
  Clock, 
  Loader2, 
  AlertCircle,
  Fingerprint,
  Smartphone,
  User,
  ChevronRight,
  X,
  UserCircle,
  Check
} from "lucide-react";
import { useToast } from "@/components/shared/ui/ToastProvider";
import { authAPI } from "@/apis/auth.api";
import { RememberedAccountsManager, RememberedAccount } from "@/utils/rememberedAccounts";
import { useIsMobile } from "@/utils/hydration";
import { buildAdvancedComponent, getResponsive, mobilePatterns } from "@/utils/designSystem";
import { BiometricAuthManager, useBiometricAuth } from "@/utils/biometricAuth";
import { useMobileInteractions, MobileInteractionManager } from "@/utils/mobileInteractions";

interface MobileQuickLoginProps {
  className?: string;
  onSuccess?: () => void;
  onSwitchToRegular?: () => void;
}

interface BiometricAuthState {
  isSupported: boolean;
  isEnabled: boolean;
  isAuthenticating: boolean;
  error: string | null;
}

const MobileQuickLogin: React.FC<MobileQuickLoginProps> = ({ 
  className = "",
  onSuccess,
  onSwitchToRegular
}) => {
  // State management
  const [quickLoginKey, setQuickLoginKey] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [accounts, setAccounts] = useState<RememberedAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<RememberedAccount | null>(null);
  const [showAccountSelection, setShowAccountSelection] = useState(true);
  const [biometricAuth, setBiometricAuth] = useState<BiometricAuthState>({
    isSupported: false,
    isEnabled: false,
    isAuthenticating: false,
    error: null
  });

  // Refs
  const keyInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Hooks
  const { showToast } = useToast();
  const { isMobile, isClient } = useIsMobile();
  const biometricHook = useBiometricAuth();
  const mobileInteractions = useMobileInteractions({
    hapticFeedback: true,
    focusManagement: true,
    touchOptimization: true
  });

  // Load accounts and check biometric support on mount
  useEffect(() => {
    loadAccounts();
    checkBiometricSupport();
  }, []);

  // Auto-fill email from localStorage if no accounts available
  useEffect(() => {
    if (accounts.length === 0) {
      const storedEmail = localStorage.getItem("userEmail") || localStorage.getItem("rememberedEmail");
      if (storedEmail) {
        setEmail(storedEmail);
      }
    }
  }, [accounts]);

  const loadAccounts = useCallback(() => {
    try {
      RememberedAccountsManager.migrateFromOldFormat();
      const allAccounts = RememberedAccountsManager.getAccountsSortedByUsage();
      setAccounts(allAccounts);
      
      // If we have accounts, show selection by default
      if (allAccounts.length > 0) {
        setShowAccountSelection(true);
      } else {
        setShowAccountSelection(false);
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
      setShowAccountSelection(false);
    }
  }, []);

  const checkBiometricSupport = useCallback(async () => {
    if (!isClient) {
      return;
    }

    try {
      const capabilities = await BiometricAuthManager.checkCapabilities();
      setBiometricAuth(prev => ({
        ...prev,
        isSupported: capabilities.hasUserVerifyingPlatformAuthenticator,
        isEnabled: capabilities.hasUserVerifyingPlatformAuthenticator && BiometricAuthManager.isEnabled()
      }));
    } catch (error) {
      console.error('Biometric check failed:', error);
    }
  }, [isClient]);

  const performQuickLogin = useCallback(async (emailAddress: string, loginKey: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(authAPI.local.quickLogin, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailAddress.trim(),
          quick_login_key: loginKey.trim(),
        }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        // Store authentication data
        if (result.data.access_token || result.data.token) {
          localStorage.setItem("token", result.data.access_token || result.data.token);
        }
        if (result.data.refresh_token || result.data.session_id) {
          localStorage.setItem("refresh_token", result.data.refresh_token || result.data.session_id);
        }
        if (result.data.user?.id) {
          localStorage.setItem("userId", result.data.user.id);
        }
        if (result.data.user?.full_name) {
          localStorage.setItem("userName", result.data.user.full_name);
        }
        if (result.data.user?.email) {
          localStorage.setItem("userEmail", result.data.user.email);
        }
        if (result.data.user?.role) {
          const role = Array.isArray(result.data.user.role) ? result.data.user.role[0] : result.data.user.role;
          localStorage.setItem("userRole", role);
        }

        // Update last used account
        RememberedAccountsManager.setLastUsedAccount(emailAddress);

        // Provide success haptic feedback
        mobileInteractions.triggerHaptic('success');
        showToast.success("⚡ Quick login successful!");
        
        if (onSuccess) {
          onSuccess();
        } else {
          // Redirect based on role
          const role = Array.isArray(result.data.user?.role) ? result.data.user.role[0] : result.data.user?.role;
          const redirectPath = role === 'admin' ? '/dashboards/admin' : 
                             role === 'instructor' ? '/dashboards/instructor' : 
                             '/dashboards/student';
          
          window.location.href = redirectPath;
        }
      } else {
        // Provide error haptic feedback
        mobileInteractions.triggerHaptic('error');
        setError(result.message || "Quick login failed. Please check your key and try again.");
      }
    } catch (error: any) {
      console.error("Quick login error:", error);
      // Provide error haptic feedback
      mobileInteractions.triggerHaptic('error');
      if (error.message?.includes('Network Error')) {
        setError("Network connection issue. Please check your internet connection.");
      } else {
        setError("Quick login failed. Please try again or use password login.");
      }
    } finally {
      setLoading(false);
    }
  }, [showToast, onSuccess, mobileInteractions]);

  const handleBiometricAuth = useCallback(async () => {
    if (!biometricAuth.isSupported || !selectedAccount) return;

    setBiometricAuth(prev => ({ ...prev, isAuthenticating: true, error: null }));

    try {
      const result = await BiometricAuthManager.authenticate(selectedAccount.email);
      
      if (result.success) {
        // Use stored quick login key for biometric authenticated account
        if (selectedAccount.quickLoginKey) {
          await performQuickLogin(selectedAccount.email, selectedAccount.quickLoginKey);
        } else {
          showToast.error("Quick login key not available for this account");
        }
      } else {
        setBiometricAuth(prev => ({ ...prev, error: result.error || 'Biometric authentication failed' }));
      }
    } catch (error: any) {
      console.error('Biometric authentication failed:', error);
      setBiometricAuth(prev => ({ 
        ...prev, 
        error: 'Biometric authentication failed'
      }));
    } finally {
      setBiometricAuth(prev => ({ ...prev, isAuthenticating: false }));
    }
  }, [biometricAuth.isSupported, selectedAccount, showToast, performQuickLogin]);

  const handleQuickLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailToUse = selectedAccount?.email || email;
    const keyToUse = selectedAccount?.quickLoginKey || quickLoginKey;
    
    if (!keyToUse.trim()) {
      setError("Please enter your quick login key");
      return;
    }
    
    if (!emailToUse.trim()) {
      setError("Please enter your email address");
      return;
    }

    await performQuickLogin(emailToUse, keyToUse);
  }, [selectedAccount, email, quickLoginKey, performQuickLogin]);

  const handleAccountSelect = useCallback((account: RememberedAccount) => {
    // Provide haptic feedback for account selection
    mobileInteractions.triggerHaptic('light');
    
    setSelectedAccount(account);
    setEmail(account.email);
    
    if (account.quickLoginKey && !RememberedAccountsManager.needsPasswordEntry(account.email)) {
      // Can use quick login directly
      setQuickLoginKey(account.quickLoginKey);
      setShowAccountSelection(false);
    } else {
      // Need to enter key manually
      setShowAccountSelection(false);
      setTimeout(() => {
        if (keyInputRef.current) {
          mobileInteractions.optimizeInput(keyInputRef.current, { keyboardType: 'default' });
        }
      }, 100);
    }
  }, [mobileInteractions]);

  const handleRemoveAccount = useCallback((e: React.MouseEvent, email: string) => {
    e.stopPropagation();
    
    // Provide haptic feedback for removal action
    mobileInteractions.triggerHaptic('medium');
    
    try {
      RememberedAccountsManager.removeRememberedAccount(email);
      loadAccounts();
      showToast.success("Account removed from quick login");
    } catch (error) {
      console.error('Error removing account:', error);
      showToast.error("Failed to remove account");
    }
  }, [loadAccounts, showToast, mobileInteractions]);

  const getAccountInitials = useCallback((fullName: string, email: string): string => {
    if (fullName && fullName.trim()) {
      const names = fullName.trim().split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      } else {
        return names[0][0].toUpperCase();
      }
    }
    return email[0].toUpperCase();
  }, []);

  const formatLastLogin = useCallback((timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return 'Just now';
    }
  }, []);

  // Render account selection view
  if (showAccountSelection && accounts.length > 0) {
    return (
      <div className={`mobile-quick-login ${className}`}>
        <div className={buildAdvancedComponent.glassCard({ variant: 'primary' })}>
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <h3 className={mobilePatterns.mobileTypography.heading}>
                Quick Login
              </h3>
            </div>
            <p className={mobilePatterns.mobileTypography.body}>
              Choose an account to continue
            </p>
          </div>

          {/* Account List */}
          <div className="space-y-3 mb-6">
            {accounts.map((account) => {
              const isQuickLogin = !RememberedAccountsManager.needsPasswordEntry(account.email);
              const canUseBiometric = biometricAuth.isSupported && biometricAuth.isEnabled && isQuickLogin;
              
              return (
                <div
                  key={account.id}
                  onClick={() => handleAccountSelect(account)}
                  className={`
                    relative p-4 rounded-xl border cursor-pointer transition-all duration-300
                    bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 
                    hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg
                    active:scale-[0.98] touch-manipulation
                    ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {/* Account Content */}
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0 relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {getAccountInitials(account.fullName, account.email)}
                      </div>
                      
                      {/* OAuth Provider Badge */}
                      {account.provider && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-200 dark:border-gray-600 shadow-sm">
                          {account.provider === 'google' ? (
                            <svg className="w-3 h-3" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                          ) : account.provider === 'github' ? (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                          ) : null}
                        </div>
                      )}
                      
                      {/* Quick Login Badge */}
                      {isQuickLogin && (
                        <div className="absolute -top-1 -left-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Account Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {account.fullName || account.email.split('@')[0]}
                        </h4>
                        {canUseBiometric && (
                          <Fingerprint className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {account.email}
                      </p>
                      {account.lastLogin && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Last login: {formatLastLogin(account.lastLogin)}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {/* Remove Account Button */}
                      <button
                        onClick={(e) => handleRemoveAccount(e, account.email)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors touch-manipulation"
                        disabled={loading}
                      >
                        <X className="w-4 h-4" />
                      </button>
                      
                      {/* Quick Login Indicator */}
                      {isQuickLogin ? (
                        <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/20 rounded-full">
                          <Shield className="w-3 h-3 text-green-600 dark:text-green-400" />
                          <span className="text-xs font-medium text-green-700 dark:text-green-300">Quick</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                          <Key className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                          <span className="text-xs font-medium text-orange-700 dark:text-orange-300">Key</span>
                        </div>
                      )}
                      
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Manual Login Option */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowAccountSelection(false)}
              className={mobilePatterns.mobileButton('ghost', 'md') + ' w-full justify-center'}
              disabled={loading}
            >
              <Key className="w-4 h-4 mr-2" />
              Enter Quick Login Key Manually
            </button>
          </div>

          {/* Switch to Regular Login */}
          {onSwitchToRegular && (
            <div className="mt-3">
              <button
                onClick={onSwitchToRegular}
                className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors py-2"
                disabled={loading}
              >
                Use password login instead
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render manual key entry view
  return (
    <div className={`mobile-quick-login ${className}`}>
      <div className={buildAdvancedComponent.glassCard({ variant: 'primary' })}>
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg">
              <Key className="w-6 h-6 text-white" />
            </div>
            <h3 className={mobilePatterns.mobileTypography.heading}>
              Quick Login
            </h3>
          </div>
          <p className={mobilePatterns.mobileTypography.body}>
            {selectedAccount ? `Welcome back, ${selectedAccount.fullName || selectedAccount.email.split('@')[0]}` : 'Enter your quick login key for instant access'}
          </p>
        </div>

        {/* Selected Account Display */}
        {selectedAccount && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {getAccountInitials(selectedAccount.fullName, selectedAccount.email)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-blue-900 dark:text-blue-100 truncate">
                  {selectedAccount.fullName || selectedAccount.email.split('@')[0]}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300 truncate">
                  {selectedAccount.email}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedAccount(null);
                  setShowAccountSelection(true);
                  setEmail("");
                  setQuickLoginKey("");
                }}
                className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                disabled={loading}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Biometric Authentication */}
        {selectedAccount && biometricAuth.isSupported && biometricAuth.isEnabled && selectedAccount.quickLoginKey && (
          <div className="mb-6">
            <button
              onClick={handleBiometricAuth}
              disabled={biometricAuth.isAuthenticating || loading}
              className={`
                w-full flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-dashed border-blue-300 dark:border-blue-600 
                bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-950/30 
                transition-all duration-200 touch-manipulation
                ${biometricAuth.isAuthenticating || loading ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.98]'}
              `}
            >
              {biometricAuth.isAuthenticating ? (
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
              ) : (
                <Fingerprint className="w-6 h-6 text-blue-600" />
              )}
              <div className="text-center">
                <p className="font-medium text-blue-900 dark:text-blue-100">
                  {biometricAuth.isAuthenticating ? 'Authenticating...' : 'Use Face ID / Touch ID'}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Quick and secure login
                </p>
              </div>
            </button>
            
            {biometricAuth.error && (
              <div className="mt-2 flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-400">{biometricAuth.error}</p>
              </div>
            )}
            
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">or enter your key below</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleQuickLogin} className="space-y-4">
          {/* Email Input - Only show if no selected account */}
          {!selectedAccount && (
            <div>
              <label htmlFor="mobile-quick-email" className={mobilePatterns.mobileForm.label}>
                Email Address
              </label>
              <input
                ref={emailInputRef}
                id="mobile-quick-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={loading}
                className={mobilePatterns.mobileForm.input}
                required
                autoComplete="email"
                inputMode="email"
              />
            </div>
          )}

          {/* Quick Login Key Input */}
          <div>
            <label htmlFor="mobile-quick-key" className={mobilePatterns.mobileForm.label}>
              Quick Login Key
            </label>
            <div className="relative">
              <input
                ref={keyInputRef}
                id="mobile-quick-key"
                type={showKey ? "text" : "password"}
                value={quickLoginKey}
                onChange={(e) => setQuickLoginKey(e.target.value)}
                placeholder="Enter your quick login key"
                disabled={loading}
                className={`${mobilePatterns.mobileForm.input} pr-12`}
                required
                autoComplete="current-password"
                inputMode="text"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 touch-manipulation"
              >
                {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !quickLoginKey.trim() || (!selectedAccount && !email.trim())}
            className={`
              ${mobilePatterns.mobileButton('primary', 'lg')} w-full justify-center gap-3
              ${loading || !quickLoginKey.trim() || (!selectedAccount && !email.trim()) 
                ? 'opacity-50 cursor-not-allowed' 
                : 'shadow-lg hover:shadow-xl'
              }
            `}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <Key className="w-5 h-5" />
                <span>Quick Login</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Back to Account Selection */}
        {!showAccountSelection && accounts.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                setShowAccountSelection(true);
                setSelectedAccount(null);
                setEmail("");
                setQuickLoginKey("");
                setError("");
              }}
              className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors py-2"
              disabled={loading}
            >
              ← Back to saved accounts
            </button>
          </div>
        )}

        {/* Switch to Regular Login */}
        {onSwitchToRegular && (
          <div className="mt-3">
            <button
              onClick={onSwitchToRegular}
              className="w-full text-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors py-2"
              disabled={loading}
            >
              Use password login instead
            </button>
          </div>
        )}

        {/* Benefits */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Secure</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Instant</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-4 leading-relaxed">
            Your quick login key is encrypted and stored securely. Biometric authentication adds an extra layer of security.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileQuickLogin; 