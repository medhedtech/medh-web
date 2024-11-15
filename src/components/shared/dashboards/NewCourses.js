"use client";
import React from "react";
import CourseCard from "./CourseCard";
import reactImg from "@/assets/images/courses/React.jpeg";
import os from "@/assets/images/courses/os.jpeg";
import javascript from "@/assets/images/courses/javaScript.jpeg";
import AiMl from "@/assets/images/courses/Ai&Ml.jpeg";
import { useRouter } from "next/navigation";

const NewCourses = () => {
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

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between">
        <div className="flex gap-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl dark:text-white">Enroll in New Course</h2>
          </div>
          <div className="flex gap-7 mb-4 ">
            <div className="relative ">
              <select className="appearance-none dark:bg-inherit border border-[#BDB7B7] text-[#808080] outline-none rounded-[20px] pr-7 pl-3 py-1">
                <option>By Age</option>
              </select>
              <div className="absolute  top-1/2 right-2 transform -translate-y-1/2 pointer-events-none ">
                {/* Replace this with your custom SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-[#808080]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            <div className="relative ">
              <select className="appearance-none dark:bg-inherit border border-[#BDB7B7] text-[#808080] outline-none rounded-[20px] pr-7 pl-3 py-1">
                <option>By Grade</option>
              </select>
              <div className="absolute  top-1/2 right-2 transform -translate-y-1/2 pointer-events-none ">
                {/* Replace this with your custom SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-[#808080]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            <div className="relative ">
              <select className="appearance-none dark:bg-inherit border border-[#BDB7B7] text-[#808080] outline-none rounded-[20px] pr-7 pl-3 py-1">
                <option>Price</option>
              </select>
              <div className="absolute  top-1/2 right-2 transform -translate-y-1/2 pointer-events-none ">
                {/* Replace this with your custom SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-[#808080]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
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

export default NewCourses;
