"use client";
import React, { useState } from "react";
import CoursesFilter from "../courses/CoursesFilter";
import { Zap, Sparkles, Brain } from "lucide-react";
import Link from "next/link";
import Image from 'next/image';

const CourseOptions: React.FC = () => {

  // Define the specializations for AI and Data Science courses
  const specializations = [
    "Machine Learning Fundamentals",
    "Deep Learning & Neural Networks", 
    "Data Analysis & Visualization",
    "Natural Language Processing",
    "Computer Vision",
    "Big Data & Analytics",
    "AI Strategy & Ethics",
    "Predictive Analytics"
  ];

  // Custom header content with improved mobile styling
  const customHeader = (
    <div className="relative text-center px-4 md:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 to-transparent dark:from-blue-900/10" />
      </div>

      {/* Content */}
      <div className="relative space-y-4 md:space-y-6 py-6 md:py-8 lg:py-10">
        {/* Badge */}
        <div className="inline-flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs md:text-sm font-medium">
            <Brain className="w-3 h-3 md:w-4 md:h-4" />
            Future-Ready Skills
          </span>
        </div>

        {/* Main Heading */}
        <div className="space-y-2 md:space-y-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            Transform Tech Insights Powerfully
          </h1>
          
          <div className="flex items-center justify-center gap-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
            <span className="text-gray-900 dark:text-white">with</span>
            <span className="inline-flex items-center">
              <Image src={require('@/assets/images/logo/medh.png')} alt="Medh Logo" className="h-6 md:h-[2.25rem] w-auto object-contain inline-block align-middle" />
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Comprehensive Learning Path to Master Cutting-Edge Technology and Analytics
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Global styles for the course grid */}
      <style jsx global>{`
        .courses-filter-optimized-layout .course-grid {
          display: grid !important;
          width: 100% !important;
          margin: 0 auto !important;
          padding: 1.5rem !important;
          gap: 1.5rem !important;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
          place-items: center !important;
          justify-content: center !important;
          max-width: 1600px !important;
        }
        
        .courses-filter-optimized-layout .course-card {
          width: 100% !important;
          max-width: 340px !important;
          min-width: 280px !important;
          display: flex !important;
          flex-direction: column !important;
        }

        .courses-filter-optimized-layout .course-card:hover {
          transform: translateY(-4px) scale(1.02) !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        /* Mobile: Single column, compact cards */
        @media (max-width: 639px) {
          .courses-filter-optimized-layout .course-grid {
            grid-template-columns: 1fr !important;
            padding: 1rem !important;
            gap: 1rem !important;
          }
          
          .courses-filter-optimized-layout .course-card {
            max-width: 100% !important;
          }
        }
        
        /* Small tablets: 2 columns */
        @media (min-width: 640px) and (max-width: 1023px) {
          .courses-filter-optimized-layout .course-grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
            padding: 1.75rem !important;
            gap: 1.75rem !important;
          }
          
          .courses-filter-optimized-layout .course-card {
            max-width: 320px !important;
          }
        }
        
        /* Large tablets/small desktops: 3 columns */
        @media (min-width: 1024px) and (max-width: 1279px) {
          .courses-filter-optimized-layout .course-grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
            padding: 2rem !important;
            gap: 2rem !important;
          }
          
          .courses-filter-optimized-layout .course-card {
            max-width: 320px !important;
          }
        }
        
        /* Desktop: 4 columns */
        @media (min-width: 1280px) {
          .courses-filter-optimized-layout .course-grid {
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)) !important;
            padding: 2.5rem !important;
            gap: 2.5rem !important;
          }
          
          .courses-filter-optimized-layout .course-card {
            min-width: 300px !important;
            max-width: 340px !important;
          }
        }
        
        /* Large desktop: Maintain 4 columns with better spacing */
        @media (min-width: 1440px) {
          .courses-filter-optimized-layout .course-grid {
            grid-template-columns: repeat(4, minmax(320px, 1fr)) !important;
            padding: 3rem !important;
            gap: 3rem !important;
          }
          
          .courses-filter-optimized-layout .course-card {
            min-width: 320px !important;
            max-width: 360px !important;
          }
        }

        /* Ultra-wide screens: Cap at 5 columns */
        @media (min-width: 1920px) {
          .courses-filter-optimized-layout .course-grid {
            grid-template-columns: repeat(5, minmax(320px, 1fr)) !important;
            max-width: 1800px !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="w-full">
          {customHeader}
          
          <div className="w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8">
            <div className="courses-filter-optimized-layout">
              <CoursesFilter
                key="ai-and-data-science"
                CustomText="AI and Data Science Courses"
                CustomButton={() => (
                  <Link href="/courses">
                    <div className="inline-flex items-center px-4 md:px-6 py-2.5 md:py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white text-xs md:text-sm font-medium rounded-lg md:rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95">
                      <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                      <span>Explore All Courses</span>
                    </div>
                  </Link>
                )}
                fixedCategory="AI and Data Science"
                hideCategoryFilter={true}
                hideSearch={true}
                hideSortOptions={true}
                hideFilterBar={true}
                hideHeader={true}
                hideGradeFilter={true}
                gridColumns={4}
                itemsPerPage={16}
                simplePagination={true}
                scrollToTop={true}
                description="Master artificial intelligence and data science with our comprehensive courses combining cutting-edge technology with practical applications."
                customGridClassName="course-grid"
                customGridStyle={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1.5rem',
                  width: '100%',
                  margin: '0 auto',
                  padding: '1.5rem',
                  placeItems: 'center',
                  justifyContent: 'center',
                  maxWidth: '1600px'
                }}
                emptyStateContent={
                  <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mx-2 w-full max-w-md">
                    <div className="flex flex-col items-center justify-center min-h-[20vh] md:min-h-[30vh] text-center">
                      <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20 mb-3 md:mb-4">
                        <Brain className="w-6 h-6 md:w-8 md:h-8 text-blue-500 dark:text-blue-400" />
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Coming Soon
                      </h3>
                      <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-md">
                        We're currently developing cutting-edge AI and Data Science courses. Check back soon for industry-leading content!
                      </p>
                    </div>
                  </div>
                }
                activeTab="live"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseOptions; 