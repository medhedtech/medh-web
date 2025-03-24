"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import RecordedCard from "./RecordedCourses";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Search, ChevronRight, Loader2, AlertCircle, BookOpenCheck } from "lucide-react";
import { toast } from "react-toastify";

const RecordedSessions = () => {
  const router = useRouter();
  const [recordedSessions, setRecordedSessions] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
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

  const itemVariants = {
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

  // Get auth token
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  useEffect(() => {
    const fetchRecordedSessions = async () => {
      setIsLoading(true);
      setError(null);
      
      if (typeof window !== "undefined") {
        const storedUserId = localStorage.getItem("userId");
        const token = getAuthToken();
        
        if (!storedUserId || !token) {
          setError("Please log in to view your recorded sessions.");
          setIsLoading(false);
          return;
        }
        
        setStudentId(storedUserId);
        
        try {
          const headers = {
            'x-access-token': token,
            'Content-Type': 'application/json'
          };
          
          // Use the correct API endpoint to fetch recorded videos
          await getQuery({
            url: apiUrls?.courses?.getRecordedVideosForUser(storedUserId),
            headers,
            onSuccess: (response) => {
              const recordedData = response?.courses || response?.data?.courses || response;
              
              if (Array.isArray(recordedData)) {
                setRecordedSessions(recordedData);
              } else {
                console.warn("Unexpected response format:", response);
                setRecordedSessions([]);
              }
              
              setIsLoading(false);
            },
            onFail: (error) => {
              console.error("Error fetching recorded sessions:", error);
              
              if (error?.response?.status === 401) {
                setError("Your session has expired. Please log in again.");
                toast.error("Your session has expired. Please log in again.");
              } else if (error?.response?.status === 404) {
                setRecordedSessions([]);
              } else {
                setError("Failed to load recorded sessions. Please try again later.");
                toast.error("Failed to load recorded sessions. Please try again later.");
              }
              
              setIsLoading(false);
            }
          });
        } catch (error) {
          console.error("Error in fetchRecordedSessions:", error);
          setError("An unexpected error occurred. Please try again later.");
          toast.error("An unexpected error occurred. Please try again later.");
          setIsLoading(false);
        }
      }
    };

    fetchRecordedSessions();
  }, []);

  const handleCardClick = (id) => {
    router.push(`/dashboards/my-courses/${id}`);
  };

  const filteredSessions = recordedSessions.filter(course =>
    course?.course_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="flex items-center gap-3"
        >
          <Loader2 className="w-6 h-6 text-primary-500" />
          <span className="text-gray-600 dark:text-gray-400">Loading recorded sessions...</span>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center max-w-md"
        >
          <div className="p-4 rounded-full bg-red-50 dark:bg-red-900/20 mb-4">
            <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {error}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We couldn't load your recorded sessions. Please try refreshing the page or logging in again.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            Refresh Page
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto p-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <motion.div 
          variants={itemVariants}
          className="flex items-center gap-3"
        >
          <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20">
            <Video className="w-6 h-6 text-primary-500 dark:text-primary-400" />
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
            Your Recorded Sessions
          </h2>
        </motion.div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Search Bar */}
          <motion.div 
            variants={itemVariants}
            className="relative w-full sm:w-64"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
            />
          </motion.div>

          {/* View All Link */}
          <motion.a
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="/dashboards/access-recorded-sessions"
            className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium transition-colors"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </motion.a>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {filteredSessions.length > 0 ? (
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {filteredSessions.map((course, index) => (
              <motion.div
                key={course?._id}
                variants={itemVariants}
                layout
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <RecordedCard
                  course_title={course?.course_title}
                  course_tag={course?.course_tag || "Recorded Session"}
                  course_image={course?.course_image}
                  onClick={() => handleCardClick(course?._id)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl"
          >
            <div className="p-4 rounded-full bg-primary-50 dark:bg-primary-900/20 mb-4">
              <BookOpenCheck className="w-8 h-8 text-primary-500 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchTerm ? "No sessions found" : "No recorded sessions available"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
              {searchTerm 
                ? "Try adjusting your search term to find what you're looking for."
                : "You don't have any recorded sessions available from your enrolled courses yet."}
            </p>
            <button
              onClick={() => router.push('/courses')}
              className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              Browse Courses
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RecordedSessions;
