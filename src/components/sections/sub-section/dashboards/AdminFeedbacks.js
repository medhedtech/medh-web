"use client";
import { GreenSearch, SearchIcon } from "@/assets/images/icon/SearchIcon";
import { useState } from "react";

const AdminFeedbacks = () => {
  const [focused, setFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInstructors, setSelectedInstructors] = useState([]);

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  const [instructors] = useState([
    {
      id: 1,
      name: "Roger Workman",
      age: 46,
      joinDate: "2024/07/13",
      course: 10,
    },
    {
      id: 2,
      name: "Kianna Geidt",
      age: 76,
      joinDate: "2024/07/01",
      course: 30,
    },
    {
      id: 3,
      name: "Kadin Dokidis",
      age: 58,
      joinDate: "2024/07/04",
      course: 20,
    },
    {
      id: 4,
      name: "Makenna Gouse",
      age: 52,
      joinDate: "2024/07/07",
      course: 15,
    },
    {
      id: 5,
      name: "Tiana Vetrovs",
      age: 45,
      joinDate: "2024/07/10",
      course: 25,
    },
    {
      id: 6,
      name: "Roger Aminoff",
      age: 65,
      joinDate: "2024/07/16",
      course: 18,
    },
  ]);

  const handleCheckboxChange = (id) => {
    setSelectedInstructors((prev) =>
      prev.includes(id)
        ? prev.filter((instructorId) => instructorId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="p-6 md:p-10 bg-white dark:bg-inherit  shadow rounded-lg mb-8 font-Poppins">
      {/* Heading Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-4">
          <h2 className="text-xl md:text-2xl pt-3 font-semibold text-gray-800 dark:text-white">
            Instructor Highlights
          </h2>
          <div className={`relative  ${focused ? "w-full" : "w-80"}`}>
            <SearchIcon
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${
                focused ? "hidden" : "block"
              }`}
            />
            <input
              type="text"
              className={`pl-10 pr-10 py-2 rounded-full shadow-md border w-full ${
                focused
                  ? "border-green-500 text-black font-semibold"
                  : "border-gray-200 text-gray-500"
              } dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none`}
              placeholder="Search anything"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <GreenSearch
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                focused ? "text-green-500" : "text-gray-400"
              } cursor-pointer`}
            />
          </div>
        </div>
        <div className="flex items-center space-x-4 ml-[-24px] ">
          <div className="relative ">
            <select className="appearance-none dark:bg-inherit dark:text-white border border-[#BDB7B7] text-[#323232] outline-none rounded-5px pr-7 pl-3 py-1">
              <option>Filters</option>
            </select>
            <div className="absolute  top-1/2 right-2 transform -translate-y-1/2 pointer-events-none ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-[#808080]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          <div className="relative flex  border border-[#BDB7B7] px-2 rounded-5px">
            <div className="my-auto">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 6.75H21M7.5 12H21M7.5 17.25H21"
                  stroke="#323232"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M3.75 7.5C4.16421 7.5 4.5 7.16421 4.5 6.75C4.5 6.33579 4.16421 6 3.75 6C3.33579 6 3 6.33579 3 6.75C3 7.16421 3.33579 7.5 3.75 7.5Z"
                  stroke="#323232"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M3.75 12.75C4.16421 12.75 4.5 12.4142 4.5 12C4.5 11.5858 4.16421 11.25 3.75 11.25C3.33579 11.25 3 11.5858 3 12C3 12.4142 3.33579 12.75 3.75 12.75Z"
                  stroke="#323232"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M3.75 18C4.16421 18 4.5 17.6642 4.5 17.25C4.5 16.8358 4.16421 16.5 3.75 16.5C3.33579 16.5 3 16.8358 3 17.25C3 17.6642 3.33579 18 3.75 18Z"
                  stroke="#323232"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <select className="appearance-none dark:bg-inherit dark:text-white text-[#323232] outline-none rounded-5px pr-7 pl-3  py-1">
              <option>New to oldest</option>
            </select>
            <div className="absolute  top-1/2 right-2 transform -translate-y-1/2 pointer-events-none ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-[#808080]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-[#232323] font-medium dark:bg-inherit dark:text-white bg-gray-100">
            <tr>
              <th className="px-4 py-3 font-semibold">
                <input type="checkbox" />
              </th>
              <th className="px-4 py-3 font-semibold">No.</th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Age</th>
              <th className="px-4 py-3 font-semibold">Join Date</th>
              <th className="px-4 py-3 font-semibold">Course</th>
              <th className="px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {instructors.map((instructor, index) => (
              <tr
                key={instructor.id}
                className={
                  index % 2 === 0
                    ? "bg-white dark:bg-inherit dark:text-white dark:border-b"
                    : "bg-gray-50 dark:bg-inherit dark:text-white dark:border-b"
                }
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    className="border-[#C0C0C0]"
                    checked={selectedInstructors.includes(instructor.id)}
                    onChange={() => handleCheckboxChange(instructor.id)}
                  />
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {String(index + 1).padStart(2, "0")} .
                </td>
                <td className="px-4 py-3 font-medium">{instructor.name}</td>
                <td className="px-4 py-3">{instructor.age}</td>
                <td className="px-4 py-3">{instructor.joinDate}</td>
                <td className="px-4 py-3">{instructor.course}</td>
                <td className="px-4 py-3 text-gray-400 cursor-pointer">•••</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminFeedbacks;
