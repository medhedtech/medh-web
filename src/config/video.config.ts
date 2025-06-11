/**
 * Comprehensive Video Configuration for Medh Web Platform
 * Centralized configuration for video streaming, encoding, player settings, and optimization
 */

export interface IVideoConfig {
  // Upload Settings
  upload: {
    maxFileSize: number;
    maxDuration: number;
    chunkSize: number;
    supportedFormats: string[];
    supportedCodecs: string[];
    maxConcurrentUploads: number;
    retryAttempts: number;
    timeoutMs: number;
  };

  // Streaming Configuration
  streaming: {
    qualities: IVideoQuality[];
    adaptiveBitrate: boolean;
    hlsEnabled: boolean;
    dashEnabled: boolean;
    cdnUrls: {
      primary: string;
      fallback: string[];
    };
    manifestPreload: boolean;
    segmentDuration: number;
  };

  // Player Configuration
  player: {
    controls: IPlayerControls;
    features: IPlayerFeatures;
    ui: IPlayerUI;
    performance: IPlayerPerformance;
    accessibility: IPlayerAccessibility;
  };

  // Encoding Presets
  encoding: {
    presets: IEncodingPreset[];
    thumbnailGeneration: IThumbnailConfig;
    watermark: IWatermarkConfig;
  };

  // Security & DRM
  security: {
    encryption: IEncryptionConfig;
    drm: IDRMConfig;
    hotlinking: IHotlinkProtection;
    tokenExpiry: number;
  };

  // Analytics & Monitoring
  analytics: {
    enabled: boolean;
    events: string[];
    heatmaps: boolean;
    qualityMetrics: boolean;
  };

  // Mobile & Responsive
  mobile: {
    adaptiveControls: boolean;
    touchGestures: boolean;
    pictureInPicture: boolean;
    backgroundPlayback: boolean;
  };
}

export interface IVideoQuality {
  name: string;
  resolution: string;
  bitrate: number;
  fps: number;
  codec: string;
  enabled: boolean;
}

export interface IPlayerControls {
  playPause: boolean;
  volume: boolean;
  progress: boolean;
  fullscreen: boolean;
  playbackSpeed: boolean;
  quality: boolean;
  subtitles: boolean;
  chapters: boolean;
  bookmarks: boolean;
  download: boolean;
  sharing: boolean;
  autoHide: boolean;
  autoHideDelay: number;
}

export interface IPlayerFeatures {
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  preload: 'none' | 'metadata' | 'auto';
  crossorigin: 'anonymous' | 'use-credentials';
  disablePictureInPicture: boolean;
  controlsList: string[];
  keyboard: boolean;
  contextMenu: boolean;
}

export interface IPlayerUI {
  theme: 'light' | 'dark' | 'auto';
  accentColor: string;
  borderRadius: string;
  controlsBackground: string;
  loadingSpinner: boolean;
  posterFit: 'cover' | 'contain' | 'fill';
  aspectRatio: string;
  responsive: boolean;
}

export interface IPlayerPerformance {
  preconnect: string[];
  lazyLoading: boolean;
  priorityHints: boolean;
  resourceHints: boolean;
  bandwidthAdaptation: boolean;
  bufferAhead: number;
  maxBufferLength: number;
}

export interface IPlayerAccessibility {
  ariaLabels: boolean;
  keyboardNavigation: boolean;
  screenReader: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  focusIndicators: boolean;
}

export interface IEncodingPreset {
  name: string;
  resolution: string;
  videoBitrate: number;
  audioBitrate: number;
  fps: number;
  codec: string;
  profile: string;
  keyframeInterval: number;
}

export interface IThumbnailConfig {
  enabled: boolean;
  count: number;
  quality: number;
  width: number;
  height: number;
  format: 'jpg' | 'png' | 'webp';
  sprite: boolean;
}

export interface IWatermarkConfig {
  enabled: boolean;
  image: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  opacity: number;
  size: string;
}

export interface IEncryptionConfig {
  enabled: boolean;
  algorithm: string;
  keyRotation: number;
  segmentEncryption: boolean;
}

export interface IDRMConfig {
  enabled: boolean;
  provider: 'widevine' | 'fairplay' | 'playready';
  licenseUrl: string;
  certificateUrl?: string;
}

export interface IHotlinkProtection {
  enabled: boolean;
  allowedDomains: string[];
  referrerCheck: boolean;
}

/**
 * Production Video Configuration
 */
