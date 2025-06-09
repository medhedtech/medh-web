'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Calendar, Award } from 'lucide-react';

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1
    }
  }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  }
};

const CourseStats = ({ 
  duration = '3 weeks', 
  students = '75+',
  sessions = '20',
  hasCertificate = true,
  primaryColor = 'primary',
  fillOpacity = 0.2,
  compact = false,
  isBlended = false,
  courseDetails = null
}) => {
  // Get the appropriate color classes based on primaryColor
  const getColorClasses = () => {
    switch(primaryColor) {
      case 'emerald':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-900/20',
          border: 'border-emerald-100 dark:border-emerald-800',
          text: 'text-emerald-500 dark:text-emerald-400',
          textBold: 'text-emerald-600 dark:text-emerald-400'
        };
      case 'blue':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-100 dark:border-blue-800',
          text: 'text-blue-500 dark:text-blue-400',
          textBold: 'text-blue-600 dark:text-blue-400'
        };
      case 'purple':
        return {
          bg: 'bg-purple-50 dark:bg-purple-900/20',
          border: 'border-purple-100 dark:border-purple-800',
          text: 'text-purple-500 dark:text-purple-400',
          textBold: 'text-purple-600 dark:text-purple-400'
        };
      case 'amber':
        return {
          bg: 'bg-amber-50 dark:bg-amber-900/20',
          border: 'border-amber-100 dark:border-amber-800',
          text: 'text-amber-500 dark:text-amber-400',
          textBold: 'text-amber-600 dark:text-amber-400'
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-800/60',
          border: 'border-gray-100 dark:border-gray-700',
          text: 'text-gray-500 dark:text-gray-400',
          textBold: 'text-gray-900 dark:text-white'
        };
    }
  };

  const colorClasses = getColorClasses();

  // Helper function to detect if course is blended
  const isBlendedCourse = (details) => {
    if (!details) return false;
    
    return (
      details.classType === 'Blended Courses' || 
      details.class_type === 'Blended Courses' ||
      details.course_type === 'blended' || 
      details.course_type === 'Blended' ||
      details.delivery_format === 'Blended' ||
      details.delivery_type === 'Blended' ||
      details.course_category === 'Blended Courses'
    );
  };

  // Determine if we should show "Videos" or "Sessions"
  const shouldShowVideos = isBlended || isBlendedCourse(courseDetails);
  const sessionsLabel = shouldShowVideos ? "Videos" : "Sessions";

  return (
    <motion.div 
      className={`grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-4 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl ${compact ? 'p-2 sm:p-3' : 'p-3 sm:p-4'} shadow-sm border border-gray-200 dark:border-gray-700`}
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* Duration */}
      <motion.div 
        className={`flex flex-col items-center ${compact ? 'p-1.5 sm:p-2' : 'p-2 sm:p-3'} rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800`}
        variants={scaleIn}
      >
        <Clock 
          className={`${compact ? 'h-3.5 w-3.5 sm:h-4 sm:w-4' : 'h-4 w-4 sm:h-5 sm:w-5'} text-blue-500 dark:text-blue-400 mb-0.5 sm:mb-1`} 
          fill="currentColor" 
          fillOpacity={fillOpacity} 
        />
        <span className={`${compact ? 'text-[8px] sm:text-2xs' : 'text-2xs sm:text-xs'} font-medium text-blue-700 dark:text-blue-300`}>Duration</span>
        <span className={`${compact ? 'text-[10px] sm:text-xs' : 'text-xs sm:text-sm'} font-bold text-blue-900 dark:text-blue-100 text-center`}>
          {duration}
        </span>
      </motion.div>
      
      {/* Students Enrolled */}
      <motion.div 
        className={`flex flex-col items-center ${compact ? 'p-1.5 sm:p-2' : 'p-2 sm:p-3'} rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800`}
        variants={scaleIn}
      >
        <Users 
          className={`${compact ? 'h-3.5 w-3.5 sm:h-4 sm:w-4' : 'h-4 w-4 sm:h-5 sm:w-5'} text-purple-500 dark:text-purple-400 mb-0.5 sm:mb-1`} 
          fill="currentColor" 
          fillOpacity={fillOpacity} 
        />
        <span className={`${compact ? 'text-[8px] sm:text-2xs' : 'text-2xs sm:text-xs'} font-medium text-purple-700 dark:text-purple-300`}>Students</span>
        <span className={`${compact ? 'text-[10px] sm:text-xs' : 'text-xs sm:text-sm'} font-bold text-purple-900 dark:text-purple-100`}>
          {students}
        </span>
      </motion.div>
      
      {/* Sessions/Videos */}
      <motion.div 
        className={`flex flex-col items-center ${compact ? 'p-1.5 sm:p-2' : 'p-2 sm:p-3'} rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800`}
        variants={scaleIn}
      >
        <Calendar 
          className={`${compact ? 'h-3.5 w-3.5 sm:h-4 sm:w-4' : 'h-4 w-4 sm:h-5 sm:w-5'} text-amber-500 dark:text-amber-400 mb-0.5 sm:mb-1`} 
          fill="currentColor" 
          fillOpacity={fillOpacity} 
        />
        <span className={`${compact ? 'text-[8px] sm:text-2xs' : 'text-2xs sm:text-xs'} font-medium text-amber-700 dark:text-amber-300`}>{sessionsLabel}</span>
        <span className={`${compact ? 'text-[10px] sm:text-xs' : 'text-xs sm:text-sm'} font-bold text-amber-900 dark:text-amber-100`}>
          {sessions}
        </span>
      </motion.div>
      
      {/* Certification */}
      <motion.div 
        className={`flex flex-col items-center ${compact ? 'p-1.5 sm:p-2' : 'p-2 sm:p-3'} rounded-lg ${hasCertificate ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800' : 'bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700'}`}
        variants={scaleIn}
      >
        <Award 
          className={`${compact ? 'h-3.5 w-3.5 sm:h-4 sm:w-4' : 'h-4 w-4 sm:h-5 sm:w-5'} mb-0.5 sm:mb-1 ${hasCertificate ? 'text-emerald-500 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`}
          fill="currentColor" 
          fillOpacity={fillOpacity} 
        />
        <span className={`${compact ? 'text-[8px] sm:text-2xs' : 'text-2xs sm:text-xs'} font-medium ${hasCertificate ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-700 dark:text-gray-300'}`}>Certificate</span>
        <span className={`${compact ? 'text-[10px] sm:text-xs' : 'text-xs sm:text-sm'} font-bold ${hasCertificate ? 'text-emerald-900 dark:text-emerald-100' : 'text-gray-900 dark:text-white'}`}>
          {hasCertificate ? "Included" : "Not Available"}
        </span>
      </motion.div>
    </motion.div>
  );
};

export default CourseStats; 