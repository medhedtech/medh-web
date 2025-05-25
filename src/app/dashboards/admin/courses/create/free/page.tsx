"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import BaseCourseForm, { BaseCourseFormData } from "@/components/forms/BaseCourseForm";
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

type FreeCourseData = {
  course_title: string;
  course_category: string;
  course_image: string;
  course_description: {
    program_overview: string;
    benefits: string;
  };
  course_duration: string;
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
  is_Certification: boolean;
  is_Quizes: boolean;
  is_Projects: boolean;
  is_Assignments: boolean;
  course_type: string;
  status: string;
  show_in_home: boolean;
};

// Validation schema
const schema = yup.object().shape({
  course_title: yup.string().required('Course title is required'),
  course_category: yup.string().required('Course category is required'),
  course_image: yup.string().required('Course image is required'),
  course_description: yup.object().shape({
    program_overview: yup.string().required('Program overview is required'),
  }),
  course_duration: yup.string().required('Course duration is required'),
  class_type: yup.string().required('Class type is required'),
  no_of_Sessions: yup.number().required('Number of sessions is required'),
  curriculum: yup.array().of(
    yup.object().shape({
      id: yup.string().required('Curriculum ID is required'),
      weekTitle: yup.string().required('Week title is required'),
      title: yup.string().required('Curriculum title is required'),
      description: yup.string().required('Curriculum description is required'),
      order: yup.number().required('Curriculum order is required'),
      lessons: yup.array().of(
        yup.object().shape({
          title: yup.string().required('Lesson title is required'),
          description: yup.string().required('Lesson description is required'),
          duration: yup.number().required('Lesson duration is required'),
          content_type: yup.string().required('Lesson content type is required'),
          content_url: yup.string().required('Lesson content URL is required'),
          is_preview: yup.boolean().required('Lesson preview status is required'),
          order: yup.number().required('Lesson order is required'),
        })
      ),
    })
  ),
  is_Certification: yup.boolean().required('Certification status is required'),
  is_Quizes: yup.boolean().required('Quiz status is required'),
  is_Projects: yup.boolean().required('Project status is required'),
  is_Assignments: yup.boolean().required('Assignment status is required'),
  course_type: yup.string().required('Course type is required'),
  status: yup.string().required('Course status is required'),
  show_in_home: yup.boolean().required('Show in home status is required'),
});

