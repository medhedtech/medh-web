"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { instructorApi, StudentProgress } from '@/apis/instructor.api';
import { showToast } from '@/utils/toast';
import { 
  LucideLoader2, 
  LucideAlertCircle,
  LucideCheckCircle,
  LucideInfo,
  LucideRefreshCw,
  LucideUsers,
  LucideTrendingUp,
  LucideTrendingDown,
  LucideSearch,
  LucideFilter,
  LucideEye,
  LucideBarChart3,
  LucideGraduationCap,
  LucideCalendar,
  LucideTarget,
  LucideClock,
  LucideAward,
  LucideMessageCircle,
  LucideDownload,
  LucideChevronDown,
  LucideChevronRight,
  LucideUser
} from 'lucide-react';

// Types and Interfaces
interface StudentProgressData {
  students: StudentProgress[];
  summary: {
    totalStudents: number;
    averageProgress: number;
    excellentPerformers: number;
    needsAttention: number;
    completionRate: number;
  };
  batches: {
    id: string;
    name: string;
    studentCount: number;
  }[];
  loading: boolean;
  error: string | null;
}

interface StudentProgressProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

interface FilterOptions {
  batch: string;
  progressRange: string;
  search: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

// Loading Component
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <LucideLoader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
      <p className="text-gray-600 dark:text-gray-300">Loading student progress...</p>
    </div>
  </div>
);

// Error Component
const ErrorMessage: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center max-w-md">
      <LucideAlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Unable to load student progress
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          <LucideRefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  </div>
);

// Progress Bar Component
const ProgressBar: React.FC<{ 
  progress: number; 
  className?: string; 
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}> = ({ progress, className = '', showPercentage = true, size = 'md' }) => {
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`flex-1 bg-gray-200 dark:bg-gray-700 rounded-full ${sizeClasses[size]}`}>
        <motion.div
          className={`${sizeClasses[size]} rounded-full ${getProgressColor(progress)}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      {showPercentage && (
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 min-w-[3rem]">
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
};

// Summary Stats Component
const SummaryStats: React.FC<{ summary: StudentProgressData['summary'] }> = ({ summary }) => {
  const stats = [
    {
      title: 'Total Students',
      value: summary.totalStudents,
      icon: LucideUsers,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Average Progress',
      value: `${Math.round(summary.averageProgress)}%`,
      icon: LucideTrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Excellent Performers',
      value: summary.excellentPerformers,
      icon: LucideAward,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      title: 'Needs Attention',
      value: summary.needsAttention,
      icon: LucideAlertCircle,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-xl ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Student Card Component
const StudentCard: React.FC<{ 
  student: StudentProgress; 
  onViewDetails: (student: StudentProgress) => void;
}> = ({ student, onViewDetails }) => {
  const getPerformanceLevel = (progress: number) => {
    if (progress >= 80) return { label: 'Excellent', color: 'text-green-600 bg-green-100 dark:bg-green-900/20' };
    if (progress >= 60) return { label: 'Good', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20' };
    if (progress >= 40) return { label: 'Average', color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20' };
    return { label: 'Needs Help', color: 'text-red-600 bg-red-100 dark:bg-red-900/20' };
  };

  const performance = getPerformanceLevel(student.overallProgress);

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.01 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <LucideUser className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Student {student.studentId}</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${performance.color}`}>
              {performance.label}
            </span>
          </div>
        </div>
        <button
          onClick={() => onViewDetails(student)}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <LucideEye className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-300">Overall Progress</span>
            <span className="font-medium text-gray-900 dark:text-white">{Math.round(student.overallProgress)}%</span>
          </div>
          <ProgressBar progress={student.overallProgress} showPercentage={false} />
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{student.performanceMetrics.quiz_average}%</p>
            <p className="text-xs text-gray-600 dark:text-gray-300">Quiz Avg</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{student.performanceMetrics.assignment_average}%</p>
            <p className="text-xs text-gray-600 dark:text-gray-300">Assignment Avg</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{student.performanceMetrics.attendance_rate}%</p>
            <p className="text-xs text-gray-600 dark:text-gray-300">Attendance</p>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">Course Progress</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {student.courseProgress.completed_lessons}/{student.courseProgress.total_lessons} lessons
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * StudentProgressPage - Track and analyze student progress across all batches
 */
