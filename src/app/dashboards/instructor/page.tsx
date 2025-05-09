"use client";

import React, { useState, useEffect, useContext, createContext, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";

// Component imports
import SidebarDashboard from "@/components/sections/sub-section/dashboards/SidebarDashboard";
import ComingSoonPage from "@/components/shared/others/ComingSoonPage";
import DashboardNavbar from "@/components/sections/dashboards/DashboardNavbar";
import LoadingIndicator from "@/components/shared/loaders/LoadingIndicator";
import SkeletonLoader from "@/components/shared/loaders/SkeletonLoader";

// Custom hooks
import useScreenSize from "@/hooks/useScreenSize";

// Context for dashboard state management
export const InstructorDashboardContext = createContext<any>(null);

// Styles import
import { dashboardStyles } from "@/styles/dashboard";
import loadingIndicatorStyles from "@/components/shared/loaders/LoadingIndicator";

// Dynamically import dashboard components with proper loading states
const InstructorDashboard = dynamic(
  () => import("@/components/layout/main/dashboards/InstructorDashboard"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="dashboard" />
  }
);

const InstructorClasses = dynamic(
  () => import("@/components/layout/main/dashboards/Instructor_Track"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="classes" />
  }
);

const InstructorFeedbacks = dynamic(
  () => import("@/components/layout/main/dashboards/Instructor-Feedback-Components"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="form" />
  }
);

const InstructorQuizAttempts = dynamic(
  () => import("@/components/layout/main/dashboards/InstructorMyQuizAttemptsMain"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="quiz" />
  }
);

const InstructorProfile = dynamic(
  () => import("@/components/layout/main/dashboards/InstructorProfileMain"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="form" />
  }
);

// Animation variants
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

const sidebarVariants = {
  open: { 
    x: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      damping: 20 
    }
  },
  closed: { 
    x: -300, 
    opacity: 0,
    transition: { 
      type: "spring", 
      damping: 20 
    }
  }
};

const contentVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
};

// Type definitions
export interface SubItem {
  name: string;
  path?: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}

interface InstructorDashboardLayoutProps {
  children?: React.ReactNode;
}

/**
 * InstructorDashboardLayout - Main layout component for instructor dashboard
 */
