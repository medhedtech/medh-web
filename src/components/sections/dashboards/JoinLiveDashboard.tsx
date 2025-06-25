"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Calendar, Clock, Star, Eye, Play, Users, User, FileText, Video, MonitorPlay, Globe, AlertCircle, Loader2, ChevronRight, Check } from "lucide-react";
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
  count?: number;
  isLive?: boolean;
}

// Enhanced TabButton with count badges and live indicators matching upcoming classes style
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

// Enhanced Live Class Card Component
const LiveClassCard = ({ 
  liveClass, 
  onViewDetails 
}: { 
  liveClass: LiveClass; 
  onViewDetails: (liveClass: LiveClass) => void;
}) => {
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

  const getStatusStripe = (status?: string) => {
    switch (status) {
      case 'live':
        return 'bg-gradient-to-r from-red-500 to-red-600';
      case 'starting-soon':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
      case 'waiting':
        return 'bg-gradient-to-r from-blue-500 to-blue-600';
      case 'ended':
        return 'bg-gradient-to-r from-gray-400 to-gray-500';
      default:
        return 'bg-gradient-to-r from-blue-500 to-blue-600';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Status stripe */}
      <div className={`w-full h-1 ${getStatusStripe(liveClass?.status)} rounded-t-xl mb-4 -mt-6 -mx-6`}></div>
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-1">
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
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
          <MonitorPlay className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
        
      {/* Category, Status and Level */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {liveClass?.category && (
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
              {liveClass.category}
            </span>
          )}
          {liveClass?.status && (
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(liveClass.status)}`}>
              {liveClass.status === 'live' && <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></span>}
              {liveClass.status === 'starting-soon' && <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-1 animate-pulse"></span>}
              {liveClass.status.charAt(0).toUpperCase() + liveClass.status.slice(1).replace('-', ' ')}
            </span>
          )}
          {liveClass?.level && (
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getLevelColor(liveClass.level)}`}>
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
          className="flex-1 flex items-center justify-center px-3 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </button>
        <button
          className={`flex-1 flex items-center justify-center px-3 py-2.5 rounded-xl transition-colors text-sm font-medium ${
            liveClass?.status === 'live' 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : liveClass?.status === 'starting-soon'
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
              : liveClass?.status === 'waiting'
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : liveClass?.status === 'ended'
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
          disabled={liveClass?.status === 'ended'}
        >
          <Play className="w-4 h-4 mr-2" />
          {liveClass?.status === 'live' ? 'Join Now' : 
           liveClass?.status === 'starting-soon' ? 'Join Soon' : 
           liveClass?.status === 'waiting' ? 'Join Class' : 
           liveClass?.status === 'ended' ? 'Ended' : 'Join Class'}
        </button>
      </div>
    </div>
  );
};

const StudentJoinLive: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedLiveClass, setSelectedLiveClass] = useState<LiveClass | null>(null);
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch live classes from API
  const fetchLiveClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Replace with actual API call
      // Example API call structure:
      // const response = await fetch('/api/student/live-classes');
      // const data = await response.json();
      // setLiveClasses(data.classes || []);
      
      // For now, set empty array until API is integrated
      setLiveClasses([]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching live classes:', error);
      setError('Failed to load live classes');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveClasses();
  }, []);

  const handleViewDetails = (liveClass: LiveClass) => {
    setSelectedLiveClass(liveClass);
  };

  const handleCloseModal = () => {
    setSelectedLiveClass(null);
  };

  const getFilteredClasses = () => {
    let filtered = liveClasses;
    
    // Filter by tab
    switch (currentTab) {
      case 0: // All Classes
        filtered = liveClasses;
        break;
      case 1: // Live Now
        filtered = liveClasses.filter(cls => cls.status === 'live');
        break;
      case 2: // Starting Soon
        filtered = liveClasses.filter(cls => cls.status === 'starting-soon');
        break;
      case 3: // Waiting Room
        filtered = liveClasses.filter(cls => cls.status === 'waiting');
        break;
      default:
        break;
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(cls =>
        cls.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.instructor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      // Sort by status priority, then by start time
      const statusPriority = {
        'live': 1,
        'starting-soon': 2,
        'waiting': 3,
        'ended': 4
      };
      
      const aPriority = statusPriority[a.status || 'waiting'];
      const bPriority = statusPriority[b.status || 'waiting'];
      
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      
      if (!a.startTime && !b.startTime) return 0;
      if (!a.startTime) return 1;
      if (!b.startTime) return -1;
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });
  };

  const filteredContent = getFilteredClasses();

  // Count classes for each tab
  const tabCounts = {
    all: liveClasses.length,
    live: liveClasses.filter(cls => cls.status === 'live').length,
    startingSoon: liveClasses.filter(cls => cls.status === 'starting-soon').length,
    waiting: liveClasses.filter(cls => cls.status === 'waiting').length
  };

  // Get live class count for special highlighting
  const liveClassCount = liveClasses.filter(cls => cls.status === 'live').length;

  const tabs = [
    { name: "All Classes", icon: MonitorPlay, count: tabCounts.all },
    { name: "Live Now", icon: Play, count: tabCounts.live, isLive: liveClassCount > 0 },
    { name: "Starting Soon", icon: Clock, count: tabCounts.startingSoon },
    { name: "Waiting Room", icon: Users, count: tabCounts.waiting }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 lg:p-8 rounded-lg max-w-7xl mx-auto"
    >
      <div className="flex flex-col space-y-6">
        {/* Enhanced Header */}
        <div className="text-center pt-6 pb-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-center mb-4"
          >
            <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl backdrop-blur-sm mr-4">
              <MonitorPlay className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                Join Live Classes
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                Connect to your live sessions
              </p>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            className="relative max-w-lg mx-auto"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search live classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            />
          </motion.div>
        </div>

        {/* Enhanced Tabs */}
        <div className="flex justify-center">
          <div className="inline-flex bg-gray-100/80 dark:bg-gray-800/80 rounded-2xl p-1.5 backdrop-blur-sm">
            {tabs.map((tab, idx) => {
              const TabIcon = tab.icon;
              return (
                <TabButton
                  key={idx}
                  active={currentTab === idx}
                  onClick={() => setCurrentTab(idx)}
                  count={tab.count}
                  isLive={tab.isLive}
                >
                  <TabIcon className="w-4 h-4" />
                  <span className="font-medium">{tab.name}</span>
                </TabButton>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading live classes...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center"
          >
            <div className="flex items-center justify-center mb-2">
              <X className="w-6 h-6 text-red-500 mr-2" />
              <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Error Loading Classes</h3>
            </div>
            <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
            <button
              onClick={fetchLiveClasses}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Live Classes Alert Banner */}
        {!loading && !error && liveClassCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl p-4 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <h3 className="text-lg font-semibold">
                  {liveClassCount} Live Class{liveClassCount > 1 ? 'es' : ''} in Progress!
                </h3>
              </div>
              <button
                onClick={() => setCurrentTab(1)} // Switch to Live Now tab
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-medium"
              >
                Join Live Classes
              </button>
            </div>
          </motion.div>
        )}

        {/* Content */}
        {!loading && !error && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
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
                  className="col-span-full flex flex-col items-center justify-center text-center py-16"
                >
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-4">
                    <MonitorPlay className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {searchTerm ? "No matching classes found" : "No live classes available"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md">
                    {searchTerm 
                      ? "Try adjusting your search term to find what you're looking for."
                      : "You don't have any live classes scheduled. Check back later or contact your instructor."}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Enhanced Details Modal */}
        <AnimatePresence>
          {selectedLiveClass && (
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
                className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-2xl max-w-lg w-full relative max-h-[85vh] overflow-y-auto"
              >
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </motion.button>

                <div className="pr-12">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                      <MonitorPlay className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedLiveClass?.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Live Class Session
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Instructor</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{selectedLiveClass?.instructor?.name || "Not specified"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Duration</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedLiveClass?.duration ? `${selectedLiveClass.duration} minutes` : "Duration TBD"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Schedule</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedLiveClass?.startTime && selectedLiveClass?.endTime 
                            ? `${new Date(selectedLiveClass.startTime).toLocaleString()} - ${new Date(selectedLiveClass.endTime).toLocaleTimeString()}`
                            : "Schedule TBD"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Participants</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedLiveClass?.participants || 0} / {selectedLiveClass?.maxParticipants || 50} joined
                        </p>
                      </div>
                    </div>

                    {selectedLiveClass?.description && (
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Description</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{selectedLiveClass.description}</p>
                        </div>
                      </div>
                    )}

                    {(!selectedLiveClass?.description) && (
                      <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                        No additional details available for this class.
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={handleCloseModal}
                      className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                    >
                      Close
                    </button>
                    <button
                      className={`flex-1 px-4 py-2 rounded-xl font-medium transition-colors ${
                        selectedLiveClass?.status === 'live' 
                          ? 'bg-red-600 hover:bg-red-700 text-white' 
                          : selectedLiveClass?.status === 'starting-soon'
                          ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                          : selectedLiveClass?.status === 'ended'
                          ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                      disabled={selectedLiveClass?.status === 'ended'}
                    >
                      {selectedLiveClass?.status === 'live' ? 'Join Live Class' : 
                       selectedLiveClass?.status === 'starting-soon' ? 'Join Soon' : 
                       selectedLiveClass?.status === 'ended' ? 'Class Ended' : 'Join Class'}
                    </button>
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