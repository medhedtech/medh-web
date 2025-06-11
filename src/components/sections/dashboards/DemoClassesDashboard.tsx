"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import DashboardLayout from './StudentDashboardLayout';
import { 
  MonitorPlay, 
  Calendar, 
  Clock, 
  Play, 
  Bookmark, 
  Star, 
  Filter, 
  Search, 
  CheckCircle, 
  User, 
  Eye,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Users
} from 'lucide-react';

// Utility function for formatting dates
const formatDate = (dateString: string) => {
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

// TypeScript interfaces
interface IDemoClass {
  _id: string;
  title: string;
  description: string;
  instructor: {
    name: string;
    avatar?: string;
    rating: number;
  };
  thumbnail: string;
  duration: number; // in minutes
  scheduledDate: string;
  status: 'upcoming' | 'live' | 'completed' | 'recorded';
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  participants: number;
  maxParticipants: number;
  isBookmarked: boolean;
  hasWatched: boolean;
  recordingUrl?: string;
  joinUrl?: string;
  tags: string[];
}

interface IDemoClassesDashboardProps {
  studentId?: string;
}

/**
 * DemoClassesContent - The actual content component for demo classes
 * Features: Search, Filter, Categories, Responsive Design
 */
const DemoClassesContent: React.FC<IDemoClassesDashboardProps> = ({ studentId }) => {
  const router = useRouter();
  
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDemoOption, setSelectedDemoOption] = useState<string | null>(null);

  // Demo classes data - In production, this would come from an API
  const [demoClasses, setDemoClasses] = useState<IDemoClass[]>([]);

  // Function to fetch demo classes from API
  const fetchDemoClasses = React.useCallback(async () => {
    setLoading(true);
    try {
      // In production, replace this with actual API call
      // const response = await fetch('/api/demo-classes');
      // const data = await response.json();
      // setDemoClasses(data);
      
      // For now, set empty array since dummy data is removed
      setDemoClasses([]);
      setError(null);
    } catch (err) {
      setError('Failed to load demo classes');
      console.error('Error fetching demo classes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load demo classes on component mount
  React.useEffect(() => {
    fetchDemoClasses();
  }, [fetchDemoClasses]);

  // Filter logic
  const filteredDemoClasses = React.useMemo(() => {
    let filtered = demoClasses;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(demo => demo.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(demo =>
        demo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        demo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        demo.instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        demo.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return filtered;
  }, [demoClasses, selectedCategory, searchQuery]);

  const categories = ['all', 'Data Science', 'Web Development', 'Marketing', 'AI & Machine Learning'];

  // Demo videos data for each option - Empty for now, to be populated from API
  const demoVideos = {
    'scheduled': [],
    'attend': [],
    'certificate': [],
    'feedback': []
  };

  const handleDemoOptionClick = (option: string) => {
    setSelectedDemoOption(selectedDemoOption === option ? null : option);
  };

  const getStatusBadge = (status: IDemoClass['status']) => {
    const statusConfig = {
      upcoming: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Upcoming' },
      live: { bg: 'bg-red-100', text: 'text-red-800', label: 'Live Now' },
      completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
      recorded: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Recorded' }
    };
    
    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {status === 'live' && <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse" />}
        {config.label}
      </span>
    );
  };



  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-red-600 mb-2">Error Loading Demo Classes</h2>
        <p className="text-gray-600 text-center mb-4">{error}</p>
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={fetchDemoClasses}
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="container mx-auto p-4 md:p-6 max-w-7xl">
        {/* Header Section with Search */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <MonitorPlay className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">My Demo Classes</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base mb-6">
            Explore free demo classes, join live sessions, and access recorded content to preview our courses.
          </p>
          
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search demo classes, instructors, or topics..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white bg-white dark:bg-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                className="pl-10 pr-8 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none bg-white min-w-[200px]"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Demo Options Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Demo Options</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {/* Demo Scheduled Details */}
            <div 
              onClick={() => handleDemoOptionClick('scheduled')}
              className={`border rounded-full px-6 py-3 hover:shadow-md transition-all duration-200 cursor-pointer group ${
                selectedDemoOption === 'scheduled' 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors text-center whitespace-nowrap">
                Demo Scheduled Details
              </h3>
            </div>

            {/* Demo Attend Details */}
            <div 
              onClick={() => handleDemoOptionClick('attend')}
              className={`border rounded-full px-6 py-3 hover:shadow-md transition-all duration-200 cursor-pointer group ${
                selectedDemoOption === 'attend' 
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-green-600 transition-colors text-center whitespace-nowrap">
                Demo Attend Details
              </h3>
            </div>

            {/* Demo Attend Certificate */}
            <div 
              onClick={() => handleDemoOptionClick('certificate')}
              className={`border rounded-full px-6 py-3 hover:shadow-md transition-all duration-200 cursor-pointer group ${
                selectedDemoOption === 'certificate' 
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors text-center whitespace-nowrap">
                Demo Attend Certificate
              </h3>
            </div>

            {/* Demo Feedback/Summary */}
            <div 
              onClick={() => handleDemoOptionClick('feedback')}
              className={`border rounded-full px-6 py-3 hover:shadow-md transition-all duration-200 cursor-pointer group ${
                selectedDemoOption === 'feedback' 
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors text-center whitespace-nowrap">
                Demo Feedback/Summary
              </h3>
            </div>
          </div>
                </div>

        {/* Selected Demo Option Videos */}
        {selectedDemoOption && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedDemoOption === 'scheduled' && 'Scheduled Demo Sessions'}
                {selectedDemoOption === 'attend' && 'Attendance Records'}
                {selectedDemoOption === 'certificate' && 'Available Certificates'}
                {selectedDemoOption === 'feedback' && 'Feedback & Summaries'}
              </h3>
              <button 
                onClick={() => setSelectedDemoOption(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {demoVideos[selectedDemoOption as keyof typeof demoVideos]?.length === 0 ? (
              selectedDemoOption === 'feedback' ? (
                // Feedback Form
                <div className="max-w-2xl mx-auto">
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                        <Star className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Demo Session Feedback</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Help us improve by sharing your experience</p>
                      </div>
                    </div>
                  </div>

                  <form className="space-y-6">
                    {/* Demo Session Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Which demo session would you like to provide feedback for?
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                        <option value="">Select a demo session</option>
                        <option value="python">Python Programming Fundamentals</option>
                        <option value="webdev">Web Development Bootcamp</option>
                        <option value="datascience">Data Science Essentials</option>
                        <option value="ml">Machine Learning Basics</option>
                      </select>
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Overall Rating
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors flex items-center justify-center"
                          >
                            <Star className="w-5 h-5 text-gray-400 hover:text-orange-500" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Content Quality */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        How would you rate the content quality?
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {['Excellent', 'Good', 'Average'].map((quality) => (
                          <label key={quality} className="flex items-center">
                            <input
                              type="radio"
                              name="content_quality"
                              value={quality.toLowerCase()}
                              className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{quality}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Instructor Performance */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        How was the instructor's performance?
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {['Excellent', 'Good', 'Average'].map((performance) => (
                          <label key={performance} className="flex items-center">
                            <input
                              type="radio"
                              name="instructor_performance"
                              value={performance.toLowerCase()}
                              className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{performance}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Comments */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Additional Comments
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Share your thoughts, suggestions, or any specific feedback about the demo session..."
                      ></textarea>
                    </div>

                    {/* Would Recommend */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Would you recommend this demo to others?
                      </label>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="recommend"
                            value="yes"
                            className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Yes</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="recommend"
                            value="no"
                            className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">No</span>
                        </label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center gap-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Star className="w-4 h-4" />
                        Submit Feedback
                      </button>
                      <button
                        type="button"
                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                // Empty state for other options
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <MonitorPlay className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No Videos Available
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    {selectedDemoOption === 'scheduled' && 'No demo sessions are currently scheduled. Check back soon for upcoming sessions.'}
                    {selectedDemoOption === 'attend' && 'No attendance records found. Join demo sessions to track your participation.'}
                    {selectedDemoOption === 'certificate' && 'No certificates available yet. Complete demo sessions to earn certificates.'}
                  </p>
                </div>
              )
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {demoVideos[selectedDemoOption as keyof typeof demoVideos]?.map((video: any) => (
                  <div key={video.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200">
                    {/* Video Thumbnail */}
                    <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="w-12 h-12 text-white opacity-80" />
                      </div>
                      
                      {/* Status Badge */}
                      <div className="absolute top-3 left-3">
                        {selectedDemoOption === 'scheduled' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Upcoming
                          </span>
                        )}
                        {selectedDemoOption === 'attend' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Attended
                          </span>
                        )}
                        {selectedDemoOption === 'certificate' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Available
                          </span>
                        )}
                        {selectedDemoOption === 'feedback' && (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            video.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {video.status === 'pending' ? 'Pending' : 'Completed'}
                          </span>
                        )}
                      </div>

                      {/* Duration */}
                      {video.duration && (
                        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs">
                          <Clock className="w-3 h-3" />
                          {video.duration}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                        {video.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {video.description}
                      </p>

                      {/* Instructor */}
                      <div className="flex items-center gap-2 mb-3">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{video.instructor}</span>
                      </div>

                      {/* Additional Info based on type */}
                      {selectedDemoOption === 'scheduled' && (
                        <div className="flex items-center gap-2 mb-4 text-xs text-blue-600">
                          <Calendar className="w-4 h-4" />
                          <span>{video.scheduledTime}</span>
                        </div>
                      )}

                      {selectedDemoOption === 'attend' && (
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>Attended: {video.attendedDate}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span>Participation: {video.participation}</span>
                          </div>
                        </div>
                      )}

                      {selectedDemoOption === 'certificate' && (
                        <div className="flex items-center gap-2 mb-4 text-xs text-purple-600">
                          <Calendar className="w-4 h-4" />
                          <span>Completed: {video.completionDate}</span>
                        </div>
                      )}

                      {selectedDemoOption === 'feedback' && (
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>Session: {video.sessionDate}</span>
                          </div>
                          {video.rating && (
                            <div className="flex items-center gap-2 text-xs text-yellow-600">
                              <Star className="w-4 h-4 fill-current" />
                              <span>Rating: {video.rating}/5</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action Button */}
                      <button className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                        selectedDemoOption === 'scheduled' 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : selectedDemoOption === 'attend'
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : selectedDemoOption === 'certificate'
                          ? 'bg-purple-600 hover:bg-purple-700 text-white'
                          : 'bg-orange-600 hover:bg-orange-700 text-white'
                      }`}>
                        {selectedDemoOption === 'scheduled' && (
                          <>
                            <Calendar className="w-4 h-4" />
                            Join Session
                          </>
                        )}
                        {selectedDemoOption === 'attend' && (
                          <>
                            <Eye className="w-4 h-4" />
                            View Details
                          </>
                        )}
                        {selectedDemoOption === 'certificate' && (
                          <>
                            <ArrowRight className="w-4 h-4" />
                            Download Certificate
                          </>
                        )}
                        {selectedDemoOption === 'feedback' && (
                          <>
                            <Star className="w-4 h-4" />
                            {video.status === 'pending' ? 'Provide Feedback' : 'View Summary'}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Demo Classes Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredDemoClasses.map((demoClass) => (
              <DemoClassCard key={demoClass._id} demoClass={demoClass} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Demo Class Card Component
interface IDemoClassCardProps {
  demoClass: IDemoClass;
}

const DemoClassCard: React.FC<IDemoClassCardProps> = ({ demoClass }) => {
  const [isBookmarked, setIsBookmarked] = useState(demoClass.isBookmarked);

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // In production, this would call an API to update the bookmark status
  };

  const handleJoinClass = () => {
    if (demoClass.status === 'live' || demoClass.status === 'upcoming') {
      window.open(demoClass.joinUrl, '_blank');
    } else if (demoClass.recordingUrl) {
      window.open(demoClass.recordingUrl, '_blank');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group">
      {/* Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <MonitorPlay className="w-16 h-16 text-white opacity-80" />
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          {demoClass.status === 'live' ? (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse" />
              Live Now
            </span>
          ) : (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              demoClass.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
              demoClass.status === 'completed' ? 'bg-green-100 text-green-800' :
              'bg-purple-100 text-purple-800'
            }`}>
              {demoClass.status === 'upcoming' ? 'Upcoming' :
               demoClass.status === 'completed' ? 'Completed' : 'Recorded'}
            </span>
          )}
        </div>

        {/* Bookmark Button */}
        <button
          onClick={toggleBookmark}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
        >
          <Bookmark 
            className={`w-4 h-4 ${isBookmarked ? 'fill-white text-white' : 'text-white'}`} 
          />
        </button>

        {/* Duration */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs">
          <Clock className="w-3 h-3" />
          {demoClass.duration}m
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
        {/* Category & Level */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {demoClass.category}
          </span>
          <span className={`text-xs font-medium px-2 py-1 rounded ${
            demoClass.level === 'beginner' ? 'bg-green-50 text-green-600' :
            demoClass.level === 'intermediate' ? 'bg-yellow-50 text-yellow-600' :
            'bg-red-50 text-red-600'
          }`}>
            {demoClass.level}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {demoClass.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {demoClass.description}
        </p>

        {/* Instructor */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {demoClass.instructor.name}
            </p>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-500">{demoClass.instructor.rating}</span>
            </div>
          </div>
        </div>

        {/* Date/Time */}
        <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(demoClass.scheduledDate)}</span>
        </div>

        {/* Participants */}
        <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
          <Users className="w-4 h-4" />
          <span>{demoClass.participants}/{demoClass.maxParticipants} participants</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {demoClass.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={handleJoinClass}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-colors ${
            demoClass.status === 'live' 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : demoClass.status === 'upcoming'
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {demoClass.status === 'live' ? (
            <>
              <Play className="w-4 h-4" />
              Join Live Class
            </>
          ) : demoClass.status === 'upcoming' ? (
            <>
              <Calendar className="w-4 h-4" />
              Register for Class
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Watch Recording
            </>
          )}
        </button>
      </div>
    </div>
  );
};

/**
 * DemoClassesDashboard - Main wrapper component that includes the dashboard layout
 */
const DemoClassesDashboard: React.FC = () => {
  const [studentId, setStudentId] = useState<string | null>(null);

  React.useEffect(() => {
    // In a real implementation, you would get the student ID from authentication
    // For demo purposes, we're using a mock ID
    const mockStudentId = '123456789';
    setStudentId(mockStudentId);
    
    // Alternative: Get from local storage or auth service
    // const user = JSON.parse(localStorage.getItem('user') || '{}');
    // setStudentId(user?.id || null);
  }, []);

  return (
    <DashboardLayout 
      userRole="student"
      fullName="Student User" // In real app, get from user data
      userEmail="student@example.com" // In real app, get from user data
      userImage="" // In real app, get from user data
      userNotifications={0}
      userSettings={{
        theme: "light",
        language: "en",
        notifications: true
      }}
    >
      {studentId && <DemoClassesContent studentId={studentId} />}
    </DashboardLayout>
  );
};

export default DemoClassesDashboard; 