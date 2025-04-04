"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import SidebarDashboard from "@/components/sections/sub-section/dashboards/SidebarDashboard";
import ComingSoonPage from "@/components/shared/others/ComingSoonPage";
import { useSearchParams } from "next/navigation";
import { ChevronDown, ChevronRight, MoreHorizontal, Menu, X } from "lucide-react";
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
  
  .dropdown-container {
    position: relative;
  }
  
  .dropdown-menu {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    z-index: 50;
    width: 15rem;
    transform-origin: top right;
  }
  
  @media (max-width: 640px) {
    .dropdown-menu {
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
      bottom: 16px;
      top: auto;
      width: calc(100% - 32px);
      max-width: 20rem;
    }
  }
`;

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

interface SubItem {
  name: string;
  path?: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
  onClick?: () => void;
}

interface StudentDashboardLayoutProps {
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

const StudentDashboardLayout: React.FC<StudentDashboardLayoutProps> = ({
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
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
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
        returnPath="/dashboards/student"
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
        returnPath="/dashboards/student"
      />;
    } else if (viewMatches(['progress', 'analytics'])) {
      return <ComingSoonPage 
        title="Progress Tracking" 
        description="Track your course progress and performance analytics here. Coming soon!"
        returnPath="/dashboards/student"
      />;
    } else if (viewMatches(['resource', 'materials', 'ebooks'])) {
      return <ComingSoonPage 
        title="Learning Resources" 
        description="Access course materials and e-books. Coming soon!"
        returnPath="/dashboards/student"
      />;
    } else if (viewMatches(['assignments', 'assignment'])) {
      return <ComingSoonPage 
        title="Assignments" 
        description="View and submit your assignments here. Coming soon!"
        returnPath="/dashboards/student"
      />;
    } else if (viewMatches(['liveclasses', 'live'])) {
      return <ComingSoonPage 
        title="Live Classes" 
        description="Join and manage your live classes here. Coming soon!"
        returnPath="/dashboards/student"
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
        returnPath="/dashboards/student"
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
                userRole={userRole}
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

export default StudentDashboardLayout; 