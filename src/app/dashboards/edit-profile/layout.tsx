"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

interface LayoutProps {
  children: React.ReactNode;
}

const AdminDashboardLayout = dynamic(() => import("@/components/sections/dashboards/AdminDashboardLayout"));
const StudentDashboardLayout = dynamic(() => import("@/components/sections/dashboards/StudentDashboardLayout"));
const ParentDashboardLayout = dynamic(() => import("@/components/sections/dashboards/ParentDashboardLayout"));

const defaultUserProps = {
  userName: "",
  userEmail: "",
  userImage: "",
  userNotifications: 0,
  userSettings: { theme: "light", language: "en", notifications: true }
};

const EditProfileLayout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setUserRole(storedRole || "student");
  }, []);

  // Determine dashboard type from pathname
  const pathParts = pathname?.split("/") || [];
  const dashboardType = pathParts[2]?.split("-")[0] || "";
  const roleForDashboard = dashboardType || userRole || "student";

  if (roleForDashboard === "admin") {
    return <AdminDashboardLayout userRole="admin">{children}</AdminDashboardLayout>;
  }
  if (roleForDashboard === "parent") {
    return <ParentDashboardLayout userRole="parent" {...defaultUserProps}>{children}</ParentDashboardLayout>;
  }
  // Default to student
  return <StudentDashboardLayout userRole="student" {...defaultUserProps}>{children}</StudentDashboardLayout>;
};

export default EditProfileLayout; 