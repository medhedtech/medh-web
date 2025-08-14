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
  Megaphone,
  MoreHorizontal,
  ChevronRight,
  Eye,
  Settings as SettingsIcon,
  Bell,
  Search
} from "lucide-react";
import { AdminDashboardContext } from "./AdminDashboardLayout";
import Link from "next/link";
import { motion } from "framer-motion";
import adminApi, { adminDashboardApi } from "@/apis/admin/admin.api";
import { IAdminDashboardStats, IRecentEnrollment, IRecentUser } from '@/apis/admin/admin.api';

// Clean Stat Card Component - No hover effects
const StatCard = ({ icon, title, value, trend, color, subtitle, loading }: { 
  icon: React.ReactNode;
  title: string;
  value: string;
  trend?: string;
  color: string;
  subtitle?: string;
  loading?: boolean;
}) => (
  <div className={`${color} rounded-xl p-6 border border-gray-200 dark:border-gray-700`}>
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
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
  </div>
);

// Clean Action Card Component - No hover effects
const ActionCard = ({ icon, title, description, href, badge }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  badge?: string;
}) => (
  <Link href={href} className="block">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 h-full">
      {badge && (
        <span className="inline-block bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs px-2 py-1 rounded-full font-medium mb-3">
          {badge}
        </span>
      )}
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
        {icon}
      </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 mt-1" />
      </div>
    </div>
  </Link>
);

// Clean Analytics Card Component - No hover effects
const AnalyticsCard = ({ title, value, change, icon, color, loading }: {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
}) => (
  <div className={`${color} rounded-xl p-4 border border-gray-200 dark:border-gray-700`}>
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
  </div>
);

