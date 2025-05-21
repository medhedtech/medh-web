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
import AdminNotifications from "@/components/layout/main/dashboards/AdminNotifications";
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
  Menu
} from "lucide-react";

// Context for dashboard state management
export const AdminDashboardContext = createContext<any>(null);

// Dynamically import dashboard components with loading states
const AdminDashboardMain = dynamic(() => import("@/components/layout/main/dashboards/AdminDashboardMain"), { 
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

// Feedback & Support
const AdminFeedbackComplaints = dynamic(() => import("@/components/layout/main/dashboards/Admin-Feedback-Complaints"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="form" />
});

// Placement Management
const AdminPlacements = dynamic(() => import("@/components/layout/main/dashboards/AdminPlacements"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="dashboard" />
});

// Blog Management
const AdminBlogsManagement = dynamic(() => import("@/components/layout/main/dashboards/AdminBlogs"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="default" />
});
const AddBlog = dynamic(() => import("@/components/layout/main/dashboards/AddBlogs"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="form" />
});

// Course Management
const AddCourse = dynamic(() => import("@/components/layout/main/dashboards/AddCourse"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="form" />
});
const UpdateCourse = dynamic(() => import("@/components/layout/main/dashboards/UpdateCourse"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="form" />
});
const ListOfCourses = dynamic(() => import("@/components/layout/main/dashboards/ListOfCourse"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="courses" />
});
const DashboardCoursesTab = dynamic(() => import("@/components/shared/dashboards/DashboardCoursesTab"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="default" />
});
const AdminCategories = dynamic(() => import("@/components/layout/main/dashboards/AddCategories"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="form" />
});
const CategoryManagement = dynamic(() => import("@/components/layout/main/dashboards/CateogiresManage"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="default" />
});
const CourseDetails = dynamic(() => import("@/components/layout/main/dashboards/CourseDetails"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="default" />
});
const PreviewDetail = dynamic(() => import("@/components/layout/main/dashboards/Previewdetail"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="default" />
});
const PreviewUpdateDetail = dynamic(() => import("@/components/layout/main/dashboards/PreviewUpdateDetail"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="default" />
});

// Resource & Curriculum Management
const CurriculumBuilder = dynamic(() => import("@/components/layout/main/dashboards/CurriculumBuilder"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="form" />
});
const ResourceBuilder = dynamic(() => import("@/components/layout/main/dashboards/ResourceBuilder"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="form" />
});
const AssignmentBuilder = dynamic(() => import("@/components/layout/main/dashboards/AssignmentBuilder"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="form" />
});
const QuizBuilder = dynamic(() => import("@/components/layout/main/dashboards/QuizBuilder"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="quiz" />
});

// Forms Management
const AdminEnrolments = dynamic(() => import("@/components/layout/main/dashboards/AdminEnrollent-Form"), {
  loading: () => <SkeletonLoader type="dashboard" />,
});
const AdminGetInTouch = dynamic(() => import("@/components/layout/main/dashboards/AdminGetInTouch"), {
  loading: () => <SkeletonLoader type="dashboard" />,
});
const AdminJobApplicants = dynamic(() => import("@/components/layout/main/dashboards/AdminJobApplicants"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="form" />
});

// User Management
const StudentManagement = dynamic(() => import("@/components/layout/main/dashboards/StudentManagement"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="default" />
});
const AddStudent = dynamic(() => import("@/components/layout/main/dashboards/AddStudentForm").then(mod => {
  // Wrap the component to provide the required onCancel prop
  return {
    default: (props: any) => <mod.default onCancel={() => {}} {...props} />
  };
}), { 
  ssr: false,
  loading: () => <SkeletonLoader type="form" />
});
const InstructorManagement = dynamic(() => import("@/components/layout/main/dashboards/InstructorManage"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="default" />
});
const AddInstructor = dynamic(() => import("@/components/layout/main/dashboards/AddInstructor"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="form" />
});
const AddUser = dynamic(() => import("@/components/layout/main/dashboards/AddUserForm"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="form" />
});
const AssignInstructor = dynamic(() => import("@/components/layout/main/dashboards/AssignInst"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="form" />
});

// Certificate Management
const GenerateCertificate = dynamic(() => import("@/components/layout/main/dashboards/GenrateCertificate"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="certificates" />
});

// Class Management
const OnlineClass = dynamic(() => import("@/components/layout/main/dashboards/OnlineClass"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="calendar" />
});
const LiveDemoClass = dynamic(() => import("@/components/layout/main/dashboards/LiveDemoClass"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="calendar" />
});
const DemoClasses = dynamic(() => import("@/components/layout/main/dashboards/DemoClasses"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="calendar" />
});
const MainClass = dynamic(() => import("@/components/layout/main/dashboards/MainClass"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="calendar" />
});
const AllMainClasses = dynamic(() => import("@/components/layout/main/dashboards/All-Main-Classes"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="calendar" />
});

// Corporate Management
const AddCorporateAdmin = dynamic(() => import("@/components/layout/main/dashboards/AddCoorporateAdmin"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="form" />
});
const CorporateAdminTable = dynamic(() => import("@/components/layout/main/dashboards/CoorporateAdmin_Table"), { 
  ssr: false,
  loading: () => <SkeletonLoader type="default" />
});

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
    y: 0, 
    marginLeft: '245px',
    transition: { 
      type: "spring",
      stiffness: 150,
      damping: 20,
      duration: 0.3 
    }
  },
  collapsed: { 
    opacity: 1, 
    y: 0, 
    marginLeft: '68px',
    transition: { 
      type: "spring",
      stiffness: 150,
      damping: 20,
      duration: 0.3 
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { 
      duration: 0.2 
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

// Define SubItem interface to match SidebarDashboard
interface SubItem {
  name: string;
  path?: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}

interface AdminDashboardLayoutProps {
  userRole: string;
  children?: React.ReactNode;
  activeMenu?: string | null;
  activeSubItems?: SubItem[];
  onMenuClick?: (menuName: string, items: SubItem[]) => void;
}

// Add this utility function outside the component to make it cleaner
const getComponentForView = (
  view: string, 
  componentProps: any = {}, 
  isDebug: boolean = false
) => {
  // Helper function to check if view matches patterns
  const viewMatches = (patterns: string[]): boolean => {
    if (!view) return false;
    const normalizedView = view.toLowerCase();
    return patterns.some(pattern => normalizedView.includes(pattern.toLowerCase()));
  };
  
  try {
    // Main Dashboard
    if (viewMatches(['overview', 'dashboard'])) {
      return { component: AdminDashboardMain, props: componentProps };
    } 
    
    // Currency Management
    else if (viewMatches(['admin-currency', 'currency-settings'])) {
      return { component: AdminCurrency, props: componentProps };
    }
    
    // Course Management
    else if (viewMatches(['admin-course-categories', 'categories'])) {
      return { component: CategoryManagement, props: componentProps };
    }
    else if (viewMatches(['add-course', 'admin-addcourse', 'newcourse'])) {
      return { component: AddCourse, props: componentProps };
    }
    else if (viewMatches(['admin-listofcourse', 'listcourse', 'edit-courses'])) {
      return { component: ListOfCourses, props: componentProps };
    }
    else if (viewMatches(['admin-course-fee', 'course-fees', 'pricing'])) {
      return { component: AdminCourseFee, props: componentProps };
    }
    else if (viewMatches(['update-course'])) {
      return { component: UpdateCourse, props: componentProps };
    }
    else if (viewMatches(['preview-detail'])) {
      return { component: PreviewDetail, props: componentProps };
    }
    else if (viewMatches(['preview-update-detail'])) {
      return { component: PreviewUpdateDetail, props: componentProps };
    }
    else if (viewMatches(['course-detail'])) {
      return { component: CourseDetails, props: componentProps };
    }
    else if (viewMatches(['coursestatus'])) {
      return { component: DashboardCoursesTab, props: componentProps };
    }
    else if (viewMatches(['admin-add-category'])) {
      return { component: AdminCategories, props: { selectedCategory: null, ...componentProps } };
    }
    
    // Student Management
    else if (viewMatches(['admin-studentmange', 'studentmange', 'view-students'])) {
      return { component: StudentManagement, props: componentProps };
    }
    else if (viewMatches(['add-student'])) {
      return { component: AddStudent, props: componentProps };
    }
    
    // Instructor Management
    else if (viewMatches(['admin-instuctoremange', 'instuctoremange', 'view-instructors'])) {
      return { component: InstructorManagement, props: componentProps };
    }
    else if (viewMatches(['add-instructor'])) {
      return { component: AddInstructor, props: componentProps };
    }
    else if (viewMatches(['admin-assigninstructor', 'assign-instructor'])) {
      return { component: AssignInstructor, props: componentProps };
    }
    
    // Certificate Management
    else if (viewMatches(['admin-generatecertificate', 'certificate'])) {
      return { component: GenerateCertificate, props: componentProps };
    }
    
    // Class Management
    else if (viewMatches(['online-class', 'admin-schonlineclass'])) {
      return { component: OnlineClass, props: componentProps };
    }
    else if (viewMatches(['live-demo-class'])) {
      return { component: LiveDemoClass, props: componentProps };
    }
    else if (viewMatches(['demo-classes'])) {
      return { component: DemoClasses, props: componentProps };
    }
    else if (viewMatches(['main-class'])) {
      return { component: MainClass, props: componentProps };
    }
    else if (viewMatches(['all-main-classes'])) {
      return { component: AllMainClasses, props: componentProps };
    }
    
    // Blogs Management
    else if (viewMatches(['admin-blogs', 'blog'])) {
      return { component: AdminBlogsManagement, props: componentProps };
    }
    else if (viewMatches(['add-blog'])) {
      return { component: AdminBlogsManagement, props: componentProps };
    }
    
    // Forms Management
    else if (viewMatches(['admin-enrollments', 'enrollment-forms'])) {
      return { component: AdminEnrolments, props: componentProps };
    }
    else if (viewMatches(['admin-get-in-touch', 'contacts'])) {
      return { component: AdminGetInTouch, props: componentProps };
    }
    else if (viewMatches(['admin-job-applicants', 'applicants'])) {
      return { component: AdminJobApplicants, props: componentProps };
    }
    
    // Feedback Management
    else if (viewMatches(['admin-feedback-and-complaints', 'complaints', 'feedback'])) {
      return { component: AdminFeedbackComplaints, props: componentProps };
    }
    
    // Placement Management
    else if (viewMatches(['admin-placements', 'corporate', 'placement'])) {
      return { component: AdminPlacements, props: componentProps };
    }
    
    // Corporate Management
    else if (viewMatches(['add-corporate-admin'])) {
      return { component: AddCorporateAdmin, props: componentProps };
    }
    else if (viewMatches(['corporate-admin-table'])) {
      return { component: CorporateAdminTable, props: componentProps };
    }
    
    // Notifications
    else if (viewMatches(['notifications'])) {
      return { component: AdminNotifications, props: componentProps };
    }
    
    // No matching component found
    return { component: null, props: {} };
  } catch (error) {
    console.error("Error finding component for view:", error);
    return { component: null, props: {}, error };
  }
};

const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({ 
  userRole, 
  children,
  activeMenu: propActiveMenu,
  activeSubItems: propActiveSubItems,
  onMenuClick: propOnMenuClick
}) => {
  const searchParams = useSearchParams();
  
  // Use screen size hook for responsive design
  const { isMobile, isTablet, isDesktop, current: breakpoint } = useScreenSize();
  const contentRef = useRef<HTMLDivElement>(null);
  
  // State for managing content
  const [currentView, setCurrentView] = useState<string>("overview");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(!isMobile);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(!isMobile);
  const [isDebug, setIsDebug] = useState<boolean>(false);
  const [comingSoonTitle, setComingSoonTitle] = useState<string>("Coming Soon");
  const [componentProps, setComponentProps] = useState<any>({});
  const [activeMenu, setActiveMenu] = useState<string>(propActiveMenu || "Dashboard");
  const [activeSubItems, setActiveSubItems] = useState<SubItem[]>(propActiveSubItems || []);
  const [userName, setUserName] = useState<string>("Admin User");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contentPadding, setContentPadding] = useState<string>("0px");

  // Use effect to sync with props if they change
  useEffect(() => {
    if (propActiveMenu) {
      setActiveMenu(propActiveMenu);
    }
    if (propActiveSubItems) {
      setActiveSubItems(propActiveSubItems);
    }
  }, [propActiveMenu, propActiveSubItems]);

  // Handle content padding adjustment based on sidebar state
  useEffect(() => {
    // If sidebar is open but not expanded (in collapsed icon-only mode) or closed
    const basePadding = isMobile ? "0px" : isSidebarExpanded ? "245px" : "68px";
    setContentPadding(basePadding);
  }, [isSidebarExpanded, sidebarOpen, isMobile]);

  // Check if device is mobile and handle coming soon params
  useEffect(() => {
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

    // Handle hash-based navigation
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setCurrentView(hash);
        // Find matching menu based on hash
        const findMenuForHash = (hash: string) => {
          // Admin-specific routes
          if (hash === 'admin-currency') {
            setActiveMenu('Location & Currency');
          } else if (hash.includes('admin-course')) {
            setActiveMenu('Course Setup');
          }
        };
        findMenuForHash(hash);
      }
    }

    // Get user name from localStorage if available
    if (typeof window !== 'undefined') {
      const storedUserName = localStorage.getItem("full_name");
      if (storedUserName) {
        setUserName(storedUserName);
      }
    }
    
    // Set sidebar state based on screen size
    setSidebarOpen(!isMobile);
    setIsSidebarExpanded(!isMobile);
  }, [searchParams, isMobile]);

  // Create context value memo for performance
  const contextValue = useMemo(() => ({
    currentView,
    setCurrentView,
    isMobile,
    isTablet,
    isDesktop,
    breakpoint,
    sidebarOpen,
    setSidebarOpen,
    isSidebarExpanded,
    setIsSidebarExpanded,
    activeMenu,
    setActiveMenu,
    isLoading,
    setIsLoading,
    componentProps,
    setComponentProps
  }), [
    currentView, isMobile, isTablet, isDesktop, breakpoint, 
    sidebarOpen, isSidebarExpanded, activeMenu, isLoading, componentProps
  ]);

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash) {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
          setIsLoading(true);
          setCurrentView(hash);
          
          // Find matching menu based on hash
          if (hash === 'admin-currency') {
            setActiveMenu('Location & Currency');
          } else if (hash.includes('admin-course')) {
            setActiveMenu('Course Setup');
          }
          
          setTimeout(() => setIsLoading(false), 500);
        }
      }
    };
    
    // Add event listener for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

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

  // Toggle sidebar with accessibility support
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    if (isMobile && !sidebarOpen) {
      // When opening on mobile, always show expanded sidebar for better usability
      setIsSidebarExpanded(true);
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
      
      // Redirect to login
      window.location.href = "/login";
    } catch (error) {
      console.error("Error during logout:", error);
      // If error, still try to redirect
      window.location.href = "/login";
    }
  };

  // Handle sidebar expansion state change
  const handleSidebarExpansionChange = (expanded: boolean) => {
    setIsSidebarExpanded(expanded);
  };

  // Handle sub-item click from the navbar
  const handleSubItemClick = (subItem: SubItem) => {
    if (subItem.comingSoon) {
      setComingSoonTitle(subItem.name);
      setCurrentView("comingsoon");
      return;
    }
    
    setIsLoading(true);
    
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
    
    // Simulate loading time
    setTimeout(() => setIsLoading(false), 500);
  };

  // Define predefined admin sidebar navigation items
  // These will be available for both the sidebar and navbar to use
  const adminNavItems = {
    dashboard: [
      {
        name: "Overview",
        path: "/dashboards/admin",
        icon: <LayoutDashboard className="w-4 h-4" />,
        ariaLabel: "Dashboard overview",
        onClick: () => {
          setIsLoading(true);
          setCurrentView("overview");
          setTimeout(() => setIsLoading(false), 500);
        }
      },
      {
        name: "My Profile",
        path: "/dashboards/admin-profile",
        icon: <User className="w-4 h-4" />,
        ariaLabel: "Admin profile",
        onClick: () => {
          setIsLoading(true);
          setCurrentView("admin-profile");
          setTimeout(() => setIsLoading(false), 500);
        }
      },
      {
        name: "Currency Settings",
        icon: <DollarSign className="w-4 h-4" />,
        ariaLabel: "Currency settings",
        onClick: () => {
          setIsLoading(true);
          setCurrentView("admin-currency");
          setTimeout(() => setIsLoading(false), 500);
        }
      },
      {
        name: "Notifications",
        path: "/dashboards/admin#notifications",
        icon: <MessageCircle className="w-4 h-4" />,
        ariaLabel: "Notifications",
        onClick: () => {
          setIsLoading(true);
          setCurrentView("notifications");
          setTimeout(() => setIsLoading(false), 500);
        }
      }
    ],
    courseManagement: [
      {
        name: "Course Categories",
        icon: <FolderTree className="w-4 h-4" />,
        ariaLabel: "Course categories",
        onClick: () => {
          setIsLoading(true);
          setCurrentView("admin-course-categories");
          setTimeout(() => setIsLoading(false), 500);
        }
      },
      {
        name: "Create New Course",
        icon: <Plus className="w-4 h-4" />,
        ariaLabel: "Create new course",
        onClick: () => {
          setIsLoading(true);
          setCurrentView("add-course");
          setTimeout(() => setIsLoading(false), 500);
        }
      },
      {
        name: "Edit/Archive Courses",
        icon: <Pencil className="w-4 h-4" />,
        ariaLabel: "Edit or archive courses",
        onClick: () => {
          setIsLoading(true);
          setCurrentView("admin-listofcourse");
          setTimeout(() => setIsLoading(false), 500);
        }
      },
      {
        name: "Course Fees",
        icon: <CreditCard className="w-4 h-4" />,
        ariaLabel: "Course fee management",
        onClick: () => {
          setIsLoading(true);
          setCurrentView("admin-course-fee");
          setTimeout(() => setIsLoading(false), 500);
        }
      },
      {
        name: "Course Status",
        icon: <FileCheck className="w-4 h-4" />,
        ariaLabel: "Course status overview",
        onClick: () => {
          setIsLoading(true);
          setCurrentView("coursestatus");
          setTimeout(() => setIsLoading(false), 500);
        }
      },
      {
        name: "Add Category",
        icon: <Plus className="w-4 h-4" />,
        ariaLabel: "Add new course category",
        onClick: () => {
          setIsLoading(true);
          setCurrentView("admin-add-category");
          setTimeout(() => setIsLoading(false), 500);
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
    
    setIsLoading(true);
    
    // Call the provided onMenuClick if available
    if (propOnMenuClick) {
      propOnMenuClick(menuName, items);
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
    
    // Simulate loading time
    setTimeout(() => setIsLoading(false), 500);
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

  // Render component based on current view with error boundary and better loading states
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
      console.log("Rendering component for view:", currentView);
    }
    
    // Handle coming soon page
    if (currentView === "comingsoon") {
      return <ComingSoonPage 
        title={comingSoonTitle} 
        description="We're working on this feature. It will be available soon!"
        returnPath="/dashboards/admin"
      />;
    }
    
    try {
      // Get the component using our utility function
      const { component: Component, props, error } = getComponentForView(currentView, componentProps, isDebug);
      
      // Handle no matching component
      if (!Component) {
        if (error) {
          // If there was an error finding a component
          return (
            <div className="p-8 text-center">
              <h2 className="text-xl font-medium mb-4 text-red-600">Something went wrong</h2>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-4">
                <p className="text-red-700 dark:text-red-300">
                  {error instanceof Error ? error.message : "An error occurred finding the component"}
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
        
        if (isDebug) {
          // Show debug info in debug mode
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
            title={`Feature: ${currentView}`}
            description="This admin feature is under development and will be available soon!"
            returnPath="/dashboards/admin"
          />;
        }
      }
      
      // Render the actual component with its props
      return <Component {...props} />;
      
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
    <AdminDashboardContext.Provider value={contextValue}>
      <div className="relative bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col pt-16 lg:pt-20">
        {/* Dashboard Navbar - positioned at the top, full width */}
        <DashboardNavbar 
          onMobileMenuToggle={toggleSidebar}
          isScrolled={false}
        />
        
        {/* Main layout with sidebar and content */}
        <div className="flex flex-1 relative">
          {/* Sidebar - fixed position */}
          <div 
            className={`${isMobile ? 'fixed z-40' : 'fixed lg:relative'} h-full top-16 lg:top-20`}
            style={{ height: isMobile ? 'calc(100% - 70px)' : 'calc(100vh - 80px)' }}
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
              onMenuClick={handleMenuSelect}
              isOpen={sidebarOpen}
              onOpenChange={setSidebarOpen}
              isExpanded={isSidebarExpanded}
              onExpandedChange={handleSidebarExpansionChange}
            />
          </div>

          {/* Mobile backdrop overlay */}
          <AnimatePresence>
            {isMobile && sidebarOpen && (
              <motion.div
                key="backdrop"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={backdropVariants}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
                onClick={() => setSidebarOpen(false)}
                aria-hidden="true"
              />
            )}
          </AnimatePresence>

          {/* Main Content Area - only this should scroll */}
          <div 
            ref={contentRef}
            className="flex-1 overflow-y-auto scroll-smooth"
            style={{
              marginLeft: isMobile ? '0px' : isSidebarExpanded ? '245px' : '68px',
              width: "100%",
              transition: "margin-left 0.3s ease"
            }}
          >
            {/* Content with proper padding */}
            <div className="p-4 md:p-6">
              {/* Debug info */}
              {isDebug && (
                <div className="mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-lg text-xs">
                  Debug: Current View = "{currentView}" | Breakpoint = "{breakpoint}" | 
                  Sidebar Open = {sidebarOpen ? "true" : "false"} | 
                  Sidebar Expanded = {isSidebarExpanded ? "true" : "false"} |
                  Loading = {isLoading ? "true" : "false"}
                  <div className="mt-1">Active Menu = "{activeMenu}"</div>
                  <div className="mt-1">Subitems Count = {activeSubItems?.length || 0}</div>
                  {Object.keys(componentProps).length > 0 && (
                    <span className="block mt-1">
                      Props: {JSON.stringify(componentProps)}
                    </span>
                  )}
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
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentView}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden elevation-2"
                >
                  {children ? children : renderComponent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
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
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
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
    </AdminDashboardContext.Provider>
  );
};

export default AdminDashboardLayout;
