"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { showToast } from '@/utils/toastManager';
import Link from "next/link";
import { debounce } from 'lodash';
import { ArrowLeft, Plus, Trash2, Upload, Save, Eye, CheckCircle, AlertCircle, AlertTriangle, Clock, BookOpen, Users, Award, DollarSign, Calendar, HelpCircle, Settings, Video, FileText } from "lucide-react";
import { courseTypesAPI } from "@/apis/courses";
import { apiUrls } from "@/apis";
import usePostQuery from "@/hooks/postQuery.hook";
import useGetQuery from "@/hooks/getQuery.hook";
import type { ILiveCourse, IUnifiedPrice, ICourseSchedule, ILiveCourseModule, ILiveCourseSession, IToolTechnology, IFAQ } from "@/apis/courses";

// Type definition for category item
interface CategoryItem {
  _id: string;
  category_name: string;
}

// Form data interface that matches the ILiveCourse API structure
interface LiveCourseFormData {
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
  course_schedule: ICourseSchedule;
  total_sessions: number;
  session_duration: number;
  modules: ILiveCourseModule[];
  max_students: number;
  prices: IUnifiedPrice[];
  tools_technologies?: IToolTechnology[];
  faqs?: IFAQ[];
  instructors?: string[];
  prerequisites?: string[];
  certification?: {
    is_certified?: boolean;
    attendance_required?: number;
  };
  status?: 'Draft' | 'Published' | 'Upcoming';
  language?: string;
  brochures?: string[];
  is_Quizes: 'Yes' | 'No';
  is_Projects: 'Yes' | 'No';
  is_Assignments: 'Yes' | 'No';
  is_Certification: 'Yes' | 'No';
  // Updated class_type options to match the schema
  class_type: 'Live Courses' | 'Blended Courses' | 'Self-Paced' | 'Virtual Learning' | 'Online Classes' | 'Hybrid' | 'Pre-Recorded' | '';
  course_duration: string;
  no_of_Sessions: number;
}

// Comprehensive form validation schema
const liveCourseSchema = yup.object().shape({
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
  course_schedule: yup.object().shape({
    start_date: yup.date().required('Start date is required'),
    end_date: yup.date().required('End date is required')
      .min(yup.ref('start_date'), 'End date must be after start date'),
    session_days: yup.array().of(yup.string()).min(1, 'At least one session day is required'),
    session_time: yup.string().required('Session time is required'),
    timezone: yup.string().required('Timezone is required')
  }),
  total_sessions: yup.number()
    .required('Total sessions is required')
    .min(1, 'At least one session is required')
    .integer('Total sessions must be a whole number'),
  session_duration: yup.number()
    .required('Session duration is required')
    .min(15, 'Session duration must be at least 15 minutes'),
  max_students: yup.number()
    .required('Maximum students is required')
    .min(1, 'At least one student must be allowed')
    .integer('Maximum students must be a whole number'),
  modules: yup.array().of(
    yup.object().shape({
      title: yup.string().required('Module title is required'),
      description: yup.string().required('Module description is required'),
      order: yup.number().required('Module order is required').min(1),
      sessions: yup.array().of(
        yup.object().shape({
          title: yup.string().required('Session title is required'),
          description: yup.string().required('Session description is required'),
          duration: yup.number().required('Session duration is required').min(15, 'Session must be at least 15 minutes'),
          scheduled_date: yup.date()
        })
      )
    })
  ).min(1, 'At least one module is required'),
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
    attendance_required: yup.number().min(0).max(100)
  }),
  status: yup.string(),
  language: yup.string(),
  brochures: yup.array().of(yup.string()),
  is_Quizes: yup.string().required('Quizzes status is required'),
  is_Projects: yup.string().required('Projects status is required'),
  is_Assignments: yup.string().required('Assignments status is required'),
  is_Certification: yup.string().required('Certification status is required'),
  class_type: yup.string().required('Class type is required')
    .oneOf(['Live Courses', 'Blended Courses', 'Self-Paced', 'Virtual Learning', 'Online Classes', 'Hybrid', 'Pre-Recorded', ''], 'Invalid class type'),
  course_duration: yup.string().required('Course duration is required'),
  no_of_Sessions: yup.number().required('Number of sessions is required').integer().min(1)
});

// Storage utility for auto-save functionality
const STORAGE_KEY = 'medh_live_course_draft';

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

// Constants for styling
const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
const inputClass = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";
const errorClass = "mt-1 text-sm text-red-600 dark:text-red-500";
const cardClass = "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6";
const buttonClass = "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
const primaryButtonClass = `${buttonClass} text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500`;
const secondaryButtonClass = `${buttonClass} text-gray-700 bg-white hover:bg-gray-50 border-gray-300 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:border-gray-600`;
const dangerButtonClass = `${buttonClass} text-white bg-red-600 hover:bg-red-700 focus:ring-red-500`;
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timezones = [
  'UTC', 'UTC+1', 'UTC+2', 'UTC+3', 'UTC+4', 'UTC+5', 'UTC+6', 'UTC+7', 'UTC+8', 'UTC+9', 'UTC+10', 'UTC+11', 'UTC+12',
  'UTC-1', 'UTC-2', 'UTC-3', 'UTC-4', 'UTC-5', 'UTC-6', 'UTC-7', 'UTC-8', 'UTC-9', 'UTC-10', 'UTC-11', 'UTC-12'
];

