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

// Enhanced OAuth Management Interfaces
export interface IOAuthAccountLinkRequest {
  provider: 'google' | 'facebook' | 'github' | 'linkedin' | 'microsoft' | 'apple';
  redirect_uri?: string;
}

export interface IOAuthAccountLinkResponse {
  success: boolean;
  message: string;
  data: {
    auth_url: string;
    provider: string;
    linking_mode: boolean;
  };
}

export interface IOAuthAccountUnlinkRequest {
  provider: 'google' | 'facebook' | 'github' | 'linkedin' | 'microsoft' | 'apple';
}

export interface IOAuthAccountUnlinkResponse {
  success: boolean;
  message: string;
  data: {
    provider: string;
    unlinked_at: string;
    remaining_oauth_providers: string[];
    has_password: boolean;
  };
}

export interface IOAuthConnectedProvider {
  provider: string;
  provider_id: string;
  email?: string;
  display_name?: string;
  connected_at: string;
  last_used?: string;
  profile_picture?: string;
}

export interface IOAuthConnectedProvidersResponse {
  success: boolean;
  data: {
    connected_providers: IOAuthConnectedProvider[];
    unconnected_providers: string[];
    total_connected: number;
    has_password: boolean;
  };
}

// Enhanced Email Synchronization Interfaces
export interface IOAuthEmailSyncRequest {
  provider: 'google' | 'facebook' | 'github' | 'linkedin' | 'microsoft' | 'apple';
  action: 'use_oauth_email' | 'verify_current_email' | 'add_alternative_email';
}

export interface IOAuthEmailSyncResponse {
  success: boolean;
  message: string;
  data: {
    provider: string;
    action: string;
    oauth_email: string;
    current_email: string;
    email_verified: boolean;
    changes: string[];
    updated: boolean;
  };
}

// Account Merging Interfaces
export interface IOAuthMergeSuggestion {
  type: 'email_verification' | 'profile_enhancement' | 'account_consolidation';
  suggested_providers: string[];
  risk_level: 'low' | 'medium' | 'high';
  description: string;
  action: string;
}

export interface IOAuthMergeSuggestionsResponse {
  success: boolean;
  data: {
    suggestions: IOAuthMergeSuggestion[];
    suggestion_count: number;
  };
}

// Enhanced OAuth Login/Signup Response
export interface IOAuthUserData {
  id: string;
  email: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  profile_picture?: string;
  email_verified: boolean;
  provider: string;
  provider_id: string;
  role: string[];
  permissions?: string[];
  access_token: string;
  refresh_token?: string;
  session_id?: string;
  account_merged?: boolean;
  profile_updated?: boolean;
  email_conflicts?: Array<{
    oauth_email: string;
    user_email: string;
    provider: string;
  }>;
  // Quick login key fields for enhanced OAuth
  quick_login_key?: string;
  quick_login_key_id?: string;
  is_new_user?: boolean;
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
    
    // Account linking and unlinking
    link: (provider: string): string => {
      if (!provider) throw new Error('Provider is required');
      return `${apiBaseUrl}/auth/oauth/link/${provider}`;
    },
    
    unlink: (provider: string): string => {
      if (!provider) throw new Error('Provider is required');
      return `${apiBaseUrl}/auth/oauth/unlink/${provider}`;
    },
    
    // Legacy disconnect endpoint (for backward compatibility)
    disconnect: (provider: string): string => {
      if (!provider) throw new Error('Provider is required');
      return `${apiBaseUrl}/auth/oauth/disconnect/${provider}`;
    },
    
    // Enhanced email synchronization
    syncEmail: `${apiBaseUrl}/auth/oauth/sync-email`,
    mergeSuggestions: `${apiBaseUrl}/auth/oauth/merge-suggestions`,
    
