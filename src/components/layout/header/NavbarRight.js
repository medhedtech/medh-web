"use client";
import React, { useState, useEffect, useRef } from "react";
import DropdownCart from "./DropdownCart";
import Link from "next/link";
import useIsTrue from "@/hooks/useIsTrue";
import LoginButton from "./LoginButton";
import { ShoppingBag, ExternalLink, User, LogOut, Settings, ChevronDown, UserCircle, Shield, Briefcase, GraduationCap, School } from "lucide-react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import { clearAuthData } from "@/utils/auth";
// import CurrencySelector from "@/components/shared/currency/CurrencySelector";

const NavbarRight = ({ isScrolled }) => {
  const router = useRouter();
  const { getQuery } = useGetQuery();
  const isHome4 = useIsTrue("/home-4");
  const isHome4Dark = useIsTrue("/home-4-dark");
  const isHome5 = useIsTrue("/home-5");
  const isHome5Dark = useIsTrue("/home-5-dark");
  const isHome2Dark = useIsTrue("/home-2-dark");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
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
            const decoded = jwtDecode(token);
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
        
        // Optional: Fetch from API for most up-to-date info (only if we have both name and role cached)
        // Skip API call if we don't have cached user data to avoid unnecessary auth errors
        if (storedFullName && storedRole) {
          getQuery({
            url: `${apiUrls?.user?.getDetailsbyId}/${userId}`,
            requireAuth: true,
            showToast: false, // Don't show error toast for this optional call
            onSuccess: (response) => {
              if (response?.data) {
                const userData = response.data;
                // Update with latest data from API
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
              // If 401/403, clear invalid auth data
              if (error.response?.status === 401 || error.response?.status === 403) {
                console.warn("Auth token appears to be invalid, clearing auth data");
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                localStorage.removeItem("fullName");
                localStorage.removeItem("role");
                setIsLoggedIn(false);
                setUserName("");
                setUserRole("");
              } else {
                console.error("Failed to fetch user details:", error);
              }
            },
          });
        }
      } catch (error) {
        console.error("Error accessing localStorage:", error);
      }
    }

    // Add event listener for storage changes
    const handleStorageChange = (e) => {
      // Check if relevant items changed
      if (e.key === "token" || e.key === "userId") {
        const newToken = localStorage.getItem("token");
        const newUserId = localStorage.getItem("userId");
        setIsLoggedIn(!!newToken && !!newUserId);
      } else if (e.key === "fullName") {
        setUserName(localStorage.getItem("fullName") || "");
      } else if (e.key === "role") {
        setUserRole(localStorage.getItem("role") || "");
      }
    };

    // Handle clicks outside dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  return (
    <div className="flex items-center space-x-2 md:space-x-4">
      <ul className="flex items-center space-x-1 md:space-x-3">
        {/* Currency Selector - Enhanced Responsiveness */}
        {/* <li className="hidden md:block min-w-[80px]">
          <CurrencySelector mini={true} />
        </li> */}
        
        {/* Login Button */}
        {!(isHome4 || isHome4Dark || isHome5 || isHome5Dark) && !isLoggedIn && (
          <li className="hidden lg:block">
            <LoginButton isScrolled={isScrolled} />
          </li>
        )}
        
        {/* Unified Profile Section */}
        {isLoggedIn && (
          <li className="hidden lg:block relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`group flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl
                ${isScrolled ? 'text-sm' : 'text-base'}
                bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-700/50
                text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white
                border border-gray-200 dark:border-gray-700
                transition-all duration-200 w-full max-w-[220px] min-w-[160px]`}
            >
              <div className="relative">
                <User size={20} className="text-gray-600 dark:text-gray-400" />
                {isDropdownOpen && (
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-primary-500 rounded-full transform translate-x-1 translate-y-1"></span>
                )}
              </div>
              <span className="font-medium truncate max-w-[100px]">{userName || "Account"}</span>
              <ChevronDown 
                size={16}
                className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Enhanced Profile Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 z-50 transform origin-top-right transition-all duration-200 animate-fadeIn">
                {/* User Info Section - now fully clickable */}
                <Link
                  href="/dashboards/student/profile"
                  className="block w-full px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-900/10 transition"
                  onClick={() => setIsDropdownOpen(false)}
                >
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
                </Link>
                
                {/* Quick Actions */}
                <div className="p-2">
                  <Link
                    href={getDashboardUrl()}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left rounded-lg
                      text-gray-700 hover:bg-gray-50 hover:text-primary-700 
                      dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white
                      transition-colors duration-150"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <User size={16} className="text-gray-400 dark:text-gray-500" />
                    <span>Dashboard</span>
                  </Link>
                  

                </div>
                
                {/* Logout Section */}
                <div className="p-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left rounded-lg
                      text-red-600 hover:bg-red-50 hover:text-red-700
                      dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300
                      transition-colors duration-150"
                  >
                    <LogOut size={16} className="text-red-500 dark:text-red-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </li>
        )}
        
        {/* Enhanced Get Started Button */}
        {!isLoggedIn && (
          <li className="hidden lg:block">
            <Link
              href="/signup"
              className={`group relative inline-flex items-center justify-center gap-2 
                px-4 sm:px-5 py-2 sm:py-2.5
                ${isScrolled ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'} 
                min-w-[130px] max-w-[200px] w-full
                font-medium text-primary-500
                bg-white/10 
                hover:bg-white/20
                border border-primary-300/30
                rounded-lg
                transition-all duration-200
                overflow-hidden`}
              aria-label="Sign up for a free account"
            >
              {/* Simple text with icon */}
              <span className="relative z-10 inline-flex items-center gap-1.5">
                Sign Up for Free
                <ExternalLink size={15} className="transform transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default NavbarRight;
