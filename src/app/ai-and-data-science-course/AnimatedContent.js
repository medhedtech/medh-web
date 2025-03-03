'use client';

import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpCircle } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

function AnimatedContent({ components, exploreJourneyProps, bannerProps }) {
  const {
    CourseBanner,
    CourseAiOverview,
    CourseOptions,
    CourseAiFaq,
    CourseAiCourseBanner,
    CourseAiRelatedCourses,
    ExploreJourney,
    ThemeController
  } = components;
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Memoized scroll handler for better performance
  const handleScroll = useCallback(() => {
    // Use requestAnimationFrame for smooth visual updates
    requestAnimationFrame(() => {
      setShowScrollTop(window.scrollY > 500);
    });
  }, []);

  useEffect(() => {
    setIsLoaded(true);

    // Throttle scroll events instead of debounce for smoother response
    let ticking = false;
    const throttledScrollHandler = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
      }
    };
    
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
    };
  }, [handleScroll]);

  // Animation variants with hardware acceleration hints
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Smooth scrolling with optimized performance
  const scrollToTop = () => {
    // Using native smooth scrolling for better performance
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const motionSectionProps = {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, amount: 0.1 }, // Trigger earlier for smoother appearance
    variants: fadeInUp,
    transition: { duration: 0.5 },
    className: "w-full py-16 relative z-10 transform-gpu" // Add transform-gpu for hardware acceleration
  };

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section with Animation */}
      <section className="relative w-full">
        <motion.div
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
          className="transform-gpu will-change-transform" // Add hardware acceleration
        >
          <CourseBanner {...bannerProps} />
        </motion.div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent" />
      </section>

      {/* Main Content */}
      <main className="relative w-full bg-gray-50 dark:bg-gray-900">
        {/* Overview Section with Animation */}
        <motion.section
          {...motionSectionProps}
        >
          <CourseAiOverview />
        </motion.section>

        {/* Course Options Section */}
        <motion.section
          {...motionSectionProps}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CourseOptions />
        </motion.section>

        {/* Enrollment CTA Section with Gradient Background */}
        <section className="relative w-full py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10" />
          <motion.div
            {...motionSectionProps}
          >
            <ExploreJourney {...exploreJourneyProps} />
          </motion.div>
        </section>

        {/* FAQ Section with Card Design */}
        <section className="w-full py-16">
          <motion.div
            {...motionSectionProps}
            className="w-full bg-white dark:bg-gray-800 shadow-lg overflow-hidden rounded-xl transform-gpu"
          >
            <div className="py-8">
              <CourseAiFaq />
            </div>
          </motion.div>
        </section>

        {/* Course Banner Section */}
        <motion.section
          {...motionSectionProps}
        >
          <CourseAiCourseBanner />
        </motion.section>

        {/* Related Courses Section */}
        <motion.section
          {...motionSectionProps}
        >
          <CourseAiRelatedCourses />
        </motion.section>
      </main>

      {/* Fixed Theme Controller */}
      <div className="fixed bottom-4 left-4 z-50">
        <ThemeController />
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all z-50 transform-gpu hover:scale-110 active:scale-95"
            onClick={scrollToTop}
            aria-label="Scroll to top"
          >
            <ArrowUpCircle className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AnimatedContent; 