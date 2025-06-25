"use client";
import React, { useEffect, useState, memo, useCallback, useMemo, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Calendar, Clock, Star, Eye, Play, MonitorPlay, Users, User, FileText, Video, CheckCircle, RefreshCw, CalendarPlus, Award, BarChart, MessageSquare, ThumbsUp, TrendingUp, AlertCircle, Shield, Globe, Loader2, Bell, Timer, CalendarDays, ChevronRight, AlarmClock, Check, Trash2, Download } from "lucide-react";
import StudentDashboardLayout from "./StudentDashboardLayout";
import { toast } from 'react-hot-toast';
import { openGoogleCalendar, downloadICSFile, type SessionData } from '@/utils/googleCalendar';
import '@/styles/demo-classes-mobile.css';

interface DemoClass {
  id: string;
  title: string;
  description?: string;
  instructor?: {
    name: string;
    rating?: number;
  };
  scheduledDate: string; // Required ISO date string
  duration?: number; // in minutes
  status: 'live' | 'starting_soon' | 'upcoming' | 'completed';
  participants?: number;
  maxParticipants?: number;
  meetingLink?: string;
  location?: string;
  hasReminder?: boolean;
}

interface Reminder {
  classId: string;
  classTitle: string;
  scheduledDate: string;
  reminderTime: number; // minutes before class
  reminderDateTime: string; // when to show reminder
  isActive: boolean;
}

interface TabItem {
  id: string;
  label: string;
  count?: number;
  isLive?: boolean;
}

const tabs: TabItem[] = [
  { id: 'all', label: 'All Classes' },
  { id: 'today', label: 'Today' },
  { id: 'live_soon', label: 'Live & Soon' },
  { id: 'this_week', label: 'This Week' }
];

const TabButton = memo(({ tab, isActive, onClick }: { tab: TabItem; isActive: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`
      relative inline-flex items-center justify-center px-3 py-2.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-300 overflow-hidden group min-w-0 min-h-[44px] whitespace-nowrap
      ${isActive 
        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg' 
        : 'glass-stats text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/20 dark:hover:bg-slate-700/20'
      }
    `}
  >
    <span className="text-center">{tab.label}</span>
    {tab.count !== undefined && (
      <span className={`ml-1.5 sm:ml-2 px-1.5 py-0.5 rounded-full text-xs font-medium ${
        isActive 
          ? 'bg-white/20 text-white' 
          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
      }`}>
        {tab.count}
      </span>
    )}
  </button>
));

TabButton.displayName = 'TabButton';

// Countdown Timer Component
const CountdownTimer = memo(({ 
  targetDate, 
  className = '' 
}: { 
  targetDate: string; 
  className?: string;
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }
      
      return null;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return null;

  return (
    <div className={`flex items-center gap-1.5 sm:gap-2 ${className}`}>
      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
      <div className="flex items-center gap-0.5 sm:gap-1 text-xs sm:text-sm">
        {timeLeft.days > 0 && (
          <>
            <span className="font-medium">{timeLeft.days}</span>
            <span className="text-gray-500 dark:text-gray-400">d</span>
          </>
        )}
        <span className="font-medium">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="text-gray-500 dark:text-gray-400">h</span>
        <span className="font-medium">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="text-gray-500 dark:text-gray-400">m</span>
        <span className="font-medium">{String(timeLeft.seconds).padStart(2, '0')}</span>
        <span className="text-gray-500 dark:text-gray-400">s</span>
      </div>
    </div>
  );
});

CountdownTimer.displayName = 'CountdownTimer';

