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

  // 🔒 ULTRA MAXIMUM SECURITY: Complete Video Protection System
  useEffect(() => {
    // 1. MANDATORY LOGIN CHECK - FIRST PRIORITY (TEMPORARILY DISABLED FOR TESTING)
    const checkUserAuthentication = () => {
      const authToken = localStorage.getItem('authToken') || localStorage.getItem('access_token');
      const userSession = localStorage.getItem('user') || sessionStorage.getItem('user');
      
      // TEMPORARY: Skip login check for testing
      if (!authToken || !userSession) {
        console.warn('⚠️ No auth token found, but allowing access for testing');
        // Create dummy user for testing
        localStorage.setItem('user', JSON.stringify({
          id: 'test-user-123',
          email: 'test@example.com',
          full_name: 'Test User'
        }));
        return true;
      }
      
      // Verify token is not expired
      try {
        const tokenData = JSON.parse(atob(authToken.split('.')[1]));
        if (tokenData.exp && tokenData.exp < Date.now() / 1000) {
          alert('🔒 Session Expired: Please login again to continue watching.');
          localStorage.removeItem('authToken');
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return false;
        }
      } catch (error) {
        console.error('Token validation failed');
        window.location.href = '/login';
        return false;
      }
      
      return true;
    };
    
    // Stop execution if not authenticated
    if (!checkUserAuthentication()) {
      return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    // ALLOW MULTIPLE TABS & TRACK SESSIONS
    const sessionKey = `video_session_${videoId}`;
    const currentTime = Date.now();
    
    // Allow multiple tabs but track them for security
    const tabId = Math.random().toString(36).substr(2, 9);
    console.log(`🎬 Video opened in new tab: ${tabId}`);
    
    // Set current session
    localStorage.setItem(sessionKey, JSON.stringify({
      timestamp: currentTime,
      tabId: Math.random().toString(36).substr(2, 9)
    }));
    
    // Clear session on page unload
    const handleBeforeUnload = () => {
      localStorage.removeItem(sessionKey);
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Check for direct URL access (prevent link sharing)
    const urlParams = new URLSearchParams(window.location.search);
    const hasValidData = urlParams.get('data') || localStorage.getItem(`video_${videoId}`);
    
    if (!hasValidData) {
      alert('Invalid access. Please access video through proper navigation.');
      window.location.href = '/dashboards/student';
      return;
    }
    
    // Prevent URL copying
    const originalURL = window.location.href;
    const cleanURL = window.location.origin + window.location.pathname;
    
    // Replace URL without data parameters
    if (window.location.search) {
      window.history.replaceState({}, document.title, cleanURL);
    }
    
    // Monitor for URL changes
    const handlePopState = () => {
      if (window.location.href !== cleanURL) {
        window.location.href = '/dashboards/student';
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // Block ALL developer tools and screenshot shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block PrintScreen, F-keys, and all developer shortcuts
      if (
        e.key === 'PrintScreen' ||
        e.code === 'PrintScreen' ||
        e.keyCode === 44 || // PrintScreen keycode
        e.which === 44 ||   // PrintScreen which
        e.key === 'F12' ||
        e.key === 'F1' ||
        e.key === 'F2' ||
        e.key === 'F3' ||
        e.key === 'F4' ||
        e.key === 'F5' ||
        e.key === 'F6' ||
        e.key === 'F7' ||
        e.key === 'F8' ||
        e.key === 'F9' ||
        e.key === 'F10' ||
        e.key === 'F11' ||
        // Developer tools combinations
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C' || e.key === 'K')) ||
        (e.ctrlKey && (e.key === 'u' || e.key === 'U')) ||
        (e.ctrlKey && (e.key === 's' || e.key === 'S')) ||
        (e.ctrlKey && (e.key === 'a' || e.key === 'A')) ||
        (e.ctrlKey && (e.key === 'p' || e.key === 'P')) ||
        (e.ctrlKey && (e.key === 'h' || e.key === 'H')) ||
        // Mac shortcuts
        (e.metaKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C' || e.key === 'K')) ||
        (e.metaKey && (e.key === 'u' || e.key === 'U')) ||
        (e.metaKey && (e.key === 's' || e.key === 'S')) ||
        (e.metaKey && (e.key === 'a' || e.key === 'A')) ||
        (e.metaKey && (e.key === 'p' || e.key === 'P')) ||
        // Windows screenshot shortcuts
        (e.altKey && e.key === 'PrintScreen') ||
        (e.ctrlKey && e.key === 'PrintScreen') ||
        (e.shiftKey && e.key === 'PrintScreen') ||
        // Windows + Shift + S (Snipping Tool)
        (e.metaKey && e.shiftKey && e.key === 'S') ||
        // Alt + Tab (prevent task switching during video)
        (e.altKey && e.key === 'Tab')
      ) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        // Show warning for screenshot attempts
        if (e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.keyCode === 44) {
          alert('Screenshots are not allowed for security reasons.');
        }
        
        return false;
      }
    };

    // Pause video when tab becomes hidden (prevents background recording)
    const handleVisibilityChange = () => {
      if (document.hidden || document.visibilityState === 'hidden') {
        if (videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause();
        }
      }
    };

    // Detect focus loss (user switched to another app)
    const handleBlur = () => {
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
      }
    };

    // Prevent drag and drop
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Prevent selection
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Mobile touch events prevention
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault(); // Prevent multi-touch gestures
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault(); // Prevent pinch zoom
      }
    };

    // Additional screenshot prevention
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Prevent clipboard access
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // Add all event listeners
    document.addEventListener('contextmenu', handleContextMenu, { passive: false });
    document.addEventListener('keydown', handleKeyDown, { passive: false });
    document.addEventListener('keyup', handleKeyUp, { passive: false });
    document.addEventListener('copy', handleCopy, { passive: false });
    document.addEventListener('cut', handleCut, { passive: false });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('dragstart', handleDragStart, { passive: false });
    document.addEventListener('selectstart', handleSelectStart, { passive: false });
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    // Apply CSS security styles
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.mozUserSelect = 'none';
    document.body.style.msUserSelect = 'none';
    document.body.style.webkitTouchCallout = 'none';
    document.body.style.webkitUserDrag = 'none';
    document.body.style.webkitTapHighlightColor = 'transparent';
    document.body.style.pointerEvents = 'auto';
    
    // Disable text selection globally
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
      
      /* Disable image dragging */
      img {
        -webkit-user-drag: none !important;
        -khtml-user-drag: none !important;
        -moz-user-drag: none !important;
        -o-user-drag: none !important;
        user-drag: none !important;
        pointer-events: none !important;
      }
      
      /* Allow video controls to show on hover */
      video::-webkit-media-controls {
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      video::-webkit-media-controls-enclosure {
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      video:hover::-webkit-media-controls {
        opacity: 1;
      }
      
      video:hover::-webkit-media-controls-enclosure {
        opacity: 1;
      }
      
      /* Mobile specific restrictions */
      @media (max-width: 768px) {
        * {
          -webkit-touch-callout: none !important;
          -webkit-user-select: none !important;
          -webkit-tap-highlight-color: rgba(0,0,0,0) !important;
        }
      }
    `;
    document.head.appendChild(style);

    // Override console methods to prevent debugging
    const originalConsole = { ...console };
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
    console.info = () => {};
    console.debug = () => {};
    console.trace = () => {};
    console.table = () => {};
    console.group = () => {};
    console.groupEnd = () => {};
    console.clear = () => {};

    // Monitor for screen recording attempts (passive detection)
    let isRecording = false;
    
    // Only check when user actually tries to start recording
    const monitorScreenShare = () => {
      // Check if screen sharing API is being accessed
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia;
        navigator.mediaDevices.getDisplayMedia = function(...args) {
          if (videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause();
            alert('Screen recording detected. Video paused for security.');
          }
          return originalGetDisplayMedia.apply(this, args);
        };
      }
    };

    monitorScreenShare();

    // Cleanup function
    return () => {
      // Remove session tracking
      localStorage.removeItem(sessionKey);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      
      // Restore original styles
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      document.body.style.mozUserSelect = '';
      document.body.style.msUserSelect = '';
      document.body.style.webkitTouchCallout = '';
      document.body.style.webkitUserDrag = '';
      document.body.style.webkitTapHighlightColor = '';
      document.body.style.pointerEvents = '';
      
      // Remove security styles
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
      
      // Restore console
      Object.assign(console, originalConsole);
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




