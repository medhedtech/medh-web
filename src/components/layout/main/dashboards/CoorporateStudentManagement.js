"use client";
import React, { useState, useEffect } from "react";
import { FaPlus, FaChevronDown } from "react-icons/fa";
import AddCoorporateStudentForm from "./CoorporateAddStudentForm";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import MyTable from "@/components/shared/common-table/page";
import { toast } from "react-toastify";
import usePostQuery from "@/hooks/postQuery.hook";
import Preloader from "@/components/shared/others/Preloader";

const CoorporateTableStudent = () => {
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [cooporateStudents, setCooporateStudents] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const { postQuery, loading: PostLoading } = usePostQuery();
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    full_name: "",
    email: "",
    phone_number: "",
  });
  const [id, setId] = useState(null);

  const { getQuery, loading } = useGetQuery();
  const [updateStatus, setUpdateStatus] = useState(null);
  useEffect(() => {
    const userId =localStorage.getItem("userId"); 
    setId(localStorage.getItem("userId"));
  }, []);

  // Fetch cooporateStudents Data from API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        if(id){
          await getQuery({
            url: `${apiUrls?.CoorporateStudent?.getAllCoorporateStudents}?corporate_id=${id}`,
            onSuccess: (data) => {
              console.log("Response data:", data);
              const studentEntries = data?.data.filter((user) =>
                user.role.includes("coorporate-student")
              );
              setCooporateStudents(studentEntries || []);
            },
            onFail: () => setCooporateStudents([]),
          });
        }
      } catch (error) {
        console.error("Failed to fetch cooporateStudents:", error);
      }
    };
    fetchStudents();
  }, [updateStatus,id]);

  const toggleStatus = async (id) => {
    try {
      await postQuery({
        url: `${apiUrls?.user?.toggleStudentStatus}/${id}`,
        postData: {},
        onSuccess: (response) => {
          const { student } = response;
          showToast.success(
            `${student?.full_name}'s status changed to ${student?.status}.`
          );
          // setUpdateStatus(id);
          setUpdateStatus((prev) => (prev === id ? `${id}-updated` : id));
        },
        onFail: () => {
          toast.error("Student status cannot be changed!");
        },
      });
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  // Table Columns Configuration
  const columns = [
    { Header: "No.", accessor: "no" },
    { Header: "Name", accessor: "full_name" },
    { Header: "Email ID", accessor: "email" },
    { Header: "Phone No.", accessor: "phone_number" },
    {
      Header: "Gender",
      accessor: "meta.gender",
      render: (row) => <span>{row?.meta?.gender}</span>,
    },
    // {
    //   Header: "Age",
    //   accessor: "meta.age",
    //   render: (row) => <span>{row?.meta?.age}</span>,
    // },
    { Header: "Join Date", accessor: "createdAt" },
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

  const filteredData =
    cooporateStudents?.filter((student) => {
      const matchesName = filterOptions.full_name
        ? (student.full_name || "")
            .toLowerCase()
            .includes(filterOptions.full_name.toLowerCase())
        : true;

      const matchesStatus = filterOptions.status
        ? (student.status || "")
            .toLowerCase()
            .includes(filterOptions.status.toLowerCase())
        : true;

      const matchesSearchQuery =
        (student.full_name &&
          student.full_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (student.email &&
          student.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (student.phone_number && student.phone_number.includes(searchQuery));

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

  // Add Student Form Toggle
  if (showAddStudentForm)
    return (
      <AddCoorporateStudentForm onCancel={() => setShowAddStudentForm(false)} />
    );

  if (loading || PostLoading) {
    return <Preloader />;
  }

  return (
    <>
      <div className="bg-gray-100 dark:bg-darkblack font-Poppins min-h-screen pt-8 p-6">
        <div className="max-w-6xl mx-auto dark:bg-inherit dark:text-whitegrey3 dark:border bg-white rounded-lg shadow-lg p-6">
          <header className="flex items-center justify-between mb-4  p-6">
            <h1 className="text-2xl font-bold">Employee List</h1>
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
                      All
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
                onClick={() => setShowAddStudentForm(true)}
                className="bg-customGreen text-white px-4 py-2 rounded-lg flex items-center"
              >
                <FaPlus className="mr-2" />
                Add Employee
              </button>
            </div>
          </header>
          {/* Student Table */}
          <MyTable columns={columns} data={formattedData} />
        </div>
      </div>
    </>
  );
};

export default CoorporateTableStudent;
