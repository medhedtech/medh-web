"use client";
import { useEffect, useState, useCallback } from 'react';
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
  Menu
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

const IntegratedLessonPage = () => {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id;
  const lessonId = params.lessonId;
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
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

  // Find adjacent lessons for navigation
  const findAdjacentLessons = (curriculum) => {
    if (!curriculum || !lessonId) return { prevLesson: null, nextLesson: null };

    // Flatten the curriculum structure into a single array of lessons
    const allLessons = curriculum?.flatMap(week => 
      week.sections?.flatMap(section => 
        section.lessons || []
      ) || []
    ) || [];

    // Find the current lesson index
    const currentIndex = allLessons.findIndex(lesson => (lesson._id || lesson.id) === lessonId);

    let prevLesson = null;
    let nextLesson = null;

    if (currentIndex !== -1) {
      if (currentIndex > 0) {
        prevLesson = allLessons[currentIndex - 1];
      }
      if (currentIndex < allLessons.length - 1) {
        nextLesson = allLessons[currentIndex + 1];
      }
    }

    return { prevLesson, nextLesson };
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

  // Handle lesson selection
  const handleLessonSelect = (lesson) => {
    const selectedLessonId = lesson._id || lesson.id;
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
      "transition-all duration-300 ease-in-out",
      isMobile ? "w-full" : sidebarCollapsed ? "w-full" : "w-full lg:w-[70%] xl:w-[75%]"
    )}>
      <div className="h-full overflow-y-auto">
        <div className="max-w-[1200px] mx-auto px-4 py-6">
          {/* Mobile Header */}
          {isMobile && (
            <div className="flex items-center justify-between mb-4">
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
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            {/* Video Player Section */}
            <div className="aspect-video bg-gray-900 rounded-t-lg overflow-hidden">
              {lessonData?.videoUrl ? (
                <VideoPlayer
                  src={lessonData.videoUrl}
                  poster={lessonData.thumbnailUrl || `${lessonData.videoUrl.split('.')[0]}.jpg`}
                  autoplay={false}
                  onEnded={() => {
                    // Automatically mark lesson as complete when video ends
                    if (lessonData && !lessonData.is_completed && !lessonData.completed) {
                      markLessonComplete({
                        completed_at: new Date().toISOString()
                      });
                    }
                    
                    // Auto-navigate to next lesson if available
                    if (nextLesson) {
                      setTimeout(() => {
                        router.push(`/integrated-lessons/${courseId}/lecture/${nextLesson._id || nextLesson.id}`);
                      }, 1500);
                    }
                  }}
                  onError={() => {
                    toast.error("Failed to load video. Please try again.");
                  }}
                />
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

            {/* Lesson Content */}
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {lessonData?.title || 'Lesson Title'}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
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
                  {activeTab === "Overview" && <OverviewTab lessonData={lessonData} />}
                  {activeTab === "Resources" && <ResourcesTab resources={lessonData?.resources || []} />}
                  {activeTab === "Notes" && <NotesTab lessonId={lessonId} />}
                  {activeTab === "Discussion" && <DiscussionTab lessonId={lessonId} />}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                {prevLesson ? (
                  <button
                    onClick={() => router.push(`/integrated-lessons/${courseId}/lecture/${prevLesson._id || prevLesson.id}`)}
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
                    onClick={() => router.push(`/integrated-lessons/${courseId}/lecture/${nextLesson._id || nextLesson.id}`)}
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
            "bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 h-full",
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
            className="fixed top-20 right-4 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
const OverviewTab = ({ lessonData }) => (
  <div className="space-y-6">
    <div className="prose dark:prose-invert max-w-none">
      {lessonData?.content || lessonData?.description || "An introduction to the evolution and concept of quantum computing."}
    </div>
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
                  href={resource.url || resource.fileUrl}
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

const NotesTab = ({ lessonId }) => {
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`lesson-${lessonId}-notes`);
    if (saved) setNotes(saved);
  }, [lessonId]);

  const debouncedSave = useCallback(
    debounce((value) => {
      setIsSaving(true);
      localStorage.setItem(`lesson-${lessonId}-notes`, value);
      setTimeout(() => setIsSaving(false), 1000);
    }, 1000),
    [lessonId]
  );

  const handleNotesChange = (e) => {
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

const DiscussionTab = ({ lessonId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const handleSubmitComment = (e) => {
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
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-primaryColor/90 transition-colors"
          >
            Post Comment
          </motion.button>
        </div>
      </form>

      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primaryColor/10 flex items-center justify-center">
                    <span className="text-primaryColor font-medium">{comment.author[0]}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{comment.author}</h4>
                    <p className="text-xs text-gray-500">
                      {new Date(comment.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-gray-700 dark:text-gray-300">{comment.text}</p>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
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