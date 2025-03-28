'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, 
  RefreshCcw, AlertCircle, FileText, Bookmark, BookmarkPlus,
  Settings, Type, Download, PictureInPicture, Subtitles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VideoPlayerProps, 
  Bookmark as BookmarkType, 
  YouTubePlayer,
  VideoAnalyticsTracker as IVideoAnalyticsTracker,
  VideoInteractionType
} from './types';
import { VideoEncryption } from '../../../utils/video-encryption';
import { VideoAnalyticsTracker } from '../../../utils/video-analytics';
import { TranscriptionManager } from '../../../utils/video-transcription';

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
  encryptionKey,
  allowDownload = false,
  transcriptions = [],
  chapters = [],
  drm
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const ytPlayerContainerRef = useRef<HTMLDivElement>(null);
  const [ytPlayer, setYtPlayer] = useState<YouTubePlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showBookmarkModal, setShowBookmarkModal] = useState<boolean>(false);
  const [bookmarkLabel, setBookmarkLabel] = useState<string>('');
  const [isYoutubeReady, setIsYoutubeReady] = useState<boolean>(false);
  const [showTranscript, setShowTranscript] = useState<boolean>(false);
  const [currentTranscript, setCurrentTranscript] = useState<string>('');
  const [selectedQuality, setSelectedQuality] = useState<string>(quality);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [isPiPActive, setIsPiPActive] = useState<boolean>(false);
  const [availableQualities, setAvailableQualities] = useState<string[]>(['auto']);
  const [currentChapter, setCurrentChapter] = useState<number>(0);
  const [isYouTubeEmbed] = useState<boolean>(src?.includes('youtube.com/embed/') || false);

  const videoEncryption = useMemo(() => VideoEncryption.getInstance(), []);
  const analyticsTracker = useMemo(() => VideoAnalyticsTracker.getInstance('/api/analytics') as IVideoAnalyticsTracker, []);
  const transcriptionManager = useMemo(() => TranscriptionManager.getInstance(), []);

  // Initialize video protection
  useEffect(() => {
    if (!isPreview && encryptionKey) {
      videoEncryption.setEncryptionConfig({
        key: encryptionKey,
        iv: window.crypto.getRandomValues(new Uint8Array(16)).toString(),
        algorithm: 'AES-256-CBC'
      });
      videoEncryption.enableScreenProtection();
    }

    if (drm) {
      videoEncryption.setDRMConfig(drm);
    }
  }, [encryptionKey, drm, isPreview]);

  // Initialize analytics
  useEffect(() => {
    if (!isPreview) {
      analyticsTracker.startSession(window.localStorage.getItem('userId') || 'anonymous');
      return () => analyticsTracker.endSession();
    }
  }, [isPreview]);

  // Initialize transcriptions
  useEffect(() => {
    const loadTranscriptions = async () => {
      for (const transcription of transcriptions) {
        await transcriptionManager.loadTranscription(
          transcription.language,
          transcription.url
        );
      }
    };

    if (transcriptions.length > 0) {
      loadTranscriptions();
    }
  }, [transcriptions]);

  // Handle video playback with analytics
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      analyticsTracker.trackInteraction('pause', currentTime);
    } else {
      setIsLoading(true);
      videoRef.current.play()
        .then(() => {
          setIsLoading(false);
          analyticsTracker.trackInteraction('play', currentTime);
        })
        .catch(error => {
          console.error("Playback error:", error);
          setIsLoading(false);
          setIsPlaying(false);
          setHasError(true);
          setErrorMessage("Failed to play video. Please try again.");
          onError?.(error);
        });
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, currentTime, onError]);

  // Handle quality changes
  const handleQualityChange = useCallback((newQuality: string) => {
    setSelectedQuality(newQuality);
    analyticsTracker.trackInteraction('quality', newQuality);
    
    // Implement quality switching logic here
    // This will depend on your video hosting/streaming service
  }, []);

  // Handle Picture-in-Picture
  const togglePiP = useCallback(async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPiPActive(false);
      } else if (videoRef.current) {
        await videoRef.current.requestPictureInPicture();
        setIsPiPActive(true);
      }
    } catch (error) {
      console.error('PiP error:', error);
      setErrorMessage('Picture-in-Picture mode is not supported in your browser.');
    }
  }, []);

  // Handle chapter navigation
  const handleChapterChange = useCallback((chapterIndex: number) => {
    if (!videoRef.current || chapterIndex >= chapters.length) return;
    
    const chapter = chapters[chapterIndex];
    videoRef.current.currentTime = chapter.startTime;
    setCurrentChapter(chapterIndex);
    analyticsTracker.trackInteraction('seek', chapter.startTime);
  }, [chapters]);

  // Handle transcription updates
  useEffect(() => {
    const handleTimeUpdate = () => {
      if (!videoRef.current) return;
      
      const currentSegment = transcriptionManager.findSegmentAtTime(
        videoRef.current.currentTime
      );
      
      if (currentSegment) {
        setCurrentTranscript(currentSegment.text);
      }
    };

    if (videoRef.current) {
      videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, []);

  // Handle mute toggle
  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;

    const newMutedState = !isMuted;
    videoRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
    
    if (newMutedState) {
      setVolume(0);
    } else {
      setVolume(1);
      videoRef.current.volume = 1;
    }

    analyticsTracker.trackInteraction('volume', newMutedState ? 0 : 1);
  }, [isMuted, analyticsTracker]);

  // Handle volume changes
  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    
    if (videoRef.current) {
      videoRef.current.volume = value;
      setIsMuted(value === 0);
    }

    analyticsTracker.trackInteraction('volume', value);
  }, [analyticsTracker]);

  // Handle fullscreen with proper typing
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        const container = isYouTubeEmbed
          ? document.querySelector('.youtube-player-wrapper')
          : videoRef.current;

        if (container instanceof HTMLElement) {
          await container.requestFullscreen();
          setIsFullscreen(true);
        }
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
      setErrorMessage('Fullscreen mode is not supported in your browser.');
    }
  }, [isYouTubeEmbed]);

  // Handle video playback
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
    if (!progressRef.current) return;
    
      const rect = progressRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
    
    if (isYouTubeEmbed && ytPlayer) {
      ytPlayer.seekTo(pos * duration);
    } else if (videoRef.current) {
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
  
  // Handle adding bookmarks
  const handleAddBookmark = useCallback(() => {
    if (videoRef.current) {
      setShowBookmarkModal(true);
    }
  }, []);

  const saveBookmark = useCallback(() => {
    if (!videoRef.current) return;
    
    const timestamp = videoRef.current.currentTime;
    const newBookmark = {
      id: Date.now(),
      time: timestamp,
      label: bookmarkLabel || `Bookmark at ${formatTime(timestamp)}`,
      thumbnailUrl: poster, // Could be enhanced with video frame capture
    };
    
    onBookmark?.(newBookmark);
    setShowBookmarkModal(false);
    setBookmarkLabel('');
    
    // Show confirmation toast
    // Could add toast notification here
  }, [bookmarkLabel, onBookmark, poster]);

  const jumpToBookmark = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      // Briefly flash play button
      if (!isPlaying) {
        togglePlay();
      }
    } else if (ytPlayer) {
      ytPlayer.seekTo(time);
      ytPlayer.playVideo();
    }
  };

  // Initialize YouTube player
  useEffect(() => {
    if (!isYouTubeEmbed || !isYoutubeReady) return;

    const container = document.getElementById('youtube-player-container');
    if (!container) return;

    // Extract YouTube video ID
    const videoId = src.split('/').pop()?.split('?')[0];
    if (!videoId) return;

    // Load YouTube API if not already loaded
    if (typeof window.YT === 'undefined') {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag?.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }

      window.onYouTubeIframeAPIReady = () => {
        setIsYoutubeReady(true);
      };
      return;
    }

    // Create YouTube player
    const player = new window.YT.Player('youtube-player-container', {
      videoId,
      playerVars: {
        controls: 0,
        showinfo: 0,
        rel: 0,
        modestbranding: 1,
        iv_load_policy: 3,
        fs: 0
      },
      events: {
        onReady: (event) => {
          setYtPlayer(event.target);
          setIsLoading(false);
          setDuration(event.target.getDuration());
          if (autoplay) {
            event.target.playVideo();
            setIsPlaying(true);
          }
        },
        onStateChange: (event) => {
          switch(event.data) {
            case window.YT.PlayerState.ENDED:
              setIsPlaying(false);
              onEnded?.();
              break;
            case window.YT.PlayerState.PLAYING:
              setIsPlaying(true);
              setIsLoading(false);
              break;
            case window.YT.PlayerState.PAUSED:
              setIsPlaying(false);
              break;
            case window.YT.PlayerState.BUFFERING:
              setIsLoading(true);
              break;
          }
        },
        onError: (event) => {
          setHasError(true);
          setErrorMessage("Failed to load YouTube video");
          setIsLoading(false);
          onError?.(event);
        }
      }
    });

    // Clean up function
    return () => {
      try {
        player.destroy();
      } catch (e) {
        console.error("Error destroying YouTube player:", e);
      }
    };
  }, [isYouTubeEmbed, isYoutubeReady, src, autoplay, onEnded, onError]);

  // Override play/pause functionality for YouTube
  const toggleYTPlay = useCallback(() => {
    if (!ytPlayer) return;
    
    if (isPlaying) {
      ytPlayer.pauseVideo();
    } else {
      ytPlayer.playVideo();
    }
    setIsPlaying(!isPlaying);
  }, [ytPlayer, isPlaying]);
  
  // Combined toggle for both native and YouTube
  const handleTogglePlay = useCallback(() => {
    if (isYouTubeEmbed && ytPlayer) {
      toggleYTPlay();
    } else {
      togglePlay();
    }
  }, [isYouTubeEmbed, ytPlayer, toggleYTPlay, togglePlay]);

  // Handle initial time seeking
  useEffect(() => {
    if (initialTime && initialTime > 0) {
      if (isYouTubeEmbed && ytPlayer) {
        ytPlayer.seekTo(initialTime);
      } else if (videoRef.current) {
        videoRef.current.currentTime = initialTime;
      }
    }
  }, [initialTime, isYouTubeEmbed, ytPlayer]);

  // Handle metadata loaded
  const handleMetadataLoaded = useCallback(() => {
    if (!videoRef.current) return;
    
    setDuration(videoRef.current.duration);
    setIsLoading(false);

    // Set initial time if provided
    if (initialTime > 0) {
      videoRef.current.currentTime = initialTime;
    }

    // Set initial playback speed
    videoRef.current.playbackRate = playbackSpeed;
  }, [initialTime, playbackSpeed]);

  // Add event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener('loadedmetadata', handleMetadataLoaded);
    
    return () => {
      video.removeEventListener('loadedmetadata', handleMetadataLoaded);
    };
  }, [handleMetadataLoaded]);

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

  // Render YouTube in custom player
  if (isYouTubeEmbed) {
    return (
      <div className="relative w-full h-full bg-black">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCcw className="w-10 h-10 text-primaryColor opacity-80" />
            </motion.div>
          </div>
        )}
        
        {/* Add a stable wrapper that won't be replaced by YouTube iframe API */}
        <div className="w-full h-full youtube-player-wrapper">
          <div id="youtube-player-container" className="w-full h-full" ref={ytPlayerContainerRef}></div>
        </div>
        
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"
            >
              {/* Center play/pause button */}
              <button
                onClick={handleTogglePlay}
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
                {/* Progress bar with bookmarks */}
                <div className="relative mb-3">
                  <div
                    ref={progressRef}
                    onClick={handleSeek}
                    className="relative h-1 bg-white/30 cursor-pointer group"
                  >
                    <div
                      className="absolute h-full bg-primaryColor transition-all"
                      style={{ width: `${progress}%` }}
                    />
                    <div className="absolute h-3 w-3 bg-primaryColor rounded-full -top-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
                    />
                  </div>
                  
                  {/* Bookmark indicators */}
                  {bookmarks && bookmarks.map(bookmark => (
                    <div 
                      key={bookmark.id}
                      className="absolute w-2 h-4 bg-yellow-400 rounded-sm top-[-8px] cursor-pointer transition-transform hover:scale-125"
                      style={{ left: `${(bookmark.time / duration) * 100}%`, transform: 'translateX(-50%)' }}
                      onClick={() => jumpToBookmark(bookmark.time)}
                      title={bookmark.label}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Play/Pause */}
                    <button
                      onClick={handleTogglePlay}
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
                        if (isYouTubeEmbed && ytPlayer) {
                          ytPlayer.seekTo(ytPlayer.getCurrentTime() - 10);
                        } else if (videoRef.current) {
                          videoRef.current.currentTime -= 10;
                        }
                      }}
                      className="text-white hover:text-primaryColor transition-colors"
                    >
                      <SkipBack className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => {
                        if (isYouTubeEmbed && ytPlayer) {
                          ytPlayer.seekTo(ytPlayer.getCurrentTime() + 10);
                        } else if (videoRef.current) {
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
                    {/* Bookmark button */}
                    <button
                      onClick={handleAddBookmark}
                      className="text-white hover:text-yellow-400 transition-colors"
                      title="Add Bookmark"
                    >
                      <BookmarkPlus className="w-5 h-5" />
                    </button>
                    
                    {/* Volume control */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (isYouTubeEmbed && ytPlayer) {
                            if (isMuted) {
                              ytPlayer.unMute();
                              ytPlayer.setVolume(volume * 100);
                            } else {
                              ytPlayer.mute();
                            }
                            setIsMuted(!isMuted);
                          } else {
                            toggleMute();
                          }
                        }}
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
        
        {/* Bookmark modal */}
        <AnimatePresence>
          {showBookmarkModal && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900/95 backdrop-blur-sm p-4 rounded-lg z-30 w-80"
            >
              <h3 className="text-white text-lg font-medium mb-3 flex items-center">
                <Bookmark className="w-5 h-5 mr-2 text-yellow-400" />
                Add Bookmark
              </h3>
              <div className="mb-4">
                <input
                  type="text"
                  value={bookmarkLabel}
                  onChange={(e) => setBookmarkLabel(e.target.value)}
                  placeholder="Bookmark label..."
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white focus:ring-2 focus:ring-primaryColor focus:border-transparent"
                  autoFocus
                />
                <div className="text-gray-400 text-xs mt-2">
                  Bookmark at {formatTime(currentTime)}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowBookmarkModal(false)}
                  className="px-3 py-1.5 text-sm bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveBookmark}
                  className="px-3 py-1.5 text-sm bg-primaryColor text-white rounded hover:bg-primaryColor/90 transition-colors"
                >
                  Save Bookmark
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black video-player-container">
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
        onLoadedMetadata={handleMetadataLoaded}
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
              {/* Progress bar with bookmarks */}
              <div className="relative mb-3">
              <div
                ref={progressRef}
                onClick={handleSeek}
                  className="relative h-1 bg-white/30 cursor-pointer group"
              >
                <div
                  className="absolute h-full bg-primaryColor transition-all"
                  style={{ width: `${progress}%` }}
                />
                <div className="absolute h-3 w-3 bg-primaryColor rounded-full -top-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
                />
                </div>
                
                {/* Bookmark indicators */}
                {bookmarks && bookmarks.map(bookmark => (
                  <div 
                    key={bookmark.id}
                    className="absolute w-2 h-4 bg-yellow-400 rounded-sm top-[-8px] cursor-pointer transition-transform hover:scale-125"
                    style={{ left: `${(bookmark.time / duration) * 100}%`, transform: 'translateX(-50%)' }}
                    onClick={() => jumpToBookmark(bookmark.time)}
                    title={bookmark.label}
                  />
                ))}
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
                  {/* Bookmark button */}
                  <button
                    onClick={handleAddBookmark}
                    className="text-white hover:text-yellow-400 transition-colors"
                    title="Add Bookmark"
                  >
                    <BookmarkPlus className="w-5 h-5" />
                  </button>
                  
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
      
      {/* Bookmark modal */}
      <AnimatePresence>
        {showBookmarkModal && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900/95 backdrop-blur-sm p-4 rounded-lg z-30 w-80"
          >
            <h3 className="text-white text-lg font-medium mb-3 flex items-center">
              <Bookmark className="w-5 h-5 mr-2 text-yellow-400" />
              Add Bookmark
            </h3>
            <div className="mb-4">
              <input
                type="text"
                value={bookmarkLabel}
                onChange={(e) => setBookmarkLabel(e.target.value)}
                placeholder="Bookmark label..."
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white focus:ring-2 focus:ring-primaryColor focus:border-transparent"
                autoFocus
              />
              <div className="text-gray-400 text-xs mt-2">
                Bookmark at {formatTime(currentTime)}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowBookmarkModal(false)}
                className="px-3 py-1.5 text-sm bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveBookmark}
                className="px-3 py-1.5 text-sm bg-primaryColor text-white rounded hover:bg-primaryColor/90 transition-colors"
              >
                Save Bookmark
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New features UI */}
      <div className="absolute top-4 right-4 flex gap-2">
        {/* Quality selector */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* Transcription toggle */}
        {transcriptions.length > 0 && (
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <Subtitles className="w-5 h-5" />
          </button>
        )}

        {/* PiP toggle */}
        <button
          onClick={togglePiP}
          className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <PictureInPicture className="w-5 h-5" />
        </button>

        {/* Download button (only for preview videos) */}
        {(isPreview || allowDownload) && (
          <button
            onClick={() => {
              const link = document.createElement('a');
              link.href = src;
              link.download = 'video.mp4';
              link.click();
            }}
            className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <Download className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Settings panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 right-4 bg-black/90 rounded-lg p-4 w-64"
          >
            <h3 className="text-white font-medium mb-2">Settings</h3>
            
            {/* Quality selection */}
            <div className="mb-4">
              <label className="text-white/70 text-sm block mb-1">Quality</label>
              <select
                value={selectedQuality}
                onChange={(e) => handleQualityChange(e.target.value)}
                className="w-full bg-white/10 text-white p-2 rounded"
              >
                {availableQualities.map(q => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>

            {/* Playback speed */}
            <div className="mb-4">
              <label className="text-white/70 text-sm block mb-1">Speed</label>
              <select
                value={playbackSpeed}
                onChange={(e) => {
                  const speed = parseFloat(e.target.value);
                  if (videoRef.current) {
                    videoRef.current.playbackRate = speed;
                  }
                  analyticsTracker.trackInteraction('speed', speed);
                }}
                className="w-full bg-white/10 text-white p-2 rounded"
              >
                {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(speed => (
                  <option key={speed} value={speed}>{speed}x</option>
                ))}
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transcription panel */}
      <AnimatePresence>
        {showTranscript && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute top-0 right-0 bottom-0 w-80 bg-black/90 p-4 overflow-y-auto"
          >
            <h3 className="text-white font-medium mb-4 flex items-center">
              <Type className="w-5 h-5 mr-2" />
              Transcription
            </h3>
            
            {/* Language selector */}
            <select
              value={transcriptionManager.getCurrentLanguage()}
              onChange={(e) => transcriptionManager.setLanguage(e.target.value)}
              className="w-full bg-white/10 text-white p-2 rounded mb-4"
            >
              {transcriptionManager.getAvailableLanguages().map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>

            {/* Current transcript */}
            <div className="text-white/90 text-sm leading-relaxed">
              {currentTranscript}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chapter markers */}
      {chapters.length > 0 && (
        <div className="absolute bottom-16 left-0 right-0 px-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {chapters.map((chapter, index) => (
              <button
                key={chapter.id}
                onClick={() => handleChapterChange(index)}
                className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
                  currentChapter === index
                    ? 'bg-primaryColor text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {chapter.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer; 