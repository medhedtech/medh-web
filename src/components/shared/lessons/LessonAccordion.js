"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  ChevronUp, 
  Play, 
  CheckCircle, 
  Clock, 
  FileText, 
  BookOpen, 
  Download,
  Loader,
  Video,
  FileQuestion,
  ClipboardList,
  GraduationCap,
  AlertCircle,
  RefreshCw,
  Lock,
  CheckSquare,
  PlayCircle,
  FileBox,
  Timer,
  Users,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import { toast } from "react-toastify";

const ITEM_TYPES = {
  VIDEO: 'video',
  QUIZ: 'quiz',
  ASSIGNMENT: 'assignment',
  DOCUMENT: 'document',
  PRACTICE: 'practice'
};

const ITEM_STATUS = {
  LOCKED: 'locked',
  AVAILABLE: 'available',
  COMPLETED: 'completed',
  IN_PROGRESS: 'in_progress'
};

const ItemTypeIcon = ({ type, status, className = "w-4 h-4" }) => {
  if (status === ITEM_STATUS.LOCKED) {
    return <Lock className={className} />;
  }

  const icons = {
    [ITEM_TYPES.VIDEO]: PlayCircle,
    [ITEM_TYPES.QUIZ]: FileQuestion,
    [ITEM_TYPES.ASSIGNMENT]: ClipboardList,
    [ITEM_TYPES.PRACTICE]: CheckSquare,
    [ITEM_TYPES.DOCUMENT]: FileBox
  };

  const Icon = icons[type] || FileText;
  return <Icon className={className} />;
};

