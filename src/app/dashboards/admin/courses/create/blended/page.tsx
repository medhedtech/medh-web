"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { showToast, toast } from '@/utils/toastManager';
import Link from "next/link";
import { debounce } from 'lodash';
import { ArrowLeft, Plus, Trash2, Upload, Save, Eye, CheckCircle, AlertCircle, AlertTriangle, Clock, BookOpen, Users, Award, DollarSign, Calendar, HelpCircle, Settings } from "lucide-react";
import { courseTypesAPI } from "@/apis/courses";
import { apiUrls } from "@/apis";
import usePostQuery from "@/hooks/postQuery.hook";
import useGetQuery from "@/hooks/getQuery.hook";
import type { IBlendedCourse, IUnifiedPrice, IBlendedCurriculumSection, IBlendedCourseLesson, IToolTechnology, IFAQ } from "@/apis/courses";
import { masterDataApi } from "@/apis/master.api";
import instructorAPI from '@/apis/instructor';
import { uploadService } from '@/services/uploadService';

// Comprehensive form validation schema
const blendedCourseSchema = yup.object().shape({
  course_title: yup.string().required('Course title is required').min(5, 'Title must be at least 5 characters'),
  course_subtitle: yup.string(),
  course_category: yup.string().required('Course category is required'),
  course_subcategory: yup.string(),
  course_tag: yup.array().of(yup.string()),
  course_description: yup.object().shape({
    program_overview: yup.string().required('Program overview is required').min(50, 'Overview must be at least 50 characters'),
    benefits: yup.string().required('Benefits are required').min(30, 'Benefits must be at least 30 characters'),
    learning_objectives: yup.array().of(yup.string()),
    course_requirements: yup.array().of(yup.string()),
    target_audience: yup.array().of(yup.string())
  }),
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
  brochures: yup.array().of(
    yup.object().shape({
      name: yup.string(),
      url: yup.string()
    })
  ),
  preview_video: yup.object().shape({
    title: yup.string().required('Preview title is required'),
    url: yup.string().required('Preview URL is required'),
    previewUrl: yup.string(),
    duration: yup.string().required('Preview duration is required'),
    description: yup.string().required('Preview description is required'),
  }),
  course_level: yup.string().oneOf(['Beginner', 'Intermediate', 'Advanced', 'All Levels']).required('Course level is required'),
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
  course_tag?: string[];
  course_description: {
    program_overview: string;
    benefits: string;
    learning_objectives?: string[];
    course_requirements?: string[];
    target_audience?: string[];
  };
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
  brochures?: { name: string, url: string }[];
  gradeOrCertificate: 'grade' | 'certificate';
  grade: string;
  certificateType: string;
  course_image: string;
  course_duration: string;
  preview_video?: {
    title: string;
    url: string;
    previewUrl?: string;
    duration: string;
    description: string;
  };
  session_duration?: string;
  course_level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
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
      course_tag: [''], // Ensure course_tag is always an array
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
        id: 'section_1',
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
      prerequisites: [''],
      instructors: [],
      brochures: [],
      course_image: '',
      course_duration: '',
      preview_video: {
        title: '',
        url: '',
        previewUrl: '',
        duration: '',
        description: ''
      },
      session_duration: '',
      course_level: 'Beginner'
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

  const watchedValues = watch();

  // Auto-save functionality with debounce
  const saveDraft = useCallback(
    debounce(async (data: BlendedCourseFormData) => {
      try {
        setIsDraftSaving(true);
        const saveSuccess = storageUtil.setItem(STORAGE_KEY, JSON.stringify(data));
        
        if (saveSuccess) {
          setLastSaved(new Date().toLocaleString());
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
        const base64WithPrefix = reader.result?.toString();
        if (base64WithPrefix) {
          const uploadRes = await uploadService.uploadBase64(base64WithPrefix, 'image', file.name);
          if (!uploadRes?.data?.url) throw new Error('Upload failed');
          setValue('course_image', uploadRes.data.url, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
          });
          showToast.success('Image uploaded successfully');
        }
      };
      reader.onerror = () => {
        showToast.error('Failed to read image file');
      };
    } catch (error) {
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
        const base64WithPrefix = reader.result?.toString();
        if (base64WithPrefix) {
          const uploadRes = await uploadService.uploadBase64(base64WithPrefix, 'document', file.name);
          if (!uploadRes?.data?.url) throw new Error('Upload failed');
          let displayName = window.prompt('Enter a display name for this brochure:', file.name.replace(/\.[^.]+$/, ''));
          if (!displayName || !displayName.trim()) {
            displayName = file.name.replace(/\.[^.]+$/, '');
          }
          const currentBrochures = Array.isArray(watchedValues.brochures) ? watchedValues.brochures : [];
          const newBrochures = [...currentBrochures, { name: displayName, url: uploadRes.data.url }];
          setValue('brochures', newBrochures, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
          });
          showToast.success('Brochure uploaded successfully');
        }
      };
      reader.onerror = () => {
        showToast.error('Failed to read PDF file');
      };
    } catch (error) {
      showToast.error('Failed to upload brochure');
    } finally {
      setBrochureUploading(false);
    }
  };

  // Remove brochure
  const removeBrochure = (index: number) => {
    const currentBrochures = Array.isArray(watchedValues.brochures) ? watchedValues.brochures : [];
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
        course_level: data.course_level || 'Beginner',
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
      const transformedCurriculum = cleanedData.curriculum.map((section, idx) => ({
        id: section.id || `section_${idx + 1}`,
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
        course_tag: cleanedData.course_tag?.join(','),
        course_description: cleanedData.course_description,
        prices: cleanedData.prices,
        curriculum: transformedCurriculum,
        doubt_session_schedule: cleanedData.doubt_session_schedule,
        tools_technologies: cleanedData.tools_technologies,
        faqs: cleanedData.faqs,
        instructors: cleanedData.instructors,
        prerequisites: cleanedData.prerequisites,
        certification: cleanedData.certification,
        status: cleanedData.status,
        brochures: (cleanedData.brochures || []).map(b => b.url),
        course_image: cleanedData.course_image,
        course_duration: cleanedData.course_duration,
        course_level: cleanedData.course_level || 'Beginner',
        session_duration: cleanedData.session_duration || ''
      };

      // Compose the final payload with assigned_instructor and preview_video as separate properties
      const payload = {
        ...blendedCourseData,
        assigned_instructor: cleanedData.instructors,
        preview_video: cleanedData.preview_video
      };

      console.log('Sending course data to API:', payload);

      // Show loading toast
      const loadingToast = showToast.loading('Creating blended course...');

      try {
        // Create the course using the new API
        const response = await courseTypesAPI.createCourse(payload);
        
        console.log('API Response:', response);

        // Dismiss loading toast
        toast.dismiss(loadingToast);

                 // Check for successful response
         if (response?.data?.success) {
           formSubmittedSuccessfully.current = true;
           showToast.success(`Blended course "${blendedCourseData.course_title}" created successfully!`);
          
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
       showToast.error(errorMessage);
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

  // [START OF FULL REFACTOR]
  // 1. Fix masterData types for state
  const [masterData, setMasterData] = useState<{
    parentCategories: string[];
    categories: string[];
    certificates: string[];
    grades: string[];
    courseDurations: string[];
  }>({
    parentCategories: [],
    categories: [],
    certificates: [],
    grades: [],
    courseDurations: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMasterData() {
      setIsLoading(true);
      setApiError(null);
      try {
        const response = await masterDataApi.getAllMasterData();
        // Accept either response.data or response.data.data as the payload
        const raw = response && typeof response === 'object' && 'data' in response ? (response as any).data : response;
        const data = raw && typeof raw === 'object' && 'data' in raw ? raw.data : raw;
        setMasterData({
          parentCategories: Array.isArray(data?.parentCategories) ? data.parentCategories : [],
          categories: Array.isArray(data?.categories) ? data.categories : [],
          certificates: Array.isArray(data?.certificates) ? data.certificates : [],
          grades: Array.isArray(data?.grades) ? data.grades : [],
          courseDurations: Array.isArray(data?.courseDurations) ? data.courseDurations : []
        });
      } catch (error) {
        setApiError("Failed to load form options. Please refresh the page.");
        setMasterData({
          parentCategories: ["Children & Teens", "Professionals", "Homemakers", "Lifelong Learners"],
          categories: ["AI and Data Science", "Business And Management", "Career Development", "Digital Marketing"],
          certificates: ["Professional Certificate", "Advanced Certificate", "Foundational Certificate"],
          grades: ["Grade 1-2", "Grade 3-4", "Grade 5-6", "Grade 7-8", "Grade 9-10", "Grade 11-12"],
          courseDurations: ["4 months 16 weeks", "6 months 24 weeks", "8 months 32 weeks", "12 months 48 weeks"]
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchMasterData();
  }, []);
  // [END OF FULL REFACTOR]

  const currencies = [
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "INR", name: "Indian Rupee" },
    { code: "GBP", name: "British Pound" },
    { code: "AUD", name: "Australian Dollar" },
    { code: "CAD", name: "Canadian Dollar" }
  ];

  const gradeOrCertificate = watch('gradeOrCertificate');

  const [videoUploading, setVideoUploading] = useState(false);

  // Preview video upload handler
  const handlePreviewVideoUpload = async (file: File) => {
    if (!file) {
      showToast.error('Please select a valid video file');
      return;
    }
    setVideoUploading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result?.toString().split(',')[1];
        if (base64) {
          const postData = { base64String: base64, fileType: "video" };
          await postQuery({
            url: apiUrls?.upload?.uploadVideo(),
            postData,
            onSuccess: async (response) => {
              if (response?.data?.url && typeof response.data.url === 'string') {
                setValue('preview_video', {
                  title: file.name,
                  url: response.data.url,
                  previewUrl: response.data.previewUrl || response.data.url,
                  duration: '',
                  description: ''
                }, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
                showToast.success('Preview video uploaded successfully');
              } else {
                showToast.error('Invalid video upload response format');
              }
            },
            onFail: (error) => {
              showToast.error('Video upload failed. Please try again.');
            },
          });
        }
      };
      reader.onerror = () => {
        showToast.error('Failed to read video file');
      };
    } catch (error) {
      showToast.error('Failed to upload video');
    } finally {
      setVideoUploading(false);
    }
  };

  // Migrate any string URLs in brochures to objects with default name
  useEffect(() => {
    if (Array.isArray(watchedValues.brochures) && watchedValues.brochures.length > 0 && typeof (watchedValues.brochures[0] as any) === 'string') {
      const migrated = (watchedValues.brochures as unknown as string[]).map((url, i) => ({
        name: `Brochure ${i + 1}`,
        url
      }));
      setValue('brochures', migrated);
    }
  }, [watchedValues.brochures, setValue]);

  // Fetch instructors for dropdown
  const [instructorOptions, setInstructorOptions] = useState<{ label: string, value: string }[]>([]);
  const [isLoadingInstructors, setIsLoadingInstructors] = useState(false);

  useEffect(() => {
    async function fetchInstructors() {
      setIsLoadingInstructors(true);
      try {
        const response = await instructorAPI.getAll();
        if (response?.data && Array.isArray(response.data)) {
          setInstructorOptions(
            response.data.map((inst: any) => ({
              label: inst.full_name || inst.name || inst.email,
              value: inst._id || inst.user_id || inst.id
            }))
          );
        } else if (response?.data?.data && Array.isArray(response.data.data)) {
          setInstructorOptions(
            response.data.data.map((inst: any) => ({
              label: inst.full_name || inst.name || inst.email,
              value: inst._id || inst.user_id || inst.id
            }))
          );
        }
      } catch (e) {
        showToast.error('Failed to load instructors');
      } finally {
        setIsLoadingInstructors(false);
      }
    }
    fetchInstructors();
  }, []);

  // Add state for dropdown open/close
  const [instructorDropdownOpen, setInstructorDropdownOpen] = useState(false);
  const selectedInstructorLabels = instructorOptions
    .filter(opt => (watchedValues.instructors || []).includes(opt.value))
    .map(opt => opt.label);

  // Add click outside handler to close dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const dropdown = document.getElementById('instructor-dropdown-root');
      if (dropdown && !dropdown.contains(e.target as Node)) {
        setInstructorDropdownOpen(false);
      }
    }
    if (instructorDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [instructorDropdownOpen]);

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
                <label className={labelClass}>Category *</label>
                <select
                  {...register("course_category", { required: "Category is required" })}
                  className={inputClass}
                  disabled={isLoading}
                >
                  <option value="">Select category</option>
                  {masterData.categories.map((cat, i) => (
                    <option key={i} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.course_category && (
                  <p className={errorClass}>{errors.course_category.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Parent Category (Subcategory) *</label>
                <div className="space-y-2">
                  {masterData.parentCategories.map((cat, i) => (
                    <div key={i} className="flex items-center">
                      <input
                        type="checkbox"
                        value={cat}
                        {...register("course_subcategory")}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{cat}</span>
                    </div>
                  ))}
                </div>
                {errors.course_subcategory && (
                  <p className={errorClass}>{errors.course_subcategory.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Course Tags</label>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(watchedValues.course_tag) ? watchedValues.course_tag : []).map((tag, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => {
                          const newTags = [...(Array.isArray(watchedValues.course_tag) ? watchedValues.course_tag : [])];
                          newTags[index] = e.target.value;
                          setValue('course_tag', newTags);
                        }}
                        className={inputClass}
                        placeholder="Enter tag"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newTags = [...(Array.isArray(watchedValues.course_tag) ? watchedValues.course_tag : [])];
                          newTags.splice(index, 1);
                          setValue('course_tag', newTags);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newTags = [...(Array.isArray(watchedValues.course_tag) ? watchedValues.course_tag : []), ''];
                      setValue('course_tag', newTags);
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Tag
                  </button>
                </div>
              </div>

              <div>
                <label className={labelClass}>Grade/Certificate Toggle *</label>
                <select {...register("gradeOrCertificate")} className={inputClass}>
                  <option value="grade">Grade</option>
                  <option value="certificate">Certificate</option>
                </select>
                {errors.gradeOrCertificate && typeof errors.gradeOrCertificate.message === 'string' && <p className={errorClass}>{errors.gradeOrCertificate.message}</p>}
              </div>
              {gradeOrCertificate === "grade" && (
                <div>
                  <label className={labelClass}>Grade *</label>
                  <select {...register("grade")} className={inputClass}>
                    <option value="">Select grade</option>
                    {masterData.grades.map((g, i) => (
                      <option key={i} value={g}>{g}</option>
                    ))}
                  </select>
                  {errors.grade && typeof errors.grade.message === 'string' && <p className={errorClass}>{errors.grade.message}</p>}
                </div>
              )}
              {gradeOrCertificate === "certificate" && (
                <div>
                  <label className={labelClass}>Certificate Type *</label>
                  <select {...register("certificateType")} className={inputClass}>
                    <option value="">Select certificate type</option>
                    {masterData.certificates.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                  {errors.certificateType && typeof errors.certificateType.message === 'string' && <p className={errorClass}>{errors.certificateType.message}</p>}
                </div>
              )}

              <div>
                <label className={labelClass}>Course Level *</label>
                <select {...register("course_level")} className={inputClass}>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="All Levels">All Levels</option>
                </select>
                {errors.course_level && <p className={errorClass}>{errors.course_level.message}</p>}
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

            {/* Preview Video Upload */}
            <div className="mt-6">
              <label className={labelClass}>Preview Video</label>
              <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  {watchedValues.preview_video?.url ? (
                    <div className="relative">
                      <video
                        src={watchedValues.preview_video.previewUrl || watchedValues.preview_video.url}
                        controls
                        className="mx-auto h-32 w-auto rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setValue('preview_video', { title: '', url: '', previewUrl: '', duration: '', description: '' })}
                        className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="mt-2 text-left">
                        <p className="text-sm text-gray-700 dark:text-gray-200"><strong>Title:</strong> {watchedValues.preview_video.title}</p>
                        <p className="text-sm text-gray-700 dark:text-gray-200"><strong>Duration:</strong> {watchedValues.preview_video.duration}</p>
                        <label className={labelClass + ' mt-2'}>Description</label>
                        <textarea
                          value={watchedValues.preview_video.description}
                          onChange={e => setValue('preview_video.description', e.target.value)}
                          className={inputClass}
                          rows={2}
                          placeholder="A short preview of the course"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>Upload a video</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="video/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handlePreviewVideoUpload(file);
                            }}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        MP4, WebM up to 100MB
                      </p>
                    </>
                  )}
                </div>
              </div>
              {videoUploading && (
                <p className="text-sm text-blue-600 mt-2">Uploading video...</p>
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

          {/* Pricing Configuration */}
          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Pricing Configuration
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Set up multi-currency pricing with individual rates, including discounts
            </p>
            
            {priceFields.map((field, index) => (
              <div key={field.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Currency *
                    </label>
                    <select
                      {...register(`prices.${index}.currency` as const, { required: "Currency is required" })}
                      className={inputClass}
                    >
                      <option value="">Select currency</option>
                      {currencies.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </option>
                      ))}
                    </select>
                    {errors.prices?.[index]?.currency && (
                      <p className={errorClass}>{errors.prices[index]?.currency?.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Individual Price *
                    </label>
                    <input
                      {...register(`prices.${index}.individual` as const, { required: "Individual price is required" })}
                      type="number"
                      className={inputClass}
                      placeholder="0"
                    />
                    {errors.prices?.[index]?.individual && (
                      <p className={errorClass}>{errors.prices[index]?.individual?.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    onClick={() => removePrice(index)}
                    className="text-red-500 hover:text-red-700 flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove Pricing
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => appendPrice({ currency: 'USD', individual: 0, batch: 0, min_batch_size: 2, max_batch_size: 10, early_bird_discount: 0, group_discount: 0, is_active: true })}
              disabled={isSubmitting}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Pricing Configuration
            </button>
          </div>

          {/* Doubt Session Schedule */}
          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Doubt Session Schedule
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Set up the frequency and preferred time slots for doubt sessions
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Doubt Session Frequency</label>
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
                <div className="flex flex-wrap gap-2">
                  {(watchedValues.doubt_session_schedule?.preferred_days || []).map((day, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={day}
                        onChange={(e) => {
                          const newDays = [...(watchedValues.doubt_session_schedule?.preferred_days || [])];
                          newDays[index] = e.target.value;
                          setValue('doubt_session_schedule.preferred_days', newDays);
                        }}
                        className={inputClass}
                        placeholder="e.g., Monday, Wednesday"
                      />
                      {(watchedValues.doubt_session_schedule?.preferred_days || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newDays = [...(watchedValues.doubt_session_schedule?.preferred_days || [])];
                            newDays.splice(index, 1);
                            setValue('doubt_session_schedule.preferred_days', newDays);
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
                      const newDays = [...(watchedValues.doubt_session_schedule?.preferred_days || []), ''];
                      setValue('doubt_session_schedule.preferred_days', newDays);
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Day
                  </button>
                </div>
              </div>

              <div>
                <label className={labelClass}>Preferred Time Slots</label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Select time slots during which students can book doubt sessions
                </p>
                {(watchedValues.doubt_session_schedule?.preferred_time_slots || []).map((slot, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={slot.start_time}
                      onChange={(e) => {
                        const newSlots = [...(watchedValues.doubt_session_schedule?.preferred_time_slots || [])];
                        newSlots[index].start_time = e.target.value;
                        setValue('doubt_session_schedule.preferred_time_slots', newSlots);
                      }}
                      className={inputClass}
                      placeholder="e.g., 10:00 AM"
                    />
                    <span className="text-gray-500 dark:text-gray-400">to</span>
                    <input
                      type="text"
                      value={slot.end_time}
                      onChange={(e) => {
                        const newSlots = [...(watchedValues.doubt_session_schedule?.preferred_time_slots || [])];
                        newSlots[index].end_time = e.target.value;
                        setValue('doubt_session_schedule.preferred_time_slots', newSlots);
                      }}
                      className={inputClass}
                      placeholder="e.g., 11:00 AM"
                    />
                    {(watchedValues.doubt_session_schedule?.preferred_time_slots || []).length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newSlots = [...(watchedValues.doubt_session_schedule?.preferred_time_slots || [])];
                          newSlots.splice(index, 1);
                          setValue('doubt_session_schedule.preferred_time_slots', newSlots);
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
                    const newSlots = [...(watchedValues.doubt_session_schedule?.preferred_time_slots || []), { start_time: '', end_time: '', timezone: '' }];
                    setValue('doubt_session_schedule.preferred_time_slots', newSlots);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Time Slot
                </button>
              </div>
            </div>
          </div>

          {/* Tools and Technologies */}
          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Tools and Technologies
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              List the tools and technologies used in this blended course
            </p>
            
            {toolsFields.map((field, index) => (
              <div key={field.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tool/Technology Name *
                    </label>
                    <input
                      {...register(`tools_technologies.${index}.name` as const, { required: "Tool/Technology name is required" })}
                      type="text"
                      className={inputClass}
                      placeholder="e.g., Zoom, Google Meet, Miro"
                    />
                    {errors.tools_technologies?.[index]?.name && (
                      <p className={errorClass}>{errors.tools_technologies[index]?.name?.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <input
                      {...register(`tools_technologies.${index}.category` as const)}
                      type="text"
                      className={inputClass}
                      placeholder="e.g., Communication, Collaboration, Design"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      {...register(`tools_technologies.${index}.description` as const)}
                      rows={2}
                      className={inputClass}
                      placeholder="Brief description of how this tool is used"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Logo URL
                    </label>
                    <input
                      {...register(`tools_technologies.${index}.logo_url` as const)}
                      type="text"
                      className={inputClass}
                      placeholder="e.g., https://example.com/logo.png"
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
                    Remove Tool/Technology
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => appendTool({ name: '', category: undefined, description: '', logo_url: '' })}
              disabled={isSubmitting}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Tool/Technology
            </button>
          </div>

          {/* FAQs */}
          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <HelpCircle className="h-5 w-5 mr-2" />
              FAQs
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Frequently asked questions for students
            </p>
            
            {faqFields.map((field, index) => (
              <div key={field.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Question *
                    </label>
                    <input
                      {...register(`faqs.${index}.question` as const, { required: "Question is required" })}
                      type="text"
                      className={inputClass}
                      placeholder="e.g., What is the course duration?"
                    />
                    {errors.faqs?.[index]?.question && (
                      <p className={errorClass}>{errors.faqs[index]?.question?.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Answer *
                    </label>
                    <textarea
                      {...register(`faqs.${index}.answer` as const, { required: "Answer is required" })}
                      rows={3}
                      className={inputClass}
                      placeholder="Provide a detailed answer to the question"
                    />
                    {errors.faqs?.[index]?.answer && (
                      <p className={errorClass}>{errors.faqs[index]?.answer?.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    onClick={() => removeFaq(index)}
                    className="text-red-500 hover:text-red-700 flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove FAQ
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => appendFaq({ question: '', answer: '' })}
              disabled={isSubmitting}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add FAQ
            </button>
          </div>

          {/* Instructors */}
          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Instructors
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Select one or more instructors for this blended course
            </p>
            <div>
              <label className={labelClass}>Instructors</label>
              <div className="relative">
                <button
                  type="button"
                  className={inputClass + ' flex items-center justify-between cursor-pointer min-h-[44px]'}
                  onClick={() => setInstructorDropdownOpen(open => !open)}
                  aria-haspopup="listbox"
                  aria-expanded={instructorDropdownOpen}
                >
                  <span className={selectedInstructorLabels.length ? '' : 'text-gray-400'}>
                    {selectedInstructorLabels.length
                      ? selectedInstructorLabels.join(', ')
                      : 'Select instructors...'}
                  </span>
                  <svg className="w-4 h-4 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {instructorDropdownOpen && (
                  <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <ul className="py-1" role="listbox" aria-multiselectable="true">
                      {instructorOptions.length === 0 && (
                        <li className="px-4 py-2 text-gray-400">No instructors found</li>
                      )}
                      {instructorOptions.map(option => (
                        <li key={option.value} className="px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-700 flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            id={`instructor-${option.value}`}
                            checked={(watchedValues.instructors || []).includes(option.value)}
                            onChange={e => {
                              const current = Array.isArray(watchedValues.instructors) ? watchedValues.instructors : [];
                              let newSelected;
                              if (e.target.checked) {
                                newSelected = [...current, option.value];
                              } else {
                                newSelected = current.filter(val => val !== option.value);
                              }
                              setValue('instructors', newSelected, { shouldValidate: true, shouldDirty: true });
                            }}
                            className="mr-2"
                          />
                          <label htmlFor={`instructor-${option.value}`} className="cursor-pointer select-none">
                            {option.label}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {errors.instructors && (
                <p className={errorClass}>{errors.instructors.message as string}</p>
              )}
              {isLoadingInstructors && <p className="text-sm text-gray-400 mt-2">Loading instructors...</p>}
            </div>
          </div>

          {/* Prerequisites */}
          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Prerequisites
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              List the prerequisites for this course
            </p>
            
            {(watchedValues.prerequisites || []).map((prerequisite, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={prerequisite}
                  onChange={(e) => {
                    const newPrerequisites = [...(watchedValues.prerequisites || [])];
                    newPrerequisites[index] = e.target.value;
                    setValue('prerequisites', newPrerequisites);
                  }}
                  className={inputClass}
                  placeholder="e.g., Basic HTML, CSS, and JavaScript knowledge"
                />
                {(watchedValues.prerequisites || []).length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newPrerequisites = [...(watchedValues.prerequisites || [])];
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
                const newPrerequisites = [...(watchedValues.prerequisites || []), ''];
                setValue('prerequisites', newPrerequisites);
              }}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Prerequisite
            </button>
          </div>

          {/* Certification */}
          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Certification
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Set up certification criteria for this course
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Is Certified?
                </label>
                <select
                  {...register("certification.is_certified")}
                  className={inputClass}
                >
                  <option value="">Select option</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              {watchedValues.certification?.is_certified === true && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Certification Criteria
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Minimum Assignments Score (%)
                      </label>
                      <input
                        {...register("certification.certification_criteria.min_assignments_score", {
                          valueAsNumber: true,
                          min: 0,
                          max: 100
                        })}
                        type="number"
                        className={inputClass}
                        placeholder="0"
                      />
                      {errors.certification?.certification_criteria?.min_assignments_score && (
                        <p className={errorClass}>{errors.certification.certification_criteria.min_assignments_score.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Minimum Quizzes Score (%)
                      </label>
                      <input
                        {...register("certification.certification_criteria.min_quizzes_score", {
                          valueAsNumber: true,
                          min: 0,
                          max: 100
                        })}
                        type="number"
                        className={inputClass}
                        placeholder="0"
                      />
                      {errors.certification?.certification_criteria?.min_quizzes_score && (
                        <p className={errorClass}>{errors.certification.certification_criteria.min_quizzes_score.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Minimum Attendance (%)
                      </label>
                      <input
                        {...register("certification.certification_criteria.min_attendance", {
                          valueAsNumber: true,
                          min: 0,
                          max: 100
                        })}
                        type="number"
                        className={inputClass}
                        placeholder="0"
                      />
                      {errors.certification?.certification_criteria?.min_attendance && (
                        <p className={errorClass}>{errors.certification.certification_criteria.min_attendance.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Brochures */}
          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Brochures
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Upload PDF brochures for this course
            </p>
            {/* Brochure Upload Button */}
            <div className="mt-4">
              <label className={labelClass}>Upload Brochure (PDF)</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleBrochureUpload(file);
                }}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              {brochureUploading && (
                <p className="text-sm text-blue-600 mt-2">Uploading brochure...</p>
              )}
            </div>
            {/* Uploaded Brochures List */}
            <div className="mt-4 space-y-2">
              {(watchedValues.brochures || []).length === 0 && (
                <p className="text-sm text-gray-400">No brochures uploaded yet.</p>
              )}
              {(watchedValues.brochures || []).map((brochure, index) => {
                const fileName = brochure.name || `Brochure ${index + 1}`;
                return (
                  <div key={index} className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded px-3 py-2">
                    <a
                      href={brochure.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 underline truncate max-w-xs"
                      title={fileName}
                    >
                      {fileName}
                    </a>
                    <button
                      type="button"
                      onClick={() => removeBrochure(index)}
                      className="text-red-500 hover:text-red-700 ml-2"
                      aria-label="Remove brochure"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Validation Message */}
          {validationMessage && (
            <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Warning!</strong>
              <span className="block sm:inline"> {validationMessage}</span>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => handleFormSubmit('Draft')}
              disabled={isSubmitting}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              <Save className="h-5 w-5 mr-2" />
              Save as Draft
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-green-700 dark:hover:bg-green-800"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              {isSubmitting ? 'Creating...' : 'Create Blended Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
