"use client";
import React from "react";
import CoursesFilter from "../courses/CoursesFilter";
import { Zap } from "lucide-react";

function CourseOptions() {
  // Add scroll to top functionality
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Define available grades for AI courses
  const grades = [
    "Grade 11-12",
    "UG/Grad/Pro"
  ];

  // Custom empty state content
  const emptyStateContent = (
    <div className="flex flex-col items-center justify-center min-h-[30vh] text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/20 mb-4">
        <Zap size={24} className="text-primary-500 dark:text-primary-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        No courses available yet
      </h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-md">
        We're currently working on bringing you the best AI and Data Science courses. Check back soon!
      </p>
    </div>
  );

  return (
    <CoursesFilter
      CustomText="TRANSFORM TECH INSIGHTS POWERFULLY with MEDH
"
      CustomButton={
        <div className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm hover:shadow-md">
          Explore All AI Courses
        </div>
      }
      // Force filter to only show AI courses
      fixedCategory="AI and Data Science"
      // Hide the category selection since we're only showing one category
      hideCategoryFilter={true}
      // Only show relevant grade levels
      availableCategories={grades}
      categoryTitle="Grade Level"
      // Add scroll to top functionality
      scrollToTop={handleScrollToTop}
      // Add a description for the courses section
      description="Master the future of technology with our comprehensive AI and Data Science courses. From machine learning to data analytics, our programs are designed to help you excel in the digital age."
      // Custom empty state
      emptyStateContent={emptyStateContent}
    />
  );
}

export default CourseOptions;
