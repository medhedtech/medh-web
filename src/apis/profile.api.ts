// profile.api.ts - Comprehensive Profile Management API

import { apiClient } from './apiClient';
import { IApiResponse } from './apiClient';

// Profile Interfaces
export interface IPhoneNumber {
  country: string;
  number: string;
}

export interface IUserImage {
  url: string;
  public_id: string;
  alt_text?: string;
  upload_date?: string;
}

export interface ICoverImage {
  url: string;
  public_id: string;
  alt_text?: string;
  upload_date?: string;
}

export interface ILanguageSpoken {
  language: string;
  proficiency: 'native' | 'fluent' | 'advanced' | 'intermediate' | 'beginner';
}

export interface ICertification {
  name: string;
  issuer: string;
  year: number;
  expiry_date?: string;
  credential_id?: string;
  credential_url?: string;
  is_verified?: boolean;
}

export interface IUserMeta {
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say' | 'other';
  nationality?: string;
  languages_spoken?: ILanguageSpoken[];
  occupation?: string;
  industry?: string;
  company?: string;
  experience_level?: 'entry' | 'mid' | 'senior' | 'executive' | 'student' | 'other';
  annual_income_range?: string;
  education_level?: 'High School' | 'Diploma' | 'Associate Degree' | "Bachelor's Degree" | "Master's Degree" | 'Doctorate/PhD' | 'Professional Certificate' | 'Other';
  institution_name?: string;
  field_of_study?: string;
  graduation_year?: number;
  skills?: string[];
  certifications?: ICertification[];
  [key: string]: any;
}

export interface INotificationPreferences {
  email?: {
    marketing?: boolean;
    course_updates?: boolean;
    system_alerts?: boolean;
    weekly_summary?: boolean;
    achievement_unlocked?: boolean;
  };
  push?: {
    enabled?: boolean;
    marketing?: boolean;
    course_reminders?: boolean;
    live_sessions?: boolean;
    community_activity?: boolean;
  };
  sms?: {
    enabled?: boolean;
    security_alerts?: boolean;
    urgent_only?: boolean;
  };
}

export interface IPrivacyPreferences {
  profile_visibility?: 'public' | 'friends' | 'private';
  activity_tracking?: boolean;
  data_analytics?: boolean;
  third_party_sharing?: boolean;
  marketing_emails?: boolean;
}

export interface IAccessibilityPreferences {
  screen_reader?: boolean;
  high_contrast?: boolean;
  large_text?: boolean;
  keyboard_navigation?: boolean;
  reduced_motion?: boolean;
}

export interface IContentPreferences {
  autoplay_videos?: boolean;
  subtitles_default?: boolean;
  preferred_video_quality?: 'auto' | '480p' | '720p' | '1080p';
  content_maturity?: 'all' | 'teen' | 'mature';
}

export interface IUserPreferences {
  theme?: 'light' | 'dark' | 'auto' | 'high_contrast';
  language?: string;
  currency?: string;
  timezone?: string;
  notifications?: INotificationPreferences;
  privacy?: IPrivacyPreferences;
  accessibility?: IAccessibilityPreferences;
  content?: IContentPreferences;
}

export interface ILearningStatistics {
  total_courses_enrolled?: number;
  total_courses_completed?: number;
  total_learning_time?: number;
  current_streak?: number;
  longest_streak?: number;
  certificates_earned?: number;
  skill_points?: number;
  achievements_unlocked?: number;
}

export interface IEngagementStatistics {
  total_logins?: number;
  total_session_time?: number;
  avg_session_duration?: number;
  last_active_date?: string;
  consecutive_active_days?: number;
  total_page_views?: number;
  feature_usage_count?: Record<string, number>;
}

export interface ISocialStatistics {
  reviews_written?: number;
  discussions_participated?: number;
  content_shared?: number;
  followers_count?: number;
  following_count?: number;
  community_reputation?: number;
}

export interface IFinancialStatistics {
  total_spent?: number;
  total_courses_purchased?: number;
  subscription_months?: number;
  refunds_requested?: number;
  lifetime_value?: number;
}

export interface IUserStatistics {
  learning?: ILearningStatistics;
  engagement?: IEngagementStatistics;
  social?: ISocialStatistics;
  financial?: IFinancialStatistics;
  _id?: string;
}

