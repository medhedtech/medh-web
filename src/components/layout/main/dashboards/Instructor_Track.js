"use client";
import React, { useState } from "react";
import "@/assets/css/Calendar.css";
import Icon1 from "@/assets/images/dashbord/icon1.svg";
import Icon2 from "@/assets/images/dashbord/icon2.svg";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Instructor_Tracking_component = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const quickStats = [
    {
      title: "Total Class Taken",
      value: 2,
      icon: Icon1,
    },
    {
      title: "Total Working Hours",
      value: 12,
      icon: Icon2,
    },
    // {
    //   title: "Course 1",
    //   value: 5,
    //   icon: Icon1,
    // },
    // {
    //   title: "Course 2",
    //   value: 5,
    //   icon: Icon2,
    // },
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
              className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="To"
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
