// auth.api.ts - Comprehensive Authentication API

import { apiBaseUrl } from './config';

// Authentication Interfaces
export interface IRegisterData {
  full_name: string;
  email: string;
  phone_numbers: Array<{
    country: string;
    number: string;
  }>;
  password: string;
  agree_terms: boolean;
  role?: string[];
  meta?: {
    gender?: 'male' | 'female' | 'other';
    age?: string;
    age_group?: string;
    category?: string;
    [key: string]: any;
  };
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface IVerifyEmailData {
  email: string;
  otp: string;
}

export interface IResendVerificationData {
  email: string;
}

export interface IForgotPasswordData {
  email: string;
}

export interface IResetPasswordData {
  email: string;
  token: string;
  new_password: string;
}

export interface IRefreshTokenData {
  refresh_token: string;
}

export interface IChangePasswordData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface IUpdateProfileData {
  full_name?: string;
  phone_numbers?: Array<{
    country: string;
    number: string;
  }>;
  bio?: string;
  location?: string;
  age?: Date | string;
  
  // Social Profiles
  facebook_link?: string;
  instagram_link?: string;
  linkedin_link?: string;
  twitter_link?: string;
  youtube_link?: string;
  github_link?: string;
  portfolio_link?: string;
  
  // Education
  education_level?: string;
  institution_name?: string;
  field_of_study?: string;
  graduation_year?: number;
  skills?: string[];
  certifications?: Array<{
    name: string;
    issuer: string;
    year: number;
    url?: string;
  }>;
  
  user_image?: string;
}

// Response Interfaces
export interface IAuthResponse {
  success: boolean;
  message: string;
  data?: {
    id?: string;
    full_name?: string;
    email?: string;
    role?: string[];
    admin_role?: string;
    permissions?: string[];
    status?: string;
    email_verified?: boolean;
    profile_completed?: boolean;
    last_login?: string;
    created_at?: string;
  };
  token?: string;
  refresh_token?: string;
  expires_in?: number;
}

export interface ILoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      full_name: string;
      email: string;
      username?: string;
      user_image?: {
        upload_date?: string;
      };
      account_type?: string;
      email_verified: boolean;
      profile_completion?: number;
      is_online?: boolean;
      last_seen?: string;
      statistics?: {
        learning?: any;
        engagement?: any;
        social?: any;
        financial?: any;
        _id?: string;
      };
      preferences?: {
        notifications?: any;
        privacy?: any;
        accessibility?: any;
        content?: any;
        theme?: string;
        language?: string;
        currency?: string;
        timezone?: string;
        _id?: string;
      };
    };
    token: string;
    session_id: string;
    expires_in: string;
  };
}

export interface IOTPVerificationResponse {
  success: boolean;
  message: string;
  data?: {
    email_verified: boolean;
    verification_date: string;
  };
}

export interface IUserProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      _id: string;
      full_name: string;
      email: string;
      phone_numbers: Array<{
        country: string;
        number: string;
      }>;
      role: string[];
      status: string;
      email_verified: boolean;
      user_image?: string;
      bio?: string;
      location?: string;
      age?: string;
      
      // Social Profiles
      facebook_link?: string;
      instagram_link?: string;
      linkedin_link?: string;
      twitter_link?: string;
      youtube_link?: string;
      github_link?: string;
      portfolio_link?: string;
      
      // Education & Meta Data
      meta?: {
        education_level?: string;
        institution_name?: string;
        field_of_study?: string;
        graduation_year?: number;
        skills?: string[];
        certifications?: Array<{
          name: string;
          issuer: string;
          year: number;
          url?: string;
        }>;
        gender?: string;
        age_group?: string;
        category?: string;
        [key: string]: any;
      };
      
      created_at: string;
      updated_at: string;
      last_login?: string;
    };
  };
}

