"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Calendar, Clock, Star, Eye, Play, BookOpen, Users, User, FileText, Trophy, Target, Brain, CalendarDays, Timer, AlarmClock, Globe, Loader2, ChevronRight, Check } from "lucide-react";
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
  status?: 'available' | 'completed' | 'in-progress' | 'locked' | 'overdue';
  level?: 'beginner' | 'intermediate' | 'advanced';
  score?: number;
  description?: string;
  dueDate?: string;
  courseInfo?: {
    id: string;
    name: string;
    code: string;
  };
  timeUntilDue?: number; // minutes
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
  isUrgent?: boolean;
}

// Enhanced TabButton matching upcoming classes style
const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children, count, isUrgent }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`relative inline-flex items-center justify-center w-32 sm:w-40 px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm font-medium rounded-xl transition-all duration-300 overflow-hidden group ${
      active
        ? isUrgent 
          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg animate-pulse'
          : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
        : isUrgent
        ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700 animate-pulse'
        : 'bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-gray-700/80 border border-gray-200 dark:border-gray-700'
    }`}
  >
    {/* Animated background for active state */}
    {active && !isUrgent && (
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 animate-pulse"></div>
    )}
    
    {/* Urgent indicator pulse */}
    {isUrgent && (
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 animate-pulse"></div>
    )}
    
    <span className="relative z-10 flex items-center gap-2">
      {children}
      {isUrgent && (
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
      )}
      {count !== undefined && count > 0 && (
        <span className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full ${
          active 
            ? 'bg-white/20 text-white' 
            : isUrgent
            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
        }`}>
          {count}
        </span>
      )}
    </span>
  </motion.button>
);

// Countdown Timer Component for quiz due dates
const CountdownTimer: React.FC<{ targetDate: string; className?: string }> = ({ targetDate, className = "" }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.isExpired) {
    return <span className={`text-red-500 font-medium ${className}`}>Quiz overdue</span>;
  }

  if (timeLeft.days > 0) {
    return (
      <span className={`text-gray-600 dark:text-gray-400 ${className}`}>
        Due in {timeLeft.days}d {timeLeft.hours}h
      </span>
    );
  }

  if (timeLeft.hours > 0) {
    return (
      <span className={`text-orange-600 dark:text-orange-400 font-medium ${className}`}>
        Due in {timeLeft.hours}h {timeLeft.minutes}m
      </span>
    );
  }

  if (timeLeft.minutes > 30) {
    return (
      <span className={`text-yellow-600 dark:text-yellow-400 font-medium ${className}`}>
        Due in {timeLeft.minutes}m
      </span>
    );
  }

  return (
    <span className={`text-red-500 font-bold animate-pulse ${className}`}>
      Due in {timeLeft.minutes}m {timeLeft.seconds}s
    </span>
  );
};

// Enhanced Quiz Card Component matching upcoming classes style
const QuizCard = ({ quiz, onViewDetails }: { quiz: Quiz; onViewDetails: (quiz: Quiz) => void }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const dueDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (dueDate.getTime() === today.getTime()) {
      return `Due today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (dueDate.getTime() === tomorrow.getTime()) {
      return `Due tomorrow at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return `Due ${date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      })} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
  };

  const getStatusInfo = (status?: string, dueDate?: string) => {
    if (!dueDate) return { color: 'bg-gray-100 text-gray-700', text: 'No due date', icon: Calendar };

    const now = new Date();
    const due = new Date(dueDate);
    const minutesUntil = Math.floor((due.getTime() - now.getTime()) / (1000 * 60));

    switch (status) {
      case 'completed':
        return { color: 'bg-green-100 text-green-700', text: 'Completed', icon: Check };
      case 'in-progress':
        return { color: 'bg-yellow-100 text-yellow-700', text: 'In Progress', icon: Play };
      case 'locked':
        return { color: 'bg-red-100 text-red-700', text: 'Locked', icon: X };
      case 'overdue':
        return { color: 'bg-red-100 text-red-700 animate-pulse', text: 'Overdue', icon: Timer };
      default:
        if (minutesUntil <= 0) {
          return { color: 'bg-red-100 text-red-700', text: 'Overdue', icon: Timer };
        } else if (minutesUntil <= 60) {
          return { color: 'bg-red-100 text-red-700', text: `Due in ${minutesUntil}m`, icon: Timer };
        } else if (minutesUntil <= 1440) { // within 24 hours
          const hours = Math.floor(minutesUntil / 60);
          return { color: 'bg-orange-100 text-orange-700', text: `Due in ${hours}h`, icon: Clock };
        } else {
          const days = Math.floor(minutesUntil / 1440);
          return { color: 'bg-blue-100 text-blue-700', text: `Due in ${days}d`, icon: CalendarDays };
        }
    }
  };

  const statusInfo = getStatusInfo(quiz.status, quiz.dueDate);
  const StatusIcon = statusInfo.icon;

  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 relative overflow-hidden"
    >
      {/* Status indicator stripe */}
      <div className={`absolute top-0 left-0 w-full h-1 ${
        statusInfo.text === 'Completed' ? 'bg-green-500' :
        statusInfo.text === 'Overdue' ? 'bg-red-500' :
        statusInfo.text === 'In Progress' ? 'bg-yellow-500' :
        statusInfo.text.includes('Due in') && (statusInfo.text.includes('m') || statusInfo.text.includes('h')) ? 'bg-orange-500' :
        'bg-blue-500'
      }`} />

      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
              {quiz?.title || "No Title Available"}
            </h3>
            {quiz?.status === 'completed' && (
              <div className="flex items-center px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                <Check className="w-3 h-3 mr-1" />
                Done
              </div>
            )}
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {quiz?.courseInfo?.name || quiz?.category || "General Quiz"}
          </p>
          
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
            <div className="flex items-center">
              <User className="w-3 h-3 mr-1" />
              {quiz?.instructor?.name || "Instructor"}
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {quiz?.duration ? `${quiz.duration} min` : "No time limit"}
            </div>
          </div>
        
          {/* Countdown Timer */}
          {quiz?.dueDate && quiz.status !== 'completed' && (
            <div className="mb-3">
              <CountdownTimer 
                targetDate={quiz.dueDate} 
                className="text-sm font-medium"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className={`px-2 py-1 text-xs rounded-full ${statusInfo.color} flex items-center gap-1`}>
            <StatusIcon className="w-3 h-3" />
            <span className="font-medium">{statusInfo.text}</span>
          </div>
        </div>
      </div>

      {/* Quiz Stats */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Target className="w-4 h-4 text-blue-500 mr-1" />
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
          <Brain className="w-4 h-4 text-blue-500 mr-1" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Attempts: {quiz?.attempts || 0}/{quiz?.maxAttempts || 'Unlimited'}
          </span>
        </div>
        {quiz?.instructor?.rating && (
          <div className="flex items-center">
            <Star className="w-4 h-4 text-blue-400 fill-current mr-1" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {quiz.instructor.rating}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button 
          onClick={() => onViewDetails(quiz)}
          className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
        >
          <Eye className="w-4 h-4 text-blue-500 mr-2" />
          View Details
        </button>
        <button
          className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg transition-colors text-sm ${
            quiz?.status === 'completed' 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : quiz?.status === 'in-progress'
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
              : quiz?.status === 'locked'
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
          disabled={quiz?.status === 'locked'}
        >
          {quiz?.status === 'completed' ? (
            <>
              <Trophy className="w-4 h-4 text-white mr-2" />
              View Results
            </>
          ) : quiz?.status === 'in-progress' ? (
            <>
              <Play className="w-4 h-4 text-white mr-2" />
              Continue
            </>
          ) : quiz?.status === 'locked' ? (
            <>
              <X className="w-4 h-4 text-gray-200 mr-2" />
              Locked
            </>
          ) : (
            <>
              <Play className="w-4 h-4 text-white mr-2" />
              Start Quiz
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

const StudentQuizzes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch quizzes from API
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // TODO: Replace with actual API call
        // Example API call structure:
        // const response = await fetch('/api/student/quizzes');
        // const data = await response.json();
        // setQuizzes(data.quizzes || []);
        
        // For now, set empty array until API is integrated
        setQuizzes([]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        setError('Failed to load quizzes');
        setLoading(false);
      }
    };

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
      case 0: // All Quizzes
        filtered = quizzes;
        break;
      case 1: // Available
        filtered = quizzes.filter(quiz => quiz.status === 'available' || quiz.status === 'in-progress');
        break;
      case 2: // Due Today
        const today = new Date().toDateString();
        filtered = quizzes.filter(quiz => {
          if (!quiz.dueDate) return false;
          return new Date(quiz.dueDate).toDateString() === today;
        });
        break;
      case 3: // Completed
        filtered = quizzes.filter(quiz => quiz.status === 'completed');
        break;
      default:
        break;
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.instructor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.courseInfo?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      // Sort by status priority, then by due date
      const statusPriority = {
        'overdue': 1,
        'in-progress': 2,
        'available': 3,
        'completed': 4,
        'locked': 5
      };
      
      const aPriority = statusPriority[a.status || 'available'];
      const bPriority = statusPriority[b.status || 'available'];
      
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  };

  const filteredContent = getFilteredQuizzes();

  // Count quizzes for each tab
  const tabCounts = {
    all: quizzes.length,
    available: quizzes.filter(quiz => quiz.status === 'available' || quiz.status === 'in-progress').length,
    dueToday: quizzes.filter(quiz => {
      if (!quiz.dueDate) return false;
      const today = new Date().toDateString();
      return new Date(quiz.dueDate).toDateString() === today;
    }).length,
    completed: quizzes.filter(quiz => quiz.status === 'completed').length
  };

  // Get urgent quiz count for special highlighting
  const urgentQuizCount = quizzes.filter(quiz => {
    if (!quiz.dueDate || quiz.status === 'completed') return false;
    const minutesUntil = Math.floor((new Date(quiz.dueDate).getTime() - new Date().getTime()) / (1000 * 60));
    return minutesUntil <= 1440; // Due within 24 hours
  }).length;

  const tabs = [
    { name: "All", icon: BookOpen, count: tabCounts.all },
    { name: "Available", icon: Play, count: tabCounts.available },
    { name: "Due Today", icon: Timer, count: tabCounts.dueToday, isUrgent: tabCounts.dueToday > 0 },
    { name: "Completed", icon: Trophy, count: tabCounts.completed }
  ];

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
              <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
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
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            />
          </motion.div>
        </div>

        {/* Enhanced Tabs */}
        <div className="flex justify-center">
          <div className="flex flex-wrap justify-center gap-2 bg-gray-100/80 dark:bg-gray-800/80 rounded-2xl p-1.5 backdrop-blur-sm">
            {tabs.map((tab, idx) => {
              const TabIcon = tab.icon;
              return (
                <TabButton
                  key={idx}
                  active={currentTab === idx}
                  onClick={() => setCurrentTab(idx)}
                  count={tab.count}
                  isUrgent={tab.isUrgent}
                >
                  <TabIcon className="w-4 h-4" />
                  <span className="font-medium">{tab.name}</span>
                </TabButton>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading quizzes...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center"
          >
            <div className="flex items-center justify-center mb-2">
              <X className="w-6 h-6 text-red-500 mr-2" />
              <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Error Loading Quizzes</h3>
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

        {/* Urgent Quizzes Alert Banner */}
        {!loading && !error && urgentQuizCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl p-4 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <h3 className="text-lg font-semibold">
                  {urgentQuizCount} Quiz{urgentQuizCount > 1 ? 'zes' : ''} Due Soon!
                </h3>
              </div>
              <button
                onClick={() => setCurrentTab(2)} // Switch to Due Today tab
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-medium"
              >
                View Due Today
              </button>
            </div>
          </motion.div>
        )}

        {/* Content */}
        {!loading && !error && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
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
                  className="col-span-full flex flex-col items-center justify-center text-center py-16"
                >
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-4">
                    <BookOpen className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {searchTerm ? "No matching quizzes found" : "No quizzes available"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md">
                    {searchTerm 
                      ? "Try adjusting your search term to find what you're looking for."
                      : "You don't have any quizzes yet. Check back later or contact your instructor."}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Enhanced Details Modal */}
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
                className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-2xl max-w-lg w-full relative max-h-[85vh] overflow-y-auto"
              >
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </motion.button>

                <div className="pr-12">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                      <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedQuiz?.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {selectedQuiz?.courseInfo?.name}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Instructor</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{selectedQuiz?.instructor?.name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Duration</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedQuiz?.duration ? `${selectedQuiz.duration} minutes` : "No time limit"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Due Date</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedQuiz?.dueDate ? new Date(selectedQuiz.dueDate).toLocaleString() : "No due date"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Questions & Passing Score</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedQuiz?.totalQuestions} questions, {selectedQuiz?.passingScore}% to pass
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Brain className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Attempts</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedQuiz?.attempts}/{selectedQuiz?.maxAttempts === 0 ? 'Unlimited' : selectedQuiz?.maxAttempts}
                        </p>
                      </div>
                    </div>

                    {selectedQuiz?.description && (
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-blue-500 mt-0.5" />
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

                  <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={handleCloseModal}
                      className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                    >
                      Close
                    </button>
                    <button
                      className={`flex-1 px-4 py-2 rounded-xl font-medium transition-colors ${
                        selectedQuiz?.status === 'completed' 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : selectedQuiz?.status === 'locked'
                          ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                      disabled={selectedQuiz?.status === 'locked'}
                    >
                      {selectedQuiz?.status === 'completed' ? 'View Results' : 
                       selectedQuiz?.status === 'in-progress' ? 'Continue Quiz' : 
                       selectedQuiz?.status === 'locked' ? 'Locked' : 'Start Quiz'}
                    </button>
                  </div>
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