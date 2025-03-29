"use client";
import React, { useEffect, useState } from "react";
import EnrollCoursesCard from "./EnrollCoursesCard";
import { useRouter } from "next/navigation";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronLeft, ChevronRight, Loader, Search, AlertCircle, Sparkles, Video, Users, Zap } from "lucide-react";
import { getCourseById } from "@/apis/course/course";

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Define TypeScript interfaces
interface Enrollment {
  _id: string;
  course_id: string;
  course_title: string;
  course_image: string;
  progress: number;
  last_accessed: string;
  completion_status: 'completed' | 'in_progress' | 'not_started';
  payment_status: string;
  expiry_date?: string;
  enrollment_type: string;
  is_self_paced: boolean;
  completed_lessons: string[];
  lessons: any[];
  remaining_time?: string;
  completion_criteria?: {
    required_progress: number;
    required_assignments: boolean;
    required_quizzes: boolean;
  };
}

// Helper function to get the auth token
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper function to calculate remaining time
const calculateRemainingTime = (expiryDate?: string): string | null => {
  if (!expiryDate) return null;
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - now.getTime();
  
  if (diffTime <= 0) return 'Expired';
  
  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (days > 30) {
    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? 's' : ''} remaining`;
  }
  return `${days} day${days > 1 ? 's' : ''} remaining`;
};

const EnrollCourses = () => {
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { getQuery } = useGetQuery();
  const [retryCount, setRetryCount] = useState({});
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000; // 1 second
  const [abortController, setAbortController] = useState(null);
  const [invalidCourses, setInvalidCourses] = useState([]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const handleCardClick = (id: string) => {
    router.push(`/integrated-lessons/${id}`);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      const token = getAuthToken();
      
      if (!storedUserId || !token) {
        setError("Please log in to view your enrolled courses.");
        return;
      }
      
      setStudentId(storedUserId);
    }
  }, []);

  const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

  // Cleanup function for aborting pending requests
  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [abortController]);

  const fetchCourseWithRetry = async (courseId: string, enrollment: any, headers: Record<string, string>, attempt = 1) => {
    // Create AbortController *inside* the function for each distinct call
    const controller = new AbortController();

    try {
      // Use the directly imported function to get the URL
      const courseApiUrl = getCourseById(courseId);
      console.log(`Fetching course data from: ${courseApiUrl}, attempt ${attempt}`);

      // Make the API call using getQuery or axios directly if needed
      const courseResponse = await getQuery({ 
        url: courseApiUrl,
        method: 'GET',
        headers,
        signal: controller.signal,
        validateStatus: (status: number) => {
          return status === 200; // Only treat 200 as success
        }
      });
      
      // Check for null response
      if (!courseResponse) {
        console.warn(`Null response received for course ID: ${courseId}`);
        return null;
      }
      
      // Extract course data, checking both possible response formats
      const courseData = courseResponse?.data || courseResponse?.course;
      
      if (!courseData || !courseData._id) {
        console.warn(`Invalid course data structure received for course ID: ${courseId}`, courseData);
        return null;
      }
      
      return courseData;
    } catch (error: any) {
      // Check if the error was due to aborting *this specific request*
      if (error.name === 'AbortError' || error.name === 'CanceledError') { 
        console.log(`Request for course ${courseId} was aborted.`);
        return null; // Return null if aborted, don't retry
      }

      // Handle 404 errors specifically
      if (error.response?.status === 404) {
        console.warn(`Course not found (404) for ID: ${courseId}`);
        return null;
      }
      
      // Log other types of errors
      console.error(`Error fetching course ${courseId}:`, {
        status: error.response?.status,
        message: error.message,
        url: error.config?.url
      });
      
      if (attempt < MAX_RETRIES) {
        console.log(`Retrying fetch for course ${courseId}, attempt ${attempt + 1}`);
        await sleep(RETRY_DELAY * attempt);
        return fetchCourseWithRetry(courseId, enrollment, headers, attempt + 1);
      } else {
        console.error(`Max retries reached for course ${courseId}`);
        setInvalidCourses((prev: string[]) => [...prev, courseId]); // Track courses that failed persistently
      }
      
      return null; // Return null instead of throwing to prevent cascade failures
    }
  };

  const fetchEnrolledCourses = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      setInvalidCourses([]);
      
      const token = getAuthToken();
      
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        setLoading(false);
        return;
      }
      
      const headers = {
        'x-access-token': token,
        'Content-Type': 'application/json'
      };
      
      const paymentApiUrl = apiUrls.payment.getStudentPayments(id, { page: 1, limit: 100 });
      console.log(`Fetching enrollments from: ${paymentApiUrl}`);
      
      await getQuery({
        url: paymentApiUrl,
        headers,
        validateStatus: (status: number) => status === 200,
        onSuccess: async (response: any) => {
          if (!response?.success || !response?.data?.enrollments) {
            console.warn('Invalid enrollment response structure:', response);
            setError("Unable to load enrollment data. Please try again later.");
            setLoading(false);
            return;
          }

          // First collect all course IDs for batch fetching
          const courseIds = response.data.enrollments
            .filter((enrollment: any) => enrollment.course_id)
            .map((enrollment: any) => enrollment.course_id);
          
          console.log(`Found ${courseIds.length} course IDs to fetch details for`);
          
          // Create a map to store course details by ID
          const courseDetailsMap: Record<string, any> = {};

          // Fetch course details in batches
          for (const courseId of courseIds) {
            try {
              const courseData = await fetchCourseWithRetry(courseId, null, headers);
              if (courseData) {
                courseDetailsMap[courseId] = courseData;
              }
            } catch (error) {
              console.error(`Error fetching course ${courseId}:`, error);
            }
          }

          // Map enrollments with course details
          const enrollmentsData = response.data.enrollments
            .filter((enrollment: any) => enrollment.course_id)
            .map((enrollment: any) => {
              const courseDetails = courseDetailsMap[enrollment.course_id] || {};
              
              return {
                _id: enrollment._id,
                course_id: enrollment.course_id,
                course_title: courseDetails.course_title || enrollment.course_title || "Untitled Course",
                course_image: courseDetails.course_image || enrollment.course_image || "",
                course_description: courseDetails.course_description || enrollment.course_description || "",
                progress: enrollment.progress || 0,
                last_accessed: enrollment.last_accessed || enrollment.updatedAt,
                completion_status: enrollment.is_completed ? 'completed' : 
                  (enrollment.progress > 0 || enrollment.completed_lessons?.length > 0) ? 'in_progress' : 'not_started',
                payment_status: enrollment.payment_status,
                expiry_date: enrollment.expiry_date,
                remaining_time: calculateRemainingTime(enrollment.expiry_date),
                enrollment_type: enrollment.enrollment_type || 'Self-Paced',
                is_self_paced: enrollment.is_self_paced,
                completed_lessons: enrollment.completed_lessons || [],
                lessons: courseDetails.curriculum || courseDetails.lessons || enrollment.lessons || [],
                completion_criteria: enrollment.completion_criteria || {
                  required_progress: 100,
                  required_assignments: true,
                  required_quizzes: true
                }
              };
            });
          
          console.log('Processed enrollments with course details:', enrollmentsData);
          setEnrollments(enrollmentsData);
          setLoading(false);
        },
        onError: (error: any) => {
          console.error('Error fetching enrollments:', {
            status: error.response?.status,
            message: error.message,
            url: error.config?.url
          });
          
          if (error?.response?.status === 401) {
            setError("Your session has expired. Please log in again.");
          } else if (error?.response?.status === 404) {
            setEnrollments([]); // No enrollments found for the student
            setError(null); 
          } else {
            setError("Failed to load enrolled courses. Please try again later.");
          }
          setLoading(false);
        },
      });
    } catch (error) {
      console.error("Unexpected error in fetchEnrolledCourses:", error);
      setError("An unexpected error occurred. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchEnrolledCourses(studentId);
    }
  }, [studentId]);

  const filteredCourses = enrollments.filter(course => 
    course.course_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log("Filtered courses before render:", filteredCourses);

  // Clean up function when component unmounts
  useEffect(() => {
    return () => {
      setEnrollments([]);
      setError(null);
      setLoading(false);
      setInvalidCourses([]);
    };
  }, []);

  // Helper to get icon based on enrollment type
  const getTypeIcon = (type?: string) => {
    if (!type) return <Zap className="w-3 h-3 mr-1" />;
    
    switch (type.toLowerCase()) {
      case 'live': return <Zap className="w-3 h-3 mr-1" />;
      default: return <Zap className="w-3 h-3 mr-1" />;
    }
  };

  return (
    <section className="py-12 md:py-16 relative overflow-hidden">
      {/* Modern background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-25 dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]"></div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center space-x-1 mb-4">
            <span className="h-px w-8 bg-primary-500/50"></span>
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400 tracking-wider uppercase">
              My Learning Journey
            </span>
            <span className="h-px w-8 bg-primary-500/50"></span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-4">
            Your Enrolled Courses
          </h2>
          <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            Pick up where you left off or explore your completed courses.
          </p>
        </div>

        {/* Search Section - Simplified */}
        <div className="flex items-center justify-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full max-w-lg"
          >
            <input
              type="text"
              placeholder="Search your enrolled courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 backdrop-blur-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent pl-11 shadow-sm"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </motion.div>
          {/* Removed View All Button */}
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center gap-2 backdrop-blur-lg max-w-3xl mx-auto"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium flex-grow">{error}</p>
          </motion.div>
        )}

        {/* Loading State */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-[300px] flex flex-col items-center justify-center gap-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"
            />
            <p className="text-gray-600 dark:text-gray-400 animate-pulse">
              Loading your courses...
            </p>
          </motion.div>
        ) : filteredCourses.length === 0 ? (
          // No Courses Found / Empty State
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-[300px] flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-white dark:bg-gray-800/50 backdrop-blur-lg border border-gray-100 dark:border-gray-700/50 shadow-lg max-w-2xl mx-auto"
          >
            <div className="w-20 h-20 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-6">
              <BookOpen className="w-10 h-10 text-primary-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {searchTerm ? "No matching courses found" : "No Enrolled Courses Yet"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
              {searchTerm 
                ? "Try adjusting your search terms." 
                : "Start your learning journey by enrolling in our wide range of courses."}
            </p>
            {!searchTerm && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/courses')} // Assuming '/courses' is the path to browse all courses
                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/25 flex items-center gap-2"
              >
                Browse Courses
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            )}
          </motion.div>
        ) : (
          // Swiper Slider Implementation
          <motion.div 
            variants={containerVariants}
            className="relative group"
          >
            <Swiper
              modules={[Navigation, Pagination, A11y]}
              spaceBetween={30} // Spacing between slides
              slidesPerView={1} // Default for mobile
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              pagination={{ 
                  clickable: true,
                  dynamicBullets: true,
              }}
              breakpoints={{
                // when window width is >= 640px
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20
                },
                // when window width is >= 768px
                768: {
                  slidesPerView: 2,
                  spaceBetween: 30
                },
                // when window width is >= 1024px
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 30
                },
                 // when window width is >= 1280px
                 1280: {
                    slidesPerView: 4,
                    spaceBetween: 30
                }
              }}
              className="pb-12" // Add padding bottom for pagination bullets
            >
              <AnimatePresence>
                {filteredCourses.map((course) => {
                  console.log("Rendering course in Swiper:", course);
                  return (
                    <SwiperSlide key={course._id} className="h-auto">
                      <motion.div
                        variants={cardVariants}
                        onHoverStart={() => setIsHovered(course._id)}
                        onHoverEnd={() => setIsHovered(null)}
                        layout
                        className="h-full"
                      >
                        <EnrollCoursesCard
                          title={course.course_title}
                          image={course.course_image}
                          progress={course.progress}
                          lastAccessed={course.last_accessed}
                          status={course.completion_status}
                          onClick={() => handleCardClick(course.course_id)}
                          isHovered={isHovered === course._id}
                          paymentStatus={course.payment_status}
                          remainingTime={course.remaining_time}
                          completionCriteria={course.completion_criteria}
                          completedLessons={course.completed_lessons}
                          totalLessons={course.lessons?.length || 0}
                          enrollmentType={course.enrollment_type}
                          courseId={course.course_id}
                          typeIcon={getTypeIcon(course.enrollment_type)}
                        />
                      </motion.div>
                    </SwiperSlide>
                  );
                })}
              </AnimatePresence>
            </Swiper>

            {/* Custom Navigation Buttons */}
            <button className="swiper-button-prev-custom absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-8 p-3 bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed z-10">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="swiper-button-next-custom absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-8 p-3 bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed z-10">
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* Display count of courses that failed to load */}
        {invalidCourses.length > 0 && (
           <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400"
          >
            Note: {invalidCourses.length} course(s) could not be loaded due to missing data.
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default EnrollCourses;
