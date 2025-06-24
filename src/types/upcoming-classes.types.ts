export interface Instructor {
  name: string;
  rating?: number;
}

export interface BatchInfo {
  id: string;
  name: string;
  code?: string;
}

export interface CourseInfo {
  id: string;
  name: string;
  code?: string;
}

export interface ZoomMeeting {
  id: string;
  join_url: string;
  password?: string;
}

export interface UpcomingClass {
  id: string;
  title: string;
  instructor?: Instructor;
  category?: string;
  duration: number;
  scheduledDate?: string;
  status: 'upcoming' | 'today' | 'starting_soon' | 'live' | 'ended';
  level?: string;
  participants: number;
  maxParticipants: number;
  description?: string;
  meetingLink?: string;
  location?: string;
  isOnline: boolean;
  batchInfo?: BatchInfo;
  courseInfo?: CourseInfo;
  zoomMeeting?: ZoomMeeting;
  recordedLessonsCount?: number;
  timeUntilStart: number;
  hasReminder?: boolean;
  reminderTime?: number;
  sessionData?: any; // Original session data for calendar integration
}

export interface Reminder {
  classId: string;
  classTitle: string;
  scheduledDate: string;
  reminderTime: number;
  reminderDateTime: string;
  isActive: boolean;
}

export interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  count?: number;
  isLive?: boolean;
  children: React.ReactNode;
} 