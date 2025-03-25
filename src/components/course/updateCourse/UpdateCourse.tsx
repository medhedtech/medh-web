"use client";
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';
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
import { apiUrls } from "@/apis";
import usePostQuery from "@/hooks/postQuery.hook";
import usePutQuery from "@/hooks/putQuery.hook";
import useGetQuery from "@/hooks/getQuery.hook";
import axios from 'axios';

const formSteps = [
  {
    title: 'Overview',
    description: 'Basic course information',
    hash: 'overview',
    requiredFields: ['course_category', 'course_title', 'class_type', 'course_image']
  },
  {
    title: 'Description',
    description: 'Course details and objectives',
    hash: 'description',
    requiredFields: ['course_description.program_overview']
  },
  {
    title: 'Schedule',
    description: 'Duration and sessions',
    hash: 'schedule',
    requiredFields: ['course_duration']
  },
  {
    title: 'Pricing',
    description: 'Course pricing and brochures',
    hash: 'pricing',
    requiredFields: []
  },
  {
    title: 'Curriculum',
    description: 'Course structure',
    hash: 'curriculum',
    requiredFields: []
  },
  {
    title: 'Resources',
    description: 'Additional PDFs and materials',
    hash: 'resources',
    requiredFields: []
  },
  {
    title: 'FAQs',
    description: 'Frequently asked questions',
    hash: 'faqs',
    requiredFields: []
  },
  {
    title: 'Tools',
    description: 'Tools and technologies',
    hash: 'tools',
    requiredFields: []
  },
  {
    title: 'Bonus',
    description: 'Bonus modules and evaluation',
    hash: 'bonus',
    requiredFields: []
  },
  {
    title: 'Related',
    description: 'Related courses and metadata',
    hash: 'related',
    requiredFields: []
  }
];

// Reuse the same schema as AddCourse.tsx
const schema = yup.object().shape({
  course_category: yup.string().required('Course category is required'),
  course_subcategory: yup.string(),
  course_title: yup.string().required('Course title is required'),
  course_subtitle: yup.string(),
  class_type: yup.string(),
  course_level: yup.string(),
  language: yup.string(),
  subtitle_languages: yup.array().of(yup.string()),
  course_image: yup.string().required('Course image is required'),
  assigned_instructor: yup.string().nullable(),
  course_slug: yup.string(),
  unique_key: yup.string(),
  course_description: yup.object().shape({
    program_overview: yup.string().required('Program overview is required'),
    benefits: yup.string(),
    learning_objectives: yup.array().of(yup.string()),
    course_requirements: yup.array().of(yup.string()),
    target_audience: yup.array().of(yup.string())
  }),
  no_of_Sessions: yup.number(),
  course_duration: yup.string().required('Course duration is required'),
  session_duration: yup.string(),
  min_hours_per_week: yup.number(),
  max_hours_per_week: yup.number(),
  efforts_per_Week: yup.string(),
  course_fee: yup.number(),
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
      url: yup.string(),
      file: yup.mixed()
    })
  ),
  curriculum: yup.array().of(
    yup.object().shape({
      id: yup.string(),
      weekTitle: yup.string(),
      weekDescription: yup.string(),
      topics: yup.array().of(yup.string()),
      sections: yup.array().of(
        yup.object().shape({
          id: yup.string(),
          title: yup.string(),
          description: yup.string(),
          order: yup.number(),
          resources: yup.array().of(
            yup.object().shape({
              id: yup.string(),
              title: yup.string(),
              url: yup.string(),
              type: yup.string(),
              description: yup.string()
            })
          ),
          lessons: yup.array().of(
            yup.object().shape({
              id: yup.string(),
              title: yup.string(),
              description: yup.string(),
              order: yup.number(),
              lessonType: yup.string(),
              isPreview: yup.boolean(),
              meta: yup.object(),
              resources: yup.array().of(
                yup.object().shape({
                  id: yup.string(),
                  title: yup.string(),
                  url: yup.string(),
                  type: yup.string(),
                  description: yup.string()
                })
              ),
              video_url: yup.string(),
              duration: yup.string(),
              quiz_id: yup.string(),
              assignment_id: yup.string()
            })
          )
        })
      )
    })
  ),
  resource_pdfs: yup.array().of(
    yup.object().shape({
      title: yup.string(),
      url: yup.string(),
      description: yup.string(),
      size_mb: yup.number(),
      pages: yup.number(),
      upload_date: yup.string()
    })
  ),
  faqs: yup.array().of(
    yup.object().shape({
      question: yup.string(),
      answer: yup.string()
    })
  ),
  tools_technologies: yup.array().of(
    yup.object().shape({
      name: yup.string(),
      category: yup.string(),
      description: yup.string(),
      logo_url: yup.string()
    })
  ),
  bonus_modules: yup.array().of(
    yup.object().shape({
      title: yup.string(),
      description: yup.string(),
      resources: yup.array().of(
        yup.object().shape({
          title: yup.string(),
          type: yup.string(),
          url: yup.string(),
          description: yup.string()
        })
      )
    })
  ),
  meta: yup.object().shape({
    ratings: yup.object().shape({
      average: yup.number(),
      count: yup.number()
    }),
    views: yup.number(),
    enrollments: yup.number(),
    lastUpdated: yup.string()
  }),
  status: yup.string(),
  isFree: yup.boolean(),
  specifications: yup.string().nullable(),
  course_grade: yup.string(),
  course_tag: yup.string(),
  is_Certification: yup.string(),
  is_Assignments: yup.string(),
  is_Projects: yup.string(),
  is_Quizes: yup.string(),
  category_type: yup.string(),
  related_courses: yup.array().of(yup.string())
});

