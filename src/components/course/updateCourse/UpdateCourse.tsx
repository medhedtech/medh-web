"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter, useParams } from 'next/navigation';
import { showToast } from '@/utils/toastManager';
import { ICourseFormData, IUpdateCourseData } from '@/types/course.types';
import StepProgress from '@/components/shared/StepProgress';
import CourseOverview from '@/components/course/steps/CourseOverview';
import CourseDescription from '@/components/course/steps/CourseDescription';
import CourseSchedule from '@/components/course/steps/CourseSchedule';
import CoursePricing from '@/components/course/steps/CoursePricing';
import SimpleCurriculum from '@/components/course/steps/SimpleCurriculum';
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
import { storeExternalToken } from '@/utils/auth';
import { apiConfig, endpoints } from '@/config/api';
import { getCourseById } from '@/apis/course/course';

interface CategoryData {
  _id?: string;
  id?: string;
  category_name?: string;
  name?: string;
}

interface FormattedCategory {
  id: string;
  name: string;
}

interface FormattedInstructor {
  id: string;
  name: string;
}

interface CourseDescription {
  program_overview: string;
  benefits: string;
  learning_objectives: string[];
  course_requirements: string[];
  target_audience: string[];
}

interface Tool {
  name: string;
  category: string;
  description: string;
  logo_url: string;
}

