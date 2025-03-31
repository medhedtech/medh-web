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
import { setCookie } from "nookies";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import logo from "@/assets/images/logo/medh_logo-2.png";
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
  userName: string;
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
  userName,
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
  
  // Determine user role from URL path
  useEffect(() => {
    setMounted(true);
    
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobileDevice(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    // Get user name from localStorage
    const storedUserName = localStorage.getItem("full_name");
    if (storedUserName) {
      userName = storedUserName;
    }
    
    // Get permissions from localStorage
    const perm = localStorage.getItem("permissions");
    const roleFromStorage = localStorage.getItem("role");
    if (perm) {
      localStorage.setItem("permissions", perm);
    }
    if (roleFromStorage) {
      userRole = roleFromStorage;
    }
    
    // Set active menu based on currentView prop
    if (activeMenu) {
      // Find the menu that matches the current view
      const menuMatch = findMenuMatchingView(activeMenu);
      if (menuMatch) {
        setActiveMenu(menuMatch);
      }
    }
    
    return () => window.removeEventListener("resize", checkMobile);
  }, [activeMenu]);

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

  // Handle logout function
  const handleLogout = () => {
    // Clear cookies and localStorage
    setCookie(null, "token", "", { path: "/" });
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("permissions");
    localStorage.removeItem("role");
    localStorage.removeItem("full_name");
    
    // Redirect to login page
    router.push("/login");
  };

  // Handle menu clicks
  const handleMenuClick = (menuName: string, items: SubItem[]) => {
    console.log("Menu clicked:", menuName, "with items:", items); // Debug log
    onMenuClick(menuName, items);
  };

  // Helper function to find menu item by name
  const findMenuItemByName = (menuName: string): MenuItem | undefined => {
    // Determine which sidebar to search in
    const activeSidebar = isPathAdmin ? adminSidebar : 
                          isPathInstructor ? [] : 
                          isPathCorporate ? [] : 
                          isPathCorporateEmp ? [] : 
                          studentSidebar;
    
    // Search through all sections and items
    for (const section of activeSidebar) {
      const foundItem = section.items.find(item => item.name === menuName);
      if (foundItem) {
        return foundItem;
      }
    }
    
    return undefined;
  };

  // Handle submenu clicks
  const handleSubMenuClick = (subItem: SubItem) => {
    if (subItem.comingSoon) {
      // If the feature is coming soon, navigate to coming soon page with title and return path
      router.push(`/coming-soon?title=${encodeURIComponent(subItem.name)}&returnPath=/dashboards/student`);
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
  const welcomeMessage = userName 
    ? `Hello, ${userName.split(' ')[0]}` 
    : `Hello, ${(userRole || 'User').charAt(0).toUpperCase() + (userRole || 'User').slice(1)}`;

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
              path: "/dashboards/student-profile",
              icon: <UserCircle className="w-4 h-4" />,
              comingSoon: true
            },
            {
              name: "Upcoming Classes",
              path: "/dashboards/student-upcoming-classes",
              icon: <CalendarDays className="w-4 h-4" />,
              comingSoon: true
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
              icon: <TrendingUp className="w-4 h-4" />,
              comingSoon: true
            },
            {
              name: "Free Courses",
              path: "/dashboards/student-free-courses",
              icon: <Gift className="w-4 h-4" />,
              comingSoon: true
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
              icon: <Heart className="w-4 h-4" />,
              comingSoon: true
            },
          ]
        },
        {
          name: "My Demo Classes",
          icon: <MonitorPlay className="w-5 h-5" />,
          subItems: [
            {
              name: "Demo Scheduled Details",
              path: "/dashboards/student-demo-schedule",
              icon: <CalendarDays className="w-4 h-4" />,
              comingSoon: true
            },
            {
              name: "Demo Attend Details",
              path: "/dashboards/student-demo-attendance",
              icon: <CheckSquare className="w-4 h-4" />,
              comingSoon: true
            },
            {
              name: "Demo Attend Certificate",
              path: "/dashboards/student-demo-certificate",
              icon: <Award className="w-4 h-4" />,
              comingSoon: true
            },
            {
              name: "Demo Feedback/Summary",
              path: "/dashboards/student-demo-feedback",
              icon: <MessageSquare className="w-4 h-4" />,
              comingSoon: true
            }
          ]
        },
      ]
    },
    {
      title: "My Learning",
      items: [
        {
          name: "My Courses",
          icon: <BookOpen className="w-5 h-5" />,
          onClick: () => handleMenuClick("mycourses", [])
        },
        {
          name: "My Membership",
          icon: <Users className="w-5 h-5" />,
          onClick: () => handleMenuClick("membership", [])
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
              path: "/dashboards/student-scheduled-classes",
              icon: <CalendarDays className="w-4 h-4" />,
              comingSoon: true
            },
            {
              name: "Access Recorded Sessions",
              path: "/dashboards/student-recorded-sessions",
              icon: <Video className="w-4 h-4" />,
              comingSoon: true
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
              path: "/dashboards/student-course-completion",
              icon: <CheckCircle className="w-4 h-4" />,
              comingSoon: true
            },
            {
              name: "Performance Analytics",
              path: "/dashboards/student-performance",
              icon: <BarChart className="w-4 h-4" />,
              comingSoon: true
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
              path: "/dashboards/student-course-materials",
              icon: <FileText className="w-4 h-4" />,
              comingSoon: true
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
          onClick: () => handleMenuClick("quizzes", [])
        }
      ]
    },
    {
      title: "Support & Documents",
      items: [
        {
          name: "Feedback & Support",
          icon: <MessageCircle className="w-5 h-5" />,
          onClick: () => handleMenuClick("feedback", [])
        },
        {
          name: "Certificates",
          icon: <Award className="w-5 h-5" />,
          onClick: () => handleMenuClick("certificates", [])
        },
        {
          name: "Payments",
          icon: <CreditCard className="w-5 h-5" />,
          onClick: () => handleMenuClick("payments", [])
        },
        {
          name: "Apply for Placement",
          icon: <Briefcase className="w-5 h-5" />,
          onClick: () => handleMenuClick("placement", [])
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
              path: "/dashboards/parent-profile",
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
          name: "Assignments & Grades",
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
              path: "/dashboards/admin-dashboard",
              icon: <LayoutGrid className="w-4 h-4" />,
              onClick: () => handleMenuClick("Dashboard", adminSidebar[0].items.map(item => item as SubItem))
            },
            {
              name: "My Profile",
              path: "/dashboards/admin-settings",
              icon: <UserCircle className="w-4 h-4" />
            },
            {
              name: "Currency Management",
              path: "/dashboards/admin-currency",
              icon: <DollarSign className="w-4 h-4" />,
              onClick: () => {
                onMenuClick("Dashboard", adminSidebar[0].items.map(item => item as SubItem));
                router.push("/dashboards/admin-dashboard?view=admin-currency");
              }
            },
            {
              name: "Change Password",
              path: "/dashboards/admin-password",
              icon: <Key className="w-4 h-4" />
            },
            {
              name: "Add Social Icon",
              path: "/dashboards/admin-social",
              icon: <Share2 className="w-4 h-4" />
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
                router.push("/dashboards/admin-dashboard?view=admin-currency");
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
                        effectiveIsInstructor ? [] : 
                        effectiveIsCorporate ? [] : 
                        effectiveIsCorporateEmp ? [] :
                        effectiveIsParent ? parentSidebar :
                        studentSidebar;

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
            <span className="w-3.5 h-3.5 mr-1.5 text-primary-500">{subItem.icon}</span>
            <span className="truncate">{subItem.name}</span>
            {subItem.comingSoon && (
              <span className="ml-1 px-1 text-[10px] rounded-full bg-gray-100 dark:bg-gray-700">
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
            <span>View all {item.subItems.length} options</span>
            <ChevronRight className="w-3 h-3 ml-0.5" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 border-r dark:border-gray-700">
      {/* Header */}
      <div className="p-4 sm:p-6 flex flex-col space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <Image 
            src={logo} 
            alt="logo" 
            width={isMobileDevice ? 80 : 100} 
            height={isMobileDevice ? 80 : 100} 
            className="transition-transform hover:scale-105" 
          />
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">
              <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 ring-1 ring-white dark:ring-gray-800"></span>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
        
        {/* User welcome */}
        <div className="flex items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-primary-50 to-white dark:from-primary-900/10 dark:to-gray-800 rounded-xl border border-primary-100/50 dark:border-primary-800/20">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold shadow-sm">
            {userName ? userName.charAt(0).toUpperCase() : (userRole || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-primary-700 dark:text-primary-400">
              {welcomeMessage}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {(userRole || 'User').charAt(0).toUpperCase() + (userRole || 'User').slice(1)} Account
            </p>
          </div>
        </div>
      </div>
      
      {/* Mobile search */}
      {isMobileDevice && (
        <div className="px-4 mb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search menu..."
              className="w-full px-3 py-1.5 pl-8 text-sm bg-gray-100 dark:bg-gray-700/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400" />
          </div>
        </div>
      )}
      
      {/* Navigation - Scrollable */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 px-3 sm:px-4">
        <nav className="py-2 sm:py-4 space-y-4 sm:space-y-6">
          {/* Appropriate Sidebar Navigation based on role */}
          {activeSidebar.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {section.title && (
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 px-3">
                  {section.title}
                </h3>
              )}
              <ul className="space-y-1">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <button
                      onClick={() => {
                        if (item.subItems) {
                          handleMenuClick(item.name, item.subItems);
                        } else {
                          handleMenuClick(item.name, []);
                        }
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                        activeMenu === item.name
                          ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 border-l-2 border-primary-500" 
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`${
                          activeMenu === item.name
                            ? "text-primary-600 dark:text-primary-400"
                            : "text-gray-500 dark:text-gray-400"
                        }`}>{item.icon}</span>
                        <span>{item.name}</span>
                      </div>
                      
                      {item.subItems && (
                        <ChevronDown 
                          className={`w-4 h-4 transition-transform ${
                            activeMenu === item.name ? "rotate-180 text-primary-500" : ""
                          }`} 
                        />
                      )}
                    </button>
                    
                    {/* Mobile optimized submenu display */}
                    {activeMenu === item.name && isMobileDevice && renderMobileSubitems(item)}
                    
                    {/* Desktop indicator that opens in navbar */}
                    {item.subItems && activeMenu === item.name && !isMobileDevice && (
                      <div className="mt-1 ml-8 h-1 w-16 bg-gradient-to-r from-primary-300 to-purple-300 dark:from-primary-800 dark:to-purple-800 rounded-full"></div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      
      {/* Action items (logout, etc) */}
      <div className="p-4 border-t dark:border-gray-700">
        <ul className="space-y-1">
          {actionItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={item.onClick}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-red-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-red-400 transition-colors"
              >
                <span className="text-gray-500 dark:text-gray-400">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
        
        {/* Version info - only on desktop */}
        {!isMobileDevice && (
          <div className="mt-6 pt-2 text-center text-xs text-gray-400 dark:text-gray-600">
            <p>Medh v1.0</p>
            <p className="mt-1">© 2025 Medh Education</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarDashboard;