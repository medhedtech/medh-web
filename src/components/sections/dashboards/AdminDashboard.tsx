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
import { IAdminDashboardStatsResponse } from '@/apis/admin/admin.api';

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
  <Link href={href}>
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          {icon}
        </div>
        {badge && (
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">
            {badge}
          </span>
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  </Link>
);

// Analytics Card Component
const AnalyticsCard = ({ title, value, change, icon, color, loading }: {
  title: string;
  value: string;
  change?: string;
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
}) => (
  <div className={`${color} rounded-xl p-6 border border-gray-200 dark:border-gray-700`}>
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        {icon}
      </div>
      {change && !loading && (
        <span className={`text-sm font-semibold ${change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {change}
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
        </>
      )}
    </div>
  </div>
);

// Recent Activity Item Component
const RecentActivityItem = ({ icon, title, description, time, status }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  status: 'success' | 'warning' | 'error' | 'info';
}) => (
  <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      {icon}
    </div>
    <div className="flex-1">
      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h4>
      <p className="text-xs text-gray-600 dark:text-gray-400">{description}</p>
    </div>
    <div className="text-right">
      <p className="text-xs text-gray-500 dark:text-gray-400">{time}</p>
      <span className={`inline-block w-2 h-2 rounded-full mt-1 ${
        status === 'success' ? 'bg-green-500' :
        status === 'warning' ? 'bg-yellow-500' :
        status === 'error' ? 'bg-red-500' : 'bg-blue-500'
      }`}></span>
    </div>
  </div>
);

// Utility functions
const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

const formatRating = (rating: number): string => {
  return `${rating.toFixed(1)}/5`;
};

const formatTrend = (change: number): string => {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
};

const AdminDashboard: React.FC = () => {
  // Use context if available from AdminDashboardLayout
  const dashboardContext = useContext(AdminDashboardContext);
  
  // State for dashboard stats
  const [dashboardStats, setDashboardStats] = useState<IAdminDashboardStatsResponse | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true);
      setStatsError(null);
      
      console.log('🔍 Fetching dashboard stats...');
      const response = await adminDashboardApi.getDashboardStats();
      console.log('✅ Dashboard stats response:', response);
      
      if (response.success && response.data) {
        setDashboardStats(response.data.data);
      } else {
        setStatsError(response.message || 'Failed to fetch dashboard stats');
      }
    } catch (error) {
      console.error('❌ Error fetching dashboard stats:', error);
      setStatsError('Failed to fetch dashboard stats');
    } finally {
      setStatsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    console.log('🚀 AdminDashboard component mounted');
    console.log('🔐 Auth token check:', typeof window !== 'undefined' ? localStorage.getItem('token') ? 'Token found' : 'No token' : 'SSR');
    
    fetchDashboardStats();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back! Here's what's happening with your platform.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link 
            href="/dashboards/admin2" 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium flex items-center"
          >
            <BarChart className="h-4 w-4 mr-2" />
            Advanced Dashboard
          </Link>
        </div>
      </div>

      {/* Platform Status Banner - Replacing the red notification */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Platform Status</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">All systems operational • Last updated: {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">99.9%</div>
              <div className="text-gray-500 dark:text-gray-400">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">2.3s</div>
              <div className="text-gray-500 dark:text-gray-400">Avg Response</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">1.2K</div>
              <div className="text-gray-500 dark:text-gray-400">Active Users</div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <AnalyticsCard
          title="Total Students"
          value={
            statsLoading
              ? "Loading..."
              : dashboardStats && dashboardStats.totalStudents && typeof dashboardStats.totalStudents.total === 'number'
                ? formatNumber(dashboardStats.totalStudents.total)
                : "0"
          }
          change={
            statsLoading
              ? ""
              : dashboardStats && dashboardStats.totalStudents && typeof dashboardStats.totalStudents.changes?.monthly?.change === 'number'
                ? formatTrend(dashboardStats.totalStudents.changes.monthly.change)
                : ""
          }
          icon={<Users className="h-5 h-5 text-blue-600" />}
          color="bg-blue-50 dark:bg-blue-900/20"
          loading={statsLoading}
        />
        
        <AnalyticsCard
          title="Active Courses"
          value={
            statsLoading
              ? "Loading..."
              : dashboardStats && dashboardStats.activeCourses && typeof dashboardStats.activeCourses.total === 'number'
                ? formatNumber(dashboardStats.activeCourses.total)
                : "0"
          }
          change={
            statsLoading
              ? ""
              : dashboardStats && dashboardStats.activeCourses && typeof dashboardStats.activeCourses.changes?.monthly?.change === 'number'
                ? formatTrend(dashboardStats.activeCourses.changes.monthly.change)
                : ""
          }
          icon={<BookOpen className="h-5 h-5 text-purple-600" />}
          color="bg-purple-50 dark:bg-purple-900/20"
          loading={statsLoading}
        />
        
        <AnalyticsCard
          title="Total Revenue"
          value={
            statsLoading
              ? "Loading..."
              : dashboardStats && dashboardStats.monthlyRevenue && typeof dashboardStats.monthlyRevenue.total === 'number'
                ? formatCurrency(dashboardStats.monthlyRevenue.total)
                : "₹0"
          }
          change={
            statsLoading
              ? ""
              : dashboardStats && dashboardStats.monthlyRevenue && typeof dashboardStats.monthlyRevenue.changes?.monthly?.change === 'number'
                ? formatTrend(dashboardStats.monthlyRevenue.changes.monthly.change)
                : ""
          }
          icon={<CreditCard className="h-5 h-5 text-green-600" />}
          color="bg-green-50 dark:bg-green-900/20"
          loading={statsLoading}
        />
        
        <AnalyticsCard
          title="Completion Rate"
          value={
            statsLoading
              ? "Loading..."
              : dashboardStats && dashboardStats.completionRate && typeof dashboardStats.completionRate.total === 'number'
                ? formatPercentage(dashboardStats.completionRate.total)
                : "0%"
          }
          change=""
          icon={<Target className="h-5 h-5 text-green-600" />}
          color="bg-green-50 dark:bg-green-900/20"
          loading={statsLoading}
        />

        <AnalyticsCard
          title="Student Satisfaction"
          value={
            statsLoading
              ? "Loading..."
              : dashboardStats && dashboardStats.studentSatisfaction && typeof dashboardStats.studentSatisfaction.total === 'number'
                ? formatRating(dashboardStats.studentSatisfaction.total)
                : "0/5"
          }
          change=""
          icon={<Star className="h-5 h-5 text-yellow-600" />}
          color="bg-yellow-50 dark:bg-yellow-900/20"
          loading={statsLoading}
        />

        <AnalyticsCard
          title="Instructor Rating"
          value={
            statsLoading
              ? "Loading..."
              : dashboardStats && dashboardStats.instructorRating && typeof dashboardStats.instructorRating.total === 'number'
                ? formatRating(dashboardStats.instructorRating.total)
                : "0/5"
          }
          change=""
          icon={<Award className="h-5 h-5 text-purple-600" />}
          color="bg-purple-50 dark:bg-purple-900/20"
          loading={statsLoading}
        />
      </div>
      
      {/* Error Display */}
      {statsError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
            <p className="text-sm text-red-600 dark:text-red-300">{statsError}</p>
          </div>
        </div>
      )}

      {/* Quick Actions Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
          <Settings className="h-5 w-5 text-gray-500" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/dashboards/admin-dashboard?view=add-course" className="group">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/20 rounded-lg border border-blue-200/50 dark:border-blue-800/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <PlusCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Add Course</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Create new course</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/dashboards/admin-dashboard?view=admin-studentmange" className="group">
            <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/20 rounded-lg border border-green-200/50 dark:border-green-800/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Manage Students</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">View & manage students</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/dashboards/admin/online-class/live/batch-management" className="group">
            <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/20 rounded-lg border border-purple-200/50 dark:border-purple-800/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Batch Management</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Manage course batches</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/dashboards/admin/analytics" className="group">
            <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/20 rounded-lg border border-amber-200/50 dark:border-amber-800/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Analytics</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">View detailed analytics</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/dashboards/admin-dashboard?view=admin-instuctoremange" className="group">
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/20 rounded-lg border border-indigo-200/50 dark:border-indigo-800/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <Award className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Manage Instructors</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Add or edit instructors</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/dashboards/admin/payments" className="group">
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/20 rounded-lg border border-emerald-200/50 dark:border-emerald-800/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Payment Management</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">View payment history</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/dashboards/admin/content" className="group">
            <div className="p-4 bg-gradient-to-r from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-900/20 rounded-lg border border-rose-200/50 dark:border-rose-800/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Content Management</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Manage announcements & blogs</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/dashboards/admin/support" className="group">
            <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/20 rounded-lg border border-orange-200/50 dark:border-orange-800/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Support Tickets</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Handle customer support</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
