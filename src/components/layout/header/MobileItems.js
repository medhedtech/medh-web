"use client";
import React, { useMemo } from "react";
import AccordionContainer from "@/components/shared/containers/AccordionContainer";
import MobileMenuItem from "./MobileItem";
import { usePathname } from "next/navigation";
import AccordionCourses from "./AccordionCourses";
import AccordionHome from "./AccordionHome";
import AccordionMore from "./AccordionMore";

/**
 * MobileMenuItems Component
 * 
 * Provides navigation items for the mobile menu, exactly matching the desktop navigation structure.
 * Features:
 * - Same navigation structure as desktop menu (NavItems.js)
 * - Active state detection based on current path
 * - Optimized rendering with useMemo
 * - Consistent user experience across devices
 */
const MobileMenuItems = () => {
  const pathname = usePathname();
  
  // Memoize the navigation items to prevent unnecessary re-renders
  // These items exactly match the desktop navigation in NavItems.js
  const items = useMemo(() => [
    {
      id: 1,
      name: "Courses",
      path: "/courses", // Note: In NavItems.js this is empty, but mobile needs a path for the accordion
      accordion: "accordion",
      children: <AccordionCourses />,
      isRelative: false,
    },
    {
      id: 2,
      name: "Store",
      path: "/shop",
      accordion: null,
      isRelative: false,
    },
    {
      id: 3,
      name: "Corporate Training",
      path: "/corporate-training-courses",
      accordion: null, // No dropdown for direct links
      isRelative: false,
    },
    {
      id: 4,
      name: "Hire From Medh",
      path: "/hire-from-medh",
      accordion: null,
      isRelative: true,
    },
    {
      id: 5,
      name: "Blog",
      path: "/blogs",
      accordion: null,
      isRelative: true,
    },
    {
      id: 6,
      name: "More",
      path: "", // Empty path as in desktop
      accordion: "accordion",
      children: <AccordionMore />,
      isRelative: true,
    }
  ], []);

  return (
    <div className="space-y-1">
      <div className="flex flex-col">
        <AccordionContainer>
          {items.map((item, idx) => (
            <div 
              key={idx} 
              className={`py-2 ${pathname === item.path ? 'border-l-2 border-primary-500 pl-3 -ml-4' : ''}`}
            >
              <MobileMenuItem 
                key={idx} 
                item={{
                  ...item,
                  // Add active state tracking for styling
                  isActive: pathname === item.path || 
                           (pathname?.startsWith(item.path) && item.path !== '')
                }} 
              />
            </div>
          ))}
        </AccordionContainer>
      </div>
    </div>
  );
};

export default MobileMenuItems;
