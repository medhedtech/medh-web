"use client"
import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import dynamic from 'next/dynamic';
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import Preloader from "@/components/shared/others/Preloader";
import { motion, AnimatePresence } from "framer-motion";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import { RefreshCw, ArrowLeft, BookOpen, Award, Users, Clock, ChevronDown, Share2, MessageCircle, Sparkles, TrendingUp, Heart, Star, Eye } from 'lucide-react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { debounce } from 'lodash';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from 'react-error-boundary';

// Dynamically import components with loading fallback
const CourseEducation = dynamic(
  () => import("@/components/sections/course-detailed/courseEducation"),
  { loading: () => <Preloader /> }
);

const AboutProgram = dynamic(
  () => import("@/components/sections/course-detailed/aboutProgram"),
  { loading: () => <Preloader /> }
);

const CourseFaq = dynamic(
  () => import("@/components/sections/course-detailed/courseFaq"),
  { loading: () => <Preloader /> }
);

const CourseCertificate = dynamic(
  () => import("@/components/sections/course-detailed/courseCertificate"),
  { loading: () => <Preloader /> }
);

const CourseRelated = dynamic(
  () => import("@/components/sections/course-detailed/courseRelated"),
  { loading: () => <Preloader /> }
);

// Constants
const SCROLL_OFFSET = 80;
const SCROLL_DEBOUNCE_DELAY = 100;
const RETRY_MAX_ATTEMPTS = 3;
const RETRY_DELAY_BASE = 1000; // 1 second base delay

// Custom hooks
const useKeyboardNavigation = (sections, activeSection, executeScroll) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey) {
        const sectionIndex = sections.indexOf(activeSection);
        
        if (e.key === 'ArrowDown' && sectionIndex < sections.length - 1) {
          e.preventDefault();
          executeScroll(sections[sectionIndex + 1]);
        } else if (e.key === 'ArrowUp' && sectionIndex > 0) {
          e.preventDefault();
          executeScroll(sections[sectionIndex - 1]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sections, activeSection, executeScroll]);
};

const useIntersectionObserver = (sectionRefs, setActiveSection) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionKey = Object.keys(sectionRefs).find(
              key => sectionRefs[key].current === entry.target
            );
            if (sectionKey) {
              setActiveSection(sectionKey);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    Object.values(sectionRefs).forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, [sectionRefs, setActiveSection]);
};

// Error Fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
    <div className="text-red-500 text-xl mb-4">Something went wrong:</div>
    <pre className="text-sm text-gray-500 mb-4">{error.message}</pre>
    <button
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
    >
      Try again
    </button>
  </div>
);

// Loading Skeleton component
const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-8 p-4">
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      ))}
    </div>
  </div>
);

