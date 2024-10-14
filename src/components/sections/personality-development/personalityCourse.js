"use client";

import React, { useState } from "react";
import CategoryFilter from "../courses/CategoryFilter";
import CourseCard from "../courses/CourseCard";
import CardImg from "./../../../assets/images/personality/cardimg.png"; 
import Registration from "../registrations/Registration";

function PersonalityCourse() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    "Preschool",
    "Grade 1-2",
    "Grade 3-4",
    "Grade 5-6",
    "Grade 7-8",
    "Grade 9-10",
    "Grade 11-12",
    "UG - Graduate - Professionals",
  ];

  const courses = [
    {
      title: "Certificate in",
      label: "Personality Development",
      grade: "(Grade 1-2)",
      duration: "6 Months Course",
      image: CardImg,
    },
    {
      title: "Certificate in",
      label: "Personality Development",
      grade: "(Grade 1-2)",
      duration: "9 Months Course",
      image: CardImg,
    },
    {
      title: "Certificate in",
      label: "Personality Development",
      grade: "(Grade 1-2)",
      duration: "3 Months Course",
      image: CardImg,
    },
  ];

  const filteredCourses = selectedCategory
    ? courses.filter((course) => course.label === selectedCategory)
    : courses;

  const handleClearFilters = () => {
    setSelectedCategory(null);
  };

  return (
    <>
      <div className="bg-white text-lightGrey14 flex justify-center py-10">
        <div className="w-full md:w-[80%] max-w-[1200px]">
          <h2 className="text-[22px] md:text-3xl font-bold mb-4 text-center text-[#5C6574] pb-10">
            Personality Development Courses (Grade Wise)
          </h2>
          
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
            <div className="flex items-center border border-[#CDCFD5] px-3 py-2 rounded-md w-full md:w-[50%] lg:w-[40%]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-search"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                placeholder="Search"
                className="outline-none ml-2 w-full"
              />
            </div>

            <div className="border border-[#CDCFD5] px-2 py-2 rounded-md w-full md:w-auto">
              <select className="w-full outline-none">
                <option>Program Title (A-Z)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/4">
              <CategoryFilter
                categories={categories}
                setSelectedCategory={setSelectedCategory}
                heading='Grade'
              />
            </div>

            <div className="w-full md:w-3/4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.title} course={course} />
                ))}
              </div>
            </div>
          </div>

          {selectedCategory && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleClearFilters}
                className="border border-[#5F2DED] text-[#5F2DED] px-4 py-2 rounded-md"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
      <Registration />
    </>
  );
}

export default PersonalityCourse;
