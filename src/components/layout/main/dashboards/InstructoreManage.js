"use client";
import React, { useState, useEffect } from "react";
import { FaPlus, FaChevronDown, FaEye, FaSearch, FaFilter } from "react-icons/fa";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import MyTable from "@/components/shared/common-table/page";
import useDeleteQuery from "@/hooks/deleteQuery.hook";
import { toast } from "react-toastify";
import usePostQuery from "@/hooks/postQuery.hook";
import AddInstructor from "./AddInstructor";
import { Upload, Loader } from "lucide-react";

const InstructorTable = () => {
  const { deleteQuery } = useDeleteQuery();
  const { postQuery } = usePostQuery();
  const { getQuery } = useGetQuery();

  // State Initialization
  const [instructors, setInstructors] = useState([]);
  const [deletedInstructors, setDeletedInstructors] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [showInstructorForm, setShowInstructorForm] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    course_name: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch instructors data from API
  const fetchInstructors = async () => {
    try {
      setLoading(true);
      await getQuery({
        url: apiUrls.Instructor.getAllInstructors,
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
        onFail: () => {
          setInstructors([]);
        },
      });
    } catch (error) {
      console.error("Failed to fetch instructors:", error);
      setInstructors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, [deletedInstructors]);

  // Delete Instructor
  const deleteInstructor = (id) => {
    deleteQuery({
      url: `${apiUrls.Instructor.deleteInstructor}/${id}`,
      onSuccess: (res) => {
        toast.success(res?.message);
        setDeletedInstructors(id);
      },
      onFail: (res) => {
        console.error("Failed to delete instructor:", res);
        toast.error("Failed to delete instructor");
      },
    });
  };

  // Toggle Instructor Status
  const toggleStatus = async (id) => {
    try {
      await postQuery({
        url: `${apiUrls.Instructor.toggleInstructorsStatus}/${id}`,
        postData: {},
        onSuccess: (response) => {
          const updatedInstructor = response?.data;
          if (updatedInstructor) {
            toast.success(
              `${updatedInstructor.full_name}'s status changed to ${updatedInstructor.status}.`
            );
            fetchInstructors();
          } else {
            console.error("Instructor data not found in response!", response);
            toast.error("Failed to update instructor status");
          }
        },
        onFail: (res) => {
          toast.error("Instructor status cannot be changed!");
          console.error("Failed to toggle status:", res);
        },
      });
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Error in toggleStatus:", error);
    }
  };

  // Add CSV upload handler
  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("csvFile", file);

        await postQuery({
          url: apiUrls.Instructor.uploadCSV,
          postData: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onSuccess: () => {
            toast.success("Instructors uploaded successfully!");
            fetchInstructors(); // Refresh list
          },
          onFail: (error) => {
            toast.error(error.message || "CSV upload failed");
          }
        });
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Error processing CSV file");
      }
    }
  };

  // Table Columns Configuration
  const columns = [
    { 
      Header: "No.", 
      accessor: "no",
      className: "w-16 text-center" 
    },
    { 
      Header: "Name", 
      accessor: "full_name",
      className: "min-w-[200px]",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
            {row.full_name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{row.full_name}</div>
            <div className="text-sm text-gray-500">{row.phone_number || 'No phone'}</div>
          </div>
        </div>
      )
    },
    { 
      Header: "Email ID", 
      accessor: "email",
      className: "min-w-[250px]",
      render: (row) => (
        <div className="text-gray-600 dark:text-gray-300">
          {row.email}
        </div>
      )
    },
    { 
      Header: "Join Date", 
      accessor: "createdAt",
      className: "min-w-[120px]",
      render: (row) => (
        <div className="text-gray-600 dark:text-gray-300">
          {row.createdAt}
        </div>
      )
    },
    {
      Header: "Course Details",
      accessor: "course_details",
      className: "min-w-[250px]",
      render: (row) => (
        <div className="space-y-1">
          <div className="text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">Category:</span>
            <span className="ml-2 text-gray-600 dark:text-gray-400">{row?.meta?.category || "--"}</span>
          </div>
          <div className="text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">Course:</span>
            <span className="ml-2 text-gray-600 dark:text-gray-400">{row?.meta?.course_name || "--"}</span>
          </div>
          <div className="text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">Gender:</span>
            <span className="ml-2 text-gray-600 dark:text-gray-400">{row?.meta?.gender || "Not Specified"}</span>
          </div>
        </div>
      )
    },
    {
      Header: "Resume",
      accessor: "meta.upload_resume",
      className: "w-[100px]",
      render: (row) => (
        <div className="flex justify-center">
          <button
            onClick={() => window.open(row?.meta?.upload_resume, "_blank")}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
          >
            <FaEye className="h-5 w-5" />
          </button>
        </div>
      ),
    },
    {
      Header: "Status",
      accessor: "status",
      className: "min-w-[150px]",
      render: (row) => {
        const isActive = row?.status === "Active";
        return (
          <div className="flex gap-2 items-center">
            <button
              onClick={() => toggleStatus(row?._id)}
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
              className={`text-sm font-medium ${
                isActive ? "text-green-600" : "text-gray-600"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        );
      },
    },
    {
      Header: "Action",
      accessor: "actions",
      className: "w-[100px]",
      render: (row) => (
        <div className="flex gap-2 items-center">
          <button
            onClick={() => deleteInstructor(row._id)}
            className="text-red-500 hover:text-red-700 font-medium text-sm"
          >
            Delete
          </button>
        </div>
      )
    },
  ];

  // Filtering and Sorting the Data
  const filteredData =
    instructors?.filter((instructor) => {
      const matchesName = filterOptions.full_name
        ? (instructor.full_name || "")
            .toLowerCase()
            .includes(filterOptions.full_name.toLowerCase())
        : true;

      const matchesStatus = filterOptions.status
        ? (instructor.status || "")
            .toLowerCase()
            .includes(filterOptions.status.toLowerCase())
        : true;

      const matchesSearchQuery =
        instructor.full_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        instructor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        instructor.phone_number.includes(searchQuery);

      return matchesSearchQuery && matchesName && matchesStatus;
    }) || [];

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

  const handleSortChange = (order) => {
    setSortOrder(order);
    setIsSortDropdownOpen(false);
  };

  const handleFilterDropdownToggle = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
  };

  const handleFilterSelect = (filterType, value) => {
    setFilterOptions((prev) => ({ ...prev, [filterType]: value }));
    setIsFilterDropdownOpen(false);
  };

  return (
    <div className="bg-gray-50 dark:bg-darkblack min-h-screen p-6 space-y-8">
      {showInstructorForm ? (
        <AddInstructor onCancel={() => setShowInstructorForm(false)} />
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-inherit dark:text-whitegrey3 dark:border rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Instructor Management</h1>
                
                <div className="flex flex-wrap items-center gap-3">
                  {/* Search Bar */}
                  <div className="relative flex-grow max-w-md">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search instructors..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Filter Dropdown */}
                  <div className="relative">
                    <button
                      onClick={handleFilterDropdownToggle}
                      className="flex items-center px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <FaFilter className="mr-2" />
                      Filters
                    </button>
                    {isFilterDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-20">
                        <div className="p-2">
                          <button
                            onClick={() => handleFilterSelect("status", "Active")}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                          >
                            Active Instructors
                          </button>
                          <button
                            onClick={() => handleFilterSelect("status", "Inactive")}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                          >
                            Inactive Instructors
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sort Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                      className="flex items-center px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <span>{sortOrder === "newest" ? "Newest First" : "Oldest First"}</span>
                      <FaChevronDown className="ml-2" />
                    </button>
                    {isSortDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-20">
                        <button
                          onClick={() => handleSortChange("newest")}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                        >
                          Newest First
                        </button>
                        <button
                          onClick={() => handleSortChange("oldest")}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                        >
                          Oldest First
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <button
                    onClick={() => setShowInstructorForm(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaPlus className="mr-2" />
                    Add Instructor
                  </button>
                  
                  <button
                    onClick={() => document.getElementById('instructorCSVUpload').click()}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Import CSV
                    <input
                      type="file"
                      id="instructorCSVUpload"
                      accept=".csv"
                      className="hidden"
                      onChange={handleCSVUpload}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Instructor Table */}
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader className="animate-spin h-8 w-8 text-blue-600" />
                </div>
              ) : (
                <MyTable 
                  columns={columns} 
                  data={formattedData}
                  className="w-full"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorTable;