// Enhanced Demo Class Card Component
const DemoClassCard = memo(({ 
  demoClass, 
  onViewDetails,
  onSetReminder,
  onRemoveReminder
}: { 
  demoClass: DemoClass; 
  onViewDetails: (demoClass: DemoClass) => void;
  onSetReminder: (demoClass: DemoClass) => void;
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
      return `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (classDate.getTime() === tomorrow.getTime()) {
      return `Tomorrow at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'border-l-red-500 bg-red-50/50 dark:bg-red-900/10';
      case 'starting_soon':
        return 'border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10';
      case 'upcoming':
        return 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10';
      case 'completed':
        return 'border-l-green-500 bg-green-50/50 dark:bg-green-900/10';
      default:
        return 'border-l-slate-500 bg-slate-50/50 dark:bg-slate-900/10';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return (
          <span className="flex items-center gap-1 text-red-700 dark:text-red-400 bg-red-100/50 dark:bg-red-900/30 px-2.5 py-1 rounded-full text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Live Now
          </span>
        );
      case 'starting_soon':
        return (
          <span className="flex items-center gap-1 text-yellow-700 dark:text-yellow-400 bg-yellow-100/50 dark:bg-yellow-900/30 px-2.5 py-1 rounded-full text-xs font-medium">
            <Timer className="w-3 h-3" />
            Starting Soon
          </span>
        );
      case 'upcoming':
        return (
          <span className="flex items-center gap-1 text-blue-700 dark:text-blue-400 bg-blue-100/50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full text-xs font-medium">
            <Calendar className="w-3 h-3" />
            Upcoming
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center gap-1 text-green-700 dark:text-green-400 bg-green-100/50 dark:bg-green-900/30 px-2.5 py-1 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`
        relative p-4 sm:p-5 md:p-6 rounded-xl border-l-4 shadow-sm hover:shadow-md transition-all duration-300
        bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700
        ${getStatusColor(demoClass.status || 'upcoming')}
      `}
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-1 line-clamp-2">
            {demoClass.title}
          </h3>
          {demoClass.instructor && (
            <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mb-2">
              <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">{demoClass.instructor.name}</span>
              {demoClass.instructor.rating && (
                <span className="flex items-center gap-0.5 text-yellow-500 flex-shrink-0">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-xs">{demoClass.instructor.rating}</span>
                </span>
              )}
            </p>
          )}
        </div>
        <div className="flex-shrink-0">
          {getStatusBadge(demoClass.status || 'upcoming')}
        </div>
      </div>

      {/* Date and Countdown Section */}
      {demoClass.scheduledDate && (
        <div className="mb-4 space-y-2">
          <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{formatDate(demoClass.scheduledDate)}</span>
          </div>
          {demoClass.status === 'upcoming' && (
            <CountdownTimer 
              targetDate={demoClass.scheduledDate} 
              className="text-sm text-slate-500 dark:text-slate-400"
            />
          )}
        </div>
      )}

      {/* Participants Section */}
      {demoClass.participants !== undefined && (
        <div className="flex items-center text-sm text-slate-600 dark:text-slate-300 mb-4">
          <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
          <span className="text-xs sm:text-sm">
            {demoClass.participants} / {demoClass.maxParticipants || '∞'} Participants
          </span>
        </div>
      )}

      {/* Action Buttons Section - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
        {/* Primary Action Button */}
        {demoClass.status === 'live' && demoClass.meetingLink && (
          <button 
            onClick={() => window.open(demoClass.meetingLink, '_blank')}
            className="w-full sm:flex-1 inline-flex items-center justify-center px-4 py-3 sm:py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors min-h-[44px]"
          >
            <Play className="w-4 h-4 mr-2" />
            Join Now
          </button>
        )}
        
        {/* Details Button */}
        <button
          onClick={() => onViewDetails(demoClass)}
          className="w-full sm:flex-1 inline-flex items-center justify-center px-4 py-3 sm:py-2.5 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors min-h-[44px]"
        >
          <Eye className="w-4 h-4 mr-2" />
          Details
        </button>
        
        {/* Reminder Button */}
        {demoClass.status !== 'completed' && (
          <button
            onClick={() => demoClass.hasReminder ? onRemoveReminder(demoClass.id) : onSetReminder(demoClass)}
            className={`
              w-full sm:w-auto inline-flex items-center justify-center px-4 py-3 sm:py-2.5 text-sm font-medium rounded-lg transition-colors min-h-[44px]
              ${demoClass.hasReminder
                ? 'text-yellow-700 dark:text-yellow-400 bg-yellow-100/50 dark:bg-yellow-900/30 hover:bg-yellow-200/50 dark:hover:bg-yellow-900/40'
                : 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
              }
            `}
          >
            <Bell className="w-4 h-4 mr-2" />
            <span className="whitespace-nowrap">
              {demoClass.hasReminder ? 'Reminder Set' : 'Set Reminder'}
            </span>
          </button>
        )}
      </div>
    </motion.div>
  );
});

DemoClassCard.displayName = 'DemoClassCard';

// Demo Feedback Form Component
const DemoClassesDashboard: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4 p-8 text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Initializing...
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Please wait while we set up your dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4 p-8 text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Loading Dashboard
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Please wait while we load your dashboard...
            </p>
          </div>
        </div>
      </div>
    }>
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
        <StudentDemoClasses />
      </StudentDashboardLayout>
    </Suspense>
  );
};

