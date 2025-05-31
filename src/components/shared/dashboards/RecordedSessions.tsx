"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import batchAPI from "@/apis/batch";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Video, 
  Search, 
  ExternalLink, 
  Loader2, 
  AlertCircle, 
  BookOpen, 
  Clock, 
  Calendar,
  ChevronDown,
  Play,
  Users,
  FileVideo,
  RotateCcw,
  Filter,
  Eye
} from "lucide-react";
import { toast } from "react-toastify";

interface RecordedLesson {
  _id: string;
  title: string;
  url: string;
  recorded_date: string;
  created_by: string;
}

interface BatchGroup {
  batch: {
    id: string;
    name: string;
  };
  session: {
    id: string;
    day: string;
    start_time: string;
    end_time: string;
  };
  recorded_lessons: RecordedLesson[];
}

// Individual Recording Card Component
const RecordingCard: React.FC<{
  lesson: RecordedLesson;
  onClick: () => void;
}> = ({ lesson, onClick }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01, x: 6 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group cursor-pointer bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/30 dark:to-gray-700/30 border border-gray-200 dark:border-gray-600/50 rounded-xl p-4 transition-all duration-300 hover:shadow-md hover:border-primary-300 dark:hover:border-primary-500/50 hover:bg-gradient-to-r hover:from-primary-50 hover:to-blue-50 dark:hover:from-primary-900/20 dark:hover:to-blue-900/20"
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="p-2.5 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 rounded-xl shadow-sm"
        >
          <Play className="w-4 h-4 text-primary-600 dark:text-primary-400" />
        </motion.div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 truncate group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
            {lesson.title}
          </h4>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="w-3 h-3" />
            <span>Recorded on {formatDate(lesson.recorded_date)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Collapsible Batch Card Component
const BatchCard: React.FC<{
  batchGroup: BatchGroup;
  onRecordingClick: (url: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ batchGroup, onRecordingClick, isExpanded, onToggle }) => {
  const { batch, session, recorded_lessons } = batchGroup;
  
  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700/70 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 backdrop-blur-sm"
    >
      {/* Batch Header */}
      <motion.div
        onClick={onToggle}
        className="cursor-pointer p-6 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 dark:hover:from-gray-700/30 dark:hover:to-gray-600/30 transition-all duration-300"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="p-3 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 rounded-xl shadow-sm"
            >
              <FileVideo className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 dark:text-white text-xl mb-2 truncate">
                {batch.name}
              </h3>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg">
                  <Calendar className="w-4 h-4 text-primary-500" />
                  <span>{session.day}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>{session.start_time} - {session.end_time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-3 py-1.5 rounded-lg">
                  <Video className="w-4 h-4" />
                  <span>{recorded_lessons.length} recording{recorded_lessons.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors"
            >
              <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Recordings List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -10 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="border-t border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/20"
          >
            <div className="p-6 space-y-3">
              <AnimatePresence>
                {recorded_lessons.map((lesson, index) => (
                  <motion.div
                    key={lesson._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ 
                      delay: index * 0.1,
                      duration: 0.3,
                      ease: "easeOut"
                    }}
                  >
                    <RecordingCard
                      lesson={lesson}
                      onClick={() => onRecordingClick(lesson.url)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const RecordedSessions: React.FC = () => {
  const router = useRouter();
  const [batchGroups, setBatchGroups] = useState<BatchGroup[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [expandedBatches, setExpandedBatches] = useState<Set<string>>(new Set());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 25,
        mass: 0.8
      }
    }
  };

  // Get auth token and user ID
  const getAuthData = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId') || 
                    localStorage.getItem('user_id') || 
                    localStorage.getItem('studentId') ||
                    localStorage.getItem('student_id');
      
      // Also try to get from user object
      if (!userId) {
        try {
          const userDataString = localStorage.getItem('user') || localStorage.getItem('userData');
          if (userDataString) {
            const userData = JSON.parse(userDataString);
            return {
              token,
              userId: userData.id || userData._id || userData.userId || userData.student_id
            };
          }
        } catch (e) {
          console.warn('Failed to parse user data from localStorage:', e);
        }
      }
      
      return { token, userId };
    }
    return { token: null, userId: null };
  };

  const fetchRecordedSessions = async (showRefreshIndicator: boolean = false) => {
    if (showRefreshIndicator) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);
    
    const { token, userId } = getAuthData();
    
    if (!userId || !token) {
      setError("Please log in to view your recorded sessions.");
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }
    
    try {
      const response = await batchAPI.getStudentRecordedLessons(userId);
      
      console.log('Recorded sessions API response:', response); // Debug log
      
      // Handle the actual API response structure
      if (response.status === 'error') {
        throw new Error(response.message || "Failed to fetch recorded sessions");
      }
      
      const apiResponse = response.data as any;
      
      if (apiResponse && apiResponse.success && apiResponse.data) {
        // Filter out batches with no recorded lessons
        const validBatchGroups = apiResponse.data.filter((group: BatchGroup) => 
          group.recorded_lessons && group.recorded_lessons.length > 0
        );
        
        setBatchGroups(validBatchGroups);
        
        // Auto-expand first batch if only one batch exists
        if (validBatchGroups.length === 1) {
          setExpandedBatches(new Set([validBatchGroups[0].batch.id]));
        }
      } else {
        setBatchGroups([]);
      }
      
      setIsLoading(false);
      setIsRefreshing(false);
    } catch (error: any) {
      console.error("Error fetching recorded sessions:", error);
      setError("Failed to load recorded sessions. Please try again later.");
      toast.error("Failed to load recorded sessions. Please try again later.");
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecordedSessions();
  }, []);

  const handleRefresh = () => {
    fetchRecordedSessions(true);
  };

  const handleRecordingClick = (url: string) => {
    window.open(url, '_blank');
  };

  const toggleBatch = (batchId: string) => {
    setExpandedBatches(prev => {
      const newSet = new Set(prev);
      if (newSet.has(batchId)) {
        newSet.delete(batchId);
      } else {
        newSet.add(batchId);
      }
      return newSet;
    });
  };

  const expandAllBatches = () => {
    setExpandedBatches(new Set(filteredBatchGroups.map(group => group.batch.id)));
  };

  const collapseAllBatches = () => {
    setExpandedBatches(new Set());
  };

  // Filter batch groups based on search
  const filteredBatchGroups = batchGroups.filter(group => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      group.batch.name.toLowerCase().includes(searchLower) ||
      group.recorded_lessons.some(lesson => 
        lesson.title.toLowerCase().includes(searchLower)
      )
    );
  });

  // Calculate total recordings
  const totalRecordings = filteredBatchGroups.reduce((total, group) => 
    total + group.recorded_lessons.length, 0
  );

  if (isLoading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="p-4 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40"
          >
            <Loader2 className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </motion.div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Loading Recorded Sessions
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Please wait while we fetch your content...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center max-w-md"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="p-4 rounded-full bg-red-50 dark:bg-red-900/20 mb-4"
          >
            <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
          </motion.div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Unable to load sessions
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
            {error}
          </p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-medium shadow-lg transition-all duration-200"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6 max-w-7xl mx-auto"
    >
      {/* Header */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8"
      >
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="p-3 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 rounded-xl shadow-sm"
          >
            <Video className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              Recorded Sessions
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {filteredBatchGroups.length} batch{filteredBatchGroups.length !== 1 ? 'es' : ''} • {totalRecordings} recording{totalRecordings !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search batches or recordings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80 px-4 py-3 pl-11 pr-4 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm transition-all duration-200"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Refresh Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-xl transition-all duration-200 disabled:opacity-50"
              title="Refresh sessions"
            >
              <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </motion.button>

            {/* Expand/Collapse Controls */}
            {filteredBatchGroups.length > 1 && (
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                <button
                  onClick={expandAllBatches}
                  className="px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
                >
                  Expand All
                </button>
                <button
                  onClick={collapseAllBatches}
                  className="px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
                >
                  Collapse All
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Content */}
      {filteredBatchGroups.length === 0 ? (
        <motion.div 
          variants={itemVariants}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 mb-6"
          >
            <BookOpen className="w-12 h-12 text-gray-400" />
          </motion.div>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
            {searchTerm ? 'No matching recordings found' : 'No recorded sessions available'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md leading-relaxed">
            {searchTerm 
              ? 'Try adjusting your search terms or check if the recordings are available in other batches'
              : 'Your recorded sessions will appear here after you attend live classes and recordings are made available'
            }
          </p>
          {searchTerm && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchTerm("")}
              className="mt-6 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors"
            >
              Clear Search
            </motion.button>
          )}
        </motion.div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredBatchGroups.map((batchGroup, index) => (
              <motion.div
                key={batchGroup.batch.id}
                variants={itemVariants}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                layout
                custom={index}
              >
                <BatchCard
                  batchGroup={batchGroup}
                  onRecordingClick={handleRecordingClick}
                  isExpanded={expandedBatches.has(batchGroup.batch.id)}
                  onToggle={() => toggleBatch(batchGroup.batch.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default RecordedSessions;