    // OAuth statistics (Admin only)
    stats: `${apiBaseUrl}/auth/oauth/stats`,
  },

  // 🔐 3. Multi-Factor Authentication (MFA) - Enhanced 2024
  mfa: {
    // MFA Status & Management
    status: `${apiBaseUrl}/auth/mfa/status`,
    disable: `${apiBaseUrl}/auth/mfa/disable`,
    
    // TOTP Setup - Enhanced
    setupTOTP: `${apiBaseUrl}/auth/mfa/setup/totp`,
    verifyTOTPSetup: `${apiBaseUrl}/auth/mfa/setup/totp/verify`,
    
    // SMS Setup - Enhanced
    setupSMS: `${apiBaseUrl}/auth/mfa/setup/sms`,
    verifySMSSetup: `${apiBaseUrl}/auth/mfa/setup/sms/verify`,
    
    // MFA Login Flow - Enhanced
    verify: `${apiBaseUrl}/auth/mfa/verify`,
    sendSMS: `${apiBaseUrl}/auth/mfa/send-sms`,
    completeMFALogin: `${apiBaseUrl}/auth/complete-mfa-login`,
    
    // Backup Codes - Enhanced
    backupCodes: {
      regenerate: `${apiBaseUrl}/auth/mfa/backup-codes/regenerate`,
      count: `${apiBaseUrl}/auth/mfa/backup-codes/count`,
      download: `${apiBaseUrl}/auth/mfa/backup-codes/download`,
    },
    
    // MFA Recovery - Enhanced
    recovery: {
      request: `${apiBaseUrl}/auth/mfa/recovery/request`,
      verify: `${apiBaseUrl}/auth/mfa/recovery/verify`,
    },
    
    // Risk-based Authentication (NEW)
    riskAssessment: `${apiBaseUrl}/auth/mfa/risk-assessment`,
    adaptiveChallenge: `${apiBaseUrl}/auth/mfa/adaptive-challenge`,
  },

  // 🛡️ 4. Passkey Authentication (WebAuthn) - NEW
  passkeys: {
    // Feature Detection
    capabilities: `${apiBaseUrl}/auth/passkeys/capabilities`,
    
    // Passkey Registration
    registerOptions: `${apiBaseUrl}/auth/passkeys/register/options`,
    registerVerify: `${apiBaseUrl}/auth/passkeys/register/verify`,
    
    // Passkey Authentication
    authenticateOptions: `${apiBaseUrl}/auth/passkeys/authenticate/options`,
    authenticateVerify: `${apiBaseUrl}/auth/passkeys/authenticate/verify`,
    
    // Passkey Management
    list: `${apiBaseUrl}/auth/passkeys`,
    rename: (passkeyId: string): string => {
      if (!passkeyId) throw new Error('Passkey ID is required');
      return `${apiBaseUrl}/auth/passkeys/${passkeyId}/name`;
    },
    delete: (passkeyId: string): string => {
      if (!passkeyId) throw new Error('Passkey ID is required');
      return `${apiBaseUrl}/auth/passkeys/${passkeyId}`;
    },
    
    // Advanced Features
    conditionalUI: `${apiBaseUrl}/auth/passkeys/conditional-ui`,
    crossDevice: `${apiBaseUrl}/auth/passkeys/cross-device`,
    deviceSync: `${apiBaseUrl}/auth/passkeys/device-sync`,
    
    // Security & Analytics
    usage: `${apiBaseUrl}/auth/passkeys/usage`,
    security: `${apiBaseUrl}/auth/passkeys/security-events`,
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
   * Validate password strength - NO RESTRICTIONS
   */
  validatePassword: (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!password || password.length === 0) {
      errors.push('Password cannot be empty');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Generate OAuth login URL with proper redirect URI handling
   */
  getOAuthLoginUrl: (provider: string, redirectUrl?: string): string => {
    const baseUrl = authAPI.oauth[provider as keyof typeof authAPI.oauth];
    if (!baseUrl || typeof baseUrl !== 'string') {
      throw new Error(`Unsupported OAuth provider: ${provider}`);
    }
    
    // Your backend handles OAuth internally and redirects to its own success page
    return baseUrl;
  },

  /**
   * Frontend-initiated OAuth handler with Google Identity Services
   */
  openOAuthPopup: (
    provider: string, 
    onSuccess?: (data: IOAuthUserData) => void, 
    onError?: (error: any) => void,
    options?: {
      width?: number;
      height?: number;
      redirectUri?: string;
      mode?: 'login' | 'signup' | 'link';
      generateQuickLoginKey?: boolean;
    }
  ): void => {
    if (provider === 'google') {
      authUtils.handleGoogleOAuth(onSuccess, onError, options);
    } else {
      // Fallback to other providers or show error
      onError?.({ message: `${provider} OAuth not implemented yet` });
    }
  },

  /**
   * Google OAuth implementation using Google Identity Services
   */
  handleGoogleOAuth: (
    onSuccess?: (data: IOAuthUserData) => void,
    onError?: (error: any) => void,
    options?: {
      width?: number;
      height?: number;
      redirectUri?: string;
      mode?: 'login' | 'signup' | 'link';
      generateQuickLoginKey?: boolean;
    }
  ): void => {
    // Check if Google Identity Services is already loaded
    if ((window as any).google?.accounts?.id) {
      authUtils.initializeGoogleSignIn(onSuccess, onError, options);
      return;
    }
    
    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      authUtils.initializeGoogleSignIn(onSuccess, onError, options);
    };
    
    script.onerror = () => {
      onError?.({ message: 'Failed to load Google OAuth. Please check your internet connection.' });
    };

    document.head.appendChild(script);
  },

  /**
   * Initialize Google Sign-In
   */
  initializeGoogleSignIn: (
    onSuccess?: (data: IOAuthUserData) => void,
    onError?: (error: any) => void,
    options?: {
      width?: number;
      height?: number;
      redirectUri?: string;
      mode?: 'login' | 'signup' | 'link';
      generateQuickLoginKey?: boolean;
    }
  ): void => {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    
    if (!googleClientId) {
      onError?.({ message: 'Google Client ID not configured' });
      return;
    }

    try {
      (window as any).google.accounts.id.initialize({
        client_id: googleClientId,
        callback: (response: any) => authUtils.handleGoogleCredentialResponse(response, onSuccess, onError, options),
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Create a temporary button element for programmatic trigger
      const tempButton = document.createElement('div');
      tempButton.id = 'temp-google-signin-button';
      tempButton.style.display = 'none';
      document.body.appendChild(tempButton);

      (window as any).google.accounts.id.renderButton(tempButton, {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
      });

      // Trigger the sign-in programmatically
      (window as any).google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback: trigger the button click
          const googleButton = tempButton.querySelector('div[role="button"]') as HTMLElement;
          if (googleButton) {
            googleButton.click();
          } else {
            // Last resort: use one-tap
            (window as any).google.accounts.id.prompt();
          }
        }
      });

      // Clean up temp button after a short delay
      setTimeout(() => {
        if (tempButton && tempButton.parentNode) {
          tempButton.parentNode.removeChild(tempButton);
      }
    }, 1000);

    } catch (error) {
      console.error('Google OAuth initialization error:', error);
      onError?.({ message: 'Failed to initialize Google OAuth' });
    }
  },

  /**
   * Handle Google credential response
   */
  handleGoogleCredentialResponse: async (
    response: any,
    onSuccess?: (data: IOAuthUserData) => void,
    onError?: (error: any) => void,
    options?: {
      generateQuickLoginKey?: boolean;
    }
  ): Promise<void> => {
    try {
      if (!response.credential) {
        throw new Error('No credential received from Google');
      }

      // Decode the JWT token to get user info
      const userInfo = authUtils.decodeGoogleJWT(response.credential);
      console.log('🔍 Google OAuth Debug - Decoded user info:', {
        id: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name,
        email_verified: userInfo.email_verified
      });
      
      // First, try the new frontend OAuth endpoint
      let backendResponse;
      const requestPayload = {
        provider: 'google',
        token: response.credential, // This is a JWT ID token
        generate_quick_login_key: options?.generateQuickLoginKey || false, // Add quick login key option
        userInfo: {
          id: userInfo.sub,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          email_verified: userInfo.email_verified,
          given_name: userInfo.given_name,
          family_name: userInfo.family_name,
        }
      };
      
      console.log('🔍 Google OAuth Debug - Sending request to backend:', {
        url: `${apiBaseUrl}/auth/oauth/frontend`,
        payload: requestPayload
      });
      
      try {
        backendResponse = await fetch(`${apiBaseUrl}/auth/oauth/frontend`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(requestPayload),
        });
      } catch (networkError) {
        console.error('Network error calling backend OAuth:', networkError);
        throw new Error('Network error. Please check your internet connection and backend server.');
      }

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json();
        console.error('🚨 Backend OAuth error:', {
          status: backendResponse.status,
          statusText: backendResponse.statusText,
          error: errorData,
          url: `${apiBaseUrl}/auth/oauth/frontend`
        });
        
        // More specific error messages
        if (backendResponse.status === 404) {
          throw new Error('🚧 Backend OAuth endpoint not implemented yet.\n\nPlease implement POST /api/v1/auth/oauth/frontend\n\nSee docs/backend-oauth-endpoint.md for implementation guide.');
        } else if (backendResponse.status === 500 && errorData.error?.includes('handleOAuthCallback is not a function')) {
          throw new Error('🔧 Backend OAuth handler missing.\n\nThe endpoint exists but handleOAuthCallback function is not implemented.\n\nCheck docs/backend-oauth-endpoint.md for code examples.');
        } else if (backendResponse.status === 400 && errorData.error?.includes('Student ID must follow the pattern')) {
          throw new Error('🚧 Account Creation Issue\n\nThere\'s a temporary issue with automatic account creation via Google.\n\nPlease try:\n1. Creating an account manually first\n2. Then linking your Google account in settings\n\nOr contact support for assistance.');
        } else if (backendResponse.status === 500 && errorData.error?.includes('Student ID must follow the pattern')) {
          throw new Error('🚧 Account Creation Issue\n\nThere\'s a temporary issue with automatic account creation via Google.\n\nPlease try:\n1. Creating an account manually first\n2. Then linking your Google account in settings\n\nOr contact support for assistance.');
        } else if (errorData.error?.includes('validation failed')) {
          throw new Error(`🔧 Account Creation Issue: ${errorData.error}\n\nPlease try creating an account manually first, then link your Google account in settings.`);
        } else {
          throw new Error(errorData.message || `OAuth authentication failed (${backendResponse.status})`);
        }
      }

      const result = await backendResponse.json();
      console.log('✅ Backend OAuth success response:', result);
      
      if (result.success && result.data) {
        // Transform the response to match the expected format
        const transformedData = {
          ...result.data,
          // Map tokens to expected format
          access_token: result.data.tokens?.access_token || result.data.token,
          refresh_token: result.data.tokens?.refresh_token || '',
          // Map user data
          id: result.data.user.id,
          email: result.data.user.email,
          full_name: result.data.user.full_name || result.data.user.name,
          first_name: result.data.user.given_name || result.data.user.full_name?.split(' ')[0] || '',
          last_name: result.data.user.family_name || result.data.user.full_name?.split(' ').slice(1).join(' ') || '',
          profile_picture: result.data.user.user_image?.url || result.data.user.picture,
          email_verified: result.data.user.email_verified,
          provider: 'google',
          provider_id: result.data.user.id,
          role: ['student'], // Default role
          permissions: [],
          account_merged: result.data.user.oauth_providers?.length > 1,
          profile_updated: result.data.user.profile_completion > 0,
          email_conflicts: [],
          // Add quick login key data if available
          quick_login_key: result.data.quick_login_key,
          quick_login_key_id: result.data.quick_login_key_id
        };

        onSuccess?.(transformedData as any);
      } else {
        throw new Error(result.message || 'OAuth authentication failed');
      }

    } catch (error: any) {
      console.error('Google OAuth error:', error);
      onError?.(error);
    }
  },

  /**
   * Decode Google JWT token to extract user info
   */
  decodeGoogleJWT: (token: string): any => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding Google JWT:', error);
      return {};
    }
  },

  /**
   * Link OAuth account to existing user account
   */
  linkOAuthAccount: async (provider: string): Promise<IOAuthAccountLinkResponse> => {
    try {
      const response = await fetch(authAPI.oauth.link(provider), {
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
   * Unlink OAuth account from user account
   */
  unlinkOAuthAccount: async (provider: string): Promise<IOAuthAccountUnlinkResponse> => {
    try {
      const response = await fetch(authAPI.oauth.unlink(provider), {
        method: 'DELETE',
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
   * Get connected OAuth providers
   */
  getConnectedProviders: async (): Promise<IOAuthConnectedProvidersResponse> => {
    try {
      const response = await fetch(authAPI.oauth.connected, {
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
        data: {} as any
      };
    }
  },

  /**
   * Synchronize email from OAuth provider
   */
  syncOAuthEmail: async (provider: string, action: 'use_oauth_email' | 'verify_current_email' | 'add_alternative_email'): Promise<IOAuthEmailSyncResponse> => {
    try {
      const response = await fetch(authAPI.oauth.syncEmail, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authUtils.getAuthHeaders()
        },
        body: JSON.stringify({ provider, action })
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
   * Get OAuth account merge suggestions
   */
  getOAuthMergeSuggestions: async (): Promise<IOAuthMergeSuggestionsResponse> => {
    try {
      const response = await fetch(authAPI.oauth.mergeSuggestions, {
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
        data: {} as any
      };
    }
  },

  /**
   * Check if response indicates MFA is required
   */
  isMFARequired: (response: any): boolean => {
    return response?.requires_mfa === true || response?.mfa_required === true;
  },

  /**
   * Extract user information from OAuth response
   */
  extractOAuthUserData: (rawData: any, provider: string): IOAuthUserData => {
    return {
      id: rawData.id || rawData.user?.id || rawData.sub,
      email: rawData.email || rawData.user?.email,
      full_name: rawData.full_name || rawData.name || rawData.user?.full_name || `${rawData.given_name || ''} ${rawData.family_name || ''}`.trim(),
      first_name: rawData.given_name || rawData.first_name,
      last_name: rawData.family_name || rawData.last_name,
      profile_picture: rawData.picture || rawData.avatar_url || rawData.user?.user_image,
      email_verified: rawData.email_verified ?? rawData.verified_email ?? true,
      provider,
      provider_id: rawData.id || rawData.sub,
      role: rawData.role || rawData.user?.role || ['student'],
      permissions: rawData.permissions || rawData.user?.permissions || [],
      access_token: rawData.access_token || rawData.token,
      refresh_token: rawData.refresh_token,
      session_id: rawData.session_id,
      account_merged: rawData.account_merged || rawData.oauth_account_merged,
      profile_updated: rawData.profile_updated || rawData.oauth_profile_updated,
      email_conflicts: rawData.email_conflicts || rawData.oauth_email_conflicts
    };
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
  },

  // 🛡️ Passkey Authentication Utilities (WebAuthn) - NEW

  /**
   * Check browser capabilities for passkey support
   */
  getPasskeyCapabilities: async (): Promise<IPasskeyCapabilities> => {
    const capabilities: IPasskeyCapabilities = {
      webauthn: false,
      conditionalMediation: false,
      userVerifyingPlatformAuthenticator: false,
      crossPlatformAuthenticator: false,
      hybridTransport: false,
      multiDevice: false,
      biometrics: false,
      securityKeys: false,
    };

    try {
      // Check basic WebAuthn support
      capabilities.webauthn = !!(
        window.PublicKeyCredential &&
        navigator.credentials &&
        typeof navigator.credentials.create === 'function' &&
        typeof navigator.credentials.get === 'function'
      );

      if (capabilities.webauthn) {
        // Check conditional mediation (autofill) support
        if (typeof PublicKeyCredential.isConditionalMediationAvailable === 'function') {
          capabilities.conditionalMediation = await PublicKeyCredential.isConditionalMediationAvailable();
        }

        // Check platform authenticator support
        if (typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
          capabilities.userVerifyingPlatformAuthenticator = 
            await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        }

        // Enhanced capability detection using getClientCapabilities (Chrome 133+)
        if ((PublicKeyCredential as any).getClientCapabilities) {
          try {
            const clientCapabilities = await (PublicKeyCredential as any).getClientCapabilities();
            capabilities.conditionalMediation = clientCapabilities.conditionalGet || capabilities.conditionalMediation;
            capabilities.hybridTransport = clientCapabilities.hybridTransport || false;
            capabilities.multiDevice = clientCapabilities.passkeyPlatformAuthenticator || false;
          } catch (e) {
            console.log('Advanced capability detection not available');
          }
        }

        // Infer additional capabilities based on platform
        const userAgent = navigator.userAgent.toLowerCase();
        capabilities.biometrics = capabilities.userVerifyingPlatformAuthenticator;
        capabilities.securityKeys = true; // Most modern browsers support security keys
        capabilities.crossPlatformAuthenticator = true;
      }
    } catch (error) {
      console.error('Error detecting passkey capabilities:', error);
    }

    return capabilities;
  },

  /**
   * Get passkey registration options from server
   */
  getPasskeyRegistrationOptions: async (): Promise<IPasskeyRegistrationOptions> => {
    try {
      const response = await fetch(authAPI.passkeys.registerOptions, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authUtils.getAuthHeaders()
        }
      });
      return response.json();
    } catch (error: any) {
      throw new Error(authUtils.handleAuthError(error));
    }
  },

  /**
   * Register a new passkey
   */
  registerPasskey: async (name?: string): Promise<IPasskeyRegistrationResponse> => {
    try {
      // Get registration options from server
      const options = await authUtils.getPasskeyRegistrationOptions();
      
      // Convert base64url strings to ArrayBuffers
      const credentialCreationOptions: CredentialCreationOptions = {
        publicKey: {
          ...options,
          challenge: authUtils.base64urlToArrayBuffer(options.challenge),
          user: {
            ...options.user,
            id: authUtils.base64urlToArrayBuffer(options.user.id)
          },
          excludeCredentials: options.excludeCredentials?.map(cred => ({
            ...cred,
            id: authUtils.base64urlToArrayBuffer(cred.id),
            transports: cred.transports as AuthenticatorTransport[]
          }))
        }
      };

      // Create the credential
      const credential = await navigator.credentials.create(credentialCreationOptions) as PublicKeyCredential;
      
      if (!credential) {
        throw new Error('Failed to create passkey');
      }

      // Prepare credential for server verification
      const credentialData: IPasskeyCredential = {
        id: credential.id,
        rawId: authUtils.arrayBufferToBase64url(credential.rawId),
        type: credential.type as 'public-key',
        response: {
          clientDataJSON: authUtils.arrayBufferToBase64url((credential.response as AuthenticatorAttestationResponse).clientDataJSON),
          attestationObject: authUtils.arrayBufferToBase64url((credential.response as AuthenticatorAttestationResponse).attestationObject),
          transports: (credential.response as AuthenticatorAttestationResponse).getTransports?.() || []
        },
        authenticatorAttachment: (credential as any).authenticatorAttachment,
        clientExtensionResults: credential.getClientExtensionResults()
      };

      // Send to server for verification and storage
      const response = await fetch(authAPI.passkeys.registerVerify, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authUtils.getAuthHeaders()
        },
        body: JSON.stringify({
          credential: credentialData,
          name: name || authUtils.generatePasskeyName()
        })
      });

      return response.json();
    } catch (error: any) {
      console.error('Passkey registration error:', error);
      throw new Error(authUtils.handlePasskeyError(error));
    }
  },

  /**
   * Get passkey authentication options from server
   */
  getPasskeyAuthenticationOptions: async (email?: string): Promise<IPasskeyAuthenticationOptions> => {
    try {
      const response = await fetch(authAPI.passkeys.authenticateOptions, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      return response.json();
    } catch (error: any) {
      throw new Error(authUtils.handleAuthError(error));
    }
  },

  /**
   * Authenticate with passkey
   */
  authenticateWithPasskey: async (email?: string, conditional: boolean = false): Promise<IPasskeyAuthenticationResponse> => {
    try {
      // Get authentication options from server
      const options = await authUtils.getPasskeyAuthenticationOptions(email);
      
      // Convert base64url strings to ArrayBuffers
      const credentialRequestOptions: CredentialRequestOptions = {
        publicKey: {
          ...options,
          challenge: authUtils.base64urlToArrayBuffer(options.challenge),
                     allowCredentials: options.allowCredentials?.map(cred => ({
             ...cred,
             id: authUtils.base64urlToArrayBuffer(cred.id),
             transports: cred.transports as AuthenticatorTransport[]
           })) || []
        }
      };

      // Add conditional mediation for autofill
      if (conditional) {
        (credentialRequestOptions as any).mediation = 'conditional';
      }

      // Get the credential
      const credential = await navigator.credentials.get(credentialRequestOptions) as PublicKeyCredential;
      
      if (!credential) {
        throw new Error('Failed to authenticate with passkey');
      }

      // Prepare credential for server verification
      const credentialData: IPasskeyCredential = {
        id: credential.id,
        rawId: authUtils.arrayBufferToBase64url(credential.rawId),
        type: credential.type as 'public-key',
        response: {
          clientDataJSON: authUtils.arrayBufferToBase64url((credential.response as AuthenticatorAssertionResponse).clientDataJSON),
          authenticatorData: authUtils.arrayBufferToBase64url((credential.response as AuthenticatorAssertionResponse).authenticatorData),
          signature: authUtils.arrayBufferToBase64url((credential.response as AuthenticatorAssertionResponse).signature),
          userHandle: (credential.response as AuthenticatorAssertionResponse).userHandle ? 
            authUtils.arrayBufferToBase64url((credential.response as AuthenticatorAssertionResponse).userHandle!) : undefined
        },
        authenticatorAttachment: (credential as any).authenticatorAttachment,
        clientExtensionResults: credential.getClientExtensionResults()
      };

      // Send to server for verification
      const response = await fetch(authAPI.passkeys.authenticateVerify, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ credential: credentialData })
      });

      return response.json();
    } catch (error: any) {
      console.error('Passkey authentication error:', error);
      throw new Error(authUtils.handlePasskeyError(error));
    }
  },

  /**
   * Get list of user's passkeys
   */
  getPasskeys: async (): Promise<IPasskeyListResponse> => {
    try {
      const response = await fetch(authAPI.passkeys.list, {
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
        data: { passkeys: [], total: 0, capabilities: {} as IPasskeyCapabilities, recommendations: [] }
      };
    }
  },

  /**
   * Rename a passkey
   */
  renamePasskey: async (passkeyId: string, newName: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(authAPI.passkeys.rename(passkeyId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authUtils.getAuthHeaders()
        },
        body: JSON.stringify({ name: newName })
      });
      return response.json();
    } catch (error: any) {
      return {
        success: false,
        message: authUtils.handleAuthError(error)
      };
    }
  },

  /**
   * Delete a passkey
   */
  deletePasskey: async (passkeyId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(authAPI.passkeys.delete(passkeyId), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...authUtils.getAuthHeaders()
        }
      });
      return response.json();
    } catch (error: any) {
      return {
        success: false,
        message: authUtils.handleAuthError(error)
      };
    }
  },

  // 🔧 Helper Functions for Passkeys

  /**
   * Convert base64url string to ArrayBuffer
   */
  base64urlToArrayBuffer: (base64url: string): ArrayBuffer => {
    const padding = '='.repeat((4 - base64url.length % 4) % 4);
    const base64 = (base64url + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray.buffer;
  },

  /**
   * Convert ArrayBuffer to base64url string
   */
  arrayBufferToBase64url: (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let str = '';
    for (const charCode of bytes) {
      str += String.fromCharCode(charCode);
    }
    const base64String = btoa(str);
    return base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  },

  /**
   * Generate a default passkey name based on device/browser info
   */
  generatePasskeyName: (): string => {
    const userAgent = navigator.userAgent;
    let deviceName = 'Unknown Device';
    
    if (/iPhone/.test(userAgent)) {
      deviceName = 'iPhone';
    } else if (/iPad/.test(userAgent)) {
      deviceName = 'iPad';
    } else if (/Android/.test(userAgent)) {
      deviceName = 'Android Device';
    } else if (/Mac/.test(userAgent)) {
      deviceName = 'Mac';
    } else if (/Windows/.test(userAgent)) {
      deviceName = 'Windows PC';
    } else if (/Linux/.test(userAgent)) {
      deviceName = 'Linux Device';
    }

    const timestamp = new Date().toLocaleDateString();
    return `${deviceName} - ${timestamp}`;
  },

  /**
   * Handle passkey-specific errors
   */
  handlePasskeyError: (error: any): string => {
    if (error.name === 'InvalidStateError') {
      return 'A passkey already exists for this device. Please try with a different device or remove the existing passkey first.';
    }
    
    if (error.name === 'NotAllowedError') {
      return 'Passkey operation was cancelled or not allowed. This might be due to user cancellation or security policy.';
    }
    
    if (error.name === 'NotSupportedError') {
      return 'Passkeys are not supported on this device or browser. Please try with a different device or use an alternative authentication method.';
    }
    
    if (error.name === 'SecurityError') {
      return 'Security error occurred. Please ensure you\'re on a secure connection (HTTPS) and try again.';
    }
    
    if (error.name === 'AbortError') {
      return 'Passkey operation timed out. Please try again.';
    }
    
    if (error.name === 'ConstraintError') {
      return 'The passkey request doesn\'t meet the security requirements. Please contact support.';
    }
    
    return error.message || 'An error occurred with passkey authentication. Please try again.';
  },

  /**
   * Check if device supports conditional UI (autofill)
   */
  supportsConditionalUI: async (): Promise<boolean> => {
    try {
      if (PublicKeyCredential?.isConditionalMediationAvailable) {
        return await PublicKeyCredential.isConditionalMediationAvailable();
      }
      return false;
    } catch {
      return false;
    }
  },

  /**
   * Enable passkey autofill on form inputs
   */
  enablePasskeyAutofill: (inputElement: HTMLInputElement, onSuccess: (result: IPasskeyAuthenticationResponse) => void): void => {
    // Add webauthn to autocomplete attribute
    const currentAutocomplete = inputElement.getAttribute('autocomplete') || '';
    if (!currentAutocomplete.includes('webauthn')) {
      inputElement.setAttribute('autocomplete', `${currentAutocomplete} webauthn`.trim());
    }

    // Start conditional authentication
    authUtils.authenticateWithPasskey(undefined, true)
      .then(onSuccess)
      .catch(error => {
        if (error.name !== 'NotAllowedError') {
          console.error('Passkey autofill error:', error);
        }
      });
  }
};

// 🛡️ Passkey Authentication Interfaces (WebAuthn)

export interface IPasskeyCapabilities {
  webauthn: boolean;
  conditionalMediation: boolean;
  userVerifyingPlatformAuthenticator: boolean;
  crossPlatformAuthenticator: boolean;
  hybridTransport: boolean;
  multiDevice: boolean;
  biometrics: boolean;
  securityKeys: boolean;
}

export interface IPasskeyRegistrationOptions {
  challenge: string;
  rp: {
    name: string;
    id: string;
  };
  user: {
    id: string;
    name: string;
    displayName: string;
  };
  pubKeyCredParams: Array<{
    type: 'public-key';
    alg: number;
  }>;
  excludeCredentials?: Array<{
    type: 'public-key';
    id: string;
    transports?: string[];
  }>;
  authenticatorSelection?: {
    authenticatorAttachment?: 'platform' | 'cross-platform';
    userVerification?: 'required' | 'preferred' | 'discouraged';
    residentKey?: 'required' | 'preferred' | 'discouraged';
    requireResidentKey?: boolean;
  };
  timeout?: number;
  attestation?: 'none' | 'indirect' | 'direct' | 'enterprise';
}

export interface IPasskeyAuthenticationOptions {
  challenge: string;
  rpId: string;
  allowCredentials?: Array<{
    type: 'public-key';
    id: string;
    transports?: string[];
  }>;
  userVerification?: 'required' | 'preferred' | 'discouraged';
  timeout?: number;
}

export interface IPasskeyCredential {
  id: string;
  rawId: string;
  type: 'public-key';
  response: {
    clientDataJSON: string;
    attestationObject?: string; // For registration
    authenticatorData?: string; // For authentication
    signature?: string; // For authentication
    userHandle?: string; // For authentication
    transports?: string[];
  };
  authenticatorAttachment?: 'platform' | 'cross-platform';
  clientExtensionResults?: any;
}

export interface IPasskey {
  id: string;
  name: string;
  credentialId: string;
  publicKey: string;
  counter: number;
  deviceType: string;
  backedUp: boolean;
  backupEligible: boolean;
  transports: string[];
  aaguid: string;
  attestationType: string;
  createdAt: string;
  lastUsed?: string;
  usage: {
    count: number;
    lastIpAddress?: string;
    lastUserAgent?: string;
    lastLocation?: string;
  };
  sync: {
    isSync: boolean;
    provider?: string;
    devices?: string[];
  };
}

export interface IPasskeyRegistrationResponse {
  success: boolean;
  message: string;
  data?: {
    passkey: IPasskey;
    backupCodes?: string[];
    recommendations: string[];
  };
}

export interface IPasskeyAuthenticationResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      email: string;
      full_name: string;
    };
    passkey: IPasskey;
    tokens: {
      access_token: string;
      refresh_token: string;
    };
    session_id: string;
    deviceInfo: {
      isNewDevice: boolean;
      isTrustedDevice: boolean;
      requiresAdditionalVerification: boolean;
    };
  };
}

