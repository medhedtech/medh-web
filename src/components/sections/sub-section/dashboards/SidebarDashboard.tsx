"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState, useCallback, useRef } from "react";
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
  ChevronRight,
  Menu,
  LifeBuoy,
  BookOpenCheck,
  ChevronLeft,
  LucideIcon,
  LucideProps,
  ShieldCheck,
  Banknote,
  Activity,
  ChevronUp
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
  onClick?: () => void;
}

interface MenuItem {
  name: string;
  path?: string;
  icon: React.ReactNode;
  onClick?: () => void;
  subItems?: SubItem[];
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
  isOpen?: boolean;  // Controls the sidebar's visibility
  onOpenChange?: (isOpen: boolean) => void;  // Callback when sidebar open state changes
  isExpanded?: boolean;  // Controls whether sidebar is expanded or collapsed
  onExpandedChange?: (isExpanded: boolean) => void;  // Callback when expanded state changes
}

// Sidebar animation variants
const sidebarVariants = {
  expanded: {
    width: '260px', // Increased from 220px to provide more space
    transition: {
      type: 'spring',
      stiffness: 190,
      damping: 20,
      mass: 0.7,
      duration: 0.4,
      bounce: 0.1,
      restSpeed: 0.001
    }
  },
  collapsed: {
    width: '78px', // Increased from 68px to provide more space for icons
    transition: {
      type: 'spring',
      stiffness: 160,  // Lower stiffness for slower animation
      damping: 28,     // Higher damping for smoother motion
      mass: 1.0,       // Balanced mass for natural movement
      duration: 0.5,   // Slightly shorter duration for better feel
      restSpeed: 0.001
    }
  }
};

// Animation variants for menu items
const itemVariants = {
  expanded: {
    opacity: 1,
    x: 0,
    display: "block",
    transition: {
      duration: 0.22,
      ease: [0.3, 0.0, 0.2, 1],
      display: { delay: 0 }
    }
  },
  collapsed: {
    opacity: 0,
    x: -12,
    transition: {
      duration: 0.25,  // Slightly faster fade out for better timing with sidebar
      ease: [0.4, 0.0, 0.2, 1]
    },
    transitionEnd: {
      display: "none"
    }
  }
};

// Animation variants when a dropdown is open (for compacting other items)
const compactItemVariants = {
  normal: {
    height: 'auto',
    marginTop: '4px',
    marginBottom: '4px',
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.2, 0.0, 0.2, 1]
    }
  },
  compact: {
    height: 'auto',
    marginTop: '0px',
    marginBottom: '0px',
    opacity: 0.8,
    scale: 0.95,
    transition: {
      duration: 0.35,
      ease: [0.2, 0.0, 0.2, 1]
    }
  },
  veryCompact: {
    height: 'auto',
    marginTop: '0px',
    marginBottom: '0px',
    opacity: 0.7,
    scale: 0.92,
    transition: {
      duration: 0.35,
      ease: [0.2, 0.0, 0.2, 1]
    }
  }
};

// Icon animation variants - only for header icon
const headerIconVariants = {
  expanded: {
    rotate: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeInOut"
    }
  },
  collapsed: {
    rotate: 360,
    scale: 1.2,
    transition: {
      duration: 0.6,
      ease: "easeInOut"
    }
  }
};

