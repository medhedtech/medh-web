'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Award, Users, ChevronDown, ChevronUp,
  GraduationCap, Star, CheckCircle, MapPin, CalendarDays, Clock
} from 'lucide-react';
import Image from 'next/image';
import ReactDOM from 'react-dom';

// Types
interface Course {
  _id: string;
  title: string;
  description: string;
  long_description?: string;
  category: string;
  grade: string;
  thumbnail: string | null;
  course_duration: string;
  course_duration_days: number;
  course_fee: number;
  prices?: any[];
  enrolled_students: number;
  views: number;
  is_Certification: boolean;
  is_Assignments: boolean;
  is_Projects: boolean;
  is_Quizes: boolean;
  curriculum: any[];
  highlights: string[];
  learning_outcomes: string[];
  prerequisites: string[];
  faqs: any[];
  no_of_Sessions: number;
  status: string;
  isFree: boolean;
  hasFullDetails: boolean;
  slug?: string;
  category_type?: string;
}

interface CategoryInfo {
  displayName: string;
  colorClass: string;
  bgClass: string;
  borderClass?: string;
  primaryColor?: string;
}

interface CourseSelectionProps {
  filteredCourses: Course[];
  selectedCourse: Course | null;
  onCourseSelect: (course: Course) => void;
  categoryInfo: CategoryInfo;
  formatPriceFunc?: (price: number) => string;
  loading?: boolean;
  selectedGrade?: string;
}

const CourseSelection: React.FC<CourseSelectionProps> = ({
  filteredCourses,
  selectedCourse,
  onCourseSelect,
  categoryInfo,
  formatPriceFunc = (price) => `$${price}`,
  loading = false,
  selectedGrade = 'all'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = React.useState<{ top: number; left: number; width: number } | null>(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update dropdown position when expanded (mobile only)
  React.useEffect(() => {
    if (isExpanded && isMobile && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isExpanded, isMobile]);

  // Format duration to show months and weeks - mobile optimized
  const formatDuration = (durationStr: string) => {
    if (!durationStr) return '';
    
    // Try to extract numbers and convert to a more readable format
    const monthsMatch = durationStr.match(/(\d+)\s*months?/i);
    const weeksMatch = durationStr.match(/(\d+)\s*weeks?/i);
    
    if (monthsMatch && weeksMatch) {
      return isMobile ? `${monthsMatch[1]}m ${weeksMatch[1]}w` : `${monthsMatch[1]} months ${weeksMatch[1]} weeks`;
    } else if (monthsMatch) {
      const months = parseInt(monthsMatch[1]);
      const weeks = months * 4;
      return isMobile ? `${months}m ${weeks}w` : `${months} months ${weeks} weeks`;
    } else if (weeksMatch) {
      const weeks = parseInt(weeksMatch[1]);
      const months = Math.floor(weeks / 4);
      return months > 0 ? (isMobile ? `${months}m ${weeks}w` : `${months} months ${weeks} weeks`) : (isMobile ? `${weeks}w` : `${weeks} weeks`);
    }
    
    return durationStr;
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCourseSelect = (course: Course) => {
    onCourseSelect(course);
    setIsExpanded(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        (buttonRef.current && buttonRef.current.contains(target)) ||
        (dropdownRef.current && dropdownRef.current.contains(target))
      ) {
        return;
      }
      setIsExpanded(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
        <div className="animate-pulse space-y-3 sm:space-y-4">
          <div className="h-5 sm:h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="space-y-2 sm:space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 sm:h-16 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Dropdown content
  const dropdownContent = (
    <motion.div
      ref={dropdownRef}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute z-[9999] w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-b-xl shadow-lg max-h-96 overflow-hidden"
      style={isMobile && dropdownPosition ? {
        position: 'absolute',
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        width: dropdownPosition.width,
      } : {}}
    >
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 max-h-96 overflow-y-auto">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">Coming Soon</h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">New courses for this grade are launching soon. Stay tuned!</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => handleCourseSelect(course)}
                whileHover={{ scale: isMobile ? 1 : 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={`relative p-3 sm:p-4 rounded-xl cursor-pointer transition-all duration-300 touch-manipulation ${
                  selectedCourse?._id === course._id
                    ? `${categoryInfo.bgClass} shadow-lg ring-2 ring-blue-500/20 dark:ring-blue-400/20 transform scale-[1.01]`
                    : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md active:scale-95'
                }`}
              >
                {/* Selection Indicator */}
                {selectedCourse?._id === course._id && (
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1 sm:p-1.5 rounded-full bg-blue-500 shadow-md"
                  >
                    <CheckCircle className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
                  </motion.div>
                )}

                <div className="flex flex-col space-y-2 sm:space-y-3">
                  {/* Course Duration and Grade */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    <span className={`inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium border ${
                      selectedCourse?._id === course._id
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 border-blue-200 dark:border-blue-700'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                    }`}>
                      <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                      {formatDuration(course.course_duration)}
                    </span>
                    {selectedGrade === 'all' && course.grade && (
                      <span className={`inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium border ${
                        selectedCourse?._id === course._id
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 border-emerald-200 dark:border-emerald-700'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800'
                      }`}>
                        <GraduationCap className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                        {course.grade}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="relative course-selection-dropdown">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        {/* Header - Now acts as dropdown trigger */}
        <button
          ref={buttonRef}
          onClick={toggleExpanded}
          disabled={loading || filteredCourses.length === 0}
          className={`w-full ${categoryInfo.bgClass} border-b ${categoryInfo.borderClass || 'border-gray-200 dark:border-gray-700'} px-3 sm:px-4 py-3 sm:py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
              <div className={`p-1.5 sm:p-2 rounded-lg ${categoryInfo.bgClass} border ${categoryInfo.borderClass || 'border-gray-200'}`}>
                <BookOpen className={`h-4 w-4 sm:h-5 sm:w-5 ${categoryInfo.colorClass}`} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  Select Course Duration
                </h3>
                {selectedCourse && (
                  <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium truncate">
                      {formatDuration(selectedCourse.course_duration)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="p-1 sm:p-1.5"
              >
                <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
              </motion.div>
            </div>
          </div>
        </button>

        {/* Portal for dropdown on mobile */}
        {isMobile && isExpanded && typeof window !== 'undefined' && typeof document !== 'undefined' && dropdownPosition
          ? ReactDOM.createPortal(dropdownContent, document.body)
          : !isMobile && (
            <AnimatePresence>
              {isExpanded && dropdownContent}
            </AnimatePresence>
          )}
      </motion.div>
    </div>
  );
};

export default CourseSelection; 