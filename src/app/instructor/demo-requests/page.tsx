"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { instructorApi } from '@/apis/instructor.api';
import { showToast } from '@/utils/toast';
import { 
  LucideLoader2, 
  LucideAlertCircle,
  LucideCheckCircle,
  LucideInfo,
  LucideRefreshCw
} from 'lucide-react';

// Types and Interfaces
interface DemoRequestsData {
  // TODO: Define proper interface based on API response
  data: any[];
  loading: boolean;
  error: string | null;
}

interface DemoRequestsProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}


// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

// Loading Component
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <LucideLoader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
      <p className="text-gray-600 dark:text-gray-300">Loading...</p>
    </div>
  </div>
);

// Error Component
const ErrorMessage: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center max-w-md">
      <LucideAlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Something went wrong
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          <LucideRefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  </div>
);

/**
 * DemoRequestsPage - Demo Requests management
 */
const DemoRequestsPage: React.FC<DemoRequestsProps> = ({ searchParams }) => {
  
  // State management
  const [data, setData] = useState<DemoRequestsData>({
    data: [],
    loading: true,
    error: null
  });
  const [refreshing, setRefreshing] = useState(false);

  // Fetch data
  const fetchData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));
      
      // TODO: Replace with actual API call
      const response = await instructorApi.updateDemoStatus();
      
      if (response.success) {
        setData({
          data: response.data || [],
          loading: false,
          error: null
        });
      } else {
        throw new Error(response.error?.message || 'Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setData({
        data: [],
        loading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
      showToast('error', 'Failed to load data. Please try again.');
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  // Effect to fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Loading state
  if (data.loading) {
    return <LoadingSpinner />;
  }

  // Error state
  if (data.error) {
    return <ErrorMessage message={data.error} onRetry={handleRefresh} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Demo Requests
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Manage your demo requests efficiently
              </p>
            </div>
            
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              <LucideRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Main Content */}
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Stats Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* TODO: Add relevant stats cards */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.data.length}</p>
                </div>
                <LucideInfo className="w-8 h-8 text-blue-500" />
              </div>
            </div>
          </motion.div>

          {/* Main Content Area */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Demo Requests List
              </h2>
              
              {/* TODO: Implement actual content based on page type */}
              {data.data.length > 0 ? (
                <div className="space-y-4">
                  {data.data.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <p className="text-gray-900 dark:text-white">
                        Item {index + 1}: {JSON.stringify(item)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <LucideInfo className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No data available
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    There are no items to display at this time.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default DemoRequestsPage;