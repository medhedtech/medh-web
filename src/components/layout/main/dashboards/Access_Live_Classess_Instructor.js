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

  // Fetch instructor ID from localStorage
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

  // Fetch upcoming classes
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

  // Filter classes with course_tag = "Live" or "Demo"
  const liveClasses = classes.filter(
    (classItem) =>
      classItem.courseDetails?.course_tag === "Live" ||
      classItem.courseDetails?.course_tag === "Demo"
  );

  return (
    <div className="px-10 py-10">
      <div className="flex justify-between items-center pt-4 mb-4">
        <h2 className="text-2xl font-Open font-semibold dark:text-white text-gray-900">
          Start/Join the Live Demo Class
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {liveClasses.map((classItem) => (
          <div
            key={classItem._id}
            className="bg-white dark:bg-inherit shadow rounded-lg border p-4 relative"
          >
            {/* Display "Live" Badge */}
            {classItem.courseDetails?.course_tag === "Live" && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                Live
              </div>
            )}
            {/* Course Image */}
            <div className="rounded overflow-hidden">
              <Image
                src={
                  classItem.courseDetails?.course_image ||
                  "/default-image-path.jpeg"
                }
                alt={classItem.meet_title || "Class Image"}
                className="w-full h-40 object-cover rounded"
                width={300}
                height={150}
              />
            </div>
            {/* Class Information */}
            <h3 className="mt-3 font-semibold text-gray-800  dark:text-white text-lg">
              {classItem.meet_title || "Untitled Class"}
            </h3>
            <p className="text-gray-500 text-sm">
              {moment(classItem.date).format("DD/MM/YYYY")} {classItem.time}
            </p>
            {/* Join Button */}
            <button
              className="mt-4 px-4 py-1 bg-[#7ECA9D] text-white font-semibold rounded-full hover:bg-green-600 transition"
              onClick={() => router.push(classItem.meet_link || "#")}
            >
              Join
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Live_Demo_Classess_instructor;
