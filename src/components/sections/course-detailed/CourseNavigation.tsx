'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Blocks, 
  Star, 
  Award,
  Download,
  Video,
  LucideIcon
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { brochureAPI } from '@/apis/broucher';

// TypeScript interfaces
interface Section {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface CourseNavigationProps {
  activeSection?: string;
  scrollToSection: (sectionId: string) => void;
  showCertificate?: boolean;
  compact?: boolean;
  showDownloadBrochure?: boolean;
  onDownloadBrochure?: () => void;
  courseId?: string; // Add courseId prop for direct API calls
  courseTitle?: string; // Add courseTitle prop for user feedback
  showBookDemo?: boolean; // Add prop to control Book Demo button visibility
}

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 8 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const buttonVariants = {
  hover: { 
    scale: 1.02,
    transition: { duration: 0.2 }
  },
  tap: { 
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

// Navigation sections
const SECTIONS: Section[] = [
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

const CourseNavigation: React.FC<CourseNavigationProps> = ({ 
  activeSection = '',
  scrollToSection, 
  showCertificate = true,
  compact = false,
  showDownloadBrochure = false,
  onDownloadBrochure,
  courseId,
  courseTitle,
  showBookDemo = false
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  // Filter sections based on whether to show certificate
  const visibleSections = SECTIONS.filter(section => 
    !(section.id === 'certificate' && !showCertificate)
  );

  // Handle brochure download with API integration
  const handleBrochureDownload = async () => {
    // If onDownloadBrochure callback is provided, use it (for modal-based flow)
    if (onDownloadBrochure) {
      onDownloadBrochure();
      return;
    }

    // Otherwise, handle direct API call
    if (!courseId) {
      toast.error('Course ID is required for brochure download');
      return;
    }

    setIsDownloading(true);
    
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        // For authenticated users, try direct download
        const response = await brochureAPI.downloadBrochure(courseId);
        
        if (response.downloadUrl) {
          // Open the download URL in a new tab
          window.open(response.downloadUrl, '_blank');
          toast.success('Brochure download started!');
        } else {
          toast.error('Unable to download brochure. Please try again.');
        }
      } else {
        // For non-authenticated users, show login prompt or use modal
        toast.error('Please login to download the brochure');
        // You could also trigger a login modal here
      }
    } catch (error: any) {
      console.error('Brochure download error:', error);
      
      if (error.response?.status === 404) {
        toast.error('Brochure not found for this course');
      } else if (error.response?.status === 401) {
        toast.error('Please login to download the brochure');
      } else {
        toast.error('Failed to download brochure. Please try again.');
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div 
      className={`
        bg-white dark:bg-gray-800 
        rounded-xl
        ${compact ? 'p-3' : 'p-4 sm:p-6'} 
        shadow-lg shadow-gray-100 dark:shadow-gray-900/20
        border border-gray-200 dark:border-gray-700
        mx-0 sm:mx-2
        sticky top-20 z-30
        backdrop-blur-sm
      `}
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      {/* Enhanced navigation with better spacing */}
      <div className={`
        flex flex-wrap justify-center
        ${compact ? 'gap-2' : 'gap-3 sm:gap-4'}
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
                ${compact 
                  ? 'px-4 py-2.5 min-w-[90px]' 
                  : 'px-5 py-3 sm:px-6 sm:py-3.5 min-w-[110px] sm:min-w-[130px]'
                }
                rounded-lg
                text-sm sm:text-base font-semibold
                transition-all duration-200
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 ring-2 ring-blue-500/20' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:shadow-md'
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                transform hover:scale-105 active:scale-95
              `}
              aria-label={`View ${section.label} section`}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {/* Icon with better spacing */}
              <Icon 
                className={`
                  ${compact ? 'h-4 w-4' : 'h-5 w-5 sm:h-5 sm:w-5'} 
                  ${compact ? 'mr-1.5' : 'mr-2 sm:mr-2.5'}
                  transition-all duration-200
                  ${isActive ? 'text-white' : ''}
                `} 
                strokeWidth={isActive ? 2 : 1.5}
              />
              
              {/* Text label with better typography */}
              <span className={`
                text-sm sm:text-base
                font-semibold
                transition-all duration-200
                ${isActive ? 'text-white' : ''}
              `}>
                {section.label}
              </span>
            </motion.button>
          );
        })}
        
        {/* Book a Free Demo Button */}
        {showBookDemo && (
          <motion.button
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.open('/book-demo', '_blank');
            }
          }}
          className={`
            flex items-center justify-center
            ${compact 
              ? 'px-4 py-2.5 min-w-[120px]' 
              : 'px-5 py-3 sm:px-6 sm:py-3.5 min-w-[140px] sm:min-w-[160px]'
            }
            rounded-lg
            text-sm sm:text-base font-semibold
            transition-all duration-200
            bg-[#3bac63] hover:bg-[#339955]
            text-white
            shadow-lg shadow-[#3bac63]/25
            hover:shadow-xl hover:shadow-[#3bac63]/30
            focus:outline-none focus:ring-2 focus:ring-[#3bac63] focus:ring-offset-2
            transform hover:scale-105 active:scale-95
          `}
          aria-label="Book a free demo session"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Video 
            className={`
              ${compact ? 'h-4 w-4' : 'h-5 w-5 sm:h-5 sm:w-5'} 
              ${compact ? 'mr-1.5' : 'mr-2 sm:mr-2.5'}
              text-white
            `} 
            strokeWidth={2}
          />
          
          <span className="text-sm sm:text-base font-semibold text-white">
            Book Demo
          </span>
        </motion.button>
        )}
        
        {/* Enhanced Download Brochure Button */}
        {showDownloadBrochure && (
          <motion.button
            onClick={handleBrochureDownload}
            disabled={isDownloading}
            className={`
              flex items-center justify-center
              ${compact 
                ? 'px-4 py-2.5 min-w-[100px]' 
                : 'px-5 py-3 sm:px-6 sm:py-3.5 min-w-[120px] sm:min-w-[140px]'
              }
              rounded-lg
              text-sm sm:text-base font-semibold
              transition-all duration-200
              ${isDownloading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700'
              }
              text-white
              shadow-lg shadow-emerald-500/25
              hover:shadow-xl hover:shadow-emerald-500/30
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
              transform hover:scale-105 active:scale-95
              disabled:transform-none disabled:shadow-lg
            `}
            aria-label="Download course brochure"
            variants={buttonVariants}
            whileHover={isDownloading ? {} : "hover"}
            whileTap={isDownloading ? {} : "tap"}
          >
            {isDownloading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                <span className="text-sm sm:text-base font-semibold text-white">
                  Loading...
                </span>
              </>
            ) : (
              <>
                <Download 
                  className={`
                    ${compact ? 'h-4 w-4' : 'h-5 w-5 sm:h-5 sm:w-5'} 
                    ${compact ? 'mr-1.5' : 'mr-2 sm:mr-2.5'}
                    text-white
                  `} 
                  strokeWidth={2}
                />
                
                <span className="text-sm sm:text-base font-semibold text-white">
                  Brochure
                </span>
              </>
            )}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default CourseNavigation; 