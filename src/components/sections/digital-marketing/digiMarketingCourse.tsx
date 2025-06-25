"use client";
import React from "react";
import CoursesFilter from "../courses/CoursesFilter";
import Link from "next/link";
import { BarChart2, Globe } from "lucide-react";

const DigiMarketingCourse: React.FC = () => {
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
            TRANSFORM MARKETING INSIGHTS POWERFULLY
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
      <div className="w-full">
        {customHeader}
        
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="courses-filter-4-col-override">
            <CoursesFilter
              key="digital-marketing"
              CustomText="Digital Marketing with Data Analytics Courses"
              CustomButton={() => (
                <Link href="/courses">
                  <div className="inline-flex items-center px-4 md:px-6 py-2.5 md:py-3 bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600 text-white text-xs md:text-sm font-medium rounded-lg md:rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95">
                    <BarChart2 className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                    <span>Explore All Courses</span>
                  </div>
                </Link>
              )}
              fixedCategory="Digital Marketing with Data Analytics"
              hideCategoryFilter={true}
              hideSearch={true}
              hideSortOptions={true}
              hideFilterBar={true}
              hideHeader={true}
              gridColumns={4}
              itemsPerPage={16}
              simplePagination={true}
              scrollToTop={true}
              description="Master the art of digital marketing with our comprehensive courses combining modern marketing techniques with data analytics."
              customGridClassName="!grid !gap-4 !grid-cols-1 sm:!grid-cols-2 md:!grid-cols-3 lg:!grid-cols-4"
              customGridStyle={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem',
                width: '100%',
                margin: '0 auto'
              }}
              emptyStateContent={
                <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mx-2">
                  <div className="flex flex-col items-center justify-center min-h-[20vh] md:min-h-[30vh] text-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-rose-50 dark:bg-rose-900/20 mb-3 md:mb-4">
                      <BarChart2 className="w-6 h-6 md:w-8 md:h-8 text-rose-500 dark:text-rose-400" />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Coming Soon
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-md">
                      We're currently developing cutting-edge Digital Marketing courses. Check back soon for industry-leading content!
                    </p>
                  </div>
                </div>
              }
              activeTab="live"
            />
          </div>
          
          <style jsx>{`
            .courses-filter-4-col-override :global(.grid) {
              grid-template-columns: repeat(1, minmax(0, 1fr));
              width: 100%;
              padding: 1rem;
              margin: 0 auto;
              max-width: 1440px;
              gap: 1rem;
            }
            
            .courses-filter-4-col-override :global(.container) {
              max-width: 1440px;
              padding: 0 1rem;
              margin: 0 auto;
              width: 100%;
            }
            
            .courses-filter-4-col-override :global(.max-w-full),
            .courses-filter-4-col-override :global(.max-w-6xl),
            .courses-filter-4-col-override :global(.max-w-7xl) {
              max-width: 1440px !important;
              margin: 0 auto;
            }
            
            @media (min-width: 640px) {
              .courses-filter-4-col-override :global(.grid) {
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 1rem;
                padding: 1rem;
              }
            }
            
            @media (min-width: 768px) {
              .courses-filter-4-col-override :global(.grid) {
                grid-template-columns: repeat(3, minmax(0, 1fr));
                gap: 1rem;
                padding: 1.5rem;
              }
            }
            
            @media (min-width: 1024px) {
              .courses-filter-4-col-override :global(.grid) {
                grid-template-columns: repeat(4, minmax(0, 1fr));
                gap: 1rem;
                padding: 2rem;
              }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default DigiMarketingCourse; 