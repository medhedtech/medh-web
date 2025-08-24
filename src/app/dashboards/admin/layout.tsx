"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import AdminDashboardLayout from "@/components/sections/dashboards/AdminDashboardLayout";
import { usePathname } from "next/navigation";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import LoadingIndicator from "@/components/shared/loaders/LoadingIndicator";

// Define types for the context
interface AdminContextType {
  activeMenu: string | null;
  activeSubItems: any[];
  setActiveMenu: (menu: string | null) => void;
  setActiveSubItems: (items: any[]) => void;
  handleMenuClick: (menuName: string, items: any[]) => void;
}

// Create context for admin dashboard state
export const AdminContext = createContext<AdminContextType | null>(null);

// Hook to use admin context
export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdminContext must be used within an AdminProvider");
  }
  return context;
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [activeMenu, setActiveMenu] = useState<string | null>("Dashboard");
  const [activeSubItems, setActiveSubItems] = useState<any[]>([]);
  const pathname = usePathname();

  // Add authentication check for admin routes - ALWAYS call this hook
  const { loading, authorized } = useRequireAuth({
    roles: ['admin', 'super-admin'],
    redirectTo: '/login',
    onAuthFailure: (reason) => {
      console.log('Admin access denied:', reason);
    }
  });

  // Handle menu click from SidebarDashboard
  const handleMenuClick = (menuName: string, items: any[]) => {
    setActiveMenu(menuName);
    setActiveSubItems(items);
  };

  // Set active menu based on path on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Set from URL hash if present
      if (window.location.hash) {
        const hashValue = window.location.hash.replace('#', '');
        if (hashValue) {
          // Map hash to corresponding menu if needed
          const menuMap: Record<string, string> = {
            'admin-currency': 'Location & Currency',
            'admin-course-categories': 'Course Setup',
            'admin-studentmange': 'Student Management',
            'admin-instuctoremange': 'Instructor Management',
            // Add other mappings as needed
          };
          
          setActiveMenu(menuMap[hashValue] || hashValue);
        }
      } 
      // Otherwise set based on pathname
      else if (pathname) {
        if (pathname.includes('profile')) {
          setActiveMenu('Dashboard');
        } else if (pathname.endsWith('/admin')) {
          setActiveMenu('Dashboard');
        }
        // Add other path-based menu mappings here
      }
    }
  }, [pathname]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  // Redirect if not authorized (this will be handled by useRequireAuth)
  if (!authorized) {
    return null;
  }

  // Context value
  const contextValue: AdminContextType = {
    activeMenu,
    activeSubItems,
    setActiveMenu,
    setActiveSubItems,
    handleMenuClick
  };

  return (
    <AdminContext.Provider value={contextValue}>
      <AdminDashboardLayout 
        userRole="admin"
      >
        {children}
      </AdminDashboardLayout>
    </AdminContext.Provider>
  );
} 