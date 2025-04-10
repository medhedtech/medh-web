"use client";

import React from 'react';
import { motion } from "framer-motion";
import SidebarMenuItem from './SidebarMenuItem';

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

interface SectionProps {
  title?: string;
  items: MenuItem[];
  activeMenu: string | null;
  isMobileDevice: boolean;
  onMenuClick: (menuName: string, items: SubItem[]) => void;
  renderMobileSubitems: (item: MenuItem) => React.ReactNode;
}

const SidebarSection: React.FC<SectionProps> = ({
  title,
  items,
  activeMenu,
  isMobileDevice,
  onMenuClick,
  renderMobileSubitems
}) => {
  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };
  
  const titleVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };
  
  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      className="mb-6"
    >
      {title && (
        <motion.h3 
          className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
          variants={titleVariants}
        >
          {title}
        </motion.h3>
      )}
      
      <ul className="space-y-1">
        {items.map((item, itemIndex) => (
          <SidebarMenuItem
            key={itemIndex}
            item={item}
            isActive={activeMenu === item.name}
            isMobileDevice={isMobileDevice}
            onItemClick={onMenuClick}
            renderMobileSubitems={renderMobileSubitems}
          />
        ))}
      </ul>
    </motion.div>
  );
};

export default SidebarSection; 