"use client";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import CourseCard from "@/components/sections/courses/CourseCard";
import { getAllCoursesWithLimits, getCoursesWithFields } from '@/apis/course/course';
import useGetQuery from "@/hooks/getQuery.hook";
import Preloader2 from "@/components/shared/others/Preloader2";
import { BookOpen, ChevronRight, Layers, Sparkles, Video, Clock, Users, Calendar, Filter, Book, Laptop, GraduationCap, LucideLayoutGrid, Loader2 } from "lucide-react";
import PropTypes from 'prop-types';
import { motion } from "framer-motion";
import Link from "next/link";
import mobileMenu from "@/libs/mobileMenu";
import { getCoursePriceValue, getMinBatchSize } from '@/utils/priceUtils';
import axios from 'axios';
import { apiBaseUrl, apiUrls } from '@/apis/index';
import { useCourseCardSettings } from '@/contexts/CourseCardSettingsContext';

// Enhanced glassmorphism styles matching Hero2.tsx
const glassmorphismStyles = `
  @keyframes animate-gradient-x {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  @keyframes animate-bounce-slow {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  
  @keyframes animate-pulse-slow {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 0.4; }
  }
  
  @keyframes animate-pulse-slower {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 0.2; }
  }
  
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  .animate-gradient-x {
    background-size: 200% 200%;
    animation: animate-gradient-x 3s ease infinite;
  }
  
  .animate-bounce-slow {
    animation: animate-bounce-slow 6s ease-in-out infinite;
  }
  
  .animate-pulse-slow {
    animation: animate-pulse-slow 4s ease-in-out infinite;
  }
  
  .animate-pulse-slower {
    animation: animate-pulse-slower 6s ease-in-out infinite;
  }
  
  .animate-shimmer {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }
  
  .glass-container {
    background: rgba(0, 38, 64, 0.15);
    backdrop-filter: blur(20px);
    border: 1px solid transparent;
    border-image: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.1)) 1;
    border-radius: 1.5rem;
    box-shadow: 
      0 8px 32px rgba(0, 38, 64, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2),
      inset 0 -1px 0 rgba(255, 255, 255, 0.05),
      0 0 0 1px rgba(255, 255, 255, 0.08);
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
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.1));
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    pointer-events: none;
  }
  
  .glass-card {
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(15px);
    border: 1px solid transparent;
    border-image: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.08)) 1;
    border-radius: 1rem;
    box-shadow: 
      0 4px 20px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.15),
      inset 0 -1px 0 rgba(255, 255, 255, 0.03),
      0 0 0 1px rgba(255, 255, 255, 0.06);
    position: relative;
  }
  
  .glass-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.08));
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    pointer-events: none;
  }
  
  .glass-stats {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(12px);
    border: 1px solid transparent;
    border-image: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06)) 1;
    border-radius: 1rem;
    box-shadow: 
      0 2px 16px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.12),
      inset 0 -1px 0 rgba(255, 255, 255, 0.02),
      0 0 0 1px rgba(255, 255, 255, 0.05);
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
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06));
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    pointer-events: none;
  }
  
  .glass-primary {
    background: rgba(59, 172, 99, 0.12);
    backdrop-filter: blur(15px);
    border: 1px solid transparent;
    border-image: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.08)) 1;
    border-radius: 1rem;
    box-shadow: 
      0 4px 20px rgba(59, 172, 99, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.15),
      inset 0 -1px 0 rgba(255, 255, 255, 0.03),
      0 0 0 1px rgba(255, 255, 255, 0.06);
    position: relative;
  }
  
  .glass-section {
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 1.5rem;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    position: relative;
    overflow: hidden;
  }
  
  .course-card-glass {
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .course-card-glass:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    border-color: rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.08);
  }
`;

// Inject glassmorphism styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = glassmorphismStyles;
  document.head.appendChild(styleSheet);
}