const ProgressBar = ({ progress, animate = true, showTooltip = false }) => (
  <div className="relative group">
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={animate ? { width: 0 } : { width: `${progress}%` }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full rounded-full ${
            progress === 100 
              ? "bg-green-500" 
              : progress > 50 
                ? "bg-primaryColor" 
                : "bg-primaryColor/80"
          }`}
        />
      </div>
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 min-w-[40px] text-right">
        {progress}%
      </span>
    </div>
    {showTooltip && (
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
          {progress}% complete
        </div>
      </div>
    )}
  </div>
);

const ErrorDisplay = ({ error, onRetry }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-8"
  >
    <div className="text-center">
      <div className="mb-6">
        <motion.div 
          className="w-16 h-16 mx-auto mb-4"
          animate={{ rotate: error.type === "loading" ? 360 : 0 }}
          transition={{ duration: 2, repeat: error.type === "loading" ? Infinity : 0 }}
        >
          <AlertCircle className={`w-full h-full ${
            error.type === "auth" ? "text-yellow-500" :
            error.type === "server" ? "text-red-500" : 
            error.type === "loading" ? "text-primaryColor" : "text-gray-400"
          }`} />
        </motion.div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {error.message}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {error.details}
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {error.type !== "auth" && (
          <button
            onClick={onRetry}
            className="w-full px-4 py-2.5 text-sm font-medium bg-primaryColor text-white rounded-md hover:bg-primaryColor/90 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
        {error.type === "auth" && (
          <Link
            href="/login"
            className="w-full px-4 py-2.5 text-sm font-medium bg-primaryColor text-white rounded-md hover:bg-primaryColor/90 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <GraduationCap className="w-4 h-4" />
            Log In to Continue
          </Link>
        )}
      </div>
    </div>
  </motion.div>
);

const LessonAccordion = ({ courseId, currentLessonId, courseData }) => {
  const [expandedWeeks, setExpandedWeeks] = useState(new Set());
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sections, setSections] = useState([]);
  const [retryCount, setRetryCount] = useState(0);
  const [focusedItemId, setFocusedItemId] = useState(currentLessonId);
  const { getQuery } = useGetQuery();

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
    setLoading(true);
  };

  // Handle keyboard navigation
  const handleKeyNavigation = (e, items, currentIndex) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (currentIndex < items.length - 1) {
          setFocusedItemId(items[currentIndex + 1].id);
          document.getElementById(`lesson-${items[currentIndex + 1].id}`)?.focus();
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (currentIndex > 0) {
          setFocusedItemId(items[currentIndex - 1].id);
          document.getElementById(`lesson-${items[currentIndex - 1].id}`)?.focus();
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!items[currentIndex].status === ITEM_STATUS.LOCKED) {
          window.location.href = `/integrated-lessons/${items[currentIndex].id}`;
        }
        break;
      default:
        break;
    }
  };

  // Handle section toggle with keyboard
  const handleSectionKeyPress = (e, sectionId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleSection(sectionId);
    }
  };

  // Automatically expand the week and section containing the current lesson
  useEffect(() => {
    if (currentLessonId && courseData?.curriculum) {
      courseData.curriculum.forEach((week, weekIndex) => {
        week.sections.forEach((section, sectionIndex) => {
          const hasCurrentLesson = section.lessons.some(lesson => lesson._id === currentLessonId);
          if (hasCurrentLesson) {
            setExpandedWeeks(prev => new Set([...prev, weekIndex]));
            setExpandedSections(prev => new Set([...prev, `${weekIndex}-${sectionIndex}`]));
          }
        });
      });
    }
  }, [currentLessonId, courseData]);

  const toggleWeek = (weekIndex) => {
    setExpandedWeeks(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(weekIndex)) {
        newExpanded.delete(weekIndex);
      } else {
        newExpanded.add(weekIndex);
      }
      return newExpanded;
    });
  };

  const toggleSection = (weekIndex, sectionIndex) => {
    const sectionKey = `${weekIndex}-${sectionIndex}`;
    setExpandedSections(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(sectionKey)) {
        newExpanded.delete(sectionKey);
      } else {
        newExpanded.add(sectionKey);
      }
      return newExpanded;
    });
  };

  // Transform course data into sections
  const transformCourseData = (data) => {
    if (!data) return [];

    // Transform curriculum data into sections
    const transformedSections = [];
    
    data.curriculum.forEach((week, weekIndex) => {
      week.sections.forEach((section) => {
        const transformedSection = {
          id: `${weekIndex}-${section.order}`,
          title: `${week.weekTitle} - ${section.title}`,
          description: section.description,
          order: section.order + (weekIndex * 100), // Ensure unique ordering across weeks
          content: section.lessons.map(lesson => ({
            id: lesson._id || '',
            type: lesson.type || determineContentType(lesson),
            title: lesson.title || 'Untitled Lesson',
            description: lesson.description,
            duration: formatDuration(lesson.duration),
            completed: lesson.is_completed || false,
            hasResources: lesson.resources && lesson.resources.length > 0,
            resources: lesson.resources || [],
            videoUrl: lesson.videoUrl,
            order: lesson.order || 0,
            status: lesson.status || ITEM_STATUS.AVAILABLE,
            assignments: section.assignments || [],
            quizzes: section.quizzes || []
          })),
          itemCount: section.lessons.length,
          duration: calculateSectionDuration(section.lessons)
        };
        
        transformedSections.push(transformedSection);
      });
    });

    return transformedSections.sort((a, b) => a.order - b.order);
  };

  const determineContentType = (lesson) => {
    if (lesson.videoUrl) return ITEM_TYPES.VIDEO;
    if (lesson.content?.includes('quiz')) return ITEM_TYPES.QUIZ;
    if (lesson.content?.includes('assignment')) return ITEM_TYPES.ASSIGNMENT;
    if (lesson.resources?.some(r => r.mimeType?.includes('pdf'))) return ITEM_TYPES.DOCUMENT;
    return ITEM_TYPES.VIDEO;
  };

  const formatDuration = (minutes) => {
    if (!minutes) return "0min";
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  };

  const calculateSectionDuration = (content) => {
    const totalMinutes = content.reduce((total, item) => {
      const duration = parseInt(item.duration) || 0;
      return total + duration;
    }, 0);
    return formatDuration(totalMinutes);
  };

  const getSectionProgress = (section) => {
    if (!section.content.length) return 0;
    const completedItems = section.content.filter(item => item.completed).length;
    return Math.round((completedItems / section.content.length) * 100);
  };

  useEffect(() => {
    const fetchCourseSections = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        if (!token) {
          setError({
            message: "Authentication Required",
            type: "auth",
            details: "Please log in to view course content"
          });
          return;
        }
        
        const headers = {
          'x-access-token': token,
          'Content-Type': 'application/json'
        };
        
        await getQuery({
          url: apiUrls.courses.getCourseById(courseId),
          headers,
          onSuccess: (response) => {
            if (response?.success && response?.data) {
              const transformedSections = transformCourseData(response.data);
              setSections(transformedSections);
            } else {
              throw new Error('Invalid course data received');
            }
          },
          onError: (error) => {
            console.error("Error fetching course sections:", error);
            let errorMessage = {
              message: "Failed to load course content",
              type: "unknown",
              details: error?.message || "Please try again later"
            };

            if (error?.response?.status === 401) {
              errorMessage = {
                message: "Session Expired",
                type: "auth",
                details: "Please log in again to continue"
              };
            } else if (error?.response?.status === 404) {
              errorMessage = {
                message: "Course Not Found",
                type: "not_found",
                details: "The requested course content could not be found"
              };
            } else if (error?.response?.status >= 500) {
              errorMessage = {
                message: "Server Error",
                type: "server",
                details: "Our servers are experiencing issues. Please try again later"
              };
            }

            setError(errorMessage);
          }
        });
      } catch (error) {
        console.error("Error in fetchCourseSections:", error);
        setError({
          message: "An unexpected error occurred",
          type: "unknown",
          details: "There was a problem loading the course content"
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (courseId) {
      fetchCourseSections();
    }
  }, [courseId, retryCount]);

  // Calculate overall course progress
  const overallProgress = useMemo(() => {
    if (!sections.length) return 0;
    const totalItems = sections.reduce((total, section) => total + section.content.length, 0);
    const completedItems = sections.reduce((total, section) => 
      total + section.content.filter(item => item.completed).length, 0
    );
    return Math.round((completedItems / totalItems) * 100);
  }, [sections]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="flex items-center gap-3"
        >
          <Loader className="w-6 h-6 text-primaryColor" />
          <span className="text-gray-600 dark:text-gray-400">Loading course content...</span>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={handleRetry} />;
  }

  const renderLesson = (lesson, weekTitle, sectionTitle) => {
    const isActive = lesson.id === currentLessonId;
    const isCompleted = lesson.completed;
    const isLocked = lesson.status === ITEM_STATUS.LOCKED;

    return (
      <motion.div
        key={lesson.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`pl-8 py-2 relative ${
          isActive ? 'bg-primaryColor/10' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'
        } transition-colors rounded-md`}
      >
        <Link
          href={isLocked ? '#' : `/integrated-lessons/${lesson.id}`}
          className={`flex items-center gap-3 ${
            isLocked ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          {isCompleted ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : isLocked ? (
            <Lock className="w-4 h-4 text-gray-400" />
          ) : (
            <Play className="w-4 h-4 text-primaryColor" />
          )}
          <div className="flex-1">
            <div className="text-sm font-medium">{lesson.title}</div>
            {lesson.duration && (
              <div className="text-xs text-gray-500">
                {Math.floor(lesson.duration / 60)} min
              </div>
            )}
          </div>
        </Link>
      </motion.div>
    );
  };

  const renderSection = (section, weekIndex, sectionIndex, weekTitle) => {
    const sectionKey = `${weekIndex}-${sectionIndex}`;
    const isExpanded = expandedSections.has(sectionKey);

    return (
      <div key={sectionKey} className="mb-2">
        <button
          onClick={() => toggleSection(weekIndex, sectionIndex)}
          className="w-full flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-md transition-colors"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">{section.title}</span>
        </button>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {section.content.map((item, index) => renderLesson(item, weekTitle, section.title))}
              
              {/* Render section assignments if any */}
              {item.assignments?.map((assignment, aIndex) => (
                <div key={`assignment-${aIndex}`} className="pl-8 py-2">
                  <div className="flex items-center gap-3 text-gray-600">
                    <FileText className="w-4 h-4" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{assignment.title}</div>
                      <div className="text-xs text-gray-500">Assignment</div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Render section quizzes if any */}
              {item.quizzes?.map((quiz, qIndex) => (
                <div key={`quiz-${qIndex}`} className="pl-8 py-2">
                  <div className="flex items-center gap-3 text-gray-600">
                    <FileText className="w-4 h-4" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{quiz.title}</div>
                      <div className="text-xs text-gray-500">Quiz • {quiz.duration} min</div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderWeek = (week, weekIndex) => {
    const isExpanded = expandedWeeks.has(weekIndex);

    return (
      <div key={weekIndex} className="mb-4">
        <button
          onClick={() => toggleWeek(weekIndex)}
          className="w-full flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-md transition-colors"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
          <div className="text-left">
            <div className="text-sm font-medium">{week.weekTitle}</div>
            <div className="text-xs text-gray-500">{week.weekDescription}</div>
          </div>
        </button>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="pl-4 overflow-hidden"
            >
              {week.sections.map((section, sectionIndex) => 
                renderSection(section, weekIndex, sectionIndex, week.weekTitle)
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="space-y-4" role="navigation" aria-label="Course content">
      {/* Course Overview Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm" role="region" aria-label="Course progress">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Course Progress
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            <span>{sections.reduce((total, section) => total + section.content.length, 0)} lessons</span>
          </div>
        </div>
        <ProgressBar progress={overallProgress} showTooltip={true} />
        <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="text-2xl font-bold text-primaryColor">
              {sections.length}
            </div>
            <div className="text-gray-500 dark:text-gray-400">Sections</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primaryColor">
              {sections.reduce((total, section) => 
                total + section.content.filter(item => item.completed).length, 0
              )}
            </div>
            <div className="text-gray-500 dark:text-gray-400">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primaryColor">
              {formatDuration(sections.reduce((total, section) => 
                total + section.content.reduce((sum, item) => sum + (parseInt(item.duration) || 0), 0), 0
              ))}
            </div>
            <div className="text-gray-500 dark:text-gray-400">Total Time</div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-2">
        {sections.map((section) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group"
            role="region"
            aria-label={section.title}
          >
            <button
              onClick={() => toggleSection(section.id.split('-')[0], section.id.split('-')[1])}
              onKeyDown={(e) => handleSectionKeyPress(e, section.id)}
              aria-expanded={expandedSections.has(section.id)}
              aria-controls={`section-content-${section.id}`}
              className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primaryColor focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <span>{section.title}</span>
                    {getSectionProgress(section) === 100 && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <BookOpen className="w-3 h-3 mr-1" />
                      <span>{section.itemCount} lessons</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Timer className="w-3 h-3 mr-1" />
                      <span>{section.duration}</span>
                    </div>
                  </div>
                </div>
                
                <ProgressBar 
                  progress={getSectionProgress(section)} 
                  animate={expandedSections.has(section.id)}
                  showTooltip={true}
                />
              </div>
              
              <ChevronUp
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                  expandedSections.has(section.id) ? "rotate-180" : ""
                }`}
              />
            </button>
            
            <AnimatePresence>
              {expandedSections.has(section.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                  id={`section-content-${section.id}`}
                  role="region"
                  aria-label={`${section.title} content`}
                >
                  <div className="p-4 space-y-2">
                    {section.content.map((item, index) => {
                      const isActive = currentLessonId && item.id === currentLessonId;
                      const isLocked = item.status === ITEM_STATUS.LOCKED;
                      const isFocused = focusedItemId === item.id;
                      
                      return (
                        <React.Fragment key={item.id}>
                          <Link
                            id={`lesson-${item.id}`}
                            href={isLocked || !item.id ? "#" : `/integrated-lessons/${item.id}`}
                            className={`flex items-start group/item p-3 rounded-lg ${
                              isLocked || !item.id
                                ? "opacity-75 cursor-not-allowed"
                                : isActive
                                  ? "bg-primaryColor/10 dark:bg-primaryColor/20"
                                  : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                            } transition-all focus:outline-none focus:ring-2 focus:ring-primaryColor focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                              isFocused ? "ring-2 ring-primaryColor ring-offset-2 dark:ring-offset-gray-800" : ""
                            }`}
                            onClick={e => (isLocked || !item.id) && e.preventDefault()}
                            onKeyDown={(e) => handleKeyNavigation(e, section.content, index)}
                            tabIndex={0}
                            role="button"
                            aria-disabled={isLocked || !item.id}
                            aria-current={isActive ? "true" : undefined}
                          >
                            <div className="flex-shrink-0 mr-3 mt-0.5">
                              <div className={`w-6 h-6 rounded-full ${
                                item.completed
                                  ? "bg-green-500"
                                  : isActive
                                    ? "border-2 border-primaryColor"
                                    : isLocked
                                      ? "bg-gray-300 dark:bg-gray-600"
                                      : "border-2 border-gray-300 dark:border-gray-500"
                              } flex items-center justify-center transition-colors`}>
                                {item.completed ? (
                                  <CheckCircle className="w-4 h-4 text-white" />
                                ) : (
                                  <ItemTypeIcon 
                                    type={item.type}
                                    status={isLocked ? ITEM_STATUS.LOCKED : ITEM_STATUS.AVAILABLE}
                                    className={`w-4 h-4 ${
                                      isActive 
                                        ? "text-primaryColor" 
                                        : isLocked
                                          ? "text-gray-500"
                                          : "text-gray-400"
                                    }`}
                                  />
                                )}
                              </div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className={`text-sm font-medium ${
                                  isLocked
                                    ? "text-gray-500"
                                    : isActive
                                      ? "text-primaryColor"
                                      : "text-gray-900 dark:text-white"
                                }`}>
                                  {item.title}
                                </p>
                                {item.completed && (
                                  <span className="text-xs text-green-500 font-medium">
                                    Completed
                                  </span>
                                )}
                              </div>
                              
                              {item.description && (
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                  {item.description}
                                </p>
                              )}
                              
                              <div className="flex items-center mt-2 space-x-4">
                                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                  <Timer className="w-3 h-3 mr-1" />
                                  {item.duration}
                                </span>
                                {item.hasResources && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                    <Download className="w-3 h-3 mr-1" />
                                    {item.resources.length} Resource{item.resources.length !== 1 ? 's' : ''}
                                  </span>
                                )}
                                {item.type === ITEM_TYPES.VIDEO && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                    <Video className="w-3 h-3 mr-1" />
                                    Video
                                  </span>
                                )}
                                {item.type === ITEM_TYPES.QUIZ && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                    <FileQuestion className="w-3 h-3 mr-1" />
                                    Quiz
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LessonAccordion;
