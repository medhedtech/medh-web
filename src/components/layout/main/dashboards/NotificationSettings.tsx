"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Bell, 
  Mail, 
  Smartphone, 
  Globe, 
  Users, 
  Clock,
  Save,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface INotificationSettings {
  emailNotifications: {
    enabled: boolean;
    announcements: boolean;
    systemUpdates: boolean;
    maintenanceAlerts: boolean;
    userActivities: boolean;
    digestFrequency: 'immediate' | 'daily' | 'weekly';
  };
  pushNotifications: {
    enabled: boolean;
    announcements: boolean;
    urgentAlerts: boolean;
    systemStatus: boolean;
  };
  smsNotifications: {
    enabled: boolean;
    urgentOnly: boolean;
    maintenanceAlerts: boolean;
  };
  platformSettings: {
    defaultAnnouncementDuration: number;
    maxAnnouncementsPerUser: number;
    autoArchiveAfterDays: number;
    requireApproval: boolean;
    allowUserUnsubscribe: boolean;
  };
  audienceDefaults: {
    students: { email: boolean; push: boolean; sms: boolean };
    instructors: { email: boolean; push: boolean; sms: boolean };
    admins: { email: boolean; push: boolean; sms: boolean };
    parents: { email: boolean; push: boolean; sms: boolean };
  };
}

