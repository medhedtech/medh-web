"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Camera, 
  Upload, 
  Save, 
  ArrowLeft,
  AlertCircle,
  Loader2,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Github,
  Globe,
  GraduationCap,
  X,
  Link as LinkIcon,
  Clock
} from "lucide-react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import usePostQuery from "@/hooks/postQuery.hook";
import ProfileImgPlaceholder from "@/assets/images/dashbord/profileImg.png";
import ProfileBanner from "@/assets/images/dashbord/profileBanner.png";

// TypeScript Interfaces
interface ISocialProfile {
  platform: 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'youtube' | 'github' | 'portfolio';
  url: string;
  username?: string;
}

interface IFormData {
  full_name: string;
  email: string;
  phone_number: string;
  bio?: string;
  
  // Personal Details
  date_of_birth?: Date | null;
  gender?: string;
  nationality?: string;
  timezone?: string;
  
  // Social Profiles
  facebook_link?: string;
  instagram_link?: string;
  linkedin_link?: string;
  twitter_link?: string;
  youtube_link?: string;
  github_link?: string;
  portfolio_link?: string;
  
  // Education
  education_level?: string;
  institution_name?: string;
  field_of_study?: string;
  graduation_year?: number;
  
  user_image?: string;
}

interface IEditProfileProps {
  onBackClick: () => void;
}

// Enhanced Validation Schema
const socialUrlValidation = (platform: string) => 
  yup.string().test(`${platform}-validation`, `Enter a valid ${platform} URL`, function(value) {
    if (!value) return true; // Optional field
    const urlPattern = /^https?:\/\/.+/;
    return urlPattern.test(value) || this.createError({ message: `Please enter a valid ${platform} URL` });
  });

const validationSchema = yup.object().shape({
  full_name: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  phone_number: yup.string().required("Phone number is required"),
  bio: yup.string().optional().max(500, "Bio must be less than 500 characters"),
  
  // Personal Details
  date_of_birth: yup.date().nullable().optional(),
  gender: yup.string().optional(),
  nationality: yup.string().optional(),
  timezone: yup.string().optional(),
  
  // Social Profiles
  facebook_link: socialUrlValidation('Facebook'),
  instagram_link: socialUrlValidation('Instagram'),
  linkedin_link: socialUrlValidation('LinkedIn'),
  twitter_link: socialUrlValidation('Twitter'),
  youtube_link: socialUrlValidation('YouTube'),
  github_link: socialUrlValidation('GitHub'),
  portfolio_link: socialUrlValidation('Portfolio'),
  
  // Education
  education_level: yup.string().optional(),
  institution_name: yup.string().optional(),
  field_of_study: yup.string().optional(),
  graduation_year: yup.number().min(1950).max(new Date().getFullYear() + 10).optional(),
  
  // Optional fields
  user_image: yup.string().optional(),
});

// Education levels
const educationLevels = [
  "High School",
  "Associate's Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate",
  "Professional Certification",
  "Other"
];