export const videoConfig: IVideoConfig = {
  upload: {
    maxFileSize: 10 * 1024 * 1024 * 1024, // 10GB
    maxDuration: 8 * 60 * 60, // 8 hours
    chunkSize: 10 * 1024 * 1024, // 10MB chunks for optimal performance
    supportedFormats: [
      'video/mp4',
      'video/quicktime',
      'video/webm',
      'video/x-msvideo',
      'video/x-matroska'
    ],
    supportedCodecs: ['h264', 'h265', 'vp8', 'vp9', 'av1'],
    maxConcurrentUploads: 3,
    retryAttempts: 3,
    timeoutMs: 300000, // 5 minutes
  },

  streaming: {
    qualities: [
      {
        name: 'Ultra HD',
        resolution: '2160p',
        bitrate: 15000,
        fps: 30,
        codec: 'h264',
        enabled: true
      },
      {
        name: 'Full HD',
        resolution: '1080p',
        bitrate: 8000,
        fps: 30,
        codec: 'h264',
        enabled: true
      },
      {
        name: 'HD',
        resolution: '720p',
        bitrate: 5000,
        fps: 30,
        codec: 'h264',
        enabled: true
      },
      {
        name: 'SD',
        resolution: '480p',
        bitrate: 2500,
        fps: 30,
        codec: 'h264',
        enabled: true
      },
      {
        name: 'Low',
        resolution: '360p',
        bitrate: 1000,
        fps: 30,
        codec: 'h264',
        enabled: true
      },
      {
        name: 'Mobile',
        resolution: '240p',
        bitrate: 500,
        fps: 24,
        codec: 'h264',
        enabled: true
      }
    ],
    adaptiveBitrate: true,
    hlsEnabled: true,
    dashEnabled: true,
    cdnUrls: {
      primary: 'https://medh-videos.cloudfront.net',
      fallback: [
        'https://medh-documents.s3.amazonaws.com',
        'https://medhdocuments.s3.ap-south-1.amazonaws.com'
      ]
    },
    manifestPreload: true,
    segmentDuration: 6 // seconds
  },

  player: {
    controls: {
      playPause: true,
      volume: true,
      progress: true,
      fullscreen: true,
      playbackSpeed: true,
      quality: true,
      subtitles: true,
      chapters: true,
      bookmarks: true,
      download: false, // Disabled by default for security
      sharing: true,
      autoHide: true,
      autoHideDelay: 3000
    },

    features: {
      autoplay: false, // Disabled for better UX
      loop: false,
      muted: false,
      preload: 'metadata',
      crossorigin: 'anonymous',
      disablePictureInPicture: false,
      controlsList: ['nodownload', 'nofullscreen'], // Can be overridden per video
      keyboard: true,
      contextMenu: false // Disabled for security
    },

    ui: {
      theme: 'auto',
      accentColor: '#3b82f6',
      borderRadius: '8px',
      controlsBackground: 'rgba(0, 0, 0, 0.7)',
      loadingSpinner: true,
      posterFit: 'cover',
      aspectRatio: '16:9',
      responsive: true
    },

    performance: {
      preconnect: [
        'https://medh-videos.cloudfront.net',
        'https://fonts.googleapis.com'
      ],
      lazyLoading: true,
      priorityHints: true,
      resourceHints: true,
      bandwidthAdaptation: true,
      bufferAhead: 30, // seconds
      maxBufferLength: 120 // seconds
    },

    accessibility: {
      ariaLabels: true,
      keyboardNavigation: true,
      screenReader: true,
      highContrast: true,
      reducedMotion: true,
      focusIndicators: true
    }
  },

  encoding: {
    presets: [
      {
        name: 'Ultra Quality',
        resolution: '2160p',
        videoBitrate: 15000,
        audioBitrate: 192,
        fps: 30,
        codec: 'h264',
        profile: 'high',
        keyframeInterval: 2
      },
      {
        name: 'High Quality',
        resolution: '1080p',
        videoBitrate: 8000,
        audioBitrate: 128,
        fps: 30,
        codec: 'h264',
        profile: 'high',
        keyframeInterval: 2
      },
      {
        name: 'Standard Quality',
        resolution: '720p',
        videoBitrate: 5000,
        audioBitrate: 128,
        fps: 30,
        codec: 'h264',
        profile: 'main',
        keyframeInterval: 2
      },
      {
        name: 'Mobile Optimized',
        resolution: '480p',
        videoBitrate: 2500,
        audioBitrate: 96,
        fps: 30,
        codec: 'h264',
        profile: 'baseline',
        keyframeInterval: 3
      }
    ],

    thumbnailGeneration: {
      enabled: true,
      count: 10,
      quality: 80,
      width: 320,
      height: 180,
      format: 'webp',
      sprite: true
    },

    watermark: {
      enabled: false, // Can be enabled per course/video
      image: '/assets/images/logo/watermark.png',
      position: 'bottom-right',
      opacity: 0.7,
      size: '15%'
    }
  },

  security: {
    encryption: {
      enabled: true,
      algorithm: 'AES-256-GCM',
      keyRotation: 3600, // 1 hour
      segmentEncryption: true
    },

    drm: {
      enabled: false, // Can be enabled for premium content
      provider: 'widevine',
      licenseUrl: 'https://api.medh.in/drm/license',
      certificateUrl: 'https://api.medh.in/drm/certificate'
    },

    hotlinking: {
      enabled: true,
      allowedDomains: [
        'medh.in',
        'www.medh.in',
        'app.medh.in',
        'localhost'
      ],
      referrerCheck: true
    },

    tokenExpiry: 3600 // 1 hour
  },

  analytics: {
    enabled: true,
    events: [
      'play',
      'pause',
      'ended',
      'timeupdate',
      'seeking',
      'seeked',
      'volumechange',
      'ratechange',
      'qualitychange',
      'error'
    ],
    heatmaps: true,
    qualityMetrics: true
  },

  mobile: {
    adaptiveControls: true,
    touchGestures: true,
    pictureInPicture: true,
    backgroundPlayback: false // Disabled for better performance
  }
};

