import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle, BookOpen, Clock, Users, Search, X } from 'lucide-react';

interface ICoursePrice {
  currency: string;
  individual: number;
  batch: number;
  min_batch_size: number;
  max_batch_size: number;
  is_active: boolean;
  _id?: string;
}

interface ICourse {
  _id: string;
  course_title: string;
  course_category: string;
  course_subcategory?: string;
  course_level?: string;
  course_duration?: string;
  no_of_Sessions?: number;
  session_duration?: string;
  course_grade?: string;
  course_image?: string;
  status?: string;
  isFree?: boolean;
  prices?: Array<{
    currency: string;
    individual: number;
    batch: number;
    min_batch_size: number;
    max_batch_size: number;
    is_active: boolean;
  }>;
}

interface CourseGradeSelectorProps {
  courses: ICourse[];
  selectedCourse?: string;
  onCourseSelect: (courseId: string) => void;
  loading?: boolean;
  placeholder?: string;
  className?: string;
  showSearch?: boolean;
  showGradeFilter?: boolean;
  disabled?: boolean;
}

const CourseGradeSelector: React.FC<CourseGradeSelectorProps> = ({
  courses,
  selectedCourse,
  onCourseSelect,
  loading = false,
  placeholder = "Select a course",
  className = "",
  showSearch = true,
  showGradeFilter = false,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('all');

  // Get unique course grades for filtering
  const uniqueGrades = React.useMemo(() => {
    const grades = courses
      .map(course => course.course_grade)
      .filter((grade, index, array) => grade && array.indexOf(grade) === index)
      .sort();
    return grades;
  }, [courses]);

  // Filter courses based on search and grade filter
  const filteredCourses = React.useMemo(() => {
    let filtered = courses;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.course_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.course_category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.course_grade && course.course_grade.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply grade filter
    if (gradeFilter !== 'all') {
      filtered = filtered.filter(course => course.course_grade === gradeFilter);
    }

    return filtered;
  }, [courses, searchQuery, gradeFilter]);

  const selectedCourseInfo = courses.find(course => course._id === selectedCourse);

  const formatPrice = (price: number, currency: string) => {
    const currencySymbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      INR: '₹',
      GBP: '£',
      AED: 'د.إ',
    };
    return `${currencySymbols[currency] || currency} ${price.toLocaleString()}`;
  };

  const formatCourseGrade = (grade: string | undefined): string => {
    if (!grade) return '';
    if (grade === "UG - Graduate - Professionals") {
      return "UG - Grad - Prof";
    }
    return grade;
  };

  const handleCourseSelect = (courseId: string) => {
    onCourseSelect(courseId);
    setIsOpen(false);
    setSearchQuery('');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest('.course-grade-selector')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className={`relative course-grade-selector ${className}`}>
      {/* Main Selector Button */}
      <motion.button
        type="button"
        onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
        disabled={disabled || loading || courses.length === 0}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0 flex-1">
              {selectedCourseInfo ? (
                <>
                  <div className="font-medium text-gray-900 dark:text-white truncate">
                    {selectedCourseInfo.course_title}
                  </div>
                                     {selectedCourseInfo.course_grade && (
                     <div className="flex items-center space-x-2 mt-1">
                       <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 border-emerald-200 dark:border-emerald-700">
                         {formatCourseGrade(selectedCourseInfo.course_grade)}
                       </span>
                       <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded-full">
                         Selected
                       </span>
                     </div>
                   )}
                </>
              ) : loading ? (
                <div className="flex items-center text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 mr-2"></div>
                  Loading courses...
                </div>
              ) : (
                <>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {courses.length === 0 ? 'No courses available' : placeholder}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {courses.length} {courses.length === 1 ? 'course available' : 'courses available'}
                  </div>
                </>
              )}
            </div>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </motion.div>
        </div>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && !loading && courses.length > 0 && (
                     <motion.div
             initial={{ height: 0, opacity: 0 }}
             animate={{ height: 'auto', opacity: 1 }}
             exit={{ height: 0, opacity: 0 }}
             transition={{ duration: 0.3 }}
             className="absolute z-50 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-b-xl shadow-lg max-h-96 overflow-hidden"
           >
                         {/* Header with search and filters */}
             {(showSearch || showGradeFilter) && (
               <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-3">
                {/* Search Input */}
                {showSearch && (
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}

                {/* Grade Filter */}
                {showGradeFilter && uniqueGrades.length > 0 && (
                  <select
                    value={gradeFilter}
                    onChange={(e) => setGradeFilter(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                  >
                    <option value="all">All Grades</option>
                    {uniqueGrades.map((grade) => (
                      <option key={grade} value={grade}>
                        {formatCourseGrade(grade)}
                      </option>
                    ))}
                  </select>
                )}

                {/* Results count */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found</span>
                  {(searchQuery || gradeFilter !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setGradeFilter('all');
                      }}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>
            )}

                         {/* Course List */}
             <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
               {filteredCourses.length > 0 ? (
                 <AnimatePresence mode="wait">
                   {filteredCourses.map((course, index) => (
                     <motion.div
                       key={course._id}
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -10 }}
                       transition={{ duration: 0.3, delay: index * 0.05 }}
                       onClick={() => handleCourseSelect(course._id)}
                       whileHover={{ scale: 1.01 }}
                       whileTap={{ scale: 0.99 }}
                       className={`relative p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                         selectedCourse === course._id
                           ? 'bg-blue-50 dark:bg-blue-900/20 shadow-lg ring-2 ring-blue-500/20 dark:ring-blue-400/20 transform scale-[1.01]'
                           : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
                       }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2 truncate pr-8">
                            {course.course_title}
                          </h4>
                          
                                                     {/* Course Grade - Prominently displayed */}
                           {course.course_grade && (
                             <div className="mb-3">
                               <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 border-emerald-200 dark:border-emerald-700">
                                 {formatCourseGrade(course.course_grade)}
                               </span>
                             </div>
                           )}
                          
                          {/* Course Details */}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-400 mb-3">
                            <span className="flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                              <BookOpen className="h-3 w-3 mr-1" />
                              {course.course_category}
                            </span>
                            {course.course_duration && (
                              <span className="flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                                <Clock className="h-3 w-3 mr-1" />
                                {course.course_duration}
                              </span>
                            )}
                            {course.no_of_Sessions && (
                              <span className="flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                                <Users className="h-3 w-3 mr-1" />
                                {course.no_of_Sessions} sessions
                              </span>
                            )}
                          </div>
                          
                          {/* Price Information */}
                          {course.prices && course.prices.length > 0 && (
                            <div className="space-y-1">
                              {course.prices
                                .filter(price => price.is_active)
                                .slice(0, 2)
                                .map((price, index) => (
                                  <div key={index} className="flex items-center justify-between text-xs">
                                    <span className="text-green-600 dark:text-green-400 font-medium">
                                      Batch: {formatPrice(price.batch, price.currency)}
                                    </span>
                                    <span className="text-gray-500 dark:text-gray-400">
                                      Individual: {formatPrice(price.individual, price.currency)}
                                    </span>
                                  </div>
                                ))
                              }
                            </div>
                          )}
                        </div>
                        
                        {selectedCourse === course._id && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute top-3 right-3 p-1 rounded-full bg-blue-500 shadow-md"
                          >
                            <CheckCircle className="h-4 w-4 text-white" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {searchQuery || gradeFilter !== 'all' ? 'No matches found' : 'No courses available'}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {searchQuery || gradeFilter !== 'all' 
                      ? 'Try adjusting your search criteria' 
                      : 'New courses are coming soon'
                    }
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseGradeSelector; 