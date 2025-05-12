import React from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Join Live Class | Student Dashboard | Medh",
  description: "Join your scheduled live classes and interactive sessions",
};

// Client component wrapper for the join live dashboard
const JoinLiveDashboardWrapper = dynamic(
  () => import("@/components/sections/dashboards/JoinLiveDashboard"),
  {
    loading: () => <div className="min-h-screen flex items-center justify-center">Loading...</div>,
  }
);

// Server component
export default function JoinLiveDashboardPage() {
  return <JoinLiveDashboardWrapper />;
} 