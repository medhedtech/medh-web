"use client";
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "@/assets/css/Calendar.css";
import Icon1 from "@/assets/images/dashbord/icon1.svg";
import Icon2 from "@/assets/images/dashbord/icon2.svg";
import Image from "next/image";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import moment from "moment";

const getTimeDifference = (meetingDate, meetingTime) => {
  const now = moment();
  const meetingMoment = moment(
    `${meetingDate} ${meetingTime}`,
    "YYYY-MM-DD HH:mm"
  );
  const diffMinutes = meetingMoment.diff(now, "minutes");

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

const InstructorDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [instructorId, setInstructorId] = useState("673c756ca9054a9bbf673e0e");
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalAssignments, setTotalAssignments] = useState(0);

  // Get query hook
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

  const fetchSubmittedAssignments= async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getQuery({
        url: `${apiUrls?.assignments?.assignmentsCountByInstructorId}/${instructorId}`,
      });
      setTotalAssignments(res?.submittedAssignmentsCount || 0);
    } catch (err) {
      console.error("Error fetching upcoming classes:", err);
      setError("Failed to load upcoming classes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (instructorId) {
      const fetchUpcomingClasses = async () => {
        setLoading(true);
        setError(null);

        try {
          const res = await getQuery({
            url: `${apiUrls?.onlineMeeting?.getMeetingsByInstructorId}/${instructorId}`,
          });
          setUpcomingClasses(res?.meetings || []);
          setTotalCourses(res?.courseCount || 0);
        } catch (err) {
          console.error("Error fetching upcoming classes:", err);
          setError("Failed to load upcoming classes.");
        } finally {
          setLoading(false);
        }
      };

      fetchUpcomingClasses();
      fetchSubmittedAssignments()
    }
  }, [instructorId]);

  const filteredClasses = upcomingClasses.filter((classItem) => {
    const classDate = moment(classItem.date);
    const selectedMoment = moment(selectedDate);
    return classDate.isSame(selectedMoment, "day");
  });

  const quickStats = [
    {
      title: "Total Courses",
      value: totalCourses,
      icon: Icon1,
    },
    {
      title: "View Received Assignments",
      value: totalAssignments,
      icon: Icon2,
    },
  ];

  const QuickStats = ({ stats }) => (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-inherit dark:text-white border-2 dark:border rounded-lg p-6 m-10 text-center"
        >
          <p className="text-2xl font-bold text-gray-800 dark:text-whitegrey1">
            {stat.value}
          </p>
          <div className="flex justify-center">
            <span>
              <Image src={stat.icon} alt="icon" className="" />
            </span>
            <p className="text-xs pl-2 my-auto">{stat.title}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const UpcomingClasses = ({ classes }) => (
    <div className="bg-white dark:bg-inherit dark:border shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4 dark:text-white">
        <p className="text-2xl font-Open font-semibold dark:text-white text-gray-800">
          Upcoming Classes
        </p>
        <a href="/dashboards/instructor-mainclass/all-classess" className="text-sm text-blue-500 hover:underline">
          View all
        </a>
      </div>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
        {classes.length > 0 ? (
          classes.map((classItem, index) => {
            return (
              <div
                key={index}
                className="flex items-center gap-4 border rounded-lg p-4"
              >
                <div className="h-24 w-24 rounded-md bg-gray-200 flex-shrink-0">
                  <Image
                    src={
                      classItem.courseDetails?.course_image ||
                      "/default-image.jpg"
                    }
                    width={300}
                    height={150}
                    alt={classItem.meet_title}
                    className="h-full w-full object-cover rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-800 dark:text-whitegrey">
                    {classItem?.courseDetails?.course_title}
                  </p>
                  <p className="text-sm text-gray-500 flex">
                    <span>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        className="my-auto"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.43857 1.52441C10.7524 1.52441 13.4386 4.21061 13.4386 7.52441C13.4386 10.8382 10.7524 13.5244 7.43857 13.5244C4.12477 13.5244 1.43857 10.8382 1.43857 7.52441C1.43857 4.21061 4.12477 1.52441 7.43857 1.52441ZM7.43857 3.92441C7.27944 3.92441 7.12683 3.98763 7.0143 4.10015C6.90178 4.21267 6.83857 4.36528 6.83857 4.52441L6.83857 7.52441C6.8386 7.68353 6.90184 7.83612 7.01437 7.94861L8.81437 9.74861C8.92753 9.85791 9.07909 9.91839 9.23641 9.91702C9.39373 9.91565 9.54421 9.85255 9.65546 9.74131C9.7667 9.63006 9.82981 9.47957 9.83117 9.32225C9.83254 9.16494 9.77206 9.01338 9.66277 8.90021L8.03857 7.27601L8.03857 4.52441C8.03857 4.36528 7.97535 4.21267 7.86283 4.10015C7.75031 3.98763 7.5977 3.92441 7.43857 3.92441Z"
                          fill="#C3C3C3"
                        />
                      </svg>
                    </span>
                    {classItem.time}
                  </p>
                  <p className="text-sm text-[#7ECA9D] text-right">
                    {getTimeDifference(classItem.date, classItem.time)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex justify-center items-center h-full bg-gray-100 rounded-lg shadow-lg p-6">
            <div className="text-center">
              <p className="text-xl font-semibold text-gray-600 mb-4">
                No Upcoming Classes
              </p>
              <p className="text-sm text-gray-400">
                Looks like there are no upcoming classes for the selected date.
                Please check back later or select another date.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  return (
    <div className="p-6 min-h-screen">
      <div className="bg-white dark:bg-inherit dark:border shadow-md rounded-lg">
        <p className="p-4 text-2xl font-semibold dark:text-white font-Open">
          Quick Stats
        </p>
        <QuickStats stats={quickStats} />
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 mt-6">
        <div className="col-span-12 lg:col-span-5 bg-white shadow rounded-lg p-6">
          <p className="text-2xl font-semibold text-gray-800 mb-4">Calendar</p>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="react-calendar p-3"
          />
        </div>

        <div className="col-span-12 lg:col-span-7">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <UpcomingClasses classes={filteredClasses} />
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
