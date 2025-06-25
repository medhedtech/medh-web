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

      {/* Overview Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={{ duration: 0.5 }}
      >
        <VedicOverview />
      </motion.section>

      {/* Course Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={{ duration: 0.5 }}
      >
        <VedicCourse />
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={{ duration: 0.5 }}
      >
        <VedicFaq />
      </motion.section>
    </div>
  );
}

export default AnimatedContent; 