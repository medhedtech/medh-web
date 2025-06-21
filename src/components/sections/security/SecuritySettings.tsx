'use client';

import React, { useState, useEffect } from 'react';
import { buildAdvancedComponent, getResponsive, getEnhancedSemanticColor, typography, interactive, getAnimations, buildComponent } from '@/utils/designSystem';
import { securityUtils, ISecurityOverviewResponse, ISecuritySession, ISecurityStats } from '@/apis/security';
import { toast } from 'react-hot-toast';
import MFAManagement from '@/components/shared/security/MFAManagement';
import QRCode from 'qrcode';

interface SecurityStat {
  title: string;
  value: string | number;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
}

// Mock data for development while backend is being fixed
const getMockSecurityData = (): ISecurityOverviewResponse => ({
  success: true,
  message: 'Mock security data loaded',
  data: {
    stats: {
      active_sessions: 2,
      total_devices: 3,
      trusted_devices: 2,
      recent_logins_24h: 5,
      recent_activities_7d: 15,
      high_risk_activities: 0,
      last_login: new Date().toISOString(),
      last_login_formatted: '2 hours ago',
      account_age_days: 365,
      password_last_changed: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      password_last_changed_formatted: '30 days ago',
    },
    active_sessions: [
      {
        session_id: 'sess_current_123',
        device_id: 'dev_macbook_456',
        device_name: 'MacBook Pro',
        device_type: 'desktop' as const,
        operating_system: 'macOS 14.0',
        browser: 'Chrome 120.0',
        ip_address: '192.168.1.100',
        location: 'New Delhi, India',
        city: 'New Delhi',
        country: 'India',
        is_current: true,
        is_trusted: true,
        last_active: new Date().toISOString(),
        last_active_formatted: 'Active now',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        risk_level: 'low' as const,
        risk_factors: [],
        session_duration: '2 hours',
      },
      {
        session_id: 'sess_mobile_789',
        device_id: 'dev_iphone_012',
        device_name: 'iPhone 15',
        device_type: 'mobile' as const,
        operating_system: 'iOS 17.0',
        browser: 'Safari Mobile',
        ip_address: '192.168.1.105',
        location: 'Mumbai, India',
        city: 'Mumbai',
        country: 'India',
        is_current: false,
        is_trusted: true,
        last_active: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        last_active_formatted: '1 hour ago',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        risk_level: 'low' as const,
        risk_factors: [],
        session_duration: '23 hours',
      },
    ],
    security_assessment: {
      overall_score: 85,
      risk_level: 'low' as const,
      risk_factors: [],
      recommendations: [
        'Consider enabling two-factor authentication',
        'Review trusted devices regularly',
        'Update password every 90 days',
      ],
      security_strengths: [
        'Strong password policy',
        'Regular login activity',
        'Trusted device management',
      ],
      areas_for_improvement: [
        'Enable 2FA for enhanced security',
        'Review device trust settings',
      ],
    },
    login_analytics: {
      login_frequency: {
        daily_average: 2.5,
        weekly_pattern: [
          { day: 'Monday', count: 3 },
          { day: 'Tuesday', count: 2 },
          { day: 'Wednesday', count: 4 },
          { day: 'Thursday', count: 2 },
          { day: 'Friday', count: 3 },
          { day: 'Saturday', count: 1 },
          { day: 'Sunday', count: 1 },
        ],
        hourly_pattern: [
          { hour: 9, count: 5 },
          { hour: 14, count: 3 },
          { hour: 18, count: 4 },
        ],
      },
      location_analysis: {
        unique_countries: 1,
        unique_cities: 2,
        most_common_location: 'New Delhi, India',
        recent_new_locations: [],
      },
      device_analysis: {
        unique_devices: 3,
        most_used_device_type: 'desktop',
        browser_distribution: [
          { browser: 'Chrome', count: 15, percentage: 75 },
          { browser: 'Safari', count: 5, percentage: 25 },
        ],
      },
      anomaly_detection: {
        unusual_login_times: 0,
        new_location_logins: 0,
        new_device_logins: 0,
        failed_login_attempts: 0,
      },
    },
    security_score: {
      overall_score: 85,
      max_score: 100,
      percentage: 85,
      grade: 'B+' as const,
      breakdown: {
        password_strength: {
          score: 20,
          max_score: 25,
          factors: ['Strong password', 'Recently updated'],
        },
        session_security: {
          score: 22,
          max_score: 25,
          factors: ['Secure sessions', 'Trusted devices'],
        },
        device_trust: {
          score: 23,
          max_score: 25,
          factors: ['Trusted devices configured', 'Regular device review'],
        },
        activity_patterns: {
          score: 20,
          max_score: 25,
          factors: ['Normal login patterns', 'No suspicious activity'],
        },
      },
      recommendations: [
        'Enable two-factor authentication',
        'Review device trust settings',
        'Update password regularly',
      ],
      improvement_tips: [
        'Set up 2FA for maximum security',
        'Review and update trusted devices',
        'Monitor login activity regularly',
      ],
    },
    quick_actions: [
      {
        action: 'enable_2fa',
        title: 'Enable 2FA',
        description: 'Add an extra layer of security',
        priority: 'high' as const,
      },
      {
        action: 'review_devices',
        title: 'Review Devices',
        description: 'Check trusted device list',
        priority: 'medium' as const,
      },
    ],
  },
});

