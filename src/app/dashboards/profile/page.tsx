"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  User, Mail, Phone, MapPin, Building, Calendar, Award, 
  Briefcase, BookOpen, FileText, Edit, Settings, Key
} from 'lucide-react';

interface UserData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  organization: string;
  joinDate: string;
  qualifications: string;
  experience: string;
  specialization: string;
  bio: string;
  profileImage: string;
}

interface ProfileFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  isLink?: boolean;
}

const ProfilePage = () => {
  const [userRole, setUserRole] = useState<string>('');
  const [userData, setUserData] = useState<UserData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    organization: '',
    joinDate: '',
    qualifications: '',
    experience: '',
    specialization: '',
    bio: '',
    profileImage: '/images/avatar-placeholder.jpg'
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Fetch user data and role from localStorage or API
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
          joinDate: 'January 2023',
          qualifications: storedRole === 'instructor' ? 'Ph.D. Computer Science' : 'Graduate',
          experience: storedRole === 'instructor' ? '5+ years' : '1+ years',
          specialization: storedRole === 'instructor' ? 'Data Science & AI' : 
                          storedRole === 'admin' ? 'System Administration' : 'Learning',
          bio: `${storedRole} profile for ${storedName}. This is a placeholder biography text.`,
          profileImage: '/images/avatar-placeholder.jpg'
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const renderRoleSpecificFields = () => {
    switch(userRole?.toLowerCase()) {
      case 'instructor':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <ProfileField icon={<Award className="w-5 h-5" />} label="Qualifications" value={userData.qualifications} />
              <ProfileField icon={<Briefcase className="w-5 h-5" />} label="Experience" value={userData.experience} />
            </div>
            <ProfileField icon={<BookOpen className="w-5 h-5" />} label="Specialization" value={userData.specialization} />
          </>
        );
      case 'admin':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <ProfileField icon={<Settings className="w-5 h-5" />} label="Admin Role" value="System Administrator" />
            <ProfileField icon={<Key className="w-5 h-5" />} label="Access Level" value="Full Access" />
          </div>
        );
      case 'parent':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <ProfileField icon={<User className="w-5 h-5" />} label="Child's Name" value="Student Name" />
            <ProfileField icon={<BookOpen className="w-5 h-5" />} label="Enrolled Courses" value="Mathematics, Science" />
          </div>
        );
      case 'student':
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <ProfileField icon={<BookOpen className="w-5 h-5" />} label="Enrolled Courses" value="Mathematics, Science" />
            <ProfileField icon={<Award className="w-5 h-5" />} label="Achievements" value="Top Performer" />
          </div>
        );
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
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-gray-200">
          <Image 
            src={userData.profileImage} 
            alt={userData.fullName}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-full"
          />
        </div>
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {userData.fullName}
              </h1>
              <p className="text-md text-gray-600 dark:text-gray-400 capitalize mt-1">
                {userRole || 'User'}
              </p>
            </div>
            <button 
              onClick={() => router.push('/dashboards/edit-profile')}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md flex items-center gap-2 text-sm"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>
          
          <p className="mt-4 text-gray-700 dark:text-gray-300">
            {userData.bio}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Personal Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <ProfileField icon={<Mail className="w-5 h-5" />} label="Email" value={userData.email} />
          <ProfileField icon={<Phone className="w-5 h-5" />} label="Phone" value={userData.phone} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <ProfileField icon={<MapPin className="w-5 h-5" />} label="Address" value={userData.address} />
          <ProfileField icon={<Building className="w-5 h-5" />} label="Organization" value={userData.organization} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ProfileField icon={<Calendar className="w-5 h-5" />} label="Joined" value={userData.joinDate} />
          <ProfileField icon={<FileText className="w-5 h-5" />} label="Documents" value="View Documents" isLink />
        </div>

        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          {userRole === 'instructor' ? 'Professional Information' : 
           userRole === 'admin' ? 'Administrative Information' :
           userRole === 'parent' ? 'Child Information' :
           'Academic Information'}
        </h2>
        
        {renderRoleSpecificFields()}
      </div>
    </div>
  );
};

const ProfileField: React.FC<ProfileFieldProps> = ({ icon, label, value, isLink = false }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="flex items-center justify-center w-10 h-10 bg-primary-50 dark:bg-gray-800 rounded-full text-primary-500 dark:text-primary-400 mt-1">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        {isLink ? (
          <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">{value}</a>
        ) : (
          <p className="text-gray-900 dark:text-white font-medium">{value}</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage; 