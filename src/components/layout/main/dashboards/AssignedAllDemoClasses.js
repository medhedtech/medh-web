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

const AssignedAllDemoClasses = () => {
  const [classes, setClasses] = useState([]);
  const [instructorId, setInstructorId] = useState("673c756ca9054a9bbf673e0e");
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

  const demoClasses = classes.filter(
    (classItem) => classItem.meeting_tag === "demo"
  );

  return (
    <div className="px-10 pb-12">
      <div className="flex justify-between items-center pt-4 mb-4">
        <h2 className="text-2xl font-Open font-semibold dark:text-white text-gray-900">
          View Assigned Demo Classes
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {demoClasses.map((classItem) => (
          <div
            key={classItem._id}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border p-6 relative flex flex-col justify-between h-full"
          >
            {/* Class Image */}
            <div className="rounded-xl overflow-hidden mb-4">
              <Image
                src={
                  classItem.courseDetails?.course_image || "/default-image.jpg"
                }
                alt={classItem.meet_title || "Demo Class"}
                className="w-full h-48 object-cover rounded-xl transform hover:scale-110 transition-all duration-300"
                width={300}
                height={150}
              />
            </div>

            {/* Class Details */}
            <h3 className="mt-2 font-semibold text-lg text-gray-800 dark:text-white">
              {classItem.meet_title || "Untitled Class"}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Date: {formatDateWithOrdinal(classItem.date) || "Not specified"}
            </p>

            {/* Time with Icon */}
            <div className="flex items-center text-sm text-orange-500 mt-2">
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

            {/* Join Button */}
            <div className="mt-4">
              <button
                className="w-full px-4 py-2 bg-[#7ECA9D] text-white font-semibold rounded-full transition-transform transform hover:scale-105 hover:bg-green-600 duration-300"
                onClick={() => {}}
              >
                Join Class
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignedAllDemoClasses;
