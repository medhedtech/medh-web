"use client";

import React, { useState } from "react";
import CoursesFilter from "../courses/CoursesFilter";
import Link from "next/link";
import { Calculator, Sparkles, Brain } from "lucide-react";

function VedicCource() {
  // Define view settings with mobile-first approach
  const [viewSettings] = useState({
    gridColumns: {
      mobile: 1,
      tablet: 2,
      desktop: 4
    },
    showFilters: false,
    itemsPerPage: {
      mobile: 4,
      tablet: 6,
      desktop: 8
    },
    spacing: {
      mobile: 'gap-4',
      tablet: 'gap-6',
      desktop: 'gap-8'
    }
  });

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Define the grades for Vedic Mathematics courses
  const grades = [
    "Preschool",
    "Grade 1-2",
    "Grade 3-4",
    "Grade 5-6",
    "Grade 7-8",
    "Grade 9-10",
    "Grade 11-12",
    "UG/Grad/Pro",
  ];

  // Custom header content with improved mobile styling
  const customHeader = (
    <div className="relative text-center px-4 md:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/30 to-transparent dark:from-indigo-900/10" />
      </div>

      {/* Content */}
      <div className="relative space-y-4 md:space-y-6 py-6 md:py-8 lg:py-10">
        {/* Badge */}
        <div className="inline-flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs md:text-sm font-medium">
            <Brain className="w-3 h-3 md:w-4 md:h-4" />
            Ancient Wisdom
          </span>
        </div>

        {/* Main Heading */}
        <div className="space-y-2 md:space-y-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            CONQUER MATH CHALLENGES CREATIVELY
          </h1>
          
          <div className="flex items-center justify-center gap-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
            <span className="text-gray-900 dark:text-white">with</span>
            <span className="text-medhgreen dark:text-medhgreen bg-gradient-to-r from-indigo-50/10 to-transparent px-2 py-1 rounded">MEDH</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Transform Mathematical Understanding through Ancient Wisdom and Modern Techniques.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6 md:py-12">
        {customHeader}
        
        <div className="mt-6 md:mt-8 lg:mt-12">
          <CoursesFilter
            key="vedic-mathematics"
            CustomText="Vedic Mathematics Courses"
            CustomButton={
              <Link href="/courses">
                <div className="inline-flex items-center px-4 md:px-6 py-2.5 md:py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white text-xs md:text-sm font-medium rounded-lg md:rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95">
                  <Calculator className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                  <span>Explore All Courses</span>
                </div>
              </Link>
            }
            fixedCategory="Vedic Mathematics"
            hideCategories={true}
            hideSearch={true}
            hideSortOptions={true}
            hideFilterBar={true}
            hideViewModeSwitch={true}
            hideHeader={true}
            forceViewMode="grid"
            gridColumns={viewSettings.gridColumns}
            itemsPerPage={viewSettings.itemsPerPage}
            simplePagination={true}
            scrollToTop={handleScrollToTop}
            description="Discover the ancient wisdom of Vedic Mathematics through our comprehensive courses designed for all age groups and skill levels."
            customGridClassName={`grid ${viewSettings.spacing.mobile} sm:${viewSettings.spacing.tablet} lg:${viewSettings.spacing.desktop}`}
            customGridStyle={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              width: '100%'
            }}
            emptyStateContent={
              <div className="flex flex-col items-center justify-center min-h-[20vh] md:min-h-[30vh] text-center p-4 md:p-8 bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mx-4 md:mx-0">
                <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/20 mb-3 md:mb-4">
                  <Calculator className="w-6 h-6 md:w-8 md:h-8 text-indigo-500 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Coming Soon
                </h3>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-md px-4 md:px-0">
                  We're currently developing innovative Vedic Mathematics courses. Check back soon for a transformative learning experience!
                </p>
              </div>
            }
            activeTab="blended"
          />
        </div>
      </div>
    </div>
  );
}

export default VedicCource;
