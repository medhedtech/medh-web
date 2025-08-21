"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Calendar, 
  Clock, 
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
    instructor?: { name: string; };
    sessions: RecordedSession[];
  };
  onWatchNow: (session: RecordedSession, batchName: string) => void;
}) => {
  const handleBatchClick = () => {
    // Navigate to same page with batch videos
    const batchUrl = `/dashboards/student/batch-videos/${batch.batchId || 'unknown'}`;
    window.location.href = batchUrl;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="group relative overflow-hidden w-full h-full cursor-pointer"
      onClick={handleBatchClick}
    >
      {/* Compact Card */}
      <div className="relative bg-gradient-to-br from-white/95 via-white/80 to-white/60 dark:from-gray-800/95 dark:via-gray-800/80 dark:to-gray-800/60 backdrop-blur-lg border border-white/30 dark:border-gray-700/40 rounded-2xl shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 overflow-hidden h-full">
        
        {/* Hover Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/10 dark:from-blue-900/10 dark:via-purple-900/5 dark:to-pink-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Content */}
        <div className="relative z-10 p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              {/* Batch Name */}
              <h3 className="text-lg font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-2 leading-tight group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                {batch.batchName}
              </h3>
              
              {/* Course Info */}
              <div className="space-y-1 mb-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {batch.course?.name || "Digital Marketing Course"}
                </p>
                <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-2" />
                  by {batch.instructor?.name || "Expert Instructor"}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-3 text-xs">
                <div className="flex items-center px-2.5 py-1 bg-gradient-to-r from-blue-100/80 to-purple-100/80 dark:from-blue-900/40 dark:to-purple-900/40 rounded-full">
                  <MonitorPlay className="w-3 h-3 mr-1.5 text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold text-blue-700 dark:text-blue-300">
                    {batch.sessions.length} Video{batch.sessions.length !== 1 ? 's' : ''}
                  </span>
                </div>
                

              </div>
            </div>

            {/* Play Icon */}
            <div className="relative">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl shadow-lg shadow-blue-500/25 group-hover:shadow-xl group-hover:shadow-blue-500/40 group-hover:scale-110 transition-all duration-300">
                <Play className="w-5 h-5 text-white ml-0.5" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
            </div>
          </div>
          
          {/* Category Badge */}
          {batch.course?.category && (
            <div className="mb-3">
              <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-indigo-100/80 via-purple-100/80 to-pink-100/80 dark:from-indigo-900/40 dark:via-purple-900/40 dark:to-pink-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-full border border-indigo-200/50 dark:border-indigo-700/50">
                <div className="w-1.5 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mr-1.5" />
                {batch.course.category}
              </span>
            </div>
          )}

          {/* Click to View Hint */}
          <div className="text-center pt-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
              Click to view all videos
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Modern Session Card Component
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
        return 'bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700';
      case 'processing':
        return 'bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700';
      case 'unavailable':
        return 'bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/40 dark:to-rose-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700';
      default:
        return 'bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-900/40 dark:to-slate-900/40 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  const isAvailable = session?.status === 'Available' || session?.status === 'available';

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group relative overflow-hidden"
    >
      {/* Modern Glass Card */}
      <div className="relative bg-gradient-to-br from-white/95 via-white/80 to-white/60 dark:from-gray-800/95 dark:via-gray-800/80 dark:to-gray-800/60 backdrop-blur-lg border border-white/30 dark:border-gray-700/40 rounded-2xl shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 overflow-hidden h-full">
        
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/10 dark:from-blue-900/10 dark:via-purple-900/5 dark:to-pink-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Floating Elements */}
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-pink-400/15 to-orange-500/15 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" />

        {/* Content */}
        <div className="relative z-10 p-5 h-full flex flex-col">
          {/* Header with Session Number */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <div className="flex items-center px-2.5 py-1 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-200/30 dark:border-blue-700/30 rounded-lg mr-3">
                  <span className="text-xs font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    #{session?.sessionNumber || '1'}
                  </span>
                </div>
                <div className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${getStatusColor(session?.status)}`}>
                  {session?.status === 'Available' ? '● Ready' : session?.status || 'Unknown'}
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 line-clamp-2 mb-1 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                {session?.displayTitle || session?.title || "Session Recording"}
              </h3>
              
              {session?.student?.name && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  by {session.student.name}
                </p>
              )}
            </div>
          </div>

          {/* Session Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
            {/* Date */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-7 h-7 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-lg">
                <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-gray-600 dark:text-gray-400 text-xs">
                {session?.formattedDate || 'Unknown Date'}
              </span>
            </div>

            {/* Duration */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-7 h-7 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-lg">
                <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-gray-600 dark:text-gray-400 text-xs">
                {session?.formattedTime || session?.duration || '90 min'}
              </span>
            </div>

            {/* File Size */}
            {session?.fileSize && (
              <div className="flex items-center space-x-2 col-span-2">
                <div className="flex items-center justify-center w-7 h-7 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 rounded-lg">
                  <Video className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-gray-600 dark:text-gray-400 text-xs">
                  {formatFileSize(session.fileSize)}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          {session?.description && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                {session.description}
              </p>
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Modern Action Button */}
          <div className="mt-auto pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onWatchNow(session)}
              disabled={!isAvailable}
              className={clsx(
                'group/play w-full relative overflow-hidden rounded-xl font-semibold transition-all duration-300 shadow-lg',
                isAvailable
                  ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-blue-500/25 hover:shadow-blue-500/40'
                  : 'bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              )}
            >
              {/* Button Background Animation */}
              {isAvailable && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover/play:translate-x-[100%] transition-transform duration-700" />
              )}
              
              <div className="relative flex items-center justify-center gap-3 px-4 py-3">
                <div className={clsx(
                  'flex items-center justify-center w-5 h-5 rounded-full transition-all duration-300',
                  isAvailable ? 'bg-white/20 group-hover/play:bg-white/30' : 'bg-gray-400/20'
                )}>
                  <Play className="w-3 h-3 fill-current" />
                </div>
                <span className="text-sm">
                  {isAvailable ? 'Watch Now' : 'Unavailable'}
                </span>
              </div>
            </motion.button>
          </div>
        </div>
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
                    name: video.student?.name || 'Unknown'
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
          
          // Process batch sessions (new structure)
          if (responseData.batch_sessions?.batches && Array.isArray(responseData.batch_sessions.batches)) {
            const batchSessions = responseData.batch_sessions.batches;
            console.log(`Processing ${batchSessions.length} batch entries`);
            
            batchSessions.forEach((batchEntry: any) => {
              try {
                const { batch_id, batch_name, sessions: batchSessionsList } = batchEntry;
                
                if (!batchSessionsList || !Array.isArray(batchSessionsList)) {
                  return;
                }
                
                batchSessionsList.forEach((sessionEntry: any, sessionIndex: number) => {
                  try {
                    const { recorded_lessons, session_number, session_title, instructor } = sessionEntry;
                    
                    if (!recorded_lessons || !Array.isArray(recorded_lessons)) {
                      return;
                    }
                    
                    recorded_lessons.forEach((lesson: any, lessonIndex: number) => {
                      if (!lesson || !lesson.url) return;
                      
                      const recordedSession: RecordedSession = {
                        id: lesson.id || `${batch_id}_${session_number}_${lessonIndex}`,
                        title: lesson.title || `${session_title} - Video ${lessonIndex + 1}`,
                        displayTitle: lesson.title || `Session ${session_number} - ${lesson.title}`,
                        course: {
                          name: batch_name || 'Unknown Course',
                          category: 'General'
                        },
                        instructor: {
                          name: instructor?.full_name || 'Unknown Instructor'
                        },
                        duration: sessionEntry.session_duration || '90 min',
                        recordedDate: lesson.recorded_date,
                        formattedDate: lesson.recorded_date ? new Date(lesson.recorded_date).toLocaleDateString() : '',
                        formattedTime: lesson.recorded_date ? new Date(lesson.recorded_date).toLocaleTimeString() : '',
                        status: 'Available',
                        level: 'Intermediate',
                        description: sessionEntry.session_description || `Session ${session_number} from ${batch_name}`,
                        batchName: batch_name,
                        sessionNumber: session_number || sessionIndex + 1,
                        viewCount: lesson.view_count || 0,
                        fileSize: lesson.fileSize,
                        url: lesson.url ? urlObfuscation.encode(lesson.url) : undefined,
                        source: 'batch_sessions',
                        // Additional API fields
                        batchId: batch_id,
                        sessionId: sessionEntry.session_id,
                        courseId: batch_id,
                        enrollmentId: `enrollment_${batch_id}`
                      };
                      
                      sessions.push(recordedSession);
                      console.log(`✅ Added batch session: ${recordedSession.displayTitle}`);
                    });
                  } catch (sessionError) {
                    console.error('❌ Error processing session:', sessionError);
                  }
                });
              } catch (batchError) {
                console.error('❌ Error processing batch:', batchError);
              }
            });
          } else {
            console.log('ℹ️ No batch sessions found:', responseData.batch_sessions);
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
      // Prepare video data for the video player page
      const videoData = {
        _id: session.id || session.title.replace(/\s+/g, '_'),
        title: session.title,
        sessionNumber: session.sessionNumber || 1,
        sessionTitle: session.displayTitle || session.title,
        date: session.recordedDate || new Date().toISOString(),
        duration: session.duration,
        instructor: session.instructor ? {
          full_name: session.instructor.name,
          email: session.instructor.email || ''
        } : undefined,
        video_url: session.url,
        fileSize: session.fileSize,
        description: session.description || `${batchName} - ${session.title}`,
        student_name: session.student?.name
      };

      // Store video data in localStorage for the video player page
      localStorage.setItem(`video_${videoData._id}`, JSON.stringify(videoData));
      
      // Open video player page in new tab
      const videoPlayerUrl = `/watch/${videoData._id}?data=${encodeURIComponent(JSON.stringify(videoData))}`;
      window.open(videoPlayerUrl, '_blank');
      
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
    instructor?: { name: string; };
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
          {/* Modern Hero Header */}
          <div className="relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/20 dark:from-blue-900/20 dark:via-purple-900/10 dark:to-pink-900/5 rounded-3xl" />
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-pink-400/15 to-orange-500/15 rounded-full blur-xl" />
            
            <div className="relative z-10 text-center pt-6 pb-4 px-6">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-4"
              >
                {/* Compact Icon */}
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg shadow-blue-500/25 mb-3">
                  <Video className="w-6 h-6 text-white" />
                </div>

                {/* Compact Title */}
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                    Recorded Sessions
                  </span>
                </h1>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
                  Access your past class recordings
                  {miniPlayerActive && (
                    <span className="inline-flex items-center ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse" />
                      Playing
                    </span>
                  )}
                </p>
              </motion.div>

              {/* Compact Search Bar */}
              <motion.div
                className="relative max-w-md mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <Search className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Search sessions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 text-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300 shadow-sm"
                  />
                </div>
              </motion.div>
            </div>
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
              className="space-y-8"
            >
              {filteredGroups.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {filteredGroups.map((group, index) => (
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
                  ))}
                </div>
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