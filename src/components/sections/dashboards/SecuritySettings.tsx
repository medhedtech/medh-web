'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Lock,
  Clock,
  AlertTriangle,
  Save,
  RefreshCw,
  Settings,
  Key,
  Users,
  Activity,
  Bell,
  Mail,
  Smartphone,
  Globe,
  Database,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { showToast } from '@/utils/toastManager';

interface SecurityConfig {
  lockout_thresholds: {
    level_1: { attempts: number; duration: number; };
    level_2: { attempts: number; duration: number; };
    level_3: { attempts: number; duration: number; };
    level_4: { attempts: number; duration: number; };
  };
  password_policy: {
    min_length: number;
    require_uppercase: boolean;
    require_lowercase: boolean;
    require_numbers: boolean;
    require_special_chars: boolean;
    prevent_common_passwords: boolean;
    password_history_count: number;
    max_age_days: number;
  };
  session_management: {
    max_concurrent_sessions: number;
    session_timeout_minutes: number;
    remember_me_duration_days: number;
    require_fresh_login_for_sensitive: boolean;
  };
  notifications: {
    email_on_lockout: boolean;
    email_on_unlock: boolean;
    sms_on_lockout: boolean;
    admin_notifications: boolean;
    notification_threshold: number;
  };
  advanced_security: {
    enable_rate_limiting: boolean;
    max_requests_per_minute: number;
    enable_ip_blocking: boolean;
    enable_geolocation_checks: boolean;
    enable_device_fingerprinting: boolean;
    enable_2fa_enforcement: boolean;
  };
  audit_logging: {
    log_all_auth_attempts: boolean;
    log_password_changes: boolean;
    log_admin_actions: boolean;
    retention_days: number;
    enable_real_time_monitoring: boolean;
  };
}

