"use client";

import React, { Suspense, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import CoursesFilter from "@/components/sections/courses/CoursesFilter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Globe,
  Award,
  BookOpen,
  Users,
  Clock,
  Star,
  TrendingUp,
  Zap,
  Search,
  Filter,
  ArrowRight,
  Play,
  CheckCircle,
  Sparkles,
  BarChart3,
  Calendar,
  Trophy,
  Lightbulb,
  Rocket,
  Heart,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Pause
} from 'lucide-react';

/**
 * AllCoursesMain - Enhanced component that displays all courses with optimized carousel
 */
const AllCoursesMain: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Refs for better performance
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const slideTransitionRef = useRef<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Animation variants - Optimized for performance with reduced complexity
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.08
      }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 0.6
      }
    }
  }), []);

  const cardVariants = useMemo(() => ({
    hidden: { scale: 0.98, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20,
        mass: 0.5
      }
    }
  }), []);

  // Content animation variants with reduced complexity
  const contentVariants = useMemo(() => ({
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.98
    },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 18,
        delay: delay * 0.08,
        duration: 0.5
      }
    }),
    exit: {
      opacity: 0,
      y: -15,
      scale: 0.99,
      transition: {
        duration: 0.25,
        ease: "easeInOut"
      }
    }
  }), []);

  // Carousel slides with popular courses
  const carouselSlides = useMemo(() => [
    {
      id: 1,
      title: "Unlock Your Full",
      highlight: "Learning Potential",
      description: "Join 50,000+ learners mastering in-demand skills with expert instructors. Get hands-on projects and guaranteed job assistance.",
      badge: "Transform Your Career Today",
      color: "from-blue-500 to-indigo-600",
      image: "/courses/python-course.jpg",
      courses: [
        {
          title: "AI & Machine Learning Mastery",
          price: "₹12,999",
          duration: "6 Months Intensive Program"
        },
        {
          title: "Full Stack Web Development",
          price: "₹15,999",
          duration: "8 Months Complete Bootcamp"
        }
      ]
    },
    {
      id: 2,
      title: "Master Future-Ready",
      highlight: "Digital Skills",
      description: "Learn from industry veterans and build skills that matter in today's rapidly evolving digital economy. Get certified in high-demand technologies with personalized mentorship and career guidance.",
      badge: "Industry-Ready Training",
      color: "from-purple-500 to-pink-600",
      image: "/courses/web-dev.jpg",
      courses: [
        {
          title: "Digital Marketing & Analytics Pro",
          price: "₹9,999",
          duration: "4 Months Comprehensive Course"
        },
        {
          title: "Data Science & Analytics Bootcamp",
          price: "₹18,999",
          duration: "10 Months Expert Program"
        }
      ]
    },
    {
      id: 3,
      title: "Build Your",
      highlight: "Professional Network",
      description: "Connect with industry professionals, mentors, and peers. Access exclusive networking events, career workshops, and job placement assistance to accelerate your professional growth.",
      badge: "Career Acceleration Program",
      color: "from-emerald-500 to-teal-600",
      image: "/courses/data-science.jpg",
      courses: [
        {
          title: "Business Leadership & Management",
          price: "₹11,999",
          duration: "5 Months Leadership Track"
        },
        {
          title: "Project Management Professional",
          price: "₹13,999",
          duration: "6 Months Certification Program"
        }
      ]
    }
  ], []);

  // Optimized navigation functions with debouncing
  const nextSlide = useCallback(() => {
    if (slideTransitionRef.current) return;
    slideTransitionRef.current = true;
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    setTimeout(() => {
      slideTransitionRef.current = false;
    }, 300);
  }, [carouselSlides.length]);

  const prevSlide = useCallback(() => {
    if (slideTransitionRef.current) return;
    slideTransitionRef.current = true;
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
    setTimeout(() => {
      slideTransitionRef.current = false;
    }, 300);
  }, [carouselSlides.length]);

  const goToSlide = useCallback((index: number) => {
    if (slideTransitionRef.current || index === currentSlide) return;
    slideTransitionRef.current = true;
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
    setTimeout(() => {
      slideTransitionRef.current = false;
    }, 300);
  }, [currentSlide]);

  // Auto-play functionality - pauses when filter dropdown is open
  useEffect(() => {
    if (!isAutoPlaying || isHovered || isFilterDropdownOpen) {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
      return;
    }

    autoPlayRef.current = setInterval(() => {
      nextSlide();
    }, 5000); // 5 seconds interval

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    };
  }, [isAutoPlaying, isHovered, isFilterDropdownOpen, nextSlide]);

  // Keyboard navigation (with auto-play toggle)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        prevSlide();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        nextSlide();
      } else if (event.key === ' ') {
        event.preventDefault();
        setIsAutoPlaying(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Toggle auto-play
  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying(prev => !prev);
  }, []);

  // Handle filter dropdown state changes
  const handleFilterDropdownToggle = useCallback((isOpen: boolean) => {
    setIsFilterDropdownOpen(isOpen);
  }, []);

  // Touch/Swipe functionality
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  }, [touchStart, touchEnd, nextSlide, prevSlide]);

  // Course Preloader with enhanced design
  const CoursePreloader = () => (
    <div className="space-y-8">
      {/* Hero Skeleton */}
      <div className="bg-gray-200 dark:bg-gray-800 rounded-3xl h-80 animate-pulse"></div>
      
      {/* Search Skeleton */}
      <div className="bg-gray-200 dark:bg-gray-800 rounded-2xl h-24 animate-pulse"></div>
      
      {/* Features Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-gray-200 dark:bg-gray-800 rounded-2xl h-48 animate-pulse"></div>
        ))}
        </div>
      
      {/* Course Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-gray-200 dark:bg-gray-800 rounded-2xl h-80 animate-pulse"></div>
        ))}
      </div>
    </div>
  );

  if (!isClient) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <CoursePreloader />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full mx-auto px-2 sm:px-4 lg:px-6 py-8 space-y-8"
      >
        {/* Hero Carousel Section - Ultra Wide with Optimizations */}
        <motion.div
          ref={carouselRef}
          variants={itemVariants}
          className="relative overflow-hidden rounded-3xl h-[300px] md:h-[320px] mb-12 mx-auto w-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          role="region"
          aria-label="Course carousel"
          aria-live="polite"
          tabIndex={0}
        >
          {/* Carousel Container with Hardware Acceleration */}
          <div className="relative h-full overflow-hidden">
            <div 
              className="flex transition-transform duration-700 ease-in-out h-full" 
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {carouselSlides.map((slide, index) => (
                <div 
                  key={slide.id}
                  className={`relative w-full flex-shrink-0 bg-gradient-to-br ${slide.color} overflow-hidden h-full transition-all duration-300`}
                >
                  {/* Course background image with overlay */}
                  <div className="absolute inset-0 bg-black/40 mix-blend-multiply"></div>
                  <div className="absolute inset-0">
                    {/* Background */}
                    <div 
                      className="w-full h-full bg-center bg-cover bg-no-repeat opacity-30"
                      style={{ 
                        backgroundImage: `url('${slide.image || '/backgrounds/course-placeholder.jpg'}')`,
                      }}
                    ></div>
                    <div className="w-full h-full bg-[url('/backgrounds/grid-pattern.svg')] opacity-10 absolute inset-0"></div>
                  </div>
                  
                  <div className="relative z-10 w-full h-full flex items-center transition-all duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 px-12 md:px-16 lg:px-20 w-full max-w-[1600px] mx-auto">
                      {/* Left side - Course information */}
                      <div className="md:col-span-7 flex flex-col justify-center pr-4">
                        <div className="flex flex-wrap items-center mb-2">
                          <motion.div
                            variants={contentVariants}
                            custom={0}
                            className="inline-flex items-center px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-xs font-medium mb-3 text-white"
                          >
                            <Sparkles className="w-3 h-3 mr-1.5" />
                            {slide.badge}
                          </motion.div>
                        </div>

                        <motion.h1
                          variants={contentVariants}
                          custom={1}
                          className="text-xl lg:text-2xl xl:text-3xl font-bold mb-4 leading-tight text-white max-w-[90%]"
                        >
                          {slide.title}{" "}
                          <span className="block bg-gradient-to-r from-amber-300 to-rose-300 bg-clip-text text-transparent">
                            {slide.highlight}
                          </span>
                        </motion.h1>

                        <motion.p
                          variants={contentVariants}
                          custom={2}
                          className="text-xs lg:text-sm xl:text-base text-purple-100 mb-6 leading-relaxed max-w-[90%]"
                        >
                          {slide.description}
                        </motion.p>

                        <motion.div
                          variants={contentVariants}
                          custom={3}
                          className="flex flex-col sm:flex-row gap-3"
                        >
                          <motion.button 
                            className="px-5 py-2.5 bg-white text-indigo-700 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center text-xs"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Play className="w-3.5 h-3.5 mr-1.5" />
                            Start Learning
                          </motion.button>
                          <motion.button 
                            className="px-5 py-2.5 border-2 border-white/40 text-white rounded-xl font-semibold hover:bg-white/15 transition-all duration-300 flex items-center justify-center text-xs"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Calendar className="w-3.5 h-3.5 mr-1.5" />
                            Browse Courses
                          </motion.button>
                        </motion.div>
                      </div>

                      {/* Right side - Featured Courses */}
                      <div className="md:col-span-5 hidden md:flex flex-col justify-center space-y-3">
                        {slide.courses.map((course, courseIndex) => (
                          <motion.div
                            key={course.title}
                            variants={contentVariants}
                            custom={4 + courseIndex}
                            className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-white hover:bg-white/25 transition-all duration-300 cursor-pointer"
                            whileHover={{ 
                              scale: 1.05, 
                              y: -5,
                              transition: { type: "spring", stiffness: 300, damping: 20 }
                            }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-start justify-between mb-1.5">
                              <div className="flex-1">
                                <div className="text-xs text-purple-200 font-medium">{course.duration}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-base font-bold text-white">{course.price}</div>
                              </div>
                            </div>
                            <h3 className="text-base font-bold line-clamp-2 text-white leading-tight">{course.title}</h3>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Navigation Controls */}
          <motion.div 
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            {/* Dots Indicator */}
            <div className="flex space-x-1.5">
              {carouselSlides.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-white scale-110' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>

          {/* Enhanced Navigation Arrows */}
          <motion.button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 cursor-pointer z-20 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
            whileHover={{ 
              scale: 1.1, 
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              transition: { type: "spring", stiffness: 300, damping: 20 }
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 cursor-pointer z-20 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
            whileHover={{ 
              scale: 1.1, 
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              transition: { type: "spring", stiffness: 300, damping: 20 }
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>

          {/* Accessibility Instructions */}
          <div className="sr-only" aria-live="polite">
            Slide {currentSlide + 1} of {carouselSlides.length}. Use arrow keys to navigate.
          </div>
        </motion.div>

        {/* Section Title */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-8"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            All Courses
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need to level up your skills
          </p>
        </motion.div>

        {/* Main Courses Section */}
        <motion.div variants={itemVariants}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Courses Filter Section */}
            <div className="p-6 lg:p-8">
              <Suspense fallback={<CoursePreloader />}>
                <CoursesFilter 
                  hideHeader={true}
                  gridColumns={3}
                  itemsPerPage={12}
                  customGridClassName="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  onFilterDropdownToggle={handleFilterDropdownToggle}
                />
              </Suspense>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AllCoursesMain; 