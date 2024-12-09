"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import Preloader from "../others/Preloader";
import RecordedCard from "./RecordedCourses";

const RecordedSessions = () => {
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
          "Published",
          "",
          "",
          "",
          true
        ),
        onSuccess: (res) => {
          // Filter the courses where isFree is true
          const freeCourses =
            res?.courses?.filter(
              (course) => course.course_tag === "Pre-Recorded"
            ) || [];
          setFreeCourses(freeCourses.slice(0, 4));
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

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between font-normal font-Open  pb-4 ">
        <h2 className="text-size-32 font-Open dark:text-white">
          Access Recorded Sessions
        </h2>
        <a
          href="/dashboards/access-recorded-sessions"
          className="text-green-500 text-sm font-semibold hover:underline"
        >
          View All
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {freeCourses?.map((course) => (
          <RecordedCard
            key={course?._id}
            course_title={course?.course_title}
            course_tag={course?.course_tag}
            rating={course?.rating}
            course_image={course?.course_image}
            onClick={() => handleCardClick(course?._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default RecordedSessions;
