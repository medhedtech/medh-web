"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "./StudentDashboardLayout";
import LessonCourseMaterialsMain from "@/components/layout/main/dashboards/LessonCourseMaterialsMain";

/**
 * LessonCourseMaterialsDashboard - Component that displays the student's lesson course materials page
 * within the student dashboard layout
 */
const LessonCourseMaterialsDashboard: React.FC = () => {
  const [userRole, setUserRole] = useState("student");
  const [fullName, setFullName] = useState("Student");
  const [userEmail, setUserEmail] = useState("");
  const [userImage, setUserImage] = useState("");
  const [userNotifications, setUserNotifications] = useState(0);
  const [userSettings, setUserSettings] = useState({
    theme: "light",
    language: "en",
    notifications: true
  });

  useEffect(() => {
    // Get user data from localStorage or other auth state
    const storedUserRole = localStorage.getItem("userRole") || "student";
    const storedUserName = localStorage.getItem("userName") || "";
    const storedFullName = localStorage.getItem("fullName") || "";
    const storedUserEmail = localStorage.getItem("userEmail") || "";
    const storedUserImage = localStorage.getItem("userImage") || "";
    
    // Use fallback logic for name
    const displayName = storedUserName || storedFullName || "Student";
    
    setUserRole(storedUserRole);
    setFullName(displayName);
    setUserEmail(storedUserEmail);
    setUserImage(storedUserImage);
    
    // You can also load notifications count and settings from API or localStorage
    const storedNotifications = localStorage.getItem("userNotifications");
    if (storedNotifications) {
      setUserNotifications(parseInt(storedNotifications, 10) || 0);
    }
    
    const storedSettings = localStorage.getItem("userSettings");
    if (storedSettings) {
      try {
        setUserSettings(JSON.parse(storedSettings));
      } catch (error) {
        console.error("Failed to parse user settings:", error);
      }
    }
  }, []);

  return (
    <DashboardLayout
      userRole={userRole}
      fullName={fullName}
      userEmail={userEmail}
      userImage={userImage}
      userNotifications={userNotifications}
      userSettings={userSettings}
    >
      <LessonCourseMaterialsMain />
    </DashboardLayout>
  );
};

export default LessonCourseMaterialsDashboard; 