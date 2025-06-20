"use client";
import React, { useEffect, useState, useCallback, useContext, useMemo, memo } from "react";
import CourseCard from "@/components/sections/courses/CourseCard";
import { getAllCoursesWithLimits, getCoursesWithFields } from '@/apis/course/course';
import useGetQuery from "@/hooks/getQuery.hook";
import { BookOpen, ChevronRight, Layers, Sparkles, Video, Clock, Users, Filter, Loader2 } from "lucide-react";
import Link from "next/link";
import axios from 'axios';
import { apiUrls } from '@/apis/index';

import { VideoBackgroundContext } from '@/components/layout/main/Home2';
import { useTheme } from "next-themes";

// PERFORMANCE OPTIMIZATION: Move constants outside component to prevent recreation
const GLASSMORPHISM_STYLES_CACHE = new Map<boolean, string>();

// PERFORMANCE OPTIMIZATION: Memoized glassmorphism styles with caching
const getGlassmorphismStyles = (isDark: boolean): string => {
  if (GLASSMORPHISM_STYLES_CACHE.has(isDark)) {
    return GLASSMORPHISM_STYLES_CACHE.get(isDark)!;
  }
  
  const styles = `
    .glass-container {
      background: ${isDark ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.08)'};
      backdrop-filter: blur(25px);
      border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.25)'};
      border-radius: 1.5rem;
      box-shadow: ${isDark ? '0 8px 32px rgba(0, 0, 0, 0.15)' : '0 8px 32px rgba(0, 0, 0, 0.06)'};
      position: relative;
    }
    
    .glass-stats {
      background: ${isDark ? 'rgba(15, 23, 42, 0.12)' : 'rgba(255, 255, 255, 0.15)'};
      backdrop-filter: blur(20px);
      border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.3)'};
      border-radius: 1rem;
      box-shadow: ${isDark ? '0 4px 20px rgba(0, 0, 0, 0.12)' : '0 4px 20px rgba(0, 0, 0, 0.04)'};
      position: relative;
    }
    
    .filter-button-active {
      background: ${isDark ? 'rgba(55, 147, 146, 0.20)' : 'rgba(55, 147, 146, 0.85)'};
      border-color: ${isDark ? 'rgba(55, 147, 146, 0.30)' : 'rgba(55, 147, 146, 0.60)'};
      color: ${isDark ? 'rgba(55, 147, 146, 1)' : 'rgba(255, 255, 255, 0.95)'};
    }
    
    .glass-transition {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .course-grid {
      display: grid;
      gap: 1.5rem;
    }
    
    @media (min-width: 640px) {
      .course-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.75rem;
      }
    }
    
    @media (min-width: 1024px) {
      .course-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 2rem;
      }
    }
    
    .live-course-card-wrapper .course-card .flex.flex-col.items-center.justify-between {
      padding-top: 0.75rem !important;
      padding-bottom: 0.75rem !important;
      min-height: 120px !important;
    }
    
    .live-course-card-wrapper .course-card h3 {
      margin-top: 0.25rem !important;
      margin-bottom: 0.5rem !important;
    }
    
    .live-course-card-wrapper .course-card .text-center.mx-auto {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      text-align: center !important;
    }
    
    .live-course-card-wrapper .course-card .bg-indigo-50,
    .live-course-card-wrapper .course-card .bg-\\[\\#379392\\]\\/10 {
      margin-top: 0.5rem !important;
      margin-bottom: 0.25rem !important;
    }
    
    .live-course-card-wrapper .course-card > div > div.flex.flex-col.px-5.pt-3.pb-5 {
      padding-top: 0.5rem !important;
      padding-bottom: 1rem !important;
    }
    
    .live-course-card-wrapper .course-card > div > div.flex.flex-col.px-5.pt-3.pb-5 > div {
      gap: 0.5rem !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
    }
  `;
  
  GLASSMORPHISM_STYLES_CACHE.set(isDark, styles);
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
    no_of_Sessions: "24-120",
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
    course_title: "Digital Marketing",
    course_description: "Learn comprehensive digital marketing strategies including SEO, SEM, social media marketing, and analytics.",
    url: "/digital-marketing-course",
    course_image: "/images/courses/digital-marketing.png",
    duration_range: "3-12 months",
    effort_hours: "3-5",
    no_of_Sessions: "18-96",
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
  } as ICourse)
]);

