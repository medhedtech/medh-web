"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DownloadBrochureModal from "@/components/shared/download-broucher";
import image6 from "@/assets/images/courses/image6.png";
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
import { useCurrency } from '@/contexts/CurrencyContext';
import { isFreePrice } from '@/utils/priceUtils';
import { shimmer, toBase64 } from '@/utils/imageUtils';

// Text adaptation hook for responsive text
const useResponsiveText = (text, maxLength = {xs: 60, sm: 80, md: 120, lg: 180}) => {
  const [windowWidth, setWindowWidth] = useState(0);
  
  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };
      
      window.addEventListener('resize', handleResize);
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

// Add new ImageWrapper component for consistent image handling
const ImageWrapper = ({ src, alt, onLoad, onError, priority = false }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = (e) => {
    setIsLoading(false);
    onLoad?.(e);
  };

  const handleError = (e) => {
    setIsLoading(false);
    setHasError(true);
    onError?.(e);
  };

  return (
    <div className="relative w-full aspect-
    min-h-[160px] sm:min-h-[140px] md:min-h-[150px] bg-gray-100 dark:bg-gray-800/50 overflow-hidden rounded-t-xl group">
      {/* Skeleton loader */}
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800" />
      )}

      {/* Actual image */}
      <Image
        src={hasError ? image6 : src}
        alt={alt}
        fill
        className={`object-cover transition-all duration-300 group-hover:scale-105 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        quality={90}
        priority={priority}
        placeholder="blur"
        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
        onLoad={handleLoad}
        onError={handleError}
      />

      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 dark:from-black/20 dark:to-black/40 transition-opacity duration-300 group-hover:opacity-70" />
      
      {/* Optional shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-transparent via-white/10 to-transparent transform translate-x-full animate-shine" />
    </div>
  );
};

const CourseCard = ({ 
  course = {}, 
  onShowRelated = () => {},
  showRelatedButton = false,
  variant = "standard",
  classType = "",
  viewMode = "grid",
  isCompact = false,
  preserveClassType = false,
  showDuration = true,
  hidePrice = false,
  hideDescription = true
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
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
  
  const cardRef = useRef(null);
  const router = useRouter();
  const { convertPrice, formatPrice: formatCurrencyPrice } = useCurrency();

  // Add state for batch/individual price toggle if card supports interaction
  const [selectedPricing, setSelectedPricing] = useState("individual");

  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimeout = useRef(null);

  // Create a new state for mobile touch-activated "hover"
  const [mobileHoverActive, setMobileHoverActive] = useState(false);

  // Check if device is mobile
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
    
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Open mobile popup
  const openMobilePopup = (e) => {
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
  const closeMobilePopup = (e) => {
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

  // Mouse and touch interaction handlers
  const resetTilt = useCallback(() => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
      transition: 'transform 0.5s ease'
    });
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current || !isHovered) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    const tiltX = (y - 0.5) * 10;
    const tiltY = (0.5 - x) * 10;
    
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
      transition: 'transform 0.1s ease'
    });

    setTooltipPosition({
      x: rect.right,
      y: rect.top
    });
  }, [isHovered]);

  const handleMouseEnter = useCallback(() => {
    if (!isMobile) {
      setIsHovered(true);
      tooltipTimeout.current = setTimeout(() => {
        setShowTooltip(true);
      }, 500);
    }
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    if (!isMobile) {
      setIsHovered(false);
      setShowTooltip(false);
      resetTilt();
      if (tooltipTimeout.current) {
        clearTimeout(tooltipTimeout.current);
      }
    }
  }, [isMobile, resetTilt]);

  const openMobileHover = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setMobileHoverActive(true);
  }, []);

  const closeMobileHover = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setMobileHoverActive(false);
  }, []);

  // Cleanup effect for tooltip timeout
  useEffect(() => {
    return () => {
      if (tooltipTimeout.current) {
        clearTimeout(tooltipTimeout.current);
      }
    };
  }, []);

  // Update the formatPrice function to better handle batch pricing
  const formatPrice = (price, batchPrice) => {
    // Check if the course is explicitly marked as free
    if (course?.isFree === true) return "Free";
    
    // Get currency from course prices if available
    const currency = course?.prices && course.prices.length > 0 && course.prices[0].currency 
      ? course.prices[0].currency 
      : undefined;
    
    // If we have a prices array, use the first price object
    if (course?.prices && course.prices.length > 0) {
      const priceObj = course.prices[0];
      
      // Check if both individual and batch prices are 0
      if (priceObj.individual === 0 && priceObj.batch === 0) {
        return "Free";
      }
      
      // If batch price is available and less than individual price, use it
      if (priceObj.batch && priceObj.batch < priceObj.individual) {
        return formatCurrencyPrice(convertPrice(priceObj.batch), true, currency);
      }
      
      // Otherwise use individual price
      return formatCurrencyPrice(convertPrice(priceObj.individual), true, currency);
    }
    
    // Fallback to the provided price and batchPrice parameters
    if (isFreePrice(price) && (!batchPrice || isFreePrice(batchPrice))) return "Free";
    
    // If batch price is available and less than individual price, use it
    if (batchPrice && !isFreePrice(batchPrice) && batchPrice < price) {
      return formatCurrencyPrice(convertPrice(batchPrice), true, currency);
    }
    
    // If this is a simple price display with no batch option
    if (!batchPrice || batchPrice === price) {
      // Check if price already includes "onwards" text
      if (typeof price === 'string' && price.includes('Onwards')) {
        return formatCurrencyPrice(convertPrice(price.replace(' Onwards', '')), true, currency);
      }
      return formatCurrencyPrice(convertPrice(price), true, currency);
    }
    
    // Handle the case where we have both individual and batch pricing
    const formattedMainPrice = formatCurrencyPrice(convertPrice(price), true, currency);
    
    // Return appropriate price based on selected pricing
    return formattedMainPrice;
  };

  // Calculate discount percentage for batch pricing
  const calculateBatchDiscount = (individualPrice, batchPrice) => {
    if (!individualPrice || !batchPrice || individualPrice <= 0 || batchPrice <= 0) return 0;
    return Math.round(((individualPrice - batchPrice) / individualPrice) * 100);
  };

  // Format duration for display
  const formatDuration = (duration) => {
    if (!duration) return "Self-paced";
    
    // Handle special case for combined formats like "0 months 3 weeks"
    if (typeof duration === 'string' && duration.includes(' ')) {
      // Check if it contains combined duration parts
      const parts = duration.toLowerCase().split(' ');
      
      // Extract values and units
      const durationParts = [];
      let totalWeeks = 0;
      
      // Process each part of the duration string
      for (let i = 0; i < parts.length; i += 2) {
        if (i + 1 >= parts.length) break;
        
        const value = parseFloat(parts[i]);
        const unit = parts[i + 1].replace(/s$/, ''); // Remove plural 's' if present
        
        if (!isNaN(value) && value > 0) {
          switch (unit) {
            case 'year':
              durationParts.push(`${Math.round(value)} ${Math.round(value) === 1 ? 'Year' : 'Years'}`);
              totalWeeks += value * 52;
              break;
            case 'month':
              durationParts.push(`${Math.round(value)} ${Math.round(value) === 1 ? 'Month' : 'Months'}`);
              totalWeeks += value * 4;
              break;
            case 'week':
              durationParts.push(`${Math.round(value)} ${Math.round(value) === 1 ? 'Week' : 'Weeks'}`);
              totalWeeks += value;
              break;
            case 'day':
              durationParts.push(`${Math.round(value)} ${Math.round(value) === 1 ? 'Day' : 'Days'}`);
              totalWeeks += value / 7;
              break;
            case 'hour':
              durationParts.push(`${Math.round(value)} ${Math.round(value) === 1 ? 'Hour' : 'Hours'}`);
              // Don't add to totalWeeks for hours
              break;
          }
        }
      }
      
      // Return combined duration parts
      if (durationParts.length > 0) {
        // If all values are zero, find the largest non-zero unit
        if (durationParts.length === 0) {
          return "Self-paced";
        }
        
        // For combined formats, display the significant parts
        const formattedDuration = durationParts.join(' ');
        
        // Only show weeks equivalent if it makes sense (at least 1 week and mixed units)
        if (totalWeeks >= 1 && durationParts.length > 1) {
          return `${formattedDuration}`;
        }
        
        return formattedDuration;
      }
    }
    
    // Original parsing for simple formats
    const durationLower = duration.toString().toLowerCase();
    let formattedDuration = "";
    let totalWeeks = 0;
    
    if (durationLower.includes("week")) {
      // Extract numeric value from duration string with regex
      const weekMatches = durationLower.match(/(\d+[\.\d]*)/);
      const weeks = weekMatches ? parseFloat(weekMatches[0]) : 1;
      totalWeeks = weeks;
      
      // Format the primary duration display
      if (Math.round(weeks) === 1) {
        formattedDuration = "1 Week";
      } else if (weeks < 1) {
        const days = Math.round(weeks * 7);
        formattedDuration = `${days} ${days === 1 ? 'Day' : 'Days'}`;
      } else {
        formattedDuration = `${Math.round(weeks)} Weeks`;
      }
      
      // For weeks, we don't need to show equivalent weeks
      return formattedDuration;
    } else if (durationLower.includes("month")) {
      // Improved month parsing with regex
      const monthMatches = durationLower.match(/(\d+[\.\d]*)/);
      const months = monthMatches ? parseFloat(monthMatches[0]) : 1;
      totalWeeks = months * 4; // Approximate weeks in months
      
      if (Math.round(months) === 1) {
        formattedDuration = "1 Month";
      } else {
        formattedDuration = `${Math.round(months)} Months`;
      }
      
      // Add equivalent in weeks
      return `${formattedDuration} (${Math.round(totalWeeks)} weeks)`;
    } else if (durationLower.includes("day")) {
      // Add parsing for days
      const dayMatches = durationLower.match(/(\d+[\.\d]*)/);
      const days = dayMatches ? parseFloat(dayMatches[0]) : 1;
      totalWeeks = days / 7;
      
      formattedDuration = `${Math.round(days)} ${Math.round(days) === 1 ? 'Day' : 'Days'}`;
      
      // Only show week equivalent if it's significant (more than 1 week)
      if (totalWeeks >= 1) {
        return `${formattedDuration} (${Math.round(totalWeeks)} weeks)`;
      }
      return formattedDuration;
    } else if (durationLower.includes("hour")) {
      // Add parsing for hours
      const hourMatches = durationLower.match(/(\d+[\.\d]*)/);
      const hours = hourMatches ? parseFloat(hourMatches[0]) : 1;
      
      formattedDuration = `${Math.round(hours)} ${Math.round(hours) === 1 ? 'Hour' : 'Hours'}`;
      return formattedDuration; // Don't convert hours to weeks
    }
    
    // Check if duration is a pure number (assumes weeks)
    if (/^\d+$/.test(duration)) {
      const numValue = parseInt(duration);
      totalWeeks = numValue;
      return `${numValue} ${numValue === 1 ? 'Week' : 'Weeks'}`;
    }
    
    return duration;
  };

  const navigateToCourse = () => {
    // For live interactive courses, we use the custom URL
    if (course?.custom_url) {
      window.location.href = course.custom_url;
    } 
    // For other courses, we navigate to the course details page
    else if (course?._id) {
      window.open(`/course-details/${course._id}`, '_blank');
    }
  };

  // Determine enrollment status label
  const getEnrollmentStatus = () => {
    if (course?.enrolled_students > 100) return "High demand";
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
    if (classType === 'blended_courses') {
      return {
        label: "Classes",
        value: course?.no_of_Sessions || "N/A"
      };
    }
    return {
      label: "Sessions",
      value: course?.no_of_Sessions || "N/A"
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
  const handleLikeClick = (e) => {
    e.stopPropagation(); // Prevent card click
    setIsLiked(!isLiked);
    setLikeAnimation(true);
    setTimeout(() => setLikeAnimation(false), 1000);
    // Here you would typically call an API to save the liked status
  };

  // Handle save/bookmark course
  const handleSaveClick = (e) => {
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
  const adaptedDescription = useResponsiveText(course?.course_description, {xs: 80, sm: 120, md: 160, lg: 200});

  // Determine the effective class type based on preserveClassType flag
  const getEffectiveClassType = () => {
    // If preserveClassType is true, use the course's own class_type
    // Otherwise, override with the classType prop if provided
    return preserveClassType ? (course.class_type || "") : (classType || course.class_type || "");
  };

  // Updated to use the effective class type
  const isLiveCourse = getEffectiveClassType().toLowerCase() === 'live';
  const isBlendedCourse = getEffectiveClassType().toLowerCase() === 'blended';

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
    // Default to blended course styles
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
      durationBoxBg: 'bg-[#379392]/5',
      durationIconColor: 'text-indigo-500',
      durationTextColor: 'text-[#379392]',
      priceColor: 'text-indigo-600 dark:text-indigo-400'
    };
  };

  const styles = getCourseTypeStyles();

  // Get course type specific content
  const getCourseTypeContent = () => {
    if (isLiveCourse) {
      return {
        tag: 'Live',
        sessionLabel: 'Live Sessions',
        durationLabel: 'Live Interactive',
        scheduleInfo: course?.schedule || 'Flexible Schedule',
        instructorLabel: 'Live Instructor',
        priceLabel: 'Per Session'
      };
    }
    // Default to blended course content
    return {
      tag: 'Blended',
      sessionLabel: 'Self-Paced Classes',
      durationLabel: 'Self-Paced Learning',
      scheduleInfo: 'Learn at your own pace',
      instructorLabel: 'Course Instructor',
      priceLabel: 'Full Course'
    };
  };

  const content = getCourseTypeContent();

  // Check if this is one of the special courses that should show internship
  const hasInternshipOption = course?.course_title && (
    course.course_title.toLowerCase().includes('ai & data science') ||
    course.course_title.toLowerCase().includes('artificial intelligence') ||
    course.course_title.toLowerCase().includes('digital marketing')
  );

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
      aspect-[16/10]
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

  const mobileTitleStyles = `
    ${isMobile ? `
      text-[15px]
      leading-snug
      font-semibold
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

  // Update card className to use dynamic styles
  return (
    <div className="relative">
      <div 
        ref={cardRef}
        className={`course-card ${mobileCardStyles} group relative flex flex-col h-full rounded-xl overflow-hidden 
          border border-gray-200/20 dark:border-gray-800/40 
          bg-white/90 dark:bg-gray-900/90 backdrop-filter backdrop-blur-sm 
          transition-all duration-300 
          ${isHovered || mobileHoverActive ? 'scale-[1.02] z-10 shadow-xl' : 'scale-100 z-0 shadow-md'}
          ${styles.borderHover} ${styles.shadowHover} ${isLiveCourse ? styles.borderLeft : ''}
          ${isMobile ? 'pb-20 last:mb-0' : ''}
          ${viewMode === 'grid' ? 'sm:mx-2 md:mx-3' : ''}
          hover:shadow-2xl`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        style={tiltStyle}
      >
        {/* Course type indicator tag */}
        {getEffectiveClassType() && (!isMobile || !mobileHoverActive) && (
          <div className={`absolute top-2 right-2 z-20 px-2.5 py-1 rounded-full text-xs font-bold 
            ${styles.tagBg} ${styles.tagText}`}>
            {isLiveCourse ? 'Live' : 'Self-Paced'}
          </div>
        )}

        {/* View More button for mobile */}
        {isMobile && !mobileHoverActive && (
          <button 
            onClick={openMobileHover}
            className={`${mobileButtonStyles} ${
              isLiveCourse 
                ? 'bg-[#379392]/90 text-white hover:bg-[#379392]' 
                : 'bg-indigo-500/90 text-white hover:bg-indigo-500'
            }`}
          >
            View More
            <ArrowUpRight size={14} className="text-white" />
          </button>
        )}

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

        {/* Pre-hover content */}
        <div className={`flex flex-col h-full transition-opacity duration-300 ${(isHovered && !isMobile) || (mobileHoverActive && isMobile) ? 'opacity-0' : 'opacity-100'}`}>
          {/* Updated Image section */}
          <ImageWrapper
            src={course?.course_image || image6}
            alt={course?.course_title || "Course Image"}
            onLoad={handleImageLoad}
            onError={handleImageError}
            priority={true}
          />

          {/* Course info - consistent style for both Live and Blended */}
          <div className={`${mobileContentStyles} flex flex-col p-4 flex-grow justify-between`}>
            <div className="flex flex-col items-center justify-center flex-grow py-2 min-h-[100px]">
              {/* Course category badge */}
              {course?.course_grade && (
                <div className={`inline-flex mb-2 items-center text-xs font-semibold rounded-full px-3 py-1 ${
                  isLiveCourse ? 'bg-[#379392]/10 text-[#379392]' : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                } mx-auto`}>
                  {isLiveCourse ? 
                    <Play size={14} className="mr-1.5" /> : 
                    <Layers size={14} className="mr-1.5" />
                  }
                  <span>{course?.course_grade}</span>
                </div>
              )}

              {/* Course title - optimized spacing */}
              <h3 className={`${mobileTitleStyles} text-base font-bold text-gray-900 dark:text-white line-clamp-2 text-center mx-auto max-w-[95%] ${course?.course_category ? 'mt-1.5' : 'mt-0'}`}>
                {course?.course_title || "Course Title"}
              </h3>
              
              {/* Course description - optimized spacing */}
              {!isCompact && !hideDescription && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1.5 line-clamp-2 text-center mx-auto max-w-[95%]">
                  {course?.course_description}
                </p>
              )}
            </div>

            {/* Course Duration/Learning Experience - adjusted spacing */}
            {showDuration && course?.course_duration && (
              <div className={`mx-auto ${isMobile ? 'mb-14' : 'mb-2'} w-full mt-2`}>
                {React.isValidElement(course.course_duration) ? (
                  <div className={`flex items-start ${styles.durationBoxBg} p-3 rounded-lg`}>
                    {course.course_duration}
                  </div>
                ) : (
                  <div className={`flex items-center ${styles.durationBoxBg} p-3 rounded-lg justify-center`}>
                    <Clock size={18} className={`mr-2.5 ${styles.durationIconColor} flex-shrink-0`} />
                    <div className="text-center">
                      <span className={`${styles.durationTextColor} font-semibold text-sm`}>
                        {isLiveCourse ? 'Course Duration' : 'Learning Experience'}
                      </span>
                      <p className="text-gray-700 dark:text-gray-300 font-medium text-sm mt-0.5">
                        {course?.duration_range || formatDuration(course?.course_duration)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Price section - adjusted spacing */}
            {!hidePrice && (
              <div className="mt-1.5 text-center">
                <div className="flex items-baseline gap-1.5 justify-center">
                  <span className={`text-lg font-bold ${styles.priceColor}`}>
                    {formatPrice(course.course_fee, course.batchPrice) }
                  </span>
                  {course?.original_fee && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatCurrencyPrice(convertPrice(course.original_fee))}
                    </span>
                  )}
                  {course?.price_suffix && course.batchPrice && (
                    <span className="text-sm text-gray-500 font-medium">
                      {course.price_suffix}
                    </span>
                  )}
                </div>
                {course?.fee_note && (
                  <span className="text-xs text-gray-500 font-medium block mt-0.5">
                    {course.fee_note}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Hover content - similar structure for both course types */}
        <div className={`hover-content absolute inset-0 bg-white dark:bg-gray-900 ${isMobile ? 'p-5' : 'p-4'} flex flex-col transition-opacity duration-300 ${
          isMobile ? 'overflow-y-auto' : 'overflow-hidden'
        } max-h-full ${
          (isHovered && !isMobile) || (mobileHoverActive && isMobile) ? 'opacity-100 z-20' : 'opacity-0 -z-10'
        }`}>
          {/* Course details */}
          <div className={`${isMobile ? 'mb-4' : 'mb-3'} flex items-center justify-center py-3 md:py-4`}>
            <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-extrabold text-gray-900 dark:text-white line-clamp-2 text-center max-w-[90%]`}>
              {course?.course_title}
            </h3>
          </div>

          {/* Consistent hover content structure for both course types */}
          <div className={`flex flex-col ${isMobile ? 'gap-4 mb-4' : 'gap-3 mb-3'} items-stretch`}>
            {/* Course Duration / Learning Experience Box */}
            {/* <div className={`flex items-start ${styles.durationBoxBg} ${isMobile ? 'p-4' : 'p-3'} rounded-lg w-full`}>
              <Clock size={isMobile ? 20 : 18} className={`mt-0.5 mr-3 ${styles.durationIconColor} flex-shrink-0`} />
              <div className="flex flex-col">
                <span className={`${styles.durationTextColor} font-bold text-sm`}>
                  {isLiveCourse ? 'Course Duration' : 'Learning Experience'}
                </span>
                <p className="text-gray-700 dark:text-gray-300 font-medium text-sm mt-0.5">
                  {course?.duration_range || formatDuration(course?.course_duration)}
                </p>
              </div>
            </div> */}
            
            {/* Effort Hours - for both types */}
            {course?.effort_hours && (
              <div className={`flex items-start ${isMobile ? 'p-3.5' : 'p-3'} border border-gray-100 dark:border-gray-800 rounded-lg w-full`}>
                <Target size={isMobile ? 18 : 16} className="mt-0.5 mr-3 text-yellow-500 dark:text-yellow-400 flex-shrink-0" />
                <div className="flex flex-col">
                  <p className="font-bold text-gray-900 dark:text-white text-sm">
                    {course.effort_hours} {!isBlendedCourse && 'hrs/week'}
                  </p>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">Required Effort</p>
                </div>
              </div>
            )}
            
            {/* Sessions - for both types */}
            {course?.no_of_Sessions && (
              <div className={`flex items-start ${isMobile ? 'p-3.5' : 'p-3'} border border-gray-100 dark:border-gray-800 rounded-lg w-full`}>
                <Users size={isMobile ? 18 : 16} className="mt-0.5 mr-3 text-medhgreen dark:text-medhgreen flex-shrink-0" />
                <div className="flex flex-col">
                  <p className="font-bold text-gray-900 dark:text-white text-sm">
                    {course.no_of_Sessions} {isLiveCourse ? 'Sessions' : 'Classes'}
                  </p>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    {isLiveCourse ? 'Total Live Sessions' : 'Total Learning Units'}
                  </p>
                </div>
              </div>
            )}
            
            {/* Special feature - Internship for specific courses */}
            {hasInternshipOption && (
              <div className={`flex items-start ${isMobile ? 'p-3.5' : 'p-3'} border border-gray-100 dark:border-gray-800 rounded-lg w-full`}>
                <Briefcase size={isMobile ? 18 : 16} className="mt-0.5 mr-3 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                <div className="flex flex-col">
                  <p className="font-bold text-gray-900 dark:text-white text-sm">
                    Guaranteed Job
                  </p>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">For 18 Month Course</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Action buttons - consistent across both types with style variations */}
          <div className={`mt-auto ${isMobile ? 'pt-1' : 'pt-0.5'} flex flex-col items-center w-full`}>
            <div className={`${isLiveCourse ? '' : 'grid grid-cols-2 gap-2'} mb-2 w-full`}>
              {/* Only show brochure button for non-live courses */}
              {!isLiveCourse && (
                <button
                  onClick={openModal}
                  className="px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 
                    border border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400"
                >
                  <Download size={16} className="text-indigo-500" />
                  Brochure
                </button>
              )}
              <button
                onClick={navigateToCourse}
                className={`px-4 py-2 rounded-lg font-medium transition-all text-white flex items-center justify-center gap-1.5
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
        </div>

        {/* Inline Download Brochure Modal overlay inside the card */}
        {isModalOpen && (
          <DownloadBrochureModal
            title={course?.course_title || "Course Brochure"}
            isOpen={isModalOpen}
            onClose={closeModal}
            courseTitle={course?.course_title}
            courseId={course?._id}
            inlineForm={true}
          >
            <p className="text-xs text-gray-600 mb-3">
              Fill in your details and we'll email you the brochure from Medh.
            </p>
          </DownloadBrochureModal>
        )}
      </div>
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

// Add a safe rating display function
const safeRatingDisplay = (rating) => {
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