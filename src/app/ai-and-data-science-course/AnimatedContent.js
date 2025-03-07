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

  // Optimized scroll handler with RAF and throttling
  const handleScroll = useCallback(() => {
    if (!showScrollTop && window.scrollY > 500) {
      setShowScrollTop(true);
    } else if (showScrollTop && window.scrollY <= 500) {
      setShowScrollTop(false);
    }
  }, [showScrollTop]);

  useEffect(() => {
    setIsLoaded(true);

    let rafId;
    let lastScrollY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      lastScrollY = window.scrollY;
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [handleScroll]);

  // Optimized animation variants
  const fadeInUp = {
    hidden: { 
      opacity: 0, 
      y: 20,
      transition: { duration: 0.3 }
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Smooth scroll with native behavior
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Optimized motion section props
  const motionSectionProps = {
    initial: "hidden",
    whileInView: "visible",
    viewport: { 
      once: true, 
      amount: 0.1,
      margin: "100px 0px" 
    },
    variants: fadeInUp,
    className: "w-full transform-gpu" // Hardware acceleration
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full">
        <motion.div
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          variants={fadeInUp}
          className="transform-gpu"
        >
          <CourseBanner {...bannerProps} />
        </motion.div>
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent" />
      </section>

      {/* Main Content */}
      <main className="relative w-full bg-gray-50 dark:bg-gray-900">
        {/* Overview Section */}
        <motion.section {...motionSectionProps} className="py-12 md:py-16">
          <CourseAiOverview />
        </motion.section>

        {/* Course Options Section */}
        <motion.section {...motionSectionProps} className="py-12 md:py-16">
          <CourseOptions />
        </motion.section>

        {/* Enrollment CTA Section */}
        <section className="relative w-full py-16 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10" />
          <motion.div {...motionSectionProps}>
            <ExploreJourney {...exploreJourneyProps} />
          </motion.div>
        </section>

        {/* FAQ Section */}
        <motion.section {...motionSectionProps} className="py-12 md:py-16">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl">
            <div className="py-8">
              <CourseAiFaq />
            </div>
          </div>
        </motion.section>

        {/* Course Banner Section */}
        <motion.section {...motionSectionProps} className="py-12 md:py-16">
          <CourseAiCourseBanner />
        </motion.section>

        {/* Related Courses Section */}
        <motion.section {...motionSectionProps} className="py-12 md:py-16">
          <CourseAiRelatedCourses />
        </motion.section>
      </main>

      {/* Fixed Elements */}
      <div className="fixed bottom-4 left-4 z-50">
        <ThemeController />
      </div>

      {/* Optimized Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 right-4 bg-primary-500 hover:bg-primary-600 text-white p-2.5 rounded-full shadow-lg z-50 transform-gpu hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            onClick={scrollToTop}
            aria-label="Scroll to top"
          >
            <ArrowUpCircle className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AnimatedContent; 