"use client";

import React, { useState, useEffect, useContext, createContext, useMemo, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, MoreHorizontal, Menu, X, LogOut, Home, ArrowLeft } from "lucide-react";
import Cookies from 'js-cookie';
import { logoutUser } from "@/utils/auth";

// Component imports
import SidebarDashboard from "@/components/sections/sub-section/dashboards/SidebarDashboard";
import ComingSoonPage from "@/components/shared/others/ComingSoonPage";
import DashboardNavbar from "@/components/Dashboard/DashboardNavbar";
import LoadingIndicator, { loadingIndicatorStyles } from "@/components/shared/loaders/LoadingIndicator";
import SkeletonLoader from "@/components/shared/loaders/SkeletonLoader";

// Custom hooks
import useScreenSize from "@/hooks/useScreenSize";

// Context for dashboard state management
export const InstructorDashboardContext = createContext<any>(null);

// Styles import
import { dashboardStyles } from "@/styles/dashboard";

// Dynamically import dashboard components with proper loading states
const InstructorDashboardMain = dynamic(
  () => import("@/components/layout/main/dashboards/InstructorDashboard"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="dashboard" />
  }
);

const InstructorCourses = dynamic(
  () => import("@/components/layout/main/dashboards/InstructorCourseMain"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="courses" />
  }
);

const InstructorAnalytics = dynamic(
  () => import("@/components/layout/main/dashboards/InstructorAnalytics"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="analytics" />
  }
);

const InstructorStudents = dynamic(
  () => import("@/components/layout/main/dashboards/InstructorStudents"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="students" />
  }
);

const InstructorSchedule = dynamic(
  () => import("@/components/layout/main/dashboards/InstructorSchedule"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="schedule" />
  }
);

const InstructorAssignments = dynamic(
  () => import("@/components/layout/main/dashboards/InstructorAssignmentsMain"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="assignments" />
  }
);

const InstructorPayouts = dynamic(
  () => import("@/components/layout/main/dashboards/InstructorPayouts"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="payouts" />
  }
);

const InstructorSettings = dynamic(
  () => import("@/components/layout/main/dashboards/InstructorSettings"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="settings" />
  }
);

const InstructorProfile = dynamic(
  () => import("@/components/layout/main/dashboards/InstructorProfile"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="profile" />
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

// Mobile backdrop variants
const backdropVariants = {
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3
    }
  },
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.3
    }
  }
};

// Mobile sidebar slide variants
const mobileSidebarVariants = {
  open: {
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      duration: 0.4
    }
  },
  closed: {
    x: "-100%",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      duration: 0.3
    }
  }
};

// Mobile content variants
const mobileContentVariants = {
  sidebarOpen: {
    scale: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      duration: 0.4
    }
  },
  sidebarClosed: {
    scale: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      duration: 0.3
    }
  }
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
  userRole: string;
  fullName: string;
  userEmail: string;
  userImage: string;
  userNotifications: number;
  userSettings: {
    theme: string;
    language: string;
    notifications: boolean;
  };
}

/**
 * InstructorDashboardLayout - Main layout component for instructor dashboard
 */
