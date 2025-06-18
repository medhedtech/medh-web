"use client";
import React, { useState, useEffect } from "react";
import { FaPlus, FaChevronDown, FaSearch, FaFilter, FaPencilAlt, FaTrash } from "react-icons/fa";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import MyTable from "@/components/shared/common-table/page";
import useDeleteQuery from "@/hooks/deleteQuery.hook";
import usePostQuery from "@/hooks/postQuery.hook";
import AddCategories from "./AddCategories";
import { Loader } from "lucide-react";

const CategoriesManage = () => {
  const { deleteQuery } = useDeleteQuery();
  const [categories, setCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState("oldest");
  const [searchQuery, setSearchQuery] = useState("");
  const { postQuery } = usePostQuery();
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    name: "",
  });

  const { getQuery } = useGetQuery();
  const [deletedCategories, setDeletedCategories] = useState(null);
  const [updateStatus, setUpdateStatus] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Fetch instructors Data from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        await getQuery({
          url: apiUrls?.categories?.getAllCategories,
          onSuccess: (data) => {
            const fetchedCategories = data.data;
            if (Array.isArray(fetchedCategories)) {
              const normalizedData = fetchedCategories.map((item) => ({
                id: item._id,
                name: item.name || item.category_name || "Unnamed Category",
                image: item.category_image || null,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
              }));
              setCategories(normalizedData);
              console.log('Normalized categories: ', normalizedData);
            } else {
              console.error("Unexpected response:", data);
              setCategories([]);
            }
          },
          onFail: (error) => {
            console.error("Failed to fetch categories:", error);
            setCategories([]);
          },
        });
      } catch (error) {
        console.error("Fetch error:", error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, [deletedCategories, updateStatus]);

  // Delete User
  const initiateDelete = (category) => {
    setCategoryToDelete(category);
    setShowDeleteConfirm(true);
  };

  const deleteCategory = async (id) => {
    try {
      setIsLoading(true);
      await deleteQuery({
        url: `${apiUrls?.categories?.deleteCategories}/${id}`,
        onSuccess: (res) => {
          showToast.success(res?.message || "Category deleted successfully!");
          setDeletedCategories(id);
          setShowDeleteConfirm(false);
          setCategoryToDelete(null);
        },
        onFail: (error) => {
          console.error("Delete failed:", error);
          showToast.error(error?.message || "Failed to delete category. Please try again.");
        },
      });
    } catch (error) {
      showToast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateCategory = (category) => {
    setSelectedCategory(category)
    setShowCategoryForm(true)
  };

  // Table Columns Configuration
  const columns = [
    { 
      Header: "No.", 
      accessor: "no",
      className: "w-16 text-center"
    },
    {
      Header: "Image",
      accessor: "image",
      className: "w-24",
      render: (row) => (
        <div className="flex justify-center">
          {row?.image ? (
            <img 
              src={row.image} 
              className="h-12 w-12 rounded-full object-cover border-2 border-gray-200 hover:border-blue-500 transition-all duration-300" 
              alt={row.name} 
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-500 border-2 border-gray-200">
              N/A
            </div>
          )}
        </div>
      ),
    },
    { 
      Header: "Category Name", 
      accessor: "name",
      className: "min-w-[200px]",
      render: (row) => (
        <div className="flex items-center">
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {row.name}
          </span>
        </div>
      )
    },
    { 
      Header: "Created Date", 
      accessor: "createdAt",
      className: "min-w-[150px]",
      render: (row) => (
        <div className="text-gray-600 dark:text-gray-400">
          {row.createdAt}
        </div>
      )
    },
    {
      Header: "Action",
      accessor: "actions",
      className: "min-w-[200px]",
      render: (row) => (
        <div className="flex gap-2 items-center">
          <button
            onClick={() => updateCategory(row)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors duration-200"
          >
            <FaPencilAlt className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => initiateDelete(row)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
          >
            <FaTrash className="w-4 h-4" />
            Delete
          </button>
        </div>
      ),
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

  // Filtering the data based on user inputs
  const filteredData =
    categories?.filter((category) => {
      const matchesName = filterOptions.name
        ? (category.name || "")
            .toLowerCase()
            .includes(filterOptions.name.toLowerCase())
        : true;

      const matchesSearchQuery = category.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchesSearchQuery && matchesName;
    }) || [];

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortOrder === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    return 0;
  });

  const formattedData = Array.isArray(sortedData)
    ? sortedData.map((user, index) => ({
        ...user,
        no: index + 1,
        createdAt: new Date(user.createdAt).toLocaleDateString("en-GB"),
      }))
    : [];
  console.log("Formatted Data:", formattedData);
  console.log("Categories:", categories);

  return (
    <div className="bg-gray-50 dark:bg-darkblack min-h-screen p-6 space-y-8">
      {showCategoryForm ? (
        <AddCategories 
          onCancel={() => {
            setShowCategoryForm(false);
            setSelectedCategory(null);
          }} 
          selectedCategory={selectedCategory}
        />
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-inherit dark:text-whitegrey3 dark:border rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Categories Management</h1>
                
                <div className="flex flex-wrap items-center gap-3">
                  {/* Search Bar */}
                  <div className="relative flex-grow max-w-md">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search categories..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
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

                  {/* Add Category Button */}
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setShowCategoryForm(true);
                    }}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaPlus className="mr-2" />
                    Add Category
                  </button>
                </div>
              </div>
            </div>

            {/* Categories Table */}
            <div className="overflow-x-auto">
              {isLoading ? (
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete the category "{categoryToDelete?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setCategoryToDelete(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={() => deleteCategory(categoryToDelete?.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin h-4 w-4" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <FaTrash className="w-4 h-4" />
                    <span>Delete</span>
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

export default CategoriesManage;