const QRCodeDisplay: React.FC<{ value: string }> = ({ value }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    QRCode.toDataURL(value, { 
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    })
    .then(url => {
      setQrDataUrl(url);
    })
    .catch(err => {
      console.error('Error generating QR code:', err);
    });
  }, [value]);

  return qrDataUrl ? (
    <img 
      src={qrDataUrl} 
      alt="QR Code for MFA Setup"
      className="w-48 h-48 mx-auto my-4 rounded-lg shadow-md"
    />
  ) : (
    <div className="w-48 h-48 mx-auto my-4 bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Loading QR Code...</p>
    </div>
  );
};

const SecuritySettings: React.FC = () => {
  const [activeSessions, setActiveSessions] = useState<ISecuritySession[]>([]);
  const [securityStats, setSecurityStats] = useState<ISecurityStats | null>(null);
  const [securityOverview, setSecurityOverview] = useState<ISecurityOverviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);

  // Fetch security data on component mount
  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    setLoading(true);
    try {
      const response = await securityUtils.getSecurityOverview();
      
      if (response.success && response.data) {
        setSecurityOverview(response);
        setActiveSessions(response.data.active_sessions || []);
        setSecurityStats(response.data.stats);
        setUsingMockData(false);
      } else {
        // API failed, use mock data for development
        console.warn('Security API failed, using mock data:', response.message);
        const mockData = getMockSecurityData();
        setSecurityOverview(mockData);
        setActiveSessions(mockData.data.active_sessions);
        setSecurityStats(mockData.data.stats);
        setUsingMockData(true);
        
        toast.error('Using demo data - API connection failed');
      }
    } catch (error) {
      console.error('Error fetching security data:', error);
      
      // Use mock data as fallback
      const mockData = getMockSecurityData();
      setSecurityOverview(mockData);
      setActiveSessions(mockData.data.active_sessions);
      setSecurityStats(mockData.data.stats);
      setUsingMockData(true);
      
      toast.error('Using demo data - API unavailable');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAllDevices = async () => {
    if (!window.confirm('Are you sure you want to logout from all devices? This will end all active sessions except your current one.')) {
      return;
    }

    setLogoutLoading(true);
    try {
      if (usingMockData) {
        // Simulate logout for mock data
        await new Promise(resolve => setTimeout(resolve, 1500));
        setActiveSessions(prev => prev.filter(session => session.is_current));
        toast.success('Demo: Successfully logged out from all devices');
      } else {
        const response = await securityUtils.logoutAllDevices();
        
        if (response.success) {
          toast.success(response.message || 'Successfully logged out from all devices');
          // Refresh security data to show updated sessions
          await fetchSecurityData();
        } else {
          toast.error(response.message || 'Failed to logout from all devices');
        }
      }
    } catch (error) {
      console.error('Error logging out from all devices:', error);
      toast.error('Failed to logout from all devices');
    } finally {
      setLogoutLoading(false);
    }
  };

  const handleTerminateSession = async (sessionId: string) => {
    if (!window.confirm('Are you sure you want to terminate this session?')) {
      return;
    }

    try {
      if (usingMockData) {
        // Simulate session termination for mock data
        setActiveSessions(prev => prev.filter(session => session.session_id !== sessionId));
        toast.success('Demo: Session terminated successfully');
      } else {
        const response = await securityUtils.terminateSession(sessionId);
        
        if (response.success) {
          toast.success('Session terminated successfully');
          await fetchSecurityData();
        } else {
          toast.error(response.message || 'Failed to terminate session');
        }
      }
    } catch (error) {
      console.error('Error terminating session:', error);
      toast.error('Failed to terminate session');
    }
  };

  // Generate security stats from the fetched data
  const generateSecurityStatsDisplay = (): SecurityStat[] => [
    {
      title: 'Active Sessions',
      value: securityStats?.active_sessions || activeSessions.length,
      description: 'Current device sessions',
      icon: '🖥️',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Devices',
      value: securityStats?.total_devices || 0,
      description: 'Recognized devices',
      icon: '📱',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Trusted Devices',
      value: securityStats?.trusted_devices || 0,
      description: 'Verified devices',
      icon: '🔐',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Recent Logins',
      value: securityStats?.recent_logins_24h || 0,
      description: 'Last 24 hours',
      icon: '🛡️',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const securityStatsDisplay = generateSecurityStatsDisplay();

  return (
    <div className="space-y-8">
      {/* Development Notice */}
      {usingMockData && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-yellow-800">Development Mode</h3>
              <p className="text-sm text-yellow-700">
                Using demo data - Backend security API is not available. This page will work with real data once the API is connected.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className={buildAdvancedComponent.headerCard()}>
        <div className="text-center space-y-6">
          {/* Security Icon with Gradient Shadow */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3">
                <span className="text-3xl">🔐</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl blur-xl"></div>
            </div>
          </div>

          {/* Title with Gradient Text */}
          <div className="space-y-3">
            <h1 className={`${typography.h1} bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent`}>
              Security & Privacy Settings
            </h1>
            <p className={`${typography.lead} max-w-2xl mx-auto`}>
              Monitor and manage your account security, active sessions, and privacy preferences
            </p>
          </div>

          {/* Security Status Indicator */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
            securityOverview?.data?.security_assessment?.risk_level === 'low' 
              ? 'bg-green-100 text-green-700'
              : securityOverview?.data?.security_assessment?.risk_level === 'medium'
              ? 'bg-yellow-100 text-yellow-700'
              : securityOverview?.data?.security_assessment?.risk_level === 'high'
              ? 'bg-red-100 text-red-700'
              : 'bg-blue-100 text-blue-700'
          }`}>
            <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
            <span className="font-medium">
              {securityOverview?.data?.security_assessment?.risk_level === 'low' && 'Account Secure'}
              {securityOverview?.data?.security_assessment?.risk_level === 'medium' && 'Medium Risk'}
              {securityOverview?.data?.security_assessment?.risk_level === 'high' && 'High Risk'}
              {!securityOverview && 'Loading...'}
              {usingMockData && ' (Demo)'}
            </span>
          </div>
        </div>
      </div>

      {/* Security Stats Cards */}
      <div className={getResponsive.grid({ mobile: 1, tablet: 2, desktop: 4 })}>
        {securityStatsDisplay.map((stat, index) => (
          <div
            key={stat.title}
            className={`${buildAdvancedComponent.contentCard()} group hover:scale-105 ${getAnimations.transition()}`}
            style={{
              animationDelay: `${index * 150}ms`,
              animation: 'fadeInUp 0.6s ease-out forwards',
            }}
          >
            <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 ${getAnimations.transition()}`}>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <h3 className={`${typography.h3} ${stat.color} mb-2`}>{stat.value}</h3>
            <p className={`${typography.body} font-medium mb-1`}>{stat.title}</p>
            <p className="text-slate-500 text-sm">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Logout All Devices */}
        <div className={`${buildAdvancedComponent.contentCard()} bg-gradient-to-br from-orange-50 to-red-50 border-orange-200`}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xl">🔒</span>
            </div>
            <div className="flex-1">
              <h3 className={`${typography.h3} text-orange-700 mb-2`}>
                Logout All Devices
              </h3>
              <p className={`${typography.body} text-orange-600 mb-4`}>
                End all active sessions except your current device for enhanced security
              </p>
              <button
                onClick={handleLogoutAllDevices}
                disabled={logoutLoading}
                className={`${interactive.button} ${interactive.buttonPrimary} bg-red-600 hover:bg-red-700 w-full sm:w-auto`}
              >
                {logoutLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Logging out...</span>
                  </div>
                ) : (
                  'Logout All Devices'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Security Assessment */}
        <div className={`${buildAdvancedComponent.contentCard()} bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200`}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xl">🛡️</span>
            </div>
            <div className="flex-1">
              <h3 className={`${typography.h3} text-blue-700 mb-2`}>
                Security Assessment
              </h3>
              <div className="space-y-2 mb-4">
                <p className={`${typography.body} text-blue-600`}>
                  {securityOverview?.data?.security_score ? 
                    `Security Score: ${securityOverview.data.security_score.percentage}% (${securityOverview.data.security_score.grade})` :
                    'Loading security assessment...'
                  }
                </p>
                <p className="text-sm text-blue-500">
                  {securityOverview?.data?.security_assessment?.recommendations?.[0] || 'Your account security is being analyzed'}
                </p>
              </div>
              <button className={`${interactive.button} ${interactive.buttonPrimary} w-full sm:w-auto`}>
                View Full Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Factor Authentication */}
      <MFAManagement 
        onStatusChange={(enabled) => {
          // Refresh security data when MFA status changes
          fetchSecurityData();
        }}
      />

      {/* Active Sessions */}
      <div className={buildAdvancedComponent.contentCard()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`${typography.h2} text-slate-800`}>Active Sessions</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">
              {activeSessions.length} active session{activeSessions.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={fetchSecurityData}
              disabled={loading}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-slate-600">Loading sessions...</span>
            </div>
          </div>
        ) : activeSessions.length > 0 ? (
          <div className="space-y-4">
            {activeSessions.map((session, index) => (
              <div
                key={session.session_id}
                className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-md ${
                  session.is_current
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'slideInRight 0.5s ease-out forwards',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      session.device_type === 'mobile'
                        ? 'bg-blue-100 text-blue-600'
                        : session.device_type === 'desktop'
                        ? 'bg-purple-100 text-purple-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <span className="text-lg">
                        {session.device_type === 'mobile' ? '📱' : '💻'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-800">{session.device_name}</h3>
                        {session.is_current && (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                            Current
                          </span>
                        )}
                        {session.is_trusted && (
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                            Trusted
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-slate-600 space-y-1">
                        <p>{session.browser} • {session.location}</p>
                        <p>Last active: {session.last_active_formatted}</p>
                      </div>
                    </div>
                  </div>
                  
                  {!session.is_current && (
                    <button 
                      onClick={() => handleTerminateSession(session.session_id)}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Terminate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <p className="text-slate-600">No active sessions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecuritySettings; 