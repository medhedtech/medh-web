"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Calendar, Clock, Star, Eye, Play, Video, Users, User, FileText, Download, Folder, Globe, Loader2, ChevronRight, Check, PlayCircle, Sparkles, TrendingUp, Award } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiUrls } from "@/apis";
import { batchAPI } from "@/apis/batch";
import useGetQuery from "@/hooks/getQuery.hook";

interface RecordedLesson {
  title: string;
  url: string;
  recorded_date: string;
  created_by: string;
  source?: string;
}

interface BatchSession {
  session_id: string;
  session_number: number;
  session_title: string;
  session_day: string;
  session_date?: string;
  session_start_time: string;
  session_end_time: string;
  session_duration: string;
  session_description?: string;
  instructor?: {
    full_name?: string;
    email?: string;
  };
  recorded_lessons: RecordedLesson[];
  videos_count: number;
}

interface BatchGroup {
  batch_id: string;
  batch_name: string;
  sessions: BatchSession[];
  total_videos: number;
  description: string;
}

interface PersonalSession {
  id: string;
  title: string;
  displayTitle: string;
  url: string;
  session?: {
    date: string;
    formattedDate: string;
    formattedTime: string;
    description: string;
    duration: string;
    status: string;
    rating: number;
  };
  source: string;
}

interface BatchOrganizedResponse {
  personal_sessions: {
    count: number;
    videos: PersonalSession[];
    description: string;
    type: string;
  };
  batch_sessions: {
    count: number;
    batches: BatchGroup[];
    total_videos: number;
    description: string;
    type: string;
  };
}

interface RecordedSession {
  id: string;
  course_title: string;
  instructor?: {
    name: string;
    rating: number;
  };
  category?: string;
  course_tag?: string;
  duration?: string;
  date?: string;
  created_at?: string;
  description?: string;
  views?: number;
  rating?: number;
  thumbnail?: string;
  video_url?: string;
  status?: 'available' | 'processing' | 'unavailable';
  batch_name?: string;
  batch_id?: string;
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
}

