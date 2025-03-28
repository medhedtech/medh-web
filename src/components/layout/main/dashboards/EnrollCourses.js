"use client";
import React, { useEffect, useState } from "react";
import EnrollCoursesCard from "./EnrollCoursesCard";
import { useRouter } from "next/navigation";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronRight, Loader, Search, AlertCircle, Sparkles } from "lucide-react";

// Helper function to get the auth token
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper function to calculate remaining time
const calculateRemainingTime = (expiryDate) => {
  if (!expiryDate) return null;
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry - now;
  
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
  const [enrollCourses, setEnrollCourses] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isHovered, setIsHovered] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
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

  const handleCardClick = (id) => {
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

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Cleanup function for aborting pending requests
  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [abortController]);

  const fetchCourseWithRetry = async (courseId, enrollment, headers, attempt = 1) => {
    try {
      // Create new AbortController for this request
      const controller = new AbortController();
      setAbortController(controller);

      // Ensure courseId is properly formatted
      if (!courseId || typeof courseId !== 'string') {
        console.warn(`Invalid course ID format: ${courseId}`);
        return null;
      }

      // Log the API URL being called
      const courseUrl = apiUrls.courses.getCourseById(courseId);
      console.log(`Fetching course data from: ${courseUrl}`);

      const courseResponse = await getQuery({
        url: courseUrl,
        headers,
        signal: controller.signal,
        validateStatus: (status) => {
          return status === 200; // Only treat 200 as success
        }
      });
      
      // Clear the controller after successful request
      setAbortController(null);
      
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
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request was aborted');
        return null;
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
      }
      
      return null; // Return null instead of throwing to prevent cascade failures
    }
  };

  const fetchEnrolledCourses = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
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
      
      // Log the payments API URL being called
      const paymentApiUrl = apiUrls.payment.getStudentPayments(id, { 
        page: 1, 
        limit: 8
      });
      console.log(`Fetching enrollments from: ${paymentApiUrl}`);
      
      await getQuery({
        url: paymentApiUrl,
        headers,
        validateStatus: (status) => {
          return status === 200; // Only treat 200 as success
        },
        onSuccess: async (response) => {
          if (!response?.success || !response?.data?.enrollments) {
            console.warn('Invalid enrollment response structure:', response);
            setError("Unable to load enrollment data. Please try again later.");
            setLoading(false);
            return;
          }

          const enrollments = response.data.enrollments;
          console.log('Fetched enrollments:', enrollments.length);
          
          if (enrollments.length === 0) {
            setEnrollCourses([]);
            setLoading(false);
            return;
          }

          // Process enrollments in batches of 3
          const processedEnrollments = [];
          for (let i = 0; i < enrollments.length; i += 3) {
            const batch = enrollments.slice(i, i + 3);
            console.log(`Processing batch ${Math.floor(i/3) + 1} of ${Math.ceil(enrollments.length/3)}`);
            
            const batchResults = await Promise.all(
              batch.map(async (enrollment) => {
                if (!enrollment.course_id) {
                  console.warn('Missing course_id in enrollment:', enrollment._id);
                  return null;
                }
                
                try {
                  const courseData = await fetchCourseWithRetry(enrollment.course_id, enrollment, headers);
                  if (!courseData) {
                    console.warn(`No course data returned for enrollment ${enrollment._id}`);
                    return null;
                  }
                  
                  console.log(`Successfully fetched course data for enrollment ${enrollment._id}: ${courseData.course_title}`);
                  
                  return {
                    _id: courseData._id,
                    course_title: courseData.course_title,
                    course_description: courseData.course_description,
                    course_image: courseData.course_image,
                    course_category: courseData.course_category,
                    course_grade: courseData.course_grade,
                    course_fee: courseData.course_fee,
                    lessons: courseData.curriculum || [],
                    progress: enrollment.progress || 0,
                    last_accessed: enrollment.last_accessed || enrollment.updatedAt,
                    completion_status: enrollment.is_completed ? 'completed' : 
                      (enrollment.progress > 0 || enrollment.completed_lessons?.length > 0) ? 'in_progress' : 'not_started',
                    enrollment_id: enrollment._id,
                    payment_status: enrollment.payment_status,
                    is_self_paced: enrollment.is_self_paced,
                    expiry_date: enrollment.expiry_date,
                    remaining_time: calculateRemainingTime(enrollment.expiry_date),
                    completion_criteria: enrollment.completion_criteria || {
                      required_progress: 100,
                      required_assignments: true,
                      required_quizzes: true
                    },
                    completed_lessons: enrollment.completed_lessons || [],
                    completed_assignments: enrollment.completed_assignments || [],
                    completed_quizzes: enrollment.completed_quizzes || [],
                    enrollment_type: enrollment.enrollment_type,
                    batch_size: enrollment.batch_size,
                    learning_path: enrollment.learning_path,
                    payment_details: enrollment.payment_details,
                    enrollment_date: enrollment.enrollment_date,
                    status: enrollment.status,
                    is_certified: enrollment.is_certified,
                    notes: enrollment.notes || [],
                    bookmarks: enrollment.bookmarks || [],
                    assignment_submissions: enrollment.assignment_submissions || [],
                    quiz_submissions: enrollment.quiz_submissions || []
                  };
                } catch (error) {
                  console.error(`Error fetching course details for enrollment ${enrollment._id}:`, error);
                  return null;
                }
              })
            );
            
            const validResults = batchResults.filter(Boolean);
            console.log(`Batch ${Math.floor(i/3) + 1} results: ${validResults.length} valid courses`);
            processedEnrollments.push(...validResults);
            
            // Add a small delay between batches
            if (i + 3 < enrollments.length) {
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          }
          
          console.log('Final processed courses:', processedEnrollments.length);
          setEnrollCourses(processedEnrollments);
          
          if (processedEnrollments.length === 0) {
            setError("Unable to load your enrolled courses. Please try again later.");
          } else {
            setError(null);
          }
          setLoading(false);
        },
        onError: (error) => {
          console.error('Error fetching enrollments:', {
            status: error.response?.status,
            message: error.message,
            url: error.config?.url
          });
          
          if (error?.response?.status === 401) {
            setError("Your session has expired. Please log in again.");
          } else if (error?.response?.status === 404) {
            setEnrollCourses([]);
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

  const filteredCourses = enrollCourses.filter(course => 
    course.course_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Clean up function when component unmounts
  useEffect(() => {
    return () => {
      setEnrollCourses([]);
      setError(null);
      setLoading(false);
      setInvalidCourses([]);
    };
  }, []);

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
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center space-x-1 mb-4">
            <span className="h-px w-8 bg-primary-500/50"></span>
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400 tracking-wider uppercase">
              My Learning
            </span>
            <span className="h-px w-8 bg-primary-500/50"></span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-4">
            Enrolled Courses
          </h2>
          <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            Continue your learning journey with your enrolled courses
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative w-full sm:w-auto"
          >
            <input
              type="text"
              placeholder="Search your courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 backdrop-blur-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent pl-11"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </motion.div>

          <motion.a
            href="/dashboards/enrolled-courses"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-xl font-medium transition-all duration-200 hover:bg-primary-100 dark:hover:bg-primary-900/40"
          >
            <Sparkles className="w-4 h-4" />
            View All Courses
            <ChevronRight className="w-4 h-4" />
          </motion.a>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center gap-2 backdrop-blur-lg"
          >
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-medium">{error}</p>
          </motion.div>
        )}

        {/* Loading State */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-[400px] flex flex-col items-center justify-center gap-4"
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-white dark:bg-gray-800/50 backdrop-blur-lg border border-gray-100 dark:border-gray-700/50 shadow-lg"
          >
            <div className="w-20 h-20 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-6">
              <BookOpen className="w-10 h-10 text-primary-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {searchTerm ? "No matching courses found" : "No Enrolled Courses Yet"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
              {searchTerm 
                ? "Try adjusting your search terms or view all courses"
                : "Start your learning journey by enrolling in our courses. We have a wide range of options to choose from."}
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/courses')}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/25 flex items-center gap-2"
            >
              Browse Courses
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredCourses.map((course) => (
                <motion.div
                  key={course._id}
                  variants={cardVariants}
                  onHoverStart={() => setIsHovered(course._id)}
                  onHoverEnd={() => setIsHovered(null)}
                  layout
                >
                  <EnrollCoursesCard
                    title={course.course_title}
                    image={course.course_image}
                    isLive={!course.is_self_paced}
                    progress={course.progress}
                    lastAccessed={course.last_accessed}
                    status={course.completion_status}
                    onClick={() => handleCardClick(course._id)}
                    isHovered={isHovered === course._id}
                    paymentStatus={course.payment_status}
                    remainingTime={course.remaining_time}
                    completionCriteria={course.completion_criteria}
                    completedLessons={course.completed_lessons}
                    totalLessons={course.lessons?.length || 0}
                    enrollmentType={course.enrollment_type}
                    learningPath={course.learning_path}
                    courseId={course._id}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default EnrollCourses;
