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
  MoreHorizontal
} from "lucide-react";
import { AdminDashboardContext } from "./AdminDashboardLayout";
import Link from "next/link";
import ApiPanel from "./ApiPanel";
import adminApi, { adminDashboardApi } from "@/apis/admin/admin.api";
import { IAdminDashboardStats, IRecentEnrollment, IRecentUser } from '@/apis/admin/admin.api';
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

// Smart API Management Hubs - Combined similar operations for better UX
const SMART_API_HUBS = [
  // 👥 USER MANAGEMENT HUB - Combines 5 user-related APIs
  {
    key: "userManagementHub",
    title: "User Management Hub",
    icon: <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    category: "Core Management",
    description: "Complete user administration including lockouts, security, and bulk operations",
    primaryEndpoint: "/auth/users",
    badgeCount: 5,
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    actions: [
      {
        key: "getAllUsers",
        title: "View All Users",
        method: "GET",
        endpoint: "/auth/users",
        description: "Browse all users with advanced filtering and search",
        icon: <Users className="h-4 w-4" />,
        fetcher: (params?: { page?: number; limit?: number; role?: string; status?: string; search?: string }) => adminApi.auth.getAllUsers(params as any),
        isPrimary: true,
        defaultParams: { page: 1, limit: 20 }
      },
      {
        key: "getLockedAccounts",
        title: "Manage Lockouts",
        method: "GET",
        endpoint: "/auth/locked-accounts",
        description: "View and manage locked user accounts",
        icon: <Shield className="h-4 w-4" />,
        fetcher: (params?: { page?: number; limit?: number; lockout_reason?: string }) => adminApi.auth.getLockedAccounts(params),
        defaultParams: { page: 1, limit: 10 }
      },
      {
        key: "unlockAccount",
        title: "Unlock Account",
        method: "POST",
        endpoint: "/auth/unlock-account/:userId",
        description: "Unlock specific user account",
        icon: <User className="h-4 w-4" />,
        fetcher: (userId: string, resetAttempts: boolean = false) => adminApi.auth.unlockAccount(userId, resetAttempts),
        requiresInput: true,
        inputFields: [{ name: "userId", type: "text", placeholder: "User ID", required: true }]
      },
      {
        key: "unlockAllAccounts", 
        title: "Bulk Unlock",
        method: "POST",
        endpoint: "/auth/unlock-all-accounts",
        description: "Unlock all locked accounts at once",
        icon: <Users className="h-4 w-4" />,
        fetcher: (resetAttempts: boolean = false) => adminApi.auth.unlockAllAccounts(resetAttempts),
        isDestructive: true
      },
      {
        key: "getLockoutStats",
        title: "Security Analytics",
        method: "GET", 
        endpoint: "/auth/lockout-stats",
        description: "View comprehensive security statistics",
        icon: <BarChart className="h-4 w-4" />,
        fetcher: () => adminApi.auth.getLockoutStats()
      }
    ]
  },

  // 📚 BATCH OPERATIONS CENTER - Combines 7 batch-related APIs
  {
    key: "batchOperationsCenter",
    title: "Batch Operations Center", 
    icon: <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
    category: "Core Management",
    description: "Complete batch management including creation, assignments, and student operations",
    primaryEndpoint: "/batches",
    badgeCount: 7,
    badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    actions: [
      {
        key: "getAllBatches",
        title: "View All Batches",
        method: "GET",
        endpoint: "/batches", 
        description: "Browse all batches with filtering and sorting",
        icon: <BookOpen className="h-4 w-4" />,
        fetcher: (params?: { page?: number; limit?: number; status?: string; course_id?: string; instructor_id?: string; search?: string }) => adminApi.batch.getAllBatches(params as any),
        isPrimary: true,
        defaultParams: { page: 1, limit: 20 }
      },
      {
        key: "getBatchById",
        title: "Batch Details",
        method: "GET",
        endpoint: "/batches/:batchId",
        description: "Get detailed batch information",
        icon: <FileText className="h-4 w-4" />,
        fetcher: (batchId: string) => adminApi.batch.getBatchById(batchId),
        requiresInput: true,
        inputFields: [{ name: "batchId", type: "text", placeholder: "Batch ID", required: true }]
      },
      {
        key: "createBatch",
        title: "Create New Batch",
        method: "POST",
        endpoint: "/batches/courses/:courseId/batches",
        description: "Create a new batch for a course",
        icon: <PlusCircle className="h-4 w-4" />,
        fetcher: (courseId: string, batchData: any) => adminApi.batch.createBatch(courseId, batchData),
        requiresInput: true,
        inputFields: [
          { name: "courseId", type: "text", placeholder: "Course ID", required: true },
          { name: "batchName", type: "text", placeholder: "Batch Name", required: true },
          { name: "capacity", type: "number", placeholder: "Capacity", required: true }
        ]
      },
      {
        key: "assignInstructor",
        title: "Assign Instructor",
        method: "PUT",
        endpoint: "/batches/:batchId/assign-instructor/:instructorId",
        description: "Assign instructor to batch",
        icon: <UserPlus className="h-4 w-4" />,
        fetcher: (batchId: string, instructorId: string) => adminApi.batch.assignInstructor(batchId, instructorId),
        requiresInput: true,
        inputFields: [
          { name: "batchId", type: "text", placeholder: "Batch ID", required: true },
          { name: "instructorId", type: "text", placeholder: "Instructor ID", required: true }
        ]
      },
      {
        key: "addStudentToBatch",
        title: "Add Student",
        method: "POST",
        endpoint: "/batches/:batchId/students",
        description: "Enroll student in batch",
        icon: <UserPlus className="h-4 w-4" />,
        fetcher: (batchId: string, studentId: string) => adminApi.batch.addStudentToBatch(batchId, studentId),
        requiresInput: true,
        inputFields: [
          { name: "batchId", type: "text", placeholder: "Batch ID", required: true },
          { name: "studentId", type: "text", placeholder: "Student ID", required: true }
        ]
      },
      {
        key: "transferStudent",
        title: "Transfer Student",
        method: "POST",
        endpoint: "/batches/:batchId/students/:studentId/transfer",
        description: "Move student between batches",
        icon: <ArrowRight className="h-4 w-4" />,
        fetcher: (batchId: string, studentId: string, targetBatchId: string) => adminApi.batch.transferStudent(batchId, studentId, targetBatchId),
        requiresInput: true,
        inputFields: [
          { name: "batchId", type: "text", placeholder: "Source Batch ID", required: true },
          { name: "studentId", type: "text", placeholder: "Student ID", required: true },
          { name: "targetBatchId", type: "text", placeholder: "Target Batch ID", required: true }
        ]
      }
    ]
  },

  // 📈 ANALYTICS DASHBOARD - Combines 5 analytics APIs
  {
    key: "analyticsDashboard",
    title: "Analytics Dashboard",
    icon: <BarChart3 className="h-6 w-6 text-amber-600 dark:text-amber-400" />,
    category: "Analytics & Reports", 
    description: "Comprehensive analytics including batch performance, capacity, and instructor metrics",
    primaryEndpoint: "/batches/analytics/dashboard",
    badgeCount: 5,
    badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    actions: [
      {
        key: "batchAnalytics",
        title: "Batch Analytics",
        method: "GET",
        endpoint: "/batches/analytics/dashboard",
        description: "Comprehensive batch performance dashboard",
        icon: <BarChart3 className="h-4 w-4" />,
        fetcher: () => adminApi.batchAnalytics.getDashboardAnalytics(),
        isPrimary: true
      },
      {
        key: "statusDistribution", 
        title: "Status Distribution",
        method: "GET",
        endpoint: "/batches/analytics/status-distribution",
        description: "Batch status breakdown and trends",
        icon: <PieChart className="h-4 w-4" />,
        fetcher: () => adminApi.batchAnalytics.getStatusDistribution()
      },
      {
        key: "instructorWorkload",
        title: "Instructor Workload",
        method: "GET",
        endpoint: "/batches/analytics/instructor-workload", 
        description: "Instructor performance and workload analysis",
        icon: <Activity className="h-4 w-4" />,
        fetcher: () => adminApi.batchAnalytics.getInstructorWorkload()
      },
      {
        key: "capacityAnalytics",
        title: "Capacity Analytics",
        method: "GET",
        endpoint: "/batches/analytics/capacity",
        description: "Batch capacity and utilization metrics",
        icon: <Target className="h-4 w-4" />,
        fetcher: () => adminApi.batchAnalytics.getCapacityAnalytics()
      },
      {
        key: "instructorAnalysis",
        title: "Instructor Analysis", 
        method: "GET",
        endpoint: "/batches/analytics/instructor-analysis",
        description: "Deep dive instructor performance analysis",
        icon: <Award className="h-4 w-4" />,
        fetcher: () => adminApi.batchAnalytics.getInstructorAnalysis()
      }
    ]
  },

  // 📢 COMMUNICATION SUITE - Combines 4 announcement APIs
  {
    key: "communicationSuite",
    title: "Communication Suite",
    icon: <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-400" />,
    category: "Communication",
    description: "Manage announcements, create new communications, and track engagement analytics",
    primaryEndpoint: "/announcements",
    badgeCount: 4,
    badgeColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    actions: [
      {
        key: "getAllAnnouncements",
        title: "View Announcements",
        method: "GET",
        endpoint: "/announcements",
        description: "Browse all announcements with filtering",
        icon: <MessageSquare className="h-4 w-4" />,
        fetcher: (params?: { page?: number; limit?: number; type?: string; priority?: string; status?: string; search?: string }) => adminApi.announcement.getAllAnnouncements(params as any),
        isPrimary: true,
        defaultParams: { page: 1, limit: 20 }
      },
      {
        key: "createAnnouncement",
        title: "Create Announcement",
        method: "POST",
        endpoint: "/announcements",
        description: "Create new announcement for target audiences",
        icon: <PlusCircle className="h-4 w-4" />,
        fetcher: (announcementData: any) => adminApi.announcement.createAnnouncement(announcementData),
        requiresInput: true,
        inputFields: [
          { name: "title", type: "text", placeholder: "Announcement Title", required: true },
          { name: "content", type: "textarea", placeholder: "Announcement Content", required: true },
          { name: "type", type: "select", options: ["course", "system", "maintenance", "feature", "event", "general"], required: true }
        ]
      },
      {
        key: "getAnnouncementById",
        title: "Announcement Details",
        method: "GET",
        endpoint: "/announcements/:id",
        description: "Get specific announcement details",
        icon: <FileText className="h-4 w-4" />,
        fetcher: (id: string) => adminApi.announcement.getAnnouncementById(id),
        requiresInput: true,
        inputFields: [{ name: "id", type: "text", placeholder: "Announcement ID", required: true }]
      },
      {
        key: "announcementAnalytics",
        title: "Analytics",
        method: "GET",
        endpoint: "/announcements/analytics",
        description: "Announcement performance and engagement metrics",
        icon: <BarChart className="h-4 w-4" />,
        fetcher: () => adminApi.announcement.getAnnouncementAnalytics()
      }
    ]
  },

  // 📝 FORMS MANAGER - Combines 5 form APIs
  {
    key: "formsManager",
    title: "Forms Manager",
    icon: <FormInput className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
    category: "Forms & Data",
    description: "Complete form management including submissions, analytics, and data export",
    primaryEndpoint: "/forms",
    badgeCount: 5,
    badgeColor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    actions: [
      {
        key: "getAllForms",
        title: "View All Forms",
        method: "GET", 
        endpoint: "/forms",
        description: "Browse all forms with filtering and search",
        icon: <FormInput className="h-4 w-4" />,
        fetcher: (params?: { page?: number; limit?: number; form_type?: string; status?: string; search?: string }) => adminApi.form.getAllForms(params as any),
        isPrimary: true,
        defaultParams: { page: 1, limit: 20 }
      },
      {
        key: "getFormSubmissions",
        title: "View Submissions",
        method: "GET",
        endpoint: "/forms/submissions",
        description: "Browse form submissions with comprehensive filtering",
        icon: <Database className="h-4 w-4" />,
        fetcher: (params?: { page?: number; limit?: number; form_type?: string; status?: string; priority?: string; search?: string; date_from?: string; date_to?: string }) => adminApi.form.getFormSubmissions(params as any),
        defaultParams: { page: 1, limit: 20 }
      },
      {
        key: "getFormById",
        title: "Form Details",
        method: "GET",
        endpoint: "/forms/:id",
        description: "Get detailed form information",
        icon: <FileText className="h-4 w-4" />,
        fetcher: (id: string) => adminApi.form.getFormById(id),
        requiresInput: true,
        inputFields: [{ name: "id", type: "text", placeholder: "Form ID", required: true }]
      },
      {
        key: "formAnalytics",
        title: "Form Analytics",
        method: "GET",
        endpoint: "/forms/analytics", 
        description: "Form performance and conversion analytics",
        icon: <LineChart className="h-4 w-4" />,
        fetcher: (formId?: string, dateRange?: { start_date: string; end_date: string }) => adminApi.form.getFormAnalytics(formId, dateRange)
      },
      {
        key: "exportForms",
        title: "Export Data",
        method: "GET",
        endpoint: "/forms/export",
        description: "Export form data in multiple formats",
        icon: <FileText className="h-4 w-4" />,
        fetcher: (format: 'csv' | 'excel' | 'json' = 'csv', filters?: any) => adminApi.form.exportForms(format, filters),
        defaultParams: { format: 'csv' }
      }
    ]
  },

  // 🎓 COURSE ADMINISTRATION - Combines 3 course APIs
  {
    key: "courseAdministration",
    title: "Course Administration",
    icon: <BookOpen className="h-6 w-6 text-pink-600 dark:text-pink-400" />,
    category: "Core Management",
    description: "Complete course management including creation, editing, and detailed views",
    primaryEndpoint: "/tcourse/all",
    badgeCount: 3,
    badgeColor: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    actions: [
      {
        key: "getAllCourses",
        title: "View All Courses",
        method: "GET",
        endpoint: "/tcourse/all",
        description: "Browse all courses with filtering and search",
        icon: <BookOpen className="h-4 w-4" />,
        fetcher: (params?: { page?: number; limit?: number; status?: string; category?: string; search?: string }) => adminApi.course.getAllCourses(params),
        isPrimary: true,
        defaultParams: { page: 1, limit: 20 }
      },
      {
        key: "createCourse",
        title: "Create Course",
        method: "POST",
        endpoint: "/courses/create",
        description: "Create new course with comprehensive details",
        icon: <PlusCircle className="h-4 w-4" />,
        fetcher: (courseData: any) => adminApi.course.createCourse(courseData),
        requiresInput: true,
        inputFields: [
          { name: "course_title", type: "text", placeholder: "Course Title", required: true },
          { name: "course_description", type: "textarea", placeholder: "Course Description", required: true },
          { name: "course_category", type: "text", placeholder: "Category", required: true },
          { name: "course_fee", type: "number", placeholder: "Course Fee" }
        ]
      },
      {
        key: "getCourseById",
        title: "Course Details",
        method: "GET",
        endpoint: "/courses/:id",
        description: "Get detailed course information",
        icon: <FileText className="h-4 w-4" />,
        fetcher: (id: string) => adminApi.course.getCourseById(id),
        requiresInput: true,
        inputFields: [{ name: "id", type: "text", placeholder: "Course ID", required: true }]
      }
    ]
  },

  // 🛠️ SYSTEM TOOLS - Specialized operations
  {
    key: "systemTools",
    title: "System Tools",
    icon: <Settings className="h-6 w-6 text-gray-600 dark:text-gray-400" />,
    category: "System Tools",
    description: "System administration tools including profiles, Zoom integration, and dashboard stats",
    primaryEndpoint: "/profile/admin/progress-stats",
    badgeCount: 4,
    badgeColor: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    actions: [
      {
        key: "adminProgressStats",
        title: "Admin Progress Stats",
        method: "GET",
        endpoint: "/profile/admin/progress-stats",
        description: "Admin-specific progress and performance statistics",
        icon: <TrendingUp className="h-4 w-4" />,
        fetcher: () => adminApi.profile.getAdminProgressStats(),
        isPrimary: true
      },
      {
        key: "dashboardStats",
        title: "Dashboard Statistics",
        method: "GET", 
        endpoint: "/admin/dashboard-stats",
        description: "Unified admin dashboard statistics and metrics",
        icon: <BarChart className="h-4 w-4" />,
        fetcher: () => adminApi.dashboard.getDashboardStats()
      },
      {
        key: "restoreProfile",
        title: "Restore Profile",
        method: "POST",
        endpoint: "/profile/:userId/restore",
        description: "Restore soft-deleted user profile",
        icon: <User className="h-4 w-4" />,
        fetcher: (userId: string) => adminApi.profile.restoreProfile(userId),
        requiresInput: true,
        inputFields: [{ name: "userId", type: "text", placeholder: "User ID", required: true }]
      },
      {
        key: "createZoomMeeting",
        title: "Create Zoom Meeting",
        method: "POST",
        endpoint: "/batches/:batchId/schedule/:sessionId/zoom-meeting",
        description: "Create Zoom meeting for batch session",
        icon: <Calendar className="h-4 w-4" />,
        fetcher: (batchId: string, sessionId: string, meetingData: any) => adminApi.zoom.createZoomMeeting(batchId, sessionId, meetingData),
        requiresInput: true,
        inputFields: [
          { name: "batchId", type: "text", placeholder: "Batch ID", required: true },
          { name: "sessionId", type: "text", placeholder: "Session ID", required: true },
          { name: "topic", type: "text", placeholder: "Meeting Topic", required: true }
        ]
      }
    ]
  }
];

