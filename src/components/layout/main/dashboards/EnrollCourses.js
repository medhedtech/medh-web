"use client";
import React, { useEffect, useState } from "react";
import EnrollCoursesCard from "./EnrollCoursesCard";
import { useRouter } from "next/navigation";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronRight, Loader, Search } from "lucide-react";

// Helper function to get the auth token
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
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
    router.push(`/dashboards/my-courses/${id}`);
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
      
      const paymentApiUrl = apiUrls.payment.getStudentPayments(id, { 
        page: 1, 
        limit: 4 // Only fetch 4 items since we're displaying a limited set
      });
      
      await getQuery({
        url: paymentApiUrl,
        headers,
        onSuccess: (response) => {
          let courses = [];
          
          if (response?.success && response?.data?.enrollments) {
            const enrollments = response.data.enrollments || [];
            
            courses = enrollments
              .map((enrollment) => {
                const course = enrollment.course_id;
                if (!course) return null;
                
                return {
                  ...course,
                  _id: course._id || enrollment.course_id?._id,
                  progress: enrollment.course_progress || 0,
                  last_accessed: enrollment.last_accessed_at || enrollment.updatedAt || null,
                  completion_status: enrollment.is_completed ? "completed" : "in_progress",
                  enrollment_id: enrollment._id
                };
              })
              .filter(Boolean);
          }
          
          setEnrollCourses(courses);
          setError(null);
          setLoading(false);
        },
        onError: (error) => {
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

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto mt-[-40px] p-8"
    >
      <div className="flex items-center justify-between mb-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20">
            <BookOpen className="w-6 h-6 text-primary-500 dark:text-primary-400" />
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
            Enrolled Courses
          </h2>
        </motion.div>

        <div className="flex items-center gap-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </motion.div>

          <motion.a
            href="/dashboards/enrolled-courses"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </motion.a>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
        >
          {error}
        </motion.div>
      )}

      {loading ? (
        <div className="min-h-[300px] flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="flex items-center gap-3"
          >
            <Loader className="w-6 h-6 text-primary-500" />
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
                  isLive={course.course_tag === "Live"}
                  progress={course.progress}
                  lastAccessed={course.last_accessed}
                  status={course.completion_status}
                  onClick={() => handleCardClick(course._id)}
                  isHovered={isHovered === course._id}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EnrollCourses;
