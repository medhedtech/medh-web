"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import SidebarDashboard from "@/components/sections/sub-section/dashboards/SidebarDashboard";
import ComingSoonPage from "@/components/shared/others/ComingSoonPage";
import { useSearchParams } from "next/navigation";

// Dynamically import dashboard components
const StudentDashboardMain = dynamic(() => import("@/components/layout/main/dashboards/StudentDashboardMain"), { 
  ssr: false,
  loading: () => <div className="flex min-h-[60vh] items-center justify-center"><div className="animate-pulse text-primary-500">Loading overview...</div></div>
});
const MyCoursesDashboard = dynamic(() => import("@/components/layout/main/dashboards/MyCoursesDashboard"), { 
  ssr: false,
  loading: () => <div className="flex min-h-[60vh] items-center justify-center"><div className="animate-pulse text-primary-500">Loading courses...</div></div>
});
const StudentMembership = dynamic(() => import("@/components/layout/main/dashboards/studentMembership"), { ssr: false });
const StudentEnrolledCourses = dynamic(() => import("@/components/sections/sub-section/dashboards/StudentEnrolledCourses"), { 
  ssr: false,
  loading: () => <div className="flex min-h-[60vh] items-center justify-center"><div className="animate-pulse text-primary-500">Loading enrolled courses...</div></div>
});
const QuizPage = dynamic(() => import("@/components/layout/main/dashboards/QuizPage"), { ssr: false });
const FeedbackandSupport = dynamic(() => import("@/components/layout/main/dashboards/FeedbackandSupport"), { ssr: false });
const CertificateCoursesEnroll = dynamic(() => import("@/components/layout/main/dashboards/CertificateCoursesEnroll"), { ssr: false });
const Payments = dynamic(() => import("@/components/layout/main/dashboards/Payments"), { ssr: false });
const PlacementForm = dynamic(() => import("@/components/layout/main/dashboards/PlacementForm"), { ssr: false });

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

interface DashboardLayoutProps {
  userRole: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ userRole }) => {
  const searchParams = useSearchParams();
  const [currentView, setCurrentView] = useState<string>("overview");
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isDebug, setIsDebug] = useState<boolean>(false);
  const [comingSoonTitle, setComingSoonTitle] = useState<string>("Coming Soon");

  // Check if device is mobile and handle coming soon params
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
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

  // Handle menu item selection
  const handleMenuSelect = (viewName: string) => {
    console.log("Menu selected:", viewName); // Debug log
    setCurrentView(viewName);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Certificate view handlers
  const handleViewCertificate = () => {
    setCurrentView("certificateView");
  };

  const handleCloseCertificate = () => {
    setCurrentView("certificates");
    setCertificateUrl(null);
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
        returnPath="/dashboards/student-dashboard"
      />;
    }
    
    // Helper to check if the current view matches any of the given patterns
    const viewMatches = (patterns: string[]): boolean => {
      const normalizedView = currentView.toLowerCase();
      return patterns.some(pattern => normalizedView.includes(pattern));
    };
    
    // Determine which component to render based on the current view
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
      return <FeedbackandSupport />;
    } else if (viewMatches(['certificate', 'certificates'])) {
      if (viewMatches(['view'])) {
        return (
          <div className="p-8 w-full flex flex-col items-center justify-center">
            <button 
              onClick={handleCloseCertificate}
              className="self-start mb-4 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              &larr; Back to Certificates
            </button>
            {certificateUrl && (
              <iframe 
                src={certificateUrl} 
                className="w-full max-w-4xl h-[80vh] rounded-lg shadow-lg" 
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
      return <PlacementForm />;
    } else if (viewMatches(['democlasses', 'demo'])) {
      return <ComingSoonPage 
        title="Demo Classes" 
        description="This feature is coming soon. You'll be able to manage your demo classes here."
        returnPath="/dashboards/student-dashboard"
      />;
    } else if (viewMatches(['progress', 'analytics'])) {
      return <ComingSoonPage 
        title="Progress Tracking" 
        description="Track your course progress and performance analytics here. Coming soon!"
        returnPath="/dashboards/student-dashboard"
      />;
    } else if (viewMatches(['resource', 'materials', 'ebooks'])) {
      return <ComingSoonPage 
        title="Learning Resources" 
        description="Access course materials and e-books. Coming soon!"
        returnPath="/dashboards/student-dashboard"
      />;
    } else if (viewMatches(['assignments', 'assignment'])) {
      return <ComingSoonPage 
        title="Assignments" 
        description="View and submit your assignments here. Coming soon!"
        returnPath="/dashboards/student-dashboard"
      />;
    } else if (viewMatches(['liveclasses', 'live'])) {
      return <ComingSoonPage 
        title="Live Classes" 
        description="Join and manage your live classes here. Coming soon!"
        returnPath="/dashboards/student-dashboard"
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
        returnPath="/dashboards/student-dashboard"
      />;
    }
  };

  return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
        {/* Mobile Sidebar Toggle - Keep it fixed relative to viewport */}
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed z-30 bottom-6 right-6 p-4 rounded-full bg-primary-500 text-white shadow-lg"
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
              {sidebarOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 12h16M4 6h16M4 18h16" />
              )}
            </svg>
          </button>
        )}

        {/* Sidebar - Make it sticky and prevent its own scroll */}
        <div
          className={`${
            isMobile
              ? `fixed z-20 transform ${
                  sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`
              : "sticky"
          } top-0 h-screen flex-shrink-0 w-[280px] bg-white dark:bg-gray-800 transition-transform duration-300 shadow-md overflow-hidden`}
        >
          <SidebarDashboard
            role={userRole}
            onMenuSelect={handleMenuSelect}
            currentView={currentView}
          />
        </div>

        {/* Main Content Area - Make this scrollable */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex-1 overflow-y-auto"
        >
          <div className="p-6">
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
          </div>
        </motion.div>
      </div>
  );
};

export default DashboardLayout; 