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
  Award
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

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

const CourseDetailsPage = ({ courseId, initialActiveSection = 'about' }) => {
  // State for active section and navigation
  const [activeSection, setActiveSection] = useState(initialActiveSection);
  const [courseDetails, setCourseDetails] = useState(null);
  const [curriculum, setCurriculum] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [toolsTechnologies, setToolsTechnologies] = useState([]);
  const [bonusModules, setBonusModules] = useState([]);
  const [openAccordions, setOpenAccordions] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
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
        url: apiUrls.courses.getCourseById(id),
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
    if (courseId) {
      // Reset states when courseId changes to avoid showing stale data
      setCourseDetails(null);
      setCurriculum([]);
      setToolsTechnologies([]);
      setBonusModules([]);
      setReviews([]);
      setOpenAccordions(null);
      
      // Fetch new course details
      fetchCourseDetails(courseId);
    } else {
      setLoading(false);
    }
  }, [courseId]);
  
  // Handle initialActiveSection changes
  useEffect(() => {
    if (initialActiveSection && initialActiveSection !== activeSection) {
      console.log(`Updating active section to: ${initialActiveSection}`);
      setActiveSection(initialActiveSection);
    }
  }, [initialActiveSection]);

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
        },
        {
          label: "Live Sessions",
          value: formatLiveSessions(courseDetails),
          icon: Users,
          color: "text-blue-500 dark:text-blue-400",
          bgColor: "bg-blue-50 dark:bg-blue-900/30",
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
        },
        {
          label: "Time Commitment",
          value: formatTimeCommitment(courseDetails),
          icon: Clock,
          color: "text-green-500 dark:text-green-400",
          bgColor: "bg-green-50 dark:bg-green-900/30",
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
        },
        {
          label: "Live Sessions",
          value: "72",
          icon: Users,
          color: "text-blue-500 dark:text-blue-400",
          bgColor: "bg-blue-50 dark:bg-blue-900/30",
        },
        {
          label: "Format",
          value: "Personality Development",
          icon: Sparkles,
          color: "text-amber-500 dark:text-amber-400",
          bgColor: "bg-amber-50 dark:bg-amber-900/30",
        },
        {
          label: "Time Commitment",
          value: "3 - 4 hours / week",
          icon: Clock,
          color: "text-green-500 dark:text-green-400",
          bgColor: "bg-green-50 dark:bg-green-900/30",
        },
      ];
    }
  };
  
  // Helper functions to format course details
  const formatDuration = (details) => {
    if (!details) return "9 months / 36 weeks";
    
    try {
      // Try different possible field names
      const duration = details.duration || details.course_duration;
      
      if (duration) {
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
          // Approximate 4 weeks as 1 month
          const calculatedMonths = Math.round(parseInt(weeks) / 4);
          return `${calculatedMonths} months / ${weeks} weeks`;
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
        // Approximate 4 weeks as 1 month
        const calculatedMonths = Math.round(parseInt(weeks) / 4);
        return `${calculatedMonths} months / ${weeks} weeks`;
      }
    } catch (error) {
      console.error("Error formatting duration:", error);
    }
    
    return "9 months / 36 weeks"; // Default fallback
  };
  
  const formatLiveSessions = (details) => {
    if (!details) return "72";
    
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
    
    // Check for is_Certification field
    if (courseDetails.is_Certification) {
      return courseDetails.is_Certification === "Yes";
    }
    
    return true; // Default to true if information not available
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

  // Get color classes based on course category
  const getCategoryColorClasses = () => {
    if (!courseDetails) return {
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/30",
      primaryColor: "emerald"
    };

    const category = (courseDetails.course_category || courseDetails.category || "").toLowerCase();
    
    // Map categories to color schemes
    if (category.includes("mathematics") || category.includes("math")) {
      return {
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-50 dark:bg-amber-900/30",
        primaryColor: "amber"
      };
    } else if (category.includes("ai") || category.includes("data") || category.includes("science")) {
      return {
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-900/30",
        primaryColor: "blue"
      };
    } else if (category.includes("marketing") || category.includes("business")) {
      return {
        color: "text-green-600 dark:text-green-400",
        bg: "bg-green-50 dark:bg-green-900/30",
        primaryColor: "green"
      };
    } else if (category.includes("personality") || category.includes("development")) {
      return {
        color: "text-purple-600 dark:text-purple-400",
        bg: "bg-purple-50 dark:bg-purple-900/30",
        primaryColor: "purple"
      };
    }
    
    // Default emerald
    return {
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/30",
      primaryColor: "emerald"
    };
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] py-20">
        <div className="relative">
          <Preloader />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 2, times: [0, 0.5, 1] }}
            className="absolute -top-10 -right-10"
          >
            <Sparkles className="w-8 h-8 text-emerald-400" />
          </motion.div>
        </div>
      </div>
    );
  }

  // Get course features
  const courseFeatures = getCourseFeatures();

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
              />
            </motion.div>

            {/* Course description */}
            <div className="prose prose-emerald dark:prose-invert max-w-none mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4">
                Course Overview
              </h3>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                {(() => {
                  // Check all possible description field names in order of preference
                  if (courseDetails?.course_description && courseDetails.course_description !== "-") {
                    return <p>{courseDetails.course_description}</p>;
                  } else if (courseDetails?.description && courseDetails.description !== "-") {
                    return <p>{courseDetails.description}</p>;
                  } else if (courseDetails?.about && courseDetails.about !== "-") {
                    return <p>{courseDetails.about}</p>;
                  } else if (courseDetails?.long_description && courseDetails.long_description !== "-") {
                    return <p>{courseDetails.long_description}</p>;
                  } else if (courseDetails?.short_description && courseDetails.short_description !== "-") {
                    return <p>{courseDetails.short_description}</p>;
                  } else {
                    // Fallback to generic description
                    return (
                      <p>
                        This comprehensive {courseDetails?.course_category || courseDetails?.category || "course"} is designed to provide students with a solid foundation in the subject matter, combining theoretical knowledge with practical applications. Through interactive sessions and hands-on projects, students will develop the skills needed to excel in this field.
                      </p>
                    );
                  }
                })()}
              </div>
            </div>

            {/* Download Brochure - Responsive design */}
            <motion.div 
              className="bg-gradient-to-r from-emerald-50 via-green-50 to-blue-50 dark:from-emerald-900/20 dark:via-green-900/20 dark:to-blue-900/20 rounded-lg overflow-hidden shadow-md mt-6 sm:mt-8"
              variants={fadeIn}
              whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            >
              <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center">
                <div className="sm:w-1/4 flex justify-center mb-4 sm:mb-0 hidden sm:block">
                  <motion.div
                    whileHover={{ rotate: -5, scale: 1.05 }}
                  >
                    <Image src={Pdf} width={100} alt="PDF Brochure" className="object-contain drop-shadow-md" />
                  </motion.div>
                </div>
                
                <div className="w-full sm:w-2/4 text-center sm:text-left sm:px-6 mb-4 sm:mb-0">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    Download Course Brochure
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                    {hasBrochure() 
                      ? "Get detailed information about curriculum, instructors, career opportunities, and more."
                      : "Brochure for this course is currently being prepared. Please check back soon."}
                  </p>
                </div>
                
                <div className="w-full sm:w-1/4 flex justify-center">
                  <motion.button
                    onClick={openModal}
                    className={`flex items-center px-5 sm:px-6 py-2.5 sm:py-3 ${
                      hasBrochure() 
                        ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700" 
                        : "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                    } text-white font-medium rounded-lg transition-all duration-300 shadow-md w-full sm:w-auto`}
                    whileHover={hasBrochure() ? { scale: 1.05 } : {}}
                    whileTap={hasBrochure() ? { scale: 0.95 } : {}}
                    disabled={!hasBrochure()}
                  >
                    <DownloadIcon size={18} className="mr-2" />
                    {hasBrochure() ? "Download" : "Coming Soon"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
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
            <div className="flex items-center mb-6">
              <div className="w-1.5 h-6 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-sm mr-3"></div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                Curriculum
              </h2>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-700/80 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
                  Course Modules
                </h3>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {curriculum && curriculum.length > 0 ? (
                  curriculum.map((item, index) => (
                    <div key={index} className="transition-all duration-200">
                      <motion.button
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        onClick={() => toggleAccordion(index)}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center flex-1 min-w-0">
                          <motion.div 
                            className={`flex-shrink-0 p-2 rounded-full mr-3 sm:mr-4 ${
                              openAccordions === index 
                                ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400" 
                                : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                            }`}
                            whileHover={{ 
                              scale: [1, 1.1, 1],
                              transition: { duration: 0.5 }
                            }}
                          >
                            {openAccordions === index ? (
                              <BookOpen size={18} />
                            ) : (
                              <Calendar size={18} />
                            )}
                          </motion.div>
                          <span className={`text-sm sm:text-base font-medium truncate ${
                            openAccordions === index 
                              ? "text-blue-700 dark:text-blue-400" 
                              : "text-gray-800 dark:text-gray-200"
                          }`}>
                            {item.weekTitle}
                          </span>
                        </div>
                        <motion.div 
                          className={`flex-shrink-0 ml-3 p-1.5 rounded-full ${
                            openAccordions === index 
                              ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400" 
                              : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                          }`}
                          animate={openAccordions === index ? { rotate: 180 } : { rotate: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown size={16} />
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
                            <div className="px-4 sm:px-6 py-4 sm:py-5 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                              <div className="pl-7 sm:pl-10 space-y-3 sm:space-y-4">
                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
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
                  <div className="p-6 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-4">
                      <AlertTriangle className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Curriculum Coming Soon
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                      Our team is finalizing the curriculum details. Check back soon for a complete breakdown of course modules.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Tools & Technologies Section */}
            {toolsTechnologies && toolsTechnologies.length > 0 && (
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-8"
                variants={fadeIn}
              >
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
                    Tools & Technologies
                  </h3>
                </div>
                <div className="p-4">
                  <motion.div 
                    className="flex flex-wrap gap-2"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    {toolsTechnologies.map((tool, index) => (
                      <motion.span 
                        key={index} 
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800/30 hover:shadow-md transition-all duration-300 cursor-default"
                        variants={fadeIn}
                        whileHover={{ 
                          y: -2, 
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          background: "linear-gradient(to right, #dbeafe, #e0e7ff)"
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
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-8"
                variants={fadeIn}
              >
                <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-purple-500 dark:text-purple-400" />
                    Bonus Modules
                  </h3>
                </div>
                <div className="p-4">
                  <ul className="space-y-3">
                    {bonusModules.map((module, index) => (
                      <motion.li 
                        key={index} 
                        className="flex items-start p-3 rounded-lg hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-colors"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ x: 5 }}
                      >
                        <motion.div 
                          className="p-2 rounded-full bg-gradient-to-r from-purple-400 to-violet-500 text-white mr-3 mt-0.5 shadow-sm"
                          whileHover={{ rotate: 15 }}
                        >
                          <BookOpen size={16} />
                        </motion.div>
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-gray-200">{module.title}</h4>
                          {module.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
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
                    <Star size={32} className="text-amber-400" />
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
              <CourseFaq courseId={courseId} />
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
              <CourseCertificate courseId={courseId} />
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
            <AlertTriangle className="w-12 h-12 mx-auto text-amber-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Section Not Found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              The requested section could not be found. Please select a different tab.
            </p>
          </motion.div>
        );
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8"
    >
      <motion.div 
        variants={fadeIn}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
      >
        {/* Course Header - Static, always visible */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="mb-4 sm:mb-6"
        >
          <CourseHeader 
            title={courseDetails?.course_title}
            category={courseDetails?.course_category || courseDetails?.category}
            price={courseDetails?.course_fee}
            backgroundImage={courseDetails?.course_image}
            colorClass={getCategoryColorClasses().color}
            bgClass={getCategoryColorClasses().bg}
          />
        </motion.div>

        {/* Mobile Stats - Visible only on mobile */}
        <div className="block sm:hidden px-4 mb-4">
          <CourseStats 
            duration={formatDuration(courseDetails)}
            students="75+" 
            sessions={courseDetails?.no_of_Sessions || "72"}
            hasCertificate={hasCertificate()}
            primaryColor={getCategoryColorClasses().primaryColor}
          />
        </div>

        {/* Navigation Tabs - Static, placed right after header */}
        <div className="sticky top-16 z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="px-4 sm:px-6 py-3 sm:py-4 overflow-x-auto scrollbar-hide">
            <CourseNavigation
              activeSection={activeSection}
              scrollToSection={scrollToSection}
              primaryColor={getCategoryColorClasses().primaryColor}
              showCertificate={true}
              isMobile={true}
            />
          </div>
        </div>

        {/* Dynamic content area based on active tab */}
        <div className="px-4 sm:px-6 pt-6 sm:pt-8 pb-6">
          <AnimatePresence mode="wait">
            {renderActiveSection()}
          </AnimatePresence>
        </div>
      </motion.div>
      
      {/* Mobile Action Button - Fixed at bottom for enrollment */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3 z-40 flex justify-between items-center shadow-lg">
        <div className="flex flex-col">
          <span className="text-sm text-gray-600 dark:text-gray-400">Course Fee</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {courseDetails?.course_fee ? `₹${courseDetails.course_fee}` : 'Free'}
          </span>
        </div>
        <button 
          className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium rounded-lg shadow-md"
          onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
        >
          Enroll Now
        </button>
      </div>
      
      <DownloadBrochureModal
        isOpen={isModalOpen}
        onClose={closeModal}
        courseTitle={courseDetails?.course_title}
        courseId={courseId}
        brochureId={hasBrochure() && courseDetails?.brochures && courseDetails.brochures.length > 0 
          ? courseDetails.brochures[0] 
          : null}
      />
    </motion.div>
  );
};

export default CourseDetailsPage; 