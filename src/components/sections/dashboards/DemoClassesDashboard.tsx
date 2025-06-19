"use client";
import React, { useEffect, useState, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Calendar, Clock, Star, Eye, Play, MonitorPlay, Users, User, FileText, Video, CheckCircle, RefreshCw, CalendarPlus, Award, BarChart, MessageSquare, ThumbsUp, TrendingUp, AlertCircle, Shield, Globe } from "lucide-react";
import StudentDashboardLayout from "./StudentDashboardLayout";

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
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon?: string;
  description?: string;
  count?: number | null;
}

// Updated TabButton with icons and improved styling
const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children, icon, description, count }) => {
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'calendar-plus':
        return <CalendarPlus className="w-4 h-4" />;
      case 'calendar':
        return <Calendar className="w-4 h-4" />;
      case 'award':
        return <Award className="w-4 h-4" />;
      case 'star':
        return <Star className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
      title={description}
      className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 overflow-hidden group min-w-0 ${
      active
        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:shadow-lg'
        : 'glass-stats text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/20 dark:hover:bg-gray-700/20'
    }`}
  >
    {/* Animated background for active state */}
    {active && (
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 animate-gradient-x"></div>
    )}
    
    {/* Shimmer effect on hover */}
    <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100"></div>
    
      <div className="relative z-10 flex items-center space-x-2 group-hover:scale-105 transition-transform">
        {icon && getIcon(icon)}
        <span className="truncate">{children}</span>
        {typeof count === 'number' && count > 0 && (
          <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium ${
            active 
              ? 'bg-white/20 text-white' 
              : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
          }`}>
            {count}
          </span>
        )}
      </div>
  </motion.button>
);
};

