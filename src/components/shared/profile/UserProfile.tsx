"use client";

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  GraduationCap,
  Building,
  Award,
  Clock,
  Edit,
  Save,
  X,
  Camera
} from 'lucide-react';
import Image from 'next/image';

interface IUserProfile {
  _id: string;
  full_name: string;
  email: string;
  role: string[];
  phone_numbers?: Array<{
    country: string;
    number: string;
  }>;
  profile_image?: string;
  meta?: {
    gender?: string;
    age?: string;
    age_group?: string;
    category?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
    qualification?: string;
    specialization?: string;
    experience?: string;
    organization?: string;
    designation?: string;
    bio?: string;
    skills?: string[];
    certifications?: Array<{
      name: string;
      issuer: string;
      date: string;
      url?: string;
    }>;
    social_links?: {
      linkedin?: string;
      twitter?: string;
      github?: string;
      website?: string;
    };
    [key: string]: any;
  };
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UserProfileProps {
  userData: IUserProfile;
  onUpdate?: (data: Partial<IUserProfile>) => Promise<void>;
  isEditable?: boolean;
  className?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({
  userData,
  onUpdate,
  isEditable = false,
  className = ''
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Partial<IUserProfile>>(userData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setEditedData(userData);
  }, [userData]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedData(userData);
    setIsEditing(false);
    setError(null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      if (onUpdate) {
        await onUpdate(editedData);
      }
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMetaChange = (field: string, value: any) => {
    setEditedData(prev => ({
      ...prev,
      meta: {
        ...prev.meta,
        [field]: value
      }
    }));
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleDisplay = (roles: string[]) => {
    return roles.map(role => 
      role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
    ).join(', ');
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md ${className}`}>
      {/* Profile Header */}
      <div className="relative h-32 bg-gradient-to-r from-primary-600 to-primary-400 rounded-t-lg">
        <div className="absolute -bottom-16 left-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-100 dark:bg-gray-700">
              {userData.profile_image ? (
                <Image
                  src={userData.profile_image}
                  alt={userData.full_name}
                  layout="fill"
                  objectFit="cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User size={48} className="text-gray-400" />
                </div>
              )}
            </div>
            {isEditable && isEditing && (
              <button 
                className="absolute bottom-0 right-0 p-2 bg-primary-500 rounded-full text-white hover:bg-primary-600 transition-colors"
                onClick={() => {/* Implement image upload */}}
              >
                <Camera size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="pt-20 px-8 pb-8">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.full_name}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-1"
                />
              ) : (
                userData.full_name
              )}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {getRoleDisplay(userData.role)}
            </p>
          </div>
          {isEditable && (
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center px-3 py-1 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors disabled:opacity-50"
                  >
                    <Save size={16} className="mr-1" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                  >
                    <X size={16} className="mr-1" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEdit}
                  className="flex items-center px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                >
                  <Edit size={16} className="mr-1" />
                  Edit Profile
                </button>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded">
            {error}
          </div>
        )}

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-gray-600 dark:text-gray-400">{userData.email}</span>
            </div>
            {userData.phone_numbers && userData.phone_numbers[0] && (
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-400">
                  +{userData.phone_numbers[0].country} {userData.phone_numbers[0].number}
                </span>
              </div>
            )}
            {userData.meta?.address && (
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-400">
                  {userData.meta.address}
                  {userData.meta.city && `, ${userData.meta.city}`}
                  {userData.meta.state && `, ${userData.meta.state}`}
                  {userData.meta.country && `, ${userData.meta.country}`}
                </span>
              </div>
            )}
          </div>
          <div className="space-y-4">
            {userData.meta?.organization && (
              <div className="flex items-center">
                <Building className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-400">
                  {userData.meta.organization}
                  {userData.meta.designation && ` - ${userData.meta.designation}`}
                </span>
              </div>
            )}
            {userData.meta?.qualification && (
              <div className="flex items-center">
                <GraduationCap className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-400">
                  {userData.meta.qualification}
                  {userData.meta.specialization && ` in ${userData.meta.specialization}`}
                </span>
              </div>
            )}
            {userData.meta?.experience && (
              <div className="flex items-center">
                <Briefcase className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-400">
                  {userData.meta.experience} years of experience
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bio Section */}
        {(userData.meta?.bio || isEditing) && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About</h2>
            {isEditing ? (
              <textarea
                value={editedData.meta?.bio || ''}
                onChange={(e) => handleMetaChange('bio', e.target.value)}
                rows={4}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded p-3"
              />
            ) : (
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {userData.meta?.bio}
              </p>
            )}
          </div>
        )}

        {/* Skills Section */}
        {(userData.meta?.skills?.length || isEditing) && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.meta?.skills?.join(', ') || ''}
                  onChange={(e) => handleMetaChange('skills', e.target.value.split(',').map(s => s.trim()))}
                  placeholder="Enter skills separated by commas"
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-1"
                />
              ) : (
                userData.meta?.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                  >
                    {skill}
                  </span>
                ))
              )}
            </div>
          </div>
        )}

        {/* Certifications Section */}
        {(userData.meta?.certifications?.length || isEditing) && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Certifications</h2>
            <div className="space-y-4">
              {userData.meta?.certifications?.map((cert, index) => (
                <div
                  key={index}
                  className="flex items-start p-4 bg-gray-50 dark:bg-gray-700 rounded"
                >
                  <Award className="w-5 h-5 text-primary-500 mr-3 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {cert.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {cert.issuer}
                    </p>
                    <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDate(cert.date)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile; 