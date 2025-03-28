import { useState, useEffect, useCallback } from 'react';
import { apiUrls } from '@/apis';
import useGetQuery from './getQuery.hook';
import { toast } from 'react-toastify';

// ----------------------
// Type Definitions
// ----------------------

interface CourseWeek {
  id?: string;
  _id?: string;
  weekTitle: string;
  weekDescription?: string;
  sections?: CourseSection[];
  lessons?: LessonData[];
  topics?: string[];
  liveClasses?: any[];
  createdAt?: string;
  updatedAt?: string;
}

interface CourseSection {
  id?: string;
  _id?: string;
  title: string;
  description?: string;
  order?: number;
  lessons: LessonData[];
  assignments?: AssignmentData[];
  quizzes?: QuizData[];
}

interface ResourceFile {
  title: string;
  description: string;
  fileUrl: string;
  filename: string;
  mimeType: string;
  size: number;
  url?: string;
}

export interface LessonData {
  id?: string;
  _id?: string;
  title: string;
  description?: string;
  order?: number;
  lessonType?: 'video' | 'quiz' | 'assessment';
  isPreview?: boolean;
  meta?: {
    presenter?: string | null;
    transcript?: string | null;
    time_limit?: number | null;
    passing_score?: number | null;
    due_date?: string | null;
    max_score?: number | null;
  };
  resources?: ResourceFile[];
  video_url?: string;
  videoUrl?: string;
  duration?: string | number;
  completed?: boolean;
  is_completed?: boolean;
  createdAt?: string;
  updatedAt?: string;
  weekTitle?: string;
  sectionTitle?: string;
}

interface CoursePrice {
  _id?: { $oid: string } | string;
  currency: string;
  individual: number;
  batch: number;
  min_batch_size: number;
  max_batch_size: number;
  early_bird_discount: number;
  group_discount: number;
  is_active: boolean;
}

interface CourseMeta {
  views: number;
  ratings?: {
    average: number;
    count: number;
  };
  enrollments?: number;
  lastUpdated?: string;
}

interface MongoDBDate {
  $date: string;
}

export interface CourseData {
  _id: string | { $oid: string };
  course_category: string;
  course_title: string;
  course_tag?: string;
  no_of_Sessions: number;
  course_duration: string;
  session_duration: string;
  course_description: string | {
    program_overview?: string;
    benefits?: string;
  };
  category: string;
  course_fee: number;
  prices: CoursePrice[];
  course_videos: string[];
  brochures: string[];
  status: string;
  isFree: boolean;
  assigned_instructor?: { $oid: string };
  specifications?: any;
  course_image: string;
  course_grade: string;
  resource_videos: string[];
  resource_pdfs: {
    title: string;
    url: string;
    description: string;
    size_mb?: number;
    pages?: number;
    upload_date?: string;
  }[];
  curriculum: CourseWeek[];
  faqs?: {
    question: string;
    answer: string;
  }[];
  tools_technologies?: {
    name: string;
    category: string;
    description: string;
    logo_url: string;
  }[];
  bonus_modules?: {
    title: string;
    description: string;
    resources: {
      title: string;
      type: string;
      url: string;
      description: string;
    }[];
  }[];
  recorded_videos: string[];
  efforts_per_Week: string;
  class_type: string;
  is_Certification: string;
  is_Assignments: string;
  is_Projects: string;
  is_Quizes: string;
  related_courses: string[];
  min_hours_per_week?: number;
  max_hours_per_week?: number;
  category_type?: string;
  meta: CourseMeta;
  createdAt?: MongoDBDate;
  updatedAt?: MongoDBDate;
  unique_key?: string;
  __v?: number;
}

interface ApiResponse {
  success: boolean;
  data: CourseData;
}

export interface AssignmentData {
  email: string;
  content: string;
  files?: File[];
}

export interface CompletionData {
  completed_at: string;
  duration?: number;
}

export interface QuizData {
  answers: Record<string, any>;
  duration?: number;
  score?: number;
}

// ----------------------
// Helper Functions
// ----------------------

// Normalize MongoDB ObjectId to string
const normalizeObjectId = (id: string | { $oid: string }): string => {
  if (typeof id === 'string') return id;
  return id.$oid;
};

