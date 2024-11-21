"use client"
import React, { useEffect, useState } from "react";
import CardImg1 from "./../../../assets/images/course-detailed/card.svg";
import CourseCard from "../courses/CourseCard";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";

function CourceRalated() {
  // const courses = [
  //   {
  //     title: "Professional Edge Diploma in",
  //     label: "Digital Marketing with Data Analytics",
  //     duration: "18 Months Course",
  //     image: CardImg1,
  //   },
  //   {
  //     title: "Professional Edge Diploma in",
  //     label: "AI & Data Science",
  //     duration: "18 Months Course",
  //     image: CardImg1,
  //   },
  //   {
  //     title: "Executive Diploma in",
  //     label: "AI & Data Science",
  //     duration: "12 Months Course",
  //     image: CardImg1,
  //   },
  // ];

  const [courses, setCourses] = useState([]);
  const { getQuery } = useGetQuery();
  const [limit] = useState(4);
  const [page] = useState(1);

  useEffect(() => {
    const fetchCourses = () => {
      getQuery({
        url: apiUrls?.courses?.getAllCoursesWithLimits(
          page,
          limit,
          "",
          "",
          "",
          "",
          "",
        ),
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
  }, [page, limit]);

  return (
    <div className="w-full bg-white dark:bg-[#050622] h-auto pb-10 md:px-4">
      <div className="flex flex-col lg:w-[62%] w-full lg:ml-[7%] ">
        <h1 className="text-[#5C6574] text-3xl font-bold py-5 md:ml-[0] ml-[10%] dark:text-gray-50  ">
          Related Courses
        </h1>

        {/* Adjust card layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-[#5C6574]">
          {courses.map((course, index) => (
            <CourseCard key={index} course={course} className="w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CourceRalated;
