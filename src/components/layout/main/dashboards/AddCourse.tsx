"use client";
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ICourseFormData } from '@/types/course.types';
import StepProgress from '@/components/shared/StepProgress';
import CourseOverview from '@/components/course/steps/CourseOverview';
import CourseDescription from '@/components/course/steps/CourseDescription';
import CourseSchedule from '@/components/course/steps/CourseSchedule';
import CoursePricing from '@/components/course/steps/CoursePricing';
import CourseCurriculum from '@/components/course/steps/CourseCurriculum';
import FAQSection from '@/components/course/steps/FAQSection';
import ResourcePDFs from '@/components/course/steps/ResourcePDFs';
import ToolsTechnologies from '@/components/course/steps/ToolsTechnologies';
import BonusModules from '@/components/course/steps/BonusModules';
import RelatedCourses from '@/components/course/steps/RelatedCourses';
import { toast } from 'react-toastify';
import { apiUrls } from "@/apis";
import usePostQuery from "@/hooks/postQuery.hook";
import useGetQuery from "@/hooks/getQuery.hook";

const formSteps = [
  {
    title: 'Overview',
    description: 'Basic course information'
  },
  {
    title: 'Description',
    description: 'Course details and objectives'
  },
  {
    title: 'Schedule',
    description: 'Duration and sessions'
  },
  {
    title: 'Pricing',
    description: 'Course pricing and brochures'
  },
  {
    title: 'Curriculum',
    description: 'Course structure'
  },
  {
    title: 'Resources',
    description: 'Additional PDFs and materials'
  },
  {
    title: 'FAQs',
    description: 'Frequently asked questions'
  },
  {
    title: 'Tools',
    description: 'Tools and technologies'
  },
  {
    title: 'Bonus',
    description: 'Bonus modules and evaluation'
  },
  {
    title: 'Related',
    description: 'Related courses and metadata'
  }
];

