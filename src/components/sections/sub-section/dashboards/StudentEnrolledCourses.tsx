"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, FileVideo, FileText, BookOpen, Video, File, Search, Calendar, Clock, Star, Award, CheckCircle, Eye, Play } from "lucide-react";
import { toast } from "react-toastify";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import defaultCourseImage from "@/assets/images/resources/img5.png";
import { getUserId, sanitizeAuthData } from "@/utils/auth";

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

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      active
        ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
    }`}
  >
    {children}
  </button>
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
const CourseCard = ({ course, onViewMaterials }: { course: Course; onViewMaterials: (course: Course) => void }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
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
      <button className="flex-1 flex items-center justify-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm">
        <Play className="w-4 h-4 mr-2" />
        Continue
      </button>
    </div>
  </div>
);

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

        if (!apiUrls?.enrolledCourses?.getEnrollmentCountsByStudent) {
          setError("API endpoint not configured properly");
          setIsLoading(false);
          return;
        }

        await fetchEnrolledCourses(userId);
        await fetchSelfPacedCourses(userId);
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
        url: apiUrls.enrolledCourses.getEnrollmentCountsByStudent(studentId),
        onSuccess: (data) => {
          if (!data) {
            console.warn("No data received from enrolled courses API");
            return;
          }
          
          try {
            // Handle different possible response structures
            let allCourses: Course[] = [];
            
            if (Array.isArray(data)) {
              // If data is an array of enrollments
              const mappedCourses = data.map((enrollment: any) => {
                if (enrollment.course_id) {
                  return {
                    id: enrollment.course_id._id || enrollment.course_id.id,
                    course_title: enrollment.course_id.course_title || "N/A",
                    assigned_instructor: {
                      full_name: enrollment.course_id.assigned_instructor?.full_name || "No instructor",
                    },
                    category: enrollment.course_id.category || "N/A",
                    course_image: enrollment.course_id.course_image || defaultCourseImage.src,
                    class_type: enrollment.course_id.class_type,
                    enrollment_date: enrollment.enrollment_date || new Date().toISOString(),
                    progress: Math.floor(Math.random() * 80) + 10, // Random progress for demo
                    duration: "8-12 weeks",
                    rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
                  } as Course;
                }
                return null;
              });
              
              // Filter out null values
              allCourses = mappedCourses.filter((course): course is Course => course !== null);
            } else if (data.enrolled_courses && Array.isArray(data.enrolled_courses)) {
              // If data has enrolled_courses array
              allCourses = data.enrolled_courses.map((course: any) => ({
                id: course.course_id?._id || course.course_id?.id,
                course_title: course.course_id?.course_title || "N/A",
                assigned_instructor: {
                  full_name: course.course_id?.assigned_instructor?.full_name || "No instructor",
                },
                category: course.course_id?.category || "N/A",
                course_image: course.course_id?.course_image || defaultCourseImage.src,
                class_type: course.course_id?.class_type,
                enrollment_date: course.enrollment_date || new Date().toISOString(),
                progress: Math.floor(Math.random() * 80) + 10, // Random progress for demo
                duration: "8-12 weeks",
                rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
              }));
            }
            
            setEnrolledCourses(allCourses);
            
            // Filter live courses
            const liveCoursesFiltered = allCourses.filter(
              (course: Course) => course.class_type === "Live Courses"
            );
            setLiveCourses(liveCoursesFiltered);
          } catch (parseError) {
            console.error("Error parsing enrolled courses data:", parseError);
            toast.error("Error processing course data");
          }
        },
        onFail: (error) => {
          console.error("Failed to fetch enrolled courses:", error);
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

  const fetchSelfPacedCourses = async (studentId: string) => {
    if (!studentId || studentId === "undefined") {
      console.error("Cannot fetch self-paced courses: studentId is invalid", studentId);
      return null;
    }
    
    try {
      const response = await getQuery({
        url: apiUrls.enrolledCourses.getEnrollmentCountsByStudent(studentId),
        onSuccess: (data) => {
          if (!data) {
            console.warn("No data received from self-paced courses API");
            return;
          }
          
          try {
            // Handle different possible response structures
            let enrolledCoursesData: any[] = [];
            
            if (data.enrolled_courses && Array.isArray(data.enrolled_courses)) {
              enrolledCoursesData = data.enrolled_courses;
            } else if (Array.isArray(data)) {
              enrolledCoursesData = data;
            }
            
            const selfPacedCourses = enrolledCoursesData
              .filter((course: any) => {
                // Check for self-paced flag in different possible locations
                return course.is_self_paced === true || 
                       course.course_id?.is_self_paced === true ||
                       course.class_type === "Self-Paced";
              })
              .map((course: any) => ({
                id: course.course_id?._id || course.course_id?.id || course._id,
                course_title: course.course_id?.course_title || course.course_title || "N/A",
                assigned_instructor: {
                  full_name: course.course_id?.assigned_instructor?.full_name || 
                            course.assigned_instructor?.full_name || 
                            "No instructor",
                },
                category: course.course_id?.category || course.category || "N/A",
                resource_pdfs: course.course_id?.resource_pdfs || course.resource_pdfs || [],
                resource_videos: course.course_id?.resource_videos || course.resource_videos || [],
                course_image: course.course_id?.course_image || course.course_image || defaultCourseImage.src,
              }));
              
            setSelfPacedCourses(selfPacedCourses);
          } catch (parseError) {
            console.error("Error parsing self-paced courses data:", parseError);
            toast.error("Error processing self-paced course data");
          }
        },
        onFail: (error) => {
          console.error("Failed to fetch self-paced courses:", error);
          toast.error("Failed to fetch self-paced courses. Please try again.");
        },
      });
      
      return response;
    } catch (err) {
      console.error("Error in fetchSelfPacedCourses:", err);
      toast.error("An unexpected error occurred while fetching self-paced courses");
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
      toast.success(`Downloading ${fileName}`);
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
            onClick={() => window.location.reload()}
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
            className="flex items-center justify-center mb-4"
          >
            <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 mr-3">
              <BookOpen className="w-8 h-8 text-primary-500 dark:text-primary-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Enrolled Courses
            </h1>
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

        {/* Tabs */}
        <div className="flex justify-center">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {tabs.map((tab, idx) => {
              const Icon = tab.icon;
              return (
                <TabButton
                  key={idx}
                  active={currentTab === idx}
                  onClick={() => setCurrentTab(idx)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.name}
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