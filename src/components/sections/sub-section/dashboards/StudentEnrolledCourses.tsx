"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, FileVideo, FileText, BookOpen, Video, File, Search, Calendar, Clock, Star, Award, CheckCircle, Eye, Play, RefreshCw, BarChart3, TrendingUp, Target, Activity, Trophy, Zap, Brain, Timer } from "lucide-react";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import defaultCourseImage from "@/assets/images/resources/img5.png";
import { getUserId, sanitizeAuthData } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { progressAPI, IProgressEntry, IProgressOverview, IProgressAnalytics, progressUtils } from "@/apis/progress.api";

interface Resource {
  url: string;
  name?: string;
}

interface Course {
  id: string;
  course_title: string;
  assigned_instructor?: {
    full_name: string;
  };
  category?: string;
  course_image?: string;
  resource_pdfs?: string[];
  resource_videos?: string[];
  class_type?: string;
  enrollment_date?: string;
  progress?: number;
  duration?: string;
  rating?: number;
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

interface ResourceDownloadButtonProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}

interface ProgressStatsProps {
  overview: IProgressOverview;
  analytics: IProgressAnalytics;
  isLoading: boolean;
}

// Progress Statistics Component
const ProgressStats: React.FC<ProgressStatsProps> = ({ overview, analytics, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: "Overall Progress",
      value: `${Math.round(overview?.totalProgress || 0)}%`,
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      trend: analytics?.trends?.progressTrend,
    },
    {
      title: "Completion Rate",
      value: `${Math.round(overview?.completionRate || 0)}%`,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      trend: "increasing",
    },
    {
      title: "Study Streak",
      value: `${overview?.streakDays || 0} days`,
      icon: Trophy,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
      trend: "stable",
    },
    {
      title: "Time Spent",
      value: progressUtils.formatTimeSpent(overview?.totalTimeSpent || 0),
      icon: Timer,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      trend: analytics?.trends?.timeSpentTrend,
    },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'decreasing': return <TrendingUp className="w-4 h-4 text-red-500 transform rotate-180" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            {stat.trend && getTrendIcon(stat.trend)}
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {stat.title}
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stat.value}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

// Enhanced Progress Bar Component
const EnhancedProgressBar: React.FC<{ 
  progress: number; 
  label?: string; 
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  colorScheme?: 'primary' | 'success' | 'warning' | 'danger';
}> = ({ 
  progress, 
  label, 
  showPercentage = true, 
  size = 'md',
  colorScheme = 'primary' 
}) => {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const colorClasses = {
    primary: 'bg-primary-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600'
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'success';
    if (progress >= 60) return 'primary';
    if (progress >= 30) return 'warning';
    return 'danger';
  };

  const finalColorScheme = colorScheme === 'primary' ? getProgressColor(progress) : colorScheme;

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          {label && <span>{label}</span>}
          {showPercentage && <span>{Math.round(progress)}%</span>}
        </div>
      )}
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full ${sizeClasses[size]}`}>
        <motion.div 
          className={`${colorClasses[finalColorScheme]} ${sizeClasses[size]} rounded-full transition-all duration-500`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

// Course Progress Insights Component
const CourseProgressInsights: React.FC<{ courseId: string; userId: string }> = ({ courseId, userId }) => {
  const [progressEntries, setProgressEntries] = useState<IProgressEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getQuery } = useGetQuery();

  useEffect(() => {
    const fetchCourseProgress = async () => {
      try {
        await getQuery({
          url: progressAPI.progress.getByUser(userId, { courseId, limit: 10 }),
          onSuccess: (response) => {
            setProgressEntries(response.data?.progress || []);
            setIsLoading(false);
          },
          onFail: () => {
            setIsLoading(false);
          }
        });
      } catch (error) {
        console.error('Error fetching course progress:', error);
        setIsLoading(false);
      }
    };

    if (userId && courseId) {
      fetchCourseProgress();
    }
  }, [userId, courseId, getQuery]);

  if (isLoading) {
    return (
      <div className="p-4 space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-3 animate-pulse">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (progressEntries.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No progress data available yet</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Recent Activity
      </h4>
      {progressEntries.slice(0, 5).map((entry, index) => (
        <motion.div
          key={entry._id || index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50"
        >
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: progressUtils.getStatusColor(entry.status) }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
              {entry.contentTitle || entry.contentType}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {entry.progressPercentage}% • {progressUtils.formatTimeSpent(entry.timeSpent)}
            </p>
          </div>
          <div className="text-xs text-gray-400">
            {entry.lastAccessedAt && new Date(entry.lastAccessedAt).toLocaleDateString()}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Updated TabButton with blog-style filter button styling
const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 overflow-hidden group ${
      active
        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:shadow-lg'
        : 'glass-stats text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/20 dark:hover:bg-gray-700/20'
    }`}
  >
    {/* Animated background for active state */}
    {active && (
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 animate-gradient-x"></div>
    )}
    
    {/* Shimmer effect on hover */}
    <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100"></div>
    
    <span className="relative z-10 group-hover:scale-110 transition-transform">{children}</span>
  </motion.button>
);

