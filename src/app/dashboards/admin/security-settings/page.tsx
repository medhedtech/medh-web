import React from 'react';
import { Metadata } from 'next';
import SecuritySettings from '@/components/sections/dashboards/SecuritySettings';

export const metadata: Metadata = {
  title: 'Security Settings | Admin Dashboard',
  description: 'Configure account lockout parameters, security policies, and system-wide security settings.',
};

export default function SecuritySettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            🔐 Security Settings & Configuration
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Configure lockout thresholds, security policies, and system-wide protection settings
          </p>
        </div>
        
        <SecuritySettings />
      </div>
    </div>
  );
} 