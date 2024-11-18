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

const FreeCourses = () => {
  const router = useRouter();

  const courses = [
    {
      id: 1,
      title: "AI & ML Masterclasses",
      instructor: "Sayef Mamud, PixelCo",
      rating: 4.0,
      reviews: 4051,
      image: AiMl,
    },
    {
      id: 2,
      title: "React Masterclasses",
      instructor: "Sayef Mamud, PixelCo",
      rating: 4.0,
      reviews: 4051,
      image: reactImg,
    },
    {
      id: 3,
      title: "OS Masterclasses",
      instructor: "Sayef Mamud, PixelCo",
      rating: 4.0,
      reviews: 4051,
      image: os,
    },
    {
      id: 4,
      title: "JavaScript Masterclasses",
      instructor: "Sayef Mamud, PixelCo",
      rating: 4.0,
      reviews: 4051,
      image: javascript,
    },
  ];

  const handleCardClick = (id) => {
    router.push(`/dashboards/my-courses/${id}`);
  };

  const [freeCourses, setFreeCourses] = useState([]);
  const { getQuery } = useGetQuery();
  const [limit] = useState(4);
  const [page] = useState(1);

  useEffect(() => {
    const fetchCourses = () => {
      getQuery({
        url: apiUrls?.courses?.getAllCoursesWithLimits(page,limit,'','','','Upcoming',''),
        onSuccess: (res) => {
          setFreeCourses(res?.courses || []);
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
            <h2 className="text-3xl font-Open dark:text-white">
              Free Courses</h2>
          </div>
        </div>
        <div>
          <a href="#" className="text-primaryColor hover:underline">
            View All
          </a>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            {...course}
            onClick={() => handleCardClick(course.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default FreeCourses;
