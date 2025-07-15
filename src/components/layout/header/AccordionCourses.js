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
      path: "/all-courses",
      status: "new",
    },
  ];

  return (
    <div className="space-y-2">
      {/* Course navigation accordion */}
      <MobileAccordion items={items}>
      </MobileAccordion>
    </div>
  );
};

export default AccordionCourses;
