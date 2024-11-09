"use client";
import React, { useState } from "react";
import { FaSort, FaPlus, FaChevronDown } from "react-icons/fa";
import AddInstructor from "./AddInstructor";

const UsersTable = () => {
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [showAddInstructorForm, setShowAddInstructorForm] = useState(false);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Roger Workman",
      age: 48,
      email: "enteremail@gmail.com",
      joinDate: "2024/07/13",
      Domain: "Science",
      isActive: true,
    },
    {
      id: 2,
      name: "Kianna Geidt",
      age: 76,
      email: "enteremail@gmail.com",
      joinDate: "2024/07/01",
      Domain: "Psychology",
      isActive: true,
    },
    {
      id: 3,
      name: "Kadin Dokidis",
      age: 58,
      email: "enteremail@gmail.com",
      joinDate: "2024/07/04",
      Domain: "Communication",
      isActive: false,
    },
    {
      id: 4,
      name: "Makenna Gouse",
      age: 52,
      email: "enteremail@gmail.com",
      joinDate: "2024/07/07",
      Domain: "web Devlopment",
      isActive: false,
    },
    {
      id: 5,
      name: "Tiana Vetrovs",
      age: 45,
      email: "enteremail@gmail.com",
      joinDate: "2024/07/10",
      Domain: "App Devlopment",
      isActive: true,
    },
    {
      id: 6,
      name: "Roger Aminoff",
      age: 65,
      email: "enteremail@gmail.com",
      joinDate: "2024/07/16",
      Domain: "Leadership",
      isActive: false,
    },
  ]);

  const toggleStatus = (userId) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, isActive: !user.isActive } : user
      )
    );
  };

  const StatusToggle = ({ isActive, onClick }) => (
    <div className="flex items-center">
      <button
        onClick={onClick}
        className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
          isActive ? "bg-green-500" : "bg-gray-400"
        }`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full transform transition-transform duration-300 ${
            isActive ? "translate-x-5" : "translate-x-0"
          }`}
        ></div>
      </button>
      <span
        className={`ml-2 text-sm font-semibold ${
          isActive ? "text-green-700" : "text-red-700"
        }`}
      >
        {isActive ? "Active" : "Inactive"}
      </span>
    </div>
  );

  const handleAddInstructorClick = () => {
    setShowAddInstructorForm(true);
  };

  const handleCancelAddInstructor = () => {
    setShowAddInstructorForm(false);
  };

  if (showAddInstructorForm) {
    return <AddInstructor onCancel={handleCancelAddInstructor} />;
  }

  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-100 p-4 pt-9">
      <div className="w-full max-w-6xl bg-white p-8 md:p-10 rounded-lg shadow-md font-Poppins">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-4 md:space-y-0">
          <h2 className="text-xl font-semibold md:text-left">
            Instructor List
          </h2>
          <input
            type="text"
            placeholder="Search here"
            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex space-x-2 justify-center md:justify-start">
            {/* Filter Button with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center space-x-1"
              >
                <span>Filters</span>
                <FaChevronDown />
              </button>
              {isFilterDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Filter Option 1
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Filter Option 2
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Filter Option 3
                  </a>
                </div>
              )}
            </div>

            {/* Sort Button with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center space-x-1"
              >
                <span>New to oldest</span>
                <FaChevronDown />
              </button>
              {isSortDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Oldest to New
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Newest to Old
                  </a>
                </div>
              )}
            </div>

            {/* Create User Button with Icon */}
            <button
              className="px-4 py-2 bg-customGreen text-white rounded-md flex items-center space-x-1"
              onClick={handleAddInstructorClick}
            >
              <FaPlus />
              <span>Add Instructor</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse font-Poppins">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Select</th>
                <th className="px-4 py-2 border-b">No.</th>
                <th className="px-4 py-2 border-b">Name</th>
                <th className="px-4 py-2 border-b">Age</th>
                <th className="px-4 py-2 border-b">Email ID</th>
                <th className="px-4 py-2 border-b">Join Date</th>
                <th className="px-4 py-2 border-b">Domain</th>
                <th className="px-4 py-2 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-100 text-center">
                  <td className="px-4 py-2 border-b">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-indigo-600"
                    />
                  </td>
                  <td className="px-4 py-2 border-b text-[#808080]">
                    {String(index + 1).padStart(2, "0")}.
                  </td>
                  <td className="px-4 py-2 border-b">{user.name}</td>
                  <td className="px-4 py-2 border-b text-[#808080]">
                    {user.age}
                  </td>
                  <td className="px-4 py-2 border-b text-[#808080]">
                    {user.email}
                  </td>
                  <td className="px-4 py-2 border-b text-[#808080]">
                    {user.joinDate}
                  </td>
                  <td className="px-4 py-2 border-b text-[#808080]">
                    {user.Domain}
                  </td>
                  <td className="px-4 py-2 border-b">
                    <StatusToggle
                      isActive={user.isActive}
                      onClick={() => toggleStatus(user.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
