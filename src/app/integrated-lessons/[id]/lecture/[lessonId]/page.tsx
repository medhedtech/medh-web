"use client";
import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import LessonAccordion from '@/components/shared/lessons/LessonAccordion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Loader, 
  Target, 
  CheckCircle, 
  FileText,
  Video,
  Link2,
  Code2,
  FileQuestion,
  ExternalLink,
  FileBox,
  RefreshCw,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  Bookmark,
  Download,
  MessageSquare,
  Heart,
  Reply,
  Share2,
  Send,
  Image as ImageIcon,
  AtSign,
  Edit2,
  Trash2,
  Copy,
  Tag,
  ThumbsUp,
  Hash,
  HelpCircle,
  ArrowUpRight,
  Calendar,
  ChevronUp,
  ChevronDown,
  X,
  Clock,
  PlayCircle,
  PauseCircle,
  BookOpen,
  Maximize2,
  Minimize2,
  SkipBack,
  SkipForward,
  Volume2,
  Settings,
  ArrowLeft,
  Home,
  Star,
  Users,
  Globe,
  Layers,
  Activity,
  ChartBar
} from 'lucide-react';
import useCourseLesson from '@/hooks/useCourseLesson.hook';
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import { toast } from "react-toastify";
import ErrorDisplay from "@/components/shared/ErrorDisplay";
import VideoPlayer from '@/components/shared/lessons/VideoPlayer';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { debounce } from 'lodash';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import dynamic from 'next/dynamic';
import { formatDistanceToNow } from 'date-fns';
import { useStorage } from '@/contexts/StorageContext';

// Dynamically import Markdown editor to avoid SSR issues
const MarkdownEditor = dynamic(() => import('@/components/shared/MarkdownEditor'), { 
  ssr: false,
  loading: () => <div className="h-64 w-full bg-gray-50 dark:bg-gray-800 animate-pulse rounded-xl"></div>
});

// Import components for different lesson types
const QuizComponent = dynamic(() => import('@/components/shared/lessons/QuizComponent'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-50 dark:bg-gray-800 animate-pulse rounded-xl p-6">Loading Quiz...</div>
});

const AssessmentComponent = dynamic(() => import('@/components/shared/lessons/AssessmentComponent'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-50 dark:bg-gray-800 animate-pulse rounded-xl p-6">Loading Assignment...</div>
});

// Update interfaces at the top of the file
interface Lesson {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  order?: number;
  lessonType: 'video' | 'quiz' | 'assessment';
  isPreview?: boolean;
  meta?: LessonMeta;
  resources?: any[];
  video_url?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  quiz_id?: string;
  assignment_id?: string;
  is_completed?: boolean;
  completed?: boolean;
  duration?: string | number;
}

interface LessonData {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  lessonType?: 'video' | 'quiz' | 'assessment';
  videoUrl?: string;
  video_url?: string;
  thumbnailUrl?: string;
  is_completed?: boolean;
  completed?: boolean;
  order?: number;
  isPreview?: boolean;
  duration?: string | number;
  quiz_id?: string;
  assignment_id?: string;
  meta?: {
    presenter?: string;
    transcript?: string;
    time_limit?: number;
    passing_score?: number;
    due_date?: string;
    max_score?: number;
  };
  resources?: Array<{
    id: string;
    title: string;
    url: string;
    type: string;
    description?: string;
  }>;
}

interface LessonMeta {
  presenter?: string | null;
  transcript?: string | null;
  time_limit?: number | null;
  passing_score?: number | null;
  due_date?: string | null;
  max_score?: number | null;
}

interface Section {
  id?: string;
  title: string;
  description?: string;
  order?: number;
  lessons: LessonData[];
  resources?: any[];
  _id?: string;
}

interface CourseSection extends Omit<Section, 'id'> {
  id?: string;
}

interface Week {
  id?: string;
  weekTitle: string;
  weekDescription?: string;
  sections?: Section[];
  lessons?: LessonData[];
  topics?: string[];
  _id?: string;
}

interface CourseWeek extends Omit<Week, 'sections'> {
  sections?: CourseSection[];
}

interface VideoBookmark {
  id: string | number;
  time: number;
  label: string;
}

interface CourseData {
  _id: string;
  course_title: string;
  curriculum: Week[];
}

interface Comment {
  id: number;
  text: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
  timestamp: string;
  likes: number;
  replies: Comment[];
  liked?: boolean;
}

interface NotesTabProps {
  lessonId: string;
  bookmarks: VideoBookmark[];
  formatTime: (seconds: number) => string;
  lessonType: string;
}

interface CompletionData {
  completed_at: string;
  quiz_score?: number;
}

// Add interface for progress data
interface LessonProgress {
  lessonId: string;
  courseId: string;
  progress: number;
  currentTime: number;
  updatedAt: string;
}

// Helper function to handle YouTube URLs
const formatVideoUrl = (url: string | undefined): string | null => {
  if (!url) return null;
  
  try {
    // If it's already a valid URL, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Handle YouTube URLs
    if (url.includes('youtube.com/watch?v=') || url.includes('youtu.be/')) {
      return url;
    }
    
    // If it looks like a YouTube video ID, construct the full URL
    if (url.match(/^[a-zA-Z0-9_-]{11}$/)) {
      return `https://www.youtube.com/watch?v=${url}`;
    }
    
    // Return as is for other cases
    return url;
  } catch (error) {
    console.error('Error formatting video URL:', error);
    return url;
  }
};

