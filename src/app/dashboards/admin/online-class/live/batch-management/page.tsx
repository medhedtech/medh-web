"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Users, 
  Calendar, 
  Clock, 
  User,
  BookOpen,
  Settings,
  Eye,
  MoreVertical,
  Download,
  Upload,
  BarChart3,
  UserPlus,
  UserCheck
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import BatchAssignmentModal from '@/components/shared/modals/BatchAssignmentModal';
import InstructorAssignmentModal from '@/components/shared/modals/InstructorAssignmentModal';
import BatchStudentEnrollment from '@/components/Dashboard/admin/BatchStudentEnrollment';
import BatchAnalytics from '@/components/Dashboard/admin/BatchAnalytics';
import { 
  batchAPI, 
  instructorAssignmentUtils,
  type IBatchWithDetails,
  type IBatchQueryParams,
  type TBatchStatus 
} from '@/apis/instructor-assignments';

interface ICourse {
  _id: string;
  course_title: string;
  course_category: string;
  course_image?: string;
}

interface IInstructor {
  _id: string;
  full_name: string;
  email: string;
  phone_number?: string;
}

const BatchManagementPage: React.FC = () => {
  // State Management
  const [batches, setBatches] = useState<IBatchWithDetails[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [instructors, setInstructors] = useState<IInstructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<TBatchStatus | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState<IBatchWithDetails | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<IBatchWithDetails | null>(null);
  const [showBatchDetails, setShowBatchDetails] = useState(false);
  const [showStudentManagement, setShowStudentManagement] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [activeTab, setActiveTab] = useState<'batches' | 'analytics'>('batches');
  
  // Instructor Assignment Modal State
  const [showInstructorAssignment, setShowInstructorAssignment] = useState(false);
  const [instructorAssignmentType, setInstructorAssignmentType] = useState<'student' | 'course'>('course');
  const [instructorAssignmentTarget, setInstructorAssignmentTarget] = useState<any>(null);

  // Status color mapping
  const statusColors: Record<TBatchStatus, string> = {
    'Active': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    'Upcoming': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    'Completed': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  };

  // Mock courses data - replace with actual API call
  const mockCourses: ICourse[] = [
    { _id: '1', course_title: 'AI and Data Science Fundamentals', course_category: 'Technology' },
    { _id: '2', course_title: 'Digital Marketing with Analytics', course_category: 'Marketing' },
    { _id: '3', course_title: 'Vedic Mathematics', course_category: 'Education' },
    { _id: '4', course_title: 'Personality Development', course_category: 'Personal Growth' }
  ];

  // Mock instructors data - replace with actual API call
  const mockInstructors: IInstructor[] = [
    { _id: '1', full_name: 'Dr. Sarah Johnson', email: 'sarah.johnson@medh.com' },
    { _id: '2', full_name: 'Prof. Michael Chen', email: 'michael.chen@medh.com' },
    { _id: '3', full_name: 'Dr. Priya Sharma', email: 'priya.sharma@medh.com' },
    { _id: '4', full_name: 'Mr. Alex Rodriguez', email: 'alex.rodriguez@medh.com' }
  ];

  // Mock batches data - replace with actual API call
  const mockBatches: IBatchWithDetails[] = [
    {
      _id: '1',
      batch_name: 'AI Fundamentals - Morning Batch',
      batch_code: 'AI-MOR-24',
      course: '1',
      status: 'Active',
      start_date: new Date('2024-02-01'),
      end_date: new Date('2024-04-30'),
      capacity: 30,
      enrolled_students: 25,
      assigned_instructor: '1',
      created_by: 'admin',
      schedule: [
        { day: 'Monday', start_time: '09:00', end_time: '11:00' },
        { day: 'Wednesday', start_time: '09:00', end_time: '11:00' },
        { day: 'Friday', start_time: '09:00', end_time: '11:00' }
      ],
      batch_notes: 'Intensive course covering machine learning basics',
      course_details: {
        _id: '1',
        course_title: 'AI and Data Science Fundamentals',
        course_category: 'Technology'
      },
      instructor_details: {
        _id: '1',
        full_name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@medh.com'
      },
      available_spots: 5,
      createdAt: '2024-01-15T00:00:00.000Z',
      updatedAt: '2024-01-20T00:00:00.000Z'
    },
    {
      _id: '2',
      batch_name: 'Digital Marketing - Evening Batch',
      batch_code: 'DM-EVE-24',
      course: '2',
      status: 'Upcoming',
      start_date: new Date('2024-03-01'),
      end_date: new Date('2024-05-31'),
      capacity: 25,
      enrolled_students: 15,
      assigned_instructor: '2',
      created_by: 'admin',
      schedule: [
        { day: 'Tuesday', start_time: '18:00', end_time: '20:00' },
        { day: 'Thursday', start_time: '18:00', end_time: '20:00' }
      ],
      batch_notes: 'Comprehensive digital marketing with analytics focus',
      course_details: {
        _id: '2',
        course_title: 'Digital Marketing with Analytics',
        course_category: 'Marketing'
      },
      instructor_details: {
        _id: '2',
        full_name: 'Prof. Michael Chen',
        email: 'michael.chen@medh.com'
      },
      available_spots: 10,
      createdAt: '2024-01-20T00:00:00.000Z',
      updatedAt: '2024-01-25T00:00:00.000Z'
    }
  ];

  // Fetch initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load data when filters change
  useEffect(() => {
    if (courses.length > 0) {
      fetchBatches();
    }
  }, [selectedCourse, statusFilter, searchQuery, currentPage]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      // In a real app, these would be actual API calls
      setCourses(mockCourses);
      setInstructors(mockInstructors);
      setBatches(mockBatches);
      setTotalPages(1);
    } catch (error) {
      console.error('Error loading initial data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchBatches = async () => {
    if (!selectedCourse) return;

    try {
      setLoading(true);
      const params: IBatchQueryParams = {
        page: currentPage,
        limit: 10,
        ...(statusFilter && { status: statusFilter }),
        ...(searchQuery && { search: searchQuery }),
        sort_by: 'start_date',
        sort_order: 'desc'
      };

      // In a real app, this would be an actual API call
      // const response = await batchAPI.getBatchesByCourse(selectedCourse, params);
      
      // For now, filter mock data
      const filtered = mockBatches.filter(batch => {
        const matchesCourse = batch.course === selectedCourse;
        const matchesStatus = !statusFilter || batch.status === statusFilter;
        const matchesSearch = !searchQuery || 
          batch.batch_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          batch.batch_code?.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesCourse && matchesStatus && matchesSearch;
      });

      setBatches(filtered);
    } catch (error) {
      console.error('Error fetching batches:', error);
      toast.error('Failed to load batches');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBatch = () => {
    setEditingBatch(null);
    setShowCreateModal(true);
  };

  const handleEditBatch = (batch: IBatchWithDetails) => {
    setEditingBatch(batch);
    setShowCreateModal(true);
  };

  const handleDeleteBatch = async (batchId: string, batchName: string) => {
    if (!confirm(`Are you sure you want to delete "${batchName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      // In a real app, this would be an actual API call
      // await batchAPI.deleteBatch(batchId);
      
      setBatches(prev => prev.filter(b => b._id !== batchId));
      toast.success('Batch deleted successfully');
    } catch (error) {
      console.error('Error deleting batch:', error);
      toast.error('Failed to delete batch');
    }
  };

  const handleViewBatchDetails = (batch: IBatchWithDetails) => {
    setSelectedBatch(batch);
    setShowBatchDetails(true);
  };

  const handleManageStudents = (batch: IBatchWithDetails) => {
    setSelectedBatch(batch);
    setShowStudentManagement(true);
  };

  const handleAssignInstructorToCourse = (course: ICourse) => {
    setInstructorAssignmentType('course');
    setInstructorAssignmentTarget(course);
    setShowInstructorAssignment(true);
  };

  const handleAssignInstructorToStudent = (student: any) => {
    setInstructorAssignmentType('student');
    setInstructorAssignmentTarget(student);
    setShowInstructorAssignment(true);
  };

  const onModalSuccess = () => {
    if (selectedCourse) {
      fetchBatches();
    } else {
      loadInitialData();
    }
  };

  const onInstructorAssignmentSuccess = () => {
    setShowInstructorAssignment(false);
    setInstructorAssignmentTarget(null);
    // Refresh data if needed
    if (selectedCourse) {
      fetchBatches();
    } else {
      loadInitialData();
    }
    toast.success('Instructor assignment completed successfully!');
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'text-red-600';
    if (utilization >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/dashboards/admin/online-class/live"
                className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Categories
              </Link>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Batch Management
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setActiveTab(activeTab === 'batches' ? 'analytics' : 'batches')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                {activeTab === 'batches' ? 'View Analytics' : 'View Batches'}
              </button>
              <button
                onClick={handleCreateBatch}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Batch
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Course Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Course
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Courses</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.course_title}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Batches
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status Filter
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as TBatchStatus | '')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-end space-x-2">
              {selectedCourse && (
                <button
                  onClick={() => {
                    const course = courses.find(c => c._id === selectedCourse);
                    if (course) handleAssignInstructorToCourse(course);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  title="Assign instructor to selected course"
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Assign Instructor
                </button>
              )}
              <button
                onClick={() => {
                  setSelectedCourse('');
                  setSearchQuery('');
                  setStatusFilter('');
                  setCurrentPage(1);
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'analytics' ? (
          <BatchAnalytics 
            courseId={selectedCourse}
          />
        ) : (
          <>
            {/* Batches List */}
            {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">Loading batches...</span>
            </div>
          </div>
        ) : batches.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {selectedCourse ? 'No batches found' : 'Select a course to view batches'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {selectedCourse 
                ? 'There are no batches for the selected course and filters.'
                : 'Choose a course from the dropdown above to see available batches.'
              }
            </p>
            {selectedCourse && (
              <button
                onClick={handleCreateBatch}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Batch
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {batches.map((batch) => {
                const utilization = instructorAssignmentUtils.calculateBatchUtilization(
                  batch.enrolled_students, 
                  batch.capacity
                );
                
                return (
                  <motion.div
                    key={batch._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Card Header */}
                    <div className="p-6 pb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {batch.batch_name}
                          </h3>
                          {batch.batch_code && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {batch.batch_code}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[batch.status]}`}>
                            {batch.status}
                          </span>
                          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                            <MoreVertical className="h-4 w-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {batch.course_details?.course_title}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {batch.enrolled_students}/{batch.capacity}
                          </span>
                          <span className={`text-xs font-medium ${getUtilizationColor(utilization)}`}>
                            ({utilization}%)
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {batch.instructor_details?.full_name}
                          </span>
                        </div>
                      </div>

                      {/* Schedule Preview */}
                      <div className="flex items-center space-x-2 mb-4">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(batch.start_date)} - {formatDate(batch.end_date)}
                        </span>
                      </div>

                      {batch.schedule && batch.schedule.length > 0 && (
                        <div className="flex items-center space-x-2 mb-4">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {batch.schedule.length} sessions/week
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card Actions */}
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleViewBatchDetails(batch)}
                            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleManageStudents(batch)}
                            className="text-sm text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium"
                          >
                            Manage Students
                          </button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditBatch(batch)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Edit Batch"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBatch(batch._id!, batch.batch_name)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete Batch"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Showing page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create/Edit Batch Modal */}
      {showCreateModal && (
        <BatchAssignmentModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setEditingBatch(null);
          }}
          onSuccess={onModalSuccess}
          mode="create_batch"
          course={selectedCourse ? courses.find(c => c._id === selectedCourse) : undefined}
          courses={courses}
          instructors={instructors}
          title={editingBatch ? `Edit Batch: ${editingBatch.batch_name}` : 'Create New Batch'}
          onOpenInstructorAssignment={handleAssignInstructorToCourse}
        />
      )}

      {/* Batch Details Modal */}
      {showBatchDetails && selectedBatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Batch Details
              </h2>
              <button
                onClick={() => setShowBatchDetails(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Batch Name
                      </label>
                      <p className="text-gray-900 dark:text-white">{selectedBatch.batch_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Batch Code
                      </label>
                      <p className="text-gray-900 dark:text-white">{selectedBatch.batch_code || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Course
                      </label>
                      <p className="text-gray-900 dark:text-white">{selectedBatch.course_details?.course_title}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Status
                      </label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[selectedBatch.status]}`}>
                        {selectedBatch.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                {selectedBatch.schedule && selectedBatch.schedule.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Schedule
                    </h3>
                    <div className="space-y-2">
                      {selectedBatch.schedule.map((session, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {session.day}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {session.start_time} - {session.end_time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedBatch.batch_notes && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Notes
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      {selectedBatch.batch_notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Management Modal */}
      {showStudentManagement && selectedBatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Student Management - {selectedBatch.batch_name}
              </h2>
              <button
                onClick={() => {
                  setShowStudentManagement(false);
                  setSelectedBatch(null);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6">
              <BatchStudentEnrollment
                batch={selectedBatch}
                onUpdate={onModalSuccess}
              />
            </div>
          </div>
        </div>
      )}

      {/* Instructor Assignment Modal */}
      {showInstructorAssignment && instructorAssignmentTarget && (
        <InstructorAssignmentModal
          isOpen={showInstructorAssignment}
          onClose={() => {
            setShowInstructorAssignment(false);
            setInstructorAssignmentTarget(null);
          }}
          onSuccess={onInstructorAssignmentSuccess}
          type={instructorAssignmentType}
          targetData={instructorAssignmentTarget}
          title={`Assign Instructor to ${instructorAssignmentType === 'course' ? 'Course' : 'Student'}`}
        />
      )}
    </div>
  );
};

export default BatchManagementPage; 