function CourseDetailedPage({ params }) {
  const { courseId } = params;
  const [categoryName, setCategoryName] = useState("");
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [activeSection, setActiveSection] = useState("education");
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { getQuery } = useGetQuery();
  const router = useRouter();
  
  // Course progress tracking state
  const [courseProgress, setCourseProgress] = useState({
    completed: 0,
    total: 0,
    percentage: 0
  });

  // Course analytics state
  const [analytics, setAnalytics] = useState({
    views: 0,
    enrollments: 0,
    rating: 0,
    reviews: []
  });

  // Memoized API URL
  const courseApiUrl = useMemo(() => apiUrls.courses.getCourseById(courseId), [courseId]);
  
  // References for scrolling to sections
  const sectionRefs = {
    education: useRef(null),
    about: useRef(null),
    faq: useRef(null),
    related: useRef(null),
    certificate: useRef(null)
  };

  // Available sections
  const sections = useMemo(() => ['education', 'about', 'faq', 'related', 'certificate'], []);

  // Course progress tracking
  const updateCourseProgress = useCallback(async () => {
    try {
      // Add your progress tracking API integration here
      const progress = {
        completed: 5,
        total: 10,
        percentage: 50
      };
      setCourseProgress(progress);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  }, []);

  // Analytics tracking
  const trackAnalytics = useCallback(async () => {
    try {
      // Add your analytics API integration here
      const analyticsData = {
        // views: 1000,
        // enrollments: 500,
        // rating: 4.5,
        // reviews: []
      };
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error tracking analytics:', error);
    }
  }, []);

  // SEO optimization
  const updateMetaTags = useCallback((data) => {
    if (!data) return;
    
    document.title = `${data?.title || 'Course Details'} | MEDH Upskill`;
    
    // Update meta tags
    const metaTags = {
      description: data?.description || 'Course details on MEDH Upskill platform',
      'og:title': `${data?.title} | MEDH Upskill`,
      'og:description': data?.description,
      'og:image': data?.thumbnail,
      'twitter:title': `${data?.title} | MEDH Upskill`,
      'twitter:description': data?.description,
      'twitter:image': data?.thumbnail
    };

    Object.entries(metaTags).forEach(([name, content]) => {
      if (!content) return;
      const meta = document.querySelector(`meta[name="${name}"]`) || 
                   document.querySelector(`meta[property="${name}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        const newMeta = document.createElement('meta');
        newMeta.setAttribute(name.startsWith('og:') ? 'property' : 'name', name);
        newMeta.setAttribute('content', content);
        document.head.appendChild(newMeta);
      }
    });
  }, []);

  // Optimized data fetching
  const fetchCourseDetails = useCallback(async (attempt = 0) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getQuery({
        url: courseApiUrl,
        onSuccess: (data) => {
          if (!data) throw new Error('No data received');
          
          setCategoryName(data?.category || "");
          setCourseDetails(data);
          setLoading(false);
          
          // Update meta tags for SEO
          updateMetaTags(data);

          // Reset retry count on success
          setRetryCount(0);
        },
        onFail: (err) => {
          throw new Error(err?.message || "Failed to load course details");
        },
      });

      return response;
    } catch (error) {
      console.error("Error in fetching course details:", error);
      setError(error.message || "An unexpected error occurred");
      setLoading(false);
      throw error; // Propagate error to be handled by the retry mechanism
    }
  }, [courseApiUrl, getQuery, updateMetaTags]);

  // Retry mechanism
  const retryFetchWithBackoff = useCallback(async () => {
    let attempt = retryCount;

    try {
      await fetchCourseDetails(attempt);
    } catch (error) {
      if (attempt < RETRY_MAX_ATTEMPTS) {
        const nextAttempt = attempt + 1;
        const delay = Math.min(RETRY_DELAY_BASE * Math.pow(2, attempt), 10000); // Max 10 second delay

        console.log(`Retry attempt ${nextAttempt} after ${delay}ms`);
        setRetryCount(nextAttempt);

        // Schedule next retry
        setTimeout(() => {
          retryFetchWithBackoff();
        }, delay);
      } else {
        console.error('Max retry attempts reached');
        toast.error('Failed to load course details after multiple attempts');
        setLoading(false);
      }
    }
  }, [fetchCourseDetails, retryCount]);

  // Initialize data with retry mechanism
  useEffect(() => {
    if (courseId && !courseDetails) {
      retryFetchWithBackoff();
    }
  }, [courseId, retryFetchWithBackoff, courseDetails]);

  // Separate effect for progress and analytics
  useEffect(() => {
    if (courseDetails) {
      Promise.all([
        updateCourseProgress(),
        trackAnalytics()
      ]).catch((error) => {
        console.error('Error updating course data:', error);
        // Don't retry these operations, just log the error
      });
    }
  }, [courseDetails, updateCourseProgress, trackAnalytics]);

  // Smooth scroll handling
  const executeScroll = useCallback((sectionKey) => {
    try {
      const ref = sectionRefs[sectionKey];
      if (ref?.current) {
        const elementPosition = ref.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - SCROLL_OFFSET;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
        setActiveSection(sectionKey);
      }
    } catch (error) {
      console.error('Scroll error:', error);
      // Fallback to instant scroll
      window.scrollTo(0, sectionRefs[sectionKey]?.current?.offsetTop || 0);
    }
  }, [sectionRefs]);

  // Scroll event handler
  const handleScroll = useCallback(
    debounce(() => {
      setShowScrollToTop(window.scrollY > 400);
    }, SCROLL_DEBOUNCE_DELAY),
    []
  );

  // Scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      handleScroll.cancel();
    };
  }, [handleScroll]);

  // Use custom hooks
  useKeyboardNavigation(sections, activeSection, executeScroll);
  useIntersectionObserver(sectionRefs, setActiveSection);

  // Theme colors with CSS variables for better maintainability
  const themeColors = {
    primary: {
      light: 'var(--color-emerald-500)',
      medium: 'var(--color-emerald-600)',
      dark: 'var(--color-emerald-700)',
    },
    secondary: {
      light: 'var(--color-blue-500)',
      medium: 'var(--color-blue-600)',
      dark: 'var(--color-blue-700)',
    },
    accent: {
      light: 'var(--color-violet-500)',
      medium: 'var(--color-violet-600)',
      dark: 'var(--color-violet-700)',
    }
  };

  // Enhanced animation variants with better performance
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        willChange: "transform, opacity" 
      }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        willChange: "opacity"
      }
    }
  };

  // Memoized navigation items
  const navigationItems = useMemo(() => [
    {
      key: 'education',
      label: 'Course Overview',
      icon: BookOpen,
      color: 'emerald'
    },
    {
      key: 'about',
      label: 'About Program',
      icon: Users,
      color: 'blue'
    },
    {
      key: 'faq',
      label: 'FAQs',
      icon: MessageCircle,
      color: 'violet'
    },
    {
      key: 'certificate',
      label: 'Certificate',
      icon: Award,
      color: 'amber'
    }
  ], []);

  // Share functionality with fallback
  const handleShare = useCallback(async () => {
    const shareData = {
      title: courseDetails?.title || 'Course Details',
      text: courseDetails?.description || 'Check out this amazing course!',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        // Use a toast notification instead of alert
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share. Please try again.');
    }
  }, [courseDetails]);

  // Wishlist functionality
  const toggleWishlist = useCallback(async () => {
    try {
      setIsWishlisted(prev => !prev);
      // Add your wishlist API integration here
      toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    } catch (error) {
      console.error('Wishlist error:', error);
      setIsWishlisted(prev => !prev); // Revert on error
      toast.error('Failed to update wishlist');
    }
  }, [isWishlisted]);

  // Loading state
  if (loading) {
    return (
      <PageWrapper>
        <LoadingSkeleton />
      </PageWrapper>
    );
  }

  // Accessibility improvements for navigation
  const renderNavigationItems = () => (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-nowrap overflow-x-auto hide-scrollbar gap-1 sm:gap-2 pb-1"
      role="navigation"
      aria-label="Course sections"
    >
      {navigationItems.map(({ key, label, icon: Icon, color }) => (
        <button 
          key={key}
          onClick={() => executeScroll(key)}
          className={`px-4 py-2 whitespace-nowrap rounded-lg font-medium text-sm transition-all ${
            activeSection === key 
              ? `bg-${color}-100 dark:bg-${color}-900/30 text-${color}-800 dark:text-${color}-300` 
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
          aria-current={activeSection === key ? 'true' : 'false'}
          aria-label={`Navigate to ${label} section`}
        >
          <span className="flex items-center">
            <Icon className="w-4 h-4 mr-1.5" aria-hidden="true" />
            {label}
          </span>
        </button>
      ))}
    </motion.div>
  );

  // Render section content with accessibility
  const renderSectionContent = (key, Component) => (
    <motion.section 
      variants={fadeIn}
      ref={sectionRefs[key]}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-300"
      role="region"
      aria-labelledby={`${key}-heading`}
    >
      <Component courseId={courseId} courseDetails={courseDetails} />
    </motion.section>
  );

  return (
    <PageWrapper>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          setError(null);
          setRetryCount(0);
          retryFetchWithBackoff();
        }}
      >
        <Toaster position="bottom-center" />
        <main 
          className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20"
          role="main"
          aria-label="Course details"
        >
          {/* Sticky Navigation */}
          <header 
            className="sticky top-0 z-50 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90"
            role="banner"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <nav className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Course Title */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex-1 min-w-0 flex items-center"
                >
                  <button 
                    onClick={() => router.back()}
                    className="mr-3 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    aria-label="Go back to previous page"
                  >
                    <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  </button>
                  
                  <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 truncate">
                    {courseDetails?.title || "Course Details"}
                  </h1>
                  
                  {categoryName && (
                    <span 
                      className="ml-3 px-3 py-1 text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 rounded-full"
                      role="status"
                    >
                      {categoryName}
                    </span>
                  )}
                </motion.div>
                
                {/* Navigation Tabs */}
                {renderNavigationItems()}
              </nav>
            </div>
          </header>

          {/* Content */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8"
          >
            {courseDetails && (
              <AnimatePresence mode="wait">
                {sections.map(section => (
                  <React.Fragment key={section}>
                    {renderSectionContent(section, {
                      education: CourseEducation,
                      about: AboutProgram,
                      faq: CourseFaq,
                      related: CourseRelated,
                      certificate: CourseCertificate
                    }[section])}
                  </React.Fragment>
                ))}
              </AnimatePresence>
            )}
          </motion.div>

          {/* Floating Action Buttons */}
          <div 
            className="fixed bottom-6 right-6 z-50 flex flex-col gap-3"
            role="complementary"
            aria-label="Quick actions"
          >
            {/* Share Button */}
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg flex items-center justify-center"
              aria-label="Share course"
              onClick={handleShare}
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
            
            {/* Wishlist Button */}
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.9, type: "spring" }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-lg flex items-center justify-center"
              aria-label="Add to wishlist"
              onClick={toggleWishlist}
            >
              <Heart className="w-5 h-5" />
            </motion.button>
            
            {/* Scroll to Top Button */}
            <AnimatePresence>
              {showScrollToTop && (
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700 text-white shadow-lg flex items-center justify-center"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  aria-label="Scroll to top"
                >
                  <ChevronDown className="w-5 h-5 transform rotate-180" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          
          {/* "Trending" Live Indicator */}
          {courseDetails?.is_trending && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, type: "spring" }}
              className="fixed bottom-6 left-6 z-50"
            >
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center">
                <span className="relative flex h-3 w-3 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
                <span className="flex items-center text-sm font-medium">
                  <TrendingUp className="w-4 h-4 mr-1" /> Trending Course
                </span>
              </div>
            </motion.div>
          )}

          {/* Course Progress Bar - Commented out temporarily
          {courseProgress.total > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-20 left-0 right-0 z-40 px-4"
            >
              <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Course Progress
                  </span>
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {courseProgress.percentage}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${courseProgress.percentage}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-emerald-500"
                  />
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {courseProgress.completed} of {courseProgress.total} modules completed
                </div>
              </div>
            </motion.div>
          )} */}

          {/* Analytics Badge */}
          {analytics.views > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="fixed top-24 right-6 z-40"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>{analytics.enrollments.toLocaleString()} enrolled</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{analytics.rating.toFixed(1)} rating</span>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </ErrorBoundary>
    </PageWrapper>
  );
}

export default CourseDetailedPage;

