'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, RefreshCcw, AlertCircle, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VideoPlayer = ({
  src,
  poster,
  autoplay = false,
  quality = 'auto',
  playbackSpeed = 1,
  onProgress,
  onEnded,
  onError,
}) => {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const controlsTimeoutRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle video playback
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        setIsLoading(true);
        videoRef.current.play()
          .then(() => {
            setIsLoading(false);
          })
          .catch(error => {
            // Handle playback errors (like autoplay policy)
            console.error("Playback error:", error);
            setIsLoading(false);
            setIsPlaying(false);
          });
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle volume changes
  const handleVolumeChange = (e) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value;
      setIsMuted(value === 0);
    }
  };

  // Handle mute toggle
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      if (!isMuted) {
        setVolume(0);
      } else {
        setVolume(1);
      }
    }
  };

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle progress updates
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
      setCurrentTime(videoRef.current.currentTime);
      onProgress?.(progress, videoRef.current.currentTime);
    }
  };

  // Handle seeking
  const handleSeek = (e) => {
    if (videoRef.current && progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  // Handle retry after error
  const handleRetry = () => {
    if (videoRef.current) {
      setHasError(false);
      setErrorMessage('');
      setIsLoading(true);
      videoRef.current.load();
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'arrowleft':
          e.preventDefault();
          if (videoRef.current) {
            videoRef.current.currentTime -= 10;
          }
          break;
        case 'arrowright':
          e.preventDefault();
          if (videoRef.current) {
            videoRef.current.currentTime += 10;
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Handle autoplay
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.autoplay = autoplay;
    }
  }, [autoplay]);

  // Handle quality changes
  useEffect(() => {
    // Implementation depends on your video source/CDN
    console.log('Quality changed to:', quality);
  }, [quality]);

  // Handle playback speed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Auto-hide controls
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isPlaying]);

  // Format time
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return h > 0
      ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      : `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Validate video URL
  useEffect(() => {
    if (!src) {
      setHasError(true);
      setErrorMessage('Video source is missing');
      setIsLoading(false);
      return;
    }

    setHasError(false);
    setErrorMessage('');
    setIsLoading(true);
  }, [src]);

  // Check if src is a valid URL
  const isValidUrl = src && (
    src.startsWith('http://') || 
    src.startsWith('https://') || 
    src.startsWith('blob:') || 
    src.startsWith('data:')
  );

  if (!isValidUrl && !hasError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white/70 p-6">
        <FileText className="w-12 h-12 mb-4 opacity-60" />
        <h3 className="text-lg font-medium mb-2">No Video Source Provided</h3>
        <p className="text-sm text-center mb-4">This lesson doesn't have a valid video URL.</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white/70 p-6">
        <AlertCircle className="w-12 h-12 mb-4 opacity-60" />
        <h3 className="text-lg font-medium mb-2">Video Error</h3>
        <p className="text-sm text-center mb-4">{errorMessage || "There was an error loading the video."}</p>
        <button 
          onClick={handleRetry}
          className="px-4 py-2 bg-primaryColor hover:bg-primaryColor/90 text-white rounded-md flex items-center transition-colors"
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="relative group">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCcw className="w-10 h-10 text-primaryColor opacity-80" />
          </motion.div>
        </div>
      )}
      
      <video
        ref={videoRef}
        className="w-full h-full"
        poster={poster}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          setIsPlaying(false);
          onEnded?.();
        }}
        onError={(e) => {
          console.error("Video error:", e);
          setHasError(true);
          setErrorMessage("Failed to load video. The file may be corrupted or unavailable.");
          setIsLoading(false);
          onError?.(e);
        }}
        onLoadedMetadata={() => {
          setDuration(videoRef.current.duration);
          setIsLoading(false);
        }}
        onLoadedData={() => {
          setIsLoading(false);
        }}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
      >
        <source src={src} type="video/mp4" />
        <source src={src} type="video/webm" />
        <source src={src} type="video/ogg" />
        Your browser does not support the video tag.
      </video>

      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
          >
            {/* Center play/pause button */}
            <button
              onClick={togglePlay}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-white" />
              ) : (
                <Play className="w-8 h-8 text-white ml-1" />
              )}
            </button>

            {/* Bottom controls */}
            <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/60 to-transparent">
              {/* Progress bar */}
              <div
                ref={progressRef}
                onClick={handleSeek}
                className="relative h-1 mb-3 bg-white/30 cursor-pointer group"
              >
                <div
                  className="absolute h-full bg-primaryColor transition-all"
                  style={{ width: `${progress}%` }}
                />
                <div className="absolute h-3 w-3 bg-primaryColor rounded-full -top-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Play/Pause */}
                  <button
                    onClick={togglePlay}
                    className="text-white hover:text-primaryColor transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </button>

                  {/* Skip backward/forward */}
                  <button
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.currentTime -= 10;
                      }
                    }}
                    className="text-white hover:text-primaryColor transition-colors"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.currentTime += 10;
                      }
                    }}
                    className="text-white hover:text-primaryColor transition-colors"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>

                  {/* Time display */}
                  <div className="text-white text-xs">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Volume control */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleMute}
                      className="text-white hover:text-primaryColor transition-colors"
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
                      className="w-20 h-1 bg-white/20 appearance-none rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                    />
                  </div>

                  {/* Fullscreen */}
                  <button
                    onClick={toggleFullscreen}
                    className="text-white hover:text-primaryColor transition-colors"
                  >
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoPlayer; 