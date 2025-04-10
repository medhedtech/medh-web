"use client";

import React from 'react';
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface SubItem {
  name: string;
  path?: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
  onClick?: () => void;
}

interface SubMenuProps {
  item: {
    name: string;
    subItems?: SubItem[];
  };
  onSubItemClick: (item: string, subItems: SubItem[]) => void;
}

const SidebarSubMenuItem: React.FC<SubMenuProps> = ({ 
  item, 
  onSubItemClick 
}) => {
  const router = useRouter();
  
  // Don't render if no subitems
  if (!item.subItems || item.subItems.length === 0) return null;
  
  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: "auto", 
      transition: { 
        duration: 0.3,
        staggerChildren: 0.05
      } 
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: { duration: 0.2 }
    }
  };
  
  // Animation variants for items
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
    hover: { 
      x: 5, 
      backgroundColor: "rgba(59, 130, 246, 0.05)",
      transition: { duration: 0.2 }
    }
  };
  
  const handleSubItemClick = (subItem: SubItem) => {
    if (subItem.comingSoon) {
      // If the feature is coming soon, navigate to coming soon page
      router.push(`/coming-soon?title=${encodeURIComponent(subItem.name)}&returnPath=/dashboards/student`);
      return;
    }
    
    // If item has an onClick handler, use that
    if (subItem.onClick) {
      subItem.onClick();
      return;
    }
    
    // Otherwise navigate to the actual path
    if (subItem.path) {
      // Set the hash in the URL
      if (typeof window !== "undefined") {
        // Keep the parent menu in the hash
        window.location.hash = encodeURIComponent(item.name);
      }
      router.push(subItem.path);
    }
    
    // Also pass to parent
    onSubItemClick(item.name, item.subItems || []);
  };
  
  return (
    <motion.div 
      className="mt-2 ml-6 pb-2 space-y-1"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {item.subItems.slice(0, 3).map((subItem, idx) => (
        <motion.button
          key={idx}
          onClick={() => handleSubItemClick(subItem)}
          className={`flex items-center w-full text-left pl-4 pr-2 py-1.5 text-xs rounded-md ${
            subItem.comingSoon 
              ? "text-gray-400 cursor-not-allowed" 
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
          variants={itemVariants}
          whileHover="hover"
          whileTap={{ scale: 0.98 }}
          disabled={subItem.comingSoon}
        >
          <span className="w-3.5 h-3.5 mr-1.5 text-primary-500">{subItem.icon}</span>
          <span className="truncate">{subItem.name}</span>
          {subItem.comingSoon && (
            <span className="ml-1 px-1 text-[10px] rounded-full bg-gray-100 dark:bg-gray-700">
              Soon
            </span>
          )}
        </motion.button>
      ))}
      
      {item.subItems.length > 3 && (
        <motion.button
          onClick={() => onSubItemClick(item.name, item.subItems || [])}
          className="ml-4 flex items-center w-full text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline"
          variants={itemVariants}
          whileHover={{ x: 3 }}
        >
          <span>View all {item.subItems.length} options</span>
          <ChevronRight className="w-3 h-3 ml-0.5" />
        </motion.button>
      )}
    </motion.div>
  );
};

export default SidebarSubMenuItem; 