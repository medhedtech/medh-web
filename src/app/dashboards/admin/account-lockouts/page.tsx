import React from 'react';
import { Metadata } from 'next';
import AccountLockoutManagement from '@/components/sections/dashboards/AccountLockoutManagement';

export const metadata: Metadata = {
  title: 'Account Lockout Management | Admin Dashboard',
  description: 'Manage locked user accounts, view security statistics, and handle account unlock operations.',
};

export default function AccountLockoutsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            🔒 Account Lockout Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Monitor and manage locked user accounts with comprehensive security controls
          </p>
        </div>
        
        <AccountLockoutManagement />
      </div>
    </div>
  );
} 