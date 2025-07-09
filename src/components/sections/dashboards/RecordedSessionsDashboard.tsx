"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Calendar, 
  Clock, 
  Star, 
  Eye, 
  Play, 
  MonitorPlay,
  X,
  ArrowLeft,
  AlertCircle,
  Loader2,
  Video
} from "lucide-react";

import StudentDashboardLayout from "./StudentDashboardLayout";
import batchAPI, { IRecordedLesson, IBatchWithDetails } from "@/apis/batch";
import EnrollmentAPI, { IEnrollment } from "@/apis/enrollment";
import { PageLoading } from "@/components/ui/loading";
import VideoPlayer from "@/components/shared/lessons/VideoPlayer";
import { buildComponent, buildAdvancedComponent, getResponsive, getAnimations, getEnhancedSemanticColor } from '@/utils/designSystem';
import clsx from 'clsx';

interface RecordedSession {
  id: string;
  title: string;
  displayTitle?: string;
  course?: {
    name: string;
    category: string;
  };
  instructor?: {
    name: string;
    rating?: number;
  };
  duration?: string;
  recordedDate?: string;
  formattedDate?: string;
  formattedTime?: string;
  status?: 'Available' | 'available' | 'processing' | 'unavailable';
  level?: 'beginner' | 'intermediate' | 'advanced';
  url?: string;
  description?: string;
  batchName?: string;
  sessionNumber?: number;
  viewCount?: number;
  fileSize?: number;
  // Additional fields from API
  batchId?: string;
  sessionId?: string;
  courseId?: string;
  enrollmentId?: string;
  source?: string;
  student?: {
    id: string;
    name: string;
  };
}

interface CurrentVideo {
  session: RecordedSession;
  batchName: string;
}

// URL obfuscation utilities
const urlObfuscation = {
  encode: (url: string): string => {
    try {
      // Simple obfuscation: base64 + reversing + adding noise
      const reversed = url.split('').reverse().join('');
      const encoded = btoa(reversed);
      const noise = Math.random().toString(36).substring(2, 8);
      return `${noise}${encoded}${noise}`;
    } catch (error) {
      console.error('URL encoding failed:', error);
      return url;
    }
  },
  
  decode: (obfuscatedUrl: string): string => {
    try {
      // Remove noise (first 6 and last 6 characters) and decode
      const noiseLength = 6;
      const encoded = obfuscatedUrl.slice(noiseLength, -noiseLength);
      const decoded = atob(encoded);
      const original = decoded.split('').reverse().join('');
      return original;
    } catch (error) {
      console.error('URL decoding failed:', error);
      return obfuscatedUrl;
    }
  }
};

