'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Check, 
  ChevronRight, 
  Info 
} from 'lucide-react';
import CourseDetailsPage from '../pages/CourseDetailsPage';
import { toast, Toaster } from 'react-hot-toast';

export default function CourseDetailsExample() {
  const [courseId, setCourseId] = useState('64f3317a1e5780e4ed9c7e0d'); // Example course ID
  const [inputValue, setInputValue] = useState('64f3317a1e5780e4ed9c7e0d');
  
  // List of example courses to choose from
  const exampleCourses = [
    { id: '64f3317a1e5780e4ed9c7e0d', name: 'Vedic Mathematics' },
    { id: '64f3317a1e5780e4ed9c7e0e', name: 'Data Science Fundamentals' },
    { id: '64f3317a1e5780e4ed9c7e0f', name: 'Digital Marketing' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setCourseId(inputValue);
      showToast.success('Course ID updated!');
    } else {
      showToast.error('Please enter a valid course ID');
    }
  };

  const handleSelectCourse = (id) => {
    setInputValue(id);
    setCourseId(id);
    showToast.success('Selected new course!');
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Toaster position="top-right" />
      
      {/* Course ID Input */}
      <div className="max-w-6xl mx-auto pt-8 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Course Details Demo
          </h2>
          
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="block w-full pl-10 py-2.5 px-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
                  placeholder="Enter course ID"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm"
              >
                Load Course
              </button>
            </div>
          </form>
          
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <Info className="w-4 h-4 mr-1" />
              Example Courses
            </h3>
            <div className="flex flex-wrap gap-2">
              {exampleCourses.map((course) => (
                <motion.button
                  key={course.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectCourse(course.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    courseId === course.id
                      ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-2 border-emerald-400 dark:border-emerald-700'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {courseId === course.id && (
                    <Check className="w-3.5 h-3.5 inline-block mr-1" />
                  )}
                  {course.name}
                </motion.button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
            <ChevronRight className="w-4 h-4" />
            <p>
              Current Course ID: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{courseId}</span>
            </p>
          </div>
        </div>
      </div>
      
      {/* Course Details Component */}
      <CourseDetailsPage courseId={courseId} />
    </div>
  );
} 