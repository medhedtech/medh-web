"use client"

import React, { useState, useEffect } from "react";
import ProtectedPage from "@/app/protectedRoutes";
import InstructorDashboardLayout from "@/components/layout/main/dashboards/InstructorDashboardLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState({
    userRole: "instructor",
    fullName: "",
    userEmail: "",
    userImage: "",
    userNotifications: 0,
    userSettings: {
      theme: "light",
      language: "en",
      notifications: true
    }
  });

  // Get user data from localStorage with proper fallbacks
  useEffect(() => {
    const getUserData = () => {
      if (typeof window !== 'undefined') {
        const storedUserName = localStorage.getItem("userName") || "";
        const storedFullName = localStorage.getItem("fullName") || "";
        const storedName = storedUserName || storedFullName;
        const storedEmail = localStorage.getItem("email") || "";
        // Always use "instructor" role for this layout to avoid stale roles (e.g., "student")
        const storedRole = "instructor";
        
        let finalName = "Instructor";
        if (storedName) {
          const firstName = storedName.trim().split(' ')[0];
          finalName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
        }

        setUserData({
          userRole: storedRole,
          fullName: finalName,
          userEmail: storedEmail,
          userImage: "/avatar-placeholder.png",
          userNotifications: 0,
          userSettings: {
            theme: localStorage.getItem("theme") || "light",
            language: localStorage.getItem("language") || "en",
            notifications: localStorage.getItem("notifications") !== "false"
          }
        });
      }
    };

    getUserData();
  }, []);

  return (
    <ProtectedPage>
      <InstructorDashboardLayout
        userRole={userData.userRole}
        fullName={userData.fullName}
        userEmail={userData.userEmail}
        userImage={userData.userImage}
        userNotifications={userData.userNotifications}
        userSettings={userData.userSettings}
      >
        {children}
      </InstructorDashboardLayout>
    </ProtectedPage>
  );
} 