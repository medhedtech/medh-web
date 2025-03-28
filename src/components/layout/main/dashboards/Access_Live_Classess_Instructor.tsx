"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import moment from "moment";
import DefaultImage from "@/assets/images/courses/image3.png";
import { 
  LucideBookOpen,
  LucideCalendar,
  LucideClock,
  LucideVideo,
  LucideUsers,
  LucidePlay
} from "lucide-react";
import { AxiosError } from "axios";

// Types
interface LiveClass {
  _id: string;
  meet_title: string;
  date: string;
  time: string;
  meet_link: string;
  meeting_tag: string;
  courseDetails?: {
    course_image: string;
    course_title: string;
  };
}

interface ApiResponse {
  meetings: LiveClass[];
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const EmptyState: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="py-10 px-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg text-center flex flex-col items-center justify-center"
  >
    <div className="bg-white dark:bg-gray-700 p-4 rounded-full shadow-md mb-6">
      <LucideVideo size={60} className="text-blue-500 dark:text-blue-400" />
    </div>
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
      No Live Classes Found
    </h2>
    <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
      There are no live classes scheduled at the moment.
    </p>
    <p className="text-sm text-gray-500 dark:text-gray-400">
      Check back later for upcoming live sessions.
    </p>
    <div className="mt-6 flex space-x-4">
      <LucideUsers size={40} className="text-gray-400 dark:text-gray-500 animate-bounce" />
    </div>
  </motion.div>
);

const LiveClassCard: React.FC<{ classItem: LiveClass }> = ({ classItem }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ scale: 1.02 }}
    className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl border border-gray-100 dark:border-gray-700 p-6 relative flex flex-col h-full transition-all duration-300"
  >
    {/* Live Tag */}
    <div className="absolute top-4 left-4 z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 bg-red-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium"
      >
        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
        Live
      </motion.div>
    </div>

    {/* Course Image */}
    <div className="rounded-xl overflow-hidden mb-4 relative group">
      <Image
        src={classItem.courseDetails?.course_image || DefaultImage}
        alt={classItem.meet_title || "Live Class"}
        className="w-full h-48 object-cover rounded-xl transform group-hover:scale-110 transition-all duration-300"
        width={300}
        height={150}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>

    {/* Class Details */}
    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
      {classItem.meet_title || "Untitled Class"}
    </h3>

    <div className="space-y-3 mb-6">
      <div className="flex items-center text-gray-600 dark:text-gray-300">
        <LucideCalendar className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
        <span className="text-sm">
          {moment(classItem.date).format("DD/MM/YYYY")}
        </span>
      </div>

      <div className="flex items-center text-gray-600 dark:text-gray-300">
        <LucideClock className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
        <span className="text-sm">{classItem.time}</span>
      </div>
    </div>

    {/* Join Button */}
    <div className="mt-auto">
      <a
        href={classItem?.meet_link || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
      >
        <LucidePlay className="w-5 h-5" />
        Join Class
      </a>
    </div>
  </motion.div>
);

const Live_Demo_Classess_instructor: React.FC = () => {
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [instructorId, setInstructorId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { getQuery, loading } = useGetQuery();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setInstructorId(storedUserId);
      } else {
        setErrorMessage("No instructor ID found. Please log in again.");
      }
    }
  }, []);

  useEffect(() => {
    if (instructorId) {
      const fetchUpcomingClasses = () => {
        getQuery({
          url: `${apiUrls.onlineMeeting.getMeetingsByInstructorId}/${instructorId}`,
          onSuccess: (res: ApiResponse) => {
            setClasses(
              res?.meetings?.filter(
                (classItem) => classItem.meeting_tag === "live"
              ) || []
            );
            setErrorMessage("");
          },
          onFail: (err) => {
            console.error("Error fetching live classes:", err);
            const axiosError = err as AxiosError<{ message: string }>;
            setErrorMessage(
              axiosError.response?.data?.message ||
              "Failed to fetch live classes. Please try again."
            );
          },
        });
      };

      fetchUpcomingClasses();
    }
  }, [instructorId, getQuery]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-pulse flex space-x-4">
          <LucideVideo className="w-8 h-8 text-blue-500" />
          <span className="text-gray-600 dark:text-gray-300">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="px-6 md:px-10 py-10"
    >
      <div className="flex justify-between items-center pt-4 mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Start/Join Live Classes
        </h2>
      </div>

      <AnimatePresence mode="wait">
        {errorMessage ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6"
          >
            <p className="text-red-600 dark:text-red-400 flex items-center">
              <LucideBookOpen className="w-5 h-5 mr-2" />
              {errorMessage}
            </p>
          </motion.div>
        ) : null}

        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {classes.length > 0 ? (
            classes.map((classItem) => (
              <LiveClassCard key={classItem._id} classItem={classItem} />
            ))
          ) : (
            <div className="col-span-full">
              <EmptyState />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default Live_Demo_Classess_instructor; 