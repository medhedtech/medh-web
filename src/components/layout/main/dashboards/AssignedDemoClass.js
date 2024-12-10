"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";

function formatDateWithOrdinal(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  // Add ordinal suffix to the day
  const ordinalSuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${ordinalSuffix(day)} ${month} ${year}`;
}

const formatTimeWithAmPm = (timeString) => {
  const [hours, minutes] = timeString.split(":");
  const date = new Date();
  date.setHours(hours, minutes);

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const AssignedDemoClass = () => {
  const [classes, setClasses] = useState([]);
  const [instructorId, setInstructorId] = useState("6757cb3c8071784d1d67c28f");
  const { getQuery, loading } = useGetQuery();

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

  // Fetch classes from API
  useEffect(() => {
    if (instructorId) {
      const fetchDemoClasses = () => {
        getQuery({
          url: `${apiUrls?.onlineMeeting?.getMeetingsByInstructorId}/${instructorId}`,
          onSuccess: (res) => {
            setClasses(res?.meetings || []);
          },
          onFail: (err) => {
            console.error("Error fetching demo classes:", err);
          },
        });
      };

      fetchDemoClasses();
    }
  }, [instructorId]);

  // Filter only Demo classes
  const demoClasses = classes.filter(
    (classItem) => classItem.courseDetails?.course_tag === "Demo"
  );

  return (
    <div className="px-10 pb-12">
      <div className="flex justify-between items-center pt-4 mb-4">
        <h2 className="text-2xl font-Open font-semibold dark:text-white text-gray-900">
          View Assigned Demo Classes
        </h2>
        <a href="#" className="text-green-500 hover:underline">
          View All
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {demoClasses.map((classItem) => (
          <div
            key={classItem._id}
            className="bg-white dark:border dark:text-white dark:bg-inherit shadow rounded-lg p-4"
          >
            {/* Class Image */}
            <div className="rounded overflow-hidden">
              <Image
                src={
                  classItem.courseDetails?.course_image || "/default-image.jpg"
                }
                alt={classItem.meet_title || "Demo Class"}
                className="w-full h-40 object-cover"
                width={300}
                height={150}
              />
            </div>
            {/* Class Details */}
            <h3 className="mt-2 font-semibold dark:text-white text-gray-800">
              {classItem.meet_title || "Untitled Class"}
            </h3>
            <p className="text-gray-600 text-sm">
              Date: {formatDateWithOrdinal(classItem.date) || "Not specified"}
            </p>
            <div className="flex items-center text-sm text-orange-500 mt-1">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1"
              >
                <circle cx="7.5" cy="7.5" r="7" stroke="orange" />
                <path d="M7.5 3v5h3" stroke="orange" />
              </svg>
              {formatTimeWithAmPm(classItem.time) || "Not specified"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignedDemoClass;
