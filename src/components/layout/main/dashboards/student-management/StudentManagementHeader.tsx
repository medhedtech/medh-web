"use client";
import React from "react";
import { FaPlus, FaChevronDown, FaSearch, FaFilter, FaSync } from "react-icons/fa";
import { Upload } from "lucide-react";
import { IFilterOptions } from "@/types/student.types";

interface StudentManagementHeaderProps {
  activeTab: "students" | "enrolled";
  onTabChange: (tab: "students" | "enrolled") => void;
  onAddStudent: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortOrder: "newest" | "oldest";
  setSortOrder: (order: "newest" | "oldest") => void;
  filterOptions: IFilterOptions;
  setFilterOptions: (options: IFilterOptions) => void;
  isFilterDropdownOpen: boolean;
  setIsFilterDropdownOpen: (isOpen: boolean) => void;
  isSortDropdownOpen: boolean;
  setIsSortDropdownOpen: (isOpen: boolean) => void;
  onRefresh: () => void;
  loading: boolean;
  onCSVImport: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onCSVExport: () => void;
}

/**
 * Header component for the Student Management dashboard
 * Contains tabs, search, filters, sort, and action buttons
 */
const StudentManagementHeader: React.FC<StudentManagementHeaderProps> = ({
  activeTab,
  onTabChange,
  onAddStudent,
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
  onRefresh,
  loading,
  onCSVImport,
  onCSVExport,
}) => {
  // Handle sort dropdown selection
  const handleSortChange = (order: "newest" | "oldest") => {
    setSortOrder(order);
    setIsSortDropdownOpen(false);
  };

  // Handle filter dropdown toggle
  const handleFilterDropdownToggle = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
  };

  // Handle filter selection
  const handleFilterSelect = (filterType: keyof IFilterOptions, value: string) => {
    setFilterOptions((prev) => ({ ...prev, [filterType]: value }));
    setIsFilterDropdownOpen(false);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilterOptions({
      full_name: "",
      email: "",
      phone_number: "",
      course_name: "",
      role: "all",
      status: "all",
    });
    setIsFilterDropdownOpen(false);
  };

  return (
    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
      {/* Header title and controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Student Management
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className={`flex items-center px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Refresh student data"
          >
            <FaSync className={`mr-2 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Refreshing..." : "Refresh"}
          </button>

          {/* Search Bar */}
          <div className="relative flex-grow max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search students"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={handleFilterDropdownToggle}
              className="flex items-center px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              aria-expanded={isFilterDropdownOpen}
              aria-haspopup="true"
              aria-label="Filter options"
            >
              <FaFilter className="mr-2" />
              Filters
            </button>
            {isFilterDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-20" role="menu">
                <div className="p-3">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="role-filter">
                      Role
                    </label>
                    <select
                      id="role-filter"
                      className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md p-2"
                      value={filterOptions.role}
                      onChange={(e) => handleFilterSelect("role", e.target.value)}
                    >
                      <option value="all">All Roles</option>
                      <option value="student">Student</option>
                      <option value="corporate-student">Corporate Student</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="status-filter">
                      Status
                    </label>
                    <select
                      id="status-filter"
                      className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md p-2"
                      value={filterOptions.status}
                      onChange={(e) => handleFilterSelect("status", e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <button
                    onClick={clearFilters}
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
              aria-expanded={isSortDropdownOpen}
              aria-haspopup="true"
              aria-label="Sort options"
            >
              <span>{sortOrder === "newest" ? "Newest First" : "Oldest First"}</span>
              <FaChevronDown className="ml-2" />
            </button>
            {isSortDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-20" role="menu">
                <button
                  onClick={() => handleSortChange("newest")}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                  role="menuitem"
                >
                  Newest First
                </button>
                <button
                  onClick={() => handleSortChange("oldest")}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                  role="menuitem"
                >
                  Oldest First
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <button
            onClick={onAddStudent}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            aria-label="Add new student"
          >
            <FaPlus className="mr-2" />
            Add Student
          </button>

          <button
            onClick={() => document.getElementById("csvUpload")?.click()}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            aria-label="Import students from CSV"
          >
            <Upload className="mr-2 h-4 w-4" />
            Import CSV
            <input
              type="file"
              id="csvUpload"
              accept=".csv"
              className="hidden"
              onChange={onCSVImport}
            />
          </button>

          <button
            onClick={onCSVExport}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            aria-label="Export students to CSV"
          >
            <Upload className="mr-2 h-4 w-4 transform rotate-180" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mt-6">
        <button
          className={`px-4 py-2 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
            activeTab === "students"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
          onClick={() => onTabChange("students")}
          aria-selected={activeTab === "students"}
          role="tab"
        >
          Students
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
            activeTab === "enrolled"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
          onClick={() => onTabChange("enrolled")}
          aria-selected={activeTab === "enrolled"}
          role="tab"
        >
          Enrolled Students
        </button>
      </div>
    </div>
  );
};

export default StudentManagementHeader; 