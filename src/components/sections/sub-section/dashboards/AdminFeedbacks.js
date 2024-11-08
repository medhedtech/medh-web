"use client";
import { GreenSearch, SearchIcon } from "@/assets/images/icon/SearchIcon";
import { useState } from "react";

const AdminFeedbacks = () => {
  const [focused, setFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  return (
    <div className="p-6 md:p-10 bg-white shadow rounded-lg mb-8 font-Poppins">
      {/* Heading Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
          Instructor Highlights
        </h2>
        <div className="flex items-center space-x-4 ml-[-24px]">
          <div className={`relative ${focused ? "w-full" : "w-80"}`}>
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
          <button className="bg-gray-100 text-gray-600 py-2 px-4 rounded-lg">
            Filters
          </button>
          <button className="bg-gray-100 text-gray-600 py-2 px-4 rounded-lg">
            New to oldest
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-[#232323] font-medium bg-gray-100">
            <tr>
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
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
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
