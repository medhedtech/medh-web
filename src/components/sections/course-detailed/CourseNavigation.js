'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Blocks, 
  Star, 
  HelpCircle, 
  FileBadge 
} from 'lucide-react';

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
  }
};

// Button animation variants
const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } },
};

// Indicator animation variants
const indicatorVariants = {
  initial: { opacity: 0, width: 0 },
  active: { 
    opacity: 1, 
    width: '70%', 
    transition: { duration: 0.3, ease: "easeInOut" }
  }
};

// Define unique colors for each section
const SECTIONS = [
  { 
    id: 'about', 
    label: 'About Program', 
    icon: GraduationCap, 
    mobileLabel: 'About',
    color: 'emerald',
    lightColor: 'text-emerald-500 dark:text-emerald-400',
    indicatorColor: 'bg-emerald-500 dark:bg-emerald-400'
  },
  { 
    id: 'curriculum', 
    label: 'Curriculum', 
    icon: Blocks, 
    mobileLabel: 'Content',
    color: 'blue',
    lightColor: 'text-blue-500 dark:text-blue-400',
    indicatorColor: 'bg-blue-500 dark:bg-blue-400'
  },
  { 
    id: 'reviews', 
    label: 'Reviews', 
    icon: Star, 
    mobileLabel: 'Reviews',
    color: 'amber',
    lightColor: 'text-amber-500 dark:text-amber-400',
    indicatorColor: 'bg-amber-500 dark:bg-amber-400'
  },
  { 
    id: 'faq', 
    label: 'FAQ', 
    icon: HelpCircle, 
    mobileLabel: 'FAQ',
    color: 'violet',
    lightColor: 'text-violet-500 dark:text-violet-400',
    indicatorColor: 'bg-violet-500 dark:bg-violet-400'
  },
  { 
    id: 'certificate', 
    label: 'Certificate', 
    icon: FileBadge, 
    mobileLabel: 'Certificate',
    color: 'rose',
    lightColor: 'text-rose-500 dark:text-rose-400',
    indicatorColor: 'bg-rose-500 dark:bg-rose-400'
  }
];

const CourseNavigation = ({ 
  activeSection, 
  scrollToSection, 
  showCertificate = true,
  primaryColor = 'primary',
  colorClass,
  bgClass,
  isMobile = false,
  categoryColorClasses
}) => {
  // Use the provided category color classes or fall back to prop-based styling
  const activeColorClass = colorClass || `text-${primaryColor}-600 dark:text-${primaryColor}-400`;
  const activeBgClass = bgClass || `bg-${primaryColor}-50 dark:bg-${primaryColor}-900/20`;
  
  // If categoryColorClasses is provided, use those instead
  const activeTextColor = categoryColorClasses ? 
    `text-${categoryColorClasses.primaryColor}-600 dark:text-${categoryColorClasses.primaryColor}-400` : 
    activeColorClass;
    
  const activeBgColor = categoryColorClasses ? 
    `bg-${categoryColorClasses.primaryColor}-50/50 dark:bg-${categoryColorClasses.primaryColor}-900/30` : 
    activeBgClass;
    
  // Icon color for active state - fallback only
  const activeIconColor = categoryColorClasses ? 
    `text-${categoryColorClasses.primaryColor}-500` : 
    `text-${primaryColor}-500`;

  // Filter sections based on whether to show certificate
  const visibleSections = SECTIONS.filter(section => 
    !(section.id === 'certificate' && !showCertificate)
  );

  // Helper to get section-specific background color
  const getSectionBgColor = (section) => {
    return `bg-${section.color}-50/50 dark:bg-${section.color}-900/30`;
  };

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl p-2 sm:p-2.5 md:p-3 shadow-sm border border-gray-200 dark:border-gray-700"
      initial="initial"
      animate="animate"
      variants={fadeIn}
    >
      <div className="grid grid-cols-5 sm:flex w-full sm:space-x-2">
        {visibleSections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <motion.button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`relative flex flex-col sm:flex-row items-center justify-center py-2.5 px-2 sm:px-3 md:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                isActive 
                  ? `${getSectionBgColor(section)} shadow-sm`
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300'
              }`}
              aria-label={`View ${section.label} section`}
              title={section.label}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              <div className={`relative ${isActive ? 'transform scale-110' : ''} transition-transform duration-200`}>
                <Icon 
                  className={`h-5 w-5 sm:h-4 sm:w-4 ${
                    isActive ? section.lightColor : 'text-gray-500 dark:text-gray-400'
                  } transition-colors duration-200`} 
                />
                
                {/* Subtle ping effect for active tab */}
                {isActive && (
                  <span className={`absolute -inset-0.5 rounded-full animate-ping opacity-20 ${section.lightColor}`}></span>
                )}
              </div>
              
              {/* Only show text on larger screens */}
              <span className={`hidden sm:inline-block sm:ml-2 transition-all duration-200 ${
                isActive ? section.lightColor : ''
              }`}>
                {section.label}
              </span>
              
              {/* Active indicator - visible on mobile */}
              {isActive && (
                <motion.div 
                  className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-1 rounded-full ${section.indicatorColor}`}
                  initial="initial"
                  animate="active"
                  variants={indicatorVariants}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CourseNavigation; 