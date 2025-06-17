import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Calendar, Award, BookOpen, Clock, TrendingUp, Users, MessageSquare, Star, 
  DollarSign, Monitor, Shield, CheckCircle, XCircle, BarChart3, Target, Activity, 
  CreditCard, Smartphone, Tablet, Laptop, Globe, Eye, MousePointer, Timer, Brain, 
  Heart, Zap, FileText, Settings, Edit, UserCircle, GraduationCap, Link2,
  Facebook, Instagram, Linkedin, Twitter, Youtube, Github
} from 'lucide-react';
import { getComprehensiveUserProfile, updateCurrentUserComprehensiveProfile } from '@/apis/profile.api';
import { showToast } from '@/utils/toastManager';

// Interfaces
interface ComprehensiveProfile {
  basic_info: {
    id: string;
    full_name: string;
    username: string;
    email: string;
    student_id: string;
    phone_numbers: Array<{
      country: string;
      number: string;
      is_primary: boolean;
      is_verified: boolean;
    }>;
    age: number;
    age_group: string;
    address: string;
    organization: string;
    bio: string;
    country: string;
    timezone: string;
    facebook_link: string;
    instagram_link: string;
    linkedin_link: string;
    twitter_link: string;
    youtube_link: string;
    github_link: string;
    portfolio_link: string;
    role: string;
    admin_role?: string;
    created_at: string;
    updated_at: string;
    last_seen: string;
    profile_completion: number;
  };
  profile_media: {
    user_image?: {
      url: string;
      public_id: string;
      alt_text: string;
    };
    cover_image?: {
      url: string;
      public_id: string;
      alt_text: string;
    };
  };
  personal_details: {
    date_of_birth: string;
    gender: string;
    nationality: string;
    languages_spoken: Array<{
      language: string;
      proficiency: string;
    }>;
    occupation: string;
    industry: string;
    company: string;
    experience_level: string;
    annual_income_range: string;
    education_level: string;
    institution_name: string;
    field_of_study: string;
    graduation_year: string;
    skills: string[];
    certifications: string[];
    interests: string[];
    learning_goals: string[];
    preferred_study_times: string[];
    career_goals: string[];
    hobbies: string[];
    personality_traits: string[];
    learning_style: string;
    motivation_factors: string[];
    preferred_communication_methods: string[];
    availability_hours: string;
    special_accommodations: string[];
    emergency_contact: {
      name: string;
      relationship: string;
      phone: string;
      email: string;
    };
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
    total_courses_enrolled: number;
    active_courses: number;
    completed_courses: number;
    courses_on_hold: number;
    average_progress: number;
    total_lessons_completed: number;
    total_assignments_completed: number;
    total_quiz_attempts: number;
    completion_rate: number;
    average_score: number;
    average_lesson_time: number;
  };
  education: any;
  social_metrics: {
    followers_count: number;
    following_count: number;
    reviews_written: number;
    discussions_participated: number;
    content_shared: number;
    reputation_score: number;
  };
  engagement_metrics: {
    total_logins: number;
    total_session_time: number;
    avg_session_duration: number;
    consecutive_active_days: number;
    page_views: number;
    last_active_date?: string;
  };
  financial_metrics: {
    total_spent: number;
    total_courses_purchased: number;
    successful_transactions: number;
    lifetime_value: number;
  };
  device_info: {
    active_sessions: number;
    trusted_devices: number;
    unique_ip_addresses: number;
    device_breakdown: {
      mobile: number;
      tablet: number;
      desktop: number;
    };
    security_score?: number;
  };
  performance_indicators: {
    learning_consistency: number;
    engagement_level: string;
    progress_rate: number;
    community_involvement: number;
    payment_health: number;
  };
  account_insights: {
    member_since: string;
    profile_completion_percentage: number;
    security_score: number;
  };
}

interface StudentProfilePageProps {
  studentId?: string;
}

