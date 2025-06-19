import React from 'react';
import { Metadata } from 'next';
import LockoutStatistics from '@/components/sections/dashboards/LockoutStatistics';

export const metadata: Metadata = {
  title: 'Lockout Statistics | Admin Dashboard',
  description: 'View comprehensive analytics and statistics for account lockout patterns and security metrics.',
};

export default function LockoutStatsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            📊 Lockout Statistics & Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Comprehensive insights into account security patterns and lockout trends
          </p>
        </div>
        
        <LockoutStatistics />
      </div>
    </div>
  );
} 