interface CourseData {
  course_title: string;
  course_description: CourseDescription;
  assigned_instructor?: string;  // Optional field
  category?: string;  // Optional field
  tools: Tool[];
  // ... other fields ...
}

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
  course_category: yup.string(),
  course_subcategory: yup.string(),
  course_title: yup.string(),
  course_subtitle: yup.string(),
  class_type: yup.string(),
  course_level: yup.string(),
  language: yup.string(),
  subtitle_languages: yup.array().of(yup.string()),
  course_image: yup.string(),
  assigned_instructor: yup.string().nullable(),
  course_slug: yup.string(),
  unique_key: yup.string(),
  course_description: yup.object().shape({
    program_overview: yup.string(),
    benefits: yup.string(),
    learning_objectives: yup.array().of(yup.string()),
    course_requirements: yup.array().of(yup.string()),
    target_audience: yup.array().of(yup.string())
  }),
  no_of_Sessions: yup.number(),
  course_duration: yup.string(),
  session_duration: yup.string(),
  min_hours_per_week: yup.number(),
  max_hours_per_week: yup.number(),
  efforts_per_Week: yup.string(),
  course_fee: yup.number(),
  prices: yup.array().of(
    yup.object().shape({
      currency: yup.string(),
      individual: yup.number(),
      batch: yup.number(),
      min_batch_size: yup.number(),
      max_batch_size: yup.number(),
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
  const [categories, setCategories] = useState<FormattedCategory[]>([]);
  const [instructors, setInstructors] = useState<FormattedInstructor[]>([]);
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
      status: 'Upcoming',
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
        const response = await axios.get(`${apiConfig.apiUrl}/categories`);
        if (response?.data) {
          const categoriesData = response.data;
          let formattedCategories: FormattedCategory[] = [];
          
          if (Array.isArray(categoriesData)) {
            formattedCategories = categoriesData.map(cat => ({
              id: cat._id || cat.id || '',
              name: cat.category_name || cat.name || 'Unnamed Category'
            }));
          } else if (categoriesData.data && Array.isArray(categoriesData.data)) {
            formattedCategories = categoriesData.data.map((cat: CategoryData) => ({
              id: cat._id || cat.id || '',
              name: cat.category_name || cat.name || 'Unnamed Category'
            }));
          }
          
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
  }, []);

  // Fetch instructors when component mounts
  useEffect(() => {
    const fetchInstructors = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${apiConfig.apiUrl}/instructors`);
        if (response?.data) {
          const instructorsData = response.data;
          let formattedInstructors: FormattedInstructor[] = [];
          
          if (Array.isArray(instructorsData)) {
            formattedInstructors = instructorsData.map(instructor => ({
              id: instructor._id || instructor.id || '',
              name: instructor.name || 'Unnamed Instructor'
            }));
          } else if (instructorsData.data && Array.isArray(instructorsData.data)) {
            formattedInstructors = instructorsData.data.map((instructor: any) => ({
              id: instructor._id || instructor.id || '',
              name: instructor.name || 'Unnamed Instructor'
            }));
          }
          
          setInstructors(formattedInstructors);
        }
      } catch (error) {
        console.error('Failed to fetch instructors:', error);
        toast.error('Failed to load instructors');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstructors();
  }, []);

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
          url: getCourseById(courseId as string),
          onSuccess: (response) => {
            console.log('Course data fetched successfully:', response);
          },
          onFail: (error) => {
            console.error("Error fetching course data:", error);
            toast.error('Failed to load course data. Please try again.');
            setError('Failed to load course data');
          }
        });

        if (response?.data) {
          const courseData = response.data;
          
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

          // Set course image
          if (courseData.course_image) {
            setCourseImage(courseData.course_image);
          }

          setIsCourseLoaded(true);
          showToast.success('Course data loaded successfully');
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

  // Update the hash change effect to prevent page reload
  useEffect(() => {
    const handleHashChange = (e: HashChangeEvent) => {
      e.preventDefault();
      const hash = window.location.hash.slice(1);
      const stepIndex = formSteps.findIndex(step => step.hash === hash);
      if (stepIndex !== -1) {
        setCurrentStep(stepIndex + 1);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    
    // Set initial hash if none exists
    if (!window.location.hash) {
      window.location.hash = formSteps[0].hash;
    } else {
      // Handle initial hash
      const hash = window.location.hash.slice(1);
      const stepIndex = formSteps.findIndex(step => step.hash === hash);
      if (stepIndex !== -1) {
        setCurrentStep(stepIndex + 1);
      }
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Update hash without causing reload
  const updateHash = (hash: string) => {
    history.pushState(null, '', `#${hash}`);
    // Manually trigger hashchange event
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  };

  const handleImageUpload = async (file: File) => {
    try {
      if (!file) {
        toast.error('Please select a valid image file');
        return;
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image file (JPEG, PNG, or WebP)');
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 10000 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      // Compress image before uploading
      const compressedFile = await compressImage(file);
      
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onload = async () => {
        const base64 = reader.result?.toString().split(',')[1];
        if (base64) {
          setIsLoading(true);
          try {
            const postData = { base64String: base64, fileType: "image" };
            const response = await postQuery({
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
                showToast.success('Image uploaded successfully');
              },
              onError: (error) => {
                console.error("Image upload error:", error);
                if (error?.response?.status === 413) {
                  toast.error('Image size is too large. Please try a smaller image or compress it further.');
                } else if (error?.message === 'Network Error') {
                  toast.error('Network error. Please check your connection and try again.');
                } else {
                  toast.error(error?.response?.data?.message || 'Image upload failed. Please try again.');
                }
                throw error;
              },
            });
          } catch (error) {
            console.error("API call error:", error);
          } finally {
            setIsLoading(false);
          }
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

  // Add image compression utility
  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Max dimensions
          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1080;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Compress with quality 0.7 (70% of original)
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: file.type,
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Failed to compress image'));
              }
            },
            file.type,
            0.7
          );
        };
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
      };
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
    });
  };

  // Add these functions after the useEffect hooks and before handleStepSubmit
  const saveFormDataToLocalStorage = (data: any) => {
    try {
      localStorage.setItem(`course_form_${courseId}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const loadFormDataFromLocalStorage = () => {
    try {
      const savedData = localStorage.getItem(`course_form_${courseId}`);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        Object.keys(parsedData).forEach(key => {
          setValue(key as any, parsedData[key]);
        });
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  };

  // Load saved form data when component mounts
  useEffect(() => {
    if (courseId && isCourseLoaded) {
      loadFormDataFromLocalStorage();
    }
  }, [courseId, isCourseLoaded]);

  // Store the token from the URL or header if available
  useEffect(() => {
    // Function to parse URL parameters
    const getQueryParam = (name: string): string | null => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(name);
    };

    // Try to get token from URL
    const tokenFromUrl = getQueryParam('token');
    if (tokenFromUrl) {
      storeExternalToken(tokenFromUrl);
    }

    // Check if there's a token passed directly in the request
    const token = getQueryParam('x-access-token') || getQueryParam('access_token');
    if (token) {
      storeExternalToken(token);
    }
    
    // Fix for the course_tag linter error by properly setting it if undefined
    setValue('course_tag', '');
  }, [setValue]);

  // Update the navigation functions to use localStorage
  const handleStepSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = watch();
    
    try {
      const isValid = await checkStepValidation(currentStep);
      
      if (!isValid) {
        return;
      }

      // Save form data to localStorage
      saveFormDataToLocalStorage(formData);

      if (currentStep === formSteps.length) {
        const values = watch();
        const isFormValid = await trigger();

        if (!isFormValid) {
          const errorFields = Object.keys(errors);
          setValidationMessage(`Please check the following fields: ${errorFields.join(', ')}`);
          return;
        }

        try {
          await onSubmit(values);
          // Clear localStorage after successful submission
          localStorage.removeItem(`course_form_${courseId}`);
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

  const onSubmit = async (data: ICourseFormData, event?: React.BaseSyntheticEvent) => {
    try {
      if (event) {
        event.preventDefault();
      }
      
      setIsSubmitting(true);
      setValidationMessage('');

      // Validate required fields first
      if (!data.course_title || !data.course_category || !data.class_type || !data.course_image) {
        const missingFields: string[] = [];
        if (!data.course_title) missingFields.push('Course Title');
        if (!data.course_category) missingFields.push('Course Category');
        if (!data.class_type) missingFields.push('Class Type');
        if (!data.course_image) missingFields.push('Course Image');
        
        throw new Error(`Required fields are missing: ${missingFields.join(', ')}`);
      }

      // Format the course data
      const courseData = {
        status: data.status || 'Draft',
        course_title: data.course_title?.trim() || '',
        course_subtitle: data.course_subtitle?.trim() || '',
        course_tag: data.course_tag?.trim() || '',
        course_category: data.course_category || null,
        course_subcategory: data.course_subcategory || null,
        class_type: data.class_type || 'regular',
        course_grade: data.course_grade || null,
        language: data.language || 'English',
        subtitle_languages: data.subtitle_languages?.filter(Boolean) || [],
        category_type: data.category_type || 'Paid',
        course_image: data.course_image,
        assigned_instructor: data.assigned_instructor || null,
        course_description: data.course_description,
        course_duration: Number(data.course_duration) || 0,
        course_fee: Number(data.course_fee) || 0,
        is_certification: data.is_Certification === 'Yes',
        is_assignments: data.is_Assignments === 'Yes',
        is_projects: data.is_Projects === 'Yes',
        is_quizzes: data.is_Quizes === 'Yes',
        min_hours_per_week: Number(data.min_hours_per_week) || 0,
        max_hours_per_week: Number(data.max_hours_per_week) || 0,
        no_of_sessions: Number(data.no_of_Sessions) || 0,
        session_duration: data.session_duration || null,
        isFree: Boolean(data.isFree),
        specifications: data.specifications || null,
        efforts_per_Week: data.efforts_per_Week || null,
        curriculum: formatCurriculum(data.curriculum || []),
        resource_pdfs: data.resource_pdfs || [],
        tools_technologies: data.tools_technologies || [],
        bonus_modules: data.bonus_modules || [],
        faqs: data.faqs || [],
        meta: {
          ratings: {
            average: Number(data.meta?.ratings?.average) || 0,
            count: Number(data.meta?.ratings?.count) || 0
          },
          views: Number(data.meta?.views) || 0,
          enrollments: Number(data.meta?.enrollments) || 0,
          lastUpdated: new Date().toISOString()
        },
        prices: data.prices || [],
        related_courses: data.related_courses?.filter(Boolean)?.map(id => id || null) || []
      };

      // Make the API call to update the course
      const courseUpdateUrl = `${apiConfig.apiUrl}${endpoints.courses.update(courseId as string)}`;
      
      const response = await putQuery({
        url: courseUpdateUrl,
        putData: courseData,
        requireAuth: true,
        debug: true,
        onSuccess: (response) => {
          console.log('API Success Response:', response);
          showToast.success(`Course "${courseData.course_title}" updated successfully!`);
          router.push('/dashboards/admin-courses');
        },
        onFail: (error) => {
          console.error('API Error:', error);
          const errorMessage = error?.response?.data?.message || 'Failed to update course';
          toast.error(errorMessage);
          setValidationMessage(errorMessage);
          throw error;
        },
      });

      if (!response) {
        throw new Error('No response from server');
      }

      return response;
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

  // Helper function to format a lesson
  const formatLesson = (lesson: any, isDirect = false) => {
    const baseLesson = {
      id: lesson.id || `lesson_${isDirect ? 'direct_' : ''}${crypto.randomUUID()}`,
      title: lesson.title?.trim() || '',
      description: lesson.description?.trim() || '',
      order: lesson.order || 0,
      lessonType: lesson.lessonType || 'video',
      isPreview: lesson.isPreview || false,
      meta: {
        presenter: lesson.meta?.presenter || null,
        transcript: lesson.meta?.transcript || null,
        time_limit: lesson.meta?.time_limit || null,
        passing_score: lesson.meta?.passing_score || null,
        due_date: lesson.meta?.due_date || null,
        max_score: lesson.meta?.max_score || null
      },
      resources: (lesson.resources || []).map((resource: any) => ({
        id: resource.id || crypto.randomUUID(),
        title: resource.title?.trim() || '',
        url: resource.url || '',
        type: resource.type || '',
        description: resource.description?.trim() || ''
      }))
    };

    switch (lesson.lessonType) {
      case 'video':
        return {
          ...baseLesson,
          video_url: lesson.video_url?.trim() || '',
          duration: lesson.duration?.trim() || ''
        };
      case 'quiz':
        return {
          ...baseLesson,
          quiz_id: lesson.quiz_id || ''
        };
      case 'assessment':
        return {
          ...baseLesson,
          assignment_id: lesson.assignment_id || ''
        };
      default:
        return baseLesson;
    }
  };

  // Helper function to format curriculum data
  const formatCurriculum = (curriculum: any[] = []) => {
    return curriculum.map(week => {
      // Filter out invalid lessons from sections
      const validSections = (week.sections || []).map((section: any) => ({
        id: section.id || crypto.randomUUID(),
        title: section.title?.trim() || '',
        description: section.description?.trim() || '',
        order: section.order || 0,
        resources: (section.resources || []).map((resource: any) => ({
          id: resource.id || crypto.randomUUID(),
          title: resource.title?.trim() || '',
          url: resource.url || '',
          type: resource.type || '',
          description: resource.description?.trim() || ''
        })),
        lessons: (section.lessons || [])
          .filter((lesson: any) => {
            if (!lesson.title?.trim()) return false;
            if (lesson.lessonType === 'video' && !lesson.video_url?.trim()) return false;
            return true;
          })
          .map((lesson: any) => formatLesson(lesson))
      }));

      // Filter out sections with no valid lessons
      const filteredSections = validSections.filter(section => section.lessons.length > 0);

      // Filter out invalid direct lessons
      const validDirectLessons = (week.lessons || [])
        .filter((lesson: any) => {
          if (!lesson.title?.trim()) return false;
          if (lesson.lessonType === 'video' && !lesson.video_url?.trim()) return false;
          return true;
        })
        .map((lesson: any) => formatLesson(lesson, true));

      return {
        id: week.id || crypto.randomUUID(),
        weekTitle: week.weekTitle?.trim() || '',
        weekDescription: week.weekDescription?.trim() || '',
        topics: (week.topics || []).filter(Boolean).map((topic: string) => topic.trim()),
        sections: filteredSections,
        lessons: validDirectLessons,
        liveClasses: (week.liveClasses || []).map((liveClass: any) => ({
          title: liveClass.title?.trim() || '',
          description: liveClass.description?.trim() || '',
          scheduledDate: liveClass.scheduledDate || new Date().toISOString(),
          duration: Number(liveClass.duration) || 0,
          meetingLink: liveClass.meetingLink?.trim() || '',
          instructor: liveClass.instructor?.trim() || null,
          recordingUrl: liveClass.recordingUrl?.trim() || '',
          isRecorded: Boolean(liveClass.isRecorded),
          materials: (liveClass.materials || []).map((material: any) => ({
            title: material.title?.trim() || '',
            url: material.url || '',
            type: material.type || 'document',
            description: material.description?.trim() || ''
          }))
        }))
      };
    }).filter(week => {
      // Filter out weeks with no valid sections or direct lessons
      return (week.sections && week.sections.length > 0) || (week.lessons && week.lessons.length > 0);
    });
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
          <SimpleCurriculum
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

  const nextStep = async () => {
    const formData = watch();
    saveFormDataToLocalStorage(formData);
    
    if (currentStep < formSteps.length) {
      updateHash(formSteps[currentStep].hash);
    }
  };

  const prevStep = async () => {
    const formData = watch();
    saveFormDataToLocalStorage(formData);
    
    if (currentStep > 1) {
      updateHash(formSteps[currentStep - 2].hash);
    }
  };

  const handleStepClick = async (stepIndex: number) => {
    const formData = watch();
    
    const isCurrentStepValid = await checkStepValidation(currentStep);
    if (!isCurrentStepValid) {
      toast.warning('Please complete the current step before navigating');
      return;
    }

    saveFormDataToLocalStorage(formData);
    updateHash(formSteps[stepIndex - 1].hash);
  };

  const isStepClickable = (stepIndex: number) => {
    // Allow clicking on completed steps or the next available step
    return stepIndex <= currentStep;
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Update Course</h1>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <form 
            onSubmit={handleSubmit(
              (data) => onSubmit(data),
              (errors) => {
                console.error('Form validation errors:', errors);
                const errorFields = Object.keys(errors);
                setValidationMessage(`Please check the following fields: ${errorFields.join(', ')}`);
              }
            )} 
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-6">
              {renderStep()}
            </div>

            {validationMessage && (
              <div className="mt-4 text-red-600">
                {validationMessage}
              </div>
            )}

            <div className="mt-6 flex justify-end space-x-4">
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                disabled={currentStep === 1}
              >
                Previous
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                disabled={currentStep === formSteps.length}
              >
                Next
              </button>
              {currentStep === formSteps.length && (
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Course'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateCourse;