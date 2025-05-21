"use client";

import React, { useState, useEffect, useContext, createContext, useMemo, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, MoreHorizontal, Menu, X, LogOut } from "lucide-react";
import Cookies from 'js-cookie';

// Component imports
import SidebarDashboard from "@/components/sections/sub-section/dashboards/SidebarDashboard";
import ComingSoonPage from "@/components/shared/others/ComingSoonPage";
import DashboardNavbar from "@/components/Dashboard/DashboardNavbar";
import LoadingIndicator, { loadingIndicatorStyles } from "@/components/shared/loaders/LoadingIndicator";
import SkeletonLoader from "@/components/shared/loaders/SkeletonLoader";

// Custom hooks
import useScreenSize from "@/hooks/useScreenSize";

// Context for dashboard state management
export const DashboardContext = createContext<any>(null);

// Styles import
import { dashboardStyles } from "@/styles/dashboard";

// Dynamically import dashboard components with proper loading states
const StudentDashboardMain = dynamic(
  () => import("@/components/layout/main/dashboards/StudentDashboardMain"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="dashboard" />
  }
);

const MyCoursesDashboard = dynamic(
  () => import("@/components/layout/main/dashboards/MyCoursesDashboard"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="courses" />
  }
);

const StudentMembership = dynamic(
  () => import("@/components/layout/main/dashboards/studentMembership"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="membership" />
  }
);

const StudentEnrolledCourses = dynamic(
  () => import("@/components/sections/sub-section/dashboards/StudentEnrolledCourses"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="courses" />
  }
);

const QuizPage = dynamic(
  () => import("@/components/layout/main/dashboards/QuizPage"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="quiz" />
  }
);

// Note: Using proper casing for FeedbackandSupport to match existing file
const FeedbackAndSupport = dynamic(
  () => import("@/components/layout/main/dashboards/FeedbackandSupport"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="form" />
  }
);

const CertificateCoursesEnroll = dynamic(
  () => import("@/components/layout/main/dashboards/CertificateCoursesEnroll"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="certificates" />
  }
);

const Payments = dynamic(
  () => import("@/components/layout/main/dashboards/Payments"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="payments" />
  }
);

const PlacementForm = dynamic(
  () => import("@/components/layout/main/dashboards/PlacementForm"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="form" />
  }
);

// Add the StudentDemoClasses component import
const StudentDemoClasses = dynamic(
  () => import("@/components/layout/main/dashboards/UpcomingClassesMain"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="classes" />
  }
);

// Add the new component imports
const StudentProgressTracking = dynamic(
  () => import("@/components/layout/main/dashboards/StudentProgressTracking"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="dashboard" />
  }
);

const LearningResources = dynamic(
  () => import("@/components/layout/main/dashboards/LearningResources"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="resources" />
  }
);

const StudentAssignments = dynamic(
  () => import("@/components/layout/main/dashboards/StudentAssignments"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="assignments" />
  }
);

const LiveClasses = dynamic(
  () => import("@/components/layout/main/dashboards/LiveClassesMain"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="classes" />
  }
);

// Add the new component imports
const JoinLiveClasses = dynamic(
  () => import("@/components/layout/main/dashboards/JoinLiveMain"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="classes" />
  }
);

// Add the new component imports
const RecordedSessionsMain = dynamic(
  () => import("@/components/layout/main/dashboards/RecordedSessionsMain"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="courses" />
  }
);

