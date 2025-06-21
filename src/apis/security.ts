// security.ts - Comprehensive Security API

import { apiBaseUrl } from './config';

// Security Interfaces
export interface ISecuritySession {
  session_id: string;
  device_id: string;
  device_name: string;
  device_type: 'desktop' | 'mobile' | 'tablet' | 'unknown';
  operating_system: string;
  browser: string;
  ip_address: string;
  location: string;
  city?: string;
  country?: string;
  is_current: boolean;
  is_trusted: boolean;
  last_active: string;
  last_active_formatted: string;
  created_at: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  risk_factors: string[];
  session_duration: string;
}

export interface ISecurityDevice {
  device_id: string;
  device_name: string;
  device_type: 'desktop' | 'mobile' | 'tablet' | 'unknown';
  operating_system: string;
  browser: string;
  is_current: boolean;
  is_trusted: boolean;
  last_seen: string;
  last_seen_formatted: string;
  first_seen: string;
  session_count: number;
  recent_locations: string[];
  recent_activity: Array<{
    action: string;
    timestamp: string;
    formatted_time: string;
  }>;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
}

export interface ISecurityActivity {
  id: string;
  action: 'login' | 'logout' | 'logout_all_devices' | 'password_change' | 'password_reset' | 'password_reset_request' | 'temp_password_verified' | 'session_terminated' | 'bulk_session_termination' | 'admin_action' | 'device_trust_changed';
  timestamp: string;
  formatted_time: string;
  ip_address: string;
  location: string;
  device_info: {
    device_type: string;
    browser: string;
    operating_system: string;
  };
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  success: boolean;
  metadata?: {
    [key: string]: any;
  };
  description: string;
}

export interface ISecurityStats {
  active_sessions: number;
  total_devices: number;
  trusted_devices: number;
  recent_logins_24h: number;
  recent_activities_7d: number;
  high_risk_activities: number;
  last_login: string;
  last_login_formatted: string;
  account_age_days: number;
  password_last_changed: string;
  password_last_changed_formatted: string;
}

export interface ISecurityAssessment {
  overall_score: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  risk_factors: Array<{
    factor: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    recommendation: string;
  }>;
  recommendations: string[];
  security_strengths: string[];
  areas_for_improvement: string[];
}

export interface ILoginAnalytics {
  login_frequency: {
    daily_average: number;
    weekly_pattern: Array<{
      day: string;
      count: number;
    }>;
    hourly_pattern: Array<{
      hour: number;
      count: number;
    }>;
  };
  location_analysis: {
    unique_countries: number;
    unique_cities: number;
    most_common_location: string;
    recent_new_locations: string[];
  };
  device_analysis: {
    unique_devices: number;
    most_used_device_type: string;
    browser_distribution: Array<{
      browser: string;
      count: number;
      percentage: number;
    }>;
  };
  anomaly_detection: {
    unusual_login_times: number;
    new_location_logins: number;
    new_device_logins: number;
    failed_login_attempts: number;
  };
}

export interface ISecurityScore {
  overall_score: number;
  max_score: number;
  percentage: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  breakdown: {
    password_strength: {
      score: number;
      max_score: number;
      factors: string[];
    };
    session_security: {
      score: number;
      max_score: number;
      factors: string[];
    };
    device_trust: {
      score: number;
      max_score: number;
      factors: string[];
    };
    activity_patterns: {
      score: number;
      max_score: number;
      factors: string[];
    };
  };
  recommendations: string[];
  improvement_tips: string[];
}

// Response Interfaces
export interface ISecurityOverviewResponse {
  success: boolean;
  message: string;
  data: {
    stats: ISecurityStats;
    active_sessions: ISecuritySession[];
    security_assessment: ISecurityAssessment;
    login_analytics: ILoginAnalytics;
    security_score: ISecurityScore;
    quick_actions: Array<{
      action: string;
      title: string;
      description: string;
      priority: 'low' | 'medium' | 'high' | 'urgent';
    }>;
  };
}

export interface IActiveSessionsResponse {
  success: boolean;
  message: string;
  data: {
    sessions: ISecuritySession[];
    summary: {
      total_sessions: number;
      current_session_id: string;
      unique_locations: number;
      unique_devices: number;
      high_risk_sessions: number;
      trusted_devices: number;
    };
  };
}

