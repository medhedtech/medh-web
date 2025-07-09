'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, SkipBack, SkipForward, Bookmark, Download, Minimize2, X, RefreshCw, AlertCircle, Move } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Simplified interfaces for the video player
interface VideoBookmark {
  id: string | number;
  time: number;
  label: string;
}

interface VideoPlayerProps {
  src: string | null;
  poster?: string;
  autoplay?: boolean;
  quality?: 'auto' | '1080p' | '720p' | '480p' | '360p';
  playbackSpeed?: number;
  onProgress?: (progress: number, currentTime: number) => void;
  onEnded?: () => void;
  onError?: (error: string) => void;
  onBookmark?: (bookmark: VideoBookmark) => void;
  bookmarks?: VideoBookmark[];
  initialTime?: number;
  isPreview?: boolean;
  encryptionKey?: string;
  allowDownload?: boolean;
  allowMiniPlayer?: boolean;
  onMiniPlayerToggle?: (isMinimized: boolean) => void;
  onRefreshUrl?: () => Promise<string>; // Callback to refresh S3 signed URL
  transcriptions?: Array<{
    time: number;
    text: string;
  }>;
  chapters?: Array<{
    time: number;
    title: string;
  }>;
  // Additional props for better integration
  sessionId?: string;
  sessionTitle?: string;
  onClose?: () => void;
}