// OAuth Interfaces
export interface IOAuthProvider {
  provider: string;
  auth_url: string;
  display_name: string;
  icon?: string;
  enabled: boolean;
}

export interface IOAuthProvidersResponse {
  success: boolean;
  data: {
    providers: IOAuthProvider[];
    total_providers: number;
    enabled_providers: number;
  };
}

export interface IConnectedProvider {
  provider: string;
  provider_id: string;
  email?: string;
  display_name?: string;
  connected_at: string;
  last_used?: string;
}

export interface IConnectedProvidersResponse {
  success: boolean;
  data: {
    connected_providers: IConnectedProvider[];
    total_connected: number;
  };
}

export interface IOAuthStatsResponse {
  success: boolean;
  data: {
    total_oauth_users: number;
    provider_breakdown: Record<string, {
      count: number;
      percentage: number;
      growth_rate?: number;
    }>;
    monthly_signups: Array<{
      month: string;
      total: number;
      by_provider: Record<string, number>;
    }>;
    conversion_rates: Record<string, number>;
  };
}

// Meta Data Deletion Interfaces (for OAuth compliance)
export interface IMetaDataDeletionRequest {
  signed_request: string;
  user_id?: string;
  algorithm?: string;
}

export interface IMetaDataDeletionResponse {
  url: string;
  confirmation_code: string;
}

export interface IDataDeletionRequest {
  email: string;
  source: 'manual_request' | 'meta_callback' | 'admin_request';
  confirmation_code: string;
  user_id?: string;
  provider_data?: any;
}

export interface IDataDeletionStatus {
  success: boolean;
  message: string;
  data?: {
    request_id: string;
    confirmation_code: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    requested_at: string;
    processed_at?: string;
    completed_at?: string;
  };
}

