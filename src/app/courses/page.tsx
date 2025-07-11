"use client";
import React, { Suspense, useState, useEffect, useMemo, useCallback } from 'react';
import CoursesFilter from "@/components/sections/courses/CoursesFilter";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  Star,
  Sparkles,
  Clock,
  Award,
  Calendar,
  Laptop,
  Video,
  Search,
  TrendingUp,
  Zap,
  Target,
  Globe
} from 'lucide-react';

// TypeScript interfaces - Updated to match CoursesFilter expected interface
interface ICourse {
  _id: string;
  course_title: string;
  course_image?: string;
  course_category: string;
  course_fee: number;
  course_grade?: string;
  class_type?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  // Extended properties for enhanced functionality
  course_subtitle?: string;
  format?: string;
  lectures_count?: number;
  live_sessions?: number;
  course_duration?: string;
  duration?: string;
  duration_range?: string;
  no_of_Sessions?: number;
  effort_hours?: string;
  highlights?: string[];
  instructor?: {
    name: string;
    title: string;
    image?: string;
  } | null;
  courseType?: string;
  cardStyle?: string;
  isLiveCourse?: boolean;
  isBlendedCourse?: boolean;
}

// Constants for cache management
const COURSES_CACHE_KEY = 'medh_courses_state';
const CACHE_DURATION = 30 * 60 * 1000;

// Cache manager with proper typing
const cacheManager = {
  set: (data: { activeTab: string }): boolean => {
    try {
      const cacheData = {
        timestamp: Date.now(),
        data: data
      };
      sessionStorage.setItem(COURSES_CACHE_KEY, JSON.stringify(cacheData));
      return true;
    } catch (error) {
      console.error('Cache write failed:', error);
      return false;
    }
  },
  get: () => {
    try {
      const cache = sessionStorage.getItem(COURSES_CACHE_KEY);
      if (!cache) return null;

      const { timestamp, data } = JSON.parse(cache);
      if (!timestamp || !data) return null;

      const isExpired = Date.now() - timestamp > CACHE_DURATION;
      return isExpired ? null : data;
    } catch (error) {
      console.error('Cache read failed:', error);
      return null;
    }
  },
  clear: () => {
    try {
      sessionStorage.removeItem(COURSES_CACHE_KEY);
      return true;
    } catch (error) {
      console.error('Cache clear failed:', error);
      return false;
    }
  }
};

// Custom Button Components
const ExploreAllButton: React.FC = () => (
  <div className="inline-flex items-center px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-xl transition-colors">
    <Search className="w-4 h-4 mr-2" />
    Explore All
  </div>
);

const ViewScheduleButton: React.FC = () => (
  <div className="inline-flex items-center px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium rounded-xl transition-colors">
    <Calendar className="w-4 h-4 mr-2" />
    View Schedule
  </div>
);

const StartLearningButton: React.FC = () => (
  <div className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-colors">
    <Laptop className="w-4 h-4 mr-2" />
    Start Learning
  </div>
);

// Add moving gradient styles
const addMovingGradientStyles = () => {
  const style = document.createElement('style');
  style.id = 'moving-gradient-styles';
  style.textContent = `
    .moving-gradient-bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        45deg,
        rgba(99, 102, 241, 0.05),
        rgba(168, 85, 247, 0.08),
        rgba(236, 72, 153, 0.06),
        rgba(251, 146, 60, 0.04),
        rgba(34, 197, 94, 0.05),
        rgba(6, 182, 212, 0.07)
      );
      background-size: 400% 400%;
      animation: gradientFlow 15s ease infinite;
    }
    
    .dark .moving-gradient-bg {
      background: linear-gradient(
        45deg,
        rgba(99, 102, 241, 0.02),
        rgba(168, 85, 247, 0.04),
        rgba(236, 72, 153, 0.03),
        rgba(251, 146, 60, 0.02),
        rgba(34, 197, 94, 0.025),
        rgba(6, 182, 212, 0.035)
      );
      background-size: 400% 400%;
      animation: gradientFlow 15s ease infinite;
    }
    
    @keyframes gradientFlow {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
  `;
  document.head.appendChild(style);
};

