"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  FaArrowLeft, 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaDownload, 
  FaUpload, 
  FaSync,
  FaUsers,
  FaUserCheck,
  FaShieldAlt,
  FaVideo,
  FaCalendarAlt,
  FaEllipsisV,
  FaEdit,
  FaTrash,
  FaEye,
  FaCopy
} from "react-icons/fa";
import { liveClassesAPI, ILiveSession } from "@/apis/liveClassesAPI";

export default function LiveSessionsPage() {
  const router = useRouter();
  
  // State
  const [sessions, setSessions] = useState<ILiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSessions, setTotalSessions] = useState(0);
  const [filteredSessions, setFilteredSessions] = useState(0);

  // Load sessions
  useEffect(() => {
    loadSessions();
  }, [currentPage]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const response = await liveClassesAPI.getSessions();
      
      // Ensure we have valid data structure
      if (!response || !response.data) {
        console.warn('Invalid response structure from API');
        setSessions([]);
        setTotalSessions(0);
        setFilteredSessions(0);
        return;
      }
      
      const sessionsData = response.data.items || [];
      
      // Validate each session has required properties
      const validSessions = sessionsData.filter(session => 
        session && 
        session._id && 
        session.instructorId && 
        session.students
      );
      
      setSessions(validSessions);
      setTotalSessions(response.data.total || 0);
      setFilteredSessions(validSessions.length);
    } catch (error) {
      console.error('Error loading sessions:', error);
      setSessions([]);
      setTotalSessions(0);
      setFilteredSessions(0);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search sessions
  const filteredSessionsData = (sessions || []).filter(session => {
    if (!session || !session.instructorId) return false;
    
    const matchesSearch = (session.sessionTitle?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                         (session.sessionNo || '').includes(searchQuery) ||
                         (session.instructorId.full_name?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || session.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'live':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-8">
            <Link
              href="/dashboards/admin/live-classes"
              className="group w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <FaArrowLeft className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-200" />
            </Link>
            
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center">
                  <FaVideo className="text-white text-2xl" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Live Sessions Management
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Manage live session profiles, schedules, and track their progress
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-green-500 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{totalSessions}</p>
                <p className="text-green-100">Total Sessions</p>
              </div>
              <FaUsers className="text-3xl opacity-80" />
            </div>
          </div>
          
          <div className="bg-blue-500 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{(sessions || []).filter(s => s && s.status === 'scheduled').length}</p>
                <p className="text-blue-100">Active Sessions</p>
              </div>
              <FaUserCheck className="text-3xl opacity-80" />
            </div>
          </div>
          
          <div className="bg-purple-500 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{filteredSessionsData.length}</p>
                <p className="text-purple-100">Filtered Results</p>
              </div>
              <FaFilter className="text-3xl opacity-80" />
            </div>
          </div>
          
          <div className="bg-blue-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{(sessions || []).filter(s => s && s.status === 'completed').length}</p>
                <p className="text-blue-100">Completed Sessions</p>
              </div>
              <FaShieldAlt className="text-3xl opacity-80" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <FaVideo className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Live Sessions Management
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage live session profiles, schedules, and track their progress
                </p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sessions..."
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
              />
            </div>
            
            <div className="flex gap-3">
              <button className="px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors duration-200 flex items-center gap-2">
                <FaFilter className="w-4 h-4" />
                Filters
              </button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                aria-label="Sort sessions by"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
                <option value="date">Date</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={loadSessions}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <FaSync className="w-4 h-4" />
              Refresh
            </button>
            
            <Link
              href="/dashboards/admin/live-classes/ai-data-science/create-session"
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <FaPlus className="w-4 h-4" />
              Add Session
            </Link>
            
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2">
              <FaUpload className="w-4 h-4" />
              Import CSV
            </button>
            
            <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2">
              <FaDownload className="w-4 h-4" />
              Export
            </button>
          </div>

          {/* Sessions Table */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          ) : filteredSessionsData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Session</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Students</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Instructor</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Date</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSessionsData.map((session) => {
                    // Skip rendering if session data is incomplete
                    if (!session || !session.instructorId || !session.students) {
                      return null;
                    }
                    
                    return (
                      <tr key={session._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {session.sessionTitle || 'Untitled Session'}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Session #{session.sessionNo || 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <FaUsers className="text-gray-400 w-4 h-4" />
                            <span className="text-gray-700 dark:text-gray-300">
                              {session.students?.length || 0} student{(session.students?.length || 0) !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {session.instructorId.full_name || 'Unknown Instructor'}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {session.instructorId.email || 'No email'}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-gray-400 w-4 h-4" />
                            <span className="text-gray-700 dark:text-gray-300">
                              {session.date ? formatDate(session.date) : 'No date'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(session.status || 'unknown')}`}>
                            {(session.status || 'unknown').charAt(0).toUpperCase() + (session.status || 'unknown').slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <button 
                              className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors"
                              title="View session details"
                              aria-label="View session details"
                            >
                              <FaEye className="w-4 h-4" />
                            </button>
                            <button 
                              className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 rounded-lg transition-colors"
                              title="Edit session"
                              aria-label="Edit session"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button 
                              className="p-2 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 rounded-lg transition-colors"
                              title="Duplicate session"
                              aria-label="Duplicate session"
                            >
                              <FaCopy className="w-4 h-4" />
                            </button>
                            <button 
                              className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors"
                              title="Delete session"
                              aria-label="Delete session"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FaVideo className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No live sessions found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {searchQuery || filterStatus !== "all" 
                  ? "No sessions match your current filters. Try adjusting your search or filters."
                  : "Get started by creating your first live session."
                }
              </p>
              {!searchQuery && filterStatus === "all" && (
                <Link
                  href="/dashboards/admin/live-classes/ai-data-science/create-session"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  <FaPlus className="w-4 h-4" />
                  Create Your First Session
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

