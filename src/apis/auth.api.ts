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
  password?: string;
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
  invalidateAllSessions?: boolean;
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

// 🔐 Multi-Factor Authentication (MFA) Interfaces

export interface IMFASetupTOTPData {
  // No data required for initial setup
}

export interface IMFASetupTOTPVerifyData {
  code: string;
}

export interface IMFASetupSMSData {
  phone_number: string;
}

export interface IMFASetupSMSVerifyData {
  code: string;
}

export interface IMFAVerifyData {
  user_id: string;
  code?: string;
  backup_code?: string;
}

export interface IMFADisableData {
  password: string;
  code: string;
}

export interface IMFARegenerateBackupCodesData {
  password: string;
}

export interface IMFARecoveryRequestData {
  email: string;
  reason: string;
}

export interface IMFASendSMSData {
  user_id: string;
}

export interface IMFACompleteMFALoginData {
  user_id: string;
  verified: boolean;
}

// MFA Response Interfaces
export interface IMFASetupTOTPResponse {
  success: boolean;
  message: string;
  data: {
    secret: string;
    manual_entry_key: string;
    qr_code_url?: string;
    backup_codes: string[] | null;
    instructions: string[];
  };
}

export interface IMFASetupVerifyResponse {
  success: boolean;
  message: string;
  data: {
    backup_codes: string[];
    setup_date: string;
    phone_number?: string;
    warning: string;
  };
}

export interface IMFAStatusResponse {
  success: boolean;
  message: string;
  data: {
    enabled: boolean;
    method: 'totp' | 'sms' | null;
    setup_date?: string;
    phone_number?: string;
    backup_codes_count: number;
    last_regenerated?: string;
  };
}

export interface IMFAVerifyResponse {
  success: boolean;
  message: string;
  data: {
    verified: boolean;
    backup_code_used: boolean;
    remaining_backup_codes: number;
    warning?: string;
  };
}

export interface IMFADisableResponse {
  success: boolean;
  message: string;
  data: {
    disabled_date: string;
  };
}

export interface IMFABackupCodesResponse {
  success: boolean;
  message: string;
  data: {
    backup_codes: string[];
    regenerated_date: string;
    warning: string;
  };
}

export interface IMFABackupCodesCountResponse {
  success: boolean;
  message: string;
  data: {
    count: number;
    mfa_enabled: boolean;
    warning?: string;
  };
}

export interface IMFARecoveryResponse {
  success: boolean;
  message: string;
  data: {
    dev_recovery_token?: string;
  };
}

export interface IMFASendSMSResponse {
  success: boolean;
  message: string;
  data: {
    phone_number: string;
    expires_in_minutes: number;
    dev_code?: string;
  };
}

export interface IMFALoginRequiredResponse {
  success: boolean;
  message: string;
  requires_mfa: true;
  mfa_method: 'totp' | 'sms';
  data: {
    user_id: string;
    temp_session: boolean;
    phone_hint?: string;
  };
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

// 🔒 Account Lockout Management System Interfaces
export interface ILockedAccount {
  id: string;
  full_name: string;
  email: string;
  failed_login_attempts: number;
  password_change_attempts: number;
  lockout_reason: 'failed_login_attempts' | 'password_change_attempts' | 'admin_lock';
  locked_until: string;
  remaining_minutes: number;
  remaining_time_formatted: string;
  created_at: string;
  last_login?: string;
}

export interface ILockoutStatistics {
  current_status: {
    currently_locked: number;
    locked_last_24h: number;
    locked_last_week: number;
  };
  lockout_reasons: {
    failed_login_attempts: number;
    password_change_attempts: number;
    admin_lock: number;
  };
  attempt_statistics: {
    avg_failed_login_attempts: number;
    max_failed_login_attempts: number;
    users_with_failed_logins: number;
    avg_password_change_attempts: number;
    max_password_change_attempts: number;
    users_with_failed_password_changes: number;
  };
  lockout_levels: {
    level_1: string;
    level_2: string;
    level_3: string;
    level_4: string;
  };
}

export interface ILockoutLevel {
  attempts: number;
  duration: string;
  duration_minutes: number;
}

export interface ILockoutInfo {
  current_attempts: number;
  next_lockout_duration: string;
  lockout_levels: {
    [key: string]: string;
  };
}

export interface IUnlockAccountRequest {
  resetAttempts?: boolean;
}

export interface IUnlockAllAccountsRequest {
  resetAttempts?: boolean;
}

// Account Lockout Response Interfaces
export interface ILockedAccountsResponse {
  success: boolean;
  message: string;
  data: {
    total_locked: number;
    accounts: ILockedAccount[];
  };
}

export interface IUnlockAccountResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      full_name: string;
      unlocked_at: string;
      attempts_reset: boolean;
    };
    previous_state: {
      locked_until: string;
      failed_login_attempts: number;
      password_change_attempts: number;
      lockout_reason: string;
    };
  };
}

