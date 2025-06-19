// progress-advanced.api.ts - Advanced Enhanced Progress Tracking System API

import { apiBaseUrl } from './config';
import { IProgressApiResponse, IPaginationInfo, TContentType, TProgressStatus, TTimeframe } from './progress.api';

// ===== ADVANCED ANALYTICS INTERFACES =====

export interface IProgressComparison {
  previousPeriod: {
    progressChange: number;
    scoreChange: number;
    timeSpentChange: number;
    completionRateChange: number;
  };
  cohortAverage: {
    relativeProgress: number;
    relativeScore: number;
    relativeTimeSpent: number;
    percentile: number;
  };
  classmateComparison?: {
    rank: number;
    totalStudents: number;
    aboveAverage: boolean;
  };
}

export interface IAdvancedProgressAnalytics {
  overview: {
    totalProgress: number;
    completionRate: number;
    averageScore: number;
    totalTimeSpent: number;
    streakDays: number;
    activeDays: number;
    totalSessions: number;
    averageSessionTime: number;
    lastActivity?: string;
  };
  trends: {
    progressTrend: 'increasing' | 'decreasing' | 'stable';
    scoreTrend: 'increasing' | 'decreasing' | 'stable';
    timeSpentTrend: 'increasing' | 'decreasing' | 'stable';
    engagementTrend: 'increasing' | 'decreasing' | 'stable';
  };
  breakdown: {
    byContentType: Record<TContentType, {
      count: number;
      completionRate: number;
      averageScore: number;
      totalTimeSpent: number;
    }>;
    byDifficulty: Record<string, {
      count: number;
      completionRate: number;
      averageScore: number;
    }>;
    byWeek: Array<{
      week: string;
      progress: number;
      timeSpent: number;
      itemsCompleted: number;
    }>;
    byMonth: Array<{
      month: string;
      progress: number;
      timeSpent: number;
      itemsCompleted: number;
    }>;
  };
  comparison?: IProgressComparison;
  insights?: string[];
  recommendations?: string[];
  achievements?: Array<{
    id: string;
    title: string;
    description: string;
    earnedAt: string;
    icon?: string;
  }>;
}

export interface IAnalyticsQueryParams {
  timeframe?: TTimeframe;
  includeComparison?: boolean;
  includePreviousPeriod?: boolean;
  includeCohortData?: boolean;
  courseId?: string;
  contentType?: TContentType;
  granularity?: 'day' | 'week' | 'month';
}

// ===== LEADERBOARD INTERFACES =====

export interface ILeaderboardEntry {
  userId: string;
  userName: string;
  userImage?: string;
  rank: number;
  score: number;
  totalProgress: number;
  completionRate: number;
  totalTimeSpent: number;
  badge?: string;
  isCurrentUser?: boolean;
}

export interface ILeaderboardResponse {
  leaderboard: ILeaderboardEntry[];
  currentUserRank?: number;
  totalParticipants: number;
  timeframe: TTimeframe;
  category: 'overall' | 'course' | 'weekly' | 'monthly';
}

export interface ILeaderboardQueryParams {
  timeframe?: TTimeframe;
  category?: 'overall' | 'course' | 'weekly' | 'monthly';
  courseId?: string;
  limit?: number;
  includeCurrentUser?: boolean;
}

// ===== RECOMMENDATIONS INTERFACES =====

