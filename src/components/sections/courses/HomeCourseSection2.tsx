"use client";
import { useEffect, useState, useRef, useMemo, useCallback, useContext } from "react";
import CourseCard from "@/components/sections/courses/CourseCard";
import { getAllCoursesWithLimits, getCoursesWithFields } from '@/apis/course/course';
import useGetQuery from "@/hooks/getQuery.hook";
import Preloader2 from "@/components/shared/others/Preloader2";
import { BookOpen, ChevronRight, Layers, Sparkles, Video, Clock, Users, Calendar, Filter, Book, Laptop, GraduationCap, LucideLayoutGrid, Loader2 } from "lucide-react";
import PropTypes from 'prop-types';
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import mobileMenu from "@/libs/mobileMenu";
import { getCoursePriceValue, getMinBatchSize } from '@/utils/priceUtils';
import axios from 'axios';
import { apiBaseUrl, apiUrls } from '@/apis/index';
import { useCourseCardSettings } from '@/contexts/CourseCardSettingsContext';
import { VideoBackgroundContext } from '@/components/layout/main/Home2';
import { useTheme } from "next-themes";

// Enhanced glassmorphism styles matching Hero2.tsx glass-container exactly
const getGlassmorphismStyles = (isDark: boolean) => `
  .glass-container {
    background: ${isDark 
      ? 'rgba(15, 23, 42, 0.08)' 
      : 'rgba(255, 255, 255, 0.08)'
    };
    backdrop-filter: blur(25px);
    border: 1px solid ${isDark 
      ? 'rgba(255, 255, 255, 0.12)' 
      : 'rgba(255, 255, 255, 0.25)'
    };
    border-radius: 1.5rem;
    box-shadow: 
      ${isDark 
        ? '0 8px 32px rgba(0, 0, 0, 0.15), 0 16px 64px rgba(0, 0, 0, 0.08)' 
        : '0 8px 32px rgba(0, 0, 0, 0.06), 0 16px 64px rgba(0, 0, 0, 0.02)'
      },
      inset 0 1px 0 ${isDark 
        ? 'rgba(255, 255, 255, 0.15)' 
        : 'rgba(255, 255, 255, 0.35)'
      },
      inset 0 -1px 0 ${isDark 
        ? 'rgba(255, 255, 255, 0.08)' 
        : 'rgba(255, 255, 255, 0.18)'
      };
    position: relative;
  }
  
  .glass-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, ${isDark 
      ? 'rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.10)' 
      : 'rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.70), rgba(255, 255, 255, 0.85)'
    });
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    pointer-events: none;
  }
  
  .glass-stats {
    background: ${isDark 
      ? 'rgba(15, 23, 42, 0.12)' 
      : 'rgba(255, 255, 255, 0.15)'
    };
    backdrop-filter: blur(20px);
    border: 1px solid ${isDark 
      ? 'rgba(255, 255, 255, 0.12)' 
      : 'rgba(255, 255, 255, 0.3)'
    };
    border-radius: 1rem;
    box-shadow: 
      ${isDark 
        ? '0 4px 20px rgba(0, 0, 0, 0.12), 0 8px 40px rgba(0, 0, 0, 0.06)' 
        : '0 4px 20px rgba(0, 0, 0, 0.04), 0 8px 40px rgba(0, 0, 0, 0.015)'
      },
      inset 0 1px 0 ${isDark 
        ? 'rgba(255, 255, 255, 0.15)' 
        : 'rgba(255, 255, 255, 0.4)'
      },
      inset 0 -1px 0 ${isDark 
        ? 'rgba(255, 255, 255, 0.08)' 
        : 'rgba(255, 255, 255, 0.25)'
      };
    position: relative;
  }
  
  .glass-stats::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, ${isDark 
      ? 'rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0.03)' 
      : 'rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.4)'
    });
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    pointer-events: none;
  }
  

  
  .filter-button-active {
    background: ${isDark 
      ? 'rgba(55, 147, 146, 0.20)' 
      : 'rgba(55, 147, 146, 0.85)'
    };
    border-color: ${isDark 
      ? 'rgba(55, 147, 146, 0.30)' 
      : 'rgba(55, 147, 146, 0.60)'
    };
    color: ${isDark 
      ? 'rgba(55, 147, 146, 1)' 
      : 'rgba(255, 255, 255, 0.95)'
    };
    box-shadow: 
      ${isDark 
        ? '0 4px 16px rgba(55, 147, 146, 0.15)' 
        : '0 4px 16px rgba(55, 147, 146, 0.25), 0 2px 6px rgba(0, 0, 0, 0.10)'
      },
      inset 0 1px 0 ${isDark 
        ? 'rgba(255, 255, 255, 0.15)' 
        : 'rgba(255, 255, 255, 0.30)'
      };
  }
  

  
  @keyframes gentle-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(55, 147, 146, 0.1); }
    50% { box-shadow: 0 0 30px rgba(55, 147, 146, 0.2); }
  }
  
  .animate-gentle-glow {
    animation: gentle-glow 4s ease-in-out infinite;
  }
  
  .glass-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* Mobile-specific course grid improvements */
  @media (max-width: 640px) {
    .course-grid {
      padding: 0 2px;
    }
    
    .course-card-container {
      margin-bottom: 4px;
      padding: 0 2px;
      box-sizing: border-box;
      overflow: hidden;
    }
    
    .course-card-container > * {
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
    }
  }
  
  /* Ensure cards don't overflow their containers */
  .course-card-container {
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
  }
  
  .course-card-container > * {
    box-sizing: border-box;
  }
`;

