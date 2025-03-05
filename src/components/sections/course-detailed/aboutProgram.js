"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Pdf from "@/assets/images/course-detailed/pdf-icon.svg";
import Download from "@/assets/images/course-detailed/download.svg";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import Preloader from "@/components/shared/others/Preloader";
import DownloadBrochureModal from "@/components/shared/download-broucher";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronDown, ChevronUp, Download as DownloadIcon, FileText, Clock, Calendar, Users, Sparkles, Star, Award, CheckCircle, GraduationCap, Zap, Lightbulb, ArrowRight, MessageCircle } from "lucide-react";

export default function AboutProgram({ courseId }) {
  const [activeTab, setActiveTab] = useState("ProgramInfo");
  const [openAccordions, setOpenAccordions] = useState(null);
  const { getQuery, loading } = useGetQuery();
  const [courseDetails, setCourseDetails] = useState(null);
  const [curriculum, setCurriculum] = useState([]);
  const [toolsTechnologies, setToolsTechnologies] = useState([]);
  const [bonusModules, setBonusModules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [hoveredAccordion, setHoveredAccordion] = useState(null);
  
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
  
  const pulseAnimation = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: { duration: 1.5, repeat: Infinity }
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails(courseId);
    } else {
      notFound();
    }
  }, [courseId]);

  const fetchCourseDetails = async (id) => {
    try {
      await getQuery({
        url: `${apiUrls?.courses?.getCourseById}/${id}`,
        onSuccess: (data) => {
          console.log("Course details received:", data);
          setCourseDetails(data);
          
          // Process curriculum data
          if (data?.curriculum && Array.isArray(data.curriculum) && data.curriculum.length > 0) {
            setCurriculum(data.curriculum);
          } else {
            setCurriculum(generateDefaultCurriculum(data));
          }
          
          // Process tools & technologies
          if (data?.tools_technologies && Array.isArray(data.tools_technologies) && data.tools_technologies.length > 0) {
            setToolsTechnologies(data.tools_technologies);
          }
          
          // Process bonus modules
          if (data?.bonus_modules && Array.isArray(data.bonus_modules) && data.bonus_modules.length > 0) {
            setBonusModules(data.bonus_modules);
          }
        },
        onFail: (err) => {
          console.error("Error fetching course details:", err);
          setCurriculum(generateDefaultCurriculum());
        },
      });
    } catch (error) {
      console.error("Error in fetching course details:", error);
      setCurriculum(generateDefaultCurriculum());
    }
  };

  // Generate default curriculum when none is available
  const generateDefaultCurriculum = (courseData = null) => {
    const courseTitle = courseData?.course_title || "this course";
    const isDataAnalytics = courseTitle.toLowerCase().includes("data") || courseTitle.toLowerCase().includes("analytics");
    const isProgramming = courseTitle.toLowerCase().includes("programming") || courseTitle.toLowerCase().includes("development");
    const isMarketing = courseTitle.toLowerCase().includes("marketing") || courseTitle.toLowerCase().includes("seo");
    
    if (isDataAnalytics) {
      return [
        {
          weekTitle: "Weeks 1-2: Introduction to Data Analytics",
          weekDescription: "Overview of data analytics concepts, tools, and methodologies. Introduction to data collection, cleaning, and preparation techniques."
        },
        {
          weekTitle: "Weeks 3-4: Data Visualization Fundamentals",
          weekDescription: "Learn to create effective visualizations using industry-standard tools. Understand principles of visual communication and dashboard design."
        },
        {
          weekTitle: "Weeks 5-6: Statistical Analysis",
          weekDescription: "Apply statistical methods to analyze data patterns and trends. Learn hypothesis testing and confidence intervals for data-driven decision making."
        },
        {
          weekTitle: "Weeks 7-8: Advanced Analytics & Reporting",
          weekDescription: "Master advanced analytics techniques and create professional reports. Learn to present insights effectively to different stakeholders."
        }
      ];
    } else if (isProgramming) {
      return [
        {
          weekTitle: "Weeks 1-2: Programming Fundamentals",
          weekDescription: "Introduction to programming concepts, syntax, and problem-solving approaches. Build a foundation in logical thinking and algorithm development."
        },
        {
          weekTitle: "Weeks 3-4: Data Structures & Algorithms",
          weekDescription: "Learn essential data structures and algorithms for efficient code. Understand time and space complexity analysis."
        },
        {
          weekTitle: "Weeks 5-6: Web Development Basics",
          weekDescription: "Introduction to HTML, CSS, and JavaScript for building interactive web applications. Learn responsive design principles."
        },
        {
          weekTitle: "Weeks 7-8: Backend Development & Databases",
          weekDescription: "Understand server-side programming and database management. Build complete web applications with frontend and backend components."
        }
      ];
    } else if (isMarketing) {
      return [
        {
          weekTitle: "Weeks 1-2: Digital Marketing Fundamentals",
          weekDescription: "Overview of digital marketing channels, strategies, and metrics. Understand customer journey and digital touchpoints."
        },
        {
          weekTitle: "Weeks 3-4: Content Marketing & SEO",
          weekDescription: "Learn content creation strategies and search engine optimization techniques. Understand keyword research and on-page/off-page SEO."
        },
        {
          weekTitle: "Weeks 5-6: Social Media Marketing",
          weekDescription: "Master social media platforms, content strategies, and paid advertising. Learn community management and engagement techniques."
        },
        {
          weekTitle: "Weeks 7-8: Analytics & Campaign Optimization",
          weekDescription: "Analyze marketing performance and optimize campaigns based on data. Learn A/B testing and conversion rate optimization."
        }
      ];
    } else {
      // Generic curriculum
      return [
        {
          weekTitle: `Weeks 1-2: Introduction to ${courseTitle}`,
          weekDescription: `Overview of fundamental concepts and principles in ${courseTitle}. Build a strong foundation for advanced topics.`
        },
        {
          weekTitle: "Weeks 3-4: Core Methodologies & Techniques",
          weekDescription: "Learn essential methodologies and techniques used by industry professionals. Practice with hands-on exercises and case studies."
        },
        {
          weekTitle: "Weeks 5-6: Applied Skills Development",
          weekDescription: "Apply learned concepts to real-world scenarios and projects. Develop practical skills valued in the workplace."
        },
        {
          weekTitle: "Weeks 7-8: Advanced Topics & Final Project",
          weekDescription: "Explore advanced topics and complete a comprehensive final project. Prepare for professional application of skills."
        }
      ];
    }
  };

  const toggleAccordion = (index) => {
    setOpenAccordions(openAccordions === index ? null : index);
  };

  // Generate course features from course details
  const getCourseFeatures = () => {
    console.log("Current course details for features:", courseDetails);
    
    // Map API field names to our feature structure
    const features = [
      {
        label: "Duration",
        value: formatDuration(courseDetails || courseDetails?.course_duration),
        icon: Calendar,
        color: "text-purple-500 dark:text-purple-400",
        bgColor: "bg-purple-50 dark:bg-purple-900/30",
      },
      {
        label: "Live Sessions",
        value: formatLiveSessions(courseDetails || courseDetails?.sessions_count),
        icon: Users,
        color: "text-blue-500 dark:text-blue-400",
        bgColor: "bg-blue-50 dark:bg-blue-900/30",
      },
      {
        label: "Format",
        value: courseDetails?.course_type || courseDetails?.course_category || "Personality Development",
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

    return features;
  };
  
  // Helper functions to format course details
  const formatDuration = (details) => {
    if (!details) return "9 months / 36 weeks";
    
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
    
    return "9 months / 36 weeks";
  };
  
  const formatLiveSessions = (details) => {
    if (!details) return "72";
    
    // Get session count
    const sessionCount = details.no_of_Sessions || 
                         "72";
    
    // Get session duration
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
    return sessionCount;
  };
  
  const formatTimeCommitment = (details) => {
    if (!details) return "3 - 4 hours / week";
    
    // Try different possible field names
    return details.time_commitment || 
           details.efforts_per_Week || 
           details.hours_per_week || 
           "3 - 4 hours / week"; 
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
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

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="max-w-6xl mx-auto px-4 py-8"
    >
      <motion.div 
        variants={fadeIn} 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
      >
        {/* Header Section */}
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex space-x-6 px-6 pt-6">
            <motion.button
              onClick={() => setActiveTab("ProgramInfo")}
              className={`pb-4 font-medium text-base transition-colors relative ${
                activeTab === "ProgramInfo"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center">
                <BookOpen className="w-4 h-4 mr-2" />
                Program Info
              </span>
              {activeTab === "ProgramInfo" && (
                <motion.span 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"
                />
              )}
            </motion.button>
            
            <motion.button
              onClick={() => setActiveTab("Reviews")}
              className={`pb-4 font-medium text-base transition-colors relative ${
                activeTab === "Reviews"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-2" />
                Reviews
              </span>
              {activeTab === "Reviews" && (
                <motion.span 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"
                />
              )}
            </motion.button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="w-1.5 h-6 bg-gradient-to-b from-emerald-400 to-green-500 rounded-sm mr-3"></div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">About Program</h2>
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <BookOpen className="ml-2 text-emerald-500 dark:text-emerald-400 w-5 h-5" />
            </motion.div>
          </div>

          {/* Show Content Based on Active Tab */}
          {activeTab === "ProgramInfo" ? (
            <AnimatePresence mode="wait">
              <motion.div
                key="program-info"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Course Features - Enhanced Highlighted Section */}
                <motion.div 
                  variants={fadeIn}
                  className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-800 dark:via-gray-800/90 dark:to-gray-800 rounded-xl p-8 mb-10 border border-gray-100 dark:border-gray-700 shadow-md overflow-hidden"
                >
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 dark:bg-emerald-900/10 rounded-full -mr-16 -mt-16 z-0"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-50 dark:bg-blue-900/10 rounded-full -ml-12 -mb-12 z-0"></div>
                  
                  <div className="relative z-10">
                    <motion.h3 
                      className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center"
                      variants={fadeIn}
                    >
                      <div className="flex items-center justify-center bg-gradient-to-r from-emerald-400 to-green-500 p-2.5 rounded-lg mr-3 shadow-sm text-white">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <span>Course Details</span>
                    </motion.h3>
                    
                    <motion.div 
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                    >
                      {courseFeatures.map((feature, index) => (
                        <motion.div 
                          key={index} 
                          className="bg-white dark:bg-gray-700 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 transition-all duration-300"
                          variants={fadeIn}
                          whileHover={{ 
                            y: -5,
                            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                          }}
                          onHoverStart={() => setHoveredFeature(index)}
                          onHoverEnd={() => setHoveredFeature(null)}
                        >
                          <motion.div 
                            className={`p-3.5 rounded-xl ${feature.bgColor} mb-3 ring-4 ring-opacity-30 ${feature.bgColor.replace('bg-', 'ring-')}`}
                            animate={hoveredFeature === index ? {
                              scale: [1, 1.1, 1],
                              transition: { duration: 0.5 }
                            } : {}}
                          >
                            <feature.icon size={22} className={feature.color} />
                          </motion.div>
                          <p className="text-xs uppercase tracking-wide font-semibold text-gray-500 dark:text-gray-400 mb-1">
                            {feature.label}
                          </p>
                          <motion.p 
                            className="font-bold text-gray-800 dark:text-gray-200 leading-tight"
                            animate={hoveredFeature === index ? {
                              color: ["#374151", feature.color.replace("text-", "#")],
                              transition: { duration: 0.5 }
                            } : {}}
                          >
                            <span className="text-lg">{feature.value.split('(')[0]}</span>
                            {feature.value.includes('(') && (
                              <span className="block text-sm mt-1 text-gray-600 dark:text-gray-300">
                                ({feature.value.split('(')[1]}
                              </span>
                            )}
                          </motion.p>
                        </motion.div>
                      ))}
                    </motion.div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 mr-2"></div>
                        {courseDetails?.session_frequency || "Sessions twice weekly"}
                      </span>
                      <span className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 mr-2"></div>
                        {courseDetails?.learning_environment || "Interactive learning environment"}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Curriculum Section */}
                <motion.div 
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-8"
                  variants={fadeIn}
                >
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-700/80 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                      <GraduationCap className="w-5 h-5 mr-2 text-emerald-500 dark:text-emerald-400" />
                      Curriculum
                    </h3>
                  </div>

                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {curriculum.map((item, index) => (
                      <motion.div 
                        key={index} 
                        className="transition-all duration-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.5)" }}
                        onHoverStart={() => setHoveredAccordion(index)}
                        onHoverEnd={() => setHoveredAccordion(null)}
                      >
                        <motion.button
                          className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          onClick={() => toggleAccordion(index)}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center flex-1 min-w-0">
                            <motion.div 
                              className={`flex-shrink-0 p-2 rounded-full mr-3 sm:mr-4 ${
                                openAccordions === index 
                                  ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400" 
                                  : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                              }`}
                              animate={hoveredAccordion === index && openAccordions !== index ? { 
                                scale: [1, 1.1, 1],
                                transition: { duration: 0.5 }
                              } : {}}
                            >
                              {openAccordions === index ? (
                                <BookOpen size={18} />
                              ) : (
                                <Calendar size={18} />
                              )}
                            </motion.div>
                            <span className={`text-sm sm:text-base font-medium truncate ${
                              openAccordions === index 
                                ? "text-emerald-700 dark:text-emerald-400" 
                                : "text-gray-800 dark:text-gray-200"
                            }`}>
                              {item.weekTitle}
                            </span>
                          </div>
                          <motion.div 
                            className={`flex-shrink-0 ml-3 p-1.5 rounded-full ${
                              openAccordions === index 
                                ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400" 
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
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Tools & Technologies Section */}
                {toolsTechnologies && toolsTechnologies.length > 0 && (
                  <motion.div 
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-8"
                    variants={fadeIn}
                  >
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                        <Zap className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
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

                {/* Download Brochure */}
                <motion.div 
                  className="bg-gradient-to-r from-emerald-50 via-green-50 to-blue-50 dark:from-emerald-900/20 dark:via-green-900/20 dark:to-blue-900/20 rounded-lg overflow-hidden shadow-md mt-8"
                  variants={fadeIn}
                  whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                >
                  <div className="p-6 flex flex-col md:flex-row items-center">
                    <div className="md:w-1/4 flex justify-center mb-6 md:mb-0">
                      <motion.div
                        whileHover={{ rotate: -5, scale: 1.05 }}
                      >
                        <Image src={Pdf} width={120} alt="PDF Brochure" className="object-contain drop-shadow-md" />
                      </motion.div>
                    </div>
                    
                    <div className="md:w-2/4 text-center md:text-left md:px-6 mb-6 md:mb-0">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                        Download Course Brochure
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Get detailed information about curriculum, instructors, career opportunities, and more.
                      </p>
                    </div>
                    
                    <div className="md:w-1/4 flex justify-center">
                      <motion.button
                        onClick={openModal}
                        className="flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-medium rounded-lg transition-all duration-300 shadow-md"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <DownloadIcon size={18} className="mr-2" />
                        Download
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          ) : (
            /* Content for Reviews tab */
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="text-center py-8">
                <motion.div 
                  className="bg-gray-100 dark:bg-gray-700 rounded-full p-4 inline-flex mb-4"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <MessageCircle size={32} className="text-gray-400" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">No Reviews Yet</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  Be the first to review this course after enrollment. Your feedback helps us improve and guides other students.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
      
      <DownloadBrochureModal
        isOpen={isModalOpen}
        onClose={closeModal}
        courseTitle={courseDetails?.course_title}
      />
    </motion.div>
  );
}
