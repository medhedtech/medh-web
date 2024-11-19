"use client";
import React from "react";
import CourseCard from "./CourseCard";
import progress1 from "@/assets/images/dashbord/progress1.png";
import progress2 from "@/assets/images/dashbord/progress2.png";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

const StudentProgressOverview = () => {
  const router = useRouter();
  const courses = [
    {
      id: 1,
      title: "Web Development",
      instructor: "John Doe",
      progress: 40,
      image: progress1,
    },
    {
      id: 2,
      title: "Java Full Stack",
      instructor: "John Doe",
      progress: 70,
      image: progress2,
    },
    {
      id: 3,
      title: "Web Development",
      instructor: "John Doe",
      progress: 40,
      image: progress1,
    },
    {
      id: 4,
      title: "Java Full Stack",
      instructor: "John Doe",
      progress: 70,
      image: progress2,
    },
    {
      id: 5,
      title: "Web Development",
      instructor: "John Doe",
      progress: 40,
      image: progress1,
    },
    {
      id: 6,
      title: "Java Full Stack",
      instructor: "John Doe",
      progress: 70,
      image: progress2,
    },
    {
      id: 7,
      title: "Web Development",
      instructor: "John Doe",
      progress: 40,
      image: progress1,
    },
    {
      id: 8,
      title: "Java Full Stack",
      instructor: "John Doe",
      progress: 70,
      image: progress2,
    },
  ];

  return (
    <div className="w-full py-6 mt-[-40px] px-10">
      <div className="flex justify-between items-center mb-4">
        <div
          onClick={() => {
            router.push("/dashboards/student-dashboard");
          }}
          className="flex items-center gap-2"
        >
          <FaArrowLeft
            className="cursor-pointer text-gray-700 dark:text-white"
            size={20}
          />
          <h2 className="text-size-32 font-Open dark:text-white">
            Progress Overview
          </h2>
        </div>
      </div>

      {/* Display the courses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course) => (
          <CourseCard key={course.id} {...course} />
        ))}
      </div>
    </div>
  );
};

export default StudentProgressOverview;