const InstructorDashboardLayout: React.FC<InstructorDashboardLayoutProps> = ({
  children,
  userRole = "instructor",
  fullName,
  userEmail,
  userImage,
  userNotifications,
  userSettings
}): React.ReactElement => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Use the screen size hook for responsive design
  const { isMobile, isTablet, isDesktop, current: breakpoint } = useScreenSize();
  
  // State management
  const [currentView, setCurrentView] = useState<string>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(false);
  const [isDebug] = useState<boolean>(false);
  const [activeMenu, setActiveMenu] = useState<string>("");
  const [subItems, setSubItems] = useState<SubItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Create a stable context value
  const contextValue = useMemo(() => ({
    currentView,
    setCurrentView,
    isLoading,
    setIsLoading,
    isSidebarOpen,
    setIsSidebarOpen,
    isSidebarExpanded,
    setIsSidebarExpanded,
    userRole,
    fullName,
    userEmail,
    userImage,
    userNotifications,
    userSettings,
    activeMenu,
    setActiveMenu,
    subItems,
    setSubItems,
    isMobile,
    isTablet,
    isDesktop,
    breakpoint
  }), [
    currentView,
    isLoading,
    isSidebarOpen,
    isSidebarExpanded,
    userRole,
    fullName,
    userEmail,
    userImage,
    userNotifications,
    userSettings,
    activeMenu,
    subItems,
    isMobile,
    isTablet,
    isDesktop,
    breakpoint
  ]);

  // Handle URL parameters and responsive sidebar behavior
  useEffect(() => {
    // Handle URL parameters
    const title = searchParams?.get('title');
    if (title) {
      setCurrentView("comingsoon");
      return;
    }
    
    // Detect current path to set the appropriate view
    const pathname = window.location.pathname;
    if (pathname.includes('/dashboards/instructor/analytics')) {
      setCurrentView("analytics");
    } else if (pathname.includes('/dashboards/instructor/courses')) {
      setCurrentView("courses");
    } else if (pathname.includes('/dashboards/instructor/students')) {
      setCurrentView("students");
    } else if (pathname.includes('/dashboards/instructor/schedule')) {
      setCurrentView("schedule");
    } else if (pathname.includes('/dashboards/instructor/assignments')) {
      setCurrentView("assignments");
    } else if (pathname.includes('/dashboards/instructor/payouts')) {
      setCurrentView("payouts");
    } else if (pathname.includes('/dashboards/instructor/settings')) {
      setCurrentView("settings");
    } else if (pathname.includes('/dashboards/instructor/profile')) {
      setCurrentView("profile");
    } else {
      setCurrentView("dashboard");
    }
    
    // Responsive sidebar behavior: always start collapsed
    if (isMobile || isTablet) {
      setIsSidebarOpen(false);
    }
    setIsSidebarExpanded(false);
  }, [searchParams, isMobile, isTablet]);

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
    if (menuName !== currentView) {
      setIsLoading(true);
      setCurrentView(menuName);
      setActiveMenu(menuName);
      setSubItems(items);
      
      setTimeout(() => {
        setIsLoading(false);
      }, 600);
    } else {
      setActiveMenu(menuName);
      setSubItems(items);
    }
    
    // Close sidebar on mobile/tablet after selection
    if (isMobile || isTablet) {
      setIsSidebarOpen(false);
    }
  };

  const handleSubItemClick = (subItem: SubItem) => {
    setIsLoading(true);
    
    if (subItem.comingSoon) {
      setCurrentView("comingsoon");
    } else if (subItem.onClick) {
      subItem.onClick();
    } else if (subItem.path) {
      router.push(subItem.path);
    }
    
    // Close sidebar on mobile/tablet after selection
    if (isMobile || isTablet) {
      setIsSidebarOpen(false);
    }
    
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  // Handle sidebar expansion state change
  const handleSidebarExpansionChange = useCallback((expanded: boolean) => {
    setIsSidebarExpanded(expanded);
  }, []);

  // Toggle sidebar handler
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const DashboardComponent = () => {
    if (children) {
      return <>{children}</>;
    }

    const viewMatches = (patterns: string[]): boolean => {
      return patterns.some(pattern => 
        currentView.toLowerCase().includes(pattern.toLowerCase()) ||
        window.location.pathname.toLowerCase().includes(pattern.toLowerCase())
      );
    };

    if (viewMatches(["dashboard", "overview", "main"])) {
      return <InstructorDashboardMain />;
    } else if (viewMatches(["analytics"])) {
      return <InstructorAnalytics />;
    } else if (viewMatches(["courses"])) {
      return <InstructorCourses />;
    } else if (viewMatches(["students"])) {
      return <InstructorStudents />;
    } else if (viewMatches(["schedule"])) {
      return <InstructorSchedule />;
    } else if (viewMatches(["assignments"])) {
      return <InstructorAssignments />;
    } else if (viewMatches(["payouts"])) {
      return <InstructorPayouts />;
    } else if (viewMatches(["settings"])) {
      return <InstructorSettings />;
    } else if (viewMatches(["profile"])) {
      return <InstructorProfile />;
    } else if (currentView === "comingsoon") {
      return <ComingSoonPage title="Feature Coming Soon" />;
    } else {
      return <InstructorDashboardMain />;
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      // Call the backend logout API to set quick login expiration
      await logoutUser(true); // Keep remember me settings
      
      // Redirect to login
      router.push("/login/");
    } catch (error) {
      console.error("Error during logout:", error);
      // If API call fails, still clear local data and redirect
      try {
        const keysToRemove = [
          "userId", 
          "token", 
          "fullName", 
          "full_name", 
          "role", 
          "permissions",
          "email",
          "password",
          "rememberMe"
        ];
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        // Clear cookies
        Cookies.remove("token");
        Cookies.remove("userId");
      } catch (localError) {
        console.error("Error during local logout cleanup:", localError);
      }
      
      // Redirect to login
      router.push("/login/");
    }
  };

  // Memoize the DashboardComponent to prevent re-renders
  const MemoizedDashboardComponent = useMemo(() => (
    <div className="bg-white dark:bg-gray-800 rounded-none md:rounded-xl shadow-none md:shadow-sm overflow-hidden md:elevation-2">
      <DashboardComponent />
    </div>
  ), [currentView, isLoading, children]);

  return (
    <InstructorDashboardContext.Provider value={contextValue}>
      <div className="relative bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col">
        {/* Global styles */}
        <style jsx global>{dashboardStyles}</style>
        <style jsx global>{loadingIndicatorStyles}</style>
        
        {/* Dashboard Navbar - responsive positioning */}
        <div className={`${isMobile || isTablet ? 'fixed top-0 left-0 right-0 z-50' : 'fixed top-0 left-0 right-0 z-50'}`}>
          <DashboardNavbar 
            onMobileMenuToggle={toggleSidebar}
            isScrolled={false}
          />
        </div>
        
        {/* Main layout container */}
        <div className={`flex flex-1 ${isMobile || isTablet ? 'pt-16' : 'pt-16 lg:pt-20'}`}>
          {/* Desktop Sidebar */}
          {isDesktop && (
            <div 
              className="fixed h-full top-16 lg:top-20 transition-[width] duration-300 ease-in-out z-30"
              style={{ 
                height: 'calc(100vh - 80px)',
                width: isSidebarExpanded ? '260px' : '78px',
              }}
            >
              <SidebarDashboard
                userRole={userRole}
                fullName={fullName}
                userEmail={userEmail}
                userImage={userImage}
                userNotifications={userNotifications}
                userSettings={userSettings}
                onMenuClick={handleMenuClick}
                isOpen={isSidebarOpen}
                onOpenChange={setIsSidebarOpen}
                isExpanded={isSidebarExpanded}
                onExpandedChange={handleSidebarExpansionChange}
              />
            </div>
          )}

          {/* Mobile/Tablet Sidebar - slide-in overlay */}
          {(isMobile || isTablet) && (
            <>
              {/* Mobile backdrop overlay */}
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.div
                    key="mobile-backdrop"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={backdropVariants}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-hidden="true"
                  />
                )}
              </AnimatePresence>

              {/* Mobile sidebar */}
              <motion.div
                variants={mobileSidebarVariants}
                initial="closed"
                animate={isSidebarOpen ? "open" : "closed"}
                className="fixed left-0 top-16 h-full w-80 max-w-[85vw] z-50"
                style={{ height: 'calc(100vh - 64px)' }}
              >
                <div className="h-full bg-white dark:bg-gray-900 shadow-2xl">
                  {/* Mobile sidebar header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Navigation
                    </h2>
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors"
                      aria-label="Close navigation"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Mobile sidebar content */}
                  <div className="h-full overflow-y-auto pb-20">
                    <SidebarDashboard
                      userRole={userRole}
                      fullName={fullName}
                      userEmail={userEmail}
                      userImage={userImage}
                      userNotifications={userNotifications}
                      userSettings={userSettings}
                      onMenuClick={handleMenuClick}
                      isOpen={true}
                      onOpenChange={setIsSidebarOpen}
                      isExpanded={true}
                      onExpandedChange={() => {}}
                    />
                  </div>
                </div>
              </motion.div>
            </>
          )}

          {/* Main Content Area */}
          <motion.div 
            className={`flex-1 overflow-y-auto scroll-smooth transition-all duration-300 ease-in-out ${
              isMobile || isTablet ? 'w-full fixed-content' : ''
            }`}
            variants={isMobile || isTablet ? mobileContentVariants : {}}
            animate={isMobile || isTablet ? (isSidebarOpen ? "sidebarOpen" : "sidebarClosed") : {}}
            style={{
              marginLeft: isDesktop ? (isSidebarExpanded ? "270px" : "88px") : "0px",
              width: isDesktop ? (isSidebarExpanded ? "calc(100% - 270px)" : "calc(100% - 88px)") : "100%",
              // On mobile/tablet use normal document flow to enable native scrolling & avoid layout shifts
              position: 'relative',
              paddingBottom: isMobile || isTablet ? 'calc(env(safe-area-inset-bottom,0px) + 4rem)' : undefined,
              paddingTop: isMobile || isTablet ? '0.5rem' : undefined,
            }}
          >
            {/* Content with responsive padding */}
            <div className={`${isMobile ? 'p-3 pb-20' : isTablet ? 'p-4 pb-6' : 'p-4 md:p-6'}`}>
              {/* Debug info */}
              {isDebug && (
                <div className="mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-lg text-xs">
                  Debug: Current View = "{currentView}" | Breakpoint = "{breakpoint}" | 
                  Sidebar Open = {isSidebarOpen ? "true" : "false"} | 
                  Sidebar Expanded = {isSidebarExpanded ? "true" : "false"} |
                  Loading = {isLoading ? "true" : "false"}
                </div>
              )}
              
              {/* Global loading indicator */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-white/50 dark:bg-gray-900/50 z-50 flex items-center justify-center backdrop-blur-sm"
                  >
                    <LoadingIndicator 
                      type="dots" 
                      size="xl" 
                      color="primary" 
                      text="Loading..." 
                      centered 
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Render memoized content */}
              {MemoizedDashboardComponent}
            </div>
          </motion.div>
        </div>

        {/* Desktop logout button - only show on desktop */}
        {isDesktop && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLogout}
            className="fixed z-40 bottom-6 right-6 p-3 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            aria-label="Logout"
          >
            <LogOut size={20} />
          </motion.button>
        )}
      </div>
    </InstructorDashboardContext.Provider>
  );
};

export default InstructorDashboardLayout; 