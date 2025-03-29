"use client";
import React, { useEffect, useState } from "react";
import useGetQuery from "@/hooks/getQuery.hook";
import CourseCard from "../courses/CourseCard";
import { getAllCoursesWithLimits } from "@/apis/course/course";

function RelatedCourses() {
  const { getQuery } = useGetQuery();
  const [relatedCourses, setRelatedCourses] = useState([]);

  // Fetch related courses from API
  const fetchRelatedCourses = () => {
    getQuery({
      url: getAllCoursesWithLimits(
        1,
        10,
        "",
        "",
        "",
        "Published",
        "",
        "",
        "Personality Development",
        false
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
    <div className="w-full bg-white dark:bg-screen-dark h-auto py-6 flex justify-center items-center flex-col">
      <p className="text-[#727695] text-lg font-semibold text-center px-4 dark:text-gray-100">
        We look forward to welcoming you on board to acquire the essential skills and knowledge to craft your success story
      </p>
      <h1 className="text-center text-[#5C6574] text-3xl font-bold py-5 dark:text-gray50">
        Related Courses
      </h1>
      <div className="md:w-[80%] w-[88%] h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedCourses.length > 0 ? (
          relatedCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))
        ) : (
          <p>No related courses found.</p>
        )}
      </div>
    </div>
  );
}

export default RelatedCourses;
