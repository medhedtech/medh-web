export type MeetingStatus = 'live' | 'upcoming' | 'completed';

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  host: string;
  hostEmail: string;
  meetingNumber: string;
  joinUrl: string;
  password?: string;
  course?: string;
  courseId?: string;
  status: 'upcoming' | 'live' | 'completed';
  participants?: number;
  materials?: Array<{
    title: string;
    type: string;
    url: string;
  }>;
}

export interface MeetingFilters {
  searchTerm: string;
  status: MeetingStatus | 'all';
  viewMode: 'grid' | 'calendar';
}

export interface MeetingStats {
  total: number;
  live: number;
  upcoming: number;
  completed: number;
} 