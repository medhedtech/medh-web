"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut, ChevronRight, Settings, BookOpen, Heart, ShoppingBag } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import { clearAuthData } from "@/utils/auth";

/**
 * Enhanced MobileMyAccount component
 * Provides user account management in the mobile menu
 * Synced with NavbarRight functionality for consistency
 */
const MobileMyAccount = ({ onClose }) => {
  const router = useRouter();
  const { getQuery } = useGetQuery();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  // Check authentication status on mount
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

    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Handle logout
  const handleLogout = useCallback(() => {
    // Clear all auth data, but keep remember me settings
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
    
    // Close mobile menu if onClose function is provided
    if (typeof onClose === 'function') {
      onClose();
    }
    
    // Redirect to home
    router.push("/");
  }, [router, onClose]);

  // Get dashboard URL based on role
  const getDashboardUrl = useCallback(() => {
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
  }, [userRole]);

  // Toggle accordion
  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mt-4 mb-6">
      <div className="accordion group">
        {/* Accordion header */}
        <div 
          className="accordion-controller flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer"
          onClick={toggleAccordion}
          aria-expanded={isExpanded}
          aria-controls="account-content"
        >
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mr-3">
              <User size={16} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                {isLoggedIn ? 'My Account' : 'Account'}
              </h3>
              {isLoggedIn && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {userName || "User"}
                </p>
              )}
            </div>
          </div>
          <ChevronRight 
            size={18} 
            className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} 
          />
        </div>

        {/* Accordion content */}
        <div 
          id="account-content"
          className={`overflow-hidden transition-all duration-300 ${
            isExpanded ? 'max-h-96 mt-2' : 'max-h-0'
          }`}
        >
          <div className="py-2 space-y-2">
            {isLoggedIn ? (
              <>
                {/* Dashboard link */}
                <Link
                  href={getDashboardUrl()}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  onClick={onClose}
                >
                  <Settings size={16} className="mr-3 text-gray-500 dark:text-gray-400" />
                  <span>Dashboard</span>
                </Link>
                
                {/* My Courses link */}
                <Link
                  href="/my-courses"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  onClick={onClose}
                >
                  <BookOpen size={16} className="mr-3 text-gray-500 dark:text-gray-400" />
                  <span>My Courses</span>
                </Link>
                
                {/* Wishlist link */}
                <Link
                  href="/wishlist"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  onClick={onClose}
                >
                  <Heart size={16} className="mr-3 text-gray-500 dark:text-gray-400" />
                  <span>Wishlist</span>
                </Link>
                
                {/* Orders link */}
                <Link
                  href="/orders"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  onClick={onClose}
                >
                  <ShoppingBag size={16} className="mr-3 text-gray-500 dark:text-gray-400" />
                  <span>Orders</span>
                </Link>
                
                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <LogOut size={16} className="mr-3 text-red-500 dark:text-red-400" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="space-y-2 px-2">
                {/* Login button */}
                <Link
                  href="/login"
                  className="flex items-center justify-center w-full px-3 py-2 text-sm text-gray-700 hover:text-primary-600 bg-white dark:bg-gray-800 dark:text-gray-300 dark:hover:text-primary-400 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  onClick={onClose}
                >
                  <span>Log in</span>
                </Link>
                
                {/* Signup button */}
                <Link
                  href="/signup"
                  className="flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-500 via-purple-500 to-primary-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                  onClick={onClose}
                >
                  <span>Sign up for free</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMyAccount;
