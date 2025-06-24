"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Calendar, Clock, Star, Eye, Play, Video, Users, User, FileText, Download, Folder, Globe, Loader2, ChevronRight, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";

interface RecordedSession {
  id: string;
  course_title: string;
  instructor?: {
    name: string;
    rating: number;
  };
  category?: string;
  course_tag?: string;
  duration?: string;
  date?: string;
  created_at?: string;
  description?: string;
  views?: number;
  rating?: number;
  thumbnail?: string;
  video_url?: string;
  status?: 'available' | 'processing' | 'unavailable';
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
}

// Enhanced TabButton with count badges matching upcoming classes style
const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children, count }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`relative inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 overflow-hidden group ${
      active
        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
        : 'bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-gray-700/80 border border-gray-200 dark:border-gray-700'
    }`}
  >
    {/* Animated background for active state */}
    {active && (
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 animate-pulse"></div>
    )}
    
    <span className="relative z-10 flex items-center gap-2">
      {children}
      {count !== undefined && count > 0 && (
        <span className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full ${
          active 
            ? 'bg-white/20 text-white' 
            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
        }`}>
          {count}
        </span>
      )}
    </span>
  </motion.button>
);

// Enhanced Recorded Session Card Component
const RecordedSessionCard = ({ 
  session, 
  onViewDetails,
  onPlay
}: { 
  session: RecordedSession; 
  onViewDetails: (session: RecordedSession) => void;
  onPlay: (session: RecordedSession) => void;
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not available";
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
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
    }
  };

  const getStatusStripe = (status?: string) => {
    switch (status) {
      case 'available':
        return 'bg-gradient-to-r from-green-500 to-green-600';
      case 'processing':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
      case 'unavailable':
        return 'bg-gradient-to-r from-red-500 to-red-600';
      default:
        return 'bg-gradient-to-r from-blue-500 to-blue-600';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Status stripe */}
      <div className={`w-full h-1 ${getStatusStripe(session?.status || 'available')} rounded-t-xl mb-4 -mt-6 -mx-6`}></div>
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-1">
            {session?.course_title || "No Title Available"}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {session?.category || session?.course_tag || "General"} • Recorded Session
          </p>
          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(session?.date || session?.created_at)}
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {session?.duration || "Duration TBD"}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
          <Video className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
        
      {/* Category and Status */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {(session?.category || session?.course_tag) && (
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
              {session.category || session.course_tag}
            </span>
          )}
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(session?.status || 'available')}`}>
            {session?.status === 'processing' && <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-1 animate-pulse"></span>}
            {(session?.status || 'available').charAt(0).toUpperCase() + (session?.status || 'available').slice(1)}
          </span>
        </div>
      </div>

      {/* Rating and Views */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {session?.rating || session?.instructor?.rating || "4.5"}
          </span>
        </div>
        <div className="flex items-center text-blue-600 dark:text-blue-400">
          <Eye className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">
            {session?.views || 0} views
          </span>
        </div>
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
      <div className="flex space-x-2">
        <button 
          onClick={() => onViewDetails(session)}
          className="flex-1 flex items-center justify-center px-3 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </button>
        <button
          onClick={() => onPlay(session)}
          className={`flex-1 flex items-center justify-center px-3 py-2.5 rounded-xl transition-colors text-sm font-medium ${
            session?.status === 'available' 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : session?.status === 'processing'
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
          disabled={session?.status === 'unavailable'}
        >
          <Play className="w-4 h-4 mr-2" />
          {session?.status === 'available' ? 'Play Video' : 
           session?.status === 'processing' ? 'Processing' : 'Unavailable'}
        </button>
      </div>
    </div>
  );
};

const StudentRecordedSessions: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedSession, setSelectedSession] = useState<RecordedSession | null>(null);
  const [recordedSessions, setRecordedSessions] = useState<RecordedSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getQuery } = useGetQuery();

  // Get auth token
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  // Fetch recorded sessions from API
  const fetchRecordedSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (typeof window !== "undefined") {
        const storedUserId = localStorage.getItem("userId");
        const token = getAuthToken();
        
        if (!storedUserId || !token) {
          setError("Please log in to view your recorded sessions.");
          setLoading(false);
          return;
        }
        
        const headers = {
          'x-access-token': token,
          'Content-Type': 'application/json'
        };
        
        await getQuery({
          url: apiUrls?.courses?.getRecordedVideosForUser(storedUserId),
          headers,
          requireAuth: true,
          onSuccess: (response) => {
            const recordedData = response?.courses || response?.data?.courses || response;
            
            if (Array.isArray(recordedData)) {
              const processedData = recordedData.map(session => ({
                ...session,
                date: session.date || session.created_at || new Date().toISOString(),
                category: session.category || session.course_tag || "General",
                status: session.status || 'available'
              }));
              
              setRecordedSessions(processedData);
            } else {
              setRecordedSessions([]);
            }
            
            setLoading(false);
          },
          onFail: (error) => {
            console.error("Error fetching recorded sessions:", error);
            
            if (error?.response?.status === 401) {
              setError("Your session has expired. Please log in again.");
            } else if (error?.response?.status === 404) {
              setRecordedSessions([]);
            } else {
              setError("Failed to load recorded sessions. Please try again later.");
            }
            
            setLoading(false);
          }
        });
      }
    } catch (error) {
      console.error("Error in fetchRecordedSessions:", error);
      setError("An unexpected error occurred. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecordedSessions();
  }, []);

  const handleViewDetails = (session: RecordedSession) => {
    setSelectedSession(session);
  };

  const handleCloseModal = () => {
    setSelectedSession(null);
  };

  const handlePlayVideo = (session: RecordedSession) => {
    if (session.video_url) {
      window.open(session.video_url, '_blank');
    } else {
      router.push(`/dashboards/my-courses/${session.id}`);
    }
  };

  const getFilteredSessions = () => {
    let filtered = recordedSessions;
    
    // Filter by tab
    switch (currentTab) {
      case 0: // All Sessions
        filtered = recordedSessions;
        break;
      case 1: // Available
        filtered = recordedSessions.filter(session => session.status === 'available');
        break;
      case 2: // Recent
        filtered = recordedSessions.filter(session => {
          const sessionDate = new Date(session.date || session.created_at || '');
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          return sessionDate >= oneWeekAgo;
        });
        break;
      case 3: // Favorites
        // For now, show all. Later can be filtered by user favorites
        filtered = recordedSessions;
        break;
      default:
        break;
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(session =>
        session.course_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.course_tag?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      // Sort by date, newest first
      const dateA = new Date(a.date || a.created_at || '');
      const dateB = new Date(b.date || b.created_at || '');
      return dateB.getTime() - dateA.getTime();
    });
  };

  const filteredContent = getFilteredSessions();

  // Count sessions for each tab
  const tabCounts = {
    all: recordedSessions.length,
    available: recordedSessions.filter(session => session.status === 'available').length,
    recent: recordedSessions.filter(session => {
      const sessionDate = new Date(session.date || session.created_at || '');
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return sessionDate >= oneWeekAgo;
    }).length,
    favorites: recordedSessions.length // For now, same as all
  };

  const tabs = [
    { name: "All Sessions", icon: Video, count: tabCounts.all },
    { name: "Available", icon: Check, count: tabCounts.available },
    { name: "Recent", icon: Clock, count: tabCounts.recent },
    { name: "Favorites", icon: Star, count: tabCounts.favorites }
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
              <Video className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                Recorded Sessions
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                Access your course recordings anytime
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
              placeholder="Search recorded sessions..."
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
            <p className="text-gray-600 dark:text-gray-400">Loading recorded sessions...</p>
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
              <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Error Loading Sessions</h3>
            </div>
            <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
            <button
              onClick={fetchRecordedSessions}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
            >
              Try Again
            </button>
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
                filteredContent.map((session, index) => (
                  <motion.div
                    key={session.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <RecordedSessionCard
                      session={session}
                      onViewDetails={handleViewDetails}
                      onPlay={handlePlayVideo}
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
                    <Video className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {searchTerm ? "No matching sessions found" : "No recorded sessions available"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md">
                    {searchTerm 
                      ? "Try adjusting your search term to find what you're looking for."
                      : "You don't have any recorded sessions yet. Check back after attending some classes."}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Enhanced Details Modal */}
        <AnimatePresence>
          {selectedSession && (
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
                      <Video className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedSession?.course_title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Recorded Session
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Folder className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Category</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{selectedSession?.category || selectedSession?.course_tag || "General"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Duration</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedSession?.duration || "Duration TBD"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Recorded Date</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedSession?.date || selectedSession?.created_at 
                            ? new Date(selectedSession.date || selectedSession.created_at).toLocaleDateString() 
                            : "Date not available"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Eye className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Views</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedSession?.views || 0} views
                        </p>
                      </div>
                    </div>

                    {selectedSession?.description && (
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Description</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{selectedSession.description}</p>
                        </div>
                      </div>
                    )}

                    {(!selectedSession?.description) && (
                      <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                        No additional details available for this session.
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
                      onClick={() => handlePlayVideo(selectedSession)}
                      className={`flex-1 px-4 py-2 rounded-xl font-medium transition-colors ${
                        selectedSession?.status === 'available' 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      }`}
                      disabled={selectedSession?.status !== 'available'}
                    >
                      {selectedSession?.status === 'available' ? 'Watch Video' : 'Not Available'}
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

export default StudentRecordedSessions;