// Enhanced TabButton with count badges matching upcoming classes style
const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children, count }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`relative inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 overflow-hidden group ${
      active
        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
        : 'bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-gray-700/80 border border-gray-200 dark:border-gray-700'
    }`}
  >
    {/* Animated background for active state */}
    {active && (
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 animate-pulse"></div>
    )}
    
    <span className="relative z-10 flex items-center gap-2">
      {children}
      {count !== undefined && count > 0 && (
        <span className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full ${
          active 
            ? 'bg-white/20 text-white' 
            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
        }`}>
          {count}
        </span>
      )}
    </span>
  </motion.button>
);

// Modern Batch Group Card Component with Glassmorphism
const BatchGroupCard = ({ 
  batch, 
  onPlayVideo,
  studentName 
}: { 
  batch: BatchGroup; 
  onPlayVideo: (lesson: RecordedLesson, batch: BatchGroup, session: BatchSession) => void;
  studentName: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      className="relative group mb-8 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/40 to-white/20 dark:from-gray-800/80 dark:via-gray-800/40 dark:to-gray-800/20 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-2xl shadow-blue-500/10"></div>
      
      {/* Animated Border Gradient */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Content Container */}
      <div className="relative z-10 p-8">
        {/* Batch Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            {/* Batch Title with Gradient */}
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                <Folder className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-1">
                  {batch.batch_name}
                </h3>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                    Premium Batch
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              {batch.description}
            </p>
            
            {/* Stats with Modern Design */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-200/50 dark:border-blue-700/50">
                <PlayCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                  {batch.total_videos} videos
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border border-purple-200/50 dark:border-purple-700/50">
                <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                  {batch.sessions.length} sessions
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border border-green-200/50 dark:border-green-700/50">
                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                  Active
                </span>
              </div>
            </div>
          </div>
          
          {/* Modern Expand Button */}
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group/btn"
            title={isExpanded ? "Collapse sessions" : "Expand sessions"}
            aria-label={isExpanded ? "Collapse sessions" : "Expand sessions"}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className={`w-6 h-6 transition-transform duration-300 group-hover/btn:scale-110 ${isExpanded ? 'rotate-90' : ''}`} />
          </motion.button>
        </div>

        {/* Modern Sessions List */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="space-y-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50"
            >
              {batch.sessions.map((session, sessionIndex) => (
                <motion.div 
                  key={session.session_id} 
                  className="relative group/session"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: sessionIndex * 0.1 }}
                >
                  {/* Session Card with Glassmorphism */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/60 to-white/30 dark:from-gray-700/60 dark:to-gray-700/30 backdrop-blur-lg border border-white/30 dark:border-gray-600/30 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                    
                    {/* Session Header with Enhanced Details */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        {/* Session Number and Title */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                            <Calendar className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                Session {session.session_number}
                              </span>
                              <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                {session.session_title || `Session ${session.session_number}`}
                              </h4>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                              {(session.session_start_time && session.session_end_time) && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{session.session_start_time} - {session.session_end_time}</span>
                                </div>
                              )}
                              {(session.session_date || session.session_day) && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>
                                    {session.session_date 
                                      ? new Date(session.session_date).toLocaleDateString()
                                      : session.session_day
                                    }
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Additional Session Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                          {session.session_duration && (
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200/50 dark:border-blue-700/50">
                              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                {session.session_duration}
                              </span>
                            </div>
                          )}
                          
                          {session.instructor?.full_name && (
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-50 dark:bg-purple-900/30 border border-purple-200/50 dark:border-purple-700/50">
                              <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                              <span className="text-sm font-medium text-purple-700 dark:text-purple-300 truncate">
                                {session.instructor.full_name}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200/50 dark:border-green-700/50">
                            <Video className="w-4 h-4 text-green-600 dark:text-green-400" />
                            <span className="text-sm font-medium text-green-700 dark:text-green-300">
                              {session.videos_count} video{session.videos_count !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>

                        {/* Session Description */}
                        {session.session_description && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 leading-relaxed">
                            {session.session_description}
                          </p>
                        )}

                        {/* Student Name */}
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200/50 dark:border-indigo-700/50 mb-3">
                          <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                            Student: {studentName}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Recorded Lessons Grid */}
                    <div className="grid gap-4">
                      {session.recorded_lessons.map((lesson, lessonIndex) => (
                        <motion.div 
                          key={lessonIndex} 
                          className="group/lesson relative overflow-hidden rounded-xl bg-gradient-to-r from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-800/60 backdrop-blur-sm border border-white/40 dark:border-gray-600/40 p-4 hover:shadow-lg transition-all duration-300"
                          whileHover={{ scale: 1.02, y: -2 }}
                        >
                          {/* Lesson Content */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="p-2.5 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 shadow-md">
                                <PlayCircle className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 group-hover/lesson:text-blue-600 dark:group-hover/lesson:text-blue-400 transition-colors">
                                  {lesson.title}
                                </h5>
                                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>
                                      {lesson.recorded_date ? new Date(lesson.recorded_date).toLocaleDateString() : 'Date not available'}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Award className="w-3 h-3" />
                                    <span>HD Quality</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Modern Play Button */}
                            <motion.button
                              onClick={() => onPlayVideo(lesson, batch, session)}
                              className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 group/play"
                              title={`Play ${lesson.title}`}
                              aria-label={`Play ${lesson.title}`}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Play className="w-5 h-5 group-hover/play:scale-110 transition-transform" />
                            </motion.button>
                          </div>
                          
                          {/* Hover Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover/lesson:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Enhanced Recorded Session Card Component
const RecordedSessionCard = ({ 
  session, 
  onViewDetails,
  onPlay
}: { 
  session: RecordedSession; 
  onViewDetails: (session: RecordedSession) => void;
  onPlay: (session: RecordedSession) => void;
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'processing':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'unavailable':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default:
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
    }
  };

  const getStatusStripe = (status?: string) => {
    switch (status) {
      case 'available':
        return 'bg-gradient-to-r from-green-500 to-green-600';
      case 'processing':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
      case 'unavailable':
        return 'bg-gradient-to-r from-red-500 to-red-600';
      default:
        return 'bg-gradient-to-r from-blue-500 to-blue-600';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Status stripe */}
      <div className={`w-full h-1 ${getStatusStripe(session?.status || 'available')} rounded-t-xl mb-4 -mt-6 -mx-6`}></div>
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-1">
            {session?.course_title || "No Title Available"}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {session?.category || session?.course_tag || "General"} • Recorded Session
          </p>
          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(session?.date || session?.created_at)}
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {session?.duration || "Duration TBD"}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
          <Video className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
        
      {/* Category and Status */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {(session?.category || session?.course_tag) && (
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
              {session.category || session.course_tag}
            </span>
          )}
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(session?.status || 'available')}`}>
            {session?.status === 'processing' && <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-1 animate-pulse"></span>}
            {(session?.status || 'available').charAt(0).toUpperCase() + (session?.status || 'available').slice(1)}
          </span>
        </div>
      </div>

      {/* Rating and Views */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {session?.rating || session?.instructor?.rating || "4.5"}
          </span>
        </div>
        <div className="flex items-center text-blue-600 dark:text-blue-400">
          <Eye className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">
            {session?.views || 0} views
          </span>
        </div>
      </div>

      {/* Description */}
      {session?.description && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {session.description}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-2">
        <button 
          onClick={() => onViewDetails(session)}
          className="flex-1 flex items-center justify-center px-3 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </button>
        <button
          onClick={() => onPlay(session)}
          className={`flex-1 flex items-center justify-center px-3 py-2.5 rounded-xl transition-colors text-sm font-medium ${
            session?.status === 'available' 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : session?.status === 'processing'
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
          disabled={session?.status === 'unavailable'}
        >
          <Play className="w-4 h-4 mr-2" />
          {session?.status === 'available' ? 'Play Video' : 
           session?.status === 'processing' ? 'Processing' : 'Unavailable'}
        </button>
      </div>
    </div>
  );
};

const StudentRecordedSessions: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedSession, setSelectedSession] = useState<RecordedSession | null>(null);
  const [recordedSessions, setRecordedSessions] = useState<RecordedSession[]>([]);
  const [batchOrganizedData, setBatchOrganizedData] = useState<BatchOrganizedResponse | null>(null);
  const [studentName, setStudentName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { getQuery } = useGetQuery();

  // Get auth token
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  // Handle retry with session refresh
  const handleRetryWithRefresh = () => {
    setRetryCount(prev => prev + 1);
    
    // Clear any cached data
    setBatchOrganizedData(null);
    setRecordedSessions([]);
    
    // If this is the second retry, suggest login refresh
    if (retryCount >= 1) {
      setError("Multiple authentication failures. Please refresh the page or log in again.");
      return;
    }
    
    // Retry the fetch
    fetchRecordedSessions();
  };

  // Fetch recorded sessions from API
  const fetchRecordedSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (typeof window !== "undefined") {
        const token = getAuthToken();
        
        console.log('Debug - Auth check:', { 
          hasToken: !!token
        });

        if (!token) {
          setError("Please log in to view your recorded sessions.");
          setLoading(false);
          return;
        }

        try {
          // First, get user profile from database using token
          const userProfileResponse = await fetch('/api/v1/auth/profile', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'x-access-token': token,
              'Content-Type': 'application/json'
            },
          });

          if (!userProfileResponse.ok) {
            throw new Error(`Failed to get user profile: ${userProfileResponse.status}`);
          }

          const userProfile = await userProfileResponse.json();
          
          if (!userProfile.success || !userProfile.user) {
            throw new Error('Invalid user profile response');
          }

          const userId = userProfile.user._id || userProfile.user.id;
          const fullName = userProfile.user.full_name || 
            `${userProfile.user.first_name || ''} ${userProfile.user.last_name || ''}`.trim() ||
            userProfile.user.username || 'Student';
          
          setStudentName(fullName);
          
          console.log('Debug - User profile fetched:', { 
            hasUserId: !!userId,
            userRole: userProfile.user.role,
            studentName: fullName,
            userId: userId?.substring(0, 8) + '...'
          });

          console.log('🔍 Making API call to fetch recorded sessions...');

          if (!userId) {
            throw new Error('User ID not found in profile');
          }
        
          // Now fetch recorded lessons using the userId from database
          const response = await fetch(`/api/v1/batches/students/${userId}/recorded-lessons`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'x-access-token': token,
              'Content-Type': 'application/json'
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          
          console.log('📊 API Response received:', {
            success: data.success,
            count: data.count,
            method: data.method,
            s3_available: data.s3_available,
            dataKeys: data.data ? Object.keys(data.data) : 'No data',
            personalSessionsCount: data.data?.personal_sessions?.count || 0,
            batchSessionsCount: data.data?.batch_sessions?.count || 0,
            totalBatches: data.data?.batch_sessions?.batches?.length || 0
          });
          
          if (data && data.success) {
            const batchData = data.data as unknown as BatchOrganizedResponse;
            setBatchOrganizedData(batchData);
            
            console.log('✅ Batch data set:', {
              personalVideos: batchData.personal_sessions?.count || 0,
              batchCount: batchData.batch_sessions?.count || 0,
              totalBatches: batchData.batch_sessions?.batches?.length || 0,
              firstBatch: batchData.batch_sessions?.batches?.[0]?.batch_name || 'None'
            });
            
            // Convert batch-organized data to flat structure for backward compatibility
            const flatSessions: RecordedSession[] = [];
            
            // Add personal sessions
            if (batchData.personal_sessions?.videos) {
              batchData.personal_sessions.videos.forEach((video: PersonalSession) => {
                flatSessions.push({
                  id: video.id,
                  course_title: video.displayTitle || video.title,
                  date: video.session?.date || new Date().toISOString(),
                  duration: video.session?.duration || "90 min",
                  category: "Personal Session",
                  status: 'available',
                  video_url: video.url,
                  description: video.session?.description || "Personal recorded session",
                  rating: video.session?.rating || 0,
                  batch_name: "Personal Sessions",
                  batch_id: "personal"
                });
              });
            }
            
            // Add batch sessions
            if (batchData.batch_sessions?.batches) {
              batchData.batch_sessions.batches.forEach((batch: BatchGroup) => {
                batch.sessions.forEach((session: BatchSession) => {
                  session.recorded_lessons.forEach((lesson: RecordedLesson, index: number) => {
                    flatSessions.push({
                      id: `${session.session_id}_${index}`,
                      course_title: lesson.title,
                      date: lesson.recorded_date,
                      duration: "90 min", // Default duration
                      category: batch.batch_name,
                      status: 'available',
                      video_url: lesson.url,
                      description: `${session.session_day} ${session.session_start_time}-${session.session_end_time}`,
                      batch_name: batch.batch_name,
                      batch_id: batch.batch_id
                    });
                  });
                });
              });
            }
            
            setRecordedSessions(flatSessions);
            setLoading(false);
          } else {
            setError("No recorded sessions found.");
            setLoading(false);
          }
        } catch (error: any) {
          console.error("Error fetching user profile or recorded sessions:", error);
          
          if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
            setError("Your session has expired. Please log in again.");
          } else if (error.message?.includes('404') || error.message?.includes('not found')) {
            setError("User profile or sessions not found. Please log in again.");
          } else if (error.message?.includes('403') || error.message?.includes('Forbidden')) {
            setError("Access denied. Please check your permissions.");
          } else if (error.message?.includes('Failed to get user profile')) {
            setError("Unable to verify your identity. Please log in again.");
          } else {
            setError("Failed to load recorded sessions. Please try again later.");
          }
          
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Error in fetchRecordedSessions:", error);
      setError("An unexpected error occurred. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecordedSessions();
  }, []);

  const handleViewDetails = (session: RecordedSession) => {
    setSelectedSession(session);
  };

  const handleCloseModal = () => {
    setSelectedSession(null);
  };

  const handlePlayVideo = (session: RecordedSession) => {
    if (session.video_url) {
      window.open(session.video_url, '_blank');
    } else {
      router.push(`/dashboards/my-courses/${session.id}`);
    }
  };

  const handlePlayBatchVideo = (lesson: RecordedLesson, batch: BatchGroup, session: BatchSession) => {
    if (lesson.url) {
      // Log video play event for analytics
      console.log('Playing video:', {
        lesson_title: lesson.title,
        batch_name: batch.batch_name,
        session_number: session.session_number,
        session_title: session.session_title,
        student: studentName
      });
      
      // Open video in new tab
      window.open(lesson.url, '_blank', 'noopener,noreferrer');
    } else {
      console.error('Video URL not available for lesson:', lesson.title);
    }
  };

  const getFilteredSessions = () => {
    let filtered = recordedSessions;
    
    // Filter by tab
    switch (currentTab) {
      case 0: // All Sessions
        filtered = recordedSessions;
        break;
      case 1: // Available
        filtered = recordedSessions.filter(session => session.status === 'available');
        break;
      case 2: // Recent
        filtered = recordedSessions.filter(session => {
          const sessionDate = new Date(session.date || session.created_at || '');
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          return sessionDate >= oneWeekAgo;
        });
        break;
      case 3: // Favorites
        // For now, show all. Later can be filtered by user favorites
        filtered = recordedSessions;
        break;
      default:
        break;
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(session =>
        session.course_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.course_tag?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      // Sort by date, newest first
      const dateA = new Date(a.date || a.created_at || '');
      const dateB = new Date(b.date || b.created_at || '');
      return dateB.getTime() - dateA.getTime();
    });
  };

  const filteredContent = getFilteredSessions();

  // Count sessions for each tab
  const tabCounts = {
    all: recordedSessions.length,
    available: recordedSessions.filter(session => session.status === 'available').length,
    recent: recordedSessions.filter(session => {
      const sessionDate = new Date(session.date || session.created_at || '');
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return sessionDate >= oneWeekAgo;
    }).length,
    favorites: recordedSessions.length // For now, same as all
  };

  const tabs = [
    { name: "By Batches", icon: Folder, count: batchOrganizedData?.batch_sessions?.count || 0 },
    { name: "All Sessions", icon: Video, count: tabCounts.all },
    { name: "Available", icon: Check, count: tabCounts.available },
    { name: "Recent", icon: Clock, count: tabCounts.recent },
    { name: "Personal", icon: User, count: batchOrganizedData?.personal_sessions?.count || 0 }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="w-full h-full bg-gradient-to-br from-blue-50/20 via-purple-50/10 to-pink-50/20 dark:from-blue-900/5 dark:via-purple-900/5 dark:to-pink-900/5"></div>
      </div>
      
      <div className="relative z-10 p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="flex flex-col space-y-8">
          {/* Modern Hero Header */}
          <div className="text-center pt-8 pb-6">
            <motion.div 
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-8"
            >
              {/* Floating Icon */}
              <motion.div 
                className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-2xl shadow-blue-500/25 mb-6"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Video className="w-10 h-10 text-white" />
              </motion.div>
              
              {/* Hero Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
                <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                  Recorded Sessions
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Access your premium course recordings anytime, anywhere. 
                <span className="text-blue-600 dark:text-blue-400 font-semibold"> Never miss a lesson again.</span>
              </p>
            </motion.div>

            {/* Modern Search Bar */}
            <motion.div 
              className="relative max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-xl">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <Search className="h-6 w-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search your recorded sessions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-16 pr-6 py-4 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none text-lg font-medium"
                  />
                  {searchTerm && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => setSearchTerm('')}
                      className="absolute inset-y-0 right-0 pr-6 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="h-5 w-5" />
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Modern Tabs Navigation */}
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative">
              {/* Glassmorphism Background */}
              <div className="absolute inset-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-2xl rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-2xl"></div>
              
              {/* Tabs Container */}
              <div className="relative flex p-2 gap-2">
                {tabs.map((tab, idx) => {
                  const TabIcon = tab.icon;
                  return (
                    <TabButton
                      key={idx}
                      active={currentTab === idx}
                      onClick={() => setCurrentTab(idx)}
                      count={tab.count}
                    >
                      <TabIcon className="w-5 h-5" />
                      <span className="font-semibold hidden sm:inline">{tab.name}</span>
                    </TabButton>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Modern Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse"></div>
                <motion.div
                  className="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent border-t-white"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <motion.p 
                className="text-xl font-semibold text-gray-700 dark:text-gray-300 mt-6"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Loading your recorded sessions...
              </motion.p>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Preparing your learning content
              </p>
            </motion.div>
          )}

          {/* Modern Error State */}
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-50 via-red-50/50 to-orange-50/30 dark:from-red-900/20 dark:via-red-900/10 dark:to-orange-900/10 border border-red-200/50 dark:border-red-800/30 p-8 text-center backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-6">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 shadow-lg">
                    <X className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-3">
                  Oops! Something went wrong
                </h3>
                
                <p className="text-red-600 dark:text-red-300 mb-6 max-w-md mx-auto leading-relaxed">
                  {error}
                </p>
                
                <div className="flex gap-4 justify-center">
                  <motion.button
                    onClick={handleRetryWithRefresh}
                    className="px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Try Again
                  </motion.button>
                  
                  <motion.button
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Refresh Page
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

        {/* Content */}
        {!loading && !error && (
          <AnimatePresence mode="wait">
            {currentTab === 0 ? (
              // Batch-organized view
              <motion.div
                key="batch-organized"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {batchOrganizedData?.batch_sessions?.batches && batchOrganizedData.batch_sessions.batches.length > 0 ? (
                  <>
                    {/* Modern Personal Sessions Section */}
                    {batchOrganizedData.personal_sessions?.videos && batchOrganizedData.personal_sessions.videos.length > 0 && (
                      <motion.div 
                        className="mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="flex items-center gap-4 mb-8">
                          <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
                            <User className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                              Personal Sessions
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 font-medium">
                              {batchOrganizedData.personal_sessions.count} exclusive recordings
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                          {batchOrganizedData.personal_sessions.videos.map((video, index) => (
                            <motion.div
                              key={video.id}
                              initial={{ opacity: 0, y: 20, scale: 0.9 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              className="group relative overflow-hidden"
                              whileHover={{ y: -8 }}
                            >
                              {/* Glassmorphism Card */}
                              <div className="relative bg-gradient-to-br from-white/80 via-white/60 to-white/40 dark:from-gray-800/80 dark:via-gray-800/60 dark:to-gray-800/40 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/30 p-8 shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                                
                                {/* Animated Background Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                                
                                <div className="relative z-10">
                                  {/* Video Icon */}
                                  <div className="flex items-center justify-between mb-6">
                                    <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg group-hover:shadow-xl transition-shadow">
                                      <PlayCircle className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-200/50 dark:border-emerald-700/50">
                                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                                        PERSONAL
                                      </span>
                                    </div>
                                  </div>
                                  
                                  {/* Content */}
                                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                    {video.displayTitle}
                                  </h3>
                                  
                                  {video.session && (
                                    <div className="flex items-center gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
                                      <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{video.session.formattedDate}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span>{video.session.duration}</span>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Play Button */}
                                  <motion.button
                                    onClick={() => window.open(video.url, '_blank')}
                                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-2xl py-4 px-6 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 group/btn"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <Play className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                                    <span>Watch Now</span>
                                  </motion.button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Modern Batch Sessions Section */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                          <Folder className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                            Batch Sessions
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400 font-medium">
                            {batchOrganizedData.batch_sessions.count} active batches with {batchOrganizedData.batch_sessions.total_videos} videos
                          </p>
                        </div>
                      </div>
                      {batchOrganizedData.batch_sessions.batches.map((batch, index) => (
                        <motion.div
                          key={batch.batch_id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <BatchGroupCard
                            batch={batch}
                            onPlayVideo={handlePlayBatchVideo}
                            studentName={studentName}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                      No batch sessions found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      You haven't been enrolled in any batches with recorded sessions yet.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ) : currentTab === 4 ? (
              // Personal sessions only view
              <motion.div
                key="personal-only"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {batchOrganizedData?.personal_sessions?.videos && batchOrganizedData.personal_sessions.videos.length > 0 ? (
                  batchOrganizedData.personal_sessions.videos.map((video, index) => (
                    <motion.div
                      key={video.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            {video.displayTitle}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Personal Session
                          </p>
                          {video.session && (
                            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                              <div className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {video.session.formattedDate}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {video.session.duration}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                          <Video className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <button
                        onClick={() => window.open(video.url, '_blank')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-4 transition-colors flex items-center justify-center"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Watch Now
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full text-center py-12"
                  >
                    <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                      No personal sessions found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      You don't have any personal recorded sessions yet.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              // Traditional flat view for other tabs
              <motion.div
                key={currentTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {filteredContent.length > 0 ? (
                  filteredContent.map((session, index) => (
                    <motion.div
                      key={session.id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <RecordedSessionCard
                        session={session}
                        onViewDetails={handleViewDetails}
                        onPlay={handlePlayVideo}
                      />
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="col-span-full flex flex-col items-center justify-center text-center py-16"
                  >
                    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-4">
                      <Video className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {searchTerm ? "No matching sessions found" : "No recorded sessions available"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md">
                      {searchTerm 
                        ? "Try adjusting your search term to find what you're looking for."
                        : "You don't have any recorded sessions yet. Check back after attending some classes."}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Enhanced Details Modal */}
        <AnimatePresence>
          {selectedSession && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50"
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-2xl max-w-lg w-full relative max-h-[85vh] overflow-y-auto"
              >
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </motion.button>

                <div className="pr-12">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                      <Video className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedSession?.course_title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Recorded Session
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Folder className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Category</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{selectedSession?.category || selectedSession?.course_tag || "General"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Duration</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedSession?.duration || "Duration TBD"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Recorded Date</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedSession?.date || selectedSession?.created_at 
                            ? new Date(selectedSession.date || selectedSession.created_at || '').toLocaleDateString() 
                            : "Date not available"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Eye className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Views</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedSession?.views || 0} views
                        </p>
                      </div>
                    </div>

                    {selectedSession?.description && (
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Description</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{selectedSession.description}</p>
                        </div>
                      </div>
                    )}

                    {(!selectedSession?.description) && (
                      <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                        No additional details available for this session.
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={handleCloseModal}
                      className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => handlePlayVideo(selectedSession)}
                      className={`flex-1 px-4 py-2 rounded-xl font-medium transition-colors ${
                        selectedSession?.status === 'available' 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      }`}
                      disabled={selectedSession?.status !== 'available'}
                    >
                      {selectedSession?.status === 'available' ? 'Watch Video' : 'Not Available'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentRecordedSessions;
