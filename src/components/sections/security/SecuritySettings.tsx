'use client';

import React, { useState, useEffect } from 'react';
import { buildAdvancedComponent, getResponsive, getEnhancedSemanticColor, typography, interactive, getAnimations } from '@/utils/designSystem';
import { authUtils } from '@/apis/auth.api';
import { toast } from 'react-hot-toast';

interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip_address: string;
  last_active: string;
  is_current: boolean;
}

interface SecurityStat {
  title: string;
  value: string | number;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
}

const SecuritySettings: React.FC = () => {
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [logoutAllLoading, setLogoutAllLoading] = useState(false);
  const [stats, setStats] = useState<SecurityStat[]>([
    {
      title: 'Active Sessions',
      value: '0',
      description: 'Devices currently logged in',
      icon: '📱',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Last Login',
      value: '--',
      description: 'Most recent login activity',
      icon: '🕒',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Security Score',
      value: 'Good',
      description: 'Overall account security',
      icon: '🛡️',
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20'
    },
    {
      title: 'Two-Factor Auth',
      value: 'Disabled',
      description: 'Additional security layer',
      icon: '🔐',
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20'
    }
  ]);

  useEffect(() => {
    loadActiveSessions();
  }, []);

  const loadActiveSessions = async () => {
    setLoading(true);
    try {
      // Mock data for demonstration - replace with actual API call
      const mockSessions: ActiveSession[] = [
        {
          id: '1',
          device: 'MacBook Pro',
          browser: 'Chrome 120.0',
          location: 'New Delhi, India',
          ip_address: '192.168.1.100',
          last_active: '2 minutes ago',
          is_current: true
        },
        {
          id: '2',
          device: 'iPhone 15',
          browser: 'Safari Mobile',
          location: 'Mumbai, India',
          ip_address: '192.168.1.105',
          last_active: '1 hour ago',
          is_current: false
        },
        {
          id: '3',
          device: 'Windows PC',
          browser: 'Edge 120.0',
          location: 'Bangalore, India',
          ip_address: '192.168.1.110',
          last_active: '3 days ago',
          is_current: false
        }
      ];

      setActiveSessions(mockSessions);
      setStats(prev => prev.map(stat => 
        stat.title === 'Active Sessions' 
          ? { ...stat, value: mockSessions.length.toString() }
          : stat.title === 'Last Login'
          ? { ...stat, value: 'Just now' }
          : stat
      ));
    } catch (error) {
      console.error('Error loading sessions:', error);
      toast.error('Failed to load active sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAllDevices = async () => {
    if (!confirm('⚠️ Are you sure you want to logout from all devices?\n\nThis will:\n• End all active sessions\n• Require re-authentication on all devices\n• Log you out immediately\n\nThis action cannot be undone.')) {
      return;
    }

    setLogoutAllLoading(true);
    try {
      const result = await authUtils.logoutAllDevices();
      
      if (result.success) {
        toast.success('✅ Successfully logged out from all devices');
        // Redirect to login page after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      } else {
        toast.error(result.message || 'Failed to logout from all devices');
      }
    } catch (error) {
      console.error('Error logging out from all devices:', error);
      toast.error('Failed to logout from all devices');
    } finally {
      setLogoutAllLoading(false);
    }
  };

  const handleTerminateSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to terminate this session?')) {
      return;
    }

    try {
      // Mock session termination - replace with actual API call
      setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
      toast.success('Session terminated successfully');
    } catch (error) {
      console.error('Error terminating session:', error);
      toast.error('Failed to terminate session');
    }
  };

  const getDeviceIcon = (device: string) => {
    if (device.includes('iPhone') || device.includes('Android')) return '📱';
    if (device.includes('iPad') || device.includes('Tablet')) return '📱';
    if (device.includes('Mac') || device.includes('Windows') || device.includes('Linux')) return '💻';
    return '🖥️';
  };

  const getSessionStatusColor = (lastActive: string) => {
    if (lastActive.includes('minutes') || lastActive.includes('seconds')) {
      return 'text-green-600 dark:text-green-400';
    }
    if (lastActive.includes('hour')) {
      return 'text-yellow-600 dark:text-yellow-400';
    }
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-8">
      {/* Hero Header Section */}
      <div className={buildAdvancedComponent.glassCard({ variant: 'hero', padding: 'desktop' })}>
        <div className="text-center relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-blue-900/10 dark:to-purple-900/10 rounded-2xl"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl mb-6 shadow-lg shadow-blue-500/25">
              <span className="text-3xl">🔒</span>
            </div>
            
            <h1 className={`${typography.h1} mb-4 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent`}>
              Security & Privacy Center
            </h1>
            
            <p className={`${typography.lead} max-w-3xl mx-auto mb-6`}>
              Take control of your account security with comprehensive monitoring, session management, and advanced protection features.
            </p>

            {/* Quick Status Indicator */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Account Secure
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Security Stats Grid */}
      <div className={getResponsive.grid({ mobile: 1, tablet: 2, desktop: 4 })}>
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`${buildAdvancedComponent.glassCard({ variant: 'primary', hover: true, padding: 'tablet' })} group relative overflow-hidden`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 ${stat.bgColor} opacity-30 group-hover:opacity-40 transition-opacity duration-300`}></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <div className={`text-right ${stat.color}`}>
                  <div className="text-2xl font-bold leading-none">
                    {stat.value}
                  </div>
                </div>
              </div>
              
              <h3 className={`${typography.h3} mb-2 text-sm font-semibold`}>
                {stat.title}
              </h3>
              
              <p className={`${typography.body} text-xs leading-relaxed`}>
                {stat.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Quick Actions */}
      <div className={buildAdvancedComponent.glassCard({ variant: 'primary', padding: 'desktop' })}>
        <div className="mb-8">
          <h2 className={`${typography.h2} mb-2 flex items-center`}>
            <span className="text-3xl mr-3">⚡</span>
            Security Actions
          </h2>
          <p className={typography.body}>
            Manage your account security with these essential actions.
          </p>
        </div>
        
        <div className={getResponsive.grid({ mobile: 1, tablet: 2 })}>
          {/* Logout All Devices - Enhanced */}
          <div className="group">
            <button
              onClick={handleLogoutAllDevices}
              disabled={logoutAllLoading}
              className={`w-full p-6 rounded-2xl border-2 border-red-200 dark:border-red-800/50 
                bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 
                hover:from-red-100 hover:to-pink-100 dark:hover:from-red-900/30 dark:hover:to-pink-900/30 
                transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 hover:-translate-y-1
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                text-left relative overflow-hidden`}
            >
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full -translate-y-12 translate-x-12 group-hover:scale-150 transition-transform duration-500"></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-red-500/10 rounded-xl">
                    <span className="text-2xl">🚪</span>
                  </div>
                  {logoutAllLoading && (
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-red-500 border-t-transparent"></div>
                  )}
                </div>
                
                <h3 className="text-lg font-bold text-red-700 dark:text-red-300 mb-2">
                  {logoutAllLoading ? 'Logging out...' : 'Logout All Devices'}
                </h3>
                
                <p className="text-sm text-red-600 dark:text-red-400 leading-relaxed">
                  End all active sessions across all devices. You'll need to sign in again everywhere.
                </p>
                
                <div className="mt-4 text-xs text-red-500 dark:text-red-400 font-medium">
                  {activeSessions.length} active sessions will be terminated
                </div>
              </div>
            </button>
          </div>

          {/* Two-Factor Auth - Enhanced */}
          <div className="group">
            <button className={`w-full p-6 rounded-2xl border-2 border-blue-200 dark:border-blue-800/50 
              bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 
              hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 
              transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1
              text-left relative overflow-hidden`}
            >
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -translate-y-12 translate-x-12 group-hover:scale-150 transition-transform duration-500"></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl">
                    <span className="text-2xl">🔐</span>
                  </div>
                  <div className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs rounded-full font-medium">
                    Recommended
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-2">
                  Enable Two-Factor Auth
                </h3>
                
                <p className="text-sm text-blue-600 dark:text-blue-400 leading-relaxed">
                  Add an extra layer of security with authenticator apps or SMS verification.
                </p>
                
                <div className="mt-4 text-xs text-blue-500 dark:text-blue-400 font-medium">
                  Currently: Disabled
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Active Sessions */}
      <div className={buildAdvancedComponent.glassCard({ variant: 'primary', padding: 'desktop' })}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className={`${typography.h2} mb-2 flex items-center`}>
              <span className="text-3xl mr-3">📱</span>
              Active Sessions
            </h2>
            <p className={typography.body}>
              Monitor and manage all devices currently signed into your account.
            </p>
          </div>
          
          <button
            onClick={loadActiveSessions}
            disabled={loading}
            className={`${interactive.button} ${interactive.buttonSecondary} flex items-center gap-2 hover:scale-105 transition-transform duration-200`}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
            ) : (
              <span>🔄</span>
            )}
            Refresh
          </button>
        </div>

        <div className="space-y-4">
          {activeSessions.map((session, index) => (
            <div 
              key={session.id} 
              className={`group p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
                session.is_current 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800 shadow-green-500/10' 
                  : 'bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  {/* Device Icon */}
                  <div className={`p-3 rounded-xl ${
                    session.is_current 
                      ? 'bg-green-100 dark:bg-green-900/30' 
                      : 'bg-slate-100 dark:bg-slate-700'
                  }`}>
                    <span className="text-2xl">{getDeviceIcon(session.device)}</span>
                  </div>
                  
                  {/* Session Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`${typography.h3} text-base font-semibold truncate`}>
                        {session.device}
                      </h3>
                      
                      {session.is_current && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-xs rounded-full font-medium">
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                          Current Session
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <p className={`${typography.body} text-sm`}>
                        <span className="font-medium">{session.browser}</span> • {session.location}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-slate-500 dark:text-slate-400">
                          IP: {session.ip_address}
                        </span>
                        <span className={`font-medium ${getSessionStatusColor(session.last_active)}`}>
                          Last active: {session.last_active}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                {!session.is_current && (
                  <button
                    onClick={() => handleTerminateSession(session.id)}
                    className="ml-4 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 text-sm font-medium border border-red-200 dark:border-red-800/50 hover:border-red-300 dark:hover:border-red-700 hover:shadow-md"
                  >
                    Terminate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {activeSessions.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-50">🔍</div>
            <h3 className={`${typography.h3} mb-2`}>No Active Sessions</h3>
            <p className={typography.body}>
              Your account has no active sessions at the moment.
            </p>
          </div>
        )}
      </div>

      {/* Enhanced Security Tips */}
      <div className={buildAdvancedComponent.glassCard({ variant: 'secondary', padding: 'desktop' })}>
        <div className="mb-8">
          <h2 className={`${typography.h2} mb-2 flex items-center`}>
            <span className="text-3xl mr-3">💡</span>
            Security Best Practices
          </h2>
          <p className={typography.body}>
            Follow these recommendations to keep your account secure.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              icon: '🔒',
              title: 'Use Strong Passwords',
              description: 'Create unique passwords with a mix of letters, numbers, and symbols. Consider using a password manager.',
              priority: 'high'
            },
            {
              icon: '🔐',
              title: 'Enable Two-Factor Authentication',
              description: 'Add an extra layer of security with authenticator apps or SMS verification for critical actions.',
              priority: 'high'
            },
            {
              icon: '📱',
              title: 'Monitor Active Sessions',
              description: 'Regularly review your active sessions and terminate any suspicious or unrecognized devices.',
              priority: 'medium'
            },
            {
              icon: '🌐',
              title: 'Use Secure Networks',
              description: 'Avoid public Wi-Fi for sensitive activities. Use VPN when connecting to untrusted networks.',
              priority: 'medium'
            }
          ].map((tip, index) => (
            <div 
              key={index} 
              className="group p-5 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">{tip.icon}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={`${typography.h3} text-sm font-semibold`}>
                      {tip.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      tip.priority === 'high' 
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' 
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                    }`}>
                      {tip.priority === 'high' ? 'Critical' : 'Important'}
                    </span>
                  </div>
                  
                  <p className={`${typography.body} text-xs leading-relaxed`}>
                    {tip.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings; 