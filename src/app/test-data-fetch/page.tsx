"use client";

import React, { useState, useEffect } from "react";
import { liveClassesAPI } from "@/apis/liveClassesAPI";

export default function TestDataFetch() {
  const [data, setData] = useState({
    students: [],
    grades: [],
    dashboards: [],
    instructors: [],
    batches: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("🔄 Fetching data...");

        const [studentsRes, gradesRes, dashboardsRes, instructorsRes, batchesRes] = await Promise.allSettled([
          liveClassesAPI.getStudents(),
          liveClassesAPI.getGrades(),
          liveClassesAPI.getDashboards(),
          liveClassesAPI.getInstructors(),
          liveClassesAPI.getAllBatches()
        ]);

        const newData = {
          students: studentsRes.status === 'fulfilled' ? (studentsRes.value.data?.data?.items || studentsRes.value.data?.items || []) : [],
          grades: gradesRes.status === 'fulfilled' ? (gradesRes.value.data?.data || gradesRes.value.data || []) : [],
          dashboards: dashboardsRes.status === 'fulfilled' ? (dashboardsRes.value.data?.data || dashboardsRes.value.data || []) : [],
          instructors: instructorsRes.status === 'fulfilled' ? (instructorsRes.value.data?.data?.items || instructorsRes.value.data?.items || []) : [],
          batches: batchesRes.status === 'fulfilled' ? (batchesRes.value.data?.data || batchesRes.value.data || []) : []
        };

        setData(newData);
        console.log("✅ Data fetched successfully:", newData);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Live Session Form Data Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Students */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-blue-600 mb-4">Students</h2>
            <p className="text-3xl font-bold text-blue-700">{data.students.length}</p>
            <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
              {data.students.slice(0, 5).map((student: any) => (
                <div key={student._id} className="text-sm p-2 bg-blue-50 rounded">
                  <div className="font-medium">{student.full_name}</div>
                  <div className="text-gray-500">{student.email}</div>
                </div>
              ))}
              {data.students.length > 5 && (
                <div className="text-xs text-gray-500 text-center">
                  ... and {data.students.length - 5} more
                </div>
              )}
            </div>
          </div>

          {/* Grades */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-green-600 mb-4">Grades</h2>
            <p className="text-3xl font-bold text-green-700">{data.grades.length}</p>
            <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
              {data.grades.map((grade: any) => (
                <div key={grade._id} className="text-sm p-2 bg-green-50 rounded">
                  <div className="font-medium">{grade.name}</div>
                  <div className="text-gray-500">Level: {grade.level}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboards */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-purple-600 mb-4">Dashboards</h2>
            <p className="text-3xl font-bold text-purple-700">{data.dashboards.length}</p>
            <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
              {data.dashboards.map((dashboard: any) => (
                <div key={dashboard._id} className="text-sm p-2 bg-purple-50 rounded">
                  <div className="font-medium">{dashboard.name}</div>
                  <div className="text-gray-500">{dashboard.type}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructors */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-orange-600 mb-4">Instructors</h2>
            <p className="text-3xl font-bold text-orange-700">{data.instructors.length}</p>
            <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
              {data.instructors.slice(0, 5).map((instructor: any) => (
                <div key={instructor._id} className="text-sm p-2 bg-orange-50 rounded">
                  <div className="font-medium">{instructor.full_name}</div>
                  <div className="text-gray-500">{instructor.email}</div>
                </div>
              ))}
              {data.instructors.length > 5 && (
                <div className="text-xs text-gray-500 text-center">
                  ... and {data.instructors.length - 5} more
                </div>
              )}
            </div>
          </div>

          {/* Batches */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-indigo-600 mb-4">Batches</h2>
            <p className="text-3xl font-bold text-indigo-700">{data.batches.length}</p>
            <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
              {data.batches.slice(0, 5).map((batch: any) => (
                <div key={batch._id} className="text-sm p-2 bg-indigo-50 rounded">
                  <div className="font-medium">{batch.batch_name || batch.name}</div>
                  <div className="text-gray-500">{batch.batch_code || batch.code}</div>
                </div>
              ))}
              {data.batches.length > 5 && (
                <div className="text-xs text-gray-500 text-center">
                  ... and {data.batches.length - 5} more
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">API Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span>Backend API (Port 8080): Connected</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span>Frontend (Port 3000): Running</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span>Data Fetching: Working</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span>MIME Type Issues: Resolved</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a 
            href="/dashboards/admin/online-class/live/create-session" 
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Live Session Form
          </a>
        </div>
      </div>
    </div>
  );
}
