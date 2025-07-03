"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import StudentDashboardLayout from "@/components/sections/dashboards/StudentDashboardLayout";

// Client component wrapper for the certificate list
const CertificateList = dynamic(
  () => import("@/components/sections/dashboards/CertificateList"),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    ),
  }
);

const CertificatePageClient = () => {
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
  });

  useEffect(() => {
    // Get user data from localStorage
    setUserData({
      fullName: localStorage.getItem("fullName") || "Student",
      email: localStorage.getItem("email") || "",
    });
  }, []);

  return (
    <StudentDashboardLayout
      userRole="student"
      fullName={userData.fullName}
      userEmail={userData.email}
      userImage=""
      userNotifications={0}
      userSettings={{
        theme: "light",
        language: "en",
        notifications: true
      }}
    >
      <CertificateList />
    </StudentDashboardLayout>
  );
};

export default CertificatePageClient; 