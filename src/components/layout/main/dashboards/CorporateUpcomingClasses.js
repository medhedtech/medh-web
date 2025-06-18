"use client";
import React, { useEffect, useState } from "react";
import AiMl from "@/assets/images/courses/Ai&Ml.jpeg";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import moment from "moment";
import Image from "next/image";
import { FaArrowLeft, FaBook } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Preloader from "@/components/shared/others/Preloader";

const CorporateUpcomigClasses = () => {
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
      showToast.info(
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
        showToast.warning("This class has already ended. You cannot join.");
      }
    }
  };

  // Check if the class is ongoing (between 10 minutes before and 5 minutes after)
  const isClassOngoing = (classItem) => {
    const classDateTime = moment(
      `${classItem.date} ${classItem.time}`,
      "YYYY-MM-DD HH:mm"
    );
    const classEndTime = classDateTime.add(1, "hour");
    const currentTime = moment();

    // Check if the class is in the "live" period (from 10 minutes before to 5 minutes after)
    const startLiveTime = classDateTime.subtract(10, "minutes"); // 10 minutes before class start
    const endLiveTime = classEndTime.add(5, "minutes"); // 5 minutes after class ends

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
            router.push("/dashboards/coorporate-dashboard");
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
          <div className="col-span-full text-center bg-white shadow-lg p-6 rounded-lg">
            <div className="flex justify-center items-center text-primaryColor mb-4">
              <FaBook className="text-6xl mx-2" />
            </div>
            <p className="text-2xl font-semibold text-gray-700">
              No upcoming classes available
            </p>
            <p className="text-gray-500 mt-2 text-lg">
              Please{" "}
              <span className="text-primaryColor font-bold underline cursor-pointer">
                enroll
              </span>{" "}
              in a course to see your upcoming classes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CorporateUpcomigClasses;