export default function CreateFreeCourse() {
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
  } = useForm<FreeCourseData>({
    resolver: yupResolver(schema) as any,
    mode: 'onChange',
    defaultValues: {
      course_type: "free",
      course_duration: "",
      no_of_Sessions: 0,
      is_Certification: false,
      is_Quizes: false,
      is_Projects: false,
      is_Assignments: false,
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
          // Handle different possible response structures
          let categoriesData: CategoryItem[] = [];
          
          if (Array.isArray(response.data)) {
            categoriesData = response.data;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            categoriesData = response.data.data;
          } else if (response.data.success && Array.isArray(response.data.data)) {
            categoriesData = response.data.data;
          }
          
          // Filter out any invalid items and map to the expected format
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

  const handleArrayInputChange = (arrayName: string, index: number, field: string, value: any) => {
    const currentValues = getValues();
    const newArray = [...(currentValues[arrayName as keyof FreeCourseData] as any[])];
    
    if (field) {
      newArray[index] = { ...newArray[index], [field]: value };
    } else {
      newArray[index] = value;
    }
    
    setValue(arrayName as any, newArray);
  };

  const handleStringArrayChange = (arrayName: string, index: number, value: string) => {
    const currentValues = getValues();
    const newArray = [...(currentValues[arrayName as keyof FreeCourseData] as string[])];
    newArray[index] = value;
    setValue(arrayName as any, newArray);
  };

  const addArrayItem = (arrayName: string, template: any) => {
    const currentValues = getValues();
    const newArray = [...(currentValues[arrayName as keyof FreeCourseData] as any[]), template];
    setValue(arrayName as any, newArray);
  };

  const removeArrayItem = (arrayName: string, index: number) => {
    const currentValues = getValues();
    const newArray = [...(currentValues[arrayName as keyof FreeCourseData] as any[])];
    newArray.splice(index, 1);
    setValue(arrayName as any, newArray);
  };

  const onSubmit = async (data: FreeCourseData) => {
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
            <h1 className="text-2xl font-bold text-white">Create Free Course</h1>
            <p className="mt-1 text-indigo-100">
              Create a new free course with open access content
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
                  <label htmlFor="course_title" className="block mb-2 font-medium text-gray-700">
                    Course Title*
                  </label>
                  <input
                    type="text"
                    id="course_title"
                    {...register('course_title')}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    required
                  />
                  {errors.course_title && (
                    <p className="mt-1 text-sm text-red-600">{errors.course_title.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="course_category" className="block mb-2 font-medium text-gray-700">
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
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
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
                <label className="block mb-2 font-medium text-gray-700">
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
                <label htmlFor="program_overview" className="block mb-2 font-medium text-gray-700">
                  Program Overview*
                </label>
                <textarea
                  id="program_overview"
                  {...register('course_description.program_overview')}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all h-28"
                  required
                />
                {errors.course_description?.program_overview && (
                  <p className="mt-1 text-sm text-red-600">{errors.course_description.program_overview.message}</p>
                )}
              </div>
            </div>

            {/* Free Course Specific Fields */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="border-b border-indigo-100 pb-4 mb-6">
                <h2 className="text-xl font-semibold text-indigo-800">Free Course Details</h2>
              </div>
              
              <div className="mb-6">
                <label htmlFor="course_duration" className="block mb-2 font-medium text-gray-700">
                  Course Duration*
                </label>
                <input
                  type="text"
                  id="course_duration"
                  {...register('course_duration')}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="e.g., 2 hours"
                  required
                />
                {errors.course_duration && (
                  <p className="mt-1 text-sm text-red-600">{errors.course_duration.message}</p>
                )}
              </div>
              
              {/* Class Type */}
              <div className="mb-6">
                <label htmlFor="class_type" className="block mb-2 font-medium text-gray-700">
                  Class Type*
                </label>
                <input
                  type="text"
                  id="class_type"
                  {...register('class_type')}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  required
                />
                {errors.class_type && (
                  <p className="mt-1 text-sm text-red-600">{errors.class_type.message}</p>
                )}
              </div>
              
              {/* Number of Sessions */}
              <div className="mb-6">
                <label htmlFor="no_of_Sessions" className="block mb-2 font-medium text-gray-700">
                  Number of Sessions*
                </label>
                <input
                  type="number"
                  id="no_of_Sessions"
                  {...register('no_of_Sessions')}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  min="0"
                  required
                />
                {errors.no_of_Sessions && (
                  <p className="mt-1 text-sm text-red-600">{errors.no_of_Sessions.message}</p>
                )}
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
                        order: 0,
                        lessons: [
                          {
                            title: "",
                            description: "",
                            duration: 0,
                            content_type: "video",
                            content_url: "",
                            is_preview: true,
                            order: 1,
                          },
                        ],
                      })
                    }
                    className="text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Curriculum
                  </button>
                </div>
                
                {formValues.curriculum?.map((curriculum: any, curriculumIndex: number) => (
                  <div key={curriculumIndex} className="bg-white p-5 mb-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">Curriculum ID</label>
                        <input
                          type="text"
                          value={curriculum.id}
                          onChange={(e) => 
                            handleArrayInputChange(
                              "curriculum",
                              curriculumIndex,
                              "id",
                              e.target.value
                            )
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">Week Title</label>
                        <input
                          type="text"
                          value={curriculum.weekTitle}
                          onChange={(e) => 
                            handleArrayInputChange(
                              "curriculum",
                              curriculumIndex,
                              "weekTitle",
                              e.target.value
                            )
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block mb-2 font-medium text-gray-700">Curriculum Title</label>
                      <input
                        type="text"
                        value={curriculum.title}
                        onChange={(e) => 
                          handleArrayInputChange(
                            "curriculum",
                            curriculumIndex,
                            "title",
                            e.target.value
                          )
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block mb-2 font-medium text-gray-700">Curriculum Description</label>
                      <textarea
                        value={curriculum.description}
                        onChange={(e) => 
                          handleArrayInputChange(
                            "curriculum",
                            curriculumIndex,
                            "description",
                            e.target.value
                          )
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all h-28"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">Curriculum Order</label>
                        <input
                          type="number"
                          value={curriculum.order}
                          onChange={(e) => 
                            handleArrayInputChange(
                              "curriculum",
                              curriculumIndex,
                              "order",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          min="0"
                        />
                      </div>
                      
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">Lessons</label>
                        <button
                          type="button"
                          onClick={() => 
                            addArrayItem("curriculum", {
                              id: "",
                              weekTitle: "",
                              title: "",
                              description: "",
                              order: 0,
                              lessons: [
                                {
                                  title: "",
                                  description: "",
                                  duration: 0,
                                  content_type: "video",
                                  content_url: "",
                                  is_preview: true,
                                  order: 1,
                                },
                              ],
                            })
                          }
                          className="text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add Lesson
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg flex items-center mb-4">
                      <input
                        type="checkbox"
                        id={`is_Certification-${curriculumIndex}`}
                        checked={curriculum.is_Certification}
                        onChange={(e) => 
                          handleArrayInputChange(
                            "curriculum",
                            curriculumIndex,
                            "is_Certification",
                            e.target.checked
                          )
                        }
                        className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor={`is_Certification-${curriculumIndex}`} className="ml-2 font-medium text-gray-700">
                        Offers Completion Certificate
                      </label>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => removeArrayItem("curriculum", curriculumIndex)}
                      className="text-red-500 text-sm font-medium hover:text-red-700 flex items-center"
                      disabled={formValues.curriculum?.length === 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove Curriculum
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Certification, Quizzes, Projects, and Assignments */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="is_Certification"
                    {...register('is_Certification')}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="is_Certification" className="ml-2 font-medium text-gray-700">
                    Offers Completion Certificate
                  </label>
                </div>
                
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="is_Quizes"
                    {...register('is_Quizes')}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="is_Quizes" className="ml-2 font-medium text-gray-700">
                    Offers Quizzes
                  </label>
                </div>
                
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="is_Projects"
                    {...register('is_Projects')}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="is_Projects" className="ml-2 font-medium text-gray-700">
                    Offers Projects
                  </label>
                </div>
                
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="is_Assignments"
                    {...register('is_Assignments')}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="is_Assignments" className="ml-2 font-medium text-gray-700">
                    Offers Assignments
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
                    Create Free Course
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