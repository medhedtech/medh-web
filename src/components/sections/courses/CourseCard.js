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
  BarChart
} from "lucide-react";

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

const CourseCard = ({ 
  course = {}, 
  onShowRelated = () => {},
  showRelatedButton = false,
  variant = "standard"
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
    
    const tiltX = (y - 0.5) * 10; // Max 5 degrees tilt
    const tiltY = (0.5 - x) * 10; // Max 5 degrees tilt
    
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
      transition: 'transform 0.1s ease'
    });
  };
  
  const resetTilt = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
      transition: 'transform 0.5s ease'
    });
  };

  // Format price for display
  const formatPrice = (price) => {
    if (!price) return "Free";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'usd',
      maximumFractionDigits: 0
    }).format(price);
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

  // Course highlights - sample data (would come from API in real implementation)
  const courseHighlights = [
    "Industry-recognized certification",
    "Hands-on projects",
    "Expert instructors"
  ];

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

  return (
    <div 
      ref={cardRef}
      className={`group relative flex flex-col h-full rounded-xl overflow-hidden border border-gray-200/20 dark:border-gray-800/40 bg-white/90 dark:bg-gray-900/90 backdrop-filter backdrop-blur-sm transition-all duration-300 hover:border-primary-400/60 dark:hover:border-primary-600/60 hover:shadow-lg hover:shadow-primary-500/10 ${isHovered ? 'scale-[1.02] z-10' : 'scale-100 z-0'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        resetTilt();
      }}
      onMouseMove={handleMouseMove}
      style={tiltStyle}
    >
      {/* Decorative corner element - adds Gen Alpha geometric accent */}
      <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-primary-500/20 to-purple-500/20 rounded-full blur-xl z-0 transition-all duration-500 group-hover:scale-150"></div>
      <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-gradient-to-tr from-primary-500/20 to-amber-500/20 rounded-full blur-xl z-0 transition-all duration-500 group-hover:scale-150"></div>

      {/* Save/Bookmark Tooltip - New feature */}
      <div className={`absolute top-2 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-3 rounded-full z-50 transition-all duration-300 ${saveTooltipVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        {isSaved ? 'Saved to your bookmarks!' : 'Removed from bookmarks'}
      </div>

      {/* Normal View */}
      <div className={`transition-all duration-300 ${isHovered ? 'opacity-0 absolute inset-0 pointer-events-none' : 'opacity-100'} z-10`}>
      {/* Image section with improved loading state */}
        <div className="relative w-full aspect-[16/9] overflow-hidden">
        {/* Skeleton loader */}
        <div 
          className={`absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-pulse ${
            isImageLoaded ? 'opacity-0' : 'opacity-100'
          } transition-opacity duration-300`}
        />
        
        <Image
          src={!isImageError ? (course?.course_image || image6) : image6}
          alt={course?.course_title || "Course thumbnail"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          className={`object-cover transition-transform duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
          } ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />

          {/* Play button overlay for video content feel */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
              <Play size={18} className="text-white fill-white" />
            </div>
          </div>

          {/* Category badge - updated with more modern styling */}
        <div className="absolute top-2 left-2 z-10">
          {course?.course_category && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-white/90 dark:bg-gray-800/90 text-primary-700 dark:text-primary-400 backdrop-blur-sm shadow-sm border border-primary-200 dark:border-primary-800">
              <Tag size={10} className="mr-1 text-primary-500" />
              {course.course_category}
            </span>
          )}
        </div>

          {/* Trending badge - updated with more modern styling */}
        {course?.is_popular && (
          <div className="absolute top-2 right-2 z-10">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm">
                <TrendingUp size={10} className="mr-1 animate-pulse" />
              Hot
            </span>
          </div>
        )}

          {/* Progress indicator - New feature */}
          {isInProgress && (
            <div className="absolute left-0 right-0 bottom-0 h-1 bg-gray-200 dark:bg-gray-700 z-20">
              <div 
                className="h-full bg-primary-500 transition-all duration-1000"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
          
          {/* Completion badge - New feature */}
          {isCompleted && (
            <div className="absolute left-0 bottom-0 z-20 m-2">
              <div className="bg-green-500 text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center">
                <CheckCircle size={8} className="mr-1" />
                Complete
              </div>
            </div>
          )}

          {/* Action Buttons - Updated with Save feature */}
          <div className="absolute bottom-2 right-2 z-20 flex space-x-1.5">
            {/* Like Button */}
            <button 
              onClick={handleLikeClick}
              className="w-6 h-6 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 active:scale-90"
            >
              <Heart 
                size={12} 
                className={`transition-all duration-300 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-500 dark:text-gray-400'} ${likeAnimation ? 'scale-150' : 'scale-100'}`}
              />
            </button>
            
            {/* Save/Bookmark Button - New feature */}
            <button 
              onClick={handleSaveClick}
              className="w-6 h-6 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 active:scale-90"
            >
              <Bookmark 
                size={12} 
                className={`transition-all duration-300 ${isSaved ? 'fill-primary-500 text-primary-500' : 'text-gray-500 dark:text-gray-400'}`}
              />
            </button>
        </div>
      </div>

      {/* Content section with optimized spacing */}
      <div className="flex flex-col flex-grow p-3">
          {/* Title with duration - improved spacing and heading size */}
        <div className="mb-2">
            <div className="flex flex-col mb-1">
              <div className="flex justify-between items-start">
                <h3 
                  className="text-sm md:text-base font-extrabold text-gray-900 dark:text-white line-clamp-2 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  onClick={navigateToCourse}
                >
                  {adaptedTitle || "Course Title"}
                </h3>
          
                {/* In Progress indicator - New feature */}
                {isInProgress && (
                  <span className="ml-2 flex-shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                    <BarChart size={8} className="mr-1" />
                    {progress}%
                  </span>
                )}
              </div>
              
              {/* Duration displayed right after title */}
              <div className="flex items-center mt-0.5 text-xs text-gray-700 dark:text-gray-300">
                <Timer size={10} className="text-primary-500 mr-1" />
                <span className="font-medium text-[11px]">{formatDuration(course?.course_duration)}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-1">
            {course?.rating && (
              <div className="flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={10}
                      className={`${
                        i < Math.floor(course.rating) 
                          ? "text-yellow-400 fill-yellow-400" 
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-1 text-[10px] text-gray-600 dark:text-gray-400">
                  {course.rating} ({course.reviews || 0})
                </span>
              </div>
            )}
            
              {/* Enrollment status - with modern badge styling */}
            {enrollmentStatus && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium truncate max-w-[80px]">
                {enrollmentStatus}
              </span>
            )}
          </div>
        </div>

          {/* Progress bar for non-hover state - New feature */}
          {isInProgress && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">Your progress</span>
                <span className="text-xs font-medium text-primary-600 dark:text-primary-400">{progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-500 rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
          </div>
          )}

          {/* Course details - updated with more modern styling */}
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mb-4">
            <div className="flex flex-col items-center p-1.5 sm:p-2 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg border border-emerald-100 dark:border-emerald-900/30 group/stats hover:scale-105 transition-transform">
              <BookOpen size={14} className="text-emerald-500 mb-0.5 sm:mb-1 group-hover/stats:animate-bounce" />
            <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Sessions</span>
            <span className="text-[10px] sm:text-xs font-medium text-gray-800 dark:text-gray-300 truncate w-full text-center px-1">
              {course?.no_of_Sessions || "N/A"}
            </span>
          </div>

            <div className="flex flex-col items-center p-1.5 sm:p-2 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-lg border border-violet-100 dark:border-violet-900/30 group/stats hover:scale-105 transition-transform">
              <GraduationCap size={14} className="text-violet-500 mb-0.5 sm:mb-1 group-hover/stats:animate-bounce" />
            <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Level</span>
            <span className="text-[10px] sm:text-xs font-medium text-gray-800 dark:text-gray-300 truncate w-full text-center px-1">
              {course?.course_grade || "All Levels"}
            </span>
          </div>
        </div>

          {/* Course features - updated with more modern styling */}
        <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-5">
          {[
              { icon: Users, text: "Expert-led instruction", color: "text-blue-500 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30" },
              { icon: Award, text: "Industry certification", color: "text-amber-500 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30" },
              { icon: Calendar, text: "Flexible scheduling", color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30" }
          ].map(({ icon: Icon, text, color }, index) => (
              <div key={index} className="flex items-center gap-1.5 sm:gap-2 group/feature hover:translate-x-1 transition-transform duration-200">
                <div className={`flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full ${color} border group-hover/feature:scale-110 transition-transform`}>
                <Icon size={12} className="sm:w-3.5 sm:h-3.5" />
              </div>
              <span className="text-[11px] sm:text-xs text-gray-700 dark:text-gray-300 truncate">{text}</span>
            </div>
          ))}
        </div>

          {/* Price section - updated with more modern styling */}
        <div className="mt-auto flex items-center justify-between mb-3 sm:mb-4">
          {course?.course_fee !== undefined && (
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {formatPrice(course.course_fee)}
              </span>
              {course?.original_fee && course.original_fee > course.course_fee && (
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm text-gray-500 line-clamp-3">
                  {formatPrice(course.original_fee)}
                </span>
                    <span className="text-[10px] text-green-500 font-medium">
                      {Math.round((1 - course.course_fee / course.original_fee) * 100)}% off
                    </span>
                  </div>
              )}
            </div>
          )}
          
            {/* Show student count if available - updated with more modern styling */}
          {course?.enrolled_students && (
              <div className="flex items-center text-[10px] sm:text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
              <Users size={12} className="mr-1 sm:mr-1.5" />
              {course.enrolled_students}+ enrolled
            </div>
          )}
        </div>
      </div>

        {/* Action buttons - updated with more modern styling */}
      <div className="px-5 pb-5 mt-auto">
        <div className={`grid ${showRelatedButton ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
          {showRelatedButton ? (
            <button
              onClick={onShowRelated}
                className="w-full px-5 py-2.5 bg-primary-50 text-primary-600 hover:bg-primary-100 font-medium rounded-lg flex items-center justify-center gap-2 transition-colors border border-primary-200 hover:scale-105 active:scale-95 transform transition-transform"
            >
              <Sparkles size={16} />
              Show Related Courses
            </button>
          ) : (
            <>
              <button
                onClick={openModal}
                  className="px-5 py-2.5 border border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 font-medium rounded-lg flex items-center justify-center gap-2 transition-colors hover:scale-105 active:scale-95 transform transition-transform"
              >
                <Download size={16} />
                Brochure
              </button>
              <button
                onClick={navigateToCourse}
                  className={`px-5 py-2.5 ${isInProgress ? 'bg-green-600 hover:bg-green-700' : 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600'} text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm hover:scale-105 active:scale-95 transform transition-transform`}
              >
                  {isInProgress ? 'Continue' : 'Details'}
                <ArrowUpRight size={16} />
              </button>
            </>
            )}
          </div>
        </div>
      </div>

      {/* Info View (on hover) - completely redesigned for Gen Alpha */}
      <div 
        className={`transition-all duration-300 h-full ${isHovered ? 'opacity-100 z-20' : 'opacity-0 absolute inset-0 pointer-events-none'}`}
      >
        {/* Course thumbnail with overlay */}
        <div className="relative w-full aspect-[3/2]">
          <Image
            src={!isImageError ? (course?.course_image || image6) : image6}
            alt={course?.course_title || "Course thumbnail"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            className="object-cover"
          />
          
          <div className="absolute inset-0 bg-gradient-to-b from-primary-900/80 via-primary-900/90 to-gray-900/95 backdrop-blur-[2px]"></div>
          
          {/* Course title and basic info */}
          <div className="absolute inset-0 p-4 flex flex-col">
            <div className="flex items-center mb-2 space-x-2">
              {course?.course_category && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm text-white border border-white/20 animate-fadeIn truncate max-w-[120px] sm:max-w-[150px]">
                  <Tag size={10} className="mr-1 flex-shrink-0" />
                  <span className="truncate">{course.course_category}</span>
                </span>
              )}
              {course?.is_popular && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-rose-500/30 text-rose-100 border border-rose-500/30 animate-fadeIn">
                  <TrendingUp size={10} className="mr-1 animate-pulse flex-shrink-0" />
                  <span className="truncate">Trending</span>
                </span>
              )}
            </div>
            
            <h3 className="text-base sm:text-lg font-extrabold text-white mb-1 animate-slideUp line-clamp-2">{adaptedTitle || "Course Title"}</h3>
            
            <div className="flex items-center mb-3 animate-slideUp delay-100">
              <div className="flex items-center mr-3">
                <Timer size={14} className="text-primary-300 mr-1 flex-shrink-0" />
                <span className="text-xs text-white font-bold truncate">{formatDuration(course?.course_duration)}</span>
              </div>
              {course?.course_grade && (
                <div className="flex items-center">
                  <GraduationCap size={14} className="text-primary-300 mr-1 flex-shrink-0" />
                  <span className="text-xs text-white font-bold truncate">{course?.course_grade}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons in hover view - Updated with Save feature */}
          <div className="absolute top-2 right-2 z-20 flex space-x-2">
            {/* Like Button */}
            <button 
              onClick={handleLikeClick}
              className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-white/30 active:scale-90"
            >
              <Heart 
                size={16} 
                className={`transition-all duration-300 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'} ${likeAnimation ? 'scale-150' : 'scale-100'}`}
              />
            </button>
            
            {/* Save/Bookmark Button - New feature */}
            <button 
              onClick={handleSaveClick}
              className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-white/30 active:scale-90"
            >
              <Bookmark 
                size={16} 
                className={`transition-all duration-300 ${isSaved ? 'fill-primary-500 text-primary-500' : 'text-white'}`}
              />
            </button>
          </div>
        </div>
        
        {/* Interactive tabs for different content */}
        <div className="px-4 pt-2 border-b border-gray-200 dark:border-gray-800 animate-fadeIn delay-200">
          <div className="flex space-x-4">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`pb-2 text-xs font-medium transition-colors ${
                activeTab === 'overview' 
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('highlights')}
              className={`pb-2 text-xs font-medium transition-colors ${
                activeTab === 'highlights' 
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Highlights
            </button>
            <button 
              onClick={() => setActiveTab('stats')}
              className={`pb-2 text-xs font-medium transition-colors ${
                activeTab === 'stats' 
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Stats
            </button>
          </div>
        </div>
        
        {/* Tab content */}
        <div className="p-4 flex-grow flex flex-col relative">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-primary-500 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-purple-500 blur-2xl"></div>
          </div>

          {/* Overview Tab */}
          <div className={`transition-all duration-300 h-full ${activeTab === 'overview' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 absolute inset-0 pointer-events-none'}`}>
            {/* Course description */}
            {course?.course_description && (
              <div className="mb-3 relative z-10">
                <h5 className="text-xs uppercase tracking-wider text-primary-500 dark:text-primary-400 font-semibold mb-1">About this course</h5>
                <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 font-medium">{adaptedDescription}</p>
              </div>
            )}
            
            {/* What you'll learn - simplified for overview */}
            <div className="mb-3 relative z-10">
              <h5 className="text-xs uppercase tracking-wider text-primary-500 dark:text-primary-400 font-semibold mb-1 flex items-center">
                <Target size={12} className="mr-1 flex-shrink-0" />
                What you'll learn
              </h5>
              <ul className="space-y-1">
                {courseHighlights.slice(0, 2).map((highlight, idx) => (
                  <li key={idx} className="flex items-start text-xs md:text-sm text-gray-700 dark:text-gray-300 font-medium">
                    <CheckCircle size={12} className="text-green-500 dark:text-green-400 mr-1.5 mt-0.5 flex-shrink-0" />
                    <span>{highlight}</span>
                  </li>
                ))}
                {courseHighlights.length > 2 && (
                  <button 
                    onClick={() => setActiveTab('highlights')}
                    className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    + See more highlights
                  </button>
                )}
              </ul>
            </div>
          </div>
          
          {/* Highlights Tab */}
          <div className={`transition-all duration-300 h-full ${activeTab === 'highlights' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 absolute inset-0 pointer-events-none'}`}>
            {/* What you'll learn - full list */}
            <div className="mb-4 relative z-10">
              <h5 className="text-xs uppercase tracking-wider text-primary-500 dark:text-primary-400 font-semibold mb-2 flex items-center">
                <Target size={12} className="mr-1" />
                What you'll learn
              </h5>
              <ul className="space-y-2">
                {courseHighlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start text-xs md:text-sm text-gray-700 dark:text-gray-300 font-medium bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <CheckCircle size={14} className="text-green-500 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Course topics */}
            {course?.course_topics && course.course_topics.length > 0 && (
              <div className="mb-3 relative z-10">
                <h5 className="text-xs uppercase tracking-wider text-primary-500 dark:text-primary-400 font-semibold mb-1.5 flex items-center">
                  <Layers size={12} className="mr-1 flex-shrink-0" />
                  Topics Covered
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {course.course_topics.map((topic, idx) => (
                    <span key={idx} className="text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-200 dark:hover:border-primary-800 transition-colors truncate max-w-[120px]">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Stats Tab */}
          <div className={`transition-all duration-300 h-full ${activeTab === 'stats' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 absolute inset-0 pointer-events-none'}`}>
            {/* Course stats in cards */}
            <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 flex flex-col items-center border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hover:scale-105 transition-transform">
                <BookOpen size={18} className="text-primary-500 dark:text-primary-400 mb-1" />
                <span className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">Sessions</span>
                <span className="text-lg font-bold text-gray-800 dark:text-gray-200">{course?.no_of_Sessions || "N/A"}</span>
              </div>
              
              {course?.enrolled_students && (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 flex flex-col items-center border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hover:scale-105 transition-transform">
                  <Users size={18} className="text-primary-500 dark:text-primary-400 mb-1" />
                  <span className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">Students</span>
                  <span className="text-lg font-bold text-gray-800 dark:text-gray-200">{course.enrolled_students}+</span>
                </div>
              )}
              
              {course?.rating && (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 flex flex-col items-center border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hover:scale-105 transition-transform">
                  <Star size={18} className="text-yellow-400 mb-1" />
                  <span className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">Rating</span>
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-gray-800 dark:text-gray-200 mr-1">{course.rating}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={10}
                          className={i < Math.floor(course.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {course?.course_fee !== undefined && (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 flex flex-col items-center border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hover:scale-105 transition-transform">
                  <Tag size={18} className="text-green-500 mb-1" />
                  <span className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">Price</span>
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-gray-800 dark:text-gray-200">{formatPrice(course.course_fee)}</span>
                    {course?.original_fee && course.original_fee > course.course_fee && (
                      <span className="text-xs text-green-500 font-medium">
                        {Math.round((1 - course.course_fee / course.original_fee) * 100)}% off
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Progress stat - New feature */}
              {progress !== null && (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 flex flex-col items-center border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hover:scale-105 transition-transform col-span-2">
                  <BarChart size={18} className={`${isCompleted ? 'text-green-500' : 'text-primary-500 dark:text-primary-400'} mb-1`} />
                  <span className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">Completion</span>
                  <div className="w-full mt-1.5">
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${isCompleted ? 'bg-green-500' : 'bg-primary-500'} rounded-full transition-all duration-1000`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">0%</span>
                      <span className={`text-xs font-medium ${isCompleted ? 'text-green-500' : 'text-primary-500 dark:text-primary-400'}`}>{progress}%</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">100%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Price and action buttons */}
          <div className="mt-auto relative z-10">
            <div className={`grid ${showRelatedButton ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
              {showRelatedButton ? (
                <button
                  onClick={onShowRelated}
                  className="w-full px-5 py-2.5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50 font-medium rounded-lg flex items-center justify-center gap-2 transition-colors border border-primary-200 dark:border-primary-800 hover:scale-105 active:scale-95 transform transition-transform"
                >
                  <Sparkles size={16} />
                  Show Related Courses
                </button>
              ) : (
                <>
                  <button
                    onClick={openModal}
                    className="px-5 py-2.5 border border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 font-medium rounded-lg flex items-center justify-center gap-2 transition-colors hover:scale-105 active:scale-95 transform transition-transform"
                  >
                    <Download size={16} />
                    Brochure
                  </button>
                  <button
                    onClick={navigateToCourse}
                    className={`px-5 py-2.5 ${isInProgress ? 'bg-green-600 hover:bg-green-700' : 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600'} text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm hover:scale-105 active:scale-95 transform transition-transform`}
                  >
                    {isInProgress ? 'Continue' : 'Details'}
                    <ArrowUpRight size={16} />
                  </button>
                </>
              )}
            </div>
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
    </div>
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