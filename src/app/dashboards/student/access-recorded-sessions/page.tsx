import React from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Recorded Sessions | Student Dashboard | Medh",
  description: "Access and watch recordings of all your previously attended classes",
};

// Client component wrapper for the recorded sessions dashboard
const RecordedSessionsDashboardWrapper = dynamic(
  () => import("@/components/sections/dashboards/RecordedSessionsDashboard"),
  {
    loading: () => <div className="min-h-screen flex items-center justify-center">Loading...</div>,
  }
);

// Server component
export default function RecordedSessionsDashboardPage() {
  return <RecordedSessionsDashboardWrapper />;
} 