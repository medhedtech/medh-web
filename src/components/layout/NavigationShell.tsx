"use client";

import React, { useState, useEffect } from 'react';
import { 
  NavigationProvider, 
  type ItemSection, 
  type SubItem 
} from '@/components/shared/navigation/NavigationProvider';
import dynamic from 'next/dynamic';
import { Menu, X } from 'lucide-react';

// Dynamically import components to reduce initial load size
const SidebarDashboard = dynamic(() => import('@/components/sections/sub-section/dashboards/SidebarDashboard'), {
  ssr: false,
  loading: () => <div className="w-64 h-screen bg-white dark:bg-gray-800 animate-pulse" />
});

const MobileMenu = dynamic(() => import('@/components/MobileMenu'), {
  ssr: false,
  loading: () => null
});

// Import sidebar data
import { 
  studentSidebar, 
  instructorSidebar, 
  parentSidebar, 
  adminSidebar,
  corporateSidebar
} from '@/constants/navigation-data';

interface NavigationShellProps {
  children: React.ReactNode;
}

const NavigationShell: React.FC<NavigationShellProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenuContent, setActiveMenuContent] = useState<{
    name: string;
    items: SubItem[];
  } | null>(null);
  
  // Initialize component on client-side
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Handle main menu clicks
  const handleMenuClick = (menuName: string, items: SubItem[]) => {
    setActiveMenuContent({
      name: menuName,
      items: items
    });
  };
  
  if (!mounted) {
    return <>{children}</>; // Return children without navigation on server-side
  }
  
  return (
    <NavigationProvider
      studentSidebar={studentSidebar}
      instructorSidebar={instructorSidebar}
      parentSidebar={parentSidebar}
      adminSidebar={adminSidebar}
      corporateSidebar={corporateSidebar}
    >
      <div className="flex h-screen w-full bg-white dark:bg-gray-900">
        {/* Desktop sidebar (hidden on mobile) */}
        <div className="hidden lg:block lg:w-64 h-full flex-shrink-0">
          <SidebarDashboard
            userRole=""
            fullName=""
            userEmail=""
            userImage=""
            userNotifications={0}
            userSettings={{
              theme: "light",
              language: "en",
              notifications: true,
            }}
            onMenuClick={handleMenuClick}
          />
        </div>
        
        {/* Mobile menu toggle button (only visible on mobile) */}
        <button
          className="fixed top-4 left-4 z-50 lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md text-gray-700 dark:text-gray-200"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Mobile menu (only renders when open) */}
        <MobileMenu 
          isOpen={isMobileMenuOpen} 
          onClose={() => setMobileMenuOpen(false)} 
        />
        
        {/* Main content */}
        <div className="flex-1 overflow-auto">
          {/* Main content scrollable area */}
          <main className="relative min-h-screen">
            {children}
          </main>
        </div>
      </div>
    </NavigationProvider>
  );
};

export default NavigationShell; 