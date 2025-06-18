"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  Users, 
  Play, 
  Eye, 
  MessageSquare,
  FileText,
  ExternalLink,
  Download,
  Search,
  Filter,
  ChevronDown,
  Video,
  Plus,
  AlertCircle,
  RefreshCw,
  Calendar as LucideCalendar, 
  Clock as LucideClock, 
  User as LucideUser, 
  BookOpen as LucideBookOpen,
  Video as LucideVideo,
  Play as LucidePlay,
  Users as LucideUsers,
  Info as LucideInfo,
  ExternalLink as LucideExternalLink,
  VideoOff as LucideVideoOff,
  Check as LucideCheck,
  Download as LucideDownload,
  Bookmark as LucideBookmark,
  MessageCircle as LucideMessageCircle,
  FileText as LucideFileText,
  File as LucideFile,
  Send as LucideSend
} from "lucide-react";
import { format } from "date-fns";
import defaultCourseImage from "@/assets/images/courses/Ai&Ml.jpeg";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import { toast } from "react-toastify";

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
  title: string;
  course_title?: string;
  courseImage?: string;
  course_image?: string;
}

interface IMaterial {
  _id?: string;
  title: string;
  url: string;
  type: 'pdf' | 'link' | 'video' | 'document';
  size?: string;
}

interface ILiveClass {
  _id: string;
  title: string;
  meet_title?: string;
  description?: string;
  startDate: string;
  date?: string;
  startTime: string;
  time?: string;
  start_time?: string;
  duration: number;
  meetingLink: string;
  meet_link?: string;
  zoom_link?: string;
  courseDetails?: ICourseDetails;
  course_id?: string;
  instructor: IInstructor;
  instructor_id?: string;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  recordingUrl?: string;
  recording_url?: string;
  participants?: number;
  maxParticipants?: number;
  max_participants?: number;
  category?: string;
  materials?: IMaterial[];
  createdAt?: string;
  updatedAt?: string;
}

interface ILiveClassesResponse {
  success: boolean;
  message: string;
  data: {
    liveClasses: ILiveClass[];
    meetings?: ILiveClass[];
    total?: number;
    page?: number;
    limit?: number;
  };
}

interface IFilterState {
  status: string;
  category: string;
  instructor: string;
  searchTerm: string;
}

interface IChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
}

