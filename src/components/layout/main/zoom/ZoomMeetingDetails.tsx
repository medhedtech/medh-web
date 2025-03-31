"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Clock, 
  Calendar, 
  Users, 
  Link, 
  Video, 
  Copy, 
  ExternalLink, 
  CheckCircle, 
  X, 
  Play, 
  AlertCircle,
  FileText
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface MeetingDetails {
  id: number;
  title: string;
  host: string;
  hostImage?: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  meetingLink: string;
  password?: string;
  description?: string;
  course?: string;
  courseId?: string;
  status: "upcoming" | "live" | "completed";
  participants?: number;
  materials?: {
    title: string;
    type: string;
    url: string;
  }[];
}

interface ZoomMeetingDetailsProps {
  meetingId: string;
  meetingDetails: MeetingDetails;
}

const ZoomMeetingDetails: React.FC<ZoomMeetingDetailsProps> = ({ meetingId, meetingDetails }) => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  const [activeTab, setActiveTab] = useState<'details' | 'materials'>('details');
  
  // Parse meeting date/time
  const meetingDate = new Date(`${meetingDetails.date} ${meetingDetails.startTime}`);
  const formattedDate = meetingDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Calculate time remaining
  useEffect(() => {
    if (meetingDetails.status === 'upcoming') {
      const calculateTimeRemaining = () => {
        const now = new Date();
        const difference = meetingDate.getTime() - now.getTime();
        
        if (difference <= 0) {
          setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          return;
        }
        
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeRemaining({ days, hours, minutes, seconds });
      };
      
      calculateTimeRemaining();
      const interval = setInterval(calculateTimeRemaining, 1000);
      
      return () => clearInterval(interval);
    }
  }, [meetingDate, meetingDetails.status]);
  
  // Copy meeting link to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Join meeting function
  const joinMeeting = () => {
    window.open(meetingDetails.meetingLink, '_blank');
  };
  
  // Style variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-900/50';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-900/50';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live':
        return <Play className="w-4 h-4" />;
      case 'upcoming':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };
  
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto px-4 py-8 sm:px-6 lg:px-8"
    >
      {/* Breadcrumbs */}
      <motion.div variants={itemVariants} className="mb-6 text-sm">
        <nav className="flex items-center text-gray-500 dark:text-gray-400">
          <button 
            onClick={() => router.push('/zoom/meetings')}
            className="hover:text-primary-600 dark:hover:text-primary-400"
          >
            Meetings
          </button>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-white font-medium">Meeting Details</span>
        </nav>
      </motion.div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Meeting Info Card */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-2"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
            {/* Meeting Header */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-primary-800/90 mix-blend-multiply"></div>
              <div className="h-32 sm:h-40 bg-gradient-to-r from-primary-500 to-primary-700 dark:from-primary-700 dark:to-primary-900"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(meetingDetails.status)}`}>
                  {getStatusIcon(meetingDetails.status)}
                  <span className="capitalize">{meetingDetails.status}</span>
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold mt-2">{meetingDetails.title}</h1>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-white/90">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{meetingDetails.startTime} - {meetingDetails.endTime}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Meeting Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`py-4 px-6 text-sm font-medium focus:outline-none ${
                    activeTab === 'details'
                      ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Meeting Details
                </button>
                <button
                  onClick={() => setActiveTab('materials')}
                  className={`py-4 px-6 text-sm font-medium focus:outline-none ${
                    activeTab === 'materials'
                      ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Materials
                </button>
              </div>
            </div>
            
            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'details' ? (
                <>
                  {/* Host Info */}
                  <div className="flex items-center mb-6">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mr-4">
                      {meetingDetails.hostImage ? (
                        <Image
                          src={meetingDetails.hostImage}
                          alt={meetingDetails.host}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Users className="w-6 h-6 text-gray-500 dark:text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-gray-900 dark:text-white font-medium">Host</h3>
                      <p className="text-gray-600 dark:text-gray-300">{meetingDetails.host}</p>
                    </div>
                  </div>
                  
                  {/* Meeting Description */}
                  {meetingDetails.description && (
                    <div className="mb-6">
                      <h3 className="text-gray-900 dark:text-white font-medium mb-2">Description</h3>
                      <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                        {meetingDetails.description}
                      </p>
                    </div>
                  )}
                  
                  {/* Related Course */}
                  {meetingDetails.course && (
                    <div className="mb-6">
                      <h3 className="text-gray-900 dark:text-white font-medium mb-2">Related Course</h3>
                      <button 
                        onClick={() => meetingDetails.courseId && router.push(`/courses/${meetingDetails.courseId}`)}
                        className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                      >
                        <span>{meetingDetails.course}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  {meetingDetails.materials && meetingDetails.materials.length > 0 ? (
                    meetingDetails.materials.map((material, index) => (
                      <div 
                        key={index}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                      >
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-gray-900 dark:text-white font-medium">{material.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{material.type}</p>
                        </div>
                        <a 
                          href={material.url}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 text-primary-600 dark:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <div className="p-3 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full inline-flex items-center justify-center mb-4">
                        <FileText className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                      </div>
                      <h3 className="text-gray-900 dark:text-white font-medium">No Materials Available</h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Materials will be added by the host before the meeting starts.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Meeting Actions Card */}
        <motion.div variants={itemVariants}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Meeting Actions</h2>
              
              {/* Countdown Timer (for upcoming meetings) */}
              {meetingDetails.status === 'upcoming' && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Time Until Meeting</h3>
                  <div className="flex space-x-3 justify-between">
                    <div className="flex-1 bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-gray-900 dark:text-white">{timeRemaining.days}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Days</div>
                    </div>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-gray-900 dark:text-white">{timeRemaining.hours}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Hours</div>
                    </div>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-gray-900 dark:text-white">{timeRemaining.minutes}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Minutes</div>
                    </div>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-gray-900 dark:text-white">{timeRemaining.seconds}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Seconds</div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Join Button */}
              <button
                onClick={joinMeeting}
                disabled={meetingDetails.status === 'completed'}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium mb-4 ${
                  meetingDetails.status === 'completed'
                    ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                    : meetingDetails.status === 'live'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-primary-600 hover:bg-primary-700 text-white'
                }`}
              >
                {meetingDetails.status === 'live' ? (
                  <>
                    <Video className="w-5 h-5" />
                    Join Now
                  </>
                ) : meetingDetails.status === 'upcoming' ? (
                  <>
                    <Calendar className="w-5 h-5" />
                    Join When Available
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5" />
                    Meeting Ended
                  </>
                )}
              </button>
              
              {/* Meeting Link */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Meeting Link</h3>
                <div className="flex items-center bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3">
                  <input
                    type="text"
                    value={meetingDetails.meetingLink}
                    readOnly
                    className="flex-1 bg-transparent border-none text-gray-900 dark:text-white text-sm focus:outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(meetingDetails.meetingLink)}
                    className="ml-2 p-1.5 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 rounded-md transition-colors"
                  >
                    {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Click to copy the meeting link
                </p>
              </div>
              
              {/* Meeting Password (if available) */}
              {meetingDetails.password && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Password</h3>
                  <div className="flex items-center bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3">
                    <input
                      type="text"
                      value={meetingDetails.password}
                      readOnly
                      className="flex-1 bg-transparent border-none text-gray-900 dark:text-white text-sm focus:outline-none"
                    />
                    <button
                      onClick={() => copyToClipboard(meetingDetails.password!)}
                      className="ml-2 p-1.5 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 rounded-md transition-colors"
                    >
                      {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}
              
              {/* Add to Calendar */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Add to Calendar</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="py-2 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700/50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors">
                    Google Calendar
                  </button>
                  <button className="py-2 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700/50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors">
                    Apple Calendar
                  </button>
                </div>
              </div>
              
              {/* Participants (if any) */}
              {meetingDetails.participants && (
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Participants</h3>
                  <div className="flex items-center bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3">
                    <Users className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-gray-900 dark:text-white text-sm">
                      {meetingDetails.participants} {meetingDetails.participants === 1 ? 'Person' : 'People'} Attending
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ZoomMeetingDetails; 