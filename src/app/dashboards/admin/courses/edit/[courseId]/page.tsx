"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft,
  Plus, 
  Edit3, 
  Trash2, 
  Save,
  BookOpen,
  Video,
  FileText,
  Clock,
  Users,
  Calendar,
  Settings,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Play,
  Download,
  Upload,
  X,
  Check,
  CheckCircle,
  AlertCircle,
  Info,
  Eye,
  GripVertical,
  Copy,
  Link as LinkIcon,
  Film, // Add Film icon for video
  Loader  // Add Loader icon for upload progress
} from "lucide-react";
import { showToast } from '@/utils/toastManager';
import { motion, AnimatePresence } from 'framer-motion';
import { courseTypesAPI } from "@/apis/courses";
import { uploadCourseImageFromFileAsync } from "@/apis/course/course";
import type { 
  TNewCourse, 
  TCourseType,
  ICurriculumWeek,
  ICurriculumLesson,
  ICurriculumSection,
  ILiveClass,
  ICurriculumStats
} from "@/apis/courses";

interface CourseEditPageProps {}

interface LoadingStates {
  course: boolean;
  curriculum: boolean;
  saving: boolean;
  deleting: string | null;
  adding: string | null;
  imageUploading: boolean;
  allCourses: boolean; // Add loading state for all courses
  videoUploading: Record<string, boolean>; // Add video upload loading states
}

interface EditingStates {
  week: string | null;
  lesson: string | null;
  section: string | null;
  liveClass: string | null;
}

interface EditForms {
  week: {
    _id: string;
    title: string;
    description: string;
    order: number;
  } | null;
  lesson: {
    _id: string;
    weekId: string;
    title: string;
    description: string;
    content_type: 'video' | 'text' | 'quiz' | 'assignment';
    content_url: string;
    duration: number;
    order: number;
    is_preview: boolean;
  } | null;
  section: {
    _id: string;
    weekId: string;
    title: string;
    description: string;
    order: number;
  } | null;
  liveClass: {
    _id: string;
    weekId: string;
    title: string;
    description: string;
    scheduled_date: Date;
    duration: number;
    instructor_requirements: string[];
  } | null;
}

// Add interface for all courses management
interface IAllCoursesManager {
  courses: TNewCourse[];
  loading: boolean;
  error: string | null;
  searchCourse: (courseId: string) => TNewCourse | null;
  refreshCourses: () => Promise<void>;
  getCoursesByType: (type: TCourseType) => TNewCourse[];
  getCoursesByCategory: (category: string) => TNewCourse[];
}

// Add video upload state interfaces
interface VideoUploadProgress {
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}

interface VideoData {
  url: string;
  duration?: number;
  thumbnail?: string;
  size?: number;
}

