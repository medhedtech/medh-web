"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import SidebarDashboard from "@/components/sections/sub-section/dashboards/SidebarDashboard";
import ComingSoonPage from "@/components/shared/others/ComingSoonPage";
import { useSearchParams } from "next/navigation";

// Dynamically import dashboard components
const AdminDashboardMain = dynamic(() => import("@/components/layout/main/dashboards/AdminDashboardMain"), { 
  ssr: false,
  loading: () => <div className="flex min-h-[60vh] items-center justify-center"><div className="animate-pulse text-primary-500">Loading overview...</div></div>
});

// Feedback & Support
const AdminFeedbackComplaints = dynamic(() => import("@/components/layout/main/dashboards/Admin-Feedback-Complaints"), { ssr: false });

// Placement Management
const AdminPlacements = dynamic(() => import("@/components/layout/main/dashboards/Admin-Placements"), { ssr: false });

// Blog Management
const AdminBlogsManagement = dynamic(() => import("@/components/layout/main/dashboards/AdminBlogs"), { ssr: false });
const AddBlog = dynamic(() => import("@/components/layout/main/dashboards/AddBlogs"), { ssr: false });

// Course Management
const AddCourse = dynamic(() => import("@/components/layout/main/dashboards/AddCourse"), { ssr: false });
const UpdateCourse = dynamic(() => import("@/components/layout/main/dashboards/UpdateCourse"), { ssr: false });
const ListOfCourses = dynamic(() => import("@/components/layout/main/dashboards/ListOfCourse"), { ssr: false });
const DashboardCoursesTab = dynamic(() => import("@/components/shared/dashboards/DashboardCoursesTab"), { ssr: false });
const AdminCategories = dynamic(() => import("@/components/layout/main/dashboards/AddCategories"), { ssr: false });
const CategoryManagement = dynamic(() => import("@/components/layout/main/dashboards/CateogiresManage"), { ssr: false });
const CourseDetails = dynamic(() => import("@/components/layout/main/dashboards/CourseDetails"), { ssr: false });
const PreviewDetail = dynamic(() => import("@/components/layout/main/dashboards/Previewdetail"), { ssr: false });
const PreviewUpdateDetail = dynamic(() => import("@/components/layout/main/dashboards/PreviewUpdateDetail"), { ssr: false });

// Resource & Curriculum Management
const CurriculumBuilder = dynamic(() => import("@/components/layout/main/dashboards/CurriculumBuilder"), { ssr: false });
const ResourceBuilder = dynamic(() => import("@/components/layout/main/dashboards/ResourceBuilder"), { ssr: false });
const AssignmentBuilder = dynamic(() => import("@/components/layout/main/dashboards/AssignmentBuilder"), { ssr: false });
const QuizBuilder = dynamic(() => import("@/components/layout/main/dashboards/QuizBuilder"), { ssr: false });

// Forms Management
const AdminEnrollmentForm = dynamic(() => import("@/components/layout/main/dashboards/AdminEnrollent-Form"), { ssr: false });
const AdminGetInTouch = dynamic(() => import("@/components/layout/main/dashboards/AdminGetInTouch"), { ssr: false });
const AdminJobApplicants = dynamic(() => import("@/components/layout/main/dashboards/AdminJobApplicants"), { ssr: false });

// User Management
const StudentManagement = dynamic(() => import("@/components/layout/main/dashboards/StudentManagement"), { ssr: false });
const AddStudent = dynamic(() => import("@/components/layout/main/dashboards/AddStudentForm"), { ssr: false });
const InstructorManagement = dynamic(() => import("@/components/layout/main/dashboards/InstructoreManage"), { ssr: false });
const AddInstructor = dynamic(() => import("@/components/layout/main/dashboards/AddInstructor"), { ssr: false });
const AddUser = dynamic(() => import("@/components/layout/main/dashboards/AddUserForm"), { ssr: false });
const AssignInstructor = dynamic(() => import("@/components/layout/main/dashboards/AssignInst"), { ssr: false });

// Certificate Management
const GenerateCertificate = dynamic(() => import("@/components/layout/main/dashboards/GenrateCertificate"), { ssr: false });

// Class Management
const OnlineClass = dynamic(() => import("@/components/layout/main/dashboards/OnlineClass"), { ssr: false });
const LiveDemoClass = dynamic(() => import("@/components/layout/main/dashboards/LiveDemoClass"), { ssr: false });
const DemoClasses = dynamic(() => import("@/components/layout/main/dashboards/DemoClasses"), { ssr: false });
const MainClass = dynamic(() => import("@/components/layout/main/dashboards/MainClass"), { ssr: false });
const AllMainClasses = dynamic(() => import("@/components/layout/main/dashboards/All-Main-Classes"), { ssr: false });

// Corporate Management
const AddCorporateAdmin = dynamic(() => import("@/components/layout/main/dashboards/AddCoorporateAdmin"), { ssr: false });
const CorporateAdminTable = dynamic(() => import("@/components/layout/main/dashboards/CoorporateAdmin_Table"), { ssr: false });

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

interface AdminDashboardLayoutProps {
  userRole: string;
}

