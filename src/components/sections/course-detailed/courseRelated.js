"use client";
import React, { useEffect, useState } from "react";
import CourseCard from "../courses/CourseCard";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import usePostQuery from "@/hooks/postQuery.hook";

function CourceRalated({ categoryName,courseId,relatedCourses }) {
  const [courses, setCourses] = useState([]);
  const { getQuery } = useGetQuery();
  const [limit] = useState(3);
  const [page] = useState(1);
  const {postQuery} = usePostQuery();

  useEffect(() => {
    const fetchCourses = () => {
      if (!categoryName) {
        console.error("Category name is missing.");
        return;
      }

      postQuery({
        url: apiUrls?.courses?.getAllRelatedCources,
        postData:{
          course_ids: relatedCourses,
        },
        onSuccess: (res) => {
          console.log("Response is:", res);
          setCourses(res?.courses || []);
        },
        onFail: (err) => {
          console.error("Error fetching courses:", err);
        },
      });
    };

    fetchCourses();
  }, [categoryName, page, limit]);

  return (
    <div className="w-full bg-white dark:bg-[#050622] h-auto pb-10 md:px-4 max-sm:px-4">
      <div className="flex flex-col lg:w-[62%] w-full lg:ml-[7%] ">
        <h1 className="text-[#5C6574] text-3xl font-bold py-5 md:ml-[0] ml-[10%] dark:text-gray-50">
          Related Courses
        </h1>

        {/* Adjust card layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-[#5C6574]">
          {courses.length > 0 ? (
            courses.map((course, index) => (
              <CourseCard key={index} course={course} className="w-full" />
            ))
          ) : (
            <p>No courses available for this category.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourceRalated;
