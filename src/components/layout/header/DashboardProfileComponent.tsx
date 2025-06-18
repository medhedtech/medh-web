"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useIsClient } from "@/utils/hydration";

// Icons
import {
  User,
  LogOut,
  Settings,
  ChevronDown,
  UserCircle,
  Shield,
  Briefcase,
  GraduationCap,
  School,
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

interface DashboardProfileProps {
  isScrolled?: boolean;
}

const DashboardProfileComponent: React.FC<DashboardProfileProps> = ({ isScrolled = false }) => {
  const router = useRouter();
  const { getQuery } = useGetQuery();
  const isClient = useIsClient();
  
  // State management
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [notificationCount] = useState(3); // You can make this dynamic
  
  // Refs
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Constants for consistent sizing
  const PROFILE_ICON_SIZE = 20;
  const DROPDOWN_ICON_SIZE = 16;
  const HOVER_SCALE = "105";
  const PROFILE_ANIMATION_DURATION = "200";

  // Profile dropdown functions
  const openProfileDropdown = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setIsDropdownOpen(true);
  };

  const closeProfileDropdown = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 150);
  };

  useEffect(() => {
    if (!isClient) return;
    
    // Check if user is logged in by looking for token and userId
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!token && !!userId);

    if (token && userId) {
      // First try to get user info from localStorage
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
                localStorage.setItem("role", role);
              }
            }
          } catch (tokenError) {
            console.error("Invalid token:", tokenError);
          }
        }
        
        // Optional: Fetch from API for most up-to-date info
        getQuery({
          url: `${apiUrls?.user?.getDetailsbyId}/${userId}`,
          requireAuth: true,
          onSuccess: (response) => {
            if (response?.data) {
              const userData = response.data;
              const newName = userData.fullName || userData.name || userData.email?.split('@')[0] || "";
              const newRole = String(userData.role || "");
              
              if (newName && newName !== userName) {
                setUserName(newName);
                localStorage.setItem("fullName", newName);
              }
              
              if (newRole && newRole !== userRole) {
                setUserRole(newRole);
                localStorage.setItem("role", newRole);
              }
            }
          },
          onFail: (error) => {
            console.error("Failed to fetch user details:", error);
          },
        });
      } catch (error) {
        console.error("Error accessing localStorage:", error);
      }
    }

    // Handle clicks outside dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, [isClient]);

  // Get dashboard URL based on role
  const getDashboardUrl = () => {
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

  // Handle logout
  const handleLogout = () => {
    clearAuthData();
    
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

  if (!isLoggedIn) {
    return (
      <div className="flex items-center space-x-2">
        <Link
          href="/login"
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
        >
          Log In
        </Link>
        <Link
          href="/signup"
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 rounded-lg transition-all duration-200 hover:shadow-md"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 md:space-x-4">
      {/* Profile Section */}
      <div 
        ref={dropdownRef}
        className="relative"
        onMouseEnter={openProfileDropdown}
        onMouseLeave={closeProfileDropdown}
      >
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`group flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl
            ${isScrolled ? 'text-sm' : 'text-base'}
            bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-700/50
            text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white
            border border-gray-200 dark:border-gray-700
            transition-all duration-200 w-full max-w-[220px] min-w-[160px]`}
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
        >
          <div className="relative">
            <User 
              size={PROFILE_ICON_SIZE} 
              className={`${isDropdownOpen ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'} transform group-hover:scale-${HOVER_SCALE} transition-all duration-${PROFILE_ANIMATION_DURATION}`} 
            />
            {isDropdownOpen && (
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-primary-500 rounded-full transform translate-x-1 translate-y-1 animate-pulse"></span>
            )}
          </div>
          <span className="font-medium truncate max-w-[100px]">{userName || "Account"}</span>
          <ChevronDown 
            size={DROPDOWN_ICON_SIZE}
            className={`transition-transform duration-${PROFILE_ANIMATION_DURATION} ${isDropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Profile Dropdown Menu */}
        <div 
          onMouseEnter={openProfileDropdown}
          onMouseLeave={closeProfileDropdown}
          className={`absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 z-50 transform origin-top-right transition-all duration-${PROFILE_ANIMATION_DURATION} ease-out ${isDropdownOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2 pointer-events-none'} before:absolute before:h-4 before:w-full before:-top-4 before:left-0 before:bg-transparent`}
        >
          {/* User Info Section - clickable to go to profile */}
          <Link href="/dashboards/student/profile" onClick={() => setIsDropdownOpen(false)} className="block w-full">
            <div className="w-full h-full px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-900/10 transition">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary-50 dark:bg-primary-900/20">
                  <User size={PROFILE_ICON_SIZE} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {userName || "Welcome"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 capitalize truncate flex items-center gap-1">
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
          <div className="p-2">
            <Link
              href={getDashboardUrl()}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-left rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-700 active:bg-primary-100 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white transition-colors duration-150"
              onClick={() => setIsDropdownOpen(false)}
            >
              <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-900/20">
                <User size={DROPDOWN_ICON_SIZE} className="text-blue-600 dark:text-blue-400" />
              </div>
              <span>Dashboard</span>
            </Link>
            

          </div>
          
          {/* Logout Section */}
          <div className="p-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-left rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 transition-colors duration-150"
            >
              <div className="p-1.5 rounded-md bg-red-50 dark:bg-red-900/20">
                <LogOut size={DROPDOWN_ICON_SIZE} className="text-red-500 dark:text-red-400" />
              </div>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProfileComponent; 