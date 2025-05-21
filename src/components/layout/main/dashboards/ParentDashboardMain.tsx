"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CounterParent from "@/components/sections/sub-section/dashboards/CounterParent";
import RecentAnnouncements from "@/components/shared/dashboards/RecentAnnouncements";
import { Bell, Calendar, BookOpen, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";
import FreeClasses from "@/components/shared/dashboards/FreeClasses";

const ParentDashboardMain: React.FC = () => {
  const [greeting, setGreeting] = useState<string>("Good day");
  const [userName, setUserName] = useState<string>("");

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

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    // Get user name from localStorage
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("userName") || "";
      setUserName(storedName.split(" ")[0] || "Parent"); // Use first name or default to "Parent"
    }
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
    >
      {/* Hero greeting section */}
      <motion.div 
        variants={itemVariants}
        className="relative bg-gradient-to-br from-primary-500/90 to-primary-700 dark:from-primary-800 dark:to-primary-900 overflow-hidden"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[url('/backgrounds/grid-pattern.svg')] opacity-10"></div>
        
        <div className="container mx-auto px-4 py-8 sm:py-10 lg:py-12 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                {greeting}, {userName}
              </h1>
              <p className="text-primary-100 text-base sm:text-lg max-w-xl">
                Welcome to your parent dashboard. Monitor your child's progress, track attendance, and stay updated with school news.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/20 text-white mt-2 md:mt-0 min-w-[270px] w-[270px]">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary-200" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-primary-100">Today's Date</p>
                  <p className="text-sm sm:text-base font-semibold">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Dashboard content */}
      <div className="container mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:gap-8">
          {/* Counter Section */}
          <motion.section 
            variants={itemVariants}
            className="col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 overflow-hidden"
          >
            <CounterParent />
          </motion.section>
          
          {/* Two-column layout for other content */}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 sm:gap-8">
            {/* Recent Announcements Section */}
            <motion.section variants={itemVariants}>
              <RecentAnnouncements 
                limit={3} 
                showViewAll={true}
                onViewAllClick={() => console.log("Navigate to all announcements page")}
              />
            </motion.section>
          </div>
          
          {/* Child Performance Summary */}
          <motion.section 
            variants={itemVariants}
            className="col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Child's Performance Summary</h2>
              <button className="text-primary-600 dark:text-primary-400 flex items-center text-sm font-medium">
                View details <ArrowRight className="ml-1 h-4 w-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Attendance */}
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-gray-700 dark:text-gray-200 font-medium">Attendance</h3>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full dark:bg-green-900/30 dark:text-green-300">Good</span>
                </div>
                <div className="flex items-end">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">92%</span>
                  <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm">Present rate</span>
                </div>
              </div>
              
              {/* Grades */}
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-gray-700 dark:text-gray-200 font-medium">Average Grade</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full dark:bg-blue-900/30 dark:text-blue-300">Good</span>
                </div>
                <div className="flex items-end">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">B+</span>
                  <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm">Across subjects</span>
                </div>
              </div>
              
              {/* Upcoming Tests */}
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-gray-700 dark:text-gray-200 font-medium">Upcoming Tests</h3>
                </div>
                <div className="flex items-end">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">3</span>
                  <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm">This week</span>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Free Classes Section */}
          <motion.section 
            variants={itemVariants}
            className="col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden"
          >
            <FreeClasses />
          </motion.section>
        </div>
      </div>
    </motion.div>
  );
};

export default ParentDashboardMain; 