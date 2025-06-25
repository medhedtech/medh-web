"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { instructorApi, StudentProgress, Batch } from '@/apis/instructor.api';
import { showToast } from '@/utils/toast';
import Preloader from '@/components/shared/others/Preloader';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  LucideUsers,
  LucideBarChart,
  LucideTrendingUp,
  LucideTrendingDown,
  LucideCalendar,
  LucideFilter,
  LucideSearch,
  LucideDownload,
  LucideEye,
  LucideGraduationCap,
  LucideClipboardList,
  LucideMessageSquare,
  LucideRefreshCw,
  LucideChevronRight,
  LucideAward,
  LucideTarget,
  LucideActivity
} from 'lucide-react';
import StudentProgressComponent from './components/StudentProgressComponent';

interface StudentProgressData extends StudentProgress {
  studentName: string;
  studentEmail: string;
  profilePicture?: string;
  enrollmentDate: string;
  lastActivity: string;
  batchName: string;
  courseName: string;
}

interface ProgressFilters {
  batchId: string;
  courseId: string;
  progressRange: 'all' | 'excellent' | 'good' | 'needs_attention';
  sortBy: 'name' | 'progress' | 'lastActivity' | 'performance';
  sortOrder: 'asc' | 'desc';
  searchTerm: string;
}

const StudentProgressPage: React.FC = () => {
  const [studentsData, setStudentsData] = useState<StudentProgressData[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentProgressData | null>(null);
  const [filters, setFilters] = useState<ProgressFilters>({
    batchId: '',
    courseId: '',
    progressRange: 'all',
    sortBy: 'progress',
    sortOrder: 'desc',
    searchTerm: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [progressResponse, batchesResponse] = await Promise.all([
          instructorApi.getStudentProgress('all', 'all'),
          instructorApi.getActiveBatches()
        ]);
        
        setStudentsData(progressResponse);
        setBatches(batchesResponse);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching student progress:', err);
        setError(err?.message || 'Failed to load student progress');
        showToast.error('Failed to load student progress');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort students based on current filters
  const filteredStudents = studentsData
    .filter(student => {
      if (filters.batchId && student.batchName !== filters.batchId) return false;
      if (filters.searchTerm && 
          !student.studentName.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
          !student.studentEmail.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false;
      
      if (filters.progressRange !== 'all') {
        const progress = student.overallProgress;
        switch (filters.progressRange) {
          case 'excellent':
            return progress >= 80;
          case 'good':
            return progress >= 60 && progress < 80;
          case 'needs_attention':
            return progress < 60;
        }
      }
      
      return true;
    })
    .sort((a, b) => {
      const order = filters.sortOrder === 'asc' ? 1 : -1;
      switch (filters.sortBy) {
        case 'name':
          return order * a.studentName.localeCompare(b.studentName);
        case 'progress':
          return order * (a.overallProgress - b.overallProgress);
        case 'lastActivity':
          return order * (new Date(a.lastActivity).getTime() - new Date(b.lastActivity).getTime());
        case 'performance':
          return order * (a.performanceMetrics.quiz_average - b.performanceMetrics.quiz_average);
        default:
          return 0;
      }
    });

  // Calculate summary statistics
  const summaryStats = {
    totalStudents: studentsData.length,
    averageProgress: Math.round(studentsData.reduce((sum, s) => sum + s.overallProgress, 0) / studentsData.length || 0),
    excellentPerformers: studentsData.filter(s => s.overallProgress >= 80).length,
    needsAttention: studentsData.filter(s => s.overallProgress < 60).length,
    averageAttendance: Math.round(studentsData.reduce((sum, s) => sum + s.performanceMetrics.attendance_rate, 0) / studentsData.length || 0)
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300';
    if (progress >= 60) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300';
    return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300';
  };

  const getProgressIcon = (progress: number) => {
    if (progress >= 80) return <LucideTrendingUp className="w-4 h-4" />;
    if (progress >= 60) return <LucideActivity className="w-4 h-4" />;
    return <LucideTrendingDown className="w-4 h-4" />;
  };

  if (loading) return <Preloader />;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
              <LucideActivity className="w-5 h-5" />
              Error Loading Progress
            </CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
            >
              <LucideRefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                <LucideUsers className="w-8 h-8 text-blue-600" />
                Student Progress Tracking
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor and analyze your students' learning progress and performance
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2">
                <LucideDownload className="w-4 h-4" />
                Export Report
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <LucideRefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {summaryStats.totalStudents}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  Total Students
                </p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                <LucideUsers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {summaryStats.averageProgress}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  Average Progress
                </p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-xl">
                <LucideTarget className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {summaryStats.excellentPerformers}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  Excellent (80%+)
                </p>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl">
                <LucideAward className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {summaryStats.needsAttention}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  Needs Attention
                </p>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-xl">
                <LucideActivity className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {summaryStats.averageAttendance}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  Avg Attendance
                </p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
                <LucideCalendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LucideFilter className="w-5 h-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="relative">
                <LucideSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={filters.batchId}
                onChange={(e) => setFilters({ ...filters, batchId: e.target.value })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Batches</option>
                {batches.map(batch => (
                  <option key={batch._id} value={batch.batch_name}>
                    {batch.batch_name}
                  </option>
                ))}
              </select>

              <select
                value={filters.progressRange}
                onChange={(e) => setFilters({ ...filters, progressRange: e.target.value as any })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Progress Levels</option>
                <option value="excellent">Excellent (80%+)</option>
                <option value="good">Good (60-79%)</option>
                <option value="needs_attention">Needs Attention (&lt;60%)</option>
              </select>

              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="progress">Sort by Progress</option>
                <option value="name">Sort by Name</option>
                <option value="lastActivity">Sort by Last Activity</option>
                <option value="performance">Sort by Performance</option>
              </select>

              <select
                value={filters.sortOrder}
                onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value as any })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>

              <button
                onClick={() => setFilters({
                  batchId: '',
                  courseId: '',
                  progressRange: 'all',
                  sortBy: 'progress',
                  sortOrder: 'desc',
                  searchTerm: ''
                })}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Student Progress List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Students List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <LucideBarChart className="w-5 h-5" />
                    Student Progress ({filteredStudents.length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student, index) => (
                      <motion.div
                        key={student.studentId}
                        whileHover={{ scale: 1.01 }}
                        onClick={() => setSelectedStudent(student)}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all cursor-pointer bg-white dark:bg-gray-800"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                              {student.studentName.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {student.studentName}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {student.batchName} • {student.courseName}
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500">
                                Last active: {new Date(student.lastActivity).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getProgressColor(student.overallProgress)}`}>
                                {getProgressIcon(student.overallProgress)}
                                {student.overallProgress}%
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Quiz Avg: {student.performanceMetrics.quiz_average}%
                        </p>
                      </div>
                            <LucideChevronRight className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${student.overallProgress}%` }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <LucideUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        No Students Found
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Try adjusting your filters to see more students.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Student Detail Panel */}
          <div>
            {selectedStudent ? (
              <StudentProgressComponent student={selectedStudent} />
            ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <LucideEye className="w-5 h-5" />
                    Student Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="text-center py-12">
                    <LucideEye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Select a Student
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Click on a student from the list to view detailed progress information.
                    </p>
                </div>
              </CardContent>
            </Card>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentProgressPage;