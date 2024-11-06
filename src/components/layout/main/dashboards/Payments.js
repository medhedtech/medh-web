"use client";
import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { BiFilterAlt } from "react-icons/bi";
import { SearchIcon } from "@/assets/images/icon/SearchIcon";

const PaymentTable = () => {
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const users = [
    {
      id: 1,
      orderId: "#65232",
      name: "Roger Workman",
      age: 48,
      email: "enteremail@gmail.com",
      joinDate: "2024/07/13",
      role: "Student",
      action: "Download Receipt",
      status: "Failed",
    },
    {
      id: 2,
      orderId: "#65232",
      name: "Kianna Geidt",
      age: 76,
      email: "enteremail@gmail.com",
      joinDate: "18/10/2021",
      role: "Student",
      action: "Download Receipt",
      status: "Successful",
    },
    {
      id: 3,
      orderId: "#65232",
      name: "Kadin Dokidis",
      age: 58,
      email: "enteremail@gmail.com",
      joinDate: "2024/07/04",
      role: "Instructor",
      action: "Download Receipt",
      status: "Pending",
    },
    {
      id: 4,
      orderId: "#65232",
      name: "Makenna Gouse",
      age: 52,
      email: "enteremail@gmail.com",
      joinDate: "2024/07/07",
      role: "Instructor",
      action: "Download Receipt",
      status: "Failed",
    },
    {
      id: 5,
      orderId: "#65232",
      name: "Tiana Vetrovs",
      age: 45,
      email: "enteremail@gmail.com",
      joinDate: "2024/07/10",
      role: "Instructor",
      action: "Download Receipt",
      status: "Pending",
    },
    {
      id: 6,
      orderId: "#65232",
      name: "Roger Aminoff",
      age: 65,
      email: "enteremail@gmail.com",
      joinDate: "2024/07/16",
      role: "Instructor",
      action: "Download Receipt",
      status: "Successful",
    },
  ];

  return (
    <div className="flex items-start justify-center w-full font-Open">
      <div className="w-full  bg-white px-8 md:px-10 rounded-lg ">
        <h1 className="text-size-32 px-4">Payments</h1>
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4 space-y-4 md:space-y-0">
          {/* <h2 className="text-xl font-semibold md:text-left">Users List</h2> */}
          <div className="relative w-full md:w-1/4">
            <span className="absolute inset-y-0 left-4 flex items-center text-[#666666]">
              <SearchIcon fill="#666666" />
            </span>
            <input
              type="text"
              placeholder="Search here"
              className="w-full pl-10 pr-4 py-2 border border-[#666666] text-[#666666] rounded-full focus:outline-none focus:ring-2"
            />
          </div>
          <div className="flex space-x-2 justify-center md:justify-start">
            {/* Filter Button with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className="px-10 py-2 border border-[#666666] text-[#666666] rounded-full  flex items-center space-x-1"
              >
                <BiFilterAlt />
                <span className="pl-1">Filters</span>
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
                className="px-10 py-2 border border-[#666666] text-[#666666] rounded-full  flex items-center space-x-1"
              >
                <div className="pr-1">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.42773 6.28564L12.5706 6.28564"
                      stroke="#666666"
                      stroke-width="1.37143"
                      stroke-miterlimit="10"
                      stroke-linecap="square"
                    />
                    <path
                      d="M1.71484 2.85693L14.2863 2.85693"
                      stroke="#666666"
                      stroke-width="1.37143"
                      stroke-miterlimit="10"
                      stroke-linecap="square"
                    />
                    <path
                      d="M5.14258 9.71436L10.8569 9.71436"
                      stroke="#666666"
                      stroke-width="1.37143"
                      stroke-miterlimit="10"
                      stroke-linecap="square"
                    />
                    <path
                      d="M6.85742 13.1431L9.14314 13.1431"
                      stroke="#666666"
                      stroke-width="1.37143"
                      stroke-miterlimit="10"
                      stroke-linecap="square"
                    />
                  </svg>
                </div>
                <span>Sort</span>
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
            {/* <button className="px-4 py-2 bg-customGreen text-white rounded-md flex items-center space-x-1">
              <FaPlus />
              <span>Create User</span>
            </button> */}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[#565D6D] font-normal text-sm">
                {/* <th className="px-4 py-2 border-b">Select</th> */}
                <th className="px-4 py-2 border-b">Order ID</th>
                <th className="px-4 py-2 border-b">Course Name</th>
                <th className="px-4 py-2 border-b">Date</th>
                <th className="px-4 py-2 border-b">Price</th>
                {/* <th className="px-4 py-2 border-b">Join Date</th>
                <th className="px-4 py-2 border-b">Role</th>
                <th className="px-4 py-2 border-b">Course</th> */}
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-100 text-sm font-Poppins text-[#171A1F]"
                >
                  {/* <td className="px-4 py-2 border-b">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-indigo-600"
                    />
                  </td> */}
                  <td className="px-4 py-4 border-b ">
                    {/* {String(index + 1).padStart(2, "0")}. */}
                    {user.orderId}
                  </td>
                  <td className="px-4 py-2 border-b font-bold">{user.name}</td>
                  <td className="px-4 py-2 border-b">{user.joinDate}</td>
                  <td className="px-4 py-2 border-b">{user.age}</td>
                  {/* <td className="px-4 py-2 border-b">{user.email}</td> */}
                  {/* <td className="px-4 py-2 border-b">{user.role}</td> */}
                  {/* <td className="px-4 py-2 border-b">{user.course}</td> */}
                  <td className="px-4 py-2 border-b">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.status === "Successful"
                          ? "bg-green-100 text-[#006D07]" // Green for Successful
                          : user.status === "Failed"
                          ? "bg-red-100 text-[#ED1F24]" // Red for Failed
                          : "bg-[#F9FFE3] text-[#916800]" // Yellow for Pending
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 border-b flex gap-2">
                    <span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.58804 4.67783L11.7707 5.52516M7.90671 7.20849L9.49738 7.63249M7.98604 11.9772L8.62204 12.1472C10.422 12.6272 11.322 12.8665 12.0314 12.4592C12.74 12.0525 12.9814 11.1572 13.4634 9.36783L14.1454 6.83649C14.628 5.04649 14.8687 4.15183 14.4594 3.44649C14.05 2.74116 13.1507 2.50183 11.35 2.02249L10.714 1.85249C8.91404 1.37249 8.01404 1.13316 7.30538 1.54049C6.59604 1.94716 6.35471 2.84249 5.87204 4.63183L5.19071 7.16316C4.70804 8.95316 4.46671 9.84783 4.87671 10.5532C5.28604 11.2578 6.18604 11.4978 7.98604 11.9772Z"
                          stroke="#7ECA9D"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M8.00067 13.9639L7.366 14.1373C5.57 14.6259 4.67267 14.8706 3.96467 14.4553C3.258 14.0406 3.01667 13.1286 2.536 11.3033L1.85534 8.72194C1.374 6.89728 1.13334 5.98461 1.542 5.26594C1.89534 4.64394 2.66734 4.66661 3.66734 4.66661"
                          stroke="#7ECA9D"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                    {user.action}
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

export default PaymentTable;
