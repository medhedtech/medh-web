"use client";
import React from "react";
import EnrollCoursesCard from "./EnrollCoursesCard";
import reactImg from "@/assets/images/courses/React.jpeg";
import hockey from "@/assets/images/courses/hockey.jpeg";
import os from "@/assets/images/courses/os.jpeg";
import javascript from "@/assets/images/courses/javaScript.jpeg";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

const StudentEnrollCourses = () => {
  const router = useRouter();

  const courses = [
    {
      id: 1,
      title: "Learn to play hockey",
      image: hockey,
      isLive: false,
      progress: 40,
    },
    {
      id: 2,
      title: "React Masterclasses",
      image: reactImg,
      isLive: true,
      progress: 40,
    },
    {
      id: 3,
      title: "OS Masterclasses",
      image: os,
      isLive: true,
      progress: 40,
    },
    {
      id: 4,
      title: "JavaScript Masterclasses",
      image: javascript,
      isLive: true,
      progress: 40,
    },
    {
      id: 5,
      title: "Learn to play hockey",
      image: hockey,
      isLive: false,
      progress: 40,
    },
    {
      id: 6,
      title: "React Masterclasses",
      image: reactImg,
      isLive: true,
      progress: 40,
    },
    {
      id: 7,
      title: "OS Masterclasses",
      image: os,
      isLive: true,
      progress: 40,
    },
    {
      id: 8,
      title: "JavaScript Masterclasses",
      image: javascript,
      isLive: true,
      progress: 40,
    },
  ];

  const handleCardClick = (id) => {
    router.push(`/dashboards/my-courses/${id}`);
  };

  return (
    <div className="container mx-auto p-8 mt-[-40px]">
      <div className="flex justify-between items-center mb-4">
        <div
          onClick={() => {
            router.push("/dashboards/my-courses");
          }}
          className="flex items-center gap-2"
        >
          <FaArrowLeft
            className="cursor-pointer text-gray-700 dark:text-white"
            size={20}
          />
          <h2 className="text-size-32 font-Open dark:text-white">
            Enrolled Courses
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <EnrollCoursesCard
            key={course.id}
            title={course.title}
            image={course.image}
            isLive={course.isLive}
            progress={course.progress}
            onClick={() => handleCardClick(course.id)}
          />
        ))}
      </div>
    </div>
  );
};
export default StudentEnrollCourses;