// Authentication API URLs
export const authAPI = {
  // Base authentication endpoints
  base: `${apiBaseUrl}/auth`,
  
  // 1. Local Authentication (JWT)
  local: {
    register: `${apiBaseUrl}/auth/register`,
    verifyEmail: `${apiBaseUrl}/auth/verify-email`,
    resendVerification: `${apiBaseUrl}/auth/resend-verification`,
    login: `${apiBaseUrl}/auth/login`,
    refreshToken: `${apiBaseUrl}/auth/refresh-token`,
    logout: `${apiBaseUrl}/auth/logout`,
    forgotPassword: `${apiBaseUrl}/auth/forgot-password`,
    resetPassword: `${apiBaseUrl}/auth/reset-password`,
    changePassword: `${apiBaseUrl}/auth/change-password`,
    verifyToken: `${apiBaseUrl}/auth/verify-token`,
  },
  
  // 2. OAuth Social Login
  oauth: {
    base: `${apiBaseUrl}/auth/oauth`,
    providers: `${apiBaseUrl}/auth/oauth/providers`,
    
    // OAuth flow endpoints
    google: `${apiBaseUrl}/auth/oauth/google`,
    googleCallback: `${apiBaseUrl}/auth/oauth/google/callback`,
    
    facebook: `${apiBaseUrl}/auth/oauth/facebook`,
    facebookCallback: `${apiBaseUrl}/auth/oauth/facebook/callback`,
    
    github: `${apiBaseUrl}/auth/oauth/github`,
    githubCallback: `${apiBaseUrl}/auth/oauth/github/callback`,
    
    linkedin: `${apiBaseUrl}/auth/oauth/linkedin`,
    linkedinCallback: `${apiBaseUrl}/auth/oauth/linkedin/callback`,
    
    microsoft: `${apiBaseUrl}/auth/oauth/microsoft`,
    microsoftCallback: `${apiBaseUrl}/auth/oauth/microsoft/callback`,
    
    apple: `${apiBaseUrl}/auth/oauth/apple`,
    appleCallback: `${apiBaseUrl}/auth/oauth/apple/callback`,
    
    // OAuth management
    success: `${apiBaseUrl}/auth/oauth/success`,
    failure: `${apiBaseUrl}/auth/oauth/failure`,
    connected: `${apiBaseUrl}/auth/oauth/connected`,
    
    disconnect: (provider: string): string => {
      if (!provider) throw new Error('Provider is required');
      return `${apiBaseUrl}/auth/oauth/disconnect/${provider}`;
    },
    
    link: (provider: string): string => {
      if (!provider) throw new Error('Provider is required');
      return `${apiBaseUrl}/auth/oauth/link/${provider}`;
    },
    
    // OAuth statistics (Admin only)
    stats: `${apiBaseUrl}/auth/oauth/stats`,
  },
  
  // 3. User Profile Management
  profile: {
    get: `${apiBaseUrl}/auth/profile`,
    update: `${apiBaseUrl}/auth/profile/update`,
    uploadImage: `${apiBaseUrl}/auth/profile/upload-image`,
    deleteAccount: `${apiBaseUrl}/auth/profile/delete-account`,
    
    // Meta OAuth Data Deletion Compliance
    metaDataDeletion: `${apiBaseUrl}/auth/meta/data-deletion`,
    processDataDeletionRequest: `${apiBaseUrl}/auth/data-deletion/process`,
    
    // Get user by ID (Admin/Public)
    getById: (userId: string): string => {
      if (!userId) throw new Error('User ID is required');
      return `${apiBaseUrl}/auth/user/${userId}`;
    },
    
    // Get user by email (Admin only)
    getByEmail: (email: string): string => {
      if (!email) throw new Error('Email is required');
      return `${apiBaseUrl}/auth/user/email/${encodeURIComponent(email)}`;
    },
  },
  
  // 4. User Management (Admin)
  admin: {
    getAllUsers: (options: {
      page?: number;
      limit?: number;
      role?: string;
      status?: string;
      search?: string;
      sort_by?: string;
      sort_order?: 'asc' | 'desc';
    } = {}): string => {
      const { page = 1, limit = 10, role = '', status = '', search = '', sort_by = 'created_at', sort_order = 'desc' } = options;
      const queryParams = new URLSearchParams();
      queryParams.append('page', String(page));
      queryParams.append('limit', String(limit));
      if (role) queryParams.append('role', role);
      if (status) queryParams.append('status', status);
      if (search) queryParams.append('search', search);
      queryParams.append('sort_by', sort_by);
      queryParams.append('sort_order', sort_order);
      return `${apiBaseUrl}/auth/admin/users?${queryParams.toString()}`;
    },
    
    createUser: `${apiBaseUrl}/auth/admin/users/create`,
    
    updateUser: (userId: string): string => {
      if (!userId) throw new Error('User ID is required');
      return `${apiBaseUrl}/auth/admin/users/${userId}/update`;
    },
    
    deleteUser: (userId: string): string => {
      if (!userId) throw new Error('User ID is required');
      return `${apiBaseUrl}/auth/admin/users/${userId}/delete`;
    },
    
    toggleUserStatus: (userId: string): string => {
      if (!userId) throw new Error('User ID is required');
      return `${apiBaseUrl}/auth/admin/users/${userId}/toggle-status`;
    },
    
    resetUserPassword: (userId: string): string => {
      if (!userId) throw new Error('User ID is required');
      return `${apiBaseUrl}/auth/admin/users/${userId}/reset-password`;
    },
    
    impersonateUser: (userId: string): string => {
      if (!userId) throw new Error('User ID is required');
      return `${apiBaseUrl}/auth/admin/users/${userId}/impersonate`;
    },
    
    getUserSessions: (userId: string): string => {
      if (!userId) throw new Error('User ID is required');
      return `${apiBaseUrl}/auth/admin/users/${userId}/sessions`;
    },
    
    revokeUserSessions: (userId: string): string => {
      if (!userId) throw new Error('User ID is required');
      return `${apiBaseUrl}/auth/admin/users/${userId}/revoke-sessions`;
    },
    
    // Bulk operations
    bulkUpdateUsers: `${apiBaseUrl}/auth/admin/users/bulk-update`,
    bulkDeleteUsers: `${apiBaseUrl}/auth/admin/users/bulk-delete`,
    exportUsers: `${apiBaseUrl}/auth/admin/users/export`,
    importUsers: `${apiBaseUrl}/auth/admin/users/import`,
    
    // User analytics
    getUserStats: `${apiBaseUrl}/auth/admin/users/stats`,
    getUserActivity: (userId: string, options: {
      start_date?: string;
      end_date?: string;
      limit?: number;
    } = {}): string => {
      if (!userId) throw new Error('User ID is required');
      const queryParams = new URLSearchParams();
      if (options.start_date) queryParams.append('start_date', options.start_date);
      if (options.end_date) queryParams.append('end_date', options.end_date);
      if (options.limit) queryParams.append('limit', String(options.limit));
      return `${apiBaseUrl}/auth/admin/users/${userId}/activity?${queryParams.toString()}`;
    },
  },
  
  // 5. Session Management
  sessions: {
    getCurrentSession: `${apiBaseUrl}/auth/sessions/current`,
    getAllSessions: `${apiBaseUrl}/auth/sessions/all`,
    revokeSession: (sessionId: string): string => {
      if (!sessionId) throw new Error('Session ID is required');
      return `${apiBaseUrl}/auth/sessions/${sessionId}/revoke`;
    },
    revokeAllSessions: `${apiBaseUrl}/auth/sessions/revoke-all`,
    revokeOtherSessions: `${apiBaseUrl}/auth/sessions/revoke-others`,
  },
  
  // 6. Security & Audit
  security: {
    enable2FA: `${apiBaseUrl}/auth/security/2fa/enable`,
    disable2FA: `${apiBaseUrl}/auth/security/2fa/disable`,
    verify2FA: `${apiBaseUrl}/auth/security/2fa/verify`,
    generate2FABackupCodes: `${apiBaseUrl}/auth/security/2fa/backup-codes`,
    
    getSecurityLog: (options: {
      page?: number;
      limit?: number;
      event_type?: string;
      start_date?: string;
      end_date?: string;
    } = {}): string => {
      const { page = 1, limit = 20, event_type = '', start_date = '', end_date = '' } = options;
      const queryParams = new URLSearchParams();
      queryParams.append('page', String(page));
      queryParams.append('limit', String(limit));
      if (event_type) queryParams.append('event_type', event_type);
      if (start_date) queryParams.append('start_date', start_date);
      if (end_date) queryParams.append('end_date', end_date);
      return `${apiBaseUrl}/auth/security/audit-log?${queryParams.toString()}`;
    },
    
    reportSuspiciousActivity: `${apiBaseUrl}/auth/security/report-suspicious`,
    lockAccount: `${apiBaseUrl}/auth/security/lock-account`,
    unlockAccount: `${apiBaseUrl}/auth/security/unlock-account`,
  },
  
  // 7. Email & Notifications
  notifications: {
    getPreferences: `${apiBaseUrl}/auth/notifications/preferences`,
    updatePreferences: `${apiBaseUrl}/auth/notifications/preferences/update`,
    testEmail: `${apiBaseUrl}/auth/notifications/test-email`,
    unsubscribe: (token: string): string => {
      if (!token) throw new Error('Unsubscribe token is required');
      return `${apiBaseUrl}/auth/notifications/unsubscribe/${token}`;
    },
  },
};