export interface IRecommendation {
  id: string;
  type: 'content' | 'study_plan' | 'skill_improvement' | 'peer_interaction';
  title: string;
  description: string;
  contentId?: string;
  contentType?: TContentType;
  priority: 'low' | 'medium' | 'high';
  estimatedTime?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  reasoning: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface IRecommendationsResponse {
  recommendations: IRecommendation[];
  totalRecommendations: number;
  personalizedScore: number;
  lastUpdated: string;
}

// ===== SYNC INTERFACES =====

export interface ISyncProgressData {
  progressData: Array<{
    userId: string;
    courseId: string;
    contentType: TContentType;
    contentId: string;
    progressPercentage: number;
    status: TProgressStatus;
    timeSpent: number;
    score?: number;
    timestamp: number;
    source: 'offline' | 'mobile' | 'web';
  }>;
  options?: {
    overwriteExisting?: boolean;
    validateData?: boolean;
    createMissing?: boolean;
  };
}

export interface ISyncResponse {
  syncId: string;
  processed: number;
  created: number;
  updated: number;
  failed: number;
  errors?: Array<{
    index: number;
    error: string;
    data?: any;
  }>;
  summary: {
    totalTimeSpent: number;
    itemsCompleted: number;
    averageScore: number;
  };
}

// ===== ADMIN INTERFACES =====

export interface ISystemStatistics {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalProgressEntries: number;
    totalCourses: number;
    totalTimeSpent: number;
    averageCompletionRate: number;
  };
  userEngagement: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    averageSessionTime: number;
    returnUserRate: number;
  };
  contentPerformance: {
    mostPopularContent: Array<{
      contentId: string;
      contentTitle: string;
      contentType: TContentType;
      completionRate: number;
      averageScore: number;
      totalUsers: number;
    }>;
    leastEngagingContent: Array<{
      contentId: string;
      contentTitle: string;
      contentType: TContentType;
      completionRate: number;
      averageScore: number;
      totalUsers: number;
    }>;
  };
  trends: {
    userGrowth: Array<{
      period: string;
      newUsers: number;
      activeUsers: number;
    }>;
    engagementTrends: Array<{
      period: string;
      averageTimeSpent: number;
      completionRate: number;
      averageScore: number;
    }>;
  };
}

export interface IDataValidationResult {
  isValid: boolean;
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  issues: Array<{
    type: 'missing_data' | 'invalid_value' | 'constraint_violation' | 'orphaned_record';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    affectedRecords: number;
    suggestions?: string[];
  }>;
  fixableIssues: number;
  recommendations: string[];
}

// ===== BULK OPERATIONS INTERFACES =====

export interface IBulkProgressUpdateInput {
  updates: Array<{
    progressId?: string;
    userId: string;
    courseId: string;
    contentId: string;
    progressPercentage: number;
    status: TProgressStatus;
    timeSpent: number;
    score?: number;
  }>;
  options?: {
    upsert?: boolean;
    validate?: boolean;
    skipValidation?: boolean;
  };
}

export interface IBulkOperationResponse {
  operationId: string;
  processed: number;
  successful: number;
  failed: number;
  errors?: Array<{
    index: number;
    error: string;
    data?: any;
  }>;
  summary: {
    totalProcessed: number;
    totalTimeSpent: number;
    averageScore: number;
  };
}

// ===== EXPORT INTERFACES =====

export interface IAdvancedExportRequest {
  format: 'json' | 'csv' | 'xlsx' | 'pdf';
  userId?: string;
  courseId?: string;
  includeMetadata?: boolean;
  includeAnalytics?: boolean;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  contentTypes?: TContentType[];
  status?: TProgressStatus[];
  customFields?: string[];
}

export interface IExportStatusResponse {
  exportId: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  downloadUrl?: string;
  fileName?: string;
  fileSize?: string;
  recordsCount?: number;
  createdAt: string;
  completedAt?: string;
  expiresAt?: string;
  error?: string;
}

// ===== RESPONSE INTERFACES =====

export interface IAnalyticsResponse extends IProgressApiResponse<{
  analytics: IAdvancedProgressAnalytics;
}> {}

export interface ILeaderboardApiResponse extends IProgressApiResponse<ILeaderboardResponse> {}

export interface IRecommendationsApiResponse extends IProgressApiResponse<IRecommendationsResponse> {}

export interface ISyncApiResponse extends IProgressApiResponse<ISyncResponse> {}

export interface ISystemStatsResponse extends IProgressApiResponse<{
  statistics: ISystemStatistics;
}> {}

