"use client";
import React, { useState } from "react";
import { BiFilterAlt } from "react-icons/bi";
import { SearchIcon } from "@/assets/images/icon/SearchIcon";
import MyTable from "@/components/shared/common-table/page";
import Image from "next/image";
import EditImage from "../../../../assets/images/dashbord/EditImage.png";

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
      status: "Failed",
    },
    {
      id: 2,
      orderId: "#65232",
      name: "Roger Workman",
      age: 48,
      email: "enteremail@gmail.com",
      joinDate: "2024/07/13",
      role: "Student",
      status: "Successful",
    },
    {
      id: 3,
      orderId: "#65232",
      name: "Roger Workman",
      age: 48,
      email: "enteremail@gmail.com",
      joinDate: "2024/07/13",
      role: "Student",
      status: "Failed",
    },
    {
      id: 4,
      orderId: "#65232",
      name: "Roger Workman",
      age: 48,
      email: "enteremail@gmail.com",
      joinDate: "2024/07/13",
      role: "Student",
      status: "Successful",
    },
    {
      id: 5,
      orderId: "#65232",
      name: "Roger Workman",
      age: 48,
      email: "enteremail@gmail.com",
      joinDate: "2024/07/13",
      role: "Student",
      status: "Pending",
    },
    {
      id: 6,
      orderId: "#65232",
      name: "Roger Workman",
      age: 48,
      email: "enteremail@gmail.com",
      joinDate: "2024/07/13",
      role: "Student",
      status: "Failed",
    },
    {
      id: 7,
      orderId: "#65232",
      name: "Roger Workman",
      age: 48,
      email: "enteremail@gmail.com",
      joinDate: "2024/07/13",
      role: "Student",
      status: "Failed",
    },
    {
      id: 8,
      orderId: "#65232",
      name: "Roger Workman",
      age: 48,
      email: "enteremail@gmail.com",
      joinDate: "2024/07/13",
      role: "Student",
      status: "Successful",
    },
  ];

  const columns = [
    { Header: "Order ID", accessor: "orderId", width: 100 },
    { Header: "Name", accessor: "name", width: 150 },
    { Header: "Email", accessor: "email", width: 200 },
    { Header: "Date", accessor: "joinDate", width: 120 },
    { Header: "Role", accessor: "role", width: 100 },
    { Header: "Status", accessor: "status", width: 100 },
    {
      Header: "Action",
      accessor: "actions",
      render: (row) => (
        <div className="flex gap-2 items-center">
          <button
            className="text-primary px-[15px] py-1 flex justify-center items-center"
            // onClick={() => handleEditClick(row.original)}
          >
            <Image
              src={EditImage}
              width={25}
              height={20}
              alt="Edit Icon"
              className="pr-1 text-primary"
            />
            <p className="text-[14px]">Download Reciept</p>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex items-start justify-center w-full font-Open">
      <div className="w-full bg-white px-2 md:px-10 rounded-lg ">
        <h1 className="text-size-32 px-6">Payments</h1>
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4 space-y-4 md:space-y-0">
          <div className="relative w-full md:w-1/4 ml-6">
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
            <div className="relative">
              <button
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className="px-10 py-2 border border-[#666666] text-[#666666] rounded-full flex items-center space-x-1"
              >
                <BiFilterAlt />
                <span className="pl-1">Filters</span>
              </button>
              {/* {isFilterDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Filter Option 1</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Filter Option 2</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Filter Option 3</a>
                </div>
              )} */}
            </div>
            <div className="relative">
              <button
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="px-10 py-2 border border-[#666666] text-[#666666] rounded-full flex items-center space-x-1"
              >
                <span>
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
                </span>
                <span className="pl-1">Sort</span>
              </button>
              {/* {isSortDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Oldest to New</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Newest to Old</a>
                </div>
              )} */}
            </div>
          </div>
        </div>

        {/* Render MyTable with the users data */}
        <MyTable columns={columns} data={users} />
      </div>
    </div>
  );
};

export default PaymentTable;