export default function CreateLiveCoursePage() {
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
  const [classType, setClassType] = useState<'Live Courses' | 'Blended Courses' | 'Self-Paced' | 'Virtual Learning' | 'Online Classes' | 'Hybrid' | 'Pre-Recorded' | ''>('');
  
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
  } = useForm<LiveCourseFormData>({
    resolver: yupResolver(liveCourseSchema) as any,
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
      course_schedule: {
        start_date: new Date(),
        end_date: new Date(new Date().setMonth(new Date().getMonth() + 2)),
        session_days: ['Monday', 'Wednesday'],
        session_time: '18:00',
        timezone: 'UTC'
      },
      total_sessions: 16,
      session_duration: 90,
      modules: [{
        title: 'Module 1: Introduction',
        description: 'Getting started with the course',
        order: 1,
        sessions: []
      }],
      max_students: 30,
      prices: [{
        currency: 'USD',
        individual: 499,
        batch: 399,
        min_batch_size: 5,
        max_batch_size: 20,
        early_bird_discount: 10,
        group_discount: 15,
        is_active: true
      }],
      tools_technologies: [],
      faqs: [],
      prerequisites: [''],
      instructors: [],
      certification: {
        is_certified: true,
        attendance_required: 80
      },
      status: 'Draft',
      language: 'English',
      brochures: [],
      is_Quizes: 'Yes',
      is_Projects: 'Yes', 
      is_Assignments: 'Yes',
      is_Certification: 'Yes',
      class_type: 'Live Courses',
      course_duration: '8 weeks',
      no_of_Sessions: 16
    }
  });

  // Define field arrays for form elements
  const { fields: moduleFields, append: appendModule, remove: removeModule } = useFieldArray({
    control,
    name: "modules"
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
    debounce(async (data: LiveCourseFormData) => {
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
          
          // Handle date conversion for course_schedule
          if (parsedDraft.course_schedule) {
            if (parsedDraft.course_schedule.start_date) {
              parsedDraft.course_schedule.start_date = new Date(parsedDraft.course_schedule.start_date);
            }
            if (parsedDraft.course_schedule.end_date) {
              parsedDraft.course_schedule.end_date = new Date(parsedDraft.course_schedule.end_date);
            }
          }
          
          // Handle date conversion for session scheduled_dates
          if (parsedDraft.modules) {
            parsedDraft.modules.forEach((module: any) => {
              if (module.sessions) {
                module.sessions.forEach((session: any) => {
                  if (session.scheduled_date) {
                    session.scheduled_date = new Date(session.scheduled_date);
                  }
                });
              }
            });
          }
          
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
    if (!file) {
      toast.error('Please select a valid image file');
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
                setCourseImage(imageUrl);
                setValue('course_image', imageUrl, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true
                });
                showToast.success('Image uploaded successfully');
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
        }
      };
      
      reader.onerror = () => {
        toast.error('Failed to read image file');
      };
    } catch (error) {
      console.error("Error in handleImageUpload:", error);
      toast.error('Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  };

  // Handle brochure PDF upload
  const [brochureUploading, setBrochureUploading] = useState(false);
  
  const handleBrochureUpload = async (file: File) => {
    if (!file) {
      toast.error('Please select a valid PDF file');
      return;
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed for brochures');
      return;
    }

    // Validate file size (e.g., max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error('File size must be less than 10MB');
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
                toast.error('Invalid brochure upload response format');
              }
            },
            onFail: (error) => {
              console.error("Brochure upload error:", error);
              toast.error('Brochure upload failed. Please try again.');
            },
          });
        }
      };
      
      reader.onerror = () => {
        toast.error('Failed to read PDF file');
      };
    } catch (error) {
      console.error("Error in handleBrochureUpload:", error);
      toast.error('Failed to upload brochure');
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

  // Handle string array changes (for prerequisites, learning objectives, etc.)
  const handleStringArrayChange = (arrayPath: string, index: number, value: string) => {
    const currentValues = getValues();
    const parts = arrayPath.split(".");
    
    if (parts.length === 1) {
      const currentArray = currentValues[parts[0] as keyof LiveCourseFormData] as any[];
      const newArray = [...currentArray];
      newArray[index] = value;
      setValue(parts[0] as any, newArray);
    } else if (parts.length === 2) {
      const parentKey = parts[0];
      const childKey = parts[1];
      
      const parentObj = { ...(currentValues[parentKey as keyof LiveCourseFormData] as any) };
      const newArray = [...parentObj[childKey]];
      newArray[index] = value;
      
      setValue(parentKey as any, {
        ...parentObj,
        [childKey]: newArray,
      });
    }
  };

  // Add string array item
  const addStringArrayItem = (arrayPath: string, template: string = "") => {
    const currentValues = getValues();
    const parts = arrayPath.split(".");
    
    if (parts.length === 1) {
      const currentArray = currentValues[parts[0] as keyof LiveCourseFormData] as any[];
      const newArray = [...currentArray, template];
      setValue(parts[0] as any, newArray);
    } else if (parts.length === 2) {
      const parentKey = parts[0];
      const childKey = parts[1];
      
      const parentObj = { ...(currentValues[parentKey as keyof LiveCourseFormData] as any) };
      const newArray = [...parentObj[childKey], template];
      
      setValue(parentKey as any, {
        ...parentObj,
        [childKey]: newArray,
      });
    }
  };

  // Remove string array item
  const removeStringArrayItem = (arrayPath: string, index: number) => {
    const currentValues = getValues();
    const parts = arrayPath.split(".");
    
    if (parts.length === 1) {
      const currentArray = currentValues[parts[0] as keyof LiveCourseFormData] as any[];
      const newArray = [...currentArray];
      newArray.splice(index, 1);
      setValue(parts[0] as any, newArray);
    } else if (parts.length === 2) {
      const parentKey = parts[0];
      const childKey = parts[1];
      
      const parentObj = { ...(currentValues[parentKey as keyof LiveCourseFormData] as any) };
      const newArray = [...parentObj[childKey]];
      newArray.splice(index, 1);
      
      setValue(parentKey as any, {
        ...parentObj,
        [childKey]: newArray,
      });
    }
  };

  // Add session to module
  const addSessionToModule = (moduleIndex: number) => {
    const currentModules = [...watchedValues.modules];
    if (!currentModules[moduleIndex].sessions) {
      currentModules[moduleIndex].sessions = [];
    }
    
    const newSession: ILiveCourseSession = {
      title: `Session ${(currentModules[moduleIndex].sessions?.length || 0) + 1}`,
      description: '',
      duration: watchedValues.session_duration || 120
    };
    
    currentModules[moduleIndex].sessions!.push(newSession);
    setValue('modules', currentModules);
  };

  // Remove session from module
  const removeSessionFromModule = (moduleIndex: number, sessionIndex: number) => {
    const currentModules = [...watchedValues.modules];
    currentModules[moduleIndex].sessions!.splice(sessionIndex, 1);
    setValue('modules', currentModules);
  };

  // Enhanced form validation helper
  const validateFormData = (data: LiveCourseFormData): string[] => {
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

    // Properly validate class_type
    if (!data.class_type) {
      errors.push('Class type is required');
    } else if (
      !['Live Courses', 'Blended Courses', 'Self-Paced', 'Virtual Learning', 'Online Classes', 'Hybrid', 'Pre-Recorded'].includes(data.class_type as string)
    ) {
      errors.push('Invalid class type selected');
    }
    
    if (!data.course_duration?.trim()) {
      errors.push('Course Duration is required');
    }
    
    if (!data.no_of_Sessions || data.no_of_Sessions < 1) {
      errors.push('Number of Sessions is required and must be at least 1');
    }

    // Check other required fields for the course
    if (!data.is_Quizes) {
      errors.push('Quizzes status is required');
    }
    
    if (!data.is_Projects) {
      errors.push('Projects status is required');
    }
    
    if (!data.is_Assignments) {
      errors.push('Assignments status is required');
    }
    
    if (!data.is_Certification) {
      errors.push('Certification status is required');
    }

    // Continue with other validations...
    
    return errors;
  };

  // Form submission handler
  const onSubmit = async (data: LiveCourseFormData) => {
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
        tools_technologies: data.tools_technologies?.filter(tool => tool?.name?.trim()) || [],
        faqs: data.faqs?.filter(faq => faq?.question?.trim() && faq?.answer?.trim()) || []
      };

      // Ensure class_type is valid (not empty)
      if (!cleanedData.class_type) {
        toast.error('Class type is required');
        return;
      }
      
      // Check if the class_type is one of the valid options
      const validClassTypes = ['Live Courses', 'Blended Courses', 'Self-Paced', 'Virtual Learning', 'Online Classes', 'Hybrid', 'Pre-Recorded'];
      if (!validClassTypes.includes(cleanedData.class_type as string)) {
        toast.error('Invalid class type selected');
        return;
      }

      // Prepare the course data according to ILiveCourse interface
      const liveCourseData: Omit<ILiveCourse, 'class_type'> & { class_type: 'group' | 'one-to-one' | 'both' } = {
        course_type: 'live',
        course_title: cleanedData.course_title,
        course_subtitle: cleanedData.course_subtitle,
        course_category: cleanedData.course_category,
        course_subcategory: cleanedData.course_subcategory,
        course_tag: cleanedData.course_tag,
        course_level: cleanedData.course_level,
        course_image: cleanedData.course_image,
        course_description: cleanedData.course_description,
        course_schedule: cleanedData.course_schedule,
        total_sessions: cleanedData.total_sessions,
        session_duration: cleanedData.session_duration,
        modules: cleanedData.modules,
        max_students: cleanedData.max_students,
        prices: cleanedData.prices,
        tools_technologies: cleanedData.tools_technologies,
        faqs: cleanedData.faqs,
        instructors: cleanedData.instructors,
        prerequisites: cleanedData.prerequisites,
        certification: cleanedData.certification,
        status: cleanedData.status,
        language: cleanedData.language,
        brochures: cleanedData.brochures,
        is_Quizes: cleanedData.is_Quizes,
        is_Projects: cleanedData.is_Projects,
        is_Assignments: cleanedData.is_Assignments,
        is_Certification: cleanedData.is_Certification,
        // Force type casting to avoid TypeScript error
        class_type: cleanedData.class_type as 'group' | 'one-to-one' | 'both',
        course_duration: cleanedData.course_duration,
        no_of_Sessions: cleanedData.no_of_Sessions
      };
      
      // Submit the course data
      await postQuery({
        url: apiUrls.courses.createCourse,
        postData: liveCourseData,
        onSuccess: (response) => {
          if (response?.data?._id) {
            // Mark form as successfully submitted
            formSubmittedSuccessfully.current = true;
            
            // Clear the draft
            storageUtil.removeItem(STORAGE_KEY);
            
            // Show success message
            showToast.success('Live course created successfully!');
            
            // Redirect to course management page
            setTimeout(() => {
              window.location.href = '/dashboards/admin/courses/manage';
            }, 2000);
          } else {
            toast.error('Failed to create course. Please try again.');
          }
        },
        onFail: (error) => {
          console.error("Course creation error:", error);
          toast.error('Failed to create course. Please check the form and try again.');
        },
      });
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add this effect to keep classType in sync with form value
  useEffect(() => {
    if (watchedValues.class_type) {
      setClassType(watchedValues.class_type);
    }
  }, [watchedValues.class_type]);

  // Render the component
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
                Create Live Course
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Create a live, instructor-led course with real-time sessions
              </p>
            </div>
            
            {/* Draft status */}
            <div className="flex items-center space-x-4">
              {isDraftSaving && (
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <Clock className="h-3 w-3 mr-1 animate-pulse" />
                  Saving...
                </span>
              )}
              
              {!isDraftSaving && lastSaved && (
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                  Last saved: {lastSaved}
                </span>
              )}
              
              {hasSavedDraft && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to discard your draft? This action cannot be undone.')) {
                      storageUtil.removeItem(STORAGE_KEY);
                      window.location.reload();
                    }
                  }}
                  className="text-xs text-red-600 dark:text-red-400 hover:underline"
                >
                  Discard Draft
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Form */}
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
                  placeholder="Enter course subtitle (optional)"
                />
                {errors.course_subtitle && (
                  <p className={errorClass}>{errors.course_subtitle.message}</p>
                )}
              </div>
              
              <div>
                <label className={labelClass}>Category *</label>
                <select
                  {...register("course_category", { required: "Course category is required" })}
                  className={inputClass}
                >
                  <option value="">Select a category</option>
                  {isLoadingCategories ? (
                    <option disabled>Loading categories...</option>
                  ) : (
                    categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.category_name}
                      </option>
                    ))
                  )}
                </select>
                {errors.course_category && (
                  <p className={errorClass}>{errors.course_category.message}</p>
                )}
              </div>
              
              <div>
                <label className={labelClass}>Subcategory</label>
                <input
                  type="text"
                  {...register("course_subcategory")}
                  className={inputClass}
                  placeholder="Enter subcategory (optional)"
                />
                {errors.course_subcategory && (
                  <p className={errorClass}>{errors.course_subcategory.message}</p>
                )}
              </div>
              
              <div>
                <label className={labelClass}>Course Tag</label>
                <input
                  type="text"
                  {...register("course_tag")}
                  className={inputClass}
                  placeholder="Enter course tag (optional)"
                />
                {errors.course_tag && (
                  <p className={errorClass}>{errors.course_tag.message}</p>
                )}
              </div>
              
              <div>
                <label className={labelClass}>Course Level *</label>
                <select
                  {...register("course_level", { required: "Course level is required" })}
                  className={inputClass}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="All Levels">All Levels</option>
                </select>
                {errors.course_level && (
                  <p className={errorClass}>{errors.course_level.message}</p>
                )}
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
                  <option value="German">German</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Arabic">Arabic</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className={labelClass}>Course Image *</label>
                <div className="mt-1 flex items-center">
                  <div
                    className="w-32 h-32 rounded-md border border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden relative"
                  >
                    {courseImage ? (
                      <img
                        src={courseImage}
                        alt="Course cover"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 dark:text-gray-500 text-center p-2">
                        <Upload className="h-10 w-10 mx-auto mb-1" />
                        <span className="text-xs">Upload Image</span>
                      </div>
                    )}
                    
                    <input
                      type="file"
                      id="course-image"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleImageUpload(e.target.files[0]);
                        }
                      }}
                    />
                    
                    <input
                      type="hidden"
                      {...register("course_image", { required: "Course image is required" })}
                    />
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <label
                      htmlFor="course-image"
                      className={`${secondaryButtonClass} cursor-pointer`}
                    >
                      {imageUploading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          {courseImage ? "Change Image" : "Upload Image"}
                        </>
                      )}
                    </label>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Recommended size: 1280x720 pixels (16:9 aspect ratio)
                    </p>
                  </div>
                </div>
                {errors.course_image && (
                  <p className={errorClass}>{errors.course_image.message}</p>
                )}
              </div>
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
                  placeholder="Describe the benefits and outcomes students will gain from this course..."
                />
                {errors.course_description?.benefits && (
                  <p className={errorClass}>{errors.course_description.benefits.message}</p>
                )}
              </div>
              
              {/* Learning Objectives */}
              <div>
                <label className={labelClass}>Learning Objectives</label>
                {watchedValues.course_description?.learning_objectives?.map((objective, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => handleStringArrayChange("course_description.learning_objectives", index, e.target.value)}
                      className={inputClass}
                      placeholder={`Learning objective ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeStringArrayItem("course_description.learning_objectives", index)}
                      className="ml-2 p-1 text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addStringArrayItem("course_description.learning_objectives")}
                  className={`${secondaryButtonClass} mt-2`}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Learning Objective
                </button>
              </div>
              
              {/* Course Requirements */}
              <div>
                <label className={labelClass}>Course Requirements</label>
                {watchedValues.course_description?.course_requirements?.map((requirement, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={requirement}
                      onChange={(e) => handleStringArrayChange("course_description.course_requirements", index, e.target.value)}
                      className={inputClass}
                      placeholder={`Requirement ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeStringArrayItem("course_description.course_requirements", index)}
                      className="ml-2 p-1 text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addStringArrayItem("course_description.course_requirements")}
                  className={`${secondaryButtonClass} mt-2`}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Requirement
                </button>
              </div>
              
              {/* Target Audience */}
              <div>
                <label className={labelClass}>Target Audience</label>
                {watchedValues.course_description?.target_audience?.map((audience, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={audience}
                      onChange={(e) => handleStringArrayChange("course_description.target_audience", index, e.target.value)}
                      className={inputClass}
                      placeholder={`Target audience ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeStringArrayItem("course_description.target_audience", index)}
                      className="ml-2 p-1 text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addStringArrayItem("course_description.target_audience")}
                  className={`${secondaryButtonClass} mt-2`}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Target Audience
                </button>
              </div>
              
              {/* Prerequisites */}
              <div>
                <label className={labelClass}>Prerequisites</label>
                {watchedValues.prerequisites?.map((prerequisite, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={prerequisite}
                      onChange={(e) => handleStringArrayChange("prerequisites", index, e.target.value)}
                      className={inputClass}
                      placeholder={`Prerequisite ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeStringArrayItem("prerequisites", index)}
                      className="ml-2 p-1 text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addStringArrayItem("prerequisites")}
                  className={`${secondaryButtonClass} mt-2`}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Prerequisite
                </button>
              </div>
            </div>
          </div>

          {/* Course Schedule */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Course Schedule
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Set up the live session schedule for this course
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Start Date *</label>
                <input
                  type="date"
                  {...register("course_schedule.start_date", { required: "Start date is required" })}
                  className={inputClass}
                />
                {errors.course_schedule?.start_date && (
                  <p className={errorClass}>{errors.course_schedule.start_date.message}</p>
                )}
              </div>
              
              <div>
                <label className={labelClass}>End Date *</label>
                <input
                  type="date"
                  {...register("course_schedule.end_date", { required: "End date is required" })}
                  className={inputClass}
                />
                {errors.course_schedule?.end_date && (
                  <p className={errorClass}>{errors.course_schedule.end_date.message}</p>
                )}
              </div>
              
              <div>
                <label className={labelClass}>Session Days *</label>
                <div className="mt-1 grid grid-cols-7 gap-2">
                  {weekdays.map((day) => (
                    <label key={day} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={day}
                        {...register("course_schedule.session_days", { required: "At least one day must be selected" })}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{day.substring(0, 3)}</span>
                    </label>
                  ))}
                </div>
                {errors.course_schedule?.session_days && (
                  <p className={errorClass}>{errors.course_schedule.session_days.message}</p>
                )}
              </div>
              
              <div>
                <label className={labelClass}>Session Time *</label>
                <input
                  type="text"
                  {...register("course_schedule.session_time", { required: "Session time is required" })}
                  className={inputClass}
                  placeholder="e.g., 18:00 - 20:00"
                />
                {errors.course_schedule?.session_time && (
                  <p className={errorClass}>{errors.course_schedule.session_time.message}</p>
                )}
              </div>
              
              <div>
                <label className={labelClass}>Timezone *</label>
                <select
                  {...register("course_schedule.timezone", { required: "Timezone is required" })}
                  className={inputClass}
                >
                  <option value="">Select a timezone</option>
                  {timezones.map((timezone) => (
                    <option key={timezone} value={timezone}>
                      {timezone}
                    </option>
                  ))}
                </select>
                {errors.course_schedule?.timezone && (
                  <p className={errorClass}>{errors.course_schedule.timezone.message}</p>
                )}
              </div>
              
              <div>
                <label className={labelClass}>Total Sessions *</label>
                <input
                  type="number"
                  {...register("total_sessions", { 
                    required: "Total sessions is required",
                    min: {
                      value: 1,
                      message: "At least one session is required"
                    }
                  })}
                  className={inputClass}
                  min="1"
                  placeholder="Number of total sessions"
                />
                {errors.total_sessions && (
                  <p className={errorClass}>{errors.total_sessions.message}</p>
                )}
              </div>
              
              <div>
                <label className={labelClass}>Session Duration (minutes) *</label>
                <input
                  type="number"
                  {...register("session_duration", { 
                    required: "Session duration is required",
                    min: {
                      value: 15,
                      message: "Session must be at least 15 minutes"
                    }
                  })}
                  className={inputClass}
                  min="15"
                  placeholder="Duration in minutes"
                />
                {errors.session_duration && (
                  <p className={errorClass}>{errors.session_duration.message}</p>
                )}
              </div>
              
              <div>
                <label className={labelClass}>Maximum Students *</label>
                <input
                  type="number"
                  {...register("max_students", { 
                    required: "Maximum students is required",
                    min: {
                      value: 1,
                      message: "At least one student must be allowed"
                    }
                  })}
                  className={inputClass}
                  min="1"
                  placeholder="Maximum number of students"
                />
                {errors.max_students && (
                  <p className={errorClass}>{errors.max_students.message}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Course Modules and Sessions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Course Modules and Sessions
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Organize your course content into modules and sessions
            </p>
            
            {moduleFields.map((field, moduleIndex) => (
              <div key={field.id} className="mb-8 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Module #{moduleIndex + 1}
                  </h3>
                  
                  {moduleIndex > 0 && (
                    <button
                      type="button"
                      onClick={() => removeModule(moduleIndex)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Module Title *</label>
                    <input
                      {...register(`modules.${moduleIndex}.title` as const, { required: "Module title is required" })}
                      className={inputClass}
                      placeholder="Enter module title"
                    />
                    {errors.modules?.[moduleIndex]?.title && (
                      <p className={errorClass}>{errors.modules[moduleIndex]?.title?.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className={labelClass}>Module Description *</label>
                    <textarea
                      {...register(`modules.${moduleIndex}.description` as const, { required: "Module description is required" })}
                      className={inputClass}
                      rows={2}
                      placeholder="Describe this module's content and objectives"
                    />
                    {errors.modules?.[moduleIndex]?.description && (
                      <p className={errorClass}>{errors.modules[moduleIndex]?.description?.message}</p>
                    )}
                  </div>
                  
                  <input
                    type="hidden"
                    {...register(`modules.${moduleIndex}.order` as const)}
                    value={moduleIndex + 1}
                  />
                  
                  {/* Sessions within this module */}
                  <div className="mt-4">
                    <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">
                      Sessions
                    </h4>
                    
                    {watchedValues.modules[moduleIndex].sessions?.map((session, sessionIndex) => (
                      <div key={sessionIndex} className="border border-gray-200 dark:border-gray-700 rounded p-3 mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Session #{sessionIndex + 1}
                          </h5>
                          
                          <button
                            type="button"
                            onClick={() => removeSessionFromModule(moduleIndex, sessionIndex)}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className={`${labelClass} text-sm`}>Session Title *</label>
                            <input
                              {...register(`modules.${moduleIndex}.sessions.${sessionIndex}.title` as const, { required: "Session title is required" })}
                              className={inputClass}
                              placeholder="Enter session title"
                            />
                          </div>
                          
                          <div>
                            <label className={`${labelClass} text-sm`}>Session Description *</label>
                            <textarea
                              {...register(`modules.${moduleIndex}.sessions.${sessionIndex}.description` as const, { required: "Session description is required" })}
                              className={inputClass}
                              rows={2}
                              placeholder="Describe what will be covered in this session"
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className={`${labelClass} text-sm`}>Duration (minutes) *</label>
                              <input
                                type="number"
                                {...register(`modules.${moduleIndex}.sessions.${sessionIndex}.duration` as const, { 
                                  required: "Duration is required",
                                  min: {
                                    value: 15,
                                    message: "Session must be at least 15 minutes"
                                  }
                                })}
                                className={inputClass}
                                min="15"
                                placeholder="Duration in minutes"
                              />
                            </div>
                            
                            <div>
                              <label className={`${labelClass} text-sm`}>Scheduled Date</label>
                              <input
                                type="date"
                                {...register(`modules.${moduleIndex}.sessions.${sessionIndex}.scheduled_date` as const)}
                                className={inputClass}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => addSessionToModule(moduleIndex)}
                      className={`${secondaryButtonClass} mt-2 w-full`}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Session
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => appendModule({
                title: `Module ${moduleFields.length + 1}`,
                description: '',
                order: moduleFields.length + 1,
                sessions: [{
                  title: `Session 1`,
                  description: '',
                  duration: watchedValues.session_duration || 120
                }]
              })}
              className={`${primaryButtonClass} mt-4`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Module
            </button>
          </div>

          {/* Pricing */}
          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Pricing
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Set pricing options for individual and batch enrollments
            </p>
            
            {priceFields.map((field, index) => (
              <div key={field.id} className="mb-6 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Pricing Configuration #{index + 1}
                  </h3>
                  
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removePrice(index)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Currency *</label>
                    <select
                      {...register(`prices.${index}.currency` as const, { required: "Currency is required" })}
                      className={inputClass}
                    >
                      <option value="">Select Currency</option>
                      <option value="USD">USD (US Dollar)</option>
                      <option value="EUR">EUR (Euro)</option>
                      <option value="GBP">GBP (British Pound)</option>
                      <option value="INR">INR (Indian Rupee)</option>
                      <option value="CAD">CAD (Canadian Dollar)</option>
                      <option value="AUD">AUD (Australian Dollar)</option>
                      <option value="JPY">JPY (Japanese Yen)</option>
                      <option value="CNY">CNY (Chinese Yuan)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className={labelClass}>Individual Price *</label>
                    <input
                      type="number"
                      {...register(`prices.${index}.individual` as const, { 
                        required: "Individual price is required",
                        min: {
                          value: 0,
                          message: "Price cannot be negative"
                        }
                      })}
                      className={inputClass}
                      placeholder="Price for individual enrollment"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div>
                    <label className={labelClass}>Batch Price (per student) *</label>
                    <input
                      type="number"
                      {...register(`prices.${index}.batch` as const, { 
                        required: "Batch price is required",
                        min: {
                          value: 0,
                          message: "Price cannot be negative"
                        }
                      })}
                      className={inputClass}
                      placeholder="Price per student for batch enrollment"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div>
                    <label className={labelClass}>Minimum Batch Size *</label>
                    <input
                      type="number"
                      {...register(`prices.${index}.min_batch_size` as const, { 
                        required: "Minimum batch size is required",
                        min: {
                          value: 2,
                          message: "Minimum batch size must be at least 2"
                        }
                      })}
                      className={inputClass}
                      placeholder="Minimum students for batch pricing"
                      min="2"
                    />
                  </div>
                  
                  <div>
                    <label className={labelClass}>Maximum Batch Size *</label>
                    <input
                      type="number"
                      {...register(`prices.${index}.max_batch_size` as const, { 
                        required: "Maximum batch size is required",
                        min: {
                          value: 2,
                          message: "Maximum batch size must be at least 2"
                        }
                      })}
                      className={inputClass}
                      placeholder="Maximum students for batch pricing"
                      min="2"
                    />
                  </div>
                  
                  <div>
                    <label className={labelClass}>Early Bird Discount (%)</label>
                    <input
                      type="number"
                      {...register(`prices.${index}.early_bird_discount` as const, {
                        min: {
                          value: 0,
                          message: "Discount cannot be negative"
                        },
                        max: {
                          value: 100,
                          message: "Discount cannot exceed 100%"
                        }
                      })}
                      className={inputClass}
                      placeholder="Early bird discount percentage"
                      min="0"
                      max="100"
                    />
                  </div>
                  
                  <div>
                    <label className={labelClass}>Group Discount (%)</label>
                    <input
                      type="number"
                      {...register(`prices.${index}.group_discount` as const, {
                        min: {
                          value: 0,
                          message: "Discount cannot be negative"
                        },
                        max: {
                          value: 100,
                          message: "Discount cannot exceed 100%"
                        }
                      })}
                      className={inputClass}
                      placeholder="Group discount percentage"
                      min="0"
                      max="100"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        {...register(`prices.${index}.is_active` as const)}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Active pricing configuration</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => appendPrice({
                currency: "USD",
                individual: 299,
                batch: 249,
                min_batch_size: 5,
                max_batch_size: 20,
                early_bird_discount: 15,
                group_discount: 20,
                is_active: true
              })}
              className={`${secondaryButtonClass} mt-2`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Pricing Configuration
            </button>
          </div>
          
          {/* Certification */}
          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Certification
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Configure certification requirements for this course
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-2 mb-4">
                  <input
                    type="checkbox"
                    {...register("certification.is_certified")}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">This course offers a completion certificate</span>
                </label>
              </div>
              
              {watchedValues.certification?.is_certified && (
                <div>
                  <label className={labelClass}>Attendance Required (%)</label>
                  <input
                    type="number"
                    {...register("certification.attendance_required", {
                      min: {
                        value: 0,
                        message: "Attendance percentage cannot be negative"
                      },
                      max: {
                        value: 100,
                        message: "Attendance percentage cannot exceed 100%"
                      }
                    })}
                    className={inputClass}
                    placeholder="Minimum attendance required for certification"
                    min="0"
                    max="100"
                  />
                  {errors.certification?.attendance_required && (
                    <p className={errorClass}>{errors.certification.attendance_required.message}</p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Tools and Technologies */}
          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Tools & Technologies
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Add tools and technologies that will be covered in this course
            </p>
            
            {toolsFields.map((field, index) => (
              <div key={field.id} className="flex items-center mb-4">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <input
                      type="text"
                      {...register(`tools_technologies.${index}.name` as const, { required: "Tool name is required" })}
                      className={inputClass}
                      placeholder="Tool/Technology Name"
                    />
                  </div>
                  
                  <div>
                    <select
                      {...register(`tools_technologies.${index}.category` as const)}
                      className={inputClass}
                    >
                      <option value="programming_language">Programming Language</option>
                      <option value="framework">Framework</option>
                      <option value="library">Library</option>
                      <option value="tool">Tool</option>
                      <option value="platform">Platform</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <input
                      type="text"
                      {...register(`tools_technologies.${index}.logo_url` as const)}
                      className={inputClass}
                      placeholder="Logo URL (optional)"
                    />
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => removeTool(index)}
                  className="ml-2 p-1 text-red-500 hover:text-red-700 focus:outline-none"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
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
              className={`${secondaryButtonClass} mt-2`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Tool/Technology
            </button>
          </div>
          
          {/* FAQs */}
          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <HelpCircle className="h-5 w-5 mr-2" />
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Add FAQs to help potential students make informed decisions
            </p>
            
            {faqFields.map((field, index) => (
              <div key={field.id} className="mb-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-md font-medium text-gray-900 dark:text-white">
                    FAQ #{index + 1}
                  </h3>
                  
                  <button
                    type="button"
                    onClick={() => removeFaq(index)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className={labelClass}>Question *</label>
                    <input
                      type="text"
                      {...register(`faqs.${index}.question` as const, { required: "Question is required" })}
                      className={inputClass}
                      placeholder="Enter a frequently asked question"
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
                      placeholder="Provide a clear and helpful answer"
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
              className={`${secondaryButtonClass} mt-2`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add FAQ
            </button>
          </div>
          
          {/* Brochures */}
          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Brochures
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Upload PDF brochures for this course
            </p>
            
            <div className="space-y-4">
              {watchedValues.brochures && watchedValues.brochures.length > 0 ? (
                <div className="space-y-2">
                  {watchedValues.brochures.map((brochure, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-500 mr-2" />
                        <a 
                          href={brochure} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          {brochure.split('/').pop() || `Brochure ${index + 1}`}
                        </a>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => removeBrochure(index)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No brochures uploaded yet
                </p>
              )}
              
              <div className="mt-4">
                <label
                  htmlFor="brochure-upload"
                  className={`${secondaryButtonClass} cursor-pointer`}
                >
                  {brochureUploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Brochure
                    </>
                  )}
                </label>
                <input
                  id="brochure-upload"
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleBrochureUpload(e.target.files[0]);
                    }
                  }}
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Upload PDF brochures only (max 10MB)
                </p>
              </div>
            </div>
          </div>

          {/* Course Features */}
          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Course Features
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Configure the features and components available in this course
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className={labelClass}>
                  Class Type *
                </label>
                <select
                  {...register("class_type", {
                    required: "Class type is required",
                    validate: value => value !== "" || "Class type is required"
                  })}
                  className={inputClass}
                  onChange={(e) => {
                    // Ensure empty value is never passed to API
                    if (e.target.value) {
                      setValue('class_type', e.target.value as 'Live Courses' | 'Blended Courses' | 'Self-Paced' | 'Virtual Learning' | 'Online Classes' | 'Hybrid' | 'Pre-Recorded');
                    }
                  }}
                >
                  <option value="">Select class type</option>
                  <option value="Live Courses">Live Courses</option>
                  <option value="Blended Courses">Blended Courses</option>
                  <option value="Self-Paced">Self-Paced</option>
                  <option value="Virtual Learning">Virtual Learning</option>
                  <option value="Online Classes">Online Classes</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Pre-Recorded">Pre-Recorded</option>
                </select>
                {errors.class_type && (
                  <p className={errorClass}>{errors.class_type.message}</p>
                )}
              </div>
              
              <div>
                <label className={labelClass}>
                  Course Duration *
                </label>
                <input
                  type="text"
                  {...register("course_duration", { required: "Course duration is required" })}
                  className={inputClass}
                  placeholder="e.g., 8 weeks"
                />
                {errors.course_duration && (
                  <p className={errorClass}>{errors.course_duration.message}</p>
                )}
              </div>
              
              <div>
                <label className={labelClass}>
                  Number of Sessions *
                </label>
                <input
                  type="number"
                  {...register("no_of_Sessions", {
                    required: "Number of sessions is required",
                    valueAsNumber: true,
                    min: { value: 1, message: "At least one session is required" }
                  })}
                  className={inputClass}
                  min="1"
                  placeholder="Total number of sessions"
                />
                {errors.no_of_Sessions && (
                  <p className={errorClass}>{errors.no_of_Sessions.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>
                  Include Quizzes *
                </label>
                <select
                  {...register("is_Quizes", { required: "Quizzes status is required" })}
                  className={inputClass}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {errors.is_Quizes && (
                  <p className={errorClass}>{errors.is_Quizes.message}</p>
                )}
              </div>
              
              <div>
                <label className={labelClass}>
                  Include Projects *
                </label>
                <select
                  {...register("is_Projects", { required: "Projects status is required" })}
                  className={inputClass}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {errors.is_Projects && (
                  <p className={errorClass}>{errors.is_Projects.message}</p>
                )}
              </div>
              
              <div>
                <label className={labelClass}>
                  Include Assignments *
                </label>
                <select
                  {...register("is_Assignments", { required: "Assignments status is required" })}
                  className={inputClass}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {errors.is_Assignments && (
                  <p className={errorClass}>{errors.is_Assignments.message}</p>
                )}
              </div>
              
              <div>
                <label className={labelClass}>
                  Include Certification *
                </label>
                <select
                  {...register("is_Certification", { required: "Certification status is required" })}
                  className={inputClass}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {errors.is_Certification && (
                  <p className={errorClass}>{errors.is_Certification.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className={`${primaryButtonClass} px-4 py-2`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </button>
            <button
              type="button"
              onClick={() => reset()}
              className={`${secondaryButtonClass} px-4 py-2`}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 