// Enhanced Mini Player Component
const MiniPlayer: React.FC<{
  isVisible: boolean;
  onClose: () => void;
  onExpand: () => void;
  children: React.ReactNode;
  title?: string;
  position: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
  size: { width: number; height: number };
  onSizeChange: (size: { width: number; height: number }) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onMute: () => void;
  onSeek: (time: number) => void;
  onPictureInPicture?: () => void;
}> = ({ 
  isVisible, 
  onClose, 
  onExpand, 
  children, 
  title, 
  position, 
  onPositionChange,
  size,
  onSizeChange,
  isPlaying,
  onPlayPause,
  currentTime,
  duration,
  volume,
  isMuted,
  onVolumeChange,
  onMute,
  onSeek,
  onPictureInPicture
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showControls, setShowControls] = useState(true);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const miniPlayerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Snap to edges functionality
  const snapToEdges = useCallback((pos: { x: number; y: number }) => {
    const snapDistance = 20;
    const { innerWidth, innerHeight } = window;
    const { width, height } = size;
    
    let newX = pos.x;
    let newY = pos.y;
    
    // Snap to left edge
    if (pos.x < snapDistance) {
      newX = 0;
    }
    // Snap to right edge
    else if (pos.x + width > innerWidth - snapDistance) {
      newX = innerWidth - width;
    }
    
    // Snap to top edge
    if (pos.y < snapDistance) {
      newY = 0;
    }
    // Snap to bottom edge
    else if (pos.y + height > innerHeight - snapDistance) {
      newY = innerHeight - height;
    }
    
    return { x: newX, y: newY };
  }, [size]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return;
    setIsDragging(true);
    const rect = miniPlayerRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // Constrain to viewport
    const maxX = window.innerWidth - size.width;
    const maxY = window.innerHeight - size.height;
    
    const constrainedPos = {
      x: Math.max(0, Math.min(maxX, newX)),
      y: Math.max(0, Math.min(maxY, newY)),
    };
    
    onPositionChange(constrainedPos);
  }, [isDragging, dragOffset, onPositionChange, size]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      // Snap to edges on release
      const snappedPos = snapToEdges(position);
      if (snappedPos.x !== position.x || snappedPos.y !== position.y) {
        onPositionChange(snappedPos);
      }
    }
    setIsDragging(false);
  }, [isDragging, position, snapToEdges, onPositionChange]);

  // Resize functionality
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
  };

  const handleResizeMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !miniPlayerRef.current) return;
    
    const rect = miniPlayerRef.current.getBoundingClientRect();
    const newWidth = Math.max(280, Math.min(600, e.clientX - rect.left));
    const newHeight = Math.max(180, Math.min(400, e.clientY - rect.top));
    
    onSizeChange({ width: newWidth, height: newHeight });
  }, [isResizing, onSizeChange]);

  const handleResizeMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMouseMove);
      document.addEventListener('mouseup', handleResizeMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleResizeMouseMove);
        document.removeEventListener('mouseup', handleResizeMouseUp);
      };
    }
  }, [isResizing, handleResizeMouseMove, handleResizeMouseUp]);

  // Auto-hide controls
  const resetControlsTimeout = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    setShowControls(true);
    
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2000);
    }
  }, [isPlaying]);

  useEffect(() => {
    resetControlsTimeout();
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, resetControlsTimeout]);

  // Format time helper
  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Handle seek
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    onSeek(newTime);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={miniPlayerRef}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed z-[100] bg-gray-900/95 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-gray-700/50"
        style={{
          left: position.x,
          top: position.y,
          width: size.width,
          height: size.height,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={handleMouseDown}
        onMouseEnter={resetControlsTimeout}
        onMouseMove={resetControlsTimeout}
      >
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        
        {/* Mini Player Header */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-2 flex items-center justify-between z-20"
            >
              <div className="flex items-center min-w-0">
                <Move size={14} className="text-white mr-2 flex-shrink-0" />
                {title && (
                  <span className="text-white text-xs font-medium truncate max-w-[140px]">
                    {title}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-1">
                {onPictureInPicture && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onPictureInPicture}
                    className="text-white hover:text-blue-400 transition-colors p-1"
                    title="Picture in Picture"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                      <rect x="8" y="8" width="8" height="6" rx="1" ry="1"/>
                    </svg>
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onExpand}
                  className="text-white hover:text-blue-400 transition-colors p-1"
                  title="Expand to full player"
                >
                  <Maximize size={14} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="text-white hover:text-red-400 transition-colors p-1"
                  title="Close mini player"
                >
                  <X size={14} />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video Content */}
        <div className="w-full h-full relative">
          {children}
        </div>

        {/* Enhanced Controls */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-2 z-20"
            >
              {/* Progress Bar */}
              <div 
                className="relative bg-gray-600 h-1 rounded mb-2 cursor-pointer"
                onClick={handleSeek}
              >
                <div 
                  className="absolute top-0 left-0 h-full bg-blue-500 rounded"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onPlayPause}
                    className="text-white hover:text-blue-400 transition-colors"
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  </motion.button>

                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onMute}
                      onMouseEnter={() => setShowVolumeSlider(true)}
                      className="text-white hover:text-blue-400 transition-colors"
                    >
                      {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    </motion.button>
                    
                    <AnimatePresence>
                      {showVolumeSlider && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="absolute bottom-full left-0 mb-2 bg-black/80 rounded p-2"
                          onMouseLeave={() => setShowVolumeSlider(false)}
                        >
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={isMuted ? 0 : volume}
                            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                            className="w-12 accent-blue-500"
                                                         style={{ transform: 'rotate(-90deg)' }}
                             title="Volume"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <span className="text-white text-xs">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resize Handle */}
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-30"
          onMouseDown={handleResizeMouseDown}
        >
          <div className="absolute bottom-1 right-1">
            <svg width="12" height="12" viewBox="0 0 12 12" className="text-gray-400">
              <path d="M12 12L0 12L12 0Z" fill="currentColor" opacity="0.5"/>
            </svg>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  autoplay = false, // Changed default to false
  quality = 'auto',
  playbackSpeed = 1,
  onProgress,
  onEnded,
  onError,
  onBookmark,
  bookmarks = [],
  initialTime = 0,
  isPreview = false,
  allowDownload = false,
  allowMiniPlayer = true,
  onMiniPlayerToggle,
  onRefreshUrl,
  transcriptions = [],
  chapters = [],
  sessionId,
  sessionTitle,
  onClose
}) => {
  // States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialTime);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [buffering, setBuffering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [quality_, setQuality] = useState(quality);
  const [playbackRate, setPlaybackRate] = useState(playbackSpeed);
  const [isMiniPlayer, setIsMiniPlayer] = useState(false);
  const [miniPlayerPosition, setMiniPlayerPosition] = useState({ x: window.innerWidth - 350, y: 20 });
  const [miniPlayerSize, setMiniPlayerSize] = useState({ width: 320, height: 240 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(!autoplay);
  const [urlRefreshing, setUrlRefreshing] = useState(false);
  const [youTubePlayer, setYouTubePlayer] = useState<any>(null);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [urlExpired, setUrlExpired] = useState(false);
  const [userGestureRequired, setUserGestureRequired] = useState(!autoplay);
  const [buffered, setBuffered] = useState(0);
  const [activeTranscription, setActiveTranscription] = useState<string | null>(null);
  const [showBookmarkForm, setShowBookmarkForm] = useState(false);
  const [bookmarkLabel, setBookmarkLabel] = useState('');

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const bufferingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const youTubePlayerRef = useRef<any>(null);

  // Seek function for mini player
  const handleMiniPlayerSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Check if current source is a YouTube URL
  const isCurrentSrcYouTube = src ? (src.includes('youtube.com/watch') || src.includes('youtu.be/')) : false;

  // Extract YouTube video ID
  const getYouTubeVideoId = (url: string): string | null => {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const videoId = isCurrentSrcYouTube && src ? getYouTubeVideoId(src) : null;

  // Helper function to determine if URL is YouTube
  const isYouTubeUrl = (url: string): boolean => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  // Helper function to determine if URL is S3
  const isS3Url = (url: string): boolean => {
    return url.includes('amazonaws.com') || url.includes('s3.') || url.includes('cloudfront.net');
  };

  // Helper function to check if S3 URL might be expired
  const isS3UrlExpired = (url: string): boolean => {
    if (!isS3Url(url)) return false;
    
    try {
      const urlObj = new URL(url);
      const expires = urlObj.searchParams.get('X-Amz-Expires') || urlObj.searchParams.get('Expires');
      const signature = urlObj.searchParams.get('X-Amz-Signature') || urlObj.searchParams.get('Signature');
      
      if (!expires && !signature) return false; // Not a signed URL
      
      if (expires) {
        const expirationTime = parseInt(expires) * 1000;
        return Date.now() > expirationTime;
      }
      
      return false;
    } catch {
      return false;
    }
  };

  // Function to refresh S3 URL
  const refreshS3Url = async () => {
    if (!onRefreshUrl) return;
    
    try {
      setUrlRefreshing(true);
      setError(null);
      const newUrl = await onRefreshUrl();
      // If the new URL is the same as the current src, it means it was already fresh or refresh failed
      if (videoRef.current?.src === newUrl) {
        setUrlRefreshing(false);
        return;
      }
      setCurrentSrc(newUrl);
      setUrlExpired(false);
      
      // Reload video with new URL
      if (videoRef.current) {
        const wasPlaying = !videoRef.current.paused;
        const currentTimeBackup = videoRef.current.currentTime;
        
        videoRef.current.src = newUrl;
        videoRef.current.load();
        
        // Restore playback position
        videoRef.current.addEventListener('loadedmetadata', () => {
          if (videoRef.current) {
            videoRef.current.currentTime = currentTimeBackup;
            if (wasPlaying) {
              videoRef.current.play();
            }
          }
        }, { once: true });
      }
    } catch (err) {
      setError('Failed to refresh video URL. Please try again.');
      console.error('Error refreshing S3 URL:', err);
    } finally {
      setUrlRefreshing(false);
    }
  };

  // Enhanced video source processing
  const getVideoSource = useCallback(() => {
    if (!currentSrc) return '';
    
    if (isYouTubeUrl(currentSrc)) {
      // Extract YouTube video ID and create embed URL
      const videoId = currentSrc.includes('watch?v=') 
        ? currentSrc.split('watch?v=')[1]?.split('&')[0]
        : currentSrc.split('youtu.be/')[1]?.split('?')[0];
      
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1&playsinline=1`;
      }
    }
    
    return currentSrc;
  }, [currentSrc]);

  // Video event handlers
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setLoading(false);
      setUrlExpired(false);
      
      console.log('Video metadata loaded:', {
        duration: videoRef.current.duration,
        videoWidth: videoRef.current.videoWidth,
        videoHeight: videoRef.current.videoHeight,
        src: videoRef.current.src
      });
      
      if (initialTime > 0) {
        videoRef.current.currentTime = initialTime;
      }
      
      // Only attempt autoplay if explicitly enabled
      if (autoplay) {
        // Mute for autoplay (browser policy requirement)
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
        }
        
        videoRef.current.play().catch((err) => {
          console.warn('Autoplay failed:', err);
          setUserGestureRequired(true);
          setIsPlaying(false);
        });
      } else {
        // For non-autoplay, always require user gesture
        setUserGestureRequired(true);
        setIsPlaying(false);
      }
    }
  };

  const handleCanPlay = () => {
    console.log('Video can play');
    setLoading(false);
    setUrlExpired(false);
  };

  const handleLoadedData = () => {
    console.log('Video data loaded');
    setLoading(false);
    setUrlExpired(false);
  };

  const handlePlay = () => {
    setIsPlaying(true);
    setUserGestureRequired(false);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setUserGestureRequired(true); // Require gesture for replay
    onEnded?.();
  };

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.currentTarget;
    let errorMessage = 'Video playback failed. Please try again.';
    
    // Check if it's likely an S3 URL expiration issue
    if (isS3Url(currentSrc || '') && (isS3UrlExpired(currentSrc || '') || video.error?.code === 4)) {
      errorMessage = 'Video URL has expired. Click refresh to reload.';
      setUrlExpired(true);
    } else if (video.error) {
      switch (video.error.code) {
        case 1: // MEDIA_ERR_ABORTED
          errorMessage = 'Video loading was aborted.';
          break;
        case 2: // MEDIA_ERR_NETWORK
          errorMessage = 'Network error occurred while loading video.';
          break;
        case 3: // MEDIA_ERR_DECODE
          errorMessage = 'Video decoding failed.';
          break;
        case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
          errorMessage = 'Video format not supported or URL expired.';
          if (isS3Url(currentSrc || '')) {
            setUrlExpired(true);
          }
          break;
      }
    }
    
    setError(errorMessage);
    setLoading(false);
    onError?.(errorMessage);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      
      setCurrentTime(current);
      
      if (onProgress && total > 0) {
        const progress = (current / total) * 100;
        onProgress(progress, current);
      }

      // Update active transcription
      const activeTranscript = transcriptions.find(
        (transcript, index) => {
          const next = transcriptions[index + 1];
          return current >= transcript.time && (!next || current < next.time);
        }
      );
      
      if (activeTranscript) {
        setActiveTranscription(activeTranscript.text);
      }

      // Check buffered amount
      if (videoRef.current.buffered.length > 0) {
        const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
        setBuffered((bufferedEnd / total) * 100);
      }
    }
  };

  // Handle seeking
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !videoRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Play/pause functionality
  const togglePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      // Always show loading/attempting state
      setUserGestureRequired(false);
      
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        console.log('Playback started successfully');
      }).catch((err) => {
        console.error('Playback failed:', err);
        setError(`Playback failed: ${err.message}`);
        setUserGestureRequired(true);
        setIsPlaying(false);
        onError?.(err.message);
      });
    }
  };

  // Mini player functionality
  const toggleMiniPlayer = () => {
    const newMiniState = !isMiniPlayer;
    console.log('Toggling mini player:', { current: isMiniPlayer, new: newMiniState });
    
    setIsMiniPlayer(newMiniState);
    onMiniPlayerToggle?.(newMiniState);
    
    if (newMiniState) {
      // Save current position for restore
      const currentTimeBackup = videoRef.current?.currentTime || 0;
      
      // Set initial position if not set
      if (miniPlayerPosition.x === 0 && miniPlayerPosition.y === 0) {
        setMiniPlayerPosition({ 
          x: window.innerWidth - 360, 
          y: 20 
        });
      }
      
      console.log('Mini player activated at position:', miniPlayerPosition);
    } else {
      // Restore from mini player
      if (videoRef.current && isPlaying) {
        // Brief pause to allow UI to update
        setTimeout(() => {
          if (videoRef.current && !videoRef.current.paused) {
            videoRef.current.play().catch(console.error);
          }
        }, 100);
      }
      console.log('Mini player deactivated');
    }
  };

  const closeMiniPlayer = () => {
    console.log('Closing mini player');
    setIsMiniPlayer(false);
    onMiniPlayerToggle?.(false);
    onClose?.();
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!videoRef.current) return;

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'arrowleft':
          e.preventDefault();
          videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
          break;
        case 'arrowright':
          e.preventDefault();
          videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10);
          break;
        case 'arrowup':
          e.preventDefault();
          setVolume(prev => Math.min(1, prev + 0.1));
          break;
        case 'arrowdown':
          e.preventDefault();
          setVolume(prev => Math.max(0, prev - 0.1));
          break;
        case 'm':
          e.preventDefault();
          setIsMuted(prev => !prev);
          break;
        case 'f':
          e.preventDefault();
          if (!isMiniPlayer) {
            toggleFullscreen();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [duration, isPlaying, isMiniPlayer, togglePlayPause]);

  // Auto-hide controls
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      // Only auto-hide controls if video is playing and not in mini player
      if (isPlaying && !isMiniPlayer) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };

    const handleMouseLeave = () => {
      // Don't hide controls if video is paused
      if (!isPlaying) {
        setShowControls(true);
      } else if (isPlaying && !isMiniPlayer) {
        setShowControls(false);
      }
    };

    const container = containerRef.current;
    if (container && !isMiniPlayer) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    // Always show controls when video is paused
    if (!isPlaying) {
      setShowControls(true);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, isMiniPlayer]);

  // Format time helper
  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Volume control
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  // Mute toggle
  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      videoRef.current.muted = newMutedState;
    }
  };

  // Fullscreen functionality
  const toggleFullscreen = () => {
    if (!containerRef.current || isMiniPlayer) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Picture-in-Picture functionality
  const handlePictureInPicture = async () => {
    if (!videoRef.current) return;
    
    try {
      if ('pictureInPictureEnabled' in document && document.pictureInPictureEnabled) {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await videoRef.current.requestPictureInPicture();
        }
      } else {
        // Fallback to mini player if PiP is not supported
        console.log('Picture-in-Picture not supported, opening mini player instead');
        toggleMiniPlayer();
      }
    } catch (error) {
      console.error('Picture-in-Picture failed:', error);
      // Fallback to mini player on error
      toggleMiniPlayer();
    }
  };

  // Handle retry on error
  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setUrlExpired(false);
    
    if (urlExpired && onRefreshUrl) {
      refreshS3Url();
    } else if (videoRef.current) {
      videoRef.current.load();
    }
  };

  // Bookmark functionality
  const addBookmark = () => {
    if (!bookmarkLabel.trim() || !onBookmark) return;
    
    const bookmark: VideoBookmark = {
      id: Date.now().toString(),
      time: currentTime,
      label: bookmarkLabel
    };
    
    onBookmark(bookmark);
    setBookmarkLabel('');
    setShowBookmarkForm(false);
  };

  // Jump to bookmark
  const jumpToBookmark = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      // Briefly flash play button
      setShowControls(true);
      setTimeout(() => setShowControls(false), 2000);
    }
  };

  // Skip functions
  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
    }
  };

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10);
    }
  };

  // Effect for volume
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Effect for playback speed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Handle video source changes
  useEffect(() => {
    if (videoRef.current && currentSrc) {
      setLoading(true);
      setError(null);
      setUrlExpired(false);
      
      console.log('Loading video source:', currentSrc);
      
      // Reset video element
      videoRef.current.src = getVideoSource();
      videoRef.current.load();
    }
  }, [currentSrc, getVideoSource]);

  // Update current source when src prop changes
  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  // Check for URL expiration on mount
  useEffect(() => {
    if (currentSrc && isS3Url(currentSrc) && isS3UrlExpired(currentSrc)) {
      setUrlExpired(true);
      setError('Video URL has expired. Click refresh to reload.');
    }
  }, [currentSrc]);

  // If no source provided
  if (!currentSrc) {
    return (
      <div className="bg-gray-900 rounded-lg flex items-center justify-center h-64">
        <p className="text-gray-400">No video source provided</p>
      </div>
    );
  }

  // Render YouTube iframe for YouTube URLs
  if (isYouTubeUrl(currentSrc)) {
    const youTubePlayer = (
      <div className="relative w-full h-0 pb-[56.25%] bg-gray-900 rounded-lg overflow-hidden">
        <iframe
          src={getVideoSource()}
          className="absolute top-0 left-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Video Player"
        />
        {/* YouTube bookmarks overlay */}
        {bookmarks.length > 0 && (
          <div className="absolute bottom-16 right-4 space-y-2 max-h-32 overflow-y-auto">
            {bookmarks.map((bookmark) => (
              <button
                key={bookmark.id}
                onClick={() => jumpToBookmark(bookmark.time)}
                className="bg-black/70 text-white px-2 py-1 rounded text-xs hover:bg-black/90 transition-colors block"
                title={`Jump to ${formatTime(bookmark.time)}`}
              >
                📌 {bookmark.label}
              </button>
            ))}
          </div>
        )}
        {/* Mini player button for YouTube */}
        {allowMiniPlayer && (
          <button
            onClick={toggleMiniPlayer}
            className="absolute top-4 right-4 bg-black/70 text-white p-2 rounded hover:bg-black/90 transition-colors"
            title="Open mini player"
          >
            <Minimize2 size={16} />
          </button>
        )}
      </div>
    );

    return (
      <>
        {!isMiniPlayer && youTubePlayer}
        {isMiniPlayer && (
          <MiniPlayer
            isVisible={isMiniPlayer}
            onClose={closeMiniPlayer}
            onExpand={toggleMiniPlayer}
            title={sessionTitle}
            position={miniPlayerPosition}
            onPositionChange={setMiniPlayerPosition}
            size={miniPlayerSize}
            onSizeChange={setMiniPlayerSize}
            isPlaying={isPlaying}
            onPlayPause={togglePlayPause}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            isMuted={isMuted}
            onVolumeChange={handleVolumeChange}
            onMute={toggleMute}
            onSeek={handleMiniPlayerSeek}
            onPictureInPicture={handlePictureInPicture}
          >
            {youTubePlayer}
          </MiniPlayer>
        )}
      </>
    );
  }

  // Main video player component
  const videoPlayerContent = (
    <div 
      ref={containerRef}
      className={`relative bg-gray-900 rounded-lg overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50' : isMiniPlayer ? 'w-full h-full' : 'w-full aspect-video min-h-[300px]'
      }`}
      style={!isFullscreen && !isMiniPlayer ? { minHeight: '300px' } : undefined}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => !isPlaying && setShowControls(false)}
    >
      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white p-4">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="mb-4 text-center">{error}</p>
          <div className="flex space-x-4">
            <button 
              onClick={handleRetry}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors flex items-center gap-2"
              disabled={urlRefreshing}
            >
              {urlRefreshing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  {urlExpired ? 'Refresh URL' : 'Retry'}
                </>
              )}
            </button>
            {urlExpired && onRefreshUrl && (
              <button
                onClick={refreshS3Url}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors flex items-center gap-2"
                disabled={urlRefreshing}
              >
                <RefreshCw size={16} />
                Get New URL
              </button>
            )}
          </div>
        </div>
      )}

      {/* Video element */}
      <video
        ref={videoRef}
        className={`w-full h-full object-cover ${isFullscreen ? 'absolute inset-0' : 'absolute inset-0'}`}
        poster={poster}
        src={getVideoSource()}
        autoPlay={false} // Disabled autoplay
        muted={autoplay} // Only muted if autoplay was requested
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={handleCanPlay}
        onLoadedData={handleLoadedData}
        onTimeUpdate={handleTimeUpdate}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onError={handleError}
        playsInline
        preload="metadata"
        controls={false} // We use custom controls
        style={{ display: 'block' }} // Ensure video is displayed
        onClick={togglePlayPause} // Allow click to play
      >
        <source src={getVideoSource()} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for user gesture required or when paused */}
      {(userGestureRequired || !isPlaying) && !error && !loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-20">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePlayPause}
            className="bg-white/90 hover:bg-white text-gray-900 p-6 rounded-full shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-200"
          >
            <Play size={48} className="ml-2" />
          </motion.button>
        </div>
      )}

      {/* Controls overlay */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${
          showControls || isMiniPlayer || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Center play button - smaller version for when controls are visible */}
        {!isMiniPlayer && !userGestureRequired && !isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlayPause}
              className="bg-black/50 hover:bg-black/70 rounded-full p-4 transition-all duration-200"
            >
              <Play size={32} className="text-white ml-1" />
            </motion.button>
          </div>
        )}

        {/* Bottom controls */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 ${isMiniPlayer ? 'p-2' : 'p-4'}`}>
          {/* Progress bar */}
          <div 
            ref={progressRef}
            className={`relative bg-gray-600 rounded cursor-pointer mb-4 ${isMiniPlayer ? 'h-1 mb-2' : 'h-2 mb-4'}`}
            onClick={handleSeek}
          >
            {/* Buffered progress */}
            <div 
              className="absolute top-0 left-0 h-full bg-gray-400 rounded"
              style={{ width: `${buffered}%` }}
            />
            {/* Current progress */}
            <div 
              className="absolute top-0 left-0 h-full bg-blue-500 rounded"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
            {/* Bookmarks */}
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="absolute top-0 w-1 h-full bg-yellow-400 cursor-pointer"
                style={{ left: `${(bookmark.time / duration) * 100}%` }}
                onClick={(e) => {
                  e.stopPropagation();
                  jumpToBookmark(bookmark.time);
                }}
                title={`${bookmark.label} - ${formatTime(bookmark.time)}`}
              />
            ))}
          </div>

          {/* Control buttons */}
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${isMiniPlayer ? 'space-x-2' : 'space-x-4'}`}>
              <button onClick={togglePlayPause} className="text-white hover:text-blue-400 transition-colors">
                {isPlaying ? <Pause size={isMiniPlayer ? 16 : 20} /> : <Play size={isMiniPlayer ? 16 : 20} />}
              </button>
              
              {!isMiniPlayer && (
                <>
                  <button onClick={skipBackward} className="text-white hover:text-blue-400 transition-colors">
                    <SkipBack size={20} />
                  </button>
                  
                  <button onClick={skipForward} className="text-white hover:text-blue-400 transition-colors">
                    <SkipForward size={20} />
                  </button>

                  <div className="flex items-center space-x-2">
                    <button onClick={toggleMute} className="text-white hover:text-blue-400 transition-colors">
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-20 accent-blue-500"
                    />
                  </div>

                  <span className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </>
              )}
            </div>

            <div className={`flex items-center ${isMiniPlayer ? 'space-x-2' : 'space-x-4'}`}>
              {!isMiniPlayer && (
                <>
                  {onBookmark && (
                    <button 
                      onClick={() => setShowBookmarkForm(true)}
                      className="text-white hover:text-blue-400 transition-colors"
                      title="Add bookmark"
                    >
                      <Bookmark size={20} />
                    </button>
                  )}

                  <button 
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-white hover:text-blue-400 transition-colors"
                  >
                    <Settings size={20} />
                  </button>

                  {allowDownload && currentSrc && (
                    <a 
                      href={currentSrc}
                      download
                      className="text-white hover:text-blue-400 transition-colors"
                      title="Download video"
                    >
                      <Download size={20} />
                    </a>
                  )}

                  {allowMiniPlayer && (
                    <button 
                      onClick={toggleMiniPlayer}
                      className="text-white hover:text-blue-400 transition-colors"
                      title="Open mini player"
                    >
                      <Minimize2 size={20} />
                    </button>
                  )}

                  {/* Picture-in-Picture Button */}
                  <button 
                    onClick={handlePictureInPicture}
                    className="text-white hover:text-blue-400 transition-colors"
                    title="Picture in Picture"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                      <rect x="8" y="8" width="8" height="6" rx="1" ry="1"/>
                    </svg>
                  </button>

                  <button onClick={toggleFullscreen} className="text-white hover:text-blue-400 transition-colors">
                    <Maximize size={20} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Settings panel */}
        {showSettings && !isMiniPlayer && (
          <div className="absolute bottom-16 right-4 bg-black/90 rounded-lg p-4 min-w-48">
            <div className="space-y-3">
              <div>
                <label className="text-white text-sm block mb-1">Playback Speed</label>
                <select 
                  value={playbackRate}
                  onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                  className="w-full bg-gray-700 text-white rounded px-2 py-1 text-sm"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={0.75}>0.75x</option>
                  <option value={1}>1x</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2x</option>
                </select>
              </div>
              
              <div>
                <label className="text-white text-sm block mb-1">Quality</label>
                <select 
                  value={quality_}
                  onChange={(e) => setQuality(e.target.value as any)}
                  className="w-full bg-gray-700 text-white rounded px-2 py-1 text-sm"
                >
                  <option value="auto">Auto</option>
                  <option value="1080p">1080p</option>
                  <option value="720p">720p</option>
                  <option value="480p">480p</option>
                  <option value="360p">360p</option>
                </select>
              </div>

              {isS3Url(currentSrc || '') && (
                <div>
                  <button
                    onClick={refreshS3Url}
                    disabled={urlRefreshing}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={14} className={urlRefreshing ? 'animate-spin' : ''} />
                    {urlRefreshing ? 'Refreshing...' : 'Refresh URL'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bookmark form */}
        {showBookmarkForm && !isMiniPlayer && (
          <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-80">
              <h3 className="text-lg font-semibold mb-4">Add Bookmark</h3>
              <p className="text-gray-600 mb-2">Time: {formatTime(currentTime)}</p>
              <input
                type="text"
                placeholder="Bookmark label..."
                value={bookmarkLabel}
                onChange={(e) => setBookmarkLabel(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-4"
                autoFocus
              />
              <div className="flex space-x-2">
                <button
                  onClick={addBookmark}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowBookmarkForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Transcription overlay */}
        {activeTranscription && !isMiniPlayer && (
          <div className="absolute bottom-20 left-4 right-4 bg-black/75 text-white p-3 rounded">
            <p className="text-sm">{activeTranscription}</p>
          </div>
        )}
      </div>
    </div>
  );

  // Render mini player or regular player
  return (
    <>
      {!isMiniPlayer && videoPlayerContent}
      {isMiniPlayer && (
        <MiniPlayer
          isVisible={isMiniPlayer}
          onClose={() => setIsMiniPlayer(false)}
          onExpand={() => setIsMiniPlayer(false)}
          title={sessionTitle}
          position={miniPlayerPosition}
          onPositionChange={setMiniPlayerPosition}
          size={miniPlayerSize}
          onSizeChange={setMiniPlayerSize}
          isPlaying={isPlaying}
          onPlayPause={togglePlayPause}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          isMuted={isMuted}
          onVolumeChange={handleVolumeChange}
          onMute={toggleMute}
                      onSeek={handleMiniPlayerSeek}
          onPictureInPicture={handlePictureInPicture}
        >
          {videoPlayerContent}
        </MiniPlayer>
      )}
    </>
  );
};

export default VideoPlayer; 