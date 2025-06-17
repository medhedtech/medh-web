"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ICourseFormData } from '@/types/course.types';
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
import { showToast } from '@/utils/toastManager';
import { apiUrls } from "@/apis";
import usePostQuery from "@/hooks/postQuery.hook";
import useGetQuery from "@/hooks/getQuery.hook";
import ThemeController from '@/components/shared/others/ThemeController';
import { storeExternalToken } from '@/utils/auth';
import { debounce } from 'lodash';
import { createPortal } from 'react-dom';

// Type definition for category item to fix TypeScript errors
interface CategoryItem {
  _id?: string;
  id?: string;
  category_name?: string;
  name?: string;
  [key: string]: any;
}

// Interface for the storage utility
interface StorageUtilType {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => boolean;
  removeItem: (key: string) => void;
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
    requiredFields: [
      'course_duration',
      'no_of_Sessions',
      'session_duration',
      'min_hours_per_week',
      'max_hours_per_week'
    ]
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

const schema = yup.object().shape({
  course_category: yup.string().required('Course category is required'),
  course_subcategory: yup.string(),
  course_title: yup.string().required('Course title is required'),
  course_subtitle: yup.string(),
  course_tag: yup.string(),
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
  no_of_Sessions: yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('Number of sessions is required')
    .min(1, 'Number of sessions must be at least 1'),
  course_duration: yup.string().required('Course duration is required'),
  session_duration: yup.string().required('Session duration is required'),
  min_hours_per_week: yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('Minimum hours per week is required')
    .min(0, 'Minimum hours per week cannot be negative'),
  max_hours_per_week: yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('Maximum hours per week is required')
    .min(0, 'Maximum hours per week cannot be negative')
    .test('max-greater-than-min', 'Maximum hours must be greater than minimum hours', 
      function(max) {
        const min = this.parent.min_hours_per_week;
        return !min || !max || max >= min;
      }
    ),
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
              meta: yup.object().shape({
                presenter: yup.string(),
                transcript: yup.string(),
                time_limit: yup.string(),
                passing_score: yup.number(),
                due_date: yup.string(),
                max_score: yup.number()
              }),
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
  final_evaluation: yup.object().shape({
    final_quizzes: yup.array().of(yup.string()),
    final_assessments: yup.array().of(yup.string()),
    certification: yup.string().nullable(),
    final_faqs: yup.array().of(yup.string())
  }),
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
  status: yup.string().default('Upcoming'),
  isFree: yup.boolean().default(false),
  specifications: yup.string().nullable(),
  course_grade: yup.string(),
  class_type: yup.string(),
  is_Certification: yup.string(),
  is_Assignments: yup.string(),
  is_Projects: yup.string(),
  is_Quizes: yup.string(),
  category_type: yup.string(),
  related_courses: yup.array().of(yup.string())
});

// Add constants
const STORAGE_KEY = 'medh_course_draft';
const STORAGE_TYPE_KEY = 'medh_storage_type';

// Add a utility for storage access
const storageUtil: StorageUtilType = {
  getItem: (key: string): string | null => {
    try {
      // Check if we've already determined the storage type
      const storageType = localStorage.getItem(STORAGE_TYPE_KEY) || sessionStorage.getItem(STORAGE_TYPE_KEY);
      
      if (storageType === 'localStorage') {
        return localStorage.getItem(key);
      } else if (storageType === 'sessionStorage') {
        return sessionStorage.getItem(key);
      }
      
      // Try localStorage first
      try {
        const value = localStorage.getItem(key);
        if (value !== null) {
          localStorage.setItem(STORAGE_TYPE_KEY, 'localStorage');
          return value;
        }
      } catch (e) {
        console.warn('localStorage not available, falling back to sessionStorage');
      }
      
      // Try sessionStorage if localStorage fails
      try {
        const value = sessionStorage.getItem(key);
        if (value !== null) {
          sessionStorage.setItem(STORAGE_TYPE_KEY, 'sessionStorage');
          return value;
        }
      } catch (e) {
        console.warn('sessionStorage also not available');
      }
      
      return null;
    } catch (error) {
      console.error('Error accessing storage:', error);
      return null;
    }
  },
  
  setItem: (key: string, value: string): boolean => {
    try {
      // Check if we've already determined the storage type
      const storageType = localStorage.getItem(STORAGE_TYPE_KEY) || sessionStorage.getItem(STORAGE_TYPE_KEY);
      
      if (storageType === 'localStorage') {
        localStorage.setItem(key, value);
        return true;
      } else if (storageType === 'sessionStorage') {
        sessionStorage.setItem(key, value);
        return true;
      }
      
      // Try localStorage first
      try {
        localStorage.setItem(key, value);
        localStorage.setItem(STORAGE_TYPE_KEY, 'localStorage');
        return true;
      } catch (e) {
        console.warn('localStorage not available, falling back to sessionStorage');
      }
      
      // Try sessionStorage if localStorage fails
      try {
        sessionStorage.setItem(key, value);
        sessionStorage.setItem(STORAGE_TYPE_KEY, 'sessionStorage');
        return true;
      } catch (e) {
        console.warn('sessionStorage also not available');
        return false;
      }
    } catch (error) {
      console.error('Error setting item in storage:', error);
      return false;
    }
  },
  
  removeItem: (key: string): void => {
    try {
      // Try to remove from both storage types
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn('Error removing from localStorage');
      }
      
      try {
        sessionStorage.removeItem(key);
      } catch (e) {
        console.warn('Error removing from sessionStorage');
      }
    } catch (error) {
      console.error('Error removing item from storage:', error);
    }
  }
};