// Define an interface for the Course object structure used in this component
interface ICourseInstructor {
  name: string;
  title: string;
  image: string;
}

interface ICourse {
  _id: string;
  id?: string;
  course_title: string;
  title?: string;
  course_description?: string;
  description?: string;
  course_image?: string;
  thumbnail?: string;
  course_duration: string | React.ReactNode;
  display_duration?: boolean;
  duration_range?: string;
  course_fee?: string | number;
  price?: string | number;
  price_suffix?: string;
  custom_url?: string;
  href?: string;
  url?: string;
  no_of_Sessions?: number | string;
  session_display?: string;
  effort_hours?: string;
  efforts_per_Week?: string;
  learning_points?: string[];
  course_highlights?: string[];
  prerequisites?: string[];
  course_category?: string;
  category?: string;
  instructor?: ICourseInstructor | null;
  classType?: 'live' | 'blended' | 'self-paced';
  class_type?: string;
  is_placeholder?: boolean;
  highlights?: string[];
  enrollmentCount?: number;
  createdAt?: string;
  updatedAt: string;
  status: string;
  level?: string;
  difficulty?: string;
  tags?: string[];
  upcoming?: boolean;
  popular?: boolean;
  latest?: boolean;
  course_type?: string;
  video_count?: number;
  lectures_count?: number;
  qa_sessions?: number;
  live_sessions?: number;
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
  rating?: number;
  reviewCount?: number;
}

// Feature courses for Live Interactive section - fallback data
const fallbackLiveCourses: ICourse[] = [
  {
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
      },
      {
        currency: "USD",
        individual: 510,
        batch: 310,
        min_batch_size: 2,
        max_batch_size: 10,
        early_bird_discount: 0,
        group_discount: 0,
        is_active: true,
        _id: "ai_data_science_usd"
      }
    ],
    price_suffix: "Onwards",
    course_category: "AI and Data Science",
    classType: "live",
    course_duration: "Up to 18 months",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "Published"
  },
  {
    _id: "digital_marketing",
    id: "digital_marketing",
    course_title: "Digital Marketing with Data Analytics",
    course_description: "Learn how to leverage digital platforms and data analytics to create successful marketing campaigns.",
    url: "/digital-marketing-with-data-analytics-course",
    course_image: "/images/courses/digital-marketing.png",
    duration_range: "4-18 months",
    effort_hours: "4-6",
    no_of_Sessions: "24-120",
    learning_points: [
      "Social Media Marketing",
      "SEO & SEM",
      "Content Marketing",
      "Marketing Analytics"
    ],
    prerequisites: ["No prior experience required", "Interest in marketing"],
    highlights: ["Live interactive sessions", "Platform-specific strategies", "Campaign creation", "Guaranteed internship opportunity"],
    instructor: {
      name: "Priya Sharma",
      title: "Digital Marketing Expert",
      image: "/instructors/priya-sharma.jpg"
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
        _id: "digital_marketing_inr"
      },
      {
        currency: "USD",
        individual: 510,
        batch: 310,
        min_batch_size: 2,
        max_batch_size: 10,
        early_bird_discount: 0,
        group_discount: 0,
        is_active: true,
        _id: "digital_marketing_usd"
      }
    ],
    price_suffix: "Onwards",
    course_category: "Digital Marketing with Data Analytics",
    classType: "live",
    course_duration: "Up to 18 months",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "Published"
  },
  {
    _id: "personality_development",
    id: "personality_development", 
    course_title: "Personality Development",
    course_description: "Develop essential soft skills, communication abilities, and confidence for personal and professional growth.",
    url: "/personality-development-course",
    course_image: "/images/courses/pd.jpg",
    duration_range: "3-9 months",
    effort_hours: "4-6",
    no_of_Sessions: "24-96",
    learning_points: [
      "Effective Communication",
      "Emotional Intelligence", 
      "Public Speaking",
      "Confidence Building"
    ],
    prerequisites: ["Open to all skill levels", "Willingness to participate"],
    highlights: ["Interactive workshops", "Role-playing exercises", "Personalized feedback", "Certificate of completion"],
    instructor: {
      name: "Amit Verma",
      title: "Soft Skills Trainer",
      image: "/instructors/amit-verma.jpg"
    },
    prices: [
      {
        currency: "INR",
        individual: 28800,
        batch: 19200,
        min_batch_size: 2,
        max_batch_size: 10,
        early_bird_discount: 0,
        group_discount: 0,
        is_active: true,
        _id: "personality_development_inr"
      },
      {
        currency: "USD",
        individual: 480,
        batch: 290,
        min_batch_size: 2,
        max_batch_size: 10,
        early_bird_discount: 0,
        group_discount: 0,
        is_active: true,
        _id: "personality_development_usd"
      }
    ],
    price_suffix: "Onwards",
    course_category: "Personality Development",
    classType: "live",
    course_duration: "Up to 9 months",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "Published"
  },
  {
    _id: "vedic_mathematics",
    id: "vedic_mathematics",
    course_title: "Vedic Mathematics", 
    course_description: "Learn ancient Indian mathematical techniques for faster calculations and enhanced problem-solving abilities.",
    url: "/vedic-mathematics-course",
    course_image: "/images/courses/vd.jpg",
    duration_range: "3-9 months",
    effort_hours: "4-6",
    no_of_Sessions: "24-72",
    learning_points: [
      "Speed Mathematics",
      "Vedic Sutras",
      "Mental Calculation", 
      "Mathematical Shortcuts"
    ],
    prerequisites: ["Basic arithmetic knowledge", "Interest in mathematics"],
    highlights: ["Live interactive sessions", "Practice exercises", "Speed calculation techniques", "Certificate of completion"],
    instructor: {
      name: "Dr. Sunita Rao",
      title: "Mathematics Educator",
      image: "/instructors/sunita-rao.jpg"
    },
    prices: [
      {
        currency: "INR",
        individual: 24000,
        batch: 13200,
        min_batch_size: 2,
        max_batch_size: 10,
        early_bird_discount: 0,
        group_discount: 0,
        is_active: true,
        _id: "vedic_mathematics_inr"
      },
      {
        currency: "USD",
        individual: 380,
        batch: 230,
        min_batch_size: 2,
        max_batch_size: 10,
        early_bird_discount: 0,
        group_discount: 0,
        is_active: true,
        _id: "vedic_mathematics_usd"
      }
    ],
    price_suffix: "Onwards",
    course_category: "Vedic Mathematics",
    classType: "live",
    course_duration: "Up to 9 months",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "Published"
  }
];

