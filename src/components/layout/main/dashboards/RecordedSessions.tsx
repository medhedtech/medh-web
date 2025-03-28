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
  LucidePlay,
  LucideDownload,
  LucidePlayCircle
} from "lucide-react";
import { AxiosError } from "axios";

// Types
interface RecordedSession {
  _id: string;
  title: string;
  date: string;
  duration: string;
  thumbnail_url: string;
  video_url: string;
  course_id: string;
  description?: string;
  courseDetails?: {
    course_image: string;
    course_title: string;
  };
  views?: number;
  download_url?: string;
}

interface ApiResponse {
  recordedVideos: RecordedSession[];
  total: number;
  page: number;
  totalPages: number;
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
      <LucidePlayCircle size={60} className="text-blue-500 dark:text-blue-400" />
    </div>
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
      No Recorded Sessions Found
    </h2>
    <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
      There are no recorded sessions available at the moment.
    </p>
    <p className="text-sm text-gray-500 dark:text-gray-400">
      Your recorded sessions will appear here once they're available.
    </p>
    <div className="mt-6 flex space-x-4">
      <LucideVideo size={40} className="text-gray-400 dark:text-gray-500 animate-bounce" />
    </div>
  </motion.div>
);

const RecordedSessionCard: React.FC<{ session: RecordedSession }> = ({ session }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ scale: 1.02 }}
    className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl border border-gray-100 dark:border-gray-700 p-6 relative flex flex-col h-full transition-all duration-300"
  >
    {/* Thumbnail */}
    <div className="rounded-xl overflow-hidden mb-4 relative group">
      <Image
        src={session.thumbnail_url || session.courseDetails?.course_image || DefaultImage}
        alt={session.title || "Recorded Session"}
        className="w-full h-48 object-cover rounded-xl transform group-hover:scale-110 transition-all duration-300"
        width={300}
        height={150}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <LucidePlay className="w-12 h-12 text-white opacity-75" />
      </div>
    </div>

    {/* Session Details */}
    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 line-clamp-2">
      {session.title || "Untitled Session"}
    </h3>

    <div className="space-y-3 mb-6">
      <div className="flex items-center text-gray-600 dark:text-gray-300">
        <LucideCalendar className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
        <span className="text-sm">
          {moment(session.date).format("DD/MM/YYYY")}
        </span>
      </div>

      <div className="flex items-center text-gray-600 dark:text-gray-300">
        <LucideClock className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
        <span className="text-sm">{session.duration}</span>
      </div>

      {session.courseDetails?.course_title && (
        <div className="flex items-center text-gray-600 dark:text-gray-300">
          <LucideBookOpen className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
          <span className="text-sm line-clamp-1">{session.courseDetails.course_title}</span>
        </div>
      )}
    </div>

    {/* Action Buttons */}
    <div className="mt-auto space-y-3">
      <a
        href={session.video_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
      >
        <LucidePlay className="w-5 h-5" />
        Watch Session
      </a>

      {session.download_url && (
        <a
          href={session.download_url}
          download
          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <LucideDownload className="w-5 h-5" />
          Download
        </a>
      )}
    </div>
  </motion.div>
); 