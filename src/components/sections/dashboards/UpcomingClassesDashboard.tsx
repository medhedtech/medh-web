"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Calendar, Clock, Star, Eye, Play, Users, User, FileText, Video, MapPin, Globe, Loader2, Bell, Timer, CalendarDays, ChevronRight, AlarmClock, Check, Trash2, CalendarPlus, Download, RefreshCw, BookOpen } from "lucide-react";
import StudentDashboardLayout from "./StudentDashboardLayout";
import { batchAPI } from '@/apis/batch';
import { toast } from 'react-hot-toast';
import { openGoogleCalendar, downloadICSFile, type SessionData } from '@/utils/googleCalendar';

interface UpcomingClass {
  id: string;
  title: string;
  instructor?: {
    name: string;
    rating: number;
  };
  category?: string;
  duration?: number;
  scheduledDate?: string;
  status?: 'upcoming' | 'today' | 'starting_soon' | 'live' | 'ended';
  level?: 'beginner' | 'intermediate' | 'advanced';
  participants?: number;
  maxParticipants?: number;
  description?: string;
  meetingLink?: string;
  location?: string;
  isOnline?: boolean;
  batchInfo?: {
    id: string;
    name: string;
    code: string;
  };
  courseInfo?: {
    id: string;
    name: string;
    code: string;
  };
  zoomMeeting?: {
    id: string;
    join_url: string;
    password?: string;
  };
  recordedLessonsCount?: number;
  startsIn?: string;
  timeUntilStart?: number; // minutes
  hasReminder?: boolean;
  reminderTime?: number; // minutes before class
  sessionData?: any; // Store original session data for Google Calendar
}

interface Reminder {
  classId: string;
  classTitle: string;
  scheduledDate: string;
  reminderTime: number; // minutes before class
  reminderDateTime: string; // when to show reminder
  isActive: boolean;
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
  isLive?: boolean;
}

