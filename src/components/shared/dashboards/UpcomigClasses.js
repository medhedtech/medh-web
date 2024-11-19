"use client"
import React, { useEffect, useState } from "react";
import ClassCard from "./ClassCard";
import AiMl from "@/assets/images/courses/Ai&Ml.jpeg";
import reactImg from "@/assets/images/courses/React.jpeg";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import moment from "moment";

const UpcomigClasses = () => {
  const classes = [
    {
      title: "AI & ML Masterclasses",
      instructor: "Sayef Mamud, PixelCo",
      dateTime: "12-11-24, 12:00 PM",
      isLive: true,
      image: AiMl,
    },
    {
      title: "React Masterclasses",
      instructor: "Sayef Mamud, PixelCo",
      dateTime: "12-11-24, 12:00 PM",
      isLive: true,
      image: reactImg,
    },
    {
      title: "React Masterclasses",
      instructor: "Sayef Mamud, PixelCo",
      dateTime: "12-11-24, 12:00 PM",
      isLive: true,
      image: reactImg,
    },
    {
      title: "AI & ML Masterclasses",
      instructor: "Sayef Mamud, PixelCo",
      dateTime: "12-11-24, 12:00 PM",
      isLive: true,
      image: AiMl,
    },
  ];

  const [courses, setCourses] = useState([]);
  const { getQuery } = useGetQuery();
  const [limit] = useState(4);
  const [page] = useState(1);

  useEffect(() => {
    const fetchCourses = () => {
      getQuery({
        url: apiUrls?.courses?.getAllCoursesWithLimits(page,limit,'','','','Upcoming','',false),
        onSuccess: (res) => {
          setCourses(res?.courses || []);
        },
        onFail: (err) => {
          console.error("Error fetching courses:", err);
        },
      });
    };
    fetchCourses();
  }, [page, limit]);

  return (
    <div className="px-10 pb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-size-32 font-Open dark:text-white">
          Upcoming Classes
        </h2>
        <a
          href="/dashboards/student-upcoming-classes"
          className="text-green-500 hover:underline"
        >
          View All
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses?.map((classItem, index) => (
          <ClassCard
            key={index}
            title={classItem.course_title}
            // instructor={classItem.instructor}
            dateTime={moment(classItem?.createdAt).format("DD/MM/YYYY")}
            // isLive={classItem.isLive}
            image={AiMl}
          />
        ))}
      </div>
    </div>
  );
};

export default UpcomigClasses;
