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
  User
} from "lucide-react";

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
}

// Tab Button Component matching demo classes style
const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 overflow-hidden group ${
      active
        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:shadow-lg'
        : 'glass-stats text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/20 dark:hover:bg-gray-700/20'
    }`}
  >
    {/* Animated background for active state */}
    {active && (
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 animate-gradient-x"></div>
    )}
    
    {/* Shimmer effect on hover */}
    <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100"></div>
    
    <span className="relative z-10 group-hover:scale-110 transition-transform">{children}</span>
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

    return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {assignment?.title || "No Title Available"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            by {assignment?.instructor?.name || "No instructor"} • {assignment?.course || "No course"}
          </p>
          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
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
        <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
          <ClipboardList className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
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
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {assignment?.instructor?.rating || "4.5"}
              </span>
            </div>
        {assignment?.submissionDate && (
          <div className="flex items-center text-emerald-600 dark:text-emerald-400">
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
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {assignment.description}
          </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
        <button 
          onClick={() => onViewDetails(assignment)}
          className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
        >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </button>
            <button 
          className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg transition-colors text-sm ${
            assignment?.status === 'pending' 
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
              : assignment?.status === 'graded'
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
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
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Assignment Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {assignment.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Course: {assignment.course} • Instructor: {assignment.instructor?.name}
              </p>
            </div>

            {assignment.description && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Description</h4>
                <p className="text-gray-600 dark:text-gray-400">{assignment.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Due Date</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {assignment.dueDate ? new Date(assignment.dueDate).toLocaleString() : "No due date"}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Points</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {assignment.points || 0}/{assignment.maxPoints || 100} points
                </p>
              </div>
            </div>

            {assignment.status === 'graded' && assignment.grade && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Grade</h4>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
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

  // Mock data - remove when API is ready
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAssignments([]);
      setIsLoading(false);
    }, 1000);
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

  const getTabContent = () => {
    switch (activeTab) {
      case 'all':
        return filteredAssignments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssignments.map((assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment} onViewDetails={handleViewDetails} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No assignments available
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              You don't have any assignments yet. Check back later or contact your instructor.
            </p>
        </div>
        );
      case 'pending':
        return (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No pending assignments
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              You're all caught up! No pending assignments at the moment.
            </p>
    </div>
  );
      case 'submitted':
        return (
    <div className="text-center py-12">
            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No submitted assignments
      </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your submitted assignments will appear here once you start submitting work.
            </p>
    </div>
  );
      case 'graded':
    return (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No graded assignments
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your graded assignments will appear here once your instructor reviews your work.
            </p>
      </div>
    );
      default:
        return null;
  }
  };

  if (isLoading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="text-center">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto"></div>
          </div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="flex space-x-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
      <div className="text-center pt-6 pb-4">
      <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-center mb-4"
        >
          <div className="p-2 bg-primary-100/80 dark:bg-primary-900/30 rounded-xl backdrop-blur-sm mr-3">
            <ClipboardList className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            Assignments
          </h1>
        </motion.div>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4 mb-6">
          View and manage your course assignments, track submissions, and monitor your grades
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
        </div>
            </div>
            
      {/* Tabs */}
      <div className="mb-8 flex justify-center">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 inline-flex">
          <TabButton
            active={activeTab === 'all'}
            onClick={() => setActiveTab('all')}
          >
            All Assignments
          </TabButton>
          <TabButton
            active={activeTab === 'pending'}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </TabButton>
          <TabButton
            active={activeTab === 'submitted'}
            onClick={() => setActiveTab('submitted')}
          >
            Submitted
          </TabButton>
          <TabButton
            active={activeTab === 'graded'}
            onClick={() => setActiveTab('graded')}
          >
            Graded
          </TabButton>
            </div>
          </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {getTabContent()}
            </div>

      {/* Assignment Details Modal */}
      <AssignmentDetailsModal
        assignment={selectedAssignment}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default AssignmentsMain; 