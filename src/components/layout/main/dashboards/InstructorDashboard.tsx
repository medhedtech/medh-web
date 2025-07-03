"use client";
import React, { useState, useEffect, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion, AnimatePresence } from "framer-motion";
import "@/assets/css/Calendar.css";
import Icon1 from "@/assets/images/dashbord/icon1.svg";
import Icon2 from "@/assets/images/dashbord/icon2.svg";
import Image from "next/image";
import moment from "moment";
import Preloader from "@/components/shared/others/Preloader";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/toast";
import { 
  LucideCalendar, 
  LucideBook, 
  LucideClipboardList, 
  LucideClock,
  LucideUsers,
  LucideFileText,
  LucideGraduationCap,
  LucideCheckCircle,
  LucidePlusCircle,
  LucideEye,
  LucideEdit,
  LucideSettings,
  LucideBarChart,
  LucideMessageSquare,
  LucideVideo,
  LucideTrendingUp,
  LucideAward,
  LucideDownload,
  LucideUpload,
  LucideAlertCircle,
  LucideChevronRight,
  LucideDollarSign,
  LucidePresentation,
  LucideUser
} from "lucide-react";

// Import the new instructor API
import { 
  instructorApi, 
  InstructorDashboardData, 
  UpcomingClass, 
  RecentSubmission,
  InstructorProfile,
  InstructorStatistics,
  QuickAction as ApiQuickAction
} from "@/apis/instructor.api";