const schema = yup.object().shape({
  course_category: yup.string().required('Course category is required'),
  course_subcategory: yup.string().required('Course subcategory is required'),
  course_title: yup.string().required('Course title is required'),
  course_subtitle: yup.string().required('Course subtitle is required'),
  course_tag: yup.string().required('Course tag is required'),
  course_level: yup.string().required('Course level is required'),
  language: yup.string().required('Language is required'),
  subtitle_languages: yup.array().of(yup.string()),
  course_image: yup.string().required('Course image is required'),
  // assigned_instructor: yup.string().required('Assigned instructor is required'),
  course_slug: yup.string(),
  course_description: yup.object().shape({
    program_overview: yup.string().required('Program overview is required'),
    benefits: yup.string().required('Benefits are required'),
    learning_objectives: yup.array().of(yup.string()).required('Learning objectives are required'),
    course_requirements: yup.array().of(yup.string()).required('Course requirements are required'),
    target_audience: yup.array().of(yup.string()).required('Target audience is required')
  }),
  no_of_Sessions: yup.number().required('Number of sessions is required'),
  course_duration: yup.string().required('Course duration is required'),
  session_duration: yup.string().required('Session duration is required'),
  min_hours_per_week: yup.number().required('Minimum hours per week is required'),
  max_hours_per_week: yup.number().required('Maximum hours per week is required'),
  efforts_per_Week: yup.string(),
  course_fee: yup.number().required('Course fee is required'),
  prices: yup.array().of(
    yup.object().shape({
      currency: yup.string().required('Currency is required'),
      individual: yup.number().required('Individual price is required'),
      batch: yup.number().required('Batch price is required'),
      min_batch_size: yup.number().required('Minimum batch size is required'),
      max_batch_size: yup.number().required('Maximum batch size is required'),
      early_bird_discount: yup.number(),
      group_discount: yup.number(),
      is_active: yup.boolean()
    })
  ),
  brochures: yup.array().of(
    yup.object().shape({
      url: yup.string().required('Brochure URL is required'),
      file: yup.mixed()
    })
  ),
  curriculum: yup.array().of(
    yup.object().shape({
      _id: yup.string(),
      id: yup.string(),
      weekTitle: yup.string().required('Week title is required'),
      weekDescription: yup.string().required('Week description is required'),
      topics: yup.array().of(yup.string()),
      sections: yup.array().of(
        yup.object().shape({
          _id: yup.string(),
          id: yup.string(),
          title: yup.string().required('Section title is required'),
          description: yup.string(),
          order: yup.number(),
          lessons: yup.array().of(
            yup.object().shape({
              _id: yup.string(),
              id: yup.string(),
              title: yup.string().required('Lesson title is required'),
              description: yup.string(),
              content: yup.string(),
              videoUrl: yup.string(),
              duration: yup.string().required('Lesson duration is required'),
              order: yup.number(),
              isPreview: yup.boolean(),
              linkedContent: yup.string(),
              linkedContentType: yup.string(),
              meta: yup.object().shape({
                presenter: yup.string(),
                transcript: yup.string()
              }),
              resources: yup.array().of(
                yup.object().shape({
                  id: yup.string(),
                  title: yup.string().required('Resource title is required'),
                  url: yup.string().required('Resource URL is required'),
                  type: yup.string().required('Resource type is required'),
                  description: yup.string()
                })
              )
            })
          )
        })
      )
    })
  ),
  resource_pdfs: yup.array().of(
    yup.object().shape({
      title: yup.string().required('Title is required'),
      url: yup.string().required('URL is required'),
      description: yup.string(),
      size_mb: yup.number(),
      pages: yup.number(),
      upload_date: yup.string()
    })
  ),
  faqs: yup.array().of(
    yup.object().shape({
      question: yup.string().required('Question is required'),
      answer: yup.string().required('Answer is required')
    })
  ),
  tools_technologies: yup.array().of(
    yup.object().shape({
      name: yup.string().required('Tool name is required'),
      category: yup.string().required('Tool category is required'),
      description: yup.string(),
      logo_url: yup.string()
    })
  ),
  bonus_modules: yup.array().of(
    yup.object().shape({
      title: yup.string().required('Title is required'),
      description: yup.string().required('Description is required'),
      resources: yup.array().of(
        yup.object().shape({
          title: yup.string().required('Resource title is required'),
          type: yup.string().required('Resource type is required'),
          url: yup.string().required('Resource URL is required'),
          description: yup.string()
        })
      )
    })
  ),
  final_quizzes: yup.array().of(yup.string()),
  final_assessments: yup.array().of(yup.string()),
  certification: yup.string(),
  related_courses: yup.array().of(yup.string()),
  metadata: yup.object().shape({
    views: yup.number(),
    ratings: yup.number(),
    enrollments: yup.number(),
    last_updated: yup.string()
  }),
  status: yup.string().default('draft'),
  isFree: yup.boolean().default(false),
  specifications: yup.string(),
  course_grade: yup.string(),
  class_type: yup.string(),
  is_Certification: yup.string(),
  is_Assignments: yup.string(),
  is_Projects: yup.string(),
  is_Quizes: yup.string(),
  category_type: yup.string()
});

