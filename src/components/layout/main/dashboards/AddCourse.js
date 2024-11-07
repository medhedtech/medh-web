"use client";
import React, { useState } from "react";

const AddCourse = () => {
  const [courseVideo, setCourseVideo] = useState(null);
  const [pdfBrochure, setPdfBrochure] = useState(null);

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    setCourseVideo(file);
  };

  const handlePdfUpload = (event) => {
    const file = event.target.files[0];
    setPdfBrochure(file);
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
              <input
                type="radio"
                name="category"
                className="text-customGreen"
              />
              <span className="text-green-500 font-semibold">Live Courses</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="category"
                className="text-customGreen"
              />
              <span>Blended Courses</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="category"
                className="text-customGreen"
              />
              <span>Cooperate Training Courses</span>
            </label>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="enter title"
            className="p-3 border rounded-lg w-full text-gray-600 placeholder-gray-400"
          />
          <select className="p-3 border rounded-lg w-full text-gray-600">
            <option value="">select type</option>
          </select>
          <input
            type="text"
            placeholder="enter sessions"
            className="p-3 border rounded-lg w-full text-gray-600 placeholder-gray-400"
          />
          <select className="p-3 border rounded-lg w-full text-gray-600">
            <option value="">select type</option>
          </select>
          <input
            type="text"
            placeholder="enter sessions"
            className="p-3 border rounded-lg w-full text-gray-600 placeholder-gray-400"
          />
          <input
            type="text"
            placeholder="write description"
            className="p-3 border rounded-lg w-full text-gray-600 placeholder-gray-400"
          />
          <input
            type="text"
            placeholder="Enter Fee"
            className="p-3 border rounded-lg w-full text-gray-600 placeholder-gray-400"
          />
        </div>

        {/* Upload Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="border-dashed border-2 border-gray-300 rounded-lg p-6 text-center relative">
            <p className="font-semibold mb-2">Add Course Videos</p>
            <p className="text-customGreen cursor-pointer">Click to upload</p>
            <p className="text-gray-400">or drag & drop</p>
            <input
              type="file"
              accept="video/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleVideoUpload}
            />
            {courseVideo && (
              <p className="mt-2 text-sm text-gray-500">
                Uploaded: {courseVideo.name}
              </p>
            )}
          </div>
          <div className="border-dashed border-2 border-gray-300 rounded-lg p-6 text-center relative">
            <p className="font-semibold mb-2">Add PDF Brochure</p>
            <p className="text-customGreen cursor-pointer">Click to upload</p>
            <p className="text-gray-400">or drag & drop the file</p>
            <input
              type="file"
              accept=".pdf"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handlePdfUpload}
            />
            {pdfBrochure && (
              <p className="mt-2 text-sm text-gray-500">
                Uploaded: {pdfBrochure.name}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button className="bg-gray-200 text-gray-700 py-2 px-6 rounded-lg">
            Cancel
          </button>
          <button className="bg-green-500 text-white py-2 px-6 rounded-lg">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
