"use client";

import { apiUrls } from "@/apis";
import React, { useEffect, useState, useMemo } from "react";
import MyTable from "@/components/shared/common-table/page";
import useGetQuery from "@/hooks/getQuery.hook";
import Preloader from "@/components/shared/others/Preloader";
import { useRouter } from "next/navigation";
import { FaPlus, FaTrash, FaSearch, FaFilter, FaEye, FaCheck } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import useDeleteQuery from "@/hooks/deleteQuery.hook";
import usePostQuery from "@/hooks/postQuery.hook";
import { toast } from "react-toastify";
import Tooltip from "@/components/shared/others/Tooltip";
import Image from "next/image";

// Add this new component before the ListOfCourse component
const StatusToggleButton = ({ status, onToggle, courseId }) => {
  const [isToggling, setIsToggling] = useState(false);
  const isPublished = status === "Published";

  const handleToggle = async (e) => {
    e.stopPropagation();
    if (isToggling) return;

    setIsToggling(true);
    await onToggle(courseId);
    setTimeout(() => setIsToggling(false), 500);
  };

  const getStatusColor = (currentStatus) => {
    switch (currentStatus) {
      case "Published":
        return "text-green-600 dark:text-green-500";
      case "Draft":
        return "text-yellow-600 dark:text-yellow-500";
      case "Archived":
        return "text-gray-600 dark:text-gray-400";
      case "Active":
        return "text-blue-600 dark:text-blue-500";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getToggleColor = (currentStatus) => {
    switch (currentStatus) {
      case "Published":
        return "bg-green-500 hover:bg-green-600";
      case "Draft":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "Archived":
        return "bg-gray-500 hover:bg-gray-600";
      case "Active":
        return "bg-blue-500 hover:bg-blue-600";
      default:
        return "bg-gray-300 hover:bg-gray-400";
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <div className="relative">
        <button
          onClick={handleToggle}
          disabled={isToggling}
          className={`w-12 h-6 flex items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
            getToggleColor(status)
          }`}
          title={`Click to toggle course status`}
        >
          <span
            className={`${
              isPublished ? 'translate-x-6' : 'translate-x-1'
            } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ease-in-out shadow-sm`}
          />
        </button>
      </div>
      <span
        className={`text-sm font-medium ${getStatusColor(status)}`}
      >
        {isToggling ? (
          <span className="inline-flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Updating...
          </span>
        ) : (
          status || 'Draft'
        )}
      </span>
    </div>
  );
};

export default function ListOfCourse() {
  const router = useRouter();
  const { deleteQuery } = useDeleteQuery();
  const { postQuery, loading: postLoading } = usePostQuery();
  const { getQuery, loading } = useGetQuery();

  const [courses, setCourses] = useState([]);  // Initialize as empty array
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [instructorNames, setInstructorNames] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [updateStatus, setUpdateStatus] = useState(null);
  const [filterCategory, setFilterCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [sortField, setSortField] = useState("updatedAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [batchAction, setBatchAction] = useState("");
  const [scheduledCourses, setScheduledCourses] = useState({});
  const [advancedFilterModal, setAdvancedFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);
  const [filters, setFilters] = useState({
    status: "",
    dateRange: { start: null, end: null },
    priceRange: { min: "", max: "" },
    featured: false,
    enrollment: { min: "", max: "" },
    instructor: "",
    level: "",
    mode: "",
    rating: { min: "", max: "" },
    sessions: { min: "", max: "" },
    duration: { min: "", max: "" },
    hasDiscount: false,
    hasCertificate: false,
    tags: []
  });
  const [analyticsData, setAnalyticsData] = useState({});
  const [instructors, setInstructors] = useState({}); // Store instructors in an object for quick lookup
  const [assignInstructorModal, setAssignInstructorModal] = useState({ open: false, courseId: null });
  const [activeActionMenu, setActiveActionMenu] = useState(null);
  const [scheduleModal, setScheduleModal] = useState({ open: false, courseId: null, courseTitle: "" });
  const [exportModal, setExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportScope, setExportScope] = useState('filtered');
  const [exportLoading, setExportLoading] = useState(false);
  const [coursesData, setCoursesData] = useState([]); // Initialize as an empty array

  // Add new status management functionality
  const statusTransitions = {
    "Draft": ["Published", "Archived"],
    "Published": ["Active", "Archived"],
    "Active": ["Published", "Archived"],
    "Archived": ["Draft"]
  };

  // Add a custom checkbox component
  const CustomCheckbox = ({ checked, onChange, disabled = false }) => {
    return (
      <div 
        className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-all duration-200 ${
          disabled 
            ? "border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-700" 
            : checked 
              ? "bg-green-600 border-green-600 hover:bg-green-700 hover:border-green-700 dark:bg-green-500 dark:border-green-500 dark:hover:bg-green-600 dark:hover:border-green-600 shadow-sm" 
              : "border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/10"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) {
            onChange(!checked);
          }
        }}
      >
        {checked && (
          <svg 
            className="w-3 h-3 text-white dark:text-white transform scale-100 transition-transform duration-200" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={3} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        )}
      </div>
    );
  };

  // Function to handle select all checkbox
  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      // Only select items on the current page
      const currentPageIds = paginatedData.map(course => course._id);
      setSelectedCourses(prev => {
        // Keep previously selected courses that are not on the current page
        const prevSelected = prev.filter(id => !currentPageIds.includes(id));
        return [...prevSelected, ...currentPageIds];
      });
    } else {
      // Deselect only items on the current page
      const currentPageIds = paginatedData.map(course => course._id);
      setSelectedCourses(prev => prev.filter(id => !currentPageIds.includes(id)));
    }
  };

  // Function to handle selecting individual course
  const handleSelectCourse = (isChecked, courseId) => {
    if (isChecked) {
      setSelectedCourses(prev => [...prev, courseId]);
    } else {
      setSelectedCourses(prev => prev.filter(id => id !== courseId));
    }
  };

  // Add missing generateAnalyticsData function for analytics refresh
  const generateAnalyticsData = () => {
    // Default empty structure to prevent errors
    const defaultData = {
      totalCourses: 0,
      published: 0,
      draft: 0,
      totalEnrollments: 0,
      monthlyEnrollments: 0,
      topCategories: []
    };

    try {
      if (!courses || courses.length === 0) {
        return defaultData;
      }

      // Calculate published/draft courses
      const published = courses.filter(c => c.status === "Published").length;
      const draft = courses.filter(c => c.status === "Draft").length;
      
      // Calculate total enrollments
      const totalEnrollments = courses.reduce((total, course) => 
        total + (course.enrollments?.length || 0), 0);
      
      // Calculate this month's enrollments
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyEnrollments = courses.reduce((total, course) => {
        const thisMonthEnrollments = (course.enrollments || []).filter(enrollment => {
          if (!enrollment.createdAt) return false;
          const enrollmentDate = new Date(enrollment.createdAt);
          return enrollmentDate.getMonth() === currentMonth && 
                 enrollmentDate.getFullYear() === currentYear;
        });
        return total + thisMonthEnrollments.length;
      }, 0);
      
      // Calculate top categories
      const categoryCounts = {};
      courses.forEach(course => {
        const category = course.course_category || 'Uncategorized';
        if (!categoryCounts[category]) {
          categoryCounts[category] = 0;
        }
        categoryCounts[category]++;
      });
      
      const topCategories = Object.entries(categoryCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // Get top 5 categories
      
      return {
        totalCourses: courses.length,
        published,
        draft,
        totalEnrollments,
        monthlyEnrollments,
        topCategories
      };
    } catch (error) {
      console.error("Error generating analytics:", error);
      return defaultData;
    }
  };

  // Modified analytics fetch function with improved error handling
  const fetchCourseAnalytics = () => {
    const loadingToastId = toast.loading("Loading analytics...");
    
    try {
      // Generate analytics data from courses
      const data = generateAnalyticsData();
      setAnalyticsData(data);
      
      toast.update(loadingToastId, {
        render: "Analytics loaded successfully",
        type: "success",
        isLoading: false,
        autoClose: 1000,
      });
    } catch (error) {
      console.error("Analytics generation error:", error);
      toast.update(loadingToastId, {
        render: "Error loading analytics",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  // Initialize analytics data when component mounts
  useEffect(() => {
    if (courses.length > 0 && Object.keys(analyticsData).length === 0) {
      fetchCourseAnalytics();
    }
  }, [courses]);

  // Update the toggleStatus function with improved error handling and loading state
  const toggleStatus = async (id, currentStatus) => {
    const loadingToastId = toast.loading("Updating course status...");
    
    try {
      await postQuery({
        url: `${apiUrls?.courses?.toggleCourseStatus}/${id}`,
        postData: {},
        onSuccess: (response) => {
          const updatedStatus = response?.course?.status;
          if (updatedStatus) {
            toast.update(loadingToastId, {
              render: `Course status changed to ${updatedStatus}`,
              type: "success",
              isLoading: false,
              autoClose: 2000,
            });
            // Refresh data and analytics
            setUpdateStatus(Date.now());
            fetchCourseAnalytics();
          } else {
            toast.update(loadingToastId, {
              render: "Failed to update course status",
              type: "error",
              isLoading: false,
              autoClose: 3000,
            });
          }
        },
        onFail: (error) => {
          console.error('Toggle Status API Error:', error);
          toast.update(loadingToastId, {
            render: error?.message || 'Failed to change course status',
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
          
          // Revert optimistic update if needed
          setCourses(prev => prev.map(course => 
            course._id === id 
              ? {...course, status: currentStatus}
              : course
          ));
        },
      });
    } catch (error) {
      console.error('Status toggle error:', error);
      toast.update(loadingToastId, {
        render: "Something went wrong while updating status",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  // Enhanced StatusDropdown component with improved UI and functionality
  const StatusDropdown = ({ courseId, currentStatus }) => {
    const allowedTransitions = statusTransitions[currentStatus] || [];
    const [isUpdating, setIsUpdating] = useState(false);
    
    // Enhanced status change handler with loading state
    const handleStatusChangeWithLoading = async (e) => {
      const newStatus = e.target.value;
      if (newStatus === currentStatus) return;
      
      // Prevent multiple clicks
      setIsUpdating(true);
      
      try {
        await handleStatusChange(courseId, newStatus);
      } finally {
        // Re-enable after 2 seconds to prevent rapid changes
        setTimeout(() => setIsUpdating(false), 2000);
      }
    };
    
    return (
      <div className="relative w-[120px]" onClick={(e) => e.stopPropagation()}>
        <select
          className={`bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm appearance-none pr-8 focus:outline-none focus:ring-1 focus:ring-green-500 w-full cursor-pointer ${isUpdating ? 'opacity-70' : ''}`}
          value={currentStatus}
          onChange={handleStatusChangeWithLoading}
          disabled={isUpdating}
        >
          <option value={currentStatus} className={`font-medium ${
            currentStatus === "Published" ? "text-green-600" :
            currentStatus === "Draft" ? "text-yellow-600" :
            currentStatus === "Archived" ? "text-gray-600" :
            "text-blue-600"
          }`}>{currentStatus} {isUpdating && '(Updating...)'}</option>
          {allowedTransitions.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          {isUpdating ? (
            <svg className="animate-spin h-4 w-4 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
        
        {/* Status indicator dot */}
        <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 -ml-2 w-2 h-2 rounded-full ${
          currentStatus === "Published" ? "bg-green-500" :
          currentStatus === "Draft" ? "bg-yellow-500" :
          currentStatus === "Archived" ? "bg-gray-500" :
          "bg-blue-600"
        }`}></div>
      </div>
    );
  };

  useEffect(() => {
    const fetchCourses = async () => {
      await getQuery({
        url: apiUrls?.courses?.getAllCourses,
        onSuccess: async (data) => {
          console.log('Courses fetched:', data); // Check the status values
          // Ensure data is an array before setting it
          const coursesArray = Array.isArray(data) ? data : [];
          setCourses(coursesArray);
          
          // Only fetch instructors if we have courses
          if (coursesArray.length > 0) {
            await fetchInstructors(coursesArray);
          }
          
          // Extract unique categories for filtering
          const uniqueCategories = [...new Set(coursesArray.map(course => course.course_category))].filter(Boolean);
          setCategories(uniqueCategories);
        },
        onFail: (err) => {
          console.error("Failed to fetch courses:", err);
          toast.error("Failed to load courses. Please try again.");
          // Initialize with empty array on failure
          setCourses([]);
        },
      });
    };

    const fetchInstructors = async (courses) => {
      // Guard clause to prevent mapping over undefined
      if (!Array.isArray(courses)) {
        console.error("Courses data is not an array:", courses);
        return;
      }

      const instructorsMap = {};
      try {
        await Promise.all(
          courses.map(async (course) => {
            if (course?.assigned_instructor) { // Add null check with optional chaining
              try {
                const response = await getQuery({
                  url: `${apiUrls?.assignedInstructors?.getAssignedInstructorById}/${course.assigned_instructor}`,
                  onSuccess: (data) => {
                    instructorsMap[course.assigned_instructor] = data?.assignment?.full_name || "Instructor not available";
                  },
                  onFail: () => {
                    instructorsMap[course.assigned_instructor] = "Not available";
                  },
                });
              } catch (error) {
                console.error(`Error fetching instructor for course ${course._id}:`, error);
                instructorsMap[course.assigned_instructor] = "Error loading instructor";
              }
            }
          })
        );
        setInstructorNames(instructorsMap);
      } catch (error) {
        console.error("Error in fetchInstructors:", error);
        setInstructorNames({});
      }
    };

    fetchCourses();
  }, [updateStatus]);

  const handleDelete = (id) => {
    // Show confirmation dialog
    const confirmDelete = window.confirm("Are you sure you want to delete this course?");
    if (!confirmDelete) return;
    
    const loadingToastId = toast.loading("Deleting course...");
    deleteQuery({
      url: `${apiUrls?.courses?.deleteCourse}/${id}`,
      onSuccess: () => {
        toast.update(loadingToastId, {
          render: "Course deleted successfully",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        setUpdateStatus(Date.now());
        setSelectedCourses(selectedCourses.filter(courseId => courseId !== id));
      },
      onFail: () => {
        toast.update(loadingToastId, {
          render: "Failed to delete course",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      },
    });
  };

  const handleMultipleDelete = () => {
    if (selectedCourses.length === 0) {
      toast.info("Please select courses to delete");
      return;
    }
    
    const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedCourses.length} selected courses?`);
    if (!confirmDelete) return;
    
    const loadingToastId = toast.loading(`Deleting ${selectedCourses.length} courses...`);
    
    let successCount = 0;
    let failCount = 0;
    
    const deletePromises = selectedCourses.map(id => 
      new Promise(resolve => {
        deleteQuery({
          url: `${apiUrls?.courses?.deleteCourse}/${id}`,
          onSuccess: () => {
            successCount++;
            resolve();
          },
          onFail: () => {
            failCount++;
            resolve();
          },
        });
      })
    );
    
    Promise.all(deletePromises).then(() => {
      if (successCount > 0) {
        toast.update(loadingToastId, {
          render: `Successfully deleted ${successCount} courses${failCount > 0 ? `, failed to delete ${failCount} courses` : ''}`,
          type: failCount > 0 ? "warning" : "success",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        toast.update(loadingToastId, {
          render: "Failed to delete courses",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
      
      setSelectedCourses([]);
      setUpdateStatus(Date.now());
    });
  };

  const editCourse = (id) => {
    router.push(`admin-updateCourse/${id}`);
  };

  const viewCourse = (id) => {
    // Navigate to course details page
    router.push(`/course-details/${id}`);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getCourseStatus = (course) => {
    // Determine course status based on properties
    if (course.isPublished) return "Published";
    if (course.isDraft) return "Draft";
    if (course.isArchived) return "Archived";
    return "Active"; // Default status
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Published": return "bg-green-100 text-green-800";
      case "Draft": return "bg-yellow-100 text-yellow-800";
      case "Archived": return "bg-gray-100 text-gray-800";
      case "Active": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Filter and sort data
  const filteredData = Array.isArray(courses) ? courses
    .filter(course => {
      if (!course) return false;  // Skip null/undefined courses
      
      // Basic search filter
      const matchesSearch = (course.course_title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (course.course_category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (course.course_description || '').toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory = !filterCategory || course.course_category === filterCategory;

      // Advanced filters
      const matchesStatus = !filters.status || course.status === filters.status;
      const matchesFeatured = !filters.featured || course.featured === filters.featured;
      const matchesLevel = !filters.level || course.level === filters.level;
      const matchesMode = !filters.mode || course.mode === filters.mode;
      
      // Price range filter
      const matchesPriceRange = (!filters.priceRange.min || (course.price >= parseFloat(filters.priceRange.min))) &&
                               (!filters.priceRange.max || (course.price <= parseFloat(filters.priceRange.max)));

      // Enrollment range filter
      const enrollmentCount = course.enrollments?.length || 0;
      const matchesEnrollment = (!filters.enrollment.min || enrollmentCount >= parseInt(filters.enrollment.min)) &&
                               (!filters.enrollment.max || enrollmentCount <= parseInt(filters.enrollment.max));

      // Rating range filter
      const matchesRating = (!filters.rating.min || course.rating >= parseFloat(filters.rating.min)) &&
                           (!filters.rating.max || course.rating <= parseFloat(filters.rating.max));

      // Date range filter
      const courseDate = new Date(course.createdAt);
      const matchesDateRange = (!filters.dateRange.start || courseDate >= new Date(filters.dateRange.start)) &&
                             (!filters.dateRange.end || courseDate <= new Date(filters.dateRange.end));

      // Instructor filter
      const matchesInstructor = !filters.instructor || course.instructor_id === filters.instructor;

      // Tags filter
      const matchesTags = filters.tags.length === 0 || 
                         filters.tags.every(tag => course.tags?.includes(tag));

      // Certificate filter
      const matchesCertificate = !filters.hasCertificate || course.hasCertificate;

      // Discount filter
      const matchesDiscount = !filters.hasDiscount || (course.discountPrice && course.discountPrice < course.price);

      return matchesSearch && 
             matchesCategory && 
             matchesStatus && 
             matchesFeatured && 
             matchesLevel && 
             matchesMode && 
             matchesPriceRange && 
             matchesEnrollment && 
             matchesRating && 
             matchesDateRange && 
             matchesInstructor && 
             matchesTags && 
             matchesCertificate && 
             matchesDiscount;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      
      // Special case for instructor name sorting
      if (sortField === 'instructor') {
        const instructorA = instructorNames[a.instructor_id] || '';
        const instructorB = instructorNames[b.instructor_id] || '';
        return sortDirection === "asc" 
          ? instructorA.localeCompare(instructorB)
          : instructorB.localeCompare(instructorA);
      }
      
      // Special case for status sorting
      if (sortField === 'status') {
        const statusA = a.status || 'Draft';
        const statusB = b.status || 'Draft';
        return sortDirection === "asc" 
          ? statusA.localeCompare(statusB)
          : statusB.localeCompare(statusA);
      }
      
      // Handle missing values
      if (a[sortField] === undefined && b[sortField] === undefined) return 0;
      if (a[sortField] === undefined) return sortDirection === "asc" ? 1 : -1;
      if (b[sortField] === undefined) return sortDirection === "asc" ? -1 : 1;
      
      let comparison = 0;
      
      // Handle different data types
      if (typeof a[sortField] === 'string' && typeof b[sortField] === 'string') {
        comparison = a[sortField].localeCompare(b[sortField]);
      } else if (typeof a[sortField] === 'number' && typeof b[sortField] === 'number') {
        comparison = a[sortField] - b[sortField];
      } else if (a[sortField] instanceof Date && b[sortField] instanceof Date) {
        comparison = a[sortField] - b[sortField];
      } else if (sortField === 'price') {
        // Handle price sorting
        const priceA = parseFloat(a.price) || 0;
        const priceB = parseFloat(b.price) || 0;
        comparison = priceA - priceB;
      } else if (sortField === 'createdAt' || sortField === 'updatedAt') {
        // Handle date sorting
        const dateA = a[sortField] ? new Date(a[sortField]) : new Date(0);
        const dateB = b[sortField] ? new Date(b[sortField]) : new Date(0);
        comparison = dateA - dateB;
      } else {
        // Try to convert to string for comparison as fallback
        comparison = String(a[sortField]).localeCompare(String(b[sortField]));
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    })
    .map((course, index) => ({
      ...course,
      no: index + 1,
      instructor: instructorNames[course.instructor_id] || "-",
      status: course.status || "Draft"
    })) : [];

  // Add a function to handle row clicks for selection
  const handleRowClick = (e, rowId) => {
    // Don't toggle selection if clicking on action buttons or checkboxes
    if (e.target.closest('button') || e.target.closest('.custom-checkbox')) {
      return;
    }
    
    // Toggle selection
    if (selectedCourses.includes(rowId)) {
      setSelectedCourses(prev => prev.filter(id => id !== rowId));
    } else {
      setSelectedCourses(prev => [...prev, rowId]);
    }
  };

  // Add function to handle batch actions
  const handleBatchAction = () => {
    if (!batchAction) {
      toast.info("Please select an action");
      return;
    }
    
    if (selectedCourses.length === 0) {
      toast.info("Please select courses to perform this action");
      return;
    }

    // Handle different batch actions
    switch (batchAction) {
      case "delete":
        handleMultipleDelete();
        break;
      case "assign_instructor":
        setAssignInstructorModal({ open: true, courseId: selectedCourses });
        break;
      case "schedule_publish":
        // For batch scheduling, we'll show modal for first course as reference
        const firstCourse = courses.find(course => course._id === selectedCourses[0]);
        setScheduleModal({ 
          open: true, 
          courseId: selectedCourses,
          courseTitle: `${selectedCourses.length} selected courses`
        });
        break;
      case "export":
        setExportModal(true);
        break;
      default:
        // Handle status changes
        const confirmAction = window.confirm(`Are you sure you want to mark ${selectedCourses.length} selected courses as "${batchAction}"?`);
        if (!confirmAction) return;
        
        const loadingToastId = toast.loading(`Updating ${selectedCourses.length} courses...`);
        
        let successCount = 0;
        let failCount = 0;
        
        const updatePromises = selectedCourses.map(id => 
          new Promise(resolve => {
            postQuery({
              url: `${apiUrls?.courses?.updateCourseStatus}/${id}`,
              postData: { status: batchAction },
              onSuccess: () => {
                successCount++;
                resolve();
              },
              onFail: (error) => {
                failCount++;
                // Try fallback if available
                tryFallbackStatusUpdate(id, batchAction, getCourseStatus(courses.find(c => c._id === id)), loadingToastId)
                  .then(() => {
                    successCount++;
                    resolve();
                  })
                  .catch(() => resolve());
              },
            });
          })
        );
        
        Promise.all(updatePromises).then(() => {
          if (successCount > 0) {
            toast.update(loadingToastId, {
              render: `Successfully updated ${successCount} courses${failCount > 0 ? `, failed to update ${failCount} courses` : ''}`,
              type: failCount > 0 ? "warning" : "success",
              isLoading: false,
              autoClose: 3000,
            });
          } else {
            toast.update(loadingToastId, {
              render: "Failed to update courses",
              type: "error",
              isLoading: false,
              autoClose: 3000,
            });
          }
          
          setBatchAction("");
          setUpdateStatus(Date.now());
        });
    }
  };

  // Add pagination handlers
  const nextPage = () => {
    if ((currentPage + 1) * pageSize < filteredData.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    setCurrentPage(0); // Reset to first page when changing page size
  };

  // Calculate pagination values
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  // Function to count active filters
  const countActiveFilters = (filters) => {
    let count = 0;
    
    if (filters.status) count++;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.priceRange.min || filters.priceRange.max) count++;
    if (filters.featured) count++;
    if (filters.enrollment.min || filters.enrollment.max) count++;
    if (filters.instructor) count++;
    if (filters.level) count++;
    if (filters.mode) count++;
    if (filters.rating.min || filters.rating.max) count++;
    if (filters.sessions.min || filters.sessions.max) count++;
    if (filters.duration.min || filters.duration.max) count++;
    if (filters.hasDiscount) count++;
    if (filters.hasCertificate) count++;
    if (filters.tags.length > 0) count++;
    
    return count;
  };

  // Update active filters count whenever filters change
  useEffect(() => {
    const count = countActiveFilters(filters);
    setActiveFilters(count);
  }, [filters]);

  // Function to reset all filters
  const resetAllFilters = () => {
    setFilters({
      status: "",
      dateRange: { start: null, end: null },
      priceRange: { min: "", max: "" },
      featured: false,
      enrollment: { min: "", max: "" },
      instructor: "",
      level: "",
      mode: "",
      rating: { min: "", max: "" },
      sessions: { min: "", max: "" },
      duration: { min: "", max: "" },
      hasDiscount: false,
      hasCertificate: false,
      tags: []
    });
    setFilterCategory("");
    setSearchQuery("");
    setAdvancedFilterModal(false);
  };

  // Define the columns configuration using useMemo
  const columns = useMemo(() => [
    {
      Header: (
        <CustomCheckbox
          checked={paginatedData.length > 0 && paginatedData.every(course => selectedCourses.includes(course._id))}
          onChange={handleSelectAll}
        />
      ),
      accessor: 'checkbox',
      render: (row) => (
        <div className="custom-checkbox">
          <CustomCheckbox
            checked={selectedCourses.includes(row._id)}
            onChange={(isChecked) => handleSelectCourse(isChecked, row._id)}
          />
        </div>
      ),
      disableSorting: true
    },
    {
      Header: (
        <div 
          className="cursor-pointer flex items-center" 
          onClick={() => handleSort('no')}
        >
          <span>No.</span>
          {sortField === 'no' && (
            <span className="ml-1">
              {sortDirection === 'asc' ? '↑' : '↓'}
            </span>
          )}
        </div>
      ),
      accessor: 'no',
      render: (row) => <span className="text-gray-500">{row.no}</span>
    },
    {
      Header: (
        <div 
          className="cursor-pointer flex items-center" 
          onClick={() => handleSort('course_title')}
        >
          <span>Title & Category</span>
          {sortField === 'course_title' && (
            <span className="ml-1">
              {sortDirection === 'asc' ? '↑' : '↓'}
            </span>
          )}
        </div>
      ),
      accessor: 'course_title',
      render: (row) => (
        <Tooltip content={`${row.course_title} - ${row.course_category || "Uncategorized"}`} position="bottom">
          <div className="flex flex-col w-[220px]">
            <div className="font-medium text-gray-900 dark:text-white truncate">{row.course_title}</div>
            <div className="text-xs text-gray-500 truncate">{row.course_category || "Uncategorized"}</div>
          </div>
        </Tooltip>
      )
    },
    {
      Header: (
        <div 
          className="cursor-pointer flex items-center" 
          onClick={() => handleSort('status')}
        >
          <span>Status</span>
          {sortField === 'status' && (
            <span className="ml-1">
              {sortDirection === 'asc' ? '↑' : '↓'}
            </span>
          )}
        </div>
      ),
      accessor: 'status',
      render: (row) => (
        <StatusToggleButton
          status={row?.status}
          onToggle={(id) => toggleStatus(id, row?.status)}
          courseId={row?._id}
        />
      )
    },
    {
      Header: (
        <div 
          className="cursor-pointer flex items-center" 
          onClick={() => handleSort('course_fee')}
        >
          <span>Price</span>
          {sortField === 'course_fee' && (
            <span className="ml-1">
              {sortDirection === 'asc' ? '↑' : '↓'}
            </span>
          )}
        </div>
      ),
      accessor: 'course_fee',
      render: (row) => (
        <div className="flex flex-col">
          {row.isFree || row.category_type === "Free" ? (
            <span className="font-medium text-green-600">Free</span>
          ) : (
            <span className="font-medium text-gray-900 dark:text-white">
              ${row.course_fee ? parseFloat(row.course_fee).toFixed(2) : "0.00"}
            </span>
          )}
        </div>
      )
    },
    {
      Header: (
        <div 
          className="cursor-pointer flex items-center" 
          onClick={() => handleSort('assigned_instructor')}
        >
          <span>Instructor</span>
          {sortField === 'assigned_instructor' && (
            <span className="ml-1">
              {sortDirection === 'asc' ? '↑' : '↓'}
            </span>
          )}
        </div>
      ),
      accessor: 'assigned_instructor',
      render: (row) => (
        <div className="flex items-center">
          <span className="text-gray-800 dark:text-gray-200">{row.instructor || "-"}</span>
          <button 
            className="ml-2 text-green-600 hover:text-green-700 rounded-full p-1 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setAssignInstructorModal({ open: true, courseId: row._id });
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
      )
    },
    {
      Header: (
        <div 
          className="cursor-pointer flex items-center" 
          onClick={() => handleSort('no_of_Sessions')}
        >
          <span>Sessions</span>
          {sortField === 'no_of_Sessions' && (
            <span className="ml-1">
              {sortDirection === 'asc' ? '↑' : '↓'}
            </span>
          )}
        </div>
      ),
      accessor: 'no_of_Sessions',
      render: (row) => (
        <span className="text-gray-800 dark:text-gray-200">{row.no_of_Sessions || 0}</span>
      )
    },
    {
      Header: (
        <div 
          className="cursor-pointer flex items-center" 
          onClick={() => handleSort('createdAt')}
        >
          <span>Created</span>
          {sortField === 'createdAt' && (
            <span className="ml-1">
              {sortDirection === 'asc' ? '↑' : '↓'}
            </span>
          )}
        </div>
      ),
      accessor: 'createdAt',
      render: (row) => (
        <span className="text-gray-800 dark:text-gray-200">
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-"}
        </span>
      )
    },
    {
      Header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex space-x-2">
          <Tooltip content="View Course">
            <button
              onClick={(e) => {
                e.stopPropagation();
                viewCourse(row._id);
              }}
              className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
            >
              <FaEye size={16} />
            </button>
          </Tooltip>
          <Tooltip content="Edit Course">
            <button
              onClick={(e) => {
                e.stopPropagation();
                editCourse(row._id);
              }}
              className="text-green-600 hover:text-green-800 p-1 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full transition-colors"
            >
              <MdEdit size={18} />
            </button>
          </Tooltip>
          <Tooltip content="Delete Course">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(row._id);
              }}
              className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
            >
              <FaTrash size={16} />
            </button>
          </Tooltip>
        </div>
      ),
      disableSorting: true
    }
  ], [paginatedData, selectedCourses, sortField, sortDirection, handleSort, handleSelectCourse, instructorNames, setAssignInstructorModal]);

  // Enhanced export function with more options
  const exportCourses = async (format = exportFormat, scope = exportScope) => {
    try {
      setExportLoading(true);
      
      // Determine which courses to export based on scope
      const dataToExport = scope === 'all' ? courses : filteredData;
      
      // Prepare the export data with comprehensive course information
      const exportData = dataToExport.map(course => {
        // Create a complete course object with all relevant data
        return {
          id: course._id,
          title: course.course_title || 'Untitled',
          category: course.course_category || 'Uncategorized',
          status: course.status || 'Unknown',
          price: course.course_fee || 0,
          isFree: course.isFree || course.category_type === "Free",
          instructor: instructorNames[course.assigned_instructor] || "Unassigned",
          instructorId: course.assigned_instructor || "",
          sessions: course.no_of_Sessions || 0,
          created: course.createdAt ? new Date(course.createdAt).toISOString() : '',
          updated: course.updatedAt ? new Date(course.updatedAt).toISOString() : '',
          description: course.course_description || '',
          image: course.course_image || '',
          duration: course.total_duration || '',
          mode: course.course_mode || '',
          level: course.course_level || '',
          featured: course.isFeatured || false,
          enrollments: course.enrollments?.length || 0,
          tags: course.tags || [],
          rating: course.rating || 0,
          reviews: course.reviews?.length || 0
        };
      });
      
      if (format === 'csv') {
        // Handle CSV export
        if (exportData.length === 0) {
          toast.error("No data available to export");
          setExportLoading(false);
          return;
        }
        
        // Get all unique keys from all objects for complete headers
        const allKeys = [...new Set(exportData.flatMap(item => Object.keys(item)))];
        
        // Create CSV content
        const headers = allKeys;
        const csvContent = [
          headers.join(','),
          ...exportData.map(row => 
            headers.map(header => {
              const value = row[header];
              // Handle different data types for CSV compatibility
              if (value === null || value === undefined) return '';
              if (typeof value === 'object') return JSON.stringify(value).replace(/"/g, '""');
              if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
              return value;
            }).join(',')
          )
        ].join('\n');
        
        // Create and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `courses-export-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
      } else if (format === 'json') {
        // Handle JSON export
        const jsonString = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `courses-export-${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
      } else if (format === 'excel') {
        // For Excel, we'll generate a CSV that Excel can open
        if (exportData.length === 0) {
          toast.error("No data available to export");
          setExportLoading(false);
          return;
        }
        
        // Get all unique keys from all objects for complete headers
        const allKeys = [...new Set(exportData.flatMap(item => Object.keys(item)))];
        
        // Create CSV content optimized for Excel
        const headers = allKeys;
        const csvContent = [
          headers.join(','),
          ...exportData.map(row => 
            headers.map(header => {
              const value = row[header];
              // Handle different data types for Excel compatibility
              if (value === null || value === undefined) return '';
              if (typeof value === 'object') return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
              if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
              return value;
            }).join(',')
          )
        ].join('\n');
        
        // Create and trigger download
        const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `courses-export-${new Date().toISOString().split('T')[0]}.xls`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      toast.success(`Successfully exported ${exportData.length} courses as ${format.toUpperCase()}`);
      
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data. Please try again.");
    } finally {
      setExportLoading(false);
      setExportModal(false);
    }
  };

  // Export modal component
  const ExportModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Export Course Data</h3>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            Choose your export preferences:
          </p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Export Format</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="format"
                  value="csv"
                  checked={exportFormat === 'csv'}
                  onChange={() => setExportFormat('csv')}
                  className="mr-2"
                />
                <span>CSV</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="format"
                  value="json"
                  checked={exportFormat === 'json'}
                  onChange={() => setExportFormat('json')}
                  className="mr-2"
                />
                <span>JSON</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="format"
                  value="excel"
                  checked={exportFormat === 'excel'}
                  onChange={() => setExportFormat('excel')}
                  className="mr-2"
                />
                <span>Excel</span>
              </label>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Data to Export</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="scope"
                  value="filtered"
                  checked={exportScope === 'filtered'}
                  onChange={() => setExportScope('filtered')}
                  className="mr-2"
                />
                <span>Current filtered data ({filteredData.length} courses)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="scope"
                  value="all"
                  checked={exportScope === 'all'}
                  onChange={() => setExportScope('all')}
                  className="mr-2"
                />
                <span>All courses ({courses.length})</span>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button 
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300"
              onClick={() => setExportModal(false)}
            >
              Cancel
            </button>
            <button 
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
              onClick={() => exportCourses(exportFormat, exportScope)}
              disabled={exportLoading}
            >
              {exportLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Exporting...
                </>
              ) : (
                <>Export</>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // After your state declaration for [exportLoading, setExportLoading]
  // Add these utility functions for improved instructor loading

  // Special debugging function to log API URLs
  const logApiEndpoints = () => {
    console.log("Available API endpoints:", {
      instructor: {
        lowercase: apiUrls.instructors?.getAllInstructors,
        uppercase: apiUrls.Instructor?.getAllInstructors,
        directPath: apiUrls?.["instructors/getAllInstructors"] || apiUrls?.["Instructor/getAllInstructors"] 
      },
      alternateStructure: {
        instructors: apiUrls?.instructors,
        Instructor: apiUrls?.Instructor
      }
    });
  };

  // Enhanced instructor loading that works across all components
  const loadInstructorsWithFallbacks = async () => {
    const loadingToastId = toast.loading("Loading instructors...");
    
    // Log API endpoints for debugging
    logApiEndpoints();
    
    try {
      // List all possible instructor API paths we might try
      const possibleEndpoints = [
        apiUrls.instructors?.getAllInstructors,
        apiUrls.Instructor?.getAllInstructors,
        `${apiUrls.baseUrl}/instructors/getAllInstructors`,
        `${apiUrls.baseUrl}/Instructor/getAllInstructors`,
        apiUrls?.["instructors/getAllInstructors"],
        apiUrls?.["Instructor/getAllInstructors"]
      ].filter(Boolean); // Remove undefined/null values
      
      console.log("Trying instructor endpoints:", possibleEndpoints);
      
      if (possibleEndpoints.length === 0) {
        console.error("No valid instructor API endpoints found!");
        throw new Error("API configuration issue: No instructor endpoints available");
      }
      
      // Try each endpoint until one works
      let success = false;
      let instructorsData = [];
      
      for (const endpoint of possibleEndpoints) {
        if (success) break;
        
        try {
          console.log(`Attempting to fetch instructors from: ${endpoint}`);
          
          const response = await new Promise((resolve, reject) => {
            getQuery({
              url: endpoint,
              onSuccess: (data) => resolve(data),
              onFail: (err) => reject(err),
            });
          });
          
          console.log("Instructor API response:", response);
          
          // Handle various response formats
          if (Array.isArray(response)) {
            instructorsData = response;
            success = true;
          } else if (response?.data && Array.isArray(response.data)) {
            instructorsData = response.data;
            success = true;
          } else if (response?.instructors && Array.isArray(response.instructors)) {
            instructorsData = response.instructors;
            success = true;
          } else if (response?.results && Array.isArray(response.results)) {
            instructorsData = response.results;
            success = true;
          }
          
          if (success) {
            console.log(`Successfully loaded ${instructorsData.length} instructors from ${endpoint}`);
          }
        } catch (err) {
          console.warn(`Endpoint ${endpoint} failed:`, err);
          // Continue to next endpoint
        }
      }
      
      if (success) {
        setInstructors(instructorsData);
        toast.update(loadingToastId, {
          render: `${instructorsData.length} instructors loaded successfully`,
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        return instructorsData;
      } else {
        // All endpoints failed
        throw new Error("All instructor API endpoints failed");
      }
    } catch (error) {
      console.error("Failed to load instructors:", error);
      toast.update(loadingToastId, {
        render: "Failed to load instructors. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      
      // Try alternative approach - direct fetch if available
      return tryDirectInstructorFetch(loadingToastId);
    }
  };

  // Direct fetch fallback as a last resort
  const tryDirectInstructorFetch = async (toastId) => {
    try {
      console.log("Attempting direct instructor fetch as fallback");
      
      // Create a fetch URL using common patterns
      const baseUrl = apiUrls.baseUrl || window.location.origin;
      const possibleUrls = [
        `${baseUrl}/api/instructors`,
        `${baseUrl}/api/Instructor`,
        `${baseUrl}/instructors`,
        `${baseUrl}/Instructor`
      ];
      
      for (const url of possibleUrls) {
        try {
          const response = await fetch(url);
          if (!response.ok) continue;
          
          const data = await response.json();
          console.log("Direct fetch response:", data);
          
          let instructorsData = [];
          if (Array.isArray(data)) {
            instructorsData = data;
          } else if (data?.data && Array.isArray(data.data)) {
            instructorsData = data.data;
          } else if (data?.instructors && Array.isArray(data.instructors)) {
            instructorsData = data.instructors;
          } else if (data?.results && Array.isArray(data.results)) {
            instructorsData = data.results;
          }
          
          if (instructorsData.length > 0) {
            setInstructors(instructorsData);
            
            toast.update(toastId, {
              render: `${instructorsData.length} instructors loaded with fallback method`,
              type: "success",
              isLoading: false,
              autoClose: 2000,
            });
            
            return instructorsData;
          }
        } catch (err) {
          console.warn(`Direct fetch to ${url} failed:`, err);
        }
      }
      
      // All attempts failed
      console.error("All instructor loading methods failed");
      toast.update(toastId, {
        render: "Could not load instructors. API might be unavailable.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      return [];
    } catch (finalError) {
      console.error("Fatal error in instructor loading:", finalError);
      return [];
    }
  };

  // Now replace the existing fetchInstructors function (around line 1129) with this improved version
  // Replace this function (it should be near line 1129 based on grep results)
  // IMPORTANT: Keep the mapping function for instructorNames at lines ~337, it's different from this one.

  // Replace this function:
  // const fetchInstructors = async () => {
  //   try {
  //     const loadingToastId = toast.loading("Loading instructors...");
  //     
  //     await getQuery({
  //       url: apiUrls?.instructors?.getAllInstructors,
  //       onSuccess: (data) => {
  //         const instructorsData = Array.isArray(data) ? data : data?.data || [];
  //         setInstructors(instructorsData);
  //         
  //         toast.update(loadingToastId, {
  //           render: `${instructorsData.length} instructors loaded`,
  //           type: "success",
  //           isLoading: false,
  //           autoClose: 1000,
  //         });
  //       },
  //       onFail: (error) => {
  //         console.error("Failed to fetch instructors:", error);
  //         toast.update(loadingToastId, {
  //           render: "Failed to load instructors",
  //           type: "error",
  //           isLoading: false,
  //           autoClose: 3000,
  //         });
  //       }
  //     });
  //   } catch (err) {
  //     console.error("Error fetching instructors:", err);
  //     toast.error("Error loading instructors. Please try again.");
  //   }
  // };

  // With this improved version:
  const fetchInstructors = async (retryCount = 0) => {
    try {
      console.log("Fetching instructors with improved method...");
      const instructorsData = await loadInstructorsWithFallbacks();
      return instructorsData;
    } catch (error) {
      console.error("Instructor fetch failed completely:", error);
      if (retryCount < 2) {
        console.log(`Retrying instructor fetch (attempt ${retryCount + 1}/3)...`);
        setTimeout(() => fetchInstructors(retryCount + 1), 2000);
      } else {
        toast.error("Failed to load instructors after multiple attempts");
      }
      return [];
    }
  };

  // Now update the AssignInstructorModal component (around line 1217) with improved loading logic:
  // Replace the existing AssignInstructorModal component with this:
  // Improve the AssignInstructorModal component (around line 1217)
  // In the AssignInstructorModal component, replace the useEffect section with this:

  // const AssignInstructorModal = () => {
  //   const [selectedInstructorId, setSelectedInstructorId] = useState("");
  //   const [loadingInstructors, setLoadingInstructors] = useState(false);
  //   const course = courses.find(c => c._id === assignInstructorModal.courseId);
  //   
  //   // Fetch instructors when modal opens if needed
  //   useEffect(() => {
  //     if (instructors.length === 0 && !loadingInstructors) {
  //       setLoadingInstructors(true);
  //       fetchInstructors().finally(() => setLoadingInstructors(false));
  //     }
  //   }, []);

  // With this:
  const AssignInstructorModal = () => {
    const [selectedInstructorId, setSelectedInstructorId] = useState("");
    const [loadingInstructors, setLoadingInstructors] = useState(false);
    const [modalInstructors, setModalInstructors] = useState([]);
    const course = courses.find(c => c._id === assignInstructorModal.courseId);
    
    // Enhanced function to load instructors specifically for the modal
    const loadInstructorsForModal = async () => {
      // If we already have instructors in the main component, use those
      if (instructors.length > 0) {
        console.log("Using pre-loaded instructors:", instructors.length);
        setModalInstructors(instructors);
        return;
      }
      
      setLoadingInstructors(true);
      try {
        console.log("Loading instructors in modal...");
        const instructorsData = await loadInstructorsWithFallbacks();
        setModalInstructors(instructorsData || []);
      } catch (error) {
        console.error("Failed to load instructors in modal:", error);
      } finally {
        setLoadingInstructors(false);
      }
    };
    
    // Load instructors when modal opens
    useEffect(() => {
      loadInstructorsForModal();
    }, []);
    
    // Debug logging
    useEffect(() => {
      console.log(`Modal has ${modalInstructors.length || 0} modal instructors and ${instructors.length || 0} global instructors available`);
    }, [modalInstructors, instructors]);
    
    
    // Display the instructor list - prefer modal instructors if available
    const displayInstructors = modalInstructors.length > 0 ? modalInstructors : instructors;

    // Keep the rest of the component as is, but update the instructor mapping to use displayInstructors:
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={(e) => e.stopPropagation()}>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Assign Instructor</h3>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            Select an instructor for course: <span className="font-medium text-green-600">{course?.course_title}</span>
          </p>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Instructor {displayInstructors.length > 0 ? `(${displayInstructors.length} available)` : ''}
            </label>
            {loadingInstructors ? (
              <div className="flex justify-center items-center h-10">
                <svg className="animate-spin h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
              <>
                {displayInstructors.length === 0 ? (
                  <div className="text-center py-4 border border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500 mb-2">No instructors found</p>
                    <button
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                      onClick={loadInstructorsForModal}
                    >
                      Refresh Instructors
                    </button>
                  </div>
                ) : (
                  <select
                    className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={selectedInstructorId}
                    onChange={(e) => setSelectedInstructorId(e.target.value)}
                  >
                    <option value="">Select an Instructor</option>
                    {displayInstructors.map(instructor => (
                      <option key={instructor._id} value={instructor._id}>
                        {instructor.full_name} {instructor.expertise ? `- ${instructor.expertise}` : ''}
                      </option>
                    ))}
                  </select>
                )}
              </>
            )}
          </div>
          
          <div className="flex justify-end space-x-3">
            <button 
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300"
              onClick={() => setAssignInstructorModal({ open: false, courseId: null })}
            >
              Cancel
            </button>
            <button 
              className={`px-4 py-2 rounded-md text-white ${
                !selectedInstructorId ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              }`}
              onClick={() => assignInstructor(assignInstructorModal.courseId, selectedInstructorId)}
              disabled={!selectedInstructorId}
            >
              Assign
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Schedule Publish Modal Component
  const SchedulePublishModal = ({ courseId, courseTitle, onClose }) => {
    const [scheduledDate, setScheduledDate] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [notifyUsers, setNotifyUsers] = useState(true);
    
    // Set default time to current time + 1 hour
    useEffect(() => {
      const now = new Date();
      now.setHours(now.getHours() + 1);
      
      // Format date as YYYY-MM-DD
      const formattedDate = now.toISOString().split('T')[0];
      setScheduledDate(formattedDate);
      
      // Format time as HH:MM
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setScheduledTime(`${hours}:${minutes}`);
    }, []);
    
    const handleSchedule = async () => {
      if (!scheduledDate || !scheduledTime) {
        toast.error("Please select both date and time");
        return;
      }
      
      // Combine date and time into ISO string
      const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
      
      // Validate that the scheduled time is in the future
      if (scheduledDateTime <= new Date()) {
        toast.error("Please select a future date and time");
        return;
      }
      
      setIsLoading(true);
      const loadingToastId = toast.loading("Scheduling course publish...");
      
      try {
        await postQuery({
          url: apiUrls?.courses?.schedulePublish,
          postData: { 
            courseId, 
            scheduledTime: scheduledDateTime.toISOString(),
            notifyUsers
          },
          onSuccess: (data) => {
            toast.update(loadingToastId, {
              render: "Course scheduled for publishing",
              type: "success",
              isLoading: false,
              autoClose: 3000,
            });
            
            // Update the scheduledCourses state
            setScheduledCourses(prev => ({
              ...prev,
              [courseId]: scheduledDateTime.toISOString()
            }));
            
            onClose();
          },
          onError: (error) => {
            toast.update(loadingToastId, {
              render: `Failed to schedule: ${error.message || "Unknown error"}`,
              type: "error",
              isLoading: false,
              autoClose: 5000,
            });
          }
        });
      } catch (err) {
        toast.update(loadingToastId, {
          render: "An error occurred while scheduling",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Schedule Course Publish</h3>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            Set when you want to publish: <span className="font-medium text-green-600">{courseTitle}</span>
          </p>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Date</label>
              <input
                type="date"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]} // Prevent past dates
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Time</label>
              <input
                type="time"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifyUsers"
                checked={notifyUsers}
                onChange={(e) => setNotifyUsers(e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="notifyUsers" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Notify enrolled users when published
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button 
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className={`px-4 py-2 rounded-md text-white ${
                isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              }`}
              onClick={handleSchedule}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Scheduling...
                </div>
              ) : (
                "Schedule Publish"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Replace the existing assignInstructor function with this industry-standard implementation
  const assignInstructor = async (courseId, instructorId) => {
    // Input validation
    if (!courseId || !instructorId) {
      toast.error("Missing required data: course ID or instructor ID");
      return;
    }
    
    const loadingToastId = toast.loading("Assigning instructor...");
    console.time("instructor-assignment"); // Performance tracking
    
    try {
      // Get the instructor details for proper payload construction
      const instructor = instructors.find(i => i._id === instructorId);
      if (!instructor) {
        console.error("Instructor not found:", { instructorId, availableInstructors: instructors.length });
        toast.update(loadingToastId, {
          render: "Selected instructor data not found",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        return;
      }
      
      // Get the course details
      const course = courses.find(c => c._id === courseId);
      if (!course) {
        console.error("Course not found:", { courseId, availableCourses: courses.length });
        toast.update(loadingToastId, {
          render: "Course data not found",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        return;
      }
      
      // Log operation for diagnostics & auditing
      console.info("Assignment operation:", {
        operation: "assign_instructor",
        courseId,
        courseTitle: course.course_title,
        instructorId,
        instructorName: instructor.full_name,
        timestamp: new Date().toISOString()
      });
      
      // Primary approach: Use the assignedInstructors.createAssignedInstructor endpoint
      // This approach is confirmed working in AssignInst.js
      const postData = {
        full_name: instructor.full_name,
        email: instructor.email,
        course_title: course.course_title,
        user_id: instructorId,
        course_id: courseId  // Add course_id for completeness
      };
      
      // Execute the assignment with proper error handling
      await postQuery({
        url: apiUrls?.assignedInstructors?.createAssignedInstructor,
        postData,
        onSuccess: (data) => {
          console.info("Assignment successful:", {
            instructorName: instructor.full_name,
            courseTitle: course.course_title
          });
          
          // Update UI state with optimistic update
          setInstructorNames(prev => ({
            ...prev,
            [courseId]: instructor.full_name
          }));
          
          // Success notification
          toast.update(loadingToastId, {
            render: `${instructor.full_name} assigned to ${course.course_title} successfully`,
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
          
          // Reset UI state and refresh data
          setAssignInstructorModal({ open: false, courseId: null });
          setUpdateStatus(Date.now());
        },
        onFail: async (error) => {
          console.error("Assignment API error:", {
            error,
            endpoint: apiUrls?.assignedInstructors?.createAssignedInstructor,
            payload: postData
          });
          
          // Try fallback approach if primary fails
          const fallbackSuccess = await tryFallbackAssignment(courseId, instructorId, instructor, course, loadingToastId);
          
          if (!fallbackSuccess) {
            toast.update(loadingToastId, {
              render: `Failed to assign instructor: ${error?.message || "Unknown error"}`,
              type: "error",
              isLoading: false,
              autoClose: 5000,
            });
          }
        }
      });
    } catch (error) {
      console.error("Assignment exception:", error);
      toast.update(loadingToastId, {
        render: "An unexpected error occurred during assignment",
        type: "error",
        isLoading: false, 
        autoClose: 4000,
      });
    } finally {
      console.timeEnd("instructor-assignment"); // Performance tracking end
    }
  };

  // Helper function to try fallback assignment methods
  const tryFallbackAssignment = async (courseId, instructorId, instructor, course, toastId) => {
    console.log("Attempting fallback assignment methods");
    
    try {
      // Fallback approach 1: Try courses.assignInstructor endpoint
      let success = await tryAssignmentEndpoint(
        apiUrls?.courses?.assignInstructor,
        { courseId, instructorId },
        "courses.assignInstructor"
      );
      
      if (success) return true;
      
      // Fallback approach 2: Try courses/${courseId}/assignInstructor endpoint
      const baseUrl = apiUrls.baseUrl || window.location.origin;
      success = await tryAssignmentEndpoint(
        `${baseUrl}/courses/${courseId}/assignInstructor`,
        { instructorId },
        "direct course endpoint"
      );
      
      if (success) return true;
      
      // Fallback approach 3: Try updateAssignedInstructor endpoint
      success = await tryAssignmentEndpoint(
        apiUrls?.assignedInstructors?.updateAssignedInstructor,
        {
          courseId,
          instructorId,
          full_name: instructor.full_name,
          email: instructor.email,
          course_title: course.course_title
        },
        "updateAssignedInstructor"
      );
      
      if (success) return true;
      
      // If all fallbacks fail, return false
      return false;
    } catch (error) {
      console.error("Fallback assignment failed:", error);
      return false;
    }
  };

  // Helper function to try a specific endpoint for assignment
  const tryAssignmentEndpoint = async (endpoint, data, endpointName) => {
    if (!endpoint) return false;
    
    try {
      console.log(`Trying ${endpointName} endpoint:`, endpoint);
      
      return new Promise(resolve => {
        postQuery({
          url: endpoint,
          postData: data,
          onSuccess: () => {
            console.log(`Assignment successful with ${endpointName} endpoint`);
            // Update UI state with optimistic update
            if (data.courseId && data.instructorId) {
              const instructor = instructors.find(i => i._id === data.instructorId);
              if (instructor) {
                setInstructorNames(prev => ({
                  ...prev,
                  [data.courseId]: instructor.full_name
                }));
              }
            }
            
            // Reset UI state and refresh data
            setAssignInstructorModal({ open: false, courseId: null });
            setUpdateStatus(Date.now());
            resolve(true);
          },
          onFail: (error) => {
            console.warn(`${endpointName} endpoint failed:`, error);
            resolve(false);
          }
        });
      });
    } catch (error) {
      console.error(`Error with ${endpointName} endpoint:`, error);
      return false;
    }
  };

  // Fallback method for status updates when the main method fails
  const tryFallbackStatusUpdate = async (courseId, newStatus, originalStatus, loadingToastId) => {
    try {
      console.log("Trying fallback status update method");
      await postQuery({
        url: `${apiUrls?.courses?.updateCourseStatus}/${courseId}`,
        postData: { status: newStatus },
        onSuccess: () => {
          // Update was successful with fallback method
          toast.update(loadingToastId, {
            render: `Course status updated to ${newStatus} (fallback method)`,
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
          
          // Update UI to reflect the change
          setCourses(prev => prev.map(course => 
            course._id === courseId 
              ? {...course, status: newStatus}
              : course
          ));
          setUpdateStatus(Date.now());
        },
        onError: (error) => {
          console.error("Fallback status update also failed:", error);
          // Keep the UI reverted to original status (already done in the main function)
        }
      });
    } catch (error) {
      console.error("Error in fallback status update:", error);
    }
  };

  // Centralized error handling function
  const handleApiError = (error, toastId) => {
    console.error("API Error:", error);
    toast.update(toastId, {
      render: "An error occurred. Please try again.",
      type: "error",
      isLoading: false,
      autoClose: 3000,
    });
  };

  // Example integration in an API call
  const fetchCourses = async () => {
    const toastId = toast.loading("Loading courses...");
    try {
      const response = await getQuery("/api/courses");
      if (!response.ok) throw new Error("Failed to fetch courses");
      const data = await response.json();
      setCoursesData(data); // Set the state with fetched data
      toast.update(toastId, {
        render: "Courses loaded successfully.",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      handleApiError(error, toastId);
    }
  };

  // Example integration in another API call
  const deleteCourse = async (courseId) => {
    const toastId = toast.loading("Deleting course...");
    try {
      const response = await deleteQuery(`/api/courses/${courseId}`);
      if (!response.ok) throw new Error("Failed to delete course");
      setCourses((prevCourses) => prevCourses.filter(course => course.id !== courseId));
      toast.update(toastId, {
        render: "Course deleted successfully.",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      handleApiError(error, toastId);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchInstructors();
  }, []);

  const onSuccess = (data) => {
    console.log("Success", data, coursesData);
    // Use coursesData here if needed
  };

  if (loading || postLoading) return <Preloader />;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-6">
      <style jsx global>{`
        .selected-row td {
          background-color: rgba(16, 185, 129, 0.08) !important;
        }
        .dark .selected-row td {
          background-color: rgba(16, 185, 129, 0.15) !important;
        }
        tr:hover td {
          background-color: rgba(0, 0, 0, 0.02);
        }
        .dark tr:hover td {
          background-color: rgba(255, 255, 255, 0.05);
        }
        .custom-checkbox {
          position: relative;
          z-index: 10;
        }
        .table-container {
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          border-radius: 0.5rem;
          overflow: hidden;
          overflow-x: auto;
        }
        .card-hover {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.08);
        }
        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
          line-height: 1;
        }
        .status-badge::before {
          content: '';
          display: inline-block;
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          margin-right: 0.375rem;
        }
        .status-published::before {
          background-color: #10B981;
        }
        .status-draft::before {
          background-color: #F59E0B;
        }
        .status-archived::before {
          background-color: #6B7280;
        }
        .status-active::before {
          background-color: #3B82F6;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        table {
          table-layout: fixed;
          min-width: 100%;
          width: auto;
        }
        th, td {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          position: relative;
        }
      `}</style>
      <div className="max-w-7xl mx-auto rounded-xl overflow-hidden">
        <header className="bg-white dark:bg-gray-800 p-6 rounded-t-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Course Management</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage, track and organize your courses</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
              {selectedCourses.length > 0 && (
                <>
                  <select
                    className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm min-w-[200px]"
                    value={batchAction}
                    onChange={(e) => setBatchAction(e.target.value)}
                  >
                    <option value="">Batch Actions ({selectedCourses.length})</option>
                    <optgroup label="Status Actions">
                      <option value="Published">Mark as Published</option>
                      <option value="Draft">Mark as Draft</option>
                      <option value="Archived">Archive Courses</option>
                      <option value="Active">Set as Active</option>
                    </optgroup>
                    <optgroup label="Other Actions">
                      <option value="assign_instructor">Assign Instructor</option>
                      <option value="schedule_publish">Schedule Publish</option>
                      <option value="export">Export Selected</option>
                      <option value="delete">Delete Selected</option>
                    </optgroup>
                  </select>
                  
                  <button
                    onClick={handleBatchAction}
                    className={`px-4 py-2.5 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 ${
                      batchAction
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                    disabled={!batchAction}
                  >
                    {batchAction === "delete" ? <FaTrash className="w-4 h-4" /> : <FaCheck className="w-4 h-4" />}
                    Apply to Selected
                  </button>
                </>
              )}
              <button
                onClick={() => router.push("/dashboards/admin-addcourse")}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg flex items-center justify-center transition-all shadow-sm hover:shadow"
              >
                <FaPlus className="mr-2 h-4 w-4" /> Add Course
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg border border-gray-100 dark:border-gray-700/50">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search courses by title, category or instructor..."
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="relative min-w-[200px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaFilter className="text-gray-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm appearance-none"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <div className="bg-white dark:bg-gray-800 p-6 border-x border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <span className="inline-block w-2 h-6 bg-green-500 rounded-sm mr-3"></span>
              Course Analytics Overview
            </h2>
            <div className="flex gap-3">
              <button 
                onClick={() => fetchCourseAnalytics()}
                className="flex items-center text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              <button 
                onClick={() => setExportModal(true)}
                className="flex items-center text-sm px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 card-hover">
              <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">Course Overview</h3>
              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Total Courses</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{analyticsData.totalCourses || 0}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Published</p>
                  <p className="text-2xl font-semibold text-green-600">{analyticsData.published || 0}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Draft</p>
                  <p className="text-2xl font-semibold text-yellow-600">{analyticsData.draft || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 card-hover">
              <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">Enrollment Stats</h3>
              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Total Enrollments</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{analyticsData.totalEnrollments || 0}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">This Month</p>
                  <p className="text-2xl font-semibold text-blue-600">{analyticsData.monthlyEnrollments || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 card-hover">
              <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">Top Categories</h3>
              {analyticsData.topCategories && analyticsData.topCategories.length > 0 ? (
                <ul className="text-sm space-y-2">
                  {analyticsData.topCategories.map((category, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">{category.name}</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(category.count / analyticsData.totalCourses) * 100}%` }}></div>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{category.count}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center justify-center h-24 text-gray-500">
                  <p>No categories available</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-b-xl border-x border-b border-gray-100 dark:border-gray-700 overflow-visible shadow-sm">
          <div className="overflow-x-auto table-container" style={{ maxWidth: '100%', position: 'relative' }}>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <CustomCheckbox
                      checked={paginatedData.length > 0 && paginatedData.every(course => selectedCourses.includes(course._id))}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleSort('no')}
                  >
                    No. {sortField === 'no' && <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleSort('course_title')}
                  >
                    Title & Category {sortField === 'course_title' && <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleSort('status')}
                  >
                    Status {sortField === 'status' && <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleSort('course_fee')}
                  >
                    Price {sortField === 'course_fee' && <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleSort('assigned_instructor')}
                  >
                    Instructor {sortField === 'assigned_instructor' && <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleSort('no_of_Sessions')}
                  >
                    Sessions {sortField === 'no_of_Sessions' && <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleSort('createdAt')}
                  >
                    Created {sortField === 'createdAt' && <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {paginatedData.map((row, rowIdx) => (
                  <tr 
                    key={rowIdx} 
                    className={`${selectedCourses.includes(row._id) ? 'selected-row' : ''} hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors`}
                    onClick={(e) => handleRowClick(e, row._id)}
                  >
                    {columns.map((column, colIdx) => (
                      <td key={colIdx} className="px-6 py-4 whitespace-nowrap overflow-visible">
                        {column.render ? column.render(row) : row[column.accessor] || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="py-4 px-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 order-2 sm:order-1">
              {`Showing ${Math.min(currentPage * pageSize + 1, filteredData.length)} to ${Math.min((currentPage + 1) * pageSize, filteredData.length)} of ${filteredData.length} courses`}
            </p>
            
            <div className="flex items-center space-x-4 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center">
                <label htmlFor="pageSize" className="text-sm text-gray-500 dark:text-gray-400 mr-2 whitespace-nowrap">
                  Show:
                </label>
                <select
                  id="pageSize"
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className={`p-2 rounded-md transition-colors ${
                    currentPage === 0
                      ? 'text-gray-400 cursor-not-allowed bg-gray-100 dark:bg-gray-700'
                      : 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded">
                  {`${currentPage + 1} / ${totalPages || 1}`}
                </span>
                
                <button
                  onClick={nextPage}
                  disabled={currentPage >= totalPages - 1}
                  className={`p-2 rounded-md transition-colors ${
                    currentPage >= totalPages - 1
                      ? 'text-gray-400 cursor-not-allowed bg-gray-100 dark:bg-gray-700'
                      : 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {filteredData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white dark:bg-gray-800 rounded-b-xl border border-t-0 border-gray-100 dark:border-gray-700">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-full p-6 mb-6">
              <svg className="w-20 h-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No courses found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
              {searchQuery || filterCategory 
                ? "Try adjusting your search or filter to find what you're looking for." 
                : "Get started by adding your first course and begin building your education platform."}
            </p>
            {!searchQuery && !filterCategory && (
              <button
                onClick={() => router.push("/dashboards/admin-addcourse")}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center transition-colors shadow-sm"
              >
                <FaPlus className="mr-2" /> Add Your First Course
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Modals */}
      {assignInstructorModal.open && <AssignInstructorModal />}
      {scheduleModal.open && (
        <SchedulePublishModal 
          courseId={scheduleModal.courseId}
          courseTitle={scheduleModal.courseTitle}
          onClose={() => setScheduleModal({ open: false, courseId: null, courseTitle: "" })}
        />
      )}
      {exportModal && <ExportModal />}
    </div>
  );
}
