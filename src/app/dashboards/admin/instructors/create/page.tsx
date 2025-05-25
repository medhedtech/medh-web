"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { apiUrls } from "@/apis";
import { usePostQuery } from "@/hooks/postQuery.hook";

type InstructorData = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  bio: string;
  profile_image: string;
  specializations: string[];
  experience_years: number;
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  certifications: string[];
  social_links: {
    linkedin?: string;
    twitter?: string;
    website?: string;
    github?: string;
  };
  availability: {
    days: string[];
    time_slots: string[];
    timezone: string;
  };
  hourly_rate: {
    currency: string;
    amount: number;
  }[];
  languages: string[];
  status: string;
  is_featured: boolean;
};

// Validation schema
const schema = yup.object().shape({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  bio: yup.string().required('Bio is required'),
  profile_image: yup.string().required('Profile image is required'),
  experience_years: yup.number().min(0, 'Experience cannot be negative').required('Experience is required'),
});

export default function CreateInstructorPage() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const { postQuery } = usePostQuery();
  
  // Reference to track if the form was submitted successfully
  const formSubmittedSuccessfully = useRef(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    control,
    reset,
    getValues
  } = useForm<InstructorData>({
    resolver: yupResolver(schema) as any,
    mode: 'onChange',
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      bio: "",
      profile_image: "",
      specializations: [""],
      experience_years: 0,
      education: [
        {
          degree: "",
          institution: "",
          year: "",
        },
      ],
      certifications: [""],
      social_links: {
        linkedin: "",
        twitter: "",
        website: "",
        github: "",
      },
      availability: {
        days: ["Monday"],
        time_slots: ["9:00 AM - 12:00 PM"],
        timezone: "UTC",
      },
      hourly_rate: [
        {
          currency: "USD",
          amount: 0,
        },
      ],
      languages: ["English"],
      status: 'Active',
      is_featured: false,
    }
  });

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    try {
      if (!file) {
        toast.error('Please select a valid image file');
        return;
      }
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result?.toString().split(',')[1];
        if (base64) {
          setIsLoading(true);
          const postData = { base64String: base64, fileType: "image" };
          await postQuery({
            url: apiUrls?.upload?.uploadImage,
            postData,
            onSuccess: async (response) => {
              if (response?.data?.url && typeof response.data.url === 'string') {
                const imageUrl = response.data.url;
                setProfileImage(imageUrl);
                setValue('profile_image', imageUrl, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true
                });
                toast.success('Image uploaded successfully');
              } else {
                console.error("Unexpected image upload response format:", response);
                toast.error('Invalid image upload response format');
              }
            },
            onFail: (error) => {
              console.error("Image upload error:", error);
              toast.error('Image upload failed. Please try again.');
            },
          });
          setIsLoading(false);
        }
      };
      
      reader.onerror = () => {
        toast.error('Failed to read image file');
        setIsLoading(false);
      };
    } catch (error) {
      console.error("Error in handleImageUpload:", error);
      toast.error('Failed to upload image');
      setIsLoading(false);
    }
  };

  const handleStringArrayChange = (arrayPath: string, index: number, value: string) => {
    const currentValues = getValues();
    const parts = arrayPath.split(".");
    
    if (parts.length === 1) {
      const currentArray = currentValues[parts[0] as keyof InstructorData] as any[];
      const newArray = [...currentArray];
      newArray[index] = value;
      setValue(parts[0] as any, newArray);
    } else if (parts.length === 2) {
      const parentKey = parts[0];
      const childKey = parts[1];
      
      const parentObj = { ...(currentValues[parentKey as keyof InstructorData] as any) };
      const newArray = [...parentObj[childKey]];
      newArray[index] = value;
      
      setValue(parentKey as any, {
        ...parentObj,
        [childKey]: newArray,
      });
    }
  };

  const addStringArrayItem = (arrayPath: string, template: string = "") => {
    const currentValues = getValues();
    const parts = arrayPath.split(".");
    
    if (parts.length === 1) {
      const currentArray = currentValues[parts[0] as keyof InstructorData] as any[];
      const newArray = [...currentArray, template];
      setValue(parts[0] as any, newArray);
    } else if (parts.length === 2) {
      const parentKey = parts[0];
      const childKey = parts[1];
      
      const parentObj = { ...(currentValues[parentKey as keyof InstructorData] as any) };
      const newArray = [...parentObj[childKey], template];
      
      setValue(parentKey as any, {
        ...parentObj,
        [childKey]: newArray,
      });
    }
  };

  const removeStringArrayItem = (arrayPath: string, index: number) => {
    const currentValues = getValues();
    const parts = arrayPath.split(".");
    
    if (parts.length === 1) {
      const currentArray = currentValues[parts[0] as keyof InstructorData] as any[];
      const newArray = [...currentArray];
      newArray.splice(index, 1);
      setValue(parts[0] as any, newArray);
    } else if (parts.length === 2) {
      const parentKey = parts[0];
      const childKey = parts[1];
      
      const parentObj = { ...(currentValues[parentKey as keyof InstructorData] as any) };
      const newArray = [...parentObj[childKey]];
      newArray.splice(index, 1);
      
      setValue(parentKey as any, {
        ...parentObj,
        [childKey]: newArray,
      });
    }
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    const currentValues = getValues();
    const newEducation = [...currentValues.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setValue('education', newEducation);
  };

  const addEducation = () => {
    const currentValues = getValues();
    const newEducation = [...currentValues.education, { degree: "", institution: "", year: "" }];
    setValue('education', newEducation);
  };

  const removeEducation = (index: number) => {
    const currentValues = getValues();
    const newEducation = [...currentValues.education];
    newEducation.splice(index, 1);
    setValue('education', newEducation);
  };

  const onSubmit = async (data: InstructorData) => {
    try {
      setIsSubmitting(true);

      // Validate required fields
      if (!data.first_name || !data.last_name || !data.email || !data.profile_image) {
        const missingFields: string[] = [];
        if (!data.first_name) missingFields.push('First Name');
        if (!data.last_name) missingFields.push('Last Name');
        if (!data.email) missingFields.push('Email');
        if (!data.profile_image) missingFields.push('Profile Image');
        
        throw new Error(`Required fields are missing: ${missingFields.join(', ')}`);
      }

      // Generate unique key
      const uniqueKey = crypto.randomUUID();

      const instructorData = {
        ...data,
        unique_key: uniqueKey,
        full_name: `${data.first_name} ${data.last_name}`,
        meta: {
          ratings: {
            average: 0,
            count: 0
          },
          total_students: 0,
          total_courses: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      };

      const response = await postQuery({
        url: apiUrls.instructors?.createInstructor || '/api/instructors',
        postData: instructorData,
        requireAuth: true,
        onSuccess: (response) => {
          formSubmittedSuccessfully.current = true;
          toast.success(`Instructor "${instructorData.full_name}" created successfully!`);
          reset();
          setProfileImage(null);
        },
        onFail: (error) => {
          const errorMessage = error?.response?.data?.message || 'Failed to create instructor';
          toast.error(errorMessage);
          throw new Error(errorMessage);
        },
      });

      if (!response) {
        throw new Error('No response from server');
      }
    } catch (error) {
      console.error("Form submission error:", error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create instructor';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update the base input class name used throughout the file
  const baseInputClass = "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900 placeholder-gray-400";
  const baseLabelClass = "block mb-2 font-medium text-gray-700";
  const baseSelectClass = `${baseInputClass} bg-white cursor-pointer`;

  const formValues = watch();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/dashboards/admin" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Admin Dashboard
          </Link>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8">
          <div className="bg-indigo-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Add New Instructor</h1>
            <p className="mt-1 text-indigo-100">
              Create a new instructor profile for the platform
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
            {/* Personal Information Section */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="border-b border-indigo-100 pb-4 mb-6">
                <h2 className="text-xl font-semibold text-indigo-800">Personal Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="first_name" className={baseLabelClass}>
                    First Name*
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    {...register('first_name')}
                    className={baseInputClass}
                    required
                  />
                  {errors.first_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="last_name" className={baseLabelClass}>
                    Last Name*
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    {...register('last_name')}
                    className={baseInputClass}
                    required
                  />
                  {errors.last_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="email" className={baseLabelClass}>
                    Email*
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    className={baseInputClass}
                    required
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="phone" className={baseLabelClass}>
                    Phone Number*
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    {...register('phone')}
                    className={baseInputClass}
                    required
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>
              </div>
              
              {/* Profile Image Upload */}
              <div className="mb-6">
                <label className={baseLabelClass}>
                  Profile Image*
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {profileImage ? (
                      <div className="mb-4">
                        <img
                          src={profileImage}
                          alt="Profile preview"
                          className="mx-auto h-32 w-32 object-cover rounded-full"
                        />
                      </div>
                    ) : (
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="profile-image-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>{profileImage ? 'Change image' : 'Upload a file'}</span>
                        <input
                          id="profile-image-upload"
                          name="profile-image-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(file);
                            }
                          }}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
                {errors.profile_image && (
                  <p className="mt-1 text-sm text-red-600">{errors.profile_image.message}</p>
                )}
              </div>
              
              {/* Bio */}
              <div>
                <label htmlFor="bio" className={baseLabelClass}>
                  Bio*
                </label>
                <textarea
                  id="bio"
                  {...register('bio')}
                  className={`${baseInputClass} h-32`}
                  placeholder="Tell us about yourself, your expertise, and teaching philosophy..."
                  required
                />
                {errors.bio && (
                  <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
                )}
              </div>
            </div>

            {/* Professional Information */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="border-b border-indigo-100 pb-4 mb-6">
                <h2 className="text-xl font-semibold text-indigo-800">Professional Information</h2>
              </div>
              
              <div className="mb-6">
                <label htmlFor="experience_years" className={baseLabelClass}>
                  Years of Experience*
                </label>
                <input
                  type="number"
                  id="experience_years"
                  {...register('experience_years')}
                  className={baseInputClass}
                  min="0"
                  required
                />
                {errors.experience_years && (
                  <p className="mt-1 text-sm text-red-600">{errors.experience_years.message}</p>
                )}
              </div>
              
              {/* Specializations */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <label className={baseLabelClass}>Specializations</label>
                  <button
                    type="button"
                    onClick={() => addStringArrayItem("specializations")}
                    className="text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Specialization
                  </button>
                </div>
                
                {formValues.specializations?.map((specialization: string, index: number) => (
                  <div key={index} className="flex mb-2">
                    <input
                      type="text"
                      value={specialization}
                      onChange={(e) => handleStringArrayChange("specializations", index, e.target.value)}
                      className={baseInputClass}
                      placeholder="e.g., Web Development, Data Science"
                    />
                    <button
                      type="button"
                      onClick={() => removeStringArrayItem("specializations", index)}
                      className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                      disabled={formValues.specializations?.length === 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Education */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <label className={baseLabelClass}>Education</label>
                  <button
                    type="button"
                    onClick={addEducation}
                    className="text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Education
                  </button>
                </div>
                
                {formValues.education?.map((edu: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                        className={baseInputClass}
                        placeholder="Degree (e.g., B.S. Computer Science)"
                      />
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                        className={baseInputClass}
                        placeholder="Institution"
                      />
                      <input
                        type="text"
                        value={edu.year}
                        onChange={(e) => handleEducationChange(index, "year", e.target.value)}
                        className={baseInputClass}
                        placeholder="Year (e.g., 2020)"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="text-red-500 text-sm font-medium hover:text-red-700 flex items-center"
                      disabled={formValues.education?.length === 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove Education
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Languages */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <label className={baseLabelClass}>Languages</label>
                  <button
                    type="button"
                    onClick={() => addStringArrayItem("languages")}
                    className="text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Language
                  </button>
                </div>
                
                {formValues.languages?.map((language: string, index: number) => (
                  <div key={index} className="flex mb-2">
                    <input
                      type="text"
                      value={language}
                      onChange={(e) => handleStringArrayChange("languages", index, e.target.value)}
                      className={baseInputClass}
                      placeholder="Language (e.g., English, Spanish)"
                    />
                    <button
                      type="button"
                      onClick={() => removeStringArrayItem("languages", index)}
                      className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                      disabled={formValues.languages?.length === 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="mb-6">
                <label className={baseLabelClass}>Social Links</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">LinkedIn</label>
                    <input
                      type="url"
                      {...register('social_links.linkedin')}
                      className={baseInputClass}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">GitHub</label>
                    <input
                      type="url"
                      {...register('social_links.github')}
                      className={baseInputClass}
                      placeholder="https://github.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Website</label>
                    <input
                      type="url"
                      {...register('social_links.website')}
                      className={baseInputClass}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Twitter</label>
                    <input
                      type="url"
                      {...register('social_links.twitter')}
                      className={baseInputClass}
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                </div>
              </div>

              {/* Status and Featured */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="status" className={baseLabelClass}>
                    Status
                  </label>
                  <select
                    id="status"
                    {...register('status')}
                    className={baseSelectClass}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                
                <div className="flex items-center mt-8">
                  <input
                    type="checkbox"
                    id="is_featured"
                    {...register('is_featured')}
                    className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                  />
                  <label htmlFor="is_featured" className="ml-2 font-medium text-gray-700">
                    Featured Instructor
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors shadow-sm flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Create Instructor
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 