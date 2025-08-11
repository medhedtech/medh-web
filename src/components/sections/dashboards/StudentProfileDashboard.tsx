"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Edit3, 
  Camera, 
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Globe,
  Linkedin,
  Github,
  ExternalLink,
  Settings,
  Bell,
  Shield,
  Award,
  BookOpen,
  Clock,
  TrendingUp,
  Users,
  CheckCircle,
  AlertCircle,
  Info,
  Activity,
  Smartphone,
  Monitor,
  Tablet,
  ChevronRight,
  Star,
  Target,
  BarChart3,
  PieChart,
  Zap,
  Heart,
  Eye,
  Download,
  Share2,
  Lock,
  Unlock,
  Badge,
  Trophy,
  Flame,
  Wallet,
  CreditCard,
  PlayCircle,
  FileText,
  MessageSquare,
  ThumbsUp
} from 'lucide-react';
import Image from 'next/image';
import { 
  getCurrentUserProfile, 
  updateCurrentUserProfile, 
  getCurrentUserProfileStats,
  IUserProfile,
  IUserStatistics
} from '../../../apis/profile.api';

// Interface for component state
interface IProfileState {
  profile: IUserProfile | null;
  statistics: IUserStatistics | null;
  loading: boolean;
  error: string | null;
  isEditing: boolean;
  editForm: Partial<IUserProfile>;
}

