"use client";

import React, { useState, useEffect } from "react";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Smartphone, 
  Monitor, 
  Key, 
  Eye, 
  EyeOff, 
  Trash2, 
  Plus, 
  Settings, 
  Activity, 
  Lock,
  Unlock,
  Globe,
  Wifi,
  Battery,
  Fingerprint,
  QrCode,
  RefreshCw,
  Download,
  Upload,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Info
} from "lucide-react";
import { authUtils, IEnhancedMFAStatus, IRiskAssessment } from "@/apis/auth.api";
import { useToast } from "@/components/shared/ui/ToastProvider";
import { buildAdvancedComponent, getEnhancedSemanticColor } from "@/utils/designSystem";
import PasskeyManager from "./PasskeyManager";

interface SecurityDashboardProps {
  className?: string;
  compact?: boolean;
}

interface SecurityDevice {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet' | 'unknown';
  os: string;
  browser: string;
  lastSeen: string;
  location: string;
  ipAddress: string;
  isTrusted: boolean;
  isCurrentDevice: boolean;
  loginCount: number;
  riskScore: number;
  features: {
    hasPasskey: boolean;
    hasBiometrics: boolean;
    hasSecureConnection: boolean;
  };
}

interface SecurityEvent {
  id: string;
  type: 'login' | 'mfa_setup' | 'passkey_created' | 'suspicious_activity' | 'password_change';
  description: string;
  timestamp: string;
  location: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
}

