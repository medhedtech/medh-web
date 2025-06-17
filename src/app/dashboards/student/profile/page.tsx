import React from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Student Profile | Medh",
  description: "Manage your profile, view achievements, and track your learning progress",
};

// Client component wrapper for the student dashboard layout
const StudentDashboardLayoutComponent = dynamic(
  () => import("@/components/sections/dashboards/StudentDashboardLayout"),
  {
    loading: () => (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading your profile...</p>
          </div>
        </div>
      </div>
    )
  }
);

// Server component
export default function StudentProfilePage() {
  return (
    <StudentDashboardLayoutComponent
      userRole="student"
      fullName="Student Name"
      userEmail="student@example.com"
      userImage="/avatars/default-avatar.png"
      userNotifications={0}
      userSettings={{
        theme: 'light',
        language: 'en',
        notifications: true
      }}
    />
  );
} 