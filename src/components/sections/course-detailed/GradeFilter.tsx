'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  ChevronDown, GraduationCap, Info, RefreshCw, 
  BookOpen, Clock, CheckCircle2, Award, AlertTriangle, 
  Filter 
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
}

// Error Boundary Component
const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => (
  <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl text-center">
    <div className="flex justify-center mb-4">
      <AlertTriangle className="h-12 w-12 text-red-500" />
    </div>
    <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-3">
      Filter Error
    </h2>
    <p className="text-gray-700 dark:text-gray-300 mb-4">
      {error || "We couldn't apply the filters. Please try again."}
    </p>
    <button
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg"
    >
      Reset Filters
    </button>
  </div>
);

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
  showOnlyGradeFilter = false
}) => {
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastProcessedCoursesLength, setLastProcessedCoursesLength] = useState<number>(0);

  // Stable refs to prevent infinite loops
  const handleCourseSelectionRef = useRef(handleCourseSelection);
  const handleGradeChangeRef = useRef(handleGradeChange);
  
  // Update refs when props change
  useEffect(() => {
    handleCourseSelectionRef.current = handleCourseSelection;
    handleGradeChangeRef.current = handleGradeChange;
  }, [handleCourseSelection, handleGradeChange]);

  // Memoize courses with stable dependencies
  const memoizedCourses = useMemo(() => {
    return filteredCourses || [];
  }, [filteredCourses?.length, filteredCourses?.map(c => c._id).join(',')]);

  // Optimized course auto-selection - only when courses change significantly
  useEffect(() => {
    const coursesLength = memoizedCourses.length;
    
    // Skip if courses haven't changed significantly
    if (coursesLength === lastProcessedCoursesLength) {
      return;
    }
    
    setLastProcessedCoursesLength(coursesLength);
    
    // Don't interfere with course selection - let parent component handle auto-selection
    // This component should only handle the dropdown display and user interactions
    
  }, [memoizedCourses.length]); // Minimal dependencies - removed auto-selection logic

  // Handle clicks outside the courses dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const dropdown = document.getElementById('courses-dropdown');
      const dropdownTrigger = document.getElementById('courses-dropdown-trigger');
      
      if (dropdown && dropdownTrigger &&
          event.target instanceof Node &&
          !dropdown.contains(event.target) && 
          !dropdownTrigger.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Stable grade change handler
  const handleGradeChangeWithReset = useCallback((gradeId: string) => {
    if (handleGradeChangeRef.current) {
      handleGradeChangeRef.current(gradeId);
    }
    // Reset dropdown visibility
    setDropdownVisible(false);
  }, []);

  // Stable course selection handler
  const handleCourseClick = useCallback((course: Course) => {
    if (handleCourseSelectionRef.current) {
      handleCourseSelectionRef.current(course);
    }
    setDropdownVisible(false);
  }, []);

  // Toggle dropdown with error handling
  const toggleDropdown = useCallback((): void => {
    setDropdownVisible(prev => !prev);
  }, []);

  // Reset error state - stable version
  const resetErrorState = useCallback((): void => {
    setError(null);
    if (typeof setSelectedGrade === 'function') {
      setSelectedGrade('all');
    }
  }, [setSelectedGrade]);

  // If there's an error, show error fallback
  if (error) {
    return (
      <ErrorFallback 
        error={error} 
        resetErrorBoundary={resetErrorState} 
      />
    );
  }

  // If showOnlyGradeFilter is true, only show the grade filter
  if (showOnlyGradeFilter) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
          <Filter className="w-4 h-4 mr-2" />
          Filter by Grade Level
        </label>
        <div className="relative group">
          <select
            value={selectedGrade}
            onChange={(e) => handleGradeChangeWithReset(e.target.value)}
            className="appearance-none block w-full px-4 py-3 text-base transition-all duration-200 ease-in-out
            border-2 dark:border-gray-600 rounded-xl
            bg-white dark:bg-gray-700 
            text-gray-900 dark:text-white
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900
            focus:border-primary-500 dark:focus:border-primary-400
            hover:border-gray-400 dark:hover:border-gray-500
            shadow-sm hover:shadow-md
            cursor-pointer
            group-hover:border-gray-400 dark:group-hover:border-gray-500"
            aria-label="Select grade level"
          >
            <option value="all">All Grades</option>
            {availableGrades.map((option) => (
              <option 
                key={option.id} 
                value={option.id}
                className="py-2"
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
            <div className="border-l border-gray-200 dark:border-gray-600 pl-3 py-2">
              <ChevronDown className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
            </div>
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
          <Info className="w-3 h-3 mr-1" />
          {memoizedCourses.length} {memoizedCourses.length === 1 ? 'course' : 'courses'} available
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Special header for categories without grade selector */}
      {hideGradeSelector && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-full ${categoryInfo?.bgClass || 'bg-primary-50 dark:bg-primary-900/20'}`}>
              <BookOpen className={`w-5 h-5 ${categoryInfo?.colorClass || 'text-primary-600 dark:text-primary-400'}`} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Course Selection
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Choose from our available courses
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Grade Level Selector - Only show if hideGradeSelector is false */}
      {!hideGradeSelector && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <GraduationCap className="w-4 h-4 mr-2" />
            Grade Level
          </label>
          <div className="relative group">
            <select
              value={selectedGrade}
              onChange={(e) => handleGradeChangeWithReset(e.target.value)}
              className="appearance-none block w-full px-4 py-3 text-base transition-all duration-200 ease-in-out
              border-2 dark:border-gray-600 rounded-xl
              bg-white dark:bg-gray-700 
              text-gray-900 dark:text-white
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900
              focus:border-primary-500 dark:focus:border-primary-400
              hover:border-gray-400 dark:hover:border-gray-500
              shadow-sm hover:shadow-md
              cursor-pointer
              group-hover:border-gray-400 dark:group-hover:border-gray-500"
              aria-label="Select grade level"
            >
              <option value="all">All Grades</option>
              {availableGrades.map((option) => (
                <option 
                  key={option.id} 
                  value={option.id}
                  className="py-2"
                >
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
              <div className="border-l border-gray-200 dark:border-gray-600 pl-3 py-2">
                <ChevronDown className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
              </div>
            </div>
          
            <div className="absolute inset-x-0 h-1/2 bottom-0 rounded-b-xl bg-gradient-to-t from-gray-50 dark:from-gray-800/50 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
         
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <Info className="w-3 h-3 mr-1" />
            Select a grade level to filter available courses
          </p>
        </div>
      )}

      {/* Course Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="mb-4 border-b border-gray-100 dark:border-gray-700 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                {hideGradeSelector 
                  ? `Available Courses` 
                  : selectedGrade === 'all' 
                    ? 'All Grades' 
                    : `Courses for ${availableGrades.find(g => g.id === selectedGrade)?.label || 'Selected Grade'}`
                }
              </h3>
            </div>
            
            <div className="flex items-center gap-2">
              {!hideGradeSelector && selectedGrade !== 'all' && (
                <button
                  onClick={() => handleGradeChangeWithReset('all')}
                  className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                >
                  View All
                </button>
              )}
              <span className="text-xs text-gray-400 dark:text-gray-500 mx-1">•</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {memoizedCourses.length} {memoizedCourses.length === 1 ? 'course' : 'courses'}
              </span>
            </div>
          </div>
        </div>

        {/* Course Selection or Empty State */}
        {memoizedCourses.length > 0 ? (
          <div className="relative">
            {/* Selected course display */}
            <div 
              id="courses-dropdown-trigger"
              className={`flex items-center justify-between p-3 border-2 rounded-lg cursor-pointer transition-all ${
                selectedCourse 
                  ? `${categoryInfo?.borderClass || 'border-primary-300 dark:border-primary-700'} ${categoryInfo?.bgClass || 'bg-primary-50 dark:bg-primary-900/20'}`
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              onClick={toggleDropdown}
            >
              {selectedCourse ? (
                <div className="flex items-center min-w-0">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {selectedCourse.title}
                    </p>
                    <div className="flex flex-wrap items-center mt-1 gap-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {selectedCourse.course_duration || 'Flexible'}
                      </div>
                      {selectedCourse.is_Certification && (
                        <div className="text-xs text-green-600 dark:text-green-400 flex items-center">
                          <Award className="w-3 h-3 mr-1" />
                          Certificate
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Select a course to begin...
                </p>
              )}
              <ChevronDown className={`h-5 w-5 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${dropdownVisible ? 'transform rotate-180' : ''}`} />
            </div>
            
            {/* Course Dropdown */}
            {dropdownVisible && (
              <motion.div
                id="courses-dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto"
              >
                <div className="p-1">
                  {memoizedCourses.map((course) => (
                    <div
                      key={course._id}
                      className={`p-2 cursor-pointer rounded-md transition-colors ${
                        selectedCourse?._id === course._id 
                          ? `${categoryInfo?.bgClass || 'bg-primary-50 dark:bg-primary-900/20'} ${categoryInfo?.colorClass || 'text-primary-600 dark:text-primary-400'}`
                          : 'hover:bg-gray-50 dark:hover:bg-gray-750'
                      }`}
                      onClick={() => handleCourseClick(course)}
                    >
                      <div className="flex items-center">
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-medium truncate ${selectedCourse?._id === course._id ? categoryInfo?.colorClass || 'text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'}`}>
                            {course.title}
                          </p>
                          <div className="flex flex-wrap items-center mt-0.5 gap-2">
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {course.course_duration || 'Flexible'}
                            </div>
                            {course.is_Certification && (
                              <div className="text-xs text-green-600 dark:text-green-400 flex items-center">
                                <Award className="w-3 h-3 mr-1" />
                                Certificate
                              </div>
                            )}
                          </div>
                        </div>
                        {selectedCourse?._id === course._id && (
                          <CheckCircle2 className={`h-4 w-4 ml-2 ${categoryInfo?.colorClass || 'text-primary-600 dark:text-primary-400'}`} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
            <Filter className="h-6 w-6 text-gray-300 dark:text-gray-600 mb-2" />
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              No courses available
            </p>
            {!hideGradeSelector && selectedGrade !== 'all' && (
              <button
                onClick={() => handleGradeChangeWithReset('all')}
                className="mt-3 text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-full"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GradeFilter; 