'use client';

import React from 'react';
import { motion } from "framer-motion";

function AnimatedContent({ components, exploreJourneyProps }) {
  const {
    VedicBanner,
    VedicOverview,
    VedicCource,
    VedicFaq,
    VedicCourceBanner,
    VedicRalatedCource,
    ExploreJourney,
    ThemeController
  } = components;

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative w-full">
        <VedicBanner />
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent" />
      </section>

      {/* Main Content */}
      <main className="relative w-full bg-gray-50 dark:bg-gray-900">
        {/* Overview Section with Animation */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
          className="w-full py-16 relative z-10"
        >
          <div className="w-full">
            <VedicOverview />
          </div>
        </motion.section>

        {/* Course Content Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full py-16 relative"
        >
          <div className="w-full">
            <VedicCource />
          </div>
        </motion.section>

        {/* Enrollment CTA Section with Gradient Background */}
        <section className="relative w-full py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10" />
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
            className="w-full relative z-10"
          >
            <ExploreJourney {...exploreJourneyProps} />
          </motion.div>
        </section>

        {/* FAQ Section with Card Design */}
        <section className="w-full py-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
            className="w-full bg-white dark:bg-gray-800 shadow-lg overflow-hidden rounded-xl"
          >
            <div className="py-8">
              <VedicFaq />
            </div>
          </motion.div>
        </section>

        {/* Course Banner Section */}
        <section className="w-full py-16">
          <div className="w-full">
            <VedicCourceBanner />
          </div>
        </section>

        {/* Related Courses Section with Grid Layout */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
          className="w-full py-16"
        >
          <div className="w-full">
            <VedicRalatedCource />
          </div>
        </motion.section>
      </main>

      {/* Fixed Theme Controller */}
      <div className="fixed bottom-4 left-4 z-50">
        <ThemeController />
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="fixed bottom-4 right-4 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-all z-50"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button>
    </div>
  );
}

export default AnimatedContent; 