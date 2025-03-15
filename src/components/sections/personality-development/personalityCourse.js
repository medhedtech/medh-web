"use client";

import React, { useState } from "react";
import CoursesFilter from "../courses/CoursesFilter";
import Link from "next/link";
import { BookOpen, Sparkles, Users } from "lucide-react";

function PersonalityDevelopmentCourses() {
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

  // Define the grades for personality development courses
  const grades = [
    "Preschool",
    "Grade 1-2",
    "Grade 3-4",
    "Grade 5-6",
    "Grade 7-8",
    "Grade 9-10",
    "Grade 11-12",
    "UG - Graduate - Professionals",
  ];

  // Custom header content
  const customHeader = (
    <div className="text-center mb-8">
      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-3">
        <Users className="w-4 h-4" />
        Personal Growth
      </span>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Personality Development Courses
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
        Enhance your personal growth with our comprehensive personality development programs 
        tailored for all age groups, designed to build confidence, communication skills, and leadership ability.
      </p>
    </div>
  );

  // Custom course grid styling
  const customGridStyle = {
    gridTemplateColumns: `repeat(${viewSettings.gridColumns}, minmax(0, 1fr))`,
  };

  // Ensure consistent text alignment
  const customCardStyle = {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '100%'
  };

  // Custom empty state content
  const emptyStateContent = (
    <div className="flex flex-col items-center justify-center min-h-[30vh] text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/20 mb-4">
        <BookOpen size={24} className="text-primary-500 dark:text-primary-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        No courses available yet
      </h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-md">
        We're currently working on bringing you the best personality development courses. Check back soon!
      </p>
    </div>
  );

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {customHeader}
        
        <CoursesFilter
          key="personality-development"
          CustomText="Personality Development Courses"
          CustomButton={
            <Link href="/courses">
              <div className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 text-white text-sm font-medium rounded-xl transition-colors shadow-sm hover:shadow-md">
                <BookOpen className="w-4 h-4 mr-2" />
                Explore All Courses
              </div>
            </Link>
          }
          // Force filter to only show Personality Development courses
          fixedCategory="Personality Development"
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
          description="Enhance your personal growth with our comprehensive personality development programs tailored for all age groups."
          // Custom styling
          customGridClassName="grid gap-6 sm:gap-8"
          customGridStyle={customGridStyle}
          customCardStyle={customCardStyle}
          // Custom empty state
          emptyStateContent={emptyStateContent}
          // Theme
          activeTab="all"
        />
      </div>
    </div>
  );
}

export default PersonalityDevelopmentCourses;
