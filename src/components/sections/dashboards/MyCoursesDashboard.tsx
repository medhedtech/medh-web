"use client";

import React from "react";
import DashboardLayout from "./StudentDashboardLayout";

/**
 * MyCoursesDashboard - Component that displays the student's my courses page
 * within the student dashboard layout
 */
const MyCoursesDashboard: React.FC = () => {
  return (
    <DashboardLayout 
      userRole="student"
      fullName="Student"
      userEmail="student@example.com"
      userImage=""
      userNotifications={0}
      userSettings={{
        theme: "light",
        language: "en",
        notifications: true
      }}
    />
  );
};

export default MyCoursesDashboard; 