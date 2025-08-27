"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FaPlus, FaChevronDown, FaEye, FaSearch, FaFilter, FaUsers, FaUserGraduate, FaTrash, FaToggleOn, FaToggleOff, FaPhone, FaSync } from "react-icons/fa";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import MyTable from "@/components/shared/common-table/page";
import useDeleteQuery from "@/hooks/deleteQuery.hook";
import usePostQuery from "@/hooks/postQuery.hook";
import AddInstructor from "./AddInstructor";
import { Upload, Loader, Download, FileText } from "lucide-react";
import { IInstructor, IColumn, IFilterOptions } from "@/types/instructor.types";
import { motion, AnimatePresence } from "framer-motion";

const InstructorTable: React.FC = () => {
  const { deleteQuery } = useDeleteQuery();
  const { postQuery } = usePostQuery();
  const { getQuery } = useGetQuery();

  // State Initialization
  const [instructors, setInstructors] = useState<IInstructor[]>([]);
  const [refreshKey, setRefreshKey] = useState<string>(Date.now().toString()); // Unique refresh key
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState<boolean>(false);
  const [showInstructorForm, setShowInstructorForm] = useState<boolean>(false);
  const [filterOptions, setFilterOptions] = useState<IFilterOptions>({
    full_name: "",
    email: "",
    phone_number: "",
    course_name: "",
    status: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Force refresh function that generates a new key
  const forceRefresh = useCallback(() => {
    const newKey = `${Date.now()}-${Math.random()}`;
    setRefreshKey(newKey);
    console.log('Force refresh triggered with key:', newKey);
  }, []);

  // Fetch instructors data from API with force refresh capability
  const fetchInstructors = useCallback(async (forceReload: boolean = false): Promise<void> => {
    try {
      setLoading(true);
      console.log('Fetching instructors...', forceReload ? '(Force reload)' : '');
      
      // Build query parameters for high limit and cache busting
      const queryParams = new URLSearchParams();
      queryParams.append('limit', '10000'); // Get all instructors
      queryParams.append('page', '1');
      
      if (forceReload) {
        queryParams.append('_t', Date.now().toString());
      }
      
      const url = `${apiUrls.Instructor.getAllInstructors}?${queryParams.toString()}`;

      await getQuery({
        url,
        onSuccess: (response: any) => {
          console.log('Instructors fetched successfully:', response);
          
          let instructorsArray = [];
          
          // Handle different response structures
          if (response?.status === 'success' && response?.data?.items) {
            // Live classes API structure
            instructorsArray = Array.isArray(response.data.items) ? response.data.items : [];
            console.log(`✅ Found ${instructorsArray.length} instructors from Instructor collection`);
          } else if (response?.data && Array.isArray(response.data)) {
            // Direct data array
            instructorsArray = response.data;
            console.log(`✅ Found ${instructorsArray.length} instructors (direct array)`);
          } else if (Array.isArray(response)) {
            // Direct array response
            instructorsArray = response;
            console.log(`✅ Found ${instructorsArray.length} instructors (direct response)`);
          } else {
            console.warn("⚠️ No instructors found in response:", response);
          }
          
          setInstructors([...instructorsArray]); // Force new array reference
        },
        onFail: (error) => {
          console.error("Failed to fetch instructors:", error);
          setInstructors([]);
        },
      });
    } catch (error) {
      console.error("Failed to fetch instructors:", error);
      setInstructors([]);
    } finally {
      setLoading(false);
    }
  }, [getQuery]);

  // Manual refresh function
  const handleManualRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchInstructors(true); // Force reload
    setIsRefreshing(false);
    showToast.success("Table refreshed successfully!");
  }, [fetchInstructors]);

  // Initial load and refresh key changes
  useEffect(() => {
    console.log('useEffect triggered with refreshKey:', refreshKey);
    fetchInstructors(true); // Always force reload on refresh
  }, [refreshKey]); // Only depend on refreshKey

  // Add window focus listener for fresh data when user returns to tab
  useEffect(() => {
    const handleFocus = () => {
      console.log('Window focused, refreshing data');
      forceRefresh();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [forceRefresh]);

  // Add visibility change listener for additional refresh triggers
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Page became visible, refreshing data');
        setTimeout(() => forceRefresh(), 100);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [forceRefresh]);

  // Enhanced AddInstructor handler with immediate refresh
  const handleAddInstructorSuccess = useCallback(() => {
    console.log('handleAddInstructorSuccess called');
    setShowInstructorForm(false);
    showToast.success("Instructor added successfully! Refreshing list...");
    
    // Multiple refresh strategies to ensure it works
    // 1. Immediate state update
    setInstructors([]); // Clear current data to force reload
    
    // 2. Force refresh with new key
    const newKey = `${Date.now()}-${Math.random()}`;
    setRefreshKey(newKey);
    
    // 3. Backup refresh after a short delay
    setTimeout(() => {
      console.log('Backup refresh triggered');
      fetchInstructors(true);
    }, 200);
    
    // 4. Final fallback refresh
    setTimeout(() => {
      console.log('Final fallback refresh triggered');
      forceRefresh();
    }, 500);
  }, [forceRefresh, fetchInstructors]);

  // Delete Instructor with immediate refresh
  const deleteInstructor = useCallback((id: string): void => {
    if (!window.confirm("Are you sure you want to delete this instructor?")) return;
    
    deleteQuery({
      url: `${apiUrls.Instructor.deleteInstructor}/${id}`,
      onSuccess: (res: any) => {
        console.log('Delete success, triggering refresh');
        showToast.success(res?.message || "Instructor deleted successfully");
        
        // Immediate state update
        setInstructors(prev => prev.filter(instructor => instructor._id !== id));
        
        // Force refresh after a short delay
        setTimeout(() => {
          forceRefresh();
        }, 100);
      },
      onFail: (res: any) => {
        console.error("Failed to delete instructor:", res);
        showToast.error("Failed to delete instructor");
      },
    });
  }, [deleteQuery, forceRefresh]);

  // Toggle Instructor Status with immediate refresh
  const toggleStatus = useCallback(async (id: string): Promise<void> => {
    try {
      await postQuery({
        url: `${apiUrls.Instructor.toggleInstructorsStatus}/${id}`,
        postData: {},
        onSuccess: (response: any) => {
          const updatedInstructor = response?.data;
          if (updatedInstructor) {
            console.log('Status toggle success, triggering refresh');
            showToast.success(
              `${updatedInstructor.full_name}'s status changed to ${updatedInstructor.status}.`
            );
            
            // Immediate state update
            setInstructors(prev => 
              prev.map(instructor => 
                instructor._id === id 
                  ? { ...instructor, status: updatedInstructor.status }
                  : instructor
              )
            );
            
            // Force refresh after a short delay
            setTimeout(() => {
              forceRefresh();
            }, 100);
          } else {
            console.error("Instructor data not found in response!", response);
            showToast.error("Failed to update instructor status");
          }
        },
        onFail: (res: any) => {
          showToast.error("Instructor status cannot be changed!");
          console.error("Failed to toggle status:", res);
        },
      });
    } catch (error) {
      showToast.error("Something went wrong!");
      console.error("Error in toggleStatus:", error);
    }
  }, [postQuery, forceRefresh]);

  // Handle CSV Upload with immediate refresh
  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;
    
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
          console.log('CSV upload success, triggering refresh');
          showToast.success("Instructors uploaded successfully!");
          
          // Clear current data and force refresh
          setInstructors([]);
          setTimeout(() => {
            forceRefresh();
          }, 100);
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
      render: (row: IInstructor) => (
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div 
            className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg"
            aria-label={`Avatar for ${row.full_name}`}
          >
            {row.full_name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">{row.full_name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <FaPhone className="w-3 h-3" />
              {row.phone_number || 'No phone'}
            </div>
          </div>
        </motion.div>
      )
    },
    { 
      Header: "Email ID", 
      accessor: "email",
      className: "min-w-[250px]",
      render: (row: IInstructor) => (
        <div className="text-gray-600 dark:text-gray-300">
          {row.email}
        </div>
      )
    },
    { 
      Header: "Join Date", 
      accessor: "createdAt",
      className: "min-w-[120px]",
      render: (row: IInstructor) => (
        <div className="text-gray-600 dark:text-gray-300">
          {row.createdAt}
        </div>
      )
    },
    {
      Header: "Course Details",
      accessor: "course_details",
      className: "min-w-[250px]",
      render: (row: IInstructor) => (
        <div className="space-y-1 text-sm">
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Category:</span>
            <span className="ml-2 text-gray-600 dark:text-gray-400">{row?.meta?.category || "--"}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Course:</span>
            <span className="ml-2 text-gray-600 dark:text-gray-400">{row?.meta?.course_name || "--"}</span>
          </div>
          <div>
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
      render: (row: IInstructor) => (
        <div className="flex justify-center">
          <button
            onClick={() => window.open(row?.meta?.upload_resume, "_blank")}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
            aria-label="View Resume"
            disabled={!row?.meta?.upload_resume}
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
      render: (row: IInstructor) => {
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
      className: "w-[100px]",
      render: (row: IInstructor) => (
        <div className="flex gap-2 items-center">
          <motion.button
            onClick={() => deleteInstructor(row._id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 px-3 py-1.5 text-red-600 hover:text-white hover:bg-red-600 border border-red-600 rounded-lg font-medium text-sm transition-all duration-200"
            aria-label={`Delete instructor ${row.full_name}`}
          >
            <FaTrash className="w-3 h-3" />
            Delete
          </motion.button>
        </div>
      )
    },
  ];

  // Filter and sort the data using memoization to prevent unnecessary recalculations
  const filteredData = useMemo(() => {
    return instructors.filter((instructor) => {
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
        (instructor.phone_number || "").includes(searchQuery);

      return matchesSearchQuery && matchesName && matchesStatus;
    });
  }, [instructors, filterOptions, searchQuery]);

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

  const formattedData = useMemo(() => {
    return sortedData.map((user, index) => ({
      ...user,
      no: index + 1,
      createdAt: new Date(user.createdAt).toLocaleDateString("en-GB"),
    }));
  }, [sortedData]);

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

  return (
    <AnimatePresence mode="wait">
      {showInstructorForm ? (
        <motion.div
          key="add-instructor"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <AddInstructor onCancel={() => setShowInstructorForm(false)} onSuccess={handleAddInstructorSuccess} />
        </motion.div>
      ) : (
        <motion.div 
          key="instructor-table"
          className="w-full space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Debug Info (remove in production) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Debug: Refresh Key: {refreshKey} | Instructors Count: {instructors.length} | Loading: {loading.toString()}
              </p>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Instructors</p>
                  <p className="text-3xl font-bold">{instructors.length}</p>
                </div>
                <div className="p-3 bg-blue-400/30 rounded-lg">
                  <FaUsers className="w-8 h-8" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Active Instructors</p>
                  <p className="text-3xl font-bold">
                    {instructors.filter(instructor => instructor.status === 'Active').length}
                  </p>
                </div>
                <div className="p-3 bg-green-400/30 rounded-lg">
                  <FaUserGraduate className="w-8 h-8" />
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
                  <p className="text-purple-100 text-sm font-medium">New This Month</p>
                  <p className="text-3xl font-bold">
                    {instructors.filter(instructor => {
                      const createdDate = new Date(instructor.createdAt);
                      const currentDate = new Date();
                      return createdDate.getMonth() === currentDate.getMonth() && 
                             createdDate.getFullYear() === currentDate.getFullYear();
                    }).length}
                  </p>
                </div>
                <div className="p-3 bg-purple-400/30 rounded-lg">
                  <FaPlus className="w-8 h-8" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Table Card */}
          <div className="bg-white dark:bg-gray-800 dark:text-gray-200 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <FaUsers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Instructor Management</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Manage instructor profiles and assignments</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  {/* Search Bar */}
                  <div className="relative flex-grow max-w-md">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
                    <input
                      type="text"
                      placeholder="Search instructors..."
                      aria-label="Search instructors"
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      onClick={() => setShowInstructorForm(true)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-600/20"
                      aria-label="Add Instructor"
                    >
                      <FaPlus className="mr-2" />
                      Add Instructor
                    </motion.button>
                    
                    <motion.button
                      onClick={() => document.getElementById('instructorCSVUpload')?.click()}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg shadow-green-600/20"
                      aria-label="Import CSV"
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

            {/* Instructor Table */}
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
                  <Loader className="animate-spin h-12 w-12 text-blue-600 mb-4" aria-label="Loading" />
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    {isRefreshing ? 'Refreshing instructors...' : 'Loading instructors...'}
                  </p>
                </motion.div>
              )}
              
              {loading && !instructors.length ? (
                <motion.div 
                  className="flex flex-col items-center justify-center p-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Loader className="animate-spin h-12 w-12 text-blue-600 mb-4" aria-label="Loading" />
                  <p className="text-gray-600 dark:text-gray-400 text-lg">Loading instructors...</p>
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
                    No instructors found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                    {searchQuery || Object.values(filterOptions).some(v => v) 
                      ? "No instructors match your current filters. Try adjusting your search criteria."
                      : "Get started by adding your first instructor to the platform."
                    }
                  </p>
                  <motion.button
                    onClick={() => setShowInstructorForm(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaPlus className="w-4 h-4" />
                    Add First Instructor
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
                    key={`instructor-table-${refreshKey}`}
                    columns={columns} 
                    data={formattedData}
                    className="w-full"
                  />
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstructorTable; 