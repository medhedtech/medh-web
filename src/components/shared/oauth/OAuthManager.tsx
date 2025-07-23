"use client";

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Link as LinkIcon, 
  Unlink, 
  Mail, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  Settings,
  User,
  ExternalLink,
  Loader2,
  Info
} from 'lucide-react';
import { showToast } from '@/utils/toastManager';
import { 
  authUtils, 
  IOAuthConnectedProvidersResponse, 
  IOAuthMergeSuggestionsResponse,
  IOAuthEmailSyncResponse
} from '@/apis/auth.api';

interface OAuthManagerProps {
  className?: string;
  compact?: boolean;
}

interface OAuthProvider {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  color: string;
  description: string;
}

const AVAILABLE_PROVIDERS: OAuthProvider[] = [
  {
    id: 'google',
    name: 'Google',
    displayName: 'Google Account',
    icon: '🔍',
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    description: 'Sign in with your Google account for seamless access'
  },
  {
    id: 'github',
    name: 'GitHub',
    displayName: 'GitHub Account',
    icon: '🐙',
    color: 'text-gray-700 bg-gray-50 border-gray-200',
    description: 'Connect your GitHub account for developer features'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    displayName: 'Facebook Account',
    icon: '📘',
    color: 'text-blue-700 bg-blue-50 border-blue-200',
    description: 'Link your Facebook account for social features'
  }
];

