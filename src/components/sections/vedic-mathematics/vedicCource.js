"use client";

import React from "react";
import CoursesFilter from "../courses/CoursesFilter";

function VedicCource() {
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
    "UG - Graduate - Professionals",
  ];

  return (
    <CoursesFilter
      CustomText="Vedic Mathematics Courses"
      CustomButton={
        <div className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm hover:shadow-md">
          Explore All Courses
        </div>
      }
      // Force filter to only show Vedic Mathematics courses
      fixedCategory="Vedic Mathematics"
      scrollToTop={handleScrollToTop}
      // Add a description for the courses section
      description="Discover the ancient wisdom of Vedic Mathematics through our comprehensive courses designed for all age groups and skill levels."
    />
  );
}

export default VedicCource;
