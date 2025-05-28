"use client";

import React from "react";
import StudentProfilePage from "@/components/sections/dashboards/student/StudentProfilePage";
import StudentDashboardLayout from "@/components/sections/dashboards/StudentDashboardLayout";

export default function StudentProfile() {
  // Mock user data for development
  const userData = {
    userRole: "student",
    fullName: "Jane Smith",
    userEmail: "jane.smith@example.com",
    userImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    userNotifications: 3,
    userSettings: {
      theme: "light",
      language: "en",
      notifications: true
    }
  };

  return (
    <StudentDashboardLayout
      userRole={userData.userRole}
      fullName={userData.fullName}
      userEmail={userData.userEmail}
      userImage={userData.userImage}
      userNotifications={userData.userNotifications}
      userSettings={userData.userSettings}
    >
      <StudentProfilePage />
    </StudentDashboardLayout>
  );
} 