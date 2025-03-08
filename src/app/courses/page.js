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

  const stats = [
    {
      icon: <BookOpen className="w-6 h-6 text-primary-400" />,
      value: "20+",
      label: "All Courses"
    },
    {
      icon: <Users className="w-6 h-6 text-primary-400" />,
      value: "1000+",
      label: "Active Learners"
    },
    {
      icon: <Star className="w-6 h-6 text-primary-400" />,
      value: "4.9/5",
      label: "Average Rating"
    }
  ];

  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-primary-400" />,
      title: "Expert-Led Training",
      description: "Learn from industry ALLs with proven expertise"
    },
    {
      icon: <Clock className="w-6 h-6 text-primary-400" />,
      title: "Flexible Learning",
      description: "Study at your own pace with lifetime access to course content"
    },
    {
      icon: <Award className="w-6 h-6 text-primary-400" />,
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
          ? `bg-${color}-100 text-${color}-700 dark:bg-${color}-900/30 dark:text-${color}-400 shadow-sm` 
          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
  
  return (
    <PageWrapper>
      <main className="min-h-screen w-full bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Course Header & Tabs Section */}
        <section className="w-full py-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                Explore Our Courses
              </h1>
              
              {/* Course Type Switcher - Now directly under heading */}
              <div className="inline-flex p-1 mb-5 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm">
                <button 
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === "all" 
                      ? "bg-primary-600 text-white shadow-sm" 
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  All Courses
                </button>
                <button 
                  onClick={() => setActiveTab("live")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === "live" 
                      ? "bg-rose-600 text-white shadow-sm" 
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  Live Courses
                </button>
                <button 
                  onClick={() => setActiveTab("blended")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === "blended" 
                      ? "bg-indigo-600 text-white shadow-sm" 
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  Blended Courses
                </button>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl text-center mb-8">
                {activeTab === "all" && "Explore our comprehensive collection of both live and self-paced learning experiences"}
                {activeTab === "live" && "Join interactive sessions with industry experts for real-time learning and direct feedback"}
                {activeTab === "blended" && "Flexible self-paced learning with interactive content and practical assignments"}
              </p>
            </div>
          </div>
        </section>

        {/* Filter Section - Live Courses */}
        {activeTab === "live" && (
          <section className="w-full py-6 bg-rose-50 dark:bg-rose-900/20 border-b border-rose-100 dark:border-rose-900/30">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap justify-center gap-3">
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
            </div>
          </section>
        )}

        {/* Filter Section - Blended Courses */}
        {activeTab === "blended" && (
          <section className="w-full py-6 bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-900/30">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap justify-center gap-3">
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
            </div>
          </section>
        )}

        {/* Courses Section */}
        <section id="courses-section" className="w-full py-12 bg-gray-50 dark:bg-gray-900/50">
          <div className="w-full">
            <Suspense 
              fallback={
                <div className="flex h-96 items-center justify-center">
                  <div className="relative w-16 h-16">
                    <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin"></div>
                    <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-transparent border-t-primary-300 animate-spin" style={{ animationDuration: '2s' }}></div>
                  </div>
                </div>
              }
            >
              {activeTab === "all" && (
                <CoursesFilter 
                  CustomText="All Courses"
                  CustomButton={
                    <div className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm hover:shadow-md">
                      View All Categories
                    </div>
                  }
                  description="Explore our comprehensive range of courses designed to enhance your career prospects and industry expertise."
                />
              )}
              
              {activeTab === "live" && (
                <CoursesFilter 
                  CustomText="Live Courses"
                  CustomButton={
                    <div className="inline-flex items-center px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm hover:shadow-md">
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
                  CustomButton={
                    <div className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm hover:shadow-md">
                      <Laptop className="w-4 h-4 mr-2" />
                      Explore Learning Paths
                    </div>
                  }
                  classType="blended"
                  filterState={blendedCourseFilters}
                  description="Flexible self-paced learning experiences with interactive content and practical assignments."
                />
              )}
            </Suspense>
          </div>
        </section>

        {/* Theme Controller */}
        <div className="fixed bottom-6 right-6 z-50">
          
        </div>
      </main>
    </PageWrapper>
  );
};

export default Courses;