export interface IDataValidationResponse extends IProgressApiResponse<IDataValidationResult> {}

export interface IBulkOperationApiResponse extends IProgressApiResponse<IBulkOperationResponse> {}

export interface IExportStatusApiResponse extends IProgressApiResponse<IExportStatusResponse> {}

// ===== ADVANCED API ENDPOINTS =====

export const advancedProgressAPI = {
  // Enhanced Analytics
  analytics: {
    getAdvanced: (userId: string, params: IAnalyticsQueryParams = {}): string => {
      if (!userId) throw new Error('User ID is required');
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      
      const queryString = queryParams.toString();
      return `${apiBaseUrl}/enhanced-progress/analytics/advanced/${userId}${queryString ? `?${queryString}` : ''}`;
    },

    getInsights: (userId: string): string => {
      if (!userId) throw new Error('User ID is required');
      return `${apiBaseUrl}/enhanced-progress/analytics/insights/${userId}`;
    },

    getComparison: (userId: string, params: { timeframe?: TTimeframe; cohort?: string } = {}): string => {
      if (!userId) throw new Error('User ID is required');
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      
      const queryString = queryParams.toString();
      return `${apiBaseUrl}/enhanced-progress/analytics/comparison/${userId}${queryString ? `?${queryString}` : ''}`;
    },
  },

  // Leaderboards
  leaderboard: {
    get: (params: ILeaderboardQueryParams = {}): string => {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      
      const queryString = queryParams.toString();
      return `${apiBaseUrl}/enhanced-progress/leaderboard${queryString ? `?${queryString}` : ''}`;
    },

    getCourse: (courseId: string, params: Omit<ILeaderboardQueryParams, 'courseId'> = {}): string => {
      if (!courseId) throw new Error('Course ID is required');
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      
      const queryString = queryParams.toString();
      return `${apiBaseUrl}/enhanced-progress/leaderboard/course/${courseId}${queryString ? `?${queryString}` : ''}`;
    },

    getWeekly: (params: Omit<ILeaderboardQueryParams, 'timeframe'> = {}): string => {
      const queryParams = new URLSearchParams();
      queryParams.set('timeframe', 'week');
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      
      const queryString = queryParams.toString();
      return `${apiBaseUrl}/enhanced-progress/leaderboard${queryString ? `?${queryString}` : ''}`;
    },
  },

  // Recommendations
  recommendations: {
    get: (userId: string): string => {
      if (!userId) throw new Error('User ID is required');
      return `${apiBaseUrl}/enhanced-progress/recommendations/${userId}`;
    },

    refresh: (userId: string): string => {
      if (!userId) throw new Error('User ID is required');
      return `${apiBaseUrl}/enhanced-progress/recommendations/${userId}/refresh`;
    },

    getByType: (userId: string, type: 'content' | 'study_plan' | 'skill_improvement' | 'peer_interaction'): string => {
      if (!userId) throw new Error('User ID is required');
      return `${apiBaseUrl}/enhanced-progress/recommendations/${userId}/type/${type}`;
    },
  },

  // Sync Operations
  sync: {
    upload: `${apiBaseUrl}/enhanced-progress/sync/upload`,
    download: (userId: string): string => {
      if (!userId) throw new Error('User ID is required');
      return `${apiBaseUrl}/enhanced-progress/sync/download/${userId}`;
    },
    status: (syncId: string): string => {
      if (!syncId) throw new Error('Sync ID is required');
      return `${apiBaseUrl}/enhanced-progress/sync/status/${syncId}`;
    },
    conflicts: (syncId: string): string => {
      if (!syncId) throw new Error('Sync ID is required');
      return `${apiBaseUrl}/enhanced-progress/sync/conflicts/${syncId}`;
    },
  },

  // Bulk Operations
  bulk: {
    create: `${apiBaseUrl}/enhanced-progress/bulk/create`,
    update: `${apiBaseUrl}/enhanced-progress/bulk/update`,
    delete: `${apiBaseUrl}/enhanced-progress/bulk/delete`,
    import: `${apiBaseUrl}/enhanced-progress/bulk/import`,
    export: `${apiBaseUrl}/enhanced-progress/bulk/export`,
    status: (operationId: string): string => {
      if (!operationId) throw new Error('Operation ID is required');
      return `${apiBaseUrl}/enhanced-progress/bulk/status/${operationId}`;
    },
  },

  // Export Operations
  export: {
    request: (userId: string): string => {
      if (!userId) throw new Error('User ID is required');
      return `${apiBaseUrl}/enhanced-progress/export/${userId}`;
    },
    
    status: (exportId: string): string => {
      if (!exportId) throw new Error('Export ID is required');
      return `${apiBaseUrl}/enhanced-progress/export/status/${exportId}`;
    },

    download: (exportId: string): string => {
      if (!exportId) throw new Error('Export ID is required');
      return `${apiBaseUrl}/enhanced-progress/export/download/${exportId}`;
    },

    history: (userId: string): string => {
      if (!userId) throw new Error('User ID is required');
      return `${apiBaseUrl}/enhanced-progress/export/history/${userId}`;
    },
  },

  // Advanced Admin Operations
  admin: {
    systemStats: `${apiBaseUrl}/enhanced-progress/admin/system/stats`,
    
    validateData: `${apiBaseUrl}/enhanced-progress/admin/validate`,
    
    fixDataIntegrity: `${apiBaseUrl}/enhanced-progress/admin/fix-integrity`,
    
    generateReports: `${apiBaseUrl}/enhanced-progress/admin/reports/generate`,
    
    getSystemHealth: `${apiBaseUrl}/enhanced-progress/admin/system/health`,
    
    getCourseAnalytics: (courseId: string): string => {
      if (!courseId) throw new Error('Course ID is required');
      return `${apiBaseUrl}/enhanced-progress/admin/course/${courseId}/analytics`;
    },
    
    getUserAnalytics: (userId: string, params: IAnalyticsQueryParams = {}): string => {
      if (!userId) throw new Error('User ID is required');
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      
      const queryString = queryParams.toString();
      return `${apiBaseUrl}/enhanced-progress/admin/user/${userId}/analytics${queryString ? `?${queryString}` : ''}`;
    },
    
    resetUserProgress: (userId: string): string => {
      if (!userId) throw new Error('User ID is required');
      return `${apiBaseUrl}/enhanced-progress/admin/user/${userId}/reset`;
    },
    
    recalculateProgress: (userId?: string): string => {
      if (userId) {
        return `${apiBaseUrl}/enhanced-progress/admin/recalculate/${userId}`;
      }
      return `${apiBaseUrl}/enhanced-progress/admin/recalculate`;
    },
    
    getAuditLog: (params: { 
      userId?: string; 
      action?: string; 
      startDate?: string; 
      endDate?: string; 
      page?: number; 
      limit?: number; 
    } = {}): string => {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      
      const queryString = queryParams.toString();
      return `${apiBaseUrl}/enhanced-progress/admin/audit${queryString ? `?${queryString}` : ''}`;
    },
  },
};

