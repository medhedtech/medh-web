"use client";
import React, { useEffect, useState, useCallback, useContext, useMemo, memo } from "react";
import HomeCard from "@/components/sections/courses/HomeCard";
import { getAllCoursesWithLimits, getCoursesWithFields } from '@/apis/course/course';
import useGetQuery from "@/hooks/getQuery.hook";
import { BookOpen, ChevronRight, Layers, Sparkles, Video, Clock, Users, Filter, Loader2 } from "lucide-react";
import Link from "next/link";
import axios from 'axios';
import { apiUrls } from '@/apis/index';

import { VideoBackgroundContext } from '@/components/layout/main/Home2';
import { useTheme } from "next-themes";
import { useCourseImagePreloader } from '@/components/shared/ImagePreloader';
import { getImageProps, getSafeCourseImageUrl } from '@/utils/imageOptimization';
import OptimizedImage from '@/components/shared/OptimizedImage';

// PERFORMANCE OPTIMIZATION: Simplified styles without heavy caching
const getGlassmorphismStyles = (isDark: boolean): string => {
  
  const styles = `
    .glass-container {
      background: ${isDark ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.08)'};
      backdrop-filter: blur(25px);
      -webkit-backdrop-filter: blur(25px);
      border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.25)'};
      border-radius: 1.5rem;
      box-shadow: ${isDark ? '0 8px 32px rgba(0, 0, 0, 0.15)' : '0 8px 32px rgba(0, 0, 0, 0.06)'};
      position: relative;
      transform: translate3d(0, 0, 0);
      will-change: transform, opacity;
      backface-visibility: hidden;
    }
    
    .glass-stats {
      background: ${isDark ? 'rgba(15, 23, 42, 0.12)' : 'rgba(255, 255, 255, 0.15)'};
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.3)'};
      border-radius: 1rem;
      box-shadow: ${isDark ? '0 4px 20px rgba(0, 0, 0, 0.12)' : '0 4px 20px rgba(0, 0, 0, 0.04)'};
      position: relative;
      transform: translate3d(0, 0, 0);
      will-change: transform;
      backface-visibility: hidden;
    }
    
    .filter-button-active {
      background: ${isDark ? 'rgba(55, 147, 146, 0.20)' : 'rgba(55, 147, 146, 0.85)'};
      border-color: ${isDark ? 'rgba(55, 147, 146, 0.30)' : 'rgba(55, 147, 146, 0.60)'};
      color: ${isDark ? 'rgba(55, 147, 146, 1)' : 'rgba(255, 255, 255, 0.95)'};
      transform: translate3d(0, 0, 0);
      will-change: transform, background-color;
    }
    
    .glass-transition {
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
                  opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                  background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      transform: translate3d(0, 0, 0);
      will-change: transform, opacity, background-color;
    }
    
    .course-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
      justify-content: center;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 1rem;
      place-items: center;
    }
    
    @media (min-width: 640px) {
      .course-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
        padding: 0 1.5rem;
      }
    }
    
    @media (min-width: 1024px) {
      .course-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;
        padding: 0 2rem;
      }
    }
    
    @media (min-width: 1280px) {
      .course-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 2rem;
        padding: 0 2rem;
      }
    }
    
    @media (min-width: 1536px) {
      .course-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 2.5rem;
        padding: 0 3rem;
      }
    }
    
    /* GPU optimizations for mobile */
    @media (max-width: 768px) {
      .glass-container,
      .glass-stats {
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
      }
    }
    
    /* iOS-specific optimizations */
    @supports (-webkit-touch-callout: none) {
      .glass-container,
      .glass-stats,
      .filter-button-active,
      .glass-transition,
      .course-grid {
        -webkit-transform: translate3d(0, 0, 0);
        -webkit-backface-visibility: hidden;
      }
    }
  `;
  
  return styles;
};

// PERFORMANCE OPTIMIZATION: Optimized course interface
interface ICourse {
  _id: string;
  id?: string;
  course_title: string;
  title?: string;
  course_description?: string;
  description?: string;
  course_image?: string;
  thumbnail?: string;
  course_duration: string;
  duration_range?: string;
  course_fee?: string | number;
  price?: string | number;
  price_suffix?: string;
  url?: string;
  no_of_Sessions?: number | string;
  session_display?: string;
  session_range?: string;
  effort_hours?: string;
  efforts_per_Week?: string;
  learning_points?: string[];
  prerequisites?: string[];
  course_category?: string;
  category?: string;
  instructor?: {
    name: string;
    title: string;
    image: string;
  } | null;
  classType?: 'live' | 'blended' | 'self-paced';
  class_type?: string;
  highlights?: string[];
  createdAt?: string;
  updatedAt: string;
  status: string;
  video_count?: number;
  lectures_count?: number;
  qa_sessions?: number;
  isFree?: boolean;
  batchPrice?: number;
  prices?: Array<{
    currency: string;
    individual: number;
    batch: number;
    min_batch_size: number;
    max_batch_size: number;
    early_bird_discount: number;
    group_discount: number;
    is_active: boolean;
    _id: string;
  }>;
}

