"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import Link from "next/link";
import { debounce } from 'lodash';
import { ArrowLeft, Plus, Trash2, Upload, Save, Eye, CheckCircle, AlertCircle, Clock, BookOpen, Users, Award, DollarSign, Calendar, HelpCircle, Settings, X, FileText, Video, Link as LinkIcon, FileDown } from "lucide-react";
import { courseTypesAPI } from "@/apis/courses";
import { apiUrls } from "@/apis";
import usePostQuery from "@/hooks/postQuery.hook";
import useGetQuery from "@/hooks/getQuery.hook";
import type { IFreeCourse, IFreeCourseLesson, IFreeCourseResource, IToolTechnology, IFAQ } from "@/apis/courses";

// Type definition for category item
interface CategoryItem {
  _id: string;
  category_name: string;
}

// Enhanced lesson interface for form handling
interface FreeLessonForm extends Omit<IFreeCourseLesson, 'id'> {
  id?: string;
}

// Form data interface that matches the new API structure
interface FreeCourseFormData {
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
  estimated_duration: string;
  lessons: FreeLessonForm[];
  resources?: IFreeCourseResource[];
  access_type?: 'unlimited' | 'time-limited';
  access_duration?: number;
  prerequisites?: string[];
  target_skills?: string[];
  completion_certificate?: {
    is_available?: boolean;
    requirements?: {
      min_lessons_completed?: number;
    };
  };
  tools_technologies?: IToolTechnology[];
  faqs?: IFAQ[];
  status?: 'Draft' | 'Published' | 'Upcoming';
  language?: string;
  brochures?: string[];
}

// Comprehensive form validation schema
const freeCourseSchema = yup.object().shape({
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
  estimated_duration: yup.string().required('Estimated duration is required'),
  lessons: yup.array().of(
    yup.object().shape({
      title: yup.string().required('Lesson title is required'),
      description: yup.string().required('Lesson description is required'),
      content_type: yup.string().required('Content type is required'),
      content: yup.string().required('Content is required'),
      duration: yup.number().when('content_type', {
        is: 'video',
        then: (schema) => schema.required('Duration is required for video lessons').min(1),
        otherwise: (schema) => schema
      }),
      order: yup.number().required('Order is required').min(1),
      is_preview: yup.boolean()
    })
  ).min(1, 'At least one lesson is required'),
  resources: yup.array().of(
    yup.object().shape({
      title: yup.string().required('Resource title is required'),
      url: yup.string().required('Resource URL is required'),
      description: yup.string(),
      type: yup.string()
    })
  ),
  access_type: yup.string().oneOf(['unlimited', 'time-limited']),
  access_duration: yup.number().when('access_type', {
    is: 'time-limited',
    then: (schema) => schema.required('Access duration is required').min(1),
    otherwise: (schema) => schema
  }),
  prerequisites: yup.array().of(yup.string()),
  target_skills: yup.array().of(yup.string()),
  completion_certificate: yup.object().shape({
    is_available: yup.boolean(),
    requirements: yup.object().shape({
      min_lessons_completed: yup.number().min(0).max(100)
    })
  }),
  tools_technologies: yup.array().of(
    yup.object().shape({
      name: yup.string().required('Tool name is required'),
      category: yup.string(),
      description: yup.string()
    })
  ),
  faqs: yup.array().of(
    yup.object().shape({
      question: yup.string().required('Question is required'),
      answer: yup.string().required('Answer is required')
    })
  ),
  status: yup.string(),
  language: yup.string(),
  brochures: yup.array().of(yup.string())
});

// Storage utility for auto-save functionality
const STORAGE_KEY = 'medh_free_course_draft';

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

export default function CreateFreeCoursePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [courseImage, setCourseImage] = useState<string | null>(null);
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
  } = useForm<FreeCourseFormData>({
    resolver: yupResolver(freeCourseSchema) as any,
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
      estimated_duration: '',
      lessons: [{
        id: crypto.randomUUID(),
        title: '',
        description: '',
        content_type: 'video',
        content: '',
        duration: 0,
        order: 1,
        is_preview: true
      }],
      resources: [],
      access_type: 'unlimited',
      prerequisites: [''],
      target_skills: [''],
      completion_certificate: {
        is_available: true,
        requirements: {
          min_lessons_completed: 100
        }
      },
      tools_technologies: [],
      faqs: [],
      status: 'Draft',
      language: 'English',
      brochures: []
    }
  });

  const { fields: lessonFields, append: appendLesson, remove: removeLesson } = useFieldArray({
    control,
    name: "lessons"
  });

  const { fields: resourceFields, append: appendResource, remove: removeResource } = useFieldArray({
    control,
    name: "resources"
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
    debounce(async (data: FreeCourseFormData) => {
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
          toast.info('Loaded your saved draft');
        }
      } catch (error) {
        console.error('Error loading saved draft:', error);
        toast.error('Failed to load saved draft');
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
            toast.error('Failed to load categories. Please try again.');
          }
        });
        
        if (response?.data) {
          let categoriesData: any[] = [];
          
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
        setIsLoadingCategories(false);
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
          setImageUploading(true);
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
          setImageUploading(false);
        }
      };
      
      reader.onerror = () => {
        toast.error('Failed to read image file');
        setImageUploading(false);
      };
    } catch (error) {
      console.error("Error in handleImageUpload:", error);
      toast.error('Failed to upload image');
      setImageUploading(false);
    }
  };

  // Handle brochure upload
  const handleBrochureUpload = async (file: File) => {
    try {
      if (!file) {
        toast.error('Please select a valid PDF file');
        return;
      }
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result?.toString().split(',')[1];
        if (base64) {
          setImageUploading(true);
          const postData = { base64String: base64, fileType: "pdf" };
          await postQuery({
            url: apiUrls?.upload?.uploadImage,
            postData,
            onSuccess: async (response) => {
              if (response?.data?.url && typeof response.data.url === 'string') {
                const pdfUrl = response.data.url;
                const currentBrochures = getValues('brochures') || [];
                setValue('brochures', [...currentBrochures, pdfUrl], {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true
                });
                toast.success('Brochure uploaded successfully');
              } else {
                console.error("Unexpected brochure upload response format:", response);
                toast.error('Invalid brochure upload response format');
              }
            },
            onFail: (error) => {
              console.error("Brochure upload error:", error);
              toast.error('Brochure upload failed. Please try again.');
            },
          });
          setImageUploading(false);
        }
      };
      
      reader.onerror = () => {
        toast.error('Failed to read PDF file');
        setImageUploading(false);
      };
    } catch (error) {
      console.error("Error in handleBrochureUpload:", error);
      toast.error('Failed to upload brochure');
      setImageUploading(false);
    }
  };

  const removeBrochure = (index: number) => {
    const currentBrochures = getValues('brochures') || [];
    const newBrochures = currentBrochures.filter((_, i) => i !== index);
    setValue('brochures', newBrochures);
  };

  const handleStringArrayChange = (arrayPath: string, index: number, value: string) => {
    const currentValues = getValues();
    const parts = arrayPath.split(".");
    
    if (parts.length === 1) {
      const currentArray = currentValues[parts[0] as keyof FreeCourseFormData] as any[];
      const newArray = [...currentArray];
      newArray[index] = value;
      setValue(parts[0] as any, newArray);
    } else if (parts.length === 2) {
      const parentKey = parts[0];
      const childKey = parts[1];
      
      const parentObj = { ...(currentValues[parentKey as keyof FreeCourseFormData] as any) };
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
      const currentArray = currentValues[parts[0] as keyof FreeCourseFormData] as any[];
      const newArray = [...currentArray, template];
      setValue(parts[0] as any, newArray);
    } else if (parts.length === 2) {
      const parentKey = parts[0];
      const childKey = parts[1];
      
      const parentObj = { ...(currentValues[parentKey as keyof FreeCourseFormData] as any) };
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
      const currentArray = currentValues[parts[0] as keyof FreeCourseFormData] as any[];
      const newArray = [...currentArray];
      newArray.splice(index, 1);
      setValue(parts[0] as any, newArray);
    } else if (parts.length === 2) {
      const parentKey = parts[0];
      const childKey = parts[1];
      
      const parentObj = { ...(currentValues[parentKey as keyof FreeCourseFormData] as any) };
      const newArray = [...parentObj[childKey]];
      newArray.splice(index, 1);
      
      setValue(parentKey as any, {
        ...parentObj,
        [childKey]: newArray,
      });
    }
  };

  // Enhanced form validation helper
  const validateFormData = (data: FreeCourseFormData): string[] => {
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
    if (!data.estimated_duration?.trim()) {
      errors.push('Estimated Duration is required');
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

    // Lessons validation
    if (!data.lessons || data.lessons.length === 0) {
      errors.push('At least one lesson is required');
    } else {
      data.lessons.forEach((lesson, index) => {
        if (!lesson.title?.trim()) {
          errors.push(`Lesson ${index + 1}: Title is required`);
        }
        if (!lesson.description?.trim()) {
          errors.push(`Lesson ${index + 1}: Description is required`);
        }
        if (!lesson.content?.trim()) {
          errors.push(`Lesson ${index + 1}: Content is required`);
        }
        if (lesson.content_type === 'video' && (!lesson.duration || lesson.duration <= 0)) {
          errors.push(`Lesson ${index + 1}: Duration is required for video lessons`);
        }
      });
    }

    // Resources validation
    if (data.resources && data.resources.length > 0) {
      data.resources.forEach((resource, index) => {
        if (!resource.title?.trim()) {
          errors.push(`Resource ${index + 1}: Title is required`);
        }
        if (!resource.url?.trim()) {
          errors.push(`Resource ${index + 1}: URL is required`);
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
              toast.error(message);
            }, index * 500);
          });
          
          if (formErrors.length > 3) {
            setTimeout(() => {
              toast.warning(`${formErrors.length - 3} more validation errors found.`);
            }, 1500);
          }
        } else {
          toast.error('Please check the form for errors');
        }
        return;
      }
      
      // If validation passes, submit the form
      await handleSubmit(onSubmit)();
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error('Failed to submit form');
    }
  };

  // Enhanced form submission with comprehensive validation
  const onSubmit = async (data: FreeCourseFormData) => {
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
            toast.error(error);
          }, index * 500);
        });

        if (validationErrors.length > 3) {
          setTimeout(() => {
            toast.warning(`${validationErrors.length - 3} more validation errors found. Please check the form.`);
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
        target_skills: data.target_skills?.filter(skill => skill?.trim()) || [],
        tools_technologies: data.tools_technologies?.filter(tool => tool?.name?.trim()) || [],
        faqs: data.faqs?.filter(faq => faq?.question?.trim() && faq?.answer?.trim()) || [],
        resources: data.resources?.filter(resource => resource?.title?.trim() && resource?.url?.trim()) || []
      };

      // Prepare the course data according to IFreeCourse interface
      const freeCourseData: IFreeCourse = {
        course_type: 'free',
        course_title: cleanedData.course_title,
        course_subtitle: cleanedData.course_subtitle,
        course_category: cleanedData.course_category,
        course_subcategory: cleanedData.course_subcategory,
        course_tag: cleanedData.course_tag,
        course_level: cleanedData.course_level,
        course_image: cleanedData.course_image,
        course_description: cleanedData.course_description,
        estimated_duration: cleanedData.estimated_duration,
        lessons: cleanedData.lessons.map(lesson => ({
          title: lesson.title,
          description: lesson.description,
          content_type: lesson.content_type,
          content: lesson.content,
          duration: lesson.duration,
          order: lesson.order,
          is_preview: lesson.is_preview || false
        })),
        prices: [], // Free courses have empty pricing array
        resources: cleanedData.resources,
        access_type: cleanedData.access_type,
        access_duration: cleanedData.access_duration,
        prerequisites: cleanedData.prerequisites,
        target_skills: cleanedData.target_skills,
        completion_certificate: cleanedData.completion_certificate,
        tools_technologies: cleanedData.tools_technologies,
        faqs: cleanedData.faqs,
        status: cleanedData.status,
        language: cleanedData.language,
        brochures: cleanedData.brochures
      };

      console.log('Sending course data to API:', freeCourseData);

      // Show loading toast
      const loadingToast = toast.loading('Creating free course...');

      try {
        // Create the course using the new API
        const response = await courseTypesAPI.createCourse(freeCourseData);
        
        console.log('API Response:', response);

        // Dismiss loading toast
        toast.dismiss(loadingToast);

        // Check for successful response
        if (response?.data?.success) {
          formSubmittedSuccessfully.current = true;
          toast.success(`Free course "${freeCourseData.course_title}" created successfully!`, {
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
      console.error("Error creating free course:", error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred while creating the course';
      
      setValidationMessage(errorMessage);
      toast.error(errorMessage, {
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
        toast.success('Draft saved successfully');
      } else {
        toast.error('Failed to save draft. Storage might be unavailable.');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
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
      toast.info('Draft cleared');
      reset();
    }
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
                Create Free Course
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Create a free course with self-paced content that anyone can access
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
                <label className={labelClass}>Estimated Duration *</label>
                <input
                  type="text"
                  {...register("estimated_duration", { required: "Estimated duration is required" })}
                  className={inputClass}
                  placeholder="e.g., 2 hours, 30 minutes"
                />
                {errors.estimated_duration && (
                  <p className={errorClass}>{errors.estimated_duration.message}</p>
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
                      onChange={(e) => handleStringArrayChange('course_description.learning_objectives', index, e.target.value)}
                      className={inputClass}
                      placeholder="e.g., Master ES6+ features and syntax"
                    />
                    {(watchedValues.course_description?.learning_objectives || ['']).length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStringArrayItem('course_description.learning_objectives', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addStringArrayItem('course_description.learning_objectives')}
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
                      onChange={(e) => handleStringArrayChange('course_description.course_requirements', index, e.target.value)}
                      className={inputClass}
                      placeholder="e.g., Basic JavaScript knowledge"
                    />
                    {(watchedValues.course_description?.course_requirements || ['']).length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStringArrayItem('course_description.course_requirements', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addStringArrayItem('course_description.course_requirements')}
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
                      onChange={(e) => handleStringArrayChange('course_description.target_audience', index, e.target.value)}
                      className={inputClass}
                      placeholder="e.g., Beginners wanting to learn programming"
                    />
                    {(watchedValues.course_description?.target_audience || ['']).length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStringArrayItem('course_description.target_audience', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addStringArrayItem('course_description.target_audience')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Target Audience
                </button>
              </div>
            </div>
          </div>

          {/* Lessons */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Course Lessons
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Add lessons that will be freely available to all students
            </p>
            
            {lessonFields.map((field, index) => (
              <div key={field.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Lesson {index + 1}
                  </h3>
                  {lessonFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLesson(index)}
                      className="text-red-500 hover:text-red-700 flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove Lesson
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Lesson Title *</label>
                    <input
                      {...register(`lessons.${index}.title` as const, { required: "Lesson title is required" })}
                      className={inputClass}
                      placeholder="Enter lesson title"
                    />
                    {errors.lessons?.[index]?.title && (
                      <p className={errorClass}>{errors.lessons[index]?.title?.message}</p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Content Type *</label>
                    <select
                      {...register(`lessons.${index}.content_type` as const)}
                      className={inputClass}
                    >
                      <option value="video">Video</option>
                      <option value="text">Text</option>
                      <option value="quiz">Quiz</option>
                      <option value="pdf">PDF</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelClass}>Description *</label>
                    <textarea
                      {...register(`lessons.${index}.description` as const, { required: "Description is required" })}
                      rows={2}
                      className={inputClass}
                      placeholder="Brief description of this lesson"
                    />
                    {errors.lessons?.[index]?.description && (
                      <p className={errorClass}>{errors.lessons[index]?.description?.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelClass}>Content URL/Text *</label>
                    {watchedValues.lessons?.[index]?.content_type === 'text' ? (
                      <textarea
                        {...register(`lessons.${index}.content` as const, { required: "Content is required" })}
                        rows={4}
                        className={inputClass}
                        placeholder="Enter lesson content text"
                      />
                    ) : (
                      <input
                        {...register(`lessons.${index}.content` as const, { required: "Content URL is required" })}
                        className={inputClass}
                        placeholder={`Enter ${watchedValues.lessons?.[index]?.content_type || 'video'} URL`}
                      />
                    )}
                    {errors.lessons?.[index]?.content && (
                      <p className={errorClass}>{errors.lessons[index]?.content?.message}</p>
                    )}
                  </div>

                  {watchedValues.lessons?.[index]?.content_type === 'video' && (
                    <div>
                      <label className={labelClass}>Duration (minutes) *</label>
                      <input
                        type="number"
                        {...register(`lessons.${index}.duration` as const, { 
                          valueAsNumber: true,
                          required: watchedValues.lessons?.[index]?.content_type === 'video' ? "Duration is required for video lessons" : false,
                          min: { value: 1, message: "Duration must be at least 1 minute" }
                        })}
                        className={inputClass}
                        min="1"
                        placeholder="e.g., 15"
                      />
                      {errors.lessons?.[index]?.duration && (
                        <p className={errorClass}>{errors.lessons[index]?.duration?.message}</p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className={labelClass}>Order</label>
                    <input
                      type="number"
                      {...register(`lessons.${index}.order` as const, { valueAsNumber: true })}
                      className={inputClass}
                      min="1"
                      defaultValue={index + 1}
                    />
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register(`lessons.${index}.is_preview` as const)}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Preview Lesson (visible before enrollment)</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => appendLesson({
                id: crypto.randomUUID(),
                title: '',
                description: '',
                content_type: 'video',
                content: '',
                duration: 0,
                order: lessonFields.length + 1,
                is_preview: false
              })}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Lesson
            </button>
          </div>

          {/* Resources */}
          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Additional Resources
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Add downloadable resources or links to external materials
            </p>
            
            {resourceFields.map((field, index) => (
              <div key={field.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-medium text-gray-900 dark:text-white">
                    Resource #{index + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeResource(index)}
                    className="text-red-500 hover:text-red-700 flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove Resource
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Resource Title *</label>
                    <input
                      {...register(`resources.${index}.title` as const, { required: "Resource title is required" })}
                      className={inputClass}
                      placeholder="e.g., Course Slides"
                    />
                    {errors.resources?.[index]?.title && (
                      <p className={errorClass}>{errors.resources[index]?.title?.message}</p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Resource Type</label>
                    <select
                      {...register(`resources.${index}.type` as const)}
                      className={inputClass}
                    >
                      <option value="pdf">PDF</option>
                      <option value="document">Document</option>
                      <option value="spreadsheet">Spreadsheet</option>
                      <option value="presentation">Presentation</option>
                      <option value="code">Code</option>
                      <option value="zip">ZIP Archive</option>
                      <option value="link">External Link</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelClass}>URL *</label>
                    <input
                      {...register(`resources.${index}.url` as const, { required: "Resource URL is required" })}
                      className={inputClass}
                      placeholder="https://example.com/resource.pdf"
                    />
                    {errors.resources?.[index]?.url && (
                      <p className={errorClass}>{errors.resources[index]?.url?.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelClass}>Description</label>
                    <textarea
                      {...register(`resources.${index}.description` as const)}
                      rows={2}
                      className={inputClass}
                      placeholder="Brief description of this resource"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => appendResource({
                title: '',
                url: '',
                description: '',
                type: 'pdf'
              })}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Resource
            </button>
          </div>

          {/* Access Settings */}
          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Access Settings
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Configure how long students can access this free course
            </p>
            
            <div className="space-y-6">
              <div>
                <label className={labelClass}>Access Type</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="unlimited"
                      {...register("access_type")}
                      className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">Unlimited Access (lifetime)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="time-limited"
                      {...register("access_type")}
                      className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">Time-Limited Access</span>
                  </label>
                </div>
              </div>

              {watchedValues.access_type === 'time-limited' && (
                <div>
                  <label className={labelClass}>Access Duration (days)</label>
                  <input
                    type="number"
                    {...register("access_duration", { 
                      valueAsNumber: true,
                      min: { value: 1, message: "Duration must be at least 1 day" }
                    })}
                    className={inputClass}
                    min="1"
                    placeholder="e.g., 30"
                  />
                  {errors.access_duration && (
                    <p className={errorClass}>{errors.access_duration.message}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Certification Settings */}
          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Certification Settings
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Configure certification requirements for this free course
            </p>
            
            <div className="space-y-6">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("completion_certificate.is_available")}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Offer Course Completion Certificate
                  </span>
                </label>
              </div>

              {watchedValues.completion_certificate?.is_available && (
                <div>
                  <label className={labelClass}>Minimum Lesson Completion Percentage</label>
                  <input
                    type="number"
                    {...register("completion_certificate.requirements.min_lessons_completed", { 
                      valueAsNumber: true,
                      min: { value: 1, message: "Percentage must be at least 1%" },
                      max: { value: 100, message: "Percentage cannot exceed 100%" }
                    })}
                    className={inputClass}
                    min="1"
                    max="100"
                    placeholder="100"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Percentage of lessons a student must complete to earn the certificate
                  </p>
                </div>
              )}
            </div>
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
                description: ''
              })}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Tool/Technology
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
                  Create Free Course
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 