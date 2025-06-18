"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Calendar, Clock, Star, Eye, Play, Users, User, FileText, Video, MapPin, Globe } from "lucide-react";
import { toast } from "react-toastify";
import StudentDashboardLayout from "./StudentDashboardLayout";

interface UpcomingClass {
  id: string;
  title: string;
  instructor?: {
    name: string;
    rating: number;
  };
  category?: string;
  duration?: number;
  scheduledDate?: string;
  status?: 'scheduled' | 'live' | 'cancelled' | 'rescheduled';
  level?: 'beginner' | 'intermediate' | 'advanced';
  participants?: number;
  maxParticipants?: number;
  description?: string;
  meetingLink?: string;
  location?: string;
  isOnline?: boolean;
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

// Upcoming Class Card Component - matching demo classes style
const UpcomingClassCard = ({ upcomingClass, onViewDetails }: { upcomingClass: UpcomingClass; onViewDetails: (upcomingClass: UpcomingClass) => void }) => {
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
      case 'scheduled':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'cancelled':
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
      case 'rescheduled':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
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
            {upcomingClass?.title || "No Title Available"}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            by {upcomingClass?.instructor?.name || "No instructor"}
          </p>
          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(upcomingClass?.scheduledDate)}
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {upcomingClass?.duration ? `${upcomingClass.duration} min` : "Duration TBD"}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full">
          <Video className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
        
      {/* Category, Status and Level */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {upcomingClass?.category && (
            <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-full">
              {upcomingClass.category}
            </span>
          )}
          {upcomingClass?.status && (
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(upcomingClass.status)}`}>
              {upcomingClass.status === 'live' && <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></span>}
              {upcomingClass.status.charAt(0).toUpperCase() + upcomingClass.status.slice(1)}
            </span>
          )}
          {upcomingClass?.level && (
            <span className={`px-2 py-1 text-xs rounded-full ${getLevelColor(upcomingClass.level)}`}>
              {upcomingClass.level.charAt(0).toUpperCase() + upcomingClass.level.slice(1)}
            </span>
          )}
        </div>
      </div>

      {/* Location and Type */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {upcomingClass?.isOnline ? (
            <>
              <Globe className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Online</span>
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4 text-purple-500 mr-1" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {upcomingClass?.location || "In-person"}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center text-blue-600 dark:text-blue-400">
          <Users className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">
            {upcomingClass?.participants || 0}/{upcomingClass?.maxParticipants || 50}
          </span>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {upcomingClass?.instructor?.rating || "4.5"}
          </span>
        </div>
      </div>

      {/* Description */}
      {upcomingClass?.description && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {upcomingClass.description}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-2">
        <button 
          onClick={() => onViewDetails(upcomingClass)}
          className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </button>
        <button
          className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg transition-colors text-sm ${
            upcomingClass?.status === 'live' 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : upcomingClass?.status === 'scheduled'
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : upcomingClass?.status === 'cancelled'
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700 text-white'
          }`}
          disabled={upcomingClass?.status === 'cancelled'}
        >
          {upcomingClass?.status === 'live' ? (
            <>
              <Play className="w-4 h-4 mr-2" />
              Join Now
            </>
          ) : upcomingClass?.status === 'scheduled' ? (
            <>
              <Calendar className="w-4 h-4 mr-2" />
              Set Reminder
            </>
          ) : upcomingClass?.status === 'cancelled' ? (
            <>
              <X className="w-4 h-4 mr-2" />
              Cancelled
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Join Class
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const StudentUpcomingClasses: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedClass, setSelectedClass] = useState<UpcomingClass | null>(null);

  const tabs = [
    { name: "All", icon: Video },
    { name: "Today", icon: Calendar },
    { name: "Live", icon: Play },
    { name: "Upcoming", icon: Clock },
    { name: "Ended", icon: X }
  ];

  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingClass[]>([]);

  const fetchUpcomingClasses = async () => {
    try {
      // Simulate API call
      console.log('Fetching upcoming classes...');
    } catch (error) {
      console.error('Error fetching upcoming classes:', error);
      showToast.error('Failed to load upcoming classes');
    }
  };

  useEffect(() => {
    fetchUpcomingClasses();
  }, []);

  const handleViewDetails = (upcomingClass: UpcomingClass) => {
    setSelectedClass(upcomingClass);
  };

  const handleCloseModal = () => {
    setSelectedClass(null);
  };

  const getFilteredClasses = () => {
    let filtered = upcomingClasses;
    
    // Filter by tab
    switch (currentTab) {
      case 0: // All
        filtered = upcomingClasses;
        break;
      case 1: // Today
        const today = new Date().toDateString();
        filtered = upcomingClasses.filter(upcomingClass => 
          upcomingClass.scheduledDate && new Date(upcomingClass.scheduledDate).toDateString() === today
        );
        break;
      case 2: // Live
        filtered = upcomingClasses.filter(upcomingClass => upcomingClass.status === 'live');
        break;
      case 3: // Upcoming
        filtered = upcomingClasses.filter(upcomingClass => upcomingClass.status === 'scheduled');
        break;
      case 4: // Ended
        filtered = upcomingClasses.filter(upcomingClass => upcomingClass.status === 'cancelled' || upcomingClass.status === 'rescheduled');
        break;
      default:
        break;
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(upcomingClass =>
        upcomingClass.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        upcomingClass.instructor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        upcomingClass.category?.toLowerCase().includes(searchTerm.toLowerCase())
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
              <Video className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Upcoming Classes
            </h1>
          </motion.div>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4 mb-6">
            View your scheduled upcoming classes and join sessions
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
              placeholder="Search upcoming classes..."
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
              filteredContent.map((upcomingClass, index) => (
                <motion.div
                  key={upcomingClass.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <UpcomingClassCard
                    upcomingClass={upcomingClass}
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
                <Video className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {searchTerm ? "No upcoming classes found" : "No upcoming classes available"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm 
                    ? "Try adjusting your search term to find what you're looking for."
                    : "There are no upcoming classes scheduled at this time."}
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
                    Class Details
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

                  <div className="flex items-center gap-3">
                    {selectedClass?.isOnline ? <Globe className="w-5 h-5 text-primary-500" /> : <MapPin className="w-5 h-5 text-primary-500" />}
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Location</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedClass?.isOnline ? "Online" : selectedClass?.location || "In-person"}
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
                      No additional details available for this class.
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

const UpcomingClassesDashboard: React.FC = () => {
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
      <StudentUpcomingClasses />
    </StudentDashboardLayout>
  );
};

export default UpcomingClassesDashboard;
