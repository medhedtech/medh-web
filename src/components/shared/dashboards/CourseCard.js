"use client";
import Image from "next/image";
import React from "react";
import AiMl from "@/assets/images/courses/Ai&Ml.jpeg";
import { motion } from "framer-motion";
import { Star, Clock, Users, Tag } from "lucide-react";

const CourseCard = ({
  course_title,
  course_tag,
  rating = 4.5,
  reviews = 0,
  course_image,
  course_fee = 0,
  duration = "2h 30m",
  students = "1.2k",
  onClick,
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 left-4 z-10">
          <div className="px-4 py-1.5 rounded-full text-xs font-medium backdrop-blur-md bg-white/90 dark:bg-gray-800/90 text-primary-600 dark:text-primary-400 flex items-center gap-2">
            <Tag className="w-3 h-3" />
            <span>{course_tag}</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Course Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4 text-primary-500" />
              <span>{duration}</span>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4 text-primary-500" />
              <span>{students}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
            {course_title}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex">
                {ratingStars.map((starClass, index) => (
                  <Star
                    key={index}
                    className={`w-4 h-4 ${starClass}`}
                    fill="currentColor"
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {rating} {reviews > 0 && `(${reviews})`}
              </span>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-lg font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent"
            >
              ${course_fee}
            </motion.div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl transition-all duration-300 text-sm font-medium shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30"
          >
            Enroll Now
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
