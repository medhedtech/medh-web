"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, 
  Search, 
  Calendar, 
  Clock, 
  Star, 
  Eye, 
  Upload, 
  Download,
  ClipboardList,
  CheckCircle,
  AlertCircle,
  XCircle,
  FileText,
  Target,
  Award,
  User,
  Loader2
} from "lucide-react";
import { apiUrls } from "@/apis";

interface Assignment {
  id: string;
  title: string;
  instructor?: {
    name: string;
    rating: number;
  };
  course?: string;
  dueDate?: string;
  status?: 'pending' | 'submitted' | 'graded' | 'overdue';
  difficulty?: 'easy' | 'medium' | 'hard';
  points?: number;
  maxPoints?: number;
  grade?: string;
  description?: string;
  submissionDate?: string;
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
}

// Enhanced TabButton with count badges
const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children, count }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`relative inline-flex items-center justify-center w-32 sm:w-40 px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm font-medium rounded-xl transition-all duration-300 overflow-hidden group ${
      active
        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
        : 'bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-gray-700/80 border border-gray-200 dark:border-gray-700'
    }`}
  >
    {/* Animated background for active state */}
    {active && (
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 animate-pulse"></div>
    )}
    
    <span className="relative z-10 flex items-center gap-2">
      {children}
      {count !== undefined && count > 0 && (
        <span className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full ${
          active 
            ? 'bg-white/20 text-white' 
            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
        }`}>
          {count}
        </span>
      )}
    </span>
  </motion.button>
);

// Assignment Card Component
const AssignmentCard = ({ assignment, onViewDetails }: { assignment: Assignment; onViewDetails: (assignment: Assignment) => void }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Due today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Due tomorrow at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays > 0) {
      return `Due ${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return `Overdue since ${date.toLocaleDateString()}`;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'submitted':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'graded':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'overdue':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'hard':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
    }
  };

  const getStatusStripe = (status?: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
      case 'submitted':
        return 'bg-gradient-to-r from-blue-400 to-blue-500';
      case 'graded':
        return 'bg-gradient-to-r from-green-400 to-green-500';
      case 'overdue':
        return 'bg-gradient-to-r from-red-400 to-red-500';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group p-4 sm:p-5 md:p-6"
    >
      {/* Status Stripe */}
      <div className={`h-1 ${getStatusStripe(assignment?.status)}`}></div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4 gap-3 sm:gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            {assignment?.title || "No Title Available"}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
            by {assignment?.instructor?.name || "No instructor"} • {assignment?.course || "No course"}
          </p>
          <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(assignment?.dueDate)}
            </div>
            {assignment?.points && (
              <div className="flex items-center">
                <Target className="w-3 h-3 mr-1" />
                {assignment.points}/{assignment.maxPoints || 100} pts
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full">
          <ClipboardList className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
      </div>

      {/* Status, Difficulty and Grade */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {assignment?.status && (
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(assignment.status)}`}>
              {assignment.status === 'overdue' && <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></span>}
              {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
            </span>
          )}
          {assignment?.difficulty && (
            <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(assignment.difficulty)}`}>
              {assignment.difficulty.charAt(0).toUpperCase() + assignment.difficulty.slice(1)}
            </span>
          )}
          {assignment?.grade && assignment.status === 'graded' && (
            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full">
              Grade: {assignment.grade}
            </span>
          )}
        </div>
      </div>

      {/* Rating and Submission Date */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {assignment?.instructor?.rating || "4.5"}
          </span>
        </div>
        {assignment?.submissionDate && (
          <div className="flex items-center text-blue-600 dark:text-blue-400">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">
              Submitted {new Date(assignment.submissionDate).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      {assignment?.description && (
        <div className="mb-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
            {assignment.description}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-2">
        <button 
          onClick={() => onViewDetails(assignment)}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
        >
          <Eye className="w-4 h-4" />
          View Details
        </button>
        <button 
          className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg transition-all duration-300 text-sm ${
            assignment?.status === 'pending' 
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25' 
              : assignment?.status === 'graded'
              ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/25'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25'
          }`}
        >
          {assignment?.status === 'pending' ? (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Submit
            </>
          ) : assignment?.status === 'graded' ? (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 mr-2" />
              View Submission
            </>
          )}
        </button>
      </div>
      </div>
    </motion.div>
  );
};

// Assignment Details Modal
const AssignmentDetailsModal = ({ assignment, isOpen, onClose }: { assignment: Assignment | null; isOpen: boolean; onClose: () => void }) => {
  if (!isOpen || !assignment) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Assignment Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                {assignment.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Course: {assignment.course} • Instructor: {assignment.instructor?.name}
              </p>
            </div>

            {assignment.description && (
              <div>
                <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Description</h4>
                <p className="text-slate-600 dark:text-slate-400">{assignment.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Due Date</h4>
                <p className="text-slate-600 dark:text-slate-400">
                  {assignment.dueDate ? new Date(assignment.dueDate).toLocaleString() : "No due date"}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Points</h4>
                <p className="text-slate-600 dark:text-slate-400">
                  {assignment.points || 0}/{assignment.maxPoints || 100} points
                </p>
              </div>
            </div>

            {assignment.status === 'graded' && assignment.grade && (
              <div>
                <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Grade</h4>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {assignment.grade}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const AssignmentsMain: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch assignments from API
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch pending items for the logged-in student – this includes both assignments and quizzes
        const token =
          localStorage.getItem('authToken') ||
          localStorage.getItem('token') ||
          sessionStorage.getItem('token');

        if (!token) {
          throw new Error('Authentication token not found. Please log in again.');
        }

        const res = await fetch(apiUrls.Students.pendingItems, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }

        const json = await res.json();

        if (json.status !== 'success') {
          throw new Error(json.message || 'Unexpected API response');
        }

        const pendingItems: any[] = json?.data?.pendingItems || [];

        // Map only assignment-type items into Assignment objects expected by the UI
        const mappedAssignments: Assignment[] = pendingItems
          .filter((item) => item.type === 'assignment')
          .map((item) => ({
            id: item.id,
            title: item.title,
            course: item.courseName,
            dueDate: item.dueDate,
            maxPoints: item.maxScore,
            description: item.description,
            status: 'pending',
          }));

        setAssignments(mappedAssignments);
      } catch (error: any) {
        console.error('Error fetching assignments:', error);
        let errorMessage = 'Failed to load assignments. Please try again.';
        
        if (error?.message?.includes('Student ID not found')) {
          errorMessage = 'Please log in again to view your assignments.';
        } else if (error?.message?.includes('HTTP error')) {
          errorMessage = 'Unable to connect to the server. Please check your internet connection.';
        }
        
        setError(errorMessage);
        setAssignments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const handleViewDetails = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAssignment(null);
  };

  // Filter assignments based on active tab and search term
  const filteredAssignments = assignments.filter(assignment => {
    const matchesTab = activeTab === 'all' || assignment.status === activeTab;
    const matchesSearch = assignment.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.course?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.instructor?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Count assignments for each tab
  const tabCounts = {
    all: assignments.length,
    pending: assignments.filter(a => a.status === 'pending').length,
    submitted: assignments.filter(a => a.status === 'submitted').length,
    graded: assignments.filter(a => a.status === 'graded').length
  };

  const tabs = [
    { name: "All", key: 'all' as const, icon: ClipboardList, count: tabCounts.all },
    { name: "Pending", key: 'pending' as const, icon: Clock, count: tabCounts.pending },
    { name: "Submitted", key: 'submitted' as const, icon: Upload, count: tabCounts.submitted },
    { name: "Graded", key: 'graded' as const, icon: Award, count: tabCounts.graded }
  ];

  const getEmptyStateContent = () => {
    switch (activeTab) {
      case 'all':
        return {
          icon: <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />,
          title: "No assignments available",
          description: "You don't have any assignments yet. Check back later or contact your instructor."
        };
      case 'pending':
        return {
          icon: <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />,
          title: "No pending assignments",
          description: "You're all caught up! No pending assignments at the moment."
        };
      case 'submitted':
        return {
          icon: <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />,
          title: "No submitted assignments",
          description: "Your submitted assignments will appear here once you start submitting work."
        };
      case 'graded':
        return {
          icon: <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />,
          title: "No graded assignments",
          description: "Your graded assignments will appear here once your instructor reviews your work."
        };
      default:
        return {
          icon: <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />,
          title: "No assignments available",
          description: "You don't have any assignments yet. Check back later or contact your instructor."
        };
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 sm:p-6 lg:p-8 rounded-lg max-w-7xl mx-auto"
    >
      <div className="flex flex-col space-y-6">
        {/* Enhanced Header */}
        <div className="text-center pt-6 pb-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col sm:flex-row items-center justify-center mb-4"
          >
            <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl backdrop-blur-sm mb-4 sm:mb-0 sm:mr-4">
              <ClipboardList className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
              Quizzes & Assessments
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
              Test your knowledge and track progress
              </p>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            className="relative max-w-lg mx-auto"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            />
          </motion.div>
        </div>

        {/* Enhanced Tabs */}
        <div className="flex flex-wrap justify-center gap-2 bg-gray-100/80 dark:bg-gray-800/80 rounded-2xl p-1.5 backdrop-blur-sm">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            return (
              <TabButton
                key={tab.key}
                active={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
                count={tab.count}
              >
                <TabIcon className="w-4 h-4" />
                <span className="font-medium">{tab.name}</span>
              </TabButton>
            );
          })}
        </div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading assignments...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center"
          >
            <div className="flex items-center justify-center mb-2">
              <X className="w-6 h-6 text-red-500 mr-2" />
              <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Error Loading Assignments</h3>
            </div>
            <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Content */}
        {!isLoading && !error && (
          <AnimatePresence mode="wait">
            {filteredAssignments.length > 0 ? (
              <motion.div
                key="assignments-grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
              >
                {filteredAssignments.map((assignment, index) => (
                  <motion.div
                    key={assignment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <AssignmentCard assignment={assignment} onViewDetails={handleViewDetails} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-12"
              >
                <div className="max-w-md mx-auto">
                  {getEmptyStateContent().icon}
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {getEmptyStateContent().title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {getEmptyStateContent().description}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Assignment Details Modal */}
      <AssignmentDetailsModal
        assignment={selectedAssignment}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </motion.div>
  );
};

export default AssignmentsMain; 