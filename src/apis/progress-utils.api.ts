// progress-utils.api.ts - Enhanced Progress Tracking System Utilities

import { apiBaseUrl } from './config';

// ===== UTILITY FUNCTIONS =====

export const progressUtils = {
  /**
   * Build query parameters for API requests
   */
  buildQueryParams: (params: Record<string, any>): string => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(item => queryParams.append(key, String(item)));
        } else {
          queryParams.append(key, String(value));
        }
      }
    });
    
    return queryParams.toString();
  },

  /**
   * Calculate completion percentage
   */
  calculateCompletionRate: (completed: number, total: number): number => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  },

  /**
   * Format progress score for display
   */
  formatScore: (score: number): string => {
    if (score === null || score === undefined) return 'N/A';
    if (score % 1 === 0) return score.toString();
    return score.toFixed(1);
  },

  /**
   * Format time duration for display
   */
  formatTimeSpent: (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  },

  /**
   * Get progress status color
   */
  getStatusColor: (status: string): string => {
    const statusColors: Record<string, string> = {
      'not_started': '#6B7280',
      'in_progress': '#3B82F6',
      'completed': '#10B981',
      'paused': '#F59E0B',
      'failed': '#EF4444',
      'skipped': '#8B5CF6'
    };
    return statusColors[status] || '#6B7280';
  },

  /**
   * Validate progress data
   */
  validateProgressData: (data: any): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!data.userId) errors.push('User ID is required');
    if (!data.courseId) errors.push('Course ID is required');
    if (!data.contentId) errors.push('Content ID is required');
    if (data.progressPercentage < 0 || data.progressPercentage > 100) {
      errors.push('Progress percentage must be between 0 and 100');
    }
    if (data.timeSpent < 0) errors.push('Time spent cannot be negative');
    if (data.score !== undefined && (data.score < 0 || data.score > 100)) {
      errors.push('Score must be between 0 and 100');
    }
    
    return { isValid: errors.length === 0, errors };
  },

  /**
   * Generate progress analytics summary
   */
  generateSummary: (progressData: any[]): {
    totalItems: number;
    completedItems: number;
    inProgressItems: number;
    totalTimeSpent: number;
    averageScore: number;
    completionRate: number;
  } => {
    const totalItems = progressData.length;
    const completedItems = progressData.filter(p => p.status === 'completed').length;
    const inProgressItems = progressData.filter(p => p.status === 'in_progress').length;
    const totalTimeSpent = progressData.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
    const scoresSum = progressData
      .filter(p => p.score !== undefined && p.score !== null)
      .reduce((sum, p) => sum + p.score, 0);
    const itemsWithScores = progressData.filter(p => p.score !== undefined && p.score !== null).length;
    
    return {
      totalItems,
      completedItems,
      inProgressItems,
      totalTimeSpent,
      averageScore: itemsWithScores > 0 ? Math.round(scoresSum / itemsWithScores) : 0,
      completionRate: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
    };
  }
};

// ===== ENHANCED API ENDPOINTS =====

export const enhancedProgressAPI = {
  // Analytics endpoints
  analytics: {
    advanced: (userId: string, params: any = {}): string => {
      const query = progressUtils.buildQueryParams(params);
      return `${apiBaseUrl}/enhanced-progress/analytics/advanced/${userId}${query ? `?${query}` : ''}`;
    },
    
    insights: (userId: string): string => 
      `${apiBaseUrl}/enhanced-progress/analytics/insights/${userId}`,
    
    comparison: (userId: string, params: any = {}): string => {
      const query = progressUtils.buildQueryParams(params);
      return `${apiBaseUrl}/enhanced-progress/analytics/comparison/${userId}${query ? `?${query}` : ''}`;
    }
  },

  // Leaderboard endpoints
  leaderboard: {
    global: (params: any = {}): string => {
      const query = progressUtils.buildQueryParams(params);
      return `${apiBaseUrl}/enhanced-progress/leaderboard${query ? `?${query}` : ''}`;
    },
    
    course: (courseId: string, params: any = {}): string => {
      const query = progressUtils.buildQueryParams(params);
      return `${apiBaseUrl}/enhanced-progress/leaderboard/course/${courseId}${query ? `?${query}` : ''}`;
    },
    
    weekly: (params: any = {}): string => {
      const queryParams = { ...params, timeframe: 'week' };
      const query = progressUtils.buildQueryParams(queryParams);
      return `${apiBaseUrl}/enhanced-progress/leaderboard${query ? `?${query}` : ''}`;
    }
  },

  // Recommendations endpoints
  recommendations: {
    get: (userId: string): string => 
      `${apiBaseUrl}/enhanced-progress/recommendations/${userId}`,
    
    refresh: (userId: string): string => 
      `${apiBaseUrl}/enhanced-progress/recommendations/${userId}/refresh`,
    
    byType: (userId: string, type: string): string => 
      `${apiBaseUrl}/enhanced-progress/recommendations/${userId}/type/${type}`
  },

  // Sync endpoints
  sync: {
    upload: `${apiBaseUrl}/enhanced-progress/sync/upload`,
    download: (userId: string): string => 
      `${apiBaseUrl}/enhanced-progress/sync/download/${userId}`,
    status: (syncId: string): string => 
      `${apiBaseUrl}/enhanced-progress/sync/status/${syncId}`
  },

  // Export endpoints
  export: {
    request: (userId: string): string => 
      `${apiBaseUrl}/enhanced-progress/export/${userId}`,
    status: (exportId: string): string => 
      `${apiBaseUrl}/enhanced-progress/export/status/${exportId}`,
    download: (exportId: string): string => 
      `${apiBaseUrl}/enhanced-progress/export/download/${exportId}`
  },

  // Admin endpoints
  admin: {
    systemStats: `${apiBaseUrl}/enhanced-progress/admin/system/stats`,
    validateData: `${apiBaseUrl}/enhanced-progress/admin/validate`,
    userAnalytics: (userId: string, params: any = {}): string => {
      const query = progressUtils.buildQueryParams(params);
      return `${apiBaseUrl}/enhanced-progress/admin/user/${userId}/analytics${query ? `?${query}` : ''}`;
    },
    resetProgress: (userId: string): string => 
      `${apiBaseUrl}/enhanced-progress/admin/user/${userId}/reset`
  }
};

export default { progressUtils, enhancedProgressAPI }; 