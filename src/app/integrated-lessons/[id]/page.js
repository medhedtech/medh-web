"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  Timer
} from "lucide-react";
import Link from "next/link";
import useCourseLesson from "@/hooks/useCourseLesson.hook";
import { toast } from "react-toastify";

// Import necessary components
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import LessonAccordion from "@/components/shared/lessons/LessonAccordion";

// Add new imports for enhanced functionality
import { useInView } from "react-intersection-observer";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { formatDuration, formatDate } from "@/utils/format";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const CourseMetrics = ({ meta }) => {
  if (!meta) return null;
  
  const metrics = [
    { icon: Eye, label: "views", value: meta.views.toLocaleString() },
    { icon: Star, label: "rating", value: `${meta.ratings.average} (${meta.ratings.count})` },
    { icon: UserCheck, label: "enrolled", value: meta.enrollments }
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
          <metric.icon className={`w-4 h-4 ${metric.label === "rating" ? "text-yellow-400" : ""}`} />
          <span>{metric.value} {metric.label}</span>
        </motion.div>
      ))}
    </div>
  );
};

const CoursePricing = ({ prices }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

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

const CourseResources = ({ resources }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  
  if (!resources?.length) return null;

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || resource.type === selectedType;
    return matchesSearch && matchesType;
  });

  const resourceTypes = ["all", ...new Set(resources.map(r => r.type).filter(Boolean))];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <FileIcon className="w-5 h-5 mr-2" />
        Course Resources
      </h3>
      
      <div className="mb-4 space-y-3">
        <input
          type="text"
          placeholder="Search resources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primaryColor focus:border-transparent"
        />
        
        <div className="flex flex-wrap gap-2">
          {resourceTypes.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                selectedType === type
                  ? "bg-primaryColor text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {type ? type.charAt(0).toUpperCase() + type.slice(1) : ''}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredResources.map((resource, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg group hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          >
            <div className="flex-1">
              <h4 className="font-medium group-hover:text-primaryColor transition-colors">
                {resource.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {resource.description}
              </p>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-4">
                {resource.size_mb && (
                  <span className="flex items-center">
                    <FileBox className="w-3 h-3 mr-1" />
                    {resource.size_mb} MB
                  </span>
                )}
                {resource.pages && (
                  <span className="flex items-center">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {resource.pages} pages
                  </span>
                )}
                {resource.upload_date && (
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(resource.upload_date)}
                  </span>
                )}
              </div>
            </div>
            <motion.a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 p-2 text-primaryColor hover:bg-primaryColor/10 rounded-full transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-5 h-5" />
            </motion.a>
          </motion.div>
        ))}
        
        {filteredResources.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FileQuestion className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No resources found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CourseAssignments = ({ assignments }) => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  
  if (!assignments?.length) return null;

  const filteredAssignments = assignments.filter(assignment => 
    selectedStatus === "all" || assignment.status === selectedStatus
  );

  const statuses = ["all", "pending", "submitted", "graded"];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <ClipboardList className="w-5 h-5 mr-2" />
        Assignments
      </h3>
      
      <div className="mb-4 flex flex-wrap gap-2">
        {statuses.map(status => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              selectedStatus === status
                ? "bg-primaryColor text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredAssignments.map((assignment, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border-b last:border-0 pb-4 last:pb-0"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h4 className="font-medium flex items-center gap-2">
                  {assignment.title}
                  {assignment.status === "graded" && (
                    <span className="text-sm font-medium bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400 px-2 py-0.5 rounded">
                      Graded
                    </span>
                  )}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {assignment.description}
                </p>
              </div>
              <span className="text-sm font-medium bg-primaryColor/10 text-primaryColor px-2 py-1 rounded ml-4">
                {assignment.maxScore} points
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm mt-3">
              <div className="space-x-4">
                <span className="text-gray-500 dark:text-gray-400 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Due: {formatDate(assignment.dueDate)}
                </span>
                {assignment.timeLeft && (
                  <span className="text-gray-500 dark:text-gray-400 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {assignment.timeLeft} remaining
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                {assignment.resources?.length > 0 && (
                  <Link
                    href={assignment.resources[0].fileUrl}
                    className="text-primaryColor hover:underline flex items-center"
                  >
                    <FileIcon className="w-4 h-4 mr-1" />
                    Guidelines
                  </Link>
                )}
                {assignment.status !== "submitted" && (
                  <button
                    onClick={() => {/* Handle submission */}}
                    className="px-3 py-1 text-sm font-medium bg-primaryColor text-white rounded hover:bg-primaryColor/90 transition-colors"
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        
        {filteredAssignments.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No assignments found with the selected status</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CourseQuizzes = ({ quizzes }) => {
  if (!quizzes?.length) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <FileQuestion className="w-5 h-5 mr-2" />
        Quizzes
      </h3>
      <div className="space-y-4">
        {quizzes.map((quiz, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border-b last:border-0 pb-4 last:pb-0"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">{quiz.title}</h4>
              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {quiz.duration} min
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {quiz.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const CourseFAQs = ({ faqs }) => {
  const [openFaq, setOpenFaq] = useState(null);

  if (!faqs?.length) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <HelpCircle className="w-5 h-5 mr-2" />
        Frequently Asked Questions
      </h3>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border-b last:border-0 pb-3 last:pb-0"
          >
            <button
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
              className="w-full text-left flex justify-between items-start py-2"
            >
              <span className="font-medium">{faq.question}</span>
              <ChevronUp
                className={`w-5 h-5 transform transition-transform ${
                  openFaq === index ? "" : "rotate-180"
                }`}
              />
            </button>
            <AnimatePresence>
              {openFaq === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-400 py-2">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const CourseOverview = ({ courseData }) => {
  if (!courseData?.course_description) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <BookOpenCheck className="w-5 h-5 mr-2" />
        Course Overview
      </h3>
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Program Overview</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {courseData.course_description.program_overview}
          </p>
        </div>
        <div>
          <h4 className="font-medium mb-2">Benefits</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {courseData.course_description.benefits}
          </p>
        </div>
        
        {/* Tools & Technologies */}
        {courseData.tools_technologies?.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Tools & Technologies</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {courseData.tools_technologies.map((tool, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/30 rounded">
                  <img src={tool.logo_url} alt={tool.name} className="w-6 h-6 object-contain" />
                  <div>
                    <div className="text-sm font-medium">{tool.name}</div>
                    <div className="text-xs text-gray-500">{tool.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced loading component
const LoadingState = ({ message = "Loading...", description }) => (
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
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          {message}
        </h2>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
    </div>
  </div>
);

// Update the navigation logic
const findNextAndPreviousLessons = (curriculum, currentLessonId) => {
  let prevLesson = null;
  let nextLesson = null;
  let foundCurrent = false;

  // Flatten the curriculum structure for navigation
  const allLessons = curriculum.reduce((acc, week) => {
    const weekLessons = week.sections.reduce((sectionAcc, section) => {
      return [...sectionAcc, ...section.lessons.map(lesson => ({
        ...lesson,
        weekTitle: week.weekTitle,
        sectionTitle: section.title
      }))];
    }, []);
    return [...acc, ...weekLessons];
  }, []);

  // Sort lessons by order
  const sortedLessons = allLessons.sort((a, b) => a.order - b.order);

  // Find current, next and previous lessons
  for (let i = 0; i < sortedLessons.length; i++) {
    if (sortedLessons[i]._id === currentLessonId) {
      foundCurrent = true;
      if (i > 0) {
        prevLesson = sortedLessons[i - 1];
      }
      if (i < sortedLessons.length - 1) {
        nextLesson = sortedLessons[i + 1];
      }
      break;
    }
  }

  return { prevLesson, nextLesson };
};

const IntegratedLesson = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  
  // State for UI controls
  const [contentOpen, setContentOpen] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showError, setShowError] = useState(false);
  
  // New hooks for enhanced functionality
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const [autoplay, setAutoplay] = useLocalStorage("video-autoplay", true);
  const [quality, setQuality] = useLocalStorage("video-quality", "auto");
  const [playbackSpeed, setPlaybackSpeed] = useLocalStorage("video-speed", 1);
  
  // Track lesson progress
  const [progress, setProgress] = useState(0);
  const [lastPosition, setLastPosition] = useState(0);
  
  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Connection restored');
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.error('No internet connection');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Use our custom hook for course and lesson data
  const {
    loading,
    error,
    courseData,
    lessonData,
    handleRetry,
    markLessonComplete,
    submitAssignment,
    submitQuiz,
    getLoading,
    postLoading
  } = useCourseLesson(id, id);

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      setShowError(true);
      toast.error(error.message || 'An error occurred');
    } else {
      setShowError(false);
    }
  }, [error]);
  
  // Handle marking lesson as complete
  const handleMarkComplete = async () => {
    if (!isOnline) {
      toast.error('No internet connection. Please check your connection and try again.');
      return;
    }

    try {
      setIsCompleting(true);
      await markLessonComplete({
        completed_at: new Date().toISOString(),
        duration: 0
      });
    } catch (err) {
      console.error('Error marking lesson complete:', err);
    } finally {
      setIsCompleting(false);
    }
  };
  
  // Handle video progress
  const handleTimeUpdate = (currentTime) => {
    setProgress((currentTime / lessonData?.duration) * 100);
    setLastPosition(currentTime);
    
    // Auto-mark as complete when near the end
    if (progress > 95 && !lessonData?.is_completed) {
      handleMarkComplete();
    }
  };
  
  // Save last position before unloading
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem(`lesson-${id}-position`, lastPosition);
    };
    
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [id, lastPosition]);
  
  // Restore last position on mount
  useEffect(() => {
    const savedPosition = localStorage.getItem(`lesson-${id}-position`);
    if (savedPosition) {
      setLastPosition(parseFloat(savedPosition));
    }
  }, [id]);

  // Get next and previous lessons
  const { prevLesson, nextLesson } = useMemo(() => {
    if (!courseData?.curriculum) return { prevLesson: null, nextLesson: null };
    return findNextAndPreviousLessons(courseData.curriculum, id);
  }, [courseData, id]);

  // Default lesson structure with proper typing
  const defaultLessonStructure = {
    weekTitle: "Loading Course Content",
    weekDescription: "Please wait while we load the course content",
    sections: [
      {
        title: "Introduction",
        description: "Loading course introduction...",
        order: 1,
        lessons: [
          {
            _id: "loading",
            title: "Loading Lesson",
            description: "Please wait while we load the lesson content",
            content: "Loading...",
            duration: 0,
            order: 1,
            type: "video"
          }
        ]
      }
    ]
  };

  // Course info section with error handling
  const CourseInfo = () => {
    const fallbackData = {
      course_title: courseData?.course_title || "Loading...",
      course_duration: courseData?.course_duration || "Loading...",
      session_duration: courseData?.session_duration || "Loading...",
      no_of_Sessions: courseData?.no_of_Sessions || "-",
      course_tag: courseData?.course_tag || "",
      course_grade: courseData?.course_grade || "",
      efforts_per_Week: courseData?.efforts_per_Week || ""
    };

    const data = courseData || fallbackData;

    return (
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {data.course_title}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <span className="bg-primaryColor/10 text-primaryColor px-2 py-0.5 rounded">
                {data.course_tag}
                  </span>
              <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                {data.course_grade}
              </span>
            </div>
          </div>
          {error && (
                <button
                  onClick={handleRetry}
              className="p-2 text-primaryColor hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              title="Retry loading course"
            >
              <RefreshCw className="w-5 h-5" />
                </button>
              )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Calendar className="w-5 h-5 mr-2" />
            <span>{data.course_duration}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Clock3 className="w-5 h-5 mr-2" />
            <span>{data.session_duration} per session</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Users className="w-5 h-5 mr-2" />
            <span>{data.no_of_Sessions} sessions</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Timer className="w-5 h-5 mr-2" />
            <span>{data.efforts_per_Week}</span>
          </div>
        </div>
        
        {/* Course Features */}
        <div className="mt-4 flex flex-wrap gap-3">
          {data.is_Certification === "Yes" && (
            <span className="flex items-center gap-1 text-xs bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 px-2 py-1 rounded">
              <Award className="w-3 h-3" />
              Certification
            </span>
          )}
          {data.is_Assignments === "Yes" && (
            <span className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 px-2 py-1 rounded">
              <ClipboardList className="w-3 h-3" />
              Assignments
            </span>
          )}
          {data.is_Projects === "Yes" && (
            <span className="flex items-center gap-1 text-xs bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 px-2 py-1 rounded">
              <FileBox className="w-3 h-3" />
              Projects
            </span>
          )}
          {data.is_Quizes === "Yes" && (
            <span className="flex items-center gap-1 text-xs bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400 px-2 py-1 rounded">
              <FileQuestion className="w-3 h-3" />
              Quizzes
            </span>
          )}
        </div>
        
        <AnimatePresence>
          {showError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4"
            >
              <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-lg">
                <div className="flex items-center text-red-600 dark:text-red-400">
                  {!isOnline ? (
                    <WifiOff className="w-5 h-5 mr-2" />
                  ) : (
                    <AlertCircle className="w-5 h-5 mr-2" />
                  )}
                  <span className="text-sm">
                    {!isOnline 
                      ? 'No internet connection' 
                      : error?.message || 'Error loading course data'}
                  </span>
            </div>
          </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
    );
  };

  // Loading state with context
  if (loading || getLoading || postLoading) {
    return (
      <PageWrapper>
        <LoadingState 
          message={
            getLoading ? 'Loading lesson content...' : 
            postLoading ? 'Processing your request...' :
            'Initializing...'
          }
          description={
            getLoading ? 'Please wait while we fetch your lesson' : 
            postLoading ? 'Please wait while we process your request' :
            'Please wait while we set up the course'
          }
        />
      </PageWrapper>
    );
  }
  
  return (
    <PageWrapper>
      <main className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="container mx-auto py-0 lg:py-6 px-0 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-6">
            {/* Mobile Sidebar Toggle */}
            <div className="lg:hidden fixed bottom-4 right-4 z-50">
              <motion.button 
                onClick={() => setContentOpen(!contentOpen)}
                whileTap={{ scale: 0.95 }}
                className="p-4 bg-primaryColor text-white rounded-full shadow-lg flex items-center justify-center"
              >
                <Menu className="w-5 h-5" />
              </motion.button>
            </div>
            
            {/* Course Content Sidebar */}
            <div className={`fixed inset-0 lg:static lg:col-span-3 z-40 lg:z-auto ${contentOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="h-full lg:h-auto overflow-auto bg-white dark:bg-gray-800 lg:rounded-lg shadow-sm">
                <AnimatePresence>
                  {contentOpen && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 lg:hidden" 
                  onClick={() => setContentOpen(false)}
                    />
                  )}
                </AnimatePresence>
                
                <div className="relative z-10 h-full lg:h-auto flex flex-col">
                  <div className="border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10 bg-white dark:bg-gray-800">
                    <div className="flex justify-between items-center px-4 py-4">
                      <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                        Course content
                      </h2>
                      <button 
                        onClick={() => setContentOpen(false)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 lg:hidden"
                      >
                        <ChevronUp className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-auto">
                    <LessonAccordion 
                      currentLessonId={id} 
                      courseId={courseData?._id} 
                      courseData={courseData || { curriculum: defaultLessonStructure }}
                      onError={(error) => {
                        setShowError(true);
                        toast.error(error.message);
                      }}
                      onRetry={handleRetry}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Content Area */}
            <div className="lg:col-span-9">
              <div className="bg-white dark:bg-gray-800 lg:rounded-lg overflow-hidden">
                  {/* Back to Course Link */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                    <Link 
                      href="/integrated-lessons" 
                      className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primaryColor transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      <span>Back to course</span>
                    </Link>
                  </div>
                  
                {/* Course Info */}
                <CourseInfo />
                
                {/* Course Metrics */}
                <div className="px-4 lg:px-6">
                  <CourseMetrics meta={courseData?.meta} />
                  
                  {/* Course Overview */}
                  <CourseOverview courseData={courseData} />
                  
                  {/* Course Pricing */}
                  <CoursePricing prices={courseData?.prices} />
                  
                  {/* Course Resources */}
                  <CourseResources resources={courseData?.resource_pdfs} />
                  
                  {/* Assignments */}
                  <CourseAssignments assignments={courseData?.assignments} />
                  
                  {/* Quizzes */}
                  <CourseQuizzes quizzes={courseData?.quizzes} />
                  
                  {/* FAQs */}
                  <CourseFAQs faqs={courseData?.faqs} />
                  
                  {/* Content Area */}
                  <div className="p-4 lg:p-6">
                    {/* Lesson Title */}
                    <motion.div
                      className="mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {prevLesson?.weekTitle} &gt; {prevLesson?.title}
                            </div>
                      <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                        {prevLesson?.title || defaultLessonStructure.sections[0].lessons[0].title}
                      </h1>
                      <p className="mt-2 text-gray-600 dark:text-gray-300">
                        {prevLesson?.description || defaultLessonStructure.sections[0].lessons[0].description}
                      </p>
                    </motion.div>
                    
                    {/* Lesson Content */}
                    <motion.div 
                      className="prose dark:prose-invert max-w-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <div className="mb-6">
                        <p>{prevLesson?.content || defaultLessonStructure.sections[0].lessons[0].content}</p>
                              </div>
                    </motion.div>
                    
                    {/* Action Buttons */}
                    <motion.div 
                      className="mt-8 flex flex-wrap gap-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    >
                                <motion.button
                                  onClick={handleMarkComplete}
                        disabled={isCompleting || lessonData?.is_completed || !isOnline}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                          !isOnline
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
                            : lessonData?.is_completed
                                      ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                                      : isCompleting
                                        ? "bg-primaryColor/80 text-white/80 cursor-wait"
                                        : "bg-primaryColor text-white hover:bg-primaryColor/90"
                                  }`}
                                >
                                  {lessonData?.is_completed ? (
                                    <>
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      <span>Completed</span>
                                    </>
                                  ) : isCompleting ? (
                          <>
                            <Loader className="w-4 h-4 mr-2 animate-spin" />
                                    <span>Marking...</span>
                          </>
                        ) : !isOnline ? (
                          <>
                            <WifiOff className="w-4 h-4 mr-2" />
                            <span>Offline</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            <span>Mark as Complete</span>
                          </>
                                  )}
                                </motion.button>
                                
                      {lessonData?.resources?.length > 0 && (
                                <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100 dark:bg-gray-700/50 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
                          disabled={!isOnline}
                                >
                                  <Download className="w-4 h-4 mr-2" />
                          <span>Download Resources</span>
                                </motion.button>
                      )}
                    </motion.div>
                    
                    {/* Navigation */}
                    {courseData?.curriculum && (
                      <motion.div 
                        className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-between"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                      >
                        {/* Previous Lesson */}
                        {prevLesson && (
                              <Link 
                            href={`/integrated-lessons/${prevLesson._id}`}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                              >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                            <div className="flex flex-col items-start">
                              <span className="text-xs text-gray-500">{prevLesson.weekTitle}</span>
                              <span>{prevLesson.title}</span>
                            </div>
                              </Link>
                        )}
                            
                        {/* Next Lesson */}
                        {nextLesson && (
                              <Link 
                            href={`/integrated-lessons/${nextLesson._id}`}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors ml-auto"
                              >
                            <div className="flex flex-col items-end">
                              <span className="text-xs text-gray-500">{nextLesson.weekTitle}</span>
                              <span>{nextLesson.title}</span>
                            </div>
                                <Play className="w-4 h-4 ml-2" />
                              </Link>
                        )}
                            </motion.div>
                    )}
                            </div>
                          </div>
                              </div>
                              </div>
                                </div>
                              </div>
                          
        {/* Enhanced video player controls */}
        {lessonData?.type === "video" && (
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 z-50">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setAutoplay(!autoplay)}
                  className={`text-sm font-medium ${
                    autoplay ? "text-primaryColor" : "text-gray-500"
                  }`}
                >
                  Autoplay
                </button>
                
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="text-sm bg-transparent border-none focus:ring-0"
                >
                  <option value="auto">Auto</option>
                  <option value="1080p">1080p</option>
                  <option value="720p">720p</option>
                  <option value="480p">480p</option>
                </select>
                
                <select
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                  className="text-sm bg-transparent border-none focus:ring-0"
                >
                  <option value="0.5">0.5x</option>
                  <option value="1">1x</option>
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2">2x</option>
                </select>
                          </div>
                          
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  {formatDuration(lastPosition)} / {formatDuration(lessonData?.duration)}
                </span>
                
                <div className="w-64 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                  <div
                    className="bg-primaryColor h-full rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                            </div>
                          </div>
                        </div>
                </div>
        )}
      </main>
    </PageWrapper>
  );
};

export default IntegratedLesson;