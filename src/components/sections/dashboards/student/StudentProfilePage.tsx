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
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Github,
  Loader,
  Briefcase,
  GraduationCap,
  Trophy,
  Lock,
  ShieldCheck
} from "lucide-react";
import { toast } from "react-toastify";
import LoadingIndicator from "@/components/shared/loaders/LoadingIndicator";
import useGetQuery from "@/hooks/getQuery.hook";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import { motion } from "framer-motion";

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
  const [mfaEnabled, setMfaEnabled] = useState<boolean>(false);
  
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section with Cover Image */}
      <div className="relative h-80 w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${profileData?.cover_image || 'https://images.unsplash.com/photo-1557683304-673a23048d34?ixlib=rb-1.2.1&auto=format&fit=crop&w=1129&q=80'})`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40" />
        </div>
        
        {/* Profile Image and Basic Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
          <div className="container mx-auto flex flex-col md:flex-row md:items-end md:space-x-8 space-y-4 md:space-y-0">
            <div className="relative flex-shrink-0 flex justify-center md:justify-start">
              <img 
                src={profileData?.user_image} 
                alt={profileData?.full_name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <button 
                onClick={handleChangeProfileImage}
                className="absolute bottom-2 right-2 p-2 bg-primary rounded-full text-white hover:bg-primary/90 transition-colors border-2 border-white shadow"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center md:items-start">
              <h1 className="text-3xl font-bold text-center md:text-left">{profileData?.full_name}</h1>
              <p className="text-lg opacity-90 text-center md:text-left">{profileData?.major} Student</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start mt-2 gap-2">
                <Badge variant="secondary" className="text-sm flex items-center px-3 py-1">
                  <School className="w-4 h-4 mr-1" />
                  {profileData?.education}
                </Badge>
                <Badge variant="secondary" className="text-sm flex items-center px-3 py-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  {profileData?.location}
                </Badge>
              </div>
            </div>
            <div className="flex justify-center md:justify-end mt-4 md:mt-0">
              <Button onClick={handleEditProfile} className="bg-white text-gray-900 hover:bg-gray-100 min-w-[140px]">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto mt-32 px-4 pb-12">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-white dark:bg-gray-800 p-1 rounded-lg shadow-sm mb-6">
            <TabsTrigger value="overview" className="px-6">Overview</TabsTrigger>
            <TabsTrigger value="academic" className="px-6">Academic</TabsTrigger>
            <TabsTrigger value="settings" className="px-6">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Bio Card */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">{profileData?.bio}</p>
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{profileData?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{profileData?.phone_number}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Age</p>
                        <p className="font-medium">{calculateAge(profileData?.age || '')} years</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <GraduationCap className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Graduation Year</p>
                        <p className="font-medium">{profileData?.graduation_year}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Academic Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <BookOpen className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Enrolled Courses</p>
                          <p className="text-xl font-semibold">{profileData?.courses_enrolled}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Trophy className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Completed Courses</p>
                          <p className="text-xl font-semibold">{profileData?.courses_completed}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <Award className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Average Grade</p>
                          <p className="text-xl font-semibold">{profileData?.avg_grade}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skills Card */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Skills & Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profileData?.skills?.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Social Links Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Social Profiles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profileData?.social_profiles?.map((profile, index) => (
                      <a
                        key={index}
                        href={profile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        {profile.platform === 'Facebook' && <Facebook className="w-5 h-5 text-blue-600" />}
                        {profile.platform === 'Twitter' && <Twitter className="w-5 h-5 text-blue-400" />}
                        {profile.platform === 'LinkedIn' && <Linkedin className="w-5 h-5 text-blue-700" />}
                        {profile.platform === 'Instagram' && <Instagram className="w-5 h-5 text-pink-600" />}
                        {profile.platform === 'GitHub' && <Github className="w-5 h-5 text-gray-900 dark:text-white" />}
                        <span className="flex-1 font-medium">{profile.platform}</span>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="academic">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Academic History */}
              <Card>
                <CardHeader>
                  <CardTitle>Academic History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-primary/10 rounded-lg mt-1">
                        <School className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{profileData?.education}</h4>
                        <p className="text-sm text-gray-500">{profileData?.major}</p>
                        <p className="text-sm text-gray-500">Class of {profileData?.graduation_year}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Trophy className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium">Dean's List</p>
                        <p className="text-sm text-gray-500">Fall 2023</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Projects Section */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Mock projects data */}
                    <div className="border-b pb-4 mb-4">
                      <h4 className="font-semibold text-lg">AI-Powered Chatbot</h4>
                      <p className="text-sm text-gray-500">Developed a chatbot using Python and TensorFlow that can answer student queries and provide course recommendations.</p>
                      <a href="#" className="text-primary hover:underline text-sm">View Project</a>
                    </div>
                    <div className="border-b pb-4 mb-4">
                      <h4 className="font-semibold text-lg">Student Performance Dashboard</h4>
                      <p className="text-sm text-gray-500">Created an interactive dashboard with React and D3.js to visualize student grades, attendance, and progress over time.</p>
                      <a href="#" className="text-primary hover:underline text-sm">View Project</a>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Course Recommendation System</h4>
                      <p className="text-sm text-gray-500">Built a recommendation engine using collaborative filtering to suggest relevant courses to students based on their interests.</p>
                      <a href="#" className="text-primary hover:underline text-sm">View Project</a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Bell className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Push Notifications</p>
                          <p className="text-sm text-gray-500">Receive push notifications</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications}
                        onCheckedChange={(checked) => handleNotificationSettingsChange('push', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Email Updates</p>
                          <p className="text-sm text-gray-500">Receive email notifications</p>
                        </div>
                      </div>
                      <Switch
                        checked={emailUpdates}
                        onCheckedChange={(checked) => handleNotificationSettingsChange('email', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button
                      onClick={handleChangePassword}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                    {/* Multi-Factor Authentication Option */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mt-2 gap-3">
                      <div className="flex-1">
                        <p className="font-medium">Multi-Factor Authentication</p>
                        <p className="text-sm text-gray-500 mb-3">Add an extra layer of security to your account.</p>
                        <Button
                          variant={mfaEnabled ? "success" : "default"}
                          onClick={() => {
                            setMfaEnabled((prev) => {
                              const next = !prev;
                              toast.success(next ? "Multi-Factor Authentication enabled" : "Multi-Factor Authentication disabled");
                              return next;
                            });
                          }}
                          className={`flex items-center gap-2 rounded-full px-5 py-2 font-semibold shadow-sm transition-all duration-200 mt-1
                            ${mfaEnabled ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-primary-600 hover:bg-primary-700 text-white'}
                          `}
                        >
                          {mfaEnabled ? <ShieldCheck className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                          {mfaEnabled ? "Disable Multi-Factor Authentication" : "Enable Multi-Factor Authentication"}
                        </Button>
                      </div>
                    </div>
                  </div>
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