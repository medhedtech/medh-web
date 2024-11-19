"use client";
import React, { useState, useEffect } from "react";
import { FaPlus, FaChevronDown } from "react-icons/fa";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import MyTable from "@/components/shared/common-table/page";
import useDeleteQuery from "@/hooks/deleteQuery.hook";
import { toast } from "react-toastify";
import usePostQuery from "@/hooks/postQuery.hook";
import AddCategories from "./AddCategories";

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
  const deleteCategory = (id) => {
    console.log('del id: ', id)
    deleteQuery({
      url: `${apiUrls?.categories?.deleteCategories}/${id}`,
      onSuccess: (res) => {
        toast.success(res?.message || "Category deleted successfully.");
        setDeletedCategories(id);
      },
      onFail: (error) => {
        console.error("Delete failed:", error);
        toast.error("Failed to delete category.");
      },
    });
  };

  const updateCategory = (id) => {
    console.log("updating category: ", id);
  };

  // Table Columns Configuration
  const columns = [
    { Header: "No.", accessor: "no" },
    {
      Header: "Image",
      accessor: "image",
      render: (row) => (
        <div>
          <img src={row?.image} className="h-10 w-10 rounded-full" />
        </div>
      ),
    },
    { Header: "Category Name", accessor: "name" },
    { Header: "Date", accessor: "createdAt" },
    {
      Header: "Action",
      accessor: "actions",
      render: (row) => (
        <div className="flex gap-2 items-center">
          <button
            onClick={() => updateCategory(row?.id)}
            className="text-white bg-green-600 border border-green-600 rounded-md px-[10px] py-1"
          >
            Update
          </button>
          <button
            onClick={() => deleteCategory(row?.id)}
            className="text-white bg-red-600 border border-red-600 rounded-md px-[10px] py-1"
          >
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
  // Add Student Form Toggle
  if (showCategoryForm)
    return <AddCategories onCancel={() => setShowCategoryForm(false)} />;

  return (
    <div className="bg-gray-100 dark:bg-darkblack font-Poppins min-h-screen pt-8 p-6">
      <div className="max-w-6xl mx-auto dark:bg-inherit dark:text-whitegrey3 dark:border bg-white rounded-lg shadow-lg p-6">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Categories List</h1>
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
              onClick={() => setShowCategoryForm(true)}
              className="bg-customGreen text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FaPlus className="mr-2" />
              Add Categories
            </button>
          </div>
        </header>
        {/* Student Table */}
        <MyTable columns={columns} data={formattedData} />
      </div>
    </div>
  );
};

export default CategoriesManage;
