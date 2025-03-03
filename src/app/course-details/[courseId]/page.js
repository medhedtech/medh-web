"use client"
import React, { useEffect, useState, useRef } from "react";
import dynamic from 'next/dynamic';
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import Preloader from "@/components/shared/others/Preloader";
import { motion, AnimatePresence } from "framer-motion";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import { RefreshCw, ArrowLeft, BookOpen, Award, Users, Clock, ChevronDown, Share2, MessageCircle, Sparkles, TrendingUp, Heart } from 'lucide-react';
import Link from "next/link";
import { useRouter } from 'next/navigation';

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

function CourseDetailedPage({ params }) {
  const { courseId } = params;
  const [categoryName, setCategoryName] = useState("");
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [activeSection, setActiveSection] = useState("education");
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const { getQuery } = useGetQuery();
  const router = useRouter();
  
  // References for scrolling to sections
  const educationRef = useRef(null);
  const aboutRef = useRef(null);
  const faqRef = useRef(null);
  const relatedRef = useRef(null);
  const certificateRef = useRef(null);

  // Smooth scroll handling
  const executeScroll = (ref) => {
    if (ref.current) {
      const offset = 80; // Account for sticky header
      const elementPosition = ref.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };
  
  // Theme colors - for consistent styling with our FAQ component
  const themeColors = {
    primary: {
      light: '#10b981', // Emerald 500
      medium: '#059669', // Emerald 600
      dark: '#047857', // Emerald 700
    },
    secondary: {
      light: '#3b82f6', // Blue 500
      medium: '#2563eb', // Blue 600
      dark: '#1d4ed8', // Blue 700
    },
    accent: {
      light: '#8b5cf6', // Violet 500
      medium: '#7c3aed', // Violet 600
      dark: '#6d28d9', // Violet 700 
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
    }
    
    // Smooth scroll to top
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth'
    });
    
    // Add scroll event listener for "scroll to top" button
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 400);
      
      // Update active section based on scroll position
      if (educationRef.current && window.scrollY < educationRef.current.offsetTop + educationRef.current.offsetHeight - 100) {
        setActiveSection("education");
      } else if (aboutRef.current && window.scrollY < aboutRef.current.offsetTop + aboutRef.current.offsetHeight - 100) {
        setActiveSection("about");
      } else if (faqRef.current && window.scrollY < faqRef.current.offsetTop + faqRef.current.offsetHeight - 100) {
        setActiveSection("faq");
      } else if (relatedRef.current && window.scrollY < relatedRef.current.offsetTop + relatedRef.current.offsetHeight - 100) {
        setActiveSection("related");
      } else if (certificateRef.current) {
        setActiveSection("certificate");
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [courseId]);

  const fetchCourseDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await getQuery({
        url: `${apiUrls?.courses?.getCourseById}/${courseId}`,
        onSuccess: (data) => {
          setCategoryName(data?.category || "");
          setCourseDetails(data);
          setLoading(false);
          
          // Set page title and meta description
          document.title = `${data?.title || 'Course Details'} | MEDH Upskill`;
          const metaDescription = document.querySelector('meta[name="description"]');
          if (metaDescription) {
            metaDescription.setAttribute('content', data?.description || 'Course details on MEDH Upskill platform');
          }
        },
        onFail: (err) => {
          console.error("Error fetching course details:", err);
          setError("Failed to load course details. Please try again later.");
          setLoading(false);
        },
      });
    } catch (error) {
      console.error("Error in fetching course details:", error);
      setError("An unexpected error occurred. Please try again later.");
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchCourseDetails();
  };
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Loading state with animation
  if (loading) {
    return (
      <PageWrapper>
        <div className="flex flex-col justify-center items-center min-h-[70vh] px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="relative">
              <Preloader />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 2, times: [0, 0.5, 1] }}
                className="absolute -top-10 -right-10"
              >
                <Sparkles className="w-8 h-8 text-emerald-400" />
              </motion.div>
            </div>
            
            <motion.p 
              className="mt-6 text-gray-700 dark:text-gray-300 text-lg font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Loading your learning adventure...
            </motion.p>
            
            <motion.div 
              className="mt-3 text-sm text-gray-500 dark:text-gray-400 max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Great things are worth waiting for! We're preparing a personalized learning journey just for you.
            </motion.div>
            
            <motion.div 
              className="mt-8 flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Link 
                href="/courses" 
                className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span>Browse other courses</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </PageWrapper>
    );
  }

  // Error state with animation
  if (error) {
    return (
      <PageWrapper>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto px-4 py-16"
        >
          <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/30 dark:to-red-900/10 p-8 rounded-2xl border border-red-100 dark:border-red-800/30 shadow-lg">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <RefreshCw className="h-10 w-10 text-red-500 dark:text-red-400" />
              </div>
            </motion.div>
            
            <motion.h2 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-4"
            >
              Oops! Course Not Available
            </motion.h2>
            
            <motion.p 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center text-gray-700 dark:text-gray-300 mb-3 max-w-2xl mx-auto"
            >
              {error}
            </motion.p>
            
            <motion.p 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto"
            >
              {retryCount > 0 
                ? `We've tried ${retryCount} time${retryCount > 1 ? 's' : ''} to get this content for you.` 
                : "This might be a temporary issue. Give it another try or explore our other amazing courses."}
            </motion.p>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRetry}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center font-medium"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Try Again
              </motion.button>
              
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/courses"
                className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center border border-gray-200 dark:border-gray-700 font-medium"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Explore All Courses
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
        {/* Sticky Navigation */}
        <header className="sticky top-0 z-50 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90">
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
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
                
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 truncate">
                  {courseDetails?.title || "Course Details"}
                </h1>
                
                {categoryName && (
                  <span className="ml-3 px-3 py-1 text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 rounded-full">
                    {categoryName}
                  </span>
                )}
              </motion.div>
              
              {/* Navigation Tabs */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-nowrap overflow-x-auto hide-scrollbar gap-1 sm:gap-2 pb-1"
              >
                <button 
                  onClick={() => executeScroll(educationRef)}
                  className={`px-4 py-2 whitespace-nowrap rounded-lg font-medium text-sm transition-all ${
                    activeSection === "education" 
                      ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300" 
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <span className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-1.5" />
                    Course Overview
                  </span>
                </button>
                
                <button 
                  onClick={() => executeScroll(aboutRef)}
                  className={`px-4 py-2 whitespace-nowrap rounded-lg font-medium text-sm transition-all ${
                    activeSection === "about" 
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300" 
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1.5" />
                    About Program
                  </span>
                </button>
                
                <button 
                  onClick={() => executeScroll(faqRef)}
                  className={`px-4 py-2 whitespace-nowrap rounded-lg font-medium text-sm transition-all ${
                    activeSection === "faq" 
                      ? "bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300" 
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <span className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-1.5" />
                    FAQs
                  </span>
                </button>
                
                <button 
                  onClick={() => executeScroll(certificateRef)}
                  className={`px-4 py-2 whitespace-nowrap rounded-lg font-medium text-sm transition-all ${
                    activeSection === "certificate" 
                      ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300" 
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <span className="flex items-center">
                    <Award className="w-4 h-4 mr-1.5" />
                    Certificate
                  </span>
                </button>
              </motion.div>
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
              <motion.section 
                variants={fadeIn}
                ref={educationRef}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <CourseEducation courseId={courseId} courseDetails={courseDetails} />
              </motion.section>

              <motion.section 
                variants={fadeIn}
                ref={aboutRef}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <AboutProgram courseId={courseId} />
              </motion.section>

              <motion.section 
                variants={fadeIn}
                ref={faqRef}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <CourseFaq courseId={courseId} />
              </motion.section>

              <motion.section 
                variants={fadeIn}
                ref={relatedRef}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <CourseRelated 
                  categoryName={categoryName} 
                  courseId={courseId} 
                  relatedCourses={courseDetails?.related_courses || []} 
                />
              </motion.section>

              <motion.section 
                variants={fadeIn}
                ref={certificateRef}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <CourseCertificate />
              </motion.section>
            </AnimatePresence>
          )}
        </motion.div>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
          {/* Share Button */}
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg flex items-center justify-center"
            aria-label="Share course"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: courseDetails?.title || 'Course Details',
                  text: courseDetails?.description || 'Check out this amazing course!',
                  url: window.location.href,
                });
              } else {
                // Fallback
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
              }
            }}
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
                onClick={scrollToTop}
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
      </main>
    </PageWrapper>
  );
}

export default CourseDetailedPage;
