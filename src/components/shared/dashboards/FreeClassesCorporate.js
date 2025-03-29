"use client";
import React, { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import reactImg from "@/assets/images/courses/React.jpeg";
import os from "@/assets/images/courses/os.jpeg";
import javascript from "@/assets/images/courses/javaScript.jpeg";
import AiMl from "@/assets/images/courses/Ai&Ml.jpeg";
import { useRouter } from "next/navigation";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import { getAllCoursesWithLimits } from "@/apis/course/course";

const FreeClassesCorporate = () => {
  const router = useRouter();

  // const handleCardClick = (id) => {
  //   router.push(`/dashboards/my-courses/${id}`);
  // };

  const handleCardClick = (id, isFreeCourse) => {
    const queryString = isFreeCourse ? "?isFreeCourse=true" : "";
    router.push(`/dashboards/coorporate-my-courses/${id}${queryString}`);
  };

  const [freeCourses, setFreeCourses] = useState([]);
  const { getQuery } = useGetQuery();
  const [limit] = useState(90);
  const [page] = useState(1);

  useEffect(() => {
    const fetchCourses = () => {
      getQuery({
        url:getAllCoursesWithLimits(
          page,
          limit,
          "",
          "",
          "",
          "Upcoming",
          "",
          "",
          "",
          true
        ),
        onSuccess: (res) => {
          // Filter the courses where isFree is true
          const freeCourses =
            res?.courses?.filter((course) => course.isFree === true) || [];
          setFreeCourses(freeCourses.slice(0, 4));
          console.log(freeCourses); // Logging the filtered courses
        },
        onFail: (err) => {
          console.error("Error fetching courses:", err);
        },
      });
    };

    fetchCourses();
  }, [page, limit]);

  return (
    <div className="container mx-auto p-8 px-10">
      <div className="flex justify-between">
        <div className="flex gap-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            {/* <h2 className="text-3xl "> */}
            <h2 className="text-3xl font-Open dark:text-white">Free Courses</h2>
          </div>
        </div>
        <div>
          <a
            href="/dashboards/coorporate-free-courses"
            className="text-primaryColor hover:underline"
          >
            View All
          </a>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {freeCourses?.map((course) => (
          <CourseCard
            // title={}
            key={course?._id}
            {...course}
            // onClick={() => handleCardClick(course?._id)}
            onClick={() => handleCardClick(course?._id, true)} 
          />
        ))}
      </div>
    </div>
  );
};

export default FreeClassesCorporate;
