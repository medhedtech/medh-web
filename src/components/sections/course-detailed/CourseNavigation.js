'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Blocks, 
  Star, 
  Award,
  Download
} from 'lucide-react';

// Minimal animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 8 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
};

// Simple button animation
const buttonVariants = {
  hover: { 
    scale: 1.01,
    transition: { duration: 0.15 }
  },
  tap: { 
    scale: 0.99,
    transition: { duration: 0.1 }
  }
};

// Minimal sections
const SECTIONS = [
  { 
    id: 'about', 
    label: 'About', 
    icon: GraduationCap
  },
  {
    id: 'benefits',
    label: 'Benefits',
    icon: Star
  },
  { 
    id: 'curriculum', 
    label: 'Curriculum', 
    icon: Blocks
  },
  { 
    id: 'certificate', 
    label: 'Certificate', 
    icon: Award
  }
];

const CourseNavigation = ({ 
  activeSection, 
  scrollToSection, 
  showCertificate = true,
  compact = false,
  showDownloadBrochure = false,
  onDownloadBrochure
}) => {
  // Filter sections based on whether to show certificate
  const visibleSections = SECTIONS.filter(section => 
    !(section.id === 'certificate' && !showCertificate)
  );

  return (
    <motion.div 
      className={`
        bg-white dark:bg-gray-800 
        rounded-lg
        ${compact ? 'p-2' : 'p-3 sm:p-4'} 
        shadow-sm
        border border-gray-200 dark:border-gray-700
        mx-0 sm:mx-2
        sticky top-20 z-30
      `}
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      {/* Minimal horizontal navigation */}
      <div className={`
        flex flex-wrap justify-center
        gap-1 sm:gap-2
        w-full
      `}>
        {visibleSections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <motion.button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`
                flex items-center justify-center
                ${compact ? 'px-2 py-1.5' : 'px-3 py-2 sm:px-4 sm:py-2.5'}
                rounded-md
                text-sm font-medium
                transition-all duration-150
                ${isActive 
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }
                focus:outline-none focus:ring-1 focus:ring-blue-500
              `}
              aria-label={`View ${section.label} section`}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {/* Icon on the left */}
              <Icon 
                className={`
                  ${compact ? 'h-4 w-4' : 'h-4 w-4 sm:h-5 sm:w-5'} 
                  mr-1.5 sm:mr-2
                  transition-colors duration-150
                `} 
                strokeWidth={1.5}
              />
              
              {/* Text label */}
              <span className={`
                text-xs sm:text-sm
                font-medium
                transition-colors duration-150
              `}>
                {section.label}
              </span>
            </motion.button>
          );
        })}
        
        {/* Minimal Download Brochure Button */}
        {showDownloadBrochure && onDownloadBrochure && (
          <motion.button
            onClick={onDownloadBrochure}
            className={`
              flex items-center justify-center
              ${compact ? 'px-2 py-1.5' : 'px-3 py-2 sm:px-4 sm:py-2.5'}
              rounded-md
              text-sm font-medium
              transition-all duration-150
              bg-blue-600 hover:bg-blue-700
              text-white
              focus:outline-none focus:ring-1 focus:ring-blue-500
            `}
            aria-label="Download course brochure"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Download 
              className={`
                ${compact ? 'h-4 w-4' : 'h-4 w-4 sm:h-5 sm:w-5'} 
                mr-1.5 sm:mr-2
              `} 
              strokeWidth={1.5}
            />
            
            <span className="text-xs sm:text-sm font-medium">
              Brochure
            </span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default CourseNavigation; 