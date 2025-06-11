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
  // exploreJourneyProps, 
  bannerProps = {}, 
  options = {} 
}) {
  // Extract components or use empty placeholder components
  const {
    // Optional course-specific banner component
    CourseBanner,


    // Course content/options component
    CourseContent,
    
    // Course overview component
    CourseOverview,
    
    // Course FAQ component
    CourseFAQ,
    
    // // Course banner component
    // CourseContentBanner,
    
    // Related courses component
    CourseRelatedCourses,
    
    // // Journey exploration component
    // ExploreJourney,
    
    // Theme controller component
    ThemeController
  } = components;

  // Extract options or use defaults
  const {
    // Gradient colors for the CTA section
    ctaGradientColors = ["blue-500/10", "indigo-500/10", "purple-500/10"],
    
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
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const mainRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
    setIsLoaded(true);
  }, []);

  // Don't render animations on server or until component is mounted
  if (!isMounted) {
    return (
      <div className="relative w-full overflow-hidden">
        {/* Static version without animations for SSR */}
        <section className="relative w-full">
          {CourseBanner && <CourseBanner {...bannerProps} />}
          <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent" />
        </section>

        {CourseContent && (
          <section className="w-full py-3 md:py-16 relative z-10">
            <CourseContent />
          </section>
        )}

        <main className="relative w-full bg-gray-50 dark:bg-gray-900">
          {CourseOverview && (
            <section className="w-full py-3 md:py-16 relative z-10">
              <CourseOverview />
            </section>
          )}

          {CourseFAQ && (
            <section className="w-full py-3 md:py-16 relative z-10">
              <div className="">
                <div className="py-0">
                  <CourseFAQ />
                </div>
              </div>
            </section>
          )}

          {CourseRelatedCourses && (
            <section className="w-full py-3 md:py-16 relative z-10">
              <CourseRelatedCourses />
            </section>
          )}
        </main>

        {ThemeController && (
          <div className="fixed bottom-4 left-4 z-50">
            <ThemeController />
          </div>
        )}
      </div>
    );
  }

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

  // Reusable motion section props
  const motionSectionProps = {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, amount: 0.1 },
    variants: fadeInUp,
    className: "w-full py-3 md:py-16 relative z-10 transform-gpu"
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

      {/* Course Content Section */}
      {CourseContent && (
          <motion.section {...motionSectionProps}>
            <CourseContent />
          </motion.section>
        )}

      {/* Main Content */}
      <main className="relative w-full bg-gray-50 dark:bg-gray-900 ">
        {/* Overview Section */}
        {CourseOverview && (
          <motion.section {...motionSectionProps}>
            <CourseOverview />
          </motion.section>
        )}

        

        {/* Enrollment CTA Section */}
        {/* {ExploreJourney && (
          <section className="relative w-full py-16 md:py-20 overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-r from-${ctaGradientColors[0]} via-${ctaGradientColors[1]} to-${ctaGradientColors[2]}`} />
            <motion.div {...motionSectionProps}>
              <ExploreJourney {...exploreJourneyProps} />
            </motion.div>
          </section>
        )} */}

        {/* FAQ Section */}
        {CourseFAQ && (
          <motion.section {...motionSectionProps}>
            <div className="">
              <div className="py-0">
                <CourseFAQ />
              </div>
            </div>
          </motion.section>
        )}

        {/* Course Banner Section */}
        {/* {CourseContentBanner && (
          <motion.section {...motionSectionProps}>
            <CourseContentBanner />
          </motion.section>
        )} */}

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
    </div>
  );
}

export default AnimatedContent; 