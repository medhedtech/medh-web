"use client";
import React, { useState, useEffect } from "react";
import { BiFilterAlt } from "react-icons/bi";
import { SearchIcon } from "@/assets/images/icon/SearchIcon";
import MyTable from "@/components/shared/common-table/page";
import Image from "next/image";
import RecieptImage from "../../../../assets/images/dashbord/EditImage.png";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import Preloader from "@/components/shared/others/Preloader";

const PaymentTable = () => {
  const [openDropdown, setOpenDropdown] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("newToOld");
  const [studentId, setStudentId] = useState(null);
  const { getQuery } = useGetQuery();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setStudentId(storedUserId);
      } else {
        setLoading(false);
        console.error("Student ID not found in localStorage");
      }
    }
  }, []);

  useEffect(() => {
    if (studentId) {
      fetchSubscriptions();
    }
  }, [studentId]);

  useEffect(() => {
    filterAndSortData();
  }, [searchQuery, selectedStatus, sortOrder, users]);

  const fetchSubscriptions = () => {
    setLoading(true);
    getQuery({
      url: `${apiUrls?.Subscription?.getAllSubscriptionByStudentId}/${studentId}`,
      onSuccess: (response) => {
        if (response?.success) {
          const formattedUsers = response.data.map((subscription) => {
            return {
              id: subscription._id,
              orderId: subscription._id,
              price: subscription?.amount || "N/A",
              course: subscription.course_id?.course_title || "N/A",
              joinDate: subscription.createdAt?.split("T")[0] || "N/A",
              status: subscription.status || "N/A",
              pdfUrl: subscription.pdfUrl,
            };
          });
          setUsers(formattedUsers);
        } else {
          console.error("Failed to fetch subscriptions:", response?.message);
        }
        setLoading(false);
      },
      onFail: (error) => {
        console.error("Error fetching subscriptions:", error);
        setLoading(false);
      },
    });
  };

  const filterAndSortData = () => {
    let filteredData = [...users];

    // Filter by search query (course and price)
    if (searchQuery) {
      filteredData = filteredData.filter(
        (user) =>
          user.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.price.toString().includes(searchQuery)
      );
    }

    // Filter by status
    if (selectedStatus) {
      filteredData = filteredData.filter(
        (user) => user.status === selectedStatus
      );
    }

    // Sort data by date
    if (sortOrder === "newToOld") {
      filteredData.sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));
    } else if (sortOrder === "oldToNew") {
      filteredData.sort((a, b) => new Date(a.joinDate) - new Date(b.joinDate));
    }

    setFilteredUsers(filteredData);
  };

  const handleDropdownToggle = (dropdownType) => {
    setOpenDropdown((prev) => (prev === dropdownType ? "" : dropdownType));
  };

  const handleFilterSelection = (status) => {
    setSelectedStatus(status);
    setOpenDropdown("");
  };

  const handleSortSelection = (order) => {
    setSortOrder(order);
    setOpenDropdown("");
  };

  const columns = [
    { Header: "Payment ID", accessor: "orderId", width: 100 },
    { Header: "Course Name", accessor: "course", width: 150 },
    { Header: "Date", accessor: "joinDate", width: 120 },
    {
      Header: "Price",
      accessor: "price",
      width: 200,
      render: (row) =>
        row?.price ? `$${parseFloat(row.price).toFixed(2)}` : "$0.00",
    },
    {
      Header: "Status",
      accessor: "status",
      render: (row) => (
        <div className="flex justify-center items-center gap-2">
          <div
            className={`rounded-md font-normal px-[10px] py-1 ${
              row.status === "success"
                ? "bg-[#D9F2D9] text-[#3AA438]"
                : row.status === "pending"
                ? "bg-[#FFF0D9] text-[#FFA927]"
                : "bg-[#FAD2D2] text-[#D9534F]"
            }`}
          >
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </div>
        </div>
      ),
      width: 100,
    },

    {
      Header: "Action",
      accessor: "actions",
      render: (row) => (
        <div className="flex gap-2 cursor-pointer items-center">
          <a
            href={row.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary px-[15px] py-1 flex justify-center items-center"
          >
            <Image
              src={RecieptImage}
              width={25}
              height={20}
              alt="Edit Icon"
              className="pr-1 text-primary"
            />
            <p className="text-[14px]">Download Receipt</p>
          </a>
        </div>
      ),
    },
  ];

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="flex items-start justify-center md:px-12 w-full font-Open">
      <div className="w-full bg-white dark:bg-inherit px-2 md:px-6 rounded-lg ">
        <h1 className="text-size-32 px-6 py-4 dark:text-white">Payments</h1>
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4 space-y-4 md:space-y-0">
          <div className="relative w-full md:w-1/4 ml-6">
            <span className="absolute inset-y-0 left-4 flex items-center text-[#666666]">
              <SearchIcon fill="#666666" />
            </span>
            <input
              type="text"
              placeholder="Search by Course or Price"
              className="w-full pl-10 pr-4 py-2 border border-[#666666] dark:bg-inherit text-[#666666] rounded-[10px] focus:outline-none focus:ring-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex space-x-2 justify-center md:justify-start">
            <div className="relative">
              <button
                onClick={() => handleDropdownToggle("filter")}
                className="px-10 py-2 border border-[#666666] text-[#666666] rounded-[10px] flex items-center space-x-1"
              >
                <BiFilterAlt />
                <span className="pl-1">Filters</span>
              </button>

              {openDropdown === "filter" && (
                <div className="absolute bg-white shadow-lg p-4 rounded-md">
                  <div>
                    <label className="block">Status</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={selectedStatus}
                      onChange={(e) => handleFilterSelection(e.target.value)}
                    >
                      <option value="">All</option>
                      <option value="success">Success</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => handleDropdownToggle("sort")}
                className="px-10 py-2 border border-[#666666] text-[#666666] rounded-[10px] flex items-center space-x-1"
              >
                <span>Sort</span>
              </button>

              {openDropdown === "sort" && (
                <div className="absolute bg-white shadow-lg p-4 rounded-md">
                  <button
                    onClick={() => handleSortSelection("newToOld")}
                    className="block w-[100px] text-left px-2 py-1"
                  >
                    New to Old
                  </button>
                  <button
                    onClick={() => handleSortSelection("oldToNew")}
                    className="block w-full text-left px-2 py-1"
                  >
                    Old to New
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <MyTable columns={columns} data={filteredUsers} />
      </div>
    </div>
  );
};

export default PaymentTable;
