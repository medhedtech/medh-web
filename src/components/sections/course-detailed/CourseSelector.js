'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  ChevronDown, 
  CheckCircle2, 
  Clock, 
  GraduationCap,
  Award,
  Sparkles
} from 'lucide-react';

const CourseSelector = ({ 
  courses = [], 
  selectedCourse, 
  handleCourseSelection, 
  categoryInfo = {},
  selectedGrade = 'all',
  onGradeChange,
  availableGrades = []
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  
  // Reset to "all" grades if grade is changed
  useEffect(() => {
    if (onGradeChange && selectedGrade !== 'all' && courses.length === 0) {
      // Optional: Auto-reset to all courses if the current grade has no courses
      // onGradeChange('all');
    }
  }, [courses.length, selectedGrade, onGradeChange]);
  
  // Handle clicks outside the courses dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.getElementById('courses-dropdown');
      const dropdownTrigger = document.getElementById('courses-dropdown-trigger');
      
      if (dropdown && dropdownTrigger &&
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

  const toggleDropdown = () => {
    setDropdownVisible(prev => !prev);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header - Always visible */}
      <div className="mb-4 border-b border-gray-100 dark:border-gray-700 pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
              {categoryInfo?.displayName || "Course Selection"}
              <Sparkles className="w-3 h-3 ml-1 text-amber-500" />
            </h3>
          </div>
          
          {/* Grade Selector */}
          {availableGrades.length > 0 && (
            <select
              value={selectedGrade}
              onChange={(e) => onGradeChange?.(e.target.value)}
              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg px-2 py-1.5 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
            >
              <option value="all">All Grades</option>
              {availableGrades.map((grade) => (
                <option key={grade.id} value={grade.id}>
                  {grade.label}
                </option>
              ))}
            </select>
          )}
        </div>
        
        {/* Always show course status line */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              All Courses
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500 mx-1">•</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {courses.length} {courses.length === 1 ? 'course' : 'courses'}
            </span>
          </div>
          
          {selectedGrade !== 'all' && (
            <button
              onClick={() => onGradeChange?.('all')}
              className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
            >
              View All
            </button>
          )}
        </div>
      </div>

      {/* Course Selection or Empty State */}
      {courses.length > 0 ? (
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
                {courses.map((course) => (
                  <div
                    key={course._id}
                    className={`p-2 cursor-pointer rounded-md transition-colors ${
                      selectedCourse?._id === course._id 
                        ? `${categoryInfo?.bgClass || 'bg-primary-50 dark:bg-primary-900/20'} ${categoryInfo?.colorClass || 'text-primary-600 dark:text-primary-400'}`
                        : 'hover:bg-gray-50 dark:hover:bg-gray-750'
                    }`}
                    onClick={() => {
                      handleCourseSelection(course);
                      setDropdownVisible(false);
                    }}
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
          <GraduationCap className="h-6 w-6 text-gray-300 dark:text-gray-600 mb-2" />
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            No courses available
          </p>
          {selectedGrade !== 'all' && (
            <button
              onClick={() => onGradeChange?.('all')}
              className="mt-3 text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-full"
            >
              View all grades
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseSelector; 