"use client";
import React, { useState } from "react";
import { Loader } from "lucide-react";
import AddStudentForm from "./AddStudentForm";
import {
  StudentManagementHeader,
  StudentTable,
  EnrolledStudentTable,
  useStudentManagement,
  useEnrolledStudents
} from "./student-management";

/**
 * StudentManagement component serves as the main container for the student management dashboard
 * It has been refactored to improve maintainability, performance, and user experience
 */
const StudentManagement: React.FC = () => {
  // State for showing the add student form
  const [showAddStudentForm, setShowAddStudentForm] = useState<boolean>(false);
  
  // State for active tab selection
  const [activeTab, setActiveTab] = useState<"students" | "enrolled">("students");
  
  // Custom hooks for data management
  const {
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
    formattedData,
    deleteStudent,
    toggleStatus,
    fetchStudents,
    handleCSVUpload,
    exportToCSV,
  } = useStudentManagement();
  
  // Custom hook for enrolled students management
  const {
    enrolledStudentSearchQuery,
    setEnrolledStudentSearchQuery,
    filteredGroupedEnrolledStudents,
    expandedRowId,
    toggleExpand,
    paginationInfo,
    pagination,
    handlePageChange,
    handleLimitChange,
    loading: enrolledLoading,
  } = useEnrolledStudents();

  // Handle tab changes
  const handleTabChange = (tab: "students" | "enrolled") => {
    setActiveTab(tab);
  };

  // Render add student form or main dashboard
  return (
    <div className="bg-gray-50 dark:bg-darkblack min-h-screen p-6 space-y-8">
      {showAddStudentForm ? (
        <AddStudentForm 
          onCancel={() => setShowAddStudentForm(false)} 
          onSuccess={() => {
            setShowAddStudentForm(false);
            fetchStudents();
          }} 
        />
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-inherit dark:text-whitegrey3 dark:border rounded-xl shadow-sm overflow-hidden">
            {/* Header with controls */}
            <StudentManagementHeader
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onAddStudent={() => setShowAddStudentForm(true)}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              filterOptions={filterOptions}
              setFilterOptions={setFilterOptions}
              isFilterDropdownOpen={isFilterDropdownOpen}
              setIsFilterDropdownOpen={setIsFilterDropdownOpen}
              isSortDropdownOpen={isSortDropdownOpen}
              setIsSortDropdownOpen={setIsSortDropdownOpen}
              onRefresh={fetchStudents}
              loading={loading}
              onCSVImport={handleCSVUpload}
              onCSVExport={exportToCSV}
            />

            {/* Table Section */}
            <div className="overflow-x-auto">
              {loading || enrolledLoading ? (
                <div className="flex items-center justify-center p-12">
                  <div className="flex flex-col items-center space-y-4">
                    <Loader className="animate-spin h-10 w-10 text-blue-600" />
                    <p className="text-gray-500 dark:text-gray-400">Loading student data...</p>
                  </div>
                </div>
              ) : (
                <>
                  {activeTab === "students" && (
                    <StudentTable
                      data={formattedData}
                      onDelete={deleteStudent}
                      onToggleStatus={toggleStatus}
                    />
                  )}
                  {activeTab === "enrolled" && (
                    <EnrolledStudentTable
                      searchQuery={enrolledStudentSearchQuery}
                      setSearchQuery={setEnrolledStudentSearchQuery}
                      data={filteredGroupedEnrolledStudents}
                      expandedRowId={expandedRowId}
                      onToggleExpand={toggleExpand}
                      paginationInfo={paginationInfo}
                      pagination={pagination}
                      onPageChange={handlePageChange}
                      onLimitChange={handleLimitChange}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement; 