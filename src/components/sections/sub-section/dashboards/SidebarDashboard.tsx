"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowUpDown,
  Award,
  Banknote,
  BarChart,
  BarChart2,
  Bell,
  Book,
  BookOpen,
  BookOpenCheck,
  Briefcase,
  Building,
  Calendar,
  CalendarClock,
  CalendarDays,
  CheckCircle,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clipboard,
  ClipboardList,
  Clock,
  CreditCard,
  Crown,
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
  KeyRound,
  LayoutDashboard,
  LayoutGrid,
  LifeBuoy,
  LineChart,
  ListChecks,
  Lock,
  LogOut,
  LucideIcon,
  LucideProps,
  Mail,
  Megaphone,
  Menu,
  MessageCircle,
  MessageSquare,
  MonitorPlay,
  PenSquare,
  PenSquare as Pencil,
  Play,
  Plus,
  Repeat,
  Reply,
  School,
  Search,
  Settings,
  Share2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShoppingCart,
  Star,
  Tag,
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
  UserX,
  Video,
  Wallet,
  Zap,
  Eye,
  Link as LinkIcon,
  BarChart3
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
import { easeInOut, easeOut } from "framer-motion";
import { logoutUser } from "@/utils/auth";

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

// Enhanced sidebar animation variants for better mobile experience
const sidebarVariants = {
  expanded: {
    width: '280px',
    transition: {
      duration: 0.4,
      ease: easeInOut
    }
  },
  collapsed: {
    width: '280px', // Always expanded on desktop
    transition: {
      duration: 0.4,
      ease: easeInOut
    }
  }
};

// Enhanced mobile-specific sidebar variants
const mobileSidebarVariants = {
  expanded: {
    width: '100%',
    transition: {
      duration: 0.3,
      ease: easeInOut
    }
  },
  collapsed: {
    width: '100%',
    transition: {
      duration: 0.3,
      ease: easeInOut
    }
  }
};

// Enhanced animation variants for menu items with mobile optimizations
const itemVariants = {
  expanded: {
    opacity: 1,
    x: 0,
    display: "block",
    transition: {
      duration: 0.22,
      ease: easeOut
    }
  },
  collapsed: {
    opacity: 0,
    x: -12,
    transition: {
      duration: 0.25,
      ease: easeInOut
    },
    transitionEnd: {
      display: "none"
    }
  }
};

// Enhanced mobile item variants - always expanded with better animations
const mobileItemVariants = {
  expanded: {
    opacity: 1,
    x: 0,
    display: "block",
    transition: {
      duration: 0.2,
      ease: easeOut
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
      ease: easeOut
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
      ease: easeOut
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
      ease: easeOut
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
      ease: easeInOut
    }
  },
  collapsed: {
    rotate: 360,
    scale: 1.2,
    transition: {
      duration: 0.6,
      ease: easeInOut
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
      ease: easeInOut
    }
  },
  collapsed: {
    width: '44px',
    height: '44px',
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: easeInOut
    }
  }
};

// Enhanced chevron animation variants
const chevronVariants = {
  open: {
    rotate: 180,
    opacity: 1,
    scale: 1.1,
    transition: {
      duration: 0.4,
      ease: easeInOut
    }
  },
  closed: {
    rotate: 0,
    opacity: 0.7,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: easeInOut
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

// Enhanced animation variants for submenu with mobile optimizations
const submenuVariants = {
  open: {
    height: 'auto',
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easeOut
    }
  },
  closed: {
    height: 0,
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: easeInOut
    }
  }
};

// Container animation variants
const containerVariants = {
  expanded: {
    paddingLeft: '14px',
    paddingRight: '14px',
    transition: {
      duration: 0.35,
      ease: easeInOut
    }
  },
  collapsed: {
    paddingLeft: '8px',
    paddingRight: '8px',
    transition: {
      duration: 0.35,
      ease: easeInOut
    }
  }
};

