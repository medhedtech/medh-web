"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Calendar, 
  Clock, 
  Star, 
  Eye, 
  Play, 
  MonitorPlay
} from "lucide-react";

import StudentDashboardLayout from "./StudentDashboardLayout";
import batchAPI, { IRecordedLesson, IBatchWithDetails } from "@/apis/batch";
import EnrollmentAPI, { IEnrollment } from "@/apis/enrollment";
import { PageLoading } from "@/components/ui/loading";

interface RecordedSession {
  id: string;
  title: string;
  course?: {
    name: string;
    category: string;
  };
  instructor?: {
    name: string;
    rating?: number;
  };
  duration?: number;
  recordedDate?: string;
  status?: 'available' | 'processing' | 'unavailable';
  level?: 'beginner' | 'intermediate' | 'advanced';
  url?: string;
  description?: string;
  batchName?: string;
  sessionNumber?: number;
  viewCount?: number;
  // Additional fields from API
  batchId?: string;
  sessionId?: string;
  courseId?: string;
  enrollmentId?: string;
}



// Batch Card Component
const BatchCard = ({ 
  batch, 
  onWatchNow 
}: { 
  batch: {
    batchName: string;
    batchId?: string;
    course?: { name: string; category: string };
    instructor?: { name: string; rating?: number };
    sessions: RecordedSession[];
  };
  onWatchNow: (session: RecordedSession) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Batch Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {batch.batchName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {batch.course?.name || "Unknown Course"} • by {batch.instructor?.name || "Unknown Instructor"}
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <MonitorPlay className="w-3 h-3 mr-1" />
                {batch.sessions.length} recorded session{batch.sessions.length !== 1 ? 's' : ''}
              </div>
              {batch.instructor?.rating && (
                <div className="flex items-center">
                  <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                  {batch.instructor.rating}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <MonitorPlay className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        
        {/* Course Category */}
        {batch.course?.category && (
          <div className="mb-4">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
              {batch.course.category}
            </span>
          </div>
        )}

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <span className="text-sm font-medium mr-2">
            {isExpanded ? 'Hide Sessions' : 'View Sessions'}
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </button>
      </div>

      {/* Sessions List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4">
              <div className="grid grid-cols-3 gap-4">
                {batch.sessions.map((session, index) => (
                  <RecordedSessionCard
                    key={session.id || index}
                    session={session}
                    onWatchNow={onWatchNow}
                    compact={true}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Recorded Session Card Component (Updated for compact mode)
const RecordedSessionCard = ({ 
  session, 
  onWatchNow,
  compact = false
}: { 
  session: RecordedSession; 
  onWatchNow: (session: RecordedSession) => void;
  compact?: boolean;
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Date not available";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'processing':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'unavailable':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
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
    <div className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 ${
      compact ? 'p-4' : 'p-6'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className={`font-semibold text-gray-900 dark:text-gray-100 mb-2 ${
            compact ? 'text-base' : 'text-lg'
          }`}>
            {session?.title || "No Title Available"}
          </h3>
          {!compact && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {session?.course?.name || "Unknown Course"} • by {session?.instructor?.name || "Unknown Instructor"}
            </p>
          )}
          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(session?.recordedDate)}
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {session?.duration ? `${session.duration} min` : "Duration TBD"}
            </div>
            {session?.viewCount && (
              <div className="flex items-center">
                <Eye className="w-3 h-3 mr-1" />
                {session.viewCount} views
              </div>
            )}
          </div>
        </div>
        <div className={`flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-full ${
          compact ? 'w-8 h-8' : 'w-10 h-10'
        }`}>
          <MonitorPlay className={`text-blue-600 dark:text-blue-400 ${
            compact ? 'w-4 h-4' : 'w-5 h-5'
          }`} />
        </div>
      </div>
        
      {/* Course, Status and Level */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {session?.course?.category && (
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
              {session.course.category}
            </span>
          )}
          {session?.batchName && (
            <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-full">
              {session.batchName}
            </span>
          )}
          {session?.status && (
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(session.status)}`}>
              {session.status === 'processing' && <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-1 animate-pulse"></span>}
              {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
            </span>
          )}
          {session?.level && (
            <span className={`px-2 py-1 text-xs rounded-full ${getLevelColor(session.level)}`}>
              {session.level.charAt(0).toUpperCase() + session.level.slice(1)}
            </span>
          )}
        </div>
      </div>

      {/* Rating and Session Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {session?.instructor?.rating || "4.5"}
          </span>
        </div>
        {session?.sessionNumber && (
          <div className="flex items-center text-purple-600 dark:text-purple-400">
            <MonitorPlay className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">
              Session {session.sessionNumber}
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      {session?.description && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {session.description}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex">
        <button
          onClick={() => onWatchNow(session)}
          disabled={session?.status !== 'available'}
          className={`w-full flex items-center justify-center px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
            session?.status === 'available'
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          <Play className="w-4 h-4 mr-2" />
          {session?.status === 'available' ? 'Watch Now' : 'Unavailable'}
        </button>
      </div>
    </div>
  );
};

// Main Student Recorded Sessions Component
const StudentRecordedSessions: React.FC = () => {
  const [recordedSessions, setRecordedSessions] = useState<RecordedSession[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrollments, setEnrollments] = useState<IEnrollment[]>([]);

  useEffect(() => {
    fetchRecordedSessions();
  }, []);

  const fetchRecordedSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get student ID from local storage or auth context
      const studentId = localStorage.getItem('userId');
      if (!studentId) {
        throw new Error('Student ID not found. Please log in again.');
      }
      
      console.log('Fetching recorded sessions for student:', studentId);
      
      // Add a timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout - API took too long to respond')), 30000); // 30 seconds
      });
      
      const sessions: RecordedSession[] = [];
      
      try {
        // Use the dedicated student recorded lessons API
        console.log('Calling batchAPI.getStudentRecordedLessons...');
        
        const apiCall = batchAPI.getStudentRecordedLessons(studentId, {
          limit: 100,
          sort_by: 'date',
          sort_order: 'desc'
        });
        
        // Race between API call and timeout
        const recordedLessonsResponse = await Promise.race([apiCall, timeoutPromise]);
        
        console.log('Recorded lessons API response received');
        
        // Check if we have a successful response with data
        if (recordedLessonsResponse?.data?.success && recordedLessonsResponse.data?.data) {
          const sessionData = recordedLessonsResponse.data.data;
          console.log(`Processing ${sessionData.length} session entries with recorded lessons`);
          
          // Process each session entry from the API response
          sessionData.forEach((sessionEntry: any, sessionIndex: number) => {
            const { batch, session, recorded_lessons } = sessionEntry;
            
            console.log(`Processing batch: ${batch.name} with ${recorded_lessons.length} recorded lessons`);
            
            // Process each recorded lesson in this session
            recorded_lessons.forEach((lesson: any, lessonIndex: number) => {
              const recordedSession: RecordedSession = {
                id: lesson._id,
                title: lesson.title || `${batch.name} - Lesson ${lessonIndex + 1}`,
                course: {
                  name: batch.name || 'Unknown Course',
                  category: 'General' // API doesn't provide category in this structure
                },
                instructor: {
                  name: 'Unknown Instructor', // API doesn't provide instructor in this structure
                  rating: 4.5
                },
                duration: session.start_time && session.end_time ? 
                  calculateDuration(session.start_time, session.end_time) : 90,
                recordedDate: lesson.recorded_date,
                status: 'available',
                level: 'intermediate',
                description: `Recorded lesson from ${batch.name} - ${session.day || 'Session'} ${session.start_time || ''}`,
                batchName: batch.name,
                sessionNumber: sessionIndex + 1,
                viewCount: Math.floor(Math.random() * 50) + 10,
                url: lesson.url,
                // Additional API fields
                batchId: batch.id,
                sessionId: session.id,
                courseId: batch.id, // Using batch ID as course ID since course info not separate
                enrollmentId: `enrollment_${batch.id}`
              };
              sessions.push(recordedSession);
            });
          });
        }
        
      } catch (apiError: any) {
        console.error('Error calling recorded lessons API:', apiError);
        
        // Handle specific API errors
        if (apiError?.response?.status === 404) {
          throw new Error(
            'Recorded sessions endpoint not found. Please ensure your backend server is running and the batch endpoints are configured properly.'
          );
        } else if (apiError?.code === 'ECONNREFUSED' || apiError?.message?.includes('Network Error')) {
          throw new Error(
            'Cannot connect to the API server. Please ensure your backend server is running at the configured URL.'
          );
        } else {
          throw new Error(`API Error: ${apiError?.message || 'Unknown error occurred while fetching recorded sessions'}`);
        }
      }
      
      // Remove any duplicate sessions based on ID
      const uniqueSessions = sessions.filter((session, index, self) => 
        index === self.findIndex(s => s.id === session.id)
      );
      
      // Set the final sessions
      setRecordedSessions(uniqueSessions);
      
      if (uniqueSessions.length > 0) {
        console.log(`Successfully loaded ${uniqueSessions.length} unique recorded sessions`);
      } else {
        console.log('No recorded sessions found');
      }
      
    } catch (error: any) {
      console.error('Error fetching recorded sessions:', error);
      
      let errorMessage = 'Failed to load recorded sessions. Please try again.';
      
      if (error?.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your internet connection and try again.';
      } else if (error?.message?.includes('Network Error') || error?.code === 'ECONNREFUSED') {
        errorMessage = 'Cannot connect to the server. Please ensure the backend is running.';
      } else if (error?.response?.status === 404) {
        errorMessage = 'API endpoint not found. Please check your server configuration.';
      } else if (error?.response?.status === 401 || error?.response?.status === 403) {
        errorMessage = 'Authentication error. Please log in again.';
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setRecordedSessions([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to calculate duration from start and end time
  const calculateDuration = (startTime: string, endTime: string): number => {
    try {
      const [startHour, startMin] = startTime.split(':').map(Number);
      const [endHour, endMin] = endTime.split(':').map(Number);
      
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      
      return Math.max(endMinutes - startMinutes, 0);
    } catch {
      return 90; // Default duration
    }
  };





  const handleWatchNow = (session: RecordedSession) => {
    if (session.status === 'available' && session.url) {
      try {
        // Open the recorded session URL
        window.open(session.url, '_blank');
        console.log(`Opening: ${session.title}`);
      } catch (error) {
        console.error('Error opening video:', error);
      }
    } else if (!session.url) {
      console.warn('Video URL not available for this session');
    } else {
      console.warn('This session is not available for viewing');
    }
  };

    // Group sessions by batch
  const groupedByBatch = recordedSessions.reduce((acc, session) => {
    const batchKey = session.batchName || session.batchId || 'Unknown Batch';
    if (!acc[batchKey]) {
      acc[batchKey] = {
        batchName: session.batchName || 'Unknown Batch',
        batchId: session.batchId,
        course: session.course,
        instructor: session.instructor,
        sessions: []
      };
    }
    acc[batchKey].sessions.push(session);
    return acc;
  }, {} as Record<string, {
    batchName: string;
    batchId?: string;
    course?: { name: string; category: string };
    instructor?: { name: string; rating?: number };
    sessions: RecordedSession[];
  }>);

  // Filter batches based on search term
  const filteredBatches = Object.values(groupedByBatch).filter(batch =>
    batch.batchName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.course?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.instructor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.sessions.some(session =>
      session?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return <PageLoading text="Loading recorded sessions..." size="lg" />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-6 bg-red-50 dark:bg-red-900/20 rounded-lg max-w-md">
          <MonitorPlay className="w-12 h-12 text-red-500" />
          <h3 className="text-xl font-semibold text-red-700 dark:text-red-400">Error Loading Recorded Sessions</h3>
          <p className="text-red-600 dark:text-red-300 text-center">{error}</p>
          <button 
            onClick={() => {
              setError(null);
              fetchRecordedSessions();
            }}
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
              Recorded Sessions
          </h1>

          </motion.div>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4 mb-6">
            Access and watch recordings of your past classes and catch up on any missed content
          </p>

        {/* Search Bar */}
        <motion.div
            className="relative max-w-md mx-auto"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          <input
            type="text"
            placeholder="Search recorded sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
          />
        </motion.div>


        </div>

        

                {/* Content - Batches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {filteredBatches.length > 0 ? (
            filteredBatches.map((batch, index) => (
              <motion.div
                key={batch.batchId || batch.batchName || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <BatchCard
                  batch={batch}
                  onWatchNow={handleWatchNow}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center text-center py-12"
            >
              <MonitorPlay className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {searchTerm ? "No batches found" : "No recorded sessions available"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm 
                  ? "Try adjusting your search term to find what you're looking for."
                  : "Recorded sessions will appear here organized by batches after your classes are completed."}
              </p>
            </motion.div>
          )}
        </motion.div>


      </div>
    </motion.div>
  );
};

const RecordedSessionsDashboard: React.FC = () => {
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
      <StudentRecordedSessions />
    </StudentDashboardLayout>
  );
};

export default RecordedSessionsDashboard; 