// Normalize course description to handle both string and object formats
const normalizeCourseDescription = (description: string | { program_overview?: string; benefits?: string }): {
  program_overview: string;
  benefits: string;
} => {
  if (typeof description === 'string') {
    return {
      program_overview: description,
      benefits: description
    };
  }
  return {
    program_overview: description.program_overview || '',
    benefits: description.benefits || ''
  };
};

// Normalize course data to ensure consistent format
const normalizeCourseData = (data: CourseData): CourseData => {
  return {
    ...data,
    _id: normalizeObjectId(data._id),
    course_description: normalizeCourseDescription(data.course_description),
    curriculum: data.curriculum || [],
    prices: data.prices?.map(price => ({
      ...price,
      _id: price._id ? normalizeObjectId(price._id) : undefined
    })) || [],
    meta: {
      views: data.meta?.views || 0,
      ratings: data.meta?.ratings || { average: 0, count: 0 },
      enrollments: data.meta?.enrollments || 0,
      lastUpdated: data.meta?.lastUpdated || data.updatedAt?.$date || new Date().toISOString()
    }
  };
};

// Update findLessonInCurriculum function to handle both section and lesson IDs
const findLessonInCurriculum = (
  curriculum: CourseWeek[],
  targetId: string
): LessonData | undefined => {
  if (!targetId) return undefined;

  console.log('Finding content with ID:', targetId);
  
  for (const week of curriculum) {
    // First check if the week has this ID
    if (week._id === targetId || week.id === targetId) {
      console.log('Found matching week:', week);
      // If week has direct lessons, return the first one
      const weekLessons = week.lessons || [];
      if (weekLessons.length > 0) {
        const firstLesson = weekLessons[0];
        return {
          ...firstLesson,
          weekTitle: week.weekTitle,
          sectionTitle: week.weekTitle
        };
      }
    }

    // Check direct lessons in the week
    const weekLessons = week.lessons || [];
    for (const lesson of weekLessons) {
      if (lesson._id === targetId || lesson.id === targetId) {
        console.log('Found lesson in week:', lesson);
        return {
          ...lesson,
          weekTitle: week.weekTitle,
          sectionTitle: week.weekTitle
        };
      }
    }

    // Check sections
    const sections = week.sections || [];
    for (const section of sections) {
      // Check if this is the target section
      if (section._id === targetId || section.id === targetId) {
        console.log('Found matching section:', section);
        // If section has lessons, return the first one
        const sectionLessons = section.lessons || [];
        if (sectionLessons.length > 0) {
          const firstLesson = sectionLessons[0];
          return {
            ...firstLesson,
            weekTitle: week.weekTitle,
            sectionTitle: section.title
          };
        }
      }

      // Check lessons within the section
      const sectionLessons = section.lessons || [];
      for (const lesson of sectionLessons) {
        if (lesson._id === targetId || lesson.id === targetId) {
          console.log('Found lesson in section:', lesson);
          return {
            ...lesson,
            weekTitle: week.weekTitle,
            sectionTitle: section.title
          };
        }
      }
    }
  }

  console.log('No matching content found in curriculum');
  return undefined;
};

// Ensures resources have the expected url property for compatibility
const normalizeResources = (resources: ResourceFile[] | undefined): ResourceFile[] | undefined => {
  if (!resources) return undefined;
  
  return resources.map(resource => ({
    ...resource,
    url: resource.url || resource.fileUrl
  }));
};

// Update processCurriculumData function to handle the API response structure
const processCurriculumData = (curriculum: CourseWeek[]): CourseWeek[] => {
  if (!curriculum) return [];
  
  return curriculum.map(week => {
    // Process direct lessons
    const processedLessons = (week.lessons || []).map(lesson => ({
      ...lesson,
      id: lesson.id || lesson._id,
      lessonType: lesson.lessonType || 'video', // Default to video if not specified
      completed: lesson.is_completed || lesson.completed,
      resources: normalizeResources(lesson.resources)
    }));

    // Process sections and their lessons
    const processedSections = (week.sections || []).map(section => ({
      ...section,
      id: section.id || section._id,
      lessons: (section.lessons || []).map(lesson => ({
        ...lesson,
        id: lesson.id || lesson._id,
        lessonType: lesson.lessonType || 'video', // Default to video if not specified
        completed: lesson.is_completed || lesson.completed,
        resources: normalizeResources(lesson.resources)
      }))
    }));

    return {
      ...week,
      id: week.id || week._id,
      lessons: processedLessons,
      sections: processedSections
    };
  });
};

