"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  ChevronRight, 
  BookOpen, 
  Clock, 
  Award, 
  Sparkles, 
  Calendar, 
  PlayCircle, 
  Timer, 
  TrendingUp,
  CheckCircle,
  Badge,
  BarChart4,
  GraduationCap,
  Users,
  VideoIcon,
  Layers,
  Zap,
  BookMarked,
  Target,
  Trophy,
  Activity,
  Brain,
  Star
} from "lucide-react";
import useGetQuery from "@/hooks/getQuery.hook";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ProgressTracker } from "@/components/shared/progress";
import { 
  progressAPI, 
  IProgressOverview, 
  IProgressAnalytics, 
  progressUtils 
} from "@/apis/progress.api";

interface CourseProgress {
  course_id: string;
  course_title: string;
  class_type: string;
  progress: number;
  status: string;
  payment_status: string;
  course_image?: string;
}

interface StudentData {
  recentActivity: CourseProgress[];
  progress: {
    averageProgress: number;
    coursesInProgress: number;
    coursesCompleted: number;
    totalEnrolled?: number;
    liveClasses?: number;
    blendedLearning?: number;
    improvementRate?: number;
    studyStreak?: number;
    recordedCourses?: number;
    totalStudyTime?: number;
  };
}

interface MetricCardProps {
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
  title: string;
  value: number | string;
  change?: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
}

interface ProgressStatsCardProps {
  overview: IProgressOverview;
  analytics: IProgressAnalytics;
}

