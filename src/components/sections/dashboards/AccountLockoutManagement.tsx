'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  UserX, 
  Unlock, 
  AlertTriangle, 
  Clock, 
  User, 
  Mail, 
  Calendar,
  Search,
  Filter,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Activity,
  TrendingUp,
  Eye,
  MoreVertical
} from 'lucide-react';
import { lockoutManagementUtils } from '@/apis';
import { showToast } from '@/utils/toastManager';

interface LockedAccount {
  id: string;
  full_name: string;
  email: string;
  failed_login_attempts: number;
  password_change_attempts: number;
  lockout_reason: string;
  locked_until: string;
  remaining_minutes: number;
  remaining_time_formatted: string;
  created_at: string;
  last_login: string;
}

interface LockoutStats {
  total_locked: number;
  by_reason: Record<string, number>;
  by_severity: Record<string, number>;
  recent_lockouts: number;
  avg_lockout_duration: number;
}

const AccountLockoutManagement: React.FC = () => {
  const [lockedAccounts, setLockedAccounts] = useState<LockedAccount[]>([]);
  const [statistics, setStatistics] = useState<LockoutStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [unlockingAccounts, setUnlockingAccounts] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterReason, setFilterReason] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'attempts' | 'locked_until'>('locked_until');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Fetch locked accounts and statistics
  const fetchData = async () => {
    try {
      setLoading(true);
      const [accountsResponse, statsResponse] = await Promise.all([
        lockoutManagementUtils.getAllLockedAccounts(),
        lockoutManagementUtils.getLockoutStatistics()
      ]);

      if (accountsResponse.success) {
        setLockedAccounts(accountsResponse.data?.accounts || []);
        setStatistics({
          total_locked: accountsResponse.data?.total_locked || 0,
          by_reason: accountsResponse.data?.by_reason || {},
          by_severity: accountsResponse.data?.by_severity || {},
          recent_lockouts: accountsResponse.data?.recent_lockouts || 0,
          avg_lockout_duration: accountsResponse.data?.avg_lockout_duration || 0
        });
      }

      if (statsResponse.success) {
        setStatistics(prev => ({ ...prev, ...statsResponse.data }));
      }
    } catch (error) {
      console.error('Error fetching lockout data:', error);
      showToast.error('Failed to fetch lockout data');
    } finally {
      setLoading(false);
    }
  };

  // Unlock a specific account
  const handleUnlockAccount = async (userId: string, resetAttempts: boolean = true) => {
    try {
      setUnlockingAccounts(prev => new Set(prev).add(userId));
      
      const response = await lockoutManagementUtils.unlockSpecificAccount(userId, resetAttempts);
      
      if (response.success) {
        showToast.success(`Account unlocked successfully: ${response.data?.user?.email}`);
        await fetchData(); // Refresh data
      } else {
        showToast.error(response.message || 'Failed to unlock account');
      }
    } catch (error: any) {
      console.error('Error unlocking account:', error);
      showToast.error(error.message || 'Failed to unlock account');
    } finally {
      setUnlockingAccounts(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  // Bulk unlock selected accounts
  const handleBulkUnlock = async () => {
    if (selectedAccounts.size === 0) return;

    try {
      const promises = Array.from(selectedAccounts).map(userId => 
        lockoutManagementUtils.unlockSpecificAccount(userId, true)
      );
      
      const results = await Promise.allSettled(promises);
      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.length - successful;

      if (successful > 0) {
        showToast.success(`Successfully unlocked ${successful} account(s)`);
      }
      if (failed > 0) {
        showToast.error(`Failed to unlock ${failed} account(s)`);
      }

      setSelectedAccounts(new Set());
      setShowBulkActions(false);
      await fetchData();
    } catch (error) {
      console.error('Error in bulk unlock:', error);
      showToast.error('Failed to perform bulk unlock');
    }
  };

  // Emergency unlock all accounts
  const handleUnlockAll = async () => {
    if (!confirm('Are you sure you want to unlock ALL locked accounts? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await lockoutManagementUtils.unlockAllAccounts(true);
      
      if (response.success) {
        showToast.success(`Successfully unlocked ${response.data?.unlocked_count || 'all'} accounts`);
        await fetchData();
      } else {
        showToast.error(response.message || 'Failed to unlock all accounts');
      }
    } catch (error: any) {
      console.error('Error unlocking all accounts:', error);
      showToast.error(error.message || 'Failed to unlock all accounts');
    }
  };

  // Filter and sort accounts
  const filteredAndSortedAccounts = React.useMemo(() => {
    let filtered = lockedAccounts.filter(account => {
      const matchesSearch = 
        account.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterReason === 'all' || account.lockout_reason === filterReason;
      
      return matchesSearch && matchesFilter;
    });

    // Sort accounts
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.full_name.toLowerCase();
          bValue = b.full_name.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'attempts':
          aValue = a.failed_login_attempts + a.password_change_attempts;
          bValue = b.failed_login_attempts + b.password_change_attempts;
          break;
        case 'locked_until':
          aValue = new Date(a.locked_until).getTime();
          bValue = new Date(b.locked_until).getTime();
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [lockedAccounts, searchTerm, filterReason, sortBy, sortOrder]);

  useEffect(() => {
    fetchData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
          <span className="text-gray-600 dark:text-gray-400">Loading lockout data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Locked</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {statistics?.total_locked || 0}
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <UserX className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Recent Lockouts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {statistics?.recent_lockouts || 0}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Activity className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Duration</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {statistics?.avg_lockout_duration || 0}m
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.max(0, 1000 - (statistics?.total_locked || 0))}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterReason}
                onChange={(e) => setFilterReason(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Reasons</option>
                <option value="failed_login_attempts">Failed Login</option>
                <option value="password_change_attempts">Password Change</option>
                <option value="admin_lock">Admin Lock</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            {selectedAccounts.size > 0 && (
              <button
                onClick={handleBulkUnlock}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock Selected ({selectedAccounts.size})</span>
              </button>
            )}

            {statistics?.total_locked && statistics.total_locked > 0 && (
              <button
                onClick={handleUnlockAll}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Unlock All</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Locked Accounts Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Locked Accounts ({filteredAndSortedAccounts.length})
          </h3>
        </div>

        {filteredAndSortedAccounts.length === 0 ? (
          <div className="p-8 text-center">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Locked Accounts
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || filterReason !== 'all' 
                ? 'No accounts match your current filters.' 
                : 'All user accounts are currently active and unlocked.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedAccounts.size === filteredAndSortedAccounts.length && filteredAndSortedAccounts.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAccounts(new Set(filteredAndSortedAccounts.map(acc => acc.id)));
                        } else {
                          setSelectedAccounts(new Set());
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Reason & Attempts
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Lockout Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <AnimatePresence>
                  {filteredAndSortedAccounts.map((account) => {
                    const totalAttempts = account.failed_login_attempts + account.password_change_attempts;
                    const severityBadge = lockoutManagementUtils.getLockoutSeverityBadge(totalAttempts);
                    const reasonDisplay = lockoutManagementUtils.getLockoutReasonDisplay(account.lockout_reason);
                    const isUnlocking = unlockingAccounts.has(account.id);
                    
                    return (
                      <motion.tr
                        key={account.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedAccounts.has(account.id)}
                            onChange={(e) => {
                              const newSelected = new Set(selectedAccounts);
                              if (e.target.checked) {
                                newSelected.add(account.id);
                              } else {
                                newSelected.delete(account.id);
                              }
                              setSelectedAccounts(newSelected);
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {account.full_name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                <Mail className="w-3 h-3 mr-1" />
                                {account.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{reasonDisplay.icon}</span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {reasonDisplay.text}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Login: {account.failed_login_attempts} | Password: {account.password_change_attempts}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {account.remaining_time_formatted}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Until {new Date(account.locked_until).toLocaleTimeString()}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${severityBadge.color}`}>
                            {severityBadge.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleUnlockAccount(account.id, true)}
                              disabled={isUnlocking}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {isUnlocking ? (
                                <RefreshCw className="w-3 h-3 animate-spin mr-1" />
                              ) : (
                                <Unlock className="w-3 h-3 mr-1" />
                              )}
                              {isUnlocking ? 'Unlocking...' : 'Unlock'}
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountLockoutManagement; 