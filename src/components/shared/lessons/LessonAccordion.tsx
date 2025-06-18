"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  ChevronRight,
  Search,
  X,
  PanelLeftClose,
  ArrowLeftRight,
  Sidebar,
  Bookmark,
  BookmarkPlus,
  Star,
  MoreHorizontal,
  Calendar,
  Briefcase,
  Award,
  TrendingUp,
  Zap,
  Tag,
  Info,
  Filter,
  ShieldCheck,
  Library,
  Navigation,
  ExternalLink,
  Code,
  ChartBar,
  LucideIcon,
  LucideProps,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import clsx from "clsx";

// Define item types & statuses
const ITEM_TYPES = {
  VIDEO: "video",
  QUIZ: "quiz",
  ASSESSMENT: "assessment",
  DOCUMENT: "document",
  PRACTICE: "practice",
  ARTICLE: "article",
  LINK: "link",
  TEXT: "text",
  CODE: "code"
};

const ITEM_STATUS = {
  LOCKED: "locked",
  AVAILABLE: "available",
  COMPLETED: "completed",
  IN_PROGRESS: "in_progress",
};

interface Lesson {
  _id?: string;
  id?: string; // fallback in case both exist
  title: string;
  description?: string;
  duration?: number;
  is_completed?: boolean;
  status?: string;
  isPreview?: boolean;
  type?: string;
  lessonType?: string;
  meta?: {
    presenter?: string;
    passing_score?: number;
    due_date?: string;
    [key: string]: any;
  };
  resources?: {
    title: string;
    url: string;
    fileUrl?: string;
  }[];
}

interface Section {
  id?: string;
  title: string;
  lessons: Lesson[];
  resources?: { title: string; fileUrl: string }[];
}

interface Week {
  id?: string;
  weekTitle: string;
  weekDescription?: string;
  sections: Section[];
}

interface CourseData {
  curriculum: Week[];
}

interface Bookmark {
  id: string | number;
  lessonId: string;
  time?: number;
  label: string;
  createdAt: string;
  thumbnailUrl?: string;
}

interface LessonAccordionProps {
  currentLessonId: string;
  courseData: CourseData;
  onLessonSelect: (lesson: Lesson) => void;
  className?: string;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  autoExpandCurrent?: boolean;
  isCollapsible?: boolean;
  bookmarks?: Bookmark[];
  onBookmarkSelect?: (bookmark: Bookmark) => void;
  onBookmarkRemove?: (bookmarkId: string | number) => void;
  showBookmarks?: boolean;
  currentProgress?: number;
}

const ItemTypeIcon: React.FC<{ type?: string; status?: string; className?: string }> = ({ type, status, className = "w-4 h-4" }) => {
  if (status === ITEM_STATUS.LOCKED) {
    return <Lock className={className} />;
  }

  const icons: Record<string, LucideIcon> = {
    [ITEM_TYPES.VIDEO]: Video,
    [ITEM_TYPES.QUIZ]: FileQuestion,
    [ITEM_TYPES.ASSESSMENT]: ClipboardList,
    [ITEM_TYPES.PRACTICE]: CheckSquare,
    [ITEM_TYPES.DOCUMENT]: FileBox,
    [ITEM_TYPES.ARTICLE]: FileText,
    [ITEM_TYPES.LINK]: ExternalLink,
    [ITEM_TYPES.TEXT]: FileText,
    [ITEM_TYPES.CODE]: Code
  };

  // Convert to lowercase for case-insensitive matching
  const lowerType = (type || "").toLowerCase();
  
  // Find the right icon by checking if the type contains any of our recognized types
  let IconComponent = FileText; // Default icon
  
  for (const [key, value] of Object.entries(ITEM_TYPES)) {
    if (lowerType === value || lowerType.includes(value)) {
      IconComponent = icons[value];
      break;
    }
  }
  
  return <IconComponent className={className} />;
};