const StudentDemoClasses: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [demoClasses, setDemoClasses] = useState<DemoClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<DemoClass | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  // Load reminders from localStorage
  const loadReminders = useCallback(() => {
    try {
      const storedReminders = localStorage.getItem('demoClassReminders');
      if (storedReminders) {
        setReminders(JSON.parse(storedReminders));
      }
    } catch (error) {
      console.error('Error loading reminders:', error);
    }
  }, []);

  // Save reminders to localStorage
  const saveReminders = useCallback((newReminders: Reminder[]) => {
    try {
      localStorage.setItem('demoClassReminders', JSON.stringify(newReminders));
      setReminders(newReminders);
    } catch (error) {
      console.error('Error saving reminders:', error);
    }
  }, []);

  // Create multiple reminders for a demo class
  const createMultipleReminders = useCallback((demoClass: DemoClass) => {
    if (!demoClass.scheduledDate) return;

    const classDate = new Date(demoClass.scheduledDate);
    const remindersToCreate: Reminder[] = [
      { minutes: 60, label: '1 hour before' },
      { minutes: 30, label: '30 minutes before' },
      { minutes: 15, label: '15 minutes before' },
      { minutes: 5, label: '5 minutes before' }
    ].map(({ minutes, label }) => {
      const reminderDate = new Date(classDate.getTime() - minutes * 60000);
      return {
        classId: demoClass.id,
        classTitle: demoClass.title,
        scheduledDate: demoClass.scheduledDate,
        reminderTime: minutes,
        reminderDateTime: reminderDate.toISOString(),
        isActive: true
      };
    });

    const existingReminders = reminders.filter(r => r.classId !== demoClass.id);
    const updatedReminders = [...existingReminders, ...remindersToCreate];
    saveReminders(updatedReminders);

    // Update the demo class to show reminder is set
    setDemoClasses(prev => prev.map(cls => 
      cls.id === demoClass.id ? { ...cls, hasReminder: true } : cls
    ));

    toast.success('Reminders set successfully!');
  }, [reminders, saveReminders]);

  // Remove all reminders for a demo class
  const removeReminder = useCallback((classId: string) => {
    const updatedReminders = reminders.filter(r => r.classId !== classId);
    saveReminders(updatedReminders);

    // Update the demo class to show reminder is removed
    setDemoClasses(prev => prev.map(cls => 
      cls.id === classId ? { ...cls, hasReminder: false } : cls
    ));

    toast.success('Reminders removed successfully!');
  }, [reminders, saveReminders]);

  // Check for active reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const activeReminders = reminders.filter(reminder => {
        const reminderTime = new Date(reminder.reminderDateTime);
        const timeDiff = now.getTime() - reminderTime.getTime();
        return timeDiff >= 0 && timeDiff <= 60000 && reminder.isActive; // Within 1 minute
      });

      activeReminders.forEach(reminder => {
        toast.success(
          `Demo class "${reminder.classTitle}" starts in ${reminder.reminderTime} minutes!`,
          { duration: 10000 }
        );
        
        // Mark reminder as shown
        const updatedReminders = reminders.map(r => 
          r.classId === reminder.classId && r.reminderTime === reminder.reminderTime
            ? { ...r, isActive: false }
            : r
        );
        saveReminders(updatedReminders);
      });
    };

    const interval = setInterval(checkReminders, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [reminders, saveReminders]);

  // Load initial data
  useEffect(() => {
    loadReminders();
    
    // Simulate loading demo classes
    const timer = setTimeout(() => {
      setDemoClasses([]);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [loadReminders]);

  // Update demo classes with reminder status
  useEffect(() => {
    const classesWithReminders = demoClasses.map(cls => ({
      ...cls,
      hasReminder: reminders.some(r => r.classId === cls.id)
    }));
    
    if (JSON.stringify(classesWithReminders) !== JSON.stringify(demoClasses)) {
      setDemoClasses(classesWithReminders);
    }
  }, [reminders]); // Remove demoClasses from deps to avoid infinite loop

  // Filter demo classes based on selected tab and search query
  const filteredClasses = useMemo(() => {
    return demoClasses.filter(demoClass => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        demoClass.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        demoClass.instructor?.name.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Tab filter
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      const classDate = new Date(demoClass.scheduledDate);

      switch (selectedTab) {
        case 'today':
          return classDate >= today && classDate < tomorrow;
        case 'live_soon':
          return demoClass.status === 'live' || demoClass.status === 'starting_soon';
        case 'this_week':
          return classDate >= today && classDate <= nextWeek;
        case 'all':
        default:
          return true;
      }
    });
  }, [demoClasses, searchQuery, selectedTab]);

  // Calculate counts for tabs
  const classCounts = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    return {
      all: demoClasses.length,
      today: demoClasses.filter(cls => {
        const classDate = new Date(cls.scheduledDate);
        return classDate >= today && classDate < tomorrow;
      }).length,
      live_soon: demoClasses.filter(cls => 
        cls.status === 'live' || cls.status === 'starting_soon'
      ).length,
      this_week: demoClasses.filter(cls => {
        const classDate = new Date(cls.scheduledDate);
        return classDate >= today && classDate <= nextWeek;
      }).length
    };
  }, [demoClasses]);

  const handleViewDetails = (demoClass: DemoClass) => {
    setSelectedClass(demoClass);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedClass(null);
  };

  const handleSetReminder = (demoClass: DemoClass) => {
    createMultipleReminders(demoClass);
  };

  const LoadingState = () => (
    <div className="space-y-6">
      <div className="animate-pulse space-y-6">
        <div className="h-8 sm:h-10 bg-slate-200 dark:bg-slate-700 rounded-xl w-1/2 sm:w-1/3 mx-auto"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-6 space-y-4">
              <div className="h-5 sm:h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-3/4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/2"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-2/3"></div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <div className="h-11 bg-slate-200 dark:bg-slate-700 rounded-lg w-full sm:w-1/3"></div>
                <div className="h-11 bg-slate-200 dark:bg-slate-700 rounded-lg w-full sm:w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ErrorState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] text-center px-4">
      <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 mb-4" strokeWidth={1.5} />
      <h3 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
        Error loading classes
      </h3>
      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
        {message}
      </p>
    </div>
  );

  if (error) {
    return (
      <ErrorState message={error} />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="space-y-6 sm:space-y-8 lg:space-y-10">
        {/* Header Section - Mobile Optimized */}
        <div className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <MonitorPlay className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" strokeWidth={1.75} />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 dark:text-slate-100">
              Demo Classes
            </h1>
          </div>
          <p className="text-base sm:text-lg font-medium text-slate-600 dark:text-slate-300 px-4">
            Manage and track your demo class sessions
          </p>
        </div>

        {/* Search Section - Mobile Optimized */}
        <div className="max-w-lg mx-auto px-4 sm:px-0">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search classes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 sm:pl-12 pr-4 py-3 sm:py-3.5 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Tabs - Mobile Optimized with Horizontal Scroll */}
        <div className="flex justify-center px-4 sm:px-0">
          <div className="flex gap-2 sm:gap-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl p-1 sm:p-1.5 overflow-x-auto scrollbar-hide max-w-full">
            <div className="flex gap-2 sm:gap-3 min-w-max">
              {tabs.map((tab) => (
                <TabButton
                  key={tab.id}
                  tab={{
                    ...tab,
                    count: classCounts[tab.id as keyof typeof classCounts]
                  }}
                  isActive={selectedTab === tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content - Mobile Optimized Grid */}
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : filteredClasses.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredClasses.map((demoClass) => (
                <DemoClassCard
                  key={demoClass.id}
                  demoClass={demoClass}
                  onViewDetails={handleViewDetails}
                  onSetReminder={handleSetReminder}
                  onRemoveReminder={removeReminder}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] text-center px-4">
            <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400 mb-4" strokeWidth={1.5} />
            <h3 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
              No classes found
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-md">
              {searchQuery
                ? "No classes match your search criteria"
                : "No demo classes scheduled at the moment"}
            </p>
          </div>
        )}

        {/* Details Modal */}
        {showModal && selectedClass && (
          <DemoClassDetails
            demoClass={selectedClass}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};

const DemoClassDetails = memo(({ 
  demoClass, 
  onClose 
}: { 
  demoClass: DemoClass; 
  onClose: () => void;
}) => {
  const [isAddingToCalendar, setIsAddingToCalendar] = useState(false);

  const handleAddToCalendar = async () => {
    try {
      setIsAddingToCalendar(true);
      const eventData = createCalendarEvent(demoClass);
      await openGoogleCalendar(eventData);
      toast.success('Added to Google Calendar');
    } catch (error) {
      console.error('Error adding to calendar:', error);
      toast.error('Failed to add to calendar');
    } finally {
      setIsAddingToCalendar(false);
    }
  };

  const handleDownloadICS = async () => {
    try {
      setIsAddingToCalendar(true);
      const eventData = createCalendarEvent(demoClass);
      await downloadICSFile(eventData);
      toast.success('Calendar file downloaded');
    } catch (error) {
      console.error('Error downloading calendar file:', error);
      toast.error('Failed to download calendar file');
    } finally {
      setIsAddingToCalendar(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-auto">
        {/* Close Button */}
        <div className="sticky top-0 right-0 z-10 flex justify-end p-4 bg-white dark:bg-gray-800">
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 sm:px-6 pb-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {demoClass.title}
              </h2>
              {demoClass.instructor && (
                <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{demoClass.instructor.name}</span>
                  {demoClass.instructor.rating && (
                    <span className="flex items-center gap-0.5 text-yellow-500">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-sm">{demoClass.instructor.rating}</span>
                    </span>
                  )}
                </p>
              )}
            </div>
            <div className="flex-shrink-0">
              {getStatusBadge(demoClass.status || 'upcoming')}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm sm:text-base">{formatDate(demoClass.scheduledDate)}</span>
            </div>

            {demoClass.duration && (
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-sm sm:text-base">{demoClass.duration} minutes</span>
              </div>
            )}

            {demoClass.participants !== undefined && (
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-sm sm:text-base">
                  {demoClass.participants} / {demoClass.maxParticipants || '∞'} Participants
                </span>
              </div>
            )}

            {demoClass.description && (
              <div className="text-gray-600 dark:text-gray-300">
                <p className="text-sm sm:text-base leading-relaxed">{demoClass.description}</p>
              </div>
            )}
          </div>

          {/* Action Buttons - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row gap-3">
            {demoClass.status === 'live' && demoClass.meetingLink && (
              <button
                onClick={() => window.open(demoClass.meetingLink, '_blank')}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors min-h-[44px]"
              >
                <Play className="w-4 h-4 mr-2" />
                Join Now
              </button>
            )}

            <button
              onClick={handleAddToCalendar}
              disabled={isAddingToCalendar}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors min-h-[44px]"
            >
              {isAddingToCalendar ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Calendar className="w-4 h-4 mr-2" />
              )}
              Add to Google Calendar
            </button>

            <button
              onClick={handleDownloadICS}
              disabled={isAddingToCalendar}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors min-h-[44px]"
            >
              {isAddingToCalendar ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Download ICS File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

DemoClassDetails.displayName = 'DemoClassDetails';

// Utility functions
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long', 
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'live':
      return (
        <span className="flex items-center gap-1 text-red-700 dark:text-red-400 bg-red-100/50 dark:bg-red-900/30 px-2.5 py-1 rounded-full text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          Live Now
        </span>
      );
    case 'starting_soon':
      return (
        <span className="flex items-center gap-1 text-yellow-700 dark:text-yellow-400 bg-yellow-100/50 dark:bg-yellow-900/30 px-2.5 py-1 rounded-full text-xs font-medium">
          <Timer className="w-3 h-3" />
          Starting Soon
        </span>
      );
    case 'upcoming':
      return (
        <span className="flex items-center gap-1 text-blue-700 dark:text-blue-400 bg-blue-100/50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full text-xs font-medium">
          <Calendar className="w-3 h-3" />
          Upcoming
        </span>
      );
    case 'completed':
      return (
        <span className="flex items-center gap-1 text-green-700 dark:text-green-400 bg-green-100/50 dark:bg-green-900/30 px-2.5 py-1 rounded-full text-xs font-medium">
          <CheckCircle className="w-3 h-3" />
          Completed
        </span>
      );
    default:
      return null;
  }
};

const createCalendarEvent = (demoClass: DemoClass): SessionData => {
  const startTime = new Date(demoClass.scheduledDate).toISOString();
  const endTime = new Date(new Date(demoClass.scheduledDate).getTime() + (demoClass.duration || 60) * 60000).toISOString();
  
  return {
    title: demoClass.title,
    description: `Demo class for ${demoClass.title} with ${demoClass.instructor?.name || 'instructor'}`,
    startTime,
    duration: demoClass.duration || 60,
    location: demoClass.location || 'Online',
    meetingLink: demoClass.meetingLink,
    isOnline: true,
    session_id: demoClass.id,
    session_date: startTime,
    session_end_date: endTime
  };
};

export default DemoClassesDashboard; 
