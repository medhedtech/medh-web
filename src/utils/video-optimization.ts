/**
 * Video Optimization Utilities
 * Performance optimizations for video streaming and playback
 */

import { getVideoConfig, videoConfigUtils } from '@/config/video.config';

export interface INetworkInfo {
  effectiveType: '2g' | '3g' | '4g' | 'slow-2g';
  downlink: number;
  rtt: number;
  saveData: boolean;
}

export interface IVideoOptimization {
  recommendedQuality: string;
  preloadStrategy: 'none' | 'metadata' | 'auto';
  bufferSize: number;
  adaptiveBitrate: boolean;
  useCdn: boolean;
  enableHls: boolean;
}

/**
 * Detect network quality and capabilities
 */
export const detectNetworkQuality = (): INetworkInfo | null => {
  if (typeof window === 'undefined' || !('connection' in navigator)) {
    return null;
  }

  const connection = (navigator as any).connection;
  return {
    effectiveType: connection.effectiveType || '4g',
    downlink: connection.downlink || 10,
    rtt: connection.rtt || 100,
    saveData: connection.saveData || false
  };
};

/**
 * Calculate optimal video settings based on device and network
 */
export const calculateOptimalVideoSettings = (
  videoSize?: { width: number; height: number },
  networkInfo?: INetworkInfo
): IVideoOptimization => {
  const config = getVideoConfig();
  const network = networkInfo || detectNetworkQuality();
  
  // Default optimization
  let optimization: IVideoOptimization = {
    recommendedQuality: '720p',
    preloadStrategy: 'metadata',
    bufferSize: 30,
    adaptiveBitrate: true,
    useCdn: true,
    enableHls: true
  };

  // Adjust based on network quality
  if (network) {
    switch (network.effectiveType) {
      case 'slow-2g':
      case '2g':
        optimization.recommendedQuality = '240p';
        optimization.preloadStrategy = 'none';
        optimization.bufferSize = 10;
        optimization.adaptiveBitrate = true;
        optimization.enableHls = false;
        break;
      
      case '3g':
        optimization.recommendedQuality = '480p';
        optimization.preloadStrategy = 'metadata';
        optimization.bufferSize = 20;
        optimization.adaptiveBitrate = true;
        break;
      
      case '4g':
        optimization.recommendedQuality = '1080p';
        optimization.preloadStrategy = 'auto';
        optimization.bufferSize = 45;
        optimization.adaptiveBitrate = true;
        break;
    }

    // Adjust for save data mode
    if (network.saveData) {
      optimization.recommendedQuality = '360p';
      optimization.preloadStrategy = 'none';
      optimization.bufferSize = 15;
    }

    // Adjust for low bandwidth
    if (network.downlink < 1.5) {
      optimization.recommendedQuality = '360p';
      optimization.adaptiveBitrate = true;
    }
  }

  // Adjust based on device capabilities
  if (typeof window !== 'undefined') {
    const devicePixelRatio = window.devicePixelRatio || 1;
    const screenWidth = window.screen.width * devicePixelRatio;
    const screenHeight = window.screen.height * devicePixelRatio;

    // Mobile devices
    if (screenWidth <= 480) {
      optimization.recommendedQuality = '480p';
      optimization.bufferSize = Math.min(optimization.bufferSize, 20);
    }
    
    // Tablet devices
    else if (screenWidth <= 1024) {
      optimization.recommendedQuality = '720p';
    }
    
    // Desktop with high DPI
    else if (devicePixelRatio > 1.5) {
      optimization.recommendedQuality = '1080p';
    }
  }

  return optimization;
};

/**
 * Get optimized video source URLs with CDN fallbacks
 */
