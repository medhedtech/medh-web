"use client";

import React from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Eye,
  Clock,
  Trophy,
  BookOpen,
  MessageSquare,
  Download,
  Filter,
  Calendar,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const InstructorAnalytics: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Track your course performance and student engagement
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex items-center gap-4">
              {/* Export Button */}
              <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm font-medium">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">431</p>
                <div className="flex items-center mt-2">
                  <ArrowUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400 ml-1">+12% from last month</span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Completion Rate</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">75%</p>
                <div className="flex items-center mt-2">
                  <ArrowUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400 ml-1">+5% from last month</span>
                </div>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <Trophy className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">$13,680</p>
                <div className="flex items-center mt-2">
                  <ArrowUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400 ml-1">+18% from last month</span>
                </div>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">8,620</p>
                <div className="flex items-center mt-2">
                  <ArrowUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400 ml-1">+25% from last month</span>
                </div>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                <Eye className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/dashboards/instructor/analytics"
            className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                Detailed Analytics
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Deep dive into course metrics and student behavior
            </p>
          </Link>

          <Link
            href="/dashboards/instructor/analytics/reports"
            className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <Download className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                Generate Reports
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Create custom reports for specific time periods
            </p>
          </Link>

          <Link
            href="/dashboards/instructor/analytics/insights"
            className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                AI Insights
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Get AI-powered recommendations to improve engagement
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InstructorAnalytics; 