// Authentication Utility Functions
export const authUtils = {
  /**
   * Check if user is authenticated by verifying token
   */
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('token');
    return !!token && !authUtils.isTokenExpired(token);
  },

  /**
   * Check if JWT token is expired
   */
  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  },

  /**
   * Get user data from JWT token
   */
  getUserFromToken: (token?: string): any => {
    try {
      const authToken = token || localStorage.getItem('token');
      if (!authToken) return null;
      
      const payload = JSON.parse(atob(authToken.split('.')[1]));
      return payload;
    } catch {
      return null;
    }
  },

  /**
   * Store authentication tokens
   */
  storeTokens: (tokens: { token: string; refresh_token?: string; expires_in?: number }): void => {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('token', tokens.token);
    if (tokens.refresh_token) {
      localStorage.setItem('refresh_token', tokens.refresh_token);
    }
    if (tokens.expires_in) {
      const expiryTime = Date.now() + (tokens.expires_in * 1000);
      localStorage.setItem('token_expiry', String(expiryTime));
    }
  },

  /**
   * Clear authentication tokens
   */
  clearTokens: (): void => {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expiry');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
  },

  /**
   * Get authorization headers for API requests
   */
  getAuthHeaders: (): Record<string, string> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  },

  /**
   * Validate email format
   */
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate password strength
   */
  validatePassword: (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Generate OAuth login URL
   */
  getOAuthLoginUrl: (provider: string, redirectUrl?: string): string => {
    const baseUrl = authAPI.oauth[provider as keyof typeof authAPI.oauth];
    if (!baseUrl || typeof baseUrl !== 'string') {
      throw new Error(`Unsupported OAuth provider: ${provider}`);
    }
    
    if (redirectUrl) {
      return `${baseUrl}?redirect_url=${encodeURIComponent(redirectUrl)}`;
    }
    
    return baseUrl;
  },

  /**
   * Handle OAuth popup window
   */
  openOAuthPopup: (provider: string, onSuccess?: (data: any) => void, onError?: (error: any) => void): void => {
    const url = authUtils.getOAuthLoginUrl(provider);
    const popup = window.open(url, 'oauth', 'width=500,height=600,scrollbars=yes,resizable=yes');
    
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed);
        // Check for success/failure in localStorage or postMessage
        const result = localStorage.getItem('oauth_result');
        if (result) {
          localStorage.removeItem('oauth_result');
          const data = JSON.parse(result);
          if (data.success) {
            onSuccess?.(data);
          } else {
            onError?.(data);
          }
        }
      }
    }, 1000);
  },

  /**
   * Format user role for display
   */
  formatUserRole: (roles: string[]): string => {
    if (!roles || roles.length === 0) return 'User';
    
    const roleMap: Record<string, string> = {
      'admin': 'Administrator',
      'instructor': 'Instructor',
      'student': 'Student',
      'corporate': 'Corporate User',
      'moderator': 'Moderator'
    };
    
    const primaryRole = roles[0];
    return roleMap[primaryRole] || primaryRole.charAt(0).toUpperCase() + primaryRole.slice(1);
  },

  /**
   * Check if user has specific role
   */
  hasRole: (userRoles: string[], requiredRole: string): boolean => {
    return userRoles.includes(requiredRole);
  },

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole: (userRoles: string[], requiredRoles: string[]): boolean => {
    return requiredRoles.some(role => userRoles.includes(role));
  },

  /**
   * Format phone number for display
   */
  formatPhoneNumber: (phoneNumbers: Array<{ country: string; number: string }>): string => {
    if (!phoneNumbers || phoneNumbers.length === 0) return '';
    const primary = phoneNumbers[0];
    return `${primary.country} ${primary.number}`;
  },

  /**
   * Handle API authentication errors
   */
  handleAuthError: (error: any): string => {
    if (error?.response?.status === 401) {
      authUtils.clearTokens();
      window.location.href = '/login';
      return 'Session expired. Please login again.';
    }
    
    if (error?.response?.status === 403) {
      return 'Access denied. You do not have permission to perform this action.';
    }
    
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (error?.message) {
      return error.message;
    }
    
    return 'An authentication error occurred. Please try again.';
  }
};

export default authAPI; 