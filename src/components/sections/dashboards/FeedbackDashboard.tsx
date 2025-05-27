"use client";

import React from "react";
import DashboardLayout from "./StudentDashboardLayout";

/**
 * FeedbackDashboard - Component that displays the student's feedback page
 * within the student dashboard layout
 */
const FeedbackDashboard: React.FC = () => {
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

export default FeedbackDashboard; 