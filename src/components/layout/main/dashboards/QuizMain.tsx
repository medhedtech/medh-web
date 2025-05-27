"use client";

import React, { Suspense, useState, useEffect, useMemo } from 'react';
import { motion } from "framer-motion";
import Link from 'next/link';
import {
  FileQuestion,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Play,
  RotateCcw,
  Eye,
  Star,
  BookOpen,
  Filter,
  Search,
  Target,
  Award,
  TrendingUp,
  Timer,
  Brain
} from 'lucide-react';

// TypeScript interfaces
interface IQuiz {
  id: number;
  title: string;
  course: string;
  dueDate: string;
  completedDate: string | null;
  status: "available" | "in-progress" | "completed" | "overdue" | "locked";
  score: number | null;
  maxScore: number;
  description: string;
  type: "Practice" | "Assessment" | "Final" | "Midterm";
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedTime: string;
  questions: number;
  attempts: number;
  maxAttempts: number;
  timeLimit: number; // in minutes
}

interface IQuizStats {
  total: number;
  available: number;
  completed: number;
  inProgress: number;
  overdue: number;
  averageScore: string;
}

interface IColorClasses {
  bg: string;
  text: string;
  border: string;
  hover: string;
}

type ColorType = "blue" | "rose" | "emerald" | "amber" | "purple" | "indigo";

/**
 * QuizMain - Component that displays the quiz content
 * within the student dashboard layout
 */
