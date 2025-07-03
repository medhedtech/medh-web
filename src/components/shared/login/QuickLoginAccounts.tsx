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
  AlertCircle
} from "lucide-react";
import { RememberedAccountsManager, RememberedAccount } from "@/utils/rememberedAccounts";
import { showToast } from "@/utils/toastManager";

interface QuickLoginAccountsProps {
  onAccountSelect: (account: RememberedAccount) => void;
  onManualLogin: () => void;
  onRemoveAccount?: (email: string) => void;
  isLoading?: boolean;
  className?: string;
}

const QuickLoginAccounts: React.FC<QuickLoginAccountsProps> = ({
  onAccountSelect,
  onManualLogin,
  onRemoveAccount,
  isLoading = false,
  className = ""
}) => {
  const [accounts, setAccounts] = useState<RememberedAccount[]>([]);
  const [quickLoginAccounts, setQuickLoginAccounts] = useState<RememberedAccount[]>([]);
  const [lastUsedAccount, setLastUsedAccount] = useState<RememberedAccount | null>(null);
  const [removingAccount, setRemovingAccount] = useState<string | null>(null);

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
    if (isLoading || removingAccount) return;
    
    try {
      // Update last used account
      RememberedAccountsManager.setLastUsedAccount(account.email);
      onAccountSelect(account);
    } catch (error) {
      console.error('Error selecting account:', error);
      showToast.error("Failed to select account");
    }
  };

  const handleRemoveAccount = (e: React.MouseEvent, email: string) => {
    e.stopPropagation();
    if (removingAccount) return;
    
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
      {/* Header */}
      <div className="text-center mb-1">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Choose an account to continue
        </p>
      </div>

      {/* Accounts List */}
      <div className="space-y-2">
        {accounts.map((account) => {
          const isQuickLogin = isQuickLoginAvailable(account);
          const isLastUsed = lastUsedAccount?.email === account.email;
          const isRemoving = removingAccount === account.email;
          
          return (
            <div
              key={account.id}
              onClick={() => handleAccountClick(account)}
              className={`
                relative p-3 rounded-xl border cursor-pointer transition-all duration-200
                ${isLastUsed 
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700' 
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }
                ${isLoading || isRemoving ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
                group
              `}
            >
              {/* Account Content */}
              <div className="flex items-center space-x-3">
                {/* Avatar */}
                <div className="relative">
                  {account.avatar ? (
                    <Image
                      src={account.avatar}
                      alt={`${account.fullName} avatar`}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                      {getAccountInitials(account.fullName, account.email)}
                    </div>
                  )}
                  
                  {/* Quick Login Indicator */}
                  {isQuickLogin && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>

                {/* Account Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {account.fullName || account.email}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {account.email}
                      </p>
                    </div>
                    
                    {/* Status and Actions */}
                    <div className="flex items-center space-x-3">
                      {/* Quick Login Status */}
                      {isQuickLogin ? (
                        <div className="flex items-center text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                          Quick
                        </div>
                      ) : (
                        <div className="flex items-center text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full">
                          <Shield className="w-3 h-3 mr-1" />
                          Password
                        </div>
                      )}
                      
                      {/* Remove Button */}
                      <button
                        onClick={(e) => handleRemoveAccount(e, account.email)}
                        disabled={isRemoving || isLoading}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 dark:text-red-400 transition-opacity"
                        title="Remove account"
                      >
                        {isRemoving ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <X className="w-3.5 h-3.5" />
                        )}
                      </button>
                      
                      {/* Arrow */}
                      <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>
                  
                  {/* Role Badge */}
                  {account.role && (
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {account.role}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Last Used Indicator */}
              {isLastUsed && (
                <div className="absolute top-2 right-2">
                  <div className="flex items-center text-xs text-blue-600 dark:text-blue-400">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-1 animate-pulse"></div>
                    Last used
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Info */}
      {accounts.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-700 dark:text-blue-300">
              {quickLoginAccounts.length > 0 ? (
                <>✨ {quickLoginAccounts.length} quick login{quickLoginAccounts.length !== 1 ? 's' : ''} available</>
              ) : (
                <>🔐 Password required for all accounts</>
              )}
            </span>
            <span className="text-blue-600 dark:text-blue-400 text-xs">
              Security: 3-day limit
            </span>
          </div>
        </div>
      )}

      {/* Manual Login Option */}
      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onManualLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center px-4 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium rounded-xl border border-dashed border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-solid transition-all"
        >
          <UserCircle className="w-4 h-4 mr-2" />
          Sign in with different account
        </button>
      </div>
    </div>
  );
};

export default QuickLoginAccounts;