"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import Preloader from "../others/Preloader";
import RecordedCard from "./RecordedCourses";
import { getAllCoursesWithLimits } from "@/apis/course/course";

const CoorporateRecorded_Sessions = () => {
  const router = useRouter();
  const [freeCourses, setFreeCourses] = useState([]);
  const [recordedSession,setRecordedSession]= useState([]);
  const [studentId, setStudentId] = useState(null);
  const { getQuery, loading } = useGetQuery();
  const [limit] = useState(90);
  const [page] = useState(1);


  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        getQuery({
          url:`${apiUrls?.courses?.getRecorderVideosForUser}/${"674d7160c96e51af10f85426"}`,
          onSuccess:(res) => {
             setRecordedSession(res?.courses);
          },
         onFail:(res)=> {
          console.log(res, "Error")
         }
        })
      
      } else {
        console.error("No student ID found in localStorage");
      }
    }
  }, []);


  useEffect(() => {
    const fetchCourses = () => {
      getQuery({
        url: getAllCoursesWithLimits(
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
    router.push(`/dashboards/coorporate-my-courses/${id}`);
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
          href="/dashboards/coorporate-access-recorded-sessions"
          className="text-green-500 text-sm font-semibold hover:underline"
        >
          View All
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recordedSession?.map((course) => (
          <RecordedCard
            key={course?._id}
            course_title={course?.course_title}
            course_tag={course?.course_tag}
            // rating={course?.rating}
            course_image={course?.course_image}
            onClick={() => handleCardClick(course?._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default CoorporateRecorded_Sessions;
