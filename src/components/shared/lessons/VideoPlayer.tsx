'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, SkipBack, SkipForward, Bookmark, Download } from 'lucide-react';

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
  transcriptions?: Array<{
    time: number;
    text: string;
  }>;
  chapters?: Array<{
    time: number;
    title: string;
  }>;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  autoplay = false,
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
  transcriptions = [],
  chapters = []
}) => {
  // State management
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialTime);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [buffered, setBuffered] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [quality_, setQuality] = useState(quality);
  const [playbackSpeed_, setPlaybackSpeed] = useState(playbackSpeed);
  const [showBookmarkForm, setShowBookmarkForm] = useState(false);
  const [bookmarkLabel, setBookmarkLabel] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [activeTranscription, setActiveTranscription] = useState<string | null>(null);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper function to determine if URL is YouTube
  const isYouTubeUrl = (url: string): boolean => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  // Enhanced video source processing
  const getVideoSource = useCallback(() => {
    if (!src) return '';
    
    if (isYouTubeUrl(src)) {
      // Extract YouTube video ID and create embed URL
      const videoId = src.includes('watch?v=') 
        ? src.split('watch?v=')[1]?.split('&')[0]
        : src.split('youtu.be/')[1]?.split('?')[0];
      
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1&playsinline=1`;
      }
    }
    
    return src;
  }, [src]);

  // Video event handlers
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setLoading(false);
      
      console.log('Video metadata loaded:', {
        duration: videoRef.current.duration,
        videoWidth: videoRef.current.videoWidth,
        videoHeight: videoRef.current.videoHeight,
        src: videoRef.current.src
      });
      
      if (initialTime > 0) {
        videoRef.current.currentTime = initialTime;
      }
      
      // Handle autoplay
      if (autoplay) {
        videoRef.current.play().catch((err) => {
          console.warn('Autoplay failed:', err);
          // Don't treat autoplay failure as an error, just show play button
        });
      }
    }
  };

  const handleCanPlay = () => {
    console.log('Video can play');
    setLoading(false);
  };

  const handleLoadedData = () => {
    console.log('Video data loaded');
    setLoading(false);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    onEnded?.();
  };

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const errorMessage = 'Video playback failed. Please try again.';
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
      videoRef.current.play().catch((err) => {
        setError(`Playback failed: ${err.message}`);
        onError?.(err.message);
      });
    }
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
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [duration, isPlaying, togglePlayPause]);

  // Auto-hide controls
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      if (isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', () => setShowControls(false));
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', () => setShowControls(false));
      }
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying]);

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
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Handle retry on error
  const handleRetry = () => {
    setError(null);
    setLoading(true);
    if (videoRef.current) {
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
      videoRef.current.playbackRate = playbackSpeed_;
    }
  }, [playbackSpeed_]);

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
    if (videoRef.current && src) {
      setLoading(true);
      setError(null);
      
      console.log('Loading video source:', src);
      
      // Reset video element
      videoRef.current.src = getVideoSource();
      videoRef.current.load();
    }
  }, [src, getVideoSource]);

  // If no source provided
  if (!src) {
    return (
      <div className="bg-gray-900 rounded-lg flex items-center justify-center h-64">
        <p className="text-gray-400">No video source provided</p>
      </div>
    );
  }

  // Render YouTube iframe for YouTube URLs
  if (isYouTubeUrl(src)) {
    return (
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
      </div>
    );
  }

  // Render custom video player for other video sources
  return (
    <div 
      ref={containerRef}
      className={`relative bg-gray-900 rounded-lg overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50' : 'w-full aspect-video min-h-[300px]'
      }`}
      style={!isFullscreen ? { minHeight: '300px' } : undefined}
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
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white">
          <p className="mb-4">{error}</p>
          <button 
            onClick={handleRetry}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Video element */}
      <video
        ref={videoRef}
        className={`w-full h-full object-cover ${isFullscreen ? 'absolute inset-0' : 'absolute inset-0'}`}
        poster={poster}
        src={getVideoSource()}
        autoPlay={autoplay}
        muted={autoplay} // Required for autoplay in most browsers
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
      >
        <source src={getVideoSource()} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Controls overlay */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Center play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlayPause}
            className="bg-black/50 hover:bg-black/70 rounded-full p-4 transition-all duration-200 transform hover:scale-110"
          >
            {isPlaying ? (
              <Pause size={32} className="text-white" />
            ) : (
              <Play size={32} className="text-white ml-1" />
            )}
          </button>
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Progress bar */}
          <div 
            ref={progressRef}
            className="relative bg-gray-600 h-2 rounded mb-4 cursor-pointer"
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
            <div className="flex items-center space-x-4">
              <button onClick={togglePlayPause} className="text-white hover:text-blue-400 transition-colors">
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              
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
            </div>

            <div className="flex items-center space-x-4">
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

              {allowDownload && src && (
                <a 
                  href={src}
                  download
                  className="text-white hover:text-blue-400 transition-colors"
                  title="Download video"
                >
                  <Download size={20} />
                </a>
              )}

              <button onClick={toggleFullscreen} className="text-white hover:text-blue-400 transition-colors">
                <Maximize size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Settings panel */}
        {showSettings && (
          <div className="absolute bottom-16 right-4 bg-black/90 rounded-lg p-4 min-w-48">
            <div className="space-y-3">
              <div>
                <label className="text-white text-sm block mb-1">Playback Speed</label>
                <select 
                  value={playbackSpeed_}
                  onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
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
            </div>
          </div>
        )}

        {/* Bookmark form */}
        {showBookmarkForm && (
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
        {activeTranscription && (
          <div className="absolute bottom-20 left-4 right-4 bg-black/75 text-white p-3 rounded">
            <p className="text-sm">{activeTranscription}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer; 