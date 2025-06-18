"use client";
import React, { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import MyTable from "@/components/shared/common-table/page";
import useDeleteQuery from "@/hooks/deleteQuery.hook";
const AdminFeedbacks = () => {
  const { deleteQuery } = useDeleteQuery();
  const [instructors, setInstructors] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const { getQuery } = useGetQuery();
  const [deletedInstructors, setDeletedInstructors] = useState(null);

  // Fetch instructors Data from API
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        await getQuery({
          url: apiUrls?.Instructor?.getAllInstructors,
          // onSuccess: (data) => setInstructors(data),
          onSuccess: (response) => {
            if (Array.isArray(response)) {
              setInstructors(response);
            } else if (response?.data && Array.isArray(response.data)) {
              setInstructors(response.data);
            } else {
              setInstructors([]);
              console.error("Invalid API response:", response);
            }
          },
          onFail: () => setInstructors([]),
        });
      } catch (error) {
        console.error("Failed to fetch instructors:", error);
      }
    };
    fetchInstructors();
  }, [deletedInstructors]);

  // Delete Instructor
  const deleteInstructor = (id) => {
    deleteQuery({
      url: `${apiUrls?.Instructor?.deleteInstructor}/${id}`,
      onSuccess: (res) => {
        showToast.success(res?.message);
        setDeletedInstructors(id);
      },
      onFail: (res) => console.log(res, "FAILED"),
    });
  };

  // Handle Sort Change
  const handleSortChange = (order) => {
    setSortOrder(order);
    setIsSortDropdownOpen(false);
  };

  // Filtering data based on search query
  const filteredData = instructors.filter((instructor) => {
    const query = searchQuery.toLowerCase();
    const matchesSearchQuery =
      instructor.full_name?.toLowerCase().includes(query) ||
      instructor.age?.toString().toLowerCase().includes(query) ||
      instructor.course_name?.toLowerCase().includes(query);
    return matchesSearchQuery;
  });

  // Sorting the data based on selected order
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortOrder === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    return 0;
  });

  const formattedData = sortedData.map((user, index) => ({
    ...user,
    no: index + 1,
    createdAt: new Date(user.createdAt).toLocaleDateString("en-GB"),
    course_name: user.meta?.course_name,
    age: user.meta?.age,
  }));

  // Table Columns Configuration
  const columns = [
    { Header: "No.", accessor: "no" },
    { Header: "Name", accessor: "full_name" },
    { Header: "Age", accessor: "age" },
    { Header: "Join Date", accessor: "createdAt" },
    { Header: "Course", accessor: "course_name" },
    {
      Header: "Action",
      accessor: "actions",
      render: (row) => (
        <div className="flex gap-2 items-center">
          <button
            onClick={() => deleteInstructor(row?._id)}
            className="text-white bg-red-600 border border-red-600 rounded-md px-[10px] py-1"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 md:p-10 bg-white dark:bg-inherit shadow rounded-lg mb-8 font-Poppins">
      <div className="max-w-7xl mx-auto dark:bg-inherit dark:text-whitegrey3 dark:border bg-white rounded-lg">
        <header className="flex items-center justify-between mb-4 p-4">
          <h1 className="text-2xl font-bold">Instructor Highlights</h1>
          <div className="flex items-center space-x-2">
            <div className="relative flex-grow flex justify-center">
              <input
                type="text"
                placeholder="Search here"
                className="border dark:bg-inherit dark:text-whitegrey3 dark:border border-gray-300 rounded-full p-2 pl-4 w-full max-w-md"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
                    onClick={() => handleSortChange("oldest")}
                    className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Oldest to New
                  </a>
                  <a
                    onClick={() => handleSortChange("newest")}
                    className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Newest to Old
                  </a>
                </div>
              )}
            </div>
          </div>
        </header>
        {/* Instructor Table */}
        <MyTable columns={columns} data={formattedData} />
      </div>
    </div>
  );
};

export default AdminFeedbacks;
