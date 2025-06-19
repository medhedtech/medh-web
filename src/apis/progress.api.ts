// progress.api.ts - Enhanced Progress Tracking System API

import { apiBaseUrl } from './config';

// ===== CORE TYPE DEFINITIONS =====
export type TContentType = 'lesson' | 'quiz' | 'assignment' | 'project' | 'video' | 'reading' | 'discussion' | 'exam';
export type TProgressStatus = 'not_started' | 'in_progress' | 'completed' | 'paused' | 'failed' | 'skipped';
export type TDifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type TExportFormat = 'json' | 'csv' | 'xlsx' | 'pdf';
export type TTimeframe = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'all';

// ===== CORE INTERFACES =====
export interface IProgressMetadata {
  attempts?: number;
  difficulty?: TDifficultyLevel;
  hints_used?: number;
  errors_made?: number;
  device_type?: 'desktop' | 'tablet' | 'mobile';
  session_id?: string;
  [key: string]: any;
}

export interface IProgressEntry {
  _id?: string;
  userId: string;
  courseId: string;
  contentType: TContentType;
  contentId: string;
  contentTitle?: string;
  progressPercentage: number;
  status: TProgressStatus;
  timeSpent: number;
  score?: number;
  maxScore?: number;
  notes?: string;
  metadata?: IProgressMetadata;
  startedAt?: string;
  lastAccessedAt?: string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IProgressCreateInput {
  userId: string;
  courseId: string;
  contentType: TContentType;
  contentId: string;
  contentTitle?: string;
  progressPercentage: number;
  status: TProgressStatus;
  timeSpent: number;
  score?: number;
  notes?: string;
  metadata?: IProgressMetadata;
}

export interface IProgressUpdateInput extends Partial<IProgressCreateInput> {
  progressId: string;
}

// ===== QUERY INTERFACES =====
export interface IProgressQueryParams {
  page?: number;
  limit?: number;
  courseId?: string;
  contentType?: TContentType;
  status?: TProgressStatus;
  sortBy?: 'createdAt' | 'updatedAt' | 'progressPercentage' | 'timeSpent' | 'score';
  sortOrder?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface IPaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ===== ANALYTICS INTERFACES =====
export interface IProgressOverview {
  totalProgress: number;
  completionRate: number;
  averageScore: number;
  totalTimeSpent: number;
  streakDays: number;
  activeDays: number;
  totalSessions: number;
  lastActivity?: string;
}

export interface IProgressAnalytics {
  overview: IProgressOverview;
  trends: {
    progressTrend: 'increasing' | 'decreasing' | 'stable';
    scoreTrend: 'increasing' | 'decreasing' | 'stable';
    timeSpentTrend: 'increasing' | 'decreasing' | 'stable';
  };
  breakdown: {
    byContentType: Record<TContentType, {
      count: number;
      completionRate: number;
      averageScore: number;
    }>;
    byWeek: Array<{
      week: string;
      progress: number;
      timeSpent: number;
    }>;
  };
}

export interface IProgressSummary {
  userId: string;
  totalProgress: number;
  completedItems: number;
  totalItems: number;
  averageScore: number;
  totalTimeSpent: number;
  completionRate: number;
  currentStreak: number;
  activeCourses: number;
}

// ===== EXPORT INTERFACES =====
export interface IExportRequest {
  format: TExportFormat;
  userId?: string;
  courseId?: string;
  includeMetadata?: boolean;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
}

export interface IExportResponse {
  exportId: string;
  downloadUrl: string;
  fileName: string;
  fileSize: string;
  recordsCount: number;
  expiresAt: string;
  createdAt: string;
}

// ===== RESPONSE INTERFACES =====
export interface IProgressApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: IPaginationInfo;
}

export interface IProgressResponse extends IProgressApiResponse<{
  progress: IProgressEntry;
}> {}

export interface IProgressListResponse extends IProgressApiResponse<{
  progress: IProgressEntry[];
  pagination: IPaginationInfo;
  summary?: {
    totalProgress: number;
    completedItems: number;
    averageScore: number;
    totalTimeSpent: number;
  };
}> {}

// ===== API ENDPOINTS =====
export const progressAPI = {
  // Base endpoint
  base: `${apiBaseUrl}/enhanced-progress`,

  // Student Progress Management
  progress: {
    create: `${apiBaseUrl}/enhanced-progress`,
    
    getByUser: (userId: string, params: IProgressQueryParams = {}): string => {
      if (!userId) throw new Error('User ID is required');
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      
      const queryString = queryParams.toString();
      return `${apiBaseUrl}/enhanced-progress/user/${userId}${queryString ? `?${queryString}` : ''}`;
    },
    
    getMyProgress: (params: IProgressQueryParams = {}): string => {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      
      const queryString = queryParams.toString();
      return `${apiBaseUrl}/enhanced-progress/my-progress${queryString ? `?${queryString}` : ''}`;
    },
    
    getById: (progressId: string): string => {
      if (!progressId) throw new Error('Progress ID is required');
      return `${apiBaseUrl}/enhanced-progress/${progressId}`;
    },
    
    update: (progressId: string): string => {
      if (!progressId) throw new Error('Progress ID is required');
      return `${apiBaseUrl}/enhanced-progress/${progressId}`;
    },
    
    delete: (progressId: string): string => {
      if (!progressId) throw new Error('Progress ID is required');
      return `${apiBaseUrl}/enhanced-progress/${progressId}`;
    },
  },

  // Analytics & Reporting
  analytics: {
    getByUser: (userId: string, params: Record<string, any> = {}): string => {
      if (!userId) throw new Error('User ID is required');
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      
      const queryString = queryParams.toString();
      return `${apiBaseUrl}/enhanced-progress/analytics/user/${userId}${queryString ? `?${queryString}` : ''}`;
    },
    
    getSummary: (userId: string): string => {
      if (!userId) throw new Error('User ID is required');
      return `${apiBaseUrl}/enhanced-progress/summary/${userId}`;
    },
    
    getHistory: (userId: string, params: Record<string, any> = {}): string => {
      if (!userId) throw new Error('User ID is required');
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      
      const queryString = queryParams.toString();
      return `${apiBaseUrl}/enhanced-progress/history/${userId}${queryString ? `?${queryString}` : ''}`;
    },
    
    getInsights: (userId: string): string => {
      if (!userId) throw new Error('User ID is required');
      return `${apiBaseUrl}/enhanced-progress/insights/${userId}`;
    },
    
    getLeaderboard: (params: Record<string, any> = {}): string => {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      
      const queryString = queryParams.toString();
      return `${apiBaseUrl}/enhanced-progress/leaderboard${queryString ? `?${queryString}` : ''}`;
    },
    
    getRecommendations: (userId: string): string => {
      if (!userId) throw new Error('User ID is required');
      return `${apiBaseUrl}/enhanced-progress/recommendations/${userId}`;
    },
  },

  // Utility Operations
  utility: {
    reset: (userId: string): string => {
      if (!userId) throw new Error('User ID is required');
      return `${apiBaseUrl}/enhanced-progress/reset/${userId}`;
    },
    
    sync: `${apiBaseUrl}/enhanced-progress/sync`,
    
    export: (userId: string): string => {
      if (!userId) throw new Error('User ID is required');
      return `${apiBaseUrl}/enhanced-progress/export/${userId}`;
    },
  },

  // Admin Operations
  admin: {
    getStats: `${apiBaseUrl}/enhanced-progress/admin/stats`,
    validateData: `${apiBaseUrl}/enhanced-progress/admin/validate`,
    
    getUserProgress: (userId: string, params: IProgressQueryParams = {}): string => {
      if (!userId) throw new Error('User ID is required');
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      
      const queryString = queryParams.toString();
      return `${apiBaseUrl}/enhanced-progress/admin/user/${userId}/progress${queryString ? `?${queryString}` : ''}`;
    },
  },
};

// ===== UTILITY FUNCTIONS =====
export const progressUtils = {
  /**
   * Calculate completion rate from progress entries
   */
  calculateCompletionRate: (progressEntries: IProgressEntry[]): number => {
    if (!progressEntries || progressEntries.length === 0) return 0;
    
    const completedEntries = progressEntries.filter(entry => 
      entry.status === 'completed' || entry.progressPercentage >= 100
    );
    
    return Math.round((completedEntries.length / progressEntries.length) * 100);
  },

  /**
   * Calculate average score from progress entries
   */
  calculateAverageScore: (progressEntries: IProgressEntry[]): number => {
    const entriesWithScores = progressEntries.filter(entry => 
      entry.score !== undefined && entry.score !== null
    );
    
    if (entriesWithScores.length === 0) return 0;
    
    const totalScore = entriesWithScores.reduce((sum, entry) => sum + (entry.score || 0), 0);
    return Math.round((totalScore / entriesWithScores.length) * 100) / 100;
  },

  /**
   * Format time spent in human readable format
   */
  formatTimeSpent: (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours}h ${minutes}m ${secs}s`;
  },

  /**
   * Get progress status color
   */
  getStatusColor: (status: TProgressStatus): string => {
    const colorMap: Record<TProgressStatus, string> = {
      'not_started': '#6B7280',
      'in_progress': '#3B82F6',
      'completed': '#10B981',
      'paused': '#F59E0B',
      'failed': '#EF4444',
      'skipped': '#8B5CF6'
    };
    
    return colorMap[status] || '#6B7280';
  },

  /**
   * Validate progress percentage
   */
  validateProgressPercentage: (percentage: number): boolean => {
    return percentage >= 0 && percentage <= 100;
  },

  /**
   * Validate score
   */
  validateScore: (score: number, maxScore?: number): boolean => {
    if (maxScore) {
      return score >= 0 && score <= maxScore;
    }
    return score >= 0 && score <= 100;
  },
};

export default progressAPI; 