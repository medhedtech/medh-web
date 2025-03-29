"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { jwtDecode } from "jwt-decode";

/**
 * Profile router page
 * Automatically redirects users to their role-specific profile page
 */
export default function ProfileRouter() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to handle redirection based on user role
    const redirectToRoleProfile = () => {
      try {
        setLoading(true);
        
        // Check if we're in a browser environment
        if (typeof window === "undefined") return;
        
        // Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          // No token found, redirect to login
          setError("You must be logged in to view your profile");
          setTimeout(() => router.push("/login"), 2000);
          return;
        }
        
        // Try to get role from multiple sources
        let userRole = '';
        
        // First, check localStorage for role (set during login)
        userRole = localStorage.getItem("role");
        
        // If role wasn't found in localStorage, try to decode token
        if (!userRole && token) {
          try {
            const decoded = jwtDecode(token);
            console.log("Decoded token:", decoded);
            
            // Try different possible paths for role in the token
            if (decoded.user && decoded.user.role) {
              // If role is an array, take the first one, otherwise use it directly
              userRole = Array.isArray(decoded.user.role) 
                ? decoded.user.role[0] 
                : decoded.user.role;
            } else if (decoded.role) {
              // Alternative path: directly in the token
              userRole = Array.isArray(decoded.role) 
                ? decoded.role[0] 
                : decoded.role;
            }
          } catch (err) {
            console.error("Error decoding JWT token:", err);
            setError("Session expired or invalid. Please login again.");
            setTimeout(() => router.push("/login"), 2000);
            return;
          }
        }
        
        if (!userRole) {
          // Still no role found, redirect to login
          console.error("No user role found");
          setError("Unable to determine user role. Please login again.");
          setTimeout(() => router.push("/login"), 2000);
          return;
        }
        
        console.log("User role found for profile redirect:", userRole);
        
        // Convert role to lowercase for case-insensitive comparison
        const roleLower = userRole.toLowerCase();
        
        // Construct the profile URL based on role
        let profileUrl = `/dashboards/${roleLower}-profile`;
        
        // Special case for corporate-student
        if (roleLower === "coorporate-student") {
          profileUrl = "/dashboards/coorporate-employee-profile";
        }
        
        console.log(`Redirecting to ${profileUrl}`);
        router.push(profileUrl);
      } catch (err) {
        console.error("Error during profile redirection:", err);
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    // Execute the redirect function
    redirectToRoleProfile();
  }, [router]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <Loader2 size={40} className="text-primary-500 animate-spin mb-4" />
        <p className="text-lg font-body text-gray-700 dark:text-gray-300">
          Loading your profile...
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="p-6 max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="text-red-500 dark:text-red-400 h-6 w-6" />
            <h2 className="text-xl font-heading font-semibold text-red-600 dark:text-red-400">
              Profile Access Error
            </h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
          <p className="text-gray-600 dark:text-gray-400">
            You will be redirected to the login page shortly.
          </p>
        </div>
      </div>
    );
  }

  // This should rarely be visible as the useEffect should trigger a redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="p-6 max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-xl font-heading font-semibold text-gray-900 dark:text-white mb-4">
          Profile Access
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          Please wait while we redirect you to your profile page.
        </p>
      </div>
    </div>
  );
}
// import { useEffect } from "react";   