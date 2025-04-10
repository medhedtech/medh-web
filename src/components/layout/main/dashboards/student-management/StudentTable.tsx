"use client";
import React from "react";
import MyTable from "@/components/shared/common-table/page";
import { IStudent } from "@/types/student.types";

type TableColumn = {
  Header: string;
  accessor: string;
  className?: string;
  width?: string;
  icon?: React.ReactNode;
  render?: (row: any) => React.ReactNode;
};

interface StudentTableProps {
  data: IStudent[];
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => Promise<void>;
}

/**
 * StudentTable component for displaying student data with actions
 */
const StudentTable: React.FC<StudentTableProps> = ({ data, onDelete, onToggleStatus }) => {
  // Configure table columns with renderers for special cells
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
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
            {row.full_name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{row.full_name}</div>
            <div className="text-sm text-gray-500">
              {row.phone_numbers && row.phone_numbers.length > 0
                ? row.phone_numbers[0].number
                : row.phone_number || "No phone"}
            </div>
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
      Header: "Role",
      accessor: "role",
      className: "min-w-[150px]",
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.role?.map((role: string, index: number) => (
            <span
              key={index}
              className={`px-2 py-1 text-xs rounded-full ${
                role === "student"
                  ? "bg-green-100 text-green-800"
                  : role === "coorporate-student"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {role.replace("-", " ")}
            </span>
          ))}
        </div>
      ),
    },
    {
      Header: "Join Date",
      accessor: "createdAt",
      className: "min-w-[120px]",
      render: (row) => (
        <div className="text-gray-600 dark:text-gray-300">{row.createdAt}</div>
      ),
    },
    {
      Header: "Status",
      accessor: "status",
      className: "min-w-[150px]",
      render: (row) => {
        const isActive = row?.status === "Active";
        return (
          <div className="flex gap-2 items-center">
            <button
              onClick={() => onToggleStatus(row?._id)}
              className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                isActive ? "bg-green-500" : "bg-gray-400"
              }`}
              aria-label={`Toggle status for ${row.full_name}`}
              aria-pressed={isActive}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transform transition-transform duration-300 ${
                  isActive ? "translate-x-5" : "translate-x-0"
                }`}
              ></div>
            </button>
            <span
              className={`text-sm font-medium ${
                isActive ? "text-green-600" : "text-gray-600"
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
      className: "w-[150px]",
      render: (row) => (
        <div className="flex gap-2 items-center">
          <button
            onClick={() => window.open(`student/${row._id}`, "_blank")}
            className="text-blue-500 hover:text-blue-700 font-medium text-sm"
            aria-label={`View ${row.full_name}'s details`}
          >
            View
          </button>
          <button
            onClick={() => onDelete(row._id)}
            className="text-red-500 hover:text-red-700 font-medium text-sm"
            aria-label={`Delete ${row.full_name}`}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <MyTable columns={columns} data={data} />
      
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No students found matching your criteria
        </div>
      )}
    </div>
  );
};

export default StudentTable; 