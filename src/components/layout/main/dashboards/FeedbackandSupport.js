"use client";
import React, { useState } from "react";

const FeedbackandSupport = () => {
  const [feedbackType, setFeedbackType] = useState("course");
  const [feedbackText, setFeedbackText] = useState("");
  const [complaintName, setComplaintName] = useState("John");
  const [complaintText, setComplaintText] = useState("");

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    // Handle feedback submission here
    console.log("Feedback submitted:", feedbackText);
  };

  const handleComplaintSubmit = (e) => {
    e.preventDefault();
    // Handle complaint submission here
    console.log("Complaint submitted:", complaintText);
  };

  return (
    <div className="p-6 w-full mx-auto">
      <div className="mb-8">
        <h1 className="text-size-32  ">Feedback</h1>

        <form onSubmit={handleFeedbackSubmit}>
          {/* Feedback Type Selector */}
          <div className="flex items-center  space-x-4 mb-4">
            <p className="mb-4 text-size-22">
              Write Review about Course/Instructor
            </p>
            <div className="flex gap-3 mb-2.5 ">
              <label className="flex items-center text-lg text-[#B4BDC4]">
                <input
                  type="radio"
                  value="course"
                  checked={feedbackType === "course"}
                  onChange={() => setFeedbackType("course")}
                  className="mr-2"
                />
                Course
              </label>
              <label className="flex items-center text-lg text-[#B4BDC4]">
                <input
                  type="radio"
                  value="instructor"
                  checked={feedbackType === "instructor"}
                  onChange={() => setFeedbackType("instructor")}
                  className="mr-2"
                />
                Instructor
              </label>
            </div>
          </div>

          {/* Feedback Text Area */}
          <div className="relative w-full mb-4 ">
            <textarea
              placeholder="Type Review................"
              rows="4"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#B4BDC4]"
            />

            {/* Feedback Submit Button positioned inside the textarea */}
            <button
              type="submit"
              className="absolute bottom-4 right-4 px-6 py-2 bg-primaryColor text-white rounded-full hover:bg-green-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      <div>
        <h1 className="text-size-32  mb-2">Complaints & Grievances</h1>

        <form onSubmit={handleComplaintSubmit}>
          {/* Name Input */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={complaintName}
              onChange={(e) => setComplaintName(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-green-300"
            />
          </div>

          {/* Complaint Text Area */}
          <div className="mb-11">
            <label className="block text-gray-700 mb-2">Write Complaint</label>
            <textarea
              placeholder="Write....."
              rows="4"
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
              className="w-1/2 p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-green-300"
            />
          </div>

          {/* Complaint Submit Button */}
          <button
            type="submit"
            className="px-6 py-2 bg-primaryColor text-white rounded-full hover:bg-green-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackandSupport;
