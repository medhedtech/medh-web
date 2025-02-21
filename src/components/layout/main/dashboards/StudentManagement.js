"use client";
import React, { useState, useEffect } from "react";
import { FaPlus, FaChevronDown } from "react-icons/fa";
import { useRouter } from "next/navigation";
import AddStudentForm from "./AddStudentForm";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import MyTable from "@/components/shared/common-table/page";
import useDeleteQuery from "@/hooks/deleteQuery.hook";
import { toast } from "react-toastify";
import usePostQuery from "@/hooks/postQuery.hook";
import { Upload } from "lucide-react";

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
    { Header: "No.", accessor: "no" },
    { Header: "Name", accessor: "full_name" },
    // { Header: "Age", accessor: "age" },
    { Header: "Email ID", accessor: "email" },
    { Header: "Join Date", accessor: "createdAt" },
    // { Header: "Course", accessor: "course_name" },
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
    {
      Header: "Action",
      accessor: "actions",
      render: (row) => (
        <div className="flex gap-2 items-center">
          <button
            onClick={() => deleteStudent(row._id)}
            className="text-red-500 border border-red-500 rounded-md px-2 py-1 hover:bg-red-50"
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

  // Update enrolled students columns to include delete action
  const columnsSecond = [
    { Header: "No.", accessor: "no" },
    { Header: "Name", accessor: "full_name" },
    { Header: "Email ID", accessor: "email" },
    {
      Header: "Enrolled Courses",
      accessor: "courses",
      render: (row) => {
        const courses = row.courses ? row.courses.split(", ") : [];
        // const enrollmentDates = new Date(enrollment.createdAt);
        const isExpanded = expandedRowId === row?._id;
        const visibleCourses = isExpanded ? courses : courses.slice(0, 2);

        return (
          <div>
            <ul className="list-disc pl-5 space-y-2">
              {visibleCourses.map((course, courseIndex) => (
                <li
                  key={courseIndex}
                  className="flex justify-between items-center bg-blue-200 text-blue-700 rounded-lg px-3 py-1 text-sm"
                >
                  <span>
                    {courseIndex + 1}. {course}
                  </span>
                  {/* <span className="text-sm text-gray-500 ml-4">
                    {enrollmentDates[courseIndex] || "N/A"}
                  </span> */}
                </li>
              ))}
            </ul>

            {courses.length > 2 && (
              <button
                onClick={() => toggleExpand(row?._id)}
                className="text-white bg-[#7eca9d] border border-white ml-8 mt-2 rounded-md px-[10px] py-1"
              >
                {isExpanded ? "View Less" : "View More"}{" "}
              </button>
            )}
          </div>
        );
      },
    },
    {
      Header: "Action",
      accessor: "actions",
      render: (row) => (
        <div className="flex gap-2 items-center">
          <button
            onClick={() => deleteEnrolledStudent(row._id)}
            className="text-red-500 border border-red-500 rounded-md px-2 py-1 hover:bg-red-50"
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

  // Add Student Form Toggle
  if (showAddStudentForm)
    return <AddStudentForm onCancel={() => setShowAddStudentForm(false)} />;

  return (
    <>
      <div className="bg-gray-100 dark:bg-darkblack font-Poppins min-h-screen pt-8 p-6">
        <div className="max-w-6xl mx-auto dark:bg-inherit dark:text-whitegrey3 dark:border bg-white rounded-lg shadow-lg p-6">
          <header className="flex items-center justify-between mb-4  p-6">
            <h1 className="text-2xl font-bold">Student List</h1>
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
                Add Student
              </button>

              {/* Upload CSV Button */}
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center ml-2"
                onClick={() => document.getElementById('csvUpload').click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload CSV
                <input
                  type="file"
                  id="csvUpload"
                  accept=".csv"
                  className="hidden"
                  onChange={handleCSVUpload}
                />
              </button>
            </div>
          </header>
          {/* Student Table */}
          <MyTable columns={columns} data={formattedData} loading={loading} />
        </div>
      </div>

      <div className="bg-gray-100 dark:bg-darkblack font-Poppins min-h-screen pt-8  p-6">
        <div className="max-w-6xl mx-auto dark:bg-inherit dark:text-whitegrey3 dark:border bg-white rounded-lg shadow-lg p-6">
          <header className="flex items-center justify-between mb-4  p-6">
            <h1 className="text-2xl font-bold"> Enrolled Student</h1>
            <div className="flex items-center space-x-2">
              <div className="relative flex-grow flex justify-center">
                <input
                  type="text"
                  placeholder="Search here"
                  className="border dark:bg-inherit dark:text-whitegrey3 dark:border border-gray-300 rounded-full p-2 pl-4 w-full max-w-md"
                  onChange={(e) =>
                    setEnrolledStudentSearchQuery(e.target.value)
                  }
                />
              </div>
            </div>
          </header>
          {/* Student Table */}
          <MyTable columns={columnsSecond} data={dataToRender} />{" "}
        </div>
      </div>
    </>
  );
};

export default UsersTableStudent;
