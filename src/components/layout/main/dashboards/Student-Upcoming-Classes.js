"use client";
import React, { useEffect, useState } from "react";
import ClassCard from "@/components/shared/dashboards/ClassCard";
import AiMl from "@/assets/images/courses/Ai&Ml.jpeg";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import moment from "moment";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

const StudentUpcomigClasses = () => {
  const [courses, setCourses] = useState([]);
  const { getQuery } = useGetQuery();
  const [limit] = useState(15);
  const [page] = useState(1);
  const router = useRouter();

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
          ""
        ),
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
            Upcomig Classes
          </h2>
        </div>
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
            courseId={classItem._id}
          />
        ))}
      </div>
    </div>
  );
};

export default StudentUpcomigClasses;
