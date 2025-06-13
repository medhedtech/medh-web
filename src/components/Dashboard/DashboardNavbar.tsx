"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

// Import NavbarLogo instead of Image
import NavbarLogo from "@/components/layout/header/NavbarLogo";

// Icons
import {
  ShoppingCart,
  Search,
  Heart,
  Bell,
  User,
  LogOut,
  Settings,
  ChevronDown,
  UserCircle,
  Shield,
  Briefcase,
  GraduationCap,
  School,
  Menu,
  X,
  BarChart2, // For Progress icon
  BookOpen,
  Clock,
  Calendar,
  FileText,
  MessageSquare
} from "lucide-react";

// APIs and hooks
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import { clearAuthData } from "@/utils/auth";

// Custom interfaces for TypeScript
interface CustomJwtPayload {
  user?: {
    full_name?: string;
    name?: string;
    email?: string;
    role?: string | string[];
  };
  name?: string;
  role?: string | string[];
  [key: string]: any;
}

// Types
interface DashboardNavbarProps {
  onMobileMenuToggle?: () => void;
  isScrolled?: boolean;
}

interface UserSettings {
  theme?: string;
  language?: string;
  notifications?: boolean;
}

interface ApiResponse {
  data?: any;
  success?: boolean;
  message?: string;
}

interface DropdownItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  count?: number;
}

// Standardized icon size for navbar icons
const NAVBAR_ICON_SIZE = 20;
const DROPDOWN_ICON_SIZE = 16;
const PROFILE_ICON_SIZE = 18;

// Animation timing constants
const ANIMATION_DURATION = 200;
const DROPDOWN_DELAY = 300;
const HOVER_SCALE = 1.08;
// Faster profile dropdown animation
const PROFILE_ANIMATION_DURATION = 150;

/**
 * DashboardNavbar - Main navigation component for dashboard
 * Includes logo, search, cart, wishlist and user profile features
 */
