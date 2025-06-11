'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  Settings, 
  SkipBack, 
  SkipForward, 
  Bookmark, 
  Download,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { getVideoConfig, videoConfigUtils } from '@/config/video.config';
import type { IVideoConfig } from '@/config/video.config';

// Enhanced interfaces with configuration support
interface IVideoSource {
  url: string;
  quality: string;
  type: string;
  size?: number;
}

interface IVideoSubtitle {
  language: string;
  label: string;
  src: string;
  default?: boolean;
}

interface IVideoChapter {
  time: number;
  title: string;
  thumbnail?: string;
}

interface IVideoBookmark {
  id: string | number;
  time: number;
  label: string;
  description?: string;
}

interface IVideoAnalytics {
  videoId: string;
  sessionId: string;
  events: Array<{
    type: string;
    timestamp: number;
    data?: any;
  }>;
}

interface IEnhancedVideoPlayerProps {
  // Core video properties
  videoId?: string;
  sources: IVideoSource[];
  poster?: string;
  title?: string;
  description?: string;
  
  // Player configuration
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  
  // Advanced features
  subtitles?: IVideoSubtitle[];
  chapters?: IVideoChapter[];
  bookmarks?: IVideoBookmark[];
  
  // Quality and performance
  defaultQuality?: string;
  adaptiveStreaming?: boolean;
  bandwidth?: number;
  
  // Security and access
  allowDownload?: boolean;
  allowSharing?: boolean;
  isPreview?: boolean;
  accessToken?: string;
  
  // Analytics and tracking
  enableAnalytics?: boolean;
  onAnalyticsEvent?: (event: any) => void;
  
  // Event handlers
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onProgress?: (progress: number, currentTime: number, duration: number) => void;
  onError?: (error: string) => void;
  onQualityChange?: (quality: string) => void;
  onBookmark?: (bookmark: IVideoBookmark) => void;
  
  // Custom styling
  className?: string;
  containerClassName?: string;
  theme?: 'light' | 'dark' | 'auto';
  accentColor?: string;
}

