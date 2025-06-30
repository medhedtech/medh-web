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

  // Custom header content with edge-to-edge styling
  const customHeader = (
    <div className="relative text-center w-full">
      {/* Background decoration - Full width */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 to-transparent dark:from-blue-900/10" />
      </div>

      {/* Content with controlled inner padding */}
      <div className="relative space-y-4 md:space-y-6 py-6 md:py-8 lg:py-10 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
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
      {/* Enhanced Global styles for edge-to-edge course grid */}
      <style jsx global>{`
        /* Edge-to-edge container */
        .courses-filter-edge-to-edge {
          width: 100vw !important;
          position: relative !important;
          left: 50% !important;
          right: 50% !important;
          margin-left: -50vw !important;
          margin-right: -50vw !important;
        }

        .courses-filter-edge-to-edge .course-grid {
          display: grid !important;
          width: 100% !important;
          margin: 0 !important;
          gap: 0.75rem !important;
          place-items: stretch !important;
          justify-content: stretch !important;
          padding: 0.75rem !important;
        }
        
        .courses-filter-edge-to-edge .course-card {
          width: 100% !important;
          height: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          min-width: 0 !important;
          max-width: none !important;
        }

        .courses-filter-edge-to-edge .course-card:hover {
          transform: translateY(-2px) scale(1.01) !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        /* Mobile: Single column edge-to-edge */
        @media (max-width: 479px) {
          .courses-filter-edge-to-edge .course-grid {
            grid-template-columns: 1fr !important;
            padding: 0.5rem !important;
            gap: 0.5rem !important;
          }
        }

        /* Mobile landscape: 2 columns */
        @media (min-width: 480px) and (max-width: 639px) {
          .courses-filter-edge-to-edge .course-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            padding: 0.75rem !important;
            gap: 0.75rem !important;
          }
        }
        
        /* Small tablets: 2-3 columns based on available space */
        @media (min-width: 640px) and (max-width: 767px) {
          .courses-filter-edge-to-edge .course-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            padding: 1rem !important;
            gap: 1rem !important;
          }
        }

        /* Tablets: 3 columns */
        @media (min-width: 768px) and (max-width: 1023px) {
          .courses-filter-edge-to-edge .course-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            padding: 1rem !important;
            gap: 1rem !important;
          }
        }
        
        /* Small laptops: 4 columns */
        @media (min-width: 1024px) and (max-width: 1279px) {
          .courses-filter-edge-to-edge .course-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            padding: 1.25rem !important;
            gap: 1.25rem !important;
          }
        }
        
        /* Desktop: 5 columns */
        @media (min-width: 1280px) and (max-width: 1535px) {
          .courses-filter-edge-to-edge .course-grid {
            grid-template-columns: repeat(5, 1fr) !important;
            padding: 1.5rem !important;
            gap: 1.5rem !important;
          }
        }
        
        /* Large desktop: 6 columns */
        @media (min-width: 1536px) and (max-width: 1919px) {
          .courses-filter-edge-to-edge .course-grid {
            grid-template-columns: repeat(6, 1fr) !important;
            padding: 1.75rem !important;
            gap: 1.75rem !important;
          }
        }

        /* Ultra-wide screens: 7-8 columns */
        @media (min-width: 1920px) and (max-width: 2559px) {
          .courses-filter-edge-to-edge .course-grid {
            grid-template-columns: repeat(7, 1fr) !important;
            padding: 2rem !important;
            gap: 2rem !important;
          }
        }

        /* 4K and beyond: 8+ columns */
        @media (min-width: 2560px) {
          .courses-filter-edge-to-edge .course-grid {
            grid-template-columns: repeat(8, 1fr) !important;
            padding: 2.5rem !important;
            gap: 2.5rem !important;
          }
        }

        /* Ensure cards fill the available space */
        .courses-filter-edge-to-edge .course-card > * {
          flex: 1 !important;
        }

        /* Optimize for foldable devices */
        @media (min-width: 600px) and (max-width: 900px) and (orientation: landscape) {
          .courses-filter-edge-to-edge .course-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            padding: 1rem !important;
            gap: 1rem !important;
          }
        }

        /* Optimize for tablet landscape */
        @media (min-width: 900px) and (max-width: 1200px) and (orientation: landscape) {
          .courses-filter-edge-to-edge .course-grid {
            grid-template-columns: repeat(5, 1fr) !important;
            padding: 1.25rem !important;
            gap: 1.25rem !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        {/* Header with controlled width */}
        <div className="w-full">
          {customHeader}
        </div>
        
        {/* Edge-to-edge course grid container */}
        <div className="courses-filter-edge-to-edge">
          <CoursesFilter
            key="ai-and-data-science-edge-to-edge"
            CustomText="AI and Data Science Courses"
            CustomButton={() => (
              <div className="flex justify-center w-full py-4">
                <Link href="/courses">
                  <div className="inline-flex items-center px-4 md:px-6 py-2.5 md:py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white text-xs md:text-sm font-medium rounded-lg md:rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95">
                    <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                    <span>Explore All Courses</span>
                  </div>
                </Link>
              </div>
            )}
            fixedCategory="AI and Data Science"
            hideCategoryFilter={true}
            hideSearch={true}
            hideSortOptions={true}
            hideFilterBar={true}
            hideHeader={true}
            hideGradeFilter={true}
            gridColumns={8} // Maximum columns for ultra-wide
            itemsPerPage={32} // Increased for edge-to-edge
            simplePagination={true}
            scrollToTop={true}
            description="Master artificial intelligence and data science with our comprehensive courses combining cutting-edge technology with practical applications."
            customGridClassName="course-grid"
            customGridStyle={{
              display: 'grid',
              width: '100%',
              margin: '0',
              padding: '1rem',
              gap: '1rem',
              placeItems: 'stretch',
              justifyContent: 'stretch'
            }}
            emptyStateContent={
              <div className="flex justify-center w-full py-8">
                <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 w-full max-w-md mx-4">
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
              </div>
            }
            activeTab="live"
          />
        </div>
      </div>
    </>
  );
};

export default CourseOptions; 