"use client";
import { useEffect, useState, useRef } from "react";
import CourseCard from "@/components/sections/courses/CourseCard";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import Preloader2 from "@/components/shared/others/Preloader2";
import { BookOpen, ChevronRight, Layers, Sparkles, Video, Clock, Users, Calendar, Filter, Book, Laptop, GraduationCap, LucideLayoutGrid } from "lucide-react";
import PropTypes from 'prop-types';
import { motion } from "framer-motion";
import Link from "next/link";
import mobileMenu from "@/libs/mobileMenu";

// List of specific course durations to display (in weeks)
const TARGET_DURATIONS = [
  72,  // 18 months (72 weeks)
  36   // 9 months (36 weeks)
];

// Feature courses for Live Interactive section - added with course URLs
const featuredLiveCourses = [
  {
    id: "ai_data_science",
    title: "AI & Data Science",
    description: "Master the fundamentals of artificial intelligence and data science with hands-on projects and industry mentorship.",
    url: "/ai-and-data-science-course", // URL for redirection
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
    }
  },
  {
    id: "digital_marketing",
    title: "Digital Marketing with Data Analytics",
    description: "Learn how to leverage digital platforms and data analytics to create successful marketing campaigns.",
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
    }
  },
  {
    id: "personality_development",
    title: "Personality Development",
    description: "Develop essential soft skills, communication abilities, and confidence for personal and professional growth.",
    url: "/personality-development-course", // URL for redirection
    duration_range: "3-9 months",
    effort_hours: "4-6",
    no_of_Sessions: "24-72",
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
    }
  },
  {
    id: "vedic_mathematics",
    title: "Vedic Mathematics",
    description: "Learn ancient Indian mathematical techniques for faster calculations and enhanced problem-solving abilities.",
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
    }
  }
];

// Estimated video count and QnA sessions for blended courses
const getBlendedCourseSessions = (course) => {
  // Default values if not available in course data
  const defaultVideoCount = 20; // Random between 30-50
  const defaultQnaSessions = 2; // Random between 4-8
  
  // Try to extract from course data or use defaults
  const videoCount = course.video_count || course.lectures_count || defaultVideoCount;
  const qnaSessions = course.qa_sessions || course.live_sessions || defaultQnaSessions;
  
  return {
    videoCount,
    qnaSessions
  };
};

// Prepare icons for learning experience display
const VideoIcon = () => <Video size={14} className="mr-1 flex-shrink-0 text-rose-500" />;
const QnaIcon = () => <Users size={14} className="mr-1 flex-shrink-0 text-[#379392]" />;

// Format the blended course learning experience text with better phrasing and icons
const formatBlendedLearningExperience = (videoCount, qnaSessions) => {
  return (
    <div className="flex flex-col space-y-1" >
      <div className="flex items-center text-xs">
        <VideoIcon />
        <span>{videoCount} Video Lessons</span>
      </div>
      <div className="flex items-center text-xs">
        <QnaIcon />
        <span> Live QnA Sessions</span>
      </div>
    </div>
  );
};

