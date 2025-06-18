"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FaPlus, FaChevronDown, FaEye, FaTrash, FaFilter, FaSearch, FaSpinner } from "react-icons/fa";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import MyTable from "@/components/shared/common-table/page";
import useDeleteQuery from "@/hooks/deleteQuery.hook";
import { toast } from "react-toastify";
import usePostQuery from "@/hooks/postQuery.hook";
import AddCoorporate_Admin from "./AddCoorporateAdmin";
import Preloader from "@/components/shared/others/Preloader";

// Custom debounce function
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const CoorporateAdminTable = () => {
  const { deleteQuery } = useDeleteQuery();
  const { postQuery } = usePostQuery();
  const { getQuery } = useGetQuery();

  // State Management
  const [instructors, setInstructors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageError, setPageError] = useState(null);
  const [deletedInstructors, setDeletedInstructors] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [showCoorporateForm, setShowCoorporateForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    status: "",
    company_type: "",
    country: ""
  });

  // Replace the debounced search with our custom hook
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchTerm = useDebounce(searchInput, 300);

  // Update search effect
  useEffect(() => {
    setSearchQuery(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  // Enhanced fetch instructors with better error handling and retry mechanism
  const fetchInstructors = useCallback(async (retryCount = 0) => {
    try {
      setIsLoading(true);
      setPageError(null);
      
      await getQuery({
        url: apiUrls.Coorporate.getAllCoorporates,
        onSuccess: (response) => {
          let data = [];
          if (Array.isArray(response)) {
            data = response;
          } else if (response?.data && Array.isArray(response.data)) {
            data = response.data;
          } else {
            throw new Error("Invalid data format received");
          }
          setInstructors(data.map(item => ({
            ...item,
            createdAt: item.createdAt ? new Date(item.createdAt).toISOString() : null
          })));
        },
        onFail: (error) => {
          if (retryCount < 3) {
            setTimeout(() => fetchInstructors(retryCount + 1), 1000 * (retryCount + 1));
          } else {
            setPageError(error?.message || "Failed to fetch corporate admins");
            showToast.error("Failed to load corporate admins. Please try again.");
          }
        },
      });
    } catch (error) {
      setPageError("An unexpected error occurred");
      showToast.error("Error loading data. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  }, [getQuery]);

  useEffect(() => {
    fetchInstructors();
  }, [deletedInstructors]);

  // Enhanced delete handler with better error handling
  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      await deleteQuery({
        url: `${apiUrls.Coorporate.deleteCoorporate}/${id}`,
        onSuccess: (res) => {
          showToast.success(res?.message || "Corporate admin deleted successfully");
          setDeletedInstructors(id);
          setShowDeleteConfirm(false);
          setItemToDelete(null);
          fetchInstructors();
        },
        onFail: (error) => {
          showToast.error(error?.message || "Failed to delete corporate admin. Please try again.");
        },
      });
    } catch (error) {
      showToast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Status Toggle Handler
  const toggleStatus = async (id) => {
    try {
      setIsLoading(true);
      await postQuery({
        url: `${apiUrls.Coorporate.toggleCoorporateStatus}/${id}`,
        postData: {},
        onSuccess: (response) => {
          const updatedAdmin = response?.data;
          if (updatedAdmin) {
            showToast.success(`Status updated to ${updatedAdmin.status}`);
            fetchInstructors();
          } else {
            throw new Error("Invalid response data");
          }
        },
        onFail: (error) => {
          showToast.error(error?.message || "Failed to update status");
        },
      });
    } catch (error) {
      showToast.error("Failed to update status");
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced bulk delete handler
  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) {
      showToast.warning("Please select items to delete");
      return;
    }

    try {
      setIsLoading(true);
      await postQuery({
        url: apiUrls.Coorporate.bulkDelete,
        postData: { ids: selectedRows },
        onSuccess: () => {
          showToast.success(`Successfully deleted ${selectedRows.length} items`);
          setSelectedRows([]);
          fetchInstructors();
          setShowBulkDeleteConfirm(false);
        },
        onFail: (error) => {
          showToast.error(error?.message || "Bulk delete failed. Please try again.");
        },
      });
    } catch (error) {
      showToast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Table Columns Configuration
  const columns = [
    { 
      Header: "No.", 
      accessor: "no",
      width: 70
    },
    { 
      Header: "Company Name", 
      accessor: "full_name",
      width: 200,
      Cell: ({ value }) => (
        <div className="font-medium text-gray-900 dark:text-gray-100">
          {value}
        </div>
      )
    },
    { 
      Header: "Phone Number", 
      accessor: "phone_number",
      width: 150
    },
    { 
      Header: "Company Email", 
      accessor: "email",
      width: 200
    },
    { 
      Header: "Company Type", 
      accessor: "company_type",
      width: 150
    },
    { 
      Header: "Country", 
      accessor: "country",
      width: 120
    },
    { 
      Header: "Join Date", 
      accessor: "createdAt",
      width: 120,
      Cell: ({ value }) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(value).toLocaleDateString()}
        </span>
      )
    },
    {
      Header: "Document",
      accessor: "meta.upload_resume",
      width: 100,
      Cell: ({ row }) => (
        <div className="flex justify-center">
          {row.original?.meta?.upload_resume ? (
            <button
              onClick={() => window.open(row.original.meta.upload_resume, "_blank")}
              className="text-blue-600 hover:text-blue-800 transition-colors p-2 rounded-full hover:bg-blue-100"
              title="View Document"
            >
              <FaEye className="h-5 w-5" />
            </button>
          ) : (
            <span className="text-gray-400 text-sm">N/A</span>
          )}
        </div>
      ),
    },
    {
      Header: "Status",
      accessor: "status",
      width: 120,
      Cell: ({ row }) => {
        const isActive = row.original?.status === "Active";
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleStatus(row.original?._id)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isActive ? 'bg-green-500' : 'bg-gray-400'
              }`}
              disabled={isLoading}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                  isActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isActive ? 'text-green-600' : 'text-red-600'}`}>
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        );
      },
    },
    {
      Header: "Actions",
      accessor: "actions",
      width: 100,
      Cell: ({ row }) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => {
              setItemToDelete(row.original);
              setShowDeleteConfirm(true);
            }}
            className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-full hover:bg-red-100"
            title="Delete"
          >
            <FaTrash className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  // Data Filtering and Sorting
  const filteredData = instructors?.filter((instructor) => {
    const searchFields = [
      instructor.full_name,
      instructor.email,
      instructor.phone_number,
      instructor.company_type,
      instructor.country
    ].map(field => (field || "").toLowerCase());

    const matchesSearch = searchQuery === "" || 
      searchFields.some(field => field.includes(searchQuery.toLowerCase()));

    const matchesStatus = !filterOptions.status || 
      instructor.status?.toLowerCase() === filterOptions.status.toLowerCase();

    const matchesType = !filterOptions.company_type || 
      instructor.company_type?.toLowerCase() === filterOptions.company_type.toLowerCase();

    const matchesCountry = !filterOptions.country || 
      instructor.country?.toLowerCase() === filterOptions.country.toLowerCase();

    return matchesSearch && matchesStatus && matchesType && matchesCountry;
  }) || [];

  const sortedData = [...filteredData].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  const formattedData = sortedData.map((item, index) => ({
    ...item,
    no: index + 1,
  }));

  if (showCoorporateForm) {
    return <AddCoorporate_Admin onCancel={() => setShowCoorporateForm(false)} />;
  }

  return (
    <div className="bg-gray-50 dark:bg-darkblack min-h-screen p-4">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        {/* Enhanced Header Section */}
        <div className="p-6 border-b dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Corporate Admins
              {isLoading && <FaSpinner className="animate-spin text-xl" />}
            </h1>

            <div className="flex flex-wrap items-center gap-3">
              {/* Enhanced Search Input */}
              <div className="relative flex-grow max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, email, or company..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Enhanced Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  <FaFilter className="text-gray-500" />
                  <span>Filters</span>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {Object.values(filterOptions).filter(Boolean).length}
                  </span>
                </button>
                
                {isFilterDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-10">
                    <div className="p-3 space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                          Status
                        </label>
                        <select
                          value={filterOptions.status}
                          onChange={(e) => setFilterOptions(prev => ({...prev, status: e.target.value}))}
                          className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-green-500"
                        >
                          <option value="">All Status</option>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                          Company Type
                        </label>
                        <select
                          value={filterOptions.company_type}
                          onChange={(e) => setFilterOptions(prev => ({...prev, company_type: e.target.value}))}
                          className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-green-500"
                        >
                          <option value="">All Types</option>
                          <option value="Enterprise">Enterprise</option>
                          <option value="Startup">Startup</option>
                          <option value="SME">SME</option>
                        </select>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => {
                            setFilterOptions({
                              status: "",
                              company_type: "",
                              country: ""
                            });
                            setIsFilterDropdownOpen(false);
                          }}
                          className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Add Button */}
              <button
                onClick={() => setShowCoorporateForm(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <FaPlus className="text-sm" />
                <span>Add Admin</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Bulk Actions */}
        {selectedRows.length > 0 && (
          <div className="p-4 bg-yellow-50 dark:bg-gray-700 border-b dark:border-gray-600">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {selectedRows.length} item(s) selected
              </span>
              <button
                onClick={() => setShowBulkDeleteConfirm(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-700 transition-all duration-200"
                disabled={isLoading}
              >
                <FaTrash className="text-sm" />
                <span>Delete Selected</span>
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Main Content */}
        <div className="p-6">
          {isLoading && <Preloader />}
          
          {pageError && (
            <div className="text-center py-8">
              <p className="text-red-600 dark:text-red-400 mb-4">{pageError}</p>
              <button
                onClick={() => fetchInstructors()}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center gap-2 mx-auto"
              >
                <FaSpinner className={`${isLoading ? 'animate-spin' : ''}`} />
                Retry
              </button>
            </div>
          )}

          {!isLoading && !pageError && (
            <div className="overflow-hidden rounded-lg border dark:border-gray-700">
              <MyTable 
                columns={columns} 
                data={formattedData}
                onRowSelect={setSelectedRows}
                selectedRows={selectedRows}
              />
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 transform transition-all duration-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete <span className="font-medium">{itemToDelete?.full_name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setItemToDelete(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(itemToDelete?._id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <FaTrash />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Bulk Delete Confirmation Modal */}
      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 transform transition-all duration-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirm Bulk Delete
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete {selectedRows.length} selected items? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowBulkDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <FaTrash />
                    <span>Delete Selected</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoorporateAdminTable;
