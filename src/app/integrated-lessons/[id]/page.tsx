"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "react-toastify";
import { useMediaQuery } from "@/hooks";
import { useLocalStorage } from "@/hooks";
import { formatDuration, formatDate, formatDistanceToNow } from "@/utils/format";
import useCourseLesson from "@/hooks/useCourseLesson.hook";
import Image from "next/image";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import CourseCurriculum from "@/components/sections/course-detailed/CourseCurriculum";
import ModernCourseFAQ from "@/components/sections/course-detailed/ModernCourseFAQ";
import CourseTools from "@/components/sections/course-detailed/CourseTools";

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
  Rewind,
  ArrowRight,
  TrendingUp,
  Shield,
  Zap,
  Heart
} from "lucide-react";

// ----------------------
// TypeScript Interfaces
// ----------------------
interface ICourseMeta {
  views: number;
  ratings: { average: number; count: number };
  enrollments: number;
}

interface IPrice {
  currency: string;
  individual: number;
  batch: number;
  min_batch_size: number;
  max_batch_size: number;
  early_bird_discount: number;
  group_discount: number;
  is_active: boolean;
}

interface IFAQ {
  question: string;
  answer: string;
}

interface IToolTechnology {
  name: string;
  category: string;
  description: string;
  logo_url: string;
}

interface ILesson {
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

interface ISection {
  _id: string;
  title: string;
  lessons: ILesson[];
  description?: string;
}

interface IWeek {
  _id: string;
  weekTitle: string;
  sections: ISection[];
  lessons?: ILesson[];
  weekDescription?: string;
}

interface ICourseDescription {
  program_overview: string;
  benefits: string;
  learning_objectives: string[];
  course_requirements: string[];
  target_audience: string[];
}

interface ICourseData {
  _id: string;
  course_title: string;
  course_description: ICourseDescription | string;
  curriculum: IWeek[];
  prices: IPrice[];
  tools_technologies: IToolTechnology[];
  faqs: IFAQ[];
  course_image?: string;
  course_category?: string;
  course_duration?: string;
  course_tag?: string;
  meta?: ICourseMeta;
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
// Utility Components
// ----------------------
const LoadingState: React.FC<{ message?: string; description?: string }> = ({
  message = "Loading...",
  description = "Getting your course ready..."
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
    <div className="text-center space-y-6">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 mx-auto"
      >
        <div className="w-full h-full border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400 rounded-full"></div>
      </motion.div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{message}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </div>
    </div>
  );

const ErrorState: React.FC<{ error: any; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-rose-100 dark:from-gray-900 dark:via-red-900/20 dark:to-pink-900/20">
    <div className="text-center space-y-6 max-w-md px-6">
      <div className="w-20 h-20 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
        <FileWarning className="w-10 h-10 text-red-500" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {error.type === "not_found" ? "Course Not Found" : "Oops! Something went wrong"}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {error.message || "We couldn't load this course. Please try again."}
        </p>
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
        onClick={onRetry}
      >
        <RefreshCw className="w-4 h-4 mr-2 inline" />
        Try Again
      </motion.button>
    </div>
  </div>
);

// ----------------------
// Main Component
// ----------------------
interface IIntegratedLessonProps {
  params: Promise<{ id: string }>;
}

const IntegratedLesson: React.FC<IIntegratedLessonProps> = ({ params }) => {
  const router = useRouter();
  const [id, setId] = useState<string>('');
  const [isOnline, setIsOnline] = useState(true);
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  const formatCourseGrade = (grade: string): string => {
    if (grade === "UG - Graduate - Professionals") {
      return "UG/Grad/Pro";
    }
    return grade;
  };

  // Extract id from params
  useEffect(() => {
    params.then(({ id }) => setId(id));
  }, [params]);

  // Find the first lesson helper
  const findFirstLesson = useCallback((courseData: ICourseData): string | null => {
    if (!courseData?.curriculum?.length) return null;
    
      for (const week of courseData.curriculum) {
      if (week.lessons?.length) {
          const firstLesson = week.lessons[0];
          const lessonId = firstLesson._id || firstLesson.id;
            return typeof lessonId === 'object' ? lessonId.$oid : lessonId;
        }
        
      if (week.sections?.length) {
          for (const section of week.sections) {
          if (section.lessons?.length) {
              const firstLesson = section.lessons[0];
              const lessonId = firstLesson._id || firstLesson.id;
                return typeof lessonId === 'object' ? lessonId.$oid : lessonId;
            }
          }
        }
      }
      
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
  } = useCourseLesson(id, '');

  // Check if course has lessons
  const hasLessons = useMemo(() => {
    if (!courseData?.curriculum?.length) return false;
    return courseData.curriculum.some((week: IWeek) => 
      week.lessons?.length || 
      week.sections?.some((section: ISection) => section.lessons?.length)
    );
  }, [courseData]);

  // Handle start learning
  const handleStartLearning = () => {
    if (!hasLessons) {
      toast.info("Course curriculum is still being developed. Check back soon!");
      return;
    }
    
    const firstLesson = findFirstLesson(courseData!);
    if (firstLesson) {
      router.push(`/integrated-lessons/${id}/lecture/${firstLesson}`);
      } else {
      toast.error("No lessons available yet.");
    }
  };

  // Handle lesson selection
  const handleLessonSelect = (lesson: ILesson) => {
      const lessonId = lesson._id || lesson.id;
    if (lessonId) {
      const id = typeof lessonId === 'object' ? lessonId.$oid : lessonId;
      router.push(`/integrated-lessons/${courseData!._id}/lecture/${id}`);
    }
  };

  // Online/offline status
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

  // Error handling
  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred");
    }
  }, [error]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={handleRetry} />;
  }

