'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, Calendar, Users, Award, CreditCard, Star, BookOpen, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';

// Core components
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import ThemeController from "@/components/shared/others/ThemeController";
import Preloader from "@/components/shared/others/Preloader";
import VedicBanner from "@/components/sections/vedic-mathematics/vedicBanner";
import VedicOverview from "@/components/sections/vedic-mathematics/vedicOverview";
import VedicFaq from "@/components/sections/vedic-mathematics/vedicFaq";

// API and utilities
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";

// Import custom styles
import './styles.css';

// Animations
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

// Duration options based on actual course offerings
const DURATION_OPTIONS = [
  { id: 'short', name: '3 Months (12 weeks)', label: 'Quick Learning', description: 'Perfect for beginners looking to quickly grasp core Vedic Mathematics concepts' },
  { id: 'medium', name: '6 Months (24 weeks)', label: 'Comprehensive', description: 'Deeper understanding with extensive practice and application' },
  { id: 'long', name: '9 Months (36 weeks)', label: 'Complete Mastery', description: 'Master all aspects of Vedic Mathematics with advanced techniques' }
];

// Grade options
const GRADE_OPTIONS = [
  { id: 'grade5-6', label: 'Grade 5-6', description: 'Fundamental concepts tailored for younger students' },
  { id: 'grade7-8', label: 'Grade 7-8', description: 'Advanced concepts for middle school students' }
];

// Utility functions
const formatDuration = (duration) => {
  if (!duration) return 'Self-paced';
  return duration;
};

