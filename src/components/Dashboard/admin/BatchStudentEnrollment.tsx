"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  Search, 
  Filter,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Eye,
  Edit3,
  Trash2,
  Download,
  Upload,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import BatchAssignmentModal from '@/components/shared/modals/BatchAssignmentModal';
import { 
  enrollmentAPI,
  batchAPI,
  type IEnrollmentWithDetails,
  type TEnrollmentStatus,
  type IBatchWithDetails
} from '@/apis/instructor-assignments';

interface IStudent {
  _id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  role: string[];
  enrollment_date?: string;
  status: TEnrollmentStatus;
  profile_image?: string;
}

interface BatchStudentEnrollmentProps {
  batch: IBatchWithDetails;
  onUpdate: () => void;
}

const statusConfig: Record<TEnrollmentStatus, { color: string; icon: React.ReactNode; label: string }> = {
  active: {
    color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    icon: <CheckCircle className="h-4 w-4" />,
    label: 'Active'
  },
  completed: {
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    icon: <CheckCircle className="h-4 w-4" />,
    label: 'Completed'
  },
  cancelled: {
    color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    icon: <XCircle className="h-4 w-4" />,
    label: 'Cancelled'
  },
  on_hold: {
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    icon: <Clock className="h-4 w-4" />,
    label: 'On Hold'
  },
  expired: {
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    icon: <AlertCircle className="h-4 w-4" />,
    label: 'Expired'
  }
};

