"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  User, Mail, Phone, MapPin, Building, Save, 
  X, Upload, ArrowLeft, AlertCircle
} from 'lucide-react';

interface UserData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  organization: string;
  bio: string;
  profileImage: string;
  // Role-specific fields
  qualifications?: string;
  experience?: string;
  specialization?: string;
}

const EditProfilePage = () => {
  const [userRole, setUserRole] = useState<string>('');
  const [userData, setUserData] = useState<UserData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    organization: '',
    bio: '',
    profileImage: '/images/avatar-placeholder.jpg',
    qualifications: '',
    experience: '',
    specialization: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Fetch user data and role
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        // Get role from localStorage
        const storedRole = localStorage.getItem('role');
        setUserRole(storedRole || '');
        
        // In a real app, you would fetch user data from an API
        // For now, we'll simulate with localStorage data
        const storedName = localStorage.getItem('fullName') || localStorage.getItem('full_name') || 'User';
        const storedEmail = localStorage.getItem('email') || 'user@example.com';
        
        // Set mock data based on role for demonstration
        setUserData({
          fullName: storedName,
          email: storedEmail,
          phone: '+1 123-456-7890',
          address: 'New Delhi, India',
          organization: storedRole === 'instructor' ? 'Medh Education' : 
                        storedRole === 'admin' ? 'Medh Admin Team' : 
                        storedRole === 'parent' ? 'Parent' : 'Student',
          bio: `${storedRole} profile for ${storedName}. This is a placeholder biography text.`,
          profileImage: '/images/avatar-placeholder.jpg',
          qualifications: storedRole === 'instructor' ? 'Ph.D. Computer Science' : 'Graduate',
          experience: storedRole === 'instructor' ? '5+ years' : '1+ years',
          specialization: storedRole === 'instructor' ? 'Data Science & AI' : 
                          storedRole === 'admin' ? 'System Administration' : 'Learning',
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error loading profile data');
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          setUserData(prevData => ({
            ...prevData,
            profileImage: event.target?.result as string
          }));
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    
    try {
      // In a real app, you would send this data to your API
      // For now, just simulate a delay and success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage for demo purposes
      localStorage.setItem('fullName', userData.fullName);
      
      // After successful save, navigate back to profile page
      router.push('/dashboards/profile');
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile changes');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 md:p-8">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => router.push('/dashboards/profile')}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => router.push('/dashboards/profile')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Picture */}
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
          <div className="relative">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200">
              <Image 
                src={userData.profileImage} 
                alt={userData.fullName}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-full"
              />
            </div>
            <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-primary-500 hover:bg-primary-600 text-white p-2 rounded-full cursor-pointer">
              <Upload className="w-4 h-4" />
              <input 
                id="profile-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload}
              />
            </label>
          </div>
          
          <div className="flex-1 space-y-1">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profile Picture</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Upload a new photo to update your profile picture
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Recommended: Square image, at least 400x400 pixels
            </p>
          </div>
        </div>

        {/* Personal Information */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Personal Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={userData.fullName}
                  onChange={handleInputChange}
                  className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={userData.phone}
                  onChange={handleInputChange}
                  className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={userData.address}
                  onChange={handleInputChange}
                  className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="organization" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Organization/School
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={userData.organization}
                  onChange={handleInputChange}
                  className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Bio / About Me
              </label>
              <textarea
                id="bio"
                name="bio"
                value={userData.bio}
                onChange={handleInputChange}
                rows={4}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Role Specific Fields */}
        {userRole === 'instructor' && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Professional Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Qualifications
                </label>
                <input
                  type="text"
                  id="qualifications"
                  name="qualifications"
                  value={userData.qualifications}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Experience
                </label>
                <input
                  type="text"
                  id="experience"
                  name="experience"
                  value={userData.experience}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Specialization
                </label>
                <input
                  type="text"
                  id="specialization"
                  name="specialization"
                  value={userData.specialization}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default EditProfilePage; 