import React from "react";
import EnrollCoursesCard from "./EnrollCoursesCard";
import reactImg from "@/assets/images/courses/React.jpeg";
import hockey from "@/assets/images/courses/hockey.jpeg";
import os from "@/assets/images/courses/os.jpeg";
import javascript from "@/assets/images/courses/JavaScript.jpeg";

const EnrollCourses = () => {
  const courses = [
    {
      title: "Learn to play hockey",
      image: hockey,
      isLive: false,
      progress: 40,
    },
    {
      title: "React Masterclasses",
      image: reactImg,
      isLive: true,
      progress: 40,
    },
    {
      title: "OS Masterclasses",
      image: os,
      isLive: true,
      progress: 40,
    },
    {
      title: "JavaScript Masterclasses",
      image: javascript,
      isLive: true,
      progress: 40,
    },
  ];
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
        {courses.map((course, index) => (
          <EnrollCoursesCard
            key={index}
            title={course.title}
            image={course.image}
            isLive={course.isLive}
            progress={course.progress}
          />
        ))}
      </div>
    </div>
  );
};
export default EnrollCourses;
