"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  Video, 
  Play, 
  Users,
  ExternalLink,
  Search,
  Filter,
  CalendarDays,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
// Default course image
import defaultCourseImage from "@/assets/images/courses/Ai&Ml.jpeg";

// TypeScript interfaces for proper type safety
interface IInstructor {
  _id: string;
  name: string;
  full_name?: string;
  email?: string;
  image?: string;
  avatar?: string;
}

interface ICourseDetails {
  _id: string;
  course_title?: string;
  course_image?: string;
  course_category?: string;
}

interface ILiveClass {
  _id: string;
  meet_title?: string;
  title?: string;
  course_name?: string;
  course_title?: string;
  date: string;
  time: string;
  start_time?: string;
  end_time?: string;
  meet_link?: string;
  meetingLink?: string;
  zoom_link?: string;
  status?: 'scheduled' | 'live' | 'ended' | 'cancelled';
  participants?: number;
  maxParticipants?: number;
  max_participants?: number;
  instructor?: IInstructor;
  instructor_id?: string;
  instructor_name?: string;
  courseDetails?: ICourseDetails;
  course_id?: string;
  description?: string;
  duration?: number;
  meeting_id?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ILiveClassesResponse {
  success: boolean;
  message: string;
  data: {
    meetings: ILiveClass[];
    upcoming_meetings?: ILiveClass[];
    live_meetings?: ILiveClass[];
    total?: number;
    page?: number;
    limit?: number;
  };
}

interface ILiveClassStats {
  totalMeetings: number;
  liveMeetings: number;
  upcomingMeetings: number;
  completedMeetings: number;
}

const JoinLiveMain: React.FC = () => {
  const [liveClasses, setLiveClasses] = useState<ILiveClass[]>([]);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [stats, setStats] = useState<ILiveClassStats>({
    totalMeetings: 0,
    liveMeetings: 0,
    upcomingMeetings: 0,
    completedMeetings: 0
  });
  const { getQuery, loading } = useGetQuery<ILiveClassesResponse>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Animation variants
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  // Fetch student ID from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setStudentId(storedUserId);
      } else {
        setError("No student ID found. Please log in again.");
        console.error("No student ID found in localStorage");
      }
    }
  }, []);

  // Fetch live classes from API
  const fetchLiveClasses = async () => {
    if (!studentId) return;

    setError(null);
    
    try {
      // Try the main student meetings endpoint first
      getQuery({
        url: apiUrls.onlineMeeting.getMeetingByStudentId + `/${studentId}`,
        onSuccess: (response: ILiveClassesResponse | ILiveClass[]) => {
          let meetings: ILiveClass[] = [];
          
          // Handle different response formats
          if (Array.isArray(response)) {
            meetings = response;
          } else if (response.data) {
            meetings = response.data.meetings || response.data.upcoming_meetings || [];
          }
          
          console.log("Fetched live classes:", meetings);
          setLiveClasses(meetings);
          
          // Calculate stats
          const currentTime = new Date();
          const stats = meetings.reduce((acc, meeting) => {
            const meetingDateTime = new Date(`${meeting.date}T${meeting.time}`);
            const minutesDiff = Math.floor((meetingDateTime.getTime() - currentTime.getTime()) / (1000 * 60));
            
            acc.totalMeetings++;
            if (minutesDiff >= -60 && minutesDiff <= 10) {
              acc.liveMeetings++;
            } else if (minutesDiff > 10) {
              acc.upcomingMeetings++;
            } else {
              acc.completedMeetings++;
            }
            
            return acc;
          }, { totalMeetings: 0, liveMeetings: 0, upcomingMeetings: 0, completedMeetings: 0 });
          
          setStats(stats);
        },
        onFail: (err) => {
          console.error("Error fetching live classes:", err);
          const errorMessage = err?.response?.data?.message || err?.message || "Failed to fetch live classes";
          setError(errorMessage);
          
          // Only show error toast, don't fall back to mock data
          if (err?.response?.status === 404) {
            showToast.info("No live classes found for your account");
            setLiveClasses([]);
          } else {
            showToast.error(errorMessage);
          }
        },
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      setError("An unexpected error occurred while fetching live classes");
      showToast.error("Failed to load live classes");
    }
  };

  // Fetch upcoming meetings as fallback
  const fetchUpcomingMeetings = async () => {
    if (!studentId) return;

    try {
      getQuery({
        url: apiUrls.onlineMeeting.getUpcomingMeetingsForStudent(studentId, { showAllUpcoming: true }),
        onSuccess: (response: ILiveClassesResponse | ILiveClass[]) => {
          let meetings: ILiveClass[] = [];
          
          if (Array.isArray(response)) {
            meetings = response;
          } else if (response.data) {
            meetings = response.data.meetings || response.data.upcoming_meetings || [];
          }
          
          console.log("Fetched upcoming meetings:", meetings);
          setLiveClasses(meetings);
          setError(null);
        },
        onFail: (err) => {
          console.error("Error fetching upcoming meetings:", err);
          // If both endpoints fail, show final error
          if (liveClasses.length === 0) {
            const errorMessage = "Unable to load live classes. Please try again later.";
            setError(errorMessage);
          }
        },
      });
    } catch (error) {
      console.error("Error in fetchUpcomingMeetings:", error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (studentId) {
      fetchLiveClasses();
    }
  }, [studentId]);

  // Handler for refreshing data
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLiveClasses();
    
    // If main endpoint fails, try upcoming meetings endpoint
    setTimeout(async () => {
      if (error && liveClasses.length === 0) {
        await fetchUpcomingMeetings();
      }
      setRefreshing(false);
    }, 1000);
  };

  // Handler for joining a live class
  const handleJoinClass = (liveClass: ILiveClass) => {
    // Normalize class properties (API might return different property names)
    const meetLink = liveClass.meet_link || liveClass.meetingLink || liveClass.zoom_link;
    const classTitle = liveClass.meet_title || liveClass.title || liveClass.course_title || liveClass.course_name;
    
    if (!meetLink) {
      showToast.error("Meeting link not available for this class");
      return;
    }

    // Check if class is happening now or about to start within 10 minutes
    const classDate = liveClass.date;
    const classTime = liveClass.time || liveClass.start_time;
    
    if (!classTime) {
      showToast.error("Class time information is not available");
      return;
    }
    
    const classDateTime = new Date(`${classDate}T${classTime}`);
    const currentTime = new Date();
    
    const minutesDifference = Math.floor((classDateTime.getTime() - currentTime.getTime()) / (1000 * 60));

    if (minutesDifference > 10) {
      showToast.info(`This class will start in ${minutesDifference} minutes. You can join 10 minutes before the start time.`);
      return;
    } else if (minutesDifference < -60) {
      showToast.warning("This class has ended.");
      return;
    }

    try {
      // Open meeting link in new tab
      window.open(meetLink, "_blank", "noopener,noreferrer");
      showToast.success(`Joining: ${classTitle}`);
    } catch (error) {
      console.error("Error opening meeting link:", error);
      showToast.error("Failed to open meeting link");
    }
  };

  // Filter classes by status and search term
  const filteredClasses = liveClasses.filter(liveClass => {
    const title = liveClass.meet_title || liveClass.title || liveClass.course_title || "";
    const courseName = liveClass.course_name || liveClass.course_title || "";
    const instructorName = liveClass.instructor?.name || liveClass.instructor?.full_name || liveClass.instructor_name || "";
    
    const searchMatch = 
      title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === "all") {
      return searchMatch;
    }
    
    const classDate = liveClass.date;
    const classTime = liveClass.time || liveClass.start_time;
    
    if (!classTime) return false;
    
    const classDateTime = new Date(`${classDate}T${classTime}`);
    const currentTime = new Date();
    
    const minutesDifference = Math.floor((classDateTime.getTime() - currentTime.getTime()) / (1000 * 60));
    
    if (filterStatus === "live" && minutesDifference >= -60 && minutesDifference <= 10) {
      return searchMatch;
    }
    
    if (filterStatus === "upcoming" && minutesDifference > 10) {
      return searchMatch;
    }
    
    return false;
  });

  // Determine class status
  const getClassStatus = (classDate: string, classTime?: string) => {
    if (!classTime) {
      return { status: "unknown", label: "Unknown", color: "bg-gray-500" };
    }
    
    const classDateTime = new Date(`${classDate}T${classTime}`);
    const currentTime = new Date();
    
    const minutesDifference = Math.floor((classDateTime.getTime() - currentTime.getTime()) / (1000 * 60));
    
    if (minutesDifference >= -60 && minutesDifference <= 10) {
      return { status: "live", label: "Live Now", color: "bg-red-500" };
    } else if (minutesDifference > 10) {
      return { status: "upcoming", label: "Upcoming", color: "bg-blue-500" };
    } else {
      return { status: "ended", label: "Ended", color: "bg-gray-500" };
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header with stats and refresh */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Join Live Classes</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>Total: {stats.totalMeetings}</span>
            <span className="text-red-600">Live: {stats.liveMeetings}</span>
            <span className="text-blue-600">Upcoming: {stats.upcomingMeetings}</span>
            <span className="text-gray-500">Completed: {stats.completedMeetings}</span>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading || refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${(loading || refreshing) ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-red-800 dark:text-red-200">Error Loading Live Classes</h3>
            <p className="text-red-700 dark:text-red-300 text-sm mt-1">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-2 text-sm text-red-800 dark:text-red-200 underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}
      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by class title, course, or instructor"
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              filterStatus === 'all' 
                ? 'bg-gray-800 dark:bg-gray-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            onClick={() => setFilterStatus('all')}
          >
            <Filter size={16} />
            All ({stats.totalMeetings})
          </button>
          <button
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              filterStatus === 'live' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-red-100 dark:hover:bg-red-900/20'
            }`}
            onClick={() => setFilterStatus('live')}
          >
            <Video size={16} />
            Live ({stats.liveMeetings})
          </button>
          <button
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              filterStatus === 'upcoming' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900/20'
            }`}
            onClick={() => setFilterStatus('upcoming')}
          >
            <CalendarDays size={16} />
            Upcoming ({stats.upcomingMeetings})
          </button>
        </div>
      </div>

      {/* Live classes list */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredClasses.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredClasses.map((liveClass) => {
            const status = getClassStatus(liveClass.date, liveClass.time || liveClass.start_time);
            const instructor = liveClass.instructor;
            const courseName = liveClass.course_name || liveClass.course_title || "Course";
            const classTitle = liveClass.meet_title || liveClass.title || courseName;
            
            return (
              <motion.div
                key={liveClass._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow"
                variants={itemVariants}
              >
                <div className="relative h-40 bg-gray-200 dark:bg-gray-700">
                  <Image
                    src={liveClass.courseDetails?.course_image || defaultCourseImage}
                    alt={classTitle}
                    className="object-cover"
                    fill
                  />
                  <div className={`absolute top-3 right-3 ${status.color} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                    {status.label}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-gray-900 dark:text-white">
                    {classTitle}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-1">
                    {courseName}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{new Date(liveClass.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{liveClass.time || liveClass.start_time}</span>
                    </div>
                    {instructor && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Users className="w-4 h-4 mr-2" />
                        <span>Instructor: {instructor.name || instructor.full_name}</span>
                      </div>
                    )}
                    {(liveClass.participants !== undefined || liveClass.maxParticipants || liveClass.max_participants) && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Users className="w-4 h-4 mr-2" />
                        <span>
                          {liveClass.participants || 0}/{liveClass.maxParticipants || liveClass.max_participants || 'N/A'} Participants
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <button
                    className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors ${
                      status.status === "live" 
                        ? "bg-red-600 hover:bg-red-700 text-white" 
                        : status.status === "upcoming" 
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-gray-400 text-white cursor-not-allowed"
                    }`}
                    onClick={() => handleJoinClass(liveClass)}
                    disabled={status.status === "ended"}
                  >
                    {status.status === "live" ? (
                      <>
                        <Play className="w-4 h-4" />
                        Join Now
                      </>
                    ) : status.status === "upcoming" ? (
                      <>
                        <ExternalLink className="w-4 h-4" />
                        Join When Available
                      </>
                    ) : (
                      <>
                        <Video className="w-4 h-4" />
                        Class Ended
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Video className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
            {error ? "Unable to load live classes" : "No live classes found"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            {error ? (
              "Please check your internet connection and try refreshing the page."
            ) : searchTerm ? (
              "No classes match your search criteria. Try a different search term."
            ) : filterStatus !== "all" ? (
              `No ${filterStatus} classes available right now. Check back later or view all classes.`
            ) : (
              "You don't have any scheduled live classes at the moment. Check back later or contact your instructor."
            )}
          </p>
          {!error && (
            <button
              onClick={handleRefresh}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Classes
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default JoinLiveMain; 