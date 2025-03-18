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

const SECTIONS = [
  { id: 'about', label: 'About Program', icon: GraduationCap, mobileLabel: 'About' },
  { id: 'curriculum', label: 'Curriculum', icon: Blocks, mobileLabel: 'Content' },
  { id: 'reviews', label: 'Reviews', icon: Star, mobileLabel: 'Reviews' },
  { id: 'faq', label: 'FAQ', icon: HelpCircle, mobileLabel: 'FAQ' },
  { id: 'certificate', label: 'Certificate', icon: FileBadge, mobileLabel: 'Certificate' }
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
    `bg-${categoryColorClasses.primaryColor}-50 dark:bg-${categoryColorClasses.primaryColor}-900/20` : 
    activeBgClass;
    
  // Icon color for active state
  const activeIconColor = categoryColorClasses ? 
    `text-${categoryColorClasses.primaryColor}-500` : 
    `text-${primaryColor}-500`;

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl p-2 md:p-3 shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-hide"
      initial="initial"
      animate="animate"
      variants={fadeIn}
    >
      <div className="flex space-x-1 sm:space-x-2 justify-between">
        {SECTIONS.map((section) => {
          if (section.id === 'certificate' && !showCertificate) {
            return null;
          }
          
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          // Choose which label to display based on screen size
          const displayLabel = isMobile ? (
            <>
              {/* Only show icon on small screens */}
              <Icon className={`h-5 w-5 sm:h-4 sm:w-4 sm:mr-2 ${isActive ? activeIconColor : 'text-gray-500 dark:text-gray-400'}`} />
              {/* Hide label on small screens, show on larger */}
              <span className="hidden sm:inline">{section.label}</span>
              {/* Show mobile-friendly label on small screens if we want tabs with labels */}
              {/* <span className="sm:hidden">{section.mobileLabel}</span> */}
            </>
          ) : (
            <>
              <Icon className={`h-4 w-4 mr-2 ${isActive ? activeIconColor : 'text-gray-500 dark:text-gray-400'}`} />
              <span>{section.label}</span>
            </>
          );
          
          return (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`flex items-center justify-center py-2 px-3 sm:px-4 rounded-lg text-sm font-medium transition-all ${
                isActive 
                  ? `${activeBgColor} ${activeTextColor}`
                  : 'hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300'
              }`}
              aria-label={`View ${section.label} section`}
              title={section.label}
            >
              {displayLabel}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CourseNavigation; 