"use client";

import React, { useState, useEffect } from "react";
import { User } from "lucide-react";

const AdminProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState({
    fullName: "",
    email: "",
    role: "Administrator",
    status: "Active"
  });

  // Get user data from localStorage when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserProfile({
        fullName: localStorage.getItem("fullName") || "Admin User",
        email: localStorage.getItem("email") || "admin@example.com",
        role: "Administrator",
        status: "Active"
      });
    }
  }, []);

  const getInitial = () => {
    return userProfile.fullName.charAt(0) || "A";
  };

  const handleEditProfile = () => {
    // In the future, this could navigate to an edit profile page
    // or open a modal for editing
    alert("Edit profile functionality would open here");
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Admin Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Info Card */}
        <div className="col-span-1 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">
                {getInitial()}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              {userProfile.fullName}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              {userProfile.email}
            </p>
            <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {userProfile.role}
            </span>
          </div>
        </div>
        
        {/* Account Information */}
        <div className="col-span-2 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Account Information</h3>
          
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4 items-center">
              <span className="text-gray-500 dark:text-gray-400">Full Name</span>
              <span className="col-span-2 font-medium text-gray-800 dark:text-white">
                {userProfile.fullName}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 items-center">
              <span className="text-gray-500 dark:text-gray-400">Email</span>
              <span className="col-span-2 font-medium text-gray-800 dark:text-white">
                {userProfile.email}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 items-center">
              <span className="text-gray-500 dark:text-gray-400">Role</span>
              <span className="col-span-2 font-medium text-gray-800 dark:text-white">
                {userProfile.role}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 items-center">
              <span className="text-gray-500 dark:text-gray-400">Account Status</span>
              <span className="col-span-2">
                <span className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {userProfile.status}
                </span>
              </span>
            </div>
          </div>
        </div>
        
        {/* Edit Profile Button */}
        <div className="col-span-1 md:col-span-3 mt-4">
          <button 
            className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm transition-colors duration-300"
            onClick={handleEditProfile}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage; 