"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { instructorApi, InstructorRevenue } from '@/apis/instructor.api';
import { showToast } from '@/utils/toast';
import { 
  LucideLoader2, 
  LucideAlertCircle,
  LucideCheckCircle,
  LucideInfo,
  LucideRefreshCw,
  LucideDollarSign,
  LucideTrendingUp,
  LucideTrendingDown,
  LucideCalendar,
  LucideFilter,
  LucideDownload,
  LucideBarChart3,
  LucideUsers,
  LucideVideo,
  LucideMonitorPlay,
  LucideCreditCard,
  LucideArrowUpRight,
  LucideArrowDownRight,
  LucideTarget,
  LucidePercent,
  LucideEye,
  LucideSearch,
  LucideChevronDown
} from 'lucide-react';

// Types and Interfaces
interface LiveRevenueData {
  revenue: InstructorRevenue;
  loading: boolean;
  error: string | null;
}

interface LiveRevenueProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

interface FilterOptions {
  period: 'week' | 'month' | 'quarter' | 'year';
  startDate: string;
  endDate: string;
  includeProjections: boolean;
}

interface RevenueCard {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  trend: 'up' | 'down' | 'neutral';
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
      <p className="text-gray-600 dark:text-gray-300">Loading revenue data...</p>
    </div>
  </div>
);

// Error Component
const ErrorMessage: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center max-w-md">
      <LucideAlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Unable to load revenue data
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

