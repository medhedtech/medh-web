// Common types for MEDH API integration
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  status?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    type: string;
    msg: string;
    path: string;
    location: string;
    value?: any;
  }>;
  error_code?: string;
  hint?: string;
}

export interface PhoneNumber {
  country: string;
  number: string;
  type?: string;
  isVerified?: boolean;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: {
    id: string;
    name: string;
  };
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  duration_weeks: number;
  price: number;
  rating: number;
  total_students: number;
  thumbnail?: string;
  status: 'active' | 'inactive' | 'coming_soon';
}

export interface CourseProgress {
  course_id: string;
  course_title: string;
  progress_percentage: number;
  current_module: string;
  modules_completed: number;
  total_modules: number;
  last_accessed: string;
  estimated_completion: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  type: 'completion' | 'performance' | 'streak' | 'milestone';
  earned_date: string;
  points_awarded: number;
  badge_url?: string;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: string[];
  user_image?: {
    upload_date: string;
  };
  account_type: 'free' | 'premium' | 'enterprise';
  email_verified: boolean;
  profile_completion: number;
  is_online: boolean;
  last_seen: string;
  statistics: UserStatistics;
}

export interface UserStatistics {
  learning: {
    total_courses_enrolled: number;
    total_courses_completed: number;
    total_learning_time: number;
    current_streak: number;
    longest_streak: number;
    certificates_earned: number;
    skill_points: number;
    achievements_unlocked: number;
  };
  engagement: {
    total_logins: number;
    total_session_time: number;
    avg_session_duration: number;
    last_active_date: string;
    consecutive_active_days: number;
    total_page_views: number;
    feature_usage_count: Record<string, number>;
  };
  social: {
    reviews_written: number;
    discussions_participated: number;
    content_shared: number;
    followers_count: number;
    following_count: number;
    community_reputation: number;
  };
  financial: {
    total_spent: number;
    total_courses_purchased: number;
    subscription_months: number;
    refunds_requested: number;
    lifetime_value: number;
  };
}

// Request/Response wrapper types that extend existing IApiResponse
export interface EnhancedApiResponse<T = any> extends ApiResponse<T> {
  results?: number;
  error?: string;
}

// Backwards compatibility with existing interface
export interface IApiResponse<T = any> extends EnhancedApiResponse<T> {
  status: string;
}