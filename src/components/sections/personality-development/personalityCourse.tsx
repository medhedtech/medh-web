"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import CoursesFilter from "../courses/CoursesFilter";
import Link from "next/link";
import { BookOpen, Sparkles, Users } from "lucide-react";
import MedhLogo from "@/assets/images/logo/medh.png";
import { useWindowSize } from '@/components/sections/courses/CoursesFilter';

// TypeScript Interfaces
interface IViewSettings {
  gridColumns: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  showFilters: boolean;
  itemsPerPage: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  spacing: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
}

interface IPersonalityCourseProps {
  className?: string;
}

const PersonalityCourse: React.FC<IPersonalityCourseProps> = ({
  className = ""
}) => {
  // Define view settings with mobile-first approach
  const [viewSettings] = useState<IViewSettings>({
    gridColumns: {
      mobile: 1,
      tablet: 2,
      desktop: 4
    },
    showFilters: true,
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

  const handleScrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add this useEffect to open the grade filter dropdown by default
  useEffect(() => {
    const gradeDropdown = document.querySelector('[data-testid="grade-filter-dropdown"]');
    if (gradeDropdown && typeof window !== 'undefined') {
      // Simulate a click to open the dropdown if needed
      gradeDropdown.dispatchEvent(new Event('click', { bubbles: true }));
    }
  }, []);

  // Define the grades for personality development courses
  const grades: string[] = [
    "Preschool",
    "Grade 1-2",
    "Grade 3-4",
    "Grade 5-6",
    "Grade 7-8",
    "Grade 9-10",
    "Grade 11-12",
    "UG - Graduate - Professionals",
  ];

  // Custom button component
  const CustomButtonComponent = () => (
    <button className="inline-flex items-center px-4 md:px-6 py-2.5 md:py-3 bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 text-white text-xs md:text-sm font-medium rounded-lg md:rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95">
      <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2" />
      <span>Explore All Courses</span>
    </button>
  );

  const customHeader = (
    <div className="w-full text-center">
      <div className="relative space-y-4 md:space-y-6 py-6 md:py-8 lg:py-10">
        {/* Badge */}
        <div className="inline-flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs md:text-sm font-medium">
            <Users className="w-3 h-3 md:w-4 md:h-4" />
            Personal Growth
          </span>
        </div>

        {/* Main Heading */}
        <div className="space-y-2 md:space-y-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            Elevate Your Inner Potential
          </h1>
        </div>

        {/* Description */}
        <p className="text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Personalized Growth Strategies Designed for Students, Professionals, and Homemakers.
        </p>
      </div>
    </div>
  );

  const { width } = useWindowSize();
  const isMobile = width < 768;

  return (
    <div id="course-options-section" className="min-h-[80vh] bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {customHeader}
      <div className="w-full px-0">
        <CoursesFilter
          key="personality-development"
          CustomText="Personality Development Courses"
          CustomButton={CustomButtonComponent}
          fixedCategory="Personality Development"
          hideCategoryFilter={true}
          hideCategories={true}
          hideSearch={true}
          hideSortOptions={true}
          hideHeader={true}
          hideFilterBar={!isMobile}
          hideGradeFilter={false}
          gridColumns={3}
          itemsPerPage={8}
          simplePagination={true}
          scrollToTop={true}
          description="Enhance your personal growth with our comprehensive personality development programs tailored for all ages."
          customGridClassName="grid gap-4 sm:gap-6 lg:gap-8 w-full"
          customGridStyle={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            width: '100%',
            maxWidth: '100%'
          }}
          emptyStateContent={
            <div className="flex flex-col items-center justify-center min-h-[20vh] md:min-h-[30vh] text-center p-4 md:p-8 bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/20 mb-3 md:mb-4">
                <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-primary-500 dark:text-primary-400" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Coming Soon
              </h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-md">
                We're currently crafting exceptional personality development courses. Check back soon for transformative learning experiences!"
              </p>
            </div>
          }
          {...(isMobile && {
            liveCoursesOptions: undefined,
            blendedLearningOptions: undefined,
            freeCoursesOptions: undefined,
          })}
        />
      </div>
    </div>
  );
};

export default PersonalityCourse; 