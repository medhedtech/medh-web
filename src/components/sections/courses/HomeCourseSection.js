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

// List of specific course durations to display (in weeks)
const TARGET_DURATIONS = [
  72,  // 18 months (72 weeks)
  36   // 9 months (36 weeks)
];

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
  const [liveFilters, setLiveFilters] = useState({
    upcoming: false,
    popular: false,
    latest: false
  });
  const [blendedFilters, setBlendedFilters] = useState({
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
            8, // limit to 8 courses (4x2 grid)
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

      // Fetch live courses
      getQuery({
        url: apiUrls?.courses?.getAllCoursesWithLimits(
          1, // page
          100, // Get more courses to ensure we have courses from all categories
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
            // Get one course from each category
            const onePerCategory = getOneCoursePerCategory(data.courses);
            
            // Sort alphabetically by category name
            const sortedCourses = onePerCategory.sort((a, b) => {
              const categoryA = a.course_category || "Uncategorized";
              const categoryB = b.course_category || "Uncategorized";
              return categoryA.localeCompare(categoryB);
            });
            
            setLiveCourses(sortedCourses);
            setFilteredLiveCourses(sortedCourses);
          }
        }
      });
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Apply filters to live courses
  const applyLiveFilters = () => {
    // Start with our one-per-category list
    let filtered = [...liveCourses];
    
    // Apply filters if needed
    if (liveFilters.upcoming) {
      // Filter for courses starting in the future
      const today = new Date();
      filtered = filtered.filter(course => {
        const startDate = new Date(course.startDate);
        return startDate > today;
      });
    }
    
    if (liveFilters.popular) {
      // Sort by popularity (using enrollmentCount or similar)
      filtered = filtered.sort((a, b) => (b.enrollmentCount || 0) - (a.enrollmentCount || 0));
    } else if (liveFilters.latest) {
      // Sort by creation date
      filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      // Default to category sorting if no other sort is applied
      filtered = filtered.sort((a, b) => {
        const categoryA = a.course_category || "Uncategorized";
        const categoryB = b.course_category || "Uncategorized";
        return categoryA.localeCompare(categoryB);
      });
    }
    
    setFilteredLiveCourses(filtered);
  };

  // Apply filters to blended courses
  const applyBlendedFilters = () => {
    let filtered = [...blendedCourses];
    
    if (blendedFilters.popular) {
      // Sort by popularity (using enrollmentCount or similar)
      filtered = filtered.sort((a, b) => (b.enrollmentCount || 0) - (a.enrollmentCount || 0));
    }
    
    if (blendedFilters.latest) {
      // Sort by creation date
      filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (blendedFilters.beginner) {
      // Filter for beginner-friendly courses
      filtered = filtered.filter(course => 
        course.level?.toLowerCase() === 'beginner' || 
        course.difficulty?.toLowerCase() === 'easy' ||
        course.tags?.some(tag => tag.toLowerCase().includes('beginner'))
      );
    }
    
    setFilteredBlendedCourses(filtered);
  };

  // Handle filter toggles for live courses
  const toggleLiveFilter = (filter) => {
    const newFilters = {
      ...liveFilters,
      [filter]: !liveFilters[filter]
    };
    setLiveFilters(newFilters);
  };

  // Handle filter toggles for blended courses
  const toggleBlendedFilter = (filter) => {
    const newFilters = {
      ...blendedFilters,
      [filter]: !blendedFilters[filter]
    };
    setBlendedFilters(newFilters);
  };

  useEffect(() => {
    applyLiveFilters();
  }, [liveFilters, liveCourses]);

  useEffect(() => {
    applyBlendedFilters();
  }, [blendedFilters, blendedCourses]);

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
  const FilterButton = ({ active, icon, label, onClick, color="rose" }) => {
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
        active: "bg-primary-500 text-white font-bold",
        inactive: "bg-primary-100 text-primary-600 hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-800/40 font-medium"
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
    <div className="w-full py-4 md:py-3 lg:py-4">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-6 lg:mb-7">
        <div>
          <h2 className="text-2xl md:text-2xl lg:text-3xl font-extrabold mb-2 text-gray-800 dark:text-white">
            {CustomText}
          </h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-2xl font-medium">
            {CustomDescription}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <ViewAllButton 
            href="/courses" 
            text="View All Courses" 
          />
        </div>
      </div>

      {/* Live Courses Section */}
      <div 
        ref={liveRef}
        className={`relative overflow-hidden rounded-xl bg-gradient-to-r from-rose-50 via-white to-rose-50 dark:from-rose-900/10 dark:via-gray-900 dark:to-rose-900/10 p-4 sm:p-5 md:p-6 lg:p-7 mb-8 md:mb-8 lg:mb-10 shadow-md transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-5 lg:mb-6">
          <div className="flex items-center mb-3 sm:mb-0">
            <Video className="w-6 h-6 mr-2.5 text-rose-500" />
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
              Live Interactive Courses
            </h3>
          </div>
          
          {/* Filter buttons for live courses */}
          <div className="flex flex-wrap gap-2 md:gap-2.5">
            <FilterButton 
              active={liveFilters.upcoming} 
              icon={<Calendar size={14} />} 
              label="Upcoming"
              onClick={() => toggleLiveFilter('upcoming')}
              color="rose"
            />
            <FilterButton 
              active={liveFilters.popular} 
              icon={<Sparkles size={14} />} 
              label="Popular"
              onClick={() => toggleLiveFilter('popular')}
              color="rose"
            />
            <FilterButton 
              active={liveFilters.latest} 
              icon={<Clock size={14} />} 
              label="Latest"
              onClick={() => toggleLiveFilter('latest')}
              color="rose"
            />
            {/* Clear filters button - only shown when filters are active */}
            {(liveFilters.upcoming || liveFilters.popular || liveFilters.latest) && (
              <button 
                onClick={() => setLiveFilters({upcoming: false, popular: false, latest: false})}
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredLiveCourses.map((course) => (
              <motion.div key={course._id} variants={itemVariants} className="live-course-card">
                <CourseCard course={course} scrollToTop={scrollToTop} classType="live" />
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
          className={`relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-50 via-white to-indigo-50 dark:from-indigo-900/10 dark:via-gray-900 dark:to-indigo-900/10 p-4 sm:p-5 md:p-6 lg:p-7 shadow-md transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-5 lg:mb-6">
            <div className="flex items-center mb-3 sm:mb-0">
              <Layers className="w-6 h-6 mr-2.5 text-indigo-500" />
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
                Blended Self Paced Courses
              </h3>
            </div>
            
            {/* Filter buttons for blended courses */}
            <div className="flex flex-wrap gap-2 md:gap-2.5">
              <FilterButton 
                active={blendedFilters.beginner} 
                icon={<BookOpen size={14} />} 
                label="Beginner-Friendly"
                onClick={() => toggleBlendedFilter('beginner')}
                color="indigo"
              />
              <FilterButton 
                active={blendedFilters.popular} 
                icon={<Sparkles size={14} />} 
                label="Popular"
                onClick={() => toggleBlendedFilter('popular')}
                color="indigo"
              />
              <FilterButton 
                active={blendedFilters.latest} 
                icon={<Clock size={14} />} 
                label="Latest"
                onClick={() => toggleBlendedFilter('latest')}
                color="indigo"
              />
              {/* Clear filters button - only shown when filters are active */}
              {(blendedFilters.beginner || blendedFilters.popular || blendedFilters.latest) && (
                <button 
                  onClick={() => setBlendedFilters({beginner: false, popular: false, latest: false})}
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
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredBlendedCourses.map((course) => (
                <motion.div key={course._id} variants={itemVariants} className="blended-course-card">
                  <CourseCard course={course} scrollToTop={scrollToTop} classType="blended" />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <EmptyState type="blended" />
          )}
        </div>
      )}

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
          }
          
          .live-course-card:hover, .blended-course-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          }
        }
        
        /* Make live course cards stand out differently from blended courses */
        .live-course-card :global(.course-card) {
          border-left: 3px solid rgba(244, 63, 94, 0.8); /* Rose color */
        }
        
        .blended-course-card :global(.course-card) {
          border-left: 3px solid rgba(99, 102, 241, 0.8); /* Indigo color */
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