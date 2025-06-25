"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { instructorApi, Batch, AttendanceRecord, MarkAttendanceRequest } from '@/apis/instructor.api';
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
  LucideCalendar,
  LucideUsers,
  LucideCheckCircle,
  LucideXCircle,
  LucideClock,
  LucideAlertTriangle,
  LucideRefreshCw,
  LucideSearch,
  LucideSave,
  LucideFilter,
  LucideUser,
  LucideGraduationCap,
  LucideVideo,
  LucideClipboardList,
  LucideDownload,
  LucideUpload,
  LucideEdit,
  LucideEye,
  LucideMessageSquare,
  LucideTarget,
  LucideActivity,
  LucideBarChart
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  enrollmentDate: string;
}

interface AttendanceSession {
  batchId: string;
  sessionDate: string;
  sessionTime: string;
  sessionDuration: number;
  sessionTopic: string;
  attendanceRecords: AttendanceRecord[];
}

const MarkAttendancePage: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [sessionData, setSessionData] = useState<AttendanceSession>({
    batchId: '',
    sessionDate: new Date().toISOString().split('T')[0],
    sessionTime: new Date().toTimeString().slice(0, 5),
    sessionDuration: 60,
    sessionTopic: '',
    attendanceRecords: []
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [bulkAction, setBulkAction] = useState<'present' | 'absent' | null>(null);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        const response = await instructorApi.getActiveBatches({ status: 'active' });
        // Safeguard: ensure batches is always an array
        setBatches(Array.isArray(response) ? response : []);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching batches:', err);
        setError(err?.message || 'Failed to load batches');
        showToast.error('Failed to load batches');
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedBatch) {
        setStudents([]);
        return;
      }

      try {
        const response = await instructorApi.getStudentsList({ batch_id: selectedBatch });
        setStudents(response);
        
        // Initialize attendance records for all students
        const initialRecords: AttendanceRecord[] = response.map((student: Student) => ({
          student_id: student.id,
          status: 'present',
          join_time: '',
          leave_time: '',
          reason: '',
          notes: ''
        }));
        
        setSessionData(prev => ({
          ...prev,
          batchId: selectedBatch,
          attendanceRecords: initialRecords
        }));
      } catch (err: any) {
        console.error('Error fetching students:', err);
        showToast.error('Failed to load students');
      }
    };

    fetchStudents();
  }, [selectedBatch]);

  const updateAttendanceRecord = (studentId: string, field: keyof AttendanceRecord, value: any) => {
    setSessionData(prev => ({
      ...prev,
      attendanceRecords: prev.attendanceRecords.map(record =>
        record.student_id === studentId
          ? { ...record, [field]: value }
          : record
      )
    }));
  };

  const handleBulkAction = (action: 'present' | 'absent') => {
    const filteredStudents = getFilteredStudents();
    setSessionData(prev => ({
      ...prev,
      attendanceRecords: prev.attendanceRecords.map(record => {
        const student = filteredStudents.find(s => s.id === record.student_id);
        return student
          ? { ...record, status: action }
          : record;
      })
    }));
    setBulkAction(null);
    showToast.success(`Marked ${filteredStudents.length} students as ${action}`);
  };

  const handleSaveAttendance = async () => {
    if (!selectedBatch || !sessionData.sessionTopic.trim()) {
      showToast.error('Please select a batch and enter session topic');
      return;
    }

    try {
      setSaving(true);
      const request: MarkAttendanceRequest = {
        batch_id: sessionData.batchId,
        session_date: sessionData.sessionDate,
        session_time: sessionData.sessionTime,
        session_duration: sessionData.sessionDuration,
        session_topic: sessionData.sessionTopic,
        attendance_records: sessionData.attendanceRecords
      };

      await instructorApi.markAttendance(request);
      showToast.success('Attendance saved successfully!');
      
      // Reset form
      setSessionData(prev => ({
        ...prev,
        sessionTopic: '',
        attendanceRecords: prev.attendanceRecords.map(record => ({
          ...record,
          status: 'present',
          join_time: '',
          leave_time: '',
          reason: '',
          notes: ''
        }))
      }));
    } catch (err: any) {
      console.error('Error saving attendance:', err);
      showToast.error(err?.message || 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const getFilteredStudents = () => {
    return students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getAttendanceStats = () => {
    const total = sessionData.attendanceRecords.length;
    const present = sessionData.attendanceRecords.filter(r => r.status === 'present').length;
    const absent = sessionData.attendanceRecords.filter(r => r.status === 'absent').length;
    const late = sessionData.attendanceRecords.filter(r => r.status === 'late').length;
    const excused = sessionData.attendanceRecords.filter(r => r.status === 'excused').length;
    
    return { total, present, absent, late, excused };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300';
      case 'absent': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300';
      case 'late': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'excused': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <LucideCheckCircle className="w-4 h-4" />;
      case 'absent': return <LucideXCircle className="w-4 h-4" />;
      case 'late': return <LucideClock className="w-4 h-4" />;
      case 'excused': return <LucideAlertTriangle className="w-4 h-4" />;
      default: return <LucideUser className="w-4 h-4" />;
    }
  };

  if (loading) return <Preloader />;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
              <LucideAlertTriangle className="w-5 h-5" />
              Error Loading Data
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

  const stats = getAttendanceStats();

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
                <LucideClipboardList className="w-8 h-8 text-blue-600" />
                Mark Class Attendance
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Record and manage student attendance for your classes
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2">
                <LucideUpload className="w-4 h-4" />
                Import
              </button>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2">
                <LucideDownload className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Session Setup */}
        <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
              <LucideVideo className="w-5 h-5" />
              Session Information
                </CardTitle>
                <CardDescription>
              Configure the class session details before marking attendance
                </CardDescription>
              </CardHeader>
              <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Batch
                </label>
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose a batch...</option>
                  {batches.map(batch => (
                    <option key={batch._id} value={batch._id}>
                      {batch.batch_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Session Date
                </label>
                <input
                  type="date"
                  value={sessionData.sessionDate}
                  onChange={(e) => setSessionData(prev => ({ ...prev, sessionDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Session Time
                </label>
                <input
                  type="time"
                  value={sessionData.sessionTime}
                  onChange={(e) => setSessionData(prev => ({ ...prev, sessionTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={sessionData.sessionDuration}
                  onChange={(e) => setSessionData(prev => ({ ...prev, sessionDuration: parseInt(e.target.value) || 60 }))}
                  min="15"
                  max="480"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Session Topic
                </label>
                <input
                  type="text"
                  value={sessionData.sessionTopic}
                  onChange={(e) => setSessionData(prev => ({ ...prev, sessionTopic: e.target.value }))}
                  placeholder="Enter topic..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Statistics */}
        {selectedBatch && students.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.total}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Total Students
                  </p>
                </div>
                <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <LucideUsers className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {stats.present}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Present
                  </p>
                </div>
                <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                  <LucideCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {stats.absent}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Absent
                        </p>
                      </div>
                <div className="p-2 bg-red-50 dark:bg-red-900/30 rounded-lg">
                  <LucideXCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {stats.late}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Late
                      </p>
                    </div>
                <div className="p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                  <LucideClock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
          </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {stats.excused}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Excused
                  </p>
                  </div>
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <LucideAlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Student Attendance List */}
        {selectedBatch && students.length > 0 ? (
            <Card>
              <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <LucideUsers className="w-5 h-5" />
                  Student Attendance ({getFilteredStudents().length})
                </CardTitle>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <LucideSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBulkAction('present')}
                      className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm flex items-center gap-1"
                    >
                      <LucideCheckCircle className="w-4 h-4" />
                      Mark All Present
                    </button>
                    <button
                      onClick={() => handleBulkAction('absent')}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm flex items-center gap-1"
                    >
                      <LucideXCircle className="w-4 h-4" />
                      Mark All Absent
                    </button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {getFilteredStudents().map((student) => {
                  const attendanceRecord = sessionData.attendanceRecords.find(r => r.student_id === student.id);
                  
                  return (
                    <motion.div
                      key={student.id}
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {student.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {student.email}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {/* Status Selection */}
                        <select
                          value={attendanceRecord?.status || 'present'}
                          onChange={(e) => updateAttendanceRecord(student.id, 'status', e.target.value)}
                          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                          <option value="late">Late</option>
                          <option value="excused">Excused</option>
                        </select>

                        {/* Status Badge */}
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(attendanceRecord?.status || 'present')}`}>
                          {getStatusIcon(attendanceRecord?.status || 'present')}
                          {(attendanceRecord?.status || 'present').charAt(0).toUpperCase() + (attendanceRecord?.status || 'present').slice(1)}
                        </div>

                        {/* Additional Options */}
                        <button
                          onClick={() => {
                            // Add functionality to show detailed attendance modal
                          }}
                          className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                          title="View Details"
                        >
                          <LucideEye className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Save Button */}
              <div className="flex justify-end mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleSaveAttendance}
                  disabled={saving || !sessionData.sessionTopic.trim()}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
                >
                  {saving ? (
                    <>
                      <LucideRefreshCw className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <LucideSave className="w-5 h-5" />
                      Save Attendance
                    </>
                  )}
                </button>
              </div>
            </CardContent>
          </Card>
        ) : selectedBatch ? (
          <Card>
            <CardContent className="text-center py-12">
              <LucideUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No Students Found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                This batch doesn't have any enrolled students.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <LucideGraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Select a Batch
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Choose a batch from the dropdown above to start marking attendance.
              </p>
              </CardContent>
            </Card>
        )}
      </div>
    </motion.div>
  );
};

export default MarkAttendancePage;