// ===== ADVANCED UTILITY FUNCTIONS =====

export const advancedProgressUtils = {
  /**
   * Generate progress insights based on analytics
   */
  generateInsights: (analytics: IAdvancedProgressAnalytics): string[] => {
    const insights: string[] = [];
    
    if (analytics.overview.completionRate > 80) {
      insights.push('Excellent completion rate! You\'re doing great.');
    } else if (analytics.overview.completionRate < 50) {
      insights.push('Consider setting smaller, achievable goals to improve completion rate.');
    }
    
    if (analytics.trends.scoreTrend === 'increasing') {
      insights.push('Your scores are improving over time. Keep up the good work!');
    }
    
    if (analytics.overview.streakDays > 7) {
      insights.push(`Amazing ${analytics.overview.streakDays}-day learning streak!`);
    }
    
    if (analytics.comparison?.cohortAverage.percentile && analytics.comparison.cohortAverage.percentile > 75) {
      insights.push('You\'re performing above average compared to your peers.');
    }
    
    return insights;
  },

  /**
   * Calculate learning velocity
   */
  calculateLearningVelocity: (analytics: IAdvancedProgressAnalytics): {
    velocity: number;
    trend: 'accelerating' | 'decelerating' | 'stable';
    prediction: {
      timeToCompletion: number;
      confidenceLevel: number;
    };
  } => {
    const recentProgress = analytics.breakdown.byWeek.slice(-4);
    const totalProgress = recentProgress.reduce((sum, week) => sum + week.progress, 0);
    const avgWeeklyProgress = totalProgress / recentProgress.length;
    
    // Calculate trend
    let trend: 'accelerating' | 'decelerating' | 'stable' = 'stable';
    if (recentProgress.length >= 2) {
      const recent = recentProgress.slice(-2);
      const change = recent[1].progress - recent[0].progress;
      if (change > 5) trend = 'accelerating';
      else if (change < -5) trend = 'decelerating';
    }
    
    // Predict time to completion
    const remainingProgress = 100 - analytics.overview.completionRate;
    const timeToCompletion = avgWeeklyProgress > 0 ? remainingProgress / avgWeeklyProgress : Infinity;
    
    return {
      velocity: avgWeeklyProgress,
      trend,
      prediction: {
        timeToCompletion: Math.round(timeToCompletion),
        confidenceLevel: Math.min(90, 50 + (recentProgress.length * 10))
      }
    };
  },

  /**
   * Generate personalized recommendations
   */
  generateRecommendations: (analytics: IAdvancedProgressAnalytics): IRecommendation[] => {
    const recommendations: IRecommendation[] = [];
    
    // Check for struggling areas
    const strugglingTypes = Object.entries(analytics.breakdown.byContentType)
      .filter(([_, data]) => data.completionRate < 60)
      .map(([type]) => type);
    
    if (strugglingTypes.length > 0) {
      recommendations.push({
        id: 'focus-struggling-areas',
        type: 'study_plan',
        title: 'Focus on Challenging Content',
        description: `Consider spending more time on ${strugglingTypes.join(', ')} content where you have lower completion rates.`,
        priority: 'high',
        reasoning: 'Identified areas with completion rates below 60%',
        estimatedTime: 120,
        difficulty: 'intermediate'
      });
    }
    
    // Check for streak opportunities
    if (analytics.overview.streakDays < 3) {
      recommendations.push({
        id: 'build-streak',
        type: 'content',
        title: 'Build Your Learning Streak',
        description: 'Complete a short lesson today to start building a consistent learning habit.',
        priority: 'medium',
        reasoning: 'Low current streak days detected',
        estimatedTime: 30,
        difficulty: 'beginner'
      });
    }
    
    // Check for engagement opportunities
    if (analytics.overview.averageSessionTime < 1800) { // Less than 30 minutes
      recommendations.push({
        id: 'extend-sessions',
        type: 'study_plan',
        title: 'Extend Your Study Sessions',
        description: 'Try extending your study sessions to 45-60 minutes for better retention.',
        priority: 'medium',
        reasoning: 'Short average session time detected',
        estimatedTime: 60,
        difficulty: 'intermediate'
      });
    }
    
    return recommendations;
  },

  /**
   * Format progress comparison for display
   */
  formatComparison: (comparison: IProgressComparison): {
    summary: string;
    details: Record<string, string>;
  } => {
    const summary = `You're performing ${comparison.cohortAverage.percentile > 50 ? 'above' : 'below'} average (${comparison.cohortAverage.percentile}th percentile)`;
    
    const details = {
      progress: comparison.previousPeriod.progressChange > 0 
        ? `+${comparison.previousPeriod.progressChange}% from last period` 
        : `${comparison.previousPeriod.progressChange}% from last period`,
      score: comparison.previousPeriod.scoreChange > 0 
        ? `+${comparison.previousPeriod.scoreChange}% score improvement` 
        : `${comparison.previousPeriod.scoreChange}% score change`,
      timeSpent: comparison.previousPeriod.timeSpentChange > 0 
        ? `+${comparison.previousPeriod.timeSpentChange}% more time spent` 
        : `${comparison.previousPeriod.timeSpentChange}% time spent change`,
      ranking: comparison.classmateComparison 
        ? `Rank ${comparison.classmateComparison.rank} of ${comparison.classmateComparison.totalStudents}` 
        : 'No ranking data available'
    };
    
    return { summary, details };
  },

  /**
   * Validate export request
   */
  validateExportRequest: (request: IAdvancedExportRequest): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } => {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Check required fields
    if (!request.format) {
      errors.push('Export format is required');
    }
    
    // Check format support
    const supportedFormats = ['json', 'csv', 'xlsx', 'pdf'];
    if (request.format && !supportedFormats.includes(request.format)) {
      errors.push(`Unsupported format: ${request.format}. Supported formats: ${supportedFormats.join(', ')}`);
    }
    
    // Check date range
    if (request.dateRange) {
      const { startDate, endDate } = request.dateRange;
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (start > end) {
        errors.push('Start date cannot be after end date');
      }
      
      const now = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(now.getMonth() - 6);
      
      if (start < sixMonthsAgo) {
        warnings.push('Requesting data older than 6 months may result in slower export');
      }
    }
    
    // Check content types
    if (request.contentTypes && request.contentTypes.length === 0) {
      warnings.push('No content types specified, all types will be included');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  },

  /**
   * Calculate progress score for leaderboard
   */
  calculateProgressScore: (data: {
    completionRate: number;
    averageScore: number;
    timeSpent: number;
    streakDays: number;
    activeDays: number;
  }): number => {
    // Weighted scoring system
    const weights = {
      completion: 0.4,
      score: 0.3,
      consistency: 0.2,
      engagement: 0.1
    };
    
    const completionScore = data.completionRate;
    const scoreValue = data.averageScore || 0;
    const consistencyScore = Math.min(100, (data.streakDays / 30) * 100); // Max 30 day streak
    const engagementScore = Math.min(100, (data.activeDays / 30) * 100); // Max 30 active days
    
    return Math.round(
      (completionScore * weights.completion) +
      (scoreValue * weights.score) +
      (consistencyScore * weights.consistency) +
      (engagementScore * weights.engagement)
    );
  },

  /**
   * Format time duration for display
   */
  formatDuration: (seconds: number, detailed: boolean = false): string => {
    if (seconds < 60) return `${seconds}s`;
    
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (detailed) {
      if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
      if (hours > 0) return `${hours}h ${minutes % 60}m`;
      return `${minutes}m ${seconds % 60}s`;
    } else {
      if (days > 0) return `${days}d`;
      if (hours > 0) return `${hours}h`;
      return `${minutes}m`;
    }
  },

  /**
   * Get progress status badge
   */
  getProgressBadge: (completionRate: number): {
    level: string;
    color: string;
    icon: string;
  } => {
    if (completionRate >= 90) {
      return { level: 'Expert', color: '#10B981', icon: '🏆' };
    } else if (completionRate >= 75) {
      return { level: 'Advanced', color: '#3B82F6', icon: '⭐' };
    } else if (completionRate >= 50) {
      return { level: 'Intermediate', color: '#F59E0B', icon: '📈' };
    } else if (completionRate >= 25) {
      return { level: 'Beginner', color: '#8B5CF6', icon: '🌱' };
    } else {
      return { level: 'Getting Started', color: '#6B7280', icon: '🚀' };
    }
  },
};

export default advancedProgressAPI; 