const InstructorDashboardLayout: React.FC<InstructorDashboardLayoutProps> = ({
  children
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Use the screen size hook for responsive design
  const { isMobile, isTablet, isDesktop, current: breakpoint } = useScreenSize();
  
  // State management
  const [currentView, setCurrentView] = useState<string>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(!isMobile);
  const [isDebug, setIsDebug] = useState<boolean>(false);
  const [comingSoonTitle, setComingSoonTitle] = useState<string>("Coming Soon");
  const [activeMenu, setActiveMenu] = useState<string>("");
  const [subItems, setSubItems] = useState<SubItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // User data (would typically come from API/context in a real app)
  const userData = {
    userRole: "instructor",
    userName: "John Smith",
    userEmail: "john.smith@example.com",
    userImage: "/avatar-placeholder.png",
    userNotifications: 3,
    userSettings: {
      theme: "light",
      language: "en",
      notifications: true
    }
  };
  
  // Handle URL parameters and adjust sidebar based on screen size
  useEffect(() => {
    // Handle URL parameters
    setIsDebug(window.location.search.includes('debug=true'));
    
    const title = searchParams?.get('title');
    if (title) {
      setComingSoonTitle(title);
      setCurrentView("comingsoon");
    }
    
    // Set sidebar state based on screen size
    setIsSidebarOpen(!isMobile);
    
    // Get user data from localStorage if available
    if (typeof window !== "undefined") {
      const storedUserName = localStorage.getItem("full_name");
      if (storedUserName) {
        userData.userName = storedUserName;
      }
      
      const role = localStorage.getItem("role");
      if (role) {
        userData.userRole = role;
      }
    }
  }, [searchParams, isMobile]);

  // Context value memo for performance
  const contextValue = useMemo(() => ({
    currentView,
    setCurrentView,
    isMobile,
    isTablet,
    isDesktop,
    breakpoint,
    isSidebarOpen,
    setIsSidebarOpen,
    activeMenu,
    setActiveMenu,
    isLoading,
    setIsLoading
  }), [
    currentView, isMobile, isTablet, isDesktop, 
    breakpoint, isSidebarOpen, activeMenu, isLoading
  ]);

  // Check if a subitem is active based on the current view
  const isSubItemActive = (subItem: SubItem): boolean => {
    if (subItem.onClick) {
      return currentView.toLowerCase().includes(subItem.name.toLowerCase().replace(/\s+/g, '-'));
    }
    
    if (subItem.path) {
      return subItem.path.toLowerCase().includes(currentView.toLowerCase());
    }
    
    return false;
  };

  // Menu handlers
  const handleMenuClick = (menuName: string, items: SubItem[]) => {
    setIsLoading(true);
    setCurrentView(menuName);
    setActiveMenu(menuName);
    setSubItems(items);
    
    if (isMobile) {
      setIsSidebarOpen(false);
    }
    
    // Simulate network delay and then stop loading
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  const handleSubItemClick = (subItem: SubItem) => {
    setIsLoading(true);
    
    if (subItem.comingSoon) {
      setComingSoonTitle(subItem.name);
      setCurrentView("comingsoon");
    } else if (subItem.onClick) {
      subItem.onClick();
    } else if (subItem.path) {
      router.push(subItem.path);
    }
    
    // Simulate network delay and then stop loading
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  // Component renderer with error boundary
  const DashboardComponent = () => {
    if (isLoading) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <LoadingIndicator 
            type="spinner" 
            size="lg" 
            color="primary" 
            text="Loading content..." 
            centered 
          />
        </div>
      );
    }
    
    if (currentView === "comingsoon") {
      return (
        <ComingSoonPage 
          title={comingSoonTitle} 
          description="We're working on this feature. It will be available soon!"
          returnPath="/dashboards/instructor-dashboard"
        />
      );
    }

    // View matching helpers
    const viewMatches = (patterns: string[]): boolean => {
      const normalizedView = currentView.toLowerCase();
      return patterns.some(pattern => normalizedView.includes(pattern));
    };
    
    // Component selection based on view
    if (viewMatches(['overview', 'dashboard'])) {
      return <InstructorDashboard />;
    } else if (viewMatches(['profile'])) {
      return <InstructorProfile />;
    } else if (viewMatches(['track', 'classes'])) {
      return <InstructorClasses />;
    } else if (viewMatches(['feedback'])) {
      return <InstructorFeedbacks />;
    } else if (viewMatches(['quiz', 'attempts'])) {
      return <InstructorQuizAttempts />;
    } else {
      // Default to coming soon for unimplemented views
      return (
        <ComingSoonPage 
          title={viewMatches(['schedule']) ? "Schedule Classes" :
                 viewMatches(['resources']) ? "Resources Management" :
                 viewMatches(['performance']) ? "Student Performance" :
                 "Feature Coming Soon"}
          description="We're working on this feature and it will be available soon!"
          returnPath="/dashboards/instructor-dashboard"
        />
      );
    }
  };

  // Toggle sidebar handler with accessibility support
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <InstructorDashboardContext.Provider value={contextValue}>
      <div className="flex h-screen">
        <button
          onClick={toggleSidebar}
          className="fixed z-30 bottom-6 right-6 p-4 rounded-full bg-primary-500 text-white shadow-lg"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          aria-expanded={isSidebarOpen}
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
            {isSidebarOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M4 12h16M4 6h16M4 18h16" />
            )}
          </svg>
        </button>
        <div
          className={`${
            isMobile
              ? `fixed z-20 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`
              : "sticky"
          } top-0 h-screen flex-shrink-0 w-[280px] bg-white dark:bg-gray-800 transition-transform duration-300 shadow-md overflow-hidden`}
        >
          <SidebarDashboard
            userRole={userData.userRole}
            fullName={userData.userName}
            userEmail={userData.userEmail}
            userImage={userData.userImage}
            userNotifications={userData.userNotifications}
            userSettings={userData.userSettings}
            onMenuClick={handleMenuClick}
          />
        </div>

        {/* Main Content Area */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex-1 overflow-y-auto"
        >
          {/* Navbar */}
          {subItems.length > 0 && (
            <DashboardNavbar
              activeMenu={activeMenu}
              subItems={subItems}
              onItemClick={handleSubItemClick}
              currentView={currentView}
              isSubItemActive={isSubItemActive}
            />
          )}

          {/* Content */}
          <div className="p-6">
            {isDebug && (
              <div className="mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-lg text-xs">
                Debug: Current View = "{currentView}" | Breakpoint = "{breakpoint}" | Loading = {isLoading ? "true" : "false"}
              </div>
            )}
            
            {/* Global loading indicator */}
            {isLoading && (
              <div className="fixed inset-0 bg-white/50 dark:bg-gray-900/50 z-50 flex items-center justify-center backdrop-blur-sm">
                <LoadingIndicator 
                  type="dots" 
                  size="xl" 
                  color="primary" 
                  text="Loading..." 
                  centered 
                />
              </div>
            )}
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={contentVariants.transition}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden elevation-2"
              >
                <DashboardComponent />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </InstructorDashboardContext.Provider>
  );
};

export default function InstructorPage() {
  return (
    <InstructorDashboardLayout />
  );
}