const formatPrice = (price) => {
  if (!price) return 'Free';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

// Helper to extract weeks and months from duration string
const parseDuration = (durationString) => {
  if (!durationString) return { months: 0, weeks: 0 };
  
  const monthsMatch = durationString.match(/(\d+)\s*months?/i);
  const weeksMatch = durationString.match(/(\d+)\s*weeks?/i);
  
  return {
    months: monthsMatch ? parseInt(monthsMatch[1]) : 0,
    weeks: weeksMatch ? parseInt(weeksMatch[1]) : 0
  };
};

// Duration filter function
const getDurationFilter = (selectedDuration) => {
  switch (selectedDuration) {
    case 'short':
      return (course) => {
        const { months } = parseDuration(course.course_duration);
        return months <= 3;
      };
    case 'medium':
      return (course) => {
        const { months } = parseDuration(course.course_duration);
        return months > 3 && months <= 6;
      };
    case 'long':
      return (course) => {
        const { months } = parseDuration(course.course_duration);
        return months > 6;
      };
    default:
      return () => true; // Show all
  }
};

// Grade filter function
const getGradeFilter = (selectedGrade) => {
  if (!selectedGrade || selectedGrade === 'all') return () => true;
  
  return (course) => {
    return course.course_grade?.includes(selectedGrade.replace('grade', 'Grade '));
  };
};

function VedicMathematics() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState('medium');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  const { getQuery } = useGetQuery();
  const router = useRouter();

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        getQuery({
          url: apiUrls.courses.getAllCoursesWithLimits(1, 100, "Vedic Mathematics", "", "", "Published"),
          onSuccess: (response) => {
            console.log('Vedic Mathematics courses:', response);
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
            setError(err?.message || 'Failed to load courses');
            setLoading(false);
          }
        });
      } catch (err) {
        console.error("Unexpected error in fetchCourses:", err);
        setError(err?.message || 'An unexpected error occurred');
        setLoading(false);
      }
    };

    fetchCourses();
  }, [getQuery]);

  // Filter courses when duration or grade changes
  useEffect(() => {
    if (!courses.length) return;
    
    // Get the appropriate filter functions
    const durationFilter = getDurationFilter(selectedDuration);
    const gradeFilter = getGradeFilter(selectedGrade);
    
    // Apply both filters
    const filtered = courses.filter(course => {
      return durationFilter(course) && gradeFilter(course);
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
  }, [selectedDuration, selectedGrade, courses, selectedCourse]);

  // Handle duration selection
  const handleDurationChange = (durationId) => {
    setSelectedDuration(durationId);
  };

  // Handle grade selection
  const handleGradeChange = (gradeId) => {
    setSelectedGrade(gradeId);
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
    
    // Redirect to enrollment page
    router.push('/enrollment/vedic-mathematics');
  };

  // Handle view details
  const handleViewDetails = () => {
    if (selectedCourse) {
      router.push(`/enrollment/vedic-mathematics/details`);
    }
  };

  // Handle section navigation
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-8 p-4 max-w-7xl mx-auto">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        ))}
      </div>
      <div className="flex justify-center my-10">
        <div className="vedic-loader">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );

  // Error component
  const ErrorDisplay = () => (
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
  );

  // Navigation items
  const navigationItems = [
    { key: 'overview', label: 'Course Overview', icon: BookOpen },
    { key: 'curriculum', label: 'Curriculum', icon: Calendar },
    { key: 'faq', label: 'FAQs', icon: ChevronDown }
  ];

  return (
    <PageWrapper>
      <div className="relative min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 vedic-page">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 transform-gpu">
          <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Vedic Mathematics
              </h1>
              <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-full">
                Courses
              </span>
            </div>
            
            {/* Navigation Tabs */}
            <div className="hidden md:flex items-center space-x-2">
              {navigationItems.map(({ key, label, icon: Icon }) => (
                <button 
                  key={key}
                  onClick={() => handleSectionChange(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === key 
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className="w-4 h-4 mr-1.5" />
                    {label}
                  </div>
                </button>
              ))}
            </div>
          </nav>
        </header>

        {/* Content with Header Offset */}
        <main className="flex-grow pt-24">
          <Toaster position="bottom-center" />
          
          {/* Course Banner */}
          <VedicBanner />
          
          {/* Course Overview */}
          <VedicOverview />
          
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorDisplay />
          ) : (
            <>
              {/* Duration Selection */}
              <motion.section 
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeIn}
                className="mb-12 max-w-7xl mx-auto px-4 sm:px-6 py-8"
              >
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
                  Choose Your Learning Duration
                </h2>
                <p className="text-lg text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
                  Select a duration that fits your schedule and learning goals. Our Vedic Mathematics courses are designed to provide quality education for various time commitments.
                </p>
                
                <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700">
                    {DURATION_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleDurationChange(option.id)}
                        className={`duration-card ${selectedDuration === option.id ? 'selected' : ''}`}
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
              
              {/* Grade Level Selection */}
              <motion.section 
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeIn}
                className="mb-12 max-w-7xl mx-auto px-4 sm:px-6"
              >
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
                  <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    Grade Level:
                  </span>
                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => handleGradeChange('all')}
                      className={`selection-pill ${selectedGrade === 'all' ? 'active' : ''}`}
                    >
                      All Grades
                    </button>
                    {GRADE_OPTIONS.map((grade) => (
                      <button
                        key={grade.id}
                        onClick={() => handleGradeChange(grade.id)}
                        className={`selection-pill ${selectedGrade === grade.id ? 'active' : ''}`}
                      >
                        {grade.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.section>

              {/* Course Cards */}
              <motion.section 
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="mb-12 max-w-7xl mx-auto px-4 sm:px-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Available Vedic Mathematics Courses
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {filteredCourses.length > 0 
                    ? `Found ${filteredCourses.length} courses matching your preferences` 
                    : 'No courses found matching your selection. Try different duration or grade options.'}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence mode="wait">
                    {filteredCourses.map((course) => (
                      <motion.div
                        key={course._id}
                        variants={fadeIn}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        onClick={() => handleCourseSelection(course)}
                        className={`cursor-pointer rounded-xl overflow-hidden border-2 course-card ${
                          selectedCourse?._id === course._id 
                            ? 'selected' 
                            : ''
                        }`}
                      >
                        <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700">
                          {course.course_image ? (
                            <Image
                              src={course.course_image}
                              alt={course.course_title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-emerald-500/20 to-blue-500/20">
                              <span className="text-xl font-bold text-gray-500 dark:text-gray-400">
                                {course.course_title?.substring(0, 1).toUpperCase() || 'M'}
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
                              {course.course_grade || 'All Grades'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                            {course.course_title}
                          </h3>
                          
                          <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <Clock className="h-4 w-4 mr-1.5 text-gray-500 dark:text-gray-400" />
                            <span>{formatDuration(course.course_duration)}</span>
                          </div>
                          
                          <div className="mt-1 flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <Users className="h-4 w-4 mr-1.5 text-gray-500 dark:text-gray-400" />
                            <span>{course.no_of_Sessions || 0} sessions</span>
                          </div>
                          
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center">
                              {course.is_Certification === "Yes" && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                                  <Award className="w-3 h-3 mr-1" />
                                  Certification
                                </span>
                              )}
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
                  className="max-w-5xl mx-auto px-4 sm:px-6 mb-16"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 course-card">
                    <div className="md:flex">
                      <div className="md:flex-shrink-0 md:w-1/3">
                        <div className="relative h-64 w-full image-gallery">
                          {selectedCourse.course_image ? (
                            <Image
                              src={selectedCourse.course_image}
                              alt={selectedCourse.course_title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 320px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-emerald-500/20 to-blue-500/20">
                              <span className="text-6xl font-bold text-gray-500 dark:text-gray-400">
                                {selectedCourse.course_title?.substring(0, 1).toUpperCase() || 'M'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="p-6 md:p-8 md:w-2/3">
                        <div className="flex items-center">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {selectedCourse.course_title}
                          </h2>
                          <span className="ml-3 px-2.5 py-0.5 text-xs font-medium badge badge-primary">
                            {selectedCourse.course_grade || 'All Grades'}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                          {selectedCourse.course_description || 'Vedic Mathematics is an ancient system of mathematics that originated in India. It consists of 16 sutras (formulae) and 13 sub-sutras (sub-formulae) that can be used for solving complex mathematical problems in an easy and faster way.'}
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                          <div className="flex items-center">
                            <Clock className="h-5 w-5 text-emerald-500 mr-2" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Duration</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {formatDuration(selectedCourse.course_duration)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-emerald-500 mr-2" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Sessions</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {selectedCourse.no_of_Sessions || 'Flexible'} sessions
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Award className="h-5 w-5 text-emerald-500 mr-2" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Certificate</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {selectedCourse.is_Certification === "Yes" ? 'Included' : 'Not included'}
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
                        
                        {/* Course curriculum preview */}
                        {selectedCourse.curriculum && selectedCourse.curriculum.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                              Course Curriculum Highlights
                            </h3>
                            <div className="space-y-2 curriculum-list">
                              {selectedCourse.curriculum.slice(0, 3).map((item, index) => (
                                <div key={item._id || index} className="curriculum-item">
                                  <h4 className="font-medium text-gray-900 dark:text-white">
                                    {item.weekTitle}
                                  </h4>
                                </div>
                              ))}
                              {selectedCourse.curriculum.length > 3 && (
                                <div className="text-sm text-center text-emerald-600 dark:text-emerald-400 py-2">
                                  +{selectedCourse.curriculum.length - 3} more weeks
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                          <button
                            onClick={handleEnroll}
                            className="vedic-button"
                          >
                            Enroll Now
                          </button>
                          
                          <button
                            onClick={handleViewDetails}
                            className="vedic-button secondary"
                          >
                            View Full Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.section>
              )}
            </>
          )}
          
          {/* FAQs Section */}
          <VedicFaq />
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

export default VedicMathematics;