// Enhanced responsive icon sizes and container sizes
const getIconSizes = (isMobile: boolean, isTablet: boolean) => ({
  ICON_SIZE_MAIN: isMobile ? 24 : isTablet ? 22 : 20,
  ICON_SIZE_SUB: isMobile ? 20 : isTablet ? 18 : 16,
  CHEVRON_SIZE: isMobile ? 20 : isTablet ? 18 : 16,
  ICON_CONTAINER_SIZE: isMobile ? "48px" : isTablet ? "46px" : "44px"
});

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
  const [isTabletDevice, setIsTabletDevice] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isCollapsible, setIsCollapsible] = useState<boolean>(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const sidebarNavRef = useRef<HTMLDivElement>(null);
  const [showScrollIndicators, setShowScrollIndicators] = useState<{top: boolean, bottom: boolean}>({top: false, bottom: true});
  
  // Use the prop values if provided, otherwise use internal state
  const effectiveIsExpanded = typeof propIsExpanded !== 'undefined' ? propIsExpanded : isExpanded;

  // Get responsive icon sizes
  const iconSizes = getIconSizes(isMobileDevice, isTabletDevice);

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
  
  // Enhanced device detection and initialization
  useEffect(() => {
    setMounted(true);
    
    // Enhanced device detection with better breakpoints
    const checkDevice = () => {
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      setIsMobileDevice(isMobile);
      setIsTabletDevice(isTablet);
      
      // On mobile/tablet, disable hover expand/collapse behavior
      if (isMobile || isTablet) {
        // Disable collapsible behavior on all devices - sidebar stays permanently open
        setIsCollapsible(false);
      }
    };
    
    checkDevice();
    window.addEventListener("resize", checkDevice);
    
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
    
    // Enhanced click outside handler for mobile
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
      window.removeEventListener("resize", checkDevice);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileDevice, isTabletDevice, updateScrollIndicators]);

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
    // On desktop, always keep sidebar expanded
    if (!isMobileDevice && !isTabletDevice) {
      setIsExpanded(true);
      if (onExpandedChange) {
        onExpandedChange(true);
      }
      return;
    }
    
    // On mobile/tablet, allow normal expansion behavior
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
  const handleLogout = async () => {
    try {
      // Use the new logoutUser function that calls backend API
      await logoutUser(true); // Keep remember me settings
      
      // Use the new path format for redirecting to login
      router.push("/login/");
    } catch (error) {
      console.error("Error during logout:", error);
      // Fallback to local logout if API fails
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
      } catch (localError) {
        console.error("Error during local logout cleanup:", localError);
      }
      
      // Redirect to login
      router.push("/login/");
    }
  };

  // Toggle sidebar expansion state
  const toggleSidebar = () => {
    // On desktop, prevent collapsing - always keep expanded
    if (!isMobileDevice && !isTabletDevice) {
      if (onExpandedChange) {
        onExpandedChange(true);
      } else {
        setIsExpanded(true);
      }
      return;
    }
    
    // On mobile/tablet, allow normal toggle behavior
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

  // Enhanced menu click handler with mobile-specific behavior
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
      // Auto-close sidebar on mobile/tablet after navigation
      if ((isMobileDevice || isTabletDevice) && onOpenChange) {
        onOpenChange(false);
      }
    } else if (item.path) {
      // Navigate to the path
      router.push(item.path);
      // Auto-close sidebar on mobile/tablet after navigation
      if ((isMobileDevice || isTabletDevice) && onOpenChange) {
        onOpenChange(false);
      }
    }
  };

  // Modern student sidebar items - Rearranged in requested order
  const studentMenuItems: MenuItem[] = [
    {
      name: "Dashboard",
      path: "/dashboards/student",
      icon: <HomeIcon className="w-5 h-5" />
    },
    {
      name: "My Courses",
      path: formatRoute("student", "enrolled-courses"),
      icon: <BookOpen className="w-5 h-5" />,
      subItems: [
        {
          name: "All Courses",
          path: formatRoute("student", "enrolled-courses"),
          icon: <TrendingUp className="w-4 h-4" />
        },
        {
          name: "Live Courses",
          path: formatRoute("student", "enrolled-courses") + "?type=live",
          icon: <Video className="w-4 h-4" />
        },
        {
          name: "Blended Courses",
          path: formatRoute("student", "enrolled-courses") + "?type=blended",
          icon: <BookOpen className="w-4 h-4" />
        },
        {
          name: "Corporate Courses",
          path: formatRoute("student", "enrolled-courses") + "?type=corporate",
          icon: <Briefcase className="w-4 h-4" />
        },
        {
          name: "School Institute",
          path: formatRoute("student", "enrolled-courses") + "?type=school",
          icon: <GraduationCap className="w-4 h-4" />
        }
      ]
    },
    {
      name: "My Demo Classes",
      path: formatRoute("student", "demo-classes"),
      icon: <MonitorPlay className="w-5 h-5" />,
      subItems: [
        {
          name: "Upcoming Demo",
          path: formatRoute("student", "demo-classes"),
          icon: <CalendarDays className="w-4 h-4" />
        },
        {
          name: "Demo History",
          path: formatRoute("student", "demo-classes") + "?view=history",
          icon: <History className="w-4 h-4" />
        }
      ]
    },
    {
      name: "My Live Classes",
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
        },
        {
          name: "Session Count",
          path: formatRoute("student", "upcoming-classes") + "?view=sessions",
          icon: <BarChart3 className="w-4 h-4" />
        }
      ]
    },
    {
      name: "My Certificates",
      path: formatRoute("student", "certificate"),
      icon: <Award className="w-5 h-5" />
    },
    {
      name: "My Membership",
      path: formatRoute("student", "membership"),
      icon: <Crown className="w-5 h-5" />
    },
    {
      name: "My Progress",
      path: formatRoute("student", "progress"),
      icon: <BarChart3 className="w-5 h-5" />,
      subItems: [
        {
          name: "Overall Progress",
          path: formatRoute("student", "progress"),
          icon: <TrendingUp className="w-4 h-4" />
        },
        {
          name: "Course Analytics",
          path: formatRoute("student", "progress") + "?view=analytics",
          icon: <BarChart className="w-4 h-4" />
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
          name: "Downloads",
          path: formatRoute("student", "resources") + "?view=downloads",
          icon: <Download className="w-4 h-4" />
        },
        {
          name: "Study Guides",
          path: formatRoute("student", "resources") + "?view=guides",
          icon: <BookOpen className="w-4 h-4" />
        }
      ]
    },
    {
      name: "Assignments",
      path: formatRoute("student", "assignments"),
      icon: <Clipboard className="w-5 h-5" />,
      subItems: [
        {
          name: "Pending Assignments",
          path: formatRoute("student", "assignments"),
          icon: <Clock className="w-4 h-4" />
        },
        {
          name: "Submitted Work",
          path: formatRoute("student", "assignments") + "?view=submitted",
          icon: <CheckCircle className="w-4 h-4" />
        },
        {
          name: "Grades & Feedback",
          path: formatRoute("student", "assignments") + "?view=grades",
          icon: <Star className="w-4 h-4" />
        }
      ]
    },
    {
      name: "Quizzes",
      path: formatRoute("student", "quiz"),
      icon: <ClipboardList className="w-5 h-5" />,
      subItems: [
        {
          name: "Available Quizzes",
          path: formatRoute("student", "quiz"),
          icon: <ListChecks className="w-4 h-4" />
        },
        {
          name: "Quiz Results",
          path: formatRoute("student", "quiz") + "?view=results",
          icon: <BarChart className="w-4 h-4" />
        },
        {
          name: "Practice Tests",
          path: formatRoute("student", "quiz") + "?view=practice",
          icon: <Repeat className="w-4 h-4" />
        }
      ]
    },
    {
      name: "Payments",
      path: formatRoute("student", "payments"),
      icon: <CreditCard className="w-5 h-5" />,
      subItems: [
        {
          name: "Payment History",
          path: formatRoute("student", "payments"),
          icon: <History className="w-4 h-4" />
        },
        {
          name: "Pending Payments",
          path: formatRoute("student", "payments") + "?view=pending",
          icon: <Clock className="w-4 h-4" />
        },
        {
          name: "Invoices",
          path: formatRoute("student", "payments") + "?view=invoices",
          icon: <FileSpreadsheet className="w-4 h-4" />
        }
      ]
    },
    {
      name: "Placement",
      path: formatRoute("student", "apply"),
      icon: <Briefcase className="w-5 h-5" />,
      subItems: [
        {
          name: "Apply for Placement",
          path: formatRoute("student", "apply"),
          icon: <UserPlus className="w-4 h-4" />
        },
        {
          name: "Application Status",
          path: formatRoute("student", "apply") + "?view=status",
          icon: <CheckCircle className="w-4 h-4" />
        },
        {
          name: "Job Opportunities",
          path: formatRoute("student", "apply") + "?view=jobs",
          icon: <Building className="w-4 h-4" />
        }
      ]
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
      name: "Course Management",
      icon: <BookOpen className="w-5 h-5" />,
      subItems: [
        {
          name: "All Courses",
          path: formatRoute("admin", "courses"),
          icon: <LayoutGrid className="w-4 h-4" />
        },
        {
          name: "Add Course",
          path: formatRoute("admin", "courses/create"),
          icon: <Plus className="w-4 h-4" />
        },
        {
          name: "Edit Courses",
          path: formatRoute("admin", "edit-courses"),
          icon: <Pencil className="w-4 h-4" />
        },
        {
          name: "Course Categories",
          path: formatRoute("admin", "course-categories"),
          icon: <FolderTree className="w-4 h-4" />
        },
        {
          name: "Course Card Editor",
          path: formatRoute("admin", "course-card-editor"),
          icon: <Pencil className="w-4 h-4" />
        },
        {
          name: "Live Classes",
          path: formatRoute("admin", "live-classes"),
          icon: <Video className="w-4 h-4" />
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
          name: "Demo Students",
          path: "/dashboards/demo-student-register",
          icon: <UserPlus className="w-4 h-4" />
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
      name: "Security Management",
      icon: <Shield className="w-5 h-5" />,
      subItems: [
        {
          name: "Account Lockouts",
          path: formatRoute("admin", "account-lockouts"),
          icon: <UserX className="w-4 h-4" />
        },
        {
          name: "Lockout Statistics",
          path: formatRoute("admin", "lockout-stats"),
          icon: <ShieldAlert className="w-4 h-4" />
        },
        {
          name: "Security Settings",
          path: formatRoute("admin", "security-settings"),
          icon: <KeyRound className="w-4 h-4" />
        }
      ]
    },
    {
      name: "Classes",
      icon: <Calendar className="w-5 h-5" />,
      subItems: [
        {
          name: "Class Management",
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
          name: "Coupon Management",
          path: formatRoute("admin", "coupons"),
          icon: <Tag className="w-4 h-4" />
        },
        {
          name: "Instructor Payouts",
          path: formatRoute("admin", "instructor-payouts"),
          icon: <Wallet className="w-4 h-4" />
        }
      ]
    },
    {
      name: "Certificate Management",
      icon: <Award className="w-5 h-5" />,
      subItems: [
        {
          name: "Certificate Management",
          path: formatRoute("admin", "certificate-management"),
          icon: <Award className="w-4 h-4" />
        },
        {
          name: "Generate Certificate",
          path: formatRoute("admin", "GenrateCertificate"),
          icon: <FileCheck className="w-4 h-4" />
        },
        {
          name: "Certificate Verification",
          path: "/certificate-verify",
          icon: <Eye className="w-4 h-4" />
        }
      ]
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
      name: "Communication",
      icon: <MessageCircle className="w-5 h-5" />,
      subItems: [
        {
          name: "Announcements",
          path: formatRoute("admin", "announcements"),
          icon: <Bell className="w-4 h-4" />
        },
        {
          name: "Manage Announcements",
          path: formatRoute("admin", "announcements-manage"),
          icon: <Megaphone className="w-4 h-4" />
        },
        {
          name: "Create Announcement",
          path: formatRoute("admin", "announcements-create"),
          icon: <Plus className="w-4 h-4" />
        },
        {
          name: "Notification Settings",
          path: formatRoute("admin", "notification-settings"),
          icon: <Settings className="w-4 h-4" />
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
      path: "/dashboards/instructor",
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      name: "Demo Classes",
      icon: <MonitorPlay className="w-5 h-5" />,
      subItems: [
        {
          name: "Demo Requests",
          path: "/dashboards/instructor/demo-requests",
          icon: <Bell className="w-4 h-4" />
        },
        {
          name: "Create Demo Student",
          path: "/dashboards/demo-student-register",
          icon: <UserPlus className="w-4 h-4" />
        },
        {
          name: "Live Demo Classes",
          path: "/dashboards/instructor/demo-live",
          icon: <Video className="w-4 h-4" />
        },
        {
          name: "Demo Presentations",
          path: "/dashboards/instructor/demo-presentations",
          icon: <FileText className="w-4 h-4" />
        },
        {
          name: "Demo Recordings",
          path: "/dashboards/instructor/demo-recordings",
          icon: <Play className="w-4 h-4" />
        },
        {
          name: "Demo Feedback",
          path: "/dashboards/instructor/demo-feedback",
          icon: <MessageSquare className="w-4 h-4" />
        },
        {
          name: "Demo Revenue",
          path: "/dashboards/instructor/demo-revenue",
          icon: <DollarSign className="w-4 h-4" />
        }
      ]
    },
    {
      name: "Live Classes",
      icon: <Video className="w-5 h-5" />,
      subItems: [
        {
          name: "Assigned Courses",
          path: "/dashboards/instructor/assigned-courses",
          icon: <BookOpen className="w-4 h-4" />
        },
        {
          name: "Class Schedules",
          path: "/dashboards/instructor/class-schedules",
          icon: <CalendarDays className="w-4 h-4" />
        },
        {
          name: "Live Classes",
          path: "/dashboards/instructor/live-classes",
          icon: <Video className="w-4 h-4" />
        },
        {
          name: "Live Presentations",
          path: "/dashboards/instructor/live-presentations",
          icon: <FileText className="w-4 h-4" />
        },
        {
          name: "Live Recordings",
          path: "/dashboards/instructor/live-recordings",
          icon: <Play className="w-4 h-4" />
        },
        {
          name: "Live Revenue",
          path: "/dashboards/instructor/live-revenue",
          icon: <DollarSign className="w-4 h-4" />
        }
      ]
    },
    {
      name: "Student Management",
      icon: <Users className="w-5 h-5" />,
      subItems: [
        {
          name: "Student Lists",
          path: "/dashboards/instructor/student-lists",
          icon: <Users className="w-4 h-4" />
        },
        {
          name: "Student Progress",
          path: "/dashboards/instructor/student-progress",
          icon: <TrendingUp className="w-4 h-4" />
        },
        {
          name: "Student Communication",
          path: "/dashboards/instructor/student-communication",
          icon: <MessageCircle className="w-4 h-4" />
        },
        {
          name: "Mark Attendance",
          path: "/dashboards/instructor/mark-attendance",
          icon: <CheckCircle className="w-4 h-4" />
        }
      ]
    },
    {
      name: "Content Management",
      icon: <FolderOpen className="w-5 h-5" />,
      subItems: [
        {
          name: "Upload Materials",
          path: "/dashboards/instructor/upload-materials",
          icon: <Upload className="w-4 h-4" />
        },
        {
          name: "Lesson Plans",
          path: "/dashboards/instructor/lesson-plans",
          icon: <PenSquare className="w-4 h-4" />
        },
        {
          name: "Resource Visibility",
          path: "/dashboards/instructor/resource-visibility",
          icon: <Eye className="w-4 h-4" />
        }
      ]
    },
    {
      name: "Assessments",
      icon: <ClipboardList className="w-5 h-5" />,
      subItems: [
        {
          name: "Create Assessments",
          path: "/dashboards/instructor/create-assessments",
          icon: <Plus className="w-4 h-4" />
        },
        {
          name: "Submitted Work",
          path: "/dashboards/instructor/submitted-work",
          icon: <CheckSquare className="w-4 h-4" />
        },
        {
          name: "Assessment Feedback",
          path: "/dashboards/instructor/assessment-feedback",
          icon: <MessageSquare className="w-4 h-4" />
        }
      ]
    },
    {
      name: "Reports",
      icon: <BarChart2 className="w-5 h-5" />,
      subItems: [
        {
          name: "Class Reports",
          path: "/dashboards/instructor/class-reports",
          icon: <LineChart className="w-4 h-4" />
        },
        {
          name: "Attendance Reports",
          path: "/dashboards/instructor/attendance-reports",
          icon: <FileText className="w-4 h-4" />
        },
        {
          name: "Performance Reports",
          path: "/dashboards/instructor/performance-reports",
          icon: <BarChart className="w-4 h-4" />
        },
        {
          name: "Engagement Reports",
          path: "/dashboards/instructor/engagement-reports",
          icon: <Activity className="w-4 h-4" />
        },
        {
          name: "Learning Outcomes",
          path: "/dashboards/instructor/learning-outcomes",
          icon: <Target className="w-4 h-4" />
        }
      ]
    },
    {
      name: "Finance",
      icon: <DollarSign className="w-5 h-5" />,
      subItems: [
        {
          name: "Receivables",
          path: "/dashboards/instructor/receivables",
          icon: <CreditCard className="w-4 h-4" />
        },
        {
          name: "Demo Revenue",
          path: "/dashboards/instructor/demo-revenue",
          icon: <MonitorPlay className="w-4 h-4" />
        },
        {
          name: "Live Revenue",
          path: "/dashboards/instructor/live-revenue",
          icon: <Video className="w-4 h-4" />
        }
      ]
    },
    {
      name: "Settings",
      path: "/dashboards/instructor/settings",
      icon: <Settings className="w-5 h-5" />
    },
    {
      name: "Profile",
      path: "/dashboards/instructor/profile",
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
    // Handle undefined, null, or empty role
    if (!role || typeof role !== 'string') {
      role = 'student'; // Default to student role
    }
    
    // Convert to lowercase for consistent comparison
    const normalizedRole = role.toLowerCase();
    
    if (normalizedRole.includes('admin')) {
      const items = [...adminMenuItems];
      if (items[0]?.name === "Dashboard") {
        items[0] = { ...items[0], path: '/dashboards/admin' };
      }
      return items;
    } else if (normalizedRole.includes('instructor')) {
      const items = [...instructorMenuItems];
      if (items[0]?.name === "Dashboard") {
        items[0] = { ...items[0], path: '/dashboards/instructor' };
      }
      return items;
    } else if (normalizedRole.includes('student')) {
      const items = [...studentMenuItems];
      if (items[0]?.name === "Dashboard") {
        items[0] = { ...items[0], path: '/dashboards/student' };
      }
      return items;
    }

    // Default fallback for unknown roles
    return [
      {
        name: "Dashboard",
        path: `/dashboards/${normalizedRole}`,
        icon: <LayoutDashboard className="w-5 h-5" />
      },
      {
        name: "Profile",
        path: formatRoute(normalizedRole, "profile"),
        icon: <UserCircle className="w-5 h-5" />
      }
    ];
  };

  // Get the action items based on user role
  const getActionItemsByRole = (role: string): MenuItem[] => {
    // Handle undefined, null, or empty role
    if (!role || typeof role !== 'string') {
      role = 'student'; // Default to student role
    }
    
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

  // Enhanced main return with improved mobile/tablet sidebar
  return (
    <motion.div 
      ref={sidebarRef}
      variants={isMobileDevice || isTabletDevice ? mobileSidebarVariants : sidebarVariants}
      initial="expanded"
      animate={isMobileDevice || isTabletDevice ? (effectiveIsExpanded ? "expanded" : "collapsed") : "expanded"}
      className={`flex flex-col h-full bg-white dark:bg-gray-900 shadow-md z-20 ${
        isMobileDevice || isTabletDevice 
          ? 'w-full' 
          : 'border-r dark:border-gray-700 fixed lg:relative'
      }`}
      style={{ 
        minHeight: isMobileDevice || isTabletDevice ? '100%' : 'calc(100vh - 80px)',
        top: isMobileDevice || isTabletDevice ? '0px' : '0px',
        position: isMobileDevice || isTabletDevice ? 'relative' : 'relative',
        overflow: 'hidden',
        width: '100%'
      }}
              // Removed hover behavior for desktop - sidebar stays permanently open
    >
      {/* Main scrollable container */}
      <div 
        className="h-full flex flex-col overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent"
        style={{ 
          maxHeight: isMobileDevice || isTabletDevice ? '100%' : 'calc(100vh - 80px)' 
        }}
      >
        {/* Enhanced responsive header */}
        <div className={`${
          isMobileDevice || isTabletDevice 
            ? 'pt-4 pb-3 px-4' 
            : 'pt-5 pb-3 px-2'
        } border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10`}>
          <div className={`${
            isMobileDevice || isTabletDevice 
              ? 'h-14 flex items-center justify-start' 
              : 'h-12 flex items-center justify-center'
          }`}>
            <AnimatePresence mode="wait">
              {(effectiveIsExpanded || isMobileDevice || isTabletDevice) ? (
                <motion.span 
                  key="expanded-title"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={`${
                    isMobileDevice 
                      ? 'text-lg font-semibold' 
                      : isTabletDevice 
                        ? 'text-base font-semibold' 
                        : 'text-sm font-medium'
                  } bg-gradient-to-r from-primary-500 to-violet-500 bg-clip-text text-transparent`}
                >
                  {userRole ? (userRole.charAt(0).toUpperCase() + userRole.slice(1)) : 'Student'} Dashboard
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
            className={`${isMobileDevice || isTabletDevice ? 'py-4 px-4' : 'py-2'}`}
            onScroll={updateScrollIndicators}
          >
            <div className={`${
              isMobileDevice || isTabletDevice 
                ? 'py-2 space-y-2' 
                : 'py-2 space-y-1'
            }`}>
              {/* Enhanced menu items rendering with mobile optimizations */}
              {menuItems.map((item, index) => {
                const isActive = isMenuActive(item);
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isSubMenuOpen = openSubMenu === item.name;
                const hasLongSubMenu = hasSubItems && item.subItems!.length > 5;
                
                // Enhanced compaction logic - disabled on mobile/tablet
                const getCompactMode = () => {
                  if (isMobileDevice || isTabletDevice) return "normal";
                  if (!effectiveIsExpanded || openSubMenu === null) return "normal";
                  if (isSubMenuOpen) return "normal";
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
                    className={`select-none ${
                      isMobileDevice || isTabletDevice ? 'px-0' : 'px-2'
                    } ${isCompact || isVeryCompact ? 'opacity-80' : 'opacity-100'}`}
                    id={`menu-item-${item.name}`}
                    variants={compactItemVariants}
                    initial="normal"
                    animate={compactMode}
                  >
                    {/* Enhanced menu item button with mobile optimizations */}
                    <button
                      onClick={() => handleMenuClick(item.name, item)}
                      className={`flex items-center w-full rounded-xl transition-all duration-200 ${
                        isMobileDevice || isTabletDevice 
                          ? 'p-4 min-h-[56px]' // Larger touch targets for mobile/tablet
                          : isVeryCompact ? 'py-2 px-3' : isCompact ? 'py-2.5 px-3' : 'p-3'
                      } ${
                        isActive 
                          ? "bg-primary-50/80 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400" 
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                      } ${
                        (effectiveIsExpanded || isMobileDevice || isTabletDevice) ? "justify-between" : "justify-center"
                      } ${isSubMenuOpen ? "mb-1" : ""}`}
                      style={{ minHeight: isMobileDevice || isTabletDevice ? '56px' : 'auto' }}
                    >
                      <div className="flex items-center min-w-[48px] flex-shrink-0 flex-1 min-w-0">
                        <motion.div 
                          variants={iconContainerVariants}
                          initial="expanded"
                          animate={(effectiveIsExpanded || isMobileDevice || isTabletDevice) ? "expanded" : "collapsed"}
                          className={`flex items-center justify-center rounded-full transition-colors duration-200 flex-shrink-0 ${
                            isActive 
                              ? "bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/40 dark:to-primary-900/20 shadow-sm" 
                              : "bg-gray-50 dark:bg-gray-800/80"
                          } ${
                            isMobileDevice || isTabletDevice 
                              ? '' // No scaling on mobile/tablet
                              : isVeryCompact ? "scale-85" : isCompact ? "scale-90" : ""
                          }`}
                          style={{ 
                            width: iconSizes.ICON_CONTAINER_SIZE, 
                            height: iconSizes.ICON_CONTAINER_SIZE,
                            minWidth: iconSizes.ICON_CONTAINER_SIZE,
                            minHeight: iconSizes.ICON_CONTAINER_SIZE
                          }}
                        >
                          <div className={`flex items-center justify-center text-${isActive ? 'primary-600 dark:text-primary-400' : 'gray-600 dark:text-gray-400'}`}>
                            <div className={`flex items-center justify-center`} style={{
                              width: `${iconSizes.ICON_SIZE_MAIN}px`,
                              height: `${iconSizes.ICON_SIZE_MAIN}px`
                            }}>
                              {item.icon}
                            </div>
                          </div>
                        </motion.div>
                        
                        {(effectiveIsExpanded || isMobileDevice || isTabletDevice) && (
                          <motion.span
                            variants={isMobileDevice || isTabletDevice ? mobileItemVariants : itemVariants}
                            initial="collapsed"
                            animate="expanded"
                            exit="collapsed"
                            className={`ml-3 mt-0.5 font-medium text-left leading-snug min-w-0 ${
                              isMobileDevice || isTabletDevice 
                                ? 'whitespace-normal break-words' // Allow controlled breaking on mobile/tablet
                                : 'whitespace-nowrap overflow-hidden text-ellipsis' // Single line with ellipsis on desktop
                            }`}
                            style={{
                              fontSize: isMobileDevice 
                                ? "16px" 
                                : isTabletDevice 
                                  ? "15px" 
                                  : isVeryCompact ? "13px" : isCompact ? "14px" : "15px", // Increased base font sizes
                              lineHeight: isMobileDevice || isTabletDevice ? "1.4" : "1.3"
                            }}
                            title={item.name} // Tooltip for truncated text
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </div>
                      
                      {(effectiveIsExpanded || isMobileDevice || isTabletDevice) && hasSubItems && (
                        <motion.div
                          variants={chevronVariants}
                          initial="closed"
                          animate={isSubMenuOpen ? "open" : "closed"}
                          className={`flex items-center justify-center rounded-full flex-shrink-0 ${
                            isMobileDevice || isTabletDevice 
                              ? "w-8 h-8 ml-2" 
                              : isVeryCompact ? "w-5 h-5 ml-1" : isCompact ? "w-6 h-6 ml-1" : "w-6 h-6 ml-2"
                          }`}
                        >
                          <ChevronDown style={{
                            width: `${iconSizes.CHEVRON_SIZE}px`,
                            height: `${iconSizes.CHEVRON_SIZE}px`
                          }} className="text-gray-500 dark:text-gray-400" />
                        </motion.div>
                      )}
                    </button>
                        
                    {/* Enhanced submenu with mobile optimizations */}
                    <AnimatePresence initial={false}>
                      {(effectiveIsExpanded || isMobileDevice || isTabletDevice) && isSubMenuOpen && hasSubItems && (
                        <motion.div
                          key={`submenu-${item.name}`}
                          variants={submenuVariants}
                          initial="closed"
                          animate="open"
                          exit="closed"
                          className={`overflow-hidden ${
                            isMobileDevice || isTabletDevice ? 'px-0 mt-2' : 'px-2 mt-2'
                          }`}
                        >
                          <div 
                            className={`${
                              isMobileDevice || isTabletDevice 
                                ? 'py-4 space-y-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 shadow-sm' 
                                : 'py-3 space-y-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 shadow-md'
                            } ${
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
                                    // Auto-close sidebar on mobile/tablet after sub-item selection
                                    if ((isMobileDevice || isTabletDevice) && onOpenChange) {
                                      onOpenChange(false);
                                    }
                                  }}
                                  className={`flex items-center w-full text-left rounded-lg transition-all duration-200 ${
                                    isMobileDevice || isTabletDevice 
                                      ? 'px-4 py-3 min-h-[48px]' // Larger touch targets
                                      : 'px-4 py-2.5'
                                  } ${
                                    isSubItemActive 
                                      ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium" 
                                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
                                  }`}
                                  style={{ minHeight: isMobileDevice || isTabletDevice ? '48px' : 'auto' }}
                                >
                                  <div className={`flex-shrink-0 flex items-center justify-center ${
                                    isSubItemActive ? 'text-primary-600 dark:text-primary-300' : 'text-gray-600 dark:text-gray-400'
                                  }`} style={{
                                    width: `${iconSizes.ICON_SIZE_SUB + 4}px`,
                                    height: `${iconSizes.ICON_SIZE_SUB + 4}px`,
                                    marginRight: isMobileDevice || isTabletDevice ? '12px' : '10px'
                                  }}>
                                    <div style={{
                                      width: `${iconSizes.ICON_SIZE_SUB}px`,
                                      height: `${iconSizes.ICON_SIZE_SUB}px`
                                    }} className="flex items-center justify-center">
                                      {subItem.icon}
                                    </div>
                                  </div>
                                  <span 
                                    className={`font-medium leading-snug ${
                                      isMobileDevice || isTabletDevice 
                                        ? 'whitespace-normal break-words' 
                                        : 'whitespace-nowrap overflow-hidden text-ellipsis'
                                    }`} 
                                    style={{
                                      fontSize: isMobileDevice 
                                        ? "15px" 
                                        : isTabletDevice 
                                          ? "14px" 
                                          : "14px", // Increased from 13px
                                      maxWidth: isMobileDevice || isTabletDevice ? 'none' : '180px' // Generous width for submenu text
                                    }}
                                    title={subItem.name} // Tooltip for truncated text
                                  >
                                    {subItem.name}
                                  </span>
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
    </motion.div>
  );
};

export default SidebarDashboard;