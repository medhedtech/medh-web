"use client";
import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Search, Calendar, Clock, Star, Eye, Play, Users, User, FileText, 
  Video, MonitorPlay, Globe, AlertCircle, Loader2, ChevronRight, Check,
  ExternalLink, Wifi, WifiOff, RefreshCw, Filter, SortAsc, Bell,
  BookOpen, Award, Zap, Timer, MapPin, Phone, Mail, UserCheck
} from "lucide-react";
import StudentDashboardLayout from "./StudentDashboardLayout";
import { batchAPI } from "@/apis/batch";
import { buildAdvancedComponent, getResponsive, getEnhancedSemanticColor } from "@/utils/designSystem";

// Enhanced interfaces based on batch API
interface LiveSession {
  session_id: string;
  session_date: string;
  session_end_date: string;
  date: string;
  start_time: string;
  end_time: string;
  title: string;
  description: string;
  batch: {
    id: string;
    name: string;
    code: string;
    status: string;
    start_date: string;
    end_date: string;
  };
  course: {
    id: string;
    title: string;
  };
  instructor: {
    _id: string;
    full_name: string;
    email: string;
  };
  has_recorded_lessons: boolean;
  enrollment_status: string;
  is_upcoming: boolean;
  zoom_meeting?: {
    id: string;
    join_url: string;
    password?: string;
  };
}

interface UpcomingSessionsResponse {
  success: boolean;
  count: number;
  total_upcoming: number;
  active_batches: number;
  upcoming_batches: number;
  total_batches: number;
  days_ahead: number;
  search_period: {
    from: string;
    to: string;
  };
  student: {
    id: string;
    name: string;
    email: string;
  };
  data: LiveSession[];
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
  isLive?: boolean;
}

