'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  UserX,
  Unlock,
  AlertTriangle,
  Clock,
  TrendingUp,
  TrendingDown,
  Eye,
  ExternalLink,
  RefreshCw,
  Users,
  Activity
} from 'lucide-react';
import { lockoutManagementUtils } from '@/apis';
import { showToast } from '@/utils/toastManager';
import Link from 'next/link';

interface QuickAccessData {
  total_locked: number;
  recent_lockouts: number;
  high_risk_accounts: number;
  avg_lockout_duration: number;
  recent_accounts: Array<{
    id: string;
    email: string;
    full_name: string;
    lockout_reason: string;
    remaining_time_formatted: string;
    failed_attempts: number;
  }>;
  trends: {
    lockouts_change: number;
    duration_change: number;
  };
}

interface AccountLockoutQuickAccessProps {
  className?: string;
  showRecentAccounts?: boolean;
  maxRecentAccounts?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

const AccountLockoutQuickAccess: React.FC<AccountLockoutQuickAccessProps> = ({
  className = '',
  showRecentAccounts = true,
  maxRecentAccounts = 3,
  autoRefresh = true,
  refreshInterval = 30000
}) => {
  const [data, setData] = useState<QuickAccessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchQuickAccessData = async () => {
    try {
      const response = await lockoutManagementUtils.getAllLockedAccounts();
      
      if (response.success) {
        const accounts = response.data?.accounts || [];
        
        // Mock additional data for quick access
        const quickAccessData: QuickAccessData = {
          total_locked: response.data?.total_locked || 0,
          recent_lockouts: Math.floor(Math.random() * 10) + 2,
          high_risk_accounts: accounts.filter(acc => 
            (acc.failed_login_attempts + acc.password_change_attempts) >= 5
          ).length,
          avg_lockout_duration: 8.5,
          recent_accounts: accounts.slice(0, maxRecentAccounts).map(acc => ({
            id: acc.id,
            email: acc.email,
            full_name: acc.full_name,
            lockout_reason: acc.lockout_reason,
            remaining_time_formatted: acc.remaining_time_formatted,
            failed_attempts: acc.failed_login_attempts + acc.password_change_attempts
          })),
          trends: {
            lockouts_change: Math.random() > 0.5 ? Math.random() * 20 - 10 : -(Math.random() * 15),
            duration_change: Math.random() > 0.6 ? Math.random() * 5 - 2.5 : -(Math.random() * 3)
          }
        };
        
        setData(quickAccessData);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching quick access data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickUnlock = async (userId: string, email: string) => {
    try {
      const response = await lockoutManagementUtils.unlockSpecificAccount(userId, true);
      
      if (response.success) {
        showToast.success(`Account unlocked: ${email}`);
        await fetchQuickAccessData(); // Refresh data
      } else {
        showToast.error('Failed to unlock account');
      }
    } catch (error: any) {
      showToast.error(error.message || 'Failed to unlock account');
    }
  };

  useEffect(() => {
    fetchQuickAccessData();
    
    if (autoRefresh) {
      const interval = setInterval(fetchQuickAccessData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
          <span className="text-gray-600 dark:text-gray-400">Loading security data...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <div className="text-center">
          <Shield className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 dark:text-gray-400">Unable to load security data</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Account Security
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {lastUpdated && `Updated ${lastUpdated.toLocaleTimeString()}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchQuickAccessData}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            
            <Link
              href="/dashboards/admin/account-lockouts"
              className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              title="View full dashboard"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {data.total_locked}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Currently Locked
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-1">
              <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {data.recent_lockouts}
              </span>
              {data.trends.lockouts_change !== 0 && (
                data.trends.lockouts_change > 0 ? (
                  <TrendingUp className="w-4 h-4 text-red-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-green-500" />
                )
              )}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Recent (24h)
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {data.high_risk_accounts}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              High Risk
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-1">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {data.avg_lockout_duration}m
              </span>
              {data.trends.duration_change !== 0 && (
                data.trends.duration_change > 0 ? (
                  <TrendingUp className="w-4 h-4 text-red-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-green-500" />
                )
              )}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Avg Duration
            </div>
          </motion.div>
        </div>

        {/* Recent Locked Accounts */}
        {showRecentAccounts && data.recent_accounts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Recently Locked Accounts
              </h4>
              <Link
                href="/dashboards/admin/account-lockouts"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                View All
              </Link>
            </div>
            
            <div className="space-y-3">
              {data.recent_accounts.map((account, index) => {
                const reasonDisplay = lockoutManagementUtils.getLockoutReasonDisplay(account.lockout_reason);
                const severityBadge = lockoutManagementUtils.getLockoutSeverityBadge(account.failed_attempts);
                
                return (
                  <motion.div
                    key={account.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{reasonDisplay.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {account.full_name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {account.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${severityBadge.color}`}>
                          {severityBadge.text}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {account.remaining_time_formatted}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleQuickUnlock(account.id, account.email)}
                      className="ml-3 p-1.5 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                      title="Quick unlock"
                    >
                      <Unlock className="w-4 h-4" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/dashboards/admin/account-lockouts"
              className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm"
            >
              <Users className="w-4 h-4" />
              <span>Manage Accounts</span>
            </Link>
            
            <Link
              href="/dashboards/admin/lockout-stats"
              className="flex items-center justify-center space-x-2 px-3 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-sm"
            >
              <Activity className="w-4 h-4" />
              <span>View Analytics</span>
            </Link>
            
            <Link
              href="/dashboards/admin/security-settings"
              className="flex items-center justify-center space-x-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm"
            >
              <Shield className="w-4 h-4" />
              <span>Settings</span>
            </Link>
          </div>
        </div>

        {/* Emergency Actions */}
        {data.total_locked > 10 && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span className="text-sm font-medium text-red-800 dark:text-red-200">
                  High lockout activity detected
                </span>
              </div>
              <Link
                href="/dashboards/admin/account-lockouts"
                className="text-sm text-red-600 dark:text-red-400 hover:underline"
              >
                Take Action
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountLockoutQuickAccess; 