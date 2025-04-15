"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { 
  LucideCalendar, 
  LucideClock, 
  LucideUser, 
  LucideBookOpen,
  LucideBarChart,
  LucideActivity,
  LucideAward,
  LucideLineChart,
  LucideInfo,
  LucideCheckCircle2,
  LucideBookmark,
  LucideBook
} from "lucide-react";

// Component imports
import LoadingIndicator from "@/components/shared/loaders/LoadingIndicator";
import EmptyState from "@/components/shared/others/EmptyState";
import TabNavigation from "@/components/shared/navigation/TabNavigation";
import SearchBar from "@/components/shared/inputs/SearchBar";
import Badge from "@/components/shared/elements/Badge";
import Button from "@/components/shared/buttons/Button";
import Select from "@/components/shared/inputs/Select";
import Card from "@/components/shared/containers/Card";
import Modal from "@/components/shared/modals/Modal";

// Default image for courses without images
import DefaultCourseImage from "@/assets/images/courses/image1.png";

// Types
interface CourseProgress {
  _id: string;
  courseId: string;
  courseTitle: string;
  courseImage?: string;
  progress: number;
  lastAccessed: string;
  startDate: string;
  estimatedCompletionDate?: string;
  category?: string;
  instructor?: string;
  completedLessons: number;
  totalLessons: number;
}

interface ApiResponse {
  courseProgress: CourseProgress[];
  stats: {
    averageProgress: number;
    coursesInProgress: number;
    coursesCompleted: number;
    totalCourses: number;
    studyStreak: number;
    totalStudyTime: number;
  };
}

interface FilterState {
  category: string;
  progress: string;
  searchTerm: string;
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

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
};

/**
 * StudentProgressTracking - Component for displaying and managing student progress
 */
