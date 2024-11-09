"use client";
import React, { useState } from "react";

const courses = [
  {
    id: 1,
    category: "Live Course",
    name: "Communication",
    instructor: "Roger Workman",
    price: "$400",
    sessions: 23,
    time: "150 hr",
    status: "Published",
  },
  {
    id: 2,
    category: "Live Course",
    name: "Communication",
    instructor: "Roger Workman",
    price: "$400",
    sessions: 23,
    time: "150 hr",
    status: "Published",
  },
  {
    id: 3,
    category: "Blended Course",
    name: "Communication",
    instructor: "Roger Workman",
    price: "$400",
    sessions: 23,
    time: "150 hr",
    status: "Published",
  },
  {
    id: 4,
    category: "Blended Course",
    name: "Communication",
    instructor: "Roger Workman",
    price: "$400",
    sessions: 23,
    time: "150 hr",
    status: "Published",
  },
  {
    id: 5,
    category: "Blended Course",
    name: "Communication",
    instructor: "Roger Workman",
    price: "$400",
    sessions: 23,
    time: "150 hr",
    status: "Upcoming",
  },
  {
    id: 6,
    category: "Blended Course",
    name: "Communication",
    instructor: "Roger Workman",
    price: "$400",
    sessions: 23,
    time: "150 hr",
    status: "Upcoming",
  },
  {
    id: 7,
    category: "Live Course",
    name: "Communication",
    instructor: "Roger Workman",
    price: "$400",
    sessions: 23,
    time: "150 hr",
    status: "Upcoming",
  },
  {
    id: 8,
    category: "Live Course",
    name: "Communication",
    instructor: "Roger Workman",
    price: "$400",
    sessions: 23,
    time: "150 hr",
    status: "Upcoming",
  },
  {
    id: 9,
    category: "Live Course",
    name: "Communication",
    instructor: "Roger Workman",
    price: "$400",
    sessions: 23,
    time: "150 hr",
    status: "Upcoming",
  },
  {
    id: 10,
    category: "Live Course",
    name: "Communication",
    instructor: "Roger Workman",
    price: "$400",
    sessions: 23,
    time: "150 hr",
    status: "Upcoming",
  },
];

export default function Home() {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  const handleDropdownToggle = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const handleFilterDropdownToggle = () => {
    setFilterDropdownOpen(!filterDropdownOpen);
  };

  return (
    <div className="bg-gray-100 font-Poppins min-h-screen pt-8 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Course List</h1>
          <div className="flex items-center space-x-4">
            <div className="relative flex-grow flex justify-center">
              <input
                type="text"
                placeholder="Search here"
                className="border border-gray-300 rounded-full p-2 pl-4 w-full max-w-md" // Adjusted max-width
              />
            </div>
            <div className="relative">
              <button
                onClick={handleFilterDropdownToggle}
                className="border-2 px-4 py-1 rounded-lg flex items-center"
              >
                Filters
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              {filterDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Option 1
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Option 2
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Option 3
                  </button>
                </div>
              )}
            </div>
            <div className="relative">
              <select className="border border-gray-300 rounded-lg p-2">
                <option>New to oldest</option>
              </select>
              <span className="absolute right-3 top-3 text-gray-500"></span>{" "}
              {/* Down arrow icon */}
            </div>
            <button className="bg-customGreen text-white px-4 py-2 rounded-lg flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
              Add Course
            </button>
          </div>
        </header>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3 text-sm font-semibold">
                <input type="checkbox" />
              </th>
              <th className="p-3 text-sm font-semibold">No.</th>
              <th className="p-3 text-sm font-semibold">Category</th>
              <th className="p-3 text-sm font-semibold">Course Name</th>
              <th className="p-3 text-sm font-semibold">Instructor</th>
              <th className="p-3 text-sm font-semibold">Price</th>
              <th className="p-3 text-sm font-semibold">No. of Session</th>
              <th className="p-3 text-sm font-semibold">Total Time</th>
              <th className="p-3 text-sm font-semibold">Status</th>
              <th className="p-3 text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={course.id} className="border-b border-gray-200">
                <td className="p-3 text-sm">
                  <input type="checkbox" />
                </td>
                <td className="p-3 text-sm">{index + 1}</td>
                <td className="p-3 text-sm">{course.category}</td>
                <td className="p-3 text-sm">
                  <div className="flex items-center space-x-2">
                    {/* <img
                      src="/path/to/image.jpg"
                      alt="Course"
                      className="w-8 h-8 rounded-full"
                    /> */}
                    <span>{course.name}</span>
                  </div>
                </td>
                <td className="p-3 text-sm">{course.instructor}</td>
                <td className="p-3 text-sm">{course.price}</td>
                <td className="p-3 text-sm">{course.sessions}</td>
                <td className="p-3 text-sm">{course.time}</td>
                <td className="p-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      course.status === "Published"
                        ? "bg-green-200 text-green-500"
                        : "bg-orange text-orange2"
                    }`}
                  >
                    {course.status}
                  </span>
                </td>
                <td className="p-3 text-sm relative">
                  <button
                    onClick={() => handleDropdownToggle(course.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    &#x2026;
                  </button>
                  {dropdownOpen === course.id && (
                    <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Edit
                      </button>
                      <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
