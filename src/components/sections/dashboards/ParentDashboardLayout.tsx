"use client";

import React, { useState, useEffect, createContext, useContext, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import SidebarDashboard from "@/components/sections/sub-section/dashboards/SidebarDashboard";
import ComingSoonPage from "@/components/shared/others/ComingSoonPage";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import DashboardNavbar from "@/components/Dashboard/DashboardNavbar"; // Updated import path
import SubNavbar from "./DashboardNavbar"; // Renamed the existing import for sub-navigation
import LoadingIndicator from "@/components/shared/loaders/LoadingIndicator";
import SkeletonLoader from "@/components/shared/loaders/SkeletonLoader";
import useScreenSize from "@/hooks/useScreenSize";
import { X, Menu, LogOut } from "lucide-react"; // Import icons for mobile menu and logout

// Context for dashboard state management
export const ParentDashboardContext = createContext<any>(null);

// Custom styles for hiding scrollbar while maintaining functionality
const hideScrollbarStyles = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .gen-alpha-gradient {
    background: linear-gradient(to right, #4158D0, #C850C0, #FFCC70);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .gen-alpha-nav {
    background: linear-gradient(to right, rgba(65, 88, 208, 0.05), rgba(200, 80, 192, 0.05), rgba(255, 204, 112, 0.05));
    border-bottom: 2px solid rgba(200, 80, 192, 0.2);
  }
  
  .gen-alpha-button {
    background-size: 200% auto;
    transition: all 0.3s ease;
  }
  
  .gen-alpha-button:hover {
    background-position: right center;
  }
  
  .gen-alpha-active {
    background: linear-gradient(to right, rgba(65, 88, 208, 0.2), rgba(200, 80, 192, 0.2));
    border-left: 3px solid #C850C0;
  }
  
  .pulsing-dot {
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% {
      transform: scale(0.95);
      opacity: 0.7;
    }
    50% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(0.95);
      opacity: 0.7;
    }
  }
`;

// Dynamically import dashboard components with proper loading states
const ParentDashboardMain = dynamic(() => import("@/components/layout/main/dashboards/ParentDashboardMain"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="dashboard" />
});
const ParentGradesView = dynamic(() => import("@/components/layout/main/dashboards/ParentGradesView"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="default" />
});
const ParentAttendanceView = dynamic(() => import("@/components/layout/main/dashboards/ParentAttendanceView"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="default" />
});
const ParentProfile = dynamic(() => import("@/components/layout/main/dashboards/ParentProfile"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="default" />
});
const FeedbackAndSupport = dynamic(() => import("@/components/layout/main/dashboards/FeedbackandSupport"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="form" />
});
const Payments = dynamic(() => import("@/components/layout/main/dashboards/Payments"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="payments" />
});

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.15,
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
      stiffness: 190,
      damping: 20,
      mass: 0.7,
      duration: 0.4,
      bounce: 0.1
    }
  },
  closed: { 
    x: -300, 
    opacity: 0,
    transition: { 
      type: "spring", 
      stiffness: 160,
      damping: 28,
      mass: 1.0,
      duration: 0.5
    }
  }
};

const contentVariants = {
  expanded: { 
    opacity: 1, 
    marginLeft: '10px',
    transition: { 
      type: "spring",
      stiffness: 190,
      damping: 25,
      mass: 0.7,
      duration: 0.4
    }
  },
  collapsed: { 
    opacity: 1, 
    marginLeft: '10px',
    transition: { 
      type: "spring",
      stiffness: 160,
      damping: 30,
      mass: 1.0,
      duration: 0.5
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { 
      duration: 0.25 
    }
  }
};

// Mobile backdrop variants
const backdropVariants = {
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeInOut"
    }
  },
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

interface SubItem {
  name: string;
  path?: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}

interface ParentDashboardLayoutProps {
  children?: React.ReactNode;
  userRole: string;
  userName: string;
  userEmail: string;
  userImage: string;
  userNotifications: number;
  userSettings: {
    theme: string;
    language: string;
    notifications: boolean;
  };
}

const ParentDashboardLayout: React.FC<ParentDashboardLayoutProps> = ({
  children,
  userRole,
  userName,
  userEmail,
  userImage,
  userNotifications,
  userSettings
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Use screen size hook for responsive design
  const { isMobile, isTablet, isDesktop, current: breakpoint } = useScreenSize();
  
  // State management
  const [currentView, setCurrentView] = useState<string>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true); // Show sidebar but collapsed
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(false); // Always collapsed (icons only) by default
  const [isDebug, setIsDebug] = useState<boolean>(false);
  const [comingSoonTitle, setComingSoonTitle] = useState<string>("Coming Soon");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // New state for subItems display
  const [activeMenu, setActiveMenu] = useState<string>("");
  const [subItems, setSubItems] = useState<SubItem[]>([]);
  
  // Check if device is mobile and handle coming soon params
  useEffect(() => {
    // Enable debug mode with query param
    setIsDebug(window.location.search.includes('debug=true'));
    
    // Handle coming soon parameters
    const title = searchParams?.get('title');
    if (title) {
      setComingSoonTitle(title);
      setCurrentView("comingsoon");
    }
    
    // Don't change sidebar state here - keep collapsed by default
  }, [searchParams, isMobile]);

  // Create context value memo for performance
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
    // If subItem has a specific onClick that changes the view
    if (subItem.onClick) {
      // Try to match based on subItem name
      return currentView.toLowerCase().includes(subItem.name.toLowerCase().replace(/\s+/g, '-'));
    }
    
    // If subItem has a path
    if (subItem.path) {
      // Check if the path is in the current view
      return subItem.path.toLowerCase().includes(currentView.toLowerCase());
    }
    
    return false;
  };

  // Handle menu item selection
  const handleMenuClick = (menuName: string, items: SubItem[]) => {
    console.log("Menu selected:", menuName); // Debug log
    setIsLoading(true);
    setCurrentView(menuName);
    setActiveMenu(menuName);
    setSubItems(items);
    
    if (isMobile) {
      setIsSidebarOpen(false);
    }
    
    // Simulate loading time
    setTimeout(() => setIsLoading(false), 500);
  };

  // Handle subitem click
  const handleSubItemClick = (subItem: SubItem) => {
    if (subItem.comingSoon) {
      // Show coming soon page
      setComingSoonTitle(subItem.name);
      setCurrentView("comingsoon");
      return;
    }
    
    setIsLoading(true);
    
    if (subItem.onClick) {
      subItem.onClick();
    } else if (subItem.path) {
      router.push(subItem.path);
    }
    
    // Simulate loading time
    setTimeout(() => setIsLoading(false), 500);
  };

  // Handle sidebar expansion state change
  const handleSidebarExpansionChange = (expanded: boolean) => {
    setIsSidebarExpanded(expanded);
  };

  // Toggle sidebar with accessibility support
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    
    if (isMobile && !isSidebarOpen) {
      // When opening on mobile, always show expanded sidebar for better usability
      setIsSidebarExpanded(true);
    }
  };

  // Render component based on current view
  const renderComponent = () => {
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
    
    if (isDebug) {
      console.log("Current view:", currentView);
    }
    
    // Handle coming soon page
    if (currentView === "comingsoon") {
      return <ComingSoonPage 
        title={comingSoonTitle} 
        description="We're working on this feature. It will be available soon!"
        returnPath="/dashboards/parent"
      />;
    }
    
    try {
      // Helper to check if the current view matches any of the given patterns
      const viewMatches = (patterns: string[]): boolean => {
        const normalizedView = currentView.toLowerCase();
        return patterns.some(pattern => normalizedView.includes(pattern));
      };
      
      // Determine which component to render based on the current view
      if (viewMatches(['overview', 'dashboard'])) {
        return <ParentDashboardMain />;
      } else if (viewMatches(['profile'])) {
        return <ParentProfile />;
      } else if (viewMatches(['grades', 'assignments'])) {
        return <ParentGradesView />;
      } else if (viewMatches(['attendance'])) {
        return <ParentAttendanceView />;
      } else if (viewMatches(['feedback', 'support', 'concerns'])) {
        return <FeedbackAndSupport />;
      } else if (viewMatches(['payment', 'payments', 'fees', 'fee'])) {
        return <Payments />;
      } else if (viewMatches(['communication', 'message', 'instructors', 'meetings'])) {
        return <ComingSoonPage 
          title="Communication Center" 
          description="The messaging system will be available soon. You'll be able to communicate with instructors here."
          returnPath="/dashboards/parent"
        />;
      } else if (viewMatches(['timetable', 'schedule', 'classes'])) {
        return <ComingSoonPage 
          title="Class Schedule" 
          description="View your child's class schedule and upcoming classes. Coming soon!"
          returnPath="/dashboards/parent"
        />;
      } else if (viewMatches(['recordings', 'video', 'live'])) {
        return <ComingSoonPage 
          title="Class Recordings" 
          description="Access recorded class sessions. Coming soon!"
          returnPath="/dashboards/parent"
        />;
      } else if (viewMatches(['performance', 'tracking', 'progress'])) {
        return <ComingSoonPage 
          title="Performance Tracking" 
          description="Track your child's academic performance over time. Coming soon!"
          returnPath="/dashboards/parent"
        />;
      } else if (isDebug) {
        return (
          <div className="p-8 text-center">
            <h2 className="text-xl font-medium mb-4">Debug View</h2>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-4">
              <p className="text-red-700 dark:text-red-300">Unknown view: {currentView}</p>
            </div>
            <button 
              onClick={() => {
                setIsLoading(true);
                setCurrentView("overview");
                setTimeout(() => setIsLoading(false), 500);
              }} 
              className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg"
              aria-label="Return to overview"
            >
              Return to Overview
            </button>
          </div>
        );
      } else {
        // Default to ComingSoon page for unimplemented views
        return <ComingSoonPage 
          title="Feature Coming Soon" 
          description="We're working on this feature and it will be available soon!"
          returnPath="/dashboards/parent"
        />;
      }
    } catch (error) {
      console.error("Error rendering component:", error);
      return (
        <div className="p-8 text-center">
          <h2 className="text-xl font-medium mb-4 text-red-600">Something went wrong</h2>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-4">
            <p className="text-red-700 dark:text-red-300">
              {error instanceof Error ? error.message : "An unknown error occurred"}
            </p>
          </div>
          <button 
            onClick={() => {
              setIsLoading(true);
              setCurrentView("overview");
              setTimeout(() => setIsLoading(false), 500);
            }} 
            className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg"
            aria-label="Return to overview"
          >
            Return to Overview
          </button>
        </div>
      );
    }
  };

  return (
    <ParentDashboardContext.Provider value={contextValue}>
      <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
        {/* Inject the CSS for hiding scrollbars */}
        <style jsx global>{hideScrollbarStyles}</style>
        
        {/* Top Navbar - Fixed at the top */}
        <div className="fixed top-0 left-0 right-0 z-30">
          <DashboardNavbar 
            onMobileMenuToggle={toggleSidebar}
            isScrolled={false}
          />
        </div>

        <div className="flex mt-16 lg:mt-20"> {/* Add margin-top to account for fixed navbar */}
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

          {/* Sidebar */}
          <div
            className={`${
              isMobile
                ? `fixed z-20 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`
                : "sticky"
            } top-16 lg:top-20 h-screen flex-shrink-0 bg-white dark:bg-gray-800 transition-all duration-300 shadow-md overflow-hidden`}
            style={{ 
              width: isMobile ? (isSidebarOpen ? '260px' : '0px') : (isSidebarExpanded ? '260px' : '78px'),
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={() => !isMobile && handleSidebarExpansionChange(true)}
            onMouseLeave={() => !isMobile && handleSidebarExpansionChange(false)}
          >
            <SidebarDashboard
              userRole="parent"
              userName={userName}
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

          {/* Main Content */}
          <div 
            className="flex-1 overflow-y-auto scroll-smooth"
            style={useMemo(() => ({
              marginLeft: isMobile ? '0px' : '10px',
              width: "100%",
              maxWidth: isSidebarExpanded ? "calc(100% - 230px)" : "calc(100% - 78px)",
              transition: "max-width 0.4s cubic-bezier(0.4, 0, 0.2, 1), margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
            }), [isMobile, isSidebarExpanded])}
          >
            {/* Secondary Navbar - Only shown when sub-items are available */}
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

            <main className="p-4 sm:p-6 lg:p-8">
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
              
              {/* Component content with React.memo for performance */}
              {useMemo(() => (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentView}
                    variants={contentVariants}
                    initial={isSidebarExpanded ? "expanded" : "collapsed"}
                    animate={isSidebarExpanded ? "expanded" : "collapsed"}
                    exit="exit"
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden elevation-2"
                  >
                    {renderComponent()}
                  </motion.div>
                </AnimatePresence>
              ), [currentView, isLoading, isSidebarExpanded])}
            </main>
          </div>
        </div>

        {/* Add logout button to the bottom left */}
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            // Implement logout functionality here
            router.push("/login/");
          }}
          className={`fixed z-40 bottom-6 ${isMobile ? 'left-6' : 'right-6'} p-3 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900`}
          aria-label="Logout"
        >
          <LogOut size={20} />
        </motion.button>
      </div>
    </ParentDashboardContext.Provider>
  );
};

export default ParentDashboardLayout; 