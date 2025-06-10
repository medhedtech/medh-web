"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  BookOpen, 
  Calendar, 
  Clock, 
  Award, 
  Target,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  CheckCircle,
  AlertCircle,
  Eye,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  GraduationCap,
  Timer,
  Star,
  Trophy,
  BookMarked,
  Users
} from 'lucide-react';
import StudentDashboardLayout from '@/components/sections/dashboards/StudentDashboardLayout';

// TypeScript Interfaces
interface ICourseProgress {
  course_id: string;
  course_title: string;
  course_image?: string;
  class_type: 'live' | 'blended' | 'selfPaced';
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
  payment_status: 'pending' | 'completed' | 'failed';
  enrollment_date: string;
  completion_date?: string;
  last_accessed?: string;
  total_lessons: number;
  completed_lessons: number;
  total_duration: number; // in minutes
  time_spent: number; // in minutes
  grade?: number;
  instructor: string;
  category: string;
}

interface IProgressStats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalTimeSpent: number; // in minutes
  averageProgress: number;
  completionRate: number;
  studyStreak: number;
  totalGrade: number;
  certificatesEarned: number;
  liveSessions: number;
  blendedCourses: number;
  selfPacedCourses: number;
}

interface ILearningGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  category: 'completion' | 'time' | 'grade';
}

