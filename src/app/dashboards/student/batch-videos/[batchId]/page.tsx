"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Play, 
  Calendar, 
  Clock, 
  Video, 
  User,
  MonitorPlay,
  Loader2,
  AlertCircle,
  Search,
  X
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import StudentDashboardLayout from "@/components/sections/dashboards/StudentDashboardLayout";
import { apiBaseUrl } from "@/apis/config";

interface BatchVideo {
  _id: string;
  title: string;
  sessionNumber: number;
  sessionTitle: string;
  date: string;
  duration?: string;
  instructor?: {
    full_name: string;
    email: string;
  };
  video_url: string;
  fileSize?: number;
  description?: string;
  student_name?: string;
  session_id?: string; // LiveSession ID for fetching additional data
}

interface BatchInfo {
  batch_id: string;
  batch_name: string;
  instructor?: {
    full_name: string;
    email: string;
  };
  total_videos: number;
  description?: string;
}

const BatchVideosPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const batchId = params?.batchId as string;
  
  const [videos, setVideos] = useState<BatchVideo[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<BatchVideo[]>([]);
  const [batchInfo, setBatchInfo] = useState<BatchInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (batchId && batchId !== 'unknown') {
      fetchBatchVideos();
    } else {
      setError('Invalid batch ID');
      setLoading(false);
    }
  }, [batchId]);

  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredVideos(videos);
    } else {
      const filtered = videos.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.sessionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.sessionNumber.toString().includes(searchQuery)
      );
      setFilteredVideos(filtered);
    }
  }, [videos, searchQuery]);

  const fetchBatchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching videos for batchId:', batchId);

      // Get student ID from local storage (same as RecordedSessionsDashboard)
      const studentId = localStorage.getItem('userId');
      if (!studentId) {
        setError('Student ID not found. Please log in again.');
        return;
      }

      // Get token for authentication
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      console.log('🔑 Token from localStorage:', token ? token.substring(0, 20) + '...' : 'null');
      console.log('🔑 Token length:', token ? token.length : 0);
      
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        return;
      }

      // Prepare headers
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-access-token': token
      };
      
      console.log('📤 Sending headers:', {
        'Content-Type': headers['Content-Type'],
        'Authorization': headers['Authorization'] ? headers['Authorization'].substring(0, 20) + '...' : 'null',
        'x-access-token': headers['x-access-token'] ? headers['x-access-token'].substring(0, 20) + '...' : 'null'
      });
      
      // Fetch batch videos directly from backend with query parameters
      const queryParams = new URLSearchParams({
        limit: '100',
        sort_by: 'date',
        sort_order: 'desc'
      });
      
      const response = await fetch(`${apiBaseUrl}/batches/students/${studentId}/recorded-lessons?${queryParams}`, {
        headers
      });
      
      console.log('🔍 Response status:', response.status);
      console.log('🔍 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        throw new Error(`Failed to fetch videos: ${response.status}`);
      }

      const data = await response.json();
      console.log('📊 API Response:', data);
      console.log('📊 Response success:', data.success);
      console.log('📊 Response data keys:', data.data ? Object.keys(data.data) : 'No data');
      console.log('📊 Batch sessions count:', data.data?.batch_sessions?.batches?.length || 0);
      console.log('🔍 Looking for batchId:', batchId);
      console.log('📋 Available batches:', data.data?.batch_sessions?.batches?.map((b: any) => ({ id: b.batch_id, name: b.batch_name })) || 'No batches found');
      
      // Log the full structure to understand the data format
      console.log('🔍 Full data structure:', JSON.stringify(data, null, 2));
      
      // Log all available batch IDs for debugging
      if (data.data?.batch_sessions?.batches) {
        console.log('🔍 All available batch IDs:', data.data.batch_sessions.batches.map((b: any) => ({
          batch_id: b.batch_id,
          _id: b._id,
          id: b.id,
          batchId: b.batchId,
          name: b.batch_name
        })));
      }
      
      if (data.success && data.data?.batch_sessions?.batches) {
        // Find the specific batch - try multiple possible field names
        const targetBatch = data.data.batch_sessions.batches.find(
          (batch: any) => 
            batch.batch_id === batchId || 
            batch._id === batchId || 
            batch.id === batchId ||
            batch.batchId === batchId
        );
        
        console.log('🎯 Target batch found:', targetBatch ? 'Yes' : 'No');
        if (targetBatch) {
          console.log('🎯 Target batch details:', {
            batch_id: targetBatch.batch_id,
            batch_name: targetBatch.batch_name,
            sessions_count: targetBatch.sessions?.length || 0
          });
        } else {
          console.log('❌ Batch not found. Looking for:', batchId);
          console.log('❌ Available batch IDs:', data.data.batch_sessions.batches.map((b: any) => ({
            batch_id: b.batch_id,
            _id: b._id,
            id: b.id,
            batchId: b.batchId,
            name: b.batch_name
          })));
          
          // Try to find any batch that contains the batchId as a substring
          const partialMatch = data.data.batch_sessions.batches.find((batch: any) => 
            batch.batch_id?.includes(batchId) || 
            batch._id?.includes(batchId) || 
            batch.id?.includes(batchId) ||
            batch.batchId?.includes(batchId)
          );
          
          if (partialMatch) {
            console.log('🔍 Found partial match:', {
              batch_id: partialMatch.batch_id,
              _id: partialMatch._id,
              name: partialMatch.batch_name
            });
          }
        }

        if (targetBatch) {
          setBatchInfo({
            batch_id: targetBatch.batch_id,
            batch_name: targetBatch.batch_name,
            instructor: targetBatch.instructor,
            total_videos: targetBatch.total_videos,
            description: targetBatch.description
          });

          // Extract all videos from sessions
          const allVideos: BatchVideo[] = [];
          targetBatch.sessions.forEach((session: any) => {

            
            session.recorded_lessons.forEach((lesson: any) => {
              const videoData = {
                _id: lesson._id,
                title: lesson.title,
                sessionNumber: session.session_number || 1,
                sessionTitle: session.session_title || lesson.title,
                date: session.session_date || lesson.recorded_date,
                duration: session.session_duration,
                instructor: session.instructor || targetBatch.instructor,
                video_url: lesson.url || lesson.video_url,
                fileSize: lesson.fileSize,
                session_id: session.session_id, // Add session_id from parent session
                description: session.session_description || lesson.description,
                student_name: lesson.student_name || 'Student'
              };
              

              
              allVideos.push(videoData);
            });
          });

          // Sort by session number
          allVideos.sort((a, b) => a.sessionNumber - b.sessionNumber);
          setVideos(allVideos);
        } else {
          // If specific batch not found, show all available videos for debugging
          console.log('⚠️ Specific batch not found, showing all available videos for debugging');
          const allVideos: BatchVideo[] = [];
          
          data.data.batch_sessions.batches.forEach((batch: any) => {
            console.log(`📋 Processing batch: ${batch.batch_name} (ID: ${batch.batch_id})`);
            if (batch.sessions) {
              batch.sessions.forEach((session: any) => {
                if (session.recorded_lessons) {
                  session.recorded_lessons.forEach((lesson: any) => {
                    const videoData = {
                      _id: lesson._id,
                      title: lesson.title,
                      sessionNumber: session.session_number || 1,
                      sessionTitle: session.session_title || lesson.title,
                      date: session.session_date || lesson.recorded_date,
                      duration: session.session_duration,
                      instructor: session.instructor || batch.instructor,
                      video_url: lesson.url || lesson.video_url,
                      fileSize: lesson.fileSize,
                      session_id: session.session_id,
                      description: session.session_description || lesson.description,
                      student_name: lesson.student_name || 'Student'
                    };
                    allVideos.push(videoData);
                  });
                }
              });
            }
          });
          
          if (allVideos.length > 0) {
            console.log(`📹 Found ${allVideos.length} total videos across all batches`);
            setVideos(allVideos);
            setBatchInfo({
              batch_id: batchId,
              batch_name: `All Available Videos (Batch ${batchId} not found)`,
              instructor: { full_name: 'Multiple Instructors', email: '' },
              total_videos: allVideos.length,
              description: 'Showing all available videos since specific batch was not found'
            });
          } else {
            setError('Batch not found and no videos available');
          }
        }
      } else {
        setError('No videos found for this batch');
      }
    } catch (err) {
      console.error('Error fetching batch videos:', err);
      setError(err instanceof Error ? err.message : 'Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (video: BatchVideo) => {
    if (video.video_url) {
      // Prepare video data with LiveSession ID for enhanced functionality
      const videoDataWithSession = {
        ...video,
        liveSessionId: video.session_id // Pass session_id as liveSessionId for LiveSession data fetching
      };
      
      // Store video data in localStorage for the video player page
      localStorage.setItem(`video_${video._id}`, JSON.stringify(videoDataWithSession));
      
      // Open video player page in new tab
      const videoPlayerUrl = `/watch/${video._id}?data=${encodeURIComponent(JSON.stringify(videoDataWithSession))}`;
      window.open(videoPlayerUrl, '_blank');
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return mb > 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb.toFixed(0)} MB`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown Date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Unknown Date';
    }
  };

  return (
    <StudentDashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Recorded Sessions
            </button>

            {/* Batch Info */}
            {batchInfo && (
              <div className="relative bg-gradient-to-br from-white/95 via-blue-50/80 to-purple-50/60 dark:from-gray-800/95 dark:via-blue-900/80 dark:to-purple-900/60 backdrop-blur-lg rounded-3xl p-8 border border-white/30 dark:border-gray-700/30 shadow-xl shadow-blue-500/10 dark:shadow-blue-900/20 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-50" />
                
                <div className="relative z-10 flex items-start justify-between">
                  <div className="flex-1">
                    {/* Batch Name */}
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-4 leading-tight">
                      {batchInfo.batch_name}
                    </h1>
                    
                    {/* Instructor Info */}
                    {batchInfo.instructor && (
                      <div className="flex items-center space-x-3 mb-4 p-3 bg-gradient-to-r from-orange-50/80 to-red-50/80 dark:from-orange-900/30 dark:to-red-900/30 rounded-xl border border-orange-100/50 dark:border-orange-800/30">
                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/60 dark:to-red-900/60 rounded-xl">
                          <User className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Instructor</p>
                          <p className="font-semibold text-gray-800 dark:text-gray-200">
                            {batchInfo.instructor.full_name}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Stats */}
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-100/80 to-purple-100/80 dark:from-blue-900/40 dark:to-purple-900/40 rounded-full">
                        <Video className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="font-semibold text-blue-700 dark:text-blue-300">
                          {batchInfo.total_videos} Session{batchInfo.total_videos !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-100/80 to-emerald-100/80 dark:from-green-900/40 dark:to-emerald-900/40 rounded-full">
                        <MonitorPlay className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="font-semibold text-green-700 dark:text-green-300">
                          HD Quality
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Play Icon */}
                  <div className="relative">
                    <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl shadow-blue-500/30">
                      <MonitorPlay className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-3xl blur opacity-30 animate-pulse" />
                  </div>
                </div>
              </div>
            )}

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8"
            >
              <div className="relative max-w-lg mx-auto">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-blue-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search sessions by title, number, or instructor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-12 pr-12 py-4 border-2 border-blue-200/50 dark:border-blue-700/50 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    title="Clear search"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center group"
                  >
                    <div className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
                      <X className="h-4 w-4 text-gray-500 group-hover:text-red-500 transition-colors" />
                    </div>
                  </button>
                )}
              </div>
              {searchQuery && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-center"
                >
                  <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-100/80 to-purple-100/80 dark:from-blue-900/40 dark:to-purple-900/40 rounded-full">
                    <Video className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      {filteredVideos.length} session{filteredVideos.length !== 1 ? 's' : ''} found for "{searchQuery}"
                    </span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-20"
            >
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Loading batch videos...</p>
              </div>
            </motion.div>
          )}

          {/* Error State */}
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center"
            >
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
                Error Loading Videos
              </h3>
              <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
              <button
                onClick={fetchBatchVideos}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {/* Videos Grid */}
          {!loading && !error && videos.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredVideos.map((video, index) => (
                <motion.div
                  key={video._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative overflow-hidden cursor-pointer"
                  onClick={() => handleVideoClick(video)}
                >
                  {/* Video Card */}
                  <div className="relative bg-gradient-to-br from-white/95 via-white/80 to-white/60 dark:from-gray-800/95 dark:via-gray-800/80 dark:to-gray-800/60 backdrop-blur-lg border border-white/30 dark:border-gray-700/40 rounded-2xl shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 overflow-hidden h-full">
                    
                    {/* Hover Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/10 dark:from-blue-900/10 dark:via-purple-900/5 dark:to-pink-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Content */}
                    <div className="relative z-10 p-5 h-full flex flex-col">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          {/* Session Number Badge */}
                          <div className="flex items-center mb-3">
                            <div className="flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-lg shadow-blue-500/25">
                              <span className="text-xs font-bold text-white">
                                Session #{video.sessionNumber}
                              </span>
                            </div>
                          </div>
                          
                          {/* Session Title */}
                          <h3 className="text-lg font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent line-clamp-2 mb-2 group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                            {video.sessionTitle || video.title}
                          </h3>
                          
                          {/* Video File Name (smaller) */}
                          {video.title !== video.sessionTitle && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mb-2">
                              File: {video.title}
                            </p>
                          )}
                        </div>

                        {/* Play Icon */}
                        <div className="relative">
                          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl shadow-lg shadow-blue-500/25 group-hover:shadow-xl group-hover:shadow-blue-500/40 group-hover:scale-110 transition-all duration-300">
                            <Play className="w-5 h-5 text-white ml-0.5" />
                          </div>
                        </div>
                      </div>

                      {/* Video Info */}
                      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                        {/* Date */}
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center justify-center w-7 h-7 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-lg">
                            <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="text-gray-600 dark:text-gray-400 text-xs">
                            {formatDate(video.date)}
                          </span>
                        </div>

                        {/* Duration */}
                        {video.duration && (
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center justify-center w-7 h-7 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-lg">
                              <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <span className="text-gray-600 dark:text-gray-400 text-xs">
                              {video.duration}
                            </span>
                          </div>
                        )}



                        {/* Instructor */}
                        {video.instructor && (
                          <div className="flex items-center space-x-2 col-span-2">
                            <div className="flex items-center justify-center w-7 h-7 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/40 dark:to-red-900/40 rounded-lg">
                              <User className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <span className="text-gray-600 dark:text-gray-400 text-xs">
                              Instructor: {video.instructor.full_name}
                            </span>
                          </div>
                        )}


                      </div>

                      {/* Description */}
                      {video.description && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                            {video.description}
                          </p>
                        </div>
                      )}

                      {/* Spacer */}
                      <div className="flex-1" />

                      {/* Watch Button */}
                      <div className="mt-auto">
                        <div className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white text-center py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 active:scale-95 flex items-center justify-center space-x-2">
                          <Play className="w-4 h-4" />
                          <span>Watch Session #{video.sessionNumber}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* No Videos State */}
          {!loading && !error && videos.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Videos Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                This batch doesn't have any recorded videos yet.
              </p>
            </motion.div>
          )}

          {/* No Search Results State */}
          {!loading && !error && videos.length > 0 && filteredVideos.length === 0 && searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Results Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No videos match your search for "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Clear Search
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </StudentDashboardLayout>
  );
};

export default BatchVideosPage;
