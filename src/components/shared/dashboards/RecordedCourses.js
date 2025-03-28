"use client";
import Image from "next/image";
import React from "react";
import AiMl from "@/assets/images/courses/Ai&Ml.jpeg";
import { motion } from "framer-motion";
import { Play, Star, Clock, Users, ChevronRight, BookOpen } from "lucide-react";

const RecordedCard = ({
  course_title,
  course_tag,
  rating = 4.5,
  course_image,
  onClick,
  duration = "2h 30m",
  students = "1.2k",
  description = "Learn the fundamentals and advanced concepts",
}) => {
  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const ratingStars = Array(5).fill(0).map((_, index) => {
    const starValue = index + 1;
    return starValue <= Math.floor(rating) ? "text-yellow-400" : "text-gray-300";
  });

  return (
    <motion.div
      onClick={onClick}
      className="group relative bg-white dark:bg-gray-800/50 backdrop-blur-lg rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700/50"
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      {/* Course Image Container */}
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <motion.div
          variants={imageVariants}
          whileHover="hover"
          className="absolute inset-0"
        >
          <Image
            src={course_image || AiMl}
            alt={course_title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Course Tag */}
        <div className="absolute top-4 left-4 z-10">
          <div className="px-4 py-1.5 rounded-full text-xs font-medium backdrop-blur-md bg-white/90 dark:bg-gray-800/90 text-primary-600 dark:text-primary-400 flex items-center gap-2">
            <BookOpen className="w-3 h-3" />
            <span>{course_tag}</span>
          </div>
        </div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-4 bg-primary-500/90 rounded-full backdrop-blur-sm hover:bg-primary-600/90 transition-colors"
          >
            <Play className="w-8 h-8 text-white" fill="white" />
          </motion.div>
        </div>

        {/* Course Title on Image */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2 group-hover:text-primary-200 transition-colors">
            {course_title}
          </h3>
          <p className="text-sm text-gray-300 line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6 space-y-6">
        {/* Course Stats */}
        <div className="grid grid-cols-2 gap-4">
          {/* Duration */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
              <Clock className="w-4 h-4 text-primary-500" />
              <span>Duration</span>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {duration}
            </p>
          </div>

          {/* Students */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
              <Users className="w-4 h-4 text-primary-500" />
              <span>Students</span>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {students}
            </p>
          </div>
        </div>

        {/* Rating and Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex">
              {ratingStars.map((starClass, index) => (
                <Star
                  key={index}
                  className={`w-5 h-5 ${starClass}`}
                  fill="currentColor"
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {rating}
            </span>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-xl font-medium transition-all duration-200 hover:bg-primary-100 dark:hover:bg-primary-900/40"
          >
            Learn More
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default RecordedCard;
