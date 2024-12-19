"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import Preloader from "@/components/shared/others/Preloader";
import { FaBookOpen, FaRegSadCry } from "react-icons/fa";
import { MdOutlineLibraryBooks } from "react-icons/md";

function formatDateWithOrdinal(dateString) {
  if (!dateString) return "Not specified";
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
  if (!timeString) return "Not specified";
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
  const [instructorId, setInstructorId] = useState("");
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

  // Fetch demo classes based on instructor ID
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

  // Filter only demo classes
  const demoClasses = classes.filter(
    (classItem) => classItem.meeting_tag === "demo"
  );

  // Show loader while data is being fetched
  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="px-10 pb-12">
      <div className="flex justify-between items-center pt-4 mb-4">
        <h2 className="text-2xl font-Open font-semibold dark:text-white text-gray-900">
          View Assigned Demo Classes
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {demoClasses.length > 0 ? (
          demoClasses.map((classItem) => (
            <div
              key={classItem._id}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border p-6 relative flex flex-col justify-between h-full"
            >
              {/* Class Image */}
              <div className="rounded-xl overflow-hidden mb-4">
                <Image
                  src={
                    classItem.courseDetails?.course_image ||
                    "/default-image.jpg"
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
                Date: {formatDateWithOrdinal(classItem.date)}
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
                {formatTimeWithAmPm(classItem.time)}
              </div>

              {/* Join Button */}
              <div className="mt-4">
                <button className="mt-4 w-full px-4 py-2 bg-[#7ECA9D] text-white font-semibold rounded-full hover:bg-green-600 transition duration-300 transform hover:scale-105">
                  <a
                    href={classItem?.meet_link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-full block"
                  >
                    Join Class
                  </a>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-10 px-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg shadow-lg w-full text-center flex flex-col items-center justify-center">
            <div className="bg-white p-4 rounded-full shadow-md">
              <FaBookOpen size={60} className="text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mt-6">
              No Demo Classes Found
            </h2>
            <p className="text-lg text-gray-600 mt-2">
              It seems we couldn't find any assigned demo classes for you.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Check back later or contact your instructor for details.
            </p>
            <div className="mt-6 flex space-x-4">
              <MdOutlineLibraryBooks
                size={40}
                className="text-gray-400 animate-bounce"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedAllDemoClasses;
