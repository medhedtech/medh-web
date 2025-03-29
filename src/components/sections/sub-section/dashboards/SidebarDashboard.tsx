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
  LayoutDashboard
} from "lucide-react";
import { setCookie } from "nookies";
import { motion, AnimatePresence } from "framer-motion";
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
  isAdmin?: boolean;
  isInstructor?: boolean;
  isCorporate?: boolean;
  isCorporateEmp?: boolean;
  role?: string;
  onMenuSelect?: (viewName: string) => void;
  currentView?: string;
}

const SidebarDashboard: React.FC<SidebarDashboardProps> = ({
  isAdmin = false,
  isInstructor = false,
  isCorporate = false,
  isCorporateEmp = false,
  role = "student",
  onMenuSelect,
  currentView = "overview"
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [permissions, setPermissions] = useState<string[]>([]);
  const [mounted, setMounted] = useState<boolean>(false);
  
  // Determine user role from URL path
  useEffect(() => {
    setMounted(true);
    
    // Get user name from localStorage
    const storedUserName = localStorage.getItem("full_name");
    if (storedUserName) {
      setUserName(storedUserName);
    }
    
    // Get permissions from localStorage
    const perm = localStorage.getItem("permissions");
    const roleFromStorage = localStorage.getItem("role");
    if (perm) {
      setPermissions(JSON.parse(perm));
    }
    if (roleFromStorage) {
      role = roleFromStorage;
    }
  }, []);

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
  const handleMenuClick = (menuName: string) => {
    // Convert menu name to lowercase without spaces for consistent comparison
    const viewName = menuName.toLowerCase().replace(/\s+/g, '');
    
    if (activeMenu === menuName) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menuName);
    }
    
    if (onMenuSelect) {
      onMenuSelect(viewName);
      console.log("SidebarDashboard sending view:", viewName); // Debug log
    }
  };

  // Handle submenu clicks
  const handleSubMenuClick = (item: SubItem) => {
    if (item.comingSoon) {
      // If the feature is coming soon, navigate to coming soon page with title and return path
      router.push(`/coming-soon?title=${encodeURIComponent(item.name)}&returnPath=/dashboards/student`);
      return;
    }
    
    // Otherwise navigate to the actual path
    if (item.path) {
      router.push(item.path);
    }
  };

  // Determine which items to display based on the user's role
  const effectiveIsAdmin = isAdmin || isPathAdmin;
  const effectiveIsInstructor = isInstructor || isPathInstructor;
  const effectiveIsCorporate = isCorporate || isPathCorporate;
  const effectiveIsCorporateEmp = isCorporateEmp || isPathCorporateEmp;

  // Create personalized welcome message
  const welcomeMessage = userName ? `Hello, ${userName.split(' ')[0]}` : `Hello, ${role.charAt(0).toUpperCase() + role.slice(1)}`;

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
          onClick: () => handleMenuClick("mycourses")
        },
        {
          name: "My Membership",
          icon: <Users className="w-5 h-5" />,
          onClick: () => handleMenuClick("membership")
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
          onClick: () => handleMenuClick("quizzes")
        }
      ]
    },
    {
      title: "Support & Documents",
      items: [
        {
          name: "Feedback & Support",
          icon: <MessageCircle className="w-5 h-5" />,
          onClick: () => handleMenuClick("feedback")
        },
        {
          name: "Certificates",
          icon: <Award className="w-5 h-5" />,
          onClick: () => handleMenuClick("certificates")
        },
        {
          name: "Payments",
          icon: <CreditCard className="w-5 h-5" />,
          onClick: () => handleMenuClick("payments")
        },
        {
          name: "Apply for Placement",
          icon: <Briefcase className="w-5 h-5" />,
          onClick: () => handleMenuClick("placement")
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
              icon: <LayoutGrid className="w-4 h-4" />
            },
            {
              name: "My Profile",
              path: "/dashboards/admin-settings",
              icon: <UserCircle className="w-4 h-4" />
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
              icon: <DollarSign className="w-4 h-4" />
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
              onClick: () => handleMenuClick("admin-course-categories"),
              icon: <FolderTree className="w-4 h-4" />
            },
            {
              name: "Create New Course",
              onClick: () => handleMenuClick("add-course"),
              icon: <Plus className="w-4 h-4" />
            },
            {
              name: "Edit/Archive Courses",
              path: "/dashboards/admin-edit-courses",
              icon: <Pencil className="w-4 h-4" />
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
              path: "/dashboards/admin-view-students",
              icon: <Users className="w-4 h-4" />
            },
            {
              name: "Add New Student",
              path: "/dashboards/admin-add-student",
              icon: <UserPlus className="w-4 h-4" />
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
              path: "/dashboards/admin-view-instructors",
              icon: <Users className="w-4 h-4" />
            },
            {
              name: "Add New Instructor",
              path: "/dashboards/admin-add-instructor",
              icon: <UserPlus className="w-4 h-4" />
            },
            {
              name: "Edit Instructor Profiles",
              path: "/dashboards/admin-edit-instructor",
              icon: <UserCog className="w-4 h-4" />
            },
            {
              name: "Batch Assignment",
              path: "/dashboards/admin-assign-instructor",
              icon: <FileCheck className="w-4 h-4" />
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
          onClick: () => handleMenuClick("timetable")
        },
        {
          name: "Certificate Management",
          icon: <Award className="w-5 h-5" />,
          onClick: () => handleMenuClick("certificates")
        },
        {
          name: "Membership Management",
          icon: <Users className="w-5 h-5" />,
          onClick: () => handleMenuClick("membership")
        },
        {
          name: "Attendance Management",
          icon: <CheckSquare className="w-5 h-5" />,
          onClick: () => handleMenuClick("attendance")
        },
        {
          name: "Fees Management",
          icon: <CreditCard className="w-5 h-5" />,
          onClick: () => handleMenuClick("fees")
        }
      ]
    },
    {
      title: "Content & Resources",
      items: [
        {
          name: "Marketing & Notices",
          icon: <Megaphone className="w-5 h-5" />,
          onClick: () => handleMenuClick("marketing")
        },
        {
          name: "Resources Management",
          icon: <FolderOpen className="w-5 h-5" />,
          onClick: () => handleMenuClick("resources")
        },
        {
          name: "Feedback & Grievances",
          icon: <MessageCircle className="w-5 h-5" />,
          onClick: () => handleMenuClick("feedback")
        },
        {
          name: "Blogs Management",
          icon: <FileText className="w-5 h-5" />,
          onClick: () => handleMenuClick("blogs")
        }
      ]
    },
    {
      title: "Enterprise",
      items: [
        {
          name: "Corporate Management",
          icon: <Building className="w-5 h-5" />,
          onClick: () => handleMenuClick("corporate")
        },
        {
          name: "Institution Management",
          icon: <School className="w-5 h-5" />,
          onClick: () => handleMenuClick("institution")
        },
        {
          name: "Join Medh (Careers)",
          icon: <Briefcase className="w-5 h-5" />,
          onClick: () => handleMenuClick("careers")
        },
        {
          name: "Query Forms Management",
          icon: <ClipboardList className="w-5 h-5" />,
          onClick: () => handleMenuClick("queries")
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

  // Choose the appropriate sidebar based on role
  const activeSidebar = effectiveIsAdmin ? adminSidebar : 
                        effectiveIsInstructor ? [] : 
                        effectiveIsCorporate ? [] : 
                        effectiveIsCorporateEmp ? [] : 
                        studentSidebar;

  if (!mounted) {
    return null;
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 border-r dark:border-gray-700">
      {/* Header */}
      <div className="p-6 flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
            Medh
          </h1>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
        
        {/* User welcome */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold">
            {userName ? userName.charAt(0).toUpperCase() : role.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {welcomeMessage}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {role.charAt(0).toUpperCase() + role.slice(1)} Account
            </p>
          </div>
        </div>
      </div>
      
      {/* Navigation - Scrollable */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 px-4">
        <nav className="py-4 space-y-6">
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
                      onClick={item.onClick || (() => setActiveMenu(activeMenu === item.name ? null : item.name))}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                        activeMenu === item.name
                          ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400" 
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
                            activeMenu === item.name ? "rotate-180" : ""
                          }`} 
                        />
                      )}
                    </button>
                    
                    {/* Submenu if any */}
                    {item.subItems && activeMenu === item.name && (
                      <AnimatePresence>
                        <motion.ul
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-1 ml-8 space-y-1"
                        >
                          {item.subItems.map((subItem, subItemIndex) => (
                            <motion.li 
                              key={subItemIndex}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: subItemIndex * 0.05 }}
                            >
                              <button
                                onClick={() => handleSubMenuClick(subItem)}
                                className={`flex w-full items-center rounded-lg px-3 py-2 text-sm ${
                                  subItem.comingSoon
                                    ? "text-gray-400 dark:text-gray-500"
                                    : pathname === subItem.path
                                      ? "text-primary-600 dark:text-primary-400 font-medium"
                                      : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                                }`}
                              >
                                <span className="w-4 h-4 mr-3">{subItem.icon}</span>
                                <span>{subItem.name}</span>
                                {subItem.comingSoon && (
                                  <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                                    Soon
                                  </span>
                                )}
                              </button>
                            </motion.li>
                          ))}
                        </motion.ul>
                      </AnimatePresence>
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
      </div>
    </div>
  );
};

export default SidebarDashboard;