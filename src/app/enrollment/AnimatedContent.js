'use client';

import React from 'react';
import { motion } from 'framer-motion';

const AnimatedContent = ({ 
  components, 
  bannerProps = {}, 
  exploreJourneyProps = {},
  customComponentProps = {}
}) => {
  const {
    CourseBanner,
    CourseAiOverview,
    CourseOptions,
    CourseAiFaq,
    CourseAiCourseBanner,
    CourseAiRelatedCourses,
    ExploreJourney,
    ThemeController,
    ...otherComponents
  } = components;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "tween",
        duration: 0.6,
        ease: [0.25, 1, 0.5, 1]
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full"
    >
      {/* Banner Section */}
      {CourseBanner && (
        <motion.div variants={itemVariants}>
          <CourseBanner {...bannerProps} />
        </motion.div>
      )}

      {/* Overview Section */}
      {CourseAiOverview && (
        <motion.div variants={itemVariants} className="mt-16 lg:mt-24">
          <CourseAiOverview {...customComponentProps.overviewProps} />
        </motion.div>
      )}

      {/* Course Options */}
      {CourseOptions && (
        <motion.div variants={itemVariants} className="mt-16 lg:mt-24">
          <CourseOptions {...customComponentProps.optionsProps} />
        </motion.div>
      )}

      {/* FAQ Section */}
      {CourseAiFaq && (
        <motion.div variants={itemVariants} className="mt-16 lg:mt-24">
          <CourseAiFaq {...customComponentProps.faqProps} />
        </motion.div>
      )}

      {/* Course Banner */}
      {CourseAiCourseBanner && (
        <motion.div variants={itemVariants} className="mt-16 lg:mt-24">
          <CourseAiCourseBanner {...customComponentProps.courseBannerProps} />
        </motion.div>
      )}

      {/* Related Courses */}
      {CourseAiRelatedCourses && (
        <motion.div variants={itemVariants} className="mt-16 lg:mt-24">
          <CourseAiRelatedCourses {...customComponentProps.relatedCoursesProps} />
        </motion.div>
      )}

      {/* Other Dynamic Components */}
      {Object.entries(otherComponents).map(([key, Component]) => (
        <motion.div key={key} variants={itemVariants} className="mt-16 lg:mt-24">
          <Component {...(customComponentProps[key] || {})} />
        </motion.div>
      ))}

      {/* Explore Journey Section */}
      {ExploreJourney && (
        <motion.div variants={itemVariants} className="mt-16 lg:mt-24">
          <ExploreJourney {...exploreJourneyProps} />
        </motion.div>
      )}
    </motion.div>
  );
};

export default AnimatedContent; 