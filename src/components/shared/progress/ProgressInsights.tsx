"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Trophy, 
  Lightbulb,
  AlertCircle,
  CheckCircle,
  Clock,
  BookOpen,
  Zap,
  Calendar,
  Award,
  Users,
  Star,
  Activity,
  BarChart3
} from "lucide-react";
import useGetQuery from "@/hooks/getQuery.hook";
import { 
  progressAPI, 
  IProgressEntry, 
  IProgressOverview, 
  IProgressAnalytics, 
  progressUtils 
} from "@/apis/progress.api";

interface ProgressInsightsProps {
  userId: string;
  courseId?: string;
  className?: string;
}

interface InsightCardProps {
  type: 'achievement' | 'recommendation' | 'warning' | 'trend';
  title: string;
  description: string;
  icon: React.ElementType;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface LearningStreakProps {
  currentStreak: number;
  longestStreak: number;
  streakGoal: number;
}

interface StudyPatternProps {
  pattern: {
    preferredTimeSlots: string[];
    avgSessionDuration: number;
    mostActiveDay: string;
    consistency: number;
  };
}

// Insight Card Component
const InsightCard: React.FC<InsightCardProps> = ({ type, title, description, icon: Icon, action }) => {
  const getCardStyles = () => {
    switch (type) {
      case 'achievement':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'recommendation':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'trend':
        return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'achievement': return 'text-green-600';
      case 'recommendation': return 'text-blue-600';
      case 'warning': return 'text-yellow-600';
      case 'trend': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg border ${getCardStyles()}`}
    >
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-lg bg-white dark:bg-gray-800 ${getIconColor()}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            {title}
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
            {description}
          </p>
          {action && (
            <button
              onClick={action.onClick}
              className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline"
            >
              {action.label}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Learning Streak Component
const LearningStreak: React.FC<LearningStreakProps> = ({ currentStreak, longestStreak, streakGoal }) => {
  const progress = Math.min((currentStreak / streakGoal) * 100, 100);
  
  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-orange-600" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Learning Streak
          </h3>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-orange-600">
            {currentStreak}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">days</p>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>Progress to {streakGoal} day goal</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div 
            className="bg-orange-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
        <span>Current: {currentStreak} days</span>
        <span>Best: {longestStreak} days</span>
      </div>
    </div>
  );
};

// Study Pattern Component
const StudyPattern: React.FC<StudyPatternProps> = ({ pattern }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-2 mb-4">
        <Clock className="w-5 h-5 text-blue-600" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Study Patterns
        </h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Best Time</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {pattern.preferredTimeSlots[0] || 'Not enough data'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Avg. Session</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {progressUtils.formatTimeSpent(pattern.avgSessionDuration)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Most Active</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {pattern.mostActiveDay}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Consistency</p>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div 
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${pattern.consistency}%` }}
              />
            </div>
            <span className="text-xs font-medium text-gray-900 dark:text-white">
              {pattern.consistency}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Progress Insights Component
const ProgressInsights: React.FC<ProgressInsightsProps> = ({ userId, courseId, className = "" }) => {
  const [insights, setInsights] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [progressOverview, setProgressOverview] = useState<IProgressOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'insights' | 'patterns' | 'achievements'>('insights');
  
  const { getQuery } = useGetQuery();

  useEffect(() => {
    if (userId) {
      fetchInsights();
    }
  }, [userId, courseId]);

  const fetchInsights = async () => {
    setIsLoading(true);
    
    try {
      // Fetch insights
      await getQuery({
        url: progressAPI.analytics.getInsights(userId),
        onSuccess: (response) => {
          if (response.data) {
            generateInsights(response.data);
          }
        },
        onFail: (error) => {
          console.error('Failed to fetch insights:', error);
        }
      });

      // Fetch recommendations
      await getQuery({
        url: progressAPI.analytics.getRecommendations(userId),
        onSuccess: (response) => {
          if (response.data) {
            setRecommendations(response.data);
          }
        },
        onFail: (error) => {
          console.error('Failed to fetch recommendations:', error);
        }
      });

      // Fetch overview for patterns
      await getQuery({
        url: progressAPI.analytics.getByUser(userId),
        onSuccess: (response) => {
          if (response.data?.analytics) {
            setProgressOverview(response.data.analytics.overview);
          }
        },
        onFail: (error) => {
          console.error('Failed to fetch analytics:', error);
        }
      });

    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateInsights = (data: any) => {
    const newInsights: any[] = [];

    // Achievement insights
    if (data.streakDays > 7) {
      newInsights.push({
        type: 'achievement',
        title: 'Great Learning Streak!',
        description: `You've maintained a ${data.streakDays}-day learning streak. Keep it up!`,
        icon: Trophy
      });
    }

    if (data.completionRate > 80) {
      newInsights.push({
        type: 'achievement',
        title: 'High Completion Rate',
        description: `You have an excellent ${Math.round(data.completionRate)}% completion rate.`,
        icon: Award
      });
    }

    // Recommendation insights
    if (data.averageScore < 70) {
      newInsights.push({
        type: 'warning',
        title: 'Score Improvement Needed',
        description: 'Your average score is below 70%. Consider reviewing the materials more thoroughly.',
        icon: AlertCircle,
        action: {
          label: 'View Study Tips',
          onClick: () => console.log('Navigate to study tips')
        }
      });
    }

    if (data.activeDays < 5) {
      newInsights.push({
        type: 'recommendation',
        title: 'Increase Study Frequency',
        description: 'Try to study more regularly. Aim for at least 5 days per week for better retention.',
        icon: Calendar,
        action: {
          label: 'Set Study Schedule',
          onClick: () => console.log('Set study schedule')
        }
      });
    }

    // Trend insights
    if (data.totalTimeSpent > 3600) { // More than 1 hour
      newInsights.push({
        type: 'trend',
        title: 'Dedicated Learner',
        description: `You've spent ${progressUtils.formatTimeSpent(data.totalTimeSpent)} learning. Your dedication is impressive!`,
        icon: Brain
      });
    }

    setInsights(newInsights);
  };

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Section Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {(['insights', 'patterns', 'achievements'] as const).map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${
              activeSection === section
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {section}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <AnimatePresence mode="wait">
        {activeSection === 'insights' && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {insights.length > 0 ? (
              insights.map((insight, index) => (
                <InsightCard
                  key={index}
                  type={insight.type}
                  title={insight.title}
                  description={insight.description}
                  icon={insight.icon}
                  action={insight.action}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  Keep learning to unlock personalized insights!
                </p>
              </div>
            )}
          </motion.div>
        )}

        {activeSection === 'patterns' && (
          <motion.div
            key="patterns"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {progressOverview && (
              <>
                <LearningStreak
                  currentStreak={progressOverview.streakDays}
                  longestStreak={progressOverview.streakDays + 2} // Mock longest streak
                  streakGoal={30}
                />
                
                <StudyPattern
                  pattern={{
                    preferredTimeSlots: ['9:00 AM - 11:00 AM'],
                    avgSessionDuration: 1800, // 30 minutes
                    mostActiveDay: 'Tuesday',
                    consistency: 75
                  }}
                />
              </>
            )}
          </motion.div>
        )}

        {activeSection === 'achievements' && (
          <motion.div
            key="achievements"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Course Completion
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Courses completed successfully
                    </p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {progressOverview ? Math.floor(progressOverview.completionRate / 20) : 0}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Star className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      High Scores
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Scores above 90%
                    </p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {progressOverview ? Math.floor(progressOverview.averageScore / 15) : 0}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Zap className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Study Streaks
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Consecutive study days
                    </p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {progressOverview ? Math.floor(progressOverview.streakDays / 7) : 0}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Activity className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Active Learning
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Hours of active learning
                    </p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {progressOverview ? Math.floor(progressOverview.totalTimeSpent / 3600) : 0}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProgressInsights; 