  if (!courseData) {
  return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <FileWarning className="w-16 h-16 mx-auto text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Course Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400">
            We couldn't find the course you're looking for.
          </p>
                    <button 
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            onClick={() => router.push("/courses")}
                    >
            Browse Courses
        </button>
                        </div>
                        </div>
);
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Course Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Course Information Card - Now at Top */}
            <div className="w-full">
                        <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700"
              >
                {/* Course Details */}
                <div className="p-4 sm:p-6 space-y-4">
                  {/* Header */}
                  <div className="border-b border-gray-100 dark:border-gray-700 pb-3">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                                      </div>
                      <span className="leading-tight">{courseData.course_title}</span>
                    </h3>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-3 font-medium">
                      Everything you need to know
                    </p>
                    
                    {/* Image and Stats in Same Line */}
                    <div className="flex flex-col lg:flex-row gap-4 items-start">
                      {/* Course Image - Now on Left */}
                      {courseData.course_image && (
                        <div className="relative w-full lg:w-80 flex-shrink-0">
                          <div className="relative rounded-xl overflow-hidden shadow-md bg-white/10 backdrop-blur-sm h-48">
                            <Image
                              src={courseData.course_image}
                              alt={courseData.course_title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/10"></div>
                            {courseData.isFree && (
                              <div className="absolute top-2 left-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
                                <span className="flex items-center">
                                  <Heart className="w-2 h-2 mr-1" />
                                  Free Course
                                                </span>
                                            </div>
                                          )}
                                        </div>
                            </div>
                          )}
                          
                      {/* Course Stats Grid - Now on Right with margin */}
                      <div className="flex-1 w-full lg:ml-4">
                        <div className="grid grid-cols-2 gap-3 h-48">
                          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-3 border border-emerald-100 dark:border-emerald-800/30 flex flex-col justify-center">
                            <div className="flex items-center mb-2">
                              <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center mr-2">
                                <Clock className="w-3 h-3 text-white" />
                              </div>
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Duration</span>
                            </div>
                            <p className="font-bold text-base text-gray-900 dark:text-white">
                              {courseData.course_duration || "Self-paced"}
                            </p>
                              </div>
                              
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-3 border border-blue-100 dark:border-blue-800/30 flex flex-col justify-center">
                            <div className="flex items-center mb-2">
                              <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center mr-2">
                                <BookOpen className="w-3 h-3 text-white" />
                              </div>
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Sessions</span>
                            </div>
                            <p className="font-bold text-base text-gray-900 dark:text-white">
                              {courseData.no_of_Sessions || courseData.curriculum?.length || "Multiple"}
                            </p>
                                          </div>
                                          
                          <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl p-3 border border-purple-100 dark:border-purple-800/30 flex flex-col justify-center">
                            <div className="flex items-center mb-2">
                              <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center mr-2">
                                <TrendingUp className="w-3 h-3 text-white" />
                                              </div>
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Level</span>
                                                </div>
                            <p className="font-bold text-base text-gray-900 dark:text-white">
                              {courseData.course_grade ? formatCourseGrade(courseData.course_grade) : courseData.course_level || "All levels"}
                            </p>
                                            </div>
                          
                          <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-3 border border-orange-100 dark:border-orange-800/30 flex flex-col justify-center">
                            <div className="flex items-center mb-2">
                              <div className="w-6 h-6 bg-orange-500 rounded-lg flex items-center justify-center mr-2">
                                <Globe className="w-3 h-3 text-white" />
                                          </div>
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Format</span>
                                      </div>
                            <p className="font-bold text-base text-gray-900 dark:text-white">
                              {courseData.class_type || "Online"}
                            </p>
                                </div>
                            </div>
                            </div>
                  </div>
              </div>
                  
                  {/* Certificate Badge */}
                  {courseData.is_Certification === "yes" && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-3 border border-green-200 dark:border-green-800/30">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                          <Award className="w-4 h-4 text-white" />
                      </div>
                        <div>
                          <p className="font-semibold text-green-800 dark:text-green-200 text-sm">Certificate Included</p>
                          <p className="text-xs text-green-600 dark:text-green-400">Verify your achievement</p>
                          </div>
                  </div>
              </div>
                  )}
                  
