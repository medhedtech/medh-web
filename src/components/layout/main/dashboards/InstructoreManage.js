"use client";
import React, { useState, useEffect } from "react";
import { FaPlus, FaChevronDown, FaEye } from "react-icons/fa";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import MyTable from "@/components/shared/common-table/page";
import useDeleteQuery from "@/hooks/deleteQuery.hook";
import { toast } from "react-toastify";
import usePostQuery from "@/hooks/postQuery.hook";
import AddInstructor from "./AddInstructor";
import { Upload } from "lucide-react";

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

  // Fetch instructors data from API
  const fetchInstructors = async () => {
    try {
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
    { Header: "No.", accessor: "no" },
    { Header: "Name", accessor: "full_name" },
    { Header: "Phone Number", accessor: "phone_number" },
    { Header: "Email ID", accessor: "email" },
    { Header: "Join Date", accessor: "createdAt" },
    {
      Header: "Course Category",
      accessor: "meta.category",
      render: (row) => <span>{row?.meta?.category || "--"}</span>,
    },
    {
      Header: "Course",
      accessor: "meta.course_name",
      render: (row) => <span>{row?.meta?.course_name || "--"}</span>,
    },
    {
      Header: "Gender",
      accessor: "meta.gender",
      render: (row) => <span>{row?.meta?.gender || "Not Specified"}</span>,
    },
    {
      Header: "Resume",
      accessor: "meta.upload_resume",
      render: (row) => (
        <div className="flex gap-2 items-center">
          <button
            onClick={() => window.open(row?.meta?.upload_resume, "_blank")}
            className="text-[#7ECA9D] px-2 py-1 hover:bg-blue-500 rounded-md transition-all duration-200"
          >
            <FaEye className="h-4 w-4 text-inherit" />
          </button>
        </div>
      ),
    },
    // {
    //   Header: "Resume",
    //   accessor: "meta.upload_resume",
    //   render: (row) => (
    //     <div className="flex gap-2 items-center">
    //       {Array.isArray(row?.meta?.upload_resume) && row.meta.upload_resume.length > 0 ? (
    //         <button
    //           onClick={() => window.open(row.meta.upload_resume[0], "_blank")}
    //           className="text-[#7ECA9D] px-2 py-1 hover:bg-blue-500 rounded-md transition-all duration-200"
    //         >
    //           <FaEye className="h-4 w-4 text-inherit" />
    //         </button>
    //       ) : (
    //         <span>--</span>
    //       )}
    //     </div>
    //   ),
    // },
    {
      Header: "Status",
      accessor: "status",
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
              className={`ml-2 text-sm ${
                isActive ? "text-green-700" : "text-red-700"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        );
      },
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

  // Add Instructor Form Toggle
  if (showInstructorForm)
    return <AddInstructor onCancel={() => setShowInstructorForm(false)} />;

  return (
    <div className="bg-gray-100 dark:bg-darkblack font-Poppins min-h-screen">
      <div className="max-w-6xl mx-auto dark:bg-inherit dark:text-whitegrey3 dark:border bg-white p-2">
        <header className="flex items-center px-6 justify-between mb-4">
          <h1 className="text-2xl font-bold">Instructor List</h1>
          <div className="flex items-center space-x-2">
            <div className="relative flex-grow flex justify-center">
              <input
                type="text"
                placeholder="Search here"
                className="border dark:bg-inherit dark:text-whitegrey3 dark:border border-gray-300 rounded-full p-2 pl-4 w-full max-w-md"
                onChange={(e) => setSearchQuery(e.target.value)}
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
                    Newest to Old
                  </a>
                </div>
              )}
            </div>

            {/* Add Student Button */}
            <button
              onClick={() => setShowInstructorForm(true)}
              className="bg-customGreen text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FaPlus className="mr-2" />
              Add Instructor
            </button>

            {/* Upload CSV Button */}
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center ml-2"
              onClick={() => document.getElementById('instructorCSVUpload').click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload CSV
              <input
                type="file"
                id="instructorCSVUpload"
                accept=".csv"
                className="hidden"
                onChange={handleCSVUpload}
              />
            </button>
          </div>
        </header>
        {/* Student Table */}
        <MyTable columns={columns} data={formattedData} />
      </div>
    </div>
  );
};

export default InstructorTable;