const Courses = () => {
  const cachedState = typeof window !== 'undefined' ? cacheManager.get() : null;
  
  const [activeTab, setActiveTab] = useState<"all" | "live" | "blended">(cachedState?.activeTab || "all");
  const [isClient, setIsClient] = useState(false);

  // Add gradient styles on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const existingStyle = document.querySelector('#moving-gradient-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
      addMovingGradientStyles();
    }
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const stateToCache = { activeTab };
    cacheManager.set(stateToCache);
  }, [activeTab]);

  // Animation variants

  // Features with modern icons
  // const features = useMemo(() => [
  //   {
  //     icon: <Target className="w-6 h-6 text-purple-500" />,
  //     title: "Skill-Focused",
  //     description: "Learn exactly what you need for your career goals"
  //   },
  //   {
  //     icon: <Globe className="w-6 h-6 text-indigo-500" />,
  //     title: "Global Access",
  //     description: "Study from anywhere, anytime with our platform"
  //   },
  //   {
  //     icon: <Award className="w-6 h-6 text-green-500" />,
  //     title: "Recognized Certifications",
  //     description: "Get certificates that matter to employers"
  //   }
  // ], []);

  const handleTabChange = useCallback((tab: "all" | "live" | "blended") => {
    setActiveTab(tab);
  }, []);

  const formatCourseDuration = useCallback((duration: string | undefined): string => {
    if (!duration) return "4-8 weeks";
    
    const monthsMatch = duration.match(/(\d+)\s*months?/i);
    const weeksMatch = duration.match(/(\d+)\s*weeks?/i);
    
    if (monthsMatch && weeksMatch) {
      return `${monthsMatch[1]} Months (${weeksMatch[1]} Weeks)`;
    } else if (weeksMatch) {
      return `${weeksMatch[1]} Weeks`;
    } else if (monthsMatch) {
      return `${monthsMatch[1]} Months`;
    }
    
    return duration;
  }, []);

  const getBlendedCourseSessions = useCallback((course: ICourse) => {
    const defaultVideoCount = course.lectures_count || 20;
    return {
      videoCount: defaultVideoCount,
      qnaSessions: 2
    };
  }, []);

  const renderAllCourse = useCallback((course: ICourse): ICourse => {
    const courseType = (course.class_type || '').toLowerCase();
    
    const isLive = courseType.includes('live') || 
                  (course.format && course.format.toLowerCase().includes('live'));
                  
    const isBlended = courseType.includes('blend') || 
                    courseType.includes('hybrid') || 
                    (course.format && (
                      course.format.toLowerCase().includes('blend') || 
                      course.format.toLowerCase().includes('hybrid')
                    )) ||
                    (course.lectures_count && course.live_sessions);
    
    let typedProps: any = {};
    
    if (isLive) {
      typedProps = {
        course_duration: formatCourseDuration(course.course_duration as string),
        no_of_Sessions: course.no_of_Sessions || 24,
        effort_hours: course.effort_hours || "6-8",
        highlights: [
          "Live interactive sessions",
          "Real-world projects",
          ...(course.highlights || [])
        ]
      };
    } else if (isBlended) {
      const { videoCount, qnaSessions } = getBlendedCourseSessions(course);
      
      typedProps = {
        course_duration: formatCourseDuration(course.course_duration as string || course.duration),
        duration_range: `${videoCount} Videos • ${qnaSessions} Q&A • ${course.duration_range || "Self-paced"}`,
        no_of_Sessions: course.no_of_Sessions || videoCount,
        effort_hours: course.effort_hours || "3-5",
        highlights: [
          "Self-paced learning",
          "Interactive content",
          ...(course.highlights || [])
        ]
      };
    } else {
      typedProps = {
        course_duration: formatCourseDuration(course.course_duration as string),
        effort_hours: course.effort_hours || "4-6",
        no_of_Sessions: course.no_of_Sessions || 24
      };
    }
    
    return {
      ...course,
      ...typedProps,
      instructor: course.instructor || null,
      class_type: isLive ? 'live' : (isBlended ? 'blended' : course.class_type || ''),
      courseType: isLive ? 'live' : (isBlended ? 'blended' : 'default'),
      cardStyle: isLive ? 'live' : (isBlended ? 'blended' : 'default'),
      isLiveCourse: isLive,
      isBlendedCourse: isBlended,
      highlights: typedProps.highlights || course.highlights || []
    };
  }, [formatCourseDuration, getBlendedCourseSessions]);
  
  const renderLiveCourse = useCallback((course: ICourse): ICourse => ({
    ...course,
    class_type: "live",
    courseType: 'live',
    cardStyle: 'live',
    isLiveCourse: true,
    isBlendedCourse: false,
    course_duration: formatCourseDuration(course.course_duration as string),
    effort_hours: course.effort_hours || "6-8",
    no_of_Sessions: course.no_of_Sessions || 24,
    instructor: course.instructor || null,
    highlights: [
      "Live interactive sessions",
      "Real-world projects",
      ...(course.highlights || [])
    ]
  }), [formatCourseDuration]);
  
  const renderBlendedCourse = useCallback((course: ICourse): ICourse => {
    const { videoCount } = getBlendedCourseSessions(course);
    return {
      ...course,
      class_type: "blended",
      courseType: 'blended',
      cardStyle: 'blended',
      isLiveCourse: false,
      isBlendedCourse: true,
      course_duration: formatCourseDuration(course.course_duration as string || course.duration),
      duration_range: `${videoCount} Videos • 2 Q&A • ${course.duration_range || "Self-paced"}`,
      no_of_Sessions: course.no_of_Sessions || videoCount,
      effort_hours: course.effort_hours || "3-5",
      highlights: [
        "Self-paced learning",
        "Interactive content",
        ...(course.highlights || [])
      ]
    };
  }, [getBlendedCourseSessions, formatCourseDuration]);

  const CoursePreloader = () => (
    <div className="flex h-96 items-center justify-center">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-700"></div>
        <div className="w-12 h-12 rounded-full border-2 border-transparent border-t-purple-500 animate-spin absolute top-0 left-0"></div>
      </div>
    </div>
  );

  return (
    <PageWrapper>
    <div className="min-h-screen bg-white dark:bg-gray-950 relative overflow-hidden">
      {/* Moving Gradient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="moving-gradient-bg"></div>
      </div>
      
      {/* Courses Section - Edge to Edge */}
      <section className="w-full relative z-10">
        <div className="w-full">
          <Suspense fallback={<CoursePreloader />}>
            {isClient && activeTab === "all" && (
              <CoursesFilter 
                CustomText="All Courses"
                hideSearch={false}
                description="Everything you need to level up your skills"
                renderCourse={renderAllCourse}
                scrollToTop={false}
                fixedCategory=""
                hideCategoryFilter={false}
                availableCategories={[]}
                categoryTitle="Categories"
                hideCategories={false}
                CustomButton={ExploreAllButton}
              />
            )}
            
            {isClient && activeTab === "live" && (
              <CoursesFilter 
                CustomText="Live Courses"
                hideSearch={false}
                description="Real-time learning with expert instructors"
                renderCourse={renderLiveCourse}
                scrollToTop={false}
                fixedCategory=""
                hideCategoryFilter={false}
                availableCategories={[]}
                categoryTitle="Categories"
                hideCategories={false}
                classType="live"
                CustomButton={ViewScheduleButton}
              />
            )}
            
            {isClient && activeTab === "blended" && (
              <CoursesFilter 
                CustomText="Blended Learning"
                hideSearch={false}
                hideGradeFilter={true}
                description="Self-paced with live support sessions"
                renderCourse={renderBlendedCourse}
                scrollToTop={false}
                fixedCategory=""
                hideCategoryFilter={false}
                availableCategories={[]}
                categoryTitle="Categories"
                hideCategories={false}
                classType="blended"
                CustomButton={StartLearningButton}
              />
            )}

            {!isClient && <CoursePreloader />}
            </Suspense>
        </div>
      </section>

      {/* Minimalist Features Section - Edge to Edge */}
      <section className="w-full py-0 bg-gray-50 dark:bg-gray-900/50 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* The features section has been removed as per the user's request. */}
          </div>
        </div>
      </section>
    </div>
    </PageWrapper>
  );
};

export default React.memo(Courses);
