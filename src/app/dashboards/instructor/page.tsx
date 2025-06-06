"use client";

import React, { useState, useEffect, useContext, createContext, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { X, Menu } from "lucide-react";

// Component imports
import SidebarDashboard from "@/components/sections/sub-section/dashboards/SidebarDashboard";
import ComingSoonPage from "@/components/shared/others/ComingSoonPage";
import DashboardNavbar from "@/components/Dashboard/DashboardNavbar";
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

// Content variants with offset for sidebar
const contentVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
  transition: { duration: 0.25 }
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
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true); // Show sidebar but collapsed
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(false); // Always collapsed (icons only) by default
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
    
    // Don't change isSidebarOpen here - we want it open but showing only icons
    
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
    isSidebarExpanded,
    setIsSidebarExpanded,
    activeMenu,
    setActiveMenu,
    isLoading,
    setIsLoading
  }), [
    currentView, isMobile, isTablet, isDesktop, 
    breakpoint, isSidebarOpen, isSidebarExpanded, activeMenu, isLoading
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
<<<<<<< HEAD
          returnPath="/dashboards/instructor"
=======
          returnPath="/dashboards/instructor/"
>>>>>>> f1430ea24f47e7db52d620ec30e11914e4a1de6e
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
<<<<<<< HEAD
          returnPath="/dashboards/instructor"
=======
          returnPath="/dashboards/instructor/"
>>>>>>> f1430ea24f47e7db52d620ec30e11914e4a1de6e
        />
      );
    }
  };

  // Toggle sidebar handler with accessibility support
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    
    if (isMobile && !isSidebarOpen) {
      // When opening on mobile, always show expanded sidebar for better usability
      setIsSidebarExpanded(true);
    }
  };

  // Handle sidebar expansion change
  const handleSidebarExpansionChange = (expanded: boolean) => {
    setIsSidebarExpanded(expanded);
  };

  return (
    <InstructorDashboardContext.Provider value={contextValue}>
      <div className="flex flex-col h-screen">
        {/* Top Navbar - Fixed at the top */}
        <div className="fixed top-0 left-0 right-0 z-30">
          <DashboardNavbar 
            onMobileMenuToggle={toggleSidebar}
            isScrolled={false}
          />
        </div>

        <div className="flex mt-16"> {/* Add margin-top to account for fixed navbar */}
          {/* Mobile Sidebar Toggle Button */}
          {isMobile && (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleSidebar}
              className="fixed z-50 bottom-6 right-6 p-3 rounded-full bg-primary-500 hover:bg-primary-600 text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              aria-expanded={isSidebarOpen}
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          )}
          <div
            className={`${
              isMobile
                ? `fixed z-20 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`
                : "sticky"
            } top-16 h-screen flex-shrink-0 bg-white dark:bg-gray-800 transition-all duration-300 shadow-md overflow-hidden`}
            style={{ 
              width: isMobile ? (isSidebarOpen ? '280px' : '0px') : (isSidebarExpanded ? '280px' : '68px'),
              transition: 'width 0.3s ease, transform 0.3s ease'
            }}
            onMouseEnter={() => !isMobile && handleSidebarExpansionChange(true)}
            onMouseLeave={() => !isMobile && handleSidebarExpansionChange(false)}
          >
            <SidebarDashboard
              userRole={userData.userRole}
              fullName={userData.userName}
              userEmail={userData.userEmail}
              userImage={userData.userImage}
              userNotifications={userData.userNotifications}
              userSettings={userData.userSettings}
              onMenuClick={handleMenuClick}
              isOpen={isSidebarOpen}
              onOpenChange={setIsSidebarOpen}
              isExpanded={isSidebarExpanded}
              onExpandedChange={handleSidebarExpansionChange}
            />
          </div>

          {/* Mobile backdrop overlay */}
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

          {/* Main Content Area */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex-1 overflow-y-auto scroll-smooth"
            style={useMemo(() => ({
              marginLeft: isMobile ? '0px' : '68px',
              width: "100%", 
              maxWidth: isMobile ? '100%' : (isSidebarExpanded ? 'calc(100% - 212px)' : 'calc(100% - 68px)'),
              transition: "max-width 0.3s ease"
            }), [isMobile, isSidebarExpanded])}
          >
            {/* Secondary Navbar (Sub-items) - Only shown when sub-items are available */}
            {subItems.length > 0 && (
              <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
                <div className="flex flex-wrap gap-2">
                  {subItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleSubItemClick(item)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                        ${isSubItemActive(item) 
                          ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400" 
                          : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/40"}
                      `}
                    >
                      <span className="flex items-center gap-1.5">
                        {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                        {item.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              {isDebug && (
                <div className="mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-lg text-xs">
                  Debug: Current View = "{currentView}" | Breakpoint = "{breakpoint}" | Loading = {isLoading ? "true" : "false"}
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
              
              {/* Using React.memo to prevent content from re-rendering when sidebar changes */}
              {useMemo(() => (
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
              ), [currentView, isLoading])}
            </div>
          </motion.div>
        </div>
      </div>
    </InstructorDashboardContext.Provider>
  );
};

export default function InstructorPage() {
  return (
    <InstructorDashboardLayout />
  );
}