// Zoom Meeting Details Component
const ZoomMeetingDetails: React.FC<{ 
  booking?: any; 
  selectedTimeSlot: string; 
  timeSlots: any[] 
}> = ({ booking, selectedTimeSlot, timeSlots }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Simple notification - you can enhance this with a toast library
    alert('Copied to clipboard!');
  };

  const zoomMeeting = booking?.zoomMeeting;
  const hasZoomMeeting = zoomMeeting?.isZoomMeetingCreated;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          🎥 Demo Booked Successfully!
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {hasZoomMeeting 
            ? "Your Zoom meeting is ready! Here are your meeting details:"
            : "Your demo booking was created successfully. Meeting details will be sent via email."
          }
        </p>
      </div>

      {/* Scheduled Time */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-center">
          <Calendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mr-3" />
          <p className="text-xl text-emerald-800 dark:text-emerald-200 font-semibold">
            📅 {timeSlots.find(slot => slot.id === selectedTimeSlot)?.label || 'Scheduled'}
          </p>
        </div>
      </div>

      {hasZoomMeeting ? (
        // Zoom Meeting Details
        <div className="space-y-6">
          {/* Meeting Info */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Video className="w-5 h-5 mr-2" />
              Zoom Meeting Details
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="info-item">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Meeting Topic:
                </label>
                <span className="text-gray-900 dark:text-white">
                  {zoomMeeting.topic || 'Demo Session'}
                </span>
              </div>
              
              <div className="info-item">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Duration:
                </label>
                <span className="text-gray-900 dark:text-white">
                  {zoomMeeting.duration || 60} minutes
                </span>
              </div>
              
              <div className="info-item">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Meeting ID:
                </label>
                <div className="flex items-center">
                  <span className="font-mono text-gray-900 dark:text-white mr-2">
                    {zoomMeeting.id}
                  </span>
                  <button
                    onClick={() => copyToClipboard(zoomMeeting.id)}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    title="Copy Meeting ID"
                  >
                    📋
                  </button>
                </div>
              </div>
              
              <div className="info-item">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Password:
                </label>
                <div className="flex items-center">
                  <span className="font-mono text-gray-900 dark:text-white mr-2">
                    {zoomMeeting.password}
                  </span>
                  <button
                    onClick={() => copyToClipboard(zoomMeeting.password)}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    title="Copy Password"
                  >
                    📋
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Join Meeting Button */}
          <div className="text-center">
            <a
              href={zoomMeeting.join_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 text-lg"
            >
              <Video className="w-6 h-6 mr-3" />
              Join Zoom Meeting
            </a>
            <button
              onClick={() => copyToClipboard(zoomMeeting.join_url)}
              className="ml-4 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              title="Copy Join URL"
            >
              📋 Copy Link
            </button>
          </div>

          {/* Meeting Features */}
          {zoomMeeting.settings && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
                Meeting Features:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {zoomMeeting.settings.waiting_room && (
                  <div className="flex items-center text-blue-800 dark:text-blue-200">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Waiting room enabled for security
                  </div>
                )}
                {zoomMeeting.settings.auto_recording === 'cloud' && (
                  <div className="flex items-center text-blue-800 dark:text-blue-200">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Cloud recording enabled
                  </div>
                )}
                {zoomMeeting.settings.host_video && (
                  <div className="flex items-center text-blue-800 dark:text-blue-200">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Host video enabled
                  </div>
                )}
                {zoomMeeting.settings.participant_video && (
                  <div className="flex items-center text-blue-800 dark:text-blue-200">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Participant video enabled
                  </div>
                )}
                {zoomMeeting.settings.mute_upon_entry && (
                  <div className="flex items-center text-blue-800 dark:text-blue-200">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Participants muted on entry
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-4">
              Next Steps:
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-emerald-800 dark:text-emerald-200">
              <li>Save the meeting details above</li>
              <li>You'll receive email confirmation with calendar invite</li>
              <li>Join the meeting 5 minutes before the scheduled time</li>
              <li>Our instructor will admit you from the waiting room</li>
              <li>Have your questions ready for the demo session</li>
            </ol>
          </div>
        </div>
      ) : (
        // No Zoom Meeting Created
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-3">
              <h4 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                Meeting Details Coming Soon
              </h4>
              <p className="text-yellow-800 dark:text-yellow-200 mb-4">
                Your demo booking was created successfully! Our team will contact you with meeting details shortly.
              </p>
              {zoomMeeting?.zoomMeetingError && (
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Technical note: {zoomMeeting.zoomMeetingError}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Email Confirmation Note */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          📧 A confirmation email with all details has been sent to your registered email address.
        </p>
      </div>
    </motion.div>
  );
};

// Demo Class Card Component - matching enrolled courses style
const DemoClassCard = ({ demoClass, onViewMaterials, onDemoAction }: { 
  demoClass: DemoClass; 
  onViewMaterials: (demoClass: DemoClass) => void;
  onDemoAction?: (demoClass: DemoClass) => void;
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not scheduled";
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else if (diffDays === 1) {
    return `Tomorrow at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else if (diffDays > 0) {
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return date.toLocaleDateString();
  }
};

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'live':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'upcoming':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'recorded':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
    }
  };

  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'intermediate':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'advanced':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {demoClass?.title || "No Title Available"}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            by {demoClass?.instructor?.name || "No instructor"}
          </p>
          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(demoClass?.scheduledDate)}
            </div>
              <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {demoClass?.duration ? `${demoClass.duration} min` : "Duration TBD"}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full">
          <MonitorPlay className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        </div>
        
      {/* Category, Status and Level */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {demoClass?.category && (
            <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-full">
              {demoClass.category}
            </span>
          )}
          {demoClass?.status && (
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(demoClass.status)}`}>
              {demoClass.status === 'live' && <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></span>}
              {demoClass.status.charAt(0).toUpperCase() + demoClass.status.slice(1)}
            </span>
          )}
          {demoClass?.level && (
            <span className={`px-2 py-1 text-xs rounded-full ${getLevelColor(demoClass.level)}`}>
              {demoClass.level.charAt(0).toUpperCase() + demoClass.level.slice(1)}
            </span>
          )}
        </div>
      </div>

      {/* Rating and Participants */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {demoClass?.instructor?.rating || "4.5"}
          </span>
        </div>
        <div className="flex items-center text-blue-600 dark:text-blue-400">
          <Users className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">
            {demoClass?.participants || 0}/{demoClass?.maxParticipants || 50}
          </span>
        </div>
      </div>

        {/* Description */}
      {demoClass?.description && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {demoClass.description}
        </p>
        </div>
      )}

      {/* Zoom Meeting Link (if available) */}
      {demoClass.meetingLink && (demoClass.status === 'upcoming' || demoClass.status === 'live') && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Video className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {demoClass.status === 'live' ? 'Join Live Session' : 'Zoom Ready'}
              </span>
            </div>
            <a
              href={demoClass.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-xs px-3 py-1 rounded-full transition-colors ${
                demoClass.status === 'live' 
                  ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {demoClass.status === 'live' ? 'Join Now' : 'Join Meeting'}
            </a>
          </div>
          {demoClass.meetingId && (
            <div className="mt-2 text-xs text-blue-700 dark:text-blue-300">
              <span className="font-mono">ID: {demoClass.meetingId}</span>
              {demoClass.meetingPassword && (
                <span className="ml-3 font-mono">Password: {demoClass.meetingPassword}</span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-2">
        <button 
          onClick={() => onViewMaterials(demoClass)}
          className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </button>
        <button
          onClick={() => onDemoAction?.(demoClass)}
          className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg transition-colors text-sm ${
            demoClass?.status === 'live' 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : demoClass?.status === 'upcoming'
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-primary-600 hover:bg-primary-700 text-white'
          }`}
        >
          {demoClass?.status === 'live' ? (
            <>
              <Play className="w-4 h-4 mr-2" />
              Join Live
            </>
          ) : demoClass?.status === 'upcoming' ? (
            <>
              <Calendar className="w-4 h-4 mr-2" />
              Reschedule
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Give Feedback
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Demo Feedback Form Component
// Demo Booking Component for scheduling new demo classes
const DemoBookingComponent: React.FC<{ onBookingSuccess?: () => void }> = ({ onBookingSuccess }) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isBooking, setIsBooking] = useState<boolean>(false);
  const [isBooked, setIsBooked] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("Student");
  const [bookingResult, setBookingResult] = useState<any>(null);
  const [autoGenerateZoom, setAutoGenerateZoom] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false);
  const [showMoreDates, setShowMoreDates] = useState<boolean>(false);
  const [selectedTimezone, setSelectedTimezone] = useState<string>('UTC');
  const [availableTimezones, setAvailableTimezones] = useState<any>(null);
  const [isLoadingTimezones, setIsLoadingTimezones] = useState<boolean>(false);
  
  // Minimal form data - only essential fields
  const [formData, setFormData] = useState({
    // Essential fields (Step 1)
    courseInterest: '',
    experienceLevel: 'beginner' as 'beginner' | 'intermediate' | 'advanced' | 'expert',
    
    // Contact info (Step 2) 
    phoneNumber: '',
    requirements: '',
    
    // Optional fields (Step 3)
    demoType: 'course_demo' as 'course_demo' | 'consultation' | 'product_walkthrough' | 'general_inquiry',
    source: 'website' as 'website' | 'social_media' | 'referral' | 'advertisement' | 'other',
    programmingExperience: '' as '' | 'none' | 'beginner' | 'intermediate' | 'advanced' | 'expert',
    studentStatus: '' as '' | 'full-time-student' | 'part-time-student' | 'working-professional' | 'job-seeker' | 'freelancer' | 'entrepreneur',
    howDidYouHearAboutUs: '' as '' | 'google-search' | 'social-media' | 'friend-referral' | 'youtube' | 'linkedin' | 'advertisement' | 'blog' | 'other',
    referralCode: '',
    
    // Advanced optional fields
    age: '',
    educationLevel: '' as '' | 'high-school' | 'diploma' | 'bachelors' | 'masters' | 'phd' | 'professional' | 'other',
    careerObjectives: '',
  });
  
  const [zoomSettings, setZoomSettings] = useState({
    duration: 60,
    auto_recording: 'cloud' as 'cloud' | 'local' | 'none',
    waiting_room: true,
    host_video: true,
    participant_video: true,
    mute_upon_entry: true,
    join_before_host: false,
    meeting_authentication: false,
    registrants_confirmation_email: true,
    registrants_email_notification: true
  });

  // Generate available dates (next 30 days, excluding weekends)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today.getTime() + (i * 24 * 60 * 60 * 1000));
      const dayOfWeek = date.getDay();
      
      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        const dateStr = date.toISOString().split('T')[0];
        const displayDate = date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric' 
        });
        
        dates.push({
          value: dateStr,
          label: displayDate,
          isToday: i === 0,
          isTomorrow: i === 1
        });
      }
    }
    
    return dates;
  };

  const [availableDates] = useState(generateAvailableDates());

  // Supported timezones list (from API error response)
  const supportedTimezones = [
    "UTC",
    "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
    "America/Toronto", "America/Vancouver", "America/Sao_Paulo", "America/Mexico_City",
    "Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Rome", "Europe/Madrid",
    "Europe/Amsterdam", "Europe/Stockholm", "Europe/Zurich", "Europe/Vienna",
    "Asia/Dubai", "Asia/Kolkata", "Asia/Singapore", "Asia/Tokyo", "Asia/Shanghai",
    "Asia/Hong_Kong", "Asia/Seoul", "Asia/Bangkok", "Asia/Jakarta",
    "Australia/Sydney", "Australia/Melbourne", "Australia/Perth",
    "Pacific/Auckland", "Pacific/Honolulu",
    "Africa/Cairo", "Africa/Lagos", "Africa/Johannesburg"
  ];

  // Function to find the best matching supported timezone
  const findBestMatchingTimezone = (detectedTimezone: string): string => {
    // If detected timezone is already supported, use it
    if (supportedTimezones.includes(detectedTimezone)) {
      return detectedTimezone;
    }

    // Common timezone mappings for unsupported timezones
    const timezoneMap: Record<string, string> = {
      // US timezones
      'America/Detroit': 'America/New_York',
      'America/Indiana/Indianapolis': 'America/New_York',
      'America/Kentucky/Louisville': 'America/New_York',
      'America/New_York': 'America/New_York',
      'US/Eastern': 'America/New_York',
      'US/Central': 'America/Chicago',
      'US/Mountain': 'America/Denver',
      'US/Pacific': 'America/Los_Angeles',
      
      // European timezones
      'Europe/Dublin': 'Europe/London',
      'Europe/Brussels': 'Europe/Paris',
      'Europe/Luxembourg': 'Europe/Paris',
      'Europe/Monaco': 'Europe/Paris',
      'Europe/Prague': 'Europe/Berlin',
      'Europe/Warsaw': 'Europe/Berlin',
      'Europe/Budapest': 'Europe/Berlin',
      'Europe/Vienna': 'Europe/Vienna',
      
      // Asian timezones
      'Asia/Calcutta': 'Asia/Kolkata',
      'Asia/Mumbai': 'Asia/Kolkata',
      'Asia/Delhi': 'Asia/Kolkata',
      'Asia/Karachi': 'Asia/Dubai',
      'Asia/Riyadh': 'Asia/Dubai',
      'Asia/Kuwait': 'Asia/Dubai',
      'Asia/Manila': 'Asia/Singapore',
      'Asia/Kuala_Lumpur': 'Asia/Singapore',
      
      // Australian timezones
      'Australia/Brisbane': 'Australia/Sydney',
      'Australia/Canberra': 'Australia/Sydney',
      'Australia/Hobart': 'Australia/Sydney',
      'Australia/Adelaide': 'Australia/Sydney',
      'Australia/Darwin': 'Australia/Sydney',
    };

    // Check if we have a mapping for this timezone
    if (timezoneMap[detectedTimezone]) {
      return timezoneMap[detectedTimezone];
    }

    // Try to find a timezone in the same region
    const region = detectedTimezone.split('/')[0];
    const supportedInRegion = supportedTimezones.filter(tz => tz.startsWith(region + '/'));
    if (supportedInRegion.length > 0) {
      return supportedInRegion[0]; // Return first supported timezone in the same region
    }

    // Default fallback
    return 'UTC';
  };

  // Function to fetch available timezones
  const fetchAvailableTimezones = async () => {
    if (isLoadingTimezones || availableTimezones) return; // Avoid duplicate calls
    
    setIsLoadingTimezones(true);
    try {
      const response = await fetch('/api/demo-booking/timezones');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setAvailableTimezones(data.data);
          
          // Auto-detect and set user's timezone after fetching supported timezones
          if (typeof window !== 'undefined') {
            const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const bestMatch = findBestMatchingTimezone(detectedTimezone);
            console.log('Timezone detection:', {
              detected: detectedTimezone,
              bestMatch,
              isSupported: supportedTimezones.includes(detectedTimezone)
            });
            setSelectedTimezone(bestMatch);
          }
        }
      } else {
        // Fallback: try to auto-detect even without API
        if (typeof window !== 'undefined') {
          const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          const bestMatch = findBestMatchingTimezone(detectedTimezone);
          setSelectedTimezone(bestMatch);
        }
      }
    } catch (error) {
      console.warn('Could not fetch timezones:', error);
      // Fallback: try to auto-detect even with API error
      if (typeof window !== 'undefined') {
        const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const bestMatch = findBestMatchingTimezone(detectedTimezone);
        setSelectedTimezone(bestMatch);
      }
    } finally {
      setIsLoadingTimezones(false);
    }
  };

  // Function to format time in selected timezone
  const formatTimeInTimezone = (datetime: string, timezone: string) => {
    try {
      const date = new Date(datetime);
      return {
        time: date.toLocaleTimeString('en-US', { 
          timeZone: timezone,
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        date: date.toLocaleDateString('en-US', { 
          timeZone: timezone,
          weekday: 'long',
          month: 'long', 
          day: 'numeric' 
        }),
        full: date.toLocaleString('en-US', { 
          timeZone: timezone,
          weekday: 'long',
          month: 'long', 
          day: 'numeric',
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        })
      };
    } catch (error) {
      console.error('Error formatting time:', error);
      return {
        time: new Date(datetime).toLocaleTimeString(),
        date: new Date(datetime).toLocaleDateString(),
        full: new Date(datetime).toLocaleString()
      };
    }
  };

  // Generate default time slots that are always in the future
  const generateDefaultTimeSlots = () => {
    const now = new Date();
    const slots = [];
    
    // Start from 1 hour from now (minimum booking time)
    let startTime = new Date(now.getTime() + (1 * 60 * 60 * 1000));
    
    // Round to next hour
    startTime.setMinutes(0, 0, 0);
    startTime.setHours(startTime.getHours() + 1);
    
    // Generate slots over the next few days
    let attempts = 0;
    const maxAttempts = 50; // Prevent infinite loop
    
    while (slots.length < 6 && attempts < maxAttempts) {
      const slotTime = new Date(startTime.getTime() + (attempts * 2 * 60 * 60 * 1000)); // Every 2 hours
      
      // Skip slots that fall outside business hours (9 AM - 6 PM UTC)
      const utcHour = slotTime.getUTCHours();
      if (utcHour >= 9 && utcHour < 18) {
        // Ensure slot is at least 1 hour from current time
        const timeDifference = slotTime.getTime() - now.getTime();
        const hoursFromNow = timeDifference / (1000 * 60 * 60);
        
        if (hoursFromNow >= 1) {
          const dayName = slotTime.toLocaleDateString('en-US', { weekday: 'long' });
          const timeString = slotTime.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          });
          
          slots.push({
            id: slotTime.toISOString(),
            label: `${dayName} ${timeString}`,
            available: true,
            datetime: slotTime.toISOString(),
            time: timeString,
            display_time: timeString
          });
        }
      }
      
      attempts++;
    }
    
    return slots;
  };

  const [timeSlots, setTimeSlots] = useState<any[]>([]);

  // Function to fetch time slots for a specific date
  const fetchTimeSlotsForDate = async (dateStr: string) => {
    setIsLoadingSlots(true);
    setSelectedTimeSlot(""); // Reset selected time slot when date changes
    
    try {
      const { demoBookingHelpers } = await import('@/apis');
      
      const response = await demoBookingHelpers.getAvailableSlots(dateStr, {
        timezone: selectedTimezone,
        demoType: 'course_demo',
        durationMinutes: 60
      });
      
      if (response.success && response.data?.daily_slots) {
        // Process the rich API response with daily slots
        const processedSlots: any[] = [];
        
        response.data.daily_slots.forEach((day: any) => {
          // Only process slots for the selected date
          if (day.date === dateStr) {
            day.slots.forEach((slot: any) => {
              // Only include slots that are at least 1 hour from now
              const slotTime = new Date(slot.datetime);
              const now = new Date();
              const hoursFromNow = (slotTime.getTime() - now.getTime()) / (1000 * 60 * 60);
              
              // Check if the slot is within business hours (9 AM - 6 PM UTC)
              const utcHour = slotTime.getUTCHours();
              const isWithinBusinessHours = utcHour >= 9 && utcHour < 18;
              
              if (hoursFromNow >= 1 && isWithinBusinessHours) {
                const timezoneFormatted = formatTimeInTimezone(slot.datetime, selectedTimezone);
                processedSlots.push({
                  id: slot.datetime,
                  label: timezoneFormatted.full,
                  available: slot.available,
                  datetime: slot.datetime,
                  time: timezoneFormatted.time,
                  display_time: timezoneFormatted.time,
                  date: day.date,
                  display_date: timezoneFormatted.date,
                  day_name: day.day_name,
                  is_today: day.is_today,
                  is_tomorrow: day.is_tomorrow,
                  bookings_count: slot.bookings_count || 0,
                  timezone_info: {
                    timezone: selectedTimezone,
                    formatted: timezoneFormatted
                  }
                });
              }
            });
          }
        });
        
        setTimeSlots(processedSlots);
      } else if (response.success && response.data?.slots) {
        // Fallback for older API format
        const apiSlots = response.data.slots
          .filter((slot: any) => {
            const slotTime = new Date(slot.datetime);
            const now = new Date();
            const hoursFromNow = (slotTime.getTime() - now.getTime()) / (1000 * 60 * 60);
            const utcHour = slotTime.getUTCHours();
            const isWithinBusinessHours = utcHour >= 9 && utcHour < 18;
            
            return hoursFromNow >= 1 && isWithinBusinessHours;
          })
          .map((slot: any) => {
            const timezoneFormatted = formatTimeInTimezone(slot.datetime, selectedTimezone);
            return {
              id: slot.datetime,
              label: timezoneFormatted.full,
              available: slot.available,
              datetime: slot.datetime,
              time: timezoneFormatted.time,
              display_time: timezoneFormatted.time,
              timezone_info: {
                timezone: selectedTimezone,
                formatted: timezoneFormatted
              }
            };
          });
        setTimeSlots(apiSlots);
      } else {
        // If no slots available, show empty state
        setTimeSlots([]);
      }
    } catch (apiError) {
      console.warn('Could not fetch available slots for date:', dateStr, apiError);
      setTimeSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  // Handle date selection
  const handleDateChange = (dateStr: string) => {
    setSelectedDate(dateStr);
    fetchTimeSlotsForDate(dateStr);
  };

  // Handle timezone selection
  const handleTimezoneChange = (timezone: string) => {
    console.log('Timezone changed to:', timezone);
    setSelectedTimezone(timezone);
    setSelectedTimeSlot(""); // Reset selected time slot when timezone changes
  };

  // Get user name and available slots on component mount
  useEffect(() => {
    const initializeComponent = async () => {
      if (typeof window !== 'undefined') {
        try {
          // Get user name
          const storedUserName = localStorage.getItem("userName") || "";
          const storedFullName = localStorage.getItem("fullName") || "";
          const storedName = storedUserName || storedFullName;
          
          if (storedName && storedName.trim() !== '') {
            // Extract first name
            const firstName = storedName.trim().split(/\s+/)[0];
            const cleanFirstName = firstName.replace(/[^a-zA-Z]/g, '');
            if (cleanFirstName.length > 0) {
              setUserName(cleanFirstName.charAt(0).toUpperCase() + cleanFirstName.slice(1).toLowerCase());
            }
          }

          // Fetch available timezones
          await fetchAvailableTimezones();

          // Set initial date to today if available, otherwise first available date
          const today = new Date().toISOString().split('T')[0];
          const todayAvailable = availableDates.find(d => d.value === today);
          const initialDate = todayAvailable ? today : availableDates[0]?.value;
          
          if (initialDate) {
            setSelectedDate(initialDate);
            // Fetch time slots for initial date
            await fetchTimeSlotsForDate(initialDate);
          }
        } catch (error) {
          console.error('Error initializing component:', error);
        }
      }
    };

    initializeComponent();
  }, []);

  // Refetch time slots when timezone changes
  useEffect(() => {
    if (selectedDate && selectedTimezone && selectedTimezone !== 'UTC') {
      // Only refetch if we have a valid selected date and a non-default timezone
      fetchTimeSlotsForDate(selectedDate);
    }
  }, [selectedTimezone]);

  // Simplified validation function - only validate essential fields
  const validateFormData = () => {
    const errors: string[] = [];
    
    // Required fields
    if (!formData.courseInterest) {
      errors.push('Please select a course category');
    }
    
    if (!formData.experienceLevel) {
      errors.push('Please select your experience level');
    }
    
    // Phone number is now required
    if (!formData.phoneNumber || formData.phoneNumber.trim() === '') {
      errors.push('Phone number is required');
    }
    
    // Phone number validation
    if (formData.phoneNumber) {
      const cleanPhone = formData.phoneNumber.replace(/[\s-()]/g, '');
      
      // Check if it starts with + and has valid format
      if (!/^\+?[1-9]\d{9,19}$/.test(cleanPhone)) {
        errors.push('Please enter a valid phone number with country code (e.g., +91xxxxxxxxxx)');
      }
      
      // Check length (10-20 digits including country code)
      const phoneDigits = cleanPhone.replace(/^\+/, '');
      if (phoneDigits.length < 10 || phoneDigits.length > 20) {
        errors.push('Phone number must be between 10 and 20 digits');
      }
    }
    
    // Age validation (if provided)
    if (formData.age && (parseInt(formData.age) < 13 || parseInt(formData.age) > 100)) {
      errors.push('Age must be between 13 and 100');
    }
    
    return errors;
  };

  const handleBookDemo = async () => {
    // Early validation checks
    if (!selectedTimeSlot) {
      alert('Please select a time slot for your demo session.');
      return;
    }
    
    // Comprehensive form validation
    const validationErrors = validateFormData();
    if (validationErrors.length > 0) {
      alert(`Please fix the following errors:\n\n${validationErrors.join('\n')}`);
      return;
    }

    setIsBooking(true);
    try {
      // Debug: Check current auth data
      const debugAuthData = {
        userId: localStorage.getItem("userId"),
        email: localStorage.getItem("email"),
        userEmail: localStorage.getItem("userEmail"), 
        fullName: localStorage.getItem("fullName"),
        userName: localStorage.getItem("userName"),
        token: localStorage.getItem("token")
      };
      console.log('Current auth data:', debugAuthData);
      
      // Import the API helper dynamically to avoid SSR issues
      const { demoBookingHelpers } = await import('@/apis');
      
      // Find the selected time slot data
      const selectedSlot = timeSlots.find(slot => slot.id === selectedTimeSlot);
      let timeSlotValue = selectedSlot?.datetime || selectedTimeSlot;
      
      // Ensure the time slot is properly formatted for the API
      if (timeSlotValue && !timeSlotValue.includes('T')) {
        // If it's just a date, we need to construct a proper datetime
        const selectedTime = new Date(timeSlotValue);
        timeSlotValue = selectedTime.toISOString();
      }
f      
      // Validate the time slot is within business hours before sending to API
      const slotDateTime = new Date(timeSlotValue);
      const utcHour = slotDateTime.getUTCHours();
      const isWithinBusinessHours = utcHour >= 9 && utcHour < 18;
      
      console.log('Selected time slot validation:', {
        selectedTimeSlot,
        selectedSlot,
        timeSlotValue,
        slotDateTime: slotDateTime.toISOString(),
        utcHour,
        isWithinBusinessHours,
        now: new Date().toISOString()
      });
      
      if (!isWithinBusinessHours) {
        throw new Error(`Selected time slot (${utcHour}:00 UTC) is outside business hours (9 AM - 6 PM UTC). Please select a different time.`);
      }

      // Validate timezone is supported
      if (!supportedTimezones.includes(selectedTimezone)) {
        throw new Error(`Selected timezone "${selectedTimezone}" is not supported. Please select a different timezone.`);
      }
      
      // Validate required fields before booking
      if (!formData.courseInterest) {
        throw new Error('Please select a course category');
      }
      
      if (!timeSlotValue) {
        throw new Error('Please select a time slot');
      }
      
      // Validate user authentication
      if (!debugAuthData.email && !debugAuthData.userEmail) {
        throw new Error('Please log in to book a demo session');
      }
      
      // Create booking using the real API
      const response = await demoBookingHelpers.createBookingForCurrentUser(timeSlotValue, {
        courseInterest: formData.courseInterest,
        demoType: formData.demoType,
        experienceLevel: formData.experienceLevel,
        phoneNumber: formData.phoneNumber,
        requirements: formData.requirements,
        source: formData.source,
        timezone: selectedTimezone,
        autoGenerateZoomMeeting: true,
        zoomMeetingSettings: {
          duration: 60,
          auto_recording: 'cloud',
          waiting_room: true,
          host_video: true,
          participant_video: true,
          mute_upon_entry: true,
          join_before_host: false,
          meeting_authentication: false,
          registrants_confirmation_email: true,
          registrants_email_notification: true
        }
      });
      
      if (response.success) {
        setBookingResult(response.data);
        setIsBooked(true);
        console.log('Demo booking successful:', response.data);
        
        // Refresh data immediately after successful booking
        if (onBookingSuccess) {
          onBookingSuccess();
        }
        
        // Show success notification for 8 seconds to allow reading Zoom details
        setTimeout(() => {
          setIsBooked(false);
          setSelectedTimeSlot("");
          setBookingResult(null);
        }, 8000);
      } else {
        throw new Error(response.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Error booking demo:', error);
      
      // Show error to user with more details
      let errorMessage = 'Unknown error occurred';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      // Provide more helpful error messages
      if (errorMessage.toLowerCase().includes('validation')) {
        errorMessage = 'Please check that all required fields are filled correctly and try again.';
      } else if (errorMessage.toLowerCase().includes('auth')) {
        errorMessage = 'Please log in to your account and try again.';
      } else if (errorMessage.toLowerCase().includes('slot')) {
        errorMessage = 'The selected time slot is no longer available. Please choose another time.';
      }
      
      // Show user-friendly error message
      if (typeof window !== 'undefined') {
        alert(`❌ Booking Failed\n\n${errorMessage}\n\nPlease try again or contact support if the problem persists.`);
      }
    } finally {
      setIsBooking(false);
    }
  };

  if (isBooked) {
    return <ZoomMeetingDetails booking={bookingResult?.booking} selectedTimeSlot={selectedTimeSlot} timeSlots={timeSlots} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Smart Progressive Form */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20">
              <Video className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Book Your FREE Demo</h2>
              <div className="flex items-center mt-1">
                <span className="relative flex h-3 w-3 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">LIVE Sessions Available</span>
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              👋 Welcome {userName}! Ready to experience MEDH?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Join a personalized live demo session with our expert instructors. Get tailored course recommendations and career guidance.
            </p>
          </div>

          {/* Progressive Form - Minimal & Conversion Optimized */}
          <div className="space-y-6 mb-8">
            {/* Step Progress Indicator */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      currentStep >= step 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }`}>
                      {step}
                    </div>
                    {step < 3 && (
                      <div className={`w-12 h-0.5 mx-2 transition-all ${
                        currentStep > step ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 1: Essential Info */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    🎯 What interests you?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Choose a course and tell us your experience level
                  </p>
                </div>

                {/* Course Category - Card Style */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-4">
                    Choose Your Course *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { value: 'AI & Data Science', emoji: '🤖', desc: 'Machine Learning, Python, Analytics' },
                      { value: 'Digital Marketing', emoji: '📱', desc: 'SEO, Social Media, Ads' },
                      { value: 'Personality Development', emoji: '✨', desc: 'Communication, Leadership' },
                      { value: 'Vedic Mathematics', emoji: '🧮', desc: 'Fast Calculation Techniques' }
                    ].map((course) => (
                      <div
                        key={course.value}
                        onClick={() => setFormData({...formData, courseInterest: course.value})}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:scale-105 ${
                          formData.courseInterest === course.value
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">{course.emoji}</div>
                        <div className="font-semibold text-gray-900 dark:text-white">{course.value}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{course.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experience Level - Button Style */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-4">
                    Your Experience Level *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { value: 'beginner', emoji: '🌱', label: 'Beginner' },
                      { value: 'intermediate', emoji: '📈', label: 'Intermediate' },
                      { value: 'advanced', emoji: '🚀', label: 'Advanced' },
                      { value: 'expert', emoji: '⭐', label: 'Expert' }
                    ].map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => setFormData({...formData, experienceLevel: level.value as any})}
                        className={`p-3 border-2 rounded-xl transition-all hover:scale-105 ${
                          formData.experienceLevel === level.value
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                            : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
                        }`}
                      >
                        <div className="text-xl mb-1">{level.emoji}</div>
                        <div className="text-sm font-medium">{level.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Next Button */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    disabled={!formData.courseInterest || !formData.experienceLevel}
                    className="px-6 py-3 bg-green-500 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
                  >
                    Continue →
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Contact & Goals */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    📞 How can we reach you?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We'll send demo details and reminders
                  </p>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => {
                      let value = e.target.value;
                      // Auto-add + if user starts typing without it and it looks like a country code
                      if (value.length === 1 && /^[1-9]$/.test(value)) {
                        value = '+' + value;
                      }
                      setFormData({...formData, phoneNumber: value});
                    }}
                    placeholder="+91 98765 43210"
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    📱 Include country code (e.g., +91) • WhatsApp reminders & demo link
                  </p>
                </div>

                {/* Goals */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    What's your main goal? (Optional)
                  </label>
                  <textarea
                    value={formData.requirements}
                    onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                    placeholder="e.g., Career change, skill upgrade, freelancing, starting a business..."
                    rows={3}
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    maxLength={200}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      💡 Helps us personalize your demo
                    </p>
                    <span className="text-xs text-gray-400">
                      {formData.requirements.length}/200
                    </span>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    disabled={!formData.phoneNumber.trim()}
                    className="px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue →
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Time Selection & Optional Details */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    🕒 Choose Your Time
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Select a convenient time for your demo session
                  </p>
                </div>

                {/* Timezone Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-green-600 dark:text-green-400" />
                    Your Timezone
                  </label>
                  <div className="relative">
                    <select
                      value={selectedTimezone}
                      onChange={(e) => handleTimezoneChange(e.target.value)}
                      disabled={isLoadingTimezones}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none pr-10"
                    >
                      {isLoadingTimezones ? (
                        <option>Loading timezones...</option>
                      ) : availableTimezones?.grouped_timezones ? (
                        Object.entries(availableTimezones.grouped_timezones).map(([region, timezones]: [string, any]) => (
                          <optgroup key={region} label={region}>
                            {timezones.map((tz: any) => (
                              <option key={tz.value} value={tz.value}>
                                {tz.label} ({tz.offset})
                              </option>
                            ))}
                          </optgroup>
                        ))
                      ) : (
                        // Fallback: show supported timezones grouped by region
                        <>
                          <optgroup label="Global">
                            <option value="UTC">UTC (Coordinated Universal Time)</option>
                          </optgroup>
                          <optgroup label="North America">
                            <option value="America/New_York">Eastern Time (New York)</option>
                            <option value="America/Chicago">Central Time (Chicago)</option>
                            <option value="America/Denver">Mountain Time (Denver)</option>
                            <option value="America/Los_Angeles">Pacific Time (Los Angeles)</option>
                            <option value="America/Toronto">Eastern Time (Toronto)</option>
                            <option value="America/Vancouver">Pacific Time (Vancouver)</option>
                            <option value="America/Mexico_City">Central Time (Mexico City)</option>
                          </optgroup>
                          <optgroup label="South America">
                            <option value="America/Sao_Paulo">Brasília Time (São Paulo)</option>
                          </optgroup>
                          <optgroup label="Europe">
                            <option value="Europe/London">Greenwich Mean Time (London)</option>
                            <option value="Europe/Paris">Central European Time (Paris)</option>
                            <option value="Europe/Berlin">Central European Time (Berlin)</option>
                            <option value="Europe/Rome">Central European Time (Rome)</option>
                            <option value="Europe/Madrid">Central European Time (Madrid)</option>
                            <option value="Europe/Amsterdam">Central European Time (Amsterdam)</option>
                            <option value="Europe/Stockholm">Central European Time (Stockholm)</option>
                            <option value="Europe/Zurich">Central European Time (Zurich)</option>
                            <option value="Europe/Vienna">Central European Time (Vienna)</option>
                          </optgroup>
                          <optgroup label="Asia">
                            <option value="Asia/Dubai">Gulf Standard Time (Dubai)</option>
                            <option value="Asia/Kolkata">India Standard Time (Kolkata)</option>
                            <option value="Asia/Singapore">Singapore Standard Time</option>
                            <option value="Asia/Tokyo">Japan Standard Time (Tokyo)</option>
                            <option value="Asia/Shanghai">China Standard Time (Shanghai)</option>
                            <option value="Asia/Hong_Kong">Hong Kong Time</option>
                            <option value="Asia/Seoul">Korea Standard Time (Seoul)</option>
                            <option value="Asia/Bangkok">Indochina Time (Bangkok)</option>
                            <option value="Asia/Jakarta">Western Indonesia Time (Jakarta)</option>
                          </optgroup>
                          <optgroup label="Australia & Oceania">
                            <option value="Australia/Sydney">Australian Eastern Time (Sydney)</option>
                            <option value="Australia/Melbourne">Australian Eastern Time (Melbourne)</option>
                            <option value="Australia/Perth">Australian Western Time (Perth)</option>
                            <option value="Pacific/Auckland">New Zealand Time (Auckland)</option>
                            <option value="Pacific/Honolulu">Hawaii-Aleutian Time (Honolulu)</option>
                          </optgroup>
                          <optgroup label="Africa">
                            <option value="Africa/Cairo">Eastern European Time (Cairo)</option>
                            <option value="Africa/Lagos">West Africa Time (Lagos)</option>
                            <option value="Africa/Johannesburg">South Africa Time (Johannesburg)</option>
                          </optgroup>
                        </>
                      )}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    All times will be displayed in your selected timezone
                  </p>
                </div>

                {/* Available Time Slots with Date Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-4">
                    Available Time Slots *
                  </label>

                  {/* Date Selection within Time Slots */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Select a date to view available time slots:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {availableDates.slice(0, showMoreDates ? availableDates.length : 8).map((date) => (
                        <button
                          key={date.value}
                          type="button"
                          onClick={() => handleDateChange(date.value)}
                          className={`p-3 text-sm rounded-lg border transition-all ${
                            selectedDate === date.value
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                              : 'border-gray-200 dark:border-gray-700 hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-900/10'
                          }`}
                        >
                          <div className="font-medium">
                            {date.isToday ? 'Today' : date.isTomorrow ? 'Tomorrow' : 
                             new Date(date.value).toLocaleDateString('en-US', { 
                               weekday: 'short', 
                               month: 'short', 
                               day: 'numeric' 
                             })
                            }
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(date.value).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    {/* Show More Dates Button */}
                    {availableDates.length > 8 && (
                      <div className="text-center mt-3">
                        <button
                          type="button"
                          onClick={() => setShowMoreDates(!showMoreDates)}
                          className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 underline"
                        >
                          {showMoreDates ? 'Show Less Dates' : `Show More Dates (${availableDates.length - 8} more)`}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Time Slots for Selected Date */}
                  {selectedDate && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Time slots for {new Date(selectedDate).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'long', 
                            day: 'numeric' 
                          })}:
                        </p>
                        <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {selectedTimezone.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {isLoadingSlots ? (
                      <div className="text-center py-8">
                        <RefreshCw className="w-6 h-6 animate-spin text-green-500 mx-auto mb-2" />
                        <p className="text-gray-500 dark:text-gray-400">Loading available time slots...</p>
                      </div>
                    ) : timeSlots.length > 0 ? (
                      // Display time slots for the selected date only
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {timeSlots.map((slot: any) => (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => setSelectedTimeSlot(slot.id)}
                            disabled={!slot.available}
                            className={`p-3 text-sm rounded-lg border transition-all ${
                              selectedTimeSlot === slot.id
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                                : slot.available
                                ? 'border-gray-200 dark:border-gray-700 hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-900/10'
                                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            <div className="font-medium">{slot.display_time || slot.time}</div>
                            {slot.bookings_count > 0 && (
                              <div className="text-xs text-gray-500 mt-1">
                                {slot.bookings_count} booked
                              </div>
                            )}
                            {!slot.available && (
                              <div className="text-xs text-red-500 mt-1">Full</div>
                            )}
                          </button>
                        ))}
                      </div>
                    ) : selectedDate ? (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400 mb-2">
                          No available time slots for {new Date(selectedDate).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                        <p className="text-sm text-gray-400">
                          Please select a different date
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">Please select a date to view available time slots</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Optional Details */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Quick Details (Optional)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current Status
                      </label>
                      <select
                        value={formData.studentStatus}
                        onChange={(e) => setFormData({...formData, studentStatus: e.target.value as any})}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select status</option>
                        <option value="full-time-student">📚 Student</option>
                        <option value="working-professional">💼 Working Professional</option>
                        <option value="job-seeker">🔍 Job Seeker</option>
                        <option value="freelancer">💻 Freelancer</option>
                        <option value="entrepreneur">🚀 Entrepreneur</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        How did you hear about us?
                      </label>
                      <select
                        value={formData.howDidYouHearAboutUs}
                        onChange={(e) => setFormData({...formData, howDidYouHearAboutUs: e.target.value as any})}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select source</option>
                        <option value="google-search">🔍 Google Search</option>
                        <option value="social-media">📱 Social Media</option>
                        <option value="friend-referral">👥 Friend/Colleague</option>
                        <option value="youtube">📺 YouTube</option>
                        <option value="linkedin">💼 LinkedIn</option>
                        <option value="other">🔄 Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleBookDemo}
                    disabled={isBooking || !selectedTimeSlot || !selectedDate}
                    className="px-8 py-3 bg-green-500 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-colors flex items-center gap-2"
                  >
                    {isBooking ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Booking...
                      </>
                    ) : (
                      <>
                        <CalendarPlus className="w-4 h-4" />
                        Book Demo
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Skip to Time Selection Button - Only show in steps 1-2 */}
          {currentStep < 3 && (
            <div className="text-center mb-6">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                disabled={!formData.courseInterest || !formData.experienceLevel}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Skip to time selection
              </button>
            </div>
          )}
        </div>

        {/* Right Column - Benefits & Features */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">What You'll Get</h3>
          
          <div className="space-y-6">
            {/* Benefit 1 */}
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex-shrink-0">
                <MonitorPlay className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Live Expert Session</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">60-minute interactive session with industry experts</p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex-shrink-0">
                <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Personalized Guidance</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Get course recommendations based on your goals</p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20 flex-shrink-0">
                <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Career Roadmap</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Understand your learning path and career opportunities</p>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 flex-shrink-0">
                <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Q&A Session</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Ask questions and get instant answers from experts</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">10,000+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Students Helped</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">4.9/5</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Demo Rating</div>
              </div>
            </div>
          </div>

          {/* Student Testimonials */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              What Students Say
            </h3>
            
            <div className="space-y-4">
              {/* Testimonial 1 */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    {"⭐".repeat(5)}
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  "The demo session was incredibly helpful! The instructor explained everything clearly and answered all my questions."
                </p>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Priya S.</span> • AI & Data Science
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    {"⭐".repeat(5)}
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  "Perfect introduction to digital marketing! Got a clear roadmap for my career transition."
                </p>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Rahul M.</span> • Digital Marketing
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    {"⭐".repeat(5)}
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  "The personality development session boosted my confidence. Highly recommend!"
                </p>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Anita K.</span> • Personality Development
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <Shield className="w-3 h-3 mr-1 text-green-500" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1 text-blue-500" />
                  <span>60 min session</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1 text-emerald-500" />
                  <span>100% Free</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const MemoizedDemoBookingComponent = memo(DemoBookingComponent);

// Demo Certificates Section Component
const DemoCertificatesSection: React.FC<{ completedClasses: DemoClass[] }> = ({ completedClasses }) => {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setIsLoading(true);
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        // For now, generate certificates for completed demo classes
        const demoCertificates = completedClasses.map((demoClass) => ({
          id: `cert-${demoClass.id}`,
          title: `Demo Completion Certificate`,
          demoTitle: demoClass.title,
          completedDate: demoClass.scheduledDate,
          instructor: demoClass.instructor?.name,
          certificateUrl: `/certificates/demo/${demoClass.id}`,
          issuedDate: new Date().toISOString()
        }));

        setCertificates(demoCertificates);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificates();
  }, [completedClasses]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading certificates...</span>
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <MonitorPlay className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No certificates available
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Complete demo sessions to earn certificates
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Demo Completion Certificates
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Download your demo session completion certificates
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((certificate) => (
          <div
            key={certificate.id}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/20">
                <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="ml-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {certificate.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {certificate.demoTitle}
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Instructor:</span>
                <span className="text-gray-900 dark:text-white">{certificate.instructor}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Completed:</span>
                <span className="text-gray-900 dark:text-white">
                  {new Date(certificate.completedDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Issued:</span>
                <span className="text-gray-900 dark:text-white">
                  {new Date(certificate.issuedDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => window.open(certificate.certificateUrl, '_blank')}
              className="w-full flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
            >
              <FileText className="w-4 h-4 mr-2" />
              Download Certificate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Feedback Analytics Component
const FeedbackAnalyticsSection: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { demoFeedbackHelpers } = await import('@/apis');
        const response = await demoFeedbackHelpers.getFeedbackStats();
        if (response.success) {
          setAnalytics(response.data);
        }
      } catch (error) {
        console.error('Error fetching feedback analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 text-center">
          <BarChart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Analytics Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Feedback analytics will appear here once you start collecting feedback.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-6">
        <div className="flex items-center">
          <div className="p-2 bg-purple-500 rounded-full mr-4">
            <BarChart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              Feedback Analytics
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Insights from your demo session feedback
            </p>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Feedback</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.totalFeedback || 0}
              </p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

                 <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Rating</p>
               <p className="text-2xl font-bold text-gray-900 dark:text-white">
                 {analytics.averageRating && analytics.averageRating > 0 ? analytics.averageRating.toFixed(1) : 'N/A'}
               </p>
             </div>
             <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
               <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
             </div>
           </div>
         </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Recommendation Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.recommendationRate ? `${analytics.recommendationRate.toFixed(1)}%` : '0%'}
              </p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
              <ThumbsUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Response Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.responseRate ? `${analytics.responseRate.toFixed(1)}%` : '0%'}
              </p>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      {analytics.ratingDistribution && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Rating Distribution</h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = analytics.ratingDistribution[rating] || 0;
              const percentage = analytics.totalFeedback > 0 ? (count / analytics.totalFeedback) * 100 : 0;
              return (
                <div key={rating} className="flex items-center">
                  <div className="flex items-center w-16">
                    <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">{rating}</span>
                    <Star className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-16 text-right">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Feedback */}
      {analytics.recentFeedback && analytics.recentFeedback.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Feedback</h3>
          <div className="space-y-4">
            {analytics.recentFeedback.slice(0, 3).map((feedback: any, index: number) => (
              <div key={index} className="border-l-4 border-emerald-500 pl-4 py-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < feedback.overallRating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      {feedback.overallRating}/5
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(feedback.submittedAt).toLocaleDateString()}
                  </span>
                </div>
                {feedback.additionalComments && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                    "{feedback.additionalComments}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const DemoFeedbackForm: React.FC<{ onFeedbackSuccess?: () => void }> = ({ onFeedbackSuccess }) => {
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [overallRating, setOverallRating] = useState<number>(0);
  const [contentQuality, setContentQuality] = useState<'excellent' | 'good' | 'average' | 'poor' | ''>("");
  const [instructorPerformance, setInstructorPerformance] = useState<'excellent' | 'good' | 'average' | 'poor' | ''>("");
  const [additionalComments, setAdditionalComments] = useState<string>("");
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [availableDemos, setAvailableDemos] = useState<any[]>([]);
  const [userFeedbacks, setUserFeedbacks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [feedbackStats, setFeedbackStats] = useState<any>(null);
  
  // Advanced feedback fields
  const [likedMost, setLikedMost] = useState<string>("");
  const [improvementAreas, setImprovementAreas] = useState<string>("");
  const [enrollmentInterest, setEnrollmentInterest] = useState<boolean>(false);
  const [consultationRequest, setConsultationRequest] = useState<boolean>(false);
  const [moreInfoRequest, setMoreInfoRequest] = useState<boolean>(false);
  const [specificCourseInterest, setSpecificCourseInterest] = useState<string>("");
  
  // Specific feedback ratings
  const [demoStructureRating, setDemoStructureRating] = useState<'excellent' | 'good' | 'average' | 'poor' | ''>("");
  const [technicalAspectsRating, setTechnicalAspectsRating] = useState<'excellent' | 'good' | 'average' | 'poor' | ''>("");
  const [interactionRating, setInteractionRating] = useState<'excellent' | 'good' | 'average' | 'poor' | ''>("");
  const [relevanceRating, setRelevanceRating] = useState<'excellent' | 'good' | 'average' | 'poor' | ''>("");

  // Fetch available demos and existing feedback on component mount
  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        setIsLoading(true);
        const { demoFeedbackHelpers } = await import('@/apis');
        
        // Fetch available demos for feedback
        const availableResponse = await demoFeedbackHelpers.getAvailableDemosForFeedback();
        if (availableResponse.success && availableResponse.data?.availableDemos) {
          setAvailableDemos(availableResponse.data.availableDemos);
        }
        
        // Fetch user's existing feedback
        const feedbackResponse = await demoFeedbackHelpers.getUserFeedback({
          limit: 20,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        });
        if (feedbackResponse.success && feedbackResponse.data?.feedbacks) {
          setUserFeedbacks(feedbackResponse.data.feedbacks);
        }
        
        // Fetch feedback statistics
        const statsResponse = await demoFeedbackHelpers.getFeedbackStats({
          period: 'month'
        });
        if (statsResponse.success && statsResponse.data) {
          setFeedbackStats(statsResponse.data);
        }
        
      } catch (error) {
        console.error('Error fetching feedback data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedbackData();
  }, []);

  const handleSubmitFeedback = async () => {
    if (!selectedSession || !overallRating || !contentQuality || !instructorPerformance || wouldRecommend === null) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { demoFeedbackHelpers } = await import('@/apis');
      
      const feedbackData = {
        demoBookingId: selectedSession,
        overallRating,
        contentQuality,
        instructorPerformance,
        wouldRecommend,
        additionalComments: additionalComments.trim() || undefined,
        likedMost: likedMost.trim() || undefined,
        improvementAreas: improvementAreas.trim() || undefined,
        specificFeedback: {
          demoStructure: demoStructureRating ? { rating: demoStructureRating } : undefined,
          technicalAspects: technicalAspectsRating ? { rating: technicalAspectsRating } : undefined,
          interaction: interactionRating ? { rating: interactionRating } : undefined,
          relevance: relevanceRating ? { rating: relevanceRating } : undefined,
        },
        followUpInterest: {
          enrollmentInterest,
          consultationRequest,
          moreInfoRequest,
          specificCourseInterest: specificCourseInterest.trim() || undefined,
        },
        feedbackSource: 'website_form' as const
      };

      // Validate feedback data
      const validation = demoFeedbackHelpers.validateFeedbackData(feedbackData);
      if (!validation.isValid) {
        alert(`Please fix the following errors:\n${validation.errors.join('\n')}`);
        return;
      }

      const response = await demoFeedbackHelpers.createFeedback(feedbackData);

      if (response.success) {
        alert("Thank you for your feedback! It has been submitted successfully.");
        
        // Refresh data after successful feedback submission
        if (onFeedbackSuccess) {
          onFeedbackSuccess();
        }
        
        // Reset form
        resetForm();
        
        // Refresh available demos and user feedback
        const availableResponse = await demoFeedbackHelpers.getAvailableDemosForFeedback();
        if (availableResponse.success && availableResponse.data?.availableDemos) {
          setAvailableDemos(availableResponse.data.availableDemos);
        }
        
        const feedbackResponse = await demoFeedbackHelpers.getUserFeedback({ limit: 20 });
        if (feedbackResponse.success && feedbackResponse.data?.feedbacks) {
          setUserFeedbacks(feedbackResponse.data.feedbacks);
        }
      } else {
        throw new Error(response.message || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert(`Failed to submit feedback: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedSession("");
    setOverallRating(0);
    setContentQuality("");
    setInstructorPerformance("");
    setAdditionalComments("");
    setWouldRecommend(null);
    setLikedMost("");
    setImprovementAreas("");
    setEnrollmentInterest(false);
    setConsultationRequest(false);
    setMoreInfoRequest(false);
    setSpecificCourseInterest("");
    setDemoStructureRating("");
    setTechnicalAspectsRating("");
    setInteractionRating("");
    setRelevanceRating("");
  };

  if (isLoading) {
  return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading feedback data...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header with Statistics */}
      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-6">
        <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-2 bg-emerald-500 rounded-full mr-4">
            <Star className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              Demo Session Feedback
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Help us improve by sharing your experience
            </p>
          </div>
          </div>
          
          {feedbackStats && (
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {feedbackStats.averageOverallRating?.toFixed(1) || 'N/A'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
            </div>
          )}
        </div>
      </div>

      {/* Existing Feedback Summary */}
      {userFeedbacks.length > 0 && (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Your Previous Feedback ({userFeedbacks.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userFeedbacks.slice(0, 4).map((feedback: any) => (
              <div key={feedback.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {'⭐'.repeat(feedback.overallRating)}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(feedback.submittedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                  {feedback.additionalComments || 'No comments provided'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feedback Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Submit New Feedback
        </h3>
        
        <div className="space-y-6">
          {/* Demo Session Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Which demo session would you like to provide feedback for? <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
            >
              <option value="">Select a demo session</option>
              {availableDemos.map((demo) => (
                <option key={demo.id} value={demo.id}>
                  {demo.demoType} - {new Date(demo.scheduledDateTime).toLocaleDateString()} 
                  {demo.instructor?.fullName && ` with ${demo.instructor.fullName}`}
                </option>
              ))}
            </select>
            {availableDemos.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                No completed demo sessions available for feedback.
              </p>
            )}
          </div>

          {/* Overall Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Overall Rating
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setOverallRating(rating)}
                  className={`p-2 rounded-lg border-2 transition-all duration-200 ${
                    overallRating >= rating
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-emerald-300'
                  }`}
                >
                  <Star
                    className={`w-6 h-6 ${
                      overallRating >= rating
                        ? 'text-emerald-500 fill-current'
                        : 'text-gray-400'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Content Quality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              How would you rate the content quality? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: 'excellent', label: 'Excellent', icon: '⭐⭐⭐⭐⭐' },
                { value: 'good', label: 'Good', icon: '⭐⭐⭐⭐' },
                { value: 'average', label: 'Average', icon: '⭐⭐⭐' },
                { value: 'poor', label: 'Poor', icon: '⭐⭐' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setContentQuality(option.value as 'excellent' | 'good' | 'average' | 'poor')}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    contentQuality === option.value
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-600'
                  }`}
                >
                  <div className="text-lg mb-1">{option.icon}</div>
                  <div className="text-sm font-medium">{option.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Instructor Performance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              How was the instructor's performance? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: 'excellent', label: 'Excellent', icon: '👨‍🏫⭐' },
                { value: 'good', label: 'Good', icon: '👨‍🏫✨' },
                { value: 'average', label: 'Average', icon: '👨‍🏫' },
                { value: 'poor', label: 'Poor', icon: '👨‍🏫❓' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setInstructorPerformance(option.value as 'excellent' | 'good' | 'average' | 'poor')}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    instructorPerformance === option.value
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-600'
                  }`}
                >
                  <div className="text-lg mb-1">{option.icon}</div>
                  <div className="text-sm font-medium">{option.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Additional Comments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Additional Comments
            </label>
            <textarea
              value={additionalComments}
              onChange={(e) => setAdditionalComments(e.target.value)}
              placeholder="Share your thoughts, suggestions, or any specific feedback about the demo session..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 resize-none"
            />
          </div>

          {/* Additional Comments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Additional Comments
            </label>
            <textarea
              value={additionalComments}
              onChange={(e) => setAdditionalComments(e.target.value)}
              placeholder="Share your thoughts, suggestions, or any specific feedback about the demo session..."
              rows={4}
              maxLength={2000}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 resize-none"
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {additionalComments.length}/2000 characters
            </div>
          </div>

          {/* What You Liked Most */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              What did you like most about the demo?
            </label>
            <textarea
              value={likedMost}
              onChange={(e) => setLikedMost(e.target.value)}
              placeholder="Tell us what stood out to you..."
              rows={3}
              maxLength={1000}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 resize-none"
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {likedMost.length}/1000 characters
            </div>
          </div>

          {/* Areas for Improvement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Areas for Improvement
            </label>
            <textarea
              value={improvementAreas}
              onChange={(e) => setImprovementAreas(e.target.value)}
              placeholder="How can we make our demos better?"
              rows={3}
              maxLength={1000}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 resize-none"
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {improvementAreas.length}/1000 characters
            </div>
          </div>

          {/* Recommendation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Would you recommend this demo to others? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setWouldRecommend(true)}
                className={`p-4 rounded-lg border text-center transition-all ${
                  wouldRecommend === true
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                    : 'border-gray-300 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-600'
                }`}
              >
                <div className="text-2xl mb-2">👍</div>
                <div className="font-medium">Yes, I would recommend</div>
              </button>
              <button
                type="button"
                onClick={() => setWouldRecommend(false)}
                className={`p-4 rounded-lg border text-center transition-all ${
                  wouldRecommend === false
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                    : 'border-gray-300 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-600'
                }`}
              >
                <div className="text-2xl mb-2">👎</div>
                <div className="font-medium">No, I would not recommend</div>
              </button>
            </div>
          </div>

          {/* Follow-up Interest */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Follow-up Interest
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                  <input
                  type="checkbox"
                  checked={enrollmentInterest}
                  onChange={(e) => setEnrollmentInterest(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                  I'm interested in enrolling in a full course
                </span>
                </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={consultationRequest}
                  onChange={(e) => setConsultationRequest(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                  I'd like a one-on-one consultation
                </span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={moreInfoRequest}
                  onChange={(e) => setMoreInfoRequest(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                  I need more information about the courses
                </span>
              </label>
            </div>
            
            {(enrollmentInterest || consultationRequest || moreInfoRequest) && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Specific Course Interest
                </label>
                <input
                  type="text"
                  value={specificCourseInterest}
                  onChange={(e) => setSpecificCourseInterest(e.target.value)}
                  placeholder="Which course are you most interested in?"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                />
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleSubmitFeedback}
              disabled={isSubmitting || !selectedSession || !overallRating || !contentQuality || !instructorPerformance || wouldRecommend === null}
              className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg transition-colors font-medium ${
                isSubmitting || !selectedSession || !overallRating || !contentQuality || !instructorPerformance || wouldRecommend === null
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              } text-white`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Submitting Feedback...
                </>
              ) : (
                <>
                  <Star className="w-5 h-5 mr-2" />
                  Submit Comprehensive Feedback
                </>
              )}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Reset Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentDemoClasses: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [allDemoClasses, setAllDemoClasses] = useState<DemoClass[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<DemoClass[]>([]);
  const [completedClasses, setCompletedClasses] = useState<DemoClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<DemoClass | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [showRescheduleModal, setShowRescheduleModal] = useState<boolean>(false);
  const [rescheduleBookingId, setRescheduleBookingId] = useState<string>("");
  const [selectedRescheduleSlot, setSelectedRescheduleSlot] = useState<string>("");
  const [rescheduleSlots, setRescheduleSlots] = useState<any[]>([]);
  const [isLoadingRescheduleSlots, setIsLoadingRescheduleSlots] = useState<boolean>(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());

  // Main function to fetch demo classes data
  const fetchDemoClasses = useCallback(async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get user ID from localStorage
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setIsLoading(false);
          return;
        }

        // Import APIs dynamically
      const { demoBookingHelpers, demoFeedbackHelpers } = await import('@/apis');

        // Fetch user's demo bookings
        try {
          const bookingsResponse = await demoBookingHelpers.getCurrentUserBookings();
          if (bookingsResponse.success && bookingsResponse.data?.bookings) {
            const bookings = bookingsResponse.data.bookings;
            setUserBookings(bookings);

            // Transform bookings to DemoClass format
            const transformedClasses: DemoClass[] = bookings.map((booking: any) => ({
              id: booking._id || booking.id,
              title: booking.demoType || booking.title || "Demo Session",
              instructor: {
              name: booking.instructor?.full_name || booking.instructorName || "TBD",
              rating: booking.instructor?.rating || 4.8
              },
              category: booking.demoType || "General",
            duration: booking.durationMinutes || 60,
            scheduledDate: booking.scheduledDateTime || booking.timeSlot,
              status: booking.status === 'confirmed' ? 'upcoming' : 
                      booking.status === 'completed' ? 'completed' : 
                    booking.status === 'live' ? 'live' : 
                    booking.status === 'pending' ? 'upcoming' : 'upcoming',
            level: booking.experienceLevel || 'beginner',
              participants: booking.participantCount || 1,
              maxParticipants: 50,
            description: booking.requirements || booking.notes || "Live demo session with expert instructor",
            meetingLink: booking.meetingLink || booking.zoomMeeting?.join_url,
            meetingId: booking.meetingId || booking.zoomMeeting?.id,
            meetingPassword: booking.meetingPassword || booking.zoomMeeting?.password,
            zoomMeeting: booking.zoomMeeting
            }));

            setAllDemoClasses(transformedClasses);
            
            // Filter by status
            setUpcomingClasses(transformedClasses.filter(cls => 
              cls.status === 'upcoming' || cls.status === 'live'
            ));
            setCompletedClasses(transformedClasses.filter(cls => 
              cls.status === 'completed'
            ));
          }
        } catch (bookingError) {
          console.warn('Could not fetch user bookings:', bookingError);
          // Continue with empty arrays
        }

        // Fetch available slots for future bookings
        try {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format
        
        const slotsResponse = await demoBookingHelpers.getAvailableSlots(dateStr, {
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          demoType: 'course_demo'
        });
        
        if (slotsResponse.success && slotsResponse.data?.slots) {
          setAvailableSlots(slotsResponse.data.slots);
          }
        } catch (slotsError) {
          console.warn('Could not fetch available slots:', slotsError);
        }
        
      } catch (err) {
        console.error("Error fetching demo classes:", err);
        setError("Failed to load demo classes. Please try again later.");
      } finally {
        setIsLoading(false);
      setLastRefreshTime(new Date());
      }
  }, []);

  useEffect(() => {
    fetchDemoClasses();
  }, [fetchDemoClasses]);

  // Handle tab change with data refresh
  const handleTabChange = useCallback(async (tabIndex: number) => {
    setCurrentTab(tabIndex);
    // Refresh data when switching tabs to ensure fresh content
    await fetchDemoClasses();
  }, [fetchDemoClasses]);

  const tabs = [
    { 
      name: "Book Demo", 
      icon: "calendar-plus",
      content: [], 
      description: "Schedule a new demo session",
      count: null
    },
    { 
      name: "My Sessions", 
      icon: "calendar",
      content: allDemoClasses, 
      description: "View all your demo sessions",
      count: allDemoClasses.length
    },
    { 
      name: "Certificates", 
      icon: "award",
      content: completedClasses, 
      description: "Download completion certificates",
      count: completedClasses.length
    },
    { 
      name: "Feedback", 
      icon: "star",
      content: [], 
      description: "Rate your demo experience",
      count: null
    },
  ];

  const handleViewDetails = (demoClass: DemoClass) => {
    setSelectedClass(demoClass);
  };

  // Fetch available slots for rescheduling
  const fetchRescheduleSlots = async (bookingId: string) => {
    setIsLoadingRescheduleSlots(true);
    try {
      const { demoBookingHelpers } = await import('@/apis');
      
      // Get next 7 days for rescheduling options
      const slots = [];
      const now = new Date();
      
      for (let day = 1; day <= 7; day++) {
        const date = new Date(now.getTime() + (day * 24 * 60 * 60 * 1000));
        const dateStr = date.toISOString().split('T')[0];
        
        const response = await demoBookingHelpers.getAvailableSlots(dateStr, {
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          demoType: 'course_demo',
          durationMinutes: 60
        });
        
        if (response.success && response.data?.slots) {
          const daySlots = response.data.slots
            .filter((slot: any) => slot.available)
            .map((slot: any) => ({
              ...slot,
              dayLabel: date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              })
            }));
          slots.push(...daySlots);
        }
      }
      
      setRescheduleSlots(slots);
    } catch (error) {
      console.error('Error fetching reschedule slots:', error);
      alert('Failed to load available time slots. Please try again.');
    } finally {
      setIsLoadingRescheduleSlots(false);
    }
  };

  // Handle reschedule modal open
  const handleOpenReschedule = async (demoClass: DemoClass) => {
    setRescheduleBookingId(demoClass.id);
    setShowRescheduleModal(true);
    setSelectedRescheduleSlot("");
    await fetchRescheduleSlots(demoClass.id);
  };

  // Handle reschedule submission
  const handleRescheduleSubmit = async () => {
    if (!selectedRescheduleSlot || !rescheduleBookingId) {
      alert('Please select a new time slot.');
      return;
    }

    try {
      const { demoBookingHelpers } = await import('@/apis');
      
      const response = await demoBookingHelpers.rescheduleBooking(
        rescheduleBookingId,
        selectedRescheduleSlot,
        'User requested reschedule via dashboard'
      );
      
      if (response.success) {
        alert('Session rescheduled successfully!');
        setShowRescheduleModal(false);
        setRescheduleBookingId("");
        setSelectedRescheduleSlot("");
        
        // Refresh the data immediately
        await fetchDemoClasses();
      } else {
        throw new Error(response.message || 'Failed to reschedule session');
      }
    } catch (error) {
      console.error('Error rescheduling:', error);
      alert(`Failed to reschedule: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCloseModal = () => {
    setSelectedClass(null);
  };

  const handleDemoAction = async (demoClass: DemoClass) => {
    try {
      const { demoBookingHelpers } = await import('@/apis');
      
      if (demoClass.status === 'live') {
        // Get booking details to access meeting link
        const bookingResponse = await demoBookingHelpers.getBookingById(demoClass.id);
        
        if (bookingResponse.success && bookingResponse.data?.booking?.meetingLink) {
          window.open(bookingResponse.data.booking.meetingLink, '_blank');
          } else {
            alert('Meeting link not available yet. Please try again later.');
        }
      } else if (demoClass.status === 'upcoming') {
        // Open reschedule modal
        await handleOpenReschedule(demoClass);
      } else if (demoClass.status === 'completed') {
        // Switch to feedback tab
        setCurrentTab(4);
      }
    } catch (error) {
      console.error('Error handling demo action:', error);
      alert(`An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const filteredContent = tabs[currentTab].content.filter(demoClass => 
    demoClass?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="flex items-center gap-3"
        >
          <MonitorPlay className="w-8 h-8 text-primary-500" />
          <span className="text-gray-600 dark:text-gray-400 text-lg">Loading your demo classes...</span>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-6 bg-red-50 dark:bg-red-900/20 rounded-lg max-w-md">
          <MonitorPlay className="w-12 h-12 text-red-500" />
          <h3 className="text-xl font-semibold text-red-700 dark:text-red-400">Error Loading Demo Classes</h3>
          <p className="text-red-600 dark:text-red-300 text-center">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 lg:p-12 rounded-lg max-w-7xl mx-auto"
    >
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="text-center pt-6 pb-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-center mb-4"
          >
            <div className="p-2 bg-primary-100/80 dark:bg-primary-900/30 rounded-xl backdrop-blur-sm mr-3">
              <MonitorPlay className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Demo Classes
            </h1>
          </motion.div>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4 mb-6">
            Schedule new demo classes, manage your bookings, and access your demo session materials
            <span className="block mt-2 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full inline-block">
              ⚡ Smart refresh on interactions
            </span>
          </p>

          {/* Search and Actions Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
            {/* Manual Refresh Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fetchDemoClasses()}
              className="flex items-center px-4 py-2.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors font-medium"
              title="Manually refresh demo classes"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </motion.button>

          {/* Search Bar */}
          <motion.div 
              className="relative flex-1 max-w-md"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search demo classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
            />
          </motion.div>
          </div>
        </div>

        {/* Tabs - responsive container */}
        <div className="flex justify-center px-4">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 overflow-x-auto scrollbar-hide max-w-full">
            <div className="flex space-x-1 min-w-max">
            {tabs.map((tab, idx) => {
              return (
                <TabButton
                  key={idx}
                  active={currentTab === idx}
                    onClick={() => handleTabChange(idx)}
                    icon={tab.icon}
                    description={tab.description}
                    count={tab.count}
                >
                    {tab.name}
                </TabButton>
              );
            })}
            </div>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {currentTab === 0 ? (
            // Tab 0: Book Demo - Show booking component
            <motion.div
              key="demo-booking"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <MemoizedDemoBookingComponent onBookingSuccess={fetchDemoClasses} />
            </motion.div>
          ) : currentTab === 1 ? (
            // Tab 1: My Sessions - Show all demo classes
            <motion.div
              key="my-sessions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Session Status Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {upcomingClasses.length}
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">Upcoming</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {completedClasses.length}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">Completed</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                    {allDemoClasses.length}
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">Total</div>
                </div>
              </div>

              {/* Sessions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContent.length > 0 ? (
                filteredContent.map((demoClass, index) => (
                  <motion.div
                    key={demoClass.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <DemoClassCard
                      demoClass={demoClass}
                      onViewMaterials={handleViewDetails}
                      onDemoAction={handleDemoAction}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="col-span-full flex flex-col items-center justify-center text-center py-12"
                >
                    <Calendar className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {searchTerm ? "No sessions found" : "No demo sessions yet"}
                  </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {searchTerm 
                      ? "Try adjusting your search term to find what you're looking for."
                        : "Book your first demo session to get started!"}
                    </p>
                    {!searchTerm && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleTabChange(0)}
                        className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        <CalendarPlus className="w-4 h-4 mr-2" />
                        Book Demo Session
                      </motion.button>
              )}
            </motion.div>
          )}
              </div>
            </motion.div>
          ) : currentTab === 2 ? (
            // Tab 2: Certificates - Show certificates section
            <motion.div
              key="certificates"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <DemoCertificatesSection completedClasses={completedClasses} />
            </motion.div>
          ) : currentTab === 3 ? (
            // Tab 3: Feedback - Show feedback form
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <DemoFeedbackForm onFeedbackSuccess={fetchDemoClasses} />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Details Modal */}
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
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl max-w-md w-full relative"
              >
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </motion.button>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Demo Class Details
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedClass?.title}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Instructor</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{selectedClass?.instructor?.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Schedule</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedClass?.scheduledDate ? new Date(selectedClass.scheduledDate).toLocaleString() : "Not scheduled"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Duration</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedClass?.duration ? `${selectedClass.duration} minutes` : "Duration TBD"}
                      </p>
                    </div>
                  </div>

                  {selectedClass?.description && (
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-primary-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Description</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{selectedClass.description}</p>
                      </div>
                    </div>
                  )}

                  {(!selectedClass?.description) && (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                      No additional details available for this demo class.
                    </p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reschedule Modal */}
        <AnimatePresence>
          {showRescheduleModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50"
              onClick={() => setShowRescheduleModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl max-w-md w-full relative"
              >
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowRescheduleModal(false)}
                  className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </motion.button>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Reschedule Demo Session
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Select a new time slot for your demo session
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Available Time Slots
                    </label>
                    
                    {isLoadingRescheduleSlots ? (
                      <div className="flex items-center justify-center py-8">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full"
                        />
                        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading available slots...</span>
                      </div>
                    ) : rescheduleSlots.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 dark:text-gray-400">No available slots found for the next 7 days.</p>
                      </div>
                    ) : (
                      <select
                        value={selectedRescheduleSlot}
                        onChange={(e) => setSelectedRescheduleSlot(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      >
                        <option value="">Select a time slot</option>
                        {rescheduleSlots.map((slot, index) => (
                          <option key={index} value={slot.datetime}>
                            {slot.dayLabel} - {slot.display_time}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowRescheduleModal(false)}
                      className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleRescheduleSubmit}
                      disabled={!selectedRescheduleSlot || isLoadingRescheduleSlots}
                      className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Reschedule
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const DemoClassesDashboard: React.FC = () => {
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
      <StudentDemoClasses />
    </StudentDashboardLayout>
  );
};

export default DemoClassesDashboard; 