                  {/* What's Included */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center text-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mr-3">
                        <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      What's Included
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {courseData.is_Assignments === "yes" && (
                        <div className="flex items-center p-4 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-xl border border-emerald-100/50 dark:border-emerald-800/30">
                          <div className="w-14 h-14 bg-emerald-500 rounded-xl flex items-center justify-center mr-4">
                            <ClipboardList className="w-7 h-7 text-white" />
                        </div>
                      <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-base">Practical Assignments</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Hands-on practice</p>
                      </div>
                    </div>
                      )}
                      {courseData.is_Projects === "yes" && (
                        <div className="flex items-center p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl border border-blue-100/50 dark:border-blue-800/30">
                          <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
                            <Code2 className="w-7 h-7 text-white" />
              </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-base">Real Projects</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Build portfolio</p>
        </div>
                  </div>
                )}
                      {courseData.is_Quizes === "yes" && (
                        <div className="flex items-center p-4 bg-gradient-to-r from-purple-50/50 to-violet-50/50 dark:from-purple-900/10 dark:to-violet-900/10 rounded-xl border border-purple-100/50 dark:border-purple-800/30">
                          <div className="w-14 h-14 bg-purple-500 rounded-xl flex items-center justify-center mr-4">
                            <FileQuestion className="w-7 h-7 text-white" />
              </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-base">Knowledge Quizzes</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Test understanding</p>
                </div>
                </div>
                      )}
                      <div className="flex items-center p-4 bg-gradient-to-r from-teal-50/50 to-cyan-50/50 dark:from-teal-900/10 dark:to-cyan-900/10 rounded-xl border border-teal-100/50 dark:border-teal-800/30">
                        <div className="w-14 h-14 bg-teal-500 rounded-xl flex items-center justify-center mr-4">
                          <Shield className="w-7 h-7 text-white" />
                </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-base">Lifetime Access</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Learn at your pace</p>
                </div>
                </div>
                      <div className="flex items-center p-4 bg-gradient-to-r from-orange-50/50 to-amber-50/50 dark:from-orange-900/10 dark:to-amber-900/10 rounded-xl border border-orange-100/50 dark:border-orange-800/30">
                        <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center mr-4">
                          <Users className="w-7 h-7 text-white" />
                  </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-base">Community Support</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Connect with peers</p>
                  </div>
                  </div>
                  </div>
              </div>
            </div>
            
                {/* Action Button */}
                <div className="p-4 sm:p-6 pt-0">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStartLearning}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 ${
                      hasLessons 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white' 
                        : 'bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!hasLessons}
              >
                <Play className="w-5 h-5" />
                {hasLessons ? "Start Learning" : "Coming Soon"}
                  </motion.button>
            </div>
              </motion.div>
          </div>

            {/* Main Content - Now Below Card */}
            <div className="space-y-12">
              {/* Program Overview */}
              <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700"
              >
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 p-8 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                      <BookOpenCheck className="w-6 h-6 text-white" />
        </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        What You'll Learn
                      </h2>
                      <p className="text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                        Transform your skills with hands-on experience
                      </p>
      </div>
    </div>
      </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                  {(() => {
                    // Extract learning points from course description
                    const description = typeof courseData.course_description === 'string' 
                      ? courseData.course_description
                      : courseData.course_description?.program_overview || "";
                    
                    // Default learning points based on course features and description
                    const defaultLearningPoints = [
                      "Comprehensive knowledge and vital skills in marketing and sales strategy",
                      "Practical application through hands-on assignments and case studies",
                      "Access to pre-recorded video lectures from industry experts",
                      "Interactive learning through live doubt clearance sessions",
                      "Strategic marketing principles and customer targeting techniques",
                      "Sales strategy and business growth methodologies",
                      "Marketing and sales integration for business objectives",
                      "Certificate upon successful completion"
                    ];

                    // Extract benefits if available in description
                    let learningPoints = defaultLearningPoints;
                    
                    if (description.includes("Benefits")) {
                      const benefitsSection = description.split("Benefits")[1];
                      if (benefitsSection) {
                        const extractedPoints = benefitsSection
                          .split(/\n\n/)
                          .filter(point => point.trim() && !point.includes("Overview"))
                          .map(point => {
                            // Clean up the point text
                            return point.replace(/^\w+:\s*/, '').trim();
                          })
                          .filter(point => point.length > 0);
                        
                        if (extractedPoints.length > 0) {
                          learningPoints = extractedPoints;
                        }
                      }
                    }
    
    return (
    <div className="space-y-4">
                        {learningPoints.slice(0, 8).map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="flex items-start gap-4 p-4 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-xl border border-emerald-100/50 dark:border-emerald-800/30 hover:border-emerald-200 dark:hover:border-emerald-700/50 transition-all"
            >
                            <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <CheckCircle className="w-3.5 h-3.5 text-white" />
              </div>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                              {point}
                            </p>
        </motion.div>
      ))}
  </div>
);
                  })()}
      </div>
              </motion.section>

              {/* Course Curriculum */}
              <CourseCurriculum 
                curriculum={courseData.curriculum || []}
                onLessonSelect={handleLessonSelect}
              />

              {/* Learning Objectives */}
              {typeof courseData.course_description === 'object' && courseData.course_description?.learning_objectives?.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm"
                >
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
                      <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
                    Learning Objectives
      </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courseData.course_description.learning_objectives.map((objective, index) => (
          <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg"
                      >
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-3.5 h-3.5 text-white" />
                </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{objective}</p>
          </motion.div>
        ))}
          </div>
                </motion.section>
          )}
          
          {/* Tools & Technologies */}
              <CourseTools tools={courseData.tools_technologies || []} />

              {/* FAQ Section */}
              <ModernCourseFAQ faqs={courseData.faqs || []} />

              {/* Target Audience & Requirements */}
              {typeof courseData.course_description === 'object' && 
               (courseData.course_description?.target_audience?.length > 0 || 
                courseData.course_description?.course_requirements?.length > 0) && (
                <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  {/* Target Audience */}
                  {courseData.course_description.target_audience?.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                          <Users2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                        Who This Course Is For
                      </h3>
                      <ul className="space-y-3">
                        {courseData.course_description.target_audience.map((audience, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600 dark:text-gray-300">{audience}</span>
                          </li>
                        ))}
                      </ul>
                  </div>
                      )}

                  {/* Course Requirements */}
                  {courseData.course_description.course_requirements?.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mr-3">
                          <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                            </div>
                        Prerequisites
                      </h3>
                      <ul className="space-y-3">
                        {courseData.course_description.course_requirements.map((requirement, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600 dark:text-gray-300">{requirement}</span>
                          </li>
                        ))}
                      </ul>
                      </div>
                  )}
                </motion.section>
        )}
      </div>
    </div>
        </div>
    </div>
    </PageWrapper>
  );
};

export default IntegratedLesson;