"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaPlus, FaTrash, FaSearch, FaFilter, FaEye, FaCheck, FaUserTie } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import Image from "next/image";
import InstructorAssignmentModal from "@/components/shared/modals/InstructorAssignmentModal";
import Tooltip from "@/components/shared/others/Tooltip";
import Preloader from "@/components/shared/others/Preloader";
import useGetQuery from "@/hooks/getQuery.hook";
import usePostQuery from "@/hooks/postQuery.hook";
import useDeleteQuery from "@/hooks/deleteQuery.hook";
import { apiUrls } from "@/apis";
import MyTable from "@/components/shared/common-table/page";
import { 
  Plus, 
  Trash2, 
  Search, 
  Filter,
  Eye,
  Edit2,
  Users,
  Calendar,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  MoreVertical
} from "lucide-react";

// StatusToggleButton Component
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

// AssignInstructorModal Component
const AssignInstructorModal = ({ onClose, setAssignInstructorModal, courseId, courses, instructors, setInstructors, setInstructorNames, setUpdateStatus }) => {
  const [selectedInstructorId, setSelectedInstructorId] = useState("");
  const [loadingInstructors, setLoadingInstructors] = useState(false);
  const [modalInstructors, setModalInstructors] = useState([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();

  const course = courses.find(c => c._id === courseId);

  // Enhanced instructor loading with better error handling
  const loadInstructors = async () => {
    setLoadingInstructors(true);
    const loadingToastId = toast.loading("Loading instructors...");

    try {
      // First try to get instructors using the primary endpoint
      await getQuery({
        url: apiUrls?.instructors?.getAllInstructors || apiUrls?.getAllInstructors,
        onSuccess: (response) => {
          let instructorsData = [];
          
          // Handle different response formats
          if (Array.isArray(response)) {
            instructorsData = response;
          } else if (response?.data && Array.isArray(response.data)) {
            instructorsData = response.data;
          } else if (response?.instructors && Array.isArray(response.instructors)) {
            instructorsData = response.instructors;
          } else if (response?.results && Array.isArray(response.results)) {
            instructorsData = response.results;
          }

          // Validate and normalize instructor data
          const validInstructors = instructorsData
            .filter(instructor => instructor && (instructor._id || instructor.id))
            .map(instructor => ({
              _id: instructor._id || instructor.id,
              full_name: instructor.full_name || 
                        `${instructor.firstName || instructor.first_name || ''} ${instructor.lastName || instructor.last_name || ''}`.trim(),
              email: instructor.email,
              firstName: instructor.firstName || instructor.first_name,
              lastName: instructor.lastName || instructor.last_name,
              expertise: instructor.expertise,
              instructor_image: instructor.instructor_image,
              ...instructor
            }));

          if (validInstructors.length > 0) {
            console.log(`Successfully loaded ${validInstructors.length} instructors`);
            setModalInstructors(validInstructors);
            
            // Update the global instructor states
            const instructorsMap = {};
            const namesMap = {};
            validInstructors.forEach(instructor => {
              instructorsMap[instructor._id] = instructor;
              namesMap[instructor._id] = instructor.full_name;
            });
            
            setInstructors(instructorsMap);
            setInstructorNames(namesMap);
            
            toast.update(loadingToastId, {
              render: `${validInstructors.length} instructors loaded successfully`,
              type: "success",
              isLoading: false,
              autoClose: 2000,
            });
          } else {
            throw new Error("No valid instructors found in the response");
          }
        },
        onFail: (error) => {
          console.error("Failed to load instructors:", error);
          throw error;
        }
      });
    } catch (error) {
      console.error("Error in loadInstructors:", error);
      
      // Try alternative endpoint
      try {
        await getQuery({
          url: apiUrls?.Instructor?.getAllInstructors || `${apiUrls?.baseUrl}/api/instructors`,
          onSuccess: (response) => {
            const instructorsData = Array.isArray(response) ? response : response?.data || [];
            
            if (instructorsData.length > 0) {
              const validInstructors = instructorsData
                .filter(instructor => instructor && (instructor._id || instructor.id))
                .map(instructor => ({
                  _id: instructor._id || instructor.id,
                  full_name: instructor.full_name || 
                            `${instructor.firstName || instructor.first_name || ''} ${instructor.lastName || instructor.last_name || ''}`.trim(),
                  email: instructor.email,
                  firstName: instructor.firstName || instructor.first_name,
                  lastName: instructor.lastName || instructor.last_name,
                  expertise: instructor.expertise,
                  instructor_image: instructor.instructor_image,
                  ...instructor
                }));

              setModalInstructors(validInstructors);
              
              // Update global states
              const instructorsMap = {};
              const namesMap = {};
              validInstructors.forEach(instructor => {
                instructorsMap[instructor._id] = instructor;
                namesMap[instructor._id] = instructor.full_name;
              });
              
              setInstructors(instructorsMap);
              setInstructorNames(namesMap);
              
              toast.update(loadingToastId, {
                render: `${validInstructors.length} instructors loaded successfully`,
                type: "success",
                isLoading: false,
                autoClose: 2000,
              });
            } else {
              throw new Error("No instructors found");
            }
          },
          onFail: (error) => {
            throw error;
          }
        });
      } catch (fallbackError) {
        console.error("Fallback instructor loading failed:", fallbackError);
        toast.update(loadingToastId, {
          render: "Failed to load instructors. Please try again.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } finally {
      setLoadingInstructors(false);
    }
  };

  // Enhanced assignment handling
  const handleAssign = async () => {
    if (!selectedInstructorId) {
      toast.error("Please select an instructor");
      return;
    }

    setIsAssigning(true);
    const loadingToastId = toast.loading("Assigning instructor...");
    
    try {
      const instructor = modalInstructors.find(i => i._id === selectedInstructorId);
      if (!instructor) {
        throw new Error("Selected instructor not found");
      }

      await postQuery({
        url: `${apiUrls?.assignedInstructors?.createAssignedInstructor}`,
        postData: {
          instructor_id: selectedInstructorId,
          course_id: courseId,
          full_name: instructor.full_name || `${instructor.firstName} ${instructor.lastName}`,
          email: instructor.email,
          course_title: course?.course_title
        },
        onSuccess: () => {
          toast.update(loadingToastId, {
            render: "Instructor assigned successfully",
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });
          setAssignInstructorModal({ open: false, assignmentId: null });
          setUpdateStatus(Date.now());
        },
        onFail: (error) => {
          toast.update(loadingToastId, {
            render: `Failed to assign instructor: ${error?.message || "Unknown error"}`,
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        }
      });
    } catch (error) {
      toast.update(loadingToastId, {
        render: "An error occurred while assigning instructor",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      console.error("Error in handleAssign:", error);
    } finally {
      setIsAssigning(false);
    }
  };

  // Load instructors when modal opens
  useEffect(() => {
    loadInstructors();
  }, []);

  // Filter instructors based on search term
  const filteredInstructors = modalInstructors.filter(instructor => {
    const fullName = instructor.full_name || `${instructor.firstName} ${instructor.lastName}`;
    return fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           instructor.email?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setAssignInstructorModal({ open: false, assignmentId: null })}>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Assign Instructor
          </h3>
          <button
            onClick={() => setAssignInstructorModal({ open: false, assignmentId: null })}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Select an instructor for course: <span className="font-medium text-green-600">{course?.course_title}</span>
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Instructors {filteredInstructors.length > 0 ? `(${filteredInstructors.length} available)` : ''}
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
            />
          </div>

          <div className="max-h-60 overflow-y-auto">
            {loadingInstructors ? (
              <div className="flex justify-center items-center h-20">
                <svg className="animate-spin h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : filteredInstructors.length > 0 ? (
              <div className="space-y-2">
                {filteredInstructors.map(instructor => (
                  <div
                    key={instructor._id}
                    onClick={() => setSelectedInstructorId(instructor._id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedInstructorId === instructor._id
                        ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {instructor.full_name || `${instructor.firstName} ${instructor.lastName}`}
                      </span>
                      {instructor.email && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {instructor.email}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                {searchTerm ? 'No instructors found matching your search' : 'No instructors available'}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setAssignInstructorModal({ open: false, assignmentId: null })}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedInstructorId || isAssigning || loadingInstructors}
            className={`px-4 py-2 rounded-lg text-white transition-colors flex items-center ${
              !selectedInstructorId || isAssigning || loadingInstructors
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700'
            }`}
          >
            {isAssigning && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isAssigning ? 'Assigning...' : 'Assign Instructor'}
          </button>
        </div>
      </div>
    </div>
  );
};

// SchedulePublishModal Component
const SchedulePublishModal = ({ courseId, courseTitle, onClose }) => {
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notifyUsers, setNotifyUsers] = useState(true);
  const [validationError, setValidationError] = useState(null);

  // Determine if courseId is an array (batch scheduling) or single course
  const isBatchSchedule = Array.isArray(courseId);

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

  const validateSchedule = () => {
    // Reset previous validation errors
    setValidationError(null);

    // Validate date and time
    if (!scheduledDate || !scheduledTime) {
      setValidationError("Please select both date and time");
      return false;
    }

    // Combine date and time into ISO string
    const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);

    // Validate that the scheduled time is in the future
    if (scheduledDateTime <= new Date()) {
      setValidationError("Please select a future date and time");
      return false;
    }

    return true;
  };

  const handleSchedule = async () => {
    // Validate schedule first
    if (!validateSchedule()) {
      return;
    }

    // Combine date and time into ISO string
    const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);

    setIsLoading(true);
    const loadingToastId = toast.loading(
      isBatchSchedule 
        ? `Scheduling ${courseId.length} courses for publish...` 
        : "Scheduling course publish..."
    );

    try {
      // Determine the courses to schedule
      const coursesToSchedule = isBatchSchedule ? courseId : [courseId];

      // Batch schedule courses
      const schedulePromises = coursesToSchedule.map(async (id) => {
        return postQuery({
          url: apiUrls?.courses?.schedulePublish,
          postData: {
            courseId: id,
            scheduledTime: scheduledDateTime.toISOString(),
            notifyUsers
          }
        });
      });

      const results = await Promise.allSettled(schedulePromises);

      // Process results
      const successCount = results.filter(result => result.status === 'fulfilled').length;
      const failedCount = results.filter(result => result.status === 'rejected').length;

      if (successCount > 0) {
        toast.update(loadingToastId, {
          render: isBatchSchedule 
            ? `Scheduled ${successCount} out of ${coursesToSchedule.length} courses` 
            : "Course scheduled for publishing",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

        // Update scheduled courses state
        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            setScheduledCourses(prev => ({
              ...prev,
              [coursesToSchedule[index]]: scheduledDateTime.toISOString()
            }));
          }
        });

        onClose();
      }

      // Handle any failures
      if (failedCount > 0) {
        const errorMessages = results
          .filter(result => result.status === 'rejected')
          .map(result => result.reason?.message || "Unknown error");

        toast.update(loadingToastId, {
          render: `Failed to schedule ${failedCount} courses: ${errorMessages.join(', ')}`,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      }
    } catch (error) {
      toast.update(loadingToastId, {
        render: "An unexpected error occurred while scheduling",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isBatchSchedule ? "Schedule Multiple Courses" : "Schedule Course Publish"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Course Title or Count Display */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isBatchSchedule 
              ? `Scheduling ${courseId.length} selected courses` 
              : `Schedule publishing for: ${courseTitle}`}
          </p>
        </div>

        {/* Validation Error Display */}
        {validationError && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {validationError}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time
            </label>
            <input
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="notifyUsers"
              checked={notifyUsers}
              onChange={(e) => setNotifyUsers(e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="notifyUsers" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Notify enrolled users when published
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSchedule}
            disabled={isLoading || !scheduledDate || !scheduledTime}
            className={`px-4 py-2 rounded-lg text-white transition-colors flex items-center gap-2 ${
              isLoading || !scheduledDate || !scheduledTime
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Scheduling...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {isBatchSchedule ? "Schedule Selected" : "Schedule Publish"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ExportModal Component
const ExportModal = () => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportScope, setExportScope] = useState('filtered');
  const [exportLoading, setExportLoading] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl">
        <h3 className="text-xl font-semibold mb-4">Export Data</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Export Format</label>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="w-full rounded-lg border p-2"
            >
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
              <option value="json">JSON</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Export Scope</label>
            <select
              value={exportScope}
              onChange={(e) => setExportScope(e.target.value)}
              className="w-full rounded-lg border p-2"
            >
              <option value="filtered">Current Filtered Data</option>
              <option value="all">All Data</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button 
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            onClick={() => setExportModal(false)}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-white ${
              exportLoading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
            }`}
            disabled={exportLoading}
          >
            {exportLoading ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Add new ActionButtons component for better organization
const ActionButtons = ({ course, onEdit, onView, onDelete, onAssignInstructor, onSchedulePublish, onAssignInstructorToCourse }) => {
  const [showTooltip, setShowTooltip] = useState(null);

  const ActionButton = ({ onClick, icon, label, color = "gray", className = "" }) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onMouseEnter={() => setShowTooltip(label)}
      onMouseLeave={() => setShowTooltip(null)}
      className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
        color === "blue" ? "text-blue-700 bg-blue-50 hover:bg-blue-100" :
        color === "indigo" ? "text-indigo-700 bg-indigo-50 hover:bg-indigo-100" :
        color === "purple" ? "text-purple-700 bg-purple-50 hover:bg-purple-100" :
        color === "emerald" ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100" :
        color === "red" ? "text-red-700 bg-red-50 hover:bg-red-100" :
        "text-gray-700 bg-gray-50 hover:bg-gray-100"
      } ${className}`}
    >
      {icon}
      <span className="ml-1.5">{label}</span>
    </button>
  );

  // Define statuses that allow scheduling
  const schedulableStatuses = ["Draft", "Inactive", "Upcoming"];

  return (
    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
      <ActionButton
        onClick={() => onAssignInstructorToCourse(course)}
        icon={<FaUserTie className="w-4 h-4" />}
        label="Assign Instructor"
        color="purple"
      />
      
      {/* Conditionally render schedule publish button */}
      {schedulableStatuses.includes(course.status) && (
        <ActionButton
          onClick={() => onSchedulePublish(course._id, course.course_title)}
          icon={<Calendar className="w-4 h-4" />}
          label="Schedule Publish"
          color="emerald"
        />
      )}
      
      <div className="flex items-center gap-1">
        <ActionButton
          onClick={() => onView(course._id)}
          icon={<Eye className="w-4 h-4" />}
          label="View"
          color="blue"
          className="!px-2"
        />
        
        <ActionButton
          onClick={() => onEdit(course._id)}
          icon={<Edit2 className="w-4 h-4" />}
          label="Edit"
          color="indigo"
          className="!px-2"
        />
        
        <ActionButton
          onClick={() => onDelete(course._id)}
          icon={<Trash2 className="w-4 h-4" />}
          label="Delete"
          color="red"
          className="!px-2"
        />
      </div>
    </div>
  );
};

// Modify the BulkEditModal to use getQuery for fetching categories
const BulkEditModal = ({ 
  selectedCourses, 
  courses, 
  onClose, 
  onBulkUpdate 
}) => {
  const { getQuery } = useGetQuery();
  const [categories, setCategories] = useState([]);
  const [bulkEditFields, setBulkEditFields] = useState({
    course_category: "",
    category_type: "",
    course_grade: "",
    is_Certification: "",
    is_Assignments: "",
    is_Projects: "",
    is_Quizes: "",
    class_type: "",
  });

  // Fetch categories when the modal opens
  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        await getQuery({
          url: apiUrls?.categories?.getAllCategories,
          onSuccess: (data) => {
            const fetchedCategories = data.data;
            if (Array.isArray(fetchedCategories)) {
              const normalizedData = fetchedCategories.map((item) => ({
                id: item._id,
                name: item.name || item.category_name || "Unnamed Category",
                image: item.category_image || null,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
              }));
              setCategories(normalizedData);
            } else {
              setCategories([]);
              toast.error("Failed to load categories");
            }
          },
          onFail: (error) => {
            console.error("Failed to fetch categories:", error);
            // Fallback to existing course categories if API fetch fails
            const existingCategories = [...new Set(courses.map(c => c.course_category))].filter(Boolean);
            const fallbackCategories = existingCategories.map(name => ({
              id: name,
              name: name,
              image: null
            }));
            setCategories(fallbackCategories);
            toast.error("Could not fetch categories");
          },
        });
      } catch (error) {
        console.error("Error in category fetching:", error);
        toast.error("An unexpected error occurred while fetching categories");
      }
    };

    fetchAllCategories();
  }, []);

  const handleFieldChange = (field, value) => {
    setBulkEditFields(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBulkUpdate = () => {
    // Remove empty fields
    const updatePayload = Object.fromEntries(
      Object.entries(bulkEditFields).filter(([_, v]) => v !== "")
    );

    onBulkUpdate(selectedCourses, updatePayload);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl shadow-xl" 
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold mb-6">Bulk Edit Courses</h3>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Course Category</label>
            <select
              className="w-full p-3 border rounded-lg"
              value={bulkEditFields.course_category}
              onChange={(e) => handleFieldChange('course_category', e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option 
                  key={category.id} 
                  value={category.name}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category Type</label>
            <select
              className="w-full p-3 border rounded-lg"
              value={bulkEditFields.category_type}
              onChange={(e) => handleFieldChange('category_type', e.target.value)}
            >
              <option value="">Select Type</option>
              <option value="Live">Live</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Pre-Recorded">Pre-Recorded</option>
              <option value="Free">Free</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Course Grade</label>
            <select
              className="w-full p-3 border rounded-lg"
              value={bulkEditFields.course_grade}
              onChange={(e) => handleFieldChange('course_grade', e.target.value)}
            >
              <option value="">Select Grade</option>
              <option value="All Grade">All Grade</option>
              <option value="Preschool">Preschool</option>
              <option value="Grade 1-2">Grade 1-2</option>
              <option value="Grade 3-4">Grade 3-4</option>
              <option value="Grade 5-6">Grade 5-6</option>
              <option value="Grade 7-8">Grade 7-8</option>
              <option value="Grade 9-10">Grade 9-10</option>
              <option value="Grade 11-12">Grade 11-12</option>
              <option value="UG - Graduate - Professionals">UG - Graduate - Professionals</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Class Type</label>
            <select
              className="w-full p-3 border rounded-lg"
              value={bulkEditFields.class_type}
              onChange={(e) => handleFieldChange('class_type', e.target.value)}
            >
              <option value="">Select Class Type</option>
              <option value="Live Courses">Live Courses</option>
              <option value="Blended Courses">Blended Courses</option>
              <option value="Corporate Training Courses">Corporate Training Courses</option>
            </select>
          </div>

          {["is_Certification", "is_Assignments", "is_Projects", "is_Quizes"].map(field => (
            <div key={field}>
              <label className="block text-sm font-medium mb-2">
                {field.replace('is_', '').replace('_', ' ')}
              </label>
              <select
                className="w-full p-3 border rounded-lg"
                value={bulkEditFields[field]}
                onChange={(e) => handleFieldChange(field, e.target.value)}
              >
                <option value="">Select Option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleBulkUpdate}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Update Selected Courses
          </button>
        </div>
      </div>
    </div>
  );
};

// Main ListOfCourse Component
const ListOfCourse = () => {
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
    tags: [],
    course_grade: ""
  });
  const [analyticsData, setAnalyticsData] = useState({});
  const [instructors, setInstructors] = useState({}); // Store instructors in an object for quick lookup
  const [assignInstructorModal, setAssignInstructorModal] = useState({ open: false, assignmentId: null });
  const [activeActionMenu, setActiveActionMenu] = useState(null);
  const [scheduleModal, setScheduleModal] = useState({ open: false, courseId: null, courseTitle: "" });
  const [exportModal, setExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportScope, setExportScope] = useState('filtered');
  const [exportLoading, setExportLoading] = useState(false);
  const [coursesData, setCoursesData] = useState([]); // Initialize as an empty array
  const [pageLoading, setPageLoading] = useState(false);
  const [bulkEditModal, setBulkEditModal] = useState(false);
  
  // Instructor Assignment Modal State
  const [isInstructorAssignmentModalOpen, setIsInstructorAssignmentModalOpen] = useState(false);
  const [selectedCourseForAssignment, setSelectedCourseForAssignment] = useState(null);

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
  const fetchCourseAnalytics = async () => {
    try {
      // Calculate category distribution
      const categoryCount = {};
      courses.forEach(course => {
        const category = course.course_category || 'Uncategorized';
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });

      const topCategories = Object.entries(categoryCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const analytics = {
        totalCourses: courses.length,
        published: courses.filter(course => course.status === 'Published').length,
        draft: courses.filter(course => course.status === 'Draft').length,
        active: courses.filter(course => course.status === 'Active').length,
        archived: courses.filter(course => course.status === 'Archived').length,
        totalEnrollments: courses.reduce((total, course) => total + (course.enrollments || 0), 0),
        thisMonthEnrollments: courses.reduce((total, course) => {
          const thisMonth = new Date().getMonth();
          const thisYear = new Date().getFullYear();
          const enrollmentsThisMonth = (course.enrollmentHistory || []).filter(enrollment => {
            const enrollmentDate = new Date(enrollment.date);
            return enrollmentDate.getMonth() === thisMonth && enrollmentDate.getFullYear() === thisYear;
          }).length;
          return total + enrollmentsThisMonth;
        }, 0),
        topCategories
      };
      
      setCoursesData(analytics);
      setAnalyticsData(analytics);
    } catch (error) {
      console.error('Error fetching course analytics:', error);
      toast.error('Failed to load course analytics');
    }
  };

  // Call fetchCourseAnalytics when courses change and extract categories
  useEffect(() => {
    if (courses.length > 0) {
      fetchCourseAnalytics();
      
      // Extract unique categories from courses
      const uniqueCategories = [...new Set(courses.map(course => course.course_category).filter(Boolean))];
      setCategories(uniqueCategories);
    }
  }, [courses]);

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
        url: `${apiUrls.courses.toggleCourseStatus}/${id}`,
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
            
            // Immediately update the courses state with the new status
            setCourses(prev => prev.map(course => 
              course._id === id 
                ? {...course, status: updatedStatus}
                : course  
            ));
            
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
    const fetchCourses = async (retryCount = 0) => {
      try {
        await getQuery({
          url: apiUrls.courses?.getAllCourses || '/courses/get',
          onSuccess: (res) => {
            console.log("API Response:", res);
            
            // Handle the new API response format
            let courseData = [];
            if (res.success && Array.isArray(res.data)) {
              courseData = res.data;
              console.log(`Found ${res.count || courseData.length} courses in success response`);
            } else if (Array.isArray(res.data)) {
              courseData = res.data;
              console.log(`Found ${courseData.length} courses in data array`);
            } else if (Array.isArray(res)) {
              courseData = res;
              console.log(`Found ${courseData.length} courses in direct array`);
            }
            
            console.log("Sample course data:", courseData[0]);
            
            // Transform the data to match the expected format
            const transformedCourses = courseData.map((course, index) => ({
              ...course,
              no: index + 1,
              // Map assigned_instructor to instructor for backward compatibility
              instructor: course.assigned_instructor || "-",
              instructor_id: course.assigned_instructor?._id || null,
              // Ensure status has a default value
              status: course.status || "Draft",
              // Handle pricing - use the first active price or course_fee as fallback
              price: course.prices && course.prices.length > 0 
                ? course.prices.find(p => p.is_active)?.individual || course.course_fee 
                : course.course_fee,
              // Add missing fields with defaults
              course_grade: course.course_grade || "Not Set",
              no_of_Sessions: course.no_of_Sessions || course.sessions || "-",
              enrollments: course.enrollments || 0
            }));
            
            setCourses(transformedCourses);
            console.log("Transformed courses:", transformedCourses);
          },
          onFail: (err) => {
            console.error("Failed to fetch courses:", err);
            toast.error("Could not fetch courses");
          },
        });
      } catch (err) {
        console.error("Error fetching courses:", err);
        toast.error("Could not fetch courses");
      }
    };

    fetchCourses();
  }, [updateStatus]);

  const fetchInstructors = async (retryCount = 0) => {
    const loadingToastId = toast.loading("Loading instructors...");
    const maxRetries = 3;

    try {
      // Try primary instructor endpoint first
      await getQuery({
        url: apiUrls?.Instructor?.getAllInstructors,
        onSuccess: (response) => {
          const instructorsData = response?.data || [];
          
          if (Array.isArray(instructorsData) && instructorsData.length > 0) {
            // Process and normalize instructor data
            const instructorsMap = {};
            const namesMap = {};
            
            instructorsData.forEach(instructor => {
              const normalizedInstructor = {
                _id: instructor._id || instructor.id,
                full_name: instructor.full_name || 
                          `${instructor.firstName || instructor.first_name || ''} ${instructor.lastName || instructor.last_name || ''}`.trim(),
                email: instructor.email,
                expertise: instructor.expertise,
                instructor_image: instructor.instructor_image,
                status: instructor.status,
                ...instructor
              };
              
              instructorsMap[normalizedInstructor._id] = normalizedInstructor;
              namesMap[normalizedInstructor._id] = normalizedInstructor.full_name;
            });
            
            setInstructors(instructorsMap);
            setInstructorNames(namesMap);
            
            toast.update(loadingToastId, {
              render: `${instructorsData.length} instructors loaded successfully`,
              type: "success",
              isLoading: false,
              autoClose: 2000,
            });
          } else {
            throw new Error("Invalid instructor data format");
          }
        },
        onFail: async (error) => {
          console.error("Primary instructor endpoint failed:", error);
          
          // Try fallback endpoint
          if (retryCount < maxRetries) {
            await tryFallbackInstructorEndpoint(retryCount + 1, loadingToastId);
          } else {
            throw new Error("All instructor endpoints failed");
          }
        }
      });
    } catch (error) {
      console.error("Error fetching instructors:", error);
      handleInstructorFetchError(error, loadingToastId);
    }
  };

  // Add new helper functions for instructor fetching
  const tryFallbackInstructorEndpoint = async (retryCount, loadingToastId) => {
    try {
      // Try alternative endpoints in order
      const fallbackEndpoints = [
        apiUrls?.instructors?.getAllInstructors
      ].filter(Boolean);

      for (const endpoint of fallbackEndpoints) {
        try {
          await getQuery({
            url: endpoint,
            onSuccess: (response) => {
              const instructorsData = response?.data || response || [];
              
              if (Array.isArray(instructorsData) && instructorsData.length > 0) {
                const instructorsMap = {};
                const namesMap = {};
                
                instructorsData.forEach(instructor => {
                  const normalizedInstructor = {
                    _id: instructor._id || instructor.id,
                    full_name: instructor.full_name || 
                              `${instructor.firstName || instructor.first_name || ''} ${instructor.lastName || instructor.last_name || ''}`.trim(),
                    email: instructor.email,
                    expertise: instructor.expertise,
                    instructor_image: instructor.instructor_image,
                    status: instructor.status,
                    ...instructor
                  };
                  
                  instructorsMap[normalizedInstructor._id] = normalizedInstructor;
                  namesMap[normalizedInstructor._id] = normalizedInstructor.full_name;
                });
                
                setInstructors(instructorsMap);
                setInstructorNames(namesMap);
                
                toast.update(loadingToastId, {
                  render: `${instructorsData.length} instructors loaded (fallback)`,
                  type: "success",
                  isLoading: false,
                  autoClose: 2000,
                });
                
                return true; // Successfully loaded instructors
              }
            },
            onFail: (error) => {
              console.warn(`Fallback endpoint ${endpoint} failed:`, error);
              return false;
            }
          });
        } catch (error) {
          console.warn(`Error with fallback endpoint ${endpoint}:`, error);
        }
      }
      
      throw new Error("All fallback endpoints failed");
    } catch (error) {
      throw error;
    }
  };

  const handleInstructorFetchError = (error, loadingToastId) => {
    console.error("Final instructor fetch error:", error);
    
    // Update UI to show error
    toast.update(loadingToastId, {
      render: "Failed to load instructors. Please try again later.",
      type: "error",
      isLoading: false,
      autoClose: 3000,
    });
    
    // Set empty states to prevent undefined errors
    setInstructors({});
    setInstructorNames({});
  };

  // Add new useEffect hook to load instructors when component mounts
  useEffect(() => {
    fetchInstructors();
  }, []);

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
      },
      completeApiUrls: apiUrls
    });
  };

  // Enhanced instructor loading that works across all components
  const loadInstructorsWithFallbacks = async () => {
    
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
            
            // Update both instructors and instructorNames states
            const instructorsMap = {};
            const namesMap = {};
            instructorsData.forEach(instructor => {
              instructorsMap[instructor._id] = instructor;
              namesMap[instructor._id] = instructor.full_name || `${instructor.firstName} ${instructor.lastName}`;
            });
            
            setInstructors(instructorsMap);
            setInstructorNames(namesMap);
            
            toast.update(loadingToastId, {
              render: `${instructorsData.length} instructors loaded successfully`,
              type: "success",
              isLoading: false,
              autoClose: 2000,
            });
          }
        } catch (err) {
          console.warn(`Endpoint ${endpoint} failed:`, err);
          // Continue to next endpoint
        }
      }
      
      if (!success) {
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
            // Update both instructors and instructorNames states
            const instructorsMap = {};
            const namesMap = {};
            instructorsData.forEach(instructor => {
              instructorsMap[instructor._id] = instructor;
              namesMap[instructor._id] = instructor.full_name || `${instructor.firstName} ${instructor.lastName}`;
            });
            
            setInstructors(instructorsMap);
            setInstructorNames(namesMap);
            
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

  // Function to assign instructor to a course
  const assignInstructor = async (courseId, instructorId) => {
    if (!courseId || !instructorId) {
      toast.error("Missing required data: course ID or instructor ID");
      return;
    }
    
    const loadingToastId = toast.loading("Assigning instructor...");
    
    try {
      // Get the instructor details for proper payload construction
      const instructor = instructors[instructorId];
      if (!instructor) {
        console.error("Instructor not found:", { instructorId, availableInstructors: Object.keys(instructors).length });
        toast.update(loadingToastId, {
          render: "Selected instructor data not found",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        return;
      }
      
      await postQuery({
        url: apiUrls?.assignedInstructors?.createAssignedInstructor,
        postData: {
          full_name: instructor.full_name || `${instructor.firstName} ${instructor.lastName}`,
          email: instructor.email,
          course_title: courses.find(c => c._id === courseId)?.course_title,
          user_id: instructorId,
          course_id: courseId
        },
        onSuccess: () => {
          toast.update(loadingToastId, {
            render: "Instructor assigned successfully",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
          
          // Update the courses list with new instructor
          setCourses(prev => prev.map(course => 
            course._id === courseId 
              ? {...course, instructorId, instructor_name: instructor.full_name || `${instructor.firstName} ${instructor.lastName}`}
              : course
          ));
          
          // Close the modal
          setAssignInstructorModal({ open: false, assignmentId: null });
          
          // Refresh data
          setUpdateStatus(Date.now());
        },
        onFail: (error) => {
          handleApiError(error, loadingToastId, 'Failed to assign instructor');
        }
      });
    } catch (error) {
      handleApiError(error, loadingToastId, 'Failed to assign instructor');
    }
  };

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
    window.open(`/dashboards/admin-updateCourse/${id}`);
  };

  const viewCourse = (id) => {
    // Navigate to course details page
    window.open(`/course-details/${id}`);
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
      if (!course) return false;
      
      // Basic search filter
      const matchesSearch = (course.course_title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (course.course_category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (course.course_description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (course.course_grade || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (course.course_duration || '').toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory = !filterCategory || course.course_category === filterCategory;

      // Advanced filters
      const matchesStatus = !filters.status || course.status === filters.status;
      const matchesFeatured = !filters.featured || course.featured === filters.featured;
      const matchesLevel = !filters.level || course.level === filters.level;
      const matchesMode = !filters.mode || course.mode === filters.mode;
      
      // Grade filter
      const matchesGrade = !filters.course_grade || course.course_grade === filters.course_grade;
      
      // Duration filter
      const matchesDuration = (!filters.duration.min || extractDurationWeeks(course.course_duration) >= parseInt(filters.duration.min)) &&
                             (!filters.duration.max || extractDurationWeeks(course.course_duration) <= parseInt(filters.duration.max));
      
      // Price range filter - handle new pricing structure
      const coursePrice = course.price || course.course_fee || 0;
      const matchesPriceRange = (!filters.priceRange.min || (coursePrice >= parseFloat(filters.priceRange.min))) &&
                               (!filters.priceRange.max || (coursePrice <= parseFloat(filters.priceRange.max)));

      return matchesSearch && 
             matchesCategory && 
             matchesStatus && 
             matchesFeatured && 
             matchesLevel && 
             matchesMode && 
             matchesPriceRange && 
             matchesGrade &&
             matchesDuration;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      
      // Add sorting for new fields
      if (sortField === 'course_grade') {
        const gradeA = a.course_grade || '';
        const gradeB = b.course_grade || '';
        return sortDirection === "asc" 
          ? gradeA.localeCompare(gradeB)
          : gradeB.localeCompare(gradeA);
      }
      
      if (sortField === 'course_duration') {
        const durationA = extractDurationWeeks(a.course_duration) || 0;
        const durationB = extractDurationWeeks(b.course_duration) || 0;
        return sortDirection === "asc" 
          ? durationA - durationB
          : durationB - durationA;
      }
      
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
      } else if (sortField === 'price' || sortField === 'course_fee') {
        // Handle price sorting - use new pricing structure
        const priceA = parseFloat(a.price || a.course_fee) || 0;
        const priceB = parseFloat(b.price || b.course_fee) || 0;
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
      instructor: course.assigned_instructor 
        ? (typeof course.assigned_instructor === 'object' 
           ? course.assigned_instructor.full_name || course.assigned_instructor.name
           : course.assigned_instructor)
        : instructorNames[course.instructor_id] || "-",
      status: course.status || "Draft",
      course_grade: course.course_grade || "Not Set",
      course_duration: course.course_duration || "Not Set",
      // Ensure price is available for sorting and filtering
      price: course.price || course.course_fee || 0
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

  // Instructor Assignment Functions
  const handleAssignInstructorToCourse = (course) => {
    setSelectedCourseForAssignment(course);
    setIsInstructorAssignmentModalOpen(true);
  };

  const handleInstructorAssignmentModalClose = () => {
    setIsInstructorAssignmentModalOpen(false);
    setSelectedCourseForAssignment(null);
  };

  const handleInstructorAssignmentSuccess = () => {
    // Refresh the course list after successful assignment
    setUpdateStatus(Date.now());
    fetchCourseAnalytics();
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
        // For batch assignment, we'll use the existing modal but pass multiple courses
        if (selectedCourses.length === 1) {
          // Single course assignment
          const course = courses.find(c => c._id === selectedCourses[0]);
          handleAssignInstructorToCourse(course);
        } else {
          // Multiple course assignment - use the existing modal
          setAssignInstructorModal({ open: true, assignmentId: selectedCourses });
        }
        break;
      case "schedule_publish":
        // Filter courses that are in schedulable status
        const schedulableCourses = courses
          .filter(course => 
            selectedCourses.includes(course._id) && 
            ["Draft", "Inactive","Upcoming"].includes(course.status)
          )
          .map(course => course._id);

        // Check if any courses are schedulable
        if (schedulableCourses.length === 0) {
          toast.error("No selected courses are eligible for scheduling. Only Draft or Inactive courses can be scheduled.");
          return;
        }

        // If some courses are not schedulable, show a warning
        if (schedulableCourses.length < selectedCourses.length) {
          toast.warning(
            `Only ${schedulableCourses.length} out of ${selectedCourses.length} selected courses are eligible for scheduling.`,
            { autoClose: 5000 }
          );
        }

        // Open schedule modal with schedulable courses
        setScheduleModal({ 
          open: true, 
          courseId: schedulableCourses,
          courseTitle: `${schedulableCourses.length} selected courses`
        });
        break;
      case "export":
        setExportModal(true);
        break;
      case "bulk_edit":
        if (selectedCourses.length === 0) {
          toast.info("Please select courses to edit");
          return;
        }
        setBulkEditModal(true);
        break;
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
    if (filters.course_grade) count++;
    
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
      tags: [],
      course_grade: ""
    });
    setFilterCategory("");
    setSearchQuery("");
    setAdvancedFilterModal(false);
  };

  // Define the columns configuration using useMemo
  const columns = useMemo(() => [
    {
      accessor: 'checkbox',
      render: (row) => (
        <CustomCheckbox
          checked={selectedCourses.includes(row._id)}
          onChange={(checked) => handleSelectCourse(checked, row._id)}
        />
      )
    },
    { accessor: 'no' },
    {
      accessor: 'course_title',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.course_image && (
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
              <img 
                src={row.course_image} 
                alt={row.course_title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-gray-900 dark:text-white truncate">{row.course_title}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{row.course_category || 'No Category'}</span>
            {row.category_type && (
              <span className="text-xs text-blue-600 dark:text-blue-400">{row.category_type}</span>
            )}
          </div>
        </div>
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
      accessor: 'course_fee',
      render: (row) => {
        // Check if course is free
        if (row.isFree) {
          return (
            <div className="flex flex-col">
              <span className="font-medium text-green-600 dark:text-green-400">
                Free
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                No cost
              </span>
            </div>
          );
        }

        // Display pricing information from the new format
        const displayPrice = row.price || row.course_fee;
        const currency = row.prices && row.prices.length > 0 
          ? row.prices.find(p => p.is_active)?.currency || 'USD'
          : 'USD';
        
        return (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 dark:text-white">
              {typeof displayPrice === 'number' 
                ? `${currency} ${displayPrice.toLocaleString()}` 
                : displayPrice || 'Free'}
            </span>
            {row.prices && row.prices.length > 1 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {row.prices.length} currencies
              </span>
            )}
          </div>
        );
      }
    },
    {
      accessor: 'instructor',
      render: (row) => {
        const instructor = row.assigned_instructor || row.instructor;
        
        if (instructor && typeof instructor === 'object') {
          return (
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 dark:text-white">
                {instructor.full_name || instructor.name || 'Unknown'}
              </span>
              {instructor.email && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {instructor.email}
                </span>
              )}
            </div>
          );
        }
        
        return (
          <span className="text-gray-500 dark:text-gray-400">
            {instructor || 'Not Assigned'}
          </span>
        );
      }
    },
    { accessor: 'no_of_Sessions' },
    {
      accessor: 'createdAt',
      render: (row) => (
        <span className="text-gray-500 dark:text-gray-400">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      )
    },
    { accessor: 'course_grade' },
    { accessor: 'course_duration' },
    {
      accessor: 'actions',
      render: (row) => (
        <ActionButtons
          course={row}
          onEdit={editCourse}
          onView={viewCourse}
          onDelete={handleDelete}
          onAssignInstructor={(id) => setAssignInstructorModal({ open: true, courseId: id })}
          onSchedulePublish={(id, title) => setScheduleModal({ open: true, courseId: id, courseTitle: title })}
          onAssignInstructorToCourse={handleAssignInstructorToCourse}
        />
      )
    }
  ], [paginatedData, selectedCourses, sortField, sortDirection, handleSort, handleSelectCourse, instructorNames, setAssignInstructorModal]);

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
  const handleApiError = (error, toastId, customMessage = null) => {
    const errorMessage = customMessage || error?.message || "An error occurred";
    console.error("API Error:", error);
    
    toast.update(toastId, {
      render: errorMessage,
      type: "error",
      isLoading: false,
      autoClose: 4000,
    });
  };

  const onSuccess = (data) => {
    console.log("Success", data, coursesData);
    // Use coursesData here if needed
  };

  // Add a new method for bulk updating courses
  const handleBulkUpdate = async (courseIds, updateData) => {
    const loadingToastId = toast.loading(`Updating ${courseIds.length} courses...`);
    
    try {
      const updatePromises = courseIds.map(courseId => 
        postQuery({
          url: `${apiUrls?.courses?.updateCourse}/${courseId}`,
          postData: updateData,
          onFail: (error) => {
            console.error(`Failed to update course ${courseId}:`, error);
            return null;
          }
        })
      );

      const results = await Promise.allSettled(updatePromises);

      const successCount = results.filter(result => result.status === 'fulfilled').length;
      const failedCount = results.filter(result => result.status === 'rejected').length;

      if (successCount > 0) {
        toast.update(loadingToastId, {
          render: `Successfully updated ${successCount} courses${failedCount > 0 ? ` (${failedCount} failed)` : ''}`,
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

        // Refresh courses list
        setUpdateStatus(Date.now());
        setBulkEditModal(false);
      } else {
        toast.update(loadingToastId, {
          render: "Failed to update any courses",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Bulk update error:", error);
      toast.update(loadingToastId, {
        render: "An unexpected error occurred during bulk update",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  if (loading || postLoading || pageLoading) return <Preloader />;

  // Show loading state while courses are being fetched
  if (loading && courses.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Loading Courses</h3>
                <p className="text-gray-500 dark:text-gray-400">Please wait while we fetch your course data...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm min-w-[200px] text-gray-700 dark:text-gray-200"
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
                    <optgroup label="Course Actions">
                      <option value="assign_instructor">Assign Instructor</option>
                      <option value="schedule_publish">Schedule Publish</option>
                      <option value="export">Export Selected</option>
                      <option value="delete">Delete Selected</option>
                    </optgroup>
                    <optgroup label="Edit Actions">
                      <option value="bulk_edit">Bulk Edit Courses</option>
                    </optgroup>
                  </select>
                  
                  <button
                    onClick={handleBatchAction}
                    disabled={!batchAction}
                    className={`px-4 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 ${
                      batchAction
                        ? "bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {batchAction === "delete" ? (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Selected
                      </>
                    ) : batchAction === "assign_instructor" ? (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Assign Instructor
                      </>
                    ) : batchAction === "schedule_publish" ? (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Schedule Selected
                      </>
                    ) : batchAction === "export" ? (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export Selected
                      </>
                    ) : batchAction === "bulk_edit" ? (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm0 0h3m-3 3v-3m0 0h-3m3 3l3 3 3-3" />
                        </svg>
                        Bulk Edit Selected
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        Apply Action
                      </>
                    )}
                  </button>
                </div>
              )}
              <button
                onClick={() => router.push("/dashboards/admin-addcourse")}
                className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg flex items-center justify-center transition-all shadow-sm hover:shadow"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Course
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg border border-gray-100 dark:border-gray-700/50">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400" />
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
                  <Filter className="w-4 h-4 text-gray-400" />
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
                  <ChevronDown className="w-4 h-4 text-gray-400" />
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
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <button 
                onClick={() => setExportModal(true)}
                className="flex items-center text-sm px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
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
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{coursesData.totalCourses || 0}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Published</p>
                  <p className="text-2xl font-semibold text-green-600">{coursesData.published || 0}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Draft</p>
                  <p className="text-2xl font-semibold text-yellow-600">{coursesData.draft || 0}</p>
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
                    Course Details {sortField === 'course_title' && <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
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
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleSort('course_grade')}
                  >
                    Grade Level {sortField === 'course_grade' && <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleSort('course_duration')}
                  >
                    Duration {sortField === 'course_duration' && <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
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
                  <ChevronLeft className="w-5 h-5" />
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
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {filteredData.length === 0 && courses.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white dark:bg-gray-800 rounded-b-xl border border-t-0 border-gray-100 dark:border-gray-700">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-full p-6 mb-6">
              <MoreVertical className="w-20 h-20 text-gray-400" />
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
                <Plus className="w-5 h-5 mr-2" /> Add Your First Course
              </button>
            )}
          </div>
        )}
        
        {filteredData.length === 0 && courses.length > 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white dark:bg-gray-800 rounded-b-xl border border-t-0 border-gray-100 dark:border-gray-700">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-full p-6 mb-6">
              <Search className="w-20 h-20 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No matching courses</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
              No courses match your current search criteria. Try adjusting your filters or search terms.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterCategory('');
                resetAllFilters();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center transition-colors shadow-sm"
            >
              <RefreshCw className="w-5 h-5 mr-2" /> Clear All Filters
            </button>
          </div>
        )}
      </div>
      
      {/* Modals */}
      {assignInstructorModal.open && (
        <AssignInstructorModal
          onClose={() => setAssignInstructorModal({ open: false, assignmentId: null })}
          setAssignInstructorModal={setAssignInstructorModal}
          courseId={assignInstructorModal.courseId}
          courses={courses}
          instructors={instructors}
          setInstructors={setInstructors}
          setInstructorNames={setInstructorNames}
          setUpdateStatus={setUpdateStatus}
        />
      )}
      {scheduleModal.open && (
        <SchedulePublishModal 
          courseId={scheduleModal.courseId}
          courseTitle={scheduleModal.courseTitle}
          onClose={() => setScheduleModal({ open: false, courseId: null, courseTitle: "" })}
        />
      )}
      {exportModal && <ExportModal />}
      {bulkEditModal && (
        <BulkEditModal
          selectedCourses={selectedCourses}
          courses={courses}
          onClose={() => setBulkEditModal(false)}
          onBulkUpdate={handleBulkUpdate}
        />
      )}
      
      {/* Instructor Assignment Modal */}
      <InstructorAssignmentModal
        isOpen={isInstructorAssignmentModalOpen}
        onClose={handleInstructorAssignmentModalClose}
        onSuccess={handleInstructorAssignmentSuccess}
        type="course"
        targetData={selectedCourseForAssignment}
        title="Assign Instructor to Course"
      />
    </div>
  );
}

// Add helper function to extract weeks from duration string
const extractDurationWeeks = (duration) => {
  if (!duration) return 0;
  const matches = duration.match(/(\d+)\s*(week|month|day|hour)/i);
  if (!matches) return 0;

  const [_, value, unit] = matches;
  const numValue = parseInt(value);

  switch (unit.toLowerCase()) {
    case 'month': return numValue * 4;
    case 'week': return numValue;
    case 'day': return Math.ceil(numValue / 7);
    case 'hour': return Math.ceil(numValue / (7 * 24));
    default: return numValue;
  }
};

export default ListOfCourse;
