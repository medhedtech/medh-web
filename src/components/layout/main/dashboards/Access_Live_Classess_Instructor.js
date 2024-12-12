"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import useGetQuery from "@/hooks/getQuery.hook";
import { useRouter } from "next/navigation";
import { apiUrls } from "@/apis";
import moment from "moment";

const Live_Demo_Classess_instructor = () => {
  const router = useRouter();
  const [classes, setClasses] = useState([]);
  const [instructorId, setInstructorId] = useState("673c756ca9054a9bbf673e0e");
  const { getQuery } = useGetQuery();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("673c756ca9054a9bbf673e0e");
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
    (classItem) => classItem?.meeting_tag === "live"
  );

  return (
    <div className="px-10 py-10">
      <div className="flex justify-between items-center pt-4 mb-4">
        <h2 className="text-2xl font-Open font-semibold dark:text-white text-gray-900">
          Start/Join the Live Class
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {liveAndDemoClasses.map((classItem) => (
          <div
            key={classItem._id}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border p-6 relative flex flex-col justify-between h-full"
          >
            {/* "Live" tag */}
            {classItem.meeting_tag === "live" && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                Live
              </div>
            )}

            {/* Course Image */}
            <div className="rounded-lg overflow-hidden mb-4">
              <Image
                src={
                  classItem.courseDetails?.course_image ||
                  "/default-image-path.jpeg"
                }
                alt={classItem.meet_title || "Class Image"}
                className="w-full h-48 object-cover rounded-lg transform hover:scale-105 transition-all duration-300"
                width={300}
                height={200}
              />
            </div>

            {/* Title and Date */}
            <div className="flex flex-col flex-grow">
              <h3 className="mt-2 text-lg font-semibold text-gray-800 dark:text-white">
                {classItem.meet_title || "Untitled Class"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                {moment(classItem.date).format("DD/MM/YYYY")} - {classItem.time}
              </p>
            </div>

            {/* Join Button */}
            <button
              className="mt-4 w-full px-4 py-2 bg-[#7ECA9D] text-white font-semibold rounded-full hover:bg-green-600 transition duration-300 transform hover:scale-105"
              onClick={() => router.push(classItem.meet_link || "#")}
            >
              Join Class
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Live_Demo_Classess_instructor;