// PERFORMANCE OPTIMIZATION: Utility functions
const formatDurationRange = (durationRange: string | undefined): string => {
  if (!durationRange) return "Flexible Duration";
  
  const range = durationRange.trim().toLowerCase();
  if (range.includes('month')) return durationRange;
  if (range.includes('week')) return durationRange;
  if (range.includes('day')) return durationRange;
  
  return durationRange;
};

const getDisplayDurationRange = (durationRange: string | undefined, courseType: 'live' | 'blended' = 'live'): string => {
  if (!durationRange) {
    return courseType === 'live' ? "4-18 months" : "Self-paced";
  }
  
  return formatDurationRange(durationRange);
};

const getBlendedCourseSessions = (course: ICourse) => {
  const videoCount = typeof course.video_count === 'number' 
    ? course.video_count 
    : (typeof course.lectures_count === 'number' ? course.lectures_count : 25);
  
  const qnaSessions = typeof course.qa_sessions === 'number' 
    ? course.qa_sessions 
    : 5;
  
  return { videoCount, qnaSessions };
};

// PERFORMANCE OPTIMIZATION: Memoized ViewAllButton component
const ViewAllButton = memo<{ href: string; text: string; isDark: boolean }>(({ href, text, isDark }) => {
  const buttonClasses = useMemo(() => {
    return `inline-flex items-center px-4 py-2 glass-stats rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
      isDark 
        ? 'text-white hover:bg-white/10' 
        : 'text-gray-900 hover:bg-black/5'
    }`;
  }, [isDark]);

  return (
    <Link href={href} className={buttonClasses}>
      <span>{text}</span>
      <ChevronRight size={16} className="ml-1" />
    </Link>
  );
});

ViewAllButton.displayName = 'ViewAllButton';

