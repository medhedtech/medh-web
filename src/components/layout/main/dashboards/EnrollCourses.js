"use client"
import React from "react";
import EnrollCoursesCard from "./EnrollCoursesCard";
import reactImg from "@/assets/images/courses/React.jpeg";
import hockey from "@/assets/images/courses/hockey.jpeg";
import os from "@/assets/images/courses/os.jpeg";
import javascript from "@/assets/images/courses/javaScript.jpeg";
import { useRouter } from "next/navigation";

const EnrollCourses = () => {
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
  ];

  const handleCardClick = (id) => {
    router.push(`/dashboards/my-courses/${id}`);
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between font-normal font-Open  pb-4 ">
        <h2 className="text-size-32 font-Open">Enrolled Courses</h2>
        <a
          href="#"
          className="text-green-500 text-sm font-semibold hover:underline"
        >
          View All
        </a>
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
export default EnrollCourses;
