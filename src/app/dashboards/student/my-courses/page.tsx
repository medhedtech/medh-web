import React from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "My Courses | Student Dashboard | Medh",
  description: "Manage and access all your enrolled courses in one place",
};

// Client component wrapper for the my-courses dashboard
const MyCoursesDashboardWrapper = dynamic(
  () => import("@/components/sections/dashboards/MyCoursesDashboard"),
  {
    loading: () => <div className="min-h-screen flex items-center justify-center">Loading...</div>,
  }
);

// Server component
export default function MyCoursesDashboardPage() {
  return <MyCoursesDashboardWrapper />;
} 