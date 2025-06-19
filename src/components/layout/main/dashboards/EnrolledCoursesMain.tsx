"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Clock, 
  Star, 
  Search, 
  Filter, 
  Grid, 
  List,
  TrendingUp,
  Calendar,
  Award,
  Play,
  Users,
  AlertCircle,
  RefreshCw,
  Download
} from "lucide-react";
import { progressAPI } from "@/apis/progress.api";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";

// Types based on the provided data structure
interface IEnrollment {
  _id: string;
  student_id: {
    _id: string;
    full_name: string;
    email: string;
    profile_completion: number;
  };
  course_id: {
    _id: string;
    course_title: string;
    course_description: string;
    course_image: string;
    course_category: string;
    course_duration: string;
    course_grade: string;
    class_type: string;
    no_of_Sessions: number;
    assigned_instructor?: {
      full_name: string;
    };
    curriculum: any[];
    durationFormatted: string;
    priceDisplay: string;
  } | null;
  enrollment_type: string;
  payment_status: string;
  enrollment_date: string;
  expiry_date: string;
  progress: number;
  status: string;
  is_completed: boolean;
  completed_lessons: string[];
  completed_assignments: string[];
  completed_quizzes: string[];
  remainingTime: number;
  payment_type: string;
}

interface IEnrollmentsResponse {
  success: boolean;
  data: IEnrollment[];
}

