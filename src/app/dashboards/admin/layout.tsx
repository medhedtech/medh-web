"use client";

import React from "react";
import AdminDashboardLayout from "@/components/sections/dashboards/AdminDashboardLayout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminDashboardLayout userRole="admin">
      {children}
    </AdminDashboardLayout>
  );
} 