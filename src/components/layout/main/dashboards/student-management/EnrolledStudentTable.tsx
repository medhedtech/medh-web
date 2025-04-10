"use client";
import React from "react";
import { FaSearch } from "react-icons/fa";
import MyTable from "@/components/shared/common-table/page";
import { IGroupedEnrolledStudent } from "@/types/student.types";

// Define TableColumn locally
type TableColumn = {
  Header: string;
  accessor: string;
  className?: string;
  width?: string;
  icon?: React.ReactNode;
  render?: (row: any) => React.ReactNode;
};

interface EnrolledStudentTableProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  data: IGroupedEnrolledStudent[];
  expandedRowId: string | null;
  onToggleExpand: (id: string) => void;
  paginationInfo: {
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

/**
 * EnrolledStudentTable component for displaying and managing enrolled students
 */
const EnrolledStudentTable: React.FC<EnrolledStudentTableProps> = ({
  searchQuery,
  setSearchQuery,
  data,
  expandedRowId,
  onToggleExpand,
  paginationInfo,
  pagination,
  onPageChange,
  onLimitChange,
}) => {
  // Configure table columns
  const columns: TableColumn[] = [
    {
      Header: "No.",
      accessor: "no",
      className: "w-16 text-center",
    },
    {
      Header: "Name",
      accessor: "full_name",
      className: "min-w-[200px]",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold">
            {row.full_name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div className="font-medium text-gray-900 dark:text-white">
            {row.full_name}
          </div>
        </div>
      ),
    },
    {
      Header: "Email ID",
      accessor: "email",
      className: "min-w-[250px]",
      render: (row) => (
        <div className="text-gray-600 dark:text-gray-300">{row.email}</div>
      ),
    },
    {
      Header: "Enrolled Courses",
      accessor: "courses",
      className: "min-w-[300px]",
      render: (row) => {
        // Split courses string into array
        const courses = row.courses ? row.courses.split(", ") : [];
        const isExpanded = expandedRowId === row?._id;
        const visibleCourses = isExpanded ? courses : courses.slice(0, 2);

        return (
          <div>
            <div className="space-y-2">
              {visibleCourses.map((course: string, courseIndex: number) => (
                <div
                  key={courseIndex}
                  className="inline-flex items-center bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full px-3 py-1 text-sm mr-2 mb-2"
                >
                  {course}
                </div>
              ))}
            </div>

            {courses.length > 2 && (
              <button
                onClick={() => onToggleExpand(row?._id)}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium mt-2"
                aria-expanded={isExpanded}
                aria-label={isExpanded ? "Show fewer courses" : `Show ${courses.length - 2} more courses`}
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
      ),
    },
    {
      Header: "Action",
      accessor: "actions",
      className: "w-[100px]",
      render: (row) => (
        <div className="flex gap-2 items-center">
          <button
            onClick={() => window.open(`/admin/student/${row._id}`, "_blank")}
            className="text-blue-500 hover:text-blue-700 font-medium text-sm"
            aria-label={`View ${row.full_name}'s details`}
          >
            View
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      {/* Search Bar for Enrolled Students */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative flex-grow max-w-md">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search enrolled students..."
            value={searchQuery}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search enrolled students"
          />
        </div>
      </div>

      {/* Enrolled Students Table */}
      <MyTable columns={columns} data={data} />

      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No enrolled students found matching your criteria
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <span className="text-sm text-gray-700 dark:text-gray-300 mr-2">
            Show:
          </span>
          <select
            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md p-1 text-sm"
            value={pagination.limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            aria-label="Number of rows per page"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-gray-700 dark:text-gray-300 ml-2">
            entries
          </span>
        </div>
        
        <div className="flex items-center">
          <button
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md mr-2 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            onClick={() => onPageChange(paginationInfo.page - 1)}
            disabled={!paginationInfo.hasPrevPage}
            aria-label="Previous page"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {paginationInfo.page} of {paginationInfo.totalPages}
          </span>
          <button
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md ml-2 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            onClick={() => onPageChange(paginationInfo.page + 1)}
            disabled={!paginationInfo.hasNextPage}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnrolledStudentTable; 