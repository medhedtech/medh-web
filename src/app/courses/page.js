"use client";
import { Suspense, useState, useEffect } from 'react';
import CoursesFilter from "@/components/sections/courses/CoursesFilter";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import { motion } from "framer-motion";
import React from 'react';
import {
  BookOpen,
  Users,
  Star,
  ChevronRight,
  Sparkles,
  Clock,
  Award,
  ArrowRight,
  Filter,
  Calendar,
  Layers,
  Laptop,
  Video,
  Search,
  X
} from 'lucide-react';

const Courses = () => {
  const [activeTab, setActiveTab] = useState("all"); // "all", "live", or "blended"
  const [liveCourseFilters, setLiveCourseFilters] = useState({
    upcoming: false,
    popular: false,
    latest: false
  });
  const [blendedCourseFilters, setBlendedCourseFilters] = useState({
    popular: false,
    latest: false,
    beginner: false
  });

  const [showLiveFilters, setShowLiveFilters] = useState(true);
  const [showBlendedFilters, setShowBlendedFilters] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // Animation variants
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

  // Stats data
  const stats = [
    {
      icon: <BookOpen className="w-6 h-6 text-primary-400 dark:text-primary-300" />,
      value: "20+",
      label: "All Courses"
    },
    {
      icon: <Users className="w-6 h-6 text-primary-400 dark:text-primary-300" />,
      value: "1000+",
      label: "Active Learners"
    },
    {
      icon: <Star className="w-6 h-6 text-primary-400 dark:text-primary-300" />,
      value: "4.9/5",
      label: "Average Rating"
    }
  ];

  // Features data
  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-primary-400 dark:text-primary-300" />,
      title: "Expert-Led Training",
      description: "Learn from industry experts with proven expertise"
    },
    {
      icon: <Clock className="w-6 h-6 text-primary-400 dark:text-primary-300" />,
      title: "Flexible Learning",
      description: "Study at your own pace with lifetime access to course content"
    },
    {
      icon: <Award className="w-6 h-6 text-primary-400 dark:text-primary-300" />,
      title: "Industry Recognition",
      description: "Earn certificates valued by top employers globally"
    }
  ];

  // Toggle filters
  const toggleLiveFilter = (filter) => {
    setLiveCourseFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  const toggleBlendedFilter = (filter) => {
    setBlendedCourseFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  // Filter button component
  const FilterButton = ({ active, icon, label, onClick, color="teal" }) => {
    const colorClasses = {
      rose: {
        active: "bg-rose-500 text-white font-semibold",
        inactive: "bg-rose-100 text-rose-600 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-800/40 font-medium"
      },
      indigo: {
        active: "bg-indigo-500 text-white font-semibold",
        inactive: "bg-indigo-100 text-indigo-600 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-800/40 font-medium"
      },
      teal: {
        active: "bg-[#379392] text-white font-semibold",
        inactive: "bg-[#379392]/10 text-[#379392] hover:bg-[#379392]/20 dark:bg-[#379392]/30 dark:text-[#379392]/80 dark:hover:bg-[#379392]/40 font-medium"
      }
    };
    
    return (
      <button
        onClick={onClick}
        className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm transition-all duration-200 ${
          active ? colorClasses[color].active : colorClasses[color].inactive
        }`}
      >
        {React.cloneElement(icon, { className: "w-5 h-5" })}
        <span>{label}</span>
      </button>
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Add these helper functions for course display
  const getBlendedCourseSessions = (course) => {
    const defaultVideoCount = course.lectures_count || 20;
    const defaultQnaSessions = course.live_sessions || 2;
    return {
      videoCount: defaultVideoCount,
      qnaSessions: defaultQnaSessions
    };
  };

  const formatBlendedLearningExperience = (videoCount, qnaSessions, duration) => {
    return (
      <div className="flex flex-col space-y-2">
        <div className="flex items-center text-xs">
          <Clock className="w-4 h-4 mr-1 text-[#379392]" />
          <span>Duration: {duration || "Flexible"}</span>
        </div>
        <div className="flex flex-col space-y-1">
          <div className="flex items-center text-xs">
            <Video className="w-4 h-4 mr-1 text-rose-500" />
            <span>{videoCount} Video Lessons</span>
          </div>
          <div className="flex items-center text-xs">
            <Users className="w-4 h-4 mr-1 text-[#379392]" />
            <span>{qnaSessions} Live QnA Sessions</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <PageWrapper>
      <main className="min-h-screen w-full bg-gradient-to-b from-gray-50/80 via-white to-gray-50/80 dark:from-gray-900 dark:via-gray-850 dark:to-gray-900 transition-colors duration-300">
        {/* Course Header & Tabs Section */}
        <section className="relative w-full py-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary-100/30 dark:bg-primary-900/20 blur-3xl transform rotate-12"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-rose-100/30 dark:bg-rose-900/20 blur-3xl"></div>
          </div>

          <div className="container relative mx-auto px-4">
            <div className="flex flex-col items-center justify-center max-w-4xl mx-auto pt-10">

              {/* Course Type Switcher */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex p-1.5 bg-gray-100/80 dark:bg-gray-800/90 rounded-2xl shadow-sm border border-transparent dark:border-gray-700 backdrop-blur-sm transition-colors duration-300"
              >
                <button 
                  onClick={() => setActiveTab("all")}
                  className={`px-6 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                    activeTab === "all" 
                      ? "bg-primary-600 text-white dark:bg-primary-700 dark:text-white shadow-sm" 
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  All Courses
                </button>
                <button 
                  onClick={() => setActiveTab("live")}
                  className={`px-6 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                    activeTab === "live" 
                      ? "bg-rose-600 text-white dark:bg-rose-700 dark:text-white shadow-sm" 
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  Live Courses
                </button>
                <button 
                  onClick={() => setActiveTab("blended")}
                  className={`px-6 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                    activeTab === "blended" 
                      ? "bg-indigo-600 text-white dark:bg-indigo-700 dark:text-white shadow-sm" 
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  Blended Courses
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Filter Section - Live Courses - Full Width */}
        {activeTab === "live" && (
          <section className="w-full py-6 bg-rose-50/80 dark:bg-rose-900/10 border-b border-rose-100 dark:border-rose-900/20 transition-colors duration-300">
            <div className="max-w-full px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setShowLiveFilters(!showLiveFilters)}
                  className="flex items-center gap-2 text-rose-700 dark:text-rose-300 hover:text-rose-800 dark:hover:text-rose-200 transition-colors px-4 py-2"
                >
                  <Filter className="w-6 h-6" />
                  <span className="text-base font-medium">
                    {showLiveFilters ? 'Hide Filters' : 'Show Filters'}
                  </span>
                  <ChevronRight className={`w-5 h-5 transition-transform duration-200 ${showLiveFilters ? 'rotate-90' : ''}`} />
                </button>
                <span className="hidden md:inline-flex items-center text-sm text-rose-700 dark:text-rose-300">
                  <Filter className="w-4 h-4 mr-1" />
                  {showLiveFilters ? 'Select filters to refine results' : `${Object.values(liveCourseFilters).filter(Boolean).length} filters applied`}
                </span>
              </div>
              <motion.div
                initial={false}
                animate={{ 
                  height: showLiveFilters ? 'auto' : 0,
                  opacity: showLiveFilters ? 1 : 0
                }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap justify-center md:justify-start gap-4 py-4">
                  <h3 className="sr-only">Live Course Filters</h3>
                  <FilterButton 
                    active={liveCourseFilters.upcoming}
                    icon={<Calendar className="w-4 h-4" />}
                    label="Upcoming"
                    onClick={() => toggleLiveFilter('upcoming')}
                    color="rose"
                  />
                  <FilterButton 
                    active={liveCourseFilters.popular}
                    icon={<Users className="w-4 h-4" />}
                    label="Popular"
                    onClick={() => toggleLiveFilter('popular')}
                    color="rose"
                  />
                  <FilterButton 
                    active={liveCourseFilters.latest}
                    icon={<Sparkles className="w-4 h-4" />}
                    label="Latest"
                    onClick={() => toggleLiveFilter('latest')}
                    color="rose"
                  />
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Filter Section - Blended Courses - Full Width */}
        {activeTab === "blended" && (
          <section className="w-full py-6 bg-indigo-50/80 dark:bg-indigo-900/10 border-b border-indigo-100 dark:border-indigo-900/20 transition-colors duration-300">
            <div className="max-w-full px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setShowBlendedFilters(!showBlendedFilters)}
                  className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors px-4 py-2"
                >
                  <Filter className="w-6 h-6" />
                  <span className="text-base font-medium">
                    {showBlendedFilters ? 'Hide Filters' : 'Show Filters'}
                  </span>
                  <ChevronRight className={`w-5 h-5 transition-transform duration-200 ${showBlendedFilters ? 'rotate-90' : ''}`} />
                </button>
                <span className="hidden md:inline-flex items-center text-sm text-indigo-700 dark:text-indigo-300">
                  <Filter className="w-4 h-4 mr-1" />
                  {showBlendedFilters ? 'Select filters to refine results' : `${Object.values(blendedCourseFilters).filter(Boolean).length} filters applied`}
                </span>
              </div>
              <motion.div
                initial={false}
                animate={{ 
                  height: showBlendedFilters ? 'auto' : 0,
                  opacity: showBlendedFilters ? 1 : 0
                }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap justify-center md:justify-start gap-4 py-4">
                  <h3 className="sr-only">Blended Course Filters</h3>
                  <FilterButton 
                    active={blendedCourseFilters.popular}
                    icon={<Users className="w-4 h-4" />}
                    label="Popular"
                    onClick={() => toggleBlendedFilter('popular')}
                    color="indigo"
                  />
                  <FilterButton 
                    active={blendedCourseFilters.latest}
                    icon={<Sparkles className="w-4 h-4" />}
                    label="Latest"
                    onClick={() => toggleBlendedFilter('latest')}
                    color="indigo"
                  />
                  <FilterButton 
                    active={blendedCourseFilters.beginner}
                    icon={<BookOpen className="w-4 h-4" />}
                    label="Beginner Friendly"
                    onClick={() => toggleBlendedFilter('beginner')}
                    color="indigo"
                  />
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Courses Section */}
        <section id="courses-section" className="w-full py-12 bg-gray-50/80 dark:bg-gray-900/80 transition-colors duration-300">
          <div className="w-full">
            <Suspense 
              fallback={
                <div className="flex h-96 items-center justify-center">
                  <div className="relative w-16 h-16">
                    <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-primary-200 dark:border-primary-800/30 border-t-primary-600 dark:border-t-primary-500 animate-spin"></div>
                    <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-transparent border-t-primary-300 dark:border-t-primary-400 animate-spin" style={{ animationDuration: '2s' }}></div>
                  </div>
                </div>
              }
            >
              {activeTab === "all" && (
                <CoursesFilter 
                  CustomText="EXPLORE LEARNING PATHS CONFIDENTLY"
                  hideSearch={false}
                  CustomButton={
                    <div className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 text-white text-sm font-medium rounded-xl transition-colors shadow-sm hover:shadow-md">
                      View All Categories
                    </div>
                  }
                  description="Comprehensive Skill Development Courses Tailored for Diverse Professional Aspirations"
                  renderCourse={(course) => {
                    // Determine the class_type dynamically from course data
                    const courseType = course.class_type?.toLowerCase() || '';
                    const isLive = courseType.includes('live');
                    const isBlended = courseType.includes('blend');
                    
                    // Define type-specific properties
                    let typedProps = {};
                    
                    if (isLive) {
                      // Live course specific properties
                      typedProps = {
                        course_duration: (
                          <div className="flex items-center text-sm">
                            <Clock className="w-4 h-4 mr-1 text-rose-500" />
                            <span>{course.course_duration || "4-8 weeks"}</span>
                          </div>
                        ),
                        no_of_Sessions: course.no_of_Sessions || 24,
                        effort_hours: course.effort_hours || "6-8",
                        highlights: [
                          "Live interactive sessions",
                          "Real-world projects",
                          ...(course.highlights || [])
                        ]
                      };
                    } else if (isBlended) {
                      // Blended course specific properties
                      const videoCount = course.lectures_count || 20;
                      const qnaSessions = course.live_sessions || 2;
                      
                      typedProps = {
                        course_duration: formatBlendedLearningExperience(
                          videoCount, 
                          qnaSessions,
                          course.course_duration
                        ),
                        course_duration: `${videoCount} Videos • ${qnaSessions} Q&A • ${course.course_duration || "Self-paced"}`,
                        no_of_Sessions: course.no_of_Sessions || videoCount,
                        effort_hours: course.effort_hours || "3-5",
                        highlights: [
                          "Self-paced learning",
                          "Interactive content",
                          ...(course.highlights || [])
                        ]
                      };
                    } else {
                      // Default course properties
                      typedProps = {
                        course_duration: course.course_duration || "4-18 months",
                        effort_hours: course.effort_hours || "4-6",
                        no_of_Sessions: course.no_of_Sessions || 24,
                      };
                    }
                    
                    return {
                      ...course,
                      ...typedProps,
                      instructor: course.instructor || null,
                      highlights: typedProps.highlights || course.highlights || []
                    };
                  }}
                  preserveClassType={true} // Ensure class_type from course data is respected
                />
              )}
              
              {activeTab === "live" && (
                <CoursesFilter 
                  CustomText="Live Interactive Courses"
                  hideSearch={false}
                  CustomButton={
                    <div className="inline-flex items-center px-6 py-3 bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600 text-white text-sm font-medium rounded-xl transition-colors shadow-sm hover:shadow-md">
                      <Calendar className="w-4 h-4 mr-2" />
                      See Schedule
                    </div>
                  }
                  classType="live"
                  filterState={liveCourseFilters}
                  description="Join interactive sessions with industry experts for real-time learning and direct feedback."
                  renderCourse={(course) => ({
                    ...course,
                    class_type: "live", // Always enforce live class type in this tab
                    course_duration: (
                      <div className="flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-1 text-rose-500" />
                        <span>{course.course_duration || "4-8 weeks"}</span>
                      </div>
                    ),
                    effort_hours: course.effort_hours || "6-8",
                    no_of_Sessions: course.no_of_Sessions || 24,
                    instructor: course.instructor || null,
                    highlights: [
                      "Live interactive sessions",
                      "Real-world projects",
                      ...(course.highlights || [])
                    ]
                  })}
                />
              )}
              
              {activeTab === "blended" && (
                <CoursesFilter 
                  CustomText="Blended Learning Courses"
                  hideSearch={false}
                  hideGradeFilter={true}
                  CustomButton={
                    <div className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white text-sm font-medium rounded-xl transition-colors shadow-sm hover:shadow-md">
                      <Laptop className="w-4 h-4 mr-2" />
                      Explore Learning Paths
                    </div>
                  }
                  classType="blended"
                  filterState={blendedCourseFilters}
                  description="Flexible self-paced learning with interactive content and practical assignments."
                  renderCourse={(course) => {
                    const { videoCount, qnaSessions } = getBlendedCourseSessions(course);
                    return {
                      ...course,
                      class_type: "blended", // Always enforce blended class type in this tab
                      course_duration: formatBlendedLearningExperience(
                        videoCount, 
                        qnaSessions,
                        course.duration
                      ),
                      duration_range: `${videoCount} Videos • ${qnaSessions} Q&A • ${course.duration_range || "Self-paced"}`,
                      effort_hours: course.effort_hours || "3-5",
                      highlights: [
                        "Self-paced learning",
                        "Interactive content",
                        ...(course.highlights || [])
                      ]
                    };
                  }}
                />
              )}
            </Suspense>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg mr-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease forwards;
        }
      `}</style>
    </PageWrapper>
  );
};

export default Courses;