// Revenue Summary Cards Component
const RevenueSummaryCards: React.FC<{ revenue: InstructorRevenue }> = ({ revenue }) => {
  const cards: RevenueCard[] = [
    {
      title: 'Total Revenue',
      value: `$${revenue.summary.totalRevenue.toLocaleString()}`,
      change: 12.5,
      icon: LucideDollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      trend: 'up'
    },
    {
      title: 'Monthly Revenue',
      value: `$${revenue.summary.monthlyRevenue.toLocaleString()}`,
      change: 8.3,
      icon: LucideBarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      trend: 'up'
    },
    {
      title: 'Demo Revenue',
      value: `$${revenue.summary.demoRevenue.toLocaleString()}`,
      change: -2.1,
      icon: LucideMonitorPlay,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      trend: 'down'
    },
    {
      title: 'Batch Revenue',
      value: `$${revenue.summary.batchRevenue.toLocaleString()}`,
      change: 15.7,
      icon: LucideVideo,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      trend: 'up'
    },
    {
      title: 'Pending Amount',
      value: `$${revenue.summary.pendingAmount.toLocaleString()}`,
      change: 0,
      icon: LucideCreditCard,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      trend: 'neutral'
    },
    {
      title: 'Avg Revenue/Student',
      value: `$${revenue.summary.averageRevenuePerStudent.toLocaleString()}`,
      change: 5.2,
      icon: LucideUsers,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/20',
      trend: 'up'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${card.bgColor}`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            {card.trend !== 'neutral' && (
              <div className={`flex items-center gap-1 text-sm ${
                card.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {card.trend === 'up' ? (
                  <LucideArrowUpRight className="w-4 h-4" />
                ) : (
                  <LucideArrowDownRight className="w-4 h-4" />
                )}
                <span>{Math.abs(card.change)}%</span>
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              {card.title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {card.value}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Revenue Breakdown Component
const RevenueBreakdown: React.FC<{ revenue: InstructorRevenue }> = ({ revenue }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue by Period */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Revenue Breakdown by Period
        </h3>
        <div className="space-y-4">
          {revenue.breakdown.slice(0, 5).map((period, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{period.period}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {period.enrollments} enrollments • {period.batches} batches
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900 dark:text-white">
                  ${period.revenue.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Key Metrics
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <LucidePercent className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-gray-900 dark:text-white">Demo Conversion Rate</span>
            </div>
            <span className="font-bold text-gray-900 dark:text-white">
              {revenue.demoMetrics.conversionRate}%
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <LucideDollarSign className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-gray-900 dark:text-white">Avg Revenue/Demo</span>
            </div>
            <span className="font-bold text-gray-900 dark:text-white">
              ${revenue.demoMetrics.averageRevenuePerDemo.toLocaleString()}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <LucideVideo className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-gray-900 dark:text-white">Avg Revenue/Batch</span>
            </div>
            <span className="font-bold text-gray-900 dark:text-white">
              ${revenue.batchMetrics.averageRevenuePerBatch.toLocaleString()}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <LucideUsers className="w-4 h-4 text-orange-600" />
              </div>
              <span className="text-gray-900 dark:text-white">Total Enrollments</span>
            </div>
            <span className="font-bold text-gray-900 dark:text-white">
              {revenue.batchMetrics.totalEnrollments}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Monthly Trends Component
const MonthlyTrends: React.FC<{ revenue: InstructorRevenue }> = ({ revenue }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Monthly Revenue Trends
        </h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View Details
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {revenue.monthlyTrends.slice(-4).map((trend, index) => {
          const growth = index > 0 ? 
            ((trend.revenue - revenue.monthlyTrends[revenue.monthlyTrends.length - 4 + index - 1].revenue) / 
             revenue.monthlyTrends[revenue.monthlyTrends.length - 4 + index - 1].revenue * 100) : 0;
          
          return (
            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {trend.monthName} {trend.year}
                </span>
                {growth !== 0 && (
                  <span className={`text-xs flex items-center gap-1 ${
                    growth > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {growth > 0 ? (
                      <LucideArrowUpRight className="w-3 h-3" />
                    ) : (
                      <LucideArrowDownRight className="w-3 h-3" />
                    )}
                    {Math.abs(growth).toFixed(1)}%
                  </span>
                )}
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                ${trend.revenue.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {trend.enrollments} enrollments
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Pending Payments Component
const PendingPayments: React.FC<{ revenue: InstructorRevenue }> = ({ revenue }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Pending Payments ({revenue.pendingPayments.length})
        </h3>
        <div className="flex items-center gap-2">
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Follow Up All
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <LucideEye className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {revenue.pendingPayments.length > 0 ? (
        <div className="space-y-3">
          {revenue.pendingPayments.slice(0, 5).map((payment, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{payment.studentName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{payment.batchName}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900 dark:text-white">
                  ${payment.pendingAmount.toLocaleString()}
                </p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  payment.paymentStatus === 'overdue' 
                    ? 'text-red-600 bg-red-100 dark:bg-red-900/20'
                    : 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
                }`}>
                  {payment.paymentStatus}
                </span>
              </div>
            </div>
          ))}
          {revenue.pendingPayments.length > 5 && (
            <div className="text-center pt-4">
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View all {revenue.pendingPayments.length} pending payments
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <LucideCheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            All payments up to date!
          </h4>
          <p className="text-gray-600 dark:text-gray-300">
            No pending payments at this time.
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * LiveRevenuePage - Comprehensive revenue analytics and tracking
 */
const LiveRevenuePage: React.FC<LiveRevenueProps> = ({ searchParams }) => {
  // State management
  const [data, setData] = useState<LiveRevenueData>({
    revenue: {
      summary: {
        totalRevenue: 0,
        monthlyRevenue: 0,
        demoRevenue: 0,
        batchRevenue: 0,
        pendingAmount: 0,
        averageRevenuePerStudent: 0
      },
      breakdown: [],
      monthlyTrends: [],
      demoMetrics: {
        totalDemos: 0,
        completedDemos: 0,
        conversionRate: 0,
        averageRevenuePerDemo: 0
      },
      batchMetrics: {
        averageRevenuePerBatch: 0,
        totalEnrollments: 0,
        activeBatches: 0,
        batchDetails: []
      },
      pendingPayments: []
    },
    loading: true,
    error: null
  });
  
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    period: 'month',
    startDate: '',
    endDate: '',
    includeProjections: false
  });

  // Mock data generator
  const generateMockRevenueData = (): InstructorRevenue => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const monthlyTrends = months.map((month, index) => ({
      year: 2024,
      month: index + 1,
      revenue: Math.floor(Math.random() * 5000) + 3000,
      enrollments: Math.floor(Math.random() * 20) + 10,
      monthName: month
    }));

    const totalRevenue = monthlyTrends.reduce((sum, trend) => sum + trend.revenue, 0);
    const totalEnrollments = monthlyTrends.reduce((sum, trend) => sum + trend.enrollments, 0);

    return {
      summary: {
        totalRevenue,
        monthlyRevenue: monthlyTrends[monthlyTrends.length - 1]?.revenue || 0,
        demoRevenue: Math.floor(totalRevenue * 0.3),
        batchRevenue: Math.floor(totalRevenue * 0.7),
        pendingAmount: Math.floor(Math.random() * 2000) + 500,
        averageRevenuePerStudent: Math.floor(totalRevenue / totalEnrollments)
      },
      breakdown: months.map((month, index) => ({
        period: `${month} 2024`,
        revenue: monthlyTrends[index].revenue,
        enrollments: monthlyTrends[index].enrollments,
        batches: Math.floor(Math.random() * 3) + 1
      })),
      monthlyTrends,
      demoMetrics: {
        totalDemos: 45,
        completedDemos: 38,
        conversionRate: 73.5,
        averageRevenuePerDemo: 125
      },
      batchMetrics: {
        averageRevenuePerBatch: 2800,
        totalEnrollments,
        activeBatches: 4,
        batchDetails: []
      },
      pendingPayments: Array.from({ length: 3 }, (_, i) => ({
        enrollmentId: `ENR${String(i + 1).padStart(3, '0')}`,
        studentName: `Student ${i + 1}`,
        batchName: `Batch ${String.fromCharCode(65 + i)}`,
        pendingAmount: Math.floor(Math.random() * 500) + 200,
        paymentStatus: i === 0 ? 'overdue' : 'pending'
      }))
    };
  };

  // Fetch data
  const fetchData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));
      
      // TODO: Replace with actual API call
      // const response = await instructorApi.getInstructorRevenue(filters);
      
      // Using mock data for now
      setTimeout(() => {
        const mockRevenue = generateMockRevenueData();
        setData({
          revenue: mockRevenue,
          loading: false,
          error: null
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }));
      showToast.error('Failed to load revenue data. Please try again.');
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
                Live Revenue Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Track your earnings from live classes and demo sessions
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={filters.period}
                onChange={(e) => setFilters(prev => ({ ...prev, period: e.target.value as FilterOptions['period'] }))}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                <LucideRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
                <LucideDownload className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Revenue Summary Cards */}
          <RevenueSummaryCards revenue={data.revenue} />

          {/* Revenue Breakdown */}
          <motion.div variants={itemVariants}>
            <RevenueBreakdown revenue={data.revenue} />
          </motion.div>

          {/* Monthly Trends */}
          <motion.div variants={itemVariants}>
            <MonthlyTrends revenue={data.revenue} />
          </motion.div>

          {/* Pending Payments */}
          <motion.div variants={itemVariants}>
            <PendingPayments revenue={data.revenue} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LiveRevenuePage;