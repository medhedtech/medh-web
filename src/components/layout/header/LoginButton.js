"use client";

import useIsTrue from "@/hooks/useIsTrue";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, User, LogOut, ChevronDown } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { getAuthToken, getUserId, clearAuthData, sanitizeAuthData } from "@/utils/auth";

const LoginButton = () => {
  const isHome2Dark = useIsTrue("/home-2-dark");
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check login status on component mount
  useEffect(() => {
    setMounted(true);
    
    // Only run on client-side
    if (typeof window !== "undefined") {
      // Sanitize any invalid auth data first
      sanitizeAuthData();
      
      const token = getAuthToken();
      const userId = getUserId();
      
      if (token && userId) {
        try {
          // Attempt to decode the token to get user info
          const decoded = jwtDecode(token);
          setIsLoggedIn(true);
          
          // Get user role
          let role = localStorage.getItem("role") || "";
          if (!role && decoded.user && decoded.user.role) {
            role = Array.isArray(decoded.user.role) ? decoded.user.role[0] : decoded.user.role;
          } else if (!role && decoded.role) {
            role = Array.isArray(decoded.role) ? decoded.role[0] : decoded.role;
          }
          setUserRole(role);
          
          // Try to get user name from token if available
          let name = "";
          if (decoded.user && decoded.user.name) {
            name = decoded.user.name;
          } else if (decoded.name) {
            name = decoded.name;
          } else if (decoded.user && decoded.user.email) {
            // Use email as fallback
            name = decoded.user.email.split('@')[0];
          }
          setUserName(name);
        } catch (error) {
          console.error("Invalid token:", error);
          setIsLoggedIn(false);
          // Clear potentially corrupted auth data
          clearAuthData();
        }
      } else {
        setIsLoggedIn(false);
      }
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    // Clear all auth data using the utility function, but keep remember me settings
    const keepRememberMe = true; // This preserves email for next login
    clearAuthData(keepRememberMe);
    
    // Clear additional data that might be stored
    localStorage.removeItem("role");
    localStorage.removeItem("permissions");
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    
    setIsLoggedIn(false);
    setIsMenuOpen(false);
    
    // Redirect to home
    router.push("/");
  };

  // Toggle dropdown menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu if clicked outside
  useEffect(() => {
    if (!isMenuOpen) return;
    
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest(".user-menu-container")) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  // Don't render anything during SSR to prevent hydration errors
  if (!mounted) {
    return null;
  }

  // Get dashboard URL based on role
  const getDashboardUrl = () => {
    const roleLower = userRole.toLowerCase();
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

  // If user is not logged in, show login button
  if (!isLoggedIn) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-900 bg-white hover:bg-primary-50 border border-gray-200 rounded-lg transition-all duration-200 hover:border-primary-300 hover:text-primary-700 transform hover:-translate-y-0.5 shadow-sm hover:shadow-md dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:border-gray-600"
      >
        {isHome2Dark ? (
          <>
            <span>Login</span>
            <LogIn size={18} />
          </>
        ) : (
          <>
            <LogIn size={18} className="text-primary-600" />
            <span>Login</span>
          </>
        )}
      </Link>
    );
  }

  // If user is logged in, show user menu with dropdown
  return (
    <div className="relative user-menu-container">
      {/* User profile button that opens dropdown */}
      <button
        onClick={toggleMenu}
        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-900 bg-white hover:bg-primary-50 border border-gray-200 rounded-lg transition-all duration-200 hover:border-primary-300 hover:text-primary-700 shadow-sm hover:shadow-md dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:border-gray-600"
        aria-haspopup="true"
        aria-expanded={isMenuOpen}
      >
        <User size={18} className="text-primary-600 dark:text-primary-400" />
        <span className="max-w-[100px] truncate">
          {userName || "Account"}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown menu */}
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100 z-50 py-1 animate-fadeIn dark:bg-gray-800 dark:border-gray-700">
          <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {userName || "User"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize truncate">
              {userRole || "User"}
            </p>
          </div>
          
          <Link
            href={getDashboardUrl()}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 hover:text-primary-700 transition-colors dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg
              className="w-4 h-4 text-gray-400 dark:text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Dashboard
          </Link>
          
          <Link
            href="/profile"
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 hover:text-primary-700 transition-colors dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            onClick={() => setIsMenuOpen(false)}
          >
            <User size={16} className="text-gray-400 dark:text-gray-500" />
            Profile
          </Link>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 transition-colors dark:text-red-400 dark:hover:bg-gray-700"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

// Add keyframe animation for fade-in effect
const FadeInAnimation = () => (
  <style jsx global>{`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.2s ease-out forwards;
    }
  `}</style>
);

export default LoginButton;
