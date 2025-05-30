"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import Link from "next/link";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import { useInView } from "react-intersection-observer";
import { useMediaQuery } from "@/hooks";
import { useLocalStorage } from "@/hooks";
import { formatDuration, formatDate, formatDistanceToNow } from "@/utils/format";
import useCourseLesson from "@/hooks/useCourseLesson.hook";
import Image from "next/image";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

// Import icons from lucide-react
import {
  BookOpen,
  FileText,
  HelpCircle,
  Clock,
  ChevronLeft,
  Download,
  Menu,
  CheckCircle,
  ChevronUp,
  Play,
  Loader,
  AlertCircle,
  Calendar,
  Users,
  Clock3,
  WifiOff,
  RefreshCw,
  Star,
  Eye,
  UserCheck,
  BookOpenCheck,
  GraduationCap,
  Award,
  FileQuestion,
  ClipboardList,
  Video,
  FileText as FileIcon,
  DollarSign,
  Globe,
  FileBox,
  Timer,
  ChevronRight,
  Beaker,
  Brain,
  Code2,
  Cpu,
  Database,
  FlaskConical,
  Microscope,
  Target,
  Users2,
  ChevronDown,
  FileUp,
  Link2,
  ExternalLink,
  Pause,
  Volume2,
  Minimize2,
  Maximize2,
  Search,
  Circle,
  MoreVertical,
  ThumbsUp,
  MessageCircle,
  MessageSquare,
  User,
  Lock,
  FileWarning,
  Bookmark,
  Share2,
  BookmarkPlus,
  X,
  Plus,
  Minus,
  RotateCcw,
  FastForward,
  Rewind
} from "lucide-react";

// ----------------------
// Utility & Helper Types
// ----------------------
interface CourseMeta {
  views: number;
  ratings: { average: number; count: number };
  enrollments: number;
}

interface Price {
  currency: string;
  individual: number;
  batch: number;
  min_batch_size: number;
  max_batch_size: number;
  early_bird_discount: number;
  group_discount: number;
  is_active: boolean;
}

interface FAQ {
  question: string;
  answer: string;
}

interface ToolTechnology {
  name: string;
  category: string;
  description: string;
  logo_url: string;
}

interface Lesson {
  _id: string;
  title: string;
  duration: string;
  completed?: boolean;
  type?: string;
  lessonType?: string;
  description?: string;
  status?: string;
  is_completed?: boolean;
}

interface Section {
  _id: string;
  title: string;
  lessons: Lesson[];
  description?: string;
}

interface Week {
  _id: string;
  weekTitle: string;
  sections: Section[];
  lessons?: Lesson[];
  weekDescription?: string;
}

interface CourseDescription {
  program_overview: string;
  benefits: string;
  learning_objectives: string[];
  course_requirements: string[];
  target_audience: string[];
}

interface CourseData {
  _id: string;
  course_title: string;
  course_description: CourseDescription | string;
  curriculum: Week[];
  prices: Price[];
  tools_technologies: ToolTechnology[];
  faqs: FAQ[];
  course_image?: string;
  course_category?: string;
  course_duration?: string;
  course_tag?: string;
  meta?: CourseMeta;
  no_of_Sessions?: number;
  class_type?: string;
  course_grade?: string;
  course_level?: string;
  is_Certification?: string;
  is_Assignments?: string;
  is_Projects?: string;
  is_Quizes?: string;
  isFree?: boolean;
  min_hours_per_week?: number;
  max_hours_per_week?: number;
  efforts_per_Week?: string;
}

// ----------------------
// Reusable Components
// ----------------------

const CourseMetrics: React.FC<{ meta: CourseMeta }> = ({ meta }) => {
  if (!meta) return null;
  const metrics = [
    { icon: Eye, label: "views", value: meta.views.toLocaleString() },
    { icon: Star, label: "rating", value: `${meta.ratings.average} (${meta.ratings.count})` },
    { icon: UserCheck, label: "enrolled", value: meta.enrollments },
  ];
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-300"
        >
          <metric.icon className={clsx("w-4 h-4", metric.label === "rating" && "text-yellow-400")} />
          <span>{metric.value} {metric.label}</span>
        </motion.div>
      ))}
    </div>
  );
};