const HomeCourseSection = ({ 
  CustomText = "Featured Courses",
  CustomDescription = "Explore our curated selection of blended and live learning experiences",
  scrollToTop,
  hideGradeFilter,
  showOnlyLive = false 
}) => {
  const [blendedCourses, setBlendedCourses] = useState([]);
  const [liveCourses, setLiveCourses] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [activeLiveFilters, setActiveLiveFilters] = useState({
    upcoming: false,
    popular: false,
    latest: false
  });
  const [activeBlendedFilters, setActiveBlendedFilters] = useState({
    popular: false,
    latest: false,
    beginner: false
  });
  const [filteredLiveCourses, setFilteredLiveCourses] = useState([]);
  const [filteredBlendedCourses, setFilteredBlendedCourses] = useState([]);
  const { getQuery, loading, error } = useGetQuery();
  const blendedRef = useRef(null);
  const liveRef = useRef(null);

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
  const durationToWeeks = (duration) => {
    if (!duration) return 0;
    
    // Convert duration string to number of weeks
    const durationString = duration.toLowerCase();
    
    // Check for months format
    if (durationString.includes('month')) {
      const months = parseInt(durationString.match(/\d+/)?.[0] || '0');
      return months * 4; // Approximate 4 weeks per month
    }
    
    // Check for weeks format
    if (durationString.includes('week')) {
      return parseInt(durationString.match(/\d+/)?.[0] || '0');
    }
    
    // Return 0 if format is not recognized
    return 0;
  };

  // Function to pick one course from each category
  const getOneCoursePerCategory = (courses) => {
    if (!courses || !Array.isArray(courses)) return [];
    
    // Create a map to hold one course per category
    const categoryMap = new Map();
    
    // For each course, save one course per course_category
    courses.forEach(course => {
      const category = course.course_category || "Uncategorized";
      
      // If we don't have a course for this category yet, add it
      if (!categoryMap.has(category)) {
        categoryMap.set(category, course);
      }
    });
    
    // Convert map back to array
    return Array.from(categoryMap.values());
  };

  // Fetch both blended and live courses
  const fetchCourses = async () => {
    try {
      // Only fetch blended courses if we're not showing only live courses
      if (!showOnlyLive) {
        getQuery({
          url: apiUrls?.courses?.getAllCoursesWithLimits(
            1, // page
            "", // limit to 8 courses (4x2 grid)
            "", // course_title
            "", // course_tag
            "", // course_category
            "Published", // status
            "", // search
            "", // course_grade
            [], // category
            {}, // filters
            "blended" // class_type - correctly positioned as the last parameter
          ),
          onSuccess: (data) => {
            if (data?.courses) {
              setBlendedCourses(data.courses);
              setFilteredBlendedCourses(data.courses);
            }
          }
        });
      }

      // We'll still fetch live courses to potentially enhance our placeholder data
      // but we'll maintain our specific course selection in applyLiveFilters
      getQuery({
        url: apiUrls?.courses?.getAllCoursesWithLimits(
          1, // page
          8, // Get more courses to ensure we have courses from all categories
          "", // course_title
          "", // course_tag
          "", // course_category
          "Published", // status
          "", // search
          "", // course_grade
          [], // category
          {}, // filters
          "live" // class_type - correctly positioned as the last parameter
        ),
        onSuccess: (data) => {
          if (data?.courses) {
            // Store all live courses from API
            // Instead of filtering to one per category, we'll keep all courses
            // so we can match them with our featured courses in applyLiveFilters
            setLiveCourses(data.courses);
            
            // Let applyLiveFilters handle the filtering to our specific courses
            applyLiveFilters();
          }
        }
      });
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Apply filters to live courses
  const applyLiveFilters = () => {
    let filtered = [];
    
    // Start with our featured courses
    if (featuredLiveCourses.length > 0) {
      featuredLiveCourses.forEach(featuredCourse => {
        // Check if there's a matching course in the fetched data
        const matchedCourse = liveCourses.find(
          course => course.course_title && 
          course.course_title.toLowerCase().includes(featuredCourse.title.toLowerCase())
        );
        
        if (matchedCourse) {
          // Use the actual course data but add our custom data
          filtered.push({
            ...matchedCourse,
            course_title: featuredCourse.title, // Ensure consistent title
            custom_url: featuredCourse.url,
            duration_range: featuredCourse.duration_range,
            course_duration: featuredCourse.duration_range, // Ensure duration is set in both fields
            description: featuredCourse.description,
            highlights: featuredCourse.highlights,
            course_fee: matchedCourse.course_fee || "Variable",
            price: matchedCourse.price || "Variable",
            effort_hours: featuredCourse.effort_hours,
            no_of_Sessions: featuredCourse.no_of_Sessions,
            learning_points: featuredCourse.learning_points,
            prerequisites: featuredCourse.prerequisites,
            instructor: featuredCourse.instructor
          });
        } else {
          // If no matching course found, create a placeholder with all our data
          filtered.push({
            _id: featuredCourse.id,
            course_title: featuredCourse.title,
            course_description: featuredCourse.description,
            description: featuredCourse.description,
            course_duration: featuredCourse.duration_range,
            duration_range: featuredCourse.duration_range,
            custom_url: featuredCourse.url,
            highlights: featuredCourse.highlights,
            is_placeholder: true,
            course_category: featuredCourse.title.split(' ')[0],
            classType: "live",
            price: "Variable",
            course_fee: "Variable",
            thumbnail: null,
            effort_hours: featuredCourse.effort_hours,
            no_of_Sessions: featuredCourse.no_of_Sessions,
            learning_points: featuredCourse.learning_points,
            prerequisites: featuredCourse.prerequisites,
            instructor: featuredCourse.instructor
          });
        }
      });
    }
    
    // Apply further filtering based on selected filters
    if (activeLiveFilters.upcoming) {
      // Maintain the order but mark as upcoming
      filtered = filtered.map(course => ({...course, upcoming: true}));
    }
    
    if (activeLiveFilters.popular) {
      // Mark as popular
      filtered = filtered.map(course => ({...course, popular: true}));
    }
    
    if (activeLiveFilters.latest) {
      // Mark as latest
      filtered = filtered.map(course => ({...course, latest: true}));
    }
    
    setFilteredLiveCourses(filtered);
    return filtered;
  };

  // Apply filters to blended courses
  const applyBlendedFilters = () => {
    let filtered = [...blendedCourses];
    
    if (activeBlendedFilters.popular) {
      // Sort by popularity (using enrollmentCount or similar)
      filtered = filtered.sort((a, b) => (b.enrollmentCount || 0) - (a.enrollmentCount || 0));
    }
    
    if (activeBlendedFilters.latest) {
      // Sort by creation date
      filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (activeBlendedFilters.beginner) {
      // Filter for beginner-friendly courses
      filtered = filtered.filter(course => 
        course.level?.toLowerCase() === 'beginner' || 
        course.difficulty?.toLowerCase() === 'easy' ||
        course.tags?.some(tag => tag.toLowerCase().includes('beginner'))
      );
    }
    
    setFilteredBlendedCourses(filtered);
    return filtered;
  };

  // Handle filter toggles for live courses
  const toggleLiveFilter = (filter) => {
    const newFilters = {
      ...activeLiveFilters,
      [filter]: !activeLiveFilters[filter]
    };
    setActiveLiveFilters(newFilters);
  };

  // Handle filter toggles for blended courses
  const toggleBlendedFilter = (filter) => {
    const newFilters = {
      ...activeBlendedFilters,
      [filter]: !activeBlendedFilters[filter]
    };
    setActiveBlendedFilters(newFilters);
  };

  // Apply filters for courses that come from API
  const applyFilters = () => {
    // First apply filters to live courses
    const filteredLive = applyLiveFilters();
    setFilteredLiveCourses(filteredLive);
    
    // Then apply filters to blended courses
    if (!showOnlyLive) {
      const filteredBlended = applyBlendedFilters();
      setFilteredBlendedCourses(filteredBlended);
    }
  };

  // Apply LiveFilters to live courses
  useEffect(() => {
    if (liveCourses) {
      const filtered = applyLiveFilters();
      setFilteredLiveCourses(filtered);
    }
  }, [liveCourses, activeLiveFilters]);

  // Apply BlendedFilters to blended courses
  useEffect(() => {
    if (blendedCourses && !showOnlyLive) {
      const filtered = applyBlendedFilters();
      setFilteredBlendedCourses(filtered);
    }
  }, [blendedCourses, activeBlendedFilters, showOnlyLive]);

  useEffect(() => {
    fetchCourses();
  }, [showOnlyLive]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2
    };

    const handleIntersect = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    
    if (blendedRef.current) observer.observe(blendedRef.current);
    if (liveRef.current) observer.observe(liveRef.current);

    return () => {
      if (blendedRef.current) observer.unobserve(blendedRef.current);
      if (liveRef.current) observer.unobserve(liveRef.current);
    };
  }, [blendedCourses, liveCourses]);

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white dark:bg-gray-900 rounded-2xl shadow-sm">
        <div className="w-20 h-20 mb-6 text-red-500">
          <BookOpen size={80} />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Error Loading Courses
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md text-center mb-6">
          There was a problem loading the courses. Please try again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-full shadow-sm transition-colors"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  // Custom link button component
  const ViewAllButton = ({ href, text }) => (
    <Link href={href} 
      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg md:px-5 md:py-2.5">
      <span>{text}</span>
      <ChevronRight size={16} className="ml-1" />
    </Link>
  );

  // EmptyState component for when no courses match filters
  const EmptyState = ({ type }) => (
    <div className="flex flex-col items-center justify-center p-6 md:p-5 text-center bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-xl">
      <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gray-200/50 dark:bg-gray-700/50">
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
        We're preparing amazing new {type === 'live' ? 'live' : 'blended'} courses. Check back soon!
      </p>
      <Link href="/contact-us" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 rounded-lg transition-all duration-300">
        Request a Course
        <ChevronRight size={16} className="ml-1" />
      </Link>
    </div>
  );

  // Filter button component
  const FilterButton = ({ active, icon, label, onClick, color="teal" }) => {
    const colorClasses = {
      rose: {
        active: "bg-rose-500 text-white font-bold",
        inactive: "bg-rose-100 text-rose-600 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-800/40 font-medium"
      },
      indigo: {
        active: "bg-indigo-500 text-white font-bold",
        inactive: "bg-indigo-100 text-indigo-600 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-800/40 font-medium"
      },
      primary: {
        active: "bg-[#379392] text-white font-bold",
        inactive: "bg-[#379392]/10 text-[#379392] hover:bg-[#379392]/20 dark:bg-[#379392]/30 dark:text-[#379392]/80 dark:hover:bg-[#379392]/40 font-medium"
      },
      teal: {
        active: "bg-[#379392] text-white font-bold",
        inactive: "bg-[#379392]/10 text-[#379392] hover:bg-[#379392]/20 dark:bg-[#379392]/30 dark:text-[#379392]/80 dark:hover:bg-[#379392]/40 font-medium"
      }
    };
    
    return (
      <button
        onClick={onClick}
        className={`flex items-center space-x-1 px-3 py-1.5 md:py-1.5 rounded-full text-xs transition-all duration-200 ${
          active ? colorClasses[color].active : colorClasses[color].inactive
        }`}
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  };

  return (
    // Improve background and section sizing
    <div className="w-full py-4 md:py-6 lg:py-8 relative">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-6 lg:mb-7">
        <div>
          <h2 className="text-sm md:text-2xl lg:text-base font-extrabold mb-2  dark:text-gray-300 max-w-2xl font-medium">
            {CustomText}
          </h2>
          <p className="text-2xl md:text-base lg:text-3xl text-gray-600 text-gray-800 dark:text-white text:bol">
            {CustomDescription}
          </p>
        </div>
        {/* Desktop View All Courses button */}
        <div className="mt-4 md:mt-0 hidden md:block">
          <ViewAllButton 
            href="/courses" 
            text="View All Courses" 
          />
        </div>
      </div>

      {/* Live Courses Section */}
      <div 
        ref={liveRef}
        className={`relative overflow-hidden rounded-xl bg-gradient-to-r from-[#379392]/10 via-white to-[#379392]/10 dark:from-[#379392]/25 dark:via-gray-800 dark:to-[#379392]/25 p-4 sm:p-5 md:p-6 lg:p-7 mb-8 md:mb-8 lg:mb-10 shadow-md transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-5 lg:mb-6">
          <div className="flex items-center mb-3 sm:mb-0">
            <Video className="w-6 h-6 mr-2.5 text-[#379392]" />
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
              Live Interactive Courses
              <span className="hidden sm:inline"> (Weekend / Weekday Classes Available)</span>
              <span className="block sm:hidden text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">Weekend / Weekday Classes Available</span>
            </h3>
          </div>
          
          {/* Filter buttons for live courses */}
          <div className="flex flex-wrap gap-2 md:gap-2.5">
            <FilterButton 
              active={activeLiveFilters.upcoming} 
              icon={<Calendar size={14} />} 
              label="Upcoming"
              onClick={() => toggleLiveFilter('upcoming')}
              color="teal"
            />
            <FilterButton 
              active={activeLiveFilters.popular} 
              icon={<Sparkles size={14} />} 
              label="Popular"
              onClick={() => toggleLiveFilter('popular')}
              color="teal"
            />
            <FilterButton 
              active={activeLiveFilters.latest} 
              icon={<Clock size={14} />} 
              label="Latest"
              onClick={() => toggleLiveFilter('latest')}
              color="teal"
            />
            {/* Clear filters button - only shown when filters are active */}
            {(activeLiveFilters.upcoming || activeLiveFilters.popular || activeLiveFilters.latest) && (
              <button 
                onClick={() => setActiveLiveFilters({upcoming: false, popular: false, latest: false})}
                className="flex items-center space-x-1 px-3 py-1.5 md:py-1.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <Filter size={14} />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="flex items-center justify-center p-8 md:p-6">
            <Preloader2 />
          </div>
        ) : filteredLiveCourses.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-5 md:gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredLiveCourses.map((course) => (
              <motion.div 
                key={course._id} 
                variants={itemVariants} 
                className={`h-full live-course-card ${course._id === "digital_marketing" ? "active" : ""}`}
                data-course={course._id}
              >
                <CourseCard 
                  course={{
                    _id: course._id || course.id,
                    course_title: course.course_title,
                    course_type: course.course_type,
                    // course_description: course.description || '', // Use description if available
                    course_image: course.thumbnail,
                    course_duration: course.duration_range || "4-18 months",
                    display_duration: true,
                    duration_range: course.duration_range || "4-18 months",
                    course_fee: "695 Onwards",
                    price_suffix: "Onwards",
                    // fee_note: "Starting Price",
                    custom_url: course.custom_url,
                    href: course.custom_url,
                    no_of_Sessions: course.no_of_Sessions || 24,
                    effort_hours: course.effort_hours || "6-8",
                    learning_points: course.learning_points || [],
                    prerequisites: course.prerequisites || [],
                    instructor: course.instructor || null
                  }} 
                  classType="live" 
                  scrollToTop={scrollToTop}
                  showDuration={true}
                  expandedView={course._id === "digital_marketing"}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <EmptyState type="live" />
        )}
      </div>

      {/* Blended Courses Section - Only show if not in "showOnlyLive" mode */}
      {!showOnlyLive && (
        <div 
          ref={blendedRef}
          className={`relative overflow-hidden rounded-xl bg-gradient-to-r from-[#379392]/10 via-white to-[#379392]/10 dark:from-[#379392]/20 dark:via-gray-800 dark:to-[#379392]/20 p-4 sm:p-5 md:p-6 lg:p-7 shadow-md transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-5 lg:mb-6">
            <div className="flex items-center mb-3 sm:mb-0">
              <Layers className="w-6 h-6 mr-2.5 text-[#379392]" />
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
                Blended Self Paced Certification Courses 
              </h3>
            </div>
            
            {/* Filter buttons for blended courses */}
            <div className="flex flex-wrap gap-2 md:gap-2.5">
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
                  className="flex items-center space-x-1 px-3 py-1.5 md:py-1.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  <Filter size={14} />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Courses Grid */}
          {loading ? (
            <div className="flex items-center justify-center p-8 md:p-6">
              <Preloader2 />
            </div>
          ) : filteredBlendedCourses.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredBlendedCourses.map((course) => {
                // Get video and QnA session info for the blended course
                const { videoCount, qnaSessions } = getBlendedCourseSessions(course);
                
                // Format the learning experience text with icons
                const learningExperienceText = formatBlendedLearningExperience(videoCount, qnaSessions);
                
                return (
                  <motion.div key={course._id} variants={itemVariants} className="blended-course-card h-full">
                    <CourseCard 
                      course={{
                        _id: course._id || course.id,
                        course_title: course.course_title,
                        course_image: course.thumbnail || course.course_image,
                        course_duration: learningExperienceText,
                        display_duration: true,
                        duration_range: `${videoCount} Videos • ${qnaSessions} Q&A`,
                        course_fee: course.course_fee || course.price || "Free",
                        price: course.price || course.course_fee || "Free",
                        custom_url: course.custom_url || `/course-details/${course._id}`,
                        href: course.custom_url || `/course-details/${course._id}`,
                        no_of_Sessions: videoCount + qnaSessions,
                        effort_hours: course.effort_hours || "3-5",
                        learning_points: course.learning_points || course.course_highlights || [],
                        prerequisites: course.prerequisites || [],
                        instructor: course.instructor || null
                      }} 
                      classType="blended" 
                      scrollToTop={scrollToTop}
                      showDuration={true}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <EmptyState type="blended" />
          )}
        </div>
      )}

      {/* Mobile View All Courses button - positioned after courses instead of fixed */}
      <div className="md:hidden mt-6 mb-10 flex justify-center px-4">
        <Link
          href="/courses"
          className="w-full max-w-md px-5 py-3.5 flex items-center justify-center bg-gradient-to-r from-[#379392] to-[#379392]/90 text-white font-medium rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:from-[#2d7978] hover:to-[#2d7978]/90"
          onClick={scrollToTop}
        >
          View All Courses
          <ChevronRight size={18} className="ml-1.5" />
        </Link>
      </div>

      {/* Custom styles for animations and card styling */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease forwards;
        }
        
        /* Add enhanced styles for responsive text and card styling */
        @media (max-width: 640px) {
          .live-course-card, .blended-course-card {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            /* Remove extra bottom padding since fixed button is gone */
            position: relative;
            min-height: 300px;
          }
          
          .live-course-card:hover, .blended-course-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          }
          
          /* Adjust course card padding since fixed button is gone */
          .live-course-card :global(.course-card), 
          .blended-course-card :global(.course-card) {
            padding-bottom: 1rem !important;
            min-height: 24rem;
          }
          
          /* Adjust margin for duration box */
          .live-course-card :global(.bg-\[\#379392\]\/10) {
            margin-bottom: 1rem;
          }
        }
        
        /* Make sure all cards have equal heights */
        .live-course-card, .blended-course-card {
          display: flex;
          height: 100%;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        /* Standard heights for live course cards to ensure consistency */
        .live-course-card {
          min-height: 460px;
        }
        
        /* Desktop-specific heights to prevent scrolling */
        @media (min-width: 768px) {
          .live-course-card {
            height: 460px; /* Fixed consistent height */
          }
          
          /* Desktop hover card styles */
          .live-course-card :global(.hover-content) {
            overflow: hidden;
          }
        }
        
        /* Standard heights for content containers */
        .live-course-card :global(.course-card), 
        .blended-course-card :global(.course-card) {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        /* Add hover effect to live course cards similar to blended course cards */
        .live-course-card:hover, .blended-course-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
        }
        
        /* Make sure content inside cards is properly aligned */
        .live-course-card :global(.course-card), 
        .blended-course-card :global(.course-card) {
          display: flex;
          flex-direction: column;
          width: 100%;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative; /* Ensure positioned elements inside use this as reference */
        }
        
        /* Handle content sizing for different screen sizes */
        @media (min-width: 1024px) {
          .live-course-card :global(.course-card) {
            height: 460px; /* Fixed consistent height */
          }
        }
        
        @media (min-width: 768px) and (max-width: 1023px) {
          .live-course-card :global(.course-card) {
            height: 460px; /* Fixed consistent height */
          }
        }
        
        @media (min-width: 640px) and (max-width: 767px) {
          .live-course-card :global(.course-card) {
            height: 460px; /* Fixed consistent height */
          }
        }
        
        @media (max-width: 639px) {
          .live-course-card :global(.course-card) {
            height: 480px; /* Fixed consistent height for mobile */
            margin-bottom: 1rem; /* Add spacing between cards */
          }
        }
        
        /* Add hover effect to card content */
        .live-course-card:hover :global(.course-card),
        .blended-course-card:hover :global(.course-card) {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }
        
        /* Strict text control for card titles */
        .live-course-card :global(h3), 
        .blended-course-card :global(h3) {
          height: 3.5rem;
          line-height: 1.3;
          margin-bottom: 0.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 1.125rem;
          word-break: break-word;
        }
        
        /* Fixed content container heights and strict overflow control */
        .live-course-card :global(.p-4), 
        .blended-course-card :global(.p-4) {
          flex: 1 1 auto;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
          padding-bottom: 3rem; /* Space for buttons/footers */
        }
        
        /* Ensure the inner content is properly distributed */
        .live-course-card :global(.course-card) > :global(*) {
          flex-shrink: 0; /* Prevent content from shrinking */
        }
        
        /* Control text wrapping in all text elements */
        .live-course-card :global(p),
        .blended-course-card :global(p) {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          max-height: 3rem;
          line-height: 1.5;
          margin-bottom: 0.75rem;
          font-size: 0.875rem;
          word-break: break-word;
        }
        
        /* Ensure consistent image height */
        .live-course-card :global(.relative),
        .blended-course-card :global(.relative) {
          height: 200px;
          overflow: hidden;
          flex-shrink: 0;
        }
        
        /* Fixed height containers for duration/metadata info */
        .live-course-card :global(.bg-\[\#379392\]\/10),
        .blended-course-card :global(.bg-\[\#379392\]\/10),
        .live-course-card :global(.bg-indigo-100),
        .blended-course-card :global(.bg-indigo-100) {
          height: 4.5rem;
          overflow: hidden;
          margin-bottom: 0.75rem;
          flex-shrink: 0;
        }
        
        /* Control text in duration/session boxes */
        .live-course-card :global(.flex-col.space-y-1\.5),
        .blended-course-card :global(.flex-col.space-y-1\.5) {
          overflow: hidden;
        }
        
        /* Control text size in duration/session info */
        .live-course-card :global(.text-xs),
        .blended-course-card :global(.text-xs) {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 0.75rem;
          line-height: 1.25;
        }
        
        /* Fixed footer positioning to prevent layout shifts */
        .live-course-card :global(.absolute),
        .blended-course-card :global(.absolute) {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          right: 1rem;
        }
        
        /* Control button text wrapping */
        .live-course-card :global(button),
        .blended-course-card :global(button),
        .live-course-card :global(a.inline-flex),
        .blended-course-card :global(a.inline-flex) {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }
        
        /* Ensure the footer elements (like buttons) align at the bottom */
        .live-course-card :global(.mt-auto),
        .live-course-card :global(.course-card) > :global(:last-child),
        .blended-course-card :global(.mt-auto),
        .blended-course-card :global(.course-card) > :global(:last-child) {
          margin-top: auto;
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          right: 1rem;
        }
        
        /* Ensure price is consistently positioned and doesn't shift layout */
        .live-course-card :global(.course-fee),
        .blended-course-card :global(.course-fee),
        .live-course-card :global(.text-primary-600),
        .blended-course-card :global(.text-primary-600) {
          font-weight: 700;
          font-size: 1.1rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          position: absolute;
          bottom: 3.5rem;
          left: 1rem;
        }
        
        /* Fix any nested overflow issues */
        .live-course-card :global(*),
        .blended-course-card :global(*) {
          max-width: 100%;
        }
        
        /* Live course cards - fixed height and hover functionality */
        .live-course-card {
          height: 460px; /* Increased height for all cards */
          transition: all 0.3s ease;
          position: relative;
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        /* Blended course cards styling */
        .blended-course-card {
          height: 460px;
          transition: all 0.3s ease;
          position: relative;
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        .blended-course-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 20px rgba(55, 147, 146, 0.12);
        }
        
        .blended-course-card :global(.course-card) {
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          border-radius: 0.75rem;
          background: white;
          border: 1px solid rgba(55, 147, 146, 0.1);
        }
        
        /* Course info sections */
        .blended-course-card :global(.bg-indigo-100),
        .blended-course-card :global(.bg-blue-100) {
          background-color: rgba(55, 147, 146, 0.08) !important;
          border-radius: 0.5rem;
          padding: 0.75rem;
          display: flex;
          align-items: center;
          margin-bottom: 0.75rem;
          border: 1px solid rgba(55, 147, 146, 0.12);
        }
        
        /* Style for blended cards action buttons */
        .blended-course-card :global(.inline-flex) {
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s;
        }
        
        /* Primary button for blended - Details */
        .blended-course-card :global(.bg-indigo-500),
        .blended-course-card :global(.bg-blue-500) {
          background-color: #379392 !important;
          color: white !important;
          box-shadow: 0 2px 4px rgba(55, 147, 146, 0.3);
        }
        
        /* Secondary button for blended - Brochure */
        .blended-course-card :global(.border-indigo-500),
        .blended-course-card :global(.border-blue-500) {
          border: 1px solid #379392 !important;
          color: #379392 !important;
        }
        
        /* Icon styling for blended cards */
        .blended-course-card :global(svg) {
          width: 1rem;
          height: 1rem;
          color: #379392;
          margin-right: 0.5rem;
          flex-shrink: 0;
        }
        
        /* Mobile responsiveness adjustments */
        @media (max-width: 768px) {
          .live-course-card {
            height: 440px; /* Increased height for mobile */
          }
          
          .live-course-card :global(.relative) {
            height: 180px; /* Increased image height for mobile */
          }
          
          .live-course-card :global(h3) {
            font-size: 1rem;
            height: 2.8rem;
          }
          
          /* Ensure buttons don't overflow on small screens */
          .live-course-card :global(.mt-auto) {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .live-course-card :global(.inline-flex) {
            width: 100%;
            justify-content: center;
          }
          
          /* Add bottom padding to account for fixed mobile view button */
          .w-full {
            padding-bottom: 0rem;
          }
        }
        
        /* Handle IE and legacy browsers */
        @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
          .live-course-card, .live-course-card :global(.course-card) {
            height: 460px !important;
          }
        }

        /* Ensure the active card (Digital Marketing card) shows expanded content */
        .live-course-card[data-course="digital_marketing"] {
          border: 2px solid #379392;
          box-shadow: 0 8px 16px rgba(55, 147, 146, 0.2);
        }
        
        .live-course-card[data-course="digital_marketing"] .collapsed-info {
          height: auto;
          max-height: 12rem;
        }
        
        .live-course-card[data-course="digital_marketing"] .additional-details {
          height: auto;
          max-height: 6rem;
          opacity: 1;
        }
      `}</style>
    </div>
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