// Create a navigation confirmation modal component
const NavigationModal = ({ 
  isOpen, 
  onCancel, 
  onContinue,
  onSaveAndContinue
}: {
  isOpen: boolean;
  onCancel: () => void;
  onContinue: () => void;
  onSaveAndContinue: () => void;
}) => {
  if (!isOpen || typeof document === 'undefined') return null;
  
  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Unsaved Changes
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You have unsaved changes. What would you like to do?
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button 
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Return to Form
          </button>
          <button 
            onClick={onSaveAndContinue}
            className="px-4 py-2 border border-emerald-500 rounded-md text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-gray-700"
          >
            Save & Continue
          </button>
          <button 
            onClick={onContinue}
            className="px-4 py-2 bg-rose-600 text-white rounded-md text-sm font-medium hover:bg-rose-700"
          >
            Discard Changes
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Create a custom step navigator component
const CourseStepNavigator = ({
  steps,
  currentStep,
  onStepClick,
  isStepClickable
}: {
  steps: typeof formSteps;
  currentStep: number;
  onStepClick: (step: number) => void;
  isStepClickable: (step: number) => boolean;
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 border-b pb-2">
        Course Creation Journey
      </h3>
      <div className="grid gap-2">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isClickable = isStepClickable(stepNumber);
          
          return (
            <button
              key={step.hash}
              onClick={() => isClickable && onStepClick(stepNumber)}
              disabled={!isClickable}
              className={`flex items-center p-3 rounded-md transition-all text-left ${
                isActive
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-500'
                  : isCompleted
                  ? 'bg-gray-50 dark:bg-gray-700 border-l-4 border-gray-300 dark:border-gray-600'
                  : 'bg-white dark:bg-gray-800 border-l-4 border-transparent'
              } ${
                isClickable
                  ? 'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer'
                  : 'opacity-60 cursor-not-allowed'
              }`}
            >
              <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 ${
                isActive
                  ? 'bg-emerald-500 text-white'
                  : isCompleted
                  ? 'bg-gray-300 dark:bg-gray-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">{step.title}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{step.description}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const AddCourse = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [courseImage, setCourseImage] = useState<string | null>(null);
  const [categories, setCategories] = useState<Array<{id: string, name: string}>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [isDraftSaving, setIsDraftSaving] = useState<boolean>(false);
  const [hasSavedDraft, setHasSavedDraft] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [showNavigationModal, setShowNavigationModal] = useState<boolean>(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);
  
  const { postQuery } = usePostQuery();
  const { getQuery } = useGetQuery();
  
  // Reference to track if the form was submitted successfully
  const formSubmittedSuccessfully = useRef(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty, dirtyFields },
    watch,
    control,
    reset,
    trigger,
    getValues
  } = useForm<ICourseFormData>({
    resolver: yupResolver(schema) as any,
    mode: 'onChange',
    defaultValues: {
      status: 'Draft',
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
      min_hours_per_week: 1,
      max_hours_per_week: 2,
      no_of_Sessions: 1,
      session_duration: '',
      course_duration: '',
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

  // Watch form values for auto-save
  const formValues = watch();

  // Load saved draft on component mount
  useEffect(() => {
    const loadSavedDraft = async () => {
      try {
        const savedDraft = storageUtil.getItem(STORAGE_KEY);
        if (savedDraft) {
          const parsedDraft = JSON.parse(savedDraft);
          
          // Set saved values
          Object.entries(parsedDraft).forEach(([key, value]) => {
            // Skip the image field as we handle it separately
            if (key !== 'course_image') {
              setValue(key as any, value as any);
            }
          });
          
          // Handle course image separately
          if (parsedDraft.course_image) {
            setCourseImage(parsedDraft.course_image);
            setValue('course_image', parsedDraft.course_image);
          }
          
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

  // Handle navigation with pending state
  const handleNavigation = (navigateAction: () => void) => {
    if (hasUnsavedChanges) {
      setPendingNavigation(() => navigateAction);
      setShowNavigationModal(true);
    } else {
      navigateAction();
    }
  };

  // Handle navigation confirmation
  const handleNavigationContinue = () => {
    setShowNavigationModal(false);
    if (pendingNavigation) {
      pendingNavigation();
      setPendingNavigation(null);
    }
  };

  // Handle save and navigation confirmation
  const handleSaveAndContinue = async () => {
    await handleSaveDraft();
    handleNavigationContinue();
  };

  // Implement auto-save with debounce
  const saveDraft = useCallback(
    debounce(async (data: ICourseFormData) => {
      try {
        setIsDraftSaving(true);
        
        // Save to storage
        const saveSuccess = storageUtil.setItem(STORAGE_KEY, JSON.stringify(data));
        
        if (saveSuccess) {
          // Update last saved timestamp
          const now = new Date();
          setLastSaved(now.toLocaleString());
          setHasSavedDraft(true);
          setHasUnsavedChanges(false);
          
          console.log('Draft auto-saved at', now.toLocaleString());
        } else {
          console.warn('Failed to auto-save draft');
        }
      } catch (error) {
        console.error('Error saving draft:', error);
      } finally {
        setIsDraftSaving(false);
      }
    }, 2000), // 2 second debounce
    []
  );

  // Auto-save when form values change
  useEffect(() => {
    if (isDirty) {
      setHasUnsavedChanges(true);
      saveDraft(getValues());
    }
  }, [formValues, isDirty, saveDraft, getValues]);

  // Set up beforeunload event handler to prevent accidental page closing
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !formSubmittedSuccessfully.current) {
        // Standard for modern browsers
        e.preventDefault();
        // For older browsers
        const message = 'You have unsaved changes. Are you sure you want to leave?';
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // Save draft manually
  const handleSaveDraft = async () => {
    try {
      setIsDraftSaving(true);
      
      // Get current form values
      const currentValues = getValues();
      
      // Save to storage
      const saveSuccess = storageUtil.setItem(STORAGE_KEY, JSON.stringify(currentValues));
      
      if (saveSuccess) {
        // Update last saved timestamp
        const now = new Date();
        setLastSaved(now.toLocaleString());
        setHasSavedDraft(true);
        setHasUnsavedChanges(false);
        
        showToast.success('Draft saved successfully');
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
      
      // Reset form to initial state
      reset();
      setCourseImage(null);
    }
  };

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
        
        console.log("Categories API response:", JSON.stringify(response, null, 2));
        
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

    // Check if there's a token in request headers (like from x-access-token shown in the error)
    // This is for when the token is passed directly rather than via URL
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
      // If we don't have a token stored already, use the one from the request
      if (!storedToken && window.location.hash.includes('access-token')) {
        // Extract token from hash if present in format #access-token=xyz
        const hashMatch = window.location.hash.match(/access-token=([^&]*)/);
        if (hashMatch && hashMatch[1]) {
          storeExternalToken(hashMatch[1]);
        }
      }
    }
  }, []);

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
              // Handle the specific response format
              if (response?.data?.url && typeof response.data.url === 'string') {
                const imageUrl = response.data.url;
                setCourseImage(imageUrl);
                setValue('course_image', imageUrl, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true
                });
                // Re-validate the current step to clear any image-related validation messages
                await checkStepValidation(currentStep);
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
      // Clear any existing validation message
      setValidationMessage('');

      const isValid = await checkStepValidation(currentStep);
      
      if (!isValid) {
        return;
      }

      if (currentStep === formSteps.length) {
        // Get all form values
        const values = watch();

        // Log current form state for debugging
        console.log('Current form values:', values);
        console.log('Current form errors:', errors);

        // Validate all fields before submission
        const isFormValid = await trigger(undefined, { shouldFocus: true });

        if (!isFormValid) {
          // Get all error fields and their messages
          const errorFields = Object.entries(errors)
            .map(([key, value]) => {
              if (typeof value === 'object' && value?.message) {
                return `${key}: ${value.message}`;
              }
              return key;
            })
            .filter(Boolean);

          if (errorFields.length > 0) {
            const errorMessage = `Please check the following fields: ${errorFields.join(', ')}`;
            console.log('Validation errors:', errors);
            setValidationMessage(errorMessage);
            toast.error('Please fill in all required fields');
            return;
          }
        }

        // Submit the form
        await onSubmit(values);
      } else {
        nextStep();
      }
    } catch (error) {
      console.error('Error in handleStepSubmit:', error);
      toast.error('An error occurred while submitting the form');
    }
  };

  const checkStepValidation = async (step: number): Promise<boolean> => {
    const currentStepData = formSteps[step - 1];
    if (!currentStepData.requiredFields.length) return true;

    try {
      // Clear any existing validation message
      setValidationMessage('');

      const isValid = await trigger(currentStepData.requiredFields as any);
      
      if (!isValid) {
        // Get specific error messages for the current step's required fields
        const missingFields = currentStepData.requiredFields
          .filter(field => {
            const fieldError = errors[field as keyof typeof errors];
            return fieldError;
          })
          .map(field => {
            const fieldName = field.split('.').pop();
            const fieldError = errors[field as keyof typeof errors];
            return fieldError?.message || fieldName;
          });

        if (missingFields.length > 0) {
          const errorMessage = `Please fill in required fields: ${missingFields.join(', ')}`;
          setValidationMessage(errorMessage);
          console.log('Step validation errors:', errors);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error in checkStepValidation:', error);
      setValidationMessage('An error occurred while validating the form');
      return false;
    }
  };

  const onSubmit = async (data: ICourseFormData) => {
    try {
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

      // Validate curriculum if it exists
      if (data.curriculum && data.curriculum.length > 0) {
        let hasEmptyTitles = false;
        let hasEmptyVideoUrls = false;
        
        // Check sections for empty titles or video URLs
        data.curriculum.forEach((week, weekIndex) => {
          if (week.sections) {
            week.sections.forEach((section, sectionIndex) => {
              if (section.lessons) {
                section.lessons.forEach((lesson, lessonIndex) => {
                  if (!lesson.title?.trim()) {
                    hasEmptyTitles = true;
                  }
                  
                  if (lesson.lessonType === 'video' && !lesson.video_url?.trim()) {
                    hasEmptyVideoUrls = true;
                  }
                });
              }
            });
          }
          
          // Check direct lessons for empty titles or video URLs
          if (week.lessons) {
            week.lessons.forEach((lesson, lessonIndex) => {
              if (!lesson.title?.trim()) {
                hasEmptyTitles = true;
              }
              
              if (lesson.lessonType === 'video' && !lesson.video_url?.trim()) {
                hasEmptyVideoUrls = true;
              }
            });
          }
        });
        
        if (hasEmptyTitles || hasEmptyVideoUrls) {
          let errorMessage = '';
          if (hasEmptyTitles) errorMessage += 'Some lessons are missing titles. ';
          if (hasEmptyVideoUrls) errorMessage += 'Some video lessons are missing video URLs. ';
          errorMessage += 'Please fill in all required fields or remove incomplete lessons.';
          
          // Show as a toast to make it more visible
          toast.error(errorMessage);
          
          // Also set as validation message
          setValidationMessage(errorMessage);
          throw new Error(errorMessage);
        }
      }

      // Generate unique key and slug
      const uniqueKey = crypto.randomUUID();
      const slug = data.course_title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Make a deep copy of the form data to avoid reference issues
      const courseData = {
        status: data.status || 'Upcoming',
        course_title: data.course_title?.trim(),
        course_subtitle: data.course_subtitle?.trim() || '',
        course_tag: data.class_type,
        course_category: data.course_category,
        course_subcategory: data.course_subcategory || '',
        course_level: data.course_level || '',
        class_type: data.class_type || 'regular',
        course_grade: data.course_grade || '',
        language: data.language || 'English',
        subtitle_languages: [...(data.subtitle_languages || [])],
        category_type: data.category_type || 'Paid',
        course_duration: data.course_duration,
        course_fee: Number(data.course_fee) || 0,
        is_Certification: data.is_Certification || 'Yes',
        is_Assignments: data.is_Assignments || 'Yes',
        is_Projects: data.is_Projects || 'Yes',
        is_Quizes: data.is_Quizes || 'Yes',
        course_image: data.course_image,
        assigned_instructor: data.assigned_instructor || null,
        unique_key: uniqueKey,
        slug: slug,
        course_description: {
          program_overview: data.course_description?.program_overview?.trim() || '',
          benefits: data.course_description?.benefits?.trim() || '',
          learning_objectives: (data.course_description?.learning_objectives?.filter(Boolean) || []),
          course_requirements: (data.course_description?.course_requirements?.filter(Boolean) || []),
          target_audience: (data.course_description?.target_audience?.filter(Boolean) || [])
        },
        curriculum: formatCurriculum(data.curriculum || []),
        resource_pdfs: formatResourcePdfs(data.resource_pdfs || []),
        tools_technologies: formatToolsTechnologies(data.tools_technologies || []),
        bonus_modules: formatBonusModules(data.bonus_modules || []),
        faqs: formatFaqs(data.faqs || []),
        final_evaluation: formatFinalEvaluation(data.final_evaluation),
        related_courses: [...(data.related_courses || [])],
        brochures: [...(data.brochures || [])],
        specifications: data.specifications?.trim() || null,
        efforts_per_Week: data.efforts_per_Week?.trim() || '',
        min_hours_per_week: Number(data.min_hours_per_week) || 0,
        max_hours_per_week: Number(data.max_hours_per_week) || 0,
        no_of_Sessions: Number(data.no_of_Sessions) || 0,
        session_duration: data.session_duration?.trim() || '',
        isFree: Boolean(data.isFree),
        meta: {
          ratings: {
            average: 0,
            count: 0
          },
          views: 0,
          enrollments: 0,
          lastUpdated: new Date().toISOString()
        },
        prices: [...(data.prices || [])]
      };

      // Make the API call
      const response = await postQuery({
        url: apiUrls.courses.createCourse,
        postData: courseData,
        requireAuth: true,
        onSuccess: (response) => {
          // Mark form as successfully submitted to bypass beforeunload warning
          formSubmittedSuccessfully.current = true;
          
          showToast.success(`Course "${courseData.course_title}" created successfully!`);
          
          // Clear the saved draft
          storageUtil.removeItem(STORAGE_KEY);
          setHasSavedDraft(false);
          setLastSaved(null);
          setHasUnsavedChanges(false);
          
          reset();
          setCurrentStep(1);
          window.location.hash = formSteps[0].hash;
        },
        onFail: (error) => {
          const errorMessage = error?.response?.data?.message || 'Failed to create course';
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
      const errorMessage = error instanceof Error ? error.message : 'Failed to create course';
      toast.error(errorMessage);
      setValidationMessage(errorMessage);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper functions to format arrays and avoid reference issues
  const formatCurriculum = (curriculum: any[] = []) => {
    return curriculum.map(week => {
      // Filter out invalid lessons from sections
      const validSections = (week.sections || []).map((section: any) => ({
        id: section.id || `section_${crypto.randomUUID()}`,
        title: section.title || '',
        description: section.description || '',
        order: section.order || 0,
        resources: [...(section.resources || [])],
        lessons: (section.lessons || [])
          .filter((lesson: any) => {
            // Filter out lessons with empty titles
            if (!lesson.title?.trim()) {
              return false;
            }
            
            // For video lessons, ensure they have a valid video URL
            if (lesson.lessonType === 'video' && !lesson.video_url?.trim()) {
              return false;
            }
            
            return true;
          })
          .map((lesson: any) => formatLesson(lesson))
      }));
      
      // Filter out sections with no valid lessons
      const filteredSections = validSections.filter((section: any) => section.lessons.length > 0);
      
      // Filter out invalid direct lessons
      const validDirectLessons = (week.lessons || [])
        .filter((lesson: any) => {
          // Filter out lessons with empty titles
          if (!lesson.title?.trim()) {
            return false;
          }
          
          // For video lessons, ensure they have a valid video URL
          if (lesson.lessonType === 'video' && !lesson.video_url?.trim()) {
            return false;
          }
          
          return true;
        })
        .map((lesson: any) => formatLesson(lesson, true));
      
      return {
        id: week.id || `week_${crypto.randomUUID()}`,
        weekTitle: week.weekTitle || '',
        weekDescription: week.weekDescription || '',
        topics: [...(week.topics || [])],
        sections: filteredSections,
        lessons: validDirectLessons,
        liveClasses: (week.liveClasses || []).map((liveClass: any) => ({
          title: liveClass.title || '',
          description: liveClass.description || '',
          scheduledDate: liveClass.scheduledDate || new Date().toISOString(),
          duration: liveClass.duration || 0,
          meetingLink: liveClass.meetingLink || '',
          instructor: liveClass.instructor || '',
          recordingUrl: liveClass.recordingUrl || '',
          isRecorded: liveClass.isRecorded || false,
          materials: (liveClass.materials || []).map((material: any) => ({
            title: material.title || '',
            url: material.url || '',
            type: material.type || 'document'
          }))
        }))
      };
    }).filter(week => {
      // Filter out weeks with no valid sections or direct lessons
      return (week.sections && week.sections.length > 0) || (week.lessons && week.lessons.length > 0);
    });
  };

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
      resources: [...(lesson.resources || [])]
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

  const formatResourcePdfs = (pdfs: any[] = []) => {
    return pdfs.map(pdf => ({
      title: pdf.title?.trim() || '',
      url: pdf.url || '',
      description: pdf.description?.trim() || '',
      size_mb: Number(pdf.size_mb) || 0,
      pages: Number(pdf.pages) || 0,
      upload_date: pdf.upload_date || new Date().toISOString()
    }));
  };

  const formatToolsTechnologies = (tools: any[] = []) => {
    return tools.map(tool => ({
      name: tool.name?.trim() || '',
      category: tool.category?.trim() || '',
      description: tool.description?.trim() || '',
      logo_url: tool.logo_url || ''
    }));
  };

  const formatBonusModules = (modules: any[] = []) => {
    return modules.map(module => ({
      title: module.title?.trim() || '',
      description: module.description?.trim() || '',
      resources: (module.resources || []).map((resource: any) => ({
        title: resource.title?.trim() || '',
        type: resource.type || '',
        url: resource.url || '',
        description: resource.description?.trim() || ''
      }))
    }));
  };

  const formatFaqs = (faqs: any[] = []) => {
    return faqs.map(faq => ({
      question: faq.question?.trim() || '',
      answer: faq.answer?.trim() || ''
    }));
  };

  const formatFinalEvaluation = (finalEval: any = {}) => {
    return {
      final_quizzes: [...(finalEval?.final_quizzes || [])],
      final_assessments: [...(finalEval?.final_assessments || [])],
      certification: finalEval?.certification || null,
      final_faqs: [...(finalEval?.final_faqs || [])]
    };
  };

  const renderStep = () => {
    // Create a consistently styled form state object for all step components
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
      dirtyFields: {} as Record<string, boolean>,
      touchedFields: {} as Record<string, boolean>,
      defaultValues: {} as Partial<ICourseFormData>,
      disabled: false as boolean,
      validatingFields: {} as Record<string, boolean>,
      isReady: true
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

  const nextStep = () => {
    const goToNextStep = () => {
      if (currentStep < formSteps.length) {
        setCurrentStep(currentStep + 1);
      }
    };
    
    handleNavigation(goToNextStep);
  };

  const prevStep = () => {
    const goToPrevStep = () => {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
      }
    };
    
    handleNavigation(goToPrevStep);
  };

  const handleStepClick = async (stepIndex: number) => {
    // If trying to navigate to the current step, do nothing
    if (stepIndex === currentStep) {
      return;
    }
    
    // Save current step data before navigation (only for validation)
    const isCurrentStepValid = await checkStepValidation(currentStep);
    if (!isCurrentStepValid) {
      toast.warning('Please complete the current step before navigating');
      return;
    }
    
    const goToStep = () => {
      setCurrentStep(stepIndex);
    };
    
    handleNavigation(goToStep);
  };

  // Define isStepClickable that was accidentally removed
  const isStepClickable = (stepIndex: number) => {
    // Allow clicking on completed steps or the next available step
    return stepIndex <= currentStep;
  };

  // Helper function for exit to dashboard
  const exitToDashboard = () => {
    const goToDashboard = () => {
      formSubmittedSuccessfully.current = true; // Prevent beforeunload warning
      window.location.href = '/instructor/dashboard';
    };
    
    handleNavigation(goToDashboard);
  };

  // Add auto-draft saving indication
  const DraftSavingIndicator = () => {
    if (isDraftSaving) {
      return (
        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-500 mr-2"></div>
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
          <span className="text-emerald-500 mr-2">✓</span>
          Auto-saved · {lastSaved}
        </span>
      );
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
      {/* Navigation confirmation modal */}
      <NavigationModal 
        isOpen={showNavigationModal}
        onCancel={() => setShowNavigationModal(false)}
        onContinue={handleNavigationContinue}
        onSaveAndContinue={handleSaveAndContinue}
      />
    
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Add New Course</h1>
            <p className="text-gray-600 dark:text-gray-400">Create a new course using the form below</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <DraftSavingIndicator />
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-4 py-2 border border-emerald-500 rounded-md text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-white dark:bg-gray-700 hover:bg-emerald-50 dark:hover:bg-gray-600 transition-colors duration-300"
                disabled={isDraftSaving || isSubmitting}
              >
                {isDraftSaving ? 'Saving...' : 'Save Draft'}
              </button>
              {hasSavedDraft && (
                <button
                  type="button"
                  onClick={clearSavedDraft}
                  className="px-4 py-2 border border-rose-300 dark:border-rose-700 rounded-md text-sm font-medium text-rose-500 dark:text-rose-400 bg-white dark:bg-gray-700 hover:bg-rose-50 dark:hover:bg-gray-600 transition-colors duration-300"
                  disabled={isDraftSaving || isSubmitting}
                >
                  Clear Draft
                </button>
              )}
              <button
                type="button"
                onClick={exitToDashboard}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-300"
                disabled={isSubmitting}
              >
                Exit
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left side - Step Navigator */}
          <div className="md:w-1/3">
            <CourseStepNavigator
              steps={formSteps}
              currentStep={currentStep}
              onStepClick={handleStepClick}
              isStepClickable={isStepClickable}
            />
          </div>

          {/* Right side - Form Content */}
          <div className="md:w-2/3">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  {formSteps[currentStep - 1].title}
                </h2>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Step {currentStep} of {formSteps.length}
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div 
                  className="bg-emerald-500 dark:bg-emerald-400 h-1.5 rounded-full transition-all duration-300 ease-in-out" 
                  style={{ width: `${(currentStep / formSteps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-300">
              {isLoading && currentStep === 1 && (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500 dark:border-emerald-400"></div>
                  <p className="ml-3 text-gray-600 dark:text-gray-400">Loading categories...</p>
                </div>
              )}
              
              <form onSubmit={handleStepSubmit} id="course-form">
                {renderStep()}

                {validationMessage && (
                  <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-md">
                    {validationMessage}
                  </div>
                )}

                <div className="mt-8 flex justify-between">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                      disabled={isSubmitting}
                    >
                      Go Back
                    </button>
                  )}
                  <div className="flex items-center space-x-4">
                    {currentStep === formSteps.length && hasSavedDraft && (
                      <button
                        type="button"
                        onClick={() => {
                          handleSaveDraft().then(() => exitToDashboard());
                        }}
                        className="px-4 py-2 border border-emerald-500 rounded-md text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-white dark:bg-gray-700 hover:bg-emerald-50 dark:hover:bg-gray-600 transition-colors duration-300"
                        disabled={isDraftSaving || isSubmitting}
                      >
                        Save as Draft & Exit
                      </button>
                    )}
                    <button
                      type="submit"
                      form="course-form"
                      className={`ml-auto px-4 py-2 rounded-md text-sm font-medium ${
                        validationMessage
                          ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600'
                      } text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300`}
                      disabled={isSubmitting || !!validationMessage}
                      title={validationMessage || (isSubmitting ? 'Processing...' : '')}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </div>
                      ) : currentStep < formSteps.length ? (
                        'Save & Continue'
                      ) : (
                        'Publish Course'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
            
            {/* Success message for published course */}
            {formSubmittedSuccessfully.current && (
              <div className="mt-6 bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-lg text-center">
                <div className="text-4xl mb-2">🎉</div>
                <h3 className="text-lg font-medium text-emerald-700 dark:text-emerald-400 mb-2">
                  Your course is now live!
                </h3>
                <div className="flex justify-center mt-4 space-x-3">
                  <button
                    onClick={() => window.location.href = '/instructor/courses'}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                  >
                    View Courses
                  </button>
                  <button
                    onClick={() => window.location.href = '/instructor/dashboard'}
                    className="px-4 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile sticky footer */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3 flex justify-between items-center z-10">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Step {currentStep} of {formSteps.length}
        </div>
        <div className="flex space-x-2">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded text-xs font-medium text-gray-700 dark:text-gray-300"
              disabled={isSubmitting}
            >
              Back
            </button>
          )}
          <button
            type="submit"
            form="course-form"
            className="px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-medium"
            disabled={isSubmitting || !!validationMessage}
          >
            {currentStep < formSteps.length ? 'Next' : 'Publish'}
          </button>
        </div>
      </div>
      
      {/* Theme controller */}
      <ThemeController position="fixed" />
    </div>
  );
};

export default AddCourse; 