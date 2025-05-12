"use client";

import React from "react";
import DashboardLayout from "./StudentDashboardLayout";

/**
 * RecordedSessionsDashboard - Component that displays the student's recorded sessions page
 * within the student dashboard layout
 */
const RecordedSessionsDashboard: React.FC = () => {
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

export default RecordedSessionsDashboard; 