"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Settings, 
  User, 
  Bell,
  Shield,
  Palette,
  Globe,
  Key,
  Download,
  Trash2,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

const InstructorSettings: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Settings
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Manage your account preferences and configurations
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex items-center gap-4">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Settings */}
          <Link
            href="/dashboards/instructor/profile"
            className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <User className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                Profile Settings
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Update your personal information and instructor profile
            </p>
          </Link>

          {/* Notification Settings */}
          <div className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <Bell className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                Notifications
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Configure how you receive notifications
            </p>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Email notifications</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Student messages</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Course updates</span>
              </label>
            </div>
          </div>

          {/* Security Settings */}
          <div className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
                <Shield className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                Security
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Manage your account security settings
            </p>
            <div className="space-y-3">
              <button className="flex items-center text-sm text-blue-600 hover:text-blue-700">
                <Key className="h-4 w-4 mr-2" />
                Change Password
              </button>
              <button className="flex items-center text-sm text-blue-600 hover:text-blue-700">
                <Eye className="h-4 w-4 mr-2" />
                Two-Factor Authentication
              </button>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                <Palette className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                Appearance
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Customize your dashboard appearance
            </p>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="radio" name="theme" className="border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Light theme</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="theme" className="border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Dark theme</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="theme" className="border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">System default</span>
              </label>
            </div>
          </div>

          {/* Language Settings */}
          <div className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                <Globe className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                Language & Region
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Set your preferred language and region
            </p>
            <div className="space-y-3">
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                <option>English (US)</option>
                <option>English (UK)</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
          </div>

          {/* Data Management */}
          <div className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Download className="h-6 w-6 text-gray-500" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                Data Management
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Export or delete your account data
            </p>
            <div className="space-y-3">
              <button className="flex items-center text-sm text-blue-600 hover:text-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </button>
              <button className="flex items-center text-sm text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorSettings; 