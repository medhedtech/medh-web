"use client";
import React, { useState, useEffect, useRef } from "react";
import DropdownCart from "./DropdownCart";
import Link from "next/link";
import MobileMenuOpen from "@/components/shared/buttons/MobileMenuOpen";
import useIsTrue from "@/hooks/useIsTrue";
import LoginButton from "./LoginButton";
import { ShoppingBag, ExternalLink, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";

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
        {/* Login Button */}
        {!(isHome4 || isHome4Dark || isHome5 || isHome5Dark) && !isLoggedIn && (
          <li className="hidden lg:block">
            <LoginButton isScrolled={isScrolled} />
          </li>
        )}
        
        {/* Profile Section - Only shown when logged in */}
        {isLoggedIn && (
          <li className="hidden lg:block relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl
                ${isScrolled ? 'text-sm' : 'text-base'}
                text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white
                transition-colors duration-200`}
            >
              <User size={20} className="text-gray-600 dark:text-gray-400" />
              <span className="font-medium">Hi {userName || "there"}</span>
            </button>

            {/* Profile Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100 z-50 py-1 animate-fadeIn dark:bg-gray-800 dark:border-gray-700">
                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    Hi {userName || "there"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize truncate">
                    {userRole || "User"}
                  </p>
                </div>
                
                <Link
                  href={getDashboardUrl()}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 hover:text-primary-700 transition-colors dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <User size={16} className="text-gray-400 dark:text-gray-500" />
                  Dashboard
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 transition-colors dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <LogOut size={16} className="text-red-500 dark:text-red-400" />
                  Logout
                </button>
              </div>
            )}
          </li>
        )}
        
        {/* Get Started Button */}
        {!isLoggedIn && (
          <li className="hidden lg:block">
            <Link
              href="/signup"
              className={`group relative inline-flex items-center justify-center gap-2 px-6 py-2.5
                ${isScrolled ? 'text-sm' : 'text-base'} 
                font-medium text-white bg-gradient-to-r from-primary-500 via-purple-500 to-primary-600 
                bg-size-200 bg-pos-0 hover:bg-pos-100
                rounded-xl shadow-lg hover:shadow-xl shadow-primary-500/20 hover:shadow-primary-500/30
                transform hover:-translate-y-0.5 transition-all duration-300 overflow-hidden`}
            >
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 
                translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              
              {/* Animated text container */}
              <div className="relative flex items-center">
                <span className="relative z-10 inline-flex items-center font-semibold tracking-wide">
                  {isHome2Dark ? (
                    <>
                      <span className="animate-shimmer bg-clip-text text-transparent bg-[linear-gradient(110deg,#fff,45%,#7ECA9D,55%,#fff)] bg-[length:250%_100%]">
                        Signup For Free
                      </span>
                      <span className="ml-1 transform transition-transform group-hover:translate-x-1">
                        <ExternalLink size={16} className="transform transition-transform group-hover:rotate-45" />
                      </span>
                    </>
                  ) : isHome4 || isHome4Dark || isHome5 || isHome5Dark ? (
                    <>
                      <span className="animate-shimmer bg-clip-text text-transparent bg-[linear-gradient(110deg,#fff,45%,#7ECA9D,55%,#fff)] bg-[length:250%_100%]">
                       Signup For Free
                      </span>
                      <span className="ml-1 transform transition-transform group-hover:translate-x-1">
                        <ExternalLink size={16} className="transform transition-transform group-hover:rotate-45" />
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="animate-shimmer bg-clip-text text-transparent bg-[linear-gradient(110deg,#fff,45%,#7ECA9D,55%,#fff)] bg-[length:250%_100%]">
                        Signup For Free
                      </span>
                      <span className="ml-1 transform transition-transform group-hover:translate-x-1">
                        <ExternalLink size={16} className="transform transition-transform group-hover:rotate-45" />
                      </span>
                    </>
                  )}
                </span>
              </div>

              {/* Enhanced hover effect */}
              <div className="absolute -inset-1 rounded-xl blur-xl bg-gradient-to-r from-primary-500/30 via-purple-500/30 to-primary-600/30 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </Link>

            <style jsx global>{`
              @keyframes shimmer {
                from {
                  background-position: 100% 100%;
                }
                to {
                  background-position: 0% 0%;
                }
              }
              .animate-shimmer {
                animation: shimmer 2.5s linear infinite;
              }
              .bg-size-200 {
                background-size: 200% 100%;
              }
              .bg-pos-0 {
                background-position: 0% 0%;
              }
              .bg-pos-100 {
                background-position: 100% 100%;
              }
            `}</style>
          </li>
        )}
        
        {/* Mobile Menu Button (showing in mobile view only) */}
        <li className="block lg:hidden">
          <MobileMenuOpen />
        </li>
      </ul>
    </div>
  );
};

export default NavbarRight;