const StudentProfileDashboard: React.FC = () => {
  const [state, setState] = useState<IProfileState>({
    profile: null,
    statistics: null,
    loading: true,
    error: null,
    isEditing: false,
    editForm: {}
  });
  
  const [userRole, setUserRole] = useState('student');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Initialize user data from localStorage
  useEffect(() => {
    const storedName = localStorage.getItem('userName') || localStorage.getItem('fullName') || 'Student';
    const storedEmail = localStorage.getItem('userEmail') || localStorage.getItem('email') || '';
    const storedRole = localStorage.getItem('role') || 'student';
    
    setUserName(storedName);
    setUserEmail(storedEmail);
    setUserRole(storedRole);
  }, []);

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const [profileResponse, statsResponse] = await Promise.all([
          getCurrentUserProfile(),
          getCurrentUserProfileStats()
        ]);

        // Update state with both profile and statistics data
        setState(prev => ({
          ...prev,
          profile: profileResponse.status === 'success' && profileResponse.data?.user 
            ? profileResponse.data.user 
            : null,
          statistics: statsResponse.status === 'success' && statsResponse.data?.statistics 
            ? statsResponse.data.statistics 
            : null,
          loading: false,
          error: null
        }));

        // Log success for debugging
        if (profileResponse.status === 'success') {
          console.log('✅ Profile data loaded successfully');
        }
        if (statsResponse.status === 'success') {
          console.log('✅ Statistics data loaded successfully');
        }

      } catch (error) {
        console.error('❌ Error fetching profile data:', error);
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: 'Failed to load profile data' 
        }));
      }
    };

    fetchProfileData();
  }, []);

  // Handle profile edit
  const handleEditProfile = () => {
    if (state.profile) {
      setState(prev => ({ 
        ...prev, 
        isEditing: true, 
        editForm: { ...state.profile } 
      }));
    }
  };

  // Handle save profile
  const handleSaveProfile = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      const response = await updateCurrentUserProfile(state.editForm);
   
      if (response.status === 'success' && response.data?.user) {
        setState(prev => ({ 
          ...prev, 
          profile: response.data!.user,
          isEditing: false,
          loading: false,
          editForm: {}
        }));
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Failed to update profile' 
      }));
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setState(prev => ({ 
      ...prev, 
      isEditing: false, 
      editForm: {} 
    }));
  };

  // Handle input change
  const handleInputChange = (field: string, value: any) => {
    setState(prev => ({
      ...prev,
      editForm: {
        ...prev.editForm,
        [field]: value
      }
    }));
  };

  // Get device icon
  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType?.toLowerCase()) {
      case 'mobile': return Smartphone;
      case 'tablet': return Tablet;
      default: return Monitor;
    }
  };

  // Format duration
  const formatDuration = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    return `${Math.round(hours)}h`;
  };

  // Get activity color
  const getActivityColor = (action: string) => {
    switch (action) {
      case 'login': return 'text-green-600 dark:text-green-400';
      case 'logout': return 'text-red-600 dark:text-red-400';
      case 'course_view': return 'text-blue-600 dark:text-blue-400';
      case 'profile_view': return 'text-purple-600 dark:text-purple-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  // Safe date formatting
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Recently';
    }
  };

  // Calculate profile completion
  const calculateProfileCompletion = () => {
    if (!state.profile) return 0;
    
    const fields = [
      state.profile.full_name,
      state.profile.email,
      state.profile.phone_numbers?.length,
      state.profile.user_image?.url,
      state.profile.bio,
      state.profile.address,
      state.profile.organization
    ];
    
    const completedFields = fields.filter(field => field && field !== '').length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  // Extract active sessions from activity logs
  const activeSessions = (state.profile as any)?.activity_logs?.filter((activity: any) => 
    activity.action === 'login' && 
    new Date(activity.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000
  ) || [];

  if (state.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading your profile...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full max-w-full overflow-x-hidden">
      {/* Main Content Container */}
      <div className="w-full max-w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            
        {/* Error Message */}
        {state.error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-sm sm:text-base text-red-800 dark:text-red-200 break-words">
                {state.error}
              </p>
            </div>
          </motion.div>
        )}

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden mb-6 sm:mb-8"
        >
          {/* Hero Background */}
          <div className="h-24 sm:h-32 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 relative">
            <div className="absolute inset-0 bg-black/20" />
          </div>

          {/* Profile Content */}
          <div className="relative px-4 sm:px-6 pb-4 sm:pb-6">
            {/* Profile Image and Info */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4 lg:space-x-6 -mt-12 sm:-mt-16">
              {/* Profile Image */}
              <div className="relative flex-shrink-0 mb-4 sm:mb-0 self-center sm:self-auto">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-100 dark:bg-gray-700 shadow-xl">
                  <Image
                    src={state.profile?.user_image?.url || '/avatars/default-avatar.png'}
                    alt={state.profile?.full_name || 'Profile'}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button 
                  className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 p-1.5 sm:p-2 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-105"
                  aria-label="Change profile picture"
                >
                  <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                {(state.profile as any)?.is_online && (
                  <div className="absolute top-1 right-1 sm:top-2 sm:right-2 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2 break-words">
                      {state.profile?.full_name || userName || 'Student Name'}
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 max-w-full sm:max-w-md break-words">
                      {state.profile?.bio || 'Add a bio to tell others about yourself'}
                    </p>
                    
                    {/* Quick Stats */}
                    <div className="flex flex-col sm:flex-row sm:flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">{state.profile?.email || userEmail}</span>
                        {(state.profile as any)?.email_verified && (
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span>Joined {formatDate(state.profile?.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span>Last login {formatDate(state.profile?.last_seen)}</span>
                      </div>
                      {(state.profile as any)?.is_online && (
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span>Online</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <button
                      onClick={handleEditProfile}
                      className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-lg text-sm sm:text-base"
                    >
                      <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Edit Profile</span>
                    </button>
                    <button className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm sm:text-base">
                      <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {[
            {
              icon: BookOpen,
              label: 'Courses Enrolled',
              value: state.statistics?.learning?.total_courses_enrolled || 0,
              color: 'blue',
              bgColor: 'bg-blue-100 dark:bg-blue-900/30',
              textColor: 'text-blue-600 dark:text-blue-400'
            },
            {
              icon: Award,
              label: 'Certificates',
              value: state.statistics?.learning?.certificates_earned || 0,
              color: 'green',
              bgColor: 'bg-green-100 dark:bg-green-900/30',
              textColor: 'text-green-600 dark:text-green-400'
            },
            {
              icon: Clock,
              label: 'Learning Time',
              value: formatDuration(state.statistics?.learning?.total_learning_time || 0),
              color: 'purple',
              bgColor: 'bg-purple-100 dark:bg-purple-900/30',
              textColor: 'text-purple-600 dark:text-purple-400'
            },
            {
              icon: Activity,
              label: 'Last Login',
              value: formatDate(state.profile?.last_seen) || 'Never',
              color: 'orange',
              bgColor: 'bg-orange-100 dark:bg-orange-900/30',
              textColor: 'text-orange-600 dark:text-orange-400'
            }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className={`p-2 sm:p-3 rounded-xl ${stat.bgColor}`}>
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.textColor}`} />
                  </div>
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                </div>
                <div className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 break-words">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 break-words">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Profile Completion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700 mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Profile Completion
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 break-words">
                Complete your profile to get personalized recommendations
              </p>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="text-right">
                <div className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {profileCompletion}%
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Complete
                </div>
              </div>
              
              <div className="relative w-12 h-12 sm:w-16 sm:h-16">
                <svg className="w-12 h-12 sm:w-16 sm:h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200 dark:text-gray-700"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-green-500"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${profileCompletion}, 100`}
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Completion Tasks */}
          <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: 'Email', completed: !!state.profile?.email, icon: Mail },
              { label: 'Phone', completed: !!(state.profile?.phone_numbers?.length), icon: Phone },
              { label: 'Bio', completed: !!state.profile?.bio, icon: User },
              { label: 'Education', completed: !!(state.profile?.meta?.education_level), icon: GraduationCap }
            ].map((task, index) => {
              const Icon = task.icon;
              return (
                <div
                  key={index}
                  className={`flex items-center gap-2 p-2 sm:p-3 rounded-xl transition-colors ${
                    task.completed
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                      : 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium break-words">{task.label}</span>
                  {task.completed && <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 ml-auto flex-shrink-0" />}
                </div>
              );
            })}
          </div>

          <button
            onClick={handleEditProfile}
            className="mt-4 sm:mt-4 w-full sm:w-auto px-4 sm:px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm sm:text-base"
          >
            Complete Profile
          </button>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              Recent Activity
            </h3>
            <button className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 text-xs sm:text-sm font-medium">
              View All
            </button>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {(state.profile as any)?.activity_logs?.slice(0, 5).map((activity: any, index: number) => {
              const DeviceIcon = getDeviceIcon(activity.metadata?.device_type);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="p-1.5 sm:p-2 rounded-lg bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                    <DeviceIcon className={`w-3 h-3 sm:w-4 sm:h-4 ${getActivityColor(activity.action)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white break-words">
                      {activity.action.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(activity.timestamp)}
                    </p>
                    {activity.metadata?.device_type && (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs text-gray-500 capitalize">
                          {activity.metadata.device_type}
                        </span>
                        {activity.metadata.geolocation?.city && (
                          <>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500 break-words">
                              {activity.metadata.geolocation.city}
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                </motion.div>
              );
            }) || (
              <div className="text-center py-8 sm:py-12">
                <Activity className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">No recent activity</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {state.isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
                  Edit Profile
                </h3>
                
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={state.editForm.full_name || ''}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all text-sm sm:text-base"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={state.editForm.bio || ''}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={4}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all resize-none text-sm sm:text-base"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        value={state.editForm.address || ''}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all text-sm sm:text-base"
                        placeholder="Enter your address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Organization
                      </label>
                      <input
                        type="text"
                        value={state.editForm.organization || ''}
                        onChange={(e) => handleInputChange('organization', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all text-sm sm:text-base"
                        placeholder="Enter your organization"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 sm:mt-8">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 sm:px-6 py-2 sm:py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={state.loading}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-xl transition-all duration-200 hover:scale-105 shadow-lg text-sm sm:text-base"
                  >
                    {state.loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentProfileDashboard; 