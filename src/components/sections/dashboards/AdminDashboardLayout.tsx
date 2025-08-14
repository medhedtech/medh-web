"use client";
import React, { useState, useEffect, createContext, useContext, useMemo, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import SidebarDashboard from "@/components/sections/sub-section/dashboards/SidebarDashboard";
import DashboardNavbar from "@/components/Dashboard/DashboardNavbar";
import ComingSoonPage from "@/components/shared/others/ComingSoonPage";
import { useSearchParams } from "next/navigation";
import LoadingIndicator from "@/components/shared/loaders/LoadingIndicator";
import SkeletonLoader from "@/components/shared/loaders/SkeletonLoader";
import useScreenSize from "@/hooks/useScreenSize";
import Cookies from 'js-cookie';

import { 
  LayoutDashboard, 
  Users, 
  FileCheck, 
  CheckSquare,
  Award,
  Calendar,
  BookOpen,
  FolderTree,
  Pencil,
  Plus,
  CreditCard,
  User,
  Building,
  MessageCircle,
  FileText,
  DollarSign,
  LogOut,
  X,
  Menu,
  BarChart
} from "lucide-react";

// Context for dashboard state management
export const AdminDashboardContext = createContext<any>(null);

// Dynamically import dashboard components with loading states
const AdminDashboardMain = dynamic(() => import("@/components/layout/main/dashboards/AdminDashboardMain"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="dashboard" />
});

// Admin2Dashboard - Enhanced dashboard with advanced analytics
const Admin2Dashboard = dynamic(() => import("@/components/sections/dashboards/AdminDashboard"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="dashboard" />
});

// New Course Fee Management section
const AdminCourseFee = dynamic(() => import("@/components/layout/main/dashboards/AdminCourseFee"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="default" />
});

// Currency Management section
const AdminCurrency = dynamic(() => import("@/components/layout/main/dashboards/AdminCurrency"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="default" />
});

// Blog Management
const AdminBlogsManagement = dynamic(() => import("@/components/layout/main/dashboards/AdminBlogs"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="default" />
});

// Course Management
const ListOfCourses = dynamic(() => import("@/components/layout/main/dashboards/ListOfCourse"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="courses" />
});

// Student Management
const AdminStudentManage = dynamic(() => import("@/components/layout/main/dashboards/StudentManagement"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="dashboard" />
});

// Instructor Management
const AdminInstructorManage = dynamic(() => import("@/components/layout/main/dashboards/InstructorManage"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="dashboard" />
});

// Add Student/Instructor
const AddStudent = dynamic(() => import("@/components/layout/main/dashboards/AddStudent"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="form" />
});

// Online Class Management
const OnlineClass = dynamic(() => import("@/components/layout/main/dashboards/OnlineClass"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="dashboard" />
});

// Forms Management
const AdminGetInTouch = dynamic(() => import("@/components/layout/main/dashboards/AdminGetInTouch"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="dashboard" />
});

// Type definitions
export interface SubItem {
  name: string;
  path?: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}

interface AdminDashboardLayoutProps {
  children?: React.ReactNode;
  userRole?: string;
}

/**
 * AdminDashboardLayout - Main layout component for admin dashboard
 */
const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({
  children,
  userRole
}): React.ReactElement => {
  const searchParams = useSearchParams();
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Use the screen size hook for responsive design
  const { isMobile, isTablet, isDesktop, current: breakpoint } = useScreenSize();
  
  // State management
  const [currentView, setCurrentView] = useState<string>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true); // Start open but can be toggled
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true); // Start expanded but can be toggled
  const [isDebug, setIsDebug] = useState<boolean>(false);
  const [comingSoonTitle, setComingSoonTitle] = useState<string>("Coming Soon");
  const [activeMenu, setActiveMenu] = useState<string>("");
  const [subItems, setSubItems] = useState<SubItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showCloseConfirmation, setShowCloseConfirmation] = useState<boolean>(false);
  
  // Get user name from cookies or default
  const userName = Cookies.get('userName') || "Admin User";
  
  // Handle URL parameters and adjust sidebar based on screen size
  useEffect(() => {
    // Handle URL parameters
    setIsDebug(window.location.search.includes('debug=true'));
    
    const title = searchParams?.get('title');
    if (title) {
      setComingSoonTitle(title);
      setCurrentView("comingsoon");
      return;
    }
    
    // Check for table view parameter
    const view = searchParams?.get('view');
    if (view === 'table') {
      setCurrentView("table");
      return;
    }
    
    // Check for profile list view parameter
    if (view === 'profile-list') {
      setCurrentView("profile-list");
      return;
    }
    
    // Detect current path to set the appropriate view
    const pathname = window.location.pathname;
    if (pathname.includes('/dashboards/admin/courses')) {
      setCurrentView("admin-listofcourse");
    } else if (pathname.includes('/dashboards/admin/students')) {
      setCurrentView("admin-studentmange");
    } else if (pathname.includes('/dashboards/admin/instructors')) {
      setCurrentView("admin-instuctoremange");
    } else if (pathname.includes('/dashboards/admin/online-class')) {
      setCurrentView("online-class");
    } else if (pathname.includes('/dashboards/admin/blogs')) {
      setCurrentView("admin-blogs");
    } else if (pathname.includes('/dashboards/admin/feedback')) {
      setCurrentView("admin-feedback-and-complaints");
    } else if (pathname.includes('/dashboards/admin/placements')) {
      setCurrentView("admin-placements");
    } else if (pathname === '/dashboards/admin') {
      setCurrentView("overview");
    }
    
         // Set initial sidebar state based on screen size
     if (isMobile || isTablet) {
       setIsSidebarOpen(false); // Start closed on mobile/tablet for better UX
       setIsSidebarExpanded(true);
     } else {
       // Desktop behavior - start with expanded sidebar but allow toggling
       setIsSidebarOpen(true);
       setIsSidebarExpanded(true);
     }
  }, [searchParams, isMobile, isTablet]);

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

  // Menu handlers
  const handleMenuClick = (menuName: string, items: SubItem[]) => {
    // Only trigger loading when actually changing views
    if (menuName !== currentView) {
      setIsLoading(true);
      setCurrentView(menuName);
      setActiveMenu(menuName);
      setSubItems(items);
      
      // Simulate network delay and then stop loading
      setTimeout(() => {
        setIsLoading(false);
      }, 600);
    } else {
      // Just update subItems without loading if it's the same view
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
      setComingSoonTitle(subItem.name);
      setCurrentView("comingsoon");
    } else if (subItem.onClick) {
      subItem.onClick();
    } else if (subItem.path) {
      // Handle navigation if needed
    }
    
    // Close sidebar on mobile/tablet after selection
    if (isMobile || isTablet) {
      setIsSidebarOpen(false);
    }
    
    // Simulate network delay and then stop loading
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  // Sidebar toggle function
  const toggleSidebar = () => {
    console.log('Toggle sidebar clicked. Current state:', isSidebarOpen);
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Sidebar expansion change handler
  const handleSidebarExpansionChange = (expanded: boolean) => {
    console.log('Sidebar expansion changed to:', expanded);
    setIsSidebarExpanded(expanded);
  };

  // Menu selection handler
  const handleMenuSelect = (menuName: string, subItems: SubItem[]) => {
    handleMenuClick(menuName, subItems);
  };

  // Logout handler
  const handleLogout = () => {
    // Clear cookies and redirect to login
    Cookies.remove('userName');
    Cookies.remove('userRole');
    window.location.href = '/login';
  };

  // Close dashboard handler
  const handleCloseDashboard = () => {
    setShowCloseConfirmation(true);
  };

  const confirmCloseDashboard = () => {
    window.location.href = '/';
  };

  const cancelCloseDashboard = () => {
    setShowCloseConfirmation(false);
  };

  // Component rendering function
  const renderComponent = () => {
    try {
      switch (currentView) {
        case "overview":
          return <Admin2Dashboard />;
        case "admin-listofcourse":
          return <ListOfCourses />;
        case "admin-course-fee":
          return <AdminCourseFee />;
        case "admin-currency":
          return <AdminCurrency />;
        case "admin-studentmange":
          return <AdminStudentManage />;
        case "add-student":
          return <AddStudent onCancel={() => setCurrentView("admin-studentmange")} onSuccess={() => setCurrentView("admin-studentmange")} />;
        case "admin-instuctoremange":
          return <AdminInstructorManage />;
        case "online-class":
          return <OnlineClass />;
        case "admin-blogs":
          return <AdminBlogsManagement />;
        case "admin-get-in-touch":
          return <AdminGetInTouch />;
        case "comingsoon":
          return <ComingSoonPage title={comingSoonTitle} />;
        default:
          return <Admin2Dashboard />;
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
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg"
            aria-label="Return to overview"
          >
            Return to Overview
          </button>
        </div>
      );
    }
  };

  return (
    <AdminDashboardContext.Provider value={contextValue}>
      <div className="relative bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col">
                 {/* Dashboard Navbar - responsive positioning */}
         <div className="fixed top-0 left-0 right-0 z-50">
           <DashboardNavbar 
             onMobileMenuToggle={toggleSidebar}
             isScrolled={false}
             isSidebarOpen={isSidebarOpen}
           />
         </div>
         

        
        {/* Main layout container */}
        <div className="flex flex-1 pt-16 lg:pt-20">
                     {/* Desktop Sidebar */}
           {isDesktop && isSidebarOpen && (
             <div 
               className="fixed h-full top-16 lg:top-20 z-30 transition-all duration-300"
               style={{ 
                 height: 'calc(100vh - 80px)',
                 width: isSidebarExpanded ? '280px' : '80px',
                 left: 0,
               }}
             >
               <SidebarDashboard
                 userRole={userRole || "admin"}
                 fullName={userName}
                 userEmail=""
                 userImage=""
                 userNotifications={0}
                 userSettings={{
                   theme: "light",
                   language: "en",
                   notifications: true
                 }}
                 onMenuClick={handleMenuClick}
                 isOpen={isSidebarOpen}
                 onOpenChange={setIsSidebarOpen}
                 isExpanded={isSidebarExpanded}
                 onExpandedChange={handleSidebarExpansionChange}
               />
             </div>
           )}

          {/* Mobile/Tablet Sidebar */}
          {(isMobile || isTablet) && (
            <>
              {/* Mobile sidebar */}
              <div
                className={`fixed left-0 top-16 h-full w-80 max-w-[85vw] z-50 transition-transform duration-300 ${
                  isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
                style={{ height: 'calc(100vh - 64px)' }}
              >
                <div className="h-full bg-white dark:bg-gray-900 shadow-2xl">
                  {/* Mobile sidebar header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Navigation
                    </h2>
                    <button
                      onClick={toggleSidebar}
                      className="p-2 rounded-lg text-gray-500 bg-gray-100 dark:text-gray-400 dark:bg-gray-800 transition-colors"
                      aria-label="Toggle navigation"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Mobile sidebar content */}
                  <div className="h-full overflow-y-auto pb-20">
                    <SidebarDashboard
                      userRole={userRole || "admin"}
                      fullName={userName}
                      userEmail=""
                      userImage=""
                      userNotifications={0}
                      userSettings={{
                        theme: "light",
                        language: "en",
                        notifications: true
                      }}
                      onMenuClick={handleMenuClick}
                      isOpen={true}
                      onOpenChange={setIsSidebarOpen}
                      isExpanded={true}
                      onExpandedChange={() => {}}
                    />
                  </div>
                </div>
              </div>

              {/* Mobile backdrop */}
              {isSidebarOpen && (
                <div
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                  onClick={() => setIsSidebarOpen(false)}
                  aria-hidden="true"
                />
              )}
            </>
          )}

                     {/* Main Content Area */}
           <div 
             className="flex-1 overflow-y-auto transition-all duration-300"
             style={{
               marginLeft: isDesktop ? (isSidebarOpen ? (isSidebarExpanded ? "280px" : "80px") : "0px") : "0px",
               width: isDesktop ? (isSidebarOpen ? (isSidebarExpanded ? "calc(100% - 280px)" : "calc(100% - 80px)") : "100%") : "100%",
               minHeight: isDesktop ? 'calc(100vh - 80px)' : 'auto',
             }}
           >
            {/* Content with responsive padding */}
            <div className={`${isMobile ? 'p-3 pb-20' : isTablet ? 'p-4 pb-6' : 'p-6 lg:p-8'}`}>
                             {/* Debug info */}
               {isDebug && (
                 <div className="mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-lg text-xs">
                   Debug: Current View = "{currentView}" | Breakpoint = "{breakpoint}" | 
                   Sidebar Open = {isSidebarOpen ? "true" : "false"} | 
                   Sidebar Expanded = {isSidebarExpanded ? "true" : "false"} |
                   Loading = {isLoading ? "true" : "false"} |
                   isDesktop = {isDesktop ? "true" : "false"}
                 </div>
               )}
              
              {/* Global loading indicator */}
              <AnimatePresence>
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
              </AnimatePresence>
              
              {/* Render content */}
              <div className="bg-white dark:bg-gray-800 rounded-none md:rounded-xl shadow-none md:shadow-sm overflow-hidden">
                {children ? children : renderComponent()}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop action buttons */}
        {isDesktop && (
          <div className="fixed z-40 bottom-6 right-6 flex flex-col gap-3">
            {/* Close Dashboard Button */}
            <button
              onClick={handleCloseDashboard}
              className="p-3 rounded-full bg-gray-500 text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
              aria-label="Close Dashboard"
              title="Close Dashboard"
            >
              <X size={20} />
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-3 rounded-full bg-red-500 text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
              aria-label="Logout"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        )}

        {/* Mobile action buttons */}
        {(isMobile || isTablet) && (
          <div className="fixed z-40 bottom-6 right-6 flex flex-col gap-3">
            {/* Close Dashboard Button */}
            <button
              onClick={handleCloseDashboard}
              className="p-3 rounded-full bg-gray-500 text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
              aria-label="Close Dashboard"
              title="Close Dashboard"
            >
              <X size={20} />
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-3 rounded-full bg-red-500 text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
              aria-label="Logout"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        )}

        {/* Close Confirmation Modal */}
        <AnimatePresence>
          {showCloseConfirmation && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={cancelCloseDashboard}
            >
              <div
                className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <X className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Close Dashboard
                  </h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Are you sure you want to close the dashboard and return to the main site? Your current progress will be saved.
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={cancelCloseDashboard}
                    className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmCloseDashboard}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium transition-colors"
                  >
                    Close Dashboard
                  </button>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AdminDashboardContext.Provider>
  );
};

export default AdminDashboardLayout;
