import React from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Completed Courses | Student Dashboard | Medh",
  description: "View and manage all your completed courses and achievements",
};

// Client component wrapper for the completed-courses dashboard
const CompletedCoursesDashboard = dynamic(
  () => import("@/components/sections/dashboards/CompletedCoursesDashboard"),
  {
    loading: () => <div className="min-h-screen flex items-center justify-center">Loading...</div>,
  }
);

// Server component
export default function CompletedCoursesPage() {
  return <CompletedCoursesDashboard />;
} 