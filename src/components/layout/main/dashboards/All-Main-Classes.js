"use client";
import React, { useState, useEffect } from "react";
import class1 from "@/assets/images/dashbord/class1.png";
import class2 from "@/assets/images/dashbord/class2.png";
import Image from "next/image";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import moment from "moment";
import Preloader from "@/components/shared/others/Preloader";

// Function to format date as DD-MM-YYYY HH:MM
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`; // Only return date
};

const UpComingClass = () => {
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [instructorId, setInstructorId] = useState("");
  const { getQuery, loading: getLoading } = useGetQuery();

  // Fetch instructor ID from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setInstructorId(storedUserId);
      } else {
        console.error("No student ID found in localStorage");
      }
    }
  }, []);

  useEffect(() => {
    const fetchUpcomingClasses = async () => {
      if (!instructorId) return;
      setLoading(true);
      setError(null);

      try {
        const res = await getQuery({
          url: `${apiUrls?.onlineMeeting?.getMeetingsByInstructorId}/${instructorId}`,
        });

        // Limit the result to only 2 classes
        const firstTwoClasses = res?.meetings || [];

        setUpcomingClasses(firstTwoClasses);
      } catch (err) {
        console.error("Error fetching upcoming classes:", err);
        setError("Failed to load upcoming classes.");
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingClasses();
  }, [instructorId]);

  // Get time difference from current time to meeting time
  const getTimeDifference = (classDate, classTime) => {
    const now = moment();
    const classMoment = moment(`${classDate} ${classTime}`, "YYYY-MM-DD HH:mm");
    const diffMinutes = classMoment.diff(now, "minutes");

    if (diffMinutes > 1440) {
      const diffDays = Math.ceil(diffMinutes / 1440);
      return `Starts in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
    } else if (diffMinutes > 60) {
      const diffHours = Math.floor(diffMinutes / 60);
      return `Starts in ${diffHours} hour${diffHours > 1 ? "s" : ""}`;
    } else if (diffMinutes > 0) {
      return `Starts in ${diffMinutes} minutes`;
    } else if (diffMinutes === 0) {
      return "Meeting is starting now!";
    } else {
      return "Meeting has already started.";
    }
  };

  if (getLoading) {
    return <Preloader />;
  }

  return (
    <div className="dark:bg-inherit px-10 pb-12 py-10">
      <div className="flex justify-between items-center mb-6">
        <p className="text-3xl font-Open font-semibold text-gray-800 dark:text-white">
          Upcoming Classes
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {loading ? (
          <p className="text-xl">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          upcomingClasses.map((classItem, index) => (
            <a
              key={index}
              href={classItem?.meet_link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-600 hover:to-blue-700 text-white shadow-xl rounded-xl overflow-hidden transition-transform transform hover:scale-105 cursor-pointer"
            >
              <div className="relative w-1/3 h-full">
                <Image
                  src={classItem?.courseDetails?.course_image || class2}
                  alt={classItem?.title || "Class"}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-l-xl transition-transform transform hover:scale-110"
                />
              </div>

              {/* Course Information Section */}
              <div className="p-6 flex flex-col w-2/3">
                {/* Course Title */}
                <p className="font-semibold text-black text-xl mb-2">
                  {classItem?.courseDetails?.course_title || "Class Title"}
                </p>

                {/* Course Description */}
                <p
                  className="font-light text-gray-600 text-sm mb-4"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {classItem?.courseDetails?.course_description ||
                    "Class Description"}
                </p>

                {/* Date and Time */}
                <p className="text-lg text-[#7ECA9D]">
                  {formatDate(classItem?.date) || "Date: N/A"}
                </p>
                <p className="text-lg text-[#FFA927] mt-2 flex items-center">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="#FFA927"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2"
                  >
                    <path
                      d="M7.43857 1.52441C10.7524 1.52441 13.4386 4.21061 13.4386 7.52441C13.4386 10.8382 10.7524 13.5244 7.43857 13.5244C4.12477 13.5244 1.43857 10.8382 1.43857 7.52441C1.43857 4.21061 4.12477 1.52441 7.43857 1.52441ZM7.43857 3.92441C7.27944 3.92441 7.12683 3.98763 7.0143 4.10015C6.90178 4.21267 6.83857 4.36528 6.83857 4.52441L6.83857 7.52441C6.8386 7.68353 6.90184 7.83612 7.01437 7.94861L8.81437 9.74861C8.92753 9.85791 9.07909 9.91839 9.23641 9.91702C9.39373 9.91565 9.54421 9.85255 9.65546 9.74131C9.7667 9.63006 9.82981 9.47957 9.83117 9.32225C9.83254 9.16494 9.77206 9.01338 9.66277 8.90021L8.03857 7.27601L8.03857 4.52441C8.03857 4.36528 7.97535 4.21267 7.86283 4.10015C7.75031 3.98763 7.5977 3.92441 7.43857 3.92441Z"
                      fill="#FFA927"
                    />
                  </svg>
                  {classItem?.time || "Time: N/A"}
                </p>

                {/* Time Remaining */}
                <p className="text-sm text-[#7ECA9D] mt-auto text-right flex-1">
                  {getTimeDifference(classItem?.date, classItem?.time)}
                </p>

                {/* Hover Effect - Elevated Class Info */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black opacity-30 hover:opacity-60 transition-all duration-300"></div>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
};

export default UpComingClass;
