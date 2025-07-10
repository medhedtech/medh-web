'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { NextPage } from 'next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  BookOpen, 
  Clock, 
  Calendar, 
  Users,
  Sparkles, 
  Star,
  AlertTriangle, 
  Download as DownloadIcon,
  FileText,
  ChevronDown,
  Award,
  CheckCircle,
  Target,
  BriefcaseBusiness,
  Download,
  BarChart,
  Brain,
  Check,
  Banknote,
  ArrowRight,
  Heart,
  Lock,
  Info,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Loader
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { showToast } from '@/utils/toastManager';
import Link from 'next/link';
import { useTheme } from "next-themes";
import { useIsClient } from "@/utils/hydration";

// Course detailed sections
import CourseNavigation from '@/components/sections/course-detailed/CourseNavigation';
import CourseHeader from '@/components/sections/course-detailed/CourseHeader';
import CourseFaq from '@/components/sections/course-detailed/courseFaq';
import CourseCertificate from '@/components/sections/course-detailed/courseCertificate';
import CourseRelated from '@/components/sections/course-detailed/courseRelated';
import DownloadBrochureModal from '@/components/shared/download-broucher.js';
import CourseStats from '@/components/sections/course-detailed/CourseStats';

// API and utilities
import { apiUrls } from '@/apis';
import useGetQuery from '@/hooks/getQuery.hook';
import Preloader from '@/components/shared/others/Preloader';

// Assets
import Pdf from '@/assets/images/course-detailed/pdf-icon.svg';
import { getCourseById } from '@/apis/course/course';

// TypeScript Interfaces
interface ICourseDetails {
  _id: string;
  course_title: string;
  course_description?: string | { program_overview?: string; benefits?: string };
  course_duration?: string;
  course_image?: string;
  course_videos?: Array<{ video_url?: string; url?: string; thumbnail?: string }>;
  preview_video?: { url?: string; thumbnail?: string; title?: string; duration?: string; description?: string };
  course_type?: string;
  course_category?: string;
  category?: string;
  class_type?: string;
  classType?: string;
  delivery_format?: string;
  delivery_type?: string;
  curriculum?: Array<{ weekTitle: string; weekDescription: string }>;
  tools_technologies?: Array<{ name: string }>;
  bonus_modules?: Array<{ title: string; description?: string }>;
  highlights?: Array<{ title: string; description: string; iconName?: string }>;
  reviews?: Array<any>;
  brochures?: Array<any>;
  is_Certification?: string;
  certification_details?: string;
  certification?: { is_certified: boolean };
  difficulty_level?: string;
  skill_level?: string;
  no_of_Sessions?: number;
  session_duration?: string;
  live_session_duration?: string;
  class_duration?: string;
  efforts_per_Week?: string;
  time_commitment?: string;
  hours_per_week?: string;
  weekly_hours?: string;
  downloadBrochure?: string;
  features?: Array<{ title: string; description: string }>;
}

interface ICourseVideoPlayerProps {
  courseId?: string;
  courseTitle?: string;
  courseVideos?: Array<{ video_url?: string; url?: string; thumbnail?: string }>;
  previewVideo?: { url?: string; thumbnail?: string; title?: string; duration?: string; description?: string };
  courseImage?: string;
  primaryColor: string;
}

interface ICourseDetailsPageProps {
  courseId?: string;
  courseDetails?: ICourseDetails;
  initialActiveSection?: string;
  classType?: string;
  courseSelectionComponent?: React.ReactNode;
}

interface ICategoryColorClasses {
  primaryColor: string;
  secondaryColor: string;
  color: string;
}

interface ICourseFeature {
  label: string;
  value: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  fillOpacity: number;
}

// Course Video Player Component
/**
 * CourseVideoPlayer Props
 * @param courseId - string | undefined
 * @param courseTitle - string | undefined
 * @param courseVideos - array | undefined
 * @param previewVideo - { url?: string; thumbnail?: string; title?: string; duration?: string; description?: string } | undefined
 * @param courseImage - string | undefined
 * @param primaryColor - string
 */
