"use client";
import React, { useState, useEffect } from "react";
import "@/assets/css/Calendar.css";
import Icon1 from "@/assets/images/dashbord/icon1.svg";
import Icon2 from "@/assets/images/dashbord/icon2.svg";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";

const Instructor_Tracking_component = () => {
  const { getQuery } = useGetQuery();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [instructorId, setInstructorId] = useState(null);
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalWorkingHours: 0,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("userId");
      if (id) {
        setInstructorId(id);
      } else {
        console.error("Instructor ID not found in localStorage");
      }
    }
  }, []);

  // Fetch instructor statistics when `instructorId` is available
  // useEffect(() => {
  //   if (instructorId) {
  //     const fetchStats = async () => {
  //       try {
  //         const response = await getQuery({
  //           url: `${apiUrls.Session_Count.getCountByInstructorId}/${instructorId}`,
  //         });
  //         const { data } = response || {};
  //         setStats({
  //           totalClasses: data?.totalInactiveClasses || 0,
  //           totalWorkingHours: data?.totalWorkingHours || 0,
  //         });
  //       } catch (error) {
  //         console.error("Error fetching instructor statistics:", error);
  //       }
  //     };
  //     fetchStats();
  //   }
  // }, [instructorId]);
  // Fetch instructor statistics when `instructorId` is available

  useEffect(() => {
    if (instructorId) {
      const fetchStats = async () => {
        try {
          let start = null;
          let end = null;

          // If startDate or endDate are set, adjust them to the start of the day for startDate and end of the day for endDate
          if (startDate) {
            start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
          }

          if (endDate) {
            end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
          }

          // Convert dates to ISO strings
          const startDateString = start ? start.toISOString() : null;
          const endDateString = end ? end.toISOString() : null;

          // If no dates are selected, we don't pass the dates in the request
          const response = await getQuery({
            url: `${
              apiUrls.Session_Count.getCountByInstructorId
            }/${instructorId}?startDate=${startDateString || ""}&endDate=${
              endDateString || ""
            }`,
          });

          const { data } = response || {};
          setStats({
            totalClasses: data?.totalInactiveClasses || 0,
            totalWorkingHours: data?.totalWorkingHours || 0,
          });
        } catch (error) {
          console.error("Error fetching instructor statistics:", error);
        }
      };
      fetchStats();
    }
  }, [instructorId, startDate, endDate]);

  const quickStats = [
    {
      title: "Total Class Taken",
      value: stats.totalClasses,
      icon: Icon1,
    },
    {
      title: "Total Working Hours",
      value: stats.totalWorkingHours,
      icon: Icon2,
    },
  ];

  const QuickStats = ({ stats }) => (
    <div className="grid grid-cols-2 gap-6 py-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center border border-gray-200"
        >
          <p className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</p>
          <div className="flex items-center">
            <Image src={stat.icon} alt="icon" width={24} height={24} />
            <p className="text-sm text-gray-600 pl-2">{stat.title}</p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-start items-center mb-6">
          <p className="text-xl font-semibold text-gray-800">Session Info</p>
          <div className="flex space-x-4 pl-4">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="From"
              dateFormat="dd-MM-yyyy" 
              className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="To"
              dateFormat="dd-MM-yyyy" 
              className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <QuickStats stats={quickStats} />
      </div>
    </div>
  );
};

export default Instructor_Tracking_component;
