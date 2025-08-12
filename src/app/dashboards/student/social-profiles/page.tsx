"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, ExternalLink, Save, Globe, Linkedin, Twitter, Facebook, Instagram, Youtube, Github, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

interface SocialProfile {
  id: string;
  platform: string;
  url: string;
  isPublic: boolean;
}

const SocialProfilesPage = () => {
  const router = useRouter();
  const [profiles, setProfiles] = useState<SocialProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProfile, setNewProfile] = useState({
    platform: "",
    url: "",
    isPublic: true
  });

  const platformOptions = [
    { value: "linkedin", label: "LinkedIn", icon: Linkedin, color: "text-blue-600" },
    { value: "twitter", label: "Twitter", icon: Twitter, color: "text-blue-400" },
    { value: "facebook", label: "Facebook", icon: Facebook, color: "text-blue-600" },
    { value: "instagram", label: "Instagram", icon: Instagram, color: "text-pink-600" },
    { value: "youtube", label: "YouTube", icon: Youtube, color: "text-red-600" },
    { value: "github", label: "GitHub", icon: Github, color: "text-gray-800 dark:text-gray-200" },
    { value: "portfolio", label: "Portfolio", icon: Globe, color: "text-green-600" },
    { value: "other", label: "Other", icon: MessageCircle, color: "text-gray-600" }
  ];

  useEffect(() => {
    loadSocialProfiles();
  }, []);

  const loadSocialProfiles = async () => {
    setLoading(true);
    try {
      // Load from localStorage for now, can be replaced with API call
      const stored = localStorage.getItem("socialProfiles");
      if (stored) {
        setProfiles(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading social profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProfile = () => {
    if (!newProfile.platform || !newProfile.url) {
      return;
    }

    const profile: SocialProfile = {
      id: Date.now().toString(),
      platform: newProfile.platform,
      url: newProfile.url,
      isPublic: newProfile.isPublic
    };

    const updatedProfiles = [...profiles, profile];
    setProfiles(updatedProfiles);
    localStorage.setItem("socialProfiles", JSON.stringify(updatedProfiles));
    
    setNewProfile({ platform: "", url: "", isPublic: true });
    setShowAddForm(false);
  };

  const handleDeleteProfile = (id: string) => {
    const updatedProfiles = profiles.filter(profile => profile.id !== id);
    setProfiles(updatedProfiles);
    localStorage.setItem("socialProfiles", JSON.stringify(updatedProfiles));
  };

  const handleToggleVisibility = (id: string) => {
    const updatedProfiles = profiles.map(profile => 
      profile.id === id ? { ...profile, isPublic: !profile.isPublic } : profile
    );
    setProfiles(updatedProfiles);
    localStorage.setItem("socialProfiles", JSON.stringify(updatedProfiles));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      // Here you would typically save to your backend API
      // For now, we're just using localStorage
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Show success message
      alert("Social profiles saved successfully!");
    } catch (error) {
      console.error("Error saving profiles:", error);
      alert("Failed to save profiles. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.push('/dashboards/student/profile');
  };

  const getPlatformIcon = (platform: string) => {
    const option = platformOptions.find(opt => opt.value === platform);
    return option ? option.icon : Globe;
  };

  const getPlatformColor = (platform: string) => {
    const option = platformOptions.find(opt => opt.value === platform);
    return option ? option.color : "text-gray-600";
  };

  const getPlatformLabel = (platform: string) => {
    const option = platformOptions.find(opt => opt.value === platform);
    return option ? option.label : "Other";
  };

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Social Profiles
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your social media links and professional profiles
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <motion.button
            onClick={() => setShowAddForm(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Social Profile
          </motion.button>
          
          <motion.button
            onClick={handleSaveAll}
            disabled={saving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium rounded-lg transition-colors"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save All Changes
              </>
            )}
          </motion.button>
        </div>

        {/* Add Profile Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add New Social Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Platform
                </label>
                <select
                  value={newProfile.platform}
                  onChange={(e) => setNewProfile(prev => ({ ...prev, platform: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select platform</option>
                  {platformOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Profile URL
                </label>
                <input
                  type="url"
                  value={newProfile.url}
                  onChange={(e) => setNewProfile(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-end">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newProfile.isPublic}
                    onChange={(e) => setNewProfile(prev => ({ ...prev, isPublic: e.target.checked }))}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Public profile
                  </span>
                </label>
              </div>
            </div>
            
            <div className="flex gap-3 mt-4">
              <motion.button
                onClick={handleAddProfile}
                disabled={!newProfile.platform || !newProfile.url || !validateUrl(newProfile.url)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
              >
                Add Profile
              </motion.button>
              <motion.button
                onClick={() => {
                  setShowAddForm(false);
                  setNewProfile({ platform: "", url: "", isPublic: true });
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Profiles List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Your Social Profiles ({profiles.length})
            </h3>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading profiles...</p>
            </div>
          ) : profiles.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No social profiles yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Add your social media profiles to showcase your online presence
              </p>
              <motion.button
                onClick={() => setShowAddForm(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Add Your First Profile
              </motion.button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {profiles.map((profile) => {
                const IconComponent = getPlatformIcon(profile.platform);
                const colorClass = getPlatformColor(profile.platform);
                
                return (
                  <motion.div
                    key={profile.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${colorClass}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {getPlatformLabel(profile.platform)}
                          </h4>
                          <a
                            href={profile.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                          >
                            {profile.url}
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={profile.isPublic}
                            onChange={() => handleToggleVisibility(profile.id)}
                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Public
                          </span>
                        </label>
                        
                        <motion.button
                          onClick={() => handleDeleteProfile(profile.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete profile"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6"
        >
          <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-3">
            Tips for Social Profiles:
          </h3>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
            <li>• Keep your profiles up-to-date with current information</li>
            <li>• Use professional profile pictures across platforms</li>
            <li>• Include relevant keywords in your bio/description</li>
            <li>• Regularly engage with your network</li>
            <li>• Consider privacy settings for each platform</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default SocialProfilesPage;

