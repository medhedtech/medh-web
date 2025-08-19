import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Clock, Calendar, BookOpen, CheckCircle, AlertCircle } from 'lucide-react';
import { showToast } from '@/utils/toast';
import { apiClient } from '@/lib/api-client';

interface IStudent {
  _id: string;
  full_name: string;
  email: string;
  phone_numbers?: Array<{ country: string; number: string }>;
  status: string;
  profile_image?: string;
}

interface IBatch {
  _id: string;
  batch_name: string;
  batch_code: string;
  capacity: number;
  enrolled_students: number;
  start_date: string;
  end_date: string;
  session_duration?: number;
  is_individual_session?: boolean;
}

interface ICourse {
  _id: string;
  course_title: string;
  course_description?: string;
}

interface OneOnOneSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  course?: ICourse;
}

const OneOnOneSessionModal: React.FC<OneOnOneSessionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  course
}) => {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<IStudent[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [batches, setBatches] = useState<IBatch[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<IStudent[]>([]);

  // Load students
  useEffect(() => {
    if (isOpen) {
      loadStudents();
      loadOneOnOneBatches();
    }
  }, [isOpen]);

  // Filter students based on search
  useEffect(() => {
    const filtered = students.filter(student =>
      student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [students, searchTerm]);

  const loadStudents = async () => {
    try {
      const response = await apiClient.get('/users/students');
      if (response.data?.success) {
        setStudents(response.data.data || []);
      }
    } catch (error) {
      console.error('Error loading students:', error);
      showToast.error('Failed to load students');
    }
  };

  const loadOneOnOneBatches = async () => {
    try {
      const response = await apiClient.get('/batches', {
        params: {
          course: course?._id,
          is_individual_session: true,
          status: 'Active'
        }
      });
      if (response.data?.success) {
        setBatches(response.data.data || []);
      }
    } catch (error) {
      console.error('Error loading 1:1 batches:', error);
      showToast.error('Failed to load 1:1 session slots');
    }
  };

  const handleOneOnOneEnrollment = async () => {
    if (!selectedStudent || !selectedBatch) {
      showToast.error('Please select a student and 1:1 session slot');
      return;
    }

    try {
      setLoading(true);
      
      const response = await apiClient.post(`/enrollments/students/${selectedStudent}/enroll`, {
        courseId: course?._id,
        batchId: selectedBatch,
        enrollment_type: 'individual',
        enrollment_source: 'direct'
      });

      if (response.data?.success) {
        showToast.success('Student successfully enrolled in 1:1 session');
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      console.error('Error enrolling student in 1:1 session:', error);
      
      let errorMessage = 'Failed to enroll student in 1:1 session';
      if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || 'Invalid enrollment data';
      } else if (error.response?.status === 404) {
        errorMessage = 'Student or session slot not found';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error - please try again';
      }
      
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getSelectedStudent = () => {
    return students.find(student => student._id === selectedStudent);
  };

  const getSelectedBatch = () => {
    return batches.find(batch => batch._id === selectedBatch);
  };

  const availableBatches = batches.filter(batch => batch.enrolled_students < batch.capacity);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  1:1 Session Enrollment - {course?.course_title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Close modal"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              {/* Student Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Student *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search students by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg">
                  {filteredStudents.map((student) => (
                    <div
                      key={student._id}
                      onClick={() => setSelectedStudent(student._id)}
                      className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        selectedStudent === student._id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            {student.full_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {student.full_name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {student.email}
                          </p>
                        </div>
                        {selectedStudent === student._id && (
                          <CheckCircle className="w-5 h-5 text-blue-500 ml-auto" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 1:1 Session Slot Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select 1:1 Session Slot *
                </label>
                
                {availableBatches.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3 text-yellow-500" />
                    <p>No available 1:1 session slots</p>
                    <p className="text-sm">All slots are currently occupied</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {availableBatches.map((batch) => (
                      <div
                        key={batch._id}
                        onClick={() => setSelectedBatch(batch._id)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedBatch === batch._id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                              <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">
                                {batch.batch_name}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {batch.batch_code} • {batch.session_duration || 60} minutes
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Available
                              </span>
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            </div>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              {batch.enrolled_students}/{batch.capacity} enrolled
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Summary */}
              {(selectedStudent || selectedBatch) && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                  <h3 className="font-medium text-gray-900 dark:text-white">Enrollment Summary</h3>
                  
                  {selectedStudent && (
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Student: {getSelectedStudent()?.full_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {getSelectedStudent()?.email}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {selectedBatch && (
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Session: {getSelectedBatch()?.batch_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {getSelectedBatch()?.session_duration || 60} minutes • Individual session
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleOneOnOneEnrollment}
                disabled={!selectedStudent || !selectedBatch || loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Enrolling...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Enroll in 1:1 Session</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OneOnOneSessionModal;
