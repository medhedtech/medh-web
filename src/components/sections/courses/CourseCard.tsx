"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DownloadBrochureModal from "@/components/shared/download-brochure";
import { 
  Clock, 
  Calendar, 
  Award, 
  BookOpen, 
  Download, 
  Users,
  Star,
  GraduationCap,
  Timer,
  Tag,
  Sparkles,
  ArrowUpRight,
  Info,
  CheckCircle,
  Target,
  Layers,
  Play,
  TrendingUp,
  Heart,
  Bookmark,
  BarChart,
  User,
  X,
  ChevronRight,
  ExternalLink,
  Briefcase
} from "lucide-react";
import { isFreePrice } from '@/utils/priceUtils';
import { optimizeCourseImage, preloadCriticalImage, getCourseCardSizes } from '@/utils/imageOptimization';
import OptimizedImage from '@/components/shared/OptimizedImage';
import { batchDOMOperations, throttleRAF } from '@/utils/performanceOptimization';

// Type definitions
interface CoursePrice {
  currency: string;
  individual: number;
  batch: number;
  early_bird_discount?: number;
}

interface Course {
  _id?: string;
  course_title?: string;
  course_description?: string;
  course_image?: string;
  course_grade?: string;
  course_category?: string;
  course_duration?: string | React.ReactElement;
  duration_range?: string;
  course_fee?: number;
  batchPrice?: number;
  original_fee?: number;
  fee_note?: string;
  no_of_Sessions?: number | string;
  session_range?: string;
  video_count?: number;
  class_type?: string;
  is_live_course?: boolean;
  is_blended_course?: boolean;
  isFree?: boolean;
  prices?: CoursePrice[];
  enrolled_students?: number;
  is_new?: boolean;
  enrollment_status?: string;
  progress?: number;
  schedule?: string;
  effort_hours?: number;
  url?: string;
  // Enhanced live course properties
  liveFeatures?: string[];
  additionalFeatures?: string[];
  isLiveCourse?: boolean;
  showFullFeatures?: boolean;
  useStandardImageRatio?: boolean;
  useStandardBadgeSize?: boolean;
  preserveLiveHoverState?: boolean;
  standardFeatures?: string[];
}                  

interface CourseCardProps {
  course?: Course;
  onShowRelated?: () => void;
  showRelatedButton?: boolean;
  variant?: string;
  classType?: string;
  viewMode?: string;
  isCompact?: boolean;
  coursesPageCompact?: boolean;
  preserveClassType?: boolean;
  showDuration?: boolean;
  hidePrice?: boolean;
  hideDescription?: boolean;
  index?: number;
  isLCP?: boolean;
}

interface ImageWrapperProps {
  src: string;
  alt: string;
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  priority?: boolean;
  isLCP?: boolean;
  index?: number;
}

interface ResponsiveTextOptions {
  xs: number;
  sm: number;
  md: number;
  lg: number;
}

// Text adaptation hook for responsive text - OPTIMIZED to prevent forced reflows
const useResponsiveText = (text: string | undefined, maxLength: ResponsiveTextOptions = {xs: 60, sm: 80, md: 120, lg: 180}) => {
  const [windowWidth, setWindowWidth] = useState(0);
  const lastWidthRef = useRef(0);
  const RESIZE_THRESHOLD = 50; // Only update if width changes by more than 50px
  
  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      lastWidthRef.current = window.innerWidth;
      
      // Optimized resize handler with throttling and threshold
      const handleResize = throttleRAF(() => {
        const currentWidth = window.innerWidth;
        if (Math.abs(currentWidth - lastWidthRef.current) > RESIZE_THRESHOLD) {
          setWindowWidth(currentWidth);
          lastWidthRef.current = currentWidth;
        }
      });
      
      window.addEventListener('resize', handleResize, { passive: true });
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  
  // Return empty string if text is undefined or not a string
  if (!text || typeof text !== 'string') return "";
  
  let limit = maxLength.lg;
  if (windowWidth < 640) limit = maxLength.xs;
  else if (windowWidth < 768) limit = maxLength.sm;
  else if (windowWidth < 1024) limit = maxLength.md;
  
  if (text.length <= limit) return text;
  return text.substring(0, limit) + "...";
};

// Add enhanced CSS keyframes for animations and text transitions
const animationStyles = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes textFocus {
  from { letter-spacing: -0.5px; opacity: 0.8; }
  to { letter-spacing: normal; opacity: 1; }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease forwards;
}

.animate-slideUp {
  animation: slideUp 0.5s ease forwards;
}

.animate-textFocus {
  animation: textFocus 0.3s ease forwards;
}

.delay-100 {
  animation-delay: 100ms;
}

.delay-200 {
  animation-delay: 200ms;
}

/* Responsive text classes */
@media (max-width: 640px) {
  .responsive-text-xs {
    font-size: 0.75rem;
  }
  .responsive-text-sm {
    font-size: 0.875rem;
  }
}

@media (min-width: 640px) and (max-width: 768px) {
  .responsive-text-xs {
    font-size: 0.8125rem;
  }
  .responsive-text-sm {
    font-size: 0.9375rem;
  }
}

