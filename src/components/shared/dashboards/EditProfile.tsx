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
  BookOpen,
  Award,
  Plus,
  X,
  Trash2,
  Link as LinkIcon
} from "lucide-react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { toast } from "react-toastify";
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

interface ICertification {
  name: string;
  issuer: string;
  year: number;
  url?: string;
}

interface IEducation {
  education_level: string;
  institution_name: string;
  field_of_study: string;
  graduation_year: number;
  skills: string[];
  certifications: ICertification[];
}

interface IFormData {
  full_name: string;
  email: string;
  phone_number: string;
  age: Date | null;
  bio?: string;
  location?: string;
  
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
  skills?: string[];
  certifications?: ICertification[];
  
  user_image?: string;
}

interface IEditProfileProps {
  onBackClick: () => void;
}

// Enhanced Validation Schema
const socialUrlValidation = (platform: string) => 
  yup.string().test(`${platform}-validation`, `Enter a valid ${platform} URL`, function(value) {
    if (!value) return true; // Optional field
    
    const patterns: Record<string, RegExp> = {
      facebook: /^https?:\/\/(www\.)?facebook\.com\/.+/,
      instagram: /^https?:\/\/(www\.)?instagram\.com\/.+/,
      linkedin: /^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/.+/,
      twitter: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/.+/,
      youtube: /^https?:\/\/(www\.)?youtube\.com\/.+/,
      github: /^https?:\/\/(www\.)?github\.com\/.+/,
      portfolio: /^https?:\/\/.+/
    };
    
    return patterns[platform]?.test(value) ?? true;
  });

const validationSchema = yup.object({
  full_name: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email format"),
  phone_number: yup
    .string()
    .required("Mobile number is required")
    .matches(/^[6-9]\d{9}$/, "Mobile number must be a valid 10-digit number"),
  age: yup
    .date()
    .nullable()
    .typeError("Invalid date")
    .max(new Date(), "Date of Birth cannot be in the future"),
  bio: yup.string().max(500, "Bio cannot exceed 500 characters"),
  location: yup.string().max(100, "Location cannot exceed 100 characters"),
  
  // Social Profile Validations
  facebook_link: socialUrlValidation('facebook'),
  instagram_link: socialUrlValidation('instagram'),
  linkedin_link: socialUrlValidation('linkedin'),
  twitter_link: socialUrlValidation('twitter'),
  youtube_link: socialUrlValidation('youtube'),
  github_link: socialUrlValidation('github'),
  portfolio_link: socialUrlValidation('portfolio'),
  
  // Education Validations
  education_level: yup.string(),
  institution_name: yup.string().max(100, "Institution name cannot exceed 100 characters"),
  field_of_study: yup.string().max(100, "Field of study cannot exceed 100 characters"),
  graduation_year: yup
    .number()
    .min(1950, "Graduation year must be after 1950")
    .max(new Date().getFullYear() + 10, "Graduation year cannot be too far in the future"),
  skills: yup.array().of(yup.string()),
  certifications: yup.array().of(
    yup.object({
      name: yup.string().required("Certification name is required"),
      issuer: yup.string().required("Issuer is required"),
      year: yup
        .number()
        .required("Year is required")
        .min(1950, "Year must be after 1950")
        .max(new Date().getFullYear(), "Year cannot be in the future"),
      url: yup.string().url("Invalid URL format")
    })
  )
});

// Education Level Options
const educationLevels = [
  "High School",
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctoral Degree",
  "Professional Certification",
  "Diploma",
  "Other"
];

// Social Platform Configuration
const socialPlatforms = [
  {
    key: 'facebook_link',
    name: 'Facebook',
    icon: Facebook,
    placeholder: 'https://facebook.com/yourprofile',
    color: 'text-blue-600'
  },
  {
    key: 'instagram_link',
    name: 'Instagram',
    icon: Instagram,
    placeholder: 'https://instagram.com/yourprofile',
    color: 'text-pink-600'
  },
  {
    key: 'linkedin_link',
    name: 'LinkedIn',
    icon: Linkedin,
    placeholder: 'https://linkedin.com/in/yourprofile',
    color: 'text-blue-700'
  },
  {
    key: 'twitter_link',
    name: 'Twitter/X',
    icon: Twitter,
    placeholder: 'https://twitter.com/yourprofile or https://x.com/yourprofile',
    color: 'text-sky-500'
  },
  {
    key: 'youtube_link',
    name: 'YouTube',
    icon: Youtube,
    placeholder: 'https://youtube.com/yourchannel',
    color: 'text-red-600'
  },
  {
    key: 'github_link',
    name: 'GitHub',
    icon: Github,
    placeholder: 'https://github.com/yourusername',
    color: 'text-gray-800'
  },
  {
    key: 'portfolio_link',
    name: 'Portfolio',
    icon: Globe,
    placeholder: 'https://yourportfolio.com',
    color: 'text-green-600'
  }
];