const ProgressBar: React.FC<{ progress: number; animate?: boolean; showTooltip?: boolean }> = ({ progress, animate = true, showTooltip = false }) => (
  <div className="relative group">
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2.5 bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm">
        <motion.div
          initial={animate ? { width: 0 } : { width: `${progress}%` }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className={`h-full rounded-full ${
            progress === 100 
              ? "bg-gradient-to-r from-green-400 to-green-500" 
              : progress > 50 
                ? "bg-gradient-to-r from-primaryColor/90 to-primaryColor" 
                : "bg-gradient-to-r from-primaryColor/70 to-primaryColor/90"
          }`}
        />
      </div>
      {showTooltip && (
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 min-w-[40px] text-right tabular-nums">
          {progress}%
        </span>
      )}
    </div>
    {showTooltip && (
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="bg-gray-900 text-white text-xs rounded-lg py-1.5 px-3 font-medium whitespace-nowrap shadow-lg">
          {progress}% complete
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
        </div>
      </div>
    )}
  </div>
);

// Helper function to format duration (in minutes)
const formatDuration = (duration: number | string | undefined): string => {
  if (!duration) return "0min";
  if (typeof duration === "string") return duration;
  if (duration < 60) return `${duration}min`;
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
};

// Add formatTime helper function
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const LessonAccordion: React.FC<LessonAccordionProps> = ({
  currentLessonId,
  courseData,
  onLessonSelect,
  className = "",
  searchTerm = "",
  onSearchChange = () => {},
  autoExpandCurrent = true,
  isCollapsible = false,
  bookmarks = [],
  onBookmarkSelect,
  onBookmarkRemove,
  showBookmarks = false,
  currentProgress = 0,
}) => {
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [searchResults, setSearchResults] = useState<
    { lesson: Lesson; weekIndex: number; sectionIndex: number; weekTitle: string; sectionTitle: string }[]
  >([]);
  const [isAccordionCollapsed, setIsAccordionCollapsed] = useState(false);
  const [showBookmarkSection, setShowBookmarkSection] = useState(showBookmarks);
  const [bookmarkFilter, setBookmarkFilter] = useState("all");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showQuickFilters, setShowQuickFilters] = useState(false);

  // Auto-expand week/section containing the current lesson
  useEffect(() => {
    if (autoExpandCurrent && currentLessonId && courseData?.curriculum) {
      courseData.curriculum.forEach((week, weekIndex) => {
        week.sections.forEach((section, sectionIndex) => {
          if (section.lessons.some(lesson => (lesson._id || lesson.id) === currentLessonId)) {
            setExpandedWeeks(prev => new Set([...prev, weekIndex]));
            setExpandedSections(prev => new Set([...prev, `${weekIndex}-${sectionIndex}`]));
          }
        });
      });
    }
  }, [autoExpandCurrent, currentLessonId, courseData]);

  // Update search results if searchTerm changes
  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }
    const lowerSearch = searchTerm.toLowerCase();
    const results: typeof searchResults = [];
    courseData?.curriculum?.forEach((week, weekIndex) => {
      week.sections.forEach((section, sectionIndex) => {
        section.lessons.forEach(lesson => {
          if (
            lesson.title.toLowerCase().includes(lowerSearch) ||
            (lesson.description && lesson.description.toLowerCase().includes(lowerSearch))
          ) {
            results.push({
              lesson,
              weekIndex,
              sectionIndex,
              weekTitle: week.weekTitle,
              sectionTitle: section.title,
            });
          }
        });
      });
    });
    setSearchResults(results);
  }, [searchTerm, courseData]);

  const toggleWeek = useCallback((weekIndex: number) => {
    setExpandedWeeks(prev => {
      const newSet = new Set(prev);
      newSet.has(weekIndex) ? newSet.delete(weekIndex) : newSet.add(weekIndex);
      return newSet;
    });
  }, []);

  const toggleSection = useCallback((weekIndex: number, sectionIndex: number) => {
    const key = `${weekIndex}-${sectionIndex}`;
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      newSet.has(key) ? newSet.delete(key) : newSet.add(key);
      return newSet;
    });
  }, []);

  const toggleAccordionCollapse = () => {
    setIsAccordionCollapsed(!isAccordionCollapsed);
  };

  // Compute overall progress from curriculum
  const totalProgress = useMemo(() => {
    let completed = 0, total = 0;
    courseData?.curriculum.forEach(week => {
      week.sections.forEach(section => {
        section.lessons.forEach(lesson => {
          total++;
          if (lesson.is_completed) completed++;
        });
      });
    });
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }, [courseData]);

  // Bookmark section toggle
  const toggleBookmarkSection = useCallback(() => {
    setShowBookmarkSection(!showBookmarkSection);
  }, [showBookmarkSection]);

  // Filter bookmarks by category or timeframe
  const filteredBookmarks = useMemo(() => {
    if (bookmarkFilter === "all") return bookmarks;
    
    // Additional filtering logic based on bookmarkFilter value
    // For example: recent, by module, etc.
    if (bookmarkFilter === "recent") {
      return [...bookmarks].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ).slice(0, 5);
    }
    
    return bookmarks;
  }, [bookmarks, bookmarkFilter]);

  // Group lessons by categories for quick filtering
  const lessonCategories = useMemo(() => {
    const categories = new Set<string>();
    courseData?.curriculum?.forEach(week => {
      week.sections.forEach(section => {
        section.lessons.forEach(lesson => {
          if (lesson.type) categories.add(lesson.type);
        });
      });
    });
    return Array.from(categories);
  }, [courseData]);

  const handleCategoryFilter = (category: string | null) => {
    setActiveCategory(category);
    // If a category is selected, expand all weeks to show filtered content
    if (category) {
      const allWeekIndices = courseData?.curriculum.map((_, index) => index) || [];
      setExpandedWeeks(new Set(allWeekIndices));
    }
  };

  // Filter lessons by type if a category is selected
  const shouldShowLesson = (lesson: Lesson) => {
    if (!activeCategory) return true;
    return lesson.type === activeCategory;
  };

  const renderWeekHeader = useCallback((week: Week, weekIndex: number) => {
    let totalLessons = 0, completedLessons = 0;
    week.sections.forEach(section => {
      totalLessons += section.lessons.length;
      completedLessons += section.lessons.filter(lesson => lesson.is_completed).length;
    });
    const weekProgress = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return (
      <div className="border-b border-gray-200 dark:border-gray-700/50 last:border-0" key={week.id || weekIndex}>
        <div className="w-full flex items-start justify-between p-4 bg-gray-50/80 dark:bg-gray-800/40">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="mt-1 w-6 h-6 rounded-lg bg-primaryColor/10 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-primaryColor" />
              </div>
              <div className="text-left">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  {week.weekTitle || `Week ${weekIndex + 1}`}
                </h3>
                {week.weekDescription && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {week.weekDescription}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1.5 bg-gray-100/80 dark:bg-gray-800/60 px-2 py-1 rounded-md">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{completedLessons} of {totalLessons} completed</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-primaryColor/10 text-primaryColor px-2 py-1 rounded-md">
                      <ChartBar className="w-3.5 h-3.5" />
                      <span className="font-medium">{weekProgress}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, []);

  const renderSectionHeader = useCallback((section: Section, weekIndex: number, sectionIndex: number) => {
    const key = `${weekIndex}-${sectionIndex}`;
    const isExpanded = expandedSections.has(key);
    const totalLessons = section.lessons.length;
    const completedLessons = section.lessons.filter(lesson => lesson.is_completed).length;
    const sectionProgress = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return (
      <div className="border-b border-gray-200 dark:border-gray-700/50 last:border-0" key={section.id || sectionIndex}>
        <button
          onClick={() => toggleSection(weekIndex, sectionIndex)}
          className={clsx(
            "group w-full flex items-start justify-between",
            "p-4 pl-12",
            "hover:bg-gray-50/80 dark:hover:bg-gray-800/40",
            "transition-all duration-200 ease-in-out"
          )}
          aria-expanded={isExpanded}
        >
          <div className="flex-1">
            <div className="flex items-start gap-2.5">
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className={clsx(
                  "mt-1 w-5 h-5 rounded-lg",
                  "bg-gray-100 dark:bg-gray-800",
                  "flex items-center justify-center",
                  "group-hover:bg-primaryColor/10",
                  "transition-all duration-200"
                )}
              >
                <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-primaryColor" />
              </motion.div>
              <div className="text-left min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className={clsx(
                    "text-sm font-medium",
                    "text-gray-800 dark:text-gray-200",
                    "group-hover:text-primaryColor",
                    "transition-colors duration-200"
                  )}>
                    {section.title}
                  </h4>
                  <span className={clsx(
                    "px-2 py-0.5 rounded-full text-xs font-medium",
                    "bg-gray-100/80 dark:bg-gray-800/60",
                    "text-gray-600 dark:text-gray-400",
                    "backdrop-blur-sm"
                  )}>
                    {totalLessons} {totalLessons === 1 ? 'lesson' : 'lessons'}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1.5 bg-gray-100/80 dark:bg-gray-800/60 px-2 py-1 rounded-md backdrop-blur-sm">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{completedLessons} of {totalLessons} completed</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-primaryColor/10 text-primaryColor px-2 py-1 rounded-md backdrop-blur-sm">
                      <ChartBar className="w-3.5 h-3.5" />
                      <span className="font-medium">{sectionProgress}%</span>
                    </div>
                  </div>
                </div>
                
                {section.resources && section.resources.length > 0 && (
                  <motion.div 
                    className="flex flex-wrap gap-2 mt-3"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {section.resources.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={clsx(
                          "inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium",
                          "bg-gray-100/80 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300",
                          "hover:bg-primaryColor/10 hover:text-primaryColor",
                          "transition-all duration-200 backdrop-blur-sm",
                          "focus:outline-none focus:ring-2 focus:ring-primaryColor/30"
                        )}
                      >
                        <Download className="w-3.5 h-3.5 mr-1.5" />
                        {resource.title}
                      </a>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </button>
      </div>
    );
  }, [expandedSections, toggleSection]);

  const renderLesson = useCallback((lesson: Lesson) => {
    const lessonId = lesson._id || lesson.id;
    if (!lessonId) return null;
    
    if (!shouldShowLesson(lesson)) return null;
    
    const isActive = lessonId === currentLessonId;
    const isCompleted = lesson.is_completed;
    const isLocked = lesson.status === ITEM_STATUS.LOCKED;
    const isPreview = lesson.isPreview;
    const lessonType = lesson.type || lesson.lessonType || "video";
    const hasBookmarks = bookmarks.some(bookmark => bookmark.lessonId === lessonId);

    return (
      <motion.div
        key={lessonId}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className={clsx(
          "pl-[4.5rem] py-3 relative group",
          isActive ? "bg-primaryColor/10" : "hover:bg-gray-50/80 dark:hover:bg-gray-800/60",
          "transition-all duration-200 ease-in-out"
        )}
      >
        <button
          onClick={() => onLessonSelect(lesson)}
          disabled={isLocked}
          className={clsx(
            "w-full flex items-start gap-3 focus:outline-none focus:ring-2 focus:ring-primaryColor/30 rounded-lg p-2",
            isLocked ? "cursor-not-allowed opacity-50" : "",
            "transition-all duration-200"
          )}
        >
          <div
            className={clsx(
              "w-6 h-6 mt-1 rounded-full flex items-center justify-center transition-all duration-300",
              isCompleted
                ? "bg-gradient-to-br from-green-400 to-green-500 shadow-lg shadow-green-500/20"
                : isActive
                ? "border-2 border-primaryColor bg-primaryColor/10 shadow-lg shadow-primaryColor/20"
                : "border-2 border-gray-300 dark:border-gray-600 group-hover:border-primaryColor/70",
              "transform group-hover:scale-110 transition-transform duration-200"
            )}
          >
            {isCompleted ? (
              <CheckCircle className="w-3.5 h-3.5 text-white" />
            ) : isLocked ? (
              <Lock className="w-3.5 h-3.5 text-gray-400" />
            ) : (
              <ItemTypeIcon type={lessonType} className="w-3.5 h-3.5 text-primaryColor" />
            )}
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={clsx(
                "text-sm font-medium transition-colors duration-200",
                isActive 
                  ? "text-primaryColor"
                  : "text-gray-900 dark:text-white group-hover:text-primaryColor"
              )}>
                {lesson.title}
              </span>
              {isPreview && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100/80 text-green-800 dark:bg-green-900/30 dark:text-green-400 backdrop-blur-sm">
                  Preview
                </span>
              )}
              {hasBookmarks && (
                <motion.span 
                  className="w-4 h-4 flex-shrink-0"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                  <Bookmark className="w-full h-full text-yellow-500" />
                </motion.span>
              )}
              
              {lessonType && lessonType !== "video" && (
                <span className={clsx(
                  "px-2 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm",
                  lessonType === "quiz" 
                    ? "bg-yellow-100/80 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" 
                    : lessonType === "assessment" || lessonType === "assignment"
                    ? "bg-orange-100/80 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                    : "bg-gray-100/80 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                )}>
                  {lessonType.charAt(0).toUpperCase() + lessonType.slice(1)}
                </span>
              )}
            </div>
            {lesson.description && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-200"
              >
                {lesson.description}
              </motion.p>
            )}
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-2.5 flex-wrap">
              {lesson.duration && (
                <span className="flex items-center gap-1.5 bg-gray-100/80 dark:bg-gray-800/60 px-2 py-1 rounded-md backdrop-blur-sm">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDuration(lesson.duration)}
                </span>
              )}
              {lessonType && (
                <span className="flex items-center gap-1.5 bg-gray-100/80 dark:bg-gray-800/60 px-2 py-1 rounded-md backdrop-blur-sm">
                  <ItemTypeIcon type={lessonType} className="w-3.5 h-3.5" />
                  {lessonType.charAt(0).toUpperCase() + lessonType.slice(1)}
                </span>
              )}
              {lesson.meta?.presenter && (
                <span className="flex items-center gap-1.5 bg-gray-100/80 dark:bg-gray-800/60 px-2 py-1 rounded-md backdrop-blur-sm">
                  <Users className="w-3.5 h-3.5" />
                  {lesson.meta.presenter}
                </span>
              )}
            </div>
            {lesson.resources && lesson.resources.length > 0 && (
              <motion.div 
                className="flex flex-wrap gap-2 mt-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {lesson.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url || resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={clsx(
                      "inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium",
                      "bg-gray-100/80 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300",
                      "hover:bg-primaryColor/10 hover:text-primaryColor",
                      "transition-all duration-200 backdrop-blur-sm",
                      "focus:outline-none focus:ring-2 focus:ring-primaryColor/30"
                    )}
                  >
                    <Download className="w-3.5 h-3.5 mr-1.5" />
                    {resource.title}
                  </a>
                ))}
              </motion.div>
            )}
          </div>
        </button>
      </motion.div>
    );
  }, [currentLessonId, onLessonSelect, bookmarks, activeCategory, shouldShowLesson]);

  const SearchResults = () => {
    if (!searchResults.length) {
      return (
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800/60 flex items-center justify-center">
            <FileQuestion className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            No lessons found matching "{searchTerm}"
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Try adjusting your search terms or browse the curriculum below
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-2 p-4">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center justify-between">
          <span>Found {searchResults.length} results</span>
          <button
            onClick={() => onSearchChange("")}
            className="text-xs text-primaryColor hover:text-primaryColor/70 flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            Clear search
          </button>
        </div>
        {searchResults.map((result, index) => (
          <motion.div
            key={result.lesson._id || result.lesson.id || index}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={clsx(
              "bg-white dark:bg-gray-800/50 rounded-lg",
              "hover:bg-gray-50 dark:hover:bg-gray-800/80",
              "transition-all duration-200 group"
            )}
          >
            <button
              onClick={() => {
                onLessonSelect(result.lesson);
                setExpandedWeeks(new Set([result.weekIndex]));
                setExpandedSections(new Set([`${result.weekIndex}-${result.sectionIndex}`]));
              }}
              className="w-full text-left p-4"
            >
              <div className="flex items-start gap-3">
                <div className={clsx(
                  "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                  "bg-primaryColor/10 group-hover:bg-primaryColor/20",
                  "transition-colors duration-200"
                )}>
                  <ItemTypeIcon 
                    type={result.lesson.type} 
                    className="w-5 h-5 text-primaryColor"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primaryColor transition-colors">
                    {result.lesson.title}
                  </h4>
                  {result.lesson.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {result.lesson.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      {result.weekTitle}
                    </span>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {result.sectionTitle}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primaryColor transition-colors" />
              </div>
            </button>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderBookmarkSection = () => {
    if (!showBookmarkSection) return null;
    
    return (
      <div className="border-b border-gray-200 dark:border-gray-700/50">
        <div className="p-4 bg-yellow-50/50 dark:bg-yellow-900/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white flex items-center">
              <Bookmark className="w-4 h-4 mr-2 text-yellow-500" />
              My Bookmarks
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setBookmarkFilter("all")}
                className={`text-xs px-2 py-1 rounded-md transition-colors ${
                  bookmarkFilter === "all" 
                    ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200" 
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setBookmarkFilter("recent")}
                className={`text-xs px-2 py-1 rounded-md transition-colors ${
                  bookmarkFilter === "recent" 
                    ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200" 
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                }`}
              >
                Recent
              </button>
            </div>
          </div>
          
          {filteredBookmarks.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
              {filteredBookmarks.map((bookmark) => (
                <motion.div
                  key={bookmark.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2 p-2 bg-white dark:bg-gray-800/50 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/10 cursor-pointer group"
                  onClick={() => onBookmarkSelect?.(bookmark)}
                >
                  {bookmark.thumbnailUrl && (
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={bookmark.thumbnailUrl} 
                        alt="" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate group-hover:text-yellow-700 dark:group-hover:text-yellow-300">
                      {bookmark.label}
                    </h4>
                    {bookmark.time !== undefined && (
                      <div className="text-xs text-gray-500">
                        {formatTime(bookmark.time)}
                      </div>
                    )}
                  </div>
                  {onBookmarkRemove && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookmarkRemove(bookmark.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                    >
                      <X className="w-3 h-3 text-gray-500" />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="w-10 h-10 mx-auto mb-2 flex items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                <Bookmark className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No bookmarks yet
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Add bookmarks while watching videos
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!courseData?.curriculum || courseData.curriculum.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Course content is being prepared</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-md">
            Our instructors are setting up comprehensive learning materials for this course.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <a 
              href="/contact" 
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Contact Support
            </a>
          </div>
          <div className="mt-4 text-xs text-gray-400">
            Course ID: {typeof courseData === 'object' && 'courseId' in courseData ? courseData.courseId : 'Unknown'}
          </div>
        </div>
      </div>
    );
  }

  // Check if this is a fallback curriculum structure (empty curriculum)
  const isFallbackCurriculum = courseData.curriculum.some(week => 
    week.weekTitle === 'Getting Started' && 
    week.sections?.length === 1 && 
    week.sections[0]?.lessons?.length === 0
  );

  if (isFallbackCurriculum) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Course curriculum is being prepared
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-md">
            Our instructors are busy setting up an amazing learning experience for you. 
            This course will be available soon!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <a 
              href="/contact" 
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Contact Support
            </a>
          </div>
        </div>
      </div>
    );
  }

  // If accordion is collapsed, show only a minimal view
  if (isAccordionCollapsed) {
    return (
      <div className={`h-full flex flex-col ${className}`}>
        <div className="flex-1 overflow-y-auto py-2 px-1">
          <div className="space-y-3">
            {courseData.curriculum.map((week, weekIndex) => {
              const isActiveWeek = week.sections.some(section => 
                section.lessons.some(lesson => 
                  (lesson._id || lesson.id) === currentLessonId
                )
              );
              
              return (
                <div 
                  key={week.id || weekIndex} 
                  className={clsx(
                    "rounded-md p-2 text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors",
                    isActiveWeek ? "bg-primaryColor/10" : ""
                  )}
                  onClick={() => {
                    toggleAccordionCollapse();
                    // Also expand this week
                    setExpandedWeeks(new Set([weekIndex]));
                  }}
                >
                  <div className="w-8 h-8 mx-auto mb-1 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                    <Sidebar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </div>
                  <p className="text-xs font-medium line-clamp-2">
                    {week.weekTitle || `Week ${weekIndex + 1}`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Removed Course Progress Section */}
      {/* {renderCourseProgress()} */}
      
      {/* Render bookmark section if enabled */}
      {!isAccordionCollapsed && showBookmarks && renderBookmarkSection()}
      
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-px">
          {courseData.curriculum.map((week, weekIndex) => (
            <div key={week.id || weekIndex}>
              {renderWeekHeader(week, weekIndex)}
              <div className="overflow-hidden bg-gray-50/50 dark:bg-gray-800/50">
                {week.sections.map((section, sectionIndex) => (
                  <div key={section.id || sectionIndex}>
                    {renderSectionHeader(section, weekIndex, sectionIndex)}
                    <AnimatePresence>
                      {expandedSections.has(`${weekIndex}-${sectionIndex}`) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          {section.lessons.map((lesson) => renderLesson(lesson))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LessonAccordion;