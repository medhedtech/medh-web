"use client";

import React, { useState } from "react";
import { liveClassesAPI } from "@/apis/liveClassesAPI";

export default function DebugSession() {
  const [studentId, setStudentId] = useState("689485a5869a39114c18efec"); // Aanya's ID
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const testDirectFetch = async () => {
    console.log('🧪 Testing Direct Fetch with student ID:', studentId);
    const url = `http://localhost:8080/api/v1/live-classes/students/${studentId}/latest-session`;
    console.log('🔗 Direct Fetch URL:', url);
    
    setLoading(true);
    setError("");
    setSessionData(null);
    
    try {
      console.log('🚀 Making direct fetch call...');
      const response = await fetch(url);
      console.log('📡 Fetch response status:', response.status);
      console.log('📡 Fetch response ok:', response.ok);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Direct fetch response:', data);
      
      if (data.status === 'success' && data.data) {
        setSessionData(data.data);
        console.log('✅ Session data set from direct fetch');
      } else {
        console.log('ℹ️ No session data in direct fetch response');
        setSessionData(null);
      }
    } catch (err: any) {
      console.error('❌ Direct Fetch Error:', err);
      setError(`Direct Fetch: ${err.message}`);
    } finally {
      setLoading(false);
      console.log('🏁 Direct fetch test completed');
    }
  };

  const testAPI = async () => {
    console.log('🧪 Testing API with student ID:', studentId);
    console.log('🌐 API Base URL:', 'http://localhost:8080/api/v1');
    console.log('🔗 Full URL:', `http://localhost:8080/api/v1/live-classes/students/${studentId}/latest-session`);
    
    setLoading(true);
    setError("");
    setSessionData(null);
    
    try {
      console.log('🚀 Making API call...');
      const response = await liveClassesAPI.getStudentLatestSession(studentId);
      console.log('✅ API Response received:', response);
      console.log('📊 Response data:', response.data);
      
      if (response.data && response.data.data) {
        setSessionData(response.data.data);
        console.log('✅ Session data set successfully');
      } else {
        console.log('ℹ️ No session data in response');
        setSessionData(null);
      }
    } catch (err: any) {
      console.error('❌ API Error details:', err);
      console.error('❌ Error message:', err.message);
      console.error('❌ Error response:', err.response);
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
      console.log('🏁 API test completed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Debug Latest Session API</h1>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Student ID:
          </label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter student ID"
          />
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={testAPI}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors"
          >
            {loading ? 'Testing...' : 'Test API'}
          </button>
          
          <button
            onClick={testDirectFetch}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors"
          >
            Direct Fetch Test
          </button>
        </div>
        
        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {sessionData && (
          <div className="mt-6 p-4 bg-green-100 border border-green-400 rounded-md">
            <h3 className="text-lg font-semibold text-green-800 mb-3">✅ Session Data Found!</h3>
            <div className="space-y-2 text-sm">
              <div><strong>Session Title:</strong> {sessionData.sessionTitle}</div>
              <div><strong>Session No:</strong> {sessionData.sessionNo}</div>
              <div><strong>Status:</strong> {sessionData.status}</div>
              <div><strong>Student:</strong> {sessionData.student?.full_name}</div>
              <div><strong>Instructor:</strong> {sessionData.instructor?.full_name}</div>
              <div><strong>Grade:</strong> {sessionData.grade}</div>
              <div><strong>Batch:</strong> {sessionData.batch?.batch_name}</div>
            </div>
          </div>
        )}
        
        {sessionData === null && !loading && !error && (
          <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md">
            No session data found for this student.
          </div>
        )}
        
        <div className="mt-8 p-4 bg-gray-100 rounded-md">
          <h4 className="font-semibold mb-2">Test Student IDs:</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-2 bg-white rounded border">
              <div>
                <div className="font-medium">Aanya (has session)</div>
                <div className="text-gray-500 text-xs">689485a5869a39114c18efec</div>
              </div>
              <button 
                onClick={() => setStudentId("689485a5869a39114c18efec")}
                className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
              >
                Test
              </button>
            </div>
            <div className="flex items-center justify-between p-2 bg-white rounded border">
              <div>
                <div className="font-medium">Test Student (no session)</div>
                <div className="text-gray-500 text-xs">67bd77548a56e7688dd02c30</div>
              </div>
              <button 
                onClick={() => setStudentId("67bd77548a56e7688dd02c30")}
                className="px-3 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
              >
                Test
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
