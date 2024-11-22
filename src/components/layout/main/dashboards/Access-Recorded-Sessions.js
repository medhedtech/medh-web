"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AiMl from "@/assets/images/courses/Ai&Ml.jpeg";
import reactImg from "@/assets/images/courses/React.jpeg";
import os from "@/assets/images/courses/os.jpeg";
import javascript from "@/assets/images/courses/javaScript.jpeg";
import { FaArrowLeft } from "react-icons/fa";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import CourseCard from "@/components/shared/dashboards/CourseCard";
import Preloader from "@/components/shared/others/Preloader";

const StudentRecordedSessions = () => {
  const router = useRouter();

  const sessions = [
    {
      id: 1,
      title: "AI & ML Masterclasses",
      instructor: "Sayef Mamud, PixelCo",
      date: "21th October 2024",
      image: AiMl,
    },
    {
      id: 2,
      title: "React Masterclasses",
      instructor: "Sayef Mamud, PixelCo",
      date: "21th October 2024",
      image: reactImg,
    },
    {
      id: 3,
      title: "OS Masterclasses",
      instructor: "Sayef Mamud, PixelCo",
      date: "21th October 2024",
      image: os,
    },
    {
      id: 4,
      title: "JavaScript Masterclasses",
      instructor: "Sayef Mamud, PixelCo",
      date: "21th October 2024",
      image: javascript,
    },
    {
      id: 5,
      title: "AI & ML Masterclasses",
      instructor: "Sayef Mamud, PixelCo",
      date: "21th October 2024",
      image: AiMl,
    },
    {
      id: 6,
      title: "React Masterclasses",
      instructor: "Sayef Mamud, PixelCo",
      date: "21th October 2024",
      image: reactImg,
    },
    {
      id: 7,
      title: "OS Masterclasses",
      instructor: "Sayef Mamud, PixelCo",
      date: "21th October 2024",
      image: os,
    },
    {
      id: 8,
      title: "JavaScript Masterclasses",
      instructor: "Sayef Mamud, PixelCo",
      date: "21th October 2024",
      image: javascript,
    },
  ];

  const [freeCourses, setFreeCourses] = useState([]);
  const { getQuery, loading } = useGetQuery();
  const [limit] = useState(90);
  const [page] = useState(1);

  useEffect(() => {
    const fetchCourses = () => {
      getQuery({
        url: apiUrls?.courses?.getAllCoursesWithLimits(page, limit, '', '', '', 'Upcoming', '', '', true),
        onSuccess: (res) => {
          // Filter the courses where isFree is true
          const freeCourses = res?.courses?.filter(course => course.course_tag === "Pre-Recorded") || [];
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
    router.push(`/dashboards/my-courses/${id}`);
  };

  if(loading){
    return <Preloader/>
  }

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
            Access Recorded Sessions
          </h2>
        </div>
      </div>
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sessions.map((session) => (
          <div
            key={session.id}
            onClick={() => handleCardClick(session.id)}
            className="bg-white dark:bg-inherit shadow-sm rounded-lg overflow-hidden border border-gray-200 cursor-pointer"
          >
            <div className="relative">
              <Image
                src={session.image}
                alt={session.title}
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <span className="text-white text-2xl">▶</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-sm text-[#282F3E] dark:text-white">
                {session.title}
              </h3>
              <p className="text-xs text-[#585D69]">{session.instructor}</p>
              <p className="text-size-11 text-primaryColor mt-2">
                Recorded Date: {session.date}
              </p>
            </div>
          </div>
        ))}
      </div> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

export default StudentRecordedSessions;