// Estimated video count and QnA sessions for blended courses
const getBlendedCourseSessions = (course: ICourse) => {
  if (!course) return { videoCount: 0, qnaSessions: 0 };
  
  // Use defined values if available
  if (course.video_count !== undefined && course.qa_sessions !== undefined) {
    return {
      videoCount: course.video_count,
      qnaSessions: course.qa_sessions
    };
  }
  
  // Use no_of_Sessions from API response if available
  if (course.no_of_Sessions !== undefined) {
    // Handle case where no_of_Sessions is a range like "24-120"
    if (typeof course.no_of_Sessions === 'string' && course.no_of_Sessions.includes('-')) {
      const [minStr, maxStr] = course.no_of_Sessions.split('-');
      const maxSessions = parseInt(maxStr, 10) || 0;
      // For display purposes, return the max value from the range without adding QnA sessions
      return { 
        videoCount: maxSessions,
        qnaSessions: 0 // Don't add additional sessions for display purposes
      };
    }
    
    // Handle case where it's a number or a string number
    const totalSessions = typeof course.no_of_Sessions === 'string' 
      ? parseInt(course.no_of_Sessions, 10) || 0 
      : (course.no_of_Sessions as number);
    
    return { 
      videoCount: totalSessions,
      qnaSessions: 0 // Don't add additional sessions for display purposes
    };
  }
  
  // Estimate if not provided directly
  const videoCount = course.lectures_count || Math.round(Math.random() * 8) + 4;
  const qnaSessions = 0; // Don't add additional sessions for display purposes
  
  return { videoCount, qnaSessions };
};

// Prepare icons for learning experience display
const VideoIcon = () => <Video size={14} className="mr-1 flex-shrink-0 text-rose-500" />;
const QnaIcon = () => <Users size={14} className="mr-1 flex-shrink-0 text-[#379392]" />;

// Format the blended course learning experience text with better phrasing and icons
const formatBlendedLearningExperience = (videoCount: number, qnaSessions: number) => {
  return (
    <div className="flex flex-col space-y-1 items-center justify-center text-center w-full">
      <span className="font-medium text-gray-800 dark:text-gray-200 text-center w-full mx-auto" style={{ textAlign: 'center' }}>Self Paced</span>
    </div>
  );
};

// Format duration range for cleaner display - consistent with HomeCourseSection.tsx
const formatDurationRange = (durationRange: string | undefined): string => {
  if (!durationRange) return "Flexible Duration";
  
  // If it's a range like "4-18 months", extract the maximum value
  if (durationRange.includes('-')) {
    const [min, maxWithUnit] = durationRange.split('-');
    if (maxWithUnit) {
      // Extract unit (months, weeks, etc.)
      const unit = maxWithUnit.trim().replace(/[0-9]/g, '').trim();
      return `Up to ${maxWithUnit.trim()}`;
    }
  }
  
  // If not a range, return as is
  return durationRange;
};

