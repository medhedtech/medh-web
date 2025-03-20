'use client'
import LessonAccordion from "@/components/shared/lessons/LessonAccordion";
import React, { useState } from "react";
import { ChevronUp, ExternalLink } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const LessonCourseMaterialsPrimary = () => {
  const [contentOpen, setContentOpen] = useState(true);

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Course Content Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              {/* Course Content Header */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center px-4 py-3">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Course content</h2>
                  <button 
                    onClick={() => setContentOpen(!contentOpen)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <ChevronUp className={`w-5 h-5 transform transition-transform ${contentOpen ? "" : "rotate-180"}`} />
                  </button>
                </div>
              </div>
              
              {/* Course Content Body */}
              <AnimatePresence>
                {contentOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <LessonAccordion />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Course Overview
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Welcome to this comprehensive course! Here you'll find all the resources and materials needed for successful completion of the course.
                </p>
              </div>
              
              {/* Course Navigation Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="flex space-x-8 overflow-x-auto pb-1">
                  <Link href="#" className="border-b-2 border-primaryColor py-4 px-1 text-sm font-medium text-primaryColor whitespace-nowrap">
                    Overview
                  </Link>
                  <Link href="#" className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 whitespace-nowrap">
                    Notes
                  </Link>
                  <Link href="#" className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 whitespace-nowrap">
                    Announcements
                  </Link>
                  <Link href="#" className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 whitespace-nowrap">
                    Reviews
                  </Link>
                  <Link href="#" className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 whitespace-nowrap">
                    Learning tools
                  </Link>
                </nav>
              </div>
              
              {/* Course Description */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Use our recommended best practices to plan, produce, and publish a well-designed, high quality course
                </h2>
                
                <div className="flex flex-wrap gap-6 mb-6">
                  <div className="flex items-center">
                    <div className="flex items-center text-yellow-400">
                      <span className="text-lg font-bold mr-1">4.6</span>
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">(6,883 ratings)</span>
                  </div>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">237,486</span> Students
                  </div>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">1.5 hours</span> total
                  </div>
                </div>
                
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Last updated January 2022
                </div>
                
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-8">
                  <span>English</span>
                  <span className="mx-2">•</span>
                  <span>English, Dutch [Auto]</span>
                  <Link href="#" className="ml-2 text-primaryColor hover:underline">
                    5 more
                  </Link>
                </div>

                {/* Get Started Button */}
                <div className="mb-8">
                  <Link
                    href="/lessons/1"
                    className="inline-flex items-center px-6 py-3 bg-primaryColor hover:bg-primaryColor/90 text-white font-medium rounded-md transition-colors"
                  >
                    Start first lesson
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </Link>
                </div>
                
                {/* Course Description Content */}
                <div className="prose prose-sm md:prose-base max-w-none text-gray-700 dark:text-gray-300">
                  <p className="mb-4">
                    This course will guide you through the process of creating a high-quality online course that engages students and meets their learning needs.
                  </p>
                  
                  <p className="mb-4">
                    Whether you're an experienced instructor or creating your first course, you'll learn proven strategies to plan your content, create engaging video lectures, develop meaningful assignments, and build a course that students love.
                  </p>
                  
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-6 mb-3">What you'll learn:</h3>
                  
                  <ul className="list-disc pl-5 space-y-2 mb-6">
                    <li>How to plan and structure your course content effectively</li>
                    <li>Techniques for creating engaging video lessons</li>
                    <li>Best practices for designing meaningful assignments and assessments</li>
                    <li>Tips for building an attractive course landing page</li>
                    <li>Strategies for launching and marketing your course</li>
                  </ul>
                  
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-6 mb-3">This course is perfect for:</h3>
                  
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Content creators looking to package their knowledge into a structured course</li>
                    <li>Subject matter experts who want to share their expertise</li>
                    <li>Teachers transitioning to online education</li>
                    <li>Anyone interested in creating professional, high-quality online courses</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LessonCourseMaterialsPrimary;
