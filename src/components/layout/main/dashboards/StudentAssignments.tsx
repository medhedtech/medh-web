"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { 
  LucideCalendar, 
  LucideClock, 
  LucideUser, 
  LucideBookOpen,
  LucideCheck,
  LucideX,
  LucideInfo,
  LucideFileText,
  LucideAlertCircle,
  LucideUpload,
  LucideFile,
  LucideClipboard,
  LucideEdit,
  LucideSend
} from "lucide-react";

// Component imports
import LoadingIndicator from "@/components/shared/loaders/LoadingIndicator";
import EmptyState from "@/components/shared/others/EmptyState";
import TabNavigation from "@/components/shared/navigation/TabNavigation";
import SearchBar from "@/components/shared/inputs/SearchBar";
import Badge from "@/components/shared/elements/Badge";
import Button from "@/components/shared/buttons/Button";
import Select from "@/components/shared/inputs/Select";
import Card from "@/components/shared/containers/Card";
import Modal from "@/components/shared/modals/Modal";

// Default image for assignments without images
import DefaultAssignmentImage from "@/assets/images/courses/image1.png";

// Types
interface Assignment {
  _id: string;
  title: string;
  description?: string;
  instructions?: string;
  deadline: string;
  total_marks: number;
  status: string; // pending, submitted, graded
  course: {
    _id: string;
    title: string;
    image?: string;
  };
  instructor?: string;
  submission?: {
    _id?: string;
    submittedAt?: string;
    content?: string;
    fileUrl?: string;
    marks?: number;
    feedback?: string;
  };
  submissionType: string; // text, file, mixed
  category?: string;
}

interface ApiResponse {
  assignments: Assignment[];
}

interface FilterState {
  status: string;
  course: string;
  searchTerm: string;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
};

/**
 * StudentAssignments - Component for displaying and managing student assignments
 */