const UpdateCourse: React.FC = () => {
  const router = useRouter();
  const params = useParams<{ courseId: string }>();
  const courseId = params?.courseId;

  const [currentStep, setCurrentStep] = useState(1);
  const [courseImage, setCourseImage] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [isCourseLoaded, setIsCourseLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const { postQuery } = usePostQuery();
  const { putQuery } = usePutQuery();
  const { getQuery } = useGetQuery();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    control,
    reset,
    trigger
  } = useForm<ICourseFormData>({
    resolver: yupResolver(schema) as any,
    mode: 'onChange',
    defaultValues: {
      status: 'draft',
      isFree: false,
      specifications: null,
      course_grade: '',
      resource_pdfs: [],
      tools_technologies: [],
      bonus_modules: [],
      efforts_per_Week: '',
      class_type: '',
      is_Certification: 'Yes',
      is_Assignments: 'Yes',
      is_Projects: 'Yes',
      is_Quizes: 'Yes',
      related_courses: [],
      min_hours_per_week: 0,
      max_hours_per_week: 0,
      category_type: 'Paid',
      brochures: [],
      curriculum: [],
      assigned_instructor: null,
      subtitle_languages: [],
      prices: [],
      faqs: [],
      final_evaluation: {
        final_quizzes: [],
        final_assessments: [],
        certification: null,
        final_faqs: []
      },
      meta: {
        ratings: {
          average: 0,
          count: 0
        },
        views: 0,
        enrollments: 0,
        lastUpdated: new Date().toISOString()
      }
    }
  });

  // Fetch categories when component mounts
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
        
        if (response?.data) {
          let categoriesData = [];
          
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

  // Fetch course data when component mounts
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) {
        toast.error('Course ID is missing');
        router.push('/dashboards/admin-courses');
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const response = await getQuery({
          url: apiUrls.courses.getCourseById(courseId as string),
          onSuccess: () => {},
          onError: () => {
            console.error("Error fetching course data");
            toast.error('Failed to load course data. Please try again.');
            setError('Failed to load course data');
          }
        });

        if (response?.data) {
          const courseData = response.data;
          
          console.log("Fetched course data:", courseData);
          console.log("class_type from API:", courseData.class_type);
          
          // Ensure curriculum data is properly initialized
          if (courseData.curriculum && Array.isArray(courseData.curriculum)) {
            courseData.curriculum = courseData.curriculum.map(week => ({
              ...week,
              liveClasses: week.liveClasses || [],
              lessons: week.lessons || [],
              topics: week.topics || [],
              sections: (week.sections || []).map(section => ({
                ...section,
                lessons: section.lessons || [],
                resources: section.resources || []
              }))
            }));
          } else {
            courseData.curriculum = [];
          }
          
          // Set form data with the course data
          Object.keys(courseData).forEach(key => {
            if (key in schema.fields) {
              setValue(key as any, courseData[key]);
            }
          });

          // Handle nested objects
          if (courseData.course_description) {
            Object.keys(courseData.course_description).forEach(key => {
              setValue(`course_description.${key}` as any, courseData.course_description[key]);
            });
          }
          
          // Explicitly set class_type to ensure it's properly handled
          if (courseData.class_type) {
            console.log("Setting class_type directly:", courseData.class_type);
            setValue('class_type', courseData.class_type);
          }

          // Set course image
          if (courseData.course_image) {
            setCourseImage(courseData.course_image);
          }

          setIsCourseLoaded(true);
          toast.success('Course data loaded successfully');
        } else {
          toast.error('Failed to load course data');
        }
      } catch (error) {
        console.error("Error in fetchCourseData:", error);
        toast.error('Failed to load course data. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, getQuery, setValue, router]);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const stepIndex = formSteps.findIndex(step => step.hash === hash);
    if (stepIndex !== -1) {
      setCurrentStep(stepIndex + 1);
    } else if (!hash) {
      window.location.hash = formSteps[0].hash;
    }
  }, []);

  useEffect(() => {
    window.location.hash = formSteps[currentStep - 1].hash;
  }, [currentStep]);

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
            onSuccess: async (data) => {
              const imageUrl = data?.data;
              setCourseImage(imageUrl);
              setValue('course_image', imageUrl, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true
              });
              await checkStepValidation(currentStep);
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

  const handleStepSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const isValid = await checkStepValidation(currentStep);
      
      if (!isValid) {
        return;
      }

      if (currentStep === formSteps.length) {
        // Get all form values
        const values = watch();

        // Validate all fields before submission
        const isFormValid = await trigger();

        if (!isFormValid) {
          const errorFields = Object.keys(errors);
          setValidationMessage(`Please check the following fields: ${errorFields.join(', ')}`);
          return;
        }

        // Submit the form
        try {
          await onSubmit(values);
        } catch (submitError) {
          console.error('Form submission failed:', submitError);
          return;
        }
      } else {
        nextStep();
      }
    } catch (error) {
      console.error('Error in handleStepSubmit:', error);
      toast.error('An error occurred while submitting the form');
    }
  };

  const onSubmit = async (data: ICourseFormData) => {
    try {
      setIsSubmitting(true);
      setValidationMessage('');

      // Validate required fields first
      if (!data.course_title || !data.course_category || !data.class_type || !data.course_image) {
        const missingFields = [];
        if (!data.course_title) missingFields.push('Course Title');
        if (!data.course_category) missingFields.push('Course Category');
        if (!data.class_type) missingFields.push('Class Type');
        if (!data.course_image) missingFields.push('Course Image');
        
        throw new Error(`Required fields are missing: ${missingFields.join(', ')}`);
      }

      // Format the curriculum data with proper structure
      const formattedCurriculum = data.curriculum?.map(week => ({
        id: week.id,
        weekTitle: week.weekTitle,
        weekDescription: week.weekDescription,
        topics: week.topics || [],
        sections: week.sections?.map(section => ({
          id: section.id,
          title: section.title,
          description: section.description,
          order: section.order,
          resources: section.resources || [],
          lessons: section.lessons?.map(lesson => {
            const baseLesson = {
              id: lesson.id,
              title: lesson.title,
              description: lesson.description,
              order: lesson.order,
              lessonType: lesson.lessonType,
              isPreview: lesson.isPreview || false,
              meta: {
                ...lesson.meta,
                presenter: lesson.meta?.presenter || null,
                transcript: lesson.meta?.transcript || null,
                time_limit: lesson.meta?.time_limit || null,
                passing_score: lesson.meta?.passing_score || null,
                due_date: lesson.meta?.due_date || null,
                max_score: lesson.meta?.max_score || null
              },
              resources: lesson.resources || []
            };

            switch (lesson.lessonType) {
              case 'video':
                return {
                  ...baseLesson,
                  video_url: lesson.video_url,
                  duration: lesson.duration
                };
              case 'quiz':
                return {
                  ...baseLesson,
                  quiz_id: lesson.quiz_id
                };
              case 'assessment':
                return {
                  ...baseLesson,
                  assignment_id: lesson.assignment_id
                };
              default:
                return baseLesson;
            }
          }) || []
        })) || []
      })) || [];

      // Format the course data
      const courseData = {
        status: data.status || 'draft',
        course_title: data.course_title?.trim(),
        course_subtitle: data.course_subtitle?.trim(),
        course_tag: data.course_tag,
        course_category: data.course_category,
        course_subcategory: data.course_subcategory,
        course_level: data.course_level,
        class_type: data.class_type ,
        course_grade: data.course_grade,
        language: data.language || 'English',
        subtitle_languages: data.subtitle_languages || [],
        category_type: data.category_type || 'Paid',
        course_duration: data.course_duration,
        course_fee: Number(data.course_fee) || 0,
        is_Certification: data.is_Certification || 'Yes',
        is_Assignments: data.is_Assignments || 'Yes',
        is_Projects: data.is_Projects || 'Yes',
        is_Quizes: data.is_Quizes || 'Yes',
        course_image: data.course_image,
        assigned_instructor: data.assigned_instructor || null,
        course_description: {
          program_overview: data.course_description?.program_overview?.trim(),
          benefits: data.course_description?.benefits?.trim(),
          learning_objectives: data.course_description?.learning_objectives?.filter(Boolean) || [],
          course_requirements: data.course_description?.course_requirements?.filter(Boolean) || [],
          target_audience: data.course_description?.target_audience?.filter(Boolean) || []
        },
        curriculum: formattedCurriculum,
        resource_pdfs: (data.resource_pdfs || [])?.map(pdf => ({
          title: pdf.title?.trim(),
          url: pdf.url,
          description: pdf.description?.trim(),
          size_mb: Number(pdf.size_mb) || 0,
          pages: Number(pdf.pages) || 0,
          upload_date: pdf.upload_date || new Date().toISOString()
        })),
        tools_technologies: (data.tools_technologies || [])?.map(tool => ({
          name: tool.name?.trim(),
          category: tool.category?.trim(),
          description: tool.description?.trim(),
          logo_url: tool.logo_url
        })),
        bonus_modules: (data.bonus_modules || [])?.map(module => ({
          title: module.title?.trim(),
          description: module.description?.trim(),
          resources: (module.resources || [])?.map(resource => ({
            title: resource.title?.trim(),
            type: resource.type,
            url: resource.url,
            description: resource.description?.trim()
          }))
        })),
        faqs: (data.faqs || [])?.map(faq => ({
          question: faq.question?.trim(),
          answer: faq.answer?.trim()
        })),
        final_evaluation: {
          final_quizzes: data.final_evaluation?.final_quizzes || [],
          final_assessments: data.final_evaluation?.final_assessments || [],
          certification: data.final_evaluation?.certification || null,
          final_faqs: data.final_evaluation?.final_faqs || []
        },
        related_courses: data.related_courses || [],
        brochures: data.brochures || [],
        specifications: data.specifications?.trim() || null,
        efforts_per_Week: data.efforts_per_Week?.trim(),
        min_hours_per_week: Number(data.min_hours_per_week) || 0,
        max_hours_per_week: Number(data.max_hours_per_week) || 0,
        no_of_Sessions: Number(data.no_of_Sessions) || 0,
        session_duration: data.session_duration?.trim(),
        isFree: Boolean(data.isFree),
        prices: data.prices || []
      };

      // Make the API call to update the course
      const response = await putQuery({
        url: apiUrls.courses.updateCourse(courseId as string),
        putData: courseData,
        onSuccess: (response) => {
          toast.success(`Course "${courseData.course_title}" updated successfully!`);
          router.push('/dashboards/admin-courses');
        },
        onError: (error) => {
          const errorMessage = error?.response?.data?.message || 'Failed to update course';
          toast.error(errorMessage);
          setValidationMessage(errorMessage);
          throw new Error(errorMessage);
        },
      });

      if (!response) {
        throw new Error('No response from server');
      }
    } catch (error) {
      console.error("Form submission error:", error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update course';
      toast.error(errorMessage);
      setValidationMessage(errorMessage);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkStepValidation = async (step: number): Promise<boolean> => {
    const currentStepData = formSteps[step - 1];
    if (!currentStepData.requiredFields.length) return true;

    const isValid = await trigger(currentStepData.requiredFields as any);
    if (!isValid) {
      const missingFields = currentStepData.requiredFields
        .filter(field => {
          const error = field.includes('.')
            ? errors[field.split('.')[0] as keyof typeof errors]?.[field.split('.')[1]]
            : errors[field as keyof typeof errors];
          return error;
        })
        .map(field => field.split('.').pop())
        .join(', ');
      
      setValidationMessage(`Please fill in required fields: ${missingFields}`);
      return false;
    }
    
    setValidationMessage('');
    return true;
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

  if (isLoading && !isCourseLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-customGreen"></div>
          <p className="mt-4 text-gray-600">Loading course data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Update Course</h1>
          <p className="text-gray-600">Edit your course details using the form below</p>
        </div>

        <StepProgress
          currentStep={currentStep}
          totalSteps={formSteps.length}
          steps={formSteps}
        />

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleStepSubmit}>
            {renderStep()}

            {validationMessage && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
                {validationMessage}
              </div>
            )}

            <div className="mt-8 flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  Previous
                </button>
              )}
              <button
                type="submit"
                className={`ml-auto px-4 py-2 rounded-md text-sm font-medium ${
                  validationMessage
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-customGreen hover:bg-green-600'
                } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={isSubmitting || !!validationMessage}
                title={validationMessage || (isSubmitting ? 'Processing...' : '')}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </div>
                ) : currentStep < formSteps.length ? (
                  'Next'
                ) : (
                  'Update Course'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateCourse; 