export interface IPasskeyListResponse {
  success: boolean;
  message: string;
  data: {
    passkeys: IPasskey[];
    total: number;
    capabilities: IPasskeyCapabilities;
    recommendations: string[];
  };
}

// Enhanced 2FA Interfaces

export interface IRiskAssessment {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  factors: {
    deviceTrust: number;
    locationTrust: number;
    behaviorTrust: number;
    timeTrust: number;
  };
  recommendation: 'allow' | 'challenge' | 'block';
  requiredMethods: string[];
}

export interface IAdaptiveChallenge {
  challengeType: 'totp' | 'sms' | 'passkey' | 'biometric' | 'push';
  reason: string;
  alternatives: string[];
  timeout: number;
  maxAttempts: number;
}

export interface IEnhancedMFAStatus {
  enabled: boolean;
  methods: Array<{
    type: 'totp' | 'sms' | 'passkey';
    enabled: boolean;
    primary: boolean;
    setupDate: string;
    lastUsed?: string;
    deviceInfo?: string;
  }>;
  backupCodesCount: number;
  riskProfile: {
    trustScore: number;
    deviceFingerprint: string;
    lastRiskAssessment: string;
  };
  recommendations: string[];
}

// Email Notification Interfaces for OAuth
export interface IOAuthEmailNotification {
  type: 'welcome' | 'login_notification' | 'security_alert' | 'quick_login_key_generated';
  recipient: {
    email: string;
    full_name: string;
  };
  data: {
    provider: string;
    device_info?: {
      device: string;
      location?: string;
      ip_address?: string;
      user_agent?: string;
    };
    timestamp: string;
    is_new_user?: boolean;
    quick_login_key_generated?: boolean;
    account_merged?: boolean;
  };
  template_data?: {
    [key: string]: any;
  };
}