// PERFORMANCE OPTIMIZATION: Frozen fallback data to prevent mutations
const FALLBACK_LIVE_COURSES: readonly ICourse[] = Object.freeze([
  Object.freeze({
    _id: "ai_data_science",
    id: "ai_data_science",
    course_title: "AI & Data Science",
    course_description: "Master the fundamentals of artificial intelligence and data science with hands-on projects and industry mentorship.",
    url: "/ai-and-data-science-course",
    course_image: "/images/courses/ai-data-science.png",
    duration_range: "4-18 months",
    effort_hours: "4-6",
    no_of_Sessions: "32-120",
    session_display: "32 - 120 live sessions",
    session_range: "32 - 120 live sessions",
    learning_points: [
      "Python for Data Science",
      "Machine Learning Algorithms",
      "Deep Learning & Neural Networks",
      "Data Visualization & Analysis"
    ],
    prerequisites: ["Basic programming knowledge", "Interest in data and analytics"],
    highlights: ["Live interactive sessions", "Real-world projects", "Industry mentors", "Guaranteed internship opportunity"],
    instructor: {
      name: "Dr. Rajesh Kumar",
      title: "AI Specialist",
      image: "/instructors/rajesh-kumar.jpg"
    },
    prices: [
      {
        currency: "INR",
        individual: 32000,
        batch: 22400,
        min_batch_size: 2,
        max_batch_size: 10,
        early_bird_discount: 0,
        group_discount: 0,
        is_active: true,
        _id: "ai_data_science_inr"
      }
    ],
    course_duration: "4-18 months",
    updatedAt: new Date().toISOString(),
    status: "Published"
  } as ICourse),
  Object.freeze({
    _id: "digital_marketing",
    id: "digital_marketing",
    course_title: "Digital Marketing with Data Analytics",
    course_description: "Learn comprehensive digital marketing strategies including SEO, SEM, social media marketing, and analytics.",
    url: "/digital-marketing-course",
    course_image: "/images/courses/digital-marketing.png",
    duration_range: "3-12 months",
    effort_hours: "3-5",
    no_of_Sessions: "32-120",
    session_display: "32 - 120 live sessions",
    session_range: "32 - 120 live sessions",
    learning_points: [
      "SEO & SEM Strategies",
      "Social Media Marketing",
      "Content Marketing",
      "Analytics & Reporting"
    ],
    prerequisites: ["Basic computer skills", "Interest in marketing"],
    highlights: ["Live sessions", "Real campaigns", "Industry certification", "Job assistance"],
    instructor: {
      name: "Priya Sharma",
      title: "Digital Marketing Expert",
      image: "/instructors/priya-sharma.jpg"
    },
    prices: [
      {
        currency: "INR",
        individual: 25000,
        batch: 17500,
        min_batch_size: 2,
        max_batch_size: 8,
        early_bird_discount: 0,
        group_discount: 0,
        is_active: true,
        _id: "digital_marketing_inr"
      }
    ],
    course_duration: "3-12 months",
    updatedAt: new Date().toISOString(),
    status: "Published"
  } as ICourse),
  Object.freeze({
    _id: "personality_development",
    id: "personality_development",
    course_title: "Personality Development",
    course_description: "Enhance your communication skills, confidence, and overall personality with expert guidance and practical exercises.",
    url: "/personality-development-course",
    course_image: "/images/courses/pd.jpg",
    duration_range: "3-9 months",
    effort_hours: "2-4",
    no_of_Sessions: "24-72",
    session_display: "24 - 72 live sessions",
    session_range: "24 - 72 live sessions",
    learning_points: [
      "Communication Skills",
      "Confidence Building",
      "Body Language",
      "Public Speaking"
    ],
    prerequisites: ["Basic communication skills", "Willingness to learn"],
    highlights: ["Interactive sessions", "Personality assessments", "Expert mentorship", "Practical exercises"],
    instructor: {
      name: "Ms. Anita Verma",
      title: "Personality Development Coach",
      image: "/instructors/anita-verma.jpg"
    },
    prices: [
      {
        currency: "INR",
        individual: 18000,
        batch: 12600,
        min_batch_size: 2,
        max_batch_size: 8,
        early_bird_discount: 0,
        group_discount: 0,
        is_active: true,
        _id: "personality_development_inr"
      }
    ],
    course_duration: "3-9 months",
    updatedAt: new Date().toISOString(),
    status: "Published"
  } as ICourse),
  Object.freeze({
    _id: "vedic_mathematics",
    id: "vedic_mathematics",
    course_title: "Vedic Mathematics",
    course_description: "Master ancient Indian mathematical techniques for faster calculations and enhanced problem-solving skills.",
    url: "/vedic-mathematics-course",
    course_image: "/images/courses/vd.jpg",
    duration_range: "2-8 months",
    effort_hours: "2-3",
    no_of_Sessions: "24-72",
    session_display: "24 - 72 live sessions",
    session_range: "24 - 72 live sessions",
    learning_points: [
      "Mental Math Techniques",
      "Speed Calculation Methods",
      "Problem Solving Strategies",
      "Mathematical Shortcuts"
    ],
    prerequisites: ["Basic arithmetic knowledge", "Interest in mathematics"],
    highlights: ["Ancient techniques", "Speed enhancement", "Interactive practice", "Expert guidance"],
    instructor: {
      name: "Prof. Ramesh Gupta",
      title: "Mathematics Expert",
      image: "/instructors/ramesh-gupta.jpg"
    },
    prices: [
      {
        currency: "INR",
        individual: 15000,
        batch: 10500,
        min_batch_size: 2,
        max_batch_size: 10,
        early_bird_discount: 0,
        group_discount: 0,
        is_active: true,
        _id: "vedic_mathematics_inr"
      }
    ],
    course_duration: "2-8 months",
    updatedAt: new Date().toISOString(),
    status: "Published"
  } as ICourse)
]);