export interface IUnlockAllAccountsResponse {
  success: boolean;
  message: string;
  data: {
    unlocked_count: number;
    attempts_reset: boolean;
    accounts: Array<{
      id: string;
      email: string;
      full_name: string;
      was_locked_until: string;
      lockout_reason: string;
      failed_login_attempts: number;
      password_change_attempts: number;
    }>;
  };
}

export interface ILockoutStatsResponse {
  success: boolean;
  message: string;
  data: ILockoutStatistics;
}

export interface IPasswordChangeFailureResponse {
  success: false;
  message: string;
  attempts_remaining: number;
  lockout_info: ILockoutInfo;
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
    quickLogin: `${apiBaseUrl}/auth/quick-login`, // Add this new endpoint
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

  // 🔐 3. Multi-Factor Authentication (MFA)
  mfa: {
    // MFA Status & Management
    status: `${apiBaseUrl}/auth/mfa/status`,
    disable: `${apiBaseUrl}/auth/mfa/disable`,
    
    // TOTP Setup
    setupTOTP: `${apiBaseUrl}/auth/mfa/setup/totp`,
    verifyTOTPSetup: `${apiBaseUrl}/auth/mfa/setup/totp/verify`,
    
    // SMS Setup
    setupSMS: `${apiBaseUrl}/auth/mfa/setup/sms`,
    verifySMSSetup: `${apiBaseUrl}/auth/mfa/setup/sms/verify`,
    
    // MFA Login Flow
    verify: `${apiBaseUrl}/auth/mfa/verify`,
    sendSMS: `${apiBaseUrl}/auth/mfa/send-sms`,
    completeMFALogin: `${apiBaseUrl}/auth/complete-mfa-login`,
    
    // Backup Codes
    backupCodes: {
      regenerate: `${apiBaseUrl}/auth/mfa/backup-codes/regenerate`,
      count: `${apiBaseUrl}/auth/mfa/backup-codes/count`,
    },
    
    // MFA Recovery
    recovery: {
      request: `${apiBaseUrl}/auth/mfa/recovery/request`,
    },
  },
  
  // 4. User Profile Management
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
  
  // 5. User Management (Admin)
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
    
