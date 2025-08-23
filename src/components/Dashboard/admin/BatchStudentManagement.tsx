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
  RefreshCw
} from 'lucide-react';
import { showToast } from '@/utils/toastManager';
import { motion, AnimatePresence } from 'framer-motion';
import BatchAssignmentModal from '@/components/shared/modals/BatchAssignmentModal';
import { 
  enrollmentAPI,
  type IEnrollmentWithDetails,
  type TEnrollmentStatus,
  type IBatchWithDetails
} from '@/apis/instructor-assignments';
import { liveClassesAPI } from '@/apis/liveClassesAPI';
import { getAuthToken, isAuthenticated } from '@/utils/auth';

interface IStudent {
  _id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  role: string[];
  enrollment_date?: string;
  status: TEnrollmentStatus;
}

interface BatchStudentManagementProps {
  batch: IBatchWithDetails;
  onStudentUpdate: () => void;
}

const BatchStudentManagement: React.FC<BatchStudentManagementProps> = ({
  batch,
  onStudentUpdate
}) => {
  // State Management
  const [students, setStudents] = useState<IStudent[]>([]);
  const [availableStudents, setAvailableStudents] = useState<IStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TEnrollmentStatus | ''>('');
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);
  const [showStudentDetails, setShowStudentDetails] = useState(false);
  const [currentBatchCapacity, setCurrentBatchCapacity] = useState(batch.capacity || 0);
  const [currentEnrolledCount, setCurrentEnrolledCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Status colors
  const statusColors: Record<TEnrollmentStatus, string> = {
    'active': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    'completed': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    'on_hold': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    'expired': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  };

  // Mock enrolled students data
  const mockEnrolledStudents: IStudent[] = [
    {
      _id: '1',
      full_name: 'John Doe',
      email: 'john.doe@example.com',
      phone_number: '+1-555-0101',
      role: ['Student'],
      enrollment_date: '2024-01-15T00:00:00.000Z',
      status: 'active'
    },
    {
      _id: '2',
      full_name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone_number: '+1-555-0102',
      role: ['Student'],
      enrollment_date: '2024-01-20T00:00:00.000Z',
      status: 'active'
    },
    {
      _id: '3',
      full_name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      phone_number: '+1-555-0103',
      role: ['Student'],
      enrollment_date: '2024-01-18T00:00:00.000Z',
      status: 'on_hold'
    }
  ];

  // Mock available students (not enrolled in this batch)
  const mockAvailableStudents: IStudent[] = [
    {
      _id: '4',
      full_name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      phone_number: '+1-555-0104',
      role: ['Student'],
      status: 'active'
    },
    {
      _id: '5',
      full_name: 'David Brown',
      email: 'david.brown@example.com',
      phone_number: '+1-555-0105',
      role: ['Student'],
      status: 'active'
    }
  ];

  useEffect(() => {
    loadStudents();
  }, [batch._id]);

  // Update enrolled count when students array changes
  useEffect(() => {
    setCurrentEnrolledCount(students.length);
  }, [students]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      
      // Fetch all students from the student collection
      console.log('🔍 Fetching all students for enrollment...');
      const response = await liveClassesAPI.getStudents();
      console.log('📥 Students API Response:', response);
      
      if (response.data && response.data.data) {
        const allStudents = response.data.data;
        console.log('📋 Total students found:', allStudents.length);
        
        // Transform the data to match our interface
        const transformedStudents: IStudent[] = allStudents.map((student: any) => ({
          _id: student._id,
          full_name: student.full_name || 'Unknown Student',
          email: student.email || 'no-email@example.com',
          phone_number: student.phone_numbers?.[0]?.number || '',
          role: student.role || ['Student'],
          status: 'active' as TEnrollmentStatus
        }));
        
                 // Now fetch enrolled students for this batch using the correct API
         console.log('🔍 Fetching enrolled students for batch:', batch._id);
         try {
           // Use the correct API endpoint for batch students
           const enrolledResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/v1/enrollments/batches/${batch._id}/students`, {
             headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${getAuthToken()}`
             }
           });
           
           if (enrolledResponse.ok) {
             const responseData = await enrolledResponse.json();
             console.log('📥 Enrolled students API Response:', responseData);
             
             if (responseData.success && responseData.students && responseData.students.data) {
               const enrolledStudents = responseData.students.data;
               console.log('📋 Enrolled students found:', enrolledStudents.length);
               
               // Transform enrolled students
               const transformedEnrolledStudents: IStudent[] = enrolledStudents.map((enrollment: any) => ({
                 _id: enrollment.student._id,
                 full_name: enrollment.student.full_name || 'Unknown Student',
                 email: enrollment.student.email || 'no-email@example.com',
                 phone_number: enrollment.student.phone_numbers?.[0]?.number || '',
                 role: ['Student'],
                 enrollment_date: enrollment.enrollmentDate,
                 status: enrollment.status || 'active',
                 enrollment_id: enrollment.enrollmentId
               }));
               
               // Filter out enrolled students from available students
               const enrolledStudentIds = transformedEnrolledStudents.map(s => s._id);
               const availableStudents = transformedStudents.filter(student => !enrolledStudentIds.includes(student._id));
               
               setStudents(transformedEnrolledStudents);
               setAvailableStudents(availableStudents);
               setCurrentEnrolledCount(transformedEnrolledStudents.length);
               
               console.log('✅ Students loaded successfully:', {
                 enrolled: transformedEnrolledStudents.length,
                 available: availableStudents.length
               });
             } else {
               // No enrolled students found, show all as available
               setStudents([]);
               setAvailableStudents(transformedStudents);
               setCurrentEnrolledCount(0);
               console.log('✅ No enrolled students found, all students available');
             }
           } else {
             console.log('⚠️ Could not fetch enrolled students, showing all as available');
             // Fallback: show all students as available
             setStudents([]);
             setAvailableStudents(transformedStudents);
             setCurrentEnrolledCount(0);
           }
         } catch (enrollmentError) {
           console.log('⚠️ Could not fetch enrolled students, showing all as available:', enrollmentError);
           // Fallback: show all students as available
           setStudents([]);
           setAvailableStudents(transformedStudents);
           setCurrentEnrolledCount(0);
         }
      } else {
        console.log('❌ No students data found');
        setAvailableStudents([]);
        setStudents([]);
        setCurrentEnrolledCount(0);
      }
    } catch (error) {
      console.error('❌ Error loading students:', error);
      showToast.error('Failed to load students');
      setAvailableStudents([]);
      setStudents([]);
      setCurrentEnrolledCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollStudent = async (studentId: string) => {
    try {
      // Check if user is authenticated
      if (!isAuthenticated()) {
        console.log('❌ User not authenticated');
        showToast.error('Please log in to enroll students');
        return;
      }

      const token = getAuthToken();
      console.log('🔐 Auth token available:', !!token);
      console.log('🎯 Enrolling student:', studentId, 'in batch:', batch._id);
      
      // Make real API call to enroll student
      const response = await enrollmentAPI.enrollStudent(studentId, {
        courseId: batch.course,
        batchId: batch._id!,
        enrollment_type: 'batch'
      });
      
      console.log('✅ Enrollment API Response:', response);
      
      // Use real enrollment data from API response
      if (response.data && response.data.data && response.data.data.enrollment) {
        const enrollmentData = response.data.data.enrollment;
        const batchData = response.data.data.batch;
        
        console.log('📊 Enrollment data received:', enrollmentData);
        console.log('📊 Updated batch data:', batchData);
        
        // Move student from available to enrolled with real data
        const student = availableStudents.find(s => s._id === studentId);
        if (student) {
          const enrolledStudent = {
            ...student,
            enrollment_date: enrollmentData.enrollment_date,
            status: enrollmentData.status || 'active',
            enrollment_id: enrollmentData._id
          };
          
                     // Immediately update UI with the enrolled student
           setStudents(prev => [...prev, enrolledStudent]);
           setAvailableStudents(prev => prev.filter(s => s._id !== studentId));
           setCurrentEnrolledCount(prev => prev + 1);
           showToast.success(`✅ ${student.full_name} enrolled successfully!`);
           
           // Update batch capacity info if provided
           if (batchData) {
             console.log('🔄 Updating batch capacity:', {
               enrolled: batchData.enrolled_students,
               capacity: batchData.capacity
             });
             setCurrentBatchCapacity(batchData.capacity);
             setCurrentEnrolledCount(batchData.enrolled_students);
           }
           
           onStudentUpdate();
           
           // Refresh the student list after a short delay to ensure data consistency
           setTimeout(() => {
             loadStudents();
           }, 2000);
        }
      } else {
        console.log('⚠️ No enrollment data in response, using fallback');
                 // Fallback to previous logic
         const student = availableStudents.find(s => s._id === studentId);
         if (student) {
           setStudents(prev => [...prev, { ...student, enrollment_date: new Date().toISOString(), status: 'active' }]);
           setAvailableStudents(prev => prev.filter(s => s._id !== studentId));
           setCurrentEnrolledCount(prev => prev + 1);
           showToast.success(`✅ ${student.full_name} enrolled successfully!`);
           onStudentUpdate();
           
           // Refresh the student list after a short delay to ensure data consistency
           setTimeout(() => {
             loadStudents();
           }, 2000);
         }
      }
    } catch (error: any) {
      console.error('❌ Error enrolling student:', error);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        showToast.error('Authentication required. Please log in again.');
      } else if (error.response?.status === 404) {
        showToast.error('Student not found. Please refresh and try again.');
      } else {
        showToast.error('Failed to enroll student. Please try again.');
      }
    }
  };

  const handleUnenrollStudent = async (studentId: string, studentName: string) => {
    if (!confirm(`Are you sure you want to unenroll ${studentName} from this batch?`)) {
      return;
    }

    try {
      // In a real app, this would be an actual API call
      // await enrollmentAPI.cancelEnrollment(enrollmentId);

      // Move student from enrolled to available
      const student = students.find(s => s._id === studentId);
      if (student) {
        setAvailableStudents(prev => [...prev, { ...student, enrollment_date: undefined, status: 'active' }]);
        setStudents(prev => prev.filter(s => s._id !== studentId));
        setCurrentEnrolledCount(prev => prev - 1);
        showToast.success(`${studentName} unenrolled successfully`);
        onStudentUpdate();
      }
    } catch (error) {
      console.error('Error unenrolling student:', error);
      showToast.error('Failed to unenroll student');
    }
  };

  const handleUpdateStudentStatus = async (studentId: string, newStatus: TEnrollmentStatus) => {
    try {
      // In a real app, this would be an actual API call
      // await enrollmentAPI.updateEnrollment(enrollmentId, { status: newStatus });

      setStudents(prev => prev.map(s => 
        s._id === studentId ? { ...s, status: newStatus } : s
      ));
      showToast.success('Student status updated successfully');
    } catch (error) {
      console.error('Error updating student status:', error);
      showToast.error('Failed to update student status');
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = !searchQuery || 
      student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || student.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Enrolled Students ({currentEnrolledCount}/{currentBatchCapacity})
            {isRefreshing && (
              <span className="ml-2 text-sm text-blue-600 dark:text-blue-400">
                <RefreshCw className="inline h-4 w-4 animate-spin mr-1" />
                Refreshing...
              </span>
            )}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage student enrollments for {batch.batch_name}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setIsRefreshing(true);
              setLoading(true);
              loadStudents().finally(() => {
                setIsRefreshing(false);
                setLoading(false);
              });
            }}
            disabled={loading || isRefreshing}
            className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            title="Refresh student list"
          >
            <RefreshCw className={`h-4 w-4 ${loading || isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowEnrollModal(true)}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Enroll Students
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
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
        <div className="w-full sm:w-48">
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
      </div>

      {/* Students List */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading students...</span>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No students found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchQuery || statusFilter 
              ? 'No students match your current filters.' 
              : 'No students are enrolled in this batch yet.'
            }
          </p>
          <button
            onClick={() => setShowEnrollModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Enroll First Student
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Enrollment Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <AnimatePresence>
                  {filteredStudents.map((student) => (
                    <motion.tr
                      key={student._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {student.full_name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {student.full_name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {student.role.join(', ')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-900 dark:text-white">
                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                            {student.email}
                          </div>
                          {student.phone_number && (
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <Phone className="h-4 w-4 mr-2 text-gray-400" />
                              {student.phone_number}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {student.enrollment_date ? (
                          <div className="flex items-center text-sm text-gray-900 dark:text-white">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            {formatDate(student.enrollment_date)}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={student.status}
                          onChange={(e) => handleUpdateStudentStatus(student._id, e.target.value as TEnrollmentStatus)}
                          className={`text-xs px-2 py-1 rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${statusColors[student.status]}`}
                        >
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="on_hold">On Hold</option>
                          <option value="expired">Expired</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedStudent(student);
                              setShowStudentDetails(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleUnenrollStudent(student._id, student.full_name)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Unenroll Student"
                          >
                            <UserMinus className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enroll Students Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Enroll Students
              </h2>
              <button
                onClick={() => setShowEnrollModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Select students to enroll in {batch.batch_name}. Available spots: {batch.capacity - students.length}
                </p>
                
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {availableStudents.map((student) => (
                    <div key={student._id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {student.full_name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {student.email}
                        </div>
                      </div>
                      <button
                        onClick={() => handleEnrollStudent(student._id)}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Enroll
                      </button>
                    </div>
                  ))}
                </div>
                
                {availableStudents.length === 0 && (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    No available students to enroll
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Details Modal */}
      {showStudentDetails && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Student Details
              </h2>
              <button
                onClick={() => setShowStudentDetails(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                  <p className="text-gray-900 dark:text-white">{selectedStudent.full_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                  <p className="text-gray-900 dark:text-white">{selectedStudent.email}</p>
                </div>
                {selectedStudent.phone_number && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                    <p className="text-gray-900 dark:text-white">{selectedStudent.phone_number}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</label>
                  <p className="text-gray-900 dark:text-white">{selectedStudent.role.join(', ')}</p>
                </div>
                {selectedStudent.enrollment_date && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Enrollment Date</label>
                    <p className="text-gray-900 dark:text-white">{formatDate(selectedStudent.enrollment_date)}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[selectedStudent.status]}`}>
                    {selectedStudent.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchStudentManagement; 