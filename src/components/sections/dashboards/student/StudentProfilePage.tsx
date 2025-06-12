"use client";

import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent,  
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  School, 
  Award, 
  BookOpen,
  Bell,
  Settings,
  Edit,
  Camera,
  GraduationCap,
  Trophy,
  Lock,
  ShieldCheck,
  Sun,
  Globe,
  Eye,
  AlertCircle,
  Loader2,
  Github,
  Linkedin,
  Twitter,
  Facebook,
  Instagram
} from "lucide-react";
import { toast } from "react-toastify";
import LoadingIndicator from "@/components/shared/loaders/LoadingIndicator";
import useGetQuery from "@/hooks/getQuery.hook";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";

// TypeScript interfaces
interface IUserProfile {
  _id: string;
  full_name: string;
  email: string;
  phone_numbers?: Array<{
    country: string;
    number: string;
  }>;
  meta?: {
    age?: string;
    gender?: string;
    bio?: string;
    location?: string;
    education?: string;
    major?: string;
    graduation_year?: string;
    skills?: string[];
    social_profiles?: Array<{
      platform: string;
      url: string;
      username?: string;
    }>;
  };
  user_image?: string;
  cover_image?: string;
  role: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface IStudentStats {
  coursesEnrolled: number;
  coursesCompleted: number;
  averageGrade: number;
  totalStudyHours: number;
  certificatesEarned: number;
  goalsAchieved: number;
}

interface INotificationSettings {
  push_notifications: boolean;
  email_updates: boolean;
  sms_notifications: boolean;
  newsletter_subscription: boolean;
}

interface IPrivacySettings {
  profile_visibility: 'everyone' | 'connections' | 'me';
  show_email: boolean;
  show_phone: boolean;
  show_achievements: boolean;
}

const StudentProfilePage: React.FC = () => {
  // State management
  const [profileData, setProfileData] = useState<IUserProfile | null>(null);
  const [studentStats, setStudentStats] = useState<IStudentStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [userId, setUserId] = useState<string | null>(null);
  
  // Settings states
  const [notificationSettings, setNotificationSettings] = useState<INotificationSettings>({
    push_notifications: true,
    email_updates: true,
    sms_notifications: false,
    newsletter_subscription: true
  });
  
  const [privacySettings, setPrivacySettings] = useState<IPrivacySettings>({
    profile_visibility: 'everyone',
    show_email: true,
    show_phone: false,
    show_achievements: true
  });

  // Hooks
  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();

  // Initialize and fetch data
  useEffect(() => {
    const initializeProfile = async () => {
      try {
        setLoading(true);
        
        // Get user ID from localStorage or auth context
        const storedUserId = localStorage.getItem("userId");
        if (!storedUserId) {
          toast.error("Please log in to access your profile");
          window.location.href = "/login";
          return;
        }
        
        setUserId(storedUserId);
        
        // Fetch user profile data and dashboard stats in parallel
        await Promise.all([
          fetchUserProfile(storedUserId),
          fetchStudentStats(storedUserId)
        ]);
        
      } catch (error) {
        console.error("Error initializing profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    initializeProfile();
  }, []);

  // API Functions
  const fetchUserProfile = async (userId: string) => {
    try {
      const response = await getQuery({
        url: `${apiUrls.user.getDetailsbyId}/${userId}`,
        showToast: false
      });

      if (response?.data) {
        setProfileData(response.data);
      } else {
        console.warn("No profile data received");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Failed to load profile information");
    }
  };

  const fetchStudentStats = async (userId: string) => {
    try {
      const response = await getQuery({
        url: apiUrls.analytics.getStudentDashboardStats(userId),
        showToast: false
      });

      if (response?.data?.stats) {
        setStudentStats(response.data.stats);
      } else {
        console.warn("No student stats received");
      }
    } catch (error) {
      console.error("Error fetching student stats:", error);
      // Don't show error toast for stats as it's not critical
    }
  };

  // Utility Functions
  const formatDate = (dateString: string): string => {
    if (!dateString) return "Not available";
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return "Invalid date";
    }
  };

  const calculateAge = (dateString: string): number => {
    if (!dateString) return 0;
    try {
      const today = new Date();
      const birthDate = new Date(dateString);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    } catch {
      return 0;
    }
  };

  const getProfileCompletion = (): number => {
    if (!profileData) return 0;
    
    let totalFields = 8;
    let filledFields = 0;
    
    if (profileData.user_image) filledFields++;
    if (profileData.meta?.bio) filledFields++;
    if (profileData.meta?.education) filledFields++;
    if (profileData.meta?.location) filledFields++;
    if (profileData.meta?.skills && profileData.meta.skills.length > 0) filledFields++;
    if (profileData.meta?.social_profiles && profileData.meta.social_profiles.length > 0) filledFields++;
    if (profileData.phone_numbers && profileData.phone_numbers.length > 0) filledFields++;
    if (profileData.meta?.major) filledFields++;
    
    return Math.round((filledFields / totalFields) * 100);
  };

  // Event Handlers
  const handleEditProfile = () => {
    window.location.href = "/dashboards/edit-profile";
  };

  const handleViewCourses = () => {
    window.location.href = "/dashboards/student/all-courses";
  };

  const handleSettings = () => {
    window.location.href = "/dashboards/student-settings";
  };

  const handleMyProfile = () => {
    window.location.href = "/dashboards/student/profile";
  };

  const handleMyCourses = () => {
    window.location.href = "/dashboards/student/my-courses";
  };

  const handleEnrolledCourses = () => {
    window.location.href = "/dashboards/student/enrolled-courses";
  };

  const handleCompletedCourses = () => {
    window.location.href = "/dashboards/student/completed-courses";
  };

  const handleAssignments = () => {
    window.location.href = "/dashboards/student/assignments";
  };

  const handleQuizzes = () => {
    window.location.href = "/dashboards/student/quiz";
  };

  const handleCertificates = () => {
    window.location.href = "/dashboards/student/certificate";
  };

  const handleProgress = () => {
    window.location.href = "/dashboards/student/progress";
  };

  const handleUpcomingClasses = () => {
    window.location.href = "/dashboards/student/upcoming-classes";
  };

  const handleLiveClasses = () => {
    window.location.href = "/dashboards/student/live-classes";
  };

  const handleRecordedSessions = () => {
    window.location.href = "/dashboards/student/access-recorded-sessions";
  };

  const handleFeedback = () => {
    window.location.href = "/dashboards/student/feedback";
  };

  const handleMembership = () => {
    window.location.href = "/dashboards/student/membership";
  };

  const handleGoals = () => {
    window.location.href = "/dashboards/student/goals";
  };

  const handleResources = () => {
    window.location.href = "/dashboards/student/resources";
  };

  const handleSettingChange = async (category: 'notification' | 'privacy', key: string, value: any) => {
    if (!userId) {
      toast.error("User not authenticated");
      return;
    }
    
    try {
      const updateData = {
        settings: {
          [`${category}_${key}`]: value
        }
      };

      const response = await postQuery({
        url: `${apiUrls.user.update}/${userId}`,
        postData: updateData,
        showToast: false
      });
      
      if (response?.data) {
        // Update local state
        if (category === 'notification') {
          setNotificationSettings(prev => ({ ...prev, [key]: value }));
        } else if (category === 'privacy') {
          setPrivacySettings(prev => ({ ...prev, [key]: value }));
        }
        
        toast.success("Settings updated successfully");
      } else {
        toast.error("Failed to update settings");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    }
  };

  // Render Functions
  const renderEmptyState = (icon: React.ReactNode, title: string, description: string, action?: React.ReactNode) => (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">{description}</p>
      {action}
    </div>
  );

  const renderProfileStats = () => {
    if (!studentStats) {
      return renderEmptyState(
        <BookOpen className="w-8 h-8 text-gray-400" />,
        "No Academic Data",
        "Your academic progress will appear here once you enroll in courses.",
        <Button onClick={handleViewCourses} className="bg-primary-600 hover:bg-primary-700">
          Browse Courses
        </Button>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{studentStats.coursesEnrolled}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Enrolled</p>
        </div>
        
        <div className="text-center p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <Trophy className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{studentStats.coursesCompleted}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
        </div>
        
        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <Award className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{studentStats.averageGrade.toFixed(1)}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg Grade</p>
        </div>
      </div>
    );
  };

  const renderSocialProfiles = () => {
    if (!profileData?.meta?.social_profiles || profileData.meta.social_profiles.length === 0) {
      return renderEmptyState(
        <User className="w-8 h-8 text-gray-400" />,
        "No Social Profiles",
        "Add your social media profiles to connect with others.",
        <Button onClick={handleEditProfile} variant="outline">
          Add Social Profiles
        </Button>
      );
    }

    return (
      <div className="space-y-3">
        {profileData.meta.social_profiles.map((profile, index) => (
          <a
            key={index}
            href={profile.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {profile.platform.toLowerCase() === 'github' && <Github className="w-5 h-5 text-gray-900 dark:text-white" />}
            {profile.platform.toLowerCase() === 'linkedin' && <Linkedin className="w-5 h-5 text-blue-600" />}
            {profile.platform.toLowerCase() === 'twitter' && <Twitter className="w-5 h-5 text-blue-400" />}
            {profile.platform.toLowerCase() === 'facebook' && <Facebook className="w-5 h-5 text-blue-600" />}
            {profile.platform.toLowerCase() === 'instagram' && <Instagram className="w-5 h-5 text-pink-600" />}
            <div>
              <p className="font-medium">{profile.platform}</p>
              {profile.username && (
                <p className="text-sm text-gray-500">@{profile.username}</p>
              )}
            </div>
          </a>
        ))}
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingIndicator type="spinner" size="lg" color="primary" text="Loading your profile..." centered />
      </div>
    );
  }

  // Authentication required state
  if (!userId || !profileData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Profile Not Available</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
          We couldn't load your profile information. Please ensure you're logged in and try again.
        </p>
        <div className="flex gap-3">
          <Button onClick={() => window.location.href = "/login"} className="bg-primary-600 hover:bg-primary-700">
            Login
          </Button>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const profileCompletion = getProfileCompletion();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Progress Indicator */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Profile Completion</span>
          <div className="flex-1 max-w-xs">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
          </div>
          <span className="text-sm font-semibold text-blue-600">{profileCompletion}%</span>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                  {profileData.user_image ? (
                    <img 
                      src={profileData.user_image} 
                      alt={profileData.full_name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    profileData.full_name?.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profileData.full_name}</h1>
                <p className="text-gray-600 dark:text-gray-400">{profileData.meta?.major || "Student"}</p>
                <div className="flex items-center gap-4 mt-1">
                  {profileData.meta?.education && (
                    <Badge variant="secondary" className="text-xs">
                      <School className="w-3 h-3 mr-1" />
                      {profileData.meta.education}
                    </Badge>
                  )}
                  {profileData.meta?.location && (
                    <Badge variant="secondary" className="text-xs">
                      <MapPin className="w-3 h-3 mr-1" />
                      {profileData.meta.location}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="md:ml-auto">
              <Button onClick={handleEditProfile} className="bg-blue-600 hover:bg-blue-700">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Academic Progress */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Academic Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderProfileStats()}
                </CardContent>
              </Card>

              {/* Profile Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium truncate">{profileData.email}</p>
                    </div>
                  </div>
                  
                  {profileData.phone_numbers && profileData.phone_numbers.length > 0 && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{profileData.phone_numbers[0].number}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-medium">{formatDate(profileData.createdAt)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* About Section */}
              {profileData.meta?.bio && (
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {profileData.meta.bio}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Skills */}
              {profileData.meta?.skills && profileData.meta.skills.length > 0 && (
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profileData.meta.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Social Profiles */}
              <Card>
                <CardHeader>
                  <CardTitle>Social Profiles</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderSocialProfiles()}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="academic" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Academic History</CardTitle>
                </CardHeader>
                <CardContent>
                  {profileData.meta?.education ? (
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                          <GraduationCap className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{profileData.meta.education}</h4>
                          {profileData.meta.major && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">{profileData.meta.major}</p>
                          )}
                          {profileData.meta.graduation_year && (
                            <p className="text-sm text-gray-500">Class of {profileData.meta.graduation_year}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    renderEmptyState(
                      <School className="w-8 h-8 text-gray-400" />,
                      "No Academic History",
                      "Add your educational background to showcase your academic journey.",
                      <Button onClick={handleEditProfile} variant="outline">
                        Add Education
                      </Button>
                    )
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  {studentStats?.certificatesEarned ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        <span className="font-medium">{studentStats.certificatesEarned} Certificates Earned</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-blue-500" />
                        <span className="font-medium">{studentStats.goalsAchieved} Goals Achieved</span>
                      </div>
                    </div>
                  ) : (
                    renderEmptyState(
                      <Trophy className="w-8 h-8 text-gray-400" />,
                      "No Achievements Yet",
                      "Complete courses and achieve goals to earn achievements."
                    )
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Receive push notifications</p>
                    </div>
                    <Switch
                      checked={notificationSettings.push_notifications}
                      onCheckedChange={(checked) => handleSettingChange('notification', 'push_notifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Updates</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Receive email notifications</p>
                    </div>
                    <Switch
                      checked={notificationSettings.email_updates}
                      onCheckedChange={(checked) => handleSettingChange('notification', 'email_updates', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Newsletter</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Receive monthly newsletter</p>
                    </div>
                    <Switch
                      checked={notificationSettings.newsletter_subscription}
                      onCheckedChange={(checked) => handleSettingChange('notification', 'newsletter_subscription', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" />
                    Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Email</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Allow others to see your email</p>
                    </div>
                    <Switch
                      checked={privacySettings.show_email}
                      onCheckedChange={(checked) => handleSettingChange('privacy', 'show_email', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Achievements</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Display your achievements publicly</p>
                    </div>
                    <Switch
                      checked={privacySettings.show_achievements}
                      onCheckedChange={(checked) => handleSettingChange('privacy', 'show_achievements', checked)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Profile Visibility</label>
                    <select 
                      value={privacySettings.profile_visibility}
                      onChange={(e) => handleSettingChange('privacy', 'profile_visibility', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    >
                      <option value="everyone">Everyone</option>
                      <option value="connections">Connections Only</option>
                      <option value="me">Only Me</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Account Settings */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Account
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full md:w-auto"
                    onClick={handleSettings}
                  >
                    Change Password
                  </Button>
                  
                  <Button
                    variant="outline" 
                    className="w-full md:w-auto"
                    onClick={handleEditProfile}
                  >
                    Edit Profile Information
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentProfilePage; 