"use client";
import React, { useState, useRef, useCallback, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  Users,
  Play,
  Layers,
  ArrowUpRight,
  Clock,
  GraduationCap
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
  const pathname = usePathname();

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

  const isSelfPacedCourse = useMemo(() => {
    return !isLiveCourse && !isBlendedCourse;
  }, [isLiveCourse, isBlendedCourse]);

  // Navigation handler
  const navigateToCourse = useCallback(() => {
    // Home page special redirect for 4 courses
    const homePage = pathname === "/";
    const courseUrlMap: Record<string, string> = {
      "AI & Data Science": "/ai-and-data-science-course",
      "Personality Development": "/personality-development-course",
      "Vedic Mathematics": "/vedic-mathematics-course",
      "Digital Marketing with Data Analytics": "/digital-marketing-with-data-analytics-course"
    };
    const courseTitle = safeCourse?.course_title?.trim();
    if (homePage && courseTitle && courseUrlMap[courseTitle]) {
      router.push(courseUrlMap[courseTitle]);
      return;
    }

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
  }, [isLiveCourse, safeCourse, router, pathname]);

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
        stickyNoteBg: isJobGuaranteeCourse 
          ? 'bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-600' 
          : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500',
        stickyNoteText: isJobGuaranteeCourse 
          ? 'text-black font-black' 
          : 'text-white',
        accentColor: isJobGuaranteeCourse ? 'text-amber-600' : 'text-emerald-600',
        priceColor: isJobGuaranteeCourse 
          ? 'text-amber-700 dark:text-amber-400' 
          : 'text-emerald-700 dark:text-emerald-400',
        chipBg: isJobGuaranteeCourse 
          ? 'bg-amber-50 dark:bg-amber-900/20' 
          : 'bg-emerald-50 dark:bg-emerald-900/20',
        chipText: isJobGuaranteeCourse 
          ? 'text-amber-700 dark:text-amber-300' 
          : 'text-emerald-700 dark:text-emerald-300',
        chipBorder: isJobGuaranteeCourse 
          ? 'border-amber-200 dark:border-amber-700/50' 
          : 'border-emerald-200 dark:border-emerald-700/50',
        cardBorder: isJobGuaranteeCourse 
          ? 'border-amber-200/50 dark:border-amber-700/50 hover:border-amber-300/60 dark:hover:border-amber-600/60'
          : 'border-emerald-200/50 dark:border-emerald-700/50 hover:border-emerald-300/60 dark:hover:border-emerald-600/60',
        cardShadow: isJobGuaranteeCourse 
          ? 'shadow-amber-100/50 hover:shadow-amber-200/25 dark:hover:shadow-amber-800/25'
          : 'shadow-emerald-100/50 hover:shadow-emerald-200/25 dark:hover:shadow-emerald-800/25'
      };
    }
    
    if (isBlendedCourse) {
      return {
        stickyNoteBg: 'bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500',
        stickyNoteText: 'text-white',
        accentColor: 'text-purple-600',
        priceColor: 'text-purple-700 dark:text-purple-400',
        chipBg: 'bg-purple-50 dark:bg-purple-900/20',
        chipText: 'text-purple-700 dark:text-purple-300',
        chipBorder: 'border-purple-200 dark:border-purple-700/50',
        cardBorder: 'border-purple-200/50 dark:border-purple-700/50 hover:border-purple-300/60 dark:hover:border-purple-600/60',
        cardShadow: 'shadow-purple-100/50 hover:shadow-purple-200/25 dark:hover:shadow-purple-800/25'
      };
    }
    
    return {
      stickyNoteBg: 'bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500',
      stickyNoteText: 'text-white',
      accentColor: 'text-blue-600',
      priceColor: 'text-blue-700 dark:text-blue-400',
      chipBg: 'bg-blue-50 dark:bg-blue-900/20',
      chipText: 'text-blue-700 dark:text-blue-300',
      chipBorder: 'border-blue-200 dark:border-blue-700/50',
      cardBorder: 'border-blue-200/50 dark:border-blue-700/50 hover:border-blue-300/60 dark:hover:border-blue-600/60',
      cardShadow: 'shadow-blue-100/50 hover:shadow-blue-200/25 dark:hover:shadow-blue-800/25'
    };
  }, [isLiveCourse, isBlendedCourse]);

  // Get course type content
  const content = useMemo(() => {
    if (isLiveCourse) {
      return {
        tag: isJobGuaranteeCourse ? 'Job Guaranteed Course' : 'Live',
        mobileTag: isJobGuaranteeCourse ? 'Job Guaranteed' : 'Live',
        tagIcon: isJobGuaranteeCourse ? <GraduationCap className="w-3 h-3" /> : <Play className="w-3 h-3" />,
        sessionLabel: 'Sessions',
        sessionIcon: <Users size={12} />,
        isJobGuarantee: isJobGuaranteeCourse
      };
    }
    
    if (isBlendedCourse) {
      return {
        tag: 'Blended',
        tagIcon: <Layers className="w-3 h-3" />,
        sessionLabel: 'Videos + Live Q&A',
        sessionIcon: <Play size={12} />,
        isJobGuarantee: false
      };
    }
    
    return {
      tag: 'Self-Paced',
      tagIcon: <Play className="w-3 h-3" />,
      sessionLabel: 'Videos',
      sessionIcon: <Play size={12} />,
      isJobGuarantee: false
    };
  }, [isLiveCourse, isBlendedCourse, isJobGuaranteeCourse]);

  return (
    <>
      {/* Unified Layout - Desktop design for all screen sizes */}
      <div 
        ref={cardRef}
        className={`group relative flex flex-col 
        h-[300px] xs:h-[340px] sm:h-[380px] md:h-[428px] lg:h-[428px]
        w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[360px] md:max-w-[400px] 
        mx-auto rounded-xl overflow-hidden 
        border ${styles.cardBorder || 'border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/60 dark:hover:border-gray-600/60'}
        bg-white dark:bg-gray-900 
        shadow-sm hover:shadow-xl ${styles.cardShadow || 'hover:shadow-gray-200/25 dark:hover:shadow-gray-800/25'}
        transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01]
        transform-gpu will-change-transform cursor-pointer`}
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
            top-2 left-2 xs:top-3 xs:left-3 z-20 
            px-2 xs:px-3 py-1 xs:py-1.5 
            rounded-md xs:rounded-lg 
            text-xs xs:text-sm font-bold 
            ${styles.stickyNoteBg} ${styles.stickyNoteText}
            shadow-md xs:shadow-lg shadow-black/20
            transition-all duration-300 ease-out transform hover:scale-105
            ${isJobGuaranteeCourse ? 'animate-pulse' : ''}`}
          >
            <div className="flex items-center gap-1 xs:gap-1.5">
              {React.cloneElement(content.tagIcon, { 
                className: "w-3 h-3 xs:w-3.5 xs:h-3.5" 
              })}
              <span className="font-extrabold tracking-wide whitespace-nowrap">{content.tag}</span>
            </div>
          </div>
        </div>

        {/* Course content */}
        <div className="flex flex-col flex-grow p-2 xs:p-3 sm:p-3 md:p-4 lg:p-5 space-y-1.5 xs:space-y-2 sm:space-y-2 md:space-y-2.5 lg:space-y-3 relative">
          
          {/* Course Title */}
          <div className="text-left space-y-1 min-h-[32px] xs:min-h-[36px] sm:min-h-[40px] md:min-h-[50px] lg:min-h-[55px] flex flex-col justify-center">
            <h3 className="text-sm xs:text-base sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 dark:text-white leading-tight line-clamp-2">
              {safeCourse?.course_title || "Course Title"}
            </h3>
          </div>
          
          {/* Course Info - Chip Style */}
          <div className="text-left space-y-1.5 xs:space-y-2 sm:space-y-2 md:space-y-3 pb-8 xs:pb-10 sm:pb-12 md:pb-0">
            {isLiveCourse ? (
              <>
                {/* Live Course Chips */}
                <div className="flex items-center gap-1.5 xs:gap-2 flex-wrap">
                  {/* Duration Chip */}
                  <div className={`inline-flex items-center 
                    px-1.5 py-0.5 
                    rounded text-[10px] xs:text-xs font-medium
                    ${styles.chipBg} ${styles.chipText} border ${styles.chipBorder}`}>
                    <Clock size={10} className="mr-0.5" />
                    <span>{formatCourseDuration}</span>
                  </div>
                  
                  {/* Effort Chip */}
                  <div className={`inline-flex items-center 
                    px-1.5 py-0.5 
                    rounded text-[10px] xs:text-xs font-medium
                    ${styles.chipBg} ${styles.chipText} border ${styles.chipBorder}`}>
                    <Clock size={10} className="mr-0.5" />
                    <span>{formatEffort}</span>
                  </div>
                </div>
                
                {/* Sessions Chip */}
                <div className="flex items-center">
                  <div className={`inline-flex items-center 
                    px-1.5 py-0.5 
                    rounded text-[10px] xs:text-xs font-medium
                    ${styles.chipBg} ${styles.chipText} border ${styles.chipBorder}`}>
                    {React.cloneElement(content.sessionIcon, { 
                      className: "w-2.5 h-2.5 mr-0.5" 
                    })}
                    <span>{formatSessions}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Self-paced Course Chips */}
                <div className="flex items-center gap-1.5 xs:gap-2 flex-wrap">
                  {/* Self-paced Chip */}
                  <div className={`inline-flex items-center 
                    px-1.5 py-0.5 
                    rounded text-[10px] xs:text-xs font-medium
                    ${styles.chipBg} ${styles.chipText} border ${styles.chipBorder}`}>
                    <Play size={10} className="mr-0.5" />
                    <span>Self-paced</span>
                  </div>
                  
                  {/* Q&A Session Chip */}
                  <div className={`inline-flex items-center 
                    px-1.5 py-0.5 
                    rounded text-[10px] xs:text-xs font-medium
                    ${styles.chipBg} ${styles.chipText} border ${styles.chipBorder}`}>
                    <Users size={10} className="mr-0.5" />
                    <span>Q&A Session</span>
                  </div>
                </div>
                
                {/* Video Sessions Chip */}
                <div className="flex items-center">
                  <div className={`inline-flex items-center 
                    px-1.5 py-0.5 
                    rounded text-[10px] xs:text-xs font-medium
                    ${styles.chipBg} ${styles.chipText} border ${styles.chipBorder}`}>
                    {React.cloneElement(content.sessionIcon, { 
                      className: "w-2.5 h-2.5 mr-0.5" 
                    })}
                    <span>{formatSessions}</span>
                  </div>
                </div>
              </>
                        )}
          </div>
          
          {/* Desktop Price - Simple Left-aligned Text (no chip) */}
          <div className="hidden md:block text-left py-0.5 md:py-1">
            <div className="flex items-baseline justify-start gap-1 md:gap-1.5 flex-wrap">
              <span className={`text-base md:text-xl lg:text-2xl font-bold ${styles.priceColor} whitespace-nowrap ${isLiveCourse ? 'text-shadow-sm' : ''}`}>
                {formatPrice}
              </span>
              {isLiveCourse && (
                <span className={`text-xs md:text-sm ${styles.accentColor} font-semibold whitespace-nowrap`}>onwards</span>
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

        {/* Price Section - Mobile only */}
        
        {/* Mobile Price - Colored Chip (bottom right) */}
        <div className="md:hidden absolute bottom-1.5 right-1.5 xs:bottom-2 xs:right-2 sm:bottom-2.5 sm:right-2.5 z-10">
          <div className={`
            px-1.5 xs:px-2 sm:px-2.5 py-1 xs:py-1.5 sm:py-1.5
            rounded-md xs:rounded-md sm:rounded-lg
            ${styles.stickyNoteBg} ${styles.stickyNoteText}
            shadow-md shadow-black/15
            border border-white/20
            backdrop-blur-sm
            transition-all duration-300 ease-out hover:scale-105
            min-w-[80px] xs:min-w-[90px] sm:min-w-[100px]
          `}>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-baseline gap-1 whitespace-nowrap justify-center">
                <span className={`text-[10px] xs:text-xs sm:text-sm font-bold leading-tight`}>
                  {formatPrice}
                </span>
                {isLiveCourse && (
                  <span className={`text-[7px] xs:text-[8px] sm:text-[9px] font-semibold opacity-90 leading-tight`}>onwards</span>
                )}
              </div>
              {safeCourse?.original_fee && (
                <div className="mt-0.5">
                  <span className="text-[7px] xs:text-[8px] sm:text-[9px] opacity-75 line-through leading-tight">
                    INR {safeCourse.original_fee.toLocaleString()}
                  </span>
                </div>
              )}
              {safeCourse?.fee_note && (
                <span className="text-[6px] xs:text-[7px] sm:text-[8px] opacity-80 font-medium block mt-0.5 leading-tight text-center">
                  {safeCourse.fee_note}
                </span>
              )}
            </div>
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
