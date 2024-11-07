"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const AddCourse = () => {
  const [courseVideo, setCourseVideo] = useState(null);
  const [pdfBrochure, setPdfBrochure] = useState(null);
  const router = useRouter();

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    setCourseVideo(file);
  };

  const handlePdfUpload = (event) => {
    const file = event.target.files[0];
    setPdfBrochure(file);
  };
  const handleContinueClick = () => {
    router.push("/dashboards/admin-add-data");
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-8 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-6xl">
        <h2 className="text-2xl font-semibold mb-6">Add Course Details</h2>

        {/* Select Category */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <label className="block text-gray-700 font-medium mb-2">
              Select Category
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="category" className="text-customGreen" />
              <span className="text-green-500 font-semibold">Live Courses</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="category" className="text-customGreen" />
              <span>Blended Courses</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="category" className="text-customGreen" />
              <span>Cooperate Training Courses</span>
            </label>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Course Title</label>
            <input
              type="text"
              placeholder="enter title"
              className="p-3 border rounded-lg w-full text-gray-600 placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Category Type (Live/ Hybrid/ Pre-Recorded)</label>
            <select className="p-3 border rounded-lg w-full text-gray-600">
              <option value="">select type</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">No. of Sessions</label>
            <input
              type="text"
              placeholder="enter sessions"
              className="p-3 border rounded-lg w-full text-gray-600 placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Duration (In months/ weeks)</label>
            <select className="p-3 border rounded-lg w-full text-gray-600">
              <option value="">select type</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Session Duration</label>
            <input
              type="text"
              placeholder="enter sessions"
              className="p-3 border rounded-lg w-full text-gray-600 placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Course Description</label>
            <input
              type="text"
              placeholder="write description"
              className="p-3 border rounded-lg w-full text-gray-600 placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Course Fee</label>
            <input
              type="text"
              placeholder="Enter Fee"
              className="p-3 border rounded-lg w-full text-gray-600 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Upload Section */}
        <div className="flex flex-wrap gap-4 mb-6 justify-start">
          <div className="border-dashed border-2 bg-purple border-gray-300 rounded-lg p-3 w-[210px] h-[140px] text-center relative">
            <p className="font-semibold mb-1">Add Course Videos</p>
            <svg
              width="36"
              height="36"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mt-2 mx-auto"
            >
              <path
                d="M8 40C6.9 40 5.95867 39.6087 5.176 38.826C4.39333 38.0433 4.00133 37.1013 4 36V22C4.86667 22.6667 5.81667 23.1667 6.85 23.5C7.88333 23.8333 8.93333 24 10 24C12.7667 24 15.1253 23.0247 17.076 21.074C19.0267 19.1233 20.0013 16.7653 20 14C20 12.9333 19.8333 11.8833 19.5 10.85C19.1667 9.81667 18.6667 8.86667 18 8H32C33.1 8 34.042 8.392 34.826 9.176C35.61 9.96 36.0013 10.9013 36 12V21L44 13V35L36 27V36C36 37.1 35.6087 38.042 34.826 38.826C34.0433 39.61 33.1013 40.0013 32 40H8ZM8 20V16H4V12H8V8H12V12H16V16H12V20H8ZM10 32H30L23.25 23L18 30L14.75 25.65L10 32Z"
                fill="#808080"
              />
            </svg>
            <p className="text-customGreen cursor-pointer text-sm">Click to upload</p>
            <p className="text-gray-400 text-xs">or drag & drop</p>
            <input
              type="file"
              accept="video/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleVideoUpload}
            />
            {courseVideo && (
              <p className="mt-1 text-xs text-gray-500">
                Uploaded: {courseVideo.name}
              </p>
            )}
          </div>
          <div className="border-dashed border-2  bg-purple border-gray-300 rounded-lg p-3 w-[210px] h-[140px] text-center relative">
            <p className="font-semibold mb-1">Add PDF Brochure</p>
            <svg
              width="36"
              height="36"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mt-2 mx-auto"
            >
              <path
                d="M8 40C6.9 40 5.95867 39.6087 5.176 38.826C4.39333 38.0433 4.00133 37.1013 4 36V22C4.86667 22.6667 5.81667 23.1667 6.85 23.5C7.88333 23.8333 8.93333 24 10 24C12.7667 24 15.1253 23.0247 17.076 21.074C19.0267 19.1233 20.0013 16.7653 20 14C20 12.9333 19.8333 11.8833 19.5 10.85C19.1667 9.81667 18.6667 8.86667 18 8H32C33.1 8 34.042 8.392 34.826 9.176C35.61 9.96 36.0013 10.9013 36 12V21L44 13V35L36 27V36C36 37.1 35.6087 38.042 34.826 38.826C34.0433 39.61 33.1013 40.0013 32 40H8ZM8 20V16H4V12H8V8H12V12H16V16H12V20H8ZM10 32H30L23.25 23L18 30L14.75 25.65L10 32Z"
                fill="#808080"
              />
            </svg>
            <p className="text-customGreen cursor-pointer text-sm">Click to upload</p>
            <p className="text-gray-400 text-xs">or drag & drop the file</p>
            <input
              type="file"
              accept=".pdf"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handlePdfUpload}
            />
            {pdfBrochure && (
              <p className="mt-1 text-xs text-gray-500">
                Uploaded: {pdfBrochure.name}
              </p>
            )}
          </div>
        </div>

        {/* Cancel and Continue Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <button className="bg-gray-200 text-black py-2 px-4 rounded-lg mt-6">
            Cancel
          </button>
          <button
            className="bg-customGreen text-white py-2 px-4 rounded-lg mt-6"
            onClick={handleContinueClick}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
