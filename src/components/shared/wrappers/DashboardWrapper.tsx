"use client";

import React, { ReactNode, createContext, useState, useContext, useEffect } from "react";
import HeroDashboard from "@/components/sections/hero-banners/HeroDashboard";

// Dashboard context to manage shared state
interface DashboardContextType {
  currentView: string;
  setCurrentView: (view: string) => void;
  isMobile: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeMenu: string | null;
  setActiveMenu: (menu: string | null) => void;
}

export const DashboardContext = createContext<DashboardContextType>({
  currentView: "overview",
  setCurrentView: () => {},
  isMobile: false,
  sidebarOpen: true,
  setSidebarOpen: () => {},
  activeMenu: null,
  setActiveMenu: () => {}
});

// Custom hook to use dashboard context
export const useDashboard = () => useContext(DashboardContext);

interface DashboardWrapperProps {
  children: ReactNode;
}

const DashboardWrapper: React.FC<DashboardWrapperProps> = ({ children }) => {
  // State management
  const [currentView, setCurrentView] = useState<string>("overview");
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Check for mobile screens and apply view from URL hash if present
  useEffect(() => {
    const checkMobileScreen = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    // Initial check
    checkMobileScreen();
    
    // Check for hash in URL to set initial view
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        setCurrentView(hash);
      }
    }
    
    // Add resize listener
    window.addEventListener("resize", checkMobileScreen);
    
    // Clean up
    return () => {
      window.removeEventListener("resize", checkMobileScreen);
    };
  }, []);

  return (
    <DashboardContext.Provider value={{
      currentView,
      setCurrentView,
      isMobile,
      sidebarOpen,
      setSidebarOpen,
      activeMenu,
      setActiveMenu
    }}>
      <HeroDashboard />
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardWrapper;
