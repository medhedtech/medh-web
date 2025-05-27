"use client";

import React from "react";
import DashboardLayout from "./StudentDashboardLayout";

/**
 * AssignmentsDashboard - Component that displays the student's assignments page
 * within the student dashboard layout
 */
const AssignmentsDashboard: React.FC = () => {
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

export default AssignmentsDashboard; 