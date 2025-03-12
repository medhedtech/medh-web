'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle2, Clock, Calendar, Users, Award, CreditCard, Star, Calculator, BrainCircuit, TrendingUp, UserCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';

// Core components
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import ThemeController from "@/components/shared/others/ThemeController";
import Preloader from "@/components/shared/others/Preloader";

// API and utilities
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import { parseApiError, formatDuration, formatPrice, getDurationFilter } from './errorHandler';

// Import custom styles
import './styles.css';

// Duration options
const DURATION_OPTIONS = [
  { id: 'short', name: '1-3 Months', label: 'Short Term', description: 'Quick skill acquisition for immediate application' },
  { id: 'medium', name: '3-6 Months', label: 'Medium Term', description: 'Comprehensive learning with in-depth practice' },
  { id: 'long', name: '6-12 Months', label: 'Long Term', description: 'Mastery-focused complete learning journey' }
];

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },
  exit: { 
    opacity: 0,
    y: 20,
    transition: { duration: 0.2 }
  }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

function EnrollmentPage() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState('medium');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { getQuery } = useGetQuery();
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  // Update the component to recognize the category URL parameter
  console.log("Category from URL:", category);

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        getQuery({
          url: apiUrls.courses.getAllCoursesWithLimits(1, 100, "", "", "", "Published"),
          onSuccess: (response) => {
            const courseData = response?.courses || [];
            setCourses(courseData);
            setFilteredCourses(courseData);
            setLoading(false);
            
            // Select the first course by default if available
            if (courseData.length > 0) {
              setSelectedCourse(courseData[0]);
            }
          },
          onFail: (err) => {
            console.error("Error fetching courses:", err);
            setError(parseApiError(err) || 'Failed to load courses');
            setLoading(false);
          }
        });
      } catch (err) {
        console.error("Unexpected error in fetchCourses:", err);
        setError(parseApiError(err) || 'An unexpected error occurred');
        setLoading(false);
      }
    };

    fetchCourses();
  }, [getQuery]);

  // Filter courses when duration changes
  useEffect(() => {
    if (!courses.length) return;
    
    // Get the appropriate filter function based on selected duration
    const durationFilter = getDurationFilter(selectedDuration);
    
    // Filter courses by duration and search term
    const filtered = courses.filter(course => {
      const matchesDuration = durationFilter(course);
      const matchesSearch = !searchTerm || 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.category && course.category.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesDuration && matchesSearch;
    });
    
    setFilteredCourses(filtered);
    
    // Update selected course if current selection is not in filtered results
    if (filtered.length > 0) {
      if (!selectedCourse || !filtered.some(course => course._id === selectedCourse._id)) {
        setSelectedCourse(filtered[0]);
      }
    } else {
      setSelectedCourse(null);
    }
  }, [selectedDuration, courses, searchTerm, selectedCourse]);

  // Handle duration selection
  const handleDurationChange = (durationId) => {
    setSelectedDuration(durationId);
  };

  // Handle course selection
  const handleCourseSelection = (course) => {
    setSelectedCourse(course);
  };

  // Handle enrollment
  const handleEnroll = () => {
    if (!selectedCourse) {
      toast.error('Please select a course first');
      return;
    }
    
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    
    if (!user) {
      toast.error('Please login to enroll in this course');
      router.push('/login');
      return;
    }
    
    // Redirect to course details page
    router.push(`/course-details/${selectedCourse._id}`);
  };

  return (
    <PageWrapper>
      <Toaster position="bottom-center" />
      <div className="relative min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 enrollment-page">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 transform-gpu">
          <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Course Enrollment
              </h1>
              <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-full">
                Enrollment
              </span>
            </div>
            
            {/* Search input */}
            <div className="relative max-w-sm">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </nav>
        </header>

        {/* Content with Header Offset */}
        <main className="flex-grow pt-24">
          {loading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="apple-loader">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          ) : error ? (
            <div className="max-w-3xl mx-auto px-4 py-10 text-center">
              <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-8">
                <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-3">
                  Failed to load courses
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {error}
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-5 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <div className="container mx-auto px-4">
              {/* Duration Selection - Apple-style */}
              <motion.section 
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeIn}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
                  Choose Your Learning Journey
                </h2>
                <p className="text-lg text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
                  Select a duration that fits your schedule and learning goals. Our courses are designed to provide quality education regardless of the time commitment.
                </p>
                
                <div className="max-w-4xl mx-auto apple-card">
                  <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700">
                    {DURATION_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleDurationChange(option.id)}
                        className={`p-6 text-left transition-all hover:bg-gray-50 dark:hover:bg-gray-750 ${
                          selectedDuration === option.id 
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-b-2 md:border-b-0 md:border-t-2 border-emerald-500' 
                            : ''
                        }`}
                      >
                        <div className="flex items-start">
                          <div className={`mt-0.5 flex-shrink-0 h-5 w-5 rounded-full ${
                            selectedDuration === option.id
                              ? 'bg-emerald-500'
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}>
                            {selectedDuration === option.id && (
                              <CheckCircle2 className="h-5 w-5 text-white" />
                            )}
                          </div>
                          <div className="ml-3">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {option.label}
                            </h3>
                            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                              {option.name}
                            </p>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                              {option.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.section>

              {/* Course Selection Grid */}
              <motion.section 
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="mb-12"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Available Courses
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {filteredCourses.length > 0 
                    ? `Found ${filteredCourses.length} courses matching your duration preference` 
                    : 'No courses found for your selected duration. Try a different duration or search term.'}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence mode="wait">
                    {filteredCourses.map((course) => (
                      <motion.div
                        key={course._id}
                        variants={fadeIn}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        onClick={() => handleCourseSelection(course)}
                        className={`cursor-pointer rounded-xl overflow-hidden border-2 ${
                          selectedCourse?._id === course._id 
                            ? 'border-emerald-500 ring-2 ring-emerald-500/30' 
                            : 'border-gray-200 dark:border-gray-700'
                        } bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all`}
                      >
                        <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700">
                          {course.thumbnail ? (
                            <Image
                              src={course.thumbnail}
                              alt={course.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-emerald-500/20 to-blue-500/20">
                              <span className="text-xl font-bold text-gray-500 dark:text-gray-400">
                                {course.title?.substring(0, 1).toUpperCase() || 'M'}
                              </span>
                            </div>
                          )}
                          {selectedCourse?._id === course._id && (
                            <div className="absolute top-3 right-3 p-1.5 rounded-full bg-emerald-500">
                              <CheckCircle2 className="h-4 w-4 text-white" />
                            </div>
                          )}
                          <div className="absolute left-3 top-3">
                            <span className="px-2 py-1 text-xs font-medium bg-white/90 dark:bg-gray-900/90 text-gray-800 dark:text-gray-200 rounded-full">
                              {course.category || 'Course'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                            {course.title}
                          </h3>
                          
                          <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <Clock className="h-4 w-4 mr-1.5 text-gray-500 dark:text-gray-400" />
                            <span>{formatDuration(course.course_duration_days)}</span>
                          </div>
                          
                          <div className="mt-1 flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <Users className="h-4 w-4 mr-1.5 text-gray-500 dark:text-gray-400" />
                            <span>{course.enrolled_students || 0} students enrolled</span>
                          </div>
                          
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center text-yellow-500">
                              <Star className="h-4 w-4 fill-current" />
                              <Star className="h-4 w-4 fill-current" />
                              <Star className="h-4 w-4 fill-current" />
                              <Star className="h-4 w-4 fill-current" />
                              <Star className="h-4 w-4" />
                              <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                                4.0/5.0
                              </span>
                            </div>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                              {formatPrice(course.course_fee)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.section>

              {/* Selected Course Details */}
              {selectedCourse && (
                <motion.section 
                  key={selectedCourse._id}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={fadeIn}
                  className="max-w-5xl mx-auto mb-16"
                >
                  <div className="apple-card p-6 md:p-8">
                    <div className="md:flex items-start">
                      <div className="md:flex-shrink-0 mb-6 md:mb-0 md:mr-8">
                        <div className="image-gallery relative h-64 w-full md:w-80">
                          {selectedCourse.thumbnail ? (
                            <Image
                              src={selectedCourse.thumbnail}
                              alt={selectedCourse.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 320px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-emerald-500/20 to-blue-500/20">
                              <span className="text-6xl font-bold text-gray-500 dark:text-gray-400">
                                {selectedCourse.title?.substring(0, 1).toUpperCase() || 'M'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                          {selectedCourse.title}
                        </h2>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="selection-pill">
                            {selectedCourse.category || 'Course'}
                          </span>
                          {selectedCourse.is_trending && (
                            <span className="selection-pill flex items-center">
                              <span className="relative flex h-2 w-2 mr-1">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                              </span>
                              Trending
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                          {selectedCourse.description || 'No description available for this course.'}
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                          <div className="flex items-center">
                            <Clock className="h-5 w-5 text-emerald-500 mr-2" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Duration</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {formatDuration(selectedCourse.course_duration_days)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-emerald-500 mr-2" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Start Date</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Flexible
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Award className="h-5 w-5 text-emerald-500 mr-2" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Certificate</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {selectedCourse.is_Certification ? 'Included' : 'Not included'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Users className="h-5 w-5 text-emerald-500 mr-2" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Enrolled</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {selectedCourse.enrolled_students || 0} students
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Star className="h-5 w-5 text-emerald-500 mr-2" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Rating</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                4.0/5.0 (120 reviews)
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <CreditCard className="h-5 w-5 text-emerald-500 mr-2" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Price</p>
                              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                {formatPrice(selectedCourse.course_fee)}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                          <button
                            onClick={handleEnroll}
                            className="apple-button"
                          >
                            Enroll Now
                          </button>
                          
                          <button
                            onClick={() => router.push(`/course-details/${selectedCourse._id}`)}
                            className="apple-button secondary"
                          >
                            View Course Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.section>
              )}

              {/* Category Navigation Section (New) */}
              <section className="mb-16 max-w-7xl mx-auto px-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Browse by Category
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Explore our courses organized by specialized categories
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Vedic Mathematics */}
                    <Link href="/enrollment?category=vedic-mathematics" className="group">
                      <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors hover:shadow-md">
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                          <Calculator className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          Vedic Mathematics
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Ancient calculation techniques
                        </p>
                      </div>
                    </Link>
                    
                    {/* AI & Data Science */}
                    <Link href="/enrollment?category=ai-and-data-science" className="group">
                      <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-violet-500 dark:hover:border-violet-500 transition-colors hover:shadow-md">
                        <div className="bg-violet-50 dark:bg-violet-900/20 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                          <BrainCircuit className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                          AI & Data Science
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Modern tech skills
                        </p>
                      </div>
                    </Link>
                    
                    {/* Digital Marketing */}
                    <Link href="/enrollment?category=digital-marketing" className="group">
                      <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-500 transition-colors hover:shadow-md">
                        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                          <TrendingUp className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          Digital Marketing
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Online growth strategies
                        </p>
                      </div>
                    </Link>
                    
                    {/* Personality Development */}
                    <Link href="/enrollment?category=personality-development" className="group">
                      <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-pink-500 dark:hover:border-pink-500 transition-colors hover:shadow-md">
                        <div className="bg-pink-50 dark:bg-pink-900/20 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                          <UserCheck className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                          Personality Development
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Communication & soft skills
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              </section>
            </div>
          )}
        </main>

        {/* Theme Controller - Now positioned in bottom right */}
        <div className="fixed bottom-4 right-4 z-50">
          <ThemeController />
        </div>

        {/* Bottom Gradient Line */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
      </div>
    </PageWrapper>
  );
}

export default EnrollmentPage; 