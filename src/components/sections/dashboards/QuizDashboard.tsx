"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Calendar, Clock, Star, Eye, Play, BookOpen, Users, User, FileText, Trophy, Target, Brain } from "lucide-react";
import { toast } from "react-toastify";
import StudentDashboardLayout from "./StudentDashboardLayout";

interface Quiz {
  id: string;
  title: string;
  instructor?: {
    name: string;
    rating: number;
  };
  category?: string;
  duration?: number;
  totalQuestions?: number;
  passingScore?: number;
  attempts?: number;
  maxAttempts?: number;
  status?: 'available' | 'completed' | 'in-progress' | 'locked';
  level?: 'beginner' | 'intermediate' | 'advanced';
  score?: number;
  description?: string;
  dueDate?: string;
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

// Updated TabButton with blog-style filter button styling
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

// Quiz Card Component - matching demo classes style
const QuizCard = ({ quiz, onViewDetails }: { quiz: Quiz; onViewDetails: (quiz: Quiz) => void }) => {
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
      return `Was due ${date.toLocaleDateString()}`;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'available':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'in-progress':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'locked':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
    }
  };

  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'intermediate':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'advanced':
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
            {quiz?.title || "No Title Available"}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            by {quiz?.instructor?.name || "No instructor"}
          </p>
          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(quiz?.dueDate)}
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {quiz?.duration ? `${quiz.duration} min` : "No time limit"}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full">
          <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
        
      {/* Category, Status and Level */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {quiz?.category && (
            <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-full">
              {quiz.category}
            </span>
          )}
          {quiz?.status && (
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(quiz.status)}`}>
              {quiz.status === 'in-progress' && <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-1 animate-pulse"></span>}
              {quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1).replace('-', ' ')}
            </span>
          )}
          {quiz?.level && (
            <span className={`px-2 py-1 text-xs rounded-full ${getLevelColor(quiz.level)}`}>
              {quiz.level.charAt(0).toUpperCase() + quiz.level.slice(1)}
            </span>
          )}
        </div>
      </div>

      {/* Quiz Stats */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Target className="w-4 h-4 text-green-500 mr-1" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {quiz?.totalQuestions || 0} Questions
          </span>
        </div>
        <div className="flex items-center text-blue-600 dark:text-blue-400">
          <Trophy className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">
            {quiz?.score !== undefined ? `${quiz.score}%` : `${quiz?.passingScore || 70}% to pass`}
          </span>
        </div>
      </div>

      {/* Attempts */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Brain className="w-4 h-4 text-purple-500 mr-1" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Attempts: {quiz?.attempts || 0}/{quiz?.maxAttempts || 'Unlimited'}
          </span>
        </div>
        {quiz?.instructor?.rating && (
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {quiz.instructor.rating}
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      {quiz?.description && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {quiz.description}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-2">
        <button 
          onClick={() => onViewDetails(quiz)}
          className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </button>
        <button
          className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg transition-colors text-sm ${
            quiz?.status === 'completed' 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : quiz?.status === 'in-progress'
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
              : quiz?.status === 'locked'
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700 text-white'
          }`}
          disabled={quiz?.status === 'locked'}
        >
          {quiz?.status === 'completed' ? (
            <>
              <Trophy className="w-4 h-4 mr-2" />
              View Results
            </>
          ) : quiz?.status === 'in-progress' ? (
            <>
              <Play className="w-4 h-4 mr-2" />
              Continue
            </>
          ) : quiz?.status === 'locked' ? (
            <>
              <X className="w-4 h-4 mr-2" />
              Locked
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Start Quiz
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Quiz Results Summary Component
const QuizResultsSummary: React.FC = () => {
  const [results, setResults] = useState([]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quiz Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">88.5%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Average Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">12</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Quizzes Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">18.5</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg. Time (min)</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((result, index) => (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {result.quizTitle}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Completed on {new Date(result.completedAt).toLocaleDateString()}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                result.score >= 90 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                result.score >= 80 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                result.score >= 70 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
              }`}>
                {result.score}%
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Correct Answers:</span>
                <span className="font-medium">{result.correctAnswers}/{result.totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span>Time Taken:</span>
                <span className="font-medium">{result.timeTaken} minutes</span>
              </div>
            </div>
            
            <div className="mt-4 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${result.score}%` }}
              ></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const StudentQuizzes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  const tabs = [
    { name: "Available Quizzes", icon: BookOpen },
    { name: "Completed Quizzes", icon: Trophy },
    { name: "Quiz Results", icon: Target },
    { name: "Practice Tests", icon: Brain }
  ];

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  const fetchQuizzes = async () => {
    try {
      // Simulate API call
      console.log('Fetching quizzes...');
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      toast.error('Failed to load quizzes');
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleViewDetails = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
  };

  const handleCloseModal = () => {
    setSelectedQuiz(null);
  };

  const getFilteredQuizzes = () => {
    let filtered = quizzes;
    
    // Filter by tab
    switch (currentTab) {
      case 0: // Available Quizzes
        filtered = quizzes.filter(quiz => quiz.status === 'available' || quiz.status === 'in-progress');
        break;
      case 1: // Completed Quizzes
        filtered = quizzes.filter(quiz => quiz.status === 'completed');
        break;
      case 3: // Practice Tests
        filtered = quizzes.filter(quiz => quiz.category === 'Practice');
        break;
      default:
        break;
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.instructor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredContent = getFilteredQuizzes();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 lg:p-12 rounded-lg max-w-7xl mx-auto"
    >
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="text-center pt-6 pb-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-center mb-4"
          >
            <div className="p-2 bg-primary-100/80 dark:bg-primary-900/30 rounded-xl backdrop-blur-sm mr-3">
              <BookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Quizzes
            </h1>
          </motion.div>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4 mb-6">
            Take quizzes, track your progress, and improve your knowledge across various subjects
          </p>

          {/* Search Bar */}
          <motion.div 
            className="relative max-w-md mx-auto"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
            />
          </motion.div>
        </div>

        {/* Tabs - in a box container */}
        <div className="flex justify-center">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {tabs.map((tab, idx) => {
              return (
                <TabButton
                  key={idx}
                  active={currentTab === idx}
                  onClick={() => setCurrentTab(idx)}
                >
                  <span className="relative z-10 font-medium">{tab.name}</span>
                </TabButton>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {currentTab === 2 ? (
            // Show quiz results for "Quiz Results" tab
            <motion.div
              key="quiz-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <QuizResultsSummary />
            </motion.div>
          ) : (
            // Show quizzes for other tabs
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {filteredContent.length > 0 ? (
                filteredContent.map((quiz, index) => (
                  <motion.div
                    key={quiz.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <QuizCard
                      quiz={quiz}
                      onViewDetails={handleViewDetails}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="col-span-full flex flex-col items-center justify-center text-center py-12"
                >
                  <BookOpen className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {searchTerm ? "No quizzes found" : "No quizzes available"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchTerm 
                      ? "Try adjusting your search term to find what you're looking for."
                      : "There are no quizzes available in this category yet."}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Details Modal */}
        <AnimatePresence>
          {selectedQuiz && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50"
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl max-w-md w-full relative"
              >
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </motion.button>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Quiz Details
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedQuiz?.title}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Instructor</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{selectedQuiz?.instructor?.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Due Date</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedQuiz?.dueDate ? new Date(selectedQuiz.dueDate).toLocaleString() : "No due date"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Duration</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedQuiz?.duration ? `${selectedQuiz.duration} minutes` : "No time limit"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Questions & Passing Score</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedQuiz?.totalQuestions} questions, {selectedQuiz?.passingScore}% to pass
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Brain className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Attempts</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedQuiz?.attempts}/{selectedQuiz?.maxAttempts === 0 ? 'Unlimited' : selectedQuiz?.maxAttempts}
                      </p>
                    </div>
                  </div>

                  {selectedQuiz?.description && (
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-primary-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Description</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{selectedQuiz.description}</p>
                      </div>
                    </div>
                  )}

                  {(!selectedQuiz?.description) && (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                      No additional details available for this quiz.
                    </p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const QuizDashboard: React.FC = () => {
  return (
    <StudentDashboardLayout 
      userRole="student"
      fullName="Student"
      userEmail="student@example.com"
      userImage=""
      userNotifications={0}
      userSettings={{
        theme: "light",
        language: "en",
        notifications: true
      }}
    >
      <StudentQuizzes />
    </StudentDashboardLayout>
  );
};

export default QuizDashboard; 