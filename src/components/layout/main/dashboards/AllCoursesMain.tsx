"use client";

import React, { Suspense, useState, useEffect, useMemo, useCallback } from 'react';
import CoursesFilter from "@/components/sections/courses/CoursesFilter";
import { motion } from "framer-motion";
import Link from 'next/link';
import {
  Target,
  Globe,
  Award
} from 'lucide-react';

/**
 * AllCoursesMain - Component that displays the all courses content
 * within the student dashboard layout
 */
const AllCoursesMain: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Animation variants
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  }), []);

  // Features with modern icons
  const features = useMemo(() => [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Skill-Focused",
      description: "Learn exactly what you need for your career goals"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Access",
      description: "Study from anywhere, anytime with our platform"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Recognized Certs",
      description: "Get certificates that matter to employers"
    }
  ], []);

  // Course Stats Component
  const CourseStats = () => (
    <div className="bg-gradient-to-r from-primary-500 to-primary-700 dark:from-primary-800 dark:to-primary-900 rounded-2xl p-6 lg:p-8 text-white shadow-lg">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
        <div className="text-center">
          <div className="text-2xl lg:text-3xl font-bold mb-2">150+</div>
          <div className="text-primary-100 text-sm font-medium">Total Courses</div>
        </div>
        <div className="text-center">
          <div className="text-2xl lg:text-3xl font-bold mb-2">50+</div>
          <div className="text-primary-100 text-sm font-medium">Live Classes</div>
        </div>
        <div className="text-center">
          <div className="text-2xl lg:text-3xl font-bold mb-2">25+</div>
          <div className="text-primary-100 text-sm font-medium">Expert Instructors</div>
        </div>
      </div>
    </div>
  );

  // Course Preloader
  const CoursePreloader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-8 animate-pulse border border-gray-200 dark:border-gray-700">
          <div className="w-full h-48 lg:h-52 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4 lg:mb-6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4 lg:mb-6"></div>
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (!isClient) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <CoursePreloader />
      </div>
    );
  }

  return (
    <div className="w-full">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8 lg:space-y-12 pt-8 lg:pt-12"
      >






        {/* Courses Filter Section */}
        <motion.div variants={itemVariants} className="px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<CoursePreloader />}>
            <CoursesFilter />
          </Suspense>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AllCoursesMain; 