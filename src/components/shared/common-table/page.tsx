"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Select,
  MenuItem,
  IconButton,
  InputLabel,
  FormControl,
  Box,
  Typography,
  Checkbox,
} from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";

export interface TableColumn {
  Header: string;
  accessor: string;
  className?: string;
  width?: string;
  icon?: React.ReactNode;
  render?: (row: any) => React.ReactNode;
}

interface MyTableProps {
  columns: TableColumn[];
  data: any[];
  filterColumns?: string[];
  showDate?: boolean;
  entryText?: string;
  className?: string;
}

const MyTable: React.FC<MyTableProps> = ({
  columns,
  data = [],
  filterColumns,
  showDate = true,
  entryText = "Total no. of entries : ",
  className = "",
}) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [pageLimit, setPageLimit] = useState<number>(100);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

  const handleFilterChange = (column: TableColumn, event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { value } = event.target;
    setFilterValues((prevFilters) => ({
      ...prevFilters,
      [column.accessor]: value === "" ? undefined : value,
    }));
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, pageLimit, fromDate, toDate]);

  const filteredData = useMemo(() => {
    if (!data) return [];

    return data
      .filter((row) =>
        Object.entries(row).some(([key, value]) => {
          if (typeof value === "string") {
            return value.toLowerCase().includes(searchQuery.toLowerCase());
          } else if (typeof value === "number") {
            return value.toString().includes(searchQuery);
          }
          return false;
        })
      )
      .filter((row) =>
        Object.entries(filterValues).every(([key, value]) => {
          if (value === undefined) return true;
          const rowValue = row[key];
          return rowValue === (isNaN(Number(value)) ? value : Number(value));
        })
      )
      .filter((row) => {
        if (fromDate && toDate) {
          const createdAt = new Date(row.updatedAt);
          const toDateWithTime = new Date(toDate);
          toDateWithTime.setHours(23, 59, 59, 999);
          return createdAt >= new Date(fromDate) && createdAt <= toDateWithTime;
        }
        return true;
      });
  }, [data, searchQuery, filterValues, fromDate, toDate]);

  const getDistinctValues = (accessor: string): any[] => [
    ...new Set(data.map((row) => row[accessor])),
  ];

  const shouldHaveSelectFilter = (column: TableColumn): boolean =>
    filterColumns !== undefined &&
    filterColumns.includes(column.accessor) &&
    getDistinctValues(column.accessor).length >= 2;

  const handlePageLimitChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const newLimit = parseInt(event.target.value, 10);
    setPageLimit(newLimit);
    setCurrentPage((prevPage) =>
      Math.min(prevPage, Math.ceil(filteredData.length / newLimit) - 1)
    );
  };

  const totalPages = Math.ceil(filteredData.length / pageLimit);

  const handleCheckboxChange = (rowId: string): void => {
    setSelectedRows((prevSelectedRows) => {
      const newSelectedRows = new Set(prevSelectedRows);
      if (newSelectedRows.has(rowId)) {
        newSelectedRows.delete(rowId);
      } else {
        newSelectedRows.add(rowId);
      }
      return newSelectedRows;
    });
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/80">
                <th className="w-12 p-4">
                  <Checkbox
                    onChange={(e) => {
                      if (e.target.checked) {
                        const allRowIds = data.map((row) => row._id);
                        setSelectedRows(new Set(allRowIds));
                      } else {
                        setSelectedRows(new Set());
                      }
                    }}
                    className="rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
                  />
                </th>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap ${column.className || ''}`}
                    style={{ 
                      width: column.width,
                      background: 'transparent',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {column.icon && <span className="text-primary">{column.icon}</span>}
                      {column.Header}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredData
                .slice(currentPage * pageLimit, (currentPage + 1) * pageLimit)
                .map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="group hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all duration-200"
                  >
                    <td className="w-12 p-4">
                      <Checkbox
                        checked={selectedRows.has(row._id)}
                        onChange={() => handleCheckboxChange(row._id)}
                        className="rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
                      />
                    </td>
                    {columns.map((column, columnIndex) => (
                      <td
                        key={columnIndex}
                        className={`px-6 py-4 text-sm ${
                          column.accessor === "status"
                            ? getStatusStyles(row[column.accessor])
                            : "text-gray-900 dark:text-gray-100"
                        } transition-colors duration-200 ${column.className || ''}`}
                      >
                        {column.render ? column.render(row) : row[column.accessor] || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/80">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredData.length > 0 ? currentPage * pageLimit + 1 : 0} to{" "}
            {Math.min((currentPage + 1) * pageLimit, filteredData.length)} of {filteredData.length} entries
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 0}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage === 0
                    ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                aria-label="Previous page"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1">
                {totalPages > 0 && [...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = currentPage + i - 2;
                  if (pageNum < 0 || pageNum >= totalPages) return null;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNum
                          ? "bg-primary text-white"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      aria-label={`Page ${pageNum + 1}`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={nextPage}
                disabled={currentPage + 1 >= Math.ceil(filteredData.length / pageLimit)}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage + 1 >= Math.ceil(filteredData.length / pageLimit)
                    ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                aria-label="Next page"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>

            <select
              value={pageLimit}
              onChange={handlePageLimitChange}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Items per page"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

const getStatusStyles = (status: string): string => {
  if (!status) return "text-gray-900 dark:text-gray-100";
  
  const statusLower = status.toLowerCase();
  
  if (statusLower === "active" || statusLower === "published" || statusLower === "completed" || statusLower === "success") {
    return "text-green-600 dark:text-green-400 font-medium";
  }
  
  if (statusLower === "pending" || statusLower === "processing" || statusLower === "in progress") {
    return "text-blue-600 dark:text-blue-400 font-medium";
  }
  
  if (statusLower === "inactive" || statusLower === "failed" || statusLower === "error" || statusLower === "rejected") {
    return "text-red-600 dark:text-red-400 font-medium";
  }
  
  if (statusLower === "draft" || statusLower === "scheduled") {
    return "text-yellow-600 dark:text-yellow-400 font-medium";
  }
  
  return "text-gray-900 dark:text-gray-100";
};

export default MyTable; 