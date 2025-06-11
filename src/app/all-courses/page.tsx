'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock } from 'lucide-react';
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import ThemeController from "@/components/shared/others/ThemeController";
import CoursesFilter from "@/components/sections/courses/CoursesFilter";

const AllCoursesPage: React.FC = () => {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Custom header content
  const customHeader = (
    <div className="relative text-center px-4 md:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/30 to-transparent dark:from-primary-900/10" />
      </div>

      {/* Content */}
      <div className="relative space-y-4 md:space-y-6 py-6 md:py-8 lg:py-10">
        {/* Badge */}
        <div className="inline-flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs md:text-sm font-medium">
            <BookOpen className="w-3 h-3 md:w-4 md:h-4" />
            All Courses
          </span>
        </div>

        {/* Main Heading */}
        <div className="space-y-2 md:space-y-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            DISCOVER YOUR PERFECT COURSE
          </h1>
          
          <div className="flex items-center justify-center gap-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
            <span className="text-gray-900 dark:text-white">with</span>
            <span className="text-medhgreen dark:text-medhgreen bg-gradient-to-r from-medhgreen/10 to-transparent px-2 py-1 rounded">MEDH</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-lg mx-auto mt-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 mx-auto mb-1 md:mb-2 rounded-full bg-primary-100 dark:bg-primary-900/30">
              <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">50+</div>
            <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Courses</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 mx-auto mb-1 md:mb-2 rounded-full bg-primary-100 dark:bg-primary-900/30">
              <Clock className="w-4 h-4 md:w-5 md:h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">24/7</div>
            <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Support</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-6 md:py-12">
          {customHeader}
          
          <div className="mt-6 md:mt-8 lg:mt-12">
            <CoursesFilter
              key="all-courses"
              CustomText="All Courses"
              hideCategories={false}
              hideSearch={false}
              hideSortOptions={false}
              hideHeader={true}
              gridColumns={4}
              itemsPerPage={12}
              simplePagination={false}
              description="Browse through our extensive collection of courses across various categories and skill levels."
              customGridClassName="grid gap-4 sm:gap-6 lg:gap-8 xl:gap-6 2xl:gap-8"
              customGridStyle={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                width: '100%',
                maxWidth: 'none'
              }}
              emptyStateContent={
                <div className="flex flex-col items-center justify-center min-h-[30vh] text-center p-8 bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/20 mb-4">
                    <BookOpen className="w-8 h-8 text-primary-500 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No Courses Found
                  </h3>
                  <p className="text-base text-gray-600 dark:text-gray-400 max-w-md">
                    We couldn't find any courses matching your criteria. Try adjusting your filters or search terms.
                  </p>
                </div>
              }
            />
          </div>
        </div>
        
        {/* Theme Controller */}
        <div className="fixed bottom-4 right-4 z-50">
          <ThemeController />
        </div>
      </div>
    </PageWrapper>
  );
};

export default AllCoursesPage; 