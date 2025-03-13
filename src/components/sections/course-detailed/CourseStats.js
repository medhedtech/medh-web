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
  duration = '4 months 16 weeks', 
  students = '75+',
  sessions = '32',
  hasCertificate = true,
  primaryColor = 'primary'
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

  return (
    <motion.div 
      className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200 dark:border-gray-700"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* Duration */}
      <motion.div 
        className="flex flex-col items-center p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700"
        variants={scaleIn}
      >
        <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400 mb-0.5 sm:mb-1" />
        <span className="text-2xs sm:text-xs font-medium text-gray-700 dark:text-gray-300">Duration</span>
        <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white text-center">
          {duration}
        </span>
      </motion.div>
      
      {/* Students Enrolled */}
      <motion.div 
        className="flex flex-col items-center p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700"
        variants={scaleIn}
      >
        <Users className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400 mb-0.5 sm:mb-1" />
        <span className="text-2xs sm:text-xs font-medium text-gray-700 dark:text-gray-300">Students</span>
        <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
          {students}
        </span>
      </motion.div>
      
      {/* Sessions */}
      <motion.div 
        className="flex flex-col items-center p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700"
        variants={scaleIn}
      >
        <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400 mb-0.5 sm:mb-1" />
        <span className="text-2xs sm:text-xs font-medium text-gray-700 dark:text-gray-300">Sessions</span>
        <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
          {sessions}
        </span>
      </motion.div>
      
      {/* Certification */}
      <motion.div 
        className={`flex flex-col items-center p-2 sm:p-3 rounded-lg ${hasCertificate ? colorClasses.bg + ' ' + colorClasses.border : 'bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700'}`}
        variants={scaleIn}
      >
        <Award className={`h-4 w-4 sm:h-5 sm:w-5 mb-0.5 sm:mb-1 ${hasCertificate ? colorClasses.text : 'text-gray-500 dark:text-gray-400'}`} />
        <span className="text-2xs sm:text-xs font-medium text-gray-700 dark:text-gray-300">Certificate</span>
        <span className={`text-xs sm:text-sm font-bold ${hasCertificate ? colorClasses.textBold : 'text-gray-900 dark:text-white'}`}>
          {hasCertificate ? "Included" : "Not Available"}
        </span>
      </motion.div>
    </motion.div>
  );
};

export default CourseStats; 