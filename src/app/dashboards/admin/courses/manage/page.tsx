"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit, Eye, Trash2, Search, Filter, Plus } from "lucide-react";
import { toast } from 'react-toastify';
import { apiUrls } from "@/apis";
import { useGetQuery } from "@/hooks/getQuery.hook";
import { usePostQuery } from "@/hooks/postQuery.hook";

interface Course {
  _id: string;
  course_title: string;
  course_category: string;
  course_type: string;
  status: string;
  course_image?: string;
  meta?: {
    enrollments: number;
    views: number;
    ratings: {
      average: number;
      count: number;
    };
  };
  created_at?: string;
  updated_at?: string;
}

export default function ManageCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");

  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const response = await getQuery({
          url: apiUrls.courses.getAllCourses,
          onSuccess: () => {},
          onFail: (error) => {
            console.error("Error fetching courses:", error);
            toast.error('Failed to load courses. Please try again.');
          }
        });
        
        if (response?.data) {
          let coursesData: Course[] = [];
          
          if (Array.isArray(response.data)) {
            coursesData = response.data;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            coursesData = response.data.data;
          } else if (response.data.success && Array.isArray(response.data.data)) {
            coursesData = response.data.data;
          }
          
          setCourses(coursesData);
          setFilteredCourses(coursesData);
        } else {
          console.error("No data received from courses API");
          toast.error('No courses found.');
        }
      } catch (error) {
        console.error("Error in fetchCourses:", error);
        toast.error('Failed to load courses. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [getQuery]);

  // Filter courses based on search term and filters
  useEffect(() => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.course_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.course_category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(course => course.status === statusFilter);
    }

    if (typeFilter) {
      filtered = filtered.filter(course => course.course_type === typeFilter);
    }

    setFilteredCourses(filtered);
  }, [courses, searchTerm, statusFilter, typeFilter]);

  const handleDeleteCourse = async (courseId: string, courseTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${courseTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await postQuery({
        url: `${apiUrls.courses.deleteCourse}/${courseId}`,
        postData: {},
        requireAuth: true,
        onSuccess: () => {
          toast.success(`Course "${courseTitle}" deleted successfully!`);
          setCourses(courses.filter(course => course._id !== courseId));
        },
        onFail: (error) => {
          const errorMessage = error?.response?.data?.message || 'Failed to delete course';
          toast.error(errorMessage);
        },
      });
    } catch (error) {
      console.error("Delete course error:", error);
      toast.error('Failed to delete course');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      'Published': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'Draft': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
      'Archived': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      'Active': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status as keyof typeof statusClasses] || statusClasses.Draft}`}>
        {status}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeClasses = {
      'blended': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      'live': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      'free': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeClasses[type as keyof typeof typeClasses] || typeClasses.free}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
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
                <h1 className="text-2xl font-bold text-white">Manage Courses</h1>
                <p className="mt-1 text-indigo-100">
                  View, edit, and manage all courses on the platform
                </p>
              </div>
              <Link
                href="/dashboards/admin/courses/create"
                className="inline-flex items-center px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add New Course
              </Link>
            </div>
          </div>

          <div className="p-6">
            {/* Search and Filters */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search courses..."
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
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Active">Active</option>
                <option value="Archived">Archived</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="">All Types</option>
                <option value="blended">Blended</option>
                <option value="live">Live</option>
                <option value="free">Free</option>
              </select>
            </div>

            {/* Course Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Total Courses</h3>
                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Published</h3>
                <p className="text-2xl font-bold text-green-600">
                  {courses.filter(c => c.status === 'Published').length}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Draft</h3>
                <p className="text-2xl font-bold text-gray-600">
                  {courses.filter(c => c.status === 'Draft').length}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Total Enrollments</h3>
                <p className="text-2xl font-bold text-indigo-600">
                  {courses.reduce((sum, course) => sum + (course.meta?.enrollments || 0), 0)}
                </p>
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <span className="ml-2 text-gray-600">Loading courses...</span>
              </div>
            ) : (
              <>
                {/* Courses Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Course
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Enrollments
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rating
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredCourses.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                            {searchTerm || statusFilter || typeFilter ? 
                              'No courses match your filters.' : 
                              'No courses found. Create your first course to get started.'
                            }
                          </td>
                        </tr>
                      ) : (
                        filteredCourses.map((course) => (
                          <tr key={course._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0">
                                  {course.course_image ? (
                                    <img
                                      className="h-10 w-10 rounded-lg object-cover"
                                      src={course.course_image}
                                      alt={course.course_title}
                                    />
                                  ) : (
                                    <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                      <span className="text-gray-500 text-xs font-medium">
                                        {course.course_title.charAt(0)}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {course.course_title}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {course.course_category}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getTypeBadge(course.course_type)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(course.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {course.meta?.enrollments || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex items-center">
                                <span className="text-yellow-400">★</span>
                                <span className="ml-1">
                                  {course.meta?.ratings?.average?.toFixed(1) || '0.0'}
                                </span>
                                <span className="text-gray-500 ml-1">
                                  ({course.meta?.ratings?.count || 0})
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <Link
                                  href={`/course-details/${course._id}`}
                                  className="text-indigo-600 hover:text-indigo-900 p-1 rounded-md hover:bg-indigo-50"
                                  title="View Course"
                                >
                                  <Eye className="h-4 w-4" />
                                </Link>
                                <Link
                                  href={`/dashboards/admin/courses/edit/${course._id}`}
                                  className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                                  title="Edit Course"
                                >
                                  <Edit className="h-4 w-4" />
                                </Link>
                                <button
                                  onClick={() => handleDeleteCourse(course._id, course.course_title)}
                                  className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                                  title="Delete Course"
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