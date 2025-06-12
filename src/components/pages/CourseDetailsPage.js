'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import Link from 'next/link';

// Course detailed sections
import CourseNavigation from '@/components/sections/course-detailed/CourseNavigation';
import CourseHeader from '@/components/sections/course-detailed/CourseHeader';
import CourseFaq from '@/components/sections/course-detailed/courseFaq';
import CourseCertificate from '@/components/sections/course-detailed/courseCertificate';
import CourseRelated from '@/components/sections/course-detailed/courseRelated';
import CourseStats from '@/components/sections/course-detailed/CourseStats';
import DownloadBrochureModal from '@/components/shared/download-broucher';

// API and utilities
import { apiUrls } from '@/apis';
import useGetQuery from '@/hooks/getQuery.hook';
import Preloader from '@/components/shared/others/Preloader';

// Assets
import Pdf from '@/assets/images/course-detailed/pdf-icon.svg';
import { getCourseById } from '@/apis/course/course';

// Course Video Player Component
const CourseVideoPlayer = ({ courseId, courseTitle, courseVideos, primaryColor }) => {
  const [isPlaying, setIsPlaying] = useState(true); // Start with playing state
  const [isMuted, setIsMuted] = useState(true); // Start muted for autoplay
  const [showControls, setShowControls] = useState(false); // Hide controls by default
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // Extract video URL from course videos or use a default promotional video
  useEffect(() => {
    if (courseVideos && courseVideos.length > 0) {
      // Use the first course video as promotional video
      setVideoUrl(courseVideos[0].video_url || courseVideos[0].url);
    } else {
      // You can set a default promotional video URL here
      setVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
    }
  }, [courseVideos]);

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
    return (
      <div className="relative w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl flex items-center justify-center" style={{ aspectRatio: '21/9' }}>
        <div className="text-center">
          <div className={`w-16 h-16 bg-${primaryColor}-100 dark:bg-${primaryColor}-900/30 rounded-full flex items-center justify-center mb-3`}>
            <Play className={`w-8 h-8 text-${primaryColor}-600 dark:text-${primaryColor}-400`} />
          </div>
          <p className="text-gray-600 dark:text-gray-400">Course preview video coming soon</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full group">
      {/* Video Container */}
      <div 
        ref={containerRef}
        className="relative w-full bg-black rounded-xl overflow-hidden shadow-lg group cursor-pointer"
        style={{ aspectRatio: '21/9' }}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
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

        {/* Video Controls Overlay - Show on hover with play/pause icon */}
        <motion.div 
          className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-all duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: showControls ? 1 : 0 }}
          onClick={togglePlay}
        >
          {/* Play/Pause Icon */}
          <motion.div
            className="flex items-center justify-center w-20 h-20 bg-white/90 dark:bg-gray-900/90 rounded-full shadow-xl hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 backdrop-blur-sm"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: showControls ? 1 : 0.8, 
              opacity: showControls ? 1 : 0 
            }}
            transition={{ duration: 0.3 }}
          >
            {isLoading ? (
              <Loader className="w-10 h-10 text-gray-600 dark:text-gray-300 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-10 h-10 text-gray-800 dark:text-gray-200" />
            ) : (
              <Play className="w-10 h-10 text-gray-800 dark:text-gray-200 ml-1" />
            )}
          </motion.div>
        </motion.div>

        {/* Bottom Controls */}
        <motion.div 
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: showControls ? 1 : 0 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleMute}
                className="text-white hover:text-gray-300 transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
            </div>
            
            {/* Fullscreen Button */}
            <div className="flex items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullscreen();
                }}
                className="text-white hover:text-gray-300 transition-colors p-1 rounded hover:bg-white/20"
                title="Toggle Fullscreen"
              >
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white">
              <Loader className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p className="text-sm">Loading video...</p>
            </div>
          </div>
        )}
      </div>


    </div>
  );
};

