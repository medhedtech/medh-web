"use client";
import React, { useState } from "react";
import CoursesFilter from "../courses/CoursesFilter";
import { Zap, Sparkles } from "lucide-react";
import Link from "next/link";

function CourseOptions() {
  // Define view settings
  const [viewSettings] = useState({
    gridColumns: 4,
    showFilters: false,
    itemsPerPage: 8
  });

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

  // Custom header content
  const customHeader = (
    <div className="text-center mb-8">
      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-3">
        <Sparkles className="w-4 h-4" />
        Future-Ready Skills
      </span>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        AI and Data Science Courses
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
        Master the future of technology with our comprehensive AI and Data Science courses. From machine learning to data analytics, our programs are designed to help you excel in the digital age.
      </p>
    </div>
  );

  // Custom course grid styling
  const customGridStyle = {
    gridTemplateColumns: `repeat(${viewSettings.gridColumns}, minmax(0, 1fr))`,
  };

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {customHeader}
        
        <CoursesFilter
          key="ai-and-data-science"
          CustomText="AI and Data Science Courses"
          CustomButton={
            <Link href="/courses">
              <div className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 text-white text-sm font-medium rounded-xl transition-colors shadow-sm hover:shadow-md">
                Explore All Courses
              </div>
            </Link>
          }
          // Force filter to only show AI courses
          fixedCategory="AI and Data Science"
          // Hide all filter UI components
          hideCategoryFilter={true}
          hideSearch={true}
          hideSortOptions={true}
          hideFilterBar={true}
          hideViewModeSwitch={true}
          hideHeader={true}
          // Fix view mode to grid with 4 columns
          forceViewMode="grid"
          gridColumns={viewSettings.gridColumns}
          // Limit courses shown per page
          itemsPerPage={viewSettings.itemsPerPage}
          // Minimize pagination
          simplePagination={true}
          // Description for SEO/accessibility
          description="Master the future of technology with our comprehensive AI and Data Science courses."
          // Custom empty state
          emptyStateContent={emptyStateContent}
          // Custom styling
          customGridClassName="grid gap-6 sm:gap-8"
          // Pass custom style object
          customGridStyle={customGridStyle}
        />
      </div>
    </div>
  );
}

export default CourseOptions;
