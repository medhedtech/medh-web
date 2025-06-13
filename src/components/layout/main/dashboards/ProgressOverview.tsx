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
  BookMarked
} from "lucide-react";
import useGetQuery from "@/hooks/getQuery.hook";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
}

// Progress visualization - defined outside as it doesn't need component state
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
        <circle 
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
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-gray-900 dark:text-white">
        {progress}%
      </div>
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
      
      const fetchStudentData = async () => {
        try {
          await getQuery({
            url: `/enrolled/getCount/${studentId}`,
            onSuccess: (response) => {
              if (response?.data) {
                // Extract the main sections from the response
                const { recent_activity, counts, progress } = response.data;
                
                // Update with correct data from the API response structure
                setStudentData({
                  recentActivity: recent_activity || [],
                  progress: {
                    // Use the values directly from the API response
                    averageProgress: progress?.averageProgress || 0,
                    coursesInProgress: counts?.active || 0,
                    coursesCompleted: counts?.completed || 0,
                    totalEnrolled: counts?.total || 0,
                    
                    // Get course type counts from the correct location in the response
                    liveClasses: counts?.byCourseType?.live || 0,
                    blendedLearning: counts?.byCourseType?.blended || 0,
                    recordedCourses: counts?.byCourseType?.selfPaced || 0,
                    
                    // Set default values for metrics not in the API
                    improvementRate: 0,
                    studyStreak: 0,
                    totalStudyTime: 0
                  }
                });
              }
            },
            onFail: (error) => {
              console.error("Failed to fetch student data:", error);
              setIsLoading(false);
            }
          });
        } catch (error) {
          console.error("Error fetching student data:", error);
          setIsLoading(false);
        } finally {
          setIsLoading(false);
        }
      };

      fetchStudentData();
    }
  }, [studentId, getQuery]);

  // Helper functions for counting course types
  const getBlendedLearningCount = (courses: CourseProgress[]): number => {
    return courses.filter(course => course.class_type === "Blended Learning").length;
  };

  const getLiveClassesCount = (courses: CourseProgress[]): number => {
    return courses.filter(course => course.class_type === "Live").length;
  };

  const getRecordedCoursesCount = (courses: CourseProgress[]): number => {
    return courses.filter(course => course.class_type === "Recorded").length;
  };

  // Intersection Observer effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('progress-section');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  // Helper function to get status info
  const getStatusInfo = (status: string, payment_status: string) => {
    if (payment_status === "pending") {
      return {
        color: "text-amber-500",
        bgColor: "bg-amber-50 dark:bg-amber-500/10",
        borderColor: "border-amber-200 dark:border-amber-500/20",
        icon: Clock,
        label: "Payment Pending"
      };
    }
    if (status === "active") {
      return {
        color: "text-emerald-500",
        bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
        borderColor: "border-emerald-200 dark:border-emerald-500/20",
        icon: Sparkles,
        label: "Active"
      };
    }
    if (status === "completed") {
      return {
        color: "text-blue-500",
        bgColor: "bg-blue-50 dark:bg-blue-500/10", 
        borderColor: "border-blue-200 dark:border-blue-500/20",
        icon: CheckCircle,
        label: "Completed"
      };
    }
    return {
      color: "text-gray-500",
      bgColor: "bg-gray-50 dark:bg-gray-500/10",
      borderColor: "border-gray-200 dark:border-gray-500/20",
      icon: Award,
      label: status
    };
  };

  const handleContinueLearning = (courseId: string) => {
    router.push(`/integrated-lessons/${courseId}`);
  };

  // Add estimated time remaining calculation
  const calculateTimeRemaining = (progress: number, totalDuration: number) => {
    const remainingPercentage = 100 - progress;
    const remainingMinutes = Math.ceil((remainingPercentage / 100) * totalDuration);
    return remainingMinutes;
  };

  // Format minutes into hours and minutes
  const formatTimeRemaining = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  // Get filtered courses based on active tab
  const getFilteredCourses = () => {
    if (activeTab === 'all') return studentData.recentActivity;
    return studentData.recentActivity.filter(course => 
      activeTab === 'active' 
        ? course.status === 'active' && course.payment_status !== 'pending'
        : course.status === 'completed'
    );
  };

  // Get active course count
  const getActiveCourseCount = (courses: CourseProgress[]) => {
    return courses.filter(course => course.status === "active" && course.payment_status !== "pending").length;
  };

  // Add helper functions for processing course data
  const calculateRecentActivityDetails = (progressData: any): { improvementRate: number } => {
    // This function would analyze progress data to determine improvement rate
    // For example, comparing recent progress to previous month's progress
    
    try {
      // Logic to calculate improvement rate based on progress trends
      // For now, return a mock value
      return {
        improvementRate: 5
      };
    } catch (error) {
      console.error("Error calculating activity details:", error);
      return {
        improvementRate: 0
      };
    }
  };

  // Metric Card Component
  const MetricCard: React.FC<MetricCardProps> = ({ 
    icon: Icon, 
    iconColor, 
    bgColor, 
    title, 
    value, 
    change, 
    subtitle 
  }) => (
    <motion.div
      variants={itemVariants}
      className={`rounded-xl ${bgColor} p-4 flex items-center gap-4 h-full`}
    >
      <div className={`w-12 h-12 rounded-full ${iconColor.replace('text-', 'bg-').replace('500', '100')} dark:${iconColor.replace('text-', 'bg-').replace('500', '900')}/30 flex items-center justify-center`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
        <div className="flex items-baseline gap-1">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {change && (
            <span className="text-xs font-medium text-green-500 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" />{change}
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>}
      </div>
    </motion.div>
  );

  // Visual elements for empty state - moved inside the component to access activeTab and router
  const EmptyCourseState = () => (
    <motion.div
      variants={itemVariants}
      className="text-center py-8 px-6 rounded-xl bg-white/50 dark:bg-gray-800/30 backdrop-blur-md shadow-sm border border-gray-100 dark:border-gray-700/30"
    >
      <div className="mb-4">
        <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mx-auto">
          <BookOpen className="w-8 h-8 text-primary-500/70" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-4 mb-2">
          {activeTab === 'active' 
            ? "No Active Courses" 
            : activeTab === 'completed' 
              ? "No Completed Courses Yet" 
              : "No Courses Found"}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
          {activeTab === 'active' 
            ? "You don't have any active courses. Browse our catalog to start your learning journey." 
            : activeTab === 'completed' 
              ? "Keep learning! You'll see your completed courses here once you finish them."
              : "Explore our course catalog and find the perfect learning path for you."}
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/courses')}
          className="inline-flex items-center px-5 py-2.5 rounded-lg text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Browse Courses
          <ChevronRight className="ml-1 w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );

  // Add loading skeleton component inside the component
  const CardSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-2xl"></div>
      <div className="p-6">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full mb-6"></div>
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );

  const filteredCourses = getFilteredCourses();

  // Add the formatStudyTime function to properly handle undefined minutes
  const formatStudyTime = (minutes?: number): string => {
    if (!minutes) return "0h";
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 0) return `${remainingMinutes}m`;
    if (remainingMinutes === 0) return `${hours}h`;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div id="progress-section" className="p-6">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">Your Learning Metrics</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track your educational journey with real-time statistics
            </p>
          </div>
        </div>
        
        {/* Metrics Grid */}
        <div className="mb-6 grid grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard 
            icon={BookMarked}
            iconColor="text-indigo-500"
            bgColor="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20"
            title="Total Enrolled Courses"
            value={studentData.progress.totalEnrolled || 0}
            subtitle="All courses you've enrolled in"
          />
          
          <MetricCard 
            icon={BarChart4}
            iconColor="text-blue-500"
            bgColor="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20"
            title="Average Completion"
            value={`${studentData.progress.averageProgress}%`}
            change="+0%"
            subtitle="Overall course progress"
          />
          
          <MetricCard 
            icon={VideoIcon}
            iconColor="text-emerald-500"
            bgColor="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20"
            title="Live Classes"
            value={studentData.progress.liveClasses || 0}
            subtitle="Interactive sessions"
          />
          
          <MetricCard 
            icon={CheckCircle}
            iconColor="text-green-500"
            bgColor="bg-gradient-to-br from-green-50 to-lime-50 dark:from-green-900/20 dark:to-lime-900/20"
            title="Completed Courses"
            value={studentData.progress.coursesCompleted}
            subtitle="Finished learning paths"
          />
          
          <MetricCard 
            icon={Sparkles}
            iconColor="text-amber-500"
            bgColor="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20"
            title="Active Courses"
            value={studentData.progress.coursesInProgress || 0}
            subtitle="Currently learning"
          />
          
          <MetricCard 
            icon={Clock}
            iconColor="text-rose-500"
            bgColor="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20"
            title="Study Streak"
            value={`${0} days`}
            subtitle="Continuous learning"
          />
        </div>

        {/* Add new section for additional metrics */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Learning Activity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="text-base font-medium text-gray-900 dark:text-white">Course Types</h4>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Live Classes</span>
                    <span className="font-medium text-gray-900 dark:text-white">{studentData.progress.liveClasses || 0}</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ 
                        width: `${studentData.progress.totalEnrolled && studentData.progress.liveClasses ? 
                          (studentData.progress.liveClasses / studentData.progress.totalEnrolled) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Recorded Courses</span>
                    <span className="font-medium text-gray-900 dark:text-white">{studentData.progress.recordedCourses || 0}</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 rounded-full" 
                      style={{ 
                        width: `${studentData.progress.totalEnrolled && studentData.progress.recordedCourses ? 
                          (studentData.progress.recordedCourses / studentData.progress.totalEnrolled) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Blended Learning</span>
                    <span className="font-medium text-gray-900 dark:text-white">{studentData.progress.blendedLearning || 0}</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full" 
                      style={{ 
                        width: `${studentData.progress.totalEnrolled && studentData.progress.blendedLearning ? 
                          (studentData.progress.blendedLearning / studentData.progress.totalEnrolled) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <Timer className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="text-base font-medium text-gray-900 dark:text-white">Study Activity</h4>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                    <Clock className="w-7 h-7 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Study Time</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {formatStudyTime(0)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg">
                    <Calendar className="w-7 h-7 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Days Active</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {0} <span className="text-sm font-normal text-gray-500">days</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressOverview; 