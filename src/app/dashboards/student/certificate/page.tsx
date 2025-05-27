import React from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Certificates | Student Dashboard | Medh",
  description: "View and download your course completion certificates",
};

// Client component wrapper for the certificate dashboard
const CertificateDashboard = dynamic(
  () => import("@/components/sections/dashboards/CertificateDashboard"),
  {
    loading: () => <div className="min-h-screen flex items-center justify-center">Loading...</div>,
  }
);

// Server component
export default function CertificatePage() {
  return <CertificateDashboard />;
} 