const Admin2Dashboard: React.FC = () => {
  const dashboardContext = useContext(AdminDashboardContext);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [apiPanel, setApiPanel] = useState<{ open: boolean; hub: typeof SMART_API_HUBS[0] | null; selectedAction?: any }>({ open: false, hub: null });
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // New state for dashboard stats
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

  // Reusable function to fetch recent enrollments
  const fetchRecentEnrollments = async () => {
    setEnrollmentsLoading(true);
    setEnrollmentsError(null);
    try {
      console.log('🔍 Fetching recent enrollments from:', '/admin/recent-enrollments');
      const response = await adminDashboardApi.getRecentEnrollments({ limit: 5 });
      console.log('📊 Recent enrollments raw response:', response);
      
      // Handle nested response structure: { status: 'success', data: { success: true, data: [...] } }
      let actualData = null;
      let isSuccess = false;

      // Check for nested structure first
      if ((response as any)?.data?.success === true && (response as any)?.data?.data) {
        actualData = (response as any).data.data;
        isSuccess = true;
        console.log('📊 Found nested data structure:', actualData.length, 'items');
      }
      // Fallback to direct structure
      else if ((response as any)?.success === true && (response as any)?.data) {
        actualData = (response as any).data;
        isSuccess = true;
        console.log('📊 Found direct data structure:', actualData.length, 'items');
      }
      
      if (isSuccess && Array.isArray(actualData)) {
        console.log('✅ Setting enrollments data:', actualData.length, 'items');
        setRecentEnrollments(actualData);
      } else if (isSuccess && actualData && actualData.length === 0) {
        console.log('📊 API returned empty array');
        setRecentEnrollments([]);
      } else {
        console.warn('⚠️ Unexpected response structure or no data:', response);
        setRecentEnrollments([]);
      }
    } catch (error: any) {
      console.error('❌ Error fetching recent enrollments:', error);
      console.error('❌ Error details:', {
        message: error.message,
        status: error.status,
        statusText: error.statusText,
        response: error.response?.data || error.response
      });
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
      console.log('🔍 Fetching recent users from:', '/admin/recent-users');
      const response = await adminDashboardApi.getRecentUsers({ limit: 5 });
      console.log('👥 Recent users raw response:', response);
      
      // Handle nested response structure: { status: 'success', data: { success: true, data: [...] } }
      let actualData = null;
      let isSuccess = false;

      // Check for nested structure first
      if ((response as any)?.data?.success === true && (response as any)?.data?.data) {
        actualData = (response as any).data.data;
        isSuccess = true;
        console.log('👥 Found nested data structure:', actualData.length, 'items');
      }
      // Fallback to direct structure
      else if ((response as any)?.success === true && (response as any)?.data) {
        actualData = (response as any).data;
        isSuccess = true;
        console.log('👥 Found direct data structure:', actualData.length, 'items');
      }
      
      if (isSuccess && Array.isArray(actualData)) {
        console.log('✅ Setting users data:', actualData.length, 'items');
        setRecentUsers(actualData);
      } else if (isSuccess && actualData && actualData.length === 0) {
        console.log('👥 API returned empty array');
        setRecentUsers([]);
      } else {
        console.warn('⚠️ Unexpected response structure or no data:', response);
        setRecentUsers([]);
      }
    } catch (error: any) {
      console.error('❌ Error fetching recent users:', error);
      console.error('❌ Error details:', {
        message: error.message,
        status: error.status,
        statusText: error.statusText,
        response: error.response?.data || error.response
      });
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

  // Helper function to get trend color
  const getTrendColor = (change: number): string => {
    return change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  };

  // Helper function to format trend
  const formatTrend = (change: number): string => {
    return change >= 0 ? `+${change}%` : `${change}%`;
  };
  
  // MOCK DATA for Recent Enrollments
  const MOCK_RECENT_ENROLLMENTS = [
    {
      enrollment_id: "685e907b73798aa17a99cb6f",
      student: {
        id: "67cfe3a9a50dbb995b4d94da",
        name: "abhi",
        email: "abhijha903@gmail.com"
      },
      course: {
        id: "67c195368a56e7688ddcfe4d",
        title: "Digital Marketing with Data Analytics"
      },
      payment: {
        amount: 1000,
        currency: "INR",
        status: "paid",
        date: "2025-06-27T12:37:15.217Z",
        method: null,
        transaction_id: null
      },
      enrollment_date: "2025-06-27T12:37:15.217Z"
    },
    {
      enrollment_id: "685e865f286afe15fd58f441",
      student: {
        id: "684a3a37280c1b2a1188c1f7",
        name: "Neeraj Saxena",
        email: "neeraj0701@gmail.com"
      },
      course: {
        id: "67bd596b8a56e7688dd02274",
        title: "Personality Development"
      },
      payment: {
        amount: 0,
        currency: "USD",
        status: "unpaid",
        date: "2025-06-27T11:54:07.129Z",
        method: null,
        transaction_id: null
      },
      enrollment_date: "2025-06-27T11:54:07.129Z"
    },
    {
      enrollment_id: "685e865f286afe15fd58f43f",
      student: {
        id: "682acfbdde37f32507d58e0e",
        name: "Neeraj Narain",
        email: "neerajnarain07@gmail.com"
      },
      course: {
        id: "67bd596b8a56e7688dd02274",
        title: "Personality Development"
      },
      payment: {
        amount: 0,
        currency: "USD",
        status: "unpaid",
        date: "2025-06-27T11:54:07.113Z",
        method: null,
        transaction_id: null
      },
      enrollment_date: "2025-06-27T11:54:07.113Z"
    },
    {
      enrollment_id: "685e8268fc2c157621120aac",
      student: {
        id: "67b9713483f0a9324fe90fdb",
        name: "Abhishek Jha",
        email: "Abhijha903@gmail.com"
      },
      course: {
        id: "67c195368a56e7688ddcfe4d",
        title: "Digital Marketing with Data Analytics"
      },
      payment: {
        amount: 0,
        currency: "INR",
        status: "unpaid",
        date: "2025-06-27T11:37:12.195Z",
        method: null,
        transaction_id: null
      },
      enrollment_date: "2025-06-27T11:37:12.195Z"
    },
    {
      enrollment_id: "685e7e05fc2c15762111ff12",
      student: {
        id: "67b9713483f0a9324fe90fdb",
        name: "Abhishek Jha",
        email: "Abhijha903@gmail.com"
      },
      course: {
        id: "67c195368a56e7688ddcfe4d",
        title: "Digital Marketing with Data Analytics"
      },
      payment: {
        amount: 0,
        currency: "INR",
        status: "unpaid",
        date: "2025-06-27T11:18:29.066Z",
        method: null,
        transaction_id: null
      },
      enrollment_date: "2025-06-27T11:18:29.066Z"
    }
  ];

  // MOCK DATA for Recent Users
  const MOCK_RECENT_USERS = [
    {
      id: "684a3a37280c1b2a1188c1f7",
      full_name: "Neeraj Saxena",
      email: "neeraj0701@gmail.com",
      role: ["student"]
    },
    {
      id: "684685c38c62bc0962d91a77",
      full_name: "nishita francis",
      email: "nfrancis277@gmail.com",
      role: ["student"]
    },
    {
      id: "684527bc36a6426ce309c435",
      full_name: "Abhishek Jha",
      email: "lesaxi6654@3dboxer.com",
      role: ["student"]
    },
    {
      id: "683d92fa704df1f00490a9f2",
      full_name: "vikash gup",
      email: "superad@medh.com",
      role: ["instructor"]
    },
    {
      id: "683d4601910b631cae39a2de",
      full_name: "Test Student",
      email: "student@test.com",
      role: ["student"]
    }
  ];

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
            title="Create New Course"
            href="/dashboards/admin/courses/create"
            color="hover:bg-emerald-50 dark:hover:bg-emerald-900/10"
          />
          <QuickActionButton 
            icon={<Edit className="h-6 w-6 text-orange-600 dark:text-orange-400" />}
            title="Manage Courses"
            href="/dashboards/admin/courses/manage"
            color="hover:bg-orange-50 dark:hover:bg-orange-900/10"
          />
          <QuickActionButton 
            icon={<UserPlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
            title="Enroll Student"
            href="http://localhost:3000/dashboards/admin/students/"
            color="hover:bg-blue-50 dark:hover:bg-blue-900/10"
          />
          <QuickActionButton 
            icon={<Edit className="h-6 w-6 text-purple-600 dark:text-purple-400" />}
            title="Manage Instructors"
            href="http://localhost:3000/dashboards/admin/Instuctoremange/"
            color="hover:bg-purple-50 dark:hover:bg-purple-900/10"
          />
          <QuickActionButton 
            icon={<Calendar className="h-6 w-6 text-amber-600 dark:text-amber-400" />}
            title="Live Classes"
            href="http://localhost:3000/dashboards/admin/online-class/"
            color="hover:bg-amber-50 dark:hover:bg-amber-900/10"
          />
          <QuickActionButton 
            icon={<Calendar className="h-6 w-6 text-amber-700 dark:text-amber-300" />}
            title="Batch Management"
            href="http://localhost:3000/dashboards/admin/online-class/live/batch-management/"
            color="hover:bg-amber-100 dark:hover:bg-amber-800/10"
          />
          <QuickActionButton 
            icon={<Award className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
            title="Course Pricing"
            href="http://localhost:3000/dashboards/admin/course-fee/"
            color="hover:bg-indigo-50 dark:hover:bg-indigo-900/10"
            badge="5"
          />
          <QuickActionButton 
            icon={<Settings className="h-6 w-6 text-gray-600 dark:text-gray-400" />}
            title="Blog Management"
            href="http://localhost:3000/dashboards/admin/blogs/"
            color="hover:bg-gray-50 dark:hover:bg-gray-900/10"
          />
          <QuickActionButton 
            icon={<Megaphone className="h-6 w-6 text-green-600 dark:text-green-400" />}
            title="Send Announcements"
            href="http://localhost:3000/dashboards/admin/announcements/"
            color="hover:bg-green-50 dark:hover:bg-green-900/10"
          />
          <QuickActionButton 
            icon={<Settings className="h-6 w-6 text-pink-600 dark:text-pink-400" />}
            title="Course Categories"
            href="/dashboards/admin/course-categories"
            color="hover:bg-pink-50 dark:hover:bg-pink-900/10"
          />
        </div>
      </div>

      {/* Recent Enrollments Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Enrollments</h2>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => {
                setEnrollmentsLoading(true);
                setEnrollmentsError(null);
                fetchRecentEnrollments();
              }}
              disabled={enrollmentsLoading}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {enrollmentsLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {enrollmentsError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">!</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error Loading Recent Enrollments</h3>
                <p className="text-sm text-red-600 dark:text-red-300">{enrollmentsError}</p>
              </div>
              <button
                onClick={() => {
                  setEnrollmentsError(null);
                  setEnrollmentsLoading(true);
                  fetchRecentEnrollments();
                }}
                className="ml-auto px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Enrollments List */}
        <div className="space-y-4">
          {enrollmentsLoading ? (
            // Loading skeleton
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600"></div>
                  <div>
                    <div className="w-32 h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="w-24 h-3 bg-gray-200 dark:bg-gray-600 rounded mb-1"></div>
                    <div className="w-20 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-16 h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="w-12 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
                </div>
              </div>
            ))
          ) : recentEnrollments.length > 0 ? (
            recentEnrollments.map((enrollment) => (
              <motion.div 
                key={enrollment.enrollment_id} 
                className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {/* No user_image in API, fallback to initials */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {enrollment.student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{enrollment.student.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{enrollment.course.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {enrollment.payment ? (
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          enrollment.payment.status === "paid" 
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                            : enrollment.payment.status === "pending"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            : enrollment.payment.status === "failed"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                        }`}>
                          {enrollment.payment.status.charAt(0).toUpperCase() + enrollment.payment.status.slice(1)}
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-full font-medium bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400">
                          No Payment
                        </span>
                      )}
                      {enrollment.platform && (
                        <span className="text-xs text-gray-500 capitalize">{enrollment.platform}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {enrollment.payment ? (
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: enrollment.payment.currency || 'INR',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(enrollment.payment.amount)}
                    </p>
                  ) : (
                    <p className="font-semibold text-gray-500 dark:text-gray-400">
                      Free Course
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    {new Date(enrollment.enrollment_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No recent enrollments found</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">New enrollments will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent User Signups Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent User Signups</h2>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => {
                setUsersLoading(true);
                setUsersError(null);
                fetchRecentUsers();
              }}
              disabled={usersLoading}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {usersLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {usersError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">!</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error Loading Recent Users</h3>
                <p className="text-sm text-red-600 dark:text-red-300">{usersError}</p>
              </div>
              <button
                onClick={() => {
                  setUsersError(null);
                  setUsersLoading(true);
                  fetchRecentUsers();
                }}
                className="ml-auto px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Users List */}
        <div className="space-y-4">
          {usersLoading ? (
            // Loading skeleton
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600"></div>
                  <div>
                    <div className="w-32 h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="w-48 h-3 bg-gray-200 dark:bg-gray-600 rounded mb-1"></div>
                    <div className="w-20 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-16 h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="w-12 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
                </div>
              </div>
            ))
          ) : recentUsers.length > 0 ? (
            recentUsers.map((user) => (
              <motion.div 
                key={user.id} 
                className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {/* No user_image in API, fallback to initials */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                      {user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{user.full_name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        user.role.includes('admin') 
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" 
                          : user.role.includes('instructor')
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : user.role.includes('student')
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                      }`}>
                        {user.role.map(r => r.charAt(0).toUpperCase() + r.slice(1)).join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Recent signup</p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No recent user signups found</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">New user registrations will appear here</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Smart Admin API Management Hubs */}
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-blue-100 dark:border-blue-800">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-3 bg-blue-600 rounded-xl">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Smart API Management Hubs</h2>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">Unified management centers with multiple actions</p>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">75% fewer cards</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">100% functionality</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">{SMART_API_HUBS.reduce((acc, hub) => acc + hub.badgeCount, 0)} total APIs</span>
                </div>
              </div>
            </div>
            
            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by:</span>
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm font-medium shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="All">All Categories ({SMART_API_HUBS.length} hubs)</option>
                  {Array.from(new Set(SMART_API_HUBS.map(hub => hub.category))).map(category => {
                    const count = SMART_API_HUBS.filter(hub => hub.category === category).length;
                    return (
                      <option key={category} value={category}>{category} ({count} hubs)</option>
                    );
                  })}
                </select>
              </div>
              <div className="px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium">
                {selectedCategory === 'All' 
                  ? `${SMART_API_HUBS.reduce((acc, hub) => acc + hub.badgeCount, 0)} APIs Available` 
                  : `${SMART_API_HUBS.filter(hub => hub.category === selectedCategory).reduce((acc, hub) => acc + hub.badgeCount, 0)} APIs in ${selectedCategory}`
                }
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Category Overview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span>Category Overview</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {Array.from(new Set(SMART_API_HUBS.map(hub => hub.category))).map(category => {
              const hubs = SMART_API_HUBS.filter(hub => hub.category === category);
              const totalAPIs = hubs.reduce((acc, hub) => acc + hub.badgeCount, 0);
              const isActive = selectedCategory === category;
              const categoryColors = {
                'Core Management': 'from-blue-500 to-blue-600',
                'Analytics & Reports': 'from-amber-500 to-amber-600',
                'Communication': 'from-green-500 to-green-600',
                'Forms & Data': 'from-indigo-500 to-indigo-600',
                'System Tools': 'from-gray-500 to-gray-600'
              };
              const gradientClass = categoryColors[category as keyof typeof categoryColors] || 'from-gray-500 to-gray-600';
              
              return (
                <motion.button
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`relative p-4 rounded-xl text-left transition-all duration-300 group ${
                    isActive 
                      ? 'bg-white dark:bg-gray-800 shadow-lg ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900' 
                      : 'bg-white dark:bg-gray-800 shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradientClass} rounded-t-xl`}></div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{category}</h4>
                      {isActive && <CheckCircle className="h-4 w-4 text-blue-500" />}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                        <Globe className="h-3 w-3" />
                        <span>{hubs.length} hub{hubs.length !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                        <Activity className="h-3 w-3" />
                        <span>{totalAPIs} API{totalAPIs !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              onClick={() => setSelectedCategory('All')}
              className={`relative p-4 rounded-xl text-left transition-all duration-300 group ${
                selectedCategory === 'All' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg ring-2 ring-green-500 ring-offset-2 dark:ring-offset-gray-900' 
                  : 'bg-white dark:bg-gray-800 shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className={`font-semibold text-sm ${selectedCategory === 'All' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    All Hubs
                  </h4>
                  {selectedCategory === 'All' && <Star className="h-4 w-4 text-white" />}
                </div>
                <div className="space-y-1">
                  <div className={`flex items-center space-x-2 text-xs ${selectedCategory === 'All' ? 'text-green-100' : 'text-gray-600 dark:text-gray-400'}`}>
                    <Globe className="h-3 w-3" />
                    <span>{SMART_API_HUBS.length} total hubs</span>
                  </div>
                  <div className={`flex items-center space-x-2 text-xs ${selectedCategory === 'All' ? 'text-green-100' : 'text-gray-600 dark:text-gray-400'}`}>
                    <Activity className="h-3 w-3" />
                    <span>{SMART_API_HUBS.reduce((acc, hub) => acc + hub.badgeCount, 0)} total APIs</span>
                  </div>
                </div>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Enhanced Smart API Hubs Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <Zap className="h-5 w-5 text-blue-600" />
              <span>
                {selectedCategory === 'All' ? 'All API Hubs' : `${selectedCategory} Hubs`}
              </span>
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                ({SMART_API_HUBS.filter(hub => selectedCategory === 'All' || hub.category === selectedCategory).length} hubs)
              </span>
            </h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {SMART_API_HUBS
              .filter(hub => selectedCategory === 'All' || hub.category === selectedCategory)
              .map((hub, index) => (
              <motion.div
                key={hub.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group overflow-hidden"
              >
                {/* Hub Header with Gradient */}
                <div className="relative p-6 pb-4">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                          {hub.icon}
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-white">{hub.badgeCount}</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {hub.title}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${hub.badgeColor}`}>
                            {hub.category}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {hub.badgeCount} APIs
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hub Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    {hub.description}
                  </p>

                  {/* Primary Endpoint */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <span className="text-xs font-mono text-gray-600 dark:text-gray-300">
                        {hub.primaryEndpoint}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions Preview */}
                <div className="px-6 pb-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                    <Activity className="h-4 w-4" />
                    <span>Available Actions</span>
                  </h4>
                  <div className="space-y-2">
                    {hub.actions.slice(0, 3).map((action, actionIndex) => (
                      <motion.div 
                        key={action.key} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: actionIndex * 0.1 }}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group/action"
                      >
                        <div className="p-1.5 bg-gray-100 dark:bg-gray-600 rounded-lg group-hover/action:scale-110 transition-transform">
                          {action.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              action.method === 'GET' 
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : action.method === 'POST'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                : action.method === 'PUT'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {action.method}
                            </span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {action.title}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {hub.actions.length > 3 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 italic pl-8 flex items-center space-x-1">
                        <MoreHorizontal className="h-3 w-3" />
                        <span>+{hub.actions.length - 3} more actions available</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 pb-6">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        const primaryAction = hub.actions.find(action => action.isPrimary) || hub.actions[0];
                        setApiPanel({ open: true, hub, selectedAction: primaryAction });
                      }}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                      <Zap className="h-4 w-4" />
                      <span>Quick Start</span>
                    </button>
                    <button
                      onClick={() => setApiPanel({ open: true, hub })}
                      className="px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <Settings className="h-4 w-4" />
                      <span>All Actions</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* No Results */}
        {SMART_API_HUBS.filter(hub => selectedCategory === 'All' || hub.category === selectedCategory).length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600"
          >
            <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No API hubs found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try selecting a different category or view all hubs</p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Hubs
            </button>
          </motion.div>
        )}
        
        {/* Enhanced ApiPanel Modal */}
        {apiPanel.open && apiPanel.hub && (
          <ApiPanel
            open={apiPanel.open}
            onClose={() => setApiPanel({ open: false, hub: null })}
            title={apiPanel.hub.title}
            endpoint={apiPanel.selectedAction?.endpoint || apiPanel.hub.primaryEndpoint}
            method={apiPanel.selectedAction?.method || 'GET'}
            description={apiPanel.selectedAction?.description || apiPanel.hub.description}
            fetcher={apiPanel.selectedAction?.fetcher}
            hub={apiPanel.hub}
            selectedAction={apiPanel.selectedAction}
          />
        )}
      </div>

    </div>
  );
};

export default Admin2Dashboard; 