const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({ userRole }) => {
  const searchParams = useSearchParams();
  const [currentView, setCurrentView] = useState<string>("overview");
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isDebug, setIsDebug] = useState<boolean>(false);
  const [comingSoonTitle, setComingSoonTitle] = useState<string>("Coming Soon");
  const [componentProps, setComponentProps] = useState<any>({});

  // Check if device is mobile and handle coming soon params
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    // Enable debug mode with query param
    setIsDebug(window.location.search.includes('debug=true'));
    
    // Extract component props from URL params if any
    const params = Object.fromEntries(new URLSearchParams(window.location.search));
    if (params) {
      delete params.debug;
      setComponentProps(params);
    }
    
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
    if (isDebug) {
      console.log("Component props:", componentProps);
    }
  }, [currentView, componentProps, isDebug]);

  // Handle menu item selection
  const handleMenuSelect = (viewName: string) => {
    console.log("Menu selected:", viewName); // Debug log
    setCurrentView(viewName);
    setComponentProps({}); // Reset props when changing views
    if (isMobile) {
      setSidebarOpen(false);
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
        returnPath="/dashboards/admin-dashboard"
      />;
    }
    
    // Helper to check if the current view matches any of the given patterns
    const viewMatches = (patterns: string[]): boolean => {
      const normalizedView = currentView.toLowerCase();
      return patterns.some(pattern => normalizedView.includes(pattern));
    };
    
    // Main Dashboard
    if (viewMatches(['overview', 'dashboard', 'admin-dashboard'])) {
      return <AdminDashboardMain />;
    } 
    
    // Course Management
    else if (viewMatches(['admin-course-categories', 'categories'])) {
      return <CategoryManagement />;
    }
    else if (viewMatches(['add-course', 'admin-addcourse', 'newcourse'])) {
      return <AddCourse />;
    }
    else if (viewMatches(['admin-edit-courses', 'admin-listofcourse', 'listcourse'])) {
      return <ListOfCourses />;
    }
    else if (viewMatches(['update-course'])) {
      return <UpdateCourse {...componentProps} />;
    }
    else if (viewMatches(['preview-detail'])) {
      return <PreviewDetail />;
    }
    else if (viewMatches(['preview-update-detail'])) {
      return <PreviewUpdateDetail />;
    }
    else if (viewMatches(['course-detail'])) {
      return <CourseDetails {...componentProps} />;
    }
    else if (viewMatches(['coursestatus'])) {
      return <DashboardCoursesTab />;
    }
    else if (viewMatches(['admin-add-category'])) {
      return <AdminCategories selectedCategory={null} />;
    }
    
    // Resource & Curriculum Management
    else if (viewMatches(['curriculum-builder', 'assignment-builder', 'resource-builder', 'quiz-builder'])) {
      return <ComingSoonPage 
        title="Course Content Builder" 
        description="This feature is coming soon. You'll be able to build course content here."
        returnPath="/dashboards/admin-dashboard"
      />;
    }
    
    // Student Management
    else if (viewMatches(['admin-view-students', 'studentmange', 'admin-studentmange'])) {
      return <StudentManagement />;
    }
    
    // Instructor Management
    else if (viewMatches(['admin-view-instructors', 'instuctoremange', 'admin-instuctoremange'])) {
      return <InstructorManagement />;
    }
    else if (viewMatches(['add-instructor'])) {
      return <AddInstructor />;
    }
    else if (viewMatches(['assign-instructor', 'admin-assigninstructor'])) {
      return <AssignInstructor />;
    }
    
    // User Management
    else if (viewMatches(['add-user', 'add-student'])) {
      return <ComingSoonPage 
        title="User Management" 
        description="This feature is coming soon. You'll be able to add and manage users here."
        returnPath="/dashboards/admin-dashboard"
      />;
    }
    
    // Certificate Management
    else if (viewMatches(['admin-generatecertificate', 'certificate'])) {
      return <GenerateCertificate />;
    }
    
    // Class Management
    else if (viewMatches(['online-class', 'admin-schonlineclass'])) {
      return <OnlineClass />;
    }
    else if (viewMatches(['live-demo-class'])) {
      return <LiveDemoClass />;
    }
    else if (viewMatches(['demo-classes'])) {
      return <DemoClasses />;
    }
    else if (viewMatches(['main-class'])) {
      return <MainClass />;
    }
    else if (viewMatches(['all-main-classes'])) {
      return <AllMainClasses />;
    }
    
    // Blogs Management
    else if (viewMatches(['admin-blogs', 'blog'])) {
      return <AdminBlogsManagement />;
    }
    else if (viewMatches(['add-blog'])) {
      // For now, return to blog management instead of the problematic component
      setCurrentView('admin-blogs');
      return <AdminBlogsManagement />;
    }
    
    // Forms Management
    else if (viewMatches(['admin-enrollments', 'enrollment-forms'])) {
      return <AdminEnrollmentForm />;
    }
    else if (viewMatches(['admin-get-in-touch', 'contacts'])) {
      return <AdminGetInTouch />;
    }
    else if (viewMatches(['admin-job-applicants', 'applicants'])) {
      return <AdminJobApplicants />;
    }
    
    // Feedback Management
    else if (viewMatches(['admin-feedback-and-complaints', 'complaints'])) {
      return <AdminFeedbackComplaints />;
    }
    
    // Placement Management
    else if (viewMatches(['admin-placements', 'corporate'])) {
      return <AdminPlacements />;
    }
    
    // Corporate Management
    else if (viewMatches(['add-corporate-admin'])) {
      return <AddCorporateAdmin />;
    }
    else if (viewMatches(['corporate-admin-table'])) {
      return <CorporateAdminTable />;
    }
    
    else if (isDebug) {
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
        description="This admin feature is under development and will be available soon!"
        returnPath="/dashboards/admin-dashboard"
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
            isAdmin={true}
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
                {Object.keys(componentProps).length > 0 && (
                  <span className="block mt-1">
                    Props: {JSON.stringify(componentProps)}
                  </span>
                )}
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

export default AdminDashboardLayout;
