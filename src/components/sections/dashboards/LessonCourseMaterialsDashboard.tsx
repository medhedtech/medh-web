"use client";

import React from "react";
import DashboardLayout from "./StudentDashboardLayout";

/**
 * LessonCourseMaterialsDashboard - Component that displays the student's lesson course materials page
 * within the student dashboard layout
 */
const LessonCourseMaterialsDashboard: React.FC = () => {
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

export default LessonCourseMaterialsDashboard; 