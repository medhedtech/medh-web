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
  LucideProps
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
    width: '245px', // Slightly wider to accommodate text
    transition: {
      type: 'spring',
      stiffness: 170,
      damping: 22,
      mass: 0.8,
      duration: 0.4
    }
  },
  collapsed: {
    width: '68px',
    transition: {
      type: 'spring',
      stiffness: 150,  // Lower stiffness for slower animation
      damping: 30,     // Higher damping for smoother motion
      mass: 1.2,       // Higher mass for slower movement
      duration: 0.6    // Longer duration for closing
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
      duration: 0.18,
      ease: [0.4, 0.0, 0.2, 1],
      display: { delay: 0 }
    }
  },
  collapsed: {
    opacity: 0,
    x: -8,
    transition: {
      duration: 0.3,  // Slower fade out
      ease: [0.4, 0.0, 0.2, 1]
    },
    transitionEnd: {
      display: "none"
    }
  }
};

// Icon animation variants - only for header icon
const headerIconVariants = {
  expanded: {
    rotate: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.4, 0.0, 0.2, 1]
    }
  },
  collapsed: {
    rotate: 360,
    scale: 1.2,
    transition: {
      duration: 0.5,
      ease: [0.4, 0.0, 0.2, 1]
    }
  }
};

// Icon container animation variants - ensures stability during transitions
const iconContainerVariants = {
  expanded: {
    width: '44px',
    height: '44px',
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  },
  collapsed: {
    width: '44px',
    height: '44px',
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
      duration: 0.3,
      ease: [0.4, 0.0, 0.2, 1]
    }
  },
  closed: {
    rotate: 0,
    opacity: 0.7,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.4, 0.0, 0.2, 1]
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
    scale: 1.05,
    rotate: 360,
    transition: {
      rotate: { duration: 0.7, ease: "easeInOut" },
      scale: { duration: 0.3 }
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
        duration: 0.4,
        ease: [0.4, 0.0, 0.2, 1]
      },
      opacity: {
        duration: 0.25,
        ease: [0.4, 0.0, 0.2, 1]
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
      duration: 0.3  // Slower expansion
    }
  },
  collapsed: {
    paddingLeft: '8px',
    paddingRight: '8px',
    transition: {
      duration: 0.4  // Slower collapse
    }
  }
};

