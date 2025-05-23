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

type BlendedCourseData = {
  course_title: string;
  course_category: string;
  course_image: string;
  course_description: {
    program_overview: string;
    benefits: string;
  };
  course_duration: string;
  session_duration: string;
  class_type: string;
  no_of_Sessions: number;
  curriculum: {
    id: string;
    weekTitle: string;
    title: string;
    description: string;
    order: number;
    lessons: {
      title: string;
      description: string;
      duration: number;
      content_type: string;
      content_url: string;
      is_preview: boolean;
      order: number;
    }[];
  }[];
  doubt_session_schedule: {
    frequency: string;
    preferred_days: string[];
    preferred_time_slots: string[];
  };
  certification: {
    is_certified: boolean;
    certification_criteria: any;
  };
  is_Certification: boolean;
  is_Quizes: boolean;
  is_Projects: boolean;
  is_Assignments: boolean;
  prices: {
    currency: string;
    individual: number;
    batch: number;
    min_batch_size: number;
    max_batch_size: number;
    early_bird_discount: number;
    group_discount: number;
    is_active: boolean;
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
  class_type: yup.string().required('Class type is required'),
  no_of_Sessions: yup.number().min(1, 'Must have at least 1 session').required('Number of sessions is required'),
  course_description: yup.object().shape({
    program_overview: yup.string().required('Program overview is required'),
    benefits: yup.string().required('Benefits description is required'),
  }),
});