// PERFORMANCE OPTIMIZATION: Memoized FilterButton component
const FilterButton = memo<{
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isDark: boolean;
}>(({ active, icon, label, onClick, isDark }) => {
  const buttonClasses = useMemo(() => {
    return `inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 glass-transition ${
      active 
        ? 'filter-button-active' 
        : `glass-stats ${isDark ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-black/5'}`
    }`;
  }, [active, isDark]);

  return (
    <button onClick={onClick} className={buttonClasses}>
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );
});

FilterButton.displayName = 'FilterButton';

// PERFORMANCE OPTIMIZATION: Memoized EmptyState component
const EmptyState = memo<{ type: 'live' | 'blended'; isDark: boolean }>(({ type, isDark }) => {
  const iconClasses = useMemo(() => {
    return `w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`;
  }, [isDark]);

  const textClasses = useMemo(() => {
    return `text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`;
  }, [isDark]);

  const descriptionClasses = useMemo(() => {
    return `text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`;
  }, [isDark]);

  return (
    <div className="text-center py-12">
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

// PERFORMANCE OPTIMIZATION: Memoized CourseCardWrapper component
const CourseCardWrapper = memo<{
  course: ICourse;
  courseType: 'live' | 'blended';
  index: number;
}>(({ course, courseType, index }) => {
  const enhancedCourse = useMemo(() => {
    if (courseType === 'live') {
      const { videoCount, qnaSessions } = getBlendedCourseSessions(course);
      const batchPrice = course.prices?.[0]?.batch || null;
      const minBatchSize = course.prices?.[0]?.min_batch_size || 2;
      const displayPrice = batchPrice || course.prices?.[0]?.individual || null;

      return {
        _id: course._id || course.id || `live-course-${index}`,
        course_title: course.course_title || course.title || 'Untitled Course',
        course_description: course.course_description || course.description,
        course_image: course.course_image || course.thumbnail || '/fallback-course-image.jpg',
        course_duration: getDisplayDurationRange(course.duration_range, 'live'),
        duration_range: course.duration_range || course.course_duration as string || "4-18 months",
        course_category: course.course_category || course.category || 'Uncategorized',
        prices: course.prices || [],
        course_fee: Number(displayPrice) || 1499,
        no_of_Sessions: typeof course.no_of_Sessions === 'string' 
          ? parseInt(course.no_of_Sessions, 10) || 120
          : (typeof course.no_of_Sessions === 'number' ? course.no_of_Sessions : 120),
        effort_hours: typeof course.effort_hours === 'string' 
          ? parseInt(course.effort_hours, 10) || 8
          : (course.effort_hours || course.efforts_per_Week ? 
            (typeof course.efforts_per_Week === 'string' ? parseInt(course.efforts_per_Week, 10) || 8 : course.efforts_per_Week || 8) 
            : 8),
        class_type: 'Live Courses',
        isFree: Boolean(course.isFree) || false,
        batchPrice: batchPrice || undefined,
        url: course.url
      };
    } else {
      const { videoCount, qnaSessions } = getBlendedCourseSessions(course);
      
      return {
        _id: course._id,
        course_title: course.course_title,
        course_description: course.course_description || course.description,
        course_image: course.course_image || course.thumbnail || '/fallback-course-image.jpg',
        course_duration: "Self Paced",
        prices: course.prices || [],
        course_fee: course.prices?.[0]?.individual || 1499,
        no_of_Sessions: videoCount + qnaSessions,
        effort_hours: typeof course.effort_hours === 'string' 
          ? parseInt(course.effort_hours, 10) || 5
          : (course.effort_hours || course.efforts_per_Week ? 
            (typeof course.efforts_per_Week === 'string' ? parseInt(course.efforts_per_Week, 10) || 5 : course.efforts_per_Week || 5) 
            : 5),
        class_type: 'Blended Courses',
        isFree: course.isFree || false,
        batchPrice: course.prices?.[0]?.batch || undefined,
        course_category: course.course_category || course.category || 'Uncategorized'
      };
    }
  }, [course, courseType, index]);

  return (
    <div className="flex flex-col h-full w-full min-w-0">
      <CourseCard 
        course={enhancedCourse}
        classType={courseType === 'live' ? "Live Courses" : "blended"}
        preserveClassType={courseType === 'live'}
        showDuration={true}
        isCompact={true}
      />
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.course._id === nextProps.course._id &&
    prevProps.courseType === nextProps.courseType &&
    prevProps.index === nextProps.index
  );
});

CourseCardWrapper.displayName = 'CourseCardWrapper';

// PERFORMANCE OPTIMIZATION: Main component with comprehensive memoization
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
  const [userCurrency, setUserCurrency] = useState("INR"); // Default to INR like in HeroSectionContant
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { getQuery, loading, error } = useGetQuery();
  
  // PERFORMANCE OPTIMIZATION: Memoized computed values
  const isDark = useMemo(() => mounted ? theme === 'dark' : true, [mounted, theme]);
  const isLoaded = useMemo(() => videoContext?.isLoaded ?? false, [videoContext?.isLoaded]);

  // PERFORMANCE OPTIMIZATION: Enhanced currency detection with caching and fallbacks
  const getLocationCurrency = useCallback(async () => {
    if (isDetectingLocation) return;
    
    setIsDetectingLocation(true);
    try {
      // Check cache first (24 hour expiry)
      const cachedCurrency = localStorage.getItem('userCurrency');
      const cachedTimestamp = localStorage.getItem('userCurrencyTimestamp');
      
      if (cachedCurrency && cachedTimestamp) {
        const timestamp = parseInt(cachedTimestamp);
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          console.log(`Using cached currency: ${cachedCurrency}`);
          setUserCurrency(cachedCurrency);
          return;
        }
      }

      // Enhanced IP-based detection with multiple fallbacks
      let detectedCurrency = 'INR'; // Default to INR for better Indian user experience
      
      try {
        const response = await axios.get('https://ipapi.co/json/', { timeout: 5000 });
        console.log('IP API Response:', response.data);
        
        const countryCode = response.data?.country_code || response.data?.country;
        const currencyFromAPI = response.data?.currency;
        
        // Enhanced currency mapping with more countries
        const currencyMap: { [key: string]: string } = {
          'IN': 'INR', 'US': 'USD', 'GB': 'GBP', 'CA': 'CAD', 'AU': 'AUD',
          'SG': 'SGD', 'AE': 'AED', 'SA': 'SAR', 'QA': 'QAR', 'KW': 'KWD',
          'BH': 'BHD', 'OM': 'OMR', 'JO': 'JOD', 'LB': 'LBP', 'EG': 'EGP',
          'PK': 'PKR', 'BD': 'BDT', 'LK': 'LKR', 'NP': 'NPR', 'MY': 'MYR',
          'TH': 'THB', 'ID': 'IDR', 'PH': 'PHP', 'VN': 'VND', 'JP': 'JPY',
          'KR': 'KRW', 'CN': 'CNY', 'HK': 'HKD', 'TW': 'TWD', 'EU': 'EUR',
          'DE': 'EUR', 'FR': 'EUR', 'IT': 'EUR', 'ES': 'EUR', 'NL': 'EUR',
          'BR': 'BRL', 'MX': 'MXN', 'AR': 'ARS', 'CL': 'CLP', 'CO': 'COP',
          'ZA': 'ZAR', 'NG': 'NGN', 'KE': 'KES', 'GH': 'GHS', 'UG': 'UGX'
        };
        
        // Use API currency first, then country mapping, then fallback
        if (currencyFromAPI && currencyFromAPI.length === 3) {
          detectedCurrency = currencyFromAPI.toUpperCase();
          console.log(`Currency detected from API: ${detectedCurrency}`);
        } else if (countryCode && currencyMap[countryCode]) {
          detectedCurrency = currencyMap[countryCode];
          console.log(`Currency detected from country code ${countryCode}: ${detectedCurrency}`);
        }
        
      } catch (ipError) {
        console.log('IP API failed, trying browser-based detection...');
        
        // Fallback 1: Browser timezone detection
        try {
          const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          console.log('Detected timezone:', timeZone);
          
          const timezoneMap: { [key: string]: string } = {
            'Asia/Kolkata': 'INR', 'Asia/Calcutta': 'INR', 'Asia/Mumbai': 'INR',
            'Asia/Delhi': 'INR', 'Asia/Chennai': 'INR', 'Asia/Bangalore': 'INR',
            'America/New_York': 'USD', 'America/Los_Angeles': 'USD', 'America/Chicago': 'USD',
            'America/Toronto': 'CAD', 'America/Vancouver': 'CAD',
            'Europe/London': 'GBP', 'Europe/Dublin': 'EUR', 'Europe/Paris': 'EUR',
            'Europe/Berlin': 'EUR', 'Europe/Rome': 'EUR', 'Europe/Madrid': 'EUR',
            'Asia/Tokyo': 'JPY', 'Asia/Seoul': 'KRW', 'Asia/Shanghai': 'CNY',
            'Asia/Hong_Kong': 'HKD', 'Asia/Singapore': 'SGD', 'Asia/Bangkok': 'THB',
            'Asia/Dubai': 'AED', 'Asia/Riyadh': 'SAR', 'Asia/Qatar': 'QAR',
            'Australia/Sydney': 'AUD', 'Australia/Melbourne': 'AUD'
          };
          
          if (timezoneMap[timeZone]) {
            detectedCurrency = timezoneMap[timeZone];
            console.log(`Currency detected from timezone: ${detectedCurrency}`);
          }
        } catch (timezoneError) {
          console.log('Timezone detection failed');
        }
        
        // Fallback 2: Browser language detection
        try {
          const language = navigator.language || (navigator as any).userLanguage || 'en-US';
          console.log('Detected language:', language);
          
          const languageMap: { [key: string]: string } = {
            'hi': 'INR', 'hi-IN': 'INR', 'en-IN': 'INR', 'bn-IN': 'INR',
            'te-IN': 'INR', 'mr-IN': 'INR', 'ta-IN': 'INR', 'gu-IN': 'INR',
            'en-US': 'USD', 'en-CA': 'CAD', 'en-GB': 'GBP', 'en-AU': 'AUD',
            'ja': 'JPY', 'ja-JP': 'JPY', 'ko': 'KRW', 'ko-KR': 'KRW',
            'zh': 'CNY', 'zh-CN': 'CNY', 'zh-HK': 'HKD', 'zh-TW': 'TWD',
            'ar': 'AED', 'ar-AE': 'AED', 'ar-SA': 'SAR'
          };
          
          if (languageMap[language] || languageMap[language.split('-')[0]]) {
            detectedCurrency = languageMap[language] || languageMap[language.split('-')[0]];
            console.log(`Currency detected from language: ${detectedCurrency}`);
          }
        } catch (languageError) {
          console.log('Language detection failed');
        }
      }
      
             console.log(`Final detected currency: ${detectedCurrency}`);
       
       // Cache the result
       localStorage.setItem('userCurrency', detectedCurrency);
       localStorage.setItem('userCurrencyTimestamp', Date.now().toString());
       
       setUserCurrency(detectedCurrency);
       console.log(`Currency state updated to: ${detectedCurrency}`);
      
    } catch (error) {
      console.error('Currency detection failed completely, using INR as default:', error);
      setUserCurrency('INR'); // Default to INR instead of USD for better Indian user experience
    } finally {
      setIsDetectingLocation(false);
    }
  }, [isDetectingLocation]);

  // PERFORMANCE OPTIMIZATION: Memoized course fetching
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
          console.log(`Currency being used: INR (forced for Indian users)`);
          
          getQuery({
            url: apiUrl,
            skipCache: true,
            requireAuth: false,
            onSuccess: (response) => {
              console.log("Live Courses API Response received");
              
              let processedCourses: ICourse[] = [];
              
              try {
                // Check different potential response structures
                if (response && Array.isArray(response) && response.length > 0) {
                  console.log(`Found ${response.length} live courses from API`);
                  processedCourses = response;
                } else if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
                  console.log(`Found ${response.data.length} live courses from API (in data property)`);
                  processedCourses = response.data;
                } else if (response && response.courses && Array.isArray(response.courses) && response.courses.length > 0) {
                  console.log(`Found ${response.courses.length} live courses from API (in courses property)`);
                  processedCourses = response.courses;
                } else {
                  console.log("No valid live courses found in the API response, using fallback data");
                                     processedCourses = [...FALLBACK_LIVE_COURSES];
                }
                
                // Process each course with proper type checking
                const formattedCourses = processedCourses.map((course, index) => {
                  const courseId = course._id || course.id || `live-course-${index}`;
                  const courseTitle = course.course_title || course.title || 'Untitled Course';
                  console.log("Processing live course:", courseId, courseTitle);
                  
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
                    url: course.url,
                    effort_hours: course.effort_hours,
                    no_of_Sessions: typeof course.no_of_Sessions === 'string' 
                      ? parseInt(course.no_of_Sessions, 10) || 120
                      : (typeof course.no_of_Sessions === 'number' ? course.no_of_Sessions : 120),
                    session_display: course.no_of_Sessions ? `${course.no_of_Sessions} Live Sessions` : "24-120 Live Sessions",
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
              currency: 'inr'  // Force INR for Indian users
            }
          });
          
          console.log(`Making blended courses API call with URL: ${blendedApiUrl}`);
          console.log(`Currency being used for blended: INR (forced for Indian users)`);
          
          getQuery({
            url: blendedApiUrl,
            onSuccess: (response) => {
              console.log("Blended Courses API Response received");
              
              // Process the blended courses with better error handling
              try {
                // The API response data is directly in the response, not in data.data
                if (response && Array.isArray(response) && response.length > 0) {
                  console.log(`Found ${response.length} blended courses from API`);
                  
                  // Process each course
                  const processedCourses = response.map((course: any) => {
                    return {
                      ...course,
                      classType: 'blended', // Explicitly set classType
                      course_title: course.course_title || 'Untitled Course',
                      course_category: course.course_category || 'Uncategorized',
                      course_image: course.course_image || course.thumbnail || '/fallback-course-image.jpg'
                    };
                  });
                  
                  console.log("Processed blended courses:", processedCourses.length);
                  setBlendedCourses(processedCourses);
                } else if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
                  // Alternative structure check if the response is wrapped in a data property
                  console.log(`Found ${response.data.length} blended courses from API (in data property)`);
                  
                  // Process each course
                  const processedCourses = response.data.map((course: any) => {
                    return {
                      ...course,
                      classType: 'blended', // Explicitly set classType
                      course_title: course.course_title || 'Untitled Course',
                      course_category: course.course_category || 'Uncategorized',
                      course_image: course.course_image || course.thumbnail || '/fallback-course-image.jpg'
                    };
                  });
                  
                  console.log("Processed blended courses:", processedCourses.length);
                  setBlendedCourses(processedCourses);
                } else {
                  console.log("No blended courses found in the API response");
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
  }, [showOnlyLive, getQuery, userCurrency]);

  // PERFORMANCE OPTIMIZATION: Mount and theme effects (like HeroSectionContant.tsx)
  useEffect(() => {
    setMounted(true);
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

  // PERFORMANCE OPTIMIZATION: Simple initialization like HeroSectionContant.tsx
  useEffect(() => {
    if (mounted && !isInitialized) {
      setIsInitialized(true);
      console.log('Component mounted, initializing with INR currency...');
      
      // Set INR as default for Indian users
      setUserCurrency('INR');
      localStorage.setItem('userCurrency', 'INR');
      localStorage.setItem('userCurrencyTimestamp', Date.now().toString());
      
      // Fetch courses with INR
      console.log('Fetching courses with INR currency...');
      fetchCourses();
    }
  }, [mounted, isInitialized]);

  // PERFORMANCE OPTIMIZATION: Effect for handling showOnlyLive changes
  useEffect(() => {
    if (mounted && isInitialized) {
      console.log(`Fetching courses with INR currency`);
      fetchCourses();
    }
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
    return blendedCourses.filter(course => {
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
  }, [blendedCourses, activeBlendedFilters]);

  // PERFORMANCE OPTIMIZATION: Memoized class names
  const containerClasses = useMemo(() => {
    return `w-full py-4 sm:py-6 md:py-8 relative overflow-hidden ${
      !isDark ? 'bg-gradient-to-br from-gray-50/30 via-white/20 to-gray-100/40' : ''
    }`;
  }, [isDark]);

  const headerClasses = useMemo(() => {
    return "flex flex-col md:flex-row md:items-center justify-between mb-8 sm:mb-10 md:mb-16 lg:mb-20 px-3 sm:px-4 md:px-8 lg:px-10 relative z-10";
  }, []);

  const titleClasses = useMemo(() => {
    return "text-sm md:text-2xl lg:text-base font-extrabold mb-3 sm:mb-4 md:mb-6 dark:text-gray-300 max-w-2xl font-medium";
  }, []);

  const descriptionClasses = useMemo(() => {
    return "text-2xl md:text-base lg:text-3xl text-gray-600 text-gray-800 dark:text-white font-bold";
  }, []);

  // Fast loading state
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white dark:bg-gray-900 rounded-2xl shadow-sm">
        <div className="w-20 h-20 mb-6 text-primary-500 animate-spin">
          <Loader2 size={80} />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Loading Courses
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md text-center">
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
        <div className="mt-4 sm:mt-6 md:mt-0 hidden md:block">
          <ViewAllButton 
            href="/courses" 
            text="View All Courses"
            isDark={isDark}
          />
        </div>
      </div>

      {/* Live Courses Section */}
      <div className="mb-8 sm:mb-10 md:mb-16 lg:mb-20 px-3 sm:px-4 md:px-8 lg:px-10">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h3 className={`text-xl sm:text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Live Interactive Courses
          </h3>
        </div>

        {liveCourses.length > 0 ? (
          <div className="course-grid">
            {liveCourses.map((course, index) => (
              <CourseCardWrapper 
                key={course._id}
                course={course}
                courseType="live"
                index={index}
              />
            ))}
          </div>
        ) : (
          <EmptyState type="live" isDark={isDark} />
        )}
      </div>

      {/* Blended Courses Section */}
      {!showOnlyLive && (
        <div className="mb-8 sm:mb-10 md:mb-16 lg:mb-20 px-3 sm:px-4 md:px-8 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <h3 className={`text-xl sm:text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Self-Paced Courses
            </h3>
            
            <div className="flex flex-wrap gap-2">
              <FilterButton
                active={activeBlendedFilters.popular}
                icon={<Sparkles size={16} />}
                label="Popular"
                onClick={() => toggleBlendedFilter('popular')}
                isDark={isDark}
              />
              <FilterButton
                active={activeBlendedFilters.latest}
                icon={<Clock size={16} />}
                label="Latest"
                onClick={() => toggleBlendedFilter('latest')}
                isDark={isDark}
              />
              <FilterButton
                active={activeBlendedFilters.beginner}
                icon={<Users size={16} />}
                label="Beginner"
                onClick={() => toggleBlendedFilter('beginner')}
                isDark={isDark}
              />
            </div>
          </div>

          {filteredBlendedCourses.length > 0 ? (
            <div className="course-grid">
              {filteredBlendedCourses.map((course, index) => (
                <CourseCardWrapper 
                  key={course._id}
                  course={course}
                  courseType="blended"
                  index={index}
                />
              ))}
            </div>
          ) : (
            <EmptyState type="blended" isDark={isDark} />
          )}
        </div>
      )}

      {/* Mobile View All Button */}
      <div className="block md:hidden px-3 sm:px-4 md:px-8 lg:px-10">
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