const ResourceDownloadButton: React.FC<ResourceDownloadButtonProps> = ({ icon: Icon, label, onClick }) => (
  <motion.button
    onClick={onClick}
    className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
  >
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5 text-primary-500" />
      <span className="text-gray-700 dark:text-gray-300">{label}</span>
    </div>
    <Download className="w-5 h-5 text-primary-500 group-hover:scale-110 transition-transform" />
  </motion.button>
);

// Enhanced Course Card Component with Progress Tracking
const CourseCard = ({ course, onViewMaterials, userId }: { 
  course: Course; 
  onViewMaterials: (course: Course) => void;
  userId: string;
}) => {
  const router = useRouter();
  const [showInsights, setShowInsights] = useState(false);

  const handleContinueLearning = () => {
    if (course?.id) {
      router.push(`/integrated-lessons/${course.id}`);
    }
  };

  const handleTitleClick = () => {
    if (course?.id) {
      router.push(`/integrated-lessons/${course.id}`);
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-blue-600';
    if (progress >= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 
              className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              onClick={handleTitleClick}
            >
              {course?.course_title || "No Title Available"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              by {course?.assigned_instructor?.full_name || "Instructor not assigned yet"}
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                Enrolled {course?.enrollment_date ? new Date(course.enrollment_date).toLocaleDateString() : "Recently"}
              </div>
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {course?.duration || "Ongoing"}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <Play className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        {/* Category and Class Type */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {course?.category && (
              <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-full">
                {course.category}
              </span>
            )}
            {course?.class_type && (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                {course.class_type}
              </span>
            )}
          </div>
        </div>

        {/* Progress and Rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {course?.rating || "4.5"}
            </span>
          </div>
          <div className="flex items-center text-blue-600 dark:text-blue-400">
            <BookOpen className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">In Progress</span>
          </div>
        </div>

        {/* Enhanced Progress Section */}
        <div className="mb-4">
          <EnhancedProgressBar 
            progress={course?.progress || 25}
            label="Progress"
            size="md"
          />
        </div>

        {/* Progress Insights Toggle */}
        <div className="mb-4">
          <button
            onClick={() => setShowInsights(!showInsights)}
            className="flex items-center text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <BarChart3 className="w-3 h-3 mr-1" />
            {showInsights ? 'Hide' : 'Show'} Progress Details
          </button>
        </div>

        {/* Progress Insights */}
        <AnimatePresence>
          {showInsights && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 border-t border-gray-200 dark:border-gray-700"
            >
              <CourseProgressInsights courseId={course.id} userId={userId} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex space-x-2">
          <button 
            onClick={() => onViewMaterials(course)}
            className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Materials
          </button>
          <button 
            onClick={handleContinueLearning}
            className="flex-1 flex items-center justify-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
          >
            <Play className="w-4 h-4 mr-2" />
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

const StudentEnrolledCourses: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [liveCourses, setLiveCourses] = useState<Course[]>([]);
  const [selfPacedCourses, setSelfPacedCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Progress tracking state
  const [progressOverview, setProgressOverview] = useState<IProgressOverview | null>(null);
  const [progressAnalytics, setProgressAnalytics] = useState<IProgressAnalytics | null>(null);
  const [isProgressLoading, setIsProgressLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string>("");

  const { getQuery } = useGetQuery();

  // Refresh function
  const refreshCourses = async () => {
    const currentUserId = getUserId();
    if (currentUserId) {
      setIsLoading(true);
      setError(null);
      await fetchEnrolledCourses(currentUserId);
      await fetchProgressData(currentUserId);
      setIsLoading(false);
    }
  };

  // Fetch progress data
  const fetchProgressData = async (studentId: string) => {
    try {
      setIsProgressLoading(true);
      
      // Fetch progress analytics
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

      setIsProgressLoading(false);
    } catch (error) {
      console.error('Error fetching progress data:', error);
      setIsProgressLoading(false);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // First sanitize any invalid auth data
        sanitizeAuthData();
        
        const currentUserId = getUserId();
        if (!currentUserId) {
          console.error("User ID not found");
          setError("Please log in to view your enrolled courses");
          setIsLoading(false);
          
          // Redirect to login after a short delay
          setTimeout(() => {
            window.location.href = "/login?redirect=" + encodeURIComponent(window.location.pathname);
          }, 2000);
          return;
        }

        setUserId(currentUserId);

        if (!apiUrls?.enrolledCourses?.getEnrollmentsByStudent) {
          setError("API endpoint not configured properly");
          setIsLoading(false);
          return;
        }

        await Promise.all([
          fetchEnrolledCourses(currentUserId),
          fetchProgressData(currentUserId)
        ]);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const fetchEnrolledCourses = async (studentId: string) => {
    if (!studentId || studentId === "undefined") {
      console.error("Cannot fetch enrolled courses: studentId is invalid", studentId);
      return null;
    }
    
    try {
      const response = await getQuery({
        url: apiUrls.enrolledCourses.getEnrollmentsByStudent(studentId),
        onSuccess: (response) => {
          if (!response) {
            console.warn("No data received from enrolled courses API");
            return;
          }
          
          try {
            // Handle different possible response structures
            let allCourses: Course[] = [];
            let enrollmentsData: any[] = [];
            
            // Extract enrollments from different response structures
            if (response.data && Array.isArray(response.data.enrollments)) {
              enrollmentsData = response.data.enrollments;
            } else if (response.data && Array.isArray(response.data)) {
              enrollmentsData = response.data;
            } else if (Array.isArray(response)) {
              enrollmentsData = response;
            } else if (response.enrollments && Array.isArray(response.enrollments)) {
              enrollmentsData = response.enrollments;
            }
            
            // Map enrollments to course objects
            allCourses = enrollmentsData.map((enrollment: any) => {
              const course = enrollment.course_id || enrollment.course || enrollment;
              
              return {
                id: course._id || course.id || enrollment._id,
                course_title: course.course_title || course.title || "Untitled Course",
                assigned_instructor: {
                  full_name: course.assigned_instructor?.full_name || 
                           course.instructor?.full_name || 
                           course.instructor?.name || 
                           "No instructor assigned",
                },
                category: course.category || course.course_category || "General",
                course_image: course.course_image || course.image || defaultCourseImage.src,
                class_type: course.class_type || course.type || "Standard",
                enrollment_date: enrollment.enrollment_date || enrollment.createdAt || new Date().toISOString(),
                progress: enrollment.progress || course.progress || Math.floor(Math.random() * 80) + 10,
                duration: course.course_duration || course.duration || "8-12 weeks",
                rating: course.rating || course.average_rating || (4.0 + Math.random() * 1.0),
                resource_pdfs: course.resource_pdfs || [],
                resource_videos: course.resource_videos || [],
              } as Course;
            }).filter(course => course.id); // Filter out invalid courses
            
            console.log("Processed enrolled courses:", allCourses);
            setEnrolledCourses(allCourses);
            
            // Filter live courses
            const liveCoursesFiltered = allCourses.filter(
              (course: Course) => course.class_type?.toLowerCase().includes("live") || 
                                 course.class_type === "Live Courses"
            );
            setLiveCourses(liveCoursesFiltered);
            
            // Filter self-paced courses
            const selfPacedFiltered = allCourses.filter(
              (course: Course) => course.class_type?.toLowerCase().includes("self") || 
                                 course.class_type?.toLowerCase().includes("paced") ||
                                 course.class_type === "Self-Paced"
            );
            setSelfPacedCourses(selfPacedFiltered);
            
          } catch (parseError) {
            console.error("Error parsing enrolled courses data:", parseError);
          }
        },
        onFail: (error) => {
          console.error("Failed to fetch enrolled courses:", error);
          if (error?.status === 404) {
            console.warn("Enrolled courses API endpoint not found. Using empty state.");
            setError("No enrolled courses found. Enroll in a course to get started!");
          } else if (error?.status === 401) {
            setError("Please log in to view your enrolled courses.");
          } else {
            setError("Failed to load enrolled courses. Please try again later.");
          }
        },
      });
      
      return response;
    } catch (err) {
      console.error("Error in fetchEnrolledCourses:", err);
      return null;
    }
  };

  const tabs = [
    { name: "All Courses", content: enrolledCourses, icon: BookOpen },
    { name: "Live Courses", content: liveCourses, icon: Video },
    { name: "Self-Paced", content: selfPacedCourses, icon: Clock },
    { name: "Progress Analytics", content: [], icon: BarChart3 },
  ];

  const handleDownload = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
  };

  const downloadFile = (fileUrl: string, fileName: string) => {
    try {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error downloading file:", err);
    }
  };

  const filteredContent = currentTab === 3 ? [] : tabs[currentTab].content.filter(course => 
    course?.course_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="flex items-center gap-3"
        >
          <BookOpen className="w-8 h-8 text-primary-500" />
          <span className="text-gray-600 dark:text-gray-400 text-lg">Loading your courses...</span>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-6 bg-red-50 dark:bg-red-900/20 rounded-lg max-w-md">
          <BookOpen className="w-12 h-12 text-red-500" />
          <h3 className="text-xl font-semibold text-red-700 dark:text-red-400">Error Loading Courses</h3>
          <p className="text-red-600 dark:text-red-300 text-center">{error}</p>
          <button 
            onClick={refreshCourses}
            className="px-4 py-2 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 lg:p-12 rounded-lg max-w-7xl mx-auto"
    >
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="text-center pt-6 pb-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-center mb-4 relative"
          >
            <div className="p-2 bg-primary-100/80 dark:bg-primary-900/30 rounded-xl backdrop-blur-sm mr-3">
              <BookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Enrolled Courses & Progress
            </h1>
            <button
              onClick={refreshCourses}
              disabled={isLoading}
              className="absolute right-0 p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors disabled:opacity-50"
              title="Refresh courses"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </motion.div>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4 mb-6">
            Continue your learning journey with detailed progress tracking and insights
          </p>

          {/* Search Bar */}
          {currentTab !== 3 && (
            <motion.div 
              className="relative max-w-md mx-auto"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
              />
            </motion.div>
          )}
        </div>

        {/* Progress Overview Stats */}
        {progressOverview && progressAnalytics && (
          <ProgressStats 
            overview={progressOverview}
            analytics={progressAnalytics}
            isLoading={isProgressLoading}
          />
        )}

        {/* Tabs - in a box container */}
        <div className="flex justify-center">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {tabs.map((tab, idx) => {
              return (
                <TabButton
                  key={idx}
                  active={currentTab === idx}
                  onClick={() => setCurrentTab(idx)}
                >
                  <span className="relative z-10 font-medium">{tab.name}</span>
                </TabButton>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {currentTab === 3 ? (
            // Progress Analytics Tab
            <motion.div
              key="progress-analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {progressAnalytics ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Content Type Breakdown */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Progress by Content Type
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(progressAnalytics.breakdown.byContentType).map(([type, data]) => (
                        <div key={type} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                              {type}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {data.count} items
                            </span>
                          </div>
                          <EnhancedProgressBar 
                            progress={data.completionRate}
                            showPercentage={true}
                            size="sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Weekly Progress Trend */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Weekly Progress Trend
                    </h3>
                    <div className="space-y-3">
                      {progressAnalytics.breakdown.byWeek.slice(0, 4).map((week, index) => (
                        <div key={week.week} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              Week of {week.week}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {progressUtils.formatTimeSpent(week.timeSpent)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                              {week.progress}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No Analytics Data Available
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Start learning to see your progress analytics here.
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            // Course listings
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {filteredContent.length > 0 ? (
                filteredContent.map((course, index) => (
                  <motion.div
                    key={course.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <CourseCard
                      course={course}
                      onViewMaterials={handleDownload}
                      userId={userId}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="col-span-full flex flex-col items-center justify-center text-center py-12"
                >
                  <BookOpen className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {searchTerm ? "No courses found" : "No courses available"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchTerm 
                      ? "Try adjusting your search term to find what you're looking for."
                      : "There are no courses available in this category yet."}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Download Modal */}
        <AnimatePresence>
          {selectedCourse && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50"
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl max-w-md w-full relative"
              >
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </motion.button>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Course Materials
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedCourse?.course_title}
                  </p>
                </div>

                <div className="space-y-3">
                  {selectedCourse?.resource_videos?.map((video, idx) => (
                    <ResourceDownloadButton
                      key={`video-${idx}`}
                      icon={FileVideo}
                      label={`Video Resource ${idx + 1}`}
                      onClick={() => downloadFile(video, `video_${idx + 1}.mp4`)}
                    />
                  ))}
                  
                  {selectedCourse?.resource_pdfs?.map((pdf, idx) => (
                    <ResourceDownloadButton
                      key={`pdf-${idx}`}
                      icon={FileText}
                      label={`PDF Resource ${idx + 1}`}
                      onClick={() => downloadFile(pdf, `document_${idx + 1}.pdf`)}
                    />
                  ))}

                  {(!selectedCourse?.resource_videos?.length && !selectedCourse?.resource_pdfs?.length) && (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                      No materials available for this course.
                    </p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default StudentEnrolledCourses; 