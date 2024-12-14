"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Reactimg from "@/assets/images/courses/React.jpeg";
import Preloader from "@/components/shared/others/Preloader";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";

const MyMainClass = () => {
  const [classes, setClasses] = useState([]);
  const [instructorId, setInstructorId] = useState("");
  const { getQuery, loading } = useGetQuery();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setInstructorId(storedUserId);
      } else {
        console.error("No instructor ID found in localStorage");
      }
    }
  }, []);

  useEffect(() => {
    if (instructorId) {
      const fetchUpcomingClasses = () => {
        getQuery({
          url: `${apiUrls?.onlineMeeting?.getMeetingsByInstructorId}/${instructorId}`,
          onSuccess: (res) => {
            setClasses(res.meetings || []);
          },
          onFail: (err) => {
            console.error("Error fetching upcoming classes:", err);
          },
        });
      };

      fetchUpcomingClasses();
    }
  }, [instructorId]);

  const liveAndDemoClasses = classes.filter(
    (classItem) => classItem?.meeting_tag === "main"
  );

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="px-10 pb-12">
      <div className="flex justify-between items-center  pt-4 mb-4">
        <h2 className="text-2xl font-Open font-semibold dark:text-white text-gray-900">
          My Main Classes
        </h2>
        <a
          href="/dashboards/instructor-mainclass/all-main-classes"
          className="text-green-500 hover:underline"
        >
          View All
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {liveAndDemoClasses.map((classItem) => (
          <div
            key={classItem.id}
            className="bg-white dark:border dark:text-white dark:bg-inherit shadow rounded-lg p-4"
          >
            <div className="rounded overflow-hidden">
              <Image
                src={classItem.courseDetails?.course_image || Reactimg}
                alt={classItem.meet_title || "Class Image"}
                className="w-full h-48 object-cover rounded-lg transform hover:scale-105 transition-all duration-300"
                width={300}
                height={200}
              />
            </div>
            <h3 className="mt-2 font-semibold leading-tight dark:text-white text-gray-800">
              {`${
                classItem?.courseDetails?.course_title || "No Course Title"
              } (${classItem?.meet_title || "No Meeting Title"})`}
            </h3>
            <p className="text-size-10 font-light ">
              {classItem?.courseDetails?.course_description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyMainClass;
