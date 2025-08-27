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
  liveSessionId?: string; // Add this to link to LiveSession
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

  // Security: Prevent screenshots and screen recording (Desktop, Mobile, Tablet)
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    
    // Disable keyboard shortcuts for screenshots
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable Print Screen, F12, Ctrl+Shift+I, etc.
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

    // Mobile/Tablet specific security
    const handleTouchStart = (e: TouchEvent) => {
      // Prevent long press context menu on mobile
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      // Prevent zoom and other gestures
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Prevent screenshot gestures on mobile
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause video when app goes to background (potential screenshot)
        if (videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause();
        }
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Disable text selection and drag
    document.body.style.userSelect = 'none';
    (document.body.style as any).webkitUserSelect = 'none';
    (document.body.style as any).webkitTouchCallout = 'none';
    (document.body.style as any).webkitUserDrag = 'none';
    
    // Prevent zoom on mobile
    const viewport = document.querySelector('meta[name=viewport]');
    const originalContent = viewport?.getAttribute('content');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    
    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.body.style.userSelect = '';
      (document.body.style as any).webkitUserSelect = '';
      (document.body.style as any).webkitTouchCallout = '';
      (document.body.style as any).webkitUserDrag = '';
      
      // Restore original viewport
      if (viewport && originalContent) {
        viewport.setAttribute('content', originalContent);
      }
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
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  
  // UI states
  const [showSummary, setShowSummary] = useState(false);

  // Security measures to prevent screenshots and screen recording
  useEffect(() => {
    // Disable right-click context menu
    const disableRightClick = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable keyboard shortcuts for screenshots and dev tools
    const disableKeyboardShortcuts = (e: KeyboardEvent) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'U') ||
        // Disable Print Screen
        e.key === 'PrintScreen' ||
        // Disable Ctrl+P (Print)
        (e.ctrlKey && e.key === 'p') ||
        // Disable Ctrl+S (Save)
        (e.ctrlKey && e.key === 's') ||
        // Disable Ctrl+Shift+S (Save As)
        (e.ctrlKey && e.shiftKey && e.key === 'S')
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Disable text selection
    const disableSelection = () => {
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      document.body.style.mozUserSelect = 'none';
      document.body.style.msUserSelect = 'none';
    };

    // Blur content when window loses focus (potential screen recording)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (videoRef.current) {
          videoRef.current.pause();
        }
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', disableRightClick);
    document.addEventListener('keydown', disableKeyboardShortcuts);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    disableSelection();

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', disableRightClick);
      document.removeEventListener('keydown', disableKeyboardShortcuts);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      document.body.style.mozUserSelect = '';
      document.body.style.msUserSelect = '';
    };
  }, []);

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
          // Try to get from localStorage as fallback
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
            // API client wraps backend response in { status: 'success', data: backendResponse }
            // Backend returns { status: 'success', data: sessionData }
            // So we need to access response.data.data
            let sessionData = null;
            if (sessionResponse && sessionResponse.status === 'success') {
              if (sessionResponse.data && sessionResponse.data.data) {
                // API client wrapped response: { status: 'success', data: { status: 'success', data: sessionData } }
                sessionData = sessionResponse.data.data;
              } else if (sessionResponse.data) {
                // Direct backend response: { status: 'success', data: sessionData }
                sessionData = sessionResponse.data;
              }
            } else if (sessionResponse && sessionResponse.data) {
              // Fallback for direct response
              sessionData = sessionResponse.data;
            } else if (sessionResponse) {
              // Last fallback
              sessionData = sessionResponse;
            }
            
            console.log('🔍 Extracted LiveSession data:', sessionData);
            
            // Debug: Check if summary and remarks are present
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
            // Continue without LiveSession data - not critical
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
    // Close the tab instead of navigation
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading video...</span>
        </div>
      </div>
    );
  }

  if (error || !videoData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center">
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
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900"
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        KhtmlUserSelect: 'none'
      }}
    >
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackButton}
                title="Close tab"
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium">Close</span>
              </button>
              
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {videoData.sessionTitle}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Session #{videoData.sessionNumber}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {videoData.instructor?.full_name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Instructor</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Video Player - Takes 2/3 of the space */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative bg-black rounded-2xl overflow-hidden shadow-2xl h-96 md:h-[500px] lg:h-[600px] xl:h-[700px]"
              style={{
                position: 'relative',
                isolation: 'isolate'
              }}
            >
              {/* Anti-screenshot overlay */}
              <div 
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                  background: 'transparent',
                  mixBlendMode: 'multiply'
                }}
              />
              <video
                ref={videoRef}
                src={videoData.video_url}
                className="w-full h-full cursor-pointer object-cover"
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
                controlsList="nodownload nofullscreen noremoteplayback"
                disablePictureInPicture
                disableRemotePlayback
                onContextMenu={(e) => e.preventDefault()}
                onTouchStart={(e) => {
                  // Prevent long press on mobile
                  if (e.touches.length > 1) {
                    e.preventDefault();
                  }
                }}
                onTouchEnd={(e) => {
                  // Prevent gestures on mobile
                  if (e.touches.length > 1) {
                    e.preventDefault();
                  }
                }}
                style={{ 
                  pointerEvents: 'auto',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  WebkitTouchCallout: 'none',
                  touchAction: 'manipulation'
                }}
              />
              
              {/* Video loading/error overlay */}
              {!videoData.video_url && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <div className="text-center text-white">
                    <Video className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium mb-2">No Video Available</p>
                    <p className="text-sm text-gray-400 mb-4">Video URL: {videoData.video_url || 'Not provided'}</p>
                    
                    {/* Debug information */}
                    <div className="bg-gray-900/80 rounded-lg p-4 max-w-md mx-auto">
                      <h4 className="text-yellow-400 text-sm font-medium mb-2">Debug Info:</h4>
                      <div className="text-xs text-gray-300 space-y-1">
                        <p>Video ID: {videoId}</p>
                        <p>Title: {videoData.title}</p>
                        <p>Session: {videoData.sessionTitle}</p>
                        <p>LiveSession ID: {videoData.liveSessionId}</p>
                        <p>Video URL Length: {videoData.video_url?.length || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Double-click hint overlay - only show if video URL exists */}
              {videoData.video_url && (
                <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs pointer-events-none">
                  Double-click for fullscreen
                </div>
              )}
              
              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <input
                      type="range"
                      min="0"
                      max={duration}
                      value={currentTime}
                      onChange={handleSeek}
                      title="Video progress"
                      aria-label="Video progress"
                      className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                  
                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={togglePlay}
                        title={isPlaying ? "Pause video" : "Play video"}
                        className="flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5 text-white" />
                        ) : (
                          <Play className="w-5 h-5 text-white ml-0.5" />
                        )}
                      </button>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={toggleMute}
                          title={isMuted ? "Unmute video" : "Mute video"}
                          className="text-white hover:text-gray-300 transition-colors"
                        >
                          {isMuted ? (
                            <VolumeX className="w-5 h-5" />
                          ) : (
                            <Volume2 className="w-5 h-5" />
                          )}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={handleVolumeChange}
                          title="Volume control"
                          aria-label="Volume control"
                          className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      
                      <span className="text-white text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {/* Speed Control */}
                      <div className="relative">
                        <button
                          onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                          title="Playback speed"
                          className="text-white hover:text-gray-300 transition-colors px-2 py-1 rounded text-sm font-medium"
                        >
                          {playbackSpeed}x
                        </button>
                        {showSpeedMenu && (
                          <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg p-2 min-w-[80px]">
                            {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
                              <button
                                key={speed}
                                onClick={() => handleSpeedChange(speed)}
                                className={`block w-full text-left px-3 py-1 rounded text-sm transition-colors ${
                                  playbackSpeed === speed
                                    ? 'bg-blue-600 text-white'
                                    : 'text-white hover:bg-white/20'
                                }`}
                              >
                                {speed}x
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={toggleFullscreen}
                        title="Toggle fullscreen"
                        className="text-white hover:text-gray-300 transition-colors"
                      >
                        <Maximize className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
            </motion.div>

            {/* Video Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <Video className="w-6 h-6 text-blue-600" />
                Video Details
              </h3>
              
              {/* First Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {/* Date */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Date</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(videoData.date)}
                    </p>
                  </div>
                </div>



                {/* Duration */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Duration</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {duration > 0 ? formatTime(duration) : (videoData.duration || 'Loading...')}
                    </p>
                  </div>
                </div>



                {/* Instructor */}
                {(liveSessionData?.instructorId || videoData.instructor) && (
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-orange-100 dark:bg-orange-900/40 rounded-lg">
                      <User className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Instructor</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {liveSessionData?.instructorId?.full_name || videoData.instructor?.full_name}
                      </p>
                    </div>
                  </div>
                )}

                {/* Status */}
                {liveSessionData?.status && (
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                      <Video className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Status</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {liveSessionData.status}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Summary Sidebar - Takes 1/3 of the space */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">


            {/* Session Summary */}
            {liveSessionData?.summary ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-blue-200/50 dark:border-blue-700/30"
              >
                <div className="flex items-center space-x-4 mb-8">
                  <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl shadow-lg">
                    <BookOpen className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Session Summary
                    </h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      Key points and highlights
                    </p>
                  </div>
                </div>
                
                {/* Summary Title - Clickable */}
                <div 
                  className="cursor-pointer p-6 bg-white/80 dark:bg-gray-800/60 rounded-2xl hover:bg-white/90 dark:hover:bg-gray-800/80 transition-all duration-300 border border-blue-200/40 dark:border-blue-700/20 shadow-lg"
                  onClick={() => setShowSummary(!showSummary)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {liveSessionData.summary.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Click to {showSummary ? 'hide' : 'view'} details
                      </p>
                    </div>
                    <motion.div
                      animate={{ rotate: showSummary ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-xl shadow-sm"
                    >
                      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </motion.div>
                  </div>
                </div>
                
                {/* Summary Description - Expandable */}
                {showSummary && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="mt-6"
                  >
                    <div className="p-6 bg-white/60 dark:bg-gray-800/40 rounded-2xl border border-blue-200/30 dark:border-blue-700/10 shadow-md">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {liveSessionData.summary.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <div className="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-800/50 dark:via-gray-900/50 dark:to-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/30">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center justify-center w-14 h-14 bg-gray-400 rounded-2xl">
                    <BookOpen className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                      Session Summary
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No summary available
                    </p>
                  </div>
                </div>
                <div className="p-6 bg-white/60 dark:bg-gray-800/40 rounded-2xl border border-gray-200/30 dark:border-gray-700/20 shadow-md">
                  <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-6">
                    Summary not available for this session.
                  </p>
                </div>
              </div>
            )}

            {/* Remarks */}
            {liveSessionData?.remarks ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-red-900/20 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-amber-200/50 dark:border-amber-700/30 mt-8"
              >
                <div className="flex items-center space-x-4 mb-8">
                  <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 rounded-2xl shadow-lg">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Instructor Remarks
                    </h3>
                    <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                      Additional notes and feedback
                    </p>
                  </div>
                </div>
                
                <div className="p-6 bg-white/80 dark:bg-gray-800/60 rounded-2xl border border-amber-200/40 dark:border-amber-700/20 shadow-lg">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-3 h-3 bg-amber-500 rounded-full mt-2"></div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {liveSessionData.remarks}
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-800/50 dark:via-gray-900/50 dark:to-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/30 mt-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center justify-center w-14 h-14 bg-gray-400 rounded-2xl">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                      Instructor Remarks
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No remarks available
                    </p>
                  </div>
                </div>
                <div className="p-6 bg-white/60 dark:bg-gray-800/40 rounded-2xl border border-gray-200/30 dark:border-gray-700/20 shadow-md">
                  <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-6">
                    No remarks available for this session.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerPage;
