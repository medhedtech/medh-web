// pages/online-meeting.js
"use client";
import React, { useState } from 'react';
import { FaCalendarAlt, FaClock, FaCopy, FaShareAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import "@/assets/css/popup.css";

const OnlineMeeting = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('07:00');

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
      startsIn: 'Starts in 10 minutes.',
    },
  ];

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-start pt-8">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-6xl p-6 sm:p-8 md:p-10 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Online Meeting</h2>
          <button
            className="bg-customGreen text-white px-4 py-2 rounded-lg hover:bg-customGreen"
            onClick={openModal}
          >
            + Create Meeting
          </button>
        </div>

        {/* Meetings List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {meetings.map((meeting, index) => (
            <div
              key={index}
              className="bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200 w-[298.2px] h-[281.8px] flex flex-col"
            >
              <h3 className="text-lg font-semibold mb-2">
                Meeting Title: {meeting.title}
              </h3>
              {meeting.startsIn && (
                <p className="text-customGreen text-sm mb-2 flex items-center">
                  <svg
                    width="13"
                    height="14"
                    viewBox="0 0 13 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-1"
                  >
                    <path
                      d="M6.30078 11.3016C8.61078 11.3016 10.5008 9.41156 10.5008 7.10156C10.5008 4.79156 8.61078 2.90156 6.30078 2.90156C3.99078 2.90156 2.10078 4.79156 2.10078 7.10156C2.10078 9.41156 3.99078 11.3016 6.30078 11.3016ZM6.30078 1.85156C9.18828 1.85156 11.5508 4.21406 11.5508 7.10156C11.5508 9.98906 9.18828 12.3516 6.30078 12.3516C3.41328 12.3516 1.05078 9.98906 1.05078 7.10156C1.05078 4.21406 3.41328 1.85156 6.30078 1.85156ZM8.92578 8.09906L8.55828 8.78156L5.77578 7.25906V4.47656H6.56328V6.78656L8.92578 8.09906Z"
                      fill="#7ECA9D"
                    />
                  </svg>
                  {meeting.startsIn}
                </p>
              )}
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <FaCalendarAlt className="mr-2" />
                <span>{meeting.date}</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm mb-4">
                <FaClock className="mr-2" />
                <span>{meeting.time}</span>
              </div>
              {/* Copy | Share Section */}
              <div className="flex items-center justify-center gap-2 text-customGreen text-sm mt-auto">
                <button className="flex items-center gap-1 hover:text-customGreen">
                  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_269_7570)">
                      <path d="M16.7666 7.37109H8.43327C7.51279 7.37109 6.7666 8.11729 6.7666 9.03776V17.3711C6.7666 18.2916 7.51279 19.0378 8.43327 19.0378H16.7666C17.6871 19.0378 18.4333 18.2916 18.4333 17.3711V9.03776C18.4333 8.11729 17.6871 7.37109 16.7666 7.37109Z" stroke="#7ECA9D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M3.43327 14.0378C2.5166 14.0378 1.7666 13.2878 1.7666 12.3711V4.03776C1.7666 3.12109 2.5166 2.37109 3.43327 2.37109H11.7666C12.6833 2.37109 13.4333 3.12109 13.4333 4.03776" stroke="#7ECA9D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </g>
                    <defs>
                      <clipPath id="clip0_269_7570">
                        <rect width="20" height="20" fill="white" transform="translate(0.100098 0.703125)" />
                      </clipPath>
                    </defs>
                  </svg>
                  <span>Copy</span>
                </button>
                <span className="text-gray-400">|</span>
                <button className="flex items-center gap-1 hover:text-customGreen">

                  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.4998 4.86849V11.9518M12.9998 6.53516L10.4998 4.03516L7.99984 6.53516M4.6665 10.7018V14.8685C4.6665 15.3105 4.8421 15.7344 5.15466 16.047C5.46722 16.3596 5.89114 16.5352 6.33317 16.5352H14.6665C15.1085 16.5352 15.5325 16.3596 15.845 16.047C16.1576 15.7344 16.3332 15.3105 16.3332 14.8685V10.7018" stroke="#7ECA9D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>

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
                      <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat="dd-MM-yyyy"
                        className="w-full focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-700 font-medium mb-1">Set the Time</label>
                    <div className="flex items-center px-4 py-2 border rounded-lg text-gray-700">
                      <FaClock className="mr-2 text-gray-400" />
                      <TimePicker
                        onChange={setSelectedTime}
                        value={selectedTime}
                        className="w-full focus:outline-none border-none shadow-none"
                        disableClock
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
