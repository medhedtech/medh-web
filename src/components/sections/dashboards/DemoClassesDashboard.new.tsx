"use client";
import React, { useEffect, useState, memo, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Calendar, Clock, Star, Eye, Play, MonitorPlay, Users, User, FileText, Video, CheckCircle, RefreshCw, CalendarPlus, Award, BarChart, MessageSquare, ThumbsUp, TrendingUp, AlertCircle, Shield, Globe, Loader2, Bell, Timer, CalendarDays, ChevronRight, AlarmClock, Check, Trash2, Download } from "lucide-react";
import StudentDashboardLayout from "./StudentDashboardLayout";
import { toast } from 'react-hot-toast';
import { openGoogleCalendar, downloadICSFile, type SessionData } from '@/utils/googleCalendar';

interface DemoClass {
  id: string;
  title: string;
  instructor?: {
    name: string;
    rating: number;
  };
  category?: string;
  duration?: number;
  scheduledDate?: string;
  status?: 'upcoming' | 'live' | 'completed' | 'recorded';
  level?: 'beginner' | 'intermediate' | 'advanced';
  participants?: number;
  maxParticipants?: number;
  description?: string;
  meetingLink?: string;
  meetingId?: string;
  meetingPassword?: string;
  zoomMeeting?: {
    id?: string;
    join_url?: string;
    password?: string;
    topic?: string;
    start_time?: string;
    duration?: number;
    isZoomMeetingCreated?: boolean;
    settings?: any;
  };
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

interface Tab {
  name: string;
  content: DemoClass[];
  count?: number;
  isLive?: boolean;
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
    className={`relative inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 overflow-hidden group ${
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

  const getStatusInfo = (status?: string) => {
    switch (status) {
      case 'live':
        return {
          color: 'text-red-500 dark:text-red-400',
          bgColor: 'bg-red-100 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          icon: <Play className="w-4 h-4" />,
          text: 'Live Now'
        };
      case 'upcoming':
        return {
          color: 'text-blue-500 dark:text-blue-400',
          bgColor: 'bg-blue-100 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          icon: <Calendar className="w-4 h-4" />,
          text: 'Upcoming'
        };
      case 'completed':
        return {
          color: 'text-green-500 dark:text-green-400',
          bgColor: 'bg-green-100 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          icon: <CheckCircle className="w-4 h-4" />,
          text: 'Completed'
        };
      case 'recorded':
        return {
          color: 'text-purple-500 dark:text-purple-400',
          bgColor: 'bg-purple-100 dark:bg-purple-900/20',
          borderColor: 'border-purple-200 dark:border-purple-800',
          icon: <Video className="w-4 h-4" />,
          text: 'Recorded'
        };
      default:
        return {
          color: 'text-gray-500 dark:text-gray-400',
          bgColor: 'bg-gray-100 dark:bg-gray-800',
          borderColor: 'border-gray-200 dark:border-gray-700',
          icon: <Clock className="w-4 h-4" />,
          text: 'Not Scheduled'
        };
    }
  };

  const statusInfo = getStatusInfo(demoClass.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
    >
      {/* Status Badge */}
      <div className="flex items-center justify-between mb-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color} ${statusInfo.bgColor} border ${statusInfo.borderColor}`}>
          {statusInfo.icon}
          <span className="ml-2">{statusInfo.text}</span>
        </span>
        {demoClass.hasReminder && (
          <span className="text-yellow-500 dark:text-yellow-400">
            <Bell className="w-5 h-5" />
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
        {demoClass.title}
      </h3>

      {/* Instructor Info */}
      {demoClass.instructor && (
        <div className="flex items-center mb-3 text-sm text-gray-600 dark:text-gray-300">
          <User className="w-4 h-4 mr-2" />
          <span>{demoClass.instructor.name}</span>
          {demoClass.instructor.rating && (
            <div className="flex items-center ml-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="ml-1">{demoClass.instructor.rating}</span>
            </div>
          )}
        </div>
      )}

      {/* Schedule Info */}
      {demoClass.scheduledDate && (
        <div className="mb-3">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-1">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{formatDate(demoClass.scheduledDate)}</span>
          </div>
          {demoClass.status === 'upcoming' && (
            <CountdownTimer 
              targetDate={demoClass.scheduledDate} 
              className="text-sm"
            />
          )}
        </div>
      )}

      {/* Participants */}
      {demoClass.participants !== undefined && (
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-4">
          <Users className="w-4 h-4 mr-2" />
          <span>
            {demoClass.participants} / {demoClass.maxParticipants || '∞'} Participants
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mt-4">
        {demoClass.status === 'live' && demoClass.zoomMeeting?.join_url && (
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={demoClass.zoomMeeting.join_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors duration-200"
          >
            <Play className="w-4 h-4 mr-2" />
            Join Now
          </motion.a>
        )}

        {demoClass.status === 'upcoming' && (
          <>
            {!demoClass.hasReminder ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSetReminder(demoClass)}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-medium transition-colors duration-200"
              >
                <Bell className="w-4 h-4 mr-2" />
                Set Reminder
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onRemoveReminder(demoClass.id)}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors duration-200"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove Reminder
              </motion.button>
            )}
          </>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onViewDetails(demoClass)}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors duration-200"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </motion.button>
      </div>
    </motion.div>
  );
});

DemoClassCard.displayName = 'DemoClassCard';

// ... rest of the code ... 