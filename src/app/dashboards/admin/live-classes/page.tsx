"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  FaPlus, 
  FaRobot, 
  FaCode, 
  FaChartLine, 
  FaBookOpen, 
  FaVideo, 
  FaMicrophone, 
  FaCertificate, 
  FaStar,
  FaUsers,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaSearch,
  FaPlay,
  FaShare,
  FaEllipsisH,
  FaEdit,
  FaFilter,
  FaSync,
  FaLayerGroup
} from "react-icons/fa";
import { liveClassesAPI, ILiveSession } from "@/apis/liveClassesAPI";

interface ICourseCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  totalBatches: number;
  totalStudents: number;
  upcomingSessions: number;
  courseRating: number;
  features: string[];
  color: string;
}

export default function LiveClassesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'categories' | 'sessions'>('sessions');
  const [filter, setFilter] = useState<'all' | 'live' | 'scheduled' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [courseCategories, setCourseCategories] = useState<ICourseCategory[]>([]);
  const [sessions, setSessions] = useState<ILiveSession[]>([]);

  useEffect(() => {
    loadCourseCategories();
    loadSessions();
  }, []);

  const loadCourseCategories = async () => {
    try {
      const response = await liveClassesAPI.getCourseCategories();
      const categories = Array.isArray(response.data) ? response.data : 
                        Array.isArray(response) ? response : [];
      setCourseCategories(categories);
    } catch (error) {
      console.error('Error loading course categories:', error);
      setCourseCategories([]);
    }
  };

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const response = await liveClassesAPI.getSessions();
             // console.log('Sessions API response:', response);
      
             // Handle the correct response structure from backend
       let sessionsData = [];
       // console.log('Response structure check:', {
       //   hasResponse: !!response,
       //   hasData: !!(response && response.data),
       //   hasItems: !!(response && response.data && response.data.items),
       //   responseData: response?.data,
       //   responseDataItems: response?.data?.items,
       //   responseDataKeys: response?.data ? Object.keys(response.data) : [],
       //   fullResponseData: response?.data
       // });
       
       if (response && response.data && response.data.items) {
         // Backend returns: { data: { items: [...], total: number, page: number, limit: number, pages: number } }
         sessionsData = Array.isArray(response.data.items) ? response.data.items : [];
         console.log('Using response.data.items:', sessionsData);
       } else if (response && response.data && response.data.data && response.data.data.items) {
         // Alternative structure: { data: { data: { items: [...], total: number, page: number, limit: number, pages: number } } }
         sessionsData = Array.isArray(response.data.data.items) ? response.data.data.items : [];
         console.log('Using response.data.data.items:', sessionsData);
       } else if (response && response.data && Array.isArray(response.data)) {
         // Fallback: direct array in data
         sessionsData = response.data;
         console.log('Using response.data as array:', sessionsData);
       } else if (Array.isArray(response)) {
         // Fallback: direct array response
         sessionsData = response;
         console.log('Using response as array:', sessionsData);
       } else {
         // Last resort: try to extract from any nested structure
         console.log('Trying to extract from nested structure...');
         const extractSessions = (obj) => {
           if (Array.isArray(obj)) return obj;
           if (obj && obj.items && Array.isArray(obj.items)) return obj.items;
           if (obj && obj.data && Array.isArray(obj.data)) return obj.data;
           if (obj && obj.data && obj.data.items && Array.isArray(obj.data.items)) return obj.data.items;
           return [];
         };
         sessionsData = extractSessions(response?.data || response);
         console.log('Extracted sessions from nested structure:', sessionsData);
       }
       
       console.log('Final sessionsData:', sessionsData);
       console.log('Number of sessions:', sessionsData.length);
      
      setSessions(sessionsData);
    } catch (error) {
      console.error('Error loading sessions:', error);
      setSessions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateLiveSession = (categoryId: string) => {
    router.push(`/dashboards/admin/live-classes/${categoryId}/create-session`);
  };

  const handleViewCourse = (categoryId: string) => {
    router.push(`/dashboards/admin/live-classes/${categoryId}`);
  };

  const handleEditSession = (sessionId: string) => {
    router.push(`/dashboards/admin/live-classes/ai-data-science/create-session?edit=${sessionId}`);
  };

     // Filter sessions based on status and search query
   console.log('Filtering sessions:', {
     sessionsLength: sessions.length,
     sessions: sessions,
     filter: filter,
     searchQuery: searchQuery
   });
   
   const filteredSessions = Array.isArray(sessions) ? sessions.filter(session => {
     console.log('Filtering session:', session);
     const matchesFilter = filter === 'all' || session.status === filter;
     const matchesSearch = searchQuery === '' || 
                          (session.sessionTitle && session.sessionTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (session.instructorId && session.instructorId.toString().toLowerCase().includes(searchQuery.toLowerCase()));
     console.log('Filter result:', { matchesFilter, matchesSearch, sessionStatus: session.status });
     return matchesFilter && matchesSearch;
   }) : [];
   
   console.log('Filtered sessions result:', filteredSessions);
  
     // console.log('Total sessions:', sessions.length);
   // console.log('Filtered sessions:', filteredSessions.length);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      live: { bg: 'bg-red-100 text-red-700 border-red-200', text: 'Live Now' },
      scheduled: { bg: 'bg-blue-100 text-blue-700 border-blue-200', text: 'Scheduled' },
      completed: { bg: 'bg-green-100 text-green-700 border-green-200', text: 'Completed' },
      cancelled: { bg: 'bg-gray-100 text-gray-700 border-gray-200', text: 'Cancelled' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled;

    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.bg}`}>
        <span>{config.text}</span>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'robot':
        return <FaRobot className="w-8 h-8" />;
      case 'code':
        return <FaCode className="w-8 h-8" />;
      case 'chart-line':
        return <FaChartLine className="w-8 h-8" />;
      case 'book-open':
        return <FaBookOpen className="w-8 h-8" />;
      case 'video':
        return <FaVideo className="w-8 h-8" />;
      case 'microphone':
        return <FaMicrophone className="w-8 h-8" />;
      case 'certificate':
        return <FaCertificate className="w-8 h-8" />;
      case 'star':
        return <FaStar className="w-8 h-8" />;
      case 'users':
        return <FaUsers className="w-8 h-8" />;
      case 'calendar-alt':
        return <FaCalendarAlt className="w-8 h-8" />;
      case 'clock':
        return <FaClock className="w-8 h-8" />;
      case 'user':
        return <FaUser className="w-8 h-8" />;
      default:
        return <FaBookOpen className="w-8 h-8" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-2">
                Live Classes Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Manage and create live sessions for all course categories
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Primary Create Session Button */}
              <button
                onClick={() => router.push('/dashboards/admin/live-classes/ai-data-science/create-session')}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-md"
              >
                <FaPlus className="w-4 h-4" />
                Create Session
              </button>
              
              {/* Quick Create Session Button */}
              <button
                onClick={() => router.push('/dashboards/admin/live-classes/ai-data-science/create-session')}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-md"
              >
                <FaPlus className="w-3 h-3" />
                Quick Add
              </button>
              
              <button
                onClick={loadSessions}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <FaSync className="w-4 h-4" />
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search sessions, instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          
                    <div className="flex gap-2">
            {(['all', 'live', 'scheduled', 'completed'] as const).map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === filterOption
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </button>
            ))}
            
            {/* Add Session Button in Filters */}
            <button
              onClick={() => router.push('/dashboards/admin/live-classes/ai-data-science/create-session')}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center gap-2"
            >
              <FaPlus className="w-3 h-3" />
              Add Session
            </button>
          </div>
          </div>
        </div>

             {/* Main Content */}
       <div className="max-w-7xl mx-auto px-6 py-10">
         {viewMode === 'sessions' ? (
           // Sessions View
           isLoading ? (
             // Loading State
             <div className="text-center py-16">
               <div className="max-w-md mx-auto">
                 <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                   <FaVideo className="w-12 h-12 text-gray-400" />
                 </div>
                 <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                   Loading Sessions...
                 </h3>
                 <p className="text-gray-600 dark:text-gray-400">
                   Please wait while we fetch your live sessions.
                 </p>
               </div>
             </div>
           ) : filteredSessions.length === 0 ? (
            // Empty State for Sessions
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaVideo className="w-12 h-12 text-gray-400" />
                </div>
                                 <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                   No Live Sessions Found
                 </h3>
                 <p className="text-gray-600 dark:text-gray-400 mb-4">
                   No sessions match your current filters. Try adjusting your search or create a new session.
                 </p>
                                   {/* Debug info removed */}
                <button
                  onClick={() => router.push('/dashboards/admin/live-classes/ai-data-science/create-session')}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <FaPlus className="w-4 h-4" />
                  Create Live Session
                </button>
              </div>
            </div>
          ) : (
                         // Sessions Grid
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 p-4">
               {Array.isArray(filteredSessions) && filteredSessions.map((session, index) => (
                <div
                  key={session._id}
                  className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-3xl transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-400/80 dark:hover:border-blue-500/80 transform hover:-translate-y-3 hover:scale-105 backdrop-blur-sm cursor-pointer"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                  onClick={() => window.open(`/session/${session._id}`, '_blank')}
                >
                  {/* Thumbnail - Clickable */}
                  <div 
                    className="relative aspect-[21/9] bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 overflow-hidden cursor-pointer"
                    onClick={() => window.open(`/session/${session._id}`, '_blank')}
                  >
                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/90 via-purple-500/90 to-pink-500/90 animate-pulse"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/70 to-purple-600/70 flex items-center justify-center">
                      <div className="relative">
                        <FaVideo className="text-white text-5xl drop-shadow-2xl animate-bounce" />
                        <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-ping"></div>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      {getStatusBadge(session.status)}
                    </div>
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-500 flex items-center justify-center">
                      <div className="w-20 h-20 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-50 group-hover:scale-100 shadow-2xl border-4 border-white/20">
                        <FaPlay className="text-gray-900 ml-1 text-xl" />
                      </div>
                    </div>
                    
                    {/* Duration */}
                    <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md text-white text-sm px-4 py-2 rounded-full font-semibold border border-white/20">
                      {session.duration || 90} min
                    </div>
                    
                    {/* Multiple Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
                    
                    {/* Animated Particles */}
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
                    <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white/40 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                    <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-white/25 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
                  </div>

                  {/* Content */}
                  <div className="p-3 relative">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Title */}
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300 leading-tight relative z-10">
                      {session.sessionTitle}
                    </h3>
                    
                    {/* Session Number */}
                    <div className="flex items-center justify-between mb-2 relative z-10">
                      <span className="text-xs bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold px-2 py-1 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        Session #{session.sessionNo}
                      </span>
                    </div>
                    
                    {/* Session Info - Horizontal Layout */}
                    <div className="grid grid-cols-3 gap-2 mb-3 relative z-10">
                      {/* Date */}
                      <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-700/50 p-1.5 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-600/50 transition-colors duration-200">
                        <FaCalendarAlt className="text-blue-500 text-xs" />
                        <span className="font-medium truncate">{formatDate(session.video?.date || session.date || new Date())}</span>
                      </div>
                      
                      {/* Instructor */}
                      <div className="flex items-center gap-1 text-xs bg-blue-50/50 dark:bg-blue-900/20 p-1.5 rounded-lg hover:bg-blue-100/50 dark:hover:bg-blue-800/30 transition-colors duration-200">
                        <FaUser className="text-blue-500 text-xs" />
                        <span className="font-semibold text-blue-600 dark:text-blue-400 truncate">
                          {typeof session.instructorId === 'object' && session.instructorId?.full_name 
                            ? session.instructorId.full_name 
                            : `Instructor: ${session.instructorId}`}
                        </span>
                      </div>
                      
                      {/* Students */}
                      <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 bg-green-50/50 dark:bg-green-900/20 p-1.5 rounded-lg hover:bg-green-100/50 dark:hover:bg-green-800/30 transition-colors duration-200">
                        <FaUsers className="text-green-500 text-xs" />
                        <span className="font-medium">{session.students?.length || 0} students</span>
                      </div>
                    </div>
                    
                    {/* Student Names - Only show if there are students */}
                    {session.students && session.students.length > 0 && (
                      <div className="text-xs text-gray-500 dark:text-gray-500 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 p-2 rounded-lg border border-gray-200/50 dark:border-gray-600/50 mb-3">
                        <span className="font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Students:</span>
                        <div className="flex flex-wrap gap-1">
                          {session.students.slice(0, 3).map((student: any, idx: number) => (
                            <span key={idx} className="bg-white/70 dark:bg-gray-600/70 px-2 py-0.5 rounded-full text-xs font-medium border border-gray-200/50 dark:border-gray-500/50">
                              {student.name || student.full_name || `Student ${idx + 1}`}
                            </span>
                          ))}
                          {session.students.length > 3 && (
                            <span className="bg-gray-200/70 dark:bg-gray-500/70 px-2 py-0.5 rounded-full text-xs font-medium">
                              +{session.students.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-200/50 dark:border-gray-600/50 relative z-10">
                      <button 
                        className="flex-1 py-2 px-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white text-xs font-bold rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                        onClick={() => window.open(`/session/${session._id}`, '_blank')}
                      >
                        Join Session
                      </button>
                      <button 
                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 bg-gray-50/80 dark:bg-gray-700/80 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:scale-110 hover:shadow-md backdrop-blur-sm"
                        title="Share session"
                      >
                        <FaShare className="text-xs" />
                      </button>
                      <button 
                        className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-all duration-200 bg-gray-50/80 dark:bg-gray-700/80 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 hover:scale-110 hover:shadow-md backdrop-blur-sm"
                        title="Edit session"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditSession(session._id);
                        }}
                      >
                        <FaEdit className="text-xs" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          // Categories View
          !isLoading && (!Array.isArray(courseCategories) || courseCategories.length === 0) ? (
            // Empty State for Categories
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaBookOpen className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No Course Categories Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  No course categories are available at the moment.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {Array.isArray(courseCategories) && courseCategories.map((category) => (
                <div
                  key={category.id}
                  className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                >
                  {/* Category Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${category.color}`}>
                        {renderIcon(category.icon)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                          {category.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <FaStar className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {category.courseRating}
                            </span>
                          </div>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {category.totalStudents} students
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category Description */}
                  <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">
                    {category.description}
                  </p>

                  {/* Category Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {category.totalBatches}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Batches
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {category.totalStudents}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Students
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                        {category.upcomingSessions}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Upcoming
                      </div>
                    </div>
                  </div>

                  {/* Category Features */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      Key Features
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {category.features.slice(0, 3).map((feature, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                      {category.features.length > 3 && (
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs rounded-full">
                          +{category.features.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleCreateLiveSession(category.id)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <FaVideo className="w-4 h-4" />
                      Create Session
                    </button>
                    <button
                      onClick={() => handleViewCourse(category.id)}
                      className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