const EditProfile: React.FC<IEditProfileProps> = ({ onBackClick }) => {
  const [studentId, setStudentId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'personal' | 'social' | 'education'>('basic');
  const [lastLoginTime, setLastLoginTime] = useState<string>("");

  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();

  // Helper function to format last login time
  const formatLastLogin = (timestamp: string): string => {
    if (!timestamp) return "Never";
    
    const now = new Date();
    const lastLogin = new Date(timestamp);
    const diffInMs = now.getTime() - lastLogin.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      if (diffInMinutes > 0) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
      } else {
        return "Just now";
      }
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
    control
  } = useForm<IFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {}
  });

  // Initialize component
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      setStudentId(storedUserId);
      
      // Get last login time from localStorage
      const storedLastLogin = localStorage.getItem("lastLoginTime");
      if (storedLastLogin) {
        setLastLoginTime(storedLastLogin);
      }
    }
  }, []);

  // Fetch profile data
  useEffect(() => {
    if (studentId) {
      getQuery({
        url: `${apiUrls?.user?.getDetailsbyId}/${studentId}`,
        onSuccess: (data) => {
          const profile = data?.data;
          setProfileData(profile);

          // Transform profile data to form data
          const formData: Partial<IFormData> = {
            full_name: profile.full_name || '',
            email: profile.email || '',
            phone_number: profile.phone_number || '',
            bio: profile.meta?.bio || '',
            
            // Personal Details
            date_of_birth: profile.date_of_birth ? moment(profile.date_of_birth, "YYYY-MM-DD").toDate() : null,
            gender: profile.gender || '',
            nationality: profile.nationality || '',
            timezone: profile.timezone || '',
            
            // Social profiles
            facebook_link: profile.facebook_link || '',
            instagram_link: profile.instagram_link || '',
            linkedin_link: profile.linkedin_link || '',
            twitter_link: profile.twitter_link || '',
            youtube_link: profile.youtube_link || '',
            github_link: profile.github_link || '',
            portfolio_link: profile.portfolio_link || '',
            
            // Education
            education_level: profile.meta?.education_level || '',
            institution_name: profile.meta?.institution_name || '',
            field_of_study: profile.meta?.field_of_study || '',
            graduation_year: profile.meta?.graduation_year || undefined,
          };

          reset(formData);
        },
        onFail: (error: any) => {
          console.error("Error fetching profile:", error);
        }
      });
    }
  }, [studentId, getQuery, reset]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Handle image upload logic here
    console.log("Image upload:", file);
  };

  const onSubmit = async (data: IFormData) => {
    setLoading(true);
    try {
      // Prepare the data for submission
      const submitData = {
        ...data,
        date_of_birth: data.date_of_birth ? moment(data.date_of_birth).format("YYYY-MM-DD") : null,
        meta: {
          bio: data.bio,
          education_level: data.education_level,
          institution_name: data.institution_name,
          field_of_study: data.field_of_study,
          graduation_year: data.graduation_year,
        }
      };

      await postQuery({
        url: `${apiUrls?.user?.update}/${studentId}`,
        postData: submitData,
        onSuccess: (response) => {
          console.log("Profile updated successfully:", response);
          // Show success message or redirect
        },
        onFail: (error: any) => {
          console.error("Error updating profile:", error);
          // Show error message
        }
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Profile Information
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Completion 32%</p>
          </div>
          
          {/* Close Button */}
          <button
            onClick={onBackClick}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close edit profile"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {[
          { key: 'basic', label: 'Basic Information', icon: User },
          { key: 'personal', label: 'Personal Details', icon: Calendar },
          { key: 'social', label: 'Social Media Links', icon: LinkIcon },
          { key: 'education', label: 'Education', icon: GraduationCap }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === key
                ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          {/* Basic Information Tab */}
          {activeTab === 'basic' && (
            <motion.div
              key="basic"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <input
                  {...register("full_name")}
                  type="text"
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter your full name"
                  aria-label="Full name"
                />
                {errors.full_name && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.full_name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  {...register("email")}
                  type="email"
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter your email"
                  aria-label="Email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Number
                </label>
                <input
                  {...register("phone_number")}
                  type="tel"
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter your phone number"
                  aria-label="Phone number"
                />
                {errors.phone_number && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.phone_number.message}
                  </p>
                )}
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bio
                </label>
                <textarea
                  {...register("bio")}
                  rows={4}
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                  placeholder="Tell us about yourself..."
                  aria-label="Bio"
                />
                {errors.bio && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.bio.message}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Personal Details Tab */}
          {activeTab === 'personal' && (
            <motion.div
              key="personal"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Date of Birth */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date of Birth
                </label>
                <Controller
                  name="date_of_birth"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      dateFormat="dd-MM-yyyy"
                      placeholderText="dd-mm-yyyy"
                      className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      aria-label="Date of birth"
                    />
                  )}
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Gender
                </label>
                <select
                  {...register("gender")}
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  aria-label="Gender"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              {/* Nationality */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nationality
                </label>
                <input
                  {...register("nationality")}
                  type="text"
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="e.g., Indian, American"
                  aria-label="Nationality"
                />
              </div>

              {/* Timezone */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Timezone
                </label>
                <input
                  {...register("timezone")}
                  type="text"
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="e.g., UTC"
                  aria-label="Timezone"
                />
              </div>
            </motion.div>
          )}

          {/* Social Media Links Tab */}
          {activeTab === 'social' && (
            <motion.div
              key="social"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Facebook */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Facebook
                </label>
                <input
                  {...register("facebook_link")}
                  type="url"
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="https://facebook.com/yourprofile"
                  aria-label="Facebook profile URL"
                />
                {errors.facebook_link && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.facebook_link.message}
                  </p>
                )}
              </div>

              {/* Instagram */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Instagram
                </label>
                <input
                  {...register("instagram_link")}
                  type="url"
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="https://instagram.com/yourprofile"
                  aria-label="Instagram profile URL"
                />
                {errors.instagram_link && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.instagram_link.message}
                  </p>
                )}
              </div>

              {/* LinkedIn */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  LinkedIn
                </label>
                <input
                  {...register("linkedin_link")}
                  type="url"
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="https://linkedin.com/in/yourprofile"
                  aria-label="LinkedIn profile URL"
                />
                {errors.linkedin_link && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.linkedin_link.message}
                  </p>
                )}
              </div>

              {/* Twitter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Twitter
                </label>
                <input
                  {...register("twitter_link")}
                  type="url"
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="https://twitter.com/yourprofile"
                  aria-label="Twitter profile URL"
                />
                {errors.twitter_link && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.twitter_link.message}
                  </p>
                )}
              </div>

              {/* YouTube */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  YouTube
                </label>
                <input
                  {...register("youtube_link")}
                  type="url"
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="https://youtube.com/yourchannel"
                  aria-label="YouTube channel URL"
                />
                {errors.youtube_link && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.youtube_link.message}
                  </p>
                )}
              </div>

              {/* GitHub */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  GitHub
                </label>
                <input
                  {...register("github_link")}
                  type="url"
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="https://github.com/yourprofile"
                  aria-label="GitHub profile URL"
                />
                {errors.github_link && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.github_link.message}
                  </p>
                )}
              </div>

              {/* Portfolio */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Portfolio
                </label>
                <input
                  {...register("portfolio_link")}
                  type="url"
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="https://yourportfolio.com"
                  aria-label="Portfolio website URL"
                />
                {errors.portfolio_link && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.portfolio_link.message}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Education Tab */}
          {activeTab === 'education' && (
            <motion.div
              key="education"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Education Level */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Education Level
                  </label>
                  <select
                    {...register("education_level")}
                    className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    aria-label="Education level"
                  >
                    <option value="">Select your education level</option>
                    {educationLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Institution Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Institution Name
                  </label>
                  <input
                    {...register("institution_name")}
                    type="text"
                    className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Enter your school/university name"
                    aria-label="Institution name"
                  />
                </div>

                {/* Field of Study */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Field of Study
                  </label>
                  <input
                    {...register("field_of_study")}
                    type="text"
                    className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Enter your major/subject area"
                    aria-label="Field of study"
                  />
                </div>

                {/* Graduation Year */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Graduation Year
                  </label>
                  <input
                    {...register("graduation_year")}
                    type="number"
                    min="1950"
                    max={new Date().getFullYear() + 10}
                    className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Enter graduation year"
                    aria-label="Graduation year"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4 pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            disabled={loading || isSubmitting}
            className="px-8 py-3 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
          >
            {loading || isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile; 