const OAuthManager: React.FC<OAuthManagerProps> = ({ className = '', compact = false }) => {
  const [connectedProviders, setConnectedProviders] = useState<IOAuthConnectedProvidersResponse | null>(null);
  const [mergeSuggestions, setMergeSuggestions] = useState<IOAuthMergeSuggestionsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Load OAuth data
  useEffect(() => {
    loadOAuthData();
  }, []);

  const loadOAuthData = async (): Promise<void> => {
    setLoading(true);
    try {
      const [providersResponse, suggestionsResponse] = await Promise.all([
        authUtils.getConnectedProviders(),
        authUtils.getOAuthMergeSuggestions()
      ]);

      setConnectedProviders(providersResponse);
      setMergeSuggestions(suggestionsResponse);
    } catch (error) {
      console.error('Failed to load OAuth data:', error);
      showToast.error('Failed to load OAuth settings');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkProvider = async (provider: string): Promise<void> => {
    setActionLoading(prev => ({ ...prev, [`link_${provider}`]: true }));
    
    try {
      showToast.info(`🔄 Opening ${provider} account linking...`);
      
      authUtils.openOAuthPopup(
        provider,
        // Success callback
        (data) => {
          showToast.success(`✅ ${provider} account linked successfully!`);
          loadOAuthData(); // Reload data
        },
        // Error callback
        (error) => {
          console.error(`${provider} linking error:`, error);
          showToast.error(`❌ Failed to link ${provider} account: ${error.message}`);
        },
        // Options for linking mode
        {
          mode: 'link',
          redirectUri: window.location.origin + '/auth/callback'
        }
      );
    } catch (error: any) {
      console.error(`${provider} linking error:`, error);
      showToast.error(`❌ Failed to initiate ${provider} linking`);
    } finally {
      setActionLoading(prev => ({ ...prev, [`link_${provider}`]: false }));
    }
  };

  const handleUnlinkProvider = async (provider: string): Promise<void> => {
    setActionLoading(prev => ({ ...prev, [`unlink_${provider}`]: true }));
    
    try {
      const response = await authUtils.unlinkOAuthAccount(provider);
      
      if (response.success) {
        showToast.success(`✅ ${provider} account unlinked successfully!`);
        loadOAuthData(); // Reload data
        
        // Show warning if no password set
        if (!response.data.has_password && response.data.remaining_oauth_providers.length === 0) {
          showToast.warning('⚠️ Please set a password to ensure you can still access your account', { duration: 8000 });
        }
      } else {
        showToast.error(`❌ Failed to unlink ${provider}: ${response.message}`);
      }
    } catch (error: any) {
      console.error(`${provider} unlinking error:`, error);
      showToast.error(`❌ Failed to unlink ${provider} account`);
    } finally {
      setActionLoading(prev => ({ ...prev, [`unlink_${provider}`]: false }));
    }
  };

  const handleEmailSync = async (provider: string, action: 'use_oauth_email' | 'verify_current_email' | 'add_alternative_email'): Promise<void> => {
    setActionLoading(prev => ({ ...prev, [`sync_${provider}_${action}`]: true }));
    
    try {
      const response = await authUtils.syncOAuthEmail(provider, action);
      
      if (response.success) {
        const actionName = {
          'use_oauth_email': 'switched to OAuth email',
          'verify_current_email': 'verified current email',
          'add_alternative_email': 'added alternative email'
        }[action];
        
        showToast.success(`✅ Email ${actionName} successfully!`);
        
        if (response.data.changes.length > 0) {
          showToast.info(`📧 Changes: ${response.data.changes.join(', ')}`);
        }
        
        loadOAuthData(); // Reload data
      } else {
        showToast.error(`❌ Failed to sync email: ${response.message}`);
      }
    } catch (error: any) {
      console.error('Email sync error:', error);
      showToast.error('❌ Failed to sync email with OAuth provider');
    } finally {
      setActionLoading(prev => ({ ...prev, [`sync_${provider}_${action}`]: false }));
    }
  };

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
          <span className="text-gray-600 dark:text-gray-400">Loading OAuth settings...</span>
        </div>
      </div>
    );
  }

  const connectedCount = connectedProviders?.data.connected_providers.length || 0;
  const hasPassword = connectedProviders?.data.has_password || false;
  const suggestions = mergeSuggestions?.data.suggestions || [];

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-primary-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                OAuth Account Management
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage your connected social accounts and enhance security
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-primary-600 hover:text-primary-500 flex items-center space-x-1"
          >
            <Settings className="w-4 h-4" />
            <span>Advanced</span>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Account Status */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900 dark:text-white">Account Security Status</h4>
            <div className="flex items-center space-x-2">
              {hasPassword && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Password Set
                </span>
              )}
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                <LinkIcon className="w-3 h-3 mr-1" />
                {connectedCount} Connected
              </span>
            </div>
          </div>
          
          {!hasPassword && connectedCount <= 1 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div className="text-sm text-yellow-700 dark:text-yellow-300">
                  <p className="font-medium">Security Recommendation</p>
                  <p>Set a password or connect additional OAuth providers to ensure account access.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Merge Suggestions */}
        {suggestions.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3 flex items-center">
              <Info className="w-4 h-4 mr-2" />
              Account Enhancement Suggestions
            </h4>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium">{suggestion.description}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    Risk Level: {suggestion.risk_level} | Providers: {suggestion.suggested_providers.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Connected Providers */}
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">Connected Accounts</h4>
          <div className="space-y-3">
            {AVAILABLE_PROVIDERS.map((provider) => {
              const isConnected = connectedProviders?.data.connected_providers.some(cp => cp.provider === provider.id);
              const connectedProvider = connectedProviders?.data.connected_providers.find(cp => cp.provider === provider.id);
              const isLinking = actionLoading[`link_${provider.id}`];
              const isUnlinking = actionLoading[`unlink_${provider.id}`];
              
              return (
                <div key={provider.id} className={`border rounded-lg p-4 ${provider.color} dark:bg-gray-700/50 dark:border-gray-600`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{provider.icon}</span>
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white">
                          {provider.displayName}
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {isConnected ? (
                            <>
                              Connected as {connectedProvider?.email || connectedProvider?.display_name}
                              {connectedProvider?.last_used && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 block">
                                  Last used: {new Date(connectedProvider.last_used).toLocaleDateString()}
                                </span>
                              )}
                            </>
                          ) : (
                            provider.description
                          )}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {isConnected ? (
                        <>
                          {showAdvanced && (
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleEmailSync(provider.id, 'verify_current_email')}
                                disabled={actionLoading[`sync_${provider.id}_verify_current_email`]}
                                className="text-xs px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors disabled:opacity-50"
                                title="Verify current email with this provider"
                              >
                                {actionLoading[`sync_${provider.id}_verify_current_email`] ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Mail className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          )}
                          
                          <button
                            onClick={() => handleUnlinkProvider(provider.id)}
                            disabled={isUnlinking || (!hasPassword && connectedCount <= 1)}
                            className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title={(!hasPassword && connectedCount <= 1) ? "Cannot unlink - set a password first" : "Unlink this account"}
                          >
                            {isUnlinking ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Unlink className="w-4 h-4" />
                            )}
                            <span>Unlink</span>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleLinkProvider(provider.id)}
                          disabled={isLinking}
                          className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {isLinking ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <LinkIcon className="w-4 h-4" />
                          )}
                          <span>Connect</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">Advanced Options</h4>
            <div className="space-y-3">
              <button
                onClick={loadOAuthData}
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh OAuth Data</span>
              </button>
              
              <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <p className="font-medium mb-1">About OAuth Account Management:</p>
                <ul className="space-y-1">
                  <li>• Link multiple accounts for easier access</li>
                  <li>• Email verification through trusted providers</li>
                  <li>• Enhanced security with multiple authentication methods</li>
                  <li>• Account merging for existing users</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OAuthManager; 