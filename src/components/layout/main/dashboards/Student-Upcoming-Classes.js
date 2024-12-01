"use client";
import React, { useEffect, useState } from "react";
import AiMl from "@/assets/images/courses/Ai&Ml.jpeg";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import moment from "moment";
import { toast } from "react-toastify";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Preloader from "@/components/shared/others/Preloader";

const StudentUpcomigClasses = () => {
  const router = useRouter();
  const [classes, setClasses] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const { getQuery, loading } = useGetQuery();

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

  // Fetch upcoming classes
  useEffect(() => {
    if (studentId) {
      const fetchUpcomingClasses = () => {
        getQuery({
          url: `${apiUrls?.onlineMeeting?.getMeetingByStudentId}/${studentId}`,
          onSuccess: (res) => {
            setClasses(res || []);
          },
          onFail: (err) => {
            console.error("Error fetching upcoming classes:", err);
          },
        });
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

  // Check if the class is ongoing (between 10 minutes before and 5 minutes after)
  const isClassOngoing = (classItem) => {
    const classDateTime = moment(`${classItem.date} ${classItem.time}`, "YYYY-MM-DD HH:mm");
    const classEndTime = classDateTime.add(1, "hour");
    const currentTime = moment();

    // Check if the class is in the "live" period (from 10 minutes before to 5 minutes after)
    const startLiveTime = classDateTime.subtract(10, 'minutes'); // 10 minutes before class start
    const endLiveTime = classEndTime.add(5, 'minutes'); // 5 minutes after class ends

    return currentTime.isBetween(startLiveTime, endLiveTime);
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="px-10 pb-12">
      <div className="flex justify-between items-center mb-4">
        <div
          onClick={() => {
            router.push("/dashboards/student-dashboard");
          }}
          className="flex items-center gap-2"
        >
          <FaArrowLeft
            className="cursor-pointer text-gray-700 dark:text-white"
            size={20}
          />
          <h2 className="text-size-32 font-Open dark:text-white">
            Upcoming Classes
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {classes.length > 0 ? (
          classes.map((classItem, index) => {
            // Check if the class is ongoing and should show the "Live" indicator
            const liveIndicator = isClassOngoing(classItem) ? (
              <div className="absolute top-2 left-2 flex items-center space-x-1 p-2 z-10">
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                <span className="text-xs font-semibold text-red-500">Live</span>
              </div>
            ) : null;

            return (
              <div key={index} className="bg-white shadow p-4 rounded-lg relative">
                <Image
                  src={classItem.course_image || AiMl}
                  alt={classItem.meet_title}
                  className="w-full h-40 object-cover rounded"
                />
                {liveIndicator} {/* Show live indicator if class is ongoing */}
                <h3 className="mt-2 font-bold text-lg">
                  {classItem.meet_title || "Untitled Class"}
                </h3>
                <p className="text-gray-500">
                  {moment(classItem.date).format("DD/MM/YYYY")} {classItem.time}
                </p>
                <button
                  className="mt-4 px-4 py-2 bg-primaryColor text-white font-semibold rounded-xl hover:bg-green-600 transition"
                  onClick={() => handleJoinClick(classItem)}
                >
                  Join
                </button>
              </div>
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No upcoming classes available.
          </p>
        )}
      </div>
    </div>
  );
};

export default StudentUpcomigClasses;