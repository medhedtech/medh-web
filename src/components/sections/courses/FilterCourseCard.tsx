"use client";
import React, { useState, useRef, useCallback } from "react";
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

// Simple ImageWrapper component using Next.js Image
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
        src={src || '/fallback-course-image.jpg'}
        alt={alt || 'Course Image'}
        fill={true}
        className="object-cover transition-all duration-300 ease-out group-hover:scale-105"
        quality={shouldBeLCP ? 95 : 85}
        priority={shouldBeLCP}
        onLoad={onLoad}
        onError={onError}
        loading={shouldBeLCP ? 'eager' : 'lazy'}
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        fallbackSrc="/fallback-course-image.jpg"
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
  // Enhanced state management for better UX
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isImageError, setIsImageError] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showQuickPreview, setShowQuickPreview] = useState(false);
  const [touchStartTime, setTouchStartTime] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [hoverIntentTimer, setHoverIntentTimer] = useState<NodeJS.Timeout | null>(null);
  
  const cardRef = useRef(null);
  const router = useRouter();
  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);



  const handleImageLoad = () => {
    setIsImageLoaded(true);
    // Trigger a subtle animation when image loads
    if (cardRef.current) {
      (cardRef.current as HTMLElement).classList.add('image-loaded');
    }
  };
  
  const handleImageError = () => setIsImageError(true);

  // Enhanced UX interaction handlers
  const handleBookmarkToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    
    // Add haptic feedback for mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    // Store bookmark state
    try {
      const bookmarks = JSON.parse(localStorage.getItem('course-bookmarks') || '[]');
      if (isBookmarked) {
        const filtered = bookmarks.filter((id: string) => id !== course._id);
        localStorage.setItem('course-bookmarks', JSON.stringify(filtered));
      } else {
        bookmarks.push(course._id);
        localStorage.setItem('course-bookmarks', JSON.stringify(bookmarks));
      }
    } catch (error) {
      console.warn('Failed to save bookmark:', error);
    }
  }, [isBookmarked, course._id]);

  // Enhanced hover intent detection
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    
    // Clear any existing timer
    if (hoverIntentTimer) {
      clearTimeout(hoverIntentTimer);
    }
    
    // Set a timer for hover intent (user seems interested)
    const timer = setTimeout(() => {
      // Preload course data or show quick preview after 500ms of hover
      setShowQuickPreview(true);
    }, 500);
    
    setHoverIntentTimer(timer);
  }, [hoverIntentTimer]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setShowQuickPreview(false);
    
    // Clear hover intent timer
    if (hoverIntentTimer) {
      clearTimeout(hoverIntentTimer);
      setHoverIntentTimer(null);
    }
  }, [hoverIntentTimer]);

  // Enhanced touch handlers for mobile UX
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStartTime(Date.now());
    
    // Add visual feedback for touch
    if (cardRef.current) {
      (cardRef.current as HTMLElement).style.transform = 'scale(0.98)';
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const touchDuration = Date.now() - touchStartTime;
    const now = Date.now();
    
    // Reset touch feedback
    if (cardRef.current) {
      (cardRef.current as HTMLElement).style.transform = '';
    }
    
    // Detect double tap for bookmark (within 300ms)
    if (now - lastTapTime < 300) {
      e.preventDefault();
      handleBookmarkToggle(e as any);
      return;
    }
    
    setLastTapTime(now);
    
    // Long press detection (>500ms) - show quick preview
    if (touchDuration > 500) {
      e.preventDefault();
      setShowQuickPreview(true);
      
      // Auto-hide preview after 3 seconds
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
      previewTimeoutRef.current = setTimeout(() => {
        setShowQuickPreview(false);
      }, 3000);
      return;
    }
  }, [touchStartTime, lastTapTime, handleBookmarkToggle]);

  // Enhanced navigation with loading state
  const handleNavigationClick = useCallback(async () => {
    setIsNavigating(true);
    
    try {
      await navigateToCourse();
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      // Reset navigation state after a short delay
      setTimeout(() => setIsNavigating(false), 1000);
    }
  }, []);

  // Load bookmark state on mount
  React.useEffect(() => {
    try {
      const bookmarks = JSON.parse(localStorage.getItem('course-bookmarks') || '[]');
      setIsBookmarked(bookmarks.includes(course._id));
    } catch (error) {
      console.warn('Failed to load bookmarks:', error);
    }
  }, [course._id]);

  // Cleanup timers on unmount
  React.useEffect(() => {
    return () => {
      if (hoverIntentTimer) {
        clearTimeout(hoverIntentTimer);
      }
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
    };
  }, [hoverIntentTimer]);

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
    try {
      // 1. Enhanced live course navigation with better category mapping
      if (isLiveCourse && course?._id) {
        let enrollmentUrl = null;
        
        // Method 1: Use course category if available
        if (course?.course_category && typeof course.course_category === 'string') {
          const categorySlug = generateCategorySlug(course.course_category);
          if (categorySlug) {
            enrollmentUrl = `/enrollment/${categorySlug}?course=${course._id}`;
          }
        }
        
        // Method 2: Generate slug from course title if category method failed
        if (!enrollmentUrl && course?.course_title) {
          const titleSlug = generateTitleSlug(course.course_title);
          if (titleSlug) {
            enrollmentUrl = `/enrollment/${titleSlug}?course=${course._id}`;
          }
        }
        
        // Method 3: Use explicit URL if provided
        if (!enrollmentUrl && course?.url && typeof course.url === 'string' && course.url.trim() !== '') {
          enrollmentUrl = validateAndFormatUrl(course.url);
        }
        
        // Navigate to enrollment page if we have a valid URL
        if (enrollmentUrl) {
          console.log('Navigating live course to:', enrollmentUrl);
          
          // Use router.push for better navigation control and state management
          router.push(enrollmentUrl);
          return;
        }
        
        // Fallback for live courses: try generic enrollment page with course ID
        console.log('Live course fallback: generic enrollment with course ID');
        router.push(`/enrollment?course=${course._id}`);
        return;
      }

      // 2. Handle explicit URL navigation (for all course types)
      if (course?.url && typeof course.url === 'string' && course.url.trim() !== '') {
        const targetUrl = validateAndFormatUrl(course.url);
        if (targetUrl) {
          console.log('Navigating to explicit URL:', targetUrl);
          
          // Check if it's an internal route or external URL
          if (targetUrl.startsWith('/') || targetUrl.includes(window.location.origin)) {
            router.push(targetUrl);
          } else {
            window.open(targetUrl, '_blank', 'noopener,noreferrer');
          }
          return;
        }
      }

      // 3. Fallback: navigate to course details page
      if (course?._id) {
        const detailsUrl = `/course-details/${course._id}`;
        console.log('Fallback navigation to course details:', detailsUrl);
        
        // Open in new tab for better user experience
        window.open(detailsUrl, '_blank', 'noopener,noreferrer');
        return;
      }
      
      // 4. Last resort: show error message
      console.warn('No valid navigation path found for course:', course);
      
    } catch (error) {
      console.error('Error in course navigation:', error);
      
      // Emergency fallback: try course details if we have an ID
      if (course?._id) {
        window.open(`/course-details/${course._id}`, '_blank', 'noopener,noreferrer');
      }
    }
  };

  // Helper function to generate category slug from course category
  const generateCategorySlug = (category: string): string | null => {
    if (!category || typeof category !== 'string') return null;
    
    // Normalize the category name
    const normalized = category.toLowerCase().trim();
    
    // Known category mappings based on enrollment system
    const categoryMappings: { [key: string]: string } = {
      'ai and data science': 'ai-and-data-science',
      'artificial intelligence': 'ai-and-data-science',
      'data science': 'ai-and-data-science',
      'machine learning': 'ai-and-data-science',
      'digital marketing': 'digital-marketing',
      'online marketing': 'digital-marketing',
      'social media marketing': 'digital-marketing',
      'personality development': 'personality-development',
      'soft skills': 'personality-development',
      'communication skills': 'personality-development',
      'vedic mathematics': 'vedic-mathematics',
      'vedic math': 'vedic-mathematics',
      'mathematics': 'vedic-mathematics'
    };
    
    // Check for exact matches first
    if (categoryMappings[normalized]) {
      return categoryMappings[normalized];
    }
    
    // Check for partial matches
    for (const [key, value] of Object.entries(categoryMappings)) {
      if (normalized.includes(key) || key.includes(normalized)) {
        return value;
      }
    }
    
    // Generate generic slug if no specific mapping found
    return normalized
      .replace(/[^a-z0-9\s&-]/g, '') // Remove special characters except &
      .replace(/&/g, 'and') // Replace & with "and"
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Remove multiple consecutive hyphens
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  };

  // Helper function to generate slug from course title
  const generateTitleSlug = (title: string): string | null => {
    if (!title || typeof title !== 'string') return null;
    
    const normalized = title.toLowerCase().trim();
    
    // Known title patterns for specific enrollment pages
    const titleMappings: { [key: string]: string } = {
      'ai': 'ai-and-data-science',
      'artificial intelligence': 'ai-and-data-science',
      'data science': 'ai-and-data-science',
      'machine learning': 'ai-and-data-science',
      'digital marketing': 'digital-marketing',
      'personality development': 'personality-development',
      'vedic mathematics': 'vedic-mathematics',
      'vedic math': 'vedic-mathematics'
    };
    
    // Check for matches in title
    for (const [key, value] of Object.entries(titleMappings)) {
      if (normalized.includes(key)) {
        return value;
      }
    }
    
    // Generate generic slug from title
    return normalized
      .replace(/[^a-z0-9\s&-]/g, '') // Remove special characters
      .replace(/&/g, 'and') // Replace & with "and"
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Remove multiple consecutive hyphens
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
      .substring(0, 50); // Limit length for URL safety
  };

  // Helper function to validate and format URLs
  const validateAndFormatUrl = (url: string): string | null => {
    if (!url || typeof url !== 'string') return null;
    
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return null;
    
    try {
      // Handle absolute URLs
      if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
        // Validate URL format
        new URL(trimmedUrl);
        return trimmedUrl;
      }
      
      // Handle relative URLs
      if (trimmedUrl.startsWith('/')) {
        return trimmedUrl;
      }
      
      // Handle URLs without protocol (assume relative)
      return `/${trimmedUrl}`;
      
    } catch (error) {
      console.warn('Invalid URL format:', trimmedUrl, error);
      return null;
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
      // Handle specific grade mappings - check more specific patterns first
      if (grade === "UG - Graduate - Professionals") return "UG - Graduate - Professionals";
      if (grade.includes("Professional Edge Diploma")) return "Professional Edge Diploma";
      if (grade.includes("Professional certificates")) return "Professional certificates";
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

  // Get course type specific styles with enhanced design
  const getCourseTypeStyles = () => {
    const isJobGuarantee = isJobGuaranteeCourse();
    
    if (isLiveCourse) {
      return {
        stickyNoteBg: isJobGuarantee 
          ? 'bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-600' 
          : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500',
        stickyNoteText: isJobGuarantee 
          ? 'text-black font-black' 
          : 'text-white',
        buttonBg: 'bg-emerald-600 hover:bg-emerald-700',
        buttonText: 'text-white',
        accentColor: isJobGuarantee ? 'text-amber-600' : 'text-emerald-600',
        priceColor: isJobGuarantee 
          ? 'text-amber-700 dark:text-amber-400' 
          : 'text-emerald-700 dark:text-emerald-400',
        chipBg: isJobGuarantee 
          ? 'bg-amber-50 dark:bg-amber-900/20' 
          : 'bg-emerald-50 dark:bg-emerald-900/20',
        chipText: isJobGuarantee 
          ? 'text-amber-700 dark:text-amber-300' 
          : 'text-emerald-700 dark:text-emerald-300',
        chipBorder: isJobGuarantee 
          ? 'border-amber-200 dark:border-amber-700/50' 
          : 'border-emerald-200 dark:border-emerald-700/50',
        cardBorder: isJobGuarantee 
          ? 'border-amber-200/50 dark:border-amber-700/50 hover:border-amber-300/60 dark:hover:border-amber-600/60'
          : 'border-emerald-200/50 dark:border-emerald-700/50 hover:border-emerald-300/60 dark:hover:border-emerald-600/60',
        cardShadow: isJobGuarantee 
          ? 'shadow-amber-100/50 hover:shadow-amber-200/25 dark:hover:shadow-amber-800/25'
          : 'shadow-emerald-100/50 hover:shadow-emerald-200/25 dark:hover:shadow-emerald-800/25'
      };
    }
    
    if (isBlendedCourse) {
      return {
        stickyNoteBg: 'bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500',
        stickyNoteText: 'text-white',
        buttonBg: 'bg-purple-600 hover:bg-purple-700',
        buttonText: 'text-white',
        accentColor: 'text-purple-600',
        priceColor: 'text-purple-700 dark:text-purple-400',
        chipBg: 'bg-purple-50 dark:bg-purple-900/20',
        chipText: 'text-purple-700 dark:text-purple-300',
        chipBorder: 'border-purple-200 dark:border-purple-700/50',
        cardBorder: 'border-purple-200/50 dark:border-purple-700/50 hover:border-purple-300/60 dark:hover:border-purple-600/60',
        cardShadow: 'shadow-purple-100/50 hover:shadow-purple-200/25 dark:hover:shadow-purple-800/25'
      };
    }
    
    // Default to self-paced course styles
    return {
      stickyNoteBg: 'bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500',
      stickyNoteText: 'text-white',
      buttonBg: 'bg-blue-600 hover:bg-blue-700',
      buttonText: 'text-white',
      accentColor: 'text-blue-600',
      priceColor: 'text-blue-700 dark:text-blue-400',
      chipBg: 'bg-blue-50 dark:bg-blue-900/20',
      chipText: 'text-blue-700 dark:text-blue-300',
      chipBorder: 'border-blue-200 dark:border-blue-700/50',
      cardBorder: 'border-blue-200/50 dark:border-blue-700/50 hover:border-blue-300/60 dark:hover:border-blue-600/60',
      cardShadow: 'shadow-blue-100/50 hover:shadow-blue-200/25 dark:hover:shadow-blue-800/25'
    };
  };

  const styles = getCourseTypeStyles();

  // Get course type content
  const getCourseTypeContent = () => {
    if (isLiveCourse) {
      // Check if this is an 18-month course for Job Guarantee badge
      const isJobGuarantee = isJobGuaranteeCourse();
      
      return {
        tag: isJobGuarantee ? '🎯 Job Guaranteed Course' : 'Live',
        mobileTag: isJobGuarantee ? '🎯 Job Guaranteed' : 'Live',
        tagIcon: isJobGuarantee ? <GraduationCap className="w-3 h-3" /> : <Play className="w-3 h-3" />,
        sessionLabel: 'Sessions',
        sessionIcon: <Users size={12} />,
        isJobGuarantee
      };
    }
    
    if (isBlendedCourse) {
      return {
        tag: 'Blended',
        mobileTag: 'Blended',
        tagIcon: <Layers className="w-3 h-3" />,
        sessionLabel: 'Video Sessions',
        sessionIcon: <Play size={12} />,
        isJobGuarantee: false
      };
    }
    
    // Default to self-paced content
    return {
      tag: 'Self-Paced',
      mobileTag: 'Self-Paced',
      tagIcon: <Play className="w-3 h-3" />,
      sessionLabel: 'Videos',
      sessionIcon: <Play size={12} />,
      isJobGuarantee: false
    };
  };

  const content = getCourseTypeContent();

  return (
    <>
      {/* Mobile Layout (below md breakpoint) - Vertical layout matching HomeCard.tsx */}
      <div 
        key={`mobile-card-${course?._id}`}
        ref={cardRef}
        className={`group relative flex flex-col block md:hidden
          w-full 
          rounded-xl overflow-hidden 
          border ${styles.cardBorder || 'border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/60 dark:hover:border-gray-600/60'}
          bg-white dark:bg-gray-900 
          shadow-sm hover:shadow-lg ${styles.cardShadow || 'hover:shadow-gray-200/25 dark:hover:shadow-gray-800/25'}
          transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01] cursor-pointer
          transform-gpu will-change-transform mb-2`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleNavigationClick}
      >
        {/* Image section with badge - Matching HomeCard.tsx */}
        <div className="relative">
          <div className="relative w-full aspect-[3/2] overflow-hidden rounded-t-xl group">
            <OptimizedImage
              src={course?.course_image || ''}
              alt={course?.course_title || "Course Image"}
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
          
          {/* Badge - Matching HomeCard.tsx position and style */}
          <div className={`absolute 
            top-3 left-3 z-10 
            px-3 py-1.5 
            rounded-lg 
            text-sm font-bold 
            ${styles.stickyNoteBg} ${styles.stickyNoteText}
            shadow-lg shadow-black/20
            transition-all duration-300 ease-out transform hover:scale-105
            ${content.isJobGuarantee ? 'animate-pulse' : ''}`}
          >
            <div className="flex items-center gap-1.5">
              {React.cloneElement(content.tagIcon, { 
                className: "w-3.5 h-3.5" 
              })}
              <span className="font-extrabold tracking-wide">{content.tag}</span>
            </div>
          </div>

          {/* Floating Bookmark Button - Mobile */}
          <button
            onClick={handleBookmarkToggle}
            className={`absolute top-3 right-3 z-20 
              p-2 rounded-full 
              ${isBookmarked 
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' 
                : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
              } 
              backdrop-blur-sm border border-white/30 
              transition-all duration-300 ease-out 
              opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 
              shadow-md hover:shadow-lg transform translate-y-1 group-hover:translate-y-0`}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <Heart 
              size={16} 
              className={`transition-all duration-200 ${
                isBookmarked ? 'fill-current scale-110' : 'hover:fill-current'
              }`} 
            />
          </button>
        </div>

        {/* Content section - Matching HomeCard.tsx structure */}
        <div className="flex flex-col flex-grow p-4 space-y-3">
          
          {/* Course Title - Matching HomeCard.tsx typography */}
          <div className="text-left">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight line-clamp-2 mb-1">
              {(() => {
                const title = course?.course_title || "Course Title";
                const bracketMatch = title.match(/^(.*?)\s*\(([^)]+)\)(.*)$/);
                
                if (bracketMatch) {
                  const [, beforeBracket, insideBracket, afterBracket] = bracketMatch;
                  return (
                    <>
                      {beforeBracket.trim()}
                      {' '}
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        ({insideBracket})
                      </span>
                      {afterBracket.trim() && ` ${afterBracket.trim()}`}
                    </>
                  );
                }
                
                return title;
              })()}
            </h3>
          </div>
          
          {/* Course Info - Improved chip layout with better alignment */}
          <div className="space-y-2">
            {isLiveCourse ? (
              <>
                {/* Duration and Effort Row */}
                {(course?.course_duration || course?.duration_range) && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className={`inline-flex items-center 
                      px-2.5 py-1 
                      rounded-md text-xs font-medium
                      ${styles.chipBg} ${styles.chipText} border ${styles.chipBorder}`}>
                      <Clock size={12} className="mr-1" />
                      <span>{formatCourseDuration(course?.duration_range || course?.course_duration)}</span>
                    </div>
                    <div className={`inline-flex items-center 
                      px-2.5 py-1 
                      rounded-md text-xs font-medium
                      ${styles.chipBg} ${styles.chipText} border ${styles.chipBorder}`}>
                      <Clock size={12} className="mr-1" />
                      <span>4 hrs/week</span>
                    </div>
                  </div>
                )}
                
                {/* Sessions and Grade Row */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className={`inline-flex items-center 
                    px-2.5 py-1 
                    rounded-md text-xs font-medium
                    ${styles.chipBg} ${styles.chipText} border ${styles.chipBorder}`}>
                    <Users size={12} className="mr-1" />
                    <span>{course?.no_of_Sessions || course?.video_count || 0} Sessions</span>
                  </div>
                  <div className="inline-flex items-center 
                    px-2.5 py-1 
                    rounded-md text-xs font-medium whitespace-nowrap
                    bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 
                    border border-gray-200 dark:border-gray-700">
                    <GraduationCap size={12} className="mr-1" />
                    <span>{formatCourseGrade(course?.course_grade)}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Course Info in 3 columns layout */}
                <div className="grid grid-cols-3 gap-2">
                  {/* Videos Chip */}
                  <div className={`inline-flex items-center justify-center
                    px-2 py-1 
                    rounded-md text-xs font-medium
                    ${styles.chipBg} ${styles.chipText} border ${styles.chipBorder}`}>
                    <Play size={12} className="mr-1" />
                    <span>{course?.no_of_Sessions || course?.video_count || 0} Videos</span>
                  </div>
                  
                  {/* Q&A Live Chip (if blended) */}
                  {isBlendedCourse && (
                    <div className={`inline-flex items-center justify-center
                      px-2 py-1 
                      rounded-md text-xs font-medium
                      bg-[#379392]/10 text-[#379392] border border-[#379392]/20`}>
                      <Users size={12} className="mr-1" />
                      <span>Q&A Live</span>
                    </div>
                  )}
                  
                  {/* Grade Chip */}
                  <div className={`inline-flex items-center justify-center
                    px-2 py-1 
                    rounded-md text-xs font-medium whitespace-nowrap
                    bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 
                    border border-gray-200 dark:border-gray-700 ${!isBlendedCourse ? 'col-start-2' : ''}`}>
                    <GraduationCap size={12} className="mr-1" />
                    <span>{formatCourseGrade(course?.course_grade)}</span>
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Price Section - Better alignment and spacing */}
          {!hidePrice && (
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className={`text-xl font-bold ${styles.priceColor}`}>
                    {formatPrice(course.course_fee, course.batchPrice)}
                  </span>
                  {isLiveCourse && (
                    <span className={`text-sm ${styles.accentColor} font-medium`}>onwards</span>
                  )}
                </div>
                {course?.original_fee && (
                  <span className="text-sm text-gray-500 dark:text-gray-500 line-through">
                    INR {course.original_fee.toLocaleString()}
                  </span>
                )}
              </div>
              {course?.fee_note && (
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium block mt-1">
                  {course.fee_note}
                </span>
              )}
            </div>
          )}

        </div>

        {/* Loading Overlay - Mobile */}
        {isNavigating && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-30 rounded-xl">
            <div className="bg-white/95 dark:bg-gray-800/95 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Loading course...</span>
            </div>
          </div>
        )}

        {/* Quick Preview Tooltip - Mobile */}
        {showQuickPreview && (
          <div className="absolute top-full left-0 right-0 mt-2 mx-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200/80 dark:border-gray-700/80 rounded-xl shadow-2xl z-40 p-4">
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
              <div className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Info size={14} />
                Course Preview
              </div>
              <div className="space-y-1">
                {isLiveCourse && (
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <Users size={12} />
                    <span>Live interactive sessions</span>
                  </div>
                )}
                {isBlendedCourse && (
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                    <Layers size={12} />
                    <span>Hybrid learning format</span>
                  </div>
                )}
                {isSelfPacedCourse && (
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <Play size={12} />
                    <span>Learn at your own pace</span>
                  </div>
                )}
                <div className="text-gray-500 dark:text-gray-400 text-xs mt-2 pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
                  Double tap to bookmark • Long press for details
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hover Overlay - Matching HomeCard.tsx */}
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
            <div className="px-4 py-2 
              rounded-lg 
              font-semibold text-sm 
              flex items-center gap-2 
              bg-white/15 backdrop-blur-xl border border-white/30 shadow-2xl
              text-white transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100
              transition-all duration-100 ease-out">
              {isLiveCourse ? 'Explore Course' : 'Start Learning'}
              <ArrowUpRight size={16} className="transition-transform duration-100 ease-out group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout (md and above) - Compact vertical layout optimized for live courses */}
      <div 
        key={`desktop-card-${course?._id}`}
        className="group relative hidden md:flex flex-col 
        h-[300px] md:h-[320px] lg:h-[340px] xl:h-[340px] 
        w-full max-w-[240px] md:max-w-[260px] lg:max-w-[280px] xl:max-w-[300px] 
        mx-auto rounded-lg md:rounded-xl overflow-hidden 
        border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/60 dark:hover:border-gray-600/60
        bg-white dark:bg-gray-900 
        shadow-sm hover:shadow-xl hover:shadow-gray-200/25 dark:hover:shadow-gray-800/25
        transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] cursor-pointer
        transform-gpu will-change-transform"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onClick={handleNavigationClick}
      >
        {/* Image section with sticky note badge - Reduced size */}
        <div className="relative h-[140px] md:h-[150px] lg:h-[160px] overflow-hidden rounded-t-xl group">
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
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/20 dark:from-black/10 dark:to-black/30" />
          
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

          {/* Floating Bookmark Button - Desktop */}
          <button
            onClick={handleBookmarkToggle}
            className={`absolute top-2 md:top-3 lg:top-3 right-2 md:right-3 lg:right-3 z-20 
              p-2 md:p-2.5 lg:p-2.5 rounded-full 
              ${isBookmarked 
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' 
                : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
              } 
              backdrop-blur-sm border border-white/30 
              transition-all duration-300 ease-out 
              opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 
              shadow-md hover:shadow-lg transform translate-y-1 group-hover:translate-y-0`}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <Heart 
              size={16} 
              className={`transition-all duration-200 ${
                isBookmarked ? 'fill-current scale-110' : 'hover:fill-current'
              }`} 
            />
          </button>

          {/* Loading Overlay - Desktop */}
          {isNavigating && (
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-30 rounded-t-xl">
              <div className="bg-white/95 dark:bg-gray-800/95 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Loading course...</span>
              </div>
            </div>
          )}

          {/* Quick Preview Tooltip - Desktop */}
          {showQuickPreview && (
            <div className="absolute top-full left-0 right-0 mt-2 mx-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200/80 dark:border-gray-700/80 rounded-xl shadow-2xl z-40 p-4">
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
                <div className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <Info size={14} />
                  Course Preview
                </div>
                <div className="space-y-1">
                  {isLiveCourse && (
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <Users size={12} />
                      <span>Live interactive sessions</span>
                    </div>
                  )}
                  {isBlendedCourse && (
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                      <Layers size={12} />
                      <span>Hybrid learning format</span>
                    </div>
                  )}
                  {isSelfPacedCourse && (
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <Play size={12} />
                      <span>Learn at your own pace</span>
                    </div>
                  )}
                  <div className="text-gray-500 dark:text-gray-400 text-xs mt-2 pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
                    Hover for 500ms to see this preview
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Course content - Reduced spacing */}
        <div className="flex flex-col flex-grow 
          p-3 md:p-4 lg:p-4 
          space-y-2 md:space-y-2.5">
          
          {/* 1. Course Title - Compact proportions */}
          <div className="text-left 
            min-h-[40px] md:min-h-[45px] lg:min-h-[48px] 
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
                      {beforeBracket.trim()}
                      {' '}
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        ({insideBracket})
                      </span>
                      {afterBracket.trim() && ` ${afterBracket.trim()}`}
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
                rounded-md text-xs font-medium whitespace-nowrap
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
