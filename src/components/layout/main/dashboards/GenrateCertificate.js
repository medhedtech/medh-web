// pages/certificate.js
"use client";
import React, { useState } from "react";
import {
  FaFilter,
  FaSort,
  FaChevronRight,
  FaSearch,
  FaCalendarAlt,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CertificatePage = () => {
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [completionDate, setCompletionDate] = useState(null);

  const users = [
    {
      id: 1,
      name: "Nitesh Yadav",
      course: "The Communication Mastery",
      date: "25th August",
      profileImage: "/images/profileImg.png",
    },
    {
      id: 2,
      name: "Nitesh Yadav",
      course: "The Communication Mastery",
      date: "25th August",
      profileImage: "/images/profileImg.png",
    },
    {
      id: 3,
      name: "PT Usha",
      course: "The React Mastery",
      date: "25th August",
      profileImage: "/images/profileImg.png",
    },
    {
      id: 4,
      name: "PT Usha",
      course: "The React Mastery",
      date: "25th August",
      profileImage: "/images/profileImg.png",
    },
    {
      id: 5,
      name: "PV Sindhu",
      course: "The WEB Basics",
      date: "25th August",
      profileImage: "/images/profileImg.png",
    },
    {
      id: 6,
      name: "PV Sindhu",
      course: "The WEB Basics",
      date: "25th August",
      profileImage: "/images/profileImg.png",
    },
  ];

  const handleGenerateCertificate = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen pt-9 bg-gray-100 p-6">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Certificate</h2>
          <button className="flex items-center text-gray-500 hover:text-gray-700">
            <span className="mr-1">View all</span>
            <FaChevronRight />
          </button>
        </div>

        <h3 className="text-xl font-semibold mb-4">Issue Certificate</h3>

        <div className="flex items-center mb-6 space-x-4">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search..."
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
          </div>

          <button
            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
            className="px-6 py-2 border-gray-400 border text-gray-700 rounded-full hover:bg-gray-300 flex items-center"
          >
            <FaFilter className="mr-2" />
            Filter
          </button>

          <button
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            className="px-6 py-2 border-gray-400 border  text-gray-700 rounded-full hover:bg-gray-300 flex items-center"
          >
            <FaSort className="mr-2" />
            Sort
          </button>
        </div>

        <div className="space-y-9">
          {users.map((user) => (
            <div key={user.id} className="flex justify-between items-center ">
              <div className="flex items-center">
                <img
                  src={user.profileImage}
                  alt={`${user.name} profile`}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-600">
                    Completed{" "}
                    <span className="text-customGreen underline cursor-pointer">
                      {user.course}
                    </span>{" "}
                    on {user.date}
                  </p>
                </div>
              </div>
              <button
                onClick={handleGenerateCertificate}
                className="text-customGreen font-normal hover:underline"
              >
                Generate Certificate
              </button>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center  bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4 font-Poppins text-[#434343]">
              Generate Certificate
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700">Course Name</label>
                <input
                  type="text"
                  placeholder="Course Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700">Student Name</label>
                <input
                  type="text"
                  placeholder="Student Name"
                  value="Nitish Kumar"
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-gray-700">Instructor Name</label>
                <input
                  type="text"
                  placeholder="Instructor Name"
                  value="John Doe"
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-gray-700">Completion Date</label>
                <div className="relative">
                  {/* Calendar Icon */}
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                  {/* Date Picker Field */}
                  <DatePicker
                    selected={completionDate}
                    onChange={(date) => setCompletionDate(date)}
                    placeholderText="Select Completion Date"
                    dateFormat="dd-MM-yyyy"
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md bg-white" // Increased px to match other fields
                  />
                </div>
              </div>

              <button
                type="button"
                className="w-full py-2 bg-primaryColor text-white font-semibold rounded-full hover:bg-green-600"
              >
                Generate Certificate
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificatePage;
