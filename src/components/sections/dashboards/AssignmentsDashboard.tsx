"use client";

import React from "react";
import StudentDashboardLayout from "./StudentDashboardLayout";
import AssignmentsMain from "@/components/layout/main/dashboards/AssignmentsMain";

/**
 * AssignmentsDashboard - Component that displays the student's assignments page
 * within the student dashboard layout
 */
const AssignmentsDashboard: React.FC = () => {
  return (
    <StudentDashboardLayout 
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
      <AssignmentsMain />
    </StudentDashboardLayout>
  );
};

export default AssignmentsDashboard; 