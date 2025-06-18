"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
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
  MoreVertical,
  UserPlus
} from "lucide-react";
import Image from "next/image";

// API and Types
import { 
  ICourse,
  ICourseQueryParams,
  ICollaborativeResponse,
  TNewCourse,
  ILegacyCourse,
  ICourseUpdateInput
} from "@/apis/courses";
import { 
  IInstructorCourseAssignment,
  IInstructorCourseAssignmentInput,
  ICurrency
} from "@/apis";
import { apiUrls } from "@/apis";

// Hooks
import useGetQuery from "@/hooks/getQuery.hook";
import usePostQuery from "@/hooks/postQuery.hook";
import useDeleteQuery from "@/hooks/deleteQuery.hook";

// Components
import InstructorAssignmentModal from "@/components/shared/modals/InstructorAssignmentModal";
import Tooltip from "@/components/shared/others/Tooltip";
import Preloader from "@/components/shared/others/Preloader";
import MyTable from "@/components/shared/common-table/page";

// Types
interface IExtendedCourse {
  _id: string;
  no?: number;
  course_title?: string;
  course_category?: string;
  course_description?: string;
  course_image?: string;
  course_fee?: number;
  course_duration?: string;
  course_grade?: string;
  no_of_Sessions?: number;
  instructor?: string | { _id: string; full_name: string; email: string };
  instructor_id?: string;
  status: 'Draft' | 'Published' | 'Archived' | 'Active';
  price?: number;
  enrollments?: number;
  assigned_instructor?: {
    _id: string;
    full_name: string;
    email: string;
  };
  createdAt?: string;
  updatedAt?: string;
  // Additional properties from both new and legacy courses
  course_type?: 'blended' | 'live' | 'free';
  category_type?: 'Paid' | 'Live' | 'Free';
  class_type?: string;
  is_Certification?: 'Yes' | 'No';
  is_Assignments?: 'Yes' | 'No';
  is_Projects?: 'Yes' | 'No';
  is_Quizes?: 'Yes' | 'No';
  isFree?: boolean;
  prices?: Array<{
    currency: string;
    individual: number;
    batch: number;
    is_active: boolean;
  }>;
}

interface IInstructor {
  _id: string;
  full_name: string;
  email: string;
  firstName?: string;
  lastName?: string;
  expertise?: string[];
  instructor_image?: string;
  status?: string;
}

interface IAnalyticsData {
  totalCourses: number;
  published: number;
  draft: number;
  active: number;
  archived: number;
  totalEnrollments: number;
  thisMonthEnrollments: number;
  topCategories: Array<{ name: string; count: number }>;
}

interface IFilters {
  status: string;
  dateRange: { start: string | null; end: string | null };
  priceRange: { min: string; max: string };
  featured: boolean;
  enrollment: { min: string; max: string };
  instructor: string;
  level: string;
  mode: string;
  rating: { min: string; max: string };
  sessions: { min: string; max: string };
  duration: { min: string; max: string };
  hasDiscount: boolean;
  hasCertificate: boolean;
  tags: string[];
  course_grade: string;
}

interface IScheduleModal {
  open: boolean;
  courseId: string | string[] | null;
  courseTitle: string;
}

interface IAssignInstructorModal {
  open: boolean;
  assignmentId: string | string[] | null;
}

// Status transition rules
const STATUS_TRANSITIONS: Record<string, string[]> = {
  "Draft": ["Published", "Archived"],
  "Published": ["Active", "Archived"],
  "Active": ["Published", "Archived"],
  "Archived": ["Draft"]
};

// Utility function to extract duration in weeks from course duration string
const extractDurationWeeks = (duration?: string): number => {
  if (!duration) return 0;
  
  const durationStr = duration.toLowerCase();
  
  // Extract numbers from the string
  const numbers = durationStr.match(/\d+/g);
  if (!numbers || numbers.length === 0) return 0;
  
  const value = parseInt(numbers[0]);
  
  // Convert to weeks based on unit
  if (durationStr.includes('week')) {
    return value;
  } else if (durationStr.includes('month')) {
    return value * 4; // Approximate weeks in a month
  } else if (durationStr.includes('day')) {
    return Math.ceil(value / 7); // Convert days to weeks
  } else if (durationStr.includes('hour')) {
    return Math.ceil(value / (7 * 24)); // Convert hours to weeks
  } else if (durationStr.includes('year')) {
    return value * 52; // Weeks in a year
  }
  
  // Default: assume the number represents weeks
  return value;
};

// Component Props Interfaces
interface IStatusToggleButtonProps {
  status: string;
  onToggle: (courseId: string) => Promise<void>;
  courseId: string;
}

interface ICustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

interface IActionButtonsProps {
  course: IExtendedCourse;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onAssignInstructor: (id: string) => void;
  onSchedulePublish: (id: string, title: string) => void;
  onAssignInstructorToCourse: (course: IExtendedCourse) => void;
}

interface IStatusDropdownProps {
  courseId: string;
  currentStatus: string;
  onStatusChange: (courseId: string, newStatus: string) => Promise<void>;
}

interface IAssignInstructorModalProps {
  onClose: () => void;
  setAssignInstructorModal: React.Dispatch<React.SetStateAction<IAssignInstructorModal>>;
  courseId: string | string[];
  courses: IExtendedCourse[];
  instructors: Record<string, IInstructor>;
  setInstructors: React.Dispatch<React.SetStateAction<Record<string, IInstructor>>>;
  setInstructorNames: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setUpdateStatus: React.Dispatch<React.SetStateAction<number | null>>;
}

