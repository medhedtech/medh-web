"use client";
import { useEffect, useState, useRef, useCallback, useContext } from "react";
import CourseCard from "@/components/sections/courses/CourseCard";
import { getAllCoursesWithLimits, getCoursesWithFields } from '@/apis/course/course';
import useGetQuery from "@/hooks/getQuery.hook";
import { BookOpen, ChevronRight, Layers, Sparkles, Video, Clock, Users, Filter, Loader2 } from "lucide-react";
import Link from "next/link";
import axios from 'axios';
import { apiUrls } from '@/apis/index';
import { VideoBackgroundContext } from '@/components/layout/main/Home2';
import { useTheme } from "next-themes";
import { useIsClient } from "@/utils/hydration";

// Simplified glassmorphism styles - reduced complexity for better performance
const getGlassmorphismStyles = (isDark: boolean) => `
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
  
  /* Live Course Card Specific Styling */
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
  
  /* Better spacing for live course content */
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

// Simplified course interface
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

// Optimized fallback data - reduced to essential courses
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
    course_duration: "4-18 months",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "Published"
  }
];

// Utility functions - simplified
const formatDurationRange = (durationRange: string | undefined): string => {
  if (!durationRange) return "Flexible Duration";
  
  if (durationRange.includes('-')) {
    const [min, maxWithUnit] = durationRange.split('-');
    if (maxWithUnit) {
      return `Up to ${maxWithUnit.trim()}`;
    }
  }
  
  return durationRange;
};

// New function to show full duration range for live courses
const getDisplayDurationRange = (durationRange: string | undefined, courseType: 'live' | 'blended' = 'live'): string => {
  if (!durationRange) return "Flexible Duration";
  
  // For live courses, show the full range with "to" instead of dash
  if (courseType === 'live') {
    // Replace dash with "to" for better readability
    if (durationRange.includes('-')) {
      return durationRange.replace('-', ' to ');
    }
    return durationRange;
  }
  
  // For blended courses, use the original formatting
  return formatDurationRange(durationRange);
};

const getBlendedCourseSessions = (course: ICourse) => {
  if (!course) return { videoCount: 0, qnaSessions: 0 };
  
  if (course.video_count !== undefined && course.qa_sessions !== undefined) {
    return {
      videoCount: course.video_count,
      qnaSessions: course.qa_sessions
    };
  }
  
  if (course.no_of_Sessions !== undefined) {
    if (typeof course.no_of_Sessions === 'string' && course.no_of_Sessions.includes('-')) {
      const [minStr, maxStr] = course.no_of_Sessions.split('-');
      const maxSessions = parseInt(maxStr, 10) || 0;
      return { 
        videoCount: maxSessions,
        qnaSessions: 0
      };
    }
    
    const totalSessions = typeof course.no_of_Sessions === 'string' 
      ? parseInt(course.no_of_Sessions, 10) || 0 
      : (course.no_of_Sessions as number);
    
    return { 
      videoCount: totalSessions,
      qnaSessions: 0
    };
  }
  
  // Use a deterministic fallback instead of Math.random()
  const videoCount = course.lectures_count || 6; // Default to 6 instead of random
  const qnaSessions = 0;
  
  return { videoCount, qnaSessions };
};

// Simplified components
const ViewAllButton = ({ href, text, isDark }: { href: string; text: string; isDark: boolean }) => (
  <Link href={href} 
    className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium glass-transition rounded-lg md:px-5 md:py-2.5 border transition-all duration-300 ${
      isDark 
        ? 'text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 border-primary-500/30 shadow-lg hover:shadow-xl' 
        : 'text-white bg-gradient-to-r from-[#379392] to-[#2563eb] hover:from-[#2d7a79] hover:to-[#1d4ed8] border-[#379392]/40 shadow-lg hover:shadow-xl hover:scale-105'
    }`}>
    <span>{text}</span>
    <ChevronRight size={16} className="ml-1" />
  </Link>
);

