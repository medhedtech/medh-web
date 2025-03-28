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

const MyTable = ({
  columns,
  data,
  filterColumns,
  showDate = true,
  entryText = "Total no. of entries : ",
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValues, setFilterValues] = useState({});
  const [pageLimit, setPageLimit] = useState(10);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedRows, setSelectedRows] = useState(new Set());

  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

  const handleFilterChange = (column, event) => {
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
          return rowValue === (isNaN(value) ? value : Number(value));
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

  const getDistinctValues = (accessor) => [
    ...new Set(data.map((row) => row[accessor])),
  ];

  const shouldHaveSelectFilter = (column) =>
    filterColumns &&
    filterColumns.includes(column.accessor) &&
    getDistinctValues(column.accessor).length >= 2;

  const handlePageLimitChange = (event) => {
    const newLimit = parseInt(event.target.value, 10);
    setPageLimit(newLimit);
    setCurrentPage((prevPage) =>
      Math.min(prevPage, Math.ceil(filteredData.length / newLimit) - 1)
    );
  };

  const totalPages = Math.ceil(filteredData.length / pageLimit);

  const handleCheckboxChange = (rowId) => {
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
    <div className="w-full">
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
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
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
              {data
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
                        } transition-colors duration-200`}
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
            Showing {currentPage * pageLimit + 1} to{" "}
            {Math.min((currentPage + 1) * pageLimit, data.length)} of {data.length} entries
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
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
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
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={nextPage}
                disabled={currentPage + 1 >= Math.ceil(data.length / pageLimit)}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage + 1 >= Math.ceil(data.length / pageLimit)
                    ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>

            <select
              value={pageLimit}
              onChange={(e) => handlePageLimitChange({ target: { value: e.target.value } })}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get status styles
const getStatusStyles = (status) => {
  const statusLower = status?.toLowerCase();
  if (statusLower === "completed" || statusLower === "success" || statusLower === "active") {
    return "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full font-medium text-center";
  }
  if (statusLower === "pending") {
    return "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full font-medium text-center";
  }
  return "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full font-medium text-center";
};

export default MyTable;
