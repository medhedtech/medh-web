'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Image from 'next/image';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

const CourseHeader = ({ 
  title, 
  category, 
  price, 
  categoryIcon: CategoryIcon, 
  backgroundImage,
  colorClass = "text-blue-600 dark:text-blue-400",
  bgClass = "bg-blue-50 dark:bg-blue-900/30"
}) => {
  return (
    <div className="relative overflow-hidden rounded-lg sm:rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Background Image or Gradient - Responsive height */}
      <div className="relative w-full h-[120px] sm:h-[150px] overflow-hidden bg-gray-100 dark:bg-gray-700">
        {backgroundImage ? (
          <Image
            src={backgroundImage}
            alt={title || 'Course header'}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" 
            style={{ 
              background: `linear-gradient(to right, var(--color-primary-light), var(--color-secondary-light))` 
            }}
          >
            <div className="flex items-center justify-center">
              <span className="text-6xl sm:text-8xl font-bold text-white opacity-30">
                {(title || category || '').substring(0, 1).toUpperCase()}
              </span>
            </div>
          </div>
        )}
        
        {/* Overlay with blurred effect */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Content - Responsive padding */}
      <div className="relative px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <motion.div variants={fadeIn} className="flex-1">
            {/* Category tag */}
            <div className="flex items-center mb-2">
              <div className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-medium ${bgClass} ${colorClass} flex items-center`}>
                {CategoryIcon && <CategoryIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 sm:mr-1.5" />}
                <span>{category || 'Technical Development'}</span>
              </div>
            </div>
            
            {/* Title - Responsive text size */}
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-1.5 pr-16 sm:pr-0">
              {title || 'Data Science Essentials'}
            </h1>
            
            {/* Optional subtitle */}
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1 sm:mb-0">
              Master data analysis and visualization techniques
            </p>
          </motion.div>
          
          {/* Price tag - Absolute position on mobile for better layout */}
          {price !== undefined && (
            <motion.div 
              variants={fadeIn}
              className="absolute sm:relative top-4 right-4 sm:top-auto sm:right-auto bg-green-500 text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg font-bold flex items-center shadow-sm text-sm sm:text-base"
            >
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 text-white/80" />
              ₹{price}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseHeader; 