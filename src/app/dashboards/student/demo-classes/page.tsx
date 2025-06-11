import React from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "My Demo Classes | Student Dashboard | Medh",
  description: "Access and manage your demo classes, trial sessions, and preview content",
};

// Client component wrapper for the demo classes dashboard
const DemoClassesDashboardWrapper = dynamic(
  () => import("@/components/sections/dashboards/DemoClassesDashboard"),
  {
    loading: () => <div className="min-h-screen flex items-center justify-center">Loading...</div>,
  }
);

// Server component
export default function DemoClassesDashboardPage() {
  return <DemoClassesDashboardWrapper />;
} 