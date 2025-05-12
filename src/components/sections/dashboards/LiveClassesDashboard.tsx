"use client";

import React from "react";
import DashboardLayout from "./StudentDashboardLayout";

/**
 * LiveClassesDashboard - Component that displays the student's live classes page
 * within the student dashboard layout
 */
const LiveClassesDashboard: React.FC = () => {
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

export default LiveClassesDashboard; 