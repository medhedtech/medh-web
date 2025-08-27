import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Calendar, Award, BookOpen, Clock, TrendingUp, Users, MessageSquare, Star, 
  DollarSign, Monitor, Shield, CheckCircle, XCircle, BarChart3, Target, Activity, 
  CreditCard, Smartphone, Tablet, Laptop, Globe, Eye, MousePointer, Timer, Brain, 
  Heart, Zap, FileText, Settings, Edit, UserCircle, GraduationCap, Link2,
  Facebook, Instagram, Linkedin, Twitter, Youtube, Github, Lock, EyeOff, ChevronLeft, ChevronRight,
  Menu, X, ChevronDown, AlertTriangle, RefreshCw
} from 'lucide-react';
import { getComprehensiveUserProfile } from '@/apis/profile.api';
import { authAPI, IChangePasswordData } from '@/apis/auth.api';
import { apiClient } from '@/apis/apiClient';
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
  address: string;
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
  education: {
    course_stats: {
      total_enrolled: number;
      active_courses: number;
      completed_courses: number;
      on_hold_courses: number;
      average_progress: number;
    };
    enrollments: Array<{
      course_title: string;
      status: string;
      progress: number;
      enrollment_date: string;
      course_id?: string;
      course_image?: string;
      instructor?: string;
      duration?: string;
      difficulty?: string;
    }>;
    achievements: any[];
    certifications: any[];
    learning_paths?: Array<{
      name: string;
      courses_completed: number;
      total_courses: number;
      progress: number;
      description?: string;
    }>;
    upcoming_courses?: Array<{
      course_title: string;
      start_date: string;
      course_id?: string;
      instructor?: string;
    }>;
  };
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

  // Password change states
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  // Add new state for mobile navigation
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const tabScrollRef = useRef<HTMLDivElement>(null);

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

  const formatLastLogin = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Helper function to format date for HTML date input (YYYY-MM-DD)
  const formatDateForInput = (dateString: string | Date | null | undefined): string => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      // Format as YYYY-MM-DD for HTML date input
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error formatting date for input:', error);
      return '';
    }
  };

  // Auto-refresh form when profile updates (after save)
  useEffect(() => {
    if (profile && isEditingProfile) {
      console.log('🔄 Profile updated, refreshing form data automatically...');
      
      const autoRefreshEditData = {
        // Basic Information
        full_name: profile?.basic_info.full_name || '',
        phone_number: profile?.basic_info.phone_numbers?.[0]?.number || '',
        bio: profile?.basic_info.bio || '',
        age: profile?.basic_info.age?.toString() || '',
        address: profile?.basic_info.address || '',
        country: profile?.basic_info.country || '',
        timezone: profile?.basic_info.timezone || '',
        
        // Personal Details
        date_of_birth: formatDateForInput(profile?.personal_details.date_of_birth),
        gender: profile?.personal_details.gender || '',
        nationality: profile?.personal_details.nationality || '',
        
        // Education Information - check multiple sources
        education_level: profile?.personal_details.education_level || profile?.basic_info?.meta?.education_level || '',
        institution_name: profile?.personal_details.institution_name || profile?.basic_info?.meta?.institution_name || '',
        field_of_study: profile?.personal_details.field_of_study || profile?.basic_info?.meta?.field_of_study || '',
        graduation_year: profile?.personal_details.graduation_year || profile?.basic_info?.meta?.graduation_year || '',
        
        // Social Media Links
        facebook_link: profile?.basic_info.facebook_link || '',
        instagram_link: profile?.basic_info.instagram_link || '',
        linkedin_link: profile?.basic_info.linkedin_link || '',
        twitter_link: profile?.basic_info.twitter_link || '',
        youtube_link: profile?.basic_info.youtube_link || '',
        github_link: profile?.basic_info.github_link || '',
        portfolio_link: profile?.basic_info.portfolio_link || '',
        
        // Skills & Interests
        skills: profile?.personal_details.skills?.join(', ') || '',
        interests: profile?.personal_details.interests?.join(', ') || '',
        learning_goals: profile?.personal_details.learning_goals?.join(', ') || '',
        certifications: profile?.personal_details.certifications?.join(', ') || '',
        preferred_study_times: profile?.personal_details.preferred_study_times?.join(', ') || '',
        languages_spoken: profile?.personal_details.languages_spoken?.map(l => l.language).join(', ') || '',
        
        // Professional Details
        occupation: profile?.personal_details.occupation || '',
        industry: profile?.personal_details.industry || '',
        company: profile?.personal_details.company || '',
        experience_level: profile?.personal_details.experience_level || '',
        annual_income_range: profile?.personal_details.annual_income_range || ''
      };
      
      console.log('📝 Auto-updating edit data with latest profile:', autoRefreshEditData);
      setEditData(autoRefreshEditData);
    }
  }, [profile, isEditingProfile]);

  // Edit functions
  const handleEditProfile = () => {
    console.log('🔧 Setting up edit form with current profile data...');
    console.log('📋 Current profile structure:', {
      basic_info: profile?.basic_info,
      personal_details: profile?.personal_details
    });
    
    setEditData({
      // Basic Information
      full_name: profile?.basic_info.full_name || '',
      phone_number: profile?.basic_info.phone_numbers?.[0]?.number || '',
      bio: profile?.basic_info.bio || '',
      age: profile?.basic_info.age?.toString() || '',
      address: profile?.basic_info.address || '',
      country: profile?.basic_info.country || '',
      timezone: profile?.basic_info.timezone || '',
      
      // Personal Details
      date_of_birth: formatDateForInput(profile?.personal_details.date_of_birth),
      gender: profile?.personal_details.gender || '',
      nationality: profile?.personal_details.nationality || '',
      
      // Education Information - check multiple sources
      education_level: profile?.personal_details.education_level || profile?.basic_info?.meta?.education_level || '',
      institution_name: profile?.personal_details.institution_name || profile?.basic_info?.meta?.institution_name || '',
      field_of_study: profile?.personal_details.field_of_study || profile?.basic_info?.meta?.field_of_study || '',
      graduation_year: profile?.personal_details.graduation_year || profile?.basic_info?.meta?.graduation_year || '',
      
      // Social Media Links
      facebook_link: profile?.basic_info.facebook_link || '',
      instagram_link: profile?.basic_info.instagram_link || '',
      linkedin_link: profile?.basic_info.linkedin_link || '',
      twitter_link: profile?.basic_info.twitter_link || '',
      youtube_link: profile?.basic_info.youtube_link || '',
      github_link: profile?.basic_info.github_link || '',
      portfolio_link: profile?.basic_info.portfolio_link || '',
      
      // Skills & Interests
      skills: profile?.personal_details.skills?.map((skill: any) => 
        typeof skill === 'string' ? skill : skill.name
      ) || [],
      certifications: profile?.personal_details.certifications?.map((cert: any) => 
        typeof cert === 'string' ? cert : cert.name
      ) || [],
      languages_spoken: profile?.personal_details.languages_spoken?.map((lang: any) => 
        typeof lang === 'string' ? lang : lang.language
      ) || [],
      interests: profile?.personal_details.interests || [],
      learning_goals: profile?.personal_details.learning_goals?.map((goal: any) => 
        typeof goal === 'string' ? goal : goal.goal
      ) || [],
      preferred_study_times: profile?.personal_details.preferred_study_times || []
    });
    
    // Debug: Log the edit data for date of birth and education
    const finalEditData = {
      // Basic Information
      full_name: profile?.basic_info.full_name || '',
      phone_number: profile?.basic_info.phone_numbers?.[0]?.number || '',
      bio: profile?.basic_info.bio || '',
      age: profile?.basic_info.age?.toString() || '',
      address: profile?.basic_info.address || '',
      country: profile?.basic_info.country || '',
      timezone: profile?.basic_info.timezone || '',
      
      // Personal Details
      date_of_birth: formatDateForInput(profile?.personal_details.date_of_birth),
      gender: profile?.personal_details.gender || '',
      nationality: profile?.personal_details.nationality || '',
      
      // Education Information - check multiple sources
      education_level: profile?.personal_details.education_level || profile?.basic_info?.meta?.education_level || '',
      institution_name: profile?.personal_details.institution_name || profile?.basic_info?.meta?.institution_name || '',
      field_of_study: profile?.personal_details.field_of_study || profile?.basic_info?.meta?.field_of_study || '',
      graduation_year: profile?.personal_details.graduation_year || profile?.basic_info?.meta?.graduation_year || '',
      
      // Social Media Links
      facebook_link: profile?.basic_info.facebook_link || '',
      instagram_link: profile?.basic_info.instagram_link || '',
      linkedin_link: profile?.basic_info.linkedin_link || '',
      twitter_link: profile?.basic_info.twitter_link || '',
      youtube_link: profile?.basic_info.youtube_link || '',
      github_link: profile?.basic_info.github_link || '',
      portfolio_link: profile?.basic_info.portfolio_link || '',
      
      // Skills & Interests
      skills: profile?.personal_details.skills?.map((skill: any) => 
        typeof skill === 'string' ? skill : skill.name
      ) || [],
      certifications: profile?.personal_details.certifications?.map((cert: any) => 
        typeof cert === 'string' ? cert : cert.name
      ) || [],
      languages_spoken: profile?.personal_details.languages_spoken?.map((lang: any) => 
        typeof lang === 'string' ? lang : lang.language
      ) || [],
      interests: profile?.personal_details.interests || [],
      learning_goals: profile?.personal_details.learning_goals?.map((goal: any) => 
        typeof goal === 'string' ? goal : goal.goal
      ) || [],
      preferred_study_times: profile?.personal_details.preferred_study_times || []
    };
    
    console.log('🔍 Edit Profile Debug:', {
      profileDateOfBirth: profile?.personal_details.date_of_birth,
      formattedDateOfBirth: formatDateForInput(profile?.personal_details.date_of_birth),
      editDataDateOfBirth: finalEditData.date_of_birth,
      educationLevel: profile?.personal_details.education_level,
      editDataEducationLevel: finalEditData.education_level,
      fullEditData: finalEditData,
      fullProfileStructure: {
        basic_info_meta: profile?.basic_info?.meta,
        personal_details_education: {
          education_level: profile?.personal_details?.education_level,
          institution_name: profile?.personal_details?.institution_name,
          field_of_study: profile?.personal_details?.field_of_study,
          graduation_year: profile?.personal_details?.graduation_year
        }
      }
    });
    
    setIsEditingProfile(true);
  };

  const handleSave = async () => {
    console.log('🔄 Starting profile save...');
    console.log('📝 Current editData:', editData);
    console.log('🎓 Education Level Debug:', {
      educationLevel: editData.education_level,
      institutionName: editData.institution_name,
      fieldOfStudy: editData.field_of_study,
      graduationYear: editData.graduation_year
    });
    
    // Check if we have any data to save
    if (!editData || Object.keys(editData).length === 0) {
      console.error('❌ No edit data available to save');
      showToast.error('No data to save. Please fill in some fields first.');
      return;
    }
    
    console.log('✅ Edit data validation passed, proceeding with save...');
    setSaving(true);
    try {
      // Prepare the data for API call with proper structure
      const updateData: any = {
        // Basic Information - direct fields (send even if empty to clear existing data)
        full_name: editData.full_name?.trim() || '',
        bio: editData.bio?.trim() || '',
        age: editData.age ? editData.age.toString().trim() : '',
        address: editData.address?.trim() || '',
        country: editData.country?.trim() || '',
        timezone: editData.timezone?.trim() || '',
        
        // Phone numbers - always send, even if empty
        phone_numbers: editData.phone_number?.trim() ? (() => {
          const cleanNumber = editData.phone_number.trim().replace(/[^\d+]/g, ''); // Keep digits and + sign
          console.log('📱 Phone number processing:', {
            original: editData.phone_number,
            cleaned: cleanNumber,
            length: cleanNumber.length
          });
          // Ensure number is between 9-15 digits (allowing 9+ digits for flexibility)
          if (cleanNumber.length >= 9 && cleanNumber.length <= 15) {
            const phoneArray = [{
              country: 'IN',
              number: cleanNumber
            }];
            console.log('✅ Valid phone number created:', phoneArray);
            return phoneArray;
          }
          console.log('❌ Invalid phone number length, returning empty array');
          return []; // Return empty array if invalid
        })() : [],
        
        // Social Media Links - always send, even if empty
        facebook_link: editData.facebook_link?.trim() || '',
        instagram_link: editData.instagram_link?.trim() || '',
        linkedin_link: editData.linkedin_link?.trim() || '',
        twitter_link: editData.twitter_link?.trim() || '',
        youtube_link: editData.youtube_link?.trim() || '',
        github_link: editData.github_link?.trim() || '',
        portfolio_link: editData.portfolio_link?.trim() || '',
        
        // Personal Details - always send, even if empty
        date_of_birth: editData.date_of_birth || '',
        gender: editData.gender?.trim() || '',
        nationality: editData.nationality?.trim() || '',
        
        // Array fields - convert from comma-separated strings to arrays
        skills: (() => {
          if (Array.isArray(editData.skills)) return editData.skills;
          if (typeof editData.skills === 'string' && editData.skills.trim()) {
            return editData.skills.split(',').map(s => s.trim()).filter(s => s);
          }
          return [];
        })(),
        interests: (() => {
          if (Array.isArray(editData.interests)) return editData.interests;
          if (typeof editData.interests === 'string' && editData.interests.trim()) {
            return editData.interests.split(',').map(s => s.trim()).filter(s => s);
          }
          return [];
        })(),
        learning_goals: (() => {
          if (Array.isArray(editData.learning_goals)) return editData.learning_goals;
          if (typeof editData.learning_goals === 'string' && editData.learning_goals.trim()) {
            return editData.learning_goals.split(',').map(s => s.trim()).filter(s => s);
          }
          return [];
        })(),
        certifications: (() => {
          if (Array.isArray(editData.certifications)) return editData.certifications;
          if (typeof editData.certifications === 'string' && editData.certifications.trim()) {
            return editData.certifications.split(',').map(s => s.trim()).filter(s => s);
          }
          return [];
        })(),
        preferred_study_times: (() => {
          if (Array.isArray(editData.preferred_study_times)) return editData.preferred_study_times;
          if (typeof editData.preferred_study_times === 'string' && editData.preferred_study_times.trim()) {
            return editData.preferred_study_times.split(',').map(s => s.trim()).filter(s => s);
          }
          return [];
        })(),
        languages_spoken: (() => {
          if (Array.isArray(editData.languages_spoken)) return editData.languages_spoken;
          if (typeof editData.languages_spoken === 'string' && editData.languages_spoken.trim()) {
            return editData.languages_spoken.split(',').map(s => s.trim()).filter(s => s);
          }
          return [];
        })(),
        
        // Meta object for education and other details
        meta: {
          // Education Information - always send, even if empty
          education_level: editData.education_level?.trim() || '',
          institution_name: editData.institution_name?.trim() || '',
          field_of_study: editData.field_of_study?.trim() || '',
          graduation_year: editData.graduation_year && parseInt(editData.graduation_year) >= 1950 && parseInt(editData.graduation_year) <= new Date().getFullYear() + 10 ? 
            parseInt(editData.graduation_year) : null,
          
          // Note: Arrays are handled separately outside meta object
          ...(editData.preferred_study_times?.length > 0 && {
            preferred_study_times: editData.preferred_study_times.map((time: string) => ({
              day: 'monday',
              start_time: '09:00',
              end_time: '11:00'
            }))
          })
        }
      };

      // Remove undefined values and empty meta object, but preserve empty strings for important fields
      const alwaysKeepFields = [
        'full_name', 'bio', 'age', 'address', 'country', 'timezone',
        'date_of_birth', 'gender', 'nationality', 'phone_numbers',
        'skills', 'interests', 'learning_goals', 'certifications', 
        'preferred_study_times', 'languages_spoken'
      ];
      
      Object.keys(updateData).forEach(key => {
        const value = updateData[key];
        const isSocialMediaLink = [
          'facebook_link', 'instagram_link', 'linkedin_link', 
          'twitter_link', 'youtube_link', 'github_link', 'portfolio_link'
        ].includes(key);
        const isAlwaysKeepField = alwaysKeepFields.includes(key);
        
        // Only delete if undefined, but keep empty strings for important fields
        if (value === undefined || (!isAlwaysKeepField && !isSocialMediaLink && value === '')) {
          delete updateData[key];
        }
      });

      // Clean up meta object - remove if empty
      if (updateData.meta && Object.keys(updateData.meta).length === 0) {
        delete updateData.meta;
      }

      // Add all form fields to ensure they're sent to backend
      updateData.occupation = editData.occupation?.trim() || '';
      updateData.industry = editData.industry?.trim() || '';
      updateData.company = editData.company?.trim() || '';
      updateData.experience_level = editData.experience_level?.trim() || '';
      updateData.annual_income_range = editData.annual_income_range?.trim() || '';
      
      // Convert comma-separated strings to arrays for skills/interests
      if (editData.skills) {
        if (typeof editData.skills === 'string' && editData.skills.trim()) {
          updateData.skills = editData.skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
        } else if (Array.isArray(editData.skills) && editData.skills.length > 0) {
          updateData.skills = editData.skills.filter(skill => skill && skill.toString().trim().length > 0);
        }
      }
      if (editData.interests) {
        if (typeof editData.interests === 'string' && editData.interests.trim()) {
          updateData.interests = editData.interests.split(',').map(interest => interest.trim()).filter(interest => interest.length > 0);
        } else if (Array.isArray(editData.interests) && editData.interests.length > 0) {
          updateData.interests = editData.interests.filter(interest => interest && interest.toString().trim().length > 0);
        }
      }
      if (editData.learning_goals) {
        if (typeof editData.learning_goals === 'string' && editData.learning_goals.trim()) {
          updateData.learning_goals = editData.learning_goals.split(',').map(goal => goal.trim()).filter(goal => goal.length > 0);
        } else if (Array.isArray(editData.learning_goals) && editData.learning_goals.length > 0) {
          updateData.learning_goals = editData.learning_goals.filter(goal => goal && goal.toString().trim().length > 0);
        }
      }
      if (editData.certifications) {
        if (typeof editData.certifications === 'string' && editData.certifications.trim()) {
          updateData.certifications = editData.certifications.split(',').map(cert => cert.trim()).filter(cert => cert.length > 0);
        } else if (Array.isArray(editData.certifications) && editData.certifications.length > 0) {
          updateData.certifications = editData.certifications.filter(cert => cert && cert.toString().trim().length > 0);
        }
      }
      if (editData.preferred_study_times) {
        if (typeof editData.preferred_study_times === 'string' && editData.preferred_study_times.trim()) {
          updateData.preferred_study_times = editData.preferred_study_times.split(',').map(time => time.trim()).filter(time => time.length > 0);
        } else if (Array.isArray(editData.preferred_study_times) && editData.preferred_study_times.length > 0) {
          updateData.preferred_study_times = editData.preferred_study_times.filter(time => time && time.toString().trim().length > 0);
        }
      }
      if (editData.languages_spoken) {
        if (typeof editData.languages_spoken === 'string' && editData.languages_spoken.trim()) {
          updateData.languages_spoken = editData.languages_spoken.split(',').map(lang => ({ language: lang.trim() })).filter(lang => lang.language.length > 0);
        } else if (Array.isArray(editData.languages_spoken) && editData.languages_spoken.length > 0) {
          updateData.languages_spoken = editData.languages_spoken.filter(lang => lang && lang.toString().trim().length > 0);
        }
      }

      // Remove empty strings and null values to avoid backend validation errors
      // But keep certain fields even if empty (to clear existing data)
      const alwaysIncludeFields = ['full_name', 'bio', 'age', 'address', 'country', 'timezone', 'date_of_birth', 'gender', 'nationality'];
      const cleanUpdateData: any = {};
      Object.keys(updateData).forEach(key => {
        const value = updateData[key];
        
        // Always include certain fields even if empty
        if (alwaysIncludeFields.includes(key)) {
          cleanUpdateData[key] = value || '';
        } else if (value !== '' && value !== null && value !== undefined || Array.isArray(value)) {
          if (Array.isArray(value)) {
            // Always include certain arrays even if empty, and include non-empty arrays
            const alwaysIncludeArrays = ['phone_numbers', 'skills', 'interests', 'learning_goals', 'certifications', 'preferred_study_times', 'languages_spoken'];
            if (alwaysIncludeArrays.includes(key)) {
              cleanUpdateData[key] = value; // Always include these arrays, even if empty
            } else if (value.length > 0) {
              cleanUpdateData[key] = value; // Include other arrays only if they have content
            }
          } else if (typeof value === 'object' && value !== null) {
            // Handle meta object - only include non-empty fields
            const cleanMeta = {};
            Object.keys(value).forEach(metaKey => {
              const metaValue = value[metaKey];
              if (metaValue !== '' && metaValue !== null && metaValue !== undefined) {
                cleanMeta[metaKey] = metaValue;
              }
            });
            if (Object.keys(cleanMeta).length > 0) {
              cleanUpdateData[key] = cleanMeta;
            }
          } else if (typeof value === 'string' && value.trim() !== '') {
            cleanUpdateData[key] = value;
          } else if (typeof value === 'number') {
            cleanUpdateData[key] = value;
          }
        }
      });

      console.log('🌍 Country and Phone Debug:', {
        country: editData.country,
        phone_number: editData.phone_number,
        updateData_country: updateData.country,
        updateData_phone_numbers: updateData.phone_numbers
      });
      
      console.log('📋 Missing Fields Debug:', {
        editData_dob: editData.date_of_birth,
        editData_gender: editData.gender,
        editData_nationality: editData.nationality,
        editData_skills: editData.skills,
        editData_interests: editData.interests,
        updateData_dob: updateData.date_of_birth,
        updateData_gender: updateData.gender,
        updateData_nationality: updateData.nationality,
        updateData_skills: updateData.skills,
        updateData_interests: updateData.interests
      });
      
      console.log('💾 Saving profile with data:', cleanUpdateData);
      console.log('🧹 Cleaned data (removed empty fields):', {
        originalFields: Object.keys(updateData).length,
        cleanedFields: Object.keys(cleanUpdateData).length,
        removedFields: Object.keys(updateData).filter(key => !(key in cleanUpdateData))
      });
      console.log('🔗 API URL will be:', '/profile/me/comprehensive');
      
      // Debug: Log what fields are being sent
      console.log('🔍 Debug - EditData vs UpdateData:', {
        editDataFields: Object.keys(editData),
        updateDataFields: Object.keys(updateData),
        metaFields: updateData.meta ? Object.keys(updateData.meta) : 'No meta object'
      });
      
      // Debug: Log education fields specifically
      console.log('🎓 Education Fields Debug:', {
        editDataEducation: {
          education_level: editData.education_level,
          institution_name: editData.institution_name,
          field_of_study: editData.field_of_study,
          graduation_year: editData.graduation_year
        },
        metaEducation: updateData.meta ? {
          education_level: updateData.meta.education_level,
          institution_name: updateData.meta.institution_name,
          field_of_study: updateData.meta.field_of_study,
          graduation_year: updateData.meta.graduation_year
        } : 'No meta object'
      });
      
      // Debug: Log social media links specifically
      console.log('📱 Social Media Links Debug:', {
        editDataSocialLinks: {
          facebook: editData.facebook_link,
          instagram: editData.instagram_link,
          linkedin: editData.linkedin_link,
          twitter: editData.twitter_link,
          youtube: editData.youtube_link,
          github: editData.github_link,
          portfolio: editData.portfolio_link
        },
        updateDataSocialLinks: {
          facebook: updateData.facebook_link,
          instagram: updateData.instagram_link,
          linkedin: updateData.linkedin_link,
          twitter: updateData.twitter_link,
          youtube: updateData.youtube_link,
          github: updateData.github_link,
          portfolio: updateData.portfolio_link
        }
      });
      
      // Make the API call using the correct endpoint
      console.log('🚀 Making API call to update profile...');
      console.log('📤 ORIGINAL Update data:', updateData);
      console.log('📤 CLEANED Update data being sent:', cleanUpdateData);
      console.log('🔑 Auth token check:', localStorage.getItem('token') ? 'Token exists' : 'No token found');
      
      // CRITICAL DEBUG: Log the exact data being sent
      console.log('🔥 CRITICAL DEBUG - Data being sent to API:', {
        url: '/auth/profile',
        method: 'PUT',
        data: cleanUpdateData,
        dataKeys: Object.keys(cleanUpdateData),
        hasDateOfBirth: 'date_of_birth' in cleanUpdateData,
        hasGender: 'gender' in cleanUpdateData,
        hasSkills: 'skills' in cleanUpdateData,
        dateOfBirthValue: cleanUpdateData.date_of_birth,
        genderValue: cleanUpdateData.gender,
        skillsValue: cleanUpdateData.skills
      });
      
      // Log individual fields for validation debugging
      console.log('🔍 Field validation check (CLEANED DATA):', {
        full_name: cleanUpdateData.full_name ? `"${cleanUpdateData.full_name}" (${cleanUpdateData.full_name.length} chars)` : 'Empty',
        age: cleanUpdateData.age ? `${cleanUpdateData.age} (type: ${typeof cleanUpdateData.age})` : 'Empty',
        phone_numbers: cleanUpdateData.phone_numbers ? `${cleanUpdateData.phone_numbers.length} numbers` : 'Empty',
        meta: cleanUpdateData.meta ? Object.keys(cleanUpdateData.meta) : 'Empty',
        bio: cleanUpdateData.bio ? `"${cleanUpdateData.bio}" (${cleanUpdateData.bio.length} chars)` : 'Empty',
        date_of_birth: cleanUpdateData.date_of_birth ? `"${cleanUpdateData.date_of_birth}"` : 'Empty',
        gender: cleanUpdateData.gender ? `"${cleanUpdateData.gender}"` : 'Empty',
        nationality: cleanUpdateData.nationality ? `"${cleanUpdateData.nationality}"` : 'Empty',
        skills: cleanUpdateData.skills ? `${cleanUpdateData.skills.length} skills: ${JSON.stringify(cleanUpdateData.skills)}` : 'Empty',
        interests: cleanUpdateData.interests ? `${cleanUpdateData.interests.length} interests: ${JSON.stringify(cleanUpdateData.interests)}` : 'Empty',
        learning_goals: cleanUpdateData.learning_goals ? `${cleanUpdateData.learning_goals.length} goals: ${JSON.stringify(cleanUpdateData.learning_goals)}` : 'Empty',
        address: updateData.address ? `"${updateData.address}"` : 'Empty',
        country: updateData.country ? `"${updateData.country}"` : 'Empty'
      });
      
      console.log('📋 Note: Backend automatically updates Students collection for student users');
      
      // Use the auth API endpoint that actually works
      const response = await apiClient.put('/auth/profile', cleanUpdateData);
      console.log('✅ Profile update response:', response);
      console.log('📊 Response data:', response?.data);
      
      if (response && response.status === 'success' && response.data) {
        showToast.dismiss(); // Dismiss any existing toasts
        showToast.success('Profile updated successfully!');
        
        // Log profile completion update
        console.log('📊 Profile completion update:', {
          oldCompletion: profile?.basic_info?.profile_completion || 0,
          newCompletion: response.data.profile_completion || response.data.user?.profile_completion || 0,
          response: response.data
        });
        
        // Auto-refresh the profile data to show updated information
        console.log('🔄 Refreshing profile data after successful update...');
        await fetchProfile();
        
        // Show success message - form will auto-refresh via useEffect
        showToast.success('Profile updated successfully! Form will refresh with latest data.');
      } else if (response && response.status === 'error') {
        // Handle API validation errors
        console.log('🚨 API Validation Error:', response);
        
        if (response.data && response.data.errors && Array.isArray(response.data.errors)) {
          console.log('🔍 Detailed validation errors:', response.data.errors);
          
          // Log each validation error in detail
          response.data.errors.forEach((err: any, index: number) => {
            console.error(`❌ Error ${index + 1}:`, {
              field: err.path || err.field || err.param || 'unknown',
              message: err.message || err.msg || err,
              value: err.value,
              type: err.type || err.kind,
              fullError: err
            });
          });
          
          showToast.dismiss();
          response.data.errors.forEach((err: any) => {
            const field = err.path || err.field || err.param || 'Field';
            const message = err.message || err.msg || err;
            showToast.error(`${field}: ${message}`, {
              duration: 5000,
              position: 'top-right'
            });
          });
          return;
        } else {
          throw new Error(response.message || response.error || 'Validation failed');
        }
      } else {
        throw new Error('Failed to update profile - no response data');
      }
      
    } catch (error: any) {
      console.error('❌ Error saving profile:', error);
      console.error('❌ Error details:', {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
        message: error?.message,
        config: error?.config
      });
      
      // Show specific error message
      let errorMessage = 'Failed to update profile. Please try again.';
      
      // Handle different types of errors
      if (error?.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
        // Redirect to login after showing error
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else if (error?.response?.status === 403) {
        errorMessage = 'You do not have permission to update this profile.';
      } else if (error?.response?.status === 404) {
        errorMessage = 'Profile not found. Please refresh and try again.';
      } else if (error?.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      // Handle validation errors
      if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        showToast.dismiss();
        error.response.data.errors.forEach((err: any) => {
          showToast.error(`${err.field || 'Field'}: ${err.message}`);
        });
        return;
      }
      
      showToast.dismiss();
      showToast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // TEST FUNCTION - Remove after debugging
  const testSaveWithHardcodedData = async () => {
    console.log('🧪🧪🧪 TESTING SAVE WITH HARDCODED DATA 🧪🧪🧪');
    console.log('🔥 This is the TEST SAVE function - bypassing all form logic');
    
    const testData = {
      full_name: 'Test Student',
      date_of_birth: '1995-01-15',
      gender: 'male',
      nationality: 'Indian',
      skills: ['JavaScript', 'React'],
      interests: ['Web Development'],
      learning_goals: ['Master MERN'],
      bio: 'Test bio',
      age: '25',
      address: 'Test address',
      country: 'India'
    };
    
    console.log('🔥 Hardcoded test data being sent:', testData);
    console.log('🌐 API URL: /auth/profile');
    console.log('📡 Method: PUT');
    console.log('🔍 Test Data Analysis:', {
      hasDateOfBirth: 'date_of_birth' in testData,
      hasGender: 'gender' in testData,
      hasSkills: 'skills' in testData,
      dateOfBirthValue: testData.date_of_birth,
      genderValue: testData.gender,
      skillsValue: testData.skills,
      skillsType: typeof testData.skills,
      totalFields: Object.keys(testData).length,
      allFields: Object.keys(testData)
    });
    
    try {
      console.log('🚀 About to call apiClient.put with data:', JSON.stringify(testData, null, 2));
      const response = await apiClient.put('/auth/profile', testData);
      console.log('✅ Test save successful:', response);
      showToast.success('Test save successful!');
    } catch (error) {
      console.error('❌ Test save failed:', error);
      showToast.error('Test save failed!');
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
  // Auth helper function to get token - using x-access-token format
  const getAuthToken = () => {
    if (typeof window === "undefined") return null;
    
    // Get the token from localStorage
    const token = localStorage.getItem("token");
    
    // Return without Bearer prefix for x-access-token usage
    return token;
  };

  const fetchProfile = async () => {
    try {
      // Use different loading states for initial load vs refresh
      if (profile) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Check authentication before making the request
      const token = getAuthToken();
      if (!token) {
        console.error("Authentication token not found in localStorage");
        setError('Authentication required. Please sign in again.');
        showToast.error('Authentication required. Please sign in again.');
        
        // Redirect to login after a delay
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
        return;
      }
      
      console.log('🔄 Fetching comprehensive user profile...');
      const response = await getComprehensiveUserProfile();
      console.log('📡 API Response:', response);
      
      const serverResponse = response.data as any;
      console.log('🔍 Server Response:', serverResponse);
      console.log('🔍 Basic Info from Server:', serverResponse.data?.basic_info);
      console.log('🔍 Personal Details from Server:', serverResponse.data?.personal_details);
      
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
              address: apiData.basic_info?.address || '',
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
            education: {
              course_stats: apiData.education?.course_stats || {
                total_enrolled: 0,
                active_courses: 0,
                completed_courses: 0,
                on_hold_courses: 0,
                average_progress: 0
              },
              enrollments: apiData.education?.enrollments || [],
              achievements: apiData.education?.achievements || [],
              certifications: apiData.education?.certifications || [],
              learning_paths: apiData.education?.learning_paths || [],
              upcoming_courses: apiData.education?.upcoming_courses || []
            },
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
          
          // Debug: Log the date of birth value
          console.log('🔍 Date of Birth Debug:', {
            raw: apiData.personal_details?.date_of_birth,
            formatted: formatDateForInput(apiData.personal_details?.date_of_birth),
            type: typeof apiData.personal_details?.date_of_birth
          });
          
          // Debug: Log all personal details
          console.log('🔍 Personal Details Debug:', {
            personal_details: apiData.personal_details,
            basic_info: apiData.basic_info,
            meta: apiData.meta
          });
          
          // Show success message only if it's a manual refresh (not initial load)
          if (profile) {
            showToast.dismiss(); // Dismiss any existing toasts
            showToast.success('Profile data refreshed successfully!');
          }
        } else {
          const errorMessage = serverResponse?.message || 'Failed to load profile data';
          console.error('❌ Profile API Error:', {
            serverResponse,
            hasSuccess: !!serverResponse?.success,
            hasData: !!serverResponse?.data,
            message: serverResponse?.message
          });
          throw new Error(errorMessage);
        }
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        
        // Check if error is authentication related
        if (error?.response?.status === 401 || 
            error?.message?.includes("Authentication") || 
            error?.message?.includes("token") ||
            error?.message?.includes("Authentication required")) {
          setError('Authentication required. Please sign in again.');
          showToast.dismiss();
          showToast.error('Authentication required. Please sign in again.');
          
          // Redirect to login after a delay
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        } else {
          // Check if it's a network/server error
          if (error?.message?.includes('Failed to fetch') || error?.message?.includes('NetworkError')) {
            setError('Unable to connect to server. Please check your internet connection and ensure the backend server is running.');
            showToast.dismiss();
            showToast.error('Server connection failed. Please try again later.');
        } else {
          setError('Failed to load profile data. Please try again.');
            showToast.dismiss();
          showToast.error('Failed to refresh profile data. Please try again.');
          }
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

  // Initialize authentication and fetch profile
  useEffect(() => {
    // Ensure apiClient has the current token
    const token = getAuthToken();
    if (token) {
      // Re-initialize the apiClient with the current token
      apiClient.setAuthToken(token);
    }
    
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

  // Password validation function
  const validatePasswordChange = () => {
    const errors: string[] = [];
    
    // Current password validation
    if (!passwordData.current_password || passwordData.current_password.trim().length === 0) {
      errors.push('Current password is required');
    }
    
    // New password validation - simplified requirements
    if (!passwordData.new_password) {
      errors.push('New password is required');
    } else {
      // Length validation (6-128 characters)
      if (passwordData.new_password.length < 6) {
        errors.push('New password must be at least 6 characters long');
      }
      
      if (passwordData.new_password.length > 128) {
        errors.push('New password must not exceed 128 characters');
      }
      
      // Check if new password is different from current
      if (passwordData.new_password === passwordData.current_password) {
        errors.push('New password must be different from current password');
      }
    }
    
    // Confirm password validation
    if (!passwordData.confirm_password) {
      errors.push('Please confirm your new password');
    } else if (passwordData.new_password !== passwordData.confirm_password) {
      errors.push('New password and confirmation do not match');
    }
    
    return errors;
  };

  // Change password function with proper backend integration
  const handleChangePassword = async () => {
    const validationErrors = validatePasswordChange();
    
    if (validationErrors.length > 0) {
      setPasswordErrors(validationErrors);
      return;
    }
    
    setChangingPassword(true);
    setPasswordErrors([]);
    
    try {
      // Use the proper change-password endpoint from auth.api.ts with correct interface
      const changePasswordPayload: IChangePasswordData & { invalidateAllSessions?: boolean } = {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        confirm_password: passwordData.confirm_password
      };

      // Import apiBaseUrl at the top if not already imported
      const { apiBaseUrl } = await import('@/apis/config');
      
      console.log('🔄 Attempting to change password...');
      console.log('📡 API endpoint:', `${apiBaseUrl}/auth/change-password`);
      console.log('🔑 Token exists:', !!localStorage.getItem('token'));
      
      const response = await fetch(`${apiBaseUrl}/auth/change-password`, {
        method: 'PUT', // Backend uses PUT method
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`  
        },
        body: JSON.stringify({
          currentPassword: changePasswordPayload.current_password,      // Backend expects currentPassword
          newPassword: changePasswordPayload.new_password,             // Backend expects newPassword  
          confirmPassword: changePasswordPayload.confirm_password,     // Backend expects confirmPassword
          invalidateAllSessions: false                                 // Keep current session active
        })
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        showToast.success('Password changed successfully!');
        setIsChangingPassword(false);
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
        
        // Optional: Show security info
        showToast.info('For security, consider logging out and back in on other devices.', {
          duration: 5000
        });
      } else {
        // Handle specific error cases based on HTTP status codes
        let errorMessage = result.message || 'Failed to change password';
        
        switch (response.status) {
          case 400:
            errorMessage = result.message || 'Invalid password requirements. Please check your input.';
            break;
          case 401:
            errorMessage = 'Current password is incorrect. Please try again.';
            break;
          case 422:
            errorMessage = 'Password validation failed. Please ensure your new password meets all requirements.';
            break;
          case 429:
            errorMessage = 'Too many password change attempts. Please try again later.';
            break;
          case 500:
            errorMessage = 'Server error occurred. Please try again later.';
            break;
        }
        
        setPasswordErrors([errorMessage]);
        showToast.error(errorMessage);
      }
      
    } catch (error: unknown) {
      console.error('Error changing password:', error);
      
      let errorMessage = 'Network error occurred while changing password. Please check your connection and try again.';
      
      if (error instanceof Error) {
        if (error.name === 'NetworkError' || error.message.includes('fetch')) {
          errorMessage = 'Network connection failed. Please check your internet connection.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setPasswordErrors([errorMessage]);
      showToast.error(errorMessage);
    } finally {
      setChangingPassword(false);
    }
  };

  // Cancel password change
  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    setPasswordData({
      current_password: '',
      new_password: '',
      confirm_password: ''
    });
    setPasswordErrors([]);
  };

  // Tab configuration with improved mobile labels
  const tabs = [
    { id: 'overview', label: 'Overview', shortLabel: 'Home', icon: User },
    { id: 'courses', label: 'Courses & Progress', shortLabel: 'Courses', icon: BookOpen },
    { id: 'financial', label: 'Financial', shortLabel: 'Money', icon: DollarSign },
    { id: 'security', label: 'Security & Devices', shortLabel: 'Security', icon: Shield },
    { id: 'personal', label: 'Personal Details', shortLabel: 'Profile', icon: FileText }
  ];

  // Handle touch gestures for tab navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      // Swipe left - next tab
      const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
      if (currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1].id);
      }
    }

    if (isRightSwipe) {
      // Swipe right - previous tab
      const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
      if (currentIndex > 0) {
        setActiveTab(tabs[currentIndex - 1].id);
      }
    }
  };

  // Auto-scroll active tab into view
  useEffect(() => {
    if (tabScrollRef.current) {
      const activeButton = tabScrollRef.current.querySelector(`[data-tab="${activeTab}"]`) as HTMLElement;
      if (activeButton) {
        activeButton.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [activeTab]);

  // Handle URL hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'security') {
        setActiveTab('security');
        // Scroll to security section after a small delay to ensure tab is rendered
        setTimeout(() => {
          const securitySection = document.getElementById('security-section');
          if (securitySection) {
            securitySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    };

    // Check hash on component mount with a small delay
    const timer = setTimeout(() => {
      handleHashChange();
    }, 200);

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen && !(event.target as Element).closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Add CSS styles for mobile navigation improvements
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Custom breakpoint for extra small screens */
      @media (min-width: 475px) {
        .xs\\:block { display: block !important; }
        .xs\\:inline { display: inline !important; }
        .xs\\:h-10 { height: 2.5rem !important; }
        .xs\\:w-10 { width: 2.5rem !important; }
        .xs\\:text-sm { font-size: 0.875rem !important; line-height: 1.25rem !important; }
        .xs\\:text-base { font-size: 1rem !important; line-height: 1.5rem !important; }
      }
      
      /* Improve scrollbar for tab navigation */
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      
      /* Smooth scrolling for tab container */
      .tab-scroll {
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
      }
      
      /* Touch feedback for mobile buttons */
      @media (hover: none) {
        .mobile-touch-feedback:active {
          background-color: rgba(59, 130, 246, 0.1);
          transform: scale(0.98);
        }
      }
      
      /* Prevent text selection during swipe gestures */
      .swipe-container {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
      }
      
      /* Improved mobile menu animation */
      .mobile-menu-slide {
        transform-origin: top;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      /* Better mobile tap targets */
      @media (max-width: 768px) {
        .mobile-tap-target {
          min-height: 44px;
          min-width: 44px;
        }
      }
      
      /* Enhanced mobile responsiveness */
      @media (max-width: 640px) {
        .mobile-optimized-text {
          font-size: 0.875rem;
          line-height: 1.25rem;
        }
      }
      
      /* Improved form responsiveness */
      @media (max-width: 480px) {
        .mobile-form-grid {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        {/* Enhanced Mobile-Optimized Fixed Header with Profile Info */}
        <div className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="px-2 sm:px-4 md:px-6 py-2 sm:py-4">
            <div className="flex items-center justify-between">
              {/* Mobile-optimized profile section */}
              <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
                {/* Smaller profile image on mobile */}
                <div className="h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs xs:text-sm sm:text-lg flex-shrink-0">
                  {basic_info?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    {/* Responsive heading */}
                    <h1 className="text-sm xs:text-base sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                      {basic_info?.full_name || 'Unknown User'}
                    </h1>
                    {refreshing && (
                      <div className="flex items-center text-blue-600 flex-shrink-0">
                        <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="text-xs hidden sm:inline">Refreshing...</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                    {basic_info?.email || 'No email'}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate hidden xs:block">
                    Last login: {basic_info?.last_seen ? formatLastLogin(basic_info.last_seen) : 'Never'}
                  </p>
                </div>
              </div>
              
              {/* Mobile-optimized action buttons */}
              <div className="flex items-center space-x-1 sm:space-x-2">
                {/* Profile completion - responsive display */}
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Completion</p>
                  <p className="text-sm sm:text-lg font-bold text-blue-600">
                    {basic_info?.profile_completion || 0}%
                  </p>
                </div>
                
                {/* Touch-friendly buttons */}
                <button 
                  onClick={() => fetchProfile()}
                  className="mobile-touch-feedback mobile-tap-target p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                  title="Refresh Profile Data"
                  disabled={loading || refreshing}
                >
                  <svg className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button 
                  onClick={handleEditProfile}
                  className="mobile-touch-feedback mobile-tap-target p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
                  title="Edit Profile"
                >
                  <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
                
                {/* TEST BUTTON - Always visible */}
                <button 
                  onClick={testSaveWithHardcodedData}
                  className="mobile-touch-feedback mobile-tap-target p-1.5 sm:p-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors flex items-center justify-center ml-2"
                  title="Test Save API"
                >
                  🧪
                </button>
                
                {/* Mobile menu toggle - only visible on very small screens */}
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="mobile-touch-feedback mobile-tap-target p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center md:hidden mobile-menu-container"
                  title="Menu"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-3.5 w-3.5" />
                  ) : (
                    <Menu className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Mobile-Optimized Tab Navigation */}
          <div className="relative">
            {/* Current tab indicator for mobile */}
            <div className="block md:hidden px-2 sm:px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {tabs.find(tab => tab.id === activeTab) && (
                    <>
                      {React.createElement(tabs.find(tab => tab.id === activeTab)!.icon, {
                        className: "h-3.5 w-3.5 text-blue-600"
                      })}
                      <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                        {tabs.find(tab => tab.id === activeTab)!.label}
                      </span>
                    </>
                  )}
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>{tabs.findIndex(tab => tab.id === activeTab) + 1}</span>
                  <span>/</span>
                  <span>{tabs.length}</span>
                </div>
              </div>
            </div>

            {/* Desktop tab navigation */}
            <div className="hidden md:block px-2 sm:px-4 md:px-6">
              <div 
                ref={tabScrollRef}
                className="flex space-x-1 overflow-x-auto scrollbar-hide tab-scroll -mb-px"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {tabs.map((tab, index) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      data-tab={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-t-lg whitespace-nowrap transition-all duration-200 min-h-[44px] relative ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-b-2 border-blue-600'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="hidden lg:inline">{tab.label}</span>
                      <span className="hidden sm:inline lg:hidden">{tab.shortLabel}</span>
                      <span className="sm:hidden">{tab.shortLabel}</span>
                      
                      {/* Active indicator dot */}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
                
                {/* Swipe hint indicator */}
                <div className="flex items-center px-3 text-gray-400 text-xs sm:hidden">
                  <ChevronLeft className="h-3 w-3" />
                  <span className="mx-1">Swipe</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
              </div>
            </div>

            {/* Mobile dropdown menu */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg z-20 md:hidden mobile-menu-container"
                >
                  <div className="p-2">
                    <div className="grid grid-cols-2 gap-1">
                      {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => {
                              setActiveTab(tab.id);
                              setIsMobileMenuOpen(false);
                            }}
                            className={`flex items-center space-x-2 p-3 rounded-lg transition-colors min-h-[48px] ${
                              isActive
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            <Icon className="h-4 w-4 flex-shrink-0" />
                            <span className="text-sm font-medium truncate">{tab.shortLabel}</span>
                            {isActive && (
                              <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Quick actions in mobile menu */}
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>Profile Completion</span>
                        <span className="font-semibold text-blue-600">
                          {basic_info?.profile_completion || 0}%
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full transition-all duration-300"
                          style={{ width: `${basic_info?.profile_completion || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>



        {/* Enhanced Mobile-Optimized Tab Content with Gesture Support */}
        <div 
          className="p-2 sm:p-4 md:p-6"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Swipe indicator for mobile */}
          <div className="flex justify-center mb-4 md:hidden">
            <div className="flex space-x-1">
              {tabs.map((tab, index) => (
                <div
                  key={tab.id}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    activeTab === tab.id 
                      ? 'bg-blue-600 w-6' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 sm:space-y-6"
              >
                {/* Mobile-Optimized Quick Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
                  <div className="bg-white dark:bg-gray-800 p-2 sm:p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Courses</p>
                        <p className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
                          {learning_analytics.total_courses_enrolled}
                        </p>
                      </div>
                      <BookOpen className="h-4 w-4 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-blue-600 flex-shrink-0" />
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-2 sm:p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Certificates</p>
                        <p className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
                          {learning_analytics.certificates_earned}
                        </p>
                      </div>
                      <Award className="h-4 w-4 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-yellow-600 flex-shrink-0" />
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-2 sm:p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Streak</p>
                        <p className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
                          {learning_analytics.current_streak}
                        </p>
                      </div>
                      <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-green-600 flex-shrink-0" />
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-2 sm:p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Time</p>
                        <p className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
                          {formatDuration(learning_analytics.total_learning_time)}
                        </p>
                      </div>
                      <Clock className="h-4 w-4 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-purple-600 flex-shrink-0" />
                    </div>
                  </div>
                </div>

                {/* Mobile-Optimized Account Details & Community */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 sm:p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600" />
                      Account Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Email</span>
                        <div className="flex items-center min-w-0">
                          <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mr-2 truncate">
                            {basic_info?.email}
                          </span>
                          {account_status.email_verified ? (
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Member Since</span>
                        <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          {formatDate(account_insights.member_since)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 sm:p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
                      Community
                    </h3>
                    {/* Coming Soon Message */}
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Coming Soon
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Community features will be available soon!
                      </p>
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
                className="space-y-4 sm:space-y-6"
              >
                {/* Mobile-Optimized Achievements Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700 mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
                    <Award className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-yellow-600" />
                    Achievements
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="text-center p-3 sm:p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="text-xl sm:text-2xl font-bold text-yellow-600">
                        {learning_analytics.skill_points}
                      </div>
                      <div className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-300">
                        Skill Points
                      </div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-xl sm:text-2xl font-bold text-green-600">
                        {learning_analytics.certificates_earned}
                      </div>
                      <div className="text-xs sm:text-sm text-green-700 dark:text-green-300">
                        Certificates
                      </div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-xl sm:text-2xl font-bold text-purple-600">
                        {learning_analytics.longest_streak}
                      </div>
                      <div className="text-xs sm:text-sm text-purple-700 dark:text-purple-300">
                        Best Streak
                      </div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-xl sm:text-2xl font-bold text-blue-600">
                        {learning_analytics.completion_rate}%
                      </div>
                      <div className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
                        Completion
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile-Optimized Financial Overview */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700 mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
                    <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600" />
                    Financial Overview
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                        {formatCurrency(financial_metrics.total_spent)}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Spent</div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                        {financial_metrics.total_courses_purchased}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Courses</div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                        {financial_metrics.successful_transactions}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Payments</div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                        {formatCurrency(financial_metrics.lifetime_value)}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Lifetime Value</div>
                    </div>
                  </div>
                </div>

                {/* Mobile-Optimized Device & Security Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
                      <Monitor className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-purple-600" />
                      Device Information
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Active Sessions</span>
                        <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          {device_info.active_sessions}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Trusted Devices</span>
                        <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          {device_info.trusted_devices}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Unique IPs</span>
                        <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          {device_info.unique_ip_addresses}
                        </span>
                      </div>
                      <div className="mt-3 sm:mt-4">
                        <h4 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-2">
                          Device Breakdown
                        </h4>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                            <div className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">
                              {device_info.device_breakdown.mobile}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Mobile</div>
                          </div>
                          <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                            <div className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">
                              {device_info.device_breakdown.tablet}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Tablet</div>
                          </div>
                          <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                            <div className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">
                              {device_info.device_breakdown.desktop}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Desktop</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
                      <Shield className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600" />
                      Security Overview
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Security Score</span>
                        <span className="text-xs sm:text-sm font-medium text-green-600">
                          {account_insights.security_score}/100
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Failed Attempts</span>
                        <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          {account_status.failed_login_attempts}
                        </span>
                      </div>
                      <div className="mt-3 sm:mt-4">
                        <h4 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-2">
                          Verification Status
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400">Email</span>
                            {account_status.email_verified ? (
                              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400">Phone</span>
                            {account_status.phone_verified ? (
                              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400">Identity</span>
                            {account_status.identity_verified ? (
                              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                            )}
                          </div>
                        </div>
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
                      {education.enrollments.map((course: any, index: number) => {
                        // Extract course title from various possible fields
                        const courseTitle = course.course_title || 
                                          course.title || 
                                          course.name || 
                                          course.course?.title || 
                                          course.course?.name ||
                                          `Course ${index + 1}`;
                        
                        // Ensure progress is a number and handle various formats
                        const progressValue = typeof course.progress === 'number' ? course.progress : 
                                            parseFloat(course.progress) || 0;
                        
                        // Handle enrollment date from various possible fields
                        const enrollmentDate = course.enrollment_date || 
                                             course.enrollmentDate || 
                                             course.enrolled_at || 
                                             course.created_at ||
                                             new Date().toISOString();
                        
                        // Handle status with proper capitalization
                        const status = (course.status || course.enrollmentStatus || 'active').toLowerCase();
                        
                        return (
                          <div key={course.course_id || course.id || index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate" title={courseTitle}>
                                  {courseTitle}
                                </h4>
                                {course.instructor && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    by {course.instructor}
                                  </p>
                                )}
                              </div>
                              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                                status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                                status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                                status === 'paused' || status === 'on_hold' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                              }`}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </span>
                            </div>
                            
                            {/* Course metadata */}
                            {(course.difficulty || course.duration) && (
                              <div className="flex gap-2 mb-3">
                                {course.difficulty && (
                                  <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                                    {course.difficulty}
                                  </span>
                                )}
                                {course.duration && (
                                  <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                                    {course.duration}
                                  </span>
                                )}
                              </div>
                            )}
                            
                            <div className="mb-3">
                              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                                <span>Progress</span>
                                <span>{Math.round(progressValue)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    progressValue === 0 ? 'bg-gray-400' :
                                    progressValue < 25 ? 'bg-red-500' :
                                    progressValue < 50 ? 'bg-yellow-500' :
                                    progressValue < 75 ? 'bg-blue-500' :
                                    'bg-green-500'
                                  }`}
                                  style={{ width: `${Math.min(Math.max(progressValue, 0), 100)}%` }}
                                ></div>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Enrolled: {formatDate(enrollmentDate)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No courses enrolled yet</p>
                    </div>
                  )}
                </div>

                {/* Learning Paths */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                    <Target className="h-5 w-5 mr-2 text-purple-600" />
                    Learning Paths
                  </h3>
                  {education.learning_paths && education.learning_paths.length > 0 ? (
                    <div className="space-y-4">
                      {education.learning_paths.map((path: any, index: number) => {
                        const coursesCompleted = path.courses_completed || 0;
                        const totalCourses = path.total_courses || 1;
                        const progress = path.progress || Math.round((coursesCompleted / totalCourses) * 100);
                        
                        return (
                          <div key={path.id || index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {path.name || `Learning Path ${index + 1}`}
                              </h4>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {coursesCompleted}/{totalCourses} courses
                              </span>
                            </div>
                            {path.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                {path.description}
                              </p>
                            )}
                            <div className="mb-2">
                              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                                <span>Overall Progress</span>
                                <span>{Math.round(progress)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No learning paths available</p>
                      <p className="text-xs mt-1">Complete your first course to unlock learning paths!</p>
                    </div>
                  )}
                </div>

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


              </motion.div>
            )}



            {activeTab === 'security' && (
              <motion.div
                key="security"
                id="security-section"
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

                {/* Password Change Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <Lock className="h-5 w-5 mr-2 text-red-600" />
                      Change Password
                    </h3>
                    {!isChangingPassword && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsChangingPassword(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <Lock className="h-4 w-4 mr-2 inline" />
                        Change Password
                      </motion.button>
                    )}
                  </div>

                  {!isChangingPassword ? (
                    <div className="text-center py-8">
                      <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 mb-2">Keep your account secure</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Regular password updates help protect your account from unauthorized access
                      </p>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Password Change Form */}
                      <div className="space-y-6">
                        {/* Error Display */}
                        {passwordErrors.length > 0 && (
                          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <div className="flex">
                              <XCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
                              <div>
                                <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                                  Please fix the following errors:
                                </h4>
                                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                                  {passwordErrors.map((error, index) => (
                                    <li key={index} className="flex items-start">
                                      <span className="mr-2">•</span>
                                      <span>{error}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}



                        {/* Current Password */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Current Password *
                          </label>
                          <div className="relative">
                            <input
                              type={showPasswords.current ? "text" : "password"}
                              value={passwordData.current_password}
                              onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                              className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter your current password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                            >
                              {showPasswords.current ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* New Password */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            New Password *
                          </label>
                          <div className="relative">
                            <input
                              type={showPasswords.new ? "text" : "password"}
                              value={passwordData.new_password}
                              onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                              className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter your new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                            >
                              {showPasswords.new ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Confirm New Password */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Confirm New Password *
                          </label>
                          <div className="relative">
                            <input
                              type={showPasswords.confirm ? "text" : "password"}
                              value={passwordData.confirm_password}
                              onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                              className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Confirm your new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                            >
                              {showPasswords.confirm ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-4 pt-4">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleChangePassword}
                            disabled={changingPassword}
                            className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium transition-colors"
                          >
                            {changingPassword ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Changing Password...
                              </>
                            ) : (
                              <>
                                <Lock className="h-4 w-4 mr-2" />
                                Change Password
                              </>
                            )}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCancelPasswordChange}
                            disabled={changingPassword}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            Cancel
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>



                {/* Advanced Security Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-gray-600" />
                    Advanced Security Settings
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Security Recommendations */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-3 flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        Security Recommendations
                      </h4>
                      <div className="space-y-2">

                        <div className="flex items-center text-sm text-blue-700 dark:text-blue-300">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          <span>Use strong, unique passwords for your account</span>
                        </div>
                        <div className="flex items-center text-sm text-blue-700 dark:text-blue-300">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          <span>Regularly review your active sessions and trusted devices</span>
                        </div>
                        <div className="flex items-center text-sm text-blue-700 dark:text-blue-300">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          <span>Keep your contact information up to date for account recovery</span>
                        </div>
                      </div>
                    </div>

                    {/* Account Recovery */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                        <RefreshCw className="h-4 w-4 mr-2 text-gray-600" />
                        Account Recovery
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Ensure you can recover your account if you lose access to your authentication methods.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="text-gray-700 dark:text-gray-300">Recovery Email: </span>
                          <span className="font-medium text-gray-900 dark:text-white">{basic_info?.email}</span>
                          {account_status.email_verified ? (
                            <CheckCircle className="h-4 w-4 text-green-500 inline ml-2" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500 inline ml-2" />
                          )}
                        </div>
                        {!account_status.email_verified && (
                          <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                            Verify Email
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Security Activity */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                        <Activity className="h-4 w-4 mr-2 text-gray-600" />
                        Recent Security Activity
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Monitor recent security-related activities on your account.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Last password change:</span>
                          <span className="text-gray-900 dark:text-white">30 days ago</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Failed login attempts:</span>
                          <span className="text-gray-900 dark:text-white">{account_status.failed_login_attempts}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Active sessions:</span>
                          <span className="text-gray-900 dark:text-white">{device_info.active_sessions}</span>
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
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Country</label>
                        <p className="text-gray-900 dark:text-white">{basic_info?.country || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                        <p className="text-gray-900 dark:text-white text-sm">{basic_info?.address || 'Not provided'}</p>
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
                    </div>
                    <div className="space-y-4">
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
                          {personal_details.certifications.map((cert: any, index: number) => (
                            <div key={index} className="flex items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <Award className="h-4 w-4 text-yellow-600 mr-2" />
                              <span className="text-sm text-gray-900 dark:text-white">
                                {typeof cert === 'string' ? cert : cert.name || 'Unknown Certification'}
                              </span>
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
                          {personal_details.learning_goals.map((goal: any, index: number) => (
                            <div key={index} className="flex items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <Target className="h-4 w-4 text-orange-600 mr-2" />
                              <span className="text-sm text-gray-900 dark:text-white">
                                {typeof goal === 'string' ? goal : goal.goal || 'Unknown Goal'}
                              </span>
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
            {!['overview', 'courses', 'financial', 'engagement', 'security', 'personal'].includes(activeTab) && (
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
          >
            <div className="p-3 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Edit Profile Information</h3>
                <button
                  onClick={handleCancel}
                  className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Close edit profile"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                {/* Basic Information Section */}
                <div>
                  <h4 className="text-sm sm:text-md font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 pb-2 border-b border-gray-200 dark:border-gray-600">Basic Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mobile-form-grid">
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Age
                      </label>
                      <input
                        type="number"
                        value={editData.age || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, age: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g., 25"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        value={editData.country || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, country: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g., India, United States"
                      />
                    </div>

                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Address
                      </label>
                      <textarea
                        value={editData.address || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, address: e.target.value }))}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter your full address"
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

                {/* Education Information Section */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-600">Education Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Education Level
                      </label>
                      <select
                        value={editData.education_level || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, education_level: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">Select Education Level</option>
                        <option value="High School">High School</option>
                        <option value="Diploma">Diploma</option>
                        <option value="Bachelor's Degree">Bachelor's Degree</option>
                        <option value="Master's Degree">Master's Degree</option>
                        <option value="Doctorate/PhD">PhD</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Institution Name
                      </label>
                      <input
                        type="text"
                        value={editData.institution_name || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, institution_name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g., University of Delhi"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Field of Study
                      </label>
                      <input
                        type="text"
                        value={editData.field_of_study || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, field_of_study: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g., Computer Science"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Graduation Year
                      </label>
                      <input
                        type="number"
                        value={editData.graduation_year || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, graduation_year: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g., 2023"
                        min="1950"
                        max={new Date().getFullYear() + 10}
                      />
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
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
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

                </div>

                {/* Right Column */}
                <div className="space-y-4">

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
                  onClick={() => {
                    console.log('🖱️ Save button clicked!');
                    console.log('📊 Current saving state:', saving);
                    console.log('📋 Current editData state:', editData);
                    handleSave();
                  }}
                  disabled={saving}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                
                {/* TEST BUTTON - Remove after debugging */}
                <button
                  onClick={testSaveWithHardcodedData}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 ml-2"
                >
                  🧪 Test Save
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