// Enhanced TabButton with glassmorphism design
const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children, count, isLive }) => (
  <motion.button
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`relative inline-flex items-center px-6 py-3 text-sm font-medium rounded-2xl transition-all duration-300 overflow-hidden group ${
      active
        ? isLive 
          ? buildAdvancedComponent.glassButton({ variant: 'danger', size: 'md' })
          : buildAdvancedComponent.glassButton({ variant: 'primary', size: 'md' })
        : isLive
        ? 'bg-red-50/80 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200/50 dark:border-red-700/50 backdrop-blur-sm hover:bg-red-100/80'
        : 'bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-gray-700/80 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm'
    }`}
  >
    {/* Live pulse animation */}
    {isLive && (
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10 animate-pulse rounded-2xl"></div>
    )}
    
    <span className="relative z-10 flex items-center gap-2">
      {children}
      {isLive && (
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
      )}
      {count !== undefined && count > 0 && (
        <span className={`inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold rounded-full ${
          active 
            ? 'bg-white/20 text-white backdrop-blur-sm' 
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

// Enhanced Live Session Card Component
const LiveSessionCard = ({ 
  session, 
  onJoinSession,
  onViewDetails 
}: { 
  session: LiveSession; 
  onJoinSession: (session: LiveSession) => void;
  onViewDetails: (session: LiveSession) => void;
}) => {
  const formatTime = (timeString: string) => {
    try {
      const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return timeString;
    }
  };

  const getTimeUntilStart = () => {
    const now = new Date();
    const sessionDateTime = new Date(`${session.date}T${session.start_time}`);
    const diffMs = sessionDateTime.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins <= 0) return "Starting now";
    if (diffMins < 60) return `Starts in ${diffMins} min`;
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    return `Starts in ${hours}h ${minutes}m`;
  };

  const getSessionStatus = () => {
    const now = new Date();
    const sessionStart = new Date(`${session.date}T${session.start_time}`);
    const sessionEnd = new Date(`${session.date}T${session.end_time}`);
    
    if (now >= sessionStart && now <= sessionEnd) {
      return { status: 'live', label: 'Live Now', color: 'red' };
    } else if (sessionStart > now) {
      const diffMins = Math.floor((sessionStart.getTime() - now.getTime()) / (1000 * 60));
      if (diffMins <= 15) {
        return { status: 'starting-soon', label: 'Starting Soon', color: 'yellow' };
      }
      return { status: 'upcoming', label: 'Upcoming', color: 'blue' };
    }
    return { status: 'ended', label: 'Ended', color: 'gray' };
  };

  const status = getSessionStatus();

  const getStatusStripe = (color: string) => {
    switch (color) {
      case 'red':
        return 'bg-gradient-to-r from-red-500 to-red-600';
      case 'yellow':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
      case 'blue':
        return 'bg-gradient-to-r from-blue-500 to-blue-600';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500';
    }
  };

  const canJoinSession = status.status === 'live' || status.status === 'starting-soon';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={buildAdvancedComponent.glassCard({ variant: 'primary', hover: true }) + " relative overflow-hidden"}
    >
      {/* Status stripe */}
      <div className={`w-full h-1 ${getStatusStripe(status.color)} rounded-t-2xl mb-6 -mt-6 -mx-6`}></div>
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className={getResponsive.fluidText('subheading') + " font-semibold text-gray-900 dark:text-gray-100 mb-2 truncate"}>
            {session.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {session.course.title}
          </p>
          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(session.date).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {formatTime(session.start_time)} - {formatTime(session.end_time)}
            </div>
          </div>
        </div>
        
        {/* Status indicator */}
        <div className="flex flex-col items-end space-y-2">
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
            status.color === 'red' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
            status.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
            status.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
            'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
          }`}>
            {status.status === 'live' && <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></span>}
            {status.status === 'starting-soon' && <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-1 animate-pulse"></span>}
            {status.label}
          </span>
          
          {status.status === 'upcoming' && (
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <Timer className="w-3 h-3 mr-1" />
              {getTimeUntilStart()}
            </div>
          )}
        </div>
      </div>
        
      {/* Instructor info */}
      <div className="flex items-center mb-4 p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
          <UserCheck className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {session.instructor.full_name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            Instructor
          </p>
        </div>
      </div>

      {/* Batch info */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center">
            <BookOpen className="w-3 h-3 mr-1" />
            Batch: {session.batch.code}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            session.batch.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
            'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
          }`}>
            {session.batch.status}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        {canJoinSession && session.zoom_meeting ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onJoinSession(session)}
            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
              status.status === 'live' 
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40'
                : 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25 hover:shadow-green-500/40'
            }`}
          >
            <Play className="w-4 h-4 mr-2" />
            {status.status === 'live' ? 'Join Live' : 'Join Soon'}
          </motion.button>
        ) : (
          <div className="flex-1 flex items-center justify-center px-4 py-3 rounded-xl font-medium text-sm bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            <WifiOff className="w-4 h-4 mr-2" />
            Not Available
          </div>
        )}
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onViewDetails(session)}
          className="px-4 py-3 rounded-xl font-medium text-sm bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-700 transition-all duration-200"
        >
          <Eye className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Recorded lessons indicator */}
      {session.has_recorded_lessons && (
        <div className="mt-3 flex items-center text-xs text-blue-600 dark:text-blue-400">
          <Video className="w-3 h-3 mr-1" />
          Recorded lessons available
        </div>
      )}
    </motion.div>
  );
};

