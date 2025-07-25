/**
 * Quick Login Accounts Component
 * Displays remembered accounts for quick login
 */

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  User, 
  Clock, 
  X, 
  ChevronRight, 
  Shield,
  UserCircle,
  Loader2,
  AlertCircle,
  Fingerprint,
  Check,
  Key
} from "lucide-react";
import { RememberedAccountsManager, RememberedAccount } from "@/utils/rememberedAccounts";
import { showToast } from "@/utils/toastManager";
import { useIsMobile } from "@/utils/hydration";
import { buildAdvancedComponent, mobilePatterns } from "@/utils/designSystem";
import { BiometricAuthManager, useBiometricAuth } from "@/utils/biometricAuth";
import { useMobileInteractions } from "@/utils/mobileInteractions";

interface QuickLoginAccountsProps {
  onAccountSelect: (account: RememberedAccount) => void;
  onManualLogin: () => void;
  onRemoveAccount?: (email: string) => void;
  isLoading?: boolean;
  className?: string;
  enableBiometric?: boolean;
  onBiometricLogin?: (account: RememberedAccount) => void;
}

const QuickLoginAccounts: React.FC<QuickLoginAccountsProps> = ({
  onAccountSelect,
  onManualLogin,
  onRemoveAccount,
  isLoading = false,
  className = "",
  enableBiometric = true,
  onBiometricLogin
}) => {
  const [accounts, setAccounts] = useState<RememberedAccount[]>([]);
  const [quickLoginAccounts, setQuickLoginAccounts] = useState<RememberedAccount[]>([]);
  const [lastUsedAccount, setLastUsedAccount] = useState<RememberedAccount | null>(null);
  const [removingAccount, setRemovingAccount] = useState<string | null>(null);
  const [biometricAuthenticating, setBiometricAuthenticating] = useState<string | null>(null);

  // Hooks
  const { isMobile } = useIsMobile();
  const biometric = useBiometricAuth();
  const mobileInteractions = useMobileInteractions({
    hapticFeedback: true,
    touchOptimization: true
  });

  // Load accounts on component mount
  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = () => {
    try {
      // Migrate from old format first
      RememberedAccountsManager.migrateFromOldFormat();
      
      const allAccounts = RememberedAccountsManager.getAccountsSortedByUsage();
      const quickAccounts = RememberedAccountsManager.getQuickLoginAccounts();
      const lastUsed = RememberedAccountsManager.getLastUsedAccount();
      
      setAccounts(allAccounts);
      setQuickLoginAccounts(quickAccounts);
      setLastUsedAccount(lastUsed);
    } catch (error) {
      console.error('Error loading accounts:', error);
      showToast.error("Failed to load remembered accounts");
    }
  };

  const handleAccountClick = (account: RememberedAccount) => {
    if (isLoading || removingAccount || biometricAuthenticating) return;
    
    // Provide haptic feedback for account selection
    mobileInteractions.triggerHaptic('light');
    
    try {
      // Update last used account
      RememberedAccountsManager.setLastUsedAccount(account.email);
      onAccountSelect(account);
    } catch (error) {
      console.error('Error selecting account:', error);
      showToast.error("Failed to select account");
    }
  };

  const handleBiometricLogin = async (e: React.MouseEvent, account: RememberedAccount) => {
    e.stopPropagation();
    if (!enableBiometric || !biometric.capabilities.hasUserVerifyingPlatformAuthenticator || biometricAuthenticating) return;
    
    setBiometricAuthenticating(account.email);
    mobileInteractions.triggerHaptic('medium');
    
    try {
      const result = await BiometricAuthManager.authenticate(account.email);
      
      if (result.success) {
        mobileInteractions.triggerHaptic('success');
        RememberedAccountsManager.setLastUsedAccount(account.email);
        onBiometricLogin?.(account) || onAccountSelect(account);
      } else {
        mobileInteractions.triggerHaptic('error');
        showToast.error(result.error || "Biometric authentication failed");
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      mobileInteractions.triggerHaptic('error');
      showToast.error("Biometric authentication failed");
    } finally {
      setBiometricAuthenticating(null);
    }
  };

  const handleRemoveAccount = (e: React.MouseEvent, email: string) => {
    e.stopPropagation();
    if (removingAccount) return;
    
    // Provide haptic feedback for removal action
    mobileInteractions.triggerHaptic('medium');
    setRemovingAccount(email);
    
    try {
      const success = RememberedAccountsManager.removeRememberedAccount(email);
      if (success) {
        showToast.success("Account removed from quick login");
        loadAccounts();
        onRemoveAccount?.(email);
      } else {
        showToast.error("Failed to remove account");
      }
    } catch (error) {
      console.error('Error removing account:', error);
      showToast.error("Failed to remove account");
    } finally {
      setRemovingAccount(null);
    }
  };

  const formatLastLogin = (timestamp: number): string => {
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
  };

  const getAccountInitials = (fullName: string, email: string): string => {
    if (fullName && fullName.trim()) {
      const names = fullName.trim().split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      } else {
        return names[0][0].toUpperCase();
      }
    }
    return email[0].toUpperCase();
  };

  const isQuickLoginAvailable = (account: RememberedAccount): boolean => {
    return !RememberedAccountsManager.needsPasswordEntry(account.email);
  };

  if (accounts.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Enhanced Header with Mobile Optimization */}
      <div className="text-center">
        <p className={isMobile ? mobilePatterns.mobileTypography.body : "text-sm text-gray-700 dark:text-gray-300 font-medium"}>
          Choose an account to continue
        </p>
        {enableBiometric && biometric.capabilities.hasUserVerifyingPlatformAuthenticator && (
          <div className="mt-2 flex items-center justify-center gap-2 text-xs text-blue-600 dark:text-blue-400">
            <Fingerprint className="w-3 h-3" />
            <span>Biometric login available</span>
          </div>
        )}
      </div>

      {/* Enhanced Mobile-First Accounts List */}
      <div className="space-y-3">
        {accounts.map((account) => {
          const isQuickLogin = isQuickLoginAvailable(account);
          const isLastUsed = lastUsedAccount?.email === account.email;
          const isRemoving = removingAccount === account.email;
          const isBiometricAuthenticating = biometricAuthenticating === account.email;
          const canUseBiometric = enableBiometric && biometric.capabilities.hasUserVerifyingPlatformAuthenticator && 
                                 BiometricAuthManager.hasCredentialForEmail(account.email) && isQuickLogin;
          
          return (
            <div
              key={account.id}
              onClick={() => handleAccountClick(account)}
              className={`
                relative rounded-xl border cursor-pointer transition-all duration-300 group
                ${isMobile ? 'p-4 active:scale-[0.98] touch-manipulation' : 'p-4'}
                ${isLastUsed 
                  ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800' 
                  : isMobile 
                    ? buildAdvancedComponent.glassCard({ variant: 'primary' }).split(' ').slice(0, -1).join(' ') + ' border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }
                ${isLoading || isRemoving || isBiometricAuthenticating ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}
              `}
            >
              {/* Last Used Badge - Enhanced */}
              {isLastUsed && (
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
                    LAST USED
                  </div>
                </div>
              )}

              {/* Biometric Available Badge */}
              {canUseBiometric && !isLastUsed && (
                <div className="absolute -top-2 -left-2 z-10">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-1.5 rounded-full shadow-lg">
                    <Fingerprint className="w-3 h-3" />
                  </div>
                </div>
              )}

              {/* Account Content */}
              <div className="flex items-center gap-3">
                {/* Enhanced Avatar */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className={`${isMobile ? 'w-12 h-12' : 'w-10 h-10'} bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold ${isMobile ? 'text-lg' : 'text-sm'} shadow-lg`}>
                      {getAccountInitials(account.fullName, account.email)}
                    </div>
                    {/* OAuth Provider Badge */}
                    {account.provider && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-200 dark:border-gray-600 shadow-sm">
                        {account.provider === 'google' ? (
                          <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                        ) : account.provider === 'github' ? (
                          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                        ) : (
                          <UserCircle className="w-2.5 h-2.5 text-gray-400" />
                        )}
                      </div>
                    )}

                    {/* Quick Login Badge */}
                    {isQuickLogin && (
                      <div className="absolute -top-1 -left-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Account Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-semibold truncate ${isMobile ? 'text-base' : 'text-sm'} text-gray-900 dark:text-gray-100`}>
                      {account.fullName || account.email.split('@')[0]}
                    </h3>
                    {canUseBiometric && (
                      <Fingerprint className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className={`text-gray-600 dark:text-gray-400 truncate ${isMobile ? 'text-sm' : 'text-xs'}`}>
                    {account.email}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    {account.lastLogin && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{formatLastLogin(account.lastLogin)}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Status Badges */}
                  <div className="flex items-center gap-2 mt-2">
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
                    
                    {account.provider && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                        <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                          {account.provider.charAt(0).toUpperCase() + account.provider.slice(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Action Buttons */}
                <div className="flex items-center gap-2">
                  {/* Biometric Login Button */}
                  {canUseBiometric && (
                    <button
                      onClick={(e) => handleBiometricLogin(e, account)}
                      disabled={isBiometricAuthenticating}
                      className={`
                        p-2 rounded-lg transition-all duration-200 touch-manipulation
                        ${isBiometricAuthenticating 
                          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600' 
                          : 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 active:scale-95'
                        }
                      `}
                      title="Use biometric login"
                    >
                      {isBiometricAuthenticating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Fingerprint className="w-4 h-4" />
                      )}
                    </button>
                  )}

                  {/* Remove Account Button */}
                  {onRemoveAccount && (
                    <button
                      onClick={(e) => handleRemoveAccount(e, account.email)}
                      disabled={isRemoving}
                      className={`
                        p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 
                        rounded-lg transition-colors touch-manipulation
                        ${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                      `}
                      title="Remove account"
                    >
                      {isRemoving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                    </button>
                  )}

                  {/* Continue Arrow */}
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Manual Login Option */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onManualLogin}
          disabled={isLoading}
          className={`
            w-full px-4 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 
            font-medium rounded-lg border border-dashed border-gray-300 dark:border-gray-600 
            hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-solid transition-all 
            flex items-center justify-center gap-2 touch-manipulation
            ${isMobile ? mobilePatterns.mobileButton('ghost', 'md').replace('w-full justify-center gap-3', '') + ' py-3' : 'py-2.5'}
          `}
        >
          <Key className="w-4 h-4" />
          Login with different account
        </button>
      </div>

      {/* Enhanced Help Text with Mobile Optimization */}
      <div className="mt-4 text-center space-y-2">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
              <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Secure</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Instant</span>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-500 leading-relaxed">
          {enableBiometric && biometric.capabilities.hasUserVerifyingPlatformAuthenticator ? (
            <>
              <Fingerprint className="w-3 h-3 inline mr-1" />
              Biometric authentication available for enhanced security
            </>
          ) : quickLoginAccounts.length > 0 ? (
            <>
              <Shield className="w-3 h-3 inline mr-1" />
              Quick login accounts don't require password entry
            </>
          ) : (
            'Saved accounts provide quick access to your dashboard'
          )}
        </p>
      </div>
    </div>
  );
};

export default QuickLoginAccounts;