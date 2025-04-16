"use client";
import { Suspense, useState, useEffect, useMemo, useCallback } from 'react';
import CoursesFilter from "@/components/sections/courses/CoursesFilter";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import { motion } from "framer-motion";
import React from 'react';
import {
  BookOpen,
  Users,
  Star,
  ChevronRight,
  Sparkles,
  Clock,
  Award,
  ArrowRight,
  Filter,
  Calendar,
  Layers,
  Laptop,
  Video,
  Search,
  X
} from 'lucide-react';

// Constants for cache management
const COURSES_CACHE_KEY = 'medh_courses_state';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

// Helper function to handle cache with error boundaries
const cacheManager = {
  set: (data) => {
    try {
      const cacheData = {
        timestamp: Date.now(),
        data: data
      };
      sessionStorage.setItem(COURSES_CACHE_KEY, JSON.stringify(cacheData));
      return true;
    } catch (error) {
      console.error('Cache write failed:', error);
      return false;
    }
  },
  get: () => {
    try {
      const cache = sessionStorage.getItem(COURSES_CACHE_KEY);
      if (!cache) return null;

      const { timestamp, data } = JSON.parse(cache);
      if (!timestamp || !data) return null;

      const isExpired = Date.now() - timestamp > CACHE_DURATION;
      return isExpired ? null : data;
    } catch (error) {
      console.error('Cache read failed:', error);
      return null;
    }
  },
  clear: () => {
    try {
      sessionStorage.removeItem(COURSES_CACHE_KEY);
      return true;
    } catch (error) {
      console.error('Cache clear failed:', error);
      return false;
    }
  }
};

