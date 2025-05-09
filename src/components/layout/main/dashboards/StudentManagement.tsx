"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiBaseUrl } from "@/apis";
import { Users, Search, Trash2, Edit, Eye, UserPlus, Filter, RefreshCcw } from "lucide-react";
import { DataTable } from "@/components/shared/tables/DataTable";
import LoadingIndicator from "@/components/shared/loaders/LoadingIndicator";
import EmptyState from "@/components/shared/ui/EmptyState";
import Button from "@/components/shared/buttons/Button";
import InputField from "@/components/shared/forms/InputField";

interface Student {
  _id: string;
  full_name: string;
  email: string;
  phone_numbers?: { country: string; number: string }[];
  status?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

/**
 * StudentManagement component serves as the main container for the student management dashboard
 * It has been refactored to improve maintainability, performance, and user experience
 */
const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, statusFilter]);

  const fetchStudents = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get token from local storage
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Authentication token not found. Please login again.");
        setIsLoading(false);
        return;
      }
      
      const response = await axios.get(`${apiBaseUrl}/auth/get-all-students`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.data && response.data.data.students) {
        setStudents(response.data.data.students);
      } else {
        setStudents([]);
        setError("No student data found or invalid response format");
      }
    } catch (err: any) {
      console.error("Error fetching students:", err);
      setError(err.response?.data?.message || "Failed to fetch students. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = [...students];
    
    // Apply search filter
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter(student => 
        student.full_name?.toLowerCase().includes(searchTermLower) ||
        student.email?.toLowerCase().includes(searchTermLower) ||
        student.phone_numbers?.[0]?.number?.includes(searchTerm)
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(student => student.status === statusFilter);
    }
    
    setFilteredStudents(filtered);
  };

  const handleToggleStatus = async (studentId: string, currentStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Authentication token not found. Please login again.");
        return;
      }
      
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      
      await axios.patch(`${apiBaseUrl}/auth/toggle-status`, {
        id: studentId,
        status: newStatus
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update local state
      setStudents(prevStudents => 
        prevStudents.map(student => 
          student._id === studentId ? { ...student, status: newStatus } : student
        )
      );
      
    } catch (err: any) {
      console.error("Error toggling student status:", err);
      setError(err.response?.data?.message || "Failed to update student status");
    }
  };

  const columns = [
    {
      header: "Name",
      accessorKey: "full_name",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            {row.original.full_name ? row.original.full_name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <p className="font-medium">{row.original.full_name}</p>
            <p className="text-sm text-gray-500">{row.original.email}</p>
          </div>
        </div>
      )
    },
    {
      header: "Phone",
      accessorKey: "phone",
      cell: ({ row }: any) => (
        <div>
          {row.original.phone_numbers && row.original.phone_numbers.length > 0 
            ? `${row.original.phone_numbers[0].country} ${row.original.phone_numbers[0].number}`
            : "N/A"}
        </div>
      )
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }: any) => (
        <div>
          <span 
            className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
              row.original.status === "active" 
                ? "bg-green-100 text-green-800" 
                : "bg-red-100 text-red-800"
            }`}
          >
            {row.original.status === "active" ? "Active" : "Inactive"}
          </span>
        </div>
      )
    },
    {
      header: "Joined On",
      accessorKey: "created_at",
      cell: ({ row }: any) => (
        <div>
          {row.original.created_at 
            ? new Date(row.original.created_at).toLocaleDateString() 
            : "N/A"}
        </div>
      )
    },
    {
      header: "Actions",
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-2">
          <button 
            className="text-blue-500 hover:text-blue-700"
            title="View Details"
            onClick={() => console.log("View student:", row.original._id)}
          >
            <Eye size={18} />
          </button>
          <button 
            className="text-green-500 hover:text-green-700"
            title="Edit"
            onClick={() => console.log("Edit student:", row.original._id)}
          >
            <Edit size={18} />
          </button>
          <button 
            className="text-red-500 hover:text-red-700"
            title="Delete"
            onClick={() => console.log("Delete student:", row.original._id)}
          >
            <Trash2 size={18} />
          </button>
          <button 
            className={`${
              row.original.status === "active" 
                ? "text-orange-500 hover:text-orange-700" 
                : "text-green-500 hover:text-green-700"
            }`}
            title={row.original.status === "active" ? "Deactivate" : "Activate"}
            onClick={() => handleToggleStatus(row.original._id, row.original.status)}
          >
            {row.original.status === "active" ? "Deactivate" : "Activate"}
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header and actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">All Students</h2>
          <span className="bg-primary/10 text-primary text-sm px-2 py-1 rounded-full">
            {filteredStudents.length}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => console.log("Add new student")}
          >
            <UserPlus className="h-4 w-4 mr-1" />
            Add Student
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={fetchStudents}
          >
            <RefreshCcw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-64">
          <InputField
            id="search"
            type="text"
            placeholder="Search by name, email or phone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="h-4 w-4 text-gray-400" />}
            fullWidth
          />
        </div>
        <div className="w-full sm:w-auto">
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Data table */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingIndicator type="spinner" size="lg" />
        </div>
      ) : filteredStudents.length > 0 ? (
        <DataTable
          columns={columns}
          data={filteredStudents}
          initialState={{
            pagination: {
              pageSize: 10
            }
          }}
        />
      ) : (
        <EmptyState
          icon={<Users className="h-12 w-12" />}
          title="No Students Found"
          description="There are no students matching your search criteria."
          action={
            <Button 
              variant="primary" 
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
            >
              Clear Filters
            </Button>
          }
        />
      )}
    </div>
  );
};

export default StudentManagement; 