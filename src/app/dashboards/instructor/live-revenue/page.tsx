"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { instructorApi, InstructorRevenue } from '@/apis/instructor.api';
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
  LucideDollarSign,
  LucideBarChart,
  LucideTrendingUp,
  LucideTrendingDown,
  LucideCalendar,
  LucideFilter,
  LucideDownload,
  LucideVideo,
  LucideUsers,
  LucideGraduationCap,
  LucideRefreshCw,
  LucideEye,
  LucideTarget,
  LucideActivity,
  LucideAward,
  LucideCreditCard,
  LucideAlertCircle,
  LucideCheckCircle,
  LucideClock,
  LucideArrowUpRight,
  LucideArrowDownRight,
  LucidePieChart
} from 'lucide-react';

interface RevenueFilters {
  period: 'week' | 'month' | 'quarter' | 'year';
  startDate: string;
  endDate: string;
  includeProjections: boolean;
}

interface MonthlyTrend {
  year: number;
  month: number;
  revenue: number;
  enrollments: number;
  monthName: string;
  batches: number;
}

const LiveRevenuePage: React.FC = () => {
  const [revenueData, setRevenueData] = useState<InstructorRevenue | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<RevenueFilters>({
    period: 'month',
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    includeProjections: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get current instructor ID from localStorage or context
        const instructorId = localStorage.getItem('instructorId') || 'current';
        const response = await instructorApi.getInstructorRevenue(instructorId);
        setRevenueData(response);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching live revenue:', err);
        setError(err?.message || 'Failed to load revenue data');
        showToast.error('Failed to load revenue data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, instructorApi]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getGrowthIcon = (value: number) => {
    if (value > 0) return <LucideArrowUpRight className="w-4 h-4 text-green-600" />;
    if (value < 0) return <LucideArrowDownRight className="w-4 h-4 text-red-600" />;
    return <LucideActivity className="w-4 h-4 text-gray-600" />;
  };

  const getGrowthColor = (value: number) => {
    if (value > 0) return 'text-green-600 dark:text-green-400';
    if (value < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  if (loading) return <Preloader />;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
              <LucideAlertCircle className="w-5 h-5" />
              Error Loading Revenue Data
            </CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
            >
              <LucideRefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!revenueData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-12">
            <LucideDollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No Revenue Data Available
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Start teaching to see your revenue analytics.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate growth rates
  const currentMonth = revenueData.monthlyTrends[revenueData.monthlyTrends.length - 1];
  const previousMonth = revenueData.monthlyTrends[revenueData.monthlyTrends.length - 2];
  const monthlyGrowth = previousMonth ? 
    ((currentMonth?.revenue - previousMonth.revenue) / previousMonth.revenue) * 100 : 0;

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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                <LucideVideo className="w-8 h-8 text-green-600" />
                Live Classes Revenue
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
                Track your earnings from live classes and analyze revenue trends
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2">
                <LucideDownload className="w-4 h-4" />
                Export Report
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <LucideRefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LucideFilter className="w-5 h-5" />
              Revenue Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={filters.period}
                onChange={(e) => setFilters({ ...filters, period: e.target.value as any })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />

              <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                <input
                  type="checkbox"
                  checked={filters.includeProjections}
                  onChange={(e) => setFilters({ ...filters, includeProjections: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Include Projections</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">
                  {formatCurrency(revenueData.summary.totalRevenue)}
                </p>
                <p className="text-green-100 font-medium">
                  Total Revenue
                </p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <LucideDollarSign className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              {getGrowthIcon(monthlyGrowth)}
              <span className="text-sm font-medium">
                {formatPercentage(monthlyGrowth)} from last month
              </span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(revenueData.summary.monthlyRevenue)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  Monthly Revenue
                </p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                <LucideCalendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {revenueData.batchMetrics.activeBatches}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  Active Batches
                </p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
                <LucideGraduationCap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {revenueData.batchMetrics.totalEnrollments}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  Total Enrollments
                </p>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-xl">
                <LucideUsers className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Revenue Breakdown and Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Breakdown */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LucidePieChart className="w-5 h-5" />
                  Revenue Breakdown
                </CardTitle>
                <CardDescription>
                  Your revenue distribution across different sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Batch Revenue</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(revenueData.summary.batchRevenue)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {((revenueData.summary.batchRevenue / revenueData.summary.totalRevenue) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <span className="font-medium">Demo Revenue</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(revenueData.summary.demoRevenue)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {((revenueData.summary.demoRevenue / revenueData.summary.totalRevenue) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <span className="font-medium">Pending Amount</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600 dark:text-red-400">
                        {formatCurrency(revenueData.summary.pendingAmount)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {((revenueData.summary.pendingAmount / revenueData.summary.totalRevenue) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Metrics */}
          <div>
        <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LucideTarget className="w-5 h-5" />
                  Key Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(revenueData.summary.averageRevenuePerStudent)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Avg Revenue/Student
                    </p>
                  </div>

                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(revenueData.batchMetrics.averageRevenuePerBatch)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Avg Revenue/Batch
                    </p>
                  </div>

                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {revenueData.demoMetrics.conversionRate.toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Demo Conversion Rate
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Monthly Trends */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LucideBarChart className="w-5 h-5" />
              Monthly Revenue Trends
            </CardTitle>
            <CardDescription>
              Track your revenue growth over the past months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueData.monthlyTrends.slice(-6).map((trend, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {trend.monthName} {trend.year}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {trend.enrollments} enrollments • {revenueData.breakdown.find(b => b.period.includes(trend.monthName))?.batches || 0} batches
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(trend.revenue)}
                    </p>
                    {index > 0 && (
                      <div className="flex items-center gap-1">
                        {getGrowthIcon(((trend.revenue - revenueData.monthlyTrends[revenueData.monthlyTrends.length - 6 + index - 1].revenue) / revenueData.monthlyTrends[revenueData.monthlyTrends.length - 6 + index - 1].revenue) * 100)}
                        <span className={`text-xs ${getGrowthColor(((trend.revenue - revenueData.monthlyTrends[revenueData.monthlyTrends.length - 6 + index - 1].revenue) / revenueData.monthlyTrends[revenueData.monthlyTrends.length - 6 + index - 1].revenue) * 100)}`}>
                          {formatPercentage(((trend.revenue - revenueData.monthlyTrends[revenueData.monthlyTrends.length - 6 + index - 1].revenue) / revenueData.monthlyTrends[revenueData.monthlyTrends.length - 6 + index - 1].revenue) * 100)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Payments */}
        {revenueData.pendingPayments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LucideCreditCard className="w-5 h-5" />
                Pending Payments ({revenueData.pendingPayments.length})
              </CardTitle>
              <CardDescription>
                Students with pending payment obligations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {revenueData.pendingPayments.slice(0, 5).map((payment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {payment.studentName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {payment.batchName}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold text-red-600 dark:text-red-400">
                          {formatCurrency(payment.pendingAmount)}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {payment.paymentStatus.replace('_', ' ')}
                        </p>
                      </div>
                      <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                        <LucideEye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {revenueData.pendingPayments.length > 5 && (
                  <div className="text-center py-4">
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                      View all {revenueData.pendingPayments.length} pending payments
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  );
};

export default LiveRevenuePage;