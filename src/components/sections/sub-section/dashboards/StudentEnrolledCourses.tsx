"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, FileVideo, FileText, BookOpen, Video, File, Search, Calendar, Clock, Star, Award, CheckCircle, Eye, Play, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import defaultCourseImage from "@/assets/images/resources/img5.png";
import { getUserId, sanitizeAuthData } from "@/utils/auth";
import { useRouter } from "next/navigation";

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

// Course Card Component - matching completed courses style
const CourseCard = ({ course, onViewMaterials }: { course: Course; onViewMaterials: (course: Course) => void }) => {
  const router = useRouter();

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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 
            className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            onClick={handleTitleClick}
          >
            {course?.course_title || "No Title Available"}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            by {course?.assigned_instructor?.full_name || "No instructor"}
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

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>Progress</span>
          <span>{course?.progress || 25}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${course?.progress || 25}%` }}
          ></div>
        </div>
      </div>

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
  const { getQuery } = useGetQuery();

  // Refresh function
  const refreshCourses = async () => {
    const userId = getUserId();
    if (userId) {
      setIsLoading(true);
      setError(null);
      await fetchEnrolledCourses(userId);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // First sanitize any invalid auth data
        sanitizeAuthData();
        
        const userId = getUserId();
        if (!userId) {
          console.error("User ID not found");
          setError("Please log in to view your enrolled courses");
          setIsLoading(false);
          
          // Redirect to login after a short delay
          setTimeout(() => {
            window.location.href = "/login?redirect=" + encodeURIComponent(window.location.pathname);
          }, 2000);
          return;
        }

        if (!apiUrls?.enrolledCourses?.getEnrollmentsByStudent) {
          setError("API endpoint not configured properly");
          setIsLoading(false);
          return;
        }

        await fetchEnrolledCourses(userId);
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
      const response =         await getQuery({
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
            toast.error("Error processing course data");
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
          toast.error("Failed to fetch enrolled courses. Please try again.");
        },
      });
      
      return response;
    } catch (err) {
      console.error("Error in fetchEnrolledCourses:", err);
      toast.error("An unexpected error occurred while fetching courses");
      return null;
    }
  };



  const tabs = [
    { name: "All Courses", content: enrolledCourses, icon: BookOpen },
    { name: "Live Courses", content: liveCourses, icon: Video },
    { name: "Self-Paced", content: selfPacedCourses, icon: Clock },
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
      showToast.success(`Downloading ${fileName}`);
    } catch (err) {
      console.error("Error downloading file:", err);
      toast.error("Failed to download file. Please try again.");
    }
  };

  const filteredContent = tabs[currentTab].content.filter(course => 
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
              Enrolled Courses
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
            Continue your learning journey and access course materials
          </p>

          {/* Search Bar */}
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
        </div>

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