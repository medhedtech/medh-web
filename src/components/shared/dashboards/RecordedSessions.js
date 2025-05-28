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
      <div className="relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-primary-600/5 dark:from-primary-500/[0.03] dark:to-primary-600/[0.03] rounded-3xl" />
        
        <div className="relative space-y-8">
          {/* Header Section */}
          <div className="flex items-center justify-between gap-6 mb-8 px-6 pt-8">
            {/* Left side - Icon and Title */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center gap-4"
            >
              <div className="p-3 rounded-2xl bg-gradient-to-br from-primary-500/10 to-primary-600/10 dark:from-primary-500/[0.07] dark:to-primary-600/[0.07] border border-primary-500/10 dark:border-primary-500/[0.05]">
                <Video className="w-6 h-6 text-primary-500 dark:text-primary-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Your Recorded Sessions
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Access your recorded course sessions anytime
                </p>
              </div>
            </motion.div>

            {/* Right side - Search and View All */}
            <div className="flex items-center gap-4">
              <motion.div 
                variants={itemVariants}
                className="relative"
              >
                <input
                  type="text"
                  placeholder="Search sessions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-72 px-4 py-2.5 pl-10 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 backdrop-blur-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </motion.div>
              
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/courses')}
                className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl transition-all duration-300 shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 flex items-center gap-2 whitespace-nowrap"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="min-h-[400px] flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-gray-800/50 backdrop-blur-lg shadow-lg"
              >
                <Loader2 className="w-6 h-6 text-primary-500" />
                <span className="text-gray-600 dark:text-gray-400 font-medium">Loading recorded sessions...</span>
              </motion.div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="min-h-[400px] flex items-center justify-center p-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center text-center max-w-md p-8 rounded-2xl bg-white dark:bg-gray-800/50 backdrop-blur-lg shadow-lg"
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
                  className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl transition-all duration-300 shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30"
                >
                  Refresh Page
                </button>
              </motion.div>
            </div>
          )}

          {/* Sessions Grid */}
          <AnimatePresence mode="wait">
            {!isLoading && !error && (
              filteredSessions.length > 0 ? (
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
                  className="flex flex-col items-center justify-center text-center py-16 bg-white dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-lg"
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
                    className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl transition-all duration-300 shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30"
                  >
                    Browse Courses
                  </button>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default RecordedSessions;
