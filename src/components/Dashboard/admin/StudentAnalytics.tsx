"use client";

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  GraduationCap,
  Clock,
  Award,
  BookOpen,
  DollarSign,
  Calendar,
  Activity,
  AlertCircle,
  CheckCircle,
  Target,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';

interface IStudentAnalyticsProps {
  batchId: string;
  enrolledStudents: Array<{
    _id: string;
    full_name: string;
    email: string;
    enrollment_date: string;
    enrollment_status: string;
    progress: number;
    payment_plan: string;
    phone_numbers?: Array<{
      country: string;
      number: string;
    }>;
  }>;
  onRefresh?: () => Promise<void> | void;
}

interface IAnalyticsData {
  enrollmentTrend: Array<{
    date: string;
    enrollments: number;
    cumulative: number;
  }>;
  progressDistribution: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  statusBreakdown: Array<{
    status: string;
    count: number;
    percentage: number;
    color: string;
  }>;
  paymentPlanDistribution: Array<{
    plan: string;
    count: number;
    percentage: number;
    color: string;
  }>;
  weeklyActivity: Array<{
    week: string;
    active: number;
    completed: number;
    new_enrollments: number;
  }>;
  geographicDistribution: Array<{
    country: string;
    count: number;
    percentage: number;
  }>;
}

