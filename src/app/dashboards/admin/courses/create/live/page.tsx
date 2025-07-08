"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, useFieldArray as useNestedFieldArray } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { masterDataApi } from "@/apis/master.api";
import { Plus, Trash2, Upload, Save, AlertCircle, CheckCircle, ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import { courseTypesAPI, IToolTechnology, IFAQ } from "@/apis/courses";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import { uploadService } from '@/services/uploadService';
import { Control, UseFormRegister, FieldErrors } from 'react-hook-form';

// Helper to format seconds to mm:ss
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

interface MasterData {
  parentCategories: string[];
  categories: string[];
  certificates: string[];
  grades: string[];
  courseDurations: string[];
}

interface Live2FormData {
  category: string;
  parentCategory: string[];
  courseTitle: string;
  courseImage: string;
  classType: string;
  courseDuration: string;
  numberOfSessions: number;
  includeQuizzes: 'Yes' | 'No';
  includeProjects: 'Yes' | 'No';
  includeAssignments: 'Yes' | 'No';
  includeCertification: 'Yes' | 'No';
  gradeOrCertificate: "grade" | "certificate";
  grade?: string;
  certificateType?: string;
  courseTags: string[];
  programOverview: string;
  benefits: string;
  learningObjectives: string[];
  courseRequirements: string[];
  targetAudience: string[];
  prerequisites: string[];
  brochures: string[];
  previewVideo: {
    title: string;
    url: string;
    previewUrl?: string;
    duration: string;
    description: string;
  };
  pricing: {
    currency: string;
    individual: number;
    batch: number;
    minBatchSize: number;
    maxBatchSize: number;
    earlyBirdDiscount?: number;
    groupDiscount?: number;
    isActive: boolean;
  }[];
  modules: {
    title: string;
    description: string;
    sessions: {
      title: string;
      description?: string;
    }[];
  }[];
}

interface ILiveCourse {
  course_type: 'live';
  course_title: string;
  course_subtitle: string;
  course_category: string;
  course_subcategory: string;
  course_tag: string;
  course_level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  course_image: string;
  course_description: {
    program_overview: string;
    benefits: string;
    learning_objectives: string[];
    course_requirements: string[];
    target_audience: string[];
  };
  course_schedule: {
    start_date: Date;
    end_date: Date;
    session_days: string[];
    session_time: string;
    timezone: string;
  };
  total_sessions: number;
  session_duration: number;
  modules: {
    title: string;
    description: string;
    order: number;
    sessions: any[]; // Placeholder for session structure
  }[];
  max_students: number;
  prices: {
    currency: 'USD' | 'EUR' | 'INR' | 'GBP' | 'AUD' | 'CAD';
    individual: number;
    batch: number;
    min_batch_size: number;
    max_batch_size: number;
    early_bird_discount: number;
    group_discount: number;
    is_active: boolean;
  }[];
  tools_technologies: IToolTechnology[];
  faqs: IFAQ[];
  instructors: string[];
  prerequisites: string[];
  certification: {
    is_certified: boolean;
    attendance_required: number;
  };
  status: 'Draft' | 'Published' | 'Upcoming';
  language: string;
  brochures: string[];
  is_Quizes: 'Yes' | 'No';
  is_Projects: 'Yes' | 'No';
  is_Assignments: 'Yes' | 'No';
  is_Certification: 'Yes' | 'No';
  class_type: 'Live Courses' | 'Blended Courses' | 'Self-Paced' | 'Virtual Learning' | 'Online Classes' | 'Hybrid' | 'Pre-Recorded';
  course_duration: string;
  no_of_Sessions: number;
  course_grade?: string;
  preview_video?: {
    title: string;
    url: string;
    duration: string;
    description: string;
  };
}

const schema = yup.object().shape({
  category: yup.string().required("Category is required"),
  parentCategory: yup.array().of(yup.string()).min(1, "Select at least one subcategory").required("Parent category is required"),
  courseTitle: yup.string().required("Course title is required").min(5, "Title must be at least 5 characters"),
  courseImage: yup.string().required("Course image is required"),
  classType: yup.string().required("Class type is required"),
  courseDuration: yup.string().required("Course duration is required"),
  numberOfSessions: yup.number().required("Number of sessions is required").min(1, "At least 1 session required"),
  includeQuizzes: yup.string().oneOf(['Yes', 'No']).required("Quizzes status is required"),
  includeProjects: yup.string().oneOf(['Yes', 'No']).required("Projects status is required"),
  includeAssignments: yup.string().oneOf(['Yes', 'No']).required("Assignments status is required"),
  includeCertification: yup.string().oneOf(['Yes', 'No']).required("Certification status is required"),
  gradeOrCertificate: yup.string().oneOf(['grade', 'certificate']).required("Grade or certificate selection is required"),
  grade: yup.string().when('gradeOrCertificate', {
    is: 'grade',
    then: () => yup.string().required("Grade is required when grade is selected"),
    otherwise: () => yup.string().optional()
  }),
  certificateType: yup.string().when('gradeOrCertificate', {
    is: 'certificate',
    then: () => yup.string().required("Certificate type is required when certificate is selected"),
    otherwise: () => yup.string().optional()
  }),
  courseTags: yup.array().of(yup.string().required()).required(),
  programOverview: yup.string().required("Program overview is required").min(50, "Overview must be at least 50 characters"),
  benefits: yup.string().required("Benefits are required").min(30, "Benefits must be at least 30 characters"),
  learningObjectives: yup.array().of(yup.string().required()).required(),
  courseRequirements: yup.array().of(yup.string().required()).required(),
  targetAudience: yup.array().of(yup.string().required()).required(),
  prerequisites: yup.array().of(yup.string().required()).required(),
  brochures: yup.array().of(yup.string().required()).required(),
  previewVideo: yup.object().shape({
    title: yup.string().required("Preview title is required"),
    url: yup.string().required("Preview URL is required"),
    duration: yup.string().required("Preview duration is required"),
    description: yup.string().required("Preview description is required"),
  }),
  pricing: yup.array().of(yup.object().shape({
    currency: yup.string().required("Currency is required"),
    individual: yup.number().required("Individual price is required").min(0, "Price must be non-negative"),
    batch: yup.number().required("Batch price is required").min(0, "Price must be non-negative"),
    minBatchSize: yup.number().required("Minimum batch size is required").min(1, "Minimum batch size must be at least 1"),
    maxBatchSize: yup.number().required("Maximum batch size is required").min(1, "Maximum batch size must be at least 1"),
    earlyBirdDiscount: yup.number().min(0, "Discount must be non-negative").max(100, "Discount cannot exceed 100%"),
    groupDiscount: yup.number().min(0, "Discount must be non-negative").max(100, "Discount cannot exceed 100%"),
    isActive: yup.boolean().required("Active status is required"),
  })).required(),
  modules: yup.array().of(
    yup.object().shape({
      title: yup.string().required('Module title is required'),
      description: yup.string().required('Module description is required'),
      sessions: yup.array().of(
        yup.object().shape({
          title: yup.string().required('Session title is required'),
          description: yup.string().optional(),
        })
      )
    })
  ).min(1, 'At least one module is required'),
});

// Child component for sessions field array
type ModuleSessionsProps = {
  nestIndex: number;
  control: Control<any>;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  secondaryButtonClass: string;
  labelClass: string;
  inputClass: string;
  errorClass: string;
};
function ModuleSessions({ nestIndex, control, register, errors, secondaryButtonClass, labelClass, inputClass, errorClass }: ModuleSessionsProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `modules.${nestIndex}.sessions`
  });
  return (
    <div>
      <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2">Sessions</h4>
      {fields.map((session, sessionIdx) => (
        <div key={session.id} className="mb-3 border border-gray-100 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-800">
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium text-gray-700 dark:text-gray-300">Session #{sessionIdx + 1}</span>
            {fields.length > 1 && (
              <button type="button" onClick={() => remove(sessionIdx)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="mb-2">
            <label className={labelClass}>Session Title</label>
            <input type="text" {...register(`modules.${nestIndex}.sessions.${sessionIdx}.title`)} className={inputClass} placeholder={`Session ${sessionIdx + 1} Title`} />
            {errors.modules && Array.isArray(errors.modules) && errors.modules[nestIndex]?.sessions && Array.isArray(errors.modules[nestIndex].sessions) && errors.modules[nestIndex].sessions[sessionIdx]?.title && typeof errors.modules[nestIndex].sessions[sessionIdx].title.message === 'string' && <p className={errorClass}>{errors.modules[nestIndex].sessions[sessionIdx].title.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Session Description</label>
            <textarea {...register(`modules.${nestIndex}.sessions.${sessionIdx}.description`)} className={inputClass} rows={1} placeholder="Session description (optional)" />
          </div>
        </div>
      ))}
      <button type="button" onClick={() => append({ title: '', description: '' })} className={`${secondaryButtonClass} mt-2`}>
        <Plus className="h-4 w-4 mr-2" /> Add Session
      </button>
    </div>
  );
}

export default function Live2CourseForm() {
  const [masterData, setMasterData] = useState<MasterData>({
    parentCategories: [],
    categories: [],
    certificates: [],
    grades: [],
    courseDurations: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [courseImage, setCourseImage] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [brochureUploading, setBrochureUploading] = useState(false);
  const [previewProcessing, setPreviewProcessing] = useState(false);

  const { postQuery } = usePostQuery();

  const { register, handleSubmit, watch, setValue, control, formState: { errors, isDirty } } = useForm<any>({
    resolver: yupResolver(schema),
    defaultValues: {
      learningObjectives: [""],
      courseRequirements: [""],
      targetAudience: [""],
      prerequisites: [""],
      courseTags: [""],
      brochures: [],
      includeQuizzes: "Yes",
      includeProjects: "Yes",
      includeAssignments: "Yes",
      includeCertification: "Yes",
      gradeOrCertificate: "grade",
      pricing: [{
        currency: "USD",
        individual: 299,
        batch: 249,
        minBatchSize: 5,
        maxBatchSize: 20,
        earlyBirdDiscount: 15,
        groupDiscount: 20,
        isActive: true,
      }],
      previewVideo: {
        title: "",
        url: "",
        previewUrl: "",
        duration: "",
        description: ""
      },
      modules: [
        {
          title: '',
          description: '',
          sessions: [
            { title: '', description: '' }
          ]
        }
      ]
    }
  });

  const { fields: learningObjectives, append: appendLearningObjective, remove: removeLearningObjective } = useFieldArray({
    control,
    name: "learningObjectives"
  });
  const { fields: courseRequirements, append: appendCourseRequirement, remove: removeCourseRequirement } = useFieldArray({
    control,
    name: "courseRequirements"
  });
  const { fields: targetAudience, append: appendTargetAudience, remove: removeTargetAudience } = useFieldArray({
    control,
    name: "targetAudience"
  });
  const { fields: prerequisites, append: appendPrerequisite, remove: removePrerequisite } = useFieldArray({
    control,
    name: "prerequisites"
  });

  const { fields: courseTags, append: appendCourseTag, remove: removeCourseTag } = useFieldArray({
    control,
    name: "courseTags"
  });

  const { fields: pricing, append: appendPricing, remove: removePricing } = useFieldArray({
    control,
    name: "pricing"
  });

  const { fields: modules, append: appendModule, remove: removeModule } = useFieldArray({
    control,
    name: 'modules'
  });

  // Fetch master data with proper error handling
  useEffect(() => {
    async function fetchMasterData() {
      setIsLoading(true);
      setApiError(null);
      
      try {
        const response = await masterDataApi.getAllMasterData();
        
        if (response?.data) {
          const data = response.data;
          
          // Handle different possible response structures
          let actualData;
          if (data.data) {
            // If data is nested under another data property
            actualData = data.data;
          } else if (data.parentCategories || data.categories) {
            // If data is directly accessible
            actualData = data;
          } else {
            // Try to find the data in the response
            actualData = data;
          }
          
          // Extract arrays with fallbacks
          const parentCategories = Array.isArray(actualData.parentCategories) ? actualData.parentCategories : [];
          const categories = Array.isArray(actualData.categories) ? actualData.categories : [];
          const certificates = Array.isArray(actualData.certificates) ? actualData.certificates : [];
          const grades = Array.isArray(actualData.grades) ? actualData.grades : [];
          const courseDurations = Array.isArray(actualData.courseDurations) ? actualData.courseDurations : [];
          
          const masterDataToSet = {
            parentCategories,
            categories,
            certificates,
            grades,
            courseDurations
          };
          
          setMasterData(masterDataToSet);
        } else {
          throw new Error("No data received from master data API");
        }
      } catch (error) {
        console.error("Error fetching master data:", error);
        setApiError("Failed to load form options. Please refresh the page.");
        
        // Set fallback data
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

  // Handle image selection with validation
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      console.log('File details:', {
        name: file.name,
        size: file.size,
        type: file.type
      });
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      // Validate file is not empty
      if (file.size === 0) {
        alert('Selected file is empty');
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCourseImage(result);
      };
      reader.onerror = () => {
        alert('Failed to read image file');
      };
      reader.readAsDataURL(file);
      
      // Store the file for upload
      setSelectedImageFile(file);
    }
    
    // Clear the input value to allow selecting the same file again
    event.target.value = '';
  };

  // Handle image upload using the robust upload process
  const handleImageUpload = async () => {
    if (!selectedImageFile) {
      alert('Please select an image first');
      return;
    }

    console.log('🚀 Starting image upload...');
    console.log('📁 Selected image:', selectedImageFile);
    console.log('📋 File details:', {
      name: selectedImageFile.name,
      size: selectedImageFile.size,
      type: selectedImageFile.type
    });

    setImageUploading(true);

    try {
      // Convert file to base64
      const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = () => reject(new Error('Failed to read image file'));
        reader.readAsDataURL(selectedImageFile);
      });

      // Upload to server using the API with file name
      const postData = { 
        base64String, 
        fileType: "image",
        fileName: selectedImageFile.name // Include the original file name
      };
      
      await postQuery({
        url: apiUrls?.upload?.uploadImage,
        postData,
        onSuccess: async (response) => {
          if (response?.data?.url && typeof response.data.url === 'string') {
            const imageUrl = response.data.url;
            setCourseImage(imageUrl);
            setValue('courseImage', imageUrl);
            
            // Clear the selected file
            setSelectedImageFile(null);
            
            alert('Course image uploaded successfully!');
            console.log('✅ Upload successful! New image URL:', imageUrl);
          } else {
            console.error("Unexpected image upload response format:", response);
            alert('Invalid image upload response format');
          }
        },
        onFail: (error) => {
          console.error("Image upload error:", error);
          alert('Image upload failed. Please try again.');
        },
      });

    } catch (error) {
      console.error('💥 Error uploading image:', error);
      
      let errorMessage = 'Failed to upload image';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setImageUploading(false);
    }
  };

  // Cancel image selection
  const handleCancelImageEdit = () => {
    setSelectedImageFile(null);
    setCourseImage(null);
  };

  // Handle brochure PDF upload
  const handleBrochureUpload = async (file: File) => {
    if (!file) {
      alert('Please select a valid PDF file');
      return;
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed for brochures');
      return;
    }

    setBrochureUploading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result?.toString().split(',')[1];
        if (base64) {
          const postData = { 
            base64String: base64, 
            fileType: "document",
            fileName: file.name // Include the original file name
          };
          await postQuery({
            url: apiUrls?.upload?.uploadDocument,
            postData,
            onSuccess: async (response) => {
              if (response?.data?.url && typeof response.data.url === 'string') {
                const brochureUrl = response.data.url;
                const currentBrochures = watch('brochures') || [];
                const newBrochures = [...currentBrochures, brochureUrl];
                setValue('brochures', newBrochures);
                alert('Brochure uploaded successfully');
              } else {
                console.error("Unexpected brochure upload response format:", response);
                alert('Invalid brochure upload response format');
              }
            },
            onFail: (error) => {
              console.error("Brochure upload error:", error);
              alert('Brochure upload failed. Please try again.');
            },
          });
        }
      };
      
      reader.onerror = () => {
        alert('Failed to read PDF file');
      };
    } catch (error) {
      console.error("Error in handleBrochureUpload:", error);
      alert('Failed to upload brochure');
    } finally {
      setBrochureUploading(false);
    }
  };

  // Remove brochure
  const removeBrochure = (index: number) => {
    const currentBrochures: string[] = watch('brochures') || [];
    const newBrochures = currentBrochures.filter((_: string, i: number) => i !== index);
    setValue('brochures', newBrochures);
  };

  const handlePreviewVideoFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewProcessing(true);
    try {
      // Get full data URL with MIME type prefix
      const base64WithPrefix = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });
      // Upload to server
      const uploadRes = await uploadService.uploadBase64(base64WithPrefix, 'video', file.name);
      if (!uploadRes?.data?.url) throw new Error('Upload failed');
      const url = uploadRes.data.url;
      const previewUrl = uploadRes.data.previewUrl || url;
      setValue('previewVideo.url', url);
      setValue('previewVideo.title', file.name);
      setValue('previewVideo.previewUrl', previewUrl);
      // Extract duration from uploaded video
      const videoEl = document.createElement('video');
      videoEl.src = previewUrl;
      videoEl.onloadedmetadata = () => {
        setValue('previewVideo.duration', formatTime(videoEl.duration));
      };
    } catch (err) {
      console.error(err);
      alert('Failed to upload/process preview video');
    } finally {
      setPreviewProcessing(false);
      e.target.value = '';
    }
  };

  const onSubmit = async (data: Live2FormData, event?: React.BaseSyntheticEvent) => {
    // Prevent default form submission behavior that causes scrolling
    event?.preventDefault();
    
    // Store current scroll position
    const currentScrollPosition = window.scrollY;
    
    setIsSubmitting(true);
    try {
      // Filter out empty items from arrays
      const cleanedData = {
        ...data,
        // Process course tags
        courseTags: data.courseTags?.filter(tag => tag.trim()),
        learningObjectives: data.learningObjectives?.filter(obj => obj.trim()),
        courseRequirements: data.courseRequirements?.filter(req => req.trim()),
        targetAudience: data.targetAudience?.filter(aud => aud.trim()),
        prerequisites: data.prerequisites?.filter(prereq => prereq.trim()),
        pricing: data.pricing?.filter(p => p.isActive), // Only include active pricing fields
        modules: data.modules?.filter(module => module.title.trim() || module.sessions.some(session => session.title.trim())),
      };

      console.log('Form data:', cleanedData);

      // Transform form data to match ILiveCourse interface
      const liveCourseData: ILiveCourse = {
        course_type: 'live',
        course_title: cleanedData.courseTitle,
        course_subtitle: '',
        course_category: cleanedData.category,
        course_subcategory: cleanedData.parentCategory?.join(', '), // Join selected subcategories
        course_tag: cleanedData.courseTags?.join(', '),
        course_level: 'Beginner', // Default level
        course_image: cleanedData.courseImage,
        course_description: {
          program_overview: cleanedData.programOverview,
          benefits: cleanedData.benefits,
          learning_objectives: cleanedData.learningObjectives || [],
          course_requirements: cleanedData.courseRequirements || [],
          target_audience: cleanedData.targetAudience || []
        },
        course_schedule: {
          start_date: new Date(),
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          session_days: ['Monday', 'Wednesday'],
          session_time: '18:00',
          timezone: 'UTC'
        },
        total_sessions: cleanedData.numberOfSessions,
        session_duration: 90, // Default 90 minutes
        modules: cleanedData.modules?.map((module, moduleIdx) => ({
          title: module.title,
          description: module.description,
          order: moduleIdx + 1,
          sessions: module.sessions?.map((session, sessionIdx) => ({
            title: session.title,
            description: session.description,
            order: sessionIdx + 1,
          })) || []
        })) || [],
        max_students: 30,
        prices: cleanedData.pricing?.map(p => ({
          currency: p.currency as 'USD' | 'EUR' | 'INR' | 'GBP' | 'AUD' | 'CAD',
          individual: p.individual,
          batch: p.batch,
          min_batch_size: p.minBatchSize,
          max_batch_size: p.maxBatchSize,
          early_bird_discount: p.earlyBirdDiscount || 0,
          group_discount: p.groupDiscount || 0,
          is_active: p.isActive
        })) || [],
        tools_technologies: [],
        faqs: [],
        instructors: [],
        prerequisites: cleanedData.prerequisites || [],
        certification: {
          is_certified: cleanedData.includeCertification === 'Yes',
          attendance_required: 80
        },
        status: 'Draft',
        language: 'English',
        brochures: [],
        is_Quizes: cleanedData.includeQuizzes as 'Yes' | 'No',
        is_Projects: cleanedData.includeProjects as 'Yes' | 'No',
        is_Assignments: cleanedData.includeAssignments as 'Yes' | 'No',
        is_Certification: cleanedData.includeCertification as 'Yes' | 'No',
        class_type: cleanedData.classType as 'Live Courses' | 'Blended Courses' | 'Self-Paced' | 'Virtual Learning' | 'Online Classes' | 'Hybrid' | 'Pre-Recorded',
        course_duration: cleanedData.courseDuration,
        no_of_Sessions: cleanedData.numberOfSessions
      };

      // Add grade or certificate information
      if (cleanedData.gradeOrCertificate === 'grade' && cleanedData.grade) {
        liveCourseData.course_grade = cleanedData.grade;
      }

      // Add preview video information
      if (cleanedData.previewVideo) {
        (liveCourseData as any).preview_video = {
          title: cleanedData.previewVideo.title,
          url: cleanedData.previewVideo.url,
          duration: cleanedData.previewVideo.duration,
          description: cleanedData.previewVideo.description
        };
      }
      
      // Create the course using the API
      const response = await courseTypesAPI.createCourse(liveCourseData);
      
      if (response?.data) {
        alert(`Course created successfully! Course ID: ${response.data._id}`);
        console.log('Course creation response:', response);
      } else {
        alert('Course creation failed. Please check the console for details.');
        console.error('Course creation failed:', response);
      }
    } catch (error) {
      console.error('Error creating course:', error);
      alert(`Error creating course: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
      // Restore scroll position to prevent jumping to top
      window.scrollTo(0, currentScrollPosition);
    }
  };

  // Styling classes
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  const inputClass = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";
  const errorClass = "mt-1 text-sm text-red-600 dark:text-red-500";
  const sectionClass = "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6";
  const buttonClass = "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
  const primaryButtonClass = `${buttonClass} text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500`;
  const secondaryButtonClass = `${buttonClass} text-gray-700 bg-white hover:bg-gray-50 border-gray-300 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:border-gray-600`;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading form options...</p>
        </div>
      </div>
    );
  }

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
                Create a live course with a streamlined form
              </p>
            </div>
            
            {apiError && (
              <div className="flex items-center text-red-600 dark:text-red-400">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span className="text-sm">{apiError}</span>
              </div>
            )}
            
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Category Section */}
          <div className={sectionClass}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Category Selection</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Category *</label>
                <select {...register("category")} className={inputClass}>
                  <option value="">Select category</option>
                  {masterData.categories && masterData.categories.length > 0 ? (
                    masterData.categories.map((cat, i) => (
                      <option key={i} value={cat}>{cat}</option>
                    ))
                  ) : (
                    <option disabled>Loading categories...</option>
                  )}
                </select>
                {errors.category && typeof errors.category.message === 'string' && <p className={errorClass}>{errors.category.message}</p>}
              </div>
              
              <div>
                <label className={labelClass}>Parent Category (Subcategory) *</label>
                <div className="space-y-2">
                  {masterData.parentCategories.map((cat, i) => (
                    <div key={i} className="flex items-center">
                      <input
                        type="checkbox"
                        value={cat}
                        {...register("parentCategory")}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{cat}</span>
                    </div>
                  ))}
                </div>
                {errors.parentCategory && typeof errors.parentCategory.message === 'string' && <p className={errorClass}>{errors.parentCategory.message}</p>}
              </div>
              
              <div>
                <label className={labelClass}>Course Tags</label>
                <div className="space-y-2">
                  {courseTags.map((field, idx) => (
                    <div key={field.id} className="flex items-center">
                      <input 
                        type="text" 
                        {...register(`courseTags.${idx}`)} 
                        className={inputClass} 
                        placeholder={`Course tag ${idx + 1}`}
                      />
                      <button 
                        type="button" 
                        onClick={() => removeCourseTag(idx)} 
                        className="ml-2 p-1 text-red-500 hover:text-red-700 focus:outline-none"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={() => appendCourseTag("")} 
                    className={`${secondaryButtonClass} mt-2 w-full`}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Course Tag
                  </button>
                </div>
                {errors.courseTags && typeof errors.courseTags.message === 'string' && <p className={errorClass}>{errors.courseTags.message}</p>}
              </div>
            </div>
          </div>

          {/* Basic Info Section */}
          <div className={sectionClass}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Course Title *</label>
                <input type="text" {...register("courseTitle")} className={inputClass} placeholder="Enter course title" />
                {errors.courseTitle && typeof errors.courseTitle.message === 'string' && <p className={errorClass}>{errors.courseTitle.message}</p>}
              </div>
              
              <div>
                <label className={labelClass}>Course Image *</label>
                <div className="mt-1 flex items-center">
                  <div className="w-32 h-32 rounded-md border border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden relative bg-gray-50 dark:bg-gray-800">
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
                    
                    {imageUploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      </div>
                    )}
                    
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleImageSelect}
                    />
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <div className="space-y-2">
                      <label className={`${secondaryButtonClass} cursor-pointer inline-flex items-center`}>
                        <Upload className="h-4 w-4 mr-2" />
                        Select Image
                      </label>
                      
                      {selectedImageFile && (
                        <>
                          <button
                            type="button"
                            onClick={handleImageUpload}
                            disabled={imageUploading}
                            className={`${primaryButtonClass} ${imageUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {imageUploading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                Upload
                              </>
                            )}
                          </button>
                          
                          <button
                            type="button"
                            onClick={handleCancelImageEdit}
                            className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Cancel
                          </button>
                        </>
                      )}
                      
                      {courseImage && !selectedImageFile && (
                        <button
                          type="button"
                          onClick={() => {
                            setCourseImage('');
                            setValue('courseImage', '', { shouldValidate: true });
                          }}
                          className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Remove Image
                        </button>
                      )}
                    </div>
                    
                    {/* File Info */}
                    {selectedImageFile && (
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <p><strong>Selected:</strong> {selectedImageFile.name}</p>
                        <p><strong>Size:</strong> {(selectedImageFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        <p><strong>Type:</strong> {selectedImageFile.type}</p>
                      </div>
                    )}
                    
                                          <div className="mt-3 space-y-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          <strong>Recommended:</strong> 1200x800 pixels (3:2 aspect ratio)
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          <strong>Formats:</strong> JPEG, PNG, WebP, GIF (max 5MB)
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          <strong>Minimum:</strong> 600x400 pixels
                        </p>
                      </div>
                  </div>
                </div>
                <input type="hidden" {...register("courseImage")} />
                {errors.courseImage && typeof errors.courseImage.message === 'string' && <p className={errorClass}>{errors.courseImage.message}</p>}
              </div>
              
              <div>
                <label className={labelClass}>Class Type *</label>
                <select {...register("classType")} className={inputClass}>
                  <option value="">Select class type</option>
                  <option value="Live Courses">Live Courses</option>
                  <option value="Blended Courses">Blended Courses</option>
                  <option value="Self-Paced">Self-Paced</option>
                  <option value="Virtual Learning">Virtual Learning</option>
                  <option value="Online Classes">Online Classes</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Pre-Recorded">Pre-Recorded</option>
                </select>
                {errors.classType && typeof errors.classType.message === 'string' && <p className={errorClass}>{errors.classType.message}</p>}
              </div>
              
              <div>
                <label className={labelClass}>Course Duration *</label>
                <select {...register("courseDuration")} className={inputClass}>
                  <option value="">Select course duration</option>
                  {masterData.courseDurations && masterData.courseDurations.length > 0 ? (
                    masterData.courseDurations.map((d, i) => (
                      <option key={i} value={d}>{d}</option>
                    ))
                  ) : (
                    <option disabled>Loading durations...</option>
                  )}
                </select>
                {errors.courseDuration && typeof errors.courseDuration.message === 'string' && <p className={errorClass}>{errors.courseDuration.message}</p>}
              </div>
              
              <div>
                <label className={labelClass}>Number of Sessions *</label>
                <input type="number" {...register("numberOfSessions")} className={inputClass} min={1} placeholder="Enter number of sessions" />
                {errors.numberOfSessions && typeof errors.numberOfSessions.message === 'string' && <p className={errorClass}>{errors.numberOfSessions.message}</p>}
              </div>
            </div>
          </div>

          {/* Course Features Section */}
          <div className={sectionClass}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Course Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Include Quizzes *</label>
                <select {...register("includeQuizzes")} className={inputClass}>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {errors.includeQuizzes && typeof errors.includeQuizzes.message === 'string' && <p className={errorClass}>{errors.includeQuizzes.message}</p>}
              </div>
              
              <div>
                <label className={labelClass}>Include Projects *</label>
                <select {...register("includeProjects")} className={inputClass}>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {errors.includeProjects && typeof errors.includeProjects.message === 'string' && <p className={errorClass}>{errors.includeProjects.message}</p>}
              </div>
              
              <div>
                <label className={labelClass}>Include Assignments *</label>
                <select {...register("includeAssignments")} className={inputClass}>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {errors.includeAssignments && typeof errors.includeAssignments.message === 'string' && <p className={errorClass}>{errors.includeAssignments.message}</p>}
              </div>
              
              <div>
                <label className={labelClass}>Include Certification *</label>
                <select {...register("includeCertification")} className={inputClass}>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {errors.includeCertification && typeof errors.includeCertification.message === 'string' && <p className={errorClass}>{errors.includeCertification.message}</p>}
              </div>
              
              <div>
                <label className={labelClass}>Grade/Certificate Toggle *</label>
                <select {...register("gradeOrCertificate")} className={inputClass}>
                  <option value="grade">Grade</option>
                  <option value="certificate">Certificate</option>
                </select>
                {errors.gradeOrCertificate && typeof errors.gradeOrCertificate.message === 'string' && <p className={errorClass}>{errors.gradeOrCertificate.message}</p>}
              </div>
              
              {watch("gradeOrCertificate") === "grade" && (
                <div>
                  <label className={labelClass}>Grade *</label>
                  <select {...register("grade")} className={inputClass}>
                    <option value="">Select grade</option>
                    {masterData.grades && masterData.grades.length > 0 ? (
                      masterData.grades.map((g, i) => (
                        <option key={i} value={g}>{g}</option>
                      ))
                    ) : (
                      <option disabled>Loading grades...</option>
                    )}
                  </select>
                  {errors.grade && typeof errors.grade.message === 'string' && <p className={errorClass}>{errors.grade.message}</p>}
                </div>
              )}
              
              {watch("gradeOrCertificate") === "certificate" && (
                <div>
                  <label className={labelClass}>Certificate Type *</label>
                  <select {...register("certificateType")} className={inputClass}>
                    <option value="">Select certificate type</option>
                    {masterData.certificates && masterData.certificates.length > 0 ? (
                      masterData.certificates.map((c, i) => (
                        <option key={i} value={c}>{c}</option>
                      ))
                    ) : (
                      <option disabled>Loading certificates...</option>
                    )}
                  </select>
                  {errors.certificateType && typeof errors.certificateType.message === 'string' && <p className={errorClass}>{errors.certificateType.message}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Pricing Section */}
          <div className={sectionClass}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Pricing</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Set pricing options for individual and batch enrollments
            </p>
            
            {pricing.map((field, index) => (
              <div key={field.id} className="mb-6 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Pricing Configuration #{index + 1}
                  </h3>
                  
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removePricing(index)}
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
                      {...register(`pricing.${index}.currency` as const, { required: "Currency is required" })}
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
                    {Array.isArray(errors.pricing) && errors.pricing[index]?.currency && typeof errors.pricing[index].currency.message === 'string' && <p className={errorClass}>{errors.pricing[index].currency.message}</p>}
                  </div>
                  
                  <div>
                    <label className={labelClass}>Individual Price *</label>
                    <input
                      type="number"
                      {...register(`pricing.${index}.individual` as const, { 
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
                    {Array.isArray(errors.pricing) && errors.pricing[index]?.individual && typeof errors.pricing[index].individual.message === 'string' && <p className={errorClass}>{errors.pricing[index].individual.message}</p>}
                  </div>
                  
                  <div>
                    <label className={labelClass}>Batch Price (per student) *</label>
                    <input
                      type="number"
                      {...register(`pricing.${index}.batch` as const, { 
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
                    {Array.isArray(errors.pricing) && errors.pricing[index]?.batch && typeof errors.pricing[index].batch.message === 'string' && <p className={errorClass}>{errors.pricing[index].batch.message}</p>}
                  </div>
                  
                  <div>
                    <label className={labelClass}>Minimum Batch Size *</label>
                    <input
                      type="number"
                      {...register(`pricing.${index}.minBatchSize` as const, { 
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
                    {Array.isArray(errors.pricing) && errors.pricing[index]?.minBatchSize && typeof errors.pricing[index].minBatchSize.message === 'string' && <p className={errorClass}>{errors.pricing[index].minBatchSize.message}</p>}
                  </div>
                  
                  <div>
                    <label className={labelClass}>Maximum Batch Size *</label>
                    <input
                      type="number"
                      {...register(`pricing.${index}.maxBatchSize` as const, { 
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
                    {Array.isArray(errors.pricing) && errors.pricing[index]?.maxBatchSize && typeof errors.pricing[index].maxBatchSize.message === 'string' && <p className={errorClass}>{errors.pricing[index].maxBatchSize.message}</p>}
                  </div>
                  
                  <div>
                    <label className={labelClass}>Early Bird Discount (%)</label>
                    <input
                      type="number"
                      {...register(`pricing.${index}.earlyBirdDiscount` as const, {
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
                    {Array.isArray(errors.pricing) && errors.pricing[index]?.earlyBirdDiscount && typeof errors.pricing[index].earlyBirdDiscount.message === 'string' && <p className={errorClass}>{errors.pricing[index].earlyBirdDiscount.message}</p>}
                  </div>
                  
                  <div>
                    <label className={labelClass}>Group Discount (%)</label>
                    <input
                      type="number"
                      {...register(`pricing.${index}.groupDiscount` as const, {
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
                    {Array.isArray(errors.pricing) && errors.pricing[index]?.groupDiscount && typeof errors.pricing[index].groupDiscount.message === 'string' && <p className={errorClass}>{errors.pricing[index].groupDiscount.message}</p>}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        {...register(`pricing.${index}.isActive` as const)}
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
              onClick={() => appendPricing({
                currency: "USD",
                individual: 299,
                batch: 249,
                minBatchSize: 5,
                maxBatchSize: 20,
                earlyBirdDiscount: 15,
                groupDiscount: 20,
                isActive: true
              })}
              className={`${secondaryButtonClass} mt-2`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Pricing Configuration
            </button>
          </div>

          {/* Description Section */}
          <div className={sectionClass}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Course Description</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className={labelClass}>Program Overview *</label>
                <textarea {...register("programOverview")} className={inputClass} rows={4} placeholder="Describe what this course is about..." />
                {errors.programOverview && typeof errors.programOverview.message === 'string' && <p className={errorClass}>{errors.programOverview.message}</p>}
              </div>
              
              <div className="md:col-span-2">
                <label className={labelClass}>Benefits *</label>
                <textarea {...register("benefits")} className={inputClass} rows={3} placeholder="Describe the benefits students will gain..." />
                {errors.benefits && typeof errors.benefits.message === 'string' && <p className={errorClass}>{errors.benefits.message}</p>}
              </div>
            </div>
          </div>

          {/* Dynamic Arrays Section */}
          <div className={sectionClass}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Additional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Learning Objectives */}
              <div>
                <label className={labelClass}>Learning Objectives</label>
                <div className="space-y-2">
                  {learningObjectives.map((field, idx) => (
                    <div key={field.id} className="flex items-center">
                      <input 
                        type="text" 
                        {...register(`learningObjectives.${idx}`)} 
                        className={inputClass} 
                        placeholder={`Learning objective ${idx + 1}`}
                      />
                      <button 
                        type="button" 
                        onClick={() => removeLearningObjective(idx)} 
                        className="ml-2 p-1 text-red-500 hover:text-red-700 focus:outline-none"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={() => appendLearningObjective("")} 
                    className={`${secondaryButtonClass} mt-2 w-full`}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Learning Objective
                  </button>
                </div>
              </div>

              {/* Course Requirements */}
              <div>
                <label className={labelClass}>Course Requirements</label>
                <div className="space-y-2">
                  {courseRequirements.map((field, idx) => (
                    <div key={field.id} className="flex items-center">
                      <input 
                        type="text" 
                        {...register(`courseRequirements.${idx}`)} 
                        className={inputClass} 
                        placeholder={`Requirement ${idx + 1}`}
                      />
                      <button 
                        type="button" 
                        onClick={() => removeCourseRequirement(idx)} 
                        className="ml-2 p-1 text-red-500 hover:text-red-700 focus:outline-none"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={() => appendCourseRequirement("")} 
                    className={`${secondaryButtonClass} mt-2 w-full`}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Requirement
                  </button>
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <label className={labelClass}>Target Audience</label>
                <div className="space-y-2">
                  {targetAudience.map((field, idx) => (
                    <div key={field.id} className="flex items-center">
                      <input 
                        type="text" 
                        {...register(`targetAudience.${idx}`)} 
                        className={inputClass} 
                        placeholder={`Target audience ${idx + 1}`}
                      />
                      <button 
                        type="button" 
                        onClick={() => removeTargetAudience(idx)} 
                        className="ml-2 p-1 text-red-500 hover:text-red-700 focus:outline-none"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={() => appendTargetAudience("")} 
                    className={`${secondaryButtonClass} mt-2 w-full`}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Target Audience
                  </button>
                </div>
              </div>

              {/* Prerequisites */}
              <div>
                <label className={labelClass}>Prerequisites</label>
                <div className="space-y-2">
                  {prerequisites.map((field, idx) => (
                    <div key={field.id} className="flex items-center">
                      <input 
                        type="text" 
                        {...register(`prerequisites.${idx}`)} 
                        className={inputClass} 
                        placeholder={`Prerequisite ${idx + 1}`}
                      />
                      <button 
                        type="button" 
                        onClick={() => removePrerequisite(idx)} 
                        className="ml-2 p-1 text-red-500 hover:text-red-700 focus:outline-none"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={() => appendPrerequisite("")} 
                    className={`${secondaryButtonClass} mt-2 w-full`}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Prerequisite
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Video Section */}
          <div className={sectionClass}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Preview Video</h2>
            <div>
              <input id="preview-video-upload" type="file" accept="video/*" className="hidden" onChange={handlePreviewVideoFileSelect} />
              <label htmlFor="preview-video-upload" className={secondaryButtonClass}>
                {previewProcessing ? 'Processing...' : 'Upload Video'}
              </label>
            </div>
            {(watch('previewVideo.previewUrl') || watch('previewVideo.url')) && (
              <div className="mt-4 space-y-2">
                <p><strong>Title:</strong> {watch('previewVideo.title')}</p>
                <p><strong>Duration:</strong> {watch('previewVideo.duration')}</p>
                <video src={watch('previewVideo.previewUrl') || watch('previewVideo.url')} controls className="w-full max-h-64 rounded-lg" />
              </div>
            )}
            <div className="mt-4">
              <label className={labelClass}>Description</label>
              <textarea {...register("previewVideo.description")} className={inputClass} rows={2} placeholder="A short preview of the course" />
            </div>
          </div>

          {/* Brochures Section */}
          <div className={sectionClass}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Brochures
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Upload PDF brochures for this course
            </p>
            
            <div className="space-y-4">
              {watch('brochures') && watch('brochures').length > 0 ? (
                <div className="space-y-2">
                  {(watch('brochures') as string[]).map((brochure: string, index: number) => (
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
                  Upload PDF brochures only
                </p>
              </div>
            </div>
          </div>

          {/* Modules and Sessions Section */}
          <div className={sectionClass}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Course Modules and Sessions</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Organize your course content into modules and sessions</p>
            {modules.map((module, moduleIdx) => (
              <div key={module.id} className="mb-8 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Module #{moduleIdx + 1}</h3>
                  {modules.length > 1 && (
                    <button type="button" onClick={() => removeModule(moduleIdx)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <div className="mb-4">
                  <label className={labelClass}>Module Title</label>
                  <input type="text" {...register(`modules.${moduleIdx}.title`)} className={inputClass} placeholder={`Module ${moduleIdx + 1}: Introduction`} />
                  {errors.modules && Array.isArray(errors.modules) && errors.modules[moduleIdx]?.title && typeof errors.modules[moduleIdx].title.message === 'string' && <p className={errorClass}>{errors.modules[moduleIdx].title.message}</p>}
                </div>
                <div className="mb-4">
                  <label className={labelClass}>Module Description</label>
                  <textarea {...register(`modules.${moduleIdx}.description`)} className={inputClass} rows={2} placeholder="Getting started with the course" />
                  {errors.modules && Array.isArray(errors.modules) && errors.modules[moduleIdx]?.description && typeof errors.modules[moduleIdx].description.message === 'string' && <p className={errorClass}>{errors.modules[moduleIdx].description.message}</p>}
                </div>
                <ModuleSessions
                  nestIndex={moduleIdx}
                  control={control}
                  register={register}
                  errors={errors}
                  secondaryButtonClass={secondaryButtonClass}
                  labelClass={labelClass}
                  inputClass={inputClass}
                  errorClass={errorClass}
                />
              </div>
            ))}
            <button type="button" onClick={() => appendModule({ title: '', description: '', sessions: [{ title: '', description: '' }] })} className={`${primaryButtonClass} mt-2`}>
              <Plus className="h-4 w-4 mr-2" /> Add Module
            </button>
          </div>

          {/* Submit Section */}
          <div className="flex justify-end space-x-4">
            <button 
              type="button" 
              onClick={() => window.history.back()} 
              className={secondaryButtonClass}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={primaryButtonClass}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Course...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Course
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 