"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Trophy, 
  Timer, 
  Activity, 
  Calendar,
  BookOpen,
  CheckCircle,
  Clock,
  Eye,
  Zap,
  Brain,
  Star
} from "lucide-react";
import useGetQuery from "@/hooks/getQuery.hook";
import { 
  progressAPI, 
  IProgressEntry, 
  IProgressOverview, 
  IProgressAnalytics, 
  progressUtils,
  TProgressStatus 
} from "@/apis/progress.api";

interface ProgressTrackerProps {
  userId: string;
  courseId?: string;
  compact?: boolean;
  showAnalytics?: boolean;
  className?: string;
}

interface ProgressCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  trend?: 'increasing' | 'decreasing' | 'stable';
  subtitle?: string;
}

interface ProgressTimelineProps {
  entries: IProgressEntry[];
  isLoading: boolean;
}

// Progress Card Component
const ProgressCard: React.FC<ProgressCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  bgColor, 
  trend,
  subtitle 
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'decreasing': return <TrendingUp className="w-3 h-3 text-red-500 transform rotate-180" />;
      default: return <Activity className="w-3 h-3 text-gray-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${bgColor}`}>
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
        {trend && getTrendIcon()}
      </div>
      <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
        {title}
      </h3>
      <p className="text-lg font-bold text-gray-900 dark:text-white">
        {value}
      </p>
      {subtitle && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

// Progress Timeline Component
const ProgressTimeline: React.FC<ProgressTimelineProps> = ({ entries, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-3 animate-pulse">
            <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-400">
        <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.slice(0, 5).map((entry, index) => (
        <motion.div
          key={entry._id || index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div 
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: progressUtils.getStatusColor(entry.status) }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {entry.contentTitle || entry.contentType}
            </p>
            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <span>{entry.progressPercentage}% complete</span>
              <span>•</span>
              <span>{progressUtils.formatTimeSpent(entry.timeSpent)}</span>
              {entry.score && (
                <>
                  <span>•</span>
                  <span>{entry.score}% score</span>
                </>
              )}
            </div>
          </div>
          <div className="text-xs text-gray-400 flex-shrink-0">
            {entry.lastAccessedAt && new Date(entry.lastAccessedAt).toLocaleDateString()}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Main Progress Tracker Component
const ProgressTracker: React.FC<ProgressTrackerProps> = ({ 
  userId, 
  courseId, 
  compact = false, 
  showAnalytics = true,
  className = "" 
}) => {
  const [progressOverview, setProgressOverview] = useState<IProgressOverview | null>(null);
  const [progressAnalytics, setProgressAnalytics] = useState<IProgressAnalytics | null>(null);
  const [recentEntries, setRecentEntries] = useState<IProgressEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'analytics'>('overview');
  
  const { getQuery } = useGetQuery();

  useEffect(() => {
    if (userId) {
      fetchProgressData();
    }
  }, [userId, courseId]);

  const fetchProgressData = async () => {
    setIsLoading(true);
    
    try {
      // Fetch progress analytics and overview
      if (showAnalytics) {
        await getQuery({
          url: progressAPI.analytics.getByUser(userId, courseId ? { courseId } : {}),
          onSuccess: (response) => {
            if (response.data?.analytics) {
              setProgressAnalytics(response.data.analytics);
              setProgressOverview(response.data.analytics.overview);
            }
          },
          onFail: (error) => {
            console.error('Failed to fetch progress analytics:', error);
          }
        });
      }

      // Fetch recent progress entries
      await getQuery({
        url: progressAPI.progress.getByUser(userId, { 
          ...(courseId && { courseId }),
          limit: 10,
          sortBy: 'updatedAt',
          sortOrder: 'desc'
        }),
        onSuccess: (response) => {
          setRecentEntries(response.data?.progress || []);
        },
        onFail: (error) => {
          console.error('Failed to fetch recent progress:', error);
        }
      });
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Compact version for embedded use
  if (compact) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Progress Overview
          </h3>
          <BarChart3 className="w-4 h-4 text-gray-500" />
        </div>
        
        {progressOverview ? (
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                {Math.round(progressOverview.totalProgress)}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Overall</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-green-600">
                {progressOverview.streakDays}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Day Streak</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-xs text-gray-500 dark:text-gray-400">No data available</p>
          </div>
        )}
      </div>
    );
  }

  // Full version
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {(['overview', 'timeline', 'analytics'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${
              activeTab === tab
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {progressOverview ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <ProgressCard
                    title="Overall Progress"
                    value={`${Math.round(progressOverview.totalProgress)}%`}
                    icon={Target}
                    color="text-blue-600"
                    bgColor="bg-blue-100 dark:bg-blue-900/30"
                    trend={progressAnalytics?.trends?.progressTrend}
                  />
                  <ProgressCard
                    title="Completion Rate"
                    value={`${Math.round(progressOverview.completionRate)}%`}
                    icon={CheckCircle}
                    color="text-green-600"
                    bgColor="bg-green-100 dark:bg-green-900/30"
                    trend="increasing"
                  />
                  <ProgressCard
                    title="Study Streak"
                    value={progressOverview.streakDays}
                    icon={Trophy}
                    color="text-yellow-600"
                    bgColor="bg-yellow-100 dark:bg-yellow-900/30"
                    subtitle="days"
                  />
                  <ProgressCard
                    title="Time Spent"
                    value={progressUtils.formatTimeSpent(progressOverview.totalTimeSpent)}
                    icon={Timer}
                    color="text-purple-600"
                    bgColor="bg-purple-100 dark:bg-purple-900/30"
                    trend={progressAnalytics?.trends?.timeSpentTrend}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ProgressCard
                    title="Average Score"
                    value={`${Math.round(progressOverview.averageScore)}%`}
                    icon={Star}
                    color="text-indigo-600"
                    bgColor="bg-indigo-100 dark:bg-indigo-900/30"
                    trend={progressAnalytics?.trends?.scoreTrend}
                  />
                  <ProgressCard
                    title="Active Days"
                    value={progressOverview.activeDays}
                    icon={Calendar}
                    color="text-pink-600"
                    bgColor="bg-pink-100 dark:bg-pink-900/30"
                    subtitle="this month"
                  />
                  <ProgressCard
                    title="Sessions"
                    value={progressOverview.totalSessions}
                    icon={Activity}
                    color="text-cyan-600"
                    bgColor="bg-cyan-100 dark:bg-cyan-900/30"
                    subtitle="total"
                  />
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Progress Data
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Start learning to see your progress overview here.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'timeline' && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h3>
              <ProgressTimeline entries={recentEntries} isLoading={isLoading} />
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {progressAnalytics ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Content Type Breakdown */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Progress by Content Type
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(progressAnalytics.breakdown.byContentType).map(([type, data]) => (
                      <div key={type} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                            {type}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {data.count} items
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <motion.div 
                            className="bg-primary-600 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${data.completionRate}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>{Math.round(data.completionRate)}% complete</span>
                          <span>Avg. score: {Math.round(data.averageScore)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weekly Progress Trend */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Weekly Progress Trend
                  </h3>
                  <div className="space-y-3">
                    {progressAnalytics.breakdown.byWeek.slice(0, 6).map((week, index) => (
                      <div key={week.week} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Week of {week.week}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {progressUtils.formatTimeSpent(week.timeSpent)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                            {week.progress}%
                          </p>
                          <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-1 mt-1">
                            <div 
                              className="bg-primary-600 h-1 rounded-full transition-all duration-300"
                              style={{ width: `${week.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Analytics Data Available
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Complete more activities to see detailed analytics.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProgressTracker; 