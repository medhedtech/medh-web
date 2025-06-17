"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ProfileImg from "@/assets/images/dashbord/profileImg.png";
import { Loader, Mail, Phone, Calendar, UserCheck, Building, Hash, Briefcase, Edit2, ExternalLink } from "lucide-react";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const ProfileField = ({ icon: Icon, label, value, isLink = false }) => (
  <li className="mb-6 transform hover:scale-[1.01] transition-all duration-200">
    <div className="flex items-center gap-4 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex-shrink-0">
        <Icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
      </div>
      <div className="flex-grow">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</p>
        {isLink ? (
          <div className="flex items-center gap-2">
            <a 
              href={value} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-lg font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              {value} <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        ) : (
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {value || "N/A"}
          </p>
        )}
      </div>
    </div>
  </li>
);

const SocialLink = ({ href, icon: Icon, label, color }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${color} text-white hover:opacity-90 transition-opacity`}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </a>
);

const ProfileDetails = ({ onEditClick }) => {
  const [profileData, setProfileData] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          setError("Please log in to view your profile");
          setLoading(false);
          return;
        }

        // Fetch both profile and stats data
        const [profileResponse, statsResponse] = await Promise.all([
          fetch('/api/v1/profile/me', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'x-access-token': token
            }
          }),
          fetch('/api/v1/profile/me/stats', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'x-access-token': token
            }
          })
        ]);

        // Handle profile response
        if (profileResponse.ok) {
          const profileResult = await profileResponse.json();
          if (profileResult.success && profileResult.data?.user) {
            setProfileData(profileResult.data.user);
            console.log('✅ Profile data loaded successfully');
          }
        } else {
          console.error('❌ Profile API error:', profileResponse.status);
        }

        // Handle stats response
        if (statsResponse.ok) {
          const statsResult = await statsResponse.json();
          if (statsResult.success && statsResult.data?.statistics) {
            setStatsData(statsResult.data.statistics);
            console.log('✅ Stats data loaded successfully');
          }
        } else {
          console.error('❌ Stats API error:', statsResponse.status);
        }

      } catch (error) {
        console.error('❌ Error fetching profile data:', error);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-2">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Profile Details
          </h2>
          <button
            onClick={onEditClick}
            className="p-2 text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
            title="Edit Profile"
          >
            <Edit2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="p-6">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-32 h-32 mb-4">
            <div className="absolute inset-0 bg-emerald-600 rounded-full animate-pulse" 
                 style={{ opacity: isImageLoading ? 1 : 0 }} />
            <Image
              src={profileData?.user_image?.url || ProfileImg}
              alt="Profile"
              width={128}
              height={128}
              className="rounded-full object-cover border-4 border-emerald-600 dark:border-emerald-400"
              onLoadingComplete={() => setIsImageLoading(false)}
            />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {profileData?.full_name || "N/A"}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {profileData?.role?.[0] || "N/A"}
          </p>
        </div>

        {/* Profile Fields */}
        <div className="space-y-1">
          <ul className="space-y-4">
            <ProfileField 
              icon={Mail} 
              label="Email Address" 
              value={profileData?.email} 
            />
            <ProfileField 
              icon={Phone} 
              label="Phone Number" 
              value={profileData?.phone_numbers?.[0]?.number || "N/A"} 
            />
            <ProfileField 
              icon={Calendar} 
              label="Date of Birth" 
              value={profileData?.meta?.date_of_birth ? formatDate(profileData.meta.date_of_birth) : "N/A"} 
            />
            <ProfileField 
              icon={UserCheck} 
              label="Date of Joining" 
              value={formatDate(profileData?.createdAt)} 
            />
            <ProfileField 
              icon={Hash} 
              label="Registration ID" 
              value={profileData?.registration_id || "9019"} 
            />
            <ProfileField 
              icon={Briefcase} 
              label="Domain" 
              value={profileData?.role?.[0]} 
            />
          </ul>

          {/* Social Media Links */}
          {(profileData?.facebook_link || profileData?.linkedin_link || profileData?.instagram_link) && (
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Social Media
              </h4>
              <div className="flex flex-wrap gap-3">
                {profileData?.facebook_link && (
                  <a
                    href={profileData.facebook_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#3C5A9A] text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Facebook</span>
                  </a>
                )}
                {profileData?.linkedin_link && (
                  <a
                    href={profileData.linkedin_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                )}
                {profileData?.instagram_link && (
                  <a
                    href={profileData.instagram_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                    </svg>
                    <span>Instagram</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
