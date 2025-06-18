"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { showToast } from '@/utils/toastManager';
import Image from 'next/image';
import { ArrowLeft, Upload, X, UserCheck, Mail, Phone, MapPin, Briefcase, Calendar, GraduationCap, Award, Star, BookOpen } from 'lucide-react';
import useGetQuery from '@/hooks/getQuery.hook';
import usePostQuery from '@/hooks/postQuery.hook';
import { apiUrls } from '@/apis';

// Define instructor type
interface Instructor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  qualification: string;
  expertise: string[];
  experience: number;
  joinDate: string;
  bio: string;
  socialLinks: {
    linkedin: string;
    twitter: string;
    website: string;
  };
  status: string;
  rating: number;
  assignedCourses: string[];
}

// Form schema
const schema = yup.object().shape({
  name: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  country: yup.string().required('Country is required'),
  zipCode: yup.string().required('Zip code is required'),
  qualification: yup.string().required('Qualification is required'),
  expertise: yup.array().of(yup.string()).required('At least one expertise area is required'),
  experience: yup.number().required('Years of experience is required'),
  joinDate: yup.string().required('Join date is required'),
  bio: yup.string().required('Bio is required'),
  socialLinks: yup.object().shape({
    linkedin: yup.string().url('Invalid URL format'),
    twitter: yup.string().url('Invalid URL format'),
    website: yup.string().url('Invalid URL format')
  }),
  status: yup.string().required('Status is required'),
});

