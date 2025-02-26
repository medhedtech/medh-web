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
      className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-800/30 transition-all duration-300"
      whileHover={{ y: -4 }}
      layout
    >
      <div className="relative overflow-hidden aspect-video">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2.5 py-1 text-xs font-medium bg-white/90 dark:bg-gray-800/90 text-primary-600 dark:text-primary-400 rounded-full flex items-center gap-1.5">
            <Tag className="w-3 h-3" />
            {course_tag}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4" />
            <span>{students}</span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 min-h-[3.5rem]">
          {course_title}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
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
            className="text-lg font-bold text-primary-500 dark:text-primary-400"
          >
            ${course_fee}
          </motion.div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-2 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors text-sm font-medium"
        >
          Enroll Now
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CourseCard;
