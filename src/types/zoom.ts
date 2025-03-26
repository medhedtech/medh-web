export type ZoomMeetingStatus = "not_started" | "in_progress" | "ended";

export interface ZoomMeetingDetails {
  meetingNumber: string;
  joinUrl: string;
  password?: string;
}

export interface ZoomClientConfig {
  apiKey: string;
  apiSecret: string;
  sdkKey: string;
  sdkSecret: string;
}

export interface ZoomClient {
  isInitialized: boolean;
  init: (config: ZoomClientConfig) => Promise<void>;
  getMeetingStatus: (meetingId: string) => Promise<ZoomMeetingStatus>;
  joinMeeting: (details: ZoomMeetingDetails) => Promise<void>;
  leaveMeeting: () => Promise<void>;
  // Add more methods as needed
} 