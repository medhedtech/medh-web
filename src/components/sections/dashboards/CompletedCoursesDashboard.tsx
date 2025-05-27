"use client";

import React from "react";
import DashboardLayout from "./StudentDashboardLayout";

/**
 * CompletedCoursesDashboard - Component that displays the student's completed courses page
 * within the student dashboard layout
 */
const CompletedCoursesDashboard: React.FC = () => {
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

export default CompletedCoursesDashboard; 