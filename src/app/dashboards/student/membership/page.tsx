import React from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Membership | Student Dashboard | Medh",
  description: "Manage your membership plans and subscription details",
};

// Client component wrapper for the membership dashboard
const MembershipDashboardWrapper = dynamic(
  () => import("@/components/sections/dashboards/MembershipDashboard"),
  {
    loading: () => <div className="min-h-screen flex items-center justify-center">Loading...</div>,
  }
);

// Server component
export default function MembershipDashboardPage() {
  return <MembershipDashboardWrapper />;
} 