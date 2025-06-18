"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

// Define the types for navigation items
export interface SubItem {
  name: string;
  path?: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
  onClick?: () => void;
}

export interface MenuItem {
  name: string;
  path?: string;
  icon: React.ReactNode;
  onClick?: () => void;
  subItems?: SubItem[];
  comingSoon?: boolean;
}

export interface ItemSection {
  title?: string;
  items: MenuItem[];
}

// Define the context type
interface NavigationContextType {
  // State
  activeMenu: string | null;
  openSubMenu: string | null;
  isMobileDevice: boolean;
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  searchTerm: string;
  userInfo: {
    isLoggedIn: boolean;
    fullName: string;
    userRole: string;
    userEmail: string;
    userImage: string;
  };
  
  // Path indicators
  isPathAdmin: boolean;
  isPathInstructor: boolean;
  isPathStudent: boolean;
  isPathParent: boolean;
  isPathCorporate: boolean;
  
  // Sidebar data
  activeSidebar: ItemSection[];
  
  // Actions
  setActiveMenu: (menu: string | null) => void;
  setOpenSubMenu: (menu: string | null) => void;
  setSidebarOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setSearchTerm: (term: string) => void;
  handleMenuClick: (menuName: string, items?: SubItem[]) => void;
  handleSubMenuClick: (subItem: SubItem) => void;
  handleLogout: () => void;
  findMenuMatchingView: (view: string) => string | null;
}

// Create the context
const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