const EditProfile: React.FC<IEditProfileProps> = ({ onBackClick }) => {
  const [studentId, setStudentId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'social' | 'education'>('basic');
  const [newSkill, setNewSkill] = useState<string>('');

  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();

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
    defaultValues: {
      skills: [],
      certifications: []
    }
  });

  const { fields: certificationFields, append: appendCertification, remove: removeCertification } = useFieldArray({
    control,
    name: "certifications"
  });

  const watchedSkills = watch("skills") || [];

  // Initialize component
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      setStudentId(storedUserId);
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
            age: profile.age ? moment(profile.age, "YYYY-MM-DD").toDate() : null,
            bio: profile.meta?.bio || '',
            location: profile.meta?.location || '',
            
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
            skills: profile.meta?.skills || [],
            certifications: profile.meta?.certifications || [],
            
            user_image: profile.user_image || ''
          };

          reset(formData);
        },
        onFail: (error) => {
          console.error("Failed to fetch user details:", error);
          showToast.error("Failed to load profile data");
        },
      });
    }
  }, [studentId, reset]);

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const base64 = reader.result;
          const postData = { base64String: base64, fileType: "image" };

          await postQuery({
            url: apiUrls?.upload?.uploadImage,
            postData,
            onSuccess: (data) => {
              setProfileImage(data?.data);
              setValue("user_image", data?.data);
              showToast.success("Image uploaded successfully!");
            },
            onError: (error) => {
              showToast.error("Image upload failed. Please try again.");
              console.error("Upload error:", error);
            },
          });
        };
      } catch (error) {
        console.error("Error uploading Image:", error);
        showToast.error("Failed to upload image");
      }
    }
  };

  // Handle form submission
  const onSubmit = async (data: IFormData) => {
    if (!studentId) {
      showToast.error("Please log in to continue.");
      return;
    }

    setLoading(true);

    try {
      // Prepare submission data
      const submissionData = {
        ...data,
        age: data.age ? moment(data.age).format("YYYY-MM-DD") : null,
        user_image: profileImage || data.user_image,
        meta: {
          bio: data.bio,
          location: data.location,
          education_level: data.education_level,
          institution_name: data.institution_name,
          field_of_study: data.field_of_study,
          graduation_year: data.graduation_year,
          skills: data.skills,
          certifications: data.certifications
        }
      };

      await postQuery({
        url: `${apiUrls?.user?.update}/${studentId}`,
        postData: submissionData,
        onSuccess: async () => {
          showToast.success("Profile updated successfully!");
          
          // Refresh profile data
          try {
            const response = await getQuery({
              url: `${apiUrls?.user?.getDetailsbyId}/${studentId}`,
            });

            if (response?.data) {
              setProfileData(response?.data);
              console.log("Profile data refreshed:", response?.data);
            }
          } catch (error) {
            console.error("Error fetching updated profile:", error);
          }
        },
        onFail: (error) => {
          console.error("Error updating profile:", error);
          showToast.error("Failed to update profile. Please try again.");
        },
      });
    } catch (error) {
      console.error("Form submission error:", error);
      showToast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Handle adding skills
  const handleAddSkill = () => {
    if (newSkill.trim() && !watchedSkills.includes(newSkill.trim())) {
      const currentSkills = watchedSkills;
      setValue("skills", [...currentSkills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  // Handle removing skills
  const handleRemoveSkill = (skillToRemove: string) => {
    const currentSkills = watchedSkills;
    setValue("skills", currentSkills.filter(skill => skill !== skillToRemove));
  };

  // Handle adding certification
  const handleAddCertification = () => {
    appendCertification({
      name: '',
      issuer: '',
      year: new Date().getFullYear(),
      url: ''
    });
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
    <div className="w-full mx-auto p-6 dark:bg-gray-900 dark:text-white bg-white shadow-lg rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackClick}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Update your personal information and social profiles</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Profile Completion</p>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-500 transition-all duration-300"
                  style={{ width: '75%' }}
                />
              </div>
              <span className="text-xs text-gray-500">75%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Banner and Image */}
      <div className="relative mb-20">
        <div className="relative w-full h-48 rounded-xl overflow-hidden">
          <Image
            src={ProfileBanner}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
        
        <div className="absolute top-28 left-6 flex items-end gap-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-100 shadow-lg">
              <Image
                src={profileData?.user_image || ProfileImgPlaceholder}
                alt="Profile"
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
            <label className="absolute bottom-0 right-0 p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-full cursor-pointer shadow-lg transition-colors">
              <Camera className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
          
          <div className="pb-2">
            <h2 className="text-xl font-semibold text-white drop-shadow-lg">
              {profileData?.full_name || 'Student'}
            </h2>
            <p className="text-white/90 text-sm drop-shadow">
              {profileData?.meta?.education_level || 'Student at Medh'}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {[
          { key: 'basic', label: 'Basic Info', icon: User },
          { key: 'social', label: 'Social Profiles', icon: LinkIcon },
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
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...register("full_name")}
                    type="text"
                    disabled
                    className="pl-10 w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                    placeholder="Enter your full name"
                  />
                </div>
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
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...register("email")}
                    type="email"
                    disabled
                    className="pl-10 w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                    placeholder="Enter your email"
                  />
                </div>
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
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...register("phone_number")}
                    type="tel"
                    disabled
                    className="pl-10 w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                    placeholder="Enter your phone number"
                  />
                </div>
                {errors.phone_number && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.phone_number.message}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                  <Controller
                    control={control}
                    name="age"
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        placeholderText="Select your date of birth"
                        dateFormat="dd/MM/yyyy"
                        maxDate={new Date()}
                        showYearDropdown
                        yearDropdownItemNumber={50}
                        scrollableYearDropdown
                        className="pl-10 w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    )}
                  />
                </div>
                {errors.age && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.age.message}
                  </p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...register("location")}
                    type="text"
                    className="pl-10 w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Enter your location"
                  />
                </div>
                {errors.location && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.location.message}
                  </p>
                )}
              </div>

              {/* Bio */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bio
                </label>
                <textarea
                  {...register("bio")}
                  rows={4}
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                  placeholder="Tell us about yourself..."
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

          {/* Social Profiles Tab */}
          {activeTab === 'social' && (
            <motion.div
              key="social"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <LinkIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-blue-900 dark:text-blue-100">Social Profile Links</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      Add your social media profiles to showcase your online presence. All fields are optional.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {socialPlatforms.map(({ key, name, icon: Icon, placeholder, color }) => (
                  <div key={key} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${color}`} />
                        {name}
                      </div>
                    </label>
                    <input
                      {...register(key as keyof IFormData)}
                      type="url"
                      className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder={placeholder}
                    />
                    {errors[key as keyof IFormData] && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors[key as keyof IFormData]?.message}
                      </p>
                    )}
                  </div>
                ))}
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
              className="space-y-8"
            >
              {/* Education Information */}
              <div className="space-y-6">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-green-900 dark:text-green-100">Education Information</h3>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        Share your educational background and qualifications.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Education Level */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Education Level
                    </label>
                    <select
                      {...register("education_level")}
                      className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
                    />
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Skills
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Add a skill..."
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {watchedSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Certifications Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Certifications
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddCertification}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Certification
                  </button>
                </div>

                <div className="space-y-4">
                  {certificationFields.map((field, index) => (
                    <div key={field.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Certification #{index + 1}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeCertification(index)}
                          className="p-1 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Certification Name *
                          </label>
                          <input
                            {...register(`certifications.${index}.name`)}
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="e.g., AWS Certified Developer"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Issuing Organization *
                          </label>
                          <input
                            {...register(`certifications.${index}.issuer`)}
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="e.g., Amazon Web Services"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Year Obtained *
                          </label>
                          <input
                            {...register(`certifications.${index}.year`)}
                            type="number"
                            min="1950"
                            max={new Date().getFullYear()}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder={new Date().getFullYear().toString()}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Certificate URL (Optional)
                          </label>
                          <input
                            {...register(`certifications.${index}.url`)}
                            type="url"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="https://certificate-url.com"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {certificationFields.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No certifications added yet.</p>
                      <p className="text-sm">Click "Add Certification" to get started.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4 pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onBackClick}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
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