const BatchStudentEnrollment: React.FC<BatchStudentEnrollmentProps> = ({
  batch,
  onUpdate
}) => {
  // State Management
  const [enrolledStudents, setEnrolledStudents] = useState<IStudent[]>([]);
  const [availableStudents, setAvailableStudents] = useState<IStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TEnrollmentStatus | ''>('');
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [expandedView, setExpandedView] = useState<'enrolled' | 'available' | null>('enrolled');

  // Mock data - replace with actual API calls
  const mockEnrolledStudents: IStudent[] = [
    {
      _id: '1',
      full_name: 'John Doe',
      email: 'john.doe@example.com',
      phone_number: '+1234567890',
      role: ['student'],
      enrollment_date: '2024-01-15',
      status: 'active'
    },
    {
      _id: '2',
      full_name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone_number: '+1234567891',
      role: ['student'],
      enrollment_date: '2024-01-16',
      status: 'active'
    },
    {
      _id: '3',
      full_name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      role: ['student'],
      enrollment_date: '2024-01-20',
      status: 'on_hold'
    }
  ];

  const mockAvailableStudents: IStudent[] = [
    {
      _id: '4',
      full_name: 'Alice Brown',
      email: 'alice.brown@example.com',
      phone_number: '+1234567894',
      role: ['student'],
      status: 'active'
    },
    {
      _id: '5',
      full_name: 'Charlie Wilson',
      email: 'charlie.wilson@example.com',
      role: ['student'],
      status: 'active'
    }
  ];

  // Load data
  useEffect(() => {
    loadStudents();
  }, [batch._id]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      
      // In a real app, these would be actual API calls
      // const enrolledResponse = await batchAPI.getBatchStudents(batch._id!);
      // const availableResponse = await fetch('/api/students/available');
      
      setEnrolledStudents(mockEnrolledStudents);
      setAvailableStudents(mockAvailableStudents);
    } catch (error) {
      console.error('Error loading students:', error);
      toast.error('Failed to load student data');
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollStudents = async () => {
    if (selectedStudents.length === 0) {
      toast.error('Please select students to enroll');
      return;
    }

    try {
      setLoading(true);
      
      // In a real app, this would use the enrollment API
      const enrollmentPromises = selectedStudents.map(studentId =>
        enrollmentAPI.enrollStudent(studentId, {
          courseId: batch.course,
          batchId: batch._id!,
          enrollment_type: 'batch'
        })
      );

      const results = await Promise.allSettled(enrollmentPromises);
      const successCount = results.filter(result => result.status === 'fulfilled').length;
      const failureCount = results.length - successCount;

      if (successCount > 0) {
        toast.success(`${successCount} students enrolled successfully`);
        if (failureCount > 0) {
          toast.warning(`${failureCount} enrollments failed`);
        }
        setSelectedStudents([]);
        setShowEnrollModal(false);
        loadStudents();
        onUpdate();
      } else {
        throw new Error('All enrollments failed');
      }
    } catch (error) {
      console.error('Error enrolling students:', error);
      toast.error('Failed to enroll students');
    } finally {
      setLoading(false);
    }
  };

  const handleUnenrollStudent = async (studentId: string, studentName: string) => {
    if (!confirm(`Are you sure you want to unenroll ${studentName} from this batch?`)) {
      return;
    }

    try {
      setLoading(true);
      
      // In a real app, this would find the enrollment and cancel it
      // const enrollment = enrolledStudents.find(s => s._id === studentId);
      // await enrollmentAPI.cancelEnrollment(enrollment.enrollmentId);
      
      setEnrolledStudents(prev => prev.filter(s => s._id !== studentId));
      toast.success(`${studentName} has been unenrolled from the batch`);
      onUpdate();
    } catch (error) {
      console.error('Error unenrolling student:', error);
      toast.error('Failed to unenroll student');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStudentStatus = async (studentId: string, newStatus: TEnrollmentStatus) => {
    try {
      setLoading(true);
      
      // In a real app, this would update the enrollment status
      // await enrollmentAPI.updateEnrollment(enrollmentId, { status: newStatus });
      
      setEnrolledStudents(prev => prev.map(student => 
        student._id === studentId 
          ? { ...student, status: newStatus }
          : student
      ));
      
      toast.success('Student status updated successfully');
      onUpdate();
    } catch (error) {
      console.error('Error updating student status:', error);
      toast.error('Failed to update student status');
    } finally {
      setLoading(false);
    }
  };

  const filteredEnrolledStudents = enrolledStudents.filter(student => {
    const matchesSearch = !searchQuery || 
      student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredAvailableStudents = availableStudents.filter(student =>
    !searchQuery || 
    student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading students...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Student Enrollment Management
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage student enrollments for {batch.batch_name}
            </p>
          </div>
          <button
            onClick={() => setShowEnrollModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Enroll Students
          </button>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TEnrollmentStatus | '')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="on_hold">On Hold</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <div>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('');
              }}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Enrolled Students */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setExpandedView(expandedView === 'enrolled' ? null : 'enrolled')}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Enrolled Students ({filteredEnrolledStudents.length})
              </h3>
            </div>
            {expandedView === 'enrolled' ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>

        <AnimatePresence>
          {expandedView === 'enrolled' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-6">
                {filteredEnrolledStudents.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No enrolled students found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {searchQuery || statusFilter 
                        ? 'Try adjusting your search filters.'
                        : 'Start by enrolling students in this batch.'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredEnrolledStudents.map((student) => {
                      const status = statusConfig[student.status];
                      return (
                        <div key={student._id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                  {student.full_name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {student.full_name}
                                </h4>
                                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                  <span className="flex items-center">
                                    <Mail className="h-3 w-3 mr-1" />
                                    {student.email}
                                  </span>
                                  {student.phone_number && (
                                    <span className="flex items-center">
                                      <Phone className="h-3 w-3 mr-1" />
                                      {student.phone_number}
                                    </span>
                                  )}
                                  {student.enrollment_date && (
                                    <span className="flex items-center">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      Enrolled: {new Date(student.enrollment_date).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                                {status.icon}
                                <span className="ml-1">{status.label}</span>
                              </span>
                              
                              <select
                                value={student.status}
                                onChange={(e) => handleUpdateStudentStatus(student._id, e.target.value as TEnrollmentStatus)}
                                className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                              >
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="on_hold">On Hold</option>
                                <option value="expired">Expired</option>
                              </select>
                              
                              <button
                                onClick={() => handleUnenrollStudent(student._id, student.full_name)}
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Unenroll Student"
                              >
                                <UserMinus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Enrollment Modal */}
      {showEnrollModal && (
        <BatchAssignmentModal
          isOpen={showEnrollModal}
          onClose={() => {
            setShowEnrollModal(false);
            setSelectedStudents([]);
          }}
          onSuccess={() => {
            loadStudents();
            onUpdate();
          }}
          mode="batch_enrollment"
          batch={batch}
        />
      )}
    </div>
  );
};

export default BatchStudentEnrollment; 