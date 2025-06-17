"use client";
import React from 'react';
import { Bell, BookOpen, TrendingUp } from 'lucide-react';
import RecentAnnouncements from '@/components/shared/dashboards/RecentAnnouncements';

const InstructorAnnouncements: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Instructor Announcements
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Stay updated with important announcements and notifications
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Unread Announcements
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                3
              </p>
            </div>
            <div className="p-3 rounded-lg bg-red-500">
              <Bell className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Course Announcements
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                8
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                System Updates
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                5
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-500">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Announcements */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <RecentAnnouncements
          limit={10}
          userRole="instructor"
          targetAudience="instructors"
          enableMarkAsRead={true}
          showUnreadOnly={false}
          showViewAll={true}
        />
      </div>
    </div>
  );
};

export default InstructorAnnouncements; 