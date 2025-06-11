"use client";

import React, { Suspense, useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from "framer-motion";
import Link from 'next/link';
import {
  ClipboardList,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Upload,
  Download,
  Eye,
  Star,
  FileText,
  Filter,
  Search,
  BookOpen,
  Target,
  Award,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

// Import API hooks and types
import useGetQuery from '@/hooks/getQuery.hook';
import usePostQuery from '@/hooks/postQuery.hook';
import usePutQuery from '@/hooks/putQuery.hook';
import useDeleteQuery from '@/hooks/deleteQuery.hook';
import { 
  apiUrls, 
  IAssignment, 
  IAssignmentStats, 
  IAssignmentsResponse, 
  IAssignmentStatsResponse,
  ISubmissionCreateInput,
  ISubmissionResponse
} from '@/apis/index';

/**
 * AssignmentsMain - Component that displays the assignments content
 * within the student dashboard layout
 */
const AssignmentsMain: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<"all" | "pending" | "submitted" | "graded" | "overdue">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [assignments, setAssignments] = useState<IAssignment[]>([]);
  const [stats, setStats] = useState<IAssignmentStats>({
    totalAssignments: 0,
    pendingAssignments: 0,
    submittedAssignments: 0,
    gradedAssignments: 0,
    overdueAssignments: 0,
    averageGrade: 0,
    completionRate: 0,
    onTimeSubmissionRate: 0,
    totalPointsEarned: 0,
    totalPointsPossible: 0,
    assignmentsByType: {},
    assignmentsByDifficulty: {},
    gradeTrend: [],
    upcomingDeadlines: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // API hooks
  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();
  const { putQuery } = usePutQuery();
  const { deleteQuery } = useDeleteQuery();

  useEffect(() => {
    setIsClient(true);
    // Get user ID from localStorage or context
    const storedUserId = localStorage.getItem('userId') || localStorage.getItem('user_id');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setError('User not authenticated. Please log in again.');
      setIsLoading(false);
    }
  }, []);

  // Fetch assignments and stats
  useEffect(() => {
    if (userId) {
      fetchAssignments();
    }
  }, [userId]);

  const fetchAssignments = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Fetch assignments
      await getQuery({
        url: apiUrls.assignments.getAllAssignments(userId, {
          page: 1,
          limit: 50,
          sort_by: 'dueDate',
          sort_order: 'asc'
        }),
        onSuccess: (response: IAssignmentsResponse) => {
          if (response && response.data && response.data.assignments && Array.isArray(response.data.assignments)) {
            setAssignments(response.data.assignments);
          } else {
            console.warn('Assignments API returned unexpected response structure:', response);
            setAssignments([]);
          }
        },
        onFail: (error) => {
          console.error('Error fetching assignments:', error);
          if (error?.status === 404) {
            console.warn('Assignments API endpoint not implemented yet. Using empty state.');
            setError('Assignments feature is not available yet. Please check back later.');
          } else {
            setError('Failed to load assignments. Please try again later.');
          }
          setAssignments([]);
        }
      });

      // Fetch assignment stats
      await getQuery({
        url: apiUrls.assignments.getAssignmentStats(userId),
        onSuccess: (response: IAssignmentStatsResponse) => {
          if (response && response.data && response.data.stats) {
            setStats(response.data.stats);
          } else {
            console.warn('Assignment stats API returned unexpected response structure:', response);
          }
        },
        onFail: (error) => {
          console.error('Error fetching assignment stats:', error);
          if (error?.status === 404) {
            console.warn('Assignment stats API endpoint not implemented yet. Using default stats.');
          }
        }
      });
    } catch (error) {
      console.error('Error in fetchAssignments:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [userId, getQuery]);

  // Handle assignment submission
  const handleSubmitAssignment = useCallback(async (assignmentId: string) => {
    if (!userId) return;

    try {
      const submissionData: ISubmissionCreateInput = {
        assignmentId,
        studentId: userId,
        content: 'Assignment submitted via dashboard'
      };

      await postQuery({
        url: apiUrls.assignments.submitAssignment(assignmentId),
        data: submissionData,
        onSuccess: (response: ISubmissionResponse) => {
          if (response && response.data) {
            // Update assignment status locally
            setAssignments(prev => prev.map(assignment => 
              assignment._id === assignmentId 
                ? { ...assignment, status: 'submitted' as const, submittedDate: new Date().toISOString() }
                : assignment
            ));
            // Refresh data
            fetchAssignments();
          }
        },
        onFail: (error) => {
          console.error('Error submitting assignment:', error);
          setError('Failed to submit assignment. Please try again.');
        }
      });
    } catch (error) {
      console.error('Error in assignment submission:', error);
    }
  }, [userId, postQuery, fetchAssignments]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    if (userId) {
      fetchAssignments();
    }
  }, [userId, fetchAssignments]);

  // Animation variants
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  }), []);

  // Assignment stats derived from fetched data
  const assignmentStats = useMemo(() => {
    return {
      total: stats.totalAssignments,
      pending: stats.pendingAssignments,
      submitted: stats.submittedAssignments,
      graded: stats.gradedAssignments,
      overdue: stats.overdueAssignments,
      averageGrade: stats.averageGrade ? stats.averageGrade.toFixed(1) : "N/A"
    };
  }, [stats]);

  // Filter assignments based on status and search
  const filteredAssignments = useMemo(() => {
    let filtered = assignments;
    
    if (selectedStatus !== "all") {
      filtered = filtered.filter(assignment => assignment.status === selectedStatus);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(assignment => 
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [assignments, selectedStatus, searchTerm]);

  // Get status color and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
          icon: <Clock className="w-4 h-4" />,
          label: "Pending"
        };
      case "submitted":
        return {
          color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
          icon: <Upload className="w-4 h-4" />,
          label: "Submitted"
        };
      case "graded":
        return {
          color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
          icon: <CheckCircle className="w-4 h-4" />,
          label: "Graded"
        };
      case "overdue":
        return {
          color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
          icon: <XCircle className="w-4 h-4" />,
          label: "Overdue"
        };
      default:
        return {
          color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
          icon: <FileText className="w-4 h-4" />,
          label: "Unknown"
        };
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Hard":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  // Assignment Stats Component
  const AssignmentStats = () => (
    <div className="bg-gradient-to-r from-primary-500 to-primary-700 dark:from-primary-800 dark:to-primary-900 rounded-2xl p-4 sm:p-6 text-white shadow-lg">
      <div className="flex flex-nowrap items-center justify-between gap-4 sm:gap-6 overflow-x-auto">
        {/* Total Assignments */}
        <div className="text-center flex-1 min-w-[100px]">
          <div className="text-2xl sm:text-3xl font-bold mb-1">{assignmentStats.total}</div>
          <div className="text-primary-100 text-xs sm:text-sm font-medium whitespace-nowrap">Total Assignments</div>
        </div>

        {/* Pending */}
        <div className="text-center flex-1 min-w-[80px]">
          <div className="text-2xl sm:text-3xl font-bold mb-1">{assignmentStats.pending}</div>
          <div className="text-primary-100 text-xs sm:text-sm font-medium">Pending</div>
        </div>

        {/* Average Grade */}
        <div className="text-center flex-1 min-w-[100px]">
          <div className="text-3xl sm:text-4xl font-bold mb-1 text-yellow-200">{assignmentStats.averageGrade}</div>
          <div className="text-primary-100 text-xs sm:text-sm font-medium uppercase tracking-wide whitespace-nowrap">Average Grade</div>
        </div>

        {/* Submitted */}
        <div className="text-center flex-1 min-w-[80px]">
          <div className="text-2xl sm:text-3xl font-bold mb-1">{assignmentStats.submitted}</div>
          <div className="text-primary-100 text-xs sm:text-sm font-medium">Submitted</div>
        </div>

        {/* Graded */}
        <div className="text-center flex-1 min-w-[80px]">
          <div className="text-2xl sm:text-3xl font-bold mb-1">{assignmentStats.graded}</div>
          <div className="text-primary-100 text-xs sm:text-sm font-medium">Graded</div>
        </div>

        {/* Refresh Button */}
        <div className="flex-shrink-0">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh assignments"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );

  // Assignment Card Component
  const AssignmentCard = ({ assignment }: { assignment: IAssignment }) => {
    const statusInfo = getStatusInfo(assignment.status);
    const isOverdue = assignment.status === "overdue";
    const daysUntilDue = Math.ceil((new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));

    return (
      <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 border ${isOverdue ? 'border-red-200 dark:border-red-800' : 'border-gray-200 dark:border-gray-700'} hover:shadow-lg transition-all duration-300`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                {statusInfo.icon}
                <span className="ml-1">{statusInfo.label}</span>
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(assignment.difficulty)}`}>
                {assignment.difficulty}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {assignment.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {assignment.courseName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              {assignment.description}
            </p>
          </div>
        </div>

        {/* Assignment Info */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            Due: {new Date(assignment.dueDate).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {assignment.estimatedTime}
          </div>
          <div className="flex items-center">
            <FileText className="w-3 h-3 mr-1" />
            {assignment.type}
          </div>
          <div className="flex items-center">
            <Target className="w-3 h-3 mr-1" />
            {assignment.maxGrade} points
          </div>
        </div>

        {/* Grade Display */}
        {assignment.grade !== null && assignment.grade !== undefined && (
          <div className="flex items-center justify-between mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Grade: {assignment.grade}/{assignment.maxGrade}
              </span>
            </div>
            <div className="text-sm font-bold text-green-600 dark:text-green-400">
              {((assignment.grade / assignment.maxGrade) * 100).toFixed(1)}%
            </div>
          </div>
        )}

        {/* Due Date Warning */}
        {assignment.status === "pending" && daysUntilDue <= 3 && daysUntilDue > 0 && (
          <div className="flex items-center mb-4 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <AlertCircle className="w-4 h-4 text-yellow-500 mr-2" />
            <span className="text-sm text-yellow-700 dark:text-yellow-400">
              Due in {daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Attachments */}
        {assignment.attachments && assignment.attachments.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Attachments:</p>
            <div className="flex flex-wrap gap-2">
              {assignment.attachments.map((file, index) => (
                <span key={index} className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                  <Download className="w-3 h-3 mr-1" />
                  {file.filename}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          <button className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm">
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </button>
          {assignment.status === "pending" && (
            <button 
              onClick={() => handleSubmitAssignment(assignment._id)}
              className="flex-1 flex items-center justify-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
            >
              <Upload className="w-4 h-4 mr-2" />
              Submit
            </button>
          )}
          {assignment.status === "graded" && (
            <button className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
          )}
        </div>
      </div>
    );
  };

  // Assignment Preloader
  const AssignmentPreloader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 animate-pulse border border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2 mb-3">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
          </div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Error display component
  const ErrorDisplay = ({ message }: { message: string }) => (
    <div className="text-center py-12">
      <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        Unable to Load Assignments
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {message}
      </p>
      <button
        onClick={handleRefresh}
        className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </button>
    </div>
  );

  if (!isClient || isLoading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <AssignmentPreloader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <ErrorDisplay message={error} />
      </div>
    );
  }

  return (
    <div className="w-full">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8 lg:space-y-12 pt-8 lg:pt-12"
      >
        {/* Page Header */}
        <motion.div variants={itemVariants} className="text-center pt-6 pb-4">
          <div className="flex items-center justify-center mb-4">
            <ClipboardList className="w-8 h-8 text-primary-500 mr-3" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">
              Assignments
            </h1>
          </div>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
            View and manage your course assignments, track submissions, and monitor your grades
          </p>
        </motion.div>

        {/* Assignment Stats */}
        <motion.div variants={itemVariants} className="px-4 sm:px-6 lg:px-8">
          <AssignmentStats />
        </motion.div>

        {/* Search and Filter */}
        <motion.div variants={itemVariants} className="px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            {/* Status Filter */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {[
                { key: "all", label: "All", icon: ClipboardList },
                { key: "pending", label: "Pending", icon: Clock },
                { key: "submitted", label: "Submitted", icon: Upload },
                { key: "graded", label: "Graded", icon: CheckCircle },
                { key: "overdue", label: "Overdue", icon: XCircle }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setSelectedStatus(key as any)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedStatus === key
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Assignments Grid */}
        <motion.div variants={itemVariants} className="px-4 sm:px-6 lg:px-8">
          {filteredAssignments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredAssignments.map((assignment) => (
                <AssignmentCard key={assignment._id} assignment={assignment} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No assignments found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {assignments.length === 0 
                  ? "You don't have any assignments yet. Check back later or contact your instructor."
                  : "Try adjusting your search or filter criteria"
                }
              </p>
              {assignments.length > 0 && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedStatus("all");
                  }}
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AssignmentsMain; 