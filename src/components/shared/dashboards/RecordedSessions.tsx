"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import batchAPI from "@/apis/batch";
import RecordedCard from "./RecordedCourses";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Search, ChevronRight, Loader2, AlertCircle, BookOpenCheck } from "lucide-react";
import { toast } from "react-toastify";

interface RecordedSession {
  id: string;
  title: string;
  url: string;
  recorded_date: string;
  batch_name: string;
  session_day: string;
  session_time: string;
}

const RecordedSessions: React.FC = () => {
  const router = useRouter();
  const [recordedSessions, setRecordedSessions] = useState<RecordedSession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

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
        
        try {
          // Fetch recorded sessions using batch API and flatten lessons
          const response = await batchAPI.getStudentRecordedLessons(storedUserId);
          const sessionsData = response.data?.data;
          const formattedSessions: RecordedSession[] = [];
          if (Array.isArray(sessionsData)) {
            sessionsData.forEach((sessionBlock: any) => {
              const { batch, session, recorded_lessons } = sessionBlock;
              recorded_lessons.forEach((lesson: any) => {
                formattedSessions.push({
                  id: lesson._id,
                  title: lesson.title,
                  url: lesson.url,
                  recorded_date: lesson.recorded_date,
                  batch_name: batch.name,
                  session_day: session.day,
                  session_time: `${session.start_time} - ${session.end_time}`
                });
              });
            });
          }
          setRecordedSessions(formattedSessions);
          setIsLoading(false);
        } catch (error: any) {
          console.error("Error fetching recorded sessions:", error);
          setError("Failed to load recorded sessions. Please try again later.");
          toast.error("Failed to load recorded sessions. Please try again later.");
          setIsLoading(false);
        }
      }
    };

    fetchRecordedSessions();
  }, []);

  const handleCardClick = (url: string) => {
    window.open(url, '_blank');
  };

  const filteredSessions = recordedSessions.filter(session =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase())
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
                    key={session.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="cursor-pointer"
                    onClick={() => handleCardClick(session.url)}
                  >
                    <RecordedCard
                      course_title={session.title}
                      course_tag={session.batch_name}
                      description={`Recorded on ${new Date(session.recorded_date).toLocaleString()}`}
                      course_image={undefined}
                      onClick={() => handleCardClick(session.url)}
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