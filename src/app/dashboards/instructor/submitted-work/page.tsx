"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { InstructorAPI } from '@/apis/instructor.api';
import { showToast } from '@/utils/toast';
import Preloader from '@/components/shared/others/Preloader';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  LucideBook,
  LucideUsers,
  LucideCalendar,
  LucideBarChart,
  LucideSettings,
  LucideFileText,
  LucideVideo,
  LucideClipboardList,
  LucideGraduationCap,
  LucideDollarSign,
  LucideMessageSquare,
  LucideUpload,
  LucideDownload,
  LucideEye,
  LucideEdit,
  LucidePlus,
  LucideRefreshCw,
  LucideFilter,
  LucideSearch
} from 'lucide-react';




interface checkSubmittedWorkData {
  // Define your data interface here based on API response
}

const checkSubmittedWorkPage: React.FC = () => {
  const [data, setData] = useState<checkSubmittedWorkData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await InstructorAPI.getAssignments();
        const items = Array.isArray(response?.data ?? response) ? (response?.data ?? response) : [];
        setData(items);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching check submitted work:', err);
        setError(err?.message || 'Failed to load check submitted work');
        showToast.error('Failed to load check submitted work');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Preloader />;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Check Submitted Work
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your check submitted work efficiently
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2">
                <LucidePlus className="w-4 h-4" />
                Add New
              </button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
                <LucideRefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LucideFileText className="w-5 h-5" />
                  Check Submitted Work List
                </CardTitle>
                <CardDescription>
                  View and manage your check submitted work
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Add your main content here */}
                <div className="space-y-4">
                  {Array.isArray(data) && data.length > 0 ? (
                    data.map((item, index) => (
                      <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        {/* Render your data item here */}
                        <p className="text-gray-600 dark:text-gray-400">
                          Data item {index + 1}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <LucideFileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        No check submitted work found
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LucideBarChart className="w-5 h-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Total</span>
                    <span className="font-semibold">{data.length}</span>
                  </div>
                  {/* Add more stats here */}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LucideFilter className="w-5 h-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add filters here */}
                <div className="space-y-3">
                  <div className="relative">
                    <LucideSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default checkSubmittedWorkPage;