"use client";

import React from "react";
import DashboardLayout from "./StudentDashboardLayout";

/**
 * JoinLiveDashboard - Component that displays the student's join live page
 * within the student dashboard layout
 */
const JoinLiveDashboard: React.FC = () => {
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

export default JoinLiveDashboard; 