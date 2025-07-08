"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import AdminDashboardLayout from "@/components/sections/dashboards/AdminDashboardLayout";
import { usePathname } from "next/navigation";

// Define types for the context
interface Admin2ContextType {
  activeMenu: string | null;
  activeSubItems: any[];
  setActiveMenu: (menu: string | null) => void;
  setActiveSubItems: (items: any[]) => void;
  handleMenuClick: (menuName: string, items: any[]) => void;
  quickActions: any[];
  setQuickActions: (actions: any[]) => void;
}

// Create context for admin2 dashboard state
export const Admin2Context = createContext<Admin2ContextType | null>(null);

// Hook to use admin2 context
export const useAdmin2Context = () => {
  const context = useContext(Admin2Context);
  if (!context) {
    throw new Error("useAdmin2Context must be used within an Admin2Provider");
  }
  return context;
};

// Enhanced quick actions with more functionality
const defaultQuickActions = [
  {
    id: 1,
    title: "Create New Course",
    description: "Add a new course to the platform",
    icon: "📚",
    action: "/dashboards/admin2/courses/create",
    color: "bg-blue-500",
    category: "course"
  },
  {
    id: 2,
    title: "Add Student",
    description: "Register a new student",
    icon: "👨‍🎓",
    action: "/dashboards/admin2/add-student",
    color: "bg-green-500",
    category: "student"
  },
  {
    id: 3,
    title: "Add Instructor",
    description: "Onboard a new instructor",
    icon: "👨‍🏫",
    action: "/dashboards/admin2/add-instructor",
    color: "bg-purple-500",
    category: "instructor"
  },
  {
    id: 4,
    title: "Manage Batches",
    description: "Create and manage course batches",
    icon: "📊",
    action: "/dashboards/admin2/batch",
    color: "bg-orange-500",
    category: "batch"
  },
  {
    id: 5,
    title: "View Analytics",
    description: "Check platform analytics",
    icon: "📈",
    action: "/dashboards/admin2/analytics",
    color: "bg-indigo-500",
    category: "analytics"
  },
  {
    id: 6,
    title: "Create Announcement",
    description: "Send announcement to users",
    icon: "📢",
    action: "/dashboards/admin2/announcements-create",
    color: "bg-red-500",
    category: "announcement"
  },
  {
    id: 7,
    title: "Manage Coupons",
    description: "Create and manage discount coupons",
    icon: "🎟️",
    action: "/dashboards/admin2/coupons",
    color: "bg-yellow-500",
    category: "coupon"
  },
  {
    id: 8,
    title: "Course Categories",
    description: "Manage course categories",
    icon: "📋",
    action: "/dashboards/admin2/course-categories",
    color: "bg-teal-500",
    category: "category"
  },
  {
    id: 9,
    title: "Instructor Payouts",
    description: "Manage instructor payments",
    icon: "💰",
    action: "/dashboards/admin2/instructor-payouts",
    color: "bg-emerald-500",
    category: "finance"
  },
  {
    id: 10,
    title: "Security Settings",
    description: "Configure security settings",
    icon: "🔒",
    action: "/dashboards/admin2/security-settings",
    color: "bg-gray-500",
    category: "security"
  },
  {
    id: 11,
    title: "Home Editor",
    description: "Edit homepage content",
    icon: "🏠",
    action: "/dashboards/admin2/home-editor",
    color: "bg-pink-500",
    category: "content"
  },
  {
    id: 12,
    title: "Task Management",
    description: "Manage platform tasks",
    icon: "✅",
    action: "/dashboards/admin2/task-management",
    color: "bg-cyan-500",
    category: "task"
  }
];

export default function Admin2Layout({ children }: { children: React.ReactNode }) {
  const [activeMenu, setActiveMenu] = useState<string | null>("Dashboard");
  const [activeSubItems, setActiveSubItems] = useState<any[]>([]);
  const [quickActions, setQuickActions] = useState<any[]>(defaultQuickActions);
  const pathname = usePathname();

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
            'admin2-currency': 'Location & Currency',
            'admin2-course-categories': 'Course Setup',
            'admin2-studentmange': 'Student Management',
            'admin2-instuctoremange': 'Instructor Management',
            'admin2-analytics': 'Analytics & Reports',
            'admin2-content': 'Content Management',
            'admin2-finance': 'Financial Management',
            'admin2-security': 'Security & Settings',
            // Add other mappings as needed
          };
          
          setActiveMenu(menuMap[hashValue] || hashValue);
        }
      } 
      // Otherwise set based on pathname
      else if (pathname) {
        if (pathname.includes('profile')) {
          setActiveMenu('Dashboard');
        } else if (pathname.endsWith('/admin2')) {
          setActiveMenu('Dashboard');
        } else if (pathname.includes('courses')) {
          setActiveMenu('Course Management');
        } else if (pathname.includes('students')) {
          setActiveMenu('Student Management');
        } else if (pathname.includes('instructors')) {
          setActiveMenu('Instructor Management');
        } else if (pathname.includes('announcements')) {
          setActiveMenu('Communication');
        } else if (pathname.includes('analytics')) {
          setActiveMenu('Analytics & Reports');
        }
        // Add other path-based menu mappings here
      }
    }
  }, [pathname]);

  // Context value
  const contextValue: Admin2ContextType = {
    activeMenu,
    activeSubItems,
    setActiveMenu,
    setActiveSubItems,
    handleMenuClick,
    quickActions,
    setQuickActions
  };

  return (
    <Admin2Context.Provider value={contextValue}>
      <AdminDashboardLayout 
        userRole="superadmin"
        activeMenu={activeMenu}
        activeSubItems={activeSubItems}
        onMenuClick={handleMenuClick}
        quickActions={quickActions}
        dashboardType="admin2"
      >
        {children}
      </AdminDashboardLayout>
    </Admin2Context.Provider>
  );
} 