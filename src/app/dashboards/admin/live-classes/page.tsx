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

  // Filter sessions based on search query
  const filteredSessions = Array.isArray(sessions) ? sessions.filter(session => {
    if (searchQuery === '') return true;
    
    const searchLower = searchQuery.toLowerCase();
    const titleMatch = session.sessionTitle && session.sessionTitle.toLowerCase().includes(searchLower);
    const instructorMatch = typeof session.instructorId === 'object' && session.instructorId?.full_name 
      ? session.instructorId.full_name.toLowerCase().includes(searchLower)
      : false;
    const studentMatch = session.students && session.students.some((student: any) => 
      (student.name || student.full_name || '').toLowerCase().includes(searchLower)
    );
    
    return titleMatch || instructorMatch || studentMatch;
  }) : [];
  
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
              {/* Create Live Session Button */}
              <button
                onClick={() => router.push('/dashboards/admin/live-classes/ai-data-science/create-session')}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-md"
              >
                <FaPlus className="w-4 h-4" />
                Create Live Session
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search sessions, instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
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
                   {searchQuery 
                     ? `No sessions found matching "${searchQuery}". Try adjusting your search or create a new session.`
                     : 'No live sessions available. Create your first session to get started.'
                   }
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
            // Simple Sessions List
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Live Sessions</h2>
                
                {Array.isArray(filteredSessions) && filteredSessions.length > 0 ? (
                  <div className="space-y-4">
                    {filteredSessions.map((session, index) => (
                      <div
                        key={session._id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        {/* Session Number */}
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          
                          {/* Session Details */}
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {session.sessionTitle}
                            </h3>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Session #{session.sessionNo} • {formatDate(session.date)} • {getStatusBadge(session.status)}
                            </div>
                            
                            {/* Student Names */}
                            {session.students && session.students.length > 0 && (
                              <div className="mt-2">
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Students: </span>
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                  {session.students.map((student: any, idx: number) => 
                                    student.name || student.full_name || `Student ${idx + 1}`
                                  ).join(', ')}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Instructor and Actions */}
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {typeof session.instructorId === 'object' && session.instructorId?.full_name 
                                ? session.instructorId.full_name 
                                : 'Instructor'}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {session.students?.length || 0} student{(session.students?.length || 0) !== 1 ? 's' : ''}
                            </div>
                          </div>
                          
                          {/* Edit Button */}
                          <button
                            onClick={() => handleEditSession(session._id)}
                            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 bg-white dark:bg-gray-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:scale-110 hover:shadow-md"
                            title="Edit session"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FaVideo className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      {searchQuery ? `No sessions found matching "${searchQuery}"` : 'No live sessions found'}
                    </p>
                    {searchQuery && (
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                        Try adjusting your search terms or create a new session
                      </p>
                    )}
                  </div>
                )}
              </div>
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