// Enhanced TabButton with count badges and live indicators
const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children, count, isLive }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`relative inline-flex items-center justify-center w-32 sm:w-40 px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm font-medium rounded-xl transition-all duration-300 overflow-hidden group ${
      active
        ? isLive 
          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg animate-pulse'
          : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
        : isLive
        ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700 animate-pulse'
        : 'bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-gray-700/80 border border-gray-200 dark:border-gray-700'
    }`}
  >
    {/* Animated background for active state */}
    {active && !isLive && (
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 animate-pulse"></div>
    )}
    
    {/* Live indicator pulse */}
    {isLive && (
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 animate-pulse"></div>
    )}
    
    <span className="relative z-10 flex items-center gap-2">
      {children}
      {isLive && (
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
      )}
      {count !== undefined && count > 0 && (
        <span className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full ${
          active 
            ? 'bg-white/20 text-white' 
            : isLive
            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
        }`}>
          {count}
        </span>
      )}
    </span>
  </motion.button>
);

// Countdown Timer Component
const CountdownTimer: React.FC<{ targetDate: string; className?: string }> = ({ targetDate, className = "" }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.isExpired) {
    return <span className={`text-red-500 font-medium ${className}`}>Class has started</span>;
  }

  if (timeLeft.days > 0) {
    return (
      <span className={`text-gray-600 dark:text-gray-400 ${className}`}>
        Starts in {timeLeft.days}d {timeLeft.hours}h
      </span>
    );
  }

  if (timeLeft.hours > 0) {
    return (
      <span className={`text-orange-600 dark:text-orange-400 font-medium ${className}`}>
        Starts in {timeLeft.hours}h {timeLeft.minutes}m
      </span>
    );
  }

  if (timeLeft.minutes > 5) {
    return (
      <span className={`text-yellow-600 dark:text-yellow-400 font-medium ${className}`}>
        Starts in {timeLeft.minutes}m
      </span>
    );
  }

  return (
    <span className={`text-red-500 font-bold animate-pulse ${className}`}>
      Starting in {timeLeft.minutes}m {timeLeft.seconds}s
    </span>
  );
};

// Enhanced Upcoming Class Card Component
const UpcomingClassCard = ({ 
  upcomingClass, 
  onViewDetails, 
  onSetReminder, 
  onRemoveReminder 
}: { 
  upcomingClass: UpcomingClass; 
  onViewDetails: (upcomingClass: UpcomingClass) => void;
  onSetReminder: (upcomingClass: UpcomingClass) => void;
  onRemoveReminder: (classId: string) => void;
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not scheduled";
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const classDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (classDate.getTime() === today.getTime()) {
      return "Today";      return "Today";
    } else if (classDate.getTime() === tomorrow.getTime()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };

  const getStatusInfo = (status?: string, scheduledDate?: string) => {
    if (!scheduledDate) return { color: 'bg-gray-100 text-gray-700', text: 'Unscheduled', icon: Calendar };

    const now = new Date();
    const sessionDate = new Date(scheduledDate);
    const minutesUntil = Math.floor((sessionDate.getTime() - now.getTime()) / (1000 * 60));

    if (minutesUntil <= 0) {
      return { color: 'bg-red-100 text-red-700 animate-pulse', text: 'Live Now', icon: Play };
    } else if (minutesUntil <= 5) {
      return { color: 'bg-red-100 text-red-700', text: 'Starting Soon', icon: Timer };
    } else if (minutesUntil <= 60) {
      return { color: 'bg-orange-100 text-orange-700', text: `In ${minutesUntil}m`, icon: Clock };
    } else if (minutesUntil <= 1440) { // within 24 hours
      const hours = Math.floor(minutesUntil / 60);
      return { color: 'bg-yellow-100 text-yellow-700', text: `In ${hours}h`, icon: Clock };
    } else {
      const days = Math.floor(minutesUntil / 1440);
      return { color: 'bg-blue-100 text-blue-700', text: `In ${days}d`, icon: CalendarDays };
    }
  };

  const statusInfo = getStatusInfo(upcomingClass.status, upcomingClass.scheduledDate);
  const StatusIcon = statusInfo.icon;

  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 relative overflow-hidden"
    >
      {/* Status indicator stripe */}
      <div className={`absolute top-0 left-0 w-full h-1 ${
        statusInfo.text === 'Live Now' ? 'bg-red-500' :
        statusInfo.text === 'Starting Soon' ? 'bg-orange-500' :
        statusInfo.text.includes('In') && (statusInfo.text.includes('m') || statusInfo.text.includes('h')) ? 'bg-yellow-500' :
        'bg-blue-500'
      }`} />

      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
            {upcomingClass?.title || "No Title Available"}
          </h3>
            {upcomingClass?.isOnline && (
              <div className="flex items-center px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                <Globe className="w-3 h-3 mr-1" />
                Online
              </div>
            )}
            {upcomingClass?.hasReminder && (
              <div className="flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                <AlarmClock className="w-3 h-3 mr-1" />
                {upcomingClass.reminderTime}m
              </div>
            )}
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {upcomingClass?.courseInfo?.name || upcomingClass?.category}
          </p>
          
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
            <div className="flex items-center">
              <User className="w-3 h-3 mr-1" />
              {upcomingClass?.instructor?.name || "Instructor"}
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {upcomingClass?.duration ? `${upcomingClass.duration} min` : "Duration TBD"}
        </div>
      </div>
        
          {/* Countdown Timer */}
          {upcomingClass?.scheduledDate && (
            <div className="mb-3">
              <CountdownTimer 
                targetDate={upcomingClass.scheduledDate} 
                className="text-sm font-medium"
              />
            </div>
          )}
      </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <Video className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
          <span className={`px-2 py-1 text-xs rounded-full font-medium ${statusInfo.color} flex items-center gap-1`}>
            <StatusIcon className="w-3 h-3" />
            {statusInfo.text}
          </span>
        </div>
      </div>

      {/* Session Details */}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Scheduled:</span>
          <span className="text-gray-900 dark:text-gray-100 font-medium">
            {formatDate(upcomingClass?.scheduledDate)}
          </span>
        </div>
        {upcomingClass?.batchInfo?.code && (
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-600 dark:text-gray-400">Batch:</span>
            <span className="text-gray-900 dark:text-gray-100 font-mono text-xs">
              {upcomingClass.batchInfo.code}
            </span>
        </div>
      )}
      </div>

      {/* Reminder Status */}
      {upcomingClass?.hasReminder && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                Multiple Reminders Set
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-300">
                You'll be notified 1 week, 1 day, 2 hours, and 30 minutes before class
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex gap-2">
        <button 
          onClick={() => onViewDetails(upcomingClass)}
          className="flex-1 flex items-center justify-center px-3 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
        >
          <Eye className="w-4 h-4 mr-2" />
          Details
        </button>
        
        {/* Google Calendar Button */}
        <button 
          onClick={() => handleAddToGoogleCalendar(upcomingClass)}
          className="flex items-center justify-center px-3 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors text-sm font-medium group relative"
          title="Add to Google Calendar"
        >
          <CalendarPlus className="w-4 h-4" />
          {/* Tooltip */}
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Add to Calendar
          </span>
        </button>
        
        {statusInfo.text === 'Live Now' && upcomingClass?.zoomMeeting?.join_url ? (
          <a
            href={upcomingClass.zoomMeeting.join_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center px-3 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors text-sm font-medium"
          >
              <Play className="w-4 h-4 mr-2" />
            Join Live
          </a>
        ) : statusInfo.text === 'Starting Soon' ? (
          <button className="flex-1 flex items-center justify-center px-3 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-colors text-sm font-medium">
            <Bell className="w-4 h-4 mr-2" />
            Get Ready
          </button>
        ) : upcomingClass?.hasReminder ? (
          <button 
            onClick={() => onRemoveReminder(upcomingClass.id)}
            className="flex-1 flex items-center justify-center px-3 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors text-sm font-medium"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Remove Reminders
          </button>
        ) : (
          <button 
            onClick={() => onSetReminder(upcomingClass)}
            className="flex-1 flex items-center justify-center px-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors text-sm font-medium"
          >
            <Bell className="w-4 h-4 mr-2" />
            Set Multiple Reminders
          </button>
        )}
      </div>
    </motion.div>
  );
};

const handleAddToGoogleCalendar = (upcomingClass: UpcomingClass) => {
  if (!upcomingClass.sessionData) {
    toast.error('Session data not available');
    return;
  }

  try {
    openGoogleCalendar(upcomingClass.sessionData as SessionData);
    toast.success('🗓️ Opening Google Calendar...', {
      duration: 3000,
      style: {
        background: '#10B981',
        color: 'white',
      },
    });
  } catch (error) {
    console.error('Error opening Google Calendar:', error);
    toast.error('Failed to open Google Calendar');
  }
};

const handleDownloadICS = (upcomingClass: UpcomingClass) => {
  if (!upcomingClass.sessionData) {
    toast.error('Session data not available');
    return;
  }

  try {
    downloadICSFile(upcomingClass.sessionData as SessionData);
    toast.success('📥 Calendar file downloaded!', {
      duration: 3000,
      style: {
        background: '#10B981',
        color: 'white',
      },
    });
  } catch (error) {
    console.error('Error downloading ICS file:', error);
    toast.error('Failed to download calendar file');
  }
};

const StudentUpcomingClasses: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedClass, setSelectedClass] = useState<UpcomingClass | null>(null);
  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Reminder system state
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [classForReminder, setClassForReminder] = useState<UpcomingClass | null>(null);
  const [activeNotifications, setActiveNotifications] = useState<string[]>([]);

  // Get student ID from localStorage
  const getStudentId = (): string | null => {
    if (typeof window !== 'undefined') {
      // Check multiple possible keys as per user preferences
      return localStorage.getItem('studentId') || 
             localStorage.getItem('userId') || 
             localStorage.getItem('_id') ||
             '68557607d5ad148e4e93c665'; // Fallback for testing
    }
    return null;
  };

  // Reminder system functions
  const loadReminders = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('classReminders');
      if (stored) {
        const parsedReminders = JSON.parse(stored);
        setReminders(parsedReminders);
        return parsedReminders;
      }
    }
    return [];
  };

  const saveReminders = (newReminders: Reminder[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('classReminders', JSON.stringify(newReminders));
    }
    setReminders(newReminders);
  };

  const createMultipleReminders = (upcomingClass: UpcomingClass) => {
    if (!upcomingClass.scheduledDate) return;

    // Multiple reminder intervals: 1 week, 1 day, 2 hours, 30 minutes
    const reminderIntervals = [
      { minutes: 10080, label: '1 week' },    // 7 days
      { minutes: 1440, label: '1 day' },     // 24 hours
      { minutes: 120, label: '2 hours' },    // 2 hours
      { minutes: 30, label: '30 minutes' }   // 30 minutes
    ];

    const classDateTime = new Date(upcomingClass.scheduledDate);
    const newReminders: Reminder[] = [];

    reminderIntervals.forEach(({ minutes, label }) => {
      const reminderDateTime = new Date(classDateTime.getTime() - (minutes * 60 * 1000));
      
      // Only create reminder if it's in the future
      if (reminderDateTime > new Date()) {
        const newReminder: Reminder = {
          classId: upcomingClass.id,
          classTitle: upcomingClass.title,
          scheduledDate: upcomingClass.scheduledDate || '',
          reminderTime: minutes,
          reminderDateTime: reminderDateTime.toISOString(),
          isActive: true
        };
        newReminders.push(newReminder);
      }
    });

    if (newReminders.length > 0) {
      const updatedReminders = [...reminders, ...newReminders];
      saveReminders(updatedReminders);
      
      toast.success(`🔔 Multiple reminders set! You'll be notified 1 week, 1 day, 2 hours, and 30 minutes before class`, {
        duration: 4000,
        style: {
          background: '#3B82F6',
          color: 'white',
        },
      });
    } else {
      toast.error('Class is too soon to set all reminder intervals');
    }
  };

  const removeReminder = (classId: string) => {
    const updatedReminders = reminders.filter(r => r.classId !== classId);
    saveReminders(updatedReminders);
    toast.success('Reminder removed');
  };

  const checkReminders = () => {
    const now = new Date();
    const activeReminders = reminders.filter(reminder => {
      const reminderTime = new Date(reminder.reminderDateTime);
      return reminder.isActive && now >= reminderTime && now <= new Date(reminder.scheduledDate);
    });

    activeReminders.forEach(reminder => {
      if (!activeNotifications.includes(reminder.classId)) {
        showNotification(reminder);
        setActiveNotifications(prev => [...prev, reminder.classId]);
        
        // Deactivate the reminder
        const updatedReminders = reminders.map(r => 
          r.classId === reminder.classId ? { ...r, isActive: false } : r
        );
        saveReminders(updatedReminders);
      }
    });
  };

  const showNotification = (reminder: Reminder) => {
    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Class Starting Soon!`, {
        body: `${reminder.classTitle} starts in ${reminder.reminderTime} minutes`,
        icon: '/icons/courses.png'
      });
    }
    
    // Toast notification
    toast.success(
      `🔔 ${reminder.classTitle} starts in ${reminder.reminderTime} minutes!`,
      { duration: 10000 }
    );
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const handleSetReminder = (upcomingClass: UpcomingClass) => {
    requestNotificationPermission();
    createMultipleReminders(upcomingClass);
  };

  // Enhanced mapping function for upcoming classes
  const mapSessionToUpcomingClass = (session: any, loadedReminders: Reminder[] = []): UpcomingClass => {
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

    // Check if class has an active reminder
    const hasActiveReminder = loadedReminders.some(reminder => 
      reminder.classId === session.session_id && reminder.isActive
    );
    const activeReminder = loadedReminders.find(reminder => 
      reminder.classId === session.session_id && reminder.isActive
    );

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
      hasReminder: hasActiveReminder,
      reminderTime: activeReminder?.reminderTime,
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
      
      const response = await batchAPI.getStudentUpcomingSessions(studentId);

      if (response.data && response.data.data) {
        const loadedReminders = loadReminders();
        const mappedClasses = response.data.data.map((session: any) => mapSessionToUpcomingClass(session, loadedReminders));
        // Include all classes - upcoming, live, and recently ended (for reference)
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
      // Load reminders on component mount
      loadReminders();
    fetchUpcomingClasses();
      
      // Refresh every 30 seconds to update live class status and countdowns
      const interval = setInterval(() => {
        fetchUpcomingClasses();
        checkReminders();
      }, 30000);
      
      // Check reminders every minute for more precise timing
      const reminderInterval = setInterval(checkReminders, 60000);
      
      return () => {
        clearInterval(interval);
        clearInterval(reminderInterval);
      };
  }, []);

  const handleViewDetails = (upcomingClass: UpcomingClass) => {
    setSelectedClass(upcomingClass);
  };

  const handleCloseModal = () => {
    setSelectedClass(null);
  };

      // Enhanced filtering for upcoming and live classes
  const getFilteredClasses = () => {
    let filtered = upcomingClasses;
    
      // Filter by tab - includes live classes prominently
    switch (currentTab) {
        case 0: // All Classes (including live)
          filtered = upcomingClasses; // Show all including ended for reference
        break;
      case 1: // Today
          filtered = upcomingClasses.filter(cls => 
            cls.status === 'today' || cls.status === 'starting_soon' || cls.status === 'live'
        );
        break;
        case 2: // Live & Starting Soon
          filtered = upcomingClasses.filter(cls => 
            cls.status === 'live' || cls.status === 'starting_soon'
          );
        break;
        case 3: // This Week
          const oneWeekFromNow = new Date();
          oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
          filtered = upcomingClasses.filter(cls => {
            if (!cls.scheduledDate) return false;
            const classDate = new Date(cls.scheduledDate);
            return classDate <= oneWeekFromNow;
          });
        break;
      default:
        break;
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(upcomingClass =>
        upcomingClass.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        upcomingClass.instructor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        upcomingClass.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        upcomingClass.courseInfo?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        upcomingClass.batchInfo?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

          // Sort with live classes first, then by status priority, then by scheduled date
      return filtered.sort((a, b) => {
        // Define status priority (lower number = higher priority)
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
  };

  const filteredContent = getFilteredClasses();

      // Count classes for each tab with live classes prominently featured
    const tabCounts = {
      all: upcomingClasses.length, // Show all classes
      today: upcomingClasses.filter(cls => 
        cls.status === 'today' || cls.status === 'starting_soon' || cls.status === 'live'
      ).length,
      live: upcomingClasses.filter(cls => 
        cls.status === 'live' || cls.status === 'starting_soon'
      ).length,
      week: upcomingClasses.filter(cls => {
        if (!cls.scheduledDate) return false;
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
        const classDate = new Date(cls.scheduledDate);
        return classDate <= oneWeekFromNow;
      }).length
    };
    
    // Get live class count for special highlighting
    const liveClassCount = upcomingClasses.filter(cls => cls.status === 'live').length;

      const tabs = [
      { name: "All Classes", icon: CalendarDays, count: tabCounts.all },
      { name: "Today", icon: Calendar, count: tabCounts.today },
      { name: "Live & Soon", icon: Play, count: tabCounts.live, isLive: liveClassCount > 0 },
      { name: "This Week", icon: Clock, count: tabCounts.week }
    ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 sm:p-6 lg:p-8 rounded-lg max-w-7xl mx-auto"
    >
      <div className="flex flex-col space-y-6">
        {/* Enhanced Header */}
        <div className="text-center pt-6 pb-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-center mb-4"
          >
            <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl backdrop-blur-sm mr-4">
              <CalendarDays className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
              Upcoming Classes
            </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                Your next sessions await
          </p>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Tabs */}
        <div className="flex justify-center">
          <div className="flex flex-wrap justify-center gap-2 bg-gray-100/80 dark:bg-gray-800/80 rounded-2xl p-1.5 backdrop-blur-sm">
            {tabs.map((tab, idx) => {
                const TabIcon = tab.icon;
              return (
                <TabButton
                  key={idx}
                  active={currentTab === idx}
                  onClick={() => setCurrentTab(idx)}
                    count={tab.count}
                    isLive={tab.isLive}
                >
                    <TabIcon className="w-4 h-4" />
                    <span className="font-medium">{tab.name}</span>
                </TabButton>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading upcoming classes...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center"
          >
            <div className="flex items-center justify-center mb-2">
              <X className="w-6 h-6 text-red-500 mr-2" />
              <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Error Loading Classes</h3>
            </div>
            <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
            <button
              onClick={fetchUpcomingClasses}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Content */}
                  {/* Live Classes Alert Banner */}
          {!loading && !error && liveClassCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl p-4 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  <h3 className="text-lg font-semibold">
                    {liveClassCount} Live Class{liveClassCount > 1 ? 'es' : ''} in Progress!
                  </h3>
                </div>
                <button
                  onClick={() => setCurrentTab(2)} // Switch to Live & Soon tab
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-medium"
                >
                  View Live Classes
                </button>
              </div>
            </motion.div>
          )}

          {!loading && !error && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
          >
            {filteredContent.length > 0 ? (
              filteredContent.map((upcomingClass, index) => (
                <motion.div
                  key={upcomingClass.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <UpcomingClassCard
                    upcomingClass={upcomingClass}
                    onViewDetails={handleViewDetails}
                      onSetReminder={handleSetReminder}
                      onRemoveReminder={removeReminder}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                  className="col-span-full flex flex-col items-center justify-center text-center py-16"
              >
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-4">
                    <CalendarDays className="w-12 h-12 text-gray-400" />
                  </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {searchTerm ? "No matching classes found" : "No upcoming classes"}
                </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mb-4">
                    You don't have any upcoming classes scheduled at this time.
                  </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
        )}

        {/* Enhanced Details Modal */}
        <AnimatePresence>
          {selectedClass && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50"
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-2xl max-w-lg w-full relative max-h-[85vh] overflow-y-auto"
              >
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </motion.button>

                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                      <Video className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {selectedClass?.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                        {selectedClass?.courseInfo?.name || selectedClass?.category}
                  </p>
                    </div>
                  </div>

                  {/* Countdown for selected class */}
                  {selectedClass?.scheduledDate && (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <CountdownTimer 
                        targetDate={selectedClass.scheduledDate} 
                        className="text-lg font-semibold text-center block"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Instructor</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{selectedClass?.instructor?.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-500" />
                    <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Duration</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedClass?.duration ? `${selectedClass.duration} minutes` : "Duration TBD"}
                      </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Schedule</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedClass?.scheduledDate ? new Date(selectedClass.scheduledDate).toLocaleString() : "Not scheduled"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Batch</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{selectedClass?.batchInfo?.name}</p>
                      {selectedClass?.batchInfo?.code && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 font-mono">Code: {selectedClass.batchInfo.code}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {selectedClass?.isOnline ? <Globe className="w-5 h-5 text-blue-500" /> : <MapPin className="w-5 h-5 text-blue-500" />}
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Location</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedClass?.isOnline ? "Online" : selectedClass?.location || "In-person"}
                      </p>
                    </div>
                  </div>

                  {selectedClass?.zoomMeeting && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        Zoom Meeting Ready
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-300 mb-1">
                        Meeting ID: {selectedClass.zoomMeeting.id}
                      </p>
                      {selectedClass.zoomMeeting.password && (
                        <p className="text-xs text-blue-600 dark:text-blue-300">
                          Password: {selectedClass.zoomMeeting.password}
                        </p>
                      )}
                      </div>
                  )}
                    </div>

                {/* Modal Action Buttons */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {/* Calendar Options */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <button 
                      onClick={() => selectedClass && handleAddToGoogleCalendar(selectedClass)}
                      className="flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors font-medium"
                    >
                      <CalendarPlus className="w-5 h-5 mr-2" />
                      Google Calendar
                    </button>
                    <button 
                      onClick={() => selectedClass && handleDownloadICS(selectedClass)}
                      className="flex items-center justify-center px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-colors font-medium"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download ICS
                    </button>
                  </div>

                  {selectedClass?.status === 'live' && selectedClass?.zoomMeeting?.join_url ? (
                    <a
                      href={selectedClass.zoomMeeting.join_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-medium"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Join Live Class Now
                    </a>
                  ) : selectedClass?.status === 'starting_soon' ? (
                    <button className="w-full flex items-center justify-center px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-colors font-medium">
                      <Timer className="w-5 h-5 mr-2" />
                      Class Starting Soon
                    </button>
                  ) : selectedClass?.hasReminder ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            Multiple Reminders Active
                          </p>
                        </div>
                        <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                          Set for 1 week, 1 day, 2 hours, and 30 minutes before class
                        </p>
                      </div>
                      <button 
                        onClick={() => removeReminder(selectedClass.id)}
                        className="w-full flex items-center justify-center px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-medium"
                      >
                        <Trash2 className="w-5 h-5 mr-2" />
                        Remove All Reminders
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleSetReminder(selectedClass)}
                      className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium"
                    >
                      <Bell className="w-5 h-5 mr-2" />
                      Set Multiple Reminders
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Set Reminder Modal */}
        <AnimatePresence>
          {showReminderModal && classForReminder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50"
              onClick={() => setShowReminderModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-2xl max-w-md w-full relative"
              >
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowReminderModal(false)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </motion.button>

                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                      <AlarmClock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Set Reminder
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {classForReminder.title}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Class starts at:</p>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {classForReminder.scheduledDate ? 
                        new Date(classForReminder.scheduledDate).toLocaleString() : 
                        "Not scheduled"
                      }
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="text-center">
                    <div className="inline-flex items-center px-4 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          Multiple reminders will be set
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-300">
                          1 week, 1 day, 2 hours, and 30 minutes before class
                        </p>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (classForReminder) {
                        createMultipleReminders(classForReminder);
                        setShowReminderModal(false);
                        setClassForReminder(null);
                      }
                    }}
                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium"
                  >
                    <Bell className="w-5 h-5 mr-2" />
                    Set Multiple Reminders
                  </motion.button>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    You'll receive notifications at each reminder interval
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const UpcomingClassesDashboard: React.FC = () => {
  return (
    <StudentDashboardLayout 
      userRole="student"
      fullName="Student"
      userEmail="student@example.com"
      userImage=""
      userNotifications={0}
      userSettings={{
        theme: "light",
        language: "en",
        notifications: true
      }}
    >
      <StudentUpcomingClasses />
    </StudentDashboardLayout>
  );
};

export default UpcomingClassesDashboard;