const CourseVideoPlayer: React.FC<ICourseVideoPlayerProps> = ({ courseId, courseTitle, courseVideos, previewVideo, courseImage, primaryColor }) => {
  const [isPlaying, setIsPlaying] = useState(true); // Start with playing state
  const [isMuted, setIsMuted] = useState(true); // Start muted for autoplay
  const [showControls, setShowControls] = useState(false); // Hide controls by default
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Extract video URL from previewVideo or course videos or use a default promotional video
  useEffect(() => {
    if (previewVideo && previewVideo.url) {
      setVideoUrl(previewVideo.url || '');
    } else if (courseVideos && courseVideos.length > 0) {
      setVideoUrl(courseVideos[0].video_url || courseVideos[0].url || '');
    } else {
      setVideoUrl(''); // No video, fallback to image
    }
  }, [previewVideo, courseVideos]);

  const togglePlay = async () => {
    if (!videoRef.current) return;
    
    setIsLoading(true);
    try {
      if (isPlaying) {
        await videoRef.current.pause();
        setIsPlaying(false);
      } else {
        await videoRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Video play error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoLoad = () => {
    setIsLoading(false);
    // Auto play when video is loaded
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log('Autoplay failed:', error);
        setIsPlaying(false);
      });
    }
  };

  const handleVideoError = () => {
    setIsLoading(false);
    setIsPlaying(false);
    console.error('Video failed to load');
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  if (!videoUrl) {
    // Mobile-optimized fallback
    return (
      <div className={`relative w-full ${isMobile ? 'rounded-none' : 'rounded-xl'} bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center overflow-hidden`} style={{ aspectRatio: isMobile ? '16/9' : '16/9' }}>
        {courseImage ? (
          <img
            src={courseImage}
            alt={courseTitle || 'Course Preview'}
            className={`w-full h-full object-cover ${isMobile ? 'rounded-none' : 'rounded-xl'}`}
            style={{ aspectRatio: '16/9' }}
          />
        ) : (
          <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-${primaryColor}-100 dark:bg-${primaryColor}-900/30 rounded-full flex items-center justify-center mb-3`}>
            <Play className={`w-6 h-6 sm:w-8 sm:h-8 text-${primaryColor}-600 dark:text-${primaryColor}-400`} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full group">
      {/* Video Container - Mobile optimized */}
      <div 
        ref={containerRef}
        className={`relative w-full bg-black ${isMobile ? 'rounded-none' : 'rounded-xl'} overflow-hidden ${isMobile ? 'shadow-none' : 'shadow-lg'} group cursor-pointer`}
        style={{ aspectRatio: '16/9' }}
        onMouseEnter={() => !isMobile && setShowControls(true)}
        onMouseLeave={() => !isMobile && setShowControls(false)}
        onTouchStart={() => isMobile && setShowControls(true)}
        onTouchEnd={() => isMobile && setTimeout(() => setShowControls(false), 3000)}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          poster={courseVideos?.[0]?.thumbnail || ''}
          autoPlay
          muted
          loop
          playsInline
          onLoadStart={() => setIsLoading(true)}
          onCanPlay={handleVideoLoad}
          onError={handleVideoError}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Video Controls Overlay - Mobile optimized */}
        <motion.div 
          className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-all duration-300 ${
            showControls || isMobile ? 'opacity-100' : 'opacity-0'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: showControls || isMobile ? 1 : 0 }}
          onClick={togglePlay}
        >
          {/* Play/Pause Icon - Mobile optimized */}
          <motion.div
            className={`flex items-center justify-center ${isMobile ? 'w-16 h-16' : 'w-20 h-20'} bg-white/90 dark:bg-gray-900/90 rounded-full shadow-xl hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 backdrop-blur-sm`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: showControls || isMobile ? 1 : 0.8, 
              opacity: showControls || isMobile ? 1 : 0 
            }}
            transition={{ duration: 0.3 }}
          >
            {isLoading ? (
              <Loader className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} text-gray-600 dark:text-gray-300 animate-spin`} />
            ) : isPlaying ? (
              <Pause className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} text-gray-800 dark:text-gray-200`} />
            ) : (
              <Play className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} text-gray-800 dark:text-gray-200 ml-1`} />
            )}
          </motion.div>
        </motion.div>

        {/* Bottom Controls - Mobile optimized */}
        <motion.div 
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent ${isMobile ? 'p-3' : 'p-4'} transition-opacity duration-300 ${
            showControls || isMobile ? 'opacity-100' : 'opacity-0'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: showControls || isMobile ? 1 : 0 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleMute}
                className={`text-white hover:text-gray-300 transition-colors ${isMobile ? 'p-2' : 'p-1'}`}
              >
                {isMuted ? (
                  <VolumeX className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
                ) : (
                  <Volume2 className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
                )}
              </button>
            </div>
            
            {/* Fullscreen Button - Mobile optimized */}
            <div className="flex items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullscreen();
                }}
                className={`text-white hover:text-gray-300 transition-colors ${isMobile ? 'p-2' : 'p-1'} rounded hover:bg-white/20`}
                title="Toggle Fullscreen"
              >
                <Maximize className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Loading Overlay - Mobile optimized */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white">
              <Loader className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} animate-spin mx-auto mb-2`} />
              <p className={`${isMobile ? 'text-xs' : 'text-sm'}`}>Loading video...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CourseDetailsPage: React.FC<ICourseDetailsPageProps> = ({ ...props }) => {
  // State for active section and navigation
  const [activeSection, setActiveSection] = useState<string>(props.initialActiveSection || 'about');
  const [courseDetails, setCourseDetails] = useState<ICourseDetails | null>(props.courseDetails || null);
  const [curriculum, setCurriculum] = useState<Array<{ weekTitle: string; weekDescription: string }>>([]);
  const [reviews, setReviews] = useState<Array<any>>([]);
  const [toolsTechnologies, setToolsTechnologies] = useState<Array<{ name: string }>>([]);
  const [bonusModules, setBonusModules] = useState<Array<{ title: string; description?: string }>>([]);
  const [openAccordions, setOpenAccordions] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showClassTypeInfo, setShowClassTypeInfo] = useState(false);
  const [theme, setTheme] = useState('light');
  const [showBrochureModal, setShowBrochureModal] = useState(false);
  const [courseId, setCourseId] = useState(props.courseId);

  
  // Refs for component structure - we don't use these for scrolling anymore
  const aboutRef = useRef(null);
  const curriculumRef = useRef(null);
  const reviewsRef = useRef(null);
  const faqRef = useRef(null);
  const certificateRef = useRef(null);
  
  // Fetch data hook
  const { getQuery } = useGetQuery();
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const isClient = useIsClient();

  // Fetch course details from API
  const fetchCourseDetails = async (id: string) => {
    setLoading(true);
    try {
      console.log("Fetching course details for ID:", id);
      
      // Ensure we have a valid ID before making the API call
      if (!id) {
        console.error("No course ID provided to fetchCourseDetails");
        showToast.error("Cannot load course: Missing course identifier");
        setLoading(false);
        return;
      }
      
      await getQuery({
        url: getCourseById(id),
        onSuccess: (data) => {
          console.log("Course details received:", data);
          
          // Handle different API response formats
          const courseData = data?.course || data?.data || data;
          
          if (!courseData || !courseData._id) {
            console.error("Invalid course data structure received:", data);
            showToast.error("Received invalid course data format");
            setLoading(false);
            return;
          }
          
          // Store the complete course data
          setCourseDetails(courseData);
          
          // Process curriculum data
          if (courseData?.curriculum && Array.isArray(courseData.curriculum) && courseData.curriculum.length > 0) {
            console.log("Processing curriculum data:", courseData.curriculum.length, "items");
            setCurriculum(courseData.curriculum);
          } else {
            console.log("No curriculum data found or empty array");
            setCurriculum([]);
          }
          
          // Check for tools & technologies
          if (courseData?.tools_technologies && Array.isArray(courseData.tools_technologies) && courseData.tools_technologies.length > 0) {
            console.log("Processing tools & technologies:", courseData.tools_technologies.length, "items");
            setToolsTechnologies(courseData.tools_technologies);
          } else {
            // Initialize as empty array if not present
            setToolsTechnologies([]);
          }
          
          // Check for bonus modules
          if (courseData?.bonus_modules && Array.isArray(courseData.bonus_modules) && courseData.bonus_modules.length > 0) {
            console.log("Processing bonus modules:", courseData.bonus_modules.length, "items");
            setBonusModules(courseData.bonus_modules);
          } else {
            // Initialize as empty array if not present
            setBonusModules([]);
          }
          
          // Check for reviews
          if (courseData?.reviews && Array.isArray(courseData.reviews)) {
            console.log("Processing reviews:", courseData.reviews.length, "items");
            setReviews(courseData.reviews);
          } else {
            // Initialize as empty array if not present
            setReviews([]);
          }
          
          setLoading(false);
        },
        onFail: (err) => {
          console.error("Error fetching course details:", err);
          
          // Improved error messaging based on error type
          if (err.response) {
            // Server responded with error status
            if (err.response.status === 404) {
              showToast.error(`Course with ID ${id} not found`);
            } else if (err.response.status === 403) {
              showToast.error("You don't have permission to access this course");
            } else {
              showToast.error(`Error loading course: ${err.response.status} ${err.response.statusText}`);
            }
          } else if (err.request) {
            // Request made but no response received (network issue)
            showToast.error("Network error: Could not connect to course service");
          } else {
            // Something else happened
            showToast.error("Could not load course details. Please try again.");
          }
          
          setLoading(false);
        },
      });
    } catch (error) {
      console.error("Exception in fetchCourseDetails:", error);
      showToast.error("An unexpected error occurred. Please refresh the page.");
      setLoading(false);
    }
  };

  // Reset states when courseId changes
  useEffect(() => {
    if (props.courseId) {
      // Reset states when courseId changes to avoid showing stale data
      setCourseDetails(null);
      setCurriculum([]);
      setToolsTechnologies([]);
      setBonusModules([]);
      setReviews([]);
      setOpenAccordions(null);
      
      // Fetch new course details
      fetchCourseDetails(props.courseId);
    } else {
      setLoading(false);
    }
  }, [props.courseId]);
  
  // Handle initialActiveSection changes
  useEffect(() => {
    if (props.initialActiveSection && props.initialActiveSection !== activeSection) {
      console.log(`Updating active section to: ${props.initialActiveSection}`);
      setActiveSection(props.initialActiveSection);
    }
  }, [props.initialActiveSection]);

  // Check login status
  useEffect(() => {
    if (!isClient) return;
    
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const user = localStorage.getItem('user') || localStorage.getItem('userData');
    
    setIsLoggedIn(!!token && (!!userId || !!user));
  }, [isClient]);

  // Add debug logging for modal state changes
  useEffect(() => {
    if (showClassTypeInfo) {
      console.log('🔍 Class Types Modal: Opened');
      console.log('📱 Device Type:', window.innerWidth <= 768 ? 'Mobile' : 'Desktop');
      console.log('🎨 Theme:', theme);
    } else {
      console.log('🔍 Class Types Modal: Closed');
    }
  }, [showClassTypeInfo, theme]);

  // Enhanced modal toggle with debug logging
  const toggleClassTypeInfo = (event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    console.log('🔄 Toggling Class Types Modal:', !showClassTypeInfo);
    setShowClassTypeInfo(!showClassTypeInfo);
  };

  // Enhanced modal close with debug logging
  const handleCloseModal = (event?: React.MouseEvent, source: string = 'button') => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    console.log(`🔒 Closing Class Types Modal (Source: ${source})`);
    setShowClassTypeInfo(false);
  };

  const toggleAccordion = (index: number) => {
    setOpenAccordions(openAccordions === index ? null : index);
  };

  // Updated to just change the active section state without scrolling
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
  };
  
  // Modal controls (removed unused modal functions)
  
  // Generate course features from course details
  const getCourseFeatures = () => {
    if (!courseDetails) {
      return []; // Return empty array if no course details available
    }

    try {
      // Map API field names to our feature structure with better error handling
      const features = [];

      // Only add duration for non-blended courses
      if (!isBlendedCourse(courseDetails)) {
        features.push({
          label: "Duration",
          value: formatDuration(courseDetails),
          icon: Calendar,
          color: "text-purple-500 dark:text-purple-400",
          bgColor: "bg-purple-50 dark:bg-purple-900/30",
          fillOpacity: 0.2,
        });
      }

      // Add other features
      features.push(
        {
          label: isBlendedCourse(courseDetails) ? "Videos" : "Live Sessions",
          value: formatLiveSessions(courseDetails),
          icon: Users,
          color: "text-blue-500 dark:text-blue-400",
          bgColor: "bg-blue-50 dark:bg-blue-900/30",
          fillOpacity: 0.2,
        },
        {
          label: "Format",
          value: courseDetails?.course_type || 
                courseDetails?.course_category || 
                courseDetails?.category || 
                "Personality Development",
          icon: Sparkles,
          color: "text-amber-500 dark:text-amber-400",
          bgColor: "bg-amber-50 dark:bg-amber-900/30",
          fillOpacity: 0.2,
        },
        {
          label: "Time Commitment",
          value: formatTimeCommitment(courseDetails),
          icon: Clock,
          color: "text-green-500 dark:text-green-400",
          bgColor: "bg-green-50 dark:bg-green-900/30",
          fillOpacity: 0.2,
        }
      );

      // Add optional features if data is available
      if (courseDetails.difficulty_level || courseDetails.skill_level) {
        features.push({
          label: "Level",
          value: courseDetails.difficulty_level || courseDetails.skill_level,
          icon: FileText,
          color: "text-indigo-500 dark:text-indigo-400",
          bgColor: "bg-indigo-50 dark:bg-indigo-900/30",
          fillOpacity: 0.2,
        });
      }

      if (courseDetails.is_Certification === "Yes") {
        const certDetails = courseDetails.certification_details || "Professional certification upon completion";
        features.push({
          label: "Certification",
          value: certDetails,
          icon: Award,
          color: "text-emerald-500 dark:text-emerald-400",
          bgColor: "bg-emerald-50 dark:bg-emerald-900/30",
          fillOpacity: 0.2,
        });
      }

      return features;
    } catch (error) {
      console.error("Error generating course features:", error);
      // Return default features in case of error
      return [
        {
          label: "Duration",
          value: "9 months / 36 weeks",
          icon: Calendar,
          color: "text-purple-500 dark:text-purple-400",
          bgColor: "bg-purple-50 dark:bg-purple-900/30",
          fillOpacity: 0.2,
        },
        {
          label: "Live Sessions",
          value: "72",
          icon: Users,
          color: "text-blue-500 dark:text-blue-400",
          bgColor: "bg-blue-50 dark:bg-blue-900/30",
          fillOpacity: 0.2,
        },
        {
          label: "Format",
          value: "Personality Development",
          icon: Sparkles,
          color: "text-amber-500 dark:text-amber-400",
          bgColor: "bg-amber-50 dark:bg-amber-900/30",
          fillOpacity: 0.2,
        },
        {
          label: "Time Commitment",
          value: "3 - 4 hours / week",
          icon: Clock,
          color: "text-green-500 dark:text-green-400",
          bgColor: "bg-green-50 dark:bg-green-900/30",
          fillOpacity: 0.2,
        },
      ];
    }
  };
  
  // Helper function to detect if course is blended
  const isBlendedCourse = (details: ICourseDetails | null | undefined): boolean => {
    if (!details) return false;
    
    return (
      details.classType === 'Blended Courses' || 
      details.class_type === 'Blended Courses' ||
      details.course_type === 'blended' || 
      details.course_type === 'Blended' ||
      details.delivery_format === 'Blended' ||
      details.delivery_type === 'Blended' ||
      details.course_category === 'Blended Courses'
    );
  };

  // Helper functions to format course details
  const formatDuration = (details: ICourseDetails | null | undefined): string => {
    if (!details) return "9 months / 36 weeks";
    
    // For blended courses, show "Self Paced + Live Q&A sessions"
    if (isBlendedCourse(details)) {
      return 'Self Paced + Live Q&A sessions';
    }
    
    try {
      // Try different possible field names
      const duration = details.course_duration;
      
      if (duration) {
        // Check if the duration string only contains weeks (no months)
        if (duration.toLowerCase().match(/^\s*\d+\s*weeks?\s*$/i)) {
          // If it's just weeks, return it directly without conversion
          return duration;
        }
        
        // Use regex to extract months and weeks if they exist in the duration string
        const monthsMatch = duration.match(/(\d+)\s*months?/i);
        const weeksMatch = duration.match(/(\d+)\s*weeks?/i);
        
        const months = monthsMatch ? monthsMatch[1] : null;
        const weeks = weeksMatch ? weeksMatch[1] : null;
        
        // If both months and weeks are found, format as "X months / Y weeks"
        if (months && weeks) {
          return `${months} months / ${weeks} weeks`;
        }
        
        // If only one is found, try to calculate the other
        if (months && !weeks) {
          // Approximate 1 month as 4 weeks
          const calculatedWeeks = parseInt(months) * 4;
          return `${months} months / ${calculatedWeeks} weeks`;
        }
        
        if (!months && weeks) {
          // If only weeks are specified, just return the weeks without converting to months
          return `${weeks} weeks`;
        }
        
        // If no pattern matched but we have a duration string, return it as is
        return duration;
      }
    } catch (error) {
      console.error("Error formatting duration:", error);
    }
    
    return "9 months / 36 weeks"; // Default fallback
  };
  
  const formatLiveSessions = (details: ICourseDetails | null | undefined): string => {
    if (!details) return "72";
    
    // For blended courses, show "Videos" instead of "Sessions"
    if (isBlendedCourse(details)) {
      try {
        // Get video count (could be from various fields)
        const videoCount = details.no_of_Sessions || details.course_videos?.length || "72";
        
        // Get video duration if available
        const videoDuration = details.session_duration || details.live_session_duration || details.class_duration;
        
        // If we have both count and duration, combine them
        if (videoDuration) {
          // Clean up duration format if needed
          let formattedDuration = videoDuration;
          
          // If duration is just a number, assume it's minutes
          if (/^\d+$/.test(videoDuration)) {
            formattedDuration = `${videoDuration} min`;
          }
          
          // If duration doesn't contain "min" or "hour", assume it's minutes
          if (!formattedDuration.toLowerCase().includes('min') && 
              !formattedDuration.toLowerCase().includes('hour')) {
            formattedDuration = `${formattedDuration} min`;
          }
          
          return `${videoCount} Videos (${formattedDuration})`;
        }
        
        // If we only have count, return just that with "Videos"
        return `${videoCount} Videos`;
      } catch (error) {
        console.error("Error formatting videos:", error);
        return "72 Videos"; // Default fallback for blended courses
      }
    }
    
    // For non-blended courses, show sessions as before
    try {
      // Get session count - using the field from the example API
      const sessionCount = details.no_of_Sessions || "72";
      
      // Get session duration - using the field from the example API
      const sessionDuration = details.session_duration || 
                            details.live_session_duration || 
                            details.class_duration;
      
      // If we have both count and duration, combine them
      if (sessionDuration) {
        // Clean up duration format if needed
        let formattedDuration = sessionDuration;
        
        // If duration is just a number, assume it's minutes
        if (/^\d+$/.test(sessionDuration)) {
          formattedDuration = `${sessionDuration} min`;
        }
        
        // If duration doesn't contain "min" or "hour", assume it's minutes
        if (!formattedDuration.toLowerCase().includes('min') && 
            !formattedDuration.toLowerCase().includes('hour')) {
          formattedDuration = `${formattedDuration} min`;
        }
        
        return `${sessionCount} (${formattedDuration})`;
      }
      
      // If we only have count, return just that
      return sessionCount.toString();
    } catch (error) {
      console.error("Error formatting live sessions:", error);
      return "72"; // Default fallback
    }
  };
  
  const formatTimeCommitment = (details: ICourseDetails | null | undefined): string => {
    if (!details) return "3 - 4 hours / week";
    
    try {
      // Try all possible field names from various API versions
      const timeCommitment = details.efforts_per_Week || 
                          details.time_commitment || 
                          details.hours_per_week ||
                          details.weekly_hours;
      
      if (!timeCommitment) return "3 - 4 hours / week";
      
      // Check if the value is already properly formatted
      if (timeCommitment.includes("hour") || timeCommitment.includes("hr")) {
        return timeCommitment;
      }
      
      // Format numeric values
      if (/^\d+$/.test(timeCommitment)) {
        return `${timeCommitment} hours / week`;
      }
      
      // Format "undefined - undefined" type strings
      if (timeCommitment.includes("undefined")) {
        return "3 - 4 hours / week";
      }
      
      return timeCommitment;
    } catch (error) {
      console.error("Error formatting time commitment:", error);
      return "3 - 4 hours / week"; // Default fallback
    }
  };

  // Determine if the course has a certificate
  const hasCertificate = () => {
    if (!courseDetails) return true; // Default to true
    
    // Check both is_Certification field and certification object
    if (courseDetails.is_Certification) {
      return courseDetails.is_Certification === "Yes";
    }
    
    if (courseDetails.certification) {
      return courseDetails.certification.is_certified === true;
    }
    
    return false; // Default to false if no certification info available
  };

  // Determine if the course has a brochure
  const hasBrochure = () => {
    if (!courseDetails) return false; // Default to false
    
    // Check for brochures field
    if (courseDetails.brochures && Array.isArray(courseDetails.brochures) && courseDetails.brochures.length > 0) {
      return true;
    }
    
    return false; // Default to false if no brochures found
  };

  // Function to get category-based color classes
  const getCategoryColorClasses = () => {
    if (!courseDetails?.category) return { primaryColor: 'blue', secondaryColor: 'indigo', color: 'text-blue-500' };
    
    const category = courseDetails.category.toLowerCase();
    
    switch(category) {
      case 'technology':
        return { primaryColor: 'blue', secondaryColor: 'indigo', color: 'text-blue-500' };
      case 'design':
        return { primaryColor: 'purple', secondaryColor: 'violet', color: 'text-purple-500' };
      case 'business':
        return { primaryColor: 'emerald', secondaryColor: 'green', color: 'text-emerald-500' };
      case 'marketing':
        return { primaryColor: 'amber', secondaryColor: 'yellow', color: 'text-amber-500' };
      case 'wellness':
        return { primaryColor: 'rose', secondaryColor: 'pink', color: 'text-rose-500' };
      case 'language':
        return { primaryColor: 'teal', secondaryColor: 'cyan', color: 'text-teal-500' };
      case 'science':
        return { primaryColor: 'violet', secondaryColor: 'purple', color: 'text-violet-500' };
      case 'personal development':
        return { primaryColor: 'orange', secondaryColor: 'amber', color: 'text-orange-500' };
      default:
        return { primaryColor: 'blue', secondaryColor: 'indigo', color: 'text-blue-500' };
    }
  };

  // Function to get icon based on iconName
  const getHighlightIcon = (iconName: string | undefined): JSX.Element => {
    const colorClass = `text-${getCategoryColorClasses().primaryColor}-500 dark:text-${getCategoryColorClasses().primaryColor}-400`;
    
    switch(iconName?.toLowerCase()) {
      case 'target':
        return <Target className="w-6 h-6" fill="currentColor" fillOpacity={0.2} />;
      case 'certificate':
        return <Award className="w-6 h-6" fill="currentColor" fillOpacity={0.2} />;
      case 'briefcase':
        return <BriefcaseBusiness className="w-6 h-6" fill="currentColor" fillOpacity={0.2} />;
      case 'calendar':
        return <Calendar className="w-6 h-6" fill="currentColor" fillOpacity={0.2} />;
      case 'graph':
        return <BarChart className="w-6 h-6" fill="currentColor" fillOpacity={0.2} />;
      case 'book':
        return <BookOpen className="w-6 h-6" fill="currentColor" fillOpacity={0.2} />;
      case 'star':
        return <Star className="w-6 h-6" fill="currentColor" fillOpacity={0.2} />;
      case 'check':
        return <CheckCircle className="w-6 h-6" fill="currentColor" fillOpacity={0.2} />;
      case 'brain':
        return <Brain className="w-6 h-6" fill="currentColor" fillOpacity={0.2} />;
      case 'sparkles':
        return <Sparkles className="w-6 h-6" fill="currentColor" fillOpacity={0.2} />;
      default:
        return <Star className="w-6 h-6" fill="currentColor" fillOpacity={0.2} />;
    }
  };

  // Add this improved helper function to parse course description
  const parseDescription = (description: string): { overview: string; sections: Array<any> } => {
    if (!description) return { overview: '', sections: [] };

    // Convert to string in case it's not already
    const descText = String(description || '');
    
    // Identify section headers - look for keywords that might indicate a section
    const sectionKeywords = [
      'Benefits', 'Features', 'What You\'ll Learn', 'Learning Outcomes', 
      'Course Objectives', 'Skills You\'ll Gain', 'Key Takeaways', 
      'Requirements', 'Prerequisites', 'Who This Course Is For',
      'Target Audience', 'Career Opportunities'
    ];
    
    // Regular expressions for different bullet formats
    const bulletRegexes = [
      /^[\s]*[-–—•][\s]+(.+)$/gm, // Dash, bullet point
      /^[\s]*\*[\s]+(.+)$/gm,     // Asterisk
      /^[\s]*\d+\.[\s]+(.+)$/gm,  // Numbered list (1., 2., etc)
      /^[\s]*[a-z]\.[\s]+(.+)$/gm // Lettered list (a., b., etc)
    ];
    
    // Initialize result with overview as default content
    let overview = descText.trim();
    const sections = [];
    
    // Find potential section headers in the text
    for (const keyword of sectionKeywords) {
      const pattern = new RegExp(`\\b${keyword}\\b`, 'i');
      const match = descText.match(pattern);
      
      if (match && typeof match.index !== 'undefined') {
        const matchIndex = match.index;
        const beforeSection = descText.substring(0, matchIndex).trim();
        
        // If this is the first section found, update overview to be the text before it
        if (overview === descText.trim()) {
          // Remove common headers like "Program Overview" or "About the Course"
          overview = beforeSection
            .replace(/^(Program|Course|About the Course|About this Course|Course Overview|Overview)[\s:]*/, '')
            .trim();
        }
        
        // Look for the next section header after this one
        let endIndex = descText.length;
        for (const nextKeyword of sectionKeywords) {
          if (nextKeyword === keyword) continue;
          
          const nextPattern = new RegExp(`\\b${nextKeyword}\\b`, 'i');
          const nextMatch = descText.substring(matchIndex + keyword.length).match(nextPattern);
          
          if (nextMatch && typeof nextMatch.index !== 'undefined') {
            const nextMatchFullIndex = matchIndex + keyword.length + nextMatch.index;
            if (nextMatchFullIndex < endIndex) {
              endIndex = nextMatchFullIndex;
            }
          }
        }
        
        // Extract section content
        let sectionContent = descText.substring(matchIndex + keyword.length, endIndex).trim();
        
        // Parse the bullets in this section
        const bullets: string[] = [];
        
        // Try all bullet formats
        for (const regex of bulletRegexes) {
          let bulletMatch;
          // Reset regex lastIndex
          regex.lastIndex = 0;
          
          while ((bulletMatch = regex.exec(sectionContent)) !== null) {
            bullets.push(bulletMatch[1].trim());
          }
          
          // If we found bullets, no need to check other formats
          if (bullets.length > 0) break;
        }
        
        // If no bullets found but we have content with line breaks, treat each line as a potential item
        if (bullets.length === 0 && sectionContent.includes('\n')) {
          const lines = sectionContent.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
          
          // If we have multiple lines, treat them as bullets
          if (lines.length > 1) {
            bullets.push(...lines);
          }
        }
        
        // Add the section to our result
        if (bullets.length > 0) {
          sections.push({
            title: keyword,
            bullets
          });
        } else if (sectionContent.length > 0) {
          // No bullets, but content exists - just add it as a text section
          sections.push({
            title: keyword,
            text: sectionContent
          });
        }
      }
    }
    
    return { overview, sections };
  };

  // Helper to parse About and Benefits from course_description
  function parseAboutAndBenefits(description: string): { about: string; benefits: string[] } {
    // Split at the first occurrence of 'Benefits' (case-insensitive)
    const [aboutPart, benefitsPart] = description.split(/\nBenefits\n/i);
    const about = aboutPart?.trim() || "";
    let benefits: string[] = [];
    if (benefitsPart) {
      benefits = benefitsPart
        .split(/\n+/)
        .map(line => line.trim())
        .filter(line => line.startsWith('-'))
        .map(line => line.replace(/^[-–—•]\s*/, ''));
    }
    return { about, benefits };
  }

  // Helper to parse Overview and Relevance from curriculum weekDescription
  function parseOverviewAndRelevance(desc: string): { overview: string; relevance: string } {
    let overview = '';
    let relevance = '';
    // Try to split at 'Relevance' (case-insensitive, with or without leading/trailing newlines)
    const match = desc.match(/Overview\s*\n([\s\S]*?)(?:\nRelevance\n([\s\S]*))?$/i);
    if (match) {
      overview = (match[1] || '').trim();
      relevance = (match[2] || '').trim();
    } else {
      overview = desc.trim();
    }
    return { overview, relevance };
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] py-10 sm:py-20">
        <div className="relative">
          <Preloader />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 2, times: [0, 0.5, 1] }}
            className="absolute -top-8 sm:-top-10 -right-8 sm:-right-10"
          >
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" fill="currentColor" fillOpacity={0.3} />
          </motion.div>
        </div>
      </div>
    );
  }

  // Get course features
  const courseFeatures = getCourseFeatures();

  // Get class type of the course
  const getClassType = () => {
    if (props.classType) return props.classType;
    if (!courseDetails) return 'Live';
    
    return courseDetails?.class_type || courseDetails?.classType || 'Live';
  };

  // Render the content for the active section
  const renderActiveSection = () => {
    switch(activeSection) {
      case 'about':
      case 'benefits':
        return (
          <motion.section 
            ref={aboutRef} 
            id="about" 
            className="pb-6"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            key="about-section"
          >
            {/* Course Key Info Row - Mobile: Improved layout, Desktop: Contained */}
            <div className="mb-6 px-4 sm:px-0">
              <div className="grid grid-cols-1 sm:flex sm:flex-row gap-2 sm:gap-6 items-start sm:items-center">
                {/* No. of Sessions (Live only) */}
                {(() => {
                  const isLive = getClassType().toLowerCase().includes('live') && !isBlendedCourse(courseDetails);
                  const sessions = courseDetails?.no_of_Sessions;
                  if (isLive && sessions) {
                    return (
                      <div className={`flex items-center justify-between sm:justify-start bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2.5 sm:py-2 text-sm font-medium text-blue-700 dark:text-blue-300 w-full sm:w-auto`}>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-300" aria-label="No. of Sessions" />
                          <span>No. of Sessions:</span>
                        </div>
                        <span className="font-semibold">{sessions}</span>
                      </div>
                    );
                  }
                  return null;
                })()}
                {/* Course Duration */}
                {(() => {
                  const duration = formatDuration(courseDetails);
                  if (duration) {
                    return (
                      <div className={`flex items-center justify-between sm:justify-start bg-purple-50 dark:bg-purple-900/20 rounded-lg px-3 py-2.5 sm:py-2 text-sm font-medium text-purple-700 dark:text-purple-300 w-full sm:w-auto`}>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-purple-500 dark:text-purple-300" aria-label="Course Duration" />
                          <span>Duration:</span>
                        </div>
                        <span className="font-semibold text-right sm:text-left">{duration}</span>
                      </div>
                    );
                  }
                  return null;
                })()}
                {/* Effort Required */}
                {(() => {
                  const effort = formatTimeCommitment(courseDetails);
                  if (effort) {
                    return (
                      <div className={`flex items-center justify-between sm:justify-start bg-green-50 dark:bg-green-900/20 rounded-lg px-3 py-2.5 sm:py-2 text-sm font-medium text-green-700 dark:text-green-300 w-full sm:w-auto`}>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-green-500 dark:text-green-300" aria-label="Effort Required" />
                          <span>Effort:</span>
                        </div>
                        <span className="font-semibold">{effort}</span>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>

            {/* Course description - Mobile: Edge-to-edge, Desktop: Contained */}
            <div className="prose prose-emerald dark:prose-invert max-w-none mb-6 sm:mb-8 px-4 sm:px-0">
              {(() => {
                // Get description from various possible fields
                // Handle both string and object formats for course_description
                let description = '';
                if (typeof courseDetails?.course_description === 'string') {
                  description = courseDetails.course_description;
                } else if (typeof courseDetails?.course_description === 'object' && courseDetails?.course_description?.program_overview) {
                  description = courseDetails.course_description.program_overview;
                } else {
                  description = courseDetails?.course_title || '';
                }
                // Parse About and Benefits
                const { about, benefits } = parseAboutAndBenefits(description);

                // --- Brochure extraction logic ---
                let brochureUrl = '';
                // Look for a line like 'Download Brochure: <url>' or any .pdf link
                const brochureRegex = /(https?:\/\/[^\s]+\.pdf)/i;
                const match = description.match(brochureRegex);
                if (match && match[1]) {
                  brochureUrl = match[1];
                }
                
                // Remove 'Benefits' heading and benefits text from the about section if present
                let cleanedAbout = about;
                // Remove trailing 'Benefits' heading and everything after, if present
                cleanedAbout = cleanedAbout.replace(/\n*Benefits\n*[\s\S]*$/i, '').trim();

                return (
                  <div className="mt-4">
                    {/* About section with improved styling (About tab only) */}
                    {activeSection === 'about' && cleanedAbout && (
                      <div className="mb-8">
                        <div className={`bg-gradient-to-r from-${getCategoryColorClasses().primaryColor}-50/70 to-${getCategoryColorClasses().primaryColor}-50/20 dark:from-${getCategoryColorClasses().primaryColor}-900/20 dark:to-${getCategoryColorClasses().primaryColor}-900/10 p-3 sm:p-4 rounded-xl border border-${getCategoryColorClasses().primaryColor}-100 dark:border-${getCategoryColorClasses().primaryColor}-800/30 shadow-sm`}>
                          <div className="flex items-start sm:items-center mb-2 sm:mb-3">
                            <div className={`flex-shrink-0 p-1.5 rounded-full bg-${getCategoryColorClasses().primaryColor}-100 dark:bg-${getCategoryColorClasses().primaryColor}-900/50 mr-2 sm:mr-3 shadow-sm`}>
                              <BookOpen className={`h-4 w-4 sm:h-5 sm:w-5 text-${getCategoryColorClasses().primaryColor}-500 dark:text-${getCategoryColorClasses().primaryColor}-400`} fill="currentColor" fillOpacity={0.2} />
                            </div>
                            <h4 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-100">
                              About This Course
                            </h4>
                          </div>
                          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">{cleanedAbout}</p>
                        </div>
                      </div>
                    )}
                    {/* Benefits section only in Benefits tab */}
                    {activeSection === 'benefits' && benefits.length > 0 && (
                      <div className="mt-8">
                        <div className={`bg-gradient-to-r from-emerald-50/70 to-emerald-50/20 dark:from-emerald-900/20 dark:to-emerald-900/10 p-3 sm:p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30 shadow-sm mb-4`}>
                          <div className="flex items-center mb-2">
                            <Award className="h-5 w-5 text-emerald-500 dark:text-emerald-400 mr-2" />
                            <h4 className="text-base sm:text-lg font-bold text-emerald-700 dark:text-emerald-300">Benefits</h4>
                          </div>
                          <ul className="grid gap-3 sm:grid-cols-2 mt-2">
                            {benefits.map((item, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                    {/* Benefits fallback in Benefits tab if no benefits found */}
                    {activeSection === 'benefits' && benefits.length === 0 && (
                      <div className="mt-8">
                        <div className="bg-gradient-to-r from-emerald-50/70 to-emerald-50/20 dark:from-emerald-900/20 dark:to-emerald-900/10 p-3 sm:p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30 shadow-sm mb-4">
                          <div className="flex items-center mb-2">
                            <Award className="h-5 w-5 text-emerald-500 dark:text-emerald-400 mr-2" />
                            <h4 className="text-base sm:text-lg font-bold text-emerald-700 dark:text-emerald-300">Benefits</h4>
                          </div>
                          <p className="text-gray-700 dark:text-gray-200">No benefits information available for this course.</p>
                        </div>
                      </div>
                    )}
                    {/* Brochure download section if found */}
                    {brochureUrl && (
                      <div className="mt-8">
                        <div className="bg-gradient-to-r from-blue-50/70 to-blue-50/20 dark:from-blue-900/20 dark:to-blue-900/10 p-3 sm:p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 shadow-sm mb-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <Download className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" />
                            <span className="text-base sm:text-lg font-bold text-blue-700 dark:text-blue-300">Download Brochure</span>
                          </div>
                          <a
                            href={brochureUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-sm"
                          >
                            Download PDF
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </motion.section>
        );
        
      case 'curriculum':
        return (
          <motion.section 
            ref={curriculumRef} 
            id="curriculum" 
            className="pb-6"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            key="curriculum-section"
          >
            {/* Section Header - Mobile: Edge-to-edge, Desktop: Contained */}
            <div className="flex items-center mb-4 sm:mb-6 px-4 sm:px-0">
              <div className={`w-1.5 h-6 bg-gradient-to-b from-${getCategoryColorClasses().primaryColor}-400 to-${getCategoryColorClasses().primaryColor}-500 rounded-sm mr-2 sm:mr-3`}></div>
              <h2 className={`text-xl sm:text-2xl font-bold bg-gradient-to-r from-${getCategoryColorClasses().primaryColor}-600 to-${getCategoryColorClasses().primaryColor}-500 bg-clip-text text-transparent`}>
                Curriculum
              </h2>
            </div>

            {/* Main Content - Mobile: Edge-to-edge, Desktop: Contained */}
            <div className="sm:px-0">
              <div className="bg-white dark:bg-gray-800 rounded-none sm:rounded-lg border-0 sm:border border-gray-200 dark:border-gray-700 overflow-hidden mb-6 sm:mb-8 shadow-sm">
              <div className={`bg-gradient-to-r from-${getCategoryColorClasses().primaryColor}-50 to-${getCategoryColorClasses().primaryColor}-100/30 dark:from-${getCategoryColorClasses().primaryColor}-900/20 dark:to-${getCategoryColorClasses().primaryColor}-900/10 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-200 dark:border-gray-600`}>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                  <GraduationCap className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 text-${getCategoryColorClasses().primaryColor}-500 dark:text-${getCategoryColorClasses().primaryColor}-400`} fill="currentColor" fillOpacity={0.2} />
                  Course Modules
                          </h3>
                        </div>
                        
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {curriculum && curriculum.length > 0 ? (
                  curriculum.map((item, index) => {
                    const { overview, relevance } = parseOverviewAndRelevance(item.weekDescription || '');
                    return (
                      <div key={index} className="transition-all duration-200">
                        <motion.button
                          className="w-full px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          onClick={() => toggleAccordion(index)}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center flex-1 min-w-0">
                            <motion.div 
                              className={`flex-shrink-0 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-4 ${
                                openAccordions === index 
                                  ? `bg-${getCategoryColorClasses().primaryColor}-100 dark:bg-${getCategoryColorClasses().primaryColor}-900/50 text-${getCategoryColorClasses().primaryColor}-600 dark:text-${getCategoryColorClasses().primaryColor}-400` 
                                  : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                              }`}
                              whileHover={{ 
                                scale: [1, 1.1, 1],
                                transition: { duration: 0.5 }
                              }}
                            >
                              {openAccordions === index ? (
                                <BookOpen size={16} className="sm:w-[18px] sm:h-[18px]" fill="currentColor" fillOpacity={0.2} />
                              ) : (
                                <Calendar size={16} className="sm:w-[18px] sm:h-[18px]" fill="currentColor" fillOpacity={0.2} />
                              )}
                            </motion.div>
                            <span className={`text-xs sm:text-sm md:text-base font-medium truncate ${
                              openAccordions === index 
                                ? `text-${getCategoryColorClasses().primaryColor}-700 dark:text-${getCategoryColorClasses().primaryColor}-400` 
                                : "text-gray-800 dark:text-gray-200"
                            }`}>
                              {item.weekTitle}
                            </span>
                          </div>
                          <motion.div 
                            className={`flex-shrink-0 ml-2 sm:ml-3 p-1 sm:p-1.5 rounded-full ${
                              openAccordions === index 
                                ? `bg-${getCategoryColorClasses().primaryColor}-100 dark:bg-${getCategoryColorClasses().primaryColor}-900/50 text-${getCategoryColorClasses().primaryColor}-600 dark:text-${getCategoryColorClasses().primaryColor}-400` 
                                : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                            }`}
                            animate={openAccordions === index ? { rotate: 180 } : { rotate: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown size={14} className="sm:w-4 sm:h-4" fill="currentColor" fillOpacity={0.2} />
                          </motion.div>
                        </motion.button>
                        <AnimatePresence>
                          {openAccordions === index && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className={`px-3 sm:px-6 py-3 sm:py-5 bg-${getCategoryColorClasses().primaryColor}-50/50 dark:bg-${getCategoryColorClasses().primaryColor}-900/10 border-t border-gray-200 dark:border-gray-700`}>
                                <div className="pl-6 sm:pl-10 space-y-4">
                                  {overview && (
                                    <div>
                                      <div className="flex items-center mb-1">
                                        <BookOpen className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-300" />
                                        <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Overview</span>
                                      </div>
                                      <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{overview}</p>
                                    </div>
                                  )}
                                  {relevance && (
                                    <div>
                                      <div className="flex items-center mb-1 mt-3">
                                        <Star className="w-4 h-4 mr-2 text-emerald-500 dark:text-emerald-400" />
                                        <span className="font-semibold text-emerald-700 dark:text-emerald-300 text-sm">Relevance</span>
                                      </div>
                                      <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-line">{relevance}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 sm:p-6 text-center">
                    <div className="inline-flex items-center justify-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-full mb-3 sm:mb-4">
                      <AlertTriangle className={`h-5 w-5 sm:h-6 sm:w-6 text-${getCategoryColorClasses().primaryColor}-500 dark:text-${getCategoryColorClasses().primaryColor}-400`} fill="currentColor" fillOpacity={0.2} />
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Curriculum Coming Soon
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                      Our team is finalizing the curriculum details. Check back soon for a complete breakdown of course modules.
                    </p>
                  </div>
                )}
              </div>
              </div>
            </div>

            {/* Tools & Technologies Section - Mobile: Edge-to-edge, Desktop: Contained */}
            {toolsTechnologies && toolsTechnologies.length > 0 && (
              <div className="sm:px-0">
                <motion.div 
                  className="bg-white dark:bg-gray-800 rounded-none sm:rounded-lg border-0 sm:border border-gray-200 dark:border-gray-700 overflow-hidden mb-6 sm:mb-8 shadow-sm"
                  variants={fadeIn}
                >
                <div className={`bg-gradient-to-r from-${getCategoryColorClasses().primaryColor}-50 to-${getCategoryColorClasses().primaryColor}-50/70 dark:from-${getCategoryColorClasses().primaryColor}-900/20 dark:to-${getCategoryColorClasses().primaryColor}-900/10 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-200 dark:border-gray-600`}>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                    <Sparkles className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 text-${getCategoryColorClasses().primaryColor}-500 dark:text-${getCategoryColorClasses().primaryColor}-400`} fill="currentColor" fillOpacity={0.2} />
                    Tools & Technologies
                  </h3>
                </div>
                <div className="p-3 sm:p-4">
                  <motion.div 
                    className="flex flex-wrap gap-1.5 sm:gap-2"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    {toolsTechnologies.map((tool, index) => (
                      <motion.span 
                        key={index} 
                        className={`inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium bg-gradient-to-r from-${getCategoryColorClasses().primaryColor}-50 to-${getCategoryColorClasses().primaryColor}-50/70 text-${getCategoryColorClasses().primaryColor}-700 dark:from-${getCategoryColorClasses().primaryColor}-900/30 dark:to-${getCategoryColorClasses().primaryColor}-900/20 dark:text-${getCategoryColorClasses().primaryColor}-300 border border-${getCategoryColorClasses().primaryColor}-100 dark:border-${getCategoryColorClasses().primaryColor}-800/30 hover:shadow-md transition-all duration-300 cursor-default`}
                        variants={fadeIn}
                        whileHover={{ 
                          y: -2, 
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        {tool.name}
                      </motion.span>
                    ))}
                  </motion.div>
                </div>
                </motion.div>
              </div>
            )}

            {/* Bonus Modules Section - Mobile: Edge-to-edge, Desktop: Contained */}
            {bonusModules && bonusModules.length > 0 && (
              <div className="sm:px-0">
                <motion.div 
                  className="bg-white dark:bg-gray-800 rounded-none sm:rounded-lg border-0 sm:border border-gray-200 dark:border-gray-700 overflow-hidden mb-6 sm:mb-8 shadow-sm"
                  variants={fadeIn}
                >
                <div className={`bg-gradient-to-r from-${getCategoryColorClasses().primaryColor}-50 to-${getCategoryColorClasses().primaryColor}-100/30 dark:from-${getCategoryColorClasses().primaryColor}-900/20 dark:to-${getCategoryColorClasses().primaryColor}-900/10 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-200 dark:border-gray-600`}>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                    <Star className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 text-${getCategoryColorClasses().primaryColor}-500 dark:text-${getCategoryColorClasses().primaryColor}-400`} fill="currentColor" fillOpacity={0.2} />
                    Bonus Modules
                  </h3>
                </div>
                <div className="p-3 sm:p-4">
                  <ul className="space-y-2 sm:space-y-3">
                    {bonusModules.map((module, index) => (
                      <motion.li 
                        key={index} 
                        className={`flex items-start p-2 sm:p-3 rounded-lg hover:bg-${getCategoryColorClasses().primaryColor}-50/50 dark:hover:bg-${getCategoryColorClasses().primaryColor}-900/10 transition-colors`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ x: 5 }}
                      >
                        <motion.div 
                          className={`p-1.5 sm:p-2 rounded-full bg-gradient-to-r from-${getCategoryColorClasses().primaryColor}-400 to-${getCategoryColorClasses().primaryColor}-500 text-white mr-2 sm:mr-3 mt-0.5 shadow-sm`}
                          whileHover={{ rotate: 15 }}
                        >
                          <BookOpen size={14} className="sm:w-4 sm:h-4" fill="currentColor" fillOpacity={0.2} />
                        </motion.div>
                        <div>
                          <h4 className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200">{module.title}</h4>
                          {module.description && (
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                              {module.description}
                            </p>
                          )}
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                </motion.div>
              </div>
            )}
          </motion.section>
        );
        
      case 'reviews':
        return (
          <motion.section 
            ref={reviewsRef} 
            id="reviews" 
            className="pb-6"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            key="reviews-section"
          >
            {/* Section Header - Mobile: Edge-to-edge, Desktop: Contained */}
            <div className="flex items-center mb-6 px-4 sm:px-0">
              <div className="w-1.5 h-6 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-sm mr-3"></div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
                Reviews
              </h2>
            </div>

            {/* Content - Mobile: Edge-to-edge, Desktop: Contained */}
            <div className="bg-white dark:bg-gray-800 rounded-none sm:rounded-lg border-0 sm:border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
              {reviews && reviews.length > 0 ? (
                <div className="space-y-6">
                  {/* Reviews content would go here */}
                  <p className="text-gray-600 dark:text-gray-300">
                    Reviews content to be integrated
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <motion.div 
                    className="bg-gray-100 dark:bg-gray-700 rounded-full p-4 inline-flex mb-4"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Star size={32} className="text-amber-400" fill="currentColor" fillOpacity={0.4} />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">No Reviews Yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    Be the first to review this course after enrollment. Your feedback helps us improve and guides other students.
                  </p>
                </div>
              )}
            </div>
          </motion.section>
        );
        

        
      case 'certificate':
        return (
          <motion.section 
            ref={certificateRef} 
            id="certificate" 
            className="pb-6"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            key="certificate-section"
          >
            {/* Section Header - Mobile: Edge-to-edge, Desktop: Contained */}
            <div className="flex items-center mb-6 px-4 sm:px-0">
              <div className="w-1.5 h-6 bg-gradient-to-b from-green-400 to-teal-500 rounded-sm mr-3"></div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent">
                Certificate
              </h2>
            </div>
            
            {/* Content - Mobile: Edge-to-edge, Desktop: Contained */}
            <div className="bg-white dark:bg-gray-800 rounded-none sm:rounded-lg border-0 sm:border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
              <CourseCertificate />
            </div>
          </motion.section>
        );
        
      default:
        return (
          <motion.div 
            className="py-10 text-center"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <AlertTriangle className="w-12 h-12 mx-auto text-amber-500 mb-4" fill="currentColor" fillOpacity={0.2} />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Section Not Found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              The requested section could not be found. Please select a different tab.
            </p>
          </motion.div>
        );
    }
  };

  return (
    <>
      {/* Course Header - Completely Mobile-First Design */}
      <div className="relative mb-4 sm:mb-6">
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Mobile: Edge-to-edge container, Desktop: Normal container */}
          <div className="sm:mx-0 md:mx-4 lg:mx-4 pt-4">
            <div className="relative bg-white dark:bg-gray-800 sm:backdrop-blur-xl sm:bg-gradient-to-br sm:from-white/95 sm:via-white/90 sm:to-white/95 sm:dark:from-gray-800/95 sm:dark:via-gray-700/90 sm:dark:to-gray-800/95 rounded-none sm:rounded-2xl shadow-none sm:shadow-xl border-0 sm:border sm:border-gray-200/50 sm:dark:border-gray-600/50 overflow-hidden">
              {/* Background Elements - Desktop only */}
              <div className={`hidden sm:block absolute -top-32 -right-32 w-56 h-56 rounded-full bg-gradient-to-br from-${getCategoryColorClasses().primaryColor}-300/20 via-${getCategoryColorClasses().primaryColor}-400/10 to-blue-300/20 dark:from-${getCategoryColorClasses().primaryColor}-500/15 dark:via-${getCategoryColorClasses().primaryColor}-600/8 dark:to-blue-500/15 blur-3xl animate-pulse`}></div>
              <div className={`hidden sm:block absolute -bottom-32 -left-32 w-56 h-56 rounded-full bg-gradient-to-tr from-purple-300/20 via-${getCategoryColorClasses().primaryColor}-300/10 to-rose-300/20 dark:from-purple-500/15 dark:via-${getCategoryColorClasses().primaryColor}-500/8 dark:to-rose-500/15 blur-3xl animate-pulse`} style={{ animationDelay: '1s' }}></div>
              
                        {/* Mobile: Direct content, Desktop: Padded content */}
          <div className="relative z-10 sm:p-5 md:p-6 pt-6 sm:pt-10">
                {/* Title Section - Enhanced Mobile Design */}
                <div className="text-center px-3 py-2 sm:px-0 sm:py-4">
                  {/* Course Category Badge - Mobile Only */}
                  <motion.div 
                    className="block sm:hidden mb-3"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-${getCategoryColorClasses().primaryColor}-50 to-${getCategoryColorClasses().primaryColor}-100 text-${getCategoryColorClasses().primaryColor}-700 dark:from-${getCategoryColorClasses().primaryColor}-900/30 dark:to-${getCategoryColorClasses().primaryColor}-900/20 dark:text-${getCategoryColorClasses().primaryColor}-300 border border-${getCategoryColorClasses().primaryColor}-200 dark:border-${getCategoryColorClasses().primaryColor}-800/30 shadow-sm`}>
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                      </motion.div>
                      {courseDetails?.course_category || courseDetails?.category || 'Professional Course'}
                    </span>
                  </motion.div>

                  {/* Enhanced Mobile Title */}
                  <motion.h1 
                    className={`text-xl leading-tight sm:text-3xl lg:text-4xl xl:text-5xl font-black mb-2 sm:mb-2 bg-gradient-to-r from-gray-900 via-${getCategoryColorClasses().primaryColor}-800 to-gray-900 dark:from-white dark:via-${getCategoryColorClasses().primaryColor}-200 dark:to-white bg-clip-text text-transparent px-1 sm:px-0`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    {courseDetails?.course_title}
                  </motion.h1>

                  {/* Mobile Course Type & Duration Info - Hidden as requested */}
                  {/* Commented out to hide course info cards in mobile view
                  <motion.div 
                    className="block sm:hidden mb-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <div className="flex flex-wrap justify-center gap-2 text-xs">
                      <motion.div 
                        className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1 shadow-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Users className="w-3 h-3 mr-1 text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-300 font-medium">
                          {getClassType()}
                        </span>
                      </motion.div>
                      
                      <motion.div 
                        className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1 shadow-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Clock className="w-3 h-3 mr-1 text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-300 font-medium">
                          {formatDuration(courseDetails)}
                        </span>
                      </motion.div>

                      {courseDetails?.no_of_Sessions && (
                        <motion.div 
                          className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1 shadow-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <GraduationCap className="w-3 h-3 mr-1 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-300 font-medium">
                            {courseDetails.no_of_Sessions} Sessions
                          </span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                  */}
                  
                  {/* Enhanced Separator */}
                  <div className="flex justify-center my-3 sm:my-3">
                    <motion.div 
                      className={`w-16 sm:w-24 md:w-32 h-0.5 sm:h-1 bg-gradient-to-r from-${getCategoryColorClasses().primaryColor}-500 via-${getCategoryColorClasses().primaryColor}-400 to-${getCategoryColorClasses().primaryColor}-500 rounded-full shadow-sm sm:shadow-lg`}
                      initial={{ width: 0 }}
                      animate={{ width: 'auto' }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    ></motion.div>
                  </div>
                </div>
                
                {/* Video Player - Mobile: Edge-to-edge, Desktop: Contained */}
                <div className="sm:bg-gray-50/50 sm:dark:bg-gray-700/50 sm:rounded-xl sm:p-2 md:p-3 sm:border sm:border-gray-200/50 sm:dark:border-gray-600/50">
                  <CourseVideoPlayer 
                    courseId={courseId}
                    courseTitle={courseDetails?.course_title}
                    courseVideos={courseDetails?.course_videos}
                    previewVideo={courseDetails?.preview_video}
                    courseImage={courseDetails?.course_image}
                    primaryColor={getCategoryColorClasses().primaryColor}
                  />
                </div>
                
                {/* Navigation - Mobile optimized */}
                <div className="px-4 py-3 sm:px-0 sm:py-0 sm:mt-4">
                  <CourseNavigation 
                    activeSection={activeSection} 
                    scrollToSection={scrollToSection} 
                    showCertificate={hasCertificate()}
                    showDownloadBrochure={hasBrochure()}
                    onDownloadBrochure={() => setShowBrochureModal(true)}
                    compact={true}
                  />
                </div>

                {/* Course Selection Component - Mobile Enhanced */}
                {props.courseSelectionComponent && (
                  <div className="px-4 py-2 sm:px-0 sm:py-0 sm:mt-3 block lg:hidden">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600 shadow-sm">
                      {props.courseSelectionComponent}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Content Area - Mobile: Edge-to-edge, Desktop: Contained */}
      <div className="relative z-20 pt-4 pb-4 sm:px-4 md:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <AnimatePresence mode="wait">
          {renderActiveSection()}
        </AnimatePresence>
      </div>

      {/* Class Type Info Modal */}
      {showClassTypeInfo && (
        <div className="fixed inset-0 z-[100] overflow-hidden flex items-center justify-center px-4 sm:px-0">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={handleCloseModal} />
          <div className="relative z-[101] w-full max-w-[300px] p-4 bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-gray-900 dark:text-white">Class Types</h4>
              <button onClick={handleCloseModal} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
                <span className="font-medium text-indigo-600 dark:text-indigo-400">Live Classes</span>
                <ul className="mt-1 space-y-1 text-gray-600 dark:text-gray-300">
                  <li>• Real-time instructor sessions</li>
                  <li>• Direct Q&A and feedback</li>
                  <li>• Interactive group activities</li>
                </ul>
              </div>
              <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <span className="font-medium text-purple-600 dark:text-purple-400">Blended Classes</span>
                <ul className="mt-1 space-y-1 text-gray-600 dark:text-gray-300">
                  <li>• Self-paced video lectures</li>
                  <li>• Flexible schedule</li>
                  <li>• Live Q&A sessions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Download Brochure Modal */}
      {showBrochureModal && (
        <DownloadBrochureModal
          isOpen={showBrochureModal}
          onClose={() => setShowBrochureModal(false)}
          courseId={courseDetails?._id}
          courseTitle={courseDetails?.course_title}
          course={courseDetails}
        />
      )}
    </>
  );
};

export default CourseDetailsPage;