// Session Details Modal
const SessionDetailsModal = ({ 
  session, 
  isOpen, 
  onClose, 
  onJoinSession 
}: { 
  session: LiveSession | null; 
  isOpen: boolean; 
  onClose: () => void;
  onJoinSession: (session: LiveSession) => void;
}) => {
  if (!session) return null;

  const formatTime = (timeString: string) => {
    try {
      const time = new Date(`2000-01-01T${timeString}`);
      return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return timeString;
    }
  };

  const getSessionStatus = () => {
    const now = new Date();
    const sessionStart = new Date(`${session.date}T${session.start_time}`);
    const sessionEnd = new Date(`${session.date}T${session.end_time}`);
    
    if (now >= sessionStart && now <= sessionEnd) {
      return { status: 'live', label: 'Live Now', color: 'red' };
    } else if (sessionStart > now) {
      const diffMins = Math.floor((sessionStart.getTime() - now.getTime()) / (1000 * 60));
      if (diffMins <= 15) {
        return { status: 'starting-soon', label: 'Starting Soon', color: 'yellow' };
      }
      return { status: 'upcoming', label: 'Upcoming', color: 'blue' };
    }
    return { status: 'ended', label: 'Ended', color: 'gray' };
  };

  const status = getSessionStatus();
  const canJoinSession = status.status === 'live' || status.status === 'starting-soon';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={buildAdvancedComponent.glassCard({ variant: 'primary' }) + " w-full max-w-2xl max-h-[90vh] overflow-y-auto"}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className={getResponsive.fluidText('heading') + " font-bold text-gray-900 dark:text-gray-100"}>
                Session Details
              </h2>
        <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
        </button>
      </div>

            {/* Status banner */}
            <div className={`p-4 rounded-xl mb-6 ${
              status.color === 'red' ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700' :
              status.color === 'yellow' ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700' :
              status.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700' :
              'bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-700'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {status.status === 'live' && <Wifi className="w-5 h-5 text-red-500 mr-2 animate-pulse" />}
                  {status.status === 'starting-soon' && <Bell className="w-5 h-5 text-yellow-500 mr-2 animate-bounce" />}
                  {status.status === 'upcoming' && <Clock className="w-5 h-5 text-blue-500 mr-2" />}
                  <span className={`font-medium ${
                    status.color === 'red' ? 'text-red-700 dark:text-red-300' :
                    status.color === 'yellow' ? 'text-yellow-700 dark:text-yellow-300' :
                    status.color === 'blue' ? 'text-blue-700 dark:text-blue-300' :
                    'text-gray-700 dark:text-gray-300'
                  }`}>
                    {status.label}
                  </span>
                </div>
                {canJoinSession && session.zoom_meeting && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onJoinSession(session)}
                    className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                      status.status === 'live' 
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    <ExternalLink className="w-4 h-4 mr-2 inline" />
                    Join Session
                  </motion.button>
                )}
              </div>
            </div>

            {/* Session information */}
            <div className="space-y-6">
              {/* Basic info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  {session.title}
                </h3>
                {session.description && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {session.description}
                  </p>
                )}
              </div>

              {/* Time and date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl">
                  <div className="flex items-center mb-2">
                    <Calendar className="w-4 h-4 text-blue-500 mr-2" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">Date</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {new Date(session.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl">
                  <div className="flex items-center mb-2">
                    <Clock className="w-4 h-4 text-green-500 mr-2" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">Time</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {formatTime(session.start_time)} - {formatTime(session.end_time)}
                  </p>
                </div>
              </div>

              {/* Course and batch info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl">
                  <div className="flex items-center mb-2">
                    <BookOpen className="w-4 h-4 text-purple-500 mr-2" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">Course</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {session.course.title}
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl">
                  <div className="flex items-center mb-2">
                    <Users className="w-4 h-4 text-orange-500 mr-2" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">Batch</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {session.batch.name} ({session.batch.code})
                  </p>
                </div>
              </div>

              {/* Instructor info */}
              <div className="p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl">
                <div className="flex items-center mb-3">
                  <UserCheck className="w-4 h-4 text-indigo-500 mr-2" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">Instructor</span>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mr-3">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {session.instructor.full_name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <Mail className="w-3 h-3 mr-1" />
                      {session.instructor.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional info */}
              {session.has_recorded_lessons && (
                <div className="p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center">
                    <Video className="w-4 h-4 text-blue-500 mr-2" />
                    <span className="text-blue-700 dark:text-blue-300 font-medium">
                      Recorded lessons available for this session
                    </span>
                  </div>
                </div>
              )}
    </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Main Student Join Live Component
const StudentJoinLive: React.FC = () => {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<LiveSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'live' | 'upcoming' | 'today'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSession, setSelectedSession] = useState<LiveSession | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    total_upcoming: 0,
    active_batches: 0,
    upcoming_batches: 0,
    total_batches: 0,
    live_count: 0,
    today_count: 0
  });

  // Get student ID from localStorage
  const getStudentId = useCallback(() => {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('userId') || localStorage.getItem('studentId');
      return userId || 'demo-student-123'; // Fallback for demo
    }
    return 'demo-student-123';
  }, []);

  // Fetch upcoming sessions from batch API
  const fetchUpcomingSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const studentId = getStudentId();
      const response = await batchAPI.getStudentUpcomingSessions(studentId, {
        limit: 50,
        days_ahead: 30
      });

      if (response && response.data) {
        const sessionData = response.data;
        setSessions(sessionData.data || []);
        setSessionStats({
          total_upcoming: sessionData.total_upcoming || 0,
          active_batches: sessionData.active_batches || 0,
          upcoming_batches: sessionData.upcoming_batches || 0,
          total_batches: sessionData.total_batches || 0,
          live_count: (sessionData.data || []).filter(s => {
            const now = new Date();
            const start = new Date(`${s.date}T${s.start_time}`);
            const end = new Date(`${s.date}T${s.end_time}`);
            return now >= start && now <= end;
          }).length,
          today_count: (sessionData.data || []).filter(s => {
            const today = new Date().toDateString();
            const sessionDate = new Date(s.date).toDateString();
            return today === sessionDate;
          }).length
        });
      } else {
        // Handle unsuccessful response without throwing
        console.warn('API response was not in expected format:', response);
        setError('Unable to fetch sessions. Please try again later.');
        
        // Fallback to mock data for demo
        provideMockData();
      }
    } catch (err: any) {
      console.error('Error fetching sessions:', err);
      setError(err.message || 'Failed to load sessions');
      
      // Fallback to mock data for demo
      provideMockData();
    } finally {
      setIsLoading(false);
    }
  }, [getStudentId]);

  // Helper function to provide mock data
  const provideMockData = () => {
    const mockSessions: LiveSession[] = [
      {
        session_id: 'session-1',
        session_date: new Date().toISOString(),
        session_end_date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        date: new Date().toISOString().split('T')[0],
        start_time: new Date(Date.now() + 10 * 60 * 1000).toTimeString().slice(0, 5),
        end_time: new Date(Date.now() + 70 * 60 * 1000).toTimeString().slice(0, 5),
        title: 'Introduction to React Hooks',
        description: 'Learn the fundamentals of React hooks and state management',
        batch: {
          id: 'batch-1',
          name: 'React Development Batch',
          code: 'RDB-001',
          status: 'Active',
          start_date: '2024-01-01',
          end_date: '2024-06-30'
        },
        course: {
          id: 'course-1',
          title: 'Full Stack Web Development'
        },
        instructor: {
          _id: 'instructor-1',
          full_name: 'John Smith',
          email: 'john.smith@medh.com'
        },
        has_recorded_lessons: true,
        enrollment_status: 'active',
        is_upcoming: true,
        zoom_meeting: {
          id: 'zoom-123',
          join_url: 'https://zoom.us/j/123456789',
          password: 'demo123'
        }
      }
    ];
    
    setSessions(mockSessions);
    setSessionStats({
      total_upcoming: 1,
      active_batches: 1,
      upcoming_batches: 0,
      total_batches: 1,
      live_count: 0,
      today_count: 1
    });
  };

  // Filter sessions based on active tab and search query
  useEffect(() => {
    let filtered = sessions;
    
    // Filter by tab
    if (activeTab === 'live') {
      filtered = filtered.filter(session => {
        const now = new Date();
        const start = new Date(`${session.date}T${session.start_time}`);
        const end = new Date(`${session.date}T${session.end_time}`);
        return now >= start && now <= end;
      });
    } else if (activeTab === 'upcoming') {
      filtered = filtered.filter(session => {
        const now = new Date();
        const start = new Date(`${session.date}T${session.start_time}`);
        return start > now;
      });
    } else if (activeTab === 'today') {
      filtered = filtered.filter(session => {
        const today = new Date().toDateString();
        const sessionDate = new Date(session.date).toDateString();
        return today === sessionDate;
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(session =>
        session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.instructor.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.batch.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredSessions(filtered);
  }, [sessions, activeTab, searchQuery]);

  // Load sessions on component mount
  useEffect(() => {
    fetchUpcomingSessions();
  }, [fetchUpcomingSessions]);

  // Handle joining a session
  const handleJoinSession = useCallback((session: LiveSession) => {
    if (session.zoom_meeting?.join_url) {
      window.open(session.zoom_meeting.join_url, '_blank');
    } else {
      alert('Meeting link not available');
    }
  }, []);

  // Handle viewing session details
  const handleViewDetails = useCallback((session: LiveSession) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  }, []);

  // Handle closing modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedSession(null);
  }, []);

  // Refresh sessions
  const handleRefresh = useCallback(() => {
    fetchUpcomingSessions();
  }, [fetchUpcomingSessions]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-12">
        {/* Header */}
        <div className={buildAdvancedComponent.glassCard({ variant: 'hero' }) + " mb-8"}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className={getResponsive.fluidText('heading') + " font-bold text-gray-900 dark:text-gray-100 mb-2"}>
                Join Live Classes
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Access your scheduled live sessions and interactive classes
              </p>
            </div>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {sessionStats.total_upcoming}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Upcoming Sessions
                </div>
              </div>
              
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {sessionStats.active_batches}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Active Batches
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className={buildAdvancedComponent.glassCard({ variant: 'primary' }) + " mb-8"}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
                placeholder="Search sessions, courses, or instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/70 dark:bg-gray-800/70 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
              />
        </div>

            {/* Refresh button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={isLoading}
              className="px-4 py-3 bg-white/70 dark:bg-gray-800/70 border border-gray-200/50 dark:border-gray-700/50 rounded-xl hover:bg-white/90 dark:hover:bg-gray-700/90 transition-all duration-200 backdrop-blur-sm"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          <TabButton
            active={activeTab === 'all'}
            onClick={() => setActiveTab('all')}
            count={sessions.length}
          >
            <Globe className="w-4 h-4" />
            All Sessions
          </TabButton>
          
          <TabButton
            active={activeTab === 'live'}
            onClick={() => setActiveTab('live')}
            count={sessionStats.live_count}
            isLive={sessionStats.live_count > 0}
          >
            <Wifi className="w-4 h-4" />
            Live Now
          </TabButton>
          
          <TabButton
            active={activeTab === 'upcoming'}
            onClick={() => setActiveTab('upcoming')}
            count={sessionStats.total_upcoming}
          >
            <Clock className="w-4 h-4" />
            Upcoming
          </TabButton>
          
          <TabButton
            active={activeTab === 'today'}
            onClick={() => setActiveTab('today')}
            count={sessionStats.today_count}
          >
            <Calendar className="w-4 h-4" />
            Today
          </TabButton>
            </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white/60 dark:bg-gray-800/60 rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
                  </div>
        ) : error ? (
          <div className={buildAdvancedComponent.glassCard({ variant: 'primary' }) + " text-center py-12"}>
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Failed to Load Sessions
                  </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2 inline" />
              Try Again
                </motion.button>
                    </div>
        ) : filteredSessions.length === 0 ? (
          <div className={buildAdvancedComponent.glassCard({ variant: 'primary' }) + " text-center py-12"}>
            <MonitorPlay className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No Sessions Found
            </h3>
                      <p className="text-gray-600 dark:text-gray-400">
              {searchQuery.trim() 
                ? `No sessions match "${searchQuery}"`
                : `No ${activeTab === 'all' ? '' : activeTab + ' '}sessions available`
              }
                      </p>
                    </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredSessions.map((session) => (
                <LiveSessionCard
                  key={session.session_id}
                  session={session}
                  onJoinSession={handleJoinSession}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </AnimatePresence>
                      </div>
                    )}
      </div>

      {/* Session Details Modal */}
      <SessionDetailsModal
        session={selectedSession}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onJoinSession={handleJoinSession}
      />
    </div>
  );
};

// Main Dashboard Component
const JoinLiveDashboard: React.FC = () => {
  const [userState, setUserState] = useState({
    userRole: 'student',
    fullName: 'Student User',
    userEmail: 'student@example.com',
    userImage: '',
    userNotifications: 0,
    userSettings: {
      theme: 'light',
      language: 'en',
      notifications: true
    }
  });

  useEffect(() => {
    // Get user data from localStorage
    if (typeof window !== 'undefined') {
      const storedUserName = localStorage.getItem("userName") || "";
      const storedFullName = localStorage.getItem("fullName") || "";
      const storedEmail = localStorage.getItem("userEmail") || "";
      const storedName = storedUserName || storedFullName;
      
      if (storedName) {
        const firstName = storedName.split(' ')[0];
        const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
        
        setUserState(prev => ({
          ...prev,
          fullName: capitalizedFirstName,
          userEmail: storedEmail || prev.userEmail
        }));
      }
    }
  }, []);

  return (
    <StudentDashboardLayout 
      userRole={userState.userRole}
      fullName={userState.fullName}
      userEmail={userState.userEmail}
      userImage={userState.userImage}
      userNotifications={userState.userNotifications}
      userSettings={userState.userSettings}
    >
      <StudentJoinLive />
    </StudentDashboardLayout>
  );
};

export default JoinLiveDashboard; 