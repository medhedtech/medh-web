import React from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Demo Classes & Booking | Student Dashboard | Medh",
  description: "Schedule new demo classes, manage your bookings, access session materials, and track your demo class progress",
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