// Provider component
interface NavigationProviderProps {
  children: ReactNode;
  studentSidebar: ItemSection[];
  instructorSidebar: ItemSection[];
  parentSidebar: ItemSection[];
  adminSidebar: ItemSection[];
  corporateSidebar?: ItemSection[];
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
  studentSidebar,
  instructorSidebar,
  parentSidebar,
  adminSidebar,
  corporateSidebar = []
}) => {
  const pathname = usePathname();
  const router = useRouter();
  
  // State management
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(false);
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [userInfo, setUserInfo] = useState({
    isLoggedIn: false,
    fullName: "",
    userRole: "",
    userEmail: "",
    userImage: ""
  });
  
  // Parse path to determine user type
  const pathParts = pathname?.split("/") || [];
  const dashboardType = pathParts[2]?.split("-")[0] || '';
  const dashboardSubType = pathParts[2]?.split("-")[1] || '';
  
  const isPathAdmin = dashboardType === "admin";
  const isPathInstructor = dashboardType === "instructor";
  const isPathStudent = dashboardType === "student" || (pathParts[1] === "dashboards" && !isPathAdmin && !isPathInstructor && !pathname?.includes("/parent"));
  const isPathParent = dashboardType === "parent" || pathname?.includes("/dashboards/parent");
  let isPathCorporate = dashboardType === "coorporate" && dashboardSubType !== "employee";
  
  // Initialize with appropriate sidebar based on detected user role
  const activeSidebar = isPathAdmin ? adminSidebar : 
                        isPathInstructor ? instructorSidebar : 
                        isPathCorporate ? corporateSidebar : 
                        isPathParent ? parentSidebar :
                        studentSidebar;
  
  // Initialize component on mount
  useEffect(() => {
    // Client-side guard
    if (typeof window === 'undefined') return;
    
    // Check if device is mobile
    const checkMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobileDevice(window.innerWidth < 1024);
      }
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    // Get user data from localStorage or token
    const initializeUserData = () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const isLoggedIn = !!token && !!userId;
        
        // Get user name
        let fullName = localStorage.getItem("fullName") || localStorage.getItem("full_name") || "";
        let userRole = localStorage.getItem("role") || "";
        let userEmail = localStorage.getItem("email") || "";
        
        // If no name in storage but token exists, try to extract from token
        if (!fullName && token) {
          try {
            const decoded = jwtDecode<any>(token);
            
            if (decoded.user?.full_name) {
              fullName = decoded.user.full_name;
            } else if (decoded.user?.name) {
              fullName = decoded.user.name;
            } else if (decoded.name) {
              fullName = decoded.name;
            } else if (decoded.user?.email) {
              fullName = decoded.user.email.split('@')[0]; // Use part before @ as name
              userEmail = decoded.user.email;
            }
            
            // Store for future use if found
            if (fullName) {
              localStorage.setItem("fullName", fullName);
            }
            
            // Extract role if available
            if (decoded.user?.role && !userRole) {
              userRole = decoded.user.role;
              localStorage.setItem("role", userRole);
            }
          } catch (tokenError) {
            console.error("Error decoding token:", tokenError);
          }
        }
        
        // Generate a placeholder based on role if name still not available
        if (!fullName && userRole) {
          const role = userRole.toLowerCase();
          fullName = role === "admin" ? 
            "Administrator" : 
            role.charAt(0).toUpperCase() + role.slice(1);
        }
        
        setUserInfo({
          isLoggedIn,
          fullName: fullName || "User",
          userRole,
          userEmail,
          userImage: "" // Could be loaded from profile if available
        });
      } catch (error) {
        console.error("Error accessing user data:", error);
        setUserInfo({
          isLoggedIn: false,
          fullName: "User",
          userRole: "",
          userEmail: "",
          userImage: ""
        });
      }
    };
    
    initializeUserData();
    
    // Initialize active menu from URL hash if present
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const decodedHash = decodeURIComponent(hash);
        setActiveMenu(decodedHash);
      }
      
      // Listen for hash changes
      const handleHashChange = () => {
        const newHash = window.location.hash.replace("#", "");
        if (newHash) {
          const decodedNewHash = decodeURIComponent(newHash);
          setActiveMenu(decodedNewHash);
        } else {
          setActiveMenu(null);
        }
      };
      
      window.addEventListener("hashchange", handleHashChange);
      
      return () => {
        window.removeEventListener("resize", checkMobile);
        window.removeEventListener("hashchange", handleHashChange);
      };
    }
    
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);
  
  // Handle menu clicks
  const handleMenuClick = (menuName: string, items?: SubItem[]) => {
    // If clicking the same menu that's already active, toggle it closed
    if (activeMenu === menuName) {
      setActiveMenu(null);
      // Remove hash from URL
      if (typeof window !== "undefined") {
        window.history.pushState(null, "", window.location.pathname + window.location.search);
      }
    } else {
      setActiveMenu(menuName);
      // Set hash in URL for direct access
      if (typeof window !== "undefined") {
        window.location.hash = encodeURIComponent(menuName);
      }
    }
    
    // Close mobile menu after selection on mobile
    if (isMobileDevice) {
      setMobileMenuOpen(false);
    }
  };
  
  // Handle submenu clicks
  const handleSubMenuClick = (subItem: SubItem) => {
    if (subItem.comingSoon) {
      // If the feature is coming soon, navigate to coming soon page with title and return path
      const returnPath = userInfo.userRole === "admin" 
        ? "/dashboards/admin" 
        : userInfo.userRole === "instructor" 
        ? "/dashboards/instructor/" 
        : "/dashboards/student";
      
      router.push(`/coming-soon?title=${encodeURIComponent(subItem.name)}&returnPath=${returnPath}`);
      return;
    }
    
    // If item has an onClick handler, use that
    if (subItem.onClick) {
      subItem.onClick();
      return;
    }
    
    // Otherwise navigate to the actual path
    if (subItem.path) {
      router.push(subItem.path);
      
      // Close mobile menu after navigation on mobile devices
      if (isMobileDevice) {
        setMobileMenuOpen(false);
      }
    }
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
      
      // Update user info state
      setUserInfo({
        isLoggedIn: false,
        fullName: "User",
        userRole: "",
        userEmail: "",
        userImage: ""
      });
      
      // Close menus
      setMobileMenuOpen(false);
      setSidebarOpen(false);
      
      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      // If error, still try to redirect
      router.push("/login");
    }
  };
  
  // Helper function to find the menu name that corresponds to a view
  const findMenuMatchingView = (view: string): string | null => {
    // Convert view to lowercase for case-insensitive matching
    const normalizedView = view.toLowerCase();
    
    // Check for dashboard views
    if (normalizedView.includes('overview') || normalizedView.includes('dashboard')) {
      return 'Dashboard';
    }
    
    // Check for course management related views
    if (normalizedView.includes('course-categories') || 
        normalizedView.includes('add-course') || 
        normalizedView.includes('edit-courses') || 
        normalizedView.includes('course-detail')) {
      return 'Course Setup';
    }
    
    // Check for instructor management views
    if (normalizedView.includes('instructor')) {
      return 'Instructor Management';
    }
    
    // Check for student management views
    if (normalizedView.includes('student')) {
      return 'Student Management';
    }
    
    // Check for blog management
    if (normalizedView.includes('blog')) {
      return 'Blogs Management';
    }
    
    // Check for certificate management
    if (normalizedView.includes('certificate')) {
      return 'Certificate Management';
    }
    
    // Check for reports and analytics
    if (normalizedView.includes('analytics') || normalizedView.includes('report')) {
      return 'Reports & Analytics';
    }
    
    // Check for feedback and complaints
    if (normalizedView.includes('feedback') || normalizedView.includes('complaint')) {
      return 'Feedback & Grievances';
    }
    
    // Check for corporate management
    if (normalizedView.includes('corporate') || normalizedView.includes('placement')) {
      return 'Corporate Management';
    }

    return null;
  };
  
  const value = {
    // State
    activeMenu,
    openSubMenu,
    isMobileDevice,
    isSidebarOpen,
    isMobileMenuOpen,
    searchTerm,
    userInfo,
    
    // Path indicators
    isPathAdmin,
    isPathInstructor,
    isPathStudent,
    isPathParent,
    isPathCorporate,
    
    // Sidebar data
    activeSidebar,
    
    // Actions
    setActiveMenu,
    setOpenSubMenu,
    setSidebarOpen,
    setMobileMenuOpen,
    setSearchTerm,
    handleMenuClick,
    handleSubMenuClick,
    handleLogout,
    findMenuMatchingView
  };
  
  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

// Hook for using the navigation context
export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  
  return context;
}; 