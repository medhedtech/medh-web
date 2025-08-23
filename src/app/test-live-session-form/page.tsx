"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FaUser, 
  FaClock, 
  FaSpinner, 
  FaFileAlt, 
  FaHashtag, 
  FaGraduationCap,
  FaSearch,
  FaTimes,
  FaCheck,
  FaExclamationTriangle
} from "react-icons/fa";
import { liveClassesAPI, IStudent } from "@/apis/liveClassesAPI";

interface LatestSessionData {
  sessionTitle: string;
  sessionNo: string;
  status: string;
  student: IStudent;
  instructor: any;
  grade: any;
  batch: any;
  date: string;
  courseCategory: string;
  remarks?: string;
  summary?: any;
}

export default function TestLiveSessionForm() {
  const [students, setStudents] = useState<IStudent[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [dashboards, setDashboards] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedStudentLatestSession, setSelectedStudentLatestSession] = useState<LatestSessionData | null>(null);
  const [loadingLatestSession, setLoadingLatestSession] = useState(false);
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Load all data on component mount
  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        setError("");
        console.log('🔄 Loading all data for live session form...');
        
        // Load all data from API
        const [studentsRes, gradesRes, dashboardsRes, instructorsRes, batchesRes] = await Promise.allSettled([
          liveClassesAPI.getStudents(),
          liveClassesAPI.getGrades(),
          liveClassesAPI.getDashboards(),
          liveClassesAPI.getInstructors(),
          liveClassesAPI.getAllBatches()
        ]);

        console.log('📊 API Responses:', {
          students: studentsRes,
          grades: gradesRes,
          dashboards: dashboardsRes,
          instructors: instructorsRes,
          batches: batchesRes
        });

        // Process students data
        if (studentsRes.status === 'fulfilled' && studentsRes.value.data) {
          const extractedStudents = studentsRes.value.data?.data?.items || 
                                   studentsRes.value.data?.items || 
                                   studentsRes.value.data || [];
          setStudents(Array.isArray(extractedStudents) ? extractedStudents : []);
          console.log('✅ Students loaded:', extractedStudents.length);
        } else {
          console.error('❌ Students API failed:', studentsRes.reason);
          setError('Failed to load students');
        }

        // Process grades data
        if (gradesRes.status === 'fulfilled' && gradesRes.value.data) {
          const extractedGrades = gradesRes.value.data?.data || gradesRes.value.data || [];
          setGrades(Array.isArray(extractedGrades) ? extractedGrades : []);
          console.log('✅ Grades loaded:', extractedGrades.length);
        } else {
          console.error('❌ Grades API failed:', gradesRes.reason);
        }

        // Process dashboards data
        if (dashboardsRes.status === 'fulfilled' && dashboardsRes.value.data) {
          const extractedDashboards = dashboardsRes.value.data?.data || dashboardsRes.value.data || [];
          setDashboards(Array.isArray(extractedDashboards) ? extractedDashboards : []);
          console.log('✅ Dashboards loaded:', extractedDashboards.length);
        } else {
          console.error('❌ Dashboards API failed:', dashboardsRes.reason);
        }

        // Process instructors data
        if (instructorsRes.status === 'fulfilled' && instructorsRes.value.data) {
          const extractedInstructors = instructorsRes.value.data?.data?.items || 
                                      instructorsRes.value.data?.items || 
                                      instructorsRes.value.data || [];
          setInstructors(Array.isArray(extractedInstructors) ? extractedInstructors : []);
          console.log('✅ Instructors loaded:', extractedInstructors.length);
        } else {
          console.error('❌ Instructors API failed:', instructorsRes.reason);
        }

        // Process batches data
        if (batchesRes.status === 'fulfilled' && batchesRes.value.data) {
          const extractedBatches = batchesRes.value.data?.data || batchesRes.value.data || [];
          setBatches(Array.isArray(extractedBatches) ? extractedBatches : []);
          console.log('✅ Batches loaded:', extractedBatches.length);
        } else {
          console.error('❌ Batches API failed:', batchesRes.reason);
        }

      } catch (error) {
        console.error('❌ Error loading data:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  // Filter students based on search query
  const filteredStudents = students.filter(student =>
    student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle student selection
  const handleStudentSelect = async (studentId: string) => {
    console.log('🎯 Student selected:', studentId);
    setSelectedStudentId(studentId);
    setShowStudentDropdown(false);
    
    const selectedStudent = students.find(s => s._id === studentId);
    setSearchQuery(selectedStudent?.full_name || "");
    
    // Fetch latest session for selected student
    console.log('🚀 Fetching latest session...');
    setLoadingLatestSession(true);
    try {
      const response = await liveClassesAPI.getStudentLatestSession(studentId);
      console.log('📥 API Response:', response);
      
      if (response.data) {
        console.log('✅ Setting session data:', response.data);
        setSelectedStudentLatestSession(response.data);
      } else {
        console.log('❌ No session data');
        setSelectedStudentLatestSession(null);
      }
    } catch (error) {
      console.error('❌ Error fetching student latest session:', error);
      setSelectedStudentLatestSession(null);
    } finally {
      setLoadingLatestSession(false);
    }
  };

  const clearSelection = () => {
    setSelectedStudentId("");
    setSearchQuery("");
    setSelectedStudentLatestSession(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Live Session Form Data Test
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Testing data fetching for live session form fields
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">Loading data...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <FaExclamationTriangle className="text-red-500 mr-2" />
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}

          {/* Data Summary */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Students</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{students.length}</p>
                  </div>
                  <FaUser className="text-blue-500 text-xl" />
                </div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 dark:text-green-400">Grades</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">{grades.length}</p>
                  </div>
                  <FaGraduationCap className="text-green-500 text-xl" />
                </div>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 dark:text-purple-400">Dashboards</p>
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{dashboards.length}</p>
                  </div>
                  <FaFileAlt className="text-purple-500 text-xl" />
                </div>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-600 dark:text-orange-400">Instructors</p>
                    <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{instructors.length}</p>
                  </div>
                  <FaUser className="text-orange-500 text-xl" />
                </div>
              </div>
              
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400">Batches</p>
                    <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">{batches.length}</p>
                  </div>
                  <FaHashtag className="text-indigo-500 text-xl" />
                </div>
              </div>
            </div>
          )}

          {/* Student Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Student Selection Test
            </h2>
            
            <div className="relative">
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                <FaSearch className="text-gray-400 ml-3" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowStudentDropdown(true)}
                  className="flex-1 px-3 py-3 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                                 {selectedStudentId && (
                   <button
                     onClick={clearSelection}
                     className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                     aria-label="Clear selection"
                   >
                     <FaTimes />
                   </button>
                 )}
              </div>

              {/* Student Dropdown */}
              {showStudentDropdown && filteredStudents.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredStudents.map((student) => (
                    <div
                      key={student._id}
                      onClick={() => handleStudentSelect(student._id)}
                      className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900 dark:text-white">
                        {student.full_name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {student.email}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Student Info */}
            {selectedStudentId && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Selected Student
                </h3>
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p><strong>Name:</strong> {students.find(s => s._id === selectedStudentId)?.full_name}</p>
                  <p><strong>Email:</strong> {students.find(s => s._id === selectedStudentId)?.email}</p>
                </div>
              </div>
            )}
          </div>

          {/* Latest Session Data */}
          {selectedStudentId && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Latest Session Data
              </h2>
              
              {loadingLatestSession ? (
                <div className="text-center py-8">
                  <FaSpinner className="animate-spin text-2xl text-blue-500 mx-auto mb-2" />
                  <p className="text-gray-600 dark:text-gray-300">Loading latest session...</p>
                </div>
              ) : selectedStudentLatestSession ? (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <FaCheck className="text-green-500 mr-2" />
                    <h3 className="font-semibold text-green-900 dark:text-green-100">
                      Latest Session Found
                    </h3>
                  </div>
                  <div className="text-sm text-green-800 dark:text-green-200 space-y-1">
                    <p><strong>Title:</strong> {selectedStudentLatestSession.sessionTitle}</p>
                    <p><strong>Session No:</strong> {selectedStudentLatestSession.sessionNo}</p>
                    <p><strong>Date:</strong> {new Date(selectedStudentLatestSession.date).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> {selectedStudentLatestSession.status}</p>
                    {selectedStudentLatestSession.remarks && (
                      <p><strong>Remarks:</strong> {selectedStudentLatestSession.remarks}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                  <div className="flex items-center">
                    <FaExclamationTriangle className="text-yellow-500 mr-2" />
                    <span className="text-yellow-800 dark:text-yellow-200">
                      No previous sessions found for this student
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sample Data Display */}
          {!loading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sample Students */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Sample Students ({students.length})
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {students.slice(0, 5).map((student) => (
                    <div key={student._id} className="text-sm p-2 bg-white dark:bg-gray-600 rounded border">
                      <div className="font-medium">{student.full_name}</div>
                      <div className="text-gray-500 dark:text-gray-400">{student.email}</div>
                    </div>
                  ))}
                  {students.length > 5 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      ... and {students.length - 5} more
                    </div>
                  )}
                </div>
              </div>

              {/* Sample Grades */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Available Grades ({grades.length})
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {grades.map((grade) => (
                    <div key={grade._id} className="text-sm p-2 bg-white dark:bg-gray-600 rounded border">
                      <div className="font-medium">{grade.name}</div>
                      <div className="text-gray-500 dark:text-gray-400">Level: {grade.level}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
