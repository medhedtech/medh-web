"use client";

import React, { useState } from "react";
import CoursesFilter from "../courses/CoursesFilter";
import Link from "next/link";
import { BarChart2, Sparkles, Globe } from "lucide-react";

function DigiMarketingCource() {
  // Define view settings
  const [viewSettings] = useState({
    gridColumns: 4,
    showFilters: false,
    itemsPerPage: 8
  });

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Define the specializations for digital marketing courses
  const specializations = [
    "Digital Marketing Fundamentals",
    "Social Media Marketing",
    "SEO & Content Marketing",
    "Email Marketing",
    "PPC & Paid Advertising",
    "Analytics & Data Science",
    "Marketing Strategy",
    "E-commerce Marketing"
  ];

  // Custom header content
  const customHeader = (
    <div className="text-center mb-8">
      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-sm font-medium mb-3">
        <Globe className="w-4 h-4" />
        Digital Skills
      </span>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Digital Marketing & Data Analytics
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
        Master the art of digital marketing with our comprehensive courses combining modern marketing techniques 
        with data analytics. Learn to create, analyze, and optimize digital campaigns for maximum ROI.
      </p>
    </div>
  );

  // Custom course grid styling
  const customGridStyle = {
    gridTemplateColumns: `repeat(${viewSettings.gridColumns}, minmax(0, 1fr))`,
  };

  // Custom empty state content
  const emptyStateContent = (
    <div className="flex flex-col items-center justify-center min-h-[30vh] text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-rose-50 dark:bg-rose-900/20 mb-4">
        <BarChart2 size={24} className="text-rose-500 dark:text-rose-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        No courses available yet
      </h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-md">
        We're currently working on bringing you the best Digital Marketing courses. Check back soon!
      </p>
    </div>
  );

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {customHeader}
        
        <CoursesFilter
          key="digital-marketing"
          CustomText="Digital Marketing with Data Analytics Courses"
          CustomButton={
            <Link href="/courses">
              <div className="inline-flex items-center px-6 py-3 bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600 text-white text-sm font-medium rounded-xl transition-colors shadow-sm hover:shadow-md">
                <BarChart2 className="w-4 h-4 mr-2" />
                Explore All Courses
              </div>
            </Link>
          }
          // Force filter to only show Digital Marketing courses
          fixedCategory="Digital Marketing with Data Analytics"
          // Hide all filter UI components
          hideCategoryFilter={true}
          hideSearch={true}
          hideSortOptions={true}
          hideFilterBar={true}
          hideViewModeSwitch={true}
          hideHeader={true}
          // Fix view mode to grid
          forceViewMode="grid"
          gridColumns={viewSettings.gridColumns}
          // Pagination settings
          itemsPerPage={viewSettings.itemsPerPage}
          simplePagination={true}
          // Scroll behavior
          scrollToTop={handleScrollToTop}
          // Description for SEO/accessibility
          description="Master the art of digital marketing with our comprehensive courses combining modern marketing techniques with data analytics."
          // Custom styling
          customGridClassName="grid gap-6 sm:gap-8"
          customGridStyle={customGridStyle}
          // Custom empty state
          emptyStateContent={emptyStateContent}
          // Theme
          activeTab="live"
        />
      </div>
    </div>
  );
}

export default DigiMarketingCource;
