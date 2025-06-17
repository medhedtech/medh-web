"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Calendar, Clock, Star, Eye, Play, MonitorPlay, Users, User, FileText } from "lucide-react";
import { toast } from "react-toastify";
import StudentDashboardLayout from "./StudentDashboardLayout";

interface DemoClass {
  id: string;
  title: string;
  instructor?: {
    name: string;
    rating: number;
  };
  category?: string;
  duration?: number;
  scheduledDate?: string;
  status?: 'upcoming' | 'live' | 'completed' | 'recorded';
  level?: 'beginner' | 'intermediate' | 'advanced';
  participants?: number;
  maxParticipants?: number;
  description?: string;
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

// Demo Class Card Component - matching enrolled courses style
const DemoClassCard = ({ demoClass, onViewMaterials }: { demoClass: DemoClass; onViewMaterials: (demoClass: DemoClass) => void }) => {
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
      case 'upcoming':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'recorded':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
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
            {demoClass?.title || "No Title Available"}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            by {demoClass?.instructor?.name || "No instructor"}
          </p>
          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(demoClass?.scheduledDate)}
            </div>
              <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {demoClass?.duration ? `${demoClass.duration} min` : "Duration TBD"}
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
          {demoClass?.category && (
            <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-full">
              {demoClass.category}
            </span>
          )}
          {demoClass?.status && (
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(demoClass.status)}`}>
              {demoClass.status === 'live' && <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></span>}
              {demoClass.status.charAt(0).toUpperCase() + demoClass.status.slice(1)}
            </span>
          )}
          {demoClass?.level && (
            <span className={`px-2 py-1 text-xs rounded-full ${getLevelColor(demoClass.level)}`}>
              {demoClass.level.charAt(0).toUpperCase() + demoClass.level.slice(1)}
            </span>
          )}
        </div>
      </div>

      {/* Rating and Participants */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {demoClass?.instructor?.rating || "4.5"}
          </span>
        </div>
        <div className="flex items-center text-blue-600 dark:text-blue-400">
          <Users className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">
            {demoClass?.participants || 0}/{demoClass?.maxParticipants || 50}
          </span>
        </div>
      </div>

        {/* Description */}
      {demoClass?.description && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {demoClass.description}
        </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-2">
        <button 
          onClick={() => onViewMaterials(demoClass)}
          className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </button>
        <button
          className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg transition-colors text-sm ${
            demoClass?.status === 'live' 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : demoClass?.status === 'upcoming'
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-primary-600 hover:bg-primary-700 text-white'
          }`}
        >
          {demoClass?.status === 'live' ? (
            <>
              <Play className="w-4 h-4 mr-2" />
              Join Live
            </>
          ) : demoClass?.status === 'upcoming' ? (
            <>
              <Calendar className="w-4 h-4 mr-2" />
              Register
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Watch
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Demo Feedback Form Component
const DemoFeedbackForm: React.FC = () => {
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [overallRating, setOverallRating] = useState<number>(0);
  const [contentQuality, setContentQuality] = useState<string>("");
  const [instructorPerformance, setInstructorPerformance] = useState<string>("");
  const [additionalComments, setAdditionalComments] = useState<string>("");
  const [wouldRecommend, setWouldRecommend] = useState<string>("");

  const handleSubmitFeedback = () => {
    // Handle feedback submission
    showToast.success("Feedback submitted successfully!");
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-6 mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-emerald-500 rounded-full mr-4">
            <Star className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              Demo Session Feedback
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Help us improve by sharing your experience
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="space-y-6">
          {/* Demo Session Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Which demo session would you like to provide feedback for?
            </label>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
            >
              <option value="">Select a demo session</option>
            </select>
          </div>

          {/* Overall Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Overall Rating
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setOverallRating(rating)}
                  className={`p-2 rounded-lg border-2 transition-all duration-200 ${
                    overallRating >= rating
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-emerald-300'
                  }`}
                >
                  <Star
                    className={`w-6 h-6 ${
                      overallRating >= rating
                        ? 'text-emerald-500 fill-current'
                        : 'text-gray-400'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Content Quality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              How would you rate the content quality?
            </label>
            <div className="space-y-2">
              {['Excellent', 'Good', 'Average'].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name="contentQuality"
                    value={option}
                    checked={contentQuality === option}
                    onChange={(e) => setContentQuality(e.target.value)}
                    className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Instructor Performance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              How was the instructor's performance?
            </label>
            <div className="space-y-2">
              {['Excellent', 'Good', 'Average'].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name="instructorPerformance"
                    value={option}
                    checked={instructorPerformance === option}
                    onChange={(e) => setInstructorPerformance(e.target.value)}
                    className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Comments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Additional Comments
            </label>
            <textarea
              value={additionalComments}
              onChange={(e) => setAdditionalComments(e.target.value)}
              placeholder="Share your thoughts, suggestions, or any specific feedback about the demo session..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 resize-none"
            />
          </div>

          {/* Recommendation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Would you recommend this demo to others?
            </label>
            <div className="space-y-2">
              {['Yes', 'No'].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name="wouldRecommend"
                    value={option}
                    checked={wouldRecommend === option}
                    onChange={(e) => setWouldRecommend(e.target.value)}
                    className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              onClick={handleSubmitFeedback}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
            >
              <Star className="w-5 h-5 mr-2" />
              Submit Feedback
            </button>
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentDemoClasses: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [allDemoClasses, setAllDemoClasses] = useState<DemoClass[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<DemoClass[]>([]);
  const [completedClasses, setCompletedClasses] = useState<DemoClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<DemoClass | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDemoClasses = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // No demo data - empty arrays
        const emptyDemoClasses: DemoClass[] = [];

        setAllDemoClasses(emptyDemoClasses);
        setUpcomingClasses(emptyDemoClasses);
        setCompletedClasses(emptyDemoClasses);
        
      } catch (err) {
        console.error("Error fetching demo classes:", err);
        setError("Failed to load demo classes. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDemoClasses();
  }, []);

  const tabs = [
    { name: "Demo Scheduled Details", content: allDemoClasses },
    { name: "Demo Attend Details", content: upcomingClasses },
    { name: "Demo Attend Certificate", content: completedClasses },
    { name: "Demo Feedback/Summary", content: [] },
  ];

  const handleViewDetails = (demoClass: DemoClass) => {
    setSelectedClass(demoClass);
  };

  const handleCloseModal = () => {
    setSelectedClass(null);
  };

  const filteredContent = tabs[currentTab].content.filter(demoClass => 
    demoClass?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="flex items-center gap-3"
        >
          <MonitorPlay className="w-8 h-8 text-primary-500" />
          <span className="text-gray-600 dark:text-gray-400 text-lg">Loading your demo classes...</span>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-6 bg-red-50 dark:bg-red-900/20 rounded-lg max-w-md">
          <MonitorPlay className="w-12 h-12 text-red-500" />
          <h3 className="text-xl font-semibold text-red-700 dark:text-red-400">Error Loading Demo Classes</h3>
          <p className="text-red-600 dark:text-red-300 text-center">{error}</p>
          <button 
            onClick={() => window.location.reload()}
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
              Demo Classes
            </h1>
          </motion.div>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4 mb-6">
            Explore and join our demo classes to get a preview of our courses
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
              placeholder="Search demo classes..."
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
          {currentTab === 3 ? (
            // Show feedback form for "Demo Feedback/Summary" tab
            <motion.div
              key="feedback-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <DemoFeedbackForm />
            </motion.div>
          ) : currentTab === 2 ? (
            // Show certificate message for "Demo Attend Certificate" tab
            <motion.div
              key="certificate-message"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center text-center py-12"
            >
              <MonitorPlay className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No certificate available
              </h3>
            </motion.div>
          ) : (
            // Show demo classes for other tabs
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {filteredContent.length > 0 ? (
                filteredContent.map((demoClass, index) => (
                  <motion.div
                    key={demoClass.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <DemoClassCard
                      demoClass={demoClass}
                      onViewMaterials={handleViewDetails}
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
                    {searchTerm ? "No demo classes found" : "No demo classes available"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchTerm 
                      ? "Try adjusting your search term to find what you're looking for."
                      : "There are no demo classes available in this category yet."}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
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
                    Demo Class Details
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
                      No additional details available for this demo class.
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

const DemoClassesDashboard: React.FC = () => {
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
      <StudentDemoClasses />
    </StudentDashboardLayout>
  );
};

export default DemoClassesDashboard; 
