'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpCircle } from 'lucide-react';

function AnimatedContent({ components, exploreJourneyProps }) {
  const {
    CourseBanner,
    PersonalityOvereveiw,
    PersonalityCourse,
    PersonalityFaq,
    PersonalityCourseBanner,
    PersonalityRelatedCourse,
    ExploreJourney,
    ThemeController
  } = components;

  const [isLoaded, setIsLoaded] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const mainRef = useRef(null);

  // Memoized scroll handler for better performance
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
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        mass: 1
      }
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
    className: "w-full py-16 relative z-10 transform-gpu"
  };

  return (
    <div className="w-full overflow-x-hidden" ref={mainRef}>
      {/* Hero Section with Animation */}
      <section className="relative w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="transform-gpu will-change-transform"
        >
          <CourseBanner />
        </motion.div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent" />
      </section>

      {/* Main Content */}
      <main className="relative w-full bg-gray-50 dark:bg-gray-900">
        {/* Overview Section with Animation */}
        <motion.section
          {...motionSectionProps}
          style={{ 
            willChange: "transform, opacity",
            backfaceVisibility: "hidden"
          }}
        >
          <div className="w-full">
            <PersonalityOvereveiw />
          </div>
        </motion.section>

        {/* Course Content Section */}
        <motion.section
          {...motionSectionProps}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            delay: 0.1
          }}
          style={{ 
            willChange: "transform, opacity",
            backfaceVisibility: "hidden"
          }}
        >
          <div className="w-full">
            <PersonalityCourse />
          </div>
        </motion.section>

        {/* Enrollment CTA Section with Gradient Background */}
        <section className="relative w-full py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-fuchsia-500/10" />
          <motion.div
            {...motionSectionProps}
            style={{ 
              willChange: "transform, opacity",
              backfaceVisibility: "hidden"
            }}
          >
            <ExploreJourney {...exploreJourneyProps} />
          </motion.div>
        </section>

        {/* FAQ Section with Card Design */}
        <section className="w-full py-16">
          <motion.div
            {...motionSectionProps}
            className="w-full bg-white dark:bg-gray-800 shadow-lg overflow-hidden rounded-xl transform-gpu"
            style={{ 
              willChange: "transform, opacity",
              backfaceVisibility: "hidden"
            }}
          >
            <div className="py-8">
              <PersonalityFaq />
            </div>
          </motion.div>
        </section>

        {/* Course Banner Section */}
        <motion.section
          {...motionSectionProps}
          style={{ 
            willChange: "transform, opacity",
            backfaceVisibility: "hidden"
          }}
        >
          <div className="w-full">
            <PersonalityCourseBanner />
          </div>
        </motion.section>

        {/* Related Courses Section with Grid Layout */}
        {PersonalityRelatedCourse && (
          <motion.section
            {...motionSectionProps}
            style={{ 
              willChange: "transform, opacity",
              backfaceVisibility: "hidden"
            }}
          >
            <div className="w-full">
              <PersonalityRelatedCourse />
            </div>
          </motion.section>
        )}
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
            transition={{ 
              type: "spring",
              stiffness: 500,
              damping: 25
            }}
            className="fixed bottom-4 right-4 bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-full shadow-lg transition-all z-50 transform-gpu hover:scale-110 active:scale-95"
            onClick={scrollToTop}
            aria-label="Scroll to top"
            style={{ 
              willChange: "transform, opacity",
              backfaceVisibility: "hidden"
            }}
          >
            <ArrowUpCircle className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AnimatedContent; 