// Clean Recent Activity Item Component
const RecentActivityItem = ({ icon, title, description, time, status }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  status?: 'success' | 'warning' | 'error' | 'info';
}) => {
  const statusColors = {
    success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
  };

  return (
    <div className="flex items-start space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h4>
          {status && (
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[status]}`}>
              {status}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{description}</p>
        <p className="text-xs text-gray-500 dark:text-gray-500">{time}</p>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const dashboardContext = useContext(AdminDashboardContext);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  
  // State for dashboard stats
  const [dashboardStats, setDashboardStats] = useState<IAdminDashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  // State for recent enrollments
  const [recentEnrollments, setRecentEnrollments] = useState<IRecentEnrollment[]>([]);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(true);
  const [enrollmentsError, setEnrollmentsError] = useState<string | null>(null);

  // State for recent users
  const [recentUsers, setRecentUsers] = useState<IRecentUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);

  // Fetch dashboard stats on component mount
  useEffect(() => {
    fetchDashboardStats();
    fetchRecentEnrollments();
    fetchRecentUsers();
  }, []);

  // Reusable function to fetch dashboard stats
  const fetchDashboardStats = async () => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const response = await adminDashboardApi.getDashboardStats();
      
      if (response?.data?.data) {
        const statsData = response.data.data;
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
            change: 0
          },
          completionRate: {
            value: statsData.completionRate?.total || 0,
            change: 0
          },
          studentSatisfaction: {
            value: statsData.studentSatisfaction?.total || 0,
            change: 0
          },
          instructorRating: {
            value: statsData.instructorRating?.total || 0,
            change: 0
          },
          supportTickets: {
            value: statsData.supportTickets?.total || 0,
            change: 0
          }
        });
      } else {
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
      setStatsError(`API Error: ${error.message || 'Failed to load dashboard statistics'}`);
      
      // Use mock data as fallback when API fails
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
    } finally {
      setStatsLoading(false);
    }
  };

  // Reusable function to fetch recent enrollments
  const fetchRecentEnrollments = async () => {
    setEnrollmentsLoading(true);
    setEnrollmentsError(null);
    try {
      const response = await adminDashboardApi.getRecentEnrollments({ limit: 5 });
      
      let actualData = null;
      let isSuccess = false;

      if ((response as any)?.data?.success === true && (response as any)?.data?.data) {
        actualData = (response as any).data.data;
        isSuccess = true;
      } else if ((response as any)?.success === true && (response as any)?.data) {
        actualData = (response as any).data;
        isSuccess = true;
      }
      
      if (isSuccess && Array.isArray(actualData)) {
        setRecentEnrollments(actualData);
      } else {
        setRecentEnrollments([]);
      }
    } catch (error: any) {
      console.error('Error fetching recent enrollments:', error);
      setEnrollmentsError(`Failed to load recent enrollments: ${error.message || 'Network error'}`);
      setRecentEnrollments([]);
    } finally {
      setEnrollmentsLoading(false);
    }
  };

  // Reusable function to fetch recent users
  const fetchRecentUsers = async () => {
    setUsersLoading(true);
    setUsersError(null);
    try {
      const response = await adminDashboardApi.getRecentUsers({ limit: 5 });
      
      let actualData = null;
      let isSuccess = false;

      if ((response as any)?.data?.success === true && (response as any)?.data?.data) {
        actualData = (response as any).data.data;
        isSuccess = true;
      } else if ((response as any)?.success === true && (response as any)?.data) {
        actualData = (response as any).data;
        isSuccess = true;
      }
      
      if (isSuccess && Array.isArray(actualData)) {
        setRecentUsers(actualData);
      } else {
        setRecentUsers([]);
      }
    } catch (error: any) {
      console.error('Error fetching recent users:', error);
      setUsersError(`Failed to load recent users: ${error.message || 'Network error'}`);
      setRecentUsers([]);
    } finally {
      setUsersLoading(false);
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

  // Helper function to format trend
  const formatTrend = (change: number): string => {
    return change >= 0 ? `+${change}%` : `${change}%`;
  };

  return (
    <div className="space-y-8">
      {/* Header Section - Clean and Simple */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">System overview and management</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <select 
            value={selectedTimeframe} 
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
            aria-label="Select timeframe for dashboard statistics"
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {statsLoading ? 'Refreshing...' : 'Refresh Stats'}
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
              className="ml-auto px-3 py-1 bg-red-600 text-white rounded text-xs transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      
      {/* Stats Grid - Clean Layout */}
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

      {/* Performance Metrics - Clean Grid */}
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
              ? ""
              : dashboardStats && dashboardStats.completionRate && typeof dashboardStats.completionRate.change === 'number'
                ? formatTrend(dashboardStats.completionRate.change)
                : ""
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
              ? ""
              : dashboardStats && dashboardStats.studentSatisfaction && typeof dashboardStats.studentSatisfaction.change === 'number'
                ? formatTrend(dashboardStats.studentSatisfaction.change)
                : ""
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
              ? ""
              : dashboardStats && dashboardStats.instructorRating && typeof dashboardStats.instructorRating.change === 'number'
                ? formatTrend(dashboardStats.instructorRating.change)
                : ""
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
              ? ""
              : dashboardStats && dashboardStats.supportTickets && typeof dashboardStats.supportTickets.change === 'number'
                ? formatTrend(dashboardStats.supportTickets.change)
                : ""
          }
          icon={<MessageSquare className="h-5 h-5 text-blue-600" />}
          color="bg-blue-50 dark:bg-blue-900/20"
          loading={statsLoading}
        />
      </div>
      
      {/* Quick Actions - Clean Grid Layout */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
          <Link href="/dashboards/admin/advanced" className="text-blue-600 text-sm font-medium">
            View All Actions →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <ActionCard 
            icon={<PlusCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />}
            title="Create New Course"
            description="Add a new course to the platform"
            href="/dashboards/admin/courses/create"
          />
          <ActionCard 
            icon={<UserPlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
            title="Add Student"
            description="Enroll a new student"
            href="/dashboards/admin/students/"
          />
          <ActionCard 
            icon={<Edit className="h-6 w-6 text-purple-600 dark:text-purple-400" />}
            title="Manage Instructors"
            description="View and manage instructor accounts"
            href="/dashboards/admin/Instuctoremange/"
          />
          <ActionCard 
            icon={<Calendar className="h-6 w-6 text-amber-600 dark:text-amber-400" />}
            title="Live Classes"
            description="Schedule and manage live sessions"
            href="/dashboards/admin/online-class/"
          />
          <ActionCard 
            icon={<Settings className="h-6 w-6 text-gray-600 dark:text-gray-400" />}
            title="System Settings"
            description="Configure platform settings"
            href="/dashboards/admin/settings"
          />
          <ActionCard 
            icon={<BarChart className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
            title="View Reports"
            description="Access analytics and reports"
            href="/dashboards/admin/reports"
          />
          <ActionCard 
            icon={<Shield className="h-6 w-6 text-red-600 dark:text-red-400" />}
            title="Security Management"
            description="Manage user security and lockouts"
            href="/dashboards/admin/security"
            badge="New"
          />
          <ActionCard 
            icon={<Megaphone className="h-6 w-6 text-green-600 dark:text-green-400" />}
            title="Send Announcements"
            description="Create and send platform announcements"
            href="/dashboards/admin/announcements/"
          />
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Enrollments */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Enrollments</h2>
            <button 
              onClick={() => {
                setEnrollmentsLoading(true);
                setEnrollmentsError(null);
                fetchRecentEnrollments();
              }}
              disabled={enrollmentsLoading}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {enrollmentsLoading ? 'Refreshing...' : 'Refresh'}
            </button>
        </div>

        {enrollmentsError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-600 dark:text-red-300">{enrollmentsError}</p>
          </div>
        )}

        <div className="space-y-4">
          {enrollmentsLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600"></div>
                  <div className="flex-1">
                    <div className="w-32 h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="w-24 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
                </div>
              </div>
            ))
          ) : recentEnrollments.length > 0 ? (
              recentEnrollments.slice(0, 3).map((enrollment) => (
                <RecentActivityItem
                key={enrollment.enrollment_id} 
                  icon={<User className="h-5 w-5 text-blue-600" />}
                  title={enrollment.student?.name || 'Unknown Student'}
                  description={`Enrolled in ${enrollment.course?.title || 'Unknown Course'}`}
                  time={new Date(enrollment.enrollment_date).toLocaleDateString()}
                  status={enrollment.payment?.status === 'paid' ? 'success' : 'warning'}
                />
            ))
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No recent enrollments</p>
            </div>
          )}
        </div>
      </div>

        {/* Recent Users */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Users</h2>
            <button 
              onClick={() => {
                setUsersLoading(true);
                setUsersError(null);
                fetchRecentUsers();
              }}
              disabled={usersLoading}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {usersLoading ? 'Refreshing...' : 'Refresh'}
            </button>
        </div>

        {usersError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-600 dark:text-red-300">{usersError}</p>
          </div>
        )}

        <div className="space-y-4">
          {usersLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600"></div>
                  <div className="flex-1">
                    <div className="w-32 h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="w-24 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
                </div>
              </div>
            ))
          ) : recentUsers.length > 0 ? (
              recentUsers.slice(0, 3).map((user) => (
                <RecentActivityItem
                key={user.id} 
                  icon={<User className="h-5 w-5 text-green-600" />}
                  title={user.full_name}
                  description={`New ${user.role.join(', ')} account created`}
                  time="Recent signup"
                  status="success"
                />
            ))
          ) : (
            <div className="text-center py-8">
              <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No recent users</p>
            </div>
          )}
        </div>
      </div>
                </div>
                </div>
  );
};

export default AdminDashboard; 