interface ISchedulePublishModalProps {
  courseId: string | string[];
  courseTitle: string;
  onClose: () => void;
}

interface IBulkEditModalProps {
  selectedCourses: string[];
  courses: IExtendedCourse[];
  onClose: () => void;
  onBulkUpdate: (courseIds: string[], updateData: Partial<ICourseUpdateInput>) => Promise<void>;
}

interface IExportModalProps {
  selectedCourses: string[];
  courses: IExtendedCourse[];
  onClose: () => void;
}

// Custom Checkbox Component
const CustomCheckbox: React.FC<ICustomCheckboxProps> = ({ 
  checked, 
  onChange, 
  disabled = false 
}) => {
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

// Status Toggle Button Component
const StatusToggleButton: React.FC<IStatusToggleButtonProps> = ({ 
  status, 
  onToggle, 
  courseId 
}) => {
  const [isToggling, setIsToggling] = useState(false);
  const isPublished = status === "Published";

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isToggling) return;

    setIsToggling(true);
    try {
      await onToggle(courseId);
    } finally {
      setTimeout(() => setIsToggling(false), 500);
    }
  };

  const getStatusColor = (currentStatus: string): string => {
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

  const getToggleColor = (currentStatus: string): string => {
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
          title="Click to toggle course status"
        >
          <span
            className={`${
              isPublished ? 'translate-x-6' : 'translate-x-1'
            } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ease-in-out shadow-sm`}
          />
        </button>
      </div>
      <span className={`text-sm font-medium ${getStatusColor(status)}`}>
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

// Action Buttons Component
const ActionButtons: React.FC<IActionButtonsProps> = ({ 
  course, 
  onEdit, 
  onView, 
  onDelete, 
  onAssignInstructor, 
  onSchedulePublish, 
  onAssignInstructorToCourse 
}) => {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const ActionButton: React.FC<{
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    color?: string;
    className?: string;
  }> = ({ onClick, icon, label, color = "gray", className = "" }) => (
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
        icon={<UserPlus className="w-4 h-4" />}
        label="Assign Instructor"
        color="purple"
      />
      
      {/* Conditionally render schedule publish button */}
      {schedulableStatuses.includes(course.status) && (
        <ActionButton
          onClick={() => onSchedulePublish(course._id, course.course_title || 'Untitled Course')}
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

// Status Dropdown Component
const StatusDropdown: React.FC<IStatusDropdownProps> = ({ 
  courseId, 
  currentStatus, 
  onStatusChange 
}) => {
  const allowedTransitions = STATUS_TRANSITIONS[currentStatus] || [];
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleStatusChangeWithLoading = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    if (newStatus === currentStatus) return;
    
    setIsUpdating(true);
    
    try {
      await onStatusChange(courseId, newStatus);
    } finally {
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
        }`}>
          {currentStatus} {isUpdating && '(Updating...)'}
        </option>
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

// Assign Instructor Modal Component
const AssignInstructorModal: React.FC<IAssignInstructorModalProps> = ({ 
  onClose, 
  setAssignInstructorModal, 
  courseId, 
  courses, 
  instructors, 
  setInstructors, 
  setInstructorNames, 
  setUpdateStatus 
}) => {
  const [selectedInstructorId, setSelectedInstructorId] = useState<string>("");
  const [loadingInstructors, setLoadingInstructors] = useState(false);
  const [modalInstructors, setModalInstructors] = useState<IInstructor[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();

  const course = Array.isArray(courseId) 
    ? courses.find(c => c._id === courseId[0])
    : courses.find(c => c._id === courseId);

  // Enhanced instructor loading with better error handling
  const loadInstructors = useCallback(async () => {
    setLoadingInstructors(true);
    const loadingToastId = toast.loading("Loading instructors...");

    try {
      await getQuery({
        url: apiUrls?.Instructor?.getAllInstructors || '/instructors',
        onSuccess: (response: any) => {
          let instructorsData: IInstructor[] = [];
          
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
            .filter((instructor): instructor is IInstructor => 
              instructor && (instructor._id || (instructor as any).id)
            )
            .map((instructor): IInstructor => ({
              _id: instructor._id || (instructor as any).id,
              full_name: instructor.full_name || 
                        `${instructor.firstName || (instructor as any).first_name || ''} ${instructor.lastName || (instructor as any).last_name || ''}`.trim(),
              email: instructor.email || '',
              firstName: instructor.firstName || (instructor as any).first_name,
              lastName: instructor.lastName || (instructor as any).last_name,
              expertise: instructor.expertise,
              instructor_image: instructor.instructor_image
            }));

          if (validInstructors.length > 0) {
            console.log(`Successfully loaded ${validInstructors.length} instructors`);
            setModalInstructors(validInstructors);
            
            // Update the global instructor states
            const instructorsMap: Record<string, IInstructor> = {};
            const namesMap: Record<string, string> = {};
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
        onFail: (error: any) => {
          console.error("Failed to load instructors:", error);
          throw error;
        }
      });
    } catch (error) {
      console.error("Error in loadInstructors:", error);
      
      toast.update(loadingToastId, {
        render: "Failed to load instructors. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setLoadingInstructors(false);
    }
  }, [getQuery, setInstructors, setInstructorNames]);

  // Enhanced assignment handling
  const handleAssign = useCallback(async () => {
    if (!selectedInstructorId) {
      showToast.error("Please select an instructor");
      return;
    }

    setIsAssigning(true);
    const loadingToastId = toast.loading("Assigning instructor...");
    
    try {
      const instructor = modalInstructors.find(i => i._id === selectedInstructorId);
      if (!instructor) {
        throw new Error("Selected instructor not found");
      }

      const assignmentData: IInstructorCourseAssignmentInput = {
        user_id: selectedInstructorId,
        course_title: course?.course_title || 'Unknown Course',
        full_name: instructor.full_name,
        email: instructor.email
      };

      await postQuery({
        url: '/assigned-instructors',
        postData: assignmentData,
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
        onFail: (error: any) => {
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
  }, [selectedInstructorId, modalInstructors, course, postQuery, setAssignInstructorModal, setUpdateStatus]);

  // Load instructors when modal opens
  useEffect(() => {
    loadInstructors();
  }, [loadInstructors]);

  // Filter instructors based on search term
  const filteredInstructors = useMemo(() => {
    return modalInstructors.filter(instructor => {
      const fullName = instructor.full_name || `${instructor.firstName} ${instructor.lastName}`;
      return fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             instructor.email?.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [modalInstructors, searchTerm]);

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

// Schedule Publish Modal Component
const SchedulePublishModal: React.FC<ISchedulePublishModalProps> = ({ 
  courseId, 
  courseTitle, 
  onClose 
}) => {
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notifyUsers, setNotifyUsers] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { postQuery } = usePostQuery();

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

  const validateSchedule = useCallback((): boolean => {
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
  }, [scheduledDate, scheduledTime]);

  const handleSchedule = useCallback(async () => {
    // Validate schedule first
    if (!validateSchedule()) {
      return;
    }

    // Combine date and time into ISO string
    const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);

    setIsLoading(true);
    const loadingToastId = toast.loading(
      isBatchSchedule 
        ? `Scheduling ${Array.isArray(courseId) ? courseId.length : 1} courses for publish...` 
        : "Scheduling course publish..."
    );

    try {
      // Determine the courses to schedule
      const coursesToSchedule = isBatchSchedule ? courseId as string[] : [courseId as string];

      // Batch schedule courses
      const schedulePromises = coursesToSchedule.map(async (id) => {
        return postQuery({
          url: '/courses/schedule-publish',
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

        onClose();
      }

      // Handle any failures
      if (failedCount > 0) {
        const errorMessages = results
          .filter(result => result.status === 'rejected')
          .map(result => (result as PromiseRejectedResult).reason?.message || "Unknown error");

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
  }, [validateSchedule, scheduledDate, scheduledTime, isBatchSchedule, courseId, notifyUsers, postQuery, onClose]);

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
              ? `Scheduling ${Array.isArray(courseId) ? courseId.length : 1} selected courses` 
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

// Bulk Edit Modal Component
const BulkEditModal: React.FC<IBulkEditModalProps> = ({ 
  selectedCourses, 
  courses, 
  onClose, 
  onBulkUpdate 
}) => {
  const [updateData, setUpdateData] = useState<Partial<ICourseUpdateInput>>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const { getQuery } = useGetQuery();

  // Fetch categories when modal opens
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        await getQuery({
          url: '/categories',
          onSuccess: (response: any) => {
            const categories = response?.data || response?.categories || [];
            setAvailableCategories(categories.map((cat: any) => cat.name || cat.category_name || cat));
          },
          onFail: () => {
            // Fallback to existing categories from courses
            const existingCategories = [...new Set(courses.map(c => c.course_category).filter(Boolean))];
            setAvailableCategories(existingCategories as string[]);
          }
        });
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [getQuery, courses]);

  const handleUpdate = async () => {
    if (Object.keys(updateData).length === 0) {
      showToast.error("Please select at least one field to update");
      return;
    }

    setIsUpdating(true);
    try {
      await onBulkUpdate(selectedCourses, updateData);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    setUpdateData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Bulk Edit Courses ({selectedCourses.length} selected)
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

        <div className="space-y-6">
          {/* Status Update */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={updateData.status || ''}
              onChange={(e) => handleFieldChange('status', e.target.value || undefined)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Don't change</option>
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Active">Active</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          {/* Category Update */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={updateData.course_category || ''}
              onChange={(e) => handleFieldChange('course_category', e.target.value || undefined)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Don't change</option>
              {availableCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Grade Update */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Course Grade
            </label>
            <select
              value={updateData.course_grade || ''}
              onChange={(e) => handleFieldChange('course_grade', e.target.value || undefined)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Don't change</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="All Levels">All Levels</option>
            </select>
          </div>

          {/* Certification Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="certification"
              checked={updateData.is_certification === true}
              onChange={(e) => handleFieldChange('is_certification', e.target.checked ? true : undefined)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="certification" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Enable Certification
            </label>
          </div>

          {/* Assignments Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="assignments"
              checked={updateData.is_assignments === true}
              onChange={(e) => handleFieldChange('is_assignments', e.target.checked ? true : undefined)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="assignments" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Enable Assignments
            </label>
          </div>

          {/* Projects Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="projects"
              checked={updateData.is_projects === true}
              onChange={(e) => handleFieldChange('is_projects', e.target.checked ? true : undefined)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="projects" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Enable Projects
            </label>
          </div>

          {/* Quizzes Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="quizzes"
              checked={updateData.is_quizzes === true}
              onChange={(e) => handleFieldChange('is_quizzes', e.target.checked ? true : undefined)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="quizzes" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Enable Quizzes
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={isUpdating || Object.keys(updateData).length === 0}
            className={`px-4 py-2 rounded-lg text-white transition-colors flex items-center gap-2 ${
              isUpdating || Object.keys(updateData).length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700'
            }`}
          >
            {isUpdating ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Update Courses
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Export Modal Component
const ExportModal: React.FC<IExportModalProps> = ({ 
  selectedCourses, 
  courses, 
  onClose 
}) => {
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel' | 'json'>('csv');
  const [exportScope, setExportScope] = useState<'selected' | 'all' | 'filtered'>('selected');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      let dataToExport: IExtendedCourse[] = [];
      
      switch (exportScope) {
        case 'selected':
          dataToExport = courses.filter(course => selectedCourses.includes(course._id));
          break;
        case 'all':
          dataToExport = courses;
          break;
        case 'filtered':
          // This would need to be passed from parent component
          dataToExport = courses;
          break;
      }

      // Prepare export data
      const exportData = dataToExport.map(course => ({
        'Course ID': course._id,
        'Course Title': course.course_title || '',
        'Category': course.course_category || '',
        'Grade': course.course_grade || '',
        'Duration': course.course_duration || '',
        'Price': course.price || course.course_fee || 0,
        'Status': course.status || 'Draft',
        'Instructor': course.instructor || '',
        'Enrollments': course.enrollments || 0,
        'Created At': course.createdAt || '',
        'Updated At': course.updatedAt || ''
      }));

      if (exportFormat === 'csv') {
        // Convert to CSV
        const headers = Object.keys(exportData[0] || {});
        const csvContent = [
          headers.join(','),
          ...exportData.map(row => 
            headers.map(header => `"${String(row[header as keyof typeof row]).replace(/"/g, '""')}"`).join(',')
          )
        ].join('\n');

        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `courses_export_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
      } else if (exportFormat === 'json') {
        // Download JSON
        const jsonContent = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `courses_export_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
      }

      showToast.success(`Successfully exported ${dataToExport.length} courses`);
      onClose();
    } catch (error) {
      console.error('Export error:', error);
      showToast.error('Failed to export courses');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Export Courses
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

        <div className="space-y-4">
          {/* Export Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Export Format
            </label>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as 'csv' | 'excel' | 'json')}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
          </div>

          {/* Export Scope */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Export Scope
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="selected"
                  checked={exportScope === 'selected'}
                  onChange={(e) => setExportScope(e.target.value as 'selected' | 'all' | 'filtered')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Selected courses ({selectedCourses.length})
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="all"
                  checked={exportScope === 'all'}
                  onChange={(e) => setExportScope(e.target.value as 'selected' | 'all' | 'filtered')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  All courses ({courses.length})
                </span>
              </label>
            </div>
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
            onClick={handleExport}
            disabled={isExporting || (exportScope === 'selected' && selectedCourses.length === 0)}
            className={`px-4 py-2 rounded-lg text-white transition-colors flex items-center gap-2 ${
              isExporting || (exportScope === 'selected' && selectedCourses.length === 0)
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700'
            }`}
          >
            {isExporting ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Export
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main ListOfCourse Component
const ListOfCourse: React.FC = () => {
  const router = useRouter();
  const { deleteQuery } = useDeleteQuery();
  const { postQuery, loading: postLoading } = usePostQuery();
  const { getQuery, loading } = useGetQuery();

  // State Management
  const [courses, setCourses] = useState<IExtendedCourse[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [instructorNames, setInstructorNames] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [updateStatus, setUpdateStatus] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [sortField, setSortField] = useState("updatedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [batchAction, setBatchAction] = useState("");
  const [filters, setFilters] = useState<IFilters>({
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
  const [analyticsData, setAnalyticsData] = useState<IAnalyticsData>({
    totalCourses: 0,
    published: 0,
    draft: 0,
    active: 0,
    archived: 0,
    totalEnrollments: 0,
    thisMonthEnrollments: 0,
    topCategories: []
  });
  const [instructors, setInstructors] = useState<Record<string, IInstructor>>({});
  const [assignInstructorModal, setAssignInstructorModal] = useState<IAssignInstructorModal>({ 
    open: false, 
    assignmentId: null 
  });
  const [scheduleModal, setScheduleModal] = useState<IScheduleModal>({ 
    open: false, 
    courseId: null, 
    courseTitle: "" 
  });
  const [exportModal, setExportModal] = useState(false);
  const [bulkEditModal, setBulkEditModal] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  
  // Instructor Assignment Modal State
  const [isInstructorAssignmentModalOpen, setIsInstructorAssignmentModalOpen] = useState(false);
  const [selectedCourseForAssignment, setSelectedCourseForAssignment] = useState<IExtendedCourse | null>(null);

  // Fetch courses with improved error handling and type safety
  const fetchCourses = useCallback(async () => {
    try {
      await getQuery({
        url: apiUrls.courses?.getAllCourses || '/courses',
        onSuccess: (res: ICollaborativeResponse<IExtendedCourse[]>) => {
          console.log("API Response:", res);
          
          let courseData: IExtendedCourse[] = [];
          if (res.success && Array.isArray(res.data)) {
            courseData = res.data;
            console.log(`Found ${courseData.length} courses in success response`);
          } else if (Array.isArray(res.data)) {
            courseData = res.data;
            console.log(`Found ${courseData.length} courses in data array`);
          } else if (Array.isArray(res)) {
            courseData = res as unknown as IExtendedCourse[];
            console.log(`Found ${courseData.length} courses in direct array`);
          }
          
          // Transform the data to match the expected format
          const transformedCourses: IExtendedCourse[] = courseData.map((course, index) => ({
            ...course,
            no: index + 1,
            instructor: course.assigned_instructor 
              ? (typeof course.assigned_instructor === 'object' 
                 ? course.assigned_instructor.full_name || course.assigned_instructor.email
                 : course.assigned_instructor)
              : instructorNames[course.instructor_id || ''] || "-",
            status: course.status || "Draft",
            course_grade: course.course_grade || "Not Set",
            course_duration: course.course_duration || "Not Set",
            price: course.price || course.course_fee || 0,
            enrollments: course.enrollments || 0
          }));
          
          setCourses(transformedCourses);
          console.log("Transformed courses:", transformedCourses);
        },
        onFail: (err: any) => {
          console.error("Failed to fetch courses:", err);
          showToast.error("Could not fetch courses");
        },
      });
    } catch (err) {
      console.error("Error fetching courses:", err);
      showToast.error("Could not fetch courses");
    }
  }, [getQuery, instructorNames]);

  // Fetch instructors
  const fetchInstructors = useCallback(async () => {
    try {
      await getQuery({
        url: apiUrls?.Instructor?.getAllInstructors || '/instructors',
        onSuccess: (response: any) => {
          const instructorsData = response?.data || [];
          
          if (Array.isArray(instructorsData) && instructorsData.length > 0) {
            const instructorsMap: Record<string, IInstructor> = {};
            const namesMap: Record<string, string> = {};
            
            instructorsData.forEach((instructor: any) => {
              const normalizedInstructor: IInstructor = {
                _id: instructor._id || instructor.id,
                full_name: instructor.full_name || 
                          `${instructor.firstName || instructor.first_name || ''} ${instructor.lastName || instructor.last_name || ''}`.trim(),
                email: instructor.email,
                expertise: instructor.expertise,
                instructor_image: instructor.instructor_image,
                status: instructor.status,
                firstName: instructor.firstName,
                lastName: instructor.lastName
              };
              
              instructorsMap[normalizedInstructor._id] = normalizedInstructor;
              namesMap[normalizedInstructor._id] = normalizedInstructor.full_name;
            });
            
            setInstructors(instructorsMap);
            setInstructorNames(namesMap);
          }
        },
        onFail: (error: any) => {
          console.error("Failed to load instructors:", error);
          setInstructors({});
          setInstructorNames({});
        }
      });
    } catch (error) {
      console.error("Error fetching instructors:", error);
    }
  }, [getQuery]);

  // Generate analytics data
  const generateAnalyticsData = useCallback(() => {
    if (!courses || courses.length === 0) {
      return {
        totalCourses: 0,
        published: 0,
        draft: 0,
        active: 0,
        archived: 0,
        totalEnrollments: 0,
        thisMonthEnrollments: 0,
        topCategories: []
      };
    }

    try {
      const published = courses.filter(c => c.status === "Published").length;
      const draft = courses.filter(c => c.status === "Draft").length;
      const active = courses.filter(c => c.status === "Active").length;
      const archived = courses.filter(c => c.status === "Archived").length;
      
      const totalEnrollments = courses.reduce((total, course) => 
        total + (course.enrollments || 0), 0);
      
      // Calculate this month's enrollments (simplified)
      const thisMonthEnrollments = Math.floor(totalEnrollments * 0.1); // Placeholder
      
      // Calculate top categories
      const categoryCounts: Record<string, number> = {};
      courses.forEach(course => {
        const category = course.course_category || 'Uncategorized';
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });
      
      const topCategories = Object.entries(categoryCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      
      return {
        totalCourses: courses.length,
        published,
        draft,
        active,
        archived,
        totalEnrollments,
        thisMonthEnrollments,
        topCategories
      };
    } catch (error) {
      console.error("Error generating analytics:", error);
      return {
        totalCourses: 0,
        published: 0,
        draft: 0,
        active: 0,
        archived: 0,
        totalEnrollments: 0,
        thisMonthEnrollments: 0,
        topCategories: []
      };
    }
  }, [courses]);

  // Update analytics when courses change
  useEffect(() => {
    if (courses.length > 0) {
      const analytics = generateAnalyticsData();
      setAnalyticsData(analytics);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(courses.map(course => course.course_category).filter(Boolean))];
      setCategories(uniqueCategories as string[]);
    }
  }, [courses, generateAnalyticsData]);

  // Toggle course status
  const toggleStatus = useCallback(async (id: string) => {
    const loadingToastId = toast.loading("Updating course status...");
    
    try {
      await postQuery({
        url: `/courses/${id}/toggle-status`,
        postData: {},
        onSuccess: (response: any) => {
          const updatedStatus = response?.course?.status;
          if (updatedStatus) {
            toast.update(loadingToastId, {
              render: `Course status changed to ${updatedStatus}`,
              type: "success",
              isLoading: false,
              autoClose: 2000,
            });
            
            setCourses(prev => prev.map(course => 
              course._id === id 
                ? {...course, status: updatedStatus}
                : course  
            ));
            
            setUpdateStatus(Date.now());
          } else {
            toast.update(loadingToastId, {
              render: "Failed to update course status",
              type: "error",
              isLoading: false,
              autoClose: 3000,
            });
          }
        },
        onFail: (error: any) => {
          console.error('Toggle Status API Error:', error);
          toast.update(loadingToastId, {
            render: error?.message || 'Failed to change course status',
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
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
  }, [postQuery]);

  // Handle status change
  const handleStatusChange = useCallback(async (courseId: string, newStatus: string) => {
    const loadingToastId = toast.loading("Updating course status...");
    
    try {
      await postQuery({
        url: `/courses/${courseId}/status`,
        postData: { status: newStatus },
        onSuccess: () => {
          toast.update(loadingToastId, {
            render: `Course status updated to ${newStatus}`,
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });
          
          setCourses(prev => prev.map(course => 
            course._id === courseId 
              ? {...course, status: newStatus as any}
              : course
          ));
          
          setUpdateStatus(Date.now());
        },
        onFail: (error: any) => {
          toast.update(loadingToastId, {
            render: `Failed to update status: ${error?.message || "Unknown error"}`,
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        }
      });
    } catch (error) {
      toast.update(loadingToastId, {
        render: "An error occurred while updating status",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  }, [postQuery]);

  // Delete course
  const handleDelete = useCallback((id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this course?");
    if (!confirmDelete) return;
    
    const loadingToastId = toast.loading("Deleting course...");
    deleteQuery({
      url: `/courses/${id}`,
      onSuccess: () => {
        toast.update(loadingToastId, {
          render: "Course deleted successfully",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        setUpdateStatus(Date.now());
        setSelectedCourses(prev => prev.filter(courseId => courseId !== id));
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
  }, [deleteQuery]);

  // Navigation functions
  const editCourse = useCallback((id: string) => {
    router.push(`/dashboards/admin-updateCourse/${id}`);
  }, [router]);

  const viewCourse = useCallback((id: string) => {
    window.open(`/course-details/${id}`, '_blank');
  }, []);

  // Instructor assignment functions
  const handleAssignInstructorToCourse = useCallback((course: IExtendedCourse) => {
    setSelectedCourseForAssignment(course);
    setIsInstructorAssignmentModalOpen(true);
  }, []);

  const handleInstructorAssignmentModalClose = useCallback(() => {
    setIsInstructorAssignmentModalOpen(false);
    setSelectedCourseForAssignment(null);
  }, []);

  const handleInstructorAssignmentSuccess = useCallback(() => {
    setUpdateStatus(Date.now());
  }, []);

  // Bulk operations
  const handleBulkUpdate = useCallback(async (courseIds: string[], updateData: Partial<ICourseUpdateInput>) => {
    const loadingToastId = toast.loading(`Updating ${courseIds.length} courses...`);
    
    try {
      const updatePromises = courseIds.map(courseId => 
        postQuery({
          url: `/courses/${courseId}`,
          postData: updateData,
          onFail: (error: any) => {
            console.error(`Failed to update course ${courseId}:`, error);
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
  }, [postQuery]);

  // Selection handlers
  const handleSelectAll = useCallback((isChecked: boolean) => {
    if (isChecked) {
      const currentPageIds = paginatedData.map(course => course._id);
      setSelectedCourses(prev => {
        const prevSelected = prev.filter(id => !currentPageIds.includes(id));
        return [...prevSelected, ...currentPageIds];
      });
    } else {
      const currentPageIds = paginatedData.map(course => course._id);
      setSelectedCourses(prev => prev.filter(id => !currentPageIds.includes(id)));
    }
  }, []);

  const handleSelectCourse = useCallback((isChecked: boolean, courseId: string) => {
    if (isChecked) {
      setSelectedCourses(prev => [...prev, courseId]);
    } else {
      setSelectedCourses(prev => prev.filter(id => id !== courseId));
    }
  }, []);

  // Sorting
  const handleSort = useCallback((field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }, [sortField, sortDirection]);

  // Pagination
  const nextPage = useCallback(() => {
    if ((currentPage + 1) * pageSize < filteredData.length) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, pageSize]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  const handlePageSizeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    setCurrentPage(0);
  }, []);

  // Batch actions
  const handleBatchAction = useCallback(() => {
    if (!batchAction) {
      showToast.info("Please select an action");
      return;
    }
    
    if (selectedCourses.length === 0) {
      showToast.info("Please select courses to perform this action");
      return;
    }

    switch (batchAction) {
      case "delete":
        // Handle multiple delete
        const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedCourses.length} selected courses?`);
        if (!confirmDelete) return;
        
        const loadingToastId = toast.loading(`Deleting ${selectedCourses.length} courses...`);
        
        let successCount = 0;
        let failCount = 0;
        
        const deletePromises = selectedCourses.map(id => 
          new Promise<void>(resolve => {
            deleteQuery({
              url: `/courses/${id}`,
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
        break;
      case "assign_instructor":
        if (selectedCourses.length === 1) {
          const course = courses.find(c => c._id === selectedCourses[0]);
          if (course) handleAssignInstructorToCourse(course);
        } else {
          setAssignInstructorModal({ open: true, assignmentId: selectedCourses });
        }
        break;
      case "schedule_publish":
        const schedulableCourses = courses
          .filter(course => 
            selectedCourses.includes(course._id) && 
            ["Draft", "Inactive", "Upcoming"].includes(course.status)
          )
          .map(course => course._id);

        if (schedulableCourses.length === 0) {
          showToast.error("No selected courses are eligible for scheduling. Only Draft or Inactive courses can be scheduled.");
          return;
        }

        if (schedulableCourses.length < selectedCourses.length) {
          showToast.warning(
            `Only ${schedulableCourses.length} out of ${selectedCourses.length} selected courses are eligible for scheduling.`,
            { autoClose: 5000 }
          );
        }

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
        setBulkEditModal(true);
        break;
    }
  }, [batchAction, selectedCourses, courses, deleteQuery, handleAssignInstructorToCourse]);

  // Filter and sort data
  const filteredData = useMemo(() => {
    return Array.isArray(courses) ? courses
      .filter(course => {
        if (!course) return false;
        
        const matchesSearch = (course.course_title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                             (course.course_category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                             (course.course_description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                             (course.course_grade || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                             (course.course_duration || '').toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = !filterCategory || course.course_category === filterCategory;
        const matchesStatus = !filters.status || course.status === filters.status;
        const matchesGrade = !filters.course_grade || course.course_grade === filters.course_grade;
        
        const coursePrice = course.price || course.course_fee || 0;
        const matchesPriceRange = (!filters.priceRange.min || (coursePrice >= parseFloat(filters.priceRange.min))) &&
                                 (!filters.priceRange.max || (coursePrice <= parseFloat(filters.priceRange.max)));

        const matchesDuration = (!filters.duration.min || extractDurationWeeks(course.course_duration) >= parseInt(filters.duration.min)) &&
                               (!filters.duration.max || extractDurationWeeks(course.course_duration) <= parseInt(filters.duration.max));

        return matchesSearch && 
               matchesCategory && 
               matchesStatus && 
               matchesGrade &&
               matchesPriceRange && 
               matchesDuration;
      })
      .sort((a, b) => {
        if (!sortField) return 0;
        
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
        
        if (sortField === 'instructor') {
          const instructorA = instructorNames[a.instructor_id || ''] || '';
          const instructorB = instructorNames[b.instructor_id || ''] || '';
          return sortDirection === "asc" 
            ? instructorA.localeCompare(instructorB)
            : instructorB.localeCompare(instructorA);
        }
        
        if (sortField === 'status') {
          const statusA = a.status || 'Draft';
          const statusB = b.status || 'Draft';
          return sortDirection === "asc" 
            ? statusA.localeCompare(statusB)
            : statusB.localeCompare(statusA);
        }
        
        if (a[sortField as keyof IExtendedCourse] === undefined && b[sortField as keyof IExtendedCourse] === undefined) return 0;
        if (a[sortField as keyof IExtendedCourse] === undefined) return sortDirection === "asc" ? 1 : -1;
        if (b[sortField as keyof IExtendedCourse] === undefined) return sortDirection === "asc" ? -1 : 1;
        
        let comparison = 0;
        const aValue = a[sortField as keyof IExtendedCourse];
        const bValue = b[sortField as keyof IExtendedCourse];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          comparison = aValue.localeCompare(bValue);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
        } else if (aValue instanceof Date && bValue instanceof Date) {
          comparison = aValue.getTime() - bValue.getTime();
        } else if (sortField === 'price' || sortField === 'course_fee') {
          const priceA = parseFloat(String(a.price || a.course_fee)) || 0;
          const priceB = parseFloat(String(b.price || b.course_fee)) || 0;
          comparison = priceA - priceB;
        } else if (sortField === 'createdAt' || sortField === 'updatedAt') {
          const dateA = aValue ? new Date(String(aValue)) : new Date(0);
          const dateB = bValue ? new Date(String(bValue)) : new Date(0);
          comparison = dateA.getTime() - dateB.getTime();
        } else {
          comparison = String(aValue).localeCompare(String(bValue));
        }
        
        return sortDirection === "asc" ? comparison : -comparison;
      })
      .map((course, index) => ({
        ...course,
        no: index + 1,
        instructor: course.assigned_instructor 
          ? (typeof course.assigned_instructor === 'object' 
             ? course.assigned_instructor.full_name || course.assigned_instructor.email
             : course.assigned_instructor)
          : instructorNames[course.instructor_id || ''] || "-",
        status: course.status || "Draft",
        course_grade: course.course_grade || "Not Set",
        course_duration: course.course_duration || "Not Set",
        price: course.price || course.course_fee || 0
      })) : [];
  }, [courses, searchQuery, filterCategory, filters, sortField, sortDirection, instructorNames]);

  // Calculate pagination values
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    return filteredData.slice(
      currentPage * pageSize,
      (currentPage + 1) * pageSize
    );
  }, [filteredData, currentPage, pageSize]);

  // Effects
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses, updateStatus]);

  useEffect(() => {
    fetchInstructors();
  }, [fetchInstructors]);

  // Loading state
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
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.totalCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Published</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.published}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Draft</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.draft}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Enrollments</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.totalEnrollments}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Course Management</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Manage your courses, assign instructors, and track performance
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push('/dashboards/admin-addcourse')}
                  className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Course
                </button>
                <button
                  onClick={() => setExportModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search courses by title, category, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                >
                  <option value="">All Status</option>
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                  <option value="Active">Active</option>
                  <option value="Archived">Archived</option>
                </select>

                <select
                  value={filters.course_grade}
                  onChange={(e) => setFilters(prev => ({ ...prev, course_grade: e.target.value }))}
                  className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                >
                  <option value="">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="All Levels">All Levels</option>
                </select>

                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterCategory("");
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
                  }}
                  className="px-3 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedCourses.length > 0 && (
            <div className="px-6 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  {selectedCourses.length} course{selectedCourses.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center gap-2">
                  <select
                    value={batchAction}
                    onChange={(e) => setBatchAction(e.target.value)}
                    className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">Select Action</option>
                    <option value="delete">Delete Selected</option>
                    <option value="assign_instructor">Assign Instructor</option>
                    <option value="schedule_publish">Schedule Publish</option>
                    <option value="bulk_edit">Bulk Edit</option>
                    <option value="export">Export Selected</option>
                  </select>
                  <button
                    onClick={handleBatchAction}
                    disabled={!batchAction}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm rounded-md transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <CustomCheckbox
                      checked={paginatedData.length > 0 && paginatedData.every(course => selectedCourses.includes(course._id))}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('course_title')}>
                    Course {sortField === 'course_title' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('course_category')}>
                    Category {sortField === 'course_category' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('course_grade')}>
                    Level {sortField === 'course_grade' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('price')}>
                    Price {sortField === 'price' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('instructor')}>
                    Instructor {sortField === 'instructor' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('status')}>
                    Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedData.length > 0 ? (
                  paginatedData.map((course) => (
                    <tr key={course._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4">
                        <CustomCheckbox
                          checked={selectedCourses.includes(course._id)}
                          onChange={(checked) => handleSelectCourse(checked, course._id)}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {course.course_image && (
                            <div className="flex-shrink-0 h-12 w-12 mr-4">
                              <Image
                                src={course.course_image}
                                alt={course.course_title || 'Course'}
                                width={48}
                                height={48}
                                className="h-12 w-12 rounded-lg object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {course.course_title || 'Untitled Course'}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {course.course_duration || 'Duration not set'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {course.course_category || 'Uncategorized'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          course.course_grade === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                          course.course_grade === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          course.course_grade === 'Advanced' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {course.course_grade || 'Not Set'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        ${course.price || course.course_fee || 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {course.instructor || 'Not Assigned'}
                      </td>
                      <td className="px-6 py-4">
                        <StatusDropdown
                          courseId={course._id}
                          currentStatus={course.status}
                          onStatusChange={handleStatusChange}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <ActionButtons
                          course={course}
                          onEdit={editCourse}
                          onView={viewCourse}
                          onDelete={handleDelete}
                          onAssignInstructor={() => {}}
                          onSchedulePublish={(id, title) => setScheduleModal({ open: true, courseId: id, courseTitle: title })}
                          onAssignInstructorToCourse={handleAssignInstructorToCourse}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="text-gray-500 dark:text-gray-400">
                        <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <h3 className="text-lg font-medium mb-2">No courses found</h3>
                        <p className="text-sm">
                          {searchQuery || filterCategory || filters.status ? 
                            'Try adjusting your search or filters' : 
                            'Get started by creating your first course'
                          }
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredData.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Show</span>
                  <select
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    of {filteredData.length} courses
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  
                  <button
                    onClick={nextPage}
                    disabled={(currentPage + 1) * pageSize >= filteredData.length}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {assignInstructorModal.open && (
        <AssignInstructorModal
          onClose={() => setAssignInstructorModal({ open: false, assignmentId: null })}
          setAssignInstructorModal={setAssignInstructorModal}
          courseId={assignInstructorModal.assignmentId || ''}
          courses={courses}
          instructors={instructors}
          setInstructors={setInstructors}
          setInstructorNames={setInstructorNames}
          setUpdateStatus={setUpdateStatus}
        />
      )}

      {scheduleModal.open && (
        <SchedulePublishModal
          courseId={scheduleModal.courseId || ''}
          courseTitle={scheduleModal.courseTitle}
          onClose={() => setScheduleModal({ open: false, courseId: null, courseTitle: '' })}
        />
      )}

      {bulkEditModal && (
        <BulkEditModal
          selectedCourses={selectedCourses}
          courses={courses}
          onClose={() => setBulkEditModal(false)}
          onBulkUpdate={handleBulkUpdate}
        />
      )}

      {exportModal && (
        <ExportModal
          selectedCourses={selectedCourses}
          courses={courses}
          onClose={() => setExportModal(false)}
        />
      )}

      {isInstructorAssignmentModalOpen && selectedCourseForAssignment && (
        <InstructorAssignmentModal
          isOpen={isInstructorAssignmentModalOpen}
          onClose={handleInstructorAssignmentModalClose}
          type="course"
          targetData={{
            _id: selectedCourseForAssignment._id,
            course_title: selectedCourseForAssignment.course_title || 'Untitled Course',
            course_category: selectedCourseForAssignment.course_category
          }}
          title={`Assign Instructor to ${selectedCourseForAssignment.course_title || 'Course'}`}
          onSuccess={handleInstructorAssignmentSuccess}
        />
      )}
    </div>
  );
};

export default ListOfCourse; 