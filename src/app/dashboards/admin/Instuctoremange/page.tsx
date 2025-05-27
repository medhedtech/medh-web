"use client";

import React from 'react';
import InstructorTable from '@/components/layout/main/dashboards/InstructorManage';

/**
 * Instructor Management Page
 * 
 * This page provides a comprehensive interface for managing instructors including:
 * - Viewing all instructors in a table format
 * - Adding new instructors
 * - Editing existing instructor details
 * - Toggling instructor status (Active/Inactive)
 * - Deleting instructors
 * - Importing instructors via CSV
 * - Filtering and searching instructors
 * 
 * Route: /dashboards/admin/Instuctoremange
 */
const InstructorManagementPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Instructor Management
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Manage all instructors, their profiles, and course assignments
              </p>
            </div>
            
            {/* Breadcrumb */}
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Admin Dashboard
                    </span>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg
                      className="flex-shrink-0 h-4 w-4 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                    </svg>
                    <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                      Instructor Management
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <InstructorTable />
      </div>
    </div>
  );
};

export default InstructorManagementPage; 