const StudentAssignments: React.FC = () => {
  const router = useRouter();
  const { getQuery, loading } = useGetQuery();
  
  // State management
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [submissionText, setSubmissionText] = useState<string>("");
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Filter and search state
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    course: "all",
    searchTerm: ""
  });
  
  // Course and status options for filter
  const [courses, setCourses] = useState<Array<{id: string, title: string}>>([]);
  const statuses = ["all", "pending", "submitted", "graded"];
  
  // Fetch user ID from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setUserId(storedUserId);
      }
    }
  }, []);
  
  // Fetch assignments data
  useEffect(() => {
    if (!userId) return;
    
    const fetchAssignments = async () => {
      try {
        // Use the real API call
        getQuery({
          url: `${apiUrls?.assignments?.getAllAssignments(userId)}`,
          onSuccess: (res: ApiResponse) => {
            setAssignments(res.assignments || []);
            
            // Extract unique courses for filters
            const uniqueCourses = [...new Set((res.assignments || []).map(assignment => assignment.course))];
            setCourses([{ id: "all", title: "All Courses" }, ...uniqueCourses]);
            
            setErrorMessage("");
          },
          onFail: (err) => {
            console.error("Error fetching assignments:", err);
            setErrorMessage("Failed to load assignments. Please try again later.");
          }
        });
      } catch (error) {
        console.error("Error in assignments fetch:", error);
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    };
    
    fetchAssignments();
  }, [userId]);
  
  // Format date with user-friendly formatting
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, "MMMM do, yyyy");
    } catch (error) {
      return dateString;
    }
  };
  
  // Calculate days left until deadline
  const calculateDaysLeft = (deadline: string): number => {
    const deadlineDate = new Date(deadline);
    const currentDate = new Date();
    const timeDifference = deadlineDate.getTime() - currentDate.getTime();
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  };
  
  // Get color based on days left
  const getDeadlineColor = (daysLeft: number): string => {
    if (daysLeft < 0) return "text-red-500 dark:text-red-400";
    if (daysLeft <= 2) return "text-orange-500 dark:text-orange-400";
    if (daysLeft <= 7) return "text-yellow-500 dark:text-yellow-400";
    return "text-green-500 dark:text-green-400";
  };
  
  // Get status badge color
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'pending':
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400";
      case 'submitted':
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
      case 'graded':
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      case 'late':
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };
  
  // Apply filters to the assignments
  const filteredAssignments = assignments.filter((assignment) => {
    // Apply status filter
    if (filters.status !== "all" && assignment.status !== filters.status) {
      return false;
    }
    
    // Apply course filter
    if (filters.course !== "all" && assignment.course._id !== filters.course) {
      return false;
    }
    
    // Apply search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      return (
        assignment.title.toLowerCase().includes(searchLower) ||
        (assignment.description || "").toLowerCase().includes(searchLower) ||
        (assignment.instructor || "").toLowerCase().includes(searchLower) ||
        assignment.course.title.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  // Handle opening the assignment details modal
  const handleViewDetails = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsDetailsModalOpen(true);
  };
  
  // Handle opening the submit assignment modal
  const handleSubmitAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setSubmissionText("");
    setSubmissionFile(null);
    setIsSubmitModalOpen(true);
  };
  
  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSubmissionFile(e.target.files[0]);
    }
  };
  
  // Handle submission
  const handleSubmit = async () => {
    if (!selectedAssignment) return;
    
    // Validate submission
    if (
      (selectedAssignment.submissionType === "text" && !submissionText) ||
      (selectedAssignment.submissionType === "file" && !submissionFile) ||
      (selectedAssignment.submissionType === "mixed" && !submissionText && !submissionFile)
    ) {
      setErrorMessage("Please provide the required submission content.");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real implementation, you would make an API call here
      // to upload the file and/or submit the text content
      
      // Update the assignments list with the submission
      setAssignments(assignments.map(assignment => 
        assignment._id === selectedAssignment._id 
          ? { 
              ...assignment, 
              status: "submitted", 
              submission: {
                submittedAt: new Date().toISOString(),
                content: submissionText,
                fileUrl: submissionFile ? URL.createObjectURL(submissionFile) : undefined
              }
            } 
          : assignment
      ));
      
      setIsSubmitting(false);
      setIsSubmitModalOpen(false);
      setErrorMessage("");
    }, 1500);
  };
  
  // Handle filter changes
  const handleFilterChange = (filterName: keyof FilterState, value: string) => {
    setFilters({
      ...filters,
      [filterName]: value
    });
  };
  
  // Handle tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab !== "all") {
      handleFilterChange("status", tab);
    } else {
      handleFilterChange("status", "all");
    }
  };
  
  // Render an assignment card
  const renderAssignmentCard = (assignment: Assignment) => {
    const daysLeft = calculateDaysLeft(assignment.deadline);
    const deadlineColor = getDeadlineColor(daysLeft);
    const statusColor = getStatusColor(assignment.status);
    
    return (
      <motion.div
        key={assignment._id}
        variants={itemVariants}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700"
      >
        <div className="relative p-5">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-primary-50 dark:bg-primary-900/10 p-3 rounded-lg">
              <LucideFileText className="w-6 h-6 text-primary-500" />
            </div>
            
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor}`}>
              {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
            </span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            {assignment.title}
          </h3>
          
          {assignment.description && (
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
              {assignment.description}
            </p>
          )}
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <LucideBookOpen className="w-4 h-4 mr-2 text-primary-500" />
              <span className="truncate">{assignment.course.title}</span>
            </div>
            
            {assignment.instructor && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <LucideUser className="w-4 h-4 mr-2 text-primary-500" />
                <span>{assignment.instructor}</span>
              </div>
            )}
            
            <div className={`flex items-center text-sm ${deadlineColor}`}>
              <LucideCalendar className="w-4 h-4 mr-2" />
              <span>
                {daysLeft < 0 
                  ? `Deadline passed ${Math.abs(daysLeft)} days ago` 
                  : daysLeft === 0 
                    ? "Due today" 
                    : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`
                }
              </span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <LucideInfo className="w-4 h-4 mr-2 text-primary-500" />
              <span>{assignment.total_marks} points</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => handleViewDetails(assignment)}
              className="flex-1 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/10 dark:text-primary-400 dark:hover:bg-primary-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              View Details
            </button>
            
            {assignment.status === "pending" ? (
              <button
                onClick={() => handleSubmitAssignment(assignment)}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Submit Assignment
              </button>
            ) : assignment.status === "submitted" ? (
              <button
                onClick={() => handleViewDetails(assignment)}
                className="flex-1 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/10 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                View Submission
              </button>
            ) : (
              <button
                onClick={() => handleViewDetails(assignment)}
                className="flex-1 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 dark:bg-green-900/10 dark:text-green-400 dark:hover:bg-green-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                View Feedback
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };
  
  return (
    <div className="px-4 py-6 md:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Assignments
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage and submit your course assignments.
        </p>
      </div>
      
      {/* Tabs */}
      <div className="mb-6">
        <TabNavigation
          tabs={[
            { id: "all", label: "All Assignments" },
            { id: "pending", label: "Pending" },
            { id: "submitted", label: "Submitted" },
            { id: "graded", label: "Graded" }
          ]}
          activeTab={activeTab}
          onChange={handleTabChange}
        />
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar
            placeholder="Search assignments..."
            value={filters.searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange("searchTerm", e.target.value)}
            onClear={() => handleFilterChange("searchTerm", "")}
          />
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Select
            label="Course"
            options={courses.map(course => ({ value: course.id, label: course.title }))}
            value={filters.course}
            onChange={(value: string) => handleFilterChange("course", value)}
            className="w-full sm:w-40"
          />
        </div>
      </div>
      
      {/* Error Message */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
          <p className="flex items-center">
            <LucideAlertCircle className="w-5 h-5 mr-2" />
            {errorMessage}
          </p>
        </div>
      )}
      
      {/* Assignments Grid */}
      {loading ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <LoadingIndicator type="spinner" size="lg" color="primary" text="Loading assignments..." />
        </div>
      ) : filteredAssignments.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredAssignments.map(renderAssignmentCard)}
        </motion.div>
      ) : (
        <EmptyState
          icon={<LucideClipboard size={48} />}
          title="No assignments found"
          description={activeTab === "all" ? "There are no assignments available." : `No ${activeTab} assignments available.`}
          action={{
            label: "View all assignments",
            onClick: () => {
              setActiveTab("all");
              setFilters({
                status: "all",
                course: "all",
                searchTerm: ""
              });
            }
          }}
        />
      )}
      
      {/* Assignment Details Modal */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedAssignment && (
          <Modal
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            title="Assignment Details"
            size="lg"
          >
            <motion.div
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedAssignment.title}
                </h2>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(selectedAssignment.status)}`}>
                  {selectedAssignment.status.charAt(0).toUpperCase() + selectedAssignment.status.slice(1)}
                </span>
              </div>
              
              {selectedAssignment.description && (
                <p className="text-gray-700 dark:text-gray-300">
                  {selectedAssignment.description}
                </p>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <LucideBookOpen className="w-5 h-5 mr-3 text-primary-500" />
                  <span>Course: {selectedAssignment.course.title}</span>
                </div>
                
                {selectedAssignment.instructor && (
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <LucideUser className="w-5 h-5 mr-3 text-primary-500" />
                    <span>Instructor: {selectedAssignment.instructor}</span>
                  </div>
                )}
                
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <LucideCalendar className="w-5 h-5 mr-3 text-primary-500" />
                  <span>Deadline: {formatDate(selectedAssignment.deadline)}</span>
                </div>
                
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <LucideInfo className="w-5 h-5 mr-3 text-primary-500" />
                  <span>Total Marks: {selectedAssignment.total_marks}</span>
                </div>
              </div>
              
              {selectedAssignment.instructions && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Instructions</h3>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg whitespace-pre-line">
                    {selectedAssignment.instructions}
                  </div>
                </div>
              )}
              
              {selectedAssignment.submission && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Your Submission</h3>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    {selectedAssignment.submission.submittedAt && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        Submitted on {formatDate(selectedAssignment.submission.submittedAt)}
                      </div>
                    )}
                    
                    {selectedAssignment.submission.content && (
                      <div className="mb-3 whitespace-pre-line">
                        {selectedAssignment.submission.content}
                      </div>
                    )}
                    
                    {selectedAssignment.submission.fileUrl && (
                      <div className="flex items-center text-primary-600 dark:text-primary-400">
                        <LucideFile className="w-5 h-5 mr-2" />
                        <a 
                          href={selectedAssignment.submission.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          View Uploaded File
                        </a>
                      </div>
                    )}
                    
                    {selectedAssignment.status === "graded" && (
                      <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="flex items-center mb-2">
                          <span className="text-gray-700 dark:text-gray-300 font-medium">Grade:</span>
                          <span className="ml-2 text-primary-600 dark:text-primary-400 font-bold">
                            {selectedAssignment.submission.marks} / {selectedAssignment.total_marks}
                          </span>
                        </div>
                        
                        {selectedAssignment.submission.feedback && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-800 dark:text-white mb-1">Instructor Feedback:</h4>
                            <p className="text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg">
                              {selectedAssignment.submission.feedback}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                {selectedAssignment.status === "pending" ? (
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() => {
                      setIsDetailsModalOpen(false);
                      setTimeout(() => handleSubmitAssignment(selectedAssignment), 300);
                    }}
                    leftIcon={<LucideUpload size={18} />}
                  >
                    Submit Assignment
                  </Button>
                ) : selectedAssignment.status === "submitted" ? (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setIsDetailsModalOpen(false);
                      setTimeout(() => handleSubmitAssignment(selectedAssignment), 300);
                    }}
                    leftIcon={<LucideEdit size={18} />}
                  >
                    Edit Submission
                  </Button>
                ) : null}
              </div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
      
      {/* Submit Assignment Modal */}
      <AnimatePresence>
        {isSubmitModalOpen && selectedAssignment && (
          <Modal
            isOpen={isSubmitModalOpen}
            onClose={() => !isSubmitting && setIsSubmitModalOpen(false)}
            title="Submit Assignment"
            size="lg"
          >
            <motion.div
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {selectedAssignment.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Course: {selectedAssignment.course.title}
                </p>
                <p className={`text-sm ${getDeadlineColor(calculateDaysLeft(selectedAssignment.deadline))}`}>
                  Deadline: {formatDate(selectedAssignment.deadline)}
                </p>
              </div>
              
              {(selectedAssignment.submissionType === "text" || selectedAssignment.submissionType === "mixed") && (
                <div>
                  <label htmlFor="submissionText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Submission Text
                  </label>
                  <textarea
                    id="submissionText"
                    rows={6}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    placeholder="Type your submission here..."
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              )}
              
              {(selectedAssignment.submissionType === "file" || selectedAssignment.submissionType === "mixed") && (
                <div>
                  <label htmlFor="submissionFile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Upload File
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="submissionFile"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <LucideUpload className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PDF, ZIP, DOC, or other relevant formats
                        </p>
                      </div>
                      <input
                        id="submissionFile"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={isSubmitting}
                      />
                    </label>
                  </div>
                  {submissionFile && (
                    <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <LucideFile className="w-4 h-4 mr-2 text-primary-500" />
                      <span>{submissionFile.name}</span>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  onClick={() => setIsSubmitModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  loading={isSubmitting}
                  loadingText="Submitting..."
                  leftIcon={<LucideSend size={18} />}
                >
                  Submit Assignment
                </Button>
              </div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentAssignments; 