const StudentProgressPage: React.FC<StudentProgressProps> = ({ searchParams }) => {
  // State management
  const [data, setData] = useState<StudentProgressData>({
    students: [],
    summary: {
      totalStudents: 0,
      averageProgress: 0,
      excellentPerformers: 0,
      needsAttention: 0,
      completionRate: 0
    },
    batches: [],
    loading: true,
    error: null
  });
  
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentProgress | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    batch: '',
    progressRange: '',
    search: '',
    sortBy: 'overallProgress',
    sortOrder: 'desc'
  });

  // Mock data for demonstration
  const generateMockData = (): StudentProgressData => {
    const mockStudents: StudentProgress[] = Array.from({ length: 24 }, (_, i) => ({
      studentId: `STU${String(i + 1).padStart(3, '0')}`,
      overallProgress: Math.random() * 100,
      courseProgress: {
        completed_lessons: Math.floor(Math.random() * 20),
        total_lessons: 20,
        completion_percentage: Math.random() * 100
      },
      performanceMetrics: {
        quiz_average: Math.floor(Math.random() * 40) + 60,
        assignment_average: Math.floor(Math.random() * 40) + 60,
        attendance_rate: Math.floor(Math.random() * 30) + 70
      },
      engagementMetrics: {
        forum_posts: Math.floor(Math.random() * 20),
        questions_asked: Math.floor(Math.random() * 15),
        peer_interactions: Math.floor(Math.random() * 25)
      }
    }));

    const summary = {
      totalStudents: mockStudents.length,
      averageProgress: mockStudents.reduce((sum, s) => sum + s.overallProgress, 0) / mockStudents.length,
      excellentPerformers: mockStudents.filter(s => s.overallProgress >= 80).length,
      needsAttention: mockStudents.filter(s => s.overallProgress < 40).length,
      completionRate: mockStudents.filter(s => s.overallProgress >= 100).length / mockStudents.length * 100
    };

    return {
      students: mockStudents,
      summary,
      batches: [
        { id: 'batch1', name: 'AI & Data Science - Batch A', studentCount: 12 },
        { id: 'batch2', name: 'Digital Marketing - Batch B', studentCount: 8 },
        { id: 'batch3', name: 'Full Stack Development - Batch C', studentCount: 4 }
      ],
      loading: false,
      error: null
    };
  };

  // Fetch data
  const fetchData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));
      
      // TODO: Replace with actual API call
      // const response = await instructorApi.getStudentProgress();
      
      // Using mock data for now
      setTimeout(() => {
        const mockData = generateMockData();
        setData(mockData);
      }, 1000);
      
    } catch (error) {
      console.error('Error fetching student progress:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }));
      showToast.error('Failed to load student progress. Please try again.');
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  // Filter and sort students
  const filteredStudents = data.students
    .filter(student => {
      if (filters.search && !student.studentId.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.progressRange) {
        const [min, max] = filters.progressRange.split('-').map(Number);
        if (student.overallProgress < min || student.overallProgress > max) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      const aValue = a[filters.sortBy as keyof StudentProgress] as number;
      const bValue = b[filters.sortBy as keyof StudentProgress] as number;
      return filters.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

  // Effect to fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Loading state
  if (data.loading) {
    return <LoadingSpinner />;
  }

  // Error state
  if (data.error) {
    return <ErrorMessage message={data.error} onRetry={handleRefresh} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Student Progress Tracking
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Monitor and analyze student performance across all your courses
              </p>
            </div>
            <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              <LucideRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
                <LucideDownload className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Summary Stats */}
          <SummaryStats summary={data.summary} />

          {/* Filters */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filters & Search</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search Students
                </label>
                <div className="relative">
                  <LucideSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by student ID..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Progress Range
                </label>
                <select
                  value={filters.progressRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, progressRange: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Progress</option>
                  <option value="80-100">Excellent (80-100%)</option>
                  <option value="60-79">Good (60-79%)</option>
                  <option value="40-59">Average (40-59%)</option>
                  <option value="0-39">Needs Help (0-39%)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="overallProgress">Overall Progress</option>
                  <option value="studentId">Student ID</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Order
                </label>
                <select
                  value={filters.sortOrder}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortOrder: e.target.value as 'asc' | 'desc' }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Students Grid */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Students ({filteredStudents.length})
              </h2>
            </div>
            
            {filteredStudents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.map((student) => (
                  <StudentCard
                    key={student.studentId}
                    student={student}
                    onViewDetails={setSelectedStudent}
                  />
                  ))}
                </div>
              ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <LucideUsers className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No students found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                  Try adjusting your filters to see more results.
                  </p>
                </div>
              )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentProgressPage;