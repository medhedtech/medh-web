"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

// Define the types for our sidebar items
interface SubItem {
  name: string;
  path?: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
  onClick?: () => void;
}

interface MenuItem {
  name: string;
  path?: string;
  icon: React.ReactNode;
  onClick?: () => void;
  subItems?: SubItem[];
  comingSoon?: boolean;
}

interface ItemSection {
  title?: string;
  items: MenuItem[];
}

// Define the context type
interface SidebarContextType {
  activeMenu: string | null;
  setActiveMenu: (menu: string | null) => void;
  openSubMenu: string | null;
  setOpenSubMenu: (menu: string | null) => void;
  isMobileDevice: boolean;
  findMenuMatchingView: (view: string) => string | null;
  handleMenuClick: (menuName: string) => void;
  handleSubMenuClick: (subItem: SubItem) => void;
  activeSidebar: ItemSection[];
  isPathAdmin: boolean;
  isPathInstructor: boolean;
  isPathCorporate: boolean;
  isPathCorporateEmp: boolean;
  isPathParent: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

// Create the context
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Provider component
interface SidebarProviderProps {
  children: ReactNode;
  onMenuClick: (menuName: string, items: SubItem[]) => void;
  studentSidebar: ItemSection[];
  parentSidebar: ItemSection[];
  adminSidebar: ItemSection[];
  userRole: string;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
  onMenuClick,
  studentSidebar,
  parentSidebar,
  adminSidebar,
  userRole
}) => {
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  
  // Parse path to determine user type
  const pathParts = pathname?.split("/") || [];
  const dashboardType = pathParts[2]?.split("-")[0] || '';
  const dashboardSubType = pathParts[2]?.split("-")[1] || '';
  
  const isPathAdmin = dashboardType === "admin";
  const isPathInstructor = dashboardType === "instructor";
  let isPathCorporate = dashboardType === "coorporate";
  const isPathCorporateEmp = dashboardType === "coorporate" && dashboardSubType === "employee";
  const isPathParent = userRole === "parent" || pathname?.includes("/dashboards/parent");

  if (isPathCorporateEmp) {
    isPathCorporate = false;
  }
  
  // Choose the appropriate sidebar based on role
  const activeSidebar = isPathAdmin ? adminSidebar : 
                        isPathInstructor ? [] : 
                        isPathCorporate ? [] : 
                        isPathCorporateEmp ? [] :
                        isPathParent ? parentSidebar :
                        studentSidebar;
  
  // Check if device is mobile
  useEffect(() => {
    // Client-side guard
    if (typeof window === 'undefined') return;
    
    // Check if device is mobile
    const checkMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobileDevice(window.innerWidth < 768);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Initialize active menu from URL hash if present
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const decodedHash = decodeURIComponent(hash);
        setActiveMenu(decodedHash);
      }
      
      // Listen for hash changes
      const handleHashChange = () => {
        const newHash = window.location.hash.replace('#', '');
        if (newHash) {
          const decodedNewHash = decodeURIComponent(newHash);
          setActiveMenu(decodedNewHash);
        } else {
          setActiveMenu(null);
        }
      };
      
      window.addEventListener('hashchange', handleHashChange);
      
      return () => {
        window.removeEventListener('resize', checkMobile);
        window.removeEventListener('hashchange', handleHashChange);
      };
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
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
  
  // Handle menu clicks
  const handleMenuClick = (menuName: string) => {
    if (activeMenu === menuName) {
      setActiveMenu(null);
      if (typeof window !== 'undefined') {
        // Remove hash from URL when menu is closed
        history.pushState('', document.title, window.location.pathname + window.location.search);
      }
    } else {
      setActiveMenu(menuName);
      if (typeof window !== 'undefined') {
        // Update URL hash when menu is opened
        window.location.hash = menuName;
      }
    }
    
    // Close mobile menu after selection
    if (isMobileDevice) {
      setSidebarOpen(false);
    }
  };
  
  // Handle submenu clicks
  const handleSubMenuClick = (subItem: SubItem) => {
    // To be implemented in the main component
  };
  
  const value = {
    activeMenu,
    setActiveMenu,
    openSubMenu,
    setOpenSubMenu,
    isMobileDevice,
    findMenuMatchingView,
    handleMenuClick,
    handleSubMenuClick,
    activeSidebar,
    isPathAdmin,
    isPathInstructor,
    isPathCorporate,
    isPathCorporateEmp,
    isPathParent,
    sidebarOpen,
    setSidebarOpen
  };
  
  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};

// Hook for using the sidebar context
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export default SidebarContext; 