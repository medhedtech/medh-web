"use client";
import React, { useEffect, useState } from "react";
import EnrollCoursesCard from "./EnrollCoursesCard";
import { useRouter } from "next/navigation";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Loader, Search, AlertCircle, Sparkles, Video, Users, Zap, ArrowRight } from "lucide-react";
import { getCourseById } from "@/apis/course/course";

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
  is_certified?: boolean;
  enrollment_status?: string;
}

// New interface for the API response
interface PaymentResponse {
  success: boolean;
  data: PaymentData[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface PaymentData {
  id: string;
  orderId: string;
  type: string;
  course: string;
  courseImage: string;
  price: {
    amount: number;
    currency: string;
  };
  expiryDate?: string;
  paymentType?: string;
  status?: string;
  enrollmentStatus?: string;
  enrollmentDate?: string;
  progress?: number;
  isCertified?: boolean;
  course_id?: {
    _id: string;
    course_title: string;
    course_image: string;
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
const calculateRemainingTime = (expiryDate?: string): string | undefined => {
  if (!expiryDate) return undefined;
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
  const [retryCount, setRetryCount] = useState<Record<string, number>>({});
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000; // 1 second
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [invalidCourses, setInvalidCourses] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

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
        config: {
          signal: controller.signal
        }
      });
      
      // Check for null response
      if (!courseResponse) {
        console.warn(`Null response received for course ID: ${courseId}`);
        return null;
      }
      
      // Extract course data, checking both possible response formats
      const courseData = courseResponse?.data || courseResponse;
      
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
        onSuccess: async (response: any) => {
          // Check if response is an array directly
          const paymentData = Array.isArray(response) ? response : 
                            (response?.data && Array.isArray(response.data)) ? response.data : 
                            null;
          
          if (!paymentData) {
            console.warn('Invalid enrollment response structure:', response);
            setError("Unable to load enrollment data. Please try again later.");
            setLoading(false);
            return;
          }

          // Process the API response format
          const enrollmentsData = paymentData.map((payment: PaymentData) => {
            // Determine completion status based on progress
            const progress = payment.progress || 0;
            const completionStatus: 'completed' | 'in_progress' | 'not_started' = 
              progress === 100 ? 'completed' : 
              (progress > 0) ? 'in_progress' : 'not_started';
            
            // Calculate remaining time if expiry date exists
            const remainingTime = payment.expiryDate ? calculateRemainingTime(payment.expiryDate) : undefined;
            
            // Handle cases where course_id might be null
            const courseId = payment.course_id?._id || payment.id;
            const courseTitle = payment.course_id?.course_title || payment.course || "Untitled Course";
            const courseImage = payment.course_id?.course_image || payment.courseImage || "";
            
            // Check if enrollment is active
            const isActive = payment.enrollmentStatus === 'active';
            
            // If enrollment is not active or course_id is null, add to invalid courses
            if (!isActive || !payment.course_id) {
              setInvalidCourses(prev => [...prev, payment.id]);
            }
            
            return {
              _id: payment.id,
              course_id: courseId,
              course_title: courseTitle,
              course_image: courseImage,
              progress: progress,
              last_accessed: payment.enrollmentDate || new Date().toISOString(),
              completion_status: completionStatus,
              payment_status: payment.status || 'completed',
              expiry_date: payment.expiryDate,
              remaining_time: remainingTime,
              enrollment_type: payment.paymentType === 'batch' ? 'Batch' : 'Individual',
              is_self_paced: true, // Assuming all courses are self-paced for now
              completed_lessons: [], // This would need to be fetched separately
              lessons: [], // This would need to be fetched separately
              completion_criteria: {
                required_progress: 100,
                required_assignments: true,
                required_quizzes: true
              },
              is_certified: payment.isCertified || false,
              enrollment_status: payment.enrollmentStatus || 'active'
            };
          });
          
          console.log('Processed enrollments with new format:', enrollmentsData);
          setEnrollments(enrollmentsData);
          setLoading(false);
        },
        onFail: (error: any) => {
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
          } else if (error?.response?.status === 500) {
            setError("Server error. Please try again later.");
          } else if (error?.response?.status === 503) {
            setError("Service temporarily unavailable. Please try again later.");
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

  // Function to refresh courses
  const handleRefresh = async () => {
    if (studentId) {
      setRefreshing(true);
      await fetchEnrolledCourses(studentId);
      setRefreshing(false);
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
      case 'batch': return <Users className="w-3 h-3 mr-1" />;
      case 'individual': return <Video className="w-3 h-3 mr-1" />;
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
          
          {/* Refresh Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="ml-3 p-3 rounded-full bg-white dark:bg-gray-800/80 backdrop-blur-sm shadow-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Refresh courses"
          >
            <motion.div
              animate={{ rotate: refreshing ? 360 : 0 }}
              transition={{ duration: refreshing ? 1 : 0, repeat: refreshing ? Infinity : 0, ease: "linear" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2v6h-6"></path>
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                <path d="M3 22v-6h6"></path>
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
              </svg>
            </motion.div>
          </motion.button>
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
            <button 
              onClick={handleRefresh}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2v6h-6"></path>
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                <path d="M3 22v-6h6"></path>
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
              </svg>
            </button>
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
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}
          </motion.div>
        ) : (
          // Grid Layout Implementation
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
          >
            <AnimatePresence>
              {filteredCourses.map((course, index) => {
                console.log("Rendering course in grid:", course);
                return (
                  <motion.div
                    key={course._id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ delay: index * 0.1 }}
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
                      is_certified={course.is_certified}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default EnrollCourses;
