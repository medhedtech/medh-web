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
  FaTimes
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
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedStudentLatestSession, setSelectedStudentLatestSession] = useState<LatestSessionData | null>(null);
  const [loadingLatestSession, setLoadingLatestSession] = useState(false);
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Load students on component mount
  useEffect(() => {
    const loadStudents = async () => {
      try {
        const response = await liveClassesAPI.getStudents();
        setStudents(response.data || []);
      } catch (error) {
        console.error('Error loading students:', error);
      }
    };
    loadStudents();
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Live Session Form Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Select a student to see their latest session details
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Student Selection */}
          <div className="relative mb-8">
            <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-100 via-purple-100 to-violet-100 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-violet-900/30 rounded-lg shadow-sm border border-indigo-200 dark:border-indigo-700">
                <FaUser className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              Select Student *
            </label>
            
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowStudentDropdown(true)}
                className="w-full h-12 px-4 pr-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-colors"
                placeholder="Search and select a student..."
              />
              
              {selectedStudentId && (
                <button
                  onClick={clearSelection}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Student Dropdown */}
            {showStudentDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto">
                <div className="p-2">
                  {/* Search Bar */}
                  <div className="mb-3">
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-500 w-4 h-4" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search students..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  {/* Students List */}
                  <div className="max-h-48 overflow-y-auto">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map(student => (
                        <button
                          key={student._id}
                          onClick={() => handleStudentSelect(student._id)}
                          className="w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg cursor-pointer text-left transition-colors"
                        >
                          <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                            <FaUser className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                              {student.full_name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {student.email}
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-4 text-center text-gray-500 dark:text-gray-400">
                        <FaSearch className="w-6 h-6 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No students found</p>
                        <p className="text-xs">Try adjusting your search</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Latest Session Display */}
          {selectedStudentId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-700"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FaClock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Latest Session</h3>
              </div>
              
              {loadingLatestSession ? (
                <div className="flex items-center justify-center py-12">
                  <FaSpinner className="w-8 h-8 text-blue-600 animate-spin mr-4" />
                  <span className="text-lg text-gray-600 dark:text-gray-400">Loading latest session details...</span>
                </div>
              ) : selectedStudentLatestSession ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Latest session details</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedStudentLatestSession.status === 'completed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : selectedStudentLatestSession.status === 'scheduled'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                    }`}>
                      ✓ {selectedStudentLatestSession.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Session Title */}
                    <div className="flex items-start gap-3">
                      <FaFileAlt className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Session Title</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {selectedStudentLatestSession.sessionTitle}
                        </p>
                      </div>
                    </div>
                    
                    {/* Student */}
                    <div className="flex items-start gap-3">
                      <FaUser className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Student</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {selectedStudentLatestSession.student?.full_name}
                        </p>
                      </div>
                    </div>
                    
                    {/* Session Number */}
                    <div className="flex items-start gap-3">
                      <FaHashtag className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Session</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {selectedStudentLatestSession.sessionNo}
                        </p>
                      </div>
                    </div>
                    
                    {/* Grade & Instructor */}
                    <div className="flex items-start gap-3 md:col-span-2">
                      <FaGraduationCap className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Grade & Instructor</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {selectedStudentLatestSession.grade?.name || 'N/A'} • {selectedStudentLatestSession.instructor?.full_name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <FaClock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h4 className="text-lg font-medium mb-2">No Previous Sessions</h4>
                  <p className="text-sm">No previous sessions found for this student</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Instructions */}
          {!selectedStudentId && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <FaUser className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <h4 className="text-lg font-medium mb-2">Select a Student</h4>
              <p className="text-sm">Choose a student from the dropdown to see their latest session details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