export const getOptimizedVideoSources = (
  videoId: string,
  requestedQuality?: string
): Array<{ src: string; type: string; quality: string }> => {
  const config = getVideoConfig();
  const optimization = calculateOptimalVideoSettings();
  const targetQuality = requestedQuality || optimization.recommendedQuality;
  
  const sources = [];

  // HLS streaming (preferred for adaptive bitrate)
  if (optimization.enableHls) {
    sources.push({
      src: `${config.streaming.cdnUrls.primary}/videos/${videoId}/playlist.m3u8`,
      type: 'application/x-mpegURL',
      quality: 'adaptive'
    });
  }

  // Progressive MP4 with quality selection
  const qualities = ['1080p', '720p', '480p', '360p', '240p'];
  const startIndex = qualities.indexOf(targetQuality);
  const orderedQualities = startIndex >= 0 
    ? [...qualities.slice(startIndex), ...qualities.slice(0, startIndex)]
    : qualities;

  orderedQualities.forEach(quality => {
    // Primary CDN
    sources.push({
      src: `${config.streaming.cdnUrls.primary}/videos/${videoId}/${quality}.mp4`,
      type: 'video/mp4',
      quality
    });

    // Fallback CDNs
    config.streaming.cdnUrls.fallback.forEach((fallbackUrl, index) => {
      sources.push({
        src: `${fallbackUrl}/videos/${videoId}/${quality}.mp4`,
        type: 'video/mp4',
        quality: `${quality}_fallback_${index + 1}`
      });
    });
  });

  return sources;
};

/**
 * Preload video resources based on optimization settings
 */
export const preloadVideoResources = (videoId: string, optimization?: IVideoOptimization) => {
  if (typeof window === 'undefined') return;

  const config = getVideoConfig();
  const opts = optimization || calculateOptimalVideoSettings();

  // Preconnect to video CDN
  if (opts.useCdn && config.player.performance.preconnect.length > 0) {
    config.player.performance.preconnect.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = url;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  // Prefetch video manifest for HLS
  if (opts.enableHls && opts.preloadStrategy !== 'none') {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = `${config.streaming.cdnUrls.primary}/videos/${videoId}/playlist.m3u8`;
    document.head.appendChild(link);
  }

  // Prefetch thumbnail
  if (config.encoding.thumbnailGeneration.enabled) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = `${config.streaming.cdnUrls.primary}/videos/${videoId}/thumb.${config.encoding.thumbnailGeneration.format}`;
    document.head.appendChild(link);
  }
};

/**
 * Monitor video performance and adjust settings dynamically
 */
export class VideoPerformanceMonitor {
  private videoElement: HTMLVideoElement;
  private lastBufferCheck: number = 0;
  private bufferHealthHistory: number[] = [];
  private qualityChangeCallback?: (newQuality: string) => void;

  constructor(videoElement: HTMLVideoElement, onQualityChange?: (quality: string) => void) {
    this.videoElement = videoElement;
    this.qualityChangeCallback = onQualityChange;
    this.startMonitoring();
  }

  private startMonitoring() {
    // Monitor buffer health every 5 seconds
    setInterval(() => {
      this.checkBufferHealth();
    }, 5000);

    // Monitor for stalling events
    this.videoElement.addEventListener('waiting', () => {
      console.log('📺 Video stalling detected');
      this.handleVideoStalling();
    });

    // Monitor for recovery
    this.videoElement.addEventListener('canplay', () => {
      console.log('📺 Video playback recovered');
    });
  }

  private checkBufferHealth() {
    if (!this.videoElement.buffered.length) return;

    const currentTime = this.videoElement.currentTime;
    const bufferedEnd = this.videoElement.buffered.end(this.videoElement.buffered.length - 1);
    const bufferAhead = bufferedEnd - currentTime;

    this.bufferHealthHistory.push(bufferAhead);
    
    // Keep only last 6 measurements (30 seconds)
    if (this.bufferHealthHistory.length > 6) {
      this.bufferHealthHistory.shift();
    }

    // Calculate average buffer health
    const avgBufferHealth = this.bufferHealthHistory.reduce((a, b) => a + b, 0) / this.bufferHealthHistory.length;

    console.log(`📺 Buffer health: ${bufferAhead.toFixed(1)}s ahead, avg: ${avgBufferHealth.toFixed(1)}s`);

    // Adaptive quality adjustment
    if (avgBufferHealth < 10 && this.bufferHealthHistory.length >= 3) {
      this.suggestQualityDowngrade();
    } else if (avgBufferHealth > 30 && this.bufferHealthHistory.length >= 6) {
      this.suggestQualityUpgrade();
    }
  }

