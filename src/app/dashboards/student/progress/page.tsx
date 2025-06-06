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

export default function StudentProgressPage() {
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

  // Sample data (replace with API call)
  useEffect(() => {
    const fetchProgressData = async () => {
      setLoading(true);
      try {
        // Simulate API call with mock data
        const mockData: ICourseProgress[] = [
          {
            course_id: '1',
            course_title: 'Advanced React Development',
            course_image: '/images/courses/react.jpg',
            class_type: 'live',
            progress: 75,
            status: 'in_progress',
            payment_status: 'completed',
            enrollment_date: '2024-01-15',
            last_accessed: '2024-12-01',
            total_lessons: 20,
            completed_lessons: 15,
            total_duration: 1200,
            time_spent: 900,
            grade: 85,
            instructor: 'Dr. Sarah Johnson',
            category: 'Web Development'
          },
          {
            course_id: '2',
            course_title: 'Data Science Fundamentals',
            course_image: '/images/courses/data-science.jpg',
            class_type: 'blended',
            progress: 100,
            status: 'completed',
            payment_status: 'completed',
            enrollment_date: '2024-01-01',
            completion_date: '2024-03-15',
            last_accessed: '2024-03-15',
            total_lessons: 25,
            completed_lessons: 25,
            total_duration: 1800,
            time_spent: 1600,
            grade: 92,
            instructor: 'Prof. Michael Chen',
            category: 'Data Science'
          },
          {
            course_id: '3',
            course_title: 'UI/UX Design Principles',
            course_image: '/images/courses/design.jpg',
            class_type: 'selfPaced',
            progress: 45,
            status: 'in_progress',
            payment_status: 'completed',
            enrollment_date: '2024-02-01',
            last_accessed: '2024-11-28',
            total_lessons: 18,
            completed_lessons: 8,
            total_duration: 900,
            time_spent: 405,
            grade: 78,
            instructor: 'Emily Rodriguez',
            category: 'Design'
          }
        ];

        setProgressData(mockData);
        
        // Calculate stats
        const calculatedStats: IProgressStats = {
          totalCourses: mockData.length,
          completedCourses: mockData.filter(c => c.status === 'completed').length,
          inProgressCourses: mockData.filter(c => c.status === 'in_progress').length,
          totalTimeSpent: mockData.reduce((sum, c) => sum + c.time_spent, 0),
          averageProgress: mockData.reduce((sum, c) => sum + c.progress, 0) / mockData.length,
          completionRate: (mockData.filter(c => c.status === 'completed').length / mockData.length) * 100,
          studyStreak: 15,
          totalGrade: mockData.reduce((sum, c) => sum + (c.grade || 0), 0) / mockData.filter(c => c.grade).length,
          certificatesEarned: mockData.filter(c => c.status === 'completed').length,
          liveSessions: mockData.filter(c => c.class_type === 'live').length,
          blendedCourses: mockData.filter(c => c.class_type === 'blended').length,
          selfPacedCourses: mockData.filter(c => c.class_type === 'selfPaced').length
        };
        
        setStats(calculatedStats);

        // Sample goals
        const mockGoals: ILearningGoal[] = [
          {
            id: '1',
            title: 'Complete 3 courses this quarter',
            target: 3,
            current: 1,
            unit: 'courses',
            deadline: '2024-12-31',
            category: 'completion'
          },
          {
            id: '2',
            title: 'Study 20 hours per week',
            target: 20,
            current: 15,
            unit: 'hours',
            deadline: '2024-12-08',
            category: 'time'
          }
        ];
        
        setGoals(mockGoals);
        
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-6">
        <div className="max-w-7xl mx-auto">
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-6 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      {/* Header Section with Glass Morphism */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-white/20 dark:border-gray-700/20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Learning Progress
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Track your learning journey and achievements
              </p>
            </div>
            
            {/* Filter Controls */}
            <div className="flex flex-wrap gap-4">
              {/* Course Filter */}
              <div className="relative" ref={filterDropdownRef}>
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-all duration-200"
                >
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {filterOptions.find(f => f.id === selectedFilter)?.label}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFilterDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showFilterDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50">
                    <div className="p-2">
                      {filterOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => {
                            setSelectedFilter(option.id);
                            setShowFilterDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
                            selectedFilter === option.id
                              ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{option.label}</span>
                            <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                              {option.count}
                            </span>
                          </div>
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
                  className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-all duration-200"
                >
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {periodOptions.find(p => p.id === selectedPeriod)?.label}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showPeriodDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showPeriodDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50">
                    <div className="p-2">
                      {periodOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => {
                            setSelectedPeriod(option.id);
                            setShowPeriodDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
                            selectedPeriod === option.id
                              ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <span className="text-sm font-medium">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Progress */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-500 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                Overall
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {Math.round(stats.averageProgress)}%
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Average Progress</p>
            <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.averageProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Completed Courses */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-500 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
                Completed
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.completedCourses}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Courses Completed
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">
              {Math.round(stats.completionRate)}% completion rate
            </p>
          </div>

          {/* Time Spent */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-500 bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded-full">
                Study Time
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {formatDuration(stats.totalTimeSpent)}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Study Time
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
              {stats.studyStreak} day streak
            </p>
          </div>

          {/* Certificates */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-500 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded-full">
                Achievements
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.certificatesEarned}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Certificates Earned
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
              Avg. Grade: {Math.round(stats.totalGrade)}%
            </p>
          </div>
        </div>

        {/* Learning Goals Section */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Learning Goals</h2>
            <button
              onClick={() => setShowGoalsModal(true)}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
            >
              Manage Goals
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal) => (
              <div key={goal.id} className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{goal.title}</h3>
                  <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {goal.current} of {goal.target} {goal.unit}
                  </span>
                  <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                    {Math.round((goal.current / goal.target) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-white dark:bg-gray-700 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Due: {formatDate(goal.deadline)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Course Progress Cards */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/20">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Course Progress</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Showing {getFilteredCourses().length} of {progressData.length} courses
            </p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {getFilteredCourses().map((course) => (
                <div key={course.course_id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-300">
                  {/* Course Header */}
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
                  No courses found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No courses match your current filter selection.
                </p>
                <button
                  onClick={() => setSelectedFilter('all')}
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 