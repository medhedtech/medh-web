"use client";

import React from "react";
import DashboardLayout from "./StudentDashboardLayout";

/**
 * QuizDashboard - Component that displays the student's quiz page
 * within the student dashboard layout
 */
const QuizDashboard: React.FC = () => {
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

export default QuizDashboard; 