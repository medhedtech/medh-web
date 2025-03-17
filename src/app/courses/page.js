"use client";
import { Suspense, useState, useEffect } from 'react';
import CoursesFilter from "@/components/sections/courses/CoursesFilter";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import { BookOpen, Users, Star, ChevronRight, Sparkles, Clock, Award, ArrowRight, Filter, Calendar, Layers, Laptop } from 'lucide-react';
import { motion } from "framer-motion";

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

  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-primary-400 dark:text-primary-300" />,
      title: "Expert-Led Training",
      description: "Learn from industry ALLs with proven expertise"
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

  // Toggle a live course filter
  const toggleLiveFilter = (filter) => {
    setLiveCourseFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  // Toggle a blended course filter
  const toggleBlendedFilter = (filter) => {
    setBlendedCourseFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  // UI helper for filter buttons
  const FilterButton = ({ active, icon, label, onClick, color="rose" }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
        active 
          ? `bg-${color}-100 text-${color}-700 dark:bg-${color}-900/40 dark:text-${color}-300 shadow-sm` 
          : "bg-white dark:bg-gray-800/70 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/70 border border-transparent dark:border-gray-700"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
  
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
                  className="flex items-center gap-2 text-rose-700 dark:text-rose-300 hover:text-rose-800 dark:hover:text-rose-200 transition-colors"
                >
                  <Filter className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {showLiveFilters ? 'Hide Filters' : 'Show Filters'}
                  </span>
                  <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${showLiveFilters ? 'rotate-90' : ''}`} />
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
                <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4 py-2">
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
                  className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors"
                >
                  <Filter className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {showBlendedFilters ? 'Hide Filters' : 'Show Filters'}
                  </span>
                  <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${showBlendedFilters ? 'rotate-90' : ''}`} />
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
                <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4 py-2">
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
                  hideSearch={true}
                  CustomButton={
                    <div className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 text-white text-sm font-medium rounded-xl transition-colors shadow-sm hover:shadow-md">
                      View All Categories
                    </div>
                  }
                  description="Comprehensive Skill Development Courses Tailored for Diverse Professional Aspirations"
                />
              )}
              
              {activeTab === "live" && (
                <CoursesFilter 
                  CustomText="Live Courses"
                  hideSearch={true}
                  CustomButton={
                    <div className="inline-flex items-center px-6 py-3 bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600 text-white text-sm font-medium rounded-xl transition-colors shadow-sm hover:shadow-md">
                      <Calendar className="w-4 h-4 mr-2" />
                      See Schedule
                    </div>
                  }
                  classType="live"
                  filterState={liveCourseFilters}
                  description="Join interactive sessions with industry experts for real-time learning and direct feedback."
                />
              )}
              
              {activeTab === "blended" && (
                <CoursesFilter 
                  CustomText="Blended Courses"
                  hideSearch={true}
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
                />
              )}
            </Suspense>
          </div>
        </section>
      </main>
    </PageWrapper>
  );
};

export default Courses;