const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
  onMobileMenuToggle,
  isScrolled = false
}) => {
  // Hooks
  const router = useRouter();
  const { getQuery } = useGetQuery();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Dropdown refs for hover and click handling
  const progressDropdownRef = useRef<HTMLDivElement>(null);
  const notificationsDropdownRef = useRef<HTMLDivElement>(null);
  const cartDropdownRef = useRef<HTMLDivElement>(null);
  const wishlistDropdownRef = useRef<HTMLDivElement>(null);
  
  // State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [cartItemCount, setCartItemCount] = useState<number>(0);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownCloseTimeouts, setDropdownCloseTimeouts] = useState<Record<string, NodeJS.Timeout | null>>({
    progress: null,
    notifications: null,
    cart: null,
    wishlist: null,
    profile: null
  });
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(false);
  const [isTabletDevice, setIsTabletDevice] = useState<boolean>(false);
  
  // Define dropdown items for each icon
  const notificationItems: DropdownItem[] = [
    { label: "Course Updates", href: "/notifications?type=course", icon: <BookOpen size={16} />, count: 3 },
    { label: "Upcoming Classes", href: "/notifications?type=class", icon: <Calendar size={16} />, count: 2 },
    { label: "Assignment Deadlines", href: "/notifications?type=assignment", icon: <FileText size={16} />, count: 1 },
    { label: "All Notifications", href: "/notifications", icon: <Bell size={16} /> }
  ];
  
  const cartItems: DropdownItem[] = [
    { label: "Checkout", href: "/ecommerce/checkout", icon: <ShoppingCart size={16} /> },
    { label: "View Cart", href: "/ecommerce/cart", icon: <ShoppingCart size={16} /> }
  ];
  
  const wishlistItems: DropdownItem[] = [
    { label: "Saved Courses", href: "/ecommerce/wishlist?type=courses", icon: <BookOpen size={16} /> },
    { label: "Saved Webinars", href: "/ecommerce/wishlist?type=webinars", icon: <MessageSquare size={16} /> },
    { label: "View All", href: "/ecommerce/wishlist", icon: <Heart size={16} /> }
  ];
  
  const progressItems: DropdownItem[] = [
    { label: "Learning Progress", href: "/dashboards/student/progress-overview", icon: <BarChart2 size={16} /> },
    { label: "Recent Activities", href: "/dashboards/student/recent-activities", icon: <Clock size={16} /> },
    { label: "Assignments", href: "/dashboards/student/assignments", icon: <FileText size={16} /> },
    { label: "View More", href: "/dashboards/student/progress", icon: <BarChart2 size={16} /> }
  ];
  
  // Handle dropdown hover with delay - disabled on mobile/tablet
  const handleDropdownHover = (dropdownName: string) => {
    // Disable hover behavior on mobile/tablet
    if (isMobileDevice || isTabletDevice) return;
    
    // Clear any existing timeout for this dropdown
    if (dropdownCloseTimeouts[dropdownName]) {
      clearTimeout(dropdownCloseTimeouts[dropdownName]!);
      const newTimeouts = { ...dropdownCloseTimeouts, [dropdownName]: null };
      setDropdownCloseTimeouts(newTimeouts);
    }
    
    // Close profile dropdown if any other dropdown is hovered
    if (dropdownName !== 'profile' && isDropdownOpen) {
      setIsDropdownOpen(false);
    }
    
    // Close any other active dropdown when this one is hovered
    if (activeDropdown && activeDropdown !== dropdownName) {
      setActiveDropdown(null);
    }
    
    // Set this dropdown as active
    setActiveDropdown(dropdownName);
  };
  
  const handleDropdownLeave = (dropdownName: string) => {
    // Disable hover behavior on mobile/tablet
    if (isMobileDevice || isTabletDevice) return;
    
    // Set a timeout before closing the dropdown
    const timeout = setTimeout(() => {
      if (activeDropdown === dropdownName) {
        setActiveDropdown(null);
      }
    }, DROPDOWN_DELAY); // Synchronized delay before closing
    
    const newTimeouts = { ...dropdownCloseTimeouts, [dropdownName]: timeout };
    setDropdownCloseTimeouts(newTimeouts);
  };

  // Toggle dropdown on click (for both mobile and desktop)
  const toggleDropdown = (dropdownName: string) => {
    // Close profile dropdown if any other dropdown is toggled
    if (dropdownName !== 'profile' && isDropdownOpen) {
      setIsDropdownOpen(false);
    }
    
    // Close any other active dropdown when this one is toggled
    if (activeDropdown && activeDropdown !== dropdownName) {
      setActiveDropdown(null);
    }
    
    if (activeDropdown === dropdownName) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdownName);
    }
  };

  // Profile dropdown management
  const toggleProfileDropdown = () => {
    // Close any active dropdown when profile is toggled
    if (activeDropdown) {
      setActiveDropdown(null);
    }
    
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  const openProfileDropdown = () => {
    // Disable hover behavior on mobile/tablet
    if (isMobileDevice || isTabletDevice) return;
    
    // Close any active dropdown when profile is opened
    if (activeDropdown) {
      setActiveDropdown(null);
    }
    
    setIsDropdownOpen(true);
  };
  
  const closeProfileDropdown = () => {
    // Disable hover behavior on mobile/tablet
    if (isMobileDevice || isTabletDevice) return;
    
    setTimeout(() => setIsDropdownOpen(false), DROPDOWN_DELAY / 1.5);
  };

  // Check if user is logged in and fetch user data
  useEffect(() => {
    // Check device type
    const checkDevice = () => {
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      setIsMobileDevice(isMobile);
      setIsTabletDevice(isTablet);
    };
    
    checkDevice();
    window.addEventListener("resize", checkDevice);
    
    // Check if user is logged in by looking for token and userId
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!token && !!userId);

    if (token && userId) {
      // Get user info from localStorage or token
      try {
        const storedFullName = localStorage.getItem("fullName");
        const storedRole = localStorage.getItem("role");
        
        // If we have both name and role in localStorage, use them directly
        if (storedFullName && storedRole) {
          setUserName(storedFullName);
          setUserRole(storedRole);
        } else {
          // If not in localStorage, try to decode from token
          try {
            const decoded = jwtDecode<CustomJwtPayload>(token);
            let name = "";
            if (decoded.user?.full_name) {
              name = decoded.user.full_name;
            } else if (decoded.user?.name) {
              name = decoded.user.name;
            } else if (decoded.name) {
              name = decoded.name;
            } else if (decoded.user?.email) {
              name = decoded.user.email.split('@')[0];
            }
            
            if (name) {
              setUserName(name);
              // Store in localStorage for future use
              localStorage.setItem("fullName", name);
            }
            
            // Get role from token if not in localStorage
            if (!storedRole) {
              let role = "";
              if (decoded.user?.role) {
                role = String(Array.isArray(decoded.user.role) ? decoded.user.role[0] : decoded.user.role);
              } else if (decoded.role) {
                role = String(Array.isArray(decoded.role) ? decoded.role[0] : decoded.role);
              }
              
              if (role) {
                setUserRole(role);
                // Store in localStorage for future use
                localStorage.setItem("role", role);
              }
            }
          } catch (tokenError) {
            console.error("Invalid token:", tokenError);
          }
        }
        
        // Fetch user data, cart, notifications and wishlist counts
        fetchUserData(userId);
      } catch (error) {
        console.error("Error accessing localStorage:", error);
      }
    }

    // Handle clicks outside dropdown
    const handleClickOutside = (event: MouseEvent) => {
      // Only close active dropdown if clicking outside any dropdown area
      if (activeDropdown && 
          (!progressDropdownRef.current?.contains(event.target as Node) && 
           !notificationsDropdownRef.current?.contains(event.target as Node) &&
           !cartDropdownRef.current?.contains(event.target as Node) &&
           !wishlistDropdownRef.current?.contains(event.target as Node) &&
           !dropdownRef.current?.contains(event.target as Node))) {
        setActiveDropdown(null);
      }
      
      // Handle profile dropdown separately
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    
    // Clean up timeouts on unmount
    return () => {
      window.removeEventListener("resize", checkDevice);
      document.removeEventListener("mousedown", handleClickOutside);
      Object.values(dropdownCloseTimeouts).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, [activeDropdown, dropdownCloseTimeouts]);

  // Clean up timeouts when component unmounts
  useEffect(() => {
    return () => {
      Object.values(dropdownCloseTimeouts).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, [dropdownCloseTimeouts]);

  // Fetch user data including cart, notifications and wishlist
  const fetchUserData = (userId: string) => {
    // Safely access API endpoints
    const cartEndpoint = (apiUrls as any)?.cart?.getUserCart;
    const notificationsEndpoint = (apiUrls as any)?.notifications?.getUserNotifications;
    const wishlistEndpoint = (apiUrls as any)?.wishlist?.getUserWishlist;
    
    // Fetch cart items if endpoint exists
    if (cartEndpoint) {
      getQuery({
        url: `${cartEndpoint}/${userId}`,
        requireAuth: true,
        onSuccess: (response: ApiResponse) => {
          if (response?.data?.items) {
            setCartItemCount(response.data.items.length);
          }
        },
        onFail: (error: any) => {
          console.error("Failed to fetch cart data:", error);
        },
      });
    }

    // Fetch notifications if endpoint exists
    if (notificationsEndpoint) {
      getQuery({
        url: `${notificationsEndpoint}/${userId}`,
        requireAuth: true,
        onSuccess: (response: ApiResponse) => {
          if (response?.data) {
            const unreadCount = response.data.filter((notification: any) => 
              !notification.isRead
            ).length;
            setNotificationCount(unreadCount);
          }
        },
        onFail: (error: any) => {
          console.error("Failed to fetch notifications:", error);
        },
      });
    }

    // Fetch wishlist if endpoint exists
    if (wishlistEndpoint) {
      getQuery({
        url: `${wishlistEndpoint}/${userId}`,
        requireAuth: true,
        onSuccess: (response: ApiResponse) => {
          if (response?.data?.items) {
            setWishlistCount(response.data.items.length);
          }
        },
        onFail: (error: any) => {
          console.error("Failed to fetch wishlist data:", error);
        },
      });
    }
  };

  // Handle logout
  const handleLogout = () => {
    // Clear all auth data using auth utility, but keep remember me settings
    const keepRememberMe = true; // This preserves email for next login
    clearAuthData(keepRememberMe);
    
    // Clear additional data that might be stored
    localStorage.removeItem("role");
    localStorage.removeItem("permissions");
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    
    // Remove cookies if they exist
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    
    // Redirect to home
    router.push("/");
  };

  // Get dashboard URL based on user role
  const getDashboardUrl = () => {
    // Ensure userRole is a string and provide a default value
    const roleLower = (userRole || "").toLowerCase();
    
    if (roleLower === "admin" || roleLower === "super-admin") {
      return "/dashboards/admin";
    } else if (roleLower === "instructor") {
      return "/dashboards/instructor/";
    } else if (roleLower === "student") {
      return "/dashboards/student";
    } else if (roleLower === "coorporate") {
      return "/dashboards/coorporate-dashboard";
    } else if (roleLower === "coorporate-student") {
      return "/dashboards/coorporate-employee-dashboard";
    } else {
      // Default dashboard route if role is not recognized or undefined
      return "/dashboards";
    }
  };

  // Get role icon based on user role
  const getRoleIcon = () => {
    const roleLower = (userRole || "").toLowerCase();
    
    if (roleLower === "admin" || roleLower === "super-admin") {
      return <Shield size={14} className="text-amber-500" />;
    } else if (roleLower === "instructor") {
      return <GraduationCap size={14} className="text-blue-500" />;
    } else if (roleLower === "student") {
      return <School size={14} className="text-green-500" />;
    } else if (roleLower.includes("coorporate")) {
      return <Briefcase size={14} className="text-purple-500" />;
    } else {
      return <UserCircle size={14} className="text-gray-500" />;
    }
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsSearchActive(false);
    }
  };

  // Toggle search bar for mobile view
  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    // Focus the search input when activated
    if (!isSearchActive && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };
  
  // Render dropdown menu with items - mobile optimized
  const renderDropdownMenu = (items: DropdownItem[]) => (
    <div className={`absolute right-0 mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 z-50 transform origin-top-right transition-all duration-200 ${
      isMobileDevice ? 'w-72 max-w-[90vw]' : isTabletDevice ? 'w-68' : 'w-64'
    }`}>
      <div className={`${isMobileDevice || isTabletDevice ? 'p-3' : 'p-2'}`}>
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`flex items-center justify-between w-full text-left rounded-lg text-gray-700 hover:bg-gray-50 hover:text-primary-700 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white transition-colors duration-150 ${
              isMobileDevice || isTabletDevice ? 'px-3 py-3 text-sm min-h-[48px]' : 'px-3 py-2 text-sm'
            }`}
            onClick={() => {
              // Close dropdown after click on mobile/tablet
              if (isMobileDevice || isTabletDevice) {
                setActiveDropdown(null);
              }
            }}
          >
            <span className="flex items-center gap-2">
              <span className="text-gray-500 dark:text-gray-400">{item.icon}</span>
              {item.label}
            </span>
            {item.count !== undefined && (
              <span className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-medium px-2 py-0.5 rounded-full">
                {item.count}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 w-full 
        ${isScrolled 
          ? 'bg-white/90 dark:bg-gray-900/90 shadow-md backdrop-blur-lg' 
          : 'bg-white dark:bg-gray-900'} 
        transition-all duration-200`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center ${
          isMobileDevice ? 'h-16' : isTabletDevice ? 'h-18' : 'h-16 lg:h-20'
        }`}>
          {/* Logo and hamburger menu */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            {onMobileMenuToggle && (
              <button
                type="button"
                className={`${
                  isMobileDevice || isTabletDevice ? 'inline-flex' : 'lg:hidden inline-flex'
                } items-center justify-center rounded-md text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  isMobileDevice ? 'p-2 mr-2' : 'p-2 mr-3'
                }`}
                onClick={onMobileMenuToggle}
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <Menu size={isMobileDevice ? 22 : 24} />
              </button>
            )}
            
            {/* Use NavbarLogo component */}
            <div className={`${isMobileDevice ? 'ml-0' : 'ml-2 lg:ml-0'} flex-shrink-0`}>
              <NavbarLogo isScrolled={isScrolled} />
            </div>
          </div>

          {/* Search bar - Full version for desktop, hidden on mobile */}
          <div className={`${isMobileDevice ? 'hidden' : isTabletDevice ? 'flex' : 'hidden md:flex'} items-center flex-1 max-w-lg mx-8`}>
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative text-gray-400 focus-within:text-gray-600">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} />
                </div>
                <input
                  id="desktop-search"
                  className={`block w-full pl-10 pr-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                    isTabletDevice ? 'py-2.5' : 'py-2'
                  }`}
                  placeholder="Search courses, content, instructors..."
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>

          {/* Mobile search toggle button */}
          <div className={`${isMobileDevice ? 'flex' : 'md:hidden flex'} flex-1 justify-end`}>
            <button 
              onClick={toggleSearch}
              className={`rounded-md text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-white ${
                isMobileDevice ? 'p-2' : 'p-2'
              }`}
              aria-label="Search"
            >
              {isSearchActive ? <X size={22} /> : <Search size={22} />}
            </button>
          </div>

          {/* Right section: Progress, Notifications, Cart, Wishlist, Profile */}
          <div className={`flex items-center ${
            isMobileDevice ? 'space-x-1' : isTabletDevice ? 'space-x-1.5' : 'space-x-1 sm:space-x-2'
          }`}>
            {/* Progress Icon with Dropdown - hidden on mobile */}
            {!isMobileDevice && (
              <div 
                ref={progressDropdownRef}
                className="relative" 
              >
                <button
                  onClick={() => toggleDropdown('progress')}
                  onMouseEnter={() => handleDropdownHover('progress')}
                  onMouseLeave={() => handleDropdownLeave('progress')}
                  className={`rounded-full bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 group transition-all duration-200 relative overflow-visible ${
                    isTabletDevice ? 'p-2.5 min-w-[44px] min-h-[44px]' : 'p-2 min-w-[40px] min-h-[40px]'
                  }`}
                  aria-label="Learning Progress"
                  aria-expanded={activeDropdown === 'progress'}
                  aria-haspopup="true"
                >
                  <div className="flex flex-col items-center">
                    <BarChart2 size={isTabletDevice ? 22 : NAVBAR_ICON_SIZE} className={`text-blue-500 dark:text-blue-400 transform group-hover:scale-${HOVER_SCALE} transition-transform duration-${ANIMATION_DURATION}`} />
                  </div>
                </button>
                
                {activeDropdown === 'progress' && (
                  <div 
                    onMouseEnter={() => handleDropdownHover('progress')}
                    onMouseLeave={() => handleDropdownLeave('progress')}
                    className="dropdown-container"
                  >
                    {renderDropdownMenu(progressItems)}
                  </div>
                )}
              </div>
            )}

            {/* Notifications with Dropdown */}
            <div 
              ref={notificationsDropdownRef}
              className="relative"
            >
              <button
                onClick={() => toggleDropdown('notifications')}
                onMouseEnter={() => handleDropdownHover('notifications')}
                onMouseLeave={() => handleDropdownLeave('notifications')}
                className={`rounded-full bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 group transition-all duration-200 relative overflow-visible ${
                  isMobileDevice 
                    ? 'p-2 min-w-[40px] min-h-[40px]' 
                    : isTabletDevice 
                      ? 'p-2.5 min-w-[44px] min-h-[44px]' 
                      : 'p-2 min-w-[40px] min-h-[40px]'
                }`}
                aria-label={`Notifications - ${notificationCount} unread`}
                aria-expanded={activeDropdown === 'notifications'}
                aria-haspopup="true"
              >
                <div className="relative flex flex-col items-center">
                  {notificationCount > 0 && !isMobileDevice && (
                    <span className="text-xs font-bold text-primary-700 dark:text-primary-400 -mt-0.5 mb-0.5">
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </span>
                  )}
                  <Bell size={isMobileDevice ? 18 : isTabletDevice ? 22 : NAVBAR_ICON_SIZE} className={`transform group-hover:scale-${HOVER_SCALE} transition-transform duration-${ANIMATION_DURATION}`} />
                  {notificationCount > 0 && (
                    <span className={`absolute inline-flex items-center justify-center text-xs font-bold leading-none text-white transform bg-red-500 dark:bg-red-600 rounded-full ring-2 ring-white dark:ring-gray-900 ${
                      isMobileDevice 
                        ? '-top-1 -right-1 px-1.5 py-0.5 translate-x-1/3 -translate-y-1/3' 
                        : '-top-1 -right-1 px-1.5 py-0.5 translate-x-1/3 -translate-y-1/3 animate-pulse'
                    }`}>
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </span>
                  )}
                </div>
              </button>
              
              {activeDropdown === 'notifications' && (
                <div 
                  onMouseEnter={() => handleDropdownHover('notifications')}
                  onMouseLeave={() => handleDropdownLeave('notifications')}
                  className="dropdown-container"
                >
                  <div className={`absolute right-0 mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 z-50 transform origin-top-right transition-all duration-200 ${
                    isMobileDevice ? 'w-80 max-w-[90vw]' : isTabletDevice ? 'w-76' : 'w-72'
                  }`}>
                    {/* Notification Summary Header */}
                    <div className={`border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/90 ${
                      isMobileDevice || isTabletDevice ? 'px-4 py-3' : 'px-4 py-3'
                    }`}>
                      <div className="flex items-center justify-between">
                        <p className={`font-semibold text-gray-900 dark:text-white ${
                          isMobileDevice ? 'text-base' : 'text-sm'
                        }`}>
                          Notifications
                        </p>
                        <span className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {notificationCount} new
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        You have {notificationCount} unread notifications
                      </p>
                    </div>
                    <div className={`${isMobileDevice || isTabletDevice ? 'p-3' : 'p-2'}`}>
                      {notificationItems.map((item, index) => (
                        <Link
                          key={index}
                          href={item.href}
                          className={`flex items-center justify-between w-full text-left rounded-lg text-gray-700 hover:bg-gray-50 hover:text-primary-700 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white transition-colors duration-150 ${
                            isMobileDevice || isTabletDevice ? 'px-3 py-3 text-sm min-h-[48px]' : 'px-3 py-2 text-sm'
                          }`}
                          onClick={() => {
                            if (isMobileDevice || isTabletDevice) {
                              setActiveDropdown(null);
                            }
                          }}
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-gray-500 dark:text-gray-400">{item.icon}</span>
                            {item.label}
                          </span>
                          {item.count !== undefined && (
                            <span className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-medium px-2 py-0.5 rounded-full">
                              {item.count}
                            </span>
                          )}
                        </Link>
                      ))}
                      <div className="mt-1 pt-1 border-t border-gray-100 dark:border-gray-700">
                        <Link
                          href="/notifications"
                          className={`flex items-center justify-center w-full text-center text-primary-600 dark:text-primary-400 hover:text-primary-700 hover:underline dark:hover:text-primary-300 rounded-lg font-medium ${
                            isMobileDevice || isTabletDevice ? 'px-3 py-3 text-sm' : 'px-3 py-2 text-sm'
                          }`}
                          onClick={() => {
                            if (isMobileDevice || isTabletDevice) {
                              setActiveDropdown(null);
                            }
                          }}
                        >
                          View all notifications
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* EduStore/Cart with Coming Soon - hidden on mobile */}
            {!isMobileDevice && (
              <div 
                ref={cartDropdownRef}
                className="relative group"
              >
                <button
                  className={`rounded-full bg-gray-50 dark:bg-gray-800 text-primary-500 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 relative overflow-visible cursor-pointer ${
                    isTabletDevice ? 'p-2.5 min-w-[44px] min-h-[44px]' : 'p-2 min-w-[40px] min-h-[40px]'
                  }`}
                  aria-label="EduStore - Coming Soon"
                  title="EduStore - Coming Soon"
                >
                  <div className="relative flex flex-col items-center">
                    {cartItemCount > 0 && (
                      <span className="text-xs font-bold text-primary-700 dark:text-primary-400 -mt-0.5 mb-0.5">
                        {cartItemCount > 99 ? '99+' : cartItemCount}
                      </span>
                    )}
                    <ShoppingCart size={isTabletDevice ? 22 : NAVBAR_ICON_SIZE} className={`transform group-hover:scale-${HOVER_SCALE} group-hover:rotate-12 transition-all duration-${ANIMATION_DURATION}`} />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/3 -translate-y-1/3 bg-primary-500 dark:bg-primary-600 rounded-full ring-2 ring-white dark:ring-gray-900">
                        {cartItemCount > 99 ? '99+' : cartItemCount}
                      </span>
                    )}
                  </div>
                </button>

                {/* Coming Soon Tooltip */}
                <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-3 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-500 dark:to-primary-600 text-white font-medium rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 ${
                  isMobileDevice ? 'text-sm' : isTabletDevice ? 'text-sm' : 'text-sm'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🚀</span>
                    <span className="relative z-10">Coming Soon!</span>
                    <span className="text-lg animate-pulse">✨</span>
                  </div>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] border-transparent border-b-primary-600 dark:border-b-primary-500"></div>
                  
                  {/* Animated shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 animate-pulse"></div>
                </div>
              </div>
            )}

            {/* Wishlist with Dropdown - hidden on mobile */}
            {!isMobileDevice && (
              <div 
                ref={wishlistDropdownRef}
                className="relative"
              >
                <button
                  onClick={() => toggleDropdown('wishlist')}
                  onMouseEnter={() => handleDropdownHover('wishlist')}
                  onMouseLeave={() => handleDropdownLeave('wishlist')}
                  className={`rounded-full bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 group transition-all duration-200 relative overflow-visible ${
                    isTabletDevice ? 'p-2.5 min-w-[44px] min-h-[44px]' : 'p-2 min-w-[40px] min-h-[40px]'
                  }`}
                  aria-label="Wishlist"
                  aria-expanded={activeDropdown === 'wishlist'}
                  aria-haspopup="true"
                >
                  <div className="relative flex flex-col items-center">
                    {wishlistCount > 0 && (
                      <span className="text-xs font-bold text-primary-700 dark:text-primary-400 -mt-0.5 mb-0.5">
                        {wishlistCount > 99 ? '99+' : wishlistCount}
                      </span>
                    )}
                    <Heart size={isTabletDevice ? 22 : NAVBAR_ICON_SIZE} className={`transform group-hover:scale-${HOVER_SCALE} transition-transform duration-${ANIMATION_DURATION}`} />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/3 -translate-y-1/3 bg-pink-500 dark:bg-pink-600 rounded-full ring-2 ring-white dark:ring-gray-900">
                        {wishlistCount > 99 ? '99+' : wishlistCount}
                      </span>
                    )}
                  </div>
                </button>
                
                {activeDropdown === 'wishlist' && (
                  <div 
                    onMouseEnter={() => handleDropdownHover('wishlist')}
                    onMouseLeave={() => handleDropdownLeave('wishlist')}
                    className="dropdown-container"
                  >
                    {renderDropdownMenu(wishlistItems)}
                  </div>
                )}
              </div>
            )}

            {/* Profile Dropdown */}
            {isLoggedIn ? (
              <div 
                className="relative group/profile isolate" 
                ref={dropdownRef}
              >
                <button
                  onClick={toggleProfileDropdown}
                  onMouseEnter={openProfileDropdown}
                  className={`group flex items-center gap-2 rounded-xl text-sm border transition-all duration-${PROFILE_ANIMATION_DURATION} shadow-sm hover:shadow relative overflow-visible ${
                    isMobileDevice 
                      ? 'px-2 py-1.5' 
                      : isTabletDevice 
                        ? 'px-3 py-2' 
                        : 'px-3 sm:px-3 py-1.5 sm:py-1.5'
                  } ${
                    isDropdownOpen 
                      ? 'bg-primary-50 dark:bg-gray-700 text-primary-600 dark:text-white border-primary-200 dark:border-gray-600' 
                      : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white border-gray-200 dark:border-gray-700'
                  }`}
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="relative">
                    <User 
                      size={isMobileDevice ? 16 : isTabletDevice ? 18 : PROFILE_ICON_SIZE} 
                      className={`${isDropdownOpen ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'} transform group-hover:scale-${HOVER_SCALE} transition-all duration-${PROFILE_ANIMATION_DURATION}`} 
                    />
                    {isDropdownOpen && (
                      <span className="absolute bottom-0 right-0 w-2 h-2 bg-primary-500 rounded-full transform translate-x-1 translate-y-1 animate-pulse"></span>
                    )}
                  </div>
                  {!isMobileDevice && (
                    <span className={`font-medium truncate ${
                      isTabletDevice ? 'max-w-[120px]' : 'max-w-[100px]'
                    }`}>
                      {userName || "Account"}
                    </span>
                  )}
                  <ChevronDown 
                    size={isMobileDevice ? 14 : DROPDOWN_ICON_SIZE}
                    className={`transition-transform duration-${PROFILE_ANIMATION_DURATION} ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Profile Dropdown Menu with mobile optimizations */}
                <div 
                  onMouseEnter={openProfileDropdown}
                  onMouseLeave={closeProfileDropdown}
                  className={`absolute right-0 mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 z-40 transform origin-top-right transition-all duration-${PROFILE_ANIMATION_DURATION} ease-out before:absolute before:h-4 before:w-full before:-top-4 before:left-0 before:bg-transparent ${
                    isMobileDevice ? 'w-80 max-w-[90vw]' : isTabletDevice ? 'w-76' : 'w-72'
                  } ${
                    isDropdownOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
                  }`}
                >
                  {/* User Info Section - mobile optimized */}
                  <Link 
                    href="/dashboards/student/profile" 
                    onClick={() => setIsDropdownOpen(false)} 
                    className="block w-full"
                  >
                    <div className={`w-full h-full border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-900/10 transition ${
                      isMobileDevice || isTabletDevice ? 'px-4 py-4' : 'px-4 py-3'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full bg-primary-50 dark:bg-primary-900/20 ${
                          isMobileDevice || isTabletDevice ? 'p-2.5' : 'p-2'
                        }`}>
                          <User size={isMobileDevice || isTabletDevice ? 20 : PROFILE_ICON_SIZE} className="text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold text-gray-900 dark:text-white truncate ${
                            isMobileDevice ? 'text-base' : 'text-sm'
                          }`}>
                            {userName || "Welcome"}
                          </p>
                          <p className={`text-gray-500 dark:text-gray-400 mt-0.5 capitalize truncate flex items-center gap-1 ${
                            isMobileDevice ? 'text-sm' : 'text-xs'
                          }`}>
                            <span className={`w-2 h-2 rounded-full ${userRole ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                            <span className="flex items-center gap-1">
                              {getRoleIcon()}
                              {userRole || "User"}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                  
                  {/* Quick Actions */}
                  <div className={`${isMobileDevice || isTabletDevice ? 'p-3' : 'p-2'}`}>
                    <Link
                      href={getDashboardUrl()}
                      className={`flex items-center gap-3 w-full text-left rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-700 active:bg-primary-100 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white transition-colors duration-150 ${
                        isMobileDevice || isTabletDevice ? 'px-3 py-3 text-sm min-h-[48px]' : 'px-3 py-2 text-sm'
                      }`}
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-900/20">
                        <User size={DROPDOWN_ICON_SIZE} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <span>Dashboard</span>
                    </Link>
                    

                  </div>
                  
                  {/* Logout Section */}
                  <div className={`border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 ${
                    isMobileDevice || isTabletDevice ? 'p-3' : 'p-2'
                  }`}>
                    <button
                      onClick={handleLogout}
                      className={`flex items-center gap-3 w-full text-left rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 transition-colors duration-150 ${
                        isMobileDevice || isTabletDevice ? 'px-3 py-3 text-sm min-h-[48px]' : 'px-3 py-2 text-sm'
                      }`}
                    >
                      <div className="p-1.5 rounded-md bg-red-50 dark:bg-red-900/20">
                        <LogOut size={DROPDOWN_ICON_SIZE} className="text-red-500 dark:text-red-400" />
                      </div>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`flex items-center ${isMobileDevice ? 'space-x-1' : 'space-x-2'}`}>
                <Link
                  href="/login"
                  className={`font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 ${
                    isMobileDevice ? 'px-3 py-2 text-sm' : 'px-4 py-2 text-sm'
                  }`}
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className={`font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 rounded-lg transition-all duration-200 hover:shadow-md ${
                    isMobileDevice ? 'px-3 py-2 text-sm' : 'px-4 py-2 text-sm'
                  }`}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile search bar - only shows when active */}
        {isSearchActive && (
          <div className={`${isMobileDevice ? 'pb-3' : 'pb-3 md:hidden'}`}>
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative text-gray-400 focus-within:text-gray-600">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={NAVBAR_ICON_SIZE-2} />
                </div>
                <input
                  ref={searchInputRef}
                  className={`block w-full pl-10 pr-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                    isMobileDevice ? 'py-3 text-base' : 'py-2'
                  }`}
                  placeholder="Search..."
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>
        )}
      </div>
      
      {/* Global styles for dropdowns - mobile optimized */}
      <style jsx>{`
        .dropdown-container {
          position: absolute;
          right: 0;
          top: 100%;
          /* Extended hitbox to prevent dropdown from closing */
          padding-top: 8px;
          margin-top: -8px;
          z-index: 50;
        }
        
        /* Prevent font overlap issues */
        :global(.dropdown-container a, .dropdown-container button) {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        /* Create stacking contexts to prevent overlap */
        :global(.dropdown-container .absolute) {
          z-index: 60;
        }
        
        :global(button[aria-expanded="true"]) {
          z-index: 45;
          position: relative;
        }
        
        /* Prevent hover flickering on desktop only */
        @media (min-width: 1024px) {
          :global(.dropdown-container:hover) {
            pointer-events: all;
          }
        }
        
        /* Fix animation overlap */
        :global(.group\/profile) {
          z-index: 45;
          isolation: isolate;
        }
        
        /* Improve text rendering in dropdowns */
        :global(.dropdown-container span) {
          max-width: 100%;
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        /* Smoother transitions for all interactive elements */
        :global(.navbar-icon) {
          transition: transform 200ms ease, 
                     color 200ms ease;
        }
        
        /* Make profile transitions faster and snappier */
        :global(.group\/profile button) {
          transition-duration: 150ms;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        :global(.group\/profile [aria-expanded="true"] + div) {
          transition-duration: 150ms;
          transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
        }
        
        /* Prevent animations from stacking/overlapping */
        :global(.dropdown-container, 
                button[aria-haspopup="true"],
                button[aria-expanded="true"]) {
          transform-style: preserve-3d;
          backface-visibility: hidden;
          will-change: transform, opacity;
        }
        
        /* Mobile-specific optimizations */
        @media (max-width: 767px) {
          :global(.dropdown-container) {
            /* Ensure dropdowns don't go off-screen on mobile */
            max-width: 90vw;
            right: 0;
            left: auto;
          }
          
          /* Larger touch targets on mobile */
          :global(button) {
            min-height: 44px;
            min-width: 44px;
          }
          
          /* Disable hover effects on mobile */
          :global(.dropdown-container:hover) {
            pointer-events: none;
          }
        }
        
        /* Tablet-specific optimizations */
        @media (min-width: 768px) and (max-width: 1023px) {
          :global(.dropdown-container) {
            max-width: 85vw;
          }
        }
      `}</style>
    </header>
  );
};

export default DashboardNavbar; 