const CourseDetailsPage = ({ ...props }) => {
  // State for active section and navigation
  const [activeSection, setActiveSection] = useState(props.initialActiveSection || 'about');
  const [courseDetails, setCourseDetails] = useState(props.courseDetails || null);
  const [curriculum, setCurriculum] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [toolsTechnologies, setToolsTechnologies] = useState([]);
  const [bonusModules, setBonusModules] = useState([]);
  const [openAccordions, setOpenAccordions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showClassTypeInfo, setShowClassTypeInfo] = useState(false);
  const [theme, setTheme] = useState('light');
  const [showBrochureModal, setShowBrochureModal] = useState(false);
  const [courseId, setCourseId] = useState(props.courseId);
  const [activeOverviewTab, setActiveOverviewTab] = useState('about');
  
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

  // Fetch course details from API
  const fetchCourseDetails = async (id) => {
    setLoading(true);
    try {
      console.log("Fetching course details for ID:", id);
      
      // Ensure we have a valid ID before making the API call
      if (!id) {
        console.error("No course ID provided to fetchCourseDetails");
        toast.error("Cannot load course: Missing course identifier");
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
            toast.error("Received invalid course data format");
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
              toast.error(`Course with ID ${id} not found`);
            } else if (err.response.status === 403) {
              toast.error("You don't have permission to access this course");
            } else {
              toast.error(`Error loading course: ${err.response.status} ${err.response.statusText}`);
            }
          } else if (err.request) {
            // Request made but no response received (network issue)
            toast.error("Network error: Could not connect to course service");
          } else {
            // Something else happened
            toast.error("Could not load course details. Please try again.");
          }
          
          setLoading(false);
        },
      });
    } catch (error) {
      console.error("Exception in fetchCourseDetails:", error);
      toast.error("An unexpected error occurred. Please refresh the page.");
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
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const user = localStorage.getItem('user') || localStorage.getItem('userData');
      
      setIsLoggedIn(!!token && (!!userId || !!user));
    }
  }, []);

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
  const toggleClassTypeInfo = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    console.log('🔄 Toggling Class Types Modal:', !showClassTypeInfo);
    setShowClassTypeInfo(!showClassTypeInfo);
  };

  // Enhanced modal close with debug logging
  const handleCloseModal = (event, source = 'button') => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    console.log(`🔒 Closing Class Types Modal (Source: ${source})`);
    setShowClassTypeInfo(false);
  };

  const toggleAccordion = (index) => {
    setOpenAccordions(openAccordions === index ? null : index);
  };

  // Updated to just change the active section state without scrolling
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
  };
  
  // Modal controls
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  // Generate course features from course details
  const getCourseFeatures = () => {
    if (!courseDetails) {
      return []; // Return empty array if no course details available
    }

    try {
      // Map API field names to our feature structure with better error handling
      const features = [
        {
          label: "Duration",
          value: formatDuration(courseDetails),
          icon: Calendar,
          color: "text-purple-500 dark:text-purple-400",
          bgColor: "bg-purple-50 dark:bg-purple-900/30",
          fillOpacity: 0.2,
        },
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
        },
      ];

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
  const isBlendedCourse = (details) => {
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
  const formatDuration = (details) => {
    if (!details) return "9 months / 36 weeks";
    
    // For blended courses, show "Self Paced + Live Q&A sessions"
    if (isBlendedCourse(details)) {
      return 'Self Paced + Live Q&A sessions';
    }
    
    try {
      // Try different possible field names
      const duration = details.duration || details.course_duration;
      
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
      
      // Try to construct from months and weeks if available as separate fields
      const months = details.duration_months || details.months;
      const weeks = details.duration_weeks || details.weeks;
      
      if (months && weeks) {
        return `${months} months / ${weeks} weeks`;
      } else if (months) {
        // Approximate 1 month as 4 weeks
        const calculatedWeeks = parseInt(months) * 4;
        return `${months} months / ${calculatedWeeks} weeks`;
      } else if (weeks) {
        // If only weeks are specified, just show weeks without converting to months
        return `${weeks} weeks`;
      }
    } catch (error) {
      console.error("Error formatting duration:", error);
    }
    
    return "9 months / 36 weeks"; // Default fallback
  };
  
  const formatLiveSessions = (details) => {
    if (!details) return "72";
    
    // For blended courses, show "Videos" instead of "Sessions"
    if (isBlendedCourse(details)) {
      try {
        // Get video count (could be from various fields)
        const videoCount = details.no_of_Sessions || 
                          details.video_count || 
                          details.recorded_videos?.length ||
                          details.course_videos?.length ||
                          details.session_count || 
                          details.live_sessions || 
                          "72";
        
        // Get video duration if available
        const videoDuration = details.session_duration || 
                             details.video_duration || 
                             details.live_session_duration || 
                             details.class_duration;
        
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
      const sessionCount = details.no_of_Sessions || details.session_count || details.live_sessions || "72";
      
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
  
  const formatTimeCommitment = (details) => {
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
  const getHighlightIcon = (iconName) => {
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
  const parseDescription = (description) => {
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
      
      if (match) {
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
          
          if (nextMatch) {
            const nextMatchFullIndex = matchIndex + keyword.length + nextMatch.index;
            if (nextMatchFullIndex < endIndex) {
              endIndex = nextMatchFullIndex;
            }
          }
        }
        
        // Extract section content
        let sectionContent = descText.substring(matchIndex + keyword.length, endIndex).trim();
        
        // Parse the bullets in this section
        const bullets = [];
        
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
            {/* Course Stats - Hidden on mobile since we show it above navigation */}
            <motion.div
              className="mb-8 hidden sm:block"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
            >
              <CourseStats 
                duration={formatDuration(courseDetails)}
                students="75+" // Default value as enrollment count may not be available
                sessions={courseDetails?.no_of_Sessions || "72"}
                hasCertificate={hasCertificate()}
                primaryColor={getCategoryColorClasses().primaryColor}
                fillOpacity={0.2}
                isBlended={isBlendedCourse(courseDetails)}
                courseDetails={courseDetails}
              />
            </motion.div>

            {/* Course description */}
            <div className="prose prose-emerald dark:prose-invert max-w-none mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4 inline-flex items-center">
                <div className={`w-1.5 h-6 ${getCategoryColorClasses().bg} mr-2 rounded-sm`}></div>
                Course Overview
              </h3>
              {(() => {
                // Get description from various possible fields
                // Handle both string and object formats for course_description
                let description = '';
                if (typeof courseDetails?.course_description === 'string') {
                  description = courseDetails.course_description;
                } else if (typeof courseDetails?.course_description === 'object' && courseDetails?.course_description?.program_overview) {
                  description = courseDetails.course_description.program_overview;
                } else {
                  description = courseDetails?.description || 
                               courseDetails?.about || 
                               courseDetails?.long_description || 
                               courseDetails?.short_description || '';
                }
                
                // Parse the description into overview and sections
                const { overview, sections } = parseDescription(description);
                
                // Define icons for different section types
                const sectionIcons = {
                  'Benefits': Star,
                  'Features': Sparkles,
                  'What You\'ll Learn': GraduationCap,
                  'Learning Outcomes': Award,
                  'Course Objectives': Target,
                  'Skills You\'ll Gain': Award,
                  'Key Takeaways': BookOpen,
                  'Requirements': AlertTriangle,
                  'Prerequisites': AlertTriangle,
                  'Who This Course Is For': Users,
                  'Target Audience': Users,
                  'Career Opportunities': BriefcaseBusiness
                };
                
                // Default to Sparkles icon for unknown section types
                const DefaultIcon = Sparkles;
                
                // Get the color classes
                const colorClasses = getCategoryColorClasses();
                const borderClass = `border-l-${colorClasses.primaryColor}-500 dark:border-l-${colorClasses.primaryColor}-600`;
                
                return (
                  <div className="mt-4">
                    {/* Overview section with improved styling */}
                    {overview ? (
                      <div className="mb-8">
                        {/* Navigation Switch */}
                        <div className="flex items-center justify-center mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg max-w-sm mx-auto">
                          <button
                            onClick={() => setActiveOverviewTab('about')}
                            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                              activeOverviewTab === 'about'
                                ? `bg-white dark:bg-gray-700 text-${getCategoryColorClasses().primaryColor}-600 dark:text-${getCategoryColorClasses().primaryColor}-400 shadow-sm`
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                          >
                            About This Course
                          </button>
                          <button
                            onClick={() => setActiveOverviewTab('benefits')}
                            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                              activeOverviewTab === 'benefits'
                                ? `bg-white dark:bg-gray-700 text-${getCategoryColorClasses().primaryColor}-600 dark:text-${getCategoryColorClasses().primaryColor}-400 shadow-sm`
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                          >
                            Benefits
                          </button>
                        </div>

                        {/* Content based on active tab */}
                        {activeOverviewTab === 'about' ? (
                          <div className={`bg-gradient-to-r from-${getCategoryColorClasses().primaryColor}-50/70 to-${getCategoryColorClasses().primaryColor}-50/20 dark:from-${getCategoryColorClasses().primaryColor}-900/20 dark:to-${getCategoryColorClasses().primaryColor}-900/10 p-5 sm:p-6 rounded-xl border border-${getCategoryColorClasses().primaryColor}-100 dark:border-${getCategoryColorClasses().primaryColor}-800/30 shadow-sm`}>
                            <div className="flex items-start sm:items-center mb-4">
                              <div className={`flex-shrink-0 p-2 rounded-full bg-${getCategoryColorClasses().primaryColor}-100 dark:bg-${getCategoryColorClasses().primaryColor}-900/50 mr-3 shadow-sm`}>
                                <BookOpen className={`h-5 w-5 text-${getCategoryColorClasses().primaryColor}-500 dark:text-${getCategoryColorClasses().primaryColor}-400`} fill="currentColor" fillOpacity={0.2} />
                          </div>
                              <h4 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100">
                                About This Course
                              </h4>
                            </div>
                            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">{overview}</p>
                          </div>
                        ) : (
                          <div className={`bg-gradient-to-r from-${getCategoryColorClasses().primaryColor}-50/70 to-${getCategoryColorClasses().primaryColor}-50/20 dark:from-${getCategoryColorClasses().primaryColor}-900/20 dark:to-${getCategoryColorClasses().primaryColor}-900/10 p-5 sm:p-6 rounded-xl border border-${getCategoryColorClasses().primaryColor}-100 dark:border-${getCategoryColorClasses().primaryColor}-800/30 shadow-sm`}>
                            <div className="flex items-start sm:items-center mb-4">
                              <div className={`flex-shrink-0 p-2 rounded-full bg-${getCategoryColorClasses().primaryColor}-100 dark:bg-${getCategoryColorClasses().primaryColor}-900/50 mr-3 shadow-sm`}>
                                <Star className={`h-5 w-5 text-${getCategoryColorClasses().primaryColor}-500 dark:text-${getCategoryColorClasses().primaryColor}-400`} fill="currentColor" fillOpacity={0.2} />
                              </div>
                              <h4 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100">
                                Course Benefits
                              </h4>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {(() => {
                                // Get benefits from parsed sections or from the course_description.benefits field
                                let benefitsList = sections.filter(section => section.title === 'Benefits' || section.title === 'What You\'ll Learn')
                                  .flatMap(section => section.bullets || []);
                                
                                // If no benefits found in parsed sections, try to get from course_description.benefits
                                if (benefitsList.length === 0 && courseDetails?.course_description?.benefits) {
                                  // Split benefits by common separators and clean up
                                  benefitsList = courseDetails.course_description.benefits
                                    .split(/[,;.]/)
                                    .map(benefit => benefit.trim())
                                    .filter(benefit => benefit.length > 0);
                                }
                                
                                // If still no benefits, show default message
                                if (benefitsList.length === 0) {
                                  benefitsList = ['Enhanced skills and knowledge', 'Industry-relevant expertise', 'Practical hands-on experience'];
                                }
                                
                                return benefitsList.map((bullet, index) => (
                                  <motion.div 
                                    key={`benefit-${index}`}
                                    className={`flex items-start p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-${getCategoryColorClasses().primaryColor}-200 dark:hover:border-${getCategoryColorClasses().primaryColor}-700/50 transition-all duration-300`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ y: -2 }}
                                  >
                                    <div className={`p-2 rounded-full bg-${getCategoryColorClasses().primaryColor}-100 dark:bg-${getCategoryColorClasses().primaryColor}-900/30 mr-3 flex-shrink-0`}>
                                      <Check className={`h-4 w-4 text-${getCategoryColorClasses().primaryColor}-500 dark:text-${getCategoryColorClasses().primaryColor}-400`} fill="currentColor" fillOpacity={0.2} />
                                    </div>
                                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{bullet}</p>
                                  </motion.div>
                                ));
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null}
                    
                    {/* Course highlights */}
                    {courseDetails?.highlights && courseDetails.highlights.length > 0 && !sections.some(s => s.title === 'Highlights') && (
                      <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center mb-5 bg-gradient-to-r from-amber-50 to-transparent dark:from-amber-900/20 dark:to-transparent p-3 rounded-lg">
                          <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 mr-3 shadow-sm">
                            <Star className="h-5 w-5 text-amber-500 dark:text-amber-400" fill="currentColor" fillOpacity={0.2} />
                          </div>
                          <h4 className="text-lg sm:text-xl font-bold text-amber-700 dark:text-amber-400">
                            Course Highlights
                          </h4>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          {courseDetails.highlights.map((highlight, index) => (
                            <motion.div 
                              key={index}
                              className="flex items-start p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-amber-200 dark:hover:border-amber-700/50 transition-all duration-300"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ y: -2 }}
                            >
                              <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30 mr-3 flex-shrink-0">
                                <Star className="h-4 w-4 text-amber-500 dark:text-amber-400" fill="currentColor" fillOpacity={0.2} />
                              </div>
                              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{highlight}</p>
                            </motion.div>
                          ))}
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
            <div className="flex items-center mb-4 sm:mb-6">
              <div className={`w-1.5 h-6 bg-gradient-to-b from-${getCategoryColorClasses().primaryColor}-400 to-${getCategoryColorClasses().primaryColor}-500 rounded-sm mr-2 sm:mr-3`}></div>
              <h2 className={`text-xl sm:text-2xl font-bold bg-gradient-to-r from-${getCategoryColorClasses().primaryColor}-600 to-${getCategoryColorClasses().primaryColor}-500 bg-clip-text text-transparent`}>
                Curriculum
              </h2>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-6 sm:mb-8">
              <div className={`bg-gradient-to-r from-${getCategoryColorClasses().primaryColor}-50 to-${getCategoryColorClasses().primaryColor}-100/30 dark:from-${getCategoryColorClasses().primaryColor}-900/20 dark:to-${getCategoryColorClasses().primaryColor}-900/10 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-200 dark:border-gray-600`}>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                  <GraduationCap className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 text-${getCategoryColorClasses().primaryColor}-500 dark:text-${getCategoryColorClasses().primaryColor}-400`} fill="currentColor" fillOpacity={0.2} />
                  Course Modules
                          </h3>
                        </div>
                        
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {curriculum && curriculum.length > 0 ? (
                  curriculum.map((item, index) => (
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
                              <div className="pl-6 sm:pl-10 space-y-2 sm:space-y-4">
                                <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                  {item.weekDescription}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))
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

            {/* Tools & Technologies Section */}
            {toolsTechnologies && toolsTechnologies.length > 0 && (
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-6 sm:mb-8"
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
            )}

            {/* Bonus Modules Section */}
            {bonusModules && bonusModules.length > 0 && (
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-6 sm:mb-8"
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
            <div className="flex items-center mb-6">
              <div className="w-1.5 h-6 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-sm mr-3"></div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
                Reviews
              </h2>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
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
        
      case 'faq':
        return (
          <motion.section 
            ref={faqRef} 
            id="faq" 
            className="pb-6"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            key="faq-section"
          >
            <div className="flex items-center mb-6">
              <div className="w-1.5 h-6 bg-gradient-to-b from-indigo-400 to-violet-500 rounded-sm mr-3"></div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
                Frequently Asked Questions
              </h2>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <CourseFaq courseId={props.courseId} />
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
            <div className="flex items-center mb-6">
              <div className="w-1.5 h-6 bg-gradient-to-b from-green-400 to-teal-500 rounded-sm mr-3"></div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent">
                Certificate
              </h2>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <CourseCertificate courseId={props.courseId}/>
            </div>
          </motion.section>
        );
        
      case 'highlights':
        return (
          <motion.section
            ref={highlightsRef} 
            id="highlights" 
            className="pb-6"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            key="highlights-section"
          >
            <div className="flex items-center mb-6">
              <div className={`w-1.5 h-6 bg-gradient-to-b from-${getCategoryColorClasses().primaryColor}-400 to-${getCategoryColorClasses().primaryColor}-500 rounded-sm mr-3`}></div>
              <h2 className={`text-2xl font-bold bg-gradient-to-r from-${getCategoryColorClasses().primaryColor}-600 to-${getCategoryColorClasses().primaryColor}-500 bg-clip-text text-transparent`}>
                Highlights
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              {courseDetails?.highlights && courseDetails.highlights.length > 0 ? (
                courseDetails.highlights.map((highlight, index) => (
                  <motion.div 
                    key={index}
                    className="flex bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300"
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div>
                      <span className={`flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-${getCategoryColorClasses().primaryColor}-100 to-${getCategoryColorClasses().primaryColor}-200 dark:from-${getCategoryColorClasses().primaryColor}-900/30 dark:to-${getCategoryColorClasses().primaryColor}-800/30 text-${getCategoryColorClasses().primaryColor}-600 dark:text-${getCategoryColorClasses().primaryColor}-400 mb-3 shadow-sm`}>
                        {getHighlightIcon(highlight.iconName)}
                      </span>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {highlight.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {highlight.description}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-1 md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm text-center">
                  <div className="inline-flex items-center justify-center p-3 bg-gray-50 dark:bg-gray-700 rounded-full mb-4">
                    <AlertTriangle className={`h-6 w-6 text-${getCategoryColorClasses().primaryColor}-500 dark:text-${getCategoryColorClasses().primaryColor}-400`} fill="currentColor" fillOpacity={0.2} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No Highlights Available
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    We're working on adding highlights for this course. Check back soon for more information.
                  </p>
                </div>
              )}
            </div>

            {courseDetails?.downloadBrochure && (
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className={`bg-gradient-to-r from-${getCategoryColorClasses().primaryColor}-50 to-${getCategoryColorClasses().primaryColor}-50/70 dark:from-${getCategoryColorClasses().primaryColor}-900/20 dark:to-${getCategoryColorClasses().primaryColor}-900/10 px-6 py-5`}>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-y-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`p-3 rounded-lg bg-white dark:bg-gray-700 shadow-sm text-${getCategoryColorClasses().primaryColor}-500 dark:text-${getCategoryColorClasses().primaryColor}-400`}>
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                          Course Brochure
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Download complete course details
                        </p>
                      </div>
                    </div>
                    <Link 
                      href={courseDetails.downloadBrochure}
                      className={`inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-${getCategoryColorClasses().primaryColor}-600 to-${getCategoryColorClasses().primaryColor}-500 hover:from-${getCategoryColorClasses().primaryColor}-700 hover:to-${getCategoryColorClasses().primaryColor}-600 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-300`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.section>
        );
        
      case 'overview':
        const { parsedOverview, benefits } = parseDescription(description);
        
        return (
          <motion.section 
            id="overview" 
            className="pb-6"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            key="overview-section"
          >
            <div className="flex items-center mb-6">
              <div className={`w-1.5 h-6 bg-gradient-to-b from-${getCategoryColorClasses().primaryColor}-400 to-${getCategoryColorClasses().primaryColor}-500 rounded-sm mr-3`}></div>
              <h2 className={`text-2xl font-bold bg-gradient-to-r from-${getCategoryColorClasses().primaryColor}-600 to-${getCategoryColorClasses().primaryColor}-500 bg-clip-text text-transparent`}>
                Course Overview
              </h2>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden mb-8 shadow-sm">
              <div className="p-6">
                <div className="prose dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300">
                  {parsedOverview.map((item, index) => {
                    if (item.type === 'paragraph') {
                      return (
                        <motion.p 
                          key={index} 
                          className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed"
                          variants={fadeIn}
                          transition={{ delay: index * 0.08 }}
                        >
                          {item.content}
                        </motion.p>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>

            {benefits && benefits.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden mb-8 shadow-sm">
                <div className={`bg-gradient-to-r from-${getCategoryColorClasses().primaryColor}-50 to-${getCategoryColorClasses().primaryColor}-50/70 dark:from-${getCategoryColorClasses().primaryColor}-900/20 dark:to-${getCategoryColorClasses().primaryColor}-900/10 px-6 py-4 border-b border-gray-200 dark:border-gray-600`}>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                    <CheckCircle className={`w-5 h-5 mr-2 text-${getCategoryColorClasses().primaryColor}-500 dark:text-${getCategoryColorClasses().primaryColor}-400`} fill="currentColor" fillOpacity={0.2} />
                    What You'll Learn
                  </h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-4">
                    {benefits.map((benefit, index) => {
                      if (benefit.type === 'bullet') {
                        return (
                          <motion.li 
                            key={index} 
                            className="flex gap-3"
                            variants={fadeIn}
                            transition={{ delay: index * 0.08 }}
                          >
                            <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-${getCategoryColorClasses().primaryColor}-50 dark:bg-${getCategoryColorClasses().primaryColor}-900/30`}>
                              <Check className={`h-3.5 w-3.5 text-${getCategoryColorClasses().primaryColor}-500 dark:text-${getCategoryColorClasses().primaryColor}-400`} fill="currentColor" fillOpacity={0.2} />
                            </span>
                            <span className="text-gray-700 dark:text-gray-300">
                              {benefit.content}
                            </span>
                          </motion.li>
                        );
                      } else if (benefit.type === 'section') {
                        return (
                          <motion.div 
                            key={index} 
                            className="mt-6 mb-3"
                            variants={fadeIn}
                            transition={{ delay: index * 0.08 }}
                          >
                            <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                              <span className={`inline-block w-1 h-4 bg-${getCategoryColorClasses().primaryColor}-500 dark:bg-${getCategoryColorClasses().primaryColor}-400 mr-2 rounded-sm`}></span>
                              {benefit.content}
                            </h4>
                          </motion.div>
                        );
                      }
                      return null;
                    })}
                  </ul>
                </div>
              </div>
            )}
          </motion.section>
        );
        
      case 'enrollment':
        return (
          <motion.section 
            id="enrollment" 
            className="pb-6 px-4 sm:px-6 md:px-8"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            key="enrollment-section"
          >
            <div className="flex items-center mb-6">
              <div className={`w-1.5 h-6 bg-gradient-to-b from-${getCategoryColorClasses().primaryColor}-400 to-${getCategoryColorClasses().primaryColor}-500 rounded-sm mr-3`}></div>
              <h2 className={`text-2xl font-bold bg-gradient-to-r from-${getCategoryColorClasses().primaryColor}-600 to-${getCategoryColorClasses().primaryColor}-500 bg-clip-text text-transparent`}>
                Enrollment Details
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-8">
              <motion.div 
                className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                variants={fadeIn}
                transition={{ delay: 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className={`w-12 h-12 rounded-full bg-${getCategoryColorClasses().primaryColor}-50 dark:bg-${getCategoryColorClasses().primaryColor}-900/30 flex items-center justify-center mb-4`}>
                  <Calendar className={`h-6 w-6 text-${getCategoryColorClasses().primaryColor}-500 dark:text-${getCategoryColorClasses().primaryColor}-400`} fill="currentColor" fillOpacity={0.2} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Duration</h3>
                <p className="text-gray-600 dark:text-gray-300">{duration || 'Flexible'}</p>
              </motion.div>
              
              <motion.div 
                className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                variants={fadeIn}
                transition={{ delay: 0.2 }}
                whileHover={{ y: -4 }}
              >
                <div className={`w-12 h-12 rounded-full bg-${getCategoryColorClasses().primaryColor}-50 dark:bg-${getCategoryColorClasses().primaryColor}-900/30 flex items-center justify-center mb-4`}>
                  <Clock className={`h-6 w-6 text-${getCategoryColorClasses().primaryColor}-500 dark:text-${getCategoryColorClasses().primaryColor}-400`} fill="currentColor" fillOpacity={0.2} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Time Commitment</h3>
                <p className="text-gray-600 dark:text-gray-300">{commitment || '10-15 hours/week'}</p>
              </motion.div>
              
              <motion.div 
                className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                variants={fadeIn}
                transition={{ delay: 0.3 }}
                whileHover={{ y: -4 }}
              >
                <div className={`w-12 h-12 rounded-full bg-${getCategoryColorClasses().primaryColor}-50 dark:bg-${getCategoryColorClasses().primaryColor}-900/30 flex items-center justify-center mb-4`}>
                  <Banknote className={`h-6 w-6 text-${getCategoryColorClasses().primaryColor}-500 dark:text-${getCategoryColorClasses().primaryColor}-400`} fill="currentColor" fillOpacity={0.2} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Price</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {price ? (
                    <>
                      {price !== originalPrice && originalPrice ? (
                        <>
                          <span className="inline-block bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded text-sm font-medium mr-2">
                            Save {Math.round(100 - (price / originalPrice * 100))}%
                          </span>
                          <span className="text-base font-bold text-gray-800 dark:text-white mr-2">₹{price.toLocaleString()}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 line-through">₹{originalPrice.toLocaleString()}</span>
                        </>
                      ) : (
                        <span className="text-base font-bold text-gray-800 dark:text-white">₹{price.toLocaleString()}</span>
                      )}
                    </>
                  ) : (
                    'Contact for pricing'
                  )}
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              <motion.div 
                className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                variants={fadeIn}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Users className={`h-5 w-5 mr-2 text-${getCategoryColorClasses().primaryColor}-500 dark:text-${getCategoryColorClasses().primaryColor}-400`} fill="currentColor" fillOpacity={0.2} />
                  Prerequisites
                </h3>
                {prerequisites && prerequisites.length > 0 ? (
                  <ul className="space-y-2">
                    {prerequisites.map((prereq, index) => (
                      <motion.li 
                        key={index} 
                        className="flex items-start gap-3"
                        variants={fadeIn}
                        transition={{ delay: 0.4 + (index * 0.1) }}
                      >
                        <ArrowRight className={`h-4 w-4 mt-1 text-${getCategoryColorClasses().primaryColor}-500 dark:text-${getCategoryColorClasses().primaryColor}-400 flex-shrink-0`} fill="currentColor" fillOpacity={0.2} />
                        <span className="text-gray-600 dark:text-gray-300">
                          {prereq}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 dark:text-gray-300">No specific prerequisites required.</p>
                )}
              </motion.div>
              
              <motion.div 
                className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                variants={fadeIn}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Award className={`h-5 w-5 mr-2 text-${getCategoryColorClasses().primaryColor}-500 dark:text-${getCategoryColorClasses().primaryColor}-400`} fill="currentColor" fillOpacity={0.2} />
                  Certification
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {certification || 'Upon successful completion of the course, you will receive a verified certificate of achievement.'}
                </p>
                {hasCertificate && (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${getCategoryColorClasses().primaryColor}-50 dark:bg-${getCategoryColorClasses().primaryColor}-900/30 text-${getCategoryColorClasses().primaryColor}-700 dark:text-${getCategoryColorClasses().primaryColor}-300`}>
                    <CheckCircle className="w-4 h-4 mr-1.5" fill="currentColor" fillOpacity={0.2} />
                    Industry Recognized Certificate
                  </span>
                )}
              </motion.div>
            </div>

            {enrollmentDeadline && (
              <motion.div 
                className={`bg-${getCategoryColorClasses().primaryColor}-50 dark:bg-${getCategoryColorClasses().primaryColor}-900/10 border border-${getCategoryColorClasses().primaryColor}-100 dark:border-${getCategoryColorClasses().primaryColor}-900/20 rounded-lg p-4 mb-8 flex items-center`}
                variants={fadeIn}
                transition={{ delay: 0.6 }}
              >
                <div className={`p-2 rounded-full bg-${getCategoryColorClasses().primaryColor}-100 dark:bg-${getCategoryColorClasses().primaryColor}-900/30 mr-3`}>
                  <Clock className={`h-5 w-5 text-${getCategoryColorClasses().primaryColor}-500 dark:text-${getCategoryColorClasses().primaryColor}-400`} fill="currentColor" fillOpacity={0.2} />
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong className="font-medium">Enrollment Deadline:</strong> {enrollmentDeadline}
                  </p>
                </div>
              </motion.div>
            )}
            
            <div className="flex flex-col md:flex-row gap-4">
              <motion.button
                className={`flex-1 inline-flex justify-center items-center px-6 py-3.5 bg-gradient-to-r from-${getCategoryColorClasses().primaryColor}-600 to-${getCategoryColorClasses().primaryColor}-500 hover:from-${getCategoryColorClasses().primaryColor}-700 hover:to-${getCategoryColorClasses().primaryColor}-600 text-white font-medium text-base rounded-lg shadow-sm hover:shadow-md transition-all duration-300`}
                onClick={handleEnroll}
                variants={fadeIn}
                transition={{ delay: 0.7 }}
                whileTap={{ scale: 0.98 }}
              >
                Enroll Now
              </motion.button>
              
              <motion.button
                className="flex-1 md:flex-none inline-flex justify-center items-center px-6 py-3.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium text-base rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300"
                onClick={() => toast.success("Added to wishlist!", { icon: "❤️" })}
                variants={fadeIn}
                transition={{ delay: 0.8 }}
                whileTap={{ scale: 0.98 }}
              >
                <Heart className={`w-5 h-5 mr-2 text-${getCategoryColorClasses().primaryColor}-500 dark:text-${getCategoryColorClasses().primaryColor}-400`} fill="currentColor" fillOpacity={0.2} />
                Add to Wishlist
              </motion.button>
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
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Course Header with Download Brochure */}
      <div className="mb-3 sm:mb-4 md:mb-6">
        <div className="relative overflow-hidden rounded-lg sm:rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1">
                {/* Course Title and Description - Premium Glassmorphic Design - More Compact */}
                <motion.div
                  className="mb-6 relative z-10 overflow-hidden"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Glassmorphic Container */}
                  <div className="relative backdrop-blur-md bg-white/30 dark:bg-gray-900/40 rounded-xl p-4 sm:p-6 md:p-8 shadow-lg border border-white/20 dark:border-gray-700/30 overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute -top-24 -right-24 w-40 h-40 rounded-full bg-gradient-to-br from-purple-300/30 to-blue-300/30 dark:from-purple-500/20 dark:to-blue-500/20 blur-2xl"></div>
                    <div className="absolute -bottom-24 -left-24 w-40 h-40 rounded-full bg-gradient-to-tr from-amber-300/30 to-rose-300/30 dark:from-amber-500/20 dark:to-rose-500/20 blur-2xl"></div>
                    
                    {/* Content with proper z-index */}
                    <div className="relative z-10">
                      {/* Title with refined typography */}
                      <h1 className={`text-xl sm:text-2xl lg:text-3xl font-extrabold mb-2 leading-tight text-gray-900 dark:text-white`}>
                        {courseDetails?.course_title}
                      </h1>
                      
                      {/* Full Width Separator */}
                      <div className="my-3">
                        <div className="w-full h-0.5 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 rounded-full"></div>
                      </div>
                        
                        {/* Course Video Player */}
                        <div className="mt-4 w-full px-1">
                          <CourseVideoPlayer 
                            courseId={courseId}
                            courseTitle={courseDetails?.course_title}
                            courseVideos={courseDetails?.course_videos}
                            primaryColor={getCategoryColorClasses().primaryColor}
                          />
                        </div>
                        
                        {/* Premium UI Feature Indicators - More Compact */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        <div className="flex items-center px-2.5 py-1 bg-white/70 dark:bg-gray-800/70 rounded-lg shadow-sm border border-gray-100/80 dark:border-gray-700/80">
                          <Clock className={`h-3.5 w-3.5 text-${getCategoryColorClasses().primaryColor}-500 mr-1.5`} />
                          <span className="text-xs text-gray-700 dark:text-gray-300">
                            {formatDuration(courseDetails)}
                          </span>
                        </div>
                        <div className="flex items-center px-2.5 py-1 bg-white/70 dark:bg-gray-800/70 rounded-lg shadow-sm border border-gray-100/80 dark:border-gray-700/80">
                          <Award className={`h-3.5 w-3.5 text-${getCategoryColorClasses().primaryColor}-500 mr-1.5`} />
                          <span className="text-xs text-gray-700 dark:text-gray-300">
                            {courseDetails?.is_Certification === "Yes" || courseDetails?.certification?.is_certified === true ? "Certificate Included" : "No Certificate"}
                          </span>
                        </div>
                        <div className="flex items-center px-2.5 py-1 bg-white/70 dark:bg-gray-800/70 rounded-lg shadow-sm border border-gray-100/80 dark:border-gray-700/80">
                          <BookOpen className={`h-3.5 w-3.5 text-${getCategoryColorClasses().primaryColor}-500 mr-1.5`} />
                          <span className="text-xs text-gray-700 dark:text-gray-300">
                            Lifetime Access
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="sticky top-14 z-40 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 py-2">
        <CourseNavigation 
          activeSection={activeSection} 
          scrollToSection={scrollToSection} 
          showCertificate={hasCertificate()}
          primaryColor={getCategoryColorClasses().primaryColor}
          categoryColorClasses={getCategoryColorClasses()}
          showDownloadBrochure={hasBrochure()}
          onDownloadBrochure={() => setShowBrochureModal(true)}
        />
      </div>

      {/* Content Area */}
      <div className="pt-2 sm:pt-4 pb-4">
        <AnimatePresence mode="wait">
          {renderActiveSection()}
        </AnimatePresence>
      </div>

      {/* Mobile Stats */}
      <div className="block sm:hidden mb-2">
        <CourseStats 
          duration={formatDuration(courseDetails)}
          students="75+" 
          sessions={courseDetails?.no_of_Sessions || "72"}
          hasCertificate={hasCertificate()}
          primaryColor={getCategoryColorClasses().primaryColor}
          fillOpacity={0.2}
          isBlended={isBlendedCourse(courseDetails)}
          courseDetails={courseDetails}
        />
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
      <DownloadBrochureModal
        isOpen={showBrochureModal}
        onClose={() => setShowBrochureModal(false)}
        courseTitle={courseDetails?.course_title}
        courseId={courseId}
        brochureId={hasBrochure() && courseDetails?.brochures && courseDetails.brochures.length > 0 
          ? courseDetails.brochures[0] 
          : null}
      />
    </div>
  );
};

export default CourseDetailsPage;