const QuizMain: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<"all" | "available" | "completed" | "overdue">("all");
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

  // Mock quiz data
  const quizzes = useMemo<IQuiz[]>(() => [
    {
      id: 1,
      title: "Digital Marketing Fundamentals Quiz",
      course: "Digital Marketing Fundamentals",
      dueDate: "2024-04-15",
      completedDate: "2024-04-12",
      status: "completed",
      score: 85,
      maxScore: 100,
      description: "Test your knowledge of digital marketing concepts and strategies",
      type: "Assessment",
      difficulty: "Medium",
      estimatedTime: "30 minutes",
      questions: 25,
      attempts: 1,
      maxAttempts: 3,
      timeLimit: 45
    },
    {
      id: 2,
      title: "Python Data Structures Quiz",
      course: "Data Science with Python",
      dueDate: "2024-04-20",
      completedDate: null,
      status: "available",
      score: null,
      maxScore: 100,
      description: "Evaluate your understanding of Python data structures and algorithms",
      type: "Practice",
      difficulty: "Hard",
      estimatedTime: "45 minutes",
      questions: 30,
      attempts: 0,
      maxAttempts: 5,
      timeLimit: 60
    },

    {
      id: 4,
      title: "Project Management Final Quiz",
      course: "Project Management Essentials",
      dueDate: "2024-04-10",
      completedDate: null,
      status: "overdue",
      score: null,
      maxScore: 100,
      description: "Comprehensive assessment of project management methodologies",
      type: "Final",
      difficulty: "Hard",
      estimatedTime: "60 minutes",
      questions: 50,
      attempts: 0,
      maxAttempts: 1,
      timeLimit: 90
    },
    {
      id: 5,
      title: "Machine Learning Basics Quiz",
      course: "Data Science with Python",
      dueDate: "2024-04-25",
      completedDate: "2024-04-22",
      status: "completed",
      score: 92,
      maxScore: 100,
      description: "Assess your understanding of machine learning fundamentals",
      type: "Assessment",
      difficulty: "Hard",
      estimatedTime: "50 minutes",
      questions: 40,
      attempts: 2,
      maxAttempts: 3,
      timeLimit: 75
    },
    {
      id: 6,
      title: "SEO Fundamentals Quiz",
      course: "Digital Marketing Fundamentals",
      dueDate: "2024-04-22",
      completedDate: null,
      status: "available",
      score: null,
      maxScore: 100,
      description: "Test your knowledge of search engine optimization techniques",
      type: "Practice",
      difficulty: "Easy",
      estimatedTime: "25 minutes",
      questions: 20,
      attempts: 0,
      maxAttempts: 5,
      timeLimit: 35
    }
  ], []);

  // Quiz stats
  const quizStats = useMemo<IQuizStats>(() => {
    const total = quizzes.length;
    const available = quizzes.filter(q => q.status === "available").length;
    const completed = quizzes.filter(q => q.status === "completed").length;
    const inProgress = quizzes.filter(q => q.status === "in-progress").length;
    const overdue = quizzes.filter(q => q.status === "overdue").length;
    const averageScore = quizzes
      .filter(q => q.score !== null)
      .reduce((sum, q) => sum + (q.score || 0), 0) / quizzes.filter(q => q.score !== null).length;

    return {
      total,
      available,
      completed,
      inProgress,
      overdue,
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
      case "available":
        return {
          color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
          icon: <Play className="w-4 h-4" />,
          label: "Available"
        };
      case "in-progress":
        return {
          color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
          icon: <Clock className="w-4 h-4" />,
          label: "In Progress"
        };
      case "completed":
        return {
          color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
          icon: <CheckCircle className="w-4 h-4" />,
          label: "Completed"
        };
      case "overdue":
        return {
          color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
          icon: <XCircle className="w-4 h-4" />,
          label: "Overdue"
        };
      case "locked":
        return {
          color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
          icon: <AlertCircle className="w-4 h-4" />,
          label: "Locked"
        };
      default:
        return {
          color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
          icon: <FileQuestion className="w-4 h-4" />,
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

  // Get quiz type color
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Practice":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "Assessment":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      case "Midterm":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
      case "Final":
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

        {/* Available */}
        <div className="text-center flex-1 min-w-[80px]">
          <div className="text-2xl sm:text-3xl font-bold mb-1">{quizStats.available}</div>
          <div className="text-primary-100 text-xs sm:text-sm font-medium">Available</div>
        </div>

        {/* Average Score */}
        <div className="text-center flex-1 min-w-[100px]">
          <div className="text-3xl sm:text-4xl font-bold mb-1 text-yellow-200">{quizStats.averageScore}</div>
          <div className="text-primary-100 text-xs sm:text-sm font-medium uppercase tracking-wide whitespace-nowrap">Average Score</div>
        </div>

        {/* Completed */}
        <div className="text-center flex-1 min-w-[80px]">
          <div className="text-2xl sm:text-3xl font-bold mb-1">{quizStats.completed}</div>
          <div className="text-primary-100 text-xs sm:text-sm font-medium">Completed</div>
        </div>

        {/* In Progress */}
        <div className="text-center flex-1 min-w-[80px]">
          <div className="text-2xl sm:text-3xl font-bold mb-1">{quizStats.inProgress}</div>
          <div className="text-primary-100 text-xs sm:text-sm font-medium whitespace-nowrap">In Progress</div>
        </div>
      </div>
    </div>
  );

  // Quiz Card Component
  const QuizCard = ({ quiz }: { quiz: IQuiz }) => {
    const statusInfo = getStatusInfo(quiz.status);
    const isOverdue = quiz.status === "overdue";
    const daysUntilDue = Math.ceil((new Date(quiz.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));

    return (
      <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 border ${isOverdue ? 'border-red-200 dark:border-red-800' : 'border-gray-200 dark:border-gray-700'} hover:shadow-lg transition-all duration-300`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                {statusInfo.icon}
                <span className="ml-1">{statusInfo.label}</span>
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                {quiz.difficulty}
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(quiz.type)}`}>
                {quiz.type}
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
            {quiz.timeLimit} min limit
          </div>
          <div className="flex items-center">
            <FileQuestion className="w-3 h-3 mr-1" />
            {quiz.questions} questions
          </div>
          <div className="flex items-center">
            <Target className="w-3 h-3 mr-1" />
            {quiz.maxScore} points
          </div>
        </div>

        {/* Attempts Info */}
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
          <div className="flex items-center">
            <RotateCcw className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Attempts: {quiz.attempts}/{quiz.maxAttempts}
            </span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {quiz.estimatedTime}
          </div>
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
        {quiz.status === "available" && daysUntilDue <= 3 && daysUntilDue > 0 && (
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
          {quiz.status === "available" && (
            <button className="flex-1 flex items-center justify-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm">
              <Play className="w-4 h-4 mr-2" />
              Start Quiz
            </button>
          )}
          {quiz.status === "in-progress" && (
            <button className="flex-1 flex items-center justify-center px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm">
              <Clock className="w-4 h-4 mr-2" />
              Continue
            </button>
          )}
          {quiz.status === "completed" && quiz.attempts < quiz.maxAttempts && (
            <button className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake
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
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-18"></div>
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
            <Brain className="w-8 h-8 text-primary-500 mr-3" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">
              Quizzes
            </h1>
          </div>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
            Test your knowledge, track your progress, and improve your understanding
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
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            {/* Status Filter */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {[
                { key: "all", label: "All", icon: FileQuestion },
                { key: "available", label: "Available", icon: Play },
                { key: "completed", label: "Completed", icon: CheckCircle },
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
              <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
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