const StudentAnalytics: React.FC<IStudentAnalyticsProps> = ({
  batchId,
  enrolledStudents,
  onRefresh
}) => {
  const [analyticsData, setAnalyticsData] = useState<IAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'progress' | 'enrollments' | 'activity'>('progress');

  useEffect(() => {
    generateAnalyticsData();
  }, [enrolledStudents, timeRange]);

  const generateAnalyticsData = () => {
    if (!enrolledStudents || enrolledStudents.length === 0) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Enrollment Trend
      const enrollmentsByDate = enrolledStudents.reduce((acc, student) => {
        const date = new Date(student.enrollment_date).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const sortedDates = Object.keys(enrollmentsByDate).sort();
      let cumulative = 0;
      const enrollmentTrend = sortedDates.map(date => {
        cumulative += enrollmentsByDate[date];
        return {
          date: new Date(date).toLocaleDateString(),
          enrollments: enrollmentsByDate[date],
          cumulative
        };
      });

      // Progress Distribution
      const progressRanges = [
        { range: '0%', min: 0, max: 0 },
        { range: '1-25%', min: 1, max: 25 },
        { range: '26-50%', min: 26, max: 50 },
        { range: '51-75%', min: 51, max: 75 },
        { range: '76-99%', min: 76, max: 99 },
        { range: '100%', min: 100, max: 100 }
      ];

      const progressDistribution = progressRanges.map(range => {
        const count = enrolledStudents.filter(student => 
          student.progress >= range.min && student.progress <= range.max
        ).length;
        return {
          range: range.range,
          count,
          percentage: Math.round((count / enrolledStudents.length) * 100)
        };
      });

      // Status Breakdown
      const statusColors = {
        active: '#10B981',
        completed: '#3B82F6',
        cancelled: '#EF4444',
        on_hold: '#F59E0B',
        expired: '#6B7280'
      };

      const statusCounts = enrolledStudents.reduce((acc, student) => {
        acc[student.enrollment_status] = (acc[student.enrollment_status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const statusBreakdown = Object.entries(statusCounts).map(([status, count]) => ({
        status: status.replace('_', ' ').toUpperCase(),
        count,
        percentage: Math.round((count / enrolledStudents.length) * 100),
        color: statusColors[status as keyof typeof statusColors] || '#6B7280'
      }));

      // Payment Plan Distribution
      const paymentColors = {
        full: '#059669',
        installment: '#F59E0B'
      };

      const paymentCounts = enrolledStudents.reduce((acc, student) => {
        acc[student.payment_plan] = (acc[student.payment_plan] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const paymentPlanDistribution = Object.entries(paymentCounts).map(([plan, count]) => ({
        plan: plan.replace('_', ' ').toUpperCase(),
        count,
        percentage: Math.round((count / enrolledStudents.length) * 100),
        color: paymentColors[plan as keyof typeof paymentColors] || '#6B7280'
      }));

      // Weekly Activity (mock data for demonstration)
      const weeklyActivity = [
        { week: 'Week 1', active: 15, completed: 2, new_enrollments: 5 },
        { week: 'Week 2', active: 18, completed: 3, new_enrollments: 3 },
        { week: 'Week 3', active: 22, completed: 5, new_enrollments: 4 },
        { week: 'Week 4', active: 20, completed: 8, new_enrollments: 2 }
      ];

      // Geographic Distribution
      const geographicCounts = enrolledStudents.reduce((acc, student) => {
        if (student.phone_numbers && student.phone_numbers.length > 0) {
          const country = student.phone_numbers[0].country || 'Unknown';
          acc[country] = (acc[country] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const geographicDistribution = Object.entries(geographicCounts).map(([country, count]) => ({
        country,
        count,
        percentage: Math.round((count / enrolledStudents.length) * 100)
      }));

      setAnalyticsData({
        enrollmentTrend,
        progressDistribution,
        statusBreakdown,
        paymentPlanDistribution,
        weeklyActivity,
        geographicDistribution
      });
    } catch (error) {
      console.error('Error generating analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getKPIs = () => {
    if (!enrolledStudents.length) return null;

    const totalStudents = enrolledStudents.length;
    const activeStudents = enrolledStudents.filter(s => s.enrollment_status === 'active').length;
    const completedStudents = enrolledStudents.filter(s => s.enrollment_status === 'completed').length;
    const avgProgress = Math.round(enrolledStudents.reduce((sum, s) => sum + s.progress, 0) / totalStudents);
    const fullPaymentStudents = enrolledStudents.filter(s => s.payment_plan === 'full').length;
    const completionRate = Math.round((completedStudents / totalStudents) * 100);
    const activeRate = Math.round((activeStudents / totalStudents) * 100);
    const fullPaymentRate = Math.round((fullPaymentStudents / totalStudents) * 100);

    return {
      totalStudents,
      activeStudents,
      completedStudents,
      avgProgress,
      completionRate,
      activeRate,
      fullPaymentRate
    };
  };

  const kpis = getKPIs();

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Generating analytics...</span>
        </div>
      </div>
    );
  }

  if (!analyticsData || !kpis) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center py-8">
          <BarChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Analytics Data Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Enroll students in this batch to see detailed analytics and insights.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Student Analytics
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive insights into student enrollment and progress
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </select>
            <button
              onClick={onRefresh || generateAnalyticsData}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title="Refresh Analytics"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Students</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{kpis.totalStudents}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Active Rate</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">{kpis.activeRate}%</p>
            </div>
            <Activity className="h-8 w-8 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Completion Rate</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{kpis.completionRate}%</p>
            </div>
            <GraduationCap className="h-8 w-8 text-purple-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Avg Progress</p>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{kpis.avgProgress}%</p>
            </div>
            <Target className="h-8 w-8 text-orange-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Full Payment</p>
              <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{kpis.fullPaymentRate}%</p>
            </div>
            <DollarSign className="h-8 w-8 text-emerald-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-rose-600 dark:text-rose-400">Active Students</p>
              <p className="text-2xl font-bold text-rose-900 dark:text-rose-100">{kpis.activeStudents}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-rose-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Graduates</p>
              <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">{kpis.completedStudents}</p>
            </div>
            <Award className="h-8 w-8 text-indigo-500" />
          </div>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Progress Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.progressDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Enrollment Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.statusBreakdown}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="count"
                label={({ status, percentage }) => `${status}: ${percentage}%`}
              >
                {analyticsData.statusBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Enrollment Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Enrollment Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData.enrollmentTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="cumulative" 
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Plan Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Payment Plan Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.paymentPlanDistribution}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="count"
                label={({ plan, percentage }) => `${plan}: ${percentage}%`}
              >
                {analyticsData.paymentPlanDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Geographic Distribution */}
      {analyticsData.geographicDistribution.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Geographic Distribution
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {analyticsData.geographicDistribution.map((country, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {country.country}
                  </span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {country.count}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${country.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {country.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Weekly Activity Trends
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analyticsData.weeklyActivity}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="active" 
              stroke="#10B981" 
              strokeWidth={2} 
              name="Active Students"
            />
            <Line 
              type="monotone" 
              dataKey="completed" 
              stroke="#3B82F6" 
              strokeWidth={2} 
              name="Completed"
            />
            <Line 
              type="monotone" 
              dataKey="new_enrollments" 
              stroke="#F59E0B" 
              strokeWidth={2} 
              name="New Enrollments"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StudentAnalytics; 