const CoursePricing: React.FC<{ prices: Price[] }> = ({ prices }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  if (!prices?.length) return null;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-6"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <DollarSign className="w-5 h-5 mr-2" />
        Pricing Options
      </h3>
      <div className="space-y-4">
        {prices.map((price, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: index * 0.1 }}
            className="border-b last:border-0 pb-4 last:pb-0"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                {price.currency}
              </span>
              <span className="text-lg font-bold text-primaryColor">
                {price.currency} {price.individual}
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <div className="flex items-center">
                <Users className="w-3 h-3 mr-2" />
                Batch price: {price.currency} {price.batch}
                <span className="ml-2 text-xs text-gray-500">
                  (min: {price.min_batch_size}, max: {price.max_batch_size})
                </span>
              </div>
              {price.early_bird_discount > 0 && (
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-2" />
                  Early bird discount: {price.early_bird_discount}% off
                </div>
              )}
              {price.group_discount > 0 && (
                <div className="flex items-center">
                  <Users className="w-3 h-3 mr-2" />
                  Group discount: {price.group_discount}% off
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const LoadingState: React.FC<{ message?: string; description?: string }> = ({
  message = "Loading...",
  description,
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 mx-auto"
      >
        <Loader className="w-full h-full text-primaryColor" />
      </motion.div>
      <div className="space-y-2">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">{message}</h2>
        {description && <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>}
      </div>
    </div>
  </div>
);

// ----------------------
// Tab Content Components
// ----------------------

interface MainContentProps {
  lessonData: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  courseData?: any;
}

// Add a new utility function to safely handle image URLs
const getSafeImageUrl = (url: string | undefined): string => {
  if (!url) return '';
  // If it's already a relative URL, return as is
  if (url.startsWith('/')) return url;
  // Check if it's a URL with a proper protocol
  try {
    new URL(url);
    return url;
  } catch (e) {
    // If it's not a valid URL, return an empty string
    console.error(`Invalid image URL: ${url}`);
    return '';
  }
};

const CourseIntroduction = ({ 
  courseData, 
  navigateToLesson, 
  findFirstLesson 
}: { 
  courseData: any; 
  navigateToLesson: (lessonId: string) => void; 
  findFirstLesson: (courseData: any) => string | null;
}) => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [techCategoryFilter, setTechCategoryFilter] = useState<string | null>(null);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set([0])); // First week open by default
  
  // Extract all unique technology categories
  const techCategories = useMemo(() => {
    if (!courseData?.tools_technologies?.length) return [];
    return Array.from(new Set(courseData.tools_technologies.map((tech: any) => tech.category))) as string[];
  }, [courseData]);

  // Filter technologies by category
  const filteredTech = useMemo(() => {
    if (!courseData?.tools_technologies) return [];
    if (!techCategoryFilter) return courseData.tools_technologies;
    return courseData.tools_technologies.filter((tech: any) => tech.category === techCategoryFilter);
  }, [courseData, techCategoryFilter]);

  // Check if the course has any lessons in its curriculum
  const hasLessons = useMemo(() => {
    if (!courseData?.curriculum || !Array.isArray(courseData.curriculum) || courseData.curriculum.length === 0) {
      return false;
    }
    
    // Check if there are any weeks with direct lessons or sections with lessons
    return courseData.curriculum.some((week: any) => {
      // Check for direct lessons in the week
      const hasWeekLessons = Array.isArray(week.lessons) && week.lessons.length > 0;
      
      // Check for sections with lessons
      const hasSectionLessons = Array.isArray(week.sections) && 
        week.sections.some((section: any) => 
          Array.isArray(section.lessons) && section.lessons.length > 0
        );
      
      return hasWeekLessons || hasSectionLessons;
    });
  }, [courseData]);

  if (!courseData) return null;

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };
  
  const toggleWeek = (weekIndex: number) => {
    setExpandedWeeks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(weekIndex)) {
        newSet.delete(weekIndex);
      } else {
        newSet.add(weekIndex);
      }
      return newSet;
    });
  };

  // Format duration helper
  const formatDurationDisplay = (duration: any) => {
    if (!duration) return "N/A";
    if (typeof duration === "string") return duration;
    
    // If it's in minutes
    if (typeof duration === "number") {
      if (duration < 60) return `${duration} min`;
      const hours = Math.floor(duration / 60);
      const mins = duration % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    
    return "N/A";
  };
  
  // Navigate to a specific lesson using the provided callback
  const handleLessonSelect = (lesson: any) => {
    if (lesson?._id || lesson?.id) {
      const lessonId = lesson._id || lesson.id;
      const id = typeof lessonId === 'object' ? lessonId.$oid : lessonId;
      navigateToLesson(id);
    }
  };

  // Function to safely extract course ID 
  const getCourseId = () => {
    if (!courseData._id) return '';
    return typeof courseData._id === 'object' ? courseData._id.$oid : courseData._id;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Course Header */}
      <div className="mb-12 space-y-5 max-w-3xl">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-primaryColor/10 text-primaryColor rounded-full text-sm font-medium">
            {courseData.course_category || courseData.category_type || "Course"}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            <Clock className="w-4 h-4 mr-1.5" />
            {courseData.course_duration || courseData.session_duration || "Self-paced"}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            <BookOpen className="w-4 h-4 mr-1.5" />
            {courseData.no_of_Sessions || (courseData.curriculum && Array.isArray(courseData.curriculum) ? courseData.curriculum.length : 0) || "Multiple"} sessions
          </span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
          {courseData.course_title}
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl">
          {courseData.course_tag || (typeof courseData.course_description === 'object' && courseData.course_description?.subtitle) || "Master new skills with hands-on practice"}
        </p>
      </div>

      {/* Course Metrics */}
      {courseData.meta && (
        <div className="mb-14 grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
          <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full mb-3">
              <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {(courseData.meta.views || 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Views</div>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full mb-3">
              <Star className="w-6 h-6 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {courseData.meta.ratings ? courseData.meta.ratings.average.toFixed(1) : '0'} ({courseData.meta.ratings ? courseData.meta.ratings.count : '0'})
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Avg. Rating</div>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
            <div className="p-3 bg-teal-100 dark:bg-teal-900/20 rounded-full mb-3">
              <UserCheck className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {(courseData.meta.enrollments || 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Students Enrolled</div>
          </div>
        </div>
      )}

      {/* Course Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-10">
          {/* Program Overview */}
          <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <BookOpenCheck className="w-6 h-6 mr-3 text-primaryColor" />
              Program Overview
            </h2>
            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
              <p>{(() => {
                if (typeof courseData.course_description === 'string') {
                  return courseData.course_description;
                } else if (typeof courseData.course_description === 'object') {
                  return courseData.course_description?.program_overview || "This comprehensive course is designed to give you a solid foundation in this subject area.";
                } else {
                  return "This comprehensive course is designed to give you a solid foundation in this subject area.";
                }
              })()}</p>
            </div>
          </section>
          
          {/* Complete Curriculum */}
          {courseData.curriculum && Array.isArray(courseData.curriculum) && courseData.curriculum.length > 0 ? (
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <BookOpen className="w-6 h-6 mr-3 text-primaryColor" />
                Course Curriculum
              </h2>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
                {courseData.curriculum.map((week: any, weekIndex: number) => (
                  <div key={`week-${weekIndex}`} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    {/* Week Header */}
                    <button 
                      onClick={() => toggleWeek(weekIndex)}
                      className="w-full flex items-center justify-between p-5 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primaryColor/10 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-primaryColor" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-medium text-gray-900 dark:text-white text-lg">{week.weekTitle || `Week ${weekIndex + 1}`}</h3>
                          {week.weekDescription && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{week.weekDescription}</p>
                          )}
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${expandedWeeks.has(weekIndex) ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Week Content - Sections and Lessons */}
                    <AnimatePresence>
                      {expandedWeeks.has(weekIndex) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden bg-gray-50 dark:bg-gray-900/50"
                        >
                          {/* Direct Lessons in the Week (if any) */}
                          {Array.isArray(week.lessons) && week.lessons.length > 0 && (
                            <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
                              {week.lessons.map((lesson: any, lessonIndex: number) => {
                                const lessonId = lesson._id || lesson.id;
                                const isCompleted = lesson.is_completed || lesson.completed;
                                const isLocked = lesson.status === "locked";
                                
                                return (
                                  <div key={`direct-lesson-${weekIndex}-${lessonIndex}`} className="p-5 pl-16 hover:bg-white dark:hover:bg-gray-800/70 transition-colors">
                                    <button 
                                      onClick={() => handleLessonSelect(lesson)}
                                      disabled={isLocked}
                                      className={`w-full flex items-start gap-4 text-left group ${isLocked ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    >
                                      <div className={`w-6 h-6 mt-0.5 rounded-full flex-shrink-0 flex items-center justify-center transition-colors ${
                                        isCompleted 
                                          ? 'bg-green-500 text-white' 
                                          : isLocked 
                                            ? 'bg-gray-300 dark:bg-gray-600' 
                                            : 'bg-primaryColor/10 group-hover:bg-primaryColor/20'
                                      }`}>
                                        {isCompleted ? (
                                          <CheckCircle className="w-3.5 h-3.5" />
                                        ) : isLocked ? (
                                          <Lock className="w-3.5 h-3.5" />
                                        ) : (
                                          <Play className="w-3.5 h-3.5 text-primaryColor ml-0.5" />
                                        )}
                                      </div>
                                      
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                          <div>
                                            <h5 className="font-medium text-gray-900 dark:text-white text-sm group-hover:text-primaryColor transition-colors">{lesson.title}</h5>
                                            {lesson.description && (
                                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{lesson.description}</p>
                                            )}
                                          </div>
                                          {(lesson.duration || lesson.type || lesson.lessonType) && (
                                            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                                              {lesson.duration && (
                                                <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-full text-gray-600 dark:text-gray-300 flex items-center">
                                                  <Clock className="w-3 h-3 mr-1" />
                                                  {formatDurationDisplay(lesson.duration)}
                                                </span>
                                              )}
                                              {(lesson.type || lesson.lessonType) && (
                                                <span className="text-xs capitalize bg-primaryColor/10 px-2.5 py-1 rounded-full text-primaryColor flex items-center">
                                                  {(lesson.type || lesson.lessonType) === "video" ? (
                                                    <Video className="w-3 h-3 mr-1" />
                                                  ) : (lesson.type || lesson.lessonType) === "quiz" ? (
                                                    <FileQuestion className="w-3 h-3 mr-1" />
                                                  ) : (lesson.type || lesson.lessonType) === "assignment" || (lesson.type || lesson.lessonType) === "assessment" ? (
                                                    <ClipboardList className="w-3 h-3 mr-1" />
                                                  ) : (
                                                    <FileText className="w-3 h-3 mr-1" />
                                                  )}
                                                  {lesson.type || lesson.lessonType}
                                                </span>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          
                          {/* Sections and their Lessons */}
                          {Array.isArray(week.sections) && week.sections.length > 0 && week.sections.map((section: any, sectionIndex: number) => (
                            <div key={`section-${weekIndex}-${sectionIndex}`} className="border-t border-gray-100 dark:border-gray-800/50">
                              {/* Section Header */}
                              <div className="p-5 pl-16 bg-gray-50/70 dark:bg-gray-800/30">
                                <h4 className="font-medium text-gray-800 dark:text-gray-200 text-base">{section.title}</h4>
                                {section.description && (
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">{section.description}</p>
                                )}
                              </div>
                              
                              {/* Section Lessons */}
                              {Array.isArray(section.lessons) && section.lessons.length > 0 && (
                                <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
                                  {section.lessons.map((lesson: any, lessonIndex: number) => {
                                    const lessonId = lesson._id || lesson.id;
                                    const isCompleted = lesson.is_completed || lesson.completed;
                                    const isLocked = lesson.status === "locked";
                                    
                                    return (
                                      <div key={`lesson-${weekIndex}-${sectionIndex}-${lessonIndex}`} className="p-5 pl-20 hover:bg-white dark:hover:bg-gray-800/70 transition-colors">
                                        <button 
                                          onClick={() => handleLessonSelect(lesson)}
                                          disabled={isLocked}
                                          className={`w-full flex items-start gap-4 text-left group ${isLocked ? 'opacity-60 cursor-not-allowed' : ''}`}
                                        >
                                          <div className={`w-6 h-6 mt-0.5 rounded-full flex-shrink-0 flex items-center justify-center transition-colors ${
                                            isCompleted 
                                              ? 'bg-green-500 text-white' 
                                              : isLocked 
                                                ? 'bg-gray-300 dark:bg-gray-600' 
                                                : 'bg-primaryColor/10 group-hover:bg-primaryColor/20'
                                          }`}>
                                            {isCompleted ? (
                                              <CheckCircle className="w-3.5 h-3.5" />
                                            ) : isLocked ? (
                                              <Lock className="w-3.5 h-3.5" />
                                            ) : (
                                              <Play className="w-3.5 h-3.5 text-primaryColor ml-0.5" />
                                            )}
                                          </div>
                                          
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                              <div>
                                                <h5 className="font-medium text-gray-900 dark:text-white text-sm group-hover:text-primaryColor transition-colors">{lesson.title}</h5>
                                                {lesson.description && (
                                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{lesson.description}</p>
                                                )}
                                              </div>
                                              {(lesson.duration || lesson.type || lesson.lessonType) && (
                                                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                                                  {lesson.duration && (
                                                    <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-full text-gray-600 dark:text-gray-300 flex items-center">
                                                      <Clock className="w-3 h-3 mr-1" />
                                                      {formatDurationDisplay(lesson.duration)}
                                                    </span>
                                                  )}
                                                  {(lesson.type || lesson.lessonType) && (
                                                    <span className="text-xs capitalize bg-primaryColor/10 px-2.5 py-1 rounded-full text-primaryColor flex items-center">
                                                      {(lesson.type || lesson.lessonType) === "video" ? (
                                                        <Video className="w-3 h-3 mr-1" />
                                                      ) : (lesson.type || lesson.lessonType) === "quiz" ? (
                                                        <FileQuestion className="w-3 h-3 mr-1" />
                                                      ) : (lesson.type || lesson.lessonType) === "assignment" || (lesson.type || lesson.lessonType) === "assessment" ? (
                                                        <ClipboardList className="w-3 h-3 mr-1" />
                                                      ) : (
                                                        <FileText className="w-3 h-3 mr-1" />
                                                      )}
                                                      {lesson.type || lesson.lessonType}
                                                    </span>
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          ))}
                          
                          {/* Show message if neither direct lessons nor sections with lessons are found */}
                          {(!Array.isArray(week.lessons) || week.lessons.length === 0) && 
                           (!Array.isArray(week.sections) || week.sections.length === 0 || 
                            !week.sections.some((section: any) => Array.isArray(section.lessons) && section.lessons.length > 0)) && (
                            <div className="p-8 text-center">
                              <FileQuestion className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                              <p className="text-gray-500 dark:text-gray-400">No lessons available in this section yet</p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm text-center">
              <FileQuestion className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">Course Curriculum Coming Soon</h3>
              <p className="text-gray-500 dark:text-gray-400">The curriculum for this course is currently being developed. Check back soon!</p>
            </section>
          )}
          
          {/* FAQ Section */}
          {courseData.faqs && Array.isArray(courseData.faqs) && courseData.faqs.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <HelpCircle className="w-6 h-6 mr-3 text-primaryColor" />
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-4">
                {courseData.faqs.map((faq: any, index: number) => (
                  <div 
                    key={index} 
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="flex justify-between items-center w-full p-6 text-left focus:outline-none"
                    >
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white pr-8">{faq.question}</h3>
                      <div className={`transition-transform duration-300 ${expandedFaq === index ? 'rotate-180' : ''}`}>
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      </div>
                    </button>
                    
                    <AnimatePresence>
                      {expandedFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 pt-0 border-t border-gray-100 dark:border-gray-700">
                            <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Tools & Technologies */}
          {courseData.tools_technologies && Array.isArray(courseData.tools_technologies) && courseData.tools_technologies.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <Code2 className="w-6 h-6 mr-3 text-primaryColor" />
                Tools & Technologies
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {courseData.tools_technologies.map((tech: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm flex flex-col"
                  >
                    <div className="flex items-center mb-4">
                      {tech.logo_url ? (
                        <div className="w-12 h-12 mr-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          {getSafeImageUrl(tech.logo_url) ? (
                            <Image 
                              src={getSafeImageUrl(tech.logo_url)} 
                              alt={tech.name} 
                              width={40} 
                              height={40} 
                              className="object-contain"
                              onError={(e) => {
                                // Fallback to the default icon if image fails to load
                                e.currentTarget.style.display = 'none';
                                // We'll show the fallback icon that's in the next div
                              }}
                            />
                          ) : (
                            <Code2 className="w-6 h-6 text-primaryColor" />
                          )}
                        </div>
                      ) : (
                        <div className="w-12 h-12 mr-4 rounded-lg bg-primaryColor/10 flex items-center justify-center">
                          <Code2 className="w-6 h-6 text-primaryColor" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{tech.name}</h3>
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-300">
                          {tech.category}
                        </span>
                      </div>
                    </div>
                    {tech.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 flex-1">{tech.description}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </div>
        
        {/* Sidebar - Right Column */}
        <div className="lg:sticky lg:top-6 h-fit">
          <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm">
            {/* Course Image */}
            {courseData.course_image && (
              <div className="aspect-video relative overflow-hidden">
                <Image
                  src={courseData.course_image}
                  alt={courseData.course_title}
                  fill
                  className="object-cover"
                />
                {courseData.isFree && (
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Free Course
                  </div>
                )}
              </div>
            )}
            
            {/* Course Details */}
            <div className="p-6 space-y-5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Course Details</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {courseData.course_duration || "Self-paced"}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Sessions:</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {courseData.no_of_Sessions || (courseData.curriculum && Array.isArray(courseData.curriculum) ? courseData.curriculum.length : 0) || "Multiple"}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Effort:</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {courseData.min_hours_per_week && courseData.max_hours_per_week 
                      ? `${courseData.min_hours_per_week}-${courseData.max_hours_per_week} hours/week`
                      : courseData.efforts_per_Week || "Flexible"}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Class type:</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {courseData.class_type || "Online"}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Level:</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {courseData.course_grade || courseData.course_level || "All levels"}
                  </span>
                </div>
                
                {courseData.is_Certification && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Certification:</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {courseData.is_Certification === "yes" || courseData.is_Certification === "Yes" ? "Included" : "Not included"}
                    </span>
                  </div>
                )}
                
                {courseData.is_Assignments && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Assignments:</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {courseData.is_Assignments === "yes" || courseData.is_Assignments === "Yes" ? "Included" : "Not included"}
                    </span>
                  </div>
                )}
                
                {courseData.is_Projects && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Projects:</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {courseData.is_Projects === "yes" || courseData.is_Projects === "Yes" ? "Included" : "Not included"}
                    </span>
                  </div>
                )}
                
                {courseData.is_Quizes && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Quizzes:</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {courseData.is_Quizes === "yes" || courseData.is_Quizes === "Yes" ? "Included" : "Not included"}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Start Course Button */}
            <div className="p-6 pt-0">
              <button
                onClick={() => {
                  const firstLesson = findFirstLesson(courseData);
                  if (firstLesson && typeof window !== 'undefined') {
                    // Navigate to the first lesson
                    const courseId = getCourseId();
                    window.location.href = `/integrated-lessons/${courseId}/lecture/${firstLesson}`;
                  } else {
                    // If no lesson found, just stay on the current page
                    toast.info("No lessons available yet. The course curriculum is still being developed.");
                  }
                }}
                className={`w-full py-4 px-6 ${
                  hasLessons ? 'bg-primaryColor hover:bg-primaryColor/90' : 'bg-gray-400 hover:bg-gray-500'
                } text-white rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 font-medium text-base`}
              >
                <Play className="w-5 h-5" />
                {hasLessons ? "Start Learning" : "Coming Soon"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MainContent: React.FC<MainContentProps> = ({ lessonData, activeTab, setActiveTab, courseData }) => {
  const router = useRouter();
  
  // If no lesson data is available, show course introduction
  if (!lessonData && courseData) {
    // Define required functions
    const navigateToLesson = (lessonId: string) => {
      if (!lessonId) return;
      const id = courseData._id || courseData.id;
      router.push(`/integrated-lessons/${id}/lecture/${lessonId}`);
    };
    
    const findFirstLesson = (courseData: any): string | null => {
      if (!courseData) return null;
      
      // Some courses may not have a curriculum property or it might be empty
      if (!courseData.curriculum || !Array.isArray(courseData.curriculum) || courseData.curriculum.length === 0) {
        console.log("No curriculum found in course data");
        return null;
      }
      
      // Loop through each week/item in the curriculum
      for (const week of courseData.curriculum) {
        // Case 1: Check for direct lessons in the week
        if (Array.isArray(week.lessons) && week.lessons.length > 0) {
          const firstLesson = week.lessons[0];
          const lessonId = firstLesson._id || firstLesson.id;
          if (lessonId) {
            console.log("Found lesson directly in week:", lessonId);
            return typeof lessonId === 'object' ? lessonId.$oid : lessonId;
          }
        }
        
        // Case 2: Check for sections with lessons
        if (Array.isArray(week.sections) && week.sections.length > 0) {
          for (const section of week.sections) {
            if (Array.isArray(section.lessons) && section.lessons.length > 0) {
              const firstLesson = section.lessons[0];
              const lessonId = firstLesson._id || firstLesson.id;
              if (lessonId) {
                console.log("Found lesson in section:", lessonId);
                return typeof lessonId === 'object' ? lessonId.$oid : lessonId;
              }
            }
          }
        }
      }
      
      console.log("No lessons found in curriculum");
      return null;
    };
    
    return (
      <CourseIntroduction 
        courseData={courseData} 
        navigateToLesson={navigateToLesson} 
        findFirstLesson={findFirstLesson}
      />
    );
  }

  return (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
    <div className="flex gap-6 border-b border-gray-200 dark:border-gray-700">
      {["Overview", "Resources", "Notes", "Discussion"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={clsx(
            "pb-4 text-sm font-medium transition-colors relative",
            activeTab === tab ? "text-primaryColor" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
          )}
        >
          {tab}
          {activeTab === tab && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primaryColor"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>

    <div className="mt-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "Overview" && <OverviewTab lessonData={lessonData} />}
          {activeTab === "Resources" && <ResourcesTab resources={lessonData?.resources} />}
          {activeTab === "Notes" && <NotesTab lessonId={lessonData?._id} />}
          {activeTab === "Discussion" && <DiscussionTab lessonId={lessonData?._id} />}
        </motion.div>
      </AnimatePresence>
    </div>
  </div>
);
};

const OverviewTab: React.FC<{ lessonData: any }> = ({ lessonData }) => (
  <div className="space-y-6">
    <div className="prose dark:prose-invert max-w-none">
      {lessonData?.description || "No description available."}
    </div>
    {lessonData?.learning_objectives?.length > 0 && (
      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-primaryColor" />
          Learning Objectives
        </h3>
        <ul className="space-y-3">
          {lessonData.learning_objectives.map((objective: string, index: number) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3"
            >
              <div className="w-6 h-6 rounded-full bg-primaryColor/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-primaryColor" />
              </div>
              <span className="text-gray-600 dark:text-gray-300">{objective}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

const ResourcesTab: React.FC<{ resources: any[] }> = ({ resources }) => (
  <div className="space-y-4">
    <AnimatePresence>
      {resources?.map((resource, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-start p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl group hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all"
        >
          <div className="flex-shrink-0">
            <div
              className={clsx(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                resource.type === "pdf" && "bg-red-50 dark:bg-red-900/20",
                resource.type === "video" && "bg-blue-50 dark:bg-blue-900/20",
                resource.type === "code" && "bg-purple-50 dark:bg-purple-900/20",
                resource.type === "link" && "bg-green-50 dark:bg-green-900/20"
              )}
            >
              {resource.type === "pdf" && <FileText className="w-6 h-6 text-red-500" />}
              {resource.type === "video" && <Video className="w-6 h-6 text-blue-500" />}
              {resource.type === "code" && <Code2 className="w-6 h-6 text-purple-500" />}
              {resource.type === "link" && <Link2 className="w-6 h-6 text-green-500" />}
            </div>
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-primaryColor transition-colors">
                {resource.title}
              </h4>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300">
                {resource.type.toUpperCase()}
              </span>
            </div>
            {resource.description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {resource.description}
              </p>
            )}
            <div className="mt-3 flex items-center gap-4">
              <motion.a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-primaryColor hover:text-primaryColor/80"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {resource.type === "link" ? "Visit Resource" : "Download"}
                <ExternalLink className="w-4 h-4 ml-1" />
              </motion.a>
              {resource.size && (
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <FileBox className="w-4 h-4 mr-1" />
                  {resource.size}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
    {(!resources || resources.length === 0) && (
      <div className="text-center py-12">
        <FileQuestion className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">No resources available for this lesson</p>
      </div>
    )}
  </div>
);

const NotesTab: React.FC<{ lessonId: string }> = ({ lessonId }) => {
  const [notes, setNotes] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`lesson-${lessonId}-notes`);
    if (saved) setNotes(saved);
  }, [lessonId]);

  const debouncedSave = useCallback(
    debounce((value: string) => {
      setIsSaving(true);
      localStorage.setItem(`lesson-${lessonId}-notes`, value);
      setTimeout(() => setIsSaving(false), 1000);
    }, 1000),
    [lessonId]
  );

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    debouncedSave(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Your Notes</h3>
        {isSaving && (
          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw className="w-4 h-4 mr-1" />
            </motion.div>
            Saving...
          </span>
        )}
      </div>
      <textarea
        value={notes}
        onChange={handleNotesChange}
        placeholder="Take notes for this lesson..."
        className="w-full h-64 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30 border-none focus:ring-2 focus:ring-primaryColor resize-none"
      />
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Notes are saved automatically and stored locally in your browser.
      </p>
    </div>
  );
};

const DiscussionTab: React.FC<{ lessonId: string }> = ({ lessonId }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");

  const handleSubmitComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const comment = {
      id: Date.now(),
      text: newComment,
      author: "You",
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: [],
    };
    setComments([comment, ...comments]);
    setNewComment("");
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmitComment} className="space-y-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts or ask a question..."
          className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30 border-none focus:ring-2 focus:ring-primaryColor resize-none"
          rows={3}
        />
        <div className="flex justify-end">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-primaryColor/90 transition-colors"
          >
            Post Comment
          </motion.button>
        </div>
      </form>
      <div className="space-y-4">
        {comments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primaryColor/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primaryColor" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{comment.author}</h4>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(comment.timestamp))} ago
                  </p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-500">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-3 text-gray-600 dark:text-gray-300">{comment.text}</p>
            <div className="mt-4 flex items-center gap-4 text-sm">
              <button className="flex items-center gap-1 text-gray-500 hover:text-primaryColor">
                <ThumbsUp className="w-4 h-4" />
                {comment.likes}
              </button>
              <button className="flex items-center gap-1 text-gray-500 hover:text-primaryColor">
                <MessageCircle className="w-4 h-4" />
                Reply
              </button>
            </div>
          </motion.div>
        ))}
        {comments.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ----------------------
// Sidebar (Lesson Accordion) Component
// ----------------------

interface CourseSidebarProps {
  courseData: CourseData;
  currentLessonId: string;
  onLessonSelect: (lesson: any) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({
  courseData,
  currentLessonId,
  onLessonSelect,
  searchTerm,
  onSearchChange,
}) => {
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set());

  const toggleWeek = (weekId: string) => {
    setExpandedWeeks((prev) => {
      const updated = new Set(prev);
      updated.has(weekId) ? updated.delete(weekId) : updated.add(weekId);
      return updated;
    });
  };

  // Filter curriculum based on search term
  const filteredCurriculum = useMemo(() => {
    if (!searchTerm) return courseData?.curriculum;
    return courseData?.curriculum?.map((week) => ({
      ...week,
      sections: week.sections
        .map((section) => ({
          ...section,
          lessons: section.lessons.filter((lesson) =>
            lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
          ),
        }))
        .filter((section) => section.lessons.length > 0),
    })).filter((week) => week.sections.some((section) => section.lessons.length > 0));
  }, [courseData.curriculum, searchTerm]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <input
            type="text"
            placeholder="Search lessons..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 border-none focus:ring-2 focus:ring-primaryColor"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Course Progress</span>
          <span className="text-sm font-medium text-primaryColor">75%</span>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "75%" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-primaryColor rounded-full"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {filteredCurriculum?.map((week, weekIndex) => (
            <motion.div
              key={week._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: weekIndex * 0.1 }}
              className="border-b border-gray-200 dark:border-gray-700 last:border-0"
            >
              <button
                onClick={() => toggleWeek(week._id)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primaryColor/10 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-primaryColor" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900 dark:text-white">{week.weekTitle}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {week.sections.reduce((acc, section) => acc + section.lessons.length, 0)} lessons
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={clsx("w-5 h-5 text-gray-400 transition-transform", expandedWeeks.has(week._id) && "rotate-180")}
                />
              </button>
              <AnimatePresence>
                {expandedWeeks.has(week._id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    {week.sections.map((section) => (
                      <div key={section._id} className="pl-4">
                        <div className="py-2 px-4">
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{section.title}</h4>
                        </div>
                        {section.lessons.map((lesson) => (
                          <button
                            key={lesson._id}
                            onClick={() => onLessonSelect(lesson)}
                            className={clsx(
                              "w-full px-4 py-2 flex items-center gap-3 text-left transition-colors",
                              lesson._id === currentLessonId
                                ? "bg-primaryColor/10 text-primaryColor"
                                : "hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300"
                            )}
                          >
                            <div className="w-6 h-6 rounded-full flex items-center justify-center">
                              {lesson.completed ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : lesson._id === currentLessonId ? (
                                <Play className="w-4 h-4" />
                              ) : (
                                <Circle className="w-4 h-4" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="truncate text-sm">{lesson.title}</p>
                              <p className="text-xs text-gray-400">{formatDuration(lesson.duration)}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
        {filteredCurriculum?.length === 0 && (
          <div className="p-8 text-center">
            <FileQuestion className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No lessons found matching your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ----------------------
// Main Integrated Lesson Component
// ----------------------

interface IntegratedLessonProps {
  params: Promise<{ id: string }>;
}

const IntegratedLesson: React.FC<IntegratedLessonProps> = ({ params }) => {
  const { id } = React.use(params);
  const router = useRouter();

  const [contentOpen, setContentOpen] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");
  const [searchTerm, setSearchTerm] = useState("");

  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const [autoplay, setAutoplay] = useLocalStorage("video-autoplay", true);
  const [quality, setQuality] = useLocalStorage("video-quality", "auto");
  const [playbackSpeed, setPlaybackSpeed] = useLocalStorage("video-speed", 1);

  const [progress, setProgress] = useState(0);
  const [lastPosition, setLastPosition] = useState(0);

  // Find the first lesson in the curriculum - keep this helper function for navigation
  const findFirstLesson = useCallback((courseData: any): string | null => {
    if (!courseData) return null;
    
    // Some courses may not have a curriculum property or it might be empty
    if (!courseData.curriculum || !Array.isArray(courseData.curriculum) || courseData.curriculum.length === 0) {
      console.log("No curriculum found in course data");
      return null;
    }
    
    // Loop through each week/item in the curriculum
    for (const week of courseData.curriculum) {
      // Case 1: Check for direct lessons in the week
      if (Array.isArray(week.lessons) && week.lessons.length > 0) {
        const firstLesson = week.lessons[0];
        const lessonId = firstLesson._id || firstLesson.id;
        if (lessonId) {
          console.log("Found lesson directly in week:", lessonId);
          return typeof lessonId === 'object' ? lessonId.$oid : lessonId;
        }
      }
      
      // Case 2: Check for sections with lessons
      if (Array.isArray(week.sections) && week.sections.length > 0) {
        for (const section of week.sections) {
          if (Array.isArray(section.lessons) && section.lessons.length > 0) {
            const firstLesson = section.lessons[0];
            const lessonId = firstLesson._id || firstLesson.id;
            if (lessonId) {
              console.log("Found lesson in section:", lessonId);
              return typeof lessonId === 'object' ? lessonId.$oid : lessonId;
            }
          }
        }
      }
    }
    
    console.log("No lessons found in curriculum");
    return null;
  }, []);

  const {
    loading,
    error,
    courseData,
    lessonData,
    handleRetry,
    markLessonComplete,
    getLoading,
    postLoading,
  } = useCourseLesson(id, ''); // Pass empty string instead of currentLessonId

  // Online/offline status handling
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Connection restored");
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.error("No internet connection");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred");
    }
  }, [error]);

  const handleMarkComplete = async () => {
    if (!isOnline) {
      toast.error("No internet connection. Please check your connection and try again.");
      return;
    }
    
    // We don't have a currentLessonId anymore, so this function needs to be adjusted
    toast.error("This action is only available when viewing a lesson.");
    return;
    
    // Previous implementation:
    // if (!currentLessonId) {
    //   toast.error("No lesson selected");
    //   return;
    // }
    // try {
    //   setIsCompleting(true);
    //   await markLessonComplete({
    //     completed_at: new Date().toISOString(),
    //     duration: lastPosition,
    //   });
    //   toast.success("Lesson marked as complete!");
    // } catch (err) {
    //   console.error("Error marking lesson complete:", err);
    //   toast.error("Failed to mark lesson as complete");
    // } finally {
    //   setIsCompleting(false);
    // }
  };

  const handleTimeUpdate = (currentTime: number) => {
    // This function isn't needed in the course intro page
    // We'll keep it but it won't do anything since there's no active lesson
    const newProgress = 0;
    setProgress(newProgress);
    setLastPosition(currentTime);
  };

  const handleLessonSelect = (lesson: any) => {
    if (lesson?._id || lesson?.id) {
      const lessonId = lesson._id || lesson.id;
      // No need to set currentLessonId as we're navigating away
      router.push(`/integrated-lessons/${id}/lecture/${lessonId}`);
    }
  };

  // Update the navigateToLesson function to directly use router navigation
  const navigateToLesson = (lessonId: string) => {
    if (!lessonId) return;
    router.push(`/integrated-lessons/${id}/lecture/${lessonId}`);
  };

  // Only show CourseIntroduction component
    return (
      <PageWrapper> 
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} onRetry={handleRetry} />
      ) : !courseData ? (
        <div className="flex h-full flex-col items-center justify-center p-5">
          <FileWarning className="h-16 w-16 text-red-500" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Course Not Found</h2>
          <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
            We couldn't find the course you're looking for.
          </p>
          <button 
            className="mt-6 px-4 py-2 bg-primaryColor text-white rounded-md hover:bg-primaryColor/90 transition-colors"
            onClick={() => router.push("/courses")}
          >
            Browse Courses
          </button>
        </div>
      ) : (
        <div className="relative flex min-h-screen flex-col">
          {/* Course Introduction Component */}
          <CourseIntroduction
            courseData={courseData}
            navigateToLesson={navigateToLesson}
            findFirstLesson={findFirstLesson}
          />

          {/* Remove VideoPlayer and related components since we don't want to show the first lecture */}
        </div>
      )}
    </div>
    </PageWrapper>
    );
};

const ErrorState = ({ error, onRetry }: { error: any; onRetry: () => void }) => {
  return (
    <div className="flex h-full flex-col items-center justify-center p-5">
      <FileWarning className="h-16 w-16 text-red-500" />
      <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
        {error.type === "not_found" ? "Course Not Found" : "Error Loading Course"}
      </h2>
      <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
        {error.message || "An error occurred while loading the course."}
      </p>
                      <button
        className="mt-6 px-4 py-2 bg-primaryColor text-white rounded-md hover:bg-primaryColor/90 transition-colors"
        onClick={onRetry}
                      >
        Retry
                      </button>
                </div>

  );
};

export default IntegratedLesson;