"use client";
import { apiUrls } from "@/apis";
import Preloader from "@/components/shared/others/Preloader";
import useGetQuery from "@/hooks/getQuery.hook";
import React, { useEffect, useState } from "react";
import { FaSort, FaPlus, FaChevronDown } from "react-icons/fa";

const UsersTable = () => {
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const { getQuery, data, loading, error } = useGetQuery();

  useEffect(() => {
    // Fetching users data when the component mounts
    getQuery({
      url: apiUrls.user.getAll,
      onSuccess: (data) => {
        console.log(data, "this is Data");
      },
      onFail: (error) => {
        console.log("Error", error);
      },
    });
  }, []);

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="flex items-start font-Poppins justify-center min-h-screen dark:bg-inherit bg-gray-100 p-4 pt-9">
      <div className="w-full max-w-6xl bg-white dark:bg-inherit dark:border p-8 md:p-10 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-4 md:space-y-0">
          <h2 className="text-xl font-semibold md:text-left dark:text-white">
            Users List
          </h2>
          <input
            type="text"
            placeholder="Search here"
            className="w-full md:w-1/3 px-4 py-2 border dark:bg-inherit dark:text-whitegrey3 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex space-x-2 justify-center md:justify-start">
            {/* Filter Button with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md dark:bg-inherit dark:text-whitegrey3 dark:border hover:bg-gray-300 flex items-center space-x-1"
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
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md  dark:bg-inherit dark:text-whitegrey3 dark:border hover:bg-gray-300 flex items-center space-x-1"
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
            <button className="px-4 py-2 bg-customGreen text-white rounded-md flex items-center space-x-1">
              <FaPlus />
              <span>Create User</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse dark:text-white">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Select</th>
                <th className="px-4 py-2 border-b">No.</th>
                <th className="px-4 py-2 border-b">Name</th>
                <th className="px-4 py-2 border-b">Age</th>
                <th className="px-4 py-2 border-b">Email ID</th>
                <th className="px-4 py-2 border-b">Join Date</th>
                <th className="px-4 py-2 border-b">Role</th>
                {/* <th className="px-4 py-2 border-b">Course</th> */}
                <th className="px-4 py-2 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {!loading && data?.data?.length > 0 ? (
                data.data.map((user, index) => (
                  <tr key={user._id} className="">
                    <td className="px-4 py-2 border-b">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-indigo-600"
                      />
                    </td>
                    <td className="px-4 py-2 border-b">
                      {String(index + 1).padStart(2, "0")}.
                    </td>
                    <td className="px-4 py-2 border-b">{user.full_name}</td>
                    <td className="px-4 py-2 border-b">{user.email}</td>
                    <td className="px-4 py-2 border-b">{user.phone_number}</td>
                    <td className="px-4 py-2 border-b">
                      {new Date(user.createdAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-4 py-2 border-b">{user.role}</td>
                    <td className="px-4 py-2 border-b">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    {loading ? "Loading..." : "No users found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
