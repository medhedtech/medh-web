"use client";
import React from "react";
import MobileAccordion from "./MobileAccordion";
import Image from "next/image";
import megamenu2 from "@/assets/images/mega/mega_menu_1.png";
import Link from "next/link";

/**
 * AccordionCourses Component
 * 
 * Provides the mobile version of course navigation items,
 * matching the structure and content of the desktop DropdownCourses component.
 */
const AccordionCourses = () => {
  // Using the same course listings as in DropdownCourses.js
  const items = [
    {
      name: "AI and Data science",
      path: "/ai-and-data-science-course",
    },
        {
          name: "Personality development",
          path: "/personality-development-course",
        },
        {
          name: "Vedic Mathematics",
          path: "/vedic-mathematics-course",
        },
        {
          name: "Digital Marketing with Data Analytics",
          path: "/digital-marketing-with-data-analytics-course",
        },
        {
          name: "View All Courses",
      path: "/courses",
      status: "new",
    },
  ];

  return (
    <div className="space-y-2">
      {/* Course navigation accordion */}
      <MobileAccordion items={items}>
        {/* Featured course/promo image */}
        <div className="mt-4 rounded-lg overflow-hidden">
          <Link href="/courses/featured" className="block">
            <Image 
              className="w-full h-auto rounded-lg transform transition-transform hover:scale-105 duration-300" 
              src={megamenu2} 
              alt="Featured Courses" 
              placeholder="blur"
            />
          </Link>
          <div className="mt-2 px-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Discover our most popular courses and start your learning journey today.
            </p>
          </div>
        </div>
      </MobileAccordion>
      
      {/* Quick links for mobile */}
      <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-3">
        <div className="flex justify-between px-2">
          <Link 
            href="/courses/new" 
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            New Courses
          </Link>
          <Link 
            href="/courses?sort=popular" 
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            Popular Courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccordionCourses;
