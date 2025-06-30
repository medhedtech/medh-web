"use client";
import React, { useState, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Users,
  Play,
  Layers,
  ArrowUpRight
} from "lucide-react";
import { isFreePrice } from '@/utils/priceUtils';
import OptimizedImage from '@/components/shared/OptimizedImage';

// Type definitions for Home Card
interface CoursePrice {
  currency: string;
  individual: number;
  batch: number;
  early_bird_discount?: number;
}

interface HomeCourse {
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
  session_display?: string;
  video_count?: number;
  class_type?: string;
  is_live_course?: boolean;
  is_blended_course?: boolean;
  isFree?: boolean;
  prices?: CoursePrice[];
  enrolled_students?: number;
  is_new?: boolean;
  url?: string;
  classType?: 'live' | 'blended' | 'self-paced';
  efforts_per_Week?: string;
}

interface HomeCardProps {
  course?: HomeCourse;
  courseType?: 'live' | 'blended';
  index?: number;
  isLCP?: boolean;
  variant?: 'compact' | 'standard';
}

const HomeCard: React.FC<HomeCardProps> = ({ 
  course, 
  courseType = 'live',
  index = 0,
  isLCP = false,
  variant = 'standard'
}) => {
  // Provide safe defaults
  const safeCourse = course || {} as HomeCourse;
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePosition({ x, y });
    }
  };

  // Determine course type and properties
  const isLiveCourse = useMemo(() => {
    return courseType === 'live' || 
           safeCourse?.is_live_course === true || 
           safeCourse?.class_type?.toLowerCase().includes('live') ||
           safeCourse?.classType === 'live';
  }, [courseType, safeCourse]);

  const isBlendedCourse = useMemo(() => {
    return courseType === 'blended' || 
           safeCourse?.is_blended_course === true || 
           safeCourse?.class_type?.toLowerCase().includes('blend') ||
           safeCourse?.classType === 'blended';
  }, [courseType, safeCourse]);

  // Navigation handler
  const navigateToCourse = useCallback(() => {
    if (isLiveCourse && safeCourse?._id && safeCourse?.course_category) {
      const categoryName = safeCourse.course_category.toLowerCase().replace(/\s+/g, '-');
      const enrollmentUrl = `/enrollment/${categoryName}?course=${safeCourse._id}`;
      router.push(enrollmentUrl);
      return;
    }

    if (safeCourse?.url && typeof safeCourse.url === 'string' && safeCourse.url.trim() !== '') {
      const targetUrl = safeCourse.url.startsWith('http') ? safeCourse.url : safeCourse.url.startsWith('/') ? safeCourse.url : `/${safeCourse.url}`;
      window.open(targetUrl, '_blank');
      return;
    }

    if (safeCourse?._id) {
      window.open(`/course-details/${safeCourse._id}`, '_blank');
    }
  }, [isLiveCourse, safeCourse, router]);

  // Format price
  const formatPrice = useMemo(() => {
    if (safeCourse?.isFree === true) return "Free";

    let actualPrice;
    let currencySymbol = 'INR ';

    if (safeCourse?.prices && safeCourse.prices.length > 0) {
      const priceObj = safeCourse.prices[0];
      if (priceObj.individual === 0 && priceObj.batch === 0) return "Free";

      if (isLiveCourse) {
        actualPrice = priceObj.batch > 0 ? priceObj.batch : priceObj.individual;
      } else {
        actualPrice = priceObj.individual || priceObj.batch;
      }
    } else {
      const pInput = parseFloat(String(safeCourse?.course_fee || 0));
      const bInput = parseFloat(String(safeCourse?.batchPrice || 0));

      if (isFreePrice(pInput) && (isNaN(bInput) || isFreePrice(bInput))) return "Free";
      
      if (isLiveCourse) {
        actualPrice = (!isNaN(bInput) && bInput > 0) ? bInput : pInput;
      } else {
        actualPrice = pInput || bInput;
      }
    }
    
    if (!actualPrice || isNaN(actualPrice)) return "Price not available";
    if (actualPrice === 0) return "Free";

    return `${currencySymbol}${actualPrice.toLocaleString()}`;
  }, [safeCourse, isLiveCourse]);

  // Format course grade
  const formatCourseGrade = useMemo(() => {
    const grade = safeCourse?.course_grade;
    if (!grade) return "All Grades";
    if (typeof grade === 'string') {
      if (grade === "UG - Graduate - Professionals") return "UG/Graduate/Pro";
      if (grade.includes("Grade")) return grade;
      if (grade.includes("Professional")) return "Professional";
      return grade;
    }
    return grade || "All Grades";
  }, [safeCourse?.course_grade]);

  // Format duration
  const formatCourseDuration = useMemo(() => {
    const duration = safeCourse?.duration_range || safeCourse?.course_duration;
    if (!duration) return "";
    
    let durationStr = typeof duration === 'string' ? duration : String(duration);
    durationStr = durationStr.trim();
    if (!durationStr) return "";
    
    // Handle "4-18 months" -> "4-18 Months"
    if (durationStr.match(/^\d+-\d+\s*months?$/i)) {
      return durationStr.replace(/months?/i, 'Months');
    }
    
    // Handle "4 to 18 months" -> "4-18 Months"
    if (durationStr.toLowerCase().includes('to') && durationStr.toLowerCase().includes('month')) {
      const match = durationStr.match(/(\d+)\s*to\s*(\d+)\s*months?/i);
      if (match) {
        return `${match[1]}-${match[2]} Months`;
      }
    }
    
    // Handle single numbers like "18 months" -> "18 Months"
    if (durationStr.match(/^\d+\s*months?$/i)) {
      return durationStr.replace(/months?/i, 'Months');
    }
    
    return durationStr;
  }, [safeCourse]);

  // Check if course is eligible for Job Guarantee (specifically 18-month courses)
  const isJobGuaranteeCourse = useMemo(() => {
    if (!isLiveCourse) return false;
    
    const duration = safeCourse?.duration_range || safeCourse?.course_duration;
    if (!duration) return false;
    
    let durationStr = typeof duration === 'string' ? duration : String(duration);
    durationStr = durationStr.trim().toLowerCase();
    
    // Check for specific 18-month patterns
    // Matches: "4-18 months", "4 to 18 months", "18 months", etc.
    // But NOT: "3-9 months", "6 months", etc.
    return (
      /\b18\s*months?\b/.test(durationStr) && // Contains "18 months"
      (
        /^\d+-18\s*months?$/i.test(durationStr) || // Ends with 18 months (like "4-18 months")
        /^\d+\s*to\s*18\s*months?$/i.test(durationStr) || // "X to 18 months"
        /^18\s*months?$/i.test(durationStr) // Exactly "18 months"
      )
    );
  }, [isLiveCourse, safeCourse]);

  // Format sessions
  const formatSessions = useMemo(() => {
    if (safeCourse?.session_display) return safeCourse.session_display;
    if (safeCourse?.session_range) return safeCourse.session_range;
    if (safeCourse?.no_of_Sessions) {
      const sessions = String(safeCourse.no_of_Sessions);
      if (sessions.includes('-')) {
        return `${sessions} sessions`;
      }
      return `${sessions} video sessions`;
    }
    return isLiveCourse ? "Live sessions" : "Video sessions";
  }, [safeCourse, isLiveCourse]);

  // Format effort per week
  const formatEffort = useMemo(() => {
    if (safeCourse?.efforts_per_Week) {
      return safeCourse.efforts_per_Week;
    }
    return isLiveCourse ? "4 hrs/week" : "3 - 4 hours / week";
  }, [safeCourse?.efforts_per_Week, isLiveCourse]);

  // Get course type styles
  const styles = useMemo(() => {
    if (isLiveCourse) {
      return {
        stickyNoteBg: 'bg-red-500',
        stickyNoteText: 'text-white',
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
        accentColor: 'text-purple-500',
        priceColor: 'text-purple-800 dark:text-purple-400',
        chipBg: 'bg-purple-100',
        chipText: 'text-purple-600',
        chipBorder: 'border-purple-200'
      };
    }
    
    return {
      stickyNoteBg: 'bg-blue-500',
      stickyNoteText: 'text-white',
      accentColor: 'text-indigo-500',
      priceColor: 'text-indigo-800 dark:text-indigo-400',
      chipBg: 'bg-indigo-100',
      chipText: 'text-indigo-600',
      chipBorder: 'border-indigo-200'
    };
  }, [isLiveCourse, isBlendedCourse]);

  // Get course type content
  const content = useMemo(() => {
    if (isLiveCourse) {
      return {
        tag: isJobGuaranteeCourse ? 'Live Job Guarantee' : 'Live',
        tagIcon: <Play className="w-3 h-3" />,
        sessionLabel: 'Sessions',
        sessionIcon: <Users size={12} />
      };
    }
    
    if (isBlendedCourse) {
      return {
        tag: 'Blended',
        tagIcon: <Layers className="w-3 h-3" />,
        sessionLabel: 'Videos + Live Q&A',
        sessionIcon: <Play size={12} />
      };
    }
    
    return {
      tag: 'Self-Paced',
      tagIcon: <Play className="w-3 h-3" />,
      sessionLabel: 'Videos',
      sessionIcon: <Play size={12} />
    };
  }, [isLiveCourse, isBlendedCourse]);

  return (
    <>
      {/* Mobile Layout (sm and below) - Horizontal layout with image on left */}
      <div 
        ref={cardRef}
        className="group relative flex md:hidden
          min-h-[140px] sm:min-h-[160px] h-auto w-full 
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
        {/* Left side - Image */}
        <div className="relative w-[140px] sm:w-[160px] flex-shrink-0">
          <div className="relative w-full h-full overflow-hidden rounded-l-lg">
            <OptimizedImage
              src={safeCourse?.course_image || ''}
              alt={safeCourse?.course_title || "Course Image"}
              fill={true}
              className="object-cover transition-all duration-300 ease-out group-hover:scale-105"
              quality={isLCP ? 95 : 85}
              priority={isLCP}
              loading={isLCP ? 'eager' : 'lazy'}
              decoding={isLCP ? 'sync' : 'async'}
              sizes="(max-width: 640px) 140px, 160px"
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/10 dark:from-black/10 dark:to-black/20" />
          </div>
        </div>

        {/* Right side - Content */}
        <div className="flex flex-col flex-grow p-3 sm:p-4 space-y-2 sm:space-y-2.5 min-w-0">
          {/* Course Title */}
          <div className="flex-shrink-0">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight line-clamp-2">
              {safeCourse?.course_title || "Course Title"}
            </h3>
          </div>
          
          {/* Course Info */}
          <div className="flex-shrink-0">
            {isLiveCourse ? (
              <>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">{formatCourseDuration}</span>
                  <span className="mx-2">•</span>
                  <span className="font-medium">{formatEffort}</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {formatSessions}
                </div>
              </>
            ) : (
              <>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Self-paced</span>
                  <span className="mx-2">•</span>
                  <span className="font-medium">Q&A Live Session support</span>
                </div>
                {isBlendedCourse && (
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {formatSessions}
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Price */}
          <div className="flex-shrink-0">
            <div className="flex items-baseline gap-1">
              <span className={`text-base sm:text-lg font-bold ${styles.priceColor}`}>
                {formatPrice}
              </span>
              {isLiveCourse && (
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">onwards</span>
              )}
            </div>
            {safeCourse?.fee_note && (
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium block">
                {safeCourse.fee_note}
              </span>
            )}
          </div>
        </div>

        {/* Course Type Badge - Positioned at bottom right of the card */}
        <div className={`absolute 
          bottom-2 right-2 z-20 
          px-2 py-1 
          rounded-lg 
          text-[10px] sm:text-xs font-bold 
          ${styles.stickyNoteBg} ${styles.stickyNoteText}
          shadow-lg 
          transition-all duration-300 ease-out`}
        >
          <div className="flex items-center gap-1">
            {content.tagIcon}
            <span>{content.tag}</span>
          </div>
        </div>
      </div>

      {/* Desktop Layout (md and above) - Original vertical layout */}
      <div 
        className="group relative hidden md:flex flex-col 
        h-[360px] md:h-[420px] lg:h-[420px]
        w-full max-w-[400px] md:max-w-[400px] 
        mx-auto rounded-xl overflow-hidden 
        border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/60 dark:hover:border-gray-600/60
        bg-white dark:bg-gray-900 
        shadow-sm hover:shadow-xl hover:shadow-gray-200/25 dark:hover:shadow-gray-800/25
        transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01]
        transform-gpu will-change-transform cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={navigateToCourse}
    >
        {/* Image section with sticky note badge */}
        <div className="relative">
          <div className="relative w-full aspect-[3/2] overflow-hidden rounded-t-xl group">
            <OptimizedImage
              src={safeCourse?.course_image || ''}
              alt={safeCourse?.course_title || "Course Image"}
              fill={true}
              className="object-cover transition-all duration-300 ease-out group-hover:scale-105"
              quality={isLCP ? 95 : 85}
              priority={isLCP}
              loading={isLCP ? 'eager' : 'lazy'}
              decoding={isLCP ? 'sync' : 'async'}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/20 dark:from-black/10 dark:to-black/30" />
          </div>
          
          {/* Sticky Note Badge */}
          <div className={`absolute 
            top-3 left-3 z-10 
            px-3 py-1.5 
            rounded-lg 
            text-sm font-bold 
            ${styles.stickyNoteBg} ${styles.stickyNoteText}
            shadow-md 
            transition-all duration-300 ease-out`}
          >
            <div className="flex items-center gap-1">
              {content.tagIcon}
              <span>{content.tag}</span>
            </div>
          </div>
        </div>

        {/* Course content */}
        <div className="flex flex-col flex-grow p-3 md:p-4 lg:p-5 space-y-2 md:space-y-2.5 lg:space-y-3">
          
          {/* Course Title */}
          <div className="text-left space-y-1 min-h-[40px] md:min-h-[50px] lg:min-h-[55px] flex flex-col justify-center">
            <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 dark:text-white leading-tight line-clamp-2">
              {safeCourse?.course_title || "Course Title"}
            </h3>
          </div>
          
          {/* Course Info - Simplified */}
          <div className="text-left space-y-2 md:space-y-3">
            {isLiveCourse ? (
              <>
                <div className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                  <span className="font-medium">{formatCourseDuration}</span>
                  <span className="mx-2">•</span>
                  <span className="font-medium">{formatEffort}</span>
                </div>
                <div className="text-xs md:text-sm text-gray-500 dark:text-gray-500">
                  {formatSessions}
                </div>

              </>
            ) : (
              <>
                <div className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  <span className="font-medium">Self-paced</span>
                  <span className="mx-2">•</span>
                  <span className="font-medium">Q&A Session </span>
                </div>
                {isBlendedCourse && (
                  <div className="text-xs md:text-sm text-gray-500 dark:text-gray-500 leading-relaxed">
                    {formatSessions}
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Price - Prominent display */}
          <div className="text-left py-1">
            <div className="flex items-baseline justify-start gap-1.5 flex-wrap">
              <span className={`text-lg md:text-xl lg:text-2xl font-bold ${styles.priceColor} whitespace-nowrap`}>
                {formatPrice}
              </span>
              {isLiveCourse && (
                <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">onwards</span>
              )}
            </div>
            {safeCourse?.original_fee && (
              <div className="mt-0.5">
                <span className="text-xs md:text-sm text-gray-500 dark:text-gray-500 line-through">
                  INR {safeCourse.original_fee.toLocaleString()}
                </span>
              </div>
            )}
            {safeCourse?.fee_note && (
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium block mt-0.5">
                {safeCourse.fee_note}
              </span>
            )}
          </div>

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
              {isLiveCourse ? 'Explore Course' : 'Start Learning'}
              <ArrowUpRight size={16} className="md:w-5 md:h-5 lg:w-6 lg:h-6 transition-transform duration-100 ease-out group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeCard; 