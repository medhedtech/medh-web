"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import StudentDashboardLayout from '@/components/sections/dashboards/StudentDashboardLayout';

// Dynamic import for PracticeExercisesContent component
const PracticeExercisesContent = dynamic(() => import('@/components/layout/main/dashboards/PracticeExercisesContent'), {
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-500">Loading practice exercises...</p>
      </div>
    </div>
  ),
});

const PracticeExercisesPage: React.FC = () => {
  const [studentId, setStudentId] = React.useState<string | null>(null);

  React.useEffect(() => {
    // In a real implementation, you would get the student ID from authentication
    // For demo purposes, we're using a mock ID
    const mockStudentId = '123456789';
    setStudentId(mockStudentId);
    
    // Alternative: Get from local storage or auth service
    // const user = JSON.parse(localStorage.getItem('user') || '{}');
    // setStudentId(user?.id || null);
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
      {studentId && <PracticeExercisesContent />}
    </StudentDashboardLayout>
  );
};

export default PracticeExercisesPage; 