"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { apiUrls } from "@/apis";
import { usePostQuery } from "@/hooks/postQuery.hook";
import { useGetQuery } from "@/hooks/getQuery.hook";

// Type definition for category item
interface CategoryItem {
  _id?: string;
  id?: string;
  category_name?: string;
  name?: string;
  [key: string]: any;
}

type LiveCourseData = {
  course_title: string;
  course_category: string;
  course_image: string;
  course_description: {
    program_overview: string;
  };
  course_duration: string;
  session_duration: string;
  max_participants: number;
  schedule: {
    start_date: string;
    end_date: string;
    class_days: string[];
    class_time: string;
    timezone: string;
  };
  instructor_info: {
    primary_instructor: string;
    co_instructors: string[];
    guest_speakers: string[];
  };
  course_requirements: {
    prerequisites: string[];
    required_tools: string[];
    technical_requirements: string[];
  };
  live_session_features: {
    recording_available: boolean;
    interactive_whiteboard: boolean;
    breakout_rooms: boolean;
    screen_sharing: boolean;
    chat_enabled: boolean;
  };
  assessments: {
    quizzes: boolean;
    assignments: boolean;
    projects: boolean;
    final_exam: boolean;
  };
  pricing: {
    currency: string;
    base_price: number;
    early_bird_price: number;
    early_bird_deadline: string;
    group_discount_percentage: number;
    min_group_size: number;
  }[];
  course_type: string;
  status: string;
  show_in_home: boolean;
};

// Validation schema
const schema = yup.object().shape({
  course_title: yup.string().required('Course title is required'),
  course_category: yup.string().required('Course category is required'),
  course_image: yup.string().required('Course image is required'),
  course_duration: yup.string().required('Course duration is required'),
  session_duration: yup.string().required('Session duration is required'),
  max_participants: yup.number().min(1, 'Must have at least 1 participant').required('Max participants is required'),
  schedule: yup.object().shape({
    start_date: yup.string().required('Start date is required'),
    end_date: yup.string().required('End date is required'),
    class_time: yup.string().required('Class time is required'),
  }),
});

