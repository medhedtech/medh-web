"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import SidebarDashboard from "@/components/sections/sub-section/dashboards/SidebarDashboard";
import ComingSoonPage from "@/components/shared/others/ComingSoonPage";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import DashboardNavbar from "./DashboardNavbar";

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

// Dynamically import dashboard components
const ParentDashboardMain = dynamic(() => import("@/components/layout/main/dashboards/ParentDashboardMain"), { 
  ssr: false,
  loading: () => <div className="flex min-h-[60vh] items-center justify-center"><div className="animate-pulse text-primary-500">Loading overview...</div></div>
});
const ParentGradesView = dynamic(() => import("@/components/layout/main/dashboards/ParentGradesView"), { 
  ssr: false,
  loading: () => <div className="flex min-h-[60vh] items-center justify-center"><div className="animate-pulse text-primary-500">Loading grades...</div></div>
});
const ParentAttendanceView = dynamic(() => import("@/components/layout/main/dashboards/ParentAttendanceView"), { 
  ssr: false,
  loading: () => <div className="flex min-h-[60vh] items-center justify-center"><div className="animate-pulse text-primary-500">Loading attendance...</div></div>
});
const ParentProfile = dynamic(() => import("@/components/layout/main/dashboards/ParentProfile"), { 
  ssr: false,
  loading: () => <div className="flex min-h-[60vh] items-center justify-center"><div className="animate-pulse text-primary-500">Loading profile...</div></div>
});
const FeedbackandSupport = dynamic(() => import("@/components/layout/main/dashboards/FeedbackandSupport"), { ssr: false });
const Payments = dynamic(() => import("@/components/layout/main/dashboards/Payments"), { ssr: false });

// Dashboard layout container animations
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

interface SubItem {
  name: string;
  path?: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
  onClick?: () => void;
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
  const [currentView, setCurrentView] = useState<string>("overview");
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isDebug, setIsDebug] = useState<boolean>(false);
  const [comingSoonTitle, setComingSoonTitle] = useState<string>("Coming Soon");
  
  // New state for subItems display
  const [activeMenu, setActiveMenu] = useState<string>("");
  const [subItems, setSubItems] = useState<SubItem[]>([]);
  
  // Check if device is mobile and handle coming soon params
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    // Enable debug mode with query param
    setIsDebug(window.location.search.includes('debug=true'));
    
    // Handle coming soon parameters
    const title = searchParams?.get('title');
    if (title) {
      setComingSoonTitle(title);
      setCurrentView("comingsoon");
    }
    
    return () => window.removeEventListener("resize", checkMobile);
  }, [searchParams]);

  // Log view changes
  useEffect(() => {
    console.log("Current view changed to:", currentView);
  }, [currentView]);

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
    setCurrentView(menuName);
    setActiveMenu(menuName);
    setSubItems(items);
    
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  // Handle subitem click
  const handleSubItemClick = (subItem: SubItem) => {
    if (subItem.comingSoon) {
      // Show coming soon page
      setComingSoonTitle(subItem.name);
      setCurrentView("comingsoon");
    } else if (subItem.onClick) {
      subItem.onClick();
    } else if (subItem.path) {
      router.push(subItem.path);
    }
  };

  // Render component based on current view
  const renderComponent = () => {
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
      return <FeedbackandSupport />;
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
            onClick={() => setCurrentView("overview")} 
            className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg"
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
  };

  return (
    <>
      {/* Inject the CSS for hiding scrollbars */}
      <style jsx global>{hideScrollbarStyles}</style>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <AnimatePresence mode="wait">
          {isSidebarOpen && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg"
            >
              <SidebarDashboard
                userRole="parent"
                userName={userName}
                userEmail={userEmail}
                userImage={userImage}
                userNotifications={userNotifications}
                userSettings={userSettings}
                onMenuClick={handleMenuClick}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile toggle button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed bottom-6 left-6 z-50 p-3 bg-primary-500 text-white rounded-full shadow-lg md:hidden"
        >
          {isSidebarOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Main Content */}
        <div className={`transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : ""}`}>
        
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

          {/* Main Content Area */}
          <main className="p-4 sm:p-6 lg:p-8">
            {isDebug && (
              <div className="mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-lg text-xs">
                Debug: Current View = "{currentView}"
              </div>
            )}
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
              >
                {renderComponent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </>
  );
};

export default ParentDashboardLayout; 