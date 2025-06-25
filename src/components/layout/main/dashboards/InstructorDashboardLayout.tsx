"use client";

import React, { useState, useEffect, useMemo, createContext } from "react";
import { usePathname } from "next/navigation";
import { X, Menu } from "lucide-react";

import SidebarDashboard from "@/components/sections/sub-section/dashboards/SidebarDashboard";
import DashboardNavbar from "@/components/Dashboard/DashboardNavbar";
import useScreenSize from "@/hooks/useScreenSize";
import { motion, AnimatePresence } from "framer-motion";

export const InstructorDashboardContext = createContext<any>(null);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const contentVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
  transition: { duration: 0.25 }
};

const backdropVariants = {
  visible: { opacity: 1, transition: { duration: 0.3 } },
  hidden: { opacity: 0, transition: { duration: 0.3 } }
};

const InstructorDashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { isMobile, isTablet } = useScreenSize();

  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(isMobile);

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
      setIsSidebarExpanded(true);
    } else {
      setIsSidebarOpen(true);
      setIsSidebarExpanded(false);
    }
  }, [isMobile]);

  const userData = useMemo(() => ({
    userRole: "instructor",
    userName: typeof window !== 'undefined' ? localStorage.getItem("fullName") || "Instructor" : "Instructor",
    userEmail: typeof window !== 'undefined' ? localStorage.getItem("email") || "" : "",
    userImage: "/avatar-placeholder.png",
    userNotifications: 0,
    userSettings: { theme: "light", language: "en", notifications: true }
  }), []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const contextValue = useMemo(() => ({
    userData,
    isSidebarOpen,
    isSidebarExpanded,
    toggleSidebar,
    setIsSidebarExpanded,
  }), [userData, isSidebarOpen, isSidebarExpanded]);

  const sidebarWidth = isMobile ? 0 : isSidebarExpanded ? 320 : 84;
  const headerHeight = isMobile ? 64 : isTablet ? 72 : 80;
  const defaultPadding = isMobile ? 16 : 24;
  
  return (
    <InstructorDashboardContext.Provider value={contextValue}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
        <SidebarDashboard
          userRole={userData.userRole}
          fullName={userData.userName}
          userEmail={userData.userEmail}
          userImage={userData.userImage}
          userNotifications={userData.userNotifications}
          userSettings={userData.userSettings}
          onMenuClick={() => {}}
          isOpen={isSidebarOpen}
          onOpenChange={setIsSidebarOpen}
          isExpanded={isSidebarExpanded}
          onExpandedChange={setIsSidebarExpanded}
        />

        <AnimatePresence>
          {isMobile && isSidebarOpen && (
            <motion.div
              key="backdrop"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={backdropVariants}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
              onClick={() => setIsSidebarOpen(false)}
              aria-hidden="true"
            />
          )}
        </AnimatePresence>

        <div
          className="flex-1 flex flex-col overflow-hidden transition-all duration-300"
          style={{ marginLeft: isMobile ? 0 : `${sidebarWidth}px` }}
        >
          <DashboardNavbar onMobileMenuToggle={toggleSidebar} isScrolled={false} />
          
          <motion.main
            key={pathname}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex-1 overflow-y-auto p-4 md:p-6"
            style={{ paddingTop: `${headerHeight + defaultPadding}px` }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={contentVariants.transition}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </motion.main>
        </div>
      </div>
    </InstructorDashboardContext.Provider>
  );
};

export default InstructorDashboardLayout; 