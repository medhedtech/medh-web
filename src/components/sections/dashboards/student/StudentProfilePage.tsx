"use client";

import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
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
  FileText,
  Settings,
  Edit,
  Camera,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Github,
  ExternalLink,
  Loader
} from "lucide-react";
import { toast } from "react-toastify";
import LoadingIndicator from "@/components/shared/loaders/LoadingIndicator";
import useGetQuery from "@/hooks/getQuery.hook";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls, apiBaseUrl } from "@/apis";

interface ProfileData {
  _id?: string;
  user_id?: string;
  full_name?: string;
  email?: string;
  phone_number?: string;
  age?: string;
  bio?: string;
  location?: string;
  education?: string;
  major?: string;
  graduation_year?: string;
  user_image?: string;
  cover_image?: string;
  facebook_link?: string;
  twitter_link?: string;
  linkedin_link?: string;
  instagram_link?: string;
  github_link?: string;
  skills?: string[];
  role?: string[];
  createdAt?: string;
  updatedAt?: string;
  status?: string;
  registration_id?: string;
  courses_enrolled?: number;
  courses_completed?: number;
  avg_grade?: string;
  social_profiles?: Array<{
    platform: string;
    url: string;
    username?: string;
  }>;
}

const mockProfileData: ProfileData = {
  _id: "12345",
  full_name: "Jane Smith",
  email: "jane.smith@example.com",
  phone_number: "9876543210",
  age: "1997-05-15",
  bio: "Passionate learner with an interest in data science and machine learning. Always looking to expand my knowledge and skills.",
  location: "San Francisco, CA",
  education: "Stanford University",
  major: "Computer Science",
  graduation_year: "2021",
  user_image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
  cover_image: "https://images.unsplash.com/photo-1557683304-673a23048d34?ixlib=rb-1.2.1&auto=format&fit=crop&w=1129&q=80",
  facebook_link: "https://facebook.com/janesmith",
  twitter_link: "https://twitter.com/janesmith",
  linkedin_link: "https://linkedin.com/in/janesmith",
  instagram_link: "https://instagram.com/janesmith",
  github_link: "https://github.com/janesmith",
  skills: ["Python", "Data Analysis", "Machine Learning", "Web Development", "SQL", "Statistics"],
  role: ["student"],
  createdAt: "2022-06-10",
  courses_enrolled: 5,
  courses_completed: 3,
  avg_grade: "A-",
  social_profiles: [
    { platform: "Facebook", url: "https://facebook.com/janesmith", username: "janesmith" },
    { platform: "Twitter", url: "https://twitter.com/janesmith", username: "janesmith" },
    { platform: "LinkedIn", url: "https://linkedin.com/in/janesmith", username: "janesmith" },
    { platform: "Instagram", url: "https://instagram.com/janesmith", username: "janesmith" },
    { platform: "GitHub", url: "https://github.com/janesmith", username: "janesmith" }
  ]
};

