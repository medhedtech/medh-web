import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { apiUrls, apiClient } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import useDeleteQuery from "@/hooks/deleteQuery.hook";
import usePostQuery from "@/hooks/postQuery.hook";
import { IStudent, IFilterOptions } from "@/types/student.types";

/**
 * Format date in DD/MM/YYYY format
 * @param dateString Date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Custom hook for managing student data and operations
 * Includes functionality for fetching, filtering, sorting, and manipulating student data
 */
export const useStudentManagement = () => {
  // API query hooks
  const { getQuery } = useGetQuery<any>();
  const { deleteQuery } = useDeleteQuery<any>();
  const { postQuery } = usePostQuery<any>();

  // State management
  const [students, setStudents] = useState<IStudent[]>([]);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState<boolean>(false);
  const [deletedStudents, setDeletedStudents] = useState<string | null>(null);
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Filter options state
  const [filterOptions, setFilterOptions] = useState<IFilterOptions>({
    full_name: "",
    email: "",
    phone_number: "",
    course_name: "",
    role: "all",
    status: "all",
  });

  // Fetch Students Data from API
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);

      // --- REMOVED Authentication Check --- (Now handled globally by useAuth)
      // const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      // if (token) {
      //   apiClient.setAuthToken(token); 
      // } else {
      //   console.error("Authentication token not found. Cannot fetch students.");
      //   showToast.error("Authentication error. Please log in again.");
      //   setLoading(false);
      //   setStudents([]); 
      //   return; 
      // }
      // --- End REMOVED ---

      // The apiClient used here will now have the token set globally via useAuth
      await getQuery({
        url: apiUrls?.user?.getAllStudents,
        onSuccess: (data) => {
          // Check if data and data.data exist before filtering
          const studentEntries = data?.data?.filter((user: IStudent) => {
            if (filterOptions.role === "all") {
              return user.role.includes("student") || user.role.includes("coorporate-student");
            } else if (filterOptions.role === "student") {
              return user.role.includes("student");
            } else if (filterOptions.role === "corporate-student") {
              return user.role.includes("coorporate-student");
            }
            return false;
          }) || []; // Provide an empty array as fallback if data or data.data is null/undefined

          setStudents(studentEntries);
          // Avoid redundant success toast if data is empty but request succeeded
          if (studentEntries.length > 0) {
             showToast.success("Students data refreshed successfully");
          } else {
             console.log("Fetched students successfully, but no matching entries found.");
          }
        },
        onFail: (error) => {
          console.error("Failed to fetch students:", error);
          // Check for specific 401 error
          if (error?.message?.includes('401')) {
             showToast.error("Unauthorized: Please check your login session.");
             // Optionally redirect to login here
          } else {
             showToast.error("Failed to fetch students data");
          }
          setStudents([]);
        },
      });
    } catch (error) {
      console.error("Failed to fetch students:", error);
      showToast.error("An error occurred while fetching students");
      setStudents([]); // Clear students on catch
    } finally {
      setLoading(false);
    }
  }, [getQuery, filterOptions.role]);

  // Load students on mount and when dependencies change
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents, deletedStudents, updateStatus]);

  // Delete User
  const deleteStudent = (id: string): void => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    
    deleteQuery({
      url: `${apiUrls?.user?.delete}/${id}`,
      onSuccess: (res) => {
        showToast.success(res?.message || "Student deleted successfully");
        setDeletedStudents(id);
      },
      onFail: (res) => {
        console.error("Failed to delete student:", res);
        showToast.error("Failed to delete student");
      },
    });
  };

  // Toggle student status (active/inactive)
  const toggleStatus = async (id: string): Promise<void> => {
    try {
      await postQuery({
        url: `${apiUrls?.user?.toggleStudentStatus}/${id}`,
        postData: {},
        onSuccess: (response) => {
          const { student } = response.data;
          showToast.success(
            `${student?.full_name}'s status changed to ${student?.status}.`
          );
          setUpdateStatus((prev) => (prev === id ? `${id}-updated` : id));
        },
        onFail: () => {
          showToast.error("Student status cannot be changed!");
        },
      });
    } catch (error) {
      showToast.error("Something went wrong!");
    }
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
            showToast.success("Students uploaded successfully!");
            fetchStudents(); // Refresh student list
          },
          onFail: (error) => {
            showToast.error(error?.message || "CSV upload failed");
          }
        });
      } catch (error) {
        console.error("Upload error:", error);
        showToast.error("Error processing CSV file");
      }
    }
  };

  // Export students to CSV
  const exportToCSV = (): void => {
    if (students.length === 0) {
      showToast.error("No students to export");
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
      
      showToast.success("Students exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      showToast.error("Failed to export students");
    }
  };

  return {
    students,
    loading,
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    filterOptions,
    setFilterOptions,
    isFilterDropdownOpen,
    setIsFilterDropdownOpen,
    isSortDropdownOpen,
    setIsSortDropdownOpen,
    filteredData,
    sortedData,
    formattedData,
    deleteStudent,
    toggleStatus,
    fetchStudents,
    handleCSVUpload,
    exportToCSV,
  };
}; 