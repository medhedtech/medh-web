/**
 * Remembered Accounts Settings Component
 * Allows users to manage their saved login accounts
 */

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  User, 
  Clock, 
  X, 
  Shield,
  UserCircle,
  Loader2,
  AlertCircle,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Settings,
  Info
} from "lucide-react";
import { RememberedAccountsManager, RememberedAccount } from "@/utils/rememberedAccounts";
import { showToast } from "@/utils/toastManager";

interface RememberedAccountsSettingsProps {
  className?: string;
}

const RememberedAccountsSettings: React.FC<RememberedAccountsSettingsProps> = ({
  className = ""
}) => {
  const [accounts, setAccounts] = useState<RememberedAccount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [removingAccount, setRemovingAccount] = useState<string | null>(null);
  const [editingAccount, setEditingAccount] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ fullName: string; avatar: string }>({
    fullName: '',
    avatar: ''
  });
  const [showDetails, setShowDetails] = useState<boolean>(false);

  // Load accounts on component mount
  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      
      // Migrate from old format first
      RememberedAccountsManager.migrateFromOldFormat();
      
      const allAccounts = RememberedAccountsManager.getAccountsSortedByUsage();
      setAccounts(allAccounts);
    } catch (error) {
      console.error('Error loading accounts:', error);
      showToast.error("Failed to load remembered accounts");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAccount = async (email: string) => {
    setRemovingAccount(email);
    
    try {
      const success = RememberedAccountsManager.removeRememberedAccount(email);
      if (success) {
        showToast.success("Account removed successfully");
        await loadAccounts();
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

  const handleClearAllAccounts = async () => {
    if (!confirm("Are you sure you want to remove all remembered accounts? This action cannot be undone.")) {
      return;
    }

    try {
      const success = RememberedAccountsManager.clearAllAccounts();
      if (success) {
        showToast.success("All accounts removed successfully");
        await loadAccounts();
      } else {
        showToast.error("Failed to clear accounts");
      }
    } catch (error) {
      console.error('Error clearing accounts:', error);
      showToast.error("Failed to clear accounts");
    }
  };

  const handleStartEdit = (account: RememberedAccount) => {
    setEditingAccount(account.id);
    setEditForm({
      fullName: account.fullName || '',
      avatar: account.avatar || ''
    });
  };

  const handleSaveEdit = async (accountId: string, email: string) => {
    try {
      // Update full name
      const account = accounts.find(acc => acc.id === accountId);
      if (account) {
        account.fullName = editForm.fullName;
        
        // Update avatar if changed
        if (editForm.avatar !== account.avatar) {
          RememberedAccountsManager.updateAccountAvatar(email, editForm.avatar);
        }
        
        showToast.success("Account updated successfully");
        await loadAccounts();
      }
    } catch (error) {
      console.error('Error updating account:', error);
      showToast.error("Failed to update account");
    } finally {
      setEditingAccount(null);
      setEditForm({ fullName: '', avatar: '' });
    }
  };

  const handleCancelEdit = () => {
    setEditingAccount(null);
    setEditForm({ fullName: '', avatar: '' });
  };

  const formatLastLogin = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) {
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Remembered Accounts
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage your saved login accounts for quick access
          </p>
        </div>
        
        {/* Toggle Details */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
        >
          {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {/* Information Panel */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              How Remembered Accounts Work
            </h4>
            <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Accounts are stored securely on your device</li>
              <li>• Quick login is available for 3 days after last use</li>
              <li>• After 3 days, password entry is required for security</li>
              <li>• Maximum of 5 accounts can be remembered</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Accounts List */}
      {accounts.length === 0 ? (
        <div className="text-center py-12">
          <UserCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Remembered Accounts
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            When you enable "Remember Me" during login, your accounts will appear here for quick access.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Actions Bar */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {accounts.length} account{accounts.length !== 1 ? 's' : ''} saved
            </span>
            
            <div className="flex items-center gap-2">
              <button
                onClick={loadAccounts}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              
              {accounts.length > 0 && (
                <button
                  onClick={handleClearAllAccounts}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Accounts */}
          {accounts.map((account) => {
            const isQuickLogin = isQuickLoginAvailable(account);
            const isEditing = editingAccount === account.id;
            const isRemoving = removingAccount === account.email;
            
            return (
              <div
                key={account.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                {/* Account Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {/* Avatar */}
                    <div className="relative">
                      {account.avatar ? (
                        <Image
                          src={account.avatar}
                          alt={`${account.fullName} avatar`}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                          {getAccountInitials(account.fullName, account.email)}
                        </div>
                      )}
                      
                      {/* Quick Login Indicator */}
                      {isQuickLogin && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>

                    {/* Account Info */}
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editForm.fullName}
                            onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                            placeholder="Full name"
                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                          <input
                            type="url"
                            value={editForm.avatar}
                            onChange={(e) => setEditForm(prev => ({ ...prev, avatar: e.target.value }))}
                            placeholder="Avatar URL (optional)"
                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {account.fullName || account.email.split('@')[0]}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {account.email}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(account.id, account.email)}
                          className="p-1.5 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                          title="Save changes"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleStartEdit(account)}
                          className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          title="Edit account"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveAccount(account.email)}
                          disabled={isRemoving}
                          className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                          title="Remove account"
                        >
                          {isRemoving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Account Details */}
                {!isEditing && (
                  <div className="space-y-2">
                    {/* Status and Role */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {/* Quick Login Status */}
                        {isQuickLogin ? (
                          <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                            Quick Login Available
                          </div>
                        ) : (
                          <div className="flex items-center text-xs text-amber-600 dark:text-amber-400">
                            <Shield className="w-3 h-3 mr-1" />
                            Password Required
                          </div>
                        )}
                        
                        {/* Role Badge */}
                        {account.role && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            {account.role}
                          </span>
                        )}
                      </div>
                      
                      {/* Last Login */}
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatLastLogin(account.lastLogin)}
                      </div>
                    </div>

                    {/* Detailed Info */}
                    {showDetails && (
                      <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Created:</span>
                            <br />
                            <span className="text-gray-900 dark:text-white">
                              {formatDate(account.createdAt)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Last Login:</span>
                            <br />
                            <span className="text-gray-900 dark:text-white">
                              {formatDate(account.lastLogin)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RememberedAccountsSettings;