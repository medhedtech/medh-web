'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  ChevronDown, GraduationCap, Info, RefreshCw, 
  BookOpen, Clock, CheckCircle2, Award, AlertTriangle, 
  Filter, CheckCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

// Types
interface GradeOption {
  id: string;
  label: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  long_description?: string;
  category: string;
  grade: string;
  course_grade?: string;
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
  currency_code?: string;
  original_prices?: any[];
  classType?: string;
  class_type?: string;
  course_type?: string;
  delivery_format?: string;
  delivery_type?: string;
  meta?: {
    views: number;
    enrollments: number;
    lastUpdated: string;
    ratings: {
      average: number;
      count: number;
    };
  };
}

interface CategoryInfo {
  bgClass?: string;
  colorClass?: string;
  borderClass?: string;
  displayName?: string;
  primaryColor?: string;
}

interface ErrorFallbackProps {
  error: string | null;
  resetErrorBoundary: () => void;
}

interface GradeFilterProps {
  selectedGrade?: string;
  availableGrades?: GradeOption[];
  filteredCourses?: Course[];
  selectedCourse: Course | null;
  handleGradeChange: (grade: string) => void;
  handleCourseSelection: (course: Course | null) => void;
  categoryInfo?: CategoryInfo;
  setSelectedGrade: (grade: string) => void;
  hideGradeSelector?: boolean;
  showOnlyGradeFilter?: boolean;
  loading?: boolean;
}

// Error Boundary Component
const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => (
  <div className="bg-red-50 dark:bg-red-900/20 p-4 sm:p-6 rounded-xl text-center">
    <div className="flex justify-center mb-3 sm:mb-4">
      <AlertTriangle className="h-8 w-8 sm:h-12 sm:w-12 text-red-500" />
    </div>
    <h2 className="text-lg sm:text-xl font-semibold text-red-700 dark:text-red-400 mb-2 sm:mb-3">
      Filter Error
    </h2>
    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
      {error || "We couldn't apply the filters. Please try again."}
    </p>
    <button
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm sm:text-base"
    >
      Reset Filters
    </button>
  </div>
);

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: 0.2 }
  }
};

const slideIn = {
  initial: { opacity: 0, x: -20 },
  animate: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  }
};