// Icon container animation variants - ensures stability during transitions
const iconContainerVariants = {
  expanded: {
    width: '44px',
    height: '44px',
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  },
  collapsed: {
    width: '44px',
    height: '44px',
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

// Chevron animation variants
const chevronVariants = {
  open: {
    rotate: 180,
    opacity: 1,
    scale: 1.1,
    transition: {
      duration: 0.4,
      ease: "easeInOut"
    }
  },
  closed: {
    rotate: 0,
    opacity: 0.7,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

// Active icon variants - for currently active menu items
const activeIconVariants = {
  initial: {
    scale: 1,
    rotate: 0
  },
  active: {
    scale: 1.08,
    rotate: 360,
    transition: {
      rotate: { duration: 0.8, ease: "easeInOut" },
      scale: { duration: 0.4, ease: "easeOut" }
    }
  }
};

// Animation variants for submenu
const submenuVariants = {
  open: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: {
        duration: 0.5,
        ease: [0.2, 0.0, 0.2, 1]
      },
      opacity: {
        duration: 0.4,
        ease: [0.2, 0.0, 0.2, 1]
      }
    }
  },
  closed: {
    height: 0,
    opacity: 0,
    transition: {
      height: {
        duration: 0.4,  // Slower height collapse
        ease: [0.4, 0.0, 0.2, 1]
      },
      opacity: {
        duration: 0.25,
        ease: [0.4, 0.0, 0.2, 1]
      }
    }
  }
};

// Container animation variants
const containerVariants = {
  expanded: {
    paddingLeft: '14px',
    paddingRight: '14px',
    transition: {
      type: 'spring',
      stiffness: 170,
      damping: 26,
      duration: 0.35
    }
  },
  collapsed: {
    paddingLeft: '8px',
    paddingRight: '8px',
    transition: {
      type: 'spring',
      stiffness: 170,
      damping: 26,
      duration: 0.35
    }
  }
};

// Define consistent icon size and container sizes
const ICON_SIZE_MAIN = 22;
const ICON_SIZE_SUB = 18; // Increased from 16 to 18 for better visibility
const CHEVRON_SIZE = 18;
const ICON_CONTAINER_SIZE = "44px"; // Consistent size for all icon containers
const SUBMENU_MAX_HEIGHT = 500; // Increased from 300 to 500 for more spacious dropdowns

const SidebarDashboard: React.FC<SidebarDashboardProps> = ({
  userRole,
  fullName,
  userEmail,
  userImage,
  userNotifications,
  userSettings,
  onMenuClick,
  isOpen,
  onOpenChange,
  isExpanded: propIsExpanded,
  onExpandedChange
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isCollapsible, setIsCollapsible] = useState<boolean>(true);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const sidebarNavRef = useRef<HTMLDivElement>(null);
  const [showScrollIndicators, setShowScrollIndicators] = useState<{top: boolean, bottom: boolean}>({top: false, bottom: true});
  
  // Use the prop values if provided, otherwise use internal state
  const effectiveIsExpanded = typeof propIsExpanded !== 'undefined' ? propIsExpanded : isExpanded;

  // Function to check scroll position and update indicators
  const updateScrollIndicators = useCallback(() => {
    if (!sidebarNavRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = sidebarNavRef.current;
    const atTop = scrollTop <= 10;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 10;
    
    setShowScrollIndicators({
      top: !atTop,
      bottom: !atBottom
    });
  }, []);
  
  // Initialize component
  useEffect(() => {
    setMounted(true);
    
    // Check if device is mobile
    const checkMobile = () => {
      const isMobile = window.innerWidth < 1024;
      setIsMobileDevice(isMobile);
      // Don't auto-expand sidebar on any device - always start collapsed
      // This ensures consistent behavior across all dashboard layouts
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
    
    // Click outside handler to collapse sidebar on mobile
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileDevice && 
          sidebarRef.current && 
          !sidebarRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    // Register click outside listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Initialize scroll indicators
    updateScrollIndicators();
    
    // Clean up event listeners
    return () => {
      window.removeEventListener("resize", checkMobile);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileDevice, updateScrollIndicators]);

  // Update expanded state when prop changes
  useEffect(() => {
    if (typeof propIsExpanded !== 'undefined') {
      setIsExpanded(propIsExpanded);
    }
    // On first mount, always start with collapsed sidebar regardless of screen size
    else if (!mounted) {
      setIsExpanded(false);
    }
  }, [propIsExpanded, mounted]);
  
  // Setup scroll event listener for the sidebar navigation
  useEffect(() => {
    const navElement = sidebarNavRef.current;
    if (navElement) {
      navElement.addEventListener('scroll', updateScrollIndicators);
      
      return () => {
        navElement.removeEventListener('scroll', updateScrollIndicators);
      };
    }
  }, [updateScrollIndicators]);

  // Scrolling functions
  const scrollToTop = () => {
    if (sidebarNavRef.current) {
      sidebarNavRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };
  
  const scrollToBottom = () => {
    if (sidebarNavRef.current) {
      sidebarNavRef.current.scrollTo({
        top: sidebarNavRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // Scroll to active menu item
  const scrollToActiveMenu = useCallback((menuName: string) => {
    if (!effectiveIsExpanded) return;
    
    setTimeout(() => {
      const activeElement = document.getElementById(`menu-item-${menuName}`);
      if (activeElement && sidebarNavRef.current) {
        // Calculate position relative to scrollable container
        const containerRect = sidebarNavRef.current.getBoundingClientRect();
        const elementRect = activeElement.getBoundingClientRect();
        
        // Check if element is outside of visible area
        const isAbove = elementRect.top < containerRect.top + 20;
        const isBelow = elementRect.bottom > containerRect.bottom - 20;
        
        if (isAbove || isBelow) {
          activeElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: isBelow ? 'end' : 'start'
          });
          
          // Update indicators after scrolling
          setTimeout(updateScrollIndicators, 500);
        }
      }
    }, 100);
  }, [effectiveIsExpanded, updateScrollIndicators]);
  
  // Use effect to scroll to pathname-matched active item
  useEffect(() => {
    if (pathname && effectiveIsExpanded && mounted) {
      // Find the menu item that matches the current path
      const menuItems = getMenuItemsByRole(userRole);
      let foundMenu: string | null = null;
      
      // Check main items
      for (const item of menuItems) {
        if (item.path && pathname.startsWith(item.path)) {
          foundMenu = item.name;
          break;
        }
        
        // Check sub items
        if (item.subItems) {
          for (const subItem of item.subItems) {
            if (subItem.path && pathname.startsWith(subItem.path)) {
              foundMenu = item.name;
              // Open the submenu
              setOpenSubMenu(item.name);
              break;
            }
          }
          if (foundMenu) break;
        }
      }
      
      // If we found a matching menu, scroll to it
      if (foundMenu) {
        scrollToActiveMenu(foundMenu);
      }
    }
  }, [pathname, effectiveIsExpanded, mounted, userRole, scrollToActiveMenu]);

  // Notify parent component when expanded state changes internally
  const handleExpandedChange = (expanded: boolean) => {
    setIsExpanded(expanded);
    if (onExpandedChange) {
      onExpandedChange(expanded);
    }
  };

  // First, create a helper function to format routes
  const formatRoute = (role: string, pageName: string): string => {
    // Remove any existing "role-" prefix from pageName if it exists
    const cleanPageName = pageName.replace(/^(admin|student|instructor|parent|coorporate)-/, '');
    return `/dashboards/${role}/${cleanPageName}/`;
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

  // Toggle sidebar expansion state
  const toggleSidebar = () => {
    const newExpanded = !effectiveIsExpanded;
    if (onExpandedChange) {
      onExpandedChange(newExpanded);
    } else {
      setIsExpanded(newExpanded);
    }
    
    // Notify parent about open state change if needed
    if (onOpenChange && isMobileDevice && !newExpanded) {
      onOpenChange(false);
    }
  };

  // Handle menu clicks with scrolling behavior
  const handleMenuClick = (menuName: string, item: MenuItem) => {
    if (item.subItems && item.subItems.length > 0) {
      // Close other open submenus when opening a new one (accordion behavior)
      if (openSubMenu !== menuName) {
        setOpenSubMenu(menuName);
        scrollToActiveMenu(menuName);
      } else {
        setOpenSubMenu(null);
      }
    } else if (item.onClick) {
      // Execute onClick callback if provided
      item.onClick();
    } else if (item.path) {
      // Navigate to the path
      router.push(item.path);
    }
  };

  // Modern student sidebar items
  const studentMenuItems: MenuItem[] = [
        {
          name: "Dashboard",
      path: "/dashboards",
      icon: <HomeIcon className="w-5 h-5" />
    },
        {
          name: "My Courses",
      path: formatRoute("student", "my-courses"),
          icon: <BookOpen className="w-5 h-5" />,
          subItems: [
            {
          name: "All Courses",
          path: "/dashboards/student/all-courses",
          icon: <LayoutGrid className="w-4 h-4" />
        },
        {
          name: "In Progress",
              path: formatRoute("student", "enrolled-courses"),
          icon: <TrendingUp className="w-4 h-4" />
        },
        {
          name: "Completed",
          path: formatRoute("student", "completed-courses"),
          icon: <CheckCircle className="w-4 h-4" />
            }
          ]
        },
        {
          name: "Resources",
      path: formatRoute("student", "resources"),
          icon: <FolderOpen className="w-5 h-5" />,
          subItems: [
            {
          name: "Course Materials",
              path: formatRoute("student", "lesson-course-materials"),
              icon: <FileText className="w-4 h-4" />
            },
            {
          name: "Assignments",
              path: formatRoute("student", "assignments"),
              icon: <Clipboard className="w-4 h-4" />
            },
            {
          name: "Quizzes",
              path: formatRoute("student", "quiz"),
              icon: <CheckSquare className="w-4 h-4" />
        }
      ]
    },
    {
      name: "Live Classes",
      path: formatRoute("student", "upcoming-classes"),
      icon: <Video className="w-5 h-5" />,
          subItems: [
            {
          name: "Upcoming Classes",
          path: formatRoute("student", "upcoming-classes"),
              icon: <CalendarDays className="w-4 h-4" />
            },
            {
          name: "Join Live Class",
          path: formatRoute("student", "join-live"),
          icon: <Play className="w-4 h-4" />
            },
            {
              name: "Recorded Sessions",
          path: formatRoute("student", "access-recorded-sessions"),
              icon: <Video className="w-4 h-4" />
            }
          ]
        },
        {
      name: "Certificates",
      path: formatRoute("student", "certificate"),
      icon: <Award className="w-5 h-5" />
    },
    {
      name: "Feedback & Support",
      path: formatRoute("student", "feedback"),
      icon: <LifeBuoy className="w-5 h-5" />
    },
    {
      name: "Apply for Placement",
      path: formatRoute("student", "apply"),
      icon: <Briefcase className="w-5 h-5" />
    },
    {
      name: "Profile",
      path: formatRoute("student", "profile"),
      icon: <UserCircle className="w-5 h-5" />
    }
  ];

  // Modern admin sidebar items
  const adminMenuItems: MenuItem[] = [
    {
      name: "Dashboard",
      path: "/dashboards",
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      name: "Courses",
      icon: <BookOpen className="w-5 h-5" />,
      subItems: [
        {
          name: "All Courses",
          path: "/courses",
          icon: <LayoutGrid className="w-5 h-5" />
        },
        {
          name: "My Courses",
          path: `/dashboards/${userRole}/my-courses`,
          icon: <BookOpenCheck className="w-5 h-5" />
        },
        {
          name: "Live Classes",
          path: `/dashboards/${userRole}/live-classes`,
          icon: <Video className="w-5 h-5" />
        }
      ]
    },
    {
      name: "Course Management",
      path: formatRoute("admin", "course"),
      icon: <BookOpen className="w-5 h-5" />,
      subItems: [
        {
          name: "All Courses",
          path: formatRoute("admin", "listofcourse"),
          icon: <LayoutGrid className="w-4 h-4" />
        },
        {
          name: "Add Course",
          path: formatRoute("admin", "add-courses"),
          icon: <Plus className="w-4 h-4" />
        },
        {
          name: "Update Course",
          path: formatRoute("admin", "edit-courses"),
          icon: <Pencil className="w-4 h-4" />
        },
        {
          name: "Categories",
          path: formatRoute("admin", "course-categories"),
          icon: <FolderTree className="w-4 h-4" />
        }
      ]
    },
    {
      name: "User Management",
      icon: <Users className="w-5 h-5" />,
      subItems: [
        {
          name: "Student Management",
          path: formatRoute("admin", "students"),
          icon: <User className="w-4 h-4" />
        },
        {
          name: "Instructor Management",
          path: formatRoute("admin", "Instuctoremange"),
          icon: <GraduationCap className="w-4 h-4" />
        },
        
        {
          name: "Add Instructor",
          path: formatRoute("admin", "add-instructor"),
          icon: <UserPlus className="w-4 h-4" />
        },
        {
          name: "Add Student",
          path: formatRoute("admin", "add-student"),
          icon: <UserPlus className="w-4 h-4" />
        }
      ]
    },
    {
      name: "Classes",
      icon: <Calendar className="w-5 h-5" />,
      subItems: [
        {
          name: "Online Classes",
          path: formatRoute("admin", "online-class"),
          icon: <Video className="w-4 h-4" />
        },
        {
          name: "Schedule Class",
          path: formatRoute("admin", "schonlineclass"),
          icon: <CalendarDays className="w-4 h-4" />
        }
      ]
    },
    {
      name: "Finance",
      icon: <DollarSign className="w-5 h-5" />,
      subItems: [
        {
          name: "Course Fees",
          path: formatRoute("admin", "course-fee"),
          icon: <CreditCard className="w-4 h-4" />
        },
        {
          name: "Currency Settings",
          path: formatRoute("admin", "currency"),
          icon: <Banknote className="w-4 h-4" />
        },
        {
          name: "Instructor Payouts",
          path: formatRoute("admin", "instructor-payouts"),
          icon: <Wallet className="w-4 h-4" />
        }
      ]
    },
    {
      name: "Certificates",
      path: formatRoute("admin", "GenrateCertificate"),
      icon: <Award className="w-5 h-5" />
    },
    {
      name: "Content",
      icon: <FileText className="w-5 h-5" />,
      subItems: [
        {
          name: "Blogs",
          path: formatRoute("admin", "blogs"),
          icon: <BookOpen className="w-4 h-4" />
        },
        {
          name: "Reviews",
          path: formatRoute("admin", "reviews"),
          icon: <Star className="w-4 h-4" />
        },
        {
          name: "Home Editor",
          path: formatRoute("admin", "home-editor"),
          icon: <LayoutGrid className="w-4 h-4" />
        }
      ]
    },
    {
      name: "Forms & Queries",
      icon: <ClipboardList className="w-5 h-5" />,
      subItems: [
        {
          name: "Get In Touch",
          path: formatRoute("admin", "get-in-touch"),
          icon: <MessageCircle className="w-4 h-4" />
        },
        {
          name: "Enrollment Forms",
          path: formatRoute("admin", "enrollments"),
          icon: <FileText className="w-4 h-4" />
        },
        {
          name: "Feedback & Complaints",
          path: formatRoute("admin", "feedback-and-complaints"),
          icon: <MessageSquare className="w-4 h-4" />
        },
        {
          name: "Job Applicants",
          path: formatRoute("admin", "job-applicants"),
          icon: <Briefcase className="w-4 h-4" />
        }
      ]
    },
    {
      name: "Analytics",
      icon: <BarChart className="w-5 h-5" />,
      subItems: [
        {
          name: "Country",
          path: formatRoute("admin", "country"),
          icon: <Globe className="w-4 h-4" />
        },
        {
          name: "Age Group",
          path: formatRoute("admin", "age-group"),
          icon: <Users className="w-4 h-4" />
        },
        {
          name: "Batch",
          path: formatRoute("admin", "batch"),
          icon: <Folders className="w-4 h-4" />
        },
        {
          name: "Duration",
          path: formatRoute("admin", "duration"),
          icon: <Clock className="w-4 h-4" />
        },
        {
          name: "Grade Group",
          path: formatRoute("admin", "grade-group"),
          icon: <CheckSquare className="w-4 h-4" />
        }
      ]
    },
    {
      name: "Placements",
      path: formatRoute("admin", "placements"),
      icon: <Briefcase className="w-5 h-5" />
    },
    {
      name: "Task Management",
      path: formatRoute("admin", "task-management"),
      icon: <ClipboardList className="w-5 h-5" />
    },
    {
      name: "Settings",
      path: formatRoute("admin", "settings"),
      icon: <Settings className="w-5 h-5" />
    },
    {
      name: "Profile",
      path: formatRoute("admin", "profile"),
      icon: <UserCircle className="w-5 h-5" />
    }
  ];

  // Modern instructor sidebar items
  const instructorMenuItems: MenuItem[] = [
    {
      name: "Dashboard",
      path: "/dashboards",
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      name: "My Courses",
      path: formatRoute("instructor", "course"),
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      name: "Live Classes",
      path: formatRoute("instructor", "class"),
      icon: <Video className="w-5 h-5" />,
      subItems: [
        {
          name: "My Classes",
          path: formatRoute("instructor", "mainclass"),
          icon: <Calendar className="w-4 h-4" />
        },
        {
          name: "Track Students",
          path: formatRoute("instructor", "track"),
          icon: <LineChart className="w-4 h-4" />
        }
      ]
    },
    {
      name: "Assignments",
      path: formatRoute("instructor", "assignments"),
      icon: <ClipboardList className="w-5 h-5" />,
      subItems: [
        {
          name: "View Assignments",
          path: formatRoute("instructor", "view-assignments"),
          icon: <FileText className="w-4 h-4" />
        },
        {
          name: "Grade Assignments",
          path: formatRoute("instructor", "assignments"),
          icon: <CheckCircle className="w-4 h-4" />
        }
      ]
    },
    {
      name: "Quiz Management",
      icon: <CheckSquare className="w-5 h-5" />,
      subItems: [
        {
          name: "View Quizzes",
          path: formatRoute("instructor", "view-quizes"),
          icon: <BookOpen className="w-4 h-4" />
        },
        {
          name: "Quiz Attempts",
          path: formatRoute("instructor", "quiz-attempts"),
          icon: <Activity className="w-4 h-4" />
        },
        {
          name: "My Quiz Attempts",
          path: formatRoute("instructor", "my-quiz-attempts"),
          icon: <ListChecks className="w-4 h-4" />
        }
      ]
    },
    {
      name: "Communication",
      icon: <MessageCircle className="w-5 h-5" />,
      subItems: [
        {
          name: "Announcements",
          path: formatRoute("instructor", "announcments"),
          icon: <Bell className="w-4 h-4" />
        },
        {
          name: "Messages",
          path: formatRoute("instructor", "message"),
          icon: <Mail className="w-4 h-4" />
        },
        {
          name: "Reviews",
          path: formatRoute("instructor", "reviews"),
          icon: <Star className="w-4 h-4" />
        },
        {
          name: "Feedbacks",
          path: formatRoute("instructor", "feedbacks"),
          icon: <MessageSquare className="w-4 h-4" />
        }
      ]
    },
    {
      name: "Orders",
      path: formatRoute("instructor", "order-history"),
      icon: <ShoppingCart className="w-5 h-5" />
    },
    {
      name: "Wishlist",
      path: formatRoute("instructor", "wishlist"),
      icon: <Heart className="w-5 h-5" />
    },
    {
      name: "Settings",
      path: formatRoute("instructor", "settings"),
      icon: <Settings className="w-5 h-5" />
    },
    {
      name: "Profile",
      path: formatRoute("instructor", "profile"),
      icon: <UserCircle className="w-5 h-5" />
    }
  ];

  // Action items for each role
  const actionItems: Record<string, MenuItem[]> = {
    default: [
      {
        name: "Settings",
        path: "/profile/settings",
        icon: <Settings className="w-5 h-5" />
      }
    ],
    student: [
      {
        name: "Settings",
        path: formatRoute("student", "settings"),
        icon: <Settings className="w-5 h-5" />
      }
    ],
    admin: [
      {
        name: "Settings",
        path: formatRoute("admin", "settings"),
        icon: <Settings className="w-5 h-5" />
      }
    ],
    instructor: [
      {
        name: "Settings",
        path: formatRoute("instructor", "settings"),
        icon: <Settings className="w-5 h-5" />
      }
    ]
  };

  if (!mounted) {
    return null;
  }

  // Get menu items based on user role
  const getMenuItemsByRole = (role: string): MenuItem[] => {
    if (role.includes('admin')) {
      return adminMenuItems;
    } else if (role.includes('instructor')) {
      return instructorMenuItems;
    } else if (role.includes('student')) {
      return studentMenuItems;
    }

    // Default fallback for unknown roles
    return [
      {
        name: "Dashboard",
        path: `/dashboards/${role}`,
        icon: <LayoutDashboard className="w-5 h-5" />
      },
      {
        name: "Profile",
        path: formatRoute(role, "profile"),
        icon: <UserCircle className="w-5 h-5" />
      }
    ];
  };

  // Get the action items based on user role
  const getActionItemsByRole = (role: string): MenuItem[] => {
    role = role.toLowerCase();
    
    if (actionItems[role]) {
      return actionItems[role];
    }
    
    return actionItems.default;
  };

  // Check if a menu item is active based on current path
  const isMenuActive = (item: MenuItem): boolean => {
    if (!pathname) return false;
    
    if (item.path && pathname.startsWith(item.path)) {
      return true;
    }
    
    if (item.subItems) {
      return item.subItems.some(subItem => subItem.path && pathname.startsWith(subItem.path));
    }
    
    return false;
  };

  // Get the menu items for the current user role
  const menuItems = getMenuItemsByRole(userRole);
  const currentActionItems = getActionItemsByRole(userRole);

  // Main return with improved sidebar
  return (
    <motion.div 
      ref={sidebarRef}
      variants={sidebarVariants}
      initial="collapsed"
      animate={effectiveIsExpanded ? "expanded" : "collapsed"}
      className="flex flex-col h-auto bg-white dark:bg-gray-900 border-r dark:border-gray-700 shadow-md z-20 fixed lg:relative"
      style={{ 
        minHeight: 'calc(100vh - 64px)',
        top: '70px', /* Increased from 64px to add spacing */
        position: 'fixed',
        overflow: 'hidden' /* Hide overflow at container level */
      }}
      onMouseEnter={() => isCollapsible && handleExpandedChange(true)}
      onMouseLeave={() => isCollapsible && !isMobileDevice && handleExpandedChange(false)}
    >
      {/* Main scrollable container */}
      <div 
        className="h-full flex flex-col overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent"
        style={{ maxHeight: 'calc(100vh - 70px)' }}
      >
        {/* Minimal header - Sticky */}
        <div className="pt-5 pb-3 px-2 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
        <div className="h-12 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {effectiveIsExpanded ? (
              <motion.span 
                key="expanded-title"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="text-sm font-medium bg-gradient-to-r from-primary-500 to-violet-500 bg-clip-text text-transparent"
              >
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard
              </motion.span>
            ) : (
              <motion.div 
                key="collapsed-icon"
                variants={headerIconVariants}
                initial="expanded"
                animate="collapsed"
                exit="expanded"
                className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-primary-100 to-violet-100 dark:from-primary-900/30 dark:to-violet-900/30 shadow-sm"
              >
                <LayoutDashboard className="w-[22px] h-[22px] text-primary-600 dark:text-primary-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
        {/* Main navigation area */}
        <div className="flex-1">
      <motion.div 
            ref={sidebarNavRef}
        variants={containerVariants}
            className="py-2"
            onScroll={updateScrollIndicators}
          >
            <div className="py-2 space-y-1"> {/* Increased from space-y-0.5 to space-y-1 for better spacing */}
              {/* Menu items rendering (unchanged) */}
              {menuItems.map((item, index) => {
            const isActive = isMenuActive(item);
                    const hasSubItems = item.subItems && item.subItems.length > 0;
            const isSubMenuOpen = openSubMenu === item.name;
                const hasLongSubMenu = hasSubItems && item.subItems!.length > 5;
                
                // Enhanced compaction logic
                const getCompactMode = () => {
                  if (!effectiveIsExpanded || openSubMenu === null) return "normal";
                  // Active item or its submenu is open - keep normal
                  if (isSubMenuOpen) return "normal";
                  // Extra compact for items far from the active menu
                  const activeIndex = menuItems.findIndex(m => m.name === openSubMenu);
                  const distance = Math.abs(activeIndex - index);
                  return distance > 2 ? "veryCompact" : "compact";
                };
                
                const compactMode = getCompactMode();
                const isVeryCompact = compactMode === "veryCompact";
                const isCompact = compactMode === "compact";
                    
                    return (
                  <motion.div 
                    key={index} 
                    className={`select-none px-2 ${isCompact || isVeryCompact ? 'opacity-80' : 'opacity-100'}`}
                    id={`menu-item-${item.name}`}
                    variants={compactItemVariants}
                    initial="normal"
                    animate={compactMode}
                  >
                    {/* Menu item button */}
                        <button
                  onClick={() => handleMenuClick(item.name, item)}
                      className={`flex items-center w-full rounded-xl transition-all duration-200
                    ${isActive 
                      ? "bg-primary-50/80 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400" 
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                    }
                    ${effectiveIsExpanded ? "justify-between" : "justify-center"}
                    ${isSubMenuOpen ? "mb-1" : ""}
                        ${isVeryCompact ? "py-1.5" : isCompact ? "py-2" : "p-3"}
                  `}
                >
                  <div className="flex items-center min-w-[42px]">
                    <motion.div 
                      variants={iconContainerVariants}
                      initial="expanded"
                      animate={effectiveIsExpanded ? "expanded" : "collapsed"}
                      className={`flex items-center justify-center rounded-full transition-colors duration-200
                        ${isActive 
                          ? "bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/40 dark:to-primary-900/20 shadow-sm" 
                          : "bg-gray-50 dark:bg-gray-800/80"
                            }
                            ${isVeryCompact ? "scale-85" : isCompact ? "scale-90" : ""}
                          `}
                      style={{ 
                            width: isVeryCompact ? "38px" : isCompact ? "40px" : ICON_CONTAINER_SIZE, 
                            height: isVeryCompact ? "38px" : isCompact ? "40px" : ICON_CONTAINER_SIZE,
                            minWidth: isVeryCompact ? "38px" : isCompact ? "40px" : ICON_CONTAINER_SIZE,
                            minHeight: isVeryCompact ? "38px" : isCompact ? "40px" : ICON_CONTAINER_SIZE
                      }}
                    >
                      <div className={`flex items-center justify-center text-${isActive ? 'primary-600 dark:text-primary-400' : 'gray-600 dark:text-gray-400'}`}>
                            <div className={`${isVeryCompact ? "w-[18px] h-[18px]" : isCompact ? "w-[20px] h-[20px]" : "w-[22px] h-[22px]"} flex items-center justify-center`}>
                              {item.icon}
                          </div>
                      </div>
                    </motion.div>
                    
                    {effectiveIsExpanded && (
                      <motion.span
                        variants={itemVariants}
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                            className={`ml-3 font-medium text-left line-clamp-1 whitespace-normal overflow-visible
                              ${isVeryCompact ? "text-[12px]" : isCompact ? "text-[13px]" : "text-[14px]"}
                            `}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </div>
                  
                  {effectiveIsExpanded && hasSubItems && (
                    <motion.div
                      variants={chevronVariants}
                      initial="closed"
                      animate={isSubMenuOpen ? "open" : "closed"}
                          className={`flex items-center justify-center rounded-full
                            ${isVeryCompact ? "w-5 h-5 mr-0" : isCompact ? "w-6 h-6 mr-0" : "w-6 h-6 mr-1"}
                          `}
                    >
                          <ChevronDown className={`${isVeryCompact ? "w-[14px] h-[14px]" : isCompact ? "w-[16px] h-[16px]" : "w-[18px] h-[18px]"} text-gray-500 dark:text-gray-400`} />
                    </motion.div>
                          )}
                        </button>
                        
                    {/* Submenu - with improved compact style and max height */}
                <AnimatePresence initial={false}>
                  {effectiveIsExpanded && isSubMenuOpen && hasSubItems && (
                            <motion.div
                      key={`submenu-${item.name}`}
                      variants={submenuVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                          className="overflow-hidden px-2 mt-2"
                        >
                          <div 
                            className={`py-3 space-y-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 shadow-md ${
                              hasLongSubMenu ? `max-h-[${SUBMENU_MAX_HEIGHT}px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent` : ''
                            }`}
                          >
                        {item.subItems?.map((subItem, subIndex) => {
                          const isSubItemActive = subItem.path && pathname?.startsWith(subItem.path);
                          
                          return (
                                  <button
                              key={subIndex}
                              onClick={() => {
                                if (subItem.onClick) {
                                  subItem.onClick();
                                } else if (subItem.path) {
                                  router.push(subItem.path);
                                }
                              }}
                                  className={`flex items-center w-full text-left rounded-lg px-4 py-2.5 transition-all duration-200
                                ${isSubItemActive 
                                  ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium" 
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
                                }`}
                            >
                                  <div className={`w-5 h-5 mr-2.5 flex-shrink-0 flex items-center justify-center ${
                                isSubItemActive ? 'text-primary-600 dark:text-primary-300' : 'text-gray-600 dark:text-gray-400'
                              }`}>
                                    <div className="w-[18px] h-[18px] flex items-center justify-center">
                                      {subItem.icon}
                                </div>
                              </div>
                                  <span className="text-[13px] font-medium leading-tight whitespace-normal">{subItem.name}</span>
                                  </button>
                          );
                        })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                  </motion.div>
                    );
                  })}
                </div>
      </motion.div>
        </div>
      </div>
      
      {/* Mobile overlay */}
      {isMobileDevice && effectiveIsExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.4,
            ease: "easeInOut"
          }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10"
          onClick={() => handleExpandedChange(false)}
        />
      )}
    </motion.div>
  );
};

export default SidebarDashboard;