const AddCourse = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [courseImage, setCourseImage] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { postQuery } = usePostQuery();
  const { getQuery } = useGetQuery();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    control
  } = useForm<ICourseFormData>({
    resolver: yupResolver(schema) as any,
    mode: 'onChange',
    defaultValues: {
      status: 'draft',
      isFree: false,
      specifications: '',
      course_grade: '',
      resource_pdfs: [],
      tools_technologies: [],
      bonus_modules: [],
      efforts_per_Week: '',
      class_type: '',
      is_Certification: '',
      is_Assignments: '',
      is_Projects: '',
      is_Quizes: '',
      related_courses: [],
      min_hours_per_week: 0,
      max_hours_per_week: 0,
      category_type: '',
      brochures: [],
      curriculum: []
    }
  });

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await getQuery({
          url: apiUrls.categories.getAllCategories,
          onSuccess: () => {},
          onError: () => {
            console.error("Error fetching categories");
            toast.error('Failed to load categories. Please try again.');
          }
        });
        
        console.log("Categories API response:", JSON.stringify(response, null, 2));
        
        if (response?.data) {
          // Handle different possible response structures
          // The API might return data in different formats:
          // 1. response.data (direct array)
          // 2. response.data.data (nested array)
          // 3. response.data with success and data properties
          let categoriesData = [];
          
          if (Array.isArray(response.data)) {
            categoriesData = response.data;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            categoriesData = response.data.data;
          } else if (response.data.success && Array.isArray(response.data.data)) {
            categoriesData = response.data.data;
          }
          
          console.log("Raw categories data:", JSON.stringify(categoriesData, null, 2));
          
          // Filter out any invalid items and map to the expected format
          const formattedCategories = categoriesData
            .filter(cat => cat && (cat._id || cat.id) && (cat.category_name || cat.name)) // Ensure valid data
            .map(cat => ({
              id: cat._id || cat.id || '',
              name: cat.category_name || cat.name || 'Unnamed Category'
            }));
          
          console.log("Formatted categories:", formattedCategories);
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
            onSuccess: (data) => {
              setCourseImage(data?.data);
              setValue('course_image', data?.data);
              toast.success('Image uploaded successfully');
            },
            onError: (error) => {
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

  const onSubmit = async (data: ICourseFormData) => {
    try {
      setIsSubmitting(true);
      await postQuery({
        url: apiUrls?.courses?.createCourse,
        postData: data,
        onSuccess: (response) => {
          toast.success(`Course "${data.course_title}" created successfully!`);
          // Redirect or handle success
        },
        onError: (error) => {
          console.error("Course creation error:", error);
          toast.error(error?.response?.data?.message || 'Failed to create course. Please check your inputs.');
        },
      });
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast.error('Failed to create course. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    const formState = {
      errors,
      isDirty: false,
      isLoading,
      isSubmitted: false,
      isSubmitSuccessful: false,
      isSubmitting,
      isValid: false,
      isValidating: false,
      submitCount: 0,
      dirtyFields: {},
      touchedFields: {},
      defaultValues: {},
      disabled: false,
      validatingFields: {}
    };

    switch (currentStep) {
      case 1:
        return (
          <CourseOverview
            register={register}
            setValue={setValue}
            formState={formState}
            categories={categories}
            onImageUpload={handleImageUpload}
            courseImage={courseImage}
            control={control}
          />
        );
      case 2:
        return (
          <CourseDescription
            register={register}
            setValue={setValue}
            formState={formState}
            watch={watch}
          />
        );
      case 3:
        return (
          <CourseSchedule
            register={register}
            setValue={setValue}
            formState={formState}
          />
        );
      case 4:
        return (
          <CoursePricing
            register={register}
            setValue={setValue}
            formState={formState}
            watch={watch}
          />
        );
      case 5:
        return (
          <CourseCurriculum
            register={register}
            setValue={setValue}
            formState={formState}
            watch={watch}
          />
        );
      case 6:
        return (
          <ResourcePDFs
            register={register}
            setValue={setValue}
            formState={formState}
            watch={watch}
          />
        );
      case 7:
        return (
          <FAQSection
            register={register}
            setValue={setValue}
            formState={formState}
            watch={watch}
          />
        );
      case 8:
        return (
          <ToolsTechnologies
            register={register}
            setValue={setValue}
            formState={formState}
            watch={watch}
          />
        );
      case 9:
        return (
          <BonusModules
            register={register}
            setValue={setValue}
            formState={formState}
            watch={watch}
          />
        );
      case 10:
        return (
          <RelatedCourses
            register={register}
            setValue={setValue}
            formState={formState}
            watch={watch}
          />
        );
      default:
        return null;
    }
  };

  const nextStep = () => {
    if (currentStep < formSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StepProgress
          currentStep={currentStep}
          totalSteps={formSteps.length}
          steps={formSteps}
        />

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          {isLoading && currentStep === 1 && (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-customGreen"></div>
              <p className="ml-3 text-gray-600">Loading categories...</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStep()}

            <div className="mt-8 flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Previous
                </button>
              )}
              {currentStep < formSteps.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto px-4 py-2 bg-customGreen text-white rounded-md text-sm font-medium hover:bg-green-600 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="ml-auto px-4 py-2 bg-customGreen text-white rounded-md text-sm font-medium hover:bg-green-600 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Submit'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCourse; 