@media (min-width: 769px) {
  .responsive-text-xs {
    font-size: 0.875rem;
  }
  .responsive-text-sm {
    font-size: 1rem;
  }
}
`;

// Simple ImageWrapper component using OptimizedImage
const ImageWrapper: React.FC<ImageWrapperProps & { coursesPageCompact?: boolean; isLiveCourse?: boolean }> = ({ 
  src, 
  alt, 
  onLoad, 
  onError, 
  priority = false, 
  isLCP = false,
  index = 0,
  coursesPageCompact = false,
  isLiveCourse = false
}) => {
  // Determine if this is an LCP candidate (first 2 images above the fold)
  const shouldBeLCP = isLCP || index < 2;

  // Get optimized image URL
  const imageSrc = src;

  // Use consistent 3:2 aspect ratio for all images
  const imageContainerClasses = `relative w-full aspect-[3/2] overflow-hidden rounded-t-xl group gpu-accelerated`;

  return (
    <div className={imageContainerClasses}>
      <OptimizedImage
        src={imageSrc}
        alt={alt}
        fill={true}
        className="object-cover transition-opacity duration-300 gpu-accelerated"
        quality={shouldBeLCP ? 95 : 85}
        priority={shouldBeLCP}
        onLoad={onLoad}
        onError={onError}
        loading={shouldBeLCP ? 'eager' : 'lazy'}
        decoding={shouldBeLCP ? 'sync' : 'async'}
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />

      {/* Enhanced gradient overlay with GPU acceleration */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 dark:from-black/20 dark:to-black/40 transition-gpu group-hover:opacity-70 gpu-accelerated" />
      
      {/* GPU-optimized shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-transparent via-white/10 to-transparent transition-gpu gpu-accelerated" />
    </div>
  );
};

const CourseCard: React.FC<CourseCardProps> = ({ 
  course = {}, 
  onShowRelated = () => {},
  showRelatedButton = false,
  variant = "standard",
  classType = "",
  viewMode = "grid",
  isCompact = false,
  coursesPageCompact = false,
  preserveClassType = false,
  showDuration = true,
  hidePrice = false,
  hideDescription = true,
  index = 0,
  isLCP = false
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isHoveringCTA, setIsHoveringCTA] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isImageError, setIsImageError] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [tiltStyle, setTiltStyle] = useState({});
  const [isLiked, setIsLiked] = useState(false);
  const [likeAnimation, setLikeAnimation] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveTooltipVisible, setSaveTooltipVisible] = useState(false);
  
  // Add state for mobile popup
  const [showMobilePopup, setShowMobilePopup] = useState(false);
  // Add state to track if device is mobile
  const [isMobile, setIsMobile] = useState(false);
  
  // Add state for brochure form flip card mode
  const [showBrochureForm, setShowBrochureForm] = useState(false);
  
  // Update the showBrochureForm state to include form data
  const [brochureFormData, setBrochureFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Add state for flip animation
  const [isFlipping, setIsFlipping] = useState(false);
  
  const cardRef = useRef(null);
  const router = useRouter();

  // Add state for batch/individual price toggle if card supports interaction
  const [selectedPricing, setSelectedPricing] = useState("individual");

  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const tooltipTimeout = useRef(null);

  // Create a new state for mobile touch-activated "hover"
  const [mobileHoverActive, setMobileHoverActive] = useState(false);

  // Check if device is mobile and add glassmorphic styles
  useEffect(() => {
    const checkIfMobile = () => {
      const userAgent = 
        typeof window.navigator === "undefined" ? "" : navigator.userAgent;
      const mobile = Boolean(
        userAgent.match(
          /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
        )
      );
      setIsMobile(mobile || window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    
    // Add glassmorphic styles
    if (typeof window !== 'undefined') {
      const existingGlassStyle = document.querySelector('#glassmorphic-styles');
      if (existingGlassStyle) {
        existingGlassStyle.remove();
      }
      addGlassmorphicStyles();
    }
    
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Open mobile popup
  const openMobilePopup = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Save current scroll position
    const scrollPosition = window.scrollY;
    
    // Show popup
    setShowMobilePopup(true);
    
    // Prevent background scrolling
    document.body.style.overflow = "hidden";
    
    // Fix viewport position to prevent jumping
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = "100%";
  };

  // Close mobile popup
  const closeMobilePopup = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Get the scroll position from the body's top property
    const scrollPosition = document.body.style.top;
    
    // Reset body styles
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    
    // Restore scroll position
    if (scrollPosition) {
      window.scrollTo(0, parseInt(scrollPosition.replace('-', '')) || 0);
    }
    
    // Close popup
    setShowMobilePopup(false);
  };

  const handleImageLoad = () => setIsImageLoaded(true);
  const handleImageError = () => setIsImageError(true);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  // Update handleBrochureClick to handle flip animation
  const handleBrochureClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFlipping(true);
    setShowBrochureForm(true);
    
    // Reset form data
    setBrochureFormData({
      name: '',
      email: '',
      phone: ''
    });
  };
  
  // Add handler for form submission
  const handleBrochureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the form submission
    // For now, we'll just close the form
    handleCloseBrochureForm();
  };

  // Update handleCloseBrochureForm to handle flip animation
  const handleCloseBrochureForm = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setShowBrochureForm(false);
      setIsFlipping(false);
    }, 600); // Match the flip animation duration
  };

  // Cleanup effect for tooltip timeout
  useEffect(() => {
    return () => {
      if (tooltipTimeout.current) {
        clearTimeout(tooltipTimeout.current);
      }
    };
  }, []);

  // Helper function to get description text safely
  const getDescriptionText = (description: any) => {
    if (!description) return '';
    if (typeof description === 'string') return description;
    if (typeof description === 'object') {
      return description.program_overview || description.benefits || '';
    }
    return '';
  };

  // Determine the effective class type based on preserveClassType flag
  const getEffectiveClassType = () => {
    // If preserveClassType is true, use the course's own class_type
    // Otherwise, override with the classType prop if provided
    
    // First check if we have an explicit classType prop or class_type property
    let effectiveType = preserveClassType ? (course.class_type || "") : (classType || course.class_type || "");
    
    // Handle specific classType prop values first
    if (classType === 'blended_courses' || effectiveType === 'blended_courses') {
      return 'blended';
    }
    if (classType === 'live_courses' || effectiveType === 'live_courses') {
      return 'live';
    }
    
    // Handle the "all" category case - we need to determine the type from course properties
    if (effectiveType === "all" || effectiveType === "") {
      const descriptionText = getDescriptionText(course?.course_description);

      // Check for live courses indicators
      if (course?.is_live_course === true || 
          (course?.course_title && typeof course.course_title === 'string' && course.course_title.toLowerCase().includes('live')) ||
          (course?.class_type && typeof course.class_type === 'string' && course.class_type.toLowerCase().includes('live')) ||
          (course?.course_description && typeof course.course_description === 'string' && course.course_description.toLowerCase().includes('live interactive'))) {
        return 'live';
      }
      
      // Check for blended courses indicators
      if (course?.is_blended_course === true || 
          (course?.class_type && typeof course.class_type === 'string' && (course.class_type.toLowerCase().includes('blend') || course.class_type.toLowerCase().includes('hybrid'))) ||
          (course?.course_title && typeof course.course_title === 'string' && (course.course_title.toLowerCase().includes('blend') || course.course_title.toLowerCase().includes('hybrid'))) ||
          (course?.course_description && typeof course.course_description === 'string' && course.course_description.toLowerCase().includes('blended learning'))) {
        return 'blended';
      }
      
      // If we have no_of_Sessions but no indication of live/blended, likely self-paced
      if (course?.no_of_Sessions || course?.video_count) {
        return 'self-paced';
      }
      
      // Default to self-paced if we can't determine
      return 'self-paced';
    }
    
    // Normalize the type to ensure consistent handling
    effectiveType = effectiveType.toLowerCase();
    
    // Check for specific keywords that might identify the type
    if (effectiveType.includes('live')) {
      return 'live';
    } else if (effectiveType.includes('blend') || effectiveType.includes('hybrid')) {
      return 'blended';
    } else if (effectiveType === 'self-paced' || effectiveType === 'self paced') {
      return 'self-paced';
    }
    
    // Default to self-paced if we can't determine
    return effectiveType || 'self-paced';
  };

  // Updated to use the effective class type and enhanced properties
  const effectiveClassType = getEffectiveClassType();
  const isLiveCourse = course?.isLiveCourse || effectiveClassType === 'live';
  const isBlendedCourse = effectiveClassType === 'blended';
  const isSelfPacedCourse = effectiveClassType === 'self-paced' || (!isLiveCourse && !isBlendedCourse);
  
  // Enhanced live course features
  const hasEnhancedFeatures = course?.liveFeatures && course.liveFeatures.length > 0;
  const shouldPreserveLiveHover = course?.preserveLiveHoverState || isLiveCourse;

  const resetTilt = useCallback(() => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
      transition: 'transform 0.5s ease'
    });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current || !isHovered || !isLiveCourse || isHoveringCTA) return; // Only enable for live courses and not when hovering CTA
    
    // Apply different hover effects based on course type
    const card = cardRef.current as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    if (isLiveCourse && shouldPreserveLiveHover) {
      // Enhanced live course hover effect - more subtle tilt with glow
      const tiltX = (y - 0.5) * 5;
      const tiltY = (0.5 - x) * 5;
      
      setTiltStyle({
        transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(10px)`,
        transition: 'transform 0.2s ease',
        boxShadow: '0 20px 40px rgba(55, 147, 146, 0.15), 0 0 0 1px rgba(55, 147, 146, 0.1)'
      });
    } else {
      // Standard tilt effect for self-paced courses
      const tiltX = (y - 0.5) * 10;
      const tiltY = (0.5 - x) * 10;
      
      setTiltStyle({
        transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        transition: 'transform 0.1s ease'
      });
    }

    setTooltipPosition({
      x: rect.right,
      y: rect.top
    });
  }, [isHovered, isLiveCourse, shouldPreserveLiveHover, isHoveringCTA]);

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (!isMobile && isLiveCourse) { // Only enable hover for live courses
      setIsHovered(true);
      setMousePosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && isLiveCourse) { // Only for live courses
      setIsHovered(false);
      setMousePosition({ x: 0, y: 0 });
      // Reset tilt style
      resetTilt();
    }
  };

  const openMobileHover = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMobileHoverActive(true);
  }, []);

  const closeMobileHover = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setMobileHoverActive(false);
  }, []);

  // Update the formatPrice function to better handle batch pricing
  const formatPrice = (priceInput: any, batchPriceInput: any) => {
    // Check if the course is explicitly marked as free
    if (course?.isFree === true) return "Free";

    let actualPrice;
    let currencySymbol = '$'; // Default currency symbol
    let priceType = '';

    // Determine currency symbol from course.prices if available
    if (course?.prices && course.prices.length > 0 && course.prices[0].currency) {
      currencySymbol = course.prices[0].currency;
    }

    // Determine the actual price to display
    if (course?.prices && course.prices.length > 0) {
      const priceObj = course.prices[0];
      if (priceObj.individual === 0 && priceObj.batch === 0) return "Free";

      // For live courses, prioritize batch pricing
      if (isLiveCourse) {
        if (typeof priceObj.batch === 'number' && priceObj.batch > 0) {
          actualPrice = priceObj.batch;
          priceType = 'batch';
        } else if (typeof priceObj.individual === 'number' && priceObj.individual > 0) {
          actualPrice = priceObj.individual;
          priceType = 'individual';
        }
      } else {
        // For non-live courses, use selectedPricing or default to individual
        if (selectedPricing === "batch" && typeof priceObj.batch === 'number') {
          actualPrice = priceObj.batch;
          priceType = 'batch';
        } else if (typeof priceObj.individual === 'number') {
          actualPrice = priceObj.individual;
          priceType = 'individual';
        } else if (typeof priceObj.batch === 'number') { // Fallback to batch if individual is not a number
          actualPrice = priceObj.batch;
          priceType = 'batch';
        }
      }
      
      if (!actualPrice) {
        return "Price not available";
      }
    } else {
      // Fallback to the provided price and batchPrice parameters
      const pInput = typeof priceInput === 'string' && priceInput.includes(' Onwards') 
                     ? parseFloat(priceInput.replace(' Onwards', '')) 
                     : parseFloat(priceInput);
      const bInput = parseFloat(batchPriceInput);

      if (isFreePrice(pInput) && (isNaN(bInput) || isFreePrice(bInput))) return "Free";
      
      // For live courses, prioritize batch pricing
      if (isLiveCourse) {
        if (!isNaN(bInput) && !isFreePrice(bInput) && bInput > 0) {
          actualPrice = bInput;
          priceType = 'batch';
        } else if (!isNaN(pInput) && pInput > 0) {
          actualPrice = pInput;
          priceType = 'individual';
        }
      } else {
        if (selectedPricing === "batch" && !isNaN(bInput) && !isFreePrice(bInput)) {
          actualPrice = bInput;
          priceType = 'batch';
        } else if (!isNaN(pInput)) {
          actualPrice = pInput;
          priceType = 'individual';
        } else if (!isNaN(bInput)) { // Fallback to batch if individual is not a number
          actualPrice = bInput;
          priceType = 'batch';
        }
      }
      
      if (!actualPrice) {
        return "Price not available";
      }
    }
    
    if (typeof actualPrice !== 'number' || isNaN(actualPrice)) {
        // This case might occur if prices are not numbers or not found
        // Let's check the original priceInput and batchPriceInput again if they are strings like "Free"
        if (priceInput === "Free" || batchPriceInput === "Free") return "Free";
        return "Price not available";
    }
    
    if (actualPrice === 0) return "Free";

    // Add a space if currency symbol is multi-character (e.g., INR)
    const displaySymbol = currencySymbol.length > 1 ? `${currencySymbol} ` : currencySymbol;
    
    // For live courses showing batch pricing, add batch indicator
    if (isLiveCourse && priceType === 'batch') {
      return `${displaySymbol}${actualPrice.toLocaleString()}`;
    }
    
    return `${displaySymbol}${actualPrice.toLocaleString()}`;
  };

  // Calculate discount percentage for batch pricing
  const calculateBatchDiscount = (individualPrice: any, batchPrice: any) => {
    if (!individualPrice || !batchPrice || individualPrice <= 0 || batchPrice <= 0) return 0;
    return Math.round(((individualPrice - batchPrice) / individualPrice) * 100);
  };

  // Format duration for display
  const formatDuration = (duration: any) => {
    if (!duration) return "Self-paced";
    
    // If duration is already in the correct format (e.g., "4 to 18 months"), return it
    if (typeof duration === 'string' && duration.toLowerCase().includes('month')) {
      return duration;
    }
    
    // If it's a duration range (e.g., "4-18"), format it
    const rangeMatch = String(duration).match(/^(\d+)\s*-\s*(\d+)$/);
    if (rangeMatch) {
      const [, start, end] = rangeMatch;
      return `${start} to ${end} months`;
    }
    
    // If it's a single number, add "months"
    if (/^\d+$/.test(String(duration))) {
      return `${duration} months`;
    }
    
    return duration;
  };

  // Helper function to extract only months from duration strings like "18 Months (72 Weeks)"
  const extractMonthsOnly = (duration: any) => {
    if (!duration) return "";
    
    let durationString = "";
    
    // Handle different duration formats (string, object, React element)
    if (typeof duration === 'string') {
      durationString = duration;
    } else if (React.isValidElement(duration)) {
      // Extract text from React element
      const extractTextFromElement = (element: any): string => {
        if (!element) {
          return '';
        }
        if (typeof element === 'string') {
          return element;
        }
        if (React.isValidElement<{ children: React.ReactNode }>(element)) {
          const { children } = element.props;
          if (typeof children === 'string') {
            return children;
          }
          if (Array.isArray(children)) {
            return children.map(extractTextFromElement).join(' ');
          }
          if (children) {
            return extractTextFromElement(children);
          }
        }
        return '';
      };
      durationString = extractTextFromElement(duration);
    } else if (duration && typeof duration === 'object') {
      // For plain objects, try to extract string content
      const objectStr = JSON.stringify(duration);
      const quotedStrings = objectStr.match(/"[^"]*"/g) || [];
      durationString = quotedStrings.join(' ').replace(/"/g, '');
    } else {
      durationString = String(duration);
    }
    
    // If it contains both months and weeks in parentheses, extract only the months part
    if (durationString.includes('(') && (durationString.includes('Weeks)') || durationString.includes('weeks)'))) {
      const monthsPart = durationString.split('(')[0].trim();
      return monthsPart;
    }
    
    // If it contains "Months" but not in parentheses format, just return as is
    if (durationString.includes('Month')) {
      return durationString;
    }
    
    // Otherwise use the regular formatDuration function
    return formatDuration(durationString);
  };

  // Add helper to format hyphen-based ranges to "to" format
  const formatRangeToText = (range?: string): string => {
    if (!range) return "";
    const trimmed = range.trim();
    const hyphenMatch = trimmed.match(/^(\d+)\s*-\s*(\d+)(.*)$/);
    if (hyphenMatch) {
      const [, start, end, rest] = hyphenMatch;
      return `${start} to ${end}${rest}`;
    }
    return trimmed;
  };

  const formatCourseGrade = (grade: any) => {
    if (grade === "UG - Graduate - Professionals") {
      return "UG/Grad/Pro";
    }
    return grade;
  };

  // Helper function for currency formatting
  const formatCurrencyPrice = (price: number) => {
    return price.toLocaleString();
  };

  // Helper function for price conversion
  const convertPrice = (price: number) => {
    return price;
  };

  // Updated navigate logic: use dynamic enrollment URLs for live courses when provided
  const navigateToCourse = () => {
    // 1. Check if it's a live class type and redirect to enrollment page
    if (isLiveCourse && course?._id && course?.course_category) {
      const categoryName = course.course_category.toLowerCase().replace(/\s+/g, '-');
      const enrollmentUrl = `/enrollment/${categoryName}?course=${course._id}`;
      router.push(enrollmentUrl);
      return;
    }

    // 2. Prefer an explicit URL if supplied (e.g. enrollment link for live courses)
    if (course?.url && typeof course.url === 'string' && course.url.trim() !== '') {
      // Ensure the URL is properly formatted (allow both absolute and relative)
      const targetUrl = course.url.startsWith('http') ? course.url : course.url.startsWith('/') ? course.url : `/${course.url}`;
      window.open(targetUrl, '_blank');
      return;
    }

    // 3. Fallback: open standard course-details page when course id is present
    if (course?._id) {
      window.open(`/course-details/${course._id}`, '_blank');
    }
  };

  // Determine enrollment status label
  const getEnrollmentStatus = () => {
    if (course?.enrolled_students && course.enrolled_students > 100) return "High demand";
    if (course?.is_new) return "New course";
    return course?.enrollment_status || null;
  };

  const enrollmentStatus = getEnrollmentStatus();

  // Course highlights based on class type
  const getHighlights = () => {
    if (classType === 'blended_courses') {
      return [
        "Blend of online & offline learning",
        "Personalized attention",
        "Interactive classroom sessions"
      ];
    }
    // Default highlights for other class types
    return [
      "Industry-recognized certification",
      "Hands-on projects",
      "Expert instructors"
    ];
  };

  // Get the session display text based on class type
  const getSessionDisplay = () => {
    const displayValue = (course as any)?.session_range || (course as any)?.session_display || course?.no_of_Sessions;
    if (classType === 'blended_courses') {
      return {
        label: "Classes",
        value: displayValue || "N/A"
      };
    }
    return {
      label: "Sessions",
      value: displayValue || "N/A"
    };
  };

  const courseHighlights = getHighlights();
  const sessionInfo = getSessionDisplay();

  // Animation for badge entrance
  useEffect(() => {
    if (isHovered) {
      const timer = setTimeout(() => {
        setActiveTab('overview');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isHovered]);

  // Handle course like/unlike
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setIsLiked(!isLiked);
    setLikeAnimation(true);
    setTimeout(() => setLikeAnimation(false), 1000);
    // Here you would typically call an API to save the liked status
  };

  // Handle save/bookmark course
  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setIsSaved(!isSaved);
    
    // Show feedback tooltip
    setSaveTooltipVisible(true);
    setTimeout(() => setSaveTooltipVisible(false), 2000);
    
    // Here you would typically call an API to save the bookmark status
  };

  // Get course progress (mock data for demo, would come from API)
  const getProgress = () => {
    // Check if the course has a progress property
    if (course?.progress !== undefined) {
      return course.progress;
    }
    
    // For demo purposes, return a random progress for some courses
    if (course?._id && parseInt(course._id) % 3 === 0) {
      return Math.floor(Math.random() * 100);
    }
    
    return null;
  };
  
  const progress = getProgress();
  const isInProgress = progress !== null && progress > 0 && progress < 100;
  const isCompleted = progress !== null && progress === 100;

  // Format and adapt course title for display
  const adaptedTitle = useResponsiveText(course?.course_title, {xs: 40, sm: 60, md: 80, lg: 100});
  // Format and adapt course description for display
  const courseDescriptionText = getDescriptionText(course?.course_description);
  const adaptedDescription = useResponsiveText(courseDescriptionText, {xs: 80, sm: 120, md: 160, lg: 200});

  // Get course type specific styles
  const getCourseTypeStyles = () => {
    if (isLiveCourse) {
      return {
        tagBg: 'bg-[#379392]/90',
        tagText: 'text-white',
        buttonBg: 'bg-[#379392] hover:bg-[#379392]/90',
        buttonText: 'text-white',
        accentColor: 'text-[#379392] dark:text-[#379392]/80',
        borderHover: 'hover:border-[#379392]/60',
        shadowHover: 'hover:shadow-[#379392]/20',
        gradientBg: 'from-[#379392]/10 via-white to-[#379392]/10 dark:from-[#379392]/20 dark:via-gray-900 dark:to-[#379392]/20',
        iconColor: 'text-[#379392]',
        borderLeft: 'border-l-4 border-[#379392]/80',
        durationBoxBg: 'bg-[#379392]/5',
        durationIconColor: 'text-[#379392]',
        durationTextColor: 'text-[#379392]',
        priceColor: 'text-[#379392]'
      };
    }
    
    if (isBlendedCourse) {
      return {
        tagBg: 'bg-purple-500/90',
        tagText: 'text-white',
        buttonBg: 'bg-purple-500 hover:bg-purple-600',
        buttonText: 'text-white',
        accentColor: 'text-purple-500 dark:text-purple-400',
        borderHover: 'hover:border-purple-400/60',
        shadowHover: 'hover:shadow-purple-200/20',
        gradientBg: 'from-purple-50 via-white to-purple-50 dark:from-purple-900/10 dark:via-gray-900 dark:to-purple-900/10',
        iconColor: 'text-purple-500',
        borderLeft: 'border-l-4 border-purple-500/80',
        durationBoxBg: 'bg-purple-50 dark:bg-purple-900/10',
        durationIconColor: 'text-purple-500',
        durationTextColor: 'text-purple-600',
        priceColor: 'text-purple-600 dark:text-purple-400'
      };
    }
    
    // Default to self-paced course styles
    return {
      tagBg: 'bg-indigo-500/90',
      tagText: 'text-white',
      buttonBg: 'bg-indigo-500 hover:bg-indigo-600',
      buttonText: 'text-white',
      accentColor: 'text-indigo-500 dark:text-indigo-400',
      borderHover: 'hover:border-indigo-400/60',
      shadowHover: 'hover:shadow-indigo-200/20',
      gradientBg: 'from-indigo-50 via-white to-indigo-50 dark:from-indigo-900/10 dark:via-gray-900 dark:to-indigo-900/10',
      iconColor: 'text-indigo-500',
      borderLeft: 'border-l-4 border-indigo-500/80',
      durationBoxBg: 'bg-indigo-50 dark:bg-indigo-900/10',
      durationIconColor: 'text-indigo-500',
      durationTextColor: 'text-indigo-600',
      priceColor: 'text-indigo-600 dark:text-indigo-400'
    };
  };

  const styles = getCourseTypeStyles();

  // Update selectedPricing based on course type
  useEffect(() => {
    setSelectedPricing(isLiveCourse ? "batch" : "individual");
  }, [isLiveCourse]);

  // Get course type specific content
  const getCourseTypeContent = () => {
    if (isLiveCourse) {
      return {
        tag: 'Live',
        tagIcon: <Play className="w-3 h-3" />,
        sessionLabel: 'Live Sessions',
        sessionIcon: <Users size={14} />,
        durationLabel: 'Live Interactive',
        scheduleInfo: course?.schedule || 'Flexible Schedule',
        instructorLabel: 'Live Instructor',
        priceLabel: 'Per Session'
      };
    }
    
    if (isBlendedCourse) {
      return {
        tag: 'Blended',
        tagIcon: <Layers className="w-3 h-3" />,
        sessionLabel: 'Blended Classes',
        sessionIcon: <BookOpen size={14} />,
        durationLabel: 'Blended Learning',
        scheduleInfo: 'Combination of online & offline',
        instructorLabel: 'Course Instructor',
        priceLabel: 'Full Course'
      };
    }
    
    // Default to self-paced content
    return {
      tag: 'Self-Paced',
      tagIcon: <Play className="w-3 h-3" />,
      sessionLabel: 'Videos',
      sessionIcon: <Play size={14} />,
      durationLabel: 'Self-Paced Learning',
      scheduleInfo: 'Learn at your own pace',
      instructorLabel: 'Course Instructor',
      priceLabel: 'Full Course'
    };
  };

  const content = getCourseTypeContent();

  // Check if this is one of the special courses that should show internship
  const hasInternshipOption = (isLiveCourse && course?.course_duration && typeof course.course_duration === 'string' && course.course_duration.toLowerCase().includes('18')) || 
    (course?.course_title && (
      course.course_title.toLowerCase().includes('ai & data science') ||
      course.course_title.toLowerCase().includes('artificial intelligence') ||
      course.course_title.toLowerCase().includes('digital marketing')
    ));

  // Mobile-specific stylesi
  const mobileCardStyles = `
    ${isMobile ? `
      p-3 
      rounded-lg 
      shadow-sm
      border-[0.5px]
      min-h-[280px]
      ${isCompact ? 'min-h-[240px]' : ''}
      mx-auto
      w-full
      max-w-[360px]
      mb-6
      sm:mb-8
    ` : ''}
  `;

  const mobileImageStyles = `
    ${isMobile ? `
      aspect-[3/2]
      rounded-lg
      overflow-hidden
      shadow-sm
    ` : ''}
  `;

  const mobileContentStyles = `
    ${isMobile ? `
      px-2 
      pt-1.5
      pb-2
      space-y-1.5
    ` : ''}
  `;

  // Amplified title style for stronger focus
  const mobileTitleStyles = `
    ${isMobile ? `
      text-[18px]  /* bigger base size */
      leading-snug
      font-extrabold /* bolder weight */
      tracking-tight
    ` : ''}
  `;

  const mobileButtonStyles = `
    ${isMobile ? `
      fixed
      bottom-4
      left-1/2
      transform
      -translate-x-1/2
      z-30
      px-4
      py-2.5
      rounded-lg
      shadow-lg
      min-w-[140px]
      text-sm
      font-medium
      flex
      items-center
      justify-center
      gap-1.5
      backdrop-blur-md
    ` : ''}
  `;

  // Action buttons - consistent across both types with style variations
  const renderActionButtons = () => (
    <div className={`mt-auto ${isMobile ? 'pt-1' : 'pt-0.5'} flex flex-col items-center w-full`}>
      <div className={`${isLiveCourse ? '' : 'grid grid-cols-2 gap-2'} mb-2 w-full`}>
        {/* Only show brochure button for non-live courses */}
        {!isLiveCourse && (
          <button
            onClick={handleBrochureClick}
            onMouseEnter={() => setIsHoveringCTA(true)}
            onMouseLeave={() => setIsHoveringCTA(false)}
            className="px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 
              border border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400"
          >
            <Download size={16} className="text-indigo-500" />
            Brochure
          </button>
        )}
        <button
          onClick={navigateToCourse}
          onMouseEnter={() => setIsHoveringCTA(true)}
          onMouseLeave={() => setIsHoveringCTA(false)}
          className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all text-white flex items-center justify-center gap-1.5
             ${isLiveCourse 
            ? 'bg-[#379392] hover:bg-[#2a7170] shadow-md shadow-[#379392]/20 w-full' 
            : 'bg-indigo-500 hover:bg-indigo-600 shadow-md shadow-indigo-500/20'
          }`}
        >
          {isLiveCourse ? 'Explore Course' : 'Details'}
          <ArrowUpRight size={16} className="group-hover:rotate-12 transition-transform" />
        </button>
      </div>
    </div>
  );

  // Update card className to use dynamic styles
  return (
    <div className="relative">
      {showBrochureForm ? (
        <div className="h-full w-full">
          <DownloadBrochureModal
            isOpen={showBrochureForm}
            onClose={handleCloseBrochureForm}
            courseTitle={course?.course_title || "Course Brochure"}
            courseId={course?._id}
            flipCard={true}
          >
            {/* Pass the original card content as children */}
            <div 
              ref={cardRef}
                          className={`course-card ${mobileCardStyles} group relative flex flex-col ${coursesPageCompact ? 'h-[420px]' : 'h-full'} rounded-2xl overflow-hidden 
            ${coursesPageCompact ? 'glassmorphic-card' : 'border border-gray-200/30 dark:border-gray-800/40 bg-white/95 dark:bg-gray-900/95 backdrop-filter backdrop-blur-sm'} 
            transition-all duration-300 
            ${isHovered || mobileHoverActive ? 'scale-[1.02] z-10 shadow-2xl' : 'scale-100 z-0 shadow-lg'}
            ${styles.borderHover} ${styles.shadowHover} ${isLiveCourse ? styles.borderLeft : ''}
            ${isMobile ? (isBlendedCourse ? 'pb-8 last:mb-0' : 'pb-20 last:mb-0') : ''}
            ${viewMode === 'grid' ? 'sm:mx-2 md:mx-3' : ''}
            hover:shadow-2xl
            ${isFlipping ? 'pointer-events-none' : ''}`}
            >
              {/* Course type indicator tag - for desktop or when mobile hover is not active */}
              {(isLiveCourse || isBlendedCourse) && (!isMobile || !mobileHoverActive) && (
                <div className={`absolute top-2 left-2 z-20 px-2.5 py-1 rounded-full text-xs font-bold 
                  ${styles.tagBg} ${styles.tagText} flex items-center gap-1.5 cursor-pointer group/tag`}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowTooltip(!showTooltip);
                  }}
                >
                  {content.tagIcon}
                  <span>{content.tag}</span>
                  <Info size={13} className="group-hover/tag:animate-pulse" />
                  
                  {/* Class Type Tooltip */}
                  {showTooltip && (
                    <div className="absolute top-full left-0 mt-2 w-60 p-3 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 text-left text-gray-800 dark:text-gray-200 text-xs">
                      <div className="flex justify-between items-start mb-1.5">
                        <h4 className="font-bold text-sm">
                          {isLiveCourse 
                            ? 'Live Interactive Course' 
                            : isBlendedCourse 
                              ? 'Blended Learning Course'
                              : 'Self-Paced Course'}
                        </h4>
                        <button 
                          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowTooltip(false);
                          }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <p className="mb-2">
                        {isLiveCourse 
                          ? 'Live classes with real-time instructor interaction, scheduled sessions, and personalized feedback.' 
                          : isBlendedCourse
                            ? 'Combination of self-paced content and live interactive sessions for a comprehensive learning experience.'
                            : 'Learn at your own pace with pre-recorded videos, flexible schedule, and self-directed activities.'}
                      </p>
                      <div className="flex flex-col gap-1 pt-1 border-t border-gray-200 dark:border-gray-700">
                        {isLiveCourse ? (
                          <>
                            <div className="flex items-center gap-1 text-[11px]">
                              <Users size={11} className="text-medhgreen" />
                              <span>Live instructor interaction</span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px]">
                              <Calendar size={11} className="text-purple-500" />
                              <span>Scheduled sessions</span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px]">
                              <Target size={11} className="text-amber-500" />
                              <span>Personalized feedback</span>
                            </div>
                          </>
                        ) : isBlendedCourse ? (
                          <>
                            <div className="flex items-center gap-1 text-[11px]">
                              <Play size={11} className="text-purple-500" />
                              <span>Pre-recorded content</span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px]">
                              <Users size={11} className="text-purple-500" />
                              <span>Some live interaction</span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px]">
                              <Clock size={11} className="text-purple-500" />
                              <span>Flexible schedule with deadlines</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-1 text-[11px]">
                              <Play size={11} className="text-indigo-500" />
                              <span>Pre-recorded videos</span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px]">
                              <Clock size={11} className="text-teal-500" />
                              <span>Flexible schedule</span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px]">
                              <BookOpen size={11} className="text-blue-500" />
                              <span>Self-directed learning</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile-specific Class Type Banner */}
              {isMobile && !mobileHoverActive && (
                <div 
                  className={`absolute bottom-20 left-0 right-0 px-3 py-2 ${
                    isLiveCourse 
                      ? 'bg-gradient-to-r from-[#379392]/80 to-[#379392]/95 text-white' 
                      : isBlendedCourse
                        ? 'bg-gradient-to-r from-purple-500/80 to-purple-500/95 text-white'
                        : 'bg-gradient-to-r from-indigo-500/80 to-indigo-500/95 text-white'
                  } text-xs flex items-center justify-between z-20 shadow-md backdrop-blur-sm`}
                >
                  <div className="flex items-center gap-1">
                    {content.sessionIcon}
                    <span className="font-semibold">
                      {isLiveCourse 
                        ? formatRangeToText(extractMonthsOnly(course?.duration_range || course?.course_duration) || "Live Course")
                        : ((course as any)?.session_range || `${course?.no_of_Sessions || "0"} ${content.sessionLabel}`)
                      }
                    </span>
                  </div>
                  <button 
                    className="rounded-full bg-white/20 p-1 hover:bg-white/30 flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setShowTooltip(!showTooltip);
                    }}
                  >
                    <Info size={12} />
                  </button>
                </div>
              )}

              {/* Image section */}
              <ImageWrapper
                src={course?.course_image || ''}
                alt={course?.course_title || "Course Image"}
                onLoad={handleImageLoad}
                onError={handleImageError}
                priority={isLCP}
                isLCP={isLCP}
                index={index}
                coursesPageCompact={coursesPageCompact}
                isLiveCourse={isLiveCourse}
              />

              {/* Course info */}
              <div className={`${mobileContentStyles} flex flex-col ${coursesPageCompact ? (isLiveCourse ? 'px-3 pt-3 pb-4' : 'px-3 pt-2 pb-3') : 'px-5 pt-3 pb-5'} flex-grow justify-between`}>
                <div className={`flex flex-col items-center justify-between flex-grow ${coursesPageCompact ? (isLiveCourse ? 'py-2 min-h-[120px]' : 'py-1 min-h-[100px]') : 'py-2 min-h-[140px]'}`}>
                  {/* Course category badge */}
                  {course?.course_grade && (
                    <div className={`inline-flex mb-2 items-center text-xs font-semibold rounded-full px-3 py-1 ${
                      isLiveCourse ? 'bg-[#379392]/10 text-[#379392]' : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                    } mx-auto`}>
                      {isLiveCourse ? 
                        <Play size={14} className="mr-1.5" /> : 
                        <Layers size={14} className="mr-1.5" />
                      }
                      <span>{formatCourseGrade(course?.course_grade)}</span>
                    </div>
                  )}

                  {/* Course title - centered */}
                  <h3 className={`${mobileTitleStyles} text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white line-clamp-2 text-center mx-auto max-w-[95%] leading-tight min-h-[3rem] flex items-center justify-center ${course?.course_category ? 'mt-1' : 'mt-0'}`}>
                    {course?.course_title || "Course Title"}
                  </h3>
                  
                                  {/* Course description - optimized spacing and responsive */}
                {!isCompact && !hideDescription && (
                  <p className={`text-xs sm:text-sm lg:text-xs xl:text-sm text-gray-600 dark:text-gray-400 mt-1.5 line-clamp-2 max-w-[95%] h-8 sm:h-10 ${coursesPageCompact ? 'text-left w-full' : 'text-center mx-auto flex items-center justify-center'}`}>
                    {courseDescriptionText}
                  </p>
                )}

                  {/* Session Count Indicator and Features - displayed in normal card view */}
                  {course?.no_of_Sessions && (
                    <div className="flex flex-col items-center mt-2 mb-1 space-y-2">
                      {isBlendedCourse ? (
                        <div className="flex flex-col items-center gap-1">
                          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                            <Play size={14} className="mr-1 text-purple-500" />
                            <span>{course.no_of_Sessions} Video Sessions</span>
                          </div>
                          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-[#379392]/10 text-[#379392]">
                            <Users size={14} className="mr-1 text-[#379392]" />
                            <span>02 Q&A Live Sessions</span>
                          </div>
                        </div>
                      ) : isLiveCourse ? (
                        <div className="flex flex-col items-center gap-1.5 w-full">
                          {/* Live Sessions badge */}
                          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-[#379392]/10 text-[#379392]">
                            {content.sessionIcon}
                            <span className="ml-1">{course.no_of_Sessions} Live Sessions</span>
                          </div>
                          {/* Duration badge chip */}
                          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-[#379392]/10 text-[#379392] mt-1">
                            <Calendar size={14} className="mr-1" />
                            <span>{formatRangeToText(course?.duration_range || extractMonthsOnly(course?.course_duration))}</span>
                          </div>
                          {/* Live Course Features - Enhanced Information Display */}
                          <div className="flex flex-col gap-2 w-full">
                            {/* Effort Hours Display */}
                            <div className="bg-gradient-to-r from-[#379392]/10 to-[#379392]/5 border border-[#379392]/20 rounded-lg p-3">
                              <div className="flex items-center justify-center gap-2 mb-2">
                                <Clock size={14} className="text-[#379392]" />
                                <span className="text-sm font-semibold text-[#379392]">Required Effort</span>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-gray-900 dark:text-white">
                                  {course?.effort_hours ? `${course.effort_hours}` : '6-8'} hrs/week
                                </div>
                              </div>
                            </div>
                            
                            {/* Enhanced Live Course Features */}
                            <div className="flex flex-wrap gap-2 justify-center">
                              {/* Show enhanced features if available */}
                              {course?.additionalFeatures?.map((feature, index) => (
                                <span key={index} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-semibold border border-purple-200 dark:border-purple-800">
                                  <Briefcase size={12} className="mr-1.5" />
                                  {feature}
                                </span>
                              ))}
                              
                              {/* Fallback to default features if additionalFeatures not present */}
                              {!course?.additionalFeatures && (
                                <>
                                  <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-semibold border border-purple-200 dark:border-purple-800">
                                    <Briefcase size={12} className="mr-1.5" />
                                    Projects
                                  </span>
                                  <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-semibold border border-indigo-200 dark:border-indigo-800">
                                    <BookOpen size={12} className="mr-1.5" />
                                    Assignments
                                  </span>
                                </>
                              )}
                            </div>
                            
                            {/* Enhanced Live Course Features from CoursesFilter */}
                            {(course?.liveFeatures && course.liveFeatures.length > 0) && (
                              <div className="flex flex-wrap gap-2 justify-center">
                                {course.liveFeatures.map((feature, index) => {
                                  if (feature === 'Projects & Assignments') {
                                    return (
                                      <span key={index} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-semibold border border-purple-200 dark:border-purple-800">
                                        <Briefcase size={12} className="mr-1.5" />
                                        {feature}
                                      </span>
                                    );
                                  } else if (feature === 'Corporate Internship') {
                                    return (
                                      <span key={index} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 text-xs font-semibold border border-teal-200 dark:border-teal-800">
                                        <TrendingUp size={12} className="mr-1.5" />
                                        {feature}
                                      </span>
                                    );
                                  } else if (feature === 'Job Guarantee') {
                                    return (
                                      <span key={index} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold border border-amber-200 dark:border-amber-800">
                                        <Award size={12} className="mr-1.5" />
                                        {feature}
                                      </span>
                                    );
                                  } else if (feature === '(18 Month Course Only)') {
                                    return (
                                      <span key={index} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 text-xs font-semibold border border-gray-200 dark:border-gray-700">
                                        <CheckCircle size={12} className="mr-1.5" />
                                        {feature}
                                      </span>
                                    );
                                  } else {
                                    return (
                                      <span key={index} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 text-xs font-semibold border border-gray-200 dark:border-gray-700">
                                        <CheckCircle size={12} className="mr-1.5" />
                                        {feature}
                                      </span>
                                    );
                                  }
                                })}
                              </div>
                            )}
                            
                            {/* Additional features for longer courses - fallback */}
                            {!course?.liveFeatures && course?.course_duration && (typeof course.course_duration === 'string' && course.course_duration.toLowerCase().includes('18')) && (
                              <div className="flex flex-wrap gap-2 justify-center">
                                <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 text-xs font-semibold border border-teal-200 dark:border-teal-800">
                                  <TrendingUp size={12} className="mr-1.5" />
                                  Internship
                                </span>
                                <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold border border-amber-200 dark:border-amber-800">
                                  <Award size={12} className="mr-1.5" />
                                  Job Guarantee
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                          {content.sessionIcon}
                          <span className="ml-1">{course.no_of_Sessions} sessions</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Course Duration/Learning Experience */}
                {showDuration && course?.course_duration && (
                  <div className={`mx-auto ${isMobile ? 'mb-14' : 'mb-2'} w-full mt-2`}>
                    {React.isValidElement(course.course_duration) ? (
                      <div className={`flex items-center justify-center ${styles.durationBoxBg} p-3 rounded-lg`}>
                        {course.course_duration}
                      </div>
                    ) : (
                      <div className={`flex items-center ${styles.durationBoxBg} p-2 rounded-lg justify-center`}>
                        <Clock size={16} className={`mr-2 ${styles.durationIconColor} flex-shrink-0 lg:w-4 lg:h-4`} />
                        <div className="text-center">
                          <span className={`${styles.durationTextColor} font-semibold text-xs sm:text-sm lg:text-xs xl:text-sm`}>
                            {isLiveCourse ? 'Course Duration' : 'Learning Experience'}
                          </span>
                          <p className="text-gray-700 dark:text-gray-300 font-medium text-xs sm:text-sm lg:text-xs xl:text-sm mt-0.5">
                            {isBlendedCourse ? 'Self-paced' : formatRangeToText(course?.duration_range || extractMonthsOnly(course?.course_duration))}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Price section - Enhanced for Live Courses */}
                {!hidePrice && (
                  <div className={`mt-1.5 text-center`}>
                    {isLiveCourse ? (
                      <div className="bg-gradient-to-r from-[#379392]/5 to-[#379392]/10 border border-[#379392]/20 rounded-lg p-4 mb-2">
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-baseline gap-1.5 justify-center">
                            <span className="text-2xl font-bold text-[#379392]">
                              INR {course?.course_fee ? Math.floor(course.course_fee / 1000) + 'K' : '119K'}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">onwards</span>
                          </div>
                          {course?.original_fee && (
                            <span className="text-sm text-gray-500 line-through">
                              INR {Math.floor(course.original_fee / 1000)}K
                            </span>
                          )}
                          <span className="text-xs text-[#379392] font-semibold bg-[#379392]/10 px-2 py-1 rounded-full">
                            Live Course Price
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-1.5 justify-center">
                        <span className={`text-lg font-bold ${styles.priceColor}`}>
                          {formatPrice(course.course_fee, course.batchPrice)}
                        </span>
                        {course?.original_fee && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatCurrencyPrice(convertPrice(course.original_fee))}
                          </span>
                        )}
                      </div>
                    )}
                    {course?.fee_note && (
                      <span className="text-xs text-gray-500 font-medium block mt-0.5">
                        {course.fee_note}
                      </span>
                    )}
                  </div>
                )}
                
                {/* Display action buttons */}
                {renderActionButtons()}
              </div>
            </div>
          </DownloadBrochureModal>
        </div>
      ) : (
        <div 
          ref={cardRef}
          className={`course-card ${mobileCardStyles} group relative flex flex-col ${coursesPageCompact ? 'min-h-[420px]' : 'min-h-[480px]'} rounded-2xl overflow-hidden 
            border border-gray-200/30 dark:border-gray-800/40 
            bg-white/95 dark:bg-gray-900/95 backdrop-filter backdrop-blur-sm 
            ${isLiveCourse ? 'transition-all duration-300' : ''} 
            ${(isHovered || mobileHoverActive) && isLiveCourse ? 'scale-[1.02] z-10 shadow-2xl' : 'scale-100 z-0 shadow-lg'}
            ${isLiveCourse ? styles.borderHover : ''} ${isLiveCourse ? styles.shadowHover : ''}
            ${isMobile ? (isBlendedCourse ? 'pb-8 last:mb-0' : (isLiveCourse ? 'pb-8 last:mb-0' : 'pb-20 last:mb-0')) : ''}
            ${viewMode === 'grid' ? 'sm:mx-2 md:mx-3' : ''}
            ${isLiveCourse ? 'hover:shadow-2xl' : ''}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          style={isLiveCourse ? tiltStyle : {}}
        >
          {/* View More button - Disabled for live courses (now showing all info upfront) */}

          {/* Close button for mobile hover view */}
          {isMobile && mobileHoverActive && (
            <button 
              onClick={closeMobileHover}
              className={`absolute top-2 right-2 z-30 p-1.5 rounded-full bg-white dark:bg-gray-800 shadow-md ${
                isLiveCourse 
                  ? 'text-[#379392]' 
                  : 'text-indigo-500'
              }`}
              aria-label="Close Details"
            >
              <X size={18} />
            </button>
          )}

          {/* Pre-hover content - Hide when hovering live courses */}
          <div className={`flex flex-col h-full transition-opacity duration-300 ${(isHovered && !isMobile && isLiveCourse) || (mobileHoverActive && isMobile && isLiveCourse) ? 'opacity-0' : 'opacity-100'}`}>
            {/* Updated Image section */}
            <ImageWrapper
              src={course?.course_image || ''}
              alt={course?.course_title || "Course Image"}
              onLoad={handleImageLoad}
              onError={handleImageError}
              priority={isLCP}
              isLCP={isLCP}
              index={index}
              coursesPageCompact={coursesPageCompact}
              isLiveCourse={isLiveCourse}
            />

            {/* Course info - optimized layout with better proportions */}
            <div className={`${mobileContentStyles} flex flex-col ${coursesPageCompact ? 'px-3 pt-2 pb-3 flex-grow' : 'px-5 pt-3 pb-5'} flex-grow justify-between bg-gradient-to-b from-white/30 to-transparent dark:from-gray-900/30`}>
              <div className={`flex flex-col ${coursesPageCompact ? 'items-start justify-start' : 'items-center justify-between'} flex-grow ${coursesPageCompact ? 'py-2 space-y-2' : 'py-2 min-h-[160px]'}`}>
                {/* Course category badge with Self-Paced/Live indicator */}
                <div className={`flex items-center gap-2 ${coursesPageCompact ? 'self-start' : 'mx-auto justify-center'}`}>
                  {course?.course_grade && (
                    <div className={`inline-flex items-center text-xs font-semibold rounded-md px-2.5 py-1 transition-all duration-200 hover:scale-105 ${
                      isLiveCourse ? 'bg-gradient-to-r from-[#379392]/15 to-[#379392]/25 text-[#379392] border border-[#379392]/30 shadow-sm shadow-[#379392]/10' : 'bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-700 dark:from-indigo-900/30 dark:to-indigo-900/40 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-700 shadow-sm shadow-indigo-500/10'
                    }`}>
                      {isLiveCourse ? 
                        <Play size={10} className="mr-1" /> : 
                        <Layers size={10} className="mr-1" />
                      }
                      <span className="text-xs font-semibold">{formatCourseGrade(course?.course_grade)}</span>
                    </div>
                  )}
                  
                  {/* Course type indicator next to grade */}
                  {coursesPageCompact && (isBlendedCourse || isLiveCourse) && (
                    <div className="inline-flex items-center text-xs font-semibold rounded-md px-2.5 py-1 transition-all duration-200 hover:scale-105">
                      {isBlendedCourse ? (
                        <span className="inline-flex items-center text-blue-700 dark:text-blue-300">
                          <Clock size={10} className="mr-1" />
                          Self-Paced
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[#379392]">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></span>
                          Live
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Course title - single-line centered, two-line at top */}
                <h3 className={`${mobileTitleStyles} font-extrabold text-gray-900 dark:text-white leading-tight ${coursesPageCompact ? 'text-left w-full text-lg lg:text-xl tracking-normal hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 cursor-pointer min-h-[48px] flex items-center' : 'text-center mx-auto max-w-[95%] text-base sm:text-lg lg:text-base xl:text-lg min-h-[48px] sm:min-h-[56px] flex items-center justify-center'} ${course?.course_category ? 'mt-0' : 'mt-0'}`}>
                  {coursesPageCompact ? (
                    // Clean title with bracket handling and smart positioning
                    <span className="text-gray-900 dark:text-white line-clamp-2 w-full block">
                      {(() => {
                        const title = course?.course_title || "Course Title";
                        // Check if title contains brackets or parentheses
                        const bracketMatch = title.match(/^(.+?)(\s*[\(\[\{].+?[\)\]\}])(.*)$/);
                        if (bracketMatch) {
                          const [, mainTitle, bracket, afterBracket] = bracketMatch;
                          return (
                            <>
                              <span>{mainTitle}</span>
                              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{bracket}</span>
                              {afterBracket && <span>{afterBracket}</span>}
                            </>
                          );
                        }
                        return title;
                      })()}
                    </span>
                  ) : (
                    <span className="line-clamp-2">{course?.course_title || "Course Title"}</span>
                  )}
                </h3>
                
                {/* Course description - fixed height for consistency */}
                {!isCompact && !hideDescription && (
                  <p className={`text-gray-600 dark:text-gray-400 line-clamp-2 ${coursesPageCompact ? 'text-left w-full text-sm leading-relaxed font-normal opacity-85 min-h-[40px] flex items-start' : 'text-center mx-auto flex items-center justify-center mt-1.5 max-w-[95%] min-h-[40px] sm:min-h-[48px] text-xs sm:text-sm lg:text-xs xl:text-sm'}`}>
                    {courseDescriptionText}
                  </p>
                )}

                {/* Session Count Indicator - moved higher up */}
                {course?.no_of_Sessions && (
                  <div className={`flex items-center ${coursesPageCompact ? 'justify-start min-h-[50px] items-start -mt-1' : 'justify-center mt-2 mb-1'}`}>
                    {isBlendedCourse ? (
                      <div className={`${coursesPageCompact ? 'flex flex-wrap justify-start gap-1' : 'flex flex-col items-center gap-1'}`}>
                        <div className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 whitespace-nowrap border border-purple-200 dark:border-purple-800">
                          <Play size={8} className="mr-1 text-purple-600" />
                          <span className="text-xs font-semibold">{course.no_of_Sessions} Videos</span>
                        </div>
                        <div className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-[#379392]/10 text-[#379392] whitespace-nowrap border border-[#379392]/20">
                          <Users size={8} className="mr-1 text-[#379392]" />
                          <span className="text-xs font-semibold">02 Q&A Live</span>
                        </div>
                      </div>
                    ) : isLiveCourse ? (
                        <div className={`flex flex-wrap items-center gap-1 ${coursesPageCompact ? 'justify-start' : 'justify-center'}`}>
                          <div className="inline-flex items-center px-2 py-0.5 rounded-md text-xs whitespace-nowrap border bg-[#379392]/10 text-[#379392] border-[#379392]/20">
                            <Users size={8} className="mr-1" />
                            <span className="text-xs font-semibold">{course.no_of_Sessions} Live Sessions</span>
                          </div>
                        </div>
                      ) : (
                        <div className="inline-flex items-center px-2 py-0.5 rounded-md text-xs whitespace-nowrap border bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800">
                          <div className="w-2 h-2 mr-1 flex items-center justify-center">
                            {content.sessionIcon}
                          </div>
                          <span className="text-xs font-semibold">{course.no_of_Sessions} sessions</span>
                        </div>
                      )}
                  </div>
                )}
              </div>

              {/* Course Duration/Learning Experience - optimized for space */}
              {showDuration && course?.course_duration && !coursesPageCompact && (
                <div className={`mx-auto ${isMobile ? 'mb-14' : 'mb-2'} w-full mt-2`}>
                  {React.isValidElement(course.course_duration) ? (
                    <div className={`flex items-center justify-center ${styles.durationBoxBg} p-3 rounded-lg`}>
                      {course.course_duration}
                    </div>
                  ) : (
                    <div className={`flex items-center ${styles.durationBoxBg} p-2 rounded-lg justify-center`}>
                      <Clock size={16} className={`mr-2 ${styles.durationIconColor} flex-shrink-0 lg:w-4 lg:h-4`} />
                      <div className="text-center">
                        <span className={`${styles.durationTextColor} font-semibold text-xs sm:text-sm lg:text-xs xl:text-sm`}>
                          {isLiveCourse ? 'Course Duration' : 'Learning Experience'}
                        </span>
                        <p className="text-gray-700 dark:text-gray-300 font-medium text-xs sm:text-sm lg:text-xs xl:text-sm mt-0.5">
                          {isBlendedCourse ? 'Self-paced' : formatRangeToText(course?.duration_range || extractMonthsOnly(course?.course_duration))}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Self-Paced badge and Price section - optimized for courses page */}
              {!hidePrice && (
                <div className="space-y-2">
                  
                  {/* Price section - Enhanced highlighting for all courses */}
                  <div className={coursesPageCompact ? 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 text-center' : `mt-2 mb-2 py-3 px-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-gradient-to-r ${
                    isLiveCourse ? 'from-[#379392]/10 to-[#379392]/5 border-[#379392]/30' : 'from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/10 border-indigo-200 dark:border-indigo-700'
                  }`}>
                    <div className="flex items-center justify-center">
                      <div className="flex items-baseline gap-1.5 text-center">
                        <span className={`text-lg sm:text-xl lg:text-lg xl:text-xl font-extrabold ${isLiveCourse ? 'text-[#379392]' : 'text-indigo-700 dark:text-indigo-400'}`}>
                          {formatPrice(course.course_fee, course.batchPrice)}
                        </span>
                        {isLiveCourse && (
                          <span className="text-xs lg:text-xs text-gray-500 font-medium">onwards</span>
                        )}
                        {course?.original_fee && (
                          <span className="text-xs text-gray-500 line-through ml-1">
                            {formatCurrencyPrice(convertPrice(course.original_fee))}
                          </span>
                        )}
                      </div>
                      {(course?.isFree === true || (course?.prices && course.prices.length > 0 && course.prices[0]?.early_bird_discount !== undefined && course.prices[0].early_bird_discount > 0)) && (
                        <div className="ml-2">
                          {course?.isFree === true ? (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium">
                              <Sparkles size={10} className="mr-1" />
                              Free
                            </span>
                          ) : (
                            course?.prices && course.prices.length > 0 && course.prices[0]?.early_bird_discount !== undefined && course.prices[0].early_bird_discount > 0 && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-medium">
                                <Tag size={10} className="mr-1" />
                                {course.prices[0].early_bird_discount}% off
                              </span>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Explore Course button for blended and live courses in pre-hover state */}
              {(isBlendedCourse || isLiveCourse) && (
                <div className="mt-3 w-full">
                  <button
                    onClick={navigateToCourse}
                    onMouseEnter={() => setIsHoveringCTA(true)}
                    onMouseLeave={() => setIsHoveringCTA(false)}
                    className="w-full px-4 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2
                      border-2 border-[#379392] text-[#379392] bg-transparent hover:bg-[#379392] hover:text-white dark:hover:text-white"
                  >
                    Explore Course
                    <ArrowUpRight size={16} className="transition-transform" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Hover content - for live courses only */}
          <div className={`hover-content absolute inset-0 bg-white dark:bg-gray-900 ${isMobile ? 'p-6' : 'p-5'} flex flex-col transition-opacity duration-300 ${
            isMobile ? 'overflow-y-auto' : ''
          } h-full ${
            (isHovered && !isMobile && isLiveCourse) || (mobileHoverActive && isMobile && isLiveCourse) ? 'opacity-100 z-20' : 'opacity-0 -z-10'
          }`}>
            {/* Course details */}
            <div className={`${isMobile ? 'mb-3' : 'mb-2'} flex items-center justify-center py-2 md:py-3`}>
              <h3 className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-center px-2 py-2 rounded-md ${
                isLiveCourse 
                  ? 'bg-[#379392]/10 text-[#379392]' 
                  : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
              } max-w-[95%] leading-tight line-clamp-2 min-h-[3rem] flex items-center justify-center`}>
                {course?.course_title}
              </h3>
            </div>
            
            {/* Updated hover content structure for both course types with small pointers */}
            <div className={`flex flex-col ${isMobile ? 'gap-3 mb-4' : 'gap-2 mb-3'} items-stretch`}>
              
              {/* Required Effort - for live courses only */}
              {isLiveCourse && course?.effort_hours && (
                <div className={`flex items-start ${isMobile ? 'p-3' : 'p-2.5'} border border-gray-100 dark:border-gray-800 rounded-lg w-full`}>
                  <Target size={isMobile ? 18 : 16} className="mt-0.5 mr-3 text-yellow-500 dark:text-yellow-400 flex-shrink-0" />
                  <div className="flex flex-col">
                    <p className="font-bold text-gray-900 dark:text-white text-sm">
                      {course.effort_hours} hrs/week
                    </p>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">Required Effort</p>
                  </div>
                </div>
              )}
              
              {/* Course Features - Compact Display */}
              <div className={`${isMobile ? 'p-3' : 'p-2.5'} border border-gray-100 dark:border-gray-800 rounded-lg w-full`}>
                <div className="flex flex-col w-full">
                  <div className="flex flex-wrap gap-1.5 justify-start">
                    {/* Different features based on course type */}
                    {isBlendedCourse ? (
                      /* Blended course specific features */
                      <>
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-medium">
                          <CheckCircle size={10} className="mr-1" />
                          Assignments
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-medium">
                          <Users size={10} className="mr-1" />
                          2 Live QnA Sessions
                        </span>
                      </>
                    ) : (
                      /* Standard features for non-blended courses */
                      <>
                        {/* Always show Projects & Assignments for live courses */}
                        {isLiveCourse && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-medium">
                            <CheckCircle size={10} className="mr-1" />
                            Projects & Assignments
                          </span>
                        )}
                        
                        {/* Debug and test Corporate Internship detection */}
                        {isLiveCourse && (() => {
                          const duration = course?.course_duration;
                          let durationStr = '';
                          
                          // Handle different duration formats with enhanced object detection
                          if (typeof duration === 'string') {
                            durationStr = duration.toLowerCase();
                          } else if (duration && typeof duration === 'object') {
                            // Enhanced object handling for React elements and objects
                            if (React.isValidElement(duration)) {
                              // For React elements, recursively extract text content
                              const extractTextFromElement = (element: any): string => {
                                if (!element) {
                                  return '';
                                }
                                if (typeof element === 'string') {
                                  return element;
                                }
                                if (React.isValidElement<{ children: React.ReactNode }>(element)) {
                                  const { children } = element.props;
                                  if (typeof children === 'string') {
                                    return children;
                                  }
                                  if (Array.isArray(children)) {
                                    return children.map(extractTextFromElement).join(' ');
                                  }
                                  if (children) {
                                    return extractTextFromElement(children);
                                  }
                                }
                                return '';
                              };
                              durationStr = extractTextFromElement(duration).toLowerCase();
                            } else {
                              // For plain objects, try different extraction methods
                              const objectStr = JSON.stringify(duration);
                              // Extract quoted strings that might contain duration info
                              const quotedStrings = objectStr.match(/"[^"]*"/g) || [];
                              const textContent = quotedStrings.join(' ').replace(/"/g, '');
                              durationStr = textContent.toLowerCase() || objectStr.toLowerCase();
                            }
                          }
                          
                          const is18Month = durationStr && 
                            (durationStr.includes('18 month') || 
                             durationStr.includes('eighteen month') ||
                             durationStr.includes('18month') ||
                             durationStr.includes('18-month') ||
                             durationStr.includes('72 week') ||
                             durationStr.includes('72week') ||
                             durationStr.includes('"18') ||
                             durationStr.includes('18"') ||
                             /18\s*months?/i.test(durationStr));
                          
                          return is18Month && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-xs font-medium">
                              <TrendingUp size={10} className="mr-1" />
                              Corporate Internship
                            </span>
                          );
                        })()}
                      </>
                    )}
                    
                    {/* Job Guarantee for 18-month courses with same detection logic */}
                    {isLiveCourse && (() => {
                      const duration = course?.course_duration;
                      let durationStr = '';
                      
                      // Handle different duration formats with enhanced object detection
                      if (typeof duration === 'string') {
                        durationStr = duration.toLowerCase();
                      } else if (duration && typeof duration === 'object') {
                        // Enhanced object handling for React elements and objects
                        if (React.isValidElement(duration)) {
                          // For React elements, recursively extract text content
                          const extractTextFromElement = (element: any): string => {
                            if (!element) {
                              return '';
                            }
                            if (typeof element === 'string') {
                              return element;
                            }
                            if (React.isValidElement<{ children: React.ReactNode }>(element)) {
                              const { children } = element.props;
                              if (typeof children === 'string') {
                                return children;
                              }
                              if (Array.isArray(children)) {
                                return children.map(extractTextFromElement).join(' ');
                              }
                              if (children) {
                                return extractTextFromElement(children);
                              }
                            }
                            return '';
                          };
                          durationStr = extractTextFromElement(duration).toLowerCase();
                        } else {
                          // For plain objects, try different extraction methods
                          const objectStr = JSON.stringify(duration);
                          // Extract quoted strings that might contain duration info
                          const quotedStrings = objectStr.match(/"[^"]*"/g) || [];
                          const textContent = quotedStrings.join(' ').replace(/"/g, '');
                          durationStr = textContent.toLowerCase() || objectStr.toLowerCase();
                        }
                      }
                      
                      const is18Month = durationStr && 
                        (durationStr.includes('18 month') || 
                         durationStr.includes('eighteen month') ||
                         durationStr.includes('18month') ||
                         durationStr.includes('18-month') ||
                         durationStr.includes('72 week') ||
                         durationStr.includes('72week') ||
                         durationStr.includes('"18') ||
                         durationStr.includes('18"') ||
                         /18\s*months?/i.test(durationStr));
                      
                      return is18Month && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-medium">
                          <Award size={10} className="mr-1" />
                          <span className="text-left leading-tight">
                            Job Guarantee<br/>
                            (18 Month Course Only)
                          </span>
                        </span>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Pricing section - Added for hover state - Enhanced highlighting */}
            {!hidePrice && (
              <div className={`mt-2 mb-2 py-3 px-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-gradient-to-r ${
                isLiveCourse ? 'from-[#379392]/10 to-[#379392]/5 border-[#379392]/30' : 'from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/10 border-indigo-200 dark:border-indigo-700'
              }`}>
                <div className="flex items-center justify-center">
                  <div className="flex items-baseline gap-1.5 text-center">
                    <span className={`text-lg font-extrabold ${isLiveCourse ? 'text-[#379392]' : 'text-indigo-700 dark:text-indigo-400'}`}>
                      {formatPrice(course.course_fee, course.batchPrice)}
                    </span>
                    {isLiveCourse && (
                      <span className="text-xs text-gray-500 font-medium">onwards</span>
                    )}
                    {course?.original_fee && (
                      <span className="text-xs text-gray-500 line-through ml-1">
                        {formatCurrencyPrice(convertPrice(course.original_fee))}
                      </span>
                    )}
                  </div>
                  {(course?.isFree === true || (course?.prices && course.prices.length > 0 && course.prices[0]?.early_bird_discount !== undefined && course.prices[0].early_bird_discount > 0)) && (
                    <div className="ml-2">
                      {course?.isFree === true ? (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium">
                          <Sparkles size={10} className="mr-1" />
                          Free
                        </span>
                      ) : (
                        course?.prices && course.prices.length > 0 && course.prices[0]?.early_bird_discount !== undefined && course.prices[0].early_bird_discount > 0 && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-medium">
                            <Tag size={10} className="mr-1" />
                            {course.prices[0].early_bird_discount}% off
                          </span>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Explore Course button for blended courses in hover state */}
            {isBlendedCourse && (
              <div className="mt-3 w-full">
                <button
                  onClick={navigateToCourse}
                  onMouseEnter={() => setIsHoveringCTA(true)}
                  onMouseLeave={() => setIsHoveringCTA(false)}
                  className="w-full px-4 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2
                    border-2 border-[#379392] text-[#379392] bg-transparent hover:bg-[#379392] hover:text-white dark:hover:text-white"
                >
                  Explore Course
                  <ArrowUpRight size={16} className="transition-transform" />
                </button>
              </div>
            )}
            
            {/* Action buttons - consistent across both types with style variations */}
            <div className={`mt-auto ${isMobile ? 'pt-1' : 'pt-0.5'} flex flex-col items-center w-full`}>
              <div className={`${isLiveCourse ? '' : 'grid grid-cols-2 gap-2'} mb-2 w-full`}>
                {/* Only show brochure button for non-live courses */}
                {!isLiveCourse && (
                  <button
                    onClick={handleBrochureClick}
                    onMouseEnter={() => setIsHoveringCTA(true)}
                    onMouseLeave={() => setIsHoveringCTA(false)}
                    className="px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 
                      border-2 border-indigo-500 text-indigo-600 bg-transparent hover:bg-indigo-500 hover:text-white dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-400 dark:hover:text-white"
                  >
                    <Download size={16} className="transition-colors" />
                    Brochure
                  </button>
                )}
                
                {/* Different button styles based on course type - All stroke style with filled hover */}
                {isBlendedCourse ? (
                  <button
                    onClick={navigateToCourse}
                    onMouseEnter={() => setIsHoveringCTA(true)}
                    onMouseLeave={() => setIsHoveringCTA(false)}
                    className="px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5
                      border-2 border-[#379392] text-[#379392] bg-transparent hover:bg-[#379392] hover:text-white dark:hover:text-white"
                  >
                    Explore Course
                    <ArrowUpRight size={16} className="group-hover:rotate-12 transition-transform" />
                  </button>
                ) : (
                  <button
                    onClick={navigateToCourse}
                    onMouseEnter={() => setIsHoveringCTA(true)}
                    onMouseLeave={() => setIsHoveringCTA(false)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all text-white flex items-center justify-center gap-1.5
                     ${isLiveCourse 
                      ? 'border-2 border-[#379392] text-[#379392] bg-transparent hover:bg-[#379392] hover:text-white dark:hover:text-white w-full' 
                      : 'border-2 border-indigo-500 text-indigo-600 bg-transparent hover:bg-indigo-500 hover:text-white dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-400 dark:hover:text-white'
                    }`}
                  >
                    {isLiveCourse ? 'Explore Course' : 'Details'}
                    <ArrowUpRight size={16} className="group-hover:rotate-12 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Add animation styles to document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = animationStyles + `
    /* Additional text importance styles */
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    /* Enhanced text importance */
    h3 {
      text-shadow: 0 1px 2px rgba(0,0,0,0.05);
      letter-spacing: -0.01em;
    }
    
    /* Improved contrast for important text */
    .font-extrabold {
      letter-spacing: -0.02em;
    }

    @keyframes shine {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }

    .animate-shine {
      animation: shine 1.5s infinite;
    }
  `;
  document.head.appendChild(style);
}

// Add glassmorphic styles
const addGlassmorphicStyles = () => {
  const style = document.createElement('style');
  style.id = 'glassmorphic-styles';
  style.textContent = `
    .glassmorphic-card {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    }
    
    .dark .glassmorphic-card {
      background: rgba(15, 23, 42, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    }
    
    .glassmorphic-card:hover {
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 255, 255, 0.2);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
      transform: translateY(-2px);
    }
    
    .dark .glassmorphic-card:hover {
      background: rgba(15, 23, 42, 0.16);
      border-color: rgba(255, 255, 255, 0.12);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
    }
  `;
  document.head.appendChild(style);
};

// Add a safe rating display function
const safeRatingDisplay = (rating: any) => {
  // Check if rating exists and is a number
  if (rating === undefined || rating === null) {
    return '0.0';
  }
  
  // Try to parse the rating as a number if it's not already
  const ratingNumber = typeof rating === 'number' ? rating : parseFloat(rating);
  
  // Check if parsing was successful
  if (isNaN(ratingNumber)) {
    return '0.0';
  }
  
  // Return formatted rating
  return ratingNumber.toFixed(1);
};

export default CourseCard;