// Enhanced Types to match new API structure and add toast functionality
interface QuickStat {
  title: string;
  value: number;
  icon: string;
  description?: string;
  trend?: number;
  trendDirection?: 'up' | 'down';
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  count?: number;
  onClick?: () => void;
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

const getTimeDifference = (classDate: string, classTime: string): string => {
  const now = moment();
  const classMoment = moment(`${classDate} ${classTime}`, "YYYY-MM-DD HH:mm");
  const diffMinutes = classMoment.diff(now, "minutes");

  if (diffMinutes > 1440) {
    const diffDays = Math.ceil(diffMinutes / 1440);
    return `Starts in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
  } else if (diffMinutes > 60) {
    const diffHours = Math.floor(diffMinutes / 60);
    return `Starts in ${diffHours} hour${diffHours > 1 ? "s" : ""}`;
  } else if (diffMinutes > 0) {
    return `Starts in ${diffMinutes} minutes`;
  } else if (diffMinutes === 0) {
    return "Class is starting now!";
  } else {
    return "Class has already started.";
  }
};

const QuickStats: React.FC<{ stats: QuickStat[] }> = ({ stats }) => (
  <motion.div 
    variants={itemVariants}
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
  >
    {stats.map((stat, index) => (
      <motion.div
        key={index}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-600"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {stat.value}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mt-1">
              {stat.title}
            </p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
            <Image src={stat.icon} alt="icon" width={24} height={24} className="text-blue-500" />
          </div>
        </div>
        {stat.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {stat.description}
          </p>
        )}
        {stat.trend && (
          <div className={`flex items-center gap-1 mt-2 text-xs ${
            stat.trendDirection === 'up' ? 'text-green-500' : 'text-red-500'
          }`}>
            <LucideTrendingUp className={`w-3 h-3 ${
              stat.trendDirection === 'down' ? 'rotate-180' : ''
            }`} />
            <span>{stat.trend}% from last month</span>
          </div>
        )}
      </motion.div>
    ))}
  </motion.div>
);

const UpcomingClasses: React.FC<{ classes: UpcomingClass[] }> = ({ classes }) => (
  <motion.div 
    variants={itemVariants}
    className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 border dark:border-gray-700 h-full flex flex-col"
  >
    <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2 mb-6">
      <h2 className="relative w-full sm:w-auto text-center sm:text-left sm:flex sm:items-center sm:gap-2 sm:justify-start text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pl-9 sm:pl-0">
        <LucideCalendar className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-500 sm:static sm:transform-none sm:mr-2" />
        <span className="block mx-auto sm:mx-0">Upcoming Classes</span>
      </h2>
      <Link
        href="/dashboards/instructor/live-classes"
        className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-200 text-sm font-medium flex items-center gap-2"
      >
        View all
        <LucideChevronRight className="w-4 h-4" />
      </Link>
    </div>
    <div className="grid lg:grid-cols-2 gap-4 flex-1">
      {classes.length > 0 ? (
        classes.slice(0, 4).map((classItem, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-600 transition-all duration-300"
          >
            <div className="h-16 w-16 rounded-xl overflow-hidden flex-shrink-0 shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              {classItem.type === 'live_class' ? (
                <LucideVideo className="w-8 h-8 text-white" />
              ) : classItem.type === 'demo' ? (
                <LucidePresentation className="w-8 h-8 text-white" />
              ) : (
                <LucideGraduationCap className="w-8 h-8 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 dark:text-white truncate text-sm">
                {classItem.batchName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {classItem.courseTitle}
              </p>
              <div className="flex items-center gap-2 mt-1 text-gray-500 dark:text-gray-400">
                <LucideClock className="w-3 h-3" />
                <span className="text-xs">{classItem.time}</span>
                <LucideUsers className="w-3 h-3 ml-2" />
                <span className="text-xs">{classItem.studentCount} students</span>
              </div>
              <p className="text-xs text-emerald-500 font-medium mt-1">
                {getTimeDifference(classItem.date, classItem.time)}
              </p>
            </div>
          </motion.div>
        ))
      ) : (
        <motion.div
          variants={itemVariants}
          className="col-span-2 bg-gray-50 dark:bg-gray-700 rounded-xl p-8 text-center flex flex-col items-center justify-center h-full"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center">
            <LucideCalendar className="w-8 h-8 text-gray-400 dark:text-gray-300" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No Upcoming Classes
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            There are no classes scheduled for the selected date.
          </p>
        </motion.div>
      )}
    </div>
  </motion.div>
);

const RecentStudentSubmissions: React.FC<{ submissions: RecentSubmission[] }> = ({ submissions }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'graded': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'returned': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <motion.div 
      variants={itemVariants}
      className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 border dark:border-gray-700"
    >
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2 mb-6">
        <h2 className="relative w-full sm:w-auto text-center sm:text-left sm:flex sm:items-center sm:gap-2 sm:justify-start text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          <LucideClipboardList className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-purple-500 sm:static sm:transform-none sm:mr-2" />
          <span className="block mx-auto sm:mx-0">Recent Student Submissions</span>
        </h2>
        <Link
          href="/dashboards/instructor/submitted-work"
          className="px-4 py-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors duration-200 text-sm font-medium flex items-center gap-2"
        >
          View all
          <LucideChevronRight className="w-4 h-4" />
        </Link>
      </div>
      
      <div className="space-y-4">
        {submissions.length > 0 ? (
          submissions.map((submission, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.01 }}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-100 dark:border-gray-600 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {submission.studentName.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <LucideFileText className="w-6 h-6 text-gray-400" />
                    <p className="font-semibold text-gray-800 dark:text-white text-sm">
                      {submission.assignmentTitle}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    by {submission.studentName} • {submission.courseName}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {moment(submission.submittedAt).fromNow()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {submission.grade && (
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {submission.grade}%
                    </p>
                  </div>
                )}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                  {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                </span>
                <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                  <LucideEye className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <LucideClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No recent submissions</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const QuickActions: React.FC<{ quickActions: ApiQuickAction[] }> = ({ quickActions }) => {
  const router = useRouter();
  
  const defaultActions: QuickAction[] = [
    {
      title: 'Manage Courses',
      description: 'View and manage your courses',
      icon: <LucideBook className="w-6 h-6" />,
      href: '/dashboards/instructor/courses',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Live Classes',
      description: 'Schedule and manage live sessions',
      icon: <LucideVideo className="w-6 h-6" />,
      href: '/dashboards/instructor/live-classes',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Assignments',
      description: 'Create and grade assignments',
      icon: <LucideClipboardList className="w-6 h-6" />,
      href: '/dashboards/instructor/assignments',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Student Progress',
      description: 'Track student performance',
      icon: <LucideUsers className="w-6 h-6" />,
      href: '/dashboards/instructor/student-progress',
      color: 'from-pink-500 to-pink-600'
    },
    {
      title: 'Attendance',
      description: 'Mark and track attendance',
      icon: <LucideCheckCircle className="w-6 h-6" />,
      href: '/dashboards/instructor/mark-attendance',
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Demo Classes',
      description: 'Manage demo sessions',
      icon: <LucidePresentation className="w-6 h-6" />,
      href: '/dashboards/instructor/demo-classes',
      color: 'from-teal-500 to-teal-600'
    },
    {
      title: 'Revenue Analytics',
      description: 'View earnings and analytics',
      icon: <LucideDollarSign className="w-6 h-6" />,
      href: '/dashboards/instructor/live-revenue',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      title: 'Messages',
      description: 'Communicate with students',
      icon: <LucideMessageSquare className="w-6 h-6" />,
      href: '/dashboards/instructor/message',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      title: 'Settings',
      description: 'Manage your preferences',
      icon: <LucideSettings className="w-6 h-6 text-green-500" />,
      href: '/dashboards/instructor/settings',
      color: 'from-gray-500 to-gray-600'
    }
  ];

  // Map API actions to match action URLs and add counts
  const getActionHref = (actionType: string): string => {
    switch (actionType) {
      case 'create_assignment': return '/dashboards/instructor/assignments';
      case 'mark_attendance': return '/dashboards/instructor/mark-attendance';
      case 'view_submissions': return '/dashboards/instructor/submitted-work';
      case 'schedule_class': return '/dashboards/instructor/live-classes';
      case 'view_analytics': return '/dashboards/instructor/analytics';
      case 'create_course': return '/dashboards/instructor/courses';
      case 'view_demos': return '/dashboards/instructor/demo-classes';
      case 'view_revenue': return '/dashboards/instructor/live-revenue';
      case 'student_progress': return '/dashboards/instructor/student-progress';
      default: return '/dashboards/instructor';
    }
  };

  // Enhanced action handler
  const handleActionClick = async (action: QuickAction, apiAction?: ApiQuickAction) => {
    try {
      // If there's an onClick handler, use it
      if (action.onClick) {
        action.onClick();
        return;
      }

      // Show loading toast for navigation
      showToast.info(`Navigating to ${action.title}...`);
      
      // Navigate to the page
      router.push(action.href);
      
      // Optional: Track analytics or perform additional actions
      if (apiAction) {
        console.log(`Action performed: ${apiAction.action} - ${apiAction.label}`);
      }
    } catch (error) {
      console.error('Error handling action click:', error);
      showToast.error('Failed to navigate. Please try again.');
    }
  };

  // Merge API quick actions with default actions
  const actions: QuickAction[] = quickActions.length > 0 ? quickActions.map((apiAction, index) => {
    const defaultAction = defaultActions[index] || defaultActions[0];
    return {
      ...defaultAction,
      title: apiAction.label,
      href: getActionHref(apiAction.action),
      count: apiAction.count,
      onClick: () => handleActionClick(defaultAction, apiAction)
    };
  }) : defaultActions;

  return (
    <motion.div 
      variants={itemVariants}
      className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 border dark:border-gray-700"
    >
      <h2 className="relative w-full text-center sm:flex sm:items-center sm:gap-2 sm:justify-start text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-6">
        <LucideSettings className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-green-500 sm:static sm:transform-none sm:mr-2" />
        <span className="block mx-auto sm:mx-0 pl-10 sm:pl-0">Quick Access to Key Features</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {action.onClick ? (
              <button
                onClick={action.onClick}
                className="w-full text-left p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-100 dark:border-gray-600 hover:shadow-lg transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                    {action.icon}
                  </div>
                  {action.count !== undefined && action.count > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {action.count}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {action.description}
                </p>
              </button>
            ) : (
              <Link
                href={action.href}
                className="block p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-100 dark:border-gray-600 hover:shadow-lg transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                    {action.icon}
                  </div>
                  {action.count !== undefined && action.count > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {action.count}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {action.description}
                </p>
              </Link>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const CustomDatePicker: React.FC<{
  selectedDate: Date;
  onChange: (date: Date) => void;
}> = ({ selectedDate, onChange }) => (
  <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 border dark:border-gray-700 h-full flex flex-col">
    <h2 className="relative w-full text-center sm:flex sm:items-center sm:gap-2 sm:justify-start text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
      <LucideCalendar className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-500 sm:static sm:transform-none sm:mr-2" />
      <span className="block mx-auto sm:mx-0">Calendar</span>
    </h2>
    <div className="flex-1 flex items-center justify-center">
      <DatePicker
        selected={selectedDate}
        onChange={(date: Date | null) => {
          if (date) {
            onChange(date);
          }
        }}
        inline
        calendarClassName="!bg-transparent"
        wrapperClassName="!bg-transparent w-full"
        dayClassName={date => 
          `!bg-transparent hover:!bg-blue-50 dark:hover:!bg-blue-900/30 
           ${date.getTime() === selectedDate.getTime() ? '!bg-blue-500 !text-white hover:!bg-blue-600' : ''}`
        }
      />
    </div>
  </div>
);

const InstructorDashboard: React.FC = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dashboardData, setDashboardData] = useState<InstructorDashboardData | null>(null);
  const [instructorProfile, setInstructorProfile] = useState<{ profile: InstructorProfile; statistics: InstructorStatistics } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Enhanced data fetching with better error handling
  const fetchDashboardData = useCallback(async (showRefreshToast = false) => {
    try {
      if (showRefreshToast) {
        setRefreshing(true);
        showToast.info("Refreshing dashboard data...");
      } else {
        setLoading(true);
      }
      setError(null);

      // Fetch dashboard data and instructor profile in parallel with timeout
      const fetchWithTimeout = (promise: Promise<any>, timeout = 10000) => {
        return Promise.race([
          promise,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), timeout)
          )
        ]);
      };

      const [dashboardResponse, profileResponse] = await Promise.all([
        fetchWithTimeout(instructorApi.getDashboardData()),
        fetchWithTimeout(instructorApi.getInstructorProfile())
      ]);

      setDashboardData(dashboardResponse);
      setInstructorProfile(profileResponse);
      
      if (showRefreshToast) {
        showToast.success("Dashboard data refreshed successfully!");
      }
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to load dashboard data. Please try again.";
      setError(errorMessage);
      
      if (showRefreshToast) {
        showToast.error("Failed to refresh data. Please check your connection.");
      }
      
      // Handle specific error cases
      if (err?.response?.status === 401) {
        showToast.error("Session expired. Please login again.");
        // Redirect to login if needed
        // router.push('/login');
      } else if (err?.response?.status === 403) {
        showToast.error("Access denied. Please contact administrator.");
      } else if (err?.message === 'Request timeout') {
        showToast.error("Request timed out. Please check your connection.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Refresh function for manual refresh
  const handleRefresh = useCallback(() => {
    fetchDashboardData(true);
  }, [fetchDashboardData]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) return <Preloader />;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center max-w-md">
          <LucideAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
            Error Loading Dashboard
          </h3>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => fetchDashboardData()}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
            <button
              onClick={() => router.push('/dashboards/instructor/profile')}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              Go to Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter classes by selected date
  const filteredClasses = dashboardData?.upcomingClasses?.filter((classItem) => {
    const classDate = moment(classItem.date);
    const selectedMoment = moment(selectedDate);
    return classDate.isSame(selectedMoment, "day");
  }) || [];

  // Prepare quick stats from dashboard data
  const quickStats: QuickStat[] = [
    {
      title: "Active Batches",
      value: dashboardData?.overview?.activeBatches || 0,
      icon: Icon1,
      description: "Currently running batches"
    },
    {
      title: "Total Students",
      value: dashboardData?.overview?.totalStudents || 0,
      icon: Icon2,
      description: "Students enrolled across all courses"
    },
    {
      title: "Pending Demos",
      value: dashboardData?.overview?.pendingDemos || 0,
      icon: Icon1,
      description: "Demo sessions awaiting your attention"
    },
    {
      title: "Assignments to Review",
      value: dashboardData?.overview?.pendingAssignments || 0,
      icon: Icon2,
      description: "Assignments requiring grading"
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6"
    >
      {/* Enhanced Header Section */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6"
      >
        <div className="flex items-center gap-4 justify-center text-center lg:justify-start lg:text-left">
          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white flex-shrink-0">
            <LucideGraduationCap className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white whitespace-nowrap lg:whitespace-normal">
              Instructor Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your courses, students, and track your performance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Refresh Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={refreshing}
            className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
              refreshing
                ? 'opacity-50 cursor-not-allowed'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
            title="Refresh Dashboard Data"
          >
            <div className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <span>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </span>
          </motion.button>

          {/* Quick Navigation to Profile */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              showToast.info("Navigating to profile...");
              router.push('/dashboards/instructor/profile');
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <LucideUser className="w-4 h-4" />
            <span>Profile</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Welcome Section */}
      {instructorProfile && (
        <motion.div 
          variants={itemVariants}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-6 text-white"
        >
          {/* Convert to column on mobile, row on ≥sm */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2 text-white">
                Welcome back, {instructorProfile.profile.full_name}!
              </h2>
              <p className="text-white dark:text-white">
                {dashboardData?.monthlyStats?.month} • {instructorProfile.profile.domain} Instructor
              </p>
              {/* Stats: stack on mobile, inline on sm+ */}
              <div className="mt-4 grid grid-cols-2 xs:grid-cols-3 gap-3 sm:flex sm:items-center sm:gap-4">
                <div className="flex items-center gap-2 text-white">
                  <LucideUsers className="w-4 h-4 text-white" />
                  <span className="text-sm whitespace-nowrap text-white">{instructorProfile.statistics.totalStudents} Students</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <LucideBook className="w-4 h-4 text-white" />
                  <span className="text-sm whitespace-nowrap text-white">{instructorProfile.statistics.totalBatches} Batches</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <LucidePresentation className="w-4 h-4 text-white" />
                  <span className="text-sm whitespace-nowrap text-white">{instructorProfile.statistics.totalDemos} Demos</span>
                </div>
              </div>
            </div>
            {/* Rating block aligns right on sm+, left on mobile */}
            <div className="sm:text-right text-white">
              <p className="text-2xl font-bold text-white dark:text-white">{instructorProfile.statistics.averageRating}/5.0</p>
              <p className="text-white dark:text-white text-sm">Course Rating</p>
              <div className="flex items-center justify-start sm:justify-end gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <LucideAward 
                    key={i} 
                    className={`w-4 h-4 ${
                      i < Math.floor(instructorProfile.statistics.averageRating) 
                        ? 'text-yellow-300' 
                        : 'text-blue-300'
                    }`} 
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Stats Section */}
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl border dark:border-gray-700 overflow-hidden backdrop-blur-xl bg-white/50 dark:bg-gray-800/50 mb-6"
      >
        <h2 className="p-6 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent border-b dark:border-gray-700 text-center">
          Dashboard Overview
        </h2>
        <div className="p-6">
          <QuickStats stats={quickStats} />
        </div>
      </motion.div>

      {/* Monthly Stats */}
      {dashboardData?.monthlyStats && (
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 border dark:border-gray-700 mb-6"
        >
          <h2 className="relative w-full text-center sm:flex sm:items-center sm:gap-2 sm:justify-start text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-4">
            <LucideBarChart className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-green-500 sm:static sm:transform-none sm:mr-2" />
            <span className="block mx-auto sm:mx-0 pl-8 sm:pl-0">Monthly Progress ({dashboardData.monthlyStats.month})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {dashboardData.monthlyStats.demosCompleted}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Demos Completed</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {dashboardData.monthlyStats.assignmentsCreated}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Assignments Created</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {dashboardData.monthlyStats.newStudents}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">New Students</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Access to Key Features */}
      <div className="mb-6">
        <QuickActions quickActions={dashboardData?.quickActions || []} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-stretch">
        {/* Calendar Column */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-4 flex"
        >
          <div className="w-full">
            <CustomDatePicker
              selectedDate={selectedDate}
              onChange={(date: Date) => setSelectedDate(date)}
            />
          </div>
        </motion.div>

        {/* Upcoming Classes Column */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-8 flex"
        >
          <div className="w-full">
            <UpcomingClasses classes={filteredClasses} />
          </div>
        </motion.div>
      </div>

      {/* Recent Student Submissions */}
      <div className="mt-6">
        <RecentStudentSubmissions submissions={dashboardData?.recentSubmissions || []} />
      </div>
    </motion.div>
  );
};

export default InstructorDashboard; 