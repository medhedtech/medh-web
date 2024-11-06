// pages/online-meeting.js
"use client";
import React, { useState } from 'react';
import { FaCalendarAlt, FaClock, FaCopy, FaShareAlt } from 'react-icons/fa';

const OnlineMeeting = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const meetings = [
    {
      title: 'Online meeting with Teachers',
      date: '01-11-2024',
      time: '12:30 AM - 01:40 PM',
      startsIn: 'Starts in 30 minutes.',
    },
    {
      title: 'Online meeting with Students',
      date: '01-11-2024',
      time: '12:30 AM - 01:40 PM',
      startsIn: 'Starts in 2 hours 30 minutes.',
    },
    {
      title: 'Online meeting with Teachers',
      date: '01-11-2024',
      time: '12:30 AM - 01:40 PM',
      startsIn: null,
    },
  ];

  const openModal = () => {
    setIsModalOpen(true);
    console.log("Modal opened"); // For debugging: Check if this logs when you click the button
  };

  const closeModal = () => {
    setIsModalOpen(false);
    console.log("Modal closed"); // For debugging: Check if this logs when you close the modal
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-start pt-8"> {/* Removed pt-1 */}
      <div className="bg-white shadow-lg rounded-lg w-full max-w-6xl p-6 sm:p-8 md:p-10 mx-auto"> {/* Added mx-auto for center alignment */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Online Meeting</h2>
          <button
            className="bg-customGreen text-white px-4 py-2 rounded-lg hover:bg-customGreen"
            onClick={openModal} // Open modal on click
          >
            + Create Meeting
          </button>
        </div>

        {/* Meetings List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {meetings.map((meeting, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">
                Meeting Title: {meeting.title}
              </h3>
              {meeting.startsIn && (
                <p className="text-customGreen text-sm mb-2">{meeting.startsIn}</p>
              )}
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <FaCalendarAlt className="mr-2" />
                <span>{meeting.date}</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm mb-4">
                <FaClock className="mr-2" />
                <span>{meeting.time}</span>
              </div>
              <div className="flex items-center gap-2 text-customGreen text-sm">
                <button className="flex items-center gap-1 hover:text-customGreen">
                  <FaCopy />
                  <span>Copy</span>
                </button>
                <span className="text-gray-400">|</span>
                <button className="flex items-center gap-1 hover:text-customGreen">
                  <FaShareAlt />
                  <span>Share</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                onClick={closeModal}
              >
                &times;
              </button>
              <h2 className="text-xl font-semibold mb-4">Create online Meeting</h2>
              <p className="text-sm mb-4">
                <strong>Create the Link</strong>
                <br />
                1. Go to <a href="https://meet.google.com" target="_blank" className="text-customGreen hover:underline">Google Meet</a> and generate a link.
                <br />
                2. Copy the Link and Paste below
              </p>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Enter the Course Name</label>
                  <input
                    type="text"
                    placeholder="Enter the Name"
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Paste the link</label>
                  <input
                    type="text"
                    placeholder="Enter the meeting URL here"
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Meeting Title</label>
                  <input
                    type="text"
                    placeholder="Meeting Title: Online meeting with Teachers"
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-gray-700 font-medium mb-1">Set the Date</label>
                    <div className="flex items-center px-4 py-2 border rounded-lg text-gray-700">
                      <FaCalendarAlt className="mr-2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="19-10-2024"
                        className="w-full focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-700 font-medium mb-1">Set the Time</label>
                    <div className="flex items-center px-4 py-2 border rounded-lg text-gray-700">
                      <FaClock className="mr-2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="7:00 PM"
                        className="w-full focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <button
                className="mt-6 w-full bg-customGreen text-white py-2 rounded-lg hover:bg-customGreen"
                onClick={closeModal}
              >
                Create New Meeting
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineMeeting;
