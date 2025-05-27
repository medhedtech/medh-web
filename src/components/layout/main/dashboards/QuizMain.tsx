"use client";

import React, { Suspense, useState, useEffect, useMemo } from 'react';
import { motion } from "framer-motion";
import Link from 'next/link';
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Play,
  Award,
  Eye,
  Star,
  FileText,
  Filter,
  Search,
  Timer,
  Brain,
  Target,
  TrendingUp
} from 'lucide-react';

/**
 * QuizMain - Component that displays the quiz content
 * within the student dashboard layout
 */
const QuizMain: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<"all" | "pending" | "completed" | "graded" | "expired">("all");
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

  // Mock quizzes data
  const quizzes = useMemo(() => [
    {
      id: 1,
      title: "Digital Marketing Concepts",
      course: "Digital Marketing Fundamentals",
      dueDate: "2024-04-15",
      completedDate: "2024-04-12",
      status: "graded",
      score: 92,
      maxScore: 100,
      description: "Test your knowledge of basic digital marketing concepts and strategies",
      type: "Multiple Choice",
      difficulty: "Medium",
      duration: "45 minutes",
      questions: 30,
      attempts: {
        used: 1,
        max: 2
      }
    },
    {
      id: 2,
      title: "Python Data Structures",
      course: "Data Science with Python",
      dueDate: "2024-04-20",
      completedDate: null,
      status: "pending",
      score: null,
      maxScore: 100,
      description: "Test your understanding of Python data structures and algorithms",
      type: "Mixed",
      difficulty: "Hard",
      duration: "60 minutes",
      questions: 25,
      attempts: {
        used: 0,
        max: 2
      }
    },
    {
      id: 3,
      title: "UI/UX Design Principles",
      course: "UI/UX Design Fundamentals",
      dueDate: "2024-04-18",
      completedDate: "2024-04-17",
      status: "completed",
      score: null,
      maxScore: 100,
      description: "Evaluate your knowledge of UI/UX design principles and best practices",
      type: "Multiple Choice",
      difficulty: "Medium",
      duration: "30 minutes",
      questions: 20,
      attempts: {
        used: 1,
        max: 1
      }
    },
    {
      id: 4,
      title: "Project Management Basics",
      course: "Project Management Essentials",
      dueDate: "2024-04-10",
      completedDate: null,
      status: "expired",
      score: null,
      maxScore: 100,
      description: "Test your understanding of project management fundamentals",
      type: "Multiple Choice",
      difficulty: "Easy",
      duration: "30 minutes",
      questions: 25,
      attempts: {
        used: 0,
        max: 2
      }
    },
    {
      id: 5,
      title: "Machine Learning Concepts",
      course: "Data Science with Python",
      dueDate: "2024-04-25",
      completedDate: "2024-04-22",
      status: "graded",
      score: 88,
      maxScore: 100,
      description: "Evaluate your understanding of machine learning concepts and applications",
      type: "Mixed",
      difficulty: "Hard",
      duration: "90 minutes",
      questions: 40,
      attempts: {
        used: 2,
        max: 2
      }
    },
    {
      id: 6,
      title: "SEO Fundamentals",
      course: "Digital Marketing Fundamentals",
      dueDate: "2024-04-22",
      completedDate: null,
      status: "pending",
      score: null,
      maxScore: 100,
      description: "Test your knowledge of SEO principles and strategies",
      type: "Multiple Choice",
      difficulty: "Medium",
      duration: "45 minutes",
      questions: 35,
      attempts: {
        used: 0,
        max: 2
      }
    }
  ], []);

  // Quiz stats
  const quizStats = useMemo(() => {
    const total = quizzes.length;
    const pending = quizzes.filter(q => q.status === "pending").length;
    const completed = quizzes.filter(q => q.status === "completed").length;
    const graded = quizzes.filter(q => q.status === "graded").length;
    const expired = quizzes.filter(q => q.status === "expired").length;
    const averageScore = quizzes
      .filter(q => q.score !== null)
      .reduce((sum, q) => sum + (q.score || 0), 0) / quizzes.filter(q => q.score !== null).length;

    return {
      total,
      pending,
      completed,
      graded,
      expired,
      averageScore: averageScore ? averageScore.toFixed(1) : "N/A"
    };
  }, [quizzes]);

  // Filter quizzes based on status and search
  const filteredQuizzes = useMemo(() => {
    let filtered = quizzes;
    
    if (selectedStatus !== "all") {
      filtered = filtered.filter(quiz => quiz.status === selectedStatus);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(quiz => 
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [quizzes, selectedStatus, searchTerm]);

  // Get status color and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
          icon: <Clock className="w-4 h-4" />,
          label: "Pending"
        };
      case "completed":
        return {
          color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
          icon: <CheckCircle className="w-4 h-4" />,
          label: "Completed"
        };
      case "graded":
        return {
          color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
          icon: <Award className="w-4 h-4" />,
          label: "Graded"
        };
      case "expired":
        return {
          color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
          icon: <XCircle className="w-4 h-4" />,
          label: "Expired"
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

  // Quiz Stats Component
  const QuizStats = () => (
    <div className="bg-gradient-to-r from-primary-500 to-primary-700 dark:from-primary-800 dark:to-primary-900 rounded-2xl p-4 sm:p-6 text-white shadow-lg">
      <div className="flex flex-nowrap items-center justify-between gap-4 sm:gap-6 overflow-x-auto">
        {/* Total Quizzes */}
        <div className="text-center flex-1 min-w-[100px]">
          <div className="text-2xl sm:text-3xl font-bold mb-1">{quizStats.total}</div>
          <div className="text-primary-100 text-xs sm:text-sm font-medium whitespace-nowrap">Total Quizzes</div>
        </div>

        {/* Pending */}
        <div className="text-center flex-1 min-w-[80px]">
          <div className="text-2xl sm:text-3xl font-bold mb-1">{quizStats.pending}</div>
          <div className="text-primary-100 text-xs sm:text-sm font-medium">Pending</div>
        </div>

        {/* Average Score */}
        <div className="text-center flex-1 min-w-[100px]">
          <div className="text-3xl sm:text-4xl font-bold mb-1 text-yellow-200">{quizStats.averageScore}</div>
          <div className="text-primary-100 text-xs sm:text-sm font-medium uppercase tracking-wide whitespace-nowrap">Average Score</div>
        </div>

        {/* Completed */}
        <div className="text-center flex-1 min-w-[80px]">
          <div className="text-2xl sm:text-3xl font-bold mb-1">{quizStats.completed + quizStats.graded}</div>
          <div className="text-primary-100 text-xs sm:text-sm font-medium">Completed</div>
        </div>

        {/* Expired */}
        <div className="text-center flex-1 min-w-[80px]">
          <div className="text-2xl sm:text-3xl font-bold mb-1">{quizStats.expired}</div>
          <div className="text-primary-100 text-xs sm:text-sm font-medium">Expired</div>
        </div>
      </div>
    </div>
  );

  // Quiz Card Component
  const QuizCard = ({ quiz }: { quiz: any }) => {
    const statusInfo = getStatusInfo(quiz.status);
    const isExpired = quiz.status === "expired";
    const daysUntilDue = Math.ceil((new Date(quiz.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));

    return (
      <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 border ${isExpired ? 'border-red-200 dark:border-red-800' : 'border-gray-200 dark:border-gray-700'} hover:shadow-lg transition-all duration-300`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                {statusInfo.icon}
                <span className="ml-1">{statusInfo.label}</span>
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                {quiz.difficulty}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {quiz.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {quiz.course}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              {quiz.description}
            </p>
          </div>
        </div>

        {/* Quiz Info */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            Due: {new Date(quiz.dueDate).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <Timer className="w-3 h-3 mr-1" />
            {quiz.duration}
          </div>
          <div className="flex items-center">
            <Brain className="w-3 h-3 mr-1" />
            {quiz.questions} Questions
          </div>
          <div className="flex items-center">
            <Target className="w-3 h-3 mr-1" />
            {quiz.maxScore} points
          </div>
        </div>

        {/* Attempts Info */}
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Attempts: {quiz.attempts.used}/{quiz.attempts.max}
          </span>
          {quiz.attempts.used < quiz.attempts.max && quiz.status !== "expired" && (
            <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
              {quiz.attempts.max - quiz.attempts.used} remaining
            </span>
          )}
        </div>

        {/* Score Display */}
        {quiz.score !== null && (
          <div className="flex items-center justify-between mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Score: {quiz.score}/{quiz.maxScore}
              </span>
            </div>
            <div className="text-sm font-bold text-green-600 dark:text-green-400">
              {((quiz.score / quiz.maxScore) * 100).toFixed(1)}%
            </div>
          </div>
        )}

        {/* Due Date Warning */}
        {quiz.status === "pending" && daysUntilDue <= 3 && daysUntilDue > 0 && (
          <div className="flex items-center mb-4 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <AlertCircle className="w-4 h-4 text-yellow-500 mr-2" />
            <span className="text-sm text-yellow-700 dark:text-yellow-400">
              Due in {daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          <button className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm">
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </button>
          {quiz.status === "pending" && quiz.attempts.used < quiz.attempts.max && (
            <button className="flex-1 flex items-center justify-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm">
              <Play className="w-4 h-4 mr-2" />
              Start Quiz
            </button>
          )}
          {quiz.status === "graded" && (
            <button className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
              <Eye className="w-4 h-4 mr-2" />
              Review
            </button>
          )}
        </div>
      </div>
    );
  };

  // Quiz Preloader
  const QuizPreloader = () => (
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
        <QuizPreloader />
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
            <BookOpen className="w-8 h-8 text-primary-500 mr-3" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">
              Quizzes
            </h1>
          </div>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
            Take course quizzes, track your progress, and review your performance
          </p>
        </motion.div>

        {/* Quiz Stats */}
        <motion.div variants={itemVariants} className="px-4 sm:px-6 lg:px-8">
          <QuizStats />
        </motion.div>

        {/* Search and Filter */}
        <motion.div variants={itemVariants} className="px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            {/* Status Filter */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {[
                { key: "all", label: "All", icon: BookOpen },
                { key: "pending", label: "Pending", icon: Clock },
                { key: "completed", label: "Completed", icon: CheckCircle },
                { key: "graded", label: "Graded", icon: Award },
                { key: "expired", label: "Expired", icon: XCircle }
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

        {/* Quizzes Grid */}
        <motion.div variants={itemVariants} className="px-4 sm:px-6 lg:px-8">
          {filteredQuizzes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredQuizzes.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No quizzes found
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

export default QuizMain; 