// Format duration range for cleaner display - specifically for live courses
const formatLiveCourseDuration = (durationRange: string | undefined): string => {
  if (!durationRange) return "Up to 18 months";
  
  // If it's a range like "4-18 months", extract the maximum value
  if (durationRange.includes('-')) {
    const [min, maxWithUnit] = durationRange.split('-');
    if (maxWithUnit) {
      // Extract unit (months, weeks, etc.)
      const unit = maxWithUnit.trim().replace(/[0-9]/g, '').trim();
      return `Up to ${maxWithUnit.trim()}`;
    }
  }
  
  // If it doesn't already start with "Up to", add it
  if (!durationRange.toLowerCase().startsWith('up to')) {
    return `Up to ${durationRange}`;
  }
  
  return durationRange;
};

// Format session count for cleaner display
const formatSessionCount = (sessionCount: string | number | undefined): string => {
  return "Up to 120 Sessions";
};

const HomeCourseSection2 = ({ 
  CustomText = "Featured Courses",
  CustomDescription = "Explore our curated selection of blended and live learning experiences",
  scrollToTop,
  hideGradeFilter,
  showOnlyLive = false 
}: {
  CustomText?: string;
  CustomDescription?: string;
  scrollToTop?: () => void;
  hideGradeFilter?: boolean;
  showOnlyLive?: boolean;
}) => {
  const { settings } = useCourseCardSettings();
  const { selectedLiveCourseIds, selectedBlendedCourseIds, cardConfig, textCustomization } = settings;
  const { theme } = useTheme();
  const videoContext = useContext(VideoBackgroundContext);
  const [mounted, setMounted] = useState(false);
  
  const isDark = mounted ? theme === 'dark' : true;

  const [blendedCourses, setBlendedCourses] = useState<ICourse[]>([]);
  const [liveCourses, setLiveCourses] = useState<ICourse[]>([]);
  const [activeBlendedFilters, setActiveBlendedFilters] = useState({
    popular: false,
    latest: false,
    beginner: false
  });
  const [userCurrency, setUserCurrency] = useState("USD");
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const { getQuery, loading, error } = useGetQuery();

  // Refs for equal height functionality
  const liveGridRef = useRef<HTMLDivElement>(null);
  const blendedGridRef = useRef<HTMLDivElement>(null);

  // Hook to calculate and apply equal heights
  const useEqualHeight = useCallback(() => {
    const applyEqualHeight = (gridRef: React.RefObject<HTMLDivElement | null>) => {
      if (!gridRef.current) return;
      
      const cards = gridRef.current.querySelectorAll('.course-card-container');
      if (cards.length === 0) return;

      // Reset heights first
      cards.forEach((card: Element) => {
        (card as HTMLElement).style.height = 'auto';
      });

      // Get the maximum height
      let maxHeight = 0;
      cards.forEach((card: Element) => {
        const cardHeight = (card as HTMLElement).offsetHeight;
        if (cardHeight > maxHeight) {
          maxHeight = cardHeight;
        }
      });

      // Apply equal height to all cards
      cards.forEach((card: Element) => {
        (card as HTMLElement).style.height = `${maxHeight}px`;
      });
    };

    // Apply equal heights after a short delay to ensure DOM is ready
    setTimeout(() => {
      applyEqualHeight(liveGridRef);
      applyEqualHeight(blendedGridRef);
    }, 100);

    // Apply on window resize
    const handleResize = () => {
      applyEqualHeight(liveGridRef);
      applyEqualHeight(blendedGridRef);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [liveGridRef, blendedGridRef]);

  // Apply equal heights when courses load or change
  useEffect(() => {
    if ((liveCourses.length > 0 || blendedCourses.length > 0) && !loading) {
      useEqualHeight();
    }
  }, [liveCourses, blendedCourses, loading, useEqualHeight]);

  // Function to detect user's location and get the appropriate currency
  const getLocationCurrency = useCallback(async () => {
    try {
      setIsDetectingLocation(true);
      
      // Check if we've already stored the currency in localStorage
      const cachedCurrency = localStorage.getItem('userCurrency');
      const cachedTimestamp = localStorage.getItem('userCurrencyTimestamp');
      
      // Use cached value if it exists and is less than 24 hours old
      if (cachedCurrency && cachedTimestamp) {
        const timestamp = parseInt(cachedTimestamp);
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) { // 24 hours
          console.log(`Using cached currency: ${cachedCurrency}`);
          setUserCurrency(cachedCurrency);
          return cachedCurrency;
        }
      }
      
      // Make request to IP geolocation API
      const response = await axios.get('https://ipapi.co/json/', { timeout: 5000 });
      
      if (response.data && response.data.currency) {
        const detectedCurrency = response.data.currency;
        console.log(`Detected currency from IP: ${detectedCurrency}`);
        
        // Store in localStorage with timestamp
        localStorage.setItem('userCurrency', detectedCurrency);
        localStorage.setItem('userCurrencyTimestamp', Date.now().toString());
        
        setUserCurrency(detectedCurrency);
        return detectedCurrency;
      } else {
        console.log("Could not detect currency from IP, using default");
        return "USD"; // Default fallback
      }
    } catch (error) {
      console.error("Error detecting location:", error);
      return "USD"; // Default fallback on error
    } finally {
      setIsDetectingLocation(false);
    }
  }, []);

  const fetchCourses = async () => {
    try {
      // Get currency based on user's location
      const currency = await getLocationCurrency();
      console.log(`Using currency for API request: ${currency}`);
      
      // Fetch live courses
      console.log("Fetching live courses...");
      
      // Create a promise for the live courses fetch
      const fetchLiveCoursesPromise = new Promise((resolve, reject) => {
        getQuery({
          url: apiUrls.home.getHomeFields({
            fields: ['card'],
            filters: {
              currency: currency.toLowerCase()
            }
          }),
          skipCache: true,
          requireAuth: false,
          onSuccess: (response) => {
            console.log("Live Courses API Response received");
            
            let processedCourses: ICourse[] = [];
            
            try {
              // Handle the actual API response structure
              if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
                console.log(`Found ${response.data.length} live courses from API`);
                processedCourses = response.data;
              } else if (response && Array.isArray(response) && response.length > 0) {
                console.log(`Found ${response.length} live courses from API`);
                processedCourses = response;
              } else if (response && response.courses && Array.isArray(response.courses) && response.courses.length > 0) {
                console.log(`Found ${response.courses.length} live courses from API (in courses property)`);
                processedCourses = response.courses;
              } else {
                console.log("No valid live courses found in the API response, using fallback data");
                const processedFallbackCourses = fallbackLiveCourses.map(course => ({
                  ...course,
                  course_duration: formatDurationRange(course.duration_range || course.course_duration as string)
                }));
                setLiveCourses(processedFallbackCourses);
                resolve(true);
                return;
              }
              
              const formattedCourses = processedCourses.map(course => {
                const courseId = course._id || course.id || `live-${Math.random().toString(36).substring(2, 9)}`;
                const courseTitle = course.title || course.course_title || 'Untitled Course';
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
                  title: courseTitle,
                  course_description: course.description || course.course_description,
                  description: course.description || course.course_description,
                  course_category: course.category || course.course_category || 'Uncategorized',
                  category: course.category || course.course_category || 'Uncategorized',
                  course_image: courseImage,
                  course_duration: formatDurationRange(course.duration_range),
                  duration_range: course.duration_range || "4-18 months",
                  class_type: 'Live Courses',
                  // Ensure prices is always an array
                  prices: Array.isArray(course.prices) ? course.prices : [],
                  status: course.status || "Published",
                  updatedAt: course.updatedAt || new Date().toISOString(),
                  createdAt: course.createdAt || new Date().toISOString(),
                  // Map additional API fields properly
                  url: course.url,
                  effort_hours: course.effort_hours,
                  no_of_Sessions: typeof course.no_of_Sessions === 'string' 
                    ? course.no_of_Sessions 
                    : (typeof course.no_of_Sessions === 'number' ? String(course.no_of_Sessions) : "24-120"),
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
            console.log("USING FALLBACK DATA DUE TO ERROR");
            const processedFallbackCourses = fallbackLiveCourses.map(course => ({
              ...course,
              course_duration: formatDurationRange(course.duration_range || course.course_duration as string)
            }));
            setLiveCourses(processedFallbackCourses);
              resolve(true);
            }
          },
          onFail: (error) => {
            console.error("Error fetching live courses:", error);
            console.log("USING FALLBACK DATA DUE TO API FAILURE");
            const processedFallbackCourses = fallbackLiveCourses.map(course => ({
              ...course,
              course_duration: formatDurationRange(course.duration_range || course.course_duration as string)
            }));
            setLiveCourses(processedFallbackCourses);
            resolve(true);
          }
        });
      });
      
      // Wait for live courses to be processed before fetching blended courses
      await fetchLiveCoursesPromise;
      
      // Only fetch blended courses if needed
      if (!showOnlyLive) {
        console.log("Fetching blended courses...");
        
        getQuery({
          url: getCoursesWithFields({
            page: 1,
            limit: 8,
            status: "Published",
            fields: ['card'],
            filters: {
              class_type: "Blended Courses",
              currency: currency
            }
          }),
          onSuccess: (response) => {
            console.log("Blended Courses API Response received");
            
            try {
              if (response && Array.isArray(response) && response.length > 0) {
                console.log(`Found ${response.length} blended courses from API`);
                
                const processedCourses = response.map((course: any) => {
                  return {
                    ...course,
                    classType: 'blended' as const,
                    course_title: course.course_title || 'Untitled Course',
                    course_category: course.course_category || 'Uncategorized',
                    course_image: course.course_image || course.thumbnail || '/fallback-course-image.jpg',
                    status: course.status || "Published",
                    updatedAt: course.updatedAt || new Date().toISOString()
                  };
                });
                
                console.log("Processed blended courses:", processedCourses.length);
                setBlendedCourses(processedCourses);
              } else if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
                console.log(`Found ${response.data.length} blended courses from API (in data property)`);
                
                const processedCourses = response.data.map((course: any) => {
                  return {
                    ...course,
                    classType: 'blended' as const,
                    course_title: course.course_title || 'Untitled Course',
                    course_category: course.course_category || 'Uncategorized',
                    course_image: course.course_image || course.thumbnail || '/fallback-course-image.jpg',
                    status: course.status || "Published",
                    updatedAt: course.updatedAt || new Date().toISOString()
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
          },
          onFail: (error) => {
            console.error("Error fetching blended courses:", error);
            setBlendedCourses([]);
          }
        });
      } else {
        setBlendedCourses([]);
      }
    } catch (error) {
      console.error("Error in fetchCourses function:", error);
      setLiveCourses(fallbackLiveCourses);
      setBlendedCourses([]);
    }
  };

  // Handle filter toggles for blended courses
  const toggleBlendedFilter = (filter: keyof typeof activeBlendedFilters) => {
    const newFilters = {
      ...activeBlendedFilters,
      [filter]: !activeBlendedFilters[filter]
    };
    setActiveBlendedFilters(newFilters);
  };

  // Mount effect
  useEffect(() => {
    setMounted(true);
  }, []);

  // Inject glassmorphism styles
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

  // Initialize user currency and fetch courses on component mount
  useEffect(() => {
    getLocationCurrency().then(() => {
      fetchCourses();
    });
  }, [showOnlyLive, getLocationCurrency]);

  // Custom link button component with enhanced glassmorphism
  const ViewAllButton = ({ href, text }: { href: string; text: string }) => (
    <Link href={href} 
      className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium glass-stats glass-transition rounded-lg md:px-5 md:py-2.5 bg-gradient-to-r ${
        isDark 
          ? 'text-white from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600' 
          : 'text-white from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600'
      }`}>
      <span suppressHydrationWarning={true}>{text}</span>
      <ChevronRight size={16} className="ml-1" />
    </Link>
  );

  // Filter button component with enhanced glassmorphism
  const FilterButton = ({ 
    active, 
    icon, 
    label, 
    onClick, 
    color = "teal" 
  }: { 
    active: boolean; 
    icon: React.ReactNode; 
    label: string; 
    onClick: () => void; 
    color?: "rose" | "indigo" | "primary" | "teal"; 
  }) => {
    const baseClasses = "flex items-center space-x-1 px-2 sm:px-3 py-1 sm:py-1.5 md:py-1.5 rounded-full text-xs glass-transition glass-stats whitespace-nowrap";
    const activeClasses = "filter-button-active font-bold";
    const inactiveClasses = `font-medium ${isDark ? 'text-white/80 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`;
    
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
        suppressHydrationWarning={true}
      >
        {icon}
        <span suppressHydrationWarning={true}>{label}</span>
      </button>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white dark:bg-gray-900 rounded-2xl shadow-sm">
        <div className="w-20 h-20 mb-6 text-primary-500 animate-spin">
          <Loader2 size={80} />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
          <span suppressHydrationWarning={true}>Loading Courses</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md text-center">
          <span suppressHydrationWarning={true}>Please wait while we fetch the latest courses for you.</span>
        </p>
      </div>
    );
  }

  return (
    <div className={`w-full py-4 sm:py-6 md:py-8 relative overflow-hidden ${
      !isDark ? 'bg-gradient-to-br from-gray-50/30 via-white/20 to-gray-100/40' : ''
    }`}>
      {/* Video Background - Use shared video if available */}
      {mounted && videoContext?.videoRef?.current && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className={`absolute inset-0 w-full h-full object-cover scale-105 ${
              isDark ? 'opacity-20' : 'opacity-15'
            }`}
            style={{ 
              filter: isDark 
                ? 'brightness(0.4) contrast(1.1) saturate(0.9) hue-rotate(5deg)' 
                : 'brightness(1.2) contrast(0.8) saturate(0.7) hue-rotate(-10deg) blur(0.5px)',
              background: `url(${videoContext.videoRef.current.currentSrc})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          {/* Enhanced overlay for better content readability */}
          <div className={`absolute inset-0 ${
            isDark 
              ? 'bg-gradient-to-b from-black/5 via-black/2 to-black/5' 
              : 'bg-gradient-to-b from-white/15 via-white/8 to-white/12'
          }`}></div>
          <div className={`absolute inset-0 ${
            isDark ? 'backdrop-blur-[0.5px]' : 'backdrop-blur-[1px]'
          }`}></div>
        </div>
      )}
      
      {/* Fallback subtle pattern for light theme when no video */}
      {mounted && !isDark && !videoContext?.videoRef?.current && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute inset-0 w-full h-full opacity-5"
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, rgba(55, 147, 146, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(55, 147, 146, 0.08) 0%, transparent 50%),
                linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(55, 147, 146, 0.05) 100%)
              `,
              backgroundSize: '400px 400px, 300px 300px, 100% 100%'
            }}
          />
        </div>
      )}

      {/* Section Header with improved spacing */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 sm:mb-10 md:mb-16 lg:mb-20 px-3 sm:px-4 md:px-8 lg:px-10 relative z-10">
        <div>
          <h2 className="text-sm md:text-2xl lg:text-base font-extrabold mb-3 sm:mb-4 md:mb-6 dark:text-gray-300 max-w-2xl font-medium">
            {textCustomization?.sectionTitle || CustomText}
          </h2>
          <p className="text-2xl md:text-base lg:text-3xl text-gray-600 text-gray-800 dark:text-white font-bold">
            {textCustomization?.sectionDescription || CustomDescription}
          </p>
        </div>
        {/* Desktop View All Courses button */}
        <div className="mt-4 sm:mt-6 md:mt-0 hidden md:block">
          <ViewAllButton 
            href="/courses" 
            text="View All Courses" 
          />
        </div>
      </div>

      {/* Live Courses Section with enhanced glassmorphism */}
      <div 
        className="glass-container glass-transition animate-gentle-glow p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 mb-8 sm:mb-12 md:mb-16 lg:mb-20 mx-3 sm:mx-4 md:mx-8 lg:mx-10 z-10"
        style={{
          borderRadius: cardConfig?.borderRadius ? `${cardConfig.borderRadius}px` : undefined,
          animationDelay: '0.2s'
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <div className="flex items-center mb-4 sm:mb-0">
            <Video className="w-6 h-6 mr-3 text-[#379392]" />
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
              {textCustomization?.liveCoursesTitle || "Live Interactive Courses"}
              <span className="hidden sm:inline"> (Weekend / Weekday Classes Available)</span>
              <span className="block sm:hidden text-sm font-medium text-gray-600 dark:text-gray-400 mt-2">Weekend / Weekday Classes Available</span>
            </h3>
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="flex items-center justify-center p-6 sm:p-8 md:p-6">
            <Preloader2 />
          </div>
        ) : liveCourses.length > 0 ? (
          <div ref={liveGridRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8 items-stretch course-grid px-1 sm:px-0">
            {liveCourses.map((course) => {
              // Get video and QnA session info for the live course
              const { videoCount, qnaSessions } = getBlendedCourseSessions(course);
              
              // Calculate batch pricing if available
              const batchPrice = course.prices && course.prices[0] ? course.prices[0].batch : null;
              const minBatchSize = course.prices && course.prices[0] ? course.prices[0].min_batch_size : 2;
              const displayPrice = batchPrice || (course.prices && course.prices[0] ? course.prices[0].individual : null);
              
                              return (
                <div key={course._id} className="flex flex-col h-full relative course-card-container w-full min-w-0">
                  <CourseCard 
                    course={{
                      _id: course._id || course.id || `live-${Math.random().toString(36).substring(2, 9)}`,
                      course_title: course.course_title || course.title || 'Untitled Course',
                      course_description: course.course_description || course.description,
                      course_image: course.course_image || course.thumbnail || '/fallback-course-image.jpg',
                      course_duration: formatDurationRange(course.duration_range || course.course_duration as string),
                      course_category: course.course_category || course.category || 'Uncategorized',
                      prices: course.prices || [],
                      course_fee: Number(displayPrice) || 1499,
                      no_of_Sessions: typeof course.no_of_Sessions === 'string' 
                        ? course.no_of_Sessions 
                        : (typeof course.no_of_Sessions === 'number' ? String(course.no_of_Sessions) : "24-120"),
                      session_display: course.no_of_Sessions ? `${course.no_of_Sessions} Live Sessions` : "24-120 Live Sessions",
                      effort_hours: course.effort_hours || course.efforts_per_Week || "6-8",
                      class_type: 'Live Courses',
                      isFree: Boolean(course.isFree) || false,
                      batchPrice: batchPrice || undefined,
                      status: course.status || "Published",
                      updatedAt: course.updatedAt || new Date().toISOString(),
                      createdAt: course.createdAt || new Date().toISOString()
                    }} 
                    classType="Live Courses"
                    preserveClassType={true}
                    showDuration={true}
                    hidePrice={cardConfig.hidePrice}
                    hideDescription={cardConfig.hideDescription}
                    showJobGuarantee={Boolean(
                      (course._id === 'ai_data_science' || course.id === 'ai_data_science') || 
                      (course._id === 'digital_marketing' || course.id === 'digital_marketing') ||
                      (course.course_title && course.course_title.toLowerCase().includes('ai')) || 
                      (course.course_title && course.course_title.toLowerCase().includes('data science')) ||
                      (course.course_title && course.course_title.toLowerCase().includes('digital marketing')) ||
                      (course.title && course.title.toLowerCase().includes('ai')) || 
                      (course.title && course.title.toLowerCase().includes('data science')) ||
                      (course.title && course.title.toLowerCase().includes('digital marketing'))
                    )}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-container glass-transition flex flex-col items-center justify-center p-4 sm:p-6 md:p-5 text-center rounded-xl mx-1 sm:mx-0">
            <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gray-200/30 dark:bg-gray-700/30">
              <Video className="w-8 h-8 text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
              <span suppressHydrationWarning={true}>No Live Courses Available</span>
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span suppressHydrationWarning={true}>We're preparing amazing new live courses. Check back soon!</span>
            </p>
          </div>
        )}
      </div>

      {/* Blended Courses Section - Only show if not in "showOnlyLive" mode */}
      {!showOnlyLive && (
        <div 
          className="glass-container glass-transition animate-gentle-glow p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 mx-3 sm:mx-4 md:mx-8 lg:mx-10 mb-8 sm:mb-12 md:mb-16 lg:mb-20 z-10"
          style={{
            borderRadius: cardConfig?.borderRadius ? `${cardConfig.borderRadius}px` : undefined,
            animationDelay: '0.4s'
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 md:mb-10 lg:mb-12">
            <div className="flex items-center mb-4 sm:mb-0">
              <Layers className="w-6 h-6 mr-3 text-[#379392]" />
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
                {textCustomization?.blendedCoursesTitle || "Blended Self Paced Certification Courses"}
              </h3>
            </div>
            
            {/* Filter buttons for blended courses */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3 justify-start sm:justify-end">
              <FilterButton 
                active={activeBlendedFilters.beginner} 
                icon={<BookOpen size={14} />} 
                label="Beginner-Friendly"
                onClick={() => toggleBlendedFilter('beginner')}
                color="teal"
              />
              <FilterButton 
                active={activeBlendedFilters.popular} 
                icon={<Sparkles size={14} />} 
                label="Popular"
                onClick={() => toggleBlendedFilter('popular')}
                color="teal"
              />
              <FilterButton 
                active={activeBlendedFilters.latest} 
                icon={<Clock size={14} />} 
                label="Latest"
                onClick={() => toggleBlendedFilter('latest')}
                color="teal"
              />
              {/* Clear filters button - only shown when filters are active */}
              {(activeBlendedFilters.beginner || activeBlendedFilters.popular || activeBlendedFilters.latest) && (
                <button 
                  onClick={() => setActiveBlendedFilters({beginner: false, popular: false, latest: false})}
                  className="glass-stats glass-transition flex items-center space-x-1 px-3 py-1.5 md:py-1.5 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300"
                  suppressHydrationWarning={true}
                >
                  <Filter size={14} />
                  <span suppressHydrationWarning={true}>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Blended Courses Grid */}
          {loading ? (
            <div className="flex items-center justify-center p-6 sm:p-8 md:p-6">
              <Preloader2 />
            </div>
          ) : blendedCourses.length > 0 ? (
            <div ref={blendedGridRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8 items-stretch course-grid px-1 sm:px-0">
              {blendedCourses.map((course, index) => {
                console.log("Rendering blended course:", course._id, course.course_title, "classType:", course.classType);
                
                // Get video and QnA session info for the blended course
                const { videoCount, qnaSessions } = getBlendedCourseSessions(course);
                
                // Format the learning experience text with icons
                const learningExperienceText = formatBlendedLearningExperience(videoCount, qnaSessions);
                
                return (
                  <div key={course._id || `blended-${index}`} className="flex flex-col h-full course-card-container w-full min-w-0">
                    <CourseCard 
                      course={{
                        _id: course._id,
                        course_title: course.course_title,
                        course_description: course.course_description || course.description,
                        course_image: course.course_image || course.thumbnail || '/fallback-course-image.jpg',
                        course_duration: "Self Paced",
                        display_duration: true,
                        prices: course.prices || [],
                        course_fee: course.prices && course.prices[0] ? course.prices[0].individual : 1499,
                        no_of_Sessions: String(videoCount + qnaSessions),
                        session_display: formatSessionCount(course.no_of_Sessions),
                        effort_hours: course.effort_hours || course.efforts_per_Week || "3-5",
                        class_type: 'Blended Courses',
                        isFree: course.isFree || false,
                        batchPrice: course.prices && course.prices[0] ? course.prices[0].batch : undefined,
                        course_category: course.course_category || course.category || 'Uncategorized',
                        status: course.status || "Published",
                        updatedAt: course.updatedAt || new Date().toISOString(),
                        createdAt: course.createdAt || new Date().toISOString()
                      }} 
                      classType={cardConfig.classType || 'blended'}
                      showDuration={cardConfig.showDuration}
                      hidePrice={cardConfig.hidePrice}
                      hideDescription={cardConfig.hideDescription}
                    />
                  </div>
                );
              })}
            </div>
                      ) : (
            <div className="glass-container glass-transition flex flex-col items-center justify-center p-4 sm:p-6 md:p-5 text-center rounded-xl mx-1 sm:mx-0">
              <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gray-200/30 dark:bg-gray-700/30">
                <Layers className="w-8 h-8 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
                <span suppressHydrationWarning={true}>No Blended Courses Available</span>
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span suppressHydrationWarning={true}>We're preparing amazing new blended courses. Check back soon!</span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Mobile View All Button */}
      <div className="md:hidden mt-6 sm:mt-8 mb-8 sm:mb-12 flex justify-center px-3 sm:px-4 md:px-8 relative z-10">
        <Link
          href="/courses"
          className="glass-stats glass-transition w-full max-w-md px-6 py-4 flex items-center justify-center text-white font-medium rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
          onClick={scrollToTop}
        >
          <span suppressHydrationWarning={true}>View All Courses</span>
          <ChevronRight size={18} className="ml-2" />
        </Link>
      </div>
    </div>
  );
};

HomeCourseSection2.propTypes = {
  CustomText: PropTypes.string,
  CustomDescription: PropTypes.string,
  scrollToTop: PropTypes.func,
  hideGradeFilter: PropTypes.bool,
  showOnlyLive: PropTypes.bool
};

export default HomeCourseSection2; 