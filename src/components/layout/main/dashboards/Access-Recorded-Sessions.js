"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import CourseCard from "@/components/shared/dashboards/CourseCard";
import Preloader from "@/components/shared/others/Preloader";

const StudentRecordedSessions = () => {
  const router = useRouter();
  const [freeCourses, setFreeCourses] = useState([]);
  const { getQuery, loading } = useGetQuery();
  const [limit] = useState(90);
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
          "",
          true,
        ),
        onSuccess: (res) => {
          const freeCourses =
            res?.courses?.filter(
              (course) => course.course_tag === "Pre-Recorded"
            ) || [];
          setFreeCourses(freeCourses);
          console.log(freeCourses);
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

  if (loading) {
    return <Preloader />;
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {freeCourses?.map((course) => (
          <CourseCard
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
