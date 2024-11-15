"use client";
import { apiUrls } from "@/apis";
import React, { useEffect, useState } from "react";
import MyTable from "@/components/shared/common-table/page";
import useGetQuery from "@/hooks/getQuery.hook";
import Preloader from "@/components/shared/others/Preloader";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const { getQuery, loading } = useGetQuery();

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      await getQuery({
        url: apiUrls?.courses?.getAllCourses,
        onSuccess: (data) => {
          console.log("Courses fetched successfully:", data);
          setCourses(data);
        },
        onFail: (err) => {
          console.error("Failed to fetch courses:", err);
        },
      });
    };

    fetchCourses();
  }, []);

  const handleDropdownToggle = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const handleFilterDropdownToggle = () => {
    setFilterDropdownOpen(!filterDropdownOpen);
  };

  const columns = [
    { Header: "No.", accessor: "id" },
    { Header: "Category", accessor: "course_category" },
    { Header: "Course Name", accessor: "course_title" },
    { Header: "Instructor", accessor: "instructor" },
    { Header: "Price", accessor: "course_fee" },
    { Header: "Sessions", accessor: "no_of_Sessions" },
    { Header: "Time", accessor: "session_duration" },
    { Header: "Status", accessor: "status" },
  ];

  if (loading) {
    return <Preloader />;
  }
  return (
    <div className="bg-gray-100 dark:bg-darkblack font-Poppins min-h-screen pt-8 p-6">
      <div className="max-w-6xl mx-auto  dark:bg-inherit dark:text-whitegrey3 dark:border bg-white rounded-lg shadow-lg p-6">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Course List</h1>
          <div className="flex items-center space-x-2">
            <div className="relative flex-grow flex justify-center">
              <input
                type="text"
                placeholder="Search here"
                className="border  dark:bg-inherit dark:text-whitegrey3 dark:border border-gray-300 rounded-full p-2 pl-4 w-full max-w-md"
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
              <select className="appearance-none  dark:bg-inherit dark:text-whitegrey3  text-[#323232] outline-none rounded-5px pr-7 pl-3  py-1">
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

        {/* Integrate MyTable Component */}
        <MyTable
          columns={columns}
          data={courses}
          filterColumns={["category", "status"]}
          entryText="Total no. of courses: "
        />
      </div>
    </div>
  );
}
