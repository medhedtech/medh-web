"use client";

import React, { useState, useEffect, useContext, createContext, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, MoreHorizontal, Menu, X } from "lucide-react";

// Component imports
import SidebarDashboard from "@/components/sections/sub-section/dashboards/SidebarDashboard";
import ComingSoonPage from "@/components/shared/others/ComingSoonPage";
import DashboardNavbar from "./DashboardNavbar";
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
  
  // Use the screen size hook for responsive design
  const { isMobile, isTablet, isDesktop, current: breakpoint } = useScreenSize();
  
  // State management
  const [currentView, setCurrentView] = useState<string>("overview");
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(!isMobile);
  const [isDebug, setIsDebug] = useState<boolean>(false);
  const [comingSoonTitle, setComingSoonTitle] = useState<string>("Coming Soon");
  const [activeMenu, setActiveMenu] = useState<string>("");
  const [subItems, setSubItems] = useState<SubItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
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
    
    // Set sidebar state based on screen size
    setIsSidebarOpen(!isMobile);
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
    certificateUrl,
    setCertificateUrl,
    isLoading,
    setIsLoading
  }), [
    currentView, isMobile, isTablet, isDesktop, 
    breakpoint, isSidebarOpen, activeMenu, certificateUrl,
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

  // Toggle sidebar handler with accessibility support
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      <div className="relative">
        {/* Global styles */}
        <style jsx global>{dashboardStyles}</style>
        <style jsx global>{loadingIndicatorStyles}</style>
        
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
          {/* Mobile Sidebar Toggle - positioned at bottom right corner */}
          {isMobile && (
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
          )}

          {/* Sidebar - now with sticky positioning and similar style to admin dashboard */}
          <div
            className={`${
              isMobile
                ? `fixed z-20 transform ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                  }`
                : "sticky"
            } top-0 h-screen flex-shrink-0 w-[280px] bg-white dark:bg-gray-800 transition-transform duration-300 shadow-md overflow-hidden`}
          >
            <SidebarDashboard
              userRole={userRole}
              fullName={fullName}
              userEmail={userEmail}
              userImage={userImage}
              userNotifications={userNotifications}
              userSettings={userSettings}
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
      </div>
    </DashboardContext.Provider>
  );
};

export default StudentDashboardLayout; 