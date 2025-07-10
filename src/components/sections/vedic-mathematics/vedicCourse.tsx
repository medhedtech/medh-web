"use client";

import React, { useEffect } from "react";
import type { FC } from 'react';
import CoursesFilter from "../courses/CoursesFilter";
import { Calculator, Brain } from "lucide-react";
import Image from "next/image";
import MedhLogo from "@/assets/images/logo/medh.png";

interface IVedicCourseProps {
  className?: string;
}

// Custom button component to fix type error
const ExploreButton: FC = () => (
  <button className="inline-flex items-center px-4 md:px-6 py-2.5 md:py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white text-xs md:text-sm font-medium rounded-lg md:rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95">
    <Calculator className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2" />
    <span>Explore All Courses</span>
  </button>
);

const VedicCourse: FC<IVedicCourseProps> = ({
  className = ""
}) => {
  // Add this useEffect to open the grade filter dropdown by default
  useEffect(() => {
    const gradeDropdown = document.querySelector('[data-testid="grade-filter-dropdown"]');
    if (gradeDropdown && typeof window !== 'undefined') {
      gradeDropdown.dispatchEvent(new Event('click', { bubbles: true }));
    }
  }, []);

  const customHeader = (
    <div className="w-full text-center">
      <div className="relative space-y-4 md:space-y-6 pb-4 md:pb-6 lg:pb-8 pt-0">
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
            Conquer Math Challenges Creatively
          </h1>
          
          <div className="flex items-center justify-center gap-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
            <span className="text-gray-900 dark:text-white">with</span>
            <div className="flex items-center ml-1">
              <Image
                src={MedhLogo}
                alt="MEDH Logo"
                className="h-6 md:h-[2.25rem] w-auto object-contain inline-block align-middle"
                priority
              />
            </div>
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
    <div id="course-options-section" className="min-h-[80vh] bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="w-full">
        {customHeader}
        
        <div className="w-full">
          <CoursesFilter
            key="vedic-mathematics"
            CustomText="Vedic Mathematics Courses"
            CustomButton={ExploreButton}
            fixedCategory="Vedic Mathematics"
            hideCategoryFilter={false}
            hideCategories={true}
            hideSearch={false}
            hideSortOptions={false}
            hideHeader={true}
            hideGradeFilter={false}
            hideFilterBar={false}
            gridColumns={3}
            itemsPerPage={8}
            simplePagination={true}
            scrollToTop={true}
            description="Discover the ancient wisdom of Vedic Mathematics through our comprehensive courses designed for all age groups and skill levels."
            customGridClassName="grid gap-4 sm:gap-6 lg:gap-8 w-full"
            customGridStyle={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              width: '100%',
              maxWidth: '100%'
            }}
            emptyStateContent={
              <div className="flex flex-col items-center justify-center min-h-[20vh] md:min-h-[30vh] text-center p-4 md:p-8 bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/20 mb-3 md:mb-4">
                  <Calculator className="w-6 h-6 md:w-8 md:h-8 text-indigo-500 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Coming Soon
                </h3>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-md">
                  We're currently developing innovative Vedic Mathematics courses. Check back soon for a transformative learning experience!
                </p>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default VedicCourse; 