const StudentProgressContent: React.FC = () => {
  const router = useRouter();
  
  // State management
  const [progressData, setProgressData] = useState<ICourseProgress[]>([]);
  const [stats, setStats] = useState<IProgressStats>({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalTimeSpent: 0,
    averageProgress: 0,
    completionRate: 0,
    studyStreak: 0,
    totalGrade: 0,
    certificatesEarned: 0,
    liveSessions: 0,
    blendedCourses: 0,
    selfPacedCourses: 0
  });
  const [goals, setGoals] = useState<ILearningGoal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false);
  const [showPeriodDropdown, setShowPeriodDropdown] = useState<boolean>(false);
  const [expandedCourses, setExpandedCourses] = useState<Record<string, boolean>>({});
  
  // Modal states
  const [showGoalsModal, setShowGoalsModal] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<ICourseProgress | null>(null);
  
  // Refs for dropdown management
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const periodDropdownRef = useRef<HTMLDivElement>(null);

  // Filter options
  const filterOptions = [
    { id: 'all', label: 'All Courses', count: progressData.length },
    { id: 'in_progress', label: 'In Progress', count: stats.inProgressCourses },
    { id: 'completed', label: 'Completed', count: stats.completedCourses },
    { id: 'not_started', label: 'Not Started', count: progressData.filter(c => c.status === 'not_started').length },
    { id: 'live', label: 'Live Classes', count: stats.liveSessions },
    { id: 'blended', label: 'Blended Learning', count: stats.blendedCourses },
    { id: 'selfPaced', label: 'Self-Paced', count: stats.selfPacedCourses }
  ];

  const periodOptions = [
    { id: 'all', label: 'All Time' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' },
    { id: 'year', label: 'This Year' }
  ];

  // Fetch progress data from API
  useEffect(() => {
    const fetchProgressData = async () => {
      setLoading(true);
      try {
        setError(null);
        
        // TODO: Replace with actual API calls
        // const response = await fetch('/api/student/progress');
        // const data = await response.json();
        
        // For now, set empty arrays since mock data is removed
        setProgressData([]);
        
        // Reset stats to default values
        const defaultStats: IProgressStats = {
          totalCourses: 0,
          completedCourses: 0,
          inProgressCourses: 0,
          totalTimeSpent: 0,
          averageProgress: 0,
          completionRate: 0,
          studyStreak: 0,
          totalGrade: 0,
          certificatesEarned: 0,
          liveSessions: 0,
          blendedCourses: 0,
          selfPacedCourses: 0
        };
        
        setStats(defaultStats);

        // Reset goals to empty array
        setGoals([]);
        
      } catch (err) {
        setError('Failed to load progress data');
        console.error('Error fetching progress data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false);
      }
      if (periodDropdownRef.current && !periodDropdownRef.current.contains(event.target as Node)) {
        setShowPeriodDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Utility functions
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'in_progress':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'not_started':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'paused':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'live':
        return <Zap className="w-4 h-4" />;
      case 'blended':
        return <BookOpen className="w-4 h-4" />;
      case 'selfPaced':
        return <Timer className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getFilteredCourses = () => {
    if (selectedFilter === 'all') return progressData;
    if (selectedFilter === 'live') return progressData.filter(c => c.class_type === 'live');
    if (selectedFilter === 'blended') return progressData.filter(c => c.class_type === 'blended');
    if (selectedFilter === 'selfPaced') return progressData.filter(c => c.class_type === 'selfPaced');
    return progressData.filter(c => c.status === selectedFilter);
  };

  const toggleCourseDetails = (courseId: string) => {
    setExpandedCourses(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  const handleViewCourse = (course: ICourseProgress) => {
    router.push(`/integrated-lessons/${course.course_id}`);
  };

  const handleDownloadCertificate = (course: ICourseProgress) => {
    if (course.status === 'completed') {
      // Simulate certificate download
      alert(`Downloading certificate for ${course.course_title}`);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Progress</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
          Learning Progress
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Track your learning journey and achievements
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCourses}</p>
            </div>
            <BookOpen className="w-8 h-8 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedCourses}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.inProgressCourses}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Time Spent</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatDuration(stats.totalTimeSpent)}</p>
            </div>
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4">
          {/* Course Filter */}
          <div className="relative" ref={filterDropdownRef}>
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">
                {filterOptions.find(opt => opt.id === selectedFilter)?.label || 'All Courses'}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {showFilterDropdown && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50">
                <div className="p-2">
                  {filterOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSelectedFilter(option.id);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedFilter === option.id
                          ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span>{option.label}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{option.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Period Filter */}
          <div className="relative" ref={periodDropdownRef}>
            <button
              onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">
                {periodOptions.find(opt => opt.id === selectedPeriod)?.label || 'All Time'}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {showPeriodDropdown && (
              <div className="absolute top-full left-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50">
                <div className="p-2">
                  {periodOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSelectedPeriod(option.id);
                        setShowPeriodDropdown(false);
                      }}
                      className={`w-full px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                        selectedPeriod === option.id
                          ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Courses List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Course Progress</h2>
          
          <div className="space-y-4">
            {getFilteredCourses().map((course) => (
              <div key={course.course_id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        {getTypeIcon(course.class_type)}
                        <span className="text-white text-xs font-bold ml-1">
                          {course.class_type === 'live' ? 'L' : course.class_type === 'blended' ? 'B' : 'S'}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate">
                          {course.course_title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {course.instructor} • {course.category}
                        </p>
                        
                        {/* Progress Bar */}
                        <div className="flex items-center space-x-3">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {course.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(course.status)}`}>
                        {course.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <button
                        onClick={() => toggleCourseDetails(course.course_id)}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      >
                        {expandedCourses[course.course_id] ? 
                          <ChevronUp className="w-5 h-5" /> : 
                          <ChevronDown className="w-5 h-5" />
                        }
                      </button>
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <BookMarked className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mx-auto mb-1" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {course.completed_lessons}/{course.total_lessons}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Lessons</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatDuration(course.time_spent)}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Time Spent</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Star className="w-5 h-5 text-amber-600 dark:text-amber-400 mx-auto mb-1" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {course.grade || 'N/A'}%
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Grade</p>
                    </div>
                  </div>
                </div>
                
                {/* Expanded Details */}
                {expandedCourses[course.course_id] && (
                  <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Course Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Enrollment Date:</span>
                              <span className="text-gray-900 dark:text-white">{formatDate(course.enrollment_date)}</span>
                            </div>
                            {course.completion_date && (
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Completion Date:</span>
                                <span className="text-gray-900 dark:text-white">{formatDate(course.completion_date)}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Last Accessed:</span>
                              <span className="text-gray-900 dark:text-white">
                                {course.last_accessed ? formatDate(course.last_accessed) : 'Never'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Total Duration:</span>
                              <span className="text-gray-900 dark:text-white">{formatDuration(course.total_duration)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Progress Metrics</h4>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600 dark:text-gray-400">Lesson Progress</span>
                                <span className="text-gray-900 dark:text-white">
                                  {Math.round((course.completed_lessons / course.total_lessons) * 100)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${(course.completed_lessons / course.total_lessons) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600 dark:text-gray-400">Time Progress</span>
                                <span className="text-gray-900 dark:text-white">
                                  {Math.round((course.time_spent / course.total_duration) * 100)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${Math.min((course.time_spent / course.total_duration) * 100, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 mt-6">
                        <button
                          onClick={() => handleViewCourse(course)}
                          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                        >
                          <PlayCircle className="w-4 h-4" />
                          Continue Learning
                        </button>
                        
                        <button
                          onClick={() => setSelectedCourse(course)}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                        
                        {course.status === 'completed' && (
                          <button
                            onClick={() => handleDownloadCertificate(course)}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:hover:bg-amber-900/40 text-amber-700 dark:text-amber-400 rounded-lg transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Certificate
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {getFilteredCourses().length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No courses enrolled
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You haven't enrolled in any courses yet. Start your learning journey by browsing our available courses.
              </p>
              <button
                onClick={() => router.push('/courses')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Browse Courses
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StudentProgressDashboard: React.FC = () => {
  const [studentId, setStudentId] = useState<string | null>(null);

  React.useEffect(() => {
    // In a real implementation, you would get the student ID from authentication
    // For demo purposes, we're using a mock ID
    const mockStudentId = '123456789';
    setStudentId(mockStudentId);
    
    // Alternative: Get from local storage or auth service
    // const user = JSON.parse(localStorage.getItem('user') || '{}');
    // setStudentId(user?.id || null);
  }, []);

  return (
    <StudentDashboardLayout 
      userRole="student"
      fullName="Student User" // In real app, get from user data
      userEmail="student@example.com" // In real app, get from user data
      userImage="" // In real app, get from user data
      userNotifications={0}
      userSettings={{
        theme: "light",
        language: "en",
        notifications: true
      }}
    >
      {studentId && <StudentProgressContent />}
    </StudentDashboardLayout>
  );
};

export default StudentProgressDashboard; 