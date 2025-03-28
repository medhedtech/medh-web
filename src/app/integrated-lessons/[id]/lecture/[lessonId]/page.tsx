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
  Clock
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
import { useSession } from 'next-auth/react';
import { formatDistanceToNow } from 'date-fns';

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
  _id: string;
  id?: string;
  title: string;
  description?: string;
  lessonType: 'video' | 'quiz' | 'assessment';
  videoUrl?: string;
  video_url?: string;
  thumbnailUrl?: string;
  is_completed?: boolean;
  completed?: boolean;
  meta?: {
    presenter?: string;
    transcript?: string;
    time_limit?: number;
    passing_score?: number;
    due_date?: string;
    max_score?: number;
  };
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
  lessons: Lesson[];
}

interface CourseSection extends Omit<Section, 'id'> {
  id?: string;
}

interface Week {
  id?: string;
  weekTitle: string;
  weekDescription?: string;
  sections?: Section[];
  lessons?: Lesson[];
  topics?: string[];
}

interface CourseWeek extends Omit<Week, 'sections'> {
  sections?: CourseSection[];
}

interface VideoBookmark {
  id: string;
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
const formatVideoUrl = (url) => {
  if (!url) return null;
  
  try {
    // Check if it's a YouTube URL
    if (url.includes('youtube.com/watch') || url.includes('youtu.be/') || url.includes('m.youtube.com/watch')) {
      // Extract the video ID
      let videoId;
      
      if (url.includes('v=')) {
        // Handle youtube.com/watch?v=VIDEO_ID format
        const urlParams = new URLSearchParams(url.split('?')[1]);
        videoId = urlParams.get('v');
      } else if (url.includes('youtu.be/')) {
        // Handle youtu.be/VIDEO_ID format
        videoId = url.split('youtu.be/')[1];
        if (videoId.includes('?')) {
          videoId = videoId.split('?')[0];
        }
      }
      
      if (videoId) {
        // Return YouTube embed URL
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    
    // Return original URL if not YouTube or if parsing fails
    return url;
  } catch (error) {
    console.error("Error formatting video URL:", error);
    return url;
  }
};

const IntegratedLessonPage = () => {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id as string;
  const lessonId = params?.lessonId as string;
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [videoBookmarks, setVideoBookmarks] = useState<VideoBookmark[]>([]);
  const [savedProgress, setSavedProgress] = useState<LessonProgress | null>(null);
  
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

  // Determine lesson type
  const lessonType = (lessonData as LessonData)?.lessonType || 'video';

  // Load saved progress when component mounts
  useEffect(() => {
    if (lessonId) {
      try {
        const savedProgressData = localStorage.getItem(`lesson-progress-${lessonId}`);
        if (savedProgressData) {
          const progress = JSON.parse(savedProgressData);
          setSavedProgress(progress);
        }
      } catch (error) {
        console.error('Error loading saved progress:', error);
      }
    }
  }, [lessonId]);

  // Update findAdjacentLessons function
  const findAdjacentLessons = (curriculum: CourseWeek[]): { prevLesson: Lesson | null; nextLesson: Lesson | null } => {
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
  };

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

  const { prevLesson, nextLesson } = courseData ? 
    findAdjacentLessons(courseData.curriculum) : 
    { prevLesson: null, nextLesson: null };

  // Update the handleLessonSelect function
  const handleLessonSelect = (lesson: Lesson) => {
    const selectedLessonId = lesson._id?.$oid || lesson._id || lesson.id;
    if (!selectedLessonId) {
      console.error('Invalid lesson selected:', lesson);
      return;
    }

    // Only navigate if it's a different lesson
    if (selectedLessonId !== lessonId) {
      router.push(`/integrated-lessons/${courseId}/lecture/${selectedLessonId}`);
    }
  };

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Toggle mobile sidebar
  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  // Handle video bookmarks
  const handleAddVideoBookmark = (bookmark) => {
    setVideoBookmarks(prev => {
      const newBookmarks = [...prev, bookmark];
      // Save to localStorage
      localStorage.setItem(`video-bookmarks-${lessonId}`, JSON.stringify(newBookmarks));
      toast.success(`Bookmark added at ${formatTime(bookmark.time)}`);
      return newBookmarks;
    });
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

  // Format time for displaying bookmark timestamps
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return h > 0
      ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      : `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Loading state
  if (loading || getLoading || postLoading) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 mx-auto animate-spin">
              <Loader className="w-full h-full text-primaryColor" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {getLoading ? "Loading lesson content..." : "Processing..."}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Please wait while we prepare your lesson
              </p>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  // Error state
  if (error && !loading) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
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
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Content Not Found</h2>
            <p className="text-gray-600 dark:text-gray-300">The requested content could not be found.</p>
            <button 
              onClick={() => router.push(`/integrated-lessons/${courseId}`)}
              className="mt-4 px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-primaryColor/90 transition-colors"
            >
              Back to Course
            </button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  const renderContent = () => (
    <div className={clsx(
      "transition-all duration-300 ease-in-out flex-1 h-screen",
      isMobile ? "w-full" : sidebarCollapsed ? "w-full" : "w-full lg:w-[70%] xl:w-[75%]"
    )}>
      <div className="h-full overflow-y-auto pt-12 pb-16">
        <div className="max-w-[1200px] mx-auto py-8">
          {/* Mobile Header */}
          {isMobile && (
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={toggleMobileSidebar}
                className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                aria-label="Toggle course contents"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-bold truncate">
                {lessonData?.title || 'Lesson Title'}
              </h1>
              <div className="w-9" />
            </div>
          )}
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
            {/* Lesson Content Area - Render based on lesson type */}
            {lessonType === 'video' && (
              <div className="aspect-video bg-gray-900 rounded-t-xl overflow-hidden">
                {(lessonData as LessonData).videoUrl || (lessonData as LessonData).video_url ? (
                  <div className="relative">
                    {savedProgress && savedProgress.progress < 90 && (
                      <div className="absolute top-4 right-4 z-10 bg-black/80 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2">
                        <RefreshCw className="w-4 h-4" />
                        <span>Resuming from {Math.floor(savedProgress.progress)}%</span>
                      </div>
                    )}
                    <VideoPlayer
                      src={formatVideoUrl(lessonData?.videoUrl || lessonData?.video_url)}
                      poster={lessonData?.thumbnailUrl || (lessonData?.videoUrl || lessonData?.video_url ? `${(lessonData.videoUrl || lessonData.video_url).split('.')[0]}.jpg` : undefined)}
                      autoplay={false}
                      bookmarks={videoBookmarks}
                      onBookmark={handleAddVideoBookmark}
                      initialTime={savedProgress?.currentTime}
                      onProgress={(progress: number, currentTime: number) => {
                        // Save progress every 5 seconds to avoid too frequent updates
                        if (Math.floor(currentTime) % 5 === 0) {
                          // Save progress to backend
                          try {
                            const progressData = {
                              lessonId,
                              courseId,
                              progress,
                              currentTime,
                              updatedAt: new Date().toISOString()
                            };
                            
                            // Store progress in localStorage as backup
                            localStorage.setItem(
                              `lesson-progress-${lessonId}`, 
                              JSON.stringify(progressData)
                            );

                            // Mark as complete if progress is >= 90%
                            if (progress >= 90 && !lessonData.is_completed && !lessonData.completed) {
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
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full bg-gray-900 text-white/70 p-6">
                    <Video className="w-16 h-16 mb-4 opacity-60" />
                    <h3 className="text-lg font-medium mb-2">No Video Available</h3>
                    <p className="text-sm text-center max-w-md">
                      This lesson doesn't have a video. Please check the content in the Overview tab below 
                      or continue to the next lesson.
                    </p>
                    {nextLesson && (
                      <button
                        onClick={() => router.push(`/integrated-lessons/${courseId}/lecture/${nextLesson._id || nextLesson.id}`)}
                        className="mt-6 px-4 py-2 bg-primaryColor hover:bg-primaryColor/90 text-white rounded-md flex items-center transition-colors"
                      >
                        Go to Next Lesson
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {lessonType === 'quiz' && (
              <div className="rounded-t-xl overflow-hidden bg-gray-50 dark:bg-gray-800/50 p-6">
                <div className="flex items-center mb-4">
                  <FileQuestion className="w-8 h-8 text-primaryColor mr-3" />
                  <h2 className="text-xl font-bold">Quiz: {lessonData?.title}</h2>
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
              <div className="rounded-t-xl overflow-hidden bg-gray-50 dark:bg-gray-800/50 p-6">
                <div className="flex items-center mb-4">
                  <FileBox className="w-8 h-8 text-primaryColor mr-3" />
                  <h2 className="text-xl font-bold">Assignment: {lessonData?.title}</h2>
                </div>
                <AssessmentComponent 
                  assignmentId={lessonData?.assignment_id}
                  lessonId={lessonId}
                  courseId={courseId}
                  meta={lessonData?.meta || {}}
                  onSubmit={(submission) => {
                    // Mark assignment as submitted but not completed until graded
                    toast.success("Assignment submitted successfully!");
                  }}
                />
              </div>
            )}

            {/* Lesson Content */}
            <div className="p-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {lessonData?.title || 'Lesson Title'}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                {lessonData?.description || 'No description available'}
              </p>

              {/* Tabbed Navigation */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 overflow-x-auto scrollbar-hide">
                  {["Overview", "Resources", "Notes", "Discussion"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={clsx(
                        "py-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                        activeTab === tab
                          ? "border-primaryColor text-primaryColor"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="py-6"
                >
                  {activeTab === "Overview" && <OverviewTab lessonData={lessonData} lessonType={lessonType} />}
                  {activeTab === "Resources" && <ResourcesTab resources={lessonData?.resources || []} />}
                  {activeTab === "Notes" && (
                    <NotesTab 
                      lessonId={lessonId} 
                      bookmarks={videoBookmarks}
                      formatTime={formatTime}
                      lessonType={lessonType}
                    />
                  )}
                  {activeTab === "Discussion" && (
                    <DiscussionTab 
                      lessonId={lessonId} 
                      courseId={courseId}
                      lessonTitle={lessonData?.title}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                {prevLesson ? (
                  <button
                    onClick={() => router.push(`/integrated-lessons/${courseId}/lecture/${prevLesson._id?.$oid || prevLesson._id || prevLesson.id}`)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous Lesson
                  </button>
                ) : (
                  <div />
                )}

                {nextLesson && (
                  <button
                    onClick={() => router.push(`/integrated-lessons/${courseId}/lecture/${nextLesson._id?.$oid || nextLesson._id || nextLesson.id}`)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium bg-primaryColor text-white rounded-md hover:bg-primaryColor/90 transition-colors"
                  >
                    Next Lesson
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSidebar = () => (
    <AnimatePresence>
      {((!isMobile && !sidebarCollapsed) || (isMobile && mobileSidebarOpen)) && (
        <motion.div
          initial={isMobile ? { x: -300, opacity: 0 } : { opacity: 1 }}
          animate={isMobile ? { x: 0, opacity: 1 } : { opacity: 1 }}
          exit={isMobile ? { x: -300, opacity: 0 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={clsx(
            "bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 h-screen overflow-hidden",
            isMobile 
              ? "fixed top-0 left-0 z-50 w-[85%] max-w-[350px] shadow-xl" 
              : "w-[30%] xl:w-[25%]"
          )}
        >
          {isMobile && (
            <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
              <h2 className="font-bold text-lg">Course Content</h2>
              <button 
                onClick={toggleMobileSidebar}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          )}
          <div className="h-full overflow-y-auto pt-16 pb-20">
            <LessonAccordion
              currentLessonId={lessonId}
              courseData={courseData}
              onLessonSelect={handleLessonSelect}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              autoExpandCurrent={true}
              className="h-full"
              isCollapsible={true}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Mobile backdrop when sidebar is open
  const renderMobileBackdrop = () => (
    <AnimatePresence>
      {isMobile && mobileSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black z-40"
          onClick={toggleMobileSidebar}
        />
      )}
    </AnimatePresence>
  );

  return (
    <PageWrapper>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
        {/* Main Content Area */}
        {renderContent()}
        
        {/* Collapsible Sidebar */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="fixed top-24 right-6 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <PanelLeftClose className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        )}
        
        {/* Right Sidebar */}
        {renderSidebar()}
        
        {/* Mobile backdrop */}
        {renderMobileBackdrop()}
      </div>
    </PageWrapper>
  );
};

// Tab Components
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
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
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
  
  // Using useSession with fallback for development
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  
  // Mock user for development when not authenticated
  const mockUser = {
    id: 'dev-user-123',
    name: "Dev User",
    image: "https://i.pravatar.cc/150?img=1",
    role: "student"
  };
  
  // Use authenticated user or mock user
  const user = isAuthenticated ? session?.user : mockUser;
  
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