const StudentProgressTracking: React.FC = () => {
  const router = useRouter();
  const { getQuery, loading } = useGetQuery();
  
  // State management
  const [progressData, setProgressData] = useState<CourseProgress[]>([]);
  const [stats, setStats] = useState({
    averageProgress: 0,
    coursesInProgress: 0,
    coursesCompleted: 0,
    totalCourses: 0,
    studyStreak: 0,
    totalStudyTime: 0
  });
  const [userId, setUserId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedCourse, setSelectedCourse] = useState<CourseProgress | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  // Filter and search state
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    progress: "all",
    searchTerm: ""
  });
  
  // Categories for filter options
  const [categories, setCategories] = useState<string[]>([]);
  const progressFilters = ["all", "not-started", "in-progress", "almost-complete", "completed"];
  
  // Fetch user ID from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setUserId(storedUserId);
      }
    }
  }, []);
  
  // Fetch progress data
  useEffect(() => {
    if (!userId) return;
    
    const fetchProgressData = async () => {
      try {
        // Mock data for development - replace with actual API call when available
        // This simulates the API response structure
        
        const mockData = {
          courseProgress: [
            {
              _id: "1",
              courseId: "course1",
              courseTitle: "Introduction to React",
              courseImage: "/images/courses/react.jpg",
              progress: 75,
              lastAccessed: "2023-08-15T10:30:00Z",
              startDate: "2023-07-01T00:00:00Z",
              estimatedCompletionDate: "2023-09-30T00:00:00Z",
              category: "Web Development",
              instructor: "John Doe",
              completedLessons: 15,
              totalLessons: 20
            },
            {
              _id: "2",
              courseId: "course2",
              courseTitle: "Advanced JavaScript",
              courseImage: "/images/courses/javascript.jpg",
              progress: 45,
              lastAccessed: "2023-08-14T14:20:00Z",
              startDate: "2023-07-15T00:00:00Z",
              category: "Programming",
              instructor: "Jane Smith",
              completedLessons: 9,
              totalLessons: 20
            },
            {
              _id: "3",
              courseId: "course3",
              courseTitle: "UI/UX Design Fundamentals",
              progress: 100,
              lastAccessed: "2023-08-10T09:15:00Z",
              startDate: "2023-06-01T00:00:00Z",
              estimatedCompletionDate: "2023-08-01T00:00:00Z",
              category: "Design",
              instructor: "Alex Johnson",
              completedLessons: 12,
              totalLessons: 12
            },
            {
              _id: "4",
              courseId: "course4",
              courseTitle: "Node.js Backend Development",
              courseImage: "/images/courses/nodejs.jpg",
              progress: 20,
              lastAccessed: "2023-08-13T16:45:00Z",
              startDate: "2023-08-01T00:00:00Z",
              category: "Web Development",
              instructor: "Mike Williams",
              completedLessons: 4,
              totalLessons: 20
            },
            {
              _id: "5",
              courseId: "course5",
              courseTitle: "Python Data Science",
              progress: 0,
              lastAccessed: "2023-08-16T11:30:00Z",
              startDate: "2023-08-15T00:00:00Z",
              category: "Data Science",
              instructor: "Sarah Miller",
              completedLessons: 0,
              totalLessons: 25
            }
          ],
          stats: {
            averageProgress: 48,
            coursesInProgress: 3,
            coursesCompleted: 1,
            totalCourses: 5,
            studyStreak: 7,
            totalStudyTime: 42.5
          }
        };
        
        // In real implementation, this would be replaced with:
        // getQuery({
        //   url: `${apiUrls?.progress?.getStudentProgress(userId)}`,
        //   onSuccess: (res: ApiResponse) => {
        //     setProgressData(res.courseProgress || []);
        //     setStats(res.stats || {});
        //     setErrorMessage("");
        //   },
        //   onFail: (err) => {
        //     console.error("Error fetching progress data:", err);
        //     setErrorMessage("Failed to load progress data. Please try again later.");
        //   }
        // });
        
        // Using mock data
        setProgressData(mockData.courseProgress);
        setStats(mockData.stats);
        
        // Extract unique categories for filters
        const uniqueCategories = [...new Set(mockData.courseProgress.map(course => course.category || "Uncategorized"))];
        setCategories(["all", ...uniqueCategories]);
        
        setErrorMessage("");
      } catch (error) {
        console.error("Error in progress data fetch:", error);
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    };
    
    fetchProgressData();
  }, [userId]);
  
  // Format date with user-friendly formatting
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, "MMMM do, yyyy");
    } catch (error) {
      return dateString;
    }
  };
  
  // Get progress status
  const getProgressStatus = (percentage: number): string => {
    if (percentage === 0) return "not-started";
    if (percentage === 100) return "completed";
    if (percentage >= 75) return "almost-complete";
    return "in-progress";
  };
  
  // Get status color based on progress
  const getStatusColor = (percentage: number): string => {
    if (percentage === 0) return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    if (percentage === 100) return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
    if (percentage >= 75) return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400";
    return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
  };
  
  // Get human-readable status text
  const getStatusText = (status: string): string => {
    switch (status) {
      case "not-started": return "Not Started";
      case "in-progress": return "In Progress";
      case "almost-complete": return "Almost Complete";
      case "completed": return "Completed";
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };
  
  // Apply filters to the progress data
  const filteredCourses = progressData.filter((course) => {
    // Apply category filter
    if (filters.category !== "all" && course.category !== filters.category) {
      return false;
    }
    
    // Apply progress filter
    if (filters.progress !== "all") {
      const status = getProgressStatus(course.progress);
      if (status !== filters.progress) {
        return false;
      }
    }
    
    // Apply search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      return (
        course.courseTitle.toLowerCase().includes(searchLower) ||
        (course.category || "").toLowerCase().includes(searchLower) ||
        (course.instructor || "").toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  // Handle opening the course details modal
  const handleViewDetails = (course: CourseProgress) => {
    setSelectedCourse(course);
    setIsDetailsModalOpen(true);
  };
  
  // Handle filter changes
  const handleFilterChange = (filterName: keyof FilterState, value: string) => {
    setFilters({
      ...filters,
      [filterName]: value
    });
  };
  
  // Handle tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab !== "all") {
      handleFilterChange("progress", tab);
    } else {
      handleFilterChange("progress", "all");
    }
  };
  
  // Continue to course
  const handleContinueCourse = (courseId: string) => {
    router.push(`/course/${courseId}`);
  };
  
  // Render a progress card
  const renderProgressCard = (course: CourseProgress) => {
    const status = getProgressStatus(course.progress);
    const statusColor = getStatusColor(course.progress);
    
    return (
      <motion.div
        key={course._id}
        variants={itemVariants}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700"
      >
        <div className="relative overflow-hidden">
          <Image
            src={course.courseImage || DefaultCourseImage}
            alt={course.courseTitle}
            width={400}
            height={200}
            className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-500"
          />
          
          <div className="absolute top-3 right-3">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor}`}>
              {getStatusText(status)}
            </span>
          </div>
        </div>
        
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            {course.courseTitle}
          </h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <LucideCalendar className="w-4 h-4 mr-2 text-primary-500" />
              <span>Started on {formatDate(course.startDate)}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <LucideBookOpen className="w-4 h-4 mr-2 text-primary-500" />
              <span>{course.completedLessons} of {course.totalLessons} lessons completed</span>
            </div>
            
            {course.instructor && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <LucideUser className="w-4 h-4 mr-2 text-primary-500" />
                <span>{course.instructor}</span>
              </div>
            )}
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
            <div 
              className="bg-primary-600 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${course.progress}%` }}
            />
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => handleViewDetails(course)}
              className="flex-1 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/10 dark:text-primary-400 dark:hover:bg-primary-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              View Details
            </button>
            
            <button
              onClick={() => handleContinueCourse(course.courseId)}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              {course.progress === 0 ? 'Start Course' : 'Continue'}
            </button>
          </div>
        </div>
      </motion.div>
    );
  };
  
  // Render progress stats card
  const renderStatsCard = () => {
    return (
      <motion.div
        variants={itemVariants}
        className="col-span-full bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your Learning Stats</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Average Progress</span>
              <LucideBarChart className="w-5 h-5 text-indigo-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageProgress}%</p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-600 dark:text-green-400">Completed</span>
              <LucideCheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.coursesCompleted}</p>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">In Progress</span>
              <LucideActivity className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.coursesInProgress}</p>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Study Streak</span>
              <LucideAward className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.studyStreak} days</p>
          </div>
        </div>
      </motion.div>
    );
  };
  
  return (
    <div className="px-4 py-6 md:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Progress Tracking
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Track your learning progress across all enrolled courses.
        </p>
      </div>
      
      {/* Stats Overview */}
      {renderStatsCard()}
      
      {/* Tabs */}
      <div className="mb-6">
        <TabNavigation
          tabs={[
            { id: "all", label: "All Courses" },
            { id: "in-progress", label: "In Progress" },
            { id: "almost-complete", label: "Almost Complete" },
            { id: "completed", label: "Completed" }
          ]}
          activeTab={activeTab}
          onChange={handleTabChange}
        />
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar
            placeholder="Search courses..."
            value={filters.searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange("searchTerm", e.target.value)}
            onClear={() => handleFilterChange("searchTerm", "")}
          />
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Select
            label="Category"
            options={categories.map(cat => ({ value: cat, label: cat === "all" ? "All Categories" : cat }))}
            value={filters.category}
            onChange={(value: string) => handleFilterChange("category", value)}
            className="w-full sm:w-40"
          />
        </div>
      </div>
      
      {/* Error Message */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
          <p className="flex items-center">
            <LucideInfo className="w-5 h-5 mr-2" />
            {errorMessage}
          </p>
        </div>
      )}
      
      {/* Progress Cards Grid */}
      {loading ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <LoadingIndicator type="spinner" size="lg" color="primary" text="Loading progress data..." />
        </div>
      ) : filteredCourses.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredCourses.map(renderProgressCard)}
        </motion.div>
      ) : (
        <EmptyState
          icon={<LucideBookOpen size={48} />}
          title="No courses found"
          description={activeTab === "all" ? "You haven't enrolled in any courses yet." : `No ${getStatusText(activeTab).toLowerCase()} courses found.`}
          action={{
            label: "Browse Courses",
            onClick: () => router.push("/courses")
          }}
        />
      )}
      
      {/* Course Details Modal */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedCourse && (
          <Modal
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            title="Course Progress Details"
            size="lg"
          >
            <motion.div
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src={selectedCourse.courseImage || DefaultCourseImage}
                  alt={selectedCourse.courseTitle}
                  width={800}
                  height={400}
                  className="w-full h-64 object-cover rounded-lg"
                />
                
                <div className="absolute top-4 right-4">
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(selectedCourse.progress)}`}>
                    {getStatusText(getProgressStatus(selectedCourse.progress))}
                  </span>
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedCourse.courseTitle}
                </h2>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <LucideCalendar className="w-5 h-5 mr-3 text-primary-500" />
                    <span>Started on {formatDate(selectedCourse.startDate)}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <LucideClock className="w-5 h-5 mr-3 text-primary-500" />
                    <span>Last accessed {formatDate(selectedCourse.lastAccessed)}</span>
                  </div>
                  
                  {selectedCourse.instructor && (
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <LucideUser className="w-5 h-5 mr-3 text-primary-500" />
                      <span>{selectedCourse.instructor}</span>
                    </div>
                  )}
                  
                  {selectedCourse.category && (
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <LucideBookmark className="w-5 h-5 mr-3 text-primary-500" />
                      <span>{selectedCourse.category}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Progress</h3>
                <div className="mb-2 flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Completed {selectedCourse.completedLessons} of {selectedCourse.totalLessons} lessons</span>
                  <span>{selectedCourse.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
                  <div 
                    className="bg-primary-600 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                    style={{ width: `${selectedCourse.progress}%` }}
                  >
                    {selectedCourse.progress >= 20 && (
                      <span className="text-xs text-white font-medium">{selectedCourse.progress}%</span>
                    )}
                  </div>
                </div>
              </div>
              
              {selectedCourse.estimatedCompletionDate && (
                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg">
                  <h3 className="text-md font-semibold mb-1 text-blue-700 dark:text-blue-400">Estimated Completion</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    At your current pace, you'll complete this course by {formatDate(selectedCourse.estimatedCompletionDate)}.
                  </p>
                </div>
              )}
              
              <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => {
                    setIsDetailsModalOpen(false);
                    handleContinueCourse(selectedCourse.courseId);
                  }}
                  leftIcon={<LucideBook size={18} />}
                >
                  {selectedCourse.progress === 0 ? 'Start Course' : 'Continue Learning'}
                </Button>
              </div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentProgressTracking; 