export default function CreateLiveCoursePage() {
  const [categories, setCategories] = useState<Array<{id: string, name: string}>>([]);
  const [courseImage, setCourseImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const { postQuery } = usePostQuery();
  const { getQuery } = useGetQuery();
  
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
  } = useForm<LiveCourseData>({
    resolver: yupResolver(schema) as any,
    mode: 'onChange',
    defaultValues: {
      course_type: "live",
      course_duration: "",
      session_duration: "",
      max_participants: 20,
      schedule: {
        start_date: "",
        end_date: "",
        class_days: ["Monday", "Wednesday", "Friday"],
        class_time: "10:00 AM",
        timezone: "UTC",
      },
      instructor_info: {
        primary_instructor: "",
        co_instructors: [""],
        guest_speakers: [""],
      },
      course_requirements: {
        prerequisites: [""],
        required_tools: [""],
        technical_requirements: [""],
      },
      live_session_features: {
        recording_available: true,
        interactive_whiteboard: true,
        breakout_rooms: false,
        screen_sharing: true,
        chat_enabled: true,
      },
      assessments: {
        quizzes: true,
        assignments: true,
        projects: false,
        final_exam: true,
      },
      pricing: [
        {
          currency: "USD",
          base_price: 0,
          early_bird_price: 0,
          early_bird_deadline: "",
          group_discount_percentage: 10,
          min_group_size: 3,
        },
      ],
      status: 'Draft',
      show_in_home: false,
    }
  });

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await getQuery({
          url: apiUrls.categories.getAllCategories,
          onSuccess: () => {},
          onFail: () => {
            console.error("Error fetching categories");
            toast.error('Failed to load categories. Please try again.');
          }
        });
        
        if (response?.data) {
          let categoriesData: CategoryItem[] = [];
          
          if (Array.isArray(response.data)) {
            categoriesData = response.data;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            categoriesData = response.data.data;
          } else if (response.data.success && Array.isArray(response.data.data)) {
            categoriesData = response.data.data;
          }
          
          const formattedCategories = categoriesData
            .filter(cat => cat && (cat._id || cat.id) && (cat.category_name || cat.name))
            .map(cat => ({
              id: cat._id || cat.id || '',
              name: cat.category_name || cat.name || 'Unnamed Category'
            }));
          
          setCategories(formattedCategories);
          
          if (formattedCategories.length === 0) {
            toast.warning('No valid categories found. Please add categories first.');
          }
        } else {
          console.error("No data received from categories API");
          toast.error('No categories found. Please check the API.');
        }
      } catch (error) {
        console.error("Error in fetchCategories:", error);
        toast.error('Failed to load categories. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [getQuery]);

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
                setCourseImage(imageUrl);
                setValue('course_image', imageUrl, {
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
      const currentArray = currentValues[parts[0] as keyof LiveCourseData] as any[];
      const newArray = [...currentArray];
      newArray[index] = value;
      setValue(parts[0] as any, newArray);
    } else if (parts.length === 2) {
      const parentKey = parts[0];
      const childKey = parts[1];
      
      const parentObj = { ...(currentValues[parentKey as keyof LiveCourseData] as any) };
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
      const currentArray = currentValues[parts[0] as keyof LiveCourseData] as any[];
      const newArray = [...currentArray, template];
      setValue(parts[0] as any, newArray);
    } else if (parts.length === 2) {
      const parentKey = parts[0];
      const childKey = parts[1];
      
      const parentObj = { ...(currentValues[parentKey as keyof LiveCourseData] as any) };
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
      const currentArray = currentValues[parts[0] as keyof LiveCourseData] as any[];
      const newArray = [...currentArray];
      newArray.splice(index, 1);
      setValue(parts[0] as any, newArray);
    } else if (parts.length === 2) {
      const parentKey = parts[0];
      const childKey = parts[1];
      
      const parentObj = { ...(currentValues[parentKey as keyof LiveCourseData] as any) };
      const newArray = [...parentObj[childKey]];
      newArray.splice(index, 1);
      
      setValue(parentKey as any, {
        ...parentObj,
        [childKey]: newArray,
      });
    }
  };

  const onSubmit = async (data: LiveCourseData) => {
    try {
      setIsSubmitting(true);

      // Validate required fields
      if (!data.course_title || !data.course_category || !data.course_image) {
        const missingFields: string[] = [];
        if (!data.course_title) missingFields.push('Course Title');
        if (!data.course_category) missingFields.push('Course Category');
        if (!data.course_image) missingFields.push('Course Image');
        
        throw new Error(`Required fields are missing: ${missingFields.join(', ')}`);
      }

      // Generate unique key and slug
      const uniqueKey = crypto.randomUUID();
      const slug = data.course_title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const courseData = {
        ...data,
        unique_key: uniqueKey,
        course_slug: slug,
        meta: {
          ratings: {
            average: 0,
            count: 0
          },
          views: 0,
          enrollments: 0,
          lastUpdated: new Date().toISOString()
        }
      };

      const response = await postQuery({
        url: apiUrls.courses.createCourse,
        postData: courseData,
        requireAuth: true,
        onSuccess: (response) => {
          formSubmittedSuccessfully.current = true;
          toast.success(`Course "${courseData.course_title}" created successfully!`);
          reset();
        },
        onFail: (error) => {
          const errorMessage = error?.response?.data?.message || 'Failed to create course';
          toast.error(errorMessage);
          throw new Error(errorMessage);
        },
      });

      if (!response) {
        throw new Error('No response from server');
      }
    } catch (error) {
      console.error("Form submission error:", error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create course';
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
          <Link href="/dashboards/admin/courses/create" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Course Type Selection
          </Link>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8">
          <div className="bg-indigo-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Create Live Course</h1>
            <p className="mt-1 text-indigo-100">
              Create a new live interactive course with real-time instruction
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
            {/* Course Overview Section */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="border-b border-indigo-100 pb-4 mb-6">
                <h2 className="text-xl font-semibold text-indigo-800">Course Overview</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="course_title" className={baseLabelClass}>
                    Course Title*
                  </label>
                  <input
                    type="text"
                    id="course_title"
                    {...register('course_title')}
                    className={baseInputClass}
                    required
                  />
                  {errors.course_title && (
                    <p className="mt-1 text-sm text-red-600">{errors.course_title.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="course_category" className={baseLabelClass}>
                    Course Category*
                  </label>
                  {isLoading ? (
                    <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100">
                      Loading categories...
                    </div>
                  ) : (
                    <select
                      id="course_category"
                      {...register('course_category')}
                      className={baseSelectClass}
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {errors.course_category && (
                    <p className="mt-1 text-sm text-red-600">{errors.course_category.message}</p>
                  )}
                </div>
              </div>
              
              {/* Course Image Upload */}
              <div className="mb-6">
                <label className={baseLabelClass}>
                  Course Image*
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {courseImage ? (
                      <div className="mb-4">
                        <img
                          src={courseImage}
                          alt="Course preview"
                          className="mx-auto h-32 w-32 object-cover rounded-lg"
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
                        htmlFor="course-image-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>{courseImage ? 'Change image' : 'Upload a file'}</span>
                        <input
                          id="course-image-upload"
                          name="course-image-upload"
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
                {errors.course_image && (
                  <p className="mt-1 text-sm text-red-600">{errors.course_image.message}</p>
                )}
              </div>
              
              {/* Program Overview */}
              <div>
                <label htmlFor="program_overview" className={baseLabelClass}>
                  Program Overview*
                </label>
                <textarea
                  id="program_overview"
                  {...register('course_description.program_overview')}
                  className={`${baseInputClass} h-28`}
                  required
                />
                {errors.course_description?.program_overview && (
                  <p className="mt-1 text-sm text-red-600">{errors.course_description.program_overview.message}</p>
                )}
              </div>
            </div>

            {/* Live Course Specific Fields */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="border-b border-indigo-100 pb-4 mb-6">
                <h2 className="text-xl font-semibold text-indigo-800">Live Course Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <label htmlFor="course_duration" className={baseLabelClass}>
                    Course Duration*
                  </label>
                  <input
                    type="text"
                    id="course_duration"
                    {...register('course_duration')}
                    className={baseInputClass}
                    placeholder="e.g., 6 weeks"
                    required
                  />
                  {errors.course_duration && (
                    <p className="mt-1 text-sm text-red-600">{errors.course_duration.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="session_duration" className={baseLabelClass}>
                    Session Duration*
                  </label>
                  <input
                    type="text"
                    id="session_duration"
                    {...register('session_duration')}
                    className={baseInputClass}
                    placeholder="e.g., 2 hours"
                    required
                  />
                  {errors.session_duration && (
                    <p className="mt-1 text-sm text-red-600">{errors.session_duration.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="max_participants" className={baseLabelClass}>
                    Max Participants*
                  </label>
                  <input
                    type="number"
                    id="max_participants"
                    {...register('max_participants')}
                    className={baseInputClass}
                    min="1"
                    required
                  />
                  {errors.max_participants && (
                    <p className="mt-1 text-sm text-red-600">{errors.max_participants.message}</p>
                  )}
                </div>
              </div>
              
              {/* Schedule */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
                <div className="border-b border-indigo-100 pb-3 mb-4">
                  <h3 className="text-lg font-medium text-indigo-800">Schedule</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="start_date" className={baseLabelClass}>
                      Start Date*
                    </label>
                    <input
                      type="date"
                      id="start_date"
                      {...register('schedule.start_date')}
                      className={baseInputClass}
                      required
                    />
                    {errors.schedule?.start_date && (
                      <p className="mt-1 text-sm text-red-600">{errors.schedule.start_date.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="end_date" className={baseLabelClass}>
                      End Date*
                    </label>
                    <input
                      type="date"
                      id="end_date"
                      {...register('schedule.end_date')}
                      className={baseInputClass}
                      required
                    />
                    {errors.schedule?.end_date && (
                      <p className="mt-1 text-sm text-red-600">{errors.schedule.end_date.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="class_time" className={baseLabelClass}>
                      Class Time*
                    </label>
                    <input
                      type="time"
                      id="class_time"
                      {...register('schedule.class_time')}
                      className={baseInputClass}
                      required
                    />
                    {errors.schedule?.class_time && (
                      <p className="mt-1 text-sm text-red-600">{errors.schedule.class_time.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="timezone" className={baseLabelClass}>
                      Timezone
                    </label>
                    <select
                      id="timezone"
                      {...register('schedule.timezone')}
                      className={baseSelectClass}
                    >
                      <option value="UTC">UTC</option>
                      <option value="EST">Eastern Time (EST)</option>
                      <option value="PST">Pacific Time (PST)</option>
                      <option value="IST">India Standard Time (IST)</option>
                      <option value="GMT">Greenwich Mean Time (GMT)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Instructor Information */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
                <div className="border-b border-indigo-100 pb-3 mb-4">
                  <h3 className="text-lg font-medium text-indigo-800">Instructor Information</h3>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="primary_instructor" className={baseLabelClass}>
                    Primary Instructor
                  </label>
                  <input
                    type="text"
                    id="primary_instructor"
                    {...register('instructor_info.primary_instructor')}
                    className={baseInputClass}
                    placeholder="Enter instructor name"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Co-Instructors */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className={baseLabelClass}>Co-Instructors</label>
                      <button
                        type="button"
                        onClick={() => addStringArrayItem("instructor_info.co_instructors")}
                        className="text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add
                      </button>
                    </div>
                    
                    {formValues.instructor_info?.co_instructors?.map((instructor: string, index: number) => (
                      <div key={index} className="flex mb-2">
                        <input
                          type="text"
                          value={instructor}
                          onChange={(e) => handleStringArrayChange("instructor_info.co_instructors", index, e.target.value)}
                          className={baseInputClass}
                          placeholder="Co-instructor name"
                        />
                        <button
                          type="button"
                          onClick={() => removeStringArrayItem("instructor_info.co_instructors", index)}
                          className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                          disabled={formValues.instructor_info?.co_instructors?.length === 1}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {/* Guest Speakers */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className={baseLabelClass}>Guest Speakers</label>
                      <button
                        type="button"
                        onClick={() => addStringArrayItem("instructor_info.guest_speakers")}
                        className="text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add
                      </button>
                    </div>
                    
                    {formValues.instructor_info?.guest_speakers?.map((speaker: string, index: number) => (
                      <div key={index} className="flex mb-2">
                        <input
                          type="text"
                          value={speaker}
                          onChange={(e) => handleStringArrayChange("instructor_info.guest_speakers", index, e.target.value)}
                          className={baseInputClass}
                          placeholder="Guest speaker name"
                        />
                        <button
                          type="button"
                          onClick={() => removeStringArrayItem("instructor_info.guest_speakers", index)}
                          className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                          disabled={formValues.instructor_info?.guest_speakers?.length === 1}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Course Requirements */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
                <div className="border-b border-indigo-100 pb-3 mb-4">
                  <h3 className="text-lg font-medium text-indigo-800">Course Requirements</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Prerequisites */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className={baseLabelClass}>Prerequisites</label>
                      <button
                        type="button"
                        onClick={() => addStringArrayItem("course_requirements.prerequisites")}
                        className="text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add
                      </button>
                    </div>
                    
                    {formValues.course_requirements?.prerequisites?.map((prereq: string, index: number) => (
                      <div key={index} className="flex mb-2">
                        <input
                          type="text"
                          value={prereq}
                          onChange={(e) => handleStringArrayChange("course_requirements.prerequisites", index, e.target.value)}
                          className={baseInputClass}
                          placeholder="Prerequisite"
                        />
                        <button
                          type="button"
                          onClick={() => removeStringArrayItem("course_requirements.prerequisites", index)}
                          className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                          disabled={formValues.course_requirements?.prerequisites?.length === 1}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {/* Required Tools */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className={baseLabelClass}>Required Tools</label>
                      <button
                        type="button"
                        onClick={() => addStringArrayItem("course_requirements.required_tools")}
                        className="text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add
                      </button>
                    </div>
                    
                    {formValues.course_requirements?.required_tools?.map((tool: string, index: number) => (
                      <div key={index} className="flex mb-2">
                        <input
                          type="text"
                          value={tool}
                          onChange={(e) => handleStringArrayChange("course_requirements.required_tools", index, e.target.value)}
                          className={baseInputClass}
                          placeholder="Required tool"
                        />
                        <button
                          type="button"
                          onClick={() => removeStringArrayItem("course_requirements.required_tools", index)}
                          className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                          disabled={formValues.course_requirements?.required_tools?.length === 1}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {/* Technical Requirements */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className={baseLabelClass}>Technical Requirements</label>
                      <button
                        type="button"
                        onClick={() => addStringArrayItem("course_requirements.technical_requirements")}
                        className="text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add
                      </button>
                    </div>
                    
                    {formValues.course_requirements?.technical_requirements?.map((req: string, index: number) => (
                      <div key={index} className="flex mb-2">
                        <input
                          type="text"
                          value={req}
                          onChange={(e) => handleStringArrayChange("course_requirements.technical_requirements", index, e.target.value)}
                          className={baseInputClass}
                          placeholder="Technical requirement"
                        />
                        <button
                          type="button"
                          onClick={() => removeStringArrayItem("course_requirements.technical_requirements", index)}
                          className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                          disabled={formValues.course_requirements?.technical_requirements?.length === 1}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Live Session Features */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
                <div className="border-b border-indigo-100 pb-3 mb-4">
                  <h3 className="text-lg font-medium text-indigo-800">Live Session Features</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="recording_available"
                        {...register('live_session_features.recording_available')}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                      />
                      <label htmlFor="recording_available" className="ml-2 font-medium text-gray-700">
                        Session Recording Available
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="interactive_whiteboard"
                        {...register('live_session_features.interactive_whiteboard')}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                      />
                      <label htmlFor="interactive_whiteboard" className="ml-2 font-medium text-gray-700">
                        Interactive Whiteboard
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="breakout_rooms"
                        {...register('live_session_features.breakout_rooms')}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                      />
                      <label htmlFor="breakout_rooms" className="ml-2 font-medium text-gray-700">
                        Breakout Rooms
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="screen_sharing"
                        {...register('live_session_features.screen_sharing')}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                      />
                      <label htmlFor="screen_sharing" className="ml-2 font-medium text-gray-700">
                        Screen Sharing
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="chat_enabled"
                        {...register('live_session_features.chat_enabled')}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                      />
                      <label htmlFor="chat_enabled" className="ml-2 font-medium text-gray-700">
                        Live Chat
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Assessments */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
                <div className="border-b border-indigo-100 pb-3 mb-4">
                  <h3 className="text-lg font-medium text-indigo-800">Assessments</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="quizzes"
                        {...register('assessments.quizzes')}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                      />
                      <label htmlFor="quizzes" className="ml-2 font-medium text-gray-700">
                        Weekly Quizzes
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="assignments"
                        {...register('assessments.assignments')}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                      />
                      <label htmlFor="assignments" className="ml-2 font-medium text-gray-700">
                        Practical Assignments
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="projects"
                        {...register('assessments.projects')}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                      />
                      <label htmlFor="projects" className="ml-2 font-medium text-gray-700">
                        Capstone Projects
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="final_exam"
                        {...register('assessments.final_exam')}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                      />
                      <label htmlFor="final_exam" className="ml-2 font-medium text-gray-700">
                        Final Examination
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Pricing */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="border-b border-indigo-100 pb-3 mb-4">
                  <h3 className="text-lg font-medium text-indigo-800">Pricing (Multi-Currency)</h3>
                </div>
                
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      const usedCurrencies = (formValues.pricing || []).map((p: any) => p.currency);
                      const allCurrencies = ["USD", "INR", "EUR", "GBP", "AUD", "CAD", "SGD", "JPY"];
                      const available = allCurrencies.find(c => !usedCurrencies.includes(c));
                      if (!available) return;
                      
                      const currentPricing = getValues('pricing') || [];
                      setValue('pricing', [
                        ...currentPricing,
                        {
                          currency: available,
                          base_price: 0,
                          early_bird_price: 0,
                          early_bird_deadline: "",
                          group_discount_percentage: 10,
                          min_group_size: 3,
                        },
                      ]);
                    }}
                    className="text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center"
                    disabled={((formValues.pricing || []).length || 0) >= 8}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Currency
                  </button>
                </div>
                
                {(formValues.pricing || []).map((price: any, idx: number) => (
                  <div key={idx} className="bg-white p-5 mb-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className={baseLabelClass}>Currency</label>
                        <select
                          value={price.currency}
                          onChange={e => {
                            const newCurrency = e.target.value;
                            if ((formValues.pricing || []).some((p: any, i: number) => i !== idx && p.currency === newCurrency)) return;
                            const newPricing = [...(formValues.pricing || [])];
                            newPricing[idx].currency = newCurrency;
                            setValue('pricing', newPricing);
                          }}
                          className={baseSelectClass}
                        >
                          {["USD", "INR", "EUR", "GBP", "AUD", "CAD", "SGD", "JPY"].map(c => (
                            <option 
                              key={c} 
                              value={c} 
                              disabled={(formValues.pricing || []).some((p: any, i: number) => i !== idx && p.currency === c)}
                            >
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className={baseLabelClass}>Base Price</label>
                        <input
                          type="number"
                          value={price.base_price}
                          min={0}
                          onChange={e => {
                            const newPricing = [...(formValues.pricing || [])];
                            newPricing[idx].base_price = Number(e.target.value);
                            setValue('pricing', newPricing);
                          }}
                          className={baseInputClass}
                        />
                      </div>
                      
                      <div>
                        <label className={baseLabelClass}>Early Bird Price</label>
                        <input
                          type="number"
                          value={price.early_bird_price}
                          min={0}
                          onChange={e => {
                            const newPricing = [...(formValues.pricing || [])];
                            newPricing[idx].early_bird_price = Number(e.target.value);
                            setValue('pricing', newPricing);
                          }}
                          className={baseInputClass}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className={baseLabelClass}>Early Bird Deadline</label>
                        <input
                          type="date"
                          value={price.early_bird_deadline}
                          onChange={e => {
                            const newPricing = [...(formValues.pricing || [])];
                            newPricing[idx].early_bird_deadline = e.target.value;
                            setValue('pricing', newPricing);
                          }}
                          className={baseInputClass}
                        />
                      </div>
                      
                      <div>
                        <label className={baseLabelClass}>Group Discount (%)</label>
                        <input
                          type="number"
                          value={price.group_discount_percentage}
                          min={0}
                          max={100}
                          onChange={e => {
                            const newPricing = [...(formValues.pricing || [])];
                            newPricing[idx].group_discount_percentage = Number(e.target.value);
                            setValue('pricing', newPricing);
                          }}
                          className={baseInputClass}
                        />
                      </div>
                      
                      <div>
                        <label className={baseLabelClass}>Min Group Size</label>
                        <input
                          type="number"
                          value={price.min_group_size}
                          min={1}
                          onChange={e => {
                            const newPricing = [...(formValues.pricing || [])];
                            newPricing[idx].min_group_size = Number(e.target.value);
                            setValue('pricing', newPricing);
                          }}
                          className={baseInputClass}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          const newPricing = [...(formValues.pricing || [])];
                          newPricing.splice(idx, 1);
                          setValue('pricing', newPricing);
                        }}
                        className="text-red-500 text-sm font-medium hover:text-red-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={(formValues.pricing || []).length === 1}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
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
                    Create Live Course
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