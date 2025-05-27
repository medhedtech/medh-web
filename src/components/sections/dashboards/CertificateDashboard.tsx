"use client";

import React from "react";
import DashboardLayout from "./StudentDashboardLayout";

/**
 * CertificateDashboard - Component that displays the student's certificate page
 * within the student dashboard layout
 */
const CertificateDashboard: React.FC = () => {
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

export default CertificateDashboard; 