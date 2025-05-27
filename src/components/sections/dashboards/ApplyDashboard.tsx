"use client";

import React from "react";
import StudentDashboardLayout from "@/components/sections/dashboards/StudentDashboardLayout";

/**
 * ApplyDashboard - Wrapper component for the placement application page
 * within the student dashboard layout
 */
const ApplyDashboard: React.FC = () => {
  // Mock user data - in a real app, this would come from context or props
  const mockUserData = {
    userRole: "student",
    fullName: "John Doe",
    userEmail: "john.doe@example.com",
    userImage: "/images/default-avatar.png",
    userNotifications: 3,
    userSettings: {
      theme: "light",
      language: "en",
      notifications: true,
    },
  };

  return (
    <StudentDashboardLayout
      userRole={mockUserData.userRole}
      fullName={mockUserData.fullName}
      userEmail={mockUserData.userEmail}
      userImage={mockUserData.userImage}
      userNotifications={mockUserData.userNotifications}
      userSettings={mockUserData.userSettings}
    />
  );
};

export default ApplyDashboard; 