// PERFORMANCE OPTIMIZATION: Utility functions
const formatDurationRange = (durationRange: string | undefined): string => {
  if (!durationRange) return "Flexible Duration";
  const trimmed = durationRange.trim();
  // Convert numeric hyphen ranges (e.g., "4-18 months") to "4 to 18 months"
  const hyphenMatch = trimmed.match(/^(\d+)\s*-\s*(\d+)(.*)$/);
  if (hyphenMatch) {
    const [, start, end, rest] = hyphenMatch;
    return `${start} to ${end}${rest}`;
  }
  return trimmed;
};

// Add helper for session range formatting
const formatSessionRange = (sessionRange: string | number | undefined): string => {
  if (!sessionRange) return "";
  const rangeStr = String(sessionRange).trim();
  
  // Handle "X - Y live sessions" format
  const sessionMatch = rangeStr.match(/^(\d+)\s*-\s*(\d+)\s*(.*sessions.*)$/i);
  if (sessionMatch) {
    const [, start, end, rest] = sessionMatch;
    return `${start} to ${end} ${rest.trim()}`;
  }
  
  // Handle "X-Y" format
  const numericMatch = rangeStr.match(/^(\d+)\s*-\s*(\d+)$/);
  if (numericMatch) {
    const [, start, end] = numericMatch;
    return `${start} to ${end} live sessions`;
  }
  
  // If it's just a number, return it with "live sessions"
  if (/^\d+$/.test(rangeStr)) {
    return `${rangeStr} live sessions`;
  }
  
  return rangeStr;
};

const getDisplayDurationRange = (durationRange: string | undefined, courseType: 'live' | 'blended' = 'live'): string => {
  if (!durationRange) {
    return courseType === 'live' ? "4 to 18 months" : "Self-paced";
  }
  // Handle cases where duration is already in months format
  if (durationRange.toLowerCase().includes('month')) {
    return formatDurationRange(durationRange);
  }
  // Add 'months' suffix if not present
  const formattedRange = formatDurationRange(durationRange);
  return formattedRange.toLowerCase().includes('month') ? formattedRange : `${formattedRange} months`;
};

const getBlendedCourseSessions = (course: ICourse) => {
  // Use actual no_of_Sessions from API first, then fallback to video_count, then lectures_count
  const actualSessions = course.no_of_Sessions;
  const videoCount = typeof actualSessions === 'number' 
    ? actualSessions 
    : (typeof course.video_count === 'number' 
      ? course.video_count 
      : (typeof course.lectures_count === 'number' ? course.lectures_count : 20));
  
  const qnaSessions = typeof course.qa_sessions === 'number' 
    ? course.qa_sessions 
    : 0; // Default to 0 instead of 5 to match API data
  
  return { videoCount, qnaSessions };
};

// PERFORMANCE OPTIMIZATION: GPU-optimized ViewAllButton component
const ViewAllButton = memo<{ href: string; text: string; isDark: boolean }>(({ href, text, isDark }) => {
  const buttonClasses = useMemo(() => {
    return `inline-flex items-center px-4 py-2 glass-stats rounded-lg text-sm font-medium glass-transition hover-scale-gpu gpu-accelerated min-h-[44px] touch-manipulation ${
      isDark 
        ? 'text-white hover:bg-white/10' 
        : 'text-gray-900 hover:bg-black/5'
    }`;
  }, [isDark]);

  return (
    <Link href={href} className={buttonClasses}>
      <span>{text}</span>
      <ChevronRight size={16} className="ml-1 transition-gpu" />
    </Link>
  );
});

ViewAllButton.displayName = 'ViewAllButton';

