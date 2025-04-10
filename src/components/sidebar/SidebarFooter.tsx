"use client";

import React from 'react';
import { motion } from "framer-motion";

interface MenuItem {
  name: string;
  path?: string;
  icon: React.ReactNode;
  onClick?: () => void;
  subItems?: any[];
  comingSoon?: boolean;
}

interface SidebarFooterProps {
  actionItems: MenuItem[];
  isMobileDevice: boolean;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ 
  actionItems,
  isMobileDevice 
}) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    hover: { 
      backgroundColor: "rgba(239, 68, 68, 0.1)",
      color: "#EF4444",
      x: 3,
      transition: { duration: 0.2 }
    }
  };
  
  const versionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 0.5, duration: 0.5 } }
  };
  
  return (
    <motion.div 
      className="p-4 border-t dark:border-gray-700"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <ul className="space-y-1">
        {actionItems.map((item, index) => (
          <motion.li key={index} variants={itemVariants}>
            <motion.button
              onClick={item.onClick}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-red-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-red-400 transition-colors"
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
              aria-label={item.name}
            >
              <span className="text-gray-500 dark:text-gray-400">{item.icon}</span>
              <span>{item.name}</span>
            </motion.button>
          </motion.li>
        ))}
      </ul>
      
      {/* Version info - only on desktop */}
      {!isMobileDevice && (
        <motion.div 
          className="mt-6 pt-2 text-center text-xs text-gray-400 dark:text-gray-600"
          variants={versionVariants}
        >
          <motion.p 
            whileHover={{ color: "#6366F1", transition: { duration: 0.2 } }}
          >
            Medh v1.0
          </motion.p>
          <motion.p 
            className="mt-1"
            whileHover={{ color: "#6366F1", transition: { duration: 0.2 } }}
          >
            © 2025 Medh Education
          </motion.p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SidebarFooter; 