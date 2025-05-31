"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { 
  LucideCalendar, 
  LucideClock, 
  LucideUser, 
  LucideBookOpen,
  LucideVideo,
  LucidePlay,
  LucideUsers,
  LucideInfo,
  LucideExternalLink,
  LucideVideoOff,
  LucideCheck,
  LucideDownload,
  LucideBookmark,
  LucideMessageCircle,
  LucideFileText,
  LucideFile,
  LucideSend
} from "lucide-react";

// Component imports
import LoadingIndicator from "@/components/shared/loaders/LoadingIndicator";
import EmptyState from "@/components/shared/others/EmptyState";
import TabNavigation from "@/components/shared/navigation/TabNavigation";
import SearchBar from "@/components/shared/inputs/SearchBar";
import Badge from "@/components/shared/elements/Badge";
import Button from "@/components/shared/buttons/Button";
import Select from "@/components/shared/inputs/Select";
import Card from "@/components/shared/containers/Card";
import Modal from "@/components/shared/modals/Modal";

// Default image for classes without images
import DefaultClassImage from "@/assets/images/courses/image1.png";

// Types
interface LiveClass {
  _id: string;
  title: string;
  description?: string;
  startDate: string;
  startTime: string;
  duration: number;
  meetingLink: string;
  courseDetails?: {
    _id: string;
    title: string;
    courseImage?: string;
  };
  instructor: {
    _id: string;
    name: string;
    image?: string;
  };
  status: string; // upcoming, live, completed
  recordingUrl?: string;
  participants?: number;
  maxParticipants?: number;
  category?: string;
  materials?: Array<{
    title: string;
    url: string;
    type: string;
  }>;
}

interface ApiResponse {
  liveClasses: LiveClass[];
}

interface FilterState {
  status: string;
  category: string;
  instructor: string;
  searchTerm: string;
}

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
    transition: { duration: 0.5 }
  }
};

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
};

/**
 * LiveClasses - Component for displaying and joining live classes
 */
