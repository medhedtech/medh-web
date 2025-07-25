"use client";
import React from "react";
import CourseCard from "../courses/CourseCard";
import HeadingDashboard from "../headings/HeadingDashboard";
import getAllCourses from "@/libs/getAllCourses";

/**
 * Dashboard Wishlist component – displays up to 5 courses the user has wish-listed.
 * TODO: Replace mock `getAllCourses` once real API is available.
 */
const Wishlist: React.FC = () => {
  // Currently returns an empty array until the API integration is complete.
  const courses = (getAllCourses() as any[])?.slice(0, 5) || [];

  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
      <HeadingDashboard>Wishlist</HeadingDashboard>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 -mx-15px">
        {courses.length > 0 ? (
          courses.map((course, idx) => (
            <CourseCard key={idx} type={"primary"} course={course} />
          ))
        ) : (
          <p>No courses available in the wishlist.</p>
        )}
      </div>
    </div>
  );
};

export default Wishlist; 