export interface IAccountStatus {
  is_active: boolean;
  is_banned: boolean;
  email_verified: boolean;
  phone_verified: boolean;
  identity_verified: boolean;
}

export interface IRecentActivity {
  action: string;
  resource: string;
  timestamp: string;
}

export interface IAccountMetrics {
  account_age_days: number;
  profile_completion: number;
  last_seen: string;
  recent_activity: IRecentActivity[];
}

// Main User Profile Interface
export interface IUserProfile {
  _id: string;
  full_name: string;
  email: string;
  username?: string;
  student_id?: string;
  phone_numbers?: IPhoneNumber[];
  age?: number;
  age_group?: 'teen' | 'young-adult' | 'adult' | 'senior';
  address?: string;
  organization?: string;
  bio?: string;
  user_image?: IUserImage;
  cover_image?: ICoverImage;
  facebook_link?: string;
  instagram_link?: string;
  linkedin_link?: string;
  twitter_link?: string;
  youtube_link?: string;
  github_link?: string;
  portfolio_link?: string;
  country?: string;
  timezone?: string;
  email_verified: boolean;
  phone_verified?: boolean;
  identity_verified?: boolean;
  is_active: boolean;
  is_banned?: boolean;
  account_type?: string;
  role: string | string[];
  subscription_status?: string;
  subscription_plan?: string;
  subscription_start?: string;
  subscription_end?: string;
  trial_used?: boolean;
  two_factor_enabled?: boolean;
  is_online?: boolean;
  last_seen?: string;
  status_message?: string;
  activity_status?: 'online' | 'away' | 'busy' | 'offline';
  meta?: IUserMeta;
  preferences?: IUserPreferences;
  statistics?: IUserStatistics;
  created_at: string;
  updated_at: string;
  last_profile_update?: string;
}

// Profile Update Input Interface
export interface IProfileUpdateInput {
  full_name?: string;
  email?: string;
  username?: string;
  password?: string;
  phone_numbers?: IPhoneNumber[];
  age?: number;
  age_group?: 'teen' | 'young-adult' | 'adult' | 'senior';
  address?: string;
  organization?: string;
  bio?: string;
  user_image?: IUserImage;
  cover_image?: ICoverImage;
  facebook_link?: string;
  instagram_link?: string;
  linkedin_link?: string;
  twitter_link?: string;
  youtube_link?: string;
  github_link?: string;
  portfolio_link?: string;
  country?: string;
  timezone?: string;
  status_message?: string;
  activity_status?: 'online' | 'away' | 'busy' | 'offline';
  meta?: Partial<IUserMeta>;
}

// Admin-only fields interface
export interface IAdminProfileUpdateInput extends IProfileUpdateInput {
  role?: string | string[];
  admin_role?: string;
  is_active?: boolean;
  is_banned?: boolean;
  ban_reason?: string;
  ban_expires?: string;
  account_type?: string;
  subscription_status?: string;
  subscription_plan?: string;
  subscription_start?: string;
  subscription_end?: string;
  email_verified?: boolean;
  phone_verified?: boolean;
  identity_verified?: boolean;
  api_key?: string;
  api_rate_limit?: number;
  webhooks?: any[];
  failed_login_attempts?: number;
  account_locked_until?: string;
}

// Response Interfaces
export interface IProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: IUserProfile;
    profile_completion: number;
    last_updated: string;
    account_status: IAccountStatus;
  };
}

export interface IProfileUpdateResponse {
  success: boolean;
  message: string;
  data: {
    user: IUserProfile;
    profile_completion: number;
    updated_fields: string[];
  };
}

export interface IProfileDeleteResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      full_name: string;
      email: string;
      is_active: boolean;
      deleted_at?: string;
      restored_at?: string;
    };
    deletion_type?: 'soft_delete' | 'permanent_delete';
    can_be_restored?: boolean;
  };
}

export interface IProfileStatsResponse {
  success: boolean;
  message: string;
  data: {
    statistics: IUserStatistics;
    account_metrics: IAccountMetrics;
    preferences: IUserPreferences;
  };
}

export interface IPreferencesUpdateResponse {
  success: boolean;
  message: string;
  data: {
    preferences: IUserPreferences;
  };
}

export interface IValidationError {
  field: string;
  message: string;
}

export interface IProfileErrorResponse {
  success: false;
  message: string;
  errors?: IValidationError[];
}

// Profile API Functions

/**
 * Get user profile by ID
 */
export const getUserProfile = async (userId: string): Promise<IApiResponse<IProfileResponse['data']>> => {
  return apiClient.get<IProfileResponse['data']>(`/profile/${userId}`);
};

/**
 * Get current user's profile
 */
export const getCurrentUserProfile = async (): Promise<IApiResponse<IProfileResponse['data']>> => {
  return apiClient.get<IProfileResponse['data']>('/profile/me');
};

/**
 * Update user profile by ID
 */
export const updateUserProfile = async (
  userId: string, 
  data: IProfileUpdateInput | IAdminProfileUpdateInput
): Promise<IApiResponse<IProfileUpdateResponse['data']>> => {
  return apiClient.put<IProfileUpdateResponse['data']>(`/profile/${userId}`, data);
};

/**
 * Update current user's profile
 */
export const updateCurrentUserProfile = async (
  data: IProfileUpdateInput
): Promise<IApiResponse<IProfileUpdateResponse['data']>> => {
  return apiClient.put<IProfileUpdateResponse['data']>('/profile/me', data);
};

/**
 * Delete user profile by ID
 */
export const deleteUserProfile = async (
  userId: string, 
  permanent: boolean = false
): Promise<IApiResponse<IProfileDeleteResponse['data']>> => {
  const queryParams = permanent ? '?permanent=true' : '';
  return apiClient.delete<IProfileDeleteResponse['data']>(`/profile/${userId}${queryParams}`);
};

/**
 * Delete current user's profile
 */
export const deleteCurrentUserProfile = async (
  permanent: boolean = false
): Promise<IApiResponse<IProfileDeleteResponse['data']>> => {
  const queryParams = permanent ? '?permanent=true' : '';
  return apiClient.delete<IProfileDeleteResponse['data']>(`/profile/me${queryParams}`);
};

/**
 * Restore user profile by ID (Admin only)
 */
export const restoreUserProfile = async (userId: string): Promise<IApiResponse<IProfileDeleteResponse['data']>> => {
  return apiClient.post<IProfileDeleteResponse['data']>(`/profile/${userId}/restore`);
};

/**
 * Get user profile statistics by ID
 */
export const getUserProfileStats = async (userId: string): Promise<IApiResponse<IProfileStatsResponse['data']>> => {
  return apiClient.get<IProfileStatsResponse['data']>(`/profile/${userId}/stats`);
};

/**
 * Get current user's profile statistics
 */
export const getCurrentUserProfileStats = async (): Promise<IApiResponse<IProfileStatsResponse['data']>> => {
  return apiClient.get<IProfileStatsResponse['data']>('/profile/me/stats');
};

/**
 * Update user preferences by ID
 */
export const updateUserPreferences = async (
  userId: string, 
  preferences: Partial<IUserPreferences>
): Promise<IApiResponse<IPreferencesUpdateResponse['data']>> => {
  return apiClient.put<IPreferencesUpdateResponse['data']>(`/profile/${userId}/preferences`, preferences);
};

/**
 * Update current user's preferences
 */
export const updateCurrentUserPreferences = async (
  preferences: Partial<IUserPreferences>
): Promise<IApiResponse<IPreferencesUpdateResponse['data']>> => {
  return apiClient.put<IPreferencesUpdateResponse['data']>('/profile/me/preferences', preferences);
};

/**
 * Get user achievements
 */
export const getUserAchievements = async (userId: string): Promise<IApiResponse<{ achievements: any[] }>> => {
  return apiClient.get<{ achievements: any[] }>(`/profile/${userId}/achievements`);
};

/**
 * Get user skills
 */
export const getUserSkills = async (userId: string): Promise<IApiResponse<{ skills: any[] }>> => {
  return apiClient.get<{ skills: any[] }>(`/profile/${userId}/skills`);
};

/**
 * Get user education
 */
export const getUserEducation = async (userId: string): Promise<IApiResponse<{ education: any[] }>> => {
  return apiClient.get<{ education: any[] }>(`/profile/${userId}/education`);
};

