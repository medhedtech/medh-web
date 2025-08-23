"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Settings,
  Calendar,
  Clock,
  User,
  Video,
  Loader2,
  AlertCircle,
  FileText,
  BookOpen,
  X
} from "lucide-react";
import { liveClassesAPI } from "@/apis/liveClassesAPI";

interface VideoData {
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
  liveSessionId?: string;
}

interface LiveSessionData {
  _id: string;
  sessionTitle: string;
  sessionNo: string;
  date: string;
  remarks?: string;
  summary?: {
    title: string;
    description: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  };
  instructorId?: {
    _id: string;
    full_name: string;
    email: string;
  };
  students?: Array<{
    _id: string;
    full_name: string;
    email: string;
  }>;
  status: string;
}

const VideoPlayerPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const videoId = params?.videoId as string;

  // Security: Prevent screenshots and screen recording
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'PrintScreen' ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.key === 's') ||
        (e.metaKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C'))
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause();
        }
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    document.body.style.userSelect = 'none';
    (document.body.style as any).webkitUserSelect = 'none';
    (document.body.style as any).webkitTouchCallout = 'none';
    (document.body.style as any).webkitUserDrag = 'none';
    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.body.style.userSelect = '';
      (document.body.style as any).webkitUserSelect = '';
      (document.body.style as any).webkitTouchCallout = '';
      (document.body.style as any).webkitUserDrag = '';
    };
  }, []);
  
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [liveSessionData, setLiveSessionData] = useState<LiveSessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Video player states
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  
  // UI states
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    const loadVideoAndSessionData = async () => {
      try {
        setLoading(true);
        
        // Get video data from URL parameters or localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const videoDataParam = urlParams.get('data');
        let videoInfo: VideoData | null = null;
        
        if (videoDataParam) {
          videoInfo = JSON.parse(decodeURIComponent(videoDataParam));
        } else {
          const storedData = localStorage.getItem(`video_${videoId}`);
          if (storedData) {
            videoInfo = JSON.parse(storedData);
          }
        }
        
        if (!videoInfo) {
          setError('Video data not found');
          setLoading(false);
          return;
        }
        
        console.log('🔍 Video data loaded:', videoInfo);
        console.log('🔍 Video URL:', videoInfo.video_url);
        
        setVideoData(videoInfo);
        
        // Try to fetch LiveSession data if we have a session ID
        if (videoInfo.liveSessionId && videoInfo.liveSessionId !== 'null' && videoInfo.liveSessionId !== null) {
          try {
            console.log('🔍 Fetching LiveSession data for ID:', videoInfo.liveSessionId);
            const sessionResponse = await liveClassesAPI.getSession(videoInfo.liveSessionId);
            console.log('🔍 LiveSession API response:', sessionResponse);
            
            // Handle the API client response structure
            let sessionData = null;
            if (sessionResponse && sessionResponse.status === 'success') {
              if (sessionResponse.data && sessionResponse.data.data) {
                sessionData = sessionResponse.data.data;
              } else if (sessionResponse.data) {
                sessionData = sessionResponse.data;
              }
            } else if (sessionResponse && sessionResponse.data) {
              sessionData = sessionResponse.data;
            } else if (sessionResponse) {
              sessionData = sessionResponse;
            }
            
            console.log('🔍 Extracted LiveSession data:', sessionData);
            
            if (sessionData) {
              console.log('🔍 LiveSession data structure:', {
                hasRemarks: !!(sessionData.remarks),
                hasSummary: !!(sessionData.summary),
                remarks: sessionData.remarks,
                summary: sessionData.summary
              });
            }
            
            setLiveSessionData(sessionData);
          } catch (sessionError) {
            console.error('❌ Error fetching LiveSession data:', sessionError);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading video data:', err);
        setError('Failed to load video data');
        setLoading(false);
      }
    };
    
    if (videoId) {
      loadVideoAndSessionData();
    }
  }, [videoId]);

  // Video player functions
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  const handleBackButton = () => {
    window.close();
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return mb > 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb.toFixed(0)} MB`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading video...</span>
        </div>
      </div>
    );
  }

  if (error || !videoData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Video Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'The requested video could not be loaded.'}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackButton}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
              
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {videoData.sessionTitle}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Session #{videoData.sessionNumber}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {videoData.instructor?.full_name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Instructor</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Video Section */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Video Player */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="relative bg-black aspect-video">
                <video
                  ref={videoRef}
                  src={videoData.video_url}
                  className="w-full h-full object-contain"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onDoubleClick={toggleFullscreen}
                  onError={(e) => {
                    console.error('❌ Video loading error:', e);
                    console.error('❌ Video URL:', videoData.video_url);
                  }}
                  onLoadStart={() => console.log('🔄 Video loading started...')}
                  onCanPlay={() => console.log('✅ Video can play')}
                  controls
                />
                
                {/* Video loading/error overlay */}
                {!videoData.video_url && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <div className="text-center text-white">
                      <Video className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-medium mb-2">No Video Available</p>
                      <p className="text-sm text-gray-400">Video URL not provided</p>
                    </div>
                  </div>
                )}
                
                {/* Double-click hint */}
                {videoData.video_url && (
                  <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded text-sm">
                    Double-click for fullscreen
                  </div>
                )}
              </div>
            </div>

            {/* Video Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Video Information
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Date</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(videoData.date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Duration</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {duration > 0 ? formatTime(duration) : (videoData.duration || 'Loading...')}
                    </p>
                  </div>
                </div>

                {videoData.fileSize && (
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <Video className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">File Size</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatFileSize(videoData.fileSize)}
                      </p>
                    </div>
                  </div>
                )}

                {videoData.student_name && (
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Student</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {videoData.student_name}
                      </p>
                    </div>
                  </div>
                )}

                {(liveSessionData?.instructorId || videoData.instructor) && (
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Instructor</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {liveSessionData?.instructorId?.full_name || videoData.instructor?.full_name}
                      </p>
                    </div>
                  </div>
                )}

                {liveSessionData?.status && (
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                      <Settings className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Status</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                        {liveSessionData.status}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Session Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Session Summary
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Key points and highlights
                    </p>
                  </div>
                </div>

                {liveSessionData?.summary ? (
                  <div className="space-y-4">
                    <div 
                      className="cursor-pointer p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      onClick={() => setShowSummary(!showSummary)}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {liveSessionData.summary.title}
                        </h4>
                        <motion.div
                          animate={{ rotate: showSummary ? 45 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </motion.div>
                      </div>
                    </div>
                    
                    {showSummary && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                      >
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {liveSessionData.summary.description}
                        </p>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No summary available for this session.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Instructor Remarks */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Instructor Remarks
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Additional notes and feedback
                    </p>
                  </div>
                </div>

                {liveSessionData?.remarks ? (
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {liveSessionData.remarks}
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No remarks available for this session.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoPlayerPage;


