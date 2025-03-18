"use client";
import React, { useState, useEffect } from "react";
import CoursesFilter from "../courses/CoursesFilter";
import { Zap, Sparkles } from "lucide-react";
import Link from "next/link";

function CourseOptions() {
  // State for tracking screen size
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [gridColumns, setGridColumns] = useState(1); // Default to mobile-safe value
  
  // Check for screen size on client-side only
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
      
      // Update grid columns based on screen size
      if (window.innerWidth < 768) {
        setGridColumns(1); // Mobile: 1 column
      } else if (window.innerWidth < 1024) {
        setGridColumns(2); // Tablet: 2 columns
      } else {
        setGridColumns(4); // Desktop: 4 columns
      }
    };
    
    // Initial check
    checkScreenSize();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Define view settings
  const [viewSettings] = useState({
    showFilters: false,
    itemsPerPage: 8
  });

  // Custom empty state content
  const emptyStateContent = (
    <div className="flex flex-col items-center justify-center min-h-[30vh] text-center p-4 md:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/20 mb-3 md:mb-4">
        <Zap size={isMobile ? 20 : 24} className="text-primary-500 dark:text-primary-400" />
      </div>
      <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">
        No courses available yet
      </h3>
      <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-md">
        We're currently working on bringing you the best AI and Data Science courses. Check back soon!
      </p>
    </div>
  );

  // Custom header content
  const customHeader = (
    <div className="text-center mb-6 md:mb-8 px-2 pb-10">
      <span className="inline-flex items-center gap-1 md:gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs md:text-sm font-medium mb-2 md:mb-3">
        <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
        Future-Ready Skills
      </span>
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white pb-2 ">
       TRANSFORM TECH INSIGHTS POWERFULLY 
      </h2>
      <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">with</span>
      <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-medhgreen dark:text-medhgreen"> MEDH</span>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto pt-5">
        Comprehensive Learning Path to Master Cutting-Edge Technology and Analytics
      </p>
    </div>
  );

  // Safe grid style that works with SSR
  const customGridStyle = {
    gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
  };

  return (
    <div className="py-2 md:py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-3 md:px-4">
        {customHeader}
        
        <CoursesFilter
          key="ai-and-data-science"
          CustomText="AI and Data Science Courses"
          CustomButton={
            <Link href="/courses">
              <div className="inline-flex items-center py-2 md:px-6 md:py-3 bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 text-white text-xs md:text-sm font-medium rounded-lg md:rounded-xl transition-colors shadow-sm hover:shadow-md">
                Explore All Courses
              </div>
            </Link>
          }
          // Force filter to only show AI courses
          fixedCategory="AI and Data Science"
          // Hide all filter UI components
          hideCategoryFilter={true}
          hideSearch={true}
          hideGradeFilter={false}
          hideSortOptions={true}
          hideFilterBar={true}
          hideViewModeSwitch={true}
          hideHeader={true}
          hideDescription={true}
          // Fix view mode to grid with responsive columns
          forceViewMode="grid"
          gridColumns={gridColumns}
          // Limit courses shown per page
          itemsPerPage={viewSettings.itemsPerPage}
          // Minimize pagination
          simplePagination={true}
          // Remove description as requested
          description=""
          // Custom empty state
          emptyStateContent={emptyStateContent}
          // Custom styling with improved mobile support
          customGridClassName="grid gap-4 md:gap-4 lg:gap-4"
          // Pass custom style object
          customGridStyle={customGridStyle}
        />
      </div>
    </div>
  );
}

export default CourseOptions;
