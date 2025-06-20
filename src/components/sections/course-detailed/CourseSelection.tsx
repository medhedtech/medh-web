'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Clock, Award, Users, ChevronDown, ChevronUp,
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
}

const CourseSelection: React.FC<CourseSelectionProps> = ({
  filteredCourses,
  selectedCourse,
  onCourseSelect,
  categoryInfo,
  formatPriceFunc = (price) => `$${price}`,
  loading = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  


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
        <button
          onClick={toggleExpanded}
          className="w-full flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${categoryInfo.bgClass} border ${categoryInfo.borderClass || 'border-gray-200'}`}>
              <BookOpen className={`h-5 w-5 ${categoryInfo.colorClass}`} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Choose from our available courses
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                <span className={`font-medium ${categoryInfo.colorClass}`}>
                  {categoryInfo.displayName}
                </span>
              </div>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </motion.div>
        </button>
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
                  <BookOpen className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No courses available in this category</p>
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
                      className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedCourse?._id === course._id
                          ? `${categoryInfo.borderClass || 'border-blue-500'} ${categoryInfo.bgClass} shadow-sm`
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      {/* Selection Indicator */}
                      {selectedCourse?._id === course._id && (
                        <div className={`absolute top-2 right-2 p-1 rounded-full ${categoryInfo.bgClass}`}>
                          <CheckCircle className={`h-4 w-4 ${categoryInfo.colorClass}`} />
                        </div>
                      )}

                      <div className="flex items-start space-x-3">
                        {/* Course Thumbnail */}
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                          {course.thumbnail ? (
                            <Image
                              src={course.thumbnail}
                              alt={course.title}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <GraduationCap className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Course Info */}
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-semibold text-gray-900 dark:text-white truncate mb-1">
                            {course.title}
                          </h5>
                          <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                            {course.description}
                          </p>
                          
                          {/* Course Meta */}
                          <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatDuration(course.course_duration)}</span>
                            </div>
                            {course.is_Certification && (
                              <div className="flex items-center space-x-1">
                                <Award className="h-3 w-3 text-yellow-500" />
                                <span>Certificate</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-1">
                              <Users className="h-3 w-3" />
                              <span>{course.enrolled_students}</span>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="mt-2 flex items-center justify-between">
                            <div className="text-sm font-bold text-gray-900 dark:text-white">
                              {course.isFree ? 'Free' : formatPriceFunc(course.course_fee)}
                            </div>
                            {course.no_of_Sessions > 0 && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {course.no_of_Sessions} sessions
                              </div>
                            )}
                          </div>
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