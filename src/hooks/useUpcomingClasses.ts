import { useState, useEffect } from 'react';
import { batchAPI } from '@/apis/batch';
import { toast } from 'react-hot-toast';
import { UpcomingClass } from '@/types/upcoming-classes.types';

export const useUpcomingClasses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedClass, setSelectedClass] = useState<UpcomingClass | null>(null);
  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get student ID from localStorage
  const getStudentId = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('studentId') || 
             localStorage.getItem('userId') || 
             localStorage.getItem('_id') ||
             '68557607d5ad148e4e93c665'; // Fallback for testing
    }
    return null;
  };

  // Enhanced mapping function for upcoming classes
  const mapSessionToUpcomingClass = (session: any): UpcomingClass => {
    const sessionDateTime = new Date(session.session_date);
    const sessionEndDateTime = new Date(session.session_end_date);
    const currentTime = new Date();
    
    const duration = Math.round((sessionEndDateTime.getTime() - sessionDateTime.getTime()) / (1000 * 60));
    const minutesUntil = Math.floor((sessionDateTime.getTime() - currentTime.getTime()) / (1000 * 60));

    // Enhanced status determination for upcoming and live classes
    let status: 'upcoming' | 'today' | 'starting_soon' | 'live' | 'ended' = 'upcoming';
    
    if (currentTime >= sessionDateTime && currentTime <= sessionEndDateTime) {
      status = 'live';
    } else if (currentTime > sessionEndDateTime) {
      status = 'ended';
    } else if (minutesUntil <= 15) { // Starting within 15 minutes
      status = 'starting_soon';
    } else if (minutesUntil <= 1440) { // within 24 hours
      status = 'today';
    }

    return {
      id: session.session_id,
      title: session.title || session.batch?.name || 'Untitled Session',
      instructor: {
        name: session.instructor?.full_name || 'Instructor',
        rating: 4.5
      },
      category: session.course?.title || 'General',
      duration,
      scheduledDate: sessionDateTime.toISOString(),
      status,
      level: 'intermediate',
      participants: 1,
      maxParticipants: 1,
      description: session.description || `${session.course?.title} session - ${session.title}`,
      meetingLink: session.zoom_meeting?.join_url,
      location: session.zoom_meeting ? 'Online Session' : 'TBD',
      isOnline: !!session.zoom_meeting,
      batchInfo: {
        id: session.batch?.id,
        name: session.batch?.name,
        code: session.batch?.code
      },
      courseInfo: {
        id: session.course?.id,
        name: session.course?.title,
        code: session.course?.code
      },
      zoomMeeting: session.zoom_meeting ? {
        id: session.zoom_meeting.meeting_id,
        join_url: session.zoom_meeting.join_url,
        password: session.zoom_meeting.password
      } : undefined,
      recordedLessonsCount: session.has_recorded_lessons ? 1 : 0,
      timeUntilStart: minutesUntil > 0 ? minutesUntil : 0,
      sessionData: session // Store original session data for Google Calendar
    };
  };

  const fetchUpcomingClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const studentId = getStudentId();
      if (!studentId) {
        throw new Error('Student ID not found. Please log in again.');
      }

      console.log('Fetching upcoming classes for student:', studentId);
      
      const response = await batchAPI.getStudentUpcomingSessions(studentId, {
        limit: 20,
        days_ahead: 30
      });

      if (response.data && response.data.data) {
        const mappedClasses = response.data.data.map(mapSessionToUpcomingClass);
        setUpcomingClasses(mappedClasses);
        
        // Log live classes specifically
        const liveClasses = mappedClasses.filter(cls => cls.status === 'live');
        const startingSoonClasses = mappedClasses.filter(cls => cls.status === 'starting_soon');
        
        console.log('Successfully fetched classes:', mappedClasses);
        console.log('Live classes:', liveClasses);
        console.log('Starting soon:', startingSoonClasses);
        console.log('Student info:', response.data.student);
        console.log('Total sessions:', response.data.total_upcoming);
      } else {
        throw new Error('Failed to fetch classes');
      }
    } catch (error: any) {
      console.error('Error fetching upcoming classes:', error);
      const errorMessage = error.message || 'Failed to load upcoming classes';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingClasses();
    
    // Refresh every 30 seconds to update live class status and countdowns
    const interval = setInterval(fetchUpcomingClasses, 30000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleViewDetails = (upcomingClass: UpcomingClass) => {
    setSelectedClass(upcomingClass);
  };

  const handleCloseModal = () => {
    setSelectedClass(null);
  };

  // Filter and sort classes based on current tab and search term
  const filteredClasses = upcomingClasses.filter(upcomingClass => {
    // First apply tab filter
    switch (currentTab) {
      case 1: // Today
        return upcomingClass.status === 'today' || upcomingClass.status === 'starting_soon' || upcomingClass.status === 'live';
      case 2: // Live & Starting Soon
        return upcomingClass.status === 'live' || upcomingClass.status === 'starting_soon';
      case 3: // This Week
        if (!upcomingClass.scheduledDate) return false;
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
        const classDate = new Date(upcomingClass.scheduledDate);
        return classDate <= oneWeekFromNow;
      default: // All Classes
        return true;
    }
  }).filter(upcomingClass => {
    // Then apply search filter if there's a search term
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      upcomingClass.title.toLowerCase().includes(searchLower) ||
      upcomingClass.instructor?.name.toLowerCase().includes(searchLower) ||
      upcomingClass.category?.toLowerCase().includes(searchLower) ||
      upcomingClass.courseInfo?.name.toLowerCase().includes(searchLower) ||
      upcomingClass.batchInfo?.name.toLowerCase().includes(searchLower)
    );
  }).sort((a, b) => {
    // Sort with live classes first, then by status priority, then by scheduled date
    const statusPriority = {
      'live': 1,
      'starting_soon': 2,
      'today': 3,
      'upcoming': 4,
      'ended': 5
    };
    
    const aPriority = statusPriority[a.status || 'upcoming'];
    const bPriority = statusPriority[b.status || 'upcoming'];
    
    // First sort by status priority
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }
    
    // Then sort by scheduled date
    if (!a.scheduledDate && !b.scheduledDate) return 0;
    if (!a.scheduledDate) return 1;
    if (!b.scheduledDate) return -1;
    return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
  });

  return {
    upcomingClasses: filteredClasses,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    currentTab,
    setCurrentTab,
    handleViewDetails,
    handleCloseModal,
    selectedClass,
    fetchUpcomingClasses
  };
}; 