const GradeFilter: React.FC<GradeFilterProps> = ({ 
  selectedGrade = 'all',
  availableGrades = [],
  filteredCourses = [],
  selectedCourse = null,
  handleGradeChange,
  handleCourseSelection,
  categoryInfo = {},
  setSelectedGrade,
  hideGradeSelector = false,
  showOnlyGradeFilter = false,
  loading = false
}) => {
  const [isGradeExpanded, setIsGradeExpanded] = useState<boolean>(false);
  const [isCourseExpanded, setIsCourseExpanded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastProcessedCoursesLength, setLastProcessedCoursesLength] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Stable refs to prevent infinite loops
  const handleCourseSelectionRef = useRef(handleCourseSelection);
  const handleGradeChangeRef = useRef(handleGradeChange);
  
  // Update refs when props change
  useEffect(() => {
    handleCourseSelectionRef.current = handleCourseSelection;
    handleGradeChangeRef.current = handleGradeChange;
  }, [handleCourseSelection, handleGradeChange]);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Memoize courses with stable dependencies
  const memoizedCourses = useMemo(() => {
    return filteredCourses || [];
  }, [filteredCourses?.length, filteredCourses?.map(c => c._id).join(',')]);

  // Format duration to show months and weeks
  const formatDuration = (durationStr: string) => {
    if (!durationStr) return '';
    
    const monthsMatch = durationStr.match(/(\d+)\s*months?/i);
    const weeksMatch = durationStr.match(/(\d+)\s*weeks?/i);
    
    if (monthsMatch && weeksMatch) {
      return `${monthsMatch[1]}m ${weeksMatch[1]}w`;
    } else if (monthsMatch) {
      const months = parseInt(monthsMatch[1]);
      const weeks = months * 4;
      return `${months}m ${weeks}w`;
    } else if (weeksMatch) {
      const weeks = parseInt(weeksMatch[1]);
      const months = Math.floor(weeks / 4);
      return months > 0 ? `${months}m ${weeks}w` : `${weeks}w`;
    }
    
    return durationStr;
  };

  // Optimized course auto-selection - only when courses change significantly
  useEffect(() => {
    const coursesLength = memoizedCourses.length;
    
    if (coursesLength === lastProcessedCoursesLength) {
      return;
    }
    
    setLastProcessedCoursesLength(coursesLength);
    
  }, [memoizedCourses.length]);

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.grade-filter-dropdown')) {
        setIsGradeExpanded(false);
        setIsCourseExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Stable handlers
  const handleGradeChangeWithReset = useCallback((gradeId: string) => {
    if (handleGradeChangeRef.current) {
      handleGradeChangeRef.current(gradeId);
    }
    setIsGradeExpanded(false);
  }, []);

  const handleCourseClick = useCallback((course: Course) => {
    if (handleCourseSelectionRef.current) {
      handleCourseSelectionRef.current(course);
    }
    setIsCourseExpanded(false);
  }, []);

  const toggleGradeDropdown = useCallback(() => {
    setIsGradeExpanded(prev => !prev);
    setIsCourseExpanded(false);
  }, []);

  const toggleCourseDropdown = useCallback(() => {
    setIsCourseExpanded(prev => !prev);
    setIsGradeExpanded(false);
  }, []);

  const resetErrorState = useCallback(() => {
    setError(null);
    if (typeof setSelectedGrade === 'function') {
      setSelectedGrade('all');
    }
  }, [setSelectedGrade]);

  // Get selected grade label
  const selectedGradeLabel = useMemo(() => {
    if (selectedGrade === 'all') return 'All Grades';
    return availableGrades.find(g => g.id === selectedGrade)?.label || 'Select Grade';
  }, [selectedGrade, availableGrades]);

  // Loading state
  if (loading) {
    return (
      <div className="space-y-3 sm:space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
          <div className="animate-pulse space-y-3 sm:space-y-4">
            <div className="h-5 sm:h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-10 sm:h-12 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <ErrorFallback 
        error={error} 
        resetErrorBoundary={resetErrorState} 
      />
    );
  }

  // Show only grade filter
  if (showOnlyGradeFilter) {
    return (
      <div className="relative grade-filter-dropdown">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <button
            onClick={toggleGradeDropdown}
            className={`w-full ${categoryInfo?.bgClass || 'bg-blue-50 dark:bg-blue-900/20'} border-b ${categoryInfo?.borderClass || 'border-gray-200 dark:border-gray-700'} px-3 sm:px-4 py-3 sm:py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 touch-manipulation`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                <div className={`p-1.5 sm:p-2 rounded-lg ${categoryInfo?.bgClass || 'bg-blue-50 dark:bg-blue-900/20'} border ${categoryInfo?.borderClass || 'border-gray-200'}`}>
                  <Filter className={`h-4 w-4 sm:h-5 sm:w-5 ${categoryInfo?.colorClass || 'text-blue-600 dark:text-blue-400'}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">
                    {selectedGradeLabel}
                  </h3>
                  <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">
                      {memoizedCourses.length} {memoizedCourses.length === 1 ? 'course' : 'courses'}
                    </span>
                  </div>
                </div>
              </div>
              
              <motion.div
                animate={{ rotate: isGradeExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="p-1 sm:p-1.5"
              >
                <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
              </motion.div>
            </div>
          </button>

          <AnimatePresence>
            {isGradeExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute z-50 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-b-xl shadow-lg max-h-64 overflow-hidden"
              >
                <div className="p-3 sm:p-4 space-y-2 max-h-64 overflow-y-auto">
                  <motion.div
                    key="all"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => handleGradeChangeWithReset('all')}
                    className={`p-2.5 sm:p-3 rounded-lg cursor-pointer transition-all duration-300 touch-manipulation ${
                      selectedGrade === 'all'
                        ? `${categoryInfo?.bgClass || 'bg-blue-50 dark:bg-blue-900/20'} shadow-lg ring-2 ring-blue-500/20 dark:ring-blue-400/20`
                        : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md active:scale-95'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                        All Grades
                      </span>
                      {selectedGrade === 'all' && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="p-1 rounded-full bg-blue-500"
                        >
                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>

                  {availableGrades.map((grade, index) => (
                    <motion.div
                      key={grade.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      onClick={() => handleGradeChangeWithReset(grade.id)}
                      className={`p-2.5 sm:p-3 rounded-lg cursor-pointer transition-all duration-300 touch-manipulation ${
                        selectedGrade === grade.id
                          ? `${categoryInfo?.bgClass || 'bg-blue-50 dark:bg-blue-900/20'} shadow-lg ring-2 ring-blue-500/20 dark:ring-blue-400/20`
                          : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md active:scale-95'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                          {grade.label}
                        </span>
                        {selectedGrade === grade.id && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="p-1 rounded-full bg-blue-500"
                          >
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Grade Level Selector - Only show if hideGradeSelector is false */}
      {!hideGradeSelector && (
        <div className="relative grade-filter-dropdown">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <button
              onClick={toggleGradeDropdown}
              className={`w-full ${categoryInfo?.bgClass || 'bg-blue-50 dark:bg-blue-900/20'} border-b ${categoryInfo?.borderClass || 'border-gray-200 dark:border-gray-700'} px-3 sm:px-4 py-3 sm:py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 touch-manipulation`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                  <div className={`p-1.5 sm:p-2 rounded-lg ${categoryInfo?.bgClass || 'bg-blue-50 dark:bg-blue-900/20'} border ${categoryInfo?.borderClass || 'border-gray-200'}`}>
                    <GraduationCap className={`h-4 w-4 sm:h-5 sm:w-5 ${categoryInfo?.colorClass || 'text-blue-600 dark:text-blue-400'}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">
                      {selectedGradeLabel}
                    </h3>
                    <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">
                        Grade Level Selection
                      </span>
                    </div>
                  </div>
                </div>
                
                <motion.div
                  animate={{ rotate: isGradeExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-1 sm:p-1.5"
                >
                  <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
                </motion.div>
              </div>
            </button>

            <AnimatePresence>
              {isGradeExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute z-50 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-b-xl shadow-lg max-h-64 overflow-hidden"
                >
                  <div className="p-3 sm:p-4 space-y-2 max-h-64 overflow-y-auto">
                    <motion.div
                      key="all"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => handleGradeChangeWithReset('all')}
                      className={`p-2.5 sm:p-3 rounded-lg cursor-pointer transition-all duration-300 touch-manipulation ${
                        selectedGrade === 'all'
                          ? `${categoryInfo?.bgClass || 'bg-blue-50 dark:bg-blue-900/20'} shadow-lg ring-2 ring-blue-500/20 dark:ring-blue-400/20`
                          : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md active:scale-95'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                          All Grades
                        </span>
                        {selectedGrade === 'all' && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="p-1 rounded-full bg-blue-500"
                          >
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>

                    {availableGrades.map((grade, index) => (
                      <motion.div
                        key={grade.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        onClick={() => handleGradeChangeWithReset(grade.id)}
                        className={`p-2.5 sm:p-3 rounded-lg cursor-pointer transition-all duration-300 touch-manipulation ${
                          selectedGrade === grade.id
                            ? `${categoryInfo?.bgClass || 'bg-blue-50 dark:bg-blue-900/20'} shadow-lg ring-2 ring-blue-500/20 dark:ring-blue-400/20`
                            : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md active:scale-95'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                            {grade.label}
                          </span>
                          {selectedGrade === grade.id && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="p-1 rounded-full bg-blue-500"
                            >
                              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      {/* Course Selection */}
      <div className="relative grade-filter-dropdown">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: hideGradeSelector ? 0 : 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <button
            onClick={toggleCourseDropdown}
            disabled={memoizedCourses.length === 0}
            className={`w-full ${categoryInfo?.bgClass || 'bg-blue-50 dark:bg-blue-900/20'} border-b ${categoryInfo?.borderClass || 'border-gray-200 dark:border-gray-700'} px-3 sm:px-4 py-3 sm:py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                <div className={`p-1.5 sm:p-2 rounded-lg ${categoryInfo?.bgClass || 'bg-blue-50 dark:bg-blue-900/20'} border ${categoryInfo?.borderClass || 'border-gray-200'}`}>
                  <BookOpen className={`h-4 w-4 sm:h-5 sm:w-5 ${categoryInfo?.colorClass || 'text-blue-600 dark:text-blue-400'}`} />
                </div>
                <div className="min-w-0 flex-1">
                  {selectedCourse ? (
                    <>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">
                        {selectedCourse.title}
                      </h3>
                      <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                        <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-2 py-0.5 rounded-full">
                          Selected
                        </span>
                        <span className="font-medium">
                          {formatDuration(selectedCourse.course_duration)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                        Select a Course
                      </h3>
                      <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium">
                          {memoizedCourses.length} {memoizedCourses.length === 1 ? 'course' : 'courses'}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <motion.div
                animate={{ rotate: isCourseExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="p-1 sm:p-1.5"
              >
                <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
              </motion.div>
            </div>
          </button>

          <AnimatePresence>
            {isCourseExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute z-50 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-b-xl shadow-lg max-h-96 overflow-hidden"
              >
                <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 max-h-96 overflow-y-auto">
                  {memoizedCourses.length === 0 ? (
                    <div className="text-center py-6 sm:py-8">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">Coming Soon</h3>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">New courses for this grade are launching soon. Stay tuned!</p>
                      {!hideGradeSelector && selectedGrade !== 'all' && (
                        <button
                          onClick={() => handleGradeChangeWithReset('all')}
                          className="mt-3 sm:mt-4 text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full"
                        >
                          View All Grades
                        </button>
                      )}
                    </div>
                  ) : (
                    <AnimatePresence mode="wait">
                      {memoizedCourses.map((course, index) => (
                        <motion.div
                          key={course._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          onClick={() => handleCourseClick(course)}
                          whileHover={{ scale: isMobile ? 1 : 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          className={`relative p-3 sm:p-4 rounded-xl cursor-pointer transition-all duration-300 touch-manipulation ${
                            selectedCourse?._id === course._id
                              ? `${categoryInfo?.bgClass || 'bg-blue-50 dark:bg-blue-900/20'} shadow-lg ring-2 ring-blue-500/20 dark:ring-blue-400/20 transform scale-[1.01]`
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
                            {/* Course Title */}
                            <h4 className="font-medium text-sm sm:text-base text-gray-900 dark:text-white truncate pr-6 sm:pr-8">
                              {course.title}
                            </h4>
                            
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
                              {course.is_Certification && (
                                <span className={`inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium border ${
                                  selectedCourse?._id === course._id
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200 border-amber-200 dark:border-amber-700'
                                    : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                                }`}>
                                  <Award className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                                  Certificate
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
      </div>
    </div>
  );
};

export default GradeFilter; 