"use client";
import React, { useState } from "react";
import Calendar from "react-calendar";
import "@/assets/css/Calendar.css";
import class1 from "@/assets/images/dashbord/class1.png";
import class2 from "@/assets/images/dashbord/class2.png";
import Image from "next/image";
import Icon1 from "@/assets/images/dashbord/icon1.svg";
import Icon2 from "@/assets/images/dashbord/icon2.svg";

const InstructorDashboard = () => {
  const data = {
    quickStats: [
      {
        title: "Total Courses",
        value: 4,
        icon: Icon1,
      },
      {
        title: "View Received Assignments",
        value: 5,
        icon: Icon2,
      },
    ],
    upcomingClasses: [
      {
        title: "Improve your Communication",
        time: "2:30 PM",
        startsIn: "30 minutes",
        image: class1,
      },
      {
        title: "Power of Negotiation",
        time: "2:50 PM",
        startsIn: "50 minutes",
        image: class2,
      },
      {
        title: "Improve your Communication",
        time: "2:30 PM",
        startsIn: "30 minutes",
        image: class1,
      },
      {
        title: "Power of Negotiation",
        time: "2:50 PM",
        startsIn: "50 minutes",
        image: class2,
      },
    ],
  };

  const [selectedDate, setSelectedDate] = useState(new Date());

  const QuickStats = ({ stats }) => (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-inherit dark:text-white dark:border shadow-md rounded-lg p-6 m-10 text-center"
        >
          <p className="text-2xl font-bold text-gray-800 dark:text-whitegrey1">
            {stat.value}
          </p>
          <div className="flex justify-center">
            <span>
              <Image src={stat.icon} alt="icon" className="" />
            </span>
            <p className="text-xs my-auto">{stat.title}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const UpcomingClasses = ({ classes }) => (
    <div className="bg-white dark:bg-inherit dark:border  shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4 dark:text-white">
        <p className="text-2xl font-Open font-semibold dark:text-white text-gray-800">
          Upcoming Classes
        </p>
        <a href="#" className="text-sm text-blue-500 hover:underline">
          View all
        </a>
      </div>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
        {classes.map((classItem, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border rounded-lg p-4"
          >
            <div className="h-24 w-24 rounded-md bg-gray-200 flex-shrink-0">
              <Image
                src={classItem.image}
                alt={classItem.title}
                className="h-full w-full object-cover rounded-md"
              />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm text-gray-800 dark:text-whitegrey">
                {classItem.title}
              </p>
              <p className="text-sm text-gray-500 flex ">
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
                {classItem.startsIn}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 min-h-screen">
      <div className="bg-white dark:bg-inherit dark:border shadow-md rounded-lg">
        <p className="p-4 text-2xl font-semibold dark:text-white font-Open">
          Quick Stats
        </p>
        <QuickStats stats={data.quickStats} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        <div className="col-span-12 md:col-span-3 bg-white shadow rounded-lg p-3">
          <p className="text-2xl font-semibold text-gray-800 mb-4">Calendar</p>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="react-calendar p-1 "
          />
        </div>

        <div className="col-span-12 md:col-span-9">
          <UpcomingClasses classes={data.upcomingClasses} />
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