export interface ITerminateSessionResponse {
  success: boolean;
  message: string;
  data: {
    session_id: string;
    terminated_at: string;
    was_current_session: boolean;
    security_impact: {
      risk_level_change: string;
      recommendations: string[];
    };
  };
}

export interface ILogoutAllDevicesResponse {
  success: boolean;
  message: string;
  data: {
    terminated_sessions: number;
    preserved_current_session: boolean;
    terminated_session_details: Array<{
      session_id: string;
      device_name: string;
      last_active: string;
    }>;
    security_recommendations: string[];
    next_steps: string[];
  };
}

export interface ISecurityActivityResponse {
  success: boolean;
  message: string;
  data: {
    activities: ISecurityActivity[];
    pagination: {
      current_page: number;
      total_pages: number;
      total_items: number;
      items_per_page: number;
      has_next_page: boolean;
      has_prev_page: boolean;
    };
    summary: {
      total_activities: number;
      high_risk_activities: number;
      recent_activities_24h: number;
      activity_types: Array<{
        type: string;
        count: number;
      }>;
    };
  };
}

export interface ISecurityStatsResponse {
  success: boolean;
  message: string;
  data: {
    stats: ISecurityStats;
    security_assessment: ISecurityAssessment;
    login_analytics: ILoginAnalytics;
  };
}

export interface IRiskAssessmentResponse {
  success: boolean;
  message: string;
  data: {
    risk_assessment: ISecurityAssessment;
    security_score: ISecurityScore;
    session_analysis: {
      total_sessions: number;
      unique_locations: number;
      unique_devices: number;
      high_risk_sessions: number;
    };
    recommendations: string[];
  };
}

export interface IDevicesResponse {
  success: boolean;
  message: string;
  data: {
    devices: ISecurityDevice[];
    summary: {
      total_devices: number;
      active_devices: number;
      trusted_devices: number;
      high_risk_devices: number;
    };
  };
}

export interface IDeviceTrustResponse {
  success: boolean;
  message: string;
  data: {
    device_id: string;
    trusted: boolean;
  };
}

// Query Parameters Interfaces
export interface ISecurityActivityParams {
  page?: number;
  limit?: number;
  type?: 'login' | 'logout' | 'logout_all_devices' | 'password_change' | 'password_reset' | 'password_reset_request' | 'temp_password_verified' | 'session_terminated' | 'bulk_session_termination' | 'admin_action';
  days?: number;
}

export interface IDeviceTrustUpdateData {
  trusted: boolean;
}

// Security API URLs
export const securityAPI = {
  // Base security endpoint
  base: `${apiBaseUrl}/security`,
  
  // Security Overview
  overview: `${apiBaseUrl}/security/overview`,
  
  // Session Management
  sessions: {
    getAll: `${apiBaseUrl}/security/sessions`,
    terminate: (sessionId: string): string => {
      if (!sessionId) throw new Error('Session ID is required');
      return `${apiBaseUrl}/security/sessions/${sessionId}`;
    },
    logoutAllDevices: `${apiBaseUrl}/security/logout-all-devices`,
  },
  
  // Security Activity
  activity: (params: ISecurityActivityParams = {}): string => {
    const { page = 1, limit = 20, type, days = 30 } = params;
    const queryParams = new URLSearchParams();
    
    queryParams.append('page', String(page));
    queryParams.append('limit', String(limit));
    queryParams.append('days', String(days));
    
    if (type) {
      queryParams.append('type', type);
    }
    
    return `${apiBaseUrl}/security/activity?${queryParams.toString()}`;
  },
  
  // Security Statistics
  stats: `${apiBaseUrl}/security/stats`,
  
  // Risk Assessment
  riskAssessment: `${apiBaseUrl}/security/risk-assessment`,
  
  // Device Management
  devices: {
    getAll: `${apiBaseUrl}/security/devices`,
    updateTrust: (deviceId: string): string => {
      if (!deviceId) throw new Error('Device ID is required');
      return `${apiBaseUrl}/security/devices/${deviceId}/trust`;
    },
  },
};

