"use client";
import React from "react";
import { motion } from "framer-motion";
import CounterStudent from "@/components/sections/sub-section/dashboards/CounterStudent";
import ProgressOverview from "./ProgressOverview";
import StudentUpcomingClasses from "./StudentUpcomingClasses";
import FreeClasses from "@/components/shared/dashboards/FreeClasses";

const StudentDashboardMain: React.FC = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 md:p-6">
        {/* Counter Section */}
        <motion.section 
          variants={itemVariants}
          className="col-span-1 md:col-span-2 lg:col-span-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm overflow-hidden"
        >
          <CounterStudent />
        </motion.section>

        {/* Progress Overview */}
        <motion.section 
          variants={itemVariants}
          className="col-span-1 md:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm overflow-hidden"
        >
          <ProgressOverview />
        </motion.section>

        {/* Upcoming Classes */}
        <motion.section 
          variants={itemVariants}
          className="col-span-1 md:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm overflow-hidden"
        >
          <StudentUpcomingClasses />
        </motion.section>

        {/* Free Courses */}
        <motion.section 
          variants={itemVariants}
          className="col-span-1 md:col-span-2 lg:col-span-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm overflow-hidden"
        >
          <FreeClasses />
        </motion.section>
      </div>
    </motion.div>
  );
};

export default StudentDashboardMain; 