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

const StudentNewCourses = () => {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const { getQuery, loading } = useGetQuery();

  const courses1 = [
    {
      id: 1,
      title: "AI & ML Masterclasses",
      instructor: "Sayef Mamud, PixelCo",
      rating: 4.0,
      reviews: 4051,
      image: reactImg,
    },
    {
      id: 2,
      title: "React Masterclasses",
      instructor: "Sayef Mamud, PixelCo",
      rating: 4.0,
      reviews: 4051,
      image: AiMl,
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
    {
      id: 5,
      title: "AI & ML Masterclasses",
      instructor: "Sayef Mamud, PixelCo",
      rating: 4.0,
      reviews: 4051,
      image: os,
    },
    {
      id: 6,
      title: "React Masterclasses",
      instructor: "Sayef Mamud, PixelCo",
      rating: 4.0,
      reviews: 4051,
      image: javascript,
    },
    {
      id: 7,
      title: "OS Masterclasses",
      instructor: "Sayef Mamud, PixelCo",
      rating: 4.0,
      reviews: 4051,
      image: os,
    },
    {
      id: 8,
      title: "JavaScript Masterclasses",
      instructor: "Sayef Mamud, PixelCo",
      rating: 4.0,
      reviews: 4051,
      image: javascript,
    },
  ];

  const [limit] = useState(20);
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
          "Upcoming",
          "",
          "",
          true
        ),
        onSuccess: (res) => {
          setCourses(res?.courses || []);
          console.log("fetched: ", res?.courses);
        },
        onFail: (err) => {
          console.error("Error fetching courses:", err);
        },
      });
    };
    fetchCourses();
  }, [page, limit]);

  const handleCardClick = (id) => {
    router.push(`/dashboards/my-courses/${id}`);
  };

  return (
    <div className="mx-auto mt-[-40px] p-8">
      <div className="flex justify-between">
        <div className="flex gap-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <div
              onClick={() => {
                router.push("/dashboards/student-dashboard");
              }}
              className="flex items-center gap-2"
            >
              <FaArrowLeft
                className="cursor-pointer text-gray-700 mr-2 dark:text-white"
                size={20}
              />
            </div>
            <h2 className="text-3xl dark:text-white">Enroll in New Course</h2>
          </div>
          <div className="flex gap-7 mb-4 ">
            <div className="relative ">
              <select className="appearance-none dark:bg-inherit border border-[#BDB7B7] text-[#808080] outline-none rounded-[20px] pr-7 pl-3 py-1">
                <option>By Age</option>
              </select>
              <div className="absolute top-1/2 right-2 transform -translate-y-1/2 pointer-events-none ">
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
              <div className="absolute top-1/2 right-2 transform -translate-y-1/2 pointer-events-none ">
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
              <div className="absolute top-1/2 right-2 transform -translate-y-1/2 pointer-events-none ">
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
      </div>

      {/* Display Courses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* {courses.map((course) => (
          <div
            key={course._id}
            className="border border-[#BDB7B7] rounded-lg overflow-hidden cursor-pointer"
            onClick={() => handleCardClick(course._id)}
          >
            <Image
              width={200}
              height={200}
              src={course.course_image}
              alt={course.course_title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {course.course_title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Instructor: {course.course_instructor}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                <span className="flex items-center gap-1">{course.course_rating}</span>
                <span className="text-yellow-500"> ⭐⭐⭐⭐</span>
                <span>{course.course_reviews}</span>
              </div>
            </div>
          </div>
        ))} */}
        {courses.map((course) => (
          <CourseCard
            key={course._id}
            {...course}
            onClick={() => handleCardClick(course._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default StudentNewCourses;