// Update hasLessons check to handle the API response structure
const hasLessonsInCurriculum = (curriculum: CourseWeek[]): boolean => {
  return curriculum.some(week => {
    const hasWeekLessons = Array.isArray(week.lessons) && week.lessons.length > 0;
    const hasSectionLessons = Array.isArray(week.sections) && 
      week.sections.some(section => 
        Array.isArray(section.lessons) && section.lessons.length > 0
      );
    return hasWeekLessons || hasSectionLessons;
  });
};

// ----------------------
// Main Hook
// ----------------------

export const useCourseLesson = (courseId: string, lessonId: string = '') => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [getLoading, setGetLoading] = useState<boolean>(false);
  const [postLoading, setPostLoading] = useState<boolean>(false);

  const { getQuery } = useGetQuery();

  // Increment retry count and reset error/loading states
  const handleRetry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
    setError(null);
    setLoading(true);
  }, []);

  // Retrieve auth token from local storage
  const getAuthToken = useCallback((): string => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication Required');
      }
      return token;
    }
    return '';
  }, []);

  // Centralized API error handling
  const handleApiError = useCallback((error: any): Error => {
    console.error("API Error:", error);
    if (error.message === 'Network Error' || (!error.response && !error.success)) {
      return new Error('Network Error: Please check your internet connection');
    }
    const statusMessages: Record<number, string> = {
      401: 'Session Expired: Please log in again to continue',
      403: "Access Denied: You don't have permission to access this content",
      404: 'Content Not Found: The requested lesson could not be found',
      500: 'Server Error: Our servers are experiencing issues. Please try again later'
    };
    const status = error.response?.status;
    const message =
      (status && statusMessages[status]) ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return new Error(message);
  }, []);

  // Mark the current lesson as complete
  const markLessonComplete = useCallback(async (completionData: CompletionData): Promise<boolean> => {
    if (!lessonId) {
      toast.error('No lesson selected to mark as complete');
      return false;
    }
    
    try {
      setPostLoading(true);
      const token = getAuthToken();
      const headers = {
        'x-access-token': token,
        'Content-Type': 'application/json'
      };

      const response = await getQuery({
        url: apiUrls.courses.markLessonComplete(courseId, lessonId),
        config: { method: 'POST', headers, data: completionData }
      });

      if (response?.success) {
        setLessonData((prev) => prev ? { ...prev, is_completed: true, completed: true, completion_date: completionData.completed_at } : prev);
        
        // Also update the course curriculum data to reflect the completion
        setCourseData(prevCourseData => {
          if (!prevCourseData) return null;
          
          const updatedCurriculum = prevCourseData.curriculum.map(week => ({
            ...week,
            // Update lessons in the week if they exist
            lessons: week.lessons?.map(lesson => 
              (lesson._id === lessonId || lesson.id === lessonId) 
                ? { ...lesson, is_completed: true, completed: true, completion_date: completionData.completed_at }
                : lesson
            ),
            // Update lessons in sections if they exist
            sections: week.sections?.map(section => ({
              ...section,
              lessons: section.lessons.map(lesson => 
                (lesson._id === lessonId || lesson.id === lessonId) 
                  ? { ...lesson, is_completed: true, completed: true, completion_date: completionData.completed_at }
                  : lesson
              )
            }))
          }));
          
          return {
            ...prevCourseData,
            curriculum: updatedCurriculum
          };
        });
        
        toast.success('Lesson marked as complete!');
        return true;
      }
      throw new Error("Failed to mark lesson as complete");
    } catch (err: any) {
      const processedError = handleApiError(err);
      toast.error(processedError.message);
      throw processedError;
    } finally {
      setPostLoading(false);
    }
  }, [apiUrls, courseId, lessonId, getQuery, getAuthToken, handleApiError]);

  // Submit assignment data
  const submitAssignment = useCallback(async (assignmentData: AssignmentData) => {
    if (!lessonId) {
      toast.error('No lesson selected to submit assignment');
      return false;
    }
    
    try {
      setPostLoading(true);
      const token = getAuthToken();
      const headers = {
        'x-access-token': token,
        'Content-Type': 'multipart/form-data'
      };
      const formData = new FormData();
      formData.append('email', assignmentData.email);
      formData.append('content', assignmentData.content);
      if (assignmentData.files) {
        assignmentData.files.forEach(file => formData.append('files', file));
      }
      const response = await getQuery({
        url: apiUrls.courses.submitAssignment(courseId, lessonId),
        config: { method: 'POST', headers, data: formData }
      });
      if (response?.success) {
        toast.success("Assignment submitted successfully!");
        return response.data;
      }
      throw new Error("Failed to submit assignment");
    } catch (err: any) {
      const processedError = handleApiError(err);
      toast.error(processedError.message);
      throw processedError;
    } finally {
      setPostLoading(false);
    }
  }, [apiUrls, courseId, lessonId, getQuery, getAuthToken, handleApiError]);

  // Submit quiz data
  const submitQuiz = useCallback(async (quizData: QuizData) => {
    if (!lessonId) {
      toast.error('No lesson selected to submit quiz');
      return false;
    }
    
    try {
      setPostLoading(true);
      const token = getAuthToken();
      const headers = {
        'x-access-token': token,
        'Content-Type': 'application/json'
      };
      const response = await getQuery({
        url: apiUrls.courses.submitQuiz(courseId, lessonId),
        config: { method: 'POST', headers, data: quizData }
      });
      if (response?.success) {
        toast.success("Quiz submitted successfully!");
        return response.data;
      }
      throw new Error("Failed to submit quiz");
    } catch (err: any) {
      const processedError = handleApiError(err);
      toast.error(processedError.message);
      throw processedError;
    } finally {
      setPostLoading(false);
    }
  }, [apiUrls, courseId, lessonId, getQuery, getAuthToken, handleApiError]);

  // Fetch course data and extract the current lesson from the curriculum
  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) return;
      
      try {
        setLoading(true);
        setGetLoading(true);
        setError(null);

        const token = getAuthToken();
        const headers = {
          'x-access-token': token,
          'Content-Type': 'application/json'
        };

        const studentId = localStorage.getItem('studentId') || '';

        const response: ApiResponse = await getQuery({
          url: apiUrls.courses.getCourseById(courseId, studentId),
          config: { headers }
        });

        if (response?.success && response.data) {
          const normalizedData = normalizeCourseData(response.data);
          const processedData = {
            ...normalizedData,
            curriculum: processCurriculumData(normalizedData.curriculum)
          };
          
          setCourseData(processedData);
          
          if (lessonId) {
            console.log('Searching for lesson:', lessonId);
            console.log('Curriculum structure:', JSON.stringify(processedData.curriculum, null, 2));
            
            const currentLesson = findLessonInCurriculum(processedData.curriculum, lessonId);
            
            console.log('Found lesson:', currentLesson);
            
            if (currentLesson) {
              currentLesson.resources = normalizeResources(currentLesson.resources);
              setLessonData(currentLesson);
            } else {
              if (!hasLessonsInCurriculum(processedData.curriculum)) {
                throw new Error('No lessons found in this course. The course curriculum may be empty.');
              } else {
                throw new Error(`Lesson with ID ${lessonId} not found in this course. Please check the lesson ID and try again.`);
              }
            }
          }
        } else {
          throw new Error('Invalid server response');
        }
      } catch (err: any) {
        const processedError = handleApiError(err);
        setError(processedError);
        toast.error(processedError.message);
      } finally {
        setLoading(false);
        setGetLoading(false);
      }
    };

    fetchData();
  }, [courseId, lessonId, retryCount, getQuery, getAuthToken, handleApiError]);

  return {
    loading,
    error,
    courseData,
    lessonData,
    handleRetry,
    markLessonComplete,
    submitAssignment,
    submitQuiz,
    getLoading,
    postLoading,
  };
};

export default useCourseLesson;