const IntegratedLessonPage = () => {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id as string;
  const lessonId = params?.lessonId as string;
  
  // Existing hooks and state
  const {
    loading,
    error,
    courseData,
    lessonData,
    handleRetry,
    markLessonComplete,
    getLoading,
    postLoading,
  } = useCourseLesson(courseId, lessonId);

  const storageContext = useStorage();
  const savedProgress = storageContext?.getLessonProgress?.(lessonId);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [videoBookmarks, setVideoBookmarks] = useState<VideoBookmark[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVideoControls, setShowVideoControls] = useState(true);
  
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  
  // Find adjacent lessons function
  const findAdjacentLessons = useCallback((curriculum: CourseWeek[]): { prevLesson: Lesson | null; nextLesson: Lesson | null } => {
    if (!curriculum || !lessonId) return { prevLesson: null, nextLesson: null };

    const allLessons: Lesson[] = [];
    
    // Flatten curriculum into a single array of lessons
    curriculum.forEach(week => {
      if (week.lessons) {
        allLessons.push(...week.lessons);
      }
      if (week.sections) {
        week.sections.forEach(section => {
          if (section.lessons) {
            allLessons.push(...section.lessons);
          }
        });
      }
    });

    // Find current lesson index
    const currentIndex = allLessons.findIndex(lesson => 
      lesson._id === lessonId || lesson.id === lessonId
    );

    if (currentIndex === -1) return { prevLesson: null, nextLesson: null };

    return {
      prevLesson: currentIndex > 0 ? allLessons[currentIndex - 1] : null,
      nextLesson: currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null
    };
  }, [lessonId]);

  // Find adjacent lessons using existing function
  const { prevLesson, nextLesson } = findAdjacentLessons(courseData?.curriculum || []);
  const lessonType = lessonData?.lessonType || 'video';

  // Existing utility functions remain
  const handleLessonSelect = (lesson: Lesson) => {
    const selectedId = lesson._id || lesson.id;
    router.push(`/integrated-lessons/${courseId}/lecture/${selectedId}`);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const handleAddVideoBookmark = (bookmark: VideoBookmark) => {
    setVideoBookmarks(prev => {
      const newBookmarks = [...prev, bookmark];
      // Save to localStorage
      localStorage.setItem(`video-bookmarks-${lessonId}`, JSON.stringify(newBookmarks));
      toast.success(`Bookmark added at ${formatTime(bookmark.time)}`);
      return newBookmarks;
    });
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Load saved bookmarks when component mounts
  useEffect(() => {
    if (lessonId) {
      const savedBookmarks = localStorage.getItem(`video-bookmarks-${lessonId}`);
      if (savedBookmarks) {
        try {
          setVideoBookmarks(JSON.parse(savedBookmarks));
        } catch (error) {
          console.error("Failed to parse saved bookmarks:", error);
        }
      }
    }
  }, [lessonId]);

  // Notify user of errors
  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred");
    }
  }, [error]);

  // Close mobile sidebar when changing lessons
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [lessonId]);

  // Loading state
  if (loading) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
          <div className="flex items-center justify-center min-h-screen">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto"
              >
                <div className="w-full h-full border-4 border-emerald-200 dark:border-emerald-800 border-t-emerald-600 dark:border-t-emerald-400 rounded-full"></div>
              </motion.div>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Loading Your Lesson</h2>
                <p className="text-gray-600 dark:text-gray-400">Please wait while we prepare your content</p>
            </div>
            </motion.div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  // Error state
  if (error && !loading) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-rose-100 dark:from-gray-900 dark:via-red-900/20 dark:to-pink-900/20">
          <ErrorDisplay
            error={{
              type: "error",
              message: error.message || "An error occurred",
              details: "Please try again later",
            }}
            onRetry={handleRetry}
          />
        </div>
      </PageWrapper>
    );
  }

  if (!courseData || !lessonData) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-gray-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Content Not Found</h2>
              <p className="text-gray-600 dark:text-gray-300">The requested lesson could not be found.</p>
            </div>
            <button 
              onClick={() => router.push(`/integrated-lessons/${courseId}`)}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2 inline" />
              Back to Course
            </button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Modern Header */}
        <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left side - Navigation */}
              <div className="flex items-center space-x-4">
              <button
                  onClick={() => router.push(`/integrated-lessons/${courseId}`)}
                  className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                
                <div className="hidden sm:block">
                  <nav className="flex items-center space-x-2 text-sm">
                    <button
                      onClick={() => router.push('/courses')}
                      className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                      <Home className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <button
                      onClick={() => router.push(`/integrated-lessons/${courseId}`)}
                      className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors truncate max-w-40"
                    >
                      {courseData.course_title}
                    </button>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium truncate max-w-40">
                      {lessonData.title}
                    </span>
                  </nav>
                </div>
              </div>

              {/* Right side - Actions */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                  className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                <Menu className="w-5 h-5" />
              </button>
                
                <div className="hidden sm:flex items-center space-x-2">
                  <button className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                    <Bookmark className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                    <Share2 className="w-5 h-5" />
                  </button>
            </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Layout */}
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Video/Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video Player or Content Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700"
              >
            {lessonType === 'video' && (
                  <div className="aspect-video bg-gray-900 relative group">
                {(lessonData as LessonData).videoUrl || (lessonData as LessonData).video_url ? (
                      <div className="relative h-full">
                    {savedProgress && savedProgress.progress < 90 && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="absolute top-4 right-4 z-10 bg-black/80 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 backdrop-blur-sm"
                          >
                        <RefreshCw className="w-4 h-4" />
                            <span>Resume from {Math.floor(savedProgress.progress)}%</span>
                          </motion.div>
                    )}
                        
                    <VideoPlayer
                      src={formatVideoUrl(lessonData?.videoUrl || lessonData?.video_url)}
                          poster={lessonData?.thumbnailUrl}
                      autoplay={false}
                      bookmarks={videoBookmarks}
                      onBookmark={handleAddVideoBookmark}
                      initialTime={savedProgress?.currentTime}
                      onProgress={(progress: number, currentTime: number) => {
                        if (Math.floor(currentTime) % 5 === 0) {
                          try {
                            storage.updateLessonProgress(lessonId, courseId, progress, currentTime);
                            storage.trackLastViewedCourse(courseId);

                            if (progress >= 90 && !lessonData.is_completed && !lessonData.completed) {
                              let totalLessons = 0;
                              courseData?.curriculum?.forEach(week => {
                                week.sections?.forEach(section => {
                                  totalLessons += section.lessons?.length || 0;
                                });
                              });
                              
                              storage.completeLessonAndUpdateProgress(lessonId, courseId, totalLessons);
                              markLessonComplete({
                                completed_at: new Date().toISOString()
                              });
                            }
                          } catch (error) {
                            console.error('Error saving progress:', error);
                          }
                        }
                      }}
                      onEnded={() => {
                        if (lessonData && !lessonData.is_completed && !lessonData.completed) {
                          markLessonComplete({
                            completed_at: new Date().toISOString()
                          });
                        }
                        
                        if (nextLesson) {
                          setTimeout(() => {
                            const nextId = nextLesson._id?.$oid || nextLesson._id || nextLesson.id;
                            router.push(`/integrated-lessons/${courseId}/lecture/${nextId}`);
                          }, 1500);
                        }
                      }}
                      onError={() => {
                        toast.error("Failed to load video. Please try again.");
                      }}
                    />
                        
                        {/* Custom video overlay controls */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                ) : (
                      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-800 to-gray-900 text-white p-8">
                        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6">
                          <Video className="w-10 h-10 text-white/70" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">No Video Available</h3>
                        <p className="text-white/70 text-center max-w-md mb-6">
                          This lesson content is available in the Overview section below, or you can continue to the next lesson.
                    </p>
                    {nextLesson && (
                      <button
                        onClick={() => router.push(`/integrated-lessons/${courseId}/lecture/${nextLesson._id || nextLesson.id}`)}
                            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl flex items-center transition-all shadow-lg hover:shadow-xl"
                      >
                            Next Lesson
                            <ChevronRight className="w-5 h-5 ml-2" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {lessonType === 'quiz' && (
                  <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
                        <FileQuestion className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quiz</h2>
                        <p className="text-blue-600 dark:text-blue-400">{lessonData?.title}</p>
                      </div>
                </div>
                <QuizComponent 
                  quizId={lessonData?.quiz_id} 
                  lessonId={lessonId}
                  courseId={courseId}
                  meta={lessonData?.meta || {}}
                  onComplete={(result) => {
                    if (result.passed && !lessonData.is_completed && !lessonData.completed) {
                      markLessonComplete({
                        completed_at: new Date().toISOString(),
                        quiz_score: result.score
                      });
                    }
                  }}
                />
              </div>
            )}
            
            {lessonType === 'assessment' && (
                  <div className="p-8 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mr-4">
                        <FileBox className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Assignment</h2>
                        <p className="text-orange-600 dark:text-orange-400">{lessonData?.title}</p>
                      </div>
                </div>
                <AssessmentComponent 
                  assignmentId={lessonData?.assignment_id}
                  lessonId={lessonId}
                  courseId={courseId}
                  meta={lessonData?.meta || {}}
                  onSubmit={(submission) => {
                    toast.success("Assignment submitted successfully!");
                  }}
                />
              </div>
            )}
              </motion.div>

              {/* Lesson Info & Navigation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                {/* Lesson Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {lessonData.title}
              </h1>
                    {lessonData.description && (
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {lessonData.description}
                      </p>
                    )}
                  </div>
                  
                  {/* Lesson Meta */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    {lessonData.duration && (
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {lessonData.duration}
                      </div>
                    )}
                    {lessonData.is_completed || lessonData.completed ? (
                      <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Completed
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Activity className="w-4 h-4 mr-1" />
                        In Progress
                      </div>
                    )}
                  </div>
                </div>

                {/* Navigation Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                  <button
                    onClick={() => prevLesson && router.push(`/integrated-lessons/${courseId}/lecture/${prevLesson._id || prevLesson.id}`)}
                    disabled={!prevLesson}
                    className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                      prevLesson 
                        ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20' 
                        : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous Lesson
                    </button>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Lesson Progress
              </div>
                  
                  <button
                    onClick={() => nextLesson && router.push(`/integrated-lessons/${courseId}/lecture/${nextLesson._id || nextLesson.id}`)}
                    disabled={!nextLesson}
                    className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                      nextLesson 
                        ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20' 
                        : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    Next Lesson
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </motion.div>

              {/* Tab Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
              >
                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                  {[
                    { id: 'overview', label: 'Overview', icon: BookOpen },
                    { id: 'resources', label: 'Resources', icon: FileBox },
                    { id: 'notes', label: 'Notes', icon: FileText },
                    { id: 'discussion', label: 'Discussion', icon: MessageSquare },
                    { id: 'progress', label: 'Course Progress', icon: Activity }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center px-4 sm:px-6 py-4 text-sm font-medium transition-all border-b-2 ${
                          activeTab === tab.id
                            ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">{tab.label}</span>
                        <span className="sm:hidden">{tab.label.substring(0, 4)}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Tab Content */}
                <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                    >
                      {activeTab === 'progress' && <CourseProgressTab courseData={courseData} lessonData={lessonData} currentLessonId={lessonId} />}
                      {activeTab === 'overview' && <OverviewTab lessonData={lessonData} lessonType={lessonType} />}
                      {activeTab === 'resources' && <ResourcesTab resources={lessonData?.resources || []} />}
                      {activeTab === 'notes' && (
                    <NotesTab 
                      lessonId={lessonId} 
                      bookmarks={videoBookmarks}
                      formatTime={formatTime}
                      lessonType={lessonType}
                    />
                  )}
                      {activeTab === 'discussion' && (
                    <DiscussionTab 
                      lessonId={lessonId} 
                      courseId={courseId}
                          lessonTitle={lessonData.title}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
                </div>
              </motion.div>
            </div>

            {/* Sidebar - Course Navigation */}
            <div className={`lg:block ${mobileSidebarOpen ? 'block' : 'hidden'} lg:relative fixed inset-0 z-50 lg:z-auto`}>
              {/* Mobile backdrop */}
              {mobileSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm"
                  onClick={() => setMobileSidebarOpen(false)}
                />
              )}
              
              {/* Sidebar content */}
              <motion.div
                initial={isMobile ? { x: '100%' } : { opacity: 0 }}
                animate={isMobile ? { x: 0 } : { opacity: 1 }}
                exit={isMobile ? { x: '100%' } : { opacity: 0 }}
                className="lg:relative absolute right-0 top-0 h-full lg:h-auto w-80 lg:w-full max-w-md lg:max-w-none bg-white dark:bg-gray-800 lg:rounded-2xl shadow-xl lg:shadow-sm border-l lg:border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {/* Mobile Close Button */}
                <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Course Content</h3>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
              </div>

                {/* Course Content - All Scrollable */}
                <div className="h-full lg:max-h-[calc(100vh-2rem)] overflow-y-auto">
                  {/* Course Header - Now inside scrollable area */}
                  <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="lg:flex items-center justify-between mb-4 hidden">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Course Content</h3>
            </div>
                    
                    {/* Enhanced Course Info Card */}
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-xl p-4 border border-emerald-100 dark:border-emerald-800/30">
                      {/* Course Title and Icon */}
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                          <BookOpen className="w-6 h-6 text-white" />
          </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-emerald-800 dark:text-emerald-200 text-base leading-tight">
                            {courseData.course_title}
                          </h4>
                          <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                            Interactive Learning Path
                          </p>
        </div>
      </div>
    </div>
            </div>

                  {/* Course Curriculum */}
            <LessonAccordion
                    courseData={{ curriculum: courseData?.curriculum || [] }}
              onLessonSelect={handleLessonSelect}
                    currentLessonId={lessonId}
            />
          </div>
        </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

// Tab Components
const CourseProgressTab = ({ courseData, lessonData, currentLessonId }) => {
  // Calculate overall progress
  const calculateProgress = () => {
    let totalLessons = 0;
    let completedLessons = 0;
    const moduleProgress = [];

    courseData?.curriculum?.forEach((week, weekIndex) => {
      let weekTotal = 0;
      let weekCompleted = 0;

      if (week.lessons) {
        weekTotal += week.lessons.length;
        weekCompleted += week.lessons.filter(lesson => lesson.is_completed || lesson.completed).length;
      }

      if (week.sections) {
        week.sections.forEach(section => {
          if (section.lessons) {
            weekTotal += section.lessons.length;
            weekCompleted += section.lessons.filter(lesson => lesson.is_completed || lesson.completed).length;
          }
        });
      }

      totalLessons += weekTotal;
      completedLessons += weekCompleted;

      moduleProgress.push({
        title: week.weekTitle || `Module ${weekIndex + 1}`,
        description: week.weekDescription,
        total: weekTotal,
        completed: weekCompleted,
        percentage: weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0
      });
    });

    return {
      overall: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
      totalLessons,
      completedLessons,
      modules: moduleProgress
    };
  };

  const progress = calculateProgress();

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {courseData?.course_title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">Course Progress Overview</p>
      </div>

      {/* Overall Progress Ring */}
      <div className="flex justify-center">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              className="text-emerald-500"
              strokeDasharray={`${progress.overall * 3.14} 314`}
              style={{
                transition: 'stroke-dasharray 1s ease-in-out'
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {progress.overall}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Complete
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {progress.completedLessons}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            of {progress.totalLessons} lessons
          </div>
        </div>
        
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {progress.modules.filter(m => m.percentage === 100).length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            of {progress.modules.length} modules
          </div>
        </div>
        
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {Math.round((progress.completedLessons / progress.totalLessons) * 100) || 0}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            minutes saved
          </div>
        </div>
      </div>

      {/* Current Lesson Highlight */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <PlayCircle className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                Currently Learning
              </span>
            </div>
            <h4 className="font-semibold text-emerald-800 dark:text-emerald-200">
              {lessonData?.title}
            </h4>
            {lessonData?.duration && (
              <div className="flex items-center gap-1 mt-1 text-sm text-emerald-600 dark:text-emerald-400">
                <Clock className="w-4 h-4" />
                {lessonData.duration}
              </div>
            )}
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            lessonData?.is_completed || lessonData?.completed 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
              : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
          }`}>
            {lessonData?.is_completed || lessonData?.completed ? 'Completed' : 'In Progress'}
          </div>
        </div>
      </div>

      {/* Module Progress - Compact View */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <ChartBar className="w-5 h-5 mr-2 text-emerald-600" />
          Module Progress
        </h4>
        
        <div className="space-y-3">
          {progress.modules.map((module, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-3 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700/50"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900 dark:text-white text-sm">
                    {module.title}
                  </h5>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {module.completed}/{module.total}
                    </span>
                    <span className={`text-sm font-bold ${
                      module.percentage === 100 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {module.percentage}%
                    </span>
      </div>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${module.percentage}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className={`h-2 rounded-full ${
                      module.percentage === 100 
                        ? "bg-gradient-to-r from-green-400 to-green-500" 
                        : "bg-gradient-to-r from-emerald-400 to-emerald-500"
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const OverviewTab = ({ lessonData, lessonType = 'video' }) => (
  <div className="space-y-6">
    <div className="prose dark:prose-invert max-w-none">
      {lessonData?.content || lessonData?.description || "An introduction to the evolution and concept of quantum computing."}
    </div>

    {/* Display specific information based on lesson type */}
    {lessonType === 'quiz' && lessonData?.meta && (
      <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4 mb-4">
        <h3 className="text-lg font-medium mb-2 text-blue-800 dark:text-blue-300">Quiz Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lessonData.meta.time_limit && (
            <div className="flex items-start gap-2">
              <Clock className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800 dark:text-blue-300">Time Limit</p>
                <p className="text-sm text-blue-700/70 dark:text-blue-300/70">{lessonData.meta.time_limit} minutes</p>
              </div>
            </div>
          )}
          {lessonData.meta.passing_score && (
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800 dark:text-blue-300">Passing Score</p>
                <p className="text-sm text-blue-700/70 dark:text-blue-300/70">{lessonData.meta.passing_score}%</p>
              </div>
            </div>
          )}
        </div>
      </div>
    )}

    {lessonType === 'assessment' && lessonData?.meta && (
      <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4 mb-4">
        <h3 className="text-lg font-medium mb-2 text-blue-800 dark:text-blue-300">Assignment Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lessonData.meta.due_date && (
            <div className="flex items-start gap-2">
              <Calendar className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800 dark:text-blue-300">Due Date</p>
                <p className="text-sm text-blue-700/70 dark:text-blue-300/70">
                  {new Date(lessonData.meta.due_date).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          )}
          {lessonData.meta.max_score && (
            <div className="flex items-start gap-2">
              <Target className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800 dark:text-blue-300">Maximum Score</p>
                <p className="text-sm text-blue-700/70 dark:text-blue-300/70">{lessonData.meta.max_score} points</p>
              </div>
            </div>
          )}
        </div>
      </div>
    )}

    {lessonData?.learning_objectives?.length > 0 && (
      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-primaryColor" />
          Learning Objectives
        </h3>
        <ul className="space-y-3">
          {lessonData.learning_objectives.map((objective, index) => (
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

const ResourcesTab = ({ resources }) => (
  <div className="space-y-4">
    <AnimatePresence>
      {resources?.length > 0 ? (
        resources.map((resource, index) => (
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
                  (resource.type === "link" || resource.type === "url") && "bg-green-50 dark:bg-green-900/20",
                  resource.type === "quiz" && "bg-yellow-50 dark:bg-yellow-900/20",
                  resource.type === "assignment" && "bg-orange-50 dark:bg-orange-900/20",
                  (!resource.type || resource.type === "other") && "bg-gray-100 dark:bg-gray-700"
                )}
              >
                {resource.type === "pdf" && <FileText className="w-6 h-6 text-red-500" />}
                {resource.type === "video" && <Video className="w-6 h-6 text-blue-500" />}
                {resource.type === "code" && <Code2 className="w-6 h-6 text-purple-500" />}
                {(resource.type === "link" || resource.type === "url") && <Link2 className="w-6 h-6 text-green-500" />}
                {resource.type === "quiz" && <FileQuestion className="w-6 h-6 text-yellow-500" />}
                {resource.type === "assignment" && <FileBox className="w-6 h-6 text-orange-500" />}
                {(!resource.type || resource.type === "other") && <FileText className="w-6 h-6 text-gray-500" />}
              </div>
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-primaryColor transition-colors">
                  {resource.title}
                </h4>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300">
                  {resource.type?.toUpperCase() || "RESOURCE"}
                </span>
              </div>
              {resource.description && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {resource.description}
                </p>
              )}
              <div className="mt-3 flex items-center gap-4">
                <motion.a
                  href={resource.url || resource.fileUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-primaryColor hover:text-primaryColor/80"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {resource.type === "link" || resource.type === "url" ? "Visit Resource" : 
                   resource.type === "quiz" ? "Start Quiz" :
                   resource.type === "assignment" ? "View Assignment" :
                   "Download"}
                  <ExternalLink className="w-4 h-4 ml-1" />
                </motion.a>
                {resource.size && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <FileBox className="w-4 h-4 mr-1" />
                    {resource.size}
                  </span>
                )}
                {resource.duration && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {resource.duration}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))
      ) : (
        <div className="text-center py-12">
          <FileQuestion className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No resources available for this lesson</p>
        </div>
      )}
    </AnimatePresence>
  </div>
);

const NotesTab: React.FC<NotesTabProps> = ({ lessonId, bookmarks = [], formatTime, lessonType = 'video' }) => {
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [activeTimestamp, setActiveTimestamp] = useState(null);
  const [showBookmarkList, setShowBookmarkList] = useState(true);

  // Load notes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`lesson-${lessonId}-notes`);
    if (saved) setNotes(saved);
  }, [lessonId]);

  // Debounced save function
  const debouncedSave = useCallback(
    debounce((value) => {
      setIsSaving(true);
      localStorage.setItem(`lesson-${lessonId}-notes`, value);
      setTimeout(() => setIsSaving(false), 1000);
    }, 1000),
    [lessonId]
  );

  const handleNotesChange = (value) => {
    setNotes(value);
    debouncedSave(value);
  };

  // Insert bookmark reference into notes
  const insertBookmarkReference = (bookmark) => {
    const reference = `\n[Timestamp ${formatTime(bookmark.time)}]: ${bookmark.label}\n`;
    setNotes(prev => prev + reference);
    debouncedSave(notes + reference);
    setActiveTimestamp(bookmark.id);
    setTimeout(() => setActiveTimestamp(null), 2000); // Flash effect
  };

  // Download notes as markdown file
  const downloadNotes = () => {
    const blob = new Blob([notes], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes-${lessonId}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Reset notes
  const resetNotes = () => {
    if (window.confirm('Are you sure you want to clear all your notes? This cannot be undone.')) {
      setNotes('');
      localStorage.removeItem(`lesson-${lessonId}-notes`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium flex items-center">
          <FileText className="w-5 h-5 mr-2 text-primaryColor" />
          Your Notes
        </h3>
        <div className="flex items-center gap-2">
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
          <button
            onClick={() => setIsPreview(!isPreview)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              isPreview 
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            {isPreview ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={downloadNotes}
            className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
            title="Download notes as markdown"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={resetNotes}
            className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 dark:hover:text-red-400"
            title="Clear all notes"
          >
            <Trash2 className="w-4 h-4" />
          </button>
      </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Bookmarks sidebar - only show for video lessons */}
        {lessonType === 'video' && (
          <div className="md:col-span-1">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                  <Bookmark className="w-4 h-4 mr-1.5 text-yellow-500" />
                  Video Bookmarks
                </h4>
                <button
                  onClick={() => setShowBookmarkList(!showBookmarkList)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showBookmarkList ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
              
              <AnimatePresence>
                {showBookmarkList && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    {bookmarks.length > 0 ? (
                      <div className="space-y-2">
                        {bookmarks.map((bookmark) => (
                          <motion.div
                            key={bookmark.id}
                            className={`p-2 rounded-lg cursor-pointer transition-colors ${
                              activeTimestamp === bookmark.id
                                ? 'bg-primaryColor/20 border border-primaryColor/40'
                                : 'bg-white dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                            }`}
                            onClick={() => insertBookmarkReference(bookmark)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center gap-2">
                              <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 font-mono text-xs px-2 py-1 rounded-md">
                                {formatTime(bookmark.time)}
                              </div>
                              <span className="text-sm truncate flex-1">{bookmark.label}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                        No bookmarks yet. Add some while watching the video!
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="mt-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <HelpCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-medium text-blue-800 dark:text-blue-400 text-sm mb-1">Markdown Support</h5>
                  <p className="text-xs text-blue-700/70 dark:text-blue-300/70">
                    You can use Markdown to format your notes. 
                    {lessonType === 'video' && "Click on any bookmark to add a reference to it."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Placeholder for non-video lessons */}
        {lessonType !== 'video' && (
          <div className="hidden md:block md:col-span-1">
            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <HelpCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-medium text-blue-800 dark:text-blue-400 text-sm mb-1">Study Tips</h5>
                  <p className="text-xs text-blue-700/70 dark:text-blue-300/70">
                    {lessonType === 'quiz' 
                      ? 'Take detailed notes on key concepts to help prepare for this quiz.' 
                      : 'Document your process and ideas for this assignment here.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notes editor/preview - span fewer columns for video content */}
        <div className={lessonType === 'video' ? "md:col-span-3" : "md:col-span-4"}>
          {!isPreview ? (
            <MarkdownEditor
              value={notes}
              onChange={handleNotesChange}
              height="70vh"
              placeholder={`Take notes for this ${
                lessonType === 'quiz' 
                  ? 'quiz' 
                  : lessonType === 'assessment' 
                    ? 'assignment' 
                    : 'lesson'
              } using Markdown...`}
            />
          ) : (
            <div className="prose dark:prose-invert prose-sm sm:prose-base max-w-none bg-white dark:bg-gray-800/50 p-6 rounded-xl min-h-[70vh] overflow-auto">
              {notes ? (
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(notes)) }} />
              ) : (
                <div className="text-gray-400 italic">No notes yet. Start writing in the editor.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DiscussionTab = ({ lessonId, courseId, lessonTitle }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [filter, setFilter] = useState("recent"); // "recent", "popular", "my"
  const commentInputRef = useRef(null);
  
  // Mock user for development when not authenticated
  const mockUser = {
    id: 'dev-user-123',
    name: "Dev User",
    image: "https://i.pravatar.cc/150?img=1",
    role: "student"
  };
  
  // Use authenticated user or mock user
  const user = mockUser;
  
  const [isMarkdownMode, setIsMarkdownMode] = useState(false);

  // Mock data for testing - would be replaced with actual API calls
  useEffect(() => {
    // Simulate API call to fetch comments
    setTimeout(() => {
      setComments([
        {
          id: 1,
          text: "This explanation about quantum computing really helped me understand the concept. Thank you for the clear examples!",
          author: {
            id: 'abc123',
            name: "Jane Cooper",
            avatar: "https://i.pravatar.cc/150?img=5",
            role: "student"
          },
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          likes: 12,
          replies: [
            {
              id: 2,
              text: "I agree! The visual demonstrations really made it click for me too.",
              author: {
                id: 'def456',
                name: "Michael Scott",
                avatar: "https://i.pravatar.cc/150?img=8",
                role: "student"
              },
              timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
              likes: 3,
            }
          ],
        },
        {
          id: 3,
          text: "I'm struggling with the concept of quantum entanglement. Can someone explain it in simpler terms?",
          author: {
            id: 'ghi789',
            name: "Alex Johnson",
            avatar: "https://i.pravatar.cc/150?img=13",
            role: "student"
          },
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          likes: 5,
          replies: [],
        }
      ]);
    }, 500);
  }, [lessonId]);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    
    // Construct new comment
    const comment = {
      id: Date.now(),
      text: newComment,
      author: {
        id: user?.id || 'user123',
        name: user?.name || "You",
        avatar: user?.image || "https://i.pravatar.cc/150?img=1",
        role: "student"
      },
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: [],
    };
    
    // Handle reply vs new comment
    if (replyTo) {
      const updatedComments = comments.map(c => {
        if (c.id === replyTo.id) {
          return {
            ...c,
            replies: [...(c.replies || []), {
              ...comment,
              id: Date.now() + 1, // ensure unique ID
            }]
          };
        }
        return c;
      });
      setComments(updatedComments);
      setReplyTo(null);
    } else {
    setComments([comment, ...comments]);
    }
    
    setNewComment("");
    setIsSubmitting(false);
  };

  const handleLike = (commentId, isReply = false, parentId = null) => {
    if (isReply && parentId) {
      // Handle liking a reply
      setComments(comments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.map(reply => {
              if (reply.id === commentId) {
                return { ...reply, likes: reply.likes + 1 };
              }
              return reply;
            })
          };
        }
        return comment;
      }));
    } else {
      // Handle liking a top-level comment
      setComments(comments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, likes: comment.likes + 1 };
        }
        return comment;
      }));
    }
  };

  const initiateReply = (comment) => {
    setReplyTo(comment);
    setNewComment(`@${comment.author.name} `);
    if (commentInputRef.current) {
      commentInputRef.current.focus();
    }
  };

  const filterComments = () => {
    let filtered = [...comments];
    
    switch (filter) {
      case "popular":
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case "my":
        filtered = filtered.filter(comment => 
          comment.author.id === (user?.id || 'user123') || 
          comment.replies?.some(reply => reply.author.id === (user?.id || 'user123'))
        );
        break;
      case "recent":
      default:
        filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
    
    return filtered;
  };

  const renderCommentContent = (text) => {
    if (isMarkdownMode) {
      return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(text)) }} />;
    }
    
    // Simple formatting for non-markdown mode
    const formattedText = text
      .replace(/@(\w+)/g, '<span class="text-primaryColor font-medium">@$1</span>') // Highlight mentions
      .replace(/#(\w+)/g, '<span class="text-blue-500 font-medium">#$1</span>'); // Highlight hashtags
    
    return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(formattedText) }} />;
  };

  return (
    <div className="space-y-6">
      {/* Comment input */}
      <form onSubmit={handleSubmitComment} className="space-y-4 bg-white dark:bg-gray-800/50 rounded-xl p-4 shadow-sm">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-primaryColor/10 flex-shrink-0 overflow-hidden">
            {user?.image ? (
              <img src={user.image} alt={user?.name || "User"} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primaryColor font-semibold">
                {user?.name?.[0]?.toUpperCase() || "Y"}
              </div>
            )}
          </div>
          <div className="flex-1">
            {replyTo && (
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                <span>Replying to</span>
                <span className="font-medium text-primaryColor ml-1">{replyTo.author.name}</span>
                <button
                  onClick={() => {
                    setReplyTo(null);
                    setNewComment("");
                  }}
                  className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            <div className="relative">
              {isMarkdownMode ? (
                <MarkdownEditor
                  value={newComment}
                  onChange={value => setNewComment(value)}
                  minHeight="100px"
                  placeholder={replyTo ? `Reply to ${replyTo.author.name}...` : "Start a discussion, ask a question, or share insights..."}
                />
              ) : (
        <textarea
                  ref={commentInputRef}
          value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder={replyTo ? `Reply to ${replyTo.author.name}...` : "Start a discussion, ask a question, or share insights..."}
                  className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 border-none focus:ring-2 focus:ring-primaryColor resize-none"
          rows={3}
        />
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMarkdownMode(!isMarkdownMode)}
              className={`p-2 rounded-md text-xs font-medium ${
                isMarkdownMode 
                  ? 'bg-primaryColor/10 text-primaryColor' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
              title={isMarkdownMode ? "Switch to simple editor" : "Enable markdown formatting"}
            >
              {isMarkdownMode ? "Markdown On" : "Markdown Off"}
            </button>
            
            <button
              type="button"
              className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
              title="Upload image"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            
            <button
              type="button"
              className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
              title="Add mention"
            >
              <AtSign className="w-4 h-4" />
            </button>
            
            <button
              type="button"
              className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
              title="Add hashtag"
            >
              <Hash className="w-4 h-4" />
            </button>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className={`px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-primaryColor/90 transition-colors flex items-center ${
              isSubmitting || !newComment.trim() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                {replyTo ? 'Post Reply' : 'Post Comment'}
              </>
            )}
          </motion.button>
        </div>
      </form>

      {/* Comments filter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setFilter("recent")}
            className={`text-sm font-medium ${
              filter === "recent" 
                ? 'text-primaryColor' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Recent
          </button>
          <button
            onClick={() => setFilter("popular")}
            className={`text-sm font-medium ${
              filter === "popular" 
                ? 'text-primaryColor' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Popular
          </button>
          <button
            onClick={() => setFilter("my")}
            className={`text-sm font-medium ${
              filter === "my" 
                ? 'text-primaryColor' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            My Comments
          </button>
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {comments.length} comment{comments.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-6">
        {filterComments().length > 0 ? (
          filterComments().map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800/50 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50"
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={comment.author.avatar}
                      alt={comment.author.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                  <div>
                      <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                        {comment.author.name}
                        {comment.author.role === "instructor" && (
                          <span className="ml-2 px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-semibold">
                            Instructor
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <Copy className="w-4 h-4" />
                      </button>
                      {comment.author.id === (user?.id || 'user123') && (
                        <button className="text-gray-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                </div>
              </div>
                  
                  <div className="mt-2 text-gray-700 dark:text-gray-300 text-sm prose dark:prose-invert prose-sm max-w-none">
                    {renderCommentContent(comment.text)}
                  </div>
                  
                  <div className="mt-3 flex items-center gap-4">
                    <button
                      onClick={() => handleLike(comment.id)}
                      className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-primaryColor"
                    >
                      <Heart
                        className={`w-4 h-4 mr-1 ${
                          comment.liked ? 'fill-primaryColor text-primaryColor' : ''
                        }`}
                      />
                      {comment.likes}
                    </button>
                    
                    <button
                      onClick={() => initiateReply(comment)}
                      className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-primaryColor"
                    >
                      <Reply className="w-4 h-4 mr-1" />
                      Reply
                    </button>
                    
                    <button className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-primaryColor">
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </button>
                  </div>
                  
                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-100 dark:border-gray-700">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full overflow-hidden">
                              <img
                                src={reply.author.avatar}
                                alt={reply.author.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-medium text-gray-900 dark:text-white text-sm">
                                  {reply.author.name}
                                </h5>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {formatDistanceToNow(new Date(reply.timestamp), { addSuffix: true })}
                                </p>
                              </div>
                            </div>
                            
                            <div className="mt-1 text-gray-700 dark:text-gray-300 text-sm prose dark:prose-invert prose-sm max-w-none">
                              {renderCommentContent(reply.text)}
                            </div>
                            
                            <div className="mt-2 flex items-center gap-3">
                              <button
                                onClick={() => handleLike(reply.id, true, comment.id)}
                                className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400 hover:text-primaryColor"
                              >
                                <Heart
                                  className={`w-3 h-3 mr-1 ${
                                    reply.liked ? 'fill-primaryColor text-primaryColor' : ''
                                  }`}
                                />
                                {reply.likes}
                              </button>
                              
                              <button
                                onClick={() => initiateReply(comment)}
                                className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400 hover:text-primaryColor"
                              >
                                <Reply className="w-3 h-3 mr-1" />
                                Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No comments yet</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Be the first to start a discussion about this lesson!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntegratedLessonPage; 