"use client";

import React, { Suspense, useState, useEffect, useMemo } from 'react';
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
  TrendingUp
} from 'lucide-react';

/**
 * AssignmentsMain - Component that displays the assignments content
 * within the student dashboard layout
 */
const AssignmentsMain: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<"all" | "pending" | "submitted" | "graded" | "overdue">("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  // Mock assignments data
  const assignments = useMemo(() => [
    {
      id: 1,
      title: "Digital Marketing Campaign Analysis",
      course: "Digital Marketing Fundamentals",
      dueDate: "2024-04-15",
      submittedDate: "2024-04-12",
      status: "graded",
      grade: 92,
      maxGrade: 100,
      description: "Analyze a real-world digital marketing campaign and provide recommendations",
      type: "Project",
      difficulty: "Medium",
      estimatedTime: "8 hours",
      attachments: ["campaign_brief.pdf", "analysis_template.docx"]
    },
    {
      id: 2,
      title: "Python Data Structures Implementation",
      course: "Data Science with Python",
      dueDate: "2024-04-20",
      submittedDate: null,
      status: "pending",
      grade: null,
      maxGrade: 100,
      description: "Implement various data structures using Python and analyze their performance",
      type: "Coding",
      difficulty: "Hard",
      estimatedTime: "12 hours",
      attachments: ["starter_code.py", "requirements.txt"]
    },
    {
      id: 3,
      title: "UI/UX Design Prototype",
      course: "UI/UX Design Principles",
      dueDate: "2024-04-18",
      submittedDate: "2024-04-17",
      status: "submitted",
      grade: null,
      maxGrade: 100,
      description: "Create a high-fidelity prototype for a mobile application",
      type: "Design",
      difficulty: "Medium",
      estimatedTime: "10 hours",
      attachments: ["design_brief.pdf", "figma_template.fig"]
    },
    {
      id: 4,
      title: "Project Management Case Study",
      course: "Project Management Essentials",
      dueDate: "2024-04-10",
      submittedDate: null,
      status: "overdue",
      grade: null,
      maxGrade: 100,
      description: "Analyze a failed project and propose alternative management strategies",
      type: "Essay",
      difficulty: "Easy",
      estimatedTime: "6 hours",
      attachments: ["case_study.pdf", "template.docx"]
    },
    {
      id: 5,
      title: "Machine Learning Model Training",
      course: "Data Science with Python",
      dueDate: "2024-04-25",
      submittedDate: "2024-04-22",
      status: "graded",
      grade: 88,
      maxGrade: 100,
      description: "Train and evaluate a machine learning model on provided dataset",
      type: "Coding",
      difficulty: "Hard",
      estimatedTime: "15 hours",
      attachments: ["dataset.csv", "notebook_template.ipynb"]
    },
    {
      id: 6,
      title: "SEO Audit Report",
      course: "Digital Marketing Fundamentals",
      dueDate: "2024-04-22",
      submittedDate: null,
      status: "pending",
      grade: null,
      maxGrade: 100,
      description: "Conduct a comprehensive SEO audit for a given website",
      type: "Report",
      difficulty: "Medium",
      estimatedTime: "8 hours",
      attachments: ["audit_checklist.pdf", "report_template.docx"]
    }
  ], []);

  // Assignment stats
  const assignmentStats = useMemo(() => {
    const total = assignments.length;
    const pending = assignments.filter(a => a.status === "pending").length;
    const submitted = assignments.filter(a => a.status === "submitted").length;
    const graded = assignments.filter(a => a.status === "graded").length;
    const overdue = assignments.filter(a => a.status === "overdue").length;
    const averageGrade = assignments
      .filter(a => a.grade !== null)
      .reduce((sum, a) => sum + (a.grade || 0), 0) / assignments.filter(a => a.grade !== null).length;

    return {
      total,
      pending,
      submitted,
      graded,
      overdue,
      averageGrade: averageGrade ? averageGrade.toFixed(1) : "N/A"
    };
  }, [assignments]);

  // Filter assignments based on status and search
  const filteredAssignments = useMemo(() => {
    let filtered = assignments;
    
    if (selectedStatus !== "all") {
      filtered = filtered.filter(assignment => assignment.status === selectedStatus);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(assignment => 
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      </div>
    </div>
  );

  // Assignment Card Component
  const AssignmentCard = ({ assignment }: { assignment: any }) => {
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
              {assignment.course}
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
        {assignment.grade !== null && (
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
              {assignment.attachments.map((file: string, index: number) => (
                <span key={index} className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                  <Download className="w-3 h-3 mr-1" />
                  {file}
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
            <button className="flex-1 flex items-center justify-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm">
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

  if (!isClient) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <AssignmentPreloader />
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
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No assignments found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedStatus("all");
                }}
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AssignmentsMain; 