export default function CreateBlendedCoursePage() {
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
  } = useForm<BlendedCourseData>({
    resolver: yupResolver(schema) as any,
    mode: 'onChange',
    defaultValues: {
      course_type: "blended",
      course_duration: "",
      session_duration: "",
      class_type: "online",
      no_of_Sessions: 1,
      course_description: {
        program_overview: "",
        benefits: "",
      },
      curriculum: [
        {
          id: "",
          weekTitle: "",
          title: "",
          description: "",
          order: 1,
          lessons: [
            {
              title: "",
              description: "",
              duration: 0,
              content_type: "video",
              content_url: "",
              is_preview: false,
              order: 1,
            },
          ],
        },
      ],
      doubt_session_schedule: {
        frequency: "weekly",
        preferred_days: ["Monday"],
        preferred_time_slots: ["10:00 AM"],
      },
      certification: {
        is_certified: true,
        certification_criteria: {},
      },
      is_Certification: true,
      is_Quizes: true,
      is_Projects: false,
      is_Assignments: true,
      prices: [
        {
          currency: "USD",
          individual: 0,
          batch: 0,
          min_batch_size: 2,
          max_batch_size: 10,
          early_bird_discount: 0,
          group_discount: 0,
          is_active: true,
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

  const handleArrayInputChange = (arrayPath: string, index: number, field: string, value: any) => {
    const currentValues = getValues();
    const parts = arrayPath.split(".");
    
    if (parts.length === 1) {
      // Simple array like ["curriculum"]
      const newArray = [...(currentValues[parts[0] as keyof BlendedCourseData] as any[])];
      newArray[index] = { ...newArray[index], [field]: value };
      setValue(parts[0] as any, newArray);
    } else if (parts.length === 2) {
      // Two-level like ["instructor_info", "co_instructors"]
      const parentKey = parts[0];
      const childKey = parts[1];
      
      const parentObj = { ...(currentValues[parentKey as keyof BlendedCourseData] as any) };
      const newArray = [...parentObj[childKey]];
      newArray[index] = { ...newArray[index], [field]: value };
      
      setValue(parentKey as any, {
        ...parentObj,
        [childKey]: newArray,
      });
    } else if (parts.length === 3) {
      // Three-level like ["curriculum", "0", "lessons"] 
      const parentKey = parts[0]; // "curriculum"
      const parentIndex = parseInt(parts[1]); // module index
      const childKey = parts[2]; // "lessons"
      
      const parentArray = [...(currentValues[parentKey as keyof BlendedCourseData] as any[])];
      const parentItem = { ...parentArray[parentIndex] };
      const childArray = [...(parentItem[childKey] || [])];
      
      if (field) {
        childArray[index] = { ...childArray[index], [field]: value };
      } else {
        childArray[index] = value;
      }
      
      parentItem[childKey] = childArray;
      parentArray[parentIndex] = parentItem;
      
      setValue(parentKey as any, parentArray);
    }
  };

  const addArrayItem = (arrayPath: string, template: any) => {
    const currentValues = getValues();
    const parts = arrayPath.split(".");
    
    if (parts.length === 1) {
      const newArray = [...(currentValues[parts[0] as keyof BlendedCourseData] as any[]), template];
      setValue(parts[0] as any, newArray);
    } else if (parts.length === 2) {
      const parentKey = parts[0];
      const childKey = parts[1];
      
      const parentObj = { ...(currentValues[parentKey as keyof BlendedCourseData] as any) };
      const newArray = [...(parentObj[childKey] || []), template];
      
      setValue(parentKey as any, {
        ...parentObj,
        [childKey]: newArray,
      });
    } else if (parts.length === 3) {
      // Three-level like ["curriculum", "0", "lessons"]
      const parentKey = parts[0]; // "curriculum"
      const parentIndex = parseInt(parts[1]); // module index
      const childKey = parts[2]; // "lessons"
      
      const parentArray = [...(currentValues[parentKey as keyof BlendedCourseData] as any[])];
      const parentItem = { ...parentArray[parentIndex] };
      const childArray = [...(parentItem[childKey] || [])];
      
      childArray.push(template);
      parentItem[childKey] = childArray;
      parentArray[parentIndex] = parentItem;
      
      setValue(parentKey as any, parentArray);
    }
  };

  const removeArrayItem = (arrayPath: string, index: number) => {
    const currentValues = getValues();
    const parts = arrayPath.split(".");
    
    if (parts.length === 1) {
      const newArray = [...(currentValues[parts[0] as keyof BlendedCourseData] as any[])];
      newArray.splice(index, 1);
      setValue(parts[0] as any, newArray);
    } else if (parts.length === 2) {
      const parentKey = parts[0];
      const childKey = parts[1];
      
      const parentObj = { ...(currentValues[parentKey as keyof BlendedCourseData] as any) };
      const newArray = [...parentObj[childKey]];
      newArray.splice(index, 1);
      
      setValue(parentKey as any, {
        ...parentObj,
        [childKey]: newArray,
      });
    } else if (parts.length === 3) {
      // Three-level like ["curriculum", "0", "lessons"]
      const parentKey = parts[0]; // "curriculum"
      const parentIndex = parseInt(parts[1]); // module index
      const childKey = parts[2]; // "lessons"
      
      const parentArray = [...(currentValues[parentKey as keyof BlendedCourseData] as any[])];
      const parentItem = { ...parentArray[parentIndex] };
      const childArray = [...(parentItem[childKey] || [])];
      
      childArray.splice(index, 1);
      parentItem[childKey] = childArray;
      parentArray[parentIndex] = parentItem;
      
      setValue(parentKey as any, parentArray);
    }
  };

  // Helper function to handle curriculum lesson changes
  const handleLessonChange = (moduleIndex: number, lessonIndex: number, field: string, value: any) => {
    const currentValues = getValues();
    const newCurriculum = [...currentValues.curriculum];
    const newModule = { ...newCurriculum[moduleIndex] };
    const newLessons = [...(newModule.lessons || [])];
    
    if (newLessons[lessonIndex]) {
      newLessons[lessonIndex] = { ...newLessons[lessonIndex], [field]: value };
    }
    
    newModule.lessons = newLessons;
    newCurriculum[moduleIndex] = newModule;
    setValue('curriculum', newCurriculum);
  };

  // Helper function to add lesson to a module
  const addLessonToModule = (moduleIndex: number) => {
    const currentValues = getValues();
    const newCurriculum = [...currentValues.curriculum];
    const newModule = { ...newCurriculum[moduleIndex] };
    const newLessons = [...(newModule.lessons || [])];
    
    newLessons.push({
      title: "",
      description: "",
      duration: 0,
      content_type: "video",
      content_url: "",
      is_preview: false,
      order: newLessons.length + 1,
    });
    
    newModule.lessons = newLessons;
    newCurriculum[moduleIndex] = newModule;
    setValue('curriculum', newCurriculum);
  };

  // Helper function to remove lesson from a module
  const removeLessonFromModule = (moduleIndex: number, lessonIndex: number) => {
    const currentValues = getValues();
    const newCurriculum = [...currentValues.curriculum];
    const newModule = { ...newCurriculum[moduleIndex] };
    const newLessons = [...(newModule.lessons || [])];
    
    newLessons.splice(lessonIndex, 1);
    
    newModule.lessons = newLessons;
    newCurriculum[moduleIndex] = newModule;
    setValue('curriculum', newCurriculum);
  };

  const onSubmit = async (data: BlendedCourseData) => {
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
            <h1 className="text-2xl font-bold text-white">Create Blended Course</h1>
            <p className="mt-1 text-indigo-100">
              Create a new blended course with self-paced learning and instructor support
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
              <div className="mb-6">
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
              
              {/* Benefits */}
              <div>
                <label htmlFor="benefits" className={baseLabelClass}>
                  Course Benefits*
                </label>
                <textarea
                  id="benefits"
                  {...register('course_description.benefits')}
                  className={`${baseInputClass} h-28`}
                  placeholder="Describe the key benefits students will gain from this course..."
                  required
                />
                {errors.course_description?.benefits && (
                  <p className="mt-1 text-sm text-red-600">{errors.course_description.benefits.message}</p>
                )}
              </div>
            </div>

            {/* Blended Course Specific Fields */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="border-b border-indigo-100 pb-4 mb-6">
                <h2 className="text-xl font-semibold text-indigo-800">Blended Course Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label htmlFor="course_duration" className={baseLabelClass}>
                    Course Duration*
                  </label>
                  <input
                    type="text"
                    id="course_duration"
                    {...register('course_duration')}
                    className={baseInputClass}
                    placeholder="e.g., 8 weeks"
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
                  <label htmlFor="class_type" className={baseLabelClass}>
                    Class Type*
                  </label>
                  <select
                    id="class_type"
                    {...register('class_type')}
                    className={baseSelectClass}
                    required
                  >
                    <option value="">Select class type</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                  {errors.class_type && (
                    <p className="mt-1 text-sm text-red-600">{errors.class_type.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="no_of_Sessions" className={baseLabelClass}>
                    Number of Sessions*
                  </label>
                  <input
                    type="number"
                    id="no_of_Sessions"
                    {...register('no_of_Sessions')}
                    className={baseInputClass}
                    min="1"
                    required
                  />
                  {errors.no_of_Sessions && (
                    <p className="mt-1 text-sm text-red-600">{errors.no_of_Sessions.message}</p>
                  )}
                </div>
              </div>
              
              {/* Curriculum */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
                <div className="flex justify-between items-center mb-4 border-b border-indigo-100 pb-3">
                  <h3 className="text-lg font-medium text-indigo-800">Curriculum</h3>
                  <button
                    type="button"
                    onClick={() => 
                      addArrayItem("curriculum", {
                        id: "",
                        weekTitle: "",
                        title: "",
                        description: "",
                        order: formValues.curriculum?.length ? formValues.curriculum.length + 1 : 1,
                        lessons: [],
                      })
                    }
                    className="text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Module
                  </button>
                </div>
                
                {formValues.curriculum?.map((module: any, moduleIndex: number) => (
                  <div key={moduleIndex} className="bg-white p-5 mb-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className={baseLabelClass}>Week Title*</label>
                        <input
                          type="text"
                          value={module.weekTitle || ""}
                          onChange={(e) => 
                            handleArrayInputChange(
                              "curriculum",
                              moduleIndex,
                              "weekTitle",
                              e.target.value
                            )
                          }
                          className={baseInputClass}
                          placeholder="e.g., Week 1"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className={baseLabelClass}>Module Title*</label>
                        <input
                          type="text"
                          value={module.title}
                          onChange={(e) => 
                            handleArrayInputChange(
                              "curriculum",
                              moduleIndex,
                              "title",
                              e.target.value
                            )
                          }
                          className={baseInputClass}
                          placeholder="e.g., Introduction to..."
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className={baseLabelClass}>Order</label>
                        <input
                          type="number"
                          value={module.order}
                          onChange={(e) => 
                            handleArrayInputChange(
                              "curriculum",
                              moduleIndex,
                              "order",
                              parseInt(e.target.value)
                            )
                          }
                          className={baseInputClass}
                          min="1"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className={baseLabelClass}>Description</label>
                      <textarea
                        value={module.description}
                        onChange={(e) => 
                          handleArrayInputChange(
                            "curriculum",
                            moduleIndex,
                            "description",
                            e.target.value
                          )
                        }
                        className={`${baseInputClass} h-28`}
                      />
                    </div>
                    
                    {/* Lessons */}
                    <div className="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-center mb-3 border-b border-indigo-100 pb-2">
                        <h4 className="font-medium text-indigo-700">Lessons</h4>
                        <button
                          type="button"
                          onClick={() => 
                            addLessonToModule(moduleIndex)
                          }
                          className="text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add Lesson
                        </button>
                      </div>
                      
                      {module.lessons?.map((lesson: any, lessonIndex: number) => (
                        <div key={lessonIndex} className="bg-white p-4 mb-3 rounded-lg border border-gray-200 shadow-sm">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <label className={baseLabelClass}>Lesson Title*</label>
                              <input
                                type="text"
                                value={lesson.title}
                                onChange={(e) => 
                                  handleLessonChange(moduleIndex, lessonIndex, "title", e.target.value)
                                }
                                className={baseInputClass}
                                required
                              />
                            </div>
                            
                            <div>
                              <label className={baseLabelClass}>Duration (minutes)*</label>
                              <input
                                type="number"
                                value={lesson.duration}
                                onChange={(e) => 
                                  handleLessonChange(moduleIndex, lessonIndex, "duration", parseInt(e.target.value) || 0)
                                }
                                className={baseInputClass}
                                min="0"
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <label className={baseLabelClass}>Lesson Description</label>
                            <textarea
                              value={lesson.description || ""}
                              onChange={(e) => 
                                handleLessonChange(moduleIndex, lessonIndex, "description", e.target.value)
                              }
                              className={`${baseInputClass} h-20`}
                              placeholder="Brief description of the lesson"
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <label className={baseLabelClass}>Content Type</label>
                              <select
                                value={lesson.content_type}
                                onChange={(e) => 
                                  handleLessonChange(moduleIndex, lessonIndex, "content_type", e.target.value)
                                }
                                className={baseSelectClass}
                              >
                                <option value="video">Video</option>
                                <option value="document">Document</option>
                                <option value="quiz">Quiz</option>
                                <option value="assignment">Assignment</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className={baseLabelClass}>Content URL*</label>
                              <input
                                type="text"
                                value={lesson.content_url}
                                onChange={(e) => 
                                  handleLessonChange(moduleIndex, lessonIndex, "content_url", e.target.value)
                                }
                                className={baseInputClass}
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-3 rounded-lg flex items-center mb-3">
                            <input
                              type="checkbox"
                              id={`preview-${moduleIndex}-${lessonIndex}`}
                              checked={lesson.is_preview}
                              onChange={(e) => 
                                handleLessonChange(moduleIndex, lessonIndex, "is_preview", e.target.checked)
                              }
                              className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                            />
                            <label htmlFor={`preview-${moduleIndex}-${lessonIndex}`} className="ml-2 text-sm font-medium text-gray-700">
                              Available for Preview
                            </label>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => removeLessonFromModule(moduleIndex, lessonIndex)}
                            className="text-red-500 text-sm font-medium hover:text-red-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!module.lessons || module.lessons.length <= 1}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove Lesson
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => removeArrayItem("curriculum", moduleIndex)}
                      className="text-red-500 text-sm font-medium hover:text-red-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={formValues.curriculum?.length === 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove Module
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Doubt Session Schedule */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
                <div className="border-b border-indigo-100 pb-3 mb-4">
                  <h3 className="text-lg font-medium text-indigo-800">Doubt Session Schedule</h3>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="frequency" className={baseLabelClass}>
                    Frequency
                  </label>
                  <select
                    id="frequency"
                    {...register('doubt_session_schedule.frequency')}
                    className={baseSelectClass}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="bi-weekly">Bi-Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="on-demand">On-Demand</option>
                  </select>
                </div>
              </div>
              
              {/* Course Features */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
                <div className="border-b border-indigo-100 pb-3 mb-4">
                  <h3 className="text-lg font-medium text-indigo-800">Course Features</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id="is_Quizes"
                        {...register('is_Quizes')}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                      />
                      <label htmlFor="is_Quizes" className="ml-2 font-medium text-gray-700">
                        Includes Quizzes
                      </label>
                    </div>
                    <p className="text-sm text-gray-500">Students will take quizzes to test their knowledge</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id="is_Projects"
                        {...register('is_Projects')}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                      />
                      <label htmlFor="is_Projects" className="ml-2 font-medium text-gray-700">
                        Includes Projects
                      </label>
                    </div>
                    <p className="text-sm text-gray-500">Students will work on practical projects</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id="is_Assignments"
                        {...register('is_Assignments')}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                      />
                      <label htmlFor="is_Assignments" className="ml-2 font-medium text-gray-700">
                        Includes Assignments
                      </label>
                    </div>
                    <p className="text-sm text-gray-500">Students will receive assignments to complete</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id="is_Certification"
                        {...register('is_Certification')}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                      />
                      <label htmlFor="is_Certification" className="ml-2 font-medium text-gray-700">
                        Certification Available
                      </label>
                    </div>
                    <p className="text-sm text-gray-500">Students can earn a certificate upon completion</p>
                  </div>
                </div>
              </div>
              
              {/* Certification */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
                <div className="border-b border-indigo-100 pb-3 mb-4">
                  <h3 className="text-lg font-medium text-indigo-800">Certification</h3>
                </div>
                
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="is_certified"
                    {...register('certification.is_certified')}
                    className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                  />
                  <label htmlFor="is_certified" className="ml-2 font-medium text-gray-700">
                    Offers Certification
                  </label>
                </div>
              </div>
              
              {/* Unified Pricing Section */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="border-b border-indigo-100 pb-3 mb-4">
                  <h3 className="text-lg font-medium text-indigo-900">Pricing (Multi-Currency)</h3>
                </div>
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      // Prevent duplicate currencies
                      const usedCurrencies = (formValues.prices || []).map((p: any) => p.currency);
                      const allCurrencies = ["USD", "INR", "EUR", "GBP", "AUD", "CAD", "SGD", "JPY"];
                      const available = allCurrencies.find(c => !usedCurrencies.includes(c));
                      if (!available) return;
                      
                      const currentPrices = getValues('prices') || [];
                      setValue('prices', [
                        ...currentPrices,
                        {
                          currency: available,
                          individual: 0,
                          batch: 0,
                          min_batch_size: 2,
                          max_batch_size: 10,
                          early_bird_discount: 0,
                          group_discount: 0,
                          is_active: true,
                        },
                      ]);
                    }}
                    className="text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center"
                    disabled={((formValues.prices || []).length || 0) >= 8}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Currency
                  </button>
                </div>
                {(formValues.prices || []).map((price: any, idx: number) => (
                  <div key={idx} className="bg-white p-5 mb-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <label className={baseLabelClass}>Currency</label>
                        <select
                          value={price.currency}
                          onChange={e => {
                            const newCurrency = e.target.value;
                            if ((formValues.prices || []).some((p: any, i: number) => i !== idx && p.currency === newCurrency)) return;
                            const newPrices = [...(formValues.prices || [])];
                            newPrices[idx].currency = newCurrency;
                            setValue('prices', newPrices);
                          }}
                          className={baseSelectClass}
                        >
                          {["USD", "INR", "EUR", "GBP", "AUD", "CAD", "SGD", "JPY"].map(c => (
                            <option 
                              key={c} 
                              value={c} 
                              disabled={(formValues.prices || []).some((p: any, i: number) => i !== idx && p.currency === c)}
                              className={`text-gray-900 ${(formValues.prices || []).some((p: any, i: number) => i !== idx && p.currency === c) ? 'text-gray-400' : ''}`}
                            >
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={baseLabelClass}>Individual Price</label>
                        <input
                          type="number"
                          value={price.individual}
                          min={0}
                          onChange={e => {
                            const newPrices = [...(formValues.prices || [])];
                            newPrices[idx].individual = Number(e.target.value);
                            setValue('prices', newPrices);
                          }}
                          className={baseInputClass}
                        />
                      </div>
                      <div>
                        <label className={baseLabelClass}>Batch Price</label>
                        <input
                          type="number"
                          value={price.batch}
                          min={0}
                          onChange={e => {
                            const newPrices = [...(formValues.prices || [])];
                            newPrices[idx].batch = Number(e.target.value);
                            setValue('prices', newPrices);
                          }}
                          className={baseInputClass}
                        />
                      </div>
                      <div>
                        <label className={baseLabelClass}>Active</label>
                        <input
                          type="checkbox"
                          checked={price.is_active}
                          onChange={e => {
                            const newPrices = [...(formValues.prices || [])];
                            newPrices[idx].is_active = e.target.checked;
                            setValue('prices', newPrices);
                          }}
                          className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className={baseLabelClass}>Min Batch Size</label>
                        <input
                          type="number"
                          value={price.min_batch_size}
                          min={1}
                          onChange={e => {
                            const newPrices = [...(formValues.prices || [])];
                            newPrices[idx].min_batch_size = Number(e.target.value);
                            setValue('prices', newPrices);
                          }}
                          className={baseInputClass}
                        />
                      </div>
                      <div>
                        <label className={baseLabelClass}>Max Batch Size</label>
                        <input
                          type="number"
                          value={price.max_batch_size}
                          min={price.min_batch_size || 1}
                          onChange={e => {
                            const newPrices = [...(formValues.prices || [])];
                            newPrices[idx].max_batch_size = Number(e.target.value);
                            setValue('prices', newPrices);
                          }}
                          className={baseInputClass}
                        />
                      </div>
                      <div>
                        <label className={baseLabelClass}>Early Bird Discount (%)</label>
                        <input
                          type="number"
                          value={price.early_bird_discount}
                          min={0}
                          max={100}
                          onChange={e => {
                            const newPrices = [...(formValues.prices || [])];
                            newPrices[idx].early_bird_discount = Number(e.target.value);
                            setValue('prices', newPrices);
                          }}
                          className={baseInputClass}
                        />
                      </div>
                      <div>
                        <label className={baseLabelClass}>Group Discount (%)</label>
                        <input
                          type="number"
                          value={price.group_discount}
                          min={0}
                          max={100}
                          onChange={e => {
                            const newPrices = [...(formValues.prices || [])];
                            newPrices[idx].group_discount = Number(e.target.value);
                            setValue('prices', newPrices);
                          }}
                          className={baseInputClass}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          const newPrices = [...(formValues.prices || [])];
                          newPrices.splice(idx, 1);
                          setValue('prices', newPrices);
                        }}
                        className="text-red-500 text-sm font-medium hover:text-red-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={(formValues.prices || []).length === 1}
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
                    Create Blended Course
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