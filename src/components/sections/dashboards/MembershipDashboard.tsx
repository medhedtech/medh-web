"use client";

import React from "react";
import DashboardLayout from "./StudentDashboardLayout";

/**
 * MembershipDashboard - Component that displays the student's membership page
 * within the student dashboard layout
 */
const MembershipDashboard: React.FC = () => {
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

export default MembershipDashboard; 