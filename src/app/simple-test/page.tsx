"use client";

import React, { useState, useEffect } from "react";
import { liveClassesAPI, IStudent } from "@/apis/liveClassesAPI";

export default function SimpleTest() {
  const [students, setStudents] = useState<IStudent[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Load students on mount
  useEffect(() => {
    const loadStudents = async () => {
      try {
        console.log('🔄 Loading students...');
        const response = await liveClassesAPI.getStudents();
        console.log('✅ Students loaded:', response.data);
        setStudents(response.data?.items || []);
      } catch (error) {
        console.error('❌ Error loading students:', error);
      }
    };
    loadStudents();
  }, []);

  // Handle student selection
  const handleStudentChange = async (studentId: string) => {
    console.log('👆 Student selected:', studentId);
    setSelectedStudent(studentId);
    setError("");
    
    if (!studentId) {
      setSessionData(null);
      return;
    }

    // Fetch latest session
    setLoading(true);
    try {
      console.log('🚀 Fetching latest session for:', studentId);
      const response = await liveClassesAPI.getStudentLatestSession(studentId);
      console.log('📥 Session response:', response);
      
      if (response.data && response.data.data) {
        console.log('✅ Setting session data:', response.data.data);
        setSessionData(response.data.data);
      } else {
        console.log('ℹ️ No session data found');
        setSessionData(null);
      }
    } catch (err: any) {
      console.error('❌ Error fetching session:', err);
      setError(err.message || 'Failed to fetch session');
      setSessionData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Simple Student Session Test</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Select Student</h2>
          
          <select
            value={selectedStudent}
            onChange={(e) => handleStudentChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select a Student --</option>
            {students.map(student => (
              <option key={student._id} value={student._id}>
                {student.full_name} ({student.email})
              </option>
            ))}
          </select>
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-gray-600">Loading latest session...</span>
            </div>
          </div>
        )}

        {/* Session Data Display */}
        {sessionData && !loading && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-600">✅ Latest Session Found!</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Session Info</h3>
                <div className="space-y-1 text-sm">
                  <div><strong>Title:</strong> {sessionData.sessionTitle}</div>
                  <div><strong>Session No:</strong> {sessionData.sessionNo}</div>
                  <div><strong>Status:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      sessionData.status === 'completed' ? 'bg-green-100 text-green-800' :
                      sessionData.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {sessionData.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Student & Instructor</h3>
                <div className="space-y-1 text-sm">
                  <div><strong>Student:</strong> {sessionData.student?.full_name}</div>
                  <div><strong>Student ID:</strong> {sessionData.student?._id}</div>
                  <div><strong>Instructor:</strong> {sessionData.instructor?.full_name}</div>
                  <div><strong>Grade:</strong> {sessionData.grade}</div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                <h3 className="font-semibold text-gray-700 mb-2">Batch Info</h3>
                <div className="space-y-1 text-sm">
                  <div><strong>Batch Name:</strong> {sessionData.batch?.batch_name}</div>
                  <div><strong>Batch Code:</strong> {sessionData.batch?.batch_code}</div>
                  <div><strong>Course Category:</strong> {sessionData.courseCategory}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Session Found */}
        {selectedStudent && !sessionData && !loading && !error && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">📭</div>
              <h3 className="text-lg font-semibold mb-2">No Sessions Found</h3>
              <p>No previous sessions found for this student.</p>
            </div>
          </div>
        )}

        {/* Debug Info */}
        <div className="bg-gray-100 rounded-lg p-4 mt-6">
          <h3 className="font-semibold mb-2">Debug Info</h3>
          <div className="text-sm space-y-1">
            <div><strong>Selected Student ID:</strong> {selectedStudent || 'None'}</div>
            <div><strong>Students Loaded:</strong> {students.length}</div>
            <div><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</div>
            <div><strong>Has Session Data:</strong> {sessionData ? 'Yes' : 'No'}</div>
            <div><strong>Error:</strong> {error || 'None'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