// List of specific course durations to display (in weeks)
const TARGET_DURATIONS = [
  72,  // 18 months (72 weeks)
  36   // 9 months (36 weeks)
];

// Feature courses for Live Interactive section - added with course URLs (keeping this as fallback)
const fallbackLiveCourses: ICourse[] = [
  {
    _id: "ai_data_science",
    id: "ai_data_science",
    course_title: "AI & Data Science",
    course_description: "Master the fundamentals of artificial intelligence and data science with hands-on projects and industry mentorship.",
    url: "/ai-and-data-science-course", // URL for redirection
    duration_range: "4-18 months",
    effort_hours: "4-6",
    no_of_Sessions: "120",
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
    course_duration: "4-18 months",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "Published"
  },
  {
    _id: "digital_marketing",
    id: "digital_marketing",
    course_title: "Digital Marketing with Data Analytics",
    course_description: "Learn how to leverage digital platforms and data analytics to create successful marketing campaigns.",
    url: "/digital-marketing-with-data-analytics-course", // URL for redirection
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
    course_duration: "4-18 months",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "Published"
  },
  {
    _id: "personality_development",
    id: "personality_development",
    course_title: "Personality Development",
    course_description: "Develop essential soft skills, communication abilities, and confidence for personal and professional growth.",
    url: "/personality-development-course", // URL for redirection
    duration_range: "3-9 months",
    effort_hours: "4-6",
    no_of_Sessions: "72",
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
    course_duration: "3-9 months",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "Published"
  },
  {
    _id: "vedic_mathematics",
    id: "vedic_mathematics",
    course_title: "Vedic Mathematics",
    course_description: "Learn ancient Indian mathematical techniques for faster calculations and enhanced problem-solving abilities.",
    url: "/vedic-mathematics-course", // URL for redirection
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
    course_duration: "3-9 months",
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

// Format duration range for cleaner display
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

// Format session count for cleaner display
const formatSessionCount = (sessionCount: string | number | undefined): string => {
  // Always return "Up to 120 Sessions" regardless of the actual count
  return "Up to 120 Sessions";
};

// Function to get course type display text
const getCourseTypeDisplay = (course: ICourse) => {
  if (course.classType === 'live') {
    return 'Live Course';
  } else if (course.classType === 'blended') {
    return 'Blended Learning';
  } else if (course.course_type) {
    return course.course_type;
  }
  return 'Self-Paced';
};

// Ensure a course has the correct classType set
const ensureClassType = (course: ICourse) => {
  if (!course) return course;
  
  // If classType is already set, return as is
  if (course.classType) return course;
  
  // Check for class_type field from API response
  if (course.class_type) {
    // Check specifically for "Blended Courses" string
    if (course.class_type === "Blended Courses") {
      return { ...course, classType: 'blended' };
    } else if (course.class_type.toLowerCase().includes('live')) {
      return { ...course, classType: 'live' };
    } else if (course.class_type.toLowerCase().includes('blend')) {
      return { ...course, classType: 'blended' };
    }
  }
  
  // Try to infer from course_type field
  if (course.course_type) {
    if (course.course_type.toLowerCase().includes('live')) {
      return { ...course, classType: 'live' };
    } else if (course.course_type.toLowerCase().includes('blend')) {
      return { ...course, classType: 'blended' };
    }
  }
  
  // If video_count or qa_sessions exist, it's likely a blended course
  if (course.video_count || course.qa_sessions || course.lectures_count) {
    return { ...course, classType: 'blended' };
  }
  
  // If no_of_Sessions exists, it's likely a blended course
  if (course.no_of_Sessions) {
    return { ...course, classType: 'blended' };
  }
  
  // Default to self-paced
  return { ...course, classType: 'self-paced' };
};

// Process courses to ensure they have classType and other metadata
const processCourses = (courses: ICourse[]) => {
  if (!courses || !Array.isArray(courses)) return [];
  
  return courses.map(course => ensureClassType(course));
};

// Define an interface for the Course object structure used in this component
interface ICourseInstructor {
  name: string;
  title: string;
  image: string;
}

interface ICourse {
  _id: string;
  id?: string; // Optional, used in some placeholders
  course_title: string;
  title?: string; // Added to handle API responses
  course_description?: string;
  description?: string;
  course_image?: string;
  thumbnail?: string;
  course_duration: string | React.ReactNode; // Can be string or JSX element
  display_duration?: boolean;
  duration_range?: string;
  course_fee?: string | number;
  price?: string | number;
  price_suffix?: string;
  custom_url?: string;
  href?: string;
  url?: string; // Added for live courses
  no_of_Sessions?: string | number; // Fixed type to allow both string and number
  session_display?: string;
  effort_hours?: string;
  efforts_per_Week?: string; // Added for API response
  learning_points?: string[];
  course_highlights?: string[];
  prerequisites?: string[];
  course_category: string; // Made required for consistency
  category?: string; // Added to handle API responses
  instructor?: ICourseInstructor | null;
  classType?: 'live' | 'blended';
  class_type?: string; // Added for API response
  is_placeholder?: boolean;
  highlights?: string[];
  enrollmentCount?: number;
  createdAt: string; // Made required for consistency
  updatedAt: string; // Added for TypeScript requirement
  status: string; // Made required for consistency
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
  isFree?: boolean; // Added for course pricing
  batchPrice?: number; // Added for pricing display
  minBatchSize?: number; // Added for batch pricing
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

// Component to display course type badge
const CourseTypeTag = ({ course }: { course: ICourse }) => {
  // Get the classType, defaulting to 'self-paced' if not set
  const type = course.classType || 'self-paced';
  
  // Check if it's a blended course
  const isBlended = type === 'blended';
  
  // Check if it's a live course
  const isLive = type === 'live';
  
  let bgColor = 'bg-gray-100 text-gray-700'; // Default for self-paced
  let icon: React.ReactNode = null;
  
  if (isBlended) {
    bgColor = 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300';
    icon = <Video size={12} className="mr-1" />;
  } else if (isLive) {
    bgColor = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
    icon = <VideoIcon />;
  }
  
  return (
    <span className={`flex items-center text-xs px-2 py-1 rounded-full ${bgColor}`}>
      {icon}
      {isBlended ? 'Blended' : isLive ? 'Live' : 'Self-Paced'}
    </span>
  );
};

// Update the main component to include glassmorphism and fix type issues
const HomeCourseSection = ({ 
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

  const [blendedCourses, setBlendedCourses] = useState<ICourse[]>([]);
  const [liveCourses, setLiveCourses] = useState<ICourse[]>([]);
  const [activeBlendedFilters, setActiveBlendedFilters] = useState({
    popular: false,
    latest: false,
    beginner: false
  });
  const [userCurrency, setUserCurrency] = useState("USD"); // Default currency
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const { getQuery, loading, error } = useGetQuery();
  const blendedRef = useRef(null);

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  // Helper function to convert duration string to weeks
  const durationToWeeks = (duration: string | number) => {
    if (!duration) return 0;
    
    // If duration is already a number, return it
    if (typeof duration === 'number') return duration;
    
    // Convert duration string to number of weeks
    const match = duration.match(/(\d+)\s*weeks?/i);
    return match ? parseInt(match[1], 10) : 0;
  };

  // Function to pick one course from each category
  const getOneCoursePerCategory = (courses: ICourse[]) => {
    if (!courses || !Array.isArray(courses)) return [];
    
    const categoryMap = new Map<string, ICourse>();
    
    courses.forEach((course: ICourse) => {
      if (course.category && !categoryMap.has(course.category)) {
        categoryMap.set(course.category, course);
      }
    });
    
    return Array.from(categoryMap.values());
  };

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
      
      // Fetch live courses - using relative URL as required by useGetQuery hook
      console.log("Fetching live courses...");
      
      // Create a promise for the live courses fetch
      const fetchLiveCoursesPromise = new Promise((resolve, reject) => {
        // More robust API call with better error handling
        getQuery({
          url: apiUrls.home.getHomeFields({
            fields: ['card'],
            filters: {
              currency: currency.toLowerCase()
            }
          }),
          skipCache: true, // Force a fresh request
          requireAuth: false, // Don't require authentication for public data
          onSuccess: (response) => {
            console.log("Live Courses API Response received");
            
            // Handle the response data in a more robust way
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
                processedCourses = fallbackLiveCourses;
              }
              
              // Process each course with proper type checking
              const formattedCourses = processedCourses.map(course => {
                const courseId = course._id || course.id || `live-${Math.random().toString(36).substring(2, 9)}`;
                const courseTitle = course.course_title || course.title || 'Untitled Course';
                console.log("Processing live course:", courseId, courseTitle);
                
                return {
                  ...course,
                  _id: courseId,
                  id: courseId,
                  classType: 'live', // Explicitly set classType
                  course_title: courseTitle,
                  course_category: course.course_category || course.category || 'Uncategorized',
                  course_image: course.course_image || course.thumbnail || '/fallback-course-image.jpg',
                  course_duration: course.duration_range || course.course_duration || "4-18 months",
                  // Ensure prices is always an array
                  prices: Array.isArray(course.prices) ? course.prices : []
                } as ICourse;
              });
              
              console.log("Processed live courses count:", formattedCourses.length);
              setLiveCourses(formattedCourses);
              resolve(true); // Resolve the promise after live courses are processed
            } catch (parseError) {
              console.error("Error processing live courses data:", parseError);
              setLiveCourses(fallbackLiveCourses);
              resolve(true); // Still resolve so we can continue to blended courses
            }
          },
          onFail: (error) => {
            console.error("Error fetching live courses:", error);
            // Use fallback data when API request fails
            setLiveCourses(fallbackLiveCourses);
            resolve(true); // Still resolve so we can continue to blended courses
          }
        });
      });
      
      // Wait for live courses to be processed before fetching blended courses
      await fetchLiveCoursesPromise;
      
      // Only fetch blended courses if needed
      if (!showOnlyLive) {
        console.log("Fetching blended courses...");
        
        // Fetch ONLY blended courses using getCoursesWithFields
        getQuery({
          url: getCoursesWithFields({
            page: 1,
            limit: 8, // Or adjust limit as needed for blended view
            status: "Published",
            fields: ['card'],
            filters: {
              class_type: "Blended Courses",
              currency: currency // Use the detected currency
            }
          }),
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
                
                // Set the blended courses state
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
                
                // Set the blended courses state
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
        // If showing only live courses, clear the blended courses
        setBlendedCourses([]);
      }
    } catch (error) {
      console.error("Error in fetchCourses function:", error);
      // Use fallback data when everything fails
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

  // Initialize user currency and fetch courses on component mount
  useEffect(() => {
    // Detect user's location and currency on mount
    getLocationCurrency().then(() => {
      fetchCourses();
    });
  }, [showOnlyLive, getLocationCurrency]);

  // Function to filter prices based on user's currency
  const getFilteredPrices = useCallback((prices: any[]) => {
    if (!prices || !Array.isArray(prices) || prices.length === 0) {
      return [];
    }

    // First try to find a price object matching the user's currency
    const matchingPrice = prices.find(p => p.currency === userCurrency);
    
    if (matchingPrice) {
      return [matchingPrice];
    }
    
    // If no matching currency is found, return all prices
    // The CourseCard component will handle the selection
    return prices;
  }, [userCurrency]);

  // Determine which live courses to render (filter by admin selection if set)
  const liveToRender = selectedLiveCourseIds && selectedLiveCourseIds.length > 0
    ? liveCourses.filter(course => selectedLiveCourseIds.includes(course._id))
    : liveCourses;

  // Empty or error state uses liveToRender
  // Replace liveCourses.map(...) with liveToRender.map(...)

  // Determine blended courses after filters and admin selection
  const filteredBlended = useMemo(() => {
    console.log("Filtering blended courses with filters:", activeBlendedFilters);
    console.log("Starting with blended courses count:", blendedCourses.length);
    
    // Base filter for not showing placeholder courses
    let filtered = blendedCourses.filter(course => !course.is_placeholder);
    console.log("After removing placeholders:", filtered.length);
    
    // If no filters are active, return all courses
    const noFiltersActive = !activeBlendedFilters.popular && !activeBlendedFilters.latest && !activeBlendedFilters.beginner;
    
    if (noFiltersActive) {
      console.log("No filters active, returning all courses:", filtered.length);
      return filtered;
    }
    
    // Copy the filtered courses to apply active filters
    let appliedFilteredCourses = [...filtered];
    
    // Apply active filters - but don't reduce to empty result set
    if (activeBlendedFilters.popular) {
      const popularCourses = filtered.filter(course => course.popular === true);
      console.log("Popular courses:", popularCourses.length);
      
      // Only apply filter if it doesn't eliminate all courses
      if (popularCourses.length > 0) {
        appliedFilteredCourses = popularCourses;
      } else {
        console.log("No courses match 'popular' filter, using all courses instead");
      }
    }
    
    if (activeBlendedFilters.latest) {
      const latestCourses = appliedFilteredCourses.filter(course => course.latest === true);
      console.log("Latest courses:", latestCourses.length);
      
      // Only apply filter if it doesn't eliminate all courses
      if (latestCourses.length > 0) {
        appliedFilteredCourses = latestCourses;
      } else {
        console.log("No courses match 'latest' filter, keeping previous filter results");
      }
    }
    
    if (activeBlendedFilters.beginner) {
      const beginnerCourses = appliedFilteredCourses.filter(course => 
        course.level === 'Beginner' || 
        course.difficulty === 'Easy' ||
        course.difficulty === 'Beginner'
      );
      console.log("Beginner courses:", beginnerCourses.length);
      
      // Only apply filter if it doesn't eliminate all courses
      if (beginnerCourses.length > 0) {
        appliedFilteredCourses = beginnerCourses;
      } else {
        console.log("No courses match 'beginner' filter, keeping previous filter results");
      }
    }
    
    console.log("Final filtered courses count:", appliedFilteredCourses.length);
    return appliedFilteredCourses;
  }, [blendedCourses, activeBlendedFilters]);

  const blendedToRender = selectedBlendedCourseIds && selectedBlendedCourseIds.length > 0
    ? filteredBlended.filter(course => selectedBlendedCourseIds.includes(course._id))
    : filteredBlended;

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white dark:bg-gray-900 rounded-2xl shadow-sm">
        <div className="w-20 h-20 mb-6 text-red-500">
          <BookOpen size={80} />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
          <span suppressHydrationWarning={true}>Error Loading Courses</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md text-center mb-6">
          <span suppressHydrationWarning={true}>There was a problem loading the courses. Please try again later.</span>
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-full shadow-sm transition-colors"
          suppressHydrationWarning={true}
        >
          <span suppressHydrationWarning={true}>Refresh Page</span>
        </button>
      </div>
    );
  }

  // Custom link button component
  const ViewAllButton = ({ href, text }: { href: string; text: string }) => (
    <Link href={href} 
      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg md:px-5 md:py-2.5">
      <span suppressHydrationWarning={true}>{text}</span>
      <ChevronRight size={16} className="ml-1" />
    </Link>
  );

  // EmptyState component for when no courses match filters
  const EmptyState = ({ type }: { type: string }) => (
    <div className="flex flex-col items-center justify-center p-6 md:p-5 text-center bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-xl">
      <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gray-200/50 dark:bg-gray-700/50">
        {type === 'live' ? (
          <Video className="w-8 h-8 text-gray-500 dark:text-gray-400" />
        ) : (
          <Layers className="w-8 h-8 text-gray-500 dark:text-gray-400" />
        )}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
        <span suppressHydrationWarning={true}>
          No {type === 'live' ? 'Live' : 'Blended'} Courses Available
        </span>
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        <span suppressHydrationWarning={true}>
          We're preparing amazing new {type === 'live' ? 'live' : 'blended'} courses. Check back soon!
        </span>
      </p>
      <Link href="/contact-us" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 rounded-lg transition-all duration-300">
        <span suppressHydrationWarning={true}>Request a Course</span>
        <ChevronRight size={16} className="ml-1" />
      </Link>
    </div>
  );

  // Filter button component
  const FilterButton = ({ 
    active, 
    icon, 
    label, 
    onClick 
  }: { 
    active: boolean; 
    icon: React.ReactNode; 
    label: string; 
    onClick: () => void; 
  }) => {
    return (
      <button
        onClick={onClick}
        className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs transition-all duration-200 ${
          active 
            ? "bg-[#379392] text-white font-bold" 
            : "bg-[#379392]/10 text-[#379392] hover:bg-[#379392]/20 dark:bg-[#379392]/30 dark:text-[#379392]/80 dark:hover:bg-[#379392]/40 font-medium"
        }`}
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

  // Enhanced component with glassmorphism background and video
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-105"
          style={{ filter: 'brightness(0.3) contrast(1.2) saturate(1.1)' }}
        >
          <source src="/video/1659171_Trapcode_Particles_3840x2160.mp4" type="video/mp4" />
        </video>
        
        {/* Enhanced overlay for professional look */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60"></div>
        <div className="absolute inset-0 backdrop-blur-[0.5px]"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8 py-8 md:py-12 lg:py-16">
        {/* Enhanced Section Header */}
        <motion.div 
          className="glass-container p-8 md:p-12 mb-12 relative text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="inline-flex items-center px-3 py-1.5 glass-stats rounded-full text-primary-300 text-sm font-medium mb-4">
            <Sparkles size={14} className="mr-2" />
            Premium Learning Experience
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white max-w-4xl mx-auto leading-tight">
            {textCustomization?.sectionTitle || CustomText}
          </h2>
          <p className="text-lg md:text-xl text-slate-200 opacity-90 max-w-3xl mx-auto leading-relaxed mb-8">
            {textCustomization?.sectionDescription || CustomDescription}
          </p>
          
          {/* CTA Button */}
          <Link 
            href="/courses" 
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-500 text-white font-medium rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/30 hover:scale-105 group glass-stats"
          >
            <span className="relative z-10">Explore All Courses</span>
            <ChevronRight size={18} className="relative z-10 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Live Courses Section */}
        <div className="glass-section p-6 mb-8 relative">
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <div className="flex items-center mb-4 sm:mb-0">
                <div className="p-2 glass-stats rounded-xl mr-3">
                  <Video className="w-6 h-6 text-[#379392]" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white">
                    {textCustomization?.liveCoursesTitle || "Live Interactive Courses"}
                  </h3>
                  <p className="text-sm text-slate-300 opacity-80">Weekend / Weekday Classes Available</p>
                </div>
              </div>
            </div>

            {/* Enhanced Courses Grid */}
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="glass-stats p-8 rounded-2xl">
                  <Loader2 className="w-12 h-12 text-[#379392] animate-spin mx-auto mb-4" />
                  <p className="text-white text-center">Loading courses...</p>
                </div>
              </div>
            ) : liveCourses.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {liveToRender.map((course) => {
                  const { videoCount, qnaSessions } = getBlendedCourseSessions(course);
                  const batchPrice = course.prices?.[0]?.batch;
                  const minBatchSize = course.prices?.[0]?.min_batch_size || 2;
                  const displayPrice = batchPrice || course.prices?.[0]?.individual;
                  
                  return (
                    <motion.div 
                      key={course._id}
                      variants={itemVariants} 
                      className="course-card-glass h-full"
                    >
                      <CourseCard 
                        course={{
                          _id: course._id,
                          course_title: course.course_title,
                          course_description: course.course_description || course.description,
                          course_image: course.course_image || course.thumbnail || '/fallback-course-image.jpg',
                          course_duration: formatDurationRange(course.duration_range),
                          prices: course.prices || [],
                          course_fee: displayPrice || 1499,
                          price_suffix: "Onwards",
                          custom_url: course.url || '',
                          href: `/course-details/${course._id}`,
                          no_of_Sessions: videoCount || 0,
                          session_display: "Up to 120 Sessions",
                          effort_hours: course.effort_hours || course.efforts_per_Week || "6-8",
                          learning_points: course.learning_points || [],
                          prerequisites: course.prerequisites || [],
                          instructor: course.instructor || null,
                          classType: 'live',
                          highlights: course.highlights || course.course_highlights,
                          isFree: course.isFree || false,
                          batchPrice: batchPrice || undefined,
                          minBatchSize: minBatchSize,
                          status: "Published",
                          updatedAt: new Date().toISOString()
                        }} 
                        classType={cardConfig.classType || 'live'}
                        showDuration={cardConfig.showDuration}
                        hidePrice={cardConfig.hidePrice}
                        hideDescription={cardConfig.hideDescription}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <EmptyState type="live" />
            )}
          </div>
        </div>

        {/* Blended Courses Section */}
        {!showOnlyLive && (
          <div className="glass-section p-6 relative" ref={blendedRef}>
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                <div className="flex items-center mb-4 sm:mb-0">
                  <div className="p-2 glass-stats rounded-xl mr-3">
                    <Layers className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-white">
                      {textCustomization?.blendedCoursesTitle || "Blended Self Paced Certification Courses"}
                    </h3>
                  </div>
                </div>
                
                {/* Enhanced Filter Buttons */}
                <div className="flex flex-wrap gap-2">
                  <FilterButton 
                    active={activeBlendedFilters.beginner} 
                    icon={<BookOpen size={14} />} 
                    label="Beginner-Friendly"
                    onClick={() => toggleBlendedFilter('beginner')}
                  />
                  <FilterButton 
                    active={activeBlendedFilters.popular} 
                    icon={<Sparkles size={14} />} 
                    label="Popular"
                    onClick={() => toggleBlendedFilter('popular')}
                  />
                  <FilterButton 
                    active={activeBlendedFilters.latest} 
                    icon={<Clock size={14} />} 
                    label="Latest"
                    onClick={() => toggleBlendedFilter('latest')}
                  />
                  {(activeBlendedFilters.beginner || activeBlendedFilters.popular || activeBlendedFilters.latest) && (
                    <button 
                      onClick={() => setActiveBlendedFilters({beginner: false, popular: false, latest: false})}
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium glass-stats text-white hover:text-red-400 transition-all duration-200"
                    >
                      <Filter size={14} />
                      <span>Clear</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Enhanced Blended Courses Grid */}
              {loading ? (
                <div className="flex items-center justify-center p-12">
                  <div className="glass-stats p-8 rounded-2xl">
                    <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
                    <p className="text-white text-center">Loading courses...</p>
                  </div>
                </div>
              ) : (() => {
                let coursesToRender = [...blendedToRender];

                if (activeBlendedFilters.popular) {
                  coursesToRender = coursesToRender.sort((a, b) => (b.enrollmentCount || 0) - (a.enrollmentCount || 0));
                }

                if (activeBlendedFilters.latest) {
                  coursesToRender = coursesToRender.sort((a, b) => {
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return dateB - dateA;
                  });
                }

                if (activeBlendedFilters.beginner) {
                  coursesToRender = coursesToRender.filter(course =>
                    course.level?.toLowerCase() === 'beginner' ||
                    course.difficulty?.toLowerCase() === 'easy' ||
                    course.tags?.some(tag => tag.toLowerCase().includes('beginner'))
                  );
                }

                return coursesToRender.length > 0 ? (
                  <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {coursesToRender.map((course, index) => {
                      const { videoCount, qnaSessions } = getBlendedCourseSessions(course);
                      const learningExperienceText = formatBlendedLearningExperience(videoCount, qnaSessions);
                      
                      const enhancedCourse = {
                        _id: course._id,
                        course_title: course.course_title,
                        course_image: course.course_image || course.thumbnail || '/fallback-course-image.jpg',
                        course_duration: learningExperienceText,
                        session_display: formatSessionCount(course.no_of_Sessions),
                        price: course.prices?.[0]?.individual || 1499,
                        course_fee: course.prices?.[0]?.batch || 1499,
                        custom_url: course.custom_url || `/course-details/${course._id}`,
                        href: course.href || `/course-details/${course._id}`,
                        no_of_Sessions: videoCount + qnaSessions,
                        effort_hours: course.effort_hours || course.efforts_per_Week || "3-5",
                        learning_points: course.learning_points || course.course_highlights || [],
                        prerequisites: course.prerequisites || [],
                        instructor: course.instructor ?? undefined,
                        classType: 'blended' as const,
                        batchPrice: course.prices?.[0]?.batch || undefined,
                        minBatchSize: course.prices?.[0]?.min_batch_size || 2,
                        prices: course.prices || [],
                        isFree: false,
                        rating: course.rating || 0,
                        reviewCount: course.reviewCount || 0,
                        course_category: course.course_category || course.category || 'Uncategorized',
                        createdAt: course.createdAt || new Date().toISOString(),
                        status: "Published",
                        updatedAt: new Date().toISOString()
                      };
                      
                      return (
                        <motion.div 
                          key={course._id || `blended-${index}`}
                          variants={itemVariants}
                          className="course-card-glass h-full"
                        >
                          <CourseCard 
                            course={enhancedCourse}
                            classType={cardConfig.classType || 'blended'}
                            showDuration={cardConfig.showDuration}
                            hidePrice={cardConfig.hidePrice}
                            hideDescription={cardConfig.hideDescription}
                          />
                        </motion.div>
                      );
                    })}
                  </motion.div>
                ) : (
                  <EmptyState type="blended" />
                );
              })()}
            </div>
          </div>
        )}

        {/* Mobile View All Button */}
        <div className="md:hidden mt-8 flex justify-center px-4">
          <Link
            href="/courses"
            className="w-full max-w-md px-6 py-4 glass-container flex items-center justify-center text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 group"
            onClick={scrollToTop}
          >
            <span>View All Courses</span>
            <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Minimal Transparent Styles */}
      <style jsx>{`
        /* Course card minimal styling */
        :global(.course-card-glass) {
          height: 460px !important;
          min-height: 460px !important;
          max-height: 460px !important;
          position: relative;
        }
        
        :global(.course-card-glass:hover) {
          transform: translateY(-2px);
        }
        
        /* Glass components transparency */
        :global(.glass-stats) {
          background: rgba(255, 255, 255, 0.02) !important;
          backdrop-filter: blur(2px) !important;
          border: 1px solid rgba(255, 255, 255, 0.04) !important;
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          :global(.course-card-glass) {
            height: 420px !important;
            min-height: 420px !important;
            max-height: 420px !important;
          }
          
          :global(.glass-section) {
            margin: 0.5rem 0;
            padding: 1rem;
          }
          
          :global(.glass-container) {
            margin: 0.5rem 0;
            padding: 1rem;
          }
        }
      `}</style>
    </section>
  );
};

HomeCourseSection.propTypes = {
  CustomText: PropTypes.string,
  CustomDescription: PropTypes.string,
  scrollToTop: PropTypes.func,
  hideGradeFilter: PropTypes.bool,
  showOnlyLive: PropTypes.bool
};

export default HomeCourseSection; 