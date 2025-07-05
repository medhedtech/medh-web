'use client';

import React from 'react';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

function AnimatedContent({ components, bannerProps }) {
  const { VedicBanner, VedicOverview, VedicCourse, VedicFaq, ThemeController } = components;

  return (
    <>
      {/* Main sections with spacing */}
      <div className="space-y-16 md:space-y-24">
        {/* Banner Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <VedicBanner {...bannerProps} />
        </motion.section>

        {/* Course Section (moved above Overview) */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <VedicCourse />
        </motion.section>

        {/* Overview Section (now below Course) */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <VedicOverview />
        </motion.section>
      </div>

      {/* FAQ Section with no extra top margin */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={{ duration: 0.5 }}
        className="mt-0"
      >
        <VedicFaq />
      </motion.section>
    </>
  );
}

export default AnimatedContent; 