const EnhancedVideoPlayer: React.FC<IEnhancedVideoPlayerProps> = ({
  videoId,
  sources,
  poster,
  title,
  description,
  autoplay = false,
  loop = false,
  muted = false,
  controls = true,
  preload = 'metadata',
  subtitles = [],
  chapters = [],
  bookmarks = [],
  defaultQuality = 'auto',
  adaptiveStreaming = true,
  bandwidth,
  allowDownload = false,
  allowSharing = true,
  isPreview = false,
  accessToken,
  enableAnalytics = true,
  onAnalyticsEvent,
  onPlay,
  onPause,
  onEnded,
  onProgress,
  onError,
  onQualityChange,
  onBookmark,
  className = '',
  containerClassName = '',
  theme = 'auto',
  accentColor
}) => {
  // Get video configuration
  const config = useMemo(() => getVideoConfig(), []);
  
  // State management
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [buffered, setBuffered] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuality, setCurrentQuality] = useState(defaultQuality);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState<string>('');
  const [showBookmarkForm, setShowBookmarkForm] = useState(false);
  const [bookmarkLabel, setBookmarkLabel] = useState('');
  const [networkQuality, setNetworkQuality] = useState<'fast' | 'slow' | 'unknown'>('unknown');
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const analyticsRef = useRef<IVideoAnalytics | null>(null);
  
  // Initialize analytics
  useEffect(() => {
    if (enableAnalytics && videoId) {
      analyticsRef.current = {
        videoId,
        sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        events: []
      };
    }
  }, [enableAnalytics, videoId]);
  
  // Track analytics events
  const trackEvent = useCallback((type: string, data?: any) => {
    if (!enableAnalytics || !analyticsRef.current) return;
    
    const event = {
      type,
      timestamp: Date.now(),
      data: {
        currentTime,
        duration,
        quality: currentQuality,
        volume,
        playbackRate,
        ...data
      }
    };
    
    analyticsRef.current.events.push(event);
    onAnalyticsEvent?.(event);
    
    // Log analytics events in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Video Analytics [${type}]:`, event);
    }
  }, [
    enableAnalytics,
    currentTime,
    duration,
    currentQuality,
    volume,
    playbackRate,
    onAnalyticsEvent
  ]);
  
  // Network quality detection
  useEffect(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      const updateNetworkQuality = () => {
        const effectiveType = connection.effectiveType;
        if (effectiveType === '4g' || effectiveType === '3g') {
          setNetworkQuality('fast');
        } else {
          setNetworkQuality('slow');
        }
      };
      
      updateNetworkQuality();
      connection.addEventListener('change', updateNetworkQuality);
      
      return () => {
        connection.removeEventListener('change', updateNetworkQuality);
      };
    }
  }, []);
  
  // Auto-select optimal quality based on network and configuration
  const getOptimalSource = useCallback(() => {
    if (sources.length === 0) return null;
    
    // If adaptive streaming is disabled or specific quality is requested
    if (!adaptiveStreaming || currentQuality !== 'auto') {
      const requestedSource = sources.find(s => s.quality === currentQuality);
      if (requestedSource) return requestedSource;
    }
    
    // Use configuration utility to determine optimal quality
    let optimalQuality;
    if (bandwidth) {
      optimalQuality = videoConfigUtils.getOptimalQuality(bandwidth);
    } else {
      // Fallback based on network quality
      const qualityMap = {
        'fast': '1080p',
        'slow': '480p',
        'unknown': '720p'
      };
      const targetQuality = qualityMap[networkQuality];
      optimalQuality = videoConfigUtils.getQualityByResolution(targetQuality);
    }
    
    // Find matching source
    const targetResolution = optimalQuality?.resolution || '720p';
    const optimalSource = sources.find(s => s.quality === targetResolution);
    
    return optimalSource || sources[0]; // Fallback to first source
  }, [sources, currentQuality, adaptiveStreaming, bandwidth, networkQuality]);
  
  // Current video source
  const currentSource = useMemo(() => getOptimalSource(), [getOptimalSource]);
  
  // Video event handlers
  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setLoading(false);
      trackEvent('loadedmetadata', {
        duration: videoRef.current.duration,
        videoWidth: videoRef.current.videoWidth,
        videoHeight: videoRef.current.videoHeight
      });
    }
  }, [trackEvent]);
  
  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration;
    
    setCurrentTime(current);
    
    // Update progress callback
    if (onProgress && total > 0) {
      const progress = (current / total) * 100;
      onProgress(progress, current, total);
    }
    
    // Update buffered amount
    if (videoRef.current.buffered.length > 0) {
      const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
      setBuffered((bufferedEnd / total) * 100);
    }
    
    // Find current subtitle
    if (subtitles.length > 0 && showSubtitles) {
      // Subtitle logic would go here
    }
    
    // Track progress milestones
    if (total > 0) {
      const progress = (current / total) * 100;
      if (progress >= 25 && progress < 26) {
        trackEvent('progress_25');
      } else if (progress >= 50 && progress < 51) {
        trackEvent('progress_50');
      } else if (progress >= 75 && progress < 76) {
        trackEvent('progress_75');
      }
    }
  }, [onProgress, subtitles, showSubtitles, trackEvent]);
  
  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    onPlay?.();
    trackEvent('play');
  }, [onPlay, trackEvent]);
  
  const handlePause = useCallback(() => {
    setIsPlaying(false);
    onPause?.();
    trackEvent('pause');
  }, [onPause, trackEvent]);
  
  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    onEnded?.();
    trackEvent('ended');
  }, [onEnded, trackEvent]);
  
  const handleError = useCallback((e: any) => {
    const errorMessage = e.target?.error?.message || 'Video playback failed';
    setError(errorMessage);
    setLoading(false);
    onError?.(errorMessage);
    trackEvent('error', { errorMessage });
  }, [onError, trackEvent]);
  
  // Control functions
  const togglePlayPause = useCallback(() => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch((err) => {
        handleError({ target: { error: { message: err.message } } });
      });
    }
  }, [isPlaying, handleError]);
  
  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !videoRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    trackEvent('seek', { from: currentTime, to: newTime });
  }, [duration, currentTime, trackEvent]);
  
  const changeQuality = useCallback((quality: string) => {
    if (quality === currentQuality) return;
    
    const previousTime = currentTime;
    const wasPlaying = isPlaying;
    
    setCurrentQuality(quality);
    trackEvent('quality_change', { from: currentQuality, to: quality });
    
    // Preserve playback state when changing quality
    if (videoRef.current) {
      const handleLoadedData = () => {
        if (videoRef.current) {
          videoRef.current.currentTime = previousTime;
          if (wasPlaying) {
            videoRef.current.play();
          }
          videoRef.current.removeEventListener('loadeddata', handleLoadedData);
        }
      };
      
      videoRef.current.addEventListener('loadeddata', handleLoadedData);
    }
    
    onQualityChange?.(quality);
  }, [currentQuality, currentTime, isPlaying, trackEvent, onQualityChange]);
  
  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
    }
    trackEvent('volume_change', { volume: newVolume });
  }, [trackEvent]);
  
  const toggleMute = useCallback(() => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (videoRef.current) {
      videoRef.current.muted = newMuted;
    }
    trackEvent('mute_toggle', { muted: newMuted });
  }, [isMuted, trackEvent]);
  
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, [isFullscreen]);
  
  const skipTime = useCallback((seconds: number) => {
    if (!videoRef.current) return;
    
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    trackEvent('skip', { seconds, from: currentTime, to: newTime });
  }, [currentTime, duration, trackEvent]);
  
  const changePlaybackRate = useCallback((rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
    trackEvent('playback_rate_change', { rate });
  }, [trackEvent]);
  
  const addBookmark = useCallback(() => {
    if (!bookmarkLabel.trim()) return;
    
    const bookmark: IVideoBookmark = {
      id: `bookmark_${Date.now()}`,
      time: currentTime,
      label: bookmarkLabel.trim(),
      description: `Bookmark at ${formatTime(currentTime)}`
    };
    
    onBookmark?.(bookmark);
    setBookmarkLabel('');
    setShowBookmarkForm(false);
    trackEvent('bookmark_add', { time: currentTime, label: bookmark.label });
  }, [bookmarkLabel, currentTime, onBookmark, trackEvent]);
  
  // Utility functions
  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);
  
  // Auto-hide controls
  useEffect(() => {
    const resetTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      if (config.player.controls.autoHide && isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, config.player.controls.autoHideDelay);
      }
    };
    
    resetTimeout();
    
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, config.player.controls.autoHide, config.player.controls.autoHideDelay]);
  
  // Fullscreen change detection
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
  
  // Keyboard shortcuts
  useEffect(() => {
    if (!config.player.features.keyboard) return;
    
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!videoRef.current) return;
      
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'arrowleft':
          e.preventDefault();
          skipTime(-10);
          break;
        case 'arrowright':
          e.preventDefault();
          skipTime(10);
          break;
        case 'arrowup':
          e.preventDefault();
          handleVolumeChange(Math.min(1, volume + 0.1));
          break;
        case 'arrowdown':
          e.preventDefault();
          handleVolumeChange(Math.max(0, volume - 0.1));
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'j':
          e.preventDefault();
          skipTime(-10);
          break;
        case 'l':
          e.preventDefault();
          skipTime(10);
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [
    config.player.features.keyboard,
    togglePlayPause,
    skipTime,
    handleVolumeChange,
    volume,
    toggleMute,
    toggleFullscreen
  ]);
  
  // Theme and styling
  const themeClass = useMemo(() => {
    if (theme === 'auto') {
      return 'dark:bg-gray-900 dark:text-white bg-white text-gray-900';
    }
    return theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
  }, [theme]);
  
  const accentColorStyle = useMemo(() => {
    const color = accentColor || config.player.ui.accentColor;
    return {
      '--accent-color': color,
      '--accent-color-hover': `${color}dd`,
    } as React.CSSProperties;
  }, [accentColor, config.player.ui.accentColor]);
  
  // Error retry
  const handleRetry = useCallback(() => {
    setError(null);
    setLoading(true);
    if (videoRef.current) {
      videoRef.current.load();
    }
    trackEvent('retry');
  }, [trackEvent]);
  
  if (!currentSource) {
    return (
      <div className={`relative w-full h-0 pb-[56.25%] bg-gray-900 rounded-lg overflow-hidden ${containerClassName}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
            <p>No video source available</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      ref={containerRef}
      className={`relative bg-gray-900 rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : 'w-full h-0 pb-[56.25%]'} ${containerClassName}`}
      style={accentColorStyle}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => !isPlaying && setShowControls(false)}
      onMouseMove={() => {
        setShowControls(true);
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
      }}
    >
      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white">
          <AlertCircle className="w-12 h-12 mb-4 text-red-400" />
          <p className="mb-4 text-center px-4">{error}</p>
          <button 
            onClick={handleRetry}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      )}
      
      {/* Video element */}
      <video
        ref={videoRef}
        className={`w-full h-full object-cover ${isFullscreen ? 'absolute inset-0' : ''} ${className}`}
        poster={poster}
        autoPlay={autoplay}
        loop={loop}
        muted={muted || isMuted}
        preload={preload}
        crossOrigin={config.player.features.crossorigin}
        playsInline
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onError={handleError}
        onVolumeChange={() => {
          if (videoRef.current) {
            setVolume(videoRef.current.volume);
            setIsMuted(videoRef.current.muted);
          }
        }}
        onRateChange={() => {
          if (videoRef.current) {
            setPlaybackRate(videoRef.current.playbackRate);
          }
        }}
        disablePictureInPicture={config.player.features.disablePictureInPicture}
        controlsList={config.player.features.controlsList.join(' ')}
        onContextMenu={e => {
          if (!config.player.features.contextMenu) {
            e.preventDefault();
          }
        }}
      >
        <source src={currentSource.url} type={currentSource.type} />
        
        {/* Subtitles */}
        {subtitles.map((subtitle, index) => (
          <track
            key={index}
            kind="subtitles"
            src={subtitle.src}
            srcLang={subtitle.language}
            label={subtitle.label}
            default={subtitle.default || index === 0}
          />
        ))}
        
        Your browser does not support the video tag.
      </video>
      
      {/* Custom controls overlay */}
      {controls && (
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Top bar with title and settings */}
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                {title && <h3 className="text-white font-semibold text-lg">{title}</h3>}
                {description && <p className="text-gray-300 text-sm mt-1">{description}</p>}
              </div>
              <div className="flex items-center gap-2">
                {config.player.controls.quality && (
                  <div className="relative">
                    <button 
                      onClick={() => setShowSettings(!showSettings)}
                      className="text-white hover:text-yellow-400 transition-colors p-2"
                      aria-label="Settings"
                    >
                      <Settings className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Center play/pause button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={togglePlayPause}
              className="text-white hover:text-yellow-400 transition-all duration-200 transform hover:scale-110"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-16 h-16" />
              ) : (
                <Play className="w-16 h-16" />
              )}
            </button>
          </div>
          
          {/* Bottom controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
            {/* Progress bar */}
            <div 
              ref={progressRef}
              className="w-full h-2 bg-white/30 rounded-full cursor-pointer mb-4 relative"
              onClick={handleSeek}
            >
              {/* Buffered progress */}
              <div 
                className="absolute top-0 left-0 h-full bg-white/50 rounded-full"
                style={{ width: `${buffered}%` }}
              />
              
              {/* Current progress */}
              <div 
                className="absolute top-0 left-0 h-full bg-white rounded-full"
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              />
              
              {/* Chapters markers */}
              {chapters.map((chapter, index) => (
                <div
                  key={index}
                  className="absolute top-0 w-1 h-full bg-yellow-400 rounded-full"
                  style={{ left: `${duration > 0 ? (chapter.time / duration) * 100 : 0}%` }}
                  title={chapter.title}
                />
              ))}
              
              {/* Bookmarks markers */}
              {bookmarks.map((bookmark, index) => (
                <div
                  key={index}
                  className="absolute top-0 w-1 h-full bg-blue-400 rounded-full"
                  style={{ left: `${duration > 0 ? (bookmark.time / duration) * 100 : 0}%` }}
                  title={bookmark.label}
                />
              ))}
            </div>
            
            {/* Control buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Play/Pause */}
                <button
                  onClick={togglePlayPause}
                  className="text-white hover:text-yellow-400 transition-colors"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
                
                {/* Skip buttons */}
                <button
                  onClick={() => skipTime(-10)}
                  className="text-white hover:text-yellow-400 transition-colors"
                  aria-label="Skip back 10 seconds"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => skipTime(10)}
                  className="text-white hover:text-yellow-400 transition-colors"
                  aria-label="Skip forward 10 seconds"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
                
                {/* Volume controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-yellow-400 transition-colors"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-20 h-1 bg-white/30 rounded-full outline-none slider"
                  />
                </div>
                
                {/* Time display */}
                <span className="text-white text-sm font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Bookmark button */}
                {config.player.controls.bookmarks && (
                  <button
                    onClick={() => setShowBookmarkForm(!showBookmarkForm)}
                    className="text-white hover:text-yellow-400 transition-colors"
                    aria-label="Add bookmark"
                  >
                    <Bookmark className="w-5 h-5" />
                  </button>
                )}
                
                {/* Download button */}
                {allowDownload && config.player.controls.download && (
                  <a
                    href={currentSource.url}
                    download
                    className="text-white hover:text-yellow-400 transition-colors"
                    aria-label="Download video"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                )}
                
                {/* Fullscreen toggle */}
                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-yellow-400 transition-colors"
                  aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                >
                  {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Settings menu */}
      {showSettings && (
        <div className="absolute bottom-16 right-4 bg-black/90 rounded-lg p-4 min-w-48 max-h-80 overflow-y-auto">
          <div className="space-y-4">
            {/* Quality settings */}
            <div>
              <label className="text-white text-sm block mb-2 font-semibold">Quality</label>
              <div className="space-y-1">
                <button
                  onClick={() => changeQuality('auto')}
                  className={`block w-full text-left px-2 py-1 rounded text-sm transition-colors ${
                    currentQuality === 'auto' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  Auto ({currentSource.quality})
                </button>
                {sources.map((source, index) => (
                  <button
                    key={index}
                    onClick={() => changeQuality(source.quality)}
                    className={`block w-full text-left px-2 py-1 rounded text-sm transition-colors ${
                      currentQuality === source.quality ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    {source.quality}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Playback speed */}
            <div>
              <label className="text-white text-sm block mb-2 font-semibold">Playback Speed</label>
              <div className="space-y-1">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => changePlaybackRate(rate)}
                    className={`block w-full text-left px-2 py-1 rounded text-sm transition-colors ${
                      playbackRate === rate ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>
            
            {/* Subtitles */}
            {subtitles.length > 0 && (
              <div>
                <label className="text-white text-sm block mb-2 font-semibold">Subtitles</label>
                <div className="space-y-1">
                  <button
                    onClick={() => setShowSubtitles(false)}
                    className={`block w-full text-left px-2 py-1 rounded text-sm transition-colors ${
                      !showSubtitles ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    Off
                  </button>
                  {subtitles.map((subtitle, index) => (
                    <button
                      key={index}
                      onClick={() => setShowSubtitles(true)}
                      className={`block w-full text-left px-2 py-1 rounded text-sm transition-colors ${
                        showSubtitles ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      {subtitle.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Bookmark form */}
      {showBookmarkForm && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/90 rounded-lg p-6 min-w-80">
          <h3 className="text-white text-lg font-semibold mb-4">Add Bookmark</h3>
          <div className="space-y-4">
            <div>
              <label className="text-white text-sm block mb-1">Time</label>
              <input
                type="text"
                value={formatTime(currentTime)}
                readOnly
                className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-white text-sm block mb-1">Label</label>
              <input
                type="text"
                value={bookmarkLabel}
                onChange={(e) => setBookmarkLabel(e.target.value)}
                placeholder="Enter bookmark label"
                className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={addBookmark}
                disabled={!bookmarkLabel.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded px-4 py-2 text-sm transition-colors"
              >
                Add Bookmark
              </button>
              <button
                onClick={() => setShowBookmarkForm(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white rounded px-4 py-2 text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Subtitles overlay */}
      {showSubtitles && currentSubtitle && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded max-w-[80%] text-center">
          {currentSubtitle}
        </div>
      )}
    </div>
  );
};

export default EnhancedVideoPlayer; 