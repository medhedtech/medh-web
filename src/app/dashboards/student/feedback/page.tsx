import React from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Feedback & Support | Student Dashboard | Medh",
  description: "Submit feedback, complaints, and get support for your learning journey",
};

// Client component wrapper for the feedback dashboard
const FeedbackDashboard = dynamic(
  () => import("@/components/sections/dashboards/FeedbackDashboard"),
  {
    loading: () => <div className="min-h-screen flex items-center justify-center">Loading...</div>,
  }
);

// Server component
export default function FeedbackPage() {
  return <FeedbackDashboard />;
} 