// Video Player Modal Component
const VideoPlayerModal: React.FC<{
  currentVideo: CurrentVideo | null;
  onClose: () => void;
  onProgress?: (progress: number, currentTime: number) => void;
  onMiniPlayerToggle?: (isMinimized: boolean) => void;
}> = ({ currentVideo, onClose, onProgress, onMiniPlayerToggle }) => {
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isMiniPlayer, setIsMiniPlayer] = useState(false);

  if (!currentVideo) return null;

  const decodedUrl = currentVideo.session.url ? urlObfuscation.decode(currentVideo.session.url) : '';

  const handleVideoError = (error: string) => {
    setVideoError(error);
    console.error('Video playback error:', error);
  };

  const handleVideoProgress = (progress: number, currentTime: number) => {
    onProgress?.(progress, currentTime);
    
    // Optional: Save progress to localStorage or API
    try {
      const progressKey = `video_progress_${currentVideo.session.id}`;
      localStorage.setItem(progressKey, JSON.stringify({
        currentTime,
        progress,
        lastWatched: new Date().toISOString()
      }));
    } catch (error) {
      console.warn('Failed to save video progress:', error);
    }
  };

  const getSavedProgress = () => {
    try {
      const progressKey = `video_progress_${currentVideo.session.id}`;
      const saved = localStorage.getItem(progressKey);
      if (saved) {
        const data = JSON.parse(saved);
        return data.currentTime || 0;
      }
    } catch (error) {
      console.warn('Failed to load saved progress:', error);
    }
    return 0;
  };

  // Function to refresh S3 URL for expired signed URLs
  const refreshS3Url = async (): Promise<string> => {
    try {
      // In a real application, this would call your API to get a new signed URL
      // For now, we'll simulate the refresh by calling the batch API again
      console.log('Refreshing S3 URL for session:', currentVideo.session.id);
      
      // You would implement this API call based on your backend
      const response = await fetch(`/api/sessions/${currentVideo.session.id}/refresh-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to refresh URL');
      }
      
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error refreshing S3 URL:', error);
      throw error;
    }
  };

  const handleMiniPlayerToggle = (isMinimized: boolean) => {
    setIsMiniPlayer(isMinimized);
    onMiniPlayerToggle?.(isMinimized);
  };

  const handleClose = () => {
    setIsMiniPlayer(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {!isMiniPlayer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full max-w-6xl bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="p-3 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 rounded-xl"
                >
                  <Play className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1 truncate">
                    {currentVideo.session.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <MonitorPlay className="w-4 h-4" />
                      {currentVideo.batchName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {currentVideo.session.recordedDate ? new Date(currentVideo.session.recordedDate).toLocaleDateString() : 'Unknown date'}
                    </span>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </motion.button>
            </div>

            {/* Video Player */}
            <div className="p-6">
              {videoError ? (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">
                    Video Error
                  </h3>
                  <p className="text-red-600 dark:text-red-300 mb-4">
                    {videoError}
                  </p>
                  <button
                    onClick={() => setVideoError(null)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : decodedUrl ? (
                <VideoPlayer
                  src={decodedUrl}
                  autoplay={false} // Removed autoplay for better UX
                  onProgress={handleVideoProgress}
                  onError={handleVideoError}
                  initialTime={getSavedProgress()}
                  allowDownload={false}
                  allowMiniPlayer={true}
                  onMiniPlayerToggle={handleMiniPlayerToggle}
                  onRefreshUrl={refreshS3Url}
                  quality="auto"
                  sessionId={currentVideo.session.id}
                  sessionTitle={currentVideo.session.title}
                  onClose={handleClose}
                />
              ) : (
                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    No Video URL
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    This session doesn't have a video URL available.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 pb-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClose}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sessions
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Batch Card Component
const BatchCard = ({ 
  batch, 
  onWatchNow 
}: { 
  batch: {
    batchName: string;
    batchId?: string;
    course?: { name: string; category: string };
    instructor?: { name: string; rating?: number };
    sessions: RecordedSession[];
  };
  onWatchNow: (session: RecordedSession, batchName: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Batch Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {batch.batchName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {batch.course?.name || "Unknown Course"} • by {batch.instructor?.name || "Unknown Instructor"}
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <MonitorPlay className="w-3 h-3 mr-1" />
                {batch.sessions.length} recorded session{batch.sessions.length !== 1 ? 's' : ''}
              </div>
              {batch.instructor?.rating && (
                <div className="flex items-center">
                  <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                  {batch.instructor.rating}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <MonitorPlay className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        
        {/* Course Category */}
        {batch.course?.category && (
          <div className="mb-4">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
              {batch.course.category}
            </span>
          </div>
        )}

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <span className="text-sm font-medium mr-2">
            {isExpanded ? 'Hide Sessions' : 'View Sessions'}
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </button>
      </div>

      {/* Sessions List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {batch.sessions.map((session, index) => (
                  <RecordedSessionCard
                    key={session.id || index}
                    session={session}
                    onWatchNow={(session) => onWatchNow(session, batch.batchName)}
                    compact={true}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Updated Recorded Session Card Component with minimalistic design
const RecordedSessionCard = ({ 
  session, 
  onWatchNow,
  compact = false
}: { 
  session: RecordedSession; 
  onWatchNow: (session: RecordedSession) => void;
  compact?: boolean;
}) => {
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return mb > 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb.toFixed(0)} MB`;
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Available':
      case 'available':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'processing':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'unavailable':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
    }
  };

  const isAvailable = session?.status === 'Available' || session?.status === 'available';

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={clsx(
        buildAdvancedComponent.glassCard({ 
          variant: 'primary', 
          hover: true, 
          padding: compact ? 'mobile' : 'tablet' 
        }),
        'flex flex-col h-full relative group'
      )}
    >
      {/* Session Number Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold rounded-full">
          Session {session?.sessionNumber || 'N/A'}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-4">
        {/* Header */}
        <div className="pr-16">
          <h3 className={`font-bold text-gray-900 dark:text-gray-100 line-clamp-2 ${
            compact ? 'text-lg' : 'text-xl'
          }`}>
            {session?.displayTitle || session?.title || "Session Recording"}
          </h3>
          {session?.student?.name && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              by {session.student.name}
            </p>
          )}
        </div>

        {/* Session Details */}
        <div className="grid grid-cols-2 gap-4">
          {/* Date & Time */}
          <div className="space-y-1">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{session?.formattedDate || 'Unknown Date'}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4 mr-2" />
              <span>{session?.formattedTime || session?.duration || '90 min'}</span>
            </div>
          </div>

          {/* File Info */}
          <div className="space-y-1">
            {session?.fileSize && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Video className="w-4 h-4 mr-2" />
                <span>{formatFileSize(session.fileSize)}</span>
              </div>
            )}
            <div className="flex items-center">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(session?.status)}`}>
                {session?.status === 'Available' ? 'Ready' : session?.status || 'Unknown'}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        {session?.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {session.description}
          </p>
        )}
      </div>

      {/* Action Button */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onWatchNow(session)}
          disabled={!isAvailable}
          className={clsx(
            'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200',
            isAvailable
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          )}
        >
          <Play className="w-4 h-4" />
          {isAvailable ? 'Watch Now' : 'Unavailable'}
        </motion.button>
      </div>
    </motion.div>
  );
};

// Main Student Recorded Sessions Component
const StudentRecordedSessions: React.FC = () => {
  const [recordedSessions, setRecordedSessions] = useState<RecordedSession[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrollments, setEnrollments] = useState<IEnrollment[]>([]);
  const [currentVideo, setCurrentVideo] = useState<CurrentVideo | null>(null);
  const [miniPlayerActive, setMiniPlayerActive] = useState(false);

  useEffect(() => {
    fetchRecordedSessions();
  }, []);

  const fetchRecordedSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get student ID from local storage or auth context
      const studentId = localStorage.getItem('userId');
      if (!studentId) {
        throw new Error('Student ID not found. Please log in again.');
      }
      
      console.log('Fetching recorded sessions for student:', studentId);
      
      // Add a timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout - API took too long to respond')), 30000);
      });
      
      const sessions: RecordedSession[] = [];
      
      try {
        // Use the dedicated student recorded lessons API
        console.log('Calling batchAPI.getStudentRecordedLessons...');
        
        const apiCall = batchAPI.getStudentRecordedLessons(studentId, {
          limit: 100,
          sort_by: 'date',
          sort_order: 'desc'
        });
        
        const recordedLessonsResponse = await Promise.race([apiCall, timeoutPromise]) as any;
        
        console.log('Recorded lessons API response received:', recordedLessonsResponse);
        console.log('API Response success:', recordedLessonsResponse?.success);
        console.log('API Response status:', recordedLessonsResponse?.status);
        console.log('API Response data keys:', recordedLessonsResponse?.data ? Object.keys(recordedLessonsResponse.data) : 'No data');
        
        // Check if we have a successful response with data
        if ((recordedLessonsResponse?.success || recordedLessonsResponse?.status === 'success') && recordedLessonsResponse?.data) {
          // Handle nested data structure - the actual data we want is in recordedLessonsResponse.data.data
          const responseData = recordedLessonsResponse.data.data || recordedLessonsResponse.data;
          console.log('Response data structure:', responseData);
          console.log('Response data keys:', Object.keys(responseData));
          
          // Process personal sessions
          if (responseData.personal_sessions?.videos && Array.isArray(responseData.personal_sessions.videos)) {
            const personalVideos = responseData.personal_sessions.videos;
            console.log(`Processing ${personalVideos.length} personal session videos`);
            console.log('First video sample:', personalVideos[0]);
            
            personalVideos.forEach((video: any, index: number) => {
              try {
                console.log(`Processing video ${index + 1}:`, {
                  id: video.id,
                  displayTitle: video.displayTitle,
                  sessionNumber: video.session?.number,
                  status: video.session?.status
                });
                
                const recordedSession: RecordedSession = {
                  id: video.id,
                  title: video.title || 'Session Recording',
                  displayTitle: video.displayTitle || video.title,
                  course: {
                    name: 'Personal Sessions',
                    category: 'Personal'
                  },
                  instructor: {
                    name: video.student?.name || 'Unknown',
                    rating: video.session?.rating || 5.0
                  },
                  duration: video.session?.duration || '90 min',
                  recordedDate: video.session?.date || video.lastModified,
                  formattedDate: video.session?.formattedDate,
                  formattedTime: video.session?.formattedTime,
                  status: video.session?.status || 'Available',
                  level: video.session?.level || 'Intermediate',
                  description: video.session?.description,
                  batchName: 'Personal Sessions',
                  sessionNumber: video.session?.number || parseInt(video.displayTitle?.replace('Session ', '') || '1'),
                  viewCount: 0,
                  fileSize: video.fileSize,
                  url: video.url ? urlObfuscation.encode(video.url) : undefined,
                  source: video.source,
                  student: video.student,
                  // Additional fields
                  batchId: 'personal',
                  sessionId: video.id,
                  courseId: 'personal',
                  enrollmentId: 'personal'
                };
                
                sessions.push(recordedSession);
                console.log(`✅ Added personal session: ${recordedSession.displayTitle} (${recordedSession.id})`);
              } catch (videoError) {
                console.error(`❌ Error processing video ${index}:`, videoError, video);
              }
            });
            
            console.log(`✅ Processed ${personalVideos.length} personal videos, sessions array now has ${sessions.length} items`);
          } else {
            console.warn('⚠️ No personal_sessions.videos found or not an array:', responseData.personal_sessions);
          }
          
          // Process scheduled sessions
          if (responseData.scheduled_sessions?.sessions && Array.isArray(responseData.scheduled_sessions.sessions)) {
            const scheduledSessions = responseData.scheduled_sessions.sessions;
            console.log(`Processing ${scheduledSessions.length} scheduled session entries`);
            
            scheduledSessions.forEach((sessionEntry: any) => {
              try {
                const { batch, session, recorded_lessons } = sessionEntry;
                
                if (!batch || !recorded_lessons || !Array.isArray(recorded_lessons)) {
                  return;
                }
                
                recorded_lessons.forEach((lesson: any, lessonIndex: number) => {
                  if (!lesson || !lesson._id) return;
                  
                  const recordedSession: RecordedSession = {
                    id: lesson._id,
                    title: lesson.title || `${batch.name} - Lesson ${lessonIndex + 1}`,
                    displayTitle: lesson.displayTitle || lesson.title,
                    course: {
                      name: batch.name || 'Unknown Course',
                      category: batch.category || 'General'
                    },
                    instructor: {
                      name: batch.instructor?.name || 'Unknown Instructor',
                      rating: 4.5
                    },
                    duration: lesson.duration || '90 min',
                    recordedDate: lesson.recorded_date,
                    formattedDate: lesson.formattedDate,
                    formattedTime: lesson.formattedTime,
                    status: lesson.status || 'Available',
                    level: lesson.level || 'Intermediate',
                    description: lesson.description || `Recorded lesson from ${batch.name}`,
                    batchName: batch.name,
                    sessionNumber: lessonIndex + 1,
                    viewCount: lesson.view_count || 0,
                    fileSize: lesson.fileSize,
                    url: lesson.url ? urlObfuscation.encode(lesson.url) : undefined,
                    source: 'scheduled_sessions',
                    // Additional API fields
                    batchId: batch.id,
                    sessionId: session?.id,
                    courseId: batch.id,
                    enrollmentId: `enrollment_${batch.id}`
                  };
                  
                  sessions.push(recordedSession);
                  console.log(`✅ Added scheduled session: ${recordedSession.displayTitle}`);
                });
              } catch (sessionError) {
                console.error('❌ Error processing scheduled session:', sessionError);
              }
            });
          } else {
            console.log('ℹ️ No scheduled sessions found:', responseData.scheduled_sessions);
          }
          
          console.log(`🔍 Total sessions collected before deduplication: ${sessions.length}`);
        } else {
          console.warn('❌ API Response does not match expected structure:');
          console.log('Response success:', recordedLessonsResponse?.success);
          console.log('Response data:', recordedLessonsResponse?.data);
          console.log('Full response:', recordedLessonsResponse);
        }
        
      } catch (apiError: any) {
        console.error('Error calling recorded lessons API:', apiError);
        
        if (apiError?.response?.status === 404) {
          throw new Error('Recorded sessions endpoint not found. Please ensure your backend server is running.');
        } else if (apiError?.code === 'ECONNREFUSED' || apiError?.message?.includes('Network Error')) {
          throw new Error('Cannot connect to the API server. Please ensure your backend is running.');
        } else {
          throw new Error(`API Error: ${apiError?.message || 'Unknown error occurred'}`);
        }
      }
      
      // Remove duplicates and sort by session number
      const uniqueSessions = sessions
        .filter((session, index, self) => 
          index === self.findIndex(s => s.id === session.id)
        )
        .sort((a, b) => (b.sessionNumber || 0) - (a.sessionNumber || 0));
      
      console.log(`🔍 Total sessions after deduplication: ${uniqueSessions.length}`);
      console.log(`✅ Successfully loaded ${uniqueSessions.length} unique recorded sessions`);
      console.log('Sample sessions:', uniqueSessions.slice(0, 3).map(s => ({
        id: s.id,
        displayTitle: s.displayTitle,
        sessionNumber: s.sessionNumber,
        status: s.status
      })));
      
      setRecordedSessions(uniqueSessions);
      
    } catch (error: any) {
      console.error('Error fetching recorded sessions:', error);
      
      let errorMessage = 'Failed to load recorded sessions. Please try again.';
      
      if (error?.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your internet connection and try again.';
      } else if (error?.message?.includes('Network Error') || error?.code === 'ECONNREFUSED') {
        errorMessage = 'Cannot connect to the server. Please ensure the backend is running.';
      } else if (error?.response?.status === 404) {
        errorMessage = 'API endpoint not found. Please check your server configuration.';
      } else if (error?.response?.status === 401 || error?.response?.status === 403) {
        errorMessage = 'Authentication error. Please log in again.';
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setRecordedSessions([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to calculate duration from start and end time
  const calculateDuration = (startTime: string, endTime: string): number => {
    try {
      const [startHour, startMin] = startTime.split(':').map(Number);
      const [endHour, endMin] = endTime.split(':').map(Number);
      
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      
      return Math.max(endMinutes - startMinutes, 0);
    } catch {
      return 90; // Default duration
    }
  };

  const handleWatchNow = (session: RecordedSession, batchName: string) => {
    if ((session.status === 'Available' || session.status === 'available') && session.url) {
      setCurrentVideo({ session, batchName });
      console.log(`Opening video player for: ${session.title}`);
    } else if (!session.url) {
      console.warn('Video URL not available for this session');
    } else {
      console.warn('This session is not available for viewing');
    }
  };

  const handleCloseVideo = () => {
    setCurrentVideo(null);
    setMiniPlayerActive(false);
  };

  const handleVideoProgress = (progress: number, currentTime: number) => {
    // Optional: Track video progress for analytics
    console.log(`Video progress: ${progress}% at ${currentTime}s`);
  };

  const handleMiniPlayerToggle = (isMinimized: boolean) => {
    setMiniPlayerActive(isMinimized);
    console.log(`Mini player ${isMinimized ? 'activated' : 'deactivated'}`);
  };

  // Debug: Log the recorded sessions
  console.log('🔄 Component Render - Total recorded sessions:', recordedSessions.length);
  console.log('🔄 Component Render - Recorded sessions data:', recordedSessions);

  // Group sessions by source/type instead of batch
  const groupedBySource = recordedSessions.reduce((acc, session) => {
    const sourceKey = session.source === 'your_previous_sessions' ? 'Personal Sessions' : session.batchName || 'Unknown';
    if (!acc[sourceKey]) {
      acc[sourceKey] = {
        batchName: sourceKey,
        batchId: session.batchId,
        course: session.course,
        instructor: session.instructor,
        sessions: []
      };
    }
    acc[sourceKey].sessions.push(session);
    return acc;
  }, {} as Record<string, {
    batchName: string;
    batchId?: string;
    course?: { name: string; category: string };
    instructor?: { name: string; rating?: number };
    sessions: RecordedSession[];
  }>);

  // Filter groups based on search term
  const filteredGroups = Object.values(groupedBySource).filter(group =>
    group.batchName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.course?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.instructor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.sessions.some(session =>
      session?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session?.displayTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Debug: Log the grouped batches
  console.log('🔄 Component Render - Grouped by batch:', groupedBySource);
  console.log('🔄 Component Render - Number of batches:', Object.keys(groupedBySource).length);

  // Debug: Log the filtered batches
  console.log('🔄 Component Render - Filtered batches:', filteredGroups);
  console.log('🔄 Component Render - Number of filtered batches:', filteredGroups.length);

  // Additional debugging - log each step
  console.log('🔄 Component Render - recordedSessions length check:', recordedSessions.length);
  console.log('🔄 Component Render - loading state:', loading);
  console.log('🔄 Component Render - error state:', error);
  console.log('🔄 Component Render - filteredBatches check:', filteredGroups.length > 0);

  // Force show data for debugging if we have sessions but no batches
  if (recordedSessions.length > 0 && filteredGroups.length === 0) {
    console.error('❌ DATA PROCESSING ERROR: We have sessions but no batches!');
    console.log('All sessions:', recordedSessions);
    console.log('Grouped data:', groupedBySource);
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 lg:p-8 rounded-lg max-w-7xl mx-auto"
      >
        <div className="flex flex-col space-y-6">
          {/* Enhanced Header */}
          <div className="text-center pt-6 pb-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-center mb-4"
            >
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl backdrop-blur-sm mr-4">
                <Video className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-left">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                  Recorded Sessions
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                  Access your past class recordings{miniPlayerActive && ' • Mini player active'}
                </p>
              </div>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              className="relative max-w-lg mx-auto"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search recorded sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              />
            </motion.div>
          </div>

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading recorded sessions...</p>
            </motion.div>
          )}

          {/* Error State */}
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center"
            >
              <div className="flex items-center justify-center mb-2">
                <X className="w-6 h-6 text-red-500 mr-2" />
                <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Error Loading Recorded Sessions</h3>
              </div>
              <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  fetchRecordedSessions();
                }}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {/* Content - Session Groups */}
          {!loading && !error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group, index) => (
                  <motion.div
                    key={group.batchId || group.batchName || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <BatchCard
                      batch={group}
                      onWatchNow={handleWatchNow}
                    />
                  </motion.div>
                ))
              ) : recordedSessions.length > 0 ? (
                // Fallback: Show sessions as individual cards
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {recordedSessions.slice(0, 12).map((session, index) => (
                    <motion.div
                      key={session.id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <RecordedSessionCard
                        session={session}
                        onWatchNow={(session) => handleWatchNow(session, session.batchName || 'Unknown')}
                        compact={false}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="max-w-md mx-auto">
                    <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {searchTerm ? "No sessions found" : "No recorded sessions available"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {searchTerm 
                        ? "Try adjusting your search term to find what you're looking for."
                        : "Recorded sessions will appear here after your classes are completed."}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Video Player Modal */}
      <VideoPlayerModal
        currentVideo={currentVideo}
        onClose={handleCloseVideo}
        onProgress={handleVideoProgress}
        onMiniPlayerToggle={handleMiniPlayerToggle}
      />
    </>
  );
};

const RecordedSessionsDashboard: React.FC = () => {
  return (
    <StudentDashboardLayout 
      userRole="student"
      fullName="Student"
      userEmail="student@example.com"
      userImage=""
      userNotifications={0}
      userSettings={{
        theme: "light",
        language: "en",
        notifications: true
      }}
    >
      <StudentRecordedSessions />
    </StudentDashboardLayout>
  );
};

export default RecordedSessionsDashboard; 