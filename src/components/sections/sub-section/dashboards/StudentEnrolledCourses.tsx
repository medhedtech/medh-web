"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, FileVideo, FileText, BookOpen, Video, File, Search } from "lucide-react";
import { toast } from "react-toastify";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import defaultCourseImage from "@/assets/images/resources/img5.png";

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
  <motion.button
    onClick={onClick}
    className={`px-6 py-2.5 font-medium text-lg rounded-full transition-all duration-200 ${
      active 
        ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400" 
        : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
    }`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    {children}
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
        
        const storedUserId = localStorage.getItem("userId");
        if (!storedUserId) {
          setError("User ID not found. Please log in again.");
          setIsLoading(false);
          return;
        }

        if (!apiUrls?.enrolledCourses?.getEnrollmentCountsByStudentId) {
          setError("API endpoint not configured properly");
          setIsLoading(false);
          return;
        }

        await fetchEnrolledCourses(storedUserId);
        await fetchSelfPacedCourses(storedUserId);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const fetchEnrolledCourses = async (studentId: string) => {
    try {
      const response = await getQuery({
        url: `${apiUrls.enrolledCourses.getEnrollmentCountsByStudentId}/${studentId}`,
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
    try {
      const response = await getQuery({
        url: `${apiUrls.enrolledCourses.getEnrollmentCountsByStudentId}/${studentId}`,
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
    { name: "Enrolled Courses", content: enrolledCourses },
    { name: "Live Courses", content: liveCourses },
    { name: "Self-Paced Courses", content: selfPacedCourses },
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20">
              <BookOpen className="w-6 h-6 text-primary-500 dark:text-primary-400" />
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
              Course Resources
            </h2>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            className="relative max-w-md w-full"
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
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab, idx) => (
            <TabButton
              key={idx}
              active={currentTab === idx}
              onClick={() => setCurrentTab(idx)}
            >
              {tab.name}
            </TabButton>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {filteredContent.length > 0 ? (
              filteredContent.map((course, index) => (
                <motion.div
                  key={course.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md dark:border-gray-700 rounded-xl transition-all duration-200"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="relative w-full md:w-[200px] h-[160px] rounded-lg overflow-hidden"
                    >
                      <Image
                        src={course?.course_image || defaultCourseImage.src}
                        alt={course?.course_title || "Course Image"}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                    <div className="flex-1 space-y-3">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {course?.course_title || "No Title Available"}
                      </h3>
                      <div className="space-y-1">
                        <p className="text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Instructor:</span>{" "}
                          {course?.assigned_instructor?.full_name || "N/A"}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Category:</span>{" "}
                          {course?.category || "N/A"}
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleDownload(course)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                      >
                        <File className="w-4 h-4" />
                        View Course Materials
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center text-center py-12"
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