const StudentProfilePage: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [notifications, setNotifications] = useState<boolean>(true);
  const [emailUpdates, setEmailUpdates] = useState<boolean>(true);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  
  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        
        // For now, using mock data directly
        setProfileData(mockProfileData);
        setLoading(false);
        
      } catch (error) {
        console.error("Error in profile data fetch workflow:", error);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Format date string to readable format
  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Calculate age from date of birth
  const calculateAge = (dateString: string): number => {
    if (!dateString) return 0;
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Handle edit profile button click
  const handleEditProfile = () => {
    if (!profileData || !studentId) {
      toast.error("Profile data not available for editing");
      return;
    }
    
    // Redirect to edit profile page
    window.location.href = "/dashboards/student/edit-profile";
  };

  // Handle change profile image button click
  const handleChangeProfileImage = () => {
    toast.info("Change profile image feature coming soon!");
  };

  // Handle notification settings changes
  const handleNotificationSettingsChange = async (type: 'push' | 'email', value: boolean) => {
    if (!studentId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }
    
    try {
      // In a real implementation, this would update the user's notification preferences
      const settingKey = type === 'push' ? 'push_notifications' : 'email_updates';
      const response = await postQuery({
        url: apiUrls.user.update,
        postData: {
          id: studentId,
          settings: {
            [settingKey]: value
          }
        },
        showToast: false
      });
      
      if (response && response.data) {
        if (type === 'push') {
          setNotifications(value);
        } else {
          setEmailUpdates(value);
        }
        toast.success(`${type === 'push' ? 'Push notification' : 'Email update'} settings updated successfully`);
      } else {
        const errorData = response.error as any;
        toast.error(errorData?.message || "Failed to update settings");
      }
    } catch (error) {
      console.error(`Error updating ${type} notification settings:`, error);
      toast.error(`An error occurred while updating ${type} notification settings`);
    }
  };

  // Handle password change button click
  const handleChangePassword = () => {
    // In a real implementation, this would open a modal or redirect to change password page
    window.location.href = "/dashboards/student/settings";
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingIndicator type="spinner" size="lg" color="primary" text="Loading profile..." centered />
      </div>
    );
  }

  // Render error state if no profile data
  if (!profileData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://localhost:3000/dashboards/student/profilehttp://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Authentication Required</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          You need to be logged in to view your profile. Redirecting to login page...
        </p>
        <Button onClick={() => window.location.href = "/login"}>Login Now</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Cover Image and Profile Section */}
      <div className="relative mb-8">
        <div className="h-60 sm:h-80 w-full rounded-xl overflow-hidden">
          <img 
            src={profileData.cover_image} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
        </div>
        
        <div className="absolute bottom-6 left-6 sm:left-10 flex flex-col sm:flex-row items-start sm:items-end gap-4">
          <div className="relative">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white overflow-hidden bg-white">
              <img 
                src={profileData?.user_image || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'} 
                alt={profileData?.full_name || 'Profile'} 
                className="w-full h-full object-cover"
              />
            </div>
            <input 
              type="file" 
              id="profile-image-upload" 
              accept="image/*" 
              onChange={handleChangeProfileImage} 
              className="hidden" 
            />
            <label 
              htmlFor="profile-image-upload"
              className="absolute bottom-0 right-0 p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors cursor-pointer"
              title="Change profile picture"
            >
              {isUploading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
            </label>
          </div>
          
          <div className="text-white">
            <h1 className="text-2xl sm:text-3xl font-bold">{profileData.full_name}</h1>
            <p className="text-gray-200 flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {profileData.location}
            </p>
          </div>
          
          <div className="absolute bottom-6 right-6">
            <Button onClick={handleEditProfile} variant="outline" className="bg-white/90 hover:bg-white">
              <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid grid-cols-3 sm:grid-cols-5 md:w-[600px] mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Personal Information Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary-500" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Your basic profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</div>
                    <div className="font-medium">{profileData?.full_name || "N/A"}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</div>
                    <div className="font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {profileData?.email || "N/A"}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</div>
                    <div className="font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {profileData?.phone_number || "N/A"}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Date of Birth</div>
                    <div className="font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {profileData?.age ? formatDate(profileData.age) : "N/A"} 
                      {profileData?.age ? `(${calculateAge(profileData.age)} years)` : ""}
                    </div>
                  </div>
                  
                  <div className="space-y-2 sm:col-span-2">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Bio</div>
                    <div className="font-medium text-gray-700 dark:text-gray-300">
                      {profileData?.bio || "No bio provided."}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary-500" />
                  Learning Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center text-center space-y-2">
                  <div className="text-5xl font-bold text-primary-500">{profileData?.courses_completed || 0}</div>
                  <div className="text-gray-500 dark:text-gray-400">Courses Completed</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{profileData?.courses_enrolled || 0}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Enrolled</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{profileData?.avg_grade || "N/A"}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Avg. Grade</div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Member Since</div>
                  <div className="font-medium">{profileData?.createdAt ? formatDate(profileData.createdAt) : "N/A"}</div>
                </div>
              </CardContent>
            </Card>
            
            {/* Skills Card */}
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary-500" />
                  Skills & Expertise
                </CardTitle>
                <CardDescription>
                  Your areas of knowledge and expertise
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profileData?.skills && profileData.skills.length > 0 ? (
                    profileData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="py-1.5">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">
                      No skills listed yet. Update your profile to add skills.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Academic Tab */}
        <TabsContent value="academic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5 text-primary-500" />
                Education
              </CardTitle>
              <CardDescription>
                Your academic background and achievements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Institution</div>
                  <div className="font-medium">{profileData?.education || "Not provided"}</div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Major/Field of Study</div>
                  <div className="font-medium">{profileData?.major || "Not provided"}</div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Graduation Year</div>
                  <div className="font-medium">{profileData?.graduation_year || "Not provided"}</div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Grade</div>
                  <div className="font-medium">{profileData?.avg_grade || "N/A"}</div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium mb-4">Course Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Completion</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {profileData?.courses_enrolled && profileData.courses_enrolled > 0
                          ? Math.round((profileData.courses_completed || 0) / profileData.courses_enrolled * 100)
                          : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div 
                        className="bg-primary-500 h-2.5 rounded-full" 
                        style={{ 
                          width: `${profileData?.courses_enrolled && profileData.courses_enrolled > 0
                            ? Math.round((profileData.courses_completed || 0) / profileData.courses_enrolled * 100)
                            : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary-500" />
                Enrolled Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-4">
                <p className="text-gray-500 dark:text-gray-400">
                  View all your enrolled courses in the Courses section of your dashboard.
                </p>
                <Button className="mt-4" variant="outline" onClick={() => window.location.href = "/dashboards/student/my-courses"}>
                  Go to My Courses
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary-500" />
                Achievements & Certifications
              </CardTitle>
              <CardDescription>
                Your academic and professional achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* In a real app, you would fetch achievements from the API */}
              {/* For now, showing a placeholder for future implementation */}
              <div className="text-center p-6">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <Award className="mx-auto h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Achievements Coming Soon</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Complete courses and earn certifications to showcase your achievements.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => window.location.href = "/dashboards/student/certificate"}>
                View All Certificates
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary-500" />
                Account Settings
              </CardTitle>
              <CardDescription>
                Manage your account preferences and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notifications</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-base font-medium">Push Notifications</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Receive notifications about course updates and announcements
                    </div>
                  </div>
                  <Switch 
                    checked={notifications} 
                    onCheckedChange={(value) => handleNotificationSettingsChange('push', value)} 
                    aria-label="Toggle push notifications"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-base font-medium">Email Updates</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Receive email updates about courses and platform news
                    </div>
                  </div>
                  <Switch 
                    checked={emailUpdates} 
                    onCheckedChange={(value) => handleNotificationSettingsChange('email', value)} 
                    aria-label="Toggle email updates"
                  />
                </div>
              </div>
              
              <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium">Privacy</h3>
                
                <Button variant="outline" className="w-full sm:w-auto" onClick={handleChangePassword}>
                  Change Password
                </Button>
                
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  For security purposes, please use a strong password that you don't use on other sites.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Social Tab */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-primary-500" />
                Social Profiles
              </CardTitle>
              <CardDescription>
                Connect your social media profiles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileData?.social_profiles && profileData.social_profiles.length > 0 ? (
                // Map through social profiles if available
                profileData.social_profiles.map((profile, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    {/* Render social profile here */}
                  </div>
                ))
              ) : (
                // Show placeholder if no social profiles
                <div className="text-center p-4">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    You haven't connected any social profiles yet.
                  </p>
                  <Button onClick={handleEditProfile}>
                    Add Social Links
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentProfilePage; 