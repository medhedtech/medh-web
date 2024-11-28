"use client";
import Image from "next/image";
import React, { useState } from "react";

const AssignmentCard = ({ title, instructor, status, daysLeft, image }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statusStyles = {
    dueSoon: "text-[#F50909]",
    dueTomorrow: "text-[#2E9800]",
    pending: "text-[#FFA927]",
  };

  let statusText;
  let statusColor;

  if (daysLeft <= 1) {
    statusText = `Assignment Due to ${daysLeft} Day`;
    statusColor = statusStyles.dueTomorrow;
  } else if (daysLeft <= 3) {
    statusText = `Assignment Due to ${daysLeft} Days`;
    statusColor = statusStyles.dueSoon;
  } else {
    statusText = "Assignment Pending";
    statusColor = statusStyles.pending;
  }

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-5 font-Open border rounded-lg shadow-sm">
      <div className="flex items-center">
        <Image
          src={image}
          alt="assignment thumbnail"
          className="w-27 h-27 rounded-md mr-4"
        />
        <div className="w-full">
          <h3 className="text-sm text-[#171A1F] font-Open dark:text-white">
            {title}
          </h3>
          <p className="text-size-11 text-[#9095A0]">
            Instructor: {instructor}
          </p>

          <div className="flex items-start flex-col md:flex-row md:justify-between">
            <p className={`text-sm font-medium mt-5 ${statusColor}`}>
              {statusText}
            </p>
            <button
              className="text-primaryColor mt-5 text-sm font-medium"
              onClick={openModal}
            >
              Submit Now
            </button>
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg px-10 py-5 w-[705px] dark:bg-black shadow-lg relative">
            <button
              className="absolute top-5 right-4 font-bold hover:text-gray-700 dark:text-white"
              onClick={closeModal}
            >
              ✕
            </button>
            <h2 className="text-xl text-center font-semibold mb-4 dark:text-white">
              Submit Assignment
            </h2>
            <form>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-xl font-semibold text-[#434343] dark:text-whitegrey1"
                >
                  Course Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="mt-6 block w-full p-2 border dark:bg-inherit border-gray-300 rounded-md"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="mb-7">
                <label
                  htmlFor="file"
                  className="block text-xl font-semibold text-[#434343] dark:text-whitegrey1"
                >
                  Upload File
                </label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  className="mt-6 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white bg-primaryColor py-2 rounded-full hover:bg-blue-700"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentCard;
