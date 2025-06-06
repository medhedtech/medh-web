"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
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

interface CourseMetric {
  courseName: string;
  totalStudents: number;
  completionRate: number;
  avgRating: number;
  totalViews: number;
  activeStudents: number;
  revenue?: number;
}

interface EngagementData {
  date: string;
  views: number;
  completions: number;
  discussions: number;
}

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');

  // Mock data for course metrics
  const courseMetrics: CourseMetric[] = [
    {
      courseName: 'Quantum Computing Fundamentals',
      totalStudents: 142,
      completionRate: 68,
      avgRating: 4.8,
      totalViews: 2840,
      activeStudents: 89,
      revenue: 8520
    },
    {
      courseName: 'Advanced Physics',
      totalStudents: 86,
      completionRate: 72,
      avgRating: 4.6,
      totalViews: 1720,
      activeStudents: 52,
      revenue: 5160
    },
    {
      courseName: 'Mathematics Review',
      totalStudents: 203,
      completionRate: 85,
      avgRating: 4.9,
      totalViews: 4060,
      activeStudents: 145,
      revenue: 0 // Free course
    }
  ];

  // Mock engagement data
  const engagementData: EngagementData[] = [
    { date: '2025-05-27', views: 245, completions: 12, discussions: 34 },
    { date: '2025-05-28', views: 289, completions: 18, discussions: 41 },
    { date: '2025-05-29', views: 312, completions: 15, discussions: 28 },
    { date: '2025-05-30', views: 278, completions: 22, discussions: 37 },
    { date: '2025-05-31', views: 356, completions: 25, discussions: 45 },
    { date: '2025-06-01', views: 401, completions: 28, discussions: 52 },
    { date: '2025-06-02', views: 367, completions: 19, discussions: 38 }
  ];

  const totalStudents = courseMetrics.reduce((sum, course) => sum + course.totalStudents, 0);
  const avgCompletionRate = Math.round(courseMetrics.reduce((sum, course) => sum + course.completionRate, 0) / courseMetrics.length);
  const totalRevenue = courseMetrics.reduce((sum, course) => sum + (course.revenue || 0), 0);
  const totalViews = courseMetrics.reduce((sum, course) => sum + course.totalViews, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboards/instructor" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
          
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
              {/* Time Period Filter */}
              <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                {(['7d', '30d', '90d', '1y'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      selectedPeriod === period 
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    {period === '7d' ? '7 Days' : period === '30d' ? '30 Days' : period === '90d' ? '90 Days' : '1 Year'}
                  </button>
                ))}
              </div>

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
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalStudents}</p>
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
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{avgCompletionRate}%</p>
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
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalRevenue)}</p>
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
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalViews.toLocaleString()}</p>
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

        {/* Engagement Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Student Engagement</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Views</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Completions</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Discussions</span>
              </div>
            </div>
          </div>
          
          {/* Simple Bar Chart Representation */}
          <div className="space-y-4">
            {engagementData.map((data, index) => (
              <div key={data.date} className="flex items-center">
                <div className="w-16 text-sm text-gray-600 dark:text-gray-400">
                  {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="flex-1 flex items-center gap-2 ml-4">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(data.views / 500) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-blue-600 dark:text-blue-400 w-12">{data.views}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Performance Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Course Performance</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Completion Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {courseMetrics.map((course, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg mr-3">
                          <BookOpen className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            {course.courseName}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {course.activeStudents} active students
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {course.totalStudents}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900 dark:text-white mr-2">
                          {course.completionRate}%
                        </div>
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${course.completionRate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900 dark:text-white mr-1">
                          {course.avgRating}
                        </div>
                        <div className="text-yellow-400">★</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {course.totalViews.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {course.revenue ? formatCurrency(course.revenue) : 'Free'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/dashboards/instructor/analytics/detailed"
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
} 