const EditInstructor: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [expertiseInput, setExpertiseInput] = useState<string>('');

  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      qualification: '',
      expertise: [] as string[],
      experience: 0,
      joinDate: '',
      bio: '',
      socialLinks: {
        linkedin: '',
        twitter: '',
        website: ''
      },
      status: 'active',
    }
  });

  const expertise = watch('expertise');

  // Fetch instructors list
  useEffect(() => {
    const fetchInstructors = async () => {
      setIsLoading(true);
      try {
        const response = await getQuery({
          url: apiUrls.instructor.getAllInstructors,
          onSuccess: () => {},
          onFail: () => {
            showToast.error('Failed to fetch instructors');
          }
        });

        if (response?.data) {
          setInstructors(Array.isArray(response.data) ? response.data : response.data.data || []);
        }
      } catch (error) {
        console.error('Error fetching instructors:', error);
        showToast.error('Failed to load instructors. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstructors();
  }, [getQuery]);

  // Select instructor to edit
  const handleSelectInstructor = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    
    // Set form values
    reset({
      name: instructor.name,
      email: instructor.email,
      phone: instructor.phone,
      address: instructor.address,
      city: instructor.city,
      state: instructor.state,
      country: instructor.country,
      zipCode: instructor.zipCode,
      qualification: instructor.qualification,
      expertise: [...instructor.expertise],
      experience: instructor.experience,
      joinDate: instructor.joinDate ? new Date(instructor.joinDate).toISOString().split('T')[0] : '',
      bio: instructor.bio,
      socialLinks: {
        linkedin: instructor.socialLinks?.linkedin || '',
        twitter: instructor.socialLinks?.twitter || '',
        website: instructor.socialLinks?.website || ''
      },
      status: instructor.status
    });
    
    setProfileImage(instructor.profileImage);
  };

  // Reset selection
  const handleBackToList = () => {
    setSelectedInstructor(null);
    reset();
    setProfileImage(null);
  };

  // Add expertise tag
  const handleAddExpertise = () => {
    if (expertiseInput.trim() && !expertise.includes(expertiseInput.trim())) {
      setValue('expertise', [...expertise, expertiseInput.trim()]);
      setExpertiseInput('');
    }
  };

  // Remove expertise tag
  const handleRemoveExpertise = (tag: string) => {
    setValue('expertise', expertise.filter(item => item !== tag));
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    try {
      setIsLoading(true);
      
      // Create base64 of the image
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result?.toString().split(',')[1];
        if (base64) {
          const postData = { base64String: base64, fileType: "image" };
          await postQuery({
            url: apiUrls?.upload?.uploadImage,
            postData,
            onSuccess: async (data) => {
              const imageUrl = data?.data;
              setProfileImage(imageUrl);
              showToast.success('Image uploaded successfully');
            },
            onFail: (error) => {
              console.error("Image upload error:", error);
              showToast.error('Image upload failed. Please try again.');
            },
          });
        }
        setIsLoading(false);
      };
      
      reader.onerror = () => {
        showToast.error('Failed to read image file');
        setIsLoading(false);
      };
    } catch (error) {
      console.error("Error in handleImageUpload:", error);
      showToast.error('Failed to upload image');
      setIsLoading(false);
    }
  };

  // Form submission
  const onSubmit = async (data: any) => {
    if (!selectedInstructor) return;
    
    try {
      setIsSubmitting(true);
      
      // Add profile image to data
      const updatedData = {
        ...data,
        profileImage: profileImage || selectedInstructor.profileImage,
      };
      
      // Call the update API
      await postQuery({
        url: `${apiUrls.instructor.updateInstructor}/${selectedInstructor._id}`,
        postData: updatedData,
        onSuccess: () => {
          showToast.success('Instructor updated successfully');
          
          // Update the instructor in the list
          setInstructors(prevInstructors => 
            prevInstructors.map(instructor => 
              instructor._id === selectedInstructor._id ? 
              { ...instructor, ...updatedData } : 
              instructor
            )
          );
          
          // Go back to list
          handleBackToList();
        },
        onFail: (error) => {
          console.error("Update error:", error);
          showToast.error(error?.response?.data?.message || 'Failed to update instructor');
        },
      });
    } catch (error) {
      console.error('Error updating instructor:', error);
      showToast.error('An error occurred while updating the instructor');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the list of instructors
  if (!selectedInstructor) {
    return (
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Select an Instructor to Edit</h1>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="animate-pulse flex flex-col">
                  <div className="rounded-full bg-gray-300 dark:bg-gray-600 h-24 w-24 mx-auto mb-3"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-3"></div>
                  <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded mt-2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : instructors.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-500 dark:text-gray-400">No instructors found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructors.map((instructor) => (
              <div 
                key={instructor._id} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden cursor-pointer"
                onClick={() => handleSelectInstructor(instructor)}
              >
                <div className="p-6 flex flex-col items-center">
                  <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                    {instructor.profileImage ? (
                      <Image 
                        src={instructor.profileImage} 
                        alt={instructor.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                        <UserCheck size={36} />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-center">{instructor.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-3">{instructor.email}</p>
                  
                  <div className="mt-2 flex flex-wrap gap-2 justify-center">
                    {instructor.expertise && instructor.expertise.slice(0, 3).map((exp, i) => (
                      <span key={i} className="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                        {exp}
                      </span>
                    ))}
                    {instructor.expertise && instructor.expertise.length > 3 && (
                      <span className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full">
                        +{instructor.expertise.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <button 
                    className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Render the edit form
  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <button 
          onClick={handleBackToList}
          className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Instructors List
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Instructor: {selectedInstructor.name}</h1>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Profile Image */}
            <div className="col-span-1">
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  {profileImage ? (
                    <Image 
                      src={profileImage} 
                      alt="Profile" 
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                      <UserCheck size={48} />
                    </div>
                  )}
                </div>
                
                <label className="mb-6 cursor-pointer">
                  <div className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                    <Upload size={16} className="mr-2" />
                    <span>Upload Photo</span>
                  </div>
                  <input 
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isLoading}
                  />
                </label>
                
                <div className="w-full space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <h3 className="font-medium mb-3 flex items-center">
                      <BookOpen size={16} className="mr-2" />
                      <span>Assigned Courses</span>
                    </h3>
                    {selectedInstructor.assignedCourses && selectedInstructor.assignedCourses.length > 0 ? (
                      <ul className="space-y-2 text-sm">
                        {selectedInstructor.assignedCourses.map((course, i) => (
                          <li key={i} className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                            {course}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No courses assigned</p>
                    )}
                  </div>
                  
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <h3 className="font-medium mb-2 flex items-center">
                      <Star size={16} className="mr-2" />
                      <span>Current Rating</span>
                    </h3>
                    <div className="flex items-center">
                      <div className="text-amber-500 flex items-center">
                        {Array(5).fill(0).map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            fill={i < Math.floor(selectedInstructor.rating || 0) ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-lg font-semibold">{selectedInstructor.rating || 0}/5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form Fields */}
            <div className="col-span-1 md:col-span-2 space-y-6">
              {/* Personal Information */}
              <div>
                <h2 className="text-lg font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserCheck size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        {...register("name")}
                        className={`w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-900 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`}
                      />
                    </div>
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="email"
                        {...register("email")}
                        className={`w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-900 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`}
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        {...register("phone")}
                        className={`w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-900 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`}
                      />
                    </div>
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm">
                      Status
                    </label>
                    <select
                      {...register("status")}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                    {errors.status && <p className="mt-1 text-xs text-red-500">{errors.status.message}</p>}
                  </div>
                </div>
              </div>
              
              {/* Address Information */}
              <div>
                <h2 className="text-lg font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
                  Address Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm">
                      Address Line
                    </label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        {...register("address")}
                        className={`w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-900 border rounded-md ${errors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`}
                      />
                    </div>
                    {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm">
                        City
                      </label>
                      <input
                        type="text"
                        {...register("city")}
                        className={`w-full px-3 py-2 bg-white dark:bg-gray-900 border rounded-md ${errors.city ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`}
                      />
                      {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>}
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-sm">
                        State/Province
                      </label>
                      <input
                        type="text"
                        {...register("state")}
                        className={`w-full px-3 py-2 bg-white dark:bg-gray-900 border rounded-md ${errors.state ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`}
                      />
                      {errors.state && <p className="mt-1 text-xs text-red-500">{errors.state.message}</p>}
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-sm">
                        Country
                      </label>
                      <input
                        type="text"
                        {...register("country")}
                        className={`w-full px-3 py-2 bg-white dark:bg-gray-900 border rounded-md ${errors.country ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`}
                      />
                      {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country.message}</p>}
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-sm">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        {...register("zipCode")}
                        className={`w-full px-3 py-2 bg-white dark:bg-gray-900 border rounded-md ${errors.zipCode ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`}
                      />
                      {errors.zipCode && <p className="mt-1 text-xs text-red-500">{errors.zipCode.message}</p>}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Professional Information */}
              <div>
                <h2 className="text-lg font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
                  Professional Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-1 text-sm">
                      Qualification
                    </label>
                    <div className="relative">
                      <GraduationCap size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        {...register("qualification")}
                        className={`w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-900 border rounded-md ${errors.qualification ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`}
                      />
                    </div>
                    {errors.qualification && <p className="mt-1 text-xs text-red-500">{errors.qualification.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm">
                      Years of Experience
                    </label>
                    <div className="relative">
                      <Briefcase size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="number"
                        {...register("experience")}
                        className={`w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-900 border rounded-md ${errors.experience ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`}
                      />
                    </div>
                    {errors.experience && <p className="mt-1 text-xs text-red-500">{errors.experience.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm">
                      Join Date
                    </label>
                    <div className="relative">
                      <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="date"
                        {...register("joinDate")}
                        className={`w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-900 border rounded-md ${errors.joinDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`}
                      />
                    </div>
                    {errors.joinDate && <p className="mt-1 text-xs text-red-500">{errors.joinDate.message}</p>}
                  </div>
                </div>
                
                {/* Expertise tags */}
                <div className="mb-4">
                  <label className="block mb-1 text-sm">
                    Areas of Expertise
                  </label>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {expertise.map((tag, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                      >
                        {tag}
                        <button 
                          type="button" 
                          onClick={() => handleRemoveExpertise(tag)}
                          className="ml-1.5 hover:text-red-500"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex">
                    <input
                      type="text"
                      value={expertiseInput}
                      onChange={(e) => setExpertiseInput(e.target.value)}
                      className="flex-grow px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-l-md"
                      placeholder="Add expertise tag"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddExpertise())}
                    />
                    <button 
                      type="button"
                      onClick={handleAddExpertise}
                      className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  {errors.expertise && <p className="mt-1 text-xs text-red-500">{errors.expertise.message}</p>}
                </div>
                
                {/* Bio */}
                <div>
                  <label className="block mb-1 text-sm">
                    Bio
                  </label>
                  <textarea
                    {...register("bio")}
                    rows={4}
                    className={`w-full px-3 py-2 bg-white dark:bg-gray-900 border rounded-md ${errors.bio ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`}
                  ></textarea>
                  {errors.bio && <p className="mt-1 text-xs text-red-500">{errors.bio.message}</p>}
                </div>
              </div>
              
              {/* Social Links */}
              <div>
                <h2 className="text-lg font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
                  Social Links
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm">LinkedIn</label>
                    <input
                      type="text"
                      {...register("socialLinks.linkedin")}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md"
                    />
                    {errors.socialLinks?.linkedin && (
                      <p className="mt-1 text-xs text-red-500">{errors.socialLinks.linkedin.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm">Twitter</label>
                    <input
                      type="text"
                      {...register("socialLinks.twitter")}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md"
                    />
                    {errors.socialLinks?.twitter && (
                      <p className="mt-1 text-xs text-red-500">{errors.socialLinks.twitter.message}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block mb-1 text-sm">Website</label>
                    <input
                      type="text"
                      {...register("socialLinks.website")}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md"
                    />
                    {errors.socialLinks?.website && (
                      <p className="mt-1 text-xs text-red-500">{errors.socialLinks.website.message}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={handleBackToList}
                  className="px-4 py-2 mr-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-800 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInstructor; 