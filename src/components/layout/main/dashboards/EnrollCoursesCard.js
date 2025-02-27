import React from "react";
import Image from "next/image";
import AiMl from "@/assets/images/courses/Ai&Ml.jpeg";
import { motion } from "framer-motion";
import { Clock, CheckCircle, PlayCircle } from "lucide-react";

const EnrollCoursesCard = ({ 
  title, 
  image, 
  isLive, 
  progress, 
  lastAccessed, 
  status, 
  onClick,
  isHovered 
}) => {
  const displayImage = image || AiMl;

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  const formatLastAccessed = (date) => {
    if (!date) return 'Not started yet';
    const lastAccessed = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - lastAccessed);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
      }
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return lastAccessed.toLocaleDateString();
  };

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative max-w-xs rounded-lg overflow-hidden border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
    >
      {/* Status Badge */}
      <div className="absolute top-2 right-2 z-10">
        <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(status)}`}>
          {status === 'completed' ? 'Completed' : status === 'in_progress' ? 'In Progress' : 'Not Started'}
        </div>
      </div>

      {/* Live indicator */}
      {isLive && (
        <div className="absolute top-2 left-2 z-10 flex items-center space-x-1 bg-black/50 px-2 py-1 rounded-full">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          <span className="text-xs font-medium text-white">Live</span>
        </div>
      )}

      {/* Course Image */}
      <div className="relative w-full h-48 group">
        <Image
          src={displayImage}
          alt={title || "Course thumbnail"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = AiMl.src;
          }}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <PlayCircle className="w-12 h-12 text-white opacity-75 hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Course Content */}
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">{title}</h3>

        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`h-full rounded-full ${
                progress === 100 
                  ? 'bg-green-500' 
                  : progress > 50 
                    ? 'bg-primary-500' 
                    : 'bg-yellow-500'
              }`}
            />
          </div>
        </div>

        {/* Last Accessed */}
        <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400">
          <Clock className="w-4 h-4 mr-1" />
          <span>Last accessed: {formatLastAccessed(lastAccessed)}</span>
        </div>

        {/* Continue Learning Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-3 w-full py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
        >
          {status === 'completed' ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Review Course
            </>
          ) : (
            <>
              <PlayCircle className="w-4 h-4" />
              Continue Learning
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default EnrollCoursesCard;
