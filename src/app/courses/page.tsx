"use client";
import { Suspense, useState, useEffect, useMemo, useCallback } from 'react';
import CoursesFilter from "@/components/sections/courses/CoursesFilter";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import { motion } from "framer-motion";
import React from 'react';
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
  course_duration?: string | React.ReactNode;
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

const Courses = () => {
  const cachedState = typeof window !== 'undefined' ? cacheManager.get() : null;
  
  const [activeTab, setActiveTab] = useState<"all" | "live" | "blended">(cachedState?.activeTab || "all");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const stateToCache = { activeTab };
    cacheManager.set(stateToCache);
  }, [activeTab]);

  // Animation variants
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }), []);

  const itemVariants = useMemo(() => ({
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
  }), []);

  // Features with modern icons
  const features = useMemo(() => [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Skill-Focused",
      description: "Learn exactly what you need for your career goals"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Access",
      description: "Study from anywhere, anytime with our platform"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Recognized Certs",
      description: "Get certificates that matter to employers"
    }
  ], []);

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
        course_duration: (
          <div className="flex items-center text-sm">
            <Clock className="w-4 h-4 mr-1 text-rose-500" />
            <span>{formatCourseDuration(course.course_duration as string)}</span>
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
      const { videoCount, qnaSessions } = getBlendedCourseSessions(course);
      
      typedProps = {
        course_duration: (
          <div className="flex items-center text-sm">
            <Clock className="w-4 h-4 mr-1 text-rose-500" />
            <span>{formatCourseDuration(course.course_duration as string || course.duration)}</span>
          </div>
        ),
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
        course_duration: (
          <div className="flex items-center text-sm">
            <Clock className="w-4 h-4 mr-1 text-gray-500" />
            <span>{formatCourseDuration(course.course_duration as string)}</span>
          </div>
        ),
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
    course_duration: (
      <div className="flex items-center text-sm">
        <Clock className="w-4 h-4 mr-1 text-rose-500" />
        <span>{formatCourseDuration(course.course_duration as string)}</span>
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
      course_duration: (
        <div className="flex items-center text-sm">
          <Clock className="w-4 h-4 mr-1 text-rose-500" />
          <span>{formatCourseDuration(course.course_duration as string || course.duration)}</span>
        </div>
      ),
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
      <main className="min-h-screen bg-white dark:bg-gray-950">
        {/* Courses Section */}
        <section className="pb-12">
          <div className="max-w-7xl mx-auto px-4">
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

        {/* Minimalist Features Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-6xl mx-auto px-4">
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
                  className="text-center p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all duration-300"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-6">
                    <div className="text-gray-600 dark:text-gray-400">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
    </PageWrapper>
  );
};

export default React.memo(Courses);