// PERFORMANCE OPTIMIZATION: GPU-optimized FilterButton component
const FilterButton = memo<{
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isDark: boolean;
}>(({ active, icon, label, onClick, isDark }) => {
  const buttonClasses = useMemo(() => {
    return `inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium glass-transition hover-scale-gpu gpu-accelerated min-h-[44px] touch-manipulation ${
      active 
        ? 'filter-button-active' 
        : `glass-stats ${isDark ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-black/5'}`
    }`;
  }, [active, isDark]);

  return (
    <button onClick={onClick} className={buttonClasses}>
      <div className="transition-gpu">{icon}</div>
      <span className="ml-2">{label}</span>
    </button>
  );
});

FilterButton.displayName = 'FilterButton';

// PERFORMANCE OPTIMIZATION: GPU-optimized EmptyState component
const EmptyState = memo<{ type: 'live' | 'blended'; isDark: boolean }>(({ type, isDark }) => {
  const iconClasses = useMemo(() => {
    return `w-16 h-16 mx-auto mb-4 transition-gpu gpu-accelerated ${isDark ? 'text-gray-400' : 'text-gray-500'}`;
  }, [isDark]);

  const textClasses = useMemo(() => {
    return `text-lg font-semibold mb-2 transition-gpu ${isDark ? 'text-white' : 'text-gray-900'}`;
  }, [isDark]);

  const descriptionClasses = useMemo(() => {
    return `text-sm transition-gpu ${isDark ? 'text-gray-400' : 'text-gray-600'}`;
  }, [isDark]);

  return (
    <div className="text-center py-12 gpu-accelerated">
      <BookOpen className={iconClasses} />
      <h3 className={textClasses}>
        No {type} courses available
      </h3>
      <p className={descriptionClasses}>
        {type === 'live' 
          ? 'Live courses will be available soon. Check back later!'
          : 'Blended courses will be available soon. Check back later!'
        }
      </p>
    </div>
  );
});

EmptyState.displayName = 'EmptyState';

// PERFORMANCE OPTIMIZATION: GPU-optimized HomeCardWrapper component
const HomeCardWrapper = memo<{
  course: ICourse;
  courseType: 'live' | 'blended';
  index: number;
}>(({ course, courseType, index }) => {
  const enhancedCourse = useMemo(() => {
    if (courseType === 'live') {
      const { videoCount, qnaSessions } = getBlendedCourseSessions(course);
      const batchPrice = course.prices?.[0]?.batch || null;
      const displayPrice = batchPrice || course.prices?.[0]?.individual || null;

      // Process course image using safe image URL function
      const courseImage = getSafeCourseImageUrl(
        course.course_image || course.thumbnail,
        course._id,
        course.course_title
      );

      return {
        _id: course._id || course.id || `live-course-${index}`,
        course_title: course.course_title || course.title || 'Untitled Course',
        course_description: course.course_description || course.description,
        course_image: courseImage,
        course_duration: getDisplayDurationRange(course.duration_range || course.course_duration, 'live'),
        duration_range: course.duration_range || course.course_duration || "4-18 months",
        course_category: course.course_category || course.category || 'Uncategorized',
        prices: course.prices || [],
        course_fee: Number(displayPrice) || 1499,
        no_of_Sessions: (() => {
          // First check session_display or session_range
          if (course.session_display) {
            return formatSessionRange(course.session_display);
          }
          if (course.session_range) {
            return formatSessionRange(course.session_range);
          }
          
          // Then check no_of_Sessions
          if (course.no_of_Sessions) {
            return formatSessionRange(course.no_of_Sessions);
          }
          
          // Fallback logic for pricing-based sessions
          const individualPrice = course.prices?.[0]?.individual || 0;
          if (individualPrice <= 1500) return "10 live sessions";
          if (individualPrice <= 3000) return "20 live sessions";
          return `${videoCount + qnaSessions} live sessions`;
        })(),
        session_display: (() => {
          if (course.session_display) return course.session_display;
          if (course.session_range) return course.session_range;
          if (course.no_of_Sessions) return formatSessionRange(course.no_of_Sessions);
          return "Live sessions";
        })(),
        effort_hours: typeof course.effort_hours === 'string' 
          ? parseInt(course.effort_hours, 10) || 8
          : (course.effort_hours || course.efforts_per_Week ? 
            (typeof course.efforts_per_Week === 'string' ? parseInt(course.efforts_per_Week, 10) || 8 : course.efforts_per_Week || 8) 
            : 8),
        class_type: 'Live Courses',
        classType: 'live' as const,
        is_live_course: true,
        isFree: Boolean(course.isFree) || false,
        batchPrice: batchPrice || undefined,
        url: `/enrollment/${(course.course_category || course.category || course.course_title)?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`,
        learning_points: course.learning_points || [],
        prerequisites: course.prerequisites || [],
        instructor: course.instructor || null,
        highlights: course.highlights || []
      };
    } else {
      const { videoCount, qnaSessions } = getBlendedCourseSessions(course);
      
      // Process course image using safe image URL function
      const courseImage = getSafeCourseImageUrl(
        course.course_image || course.thumbnail,
        course._id,
        course.course_title
      );
      
      return {
        _id: course._id,
        course_title: course.course_title,
        course_description: course.course_description || course.description,
        course_image: courseImage,
        course_duration: "Self Paced",
        prices: course.prices || [],
        course_fee: course.prices?.[0]?.individual || 1499,
        no_of_Sessions: (() => {
          const rawSessions = course.no_of_Sessions as any;
          const parsedSessions = typeof rawSessions === 'string' ? parseInt(rawSessions, 10) : rawSessions;
          if (!isNaN(parsedSessions) && parsedSessions > 0) {
            return parsedSessions;
          }

          const individualPrice = course.prices?.[0]?.individual || 0;
          if (individualPrice <= 1500) return 10;
          if (individualPrice <= 3000) return 20;

          return videoCount + qnaSessions;
        })(),
                                session_display: course.session_display || `${course.no_of_Sessions || videoCount} video sessions`,
                        efforts_per_Week: course.efforts_per_Week || "3-4 hrs/week",
        effort_hours: typeof course.effort_hours === 'string' 
          ? parseInt(course.effort_hours, 10) || 5
          : (course.effort_hours || course.efforts_per_Week ? 
            (typeof course.efforts_per_Week === 'string' ? parseInt(course.efforts_per_Week, 10) || 5 : course.efforts_per_Week || 5) 
            : 5),
        class_type: 'Blended Courses',
        classType: 'blended' as const,
        is_blended_course: true,
        isFree: course.isFree || false,
        batchPrice: course.prices?.[0]?.batch || undefined,
        course_category: course.course_category || course.category || 'Uncategorized',
        learning_points: course.learning_points || [],
        prerequisites: course.prerequisites || [],
        instructor: course.instructor || null,
        highlights: course.highlights || []
      };
    }
  }, [course, courseType, index]);

  return (
    <HomeCard 
      course={enhancedCourse}
      courseType={courseType}
      index={index}
      isLCP={index < 2}
      variant="standard"
    />
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.course._id === nextProps.course._id &&
    prevProps.courseType === nextProps.courseType &&
    prevProps.index === nextProps.index
  );
});

HomeCardWrapper.displayName = 'HomeCardWrapper';

// Define ImageWrapper props interface
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
const ImageWrapper: React.FC<ImageWrapperProps> = ({ 
  src, 
  alt, 
  onLoad, 
  onError, 
  priority = false, 
  isLCP = false,
  index = 0 
}) => {
  // Determine if this is an LCP candidate (first 2 images above the fold)
  const shouldBeLCP = isLCP || index < 2;

  // Ensure we have valid props
  const validSrc = src || '/fallback-course-image.jpg';
  const validAlt = alt || 'Course Image';

  return (
    <div className="relative w-full aspect-[16/9] bg-gray-100 dark:bg-gray-800/50 overflow-hidden rounded-t-xl group">
      <OptimizedImage
        src={validSrc}
        alt={validAlt}
        fill={true}
        className="object-cover transition-opacity duration-300"
        quality={shouldBeLCP ? 95 : 85}
        priority={shouldBeLCP}
        placeholder="blur"
        onLoad={onLoad}
        onError={onError}
        loading={shouldBeLCP ? 'eager' : 'lazy'}
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        fallbackSrc="/fallback-course-image.jpg"
      />
      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 dark:from-black/20 dark:to-black/40 transition-opacity group-hover:opacity-70" />
    </div>
  );
};

// PERFORMANCE OPTIMIZATION: GPU-optimized main component with comprehensive memoization
const HomeCourseSection2 = memo<{
  CustomText?: string;
  CustomDescription?: string;
  scrollToTop?: () => void;
  hideGradeFilter?: boolean;
  showOnlyLive?: boolean;
}>(({ 
  CustomText = "Featured Courses",
  CustomDescription = "Explore our curated selection of blended and live learning experiences",
  scrollToTop,
  showOnlyLive = false 
}) => {
  const { theme } = useTheme();
  const videoContext = useContext(VideoBackgroundContext);
  const [mounted, setMounted] = useState(false);
  const [blendedCourses, setBlendedCourses] = useState<ICourse[]>([]);
  const [liveCourses, setLiveCourses] = useState<ICourse[]>([]);
  const [activeBlendedFilters, setActiveBlendedFilters] = useState({
    popular: false,
    latest: false,
    beginner: false
  });
  const [userCurrency] = useState("INR"); // Fixed to INR to prevent state changes
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { getQuery, loading, error } = useGetQuery();
  
  // PERFORMANCE OPTIMIZATION: Memoized computed values
  const isDark = useMemo(() => mounted ? theme === 'dark' : true, [mounted, theme]);
  const isLoaded = useMemo(() => videoContext?.isLoaded ?? false, [videoContext?.isLoaded]);

  // PERFORMANCE OPTIMIZATION: Stable course fetching with minimal dependencies
  const fetchCourses = useCallback(async () => {
    try {
      const promises = [];

      // Fetch live courses using the same approach as HomeCourseSection.tsx
      if (!showOnlyLive || showOnlyLive) {
        const fetchLiveCoursesPromise = new Promise<boolean>((resolve) => {
          const apiUrl = apiUrls.home.getHomeFields({
            fields: ['card'],
            filters: {
              currency: 'inr'  // Force INR for Indian users
            }
          });
          
          console.log(`Making live courses API call with URL: ${apiUrl}`);
          
          getQuery({
            url: apiUrl,
            skipCache: true,
            requireAuth: false,
            onSuccess: (response) => {
              console.log("Live Courses API Response received:", response);
              
              let processedCourses: ICourse[] = [];
              
              try {
                // Enhanced response validation - check for null/undefined first
                if (!response) {
                  console.log("Response is null/undefined, using fallback data");
                  processedCourses = [...FALLBACK_LIVE_COURSES];
                } else if (Array.isArray(response) && response.length > 0) {
                  console.log(`Found ${response.length} live courses from API (direct array)`);
                  processedCourses = response;
                } else if (response && response.data && Array.isArray(response.data)) {
                  console.log(`Found ${response.data.length} live courses from API (in data property)`);
                  processedCourses = response.data;
                } else if (response && response.courses && Array.isArray(response.courses)) {
                  console.log(`Found ${response.courses.length} live courses from API (in courses property)`);
                  processedCourses = response.courses;
                } else if (response && response.success && response.data && Array.isArray(response.data)) {
                  console.log(`Found ${response.data.length} live courses from API (success wrapper)`);
                  processedCourses = response.data;
                } else {
                  console.log("No valid live courses found in the API response, using fallback data. Response structure:", typeof response, Object.keys(response || {}));
                  processedCourses = [...FALLBACK_LIVE_COURSES];
                }
                
                // Process each course with proper type checking and session range formatting
                const formattedCourses = processedCourses.map((course, index) => {
                  const courseId = course._id || course.id || `live-course-${index}`;
                  const courseTitle = course.course_title || course.title || 'Untitled Course';
                  
                  // Set specific images for known courses
                  let courseImage = course.course_image || course.thumbnail || '/fallback-course-image.jpg';
                  if (courseId === 'ai_data_science' || courseTitle.toLowerCase().includes('ai') || courseTitle.toLowerCase().includes('data science')) {
                    courseImage = '/images/courses/ai-data-science.png';
                  } else if (courseId === 'digital_marketing' || courseTitle.toLowerCase().includes('digital marketing')) {
                    courseImage = '/images/courses/digital-marketing.png';
                  } else if (courseId === 'personality_development' || courseTitle.toLowerCase().includes('personality development')) {
                    courseImage = '/images/courses/pd.jpg';
                  } else if (courseId === 'vedic_mathematics' || courseTitle.toLowerCase().includes('vedic mathematics')) {
                    courseImage = '/images/courses/vd.jpg';
                  }
                  
                  // Format session range based on course type and API data
                  const getSessionRange = (course: any) => {
                    if (course.session_display) {
                      return course.session_display;
                    }
                    if (course.session_range) {
                      return course.session_range;
                    }
                    if (course.no_of_Sessions) {
                      const sessionsStr = String(course.no_of_Sessions).trim();
                      // Handle range format like "24-120" or "32-120"
                      if (sessionsStr.includes('-')) {
                        const parts = sessionsStr.split('-');
                        if (parts.length === 2) {
                          const min = parts[0].trim();
                          const max = parts[1].trim();
                          return `${min} to ${max} live sessions`;
                        }
                      }
                      // Handle single number format
                      return `${sessionsStr} live sessions`;
                    }
                    return '24 to 120 live sessions'; // Default fallback
                  };
                  
                  const sessionDisplay = getSessionRange(course);
                  
                  // Extract numeric session count for compatibility (use midpoint of range)
                  const sessionCount = (() => {
                    if (course.no_of_Sessions) {
                      const rangeStr = String(course.no_of_Sessions);
                      const parts = rangeStr.split('-');
                      if (parts.length === 2) {
                        const min = parseInt(parts[0], 10);
                        const max = parseInt(parts[1], 10);
                        return Math.round((min + max) / 2);
                      }
                      // If it's a single number, use it directly
                      const singleNumber = parseInt(rangeStr, 10);
                      if (!isNaN(singleNumber)) {
                        return singleNumber;
                      }
                    }
                    return 76; // Default midpoint
                  })();
                  
                  return {
                    ...course,
                    _id: courseId,
                    id: courseId,
                    classType: 'live' as const,
                    course_title: courseTitle,
                    course_category: course.course_category || course.category || 'Uncategorized',
                    course_image: courseImage,
                    course_duration: getDisplayDurationRange(course.duration_range, 'live'),
                    duration_range: course.duration_range || course.course_duration || "4-18 months",
                    class_type: 'Live Courses',
                    prices: Array.isArray(course.prices) ? course.prices : [],
                    status: course.status || "Published",
                    updatedAt: course.updatedAt || new Date().toISOString(),
                    createdAt: course.createdAt || new Date().toISOString(),
                                            url: `/enrollment/${(course.course_category || course.category || courseTitle)?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`,
                        effort_hours: course.effort_hours,
                        no_of_Sessions: sessionDisplay, // Use formatted display string
                        session_display: sessionDisplay,
                        session_range: sessionDisplay, // Add for easy access
                        efforts_per_Week: course.efforts_per_Week || "4 hrs/week",
                        instructor: course.instructor,
                    price_suffix: course.price_suffix
                  } as ICourse;
                });
                
                console.log("Processed live courses count:", formattedCourses.length);
                setLiveCourses(formattedCourses);
                resolve(true);
              } catch (parseError) {
                console.error("Error processing live courses data:", parseError);
                setLiveCourses([...FALLBACK_LIVE_COURSES]);
                resolve(true);
              }
            },
            onFail: (error: any) => {
              console.error("Error fetching live courses:", error);
              setLiveCourses([...FALLBACK_LIVE_COURSES]);
              resolve(true);
            }
          });
        });
        promises.push(fetchLiveCoursesPromise);
      }

      // Fetch blended courses
      if (!showOnlyLive) {
        const fetchBlendedCoursesPromise = new Promise<boolean>((resolve) => {
          // Fetch ONLY blended courses using getCoursesWithFields
          const blendedApiUrl = getCoursesWithFields({
            page: 1,
            limit: 8,
            status: "Published",
            fields: ['card'],
            filters: {
              class_type: "Blended Courses",
              currency: 'inr'
            }
          });
          
          console.log(`Making blended courses API call with URL: ${blendedApiUrl}`);
          
          getQuery({
            url: blendedApiUrl,
            onSuccess: (response) => {
              console.log("Blended Courses API Response received:", response);
              
              // Process the blended courses with better error handling
              try {
                let coursesToProcess: any[] = [];
                
                // Enhanced response validation - check for null/undefined first
                if (!response) {
                  console.log("Response is null/undefined, setting empty blended courses");
                  setBlendedCourses([]);
                } else if (Array.isArray(response)) {
                  console.log(`Found ${response.length} blended courses from API (direct array)`);
                  coursesToProcess = response;
                } else if (response && response.data && Array.isArray(response.data)) {
                  console.log(`Found ${response.data.length} blended courses from API (in data property)`);
                  coursesToProcess = response.data;
                } else if (response && response.courses && Array.isArray(response.courses)) {
                  console.log(`Found ${response.courses.length} blended courses from API (in courses property)`);
                  coursesToProcess = response.courses;
                } else if (response && response.success && response.data && Array.isArray(response.data)) {
                  console.log(`Found ${response.data.length} blended courses from API (success wrapper)`);
                  coursesToProcess = response.data;
                } else {
                  console.log("No blended courses found in the API response. Response structure:", typeof response, Object.keys(response || {}));
                  setBlendedCourses([]);
                  resolve(true);
                  return;
                }
                
                // Process the courses if we have any
                if (coursesToProcess.length > 0) {
                  const processedCourses = coursesToProcess.map((course: any) => {
                    return {
                      ...course,
                      classType: 'blended', // Explicitly set classType
                      course_title: course.course_title || 'Untitled Course',
                      course_category: course.course_category || 'Uncategorized',
                      course_image: getSafeCourseImageUrl(course.course_image || course.thumbnail, course._id, course.course_title) || '/fallback-course-image.jpg'
                    };
                  });
                  
                  console.log("Processed blended courses:", processedCourses.length);
                  setBlendedCourses(processedCourses);
                } else {
                  console.log("No courses to process, setting empty array");
                  setBlendedCourses([]);
                }
              } catch (error) {
                console.error("Error processing blended courses:", error);
                setBlendedCourses([]);
              }
              resolve(true);
            },
            onFail: (error: any) => {
              console.error('Error fetching blended courses:', error);
              setBlendedCourses([]);
              resolve(false);
            }
          });
        });
        promises.push(fetchBlendedCoursesPromise);
      }

      await Promise.all(promises);
    } catch (error) {
      console.error('Error in fetchCourses:', error);
    }
  }, [showOnlyLive, getQuery]);

  // PERFORMANCE OPTIMIZATION: Mount and theme effects (like HeroSectionContant.tsx)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Track screen size for mobile responsiveness
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let timeoutId: NodeJS.Timeout;
    
    const checkMobile = () => {
      const isMobileNow = window.innerWidth < 768; // md breakpoint
      setIsMobile(prev => {
        if (prev !== isMobileNow) {
          return isMobileNow;
        }
        return prev;
      });
    };
    
    const debouncedCheckMobile = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 150); // Increased debounce time
    };
    
    // Initial check
    checkMobile();
    
    window.addEventListener('resize', debouncedCheckMobile, { passive: true });
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedCheckMobile);
    };
  }, []);

  // PERFORMANCE OPTIMIZATION: Theme-aware style injection
  useEffect(() => {
    if (!mounted) return;
    
    const existingStyle = document.getElementById('home-course-section-glassmorphism-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    const styleSheet = document.createElement("style");
    styleSheet.id = 'home-course-section-glassmorphism-styles';
    styleSheet.innerText = getGlassmorphismStyles(isDark);
    document.head.appendChild(styleSheet);
    
    return () => {
      const styleToRemove = document.getElementById('home-course-section-glassmorphism-styles');
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [mounted, isDark]);

  // PERFORMANCE OPTIMIZATION: Single initialization effect
  useEffect(() => {
    if (!mounted) return;
    
    let isStale = false;
    
    const initializeComponent = async () => {
      if (isStale) return;
      
      console.log('Component initializing...');
      
      // Set INR in localStorage for consistency
      localStorage.setItem('userCurrency', 'INR');
      localStorage.setItem('userCurrencyTimestamp', Date.now().toString());
      
      if (!isStale) {
        setIsInitialized(true);
        // Fetch courses after initialization
        try {
          await fetchCourses();
        } catch (error) {
          console.error('Error in fetchCourses during initialization:', error);
        }
      }
    };
    
    if (!isInitialized) {
      initializeComponent();
    }
    
    return () => {
      isStale = true;
    };
  }, [mounted, isInitialized, fetchCourses]);

  // PERFORMANCE OPTIMIZATION: Separate effect for showOnlyLive changes
  useEffect(() => {
    if (!mounted || !isInitialized) return;
    
    let isStale = false;
    
    const refetchCourses = async () => {
      if (isStale) return;
      
      console.log('Refetching courses due to showOnlyLive change...');
      try {
        await fetchCourses();
      } catch (error) {
        console.error('Error in fetchCourses during refetch:', error);
      }
    };
    
    refetchCourses();
    
    return () => {
      isStale = true;
    };
  }, [showOnlyLive]);

  // PERFORMANCE OPTIMIZATION: Memoized filter handlers
  const toggleBlendedFilter = useCallback((filter: keyof typeof activeBlendedFilters) => {
    setActiveBlendedFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  }, []);

  // PERFORMANCE OPTIMIZATION: Memoized filtered courses
  const filteredBlendedCourses = useMemo(() => {
    const filtered = blendedCourses.filter(course => {
      if (!activeBlendedFilters.popular && !activeBlendedFilters.latest && !activeBlendedFilters.beginner) {
        return true;
      }
      
      let matches = false;
      
      if (activeBlendedFilters.popular) {
        matches = matches || course.course_title.toLowerCase().includes('popular');
      }
      
      if (activeBlendedFilters.latest) {
        const courseDate = new Date(course.updatedAt);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        matches = matches || courseDate > thirtyDaysAgo;
      }
      
      if (activeBlendedFilters.beginner) {
        matches = matches || course.course_title.toLowerCase().includes('beginner') || 
                  (course.course_description?.toLowerCase().includes('beginner') ?? false);
      }
      
      return matches;
    });

    // Limit to 4 courses on mobile view
    return isMobile ? filtered.slice(0, 4) : filtered;
  }, [blendedCourses, activeBlendedFilters, isMobile]);

  // PERFORMANCE OPTIMIZATION: GPU-optimized memoized class names
  const containerClasses = useMemo(() => {
    return `w-full py-8 sm:py-10 md:py-12 relative overflow-hidden gpu-accelerated ${
      !isDark ? 'bg-gradient-to-br from-gray-50/30 via-white/20 to-gray-100/40' : ''
    }`;
  }, [isDark]);

  const headerClasses = useMemo(() => {
    return "flex flex-col md:flex-row md:items-center justify-center md:justify-between mb-10 sm:mb-12 md:mb-16 lg:mb-20 px-3 sm:px-4 md:px-8 lg:px-10 relative z-10 gpu-accelerated text-center md:text-left";
  }, []);

  const titleClasses = useMemo(() => {
    return "text-sm md:text-2xl lg:text-base font-extrabold mb-1 sm:mb-2 md:mb-3 dark:text-gray-300 max-w-2xl font-medium transition-gpu";
  }, []);

  const descriptionClasses = useMemo(() => {
    return "text-2xl md:text-base lg:text-3xl text-gray-600 text-gray-800 dark:text-white font-bold transition-gpu";
  }, []);

  // GPU-optimized loading state
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white dark:bg-gray-900 rounded-2xl shadow-sm gpu-accelerated">
        <div className="w-20 h-20 mb-6 text-primary-500 animate-spin-gpu gpu-accelerated">
          <Loader2 size={80} />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-gpu">
          Loading Courses
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md text-center transition-gpu">
          Please wait while we fetch the latest courses for you.
        </p>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {/* Section Header */}
      <div className={headerClasses}>
        <div>
          <h2 className={titleClasses}>
            {CustomText}
          </h2>
          <p className={descriptionClasses}>
            {CustomDescription}
          </p>
        </div>
        <div className="mt-2 sm:mt-3 md:mt-0 hidden md:block">
          <ViewAllButton 
            href="/courses" 
            text="View All Courses"
            isDark={isDark}
          />
        </div>
      </div>

              {/* GPU-optimized Live Courses Section */}
        <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16 px-3 sm:px-4 md:px-6 lg:px-8 gpu-accelerated">
          <div className="flex items-center justify-center mb-6 sm:mb-8 gpu-accelerated">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#3bac63] dark:text-[#3bac63] transition-gpu">
              Live Interactive Courses
            </h3>
          </div>

        {liveCourses.length > 0 ? (
          <div className="relative overflow-visible">
            <div className="course-grid gpu-accelerated">
              {liveCourses.map((course, index) => (
                <HomeCardWrapper 
                  key={course._id}
                  course={course}
                  courseType="live"
                  index={index}
                />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState type="live" isDark={isDark} />
        )}
      </div>

              {/* GPU-optimized Blended Courses Section */}
        {!showOnlyLive && (
          <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16 px-3 sm:px-4 md:px-6 lg:px-8 gpu-accelerated">
            <div className="flex flex-col items-center justify-center text-center gap-2 mb-6 sm:mb-8 gpu-accelerated">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#3bac63] dark:text-[#3bac63] transition-gpu">
                Self-Paced Blended Courses
              </h3>
              <p className="text-xs mt-1 text-black dark:text-[#3bac63] transition-gpu">
                (Interactive Video Courses with live doubt-clearing sessions)
              </p>
            </div>

          {filteredBlendedCourses.length > 0 ? (
            <div className="relative overflow-visible">
              <div className="course-grid gpu-accelerated">
                {filteredBlendedCourses.map((course, index) => (
                  <HomeCardWrapper 
                    key={course._id}
                    course={course}
                    courseType="blended"
                    index={index}
                  />
                ))}
              </div>
            </div>
          ) : (
            <EmptyState type="blended" isDark={isDark} />
          )}
        </div>
      )}

      {/* GPU-optimized Mobile View All Button */}
      <div className="block md:hidden px-3 sm:px-4 md:px-6 lg:px-8 gpu-accelerated text-center mt-8">
        <ViewAllButton 
          href="/courses" 
          text="View All Courses"
          isDark={isDark}
        />
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.CustomText === nextProps.CustomText &&
    prevProps.CustomDescription === nextProps.CustomDescription &&
    prevProps.showOnlyLive === nextProps.showOnlyLive
  );
});

HomeCourseSection2.displayName = 'HomeCourseSection2';

export default HomeCourseSection2; 