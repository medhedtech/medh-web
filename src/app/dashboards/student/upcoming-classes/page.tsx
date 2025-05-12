import React from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Upcoming Classes | Student Dashboard | Medh",
  description: "View your scheduled upcoming classes and sessions",
};

// Client component wrapper for the upcoming classes dashboard
const UpcomingClassesDashboardWrapper = dynamic(
  () => import("@/components/sections/dashboards/UpcomingClassesDashboard"),
  {
    loading: () => <div className="min-h-screen flex items-center justify-center">Loading...</div>,
  }
);

// Server component
export default function UpcomingClassesDashboardPage() {
  return <UpcomingClassesDashboardWrapper />;
} 