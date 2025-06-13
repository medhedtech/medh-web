"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Calendar, Clock, Star, Eye, Play, Users, User, FileText, Video, MonitorPlay, Globe, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import StudentDashboardLayout from "./StudentDashboardLayout";

interface LiveClass {
  id: string;
  title: string;
  instructor?: {
    name: string;
    rating: number;
  };
  category?: string;
  duration?: number;
  startTime?: string;
  endTime?: string;
  status?: 'live' | 'starting-soon' | 'waiting' | 'ended';
  level?: 'beginner' | 'intermediate' | 'advanced';
  participants?: number;
  maxParticipants?: number;
  description?: string;
  meetingLink?: string;
  isOngoing?: boolean;
  timeLeft?: number; // minutes until start
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

// Updated TabButton with blog-style filter button styling
const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 overflow-hidden group ${
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
    
    <span className="relative z-10 group-hover:scale-110 transition-transform">{children}</span>
  </motion.button>
);

// Live Class Card Component - matching demo classes style
const LiveClassCard = ({ liveClass, onViewDetails }: { liveClass: LiveClass; onViewDetails: (liveClass: LiveClass) => void }) => {
  const formatTime = (timeString?: string) => {
    if (!timeString) return "Time TBD";
    const time = new Date(timeString);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getTimeUntilStart = (startTime?: string) => {
    if (!startTime) return "";
    const now = new Date();
    const start = new Date(startTime);
    const diffMs = start.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins <= 0) return "Starting now";
    if (diffMins < 60) return `Starts in ${diffMins} min`;
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    return `Starts in ${hours}h ${minutes}m`;
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'live':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'starting-soon':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'waiting':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'ended':
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
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
            {liveClass?.title || "No Title Available"}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            by {liveClass?.instructor?.name || "No instructor"}
          </p>
          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {formatTime(liveClass?.startTime)} - {formatTime(liveClass?.endTime)}
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {getTimeUntilStart(liveClass?.startTime)}
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
          {liveClass?.category && (
            <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-full">
              {liveClass.category}
            </span>
          )}
          {liveClass?.status && (
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(liveClass.status)}`}>
              {liveClass.status === 'live' && <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></span>}
              {liveClass.status === 'starting-soon' && <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-1 animate-pulse"></span>}
              {liveClass.status.charAt(0).toUpperCase() + liveClass.status.slice(1).replace('-', ' ')}
            </span>
          )}
          {liveClass?.level && (
            <span className={`px-2 py-1 text-xs rounded-full ${getLevelColor(liveClass.level)}`}>
              {liveClass.level.charAt(0).toUpperCase() + liveClass.level.slice(1)}
            </span>
          )}
        </div>
      </div>

      {/* Participants and Rating */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {liveClass?.instructor?.rating || "4.5"}
          </span>
        </div>
        <div className="flex items-center text-blue-600 dark:text-blue-400">
          <Users className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">
            {liveClass?.participants || 0}/{liveClass?.maxParticipants || 50}
          </span>
        </div>
      </div>

      {/* Description */}
      {liveClass?.description && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {liveClass.description}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-2">
        <button 
          onClick={() => onViewDetails(liveClass)}
          className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </button>
        <button
          className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg transition-colors text-sm ${
            liveClass?.status === 'live' 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : liveClass?.status === 'starting-soon'
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
              : liveClass?.status === 'waiting'
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : liveClass?.status === 'ended'
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700 text-white'
          }`}
          disabled={liveClass?.status === 'ended'}
        >
          {liveClass?.status === 'live' ? (
            <>
              <Play className="w-4 h-4 mr-2" />
              Join Now
            </>
          ) : liveClass?.status === 'starting-soon' ? (
            <>
              <AlertCircle className="w-4 h-4 mr-2" />
              Get Ready
            </>
          ) : liveClass?.status === 'waiting' ? (
            <>
              <Clock className="w-4 h-4 mr-2" />
              Wait to Join
            </>
          ) : liveClass?.status === 'ended' ? (
            <>
              <X className="w-4 h-4 mr-2" />
              Ended
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Join
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const StudentJoinLive: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedClass, setSelectedClass] = useState<LiveClass | null>(null);

  const tabs = [
    { name: "All", icon: MonitorPlay },
    { name: "Upcoming", icon: Clock },
    { name: "Live", icon: Play },
    { name: "Completed", icon: AlertCircle }
  ];

  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);

  const fetchLiveClasses = async () => {
    try {
      // Simulate API call
      console.log('Fetching live classes...');
    } catch (error) {
      console.error('Error fetching live classes:', error);
      toast.error('Failed to load live classes');
    }
  };

  useEffect(() => {
    fetchLiveClasses();
  }, []);

  const handleViewDetails = (liveClass: LiveClass) => {
    setSelectedClass(liveClass);
  };

  const handleCloseModal = () => {
    setSelectedClass(null);
  };

  const getFilteredClasses = () => {
    let filtered = liveClasses;
    
    // Filter by tab
    switch (currentTab) {
      case 0: // All
        filtered = liveClasses;
        break;
      case 1: // Upcoming
        filtered = liveClasses.filter(liveClass => liveClass.status === 'starting-soon' || liveClass.status === 'waiting');
        break;
      case 2: // Live
        filtered = liveClasses.filter(liveClass => liveClass.status === 'live');
        break;
      case 3: // Completed
        filtered = liveClasses.filter(liveClass => liveClass.status === 'ended');
        break;
      default:
        break;
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(liveClass =>
        (liveClass.title && liveClass.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (liveClass.instructor?.name && liveClass.instructor.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (liveClass.category && liveClass.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  };

  const filteredContent = getFilteredClasses();

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
              Join Live Classes
            </h1>
          </motion.div>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4 mb-6">
            Join your live classes and interactive sessions in real-time
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
              placeholder="Search live classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
            />
          </motion.div>
        </div>

        {/* Tabs - in a box container */}
        <div className="flex justify-center">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {tabs.map((tab, idx) => {
              return (
                <TabButton
                  key={idx}
                  active={currentTab === idx}
                  onClick={() => setCurrentTab(idx)}
                >
                  <span className="relative z-10 font-medium">{tab.name}</span>
                </TabButton>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {filteredContent.length > 0 ? (
              filteredContent.map((liveClass, index) => (
                <motion.div
                  key={liveClass.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <LiveClassCard
                    liveClass={liveClass}
                    onViewDetails={handleViewDetails}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-full flex flex-col items-center justify-center text-center py-12"
              >
                <MonitorPlay className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {searchTerm ? "No live classes found" : "No live classes available"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm 
                    ? "Try adjusting your search term to find what you're looking for."
                    : "There are no live classes happening right now."}
                </p>
              </motion.div>
            )}
          </motion.div>
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
                    Live Class Details
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
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Time</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedClass?.startTime && selectedClass?.endTime
                          ? `${new Date(selectedClass.startTime).toLocaleTimeString()} - ${new Date(selectedClass.endTime).toLocaleTimeString()}`
                          : "Time TBD"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Participants</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedClass?.participants || 0} / {selectedClass?.maxParticipants || 50} joined
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Status</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedClass?.status?.charAt(0).toUpperCase() + selectedClass?.status?.slice(1).replace('-', ' ')}
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
                      No additional details available for this live class.
                    </p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const JoinLiveDashboard: React.FC = () => {
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
      <StudentJoinLive />
    </StudentDashboardLayout>
  );
};

export default JoinLiveDashboard; 