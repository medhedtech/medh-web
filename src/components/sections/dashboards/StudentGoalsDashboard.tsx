"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import StudentDashboardLayout from '@/components/sections/dashboards/StudentDashboardLayout';

// Dynamic import for StudyGoalsManagement component
const StudyGoalsManagementContent = dynamic(() => import('@/components/layout/main/dashboards/StudyGoalsManagement'), {
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-sm text-gray-500">Loading goals...</p>
      </div>
    </div>
  ),
});

const StudentGoalsDashboard: React.FC = () => {
  const [studentId, setStudentId] = useState<string | null>(null);

  React.useEffect(() => {
    // Get student ID from localStorage or authentication
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setStudentId(storedUserId);
      } else {
        // Fallback for demo purposes
        const mockStudentId = '123456789';
        setStudentId(mockStudentId);
      }
    }
  }, []);

  return (
    <StudentDashboardLayout 
      userRole="student"
      fullName="Student User" // In real app, get from user data
      userEmail="student@example.com" // In real app, get from user data
      userImage="" // In real app, get from user data
      userNotifications={0}
      userSettings={{
        theme: "light",
        language: "en",
        notifications: true
      }}
    >
      {studentId && <StudyGoalsManagementContent />}
    </StudentDashboardLayout>
  );
};

export default StudentGoalsDashboard; 