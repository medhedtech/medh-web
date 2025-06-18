"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { showToast } from '@/utils/toastManager';
import Link from "next/link";
import { debounce } from 'lodash';
import { ArrowLeft, Plus, Trash2, Upload, Save, Eye, CheckCircle, AlertCircle, AlertTriangle, Clock, BookOpen, Users, Award, DollarSign, Calendar, HelpCircle, Settings } from "lucide-react";
import { courseTypesAPI } from "@/apis/courses";
import { apiUrls } from "@/apis";
import usePostQuery from "@/hooks/postQuery.hook";
import useGetQuery from "@/hooks/getQuery.hook";
import type { IBlendedCourse, IUnifiedPrice, IBlendedCurriculumSection, IBlendedCourseLesson, IToolTechnology, IFAQ } from "@/apis/courses";

// Comprehensive form validation schema
const blendedCourseSchema = yup.object().shape({
  course_title: yup.string().required('Course title is required').min(5, 'Title must be at least 5 characters'),
  course_subtitle: yup.string(),
  course_category: yup.string().required('Course category is required'),
  course_subcategory: yup.string(),
  course_tag: yup.string(),
  course_level: yup.string().required('Course level is required'),
  course_image: yup.string().required('Course image is required'),
  course_description: yup.object().shape({
    program_overview: yup.string().required('Program overview is required').min(50, 'Overview must be at least 50 characters'),
    benefits: yup.string().required('Benefits are required').min(30, 'Benefits must be at least 30 characters'),
    learning_objectives: yup.array().of(yup.string()),
    course_requirements: yup.array().of(yup.string()),
    target_audience: yup.array().of(yup.string())
  }),
  course_duration: yup.string().required('Course duration is required'),
  session_duration: yup.string().required('Session duration is required'),
  prices: yup.array().of(
    yup.object().shape({
      currency: yup.string().required('Currency is required'),
      individual: yup.number().required('Individual price is required').min(0, 'Price cannot be negative'),
      batch: yup.number().required('Batch price is required').min(0, 'Price cannot be negative'),
      min_batch_size: yup.number().required('Minimum batch size is required').min(2, 'Minimum batch size must be at least 2'),
      max_batch_size: yup.number().required('Maximum batch size is required').min(2, 'Maximum batch size must be at least 2')
        .test('max-greater-than-min', 'Maximum batch size must be greater than minimum', function(max) {
          const min = this.parent.min_batch_size;
          return !min || !max || max >= min;
        }),
      early_bird_discount: yup.number().min(0).max(100),
      group_discount: yup.number().min(0).max(100),
      is_active: yup.boolean()
    })
  ),
  curriculum: yup.array().of(
    yup.object().shape({
      title: yup.string().required('Section title is required'),
      weekTitle: yup.string().required('Week title is required'),
      description: yup.string(),
      order: yup.number().required('Section order is required').min(1),
      lessons: yup.array().of(
        yup.object().shape({
          title: yup.string().required('Lesson title is required'),
          description: yup.string(),
          content_type: yup.string().required('Content type is required'),
          content_url: yup.string().when('content_type', {
            is: (val: string) => val === 'video' || val === 'text',
            then: (schema) => schema.required('Content URL is required'),
            otherwise: (schema) => schema
          }),
          duration: yup.number().when('content_type', {
            is: 'video',
            then: (schema) => schema.required('Duration is required for video lessons').min(1),
            otherwise: (schema) => schema
          }),
          order: yup.number().required('Lesson order is required').min(1)
        })
      )
    })
  ).min(1, 'At least one curriculum section is required'),
  doubt_session_schedule: yup.object().shape({
    frequency: yup.string(),
    preferred_days: yup.array().of(yup.string()),
    preferred_time_slots: yup.array().of(
      yup.object().shape({
        start_time: yup.string(),
        end_time: yup.string(),
        timezone: yup.string()
      })
    )
  }),
  tools_technologies: yup.array().of(
    yup.object().shape({
      name: yup.string().required('Tool name is required'),
      category: yup.string(),
      description: yup.string(),
      logo_url: yup.string()
    })
  ),
  faqs: yup.array().of(
    yup.object().shape({
      question: yup.string().required('Question is required'),
      answer: yup.string().required('Answer is required')
    })
  ),
  instructors: yup.array().of(yup.string()),
  prerequisites: yup.array().of(yup.string()),
  certification: yup.object().shape({
    is_certified: yup.boolean(),
    certification_criteria: yup.object().shape({
      min_assignments_score: yup.number().min(0).max(100),
      min_quizzes_score: yup.number().min(0).max(100),
      min_attendance: yup.number().min(0).max(100)
    })
  }),
  status: yup.string(),
  language: yup.string(),
  brochures: yup.array().of(yup.string())
});

// Extended curriculum section interface for form
interface BlendedCurriculumSectionForm extends Omit<IBlendedCurriculumSection, 'id'> {
  id?: string;
  weekTitle: string; // Add weekTitle field for backend compatibility
}

// Form data interface that matches the new API structure
interface BlendedCourseFormData {
  course_title: string;
  course_subtitle?: string;
  course_category: string;
  course_subcategory?: string;
  course_tag?: string;
  course_level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  course_image: string;
  course_description: {
    program_overview: string;
    benefits: string;
    learning_objectives?: string[];
    course_requirements?: string[];
    target_audience?: string[];
  };
  course_duration: string;
  session_duration: string;
  prices: IUnifiedPrice[];
  doubt_session_schedule?: {
    frequency?: 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'on-demand';
    preferred_days?: string[];
    preferred_time_slots?: Array<{
      start_time: string;
      end_time: string;
      timezone: string;
    }>;
  };
  curriculum: BlendedCurriculumSectionForm[];
  tools_technologies?: IToolTechnology[];
  faqs?: IFAQ[];
  instructors?: string[];
  prerequisites?: string[];
  certification?: {
    is_certified?: boolean;
    certification_criteria?: {
      min_assignments_score?: number;
      min_quizzes_score?: number;
      min_attendance?: number;
    };
  };
  status?: 'Draft' | 'Published' | 'Upcoming';
  language?: string;
  brochures?: string[];
}

interface CategoryItem {
  _id: string;
  category_name: string;
}

// Storage utility for auto-save functionality
const STORAGE_KEY = 'medh_blended_course_draft';

