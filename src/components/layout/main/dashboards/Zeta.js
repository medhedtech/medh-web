"use client";
import React, { useState } from 'react';
import { FaSort, FaPlus, FaChevronDown } from 'react-icons/fa';

const UsersTable = () => {
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const users = [
    { id: 1, name: "Roger Workman", age: 48, email: "enteremail@gmail.com", joinDate: "2024/07/13", role: "Student", course: "Course 1", status: "Active" },
    { id: 2, name: "Kianna Geidt", age: 76, email: "enteremail@gmail.com", joinDate: "2024/07/01", role: "Student", course: "Course 1", status: "Active" },
    { id: 3, name: "Kadin Dokidis", age: 58, email: "enteremail@gmail.com", joinDate: "2024/07/04", role: "Instructor", course: "Course 1", status: "Inactive" },
    { id: 4, name: "Makenna Gouse", age: 52, email: "enteremail@gmail.com", joinDate: "2024/07/07", role: "Instructor", course: "Course 1", status: "Inactive" },
    { id: 5, name: "Tiana Vetrovs", age: 45, email: "enteremail@gmail.com", joinDate: "2024/07/10", role: "Instructor", course: "Course 1", status: "Active" },
    { id: 6, name: "Roger Aminoff", age: 65, email: "enteremail@gmail.com", joinDate: "2024/07/16", role: "Instructor", course: "Course 1", status: "Inactive" },
  ];

  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-100 p-4 pt-9">
      <div className="w-full max-w-6xl bg-white p-8 md:p-10 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-4 md:space-y-0">
          <h2 className="text-xl font-semibold md:text-left">Users List</h2>
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
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Filter Option 1</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Filter Option 2</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Filter Option 3</a>
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
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Oldest to New</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Newest to Old</a>
                </div>
              )}
            </div>

            {/* Create User Button with Icon */}
            <button className="px-4 py-2 bg-customGreen text-white rounded-md flex items-center space-x-1">
              <FaPlus />
              <span>Create User</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Select</th>
                <th className="px-4 py-2 border-b">No.</th>
                <th className="px-4 py-2 border-b">Name</th>
                <th className="px-4 py-2 border-b">Age</th>
                <th className="px-4 py-2 border-b">Email ID</th>
                <th className="px-4 py-2 border-b">Join Date</th>
                <th className="px-4 py-2 border-b">Role</th>
                <th className="px-4 py-2 border-b">Course</th>
                <th className="px-4 py-2 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border-b">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600" />
                  </td>
                  <td className="px-4 py-2 border-b">{String(index + 1).padStart(2, '0')}.</td>
                  <td className="px-4 py-2 border-b">{user.name}</td>
                  <td className="px-4 py-2 border-b">{user.age}</td>
                  <td className="px-4 py-2 border-b">{user.email}</td>
                  <td className="px-4 py-2 border-b">{user.joinDate}</td>
                  <td className="px-4 py-2 border-b">{user.role}</td>
                  <td className="px-4 py-2 border-b">{user.course}</td>
                  <td className="px-4 py-2 border-b">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {user.status}
                    </span>
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
