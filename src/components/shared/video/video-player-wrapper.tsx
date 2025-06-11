'use client';

import React, { useState, useEffect, useMemo } from 'react';
import ReactPlayer from 'react-player';
import { getVideoConfig } from '@/config/video.config';
import { 
  calculateOptimalVideoSettings, 
  preloadVideoResources, 
  trackVideoEvent,
  VideoPerformanceMonitor,
  type IVideoOptimization 
} from '@/utils/video-optimization';

interface IVideoPlayerWrapperProps {
  url: string;
  videoId?: string;
  poster?: string;
  title?: string;
  width?: string | number;
  height?: string | number;
  controls?: boolean;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsinline?: boolean;
  preload?: boolean;
  optimization?: 'coursePreview' | 'courseContent' | 'instructorVideo' | 'promotional' | 'custom';
  customOptimization?: IVideoOptimization;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (error: any) => void;
  onProgress?: (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => void;
  className?: string;
  containerClassName?: string;
  enableAnalytics?: boolean;
  allowDownload?: boolean;
}

const VideoPlayerWrapper: React.FC<IVideoPlayerWrapperProps> = ({
  url,
  videoId,
  poster,
  title,
  width = '100%',
  height = '100%',
  controls = true,
  autoplay = false,
  muted = false,
  loop = false,
  playsinline = true,
  preload = true,
  optimization = 'courseContent',
  customOptimization,
  onPlay,
  onPause,
  onEnded,
  onError,
  onProgress,
  className = '',
  containerClassName = '',
  enableAnalytics = true,
  allowDownload = false
}) => {
  const config = getVideoConfig();
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [performanceMonitor, setPerformanceMonitor] = useState<VideoPerformanceMonitor | null>(null);

  // Get optimization settings based on type or custom config
  const optimizationSettings = useMemo(() => {
    if (customOptimization) {
      return customOptimization;
    }

    switch (optimization) {
      case 'coursePreview':
        return calculateOptimalVideoSettings();
      case 'courseContent':
        return calculateOptimalVideoSettings();
      case 'instructorVideo':
        return calculateOptimalVideoSettings();
      case 'promotional':
        return {
          ...calculateOptimalVideoSettings(),
          preloadStrategy: 'auto' as const,
          recommendedQuality: '1080p'
        };
      default:
        return calculateOptimalVideoSettings();
    }
  }, [optimization, customOptimization]);

  // Preload resources when component mounts
  useEffect(() => {
    if (preload && videoId) {
      preloadVideoResources(videoId, optimizationSettings);
    }
  }, [preload, videoId, optimizationSettings]);

  // Enhanced ReactPlayer configuration based on video config
  const playerConfig = useMemo(() => {
    const baseConfig = {
      file: {
        attributes: {
          controlsList: allowDownload ? '' : 'nodownload',
          disablePictureInPicture: config.player.features.disablePictureInPicture,
          crossOrigin: config.player.features.crossorigin,
          playsInline: playsinline,
          poster: poster,
          preload: optimizationSettings.preloadStrategy
        }
      },
      youtube: {
        playerVars: {
          showinfo: 0,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          cc_load_policy: 0,
          fs: 1,
          disablekb: 0,
          controls: controls ? 1 : 0,
          autoplay: autoplay ? 1 : 0,
          mute: muted ? 1 : 0,
          loop: loop ? 1 : 0,
          playsinline: playsinline ? 1 : 0
        }
      },
      vimeo: {
        playerOptions: {
          controls: controls,
          autoplay: autoplay,
          muted: muted,
          loop: loop,
          playsinline: playsinline,
          responsive: true,
          dnt: true // Do not track
        }
      }
    };

    return baseConfig;
  }, [
    config,
    optimizationSettings,
    allowDownload,
    playsinline,
    poster,
    controls,
    autoplay,
    muted,
    loop
  ]);

  // Event handlers with analytics tracking
  const handlePlay = () => {
    if (enableAnalytics && videoId) {
      trackVideoEvent({
        videoId,
        action: 'play',
        currentTime,
        duration
      });
    }
    onPlay?.();
  };

  const handlePause = () => {
    if (enableAnalytics && videoId) {
      trackVideoEvent({
        videoId,
        action: 'pause',
        currentTime,
        duration
      });
    }
    onPause?.();
  };

  const handleEnded = () => {
    if (enableAnalytics && videoId) {
      trackVideoEvent({
        videoId,
        action: 'ended',
        currentTime,
        duration
      });
    }
    onEnded?.();
  };

  const handleError = (error: any) => {
    const errorMessage = error?.message || 'Video playback failed';
    setError(errorMessage);
    
    if (enableAnalytics && videoId) {
      trackVideoEvent({
        videoId,
        action: 'error',
        currentTime,
        duration,
        error: errorMessage
      });
    }
    
    onError?.(error);
  };

  const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
    setCurrentTime(state.playedSeconds);
    onProgress?.(state);
  };

  const handleReady = (player: any) => {
    setIsReady(true);
    
    // Get video element for performance monitoring
    const videoElement = player.getInternalPlayer();
    if (videoElement && videoElement.tagName === 'VIDEO') {
      const monitor = new VideoPerformanceMonitor(
        videoElement,
        (action: string) => {
          console.log(`📺 Quality change suggested: ${action}`);
          // Handle quality changes if needed
        }
      );
      setPerformanceMonitor(monitor);
    }
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  // Cleanup performance monitor
  useEffect(() => {
    return () => {
      if (performanceMonitor) {
        performanceMonitor.destroy();
      }
    };
  }, [performanceMonitor]);

  // Error retry functionality
  const handleRetry = () => {
    setError(null);
    setIsReady(false);
  };

  return (
    <div className={`relative ${containerClassName}`}>
      {error && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-900 text-white rounded-lg">
          <div className="text-center p-6">
            <p className="mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <ReactPlayer
        url={url}
        width={width}
        height={height}
        controls={controls}
        playing={autoplay}
        muted={muted}
        loop={loop}
        config={playerConfig}
        onReady={handleReady}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onError={handleError}
        onProgress={handleProgress}
        onDuration={handleDuration}
        className={className}
        style={{
          aspectRatio: config.player.ui.aspectRatio,
          borderRadius: config.player.ui.borderRadius
        }}
      />

      {/* Development debug info */}
      {process.env.NODE_ENV === 'development' && isReady && (
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs p-2 rounded opacity-70 hover:opacity-100 transition-opacity">
          <div>Quality: {optimizationSettings.recommendedQuality}</div>
          <div>Preload: {optimizationSettings.preloadStrategy}</div>
          <div>Buffer: {optimizationSettings.bufferSize}s</div>
          <div>HLS: {optimizationSettings.enableHls ? 'Yes' : 'No'}</div>
          <div>CDN: {optimizationSettings.useCdn ? 'Yes' : 'No'}</div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayerWrapper; 