// Enhanced Progress visualization with gradient and animation
const ProgressCircle = ({ progress, size = 80, strokeWidth = 8 }: { progress: number, size?: number, strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  return (
    <div style={{ width: size, height: size }} className="relative">
      <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle 
          cx={size/2} 
          cy={size/2} 
          r={radius} 
          stroke="#e5e7eb" 
          strokeWidth={strokeWidth} 
          fill="none" 
          className="dark:stroke-gray-700"
        />
        {/* Progress circle */}
        <motion.circle 
          cx={size/2} 
          cy={size/2} 
          r={radius} 
          stroke="url(#progressGradient)" 
          strokeWidth={strokeWidth} 
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${size/2} ${size/2})`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
      </svg>
      <motion.div 
        className="absolute inset-0 flex items-center justify-center text-xl font-bold text-gray-900 dark:text-white"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {progress}%
      </motion.div>
    </div>
  );
};

// Progress Stats Card Component
const ProgressStatsCard: React.FC<ProgressStatsCardProps> = ({ overview, analytics }) => {
  const stats = [
    {
      title: "Total Progress",
      value: `${Math.round(overview.totalProgress)}%`,
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      trend: analytics.trends?.progressTrend,
    },
    {
      title: "Study Streak",
      value: `${overview.streakDays} days`,
      icon: Trophy,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
      trend: 'up',
    },
    {
      title: "Average Score",
      value: `${Math.round(overview.averageScore)}%`,
      icon: Star,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      trend: analytics.trends?.scoreTrend,
    },
    {
      title: "Time Spent",
      value: progressUtils.formatTimeSpent(overview.totalTimeSpent),
      icon: Timer,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      trend: analytics.trends?.timeSpentTrend,
    },
  ];

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'decreasing': return <TrendingUp className="w-3 h-3 text-red-500 transform rotate-180" />;
      default: return <Activity className="w-3 h-3 text-gray-500" />;
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-1.5 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            {stat.trend && getTrendIcon(stat.trend)}
          </div>
          <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            {stat.title}
          </h3>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {stat.value}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

const ProgressOverview: React.FC = () => {
  const router = useRouter();
  const { getQuery } = useGetQuery();
  const [studentData, setStudentData] = useState<StudentData>({
    recentActivity: [],
    progress: {
      averageProgress: 0,
      coursesInProgress: 0,
      coursesCompleted: 0,
      totalEnrolled: 0,
      liveClasses: 0,
      blendedLearning: 0,
      recordedCourses: 0,
      improvementRate: 0,
      studyStreak: 0,
      totalStudyTime: 0
    }
  });
  
  // Progress tracking state
  const [progressOverview, setProgressOverview] = useState<IProgressOverview | null>(null);
  const [progressAnalytics, setProgressAnalytics] = useState<IProgressAnalytics | null>(null);
  const [showProgressTracker, setShowProgressTracker] = useState(false);
  
  const [studentId, setStudentId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('active');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  // Fetch student data
  useEffect(() => {
    if (typeof window !== "undefined") {
      const student_id = localStorage.getItem("userId");
      if (student_id) {
        setStudentId(student_id);
      }
    }
  }, []);

  useEffect(() => {
    if (studentId) {
      setIsLoading(true);
      
      const fetchAllData = async () => {
        try {
          // Fetch existing course enrollment data
          await getQuery({
            url: `/enrolled/getCount/${studentId}`,
            onSuccess: (response) => {
              if (response?.data) {
                const { recent_activity, counts, progress } = response.data;
                
                setStudentData({
                  recentActivity: recent_activity || [],
                  progress: {
                    averageProgress: progress?.averageProgress || 0,
                    coursesInProgress: counts?.active || 0,
                    coursesCompleted: counts?.completed || 0,
                    totalEnrolled: counts?.total || 0,
                    liveClasses: counts?.byCourseType?.live || 0,
                    blendedLearning: counts?.byCourseType?.blended || 0,
                    recordedCourses: counts?.byCourseType?.selfPaced || 0,
                    improvementRate: 0,
                    studyStreak: 0,
                    totalStudyTime: 0
                  }
                });
              }
              setIsLoading(false);
            },
            onFail: (error) => {
              console.error("Failed to fetch student data:", error);
              setIsLoading(false);
            }
          });

          // Fetch enhanced progress data
          await getQuery({
            url: progressAPI.analytics.getByUser(studentId),
            onSuccess: (response) => {
              if (response.data?.analytics) {
                setProgressAnalytics(response.data.analytics);
                setProgressOverview(response.data.analytics.overview);
              }
            },
            onFail: (error) => {
              console.error('Failed to fetch progress analytics:', error);
            }
          });

        } catch (error) {
          console.error("Error in fetchAllData:", error);
          setIsLoading(false);
        }
      };

      fetchAllData();
    }
  }, [studentId, getQuery]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Helper functions
  const getBlendedLearningCount = (courses: CourseProgress[]): number => {
    return courses.filter(course => course.class_type === "Blended Courses").length;
  };

  const getLiveClassesCount = (courses: CourseProgress[]): number => {
    return courses.filter(course => course.class_type === "Live Courses").length;
  };

  const getRecordedCoursesCount = (courses: CourseProgress[]): number => {
    return courses.filter(course => course.class_type === "Self-Paced").length;
  };

  const getStatusInfo = (status: string, payment_status: string) => {
    if (payment_status === "pending") {
      return {
        text: "Payment Pending",
        color: "text-yellow-600 dark:text-yellow-400",
        bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
        icon: <Timer className="w-3 h-3" />
      };
    }

    switch (status?.toLowerCase()) {
      case "active":
        return {
          text: "Active",
          color: "text-green-600 dark:text-green-400",
          bgColor: "bg-green-50 dark:bg-green-900/20",
          icon: <CheckCircle className="w-3 h-3" />
        };
      case "completed":
        return {
          text: "Completed",
          color: "text-blue-600 dark:text-blue-400",
          bgColor: "bg-blue-50 dark:bg-blue-900/20",
          icon: <Award className="w-3 h-3" />
        };
      default:
        return {
          text: "Enrolled",
          color: "text-gray-600 dark:text-gray-400",
          bgColor: "bg-gray-50 dark:bg-gray-900/20",
          icon: <BookOpen className="w-3 h-3" />
        };
    }
  };

  const handleContinueLearning = (courseId: string) => {
    router.push(`/integrated-lessons/${courseId}`);
  };

  const calculateTimeRemaining = (progress: number, totalDuration: number) => {
    const remaining = ((100 - progress) / 100) * totalDuration;
    return Math.max(0, remaining);
  };

  const formatTimeRemaining = (minutes: number) => {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return `${hours}h ${remainingMinutes}m`;
  };

  const getFilteredCourses = () => {
    switch (activeTab) {
      case 'active': return studentData.recentActivity.filter(course => course.status === 'active');
      case 'completed': return studentData.recentActivity.filter(course => course.status === 'completed');
      default: return studentData.recentActivity;
    }
  };

  const getActiveCourseCount = (courses: CourseProgress[]) => {
    return courses.filter(course => course.status === 'active').length;
  };

  const calculateRecentActivityDetails = (progressData: any): { improvementRate: number } => {
    return {
      improvementRate: 15 // Mock improvement rate
    };
  };

  // Enhanced MetricCard with trend indicators
  const MetricCard: React.FC<MetricCardProps> = ({ 
    icon: Icon, 
    iconColor, 
    bgColor, 
    title, 
    value, 
    change, 
    subtitle,
    trend 
  }) => (
    <motion.div 
      variants={itemVariants}
      className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${bgColor}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        {trend && (
          <div className={`text-xs px-2 py-1 rounded-full ${
            trend === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
            trend === 'down' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
            'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
          }`}>
            {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
        <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
        {change && (
          <p className="text-xs text-green-600 dark:text-green-400">{change}</p>
        )}
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-500">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );

  const EmptyCourseState = () => (
    <div className="text-center py-12 px-4">
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <BookOpen className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        No courses yet
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
        Start your learning journey by enrolling in your first course
      </p>
      <button
        onClick={() => router.push('/courses')}
        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        <BookOpen className="w-4 h-4 mr-2" />
        Browse Courses
      </button>
    </div>
  );

  const CardSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="animate-pulse">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );

  const formatStudyTime = (minutes?: number): string => {
    if (!minutes || minutes === 0) return "0h 0m";
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 0) {
      return `${remainingMinutes}m`;
    } else if (remainingMinutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${remainingMinutes}m`;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="p-6"
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* Header with Progress Tracker Toggle */}
      <div className="mb-6">
        {/* Desktop Layout - side by side */}
        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
              <BarChart4 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Progress Overview</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Track your learning journey</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowProgressTracker(!showProgressTracker)}
            className="px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm flex items-center gap-2 whitespace-nowrap flex-shrink-0 py-2"
          >
            <Brain className="w-4 h-4" />
            <span className="whitespace-nowrap">{showProgressTracker ? 'Hide Details' : 'View Details'}</span>
          </button>
        </div>

        {/* Mobile Layout - stacked */}
        <div className="md:hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
              <BarChart4 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Progress Overview</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Track your learning journey</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowProgressTracker(!showProgressTracker)}
            className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm flex items-center justify-center gap-2"
          >
            <Brain className="w-4 h-4" />
            <span>{showProgressTracker ? 'Hide Details' : 'View Details'}</span>
          </button>
        </div>
      </div>

      {/* Enhanced Progress Stats */}
      {progressOverview && progressAnalytics && (
        <ProgressStatsCard overview={progressOverview} analytics={progressAnalytics} />
      )}

      {/* Progress Tracker Section */}
      {showProgressTracker && studentId && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-8"
        >
          <ProgressTracker 
            userId={studentId} 
            showAnalytics={true}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
          />
        </motion.div>
      )}

      {/* Main Progress Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Overall Progress Circle */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Overall Progress</h3>
            <Sparkles className="w-5 h-5 text-purple-500" />
          </div>
          
          <div className="flex items-center justify-center mb-4">
            <ProgressCircle 
              progress={progressOverview?.totalProgress || studentData.progress.averageProgress} 
              size={120} 
              strokeWidth={10} 
            />
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Keep up the great work!
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs">
              <span className="flex items-center text-green-600 dark:text-green-400">
                <CheckCircle className="w-3 h-3 mr-1" />
                {studentData.progress.coursesCompleted} Completed
              </span>
              <span className="flex items-center text-blue-600 dark:text-blue-400">
                <Clock className="w-3 h-3 mr-1" />
                {studentData.progress.coursesInProgress} In Progress
              </span>
            </div>
          </div>
        </motion.div>

        {/* Course Type Distribution */}
        <MetricCard
          icon={GraduationCap}
          iconColor="text-blue-600"
          bgColor="bg-blue-100 dark:bg-blue-900/20"
          title="Total Enrolled"
          value={studentData.progress.totalEnrolled || 0}
          subtitle="courses"
          trend="up"
        />

        {/* Study Streak */}
        <MetricCard
          icon={Trophy}
          iconColor="text-yellow-600"
          bgColor="bg-yellow-100 dark:bg-yellow-900/20"
          title="Study Streak"
          value={progressOverview?.streakDays || studentData.progress.studyStreak || 0}
          subtitle="days"
          trend="up"
        />
      </div>

      {/* Course Type Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          icon={VideoIcon}
          iconColor="text-red-600"
          bgColor="bg-red-100 dark:bg-red-900/20"
          title="Live Classes"
          value={studentData.progress.liveClasses || 0}
          subtitle="interactive sessions"
        />

        <MetricCard
          icon={Layers}
          iconColor="text-purple-600"
          bgColor="bg-purple-100 dark:bg-purple-900/20"
          title="Blended Learning"
          value={studentData.progress.blendedLearning || 0}
          subtitle="hybrid courses"
        />

        <MetricCard
          icon={PlayCircle}
          iconColor="text-green-600"
          bgColor="bg-green-100 dark:bg-green-900/20"
          title="Self-Paced"
          value={studentData.progress.recordedCourses || 0}
          subtitle="on-demand content"
        />
      </div>

      {/* Recent Course Activity */}
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          {/* Desktop Layout - heading and tabs side by side */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/20">
                <BookMarked className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Continue where you left off</p>
              </div>
            </div>
            
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {(['all', 'active', 'completed'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors capitalize ${
                    activeTab === tab
                      ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Layout - heading on top, tabs below */}
          <div className="md:hidden">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/20">
                <BookMarked className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Continue where you left off</p>
              </div>
            </div>
            
            <div className="flex justify-between bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {(['all', 'active', 'completed'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`${
                    activeTab === tab
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  } px-3 py-1.5 text-sm font-medium rounded-md transition-colors capitalize whitespace-nowrap mx-0.5`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6">
          {getFilteredCourses().length === 0 ? (
            <EmptyCourseState />
          ) : (
            <div className="space-y-4">
              {getFilteredCourses().slice(0, 4).map((course, index) => {
                const statusInfo = getStatusInfo(course.status, course.payment_status);
                const timeRemaining = calculateTimeRemaining(course.progress, 120); // Assume 2 hours per course
                
                return (
                  <motion.div
                    key={course.course_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {/* Mobile Layout - Stacked */}
                    <div className="md:hidden">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                            {course.course_title.charAt(0).toUpperCase()}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                            {statusInfo.icon}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                            {course.course_title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                              {statusInfo.text}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {course.class_type}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                          <div 
                            className="bg-gradient-to-r from-primary-500 to-purple-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                        {timeRemaining > 0 && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            ~{formatTimeRemaining(timeRemaining)} remaining
                          </p>
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleContinueLearning(course.course_id)}
                        className="w-full px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm flex items-center justify-center space-x-2"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>Continue</span>
                      </button>
                    </div>

                    {/* Desktop Layout - Horizontal */}
                    <div className="hidden md:flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {course.course_title.charAt(0).toUpperCase()}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                            {statusInfo.icon}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-gray-900 dark:text-white truncate">
                              {course.course_title}
                            </h4>
                            <span className="text-xs text-gray-600 dark:text-gray-400 ml-4">
                              {course.progress}%
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                                {statusInfo.text}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {course.class_type}
                              </span>
                              {timeRemaining > 0 && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  ~{formatTimeRemaining(timeRemaining)} remaining
                                </span>
                              )}
                            </div>
                            
                            <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 ml-4">
                              <div 
                                className="bg-gradient-to-r from-primary-500 to-purple-600 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${course.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleContinueLearning(course.course_id)}
                        className="ml-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm flex items-center space-x-2 flex-shrink-0"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>Continue</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
          
          {getFilteredCourses().length > 4 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => router.push('/dashboards/student-enrolled-courses')}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                View All Courses
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProgressOverview; 