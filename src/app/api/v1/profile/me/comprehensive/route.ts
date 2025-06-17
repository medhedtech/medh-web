import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Comprehensive profile response interface matching the actual API response structure
interface ComprehensiveProfileData {
  basic_info: {
    id: string;
    full_name: string;
    phone_numbers: Array<{
      country: string;
      number: string;
      _id: string;
    }>;
    timezone: string;
    email: string;
    role: string[];
    admin_role: string;
    created_at: string;
    updated_at: string;
    last_seen: string;
    profile_completion: number;
  };
  profile_media: {
    user_image: {
      upload_date: string;
    };
    cover_image: {
      upload_date: string;
    };
  };
  personal_details: {
    gender: string;
    languages_spoken: any[];
    skills: any[];
    certifications: any[];
    learning_goals: any[];
    preferred_study_times: any[];
    interests: any[];
  };
  account_status: {
    is_active: boolean;
    is_banned: boolean;
    email_verified: boolean;
    phone_verified: boolean;
    identity_verified: boolean;
    account_type: string;
    subscription_status: string;
    trial_used: boolean;
    two_factor_enabled: boolean;
    failed_login_attempts: number;
  };
  learning_analytics: {
    total_learning_time: number;
    current_streak: number;
    longest_streak: number;
    certificates_earned: number;
    skill_points: number;
    achievements_unlocked: number;
    total_courses_enrolled: number;
    total_courses_completed: number;
    completion_rate: number;
    average_score: number;
    total_lessons_completed: number;
    total_assignments_completed: number;
    total_quiz_attempts: number;
    average_lesson_completion_time: number;
    last_learning_activity: string | null;
  };
  education: {
    course_stats: {
      total_enrolled: number;
      active_courses: number;
      completed_courses: number;
      on_hold_courses: number;
      cancelled_courses: number;
      expired_courses: number;
      average_progress: number;
      total_certificates: number;
      total_payments: number;
      emi_enrollments: number;
      subscription_enrollments: number;
    };
    learning_paths: Array<{
      category: string;
      courses_count: number;
      completed_count: number;
      total_progress: number;
      average_progress: number;
    }>;
    enrollments: any[];
    active_learning: any[];
    upcoming_courses: any[];
    quiz_results: any[];
    certificates: any[];
    detailed_progress: any[];
  };
  social_metrics: {
    followers_count: number;
    following_count: number;
    reviews_written: number;
    discussions_participated: number;
    content_shared: number;
    community_reputation: number;
    profile_views: number;
    likes_received: number;
  };
  engagement_metrics: {
    total_logins: number;
    total_session_time: number;
    avg_session_duration: number;
    last_active_date: string;
    consecutive_active_days: number;
    total_page_views: number;
    login_frequency: {
      daily: number;
      weekly: number;
      monthly: number;
    };
    device_preference: string;
    browser_preference: string;
    login_pattern: {
      pattern: string;
      description: string;
    };
  };
  financial_metrics: {
    total_spent: number;
    total_courses_purchased: number;
    subscription_months: number;
    lifetime_value: number;
    average_course_cost: number;
    payment_methods_used: any[];
    pending_payments: number;
    total_emi_amount: number;
    successful_transactions: number;
    failed_transactions: number;
    pending_transactions: number;
  };
  payment_history: any[];
  emi_details: any[];
  device_info: {
    registered_devices: number;
    trusted_devices: number;
    active_sessions: number;
    last_login_device: any;
    device_breakdown: {
      mobile: number;
      tablet: number;
      desktop: number;
    };
    unique_ip_addresses: number;
    security_score: number;
    recent_login_locations: any[];
  };
  preferences: {
    theme: string;
    language: string;
    currency: string;
    timezone: string;
    notifications: any;
    privacy: any;
    accessibility: any;
    content: any;
  };
  recent_activity: Array<{
    action: string;
    resource: string;
    timestamp: string;
    details: any;
    duration: number;
    ip_address?: string;
    device_type?: string;
  }>;
  account_insights: {
    account_age_days: number;
    member_since: string;
    profile_completion_percentage: number;
    verification_status: {
      email: boolean;
      phone: boolean;
      identity: boolean;
    };
    subscription_info: {
      is_subscribed: boolean;
      trial_used: boolean;
    };
    security_info: {
      two_factor_enabled: boolean;
      security_score: number;
      trusted_devices: number;
      recent_login_attempts: number;
    };
  };
  performance_indicators: {
    learning_consistency: number;
    engagement_level: string;
    progress_rate: number;
    community_involvement: number;
    payment_health: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    // Get the JWT token from cookies
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify the JWT token
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Mock comprehensive profile data
    const comprehensiveProfile = {
      basic_info: {
        id: "67cfe3a9a50dbb995b4d94da",
        full_name: "abhi",
        phone_numbers: [
          {
            country: "IN",
            number: "+917477474774",
            _id: "67cfe3a9a50dbb995b4d94db"
          }
        ],
        timezone: "UTC",
        email: "abhijha903@gmail.com",
        role: ["student"],
        admin_role: "admin",
        created_at: "2025-06-16T14:50:31.067Z",
        updated_at: "2025-06-17T09:40:43.451Z",
        last_seen: "2025-06-17T08:45:45.760Z",
        profile_completion: 32
      },
      profile_media: {
        user_image: {
          upload_date: "2025-06-16T14:50:31.067Z"
        },
        cover_image: {
          upload_date: "2025-06-16T14:50:31.067Z"
        }
      },
      personal_details: {
        gender: "Male",
        languages_spoken: [],
        skills: [],
        certifications: [],
        learning_goals: [],
        preferred_study_times: [],
        interests: []
      },
      account_status: {
        is_active: true,
        is_banned: false,
        email_verified: true,
        phone_verified: false,
        identity_verified: false,
        account_type: "free",
        subscription_status: "inactive",
        trial_used: false,
        two_factor_enabled: false,
        failed_login_attempts: 0
      },
      learning_analytics: {
        total_learning_time: 0,
        current_streak: 0,
        longest_streak: 0,
        certificates_earned: 0,
        skill_points: 0,
        total_courses_enrolled: 2,
        active_courses: 2,
        completed_courses: 0,
        courses_on_hold: 0,
        average_progress: 0,
        total_lessons_completed: 0,
        total_assignments_completed: 0,
        total_quiz_attempts: 0,
        completion_rate: 0,
        average_score: 0,
        average_lesson_time: 0
      },
      education: {
        course_stats: {
          total_enrolled: 2,
          completed: 0,
          in_progress: 2,
          dropped: 0
        },
        learning_paths: [{
          name: "Data Science Path",
          progress: 25,
          courses_completed: 0,
          total_courses: 4
        }],
        enrollments: [
          {
            course_id: "course1",
            course_title: "AI and Data Science",
            enrollment_date: "2025-06-16T14:50:31.067Z",
            progress: 15,
            status: "active"
          },
          {
            course_id: "course2", 
            course_title: "Digital Marketing",
            enrollment_date: "2025-06-16T14:50:31.067Z",
            progress: 10,
            status: "active"
          }
        ],
        active_learning: [],
        upcoming_courses: [{
          course_id: "course3",
          course_title: "Advanced Analytics",
          start_date: "2025-07-01T00:00:00.000Z"
        }]
      },
      social_metrics: {
        followers_count: 0,
        following_count: 0,
        reviews_written: 0,
        discussions_participated: 0,
        content_shared: 0,
        reputation_score: 0
      },
      engagement_metrics: {
        total_logins: 22,
        total_session_time: 0,
        avg_session_duration: 0,
        last_active_date: "2025-06-17T08:45:45.773Z",
        consecutive_active_days: 0,
        page_views: 0
      },
      financial_metrics: {
        total_spent: 0,
        total_courses_purchased: 2,
        subscription_months: 0,
        lifetime_value: 0,
        average_course_cost: 0,
        payment_methods_used: [],
        pending_payments: 0,
        total_emi_amount: 0,
        successful_transactions: 0,
        failed_transactions: 0,
        pending_transactions: 0
      },
      device_info: {
        registered_devices: 0,
        trusted_devices: 0,
        active_sessions: 11,
        last_login_device: null,
        device_breakdown: {
          mobile: 0,
          tablet: 0,
          desktop: 0
        },
        recent_login_locations: [],
        unique_ip_addresses: 0,
        security_score: 100
      },
      performance_indicators: {
        learning_consistency: 0,
        engagement_level: "low",
        progress_rate: 0,
        community_involvement: 0,
        payment_health: 100
      },
      account_insights: {
        account_age_days: 0,
        member_since: "2025-06-16T14:50:31.067Z",
        profile_completion_percentage: 32,
        verification_status: {
          email: true,
          phone: false,
          identity: false
        },
        subscription_info: {
          is_subscribed: false,
          trial_used: false
        },
        security_info: {
          two_factor_enabled: false,
          trusted_devices: 0,
          recent_login_attempts: 0,
          security_score: 100
        }
      }
    };

    return NextResponse.json({
      success: true,
      message: "Comprehensive profile retrieved successfully",
      data: comprehensiveProfile
    });

  } catch (error) {
    console.error('Error fetching comprehensive profile:', error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch comprehensive profile",
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 