const StudentProfilePage: React.FC<StudentProfilePageProps> = ({ studentId }) => {
  const [profile, setProfile] = useState<ComprehensiveProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Edit states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editData, setEditData] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Helper functions
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    if (amount === 0) return '₹0';
    const formatters: { [key: string]: Intl.NumberFormat } = {
      'INR': new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }),
      'USD': new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
    };
    return formatters[currency]?.format(amount) || `${currency} ${amount}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Edit functions
  const handleEditProfile = () => {
    setEditData({
      // Basic Information
      full_name: profile?.basic_info.full_name || '',
      phone_number: profile?.basic_info.phone_numbers?.[0]?.number || '',
      bio: profile?.basic_info.bio || '',
      age: profile?.basic_info.age || '',
      address: profile?.basic_info.address || '',
      organization: profile?.basic_info.organization || '',
      country: profile?.basic_info.country || '',
      timezone: profile?.basic_info.timezone || '',
      
      // Personal Details
      date_of_birth: profile?.personal_details.date_of_birth || '',
      gender: profile?.personal_details.gender || '',
      nationality: profile?.personal_details.nationality || '',
      occupation: profile?.personal_details.occupation || '',
      industry: profile?.personal_details.industry || '',
      company: profile?.personal_details.company || '',
      experience_level: profile?.personal_details.experience_level || '',
      annual_income_range: profile?.personal_details.annual_income_range || '',
      languages_spoken: profile?.personal_details.languages_spoken?.map(l => l.language) || [],
      interests: profile?.personal_details.interests || [],
      
      // Skills & Education
      skills: profile?.personal_details.skills || [],
      certifications: profile?.personal_details.certifications || [],
      learning_goals: profile?.personal_details.learning_goals || [],
      preferred_study_times: profile?.personal_details.preferred_study_times || [],
      
      // Social Media Links
      facebook_link: profile?.basic_info.facebook_link || '',
      instagram_link: profile?.basic_info.instagram_link || '',
      linkedin_link: profile?.basic_info.linkedin_link || '',
      twitter_link: profile?.basic_info.twitter_link || '',
      youtube_link: profile?.basic_info.youtube_link || '',
      github_link: profile?.basic_info.github_link || '',
      portfolio_link: profile?.basic_info.portfolio_link || ''
    });
    setIsEditingProfile(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Prepare the data for API call
      const updateData = {
        // Basic Information
        full_name: editData.full_name,
        bio: editData.bio,
        
        // Phone numbers - convert string to array format
        phone_numbers: editData.phone_number ? [{
          country: 'IN', // Default to India, you can make this dynamic
          number: editData.phone_number
        }] : undefined,
        
        // Personal details in meta object
        meta: {
          date_of_birth: editData.date_of_birth,
          gender: editData.gender,
          nationality: editData.nationality,
          occupation: editData.occupation,
          industry: editData.industry,
          company: editData.company,
          experience_level: editData.experience_level,
          annual_income_range: editData.annual_income_range,
          skills: editData.skills,
          certifications: editData.certifications,
          languages_spoken: editData.languages_spoken?.map((lang: string) => ({
            language: lang,
            proficiency: 'fluent' // Default proficiency, you can make this dynamic
          }))
        },
        
        // Social Media Links
        facebook_link: editData.facebook_link,
        instagram_link: editData.instagram_link,
        linkedin_link: editData.linkedin_link,
        twitter_link: editData.twitter_link,
        youtube_link: editData.youtube_link,
        github_link: editData.github_link,
        portfolio_link: editData.portfolio_link,
        
        // Other fields
        timezone: editData.timezone,
        country: editData.country,
        address: editData.address,
        organization: editData.organization,
        age: editData.age
      };

      // Remove undefined values to avoid sending empty data
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof typeof updateData] === undefined || updateData[key as keyof typeof updateData] === '') {
          delete updateData[key as keyof typeof updateData];
        }
      });

      console.log('Saving profile with data:', updateData);
      
      // Make API call to update profile using comprehensive endpoint
      const response = await updateCurrentUserComprehensiveProfile(updateData);
      
      if (response.data) {
        showToast.dismiss(); // Dismiss any existing toasts
        showshowToast.success('Profile updated successfully!', { groupKey: 'profile-update' });
        
        // Auto-refresh the profile data using the centralized fetchProfile function
        await fetchProfile();
        
        // Close the edit modal
        handleCancel();
      } else {
        throw new Error('Failed to update profile');
      }
      
    } catch (error: unknown) {
      console.error('Error saving profile:', error);
      
      // Show specific error message
      let errorMessage = 'Failed to update profile. Please try again.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        const errorObj = error as any;
        errorMessage = errorObj?.response?.data?.message || 
                      errorObj?.message || 
                      errorMessage;
        
        // If validation errors, show them
        if (errorObj?.response?.data?.errors && Array.isArray(errorObj.response.data.errors)) {
          showToast.dismiss(); // Dismiss any existing toasts
          errorObj.response.data.errors.forEach((err: any) => {
            showToast.error(`${err.field}: ${err.message}`, { groupKey: 'profile-validation' });
          });
        }
      }
      
      showToast.dismiss(); // Dismiss any existing toasts
      showToast.error(errorMessage, { groupKey: 'profile-update' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditingProfile(false);
    setEditData({});
  };

  const addItem = (field: string, value: string) => {
    if (value.trim() && !editData[field]?.includes(value.trim())) {
      setEditData(prev => ({
        ...prev,
        [field]: [...(prev[field] || []), value.trim()]
      }));
    }
  };

  const removeItem = (field: string, index: number) => {
    setEditData(prev => ({
      ...prev,
      [field]: prev[field]?.filter((_: any, i: number) => i !== index) || []
    }));
  };

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      // Use different loading states for initial load vs refresh
      if (profile) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const response = await getComprehensiveUserProfile();
      
      const serverResponse = response.data as any;
      
      if (serverResponse && serverResponse.success && serverResponse.data) {
        const apiData = serverResponse.data as any;
        
        const transformedProfile: ComprehensiveProfile = {
            basic_info: {
              id: apiData.basic_info?.id || '',
              full_name: apiData.basic_info?.full_name || '',
              email: apiData.basic_info?.email || '',
              username: apiData.basic_info?.username || '',
              student_id: apiData.basic_info?.student_id || '',
              phone_numbers: apiData.basic_info?.phone_numbers || [],
              age: apiData.basic_info?.age || 0,
              age_group: apiData.basic_info?.age_group || '',
              address: apiData.basic_info?.address || '',
              organization: apiData.basic_info?.organization || '',
              bio: apiData.basic_info?.bio || '',
              country: apiData.basic_info?.country || '',
              timezone: apiData.basic_info?.timezone || '',
              facebook_link: apiData.basic_info?.facebook_link || '',
              instagram_link: apiData.basic_info?.instagram_link || '',
              linkedin_link: apiData.basic_info?.linkedin_link || '',
              twitter_link: apiData.basic_info?.twitter_link || '',
              youtube_link: apiData.basic_info?.youtube_link || '',
              github_link: apiData.basic_info?.github_link || '',
              portfolio_link: apiData.basic_info?.portfolio_link || '',
              role: Array.isArray(apiData.basic_info?.role) ? apiData.basic_info.role[0] : (apiData.basic_info?.role || 'student'),
              admin_role: apiData.basic_info?.admin_role,
              created_at: apiData.basic_info?.created_at || new Date().toISOString(),
              updated_at: apiData.basic_info?.updated_at || new Date().toISOString(),
              last_seen: apiData.basic_info?.last_seen || new Date().toISOString(),
              profile_completion: apiData.basic_info?.profile_completion || 0,
            },
            profile_media: {
              user_image: apiData.profile_media?.user_image,
              cover_image: apiData.profile_media?.cover_image,
            },
            personal_details: {
              date_of_birth: apiData.personal_details?.date_of_birth || '',
              gender: apiData.personal_details?.gender || '',
              nationality: apiData.personal_details?.nationality || '',
              languages_spoken: apiData.personal_details?.languages_spoken || [],
              occupation: apiData.personal_details?.occupation || '',
              industry: apiData.personal_details?.industry || '',
              company: apiData.personal_details?.company || '',
              experience_level: apiData.personal_details?.experience_level || '',
              annual_income_range: apiData.personal_details?.annual_income_range || '',
              education_level: apiData.personal_details?.education_level || '',
              institution_name: apiData.personal_details?.institution_name || '',
              field_of_study: apiData.personal_details?.field_of_study || '',
              graduation_year: apiData.personal_details?.graduation_year || '',
              skills: apiData.personal_details?.skills || [],
              certifications: apiData.personal_details?.certifications || [],
              interests: apiData.personal_details?.interests || [],
              learning_goals: apiData.personal_details?.learning_goals || [],
              preferred_study_times: apiData.personal_details?.preferred_study_times || [],
              career_goals: apiData.personal_details?.career_goals || [],
              hobbies: apiData.personal_details?.hobbies || [],
              personality_traits: apiData.personal_details?.personality_traits || [],
              learning_style: apiData.personal_details?.learning_style || '',
              motivation_factors: apiData.personal_details?.motivation_factors || [],
              preferred_communication_methods: apiData.personal_details?.preferred_communication_methods || [],
              availability_hours: apiData.personal_details?.availability_hours || '',
              special_accommodations: apiData.personal_details?.special_accommodations || [],
              emergency_contact: apiData.personal_details?.emergency_contact || {
                name: '',
                relationship: '',
                phone: '',
                email: ''
              },
            },
            account_status: {
              is_active: apiData.account_status?.is_active || false,
              is_banned: apiData.account_status?.is_banned || false,
              email_verified: apiData.account_status?.email_verified || false,
              phone_verified: apiData.account_status?.phone_verified || false,
              identity_verified: apiData.account_status?.identity_verified || false,
              account_type: apiData.account_status?.account_type || 'free',
              subscription_status: apiData.account_status?.subscription_status || 'inactive',
              trial_used: apiData.account_status?.trial_used || false,
              two_factor_enabled: apiData.account_status?.two_factor_enabled || false,
              failed_login_attempts: apiData.account_status?.failed_login_attempts || 0,
            },
            learning_analytics: {
              total_learning_time: apiData.learning_analytics?.total_learning_time || 0,
              current_streak: apiData.learning_analytics?.current_streak || 0,
              longest_streak: apiData.learning_analytics?.longest_streak || 0,
              certificates_earned: apiData.learning_analytics?.certificates_earned || 0,
              skill_points: apiData.learning_analytics?.skill_points || 0,
              total_courses_enrolled: apiData.learning_analytics?.total_courses_enrolled || 0,
              active_courses: apiData.learning_analytics?.active_courses || 0,
              completed_courses: apiData.learning_analytics?.completed_courses || 0,
              courses_on_hold: apiData.learning_analytics?.courses_on_hold || 0,
              average_progress: apiData.learning_analytics?.average_progress || 0,
              total_lessons_completed: apiData.learning_analytics?.total_lessons_completed || 0,
              total_assignments_completed: apiData.learning_analytics?.total_assignments_completed || 0,
              total_quiz_attempts: apiData.learning_analytics?.total_quiz_attempts || 0,
              completion_rate: apiData.learning_analytics?.completion_rate || 0,
              average_score: apiData.learning_analytics?.average_score || 0,
              average_lesson_time: apiData.learning_analytics?.average_lesson_time || 0,
            },
            education: apiData.education || {},
            social_metrics: {
              followers_count: apiData.social_metrics?.followers_count || 0,
              following_count: apiData.social_metrics?.following_count || 0,
              reviews_written: apiData.social_metrics?.reviews_written || 0,
              discussions_participated: apiData.social_metrics?.discussions_participated || 0,
              content_shared: apiData.social_metrics?.content_shared || 0,
              reputation_score: apiData.social_metrics?.reputation_score || 0,
            },
            engagement_metrics: {
              total_logins: apiData.engagement_metrics?.total_logins || 0,
              total_session_time: apiData.engagement_metrics?.total_session_time || 0,
              avg_session_duration: apiData.engagement_metrics?.avg_session_duration || 0,
              consecutive_active_days: apiData.engagement_metrics?.consecutive_active_days || 0,
              page_views: apiData.engagement_metrics?.page_views || 0,
              last_active_date: apiData.engagement_metrics?.last_active_date,
            },
            financial_metrics: {
              total_spent: apiData.financial_metrics?.total_spent || 0,
              total_courses_purchased: apiData.financial_metrics?.total_courses_purchased || 0,
              successful_transactions: apiData.financial_metrics?.successful_transactions || 0,
              lifetime_value: apiData.financial_metrics?.lifetime_value || 0,
            },
            device_info: {
              active_sessions: apiData.device_info?.active_sessions || 0,
              trusted_devices: apiData.device_info?.trusted_devices || 0,
              unique_ip_addresses: apiData.device_info?.unique_ip_addresses || 0,
              device_breakdown: {
                mobile: apiData.device_info?.device_breakdown?.mobile || 0,
                tablet: apiData.device_info?.device_breakdown?.tablet || 0,
                desktop: apiData.device_info?.device_breakdown?.desktop || 0,
              },
              security_score: apiData.device_info?.security_score,
            },
            performance_indicators: {
              learning_consistency: apiData.performance_indicators?.learning_consistency || 0,
              engagement_level: apiData.performance_indicators?.engagement_level || 'low',
              progress_rate: apiData.performance_indicators?.progress_rate || 0,
              community_involvement: apiData.performance_indicators?.community_involvement || 0,
              payment_health: apiData.performance_indicators?.payment_health || 100,
            },
            account_insights: {
              member_since: apiData.account_insights?.member_since || apiData.basic_info?.created_at || new Date().toISOString(),
              profile_completion_percentage: apiData.account_insights?.profile_completion_percentage || apiData.basic_info?.profile_completion || 0,
              security_score: apiData.account_insights?.security_score || 100,
            },
          };
          
          setProfile(transformedProfile);
          
          // Show success message only if it's a manual refresh (not initial load)
          if (profile) {
            showToast.dismiss(); // Dismiss any existing toasts
            showshowToast.success('Profile data refreshed successfully!', { groupKey: 'profile-refresh' });
          }
        } else {
          const errorMessage = serverResponse?.message || 'Failed to load profile data';
          throw new Error(errorMessage);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data. Please try again.');
        showToast.dismiss(); // Dismiss any existing toasts
        showToast.error('Failed to refresh profile data. Please try again.', { groupKey: 'profile-refresh' });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

  // Initial fetch on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  // Auto-refresh when window regains focus
  useEffect(() => {
    const handleFocus = () => {
      // Only refresh if profile is already loaded and not currently loading
      if (profile && !loading && !refreshing) {
        fetchProfile();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [profile, loading, refreshing]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
        <p className="text-gray-600 dark:text-gray-400">No profile data available</p>
      </div>
    );
  }

  // Tab configuration
  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'learning', label: 'Learning Analytics', icon: Brain },
    { id: 'courses', label: 'Courses & Progress', icon: BookOpen },
    { id: 'financial', label: 'Financial', icon: DollarSign },
    { id: 'engagement', label: 'Engagement', icon: Activity },
    { id: 'security', label: 'Security & Devices', icon: Shield },
    { id: 'personal', label: 'Personal Details', icon: FileText }
  ];

  const { 
    basic_info, 
    profile_media,
    learning_analytics, 
    education, 
    account_status, 
    personal_details, 
    social_metrics, 
    engagement_metrics,
    financial_metrics,
    device_info,
    performance_indicators,
    account_insights
  } = profile;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Fixed Header with Profile Info */}
        <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {basic_info?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">{basic_info?.full_name || 'Unknown User'}</h1>
                    {refreshing && (
                      <div className="flex items-center text-blue-600">
                        <svg className="animate-spin h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="text-xs">Refreshing...</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{basic_info?.email || 'No email'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Profile Completion</p>
                  <p className="text-lg font-bold text-blue-600">{basic_info?.profile_completion || 0}%</p>
                </div>
                <button 
                  onClick={() => fetchProfile()}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  title="Refresh Profile Data"
                  disabled={loading || refreshing}
                >
                  <svg className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button 
                  onClick={handleEditProfile}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Edit Profile"
                >
                  <Edit className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="px-4 md:px-6">
            <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-t-lg whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-b-2 border-blue-600'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4 md:p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                                 {/* Quick Stats Grid */}
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                   <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                     <div className="flex items-center justify-between">
                       <div>
                         <p className="text-sm text-gray-500 dark:text-gray-400">Total Courses</p>
                         <p className="text-2xl font-bold text-gray-900 dark:text-white">{learning_analytics.total_courses_enrolled}</p>
                       </div>
                       <BookOpen className="h-8 w-8 text-blue-600" />
                     </div>
                   </div>
                   
                   <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                     <div className="flex items-center justify-between">
                       <div>
                         <p className="text-sm text-gray-500 dark:text-gray-400">Certificates</p>
                         <p className="text-2xl font-bold text-gray-900 dark:text-white">{learning_analytics.certificates_earned}</p>
                       </div>
                       <Award className="h-8 w-8 text-yellow-600" />
                     </div>
                   </div>
                   
                   <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                     <div className="flex items-center justify-between">
                       <div>
                         <p className="text-sm text-gray-500 dark:text-gray-400">Streak</p>
                         <p className="text-2xl font-bold text-gray-900 dark:text-white">{learning_analytics.current_streak}</p>
                       </div>
                       <TrendingUp className="h-8 w-8 text-green-600" />
                     </div>
                   </div>
                   
                   <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                     <div className="flex items-center justify-between">
                       <div>
                         <p className="text-sm text-gray-500 dark:text-gray-400">Learning Time</p>
                         <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatDuration(learning_analytics.total_learning_time)}</p>
                       </div>
                       <Clock className="h-8 w-8 text-purple-600" />
                     </div>
                   </div>
                 </div>

                 {/* Learning Progress */}
                 <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-6">
                   <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                     <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                     Learning Progress
                   </h3>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <div className="text-center">
                       <div className="text-2xl font-bold text-blue-600">{learning_analytics.active_courses}</div>
                       <div className="text-sm text-gray-500 dark:text-gray-400">Active</div>
                     </div>
                     <div className="text-center">
                       <div className="text-2xl font-bold text-green-600">{learning_analytics.completed_courses}</div>
                       <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
                     </div>
                     <div className="text-center">
                       <div className="text-2xl font-bold text-orange-600">{learning_analytics.courses_on_hold}</div>
                       <div className="text-sm text-gray-500 dark:text-gray-400">On Hold</div>
                     </div>
                     <div className="text-center">
                       <div className="text-2xl font-bold text-purple-600">{learning_analytics.average_progress}%</div>
                       <div className="text-sm text-gray-500 dark:text-gray-400">Avg Progress</div>
                     </div>
                   </div>
                 </div>

                 {/* Account Details & Community */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                     <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                       <User className="h-5 w-5 mr-2 text-green-600" />
                       Account Details
                     </h3>
                     <div className="space-y-3">
                       <div className="flex items-center justify-between">
                         <span className="text-sm text-gray-600 dark:text-gray-400">Email</span>
                         <div className="flex items-center">
                                                       <span className="text-sm font-medium text-gray-900 dark:text-white mr-2">{basic_info?.email}</span>
                           {account_status.email_verified ? (
                             <CheckCircle className="h-4 w-4 text-green-500" />
                           ) : (
                             <XCircle className="h-4 w-4 text-red-500" />
                           )}
                         </div>
                       </div>
                       <div className="flex items-center justify-between">
                         <span className="text-sm text-gray-600 dark:text-gray-400">Member Since</span>
                         <span className="text-sm font-medium text-gray-900 dark:text-white">
                           {formatDate(account_insights.member_since)}
                         </span>
                       </div>
                     </div>
                   </div>

                   <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                     <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                       <Users className="h-5 w-5 mr-2 text-blue-600" />
                       Community
                     </h3>
                     <div className="grid grid-cols-2 gap-4">
                       <div className="text-center">
                         <div className="text-lg font-bold text-gray-900 dark:text-white">{social_metrics.followers_count}</div>
                         <div className="text-sm text-gray-500 dark:text-gray-400">Followers</div>
                       </div>
                       <div className="text-center">
                         <div className="text-lg font-bold text-gray-900 dark:text-white">{social_metrics.following_count}</div>
                         <div className="text-sm text-gray-500 dark:text-gray-400">Following</div>
                       </div>
                       <div className="text-center">
                         <div className="text-lg font-bold text-gray-900 dark:text-white">{social_metrics.reviews_written}</div>
                         <div className="text-sm text-gray-500 dark:text-gray-400">Reviews Written</div>
                       </div>
                       <div className="text-center">
                         <div className="text-lg font-bold text-gray-900 dark:text-white">{social_metrics.reputation_score}</div>
                         <div className="text-sm text-gray-500 dark:text-gray-400">Reputation</div>
                       </div>
                     </div>
                   </div>
                 </div>
              </motion.div>
            )}

            {activeTab === 'learning' && (
              <motion.div
                key="learning"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                                 {/* Achievements Section */}
                 <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-6">
                   <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                     <Award className="h-5 w-5 mr-2 text-yellow-600" />
                     Achievements
                   </h3>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                       <div className="text-2xl font-bold text-yellow-600">{learning_analytics.skill_points}</div>
                       <div className="text-sm text-yellow-700 dark:text-yellow-300">Skill Points</div>
                     </div>
                     <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                       <div className="text-2xl font-bold text-green-600">{learning_analytics.certificates_earned}</div>
                       <div className="text-sm text-green-700 dark:text-green-300">Achievements</div>
                     </div>
                     <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                       <div className="text-2xl font-bold text-purple-600">{learning_analytics.longest_streak}</div>
                       <div className="text-sm text-purple-700 dark:text-purple-300">Longest Streak</div>
                     </div>
                     <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                       <div className="text-2xl font-bold text-blue-600">{learning_analytics.completion_rate}%</div>
                       <div className="text-sm text-blue-700 dark:text-blue-300">Completion Rate</div>
                     </div>
                   </div>
                 </div>

                 {/* Detailed Learning Analytics */}
                 <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                   <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                     <Brain className="h-5 w-5 mr-2 text-purple-600" />
                     Detailed Learning Analytics
                   </h3>
                   <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                     <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                       <div className="text-lg font-bold text-blue-600">{learning_analytics.total_lessons_completed}</div>
                       <div className="text-sm text-blue-700 dark:text-blue-300">Lessons Completed</div>
                     </div>
                     <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                       <div className="text-lg font-bold text-green-600">{learning_analytics.total_assignments_completed}</div>
                       <div className="text-sm text-green-700 dark:text-green-300">Assignments Done</div>
                     </div>
                     <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                       <div className="text-lg font-bold text-yellow-600">{learning_analytics.total_quiz_attempts}</div>
                       <div className="text-sm text-yellow-700 dark:text-yellow-300">Quiz Attempts</div>
                     </div>
                     <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                       <div className="text-lg font-bold text-purple-600">{learning_analytics.completion_rate}%</div>
                       <div className="text-sm text-purple-700 dark:text-purple-300">Completion Rate</div>
                     </div>
                     <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                       <div className="text-lg font-bold text-orange-600">{learning_analytics.average_score}%</div>
                       <div className="text-sm text-orange-700 dark:text-orange-300">Average Score</div>
                     </div>
                     <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                       <div className="text-lg font-bold text-indigo-600">{formatDuration(learning_analytics.average_lesson_time)}</div>
                       <div className="text-sm text-indigo-700 dark:text-indigo-300">Avg Lesson Time</div>
                     </div>
                   </div>
                 </div>

                 {/* Financial Overview */}
                 <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-6">
                   <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                     <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                     Financial Overview
                   </h3>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                       <div className="text-lg font-bold text-gray-900 dark:text-white">
                         {formatCurrency(financial_metrics.total_spent)}
                       </div>
                       <div className="text-sm text-gray-600 dark:text-gray-400">Total Spent</div>
                     </div>
                     <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                       <div className="text-lg font-bold text-gray-900 dark:text-white">{financial_metrics.total_courses_purchased}</div>
                       <div className="text-sm text-gray-600 dark:text-gray-400">Courses Purchased</div>
                     </div>
                     <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                       <div className="text-lg font-bold text-gray-900 dark:text-white">{financial_metrics.successful_transactions}</div>
                       <div className="text-sm text-gray-600 dark:text-gray-400">Successful Payments</div>
                     </div>
                     <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                       <div className="text-lg font-bold text-gray-900 dark:text-white">
                         {formatCurrency(financial_metrics.lifetime_value)}
                       </div>
                       <div className="text-sm text-gray-600 dark:text-gray-400">Lifetime Value</div>
                     </div>
                   </div>
                 </div>

                 {/* Device & Security Info */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                   <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                     <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                       <Monitor className="h-5 w-5 mr-2 text-purple-600" />
                       Device Information
                     </h3>
                     <div className="space-y-4">
                       <div className="flex items-center justify-between">
                         <span className="text-sm text-gray-600 dark:text-gray-400">Active Sessions</span>
                         <span className="text-sm font-medium text-gray-900 dark:text-white">{device_info.active_sessions}</span>
                       </div>
                       <div className="flex items-center justify-between">
                         <span className="text-sm text-gray-600 dark:text-gray-400">Trusted Devices</span>
                         <span className="text-sm font-medium text-gray-900 dark:text-white">{device_info.trusted_devices}</span>
                       </div>
                       <div className="flex items-center justify-between">
                         <span className="text-sm text-gray-600 dark:text-gray-400">Unique IPs</span>
                         <span className="text-sm font-medium text-gray-900 dark:text-white">{device_info.unique_ip_addresses}</span>
                       </div>
                       <div className="mt-4">
                         <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Device Breakdown</h4>
                         <div className="grid grid-cols-3 gap-2 text-center">
                           <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                             <div className="text-lg font-bold text-gray-900 dark:text-white">{device_info.device_breakdown.mobile}</div>
                             <div className="text-xs text-gray-500 dark:text-gray-400">Mobile</div>
                           </div>
                           <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                             <div className="text-lg font-bold text-gray-900 dark:text-white">{device_info.device_breakdown.tablet}</div>
                             <div className="text-xs text-gray-500 dark:text-gray-400">Tablet</div>
                           </div>
                           <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                             <div className="text-lg font-bold text-gray-900 dark:text-white">{device_info.device_breakdown.desktop}</div>
                             <div className="text-xs text-gray-500 dark:text-gray-400">Desktop</div>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>

                   <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                     <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                       <Shield className="h-5 w-5 mr-2 text-green-600" />
                       Security Overview
                     </h3>
                     <div className="space-y-4">
                       <div className="flex items-center justify-between">
                         <span className="text-sm text-gray-600 dark:text-gray-400">Security Score</span>
                         <span className="text-sm font-medium text-green-600">{account_insights.security_score}/100</span>
                       </div>
                       <div className="flex items-center justify-between">
                         <span className="text-sm text-gray-600 dark:text-gray-400">2FA Enabled</span>
                         {account_status.two_factor_enabled ? (
                           <CheckCircle className="h-4 w-4 text-green-500" />
                         ) : (
                           <XCircle className="h-4 w-4 text-red-500" />
                         )}
                       </div>
                       <div className="flex items-center justify-between">
                         <span className="text-sm text-gray-600 dark:text-gray-400">Failed Login Attempts</span>
                         <span className="text-sm font-medium text-gray-900 dark:text-white">{account_status.failed_login_attempts}</span>
                       </div>
                       <div className="mt-4">
                         <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Account Verification</h4>
                         <div className="space-y-2">
                           <div className="flex items-center justify-between">
                             <span className="text-xs text-gray-500 dark:text-gray-400">Email</span>
                             {account_status.email_verified ? (
                               <CheckCircle className="h-4 w-4 text-green-500" />
                             ) : (
                               <XCircle className="h-4 w-4 text-red-500" />
                             )}
                           </div>
                           <div className="flex items-center justify-between">
                             <span className="text-xs text-gray-500 dark:text-gray-400">Phone</span>
                             {account_status.phone_verified ? (
                               <CheckCircle className="h-4 w-4 text-green-500" />
                             ) : (
                               <XCircle className="h-4 w-4 text-red-500" />
                             )}
                           </div>
                           <div className="flex items-center justify-between">
                             <span className="text-xs text-gray-500 dark:text-gray-400">Identity</span>
                             {account_status.identity_verified ? (
                               <CheckCircle className="h-4 w-4 text-green-500" />
                             ) : (
                               <XCircle className="h-4 w-4 text-red-500" />
                             )}
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>

                 {/* Engagement & Performance */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                   <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                     <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                       <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                       Engagement Metrics
                     </h3>
                     <div className="space-y-4">
                       <div className="flex items-center justify-between">
                         <span className="text-sm text-gray-600 dark:text-gray-400">Total Logins</span>
                         <span className="text-sm font-medium text-gray-900 dark:text-white">{engagement_metrics.total_logins}</span>
                       </div>
                       <div className="flex items-center justify-between">
                         <span className="text-sm text-gray-600 dark:text-gray-400">Session Time</span>
                         <span className="text-sm font-medium text-gray-900 dark:text-white">{formatDuration(engagement_metrics.total_session_time)}</span>
                       </div>
                       <div className="flex items-center justify-between">
                         <span className="text-sm text-gray-600 dark:text-gray-400">Avg Session</span>
                         <span className="text-sm font-medium text-gray-900 dark:text-white">{formatDuration(engagement_metrics.avg_session_duration)}</span>
                       </div>
                       <div className="flex items-center justify-between">
                         <span className="text-sm text-gray-600 dark:text-gray-400">Active Days</span>
                         <span className="text-sm font-medium text-gray-900 dark:text-white">{engagement_metrics.consecutive_active_days}</span>
                       </div>
                       <div className="flex items-center justify-between">
                         <span className="text-sm text-gray-600 dark:text-gray-400">Page Views</span>
                         <span className="text-sm font-medium text-gray-900 dark:text-white">{engagement_metrics.page_views}</span>
                       </div>
                     </div>
                   </div>

                   <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                     <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                       <Target className="h-5 w-5 mr-2 text-orange-600" />
                       Performance Indicators
                     </h3>
                     <div className="space-y-4">
                       <div className="flex items-center justify-between">
                         <span className="text-sm text-gray-600 dark:text-gray-400">Learning Consistency</span>
                         <span className="text-sm font-medium text-gray-900 dark:text-white">{performance_indicators.learning_consistency}%</span>
                       </div>
                       <div className="flex items-center justify-between">
                         <span className="text-sm text-gray-600 dark:text-gray-400">Engagement Level</span>
                         <span className={`text-sm font-medium capitalize ${
                           performance_indicators.engagement_level === 'high' 
                             ? 'text-green-600' 
                             : performance_indicators.engagement_level === 'medium'
                             ? 'text-yellow-600'
                             : 'text-red-600'
                         }`}>
                           {performance_indicators.engagement_level}
                         </span>
                       </div>
                       <div className="flex items-center justify-between">
                         <span className="text-sm text-gray-600 dark:text-gray-400">Progress Rate</span>
                         <span className="text-sm font-medium text-gray-900 dark:text-white">{performance_indicators.progress_rate}%</span>
                       </div>
                       <div className="flex items-center justify-between">
                         <span className="text-sm text-gray-600 dark:text-gray-400">Community Involvement</span>
                         <span className="text-sm font-medium text-gray-900 dark:text-white">{performance_indicators.community_involvement}%</span>
                       </div>
                       <div className="flex items-center justify-between">
                         <span className="text-sm text-gray-600 dark:text-gray-400">Payment Health</span>
                         <span className="text-sm font-medium text-green-600">{performance_indicators.payment_health}%</span>
                       </div>
                     </div>
                   </div>
                 </div>
              </motion.div>
            )}

            {activeTab === 'courses' && (
              <motion.div
                key="courses"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Enrolled Courses */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                    Enrolled Courses ({education.enrollments?.length || 0})
                  </h3>
                  {education.enrollments && education.enrollments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {education.enrollments.map((course: any, index: number) => (
                        <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-medium text-gray-900 dark:text-white text-sm">{course.course_title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              course.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                              course.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                            }`}>
                              {course.status}
                            </span>
                          </div>
                          <div className="mb-3">
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                              <span>Progress</span>
                              <span>{course.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Enrolled: {formatDate(course.enrollment_date)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No courses enrolled yet</p>
                    </div>
                  )}
                </div>

                {/* Learning Paths */}
                {education.learning_paths && education.learning_paths.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                      <Target className="h-5 w-5 mr-2 text-purple-600" />
                      Learning Paths
                    </h3>
                    <div className="space-y-4">
                      {education.learning_paths.map((path: any, index: number) => (
                        <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">{path.name}</h4>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {path.courses_completed}/{path.total_courses} courses
                            </span>
                          </div>
                          <div className="mb-2">
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                              <span>Overall Progress</span>
                              <span>{path.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${path.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upcoming Courses */}
                {education.upcoming_courses && education.upcoming_courses.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-orange-600" />
                      Upcoming Courses
                    </h3>
                    <div className="space-y-3">
                      {education.upcoming_courses.map((course: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{course.course_title}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Starts: {formatDate(course.start_date)}
                            </p>
                          </div>
                          <button className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors">
                            View Details
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'financial' && (
              <motion.div
                key="financial"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Financial Overview */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                    Financial Overview
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(financial_metrics.total_spent)}
                      </div>
                      <div className="text-sm text-green-700 dark:text-green-300">Total Spent</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{financial_metrics.total_courses_purchased}</div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">Courses Purchased</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{financial_metrics.successful_transactions}</div>
                      <div className="text-sm text-purple-700 dark:text-purple-300">Successful Payments</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {formatCurrency(financial_metrics.lifetime_value)}
                      </div>
                      <div className="text-sm text-orange-700 dark:text-orange-300">Lifetime Value</div>
                    </div>
                  </div>
                </div>

                {/* Payment Health */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                    Payment Health
                  </h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-600 dark:text-gray-400">Payment Health Score</span>
                    <span className="text-2xl font-bold text-green-600">{performance_indicators.payment_health}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-6">
                    <div 
                      className="bg-green-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${performance_indicators.payment_health}%` }}
                    ></div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">0</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Failed Payments</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">0</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Pending Payments</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {account_status.account_type === 'free' ? 'Free' : 'Premium'}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Account Type</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'engagement' && (
              <motion.div
                key="engagement"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Engagement Metrics */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-blue-600" />
                    Engagement Metrics
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{engagement_metrics.total_logins}</div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">Total Logins</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{formatDuration(engagement_metrics.total_session_time)}</div>
                      <div className="text-sm text-green-700 dark:text-green-300">Session Time</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{formatDuration(engagement_metrics.avg_session_duration)}</div>
                      <div className="text-sm text-purple-700 dark:text-purple-300">Avg Session</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{engagement_metrics.consecutive_active_days}</div>
                      <div className="text-sm text-orange-700 dark:text-orange-300">Active Days</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{engagement_metrics.page_views}</div>
                      <div className="text-sm text-yellow-700 dark:text-yellow-300">Page Views</div>
                    </div>
                  </div>
                </div>

                {/* Performance Indicators */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                    <Target className="h-5 w-5 mr-2 text-orange-600" />
                    Performance Indicators
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Learning Consistency</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{performance_indicators.learning_consistency}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${performance_indicators.learning_consistency}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress Rate</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{performance_indicators.progress_rate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${performance_indicators.progress_rate}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Community Involvement</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{performance_indicators.community_involvement}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${performance_indicators.community_involvement}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                          {performance_indicators.engagement_level}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Engagement Level</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {formatDate(engagement_metrics.last_active_date || new Date().toISOString())}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Last Active</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Security Overview */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-green-600" />
                    Security Overview
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-3xl font-bold text-green-600 mb-2">{account_insights.security_score}/100</div>
                      <div className="text-sm text-green-700 dark:text-green-300">Security Score</div>
                      <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2 mt-3">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${account_insights.security_score}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">2FA Enabled</span>
                        {account_status.two_factor_enabled ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Email Verified</span>
                        {account_status.email_verified ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Phone Verified</span>
                        {account_status.phone_verified ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Identity Verified</span>
                        {account_status.identity_verified ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </div>
                    
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{account_status.failed_login_attempts}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Failed Login Attempts</div>
                    </div>
                  </div>
                </div>

                {/* Device Information */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                    <Monitor className="h-5 w-5 mr-2 text-purple-600" />
                    Device Information
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{device_info.active_sessions}</div>
                      <div className="text-sm text-purple-700 dark:text-purple-300">Active Sessions</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{device_info.trusted_devices}</div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">Trusted Devices</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{device_info.unique_ip_addresses}</div>
                      <div className="text-sm text-green-700 dark:text-green-300">Unique IPs</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{device_info.security_score}</div>
                      <div className="text-sm text-orange-700 dark:text-orange-300">Device Security</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Device Breakdown</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Smartphone className="h-6 w-6 text-gray-600 dark:text-gray-400 mr-3" />
                        <div>
                          <div className="text-lg font-bold text-gray-900 dark:text-white">{device_info.device_breakdown.mobile}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Mobile</div>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Tablet className="h-6 w-6 text-gray-600 dark:text-gray-400 mr-3" />
                        <div>
                          <div className="text-lg font-bold text-gray-900 dark:text-white">{device_info.device_breakdown.tablet}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Tablet</div>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Laptop className="h-6 w-6 text-gray-600 dark:text-gray-400 mr-3" />
                        <div>
                          <div className="text-lg font-bold text-gray-900 dark:text-white">{device_info.device_breakdown.desktop}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Desktop</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'personal' && (
              <motion.div
                key="personal"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Basic Information */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <User className="h-5 w-5 mr-2 text-blue-600" />
                      Basic Information
                    </h3>
                    <span className="text-xs text-gray-400">Use main edit button above</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                        <p className="text-gray-900 dark:text-white">{basic_info?.full_name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                        <p className="text-gray-900 dark:text-white">{basic_info?.username || 'Not set'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <div className="flex items-center space-x-2">
                          <p className="text-gray-900 dark:text-white">{basic_info?.email}</p>
                          <span className="text-xs text-gray-500 dark:text-gray-400">(Cannot be edited)</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                        <p className="text-gray-900 dark:text-white">{basic_info?.phone_numbers?.[0]?.number || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                        <p className="text-gray-900 dark:text-white text-sm">{basic_info?.bio || 'No bio added yet'}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Age</label>
                        <p className="text-gray-900 dark:text-white">{basic_info?.age || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Age Group</label>
                        <p className="text-gray-900 dark:text-white capitalize">{basic_info?.age_group || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Country</label>
                        <p className="text-gray-900 dark:text-white">{basic_info?.country || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                        <p className="text-gray-900 dark:text-white text-sm">{basic_info?.address || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Organization</label>
                        <p className="text-gray-900 dark:text-white">{basic_info?.organization || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personal Details */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <UserCircle className="h-5 w-5 mr-2 text-green-600" />
                      Personal Details
                    </h3>
                    <span className="text-xs text-gray-400">Use main edit button above</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</label>
                        <p className="text-gray-900 dark:text-white">{personal_details.date_of_birth ? formatDate(personal_details.date_of_birth) : 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
                        <p className="text-gray-900 dark:text-white capitalize">{personal_details.gender || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nationality</label>
                        <p className="text-gray-900 dark:text-white">{personal_details.nationality || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Occupation</label>
                        <p className="text-gray-900 dark:text-white">{personal_details.occupation || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Industry</label>
                        <p className="text-gray-900 dark:text-white">{personal_details.industry || 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Company</label>
                        <p className="text-gray-900 dark:text-white">{personal_details.company || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Experience Level</label>
                        <p className="text-gray-900 dark:text-white capitalize">{personal_details.experience_level || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Annual Income Range</label>
                        <p className="text-gray-900 dark:text-white">{personal_details.annual_income_range || 'Prefer not to say'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Timezone</label>
                        <p className="text-gray-900 dark:text-white">{basic_info?.timezone || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Languages Spoken</label>
                        {personal_details.languages_spoken && personal_details.languages_spoken.length > 0 ? (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {personal_details.languages_spoken.map((language: any, index: number) => (
                              <span key={index} className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded text-xs">
                                {typeof language === 'object' ? `${language.language} (${language.proficiency})` : language}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400 text-sm">No languages specified</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Education Information */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2 text-purple-600" />
                      Education Information
                    </h3>
                    <span className="text-xs text-gray-400">Use main edit button above</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Education Level</label>
                        <p className="text-gray-900 dark:text-white">{personal_details?.education_level || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Institution Name</label>
                        <p className="text-gray-900 dark:text-white">{personal_details?.institution_name || 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Field of Study</label>
                        <p className="text-gray-900 dark:text-white">{personal_details?.field_of_study || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Graduation Year</label>
                        <p className="text-gray-900 dark:text-white">{personal_details?.graduation_year || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <Link2 className="h-5 w-5 mr-2 text-indigo-600" />
                      Social Media Links
                    </h3>
                    <span className="text-xs text-gray-400">Use main edit button above</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: 'facebook_link', label: 'Facebook', icon: Facebook, color: 'text-blue-700' },
                      { key: 'instagram_link', label: 'Instagram', icon: Instagram, color: 'text-pink-600' },
                      { key: 'linkedin_link', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-600' },
                      { key: 'twitter_link', label: 'Twitter/X', icon: Twitter, color: 'text-blue-400' },
                      { key: 'youtube_link', label: 'YouTube', icon: Youtube, color: 'text-red-600' },
                      { key: 'github_link', label: 'GitHub', icon: Github, color: 'text-gray-800 dark:text-gray-200' },
                      { key: 'portfolio_link', label: 'Portfolio', icon: Globe, color: 'text-green-600' }
                    ].map((social) => {
                      const IconComponent = social.icon;
                      const hasLink = basic_info?.[social.key as keyof typeof basic_info];
                      return (
                        <div key={social.key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <IconComponent className={`h-5 w-5 ${social.color}`} />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{social.label}</span>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {hasLink ? (
                              <a 
                                href={hasLink as string} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                              >
                                <Link2 className="h-3 w-3 mr-1" />
                                View
                              </a>
                            ) : (
                              'Not set'
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Skills & Interests */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <Brain className="h-5 w-5 mr-2 text-purple-600" />
                      Skills & Interests
                    </h3>
                    <span className="text-xs text-gray-400">Use main edit button above</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Skills</h4>
                      {personal_details.skills && personal_details.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {personal_details.skills.map((skill: string, index: number) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No skills added yet</p>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Interests</h4>
                      {personal_details.interests && personal_details.interests.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {personal_details.interests.map((interest: string, index: number) => (
                            <span key={index} className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-full text-sm">
                              {interest}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No interests added yet</p>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Certifications</h4>
                      {personal_details.certifications && personal_details.certifications.length > 0 ? (
                        <div className="space-y-2">
                          {personal_details.certifications.map((cert: string, index: number) => (
                            <div key={index} className="flex items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <Award className="h-4 w-4 text-yellow-600 mr-2" />
                              <span className="text-sm text-gray-900 dark:text-white">{cert}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No certifications added yet</p>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Learning Goals</h4>
                      {personal_details.learning_goals && personal_details.learning_goals.length > 0 ? (
                        <div className="space-y-2">
                          {personal_details.learning_goals.map((goal: string, index: number) => (
                            <div key={index} className="flex items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <Target className="h-4 w-4 text-orange-600 mr-2" />
                              <span className="text-sm text-gray-900 dark:text-white">{goal}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No learning goals set yet</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Languages */}
                {personal_details.languages_spoken && personal_details.languages_spoken.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Globe className="h-5 w-5 mr-2 text-green-600" />
                      Languages
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {personal_details.languages_spoken.map((language: any, index: number) => (
                        <span key={index} className="px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-lg text-sm font-medium">
                          {typeof language === 'object' ? `${language.language} (${language.proficiency})` : language}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Add other tab contents similarly */}
            {!['overview', 'learning', 'courses', 'financial', 'engagement', 'security', 'personal'].includes(activeTab) && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white capitalize">{activeTab} Tab</h3>
                  <p className="text-gray-500 dark:text-gray-400">Content will be added shortly</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Profile Information</h3>
                <button
                  onClick={handleCancel}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Basic Information Section */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-600">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editData.full_name || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, full_name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={editData.phone_number || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, phone_number: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={editData.bio || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Personal Details Section */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-600">Personal Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={editData.date_of_birth || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Gender
                      </label>
                      <select
                        value={editData.gender || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, gender: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="non-binary">Non-binary</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nationality
                      </label>
                      <input
                        type="text"
                        value={editData.nationality || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, nationality: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g., Indian, American"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Timezone
                      </label>
                      <input
                        type="text"
                        value={editData.timezone || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, timezone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g., Asia/Kolkata"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information Section */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-600">Professional Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Occupation
                      </label>
                      <input
                        type="text"
                        value={editData.occupation || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, occupation: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g., Software Engineer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Industry
                      </label>
                      <input
                        type="text"
                        value={editData.industry || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, industry: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g., Technology, Healthcare"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        value={editData.company || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, company: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g., Google, Microsoft"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Experience Level
                      </label>
                      <select
                        value={editData.experience_level || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, experience_level: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">Select Experience Level</option>
                        <option value="entry">Entry Level</option>
                        <option value="mid">Mid Level</option>
                        <option value="senior">Senior Level</option>
                        <option value="executive">Executive</option>
                        <option value="student">Student</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Annual Income Range
                      </label>
                      <select
                        value={editData.annual_income_range || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, annual_income_range: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">Select Income Range</option>
                        <option value="0-25000">₹0 - ₹25,000</option>
                        <option value="25000-50000">₹25,000 - ₹50,000</option>
                        <option value="50000-100000">₹50,000 - ₹1,00,000</option>
                        <option value="100000-200000">₹1,00,000 - ₹2,00,000</option>
                        <option value="200000-500000">₹2,00,000 - ₹5,00,000</option>
                        <option value="500000+">₹5,00,000+</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Social Media Links Section */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-600">Social Media Links</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Linkedin className="h-4 w-4 mr-2 text-blue-600" />
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        value={editData.linkedin_link || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, linkedin_link: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Github className="h-4 w-4 mr-2 text-gray-800 dark:text-gray-200" />
                        GitHub
                      </label>
                      <input
                        type="url"
                        value={editData.github_link || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, github_link: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="https://github.com/username"
                      />
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Globe className="h-4 w-4 mr-2 text-green-600" />
                        Portfolio
                      </label>
                      <input
                        type="url"
                        value={editData.portfolio_link || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, portfolio_link: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="https://yourportfolio.com"
                      />
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Twitter className="h-4 w-4 mr-2 text-blue-400" />
                        Twitter/X
                      </label>
                      <input
                        type="url"
                        value={editData.twitter_link || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, twitter_link: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="https://twitter.com/username"
                      />
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Facebook className="h-4 w-4 mr-2 text-blue-700" />
                        Facebook
                      </label>
                      <input
                        type="url"
                        value={editData.facebook_link || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, facebook_link: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="https://facebook.com/username"
                      />
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Instagram className="h-4 w-4 mr-2 text-pink-600" />
                        Instagram
                      </label>
                      <input
                        type="url"
                        value={editData.instagram_link || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, instagram_link: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="https://instagram.com/username"
                      />
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Youtube className="h-4 w-4 mr-2 text-red-600" />
                        YouTube
                      </label>
                      <input
                        type="url"
                        value={editData.youtube_link || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, youtube_link: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="https://youtube.com/@username"
                      />
                    </div>
                  </div>
                </div>

                {/* Skills & Interests Section */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-600">Skills & Interests</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Skills (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={Array.isArray(editData.skills) ? editData.skills.join(', ') : ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s) }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g., JavaScript, React, Node.js, Python"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Interests (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={Array.isArray(editData.interests) ? editData.interests.join(', ') : ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, interests: e.target.value.split(',').map(s => s.trim()).filter(s => s) }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g., Web Development, Machine Learning, Photography"
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Learning Goals (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={Array.isArray(editData.learning_goals) ? editData.learning_goals.join(', ') : ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, learning_goals: e.target.value.split(',').map(s => s.trim()).filter(s => s) }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g., Master React, Learn AI/ML, Get AWS Certification"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Additional modals removed - using single edit modal above */}
      {false && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Personal Details</h3>
                <button
                  onClick={handleCancel}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={editData.date_of_birth || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Gender
                    </label>
                    <select
                      value={editData.gender || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, gender: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non-binary">Non-binary</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nationality
                    </label>
                    <input
                      type="text"
                      value={editData.nationality || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, nationality: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="e.g., Indian, American"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Occupation
                    </label>
                    <input
                      type="text"
                      value={editData.occupation || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, occupation: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="e.g., Software Engineer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Industry
                    </label>
                    <input
                      type="text"
                      value={editData.industry || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, industry: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="e.g., Technology, Healthcare"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={editData.company || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="e.g., Google, Microsoft"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Experience Level
                    </label>
                    <select
                      value={editData.experience_level || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, experience_level: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select Experience Level</option>
                      <option value="entry">Entry Level</option>
                      <option value="mid">Mid Level</option>
                      <option value="senior">Senior Level</option>
                      <option value="executive">Executive</option>
                      <option value="student">Student</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Annual Income Range
                    </label>
                    <select
                      value={editData.annual_income_range || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, annual_income_range: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select Income Range</option>
                      <option value="under-25k">Under $25,000</option>
                      <option value="25k-50k">$25,000 - $50,000</option>
                      <option value="50k-75k">$50,000 - $75,000</option>
                      <option value="75k-100k">$75,000 - $100,000</option>
                      <option value="100k-150k">$100,000 - $150,000</option>
                      <option value="150k-plus">$150,000+</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Timezone
                    </label>
                    <select
                      value={editData.timezone || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, timezone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select Timezone</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Asia/Kolkata">India Standard Time (IST)</option>
                      <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                      <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Languages Spoken
                    </label>
                    <div className="space-y-2">
                      {editData.languages_spoken?.map((lang: string, index: number) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2">
                          <span className="text-sm text-gray-900 dark:text-white">{lang}</span>
                          <button
                            onClick={() => removeItem('languages_spoken', index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Add language (e.g., English - Fluent)"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addItem('languages_spoken', e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interests Section */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Interests
                </label>
                <div className="space-y-2">
                  {editData.interests?.map((interest: string, index: number) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2">
                      <span className="text-sm text-gray-900 dark:text-white">{interest}</span>
                      <button
                        onClick={() => removeItem('interests', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Add interest"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addItem('interests', e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Removed - using single edit modal above */}
      {false && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Skills & Certifications</h3>
                <button
                  onClick={handleCancel}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Skills
                  </label>
                  <div className="space-y-2">
                    {editData.skills?.map((skill: string, index: number) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2">
                        <span className="text-sm text-gray-900 dark:text-white">{skill}</span>
                        <button
                          onClick={() => removeItem('skills', index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Add skill"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addItem('skills', e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Certifications
                  </label>
                  <div className="space-y-2">
                    {editData.certifications?.map((cert: string, index: number) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2">
                        <span className="text-sm text-gray-900 dark:text-white">{cert}</span>
                        <button
                          onClick={() => removeItem('certifications', index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Add certification"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addItem('certifications', e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Learning Goals Edit Modal */}
      {false && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Learning Goals</h3>
                <button
                  onClick={handleCancel}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Learning Goals
                  </label>
                  <div className="space-y-2">
                    {editData.learning_goals?.map((goal: string, index: number) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2">
                        <span className="text-sm text-gray-900 dark:text-white">{goal}</span>
                        <button
                          onClick={() => removeItem('learning_goals', index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Add learning goal"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addItem('learning_goals', e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preferred Study Times
                  </label>
                  <div className="space-y-2">
                    {editData.preferred_study_times?.map((time: string, index: number) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2">
                        <span className="text-sm text-gray-900 dark:text-white">{time}</span>
                        <button
                          onClick={() => removeItem('preferred_study_times', index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Add study time (e.g., Morning 9-11 AM)"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addItem('preferred_study_times', e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default StudentProfilePage; 