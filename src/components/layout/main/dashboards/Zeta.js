"use client";
import { apiUrls } from "@/apis";
import Preloader from "@/components/shared/others/Preloader";
import useGetQuery from "@/hooks/getQuery.hook";
import React, { useEffect, useState } from "react";
import MyTable from "@/components/shared/common-table/page";
import { FaPlus, FaChevronDown } from "react-icons/fa";
import useDeleteQuery from "@/hooks/deleteQuery.hook";
import { useRouter } from "next/navigation";

const UsersTable = () => {
  const router = useRouter();
  const { deleteQuery } = useDeleteQuery();
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const { getQuery, data, loading } = useGetQuery();
  const [deletedCourse, setDeletedCourse] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    status: "",
  });

  useEffect(() => {
    getQuery({
      url: apiUrls.user.getAll,
      onSuccess: (data) => {
        console.log(data, "this is Data");
      },
      onFail: (error) => {
        console.error("Error fetching data:", error);
      },
    });
  }, [deletedCourse]);

  if (loading) {
    return <Preloader />;
  }

  const columns = [
    { Header: "No.", accessor: "no" },
    { Header: "Name", accessor: "full_name" },
    { Header: "Email", accessor: "email" },
    { Header: "Join Date", accessor: "createdAt" },
    { Header: "Role", accessor: "admin_role" },
    {
      Header: "Status",
      accessor: "status",
      render: (row) => (
        <div className="flex gap-2 items-center">
          <div
            className={`rounded-md font-normal px-[10px] py-1 ${
              row.status === "Inactive"
                ? "bg-[#FBD0D0] text-[#F15252]"
                : "bg-[#D9F2D9] text-[#3AA438]"
            }`}
          >
            {row.status}
          </div>
        </div>
      ),
    },
    {
      Header: "Action",
      accessor: "action",
      render: (row) => (
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to delete this user?")) {
              deleteUser(row.id);
            }
          }}
          className="bg-red-500 text-white px-2 py-1 rounded"
        >
          Delete
        </button>
      ),
    },
  ];

  const handleSortChange = (order) => {
    setSortOrder(order);
    setIsSortDropdownOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterDropdownToggle = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
  };

  const handleFilterSelect = (filterType, value) => {
    setFilterOptions((prev) => ({ ...prev, [filterType]: value }));
    setIsFilterDropdownOpen(false);
  };

  const filteredData =
    data?.data?.filter((user) => {
      const matchesName = filterOptions.full_name
        ? (typeof user?.full_name === "string"
            ? user?.full_name.toLowerCase()
            : ""
          ).includes(filterOptions.full_name.toLowerCase())
        : true;

      const matchesStatus = filterOptions.status
        ? (typeof user?.status === "string"
            ? user?.status.toLowerCase()
            : ""
          ).includes(filterOptions.status.toLowerCase())
        : true;

      const matchesSearchQuery =
        (typeof user?.full_name === "string" &&
          user?.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (typeof user?.email === "string" &&
          user?.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (typeof user?.admin_role === "string" &&
          user?.admin_role.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (typeof user?.phone_number === "string" &&
          user?.phone_number.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesSearchQuery && matchesName && matchesStatus;
    }) || [];

  // Sorting the filtered data based on the `sortOrder`
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortOrder === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    return 0;
  });

  const formattedData =
    sortedData.map((user, index) => ({
      ...user,
      no: index + 1,
      createdAt: new Date(user.createdAt).toLocaleDateString("en-GB"),
    })) || [];

  const deleteUser = (id) => {
    deleteQuery({
      url: `${apiUrls?.user?.delete}/${id}`,
      onSuccess: (res) => {
        showToast.success(res?.message);
        setDeletedCourse(id);
      },
      onFail: (res) => {
        console.log(res, "FAILED");
      },
    });
  };

  return (
    <div className="flex items-start font-Poppins justify-center min-h-screen dark:bg-inherit bg-gray-100 p-4 pt-9">
      <div className="w-full max-w-6xl bg-white dark:bg-inherit dark:border md:p-10 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-4 md:space-y-0 px-6">
          <h2 className="text-xl font-semibold md:text-left dark:text-white">
            Users List
          </h2>
          <div className="flex space-x-2 justify-center md:justify-start">
            <div className="relative flex-grow flex justify-center">
              <input
                type="text"
                placeholder="Search here"
                className="border dark:bg-inherit dark:text-whitegrey3 dark:border border-gray-300 rounded-full p-2 pl-4 w-full max-w-md"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            {/* Filter Button with Dropdown */}
            <div className="relative">
              <button
                onClick={handleFilterDropdownToggle}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md dark:bg-inherit dark:text-whitegrey3 dark:border hover:bg-gray-300 flex items-center space-x-1"
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
              {isFilterDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <button
                    onClick={() => handleFilterSelect("status", "Active")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Active
                  </button>
                  <button
                    onClick={() => handleFilterSelect("status", "Inactive")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Inactive
                  </button>
                </div>
              )}
            </div>

            {/* Sort Button with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md dark:bg-inherit dark:text-whitegrey3 dark:border hover:bg-gray-300 flex items-center space-x-1"
              >
                <span>
                  {sortOrder === "newest" ? "New to Oldest" : "Oldest to New"}
                </span>
                <FaChevronDown />
              </button>
              {isSortDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <a
                    href="#"
                    onClick={() => handleSortChange("oldest")}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Oldest to New
                  </a>
                  <a
                    href="#"
                    onClick={() => handleSortChange("newest")}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    New to Oldest
                  </a>
                </div>
              )}
            </div>
            <button
              onClick={() => {
                router.push("/dashboards/admin-subpage1");
              }}
              className="bg-customGreen text-white px-4 py-2 rounded-lg flex items-center"
            >
              Create User <FaPlus className="ml-2" />
            </button>
          </div>
        </div>

        <MyTable columns={columns} data={formattedData} />
      </div>
    </div>
  );
};

export default UsersTable;
