"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowUpDown,
  Award,
  BarChart,
  BarChart2,
  Bell,
  Book,
  BookOpen,
  Briefcase,
  Building,
  Calendar,
  CalendarClock,
  CalendarDays,
  CheckCircle,
  CheckSquare,
  Clipboard,
  ClipboardList,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Filter,
  FolderOpen,
  FolderTree,
  Folders,
  Gift,
  Globe,
  GraduationCap,
  Heart,
  HelpCircle,
  History,
  Key,
  LayoutGrid,
  LineChart,
  ListChecks,
  Lock,
  LogOut,
  Mail,
  Megaphone,
  MessageCircle,
  MessageSquare,
  MonitorPlay,
  PenSquare as Pencil,
  Play,
  Plus,
  Repeat,
  Reply,
  School,
  Search,
  Settings,
  Share2,
  ShoppingCart,
  Star,
  Target,
  ThumbsUp,
  TrendingUp,
  Upload,
  User,
  UserCheck,
  UserCircle,
  UserCog,
  UserPlus,
  Users,
  Video,
  Wallet,
  Zap,
  ChevronDown,
  LayoutDashboard,
  ChevronRight
} from "lucide-react";
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import logo from "@/assets/images/logo/medh_logo-2.png";
import "@/components/sidebar/sidebar-styles.css";
import { 
  Home as HomeIcon, 
  BookOpen as BookOpenIcon, 
  Clipboard as ClipboardIcon, 
  Pencil as PencilIcon, 
  GraduationCap as AcademicCapIcon, 
  Users as UserGroupIcon, 
  CreditCard as CreditCardIcon, 
  Briefcase as BriefcaseIcon, 
  MessageCircle as ChatAlt2Icon, 
  LogOut as LogoutIcon 
} from 'lucide-react';
import { jwtDecode } from "jwt-decode";

// Import the new sidebar components
import {
  SidebarHeader,
  SidebarSearch,
  SidebarSection,
  SidebarFooter,
  SidebarSubMenuItem
} from "@/components/sidebar";

// Define interfaces for the items structure
interface SubItem {
  name: string;
  path?: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
  onClick?: () => void;
}

interface MenuItem {
  name: string;
  path?: string;
  icon: React.ReactNode;
  onClick?: () => void;
  subItems?: SubItem[];
  comingSoon?: boolean;
}

interface ItemSection {
  title?: string;
  items: MenuItem[];
}

interface SidebarDashboardProps {
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
  onMenuClick: (menuName: string, items: SubItem[]) => void;
}

// Custom styles for enhanced Gen Alpha aesthetic
const sidebarStyles = `
  .sidebar-gen-alpha {
    border-right: 1px solid rgba(200, 80, 192, 0.2);
  }
  
  .menu-item-active {
    background: linear-gradient(to right, rgba(65, 88, 208, 0.1), rgba(200, 80, 192, 0.1));
    border-left: 3px solid #C850C0;
  }
  
  .menu-item-hover:hover {
    background: linear-gradient(to right, rgba(65, 88, 208, 0.05), rgba(200, 80, 192, 0.05));
  }
  
  .menu-icon-gradient {
    color: #C850C0;
  }
  
  .menu-section-title {
    background: linear-gradient(to right, #4158D0, #C850C0);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .user-avatar-gradient {
    background: linear-gradient(to right bottom, #4158D0, #C850C0);
  }
  
  .logout-button:hover {
    color: #FF5370;
  }
  
  @media (max-width: 1023px) {
    .sidebar-gen-alpha {
      box-shadow: 0 0 20px rgba(200, 80, 192, 0.2);
    }
  }
`;

