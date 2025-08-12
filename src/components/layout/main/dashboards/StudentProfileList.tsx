"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  User,
  Plus,
  Lock,
  Heart,
  LogOut,
  MessageCircle,
  ChevronRight
} from "lucide-react";

interface StudentProfileListProps {
  userName?: string;
}

const StudentProfileList: React.FC<StudentProfileListProps> = ({ userName }) => {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState("My Profile (Edit/Update)");
  
  // Get user name from localStorage if not provided
  const storedUserName = localStorage.getItem("userName") || "";
  const storedFullName = localStorage.getItem("fullName") || "";
  const storedName = storedUserName || storedFullName;
  const displayName = userName || storedName || "Student";

  const profileItems = [
    {
      name: "My Profile (Edit/Update)",
      icon: <User className="w-4 h-4" />,
      path: "/dashboards/student/profile/edit",
      isActive: true
    },
    {
      name: "Add Social Profiles",
      icon: <Plus className="w-4 h-4" />,
      path: "/dashboards/student/social-profiles"
    },
    {
      name: "Change Password",
      icon: <Lock className="w-4 h-4" />,
      path: "/dashboards/student/profile#security"
    },
    {
      name: "My Wishlist",
      icon: <Heart className="w-4 h-4" />,
      path: "/dashboards/student/wishlist"
    },
    {
      name: "Logout",
      icon: <LogOut className="w-4 h-4" />,
      path: "/logout",
      isAction: true
    },
    {
      name: "Live Chat",
      icon: <MessageCircle className="w-4 h-4" />,
      path: "/dashboards/student/live-chat"
    }
  ];

  const handleItemClick = (item: any) => {
    if (item.isAction && item.name === "Logout") {
      // Handle logout logic
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");
      localStorage.removeItem("fullName");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("email");
      router.push("/login");
      return;
    }
    
    if (item.path) {
      router.push(item.path);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Profile Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Profile Menu List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Account Settings
            </h2>
            
            <div className="space-y-0">
              {profileItems.map((item, index) => (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-4 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                    item.isActive 
                      ? 'bg-yellow-100 dark:bg-yellow-900/20' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                  onClick={() => handleItemClick(item)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`${item.isActive ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400'}`}>
                      {item.icon}
                    </div>
                    <span className={`font-medium ${
                      item.isActive 
                        ? 'text-yellow-800 dark:text-yellow-200' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      &gt; {item.name}
                    </span>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${
                    item.isActive 
                      ? 'text-yellow-600 dark:text-yellow-400' 
                      : 'text-gray-400 dark:text-gray-500'
                  }`} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Name</p>
              <p className="text-gray-900 dark:text-white">{displayName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Role</p>
              <p className="text-gray-900 dark:text-white capitalize">Student</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Account Status</p>
              <p className="text-green-600 dark:text-green-400 font-medium">Active</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Member Since</p>
              <p className="text-gray-900 dark:text-white">2024</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Profile Completion</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">85%</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Social Profiles</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">2</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Plus className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Wishlist Items</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">7</p>
              </div>
              <div className="p-3 bg-pink-100 dark:bg-pink-900/20 rounded-lg">
                <Heart className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileList;