const FilterButton = ({ 
  active, 
  icon, 
  label, 
  onClick, 
  isDark
}: { 
  active: boolean; 
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void; 
  isDark: boolean;
}) => {
  const baseClasses = "flex items-center space-x-1 px-2 sm:px-3 py-1 sm:py-1.5 md:py-1.5 rounded-full text-xs glass-transition glass-stats whitespace-nowrap";
  const activeClasses = "filter-button-active font-bold";
  const inactiveClasses = `font-medium ${isDark ? 'text-white/80 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`;
  
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

const EmptyState = ({ type, isDark }: { type: 'live' | 'blended'; isDark: boolean }) => (
  <div className="glass-container glass-transition flex flex-col items-center justify-center p-4 sm:p-6 md:p-5 text-center rounded-xl mx-1 sm:mx-0">
    <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gray-200/30 dark:bg-gray-700/30">
      {type === 'live' ? (
        <Video className="w-8 h-8 text-gray-500 dark:text-gray-400" />
      ) : (
        <Layers className="w-8 h-8 text-gray-500 dark:text-gray-400" />
      )}
    </div>
    <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
      No {type === 'live' ? 'Live' : 'Blended'} Courses Available
    </h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
      We're preparing amazing new {type} courses. Check back soon!
    </p>
  </div>
);

// Main component - optimized for performance
const HomeCourseSection2 = ({ 
  CustomText = "Featured Courses",
  CustomDescription = "Explore our curated selection of blended and live learning experiences",
  scrollToTop,
  showOnlyLive = false 
}: {
  CustomText?: string;
  CustomDescription?: string;
  scrollToTop?: () => void;
  hideGradeFilter?: boolean;
  showOnlyLive?: boolean;
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
  const [userCurrency, setUserCurrency] = useState("USD");
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const { getQuery, loading, error } = useGetQuery();
  
  const isDark = mounted ? theme === 'dark' : true;

  // Single initialization effect
  useEffect(() => {
    setMounted(true);
    
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

  // EXACT SAME FETCH LOGIC - keeping all the original logic intact
  const getLocationCurrency = useCallback(async () => {
    try {
      setIsDetectingLocation(true);
      
      const cachedCurrency = localStorage.getItem('userCurrency');
      const cachedTimestamp = localStorage.getItem('userCurrencyTimestamp');
      
      if (cachedCurrency && cachedTimestamp) {
        const timestamp = parseInt(cachedTimestamp);
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          console.log(`Using cached currency: ${cachedCurrency}`);
          setUserCurrency(cachedCurrency);
          return cachedCurrency;
        }
      }
      
      const response = await axios.get('https://ipapi.co/json/', { timeout: 5000 });
      
      if (response.data && response.data.currency) {
        const detectedCurrency = response.data.currency;
        console.log(`Detected currency from IP: ${detectedCurrency}`);
        
        localStorage.setItem('userCurrency', detectedCurrency);
        localStorage.setItem('userCurrencyTimestamp', Date.now().toString());
        
        setUserCurrency(detectedCurrency);
        return detectedCurrency;
      } else {
        console.log("Could not detect currency from IP, using default");
        return "USD";
      }
    } catch (error) {
      console.error("Error detecting location:", error);
      return "USD";
    } finally {
      setIsDetectingLocation(false);
    }
  }, []);

  const fetchCourses = async () => {
    try {
      const currency = await getLocationCurrency();
      console.log(`Using currency for API request: ${currency}`);
      
      console.log("Fetching live courses...");
      
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
            console.log("Live Courses API Response received", response);
            
            let processedCourses: ICourse[] = [];
            
            try {
              // Handle the new API response format with success and data fields
              if (response && response.success && response.data && Array.isArray(response.data) && response.data.length > 0) {
                console.log(`Found ${response.data.length} live courses from API (success response)`);
                processedCourses = response.data;
              } else if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
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
                  course_duration: getDisplayDurationRange(course.duration_range || course.course_duration as string, 'live')
                }));
                setLiveCourses(processedFallbackCourses);
                resolve(true);
                return;
              }
              
              // Process each course
              const formattedCourses = processedCourses.map((course, index) => {
                const courseId = course._id || course.id || `live-course-${index}`;
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
                  course_duration: getDisplayDurationRange(course.duration_range, 'live'),
                  duration_range: course.duration_range || "4-18 months",
                  class_type: 'Live Courses',
                  prices: Array.isArray(course.prices) ? course.prices : [],
                  status: course.status || "Published",
                  updatedAt: course.updatedAt || new Date().toISOString(),
                  createdAt: course.createdAt || new Date().toISOString(),
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
                course_duration: getDisplayDurationRange(course.duration_range || course.course_duration as string, 'live')
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
              course_duration: getDisplayDurationRange(course.duration_range || course.course_duration as string, 'live')
            }));
            setLiveCourses(processedFallbackCourses);
            resolve(true);
          }
        });
      });
      
      await fetchLiveCoursesPromise;
      
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

  // Initialize fetch on mount
  useEffect(() => {
    if (mounted) {
      getLocationCurrency().then(() => {
        fetchCourses();
      });
    }
  }, [mounted, showOnlyLive, getLocationCurrency]);

  // Filter handlers
  const toggleBlendedFilter = useCallback((filter: keyof typeof activeBlendedFilters) => {
    setActiveBlendedFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  }, []);

  // Filter blended courses
  const filteredBlendedCourses = blendedCourses.filter(course => {
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

  // Loading state
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
    <div className={`w-full py-4 sm:py-6 md:py-8 relative overflow-hidden ${
      !isDark ? 'bg-gradient-to-br from-gray-50/30 via-white/20 to-gray-100/40' : ''
    }`}>
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 sm:mb-10 md:mb-16 lg:mb-20 px-3 sm:px-4 md:px-8 lg:px-10 relative z-10">
        <div>
          <h2 className="text-sm md:text-2xl lg:text-base font-extrabold mb-3 sm:mb-4 md:mb-6 dark:text-gray-300 max-w-2xl font-medium">
            {CustomText}
          </h2>
          <p className="text-2xl md:text-base lg:text-3xl text-gray-600 text-gray-800 dark:text-white font-bold">
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
      <div className="glass-container glass-transition p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 mb-8 sm:mb-12 md:mb-16 lg:mb-20 mx-3 sm:mx-4 md:mx-8 lg:mx-10 z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <div className="flex items-center mb-4 sm:mb-0">
            <Video className="w-6 h-6 mr-3 text-[#379392]" />
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
              Live Interactive Courses
              <span className="hidden sm:inline"> (Weekend / Weekday Classes Available)</span>
              <span className="block sm:hidden text-sm font-medium text-gray-600 dark:text-gray-400 mt-2">Weekend / Weekday Classes Available</span>
            </h3>
          </div>
        </div>

        {liveCourses.length > 0 ? (
          <div className="course-grid">
            {liveCourses.map((course) => {
              const { videoCount, qnaSessions } = getBlendedCourseSessions(course);
              const batchPrice = course.prices && course.prices[0] ? course.prices[0].batch : null;
              const minBatchSize = course.prices && course.prices[0] ? course.prices[0].min_batch_size : 2;
              const displayPrice = batchPrice || (course.prices && course.prices[0] ? course.prices[0].individual : null);
              
              return (
                <div key={course._id} className="live-course-card-wrapper flex flex-col h-full relative w-full min-w-0">
                  <CourseCard 
                    course={{
                      _id: course._id || course.id || `live-course-${index}`,
                      course_title: course.course_title || course.title || 'Untitled Course',
                      course_description: course.course_description || course.description,
                      course_image: course.course_image || course.thumbnail || '/fallback-course-image.jpg',
                      course_duration: getDisplayDurationRange(course.duration_range || course.course_duration as string, 'live'),
                      duration_range: course.duration_range || course.course_duration as string || "4-18 months",
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
                      createdAt: course.createdAt || new Date().toISOString(),
                      url: course.url
                    }} 
                    classType="Live Courses"
                    preserveClassType={true}
                    showDuration={true}
                    isCompact={true}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState type="live" isDark={isDark} />
        )}
      </div>

      {/* Blended Courses Section */}
      {!showOnlyLive && (
        <div className="glass-container glass-transition p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 mx-3 sm:mx-4 md:mx-8 lg:mx-10 mb-8 sm:mb-12 md:mb-16 lg:mb-20 z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 md:mb-10 lg:mb-12">
            <div className="flex items-center mb-4 sm:mb-0">
              <Layers className="w-6 h-6 mr-3 text-[#379392]" />
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
                Blended Self Paced Certification Courses
              </h3>
            </div>
            
            <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3 justify-start sm:justify-end">
              <FilterButton 
                active={activeBlendedFilters.beginner} 
                icon={<BookOpen size={14} />} 
                label="Beginner-Friendly"
                onClick={() => toggleBlendedFilter('beginner')}
                isDark={isDark}
              />
              <FilterButton 
                active={activeBlendedFilters.popular} 
                icon={<Sparkles size={14} />} 
                label="Popular"
                onClick={() => toggleBlendedFilter('popular')}
                isDark={isDark}
              />
              <FilterButton 
                active={activeBlendedFilters.latest} 
                icon={<Clock size={14} />} 
                label="Latest"
                onClick={() => toggleBlendedFilter('latest')}
                isDark={isDark}
              />
              {(activeBlendedFilters.beginner || activeBlendedFilters.popular || activeBlendedFilters.latest) && (
                <button 
                  onClick={() => setActiveBlendedFilters({beginner: false, popular: false, latest: false})}
                  className="glass-stats glass-transition flex items-center space-x-1 px-3 py-1.5 md:py-1.5 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  <Filter size={14} />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {filteredBlendedCourses.length > 0 ? (
            <div className="course-grid">
              {filteredBlendedCourses.map((course, index) => {
                const { videoCount, qnaSessions } = getBlendedCourseSessions(course);
                
                return (
                  <div key={course._id || `blended-${index}`} className="flex flex-col h-full w-full min-w-0">
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
                        session_display: "Up to 120 Sessions",
                        effort_hours: course.effort_hours || course.efforts_per_Week || "3-5",
                        class_type: 'Blended Courses',
                        isFree: course.isFree || false,
                        batchPrice: course.prices && course.prices[0] ? course.prices[0].batch : undefined,
                        course_category: course.course_category || course.category || 'Uncategorized',
                        status: course.status || "Published",
                        updatedAt: course.updatedAt || new Date().toISOString(),
                        createdAt: course.createdAt || new Date().toISOString()
                      }} 
                      classType="blended"
                      showDuration={true}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState type="blended" isDark={isDark} />
          )}
        </div>
      )}

      {/* Mobile View All Button */}
      <div className="md:hidden mt-6 sm:mt-8 mb-8 sm:mb-12 flex justify-center px-3 sm:px-4 md:px-8 relative z-10">
        <Link
          href="/courses"
          className={`w-full max-w-md px-6 py-4 flex items-center justify-center text-white font-medium rounded-lg border transition-all duration-300 ${
            isDark 
              ? 'bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 border-primary-500/30 shadow-lg hover:shadow-xl' 
              : 'bg-gradient-to-r from-[#379392] to-[#2563eb] hover:from-[#2d7a79] hover:to-[#1d4ed8] border-[#379392]/40 shadow-lg hover:shadow-xl hover:scale-105'
          }`}
          onClick={scrollToTop}
        >
          <span>View All Courses</span>
          <ChevronRight size={18} className="ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default HomeCourseSection2; 