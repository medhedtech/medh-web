import React from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Enrolled Courses | Student Dashboard | Medh",
  description: "View and manage all your currently enrolled courses",
};

// Client component wrapper for the enrolled courses dashboard
const EnrolledCoursesDashboardWrapper = dynamic(
  () => import("@/components/sections/dashboards/EnrolledCoursesDashboard"),
  {
    loading: () => <div className="min-h-screen flex items-center justify-center">Loading...</div>,
  }
);

// Server component
export default function EnrolledCoursesDashboardPage() {
  return <EnrolledCoursesDashboardWrapper />;
} 