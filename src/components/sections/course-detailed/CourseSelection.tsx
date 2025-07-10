'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Award, Users, ChevronDown, ChevronUp,
  GraduationCap, Star, CheckCircle, MapPin, CalendarDays
} from 'lucide-react';
import Image from 'next/image';

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
  // Auto-expand on desktop for better UX
  const [isExpanded, setIsExpanded] = useState(false);

  // Detect viewport width once on mount and expand if desktop
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const desktop = window.innerWidth >= 1024; // Tailwind lg breakpoint
    if (desktop) {
      setIsExpanded(true);
    }
  }, []);

  // Format duration to show months and weeks
  const formatDuration = (durationStr: string) => {
    if (!durationStr) return '';
    
    // Try to extract numbers and convert to a more readable format
    const monthsMatch = durationStr.match(/(\d+)\s*months?/i);
    const weeksMatch = durationStr.match(/(\d+)\s*weeks?/i);
    
    if (monthsMatch && weeksMatch) {
      return `${monthsMatch[1]} months ${weeksMatch[1]} weeks`;
    } else if (monthsMatch) {
      const months = parseInt(monthsMatch[1]);
      const weeks = months * 4;
      return `${months} months ${weeks} weeks`;
    } else if (weeksMatch) {
      const weeks = parseInt(weeksMatch[1]);
      const months = Math.floor(weeks / 4);
      return months > 0 ? `${months} months ${weeks} weeks` : `${weeks} weeks`;
    }
    
    return durationStr;
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {/* Header */}
      <div className={`${categoryInfo.bgClass} border-b ${categoryInfo.borderClass || 'border-gray-200 dark:border-gray-700'} px-4 py-3`}>
        <div className="flex items-center justify-between">
          <button
            onClick={toggleExpanded}
            className="flex-1 flex items-center text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${categoryInfo.bgClass} border ${categoryInfo.borderClass || 'border-gray-200'}`}>
                <BookOpen className={`h-5 w-5 ${categoryInfo.colorClass}`} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {selectedCourse ? formatDuration(selectedCourse.course_duration) : 'Select a Course'}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">
                    {filteredCourses.length} {filteredCourses.length === 1 ? 'course available' : 'courses available'}
                  </span>
                  {selectedCourse && (
                    <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded-full">
                      Selected
                    </span>
                  )}
                </div>
              </div>
            </div>
          </button>
          
          <div className="flex items-center space-x-2">
            {/* Dropdown Toggle */}
            <button
              onClick={toggleExpanded}
              className="p-2 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      {/* Course List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {filteredCourses.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Coming Soon</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">New courses for this grade are launching soon. Stay tuned!</p>
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
                      onClick={() => onCourseSelect(course)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`relative p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                        selectedCourse?._id === course._id
                          ? `${categoryInfo.bgClass} shadow-lg ring-2 ring-blue-500/20 dark:ring-blue-400/20 transform scale-[1.01]`
                          : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
                      }`}
                    >
                      {/* Selection Indicator */}
                      {selectedCourse?._id === course._id && (
                        <motion.div 
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="absolute top-3 right-3 p-1.5 rounded-full bg-blue-500 shadow-md"
                        >
                          <CheckCircle className="h-5 w-5 text-white" />
                        </motion.div>
                      )}

                      <div className="flex flex-col space-y-3">
                        {/* Course Duration and Grade */}
                        <div className="flex flex-wrap gap-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                            selectedCourse?._id === course._id
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 border-blue-200 dark:border-blue-700'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                          }`}>
                            {formatDuration(course.course_duration)}
                          </span>
                          {selectedGrade === 'all' && course.grade && (
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                              selectedCourse?._id === course._id
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 border-emerald-200 dark:border-emerald-700'
                                : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800'
                            }`}>
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
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CourseSelection; 