const SidebarDashboard: React.FC<SidebarDashboardProps> = ({
  userRole,
  fullName,
  userEmail,
  userImage,
  userNotifications,
  userSettings,
  onMenuClick
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Initialize component
  useEffect(() => {
    setMounted(true);
    
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobileDevice(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    // Get user name from localStorage with better fallbacks
    const getUserName = () => {
      try {
        // Try standard key first, then legacy key
        const storedFullName = localStorage.getItem("fullName");
        const legacyName = localStorage.getItem("full_name");
        
        if (storedFullName) {
          return storedFullName;
        } else if (legacyName) {
          // Migrate to new key if using legacy
          localStorage.setItem("fullName", legacyName);
          return legacyName;
        }
        
        // If no name in storage, try to extract from token
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const decoded = jwtDecode<any>(token);
            let name = "";
            
            if (decoded.user?.full_name) {
              name = decoded.user.full_name;
            } else if (decoded.user?.name) {
              name = decoded.user.name;
            } else if (decoded.name) {
              name = decoded.name;
            } else if (decoded.user?.email) {
              name = decoded.user.email.split('@')[0]; // Use part before @ as name
            }
            
            if (name) {
              // Store for future use
              localStorage.setItem("fullName", name);
              return name;
            }
          } catch (tokenError) {
            console.error("Error decoding token:", tokenError);
          }
        }
        
        // Generate a name based on role if available
        const roleFromStorage = localStorage.getItem("role");
        if (roleFromStorage) {
          const role = roleFromStorage.toLowerCase();
          const roleName = role === "admin" ? 
            "Administrator" : 
            role.charAt(0).toUpperCase() + role.slice(1);
          return roleName;
        }
        
        return "User"; // Default fallback
      } catch (error) {
        console.error("Error accessing localStorage:", error);
        return "User"; // Final fallback
      }
    };
    
    // Apply the user name to the component state
    fullName = getUserName();
    
    // Get permissions from localStorage
    const getPermissionsAndRole = () => {
      try {
        const perm = localStorage.getItem("permissions");
        const roleFromStorage = localStorage.getItem("role");
        
        if (perm) {
          localStorage.setItem("permissions", perm);
        }
        
        if (roleFromStorage) {
          userRole = roleFromStorage;
        }
      } catch (error) {
        console.error("Error accessing permissions/role from localStorage:", error);
      }
    };
    
    getPermissionsAndRole();
    
    // Hash-based navigation handling
    const handleHashChange = () => {
      const newHash = window.location.hash.replace("#", "");
      if (newHash) {
        const decodedNewHash = decodeURIComponent(newHash);
        setActiveMenu(decodedNewHash);
        
        // Find and trigger the menu item based on hash
        const menuItem = findMenuItemByName(decodedNewHash);
        if (menuItem && menuItem.subItems) {
          // Trigger the onMenuClick with the appropriate subitems
          onMenuClick(decodedNewHash, menuItem.subItems as SubItem[]);
        }
      } else {
        setActiveMenu(null);
      }
    };
    
    // Initial hash processing on component mount
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const decodedHash = decodeURIComponent(hash);
        setActiveMenu(decodedHash);
        
        // Find and trigger the menu item based on initial hash
        const menuItem = findMenuItemByName(decodedHash);
        if (menuItem && menuItem.subItems) {
          // Trigger the onMenuClick with the appropriate subitems
          onMenuClick(decodedHash, menuItem.subItems as SubItem[]);
        }
      }
      
      // Listen for hash changes
      window.addEventListener("hashchange", handleHashChange);
    }
    
    // Clean up event listeners
    return () => {
      window.removeEventListener("resize", checkMobile);
      if (typeof window !== "undefined") {
        window.removeEventListener("hashchange", handleHashChange);
      }
    };
  }, []);

  // Helper function to find the menu name that corresponds to a view
  const findMenuMatchingView = (view: string): string | null => {
    // Convert view to lowercase for case-insensitive matching
    const normalizedView = view.toLowerCase();
    
    // Check for dashboard views
    if (normalizedView.includes('overview') || normalizedView.includes('dashboard')) {
      return 'Dashboard';
    }
    
    // Check for course management related views
    if (normalizedView.includes('course-categories') || 
        normalizedView.includes('add-course') || 
        normalizedView.includes('edit-courses') || 
        normalizedView.includes('course-detail')) {
      return 'Course Setup';
    }
    
    // Check for instructor management views
    if (normalizedView.includes('instructor')) {
      return 'Instructor Management';
    }
    
    // Check for student management views
    if (normalizedView.includes('student')) {
      return 'Student Management';
    }
    
    // Check for blog management
    if (normalizedView.includes('blog')) {
      return 'Blogs Management';
    }
    
    // Check for certificate management
    if (normalizedView.includes('certificate')) {
      return 'Certificate Management';
    }
    
    // Check for reports and analytics
    if (normalizedView.includes('analytics') || normalizedView.includes('report')) {
      return 'Reports & Analytics';
    }
    
    // Check for feedback and complaints
    if (normalizedView.includes('feedback') || normalizedView.includes('complaint')) {
      return 'Feedback & Grievances';
    }
    
    // Check for corporate management
    if (normalizedView.includes('corporate') || normalizedView.includes('placement')) {
      return 'Corporate Management';
    }

    return null;
  };

  // Parse path to determine user type
  const pathParts = pathname?.split("/") || [];
  const dashboardType = pathParts[2]?.split("-")[0] || '';
  const dashboardSubType = pathParts[2]?.split("-")[1] || '';
  
  const isPathAdmin = dashboardType === "admin";
  const isPathInstructor = dashboardType === "instructor";
  let isPathCorporate = dashboardType === "coorporate";
  const isPathCorporateEmp = dashboardType === "coorporate" && dashboardSubType === "employee";

  if (isPathCorporateEmp) {
    isPathCorporate = false;
  }

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
      
      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      // If error, still try to redirect
      router.push("/login");
    }
  };

  // Helper function to find menu item by name
  const findMenuItemByName = (menuName: string): MenuItem | undefined => {
    // Determine which sidebar to search based on user role
    let sidebarToSearch: ItemSection[] = [];
    
    if (userRole === "admin") {
      sidebarToSearch = adminSidebar;
    } else if (userRole === "student") {
      sidebarToSearch = studentSidebar;
    } else if (userRole === "parent") {
      sidebarToSearch = parentSidebar;
    }
    // Other roles not included as they might not exist in this component
    
    // Search through all sections and items
    for (const section of sidebarToSearch) {
      const foundItem = section.items.find((item: MenuItem) => item.name === menuName);
      if (foundItem) {
        return foundItem;
      }
    }
    
    return undefined;
  };

  // Handle menu clicks
  const handleMenuClick = (menuName: string, items: SubItem[]) => {
    // If clicking the same menu that's already active, toggle it closed
    if (activeMenu === menuName) {
      setActiveMenu(null);
      // Remove hash from URL
      if (typeof window !== "undefined") {
        window.history.pushState(null, "", window.location.pathname + window.location.search);
      }
    } else {
      setActiveMenu(menuName);
      // Set hash in URL for direct access
      if (typeof window !== "undefined") {
        window.location.hash = encodeURIComponent(menuName);
      }
    }
    
    // Pass to parent component to update content
    onMenuClick(menuName, items);
  };

  // Handle submenu clicks
  const handleSubMenuClick = (subItem: SubItem) => {
    if (subItem.comingSoon) {
      // If the feature is coming soon, navigate to coming soon page with title and return path
      const returnPath = userRole === "admin" 
        ? "/dashboards/admin" 
        : userRole === "instructor" 
        ? "/dashboards/instructor-dashboard" 
        : "/dashboards/student";
      
      router.push(`/coming-soon?title=${encodeURIComponent(subItem.name)}&returnPath=${returnPath}`);
      return;
    }
    
    // If item has an onClick handler, use that
    if (subItem.onClick) {
      subItem.onClick();
      return;
    }
    
    // Otherwise navigate to the actual path
    if (subItem.path) {
      router.push(subItem.path);
    }
  };

  // Create personalized welcome message
  const welcomeMessage = () => {
    // If no name is provided or available
    if (!fullName) {
      // If we know the role is student, use student-specific greeting
      if (userRole?.toLowerCase() === 'student') {
        return 'Hello, Student';
      }
      // Otherwise use role-based greeting
      return `Hello, ${(userRole || 'User').charAt(0).toUpperCase() + (userRole || 'User').slice(1)}`;
    }
    
    // If name is available, create a personalized greeting
    // For students, show exact format "Hello, abhi (Student)"
    if (userRole?.toLowerCase() === 'student') {
      return `Hello, ${fullName.split(' ')[0]} (Student)`;
    }
    
    // For other roles, just use first name
    return `Hello, ${fullName.split(' ')[0]}`;
  };

  // Define the complete sidebar structure for student role
  const studentSidebar: ItemSection[] = [
    {
      title: "Main",
      items: [
        {
          name: "Dashboard",
          icon: <LayoutDashboard className="w-5 h-5" />,
          subItems: [
            {
              name: "My Profile",
              path: "/dashboards/profile",
              icon: <UserCircle className="w-4 h-4" />
            },
            {
              name: "Upcoming Classes",
              path: "/dashboards/student-upcoming-classes",
              icon: <CalendarDays className="w-4 h-4" />
            },
            {
              name: "Recent Announcements",
              path: "/dashboards/student-announcements",
              icon: <Bell className="w-4 h-4" />,
              comingSoon: true
            },
            {
              name: "Progress Overview",
              path: "/dashboards/student-progress-overview",
              icon: <TrendingUp className="w-4 h-4" />
            },
            {
              name: "Free Courses",
              path: "/dashboards/students-free-courses",
              icon: <Gift className="w-4 h-4" />
            },
            {
              name: "Add Social Icon",
              path: "/dashboards/student-social",
              icon: <Share2 className="w-4 h-4" />,
              comingSoon: true
            },
            {
              name: "Change Password",
              path: "/dashboards/student-password",
              icon: <Key className="w-4 h-4" />,
              comingSoon: true
            },
            {
              name: "My Wishlist",
              path: "/dashboards/student-wishlist",
              icon: <Heart className="w-4 h-4" />
            },
          ]
        },
        {
          name: "My Demo Classes",
          icon: <MonitorPlay className="w-5 h-5" />,
          onClick: () => handleMenuClick("democlasses", [])
        },
      ]
    },
    {
      title: "My Learning",
      items: [
        {
          name: "My Courses",
          icon: <BookOpen className="w-5 h-5" />,
          path: "/dashboards/my-courses"
        },
        {
          name: "My Membership",
          icon: <Users className="w-5 h-5" />,
          path: "/dashboards/student-membership"
        },
        {
          name: "My Live Classes",
          icon: <Video className="w-5 h-5" />,
          subItems: [
            {
              name: "Join Live Class",
              path: "/dashboards/student-join-live",
              icon: <Play className="w-4 h-4" />,
              comingSoon: true
            },
            {
              name: "View Scheduled Classes",
              path: "/dashboards/student-upcoming-classes",
              icon: <CalendarDays className="w-4 h-4" />
            },
            {
              name: "Access Recorded Sessions",
              path: "/dashboards/access-recorded-sessions",
              icon: <Video className="w-4 h-4" />
            }
          ]
        }
      ]
    },
    {
      title: "Resources & Progress",
      items: [
        {
          name: "My Progress",
          icon: <TrendingUp className="w-5 h-5" />,
          subItems: [
            {
              name: "Course Completion Status",
              path: "/dashboards/student-enrolled-courses",
              icon: <CheckCircle className="w-4 h-4" />
            },
            {
              name: "Performance Analytics",
              path: "/dashboards/student-progress-overview",
              icon: <BarChart className="w-4 h-4" />
            },
            {
              name: "Skill Development Tracking",
              path: "/dashboards/student-skills",
              icon: <Target className="w-4 h-4" />,
              comingSoon: true
            }
          ]
        },
        {
          name: "Resources",
          icon: <FolderOpen className="w-5 h-5" />,
          subItems: [
            {
              name: "Access Course Materials",
              path: "/dashboards/lesson-course-materials",
              icon: <FileText className="w-4 h-4" />
            },
            {
              name: "View e-books",
              path: "/dashboards/student-ebooks",
              icon: <Book className="w-4 h-4" />,
              comingSoon: true
            }
          ]
        },
        {
          name: "Assignments & Quizzes",
          icon: <ClipboardList className="w-5 h-5" />,
          subItems: [
            {
              name: "My Assignments",
              path: "/dashboards/student-assignments",
              icon: <Clipboard className="w-4 h-4" />
            },
            {
              name: "Take Quiz",
              path: "/dashboards/student-quiz",
              icon: <CheckSquare className="w-4 h-4" />
            },
            {
              name: "My Quiz Attempts",
              path: "/dashboards/student-my-quiz-attempts",
              icon: <ListChecks className="w-4 h-4" />
            }
          ]
        }
      ]
    },
    {
      title: "Support & Documents",
      items: [
        {
          name: "Feedback & Support",
          icon: <MessageCircle className="w-5 h-5" />,
          path: "/dashboards/feedback"
        },
        {
          name: "Certificates",
          icon: <Award className="w-5 h-5" />,
          path: "/dashboards/student-certificate"
        },
        {
          name: "Payments",
          icon: <CreditCard className="w-5 h-5" />,
          path: "/dashboards/student-payment"
        },
        {
          name: "Apply for Placement",
          icon: <Briefcase className="w-5 h-5" />,
          path: "/dashboards/student-apply"
        }
      ]
    }
  ];

  // Define parent sidebar structure
  const parentSidebar: ItemSection[] = [
    {
      title: "Main",
      items: [
        {
          name: "Dashboard",
          icon: <LayoutDashboard className="w-5 h-5" />,
          subItems: [
            {
              name: "My Profile",
              path: "/dashboards/profile",
              icon: <UserCircle className="w-4 h-4" />
            },
            {
              name: "Child's Upcoming Classes",
              path: "/dashboards/parent-upcoming-classes",
              icon: <CalendarDays className="w-4 h-4" />
            },
            {
              name: "Recent Performance Updates",
              path: "/dashboards/parent-performance-updates",
              icon: <TrendingUp className="w-4 h-4" />
            },
            {
              name: "Quick Access",
              path: "/dashboards/parent-quick-access",
              icon: <Zap className="w-4 h-4" />
            },
            {
              name: "Add Social Icon",
              path: "/dashboards/parent-social",
              icon: <Share2 className="w-4 h-4" />
            },
            {
              name: "Change Password",
              path: "/dashboards/parent-password",
              icon: <Key className="w-4 h-4" />
            }
          ]
        }
      ]
    },
    {
      title: "Academics",
      items: [
        {
          name: "Class Schedule",
          icon: <CalendarDays className="w-5 h-5" />,
          subItems: [
            {
              name: "View Timetable",
              path: "/dashboards/parent-timetable",
              icon: <Calendar className="w-4 h-4" />
            },
            {
              name: "View Attendance",
              path: "/dashboards/parent-attendance",
              icon: <CheckSquare className="w-4 h-4" />
            },
            {
              name: "Upcoming Classes",
              path: "/dashboards/parent-classes",
              icon: <Clock className="w-4 h-4" />
            },
            {
              name: "Recorded Sessions",
              path: "/dashboards/parent-recordings",
              icon: <Video className="w-4 h-4" />
            },
            {
              name: "Track Performance",
              path: "/dashboards/parent-track-performance",
              icon: <LineChart className="w-4 h-4" />
            }
          ]
        },
        {
          name: "Grades",
          icon: <ClipboardList className="w-5 h-5" />,
          subItems: [
            {
              name: "Pending Assignments",
              path: "/dashboards/parent-pending-assignments",
              icon: <AlertCircle className="w-4 h-4" />
            },
            {
              name: "View Grades",
              path: "/dashboards/parent-grades",
              icon: <Award className="w-4 h-4" />
            }
          ]
        }
      ]
    },
    {
      title: "Communication & Support",
      items: [
        {
          name: "Communication",
          icon: <MessageCircle className="w-5 h-5" />,
          subItems: [
            {
              name: "Message Instructors",
              path: "/dashboards/parent-message-instructors",
              icon: <Mail className="w-4 h-4" />
            },
            {
              name: "Announcements",
              path: "/dashboards/parent-announcements",
              icon: <Bell className="w-4 h-4" />
            },
            {
              name: "Schedule Meetings",
              path: "/dashboards/parent-schedule-meetings",
              icon: <CalendarClock className="w-4 h-4" />
            }
          ]
        },
        {
          name: "Payments",
          icon: <CreditCard className="w-5 h-5" />,
          subItems: [
            {
              name: "Fee Structure",
              path: "/dashboards/parent-fee-structure",
              icon: <FileText className="w-4 h-4" />
            },
            {
              name: "Make Payments",
              path: "/dashboards/parent-make-payments",
              icon: <DollarSign className="w-4 h-4" />
            },
            {
              name: "Download Invoices",
              path: "/dashboards/parent-invoices",
              icon: <Download className="w-4 h-4" />
            }
          ]
        },
        {
          name: "Feedback & Concerns",
          icon: <HelpCircle className="w-5 h-5" />,
          subItems: [
            {
              name: "Submit Feedback",
              path: "/dashboards/parent-submit-feedback",
              icon: <ThumbsUp className="w-4 h-4" />
            },
            {
              name: "Raise Concerns",
              path: "/dashboards/parent-raise-concerns",
              icon: <AlertTriangle className="w-4 h-4" />
            },
            {
              name: "Track Resolution",
              path: "/dashboards/parent-track-resolution",
              icon: <History className="w-4 h-4" />
            }
          ]
        }
      ]
    }
  ];

  // Define instructor sidebar structure
  const instructorSidebar: ItemSection[] = [
    {
      title: "Main",
      items: [
        {
          name: "Dashboard",
          icon: <LayoutDashboard className="w-5 h-5" />,
          subItems: [
            {
              name: "Overview",
              path: "/dashboards/instructor-dashboard",
              icon: <LayoutGrid className="w-4 h-4" />
            },
            {
              name: "My Profile",
              path: "/dashboards/profile",
              icon: <UserCircle className="w-4 h-4" />
            },
            {
              name: "Change Password",
              path: "/dashboards/instructor-password",
              icon: <Key className="w-4 h-4" />,
              comingSoon: true
            },
            {
              name: "Add Social Icon",
              path: "/dashboards/instructor-social",
              icon: <Share2 className="w-4 h-4" />,
              comingSoon: true
            }
          ]
        }
      ]
    },
    {
      title: "Classes",
      items: [
        {
          name: "My Demo Classes",
          icon: <MonitorPlay className="w-5 h-5" />,
          path: "/dashboards/instructor-class"
        },
        {
          name: "My Main Classes",
          icon: <Video className="w-5 h-5" />,
          path: "/dashboards/instructor-mainclass"
        },
        {
          name: "Track Sessions",
          icon: <History className="w-5 h-5" />,
          path: "/dashboards/instructor-track"
        }
      ]
    },
    {
      title: "Assignments & Assessments",
      items: [
        {
          name: "Assignments & Quizzes",
          icon: <ClipboardList className="w-5 h-5" />,
          subItems: [
            {
              name: "Create Assignment",
              path: "/dashboards/instructor-create-assignment",
              icon: <Pencil className="w-4 h-4" />
            },
            {
              name: "Create Quiz",
              path: "/dashboards/instructor-create-quiz",
              icon: <FileCheck className="w-4 h-4" />
            },
            {
              name: "Submitted Assignments",
              path: "/dashboards/instructor-view-assignments",
              icon: <Clipboard className="w-4 h-4" />
            },
            {
              name: "Submitted Quizzes",
              path: "/dashboards/instructor-view-quizes",
              icon: <CheckSquare className="w-4 h-4" />
            },
            {
              name: "My Quiz Attempts",
              path: "/dashboards/instructor-my-quiz-attempts",
              icon: <ListChecks className="w-4 h-4" />
            }
          ]
        }
      ]
    },
    {
      title: "Communication & Support",
      items: [
        {
          name: "Feedback",
          icon: <MessageCircle className="w-5 h-5" />,
          path: "/dashboards/instructor-feedbacks"
        },
        {
          name: "Student Performance",
          icon: <TrendingUp className="w-5 h-5" />,
          path: "/dashboards/instructor-student-performance",
          comingSoon: true
        },
        {
          name: "Schedule Classes",
          icon: <Calendar className="w-5 h-5" />,
          path: "/dashboards/instructor-schedule",
          comingSoon: true
        },
        {
          name: "Resources",
          icon: <FolderOpen className="w-5 h-5" />,
          path: "/dashboards/instructor-resources",
          comingSoon: true
        }
      ]
    }
  ];

  // Define admin sidebar structure
  const adminSidebar: ItemSection[] = [
    {
      title: "Administrator",
      items: [
        {
          name: "Dashboard",
          icon: <LayoutDashboard className="w-5 h-5" />,
          subItems: [
            {
              name: "Overview",
              path: "/dashboards/admin",
              icon: <LayoutGrid className="w-4 h-4" />
            },
            {
              name: "My Profile",
              path: "/dashboards/profile",
              icon: <UserCircle className="w-4 h-4" />
            },
            {
              name: "Currency Management",
              path: "/dashboards/admin-currency",
              icon: <DollarSign className="w-4 h-4" />
            },
            {
              name: "Change Password",
              path: "/dashboards/admin-password",
              icon: <Key className="w-4 h-4" />,
              comingSoon: true
            },
            {
              name: "Add Social Icon",
              path: "/dashboards/admin-social",
              icon: <Share2 className="w-4 h-4" />,
              comingSoon: true
            }
          ]
        }
      ]
    },
    {
      title: "General Masters",
      items: [
        {
          name: "Location & Currency",
          icon: <Globe className="w-5 h-5" />,
          subItems: [
            {
              name: "Country/Geography",
              path: "/dashboards/admin-country",
              icon: <Globe className="w-4 h-4" />
            },
            {
              name: "Currency Master",
              path: "/dashboards/admin-currency",
              icon: <DollarSign className="w-4 h-4" />,
              onClick: () => {
                onMenuClick("Location & Currency", adminSidebar[1].items.map(item => item as SubItem));
                router.push("/dashboards/admin#admin-currency");
              }
            },
            {
              name: "Time Zone",
              path: "/dashboards/admin-timezone",
              icon: <Clock className="w-4 h-4" />
            },
            {
              name: "Language",
              path: "/dashboards/admin-language",
              icon: <MessageCircle className="w-4 h-4" />
            }
          ]
        },
        {
          name: "Status & Certifications",
          icon: <FileCheck className="w-5 h-5" />,
          subItems: [
            {
              name: "Certificate Type",
              path: "/dashboards/admin-certificate-type",
              icon: <Award className="w-4 h-4" />
            },
            {
              name: "Status Management",
              path: "/dashboards/admin-status",
              icon: <AlertCircle className="w-4 h-4" />
            }
          ]
        },
        {
          name: "Age & Duration",
          icon: <CalendarClock className="w-5 h-5" />,
          subItems: [
            {
              name: "Age Group",
              path: "/dashboards/admin-age-group",
              icon: <Users className="w-4 h-4" />
            },
            {
              name: "Duration",
              path: "/dashboards/admin-duration",
              icon: <CalendarDays className="w-4 h-4" />
            },
            {
              name: "Grade Group",
              path: "/dashboards/admin-grade-group",
              icon: <GraduationCap className="w-4 h-4" />
            },
            {
              name: "Batch",
              path: "/dashboards/admin-batch",
              icon: <Users className="w-4 h-4" />
            }
          ]
        }
      ]
    },
    {
      title: "Education & Filters",
      items: [
        {
          name: "Education",
          icon: <GraduationCap className="w-5 h-5" />,
          subItems: [
            {
              name: "Education Level",
              path: "/dashboards/admin-education-level",
              icon: <ArrowUpDown className="w-4 h-4" />
            },
            {
              name: "Education Type",
              path: "/dashboards/admin-education-type",
              icon: <FolderTree className="w-4 h-4" />
            },
            {
              name: "Education Title",
              path: "/dashboards/admin-education-title",
              icon: <FileText className="w-4 h-4" />
            }
          ]
        },
        {
          name: "Filteration Criteria",
          icon: <Filter className="w-5 h-5" />,
          subItems: [
            {
              name: "Age Wise",
              path: "/dashboards/admin-filter-age",
              icon: <Users className="w-4 h-4" />
            },
            {
              name: "Duration Wise",
              path: "/dashboards/admin-filter-duration",
              icon: <CalendarDays className="w-4 h-4" />
            },
            {
              name: "Grade Wise",
              path: "/dashboards/admin-filter-grade",
              icon: <GraduationCap className="w-4 h-4" />
            }
          ]
        }
      ]
    },
    {
      title: "Course Management",
      items: [
        {
          name: "Course Setup",
          icon: <BookOpen className="w-5 h-5" />,
          subItems: [
            {
              name: "Course Categories",
              icon: <FolderTree className="w-4 h-4" />,
              onClick: () => handleMenuClick("Course Setup", adminSidebar[3].items.map(item => item as SubItem))
            },
            {
              name: "Create New Course",
              icon: <Plus className="w-4 h-4" />,
              onClick: () => handleMenuClick("Course Setup", adminSidebar[3].items.map(item => item as SubItem))
            },
            {
              name: "Edit/Archive Courses",
              icon: <Pencil className="w-4 h-4" />,
              onClick: () => handleMenuClick("Course Setup", adminSidebar[3].items.map(item => item as SubItem))
            }
          ]
        },
        {
          name: "Course Pricing",
          icon: <CreditCard className="w-5 h-5" />,
          subItems: [
            {
              name: "Set Course Fee",
              path: "/dashboards/admin-course-fee",
              icon: <DollarSign className="w-4 h-4" />
            },
            {
              name: "Fee Structures",
              path: "/dashboards/admin-fee-structures",
              icon: <FileSpreadsheet className="w-4 h-4" />
            }
          ]
        },
        {
          name: "Course Materials",
          icon: <FolderOpen className="w-5 h-5" />,
          subItems: [
            {
              name: "Upload Brochure",
              path: "/dashboards/admin-upload-brochure",
              icon: <Upload className="w-4 h-4" />
            },
            {
              name: "Upload Intro Video",
              path: "/dashboards/admin-upload-video",
              icon: <Video className="w-4 h-4" />
            }
          ]
        }
      ]
    },
    {
      title: "User Management",
      items: [
        {
          name: "Student Management",
          icon: <GraduationCap className="w-5 h-5" />,
          subItems: [
            {
              name: "View All Students",
              icon: <Users className="w-4 h-4" />,
              onClick: () => handleMenuClick("Student Management", adminSidebar[6].items.map(item => item as SubItem))
            },
            {
              name: "Add New Student",
              icon: <UserPlus className="w-4 h-4" />,
              onClick: () => handleMenuClick("Student Management", adminSidebar[6].items.map(item => item as SubItem))
            },
            {
              name: "Edit Student Profiles",
              path: "/dashboards/admin-edit-student",
              icon: <UserCog className="w-4 h-4" />
            },
            {
              name: "Assign Courses/Batch",
              path: "/dashboards/admin-assign-student",
              icon: <FileCheck className="w-4 h-4" />
            }
          ]
        },
        {
          name: "Instructor Management",
          icon: <Briefcase className="w-5 h-5" />,
          subItems: [
            {
              name: "View All Instructors",
              icon: <Users className="w-4 h-4" />,
              onClick: () => handleMenuClick("Instructor Management", adminSidebar[7].items.map(item => item as SubItem))
            },
            {
              name: "Add New Instructor",
              icon: <UserPlus className="w-4 h-4" />,
              onClick: () => handleMenuClick("Instructor Management", adminSidebar[7].items.map(item => item as SubItem))
            },
            {
              name: "Edit Instructor Profiles",
              path: "/dashboards/admin-edit-instructor",
              icon: <UserCog className="w-4 h-4" />
            },
            {
              name: "Batch Assignment",
              icon: <FileCheck className="w-4 h-4" />,
              onClick: () => handleMenuClick("Instructor Management", adminSidebar[7].items.map(item => item as SubItem))
            },
            {
              name: "Instructor Payouts",
              path: "/dashboards/admin-instructor-payouts",
              icon: <CreditCard className="w-4 h-4" />
            }
          ]
        },
        {
          name: "Access Management",
          icon: <Lock className="w-5 h-5" />,
          subItems: [
            {
              name: "Create Users",
              path: "/dashboards/admin-create-users",
              icon: <UserPlus className="w-4 h-4" />
            },
            {
              name: "Manage Access Rights",
              path: "/dashboards/admin-access-rights",
              icon: <Key className="w-4 h-4" />
            },
            {
              name: "Edit User Roles",
              path: "/dashboards/admin-edit-roles",
              icon: <UserCog className="w-4 h-4" />
            }
          ]
        }
      ]
    },
    {
      title: "Operations",
      items: [
        {
          name: "Timetable Management",
          icon: <CalendarDays className="w-5 h-5" />,
          onClick: () => handleMenuClick("timetable", [])
        },
        {
          name: "Certificate Management",
          icon: <Award className="w-5 h-5" />,
          onClick: () => handleMenuClick("certificates", [])
        },
        {
          name: "Membership Management",
          icon: <Users className="w-5 h-5" />,
          onClick: () => handleMenuClick("membership", [])
        },
        {
          name: "Attendance Management",
          icon: <CheckSquare className="w-5 h-5" />,
          onClick: () => handleMenuClick("attendance", [])
        },
        {
          name: "Fees Management",
          icon: <CreditCard className="w-5 h-5" />,
          onClick: () => handleMenuClick("fees", [])
        }
      ]
    },
    {
      title: "Content & Resources",
      items: [
        {
          name: "Marketing & Notices",
          icon: <Megaphone className="w-5 h-5" />,
          onClick: () => handleMenuClick("marketing", [])
        },
        {
          name: "Resources Management",
          icon: <FolderOpen className="w-5 h-5" />,
          onClick: () => handleMenuClick("resources", [])
        },
        {
          name: "Feedback & Grievances",
          icon: <MessageCircle className="w-5 h-5" />,
          onClick: () => handleMenuClick("Feedback & Grievances", adminSidebar[11].items.map(item => item as SubItem))
        },
        {
          name: "Blogs Management",
          icon: <FileText className="w-5 h-5" />,
          onClick: () => handleMenuClick("Blogs Management", adminSidebar[11].items.map(item => item as SubItem))
        }
      ]
    },
    {
      title: "Enterprise",
      items: [
        {
          name: "Corporate Management",
          icon: <Building className="w-5 h-5" />,
          onClick: () => handleMenuClick("Corporate Management", adminSidebar[12].items.map(item => item as SubItem))
        },
        {
          name: "Institution Management",
          icon: <School className="w-5 h-5" />,
          onClick: () => handleMenuClick("institution", [])
        },
        {
          name: "Join Medh (Careers)",
          icon: <Briefcase className="w-5 h-5" />,
          onClick: () => handleMenuClick("careers", [])
        },
        {
          name: "Query Forms Management",
          icon: <ClipboardList className="w-5 h-5" />,
          onClick: () => handleMenuClick("queries", [])
        }
      ]
    },
    {
      title: "Analytics",
      items: [
        {
          name: "Reports & Analytics",
          icon: <BarChart2 className="w-5 h-5" />,
          subItems: [
            {
              name: "System Reports",
              path: "/dashboards/admin-system-reports",
              icon: <FileSpreadsheet className="w-4 h-4" />
            },
            {
              name: "User Engagement",
              path: "/dashboards/admin-user-engagement",
              icon: <LineChart className="w-4 h-4" />
            },
            {
              name: "Revenue Analytics",
              path: "/dashboards/admin-revenue",
              icon: <TrendingUp className="w-4 h-4" />
            }
          ]
        }
      ]
    }
  ];

  // Actions including logout
  const actionItems: MenuItem[] = [
    {
      name: "Logout",
      icon: <LogOut className="w-5 h-5" />,
      onClick: handleLogout
    }
  ];

  // Determine which items to display based on the user's role
  const effectiveIsAdmin = isPathAdmin;
  const effectiveIsInstructor = isPathInstructor;
  const effectiveIsCorporate = isPathCorporate;
  const effectiveIsCorporateEmp = isPathCorporateEmp;
  const effectiveIsParent = userRole === "parent" || pathname?.includes("/dashboards/parent");

  // Choose the appropriate sidebar based on role
  const activeSidebar = effectiveIsAdmin ? adminSidebar : 
                        effectiveIsInstructor ? instructorSidebar : 
                        effectiveIsCorporate ? [] : 
                        effectiveIsCorporateEmp ? [] :
                        effectiveIsParent ? parentSidebar :
                        studentSidebar;

  // Filter menu items by search term
  const filterItemsBySearch = (sections: ItemSection[]): ItemSection[] => {
    if (!searchTerm) return sections;
    
    return sections.map(section => {
      // Filter items in each section
      const filteredItems = section.items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subItems?.some(subItem => 
          subItem.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      
      return {
        ...section,
        items: filteredItems
      };
    }).filter(section => section.items.length > 0);
  };
  
  // Helper function to handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  if (!mounted) {
    return null;
  }

  // Helper to show preview of subitems on mobile
  const renderMobileSubitems = (item: MenuItem) => {
    if (!item.subItems || item.subItems.length === 0) return null;
    
    return (
      <div className="mt-2 ml-6 pb-2 space-y-1">
        {item.subItems.slice(0, 3).map((subItem, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (subItem.comingSoon) {
                router.push(`/coming-soon?title=${encodeURIComponent(subItem.name)}&returnPath=/dashboards/student`);
              } else if (subItem.onClick) {
                subItem.onClick();
              } else if (subItem.path) {
                router.push(subItem.path);
              }
              
              // Also pass to parent to update main content
              if (onMenuClick) {
                onMenuClick(
                  item.name,
                  item.subItems?.map(i => i as SubItem) || []
                );
              }
            }}
            className={`flex items-center w-full text-left pl-4 pr-2 py-1.5 text-xs rounded-md ${
              subItem.comingSoon 
                ? "text-gray-400 cursor-not-allowed" 
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <span className="flex-shrink-0 w-3.5 h-3.5 mr-1.5 text-primary-500">{subItem.icon}</span>
            <span className="truncate whitespace-nowrap text-left">{subItem.name}</span>
            {subItem.comingSoon && (
              <span className="flex-shrink-0 ml-1 px-1 text-[10px] rounded-full bg-gray-100 dark:bg-gray-700">
                Soon
              </span>
            )}
          </button>
        ))}
        
        {item.subItems.length > 3 && (
          <button
            onClick={() => {
              // Pass all subitems to parent to handle in main content
              if (onMenuClick) {
                onMenuClick(
                  item.name,
                  item.subItems?.map(i => i as SubItem) || []
                );
              }
            }}
            className="ml-4 flex items-center w-full text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline"
          >
            <span className="whitespace-nowrap text-left">View all {item.subItems.length} options</span>
            <ChevronRight className="flex-shrink-0 w-3 h-3 ml-0.5" />
          </button>
        )}
      </div>
    );
  };

  // Main return with new modular components
  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 border-r dark:border-gray-700 sidebar-gen-alpha sidebar-container">
      {/* Header component */}
      <SidebarHeader 
        logo={logo}
        userName={fullName}
        userRole={userRole}
        userNotifications={userNotifications}
        isMobileDevice={isMobileDevice}
        welcomeMessage={welcomeMessage()}
      />
      
      {/* Mobile search */}
      {isMobileDevice && (
        <SidebarSearch onSearch={handleSearch} />
      )}
      
      {/* Navigation - Scrollable */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 px-3 sm:px-4">
        <nav className="py-2 sm:py-4 space-y-4 sm:space-y-6">
          {/* Appropriate Sidebar Navigation based on role */}
          <AnimatePresence initial={false} mode="wait">
            {filterItemsBySearch(activeSidebar).map((section, sectionIndex) => (
              <SidebarSection
                key={sectionIndex}
                title={section.title}
                items={section.items as any}
                activeMenu={activeMenu}
                isMobileDevice={isMobileDevice}
                onMenuClick={handleMenuClick}
                renderMobileSubitems={renderMobileSubitems}
              />
            ))}
          </AnimatePresence>
        </nav>
      </div>
      
      {/* Footer with action items */}
      <SidebarFooter
        actionItems={actionItems as any}
        isMobileDevice={isMobileDevice}
      />
    </div>
  );
};

export default SidebarDashboard;