// Add the new component imports
const EnrolledCoursesMain = dynamic(
  () => import("@/components/layout/main/dashboards/EnrolledCoursesMain"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="courses" />
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

// Updated content variants with offset for sidebar
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

interface DashboardLayoutProps {
  userRole: string;
}

interface StudentDashboardLayoutProps {
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
 * StudentDashboardLayout - Main layout component for student dashboard
 */
const StudentDashboardLayout: React.FC<StudentDashboardLayoutProps> = ({
  children,
  userRole,
  fullName,
  userEmail,
  userImage,
  userNotifications,
  userSettings
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Use the screen size hook for responsive design
  const { isMobile, isTablet, isDesktop, current: breakpoint } = useScreenSize();
  
  // State management
  const [currentView, setCurrentView] = useState<string>("overview");
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(false);
  const [isDebug, setIsDebug] = useState<boolean>(false);
  const [comingSoonTitle, setComingSoonTitle] = useState<string>("Coming Soon");
  const [activeMenu, setActiveMenu] = useState<string>("");
  const [subItems, setSubItems] = useState<SubItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contentPadding, setContentPadding] = useState<string>("0px");
  
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
    
    // Detect current path to set the appropriate view
    const pathname = window.location.pathname;
    if (pathname.includes('/dashboards/student/my-courses')) {
      setCurrentView("my-courses");
    } else if (pathname.includes('/dashboards/student/membership')) {
      setCurrentView("membership");
    } else if (pathname.includes('/dashboards/student/live-classes')) {
      setCurrentView("liveclasses");
    } else if (pathname.includes('/dashboards/student/upcoming-classes')) {
      setCurrentView("democlasses");
    } else if (pathname.includes('/dashboards/student/join-live')) {
      setCurrentView("joinlive");
    } else if (pathname.includes('/dashboards/student/access-recorded-sessions')) {
      setCurrentView("recordedsessions");
    } else if (pathname.includes('/dashboards/student/enrolled-courses')) {
      setCurrentView("enrolledcourses");
    } else if (pathname === '/dashboards/student') {
      setCurrentView("overview");
    }
    
    // Keep sidebar closed by default, regardless of screen size
    // Don't update isSidebarOpen here
    setIsSidebarExpanded(false); // Always start with collapsed sidebar
  }, [searchParams, isMobile]);

  // Handle content padding adjustment based on sidebar state
  useEffect(() => {
    // If sidebar is open but not expanded (in collapsed icon-only mode) or closed
    const basePadding = isMobile ? "0px" : isSidebarExpanded ? "245px" : "68px";
    setContentPadding(basePadding);
  }, [isSidebarExpanded, isSidebarOpen, isMobile]);

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
    certificateUrl,
    setCertificateUrl,
    isLoading,
    setIsLoading
  }), [
    currentView, isMobile, isTablet, isDesktop, 
    breakpoint, isSidebarOpen, isSidebarExpanded, activeMenu, certificateUrl,
    isLoading
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
    
    if (isMobile) {
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
      router.push(subItem.path);
    }
    
    // Simulate network delay and then stop loading
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  // Certificate view handlers
  const handleViewCertificate = () => {
    setIsLoading(true);
    setCurrentView("certificateView");
    
    // Simulate network delay and then stop loading
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  const handleCloseCertificate = () => {
    setIsLoading(true);
    setCurrentView("certificates");
    setCertificateUrl(null);
    
    // Simulate network delay and then stop loading
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  };

  // Handle sidebar expansion state change
  const handleSidebarExpansionChange = useCallback((expanded: boolean) => {
    // Only update the expansion state without affecting any content state
    setIsSidebarExpanded(expanded);
    // Avoid triggering any re-renders of content
  }, []);

  // Toggle sidebar handler with accessibility support
  const toggleSidebar = () => {
    // Don't set any loading state, just toggle the sidebar
    setIsSidebarOpen(!isSidebarOpen);
    if (isMobile && !isSidebarOpen) {
      // When opening on mobile, always show expanded sidebar for better usability
      setIsSidebarExpanded(true);
    }
  };

  // Component renderer with error boundary - without re-rendering on sidebar toggle
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
          returnPath="/dashboards/student"
        />
      );
    }

    // Helper to check if view matches any of the provided patterns
    const viewMatches = (patterns: string[]): boolean => {
      const normalizedView = currentView.toLowerCase();
      return patterns.some(pattern => normalizedView.includes(pattern));
    };
    
    // Component selection based on view
    if (viewMatches(['overview', 'dashboard'])) {
      return <StudentDashboardMain />;
    } else if (viewMatches(['mycourses', 'my-courses', 'courses'])) {
      return <MyCoursesDashboard />;
    } else if (viewMatches(['membership'])) {
      return <StudentMembership />;
    } else if (viewMatches(['enrolledcourses', 'enrolled-courses', 'enrolled'])) {
      return <StudentEnrolledCourses />;
    } else if (viewMatches(['quiz', 'quizzes'])) {
      return <QuizPage closeQuiz={() => setCurrentView("overview")} />;
    } else if (viewMatches(['feedback', 'support'])) {
      return <FeedbackAndSupport />;
    } else if (viewMatches(['certificate', 'certificates'])) {
      if (viewMatches(['view'])) {
        return (
          <div className="p-8 w-full flex flex-col items-center justify-center">
            <button 
              onClick={handleCloseCertificate}
              className="self-start mb-4 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus-ring"
              aria-label="Back to certificates"
            >
              &larr; Back to Certificates
            </button>
            {certificateUrl && (
              <iframe 
                src={certificateUrl} 
                className="w-full max-w-4xl h-[80vh] rounded-lg shadow-lg" 
                title="Certificate Preview"
                aria-label="Certificate document viewer"
              />
            )}
          </div>
        );
      } else {
        return (
          <CertificateCoursesEnroll 
            onViewCertificate={handleViewCertificate} 
            setCertificateUrl={setCertificateUrl} 
          />
        );
      }
    } else if (viewMatches(['payment', 'payments'])) {
      return <Payments />;
    } else if (viewMatches(['placement'])) {
      return <PlacementForm 
        isOpen={true} 
        onClose={() => {
          setIsLoading(true);
          setCurrentView("overview");
          
          // Simulate network delay and then stop loading
          setTimeout(() => {
            setIsLoading(false);
          }, 400);
        }} 
      />;
    } else if (viewMatches(['democlasses', 'demo'])) {
      return <StudentDemoClasses />;
    } else if (viewMatches(['progress', 'analytics'])) {
      return <StudentProgressTracking />;
    } else if (viewMatches(['resource', 'materials', 'ebooks'])) {
      return <LearningResources />;
    } else if (viewMatches(['assignments', 'assignment'])) {
      return <StudentAssignments />;
    } else if (viewMatches(['liveclasses', 'live'])) {
      return <LiveClasses />;
    } else if (viewMatches(['joinlive', 'join'])) {
      return <JoinLiveClasses />;
    } else if (viewMatches(['recordedsessions'])) {
      return <RecordedSessionsMain />;
    } else if (viewMatches(['enrolledcourses', 'enrolled-courses', 'enrolled'])) {
      return <EnrolledCoursesMain />;
    } else {
      // Default to coming soon for truly unimplemented views
      return (
        <ComingSoonPage 
          title="Feature Coming Soon"
          description="We're working on this feature and it will be available soon!"
          returnPath="/dashboards/student"
        />
      );
    }
  };

  // Handle logout
  const handleLogout = () => {
    try {
      // Clear localStorage items
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
      
      // Use the new path format for redirecting to login
      router.push("/login/");
    } catch (error) {
      console.error("Error during logout:", error);
      // If error, still try to redirect
      router.push("/login/");
    }
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      <div className="relative bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col pt-16 lg:pt-20">
        {/* Global styles */}
        <style jsx global>{dashboardStyles}</style>
        <style jsx global>{loadingIndicatorStyles}</style>
        
        {/* New Dashboard Navbar - positioned at the top, full width */}
        <DashboardNavbar 
          onMobileMenuToggle={toggleSidebar}
          isScrolled={false}
        />
        
        {/* Main layout with sidebar and content - prevent nested scrolling */}
        <div className="flex flex-1 relative">
          {/* Sidebar - fixed position but no internal scrolling */}
          <div 
            className={`${isMobile ? 'fixed z-40' : 'fixed lg:relative'} h-full top-16 lg:top-20`}
            style={{ 
              height: isMobile ? 'calc(100% - 70px)' : 'calc(100vh - 80px)',
              width: isMobile ? (isSidebarOpen ? '220px' : '0px') : (isSidebarExpanded ? '220px' : '68px'),
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
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

          {/* Main Content Area - only this should scroll */}
          <motion.div 
            className="flex-1 overflow-y-auto scroll-smooth"
            variants={contentVariants}
            initial={isSidebarExpanded ? "expanded" : "collapsed"}
            animate={isSidebarExpanded ? "expanded" : "collapsed"}
            style={useMemo(() => ({
              marginLeft: isMobile ? '0px' : '10px',
              width: "100%",
              maxWidth: isSidebarExpanded ? "calc(100% - 230px)" : "calc(100% - 78px)",
              transition: "max-width 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
            }), [isMobile, isSidebarExpanded])}
          >
            {/* Content with proper padding */}
            <div className="p-4 md:p-6">
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
              
              {/* Using React.memo to prevent content from re-rendering when sidebar changes */}
              {useMemo(() => (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden elevation-2">
                  <DashboardComponent />
                </div>
              ), [currentView, isLoading])}
            </div>
          </motion.div>
        </div>

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
        
        {/* Add logout button to the bottom right */}
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLogout}
          className={`fixed z-40 bottom-6 ${isMobile ? 'left-6' : 'right-6'} p-3 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900`}
          aria-label="Logout"
        >
          <LogOut size={20} />
        </motion.button>
      </div>
    </DashboardContext.Provider>
  );
};

export default StudentDashboardLayout; 