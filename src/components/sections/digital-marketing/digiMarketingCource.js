"use client";

import React, { useState } from "react";
import CoursesFilter from "../courses/CoursesFilter";
import Link from "next/link";
import { BarChart2, Sparkles, Globe } from "lucide-react";

function DigiMarketingCource() {
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

  // Custom header content with improved mobile styling
  const customHeader = (
    <div className="relative text-center px-4 md:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-50/30 to-transparent dark:from-rose-900/10" />
      </div>

      {/* Content */}
      <div className="relative space-y-4 md:space-y-6 py-6 md:py-8 lg:py-10">
        {/* Badge */}
        <div className="inline-flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-xs md:text-sm font-medium">
            <Globe className="w-3 h-3 md:w-4 md:h-4" />
            Digital Skills
          </span>
        </div>

        {/* Main Heading */}
        <div className="space-y-2 md:space-y-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            MASTER DIGITAL MARKETING STRATEGIES
          </h1>
          
          <div className="flex items-center justify-center gap-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
            <span className="text-gray-900 dark:text-white">with</span>
            <span className="text-medhgreen dark:text-medhgreen bg-gradient-to-r from-rose-50/10 to-transparent px-2 py-1 rounded">MEDH</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Integrate Advanced Analytics with Powerful Marketing Techniques for Success
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
            key="digital-marketing"
            CustomText="Digital Marketing with Data Analytics Courses"
            CustomButton={
              <Link href="/courses">
                <div className="inline-flex items-center px-4 md:px-6 py-2.5 md:py-3 bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600 text-white text-xs md:text-sm font-medium rounded-lg md:rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95">
                  <BarChart2 className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                  <span>Explore All Courses</span>
                </div>
              </Link>
            }
            fixedCategory="Digital Marketing with Data Analytics"
            hideCategoryFilter={true}
            hideSearch={true}
            hideSortOptions={true}
            hideFilterBar={true}
            hideHeader={true}
            gridColumns={4}
            itemsPerPage={12}
            simplePagination={true}
            scrollToTop={true}
            description="Master the art of digital marketing with our comprehensive courses combining modern marketing techniques with data analytics."
            customGridClassName="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4"
            customGridStyle={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              width: '100%'
            }}
            emptyStateContent={
              <div className="flex flex-col items-center justify-center min-h-[20vh] md:min-h-[30vh] text-center p-4 md:p-8 bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mx-4 md:mx-0">
                <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-rose-50 dark:bg-rose-900/20 mb-3 md:mb-4">
                  <BarChart2 className="w-6 h-6 md:w-8 md:h-8 text-rose-500 dark:text-rose-400" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Coming Soon
                </h3>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-md px-4 md:px-0">
                  We're currently developing cutting-edge Digital Marketing courses. Check back soon for industry-leading content!
                </p>
              </div>
            }
            activeTab="live"
          />
        </div>
      </div>
    </div>
  );
}

export default DigiMarketingCource;