const storageUtil = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key) || sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      try {
        sessionStorage.setItem(key, value);
        return true;
      } catch {
        return false;
      }
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    } catch {
      // Ignore errors
    }
  }
};

export default function CreateBlendedCoursePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [hasSavedDraft, setHasSavedDraft] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [validationMessage, setValidationMessage] = useState<string>('');
  const formSubmittedSuccessfully = useRef(false);
  
  const { postQuery } = usePostQuery();
  const { getQuery } = useGetQuery();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    trigger,
    getValues,
    formState: { errors, isDirty, dirtyFields },
    reset
  } = useForm<BlendedCourseFormData>({
    resolver: yupResolver(blendedCourseSchema) as any,
    mode: 'onChange',
    defaultValues: {
      course_level: 'Beginner',
      course_description: {
        program_overview: '',
        benefits: '',
        learning_objectives: [''],
        course_requirements: [''],
        target_audience: ['']
      },
      prices: [{
        currency: 'USD',
        individual: 0,
        batch: 0,
        min_batch_size: 2,
        max_batch_size: 10,
        early_bird_discount: 0,
        group_discount: 0,
        is_active: true
      }],
      curriculum: [{
        id: crypto.randomUUID(),
        title: 'Section 1',
        weekTitle: 'Week 1',
        description: '',
        order: 1,
        lessons: []
      }],
      doubt_session_schedule: {
        frequency: 'weekly',
        preferred_days: [],
        preferred_time_slots: []
      },
      tools_technologies: [],
      faqs: [],
      certification: {
        is_certified: false,
        certification_criteria: {
          min_assignments_score: 70,
          min_quizzes_score: 70,
          min_attendance: 80
        }
      },
      status: 'Draft',
      prerequisites: [''],
      instructors: [],
      language: 'English',
      brochures: []
    }
  });

  const { fields: curriculumFields, append: appendCurriculum, remove: removeCurriculum } = useFieldArray({
    control,
    name: "curriculum"
  });

  const { fields: priceFields, append: appendPrice, remove: removePrice } = useFieldArray({
    control,
    name: "prices"
  });

  const { fields: toolsFields, append: appendTool, remove: removeTool } = useFieldArray({
    control,
    name: "tools_technologies"
  });

  const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({
    control,
    name: "faqs"
  });

  // Handle prerequisites manually since it's a simple string array
  // const { fields: prerequisiteFields, append: appendPrerequisite, remove: removePrerequisite } = useFieldArray({
  //   control,
  //   name: "prerequisites"
  // });

  const watchedValues = watch();

  // Auto-save functionality with debounce
  const saveDraft = useCallback(
    debounce(async (data: BlendedCourseFormData) => {
      try {
        setIsDraftSaving(true);
        const saveSuccess = storageUtil.setItem(STORAGE_KEY, JSON.stringify(data));
        
        if (saveSuccess) {
          const now = new Date();
          setLastSaved(now.toLocaleString());
          setHasSavedDraft(true);
          setHasUnsavedChanges(false);
        }
      } catch (error) {
        console.error('Error saving draft:', error);
      } finally {
        setIsDraftSaving(false);
      }
    }, 2000),
    []
  );

  // Auto-save when form values change
  useEffect(() => {
    if (isDirty) {
      setHasUnsavedChanges(true);
      saveDraft(getValues());
    }
  }, [watchedValues, isDirty, saveDraft, getValues]);

  // Load saved draft on component mount
  useEffect(() => {
    const loadSavedDraft = async () => {
      try {
        const savedDraft = storageUtil.getItem(STORAGE_KEY);
        if (savedDraft) {
          const parsedDraft = JSON.parse(savedDraft);
          
          Object.entries(parsedDraft).forEach(([key, value]) => {
            setValue(key as any, value as any);
          });
          
          setHasSavedDraft(true);
          setLastSaved(new Date().toLocaleString());
          showToast.info('Loaded your saved draft');
        }
      } catch (error) {
        console.error('Error loading saved draft:', error);
        showToast.error('Failed to load saved draft');
      }
    };
    
    loadSavedDraft();
  }, [setValue]);

  // Set up beforeunload event handler
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !formSubmittedSuccessfully.current) {
        e.preventDefault();
        const message = 'You have unsaved changes. Are you sure you want to leave?';
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const response = await getQuery({
          url: apiUrls.categories.getAllCategories,
          onSuccess: () => {},
          onFail: () => {
            console.error("Error fetching categories");
            showToast.error('Failed to load categories. Please try again.');
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
            .filter(cat => cat && (cat._id) && (cat.category_name))
            .map(cat => ({
              _id: cat._id || '',
              category_name: cat.category_name || 'Unnamed Category'
            }));
          
          setCategories(formattedCategories);
          
          if (formattedCategories.length === 0) {
            showToast.warning('No valid categories found. Please add categories first.');
          }
        } else {
          console.error("No data received from categories API");
          showToast.error('No categories found. Please check the API.');
        }
      } catch (error) {
        console.error("Error in fetchCategories:", error);
        showToast.error('Failed to load categories. Please check your connection.');
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [getQuery]);

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    if (!file) {
      showToast.error('Please select a valid image file');
      return;
    }

    setImageUploading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result?.toString().split(',')[1];
        if (base64) {
          const postData = { base64String: base64, fileType: "image" };
          await postQuery({
            url: apiUrls?.upload?.uploadImage,
            postData,
            onSuccess: async (response) => {
              if (response?.data?.url && typeof response.data.url === 'string') {
                const imageUrl = response.data.url;
                setValue('course_image', imageUrl, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true
                });
                showToast.success('Image uploaded successfully');
              } else {
                console.error("Unexpected image upload response format:", response);
                showToast.error('Invalid image upload response format');
              }
            },
            onFail: (error) => {
              console.error("Image upload error:", error);
              showToast.error('Image upload failed. Please try again.');
            },
          });
        }
      };
      
      reader.onerror = () => {
        showToast.error('Failed to read image file');
      };
    } catch (error) {
      console.error("Error in handleImageUpload:", error);
      showToast.error('Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  };

  // Handle brochure PDF upload
  const [brochureUploading, setBrochureUploading] = useState(false);
  
  const handleBrochureUpload = async (file: File) => {
    if (!file) {
      showToast.error('Please select a valid PDF file');
      return;
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      showToast.error('Only PDF files are allowed for brochures');
      return;
    }

    // Validate file size (e.g., max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      showToast.error('File size must be less than 10MB');
      return;
    }

    setBrochureUploading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result?.toString().split(',')[1];
        if (base64) {
          const postData = { base64String: base64, fileType: "document" };
          await postQuery({
            url: apiUrls?.upload?.uploadDocument,
            postData,
            onSuccess: async (response) => {
              if (response?.data?.url && typeof response.data.url === 'string') {
                const brochureUrl = response.data.url;
                const currentBrochures = watchedValues.brochures || [];
                const newBrochures = [...currentBrochures, brochureUrl];
                setValue('brochures', newBrochures, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true
                });
                showToast.success('Brochure uploaded successfully');
              } else {
                console.error("Unexpected brochure upload response format:", response);
                showToast.error('Invalid brochure upload response format');
              }
            },
            onFail: (error) => {
              console.error("Brochure upload error:", error);
              showToast.error('Brochure upload failed. Please try again.');
            },
          });
        }
      };
      
      reader.onerror = () => {
        showToast.error('Failed to read PDF file');
      };
    } catch (error) {
      console.error("Error in handleBrochureUpload:", error);
      showToast.error('Failed to upload brochure');
    } finally {
      setBrochureUploading(false);
    }
  };

  // Remove brochure
  const removeBrochure = (index: number) => {
    const currentBrochures = watchedValues.brochures || [];
    const newBrochures = currentBrochures.filter((_, i) => i !== index);
    setValue('brochures', newBrochures);
  };

  // Add lesson to curriculum section
  const addLessonToCurriculum = (sectionIndex: number) => {
    const currentCurriculum = watchedValues.curriculum || [];
    const newLesson: IBlendedCourseLesson = {
      title: '',
      description: '',
      duration: 0,
      content_type: 'video',
      content_url: '',
      is_preview: false,
      order: (currentCurriculum[sectionIndex]?.lessons?.length || 0) + 1
    };

    const updatedCurriculum = [...currentCurriculum];
    if (!updatedCurriculum[sectionIndex].lessons) {
      updatedCurriculum[sectionIndex].lessons = [];
    }
    updatedCurriculum[sectionIndex].lessons!.push(newLesson);
    setValue('curriculum', updatedCurriculum);
  };

  // Remove lesson from curriculum section
  const removeLessonFromCurriculum = (sectionIndex: number, lessonIndex: number) => {
    const currentCurriculum = watchedValues.curriculum || [];
    const updatedCurriculum = [...currentCurriculum];
    updatedCurriculum[sectionIndex].lessons?.splice(lessonIndex, 1);
    setValue('curriculum', updatedCurriculum);
  };

  // Update lesson in curriculum
  const updateLesson = (sectionIndex: number, lessonIndex: number, field: keyof IBlendedCourseLesson, value: any) => {
    const currentCurriculum = watchedValues.curriculum || [];
    const updatedCurriculum = [...currentCurriculum];
    if (updatedCurriculum[sectionIndex].lessons && updatedCurriculum[sectionIndex].lessons![lessonIndex]) {
      (updatedCurriculum[sectionIndex].lessons![lessonIndex] as any)[field] = value;
      setValue('curriculum', updatedCurriculum);
    }
  };

  // Enhanced form validation helper
  const validateFormData = (data: BlendedCourseFormData): string[] => {
    const errors: string[] = [];

    // Basic required fields
    if (!data.course_title?.trim()) {
      errors.push('Course Title is required');
    }
    if (!data.course_category?.trim()) {
      errors.push('Course Category is required');
    }
    if (!data.course_image?.trim()) {
      errors.push('Course Image is required');
    }
    if (!data.course_level?.trim()) {
      errors.push('Course Level is required');
    }
    if (!data.course_duration?.trim()) {
      errors.push('Course Duration is required');
    }
    if (!data.session_duration?.trim()) {
      errors.push('Session Duration is required');
    }

    // Course description validation
    if (!data.course_description?.program_overview?.trim()) {
      errors.push('Program Overview is required');
    } else if (data.course_description.program_overview.trim().length < 50) {
      errors.push('Program Overview must be at least 50 characters');
    }

    if (!data.course_description?.benefits?.trim()) {
      errors.push('Course Benefits are required');
    } else if (data.course_description.benefits.trim().length < 30) {
      errors.push('Course Benefits must be at least 30 characters');
    }

    // Pricing validation
    if (!data.prices || data.prices.length === 0) {
      errors.push('At least one pricing configuration is required');
    } else {
      data.prices.forEach((price, index) => {
        if (!price.currency) {
          errors.push(`Currency is required for pricing #${index + 1}`);
        }
        if (!price.individual || price.individual <= 0) {
          errors.push(`Individual price must be greater than 0 for pricing #${index + 1}`);
        }
        if (!price.batch || price.batch <= 0) {
          errors.push(`Batch price must be greater than 0 for pricing #${index + 1}`);
        }
        if (!price.min_batch_size || price.min_batch_size < 2) {
          errors.push(`Minimum batch size must be at least 2 for pricing #${index + 1}`);
        }
        if (!price.max_batch_size || price.max_batch_size < price.min_batch_size) {
          errors.push(`Maximum batch size must be greater than minimum batch size for pricing #${index + 1}`);
        }
      });
    }

    // Curriculum validation
    if (!data.curriculum || data.curriculum.length === 0) {
      errors.push('At least one curriculum section is required');
    } else {
      data.curriculum.forEach((section, sIndex) => {
        if (!section.title?.trim()) {
          errors.push(`Section ${sIndex + 1}: Title is required`);
        }
        
        if (section.lessons && section.lessons.length > 0) {
          section.lessons.forEach((lesson, lIndex) => {
            if (!lesson.title?.trim()) {
              errors.push(`Section ${sIndex + 1}, Lesson ${lIndex + 1}: Title is required`);
            }
            if (lesson.content_type === 'video' && !lesson.content_url?.trim()) {
              errors.push(`Section ${sIndex + 1}, Lesson ${lIndex + 1}: Content URL is required for video lessons`);
            }
            if (lesson.content_type === 'video' && (!lesson.duration || lesson.duration <= 0)) {
              errors.push(`Section ${sIndex + 1}, Lesson ${lIndex + 1}: Duration is required for video lessons`);
            }
          });
        }
      });
    }

    // Tools validation
    if (data.tools_technologies && data.tools_technologies.length > 0) {
      data.tools_technologies.forEach((tool, index) => {
        if (!tool.name?.trim()) {
          errors.push(`Tool/Technology #${index + 1}: Name is required`);
        }
      });
    }

    // FAQ validation
    if (data.faqs && data.faqs.length > 0) {
      data.faqs.forEach((faq, index) => {
        if (!faq.question?.trim()) {
          errors.push(`FAQ #${index + 1}: Question is required`);
        }
        if (!faq.answer?.trim()) {
          errors.push(`FAQ #${index + 1}: Answer is required`);
        }
      });
    }

    return errors;
  };

  // Form submission helper
  const handleFormSubmit = async (status: 'Draft' | 'Published' = 'Published') => {
    try {
      console.log('handleFormSubmit called with status:', status);
      
      // Set the status
      setValue('status', status);
      
      // Trigger validation
      const isValid = await trigger();
      console.log('Form validation result:', isValid);
      
      if (!isValid) {
        const formErrors = Object.keys(errors);
        console.log('Form errors:', errors);
        
        if (formErrors.length > 0) {
          // Show first few validation errors as toasts
          const errorMessages = formErrors.slice(0, 3).map(field => {
            const error = errors[field as keyof typeof errors];
            return error?.message || `${field} is invalid`;
          });
          
          errorMessages.forEach((message, index) => {
            setTimeout(() => {
              showToast.error(message);
            }, index * 500);
          });
          
          if (formErrors.length > 3) {
            setTimeout(() => {
              showToast.warning(`${formErrors.length - 3} more validation errors found.`);
            }, 1500);
          }
        } else {
          showToast.error('Please check the form for errors');
        }
        return;
      }
      
      // If validation passes, submit the form
      await handleSubmit(onSubmit)();
    } catch (error) {
      console.error('Error in form submission:', error);
      showToast.error('Failed to submit form');
    }
  };

  // Enhanced API error parser
  const parseAPIError = (error: any): string => {
    if (typeof error === 'string') {
      return error;
    }

    // Check for various error response formats
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }

    if (error?.response?.data?.error) {
      return error.response.data.error;
    }

    if (error?.response?.data?.errors) {
      if (Array.isArray(error.response.data.errors)) {
        return error.response.data.errors.join(', ');
      }
      if (typeof error.response.data.errors === 'object') {
        return Object.values(error.response.data.errors).join(', ');
      }
    }

    if (error?.data?.message) {
      return error.data.message;
    }

    if (error?.data?.error) {
      return error.data.error;
    }

    if (error?.message) {
      return error.message;
    }

    // Network errors
    if (error?.code === 'NETWORK_ERROR' || error?.name === 'NetworkError') {
      return 'Network error. Please check your internet connection and try again.';
    }

    // Timeout errors
    if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
      return 'Request timed out. Please try again.';
    }

    return 'An unexpected error occurred. Please try again.';
  };

  // Enhanced form submission with comprehensive validation
  const onSubmit = async (data: BlendedCourseFormData) => {
    try {
      setIsSubmitting(true);
      setValidationMessage('');

      console.log('Form submission started');
      console.log('Submitting course data:', data);
      
      // Clear any previous validation messages
      setValidationMessage('');

      // Enhanced validation
      const validationErrors = validateFormData(data);
      if (validationErrors.length > 0) {
        const errorMessage = `Please fix the following errors:\n• ${validationErrors.join('\n• ')}`;
        setValidationMessage(errorMessage);
        
        // Show individual toast for the first few errors
        validationErrors.slice(0, 3).forEach((error, index) => {
          setTimeout(() => {
            showToast.error(error);
          }, index * 500);
        });

        if (validationErrors.length > 3) {
          setTimeout(() => {
            showToast.warning(`${validationErrors.length - 3} more validation errors found. Please check the form.`);
          }, 1500);
        }

        return;
      }

      // Filter out empty items from arrays
      const cleanedData = {
        ...data,
        course_description: {
          ...data.course_description,
          learning_objectives: data.course_description?.learning_objectives?.filter(obj => obj?.trim()) || [],
          course_requirements: data.course_description?.course_requirements?.filter(req => req?.trim()) || [],
          target_audience: data.course_description?.target_audience?.filter(aud => aud?.trim()) || []
        },
        prerequisites: data.prerequisites?.filter(prereq => prereq?.trim()) || [],
        tools_technologies: data.tools_technologies?.filter(tool => tool?.name?.trim()) || [],
        faqs: data.faqs?.filter(faq => faq?.question?.trim() && faq?.answer?.trim()) || []
      };

      // Transform curriculum to include weekTitle for API (backend requires it)
      const transformedCurriculum = cleanedData.curriculum.map(section => ({
        id: section.id || crypto.randomUUID(),
        title: section.title,
        weekTitle: section.weekTitle, // Include weekTitle as required by backend
        description: section.description,
        order: section.order,
        lessons: section.lessons || [],
        resources: section.resources || [],
        assignments: section.assignments || []
      }));

      // Prepare the course data according to IBlendedCourse interface
      const blendedCourseData: IBlendedCourse = {
        course_type: 'blended',
        course_title: cleanedData.course_title,
        course_subtitle: cleanedData.course_subtitle,
        course_category: cleanedData.course_category,
        course_subcategory: cleanedData.course_subcategory,
        course_tag: cleanedData.course_tag,
        course_level: cleanedData.course_level,
        course_image: cleanedData.course_image,
        course_description: cleanedData.course_description,
        course_duration: cleanedData.course_duration,
        session_duration: cleanedData.session_duration,
        prices: cleanedData.prices,
        curriculum: transformedCurriculum,
        doubt_session_schedule: cleanedData.doubt_session_schedule,
        tools_technologies: cleanedData.tools_technologies,
        faqs: cleanedData.faqs,
        instructors: cleanedData.instructors,
        prerequisites: cleanedData.prerequisites,
        certification: cleanedData.certification,
        status: cleanedData.status,
        language: cleanedData.language,
        brochures: cleanedData.brochures
      };

      console.log('Sending course data to API:', blendedCourseData);

      // Show loading toast
      const loadingToast = toast.loading('Creating blended course...');

      try {
        // Create the course using the new API
        const response = await courseTypesAPI.createCourse(blendedCourseData);
        
        console.log('API Response:', response);

        // Dismiss loading toast
        toast.dismiss(loadingToast);

                 // Check for successful response
         if (response?.data?.success) {
           formSubmittedSuccessfully.current = true;
           showToast.success(`Blended course "${blendedCourseData.course_title}" created successfully!`, {
             autoClose: 4000,
           });
          
          // Clear the saved draft
          storageUtil.removeItem(STORAGE_KEY);
          setHasSavedDraft(false);
          setLastSaved(null);
          setHasUnsavedChanges(false);
          
          // Reset form
          reset();
          
          // Redirect to course management with a delay
          setTimeout(() => {
            window.location.href = '/dashboards/admin/courses/manage';
          }, 2000);
        } else {
          // Handle API error response
          const apiError = parseAPIError(response);
          throw new Error(apiError);
        }
      } catch (apiError) {
        // Dismiss loading toast
        toast.dismiss(loadingToast);
        
        console.error("API Error:", apiError);
        const errorMessage = parseAPIError(apiError);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error creating blended course:", error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred while creating the course';
      
             setValidationMessage(errorMessage);
       showToast.error(errorMessage, {
         autoClose: 6000,
       });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save draft manually
  const handleSaveDraft = async () => {
    try {
      setIsDraftSaving(true);
      const currentValues = getValues();
      const saveSuccess = storageUtil.setItem(STORAGE_KEY, JSON.stringify(currentValues));
      
      if (saveSuccess) {
        const now = new Date();
        setLastSaved(now.toLocaleString());
        setHasSavedDraft(true);
        setHasUnsavedChanges(false);
        showToast.success('Draft saved successfully');
      } else {
        showToast.error('Failed to save draft. Storage might be unavailable.');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      showToast.error('Failed to save draft');
    } finally {
      setIsDraftSaving(false);
    }
  };

  // Clear saved draft
  const clearSavedDraft = () => {
    if (window.confirm('Are you sure you want to clear your saved draft? This cannot be undone.')) {
      storageUtil.removeItem(STORAGE_KEY);
      setHasSavedDraft(false);
      setLastSaved(null);
      setHasUnsavedChanges(false);
      showToast.info('Draft cleared');
      reset();
    }
  };

  // Save as draft and submit
  const saveAsDraft = async () => {
    setValue('status', 'Draft');
    await handleSubmit(onSubmit)();
  };

  // CSS classes
  const inputClass = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2";
  const errorClass = "text-red-500 text-sm mt-1";
  const cardClass = "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200";

  // Auto-save status indicator
  const AutoSaveIndicator = () => {
    if (isDraftSaving) {
      return (
        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
          Auto-saving...
        </span>
      );
    }
    
    if (hasUnsavedChanges) {
      return (
        <span className="text-sm text-amber-500 dark:text-amber-400 flex items-center">
          <span className="mr-2">●</span>
          Unsaved changes
        </span>
      );
    }
    
    if (hasSavedDraft && lastSaved) {
      return (
        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
          <span className="text-green-500 mr-2">✓</span>
          Auto-saved · {lastSaved}
        </span>
      );
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboards/admin/courses/create" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Course Type Selection
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Create Blended Course
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Create a blended learning experience with self-paced content and instructor support
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <AutoSaveIndicator />
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={isDraftSaving || isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-blue-500 rounded-lg text-sm font-medium text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors duration-200"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isDraftSaving ? 'Saving...' : 'Save Draft'}
                </button>
                {hasSavedDraft && (
                  <button
                    type="button"
                    onClick={clearSavedDraft}
                    className="inline-flex items-center px-4 py-2 border border-red-300 dark:border-red-700 rounded-lg text-sm font-medium text-red-500 dark:text-red-400 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors duration-200"
                    disabled={isDraftSaving || isSubmitting}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Draft
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Course Title *</label>
                <input
                  type="text"
                  {...register("course_title", { required: "Course title is required" })}
                  className={inputClass}
                  placeholder="Enter course title"
                />
                {errors.course_title && (
                  <p className={errorClass}>{errors.course_title.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Course Subtitle</label>
                <input
                  type="text"
                  {...register("course_subtitle")}
                  className={inputClass}
                  placeholder="Enter course subtitle"
                />
              </div>

              <div>
                <label className={labelClass}>Category *</label>
                <select
                  {...register("course_category", { required: "Category is required" })}
                  className={inputClass}
                  disabled={isLoadingCategories}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.category_name}>
                      {category.category_name}
                    </option>
                  ))}
                </select>
                {errors.course_category && (
                  <p className={errorClass}>{errors.course_category.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Course Level</label>
                <select
                  {...register("course_level")}
                  className={inputClass}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="All Levels">All Levels</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Subcategory</label>
                <input
                  type="text"
                  {...register("course_subcategory")}
                  className={inputClass}
                  placeholder="e.g., Frontend Development"
                />
              </div>

              <div>
                <label className={labelClass}>Course Tags</label>
                <input
                  type="text"
                  {...register("course_tag")}
                  className={inputClass}
                  placeholder="e.g., javascript,react,frontend"
                />
              </div>

              <div>
                <label className={labelClass}>Language</label>
                <select
                  {...register("language")}
                  className={inputClass}
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Mandarin">Mandarin</option>
                  <option value="Arabic">Arabic</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Course Duration *</label>
                <input
                  type="text"
                  {...register("course_duration", { required: "Course duration is required" })}
                  className={inputClass}
                  placeholder="e.g., 8 weeks, 3 months"
                />
                {errors.course_duration && (
                  <p className={errorClass}>{errors.course_duration.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Session Duration *</label>
                <input
                  type="text"
                  {...register("session_duration", { required: "Session duration is required" })}
                  className={inputClass}
                  placeholder="e.g., 2 hours, 90 minutes"
                />
                {errors.session_duration && (
                  <p className={errorClass}>{errors.session_duration.message}</p>
                )}
              </div>
            </div>

            {/* Course Image */}
            <div className="mt-6">
              <label className={labelClass}>Course Image *</label>
              <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  {watchedValues.course_image ? (
                    <div className="relative">
                      <img
                        src={watchedValues.course_image}
                        alt="Course preview"
                        className="mx-auto h-32 w-auto rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setValue('course_image', '')}
                        className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file);
                            }}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </>
                  )}
                </div>
              </div>
              {imageUploading && (
                <p className="text-sm text-blue-600 mt-2">Uploading image...</p>
              )}
            </div>
          </div>

          {/* Course Description */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Course Description
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className={labelClass}>Program Overview *</label>
                <textarea
                  {...register("course_description.program_overview", { required: "Program overview is required" })}
                  rows={4}
                  className={inputClass}
                  placeholder="Describe what this course is about, main topics covered, and course structure..."
                />
                {errors.course_description?.program_overview && (
                  <p className={errorClass}>{errors.course_description.program_overview.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Benefits *</label>
                <textarea
                  {...register("course_description.benefits", { required: "Benefits are required" })}
                  rows={3}
                  className={inputClass}
                  placeholder="What will students gain from this course? Skills, knowledge, career benefits..."
                />
                {errors.course_description?.benefits && (
                  <p className={errorClass}>{errors.course_description.benefits.message}</p>
                )}
              </div>

              {/* Learning Objectives */}
              <div>
                <label className={labelClass}>Learning Objectives</label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Specific, measurable outcomes students will achieve</p>
                {(watchedValues.course_description?.learning_objectives || ['']).map((objective, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      value={objective}
                      onChange={(e) => {
                        const newObjectives = [...(watchedValues.course_description?.learning_objectives || [''])];
                        newObjectives[index] = e.target.value;
                        setValue('course_description.learning_objectives', newObjectives);
                      }}
                      className={inputClass}
                      placeholder="e.g., Master ES6+ features and syntax"
                    />
                    {(watchedValues.course_description?.learning_objectives || ['']).length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newObjectives = [...(watchedValues.course_description?.learning_objectives || [''])];
                          newObjectives.splice(index, 1);
                          setValue('course_description.learning_objectives', newObjectives);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newObjectives = [...(watchedValues.course_description?.learning_objectives || ['']), ''];
                    setValue('course_description.learning_objectives', newObjectives);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Learning Objective
                </button>
              </div>

              {/* Course Requirements */}
              <div>
                <label className={labelClass}>Course Requirements</label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Prerequisites and technical requirements</p>
                {(watchedValues.course_description?.course_requirements || ['']).map((requirement, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      value={requirement}
                      onChange={(e) => {
                        const newRequirements = [...(watchedValues.course_description?.course_requirements || [''])];
                        newRequirements[index] = e.target.value;
                        setValue('course_description.course_requirements', newRequirements);
                      }}
                      className={inputClass}
                      placeholder="e.g., Basic JavaScript knowledge"
                    />
                    {(watchedValues.course_description?.course_requirements || ['']).length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newRequirements = [...(watchedValues.course_description?.course_requirements || [''])];
                          newRequirements.splice(index, 1);
                          setValue('course_description.course_requirements', newRequirements);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newRequirements = [...(watchedValues.course_description?.course_requirements || ['']), ''];
                    setValue('course_description.course_requirements', newRequirements);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Requirement
                </button>
              </div>

              {/* Target Audience */}
              <div>
                <label className={labelClass}>Target Audience</label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Who should take this course?</p>
                {(watchedValues.course_description?.target_audience || ['']).map((audience, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      value={audience}
                      onChange={(e) => {
                        const newAudience = [...(watchedValues.course_description?.target_audience || [''])];
                        newAudience[index] = e.target.value;
                        setValue('course_description.target_audience', newAudience);
                      }}
                      className={inputClass}
                      placeholder="e.g., Intermediate developers wanting to advance skills"
                    />
                    {(watchedValues.course_description?.target_audience || ['']).length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newAudience = [...(watchedValues.course_description?.target_audience || [''])];
                          newAudience.splice(index, 1);
                          setValue('course_description.target_audience', newAudience);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newAudience = [...(watchedValues.course_description?.target_audience || ['']), ''];
                    setValue('course_description.target_audience', newAudience);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Target Audience
                </button>
              </div>
            </div>
          </div>

          {/* Prerequisites */}
          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Prerequisites
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Additional prerequisites beyond the basic course requirements
            </p>
            
            {(watchedValues.prerequisites || ['']).map((prerequisite, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  value={prerequisite}
                  onChange={(e) => {
                    const newPrerequisites = [...(watchedValues.prerequisites || [''])];
                    newPrerequisites[index] = e.target.value;
                    setValue('prerequisites', newPrerequisites);
                  }}
                  className={inputClass}
                  placeholder="e.g., Completed Intro to JavaScript course"
                />
                {(watchedValues.prerequisites || ['']).length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newPrerequisites = [...(watchedValues.prerequisites || [''])];
                      newPrerequisites.splice(index, 1);
                      setValue('prerequisites', newPrerequisites);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newPrerequisites = [...(watchedValues.prerequisites || ['']), ''];
                setValue('prerequisites', newPrerequisites);
              }}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Prerequisite
            </button>
          </div>

          {/* Tools & Technologies */}
          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Tools & Technologies
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Technologies, frameworks, and tools covered in this course
            </p>
            
            {toolsFields.map((field, index) => (
              <div key={field.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tool/Technology Name *
                    </label>
                    <input
                      {...register(`tools_technologies.${index}.name` as const, { required: "Tool name is required" })}
                      className={inputClass}
                      placeholder="e.g., React"
                    />
                    {errors.tools_technologies?.[index]?.name && (
                      <p className={errorClass}>{errors.tools_technologies[index]?.name?.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      {...register(`tools_technologies.${index}.category` as const)}
                      className={inputClass}
                    >
                      <option value="">Select category</option>
                      <option value="programming_language">Programming Language</option>
                      <option value="framework">Framework</option>
                      <option value="library">Library</option>
                      <option value="tool">Tool</option>
                      <option value="platform">Platform</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <input
                      {...register(`tools_technologies.${index}.description` as const)}
                      className={inputClass}
                      placeholder="e.g., UI library for building user interfaces"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Logo URL
                    </label>
                    <input
                      {...register(`tools_technologies.${index}.logo_url` as const)}
                      className={inputClass}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    onClick={() => removeTool(index)}
                    className="text-red-500 hover:text-red-700 flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove Tool
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => appendTool({
                name: '',
                category: 'other',
                description: '',
                logo_url: ''
              })}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Tool/Technology
            </button>
          </div>

          {/* Doubt Session Schedule */}
          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Doubt Session Schedule
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Configure when doubt clarification sessions will be available
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Frequency</label>
                <select
                  {...register("doubt_session_schedule.frequency")}
                  className={inputClass}
                >
                  <option value="">Select frequency</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="on-demand">On-demand</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Preferred Days</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <label key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        value={day}
                        checked={watchedValues.doubt_session_schedule?.preferred_days?.includes(day) || false}
                        onChange={(e) => {
                          const currentDays = watchedValues.doubt_session_schedule?.preferred_days || [];
                          let newDays;
                          if (e.target.checked) {
                            newDays = [...currentDays, day];
                          } else {
                            newDays = currentDays.filter(d => d !== day);
                          }
                          setValue('doubt_session_schedule.preferred_days', newDays);
                        }}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{day}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Time Slots */}
            <div className="mt-6">
              <label className={labelClass}>Preferred Time Slots</label>
              {(watchedValues.doubt_session_schedule?.preferred_time_slots || []).map((slot, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={slot.start_time || ''}
                      onChange={(e) => {
                        const newSlots = [...(watchedValues.doubt_session_schedule?.preferred_time_slots || [])];
                        newSlots[index] = { ...newSlots[index], start_time: e.target.value };
                        setValue('doubt_session_schedule.preferred_time_slots', newSlots);
                      }}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
                    <input
                      type="time"
                      value={slot.end_time || ''}
                      onChange={(e) => {
                        const newSlots = [...(watchedValues.doubt_session_schedule?.preferred_time_slots || [])];
                        newSlots[index] = { ...newSlots[index], end_time: e.target.value };
                        setValue('doubt_session_schedule.preferred_time_slots', newSlots);
                      }}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Timezone</label>
                    <select
                      value={slot.timezone || ''}
                      onChange={(e) => {
                        const newSlots = [...(watchedValues.doubt_session_schedule?.preferred_time_slots || [])];
                        newSlots[index] = { ...newSlots[index], timezone: e.target.value };
                        setValue('doubt_session_schedule.preferred_time_slots', newSlots);
                      }}
                      className={inputClass}
                    >
                      <option value="">Select timezone</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">EST/EDT</option>
                      <option value="America/Los_Angeles">PST/PDT</option>
                      <option value="Europe/London">GMT/BST</option>
                      <option value="Asia/Kolkata">IST</option>
                      <option value="Asia/Tokyo">JST</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => {
                        const newSlots = [...(watchedValues.doubt_session_schedule?.preferred_time_slots || [])];
                        newSlots.splice(index, 1);
                        setValue('doubt_session_schedule.preferred_time_slots', newSlots);
                      }}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  const newSlots = [...(watchedValues.doubt_session_schedule?.preferred_time_slots || []), {
                    start_time: '',
                    end_time: '',
                    timezone: 'UTC'
                  }];
                  setValue('doubt_session_schedule.preferred_time_slots', newSlots);
                }}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Time Slot
              </button>
            </div>
          </div>

          {/* Pricing */}
          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Pricing Configuration
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Set up multi-currency pricing with individual and batch rates, including discounts
            </p>
            
            {priceFields.map((field, index) => (
              <div key={field.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Currency #{index + 1}
                  </h3>
                  {priceFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePrice(index)}
                      className="text-red-500 hover:text-red-700 flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove Currency
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className={labelClass}>Currency *</label>
                    <select
                      {...register(`prices.${index}.currency` as const, { required: "Currency is required" })}
                      className={inputClass}
                    >
                      <option value="">Select currency</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="INR">INR - Indian Rupee</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="AUD">AUD - Australian Dollar</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                    </select>
                    {errors.prices?.[index]?.currency && (
                      <p className={errorClass}>{errors.prices[index]?.currency?.message}</p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Individual Price *</label>
                    <input
                      type="number"
                      {...register(`prices.${index}.individual` as const, { 
                        required: "Individual price is required",
                        valueAsNumber: true,
                        min: { value: 0, message: "Price cannot be negative" }
                      })}
                      className={inputClass}
                      min="0"
                      step="0.01"
                      placeholder="299.00"
                    />
                    {errors.prices?.[index]?.individual && (
                      <p className={errorClass}>{errors.prices[index]?.individual?.message}</p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Batch Price *</label>
                    <input
                      type="number"
                      {...register(`prices.${index}.batch` as const, { 
                        required: "Batch price is required",
                        valueAsNumber: true,
                        min: { value: 0, message: "Price cannot be negative" }
                      })}
                      className={inputClass}
                      min="0"
                      step="0.01"
                      placeholder="249.00"
                    />
                    {errors.prices?.[index]?.batch && (
                      <p className={errorClass}>{errors.prices[index]?.batch?.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={labelClass}>Min Batch Size</label>
                    <input
                      type="number"
                      {...register(`prices.${index}.min_batch_size` as const, { valueAsNumber: true })}
                      className={inputClass}
                      min="2"
                      defaultValue={2}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Max Batch Size</label>
                    <input
                      type="number"
                      {...register(`prices.${index}.max_batch_size` as const, { valueAsNumber: true })}
                      className={inputClass}
                      min="2"
                      defaultValue={10}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Early Bird Discount (%)</label>
                    <input
                      type="number"
                      {...register(`prices.${index}.early_bird_discount` as const, { valueAsNumber: true })}
                      className={inputClass}
                      min="0"
                      max="100"
                      step="0.1"
                      placeholder="15"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Group Discount (%)</label>
                    <input
                      type="number"
                      {...register(`prices.${index}.group_discount` as const, { valueAsNumber: true })}
                      className={inputClass}
                      min="0"
                      max="100"
                      step="0.1"
                      placeholder="20"
                    />
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register(`prices.${index}.is_active` as const)}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Active Pricing</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => appendPrice({
                currency: 'USD',
                individual: 0,
                batch: 0,
                min_batch_size: 2,
                max_batch_size: 10,
                early_bird_discount: 0,
                group_discount: 0,
                is_active: true
              })}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Another Currency
            </button>
          </div>

          {/* Curriculum */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Curriculum
            </h2>
            
            {curriculumFields.map((field, sectionIndex) => (
              <div key={field.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Section {sectionIndex + 1}
                  </h3>
                  {curriculumFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCurriculum(sectionIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className={labelClass}>Section Title</label>
                    <input
                      {...register(`curriculum.${sectionIndex}.title` as const)}
                      className={inputClass}
                      placeholder="Enter section title"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Week Title *</label>
                    <input
                      {...register(`curriculum.${sectionIndex}.weekTitle` as const, { required: "Week title is required" })}
                      className={inputClass}
                      placeholder="e.g., Week 1"
                    />
                    {errors.curriculum?.[sectionIndex]?.weekTitle && (
                      <p className={errorClass}>{errors.curriculum[sectionIndex]?.weekTitle?.message}</p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Order</label>
                    <input
                      type="number"
                      {...register(`curriculum.${sectionIndex}.order` as const, { valueAsNumber: true })}
                      className={inputClass}
                      min="1"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className={labelClass}>Description</label>
                  <textarea
                    {...register(`curriculum.${sectionIndex}.description` as const)}
                    rows={2}
                    className={inputClass}
                    placeholder="Describe this section"
                  />
                </div>

                {/* Lessons */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">Lessons</h4>
                    <button
                      type="button"
                      onClick={() => addLessonToCurriculum(sectionIndex)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Lesson
                    </button>
                  </div>

                  {watchedValues.curriculum?.[sectionIndex]?.lessons?.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Lesson Title
                          </label>
                          <input
                            value={lesson.title}
                            onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'title', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="Enter lesson title"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Content Type
                          </label>
                          <select
                            value={lesson.content_type}
                            onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'content_type', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          >
                            <option value="video">Video</option>
                            <option value="text">Text</option>
                            <option value="quiz">Quiz</option>
                          </select>
                        </div>

                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => removeLessonFromCurriculum(sectionIndex, lessonIndex)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => appendCurriculum({
                id: crypto.randomUUID(),
                title: `Section ${curriculumFields.length + 1}`,
                weekTitle: `Week ${curriculumFields.length + 1}`,
                description: '',
                order: curriculumFields.length + 1,
                lessons: []
              })}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Section
            </button>
          </div>

          {/* FAQs */}
          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <HelpCircle className="h-5 w-5 mr-2" />
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Add common questions and answers about this course
            </p>
            
            {faqFields.map((field, index) => (
              <div key={field.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    FAQ #{index + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeFaq(index)}
                    className="text-red-500 hover:text-red-700 flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove FAQ
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Question *</label>
                    <input
                      {...register(`faqs.${index}.question` as const, { required: "Question is required" })}
                      className={inputClass}
                      placeholder="e.g., What are the prerequisites for this course?"
                    />
                    {errors.faqs?.[index]?.question && (
                      <p className={errorClass}>{errors.faqs[index]?.question?.message}</p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Answer *</label>
                    <textarea
                      {...register(`faqs.${index}.answer` as const, { required: "Answer is required" })}
                      rows={3}
                      className={inputClass}
                      placeholder="Provide a detailed answer to the question..."
                    />
                    {errors.faqs?.[index]?.answer && (
                      <p className={errorClass}>{errors.faqs[index]?.answer?.message}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => appendFaq({
                question: '',
                answer: ''
              })}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add FAQ
            </button>
          </div>

          {/* Certification Settings */}
          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Certification Settings
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Configure certification requirements and criteria
            </p>
            
            <div className="space-y-6">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("certification.is_certified")}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Offer Course Completion Certificate
                  </span>
                </label>
              </div>

              {watchedValues.certification?.is_certified && (
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Certification Criteria
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Set minimum requirements for students to earn the certificate
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className={labelClass}>Min Assignments Score (%)</label>
                      <input
                        type="number"
                        {...register("certification.certification_criteria.min_assignments_score", { valueAsNumber: true })}
                        className={inputClass}
                        min="0"
                        max="100"
                        placeholder="70"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Min Quizzes Score (%)</label>
                      <input
                        type="number"
                        {...register("certification.certification_criteria.min_quizzes_score", { valueAsNumber: true })}
                        className={inputClass}
                        min="0"
                        max="100"
                        placeholder="70"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Min Attendance (%)</label>
                      <input
                        type="number"
                        {...register("certification.certification_criteria.min_attendance", { valueAsNumber: true })}
                        className={inputClass}
                        min="0"
                        max="100"
                        placeholder="80"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Course Settings */}
          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Course Settings
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Course Status</label>
                <select
                  {...register("status")}
                  className={inputClass}
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                  <option value="Upcoming">Upcoming</option>
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Draft courses are not visible to students
                </p>
              </div>

              <div>
                <label className={labelClass}>Course Brochures</label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Upload PDF brochures for your course (max 10MB each)
                </p>
                
                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <label className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-blue-600 hover:text-blue-500">
                        {brochureUploading ? 'Uploading...' : 'Upload PDF Brochure'}
                      </span>
                      <input
                        type="file"
                        className="sr-only"
                        accept=".pdf,application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleBrochureUpload(file);
                        }}
                        disabled={brochureUploading}
                      />
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PDF files up to 10MB
                    </p>
                  </div>
                </div>

                {/* Uploaded Brochures List */}
                {watchedValues.brochures && watchedValues.brochures.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Uploaded Brochures ({watchedValues.brochures.length})
                    </h4>
                    {watchedValues.brochures.map((brochure, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                              <span className="text-red-600 dark:text-red-400 text-xs font-medium">PDF</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              Brochure {index + 1}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                              {brochure}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <a
                            href={brochure}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            View
                          </a>
                          <button
                            type="button"
                            onClick={() => removeBrochure(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Validation Messages */}
          {validationMessage && (
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Validation Error
                  </h3>
                  <div className="text-sm text-red-700 dark:text-red-300 mt-1">
                    {validationMessage.includes('\n') ? (
                      <div className="whitespace-pre-line">{validationMessage}</div>
                    ) : (
                      <p>{validationMessage}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Debug: Form Errors (only show in development) */}
          {process.env.NODE_ENV === 'development' && Object.keys(errors).length > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Development Debug: Form Validation Errors
                  </h3>
                  <div className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    <pre className="whitespace-pre-wrap text-xs">
                      {JSON.stringify(errors, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => handleFormSubmit('Draft')}
              disabled={isSubmitting}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors duration-200"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save as Draft
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => handleFormSubmit('Published')}
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center transition-colors duration-200"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Create Blended Course
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 