/**
 * Development Video Configuration (with relaxed security and enhanced debugging)
 */
export const videoConfigDev: Partial<IVideoConfig> = {
  upload: {
    ...videoConfig.upload,
    chunkSize: 1 * 1024 * 1024, // 1MB for faster debugging
    retryAttempts: 5,
    timeoutMs: 600000, // 10 minutes for debugging
  },

  player: {
    ...videoConfig.player,
    features: {
      ...videoConfig.player.features,
      contextMenu: true, // Enabled for debugging
      controlsList: [] // No restrictions in dev
    }
  },

  security: {
    ...videoConfig.security,
    hotlinking: {
      ...videoConfig.security.hotlinking,
      allowedDomains: [
        ...videoConfig.security.hotlinking.allowedDomains,
        'localhost:3000',
        '127.0.0.1:3000',
        '192.168.1.1:3000' // Local network testing
      ]
    }
  }
};

/**
 * Get appropriate video configuration based on environment
 */
export const getVideoConfig = (): IVideoConfig => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    return {
      ...videoConfig,
      ...videoConfigDev
    } as IVideoConfig;
  }
  
  return videoConfig;
};

/**
 * Video Configuration Utilities
 */
export const videoConfigUtils = {
  /**
   * Get quality settings for a specific resolution
   */
  getQualityByResolution: (resolution: string) => {
    return videoConfig.streaming.qualities.find(q => q.resolution === resolution);
  },

  /**
   * Get encoding preset by name
   */
  getEncodingPreset: (name: string) => {
    return videoConfig.encoding.presets.find(p => p.name === name);
  },

  /**
   * Check if video format is supported
   */
  isFormatSupported: (mimeType: string) => {
    return videoConfig.upload.supportedFormats.includes(mimeType);
  },

  /**
   * Get optimal quality based on bandwidth
   */
  getOptimalQuality: (bandwidth: number) => {
    const qualities = videoConfig.streaming.qualities
      .filter(q => q.enabled)
      .sort((a, b) => b.bitrate - a.bitrate);

    for (const quality of qualities) {
      if (bandwidth >= quality.bitrate * 1.5) { // 1.5x buffer
        return quality;
      }
    }

    return qualities[qualities.length - 1]; // Return lowest quality as fallback
  },

  /**
   * Generate video source URLs with CDN fallbacks
   */
  generateSourceUrls: (videoId: string, quality: string) => {
    const config = getVideoConfig();
    const urls = [];

    // Primary CDN
    urls.push(`${config.streaming.cdnUrls.primary}/videos/${videoId}/${quality}.m3u8`);

    // Fallback CDNs
    config.streaming.cdnUrls.fallback.forEach(fallback => {
      urls.push(`${fallback}/videos/${videoId}/${quality}.m3u8`);
    });

    return urls;
  },

  /**
   * Calculate optimal chunk size based on file size and connection
   */
  calculateOptimalChunkSize: (fileSize: number, connectionSpeed?: number) => {
    const config = getVideoConfig();
    let chunkSize = config.upload.chunkSize;

    // Adjust based on file size
    if (fileSize > 5 * 1024 * 1024 * 1024) { // > 5GB
      chunkSize = 20 * 1024 * 1024; // 20MB
    } else if (fileSize > 1 * 1024 * 1024 * 1024) { // > 1GB
      chunkSize = 15 * 1024 * 1024; // 15MB
    }

    // Adjust based on connection speed (if available)
    if (connectionSpeed) {
      if (connectionSpeed < 1) { // < 1 Mbps
        chunkSize = Math.min(chunkSize, 2 * 1024 * 1024); // Max 2MB
      } else if (connectionSpeed < 5) { // < 5 Mbps
        chunkSize = Math.min(chunkSize, 5 * 1024 * 1024); // Max 5MB
      }
    }

    return chunkSize;
  }
};

export default getVideoConfig; 