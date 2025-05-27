import React from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "All Courses | Student Dashboard | Medh",
  description: "Browse and discover all available courses in our comprehensive learning platform",
};

// Client component wrapper for the all-courses dashboard
const AllCoursesDashboard = dynamic(
  () => import("@/components/sections/dashboards/AllCoursesDashboard"),
  {
    loading: () => <div className="min-h-screen flex items-center justify-center">Loading...</div>,
  }
);

// Server component
export default function AllCoursesPage() {
  return <AllCoursesDashboard />;
} 
 