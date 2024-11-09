"use client";

// pages/AssignInstructor.js

import React, { useState } from "react";

const AssignInstructor = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen font-Poppins bg-gray-100 p-6 flex items-center pt-9 justify-center">
      <div className="container max-w-6xl w-full mx-auto">
        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-Poppins font-semibold mb-4">
            Assign Instructor
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
            <div>
              <label className="block text-[#808080] text-xs px-2 font-Poppins font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Instructor Name"
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label className="block text-[#808080] text-xs px-2 font-Poppins font-medium mb-1">
                Course Name
              </label>
              <select className="w-full px-4 py-2 border rounded-lg text-[#808080] focus:outline-none focus:ring focus:border-blue-300">
                <option>Course</option>
              </select>
            </div>
            <div>
              <label className="block text-[#808080] text-xs px-2 font-Poppins font-medium mb-1">
                Email Id
              </label>
              <input
                type="email"
                placeholder="enteremail@gmail.com"
                className="w-full px-4 py-2 border rounded-lg text-[#808080] focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label className="block text-[#808080] text-xs px-2 font-Poppins font-medium mb-1">
                Type
              </label>
              <select className="w-full px-4 py-2 border rounded-lg text-[#808080] focus:outline-none focus:ring focus:border-blue-300">
                <option>Course Type</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg mr-2 hover:bg-gray-300"
              onClick={() => {}}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-customGreen text-white rounded-lg hover:bg-customGreen"
              onClick={openModal} // Open modal on click
            >
              Assign Instructor
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white font-Poppins rounded-lg shadow-md p-6">
          <h2 className="text-xl font-Poppins font-semibold mb-4">
            Assigned Instructor
          </h2>
          <table className="min-w-full  bg-white border rounded-lg">
            <thead>
              <tr>
                <th className="py-2 border-b text-[#323232] text-sm font-semibold">
                  No.
                </th>
                <th className="py-2 border-b text-[#323232] text-sm font-semibold">
                  Name
                </th>
                <th className="py-2 border-b text-[#323232] text-sm font-semibold">
                  Course
                </th>
                <th className="py-2 border-b text-[#323232] text-sm font-semibold">
                  Date & Time
                </th>
                <th className="py-2 border-b text-[#323232] text-sm font-semibold">
                  Type
                </th>
                <th className="py-2 border-b text-[#323232] text-sm font-semibold">
                  Edit
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  id: "01",
                  name: "Roger Workman",
                  course: "Course 1",
                  date: "2024/07/13 12:30",
                  type: "Live",
                },
                {
                  id: "02",
                  name: "Kianna Geidt",
                  course: "Course 1",
                  date: "2024/07/13 12:30",
                  type: "Demo",
                },
                {
                  id: "03",
                  name: "Kadin Dokidis",
                  course: "Course 1",
                  date: "2024/07/13 12:30",
                  type: "Corporate",
                },
                {
                  id: "04",
                  name: "Makenna Gouse",
                  course: "Course 1",
                  date: "2024/07/13 12:30",
                  type: "Institute",
                },
                {
                  id: "05",
                  name: "Tiana Vetrovs",
                  course: "Course 1",
                  date: "2024/07/13 12:30",
                  type: "Corporate",
                },
                {
                  id: "06",
                  name: "Roger Aminoff",
                  course: "Course 1",
                  date: "2024/07/13 12:30",
                  type: "Demo",
                },
              ].map((instructor) => (
                <tr key={instructor.id}>
                  <td className="py-2 border-b text-center font-Poppins text-[#808080] font-medium">
                    {instructor.id}
                  </td>
                  <td className="py-2 border-b text-center font-medium">
                    {instructor.name}
                  </td>
                  <td className="py-2 border-b text-center text-[#808080] font-medium font-Poppins">
                    {instructor.course}
                  </td>
                  <td className="py-2 border-b text-center text-[#808080] font-medium font-Poppins">
                    {instructor.date}
                  </td>
                  <td className="py-2 border-b text-center text-[#808080] font-medium font-Poppins">
                    {instructor.type}
                  </td>
                  <td className="py-2 border-b text-center">
                    <a href="#" className="text-green-500 hover:text-green-700">
                      <svg
                        width="17"
                        height="16"
                        viewBox="0 0 17 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.1583 1.33984L15.1583 3.33984L13.6337 4.86518L11.6337 2.86518L13.1583 1.33984ZM5.83301 10.6652H7.83301L12.691 5.80718L10.691 3.80718L5.83301 8.66518V10.6652Z"
                          fill="#7ECA9D"
                        />
                        <path
                          d="M13.1667 12.6667H5.93867C5.92133 12.6667 5.90333 12.6733 5.886 12.6733C5.864 12.6733 5.842 12.6673 5.81933 12.6667H3.83333V3.33333H8.398L9.73133 2H3.83333C3.098 2 2.5 2.59733 2.5 3.33333V12.6667C2.5 13.4027 3.098 14 3.83333 14H13.1667C13.5203 14 13.8594 13.8595 14.1095 13.6095C14.3595 13.3594 14.5 13.0203 14.5 12.6667V6.888L13.1667 8.22133V12.6667Z"
                          fill="#7ECA9D"
                        />
                      </svg>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl">
              <h2 className="text-xl font-semibold mb-4">
                Edit Assigned Instructor
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Instructor Name"
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Course Name
                  </label>
                  <select className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:border-blue-300">
                    <option>Course</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Date & Time
                  </label>
                  <input
                    type="text"
                    placeholder="2024/07/13 12:30"
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Type
                  </label>
                  <select className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:border-blue-300">
                    <option>Course Type</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg mr-2 hover:bg-gray-300"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignInstructor;
