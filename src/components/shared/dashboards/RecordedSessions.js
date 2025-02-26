"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import RecordedCard from "./RecordedCourses";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Search, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

const RecordedSessions = () => {
  const router = useRouter();
  const [freeCourses, setFreeCourses] = useState([]);
  const [recordedSession, setRecordedSession] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const { getQuery, loading } = useGetQuery();
  const [limit] = useState(90);
  const [page] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        getQuery({
          url: `${apiUrls?.courses?.getRecorderVideosForUser}/${"674d7160c96e51af10f85426"}`,
          onSuccess: (res) => {
            setRecordedSession(res?.courses);
          },
          onFail: (err) => {
            console.error("Error fetching recorded sessions:", err);
            toast.error("Failed to fetch recorded sessions. Please try again.");
          }
        });
      } else {
        toast.error("No student ID found. Please log in again.");
      }
    }
  }, []);

  useEffect(() => {
    const fetchCourses = () => {
      getQuery({
        url: apiUrls?.courses?.getAllCoursesWithLimits(
          page,
          limit,
          "",
          "",
          "",
          "Published",
          "",
          "",
          "",
          true
        ),
        onSuccess: (res) => {
          const freeCourses = res?.courses?.filter(
            (course) => course.course_tag === "Pre-Recorded"
          ) || [];
          setFreeCourses(freeCourses.slice(0, 4));
        },
        onFail: (err) => {
          console.error("Error fetching courses:", err);
          toast.error("Failed to fetch courses. Please try again.");
        },
      });
    };

    fetchCourses();
  }, [page, limit]);

  const handleCardClick = (id) => {
    router.push(`/dashboards/my-courses/${id}`);
  };

  const filteredSessions = recordedSession.filter(course =>
    course?.course_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
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
            Access Recorded Sessions
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
                  course_tag={course?.course_tag}
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
              <AlertCircle className="w-8 h-8 text-primary-500 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchTerm ? "No sessions found" : "No recorded sessions available"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              {searchTerm 
                ? "Try adjusting your search term to find what you're looking for."
                : "Check back later for new recorded sessions."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RecordedSessions;
