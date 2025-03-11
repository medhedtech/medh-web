'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpCircle } from 'lucide-react';

/**
 * Shared AnimatedContent component for course pages
 * 
 * @param {Object} components - Object containing course-specific components
 * @param {Object} exploreJourneyProps - Props for the ExploreJourney component
 * @param {Object} bannerProps - Props for the course banner
 * @param {Object} options - Additional options for customization
 * @returns {JSX.Element}
 */
function AnimatedContent({ 
  components, 
  exploreJourneyProps, 
  bannerProps = {}, 
  options = {} 
}) {
  // Extract components or use empty placeholder components
  const {
    // Optional course-specific banner component
    CourseBanner,
    
    // Course overview component
    CourseOverview,
    
    // Course content/options component
    CourseContent,
    
    // Course FAQ component
    CourseFAQ,
    
    // Course banner component
    CourseContentBanner,
    
    // Related courses component
    CourseRelatedCourses,
    
    // Journey exploration component
    ExploreJourney,
    
    // Theme controller component
    ThemeController
  } = components;

  // Extract options or use defaults
  const {
    // Gradient colors for the CTA section
    ctaGradientColors = ["blue-500/10", "indigo-500/10", "purple-500/10"],
    
    // Accent color for the scroll-to-top button
    accentColor = "primary-500",
    
    // Hover accent color for the scroll-to-top button
    hoverAccentColor = "primary-600",
    
    // Spring animation settings
    springAnimation = {
      type: "spring",
      stiffness: 300,
      damping: 30,
      mass: 1
    }
  } = options;

  // State management
  const [isLoaded, setIsLoaded] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const mainRef = useRef(null);

  // Optimized scroll handler with RAF for better performance
  const handleScroll = useCallback(() => {
    // Use requestAnimationFrame for smooth visual updates
    requestAnimationFrame(() => {
      setShowScrollTop(window.scrollY > 500);
    });
  }, []);

  useEffect(() => {
    setIsLoaded(true);

    // Throttle scroll events for smoother response
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
    hidden: { 
      opacity: 0, 
      y: prefersReducedMotion ? 0 : 20,
      transition: { duration: 0.3 }
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: springAnimation
    }
  };

  // Smooth scrolling with optimized performance
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Reusable motion section props
  const motionSectionProps = {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, amount: 0.1 },
    variants: fadeInUp,
    className: "w-full py-12 md:py-16 relative z-10 transform-gpu"
  };

  return (
    <div className="relative w-full overflow-hidden" ref={mainRef}>
      {/* Hero Section */}
      <section className="relative w-full">
        <motion.div
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          variants={fadeInUp}
          className="transform-gpu"
        >
          {CourseBanner && <CourseBanner {...bannerProps} />}
        </motion.div>
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent" />
      </section>

      {/* Main Content */}
      <main className="relative w-full bg-gray-50 dark:bg-gray-900">
        {/* Overview Section */}
        {CourseOverview && (
          <motion.section {...motionSectionProps}>
            <CourseOverview />
          </motion.section>
        )}

        {/* Course Content Section */}
        {CourseContent && (
          <motion.section {...motionSectionProps}>
            <CourseContent />
          </motion.section>
        )}

        {/* Enrollment CTA Section */}
        {ExploreJourney && (
          <section className="relative w-full py-16 md:py-20 overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-r from-${ctaGradientColors[0]} via-${ctaGradientColors[1]} to-${ctaGradientColors[2]}`} />
            <motion.div {...motionSectionProps}>
              <ExploreJourney {...exploreJourneyProps} />
            </motion.div>
          </section>
        )}

        {/* FAQ Section */}
        {CourseFAQ && (
          <motion.section {...motionSectionProps}>
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl">
              <div className="py-8">
                <CourseFAQ />
              </div>
            </div>
          </motion.section>
        )}

        {/* Course Banner Section */}
        {CourseContentBanner && (
          <motion.section {...motionSectionProps}>
            <CourseContentBanner />
          </motion.section>
        )}

        {/* Related Courses Section */}
        {CourseRelatedCourses && (
          <motion.section {...motionSectionProps}>
            <CourseRelatedCourses />
          </motion.section>
        )}
      </main>

      {/* Fixed Theme Controller */}
      {ThemeController && (
        <div className="fixed bottom-4 left-4 z-50">
          <ThemeController />
        </div>
      )}

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className={`fixed bottom-4 right-4 bg-${accentColor} hover:bg-${hoverAccentColor} text-white p-2.5 rounded-full shadow-lg z-50 transform-gpu hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-${accentColor} focus:ring-offset-2`}
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