export interface IWelcomeEmailData {
  user_name: string;
  provider: string;
  account_features: string[];
  quick_login_enabled: boolean;
  platform_features: string[];
  support_links: {
    getting_started: string;
    help_center: string;
    contact_support: string;
  };
}

export interface ILoginNotificationData {
  user_name: string;
  provider: string;
  login_time: string;
  device_info: {
    device: string;
    location?: string;
    browser?: string;
  };
  is_new_device: boolean;
  security_actions: {
    review_devices: string;
    change_password: string;
    enable_2fa: string;
  };
}

export interface ISecurityAlertData {
  user_name: string;
  alert_type: 'suspicious_login' | 'new_device' | 'multiple_failed_attempts';
  timestamp: string;
  details: {
    location?: string;
    device?: string;
    ip_address?: string;
  };
  recommended_actions: string[];
  support_contact: string;
}

export interface IQuickLoginKeyNotificationData {
  user_name: string;
  provider: string;
  key_generated_at: string;
  key_expires_at: string;
  security_info: {
    storage_location: 'local_device';
    encryption: 'AES-256';
    auto_expiry: '30_days_inactive';
  };
  management_links: {
    view_keys: string;
    revoke_key: string;
    security_settings: string;
  };
}

// Email Template Response Interfaces
export interface IEmailNotificationResponse {
  success: boolean;
  message: string;
  data?: {
    email_id: string;
    sent_at: string;
    template_used: string;
    delivery_status: 'queued' | 'sent' | 'delivered' | 'failed';
  };
}

export interface IEmailTemplateConfig {
  welcome: {
    subject: string;
    template_id: string;
    features: {
      oauth_registration: boolean;
      quick_login_key: boolean;
      platform_overview: boolean;
      support_links: boolean;
    };
  };
  login_notification: {
    subject: string;
    template_id: string;
    features: {
      device_detection: boolean;
      location_tracking: boolean;
      security_recommendations: boolean;
    };
  };
  security_alert: {
    subject: string;
    template_id: string;
    features: {
      threat_detection: boolean;
      immediate_actions: boolean;
      support_escalation: boolean;
    };
  };
  quick_login_key: {
    subject: string;
    template_id: string;
    features: {
      key_management: boolean;
      security_explanation: boolean;
      expiry_information: boolean;
    };
  };
}

export default authAPI; 