"use client";

import React, { useState, useEffect } from "react";
import { 
  Book, 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List as ListIcon, 
  Trash2, 
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import EditableCourseCard from "@/components/shared/courses/EditableCourseCard";
import { getAllCoursesWithLimits } from "@/apis/course/course";
import { ICourse } from "@/types/course";
import axios from "axios";
import { apiBaseUrl } from "@/apis";

interface ApiResponse {
  data: ICourse[];
  success: boolean;
  message?: string;
}

const AdminCourseList: React.FC = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const router = useRouter();

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get the API URL from the getAllCoursesWithLimits function
      const apiUrl = getAllCoursesWithLimits({ limit: 100 });
      
      // Make the actual API call using axios
      const response = await axios.get(apiUrl);
      
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setCourses(response.data.data);
      } else {
        setError("Failed to fetch courses");
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("An error occurred while fetching courses");
    } finally {
      setLoading(false);
    }
  };

  // Filter courses based on search term
  const filteredCourses = courses.filter(course => 
    course.course_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (course.course_category || course.category || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditCourse = (id: string) => {
    router.push(`/dashboards/admin-updateCourse/${id}`);
  };

  const handleViewCourse = (id: string) => {
    router.push(`/course-details/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setCourseToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!courseToDelete) return;
    
    try {
      // Call API to delete course
      // await deleteCourse(courseToDelete);
      
      // For now, just filter out the deleted course
      setCourses(prevCourses => prevCourses.filter(course => course._id !== courseToDelete));
      setShowDeleteModal(false);
      setCourseToDelete(null);
    } catch (err) {
      console.error("Error deleting course:", err);
      // Show error notification
    }
  };

  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center mb-4 text-red-500">
          <AlertTriangle className="mr-2" />
          <h3 className="text-lg font-semibold">Confirm Deletion</h3>
        </div>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Are you sure you want to delete this course? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button 
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200"
          >
            Cancel
          </button>
          <button 
            onClick={confirmDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="w-full p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Course Management
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 h-[350px] animate-pulse">
              <div className="w-full h-48 bg-gray-300 dark:bg-gray-700 rounded-lg mb-4"></div>
              <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8">
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 p-4 rounded-lg">
          <p className="font-medium">Error: {error}</p>
          <button 
            onClick={fetchCourses}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center">
          <Book className="w-6 h-6 text-blue-500 mr-2" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Course Management
          </h2>
          <span className="ml-2 bg-blue-100 text-blue-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {courses.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link 
            href="/dashboards/admin-addcourse"
            className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
          >
            <Plus size={16} />
            <span>Add Course</span>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
            placeholder="Search courses by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg ${
              viewMode === "grid"
                ? "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg ${
              viewMode === "list"
                ? "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            <ListIcon size={20} />
          </button>
        </div>
      </div>

      {/* Course Grid/List */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <Book className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Courses Found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchTerm ? "No courses match your search criteria." : "You haven't added any courses yet."}
          </p>
          <Link
            href="/dashboards/admin-addcourse"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus size={16} className="mr-2" />
            Add Your First Course
          </Link>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <EditableCourseCard
              key={course._id}
              _id={course._id}
              course_title={course.course_title}
              course_image={course.course_image || course.thumbnail || "/fallback-course-image.jpg"}
              course_category={course.course_category || course.category || "Uncategorized"}
              course_description={course.course_description || course.description || ""}
              course_duration={course.course_duration?.toString() || "Flexible"}
              course_sessions={String(course.course_sessions || course.no_of_Sessions || "Multiple")}
              is_Certification={course.is_Certification || "No"}
              is_Assignments={course.is_Assignments || "No"}
              is_Projects={course.is_Projects || "No"}
              is_Quizes={course.is_Quizes || "No"}
              isFree={course.isFree || false}
              prices={course.prices || []}
              brochures={course.brochures}
              class_type={course.class_type || "Blended"}
              isAdmin={true}
              onEdit={handleEditCourse}
              onDelete={handleDeleteClick}
              onView={handleViewCourse}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCourses.map((course) => (
                <tr key={course._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-md object-cover"
                          src={course.course_image || course.thumbnail || "/fallback-course-image.jpg"}
                          alt={course.course_title}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {course.course_title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {course.course_duration?.toString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      {course.course_category || course.category || "Uncategorized"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {course.class_type || "Blended"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {course.isFree 
                      ? <span className="text-green-600 font-medium">Free</span>
                      : course.prices && course.prices[0]
                      ? `${course.prices[0].currency} ${course.prices[0].individual}`
                      : "Not set"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center gap-2">
                      <button
                        onClick={() => handleViewCourse(course._id)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEditCourse(course._id)}
                        className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(course._id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && <DeleteConfirmationModal />}
    </div>
  );
};

export default AdminCourseList; 