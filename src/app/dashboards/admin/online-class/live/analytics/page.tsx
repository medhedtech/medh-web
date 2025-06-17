"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  BarChart3, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Calendar,
  Clock,
  DollarSign,
  Target,
  Award,
  Activity,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { showToast } from '@/utils/toastManager';
import { motion } from 'framer-motion';
import BatchAnalytics from '@/components/Dashboard/admin/BatchAnalytics';

interface IAnalyticsFilter {
  courseId?: string;
  instructorId?: string;
  timeRange: '7d' | '30d' | '90d' | '1y';
  dateFrom?: string;
  dateTo?: string;
}

interface ICourse {
  _id: string;
  course_title: string;
  course_category: string;
}

interface IInstructor {
  _id: string;
  full_name: string;
  email: string;
}

const AnalyticsPage: React.FC = () => {
  // State Management
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [instructors, setInstructors] = useState<IInstructor[]>([]);
  const [filters, setFilters] = useState<IAnalyticsFilter>({
    timeRange: '30d'
  });

  // Mock data
  const mockCourses: ICourse[] = [
    { _id: '1', course_title: 'AI and Data Science Fundamentals', course_category: 'Technology' },
    { _id: '2', course_title: 'Digital Marketing with Analytics', course_category: 'Marketing' },
    { _id: '3', course_title: 'Vedic Mathematics', course_category: 'Education' },
    { _id: '4', course_title: 'Personality Development', course_category: 'Personal Growth' }
  ];

  const mockInstructors: IInstructor[] = [
    { _id: '1', full_name: 'Dr. Sarah Johnson', email: 'sarah.johnson@medh.com' },
    { _id: '2', full_name: 'Prof. Michael Chen', email: 'michael.chen@medh.com' },
    { _id: '3', full_name: 'Dr. Priya Sharma', email: 'priya.sharma@medh.com' },
    { _id: '4', full_name: 'Mr. Alex Rodriguez', email: 'alex.rodriguez@medh.com' }
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      // In a real app, these would be actual API calls
      setCourses(mockCourses);
      setInstructors(mockInstructors);
    } catch (error) {
      console.error('Error loading initial data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof IAnalyticsFilter, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleExportData = () => {
    toast.info('Export functionality would be implemented here');
  };

  const handleRefreshData = () => {
    loadInitialData();
    showToast.success('Data refreshed successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/dashboards/admin/online-class/live"
                className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Categories
              </Link>
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Batch Analytics Dashboard
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefreshData}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={handleExportData}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Analytics Filters
            </h2>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Customize your analytics view
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Course Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Course
              </label>
              <select
                value={filters.courseId || ''}
                onChange={(e) => handleFilterChange('courseId', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Courses</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.course_title}
                  </option>
                ))}
              </select>
            </div>

            {/* Instructor Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Instructor
              </label>
              <select
                value={filters.instructorId || ''}
                onChange={(e) => handleFilterChange('instructorId', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Instructors</option>
                {instructors.map((instructor) => (
                  <option key={instructor._id} value={instructor._id}>
                    {instructor.full_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time Range
              </label>
              <select
                value={filters.timeRange}
                onChange={(e) => handleFilterChange('timeRange', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ timeRange: '30d' })}
                className="w-full px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Batches
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  {filters.courseId ? '8' : '24'}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  ↑ 12% from last period
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Students
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  {filters.courseId ? '145' : '432'}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  ↑ 8% from last period
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Avg. Utilization
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  82.5%
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  ↑ 4% from last period
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Completion Rate
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  91.2%
                </p>
                <p className="text-xs text-green-600 mt-1">
                  ↑ 6% from last period
                </p>
              </div>
              <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Analytics Component */}
        <BatchAnalytics 
          courseId={filters.courseId}
          instructorId={filters.instructorId}
        />

        {/* Additional Insights */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Trends */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Performance Trends
              </h3>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Enrollment Growth</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Monthly increase in student enrollments</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">+18.5%</p>
                  <p className="text-sm text-gray-500">vs last month</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Batch Efficiency</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Average capacity utilization improvement</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">+7.2%</p>
                  <p className="text-sm text-gray-500">vs last month</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Student Satisfaction</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Average rating from student feedback</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-purple-600">4.7/5</p>
                  <p className="text-sm text-gray-500">+0.3 rating</p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performing Batches */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Top Performing Batches
              </h3>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {[
                { name: 'AI Fundamentals - Morning', completion: 96, students: 25 },
                { name: 'Digital Marketing - Evening', completion: 94, students: 22 },
                { name: 'Vedic Math - Weekend', completion: 92, students: 18 },
                { name: 'Personality Dev - Morning', completion: 89, students: 20 }
              ].map((batch, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{batch.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{batch.students} students</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">{batch.completion}%</p>
                    <p className="text-sm text-gray-500">completion</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage; 