// Security Utility Functions
export const securityUtils = {
  /**
   * Get authorization headers for API requests
   */
  getAuthHeaders: (): Record<string, string> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  },

  /**
   * Get security overview with comprehensive data
   */
  getSecurityOverview: async (): Promise<ISecurityOverviewResponse> => {
    try {
      const response = await fetch(securityAPI.overview, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...securityUtils.getAuthHeaders(),
        },
      });
      
      return await response.json();
    } catch (error: any) {
      return {
        success: false,
        message: securityUtils.handleSecurityError(error),
        data: {} as any,
      };
    }
  },

  /**
   * Get all active sessions
   */
  getActiveSessions: async (): Promise<IActiveSessionsResponse> => {
    try {
      const response = await fetch(securityAPI.sessions.getAll, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...securityUtils.getAuthHeaders(),
        },
      });
      
      return await response.json();
    } catch (error: any) {
      return {
        success: false,
        message: securityUtils.handleSecurityError(error),
        data: {} as any,
      };
    }
  },

  /**
   * Terminate a specific session
   */
  terminateSession: async (sessionId: string): Promise<ITerminateSessionResponse> => {
    try {
      const response = await fetch(securityAPI.sessions.terminate(sessionId), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...securityUtils.getAuthHeaders(),
        },
      });
      
      return await response.json();
    } catch (error: any) {
      return {
        success: false,
        message: securityUtils.handleSecurityError(error),
        data: {} as any,
      };
    }
  },

  /**
   * Logout from all devices except current
   */
  logoutAllDevices: async (): Promise<ILogoutAllDevicesResponse> => {
    try {
      const response = await fetch(securityAPI.sessions.logoutAllDevices, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...securityUtils.getAuthHeaders(),
        },
      });
      
      const result = await response.json();
      
      // If successful, we don't clear tokens since current session is preserved
      return result;
    } catch (error: any) {
      return {
        success: false,
        message: securityUtils.handleSecurityError(error),
        data: {} as any,
      };
    }
  },

  /**
   * Get security activity with pagination and filtering
   */
  getSecurityActivity: async (params: ISecurityActivityParams = {}): Promise<ISecurityActivityResponse> => {
    try {
      const response = await fetch(securityAPI.activity(params), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...securityUtils.getAuthHeaders(),
        },
      });
      
      return await response.json();
    } catch (error: any) {
      return {
        success: false,
        message: securityUtils.handleSecurityError(error),
        data: {} as any,
      };
    }
  },

  /**
   * Get security statistics
   */
  getSecurityStats: async (): Promise<ISecurityStatsResponse> => {
    try {
      const response = await fetch(securityAPI.stats, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...securityUtils.getAuthHeaders(),
        },
      });
      
      return await response.json();
    } catch (error: any) {
      return {
        success: false,
        message: securityUtils.handleSecurityError(error),
        data: {} as any,
      };
    }
  },

  /**
   * Get risk assessment
   */
  getRiskAssessment: async (): Promise<IRiskAssessmentResponse> => {
    try {
      const response = await fetch(securityAPI.riskAssessment, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...securityUtils.getAuthHeaders(),
        },
      });
      
      return await response.json();
    } catch (error: any) {
      return {
        success: false,
        message: securityUtils.handleSecurityError(error),
        data: {} as any,
      };
    }
  },

  /**
   * Get all devices
   */
  getDevices: async (): Promise<IDevicesResponse> => {
    try {
      const response = await fetch(securityAPI.devices.getAll, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...securityUtils.getAuthHeaders(),
        },
      });
      
      return await response.json();
    } catch (error: any) {
      return {
        success: false,
        message: securityUtils.handleSecurityError(error),
        data: {} as any,
      };
    }
  },

  /**
   * Update device trust status
   */
  updateDeviceTrust: async (deviceId: string, trusted: boolean): Promise<IDeviceTrustResponse> => {
    try {
      const response = await fetch(securityAPI.devices.updateTrust(deviceId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...securityUtils.getAuthHeaders(),
        },
        body: JSON.stringify({ trusted }),
      });
      
      return await response.json();
    } catch (error: any) {
      return {
        success: false,
        message: securityUtils.handleSecurityError(error),
        data: {} as any,
      };
    }
  },

  /**
   * Format risk level for display
   */
  formatRiskLevel: (riskLevel: string): { text: string; color: string; bgColor: string } => {
    const riskMap = {
      'low': { text: 'Low Risk', color: 'text-green-600', bgColor: 'bg-green-100' },
      'medium': { text: 'Medium Risk', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
      'high': { text: 'High Risk', color: 'text-orange-600', bgColor: 'bg-orange-100' },
      'critical': { text: 'Critical Risk', color: 'text-red-600', bgColor: 'bg-red-100' },
    };
    
    return riskMap[riskLevel as keyof typeof riskMap] || riskMap.medium;
  },

  /**
   * Format security score grade
   */
  formatSecurityGrade: (grade: string): { color: string; bgColor: string } => {
    const gradeMap = {
      'A+': { color: 'text-green-700', bgColor: 'bg-green-100' },
      'A': { color: 'text-green-600', bgColor: 'bg-green-100' },
      'B+': { color: 'text-blue-600', bgColor: 'bg-blue-100' },
      'B': { color: 'text-blue-500', bgColor: 'bg-blue-100' },
      'C+': { color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
      'C': { color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
      'D': { color: 'text-orange-600', bgColor: 'bg-orange-100' },
      'F': { color: 'text-red-600', bgColor: 'bg-red-100' },
    };
    
    return gradeMap[grade as keyof typeof gradeMap] || gradeMap.C;
  },

  /**
   * Get activity type icon and color
   */
  getActivityTypeInfo: (action: string): { icon: string; color: string; bgColor: string } => {
    const actionMap: Record<string, { icon: string; color: string; bgColor: string }> = {
      'login': { icon: '🔐', color: 'text-green-600', bgColor: 'bg-green-100' },
      'logout': { icon: '🚪', color: 'text-blue-600', bgColor: 'bg-blue-100' },
      'logout_all_devices': { icon: '🔒', color: 'text-orange-600', bgColor: 'bg-orange-100' },
      'password_change': { icon: '🔑', color: 'text-purple-600', bgColor: 'bg-purple-100' },
      'password_reset': { icon: '🔄', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
      'session_terminated': { icon: '⛔', color: 'text-red-600', bgColor: 'bg-red-100' },
      'device_trust_changed': { icon: '📱', color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
    };
    
    return actionMap[action] || { icon: '📋', color: 'text-gray-600', bgColor: 'bg-gray-100' };
  },

  /**
   * Calculate security score color
   */
  getSecurityScoreColor: (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  },

  /**
   * Format time ago for security events
   */
  formatTimeAgo: (timestamp: string): string => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return time.toLocaleDateString();
  },

  /**
   * Handle security-specific errors
   */
  handleSecurityError: (error: any): string => {
    if (error?.response?.status === 401) {
      return 'Authentication required. Please login again.';
    }
    
    if (error?.response?.status === 403) {
      return 'Access denied. Insufficient permissions for security operations.';
    }
    
    if (error?.response?.status === 404) {
      return 'Security resource not found.';
    }
    
    if (error?.response?.status === 429) {
      return 'Too many security requests. Please wait before trying again.';
    }
    
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (error?.message) {
      return error.message;
    }
    
    return 'A security error occurred. Please try again.';
  },

  /**
   * Validate session ID format
   */
  isValidSessionId: (sessionId: string): boolean => {
    return /^[a-zA-Z0-9_-]+$/.test(sessionId);
  },

  /**
   * Validate device ID format
   */
  isValidDeviceId: (deviceId: string): boolean => {
    return /^[a-zA-Z0-9_-]+$/.test(deviceId);
  },

  /**
   * Get security recommendations based on assessment
   */
  getSecurityRecommendations: (assessment: ISecurityAssessment): Array<{ title: string; description: string; priority: string }> => {
    return assessment.recommendations.map((rec, index) => ({
      title: `Security Recommendation ${index + 1}`,
      description: rec,
      priority: assessment.risk_factors[index]?.severity || 'medium',
    }));
  },

  /**
   * Check if action requires confirmation
   */
  requiresConfirmation: (action: string): boolean => {
    const criticalActions = ['logout_all_devices', 'terminate_session', 'device_trust_changed'];
    return criticalActions.includes(action);
  },
};

export default securityAPI; 