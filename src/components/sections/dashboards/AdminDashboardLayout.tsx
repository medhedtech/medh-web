"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import SidebarDashboard from "@/components/sections/sub-section/dashboards/SidebarDashboard";
import DashboardNavbar from "@/components/sections/dashboards/DashboardNavbar";
import ComingSoonPage from "@/components/shared/others/ComingSoonPage";
import { useSearchParams } from "next/navigation";
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
  DollarSign
} from "lucide-react";

// Dynamically import dashboard components
const AdminDashboardMain = dynamic(() => import("@/components/layout/main/dashboards/AdminDashboardMain"), { 
  ssr: false,
  loading: () => <div className="flex min-h-[60vh] items-center justify-center"><div className="animate-pulse text-primary-500">Loading overview...</div></div>
});

// New Course Fee Management section
const AdminCourseFee = dynamic(() => import("@/components/layout/main/dashboards/AdminCourseFee"), { ssr: false });

// Currency Management section
const AdminCurrency = dynamic(() => import("@/components/layout/main/dashboards/AdminCurrency"), { ssr: false });

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

// Define SubItem interface to match SidebarDashboard
interface SubItem {
  name: string;
  path?: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
  onClick?: () => void;
}

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
  const [activeMenu, setActiveMenu] = useState<string>("Dashboard");
  const [activeSubItems, setActiveSubItems] = useState<SubItem[]>([]);
  const [userName, setUserName] = useState<string>("Admin User");

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
      // Check if there's a specific view requested in the URL
      if (params.view) {
        setCurrentView(params.view);
      }
      
      delete params.debug;
      delete params.view;
      setComponentProps(params);
    }
    
    // Handle coming soon parameters
    const title = searchParams?.get('title');
    if (title) {
      setComingSoonTitle(title);
      setCurrentView("comingsoon");
    }

    // Get user name from localStorage if available
    if (typeof window !== 'undefined') {
      const storedUserName = localStorage.getItem("full_name");
      if (storedUserName) {
        setUserName(storedUserName);
      }
    }
    
    return () => window.removeEventListener("resize", checkMobile);
  }, [searchParams]);

  // Define predefined admin sidebar navigation items
  // These will be available for both the sidebar and navbar to use
  const adminNavItems = {
    dashboard: [
      {
        name: "Overview",
        path: "/dashboards/admin-dashboard",
        icon: <LayoutDashboard className="w-4 h-4" />,
        onClick: () => {
          setCurrentView("overview");
        }
      },
      {
        name: "My Profile",
        path: "/dashboards/admin-profile",
        icon: <User className="w-4 h-4" />,
        onClick: () => {
          setCurrentView("admin-profile");
        }
      },
      {
        name: "Currency Settings",
        icon: <DollarSign className="w-4 h-4" />,
        onClick: () => {
          setCurrentView("admin-currency");
        }
      },
      {
        name: "Notifications",
        path: "/dashboards/admin-notifications",
        icon: <MessageCircle className="w-4 h-4" />,
        comingSoon: true
      }
    ],
    courseManagement: [
      {
        name: "Course Categories",
        icon: <FolderTree className="w-4 h-4" />,
        onClick: () => {
          setCurrentView("admin-course-categories");
        }
      },
      {
        name: "Create New Course",
        icon: <Plus className="w-4 h-4" />,
        onClick: () => {
          setCurrentView("add-course");
        }
      },
      {
        name: "Edit/Archive Courses",
        icon: <Pencil className="w-4 h-4" />,
        onClick: () => {
          setCurrentView("admin-listofcourse");
        }
      },
      {
        name: "Course Fees",
        icon: <CreditCard className="w-4 h-4" />,
        onClick: () => {
          setCurrentView("admin-course-fee");
        }
      },
      {
        name: "Course Status",
        icon: <FileCheck className="w-4 h-4" />,
        onClick: () => {
          setCurrentView("coursestatus");
        }
      },
      {
        name: "Add Category",
        icon: <Plus className="w-4 h-4" />,
        onClick: () => {
          setCurrentView("admin-add-category");
        }
      }
    ],
    studentManagement: [
      {
        name: "View All Students",
        icon: <Users className="w-4 h-4" />,
        onClick: () => {
          setCurrentView("admin-studentmange");
        }
      },
      {
        name: "Add New Student",
        icon: <Plus className="w-4 h-4" />,
        onClick: () => {
          setCurrentView("add-student");
        }
      },
      {
        name: "Attendance",
        icon: <CheckSquare className="w-4 h-4" />,
        comingSoon: true
      }
    ],
    instructorManagement: [
      {
        name: "View All Instructors",
        icon: <Users className="w-4 h-4" />,
        onClick: () => {
          setCurrentView("admin-instuctoremange");
        }
      },
      {
        name: "Add New Instructor",
        icon: <Plus className="w-4 h-4" />,
        onClick: () => {
          setCurrentView("add-instructor");
        }
      },
      {
        name: "Assign Instructor",
        icon: <FileCheck className="w-4 h-4" />,
        onClick: () => {
          setCurrentView("admin-assigninstructor");
        }
      }
    ],
    certificates: [
      {
        name: "Generate Certificate",
        icon: <Award className="w-4 h-4" />,
        onClick: () => {
          setCurrentView("admin-generatecertificate");
        }
      },
      {
        name: "Certificate Templates",
        icon: <FileText className="w-4 h-4" />,
        comingSoon: true
      }
    ],
    onlineClass: [
      {
        name: "Schedule Online Class",
        icon: <Calendar className="w-4 h-4" />,
        onClick: () => {
          setCurrentView("online-class");
        }
      },
      {
        name: "Demo Classes",
        icon: <BookOpen className="w-4 h-4" />,
        onClick: () => {
          setCurrentView("demo-classes");
        }
      },
      {
        name: "Live Demo Class",
        icon: <Calendar className="w-4 h-4" />,
        onClick: () => {
          setCurrentView("live-demo-class");
        }
      },
      {
        name: "Main Class",
        icon: <BookOpen className="w-4 h-4" />,
        onClick: () => {
          setCurrentView("main-class");
        }
      },
      {
        name: "All Main Classes",
        icon: <Users className="w-4 h-4" />,
        onClick: () => {
          setCurrentView("all-main-classes");
        }
      }
    ],
    blogManagement: [
      {
        name: "All Blogs",
        icon: <FileText className="w-4 h-4" />,
        onClick: () => {
          setCurrentView("admin-blogs");
        }
      },
      {
        name: "Add Blog",
        icon: <Plus className="w-4 h-4" />,
        onClick: () => {
          setCurrentView("add-blog");
        }
      }
    ],
    formsManagement: [
      {
        name: "Enrollment Forms",
        icon: <FileText className="w-4 h-4" />,
        onClick: () => {
          setCurrentView("admin-enrollments");
        }
      },
      {
        name: "Contact Queries",
        icon: <MessageCircle className="w-4 h-4" />,
        onClick: () => {
          setCurrentView("admin-get-in-touch");
        }
      },
      {
        name: "Job Applications",
        icon: <Users className="w-4 h-4" />,
        onClick: () => {
          setCurrentView("admin-job-applicants");
        }
      }
    ],
    feedbackManagement: [
      {
        name: "View Feedback",
        icon: <MessageCircle className="w-4 h-4" />,
        onClick: () => {
          setCurrentView("admin-feedback-and-complaints");
        }
      }
    ],
    corporateManagement: [
      {
        name: "Placements",
        icon: <Building className="w-4 h-4" />,
        onClick: () => {
          setCurrentView("admin-placements");
        }
      },
      {
        name: "Add Corporate Admin",
        icon: <Plus className="w-4 h-4" />,
        onClick: () => {
          setCurrentView("add-corporate-admin");
        }
      },
      {
        name: "Corporate Admin Table",
        icon: <Users className="w-4 h-4" />,
        onClick: () => {
          setCurrentView("corporate-admin-table");
        }
      }
    ]
  };

  // Handle menu item selection from sidebar
  const handleMenuSelect = (menuName: string, items: SubItem[] = []) => {
    if (isDebug) {
      console.log("Menu selected:", menuName); // Debug log
    }
    
    setActiveMenu(menuName);
    
    // Use predefined items based on menu name if available, otherwise use provided items
    let menuItems: SubItem[] = [];
    
    switch(menuName) {
      case "Dashboard":
        menuItems = adminNavItems.dashboard;
        break;
      case "Course Setup":
        menuItems = adminNavItems.courseManagement;
        break;
      case "Student Management":
        menuItems = adminNavItems.studentManagement;
        break;
      case "Instructor Management":
        menuItems = adminNavItems.instructorManagement;
        break;
      case "Certificate Management":
        menuItems = adminNavItems.certificates;
        break;
      case "Online Class Management":
      case "timetable":
        menuItems = adminNavItems.onlineClass;
        break;
      case "Blogs Management":
        menuItems = adminNavItems.blogManagement;
        break;
      case "Form Management":
      case "queries":
        menuItems = adminNavItems.formsManagement;
        break;
      case "Feedback & Grievances":
        menuItems = adminNavItems.feedbackManagement;
        break;
      case "Corporate Management":
        menuItems = adminNavItems.corporateManagement;
        break;
      default:
        // Use items passed from sidebar if no predefined items exist
        menuItems = items;
    }
    
    setActiveSubItems(menuItems);
    
    // Default behavior - if items are available and no specific one is clicked,
    // navigate to the first item's path or trigger its onClick
    if (menuItems.length > 0 && !items.find(item => item.onClick)) {
      const firstItem = menuItems[0];
      if (firstItem.onClick) {
        firstItem.onClick();
      } else if (firstItem.path) {
        // Extract view name from path
        const pathParts = firstItem.path.split('/');
        const viewFromPath = pathParts[pathParts.length - 1];
        setCurrentView(viewFromPath);
      } else {
        // Default view based on menu name
        setCurrentView(menuName.toLowerCase().replace(/\s+/g, '-'));
      }
    }
    
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Handle sub-item click from the navbar
  const handleSubItemClick = (subItem: SubItem) => {
    if (subItem.comingSoon) {
      return;
    }
    
    if (subItem.onClick) {
      subItem.onClick();
    } else if (subItem.path) {
      // Extract view name from path
      const pathParts = subItem.path.split('/');
      const viewFromPath = pathParts[pathParts.length - 1];
      setCurrentView(viewFromPath);
    }
    
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Check if a sub-item is active
  const isSubItemActive = (subItem: SubItem): boolean => {
    if (!currentView) return false;
    
    // If the item has an onClick that sets a specific view, check if current view matches
    const normalizedCurrentView = currentView.toLowerCase();
    
    // Special case for specific views from onClick handlers
    if (normalizedCurrentView === "overview" && subItem.name === "Overview") {
      return true;
    }
    
    if (normalizedCurrentView === "admin-course-categories" && subItem.name === "Course Categories") {
      return true;
    }
    
    if (normalizedCurrentView === "add-course" && subItem.name === "Create New Course") {
      return true;
    }
    
    if (normalizedCurrentView === "admin-listofcourse" && subItem.name === "Edit/Archive Courses") {
      return true;
    }
    
    // Check for path match
    if (subItem.path) {
      const pathParts = subItem.path.split('/');
      const viewFromPath = pathParts[pathParts.length - 1];
      return normalizedCurrentView === viewFromPath.toLowerCase();
    }
    
    return false;
  };

  // Check if the current view matches any of the given patterns
  const viewMatches = (patterns: string[]): boolean => {
    if (!currentView) return false;
    
    // If URL has view parameter, check it first
    const urlParams = new URLSearchParams(window.location.search);
    const urlView = urlParams.get('view');
    
    if (urlView) {
      const normalizedUrlView = urlView.toLowerCase();
      return patterns.some(pattern => normalizedUrlView.includes(pattern.toLowerCase()));
    }
    
    // Otherwise check the currentView state
    const normalizedView = currentView.toLowerCase();
    return patterns.some(pattern => normalizedView.includes(pattern.toLowerCase()));
  };

  // Render component based on current view
  const renderComponent = () => {
    if (isDebug) {
      console.log("Rendering component for view:", currentView);
    }
    
    // Handle coming soon page
    if (currentView === "comingsoon") {
      return <ComingSoonPage 
        title={comingSoonTitle} 
        description="We're working on this feature. It will be available soon!"
        returnPath="/dashboards/admin-dashboard"
      />;
    }
    
    // Main Dashboard
    if (viewMatches(['overview', 'dashboard'])) {
      return <AdminDashboardMain />;
    } 
    
    // Currency Management
    else if (viewMatches(['admin-currency', 'currency-settings'])) {
      return <AdminCurrency />;
    }
    
    // Course Management
    else if (viewMatches(['admin-course-categories', 'categories'])) {
      return <CategoryManagement />;
    }
    else if (viewMatches(['add-course', 'admin-addcourse', 'newcourse'])) {
      return <AddCourse />;
    }
    else if (viewMatches(['admin-listofcourse', 'listcourse', 'edit-courses'])) {
      return <ListOfCourses />;
    }
    else if (viewMatches(['admin-course-fee', 'course-fees', 'pricing'])) {
      return <AdminCourseFee />;
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
    
    // Student Management
    else if (viewMatches(['admin-studentmange', 'studentmange', 'view-students'])) {
      return <StudentManagement />;
    }
    else if (viewMatches(['add-student'])) {
      return <AddStudent />;
    }
    
    // Instructor Management
    else if (viewMatches(['admin-instuctoremange', 'instuctoremange', 'view-instructors'])) {
      return <InstructorManagement />;
    }
    else if (viewMatches(['add-instructor'])) {
      return <AddInstructor />;
    }
    else if (viewMatches(['admin-assigninstructor', 'assign-instructor'])) {
      return <AssignInstructor />;
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
      return <AdminBlogsManagement />; // Redirect to blogs management instead
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
    else if (viewMatches(['admin-feedback-and-complaints', 'complaints', 'feedback'])) {
      return <AdminFeedbackComplaints />;
    }
    
    // Placement Management
    else if (viewMatches(['admin-placements', 'corporate', 'placement'])) {
      return <AdminPlacements />;
    }
    
    // Corporate Management
    else if (viewMatches(['add-corporate-admin'])) {
      return <AddCorporateAdmin />;
    }
    else if (viewMatches(['corporate-admin-table'])) {
      return <CorporateAdminTable />;
    }
    
    // Fallback for debug mode
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
        title={`Feature: ${currentView}`}
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
            userRole={userRole || "admin"}
            userName={userName}
            userEmail=""
            userImage=""
            userNotifications={0}
            userSettings={{
              theme: "light",
              language: "en",
              notifications: true
            }}
            onMenuClick={handleMenuSelect}
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
          {/* Dashboard Navbar */}
          {activeSubItems && activeSubItems.length > 0 && (
            <DashboardNavbar
              activeMenu={activeMenu}
              subItems={activeSubItems}
              onItemClick={handleSubItemClick}
              currentView={currentView}
              isSubItemActive={isSubItemActive}
            />
          )}

          <div className="p-6">
            {isDebug && (
              <div className="mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-lg text-xs">
                Debug: Current View = "{currentView}"
                <div className="mt-1">Active Menu = "{activeMenu}"</div>
                <div className="mt-1">Subitems Count = {activeSubItems?.length || 0}</div>
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
