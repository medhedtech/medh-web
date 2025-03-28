// Video Player Types
export interface Bookmark {
  id: string | number;
  time: number;
  label: string;
  thumbnailUrl?: string;
}

export interface VideoProgress {
  currentTime: number;
  duration: number;
  progress: number;
}

export interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoplay?: boolean;
  quality?: 'auto' | '1080p' | '720p' | '480p' | '360p';
  playbackSpeed?: number;
  onProgress?: (progress: number, currentTime: number) => void;
  onEnded?: () => void;
  onError?: (error: any) => void;
  onBookmark?: (bookmark: Bookmark) => void;
  bookmarks?: Bookmark[];
  initialTime?: number;
  isPreview?: boolean;
  encryptionKey?: string;
  allowDownload?: boolean;
  transcriptions?: {
    language: string;
    url: string;
  }[];
  chapters?: {
    id: string;
    title: string;
    startTime: number;
    endTime: number;
  }[];
  drm?: {
    type: 'widevine' | 'fairplay' | 'playready';
    licenseUrl: string;
    certificateUrl?: string;
  };
}

// YouTube Types
declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        config: {
          videoId: string;
          playerVars?: {
            controls?: number;
            showinfo?: number;
            rel?: number;
            modestbranding?: number;
            iv_load_policy?: number;
            fs?: number;
          };
          events?: {
            onReady?: (event: { target: YouTubePlayer }) => void;
            onStateChange?: (event: { data: number }) => void;
            onError?: (event: any) => void;
          };
        }
      ) => YouTubePlayer;
      PlayerState: {
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

export interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  setPlaybackRate: (rate: number) => void;
  getPlaybackRate: () => number;
  getAvailablePlaybackRates: () => number[];
  destroy: () => void;
}

// DRM and Encryption Types
export interface EncryptionConfig {
  key: string;
  iv: string;
  algorithm: 'AES-256-CBC' | 'AES-256-GCM';
}

export interface DRMConfig {
  type: 'widevine' | 'fairplay' | 'playready';
  licenseUrl: string;
  certificateUrl?: string;
}

// Analytics Types
export type VideoInteractionType = 'play' | 'pause' | 'seek' | 'speed' | 'quality' | 'fullscreen' | 'volume';

export interface VideoAnalytics {
  viewerId: string;
  sessionId: string;
  startTime: number;
  endTime: number;
  watchDuration: number;
  segments: {
    start: number;
    end: number;
    duration: number;
  }[];
  interactions: {
    type: VideoInteractionType;
    timestamp: number;
    value?: any;
  }[];
}

export interface VideoAnalyticsTracker {
  startSession: (viewerId: string) => void;
  endSession: () => void;
  trackSegment: (start: number, end: number) => void;
  trackInteraction: (type: VideoInteractionType, value?: any) => void;
  getViewingStats: () => {
    totalDuration: number;
    averageSpeed: number;
    completionRate: number;
    interactionCount: number;
  };
}

// Transcription Types
export interface Transcription {
  language: string;
  segments: {
    id: string;
    start: number;
    end: number;
    text: string;
  }[];
}

// Chapter Types
export interface Chapter {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  thumbnailUrl?: string;
} 