"use client";

import React, { useState, useEffect, useContext, createContext, useMemo, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, MoreHorizontal, Menu, X, LogOut, Home, ArrowLeft } from "lucide-react";
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

const QuizMain = dynamic(
  () => import("@/components/layout/main/dashboards/QuizMain"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="quiz" />
  }
);

const CertificateMain = dynamic(
  () => import("@/components/layout/main/dashboards/CertificateMain"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="certificates" />
  }
);

const FeedbackMain = dynamic(
  () => import("@/components/layout/main/dashboards/FeedbackMain"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="form" />
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

const PlacementMain = dynamic(
  () => import("@/components/layout/main/dashboards/PlacementMain"), 
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

const AllCoursesMain = dynamic(
  () => import("@/components/layout/main/dashboards/AllCoursesMain"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="courses" />
  }
);

const StudentProfilePage = dynamic(
  () => import("@/components/sections/dashboards/StudentProfilePage"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="dashboard" />
  }
);

const CompletedCoursesMain = dynamic(
  () => import("@/components/layout/main/dashboards/CompletedCoursesMain"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="courses" />
  }
);

const LessonCourseMaterialsMain = dynamic(
  () => import("@/components/layout/main/dashboards/LessonCourseMaterialsMain"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="resources" />
  }
);

const AssignmentsMain = dynamic(
  () => import("@/components/layout/main/dashboards/AssignmentsMain"), 
  { 
    ssr: false,
    loading: () => <SkeletonLoader type="assignments" />
  }
);

const WishlistPage = dynamic(
  () => import("@/app/dashboards/student/wishlist/page"),
  {
    ssr: false,
    loading: () => <SkeletonLoader type="dashboard" />
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
}): React.ReactElement => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Use the screen size hook for responsive design
  const { isMobile, isTablet, isDesktop, current: breakpoint } = useScreenSize();
  
  // State management
  const [currentView, setCurrentView] = useState<string>("overview");
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false); // Always start closed on mobile/tablet
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
    if (pathname.includes('/dashboards/student/all-courses')) {
      setCurrentView("allcourses");
    } else if (pathname.includes('/dashboards/student/completed-courses')) {
      setCurrentView("completedcourses");
    } else if (pathname.includes('/dashboards/student/lesson-course-materials')) {
      setCurrentView("lessoncoursematerials");
    } else if (pathname.includes('/dashboards/student/assignments')) {
      setCurrentView("assignments");
    } else if (pathname.includes('/dashboards/student/my-courses')) {
      setCurrentView("my-courses");
    } else if (pathname.includes('/dashboards/student/membership')) {
      setCurrentView("membership");
    } else if (pathname.includes('/dashboards/student/profile')) {
      setCurrentView("profile");
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
    } else if (pathname.includes('/dashboards/student/quiz')) {
      setCurrentView("quiz");
    } else if (pathname.includes('/dashboards/student/certificate')) {
      setCurrentView("certificate");
    } else if (pathname.includes('/dashboards/student/feedback')) {
      setCurrentView("feedback");
    } else if (pathname.includes('/dashboards/student/apply')) {
      setCurrentView("apply");
    } else if (pathname.includes('/dashboards/student/wishlist')) {
      setCurrentView("wishlist");
    } else if (pathname === '/dashboards/student') {
      setCurrentView("overview");
    }
    
    // Mobile/tablet specific initialization
    if (isMobile || isTablet) {
      setIsSidebarOpen(false); // Always start closed on mobile/tablet
      setIsSidebarExpanded(false);
    } else {
      // Desktop behavior remains the same
      setIsSidebarExpanded(false);
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
      router.push(subItem.path);
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
    if ((isMobile || isTablet) && !isSidebarOpen) {
      // When opening on mobile/tablet, always show expanded sidebar for better usability
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

    // If children are provided, render them instead of view-based components
    if (children) {
      return children;
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
    } else if (viewMatches(['allcourses', 'all-courses'])) {
      return <AllCoursesMain />;
    } else if (viewMatches(['completedcourses', 'completed-courses', 'completed'])) {
      return <CompletedCoursesMain />;
    } else if (viewMatches(['lessoncoursematerials', 'lesson-course-materials', 'materials'])) {
      return <LessonCourseMaterialsMain />;
    } else if (viewMatches(['assignments', 'assignment'])) {
      return <AssignmentsMain />;
    } else if (viewMatches(['mycourses', 'my-courses', 'courses'])) {
      return <MyCoursesDashboard />;
    } else if (viewMatches(['membership'])) {
      return <StudentMembership />;
    } else if (viewMatches(['enrolledcourses', 'enrolled-courses', 'enrolled'])) {
      return <EnrolledCoursesMain />;
    } else if (viewMatches(['quiz', 'quizzes'])) {
      return <QuizMain />;
    } else if (viewMatches(['feedback', 'support'])) {
      return <FeedbackMain />;
    } else if (viewMatches(['certificate', 'certificates'])) {
      if (viewMatches(['view'])) {
        return (
          <div className="p-4 md:p-8 w-full flex flex-col items-center justify-center">
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
                className="w-full max-w-4xl h-[70vh] md:h-[80vh] rounded-lg shadow-lg" 
                title="Certificate Preview"
                aria-label="Certificate document viewer"
              />
            )}
          </div>
        );
      } else {
        return <CertificateMain />;
      }
    } else if (viewMatches(['payment', 'payments'])) {
      return <Payments />;
    } else if (viewMatches(['placement-application', 'placement', 'apply'])) {
      return <PlacementMain />;
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
    } else if (viewMatches(['profile'])) {
      return <StudentProfilePage />;
    } else if (viewMatches(['wishlist'])) {
      return <WishlistPage />;
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

  // Memoize the DashboardComponent to prevent re-renders
  const MemoizedDashboardComponent = useMemo(() => (
    <div className="bg-white dark:bg-gray-800 rounded-none md:rounded-xl shadow-none md:shadow-sm overflow-hidden md:elevation-2">
      <DashboardComponent />
    </div>
  ), [currentView, isLoading, children]); // Only re-render when these values change

  return (
    <DashboardContext.Provider value={contextValue}>
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
          {/* Desktop Sidebar - unchanged */}
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
              position: isMobile || isTablet ? 'fixed' : 'relative',
              top: isMobile || isTablet ? '64px' : 'auto',
              left: 0,
              right: 0,
              bottom: 0,
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
    </DashboardContext.Provider>
  );
};

export default StudentDashboardLayout; 