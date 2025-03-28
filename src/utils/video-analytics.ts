import { VideoAnalytics } from '../components/shared/lessons/types';

export class VideoAnalyticsTracker {
  private static instance: VideoAnalyticsTracker;
  private currentSession: VideoAnalytics | null = null;
  private analyticsEndpoint: string;
  private flushInterval: number;
  private intervalId?: NodeJS.Timeout;

  private constructor(analyticsEndpoint: string, flushInterval = 30000) {
    this.analyticsEndpoint = analyticsEndpoint;
    this.flushInterval = flushInterval;
  }

  static getInstance(analyticsEndpoint: string): VideoAnalyticsTracker {
    if (!VideoAnalyticsTracker.instance) {
      VideoAnalyticsTracker.instance = new VideoAnalyticsTracker(analyticsEndpoint);
    }
    return VideoAnalyticsTracker.instance;
  }

  startSession(viewerId: string): void {
    this.currentSession = {
      viewerId,
      sessionId: `${viewerId}-${Date.now()}`,
      startTime: Date.now(),
      endTime: 0,
      watchDuration: 0,
      segments: [],
      interactions: []
    };

    // Start periodic flushing of analytics data
    this.intervalId = setInterval(() => {
      this.flushAnalytics();
    }, this.flushInterval);
  }

  endSession(): void {
    if (this.currentSession) {
      this.currentSession.endTime = Date.now();
      this.currentSession.watchDuration = this.calculateWatchDuration();
      this.flushAnalytics();
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  trackSegment(start: number, end: number): void {
    if (!this.currentSession) return;

    this.currentSession.segments.push({
      start,
      end,
      duration: end - start
    });
  }

  trackInteraction(type: 'play' | 'pause' | 'seek' | 'speed' | 'quality' | 'fullscreen', value?: any): void {
    if (!this.currentSession) return;

    this.currentSession.interactions.push({
      type,
      timestamp: Date.now(),
      value
    });
  }

  private calculateWatchDuration(): number {
    if (!this.currentSession) return 0;

    return this.currentSession.segments.reduce((total, segment) => {
      return total + segment.duration;
    }, 0);
  }

  private async flushAnalytics(): Promise<void> {
    if (!this.currentSession) return;

    try {
      const response = await fetch(this.analyticsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.currentSession),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to send analytics data');
      }

      // Clear segments and interactions after successful flush
      this.currentSession.segments = [];
      this.currentSession.interactions = [];
    } catch (error) {
      console.error('Error flushing analytics:', error);
      // Implement retry logic here if needed
    }
  }

  // Get viewing statistics
  getViewingStats(): {
    totalDuration: number;
    averageSpeed: number;
    completionRate: number;
    interactionCount: number;
  } {
    if (!this.currentSession) {
      return {
        totalDuration: 0,
        averageSpeed: 1,
        completionRate: 0,
        interactionCount: 0
      };
    }

    const speedInteractions = this.currentSession.interactions.filter(
      i => i.type === 'speed'
    );

    const averageSpeed = speedInteractions.length
      ? speedInteractions.reduce((sum, i) => sum + (i.value || 1), 0) / speedInteractions.length
      : 1;

    return {
      totalDuration: this.calculateWatchDuration(),
      averageSpeed,
      completionRate: this.calculateCompletionRate(),
      interactionCount: this.currentSession.interactions.length
    };
  }

  private calculateCompletionRate(): number {
    if (!this.currentSession) return 0;

    const uniqueSegments = new Set();
    this.currentSession.segments.forEach(segment => {
      for (let time = segment.start; time <= segment.end; time++) {
        uniqueSegments.add(Math.floor(time));
      }
    });

    // Assuming video duration is the highest end time in segments
    const maxEndTime = Math.max(...this.currentSession.segments.map(s => s.end));
    return maxEndTime ? uniqueSegments.size / maxEndTime : 0;
  }
} 