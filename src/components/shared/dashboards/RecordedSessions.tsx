"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import RecordedCard from "./RecordedCourses";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Search, ChevronRight, Loader2, AlertCircle, BookOpenCheck } from "lucide-react";
import { toast } from "react-toastify";

interface RecordedSession {
  _id: string;
  course_title: string;
  course_description?: string;
  course_image?: string;
  video_url?: string;
  duration?: string;
  date?: string;
  instructor?: {
    name: string;
    image?: string;
  };
}

const RecordedSessions: React.FC = () => {
  const router = useRouter();
  const [recordedSessions, setRecordedSessions] = useState<RecordedSession[]>([]);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
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
  const getAuthToken = (): string | null => {
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
            onSuccess: (response: any) => {
              const recordedData = response?.courses || response?.data?.courses || response;
              
              if (Array.isArray(recordedData)) {
                setRecordedSessions(recordedData);
              } else {
                console.warn("Unexpected response format:", response);
                setRecordedSessions([]);
              }
              
              setIsLoading(false);
            },
            onFail: (error: any) => {
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

  const handleCardClick = (id: string) => {
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <motion.div 
              variants={itemVariants}
              className="flex items-center gap-4"
            >
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-primary-500/10 to-primary-600/10 dark:from-primary-500/[0.07] dark:to-primary-600/[0.07] border border-primary-500/10 dark:border-primary-500/[0.05]">
                <Video className="w-7 h-7 text-primary-500 dark:text-primary-400" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
                  Your Recorded Sessions
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Access your recorded course sessions anytime
                </p>
              </div>
            </motion.div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Search Bar */}
              <motion.div 
                variants={itemVariants}
                className="relative w-full sm:w-72"
              >
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search sessions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                />
              </motion.div>

              {/* View All Link */}
              <motion.a
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="/dashboards/access-recorded-sessions"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </motion.a>
            </div>
          </div>

          {/* Content */}
          {filteredSessions.length === 0 ? (
            <motion.div 
              variants={itemVariants}
              className="min-h-[200px] flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-center"
            >
              <div className="p-4 rounded-full bg-blue-50 dark:bg-blue-900/20 mb-4">
                <BookOpenCheck className="w-8 h-8 text-blue-500 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No recorded sessions found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                You don't have any recorded sessions yet. They will appear here once you join your first course live session.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredSessions.map((session) => (
                  <motion.div
                    key={session._id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="cursor-pointer"
                    onClick={() => handleCardClick(session._id)}
                  >
                    <RecordedCard
                      title={session.course_title}
                      image={session.course_image}
                      id={session._id}
                      onClick={() => handleCardClick(session._id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RecordedSessions; 