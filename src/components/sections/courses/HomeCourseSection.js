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
          showOnlyLive ? 12 : 8, // Get more courses if we're only showing live
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
            setLiveCourses(data.courses);
            setFilteredLiveCourses(data.courses);
          }
        }
      });
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError(true);
    }
  };

  // Apply filters to live courses
  const applyLiveFilters = () => {
    let filtered = [...liveCourses];
    
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
    }
    
    if (liveFilters.latest) {
      // Sort by creation date
      filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
    <Link 
      href={href}
      className="group flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-full shadow-sm transition-all duration-300 hover:shadow-md"
    >
      <span>{text}</span>
      <ChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );

  // EmptyState component for when no courses match filters
  const EmptyState = ({ type }) => (
    <div className="col-span-full flex flex-col items-center justify-center py-12 bg-white dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800">
      <div className={`w-16 h-16 mb-4 ${type === 'live' ? 'text-rose-500 dark:text-rose-400' : 'text-indigo-500 dark:text-indigo-400'}`}>
        {type === 'live' ? <Video size={64} /> : <Layers size={64} />}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        No {type === 'live' ? 'Live' : 'Blended'} Courses Found
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
        {type === 'live' 
          ? "No live courses match your current filter selection. Try adjusting your filters or check back later for new interactive sessions."
          : "No blended courses match your current filter selection. Try adjusting your filters or explore our other learning options."}
      </p>
      <button
        onClick={() => type === 'live' 
          ? setLiveFilters({ upcoming: false, popular: false, latest: false }) 
          : setBlendedFilters({ beginner: false, popular: false, latest: false })}
        className={`px-5 py-2 rounded-full text-white flex items-center gap-2 ${
          type === 'live' ? 'bg-rose-500 hover:bg-rose-600' : 'bg-indigo-500 hover:bg-indigo-600'
        }`}
      >
        <Filter size={18} />
        Clear Filters
      </button>
    </div>
  );

  // Filter button component
  const FilterButton = ({ active, icon, label, onClick, color="rose" }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
        active 
          ? `bg-${color}-600 text-white shadow-md` 
          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="w-full">
      {/* Main Header Section with Gradient Text */}
      <div className="mb-16 text-center max-w-4xl mx-auto">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-4">
            <Sparkles size={24} className="text-primary-600 dark:text-primary-400" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 mb-4">
          {CustomText}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {CustomDescription}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh] bg-white dark:bg-gray-900/30 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
          <Preloader2 />
        </div>
      ) : (
        <div className="space-y-24">
          {/* Live Courses Section with Card Grid - Styled with extra emphasis */}
          <section 
            ref={liveRef}
            className={`rounded-3xl ${showOnlyLive ? 'bg-gradient-to-b from-rose-50 to-white dark:from-rose-900/10 dark:to-gray-900/90' : 'bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-900/80'} shadow-lg border border-gray-100 dark:border-gray-800 p-8 transition-all duration-500 opacity-0 transform translate-y-4 animate-fade-in`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center">
                    <Video size={20} className="text-rose-600 dark:text-rose-400" />
                  </div>
                  <span className="text-sm font-medium text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                    Live Interactive
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2" 
                  data-class-type="live">
                  Live Interactive Courses
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-xl">
                  Join our real-time interactive sessions with expert instructors. Experience engaging learning through direct feedback, group discussions, and collaborative projects.
                </p>
              </div>
              <ViewAllButton href="/courses?type=live" text="View All Live Courses" />
            </div>

            {/* Live Course Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 mt-4">
              <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 flex items-start gap-3 shadow-sm">
                <div className="h-8 w-8 rounded-full bg-rose-100 dark:bg-rose-900/20 flex items-center justify-center flex-shrink-0">
                  <Clock size={16} className="text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">Real-time Interaction</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Engage directly with instructors and fellow students</p>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 flex items-start gap-3 shadow-sm">
                <div className="h-8 w-8 rounded-full bg-rose-100 dark:bg-rose-900/20 flex items-center justify-center flex-shrink-0">
                  <Users size={16} className="text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">Expert Instructors</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Learn from industry professionals with proven expertise</p>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 flex items-start gap-3 shadow-sm">
                <div className="h-8 w-8 rounded-full bg-rose-100 dark:bg-rose-900/20 flex items-center justify-center flex-shrink-0">
                  <Calendar size={16} className="text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">Scheduled Sessions</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Join live classes on your calendar for consistent learning</p>
                </div>
              </div>
            </div>

            {/* Filter options for live courses */}
            <div className="flex flex-wrap gap-2 mb-8">
              <FilterButton 
                active={liveFilters.upcoming}
                icon={<Calendar size={14} />}
                label="Upcoming"
                onClick={() => toggleLiveFilter('upcoming')}
                color="rose"
              />
              <FilterButton 
                active={liveFilters.popular}
                icon={<Users size={14} />}
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
              {Object.values(liveFilters).some(v => v) && (
                <button
                  onClick={() => setLiveFilters({ upcoming: false, popular: false, latest: false })}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1"
                >
                  <Filter size={14} />
                  Clear filters
                </button>
              )}
            </div>

            <motion.div 
              className={`grid grid-cols-1 sm:grid-cols-2 ${showOnlyLive ? 'lg:grid-cols-4' : 'lg:grid-cols-4'} gap-6`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              data-class-type="live"
            >
              {filteredLiveCourses.length > 0 ? (
                filteredLiveCourses.map((course, index) => (
                  <motion.div
                    key={course._id}
                    variants={itemVariants}
                    className="transform transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg rounded-xl"
                    data-course-id={course._id}
                    data-class-type="live"
                  >
                    <CourseCard course={course} classType="live" />
                  </motion.div>
                ))
              ) : (
                <EmptyState type="live" />
              )}
            </motion.div>
          </section>

          {/* Blended Courses Section - Only show if not showOnlyLive */}
          {!showOnlyLive && (
            <section 
              ref={blendedRef}
              className="rounded-3xl bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-900/10 dark:to-gray-900/90 shadow-lg border border-gray-100 dark:border-gray-800 p-8 transition-all duration-500 opacity-0 transform translate-y-4 animate-fade-in"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                      <Layers size={20} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      Blended Learning
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2"
                    data-class-type="blended">
                    Blended Learning Courses
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 max-w-xl">
                    Experience a hybrid approach that combines self-paced digital content with scheduled instructor guidance. Enjoy flexibility while maintaining structure and support throughout your learning journey.
                  </p>
                </div>
                <ViewAllButton href="/courses?type=blended" text="View All Blended Courses" />
              </div>

              {/* Blended Course Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 mt-4">
                <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 flex items-start gap-3 shadow-sm">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center flex-shrink-0">
                    <Laptop size={16} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">Flexible Learning</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Study at your own pace with a mix of online and offline resources</p>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 flex items-start gap-3 shadow-sm">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center flex-shrink-0">
                    <Book size={16} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">Comprehensive Materials</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Access diverse learning resources for deeper understanding</p>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 flex items-start gap-3 shadow-sm">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center flex-shrink-0">
                    <GraduationCap size={16} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">Self-Paced Progress</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Learn on your schedule with structured but flexible curriculum</p>
                  </div>
                </div>
              </div>

              {/* Filter options for blended courses */}
              <div className="flex flex-wrap gap-2 mb-8">
                <FilterButton 
                  active={blendedFilters.beginner}
                  icon={<GraduationCap size={14} />}
                  label="Beginner-Friendly"
                  onClick={() => toggleBlendedFilter('beginner')}
                  color="indigo"
                />
                <FilterButton 
                  active={blendedFilters.popular}
                  icon={<Users size={14} />}
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
                {Object.values(blendedFilters).some(v => v) && (
                  <button
                    onClick={() => setBlendedFilters({ beginner: false, popular: false, latest: false })}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1"
                  >
                    <Filter size={14} />
                    Clear filters
                  </button>
                )}
              </div>

              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                data-class-type="blended"
              >
                {filteredBlendedCourses.length > 0 ? (
                  filteredBlendedCourses.map((course, index) => (
                    <motion.div
                      key={course._id}
                      variants={itemVariants}
                      className="transform transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg rounded-xl"
                      data-course-id={course._id}
                      data-class-type="blended"
                    >
                      <CourseCard course={course} classType="blended" />
                    </motion.div>
                  ))
                ) : (
                  <EmptyState type="blended" />
                )}
              </motion.div>
            </section>
          )}
        </div>
      )}

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease forwards;
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