  private handleVideoStalling() {
    // Immediate quality downgrade on stalling
    this.suggestQualityDowngrade();
  }

  private suggestQualityDowngrade() {
    console.log('📺 Suggesting quality downgrade due to poor buffer health');
    // Implementation would depend on the video player
    // This is a placeholder for the quality change logic
    this.qualityChangeCallback?.('downgrade');
  }

  private suggestQualityUpgrade() {
    console.log('📺 Suggesting quality upgrade due to good buffer health');
    this.qualityChangeCallback?.('upgrade');
  }

  public getPerformanceMetrics() {
    return {
      bufferHealth: this.bufferHealthHistory[this.bufferHealthHistory.length - 1] || 0,
      averageBufferHealth: this.bufferHealthHistory.reduce((a, b) => a + b, 0) / this.bufferHealthHistory.length,
      stallingEvents: 0, // Would track this in a real implementation
      qualityChanges: 0   // Would track this in a real implementation
    };
  }

  public destroy() {
    // Clean up event listeners
    this.videoElement.removeEventListener('waiting', this.handleVideoStalling);
    this.videoElement.removeEventListener('canplay', () => {});
  }
}

/**
 * Create optimized video configuration for specific use cases
 */
export const createVideoConfig = {
  /**
   * Configuration for course preview videos
   */
  coursePreview: (videoId: string) => {
    const optimization = calculateOptimalVideoSettings();
    return {
      sources: getOptimizedVideoSources(videoId, '480p'),
      poster: `${getVideoConfig().streaming.cdnUrls.primary}/videos/${videoId}/thumb.webp`,
      preload: 'metadata' as const,
      autoplay: false,
      controls: true,
      optimization
    };
  },

  /**
   * Configuration for full course videos
   */
  courseContent: (videoId: string) => {
    const optimization = calculateOptimalVideoSettings();
    return {
      sources: getOptimizedVideoSources(videoId),
      poster: `${getVideoConfig().streaming.cdnUrls.primary}/videos/${videoId}/thumb.webp`,
      preload: optimization.preloadStrategy,
      autoplay: false,
      controls: true,
      optimization
    };
  },

  /**
   * Configuration for instructor videos
   */
  instructorVideo: (videoId: string) => {
    const optimization = calculateOptimalVideoSettings();
    return {
      sources: getOptimizedVideoSources(videoId, '720p'),
      poster: `${getVideoConfig().streaming.cdnUrls.primary}/videos/${videoId}/thumb.webp`,
      preload: 'metadata' as const,
      autoplay: false,
      controls: true,
      optimization
    };
  },

  /**
   * Configuration for promotional/hero videos
   */
  promotional: (videoId: string) => {
    return {
      sources: getOptimizedVideoSources(videoId, '1080p'),
      poster: `${getVideoConfig().streaming.cdnUrls.primary}/videos/${videoId}/thumb.webp`,
      preload: 'auto' as const,
      autoplay: true,
      muted: true,
      loop: true,
      controls: false,
      optimization: calculateOptimalVideoSettings()
    };
  }
};

/**
 * Video analytics helper
 */
export const trackVideoEvent = (event: {
  videoId: string;
  action: 'play' | 'pause' | 'ended' | 'seek' | 'quality_change' | 'error';
  currentTime?: number;
  duration?: number;
  quality?: string;
  error?: string;
}) => {
  if (typeof window === 'undefined') return;

  // Send to analytics service
  const analyticsData = {
    ...event,
    timestamp: Date.now(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    networkInfo: detectNetworkQuality()
  };

  // In development, just log
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Video Analytics:', analyticsData);
  }

  // In production, send to your analytics service
  // Example: analytics.track('video_event', analyticsData);
};

export default {
  detectNetworkQuality,
  calculateOptimalVideoSettings,
  getOptimizedVideoSources,
  preloadVideoResources,
  VideoPerformanceMonitor,
  createVideoConfig,
  trackVideoEvent
}; 