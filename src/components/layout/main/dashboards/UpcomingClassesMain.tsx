"use client";

import React, { Suspense, useState, useEffect, useMemo } from 'react';
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Video,
  Users,
  CalendarClock,
  Play,
  Eye,
  BookOpen,
  Search,
  Filter,
  Timer,
  GraduationCap,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';
import Image from 'next/image';
import moment from 'moment';
import { UpcomingClassCard, type IUpcomingClass } from '../../../shared/dashboards/UpcomingClassCard';
import { batchAPI } from '../../../../apis/batch';

// TypeScript interfaces for API response
interface IApiUpcomingSession {
  session_id: string;
  session_date: string; // ISO date string
  day: string;
  start_time: string;
  end_time: string;
  end_date: string; // ISO date string
  batch: {
    id: string;
    name: string;
    code: string;
    status: string;
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
  zoom_meeting?: {
    id: string;
    join_url: string;
    password?: string;
  };
}

interface IApiUpcomingSessionsResponse {
  success: boolean;
  count: number;
  total_upcoming: number;
  active_batches: number;
  upcoming_batches: number;
  total_batches: number;
  days_ahead: number;
  student: {
    id: string;
    name: string;
    email: string;
  };
  data: IApiUpcomingSession[];
}

interface IClassStats {
  total: number;
  today: number;
  thisWeek: number;
  live: number;
  upcoming: number;
}

/**
 * UpcomingClassesMain - Component that displays the upcoming classes content
 * within the student dashboard layout
 */
const UpcomingClassesMain: React.FC<{ studentId?: string }> = ({ studentId }) => {
  const [isClient, setIsClient] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<"all" | "today" | "upcoming" | "live" | "ended">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [upcomingSessions, setUpcomingSessions] = useState<IApiUpcomingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const [currentStudentId, setCurrentStudentId] = useState<string>("");
  const [inputStudentId, setInputStudentId] = useState("");
  const [showStudentIdInput, setShowStudentIdInput] = useState(false);
  const [studentIdSource, setStudentIdSource] = useState<'props' | 'localStorage' | 'manual' | 'none'>('none');

  useEffect(() => {
    setIsClient(true);
    
    // Get userId from localStorage
    const getUserIdFromStorage = () => {
      try {
        // Try different possible keys where userId might be stored
        const userId = localStorage.getItem('userId') || 
                      localStorage.getItem('user_id') || 
                      localStorage.getItem('studentId') ||
                      localStorage.getItem('student_id');
        
        // Also try to get from user object in localStorage
        const userDataString = localStorage.getItem('user') || localStorage.getItem('userData');
        if (userDataString && !userId) {
          try {
            const userData = JSON.parse(userDataString);
            return userData.id || userData._id || userData.userId || userData.student_id;
          } catch (e) {
            console.warn('Failed to parse user data from localStorage:', e);
          }
        }
        
        return userId;
      } catch (error) {
        console.error('Error accessing localStorage:', error);
        return null;
      }
    };

    // Prioritize localStorage over props for better user experience
    const userIdFromStorage = getUserIdFromStorage();
    if (userIdFromStorage) {
      setCurrentStudentId(userIdFromStorage);
      setStudentIdSource('localStorage');
    } else if (studentId) {
      setCurrentStudentId(studentId);
      setStudentIdSource('props');
    } else {
      // No userId found - show input field
      setError("Please enter your student ID to view upcoming classes");
      setShowStudentIdInput(true);
      setLoading(false);
    }
  }, [studentId]);

  // Animation variants
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  }), []);

  // Function to transform API response to component format
  const transformApiSessionToClass = (session: any): IUpcomingClass => {
    // Handle both old and new API response formats
    const sessionId = session.session_id || session.id;
    const sessionDate = session.session_date || session.date;
    const endDate = session.end_date || session.date; // fallback to session date if no end_date
    const courseName = session.course?.title || session.batch?.course?.name || session.course?.name;
    const instructorName = session.instructor?.full_name || "Unknown Instructor";
    const hasRecordings = session.has_recorded_lessons !== undefined ? session.has_recorded_lessons : (session.recorded_lessons_count || 0) > 0;

    const sessionDateTime = moment(sessionDate);
    const now = moment();
    
    // Calculate session end time for duration
    const startDateTime = sessionDateTime.clone().hour(parseInt(session.start_time.split(':')[0])).minute(parseInt(session.start_time.split(':')[1] || '0'));
    const endDateTime = sessionDateTime.clone().hour(parseInt(session.end_time.split(':')[0])).minute(parseInt(session.end_time.split(':')[1] || '0'));
    const duration = endDateTime.diff(startDateTime, 'minutes');
    
    // Determine status based on timing
    let status: "upcoming" | "live" | "ended" | "cancelled" = "upcoming";
    
    if (startDateTime.isBefore(now) && endDateTime.isAfter(now)) {
      status = "live";
    } else if (endDateTime.isBefore(now)) {
      status = "ended";
    }

    return {
      id: parseInt(sessionId?.toString().slice(-6), 16) || Math.random() * 1000000,
      title: session.batch?.name || "Class Session",
      course: courseName || "Unknown Course",
      instructor: instructorName,
      date: sessionDate,
      time: session.start_time,
      duration: duration > 0 ? duration : 60, // Default to 60 minutes if calculation fails
      status: status,
      meetLink: session.zoom_meeting?.join_url || "",
      description: `${session.day} session for ${courseName}`,
      participants: 1, // Individual session or unknown
      maxParticipants: 1, // Individual session or unknown
      courseImage: "/images/courses/default.jpg", // Default image
      type: hasRecordings ? "Workshop" : "Live Session"
    };
  };

  // Fetch upcoming sessions from API
  const fetchUpcomingSessions = async (refresh: boolean = false) => {
    if (!currentStudentId) {
      setError("Student ID is required");
      setLoading(false);
      return;
    }

    try {
      if (!refresh) setLoading(true);
      setError(null);
      setShowStudentIdInput(false);

      const response = await batchAPI.getStudentUpcomingSessions(currentStudentId, {
        limit: 20,
        days_ahead: 14 // Get sessions for next 2 weeks
      });

      // Check if the response indicates success or failure
      // The API client wraps responses in IApiResponse with status field
      if (response.status === 'error') {
        throw new Error(response.message || response.error || "Failed to fetch upcoming sessions");
      }

      // The actual API response is in response.data
      const apiResponse = response.data as any;
      
      console.log('API Response received:', apiResponse); // Debug log
      
      // Handle the response structure - check for both old and new formats
      if (apiResponse && apiResponse.success === true && apiResponse.data) {
        // New format with success field and data array
        setUpcomingSessions(apiResponse.data);
        setLastFetch(new Date());
      } else if (apiResponse && apiResponse.success === false) {
        // API returned success: false
        throw new Error(apiResponse.message || "Student not found");
      } else if (apiResponse && apiResponse.sessions) {
        // Old format with sessions array
        setUpcomingSessions(apiResponse.sessions);
        setLastFetch(new Date());
      } else {
        // Handle case where response is successful but no sessions data
        setUpcomingSessions([]);
        setLastFetch(new Date());
      }
    } catch (error: any) {
      console.error('Error fetching upcoming sessions:', error);
      
      // Handle specific error cases
      let errorMessage = "Failed to load upcoming sessions";
      let showInputField = false;
      
      // Check if it's a network/API error with response data
      if (error.response && error.response.data) {
        // Handle case where API returns {success: false, message: "Student not found"}
        if (error.response.data.message) {
          if (error.response.data.message === "Student not found") {
            errorMessage = `Student with ID "${currentStudentId}" was not found. Please enter the correct student ID below.`;
            showInputField = true;
          } else {
            errorMessage = error.response.data.message;
          }
        }
      } else if (error.message === "Student not found") {
        errorMessage = `Student with ID "${currentStudentId}" was not found. Please enter the correct student ID below.`;
        showInputField = true;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setShowStudentIdInput(showInputField);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (isClient && currentStudentId) {
      fetchUpcomingSessions();
    }
  }, [isClient, currentStudentId]);

  // Transform API sessions to component format
  const upcomingClasses = useMemo<IUpcomingClass[]>(() => {
    return upcomingSessions.map(transformApiSessionToClass);
  }, [upcomingSessions]);

  // Class stats
  const classStats = useMemo<IClassStats>(() => {
    const total = upcomingClasses.length;
    const today = upcomingClasses.filter(c => moment(c.date).isSame(moment(), 'day')).length;
    const thisWeek = upcomingClasses.filter(c => moment(c.date).isSame(moment(), 'week')).length;
    const live = upcomingClasses.filter(c => c.status === "live").length;
    const upcoming = upcomingClasses.filter(c => c.status === "upcoming").length;

    return {
      total,
      today,
      thisWeek,
      live,
      upcoming
    };
  }, [upcomingClasses]);

  // Filter classes based on status and search
  const filteredClasses = useMemo(() => {
    let filtered = upcomingClasses;
    
    if (selectedStatus !== "all") {
      if (selectedStatus === "today") {
        filtered = filtered.filter(classItem => moment(classItem.date).isSame(moment(), 'day'));
      } else {
        filtered = filtered.filter(classItem => classItem.status === selectedStatus);
      }
    }
    
    if (searchTerm) {
      filtered = filtered.filter(classItem => 
        classItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classItem.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classItem.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [upcomingClasses, selectedStatus, searchTerm]);

  // Event handlers for card actions
  const handleViewDetails = (classItem: IUpcomingClass) => {
    console.log('View details for:', classItem.title);
    // Navigate to class details page or open modal
  };

  const handleJoinClass = (classItem: IUpcomingClass) => {
    console.log('Join class:', classItem.title);
    // Open meeting link or navigate to class room
    if (classItem.meetLink) {
      window.open(classItem.meetLink, '_blank');
    }
  };

  const handleViewRecording = (classItem: IUpcomingClass) => {
    console.log('View recording for:', classItem.title);
    // Navigate to recording page
  };

  const handleRefresh = () => {
    fetchUpcomingSessions(true);
  };

  // Handle student ID update
  const handleUpdateStudentId = () => {
    if (inputStudentId.trim()) {
      setCurrentStudentId(inputStudentId.trim());
      setInputStudentId("");
      setShowStudentIdInput(false);
      setStudentIdSource('manual');
    }
  };

  // Class Stats Component
  const ClassStats = () => (
    <div className="bg-gradient-to-r from-primary-500 to-primary-700 dark:from-primary-800 dark:to-primary-900 rounded-2xl p-4 sm:p-6 text-white shadow-lg">
      <div className="flex flex-nowrap items-center justify-between gap-4 sm:gap-6 overflow-x-auto">
        {/* Total Classes */}
        <div className="text-center flex-1 min-w-[100px]">
          <div className="text-2xl sm:text-3xl font-bold mb-1">{classStats.total}</div>
          <div className="text-primary-100 text-xs sm:text-sm font-medium whitespace-nowrap">Total Classes</div>
        </div>

        {/* Today */}
        <div className="text-center flex-1 min-w-[80px]">
          <div className="text-2xl sm:text-3xl font-bold mb-1">{classStats.today}</div>
          <div className="text-primary-100 text-xs sm:text-sm font-medium">Today</div>
        </div>

        {/* Live */}
        <div className="text-center flex-1 min-w-[80px]">
          <div className="text-3xl sm:text-4xl font-bold mb-1 text-red-200">{classStats.live}</div>
          <div className="text-primary-100 text-xs sm:text-sm font-medium uppercase tracking-wide">Live Now</div>
        </div>

        {/* This Week */}
        <div className="text-center flex-1 min-w-[80px]">
          <div className="text-2xl sm:text-3xl font-bold mb-1">{classStats.thisWeek}</div>
          <div className="text-primary-100 text-xs sm:text-sm font-medium whitespace-nowrap">This Week</div>
        </div>

        {/* Upcoming */}
        <div className="text-center flex-1 min-w-[80px]">
          <div className="text-2xl sm:text-3xl font-bold mb-1">{classStats.upcoming}</div>
          <div className="text-primary-100 text-xs sm:text-sm font-medium">Upcoming</div>
        </div>
      </div>
    </div>
  );

  // Error Component
  const ErrorComponent = () => (
    <div className="text-center py-12">
      <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        {!currentStudentId ? "Student ID Required" : "Failed to load upcoming classes"}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {error}
      </p>
      
      {showStudentIdInput && (
        <div className="max-w-md mx-auto mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter your student ID"
              value={inputStudentId}
              onChange={(e) => setInputStudentId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleUpdateStudentId()}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <button
              onClick={handleUpdateStudentId}
              disabled={!inputStudentId.trim()}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStudentId ? 'Update' : 'Set ID'}
            </button>
          </div>
          {currentStudentId && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Current Student ID: {currentStudentId} ({studentIdSource})
            </p>
          )}
          {!currentStudentId && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Your user ID was not found in browser storage. Please enter it manually.
            </p>
          )}
        </div>
      )}
      
      {currentStudentId && (
        <button
          onClick={handleRefresh}
          className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      )}
    </div>
  );

  // Class Preloader
  const ClassPreloader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 animate-pulse border border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2 mb-3">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
          </div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (!isClient) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <ClassPreloader />
      </div>
    );
  }

  return (
    <div className="w-full">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8 lg:space-y-12 pt-8 lg:pt-12"
      >
        {/* Page Header */}
        <motion.div variants={itemVariants} className="text-center pt-6 pb-4">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="w-8 h-8 text-primary-500 mr-3" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">
              Upcoming Classes
            </h1>
            {lastFetch && (
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="ml-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
                title={`Last updated: ${lastFetch.toLocaleTimeString()}`}
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
            Join your scheduled live sessions and stay engaged with your learning journey
          </p>
          <div className="mt-3 flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>
              Student ID: {currentStudentId}
              {studentIdSource !== 'none' && (
                <span className="ml-1 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {studentIdSource === 'props' ? 'from props' : 
                   studentIdSource === 'localStorage' ? 'from storage' : 
                   studentIdSource === 'manual' ? 'manually entered' : ''}
                </span>
              )}
            </span>
            {lastFetch && (
              <span>Last updated: {lastFetch.toLocaleString()}</span>
            )}
          </div>
        </motion.div>

        {/* Class Stats */}
        {!loading && !error && (
          <motion.div variants={itemVariants} className="px-4 sm:px-6 lg:px-8">
            <ClassStats />
          </motion.div>
        )}

        {/* Search and Filter */}
        {!loading && !error && (
          <motion.div variants={itemVariants} className="px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search classes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              
              {/* Status Filter */}
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                {[
                  { key: "all", label: "All", icon: Calendar },
                  { key: "today", label: "Today", icon: CalendarClock },
                  { key: "live", label: "Live", icon: Play },
                  { key: "upcoming", label: "Upcoming", icon: Clock },
                  { key: "ended", label: "Ended", icon: CheckCircle }
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setSelectedStatus(key as any)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedStatus === key
                        ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Classes Grid */}
        <motion.div variants={itemVariants} className="px-4 sm:px-6 lg:px-8">
          {loading ? (
            <ClassPreloader />
          ) : error ? (
            <ErrorComponent />
          ) : filteredClasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredClasses.map((classItem) => (
                <UpcomingClassCard 
                  key={classItem.id} 
                  classItem={classItem} 
                  onViewDetails={handleViewDetails}
                  onJoinClass={handleJoinClass}
                  onViewRecording={handleViewRecording}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No classes found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm || selectedStatus !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "You don't have any upcoming classes scheduled"
                }
              </p>
              {(searchTerm || selectedStatus !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedStatus("all");
                  }}
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UpcomingClassesMain; 