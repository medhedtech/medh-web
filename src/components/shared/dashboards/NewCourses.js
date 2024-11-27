"use client";
import React, { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import reactImg from "@/assets/images/courses/React.jpeg";
import os from "@/assets/images/courses/os.jpeg";
import javascript from "@/assets/images/courses/javaScript.jpeg";
import AiMl from "@/assets/images/courses/Ai&Ml.jpeg";
import { useRouter } from "next/navigation";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";

const NewCourses = () => {
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

  const [limit] = useState(4);
  const [page] = useState(1);
  const [gradeFilter, setGradeFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [minFee, setMinFee] = useState("");
  const [maxFee, setMaxFee] = useState("");

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

  const handleGradeChange = (e) => {
    setGradeFilter(e.target.value);
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value === "lessThan500") {
      setMinFee("");
      setMaxFee(500);
    } else if (value === "500to1000") {
      setMinFee(500);
      setMaxFee(1000);
    } else if (value === "moreThan1000") {
      setMinFee(1000);
      setMaxFee("");
    }
    setPriceFilter(value);
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between">
        <div className="flex gap-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl dark:text-white">Enroll in New Course</h2>
          </div>
          {/* <div className="flex gap-7 mb-4 ">
            <div className="relative">
              <select
                value={gradeFilter}
                onChange={handleGradeChange}
                className="appearance-none dark:bg-inherit border border-[#BDB7B7] text-[#808080] outline-none rounded-[20px] pr-7 pl-3 py-1"
              >
                <option value="">By Grade</option>
                <option value="Grade 1">Grade 1</option>
                <option value="Grade 2">Grade 2</option>
                <option value="Grade 3">Grade 3</option>
              </select>
            </div>
            <div className="relative">
              <select
                value={priceFilter}
                onChange={handlePriceChange}
                className="appearance-none dark:bg-inherit border border-[#BDB7B7] text-[#808080] outline-none rounded-[20px] pr-7 pl-3 py-1"
              >
                <option value="">Price</option>
                <option value="lessThan500">Less than 500</option>
                <option value="500to1000">500 - 1000</option>
                <option value="moreThan1000">More than 1000</option>
              </select>
            </div>
          </div> */}
        </div>
        <div>
          <a
            href="/dashboards/student-enroll-new-courses"
            className="text-primaryColor hover:underline"
          >
            View All
          </a>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

export default NewCourses;
