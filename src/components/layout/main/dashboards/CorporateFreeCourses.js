"use client";
import React, { useEffect, useState } from "react";
import reactImg from "@/assets/images/courses/React.jpeg";
import os from "@/assets/images/courses/os.jpeg";
import javascript from "@/assets/images/courses/javaScript.jpeg";
import AiMl from "@/assets/images/courses/Ai&Ml.jpeg";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import CourseCard from "@/components/shared/dashboards/CourseCard";


const CorporateFreeCourses = () => {
  const router = useRouter();

  const [freeCourses, setFreeCourses] = useState([]);
  const { getQuery } = useGetQuery();
  const [limit] = useState(90);
  const [page] = useState(1);

  useEffect(() => {
    const fetchCourses = () => {
      getQuery({
        url: apiUrls?.courses?.getAllCoursesWithLimits(page, limit, '', '', '', 'Upcoming', '', '', '', true),
        onSuccess: (res) => {
          // Filter the courses where isFree is true
          const freeCourses = res?.courses?.filter(course => course.isFree === true) || [];
          setFreeCourses(freeCourses);
          console.log(freeCourses); // Logging the filtered courses
        },
        onFail: (err) => {
          console.error("Error fetching courses:", err);
        },
      });
    };
  
    fetchCourses();
  }, [page, limit]);

  const handleCardClick = (id) => {
    router.push(`/dashboards/coorporate-my-courses/${id}`);
  };

  return (
    <div className="mx-auto mt-[-40px] p-8">
      <div className="flex justify-between">
        <div className="flex gap-4 mb-4">
          <div className="flex justify-between items-center mb-4">
          <div
          onClick={() => {
            router.push("/dashboards/coorporate-dashboard");
          }}
          className="flex items-center gap-2"
        >
          <FaArrowLeft
            className="cursor-pointer text-gray-700 mr-2 dark:text-white"
            size={20}
          />
          </div>
            <h2 className="text-3xl dark:text-white">Free Courses</h2>
          </div>
        </div>
      </div>

      {/* Display Courses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {freeCourses?.map((course) => (
          <CourseCard
            // title={}
            key={course?._id}
            {...course}
            onClick={() => handleCardClick(course?._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default CorporateFreeCourses;