// Define consistent icon size and container sizes
const ICON_SIZE_MAIN = 22;
const ICON_SIZE_SUB = 16;
const CHEVRON_SIZE = 18;
const ICON_CONTAINER_SIZE = "44px"; // Consistent size for all icon containers

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
  
  // Use the prop values if provided, otherwise use internal state
  const effectiveIsExpanded = typeof propIsExpanded !== 'undefined' ? propIsExpanded : isExpanded;
  
  // Initialize component
  useEffect(() => {
    setMounted(true);
    
    // Check if device is mobile
    const checkMobile = () => {
      const isMobile = window.innerWidth < 1024;
      setIsMobileDevice(isMobile);
      setIsExpanded(!isMobile);
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
    
    // Clean up event listeners
    return () => {
      window.removeEventListener("resize", checkMobile);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileDevice]);

  // Update expanded state when prop changes
  useEffect(() => {
    if (typeof propIsExpanded !== 'undefined') {
      setIsExpanded(propIsExpanded);
    }
  }, [propIsExpanded]);

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

  // Handle menu clicks
  const handleMenuClick = (menuName: string, item: MenuItem) => {
    if (item.subItems && item.subItems.length > 0) {
      // Toggle dropdown
      setOpenSubMenu(openSubMenu === menuName ? null : menuName);
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
      path: formatRoute("student", "dashboard"),
      icon: <LayoutDashboard className="w-5 h-5" />
    },
        {
          name: "My Courses",
      path: formatRoute("student", "my-courses"),
          icon: <BookOpen className="w-5 h-5" />,
          subItems: [
            {
          name: "All Courses",
          path: formatRoute("student", "my-courses"),
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

  // Actions including logout
  const actionItems: MenuItem[] = [
    {
      name: "Settings",
      path: formatRoute("student", "settings"),
      icon: <Settings className="w-5 h-5" />
    }
  ];

  if (!mounted) {
    return null;
  }

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

  // Main return with improved sidebar
  return (
    <motion.div 
      ref={sidebarRef}
      variants={sidebarVariants}
      initial="collapsed"
      animate={effectiveIsExpanded ? "expanded" : "collapsed"}
      className="flex flex-col h-auto bg-white dark:bg-gray-900 border-r dark:border-gray-700 shadow-md overflow-visible z-20 fixed lg:relative"
      style={{ 
        minHeight: 'calc(100vh - 64px)',
        top: '70px', /* Increased from 64px to add spacing */
        position: 'fixed'
      }}
      onMouseEnter={() => isCollapsible && handleExpandedChange(true)}
      onMouseLeave={() => isCollapsible && !isMobileDevice && handleExpandedChange(false)}
    >
      {/* Minimal header */}
      <div className="pt-5 pb-3 px-2 border-b border-gray-100 dark:border-gray-800">
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
                Student Dashboard
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
      
      {/* Navigation Area */}
      <motion.div 
        variants={containerVariants}
        className="flex-1 overflow-y-visible overflow-x-hidden"
      >
        <div className="py-3 space-y-1.5">
          {/* Main Menu Items */}
          {studentMenuItems.map((item, index) => {
            const isActive = isMenuActive(item);
                    const hasSubItems = item.subItems && item.subItems.length > 0;
            const isSubMenuOpen = openSubMenu === item.name;
                    
                    return (
              <div key={index} className="select-none">
                {/* Menu Item */}
                        <button
                  onClick={() => handleMenuClick(item.name, item)}
                  className={`flex items-center w-full rounded-xl p-2.5 transition-all duration-200
                    ${isActive 
                      ? "bg-primary-50/80 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400" 
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                    }
                    ${effectiveIsExpanded ? "justify-between" : "justify-center"}
                    ${isSubMenuOpen ? "mb-1" : ""}
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
                        }`}
                      style={{ 
                        width: ICON_CONTAINER_SIZE, 
                        height: ICON_CONTAINER_SIZE,
                        minWidth: ICON_CONTAINER_SIZE,
                        minHeight: ICON_CONTAINER_SIZE 
                      }}
                    >
                      <div className={`flex items-center justify-center text-${isActive ? 'primary-600 dark:text-primary-400' : 'gray-600 dark:text-gray-400'}`}>
                        {/* Simply display the icon directly with fixed width & height */}
                        <div className="w-[22px] h-[22px] flex items-center justify-center">
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
                        className="ml-3 text-sm font-medium whitespace-nowrap overflow-visible"
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
                      className="w-6 h-6 flex items-center justify-center mr-1 rounded-full"
                    >
                      <ChevronDown className="w-[18px] h-[18px] text-gray-500 dark:text-gray-400" />
                    </motion.div>
                          )}
                        </button>
                        
                {/* Submenu */}
                <AnimatePresence initial={false}>
                  {effectiveIsExpanded && isSubMenuOpen && hasSubItems && (
                            <motion.div
                      key={`submenu-${item.name}`}
                      variants={submenuVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      className="overflow-hidden pl-14 pr-3"
                    >
                      <div className="py-1.5 space-y-1.5 border-l-2 border-primary-100 dark:border-primary-900/30 ml-0.5 pl-2">
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
                              className={`flex items-center w-full text-left rounded-lg px-3 py-2.5 text-sm transition-all duration-200
                                ${isSubItemActive 
                                  ? "bg-primary-50/60 dark:bg-primary-900/10 text-primary-600 dark:text-primary-400 font-medium" 
                                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:text-gray-900 dark:hover:text-gray-200"
                                }`}
                            >
                              <div className={`w-5 h-5 mr-2.5 flex-shrink-0 flex items-center justify-center ${
                                isSubItemActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-500'
                              }`}>
                                {/* Simply display the icon directly with fixed width & height */}
                                <div className="w-[16px] h-[16px] flex items-center justify-center">
                                      {subItem.icon}
                                </div>
                              </div>
                              <span className="text-sm whitespace-normal">{subItem.name}</span>
                                  </button>
                          );
                        })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
      </motion.div>
      
      {/* Footer with action items */}
      <motion.div 
        variants={containerVariants}
        className="mt-auto border-t border-gray-100 dark:border-gray-800 py-3 space-y-2.5"
      >
        {actionItems.map((item, index) => {
          const isLogout = item.name === 'Logout';
          
          return (
            <button
              key={index}
              onClick={item.onClick ? item.onClick : () => item.path && router.push(item.path)}
              className={`flex items-center w-full rounded-xl p-2.5 transition-all duration-200
                ${isLogout 
                  ? "text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10" 
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                }
                ${effectiveIsExpanded ? "justify-start" : "justify-center"}
              `}
            >
              <motion.div
                variants={iconContainerVariants}
                initial="expanded"
                animate={effectiveIsExpanded ? "expanded" : "collapsed"}
                className={`flex items-center justify-center rounded-full transition-colors duration-200
                  ${isLogout
                    ? "bg-red-50 dark:bg-red-900/10" 
                    : "bg-gray-50 dark:bg-gray-800/80"
                  }`}
                style={{ 
                  width: ICON_CONTAINER_SIZE, 
                  height: ICON_CONTAINER_SIZE,
                  minWidth: ICON_CONTAINER_SIZE,
                  minHeight: ICON_CONTAINER_SIZE 
                }}
              >
                <div className={`flex items-center justify-center ${
                  isLogout ? 'text-red-500 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {/* Simply display the icon directly with fixed width & height */}
                  <div className="w-[22px] h-[22px] flex items-center justify-center">
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
                  className={`ml-3 text-sm font-medium whitespace-nowrap overflow-visible ${
                    isLogout ? "text-red-500 dark:text-red-400" : ""
                  }`}
                >
                  {item.name}
                </motion.span>
              )}
            </button>
          );
        })}
      </motion.div>
      
      {/* Mobile overlay */}
      {isMobileDevice && effectiveIsExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10"
          onClick={() => handleExpandedChange(false)}
        />
      )}
    </motion.div>
  );
};

export default SidebarDashboard;