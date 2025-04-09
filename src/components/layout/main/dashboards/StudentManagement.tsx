"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FaPlus, FaChevronDown, FaSearch, FaFilter, FaSync } from "react-icons/fa";
import AddStudentForm from "./AddStudentForm";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import MyTable from "@/components/shared/common-table/page";
import useDeleteQuery from "@/hooks/deleteQuery.hook";
import { toast } from "react-toastify";
import usePostQuery from "@/hooks/postQuery.hook";
import { Upload, Loader } from "lucide-react";
import { 
  IStudent, 
  IEnrolledStudent, 
  IGroupedEnrolledStudent, 
  IFilterOptions,
  IStudentResponse,
  IEnrolledStudentResponse 
} from "@/types/student.types";

// Define TableColumn locally
type TableColumn = {
  Header: string;
  accessor: string;
  className?: string;
  width?: string;
  icon?: React.ReactNode;
  render?: (row: any) => React.ReactNode;
};

/**
 * Format date in DD/MM/YYYY format
 * @param dateString Date string to format
 * @returns Formatted date string
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

interface IExtendedEnrolledStudent {
  student: {
    _id: string;
    email: string;
    role: string[];
  };
  enrollments: Array<{
    _id: string;
    student_id: {
      _id: string;
      email: string;
      role: string[];
    };
    course_id: {
      _id: string;
      course_title: string;
      priceDisplay: string;
      id: string;
    };
    enrollment_type: string;
    batch_size: number;
    payment_status: string;
    enrollment_date: string;
    expiry_date: string;
    is_self_paced: boolean;
    status: string;
    is_completed: boolean;
    completed_on: string | null;
    is_certified: boolean;
    completed_lessons: any[];
    completed_assignments: any[];
    completed_quizzes: any[];
    progress: number;
    learning_path: string;
    last_accessed: string;
    notes: any[];
    bookmarks: any[];
    assignment_submissions: any[];
    quiz_submissions: any[];
    createdAt: string;
    updatedAt: string;
    remainingTime: number | null;
    id: string;
  }>;
}

const StudentManagement: React.FC = () => {
  const { deleteQuery } = useDeleteQuery<any>();
  const [showAddStudentForm, setShowAddStudentForm] = useState<boolean>(false);
  const [students, setStudents] = useState<IStudent[]>([]);
  const [enrolledStudents, setEnrolledStudents] = useState<IExtendedEnrolledStudent[]>([]);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [enrolledStudentSearchQuery, setEnrolledStudentSearchQuery] = useState<string>("");
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const { postQuery } = usePostQuery<any>();
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState<boolean>(false);
  const [filterOptions, setFilterOptions] = useState<IFilterOptions>({
    full_name: "",
    email: "",
    phone_number: "",
    course_name: "",
    role: "all",
    status: "all",
  });
  const [activeTab, setActiveTab] = useState<"students" | "enrolled">("students");

  const { getQuery } = useGetQuery<any>();
  const [deletedStudents, setDeletedStudents] = useState<string | null>(null);
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  // Add pagination info from the API response
  const [paginationInfo, setPaginationInfo] = useState({
    totalDocs: 0,
    limit: 10,
    totalPages: 0,
    page: 1,
    pagingCounter: 1,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null as number | null,
    nextPage: null as number | null
  });

  // Fetch Students Data from API
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      await getQuery({
        url: apiUrls?.user?.getAllStudents,
        onSuccess: (data) => {
          console.log("Response data:", data);
          const studentEntries = data?.data.filter((user: IStudent) => {
            if (filterOptions.role === "all") {
              return user.role.includes("student") || user.role.includes("coorporate-student");
            } else if (filterOptions.role === "student") {
              return user.role.includes("student");
            } else if (filterOptions.role === "corporate-student") {
              return user.role.includes("coorporate-student");
            }
            return false;
          });
          setStudents(studentEntries || []);
          toast.success("Students data refreshed successfully");
        },
        onFail: (error) => {
          console.error("Failed to fetch students:", error);
          toast.error("Failed to fetch students data");
          setStudents([]);
        },
      });
    } catch (error) {
      console.error("Failed to fetch students:", error);
      toast.error("An error occurred while fetching students");
    } finally {
      setLoading(false);
    }
  }, [getQuery, filterOptions.role]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents, deletedStudents, updateStatus]);

  // Fetching enrolled students with pagination
  const fetchEnrolledStudents = useCallback(async () => {
    try {
      setLoading(true);
      await getQuery({
        url: apiUrls?.enrolledCourses?.getAllStudentsWithEnrolledCourses({
          page: pagination.page,
          limit: pagination.limit
        }),
        onSuccess: (data) => {
          // Handle the new data structure
          if (data?.success && data?.data?.students) {
            const enrolledStudents = data.data.students as IExtendedEnrolledStudent[];
            setEnrolledStudents(enrolledStudents);
            
            // Update pagination with the new structure
            if (data.data.pagination) {
              setPaginationInfo(data.data.pagination);
              setPagination(prev => ({
                ...prev,
                total: data.data.pagination.totalDocs || 0
              }));
            }
          } else {
            setEnrolledStudents([]);
          }
        },
        onFail: () => setEnrolledStudents([]),
      });
    } catch (error) {
      console.error("Error fetching enrolled students:", error);
    } finally {
      setLoading(false);
    }
  }, [getQuery, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchEnrolledStudents();
  }, [fetchEnrolledStudents]);

  // Delete User
  const deleteStudent = (id: string): void => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    
    deleteQuery({
      url: `${apiUrls?.user?.delete}/${id}`,
      onSuccess: (res) => {
        toast.success(res?.message || "Student deleted successfully");
        setDeletedStudents(id);
      },
      onFail: (res) => {
        console.log(res, "FAILED");
        toast.error("Failed to delete student");
      },
    });
  };

  const toggleStatus = async (id: string): Promise<void> => {
    try {
      await postQuery({
        url: `${apiUrls?.user?.toggleStudentStatus}/${id}`,
        postData: {},
        onSuccess: (response) => {
          const { student } = response.data;
          toast.success(
            `${student?.full_name}'s status changed to ${student?.status}.`
          );
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
  const columns: TableColumn[] = [
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
            <div className="text-sm text-gray-500">
              {row.phone_numbers && row.phone_numbers.length > 0 
                ? row.phone_numbers[0].number 
                : row.phone_number || 'No phone'}
            </div>
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
      Header: "Role", 
      accessor: "role",
      className: "min-w-[150px]",
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.role?.map((role: string, index: number) => (
            <span 
              key={index}
              className={`px-2 py-1 text-xs rounded-full ${
                role === "student" 
                  ? "bg-green-100 text-green-800" 
                  : role === "coorporate-student" 
                    ? "bg-blue-100 text-blue-800" 
                    : "bg-gray-100 text-gray-800"
              }`}
            >
              {role.replace("-", " ")}
            </span>
          ))}
        </div>
      )
    },
    { 
      Header: "Join Date", 
      accessor: "createdAt",
      className: "min-w-[120px]",
      render: (row) => (
        <div className="text-gray-600 dark:text-gray-300">
          {formatDate(row.createdAt)}
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
      className: "w-[150px]",
      render: (row) => (
        <div className="flex gap-2 items-center">
          <button
            onClick={() => window.open(`/admin/student/${row._id}`, '_blank')}
            className="text-blue-500 hover:text-blue-700 font-medium text-sm"
          >
            View
          </button>
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

  const toggleExpand = (rowId: string): void => {
    setExpandedRowId((prevExpandedRowId) =>
      prevExpandedRowId === rowId ? null : rowId
    );
  };

  const handleSortChange = (order: "newest" | "oldest"): void => {
    setSortOrder(order);
    setIsSortDropdownOpen(false);
  };

  const handleFilterDropdownToggle = (): void => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
  };

  const handleFilterSelect = (filterType: keyof IFilterOptions, value: string): void => {
    setFilterOptions((prev) => ({ ...prev, [filterType]: value }));
    setIsFilterDropdownOpen(false);
  };

  const handlePageChange = (newPage: number): void => {
    setPagination(prev => ({ ...prev, page: newPage }));
    setPaginationInfo(prev => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit: number): void => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
    setPaginationInfo(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

  // Filter the data based on search query and filter options
  const filteredData = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch = searchQuery
        ? student.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.email?.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const matchesRole =
        filterOptions.role === "all"
          ? true
          : student.role.includes(filterOptions.role);

      const matchesStatus =
        filterOptions.status === "all"
          ? true
          : student.status === filterOptions.status;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [students, searchQuery, filterOptions]);

  // Sort the filtered data
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
    });
  }, [filteredData, sortOrder]);

  // Format the data for the table
  const formattedData = useMemo(() => {
    return sortedData.map((student, index) => ({
      ...student,
      no: index + 1,
      createdAt: formatDate(student.createdAt),
    }));
  }, [sortedData]);

  // Add delete handler for enrolled students
  const deleteEnrolledStudent = async (enrollmentId: string): Promise<void> => {
    if (window.confirm("Are you sure you want to delete this enrollment?")) {
      try {
        await deleteQuery({
          url: `${apiUrls.enrolledCourses.deleteEnrolledCourse(enrollmentId)}`,
          onSuccess: (data) => {
            toast.success(data?.message || "Enrollment deleted successfully");
            setDeletedStudents(enrollmentId);
          },
          onFail: (error) => {
            toast.error(error?.message || "Failed to delete enrollment");
          },
        });
      } catch (error) {
        toast.error("An error occurred while deleting enrollment");
      }
    }
  };

  // Update enrolled students columns
  const columnsSecond: TableColumn[] = [
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
              {visibleCourses.map((course: string, courseIndex: number) => (
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
      Header: "Enrollment Date",
      accessor: "enrollment_date",
      className: "min-w-[150px]",
      render: (row) => (
        <div className="text-gray-600 dark:text-gray-300">
          {row.enrollment_date}
        </div>
      )
    },
    {
      Header: "Action",
      accessor: "actions",
      className: "w-[100px]",
      render: (row) => (
        <div className="flex gap-2 items-center">
          <button
            onClick={() => window.open(`/admin/student/${row._id}`, '_blank')}
            className="text-blue-500 hover:text-blue-700 font-medium text-sm"
          >
            View
          </button>
        </div>
      )
    },
  ];

  // Step 1: To group the course and the enrolled students
  const groupEnrolledStudentsByCourse = (Array.isArray(enrolledStudents) ? enrolledStudents : []).reduce<Record<string, any>>(
    (acc, entry) => {
      // Handle the new data structure
      const student = entry?.student || {};
      const enrollments = entry?.enrollments || [];
      const studentId = student?._id;

      if (!acc[studentId]) {
        acc[studentId] = {
          ...student,
          courses: [],
          enrollment_date: enrollments.length > 0 ? formatDate(enrollments[0].enrollment_date) : "N/A",
        };
      }

      // Add all courses from enrollments
      enrollments.forEach((enrollment: any) => {
        if (enrollment.course_id && enrollment.course_id.course_title) {
          acc[studentId].courses.push(enrollment.course_id.course_title);
        }
      });

      return acc;
    },
    {}
  );
  
  // Step 2: Filter the grouped data based on the search query
  const filteredGroupedEnrolledStudents: IGroupedEnrolledStudent[] =
    Object.values(groupEnrolledStudentsByCourse)
      .filter((student: any) => {
        const studentMatches =
          student?.full_name
            ?.toLowerCase()
            .includes(enrolledStudentSearchQuery.toLowerCase()) ||
          student?.email
            ?.toLowerCase()
            .includes(enrolledStudentSearchQuery.toLowerCase()) ||
          student?.courses?.some((course: string) =>
            course
              .toLowerCase()
              .includes(enrolledStudentSearchQuery.toLowerCase())
          );

        return studentMatches;
      })
      .map((student: any, index: number) => ({
        no: index + 1,
        full_name: student?.full_name || "N/A",
        email: student?.email || "N/A",
        courses: student?.courses.join(", ") || "No Courses",
        enrollment_date: student?.enrollment_date || "N/A",
        _id: student?._id,
      }));

  // Add CSV upload handler
  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("csvFile", file);

        // Check for the proper API path for CSV upload
        const uploadUrl = "/api/students/upload-csv";

        await postQuery({
          url: uploadUrl,
          postData: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onSuccess: () => {
            toast.success("Students uploaded successfully!");
            fetchStudents(); // Refresh student list
          },
          onFail: (error) => {
            toast.error(error?.message || "CSV upload failed");
          }
        });
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Error processing CSV file");
      }
    }
  };

  // Export students to CSV
  const exportToCSV = (): void => {
    if (students.length === 0) {
      toast.error("No students to export");
      return;
    }

    try {
      // Convert students data to CSV format
      const headers = ["Name", "Email", "Phone Number", "Role", "Status", "Join Date"];
      const csvData = [
        headers.join(","),
        ...formattedData.map(student => [
          student.full_name,
          student.email,
          student.phone_number || "N/A",
          student.role?.join(", ") || "N/A",
          student.status,
          student.createdAt
        ].join(","))
      ].join("\n");

      // Create blob and download link
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `students_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Students exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export students");
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-darkblack min-h-screen p-6 space-y-8">
      {showAddStudentForm ? (
        // @ts-ignore
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
                    {/* Refresh Button */}
                    <button
                      onClick={fetchStudents}
                      disabled={loading}
                      className={`flex items-center px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <FaSync className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                      {loading ? 'Refreshing...' : 'Refresh'}
                    </button>
                    
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
                        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-20">
                          <div className="p-2">
                            <div className="mb-2">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                              <select 
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2"
                                value={filterOptions.role}
                                onChange={(e) => handleFilterSelect("role", e.target.value)}
                              >
                                <option value="all">All Roles</option>
                                <option value="student">Student</option>
                                <option value="corporate-student">Corporate Student</option>
                              </select>
                            </div>
                            <div className="mb-2">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                              <select 
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2"
                                value={filterOptions.status}
                                onChange={(e) => handleFilterSelect("status", e.target.value)}
                              >
                                <option value="all">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                              </select>
                            </div>
                            <button
                              onClick={() => setFilterOptions({
                                full_name: "",
                                email: "",
                                phone_number: "",
                                course_name: "",
                                role: "all",
                                status: "all",
                              })}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded text-blue-600"
                            >
                              Clear Filters
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
                      onClick={() => document.getElementById('csvUpload')?.click()}
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
                    
                    <button
                      onClick={exportToCSV}
                      className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Upload className="mr-2 h-4 w-4 transform rotate-180" />
                      Export CSV
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700 mt-6">
                  <button
                    className={`px-4 py-2 font-medium text-sm ${
                      activeTab === "students"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                    onClick={() => setActiveTab("students")}
                  >
                    Students
                  </button>
                  <button
                    className={`px-4 py-2 font-medium text-sm ${
                      activeTab === "enrolled"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                    onClick={() => setActiveTab("enrolled")}
                  >
                    Enrolled Students
                  </button>
                </div>
              </div>

              {/* Student Table */}
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader className="animate-spin h-8 w-8 text-blue-600" />
                  </div>
                ) : (
                  <>
                    {activeTab === "students" && (
                      <MyTable 
                        columns={columns} 
                        data={formattedData}
                      />
                    )}
                    {activeTab === "enrolled" && (
                      <>
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
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
                        <MyTable 
                          columns={columnsSecond} 
                          data={filteredGroupedEnrolledStudents}
                        />
                        {/* Pagination */}
                        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-700 dark:text-gray-300 mr-2">Show:</span>
                            <select
                              className="border border-gray-300 dark:border-gray-600 rounded-md p-1 text-sm"
                              value={pagination.limit}
                              onChange={(e) => handleLimitChange(Number(e.target.value))}
                            >
                              <option value={5}>5</option>
                              <option value={10}>10</option>
                              <option value={20}>20</option>
                              <option value={50}>50</option>
                            </select>
                            <span className="text-sm text-gray-700 dark:text-gray-300 ml-2">entries</span>
                          </div>
                          <div className="flex items-center">
                            <button
                              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md mr-2 disabled:opacity-50"
                              onClick={() => handlePageChange(paginationInfo.page - 1)}
                              disabled={!paginationInfo.hasPrevPage}
                            >
                              Previous
                            </button>
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              Page {paginationInfo.page} of {paginationInfo.totalPages}
                            </span>
                            <button
                              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md ml-2 disabled:opacity-50"
                              onClick={() => handlePageChange(paginationInfo.page + 1)}
                              disabled={!paginationInfo.hasNextPage}
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentManagement; 