const SecuritySettings: React.FC = () => {
  const [config, setConfig] = useState<SecurityConfig>({
    lockout_thresholds: {
      level_1: { attempts: 3, duration: 1 },
      level_2: { attempts: 4, duration: 5 },
      level_3: { attempts: 5, duration: 10 },
      level_4: { attempts: 6, duration: 30 }
    },
    password_policy: {
      min_length: 8,
      require_uppercase: true,
      require_lowercase: true,
      require_numbers: true,
      require_special_chars: true,
      prevent_common_passwords: true,
      password_history_count: 5,
      max_age_days: 90
    },
    session_management: {
      max_concurrent_sessions: 3,
      session_timeout_minutes: 30,
      remember_me_duration_days: 30,
      require_fresh_login_for_sensitive: true
    },
    notifications: {
      email_on_lockout: true,
      email_on_unlock: true,
      sms_on_lockout: false,
      admin_notifications: true,
      notification_threshold: 5
    },
    advanced_security: {
      enable_rate_limiting: true,
      max_requests_per_minute: 60,
      enable_ip_blocking: true,
      enable_geolocation_checks: false,
      enable_device_fingerprinting: true,
      enable_2fa_enforcement: false
    },
    audit_logging: {
      log_all_auth_attempts: true,
      log_password_changes: true,
      log_admin_actions: true,
      retention_days: 365,
      enable_real_time_monitoring: true
    }
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<'lockout' | 'password' | 'session' | 'notifications' | 'advanced' | 'audit'>('lockout');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleConfigChange = (section: keyof SecurityConfig, key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleNestedConfigChange = (section: keyof SecurityConfig, parentKey: string, childKey: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parentKey]: {
          ...(prev[section] as any)[parentKey],
          [childKey]: value
        }
      }
    }));
    setHasUnsavedChanges(true);
  };

  const saveConfiguration = async () => {
    try {
      setSaving(true);
      
      // Mock API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would typically make an API call to save the configuration
      // const response = await fetch('/api/admin/security-config', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(config)
      // });
      
      showToast.success('Security configuration saved successfully');
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving configuration:', error);
      showToast.error('Failed to save security configuration');
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset all settings to default values? This action cannot be undone.')) {
      // Reset to default configuration
      setConfig({
        lockout_thresholds: {
          level_1: { attempts: 3, duration: 1 },
          level_2: { attempts: 4, duration: 5 },
          level_3: { attempts: 5, duration: 10 },
          level_4: { attempts: 6, duration: 30 }
        },
        password_policy: {
          min_length: 8,
          require_uppercase: true,
          require_lowercase: true,
          require_numbers: true,
          require_special_chars: true,
          prevent_common_passwords: true,
          password_history_count: 5,
          max_age_days: 90
        },
        session_management: {
          max_concurrent_sessions: 3,
          session_timeout_minutes: 30,
          remember_me_duration_days: 30,
          require_fresh_login_for_sensitive: true
        },
        notifications: {
          email_on_lockout: true,
          email_on_unlock: true,
          sms_on_lockout: false,
          admin_notifications: true,
          notification_threshold: 5
        },
        advanced_security: {
          enable_rate_limiting: true,
          max_requests_per_minute: 60,
          enable_ip_blocking: true,
          enable_geolocation_checks: false,
          enable_device_fingerprinting: true,
          enable_2fa_enforcement: false
        },
        audit_logging: {
          log_all_auth_attempts: true,
          log_password_changes: true,
          log_admin_actions: true,
          retention_days: 365,
          enable_real_time_monitoring: true
        }
      });
      setHasUnsavedChanges(true);
      showToast.info('Configuration reset to default values');
    }
  };

  const sections = [
    { key: 'lockout', label: 'Lockout Thresholds', icon: Lock },
    { key: 'password', label: 'Password Policy', icon: Key },
    { key: 'session', label: 'Session Management', icon: Users },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'advanced', label: 'Advanced Security', icon: Shield },
    { key: 'audit', label: 'Audit & Logging', icon: Activity }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Security Configuration
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Configure system-wide security policies and lockout parameters
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={resetToDefaults}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset to Defaults</span>
            </button>
            
            <button
              onClick={saveConfiguration}
              disabled={!hasUnsavedChanges || saving}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
        
        {hasUnsavedChanges && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm text-yellow-800 dark:text-yellow-200">
                You have unsaved changes. Don't forget to save your configuration.
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Settings Categories</h3>
            </div>
            <nav className="space-y-1 p-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.key}
                    onClick={() => setActiveSection(section.key as any)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeSection === section.key
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            {/* Lockout Thresholds */}
            {activeSection === 'lockout' && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Progressive Lockout Thresholds
                </h3>
                
                <div className="space-y-6">
                  {Object.entries(config.lockout_thresholds).map(([level, settings], index) => (
                    <motion.div
                      key={level}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-md font-medium text-gray-900 dark:text-white">
                          Level {index + 1}
                        </h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          index === 0 ? 'bg-green-100 text-green-800' :
                          index === 1 ? 'bg-yellow-100 text-yellow-800' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {index === 0 ? 'Low' : index === 1 ? 'Medium' : index === 2 ? 'High' : 'Critical'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Failed Attempts Trigger
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={settings.attempts}
                            onChange={(e) => handleNestedConfigChange('lockout_thresholds', level, 'attempts', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Lockout Duration (minutes)
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="1440"
                            value={settings.duration}
                            onChange={(e) => handleNestedConfigChange('lockout_thresholds', level, 'duration', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Password Policy */}
            {activeSection === 'password' && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Password Security Policy
                </h3>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Minimum Password Length
                      </label>
                      <input
                        type="number"
                        min="6"
                        max="128"
                        value={config.password_policy.min_length}
                        onChange={(e) => handleConfigChange('password_policy', 'min_length', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Password History Count
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="24"
                        value={config.password_policy.password_history_count}
                        onChange={(e) => handleConfigChange('password_policy', 'password_history_count', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">
                      Password Requirements
                    </h4>
                    
                    {[
                      { key: 'require_uppercase', label: 'Require uppercase letters (A-Z)' },
                      { key: 'require_lowercase', label: 'Require lowercase letters (a-z)' },
                      { key: 'require_numbers', label: 'Require numbers (0-9)' },
                      { key: 'require_special_chars', label: 'Require special characters (!@#$%^&*)' },
                      { key: 'prevent_common_passwords', label: 'Prevent common/weak passwords' }
                    ].map((requirement) => (
                      <div key={requirement.key} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {requirement.label}
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(config.password_policy as any)[requirement.key]}
                            onChange={(e) => handleConfigChange('password_policy', requirement.key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Session Management */}
            {activeSection === 'session' && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Session Management Settings
                </h3>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Max Concurrent Sessions
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={config.session_management.max_concurrent_sessions}
                        onChange={(e) => handleConfigChange('session_management', 'max_concurrent_sessions', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="480"
                        value={config.session_management.session_timeout_minutes}
                        onChange={(e) => handleConfigChange('session_management', 'session_timeout_minutes', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Require Fresh Login for Sensitive Operations
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Force re-authentication for password changes, account settings, etc.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.session_management.require_fresh_login_for_sensitive}
                        onChange={(e) => handleConfigChange('session_management', 'require_fresh_login_for_sensitive', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Other sections would be implemented similarly */}
            {activeSection === 'notifications' && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Notification Settings
                </h3>
                <div className="space-y-4">
                  {[
                    { key: 'email_on_lockout', label: 'Email notifications on account lockout', icon: Mail },
                    { key: 'email_on_unlock', label: 'Email notifications on account unlock', icon: Mail },
                    { key: 'sms_on_lockout', label: 'SMS notifications on account lockout', icon: Smartphone },
                    { key: 'admin_notifications', label: 'Admin notifications for security events', icon: Shield }
                  ].map((setting) => {
                    const Icon = setting.icon;
                    return (
                      <div key={setting.key} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {setting.label}
                          </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(config.notifications as any)[setting.key]}
                            onChange={(e) => handleConfigChange('notifications', setting.key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeSection === 'advanced' && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Advanced Security Features
                </h3>
                <div className="space-y-4">
                  {[
                    { key: 'enable_rate_limiting', label: 'Enable API rate limiting', description: 'Limit the number of requests per minute' },
                    { key: 'enable_ip_blocking', label: 'Enable IP-based blocking', description: 'Block suspicious IP addresses automatically' },
                    { key: 'enable_geolocation_checks', label: 'Enable geolocation verification', description: 'Alert on logins from unusual locations' },
                    { key: 'enable_device_fingerprinting', label: 'Enable device fingerprinting', description: 'Track and verify device characteristics' },
                    { key: 'enable_2fa_enforcement', label: 'Enforce 2FA for all users', description: 'Require two-factor authentication for all accounts' }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {setting.label}
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {setting.description}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(config.advanced_security as any)[setting.key]}
                          onChange={(e) => handleConfigChange('advanced_security', setting.key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'audit' && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Audit & Logging Configuration
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Log Retention Period (days)
                    </label>
                    <input
                      type="number"
                      min="30"
                      max="2555"
                      value={config.audit_logging.retention_days}
                      onChange={(e) => handleConfigChange('audit_logging', 'retention_days', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { key: 'log_all_auth_attempts', label: 'Log all authentication attempts', description: 'Record successful and failed login attempts' },
                      { key: 'log_password_changes', label: 'Log password changes', description: 'Record all password modification events' },
                      { key: 'log_admin_actions', label: 'Log administrative actions', description: 'Record all admin panel activities' },
                      { key: 'enable_real_time_monitoring', label: 'Enable real-time monitoring', description: 'Monitor security events in real-time' }
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {setting.label}
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {setting.description}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(config.audit_logging as any)[setting.key]}
                            onChange={(e) => handleConfigChange('audit_logging', setting.key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings; 