    // 🔒 Account Lockout Management (Admin/Super Admin only)
    getLockedAccounts: `${apiBaseUrl}/auth/locked-accounts`,
    unlockAccount: (userId: string): string => {
      if (!userId) throw new Error('User ID is required');
      return `${apiBaseUrl}/auth/unlock-account/${userId}`;
    },
    unlockAllAccounts: `${apiBaseUrl}/auth/unlock-all-accounts`,
    getLockoutStats: `${apiBaseUrl}/auth/lockout-stats`,
  },
  
  // 6. Session Management
  sessions: {
    getCurrentSession: `${apiBaseUrl}/auth/sessions/current`,
    getAllSessions: `${apiBaseUrl}/auth/sessions/all`,
    revokeSession: (sessionId: string): string => {
      if (!sessionId) throw new Error('Session ID is required');
      return `${apiBaseUrl}/auth/sessions/${sessionId}/revoke`;
    },
    revokeAllSessions: `${apiBaseUrl}/auth/sessions/revoke-all`,
    revokeOtherSessions: `${apiBaseUrl}/auth/sessions/revoke-others`,
    logoutAllDevices: `${apiBaseUrl}/auth/logout-all-devices`,
  },
  
  // 7. Security & Audit
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
  
  // 8. Email & Notifications
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
  },

  // 🔐 Multi-Factor Authentication (MFA) Utility Functions
  
  /**
   * Get MFA status for current user
   */
  getMFAStatus: async (): Promise<IMFAStatusResponse> => {
    try {
      const response = await fetch(authAPI.mfa.status, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authUtils.getAuthHeaders()
        }
      });
      return response.json();
    } catch (error: any) {
      return {
        success: false,
        message: authUtils.handleAuthError(error),
        data: {} as any
      };
    }
  },

  /**
   * Setup TOTP (Time-based One-Time Password) authentication
   */
  setupTOTP: async (): Promise<IMFASetupTOTPResponse> => {
    try {
      const response = await fetch(authAPI.mfa.setupTOTP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authUtils.getAuthHeaders()
        }
      });
      return response.json();
    } catch (error: any) {
      return {
        success: false,
        message: authUtils.handleAuthError(error),
        data: {} as any
      };
    }
  },

  /**
   * Verify TOTP setup with authenticator app code
   */
  verifyTOTPSetup: async (code: string): Promise<IMFASetupVerifyResponse> => {
    try {
      const response = await fetch(authAPI.mfa.verifyTOTPSetup, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authUtils.getAuthHeaders()
        },
        body: JSON.stringify({ code })
      });
      return response.json();
    } catch (error: any) {
      return {
        success: false,
        message: authUtils.handleAuthError(error),
        data: {} as any
      };
    }
  },

  /**
   * Setup SMS-based MFA
   */
  setupSMS: async (phoneNumber: string): Promise<IMFASendSMSResponse> => {
    try {
      const response = await fetch(authAPI.mfa.setupSMS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authUtils.getAuthHeaders()
        },
        body: JSON.stringify({ phone_number: phoneNumber })
      });
      return response.json();
    } catch (error: any) {
      return {
        success: false,
        message: authUtils.handleAuthError(error),
        data: {} as any
      };
    }
  },

  /**
   * Verify SMS setup with received code
   */
  verifySMSSetup: async (code: string): Promise<IMFASetupVerifyResponse> => {
    try {
      const response = await fetch(authAPI.mfa.verifySMSSetup, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authUtils.getAuthHeaders()
        },
        body: JSON.stringify({ code })
      });
      return response.json();
    } catch (error: any) {
      return {
        success: false,
        message: authUtils.handleAuthError(error),
        data: {} as any
      };
    }
  },

  /**
   * Send SMS code for MFA login
   */
  sendMFASMS: async (userId: string): Promise<IMFASendSMSResponse> => {
    try {
      const response = await fetch(authAPI.mfa.sendSMS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId })
      });
      return response.json();
    } catch (error: any) {
      return {
        success: false,
        message: authUtils.handleAuthError(error),
        data: {} as any
      };
    }
  },

  /**
   * Verify MFA code during login (TOTP or SMS)
   */
  verifyMFA: async (userId: string, code?: string, backupCode?: string): Promise<IMFAVerifyResponse> => {
    try {
      const response = await fetch(authAPI.mfa.verify, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          code,
          backup_code: backupCode
        })
      });
      return response.json();
    } catch (error: any) {
      return {
        success: false,
        message: authUtils.handleAuthError(error),
        data: {} as any
      };
    }
  },

  /**
   * Complete MFA login after verification
   */
  completeMFALogin: async (userId: string, verified: boolean): Promise<ILoginResponse> => {
    try {
      const response = await fetch(authAPI.mfa.completeMFALogin, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          verified
        })
      });
      return response.json();
    } catch (error: any) {
      return {
        success: false,
        message: authUtils.handleAuthError(error),
        data: {} as any
      };
    }
  },

  /**
   * Disable MFA for current user
   */
  disableMFA: async (password: string, code: string): Promise<IMFADisableResponse> => {
    try {
      const response = await fetch(authAPI.mfa.disable, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authUtils.getAuthHeaders()
        },
        body: JSON.stringify({ password, code })
      });
      return response.json();
    } catch (error: any) {
      return {
        success: false,
        message: authUtils.handleAuthError(error),
        data: {} as any
      };
    }
  },

  /**
   * Regenerate backup codes
   */
  regenerateBackupCodes: async (password: string): Promise<IMFABackupCodesResponse> => {
    try {
      const response = await fetch(authAPI.mfa.backupCodes.regenerate, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authUtils.getAuthHeaders()
        },
        body: JSON.stringify({ password })
      });
      return response.json();
    } catch (error: any) {
      return {
        success: false,
        message: authUtils.handleAuthError(error),
        data: {} as any
      };
    }
  },

  /**
   * Get backup codes count
   */
  getBackupCodesCount: async (): Promise<IMFABackupCodesCountResponse> => {
    try {
      const response = await fetch(authAPI.mfa.backupCodes.count, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authUtils.getAuthHeaders()
        }
      });
      return response.json();
    } catch (error: any) {
      return {
        success: false,
        message: authUtils.handleAuthError(error),
        data: {} as any
      };
    }
  },

  /**
   * Request MFA recovery
   */
  requestMFARecovery: async (email: string, reason: string): Promise<IMFARecoveryResponse> => {
    try {
      const response = await fetch(authAPI.mfa.recovery.request, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, reason })
      });
      return response.json();
    } catch (error: any) {
      return {
        success: false,
        message: authUtils.handleAuthError(error),
        data: {} as any
      };
    }
  },

  /**
   * Validate MFA code format (6 digits)
   */
  isValidMFACode: (code: string): boolean => {
    return /^\d{6}$/.test(code);
  },

  /**
   * Validate backup code format
   */
  isValidBackupCode: (code: string): boolean => {
    return /^[A-Z0-9]{16}$/.test(code);
  },

  /**
   * Format backup codes for display
   */
  formatBackupCodes: (codes: string[]): string[] => {
    return codes.map(code => {
      // Insert spaces every 4 characters for readability
      return code.replace(/(.{4})/g, '$1 ').trim();
    });
  },

  /**
   * Generate QR code URL for TOTP setup
   */
  generateTOTPQRCodeUrl: (secret: string, email: string, issuer: string = 'Medh'): string => {
    const label = encodeURIComponent(`${issuer}:${email}`);
    const params = new URLSearchParams({
      secret,
      issuer,
    });
    return `otpauth://totp/${label}?${params.toString()}`;
  },

  /**
   * Check if MFA is required for login response
   */
  isMFARequired: (response: any): response is IMFALoginRequiredResponse => {
    return response && response.requires_mfa === true;
  },

  /**
   * Get MFA method display name
   */
  getMFAMethodDisplayName: (method: 'totp' | 'sms' | null): string => {
    switch (method) {
      case 'totp':
        return 'Authenticator App (TOTP)';
      case 'sms':
        return 'SMS Text Message';
      default:
        return 'Not Enabled';
    }
  },

  /**
   * Get MFA setup instructions
   */
  getMFASetupInstructions: (method: 'totp' | 'sms'): string[] => {
    switch (method) {
      case 'totp':
        return [
          'Install an authenticator app (Google Authenticator, Authy, etc.)',
          'Scan the QR code or manually enter the secret key',
          'Enter the 6-digit code from your app to complete setup',
          'Save your backup codes in a secure location'
        ];
      case 'sms':
        return [
          'Enter your phone number',
          'Wait for the SMS verification code',
          'Enter the 6-digit code to complete setup',
          'Save your backup codes in a secure location'
        ];
      default:
        return [];
    }
  },

  // 🔒 Account Lockout Management Utilities
  
  /**
   * Get all locked accounts
   */
  getLockedAccounts: async (): Promise<ILockedAccountsResponse> => {
    const response = await fetch(authAPI.admin.getLockedAccounts, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authUtils.getAuthHeaders()
      }
    });
    return response.json();
  },

  /**
   * Unlock a specific account
   */
  unlockAccount: async (userId: string, resetAttempts: boolean = true): Promise<IUnlockAccountResponse> => {
    const response = await fetch(authAPI.admin.unlockAccount(userId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authUtils.getAuthHeaders()
      },
      body: JSON.stringify({ resetAttempts })
    });
    return response.json();
  },

  /**
   * Unlock all locked accounts (Super Admin only)
   */
  unlockAllAccounts: async (resetAttempts: boolean = true): Promise<IUnlockAllAccountsResponse> => {
    const response = await fetch(authAPI.admin.unlockAllAccounts, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authUtils.getAuthHeaders()
      },
      body: JSON.stringify({ resetAttempts })
    });
    return response.json();
  },

  /**
   * Get lockout statistics
   */
  getLockoutStats: async (): Promise<ILockoutStatsResponse> => {
    const response = await fetch(authAPI.admin.getLockoutStats, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authUtils.getAuthHeaders()
      }
    });
    return response.json();
  },

  /**
   * Format remaining lockout time
   */
  formatRemainingTime: (remainingMinutes: number): string => {
    if (remainingMinutes <= 0) return 'Unlocked';
    
    const hours = Math.floor(remainingMinutes / 60);
    const minutes = remainingMinutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  },

  /**
   * Get lockout level information
   */
  getLockoutLevels: (): ILockoutLevel[] => {
    return [
      { attempts: 3, duration: '1 minute', duration_minutes: 1 },
      { attempts: 4, duration: '5 minutes', duration_minutes: 5 },
      { attempts: 5, duration: '10 minutes', duration_minutes: 10 },
      { attempts: 6, duration: '30 minutes', duration_minutes: 30 }
    ];
  },

  /**
   * Calculate next lockout duration based on attempts
   */
  getNextLockoutDuration: (attempts: number): string => {
    const levels = authUtils.getLockoutLevels();
    const level = levels.find(l => l.attempts === attempts + 1);
    return level ? level.duration : '30 minutes';
  },

  /**
   * Check if account is currently locked
   */
  isAccountLocked: (lockedUntil?: string): boolean => {
    if (!lockedUntil) return false;
    return new Date(lockedUntil) > new Date();
  },

  /**
   * Get lockout reason display text
   */
  getLockoutReasonText: (reason: string): string => {
    const reasonMap: Record<string, string> = {
      'failed_login_attempts': 'Failed Login Attempts',
      'password_change_attempts': 'Failed Password Change Attempts',
      'admin_lock': 'Manually Locked by Admin'
    };
    
    return reasonMap[reason] || 'Unknown Reason';
  },

  /**
   * Handle lockout-specific errors
   */
  handleLockoutError: (error: any): string => {
    if (error?.response?.status === 423) {
      const data = error.response.data;
      if (data?.lockout_info) {
        return `Account is locked. ${data.attempts_remaining} attempts remaining. Next lockout: ${data.lockout_info.next_lockout_duration}`;
      }
      return 'Account is temporarily locked due to security reasons.';
    }
    
    return authUtils.handleAuthError(error);
  },

  /**
   * Calculate lockout severity level
   */
  getLockoutSeverity: (attempts: number): 'low' | 'medium' | 'high' | 'critical' => {
    if (attempts <= 2) return 'low';
    if (attempts <= 4) return 'medium';
    if (attempts <= 5) return 'high';
    return 'critical';
  },

  /**
   * Get lockout severity color
   */
  getLockoutSeverityColor: (attempts: number): string => {
    const severity = authUtils.getLockoutSeverity(attempts);
    const colorMap = {
      'low': '#10B981',     // green
      'medium': '#F59E0B',  // yellow
      'high': '#EF4444',    // red
      'critical': '#DC2626' // dark red
    };
    
    return colorMap[severity];
  },

  /**
   * Logout from all devices/sessions
   */
  logoutAllDevices: async (): Promise<{ success: boolean; message: string; data?: any }> => {
    try {
      const response = await fetch(authAPI.sessions.logoutAllDevices, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authUtils.getAuthHeaders()
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Clear local tokens since we're logging out from all devices
        authUtils.clearTokens();
      }
      
      return result;
    } catch (error: any) {
      return {
        success: false,
        message: authUtils.handleAuthError(error)
      };
    }
  }
};

export default authAPI; 