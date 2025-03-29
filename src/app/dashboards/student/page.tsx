import React from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Student Dashboard | Medh",
  description: "Manage your learning journey, courses, and student resources in one place",
};

// Client component wrapper for the dashboard
const StudentDashboard = dynamic(() => import("@/components/sections/dashboards/StudentDashboard"), { 
  loading: () => <div className="min-h-screen flex items-center justify-center">Loading...</div>
});

// Server component
export default function StudentDashboardPage() {
  return <StudentDashboard />;
} 