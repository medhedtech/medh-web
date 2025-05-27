"use client";

import React from "react";
import DashboardLayout from "./StudentDashboardLayout";

/**
 * AllCoursesDashboard - Component that displays the student's all courses page
 * within the student dashboard layout
 */
const AllCoursesDashboard: React.FC = () => {
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

export default AllCoursesDashboard; 