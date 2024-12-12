"use client";
import React, { useState, useEffect } from "react";
import class2 from "@/assets/images/dashbord/class2.png";
import Image from "next/image";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import moment from "moment";

// Function to format date as DD-MM-YYYY HH:MM
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

const UpComingClass = () => {
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [instructorId, setInstructorId] = useState("673c756ca9054a9bbf673e0e");
  const { getQuery } = useGetQuery();

  // Fetch instructor ID from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("instructorId");
      if (storedUserId) {
        setInstructorId(storedUserId);
      } else {
        console.error("No instructor ID found in localStorage");
      }
    }
  }, []);

  useEffect(() => {
    const fetchUpcomingClasses = async () => {
      setLoading(true);
      setError(null);
  
      try {
        const res = await getQuery({
          url: `${apiUrls?.onlineMeeting?.getMeetingsByInstructorId}/${instructorId}`,
        });
        
        // Limit the result to only 2 classes
        const firstTwoClasses = res?.meetings?.slice(0, 2) || [];
        
        setUpcomingClasses(firstTwoClasses);
      } catch (err) {
        console.error("Error fetching upcoming classes:", err);
        setError("Failed to load upcoming classes.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchUpcomingClasses();
  }, []);

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

  return (
    <div className="dark:bg-inherit px-10 pb-6">
      <div className="flex justify-between items-center mb-4 dark:text-white">
        <p className="text-2xl font-Open font-semibold dark:text-white text-gray-800">
          Upcoming Classes
        </p>
        <a href="/dashboards/instructor-mainclass/all-classess" className="text-green-500 hover:underline">
          View All
        </a>
      </div>

      <div className="grid md:grid-cols-2 gap-6 w-[100%]">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          upcomingClasses.map((classItem, index) => (
            <div key={index} className="flex bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
              {/* Image Section */}
              <div className="relative w-1/3 h-full">
                <Image
                  src={classItem?.courseDetails?.course_image || class2}
                  alt={classItem?.title || "Class"}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-l-lg"
                />
              </div>

              {/* Course Information Section */}
              <div className="p-4 flex flex-col flex-1">
                {/* Course Title */}
                <p className="font-semibold text-lg text-gray-800 dark:text-white">
                  {classItem?.courseDetails?.course_title || "Class Title"}
                </p>

                {/* Course Description */}
                <p className="font-light text-sm text-gray-600 dark:text-gray-300 mt-2">
                  {classItem?.description || "Class Description"}
                </p>

                {/* Date and Time */}
                <p className="text-sm text-[#7ECA9D] mt-4">
                  {formatDate(classItem?.date)|| "Date: N/A"}
                </p>
                <p className="text-sm text-[#FFA927] mt-2 flex items-center">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    className="mr-2"
                    fill="#FFA927"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.43857 1.52441C10.7524 1.52441 13.4386 4.21061 13.4386 7.52441C13.4386 10.8382 10.7524 13.5244 7.43857 13.5244C4.12477 13.5244 1.43857 10.8382 1.43857 7.52441C1.43857 4.21061 4.12477 1.52441 7.43857 1.52441ZM7.43857 3.92441C7.27944 3.92441 7.12683 3.98763 7.0143 4.10015C6.90178 4.21267 6.83857 4.36528 6.83857 4.52441L6.83857 7.52441C6.8386 7.68353 6.90184 7.83612 7.01437 7.94861L8.81437 9.74861C8.92753 9.85791 9.07909 9.91839 9.23641 9.91702C9.39373 9.91565 9.54421 9.85255 9.65546 9.74131C9.7667 9.63006 9.82981 9.47957 9.83117 9.32225C9.83254 9.16494 9.77206 9.01338 9.66277 8.90021L8.03857 7.27601L8.03857 4.52441C8.03857 4.36528 7.97535 4.21267 7.86283 4.10015C7.75031 3.98763 7.5977 3.92441 7.43857 3.92441Z"
                      fill="#FFA927"
                    />
                  </svg>
                  {classItem?.time || "Time: N/A"}
                </p>

                {/* Time Remaining */}
                <p className="text-sm text-[#7ECA9D] text-right mt-2 flex-1">
                  {getTimeDifference(classItem?.date, classItem?.time)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UpComingClass;