const SecurityDashboard: React.FC<SecurityDashboardProps> = ({
  className = "",
  compact = false
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'devices' | 'activity' | 'settings'>('overview');
  const [mfaStatus, setMfaStatus] = useState<IEnhancedMFAStatus | null>(null);
  const [riskAssessment, setRiskAssessment] = useState<IRiskAssessment | null>(null);
  const [devices, setDevices] = useState<SecurityDevice[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const showToast = useToast();

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      setLoading(true);
      
      // Load MFA status
      const mfaResponse = await fetch('/api/auth/mfa/status', {
        headers: { ...authUtils.getAuthHeaders() }
      });
      if (mfaResponse.ok) {
        const mfaData = await mfaResponse.json();
        setMfaStatus(mfaData.data);
      }

      // Load risk assessment
      const riskResponse = await fetch('/api/auth/mfa/risk-assessment', {
        headers: { ...authUtils.getAuthHeaders() }
      });
      if (riskResponse.ok) {
        const riskData = await riskResponse.json();
        setRiskAssessment(riskData.data);
      }

      // Mock data for demo (replace with actual API calls)
      setDevices([
        {
          id: '1',
          name: 'MacBook Pro',
          type: 'desktop',
          os: 'macOS 14.0',
          browser: 'Chrome 119',
          lastSeen: new Date().toISOString(),
          location: 'San Francisco, CA',
          ipAddress: '192.168.1.100',
          isTrusted: true,
          isCurrentDevice: true,
          loginCount: 45,
          riskScore: 0.1,
          features: {
            hasPasskey: true,
            hasBiometrics: true,
            hasSecureConnection: true
          }
        },
        {
          id: '2',
          name: 'iPhone 15 Pro',
          type: 'mobile',
          os: 'iOS 17.1',
          browser: 'Safari',
          lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          location: 'San Francisco, CA',
          ipAddress: '192.168.1.101',
          isTrusted: true,
          isCurrentDevice: false,
          loginCount: 23,
          riskScore: 0.2,
          features: {
            hasPasskey: true,
            hasBiometrics: true,
            hasSecureConnection: true
          }
        }
      ]);

      setSecurityEvents([
        {
          id: '1',
          type: 'login',
          description: 'Successful login with passkey',
          timestamp: new Date().toISOString(),
          location: 'San Francisco, CA',
          riskLevel: 'low',
          resolved: true
        },
        {
          id: '2',
          type: 'passkey_created',
          description: 'New passkey created on MacBook Pro',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          location: 'San Francisco, CA',
          riskLevel: 'low',
          resolved: true
        }
      ]);
    } catch (error) {
      showToast.error('Failed to load security data');
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeDevice = async (deviceId: string) => {
    if (!confirm('Are you sure you want to revoke access for this device?')) return;

    try {
      setActionLoading(deviceId);
      // API call to revoke device
      showToast.success('Device access revoked');
      setDevices(prev => prev.filter(d => d.id !== deviceId));
    } catch (error) {
      showToast.error('Failed to revoke device access');
    } finally {
      setActionLoading(null);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'high': return 'text-orange-600 dark:text-orange-400';
      case 'critical': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile': return <Smartphone className="w-5 h-5" />;
      case 'tablet': return <Smartphone className="w-5 h-5" />;
      case 'desktop': return <Monitor className="w-5 h-5" />;
      default: return <Globe className="w-5 h-5" />;
    }
  };

  const formatLastSeen = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading security data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Security Center</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account security and monitor activity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">
            <Shield className="w-4 h-4" />
            <span>Secure</span>
          </div>
        </div>
      </div>

      {/* Security Score */}
      {riskAssessment && (
        <div className={buildAdvancedComponent.glassCard({ variant: 'primary' })}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security Score</h3>
            <div className={`text-2xl font-bold ${getRiskColor(riskAssessment.riskLevel)}`}>
              {Math.round((1 - riskAssessment.riskScore) * 100)}/100
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Device Trust</span>
              <span className="font-medium">{Math.round(riskAssessment.factors.deviceTrust * 100)}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Location Trust</span>
              <span className="font-medium">{Math.round(riskAssessment.factors.locationTrust * 100)}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Behavior Trust</span>
              <span className="font-medium">{Math.round(riskAssessment.factors.behaviorTrust * 100)}%</span>
            </div>
          </div>

          {riskAssessment.recommendation !== 'allow' && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-300">
                <AlertTriangle className="w-4 h-4" />
                <span>Security recommendation: Enable additional MFA methods</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: <Activity className="w-4 h-4" /> },
          { id: 'devices', label: 'Devices', icon: <Monitor className="w-4 h-4" /> },
          { id: 'activity', label: 'Activity', icon: <Clock className="w-4 h-4" /> },
          { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* MFA Status */}
          <div className={buildAdvancedComponent.glassCard({ variant: 'secondary' })}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Multi-Factor Authentication</h3>
              {mfaStatus?.enabled ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
            </div>
            
            {mfaStatus?.enabled ? (
              <div className="space-y-3">
                {mfaStatus.methods.map((method, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {method.type === 'totp' && <QrCode className="w-4 h-4" />}
                      {method.type === 'sms' && <Smartphone className="w-4 h-4" />}
                      {method.type === 'passkey' && <Fingerprint className="w-4 h-4" />}
                      <span className="text-sm capitalize">{method.type}</span>
                      {method.primary && (
                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                          Primary
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {method.lastUsed ? formatLastSeen(method.lastUsed) : 'Never used'}
                    </div>
                  </div>
                ))}
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Backup codes: {mfaStatus.backupCodesCount} remaining
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <AlertTriangle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Two-factor authentication is not enabled
                </p>
                <button className={buildAdvancedComponent.glassButton({ size: 'sm' })}>
                  Enable MFA
                </button>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className={buildAdvancedComponent.glassCard({ variant: 'secondary' })}>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {securityEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    event.riskLevel === 'low' ? 'bg-green-500' :
                    event.riskLevel === 'medium' ? 'bg-yellow-500' :
                    event.riskLevel === 'high' ? 'bg-orange-500' : 'bg-red-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white truncate">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {formatLastSeen(event.timestamp)}
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View all activity
            </button>
          </div>
        </div>
      )}

      {activeTab === 'devices' && (
        <div className="space-y-4">
          {devices.map((device) => (
            <div key={device.id} className={buildAdvancedComponent.glassCard({ 
              variant: 'secondary',
              hover: true 
            })}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${
                    device.isTrusted ? 'bg-green-100 dark:bg-green-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'
                  }`}>
                    {getDeviceIcon(device.type)}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {device.name}
                      </h4>
                      {device.isCurrentDevice && (
                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                          Current
                        </span>
                      )}
                      {device.isTrusted && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>{device.os} • {device.browser}</span>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {device.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatLastSeen(device.lastSeen)}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-2">
                      {device.features.hasPasskey && (
                        <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                          <Fingerprint className="w-3 h-3" />
                          Passkey
                        </div>
                      )}
                      {device.features.hasBiometrics && (
                        <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                          <Shield className="w-3 h-3" />
                          Biometrics
                        </div>
                      )}
                      {device.features.hasSecureConnection && (
                        <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                          <Lock className="w-3 h-3" />
                          Secure
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`text-sm font-medium ${getRiskColor(
                    device.riskScore < 0.3 ? 'low' : device.riskScore < 0.6 ? 'medium' : 'high'
                  )}`}>
                    Risk: {Math.round(device.riskScore * 100)}%
                  </div>
                  {!device.isCurrentDevice && (
                    <button
                      onClick={() => handleRevokeDevice(device.id)}
                      disabled={actionLoading === device.id}
                      className="p-2 text-red-600 hover:text-red-700 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30"
                    >
                      {actionLoading === device.id ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="space-y-4">
          {securityEvents.map((event) => (
            <div key={event.id} className={buildAdvancedComponent.glassCard({ variant: 'secondary' })}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    event.riskLevel === 'low' ? 'bg-green-500' :
                    event.riskLevel === 'medium' ? 'bg-yellow-500' :
                    event.riskLevel === 'high' ? 'bg-orange-500' : 'bg-red-500'
                  }`} />
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {event.description}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(event.timestamp).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </div>
                      <span className={`capitalize ${getRiskColor(event.riskLevel)}`}>
                        {event.riskLevel} risk
                      </span>
                    </div>
                  </div>
                </div>
                
                {event.resolved ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Passkey Management */}
          <PasskeyManager />
          
          {/* Security Settings */}
          <div className={buildAdvancedComponent.glassCard({ variant: 'secondary' })}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Security Settings
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Login Notifications
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get notified of new logins from unrecognized devices
                  </p>
                </div>
                <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-blue-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
                  <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Session Timeout
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Automatically sign out after 30 days of inactivity
                  </p>
                </div>
                <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-blue-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
                  <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Risk-Based Authentication
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Require additional verification for suspicious activity
                  </p>
                </div>
                <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-blue-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
                  <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Export Security Data */}
          <div className={buildAdvancedComponent.glassCard({ variant: 'secondary' })}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Security Data
            </h3>
            
            <div className="flex gap-4">
              <button className={buildAdvancedComponent.glassButton({ size: 'sm' })}>
                <Download className="w-4 h-4" />
                Export Activity Log
              </button>
              <button className={buildAdvancedComponent.glassButton({ size: 'sm' })}>
                <RefreshCw className="w-4 h-4" />
                Refresh Security Score
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityDashboard; 