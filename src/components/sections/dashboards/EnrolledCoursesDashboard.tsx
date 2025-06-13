"use client";

import React from "react";
import DashboardLayout from "./StudentDashboardLayout";
import EnrolledCoursesMain from "@/components/layout/main/dashboards/EnrolledCoursesMain";

/**
 * EnrolledCoursesDashboard - Component that displays the student's enrolled courses page
 * within the student dashboard layout
 */
const EnrolledCoursesDashboard: React.FC = () => {
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
    >
      <EnrolledCoursesMain />
    </DashboardLayout>
  );
};

export default EnrolledCoursesDashboard; 