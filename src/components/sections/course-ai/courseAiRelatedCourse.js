"use client";
import React, { useEffect, useState } from "react";
import CourseCard from "../courses/CourseCard";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import { getAllCoursesWithLimits } from "@/apis/course/course";

function CourseAiRelatedCourses() {
  const { getQuery } = useGetQuery();
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);


  // Fetch related courses from API
  const fetchRelatedCourses = () => {
    getQuery({
      url: getAllCoursesWithLimits(
        1,
        10,
        "",
        "",
        "",
        "",
        "",
        "",
        "AI and Data Science",
        // false
      ),
      onSuccess: (data) => {
        const filtered = (data?.courses || []).slice(0, 3);
        setRelatedCourses(filtered);
      },
      onFail: (error) => {
        console.error("Error fetching related courses:", error);
      },
    });
  };

  useEffect(() => {
    fetchRelatedCourses();
  }, []);

  return (
    <div className="w-full h-auto flex justify-center items-center flex-col">
      <h1 className="text-center text-orange text-3xl font-bold dark:text-yellow pb-10 ">
        Related Courses
      </h1>
      {/* <p className="text-[#727695] text-md text-center px-4 dark:text-gray300">
        By enrolling in MEDH&#39;s AI and Data Science course, you will gain a
        comprehensive understanding of
        <br /> these
        <br /> dynamic fields, preparing you to excel in an ever-evolving
        industry.
      </p> */}
      {relatedCourses.length > 0 ? (
        <div className="md:w-[80%] w-[88%] h-full grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-6">
          {relatedCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center w-full min-h-[200px]">
          <p className="text-center text-black dark:text-white text-base">
            More AI and Data Science courses coming soon! Stay tuned for new programs and specializations.
          </p>
        </div>
      )}
    </div>
  );
}

export default CourseAiRelatedCourses;