const EnrolledCoursesMain: React.FC = () => {
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<IEnrollment[]>([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState<IEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"recent" | "progress" | "name">("recent");
  const { getQuery } = useGetQuery();

  const categories = ["all", "Technical Skills", "AI and Data Science", "Personality Development", "Sales & Marketing", "Business And Management", "Personal Well-Being"];
  const statuses = ["all", "active", "completed", "expired"];

  // Fetch enrolled courses
  const fetchEnrolledCourses = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User not found. Please log in again.");
        return;
      }

             await getQuery({
         url: apiUrls.enrolledCourses.getEnrollmentsByStudent(userId),
         onSuccess: (response: any) => {
           console.log("Enrolled courses response:", response);
           
           // Handle different response structures
           let enrollmentsData = [];
           if (response.success && response.data) {
             enrollmentsData = response.data;
           } else if (Array.isArray(response)) {
             enrollmentsData = response;
           } else if (response.data && Array.isArray(response.data)) {
             enrollmentsData = response.data;
           }
           
           // Filter out enrollments with null course_id
           const validEnrollments = enrollmentsData.filter((enrollment: any) => enrollment.course_id !== null);
           setEnrollments(validEnrollments);
           setFilteredEnrollments(validEnrollments);
         },
         onFail: (error: any) => {
           console.error("Error fetching enrollments:", error);
           setError("Failed to load enrolled courses. Please try again.");
         }
       });
    } catch (error) {
      console.error("Unexpected error:", error);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort enrollments
  useEffect(() => {
    let filtered = enrollments;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(enrollment => 
        enrollment.course_id?.course_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.course_id?.course_category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(enrollment => 
        enrollment.course_id?.course_category === selectedCategory
      );
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter(enrollment => enrollment.status === selectedStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.enrollment_date).getTime() - new Date(a.enrollment_date).getTime();
        case "progress":
          return b.progress - a.progress;
        case "name":
          return (a.course_id?.course_title || "").localeCompare(b.course_id?.course_title || "");
        default:
          return 0;
      }
    });

    setFilteredEnrollments(filtered);
  }, [enrollments, searchTerm, selectedCategory, selectedStatus, sortBy]);

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  // Calculate stats
  const stats = {
    total: enrollments.length,
    active: enrollments.filter(e => e.status === "active").length,
    completed: enrollments.filter(e => e.is_completed).length,
    averageProgress: enrollments.length > 0 
      ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
      : 0
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "completed": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "expired": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const formatRemainingTime = (milliseconds: number) => {
    if (!milliseconds || milliseconds <= 0) return "Expired";
    
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);
    
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} left`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
    return "Expires soon";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-lg text-gray-600 dark:text-gray-300">Loading your courses...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Error Loading Courses</h3>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{error}</p>
          <button
            onClick={fetchEnrolledCourses}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Enrolled Courses</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your learning progress and continue your journey
          </p>
        </div>
        <button
          onClick={fetchEnrolledCourses}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Courses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
            </div>
            <Award className="w-8 h-8 text-purple-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageProgress}%</p>
            </div>
            <Star className="w-8 h-8 text-yellow-600" />
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="recent">Recent</option>
              <option value="progress">Progress</option>
              <option value="name">Name</option>
            </select>

            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${viewMode === "grid" ? "bg-white dark:bg-gray-600 shadow" : ""}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${viewMode === "list" ? "bg-white dark:bg-gray-600 shadow" : ""}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid/List */}
      {filteredEnrollments.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No courses found</h3>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {searchTerm || selectedCategory !== "all" || selectedStatus !== "all" 
              ? "Try adjusting your filters" 
              : "You haven't enrolled in any courses yet"}
          </p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className={viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
            }
          >
            {filteredEnrollments.map((enrollment, index) => (
              <motion.div
                key={enrollment._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className={viewMode === "grid" ? "" : ""}
              >
                {viewMode === "grid" ? (
                  <CourseCard enrollment={enrollment} router={router} />
                ) : (
                  <CourseListItem enrollment={enrollment} router={router} />
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

// Course Card Component
const CourseCard: React.FC<{ enrollment: IEnrollment; router: any }> = ({ enrollment, router }) => {
  const course = enrollment.course_id;
  if (!course) return null;

  const handleCourseClick = () => {
    router.push(`/integrated-lessons/${course._id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer group"
      onClick={handleCourseClick}
    >
      {/* Course Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.course_image || "/placeholder-course.jpg"}
          alt={course.course_title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(enrollment.status)}`}>
            {enrollment.status}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className="bg-black/70 text-white px-2 py-1 rounded text-xs">
            {course.class_type}
          </span>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6">
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {course.course_title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {course.course_category}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Progress</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{enrollment.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${enrollment.progress}%` }}
            />
          </div>
        </div>

        {/* Course Info */}
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>{course.durationFormatted}</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            <span>{course.assigned_instructor?.full_name || "No instructor assigned"}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{formatRemainingTime(enrollment.remainingTime)}</span>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click event
            handleCourseClick();
          }}
          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Play className="w-4 h-4" />
          <span>Continue Learning</span>
        </button>
      </div>
    </motion.div>
  );
};

// Course List Item Component
const CourseListItem: React.FC<{ enrollment: IEnrollment; router: any }> = ({ enrollment, router }) => {
  const course = enrollment.course_id;
  if (!course) return null;

  const handleCourseClick = () => {
    router.push(`/integrated-lessons/${course._id}`);
  };

  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 cursor-pointer group"
      onClick={handleCourseClick}
    >
      <div className="flex items-center space-x-6">
        {/* Course Image */}
        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={course.course_image || "/placeholder-course.jpg"}
            alt={course.course_title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Course Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                {course.course_title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{course.course_category}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(enrollment.status)}`}>
              {enrollment.status}
            </span>
          </div>

          {/* Progress */}
          <div className="mt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Progress</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{enrollment.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${enrollment.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click event
            handleCourseClick();
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Play className="w-4 h-4" />
          <span>Continue</span>
        </button>
      </div>
    </motion.div>
  );
};

// Helper function for status colors
const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "completed": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    case "expired": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

// Helper function for remaining time
const formatRemainingTime = (milliseconds: number) => {
  if (!milliseconds || milliseconds <= 0) return "Expired";
  
  const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} left`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
  return "Expires soon";
};

export default EnrolledCoursesMain; 