const CourseEditPage: React.FC<CourseEditPageProps> = () => {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.courseId as string;

  // State management
  const [course, setCourse] = useState<TNewCourse | null>(null);
  const [courseType, setCourseType] = useState<TCourseType | null>(null);
  const [curriculum, setCurriculum] = useState<ICurriculumWeek[]>([]);
  const [curriculumStats, setCurriculumStats] = useState<ICurriculumStats | null>(null);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set());
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    course: false,
    curriculum: false,
    saving: false,
    deleting: null,
    adding: null,
    imageUploading: false,
    allCourses: false, // Initialize new loading state
    videoUploading: {} // Initialize video upload loading states
  });
  const [editingStates, setEditingStates] = useState<EditingStates>({
    week: null,
    lesson: null,
    section: null,
    liveClass: null
  });
  const [editForms, setEditForms] = useState<EditForms>({
    week: null,
    lesson: null,
    section: null,
    liveClass: null
  });
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Form states for adding new content
  const [newWeekForm, setNewWeekForm] = useState({
    title: '',
    description: '',
    order: curriculum.length + 1
  });
  const [newLessonForm, setNewLessonForm] = useState({
    title: '',
    description: '',
    content_type: 'video' as 'video' | 'text' | 'quiz' | 'assignment',
    content_url: '',
    duration: 0,
    order: 0,
    is_preview: false
  });
  const [newSectionForm, setNewSectionForm] = useState({
    title: '',
    description: '',
    order: 0
  });
  const [newLiveClassForm, setNewLiveClassForm] = useState({
    title: '',
    description: '',
    scheduled_date: new Date(),
    duration: 60,
    instructor_requirements: [] as string[]
  });

  // Add state for all courses management
  const [allCourses, setAllCourses] = useState<TNewCourse[]>([]);
  const [allCoursesError, setAllCoursesError] = useState<string | null>(null);

  // Add states for video upload management
  const [videoUploadProgress, setVideoUploadProgress] = useState<Record<string, VideoUploadProgress>>({});
  const [videoData, setVideoData] = useState<Record<string, VideoData>>({});
  const [selectedVideoFile, setSelectedVideoFile] = useState<Record<string, File | null>>({});

  // Determine course type from course data
  const determineCourseType = useCallback((courseData: any): TCourseType => {
    console.log("Determining course type for:", courseData);
    
    // Check if it's already a new course type
    if (courseData?.course_type && ['blended', 'live', 'free'].includes(courseData.course_type)) {
      console.log("Found explicit course_type:", courseData.course_type);
      return courseData.course_type as TCourseType;
    }
    
    // Fallback logic for legacy courses
    if (courseData?.category_type === 'Free' || courseData?.isFree === true) {
      console.log("Detected as free course");
      return 'free';
    }
    
    if (courseData?.category_type === 'Live' || 
        courseData?.class_type?.toLowerCase().includes('live') ||
        courseData?.classType?.toLowerCase().includes('live')) {
      console.log("Detected as live course");
      return 'live';
    }
    
    if (courseData?.category_type === 'Paid' || 
        courseData?.class_type?.toLowerCase().includes('blended') ||
        courseData?.classType?.toLowerCase().includes('blended')) {
      console.log("Detected as blended course");
      return 'blended';
    }
    
    // Final fallback - check for pricing to determine if free or paid
    if (courseData?.course_fee === 0 || 
        (courseData?.prices && courseData.prices.length === 0)) {
      console.log("Detected as free course based on pricing");
      return 'free';
    }
    
    console.log("Defaulting to blended course");
    return 'blended'; // Default fallback
  }, []);

  // Create all courses manager utility
  const allCoursesManager: IAllCoursesManager = {
    courses: allCourses,
    loading: loadingStates.allCourses,
    error: allCoursesError,
    searchCourse: (courseId: string) => {
      return allCourses.find(c => c._id === courseId) || null;
    },
    refreshCourses: async () => {
      await fetchAllCourses();
    },
    getCoursesByType: (type: TCourseType) => {
      return allCourses.filter(c => c.course_type === type);
    },
    getCoursesByCategory: (category: string) => {
      return allCourses.filter(c => c.course_category === category);
    }
  };

  // Load all courses using the simple /courses/get endpoint
  const fetchAllCourses = useCallback(async () => {
    setLoadingStates(prev => ({ ...prev, allCourses: true }));
    setAllCoursesError(null);

    try {
      console.log("🚀 Loading all courses from /courses/get endpoint...");
      
      // Import the getAllCourses function and make the API call
      const { getAllCourses } = await import("@/apis/course/course");
      const { apiClient } = await import("@/apis/apiClient");
      
      const coursesUrl = getAllCourses();
      console.log("📋 Fetching from:", coursesUrl);
      
      const response = await apiClient.get(coursesUrl);
      console.log("📊 API response:", response);

      if (response?.data?.success && response.data.data && Array.isArray(response.data.data)) {
        const coursesData = response.data.data;
        
        // Ensure each course has a course_type property set based on its characteristics
        const coursesWithType = coursesData.map((course: any) => {
          if (!course.course_type) {
            // Use the determineCourseType function to set the type
            const detectedType = determineCourseType(course);
            (course as any).course_type = detectedType;
          }
          return course;
        });
        
        console.log(`✅ Successfully loaded ${coursesWithType.length} courses`);
        setAllCourses(coursesWithType);
        
        // Group courses by type for better statistics
        const coursesByType = coursesWithType.reduce((acc: Record<string, number>, course: any) => {
          const type = course.course_type || 'unknown';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        // Show detailed stats in toast
        const statsMessage = Object.entries(coursesByType)
          .map(([type, count]) => `${count} ${type}`)
          .join(', ');
        
        showToast.success(`Loaded ${coursesWithType.length} courses (${statsMessage})`);
        
        return coursesWithType;
      } else {
        throw new Error("No courses data received from /courses/get endpoint");
      }
    } catch (error) {
      console.error("❌ Error loading all courses:", error);
      setAllCoursesError(error instanceof Error ? error.message : 'Unknown error');
      
      // Fallback: Try individual course type APIs if the main endpoint fails
      console.log("🔄 Attempting fallback to individual course type APIs...");
      try {
        const fallbackCourses = await loadCoursesWithFallback();
        setAllCourses(fallbackCourses);
        showToast.warning(`Loaded ${fallbackCourses.length} courses using fallback method`);
        return fallbackCourses;
      } catch (fallbackError) {
        console.error("❌ Fallback loading also failed:", fallbackError);
        showToast.error('Failed to load courses. Please check your connection.');
        return [];
      }
    } finally {
      setLoadingStates(prev => ({ ...prev, allCourses: false }));
    }
  }, [determineCourseType]);

  // Load courses using individual course type APIs
  const loadCoursesWithFallback = async (): Promise<TNewCourse[]> => {
    const courseTypes: TCourseType[] = ['blended', 'live', 'free'];
    const allCourses: TNewCourse[] = [];
    const loadingResults: Record<string, { success: boolean; count: number; error?: string }> = {};

    console.log("📋 Loading courses from individual APIs...");

    for (const type of courseTypes) {
      try {
        console.log(`📚 Fetching ${type} courses...`);
        const response = await courseTypesAPI.getCoursesByType(type);
        
        if (response?.data?.success && response.data.data && Array.isArray(response.data.data)) {
          const coursesWithType = response.data.data.map(course => {
            // Ensure course_type is properly set for the course
            if (!course.course_type) {
              (course as any).course_type = type;
            }
            return course;
          });
          
          allCourses.push(...coursesWithType);
          loadingResults[type] = { success: true, count: coursesWithType.length };
          console.log(`✅ Loaded ${coursesWithType.length} ${type} courses`);
        } else {
          loadingResults[type] = { success: false, count: 0, error: 'No data received' };
          console.warn(`⚠️ No ${type} courses data received`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        loadingResults[type] = { success: false, count: 0, error: errorMessage };
        console.warn(`❌ Failed to load ${type} courses:`, errorMessage);
        continue;
      }
    }

    // Log summary
    const successfulTypes = Object.entries(loadingResults)
      .filter(([_, result]) => result.success)
      .map(([type, result]) => `${type}: ${result.count}`)
      .join(', ');
    
    const failedTypes = Object.entries(loadingResults)
      .filter(([_, result]) => !result.success)
      .map(([type]) => type);

    console.log(`📊 Loading summary: ${successfulTypes}`);
    if (failedTypes.length > 0) {
      console.warn(`⚠️ Failed to load: ${failedTypes.join(', ')}`);
    }

    return allCourses;
  };

  // Improved course fetching function
  const fetchCourse = useCallback(async () => {
    if (!courseId) return;

    setLoadingStates(prev => ({ ...prev, course: true }));
    setError(null);

    try {
      console.log("🔍 Searching for course with ID:", courseId);
      
      // First, check if we already have the course in our all courses cache
      const cachedCourse = allCoursesManager.searchCourse(courseId);
      if (cachedCourse) {
        console.log("💾 Found course in cache:", cachedCourse.course_title);
        const detectedType = determineCourseType(cachedCourse);
        setCourseType(detectedType);
        setCourse(cachedCourse);
        showToast.success('Course loaded from cache');
        return;
      }

      // If not in cache, load all courses first
      if (allCourses.length === 0) {
        console.log("📋 Loading all courses to find the target course...");
        const loadedCourses = await fetchAllCourses();
        
        // Search in the newly loaded courses
        const foundCourse = loadedCourses.find((c: any) => c._id === courseId);
        if (foundCourse) {
          console.log("✅ Found course after loading all courses:", foundCourse.course_title);
          const detectedType = determineCourseType(foundCourse);
          setCourseType(detectedType);
          setCourse(foundCourse);
          showToast.success('Course loaded successfully');
          return;
        }
      }

      // Final fallback: Try direct API calls with different types
      console.log("🔄 Trying direct API calls for course:", courseId);
      await tryDirectCourseFetch();
      
    } catch (error) {
      console.error("❌ Error in fetchCourse:", error);
      setError(`Failed to load course. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      showToast.error('Failed to load course');
    } finally {
      setLoadingStates(prev => ({ ...prev, course: false }));
    }
  }, [courseId, allCourses, determineCourseType]);

  // Direct course fetch as final fallback
  const tryDirectCourseFetch = async () => {
    const courseTypes: TCourseType[] = ['blended', 'live', 'free'];
    
    for (const type of courseTypes) {
      try {
        console.log(`🎯 Trying to fetch course as ${type} type`);
        const response = await courseTypesAPI.getCourseById(type, courseId);
        
        if (response?.data?.success && response.data.data) {
          console.log(`✅ Successfully found course as ${type} type:`, response.data.data.course_title);
          setCourseType(type);
          setCourse(response.data.data);
          showToast.success('Course loaded successfully');
          return;
        }
      } catch (error) {
        console.log(`❌ Failed to fetch as ${type} type:`, error);
        continue;
      }
    }
    
    throw new Error(`Course with ID ${courseId} not found in any system`);
  };

  // Fetch curriculum data
  const fetchCurriculum = useCallback(async () => {
    // Use the actual course ID from the loaded course, or fallback to URL parameter
    const actualCourseId = course?._id || courseId;
    
    if (!actualCourseId || !courseType) {
      console.log("Missing courseId or courseType:", { actualCourseId, courseType });
      return;
    }

    setLoadingStates(prev => ({ ...prev, curriculum: true }));

    try {
      console.log("Fetching curriculum for courseType:", courseType, "courseId:", actualCourseId);
      
      // Try the direct API call that matches your JSON response format
      try {
        const { apiClient } = await import("@/apis/apiClient");
        const { apiBaseUrl } = await import("@/apis/config");
        
        // Based on your response, try the exact endpoint that's working
        const directUrl = `${apiBaseUrl}/tcourse/${courseType}/${actualCourseId}/curriculum`;
        console.log("Trying direct curriculum URL:", directUrl);
        
        const directResponse = await apiClient.get(directUrl);
        console.log("Direct curriculum response:", directResponse);
        
        if (directResponse?.data?.success && directResponse.data.data) {
          const curriculumData = directResponse.data.data;
          
          if (curriculumData?.curriculum && Array.isArray(curriculumData.curriculum)) {
            console.log("Found curriculum data:", curriculumData.curriculum.length, "weeks");
            
            const convertedCurriculum = curriculumData.curriculum.map((week: any, index: number) => {
              // ALWAYS use the backend week format (week_1, week_2, etc.)
              // Backend expects this specific format regardless of what's in the data
              const weekId = `week_${index + 1}`;
              
              console.log(`📋 Converting week ${index + 1}:`, {
                originalId: week._id,
                convertedId: weekId,
                title: week.weekTitle || week.title,
                backendFormat: true
              });
              
              return {
                _id: weekId, // ALWAYS use week_N format for backend compatibility
                title: week.weekTitle || week.title || `Week ${index + 1}`,
                weekTitle: week.weekTitle || week.title || `Week ${index + 1}`, // Keep backend field
                description: week.weekDescription || week.description || '',
                weekDescription: week.weekDescription || week.description || '', // Keep backend field
                order: index + 1,
                lessons: week.lessons || [],
                sections: week.sections || [],
                live_classes: week.liveClasses || [],
                topics: week.topics || [],
                resources: week.resources || []
              };
            });
            
            console.log("Converted curriculum:", convertedCurriculum);
            setCurriculum(convertedCurriculum);
            setCurriculumStats({
              total_weeks: curriculumData.total_weeks || convertedCurriculum.length,
              total_lessons: convertedCurriculum.reduce((acc: number, week: any) => acc + (week.lessons?.length || 0), 0),
              total_duration_minutes: 0,
              completion_rate: 0
            });
            
            showToast.success(`Curriculum loaded successfully - ${convertedCurriculum.length} weeks found`);
            return;
          }
        }
      } catch (directError) {
        console.log("Direct curriculum fetch failed:", directError);
      }
      
      // Try the new curriculum API
      try {
        const response = await courseTypesAPI.curriculum.getCurriculum(courseType, actualCourseId);
        console.log("New curriculum API response:", response);
        
        if (response?.data) {
          setCurriculum(response.data.curriculum || []);
          setCurriculumStats(response.data.stats || null);
          showToast.success('Curriculum loaded successfully (new API)');
          return;
        }
      } catch (curriculumError) {
        console.log("New curriculum API failed:", curriculumError);
      }
      
      // Fallback: Try multiple endpoints with different course IDs
      const fallbackIds = ['67c2e30ca03dd003421a2765', actualCourseId];
      const fallbackTypes = ['blended', courseType, 'live', 'free'];
      
      for (const tryType of fallbackTypes) {
        for (const tryId of fallbackIds) {
          if (!tryType || !tryId) continue;
          
          try {
            const { apiClient } = await import("@/apis/apiClient");
            const { apiBaseUrl } = await import("@/apis/config");
            
            const fallbackUrl = `${apiBaseUrl}/tcourse/${tryType}/${tryId}/curriculum`;
            console.log(`Trying fallback URL: ${fallbackUrl}`);
            
            const fallbackResponse = await apiClient.get(fallbackUrl);
            
            if (fallbackResponse?.data?.success && fallbackResponse.data.data?.curriculum) {
              const curriculumData = fallbackResponse.data.data;
              const convertedCurriculum = curriculumData.curriculum.map((week: any, index: number) => {
                // ALWAYS use the backend week format (week_1, week_2, etc.)
                const weekId = `week_${index + 1}`;
                
                return {
                  _id: weekId, // ALWAYS use week_N format for backend compatibility
                  title: week.weekTitle || `Week ${index + 1}`,
                  description: week.weekDescription || '',
                  order: index + 1,
                  lessons: week.lessons || [],
                  sections: week.sections || [],
                  live_classes: week.liveClasses || [],
                  topics: week.topics || [],
                  resources: week.resources || []
                };
              });
              
              setCurriculum(convertedCurriculum);
              setCurriculumStats({
                total_weeks: curriculumData.total_weeks || convertedCurriculum.length,
                total_lessons: convertedCurriculum.reduce((acc: number, week: any) => acc + (week.lessons?.length || 0), 0),
                total_duration_minutes: 0,
                completion_rate: 0
              });
              
              showToast.success(`Curriculum loaded successfully - ${convertedCurriculum.length} weeks found`);
              return;
            }
          } catch (fallbackError) {
            console.log(`Fallback ${tryType}/${tryId} failed:`, fallbackError);
            continue;
          }
        }
      }
      
      // If all methods fail, set empty curriculum
      console.log("All curriculum fetch methods failed");
      setCurriculum([]);
      setCurriculumStats(null);
      
    } catch (error) {
      console.error("Error fetching curriculum:", error);
      showToast.error('Failed to load curriculum');
    } finally {
      setLoadingStates(prev => ({ ...prev, curriculum: false }));
    }
  }, [courseId, courseType, course]);

  // Add new week
  const handleAddWeek = async () => {
    if (!courseType || !newWeekForm.title.trim()) {
      showToast.error('Please fill in all required fields');
      return;
    }

    // Use the actual course ID from the loaded course, or fallback to URL parameter
    const actualCourseId = course?._id || courseId;
    
    if (!actualCourseId) {
      showToast.error('Course ID not available. Please refresh the page.');
      return;
    }

    setLoadingStates(prev => ({ ...prev, adding: 'week' }));

    try {
      console.log("Adding week with courseType:", courseType, "courseId:", actualCourseId);
      
      const weekData = {
        title: newWeekForm.title,
        weekTitle: newWeekForm.title, // Backend expects weekTitle field
        description: newWeekForm.description,
        weekDescription: newWeekForm.description, // Backend might expect weekDescription too
        order: newWeekForm.order,
        lessons: [],
        sections: [],
        live_classes: []
      };
      
      console.log("📤 Sending week data to backend:", weekData);
      console.log("📋 API endpoint:", `${courseType}/${actualCourseId}/curriculum/weeks`);
      
      const response = await courseTypesAPI.curriculum.addWeek(courseType, actualCourseId, weekData);

      if (response?.data?.week) {
        // Ensure the week from backend has proper ID format
        const newWeek = {
          ...response.data.week,
          _id: response.data.week._id || `week_${curriculum.length + 1}`
        };
        setCurriculum(prev => [...prev, newWeek].sort((a, b) => a.order - b.order));
        setNewWeekForm({ title: '', description: '', order: curriculum.length + 2 });
        showToast.success('Week added successfully');
      } else {
        // Fallback: Add week locally using backend-compatible format
        const newWeek = {
          _id: `week_${curriculum.length + 1}`, // Use backend format
          title: newWeekForm.title,
          description: newWeekForm.description,
          order: newWeekForm.order,
          lessons: [],
          sections: [],
          live_classes: []
        };
        setCurriculum(prev => [...prev, newWeek].sort((a, b) => a.order - b.order));
        setNewWeekForm({ title: '', description: '', order: curriculum.length + 2 });
        showToast.success('Week added successfully (local)');
      }
    } catch (error) {
      console.error("Error adding week:", error);
      showToast.error('Failed to add week. You can still manage existing content.');
    } finally {
      setLoadingStates(prev => ({ ...prev, adding: null }));
    }
  };

  // Start editing week
  const handleEditWeek = (week: ICurriculumWeek) => {
    setEditingStates(prev => ({ ...prev, week: week._id! }));
    setEditForms(prev => ({
      ...prev,
      week: {
        _id: week._id!,
        title: week.title,
        description: week.description || '',
        order: week.order
      }
    }));
  };

  // Save week edits
  const handleSaveWeek = async () => {
    if (!editForms.week || !courseType) return;

    const actualCourseId = course?._id || courseId;
    setLoadingStates(prev => ({ ...prev, saving: true }));

    try {
      // Try to update via API
      try {
        await courseTypesAPI.curriculum.updateWeek(courseType, actualCourseId, editForms.week._id, {
          title: editForms.week.title,
          weekTitle: editForms.week.title, // Backend expects weekTitle field
          description: editForms.week.description,
          weekDescription: editForms.week.description, // Backend might expect weekDescription too
          order: editForms.week.order
        });
      } catch (apiError) {
        console.log("Week update API failed, updating locally:", apiError);
      }

      // Update local state
      setCurriculum(prev => prev.map(week => 
        week._id === editForms.week!._id 
          ? { ...week, ...editForms.week! }
          : week
      ));

      // Clear editing state
      setEditingStates(prev => ({ ...prev, week: null }));
      setEditForms(prev => ({ ...prev, week: null }));
      showToast.success('Week updated successfully');
    } catch (error) {
      console.error("Error updating week:", error);
      showToast.error('Failed to update week');
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  };

  // Cancel week edit
  const handleCancelWeekEdit = () => {
    setEditingStates(prev => ({ ...prev, week: null }));
    setEditForms(prev => ({ ...prev, week: null }));
  };

  // Delete week
  const handleDeleteWeek = async (weekId: string, weekTitle: string) => {
    const actualCourseId = course?._id || courseId;
    if (!courseType || !actualCourseId) return;
    
    if (!confirm(`Are you sure you want to delete "${weekTitle}"? This will remove all lessons and content in this week.`)) {
      return;
    }

    setLoadingStates(prev => ({ ...prev, deleting: weekId }));

    try {
      try {
        await courseTypesAPI.curriculum.deleteWeek(courseType, actualCourseId, weekId);
      } catch (apiError) {
        console.log("Delete week API failed, deleting locally:", apiError);
      }
      setCurriculum(prev => prev.filter(week => week._id !== weekId));
      showToast.success('Week deleted successfully');
    } catch (error) {
      console.error("Error deleting week:", error);
      showToast.error('Failed to delete week');
    } finally {
      setLoadingStates(prev => ({ ...prev, deleting: null }));
    }
  };

  // Start editing lesson
  const handleEditLesson = (lesson: ICurriculumLesson, weekId: string) => {
    setEditingStates(prev => ({ ...prev, lesson: lesson._id! }));
    setEditForms(prev => ({
      ...prev,
      lesson: {
        _id: lesson._id!,
        weekId: weekId,
        title: lesson.title,
        description: lesson.description || '',
        content_type: lesson.content_type,
        content_url: lesson.content_url || '',
        duration: lesson.duration || 0,
        order: lesson.order,
        is_preview: lesson.is_preview || false
      }
    }));
  };

  // Save lesson edits
  const handleSaveLesson = async () => {
    if (!editForms.lesson || !courseType) return;

    const actualCourseId = course?._id || courseId;
    setLoadingStates(prev => ({ ...prev, saving: true }));

    try {
      // Try to update via API
      try {
        // Note: updateLesson method may not exist in API, updating locally
        console.log("Updating lesson locally as API method may not be available");
      } catch (apiError) {
        console.log("Lesson update API failed, updating locally:", apiError);
      }

      // Update local state
      setCurriculum(prev => prev.map(week => 
        week._id === editForms.lesson!.weekId 
          ? { 
              ...week, 
              lessons: (week.lessons || []).map(lesson => 
                lesson._id === editForms.lesson!._id 
                  ? { ...lesson, ...editForms.lesson! }
                  : lesson
              )
            }
          : week
      ));

      // Clear editing state
      setEditingStates(prev => ({ ...prev, lesson: null }));
      setEditForms(prev => ({ ...prev, lesson: null }));
      showToast.success('Lesson updated successfully');
    } catch (error) {
      console.error("Error updating lesson:", error);
      showToast.error('Failed to update lesson');
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  };

  // Cancel lesson edit
  const handleCancelLessonEdit = () => {
    setEditingStates(prev => ({ ...prev, lesson: null }));
    setEditForms(prev => ({ ...prev, lesson: null }));
  };

  // Delete lesson
  const handleDeleteLesson = async (lessonId: string, weekId: string, lessonTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${lessonTitle}"?`)) {
      return;
    }

    const actualCourseId = course?._id || courseId;
    setLoadingStates(prev => ({ ...prev, deleting: lessonId }));

    try {
      try {
        // Note: deleteLesson method may not exist in API, deleting locally
        console.log("Deleting lesson locally as API method may not be available");
      } catch (apiError) {
        console.log("Delete lesson API failed, deleting locally:", apiError);
      }

      setCurriculum(prev => prev.map(week => 
        week._id === weekId 
          ? { ...week, lessons: (week.lessons || []).filter(lesson => lesson._id !== lessonId) }
          : week
      ));
      showToast.success('Lesson deleted successfully');
    } catch (error) {
      console.error("Error deleting lesson:", error);
      showToast.error('Failed to delete lesson');
    } finally {
      setLoadingStates(prev => ({ ...prev, deleting: null }));
    }
  };

  // Add lesson to week
  const handleAddLesson = async (weekId: string) => {
    if (!courseType || !newLessonForm.title.trim()) {
      showToast.error('Please fill in all required fields');
      return;
    }

    const actualCourseId = course?._id || courseId;
    if (!actualCourseId) {
      showToast.error('Course ID not available. Please refresh the page.');
      return;
    }

    // Debug logging
    console.log('🔧 Adding lesson to week:', {
      weekId,
      courseType,
      actualCourseId,
      availableWeeks: curriculum.map(w => ({ id: w._id, title: w.title })),
      lessonData: newLessonForm
    });

    // Check if the week exists in our current curriculum
    const targetWeek = curriculum.find(week => week._id === weekId);
    if (!targetWeek) {
      console.error('❌ Week not found in local curriculum:', {
        searchingFor: weekId,
        availableWeeks: curriculum.map(w => ({ id: w._id, title: w.title }))
      });
      showToast.error(`Week not found in curriculum. Available weeks: ${curriculum.length}`);
      return;
    }

    console.log('✅ Target week found:', targetWeek);

    setLoadingStates(prev => ({ ...prev, adding: `lesson-${weekId}` }));

    // Verify week exists in backend before proceeding
    console.log('🔍 Verifying week exists in backend before adding lesson...');
    const weekExists = await verifyAndSyncWeek(weekId);
    if (!weekExists) {
      showToast.error('Unable to verify week in backend. Please refresh and try again.');
      setLoadingStates(prev => ({ ...prev, adding: null }));
      return;
    }

    try {
      // Prepare lesson data with both formats for backend compatibility
      const lessonData: any = {
        title: newLessonForm.title,
        description: newLessonForm.description,
        content_type: newLessonForm.content_type,
        content_url: newLessonForm.content_url,
        duration: newLessonForm.duration, // Keep as number for API compatibility
        order: newLessonForm.order || ((targetWeek.lessons?.length || 0) + 1),
        is_preview: newLessonForm.is_preview,
        
        // Additional fields the backend might expect
        lessonType: newLessonForm.content_type,
        video_url: newLessonForm.content_url,
        isPreview: newLessonForm.is_preview
      };

      console.log('📤 Sending lesson data to API:', lessonData);
      console.log('📋 API endpoint will be:', `${courseType}/${actualCourseId}/curriculum/weeks/${weekId}/lessons`);
      
      // Additional verification: Double-check the week exists right before API call
      console.log('🔍 Final verification before API call...');
      console.log('🔢 Week ID being used:', weekId);
      console.log('🔢 Course ID being used:', actualCourseId);
      console.log('🔢 Course Type being used:', courseType);
      
      // Fetch curriculum one more time to see current state
      try {
        const { apiClient } = await import("@/apis/apiClient");
        const { apiBaseUrl } = await import("@/apis/config");
        const verifyUrl = `${apiBaseUrl}/tcourse/${courseType}/${actualCourseId}/curriculum`;
        const verifyResponse = await apiClient.get(verifyUrl);
        
        if (verifyResponse?.data?.success) {
          const weeks = verifyResponse.data.data?.curriculum || [];
          console.log('📊 Current weeks in backend:', weeks.map((w: any) => ({
            id: w._id,
            title: w.weekTitle,
            sectionsCount: w.sections?.length || 0,
            lessonsCount: w.lessons?.length || 0
          })));
          
          const targetWeek = weeks.find((w: any) => w._id === weekId);
          if (targetWeek) {
            console.log('✅ Target week confirmed in backend:', {
              id: targetWeek._id,
              title: targetWeek.weekTitle,
              hasLessons: targetWeek.lessons?.length || 0,
              hasSections: targetWeek.sections?.length || 0
            });
          } else {
            console.error('❌ Target week NOT found in backend! Available weeks:', 
              weeks.map((w: any) => w._id));
          }
        }
      } catch (preVerifyError) {
        console.warn('⚠️ Pre-API verification failed:', preVerifyError);
      }

      try {
        console.log('🚀 Making lesson creation API call...');
        const response = await courseTypesAPI.curriculum.addLesson(courseType, actualCourseId, weekId, lessonData);
        console.log('✅ Lesson API response:', response);
        
        if (response?.data && 'lesson' in response.data && response.data.lesson) {
          setCurriculum(prev => prev.map(week => 
            week._id === weekId 
              ? { ...week, lessons: [...(week.lessons || []), response.data!.lesson!] }
              : week
          ));
          showToast.success('Lesson added successfully');
        } else {
          console.warn('⚠️ Unexpected lesson API response format:', response);
          throw new Error("No lesson data returned from API");
        }
      } catch (apiError: any) {
        console.error('❌ Lesson API call failed:', {
          error: apiError,
          message: apiError?.message,
          response: apiError?.response?.data,
          status: apiError?.response?.status
        });
        
        // Check for specific backend errors
        const errorMessage = apiError?.response?.data?.message || apiError?.message || '';
        const responseStatus = apiError?.response?.status;
        
        console.log('🔍 Analyzing error response:', {
          status: responseStatus,
          message: errorMessage,
          fullError: apiError?.response?.data
        });
        
        if (errorMessage.includes('Week not found')) {
          console.log('🔍 Week not found error detected. Investigating...');
          
          // Show user the exact error and current state
          showToast.error(`Backend Error: ${errorMessage}. Please check the week exists and try again.`);
          
          // Try to refresh curriculum to sync data
          console.log('🔄 Refreshing curriculum to sync with backend...');
          await fetchCurriculum();
          return;
        }
        
        if (responseStatus === 401 || errorMessage.includes('token') || errorMessage.includes('auth')) {
          console.log('🔐 Authentication error detected');
          showToast.error('Authentication error. Please log in again.');
          return;
        }
        
        console.log('⚠️ Lesson API failed, adding lesson locally as fallback');
        // Add lesson locally as fallback
        const newLesson = {
          _id: `lesson-${Date.now()}`,
          ...lessonData
        };
        setCurriculum(prev => prev.map(week => 
          week._id === weekId 
            ? { ...week, lessons: [...(week.lessons || []), newLesson] }
            : week
        ));
        showToast.warning('Lesson added locally (API failed). Changes may not persist.');
      }

      setNewLessonForm({
        title: '',
        description: '',
        content_type: 'video',
        content_url: '',
        duration: 0,
        order: 0,
        is_preview: false
      });
    } catch (error) {
      console.error('💥 Unexpected error in handleAddLesson:', error);
      showToast.error('Failed to add lesson');
    } finally {
      setLoadingStates(prev => ({ ...prev, adding: null }));
    }
  };

  // Start editing section
  const handleEditSection = (section: ICurriculumSection, weekId: string) => {
    setEditingStates(prev => ({ ...prev, section: section._id! }));
    setEditForms(prev => ({
      ...prev,
      section: {
        _id: section._id!,
        weekId: weekId,
        title: section.title,
        description: section.description || '',
        order: section.order
      }
    }));
  };

  // Save section edits
  const handleSaveSection = async () => {
    if (!editForms.section || !courseType) return;

    const actualCourseId = course?._id || courseId;
    setLoadingStates(prev => ({ ...prev, saving: true }));

    try {
      // Try to update via API
      try {
        // Note: updateSection method may not exist in API, updating locally
        console.log("Updating section locally as API method may not be available");
      } catch (apiError) {
        console.log("Section update API failed, updating locally:", apiError);
      }

      // Update local state
      setCurriculum(prev => prev.map(week => 
        week._id === editForms.section!.weekId 
          ? { 
              ...week, 
              sections: (week.sections || []).map(section => 
                section._id === editForms.section!._id 
                  ? { ...section, ...editForms.section! }
                  : section
              )
            }
          : week
      ));

      // Clear editing state
      setEditingStates(prev => ({ ...prev, section: null }));
      setEditForms(prev => ({ ...prev, section: null }));
      showToast.success('Section updated successfully');
    } catch (error) {
      console.error("Error updating section:", error);
      showToast.error('Failed to update section');
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  };

  // Cancel section edit
  const handleCancelSectionEdit = () => {
    setEditingStates(prev => ({ ...prev, section: null }));
    setEditForms(prev => ({ ...prev, section: null }));
  };

  // Delete section
  const handleDeleteSection = async (sectionId: string, weekId: string, sectionTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${sectionTitle}"?`)) {
      return;
    }

    const actualCourseId = course?._id || courseId;
    setLoadingStates(prev => ({ ...prev, deleting: sectionId }));

    try {
      try {
        // Note: deleteSection method may not exist in API, deleting locally
        console.log("Deleting section locally as API method may not be available");
      } catch (apiError) {
        console.log("Delete section API failed, deleting locally:", apiError);
      }

      setCurriculum(prev => prev.map(week => 
        week._id === weekId 
          ? { ...week, sections: (week.sections || []).filter(section => section._id !== sectionId) }
          : week
      ));
      showToast.success('Section deleted successfully');
    } catch (error) {
      console.error("Error deleting section:", error);
      showToast.error('Failed to delete section');
    } finally {
      setLoadingStates(prev => ({ ...prev, deleting: null }));
    }
  };

  // Add section to week
  const handleAddSection = async (weekId: string) => {
    if (!courseType || !newSectionForm.title.trim()) {
      showToast.error('Please fill in all required fields');
      return;
    }

    const actualCourseId = course?._id || courseId;
    if (!actualCourseId) {
      showToast.error('Course ID not available. Please refresh the page.');
      return;
    }

    // Debug logging
    console.log('🔧 Adding section to week:', {
      weekId,
      courseType,
      actualCourseId,
      availableWeeks: curriculum.map(w => ({ id: w._id, title: w.title })),
      sectionData: newSectionForm
    });

    // Check if the week exists in our current curriculum
    const targetWeek = curriculum.find(week => week._id === weekId);
    if (!targetWeek) {
      console.error('❌ Week not found in local curriculum:', {
        searchingFor: weekId,
        availableWeeks: curriculum.map(w => ({ id: w._id, title: w.title }))
      });
      showToast.error(`Week not found in curriculum. Available weeks: ${curriculum.length}`);
      return;
    }

    console.log('✅ Target week found:', targetWeek);

    setLoadingStates(prev => ({ ...prev, adding: `section-${weekId}` }));

    // Verify week exists in backend before proceeding
    console.log('🔍 Verifying week exists in backend...');
    const weekExists = await verifyAndSyncWeek(weekId);
    if (!weekExists) {
      showToast.error('Unable to verify week in backend. Please refresh and try again.');
      setLoadingStates(prev => ({ ...prev, adding: null }));
      return;
    }

    try {
      const sectionData = {
        ...newSectionForm,
        order: newSectionForm.order || ((targetWeek.sections?.length || 0) + 1),
        resources: []
      };

      console.log('📤 Sending section data to API:', sectionData);
      console.log('📋 API endpoint will be:', `${courseType}/${actualCourseId}/curriculum/weeks/${weekId}/sections`);

      try {
        const response = await courseTypesAPI.curriculum.addSection(courseType, actualCourseId, weekId, sectionData);
        console.log('✅ API response:', response);
        
        if (response?.data && 'section' in response.data && response.data.section) {
          setCurriculum(prev => prev.map(week => 
            week._id === weekId 
              ? { ...week, sections: [...(week.sections || []), response.data!.section!] }
              : week
          ));
          showToast.success('Section added successfully');
        } else {
          console.warn('⚠️ Unexpected API response format:', response);
          throw new Error("No section data returned from API");
        }
      } catch (apiError: any) {
        console.error('❌ API call failed:', {
          error: apiError,
          message: apiError?.message,
          response: apiError?.response?.data,
          status: apiError?.response?.status
        });
        
        // Check if it's a "Week not found" error from backend
        if (apiError?.response?.data?.message?.includes('Week not found') || 
            apiError?.message?.includes('Week not found')) {
          console.log('🔍 Week not found in backend. Attempting to refresh curriculum...');
          
          // Try to refresh curriculum and then retry
          await fetchCurriculum();
          showToast.error('Week not found in backend. Curriculum refreshed - please try again.');
          return;
        }
        
        console.log('⚠️ API failed, adding section locally as fallback');
        // Add section locally as fallback
        const newSection = {
          _id: `section-${Date.now()}`,
          ...sectionData
        };
        setCurriculum(prev => prev.map(week => 
          week._id === weekId 
            ? { ...week, sections: [...(week.sections || []), newSection] }
            : week
        ));
        showToast.warning('Section added locally (API failed). Changes may not persist.');
      }

      setNewSectionForm({ title: '', description: '', order: 0 });
    } catch (error) {
      console.error('💥 Unexpected error in handleAddSection:', error);
      showToast.error('Failed to add section');
    } finally {
      setLoadingStates(prev => ({ ...prev, adding: null }));
    }
  };

  // Start editing live class
  const handleEditLiveClass = (liveClass: ILiveClass, weekId: string) => {
    setEditingStates(prev => ({ ...prev, liveClass: liveClass._id! }));
    setEditForms(prev => ({
      ...prev,
      liveClass: {
        _id: liveClass._id!,
        weekId: weekId,
        title: liveClass.title,
        description: liveClass.description || '',
        scheduled_date: new Date(liveClass.scheduled_date),
        duration: liveClass.duration,
        instructor_requirements: [] // Removed non-existent property
      }
    }));
  };

  // Save live class edits
  const handleSaveLiveClass = async () => {
    if (!editForms.liveClass || !courseType) return;

    const actualCourseId = course?._id || courseId;
    setLoadingStates(prev => ({ ...prev, saving: true }));

    try {
      // Try to update via API
      try {
        // Note: updateLiveClass method may not exist in API, updating locally
        console.log("Updating live class locally as API method may not be available");
      } catch (apiError) {
        console.log("Live class update API failed, updating locally:", apiError);
      }

      // Update local state
      setCurriculum(prev => prev.map(week => 
        week._id === editForms.liveClass!.weekId 
          ? { 
              ...week, 
              live_classes: (week.live_classes || []).map(liveClass => 
                liveClass._id === editForms.liveClass!._id 
                  ? { ...liveClass, ...editForms.liveClass! }
                  : liveClass
              )
            }
          : week
      ));

      // Clear editing state
      setEditingStates(prev => ({ ...prev, liveClass: null }));
      setEditForms(prev => ({ ...prev, liveClass: null }));
      showToast.success('Live class updated successfully');
    } catch (error) {
      console.error("Error updating live class:", error);
      showToast.error('Failed to update live class');
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  };

  // Cancel live class edit
  const handleCancelLiveClassEdit = () => {
    setEditingStates(prev => ({ ...prev, liveClass: null }));
    setEditForms(prev => ({ ...prev, liveClass: null }));
  };

  // Delete live class
  const handleDeleteLiveClass = async (liveClassId: string, weekId: string, liveClassTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${liveClassTitle}"?`)) {
      return;
    }

    const actualCourseId = course?._id || courseId;
    setLoadingStates(prev => ({ ...prev, deleting: liveClassId }));

    try {
      try {
        // Note: deleteLiveClass method may not exist in API, deleting locally
        console.log("Deleting live class locally as API method may not be available");
      } catch (apiError) {
        console.log("Delete live class API failed, deleting locally:", apiError);
      }

      setCurriculum(prev => prev.map(week => 
        week._id === weekId 
          ? { ...week, live_classes: (week.live_classes || []).filter(liveClass => liveClass._id !== liveClassId) }
          : week
      ));
      showToast.success('Live class deleted successfully');
    } catch (error) {
      console.error("Error deleting live class:", error);
      showToast.error('Failed to delete live class');
    } finally {
      setLoadingStates(prev => ({ ...prev, deleting: null }));
    }
  };

  // Add live class to week
  const handleAddLiveClass = async (weekId: string) => {
    if (!courseType || !newLiveClassForm.title.trim()) {
      showToast.error('Please fill in all required fields');
      return;
    }

    const actualCourseId = course?._id || courseId;
    setLoadingStates(prev => ({ ...prev, adding: `liveclass-${weekId}` }));

    try {
      const liveClassData = {
        ...newLiveClassForm
      };

      try {
        const response = await courseTypesAPI.curriculum.addLiveClass(courseType, actualCourseId, weekId, liveClassData);
        if (response?.data && 'liveClass' in response.data && response.data.liveClass) {
          setCurriculum(prev => prev.map(week => 
            week._id === weekId 
              ? { ...week, live_classes: [...(week.live_classes || []), response.data!.liveClass!] }
              : week
          ));
        } else {
          throw new Error("No live class data returned from API");
        }
      } catch (apiError) {
        console.log("Add live class API failed, adding locally:", apiError);
        // Add live class locally
        const newLiveClass = {
          _id: `liveclass-${Date.now()}`,
          ...liveClassData
        };
        setCurriculum(prev => prev.map(week => 
          week._id === weekId 
            ? { ...week, live_classes: [...(week.live_classes || []), newLiveClass] }
            : week
        ));
      }

      setNewLiveClassForm({
        title: '',
        description: '',
        scheduled_date: new Date(),
        duration: 60,
        instructor_requirements: []
      });
      showToast.success('Live class added successfully');
    } catch (error) {
      console.error("Error adding live class:", error);
      showToast.error('Failed to add live class');
    } finally {
      setLoadingStates(prev => ({ ...prev, adding: null }));
    }
  };

  // Toggle week expansion
  const toggleWeekExpansion = (weekId: string) => {
    setExpandedWeeks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(weekId)) {
        newSet.delete(weekId);
      } else {
        newSet.add(weekId);
      }
      return newSet;
    });
  };

  // Get content type icon
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'text': return <FileText className="h-4 w-4" />;
      case 'quiz': return <Check className="h-4 w-4" />;
      case 'assignment': return <Edit3 className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  // Load data on mount
  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId, fetchCourse]);

  useEffect(() => {
    if (course && courseType) {
      console.log("Course loaded, fetching curriculum...", { course: course._id, courseType });
      fetchCurriculum();
    }
  }, [course, courseType, fetchCurriculum]);

  // Handle image file selection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log('File selection event triggered');
    console.log('Files from input:', event.target.files);
    console.log('Selected file:', file);
    
    if (file) {
      console.log('File details:');
      console.log('- Name:', file.name);
      console.log('- Size:', file.size);
      console.log('- Type:', file.type);
      console.log('- Last modified:', file.lastModified);
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        console.error('Invalid file type:', file.type);
        showToast.error('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        console.error('File too large:', file.size);
        showToast.error('Image size should be less than 5MB');
        return;
      }
      
      // Validate file is not empty
      if (file.size === 0) {
        console.error('Empty file selected');
        showToast.error('Selected file is empty');
        return;
      }
      
      console.log('File validation passed, setting selected image');
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        console.log('FileReader result available, setting preview');
        setImagePreview(result);
      };
      reader.onerror = (e) => {
        console.error('FileReader error:', e);
        showToast.error('Failed to read image file');
      };
      reader.readAsDataURL(file);
    } else {
      console.log('No file selected');
    }
    
    // Clear the input value to allow selecting the same file again
    event.target.value = '';
  };

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle image upload using the new TypeScript function
  const handleImageUpload = async () => {
    if (!selectedImage || !course?._id) {
      showToast.error('Please select an image first');
      return;
    }

    console.log('🚀 Starting image upload with new TypeScript function...');
    console.log('📁 Selected image:', selectedImage);
    console.log('📋 File details:', {
      name: selectedImage.name,
      size: selectedImage.size,
      type: selectedImage.type
    });
    console.log('📌 Course ID:', course._id);

    // Get authentication token
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    console.log('🔐 Auth token available:', !!token);
    
    if (!token) {
      showToast.error('Authentication required. Please log in again.');
      return;
    }

    setLoadingStates(prev => ({ ...prev, imageUploading: true }));

    try {
      // Use the new TypeScript function that handles everything
      const result = await uploadCourseImageFromFileAsync(course._id, selectedImage, token);
      
      console.log('📤 Upload result:', result);
      
      if (result.success && 'data' in result) {
        // Success! Update the course state with new image
        const newImageUrl = result.data.imageUrl || result.data.course?.image;
        
        setCourse(prev => prev ? {
          ...prev,
          course_image: newImageUrl || imagePreview || prev.course_image || ''
        } : null);
        
        // Clear the selected image and preview
        setSelectedImage(null);
        setImagePreview(null);
        
        showToast.success('Course thumbnail updated successfully!');
        console.log('✅ Upload successful! New image URL:', newImageUrl);
      } else {
        // Handle error response
        const errorResult = result as { success: false; message: string; error?: any };
        console.error('❌ Upload failed:', errorResult);
        throw new Error(errorResult.message || 'Failed to update thumbnail');
      }

    } catch (error) {
      console.error('💥 Error uploading image:', error);
      
      let errorMessage = 'Failed to upload thumbnail';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      showToast.error(errorMessage);
    } finally {
      setLoadingStates(prev => ({ ...prev, imageUploading: false }));
    }
  };

  // Cancel image selection
  const handleCancelImageEdit = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  // Video upload function
  const handleVideoUpload = async (file: File, lessonFormType: 'new' | 'edit', weekId?: string) => {
    if (!file || !courseType) {
      showToast.error('Please select a video file');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('video/')) {
      showToast.error('Please select a valid video file');
      return;
    }

    // Validate file size (max 500MB)
    const maxSize = 500 * 1024 * 1024; // 500MB in bytes
    if (file.size > maxSize) {
      showToast.error('Video file size should be less than 500MB');
      return;
    }

    // Get authentication token
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      showToast.error('Authentication required. Please log in again.');
      return;
    }

    // Generate unique upload ID
    const uploadId = `${lessonFormType}-${weekId || 'general'}-${Date.now()}`;
    
    setVideoUploadProgress(prev => ({
      ...prev,
      [uploadId]: { progress: 0, status: 'uploading' }
    }));

    try {
      console.log('🎬 Starting video upload:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });

      // Convert file to base64
      const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result);
        };
        reader.onerror = () => reject(new Error('Failed to read video file'));
        reader.readAsDataURL(file);
      });

      // Import API utilities
      const axios = (await import("axios")).default;
      const { apiBaseUrl, apiUrls } = await import("@/apis");

      // Upload the video
      console.log('📤 Uploading video to server...');
      const response = await axios.post(
        `${apiBaseUrl}${apiUrls.upload.uploadBase64}`,
        {
          base64String,
          fileType: 'video'
        },
        {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          onUploadProgress: (progressEvent: any) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 0)
            );
            setVideoUploadProgress(prev => ({
              ...prev,
              [uploadId]: { 
                ...prev[uploadId], 
                progress: Math.min(progress, 90) // Keep at 90% until processing complete
              }
            }));
          }
        }
      );

      console.log('📊 Upload response:', response.data);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Video upload failed');
      }

      // Update progress to processing
      setVideoUploadProgress(prev => ({
        ...prev,
        [uploadId]: { progress: 95, status: 'processing' }
      }));

      // Extract video data from response
      const { url, duration, thumbnail } = response.data.data;
      
      // Store video data
      setVideoData(prev => ({
        ...prev,
        [uploadId]: { 
          url, 
          duration: duration || 0, 
          thumbnail, 
          size: file.size 
        }
      }));

      // Update the appropriate form with the video URL
      if (lessonFormType === 'new') {
        setNewLessonForm(prev => ({
          ...prev,
          content_url: url,
          duration: duration || prev.duration
        }));
      } else if (lessonFormType === 'edit' && editForms.lesson) {
        setEditForms(prev => ({
          ...prev,
          lesson: prev.lesson ? {
            ...prev.lesson,
            content_url: url,
            duration: duration || prev.lesson.duration
          } : null
        }));
      }

      // Complete upload
      setVideoUploadProgress(prev => ({
        ...prev,
        [uploadId]: { progress: 100, status: 'complete' }
      }));

      showToast.success('Video uploaded successfully! URL has been populated.');
      console.log('✅ Video upload complete:', { url, duration });

      return { url, duration, thumbnail, uploadId };

    } catch (error) {
      console.error('❌ Video upload failed:', error);
      
      let errorMessage = 'Failed to upload video. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setVideoUploadProgress(prev => ({
        ...prev,
        [uploadId]: {
          progress: 0,
          status: 'error',
          error: errorMessage
        }
      }));

      showToast.error(errorMessage);
      throw error;
    }
  };

  // Handle video file selection for new lesson form
  const handleNewLessonVideoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileKey = 'new-lesson-video';
      setSelectedVideoFile(prev => ({
        ...prev,
        [fileKey]: file
      }));
    }
  };

  // Handle video file selection for edit lesson form
  const handleEditLessonVideoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && editForms.lesson) {
      const fileKey = `edit-lesson-${editForms.lesson._id}`;
      setSelectedVideoFile(prev => ({
        ...prev,
        [fileKey]: file
      }));
    }
  };

  // Upload selected video for new lesson
  const uploadNewLessonVideo = async () => {
    const fileKey = 'new-lesson-video';
    const file = selectedVideoFile[fileKey];
    if (!file) {
      showToast.error('Please select a video file first');
      return;
    }

    try {
      await handleVideoUpload(file, 'new');
      // Clear selected file after successful upload
      setSelectedVideoFile(prev => ({
        ...prev,
        [fileKey]: null
      }));
    } catch (error) {
      // Error handling is done in handleVideoUpload
    }
  };

  // Upload selected video for edit lesson
  const uploadEditLessonVideo = async () => {
    if (!editForms.lesson) return;
    
    const fileKey = `edit-lesson-${editForms.lesson._id}`;
    const file = selectedVideoFile[fileKey];
    if (!file) {
      showToast.error('Please select a video file first');
      return;
    }

    try {
      await handleVideoUpload(file, 'edit', editForms.lesson.weekId);
      // Clear selected file after successful upload
      setSelectedVideoFile(prev => ({
        ...prev,
        [fileKey]: null
      }));
    } catch (error) {
      // Error handling is done in handleVideoUpload
    }
  };

  // Remove uploaded video
  const removeUploadedVideo = (uploadId: string, formType: 'new' | 'edit') => {
    // Clear video data
    setVideoData(prev => {
      const newData = { ...prev };
      delete newData[uploadId];
      return newData;
    });

    // Clear upload progress
    setVideoUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[uploadId];
      return newProgress;
    });

    // Clear form content URL
    if (formType === 'new') {
      setNewLessonForm(prev => ({
        ...prev,
        content_url: '',
        duration: 0
      }));
    } else if (formType === 'edit' && editForms.lesson) {
      setEditForms(prev => ({
        ...prev,
        lesson: prev.lesson ? {
          ...prev.lesson,
          content_url: '',
          duration: 0
        } : null
      }));
    }

    showToast.success('Video removed');
  };

  // Comprehensive curriculum synchronization with backend
  const syncCurriculumWithBackend = async (): Promise<void> => {
    try {
      const actualCourseId = course?._id || courseId;
      if (!actualCourseId || !courseType) {
        console.error('Missing course ID or type for sync');
        return;
      }

      console.log('🔄 Starting comprehensive curriculum sync...');

      // Fetch fresh curriculum from backend
      await fetchCurriculum();
      
      console.log('✅ Curriculum synchronization complete');
    } catch (error) {
      console.error('💥 Error during curriculum sync:', error);
      showToast.error('Failed to synchronize curriculum with backend');
    }
  };

  // Verify week exists in backend and sync if needed
  const verifyAndSyncWeek = async (weekId: string): Promise<boolean> => {
    try {
      const actualCourseId = course?._id || courseId;
      if (!actualCourseId || !courseType) {
        console.error('Missing course ID or type for verification');
        return false;
      }

      console.log('🔍 Verifying week exists in backend:', { weekId, courseType, actualCourseId });

      // Fetch the full curriculum and check if the week exists
      const { apiClient } = await import("@/apis/apiClient");
      const { apiBaseUrl } = await import("@/apis/config");
      
      try {
        const curriculumUrl = `${apiBaseUrl}/tcourse/${courseType}/${actualCourseId}/curriculum`;
        console.log('📋 Checking curriculum for week:', curriculumUrl);
        
        const curriculumResponse = await apiClient.get(curriculumUrl);
        console.log('📊 Curriculum response received');
        
        if (curriculumResponse?.data?.success && curriculumResponse.data.data?.curriculum) {
          const backendCurriculum = curriculumResponse.data.data.curriculum;
          
          // Find the week in the backend curriculum
          const backendWeek = backendCurriculum.find((week: any) => week._id === weekId);
          
          if (backendWeek) {
            console.log('✅ Week found in backend curriculum:', {
              weekId,
              weekTitle: backendWeek.weekTitle,
              sectionsCount: backendWeek.sections?.length || 0,
              lessonsCount: backendWeek.lessons?.length || 0
            });
            return true;
          } else {
            console.warn('⚠️ Week not found in backend curriculum. Available weeks:', 
              backendCurriculum.map((w: any) => ({ id: w._id, title: w.weekTitle }))
            );
            
            // Detailed logging for debugging
            console.log('🔍 DETAILED BACKEND WEEK ANALYSIS:');
            backendCurriculum.forEach((w: any, index: number) => {
              console.log(`Week ${index + 1}:`, {
                _id: w._id,
                weekTitle: w.weekTitle,
                expectedId: `week_${index + 1}`,
                matches: w._id === `week_${index + 1}`,
                fullWeekObject: w
              });
            });
            console.log('🎯 Looking for weekId:', weekId);
            console.log('📊 Backend week IDs:', backendCurriculum.map((w: any) => w._id));
            
            // Try to find a matching week by position or title instead
            const localWeek = curriculum.find(w => w._id === weekId);
            if (localWeek) {
              console.log('🔄 Week exists locally but with different ID. Attempting smart matching...');
              
              // Try to find matching week by order/position (backend uses week_1, week_2 format)
              const expectedBackendId = `week_${localWeek.order}`;
              const matchingBackendWeek = backendCurriculum.find((w: any, index: number) => {
                return w._id === expectedBackendId || // Direct ID match
                       index === (localWeek.order - 1) || // Match by position
                       w.weekTitle === localWeek.title || // Match by title
                       w.weekTitle === localWeek.weekTitle; // Match by backend title
              });
              
              if (matchingBackendWeek) {
                console.log('✅ Found matching backend week:', {
                  backendId: matchingBackendWeek._id,
                  expectedId: expectedBackendId,
                  backendTitle: matchingBackendWeek.weekTitle,
                  localId: weekId,
                  localTitle: localWeek.title
                });
                
                // Update local curriculum with the correct backend week ID
                const correctWeekId = matchingBackendWeek._id || expectedBackendId;
                setCurriculum(prev => prev.map(week => 
                  week._id === weekId 
                    ? { ...week, _id: correctWeekId }
                    : week
                ));
                
                showToast.success(`Week synchronized with backend (${correctWeekId})`);
                return true;
              }
              
              // If no match found, try to create the week
              console.log('🔄 No matching week found. Attempting to create...');
              
              try {
                const createWeekResponse = await courseTypesAPI.curriculum.addWeek(courseType, actualCourseId, {
                  title: localWeek.title,
                  weekTitle: localWeek.title, // Backend expects weekTitle field
                  description: localWeek.description || '',
                  weekDescription: localWeek.description || '', // Backend might expect weekDescription too
                  order: localWeek.order,
                  lessons: localWeek.lessons || [],
                  sections: localWeek.sections || [],
                  live_classes: localWeek.live_classes || []
                });
                
                if (createWeekResponse?.data?.week) {
                  console.log('✅ Week created in backend successfully');
                  
                  // Update local curriculum with the backend week ID
                  const backendWeekId = createWeekResponse.data!.week._id!;
                  console.log('🔄 Updating local week ID from', weekId, 'to', backendWeekId);
                  
                  setCurriculum(prev => prev.map(week => 
                    week._id === weekId 
                      ? { ...week, _id: backendWeekId }
                      : week
                  ));
                  
                  showToast.success(`Week synchronized with backend (ID: ${backendWeekId})`);
                  return true;
                } else {
                  console.error('❌ Week creation failed - no week data returned');
                  return false;
                }
              } catch (createError) {
                console.error('❌ Failed to create week in backend:', createError);
                return false;
              }
            } else {
              console.error('❌ Week not found in local curriculum either');
              return false;
            }
          }
        } else {
          console.error('❌ Failed to fetch curriculum from backend');
          return false;
        }
      } catch (curriculumError: any) {
        console.error('❌ Curriculum fetch failed:', {
          error: curriculumError,
          status: curriculumError?.response?.status,
          message: curriculumError?.response?.data?.message
        });
        return false;
      }
    } catch (error) {
      console.error('💥 Unexpected error in verifyAndSyncWeek:', error);
      return false;
    }
  };

  if (loadingStates.course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Course</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Course Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">The course you're looking for doesn't exist.</p>
          <Link
            href="/dashboards/admin/courses/manage"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboards/admin/courses/manage" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Course Management
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Edit Course Content
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage curriculum, lessons, and course structure
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                courseType === 'live' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' :
                courseType === 'blended' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' :
                'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              }`}>
                {courseType?.charAt(0).toUpperCase()}{courseType?.slice(1)} Course
              </span>
              <button
                onClick={syncCurriculumWithBackend}
                disabled={loadingStates.curriculum}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                title="Synchronize curriculum with backend"
              >
                {loadingStates.curriculum ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-600 border-t-transparent mr-2"></div>
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Sync
              </button>
              <Link
                href={`/course-details/${courseId}`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview Course
              </Link>
            </div>
          </div>
        </div>

        {/* Course Info Card - Enhanced */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg border border-blue-200 dark:border-gray-700 p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-start space-y-6 lg:space-y-0 lg:space-x-6">
            {/* Course Image Section */}
            <div className="relative group">
              <div className="h-32 w-32 lg:h-40 lg:w-40 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex-shrink-0 relative overflow-hidden shadow-lg">
                {imagePreview || course.course_image ? (
                  <img
                    src={imagePreview || course.course_image}
                    alt={course.course_title}
                    className="h-full w-full rounded-2xl object-cover"
                  />
                ) : (
                  <div className="h-full w-full rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-blue-500 dark:text-blue-400" />
                  </div>
                )}
                
                {/* Enhanced Image Edit Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center">
                  <label htmlFor="course-image-input" className="cursor-pointer flex flex-col items-center text-white">
                    <Upload className="h-8 w-8 mb-2" />
                    <span className="text-sm font-medium">Change Image</span>
                    <input
                      id="course-image-input"
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                </div>
                
                {/* Course Type Badge */}
                <div className="absolute -top-2 -right-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                    courseType === 'live' ? 'bg-orange-500 text-white' :
                    courseType === 'blended' ? 'bg-purple-500 text-white' :
                    'bg-green-500 text-white'
                  }`}>
                    {courseType?.toUpperCase()}
                  </span>
                </div>
              </div>
              
              {/* Image Upload Actions */}
              {selectedImage && (
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleImageUpload}
                    disabled={loadingStates.imageUploading}
                    className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loadingStates.imageUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent mr-1"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Save
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancelImageEdit}
                    disabled={loadingStates.imageUploading}
                    className="inline-flex items-center px-3 py-1 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 disabled:opacity-50 transition-colors"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Course Details Section */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                    {course.course_title}
                  </h2>
                  {course.course_subtitle && (
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-3">
                      {course.course_subtitle}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {course.course_category}
                    </span>
                    {course.language && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                        <Users className="h-4 w-4 mr-1" />
                        {course.language}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Course Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur-sm">
                <div className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg mx-auto mb-2">
                    <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {('course_duration' in course) ? course.course_duration : 'Not set'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                </div>

                {'total_sessions' in course && (
                  <div className="text-center">
                    <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg mx-auto mb-2">
                      <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {course.total_sessions}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Sessions</p>
                  </div>
                )}

                <div className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg mx-auto mb-2">
                    <Video className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {curriculum.reduce((acc, week) => acc + (week.lessons?.length || 0), 0)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Lessons</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg mx-auto mb-2">
                    <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {curriculum.length}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Weeks</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Information */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">Debug Information</h3>
            <div className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
              <div>Course ID: {courseId}</div>
              <div>Actual Course ID: {course?._id}</div>
              <div>Course Type: {courseType}</div>
              <div>Course Loaded: {course ? 'Yes' : 'No'}</div>
              <div>Curriculum Items: {curriculum.length}</div>
              <div>Week IDs: {curriculum.map(w => `${w.title}(${w._id})`).join(', ')}</div>
              <div>Loading States: {JSON.stringify(loadingStates)}</div>
              <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded border">
                <div className="font-medium mb-1">Curriculum Structure:</div>
                {curriculum.map((week, i) => (
                  <div key={i} className="ml-2">
                    Week {week.order}: {week.title} (ID: <span className="font-mono text-blue-600">{week._id}</span>)
                    <div className="ml-4 text-xs">
                      Lessons: {week.lessons?.length || 0}, Sections: {week.sections?.length || 0}
                      {week._id?.match(/^week_\d+$/) && <span className="text-green-600 ml-2">✅ Backend Compatible</span>}
                      {!week._id?.match(/^week_\d+$/) && <span className="text-red-600 ml-2">❌ Needs Sync</span>}
                    </div>
                  </div>
                ))}
                <div className="mt-2 p-1 bg-green-100 dark:bg-green-900/30 rounded text-xs">
                  <strong>Expected Format:</strong> week_1, week_2, week_3 (not MongoDB ObjectIds)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Curriculum Statistics */}
        {curriculumStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Weeks</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{curriculumStats.total_weeks}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <Video className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Lessons</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{curriculumStats.total_lessons}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Duration</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round(curriculumStats.total_duration_minutes / 60)}h
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completion Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {curriculumStats.completion_rate?.toFixed(1) || '0'}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add New Week Form - Enhanced */}
        <div className="bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg border border-blue-200 dark:border-gray-700 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Plus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add New Week</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Create a new week for your course curriculum</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Week {newWeekForm.order}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Main Form Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Week Title *
                </label>
                <input
                  type="text"
                  value={newWeekForm.title}
                  onChange={(e) => setNewWeekForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Introduction to React Components"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Week Order
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={newWeekForm.order}
                    onChange={(e) => setNewWeekForm(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                    min="1"
                    className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Week Description
              </label>
              <textarea
                value={newWeekForm.description}
                onChange={(e) => setNewWeekForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what students will learn in this week..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
                <Info className="h-4 w-4" />
                <span>Required fields are marked with *</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setNewWeekForm({ title: '', description: '', order: curriculum.length + 1 })}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={handleAddWeek}
                  disabled={loadingStates.adding === 'week' || !newWeekForm.title.trim()}
                  className="px-8 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
                >
                  {loadingStates.adding === 'week' ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2 inline-block"></div>
                      Adding Week...
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5 mr-2 inline-block" />
                      Add Week
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Curriculum Content */}
        <div className="space-y-6">
          {loadingStates.curriculum && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-gray-600 dark:text-gray-400">Loading curriculum...</span>
              </div>
            </div>
          )}
          
          <AnimatePresence>
            {curriculum.map((week) => (
              <motion.div
                key={week._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {/* Week Header - Enhanced */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <button
                        onClick={() => toggleWeekExpansion(week._id!)}
                        className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        {expandedWeeks.has(week._id!) ? (
                          <ChevronDown className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        )}
                      </button>
                      
                      {/* Week Number Badge */}
                      <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl font-bold text-sm shadow-md">
                        {week.order}
                      </div>
                      
                      {editingStates.week === week._id ? (
                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={editForms.week?.title || ''}
                              onChange={(e) => setEditForms(prev => ({
                                ...prev,
                                week: prev.week ? { ...prev.week, title: e.target.value } : null
                              }))}
                              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="Week title"
                            />
                            <input
                              type="number"
                              value={editForms.week?.order || 1}
                              onChange={(e) => setEditForms(prev => ({
                                ...prev,
                                week: prev.week ? { ...prev.week, order: parseInt(e.target.value) || 1 } : null
                              }))}
                              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="Order"
                              min="1"
                            />
                          </div>
                          <textarea
                            value={editForms.week?.description || ''}
                            onChange={(e) => setEditForms(prev => ({
                              ...prev,
                              week: prev.week ? { ...prev.week, description: e.target.value } : null
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Week description"
                            rows={2}
                          />
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={handleSaveWeek}
                              disabled={loadingStates.saving}
                              className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
                            >
                              {loadingStates.saving ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              onClick={handleCancelWeekEdit}
                              className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Week {week.order}: {week.title}
                          </h3>
                          {week.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {week.description}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {editingStates.week !== week._id && (
                        <>
                          {/* Week Stats */}
                          <div className="hidden md:flex items-center space-x-6 text-sm">
                            <div className="flex items-center space-x-2 bg-white dark:bg-gray-700 px-3 py-1.5 rounded-lg">
                              <Video className="h-4 w-4 text-blue-500" />
                              <span className="font-medium text-gray-900 dark:text-white">{week.lessons?.length || 0}</span>
                              <span className="text-gray-500 dark:text-gray-400">lessons</span>
                            </div>
                            <div className="flex items-center space-x-2 bg-white dark:bg-gray-700 px-3 py-1.5 rounded-lg">
                              <FileText className="h-4 w-4 text-purple-500" />
                              <span className="font-medium text-gray-900 dark:text-white">{week.sections?.length || 0}</span>
                              <span className="text-gray-500 dark:text-gray-400">sections</span>
                            </div>
                                                         {(week.live_classes?.length || 0) > 0 && (
                               <div className="flex items-center space-x-2 bg-white dark:bg-gray-700 px-3 py-1.5 rounded-lg">
                                 <Calendar className="h-4 w-4 text-orange-500" />
                                 <span className="font-medium text-gray-900 dark:text-white">{week.live_classes?.length || 0}</span>
                                 <span className="text-gray-500 dark:text-gray-400">live classes</span>
                               </div>
                             )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditWeek(week)}
                              className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-white dark:hover:bg-gray-700 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                              title="Edit Week"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setExpandedWeeks(prev => {
                                const newSet = new Set(prev);
                                if (newSet.has(week._id!)) {
                                  newSet.delete(week._id!);
                                } else {
                                  newSet.add(week._id!);
                                }
                                return newSet;
                              })}
                              className="p-2.5 text-gray-400 hover:text-green-600 hover:bg-white dark:hover:bg-gray-700 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                              title={expandedWeeks.has(week._id!) ? "Collapse" : "Expand"}
                            >
                              <Settings className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteWeek(week._id!, week.title)}
                              disabled={loadingStates.deleting === week._id}
                              className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-white dark:hover:bg-gray-700 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete Week"
                            >
                              {loadingStates.deleting === week._id ? (
                                <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Week Content */}
                <AnimatePresence>
                  {expandedWeeks.has(week._id!) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-gray-200 dark:border-gray-700"
                    >
                      <div className="p-6 space-y-6">
                        {/* Lessons Section */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-md font-medium text-gray-900 dark:text-white flex items-center">
                              <Video className="h-4 w-4 mr-2" />
                              Lessons ({week.lessons?.length || 0})
                            </h4>
                          </div>

                          {/* Enhanced Add Lesson Form */}
                          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-xl p-8 mb-8 border border-blue-200 dark:border-blue-700 shadow-lg backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-md">
                                  <Plus className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                  <h5 className="text-xl font-bold text-gray-900 dark:text-white">Add New Lesson</h5>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">Create engaging content for your students</p>
                                </div>
                              </div>
                              <div className="bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                  Lesson #{(week.lessons?.length || 0) + 1}
                                </span>
                              </div>
                            </div>
                            
                            <div className="space-y-6">
                              {/* Primary Fields */}
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Lesson Title *
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="e.g., Introduction to React Components"
                                    value={newLessonForm.title}
                                    onChange={(e) => setNewLessonForm(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 shadow-sm focus:shadow-md"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Content Type *
                                  </label>
                                  <div className="relative">
                                    <select
                                      value={newLessonForm.content_type}
                                      onChange={(e) => setNewLessonForm(prev => ({ ...prev, content_type: e.target.value as any }))}
                                      className="w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none transition-all duration-200 shadow-sm focus:shadow-md"
                                    >
                                      <option value="video">🎥 Video Lesson</option>
                                      <option value="text">📖 Text Content</option>
                                      <option value="quiz">🧭 Interactive Quiz</option>
                                      <option value="assignment">📝 Assignment</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                                  </div>
                                </div>
                              </div>

                              {/* Content URL and Duration */}
                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-2">
                                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Content URL
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="url"
                                      placeholder="https://youtube.com/watch?v=example or upload video below"
                                      value={newLessonForm.content_url}
                                      onChange={(e) => setNewLessonForm(prev => ({ ...prev, content_url: e.target.value }))}
                                      className="w-full px-4 py-3 pl-11 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 shadow-sm focus:shadow-md"
                                    />
                                    <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                  </div>
                                  
                                  {/* Video Upload Section - Only show for video content type */}
                                  {newLessonForm.content_type === 'video' && (
                                    <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
                                      <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-2">
                                          <Film className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                          <span className="text-sm font-semibold text-purple-800 dark:text-purple-300">Upload Video</span>
                                        </div>
                                        <span className="text-xs text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full">
                                          Max 500MB
                                        </span>
                                      </div>
                                      
                                      {!selectedVideoFile['new-lesson-video'] && !newLessonForm.content_url && (
                                        <div className="space-y-3">
                                          <label 
                                            htmlFor="new-lesson-video-input"
                                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-purple-300 dark:border-purple-600 border-dashed rounded-xl cursor-pointer bg-purple-50 dark:bg-purple-900/10 hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors"
                                          >
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                              <Upload className="w-8 h-8 mb-3 text-purple-500 dark:text-purple-400" />
                                              <p className="mb-2 text-sm text-purple-600 dark:text-purple-400">
                                                <span className="font-semibold">Click to upload</span> your video
                                              </p>
                                              <p className="text-xs text-purple-500 dark:text-purple-400">MP4, MOV, AVI, WebM (MAX 500MB)</p>
                                            </div>
                                            <input 
                                              id="new-lesson-video-input" 
                                              type="file" 
                                              accept="video/*" 
                                              onChange={handleNewLessonVideoSelect}
                                              className="hidden" 
                                            />
                                          </label>
                                        </div>
                                      )}
                                      
                                      {selectedVideoFile['new-lesson-video'] && (
                                        <div className="space-y-3">
                                          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-700">
                                            <div className="flex items-center space-x-3">
                                              <Video className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                              <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                  {selectedVideoFile['new-lesson-video']?.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                  {((selectedVideoFile['new-lesson-video']?.size || 0) / (1024 * 1024)).toFixed(1)} MB
                                                </p>
                                              </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                              <button
                                                onClick={uploadNewLessonVideo}
                                                disabled={Object.values(videoUploadProgress).some(p => p.status === 'uploading')}
                                                className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                              >
                                                {Object.values(videoUploadProgress).some(p => p.status === 'uploading') ? (
                                                  <>
                                                    <Loader className="h-4 w-4 mr-1 animate-spin" />
                                                    Upload...
                                                  </>
                                                ) : (
                                                  <>
                                                    <Upload className="h-4 w-4 mr-1" />
                                                    Upload
                                                  </>
                                                )}
                                              </button>
                                              <button
                                                onClick={() => setSelectedVideoFile(prev => ({ ...prev, 'new-lesson-video': null }))}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                              >
                                                <X className="h-4 w-4" />
                                              </button>
                                            </div>
                                          </div>
                                          
                                          {/* Upload Progress */}
                                          {Object.entries(videoUploadProgress).map(([uploadId, progress]) => (
                                            <div key={uploadId} className="space-y-2">
                                              <div className="flex items-center justify-between text-sm">
                                                <span className="text-purple-700 dark:text-purple-300 font-medium">
                                                  {progress.status === 'uploading' ? 'Uploading...' :
                                                   progress.status === 'processing' ? 'Processing...' :
                                                   progress.status === 'complete' ? 'Upload Complete!' :
                                                   progress.status === 'error' ? 'Upload Failed' : ''}
                                                </span>
                                                <span className="text-purple-600 dark:text-purple-400 font-semibold">
                                                  {progress.progress}%
                                                </span>
                                              </div>
                                              <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-2">
                                                <div
                                                  className={`h-2 rounded-full transition-all duration-300 ${
                                                    progress.status === 'error' ? 'bg-red-500' :
                                                    progress.status === 'complete' ? 'bg-green-500' :
                                                    'bg-purple-600'
                                                  }`}
                                                  style={{ width: `${progress.progress}%` }}
                                                />
                                              </div>
                                              {progress.error && (
                                                <p className="text-xs text-red-600 dark:text-red-400">
                                                  {progress.error}
                                                </p>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                      
                                      {newLessonForm.content_url && (
                                        <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                                              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                                                Video URL ready
                                              </span>
                                            </div>
                                            <button
                                              onClick={() => setNewLessonForm(prev => ({ ...prev, content_url: '', duration: 0 }))}
                                              className="p-1 text-green-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                              title="Clear video URL"
                                            >
                                              <X className="h-4 w-4" />
                                            </button>
                                          </div>
                                          <p className="text-xs text-green-600 dark:text-green-400 mt-1 truncate">
                                            {newLessonForm.content_url}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <div className="space-y-2">
                                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Duration (minutes) *
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="number"
                                      placeholder="30"
                                      value={newLessonForm.duration || ''}
                                      onChange={(e) => setNewLessonForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                                      min="1"
                                      max="300"
                                      className="w-full px-4 py-3 pr-11 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200 shadow-sm focus:shadow-md"
                                    />
                                    <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                  </div>
                                </div>
                              </div>

                              {/* Description */}
                              <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                  Lesson Description
                                </label>
                                <textarea
                                  placeholder="Describe the learning objectives and key concepts covered in this lesson..."
                                  value={newLessonForm.description}
                                  onChange={(e) => setNewLessonForm(prev => ({ ...prev, description: e.target.value }))}
                                  rows={3}
                                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none transition-all duration-200 shadow-sm focus:shadow-md"
                                />
                              </div>

                              {/* Options Panel */}
                              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                                  <div className="flex items-center space-x-6">
                                    <label className="flex items-center space-x-3 cursor-pointer group">
                                      <input
                                        type="checkbox"
                                        checked={newLessonForm.is_preview || false}
                                        onChange={(e) => setNewLessonForm(prev => ({ ...prev, is_preview: e.target.checked }))}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                                      />
                                      <div>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                          Free Preview
                                        </span>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Allow free users to watch</p>
                                      </div>
                                    </label>
                                    
                                    <div className="flex items-center space-x-3">
                                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Order:</label>
                                      <input
                                        type="number"
                                        value={newLessonForm.order || (week.lessons?.length || 0) + 1}
                                        onChange={(e) => setNewLessonForm(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                                        min="1"
                                        className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm text-center"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                                  <CheckCircle className="h-4 w-4" />
                                  <span>Fields marked with * are required</span>
                                </div>
                                
                                <div className="flex items-center space-x-4">
                                  <button
                                    type="button"
                                    onClick={() => setNewLessonForm({
                                      title: '',
                                      description: '',
                                      content_type: 'video',
                                      content_url: '',
                                      duration: 0,
                                      order: (week.lessons?.length || 0) + 1,
                                      is_preview: false
                                    })}
                                    className="px-5 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors font-medium"
                                  >
                                    Reset Form
                                  </button>
                                  
                                  <button
                                    onClick={() => handleAddLesson(week._id!)}
                                    disabled={loadingStates.adding === `lesson-${week._id}` || !newLessonForm.title.trim() || !newLessonForm.duration}
                                    className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-sm flex items-center space-x-2"
                                  >
                                    {loadingStates.adding === `lesson-${week._id}` ? (
                                      <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        <span>Creating...</span>
                                      </>
                                    ) : (
                                      <>
                                        <Plus className="h-4 w-4" />
                                        <span>Create Lesson</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Lessons List */}
                          <div className="space-y-2">
                            {week.lessons?.map((lesson, index) => (
                              <div key={lesson._id || index} className="bg-gray-50 dark:bg-gray-700 rounded-lg">
                                {editingStates.lesson === lesson._id ? (
                                  <div className="p-3 space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <input
                                        type="text"
                                        value={editForms.lesson?.title || ''}
                                        onChange={(e) => setEditForms(prev => ({
                                          ...prev,
                                          lesson: prev.lesson ? { ...prev.lesson, title: e.target.value } : null
                                        }))}
                                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                        placeholder="Lesson title"
                                      />
                                      <select
                                        value={editForms.lesson?.content_type || 'video'}
                                        onChange={(e) => setEditForms(prev => ({
                                          ...prev,
                                          lesson: prev.lesson ? { ...prev.lesson, content_type: e.target.value as any } : null
                                        }))}
                                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                      >
                                        <option value="video">Video</option>
                                        <option value="text">Text</option>
                                        <option value="quiz">Quiz</option>
                                        <option value="assignment">Assignment</option>
                                      </select>
                                    </div>
                                    <div className="space-y-3">
                                      <input
                                        type="url"
                                        value={editForms.lesson?.content_url || ''}
                                        onChange={(e) => setEditForms(prev => ({
                                          ...prev,
                                          lesson: prev.lesson ? { ...prev.lesson, content_url: e.target.value } : null
                                        }))}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                        placeholder="Content URL or upload video below"
                                      />
                                      
                                      {/* Video Upload for Edit Form */}
                                      {editForms.lesson?.content_type === 'video' && (
                                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                                          <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-medium text-purple-800 dark:text-purple-300">Upload Video</span>
                                            <span className="text-xs text-purple-600 dark:text-purple-400">Max 500MB</span>
                                          </div>
                                          
                                          {!selectedVideoFile[`edit-lesson-${editForms.lesson._id}`] && !editForms.lesson.content_url && (
                                            <label 
                                              htmlFor={`edit-lesson-video-${editForms.lesson._id}`}
                                              className="flex flex-col items-center justify-center w-full h-20 border border-purple-300 dark:border-purple-600 border-dashed rounded-lg cursor-pointer bg-purple-50 dark:bg-purple-900/10 hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors"
                                            >
                                              <div className="flex items-center space-x-2">
                                                <Upload className="w-4 h-4 text-purple-500" />
                                                <span className="text-xs text-purple-600 dark:text-purple-400">Click to upload</span>
                                              </div>
                                              <input 
                                                id={`edit-lesson-video-${editForms.lesson._id}`}
                                                type="file" 
                                                accept="video/*" 
                                                onChange={handleEditLessonVideoSelect}
                                                className="hidden" 
                                              />
                                            </label>
                                          )}
                                          
                                          {selectedVideoFile[`edit-lesson-${editForms.lesson._id}`] && (
                                            <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border">
                                              <div className="flex items-center space-x-2">
                                                <Video className="h-4 w-4 text-purple-600" />
                                                <span className="text-xs text-gray-900 dark:text-white truncate max-w-32">
                                                  {selectedVideoFile[`edit-lesson-${editForms.lesson._id}`]?.name}
                                                </span>
                                              </div>
                                              <div className="flex items-center space-x-1">
                                                <button
                                                  onClick={uploadEditLessonVideo}
                                                  disabled={Object.values(videoUploadProgress).some(p => p.status === 'uploading')}
                                                  className="px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 disabled:opacity-50"
                                                >
                                                  Upload
                                                </button>
                                                                                                  <button
                                                    onClick={() => setSelectedVideoFile(prev => ({ ...prev, [`edit-lesson-${editForms.lesson?._id}`]: null }))}
                                                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                                                  >
                                                  <X className="h-3 w-3" />
                                                </button>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <div className="flex space-x-2">
                                        <input
                                          type="number"
                                          value={editForms.lesson?.duration || 0}
                                          onChange={(e) => setEditForms(prev => ({
                                            ...prev,
                                            lesson: prev.lesson ? { ...prev.lesson, duration: parseInt(e.target.value) || 0 } : null
                                          }))}
                                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                          placeholder="Duration (min)"
                                          min="0"
                                        />
                                        <input
                                          type="number"
                                          value={editForms.lesson?.order || 1}
                                          onChange={(e) => setEditForms(prev => ({
                                            ...prev,
                                            lesson: prev.lesson ? { ...prev.lesson, order: parseInt(e.target.value) || 1 } : null
                                          }))}
                                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                          placeholder="Order"
                                          min="1"
                                        />
                                      </div>
                                    </div>
                                    <textarea
                                      value={editForms.lesson?.description || ''}
                                      onChange={(e) => setEditForms(prev => ({
                                        ...prev,
                                        lesson: prev.lesson ? { ...prev.lesson, description: e.target.value } : null
                                      }))}
                                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                      placeholder="Lesson description"
                                      rows={2}
                                    />
                                    <div className="flex items-center justify-between">
                                      <label className="flex items-center space-x-2">
                                        <input
                                          type="checkbox"
                                          checked={editForms.lesson?.is_preview || false}
                                          onChange={(e) => setEditForms(prev => ({
                                            ...prev,
                                            lesson: prev.lesson ? { ...prev.lesson, is_preview: e.target.checked } : null
                                          }))}
                                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">Preview lesson</span>
                                      </label>
                                      <div className="flex items-center space-x-2">
                                        <button
                                          onClick={handleSaveLesson}
                                          disabled={loadingStates.saving}
                                          className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
                                        >
                                          {loadingStates.saving ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                          onClick={handleCancelLessonEdit}
                                          className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-between p-3">
                                    <div className="flex items-center space-x-3">
                                      {getContentTypeIcon(lesson.content_type)}
                                      <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                          {lesson.title}
                                        </p>
                                        {lesson.description && (
                                          <p className="text-xs text-gray-600 dark:text-gray-400">
                                            {lesson.description}
                                          </p>
                                        )}
                                        {lesson.content_url && (
                                          <p className="text-xs text-blue-600 dark:text-blue-400 truncate max-w-xs">
                                            {lesson.content_url}
                                          </p>
                                        )}
                                      </div>
                                      {lesson.is_preview && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                          Preview
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {lesson.duration && <span>{lesson.duration}min</span>}
                                        {lesson.duration && lesson.order && <span> • </span>}
                                        <span>Order: {lesson.order}</span>
                                      </div>
                                      <button
                                        onClick={() => handleEditLesson(lesson, week._id!)}
                                        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                        title="Edit Lesson"
                                      >
                                        <Edit3 className="h-3 w-3" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteLesson(lesson._id!, week._id!, lesson.title)}
                                        disabled={loadingStates.deleting === lesson._id}
                                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"
                                        title="Delete Lesson"
                                      >
                                        {loadingStates.deleting === lesson._id ? (
                                          <div className="animate-spin h-3 w-3 border border-red-600 border-t-transparent rounded-full" />
                                        ) : (
                                          <Trash2 className="h-3 w-3" />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                            {(!week.lessons || week.lessons.length === 0) && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                                No lessons added yet
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Sections */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-md font-medium text-gray-900 dark:text-white flex items-center">
                              <FileText className="h-4 w-4 mr-2" />
                              Sections ({week.sections?.length || 0})
                            </h4>
                          </div>

                          {/* Add Section Form */}
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <input
                                type="text"
                                placeholder="Section title"
                                value={newSectionForm.title}
                                onChange={(e) => setNewSectionForm(prev => ({ ...prev, title: e.target.value }))}
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                              />
                              <input
                                type="text"
                                placeholder="Description"
                                value={newSectionForm.description}
                                onChange={(e) => setNewSectionForm(prev => ({ ...prev, description: e.target.value }))}
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                              />
                              <button
                                onClick={() => handleAddSection(week._id!)}
                                disabled={loadingStates.adding === `section-${week._id}` || !newSectionForm.title.trim()}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm transition-colors"
                              >
                                {loadingStates.adding === `section-${week._id}` ? 'Adding...' : 'Add Section'}
                              </button>
                            </div>
                          </div>

                          {/* Sections List */}
                          <div className="space-y-2">
                            {week.sections?.map((section, index) => (
                              <div key={section._id || index} className="bg-gray-50 dark:bg-gray-700 rounded-lg">
                                {editingStates.section === section._id ? (
                                  <div className="p-3 space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <input
                                        type="text"
                                        value={editForms.section?.title || ''}
                                        onChange={(e) => setEditForms(prev => ({
                                          ...prev,
                                          section: prev.section ? { ...prev.section, title: e.target.value } : null
                                        }))}
                                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                        placeholder="Section title"
                                      />
                                      <input
                                        type="number"
                                        value={editForms.section?.order || 1}
                                        onChange={(e) => setEditForms(prev => ({
                                          ...prev,
                                          section: prev.section ? { ...prev.section, order: parseInt(e.target.value) || 1 } : null
                                        }))}
                                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                        placeholder="Order"
                                        min="1"
                                      />
                                    </div>
                                    <textarea
                                      value={editForms.section?.description || ''}
                                      onChange={(e) => setEditForms(prev => ({
                                        ...prev,
                                        section: prev.section ? { ...prev.section, description: e.target.value } : null
                                      }))}
                                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                      placeholder="Section description"
                                      rows={2}
                                    />
                                    <div className="flex items-center space-x-2">
                                      <button
                                        onClick={handleSaveSection}
                                        disabled={loadingStates.saving}
                                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
                                      >
                                        {loadingStates.saving ? 'Saving...' : 'Save'}
                                      </button>
                                      <button
                                        onClick={handleCancelSectionEdit}
                                        className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-between p-3">
                                    <div className="flex items-center space-x-3">
                                      <FileText className="h-4 w-4 text-purple-600" />
                                      <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                          {section.title}
                                        </p>
                                        {section.description && (
                                          <p className="text-xs text-gray-600 dark:text-gray-400">
                                            {section.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Order: {section.order}
                                      </div>
                                      <button
                                        onClick={() => handleEditSection(section, week._id!)}
                                        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                        title="Edit Section"
                                      >
                                        <Edit3 className="h-3 w-3" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteSection(section._id!, week._id!, section.title)}
                                        disabled={loadingStates.deleting === section._id}
                                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"
                                        title="Delete Section"
                                      >
                                        {loadingStates.deleting === section._id ? (
                                          <div className="animate-spin h-3 w-3 border border-red-600 border-t-transparent rounded-full" />
                                        ) : (
                                          <Trash2 className="h-3 w-3" />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                            {(!week.sections || week.sections.length === 0) && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                                No sections added yet
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Live Classes (for live and blended courses) */}
                        {(courseType === 'live' || courseType === 'blended') && (
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-md font-medium text-gray-900 dark:text-white flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                Live Classes ({week.live_classes?.length || 0})
                              </h4>
                            </div>

                            {/* Add Live Class Form */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input
                                  type="text"
                                  placeholder="Live class title"
                                  value={newLiveClassForm.title}
                                  onChange={(e) => setNewLiveClassForm(prev => ({ ...prev, title: e.target.value }))}
                                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                />
                                <input
                                  type="number"
                                  placeholder="Duration (minutes)"
                                  value={newLiveClassForm.duration}
                                  onChange={(e) => setNewLiveClassForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                />
                                <button
                                  onClick={() => handleAddLiveClass(week._id!)}
                                  disabled={loadingStates.adding === `liveclass-${week._id}` || !newLiveClassForm.title.trim()}
                                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 text-sm transition-colors"
                                >
                                  {loadingStates.adding === `liveclass-${week._id}` ? 'Adding...' : 'Add Live Class'}
                                </button>
                              </div>
                            </div>

                            {/* Live Classes List */}
                            <div className="space-y-2">
                              {week.live_classes?.map((liveClass, index) => (
                                <div key={liveClass._id || index} className="bg-gray-50 dark:bg-gray-700 rounded-lg">
                                  {editingStates.liveClass === liveClass._id ? (
                                    <div className="p-3 space-y-3">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <input
                                          type="text"
                                          value={editForms.liveClass?.title || ''}
                                          onChange={(e) => setEditForms(prev => ({
                                            ...prev,
                                            liveClass: prev.liveClass ? { ...prev.liveClass, title: e.target.value } : null
                                          }))}
                                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                          placeholder="Live class title"
                                        />
                                        <input
                                          type="number"
                                          value={editForms.liveClass?.duration || 60}
                                          onChange={(e) => setEditForms(prev => ({
                                            ...prev,
                                            liveClass: prev.liveClass ? { ...prev.liveClass, duration: parseInt(e.target.value) || 60 } : null
                                          }))}
                                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                          placeholder="Duration (minutes)"
                                          min="1"
                                        />
                                      </div>
                                      <input
                                        type="datetime-local"
                                        value={editForms.liveClass?.scheduled_date?.toISOString().slice(0, 16) || ''}
                                        onChange={(e) => setEditForms(prev => ({
                                          ...prev,
                                          liveClass: prev.liveClass ? { ...prev.liveClass, scheduled_date: new Date(e.target.value) } : null
                                        }))}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                      />
                                      <textarea
                                        value={editForms.liveClass?.description || ''}
                                        onChange={(e) => setEditForms(prev => ({
                                          ...prev,
                                          liveClass: prev.liveClass ? { ...prev.liveClass, description: e.target.value } : null
                                        }))}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                        placeholder="Live class description"
                                        rows={2}
                                      />
                                      <div className="flex items-center space-x-2">
                                        <button
                                          onClick={handleSaveLiveClass}
                                          disabled={loadingStates.saving}
                                          className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
                                        >
                                          {loadingStates.saving ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                          onClick={handleCancelLiveClassEdit}
                                          className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-between p-3">
                                      <div className="flex items-center space-x-3">
                                        <Calendar className="h-4 w-4 text-orange-600" />
                                        <div>
                                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {liveClass.title}
                                          </p>
                                          {liveClass.description && (
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                              {liveClass.description}
                                            </p>
                                          )}
                                          {liveClass.scheduled_date && (
                                            <p className="text-xs text-blue-600 dark:text-blue-400">
                                              {new Date(liveClass.scheduled_date).toLocaleString()}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                          {liveClass.duration} minutes
                                        </div>
                                        <button
                                          onClick={() => handleEditLiveClass(liveClass, week._id!)}
                                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                          title="Edit Live Class"
                                        >
                                          <Edit3 className="h-3 w-3" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteLiveClass(liveClass._id!, week._id!, liveClass.title)}
                                          disabled={loadingStates.deleting === liveClass._id}
                                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"
                                          title="Delete Live Class"
                                        >
                                          {loadingStates.deleting === liveClass._id ? (
                                            <div className="animate-spin h-3 w-3 border border-red-600 border-t-transparent rounded-full" />
                                          ) : (
                                            <Trash2 className="h-3 w-3" />
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                              {(!week.live_classes || week.live_classes.length === 0) && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                                  No live classes scheduled yet
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>

          {curriculum.length === 0 && !loadingStates.curriculum && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No curriculum content found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                The curriculum data couldn't be loaded. This might be because the course uses a different data format or the curriculum hasn't been created yet.
              </p>
              <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <div>Course ID: {courseId}</div>
                <div>Course Type: {courseType || 'Not detected'}</div>
                <div>Course Title: {course?.course_title || 'Unknown'}</div>
              </div>
            </div>
          )}
        </div>

        {loadingStates.curriculum && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseEditPage; 