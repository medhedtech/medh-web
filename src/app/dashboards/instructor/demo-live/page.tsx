"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInstructorApi } from '@/apis/instructor.api';
import { showToast } from '@/utils/toast';
import Preloader from '@/components/shared/others/Preloader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  LucideVideo,
  LucideFileText,
  LucideRefreshCw,
  LucideFilter,
  LucideSearch,
  Play,
  MonitorPlay,
  Loader2,
} from 'lucide-react';

interface LiveDemoSession {
  id: string;
  title: string;
  courseName: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  meetingLink?: string;
}

const StartJoinLiveDemoPage: React.FC = () => {
  const api = useInstructorApi();
  const [sessions, setSessions] = useState<LiveDemoSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        // Fetch upcoming classes; filter for demos if available
        const response: any = await api.getUpcomingClasses?.();
        const items = Array.isArray(response) ? response : [];
        setSessions(items as any);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || 'Failed to load live demo sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleStartJoin = async (session: LiveDemoSession) => {
    try {
      setActionLoading(session.id);
      // For now, simply open the meeting link if present
      if (session.meetingLink) {
        window.open(session.meetingLink, '_blank');
      } else {
        showToast.info('Meeting link not available yet');
      }
    } catch (err: any) {
      console.error(err);
      showToast.error(err?.message || 'Unable to join session');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredSessions = sessions.filter((s) =>
    `${s.title} ${s.courseName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Preloader />;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 md:p-8"
    >
      <div className="max-w-7xl mx-auto">
        <Card className="p-4 sm:p-6 md:p-8 space-y-6">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col items-center gap-2 text-center mb-4">
              <h1 className="inline-flex items-center justify-center gap-2 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white whitespace-nowrap sm:whitespace-normal">
                <LucideVideo className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                Start/Join Live Demo
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Manage your upcoming live demo sessions
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto mb-4">
              <button
                className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                onClick={() => window.location.reload()}
              >
                <LucideRefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LucideFileText className="w-5 h-5" />
                    Live Demo Sessions
                  </CardTitle>
                  <CardDescription>
                    View and join your scheduled demo sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* List */}
                  <div className="space-y-4">
                    {filteredSessions && filteredSessions.length > 0 ? (
                      filteredSessions.map((session) => (
                        <div
                          key={session.id}
                          className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                        >
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                              {session.courseName}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              {session.title}
                            </p>
                            <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
                              {session.scheduledDate} @ {session.scheduledTime}
                            </p>
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto">
                            <button
                              className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center justify-center gap-1 disabled:opacity-50"
                              disabled={actionLoading === session.id}
                              onClick={() => handleStartJoin(session)}
                            >
                              {actionLoading === session.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <Play className="w-4 h-4" />
                                  {session.status === 'ongoing' ? 'Join' : 'Start'}
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <LucideFileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                          No live demo sessions found
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LucideFilter className="w-5 h-5" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="relative">
                      <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search title or course..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MonitorPlay className="w-5 h-5" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Total Sessions</span>
                      <span className="font-semibold">{filteredSessions.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default StartJoinLiveDemoPage;