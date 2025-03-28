"use client";
import React, { useEffect, useState } from "react";
import EnrollCoursesCard from "./EnrollCoursesCard";
import { useRouter } from "next/navigation";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen, Loader2, Search, AlertCircle, Calendar, Clock, CheckCircle2 } from "lucide-react";

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

const StudentEnrollCourses = () => {
  const router = useRouter();
  const [enrollCourses, setEnrollCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isHovered, setIsHovered] = useState(null);
  const [abortController, setAbortController] = useState(null);
  const { getQuery } = useGetQuery();

  // Constants
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000;
  const BATCH_SIZE = 3;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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

  // Cleanup function for aborting pending requests
  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [abortController]);

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Effect to initialize studentId
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

  // Effect to fetch courses when studentId is available
  useEffect(() => {
    if (studentId) {
      fetchEnrolledCourses(studentId);
    }
  }, [studentId]);

  // Clean up function when component unmounts
  useEffect(() => {
    return () => {
      setEnrollCourses([]);
      setError(null);
      setLoading(false);
    };
  }, []);

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
        limit: 20 // Show more courses on the full page view
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

          // Process enrollments in batches
          const processedEnrollments = [];
          for (let i = 0; i < enrollments.length; i += BATCH_SIZE) {
            const batch = enrollments.slice(i, i + BATCH_SIZE);
            console.log(`Processing batch ${Math.floor(i/BATCH_SIZE) + 1} of ${Math.ceil(enrollments.length/BATCH_SIZE)}`);
            
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
                    learning_path: enrollment.learning_path
                  };
                } catch (error) {
                  console.error(`Error fetching course details for enrollment ${enrollment._id}:`, error);
                  return null;
                }
              })
            );
            
            const validResults = batchResults.filter(Boolean);
            console.log(`Batch ${Math.floor(i/BATCH_SIZE) + 1} results: ${validResults.length} valid courses`);
            processedEnrollments.push(...validResults);
            
            // Add a small delay between batches
            if (i + BATCH_SIZE < enrollments.length) {
              await sleep(500);
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

  const handleCardClick = (id) => {
    router.push(`/dashboards/my-courses/${id}`);
  };

  const filteredCourses = enrollCourses.filter(course => 
    course.course_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      const courseData = courseResponse?.course || courseResponse?.data;
      
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

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto p-8 mt-[-40px]"
    >
      <div className="flex flex-col space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <motion.button
              onClick={() => router.push("/dashboards/my-courses")}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </motion.button>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                <BookOpen className="w-6 h-6 text-primary-500 dark:text-primary-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
                Enrolled Courses
              </h2>
            </div>
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

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5" />
            {error}
          </motion.div>
        )}

        {/* Courses Grid */}
        {loading ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="flex items-center gap-3"
            >
              <Loader2 className="w-6 h-6 text-primary-500" />
              <span className="text-gray-600 dark:text-gray-400">Loading your courses...</span>
            </motion.div>
          </div>
        ) : filteredCourses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-[300px] flex flex-col items-center justify-center text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl"
          >
            <div className="p-4 rounded-full bg-primary-50 dark:bg-primary-900/20 mb-4">
              <BookOpen className="w-8 h-8 text-primary-500 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchTerm ? "No matching courses found" : "No Enrolled Courses Yet"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              {searchTerm 
                ? "Try adjusting your search terms or view all courses"
                : "Start your learning journey by enrolling in our courses. We have a wide range of options to choose from."}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/courses')}
              className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              Browse Courses
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredCourses.map((course) => (
                <motion.div
                  key={course._id}
                  variants={cardVariants}
                  layout
                  onHoverStart={() => setIsHovered(course._id)}
                  onHoverEnd={() => setIsHovered(null)}
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
                    completedLessons={course.completed_lessons?.length || 0}
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
      </div>
    </motion.div>
  );
};

export default StudentEnrollCourses;
