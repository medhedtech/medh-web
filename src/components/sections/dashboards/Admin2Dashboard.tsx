"use client";

import React, { useContext, useState, useEffect } from "react";
import { 
  BarChart, 
  Users, 
  BookOpen, 
  CreditCard, 
  Calendar, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  PlusCircle, 
  Edit, 
  UserPlus,
  Settings,
  Shield,
  Activity,
  Target,
  Award,
  MessageSquare,
  FileText,
  Database,
  PieChart,
  LineChart,
  AlertTriangle,
  Star,
  Zap,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  User,
  BarChart3,
  FormInput,
  Announcement
} from "lucide-react";
import { AdminDashboardContext } from "./AdminDashboardLayout";
import Link from "next/link";
import ApiPanel from "./ApiPanel";
import adminApi, { adminDashboardApi } from "@/apis/admin/admin.api";
import { IAdminDashboardStats } from '@/apis/admin/admin.api';
import { motion } from "framer-motion";

const StatCard = ({ icon, title, value, trend, color, subtitle, loading }: { 
  icon: React.ReactNode;
  title: string;
  value: string;
  trend?: string;
  color: string;
  subtitle?: string;
  loading?: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`${color} rounded-2xl p-6 border border-gray-100 dark:border-gray-700`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        {icon}
      </div>
      {trend && !loading && (
        <span className={`text-sm font-semibold ${trend.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {trend}
        </span>
      )}
      {loading && (
        <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      )}
    </div>
    <div className="space-y-2">
      {loading ? (
        <>
          <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </>
      ) : (
        <>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{title}</p>
      {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-500">{subtitle}</p>
          )}
        </>
      )}
    </div>
  </motion.div>
);

const QuickActionButton = ({ icon, title, href, color, badge }: {
  icon: React.ReactNode;
  title: string;
  href: string;
  color: string;
  badge?: string;
}) => (
  <Link href={href}>
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] h-full relative ${color}`}>
      {badge && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
          {badge}
        </span>
      )}
      <div className="mb-3">
        {icon}
      </div>
      <p className="text-sm font-semibold text-center text-gray-900 dark:text-white">{title}</p>
    </div>
  </Link>
);

const AnalyticsCard = ({ title, value, change, icon, color, loading }: {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`${color} rounded-xl p-4 border border-gray-100 dark:border-gray-700`}
  >
    <div className="flex items-center justify-between mb-3">
      <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        {icon}
      </div>
      {change && !loading && (
        <span className={`text-sm font-semibold ${change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {change}
        </span>
      )}
      {loading && (
        <div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      )}
    </div>
    <div className="space-y-1">
      {loading ? (
        <>
          <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </>
      ) : (
        <>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{value}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        </>
      )}
  </div>
  </motion.div>
);

const API_GROUPS = [
  {
    key: "users",
    title: "All Users",
    icon: <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    endpoint: "/auth/users",
    method: "GET",
    description: "Fetch all users in the system.",
    fetcher: (params?: { page?: number; limit?: number }) => adminApi.auth.getAllUsers(params),
  },
  {
    key: "lockedAccounts",
    title: "Locked Accounts",
    icon: <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />,
    endpoint: "/auth/locked-accounts",
    method: "GET",
    description: "Fetch all locked user accounts.",
    fetcher: (params?: { page?: number; limit?: number }) => adminApi.auth.getLockedAccounts(params),
  },
  {
    key: "batches",
    title: "All Batches",
    icon: <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
    endpoint: "/batches",
    method: "GET",
    description: "Fetch all batches.",
    fetcher: (params?: { page?: number; limit?: number }) => adminApi.batch.getAllBatches(params),
  },
  {
    key: "batchAnalytics",
    title: "Batch Analytics",
    icon: <BarChart3 className="h-6 w-6 text-amber-600 dark:text-amber-400" />,
    endpoint: "/batches/analytics/dashboard",
    method: "GET",
    description: "Get batch analytics dashboard data.",
    fetcher: (params?: { page?: number; limit?: number }) => adminApi.batchAnalytics.getDashboardAnalytics(),
  },
  {
    key: "announcements",
    title: "Announcements",
    icon: <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-400" />,
    endpoint: "/announcements",
    method: "GET",
    description: "Fetch all announcements.",
    fetcher: (params?: { page?: number; limit?: number }) => adminApi.announcement.getAllAnnouncements(params),
  },
  {
    key: "forms",
    title: "Forms",
    icon: <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
    endpoint: "/forms",
    method: "GET",
    description: "Fetch all forms.",
    fetcher: (params?: { page?: number; limit?: number }) => adminApi.form.getAllForms(params),
  },
  {
    key: "courses",
    title: "Courses",
    icon: <FileText className="h-6 w-6 text-pink-600 dark:text-pink-400" />,
    endpoint: "/courses",
    method: "GET",
    description: "Fetch all courses.",
    fetcher: (params?: { page?: number; limit?: number }) => adminApi.course.getAllCourses(params),
  },
];

const Admin2Dashboard: React.FC = () => {
  const dashboardContext = useContext(AdminDashboardContext);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [apiPanel, setApiPanel] = useState<{ open: boolean; group: typeof API_GROUPS[0] | null }>({ open: false, group: null });
  
  // New state for dashboard stats
  const [dashboardStats, setDashboardStats] = useState<IAdminDashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Fetch dashboard stats on component mount
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Reusable function to fetch dashboard stats
  const fetchDashboardStats = async () => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      console.log('Fetching dashboard stats from:', '/admin/dashboard-stats');
      const response = await adminDashboardApi.getDashboardStats();
      console.log('Dashboard stats response:', response);
      
      // Handle the new response structure with detailed changes
      if (response?.data?.data) {
        const statsData = response.data.data;
        console.log('Processing stats data:', statsData);
        setDashboardStats({
          totalStudents: {
            value: statsData.totalStudents?.total || 0,
            change: statsData.totalStudents?.changes?.monthly?.change || 0
          },
          activeEnrollments: {
            value: statsData.activeEnrollments?.total || 0,
            change: statsData.activeEnrollments?.changes?.monthly?.change || 0
          },
          activeCourses: {
            value: statsData.activeCourses?.total || 0,
            change: statsData.activeCourses?.changes?.monthly?.change || 0
          },
          monthlyRevenue: {
            value: statsData.monthlyRevenue?.total || 0,
            change: statsData.monthlyRevenue?.changes?.monthly?.change || 0
          },
          upcomingClasses: {
            value: statsData.upcomingClasses?.total || 0,
            change: 0 // No change data for upcoming classes
          },
          completionRate: {
            value: statsData.completionRate?.total || 0,
            change: 0 // No change data for completion rate
          },
          studentSatisfaction: {
            value: statsData.studentSatisfaction?.total || 0,
            change: 0 // No change data for satisfaction
          },
          instructorRating: {
            value: statsData.instructorRating?.total || 0,
            change: 0 // No change data for rating
          },
          supportTickets: {
            value: statsData.supportTickets?.total || 0,
            change: 0 // No change data for tickets
          }
        });
      } else {
        console.warn('No data found in response:', response);
        // Use mock data as fallback
        setDashboardStats({
          totalStudents: { value: 27, change: -100 },
          activeEnrollments: { value: 18, change: -100 },
          activeCourses: { value: 0, change: 0 },
          monthlyRevenue: { value: 0, change: 0 },
          upcomingClasses: { value: 0, change: 0 },
          completionRate: { value: 0, change: 0 },
          studentSatisfaction: { value: 0, change: 0 },
          instructorRating: { value: 0, change: 0 },
          supportTickets: { value: 0, change: 0 }
        });
      }
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        statusText: error.statusText,
        response: error.response
      });
      
      // Use mock data as fallback when API fails
      console.log('Using mock data as fallback');
      setDashboardStats({
        totalStudents: { value: 27, change: -100 },
        activeEnrollments: { value: 18, change: -100 },
        activeCourses: { value: 0, change: 0 },
        monthlyRevenue: { value: 0, change: 0 },
        upcomingClasses: { value: 0, change: 0 },
        completionRate: { value: 0, change: 0 },
        studentSatisfaction: { value: 0, change: 0 },
        instructorRating: { value: 0, change: 0 },
        supportTickets: { value: 0, change: 0 }
      });
      
      setStatsError(`API Error: ${error.message || 'Failed to load dashboard statistics'}`);
    } finally {
      setStatsLoading(false);
    }
  };

  // Helper function to format numbers
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // Helper function to format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Helper function to format percentage
  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  // Helper function to format rating
  const formatRating = (value: number): string => {
    return `${value.toFixed(1)}/5`;
  };

  // Helper function to get trend color
  const getTrendColor = (change: number): string => {
    return change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  };

  // Helper function to format trend
  const formatTrend = (change: number): string => {
    return change >= 0 ? `+${change}%` : `${change}%`;
  };
  
  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard v2.0</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Advanced analytics and management overview</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <select 
            value={selectedTimeframe} 
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <button 
            onClick={() => {
              setStatsLoading(true);
              setStatsError(null);
              fetchDashboardStats();
            }}
            disabled={statsLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {statsLoading ? 'Refreshing...' : 'Refresh Stats'}
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
            Export Report
          </button>
        </div>
      </div>

      {/* Error Display */}
      {statsError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">!</span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error Loading Dashboard Stats</h3>
              <p className="text-sm text-red-600 dark:text-red-300">{statsError}</p>
            </div>
            <button
              onClick={() => {
                setStatsError(null);
                setStatsLoading(true);
                fetchDashboardStats();
              }}
              className="ml-auto px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      
      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
          title="Total Students"
          value={
            statsLoading
              ? "Loading..."
              : dashboardStats && dashboardStats.totalStudents && typeof dashboardStats.totalStudents.value === 'number'
                ? formatNumber(dashboardStats.totalStudents.value)
                : "N/A"
          }
          trend={
            statsLoading
              ? undefined
              : dashboardStats && dashboardStats.totalStudents && typeof dashboardStats.totalStudents.change === 'number'
                ? formatTrend(dashboardStats.totalStudents.change)
                : undefined
          }
          subtitle="Active enrollments"
          color="bg-blue-50 dark:bg-blue-900/20"
          loading={statsLoading}
        />
        
        <StatCard
          icon={<BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />}
          title="Active Courses"
          value={
            statsLoading
              ? "Loading..."
              : dashboardStats && dashboardStats.activeCourses && typeof dashboardStats.activeCourses.value === 'number'
                ? formatNumber(dashboardStats.activeCourses.value)
                : "N/A"
          }
          trend={
            statsLoading
              ? undefined
              : dashboardStats && dashboardStats.activeCourses && typeof dashboardStats.activeCourses.change === 'number'
                ? formatTrend(dashboardStats.activeCourses.change)
                : undefined
          }
          subtitle="Live & upcoming"
          color="bg-purple-50 dark:bg-purple-900/20"
          loading={statsLoading}
        />
        
        <StatCard
          icon={<CreditCard className="h-6 w-6 text-green-600 dark:text-green-400" />}
          title="Monthly Revenue"
          value={
            statsLoading
              ? "Loading..."
              : dashboardStats && dashboardStats.monthlyRevenue && typeof dashboardStats.monthlyRevenue.value === 'number'
                ? formatCurrency(dashboardStats.monthlyRevenue.value)
                : "N/A"
          }
          trend={
            statsLoading
              ? undefined
              : dashboardStats && dashboardStats.monthlyRevenue && typeof dashboardStats.monthlyRevenue.change === 'number'
                ? formatTrend(dashboardStats.monthlyRevenue.change)
                : undefined
          }
          subtitle="This month"
          color="bg-green-50 dark:bg-green-900/20"
          loading={statsLoading}
        />
        
        <StatCard
          icon={<Calendar className="h-6 w-6 text-amber-600 dark:text-amber-400" />}
          title="Upcoming Classes"
          value={
            statsLoading
              ? "Loading..."
              : dashboardStats && dashboardStats.upcomingClasses && typeof dashboardStats.upcomingClasses.value === 'number'
                ? formatNumber(dashboardStats.upcomingClasses.value)
                : "N/A"
          }
          subtitle="Next 7 days"
          color="bg-amber-50 dark:bg-amber-900/20"
          loading={statsLoading}
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard
          title="Completion Rate"
          value={
            statsLoading
              ? "Loading..."
              : dashboardStats && dashboardStats.completionRate && typeof dashboardStats.completionRate.value === 'number'
                ? formatPercentage(dashboardStats.completionRate.value)
                : "N/A"
          }
          change={
            statsLoading
              ? undefined
              : dashboardStats && dashboardStats.completionRate && typeof dashboardStats.completionRate.change === 'number'
                ? formatTrend(dashboardStats.completionRate.change)
                : undefined
          }
          icon={<Target className="h-5 h-5 text-green-600" />}
          color="bg-green-50 dark:bg-green-900/20"
          loading={statsLoading}
        />
        <AnalyticsCard
          title="Student Satisfaction"
          value={
            statsLoading
              ? "Loading..."
              : dashboardStats && dashboardStats.studentSatisfaction && typeof dashboardStats.studentSatisfaction.value === 'number'
                ? formatRating(dashboardStats.studentSatisfaction.value)
                : "N/A"
          }
          change={
            statsLoading
              ? undefined
              : dashboardStats && dashboardStats.studentSatisfaction && typeof dashboardStats.studentSatisfaction.change === 'number'
                ? formatTrend(dashboardStats.studentSatisfaction.change)
                : undefined
          }
          icon={<Star className="h-5 h-5 text-yellow-600" />}
          color="bg-yellow-50 dark:bg-yellow-900/20"
          loading={statsLoading}
        />
        <AnalyticsCard
          title="Instructor Rating"
          value={
            statsLoading
              ? "Loading..."
              : dashboardStats && dashboardStats.instructorRating && typeof dashboardStats.instructorRating.value === 'number'
                ? formatRating(dashboardStats.instructorRating.value)
                : "N/A"
          }
          change={
            statsLoading
              ? undefined
              : dashboardStats && dashboardStats.instructorRating && typeof dashboardStats.instructorRating.change === 'number'
                ? formatTrend(dashboardStats.instructorRating.change)
                : undefined
          }
          icon={<Award className="h-5 h-5 text-purple-600" />}
          color="bg-purple-50 dark:bg-purple-900/20"
          loading={statsLoading}
        />
        <AnalyticsCard
          title="Support Tickets"
          value={
            statsLoading
              ? "Loading..."
              : dashboardStats && dashboardStats.supportTickets && typeof dashboardStats.supportTickets.value === 'number'
                ? formatNumber(dashboardStats.supportTickets.value)
                : "N/A"
          }
          change={
            statsLoading
              ? undefined
              : dashboardStats && dashboardStats.supportTickets && typeof dashboardStats.supportTickets.change === 'number'
                ? formatTrend(dashboardStats.supportTickets.change)
                : undefined
          }
          icon={<MessageSquare className="h-5 h-5 text-blue-600" />}
          color="bg-blue-50 dark:bg-blue-900/20"
          loading={statsLoading}
        />
      </div>
      
      {/* Enhanced Quick Actions */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
          <Link href="/dashboards/admin/advanced" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All Actions →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <QuickActionButton 
            icon={<PlusCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />}
            title="New Course"
            href="/dashboards/admin/courses/create"
            color="hover:bg-emerald-50 dark:hover:bg-emerald-900/10"
          />
          <QuickActionButton 
            icon={<UserPlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
            title="Add Student"
            href="/dashboards/admin/students/add"
            color="hover:bg-blue-50 dark:hover:bg-blue-900/10"
          />
          <QuickActionButton 
            icon={<Edit className="h-6 w-6 text-purple-600 dark:text-purple-400" />}
            title="Edit Courses"
            href="/dashboards/admin/courses/manage"
            color="hover:bg-purple-50 dark:hover:bg-purple-900/10"
          />
          <QuickActionButton 
            icon={<Calendar className="h-6 w-6 text-amber-600 dark:text-amber-400" />}
            title="Schedule Class"
            href="/dashboards/admin/classes/schedule"
            color="hover:bg-amber-50 dark:hover:bg-amber-900/10"
          />
          <QuickActionButton 
            icon={<Award className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
            title="Certificates"
            href="/dashboards/admin/certificates"
            color="hover:bg-indigo-50 dark:hover:bg-indigo-900/10"
            badge="5"
          />
          <QuickActionButton 
            icon={<Settings className="h-6 w-6 text-gray-600 dark:text-gray-400" />}
            title="Settings"
            href="/dashboards/admin/settings"
            color="hover:bg-gray-50 dark:hover:bg-gray-900/10"
          />
        </div>
      </div>
      
      {/* Admin API Quick Access */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Admin API Quick Access</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {API_GROUPS.map((group) => (
            <button
              key={group.key}
              onClick={() => setApiPanel({ open: true, group })}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.03] h-full"
            >
              <div className="mb-3">{group.icon}</div>
              <p className="text-sm font-semibold text-center text-gray-900 dark:text-white mb-1">{group.title}</p>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{group.method} {group.endpoint}</span>
            </button>
          ))}
        </div>
        {/* ApiPanel Modal */}
        {apiPanel.open && apiPanel.group && (
          <ApiPanel
            open={apiPanel.open}
            onClose={() => setApiPanel({ open: false, group: null })}
            title={apiPanel.group.title}
            endpoint={apiPanel.group.endpoint}
            method={apiPanel.group.method}
            description={apiPanel.group.description}
            fetcher={apiPanel.group.fetcher}
          />
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enhanced Recent Enrollments */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Enrollments</h2>
            <Link href="/dashboards/admin/enrollments" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {[
              { name: "Rahul Sharma", course: "AI & Data Science", time: "2h ago", status: "Paid", amount: "₹45,000", platform: "Web" },
              { name: "Priya Singh", course: "Digital Marketing", time: "4h ago", status: "Pending", amount: "₹32,000", platform: "Mobile" },
              { name: "Amit Kumar", course: "Web Development", time: "6h ago", status: "Paid", amount: "₹28,000", platform: "Web" },
              { name: "Neha Patel", course: "Vedic Mathematics", time: "8h ago", status: "Paid", amount: "₹15,000", platform: "Mobile" },
              { name: "Vijay Mehta", course: "Personality Development", time: "1d ago", status: "Pending", amount: "₹22,000", platform: "Web" }
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {item.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{item.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.course}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.status === "Paid" 
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}>
                        {item.status}
                      </span>
                      <span className="text-xs text-gray-500">{item.platform}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">{item.amount}</p>
                  <p className="text-sm text-gray-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Enhanced Tasks & Alerts */}
        <div className="space-y-6">
          {/* Priority Tasks */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Priority Tasks</h2>
            <div className="space-y-3">
              {[
                { title: "Review instructor applications", due: "Today, 3 PM", priority: "High", count: 5 },
                { title: "Update course pricing", due: "Tomorrow", priority: "Medium", count: 2 },
                { title: "Schedule Q2 planning", due: "In 2 days", priority: "High", count: 1 },
                { title: "Review feedback reports", due: "Next week", priority: "Low", count: 8 }
              ].map((task, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    task.priority === "High" 
                      ? "bg-red-100 dark:bg-red-900/30" 
                      : task.priority === "Medium"
                        ? "bg-amber-100 dark:bg-amber-900/30"
                        : "bg-blue-100 dark:bg-blue-900/30"
                  }`}>
                    <Clock className={`h-4 w-4 ${
                      task.priority === "High" 
                        ? "text-red-600 dark:text-red-400" 
                        : task.priority === "Medium"
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-blue-600 dark:text-blue-400"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900 dark:text-white">{task.title}</p>
                    <p className="text-xs text-gray-500">{task.due}</p>
                    {task.count > 0 && (
                      <span className="inline-block mt-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                        {task.count} items
                      </span>
                    )}
                  </div>
                  <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">
                    <CheckCircle className="h-4 w-4 text-gray-400 hover:text-green-500 dark:hover:text-green-400" />
                  </button>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors">
              View All Tasks
            </button>
          </div>

          {/* System Alerts */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Alerts</h2>
            <div className="space-y-3">
              {[
                { type: "warning", message: "Server maintenance scheduled", time: "2h ago" },
                { type: "info", message: "New course category added", time: "4h ago" },
                { type: "success", message: "Backup completed successfully", time: "6h ago" },
                { type: "error", message: "Payment gateway timeout", time: "1d ago" }
              ].map((alert, index) => (
                <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg ${
                  alert.type === "warning" ? "bg-amber-50 dark:bg-amber-900/20" :
                  alert.type === "info" ? "bg-blue-50 dark:bg-blue-900/20" :
                  alert.type === "success" ? "bg-green-50 dark:bg-green-900/20" :
                  "bg-red-50 dark:bg-red-900/20"
                }`}>
                  <AlertTriangle className={`h-4 w-4 mt-0.5 ${
                    alert.type === "warning" ? "text-amber-600 dark:text-amber-400" :
                    alert.type === "info" ? "text-blue-600 dark:text-blue-400" :
                    alert.type === "success" ? "text-green-600 dark:text-green-400" :
                    "text-red-600 dark:text-red-400"
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.message}</p>
                    <p className="text-xs text-gray-500">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Platform Analytics */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Platform Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <Globe className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">68%</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Web Users</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <Smartphone className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">24%</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Mobile Users</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <Tablet className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">8%</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Tablet Users</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <Activity className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">94%</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Uptime</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin2Dashboard; 