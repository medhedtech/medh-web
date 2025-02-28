"use client";

import React from "react";
import CoursesFilter from "../courses/CoursesFilter";

function DigiMarketingCource() {
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

  return (
    <CoursesFilter
      CustomText="Digital Marketing with Data Analytics Courses"
      CustomButton={
        <div className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm hover:shadow-md">
          Explore All Courses
        </div>
      }
      // Force filter to only show Digital Marketing courses
      fixedCategory="Digital Marketing"
      // Hide the category selection since we're only showing one category
      hideCategoryFilter={true}
      // Show specialization-based filtering
      availableCategories={specializations}
      categoryTitle="Specialization"
      scrollToTop={handleScrollToTop}
      // Add a description for the courses section
      description="Master the art of digital marketing with our comprehensive courses combining modern marketing techniques with data analytics."
    />
  );
}

export default DigiMarketingCource;
