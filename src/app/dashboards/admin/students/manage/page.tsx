"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit, Eye, Trash2, Search, UserPlus, Mail, Phone } from "lucide-react";
import { toast } from 'react-toastify';
import { apiUrls } from "@/apis";
import { useGetQuery } from "@/hooks/getQuery.hook";
import { usePostQuery } from "@/hooks/postQuery.hook";

interface Student {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  profile_image?: string;
  enrollment_date: string;
  status: string;
  courses_enrolled: string[];
  meta?: {
    total_courses: number;
    completed_courses: number;
    progress: number;
    last_login?: string;
  };
  created_at?: string;
  updated_at?: string;
}

export default function ManageStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();

  // Fetch students on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const response = await getQuery({
          url: apiUrls.students?.getAllStudents || '/api/students',
          onSuccess: () => {},
          onFail: (error) => {
            console.error("Error fetching students:", error);
            toast.error('Failed to load students. Please try again.');
          }
        });
        
        if (response?.data) {
          let studentsData: Student[] = [];
          
          if (Array.isArray(response.data)) {
            studentsData = response.data;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            studentsData = response.data.data;
          } else if (response.data.success && Array.isArray(response.data.data)) {
            studentsData = response.data.data;
          }
          
          setStudents(studentsData);
          setFilteredStudents(studentsData);
        } else {
          console.error("No data received from students API");
          toast.error('No students found.');
        }
      } catch (error) {
        console.error("Error in fetchStudents:", error);
        toast.error('Failed to load students. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [getQuery]);

  // Filter students based on search term and filters
  useEffect(() => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(student => student.status === statusFilter);
    }

    setFilteredStudents(filtered);
  }, [students, searchTerm, statusFilter]);

  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    if (!confirm(`Are you sure you want to delete "${studentName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await postQuery({
        url: `${apiUrls.students?.deleteStudent || '/api/students'}/${studentId}`,
        postData: {},
        requireAuth: true,
        onSuccess: () => {
          toast.success(`Student "${studentName}" deleted successfully!`);
          setStudents(students.filter(student => student._id !== studentId));
        },
        onFail: (error) => {
          const errorMessage = error?.response?.data?.message || 'Failed to delete student';
          toast.error(errorMessage);
        },
      });
    } catch (error) {
      console.error("Delete student error:", error);
      toast.error('Failed to delete student');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      'Active': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'Inactive': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
      'Suspended': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status as keyof typeof statusClasses] || statusClasses.Active}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-blue-600';
    if (progress >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/dashboards/admin" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Admin Dashboard
          </Link>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="bg-indigo-600 px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-white">Manage Students</h1>
                <p className="mt-1 text-indigo-100">
                  View and manage all students on the platform
                </p>
              </div>
              <Link
                href="/dashboards/admin/students/invite"
                className="inline-flex items-center px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Invite Student
              </Link>
            </div>
          </div>

          <div className="p-6">
            {/* Search and Filters */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            {/* Student Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
                <p className="text-2xl font-bold text-gray-900">{students.length}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Active Students</h3>
                <p className="text-2xl font-bold text-green-600">
                  {students.filter(s => s.status === 'Active').length}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">New This Month</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {students.filter(s => {
                    const enrollmentDate = new Date(s.enrollment_date);
                    const currentMonth = new Date();
                    return enrollmentDate.getMonth() === currentMonth.getMonth() && 
                           enrollmentDate.getFullYear() === currentMonth.getFullYear();
                  }).length}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Avg. Progress</h3>
                <p className="text-2xl font-bold text-indigo-600">
                  {students.length > 0 
                    ? Math.round(students.reduce((sum, student) => sum + (student.meta?.progress || 0), 0) / students.length)
                    : 0}%
                </p>
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <span className="ml-2 text-gray-600">Loading students...</span>
              </div>
            ) : (
              <>
                {/* Students Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Courses
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Progress
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Enrolled
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                            {searchTerm || statusFilter ? 
                              'No students match your filters.' : 
                              'No students found. Students will appear here once they register.'
                            }
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map((student) => (
                          <tr key={student._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0">
                                  {student.profile_image ? (
                                    <img
                                      className="h-10 w-10 rounded-full object-cover"
                                      src={student.profile_image}
                                      alt={`${student.first_name} ${student.last_name}`}
                                    />
                                  ) : (
                                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                      <span className="text-indigo-600 text-sm font-medium">
                                        {student.first_name.charAt(0)}{student.last_name.charAt(0)}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {student.first_name} {student.last_name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    ID: {student._id.slice(-8)}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                <div className="flex items-center mb-1">
                                  <Mail className="h-4 w-4 text-gray-400 mr-1" />
                                  {student.email}
                                </div>
                                {student.phone && (
                                  <div className="flex items-center">
                                    <Phone className="h-4 w-4 text-gray-400 mr-1" />
                                    {student.phone}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(student.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {student.meta?.total_courses || 0} enrolled
                                </span>
                                <span className="text-gray-500">
                                  {student.meta?.completed_courses || 0} completed
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex items-center">
                                <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                  <div 
                                    className="bg-indigo-600 h-2 rounded-full" 
                                    style={{ width: `${student.meta?.progress || 0}%` }}
                                  ></div>
                                </div>
                                <span className={`font-medium ${getProgressColor(student.meta?.progress || 0)}`}>
                                  {student.meta?.progress || 0}%
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDate(student.enrollment_date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <Link
                                  href={`/dashboards/admin/students/profile/${student._id}`}
                                  className="text-indigo-600 hover:text-indigo-900 p-1 rounded-md hover:bg-indigo-50"
                                  title="View Profile"
                                >
                                  <Eye className="h-4 w-4" />
                                </Link>
                                <Link
                                  href={`/dashboards/admin/students/edit/${student._id}`}
                                  className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                                  title="Edit Student"
                                >
                                  <Edit className="h-4 w-4" />
                                </Link>
                                <button
                                  onClick={() => handleDeleteStudent(student._id, `${student.first_name} ${student.last_name}`)}
                                  className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                                  title="Delete Student"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 