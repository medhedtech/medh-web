import React from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Assignments | Student Dashboard | Medh",
  description: "View and manage your course assignments, submissions, and grades",
};

// Client component wrapper for the assignments dashboard
const AssignmentsDashboard = dynamic(
  () => import("@/components/sections/dashboards/AssignmentsDashboard"),
  {
    loading: () => <div className="min-h-screen flex items-center justify-center">Loading...</div>,
  }
);

// Server component
export default function AssignmentsPage() {
  return <AssignmentsDashboard />;
} 