const LiveClasses: React.FC = () => {
  // State management
  const [classes, setClasses] = useState<ILiveClass[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<ILiveClass[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Filter and search state
  const [filters, setFilters] = useState<IFilterState>({
    status: "all",
    category: "all",
    instructor: "all",
    searchTerm: ""
  });
  const [categories, setCategories] = useState<string[]>(["all"]);
  const [instructors, setInstructors] = useState<string[]>(["all"]);
  
  // UI state
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  
  // Chat state
  const [selectedClassForChat, setSelectedClassForChat] = useState<ILiveClass | null>(null);
  const [showChatModal, setShowChatModal] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<IChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  const { getQuery } = useGetQuery<ILiveClassesResponse>();

  // Fetch user ID from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        setError("No user ID found. Please log in again.");
      }
    }
  }, []);
  
  // Fetch live classes from API
  const fetchLiveClasses = async () => {
    if (!userId) return;
    
    setError(null);
    setLoading(true);
    
    try {
      // Try multiple API endpoints to get live classes data
      getQuery({
        url: apiUrls.onlineMeeting.getMeetingByStudentId + `/${userId}`,
        onSuccess: (response: ILiveClassesResponse | ILiveClass[]) => {
          let meetings: ILiveClass[] = [];
          
          // Handle different response formats
          if (Array.isArray(response)) {
            meetings = response;
          } else if (response.data) {
            meetings = response.data.liveClasses || response.data.meetings || [];
          }
          
          console.log("Fetched live classes:", meetings);
          setClasses(meetings);
          setFilteredClasses(meetings);
        
        // Extract unique categories and instructors for filters
          const uniqueCategories = [...new Set(meetings.map(item => item.category || "Uncategorized"))];
          const uniqueInstructors = [...new Set(meetings.map(item => item.instructor?.name || item.instructor?.full_name || "Unknown"))];
        
        setCategories(["all", ...uniqueCategories]);
        setInstructors(["all", ...uniqueInstructors]);
        
          setError(null);
          setLoading(false);
        },
        onFail: (err) => {
          console.error("Error fetching live classes:", err);
          const errorMessage = err?.response?.data?.message || err?.message || "Failed to fetch live classes";
          setError(errorMessage);
          setLoading(false);
          
          if (err?.response?.status === 404) {
            showToast.info("No live classes found for your account");
            setClasses([]);
            setFilteredClasses([]);
          } else {
            showToast.error(errorMessage);
          }
        },
      });
      } catch (error) {
      console.error("Unexpected error:", error);
      setError("An unexpected error occurred while fetching live classes");
      setLoading(false);
      showToast.error("Failed to load live classes");
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (userId) {
    fetchLiveClasses();
    }
  }, [userId]);

  // Refresh data handler
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLiveClasses();
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Filter classes whenever filters or classes change
  useEffect(() => {
    let filtered = [...classes];

    // Apply status filter
    if (filters.status !== "all") {
      filtered = filtered.filter(cls => cls.status === filters.status);
    }

    // Apply category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(cls => cls.category === filters.category);
    }

    // Apply instructor filter
    if (filters.instructor !== "all") {
      filtered = filtered.filter(cls => {
        const instructorName = cls.instructor?.name || cls.instructor?.full_name || "";
        return instructorName === filters.instructor;
      });
    }

    // Apply search filter
    if (filters.searchTerm.trim()) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(cls => 
        (cls.title || cls.meet_title || "").toLowerCase().includes(searchTerm) ||
        (cls.description || "").toLowerCase().includes(searchTerm) ||
        (cls.courseDetails?.title || cls.courseDetails?.course_title || "").toLowerCase().includes(searchTerm) ||
        (cls.instructor?.name || cls.instructor?.full_name || "").toLowerCase().includes(searchTerm)
      );
    }

    setFilteredClasses(filtered);
  }, [classes, filters]);
  
  // Format date with user-friendly formatting
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, "EEEE, MMMM do, yyyy");
    } catch (error) {
      return dateString;
    }
  };
  
  // Format time to 12-hour format with AM/PM
  const formatTime = (timeString: string): string => {
    try {
      const [hours, minutes] = timeString.split(":");
      return format(new Date().setHours(parseInt(hours, 10), parseInt(minutes, 10)), "h:mm a");
    } catch (error) {
      return timeString;
    }
  };
  
  // Convert minutes to hours and minutes format
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0 && mins > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ${mins} minutes`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      return `${mins} minutes`;
    }
  };

  // Get class time display
  const getClassTimeDisplay = (liveClass: ILiveClass): string => {
    const startTime = liveClass.startTime || liveClass.time || liveClass.start_time || "";
    return `${formatTime(startTime)} • ${formatDuration(liveClass.duration)}`;
  };
  
  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "live":
        return "bg-red-500 text-white";
      case "upcoming":
        return "bg-blue-500 text-white";
      case "completed":
        return "bg-green-500 text-white";
      case "cancelled":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Get status text
  const getStatusText = (status: string): string => {
    switch (status) {
      case "live":
        return "Live Now";
      case "upcoming":
        return "Upcoming";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  // Action handlers
  const handleViewDetails = (liveClass: ILiveClass) => {
    console.log("View details for:", liveClass.title);
    // Implement view details modal or navigation
  };

  const handleJoinClass = (liveClass: ILiveClass) => {
    const meetLink = liveClass.meetingLink || liveClass.meet_link || liveClass.zoom_link;
    if (meetLink) {
      window.open(meetLink, "_blank", "noopener,noreferrer");
      showToast.success(`Joining: ${liveClass.title || liveClass.meet_title}`);
    } else {
      showToast.error("Meeting link not available");
    }
  };

  const handleWatchRecording = (recordingUrl: string) => {
    window.open(recordingUrl, "_blank", "noopener,noreferrer");
  };

  const handleOpenChat = (liveClass: ILiveClass) => {
    setSelectedClassForChat(liveClass);
    setShowChatModal(true);
    // Load chat messages for this class
    setChatMessages([]);
  };

  const handleCloseChat = () => {
    setShowChatModal(false);
    setSelectedClassForChat(null);
    setChatMessages([]);
    setNewMessage("");
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedClassForChat) {
      const message: IChatMessage = {
        id: Date.now().toString(),
        sender: "You",
        message: newMessage.trim(),
        timestamp: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage("");
      // TODO: Send message to API
    }
  };

  const handleDownloadMaterial = (material: IMaterial) => {
    window.open(material.url, "_blank", "noopener,noreferrer");
    showToast.success(`Downloading: ${material.title}`);
  };

  const handleFilterChange = (filterName: keyof IFilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };
  
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    setFilters(prev => ({ ...prev, status: tab === "all" ? "all" : tab }));
  };

  const handleAddToCalendar = (liveClass: ILiveClass) => {
    const startDate = liveClass.startDate || liveClass.date || "";
    const startTime = liveClass.startTime || liveClass.time || liveClass.start_time || "";
    
    if (!startDate || !startTime) {
      showToast.error("Date/time information not available");
      return;
    }
    
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(startDateTime.getTime() + (liveClass.duration * 60 * 1000));
    
    const event = {
      title: liveClass.title || liveClass.meet_title || "Live Class",
      start: startDateTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      end: endDateTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      description: liveClass.description || `Live class session for ${liveClass.courseDetails?.title || liveClass.courseDetails?.course_title || "course"}`,
      location: liveClass.meetingLink || liveClass.meet_link || liveClass.zoom_link || ""
    };
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    
    window.open(googleCalendarUrl, "_blank", "noopener,noreferrer");
    showToast.success("Opening calendar to add event");
  };

  // Render class card
  const renderClassCard = (liveClass: ILiveClass) => {
    const courseImage = liveClass.courseDetails?.courseImage || liveClass.courseDetails?.course_image || defaultCourseImage;
    const courseTitle = liveClass.courseDetails?.title || liveClass.courseDetails?.course_title || "Course";
    const classTitle = liveClass.title || liveClass.meet_title || courseTitle;
    const instructorName = liveClass.instructor?.name || liveClass.instructor?.full_name || "Unknown Instructor";
    const classDate = liveClass.startDate || liveClass.date || "";
    
    return (
      <motion.div
        key={liveClass._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300"
      >
        {/* Header with course image and status */}
        <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
          <Image
            src={courseImage}
            alt={classTitle}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(liveClass.status)}`}>
              {getStatusText(liveClass.status)}
            </span>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 mb-2">
              {classTitle}
          </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
              {liveClass.description || `Live session for ${courseTitle}`}
            </p>
            </div>
            
          {/* Class details */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{formatDate(classDate)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{getClassTimeDisplay(liveClass)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Users className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{instructorName}</span>
            </div>
            {(liveClass.participants !== undefined || liveClass.maxParticipants || liveClass.max_participants) && (
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>
                  {liveClass.participants || 0}/{liveClass.maxParticipants || liveClass.max_participants || 'N/A'} Participants
                </span>
              </div>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
            {liveClass.status === "live" && (
            <button
                onClick={() => handleJoinClass(liveClass)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
                <Play className="w-4 h-4" />
                Join Now
            </button>
            )}
            
            {liveClass.status === "upcoming" && (
              <>
              <button
                onClick={() => handleJoinClass(liveClass)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                  <ExternalLink className="w-4 h-4" />
                  Join When Live
              </button>
              <button
                onClick={() => handleAddToCalendar(liveClass)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                  <Plus className="w-4 h-4" />
                Add to Calendar
              </button>
              </>
            )}
            
            {liveClass.status === "completed" && liveClass.recordingUrl && (
              <button
                onClick={() => handleWatchRecording(liveClass.recordingUrl!)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Watch Recording
              </button>
            )}
            
              <button
              onClick={() => handleViewDetails(liveClass)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <FileText className="w-4 h-4" />
              View Details
            </button>
            
            {liveClass.status === "live" && (
              <button
                onClick={() => handleOpenChat(liveClass)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Chat
              </button>
            )}
          </div>

          {/* Materials section */}
          {liveClass.materials && liveClass.materials.length > 0 && (
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Class Materials</h4>
              <div className="flex flex-wrap gap-2">
                {liveClass.materials.map((material, index) => (
                  <button
                    key={material._id || index}
                    onClick={() => handleDownloadMaterial(material)}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    {material.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };
  
  return (
    <div className="p-6 space-y-6">
      {/* Header with refresh button */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Live Classes</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Join live sessions, watch recordings, and access class materials
        </p>
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
      
      {/* Status tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {["all", "upcoming", "live", "completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
              selectedTab === tab
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab !== "all" && (
              <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded-full">
                {classes.filter(cls => cls.status === tab).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search and filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search classes by title, description, course, or instructor..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
                </div>
                
        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Filter className="w-5 h-5" />
          Filters
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
              </div>
              
      {/* Advanced filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
                  </div>
                  
              {/* Instructor filter */}
                <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Instructor</label>
                <select
                  value={filters.instructor}
                  onChange={(e) => handleFilterChange("instructor", e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  {instructors.map((instructor) => (
                    <option key={instructor} value={instructor}>
                      {instructor === "all" ? "All Instructors" : instructor}
                    </option>
                  ))}
                </select>
                  </div>
                </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Classes grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredClasses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map(renderClassCard)}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Video className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
            {error ? "Unable to load live classes" : "No live classes found"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            {error ? (
              "Please check your internet connection and try refreshing the page."
            ) : filters.searchTerm || filters.category !== "all" || filters.instructor !== "all" ? (
              "No classes match your current filters. Try adjusting your search criteria."
            ) : (
              "You don't have any live classes scheduled at the moment. Check back later or contact your instructor."
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
      
      {/* Chat modal */}
      <AnimatePresence>
        {showChatModal && selectedClassForChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleCloseChat}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md h-96 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Chat header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {selectedClassForChat.title || selectedClassForChat.meet_title} - Chat
                </h3>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center">No messages yet. Start the conversation!</p>
                ) : (
                  chatMessages.map((message) => (
                    <div key={message.id} className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{message.sender}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {format(new Date(message.timestamp), "HH:mm")}
                        </span>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                        <p className="text-gray-900 dark:text-white">{message.message}</p>
                    </div>
                  </div>
                  ))
                )}
              </div>
              
              {/* Chat input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                  onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Send
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveClasses; 