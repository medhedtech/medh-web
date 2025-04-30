"use client";

import React, { useState, useEffect } from "react";
import AdminDashboardLayout from "@/components/sections/dashboards/AdminDashboardLayout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [activeMenu, setActiveMenu] = useState<string | null>("Dashboard");
  const [activeSubItems, setActiveSubItems] = useState<any[]>([]);

  // Handle menu click from SidebarDashboard
  const handleMenuClick = (menuName: string, items: any[]) => {
    setActiveMenu(menuName);
    setActiveSubItems(items);
  };

  // Initialize with default dashboard items on first render
  useEffect(() => {
    // This ensures we start with Dashboard selected and its subitems
    if (typeof window !== 'undefined' && !window.location.hash) {
      // Only set if no hash in URL (hash-based navigation handled by AdminDashboardLayout)
      setActiveMenu("Dashboard");
    }
  }, []);

  return (
    <AdminDashboardLayout 
      userRole="admin"
      activeMenu={activeMenu}
      activeSubItems={activeSubItems}
      onMenuClick={handleMenuClick}
    >
      {children}
    </AdminDashboardLayout>
  );
} 