"use client";
import React, { useEffect, useState } from "react";
import AiMl from "@/assets/images/courses/Ai&Ml.jpeg";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import moment from "moment";
import { toast } from "react-toastify";
import Image from "next/image";

const UpcomigClasses = () => {
  const [classes, setClasses] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const { getQuery } = useGetQuery();

  // Fetch student ID from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setStudentId(storedUserId);
      } else {
        console.error("No student ID found in localStorage");
      }
    }
  }, []);

  useEffect(() => {
    if (studentId) {
      const fetchUpcomingClasses = async () => {
        try {
          const response = await getQuery({
            url: apiUrls?.onlineMeeting?.getAllMeetingsForAllEmployeees,
          });

          if (response?.meetings) {
            const sortedClasses = response.meetings || [];

            // Separate ongoing classes
            const ongoingClasses = sortedClasses.filter((classItem) => {
              const classDateTime = moment(
                `${classItem.date} ${classItem.time}`,
                "YYYY-MM-DD HH:mm"
              );
              const currentTime = moment();
              const classEndTime = classDateTime.add(1, "hour");

              // Class is ongoing if current time is between start and end time
              return currentTime.isBetween(classDateTime, classEndTime);
            });

            // Sort the remaining classes by date/time
            const upcomingClasses = sortedClasses.filter(
              (classItem) => !ongoingClasses.includes(classItem)
            );

            const sortedUpcomingClasses = upcomingClasses.sort((a, b) => {
              const aDateTime = moment(
                `${a.date} ${a.time}`,
                "YYYY-MM-DD HH:mm"
              );
              const bDateTime = moment(
                `${b.date} ${b.time}`,
                "YYYY-MM-DD HH:mm"
              );
              return aDateTime - bDateTime;
            });

            // Combine ongoing classes with sorted upcoming classes
            setClasses(
              [...ongoingClasses, ...sortedUpcomingClasses].slice(0, 4)
            );
          } else {
            console.error("No meetings data found in response");
          }
        } catch (error) {
          console.error("Error fetching upcoming classes:", error);
          toast.error("Failed to fetch upcoming classes.");
        }
      };

      fetchUpcomingClasses();
    }
  }, [studentId]);

  const handleJoinClick = (classItem) => {
    const classDateTime = moment(
      `${classItem.date} ${classItem.time}`,
      "YYYY-MM-DD HH:mm"
    );
    const currentTime = moment();
    const minutesDifference = classDateTime.diff(currentTime, "minutes");

    // Check if the class is scheduled to start within the next 30 minutes
    if (minutesDifference > 30) {
      toast.info(
        "Meeting link will be enabled 30 minutes before the class starts."
      );
    }
    // Check if the class is ongoing
    else if (minutesDifference <= 30 && minutesDifference >= 0) {
      window.open(classItem.meet_link, "_blank");
    } else {
      const classEndTime = classDateTime.add(1, "hour");
      if (currentTime.isBefore(classEndTime)) {
        window.open(classItem.meet_link, "_blank");
      } else {
        toast.warning("This class has already ended. You cannot join.");
      }
    }
  };

  return (
    <div className="px-10 pb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-size-32 font-Open dark:text-white">
          Upcoming Classes
        </h2>
        {/* <a
          href="/dashboards/student-upcoming-classes"
          className="text-green-500 hover:underline"
        >
          View All
        </a> */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {classes.length > 0 ? (
          classes.map((classItem, index) => (
            <div
              key={index}
              className="flex flex-col justify-between bg-white shadow p-4 rounded-lg h-full"
            >
              <div>
                <Image
                  src={classItem.course_image || AiMl}
                  alt={classItem.meet_title}
                  className="w-full h-40 object-cover rounded"
                />
                <h3 className="mt-2 font-bold text-lg truncate min-h-[40px]">
                  {classItem.meet_title || "Untitled Class"}
                </h3>
                <p className="mt-2 font-normal text-sm truncate text-gray-600 min-h-[20px]">
                  {classItem.course_name || "Untitled Course"}
                </p>
                <p className="text-gray-500 mt-2">
                  {moment(classItem.date).format("DD/MM/YYYY")} {classItem.time}
                </p>
              </div>
              <button
                className="mt-4 px-4 py-2 bg-primaryColor text-white font-semibold rounded-xl hover:bg-green-600 transition"
                onClick={() => handleJoinClick(classItem)}
              >
                Join
              </button>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No upcoming classes available.
          </p>
        )}
      </div>
    </div>
  );
};

export default UpcomigClasses;
