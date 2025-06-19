"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, 
  X, 
  FileVideo, 
  FileText, 
  BookOpen, 
  Video, 
  File, 
  Search, 
  Calendar, 
  Clock, 
  Star, 
  Award, 
  CheckCircle, 
  Eye, 
  Play, 
  RefreshCw, 
  BarChart3, 
  TrendingUp, 
  Target, 
  Activity, 
  Trophy, 
  Zap, 
  Brain, 
  Timer,
  Filter,
  ChevronDown,
  Medal,
  Share2,
  ExternalLink
} from "lucide-react";
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

interface CompletedCourse {
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
  completion_date?: string;
  enrollment_date?: string;
  final_score?: number;
  duration?: string;
  rating?: number;
  certificate_url?: string;
  skills_gained?: string[];
  total_lessons?: number;
  completed_lessons?: number;
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

interface AchievementStatsProps {
  completedCourses: CompletedCourse[];
  overview: IProgressOverview | null;
}

// Achievement Statistics Component
const AchievementStats: React.FC<AchievementStatsProps> = ({ completedCourses, overview }) => {
  const totalCertificates = completedCourses.filter(course => course.certificate_url).length;
  const averageScore = completedCourses.length > 0 
    ? Math.round(completedCourses.reduce((sum, course) => sum + (course.final_score || 0), 0) / completedCourses.length)
    : 0;
  const skillsGained = new Set(completedCourses.flatMap(course => course.skills_gained || [])).size;
  const totalStudyTime = overview?.totalTimeSpent || 0;

  const stats = [
    {
      title: "Courses Completed",
      value: completedCourses.length,
      icon: Trophy,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      suffix: "courses"
    },
    {
      title: "Certificates Earned",
      value: totalCertificates,
      icon: Medal,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
      suffix: "certificates"
    },
    {
      title: "Average Score",
      value: averageScore,
      icon: Star,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      suffix: "%"
    },
    {
      title: "Study Time",
      value: progressUtils.formatTimeSpent(totalStudyTime),
      icon: Timer,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      suffix: ""
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-xs text-green-600 dark:text-green-400 font-medium">
              ✓ Achieved
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {stat.title}
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stat.value}{stat.suffix}
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
  colorScheme = 'success' // Default to success for completed courses
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
          className={`${colorClasses[colorScheme]} ${sizeClasses[size]} rounded-full transition-all duration-500`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

// Tab Button Component
const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
      active
        ? 'bg-primary-600 text-white shadow-md'
        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
    }`}
  >
    {children}
  </motion.button>
);

// Resource Download Button Component
const ResourceDownloadButton: React.FC<ResourceDownloadButtonProps> = ({ icon: Icon, label, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
  >
    <Icon className="w-4 h-4" />
    <span>{label}</span>
  </motion.button>
);

// Completed Course Card Component
const CompletedCourseCard = ({ 
  course, 
  onViewMaterials, 
  userId 
}: { 
  course: CompletedCourse; 
  onViewMaterials: (course: CompletedCourse) => void;
  userId: string;
}) => {
  const router = useRouter();

  const handleViewCertificate = () => {
    if (course.certificate_url) {
      window.open(course.certificate_url, '_blank');
    }
  };

  const handleShareAchievement = () => {
    // Implement share functionality
    console.log('Share achievement for:', course.course_title);
  };

  const formatCompletionDate = (dateString?: string) => {
    if (!dateString) return "Date unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 80) return "text-blue-600 dark:text-blue-400";
    if (score >= 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-gray-600 dark:text-gray-400";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { text: "Excellent", class: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" };
    if (score >= 80) return { text: "Good", class: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" };
    if (score >= 70) return { text: "Fair", class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" };
    return { text: "Pass", class: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400" };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 overflow-hidden group"
    >
      {/* Course Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary-500 to-purple-600 overflow-hidden">
        {course.course_image ? (
          <Image
            src={course.course_image}
            alt={course.course_title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = defaultCourseImage.src;
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-white/80" />
          </div>
        )}
        
        {/* Completion Badge */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            <span>Completed</span>
          </div>
        </div>

        {/* Certificate Badge */}
        {course.certificate_url && (
          <div className="absolute top-4 left-4">
            <div className="flex items-center space-x-1 bg-yellow-600 text-white px-3 py-1 rounded-full text-xs font-medium">
              <Medal className="w-3 h-3" />
              <span>Certified</span>
            </div>
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="p-6">
        {/* Course Title and Category */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {course.course_title}
          </h3>
          
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>by {course.assigned_instructor?.full_name || "Instructor"}</span>
            {course.category && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                {course.category}
              </span>
            )}
          </div>
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="w-4 h-4 text-gray-500 mr-1" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatCompletionDate(course.completion_date)}
            </p>
          </div>
          
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Star className="w-4 h-4 text-yellow-500 mr-1" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Final Score</p>
            <p className={`text-sm font-semibold ${getScoreColor(course.final_score || 0)}`}>
              {course.final_score || 0}%
            </p>
          </div>
        </div>

        {/* Progress Bar (Always 100% for completed courses) */}
        <div className="mb-4">
          <EnhancedProgressBar 
            progress={100} 
            label="Course Progress"
            colorScheme="success"
          />
        </div>

        {/* Score Badge */}
        {course.final_score && (
          <div className="mb-4">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getScoreBadge(course.final_score).class}`}>
              <Award className="w-3 h-3 mr-1" />
              {getScoreBadge(course.final_score).text}
            </span>
          </div>
        )}

        {/* Skills Gained */}
        {course.skills_gained && course.skills_gained.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Skills Gained:</p>
            <div className="flex flex-wrap gap-1">
              {course.skills_gained.slice(0, 3).map((skill, index) => (
                <span key={index} className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-full">
                  {skill}
                </span>
              ))}
              {course.skills_gained.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                  +{course.skills_gained.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* Primary Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onViewMaterials(course)}
              className="flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
            >
              <Eye className="w-4 h-4 mr-2" />
              Review Materials
            </button>
            
            {course.certificate_url ? (
              <button
                onClick={handleViewCertificate}
                className="flex items-center justify-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
              >
                <Medal className="w-4 h-4 mr-2" />
                Certificate
              </button>
            ) : (
              <button
                disabled
                className="flex items-center justify-center px-3 py-2 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-lg cursor-not-allowed text-sm"
              >
                <Medal className="w-4 h-4 mr-2" />
                No Certificate
              </button>
            )}
          </div>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleShareAchievement}
              className="flex items-center justify-center px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </button>
            
            <Link 
              href={`/course-details/${course.id}`}
              className="flex items-center justify-center px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-sm"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Details
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Component
const CompletedCoursesMain: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("completion_date");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedCourses, setCompletedCourses] = useState<CompletedCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CompletedCourse | null>(null);
  const [showMaterialsModal, setShowMaterialsModal] = useState(false);
  const [progressOverview, setProgressOverview] = useState<IProgressOverview | null>(null);
  const [progressAnalytics, setProgressAnalytics] = useState<IProgressAnalytics | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);

  const { getQuery } = useGetQuery();
  const router = useRouter();

  // Get student ID from localStorage
  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      setStudentId(userId);
    }
  }, []);

  // Fetch completed courses and progress data
  useEffect(() => {
    if (studentId) {
      fetchCompletedCourses();
      fetchProgressData();
    }
  }, [studentId]);

  const fetchCompletedCourses = async () => {
    if (!studentId) return;
    
    setIsLoading(true);
    setError(null);

    try {
             await getQuery({
         url: apiUrls.enrolledCourses.getCompletedCourses(studentId),
         onSuccess: (response) => {
          if (response.success && response.data) {
            setCompletedCourses(response.data.courses || []);
          } else {
            setCompletedCourses([]);
          }
        },
        onFail: (error) => {
          console.error("Failed to fetch completed courses:", error);
          setError("Failed to load completed courses. Please try again.");
          setCompletedCourses([]);
        }
      });
    } catch (error) {
      console.error("Error fetching completed courses:", error);
      setError("An unexpected error occurred. Please try again.");
      setCompletedCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProgressData = async () => {
    if (!studentId) return;

    try {
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
      console.error('Error fetching progress data:', error);
    }
  };

  const handleViewMaterials = (course: CompletedCourse) => {
    setSelectedCourse(course);
    setShowMaterialsModal(true);
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
    setShowMaterialsModal(false);
  };

  const downloadFile = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter and sort courses
  const getFilteredAndSortedCourses = () => {
    let filtered = completedCourses.filter(course => {
      const matchesSearch = course.course_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.assigned_instructor?.full_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === "all" || course.category === filterCategory;
      
      if (currentTab === 1) { // Recent (last 30 days)
        const completionDate = new Date(course.completion_date || '');
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return matchesSearch && matchesCategory && completionDate >= thirtyDaysAgo;
      } else if (currentTab === 2) { // With Certificates
        return matchesSearch && matchesCategory && course.certificate_url;
      }
      
      return matchesSearch && matchesCategory;
    });

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "completion_date":
          return new Date(b.completion_date || '').getTime() - new Date(a.completion_date || '').getTime();
        case "final_score":
          return (b.final_score || 0) - (a.final_score || 0);
        case "course_title":
          return a.course_title.localeCompare(b.course_title);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const tabs = [
    { name: "All Completed", count: completedCourses.length },
    { name: "Recent", count: completedCourses.filter(course => {
      const completionDate = new Date(course.completion_date || '');
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return completionDate >= thirtyDaysAgo;
    }).length },
    { name: "Certified", count: completedCourses.filter(course => course.certificate_url).length },
  ];

  const categories = ["all", ...new Set(completedCourses.map(course => course.category).filter(Boolean))];
  const filteredCourses = getFilteredAndSortedCourses();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mr-3"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse"></div>
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto animate-pulse mb-6"></div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>

          {/* Course Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full text-center shadow-lg">
          <Trophy className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Unable to Load Completed Courses
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchCompletedCourses();
            }}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl mr-3">
              <Trophy className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Completed Courses
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Celebrate your achievements and review your learning journey
          </p>
        </motion.div>

        {/* Achievement Statistics */}
        <AchievementStats completedCourses={completedCourses} overview={progressOverview} />

        {/* Search and Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search completed courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="appearance-none bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 pr-10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Categories</option>
                {categories.filter(cat => cat !== "all").map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>

            {/* Sort By */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 pr-10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="completion_date">Latest First</option>
                <option value="final_score">Highest Score</option>
                <option value="course_title">A-Z</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 mb-8 justify-center"
        >
          {tabs.map((tab, index) => (
            <TabButton
              key={index}
              active={currentTab === index}
              onClick={() => setCurrentTab(index)}
            >
              {tab.name} ({tab.count})
            </TabButton>
          ))}
        </motion.div>

        {/* Course Grid */}
        <AnimatePresence mode="wait">
          {filteredCourses.length > 0 ? (
            <motion.div
              key={`${currentTab}-${searchTerm}-${filterCategory}-${sortBy}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CompletedCourseCard
                    course={course}
                    onViewMaterials={handleViewMaterials}
                    userId={studentId || ""}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Trophy className="w-24 h-24 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {searchTerm || filterCategory !== "all" 
                  ? "No courses match your criteria" 
                  : "No completed courses yet"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                {searchTerm || filterCategory !== "all"
                  ? "Try adjusting your search terms or filters to find what you're looking for."
                  : "Start learning today and build your achievement collection!"}
              </p>
              {(!searchTerm && filterCategory === "all") && (
                <Link
                  href="/dashboards/student/all-courses"
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Browse Available Courses
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Materials Modal */}
        <AnimatePresence>
          {showMaterialsModal && selectedCourse && (
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
                className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Course Materials
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                {/* Course Info */}
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {selectedCourse.course_title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Instructor: {selectedCourse.assigned_instructor?.full_name || "Unknown"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                                         Completed: {selectedCourse.completion_date ? new Date(selectedCourse.completion_date).toLocaleDateString('en-US', { 
                       year: 'numeric', 
                       month: 'short', 
                       day: 'numeric' 
                     }) : "Date unknown"}
                  </p>
                </div>

                {/* Downloads Section */}
                <div className="space-y-6">
                  {/* PDFs */}
                  {selectedCourse.resource_pdfs && selectedCourse.resource_pdfs.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-red-500" />
                        PDF Resources ({selectedCourse.resource_pdfs.length})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedCourse.resource_pdfs.map((pdf, index) => (
                          <ResourceDownloadButton
                            key={index}
                            icon={FileText}
                            label={`PDF ${index + 1}`}
                            onClick={() => downloadFile(pdf, `${selectedCourse.course_title}_PDF_${index + 1}.pdf`)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Videos */}
                  {selectedCourse.resource_videos && selectedCourse.resource_videos.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <Video className="w-5 h-5 mr-2 text-blue-500" />
                        Video Resources ({selectedCourse.resource_videos.length})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedCourse.resource_videos.map((video, index) => (
                          <ResourceDownloadButton
                            key={index}
                            icon={Video}
                            label={`Video ${index + 1}`}
                            onClick={() => window.open(video, '_blank')}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Resources */}
                  {(!selectedCourse.resource_pdfs || selectedCourse.resource_pdfs.length === 0) &&
                   (!selectedCourse.resource_videos || selectedCourse.resource_videos.length === 0) && (
                    <div className="text-center py-8">
                      <File className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">
                        No downloadable resources available for this course.
                      </p>
                    </div>
                  )}
                </div>

                {/* Certificate Section */}
                {selectedCourse.certificate_url && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => window.open(selectedCourse.certificate_url, '_blank')}
                      className="w-full flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <Medal className="w-5 h-5 mr-2" />
                      View Certificate
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CompletedCoursesMain; 