const Courses = () => {
  // Try to load state from cache on init
  const cachedState = typeof window !== 'undefined' ? cacheManager.get() : null;
  
  const [activeTab, setActiveTab] = useState(cachedState?.activeTab || "all"); // "all", "live", or "blended"
  const [isVisible, setIsVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true once component mounts on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update cache when state changes
  useEffect(() => {
    const stateToCache = {
      activeTab
    };
    
    cacheManager.set(stateToCache);
  }, [activeTab]);

  // Animation variants - memoized to prevent unnecessary recreations
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  }), []);

  // Stats data - memoized to prevent unnecessary recreations
  const stats = useMemo(() => [
    {
      icon: <BookOpen className="w-6 h-6 text-primary-400 dark:text-primary-300" />,
      value: "20+",
      label: "All Courses"
    },
    {
      icon: <Users className="w-6 h-6 text-primary-400 dark:text-primary-300" />,
      value: "1000+",
      label: "Active Learners"
    },
    {
      icon: <Star className="w-6 h-6 text-primary-400 dark:text-primary-300" />,
      value: "4.9/5",
      label: "Average Rating"
    }
  ], []);

  // Features data - memoized to prevent unnecessary recreations
  const features = useMemo(() => [
    {
      icon: <Sparkles className="w-6 h-6 text-primary-400 dark:text-primary-300" />,
      title: "Expert-Led Training",
      description: "Learn from industry experts with proven expertise"
    },
    {
      icon: <Clock className="w-6 h-6 text-primary-400 dark:text-primary-300" />,
      title: "Flexible Learning",
      description: "Study at your own pace with lifetime access to course content"
    },
    {
      icon: <Award className="w-6 h-6 text-primary-400 dark:text-primary-300" />,
      title: "Industry Recognition",
      description: "Earn certificates valued by top employers globally"
    }
  ], []);

  // Set active tab with memoized callback
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Add these helper functions for course display - memoized to prevent recreations
  const getBlendedCourseSessions = useCallback((course) => {
    const defaultVideoCount = course.lectures_count || 20;
    // We'll always use 2 for QnA sessions as per requirement
    return {
      videoCount: defaultVideoCount,
      qnaSessions: 2
    };
  }, []);

  // Format course duration to display as "4 Months (16 Weeks)" when both are provided
  const formatCourseDuration = useCallback((duration) => {
    if (!duration) return "4-8 weeks";
    
    // Check if duration contains both months and weeks
    const monthsMatch = duration.match(/(\d+)\s*months?/i);
    const weeksMatch = duration.match(/(\d+)\s*weeks?/i);
    
    if (monthsMatch && weeksMatch) {
      return `${monthsMatch[1]} Months (${weeksMatch[1]} Weeks)`;
    } else if (weeksMatch) {
      return `${weeksMatch[1]} Weeks`;
    } else if (monthsMatch) {
      return `${monthsMatch[1]} Months`;
    }
    
    return duration;
  }, []);

  // Memoize renderCourse functions for different tabs to avoid recreating on every render
  const renderAllCourse = useCallback((course) => {
    // Determine the class_type dynamically from course data
    const courseType = (course.class_type || '').toLowerCase();
    
    // More robust detection of course types
    const isLive = courseType.includes('live') || 
                  (course.format && course.format.toLowerCase().includes('live'));
                  
    const isBlended = courseType.includes('blend') || 
                    courseType.includes('hybrid') || 
                    (course.format && (
                      course.format.toLowerCase().includes('blend') || 
                      course.format.toLowerCase().includes('hybrid')
                    )) ||
                    (course.lectures_count && course.live_sessions);
    
    // Define type-specific properties
    let typedProps = {};
    
    if (isLive) {
      // Live course specific properties
      typedProps = {
        course_duration: (
          <div className="flex items-center text-sm">
            <Clock className="w-4 h-4 mr-1 text-rose-500" />
            <span>{formatCourseDuration(course.course_duration)}</span>
          </div>
        ),
        no_of_Sessions: course.no_of_Sessions || 24,
        effort_hours: course.effort_hours || "6-8",
        highlights: [
          "Live interactive sessions",
          "Real-world projects",
          ...(course.highlights || [])
        ]
      };
    } else if (isBlended) {
      // Blended course specific properties
      const { videoCount, qnaSessions } = getBlendedCourseSessions(course);
      
      typedProps = {
        course_duration: (
          <div className="flex items-center text-sm">
            <Clock className="w-4 h-4 mr-1 text-rose-500" />
            <span>{formatCourseDuration(course.course_duration || course.duration)}</span>
          </div>
        ),
        duration_range: `${videoCount} Videos • ${qnaSessions} Q&A • ${course.duration_range || "Self-paced"}`,
        no_of_Sessions: course.no_of_Sessions || videoCount,
        effort_hours: course.effort_hours || "3-5",
        highlights: [
          "Self-paced learning",
          "Interactive content",
          ...(course.highlights || [])
        ]
      };
    } else {
      // Default course properties
      typedProps = {
        course_duration: (
          <div className="flex items-center text-sm">
            <Clock className="w-4 h-4 mr-1 text-gray-500" />
            <span>{formatCourseDuration(course.course_duration)}</span>
          </div>
        ),
        effort_hours: course.effort_hours || "4-6",
        no_of_Sessions: course.no_of_Sessions || 24
      };
    }
    
    return {
      ...course,
      ...typedProps,
      instructor: course.instructor || null,
      // Ensure proper class_type is set based on our detection
      class_type: isLive ? 'live' : (isBlended ? 'blended' : course.class_type || ''),
      courseType: isLive ? 'live' : (isBlended ? 'blended' : 'default'), // Additional indicator
      cardStyle: isLive ? 'live' : (isBlended ? 'blended' : 'default'), // Visual style indicator
      isLiveCourse: isLive,
      isBlendedCourse: isBlended,
      highlights: typedProps.highlights || course.highlights || []
    };
  }, [formatCourseDuration, getBlendedCourseSessions]);
  
  const renderLiveCourse = useCallback((course) => ({
    ...course,
    class_type: "live", // Always enforce live class type in this tab
    courseType: 'live',
    cardStyle: 'live',
    isLiveCourse: true,
    isBlendedCourse: false,
    course_duration: (
      <div className="flex items-center text-sm">
        <Clock className="w-4 h-4 mr-1 text-rose-500" />
        <span>{formatCourseDuration(course.course_duration)}</span>
      </div>
    ),
    effort_hours: course.effort_hours || "6-8",
    no_of_Sessions: course.no_of_Sessions || 24,
    instructor: course.instructor || null,
    highlights: [
      "Live interactive sessions",
      "Real-world projects",
      ...(course.highlights || [])
    ]
  }), [formatCourseDuration]);
  
  const renderBlendedCourse = useCallback((course) => {
    const { videoCount } = getBlendedCourseSessions(course);
    return {
      ...course,
      class_type: "blended", // Always enforce blended class type in this tab
      courseType: 'blended',
      cardStyle: 'blended',
      isLiveCourse: false,
      isBlendedCourse: true,
      course_duration: (
        <div className="flex items-center text-sm">
          <Clock className="w-4 h-4 mr-1 text-rose-500" />
          <span>{formatCourseDuration(course.course_duration || course.duration)}</span>
        </div>
      ),
      duration_range: `${videoCount} Videos • 2 Q&A • ${course.duration_range || "Self-paced"}`,
      no_of_Sessions: course.no_of_Sessions || videoCount,
      effort_hours: course.effort_hours || "3-5",
      highlights: [
        "Self-paced learning",
        "Interactive content",
        ...(course.highlights || [])
      ]
    };
  }, [getBlendedCourseSessions, formatCourseDuration]);

  // Memoized preloader component
  const CoursePreloader = useMemo(() => {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-primary-200 dark:border-primary-800/30 border-t-primary-600 dark:border-t-primary-500 animate-spin"></div>
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-transparent border-t-primary-300 dark:border-t-primary-400 animate-spin" style={{ animationDuration: '2s' }}></div>
        </div>
      </div>
    );
  }, []);

  return (
    <PageWrapper>
      <main className="bg-gradient-to-b from-gray-50/80 via-white to-gray-50/80 dark:from-gray-900 dark:via-gray-850 dark:to-gray-900 transition-colors duration-300">
        {/* Course Header & Tabs Section */}
        <section className="relative w-full py-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary-100/30 dark:bg-primary-900/20 blur-3xl transform rotate-12"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-rose-100/30 dark:bg-rose-900/20 blur-3xl"></div>
          </div>

          <div className="container relative mx-auto px-4">
            <div className="flex flex-col items-center justify-center max-w-4xl mx-auto pt-10">

              {/* Course Type Switcher - Only render on client to avoid hydration issues */}
              {isClient && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="inline-flex p-1.5 bg-gray-100/80 dark:bg-gray-800/90 rounded-2xl shadow-sm border border-transparent dark:border-gray-700 backdrop-blur-sm transition-colors duration-300"
                >
                  <button 
                    onClick={() => handleTabChange("all")}
                    className={`px-6 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                      activeTab === "all" 
                        ? "bg-primary-600 text-white dark:bg-primary-700 dark:text-white shadow-sm" 
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    All Courses
                  </button>
                  <button 
                    onClick={() => handleTabChange("live")}
                    className={`px-6 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                      activeTab === "live" 
                        ? "bg-rose-600 text-white dark:bg-rose-700 dark:text-white shadow-sm" 
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    Live Courses
                  </button>
                  <button 
                    onClick={() => handleTabChange("blended")}
                    className={`px-6 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                      activeTab === "blended" 
                        ? "bg-indigo-600 text-white dark:bg-indigo-700 dark:text-white shadow-sm" 
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    Blended Courses
                  </button>
                </motion.div>
              )}
              
              {/* Placeholder for SSR to maintain layout */}
              {!isClient && (
                <div className="inline-flex p-1.5 bg-gray-100/80 dark:bg-gray-800/90 rounded-2xl shadow-sm border border-transparent dark:border-gray-700 backdrop-blur-sm transition-colors duration-300">
                  <div className="px-6 py-2.5 text-sm font-medium rounded-xl bg-primary-600 text-white dark:bg-primary-700 dark:text-white shadow-sm">
                    All Courses
                  </div>
                  <div className="px-6 py-2.5 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-300">
                    Live Courses
                  </div>
                  <div className="px-6 py-2.5 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-300">
                    Blended Courses
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Courses Section */}
        <section id="courses-section" className="w-full py-12 bg-gray-50/80 dark:bg-gray-900/80 transition-colors duration-300">
          <div className="w-full">
            <Suspense fallback={CoursePreloader}>
              {isClient && activeTab === "all" && (
                <CoursesFilter 
                  CustomText="EXPLORE LEARNING PATHS CONFIDENTLY"
                  hideSearch={false}
                  description="Comprehensive Skill Development Courses Tailored for Diverse Professional Aspirations"
                  renderCourse={renderAllCourse}
                />
              )}
              
              {isClient && activeTab === "live" && (
                <CoursesFilter 
                  CustomText="Live Interactive Courses"
                  hideSearch={false}
                  CustomButton={
                    <div className="inline-flex items-center px-6 py-3 bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600 text-white text-sm font-medium rounded-xl transition-colors shadow-sm hover:shadow-md">
                      <Calendar className="w-4 h-4 mr-2" />
                      See Schedule
                    </div>
                  }
                  classType="live"
                  description="Join interactive sessions with industry experts for real-time learning and direct feedback."
                  renderCourse={renderLiveCourse}
                />
              )}
              
              {isClient && activeTab === "blended" && (
                <CoursesFilter 
                  CustomText="Blended Learning Courses"
                  hideSearch={false}
                  hideGradeFilter={true}
                  CustomButton={
                    <div className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white text-sm font-medium rounded-xl transition-colors shadow-sm hover:shadow-md">
                      <Laptop className="w-4 h-4 mr-2" />
                      Explore Learning Paths
                    </div>
                  }
                  classType="blended"
                  description="Flexible self-paced learning with interactive content and practical assignments."
                  renderCourse={renderBlendedCourse}
                />
              )}
              
              {/* Show a loading state when not on client yet */}
              {!isClient && (
                <div className="flex justify-center items-center py-12">
                  <div className="relative w-16 h-16">
                    <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-primary-200 dark:border-primary-800/30 border-t-primary-600 dark:border-t-primary-500 animate-spin"></div>
                    <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-transparent border-t-primary-300 dark:border-t-primary-400 animate-spin" style={{ animationDuration: '2s' }}></div>
                  </div>
                </div>
              )}
            </Suspense>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg mr-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease forwards;
        }
      `}</style>
    </PageWrapper>
  );
};

export default React.memo(Courses);
