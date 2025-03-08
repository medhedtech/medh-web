"use client";
import React, { useState, useRef, useEffect } from "react";
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
  User
} from "lucide-react";
import { useCurrency } from '@/contexts/CurrencyContext';
import { isFreePrice } from '@/utils/priceUtils';

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
  
  if (!text) return "";
  
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

@media (min-width: 641px) and (max-width: 768px) {
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

// Update CourseInfoTooltip component
const CourseInfoTooltip = ({ course, isVisible, position, classType }) => {
  if (!isVisible) return null;

  const isLiveCourse = classType === 'live';
  const { convertPrice, formatPrice: formatCurrencyPrice } = useCurrency();

  return (
    <div 
      className={`fixed z-50 w-[400px] bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200/20 dark:border-gray-800/40 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{
        left: `${position.x + 20}px`,
        top: `${position.y}px`
      }}
    >
      {/* Course Title Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {course?.course_title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {course?.tagline || 'Learn the essential skills for success'}
        </p>
      </div>

      {/* Updated & Last Updated */}
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <Clock size={12} />
          Updated {course?.last_updated || 'Recently'}
        </span>
        {course?.language && (
          <span className="flex items-center gap-1">
            <Globe size={12} />
            {course.language}
          </span>
        )}
      </div>

      {/* Course Preview Content */}
      <div className="p-4 space-y-4">
        {/* What you'll learn section */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">What you'll learn</h4>
          <ul className="grid grid-cols-2 gap-2">
            {(course?.learning_points || []).slice(0, 4).map((point, index) => (
              <li key={index} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                <CheckCircle size={12} className="mt-0.5 shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Course Content Preview */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Course Content</h4>
          <ul className="space-y-2">
            <li className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <BookOpen size={12} />
                <span>{course?.no_of_Sessions || 0} {isLiveCourse ? 'Sessions' : 'Classes'}</span>
              </div>
              <span>{course?.course_duration ? `${course.course_duration.split(' ').slice(0, 2).join(' ').replace('months', 'Months')} Course` : "Self-Paced Course"}</span>
            </li>
            <li className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Award size={12} />
                <span>Certificate of completion</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Requirements */}
        {course?.prerequisites && course.prerequisites.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Requirements</h4>
            <ul className="space-y-1">
              {course.prerequisites.slice(0, 2).map((req, index) => (
                <li key={index} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <div className="w-1 h-1 rounded-full bg-gray-400 mt-1.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Instructor Section */}
        {course?.instructor && (
          <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              {course.instructor.avatar ? (
                <img 
                  src={course.instructor.avatar} 
                  alt={course?.course_duration}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <User size={20} className="text-gray-500 dark:text-gray-400" />
                </div>
              )}
              <div>
                <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                  {course?.instructor?.name || 'Course Instructor'}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {course.instructor?.title || 'Instructor'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Call to Action Footer */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${
              isLiveCourse ? 'text-rose-600 dark:text-rose-400' : 'text-indigo-600 dark:text-indigo-400'
            }`}>
              {course?.course_fee ? formatCurrencyPrice(convertPrice(course.course_fee)) : 'Free'}
            </span>
            {course?.original_fee && (
              <span className="text-sm text-gray-500 line-through">
                {formatCurrencyPrice(convertPrice(course.original_fee))}
              </span>
            )}
          </div>
          <button
            onClick={() => window.open(`/course-details/${course?._id}`, '_blank')}
            className={`px-4 py-2 rounded-lg font-medium text-white transition-all flex items-center justify-center gap-1.5 ${
            'bg-indigo-500 hover:bg-indigo-600'
            }`}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

const CourseCard = ({ 
  course = {}, 
  onShowRelated = () => {},
  showRelatedButton = false,
  variant = "standard",
  classType = ""
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
  const cardRef = useRef(null);
  const router = useRouter();
  const { convertPrice, formatPrice: formatCurrencyPrice } = useCurrency();

  // Add state for batch/individual price toggle if card supports interaction
  const [selectedPricing, setSelectedPricing] = useState("individual");

  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimeout = useRef(null);

  const handleImageLoad = () => setIsImageLoaded(true);
  const handleImageError = () => setIsImageError(true);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Track mouse movement for 3D tilt effect
  const handleMouseMove = (e) => {
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

    // Update tooltip position
    setTooltipPosition({
      x: rect.right,
      y: rect.top
    });
  };
  
  const resetTilt = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
      transition: 'transform 0.5s ease'
    });
  };

  // Update the formatPrice function to handle individual and batch prices
  const formatPrice = (price, batchPrice) => {
    if (isFreePrice(price) && (!batchPrice || isFreePrice(batchPrice))) return "Free";
    
    // If this is a simple price display with no batch option
    if (!batchPrice || batchPrice === price) {
      return formatCurrencyPrice(convertPrice(price));
    }
    
    // Handle the case where we have both individual and batch pricing
    const formattedMainPrice = formatCurrencyPrice(convertPrice(price));
    const formattedBatchPrice = formatCurrencyPrice(convertPrice(batchPrice));
    
    // Return appropriate price based on selected pricing
    return selectedPricing === "batch" ? formattedBatchPrice : formattedMainPrice;
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
              durationParts.push(`${value} ${value === 1 ? 'Year' : 'Years'}`);
              totalWeeks += value * 52;
              break;
            case 'month':
              durationParts.push(`${value} ${value === 1 ? 'Month' : 'Months'}`);
              totalWeeks += value * 4;
              break;
            case 'week':
              durationParts.push(`${value} ${value === 1 ? 'Week' : 'Weeks'}`);
              totalWeeks += value;
              break;
            case 'day':
              durationParts.push(`${value} ${value === 1 ? 'Day' : 'Days'}`);
              totalWeeks += value / 7;
              break;
            case 'hour':
              durationParts.push(`${value} ${value === 1 ? 'Hour' : 'Hours'}`);
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
      if (weeks === 1) {
        formattedDuration = "1 Week";
      } else if (weeks < 1) {
        const days = Math.round(weeks * 7);
        formattedDuration = `${days} ${days === 1 ? 'Day' : 'Days'}`;
      } else if (weeks % 1 !== 0) {
        // For fractional weeks like 1.5
        const wholeWeeks = Math.floor(weeks);
        const days = Math.round((weeks - wholeWeeks) * 7);
        
        if (days > 0) {
          formattedDuration = `${wholeWeeks} ${wholeWeeks === 1 ? 'Week' : 'Weeks'} ${days} ${days === 1 ? 'Day' : 'Days'}`;
        } else {
          formattedDuration = `${weeks} Weeks`;
        }
      } else {
        formattedDuration = `${weeks} Weeks`;
      }
      
      // For weeks, we don't need to show equivalent weeks
      return formattedDuration;
    } else if (durationLower.includes("month")) {
      // Improved month parsing with regex
      const monthMatches = durationLower.match(/(\d+[\.\d]*)/);
      const months = monthMatches ? parseFloat(monthMatches[0]) : 1;
      totalWeeks = months * 4; // Approximate weeks in months
      
      if (months === 1) {
        formattedDuration = "1 Month";
      } else if (months % 1 !== 0) {
        // For fractional months
        const wholeMonths = Math.floor(months);
        const remainderWeeks = Math.round((months - wholeMonths) * 4); // Approximate weeks in a month
        
        if (remainderWeeks > 0) {
          formattedDuration = `${wholeMonths} ${wholeMonths === 1 ? 'Month' : 'Months'} ${remainderWeeks} ${remainderWeeks === 1 ? 'Week' : 'Weeks'}`;
        } else {
          formattedDuration = `${months} Months`;
        }
      } else {
        formattedDuration = `${months} ${months === 1 ? 'Month' : 'Months'}`;
      }
      
      // Add equivalent in weeks
      return `${formattedDuration} (${Math.round(totalWeeks)} weeks)`;
    } else if (durationLower.includes("day")) {
      // Add parsing for days
      const dayMatches = durationLower.match(/(\d+[\.\d]*)/);
      const days = dayMatches ? parseFloat(dayMatches[0]) : 1;
      totalWeeks = days / 7;
      
      formattedDuration = `${days} ${days === 1 ? 'Day' : 'Days'}`;
      
      // Only show week equivalent if it's significant (more than 1 week)
      if (totalWeeks >= 1) {
        return `${formattedDuration} (${Math.round(totalWeeks)} weeks)`;
      }
      return formattedDuration;
    } else if (durationLower.includes("hour")) {
      // Add parsing for hours
      const hourMatches = durationLower.match(/(\d+[\.\d]*)/);
      const hours = hourMatches ? parseFloat(hourMatches[0]) : 1;
      
      formattedDuration = `${hours} ${hours === 1 ? 'Hour' : 'Hours'}`;
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
    if (course?._id) {
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

  // Determine card type
  const isLiveCourse = classType === 'live';
  const isBlendedCourse = classType === 'blended_courses';

  // Get pricing display based on class type
  const getPricingDisplay = () => {
    if (!course?.course_fee) return "Free";
    
    const formattedPrice = formatPrice(course.course_fee, course.original_fee);
    const discount = course.original_fee ? calculateBatchDiscount(course.course_fee, course.original_fee) : 0;
    
    return {
      current: formattedPrice,
      original: course.original_fee ? formatPrice(course.original_fee) : null,
      discount: discount > 0 ? `${discount}% off` : null
    };
  };

  const pricingInfo = getPricingDisplay();

  // Update the getGradeDisplay function
  const getGradeDisplay = (grade) => {
    if (!grade) return "All Grades";
    
    // Handle array of grades
    if (Array.isArray(grade)) {
      return grade.join(', ');
    }
    
    // Handle different grade formats
    const gradeMap = {
      'Preschool': 'Preschool',
      'Grade 1-2': 'Grade 1-2',
      'Grade 3-4': 'Grade 3-4',
      'Grade 5-6': 'Grade 5-6',
      'Grade 7-8': 'Grade 7-8',
      'Grade 9-10': 'Grade 9-10',
      'Grade 11-12': 'Grade 11-12',
      'UG - Graduate - Professionals': 'UG & Professionals'
    };

    // If the grade is in our map, return the formatted version
    if (gradeMap[grade]) {
      return gradeMap[grade];
    }

    // If it's not in our map, return as is
    return grade;
  };

  // Update the getGradeLevelInfo function
  const getGradeLevelInfo = (grade) => {
    // Default info for no grade
    const defaultInfo = {
      icon: <Users size={16} />,
      color: isLiveCourse ? 'text-rose-500' : 'text-indigo-500',
      label: 'All Grades'
    };

    if (!grade) return defaultInfo;

    // Handle array of grades
    if (Array.isArray(grade)) {
      return {
        icon: <Users size={16} />,
        color: isLiveCourse ? 'text-rose-500' : 'text-indigo-500',
        label: 'Multiple Grades'
      };
    }

    const levelInfo = {
      'Preschool': {
        icon: <GraduationCap size={16} />,
        color: isLiveCourse ? 'text-rose-500' : 'text-indigo-500',
        label: 'Early Education'
      },
      'Grade 1-2': {
        icon: <BookOpen size={16} />,
        color: isLiveCourse ? 'text-rose-500' : 'text-indigo-500',
        label: 'Primary Level'
      },
      'Grade 3-4': {
        icon: <BookOpen size={16} />,
        color: isLiveCourse ? 'text-rose-500' : 'text-indigo-500',
        label: 'Primary Level'
      },
      'Grade 5-6': {
        icon: <BookOpen size={16} />,
        color: isLiveCourse ? 'text-rose-500' : 'text-indigo-500',
        label: 'Middle Level'
      },
      'Grade 7-8': {
        icon: <BookOpen size={16} />,
        color: isLiveCourse ? 'text-rose-500' : 'text-indigo-500',
        label: 'Middle Level'
      },
      'Grade 9-10': {
        icon: <GraduationCap size={16} />,
        color: isLiveCourse ? 'text-rose-500' : 'text-indigo-500',
        label: 'Secondary Level'
      },
      'Grade 11-12': {
        icon: <GraduationCap size={16} />,
        color: isLiveCourse ? 'text-rose-500' : 'text-indigo-500',
        label: 'Higher Secondary'
      },
      'UG - Graduate - Professionals': {
        icon: <Award size={16} />,
        color: isLiveCourse ? 'text-rose-500' : 'text-indigo-500',
        label: 'Professional Level'
      }
    };
    
    return levelInfo[grade] || defaultInfo;
  };

  // Update mouse enter/leave handlers
  const handleMouseEnter = () => {
    setIsHovered(true);
    tooltipTimeout.current = setTimeout(() => {
      setShowTooltip(true);
    }, 500); // Show tooltip after 500ms hover
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowTooltip(false);
    resetTilt();
    if (tooltipTimeout.current) {
      clearTimeout(tooltipTimeout.current);
    }
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (tooltipTimeout.current) {
        clearTimeout(tooltipTimeout.current);
      }
    };
  }, []);

  return (
    <>
      <div 
        ref={cardRef}
        className={`group relative flex flex-col h-full rounded-xl overflow-hidden border border-gray-200/20 dark:border-gray-800/40 bg-white/90 dark:bg-gray-900/90 backdrop-filter backdrop-blur-sm transition-all duration-300 ${
          isHovered ? 'scale-[1.02] z-10 shadow-xl' : 'scale-100 z-0 shadow-md'
        } ${isLiveCourse ? 'hover:border-rose-400/60 hover:shadow-rose-200/20' : 'hover:border-indigo-400/60 hover:shadow-indigo-200/20'}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        style={tiltStyle}
      >
        {/* Pre-hover content */}
        <div className={`flex flex-col h-full transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
          {/* Image section */}
          <div className="relative w-full aspect-[16/9] overflow-hidden">
            <Image
              src={!isImageError ? (course?.course_image || image6) : image6}
              alt={course?.course_title || "Course Image"}
              className="w-full h-full object-cover"
              width={400}
              height={225}
              onLoad={handleImageLoad}
              onError={handleImageError}
              priority={true}
            />
          </div>

          {/* Course info */}
          <div className="p-4 flex flex-col flex-grow">
            {/* Title and Instructor */}
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {course?.course_title || "Course Title"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
              {classType === 'live' ? (
                <>
                  <Clock size={16} className="text-rose-500 dark:text-rose-400" />
                  {course?.course_duration && course.course_duration.includes('18 months') 
                    ? "18 Months (incl. 3-month internship)"
                    : course?.course_duration 
                      ? `${course.course_duration.split(' ').slice(0, 2).join(' ').replace('months', 'Months')} Course` 
                      : "Self-Paced Course"}
                </>
              ) : (
                <>
                  <BookOpen size={16} className="text-indigo-500 dark:text-indigo-400" />
                  "Self-Paced Course"
                </>
              )}
            </p>

            {/* Course Stats */}
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1.5">
                <Users size={14} className="text-emerald-500" />
                <span className="text-xs text-gray-600">{course?.no_of_Sessions || 0} {classType === 'live' ? 'Sessions' : 'Classes'}</span>
                {classType != 'live' && (
                  <span className="text-xs text-gray-600">({course?.min_hours_per_week || 0}-{course?.max_hours_per_week || 0} hrs / week)</span>
                )}
                {classType === 'live' && (
                  <span className="text-xs text-gray-600">(60-90 min each)</span>
                )}
              </div>
              {/* <div className="flex items-center gap-1.5">
                <Target size={14} className="text-gray-400" />
                <span className="text-xs text-gray-600">{course?.effort_hours || "4-6"} hrs/week</span>
              </div> */}
            </div>

            {/* Price */}
            <div className="mt-auto">
              <div className="flex items-baseline gap-2">
                <span className={`text-xl font-bold ${
                  isLiveCourse ? 'text-rose-600 dark:text-rose-400' : 'text-indigo-600 dark:text-indigo-400'
                }`}>
                  {pricingInfo.current}
                </span>
                {pricingInfo.original && (
                  <span className="text-sm text-gray-500 line-through">
                    {pricingInfo.original}
                  </span>
                )}
              </div>
              {pricingInfo.discount && (
                <span className="text-xs text-green-500 font-medium">
                  {pricingInfo.discount}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Hover content */}
        <div className={`absolute inset-0 bg-white dark:bg-gray-900 p-4 flex flex-col transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          {/* Course details */}
          <div className="space-y-3 mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              {course?.course_title}
            </h3>
            {/* <p className="text-sm text-gray-600 dark:text-gray-400">
              {course?.course_description || "Course description"}
            </p> */}
          </div>

          {/* Course stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock size={16} className={`${isLiveCourse ? 'text-rose-500 dark:text-rose-400' : 'text-violet-500 dark:text-violet-400'}`} />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {course?.no_of_Sessions || 0} {isLiveCourse ? 'Sessions' : 'Classes'}
                </p>
                <p className="text-xs text-gray-500">
                  {isLiveCourse ? 'Live Interactive' : 'Self-Paced'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Timer size={16} className={'text-cyan-500 dark:text-cyan-400'} />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {classType === 'blended_courses' 
                    ? "Self-Paced" 
                    : course?.course_duration 
                      ? `${course.course_duration.split(' ').slice(0, 2).join(' ').replace('months', 'Months')}` 
                      : "Self-Paced"}
                </p>
                <p className="text-xs text-gray-500">Course Duration</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Target size={16} className={'text-emerald-500 dark:text-emerald-400'} />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {course?.effort_hours || "4-6"} hrs/week
                </p>
                <p className="text-xs text-gray-500">Required Effort</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Award size={16} className={'text-teal-500 dark:text-teal-400'} />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Included
                </p>
                <p className="text-xs text-gray-500">Certification</p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-auto space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={openModal}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
                  isLiveCourse
                    ? 'border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400'
                    : 'border border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400'
                }`}
              >
                <Download size={16} className={`${isLiveCourse ? 'text-orange-500 dark:text-orange-400' : 'text-sky-500 dark:text-sky-400'}`} />
                Brochure
              </button>
              <button
                onClick={navigateToCourse}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
                  isLiveCourse
                    ? 'border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400'
                    : 'border border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400'
                }`}
              >
                Details
                <ArrowUpRight size={16} className={'text-indigo-500 dark:text-indigo-400'} />
              </button>
            </div>
            <button
              onClick={navigateToCourse}
              className={`w-full px-4 py-2 rounded-lg font-medium text-white transition-all flex items-center justify-center gap-1.5 ${
                isLiveCourse
                  ? 'bg-rose-500 hover:bg-rose-600'
                  : 'bg-indigo-500 hover:bg-indigo-600'
              }`}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Download brochure modal */}
      <DownloadBrochureModal
        title={course?.course_title || "Course Brochure"}
        isOpen={isModalOpen}
        onClose={closeModal}
        courseTitle={course?.course_title}
        courseId={course?._id}
      />
    </>
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
  `;
  document.head.appendChild(style);
}

export default CourseCard;