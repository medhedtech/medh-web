"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  Plus,
  Video,
  Users,
  CalendarDays,
  Repeat,
  Settings,
  BarChart3,
  FileText
} from 'lucide-react';

const InstructorSchedule: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Schedule Management
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Manage your class schedules and sessions
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex items-center gap-4">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">
                <Plus className="h-4 w-4 mr-2" />
                Create Schedule
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Week</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">12</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Classes scheduled</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">3</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Classes today</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <Clock className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Live Now</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">1</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Active session</p>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
                <Video className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Students</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">156</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total enrolled</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/dashboards/instructor/schedule/calendar"
            className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                Calendar View
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              View all your scheduled classes in calendar format
            </p>
          </Link>

          <Link
            href="/dashboards/instructor/schedule/create"
            className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <Plus className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                Create Schedule
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Schedule new classes and sessions
            </p>
          </Link>

          <Link
            href="/dashboards/instructor/schedule/recurring"
            className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                <Repeat className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                Recurring Classes
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Manage recurring class schedules
            </p>
          </Link>

          <Link
            href="/dashboards/instructor/schedule/templates"
            className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                <FileText className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                Schedule Templates
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Create and use schedule templates
            </p>
          </Link>

          <Link
            href="/dashboards/instructor/class-schedules"
            className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                <CalendarDays className="h-6 w-6 text-indigo-500" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                Manage Schedules
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Edit and manage existing class schedules
            </p>
          </Link>

          <div className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <BarChart3 className="h-6 w-6 text-gray-500" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                Schedule Analytics
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              View attendance and engagement metrics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorSchedule; 