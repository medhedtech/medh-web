import React from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Live Classes | Student Dashboard | Medh",
  description: "Access and manage all your upcoming and ongoing live classes",
};

// Client component wrapper for the live classes dashboard
const LiveClassesDashboardWrapper = dynamic(
  () => import("@/components/sections/dashboards/LiveClassesDashboard"),
  {
    loading: () => <div className="min-h-screen flex items-center justify-center">Loading...</div>,
  }
);

// Server component
export default function LiveClassesDashboardPage() {
  return <LiveClassesDashboardWrapper />;
} 