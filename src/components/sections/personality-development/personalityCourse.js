"use client";

import React from "react";
import CoursesFilter from "../courses/CoursesFilter";

function PersonalityDevelopmentCourses() {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Define the grades for personality development courses
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
      CustomText="Personality Development Courses"
      CustomButton={
        <div className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm hover:shadow-md">
          Explore All Courses
        </div>
      }
      // Force filter to only show Personality Development courses
      fixedCategory="Personality Development"
      // Hide the category selection since we're only showing one category
      hideCategoryFilter={true}
      // Only show grade-based filtering
      availableCategories={grades}
      categoryTitle="Grade Level"
      scrollToTop={handleScrollToTop}
      // Add a description for the courses section
      description="Enhance your personal growth with our comprehensive personality development programs tailored for all age groups."
    />
  );
}

export default PersonalityDevelopmentCourses;
