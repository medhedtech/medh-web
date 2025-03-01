"use client";

import React from "react";
import CoursesFilter from "../courses/CoursesFilter";
import Link from "next/link";

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
      key="digital-marketing"
      CustomText="Digital Marketing with Data Analytics Courses"
      CustomButton={
        <Link href="/courses">
          <div className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm hover:shadow-md">
            Explore All Courses
          </div>
        </Link>
      }
      // Force filter to only show Digital Marketing courses
      fixedCategory="Digital Marketing with Data Analytics"
      // Hide the category selection since we're only showing one category
      scrollToTop={handleScrollToTop}
      hideCategoryFilter={true}
      // Add a description for the courses section
      description="Master the art of digital marketing with our comprehensive courses combining modern marketing techniques with data analytics."
    />
  );
}

export default DigiMarketingCource;