const LiveClasses: React.FC = () => {
  const router = useRouter();
  const { getQuery, loading } = useGetQuery();
  
  // State management
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("upcoming");
  const [selectedClass, setSelectedClass] = useState<LiveClass | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Array<{ user: string; message: string; time: string }>>([]);
  const [messageInput, setMessageInput] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  // Filter and search state
  const [filters, setFilters] = useState<FilterState>({
    status: activeTab,
    category: "all",
    instructor: "all",
    searchTerm: ""
  });
  
  // Categories and instructors for filter options
  const [categories, setCategories] = useState<string[]>([]);
  const [instructors, setInstructors] = useState<string[]>([]);
  
  // Fetch user ID from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setUserId(storedUserId);
      }
    }
  }, []);
  
  // Fetch live classes data
  useEffect(() => {
    if (!userId) return;
    
    const fetchLiveClasses = async () => {
      try {
        // Mock data for development - replace with actual API call when available
        // This simulates the API response structure
        
        const mockData = {
          liveClasses: [
            {
              _id: "1",
              title: "React State Management Masterclass",
              description: "Learn advanced state management techniques in React applications",
              startDate: "2023-09-15",
              startTime: "10:00",
              duration: 90,
              meetingLink: "https://zoom.us/j/123456789",
              courseDetails: {
                _id: "course1",
                title: "React from Zero to Hero",
                courseImage: "/images/courses/react.jpg"
              },
              instructor: {
                _id: "instructor1",
                name: "John Doe",
                image: "/images/instructors/john.jpg"
              },
              status: "upcoming",
              participants: 25,
              maxParticipants: 50,
              category: "Web Development",
              materials: [
                {
                  title: "State Management Slides",
                  url: "https://example.com/slides.pdf",
                  type: "pdf"
                },
                {
                  title: "Code Repository",
                  url: "https://github.com/example/react-state",
                  type: "link"
                }
              ]
            },
            {
              _id: "2",
              title: "JavaScript Performance Optimization",
              description: "Techniques for optimizing JavaScript code performance",
              startDate: new Date().toISOString().split('T')[0],
              startTime: new Date().toTimeString().slice(0, 5),
              duration: 60,
              meetingLink: "https://zoom.us/j/987654321",
              courseDetails: {
                _id: "course2",
                title: "Advanced JavaScript"
              },
              instructor: {
                _id: "instructor2",
                name: "Jane Smith"
              },
              status: "live",
              participants: 32,
              maxParticipants: 40,
              category: "Programming"
            },
            {
              _id: "3",
              title: "UI/UX Design Principles Workshop",
              description: "Interactive workshop on essential UI/UX design principles",
              startDate: "2023-08-10",
              startTime: "14:00",
              duration: 120,
              meetingLink: "https://zoom.us/j/123123123",
              courseDetails: {
                _id: "course3",
                title: "UI/UX Design Fundamentals"
              },
              instructor: {
                _id: "instructor3",
                name: "Alex Johnson"
              },
              status: "completed",
              recordingUrl: "https://example.com/recordings/uiux-workshop.mp4",
              participants: 45,
              maxParticipants: 50,
              category: "Design"
            },
            {
              _id: "4",
              title: "Node.js API Development",
              description: "Building scalable APIs with Node.js and Express",
              startDate: "2023-09-20",
              startTime: "16:00",
              duration: 90,
              meetingLink: "https://zoom.us/j/456456456",
              courseDetails: {
                _id: "course4",
                title: "Node.js Backend Development",
                courseImage: "/images/courses/nodejs.jpg"
              },
              instructor: {
                _id: "instructor4",
                name: "Mike Williams"
              },
              status: "upcoming",
              participants: 18,
              maxParticipants: 40,
              category: "Web Development",
              materials: [
                {
                  title: "API Reference Guide",
                  url: "https://example.com/api-guide.pdf",
                  type: "pdf"
                }
              ]
            },
            {
              _id: "5",
              title: "Python Data Visualization",
              description: "Creating effective data visualizations with Python",
              startDate: "2023-08-05",
              startTime: "11:00",
              duration: 75,
              meetingLink: "https://zoom.us/j/789789789",
              courseDetails: {
                _id: "course5",
                title: "Python Data Science"
              },
              instructor: {
                _id: "instructor5",
                name: "Sarah Miller"
              },
              status: "completed",
              recordingUrl: "https://example.com/recordings/python-viz.mp4",
              participants: 38,
              maxParticipants: 40,
              category: "Data Science"
            }
          ]
        };
        
        // In real implementation, this would be replaced with:
        // getQuery({
        //   url: `${apiUrls?.liveClasses?.getEnrolledClasses(userId)}`,
        //   onSuccess: (res: ApiResponse) => {
        //     setClasses(res.liveClasses || []);
        //     setErrorMessage("");
        //   },
        //   onFail: (err) => {
        //     console.error("Error fetching live classes:", err);
        //     setErrorMessage("Failed to load live classes. Please try again later.");
        //   }
        // });
        
        // Using mock data
        setClasses(mockData.liveClasses);
        
        // Extract unique categories and instructors for filters
        const uniqueCategories = [...new Set(mockData.liveClasses.map(item => item.category || "Uncategorized"))];
        const uniqueInstructors = [...new Set(mockData.liveClasses.map(item => item.instructor.name))];
        
        setCategories(["all", ...uniqueCategories]);
        setInstructors(["all", ...uniqueInstructors]);
        
        setErrorMessage("");
      } catch (error) {
        console.error("Error in live classes fetch:", error);
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    };
    
    fetchLiveClasses();
  }, [userId]);
  
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
    
    if (hours > 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}${mins > 0 ? ` ${mins} ${mins === 1 ? 'minute' : 'minutes'}` : ''}`;
    }
    
    return `${mins} ${mins === 1 ? 'minute' : 'minutes'}`;
  };
  
  // Format class time for display
  const getClassTimeDisplay = (liveClass: LiveClass): string => {
    return `${formatTime(liveClass.startTime)} • ${formatDuration(liveClass.duration)}`;
  };
  
  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'live':
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      case 'upcoming':
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
      case 'completed':
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };
  
  // Apply filters to the classes
  const filteredClasses = classes.filter((liveClass) => {
    // Apply status filter
    if (filters.status !== "all" && liveClass.status !== filters.status) {
      return false;
    }
    
    // Apply category filter
    if (filters.category !== "all" && liveClass.category !== filters.category) {
      return false;
    }
    
    // Apply instructor filter
    if (filters.instructor !== "all" && liveClass.instructor.name !== filters.instructor) {
      return false;
    }
    
    // Apply search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      return (
        liveClass.title.toLowerCase().includes(searchLower) ||
        (liveClass.description || "").toLowerCase().includes(searchLower) ||
        liveClass.instructor.name.toLowerCase().includes(searchLower) ||
        (liveClass.courseDetails?.title || "").toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  // Handle opening the class details modal
  const handleViewDetails = (liveClass: LiveClass) => {
    setSelectedClass(liveClass);
    setIsDetailsModalOpen(true);
  };
  
  // Join live class
  const handleJoinClass = (liveClass: LiveClass) => {
    // In a real implementation, you might want to track that the user joined the class
    window.open(liveClass.meetingLink, "_blank");
  };
  
  // Watch recording
  const handleWatchRecording = (recordingUrl: string) => {
    window.open(recordingUrl, "_blank");
  };
  
  // Open chat for a live class
  const handleOpenChat = (liveClass: LiveClass) => {
    setSelectedClass(liveClass);
    
    // Mock chat data
    setChatMessages([
      { user: "Instructor", message: "Welcome to today's class on JavaScript Performance!", time: "2:00 PM" },
      { user: "Alex", message: "Hi everyone, excited to learn today!", time: "2:01 PM" },
      { user: "Sarah", message: "Professor, will we be covering memory profiling?", time: "2:03 PM" },
      { user: "Instructor", message: "Yes Sarah, we'll cover that in the second half.", time: "2:04 PM" },
      { user: "Michael", message: "Is this being recorded for later viewing?", time: "2:07 PM" },
      { user: "Instructor", message: "Yes, all live sessions are recorded and will be available tomorrow.", time: "2:08 PM" }
    ]);
    
    setIsChatModalOpen(true);
  };
  
  // Send chat message
  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    setChatMessages([
      ...chatMessages,
      {
        user: "You",
        message: messageInput,
        time: format(new Date(), "h:mm a")
      }
    ]);
    
    setMessageInput("");
    
    // Simulate instructor response after a short delay
    setTimeout(() => {
      setChatMessages(prevMessages => [
        ...prevMessages,
        {
          user: "Instructor",
          message: "Great question! Let me address that during the session.",
          time: format(new Date(), "h:mm a")
        }
      ]);
    }, 3000);
  };
  
  // Handle filter changes
  const handleFilterChange = (filterName: keyof FilterState, value: string) => {
    setFilters({
      ...filters,
      [filterName]: value
    });
  };
  
  // Handle tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    handleFilterChange("status", tab);
  };
  
  // Add to calendar
  const handleAddToCalendar = (liveClass: LiveClass) => {
    const startDate = new Date(`${liveClass.startDate}T${liveClass.startTime}`);
    const endDate = new Date(startDate.getTime() + liveClass.duration * 60000);
    
    const formattedStart = format(startDate, "yyyyMMdd'T'HHmmss");
    const formattedEnd = format(endDate, "yyyyMMdd'T'HHmmss");
    
    const calendarUrl = encodeURI([
      "https://calendar.google.com/calendar/render",
      "?action=TEMPLATE",
      `&text=${liveClass.title}`,
      `&details=${liveClass.description || "Live class"}`,
      `&location=${liveClass.meetingLink}`,
      `&dates=${formattedStart}/${formattedEnd}`
    ].join(""));
    
    window.open(calendarUrl, "_blank");
  };
  
  // Render a live class card
  const renderClassCard = (liveClass: LiveClass) => {
    const statusColor = getStatusColor(liveClass.status);
    
    return (
      <motion.div
        key={liveClass._id}
        variants={itemVariants}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700"
      >
        <div className="relative overflow-hidden">
          <Image
            src={liveClass.courseDetails?.courseImage || DefaultClassImage}
            alt={liveClass.title}
            width={400}
            height={200}
            className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-500"
          />
          
          <div className="absolute top-3 right-3">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor}`}>
              {liveClass.status === "live" ? "LIVE NOW" : liveClass.status.charAt(0).toUpperCase() + liveClass.status.slice(1)}
            </span>
          </div>
          
          {liveClass.status === "live" && (
            <div className="absolute bottom-3 right-3">
              <span className="flex items-center gap-1 bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                <LucideUsers className="w-3 h-3" />
                {liveClass.participants} watching
              </span>
            </div>
          )}
        </div>
        
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            {liveClass.title}
          </h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <LucideCalendar className="w-4 h-4 mr-2 text-primary-500" />
              <span>{formatDate(liveClass.startDate)}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <LucideClock className="w-4 h-4 mr-2 text-primary-500" />
              <span>{getClassTimeDisplay(liveClass)}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <LucideUser className="w-4 h-4 mr-2 text-primary-500" />
              <span>{liveClass.instructor.name}</span>
            </div>
            
            {liveClass.courseDetails && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <LucideBookOpen className="w-4 h-4 mr-2 text-primary-500" />
                <span className="truncate">{liveClass.courseDetails.title}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => handleViewDetails(liveClass)}
              className="flex-1 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/10 dark:text-primary-400 dark:hover:bg-primary-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              View Details
            </button>
            
            {liveClass.status === "live" ? (
              <button
                onClick={() => handleJoinClass(liveClass)}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Join Now
              </button>
            ) : liveClass.status === "upcoming" ? (
              <button
                onClick={() => handleAddToCalendar(liveClass)}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Add to Calendar
              </button>
            ) : liveClass.recordingUrl ? (
              <button
                onClick={() => handleWatchRecording(liveClass.recordingUrl!)}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Watch Recording
              </button>
            ) : (
              <button
                disabled
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400 rounded-lg cursor-not-allowed"
              >
                No Recording
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };
  
  return (
    <div className="px-4 py-6 md:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Live Classes
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Join live classes, interact with instructors, and access recordings.
        </p>
      </div>
      
      {/* Tabs */}
      <div className="mb-6">
        <TabNavigation
          tabs={[
            { id: "upcoming", label: "Upcoming" },
            { id: "live", label: "Live Now" },
            { id: "completed", label: "Completed" },
            { id: "all", label: "All Classes" }
          ]}
          activeTab={activeTab}
          onChange={handleTabChange}
        />
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar
            placeholder="Search live classes..."
            value={filters.searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange("searchTerm", e.target.value)}
            onClear={() => handleFilterChange("searchTerm", "")}
          />
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Select
            label="Category"
            options={categories.map(cat => ({ value: cat, label: cat === "all" ? "All Categories" : cat }))}
            value={filters.category}
            onChange={(value: string) => handleFilterChange("category", value)}
            className="w-full sm:w-40"
          />
          
          <Select
            label="Instructor"
            options={instructors.map(ins => ({ value: ins, label: ins === "all" ? "All Instructors" : ins }))}
            value={filters.instructor}
            onChange={(value: string) => handleFilterChange("instructor", value)}
            className="w-full sm:w-40"
          />
        </div>
      </div>
      
      {/* Error Message */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
          <p className="flex items-center">
            <LucideInfo className="w-5 h-5 mr-2" />
            {errorMessage}
          </p>
        </div>
      )}
      
      {/* Live Classes Grid */}
      {loading ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <LoadingIndicator type="spinner" size="lg" color="primary" text="Loading live classes..." />
        </div>
      ) : filteredClasses.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredClasses.map(renderClassCard)}
        </motion.div>
      ) : (
        <EmptyState
          icon={<LucideVideo size={48} />}
          title="No live classes found"
          description={activeTab === "all" ? "There are no live classes available." : `No ${activeTab} live classes available.`}
          action={{
            label: "Check again later",
            onClick: () => setActiveTab("all")
          }}
        />
      )}
      
      {/* Class Details Modal */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedClass && (
          <Modal
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            title="Live Class Details"
            size="lg"
          >
            <motion.div
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src={selectedClass.courseDetails?.courseImage || DefaultClassImage}
                  alt={selectedClass.title}
                  width={800}
                  height={400}
                  className="w-full h-64 object-cover rounded-lg"
                />
                
                <div className="absolute top-4 right-4">
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(selectedClass.status)}`}>
                    {selectedClass.status === "live" ? "LIVE NOW" : selectedClass.status.toUpperCase()}
                  </span>
                </div>
                
                {selectedClass.status === "live" && (
                  <div className="absolute bottom-4 right-4">
                    <span className="flex items-center gap-1 bg-black/70 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
                      <LucideUsers className="w-4 h-4" />
                      {selectedClass.participants} watching
                    </span>
                  </div>
                )}
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedClass.title}
                </h2>
                
                {selectedClass.description && (
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    {selectedClass.description}
                  </p>
                )}
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <LucideCalendar className="w-5 h-5 mr-3 text-primary-500" />
                    <span>{formatDate(selectedClass.startDate)}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <LucideClock className="w-5 h-5 mr-3 text-primary-500" />
                    <span>{getClassTimeDisplay(selectedClass)}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <LucideUser className="w-5 h-5 mr-3 text-primary-500" />
                    <span>{selectedClass.instructor.name}</span>
                  </div>
                  
                  {selectedClass.courseDetails && (
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <LucideBookOpen className="w-5 h-5 mr-3 text-primary-500" />
                      <span>{selectedClass.courseDetails.title}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {selectedClass.materials && selectedClass.materials.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Class Materials</h3>
                  <div className="space-y-2">
                    {selectedClass.materials.map((material, index) => (
                      <a
                        key={index}
                        href={material.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        {material.type === "pdf" ? (
                          <LucideFileText className="w-5 h-5 mr-3 text-red-500" />
                        ) : material.type === "link" ? (
                          <LucideExternalLink className="w-5 h-5 mr-3 text-blue-500" />
                        ) : (
                          <LucideFile className="w-5 h-5 mr-3 text-gray-500" />
                        )}
                        <span className="text-gray-700 dark:text-gray-300">{material.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                {selectedClass.status === "live" ? (
                  <>
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={() => handleJoinClass(selectedClass)}
                      leftIcon={<LucidePlay size={18} />}
                    >
                      Join Live Class
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setIsDetailsModalOpen(false);
                        setTimeout(() => handleOpenChat(selectedClass), 300);
                      }}
                      leftIcon={<LucideMessageCircle size={18} />}
                    >
                      Open Class Chat
                    </Button>
                  </>
                ) : selectedClass.status === "upcoming" ? (
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() => handleAddToCalendar(selectedClass)}
                    leftIcon={<LucideCalendar size={18} />}
                  >
                    Add to Calendar
                  </Button>
                ) : selectedClass.recordingUrl ? (
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() => handleWatchRecording(selectedClass.recordingUrl!)}
                    leftIcon={<LucidePlay size={18} />}
                  >
                    Watch Recording
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="flex-1"
                    disabled
                    leftIcon={<LucideVideoOff size={18} />}
                  >
                    No Recording Available
                  </Button>
                )}
              </div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
      
      {/* Live Class Chat Modal */}
      <AnimatePresence>
        {isChatModalOpen && selectedClass && (
          <Modal
            isOpen={isChatModalOpen}
            onClose={() => setIsChatModalOpen(false)}
            title={`Chat - ${selectedClass.title}`}
            size="md"
          >
            <motion.div
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col h-96"
            >
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg mb-4">
                {chatMessages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex ${msg.user === "You" ? "justify-end" : "justify-start"}`}
                  >
                    <div 
                      className={`max-w-3/4 rounded-lg px-4 py-2 ${
                        msg.user === "Instructor" 
                          ? "bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300" 
                          : msg.user === "You"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-xs">
                          {msg.user}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {msg.time}
                        </span>
                      </div>
                      <p>{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button
                  variant="primary"
                  onClick={handleSendMessage}
                  leftIcon={<LucideSend size={18} />}
                >
                  Send
                </Button>
              </div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveClasses; 