/**
 * Zoom API Type Definitions
 */

// Signature response interfaces
export interface ZoomSignatureResponse {
  signature: string;
}

// Error Handling Interfaces
export interface ZoomError {
  code: string;
  message: string;
}

// Meeting Details Interfaces
export interface ZoomMeetingDetails {
  meetingNumber: string;
  signature: string;
  apiKey: string;
  userName: string;
  userEmail: string;
  password?: string;
}

// Zoom Meeting State management
export interface ZoomMeetingState {
  isLoading: boolean;
  error: ZoomError | null;
  meetingDetails: ZoomMeetingDetails | null;
}

// Zoom Role Definition (0 for attendee, 1 for host)
export type ZoomRole = 0 | 1;

// Zoom Client Interfaces
export interface ZoomClient {
  init: (options: ZoomClientConfig) => void;
  join: (options: ZoomJoinOptions) => void;
  leaveMeeting: () => void;
}

export interface ZoomClientConfig {
  sdkKey: string;
  sdkSecret: string;
}

export interface ZoomJoinOptions {
  meetingNumber: string;
  signature: string;
  userName: string;
  userEmail?: string;
  password?: string;
  success?: () => void;
  error?: (error: ZoomError) => void;
}

// Zoom Meeting Status Enum
export enum ZoomMeetingStatus {
  WAITING = 'waiting',
  STARTED = 'started',
  ENDED = 'ended',
  JOINED = 'joined',
  LEFT = 'left',
  ERROR = 'error'
}

// Zoom Meeting interfaces for API requests/responses
export interface ZoomMeetingCreate {
  topic: string;
  type: number; // 1=instant, 2=scheduled, 3=recurring with no fixed time, 8=recurring with fixed time
  start_time: string;
  duration: number;
  schedule_for?: string;
  timezone?: string;
  password?: string;
  agenda?: string;
  settings?: ZoomMeetingSettings;
}

export interface ZoomMeetingSettings {
  host_video?: boolean;
  participant_video?: boolean;
  join_before_host?: boolean;
  mute_upon_entry?: boolean;
  watermark?: boolean;
  use_pmi?: boolean;
  approval_type?: number;
  registration_type?: number;
  audio?: string;
  auto_recording?: string;
  waiting_room?: boolean;
}

export interface ZoomMeetingResponse {
  id: string;
  host_id: string;
  host_email: string;
  topic: string;
  type: number;
  status: string;
  start_time: string;
  duration: number;
  timezone: string;
  created_at: string;
  join_url: string;
  password: string;
}

// Zoom Recording interfaces
export interface ZoomRecording {
  id: string;
  meeting_id: string;
  recording_start: string;
  recording_end: string;
  file_type: string;
  file_size: number;
  play_url: string;
  download_url: string;
  status: string;
  recording_type: string;
}

// Zoom User interfaces
export interface ZoomUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  type: number;
  status: string;
  pmi: string;
  timezone: string;
  created_at: string;
  last_login_time: string;
  language: string;
  role_name: string;
}

export interface ZoomUserCreate {
  action: string;
  user_info: {
    email: string;
    type: number;
    first_name: string;
    last_name: string;
    password?: string;
  };
}

// Zoom Registrant interfaces
export interface ZoomRegistrant {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  status: string;
  create_time: string;
  join_url?: string;
}

export interface ZoomRegistrantCreate {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  country?: string;
  zip?: string;
  city?: string;
  state?: string;
  org?: string;
  job_title?: string;
  comments?: string;
}

export interface ZoomRegistrantStatus {
  action: string;
  registrants: Array<{
    id: string;
    email: string;
  }>;
}

// Zoom webhook event interfaces
export interface ZoomWebhookEvent {
  event: string;
  payload: {
    account_id: string;
    object: ZoomWebhookObject;
  };
}

export interface ZoomWebhookObject {
  uuid: string;
  id: string;
  host_id: string;
  topic: string;
  type: number;
  start_time: string;
  duration: number;
  timezone: string;
  host_email: string;
  recording_files?: ZoomWebhookRecordingFile[];
}

export interface ZoomWebhookRecordingFile {
  id: string;
  meeting_id: string;
  recording_start: string;
  recording_end: string;
  file_type: string;
  file_size: number;
  play_url: string;
  download_url: string;
  status: string;
  recording_type: string;
} 