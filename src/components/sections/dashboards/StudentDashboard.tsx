"use client";

import React from "react";
import DashboardLayout from "./StudentDashboardLayout";

const StudentDashboard: React.FC = () => {
  return (
    <DashboardLayout 
      userRole="student"
      userName="Student"
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

export default StudentDashboard; 