// Profile Utility Functions
export const profileUtils = {
  /**
   * Calculate profile completion percentage
   */
  calculateProfileCompletion: (profile: IUserProfile): number => {
    const requiredFields = [
      'full_name', 'email', 'phone_numbers', 'bio', 'user_image'
    ];
    
    const optionalFields = [
      'age', 'address', 'organization', 'country', 'timezone',
      'facebook_link', 'instagram_link', 'linkedin_link', 'twitter_link',
      'youtube_link', 'github_link', 'portfolio_link'
    ];
    
    const metaFields = [
      'meta.gender', 'meta.occupation', 'meta.education_level', 
      'meta.skills', 'meta.certifications'
    ];
    
    let completedFields = 0;
    let totalFields = requiredFields.length + optionalFields.length + metaFields.length;
    
    // Check required fields (weighted more)
    requiredFields.forEach(field => {
      if (profileUtils.getNestedValue(profile, field)) {
        completedFields += 2; // Required fields count double
        totalFields += 1; // Adjust total for double weight
      }
    });
    
    // Check optional fields
    optionalFields.forEach(field => {
      if (profileUtils.getNestedValue(profile, field)) {
        completedFields += 1;
      }
    });
    
    // Check meta fields
    metaFields.forEach(field => {
      if (profileUtils.getNestedValue(profile, field)) {
        completedFields += 1;
      }
    });
    
    return Math.round((completedFields / totalFields) * 100);
  },

  /**
   * Get nested object value by dot notation
   */
  getNestedValue: (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  },

  /**
   * Validate social media URLs
   */
  validateSocialUrls: (profile: IProfileUpdateInput): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const socialFields = {
      facebook_link: /^https:\/\/(www\.)?facebook\.com\/.+/,
      instagram_link: /^https:\/\/(www\.)?instagram\.com\/.+/,
      linkedin_link: /^https:\/\/(www\.)?linkedin\.com\/.+/,
      twitter_link: /^https:\/\/(www\.)?(twitter\.com|x\.com)\/.+/,
      youtube_link: /^https:\/\/(www\.)?youtube\.com\/.+/,
      github_link: /^https:\/\/(www\.)?github\.com\/.+/,
      portfolio_link: /^https?:\/\/.+/
    };

    Object.entries(socialFields).forEach(([field, regex]) => {
      const value = profile[field as keyof IProfileUpdateInput] as string;
      if (value && !regex.test(value)) {
        errors.push(`Invalid ${field.replace('_link', '')} URL format`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Validate profile data
   */
  validateProfileData: (data: IProfileUpdateInput): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Validate full name
    if (data.full_name && (data.full_name.length < 2 || data.full_name.length > 100)) {
      errors.push('Full name must be between 2 and 100 characters');
    }

    // Validate email
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Please provide a valid email address');
    }

    // Validate username
    if (data.username && (data.username.length < 3 || data.username.length > 30 || !/^[a-zA-Z0-9_]+$/.test(data.username))) {
      errors.push('Username must be 3-30 characters and contain only letters, numbers, and underscores');
    }

    // Validate age
    if (data.age && (data.age < 13 || data.age > 120)) {
      errors.push('Age must be between 13 and 120');
    }

    // Validate bio
    if (data.bio && data.bio.length > 1000) {
      errors.push('Bio must not exceed 1000 characters');
    }

    // Validate social URLs
    const socialValidation = profileUtils.validateSocialUrls(data);
    errors.push(...socialValidation.errors);

    // Validate phone numbers
    if (data.phone_numbers) {
      data.phone_numbers.forEach((phone, index) => {
        if (!phone.country || phone.country.length < 2 || phone.country.length > 3) {
          errors.push(`Phone number ${index + 1}: Country code must be 2-3 characters`);
        }
        if (!phone.number || !/^\+?\d{10,15}$/.test(phone.number.replace(/\s/g, ''))) {
          errors.push(`Phone number ${index + 1}: Number must be 10-15 digits`);
        }
      });
    }

    // Validate meta fields
    if (data.meta) {
      if (data.meta.graduation_year && (data.meta.graduation_year < 1950 || data.meta.graduation_year > new Date().getFullYear() + 10)) {
        errors.push('Graduation year must be between 1950 and 10 years from now');
      }

      if (data.meta.skills && data.meta.skills.length > 50) {
        errors.push('Maximum 50 skills allowed');
      }

      if (data.meta.certifications && data.meta.certifications.length > 20) {
        errors.push('Maximum 20 certifications allowed');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Format user display name
   */
  formatDisplayName: (profile: IUserProfile): string => {
    return profile.full_name || profile.username || profile.email.split('@')[0];
  },

  /**
   * Get user avatar URL with fallback
   */
  getAvatarUrl: (profile: IUserProfile, size: 'sm' | 'md' | 'lg' = 'md'): string => {
    if (profile.user_image?.url) {
      return profile.user_image.url;
    }
    
    // Generate initials-based avatar
    const name = profileUtils.formatDisplayName(profile);
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const sizeMap = { sm: 32, md: 64, lg: 128 };
    
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=${sizeMap[size]}&background=3b82f6&color=ffffff`;
  },

  /**
   * Check if profile is complete
   */
  isProfileComplete: (profile: IUserProfile): boolean => {
    const completion = profileUtils.calculateProfileCompletion(profile);
    return completion >= 80; // Consider 80% as complete
  },

  /**
   * Get missing profile fields
   */
  getMissingFields: (profile: IUserProfile): string[] => {
    const requiredFields = [
      { key: 'full_name', label: 'Full Name' },
      { key: 'phone_numbers', label: 'Phone Number' },
      { key: 'bio', label: 'Bio' },
      { key: 'user_image', label: 'Profile Picture' },
      { key: 'meta.gender', label: 'Gender' },
      { key: 'meta.education_level', label: 'Education Level' }
    ];

    return requiredFields
      .filter(field => !profileUtils.getNestedValue(profile, field.key))
      .map(field => field.label);
  },

  /**
   * Format last seen time
   */
  formatLastSeen: (lastSeen: string): string => {
    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffMs = now.getTime() - lastSeenDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return lastSeenDate.toLocaleDateString();
  },

  /**
   * Get activity status color
   */
  getActivityStatusColor: (status: string): string => {
    const colorMap = {
      online: 'text-green-500',
      away: 'text-yellow-500',
      busy: 'text-red-500',
      offline: 'text-gray-500'
    };
    return colorMap[status as keyof typeof colorMap] || colorMap.offline;
  },

  /**
   * Sanitize profile data for public display
   */
  sanitizeForPublicDisplay: (profile: IUserProfile): Partial<IUserProfile> => {
    const publicFields = [
      '_id', 'full_name', 'username', 'bio', 'user_image', 'cover_image',
      'facebook_link', 'instagram_link', 'linkedin_link', 'twitter_link',
      'youtube_link', 'github_link', 'portfolio_link', 'country',
      'is_online', 'last_seen', 'status_message', 'activity_status',
      'created_at'
    ];

    const sanitized: Partial<IUserProfile> = {};
    publicFields.forEach(field => {
      if (profile[field as keyof IUserProfile]) {
        (sanitized as any)[field] = profile[field as keyof IUserProfile];
      }
    });

    // Include public meta fields
    if (profile.meta) {
      sanitized.meta = {
        occupation: profile.meta.occupation,
        industry: profile.meta.industry,
        education_level: profile.meta.education_level,
        skills: profile.meta.skills,
        certifications: profile.meta.certifications?.map(cert => ({
          name: cert.name,
          issuer: cert.issuer,
          year: cert.year,
          is_verified: cert.is_verified
        }))
      };
    }

    return sanitized;
  }
};

// Comprehensive Profile API Object
export const profileAPI = {
  getUserProfile,
  getCurrentUserProfile,
  updateUserProfile,
  updateCurrentUserProfile,
  deleteUserProfile,
  deleteCurrentUserProfile,
  restoreUserProfile,
  getProfileStats: getUserProfileStats,
  getCurrentUserProfileStats,
  updateUserPreferences,
  updateCurrentUserPreferences,
  getAchievements: getUserAchievements,
  getSkills: getUserSkills,
  getEducation: getUserEducation,
  utils: profileUtils
};

// Export default instance
export default {
  getUserProfile,
  getCurrentUserProfile,
  updateUserProfile,
  updateCurrentUserProfile,
  deleteUserProfile,
  deleteCurrentUserProfile,
  restoreUserProfile,
  getUserProfileStats,
  getCurrentUserProfileStats,
  updateUserPreferences,
  updateCurrentUserPreferences,
  getUserAchievements,
  getUserSkills,
  getUserEducation,
  profileUtils
}; 