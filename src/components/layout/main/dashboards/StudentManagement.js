"use client";
import React, { useState, useEffect } from "react";
import { FaPlus, FaChevronDown, FaSearch, FaFilter } from "react-icons/fa";
import { useRouter } from "next/navigation";
import AddStudentForm from "./AddStudentForm";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import MyTable from "@/components/shared/common-table/page";
import useDeleteQuery from "@/hooks/deleteQuery.hook";
import { toast } from "react-toastify";
import usePostQuery from "@/hooks/postQuery.hook";
import { Upload, Loader } from "lucide-react";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const UsersTableStudent = () => {
  const { deleteQuery } = useDeleteQuery();
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [students, setStudents] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [enrolledStudentSearchQuery, setEnrolledStudentSearchQuery] =
    useState("");
  const [expandedRowId, setExpandedRowId] = useState(null);
  const { postQuery } = usePostQuery();
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    course_name: "",
  });

  const { getQuery } = useGetQuery();
  const [deletedStudents, setDeletedStudents] = useState(null);
  const [updateStatus, setUpdateStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch Students Data from API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        await getQuery({
          url: apiUrls?.user?.getAll,
          onSuccess: (data) => {
            console.log("Response data:", data);
            const studentEntries = data?.data.filter((user) =>
              user.role.includes("student")
            );
            setStudents(studentEntries || []);
          },
          onFail: () => setStudents([]),
        });
      } catch (error) {
        console.error("Failed to fetch students:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [deletedStudents, updateStatus]);

  // Fetching enrolled students
  useEffect(() => {
    const fetchEnrolledStudents = async () => {
      try {
        await getQuery({
          url: apiUrls?.EnrollCourse?.getEnrolledStudents,
          onSuccess: (data) => {
            setEnrolledStudents(data?.enrollments || []);
            console.log("enrolled studnet data:", enrolledStudents);
          },
          onFail: () => setEnrolledStudents([]),
        });
      } catch (error) {
        console.error("Error fetching enrolled students:", error);
      }
    };
    fetchEnrolledStudents();
  }, [deletedStudents, updateStatus]);

  // Delete User
  const deleteStudent = (id) => {
    deleteQuery({
      url: `${apiUrls?.user?.delete}/${id}`,
      onSuccess: (res) => {
        toast.success(res?.message);
        setDeletedStudents(id);
      },
      onFail: (res) => console.log(res, "FAILED"),
    });
  };

  const toggleStatus = async (id) => {
    try {
      await postQuery({
        url: `${apiUrls?.user?.toggleStudentStatus}/${id}`,
        postData: {},
        onSuccess: (response) => {
          const { student } = response;
          toast.success(
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
            onClick={() => deleteStudent(row._id)}
            className="text-red-500 hover:text-red-700 font-medium text-sm"
          >
            Delete
          </button>
        </div>
      )
    },
  ];

  const toggleExpand = (rowId) => {
    setExpandedRowId((prevExpandedRowId) =>
      prevExpandedRowId === rowId ? null : rowId
    );
  };

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
    students?.filter((student) => {
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

  // Add delete handler for enrolled students
  const deleteEnrolledStudent = async (enrollmentId) => {
    if (confirm("Are you sure you want to delete this enrollment?")) {
      try {
        await postQuery({
          url: `${apiUrls.EnrollCourse.deleteEnrollment}/${enrollmentId}`,
          method: "DELETE",
          onSuccess: () => {
            toast.success("Enrollment deleted successfully");
            // Refresh enrolled students list
            setEnrolledStudents(prev => prev.filter(e => e._id !== enrollmentId));
          },
          onFail: (err) => toast.error("Failed to delete enrollment")
        });
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Error deleting enrollment");
      }
    }
  };

  // Update enrolled students columns
  const columnsSecond = [
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
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold">
            {row.full_name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="font-medium text-gray-900 dark:text-white">
            {row.full_name}
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
      Header: "Enrolled Courses",
      accessor: "courses",
      className: "min-w-[300px]",
      render: (row) => {
        const courses = row.courses ? row.courses.split(", ") : [];
        const isExpanded = expandedRowId === row?._id;
        const visibleCourses = isExpanded ? courses : courses.slice(0, 2);

        return (
          <div>
            <div className="space-y-2">
              {visibleCourses.map((course, courseIndex) => (
                <div
                  key={courseIndex}
                  className="inline-flex items-center bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full px-3 py-1 text-sm mr-2"
                >
                  {course}
                </div>
              ))}
            </div>

            {courses.length > 2 && (
              <button
                onClick={() => toggleExpand(row?._id)}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium mt-2"
              >
                {isExpanded ? "Show Less" : `+${courses.length - 2} more`}
              </button>
            )}
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
            onClick={() => deleteEnrolledStudent(row._id)}
            className="text-red-500 hover:text-red-700 font-medium text-sm"
          >
            Delete
          </button>
        </div>
      )
    },
  ];

  // Step 1: To group the course and the enrolled students
  const groupEnrolledStudentsByCourse = enrolledStudents.reduce(
    (acc, entry) => {
      const student = entry?.student_id || {};
      const course = entry?.course_id || {};
      const studentId = student?._id;

      if (!acc[studentId]) {
        acc[studentId] = {
          ...student,
          courses: [],
        };
      }

      acc[studentId].courses.push(course.course_title);

      return acc;
    },
    {}
  );
  // Step 2: Filter the grouped data based on the search query
  const filteredGroupedEnrolledStudents =
    Object.values(groupEnrolledStudentsByCourse)
      .filter((student) => {
        const studentMatches =
          student?.full_name
            ?.toLowerCase()
            .includes(enrolledStudentSearchQuery.toLowerCase()) ||
          student?.email
            ?.toLowerCase()
            .includes(enrolledStudentSearchQuery.toLowerCase()) ||
          student?.courses?.some((course) =>
            course
              .toLowerCase()
              .includes(enrolledStudentSearchQuery.toLowerCase())
          );

        return studentMatches;
      })
      .map((student, index) => ({
        no: index + 1,
        full_name: student?.full_name || "N/A",
        email: student?.email || "N/A",
        courses: student?.courses.join(", ") || "No Courses",
        enrollment_date: formatDate(student?.createdAt),
        _id: student?._id,
      })) || [];

  // Step 3: If no search query is provided, show all grouped students
  const dataToRender = filteredGroupedEnrolledStudents;

  // Add CSV upload handler
  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("csvFile", file);

        await postQuery({
          url: apiUrls.students.uploadCSV,
          postData: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onSuccess: () => {
            toast.success("Students uploaded successfully!");
            fetchStudents(); // Refresh student list
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

  return (
    <div className="bg-gray-50 dark:bg-darkblack min-h-screen p-6 space-y-8">
      {showAddStudentForm ? (
        <AddStudentForm onCancel={() => setShowAddStudentForm(false)} />
      ) : (
        <>
          {/* Students List Section */}
          <div className="max-w-7xl mx-auto">
            <div className="bg-white dark:bg-inherit dark:text-whitegrey3 dark:border rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Student Management</h1>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Search Bar */}
                    <div className="relative flex-grow max-w-md">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search students..."
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
                              Active Students
                            </button>
                            <button
                              onClick={() => handleFilterSelect("status", "Inactive")}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                            >
                              Inactive Students
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
                      onClick={() => setShowAddStudentForm(true)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FaPlus className="mr-2" />
                      Add Student
                    </button>
                    
                    <button
                      onClick={() => document.getElementById('csvUpload').click()}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Import CSV
                      <input
                        type="file"
                        id="csvUpload"
                        accept=".csv"
                        className="hidden"
                        onChange={handleCSVUpload}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Student Table */}
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

          {/* Enrolled Students Section */}
          <div className="max-w-7xl mx-auto mt-8">
            <div className="bg-white dark:bg-inherit dark:text-whitegrey3 dark:border rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Enrolled Students</h2>
                  
                  {/* Search Bar */}
                  <div className="relative flex-grow max-w-md">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search enrolled students..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onChange={(e) => setEnrolledStudentSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Enrolled Students Table */}
              <div className="overflow-x-auto">
                <MyTable 
                  columns={columnsSecond} 
                  data={dataToRender}
                  className="w-full" 
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UsersTableStudent;
