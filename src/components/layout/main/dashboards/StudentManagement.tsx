"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FaPlus, FaChevronDown, FaEye, FaSearch, FaFilter, FaUsers, FaUserGraduate, FaTrash, FaPhone, FaSync, FaEnvelope, FaCalendarAlt, FaUserCheck, FaUserTie, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import MyTable from "@/components/shared/common-table/page";
import useDeleteQuery from "@/hooks/deleteQuery.hook";
import usePostQuery from "@/hooks/postQuery.hook";
import { Upload, Loader, Download, FileText } from "lucide-react";
import { IStudent, IFilterOptions } from "@/types/student.types";
import { motion, AnimatePresence } from "framer-motion";
import { getAuthToken, isAuthenticated } from "@/utils/auth";
import InstructorAssignmentModal from "@/components/shared/modals/InstructorAssignmentModal";

interface IColumn {
  Header: string;
  accessor: string;
  className?: string;
  render?: (row: IStudent) => React.ReactNode;
}

interface StudentsResponse {
  success: boolean;
  count: number;
  total: number;
  totalPages: number;
  currentPage: number;
  data: IStudent[];
}

const StudentManagement: React.FC = () => {
  const { deleteQuery } = useDeleteQuery();
  const { postQuery } = usePostQuery();
  const { getQuery } = useGetQuery();

  // Store all students for client-side filtering and pagination
  const [allStudents, setAllStudents] = useState<IStudent[]>([]);
  const [students, setStudents] = useState<IStudent[]>([]);
  const [refreshKey, setRefreshKey] = useState<string>(Date.now().toString());
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
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
  const [loading, setLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [pageSize] = useState<number>(10);
  
  // Instructor Assignment Modal State
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState<boolean>(false);
  const [selectedStudentForAssignment, setSelectedStudentForAssignment] = useState<IStudent | null>(null);

  // Force refresh function that generates a new key
  const forceRefresh = useCallback(() => {
    const newKey = `${Date.now()}-${Math.random()}`;
    setRefreshKey(newKey);
    console.log('Force refresh triggered with key:', newKey);
  }, []);

  // Fetch students data from API with pagination support
  const fetchStudents = useCallback(async (forceReload: boolean = false): Promise<void> => {
    try {
      setLoading(true);
      console.log('Fetching students...', forceReload ? '(Force reload)' : '');
      
      // Check authentication before making the request
      const token = getAuthToken();
      const authenticated = isAuthenticated();
      console.log('Auth status:', { authenticated, hasToken: !!token });
      
      if (!authenticated || !token) {
        console.error('User not authenticated');
        showToast.error('Please log in to access student data');
        setAllStudents([]);
        setStudents([]);
        return;
      }
      
      // Build query parameters
      const queryParams = new URLSearchParams();

      // Add cache busting parameter for force reload
      if (forceReload) {
        queryParams.append('_t', Date.now().toString());
      }

      const url = `${apiUrls.Students?.getAllStudents}?${queryParams.toString()}`;

      await getQuery({
        url,
        requireAuth: true,
        skipCache: forceReload,
        debug: true,
        onSuccess: (response: any) => {
          console.log('Students fetched successfully:', response);
          
          let studentsArray: IStudent[] = [];
          
          // Handle different response structures
          if (response?.data) {
            // Check if it's the paginated structure we expected
            if (response.data.success && Array.isArray(response.data.data)) {
              studentsArray = response.data.data;
            }
            // Check if it's the actual API structure with students array
            else if (Array.isArray(response.data.students)) {
              studentsArray = response.data.students;
            }
            // Fallback for direct data array
            else if (Array.isArray(response.data)) {
              studentsArray = response.data;
            }
          } 
          // Handle direct response with students array (current API structure)
          else if (response?.students && Array.isArray(response.students)) {
            studentsArray = response.students;
          }
          // Fallback for direct array response
          else if (Array.isArray(response)) {
            studentsArray = response;
          }
          
          if (studentsArray.length > 0) {
            setAllStudents([...studentsArray]);
            setTotalStudents(response?.totalStudents || studentsArray.length);
            console.log(`Loaded ${studentsArray.length} total students`);
          } else {
            setAllStudents([]);
            setTotalStudents(0);
            console.error("No students found in response:", response);
          }
        },
        onFail: (error) => {
          console.error("Failed to fetch students:", error);
          // Check if it's an authentication error
          if (error?.response?.status === 401 || error?.response?.status === 403) {
            showToast.error('Authentication failed. Please log in again.');
          } else {
            showToast.error('Failed to fetch students. Please try again.');
          }
          setAllStudents([]);
          setStudents([]);
        },
      });
    } catch (error) {
      console.error("Failed to fetch students:", error);
      setAllStudents([]);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [getQuery]);

  // Manual refresh function
  const handleManualRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchStudents(true);
    setIsRefreshing(false);
    showToast.success("Table refreshed successfully!");
  }, [fetchStudents]);

  // Handle page change
  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  }, [totalPages, currentPage]);

  // Fetch students on component mount and when refresh key changes
  useEffect(() => {
    fetchStudents(true);
  }, [fetchStudents]);

  // Handle search and filter changes (reset to page 1)
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterOptions.status]);

  // Initial load and refresh key changes
  useEffect(() => {
    console.log('useEffect triggered with refreshKey:', refreshKey);
    fetchStudents(true);
  }, [refreshKey, fetchStudents]);

  // Delete Student with immediate refresh
  const deleteStudent = useCallback((id: string): void => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    
    deleteQuery({
      url: `${apiUrls.Students?.deleteStudent}/${id}`,
      requireAuth: true,
      onSuccess: (res: any) => {
        console.log('Delete success, triggering refresh');
        showToast.success(res?.message || "Student deleted successfully");
        
        // Refresh the current page
        fetchStudents(true);
      },
      onFail: (res: any) => {
        console.error("Failed to delete student:", res);
        showToast.error("Failed to delete student");
      },
    });
  }, [deleteQuery, fetchStudents, currentPage, searchQuery, filterOptions.status]);

  // Toggle Student Status with immediate refresh
  const toggleStatus = useCallback(async (id: string): Promise<void> => {
    try {
      // Check authentication before making the request
      const token = getAuthToken();
      if (!token) {
        showToast.error('Please log in to perform this action');
        return;
      }

      // Make direct PUT request using apiWithAuth since postQuery only supports POST
      const apiWithAuth = (await import('@/utils/apiWithAuth')).default;
      
      console.log(`Making PUT request to: ${apiUrls.Students?.toggleStudentStatus}/${id}`);
      
      const response = await apiWithAuth.put(`${apiUrls.Students?.toggleStudentStatus}/${id}`, {});
      
      console.log('Status toggle success:', response.data);
      
      // Handle different response structures
      let updatedStudent = response?.data?.data || response?.data;
      let statusMessage = '';
      
      if (updatedStudent && updatedStudent.full_name) {
        statusMessage = `${updatedStudent.full_name}'s status changed to ${updatedStudent.status}.`;
      } else {
        // Fallback: find the student and toggle their status locally
        const currentStudent = students.find(s => s._id === id);
        if (currentStudent) {
          const newStatus = currentStudent.status === 'Active' ? 'Inactive' : 'Active';
          statusMessage = `${currentStudent.full_name}'s status changed to ${newStatus}.`;
        } else {
          statusMessage = 'Student status updated successfully.';
        }
      }
      
      showToast.success(statusMessage);
      
      // Refresh the current page
      fetchStudents(true);
      
    } catch (error: any) {
      console.error("Error in toggleStatus:", error);
      
      // Extract error message from response
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.data?.error || 
                          error?.message || 
                          "Student status cannot be changed!";
      
      showToast.error(errorMessage);
    }
  }, [fetchStudents, currentPage, searchQuery, filterOptions.status, students]);

  // Handle CSV Upload with immediate refresh
  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const formData = new FormData();
      formData.append("csvFile", file);

      await postQuery({
        url: `${apiUrls.Students?.getAllStudents}/upload-csv`,
        postData: formData,
        requireAuth: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onSuccess: () => {
          console.log('CSV upload success, triggering refresh');
          showToast.success("Students uploaded successfully!");
          
          // Refresh the current page
          fetchStudents(true);
        },
        onFail: (error: any) => {
          showToast.error(error.message || "CSV upload failed");
        }
      });
    } catch (error) {
      console.error("Upload error:", error);
      showToast.error("Error processing CSV file");
    }
  };

  // Table Columns Configuration
  const columns: IColumn[] = [
    { 
      Header: "No.", 
      accessor: "no",
      className: "w-16 text-center" 
    },
    { 
      Header: "Name", 
      accessor: "full_name",
      className: "min-w-[200px]",
      render: (row: IStudent) => (
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div 
            className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-lg"
            aria-label={`Avatar for ${row.full_name}`}
          >
            {row.full_name?.split(' ').map(n => n.charAt(0)).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">{row.full_name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <FaEnvelope className="w-3 h-3" />
              {row.email}
            </div>
          </div>
        </motion.div>
      )
    },
    { 
      Header: "Contact", 
      accessor: "phone_numbers",
      className: "min-w-[150px]",
      render: (row: IStudent) => {
        const phoneNumber = row.phone_numbers && row.phone_numbers.length > 0 
          ? row.phone_numbers[0].number 
          : (row.phone_number || 'No phone');
        return (
          <div className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
            <FaPhone className="w-3 h-3" />
            {phoneNumber}
          </div>
        );
      }
    },
    { 
      Header: "Join Date", 
      accessor: "createdAt",
      className: "min-w-[120px]",
      render: (row: IStudent) => (
        <div className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
          <FaCalendarAlt className="w-3 h-3" />
          {new Date(row.createdAt).toLocaleDateString("en-GB")}
        </div>
      )
    },
    {
      Header: "Role",
      accessor: "role",
      className: "min-w-[120px]",
      render: (row: IStudent) => (
        <div className="space-y-1 text-sm">
          {row.role?.map((r, index) => (
            <span 
              key={index}
              className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium mr-1"
            >
              {r}
            </span>
          ))}
        </div>
      )
    },
    {
      Header: "Verification",
      accessor: "emailVerified",
      className: "min-w-[120px]",
      render: (row: IStudent) => (
        <div className="flex flex-col">
          <span className={`font-medium text-sm ${row.emailVerified ? 'text-green-600' : 'text-red-600'}`}>
            {row.emailVerified ? 'Verified' : 'Unverified'}
          </span>
          <span className="text-gray-500 text-xs">
            {row.login_count} logins
          </span>
        </div>
      )
    },
    {
      Header: "Status",
      accessor: "status",
      className: "min-w-[150px]",
      render: (row: IStudent) => {
        const isActive = row?.status === "Active";
        return (
          <div className="flex gap-3 items-center">
            <motion.button
              onClick={() => toggleStatus(row._id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${
                isActive ? "bg-green-500 shadow-lg shadow-green-500/30" : "bg-gray-400 shadow-lg shadow-gray-400/30"
              }`}
              aria-label={`Toggle status for ${row.full_name}`}
            >
              <motion.div
                className="w-4 h-4 bg-white rounded-full shadow-md"
                animate={{ x: isActive ? 24 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            </motion.button>
            <span
              className={`text-sm font-semibold px-2 py-1 rounded-full ${
                isActive 
                  ? "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30" 
                  : "text-gray-700 bg-gray-100 dark:text-gray-400 dark:bg-gray-700/30"
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
      className: "w-[200px]",
      render: (row: IStudent) => (
        <div className="flex gap-2 items-center">
          <motion.button
            onClick={() => handleAssignInstructor(row)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 px-3 py-1.5 text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-600 rounded-lg font-medium text-sm transition-all duration-200"
            aria-label={`Assign instructor to ${row.full_name}`}
          >
            <FaUserTie className="w-3 h-3" />
            Assign
          </motion.button>
          <motion.button
            onClick={() => deleteStudent(row._id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 px-3 py-1.5 text-red-600 hover:text-white hover:bg-red-600 border border-red-600 rounded-lg font-medium text-sm transition-all duration-200"
            aria-label={`Delete student ${row.full_name}`}
          >
            <FaTrash className="w-3 h-3" />
            Delete
          </motion.button>
        </div>
      )
    },
  ];

  // Filter and sort the data using memoization (client-side filtering for current page)
  const filteredData = useMemo(() => {
    return allStudents.filter((student) => {
      const matchesName = filterOptions.full_name
        ? (student.full_name || "")
            .toLowerCase()
            .includes(filterOptions.full_name.toLowerCase())
        : true;

      const matchesRole = filterOptions.role !== "all"
        ? student.role?.some(r => r.toLowerCase().includes(filterOptions.role.toLowerCase()))
        : true;

      const matchesStatus = filterOptions.status !== "all"
        ? student.status === filterOptions.status
        : true;

      const matchesSearchQuery = searchQuery
        ? (student.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (student.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (student.phone_numbers && student.phone_numbers.length > 0 
            ? student.phone_numbers.some(phone => phone.number.includes(searchQuery))
            : false) ||
          (student.phone_number || "").includes(searchQuery) // Legacy support
        : true;

      return matchesName && matchesRole && matchesStatus && matchesSearchQuery;
    });
  }, [allStudents, filterOptions, searchQuery]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortOrder === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return 0;
    });
  }, [filteredData, sortOrder]);

  // Update pagination when filtered data changes
  useEffect(() => {
    const totalFiltered = sortedData.length;
    const calculatedTotalPages = Math.ceil(totalFiltered / pageSize);
    setTotalPages(calculatedTotalPages);
    
    // Reset to page 1 if current page is beyond available pages
    if (currentPage > calculatedTotalPages && calculatedTotalPages > 0) {
      setCurrentPage(1);
    }
  }, [sortedData, pageSize, currentPage]);

  // Apply pagination to sorted and filtered data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize]);

  const formattedData = useMemo(() => {
    return paginatedData.map((student, index) => ({
      ...student,
      no: ((currentPage - 1) * pageSize) + index + 1,
    }));
  }, [paginatedData, currentPage, pageSize]);

  // Update students state when paginated data changes
  useEffect(() => {
    setStudents(paginatedData);
  }, [paginatedData]);

  const handleSortChange = (order: "newest" | "oldest"): void => {
    setSortOrder(order);
    setIsSortDropdownOpen(false);
  };

  const handleFilterDropdownToggle = (): void => {
    setIsFilterDropdownOpen((prev) => !prev);
  };

  const handleFilterSelect = (filterType: keyof IFilterOptions, value: string): void => {
    setFilterOptions((prev) => ({ ...prev, [filterType]: value }));
    setIsFilterDropdownOpen(false);
  };

  // Instructor Assignment Functions
  const handleAssignInstructor = (student: IStudent): void => {
    setSelectedStudentForAssignment(student);
    setIsAssignmentModalOpen(true);
  };

  const handleAssignmentModalClose = (): void => {
    setIsAssignmentModalOpen(false);
    setSelectedStudentForAssignment(null);
  };

  const handleAssignmentSuccess = (): void => {
    // Refresh the student list after successful assignment
    fetchStudents(true);
  };

  // Pagination component
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            i === currentPage
              ? 'bg-green-600 text-white'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
          }`}
        >
          {i}
        </button>
      );
    }

    const filteredTotal = sortedData.length;
    const startItem = ((currentPage - 1) * pageSize) + 1;
    const endItem = Math.min(currentPage * pageSize, filteredTotal);

    return (
      <div className="flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
          <span>
            Showing {startItem} to {endItem} of {filteredTotal} students
            {filteredTotal !== totalStudents && (
              <span className="text-gray-500"> (filtered from {totalStudents} total)</span>
            )}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-500 dark:hover:text-gray-300"
          >
            <FaChevronLeft className="h-5 w-5" />
          </button>
          
          {startPage > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                1
              </button>
              {startPage > 2 && <span className="text-gray-500">...</span>}
            </>
          )}
          
          {pages}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="text-gray-500">...</span>}
              <button
                onClick={() => handlePageChange(totalPages)}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                {totalPages}
              </button>
            </>
          )}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-500 dark:hover:text-gray-300"
          >
            <FaChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      className="w-full space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Debug Info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Debug: Page {currentPage}/{totalPages} | Showing: {students.length} | Filtered: {sortedData.length} | Total: {totalStudents} | Loading: {loading.toString()}
          </p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div 
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Students</p>
              <p className="text-3xl font-bold">{totalStudents}</p>
            </div>
            <div className="p-3 bg-green-400/30 rounded-lg">
              <FaUsers className="w-8 h-8" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Active Students</p>
              <p className="text-3xl font-bold">
                {allStudents.filter(student => student.status === 'Active').length}
              </p>
            </div>
            <div className="p-3 bg-blue-400/30 rounded-lg">
              <FaUserCheck className="w-8 h-8" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Filtered Results</p>
              <p className="text-3xl font-bold">{sortedData.length}</p>
            </div>
            <div className="p-3 bg-purple-400/30 rounded-lg">
              <FaFilter className="w-8 h-8" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-6 text-white"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium">Verified Students</p>
              <p className="text-3xl font-bold">
                {allStudents.filter(student => student.emailVerified).length}
              </p>
            </div>
            <div className="p-3 bg-indigo-400/30 rounded-lg">
              <FaUserCheck className="w-8 h-8" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-gray-800 dark:text-gray-200 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <FaUsers className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Student Management</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage student profiles and enrollments</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-grow max-w-md">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search students..."
                  aria-label="Search students"
                  value={searchQuery}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={handleFilterDropdownToggle}
                  className="flex items-center px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  aria-haspopup="true"
                  aria-expanded={isFilterDropdownOpen}
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
                      <button
                        onClick={() => handleFilterSelect("role", "student")}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                      >
                        Regular Students
                      </button>
                      <button
                        onClick={() => handleFilterSelect("role", "corporate-student")}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                      >
                        Corporate Students
                      </button>
                      <button
                        onClick={() => handleFilterSelect("status", "all")}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded border-t border-gray-200 dark:border-gray-600"
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
                  onClick={() => setIsSortDropdownOpen((prev) => !prev)}
                  className="flex items-center px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  aria-haspopup="true"
                  aria-expanded={isSortDropdownOpen}
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
              <div className="flex flex-wrap gap-3">
                <motion.button
                  onClick={handleManualRefresh}
                  disabled={isRefreshing}
                  whileHover={{ scale: isRefreshing ? 1 : 1.02 }}
                  whileTap={{ scale: isRefreshing ? 1 : 0.98 }}
                  className={`flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 ${
                    isRefreshing 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 shadow-lg shadow-gray-600/20'
                  } text-white`}
                  aria-label="Refresh Table"
                >
                  <FaSync className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </motion.button>

                <motion.button
                  onClick={() => {
                    window.location.href = '/dashboards/admin/add-student';
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg shadow-green-600/20"
                  aria-label="Add Student"
                >
                  <FaPlus className="mr-2" />
                  Add Student
                </motion.button>
                
                <motion.button
                  onClick={() => document.getElementById('studentCSVUpload')?.click()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-600/20"
                  aria-label="Import CSV"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Import CSV
                  <input
                    type="file"
                    id="studentCSVUpload"
                    accept=".csv"
                    className="hidden"
                    onChange={handleCSVUpload}
                  />
                </motion.button>

                <motion.button
                  onClick={() => {
                    // Export functionality can be added here
                    showToast.info("Export functionality coming soon!");
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg shadow-purple-600/20"
                  aria-label="Export Data"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto relative">
          {/* Refresh overlay */}
          {(loading || isRefreshing) && (
            <motion.div 
              className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Loader className="animate-spin h-12 w-12 text-green-600 mb-4" aria-label="Loading" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {isRefreshing ? 'Refreshing students...' : 'Loading students...'}
              </p>
            </motion.div>
          )}
          
          {loading && !students.length ? (
            <motion.div 
              className="flex flex-col items-center justify-center p-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Loader className="animate-spin h-12 w-12 text-green-600 mb-4" aria-label="Loading" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">Loading students...</p>
            </motion.div>
          ) : formattedData.length === 0 ? (
            <motion.div 
              className="flex flex-col items-center justify-center p-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                <FaUsers className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No students found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                {searchQuery || Object.values(filterOptions).some(v => v && v !== "all") 
                  ? "No students match your current filters. Try adjusting your search criteria."
                  : "Get started by adding your first student to the platform."
                }
              </p>
              <motion.button
                onClick={() => {
                  window.location.href = '/dashboards/admin/add-student';
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaPlus className="w-4 h-4" />
                Add First Student
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key={`table-${refreshKey}-${formattedData.length}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <MyTable 
                key={`student-table-${refreshKey}`}
                columns={columns} 
                data={formattedData}
                className="w-full"
              />
            </motion.div>
          )}
        </div>

        {/* Pagination */}
        {renderPagination()}
      </div>

      {/* Instructor Assignment Modal */}
      <InstructorAssignmentModal
        isOpen={isAssignmentModalOpen}
        onClose={handleAssignmentModalClose}
        onSuccess={handleAssignmentSuccess}
        type="student"
        targetData={selectedStudentForAssignment}
        title="Assign Instructor to Student"
      />
    </motion.div>
  );
};

export default StudentManagement; 