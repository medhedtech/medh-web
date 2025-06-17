import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Link2, 
  RefreshCw,
  ThumbsUp,
  MessageCircle,
  User,
  Send
} from 'lucide-react';
import { showToast } from '@/utils/toastManager';

const OverviewTab = ({ lessonData }) => {
  if (!lessonData?.description) {
    return (
      <div className="text-center py-8">
        <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">No overview available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="prose dark:prose-invert max-w-none">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          About this lesson
        </h3>
        <div className="text-gray-600 dark:text-gray-300">
          {lessonData.description}
        </div>
      </div>

      {lessonData.learningObjectives?.length > 0 && (
        <div>
          <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
            Learning Objectives
          </h4>
          <ul className="space-y-3">
            {lessonData.learningObjectives.map((objective, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 text-gray-600 dark:text-gray-300"
              >
                <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-3 h-3 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span>{objective}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const ResourcesTab = ({ resources }) => {
  if (!resources?.length) {
    return (
      <div className="text-center py-8">
        <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">No resources available</p>
      </div>
    );
  }

  const getResourceIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'pdf':
        return FileText;
      case 'link':
        return Link2;
      default:
        return Download;
    }
  };

  return (
    <div className="grid gap-4">
      {resources.map((resource, index) => {
        const Icon = getResourceIcon(resource.type);
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg group hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primaryColor/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primaryColor" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {resource.title}
                </h4>
                {resource.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {resource.description}
                  </p>
                )}
              </div>
            </div>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-medium text-primaryColor hover:text-white bg-primaryColor/10 hover:bg-primaryColor rounded-lg transition-colors"
            >
              {resource.type === 'link' ? 'Visit' : 'Download'}
            </a>
          </motion.div>
        );
      })}
    </div>
  );
};

const NotesTab = ({ lessonId }) => {
  const [notes, setNotes] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);
  const saveTimeoutRef = React.useRef(null);

  React.useEffect(() => {
    // Load saved notes from localStorage
    const savedNotes = localStorage.getItem(`lesson-${lessonId}-notes`);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, [lessonId]);

  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    setIsSaving(true);

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout to save after 1 second of no typing
    saveTimeoutRef.current = setTimeout(() => {
      localStorage.setItem(`lesson-${lessonId}-notes`, newNotes);
      setIsSaving(false);
      showToast.success('Notes saved successfully');
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Your Notes
        </h3>
        {isSaving && (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Saving...
          </div>
        )}
      </div>
      <textarea
        value={notes}
        onChange={handleNotesChange}
        placeholder="Start taking notes..."
        className="w-full h-[300px] p-4 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50 rounded-lg border-none focus:ring-2 focus:ring-primaryColor resize-none"
      />
    </div>
  );
};

const DiscussionTab = ({ lessonId }) => {
  const [comments, setComments] = React.useState([]);
  const [newComment, setNewComment] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate loading comments
    setTimeout(() => {
      setComments([
        {
          id: 1,
          user: { name: 'John Doe', avatar: null },
          content: 'Great lesson! Really helped me understand the concepts better.',
          likes: 5,
          replies: 2,
          timestamp: '2 hours ago'
        },
        {
          id: 2,
          user: { name: 'Jane Smith', avatar: null },
          content: 'Could someone explain the part about quantum entanglement in more detail?',
          likes: 3,
          replies: 1,
          timestamp: '1 hour ago'
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, [lessonId]);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      user: { name: 'You', avatar: null },
      content: newComment,
      likes: 0,
      replies: 0,
      timestamp: 'Just now'
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
    showToast.success('Comment posted successfully');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="w-6 h-6 text-primaryColor animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmitComment} className="space-y-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add to the discussion..."
          className="w-full p-4 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50 rounded-lg border-none focus:ring-2 focus:ring-primaryColor resize-none"
          rows={3}
        />
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="px-4 py-2 text-sm font-medium text-white bg-primaryColor rounded-lg hover:bg-primaryColor/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Post Comment
        </button>
      </form>

      <div className="space-y-4">
        {comments.map(comment => (
          <div
            key={comment.id}
            className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {comment.user.name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {comment.timestamp}
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300">{comment.content}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <button className="flex items-center gap-1 hover:text-primaryColor transition-colors">
                <ThumbsUp className="w-4 h-4" />
                {comment.likes}
              </button>
              <button className="flex items-center gap-1 hover:text-primaryColor transition-colors">
                <MessageCircle className="w-4 h-4" />
                {comment.replies}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MainContent = ({ lessonData, activeTab, setActiveTab }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex gap-6 border-b border-gray-200 dark:border-gray-700">
        {['Overview', 'Resources', 'Notes', 'Discussion'].map((tab) => (
          <button
            key={tab}
            className={`pb-4 text-sm font-medium transition-colors relative ${
              activeTab === tab
                ? "text-primaryColor"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
            onClick={() => setActiveTab(tab)}
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
            {activeTab === 'Overview' && <OverviewTab lessonData={lessonData} />}
            {activeTab === 'Resources' && <ResourcesTab resources={lessonData?.resources} />}
            {activeTab === 'Notes' && <NotesTab lessonId={lessonData?._id} />}
            {activeTab === 'Discussion' && <DiscussionTab lessonId={lessonData?._id} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MainContent; 