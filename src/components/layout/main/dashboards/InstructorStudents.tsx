"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  UserPlus, 
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  TrendingUp,
  Award
} from 'lucide-react';

const InstructorStudents: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Student Management
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Manage and track your students' progress
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex items-center gap-4">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Student
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">284</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Students</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">247</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Courses</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">89</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                <Award className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/dashboards/instructor/student-lists"
            className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                Student Lists
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              View and manage all enrolled students
            </p>
          </Link>

          <Link
            href="/dashboards/instructor/student-progress"
            className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                Student Progress
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Track individual student performance and progress
            </p>
          </Link>

          <Link
            href="/dashboards/instructor/student-communication"
            className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                <Mail className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                Communication
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Send messages and announcements to students
            </p>
          </Link>

          <Link
            href="/dashboards/instructor/mark-attendance"
            className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                Mark Attendance
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Record attendance for live classes and sessions
            </p>
          </Link>

          <Link
            href="/dashboards/instructor/grading"
            className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
                <BookOpen className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                Grading
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Grade assignments and provide feedback
            </p>
          </Link>

          <div className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Award className="h-6 w-6 text-gray-500" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                Certificates
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Generate and manage course completion certificates
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorStudents; 