const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState<INotificationSettings>({
    emailNotifications: {
      enabled: true,
      announcements: true,
      systemUpdates: true,
      maintenanceAlerts: true,
      userActivities: false,
      digestFrequency: 'daily'
    },
    pushNotifications: {
      enabled: true,
      announcements: true,
      urgentAlerts: true,
      systemStatus: true
    },
    smsNotifications: {
      enabled: false,
      urgentOnly: true,
      maintenanceAlerts: false
    },
    platformSettings: {
      defaultAnnouncementDuration: 30,
      maxAnnouncementsPerUser: 10,
      autoArchiveAfterDays: 90,
      requireApproval: false,
      allowUserUnsubscribe: true
    },
    audienceDefaults: {
      students: { email: true, push: true, sms: false },
      instructors: { email: true, push: true, sms: false },
      admins: { email: true, push: true, sms: true },
      parents: { email: true, push: false, sms: false }
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  // Handle setting changes
  const handleSettingChange = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof INotificationSettings],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  // Handle audience default changes
  const handleAudienceChange = (audience: string, type: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      audienceDefaults: {
        ...prev.audienceDefaults,
        [audience]: {
          ...prev.audienceDefaults[audience as keyof typeof prev.audienceDefaults],
          [type]: value
        }
      }
    }));
    setHasChanges(true);
  };

  // Save settings
  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Notification settings saved successfully!');
      setHasChanges(false);
    } catch (err) {
      console.error('Error saving settings:', err);
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to defaults
  const handleReset = () => {
    if (confirm('Reset all settings to defaults?')) {
      setSettings({
        emailNotifications: {
          enabled: true,
          announcements: true,
          systemUpdates: true,
          maintenanceAlerts: true,
          userActivities: false,
          digestFrequency: 'daily'
        },
        pushNotifications: {
          enabled: true,
          announcements: true,
          urgentAlerts: true,
          systemStatus: true
        },
        smsNotifications: {
          enabled: false,
          urgentOnly: true,
          maintenanceAlerts: false
        },
        platformSettings: {
          defaultAnnouncementDuration: 30,
          maxAnnouncementsPerUser: 10,
          autoArchiveAfterDays: 90,
          requireApproval: false,
          allowUserUnsubscribe: true
        },
        audienceDefaults: {
          students: { email: true, push: true, sms: false },
          instructors: { email: true, push: true, sms: false },
          admins: { email: true, push: true, sms: true },
          parents: { email: true, push: false, sms: false }
        }
      });
      setHasChanges(true);
      toast.info('Settings reset to defaults');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Notification Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Configure platform-wide notification preferences and delivery settings
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Reset to Defaults
          </button>
          
          <button
            onClick={handleSave}
            disabled={!hasChanges || isLoading}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Status Bar */}
      {hasChanges && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
              You have unsaved changes. Don't forget to save your settings.
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Email Notifications
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Configure email delivery settings
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Enable Email Notifications
              </span>
              <input
                type="checkbox"
                checked={settings.emailNotifications.enabled}
                onChange={(e) => handleSettingChange('emailNotifications', 'enabled', e.target.checked)}
                className="w-4 h-4 text-primary-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 focus:ring-2"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                New Announcements
              </span>
              <input
                type="checkbox"
                checked={settings.emailNotifications.announcements}
                onChange={(e) => handleSettingChange('emailNotifications', 'announcements', e.target.checked)}
                disabled={!settings.emailNotifications.enabled}
                className="w-4 h-4 text-primary-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 focus:ring-2 disabled:opacity-50"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                System Updates
              </span>
              <input
                type="checkbox"
                checked={settings.emailNotifications.systemUpdates}
                onChange={(e) => handleSettingChange('emailNotifications', 'systemUpdates', e.target.checked)}
                disabled={!settings.emailNotifications.enabled}
                className="w-4 h-4 text-primary-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 focus:ring-2 disabled:opacity-50"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Maintenance Alerts
              </span>
              <input
                type="checkbox"
                checked={settings.emailNotifications.maintenanceAlerts}
                onChange={(e) => handleSettingChange('emailNotifications', 'maintenanceAlerts', e.target.checked)}
                disabled={!settings.emailNotifications.enabled}
                className="w-4 h-4 text-primary-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 focus:ring-2 disabled:opacity-50"
              />
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Digest Frequency
              </label>
              <select
                value={settings.emailNotifications.digestFrequency}
                onChange={(e) => handleSettingChange('emailNotifications', 'digestFrequency', e.target.value)}
                disabled={!settings.emailNotifications.enabled}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
              >
                <option value="immediate">Immediate</option>
                <option value="daily">Daily Digest</option>
                <option value="weekly">Weekly Digest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Push Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Smartphone className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Push Notifications
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Configure push notification delivery
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Enable Push Notifications
              </span>
              <input
                type="checkbox"
                checked={settings.pushNotifications.enabled}
                onChange={(e) => handleSettingChange('pushNotifications', 'enabled', e.target.checked)}
                className="w-4 h-4 text-primary-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 focus:ring-2"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                New Announcements
              </span>
              <input
                type="checkbox"
                checked={settings.pushNotifications.announcements}
                onChange={(e) => handleSettingChange('pushNotifications', 'announcements', e.target.checked)}
                disabled={!settings.pushNotifications.enabled}
                className="w-4 h-4 text-primary-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 focus:ring-2 disabled:opacity-50"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Urgent Alerts
              </span>
              <input
                type="checkbox"
                checked={settings.pushNotifications.urgentAlerts}
                onChange={(e) => handleSettingChange('pushNotifications', 'urgentAlerts', e.target.checked)}
                disabled={!settings.pushNotifications.enabled}
                className="w-4 h-4 text-primary-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 focus:ring-2 disabled:opacity-50"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                System Status
              </span>
              <input
                type="checkbox"
                checked={settings.pushNotifications.systemStatus}
                onChange={(e) => handleSettingChange('pushNotifications', 'systemStatus', e.target.checked)}
                disabled={!settings.pushNotifications.enabled}
                className="w-4 h-4 text-primary-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 focus:ring-2 disabled:opacity-50"
              />
            </label>
          </div>
        </div>

        {/* Platform Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Platform Settings
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Global announcement settings
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Announcement Duration (days)
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={settings.platformSettings.defaultAnnouncementDuration}
                onChange={(e) => handleSettingChange('platformSettings', 'defaultAnnouncementDuration', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Announcements Per User
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={settings.platformSettings.maxAnnouncementsPerUser}
                onChange={(e) => handleSettingChange('platformSettings', 'maxAnnouncementsPerUser', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Auto Archive After (days)
              </label>
              <input
                type="number"
                min="30"
                max="365"
                value={settings.platformSettings.autoArchiveAfterDays}
                onChange={(e) => handleSettingChange('platformSettings', 'autoArchiveAfterDays', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Require Admin Approval
              </span>
              <input
                type="checkbox"
                checked={settings.platformSettings.requireApproval}
                onChange={(e) => handleSettingChange('platformSettings', 'requireApproval', e.target.checked)}
                className="w-4 h-4 text-primary-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 focus:ring-2"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Allow User Unsubscribe
              </span>
              <input
                type="checkbox"
                checked={settings.platformSettings.allowUserUnsubscribe}
                onChange={(e) => handleSettingChange('platformSettings', 'allowUserUnsubscribe', e.target.checked)}
                className="w-4 h-4 text-primary-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 focus:ring-2"
              />
            </label>
          </div>
        </div>

        {/* Audience Defaults */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
              <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Audience Defaults
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Default notification preferences by role
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(settings.audienceDefaults).map(([audience, preferences]) => (
              <div key={audience} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 capitalize">
                  {audience}
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={preferences.email}
                      onChange={(e) => handleAudienceChange(audience, 'email', e.target.checked)}
                      className="w-4 h-4 text-primary-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 focus:ring-2"
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Email</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={preferences.push}
                      onChange={(e) => handleAudienceChange(audience, 'push', e.target.checked)}
                      className="w-4 h-4 text-primary-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 focus:ring-2"
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Push</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={preferences.sms}
                      onChange={(e) => handleAudienceChange(audience, 'sms', e.target.checked)}
                      className="w-4 h-4 text-primary-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 focus:ring-2"
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400">SMS</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button (Sticky Bottom) */}
      {hasChanges && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg shadow-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5 mr-2" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default NotificationSettings; 