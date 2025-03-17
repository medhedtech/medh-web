"use client";
import React, { useState, useEffect, useRef } from "react";
import DropdownCart from "./DropdownCart";
import Link from "next/link";
import useIsTrue from "@/hooks/useIsTrue";
import LoginButton from "./LoginButton";
import { ShoppingBag, ExternalLink, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
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
      // Fetch user details from API
      getQuery({
        url: `${apiUrls?.user?.getDetailsbyId}/${userId}`,
        onSuccess: (response) => {
          if (response?.data) {
            const userData = response.data;
            // Set user name - prefer full name if available
            setUserName(userData.name || userData.email?.split('@')[0] || "");
            // Set user role - ensure it's a string
            setUserRole(String(userData.role || ""));
          }
        },
        onFail: (error) => {
          console.error("Failed to fetch user details:", error);
          // Fallback to token data if API fails
          try {
            const decoded = jwtDecode(token);
            let name = "";
            if (decoded.user && decoded.user.name) {
              name = decoded.user.name;
            } else if (decoded.name) {
              name = decoded.name;
            } else if (decoded.user && decoded.user.email) {
              name = decoded.user.email.split('@')[0];
            }
            setUserName(name);

            // Ensure role is always a string
            let role = String(localStorage.getItem("role") || "");
            if (!role && decoded.user && decoded.user.role) {
              role = String(Array.isArray(decoded.user.role) ? decoded.user.role[0] : decoded.user.role);
            } else if (!role && decoded.role) {
              role = String(Array.isArray(decoded.role) ? decoded.role[0] : decoded.role);
            }
            setUserRole(role);
          } catch (error) {
            console.error("Invalid token:", error);
          }
        },
      });
    }

    // Add event listener for storage changes
    const handleStorageChange = () => {
      const newToken = localStorage.getItem("token");
      const newUserId = localStorage.getItem("userId");
      setIsLoggedIn(!!newToken && !!newUserId);
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
    // Clear all auth data
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
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
    // Ensure userRole is a string and provide a default value
    const roleLower = (userRole || "").toLowerCase();
    
    if (roleLower === "admin" || roleLower === "super-admin") {
      return "/dashboards/admin-dashboard";
    } else if (roleLower === "instructor") {
      return "/dashboards/instructor-dashboard";
    } else if (roleLower === "student") {
      return "/dashboards/student-dashboard";
    } else if (roleLower === "coorporate") {
      return "/dashboards/coorporate-dashboard";
    } else if (roleLower === "coorporate-student") {
      return "/dashboards/coorporate-employee-dashboard";
    } else {
      // Default dashboard route if role is not recognized or undefined
      return "/dashboards";
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
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {/* Enhanced Profile Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 z-50 transform origin-top-right transition-all duration-200 animate-fadeIn">
                {/* User Info Section */}
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {userName || "Welcome"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 capitalize truncate flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${userRole ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                    {userRole || "User"}
                  </p>
                </div>
                
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
                  
                  <Link
                    href="/profile/settings"
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left rounded-lg
                      text-gray-700 hover:bg-gray-50 hover:text-primary-700 
                      dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white
                      transition-colors duration-150"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="text-gray-400 dark:text-gray-500"
                    >
                      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <span>Settings</span>
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
                px-3 sm:px-5 py-1.5 sm:py-2.5
                ${isScrolled ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'} 
                min-w-[120px] max-w-[220px] w-full
                font-medium text-white bg-gradient-to-r from-primary-500 via-purple-500 to-primary-600 
                rounded-xl shadow-lg hover:shadow-xl
                transform hover:-translate-y-0.5 transition-all duration-300
                overflow-hidden`}
            >
              <span className="relative z-10 inline-flex items-center font-semibold tracking-wide overflow-hidden whitespace-nowrap text-ellipsis max-w-full">
                <span className="animate-shimmer bg-clip-text text-transparent bg-[linear-gradient(110deg,#fff,45%,#7ECA9D,55%,#fff)] bg-[length:250%_100%] truncate">
                  Sign Up for Free
                </span>
                <ExternalLink size={14} className="ml-1 flex-shrink-0 transform transition-transform group-hover:translate-x-0.5 group-hover:rotate-45" />
              </span>
              
              {/* Enhanced hover effect */}
              <div className="absolute -inset-1 rounded-xl blur-xl bg-gradient-to-r from-primary-500/30 via-purple-500/30 to-primary-600/30 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default NavbarRight;
