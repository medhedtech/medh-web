import React, { useState, useEffect } from 'react';
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

  const formatCourseGrade = (grade: string): string => {
    if (grade === "UG - Graduate - Professionals") {
      return "Professional Grad Diploma";
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
      <button
        type="button"
        onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
        disabled={disabled || loading || courses.length === 0}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="flex-1 min-w-0">
          {selectedCourseInfo ? (
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-medium truncate">{selectedCourseInfo.course_title}</div>
                {selectedCourseInfo.course_grade && (
                  <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                    🎓 {formatCourseGrade(selectedCourseInfo.course_grade)}
                  </div>
                )}
              </div>
            </div>
          ) : loading ? (
            <span className="text-gray-500 flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 mr-2"></div>
              Loading courses...
            </span>
          ) : (
            <span className="text-gray-500">
              {courses.length === 0 ? 'No courses available' : placeholder}
            </span>
          )}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && !loading && courses.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-96 overflow-hidden">
          {/* Header with search and filters */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 space-y-3">
            {/* Search Input */}
            {showSearch && (
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
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
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Grades</option>
                {uniqueGrades.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            )}

            {/* Results count */}
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
            </div>
          </div>

          {/* Course List */}
          <div className="max-h-64 overflow-y-auto">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <div
                  key={course._id}
                  onClick={() => handleCourseSelect(course._id)}
                  className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1 truncate">
                        {course.course_title}
                      </h4>
                      
                      {/* Course Grade - Prominently displayed */}
                      {course.course_grade && (
                        <div className="mb-2">
                          <span className="inline-flex items-center bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                            🎓 {formatCourseGrade(course.course_grade)}
                          </span>
                        </div>
                      )}
                      
                      {/* Course Details */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-2">
                        <span className="flex items-center">
                          <BookOpen className="h-3 w-3 mr-1" />
                          {course.course_category}
                        </span>
                        {course.course_duration && (
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {course.course_duration}
                          </span>
                        )}
                        {course.no_of_Sessions && (
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {course.no_of_Sessions} sessions
                          </span>
                        )}
                      </div>
                      
                      {/* Price Information */}
                      {course.prices && course.prices.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {course.prices
                            .filter(price => price.is_active)
                            .slice(0, 2)
                            .map((price, index) => (
                              <div key={index} className="text-xs">
                                <span className="text-green-600 dark:text-green-400 font-medium">
                                  Batch: {formatPrice(price.batch, price.currency)}
                                </span>
                                <span className="text-gray-500 ml-2">
                                  Individual: {formatPrice(price.individual, price.currency)}
                                </span>
                              </div>
                            ))
                          }
                        </div>
                      )}
                    </div>
                    
                    {selectedCourse === course._id && (
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 ml-2" />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                {searchQuery || gradeFilter !== 'all' ? 'No courses match your criteria' : 'No courses available'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Selected Course Summary (when closed) */}
      {selectedCourseInfo && !isOpen && (
        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center min-w-0">
              <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-medium text-gray-900 dark:text-white truncate">
                  {selectedCourseInfo.course_title}
                </div>
                {selectedCourseInfo.course_grade && (
                  <div className="text-xs text-purple-600 dark:text-purple-400">
                    🎓 {formatCourseGrade(selectedCourseInfo.course_grade)}
                  </div>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onCourseSelect('')}
              className="text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseGradeSelector; 