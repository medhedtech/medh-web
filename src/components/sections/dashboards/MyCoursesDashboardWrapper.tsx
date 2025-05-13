'use client';

import React, { useEffect, useState } from 'react';
import MyCoursesDashboard from './MyCoursesDashboard';
import DashboardLayout from './StudentDashboardLayout';

interface IMyCoursesDashboardWrapperProps {
  // Add props if needed
}

const MyCoursesDashboardWrapper: React.FC<IMyCoursesDashboardWrapperProps> = () => {
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    // In a real implementation, you would get the student ID from authentication
    // For demo purposes, we're using a mock ID
    const mockStudentId = '123456789';
    setStudentId(mockStudentId);
    
    // Alternative: Get from local storage or auth service
    // const user = JSON.parse(localStorage.getItem('user') || '{}');
    // setStudentId(user?.id || null);
  }, []);

  return (
    <DashboardLayout 
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
      {studentId && <MyCoursesDashboard studentId={studentId} />}
    </DashboardLayout>
  );
};

export default MyCoursesDashboardWrapper; 