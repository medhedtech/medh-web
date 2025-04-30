"use client";

import { useState, useEffect, useCallback } from "react";
import SidebarDashboard from "@/components/sections/sub-section/dashboards/SidebarDashboard";
import { ReactNode } from "react";
import { useDashboard } from "@/components/shared/wrappers/DashboardWrapper";

interface DashboardContainerProps {
  children: ReactNode;
}

const DashboardContainer = ({ children }: DashboardContainerProps) => {
  // Use the dashboard context instead of local state for shared values
  const { 
    isMobile, 
    sidebarOpen, 
    setSidebarOpen, 
    activeMenu, 
    setActiveMenu,
    setCurrentView
  } = useDashboard();
  
  // Mock user data that should come from auth context in a real implementation
  const [userData, setUserData] = useState({
    userRole: "admin",
    fullName: "",
    userEmail: "",
    userImage: "",
    userNotifications: 0,
    userSettings: {
      theme: "light",
      language: "en",
      notifications: true
    }
  });

  // Get user data on component mount
  useEffect(() => {
    // Get user data from localStorage
    const getUserData = () => {
      try {
        const storedFullName = localStorage.getItem("fullName") || localStorage.getItem("full_name");
        const storedUserRole = localStorage.getItem("role") || "admin";
        const storedUserEmail = localStorage.getItem("email") || "";
        
        setUserData({
          ...userData,
          fullName: storedFullName || "User",
          userRole: storedUserRole,
          userEmail: storedUserEmail
        });
      } catch (error) {
        console.error("Error accessing localStorage:", error);
      }
    };
    
    getUserData();
  }, []);

  // Handle menu click from sidebar
  const handleMenuClick = useCallback((menuName: string, items: any[]) => {
    setActiveMenu(menuName);
    
    // For hash-based navigation
    if (typeof window !== "undefined") {
      window.location.hash = encodeURIComponent(menuName);
    }
    
    // Update current view based on menu selection
    if (menuName.toLowerCase() === "dashboard") {
      setCurrentView("overview");
    } else {
      setCurrentView(menuName.toLowerCase().replace(/\s+/g, '-'));
    }
    
    // If on mobile, close sidebar after selection
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile, setActiveMenu, setCurrentView, setSidebarOpen]);

  return (
    <section className="min-h-screen">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar - with responsive behavior */}
          <div className={`
            fixed lg:relative top-0 left-0 h-screen z-30
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            w-[280px] lg:block shadow-lg lg:shadow-none
          `}>
            <SidebarDashboard 
              userRole={userData.userRole}
              fullName={userData.fullName}
              userEmail={userData.userEmail}
              userImage={userData.userImage}
              userNotifications={userData.userNotifications}
              userSettings={userData.userSettings}
              onMenuClick={handleMenuClick}
            />
          </div>
          
          {/* Main content area */}
          <div className="w-full lg:ml-2 flex-1 flex flex-col min-h-screen">
            {/* Mobile sidebar toggle */}
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="fixed z-40 bottom-6 right-6 p-3 rounded-full bg-primary-500 text-white shadow-lg"
                aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {sidebarOpen ? (
                    <path d="M18 6L6 18M6 6l12 12" />
                  ) : (
                    <path d="M4 12h16M4 6h16M4 18h16" />
                  )}
                </svg>
              </button>
            )}
            
            {/* Sidebar backdrop for mobile */}
            {isMobile && sidebarOpen && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-20"
                onClick={() => setSidebarOpen(false)}
              />
            )}
            
            {/* Content */}
            <div className="flex-1">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardContainer; 