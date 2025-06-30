"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import OptimizedImage from '@/components/shared/OptimizedImage';

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

interface FilterCourseCardProps {
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

  // Use consistent 3:2 aspect ratio for all images
  const imageContainerClasses = `relative w-full aspect-[3/2] overflow-hidden rounded-t-xl group`;

  return (
    <div className={imageContainerClasses}>
      <OptimizedImage
        src={src}
        alt={alt}
        fill={true}
        className="object-cover transition-all duration-300 ease-out group-hover:scale-105"
        quality={shouldBeLCP ? 95 : 85}
        priority={shouldBeLCP}
        onLoad={onLoad}
        onError={onError}
        loading={shouldBeLCP ? 'eager' : 'lazy'}
        decoding={shouldBeLCP ? 'sync' : 'async'}
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/20 dark:from-black/10 dark:to-black/30" />
    </div>
  );
};

const FilterCourseCard: React.FC<FilterCourseCardProps> = ({ 
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
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isImageError, setIsImageError] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  
  const cardRef = useRef(null);
  const router = useRouter();

  const handleImageLoad = () => setIsImageLoaded(true);
  const handleImageError = () => setIsImageError(true);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (cardRef.current) {
      const rect = (cardRef.current as HTMLElement).getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePosition({ x, y });
    }
  };

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

  // Format price function
  const formatPrice = (priceInput: any, batchPriceInput: any) => {
    // Check if the course is explicitly marked as free
    if (course?.isFree === true) return "Free";

    let actualPrice;
    let currencySymbol = '$'; // Default currency symbol

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
        } else if (typeof priceObj.individual === 'number' && priceObj.individual > 0) {
          actualPrice = priceObj.individual;
        }
      } else {
        // For non-live courses, use individual pricing
        if (typeof priceObj.individual === 'number') {
          actualPrice = priceObj.individual;
        } else if (typeof priceObj.batch === 'number') { // Fallback to batch if individual is not a number
          actualPrice = priceObj.batch;
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
        } else if (!isNaN(pInput) && pInput > 0) {
          actualPrice = pInput;
        }
      } else {
        if (!isNaN(pInput)) {
          actualPrice = pInput;
        } else if (!isNaN(bInput)) { // Fallback to batch if individual is not a number
          actualPrice = bInput;
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
    
    return `${displaySymbol}${actualPrice.toLocaleString()}`;
  };

  // Format course grade
  const formatCourseGrade = (grade: any) => {
    if (!grade) return "All Grades";
    if (typeof grade === 'string') {
      // Handle specific grade mappings
      if (grade === "UG - Graduate - Professionals") return "UG/Graduate/Pro";
      if (grade.includes("Grade 1-2")) return "Grade 1-2";
      if (grade.includes("Grade 3-4")) return "Grade 3-4";
      if (grade.includes("Grade 5-6")) return "Grade 5-6";
      if (grade.includes("Grade 7-8")) return "Grade 7-8";
      if (grade.includes("Grade 9-10")) return "Grade 9-10";
      if (grade.includes("Grade 11-12")) return "Grade 11-12";
      if (grade.includes("Preschool")) return "Preschool";
      if (grade.includes("Professional")) return "Professional";
      return grade;
    }
    return grade || "All Grades";
  };

    // Recursive function to extract text from React elements
  const extractTextFromReactElement = (element: any): string => {
    if (typeof element === 'string' || typeof element === 'number') {
      return String(element);
    }
    
    if (Array.isArray(element)) {
      return element.map(extractTextFromReactElement).join('');
    }
    
    if (typeof element === 'object' && element !== null) {
      // Handle React elements
      if (element.props && element.props.children) {
        return extractTextFromReactElement(element.props.children);
      }
      
      // Handle objects with text content
      if (element.text) return String(element.text);
      if (element.content) return String(element.content);
      if (element.value) return String(element.value);
    }
    
    return '';
  };

  // Format course duration to show only months
  const formatCourseDuration = (duration: any) => {
    if (!duration) return "";
    
    // Extract text content from React elements
    let durationStr = extractTextFromReactElement(duration);
    
    durationStr = durationStr.trim();
    if (!durationStr) return "";
    
    // Handle the specific format from API: "18 months 72 weeks" -> "18 Months"
    // Extract just the months part and remove weeks
    let cleanDuration = durationStr;
    
    // Pattern for "X months Y weeks" format
    const monthsWeeksMatch = cleanDuration.match(/(\d+)\s*months?\s+\d+\s*weeks?/i);
    if (monthsWeeksMatch) {
      return `${monthsWeeksMatch[1]} Months`;
    }
    
    // Remove any content in parentheses (like weeks, sessions, etc.)
    // This handles "18 Months (72 Weeks)", "6 months (24 weeks)", etc.
    cleanDuration = cleanDuration.replace(/\s*\([^)]*\)/g, '').trim();
    
    // Handle "4 to 18 months" -> "4-18 Months"
    if (cleanDuration.toLowerCase().includes('to') && cleanDuration.toLowerCase().includes('month')) {
      const match = cleanDuration.match(/(\d+)\s*to\s*(\d+)\s*months?/i);
      if (match) {
        return `${match[1]}-${match[2]} Months`;
      }
    }
    
    // Handle "4-18 months" -> "4-18 Months"
    if (cleanDuration.match(/^\d+-\d+\s*months?$/i)) {
      return cleanDuration.replace(/months?/i, 'Months');
    }
    
    // Handle single month values like "6 months" -> "6 Months"
    if (cleanDuration.match(/^\d+\s*months?$/i)) {
      return cleanDuration.replace(/months?/i, 'Months');
    }
    
    // Handle "18 Months" (already properly formatted)
    if (cleanDuration.match(/^\d+\s*Months?$/)) {
      return cleanDuration.replace(/Months?$/, 'Months');
    }
    
    // If no specific pattern matched, still remove parentheses content
    // This ensures "18 Months (72 Weeks)" becomes "18 Months"
    return cleanDuration || durationStr;
  };

  // Check if course is eligible for Job Guarantee (18 months)
  const isJobGuaranteeCourse = () => {
    if (!isLiveCourse) return false;
    
    const durationToCheck = course?.duration_range || course?.course_duration || '';
    
    // Handle string case
    if (typeof durationToCheck === 'string') {
      // Check for 18 months in various formats
      // "18 months 72 weeks", "18 Months (72 Weeks)", "18 months", etc.
      return /18\s*months?/i.test(durationToCheck);
    } 
    
    // Handle React element case - extract text first
    const durationText = extractTextFromReactElement(durationToCheck);
    return /18\s*months?/i.test(durationText);
  };

  // Get course type specific styles
  const getCourseTypeStyles = () => {
    if (isLiveCourse) {
      return {
        stickyNoteBg: 'bg-red-500',
        stickyNoteText: 'text-white',
        buttonBg: 'bg-[#379392] hover:bg-[#379392]/90',
        buttonText: 'text-white',
        accentColor: 'text-[#379392]',
        priceColor: 'text-[#2d5f5d] dark:text-[#4ade80]',
        chipBg: 'bg-[#379392]/10',
        chipText: 'text-[#379392]',
        chipBorder: 'border-[#379392]/20'
      };
    }
    
    if (isBlendedCourse) {
      return {
        stickyNoteBg: 'bg-purple-500',
        stickyNoteText: 'text-white',
        buttonBg: 'bg-purple-500 hover:bg-purple-600',
        buttonText: 'text-white',
        accentColor: 'text-purple-500',
        priceColor: 'text-purple-800 dark:text-purple-400',
        chipBg: 'bg-purple-100',
        chipText: 'text-purple-600',
        chipBorder: 'border-purple-200'
      };
    }
    
    // Default to self-paced course styles
    return {
      stickyNoteBg: 'bg-blue-500',
      stickyNoteText: 'text-white',
      buttonBg: 'bg-indigo-500 hover:bg-indigo-600',
      buttonText: 'text-white',
      accentColor: 'text-indigo-500',
      priceColor: 'text-indigo-800 dark:text-indigo-400',
      chipBg: 'bg-indigo-100',
      chipText: 'text-indigo-600',
      chipBorder: 'border-indigo-200'
    };
  };

  const styles = getCourseTypeStyles();

  // Get course type content
  const getCourseTypeContent = () => {
    if (isLiveCourse) {
      // Check if this is an 18-month course for Job Guarantee badge
      const isJobGuarantee = isJobGuaranteeCourse();
      
      return {
        tag: isJobGuarantee ? 'Live Job Guarantee' : 'Live',
        tagIcon: <Play className="w-3 h-3" />,
        sessionLabel: 'Sessions',
        sessionIcon: <Users size={12} />,
        isJobGuarantee
      };
    }
    
    if (isBlendedCourse) {
      return {
        tag: 'Blended (self-paced)',
        tagIcon: <Layers className="w-3 h-3" />,
        sessionLabel: 'Video Sessions',
        sessionIcon: <Play size={12} />,
        isJobGuarantee: false
      };
    }
    
    // Default to self-paced content
    return {
      tag: 'Self-Paced',
      tagIcon: <Play className="w-3 h-3" />,
      sessionLabel: 'Videos',
      sessionIcon: <Play size={12} />,
      isJobGuarantee: false
    };
  };

  const content = getCourseTypeContent();

  return (
    <>
      {/* Mobile Layout (sm and below) - Horizontal layout with image on left */}
    <div 
      ref={cardRef}
        className="group relative flex flex-col md:hidden
          w-full 
          rounded-lg overflow-hidden 
          border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/60 dark:hover:border-gray-600/60
          bg-white dark:bg-gray-900 
          shadow-sm hover:shadow-lg hover:shadow-gray-200/25 dark:hover:shadow-gray-800/25
          transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01] cursor-pointer
          transform-gpu will-change-transform mb-3"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        onClick={navigateToCourse}
      >
        {/* Main Card Content - Horizontal layout */}
        <div className="flex min-h-[120px] xs:min-h-[140px] sm:min-h-[160px] h-auto">
          {/* Left side - Image */}
          <div className="relative w-[100px] xs:w-[120px] sm:w-[160px] flex-shrink-0">
            <div className="relative w-full h-full overflow-hidden rounded-tl-lg">
              <OptimizedImage
                src={course?.course_image || ''}
                alt={course?.course_title || "Course Image"}
                fill={true}
                className="object-cover transition-all duration-300 ease-out group-hover:scale-105"
                quality={isLCP ? 95 : 85}
                priority={isLCP}
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading={isLCP ? 'eager' : 'lazy'}
                decoding={isLCP ? 'sync' : 'async'}
                sizes="(max-width: 360px) 100px, (max-width: 480px) 120px, (max-width: 640px) 140px, 160px"
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/10 dark:from-black/10 dark:to-black/20" />
            </div>
          </div>

          {/* Right side - Content */}
          <div className="flex flex-col flex-grow p-2 xs:p-3 sm:p-4 space-y-1.5 xs:space-y-2 sm:space-y-2.5 min-w-0">
            {/* Course Title - Enhanced hierarchy */}
            <div className="flex-shrink-0">
              <h3 className="text-sm xs:text-base sm:text-lg font-extrabold text-gray-900 dark:text-white leading-tight line-clamp-2">
                {(() => {
                  const title = course?.course_title || "Course Title";
                  const bracketMatch = title.match(/^(.*?)\s*\(([^)]+)\)(.*)$/);
                  
                  if (bracketMatch) {
                    const [, beforeBracket, insideBracket, afterBracket] = bracketMatch;
                    return (
                      <>
                        {beforeBracket.trim()}{afterBracket.trim() && ` ${afterBracket.trim()}`}
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 block mt-0.5 hidden xs:block">
                          ({insideBracket})
                        </span>
                      </>
                    );
                  }
                  
                  return title;
                })()}
              </h3>
            </div>
            
            {/* Compact Badge Row - Sessions, Duration, Grade */}
            <div className="flex-shrink-0">
              <div className="flex items-center gap-1 xs:gap-1.5 flex-wrap">
                {/* Sessions Badge */}
                <div className={`inline-flex items-center 
                  px-1.5 xs:px-2 py-0.5 
                  rounded text-xs font-medium
                  ${styles.chipBg} ${styles.chipText} border ${styles.chipBorder}`}>
                  {content.sessionIcon}
                  <span className="ml-0.5">
                    {course?.no_of_Sessions || course?.video_count || 0}
                  </span>
                </div>
                
                {/* Duration Badge - Only for Live Courses */}
                {isLiveCourse && (course?.course_duration || course?.duration_range) && (
                  <div className={`inline-flex items-center 
                    px-1.5 xs:px-2 py-0.5 
                    rounded text-xs font-medium whitespace-nowrap
                    ${styles.chipBg} ${styles.chipText} border ${styles.chipBorder}`}>
                    <Clock size={10} className="mr-0.5" />
                    <span>{formatCourseDuration(course?.duration_range || course?.course_duration)}</span>
                  </div>
                )}
                
                {/* Grade Badge */}
                <div className="inline-flex items-center 
                  px-1.5 xs:px-2 py-0.5 
                  rounded text-xs font-medium
                  bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 
                  border border-gray-200 dark:border-gray-700">
                  <GraduationCap size={10} className="mr-0.5" />
                  <span>{formatCourseGrade(course?.course_grade)}</span>
                </div>
              </div>
            </div>
            
            {/* Q&A Live Chip - Only for blended courses */}
            {isBlendedCourse && (
              <div className="flex-shrink-0">
                <div className="inline-flex items-center 
                  px-1.5 xs:px-2 py-0.5 
                  rounded text-xs font-medium whitespace-nowrap
                  bg-[#379392]/10 text-[#379392] border border-[#379392]/20">
                  <Users size={10} className="mr-0.5" />
                  <span>Q&A Live</span>
                </div>
              </div>
            )}
            
            {/* Price */}
            {!hidePrice && (
              <div className="flex-shrink-0">
                <div className="flex items-baseline gap-1 flex-wrap">
                  <span className={`text-sm xs:text-base sm:text-lg font-extrabold ${styles.priceColor} drop-shadow-sm`}>
                    {formatPrice(course.course_fee, course.batchPrice)}
                  </span>
                  {isLiveCourse && (
                    <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">onwards</span>
                  )}
                  {course?.original_fee && (
                    <span className="text-xs text-gray-500 dark:text-gray-500 line-through ml-1">
                      {course.original_fee.toLocaleString()}
                    </span>
                  )}
                </div>
                {course?.fee_note && (
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium block mt-0.5">
                    {course.fee_note}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Class Type Banner - Attached to bottom of card */}
        <div className={`w-full 
          ${content.isJobGuarantee 
            ? 'bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 border-t-2 border-amber-300' 
            : `${styles.stickyNoteBg} border-t-2`
          } 
          ${content.isJobGuarantee 
            ? '' 
            : (isLiveCourse 
                ? 'border-red-400' 
                : isBlendedCourse 
                  ? 'border-purple-400' 
                  : 'border-blue-400'
              )
          }
          ${styles.stickyNoteText} 
          py-2 xs:py-2.5 px-2 xs:px-4 
          flex items-center justify-between gap-1 xs:gap-2 
          font-bold text-xs xs:text-sm 
          transition-all duration-300 ease-out`}
        >
          {/* Left side - Main course type */}
          <div className="flex items-center gap-1 xs:gap-2 min-w-0">
            <div className="flex-shrink-0">
              {React.cloneElement(content.tagIcon, { 
                className: "w-3 h-3 xs:w-3.5 xs:h-3.5" 
              })}
            </div>
            <span className="font-extrabold text-xs xs:text-sm truncate">{content.tag}</span>
          </div>
          
          {/* Right side - Additional info */}
          <div className="flex items-center gap-1 text-xs opacity-90 font-medium min-w-0 flex-shrink-0">
            {isLiveCourse && (
              <span className="hidden xs:inline whitespace-nowrap text-xs">Interactive Learning</span>
            )}
            {isBlendedCourse && (
              <span className="hidden sm:inline whitespace-nowrap text-xs">Hybrid Learning</span>
            )}
            {isSelfPacedCourse && (
              <span className="hidden xs:inline whitespace-nowrap text-xs">Your Pace</span>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout (md and above) - Compact vertical layout optimized for live courses */}
      <div 
        className="group relative hidden md:flex flex-col 
        h-[360px] md:h-[380px] lg:h-[400px] xl:h-[400px] 
        w-full max-w-[280px] md:max-w-[300px] lg:max-w-[320px] xl:max-w-[340px] 
        mx-auto rounded-lg md:rounded-xl overflow-hidden 
        border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/60 dark:hover:border-gray-600/60
        bg-white dark:bg-gray-900 
        shadow-sm hover:shadow-xl hover:shadow-gray-200/25 dark:hover:shadow-gray-800/25
        transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] cursor-pointer
        transform-gpu will-change-transform"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={navigateToCourse}
    >
      {/* Image section with sticky note badge */}
      <div className="relative">
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
        
        {/* Sticky Note Badge - Top Left Corner */}
        <div className={`absolute 
          top-2 md:top-3 lg:top-3 left-2 md:left-3 lg:left-3 z-10 
          px-2 md:px-3 lg:px-3 py-1 md:py-1.5 lg:py-1.5 
          rounded-md md:rounded-lg 
          text-xs md:text-sm font-bold 
          ${content.isJobGuarantee 
            ? 'bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 text-white shadow-xl shadow-yellow-500/40 border-2 border-yellow-300' 
            : `${styles.stickyNoteBg} ${styles.stickyNoteText}`
          } 
          shadow-md transform rotate-[-2deg] 
          transition-transform duration-300 ease-out group-hover:rotate-0`}
        >
          <div className="flex items-center gap-1">
            {content.tagIcon}
            <span>{content.tag}</span>
          </div>
        </div>
      </div>

      {/* Course content - Compact layout */}
      <div className="flex flex-col flex-grow 
        p-3 md:p-4 lg:p-4 
        space-y-2 md:space-y-2.5">
        
        {/* 1. Course Title - Compact */}
        <div className="text-left 
          min-h-[45px] md:min-h-[50px] lg:min-h-[55px] 
          flex flex-col justify-center">
          <h3 className="text-sm md:text-base lg:text-base 
            font-bold md:font-extrabold 
            text-gray-900 dark:text-white leading-tight 
            break-words word-break overflow-wrap-anywhere line-clamp-2">
            {(() => {
              const title = course?.course_title || "Course Title";
              const bracketMatch = title.match(/^(.*?)\s*\(([^)]+)\)(.*)$/);
              
              if (bracketMatch) {
                const [, beforeBracket, insideBracket, afterBracket] = bracketMatch;
                return (
                  <>
                    {beforeBracket.trim()}{afterBracket.trim() && ` ${afterBracket.trim()}`}
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-0.5">
                      ({insideBracket})
                    </div>
                  </>
                );
              }
              
              return title;
            })()}
          </h3>
        </div>
        
        {/* 2. Compact Badge Grid - 3 badges in 2 rows */}
        <div className="space-y-1.5">
          {/* First Row - Sessions and Duration */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Sessions Badge */}
            <div className={`inline-flex items-center 
              px-2 md:px-2.5 py-1 
              rounded-md text-xs font-semibold
              ${styles.chipBg} ${styles.chipText} border ${styles.chipBorder}`}>
              {content.sessionIcon}
              <span className="ml-1">
                {course?.no_of_Sessions || course?.video_count || 0} Sessions
              </span>
            </div>
            
            {/* Duration Badge - Only for Live Courses */}
            {isLiveCourse && (course?.course_duration || course?.duration_range) && (
              <div className={`inline-flex items-center 
                px-2 md:px-2.5 py-1 
                rounded-md text-xs font-semibold whitespace-nowrap
                ${styles.chipBg} ${styles.chipText} border ${styles.chipBorder}`}>
                <Clock size={11} className="mr-1" />
                <span>{formatCourseDuration(course?.duration_range || course?.course_duration)}</span>
              </div>
            )}
          </div>
          
          {/* Second Row - Grade and Q&A Live */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Grade Badge */}
            <div className="inline-flex items-center 
              px-2 md:px-2.5 py-1 
              rounded-md text-xs font-medium
              bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 
              border border-gray-200 dark:border-gray-700">
              <GraduationCap size={11} className="mr-1" />
              <span>{formatCourseGrade(course?.course_grade)}</span>
            </div>
            
            {/* Q&A Live Badge - Only for blended courses */}
            {isBlendedCourse && (
              <div className="inline-flex items-center 
                px-2 md:px-2.5 py-1 
                rounded-md text-xs font-medium whitespace-nowrap
                bg-[#379392]/10 text-[#379392] border border-[#379392]/20">
                <Users size={11} className="mr-1" />
                <span>Q&A Live</span>
              </div>
            )}
          </div>
        </div>
        
        {/* 3. Price - Compact */}
        {!hidePrice && (
          <div className="text-left py-1">
            <div className="flex items-baseline justify-start gap-1">
              <span className={`text-base md:text-lg font-extrabold ${styles.priceColor} drop-shadow-sm`}>
                {formatPrice(course.course_fee, course.batchPrice)}
              </span>
              {isLiveCourse && (
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">onwards</span>
              )}
              {course?.original_fee && (
                <span className="text-xs text-gray-500 dark:text-gray-500 line-through ml-1">
                  {course.original_fee.toLocaleString()}
                </span>
              )}
            </div>
            {course?.fee_note && (
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium block mt-0.5">
                {course.fee_note}
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Hover Overlay - Radial blur effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out pointer-events-none">
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              rgba(0,0,0,0.1) 0%, 
              rgba(0,0,0,0.2) 25%, 
              rgba(0,0,0,0.3) 50%, 
              rgba(0,0,0,0.4) 100%)`,
            backdropFilter: isHovered ? 'blur(8px)' : 'blur(0px)',
            transition: 'backdrop-filter 100ms ease-out, background 100ms ease-out'
          }}
        >
          {/* Glassmorphic View Details button */}
          <div className="px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 
            rounded-lg md:rounded-xl 
            font-semibold text-sm md:text-base lg:text-lg 
            flex items-center gap-2 md:gap-3 
            bg-white/15 backdrop-blur-xl border border-white/30 shadow-2xl
            text-white transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100
            transition-all duration-100 ease-out">
            View Details
            <ArrowUpRight size={16} className="md:w-5 md:h-5 lg:w-6 lg:h-6 transition-transform duration-100 ease-out group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default FilterCourseCard; 